import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALE_COOKIE = "azadi_locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const stored = request.cookies.get(LOCALE_COOKIE)?.value;
    if (stored === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  const locale = pathname.startsWith("/en") ? "en" : "fa";
  const response = NextResponse.next();

  response.headers.set("x-locale", locale);
  response.headers.set("x-dir", locale === "en" ? "ltr" : "rtl");

  if (pathname.startsWith("/en")) {
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  response.cookies.set(LOCALE_COOKIE, "fa", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts/|assets/icons/).*)"],
};
