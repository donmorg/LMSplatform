import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const user = session?.user as any;

  // 1. Redirect unauthenticated users to login for protected routes
  if (!user && (pathname.startsWith("/student") || pathname.startsWith("/teacher") || pathname === "/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    const role = user.role;
    return NextResponse.redirect(new URL(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard", request.url));
  }

  // 3. Role-based access control
  if (user) {
    const role = user.role;

    if (pathname.startsWith("/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }

    if (pathname.startsWith("/teacher") && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // Handle generic /dashboard redirect
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/dashboard", "/login", "/register"],
};
