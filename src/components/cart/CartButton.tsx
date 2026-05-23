"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { usePathname } from "next/navigation";
import { localePath } from "@/lib/i18n";

export function CartButton() {
  const { count } = useCart();
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const label = isEnglish ? "Cart" : "سبد خرید";
  const href = localePath(isEnglish ? "en" : "fa", "/cart");

  return (
    <Link href={href} className="button-primary relative inline-flex min-h-10 items-center border px-3 py-2 font-bold transition">
      {label}
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coffee px-1.5 text-[11px] font-bold leading-none text-paper">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
