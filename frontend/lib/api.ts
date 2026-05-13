import { API_BASE_URL } from "@/lib/constants"
import type { ScrapeQuery, NewsResponse } from "@/lib/types"

export async function translatePrompt(prompt: string): Promise<ScrapeQuery> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? "Failed to translate prompt")
  }

  const { data } = await res.json()
  return data
}

export async function fetchNews(query: ScrapeQuery, token: string): Promise<NewsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  })

  if (!res.ok) {
    const { message } = await res.json()
    throw new Error(message ?? "Failed to fetch news")
  }

  return res.json()
}
