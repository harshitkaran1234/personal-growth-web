"use client";

import { type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";

import type { ChatMessage } from "@/lib/planner";

export type ChatItem = ChatMessage | { role: "event"; content: string };

const GREETING =
  "Hi! Tell me what you want to work on, for example “learn system design in 3 months” or “run 10 km a week”.";

type Props = {
  items: ChatItem[];
  sending: boolean;
  busy: boolean;
  error?: string;
  draft: string;
  onDraftChange: (draft: string) => void;
  onSend: (message: string) => void;
};

export function ChatPanel({ items, sending, busy, error, draft, onDraftChange, onSend }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [items, sending]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (message && !busy) onSend(message);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <section
      aria-label="Chat"
      className="flex h-[calc(100dvh-7.5rem)] min-h-[520px] min-w-0 flex-[999_1_560px] flex-col rounded-2xl border border-zinc-200 bg-white"
    >
      <div className="border-b border-zinc-100 px-6 py-4">
        <h1 className="text-[15px] font-semibold">Goal planner</h1>
        <p className="text-[13px] text-zinc-600">Plan your goals, or change them anytime</p>
      </div>

      <div
        aria-live="polite"
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 text-[15px] leading-relaxed"
      >
        {items.length === 0 && <Bubble role="assistant">{GREETING}</Bubble>}
        {items.map((item, index) =>
          item.role === "event" ? (
            <EventChip key={index}>{item.content}</EventChip>
          ) : (
            <Bubble key={index} role={item.role}>
              {item.content}
            </Bubble>
          ),
        )}
        {sending && (
          <Bubble role="assistant">
            <span className="text-zinc-500">Thinking…</span>
          </Bubble>
        )}
      </div>

      {error && (
        <p role="alert" className="px-6 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={submit}
        className="flex items-end gap-3 border-t border-zinc-100 px-6 pt-4 pb-6"
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          rows={2}
          maxLength={2000}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Tell the planner what to change…"
          className="flex-1 resize-none rounded-xl border border-zinc-300 px-3.5 py-3 text-[15px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={busy || !draft.trim()}
          className="flex size-12 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-dark disabled:opacity-50"
        >
          <ArrowIcon size={20} />
        </button>
      </form>
    </section>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: ReactNode }) {
  return (
    <div
      className={
        role === "user"
          ? "max-w-[70%] self-end whitespace-pre-wrap rounded-[14px] rounded-tr-[4px] bg-accent px-4 py-3 text-white"
          : "max-w-[70%] self-start whitespace-pre-wrap rounded-[14px] rounded-tl-[4px] bg-zinc-100 px-4 py-3"
      }
    >
      {children}
    </div>
  );
}

function EventChip({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[13px] text-zinc-700">
      <span className="text-indigo-700">
        <ArrowIcon size={14} />
      </span>
      {children}
    </div>
  );
}

function ArrowIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
