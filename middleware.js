import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token"); // 쿠키에서 토큰 가져옴
  const { pathname } = request.nextUrl;

  // 🔐 Admin 보호
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 🔁 로그인 페이지 접근 시 이미 로그인한 경우 posts로
  if (pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/posts", request.url));
    }
  }

  return NextResponse.next(); // 문제 없으면 통과
}
