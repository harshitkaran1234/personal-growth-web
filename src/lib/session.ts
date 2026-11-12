import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";

import { BackendError, backendJson } from "./backend";

export type User = {
  id: string;
  email: string;
  name: string | null;
  reminder_time: string;
  review_day: string;
  is_onboarded: boolean;
};

export async function authedJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await backendJson<T>(path, init);
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) redirect("/logout");
    throw error;
  }
}

export const requireUser = cache(() => authedJson<User>("/v1/user/me"));
