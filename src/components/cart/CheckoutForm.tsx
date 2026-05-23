"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function CheckoutForm({ locale = "fa" }: { locale?: Locale }) {
  const [gateway, setGateway] = useState("zarinpal");
  const gateways = locale === "en"
    ? [
        ["zarinpal", "Zarinpal"],
        ["behpardakht", "Behpardakht Mellat"],
        ["idpay", "IDPay"],
      ]
    : [
        ["zarinpal", "زرین پال"],
        ["behpardakht", "به پرداخت ملت"],
        ["idpay", "آی دی پی"],
      ];

  return (
    <form className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-bold">{locale === "en" ? "Mobile number" : "شماره موبایل"}</span>
        <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" placeholder={locale === "en" ? "+98 9xx xxx xxxx" : "09xxxxxxxxx"} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold">{locale === "en" ? "Shipping address" : "آدرس ارسال"}</span>
        <textarea className="min-h-28 border border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-coffee" />
      </label>
      <fieldset className="grid gap-3 border border-ink p-4">
        <legend className="px-2 text-sm font-bold">{locale === "en" ? "Payment gateway" : "درگاه پرداخت"}</legend>
        {gateways.map(([id, label]) => (
          <label key={id} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <input type="radio" name="gateway" checked={gateway === id} onChange={() => setGateway(id)} />
          </label>
        ))}
      </fieldset>
      <button type="button" className="min-h-12 border border-ink bg-ink px-5 font-bold text-white hover:bg-paper hover:text-ink">
        {locale === "en" ? "Place order and continue to payment" : "ثبت سفارش و انتقال به پرداخت"}
      </button>
    </form>
  );
}
