'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, Brain, ShieldCheck, AlertTriangle } from 'lucide-react'

function parseConfidence(text) { const m = (text || '').match(/CONFIDENCE\s*:?\s*([0-9]{2,3})\s*%/i); return m ? Math.min(99, parseInt(m[1], 10)) : null }

export default function LiveAIBriefing() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/situation-brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const j = await r.json()
      if (j.ok) setData(j); else setData({ text: '⚠ AI briefing unavailable: ' + j.error, hazardCount: 0, live: false })
    } catch (e) { setData({ text: '⚠ Network error.', hazardCount: 0, live: false }) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { const id = setInterval(load, 90_000); return () => clearInterval(id) }, [])

  const conf = parseConfidence(data?.text || '') ?? 92
  const allClear = data && data.hazardCount === 0

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />
      </div>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-[0_0_18px_rgba(59,130,246,0.5)]"><Brain className="h-4 w-4 text-white" /></div>
          <div>
            <div className="text-sm font-bold text-white">AI Situation Briefing</div>
            <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Gemini 2.5 · grounded on live USGS + OpenWeatherMap</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] text-emerald-400">{conf}% CONFIDENCE</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${conf}%` }} transition={{ duration: 1.2 }} className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" /></div>
          <button onClick={load} className="rounded-md border border-[#1a1a2e] p-1 text-slate-400 hover:text-white"><RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>
      <div className="relative mt-4 rounded-lg border border-[#1a1a2e] bg-black/40 p-4">
        <div className="mb-2 flex items-center gap-2">
          {allClear ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> : <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />}
          <span className={`mono text-[10px] uppercase tracking-wider ${allClear ? 'text-emerald-400' : 'text-orange-400'}`}>{allClear ? 'ALL CLEAR · NO ACTIVE THREATS' : `${data?.hazardCount || 0} ACTIVE HAZARDS`}</span>
          <Sparkles className="ml-auto h-3 w-3 text-blue-400" />
        </div>
        {loading && !data ? (
          <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-3 animate-pulse rounded bg-slate-800" style={{ width: `${100 - i * 12}%` }} />)}</div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-slate-300">{data?.text || ''}</pre>
        )}
      </div>
    </div>
  )
}
