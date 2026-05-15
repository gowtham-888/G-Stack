'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Cpu, Activity } from 'lucide-react'

export default function NeuralViz() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 90); return () => clearInterval(id) }, [])

  const layers = [3, 6, 6, 4, 2]
  const W = 360, H = 180
  const layerX = (i) => 30 + (i * (W - 60)) / (layers.length - 1)
  const nodeY = (count, idx) => (H / (count + 1)) * (idx + 1)

  const nodes = layers.flatMap((c, li) => Array.from({ length: c }).map((_, ni) => ({ x: layerX(li), y: nodeY(c, ni), li, ni })))
  const edges = []
  for (let li = 0; li < layers.length - 1; li++) {
    for (let a = 0; a < layers[li]; a++) for (let b = 0; b < layers[li + 1]; b++) edges.push({ x1: layerX(li), y1: nodeY(layers[li], a), x2: layerX(li + 1), y2: nodeY(layers[li + 1], b), seed: a * 13 + b * 7 + li * 31 })
  }

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shadow-[0_0_18px_rgba(139,92,246,0.5)]">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Neural Inference Engine</div>
            <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Threat propagation · 142 features</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-emerald-400">
          <Activity className="h-3 w-3" /> <span>ANALYZING</span>
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full">
        {edges.map((e, i) => {
          const fire = (tick + e.seed) % 35 < 6
          return <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={fire ? '#a78bfa' : 'rgba(148,163,184,0.08)'} strokeWidth={fire ? 1.2 : 0.5} opacity={fire ? 0.85 : 0.5} />
        })}
        {nodes.map((n, i) => {
          const active = (tick + i * 11) % 20 < 4
          return (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={active ? 5 : 3.2} fill={active ? '#a78bfa' : '#3b82f6'} opacity={active ? 1 : 0.55} />
              {active && <circle cx={n.x} cy={n.y} r={9} fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />}
            </g>
          )
        })}
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { l: 'INPUT', v: '142', c: 'text-blue-300' },
          { l: 'PARAMS', v: '8.4M', c: 'text-purple-300' },
          { l: 'LATENCY', v: '12ms', c: 'text-emerald-300' },
        ].map((s) => (
          <div key={s.l} className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5">
            <div className="mono text-[9px] uppercase tracking-wider text-slate-500">{s.l}</div>
            <div className={`text-sm font-bold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
