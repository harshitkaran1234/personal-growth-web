"use client";

import { useActionState } from "react";

import { type LoginState, login } from "@/app/actions/auth";

const initialState: LoginState = { step: "email", email: "" };

const inputClass =
  "rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-[15px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  const onCode = state.step === "code";

  return (
    <form action={action} className="flex flex-col gap-4">
      {onCode ? (
        <>
          <p className="text-sm text-zinc-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-zinc-900">{state.email}</span>.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Code
            </label>
            <input
              key="otp"
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              className={`${inputClass} text-center text-lg tracking-[0.4em]`}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            key="email"
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-accent py-3 text-[15px] font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? "Please wait…" : onCode ? "Sign in" : "Send code"}
      </button>
      {onCode && (
        <button
          type="submit"
          name="intent"
          value="back"
          formNoValidate
          className="text-sm text-accent hover:text-accent-dark"
        >
          Use a different email
        </button>
      )}
    </form>
  );
}
