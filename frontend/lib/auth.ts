import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { API_BASE_URL } from "@/lib/constants"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // on first sign-in, exchange Google id_token for our backend JWT
      if (account?.id_token) {
        const res = await fetch(`${API_BASE_URL}/auth/google/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: account.id_token }),
        })

        if (res.ok) {
          const { data } = await res.json()
          token.backendJwt = data.token
        }

        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      session.backendJwt = token.backendJwt as string
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === "/") {
        return `${baseUrl}/api/auth/set-session`
      }
      return url
    },
  },
})
