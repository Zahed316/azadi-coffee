export type Locale = "fa" | "en";

export function localePath(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized === "/" ? "" : normalized}` : normalized;
}

export function alternateLocalePath(locale: Locale, pathname: string) {
  if (locale === "en") {
    const withoutPrefix = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    return withoutPrefix;
  }

  return pathname === "/" ? "/en" : `/en${pathname}`;
}
