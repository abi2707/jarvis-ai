import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import JarvisOrb from './components/JarvisOrb'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import StatusBar from './components/StatusBar'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getVoices = (): SpeechSynthesisVoice[] => speechSynthesis.getVoices()

  const speak = (text: string) => {
    window.speechSynthesis.cancel()
    const stripped = text.replace(/```[\s\S]*?```/g, 'code block').replace(/[*_`#>]/g, '').slice(0, 400)
    const utterance = new SpeechSynthesisUtterance(stripped)
    const voices = getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Zira') ||
      v.name.includes('Karen')
    )
    if (preferred) utterance.voice = preferred
    utterance.pitch = 1.1
    utterance.rate = 0.92
    utterance.onstart = () => setStatus('speaking')
    utterance.onend = () => setStatus('idle')
    speechSynthesis.speak(utterance)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text }
    const assistantId = `a-${Date.now()}`
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', streaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsLoading(true)
    setStatus('thinking')

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))

      const base: string = import.meta.env.VITE_API_URL ?? ''
      const res = await fetch(`${base}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const { token } = JSON.parse(data)
            full += token
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: full } : m)
            )
          } catch { /* skip malformed */ }
        }
      }

      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      )
      speak(full)
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Connection error. Is the server running?', streaming: false }
            : m
        )
      )
      setStatus('idle')
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => { setIsListening(true); setStatus('listening') }
    recognition.onend = () => { setIsListening(false); if (status === 'listening') setStatus('idle') }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => sendMessage(e.results[0][0].transcript)
    recognition.onerror = () => { setIsListening(false); setStatus('idle') }
    recognition.start()
  }

  return (
    <div className="flex flex-col h-screen bg-[#02040a] overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-8 pb-3 flex-shrink-0">
        <JarvisOrb status={status} />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-center"
        >
          <h1 className="text-3xl font-light tracking-[0.4em] text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}>
            JARVIS
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-slate-600 mt-1 uppercase">
            AI Personal Assistant
          </p>
        </motion.div>
        <StatusBar status={status} />
      </header>

      {/* Divider */}
      <div className="w-full h-px flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }} />

      {/* Chat */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-6 pt-8"
            >
              <p className="text-slate-600 text-sm tracking-wide">How can I assist you today?</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  'Explain quantum computing simply',
                  'Write a Python sorting algorithm',
                  'What is backpropagation?',
                  'Help me debug my code',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-800 text-slate-500 hover:border-cyan-800 hover:text-cyan-400 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.1), transparent)' }} />
        <ChatInput
          onSend={sendMessage}
          onVoice={startListening}
          isLoading={isLoading}
          isListening={isListening}
        />
      </div>
    </div>
  )
}
