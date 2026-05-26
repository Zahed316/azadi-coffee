"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import type { Locale } from "@/lib/i18n";

export function CheckoutForm({ locale = "fa" }: { locale?: Locale }) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  if (items.length === 0) {
    return (
      <div className="border border-ink p-5">
        <p className="leading-8 text-stone">
          {locale === "en" ? "Your cart is empty." : "سبد خرید شما خالی است."}
        </p>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (!phone.trim()) {
      setError(locale === "en" ? "Phone number is required." : "شماره تماس الزامی است.");
      setSubmitting(false);
      return;
    }

    if (!address.trim()) {
      setError(locale === "en" ? "Shipping address is required." : "آدرس ارسال الزامی است.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          address: address.trim(),
          paymentMethod: "zarinpal",
          items,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || (locale === "en" ? "Order creation failed." : "خطا در ثبت سفارش."));
      }

      clearCart();
      router.push(`${locale === "en" ? "/en" : ""}/order/${data.orderId}?status=pending`);
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === "en" ? "An error occurred." : "خطایی رخ داد."));
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="border border-danger bg-danger/10 p-4 text-sm font-bold text-danger">
          {error}
        </div>
      )}

      <div className="border border-ink p-5">
        <p className="mb-3 text-sm font-bold">{locale === "en" ? "Order summary" : "خلاصه سفارش"}</p>
        <div className="flex justify-between text-sm">
          <span>{locale === "en" ? `${total.toLocaleString()} toman` : `${total.toLocaleString("fa-IR")} تومان`}</span>
        </div>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold">
          {locale === "en" ? "Mobile number" : "شماره موبایل"}
        </span>
        <input
          className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee"
          placeholder={locale === "en" ? "+98 9xx xxx xxxx" : "09xxxxxxxxx"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          dir="ltr"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold">
          {locale === "en" ? "Shipping address" : "آدرس ارسال"}
        </span>
        <textarea
          className="min-h-28 border border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-coffee"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>

      <fieldset className="grid gap-3 border border-ink p-4">
        <legend className="px-2 text-sm font-bold">
          {locale === "en" ? "Payment gateway" : "درگاه پرداخت"}
        </legend>
        <label className="flex items-center justify-between gap-4">
          <span>{locale === "en" ? "Zarinpal" : "زرین پال"}</span>
          <input type="radio" name="gateway" value="zarinpal" checked readOnly />
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="min-h-12 border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {submitting
          ? (locale === "en" ? "Submitting..." : "در حال ثبت سفارش...")
          : (locale === "en" ? "Place order and continue to payment" : "ثبت سفارش و انتقال به پرداخت")}
      </button>
    </form>
  );
}
