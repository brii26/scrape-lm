import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { API_BASE_URL } from "@/lib/constants"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return NextResponse.json({ status: "success", data: { used: 0, remaining: 10, limit: 10 } })
  }

  const res = await fetch(`${API_BASE_URL}/api/quota`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
