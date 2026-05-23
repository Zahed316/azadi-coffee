import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { getFooterContent, getNavigation } from "@/lib/wordpress";
import { Footer } from "./Footer";
import { Header } from "./Header";

export async function PageShell({ children, locale = "fa" }: { children: ReactNode; locale?: Locale }) {
  const [navigation, footerSettings] = await Promise.all([getNavigation(locale), getFooterContent(locale)]);

  return (
    <div lang={locale} dir={locale === "en" ? "ltr" : "rtl"}>
      <Header locale={locale} navigation={navigation} brand={footerSettings.brand} />
      <main>{children}</main>
      <Footer locale={locale} settings={footerSettings} navigation={navigation} />
    </div>
  );
}
