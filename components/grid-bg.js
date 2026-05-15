'use client'
import { motion } from 'framer-motion'

export default function GridBG({ variant = 'blue' }) {
  const color = variant === 'red' ? 'rgba(239,68,68,0.07)' : 'rgba(59,130,246,0.07)'
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-grid-drift"
        style={{
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
      <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[420px] w-[620px] rounded-full bg-blue-500/10 blur-[140px]" />
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-red-400/60 shadow-[0_0_12px_rgba(239,68,68,0.9)]"
          initial={{ x: `${(i * 73) % 100}%`, y: '100%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 1, 0] }}
          transition={{ duration: 8 + (i % 5), repeat: Infinity, delay: i * 0.6, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
