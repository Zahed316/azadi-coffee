import type { Metadata } from "next";
import { DocumentLocaleSync } from "@/components/layout/DocumentLocaleSync";
import { DesignSettingsProvider } from "@/components/settings/DesignSettingsProvider";
import { getThemeSettings, themeSettingsToCssVariables } from "@/lib/theme-settings";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://azadicoffee.ir"),
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
  const themeSettings = await getThemeSettings();

  return (
    <html
      lang="fa"
      dir="rtl"
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
        <DesignSettingsProvider initialSettings={themeSettings}>{children}</DesignSettingsProvider>
      </body>
    </html>
  );
}
