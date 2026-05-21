"use client";

import { useState } from "react";

export function CheckoutForm() {
  const [gateway, setGateway] = useState("zarinpal");

  return (
    <form className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-bold">شماره موبایل</span>
        <input className="min-h-12 border border-ink px-4 outline-none focus:ring-2 focus:ring-coffee" placeholder="09xxxxxxxxx" />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold">آدرس ارسال</span>
        <textarea className="min-h-28 border border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-coffee" />
      </label>
      <fieldset className="grid gap-3 border border-ink p-4">
        <legend className="px-2 text-sm font-bold">درگاه پرداخت</legend>
        {[
          ["zarinpal", "زرین پال"],
          ["behpardakht", "به پرداخت ملت"],
          ["idpay", "آی دی پی"],
        ].map(([id, label]) => (
          <label key={id} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <input type="radio" name="gateway" checked={gateway === id} onChange={() => setGateway(id)} />
          </label>
        ))}
      </fieldset>
      <button type="button" className="min-h-12 border border-ink bg-ink px-5 font-bold text-paper hover:bg-paper hover:text-ink">
        ثبت سفارش و انتقال به پرداخت
      </button>
    </form>
  );
}
