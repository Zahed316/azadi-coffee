import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { HeaderFooterSettings } from "@/lib/theme-settings";
import type { NavigationItem } from "@/lib/wordpress";

export function Footer({
  locale = "fa",
  settings = {},
  navigation,
}: {
  locale?: Locale;
  settings?: HeaderFooterSettings;
  navigation?: NavigationItem[];
}) {
  const defaultDescription =
    locale === "en"
      ? "A specialty coffee shop for fresh roasts, brewing education, and cafe supply."
      : "فروشگاه قهوه تخصصی فارسی برای قهوه تازه برشته، آموزش دم آوری و تامین قهوه برای کافه ها.";
  const links =
    navigation?.slice(0, 3) ||
    (locale === "en"
      ? [
          { label: "Shop", href: "/shop" },
          { label: "Journal", href: "/blog" },
          { label: "Wholesale request", href: "/wholesale" },
        ]
      : [
          { label: "فروشگاه", href: "/shop" },
          { label: "وبلاگ", href: "/blog" },
          { label: "درخواست عمده", href: "/wholesale" },
        ]);

  return (
    <footer className="site-footer border-t bg-ink text-paper">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-bold">{settings.brand || "Azadi Coffee"}</p>
          <p className="mt-4 max-w-md leading-8 text-white/70">
            {settings.description || defaultDescription}
          </p>
        </div>
        <div className="grid gap-3 text-sm text-white/70">
          {links.map((item) => (
            <Link key={item.href} href={localePath(locale, item.href)}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="text-sm leading-8 text-white/70">
          <p>{settings.contact?.address || (locale === "en" ? "Tehran, Azadi roastery" : "تهران، کارگاه برشته کاری آزادی")}</p>
          <p className="ltr text-right">{settings.contact?.phone || "021-00000000"}</p>
          <p>{settings.contact?.hours || (locale === "en" ? "Saturday to Thursday, 10:00-18:00" : "شنبه تا پنجشنبه، ۱۰ تا ۱۸")}</p>
        </div>
      </div>
    </footer>
  );
}
