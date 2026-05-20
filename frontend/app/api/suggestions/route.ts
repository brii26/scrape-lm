import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const TTL = 5 * 60 * 1000

const store: { data: string[] | null; expires: number } = { data: null, expires: 0 }

const client = new Anthropic()

export async function GET() {
  if (store.data && Date.now() < store.expires) {
    return NextResponse.json({ suggestions: store.data })
  }

  const rssRes = await fetch("https://news.google.com/rss?hl=en&gl=US&ceid=US:en")

  if (!rssRes.ok) {
    return NextResponse.json({ suggestions: store.data ?? [] })
  }

  const xml = await rssRes.text()
  const titleMatches = [...xml.matchAll(/<item>[\s\S]*?<title>([^<]+)<\/title>/g)]
  const titles = titleMatches.map((m) => m[1].replace(/ - [^-]+$/, "").trim()).slice(0, 12)

  if (titles.length === 0) {
    return NextResponse.json({ suggestions: store.data ?? [] })
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `From these news headlines, pick 4 that are most diverse and interesting. Shorten each as a search-ready prompt, no word limit. Return ONLY a JSON array of 4 strings, no explanation.

Headlines:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
      },
    ],
  })

  const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "[]"
  const start = raw.indexOf("[")
  const end = raw.lastIndexOf("]")
  const jsonStr = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : "[]"

  let suggestions: string[] = []
  try {
    suggestions = JSON.parse(jsonStr)
  } catch {
    suggestions = store.data ?? []
  }

  store.data = suggestions
  store.expires = Date.now() + TTL

  return NextResponse.json({ suggestions })
}
