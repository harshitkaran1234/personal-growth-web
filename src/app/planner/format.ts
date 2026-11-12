import type { Goal, Weekday } from "@/lib/planner";

const WEEKDAYS: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const TYPES: Record<Goal["type"], string> = {
  habit: "Habit",
  learning: "Learning",
  project: "Project",
};

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function weekdayName(day: Weekday): string {
  return WEEKDAYS[day];
}

export function describeGoal(goal: Goal, minutes: number): string {
  const time = minutes ? `${formatMinutes(minutes)}/week` : "no extra time";
  return [TYPES[goal.type], describeCommitment(goal.commitment), time].join(" · ");
}

function describeCommitment(commitment: Goal["commitment"]): string {
  if (commitment.kind === "avoid") {
    const often = commitment.period === "day" ? "every day" : `${commitment.target} days a week`;
    return `${commitment.rule}, ${often}`;
  }
  const length = commitment.minutes ? ` (${commitment.minutes} min)` : "";
  return `${commitment.target} ${commitment.unit} a ${commitment.period} as ${commitment.sessions} × ${commitment.session}${length}`;
}
