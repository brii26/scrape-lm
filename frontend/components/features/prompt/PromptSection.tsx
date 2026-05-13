"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { translatePrompt } from "@/lib/api"
import PromptSuggestions from "./PromptSuggestions"

export default function PromptSection() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError("")

    try {
      const query = await translatePrompt(input)
      const params = new URLSearchParams({ q: JSON.stringify(query) })
      router.push(`/news?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. latest oil news from US and UK"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
      <PromptSuggestions onSelect={setInput} />
    </div>
  )
}
