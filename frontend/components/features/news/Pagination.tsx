"use client"

import { PAGINATION } from "@/lib/constants"

interface Props {
  page: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, onPageChange }: Props) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: PAGINATION.TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? "bg-cyan-500 text-white"
              : "bg-white/5 border border-white/10 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
