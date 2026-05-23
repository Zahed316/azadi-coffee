import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { LandingPageSettings } from "@/lib/theme-settings";

export function HeroSection({ locale = "fa", settings = {} }: { locale?: Locale; settings?: LandingPageSettings }) {
  const fallbackText =
    locale === "en"
      ? "A precise specialty coffee shop for fresh roasts, with a calm side-by-side page rhythm and product-first navigation."
      : "فروشگاه فارسی و راست چین برای قهوه تازه برشته، با ریتمی شبیه صفحات کنار هم: آرام، دقیق و محصول محور.";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
      <div>
        <p className="max-w-2xl text-lg leading-9 text-stone">
          {settings.heroText || fallbackText}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/shop")} className="inline-flex min-h-12 items-center border border-ink bg-ink px-5 py-3 font-bold text-white transition hover:bg-paper hover:text-ink">
            {settings.primaryCtaLabel || (locale === "en" ? "Shop coffee" : "خرید قهوه")}
          </Link>
          <Link href={localePath(locale, "/wholesale")} className="inline-flex min-h-12 items-center border border-ink px-5 py-3 font-bold transition hover:bg-ink hover:text-white">
            {settings.secondaryCtaLabel || (locale === "en" ? "Wholesale request" : "درخواست عمده")}
          </Link>
        </div>
      </div>
      <div className="grid aspect-square border border-ink bg-warm-paper p-5">
        <div className="grid place-items-center border border-ink bg-paper">
          <div className="grid h-48 w-48 place-items-center rounded-full border-[30px] border-ink">
            <span className="text-sm font-bold">AZADI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
