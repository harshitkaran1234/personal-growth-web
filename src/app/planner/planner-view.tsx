"use client";

import { useOptimistic, useState, useTransition } from "react";

import { confirmPlan, sendMessage } from "@/app/actions/planner";
import type { PlannerState } from "@/lib/planner";

import { ChatPanel, type ChatItem } from "./chat-panel";
import { PlanPanel, type PlanTab } from "./plan-panel";

export function PlannerView({ initial }: { initial: PlannerState }) {
  const [items, setItems] = useState<ChatItem[]>(initial.messages);
  const [shownItems, addShownItem] = useOptimistic(items, (state, item: ChatItem) => [
    ...state,
    item,
  ]);
  const [currentPlan, setCurrentPlan] = useState(initial.current_plan);
  const [pendingPlan, setPendingPlan] = useState(initial.pending_plan);
  const [tab, setTab] = useState<PlanTab>(initial.pending_plan ? "proposed" : "current");
  const [draft, setDraft] = useState("");
  const [chatError, setChatError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [sending, startSending] = useTransition();
  const [confirming, startConfirming] = useTransition();
  const busy = sending || confirming;

  function send(message: string) {
    setDraft("");
    setChatError(undefined);
    startSending(async () => {
      const userItem: ChatItem = { role: "user", content: message };
      addShownItem(userItem);
      const result = await sendMessage(message);
      if (result.error !== undefined) {
        setChatError(result.error);
        setDraft(message);
        return;
      }
      const { reply, pending_plan, plan_presented } = result.data;
      const added: ChatItem[] = [userItem, { role: "assistant", content: reply }];
      if (plan_presented && pending_plan) {
        added.push({
          role: "event",
          content: `New plan version ${pending_plan.version} is on the right`,
        });
        setTab("proposed");
      }
      setItems((previous) => [...previous, ...added]);
      setPendingPlan(pending_plan);
    });
  }

  function confirm(version: number) {
    setConfirmError(undefined);
    startConfirming(async () => {
      const result = await confirmPlan(version);
      if (result.error !== undefined) {
        setConfirmError(result.error);
        return;
      }
      setItems((previous) => [...previous, { role: "assistant", content: result.data.message }]);
      setCurrentPlan(result.data.current_plan);
      setPendingPlan(null);
      setTab("current");
    });
  }

  return (
    <div className="flex flex-1 flex-wrap gap-6">
      <ChatPanel
        items={shownItems}
        sending={sending}
        busy={busy}
        error={chatError}
        draft={draft}
        onDraftChange={setDraft}
        onSend={send}
      />
      <PlanPanel
        currentPlan={currentPlan}
        pendingPlan={pendingPlan}
        tab={tab}
        onTabChange={setTab}
        busy={busy}
        confirming={confirming}
        error={confirmError}
        onConfirm={confirm}
      />
    </div>
  );
}
