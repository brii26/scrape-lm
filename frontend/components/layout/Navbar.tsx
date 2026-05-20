"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface Props {
  onBurgerClick?: () => void
}

export default function Navbar({ onBurgerClick }: Props) {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogoClick = () => {
    window.location.href = "/"
  }
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="sticky top-0 z-10 w-full flex justify-center px-[25px] pt-5 pb-3 pointer-events-none">
      <nav className="pointer-events-auto w-full flex items-center gap-4 px-5 py-[9px] rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(125,211,252,0.08),0_8px_32px_rgba(0,0,0,0.4)]">
        <button
          onClick={onBurgerClick}
          className="flex flex-col gap-1.5 w-5 shrink-0 group"
          aria-label="Toggle sidebar"
        >
          <span className="block h-px w-5 bg-slate-400 group-hover:bg-slate-50 transition-colors" />
          <span className="block h-px w-3 bg-slate-400 group-hover:bg-slate-50 transition-colors" />
          <span className="block h-px w-5 bg-slate-400 group-hover:bg-slate-50 transition-colors" />
        </button>

        <div className="w-px h-5 bg-white/10" />

        <button onClick={handleLogoClick} className="flex items-center gap-1 flex-1 cursor-pointer">
          <svg
            width="36"
            height="36"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="nodeGradientN" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#B8F2FF" />
                <stop offset="55%" stopColor="#78D9FF" />
                <stop offset="100%" stopColor="#59C8FF" />
              </radialGradient>
              <filter id="glowN" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g
              filter="url(#glowN)"
              stroke="url(#nodeGradientN)"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.6"
            >
              <line x1="256" y1="256" x2="256" y2="145" />
              <line x1="256" y1="256" x2="356" y2="200" />
              <line x1="256" y1="256" x2="356" y2="312" />
              <line x1="256" y1="256" x2="256" y2="367" />
              <line x1="256" y1="256" x2="156" y2="312" />
              <line x1="256" y1="256" x2="156" y2="200" />
            </g>
            <g
              filter="url(#glowN)"
              stroke="url(#nodeGradientN)"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.6"
            >
              <line x1="256" y1="145" x2="356" y2="200" />
              <line x1="356" y1="200" x2="356" y2="312" />
              <line x1="356" y1="312" x2="256" y2="367" />
              <line x1="256" y1="367" x2="156" y2="312" />
              <line x1="156" y1="312" x2="156" y2="200" />
              <line x1="156" y1="200" x2="256" y2="145" />
            </g>
            <circle cx="256" cy="256" r="42" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="256" cy="125" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="380" cy="190" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="380" cy="322" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="256" cy="387" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="132" cy="322" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
            <circle cx="132" cy="190" r="28" fill="url(#nodeGradientN)" filter="url(#glowN)" />
          </svg>
          <span className="font-semibold text-lg text-slate-50">scrape-lm</span>
        </button>

        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-sky-300/50 transition-colors shrink-0"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-medium">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
              {user?.name && (
                <div className="px-4 py-3 border-b border-white/8">
                  <p className="text-xs text-slate-50 font-medium truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  logout()
                }}
                className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:text-slate-50 hover:bg-white/5 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
