"use client";

import { useActionState } from "react";
import { submitWholesale } from "@/app/actions/wholesale";

const labels = {
  fa: {
    businessName: "نام کافه یا شرکت",
    weeklyUsage: "مصرف تقریبی هفتگی",
    details: "نوع دستگاه، منو، شهر و نیاز اصلی",
    submit: "ثبت درخواست عمده",
    submitting: "در حال ارسال...",
    success: "درخواست شما با موفقیت ثبت شد.",
  },
  en: {
    businessName: "Cafe or company name",
    weeklyUsage: "Approximate weekly usage",
    details: "Machine type, menu, city, and main need",
    submit: "Submit wholesale request",
    submitting: "Submitting...",
    success: "Your wholesale request was submitted successfully.",
  },
};

export function WholesaleForm({ locale = "fa" }: { locale?: "fa" | "en" }) {
  const [state, formAction, isPending] = useActionState(submitWholesale, { error: undefined as string | undefined, success: undefined as boolean | undefined });
  const t = labels[locale];

  if (state?.success) {
    return (
      <div className="border border-ink bg-warm-paper p-5">
        <p className="text-lg font-bold">{t.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 border border-ink p-5">
      {state?.error && (
        <div className="border border-danger bg-danger/10 p-3 text-sm text-danger">{state.error}</div>
      )}
      <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" name="businessName" placeholder={t.businessName} required />
      <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" name="weeklyUsage" placeholder={t.weeklyUsage} required />
      <textarea className="min-h-32 border border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-coffee" name="details" placeholder={t.details} required minLength={10} />
      <button type="submit" disabled={isPending} className="min-h-12 border border-ink bg-ink font-bold text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50">
        {isPending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
