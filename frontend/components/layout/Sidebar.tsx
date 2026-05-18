"use client"

import { useRouter } from "next/navigation"

interface HistoryItem {
  id: string
  topic: string
}

interface Props {
  open: boolean
  onClose: () => void
  history?: HistoryItem[]
}

export default function Sidebar({ open, onClose, history = [] }: Props) {
  const router = useRouter()

  const handleNewSearch = () => {
    router.push("/")
    onClose()
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 flex flex-col gap-6 px-4 py-6 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={handleNewSearch}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/8 text-slate-50 text-sm font-medium hover:bg-slate-700/80 transition-colors"
        >
          <svg
            className="w-4 h-4 text-sky-300 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Search
        </button>

        {history.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">
              History
            </p>
            {history.map((item) => (
              <button
                key={item.id}
                className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-50 hover:bg-white/5 transition-colors text-left w-full"
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
        )}
      </aside>
    </>
  )
}
