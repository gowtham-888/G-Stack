'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, AlertOctagon, Wind, Waves, ShieldCheck } from 'lucide-react'

const iconFor = (kind, sev) => sev === 'CRIT' ? AlertOctagon : kind === 'earthquake' ? Waves : kind === 'weather' ? Wind : AlertOctagon
const colorFor = (sev) => sev === 'CRIT' ? 'red' : sev === 'HIGH' ? 'orange' : 'blue'
const c = (col) => ({
  red: { ring: 'border-red-500/40', bg: 'bg-red-500/10', text: 'text-red-300', bar: 'from-red-500 to-orange-500' },
  orange: { ring: 'border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-300', bar: 'from-orange-500 to-yellow-500' },
  blue: { ring: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-300', bar: 'from-blue-500 to-purple-500' },
})[col]

export default function Predictions() {
  const [hazards, setHazards] = useState(null)
  useEffect(() => {
    let alive = true
    const load = async () => { try { const r = await fetch('/api/live-feed'); const j = await r.json(); if (alive) setHazards(j.hazards || []) } catch { setHazards([]) } }
    load(); const id = setInterval(load, 90_000); return () => { alive = false; clearInterval(id) }
  }, [])

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-400" /><div className="text-sm font-bold text-white">Live Threat Predictions</div></div>
        <span className="mono text-[10px] uppercase tracking-wider text-slate-500">live · USGS + OWM</span>
      </div>

      {hazards === null && <div className="mt-4 space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 animate-pulse rounded-lg border border-[#1a1a2e] bg-[#0a0a0f]" />)}</div>}

      {hazards && hazards.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <ShieldCheck className="h-8 w-8 text-emerald-400" />
          <div className="mt-2 text-sm font-bold text-white">All clear</div>
          <div className="mt-0.5 text-xs text-slate-400">No active threats in monitored Karnataka grid.</div>
        </div>
      )}

      {hazards && hazards.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {hazards.slice(0, 4).map((h, i) => {
            const Icon = iconFor(h.kind, h.sev)
            const s = c(colorFor(h.sev))
            const conf = h.sev === 'CRIT' ? 94 : h.sev === 'HIGH' ? 84 : 72
            return (
              <motion.div key={h.id} initial={false} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`group rounded-lg border ${s.ring} ${s.bg} p-3 transition hover:-translate-y-0.5`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${s.ring} bg-[#0a0a0f] ${s.text}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-xs font-semibold text-white">{h.title}</div>
                      <div className={`mono text-[10px] font-bold ${s.text}`}>{h.sev}</div>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">{h.source} · {h.kind}{h.meta?.magnitude ? ` · M${h.meta.magnitude.toFixed(1)}` : ''}{h.meta?.wind_ms != null ? ` · wind ${h.meta.wind_ms}m/s` : ''}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${conf}%` }} transition={{ duration: 1.2, delay: i * 0.05 }} className={`h-full bg-gradient-to-r ${s.bar}`} />
                      </div>
                      <span className="mono text-[10px] text-slate-400">{conf}% conf</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
