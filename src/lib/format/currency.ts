import type { Locale } from "@/lib/i18n";

const tomanFormatter = new Intl.NumberFormat("fa-IR");
const enFormatter = new Intl.NumberFormat("en-US");

export function formatToman(amount: number, locale: Locale = "fa") {
  if (locale === "en") return `${enFormatter.format(amount)} toman`;
  return `${tomanFormatter.format(amount)} تومان`;
}

export function formatRial(amountInToman: number, locale: Locale = "fa") {
  if (locale === "en") return `${enFormatter.format(amountInToman * 10)} rial`;
  return `${tomanFormatter.format(amountInToman * 10)} ریال`;
}
