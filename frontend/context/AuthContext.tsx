"use client"

import { createContext, useContext } from "react"
import { useSession } from "next-auth/react"

interface AuthContextValue {
  user: { name?: string | null; email?: string | null; image?: string | null } | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
