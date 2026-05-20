"use client"

import { useState } from "react"
import Image from "next/image"
import type { NewsItem } from "@/lib/types"

interface Props {
  item: NewsItem
}

export default function NewsCard({ item }: Props) {
  const [open, setOpen] = useState(false)

  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/8 hover:border-sky-300/20 transition-colors text-left w-full"
      >
        <div className="relative h-44 bg-slate-900 w-full">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-[#030712]" />
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
            {item.source}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="text-xs text-slate-400">{formattedDate}</p>
          <h3 className="text-sm font-semibold text-slate-50 line-clamp-2 leading-snug">
            {item.title}
          </h3>
          {item.summary && (
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{item.summary}</p>
          )}
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md mx-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(125,211,252,0.1)] p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide">{item.source}</p>
            <p className="text-sm font-semibold text-slate-50 leading-snug">{item.title}</p>
            {item.summary && (
              <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
            )}
            <div className="flex gap-3 pt-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-900 text-sm font-medium text-center transition-colors"
              >
                Read at {item.source}
              </a>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
