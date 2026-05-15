'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CinematicRadar({ size = 560 }) {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id) }, [])
  const cx = size / 2, cy = size / 2
  const rings = [0.18, 0.34, 0.5, 0.66, 0.82]
  const dots = Array.from({ length: 18 }).map((_, i) => {
    const seed = (i * 9301 + 49297) % 233280
    const a = (seed / 233280) * Math.PI * 2
    const r = ((seed * 7) % 100) / 100 * (size * 0.42) + 30
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, pulse: ((tick + i * 7) % 50) / 50 }
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pointer-events-none">
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#ef4444" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sweep" x1="50%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
          <stop offset="70%" stopColor="#ef4444" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={size * 0.46} fill="url(#rg)" />
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={size * r} fill="none" stroke="rgba(239,68,68,0.18)" strokeWidth="0.7" strokeDasharray={i % 2 ? '2 4' : 'none'} />
      ))}
      <line x1={cx} y1={cy - size * 0.46} x2={cx} y2={cy + size * 0.46} stroke="rgba(239,68,68,0.15)" strokeWidth="0.6" />
      <line x1={cx - size * 0.46} y1={cy} x2={cx + size * 0.46} y2={cy} stroke="rgba(239,68,68,0.15)" strokeWidth="0.6" />
      <line x1={cx - size * 0.33} y1={cy - size * 0.33} x2={cx + size * 0.33} y2={cy + size * 0.33} stroke="rgba(239,68,68,0.08)" strokeWidth="0.5" />
      <line x1={cx - size * 0.33} y1={cy + size * 0.33} x2={cx + size * 0.33} y2={cy - size * 0.33} stroke="rgba(239,68,68,0.08)" strokeWidth="0.5" />
      <motion.g style={{ transformOrigin: `${cx}px ${cy}px` }} animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
        <path d={`M ${cx} ${cy} L ${cx + size * 0.46} ${cy} A ${size * 0.46} ${size * 0.46} 0 0 0 ${cx + Math.cos(-Math.PI / 6) * size * 0.46} ${cy + Math.sin(-Math.PI / 6) * size * 0.46} Z`} fill="url(#sweep)" />
      </motion.g>
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={1.5 + d.pulse * 2} fill="#ef4444" opacity={1 - d.pulse} />
          <circle cx={d.x} cy={d.y} r={1.5} fill="#ef4444" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r="4" fill="#ef4444" />
      <circle cx={cx} cy={cy} r="4" fill="#ef4444">
        <animate attributeName="r" values="4;14;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
