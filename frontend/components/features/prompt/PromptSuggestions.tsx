"use client"

const suggestions = [
  "Latest tech news from the US",
  "Oil prices and energy news from GCC",
  "Politics news from UK",
  "Indonesian economy updates",
]

interface Props {
  onSelect: (text: string) => void
}

export default function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  )
}
