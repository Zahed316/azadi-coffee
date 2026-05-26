"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { PayButton } from "./PayButton";

type Props = {
  orderId: string;
  locale?: Locale;
};

const statusConfig: Record<string, { fa: { title: string; text: string }; en: { title: string; text: string } }> = {
  success: {
    fa: { title: "پرداخت با موفقیت انجام شد", text: "سفارش شما تایید شد. شماره پیگیری سفارش:" },
    en: { title: "Payment successful", text: "Your order has been confirmed. Order number:" },
  },
  failed: {
    fa: { title: "پرداخت ناموفق", text: "پرداخت انجام نشد. لطفا دوباره تلاش کنید یا روش پرداخت دیگری انتخاب کنید." },
    en: { title: "Payment failed", text: "Payment was not completed. Please try again or choose another payment method." },
  },
  pending: {
    fa: { title: "در انتظار پرداخت", text: "سفارش شما ثبت شد. برای ادامه روی دکمه زیر کلیک کنید." },
    en: { title: "Pending payment", text: "Your order has been created. Click below to proceed with payment." },
  },
  error: {
    fa: { title: "خطا در پردازش", text: "مشکلی در پردازش سفارش پیش آمد. لطفا با پشتیبانی تماس بگیرید." },
    en: { title: "Processing error", text: "Something went wrong processing your order. Please contact support." },
  },
};

export function OrderStatus({ orderId, locale = "fa" }: Props) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "pending";
  const config = statusConfig[status] || statusConfig.pending;
  const content = locale === "en" ? config.en : config.fa;

  return (
    <section className="container-shell py-12">
      <div className="max-w-2xl border border-ink p-6">
        <p className="text-sm font-bold text-stone">
          Order / {locale === "en" ? "Payment result" : "نتیجه پرداخت"}
        </p>
        <h1 className="mt-3 text-4xl font-bold">{content.title}</h1>
        <p className="mt-5 leading-8 text-stone">
          {content.text}{" "}
          <span className="font-mono text-ink">{orderId}</span>
        </p>

        {status === "failed" && (
          <Link
            href={locale === "en" ? "/en/checkout" : "/checkout"}
            className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
          >
            {locale === "en" ? "Return to checkout" : "بازگشت به تسویه حساب"}
          </Link>
        )}

        {status === "success" && (
          <Link
            href={locale === "en" ? "/en/shop" : "/shop"}
            className="mt-6 inline-flex min-h-11 items-center border border-ink bg-ink px-5 font-bold text-paper transition hover:bg-paper hover:text-ink"
          >
            {locale === "en" ? "Continue shopping" : "ادامه خرید"}
          </Link>
        )}

        {status === "pending" && <PayButton orderId={orderId} locale={locale} />}
      </div>
    </section>
  );
}
