"use client"

import { signOut } from "next-auth/react"
import { useAuthContext } from "@/context/AuthContext"

export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthContext()

  const logout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return { user, isLoading, isAuthenticated, logout }
}
