import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("spensavote_admin_token")?.value;
  const voterToken = request.cookies.get("spensavote_voter_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Admin Authentication Rules
  const isAdminAuthPage = pathname === "/admin/login";
  const isAdminProtected = pathname.startsWith("/admin") && !isAdminAuthPage;

  if (isAdminProtected && !adminToken) {
    const adminLoginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(adminLoginUrl);
  }

  if (isAdminAuthPage && adminToken) {
    const adminDashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminDashboardUrl);
  }

  // 2. Voter Protected Rules (voting area)
  const isVoterProtected = pathname.startsWith("/vote");
  if (isVoterProtected && !voterToken) {
    const voterLoginUrl = new URL("/login", request.url);
    return NextResponse.redirect(voterLoginUrl);
  }

  // 3. Voter Login page - if already logged in as voter, allow or redirect to vote
  if (pathname === "/login" && voterToken) {
    const voteUrl = new URL("/vote", request.url);
    return NextResponse.redirect(voteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

