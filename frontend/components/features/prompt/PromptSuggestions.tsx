"use client"

import { useSuggestions } from "@/context/SuggestionsContext"

interface Props {
  onSelect: (text: string) => void
}

export default function PromptSuggestions({ onSelect }: Props) {
  const suggestions = useSuggestions()

  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-slate-400 hover:border-sky-300/40 hover:text-sky-300 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
