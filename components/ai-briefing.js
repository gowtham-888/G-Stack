'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mic, Volume2, RefreshCw, ChevronRight, Brain } from 'lucide-react'

const BRIEF = `INTEL · 14:32 IST — Karnataka Emergency Grid\n\nFlood threat escalating in Bangalore North (sector 7B). Hebbal & Yelahanka underpasses submerged. Predicted spread: 2.4 km radius within 90 minutes.\n\nRecommended action: Reroute civilian traffic via Outer Ring Rd → Bellary Rd corridor. Deploy 3 rescue units to Hebbal junction. Coordinate with KSRTC for emergency bus evac of low-lying zones.\n\nConfidence: 94.2% · Source: Gemini AI + IMD Doppler + 142 ground sensors.`

const ACTIONS = [
  { label: 'Dispatch Rescue Team Alpha', color: 'red' },
  { label: 'Broadcast Civilian Alert', color: 'orange' },
  { label: 'Open Safe Corridor — ORR', color: 'green' },
  { label: 'Notify District Magistrate', color: 'blue' },
]

const colorMap = {
  red: 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300',
  orange: 'border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300',
  green: 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300',
  blue: 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300',
}

export default function AIBriefing() {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setTyped(''); setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 3
      setTyped(BRIEF.slice(0, i))
      if (i >= BRIEF.length) { clearInterval(id); setDone(true) }
    }, 20)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-[0_0_18px_rgba(59,130,246,0.5)]">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">AI Situation Briefing</div>
            <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Powered by Gemini · v2.5 Pro</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] text-emerald-400">94.2% CONFIDENCE</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
            <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 1.4, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" />
          </div>
        </div>
      </div>

      <div className="relative mt-4 rounded-lg border border-[#1a1a2e] bg-black/40 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="mono text-[10px] uppercase tracking-wider text-blue-400">Live Intelligence Feed</span>
          {!done && <div className="shimmer-bar ml-auto h-1 w-20 rounded-full bg-slate-800" />}
        </div>
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-slate-300">
          {typed}
          {!done && <span className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 animate-pulse bg-blue-400" />}
        </pre>
      </div>

      <div className="relative mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ACTIONS.map((a, i) => (
          <motion.button
            key={a.label}
            initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
            whileHover={{ y: -2 }}
            className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition ${colorMap[a.color]}`}
          >
            <span>{a.label}</span>
            <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </motion.button>
        ))}
      </div>

      <div className="relative mt-4 flex items-center gap-2 border-t border-[#1a1a2e] pt-3">
        <button className="flex items-center gap-1.5 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-1.5 mono text-[10px] uppercase tracking-wider text-slate-300 hover:bg-[#13131f]"><Volume2 className="h-3 w-3" /> Voice Briefing</button>
        <button className="flex items-center gap-1.5 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-1.5 mono text-[10px] uppercase tracking-wider text-slate-300 hover:bg-[#13131f]"><Mic className="h-3 w-3" /> Ask Gemini</button>
        <button className="ml-auto flex items-center gap-1.5 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-1.5 mono text-[10px] uppercase tracking-wider text-slate-300 hover:bg-[#13131f]"><RefreshCw className="h-3 w-3" /> Refresh</button>
      </div>
    </div>
  )
}
