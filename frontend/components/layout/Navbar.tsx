"use client"

import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="w-full border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
      <span className="font-bold text-lg text-blue-600">scrape-lm</span>
      <button
        onClick={logout}
        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        Sign out
      </button>
    </nav>
  )
}
