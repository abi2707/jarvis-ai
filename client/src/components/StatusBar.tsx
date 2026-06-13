import { motion, AnimatePresence } from 'framer-motion'

type Status = 'idle' | 'thinking' | 'speaking' | 'listening'

const labels: Record<Status, string> = {
  idle: 'Online',
  thinking: 'Processing...',
  speaking: 'Speaking',
  listening: 'Listening...',
}

const colors: Record<Status, string> = {
  idle: '#22c55e',
  thinking: '#a855f7',
  speaking: '#00d4ff',
  listening: '#ef4444',
}

export default function StatusBar({ status }: { status: Status }) {
  return (
    <div className="flex items-center gap-2 mt-3">
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: status === 'idle' ? 3 : 0.8, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors[status] }}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] tracking-widest uppercase"
          style={{ color: colors[status] }}
        >
          {labels[status]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
