import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { ScrapeQuerySchema } from "@/lib/validations"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a news query parser. Convert the user's natural language prompt into a structured JSON object.

Rules:
- topic: concise keywords describing what news to find (no filler words)
- region: array of region codes from this list only: ["id", "us", "uk", "gcc"]
- filters.must_include: key terms that MUST appear in articles (empty if none)
- filters.must_exclude: key terms to exclude from articles (empty if none)
- filters.sort: "latest" for newest first, "relevant" for most relevant
- filters.page: always 1
- Only return news from the last 7 days. If the user asks for older news, respond with {"error": "Date range exceeds 7 days"}
- Return ONLY valid JSON, no explanation, no markdown`

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

  const raw = message.content[0].type === "text" ? message.content[0].text : ""

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
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
