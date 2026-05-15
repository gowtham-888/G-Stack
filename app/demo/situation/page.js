'use client'
import { motion } from 'framer-motion'
import { Shield, Crosshair, Users, MapPin, Wind, CloudRain, Droplets, Activity, AlertTriangle } from 'lucide-react'
import { SCENARIO as S } from '@/lib/demo-scenario'
import DemoGeminiChat from '@/components/demo/gemini-chat'
import CountdownTimer from '@/components/demo/countdown-timer'
import ThreatRadar from '@/components/threat-radar'
import AnimatedCounter from '@/components/animated-counter'
import GridBG from '@/components/grid-bg'

export default function DemoSituation() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[#1a1a2e]">
        <GridBG variant="red" />
        <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="panel-elevated relative overflow-hidden rounded-xl p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_18px_rgba(239,68,68,0.55)]"><Shield className="h-4 w-4 text-white" strokeWidth={2.5} /></div>
                <div>
                  <div className="text-sm font-bold text-white">ResQNet · Situation Room · DEMO</div>
                  <div className="mono text-[10px] uppercase tracking-wider text-slate-500">{S.name}</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 animate-pulse-glow">
                <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-red-400"><Crosshair className="h-3.5 w-3.5" /> Active Disaster</div>
                <div className="mt-1.5 text-base font-bold text-white">{S.active_disaster}</div>
                <div className="mt-1 text-xs text-slate-300">Hebbal water table rising {S.hebbal_water_rate_cm_per_min} cm/min · Spread vector: {S.spread_vector}</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Tile k="AFFECTED" v={S.affected_people.toLocaleString()} />
                  <Tile k="WIND" v={`${S.wind_kmph} km/h`} />
                  <Tile k="RAIN 3h" v={`${S.rainfall_mm_last_3h} mm`} />
                </div>
              </div>
            </motion.div>
            <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} className="panel-elevated flex flex-col items-center justify-center rounded-xl p-6">
              <ThreatRadar size={220} label="BANGALORE N · LIVE" />
              <div className="mt-3"><CountdownTimer minutes={S.flood_eta_yelahanka_min} label="FLOOD ETA · YELAHANKA" /></div>
            </motion.div>
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="panel-elevated relative overflow-hidden rounded-xl p-5">
              <div className="text-sm font-bold text-white">Deployed Assets</div>
              <div className="mono text-[10px] uppercase tracking-wider text-slate-500">3 rescue teams · 5 shelters online</div>
              <div className="mt-3 space-y-1.5">
                {S.rescue_pins.map(u => (
                  <div key={u.name} className="flex items-center justify-between rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-red-400" />
                      <span className="text-xs font-semibold text-white">{u.name}</span>
                      <span className="mono text-[9px] uppercase tracking-wider text-slate-500">{u.type}</span>
                    </div>
                    <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 mono text-[9px] font-bold text-red-300">{u.status}</span>
                  </div>
                ))}
                {S.shelter_pins.map(sh => (
                  <div key={sh.name} className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">{sh.name}</span>
                    </div>
                    <span className="mono text-[9px] uppercase tracking-wider text-emerald-400">cap {sh.cap}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1a1a2e] py-6">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-3 px-4 lg:grid-cols-4 sm:px-6">
          {[
            { l: 'Lives Protected', v: 124000, s: '+', c: 'red' },
            { l: 'Active Disasters', v: 3, c: 'orange' },
            { l: 'Route Accuracy', v: 94.2, s: '%', d: 1, c: 'green' },
            { l: 'Response Time', v: 6, s: 'min', c: 'blue' },
          ].map(m => (
            <div key={m.l} className="panel-elevated rounded-xl p-4">
              <div className="mono text-[10px] uppercase tracking-wider text-slate-500">{m.l}</div>
              <div className="mt-1 text-3xl font-extrabold text-white"><AnimatedCounter to={m.v} suffix={m.s || ''} decimals={m.d || 0} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 lg:grid-cols-[1.4fr_1fr] sm:px-6">
          <DemoGeminiChat />
          <div className="panel-elevated rounded-xl p-5">
            <div className="text-sm font-bold text-white">Scenario Vitals</div>
            <div className="mt-4 space-y-3">
              <Vital icon={Droplets} color="red" label="Hebbal water table" value={`+${S.hebbal_water_rate_cm_per_min} cm/min`} bar={88} />
              <Vital icon={Wind} color="orange" label="Wind speed" value={`${S.wind_kmph} km/h ${S.wind_direction}`} bar={67} />
              <Vital icon={CloudRain} color="blue" label="Rainfall (last 3h)" value={`${S.rainfall_mm_last_3h} mm`} bar={84} />
              <Vital icon={Users} color="red" label="Affected population" value={S.affected_people.toLocaleString()} bar={62} />
              <Vital icon={AlertTriangle} color="red" label="Spread vector" value={S.spread_vector} bar={75} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Tile({ k, v }) {
  return <div className="rounded border border-red-500/20 bg-[#0a0a0f] px-2.5 py-1.5"><div className="mono text-[9px] uppercase tracking-wider text-slate-500">{k}</div><div className="text-sm font-bold text-white">{v}</div></div>
}
function Vital({ icon: Icon, color, label, value, bar }) {
  const c = { red: 'text-red-400 bg-red-500', orange: 'text-orange-400 bg-orange-500', blue: 'text-blue-400 bg-blue-500' }[color]
  const [text, bg] = c.split(' ')
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Icon className={`h-3.5 w-3.5 ${text}`} /><span className="text-xs font-medium text-slate-200">{label}</span></div>
        <span className="mono text-[10px] text-white">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} animate={{ width: `${bar}%` }} transition={{ duration: 1.4 }} className={`h-full ${bg}`} /></div>
    </div>
  )
}
