"use client";

import { useActionState } from "react";
import { submitAdminLogin } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(submitAdminLogin, { error: undefined as string | undefined });

  return (
    <form action={formAction} className="grid gap-4 border border-ink p-5">
      {state.error && (
        <div className="border border-danger bg-danger/10 p-3 text-sm font-bold text-danger">
          {state.error}
        </div>
      )}
      <input
        className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee"
        name="email"
        type="email"
        placeholder="admin@example.com"
        autoComplete="username"
        required
      />
      <input
        className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee"
        name="password"
        type="password"
        placeholder="Admin password"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
