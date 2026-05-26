"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";

const labels = {
  fa: {
    name: "نام",
    phone: "شماره تماس",
    message: "پیام",
    submit: "ارسال پیام",
    submitting: "در حال ارسال...",
    success: "پیام شما با موفقیت ارسال شد.",
  },
  en: {
    name: "Name",
    phone: "Phone number",
    message: "Message",
    submit: "Send message",
    submitting: "Sending...",
    success: "Your message was sent successfully.",
  },
};

export function ContactForm({ locale = "fa" }: { locale?: "fa" | "en" }) {
  const [state, formAction, isPending] = useActionState(submitContact, { error: undefined as string | undefined, success: undefined as boolean | undefined });
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
      <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" name="name" placeholder={t.name} required />
      <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" name="phone" placeholder={t.phone} required dir="ltr" />
      <textarea className="min-h-32 border border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-coffee" name="message" placeholder={t.message} required minLength={10} />
      <button type="submit" disabled={isPending} className="min-h-12 border border-ink bg-ink font-bold text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50">
        {isPending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
