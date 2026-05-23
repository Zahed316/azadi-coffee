import type { Metadata } from "next";
import { headers } from "next/headers";
import { DocumentLocaleSync } from "@/components/layout/DocumentLocaleSync";
import { CartProvider } from "@/components/cart/CartProvider";
import { DesignSettingsProvider } from "@/components/settings/DesignSettingsProvider";
import { getThemeSettings, themeSettingsToCssVariables } from "@/lib/theme-settings";
import { defaultDesignSettings } from "@/lib/settings/design-presets";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Azadi Coffee | قهوه آزادی",
    template: "%s | قهوه آزادی",
  },
  description:
    "فروشگاه فارسی و راست چین قهوه تخصصی آزادی؛ قهوه تازه برشته، آموزش دم آوری و سفارش عمده برای کافه ها.",
  openGraph: {
    title: "قهوه آزادی",
    description: "قهوه تخصصی، فروش آنلاین، وبلاگ و سفارش عمده.",
    locale: "fa_IR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale: Locale = "fa";
  try {
    const h = await headers();
    const xLocale = h.get("x-locale");
    if (xLocale === "en") locale = "en";
  } catch {
    /* during SSG the headers() call throws — fall back to fa */
  }

  const lang = locale === "en" ? "en" : "fa";
  const dir = locale === "en" ? "ltr" : "rtl";

  let themeSettings;
  try {
    themeSettings = await getThemeSettings();
  } catch {
    themeSettings = defaultDesignSettings;
  }

  return (
    <html
      lang={lang}
      dir={dir}
      className="h-full antialiased"
      data-header-style={themeSettings.styles.header}
      data-footer-style={themeSettings.styles.footer}
      data-landing-style={themeSettings.styles.landing}
      data-product-card-style={themeSettings.styles.productCard}
      data-blog-card-style={themeSettings.styles.blogCard}
      data-button-style={themeSettings.styles.button}
      style={themeSettingsToCssVariables(themeSettings)}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-paper text-ink" suppressHydrationWarning>
        <DocumentLocaleSync />
        <DesignSettingsProvider initialSettings={themeSettings}>
          <CartProvider>{children}</CartProvider>
        </DesignSettingsProvider>
      </body>
    </html>
  );
}
