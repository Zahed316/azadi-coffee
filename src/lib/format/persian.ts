import type { Locale } from "@/lib/i18n";

export function inventoryLabel(status: "available" | "low" | "sold-out", locale: Locale = "fa") {
  if (locale === "en") {
    if (status === "available") return "Ready to ship";
    if (status === "low") return "Limited stock";
    return "Sold out";
  }

  if (status === "available") return "آماده ارسال";
  if (status === "low") return "موجودی محدود";
  return "ناموجود";
}

export function latin(text: string) {
  return /[A-Za-z]/.test(text);
}
