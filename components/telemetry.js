'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

function Spark({ data, color }) {
  const W = 120, H = 36
  const max = Math.max(...data), min = Math.min(...data)
  const norm = (v) => H - ((v - min) / (max - min || 1)) * (H - 4) - 2
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (data.length - 1)) * W} ${norm(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full">
      <defs>
        <linearGradient id={`sp-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill={`url(#sp-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={W} cy={norm(data[data.length - 1])} r="2" fill={color} />
    </svg>
  )
}

const seedSeries = (base, amp) => Array.from({ length: 22 }).map((_, i) => base + Math.sin(i * 0.6) * amp + (Math.random() - 0.5) * amp * 0.5)

export default function Telemetry() {
  const [s1, setS1] = useState(seedSeries(60, 12))
  const [s2, setS2] = useState(seedSeries(40, 14))
  const [s3, setS3] = useState(seedSeries(80, 8))
  const [s4, setS4] = useState(seedSeries(50, 16))

  useEffect(() => {
    const id = setInterval(() => {
      const push = (arr, base, amp) => { const n = base + Math.sin(Date.now() / 800) * amp + (Math.random() - 0.5) * amp * 0.6; return [...arr.slice(1), n] }
      setS1(p => push(p, 60, 12)); setS2(p => push(p, 40, 14)); setS3(p => push(p, 80, 8)); setS4(p => push(p, 50, 16))
    }, 1100)
    return () => clearInterval(id)
  }, [])

  const items = [
    { l: 'CPU LOAD', v: Math.round(s1[s1.length - 1]) + '%', data: s1, color: '#ef4444', up: true, d: '+2.1%' },
    { l: 'NETWORK I/O', v: Math.round(s2[s2.length - 1]) + 'Mb', data: s2, color: '#f97316', up: false, d: '-0.8%' },
    { l: 'AI INFERENCE/s', v: Math.round(s3[s3.length - 1]), data: s3, color: '#3b82f6', up: true, d: '+5.4%' },
    { l: 'GPS PINGS', v: Math.round(s4[s4.length - 1]) + 'k', data: s4, color: '#22c55e', up: true, d: '+12%' },
  ]

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-white">System Telemetry</div>
        <span className="mono text-[10px] uppercase tracking-wider text-slate-500">live · 1.1s</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((it, i) => (
          <motion.div key={it.l} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-[#1a1a2e] bg-[#0a0a0f] p-3">
            <div className="flex items-center justify-between">
              <span className="mono text-[9px] uppercase tracking-wider text-slate-500">{it.l}</span>
              <span className={`flex items-center gap-0.5 mono text-[10px] ${it.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {it.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />} {it.d}
              </span>
            </div>
            <div className="mt-1 text-lg font-extrabold text-white tabular-nums">{it.v}</div>
            <Spark data={it.data} color={it.color} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
