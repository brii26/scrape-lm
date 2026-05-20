"use client"

import { useRouter, useSearchParams } from "next/navigation"
import type { HistoryEntry } from "@/hooks/useSearchHistory"
import { useSearchHistoryContext } from "@/context/SearchHistoryContext"

interface Props {
  open: boolean
  onClose: () => void
  history?: HistoryEntry[]
}

export default function Sidebar({ open, onClose, history = [] }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeTopic } = useSearchHistoryContext()

  const urlActiveTopic = (() => {
    const q = searchParams.get("q")
    if (!q) return null
    try { return JSON.parse(q)?.topic ?? null } catch { return null }
  })()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 flex flex-col gap-4 px-4 py-6 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 overflow-hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 min-h-0 flex-1 overflow-hidden">
          <div className="shrink-0 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
              History
            </p>
            <div className="h-px bg-white/5" />
          </div>
          <div className="overflow-y-auto flex flex-col gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {history.length === 0 && (
              <p className="text-xs text-slate-600 px-2 py-1">No history yet</p>
            )}
            {history.map((item, i) => (
              <button
                key={`${item.topic}-${i}`}
                onClick={() => {
                  onClose()
                  router.push(`/?historyQ=${encodeURIComponent(item.q)}`)
                }}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors text-left w-full ${
                  (activeTopic ?? urlActiveTopic) === item.topic
                    ? "bg-sky-500/10 text-sky-300"
                    : "text-slate-400 hover:text-slate-50 hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-4 h-4 shrink-0 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="truncate">{item.topic}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
