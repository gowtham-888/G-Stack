'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Radio, Map, Bell, ShieldCheck, ArrowRight, Siren } from 'lucide-react'
import { SCENARIO as S } from '@/lib/demo-scenario'
import CountdownTimer from '@/components/demo/countdown-timer'
import GridBG from '@/components/grid-bg'

const tiles = [
  { href: '/demo/situation', label: 'Situation Room', icon: Radio, desc: 'AI command center with live Gemini briefing on the scripted flood.' },
  { href: '/demo/map', label: 'Tactical Map', icon: Map, desc: 'Watch the flood spread animation toward Yelahanka in real time.' },
  { href: '/demo/alerts', label: 'Alerts', icon: Bell, desc: 'Critical alerts with 47-minute countdown until Yelahanka impact.' },
  { href: '/demo/safe', label: 'Am I Safe?', icon: ShieldCheck, desc: 'Citizen view — auto EVACUATE NOW for Bangalore North.' },
]

export default function DemoLanding() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[#1a1a2e] py-16">
        <GridBG variant="red" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1.5">
            <Siren className="h-3.5 w-3.5 animate-pulse text-red-400" />
            <span className="mono text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">SCRIPTED SCENARIO</span>
          </motion.div>
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {S.name}
          </motion.h1>
          <motion.p initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
            A pre-loaded hackathon demo. Every dashboard, map, alert and citizen view is wired to a unified flood scenario in Bangalore North.
          </motion.p>
          <div className="mt-8">
            <CountdownTimer minutes={S.flood_eta_yelahanka_min} label="FLOOD ETA · YELAHANKA" big />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-[1300px] px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((t, i) => {
              const Icon = t.icon
              return (
                <motion.div key={t.href} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={t.href} className="panel-elevated group block rounded-xl p-5 transition hover:-translate-y-1 hover:border-red-500/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-300"><Icon className="h-5 w-5" /></div>
                    <div className="mt-4 text-base font-bold text-white">{t.label}</div>
                    <div className="mt-1 text-xs text-slate-400">{t.desc}</div>
                    <div className="mt-4 flex items-center gap-1 mono text-[10px] uppercase tracking-wider text-red-400">Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { l: 'Lives Protected', v: '1,24,000' },
              { l: 'Active Disasters', v: '3' },
              { l: 'Route Accuracy', v: '94.2%' },
              { l: 'Response Time', v: '6 min' },
            ].map(s => (
              <div key={s.l} className="panel-elevated rounded-xl p-4">
                <div className="mono text-[10px] uppercase tracking-wider text-slate-500">{s.l}</div>
                <div className="mt-1 text-3xl font-extrabold text-white">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 panel-elevated rounded-xl p-5">
            <div className="text-sm font-bold text-white">Scenario telemetry</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <Telem k="WATER RISE" v={`${S.hebbal_water_rate_cm_per_min} cm/min`} />
              <Telem k="SPREAD VECTOR" v={S.spread_vector} />
              <Telem k="WIND" v={`${S.wind_kmph} km/h ${S.wind_direction}`} />
              <Telem k="RAINFALL (3h)" v={`${S.rainfall_mm_last_3h} mm`} />
              <Telem k="AFFECTED" v={S.affected_people.toLocaleString()} />
              <Telem k="RESCUE TEAMS" v={S.rescue_teams.length + ' deployed'} />
              <Telem k="SHELTERS" v={S.shelters.length + ' active'} />
              <Telem k="ETA YELAHANKA" v={`${S.flood_eta_yelahanka_min} min`} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Telem({ k, v }) {
  return (
    <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2">
      <div className="mono text-[9px] uppercase tracking-wider text-slate-500">{k}</div>
      <div className="text-sm font-bold text-white">{v}</div>
    </div>
  )
}
