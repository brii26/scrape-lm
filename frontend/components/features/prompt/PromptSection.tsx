"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { translatePrompt } from "@/lib/api"
import Spinner from "@/components/ui/Spinner"
import PromptSuggestions from "./PromptSuggestions"
import { useSearchHistoryContext } from "@/context/SearchHistoryContext"

interface Props {
  floating?: boolean
  onSearch?: (prompt: string) => Promise<void>
}

export default function PromptSection({ floating = false, onSearch }: Props) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { addEntry } = useSearchHistoryContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    setError("")

    try {
      if (onSearch) {
        await onSearch(input.trim())
      } else {
        const query = await translatePrompt(input)
        const q = JSON.stringify(query)
        addEntry(query.topic, q)
        router.replace(`/news?${new URLSearchParams({ q })}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const bar = (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-sky-300/20 focus-within:border-sky-300/40 transition-all shadow-[0_0_30px_rgba(125,211,252,0.1)] focus-within:shadow-[0_0_40px_rgba(125,211,252,0.2)]">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="find me news about..."
            className="flex-1 bg-transparent text-sm text-slate-50 placeholder:text-slate-400 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-300 hover:bg-sky-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? <Spinner color="text-white" /> : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2 px-1">{error}</p>}
      </form>
      {!floating && <div className="mt-4"><PromptSuggestions onSelect={setInput} /></div>}
    </div>
  )

  if (floating) {
    return (
      <div className="fixed bottom-6 left-0 right-0 z-10 flex justify-center px-4">
        {bar}
      </div>
    )
  }

  return <div className="w-full max-w-2xl flex flex-col gap-4">{bar}</div>
}
