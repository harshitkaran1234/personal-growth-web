"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BackendError, SESSION_COOKIE, backendJson } from "@/lib/backend";

export type LoginState = {
  step: "email" | "code";
  email: string;
  error?: string;
};

type OtpResponse = { email: string; expires_at: number; retry_after: number };
type ValidateResponse = { access_token: string; is_new_user: boolean };

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  if (formData.get("intent") === "back") return { step: "email", email: state.email };
  if (state.step === "email") return requestCode(String(formData.get("email") ?? "").trim());
  return verifyCode(state.email, String(formData.get("otp") ?? "").trim());
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

async function requestCode(email: string): Promise<LoginState> {
  try {
    const result = await backendJson<OtpResponse>("/v1/auth/email/otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return { step: "code", email: result.email };
  } catch (error) {
    return { step: "email", email, error: messageOf(error) };
  }
}

async function verifyCode(email: string, otp: string): Promise<LoginState> {
  let token: string;
  try {
    const result = await backendJson<ValidateResponse>("/v1/auth/email/otp/validate", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
    token = result.access_token;
  } catch (error) {
    return { step: "code", email, error: messageOf(error) };
  }
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: tokenExpiry(token),
  });
  redirect("/planner");
}

function tokenExpiry(token: string): Date {
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  return new Date(payload.expires_at * 1000);
}

function messageOf(error: unknown): string {
  return error instanceof BackendError ? error.message : "Could not reach the server.";
}
