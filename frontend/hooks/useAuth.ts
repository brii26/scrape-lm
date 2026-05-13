"use client"

import { signOut } from "next-auth/react"

export function useAuth() {
  const logout = async () => {
    await signOut({ callbackUrl: "/api/auth/signin" })
  }

  return { logout }
}
