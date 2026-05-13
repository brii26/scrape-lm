import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()

  if (!session?.backendJwt) {
    return NextResponse.redirect("/api/auth/signin")
  }

  const cookieStore = await cookies()
  cookieStore.set("session", session.backendJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  })

  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL!))
}
