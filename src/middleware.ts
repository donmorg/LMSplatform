import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const pathname = nextUrl.pathname;

  // 1. Redirect unauthenticated users to login for protected routes
  if (!isLoggedIn && (pathname.startsWith("/student") || pathname.startsWith("/teacher") || pathname === "/dashboard")) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 2. Redirect authenticated users away from auth pages
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    const role = user.role;
    return NextResponse.redirect(new URL(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard", nextUrl));
  }

  // 3. Role-based access control
  if (isLoggedIn) {
    const role = user.role;

    if (pathname.startsWith("/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl));
    }

    if (pathname.startsWith("/teacher") && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
    }

    // Handle generic /dashboard redirect
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/dashboard", "/login", "/register"],
};
