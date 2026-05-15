'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Navigation, Layers, Crosshair, ShieldAlert, Zap, Brain, MapPin, AlertTriangle, ArrowRight } from 'lucide-react'

const TacticalMap = dynamic(() => import('@/components/tactical-map'), { ssr: false, loading: () => (
  <div className="flex h-full w-full items-center justify-center bg-[#0a0a0f]">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      <div className="mt-3 mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Loading tactical grid…</div>
    </div>
  </div>
) })

const disasters = [
  { id: 1, name: 'Bengaluru Floods', loc: 'Bangalore N', sev: 'CRIT' },
  { id: 2, name: 'Shiradi Landslide', loc: 'Western Ghats', sev: 'HIGH' },
  { id: 3, name: 'Cyclone Biparjoy', loc: 'Mangalore', sev: 'CRIT' },
  { id: 4, name: 'Kaveri Overflow', loc: 'Mandya', sev: 'HIGH' },
]

const sevColor = (s) => ({
  CRIT: 'border-red-500/40 bg-red-500/10 text-red-300',
  HIGH: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
})[s]

export default function MapPage() {
  const [selected, setSelected] = useState(1)
  return (
    <div className="relative">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[360px_1fr] sm:px-6">
        {/* LEFT PANEL */}
        <motion.aside initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
          <div className="panel-elevated rounded-xl p-5">
            <div className="flex items-center gap-2"><Navigation className="h-4 w-4 text-blue-400" /><div className="text-sm font-bold text-white">Route Optimizer</div></div>
            <div className="mt-4 space-y-3">
              <Field label="Origin" value="NDRF HQ · Yelahanka" />
              <Field label="Destination" value="Hebbal Shelter Zone" />
              <div className="grid grid-cols-3 gap-2">
                <Stat label="ETA" value="08:42" color="blue" />
                <Stat label="DISTANCE" value="12.4 km" color="slate" />
                <Stat label="SAFETY" value="98%" color="emerald" />
              </div>
              <button className="btn-glow w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(59,130,246,0.35)]">
                Generate Safe Corridor
              </button>
            </div>
          </div>

          <div className="panel-elevated rounded-xl p-5">
            <div className="flex items-center gap-2"><Crosshair className="h-4 w-4 text-red-400" /><div className="text-sm font-bold text-white">Active Disasters</div></div>
            <div className="mt-3 space-y-2">
              {disasters.map((d) => (
                <button key={d.id} onClick={() => setSelected(d.id)}
                  className={`group flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition ${selected === d.id ? 'border-red-500/50 bg-red-500/10' : 'border-[#1a1a2e] bg-[#0a0a0f] hover:bg-[#13131f]'}`}>
                  <div>
                    <div className="text-xs font-semibold text-white">{d.name}</div>
                    <div className="mono text-[10px] text-slate-500">{d.loc}</div>
                  </div>
                  <span className={`rounded border px-1.5 py-0.5 mono text-[9px] font-bold ${sevColor(d.sev)}`}>{d.sev}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-elevated rounded-xl p-5">
            <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-purple-400" /><div className="text-sm font-bold text-white">AI Recommendation</div></div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">Avoid Outer Ring Rd between Hebbal & Yeshwanthpur. Recommend routing via Bellary Rd → Mekhri Circle → Sankey Tank corridor. Estimated 12 min saved, 0 hazard intersections.</p>
            <div className="mt-3 flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-emerald-400"><Zap className="h-3 w-3" /> 94.2% confidence · Gemini v2.5</div>
          </div>

          <div className="panel-elevated rounded-xl p-5">
            <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-orange-400" /><div className="text-sm font-bold text-white">Hazard Layers</div></div>
            <div className="mt-3 space-y-2">
              {[
                { name: 'Flood Depth', on: true, c: 'red' },
                { name: 'Landslide Risk', on: true, c: 'orange' },
                { name: 'Wind Speed', on: false, c: 'blue' },
                { name: 'Population Density', on: true, c: 'emerald' },
              ].map((l) => (
                <div key={l.name} className="flex items-center justify-between rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${l.c === 'red' ? 'bg-red-400' : l.c === 'orange' ? 'bg-orange-400' : l.c === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'} ${l.on ? 'animate-pulse' : 'opacity-30'}`} />
                    <span className="text-xs text-slate-200">{l.name}</span>
                  </div>
                  <span className={`mono text-[9px] ${l.on ? 'text-emerald-400' : 'text-slate-600'}`}>{l.on ? 'ON' : 'OFF'}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* MAP */}
        <motion.div initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="panel-elevated relative h-[78vh] min-h-[640px] overflow-hidden rounded-xl">
          <div className="absolute left-4 top-4 z-[400] flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-black/60 px-2.5 py-1 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" /></span>
              <span className="mono text-[10px] uppercase tracking-wider text-red-300">LIVE · KARNATAKA</span>
            </div>
            <div className="rounded-md border border-[#1a1a2e] bg-black/60 px-2.5 py-1 mono text-[10px] uppercase tracking-wider text-slate-300 backdrop-blur">12.97°N · 77.59°E</div>
          </div>
          <div className="absolute right-4 top-4 z-[400] flex gap-1.5">
            {['SAT', 'HYBRID', 'TERRAIN', 'DARK'].map((m, i) => (
              <button key={m} className={`rounded-md border px-2.5 py-1 mono text-[10px] uppercase tracking-wider backdrop-blur ${i === 3 ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-[#1a1a2e] bg-black/60 text-slate-400 hover:text-white'}`}>{m}</button>
            ))}
          </div>
          <TacticalMap />
          <div className="pointer-events-none absolute inset-0 z-[300] tactical-grid-fine opacity-30" />
          <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-wrap items-center gap-2">
            <Legend color="red" label="Critical hazard" />
            <Legend color="orange" label="High threat" />
            <Legend color="blue" label="Safe route" />
            <Legend color="emerald" label="Shelter" />
            <div className="ml-auto flex items-center gap-2 rounded-md border border-[#1a1a2e] bg-black/60 px-2.5 py-1 mono text-[10px] uppercase tracking-wider text-slate-300 backdrop-blur">
              <MapPin className="h-3 w-3 text-red-400" /> 7 hazards · 42 units · 18 shelters
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2">
      <div className="mono text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  )
}
function Stat({ label, value, color }) {
  const c = { blue: 'text-blue-400', emerald: 'text-emerald-400', slate: 'text-slate-300' }[color]
  return (
    <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5">
      <div className="mono text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-sm font-bold ${c}`}>{value}</div>
    </div>
  )
}
function Legend({ color, label }) {
  const c = { red: 'bg-red-400', orange: 'bg-orange-400', blue: 'bg-blue-400', emerald: 'bg-emerald-400' }[color]
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-[#1a1a2e] bg-black/60 px-2.5 py-1 mono text-[10px] uppercase tracking-wider text-slate-300 backdrop-blur">
      <span className={`h-2 w-2 rounded-full ${c} animate-pulse`} /> {label}
    </div>
  )
}
