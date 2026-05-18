"use client"

import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="w-full border-b border-white/8 bg-[#0a0f1e] px-6 py-4 flex items-center justify-between">
      <span className="font-bold text-lg text-cyan-400">scrape-lm</span>
      <button
        onClick={logout}
        className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
      >
        Sign out
      </button>
    </nav>
  )
}
