import { Suspense } from "react"
import { signIn } from "@/lib/auth"
import OAuthButton from "./OAuthButton"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 px-6 py-10 rounded-2xl bg-[#111827] border border-white/8 shadow-[0_0_80px_-10px_rgba(34,211,238,0.15)]">

        <div>
          <svg width="60" height="60" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mainGradient" x1="120" y1="100" x2="390" y2="390" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4DF6FF"/>
                <stop offset="1" stopColor="#00C2FF"/>
              </linearGradient>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#BFFFFF"/>
                <stop offset="45%" stopColor="#4DF6FF"/>
                <stop offset="100%" stopColor="#00C2FF"/>
              </radialGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="starBlur" x="-200%" y="-200%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#glow)">
              <circle cx="220" cy="220" r="110" stroke="url(#mainGradient)" strokeWidth="28" strokeLinecap="round"/>
              <line x1="298" y1="298" x2="388" y2="388" stroke="url(#mainGradient)" strokeWidth="28" strokeLinecap="round"/>
            </g>

            <g filter="url(#starBlur)" opacity="0.95">
              <path d="M390 95L401 129L435 140L401 151L390 185L379 151L345 140L379 129L390 95Z" fill="url(#starGlow)"/>
            </g>
            <g filter="url(#starBlur)" opacity="0.85">
              <path d="M405 210L411 228L429 234L411 240L405 258L399 240L381 234L399 228L405 210Z" fill="url(#starGlow)"/>
            </g>
            <g filter="url(#starBlur)" opacity="0.8">
              <path d="M90 345L98 369L122 377L98 385L90 409L82 385L58 377L82 369L90 345Z" fill="url(#starGlow)"/>
            </g>
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100">Scrape-LM</h1>
          <p className="text-sm text-slate-500 mt-1">Ask anything and get live news scraped fresh</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Suspense>
            <form action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/api/auth/set-session" })
            }}>
              <OAuthButton>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </OAuthButton>
            </form>
          </Suspense>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">OR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <Suspense>
            <form action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/api/auth/set-session" })
            }}>
              <OAuthButton>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Continue with GitHub
              </OAuthButton>
            </form>
          </Suspense>
        </div>

      </div>
    </main>
  )
}
