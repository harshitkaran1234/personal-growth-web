import type { Metadata } from "next";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Planner · Personal Growth" };

export default function PlannerPage() {
  return (
    <>
      <AppHeader active="Planner" />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <Suspense fallback={<p className="text-sm text-zinc-600">Loading…</p>}>
            <SignedInAs />
          </Suspense>
        </div>
      </main>
    </>
  );
}

async function SignedInAs() {
  const user = await requireUser();
  return (
    <>
      <p className="font-semibold">Signed in as {user.email}</p>
      <p className="mt-1 text-sm text-zinc-600">The planner screen comes in the next step.</p>
    </>
  );
}
