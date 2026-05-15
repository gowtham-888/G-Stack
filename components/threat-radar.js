'use client'
import { motion } from 'framer-motion'

export default function ThreatRadar({ size = 260, label = 'CRITICAL THREAT' }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[1, 2, 3].map((r) => (
        <motion.span
          key={r}
          className="absolute inset-0 rounded-full border border-red-500/40"
          initial={{ scale: 0.4, opacity: 0.8 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, delay: r * 0.7, ease: 'easeOut' }}
        />
      ))}
      <div className="absolute inset-6 rounded-full border border-red-500/20" />
      <div className="absolute inset-12 rounded-full border border-red-500/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse-glow">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-red-600" />
        </div>
      </div>
      <div className="absolute inset-0 origin-center animate-radar-sweep" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(239,68,68,0.25) 50deg, transparent 60deg)', borderRadius: '50%', maskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.25em] text-red-400/80">{label}</div>
    </div>
  )
}
