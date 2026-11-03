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

export const requireUser = cache(async (): Promise<User> => {
  try {
    return await backendJson<User>("/v1/user/me");
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) redirect("/logout");
    throw error;
  }
});
