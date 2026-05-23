"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function resolveLocale(pathname: string) {
  return pathname.startsWith("/en") ? "en" : "fa";
}

export function DocumentLocaleSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const locale = resolveLocale(pathname || "/");
    const isEnglish = locale === "en";
    const documentElement = document.documentElement;

    documentElement.lang = locale;
    documentElement.dir = isEnglish ? "ltr" : "rtl";
    documentElement.dataset.locale = locale;
  }, [pathname]);

  return null;
}
