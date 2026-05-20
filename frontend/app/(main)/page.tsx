"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useSearchParams, useRouter } from "next/navigation"
import { translatePrompt, fetchNewsClient } from "@/lib/api"
import TextCursor from "@/components/ui/Cursor"
import PromptSection from "@/components/features/prompt/PromptSection"
import NewsGrid from "@/components/features/news/NewsGrid"
import NewsGridSkeleton from "@/components/features/news/NewsGridSkeleton"
import PaginationWrapper from "@/components/features/news/PaginationWrapper"
import EmptyState from "@/components/features/news/EmptyState"
import { useSearchHistoryContext } from "@/context/SearchHistoryContext"
import { SearchHistoryContext } from "@/context/SearchHistoryContext"
import { useToast } from "@/context/ToastContext"
import type { NewsItem, ScrapeQuery } from "@/lib/types"

type Status = "idle" | "scraping" | "done"

export default function HomePage() {
  const [status, setStatus] = useState<Status>("idle")
  const [items, setItems] = useState<NewsItem[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState<ScrapeQuery | null>(null)
  const [page, setPage] = useState(1)
  const [remaining, setRemaining] = useState<number | null>(null)
  const { addEntry } = useSearchHistoryContext()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lastHistoryQ = useRef<string | null>(null)

  useEffect(() => {
    fetch("/api/quota")
      .then(r => r.json())
      .then(data => setRemaining(data.data?.remaining ?? null))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const historyQ = searchParams.get("historyQ")
    if (!historyQ || historyQ === lastHistoryQ.current) return
    lastHistoryQ.current = historyQ
    ;(async () => {
      if (!(await guardQuota())) return
      try {
        const q: ScrapeQuery = JSON.parse(historyQ)
        setQuery(q)
        await runSearch(q, 1, true)
        router.replace("/")
      } catch {
        showToast("Invalid request", "error")
        setStatus("idle")
      }
    })()
  }, [searchParams])

  const resetSearch = () => {
    setStatus("idle")
    setItems([])
    setQuery(null)
    setPage(1)
  }

  const refreshQuota = async () => {
    try {
      const r = await fetch("/api/quota")
      const data = await r.json()
      setRemaining(data.data?.remaining ?? null)
      return data.data?.remaining as number
    } catch {
      return null
    }
  }

  const guardQuota = async (): Promise<boolean> => {
    const left = await refreshQuota()
    if (left !== null && left <= 0) {
      showToast("Daily limit reached", "warning")
      return false
    }
    return true
  }

  const runSearch = async (q: ScrapeQuery, p = 1, showQuotaToast = false) => {
    setStatus("scraping")
    setPage(p)
    const res = await fetchNewsClient({ ...q, filters: { ...q.filters, page: p } })
    setItems(res.data?.news ?? [])
    setTotal(res.data?.total ?? 0)
    setStatus("done")
    const cacheHit = res.data?.cache_hit ?? false
    if (showQuotaToast && !cacheHit && (res.data?.total ?? 0) > 0) {
      const left = await refreshQuota()
      if (left !== null) {
        showToast(`${left} search${left === 1 ? "" : "es"} remaining today`, "info")
      }
    }
  }

  const handleSearch = async (prompt: string) => {
    try {
      const q = await translatePrompt(prompt)
      if (!(await guardQuota())) return
      addEntry(q.topic, JSON.stringify(q))
      setQuery(q)
      await runSearch(q, 1, true)
    } catch (err: any) {
      showToast("Invalid request", "error")
      setStatus("idle")
    }
  }

  const searchFromHistory = async (qStr: string) => {
    if (!(await guardQuota())) return
    try {
      const q: ScrapeQuery = JSON.parse(qStr)
      setQuery(q)
      await runSearch(q, 1, true)
    } catch {
      showToast("Invalid request", "error")
      setStatus("idle")
    }
  }

  const handlePageChange = async (p: number) => {
    if (!query) return
    await runSearch(query, p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <SearchHistoryContext.Provider value={{ addEntry, resetSearch, activeTopic: query?.topic ?? null, searchFromHistory }}>
      <AnimatePresence>
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
          >
            <TextCursor spacing={50} maxPoints={9} exitDuration={0.5} randomFloat={true}>
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-50">What&apos;s on your mind?</h1>
                  {remaining !== null && (
                    <p className="text-xs text-slate-500 mt-2">
                      {remaining} search{remaining === 1 ? "" : "es"} remaining today
                    </p>
                  )}
                </div>
                <PromptSection onSearch={handleSearch} />
              </div>
            </TextCursor>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {status === "scraping" && (
          <motion.div
            key="scraping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6 pb-28"
          >
            <p className="text-sm text-slate-500">Finding news...</p>
            <NewsGridSkeleton />
          </motion.div>
        )}

        {status === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 pb-28"
          >
            <p className="text-sm text-slate-500">
              {total} results for relevant news
            </p>
            {items.length === 0 ? <EmptyState /> : <NewsGrid items={items} />}
            {items.length > 0 && (
              <PaginationWrapper
                currentPage={page}
                totalPages={Math.ceil(total / 6)}
                onPageChange={handlePageChange}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {status !== "idle" && <PromptSection floating onSearch={handleSearch} />}
    </SearchHistoryContext.Provider>
  )
}
