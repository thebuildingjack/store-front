import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/account", "/orders", "/checkout"];
const authRoutes = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // If trying to access a protected route without a token → redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If already logged in and trying to access login/register → redirect to home
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        // Token invalid, let them through to login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};