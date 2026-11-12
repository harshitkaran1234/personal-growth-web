"use server";

import { unstable_rethrow } from "next/navigation";

import { BackendError } from "@/lib/backend";
import type { ChatResponse, ConfirmResponse } from "@/lib/planner";
import { authedJson } from "@/lib/session";

export type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string };

export async function sendMessage(message: string): Promise<ActionResult<ChatResponse>> {
  return post<ChatResponse>("/v1/planner/chat", { message });
}

export async function confirmPlan(version: number): Promise<ActionResult<ConfirmResponse>> {
  return post<ConfirmResponse>("/v1/planner/confirm", { version });
}

async function post<T>(path: string, body: object): Promise<ActionResult<T>> {
  try {
    return {
      data: await authedJson<T>(path, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    };
  } catch (error) {
    unstable_rethrow(error);
    return {
      error: error instanceof BackendError ? error.message : "Could not reach the server.",
    };
  }
}
