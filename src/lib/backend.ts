import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "pg_session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export class BackendError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export async function backendJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await backendFetch(path, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new BackendError(response.status, errorMessage(body));
  return body as T;
}

function errorMessage(body: unknown): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg);
  return "Something went wrong. Please try again.";
}
