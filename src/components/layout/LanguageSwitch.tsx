"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocalePath, type Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const label = locale === "en" ? "فارسی" : "EN";

  return (
    <Link
      href={alternateLocalePath(locale, pathname)}
      className="inline-flex min-h-10 items-center border border-ink px-3 py-2 font-bold transition hover:bg-ink hover:text-paper"
      aria-label={locale === "en" ? "Switch to Persian" : "Switch to English"}
    >
      {label}
    </Link>
  );
}
