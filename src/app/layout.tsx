import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
