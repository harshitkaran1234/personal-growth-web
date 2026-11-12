import type { Metadata } from "next";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import type { PlannerState } from "@/lib/planner";
import { authedJson } from "@/lib/session";

import { PlannerView } from "./planner-view";

export const metadata: Metadata = { title: "Planner · Personal Growth" };

export default function PlannerPage() {
  return (
    <>
      <AppHeader active="Planner" />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-6 sm:px-8">
        <Suspense fallback={<p className="text-sm text-zinc-600">Loading your planner…</p>}>
          <Planner />
        </Suspense>
      </main>
    </>
  );
}

async function Planner() {
  const state = await authedJson<PlannerState>("/v1/planner");
  return <PlannerView initial={state} />;
}
