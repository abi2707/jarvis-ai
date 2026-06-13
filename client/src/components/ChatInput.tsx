import { useState, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onSend: (text: string) => void
  onVoice: () => void
  isLoading: boolean
  isListening: boolean
}

export default function ChatInput({ onSend, onVoice, isLoading, isListening }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !isLoading

  return (
    <div className="px-4 md:px-8 lg:px-16 pb-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl px-4 py-3 relative"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Focus glow */}
        <AnimatePresence>
          {value.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(0,212,255,0.15)' }}
            />
          )}
        </AnimatePresence>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Jarvis anything..."
          disabled={isLoading}
          className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600 disabled:opacity-50 min-w-0"
          autoFocus
        />

        {/* Char count (when typing) */}
        <AnimatePresence>
          {value.length > 80 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-slate-600 flex-shrink-0"
            >
              {value.length}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Voice button */}
        <motion.button
          onClick={onVoice}
          whileTap={{ scale: 0.88 }}
          title="Voice input"
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative overflow-hidden"
          style={{
            background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
            border: isListening ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-red-500/20"
            />
          )}
          <svg viewBox="0 0 24 24" className="w-4 h-4 relative z-10" fill="currentColor"
            style={{ color: isListening ? '#ef4444' : '#64748b' }}>
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
          </svg>
        </motion.button>

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          whileTap={{ scale: 0.88 }}
          title="Send message"
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed"
          style={{
            background: canSend
              ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
              : 'rgba(255,255,255,0.05)',
            boxShadow: canSend ? '0 0 16px rgba(0,212,255,0.3)' : 'none',
            border: canSend ? 'none' : '1px solid rgba(255,255,255,0.08)',
            opacity: canSend ? 1 : 0.4,
          }}
          animate={canSend ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
            />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </motion.button>
      </motion.div>

      <p className="text-center text-[10px] text-slate-700 mt-2 tracking-wide">
        Powered by LLaMA 3.3 70B via Groq · Web Speech API
      </p>
    </div>
  )
}
