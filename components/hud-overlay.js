'use client'
import { motion } from 'framer-motion'

export default function HudOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span key={i}
          className="absolute h-[3px] w-[3px] rounded-full"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, background: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#3b82f6' : '#22c55e', boxShadow: '0 0 8px currentColor' }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
      {/* Top corner brackets */}
      <div className="absolute left-3 top-16 h-6 w-6 border-l border-t border-red-500/40" />
      <div className="absolute right-3 top-16 h-6 w-6 border-r border-t border-red-500/40" />
      <div className="absolute left-3 bottom-3 h-6 w-6 border-l border-b border-red-500/40" />
      <div className="absolute right-3 bottom-3 h-6 w-6 border-r border-b border-red-500/40" />
      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
