import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value
  const { pathname } = request.nextUrl

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
	matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}
