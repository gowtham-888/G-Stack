'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Waves, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'

function relTime(t) { const d = (Date.now() - t) / 1000; if (d < 60) return `${Math.round(d)}s ago`; if (d < 3600) return `${Math.round(d / 60)}m ago`; return `${Math.round(d / 3600)}h ago` }

export default function EarthquakeFeed({ compact = false }) {
  const [data, setData] = useState({ items: null, isFallback: false })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const r = await fetch('/api/live-feed')
      const j = await r.json()
      const items = (j.seismicDisplay && j.seismicDisplay.length) ? j.seismicDisplay : (j.usgs || [])
      setData({ items, isFallback: !!j.seismicFallback })
    } catch { setData({ items: [], isFallback: false }) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { const id = setInterval(load, 60_000); return () => clearInterval(id) }, [])

  const items = data.items || []
  const display = items.slice(0, compact ? 5 : 8)

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Waves className="h-4 w-4 text-red-400" /><div className="text-sm font-bold text-white">Live Seismic Feed</div></div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-emerald-400">USGS · LIVE</span>
          <button onClick={load} className="rounded-md border border-[#1a1a2e] p-1 text-slate-400 hover:text-white"><RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>
      <div className="mt-1 mono text-[10px] uppercase tracking-wider text-slate-500">
        {data.isFallback ? 'No India seismic activity · Showing global feed' : `India region · last 24h · ${items.length} events`}
      </div>

      <div className="mt-3 space-y-1.5">
        {loading && !data.items && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-md border border-[#1a1a2e] bg-[#0a0a0f]" />)}
        {display.map((e, i) => {
          const mag = e.mag ?? 0
          const color = mag >= 5 ? 'red' : mag >= 4 ? 'orange' : mag >= 3 ? 'blue' : 'emerald'
          const cls = color === 'red' ? 'border-red-500/40 text-red-300 bg-red-500/10' : color === 'orange' ? 'border-orange-500/40 text-orange-300 bg-orange-500/10' : color === 'blue' ? 'border-blue-500/40 text-blue-300 bg-blue-500/10' : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
          return (
            <motion.a key={`${e.time}-${i}`} href={e.url} target="_blank" rel="noreferrer"
              initial={false} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2 hover:bg-[#13131f]">
              <span className={`rounded border px-1.5 py-0.5 mono text-[10px] font-bold ${cls}`}>M{mag?.toFixed(1)}</span>
              {mag >= 4 && <span className="rounded border border-red-500/40 bg-red-500/15 px-1.5 py-0.5 mono text-[9px] font-bold text-red-300">SIGNIFICANT</span>}
              <span className="min-w-0 flex-1 truncate text-xs text-slate-200">{e.place}</span>
              <span className="mono text-[10px] text-slate-500">{relTime(e.time)}</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}
