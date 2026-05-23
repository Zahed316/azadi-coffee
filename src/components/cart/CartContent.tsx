"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { formatToman } from "@/lib/format/currency";
import type { Locale } from "@/lib/i18n";

function CartItemRow({
  slug,
  name,
  nameEn,
  priceToman,
  quantity,
  locale,
}: {
  slug: string;
  name: string;
  nameEn: string;
  priceToman: number;
  quantity: number;
  locale: Locale;
}) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <article className="grid gap-5 border border-ink p-5 md:grid-cols-[120px_1fr_auto_auto]">
      <div className="aspect-square border border-ink bg-warm-paper" />
      <div>
        <h2 className="text-xl font-bold">{locale === "en" ? nameEn : name}</h2>
        <p className="mt-4 font-bold">{formatToman(priceToman, locale)}</p>
      </div>
      <div className="inline-flex h-11 items-center border border-ink self-center">
        <button
          type="button"
          className="h-full w-11 border-l border-ink"
          onClick={() => updateQuantity(slug, quantity - 1)}
          aria-label={locale === "en" ? "Decrease quantity" : "کم کردن تعداد"}
        >
          -
        </button>
        <output className="w-12 text-center font-mono">{quantity}</output>
        <button
          type="button"
          className="h-full w-11 border-r border-ink"
          onClick={() => updateQuantity(slug, quantity + 1)}
          aria-label={locale === "en" ? "Increase quantity" : "زیاد کردن تعداد"}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => removeItem(slug)}
        className="self-center border border-ink px-3 py-2 text-sm font-bold transition hover:bg-ink hover:text-paper"
        aria-label={locale === "en" ? "Remove item" : "حذف کالا"}
      >
        ✕
      </button>
    </article>
  );
}

export function CartContent({ locale = "fa" }: { locale?: Locale }) {
  const { items, total, count } = useCart();

  if (count === 0) {
    return (
      <section className="container-shell py-12">
        <h1 className="text-5xl font-bold">{locale === "en" ? "Cart" : "سبد خرید"}</h1>
        <p className="mt-8 leading-8 text-stone">
          {locale === "en" ? "Your cart is empty." : "سبد خرید شما خالی است."}
        </p>
        <Link
          href={locale === "en" ? "/en/shop" : "/shop"}
          className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
        >
          {locale === "en" ? "Browse coffee" : "مشاهده قهوه ها"}
        </Link>
      </section>
    );
  }

  return (
    <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-5xl font-bold">{locale === "en" ? "Cart" : "سبد خرید"}</h1>
        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <CartItemRow key={item.slug} {...item} locale={locale} />
          ))}
        </div>
      </div>
      <aside className="border border-ink p-5 lg:self-start">
        <h2 className="text-xl font-bold">{locale === "en" ? "Order summary" : "خلاصه سفارش"}</h2>
        <div className="mt-5 grid gap-3 border-t border-ink pt-5 text-sm">
          <div className="flex justify-between">
            <span>{locale === "en" ? "Subtotal" : "جمع جزء"}</span>
            <strong>{formatToman(total, locale)}</strong>
          </div>
          <div className="flex justify-between">
            <span>{locale === "en" ? "Shipping" : "ارسال"}</span>
            <span>{locale === "en" ? "Calculated at checkout" : "محاسبه در پرداخت"}</span>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href={locale === "en" ? "/en/checkout" : "/checkout"}
            className="flex min-h-11 w-full items-center justify-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
          >
            {locale === "en" ? "Continue to checkout" : "ادامه پرداخت"}
          </Link>
        </div>
      </aside>
    </section>
  );
}
