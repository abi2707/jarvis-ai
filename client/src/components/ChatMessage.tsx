import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '../App'

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isEmpty = !message.content && message.streaming

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full mr-2 mt-1 flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #00d4ff, #7c3aed)',
            boxShadow: '0 0 8px rgba(0,212,255,0.4)',
          }}>
          <div className="w-2 h-2 rounded-full bg-white/80" />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-tr-sm'
            : 'rounded-tl-sm'
        }`}
        style={{
          background: isUser
            ? 'rgba(0, 212, 255, 0.07)'
            : 'rgba(255, 255, 255, 0.03)',
          border: isUser
            ? '1px solid rgba(0, 212, 255, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(12px)',
          boxShadow: isUser
            ? '0 0 20px rgba(0, 212, 255, 0.05)'
            : '0 2px 20px rgba(0,0,0,0.3)',
        }}
      >
        {isUser ? (
          <p className="text-slate-200">{message.content}</p>
        ) : (
          <div className="text-slate-300 prose prose-invert prose-sm max-w-none
            prose-p:my-1.5 prose-p:leading-relaxed
            prose-headings:text-cyan-300 prose-headings:font-medium
            prose-strong:text-slate-100
            prose-code:text-cyan-300 prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-2
            prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
            prose-blockquote:border-cyan-800 prose-blockquote:text-slate-400">
            {isEmpty ? (
              <span className="inline-block w-0.5 h-4 bg-cyan-400 cursor-blink align-middle" />
            ) : (
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          borderRadius: '8px',
                          fontSize: '12px',
                          margin: '4px 0',
                          background: 'rgba(0,0,0,0.6)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>{children}</code>
                    )
                  },
                }}
              >
                {message.content + (message.streaming ? '▌' : '')}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full ml-2 mt-1 flex items-center justify-center bg-slate-700 border border-slate-600">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-300" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      )}
    </motion.div>
  )
}
