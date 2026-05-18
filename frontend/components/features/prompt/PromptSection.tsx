"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { translatePrompt } from "@/lib/api"
import Spinner from "@/components/ui/Spinner"
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
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#161b2e] border border-white/10 focus-within:border-cyan-500/50 transition-colors">
          <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="find me news about..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? (
              <Spinner />
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2 px-1">{error}</p>}
      </form>
      <PromptSuggestions onSelect={setInput} />
    </div>
  )
}
