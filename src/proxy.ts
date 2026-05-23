import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "azadi_locale";

function resolveLocale(pathname: string): "fa" | "en" {
  return pathname.startsWith("/en") ? "en" : "fa";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = resolveLocale(pathname);

  if (pathname === "/") {
    const stored = request.cookies.get(LOCALE_COOKIE)?.value;
    if (stored === "en") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, "en", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  response.headers.set("x-dir", locale === "en" ? "ltr" : "rtl");

  if (pathname.startsWith("/en")) {
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else {
    response.cookies.set(LOCALE_COOKIE, "fa", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts/|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)"],
};
