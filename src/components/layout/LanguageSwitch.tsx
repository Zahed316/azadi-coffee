"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocalePath, type Locale } from "@/lib/i18n";

function setLocaleCookie(nextLocale: "fa" | "en") {
  document.cookie = `azadi_locale=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=lax`;
}

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "fa" : "en";
  const label = locale === "en" ? "فارسی" : "EN";

  return (
    <Link
      href={alternateLocalePath(locale, pathname)}
      onClick={() => setLocaleCookie(nextLocale)}
      className="inline-flex min-h-10 items-center border border-ink px-3 py-2 font-bold transition hover:bg-ink hover:text-paper"
      aria-label={locale === "en" ? "Switch to Persian" : "Switch to English"}
    >
      {label}
    </Link>
  );
}
