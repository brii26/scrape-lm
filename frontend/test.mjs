import Anthropic from "@anthropic-ai/sdk"
import * as readline from "readline"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a news query parser. Convert the user's natural language prompt into a structured JSON object.

Rules:
- topic: concise English keywords describing what news to find (no filler words)
- filters.must_include: key terms that MUST appear in articles (empty if none)
- filters.must_exclude: key terms to exclude from articles (empty if none)
- filters.sort: "latest" for newest first, "relevant" for most relevant
- filters.page: always 1
- Only return news from the last 7 days. If the user asks for older news, respond with {"error": "Date range exceeds 7 days"}
- Return ONLY valid JSON. No markdown, no code blocks, no backticks, no explanation. Start your response with { and end with }

Example:
User: "show me news about Trump tariffs but not about China"
Response: {"topic":"Trump tariffs trade policy","filters":{"must_include":["Trump","tariffs"],"must_exclude":["China"],"sort":"latest","page":1}}

Example:
User: "berita terbaru soal rupiah melemah"
Response: {"topic":"Indonesian rupiah weakening currency","filters":{"must_include":["rupiah"],"must_exclude":[],"sort":"latest","page":1}}`

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask() {
  rl.question("Prompt: ", async (input) => {
    if (input === "exit") return rl.close()

    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input }],
    })

    const raw = res.content[0].type === "text" ? res.content[0].text : ""

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.log("Claude returned invalid JSON:", raw)
      return ask()
    }

    if (parsed.error) {
      console.log("Claude error:", parsed.error)
      return ask()
    }

    console.log("\nParsed query:")
    console.log(JSON.stringify(parsed, null, 2))
    console.log()

    ask()
  })
}

ask()
