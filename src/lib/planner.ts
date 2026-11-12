export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Milestone = {
  id: string;
  title: string;
  due_date: string | null;
  completed_at: number | null;
};

export type PracticeCommitment = {
  kind: "practice";
  period: "day" | "week";
  target: number;
  unit: string;
  sessions: number;
  session: string;
  minutes: number | null;
};

export type AvoidCommitment = {
  kind: "avoid";
  period: "day" | "week";
  rule: string;
  target: number;
};

export type Goal = {
  id: string;
  ref: string | null;
  title: string;
  why: string | null;
  type: "habit" | "learning" | "project";
  priority: number | null;
  commitment: PracticeCommitment | AvoidCommitment;
  target_date: string | null;
  milestones: Milestone[];
};

export type GoalChange = "new" | "changed" | "unchanged";

export type PendingGoal = Goal & { change: GoalChange };

export type Profile = {
  name: string;
  reminder_time: string;
  review_day: Weekday;
  timezone: string;
};

export type WeeklyLoad = {
  goals: { title: string; minutes: number }[];
  total_minutes: number;
};

export type Plan = {
  goals: Goal[];
  profile: Profile;
  weekly_load: WeeklyLoad;
};

export type PendingPlan = {
  version: number;
  goals: PendingGoal[];
  removed: Goal[];
  profile: Profile;
  profile_changed: boolean;
  weekly_load: WeeklyLoad;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type PlannerState = {
  messages: ChatMessage[];
  current_plan: Plan | null;
  pending_plan: PendingPlan | null;
  is_onboarded: boolean;
};

export type ChatResponse = {
  reply: string;
  pending_plan: PendingPlan | null;
  plan_presented: boolean;
};

export type ConfirmResponse = {
  current_plan: Plan;
  is_onboarded: boolean;
  message: string;
};
