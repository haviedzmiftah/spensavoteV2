import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("spensavote_admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login");
  const isDashboardPage = !isAuthPage && !pathname.startsWith("/api") && !pathname.startsWith("/_next") && !pathname.includes(".");

  if (isDashboardPage && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
