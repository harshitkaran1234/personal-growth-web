"use client";

import type { Goal, GoalChange, PendingGoal, PendingPlan, Plan, Profile } from "@/lib/planner";

import { describeGoal, formatDate, formatMinutes, weekdayName } from "./format";

export type PlanTab = "proposed" | "current";

type Props = {
  currentPlan: Plan | null;
  pendingPlan: PendingPlan | null;
  tab: PlanTab;
  onTabChange: (tab: PlanTab) => void;
  busy: boolean;
  confirming: boolean;
  error?: string;
  onConfirm: (version: number) => void;
};

const CHANGE_STYLES: Record<
  GoalChange | "removed",
  { card: string; badge: string; label: string }
> = {
  new: {
    card: "border-blue-300 bg-blue-50",
    badge: "bg-blue-200 text-blue-900",
    label: "New",
  },
  changed: {
    card: "border-amber-300 bg-amber-50",
    badge: "bg-amber-200 text-amber-900",
    label: "Changed",
  },
  unchanged: {
    card: "border-zinc-200",
    badge: "bg-zinc-100 text-zinc-700",
    label: "Unchanged",
  },
  removed: { card: "", badge: "bg-red-100 text-red-900", label: "Removed" },
};

export function PlanPanel(props: Props) {
  const { currentPlan, pendingPlan, tab, onTabChange, busy, confirming, error, onConfirm } = props;
  const showPending = pendingPlan !== null && (tab === "proposed" || currentPlan === null);

  return (
    <aside
      aria-label="Plan"
      className="flex min-w-0 flex-[1_1_420px] flex-col gap-4 lg:max-w-[520px]"
    >
      {pendingPlan && currentPlan && (
        <div
          role="tablist"
          aria-label="Plan view"
          className="flex gap-1 rounded-xl bg-zinc-200/70 p-1"
        >
          <TabButton selected={showPending} onClick={() => onTabChange("proposed")}>
            Proposed · v{pendingPlan.version}
          </TabButton>
          <TabButton selected={!showPending} onClick={() => onTabChange("current")}>
            Current plan
          </TabButton>
        </div>
      )}

      {showPending ? (
        <>
          <PlanCard
            goals={pendingPlan.goals}
            removed={pendingPlan.removed}
            profile={pendingPlan.profile}
            profileChanged={currentPlan !== null && pendingPlan.profile_changed}
            totalMinutes={pendingPlan.weekly_load.total_minutes}
            goalMinutes={pendingPlan.weekly_load.goals.map((goal) => goal.minutes)}
            previousMinutes={currentPlan?.weekly_load.total_minutes}
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => onConfirm(pendingPlan.version)}
            className="rounded-xl bg-accent p-3.5 text-[15px] font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {confirming ? "Saving…" : "Confirm plan"}
          </button>
          <p className="text-center text-[13px] text-zinc-600">
            Not right? Tell the planner what to change.
          </p>
        </>
      ) : currentPlan ? (
        <PlanCard
          goals={currentPlan.goals}
          removed={[]}
          profile={currentPlan.profile}
          profileChanged={false}
          totalMinutes={currentPlan.weekly_load.total_minutes}
          goalMinutes={currentPlan.weekly_load.goals.map((goal) => goal.minutes)}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          Your plan will show up here once the planner proposes one.
        </div>
      )}
    </aside>
  );
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={
        selected
          ? "flex-1 rounded-[9px] bg-white p-2 text-sm font-semibold shadow-sm"
          : "flex-1 rounded-[9px] p-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      }
    >
      {children}
    </button>
  );
}

type PlanCardProps = {
  goals: (Goal | PendingGoal)[];
  removed: Goal[];
  profile: Profile;
  profileChanged: boolean;
  totalMinutes: number;
  goalMinutes: number[];
  previousMinutes?: number;
};

function PlanCard({
  goals,
  removed,
  profile,
  profileChanged,
  totalMinutes,
  goalMinutes,
  previousMinutes,
}: PlanCardProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold">Weekly time</h2>
        <p className="text-[22px] font-bold">
          {formatMinutes(totalMinutes)}
          {previousMinutes !== undefined && previousMinutes !== totalMinutes && (
            <span className="ml-1.5 text-[13px] font-medium text-zinc-600">
              was {formatMinutes(previousMinutes)}
            </span>
          )}
        </p>
      </div>

      {goals.map((goal, index) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          position={index + 1}
          minutes={goalMinutes[index] ?? 0}
          change={"change" in goal && previousMinutes !== undefined ? goal.change : undefined}
        />
      ))}

      {removed.map((goal) => (
        <article
          key={goal.id}
          className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3"
        >
          <p className="text-sm text-zinc-600 line-through">{goal.title}</p>
          <Badge change="removed" />
        </article>
      ))}

      <div className="flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-[13px] text-zinc-600">
        <p>
          {profile.name} · reminder {profile.reminder_time} · review on{" "}
          {weekdayName(profile.review_day)} · {profile.timezone}
        </p>
        {profileChanged && <Badge change="changed" />}
      </div>
    </div>
  );
}

function GoalItem({
  goal,
  position,
  minutes,
  change,
}: {
  goal: Goal;
  position: number;
  minutes: number;
  change?: GoalChange;
}) {
  const milestones = goal.milestones
    .map((milestone) =>
      milestone.due_date
        ? `${milestone.title} by ${formatDate(milestone.due_date)}`
        : milestone.title,
    )
    .join(" · ");

  return (
    <article
      className={`flex flex-col gap-1.5 rounded-xl border px-4 py-3.5 ${change ? CHANGE_STYLES[change].card : "border-zinc-200"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold">
          {position}. {goal.title}
        </h3>
        {change && <Badge change={change} />}
      </div>
      <p className="text-[13px] text-zinc-700">{describeGoal(goal, minutes)}</p>
      {goal.why && <p className="text-[13px] text-zinc-600">Why: {goal.why}</p>}
      {milestones && <p className="text-[13px] text-zinc-600">Milestones: {milestones}</p>}
      {goal.target_date && (
        <p className="text-[13px] text-zinc-600">Target: {formatDate(goal.target_date)}</p>
      )}
    </article>
  );
}

function Badge({ change }: { change: GoalChange | "removed" }) {
  const style = CHANGE_STYLES[change];
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
      {style.label}
    </span>
  );
}
