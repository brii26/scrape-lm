"use client"

import { signOut, useSession } from "next-auth/react"

export function useAuth() {
  const { data: session } = useSession()

  const logout = async () => {
    await signOut({ callbackUrl: "/api/auth/signin" })
  }

  return {
    logout,
    user: session?.user ?? null,
  }
}
