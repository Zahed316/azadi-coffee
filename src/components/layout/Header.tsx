import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { NavigationItem } from "@/lib/wordpress";
import { LanguageSwitch } from "./LanguageSwitch";

const nav = {
  fa: [
  ["فروشگاه", "/shop"],
  ["وبلاگ", "/blog"],
  ["درباره", "/about"],
  ["برشته کاری", "/roastery"],
  ["عمده", "/wholesale"],
  ],
  en: [
    ["Shop", "/shop"],
    ["Journal", "/blog"],
    ["About", "/about"],
    ["Roastery", "/roastery"],
    ["Wholesale", "/wholesale"],
  ],
} as const;

export function Header({
  locale = "fa",
  navigation = nav[locale].map(([label, href]) => ({ label, href })),
  brand,
}: {
  locale?: Locale;
  navigation?: NavigationItem[];
  brand?: string;
}) {
  return (
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-shell flex min-h-16 items-center justify-between gap-4">
        <Link href={localePath(locale, "/")} className="text-lg font-bold tracking-tight">
          {brand || (locale === "en" ? "Azadi Coffee" : "قهوه آزادی")}
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={localePath(locale, href)} className="text-stone transition hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <LanguageSwitch locale={locale} />
          <Link href={localePath(locale, "/contact")} className="button-secondary hidden min-h-10 items-center border px-3 py-2 font-bold md:inline-flex">
            {locale === "en" ? "Contact" : "تماس"}
          </Link>
          <Link href={localePath(locale, "/cart")} className="button-primary inline-flex min-h-10 items-center border px-3 py-2 font-bold transition">
            {locale === "en" ? "Cart" : "سبد خرید"}
          </Link>
        </div>
      </div>
    </header>
  );
}
