import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are Jarvis, an advanced AI assistant. You are:
- Intelligent, precise, and calm — like a trusted research partner
- Concise by default: short answers for simple questions, detailed for complex ones
- Capable of reasoning through code, math, research, and analysis
- Honest about uncertainty — you say "I don't know" rather than guessing
- Occasionally dry-witted, but never verbose

When writing code, use markdown code blocks with the language tag.
Format longer explanations with headers and bullet points where it helps clarity.
Keep conversational replies to 1–3 sentences.`

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', model: 'llama-3.3-70b-versatile' })
})

// Streaming chat endpoint
app.post('/chat/stream', async (req, res) => {
  const { messages } = req.body as { messages: ChatMessage[] }

  if (!messages?.length) {
    res.status(400).json({ error: 'messages array required' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? ''
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.write(`data: ${JSON.stringify({ token: `\n\n⚠️ Error: ${msg}` })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()
  }
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`\n🤖 Jarvis server running on http://localhost:${PORT}`)
  console.log(`   Model: llama-3.3-70b-versatile (Groq)\n`)
})
