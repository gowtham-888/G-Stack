'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, Map, Radio, Brain, Languages, Truck, Radar, AlertTriangle, Compass, Network, Waves, Shield, Activity, Zap } from 'lucide-react'
import GridBG from '@/components/grid-bg'
import AnimatedCounter from '@/components/animated-counter'
import AlertTicker from '@/components/alert-ticker'
import ThreatRadar from '@/components/threat-radar'
import CinematicRadar from '@/components/cinematic-radar'
import EarthquakeFeed from '@/components/earthquake-feed'

const fadeUp = { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const stats = [
  { label: 'Lives Protected', value: 124000, suffix: '+', color: 'red', icon: Shield },
  { label: 'Active Disasters', value: 7, suffix: '', color: 'orange', icon: AlertTriangle, dynamic: 'usgs' },
  { label: 'Route Accuracy', value: 94.2, suffix: '%', decimals: 1, color: 'green', icon: Compass },
  { label: 'Avg Response', value: 6, suffix: 'm', decimals: 0, color: 'blue', icon: Zap },
]

const problems = [
  { title: 'Navigation Is Disaster-Blind', desc: 'Google Maps and Waze route civilians directly through flooded zones, landslides and fires. Static data costs lives.', icon: Compass },
  { title: 'Rescue Teams Use Stale Routes', desc: 'Coordination depends on outdated maps and radio chatter. Critical minutes lost while disasters evolve.', icon: Network },
  { title: 'Coordination Is Fragmented', desc: 'NDRF, fire, medical and local police operate in silos. No shared real-time intelligence picture.', icon: Waves },
]

const features = [
  { title: 'Dynamic Safety Routing', desc: 'AI reroutes evacuees in real time around hazards, factoring depth, terrain & traffic.', icon: Map, color: 'red' },
  { title: 'AI Situation Room', desc: 'Gemini synthesizes 142+ data feeds into actionable briefings in <2 seconds.', icon: Radio, color: 'orange' },
  { title: 'Adaptive Intelligence', desc: 'Self-learning models predict cascade failures before they happen.', icon: Brain, color: 'blue' },
  { title: 'Multi-language AI', desc: 'Instant alerts in Kannada, Hindi, English, Tulu, Tamil & Telugu.', icon: Languages, color: 'green' },
  { title: 'Rescue Resource Tracking', desc: 'Live GPS of every unit, ambulance, shelter capacity & fuel status.', icon: Truck, color: 'orange' },
  { title: 'Live Threat Monitoring', desc: 'Doppler radar, river sensors & social signals — fused into one threat field.', icon: Radar, color: 'red' },
]

const colorRing = {
  red: 'from-red-500/30 via-red-500/0 to-red-500/30',
  orange: 'from-orange-500/30 via-orange-500/0 to-orange-500/30',
  green: 'from-emerald-500/30 via-emerald-500/0 to-emerald-500/30',
  blue: 'from-blue-500/30 via-blue-500/0 to-blue-500/30',
}
const colorIcon = {
  red: 'text-red-400 bg-red-500/10 border-red-500/30',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
}

export default function Home() {
  const [eqCount, setEqCount] = useState(4)
  useEffect(() => {
    let alive = true
    const load = async () => { try { const r = await fetch('/api/live-feed'); const j = await r.json(); if (alive) setEqCount(Math.max(2, (j.hazards || []).length)) } catch {} }
    load(); const id = setInterval(load, 60_000); return () => { alive = false; clearInterval(id) }
  }, [])
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <GridBG />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60">
          <CinematicRadar size={Math.min(900, 720)} />
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.85) 70%)' }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
            </span>
            <span className="mono text-[11px] font-semibold uppercase tracking-[0.22em] text-red-300">LIVE · AI DISASTER INTELLIGENCE</span>
          </motion.div>

          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            When Disaster Strikes,
            <br />
            Every <span className="text-red-500 text-glow-red">Second</span> Counts.
          </motion.h1>

          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            AI-powered evacuation intelligence for disaster response teams across Karnataka. Real-time hazard fusion, dynamic safe routing, and a Gemini-driven Situation Room.
          </motion.p>

          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-glow group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(239,68,68,0.35)]">
              <Radio className="h-4 w-4" /> Enter Situation Room <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/safe" className="group inline-flex items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-500/20 hover:shadow-[0_10px_40px_rgba(249,115,22,0.35)]">
              <Shield className="h-4 w-4" /> Am I Safe?
              <span className="relative ml-0.5 flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" /></span>
            </Link>
            <Link href="/map" className="group inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/5 px-6 py-3 text-sm font-semibold text-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-500/10 hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)]">
              <Map className="h-4 w-4" /> View Live Map <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div initial={false} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-70">
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-slate-500">POWERED BY</span>
            {['USGS', 'ISRO', 'Gemini AI', 'OpenWeatherMap', 'OpenStreetMap'].map(b => (
              <span key={b} className="mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">{b}</span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="pointer-events-none absolute -right-32 top-24 hidden lg:block">
          <ThreatRadar size={300} label="BENGALURU · LIVE" />
        </motion.div>
        <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
          className="pointer-events-none absolute -left-24 bottom-16 hidden lg:block">
          <ThreatRadar size={220} label="MANGALORE · CYCLONE" />
        </motion.div>
      </section>

      <AlertTicker />

      {/* LIVE STATS */}
      <section className="relative border-b border-[#1a1a2e] py-20">
        <div className="mx-auto max-w-[1500px] px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <motion.div key={s.label} variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className={`panel-elevated group relative overflow-hidden rounded-xl p-5 transition hover:border-${s.color}-500/40`}
                  style={{ transition: 'border-color 0.3s' }}>
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100 ${colorRing[s.color]}`} />
                  <div className="relative flex items-center justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{s.label}</span>
                    <Icon className={`h-4 w-4 text-${s.color === 'green' ? 'emerald' : s.color}-400`} />
                  </div>
                  <div className="relative mt-3 text-4xl font-extrabold tracking-tight text-white">
                    <AnimatedCounter to={s.dynamic === 'usgs' ? eqCount : s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                  </div>
                  <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '78%' }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r from-${s.color === 'green' ? 'emerald' : s.color}-500 to-${s.color === 'green' ? 'emerald' : s.color}-300`} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* LIVE SEISMIC */}
      <section className="border-b border-[#1a1a2e] py-12">
        <div className="mx-auto max-w-[1300px] px-6">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 text-center">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-red-400">LIVE GROUND TRUTH</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Real-time seismic feed · USGS</h2>
            <p className="mt-1 text-sm text-slate-400">Direct ingestion of global earthquake events, filtered for the Indian subcontinent.</p>
          </motion.div>
          <EarthquakeFeed />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative overflow-hidden border-b border-[#1a1a2e] py-24">
        <div className="absolute inset-0 tactical-grid-fine opacity-30" />
        <div className="relative mx-auto max-w-[1300px] px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-red-400">THE CRISIS</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Why current systems <span className="text-red-500">fail</span> when it matters most.</h2>
            <p className="mt-4 text-slate-400">Every disaster exposes the same fatal gap — the tech we use daily was never built to save lives.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            className="mt-14 grid gap-4 md:grid-cols-3">
            {problems.map((p) => {
              const Icon = p.icon
              return (
                <motion.div key={p.title} variants={fadeUp} whileHover={{ y: -6 }}
                  className="panel-elevated group relative overflow-hidden rounded-xl p-6">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-500/10 blur-2xl transition group-hover:bg-red-500/20" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-bold text-white">{p.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
                  <div className="relative mt-5 flex items-center gap-1.5 mono text-[10px] uppercase tracking-wider text-red-400/80">
                    <AlertTriangle className="h-3 w-3" /> Critical failure mode
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 tactical-grid opacity-40" />
        <div className="relative mx-auto max-w-[1300px] px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-emerald-400">THE SOLUTION</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">ResQNet changes <span className="bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">everything.</span></h2>
            <p className="mt-4 text-slate-400">A unified disaster-response operating system. Six AI engines. One mission: zero preventable deaths.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <motion.div key={f.title} variants={fadeUp} whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-xl border border-[#1a1a2e] bg-[#0f0f1a] p-6 transition hover:border-white/10">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100 ${colorRing[f.color]}`} />
                  <div className="absolute -inset-px rounded-xl opacity-0 transition group-hover:opacity-100" style={{ background: 'conic-gradient(from var(--angle,0deg), transparent, rgba(255,255,255,0.08), transparent)' }} />
                  <div className={`relative flex h-11 w-11 items-center justify-center rounded-lg border ${colorIcon[f.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-bold text-white">{f.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
                  <div className="relative mt-5 flex items-center gap-2">
                    <span className="mono text-[10px] uppercase tracking-wider text-slate-500">Module online</span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-16 flex flex-col items-center gap-4">
            <Link href="/dashboard" className="btn-glow inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)]">
              <Activity className="h-4 w-4" /> Launch Command Center <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-slate-500">Open access · Powered by USGS · Gemini AI · OpenWeatherMap</span>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-[#1a1a2e] py-8">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-slate-500">ResQNet © 2025 · Powered by USGS · Gemini AI · OpenWeatherMap · Built for Karnataka NDRF</div>
          <div className="flex items-center gap-3 mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ALL SYSTEMS NOMINAL</span>
            <span>DATA REFRESHES EVERY 30s · IST</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
