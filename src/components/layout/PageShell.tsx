import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({ children, locale = "fa" }: { children: ReactNode; locale?: Locale }) {
  return (
    <div lang={locale} dir={locale === "en" ? "ltr" : "rtl"}>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
