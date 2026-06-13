# Jarvis — AI Personal Assistant

A voice-enabled AI assistant with real-time streaming responses and a glassmorphic dark UI. Speak or type — Jarvis thinks, responds, and talks back.

![stack](https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=flat-square&logo=react)
![stack](https://img.shields.io/badge/Tailwind_CSS-v3-38BDF8?style=flat-square&logo=tailwindcss)
![stack](https://img.shields.io/badge/Framer_Motion-animations-FF0080?style=flat-square)
![stack](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)
![stack](https://img.shields.io/badge/Express-TypeScript-000000?style=flat-square&logo=express)

## Features

- **Streaming responses** — tokens stream in real time via Server-Sent Events
- **Voice input** — Web Speech API, speak directly to Jarvis
- **Voice output** — responses read aloud with Web Speech Synthesis
- **Conversation memory** — full chat history passed on every request
- **Syntax-highlighted code blocks** — via react-syntax-highlighter
- **Markdown rendering** — headers, lists, bold, inline code, all formatted
- **Animated orb** — reacts to idle / thinking / speaking / listening states
- **Prompt suggestions** — quick-start buttons when the chat is empty

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + `@tailwindcss/typography` |
| Animations | Framer Motion |
| Markdown | react-markdown + react-syntax-highlighter |
| Backend | Express + TypeScript (tsx for dev) |
| LLM | LLaMA 3.3 70B via Groq API |
| Streaming | Server-Sent Events (SSE) |
| Voice | Web Speech API (STT + TTS) |

## Project Structure

```
jarvis-ai/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── App.tsx           # Root — state, streaming, voice logic
│       └── components/
│           ├── JarvisOrb.tsx  # Animated orb with status states
│           ├── ChatMessage.tsx # Markdown + syntax-highlighted bubbles
│           ├── ChatInput.tsx   # Input bar with voice + send
│           └── StatusBar.tsx   # Live status indicator
└── server/
    └── src/
        └── server.ts         # Express + Groq streaming endpoint
```

## Run Locally

**Prerequisites:** Node.js 18+, a free [Groq API key](https://console.groq.com)

```bash
# 1. Start the backend
cd server
npm install
echo "GROQ_API_KEY=your_key_here" > .env
npm run dev

# 2. Start the frontend (new terminal)
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies `/chat/*` to `localhost:3000`, so no CORS config needed.
