"use client";

export default function PlannerError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center">
      <p className="font-semibold">Could not load your planner.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
      >
        Try again
      </button>
    </div>
  );
}
