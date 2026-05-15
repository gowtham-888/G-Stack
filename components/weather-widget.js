'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Wind, Droplets, Thermometer, RefreshCw, Cloud } from 'lucide-react'

export default function WeatherWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const load = async () => {
    try { setLoading(true); const r = await fetch('/api/weather'); const j = await r.json(); setData(j.items || []) } catch { setData([]) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { const id = setInterval(load, 180_000); return () => clearInterval(id) }, [])

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-blue-400" /><div className="text-sm font-bold text-white">Live Weather Grid</div></div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] uppercase tracking-wider text-emerald-400">OPENWEATHER · LIVE</span>
          <button onClick={load} className="rounded-md border border-[#1a1a2e] p-1 text-slate-400 hover:text-white"><RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {loading && !data && Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-md border border-[#1a1a2e] bg-[#0a0a0f]" />)}
        {(data || []).map((w, i) => {
          const danger = (w.wind || 0) > 16 || (w.rain || 0) > 8
          return (
            <motion.div key={w.city} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`rounded-lg border bg-[#0a0a0f] p-3 ${danger ? 'border-red-500/40' : 'border-[#1a1a2e]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{w.city}</span>
                {danger && <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 mono text-[9px] font-bold text-red-300">ALERT</span>}
              </div>
              <div className="mt-1.5 grid grid-cols-4 gap-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-orange-400" />{w.temp != null ? `${Math.round(w.temp)}°` : '—'}</div>
                <div className="flex items-center gap-1"><Wind className="h-3 w-3 text-blue-400" />{w.wind ? `${w.wind}m/s` : '—'}</div>
                <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-cyan-400" />{w.humidity ?? '—'}%</div>
                <div className="flex items-center gap-1"><CloudRain className="h-3 w-3 text-emerald-400" />{(w.rain || 0).toFixed(1)}mm</div>
              </div>
              {w.desc && <div className="mt-1 mono text-[10px] uppercase tracking-wider text-slate-500">{w.desc}</div>}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
