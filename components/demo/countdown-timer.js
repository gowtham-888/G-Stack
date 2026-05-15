'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer({ minutes = 47, label = 'ETA', big = false }) {
  const [remaining, setRemaining] = useState(minutes * 60)
  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const m = Math.floor(remaining / 60); const s = remaining % 60
  const danger = remaining < 600
  return (
    <div className={`inline-flex flex-col items-center gap-1 rounded-xl border ${danger ? 'border-red-500/50 bg-red-500/10' : 'border-orange-500/40 bg-orange-500/10'} px-6 py-3`}>
      <div className={`mono text-[10px] uppercase tracking-[0.25em] ${danger ? 'text-red-300' : 'text-orange-300'}`}>{label}</div>
      <motion.div animate={{ opacity: [1, 0.55, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
        className={`tabular-nums mono font-extrabold tracking-tight ${big ? 'text-5xl' : 'text-2xl'} ${danger ? 'text-red-400' : 'text-orange-400'}`}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </motion.div>
    </div>
  )
}
