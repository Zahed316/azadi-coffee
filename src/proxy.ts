import { NextResponse, type NextRequest } from "next/server";

function resolveLocale(pathname: string): "fa" | "en" {
  return pathname.startsWith("/en") ? "en" : "fa";
}

function prefersEnglish(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  try {
    const locales = acceptLanguage
      .split(",")
      .map((entry) => {
        const parts = entry.trim().split(";");
        const locale = parts[0]?.trim().toLowerCase() || "";
        const quality = parts[1] ? parseFloat(parts[1].replace("q=", "")) : 1;
        return { locale, quality };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const { locale } of locales) {
      if (locale.startsWith("en")) return true;
      if (locale.startsWith("fa") || locale.startsWith("ar") || locale.startsWith("ku")) return false;
    }

    return false;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = resolveLocale(pathname);

  if (pathname === "/") {
    const acceptLanguage = request.headers.get("Accept-Language");
    if (prefersEnglish(acceptLanguage)) {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  response.headers.set("x-dir", locale === "en" ? "ltr" : "rtl");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts/|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)"],
};
