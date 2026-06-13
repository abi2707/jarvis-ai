import { motion } from 'framer-motion'

type Status = 'idle' | 'thinking' | 'speaking' | 'listening'

const statusColor: Record<Status, string> = {
  idle: 'rgba(0, 212, 255, 0.7)',
  thinking: 'rgba(124, 58, 237, 0.9)',
  speaking: 'rgba(0, 212, 255, 0.9)',
  listening: 'rgba(239, 68, 68, 0.9)',
}

const statusGlow: Record<Status, string> = {
  idle: 'rgba(0, 212, 255, 0.15)',
  thinking: 'rgba(124, 58, 237, 0.25)',
  speaking: 'rgba(0, 212, 255, 0.25)',
  listening: 'rgba(239, 68, 68, 0.2)',
}

export default function JarvisOrb({ status }: { status: Status }) {
  const isActive = status !== 'idle'

  return (
    <div className="relative flex items-center justify-center w-28 h-28">

      {/* Outermost ambient ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute w-28 h-28 rounded-full"
        style={{
          border: '1px solid rgba(0, 212, 255, 0.12)',
          boxShadow: isActive ? `0 0 40px ${statusGlow[status]}` : 'none',
        }}
      />

      {/* Dashed orbit ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[88px] h-[88px] rounded-full"
        style={{
          border: '1px dashed rgba(124, 58, 237, 0.25)',
        }}
      />

      {/* Inner solid ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[68px] h-[68px] rounded-full"
        style={{
          border: `1px solid ${statusColor[status]}`,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          opacity: 0.6,
        }}
      />

      {/* Glow halo */}
      <motion.div
        animate={
          isActive
            ? { scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }
            : { scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }
        }
        transition={{ duration: isActive ? 0.9 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-14 h-14 rounded-full"
        style={{
          background: `radial-gradient(circle, ${statusColor[status]} 0%, transparent 70%)`,
          filter: 'blur(6px)',
        }}
      />

      {/* Core orb */}
      <motion.div
        animate={isActive ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${statusColor[status]}, rgba(124,58,237,0.8))`,
          boxShadow: `0 0 20px ${statusColor[status]}, 0 0 40px ${statusGlow[status]}`,
        }}
      >
        {/* Inner shine */}
        <div
          className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full opacity-60"
          style={{ background: 'rgba(255,255,255,0.5)', filter: 'blur(2px)' }}
        />
      </motion.div>

      {/* Thinking dots */}
      {status === 'thinking' && (
        <div className="absolute -bottom-5 flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="w-1 h-1 rounded-full bg-purple-400"
            />
          ))}
        </div>
      )}

      {/* Listening wave rings */}
      {status === 'listening' && (
        <>
          {[1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-red-500/30"
              animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              style={{ width: 40, height: 40 }}
            />
          ))}
        </>
      )}
    </div>
  )
}
