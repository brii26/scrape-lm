import Anthropic from '@anthropic-ai/sdk'
import * as readline from 'readline'

const client =  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY})

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

const history = []

function ask() {
	rl.question("You: ", async (input) => {
		if (input === 'exit') return rl.close()

		history.push({role: "user", content: input })

		const res = await  client.messages.create ({
			model: 'claude-haiku-4-5-20251001',
			max_tokens: 1024,
			messages: history,
		})

		const reply = res.content[0].text
		history.push({ role: 'assistant', content: reply})

		console.log(`Claude: ${reply}\n`)
		console.log(history)
		ask()
	})
}

ask()