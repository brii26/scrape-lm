import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { ScrapeQuerySchema } from "@/lib/validations"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a news search query optimizer for Google News RSS.

Convert the user's natural language prompt into a structured JSON object.

Rules:
- topic: 2-5 short English keywords optimized for a news search engine — think like a journalist searching Google News, not a sentence. No filler words, no verbs, no "news about", no "latest". Just the core nouns and proper nouns.
- filters.must_include: specific terms that MUST appear in articles (proper nouns, tickers, names). Keep empty if not clearly specified.
- filters.must_exclude: terms to exclude. Keep empty if not clearly specified.
- filters.sort: "latest" for newest first, "relevant" for most relevant
- filters.page: always 1
- Only return news from the last 7 days. If the user asks for older news, respond with {"error": "invalid_request"}
- Only reject with {"error": "invalid_request"} if the input is clearly harmful (e.g. self-harm, instructions for violence) or is completely random gibberish with no possible news angle. Religious, political, controversial, or unusual topics are valid news queries — do not reject them.
- Return ONLY valid JSON. No markdown, no code blocks, no backticks, no explanation. Start your response with { and end with }

Example:
User: "show me news about Trump tariffs but not about China"
Response: {"topic":"Trump tariffs trade","filters":{"must_include":["Trump","tariffs"],"must_exclude":["China"],"sort":"latest","page":1}}

Example:
User: "berita terbaru soal rupiah melemah gara gara prabowo"
Response: {"topic":"rupiah prabowo Indonesia","filters":{"must_include":["rupiah"],"must_exclude":[],"sort":"latest","page":1}}

Example:
User: "what is happening with nvidia stock"
Response: {"topic":"Nvidia stock NVDA","filters":{"must_include":["Nvidia"],"must_exclude":[],"sort":"latest","page":1}}`

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 })
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  })

  const raw = message.content[0].type === "text" ? message.content[0].text.trim() : ""

  const jsonStart = raw.indexOf("{")
  const jsonEnd = raw.lastIndexOf("}")
  const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    return NextResponse.json({ error: "Claude returned invalid JSON" }, { status: 502 })
  }

  if (typeof parsed === "object" && parsed !== null && "error" in parsed) {
    return NextResponse.json({ error: (parsed as { error: string }).error }, { status: 422 })
  }

  const result = ScrapeQuerySchema.safeParse(parsed)
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid query shape", details: result.error.flatten() },
      { status: 422 }
    )
  }

  return NextResponse.json({ data: result.data })
}
