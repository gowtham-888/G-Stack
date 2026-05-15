'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Navigation, Crosshair, Brain, Zap, MapPin } from 'lucide-react'
import { SCENARIO as S } from '@/lib/demo-scenario'
import CountdownTimer from '@/components/demo/countdown-timer'

const DemoMap = dynamic(() => import('@/components/demo/flood-map'), { ssr: false, loading: () => (
  <div className="flex h-full items-center justify-center"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" /><div className="mt-3 mono text-[11px] uppercase tracking-wider text-slate-500">Loading flood model…</div></div></div>
) })

export default function DemoMapPage() {
  return (
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[360px_1fr] sm:px-6">
      <motion.aside initial={false} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <div className="panel-elevated rounded-xl p-5">
          <div className="flex items-center gap-2"><Navigation className="h-4 w-4 text-blue-400" /><div className="text-sm font-bold text-white">Flood Propagation</div></div>
          <div className="mt-3"><CountdownTimer minutes={S.flood_eta_yelahanka_min} label="ETA · YELAHANKA" /></div>
          <div className="mt-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between"><span className="mono text-[10px] uppercase tracking-wider text-slate-500">Origin</span><span className="font-semibold text-white">Hebbal Lake</span></div>
            <div className="flex justify-between"><span className="mono text-[10px] uppercase tracking-wider text-slate-500">Rise rate</span><span className="font-semibold text-red-300">+{S.hebbal_water_rate_cm_per_min} cm/min</span></div>
            <div className="flex justify-between"><span className="mono text-[10px] uppercase tracking-wider text-slate-500">Spread vector</span><span className="font-semibold text-orange-300">{S.spread_vector}</span></div>
            <div className="flex justify-between"><span className="mono text-[10px] uppercase tracking-wider text-slate-500">Affected</span><span className="font-semibold text-white">{S.affected_people.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="panel-elevated rounded-xl p-5">
          <div className="flex items-center gap-2"><Crosshair className="h-4 w-4 text-red-400" /><div className="text-sm font-bold text-white">Active Shelters</div></div>
          <div className="mt-3 space-y-1.5">
            {S.shelter_pins.map(s => (
              <div key={s.name} className="flex items-center justify-between rounded border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-emerald-400" /><span className="text-xs font-semibold text-white">{s.name}</span></div>
                <span className="mono text-[9px] uppercase tracking-wider text-emerald-400">cap {s.cap}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel-elevated rounded-xl p-5">
          <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-purple-400" /><div className="text-sm font-bold text-white">AI Recommendation</div></div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">Hebbal water level critical. Evacuate all civilians north-east corridor to <b>Yelahanka Community Hall</b>. Avoid ORR underpass and Hebbal lake bridge. Deploy NDRF Alpha to spread vector front line.</p>
          <div className="mt-2 flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-emerald-400"><Zap className="h-3 w-3" /> 97% confidence · Gemini scripted</div>
        </div>
      </motion.aside>
      <motion.div initial={false} animate={{ opacity: 1 }} className="panel-elevated relative h-[78vh] min-h-[640px] overflow-hidden rounded-xl">
        <DemoMap />
      </motion.div>
    </div>
  )
}
