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
              ? "bg-sky-300 text-slate-900"
              : "bg-white/5 border border-white/10 text-slate-400 hover:border-sky-300/30 hover:text-sky-300"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
