"use client"

import { useState } from "react"
import { translatePrompt, fetchNews } from "@/lib/api"
import type { NewsItem, ScrapeQuery } from "@/lib/types"

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [query, setQuery] = useState<ScrapeQuery | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const search = async (prompt: string, token: string) => {
    setLoading(true)
    setError("")

    try {
      const q = await translatePrompt(prompt)
      setQuery(q)
      const res = await fetchNews(q, token)
      setItems(res.data?.news ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return { items, query, loading, error, search }
}
