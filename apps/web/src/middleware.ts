import { NextResponse, type NextRequest } from "next/server";
import {
  APP_COUNTERPART,
  SESSION_COOKIE_NAME,
  SIGNED_OUT_PARAM,
} from "@/features/auth/routes";

/**
 * Decides on the server, before any HTML is sent, so signed-in users never see the public pages.
 *
 * This checks only that the session cookie exists. It does not check it with the API.
 * The API stays the authority: a stale cookie is cleared by GET /auth/me, and the
 * dashboard then sends the visitor to `/?signedout=1`, which this middleware ignores.
 */
export function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!hasSession) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  const target = APP_COUNTERPART[pathname];
  const signedOutFlag = searchParams.has(SIGNED_OUT_PARAM);

  if (target && hasSession && !signedOutFlag) {
    return NextResponse.redirect(new URL(`${target}${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/check", "/dashboard", "/dashboard/:path*"],
};
