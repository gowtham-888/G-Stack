'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, MapPin, Radio, Cpu, Satellite, Eye, Users, Activity, Wifi, Database, Cloud, Crosshair } from 'lucide-react'
import AlertTicker from '@/components/alert-ticker'
import LiveAIBriefing from '@/components/live-ai-briefing'
import ThreatRadar from '@/components/threat-radar'
import GridBG from '@/components/grid-bg'
import AnimatedCounter from '@/components/animated-counter'
import NeuralViz from '@/components/neural-viz'
import Telemetry from '@/components/telemetry'
import Predictions from '@/components/predictions'
import WeatherWidget from '@/components/weather-widget'
import EarthquakeFeed from '@/components/earthquake-feed'
import GeminiChat from '@/components/gemini-chat'

const fadeUp = { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

const metrics = [
  { key: 'zones', label: 'Active Zones', value: 4, accent: 'red' },
  { key: 'units', label: 'Rescue Units', value: 6, accent: 'orange' },
  { key: 'shelter', label: 'Shelter Cap', value: 78, suffix: '%', accent: 'green' },
  { key: 'pings', label: 'Civilian Pings', value: 51247, accent: 'blue' },
]
const accentBar = { red: 'from-red-500 to-red-300', orange: 'from-orange-500 to-orange-300', green: 'from-emerald-500 to-emerald-300', blue: 'from-blue-500 to-blue-300' }
const accentText = { red: 'text-red-400', orange: 'text-orange-400', green: 'text-emerald-400', blue: 'text-blue-400' }

export default function Dashboard() {
  const [now, setNow] = useState({ time: '', date: '' })
  const [feed, setFeed] = useState(null)
  useEffect(() => {
    const upd = () => { const d = new Date(); setNow({ time: d.toLocaleTimeString('en-GB', { hour12: false }), date: d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) }) }
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id)
  }, [])
  useEffect(() => {
    let alive = true
    const load = async () => { try { const r = await fetch('/api/live-feed'); const j = await r.json(); if (alive && j.ok) setFeed(j) } catch {} }
    load(); const id = setInterval(load, 60_000); return () => { alive = false; clearInterval(id) }
  }, [])
  const top = feed?.hazards?.[0]
  const allClear = feed && feed.hazards.length === 0

  return (
    <div className="relative">
      {/* HERO PANEL */}
      <section className="relative overflow-hidden border-b border-[#1a1a2e]">
        <GridBG />
        <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
            <motion.div variants={fadeUp} className="panel-elevated relative overflow-hidden rounded-xl p-5">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_18px_rgba(239,68,68,0.55)]">
                  <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">ResQNet · Situation Room</div>
                  <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Karnataka Emergency Operations</div>
                </div>
              </div>
              <div className={`mt-4 rounded-lg border p-3 ${allClear ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className={`flex items-center gap-2 mono text-[10px] uppercase tracking-wider ${allClear ? 'text-emerald-400' : 'text-red-400'}`}><Crosshair className="h-3.5 w-3.5" /> {allClear ? 'No Active Threats' : 'Active Disaster'}</div>
                <div className="mt-1.5 text-base font-bold text-white">{allClear ? 'All systems nominal · region clear' : (top ? top.title : 'Loading live data…')}</div>
                <div className="mt-1 text-xs text-slate-400">{allClear ? 'Karnataka monitoring grid reports nominal conditions across all stations.' : (top ? `Source: ${top.source} · severity ${top.sev}` : 'Pulling USGS + OpenWeatherMap…')}</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat label="HAZARDS" value={feed ? feed.hazards.length : '—'} />
                  <Stat label="USGS EVENTS" value={feed ? feed.usgs.length : '—'} />
                  <Stat label="OWM CITIES" value={feed ? feed.weather.length : '—'} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="panel-elevated flex items-center justify-center rounded-xl p-6">
              <ThreatRadar size={240} label="THREAT FIELD · LIVE" />
            </motion.div>

            <motion.div variants={fadeUp} className="panel-elevated relative overflow-hidden rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Local Time · IST</div>
                  <div className="mono mt-1 text-3xl font-bold text-white tabular-nums">{now.time}</div>
                  <div className="mono text-[11px] text-slate-400">{now.date}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Pill icon={Wifi} text="GRID ONLINE" color="emerald" />
                  <Pill icon={Eye} text="REAL-TIME OPS" color="blue" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <SmallTile icon={Satellite} label="SATELLITES" value="6/6" color="emerald" />
                <SmallTile icon={Cpu} label="AI LOAD" value="42%" color="blue" />
                <SmallTile icon={Database} label="FEEDS" value="142" color="orange" />
                <SmallTile icon={Cloud} label="UPTIME" value="99.98%" color="emerald" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AlertTicker />

      {/* METRICS */}
      <section className="border-b border-[#1a1a2e] py-6">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp} whileHover={{ y: -3 }} className="panel-elevated relative overflow-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] uppercase tracking-wider text-slate-500">{m.label}</span>
                  <span className={`mono text-[10px] ${accentText[m.accent]}`}>+12%</span>
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white tabular-nums">
                  <AnimatedCounter to={m.key === 'zones' ? (feed?.hazards?.length || m.value) : m.value} suffix={m.suffix || ''} />
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '74%' }} transition={{ duration: 1.2 }} className={`h-full bg-gradient-to-r ${accentBar[m.accent]}`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* GEMINI + WEATHER + SEISMIC */}
      <section className="border-b border-[#1a1a2e] py-6">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 lg:grid-cols-[1.4fr_1fr] sm:px-6">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GeminiChat />
          </motion.div>
          <div className="space-y-4">
            <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <WeatherWidget />
            </motion.div>
            <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}>
              <EarthquakeFeed compact />
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTEL ROW */}
      <section className="border-b border-[#1a1a2e] py-6">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 lg:grid-cols-3 sm:px-6">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><NeuralViz /></motion.div>
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}><Predictions /></motion.div>
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}><Telemetry /></motion.div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="py-6">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 lg:grid-cols-3 sm:px-6">
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <LiveAIBriefing />
          </motion.div>
          <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="panel-elevated relative overflow-hidden rounded-xl p-5">
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-orange-400" /><div className="text-sm font-bold text-white">Rescue Posture</div></div>
            <div className="mt-4 space-y-3">
              {[{ name: 'NDRF Alpha', cap: 92, avail: 'READY' }, { name: 'Fire Bravo', cap: 64, avail: 'DEPLOYED' }, { name: 'Med Echo', cap: 88, avail: 'READY' }, { name: 'KSP Delta', cap: 41, avail: 'ENROUTE' }].map((u) => (
                <div key={u.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">{u.name}</span>
                    <span className={`mono text-[9px] uppercase tracking-wider ${u.avail === 'READY' ? 'text-emerald-400' : u.avail === 'DEPLOYED' ? 'text-red-400' : 'text-orange-400'}`}>{u.avail}</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${u.cap}%` }} transition={{ duration: 1 }} className={`h-full ${u.cap > 70 ? 'bg-emerald-500' : u.cap > 50 ? 'bg-orange-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5">
      <div className="mono text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  )
}
function Pill({ icon: Icon, text, color }) {
  const c = color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
  return (<div className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 mono text-[9px] font-semibold uppercase tracking-wider ${c}`}><Icon className="h-3 w-3" /> {text}</div>)
}
function SmallTile({ icon: Icon, label, value, color }) {
  const c = { emerald: 'text-emerald-400', blue: 'text-blue-400', orange: 'text-orange-400' }[color]
  return (
    <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] p-2.5">
      <div className="flex items-center gap-1.5"><Icon className={`h-3 w-3 ${c}`} /><span className="mono text-[9px] uppercase tracking-wider text-slate-500">{label}</span></div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  )
}
