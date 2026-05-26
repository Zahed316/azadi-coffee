"use client";

import { useActionState } from "react";
import { initiatePayment } from "@/app/actions/payment";
import type { Locale } from "@/lib/i18n";

type Props = {
  orderId: string;
  locale?: Locale;
};

export function PayButton({ orderId, locale = "fa" }: Props) {
  const [state, formAction, isPending] = useActionState(initiatePayment, { error: null as string | null });

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {isPending
          ? (locale === "en" ? "Redirecting to gateway..." : "در حال انتقال به درگاه...")
          : (locale === "en" ? "Proceed to payment" : "انتقال به درگاه پرداخت")}
      </button>
      {state?.error && (
        <p className="mt-3 text-sm text-danger">{state.error}</p>
      )}
    </form>
  );
}
