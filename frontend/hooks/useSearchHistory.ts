"use client"

import { useState, useEffect, useCallback } from "react"

export interface HistoryEntry {
  topic: string
  q: string
}

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    fetch("/api/history")
      .then(r => r.json())
      .then(data => {
        const entries: HistoryEntry[] = (data.data?.history ?? []).map((raw: string) => {
          try { return JSON.parse(raw) } catch { return null }
        }).filter(Boolean)
        setHistory(entries)
      })
      .catch(() => {})
  }, [])

  const addEntry = useCallback((topic: string, q: string) => {
    setHistory(prev => {
      const deduped = prev.filter(e => e.topic !== topic)
      return [{ topic, q }, ...deduped].slice(0, 20)
    })
  }, [])

  return { history, addEntry }
}
