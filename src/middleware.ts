import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware for route protection
 * Layer 1: Basic authentication check (token presence)
 *
 * Note: Role-based checks are handled client-side via useRole hook
 * because JWT decoding on Edge runtime has limitations
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Block unauthenticated users from protected routes
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Preserve attempted URL for redirect after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (token && isAuthPage) {
    // Check if there's a redirect parameter
    const redirect = request.nextUrl.searchParams.get("redirect");
    const targetUrl = redirect || "/dashboard";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
