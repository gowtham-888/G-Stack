'use client'
import { useEffect, useState } from 'react'

const color = (s) => s === 'CRIT' ? 'text-red-400 bg-red-500/10 border-red-500/30'
  : s === 'HIGH' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
  : s === 'MED' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
const dot = (s) => s === 'CRIT' ? 'bg-red-400' : s === 'HIGH' ? 'bg-orange-400' : s === 'MED' ? 'bg-blue-400' : 'bg-emerald-400'

function relTime(t) { const d = (Date.now() - t) / 1000; if (d < 60) return `${Math.round(d)}s`; if (d < 3600) return `${Math.round(d / 60)}m`; return `${Math.round(d / 3600)}h` }

export default function AlertTicker() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const r = await fetch('/api/live-feed'); const j = await r.json()
        if (!alive) return
        const out = []
        for (const h of (j.hazards || [])) out.push({ sev: h.sev, text: `${h.title} · ${h.source}`, t: h.time })
        // Append nominal weather feed as info
        for (const w of (j.weather || []).slice(0, 4)) if (!w.error) out.push({ sev: 'SAFE', text: `${w.city} · ${w.temp?.toFixed(0)}°C · ${w.desc} · wind ${w.wind}m/s · rain ${w.rain}mm`, t: Date.now() })
        if (out.length === 0) out.push({ sev: 'SAFE', text: 'All Karnataka monitoring stations nominal · USGS + OpenWeatherMap live', t: Date.now() })
        setItems(out)
      } catch {}
    }
    load(); const id = setInterval(load, 90_000); return () => { alive = false; clearInterval(id) }
  }, [])

  const loop = [...items, ...items]
  if (items.length === 0) return null
  return (
    <div className="relative overflow-hidden border-y border-[#1a1a2e] bg-[#0a0a0f]">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
      <div className="flex w-max animate-ticker py-2.5">
        {loop.map((it, i) => (
          <div key={i} className={`mx-2 flex items-center gap-2 rounded border px-3 py-1 mono text-[11px] uppercase tracking-wider ${color(it.sev)}`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot(it.sev)} opacity-75`} />
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot(it.sev)}`} />
            </span>
            <span>{it.sev}</span>
            <span className="text-slate-300/90 normal-case">{it.text}</span>
            <span className="text-slate-500">· {relTime(it.t)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
