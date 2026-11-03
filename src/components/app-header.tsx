import Link from "next/link";
import { Suspense } from "react";

import { logout } from "@/app/actions/auth";
import { requireUser } from "@/lib/session";

import { Logo } from "./logo";

const NAV = [
  { href: "/planner", label: "Planner" },
  { href: "#", label: "Today" },
  { href: "#", label: "Review" },
];

export function AppHeader({ active }: { active: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 py-3.5 sm:px-8">
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-2.5 font-bold">
          <Logo />
          Personal Growth
        </div>
        <nav aria-label="Main" className="flex gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.label === active
                  ? "rounded-lg bg-indigo-50 px-3 py-2 font-semibold text-indigo-900"
                  : "rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action={logout} className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold"
        >
          <Suspense>
            <UserInitial />
          </Suspense>
        </span>
        <button type="submit" className="text-sm text-zinc-600 hover:text-zinc-900">
          Sign out
        </button>
      </form>
    </header>
  );
}

async function UserInitial() {
  const user = await requireUser();
  return (user.name ?? user.email).charAt(0).toUpperCase();
}
