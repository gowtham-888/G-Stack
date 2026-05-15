'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AlertTriangle, CloudRain, Wind, Users, MapPin, ChevronDown, Bell, Send, Volume2 } from 'lucide-react'
import { SCENARIO as S } from '@/lib/demo-scenario'
import CountdownTimer from '@/components/demo/countdown-timer'

function playAlarm() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = new AC()
    const beep = (f, t0, d) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ctx.currentTime + t0); g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + d); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + d) }
    for (let i = 0; i < 5; i++) { beep(880, i * 0.5, 0.22); beep(1320, i * 0.5 + 0.25, 0.22) }
  } catch {}
}

const alerts = [
  { id: 'a1', sev: 'CRIT', icon: CloudRain, title: 'Flash Flood · Bangalore North', loc: 'Hebbal Lake basin', affected: S.affected_people, desc: `Hebbal water table rising ${S.hebbal_water_rate_cm_per_min}cm/min. Spread vector ${S.spread_vector}. Predicted impact at Yelahanka in ${S.flood_eta_yelahanka_min} minutes.`, eta: S.flood_eta_yelahanka_min },
  { id: 'a2', sev: 'CRIT', icon: AlertTriangle, title: 'Rising Water Table — Hebbal', loc: 'Hebbal Lake', affected: 4800, desc: `Lake spillway at 112% capacity. Overflow imminent. NDRF Alpha enroute to control bunds.`, eta: 12 },
  { id: 'a3', sev: 'HIGH', icon: Wind, title: 'Severe Wind Advisory', loc: 'Bangalore Metropolitan', affected: 87000, desc: `Sustained winds ${S.wind_kmph} km/h from ${S.wind_direction}. Tree fall risk, power line hazard.`, eta: 180 },
  { id: 'a4', sev: 'HIGH', icon: CloudRain, title: 'Heavy Rainfall — 3h cumulative', loc: 'Bangalore N + central', affected: 38000, desc: `${S.rainfall_mm_last_3h}mm in last 3 hours. Drains overwhelmed. Underpass closures recommended.`, eta: 60 },
]

const sevMap = { CRIT: 'border-red-500/40 bg-red-500/10 text-red-300', HIGH: 'border-orange-500/40 bg-orange-500/10 text-orange-300' }

export default function DemoAlerts() {
  const [expanded, setExpanded] = useState('a1')
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-red-400">EMERGENCY ALERTS · SCRIPTED</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Bangalore Flood — Live Threat Board</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CountdownTimer minutes={S.flood_eta_yelahanka_min} label="YELAHANKA IMPACT" />
          <button onClick={playAlarm} className="btn-glow flex items-center gap-1.5 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 text-xs font-semibold text-white"><Volume2 className="h-3.5 w-3.5" /> Replay Alarm</button>
          <button className="flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"><Send className="h-3.5 w-3.5" /> Broadcast</button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((a, i) => {
          const Icon = a.icon
          const open = expanded === a.id
          return (
            <motion.div key={a.id} layout initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`panel-elevated relative overflow-hidden rounded-xl ${a.sev === 'CRIT' ? 'border-red-500/40' : 'border-orange-500/40'}`}>
              {a.sev === 'CRIT' && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />}
              <button onClick={() => setExpanded(open ? null : a.id)} className="flex w-full items-center gap-4 p-4 text-left">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${sevMap[a.sev]} ${a.sev === 'CRIT' ? 'animate-pulse-glow' : ''}`}><Icon className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className={`rounded border px-1.5 py-0.5 mono text-[9px] font-bold ${sevMap[a.sev]}`}>{a.sev}</span><span className="mono text-[10px] uppercase tracking-wider text-slate-500">SCRIPTED</span></div>
                  <div className="mt-1 text-sm font-semibold text-white sm:text-base">{a.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.loc}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.affected.toLocaleString()} affected</span>
                    <span className="flex items-center gap-1">ETA {a.eta}m</span>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[#1a1a2e]">
                    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_auto]">
                      <div>
                        <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Intelligence Summary</div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.desc}</p>
                      </div>
                      <div className="flex flex-wrap items-end gap-2">
                        <button className="btn-glow rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3.5 py-2 text-xs font-semibold text-white">Dispatch Team</button>
                        <button className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300">Broadcast Civilian Alert</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
