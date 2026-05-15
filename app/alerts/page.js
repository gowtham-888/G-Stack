'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Filter, AlertTriangle, Flame, CloudRain, Wind, Mountain, Bell, ChevronDown, Users, MapPin, Clock, ShieldCheck, Waves, Radio, Volume2, Send } from 'lucide-react'

const sevMap = {
  CRIT: { c: 'red', label: 'CRITICAL', accent: 'text-red-400 border-red-500/40 bg-red-500/10' },
  HIGH: { c: 'orange', label: 'HIGH', accent: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
  MED: { c: 'blue', label: 'MEDIUM', accent: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  SAFE: { c: 'emerald', label: 'CLEARED', accent: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
}

const staticAlerts = []

function playAlarm() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = new AC()
    const beep = (f, t0, dur) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ctx.currentTime + t0); g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t0 + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + dur) }
    for (let i = 0; i < 4; i++) { beep(880, i * 0.45, 0.2); beep(1320, i * 0.45 + 0.22, 0.2) }
  } catch {}
}

function relTime(t) {
  const diff = (Date.now() - t) / 1000
  if (diff < 60) return `${Math.round(diff)}s ago`
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`
  return `${Math.round(diff / 3600)}h ago`
}

export default function AlertsPage() {
  const [filter, setFilter] = useState('ALL')
  const [expanded, setExpanded] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [subs, setSubs] = useState(0)
  const seenIds = useRef(new Set())
  const [refreshAt, setRefreshAt] = useState(Date.now())

  async function refresh() {
    try {
      const r = await fetch('/api/live-feed')
      const j = await r.json()
      const dyn = []
      const iconFor = (kind, sev) => {
        if (kind === 'earthquake') return Waves
        if (kind === 'cyclone') return Wind
        if (kind === 'landslide') return Mountain
        if (kind === 'flood') return CloudRain
        if (kind === 'weather') return Wind
        return AlertTriangle
      }
      for (const h of (j.hazards || [])) {
        dyn.push({
          id: h.id,
          sev: h.sev,
          type: h.kind.charAt(0).toUpperCase() + h.kind.slice(1),
          icon: iconFor(h.kind, h.sev),
          title: h.title,
          loc: h.title.split(' · ').slice(-1)[0] || 'Karnataka',
          time: h.time,
          affected: h.affected ?? Math.round((h.meta?.magnitude || 2) * 1200),
          eta: h.eta || (h.kind === 'earthquake' ? '—' : '02h'),
          desc: h.desc || (h.meta ? `Source: ${h.source}. ${h.meta.desc || ''} ${h.meta.magnitude ? 'M' + h.meta.magnitude.toFixed(1) + ' depth ' + h.meta.depth + 'km.' : ''} ${h.meta.wind_ms != null ? 'Wind ' + h.meta.wind_ms + 'm/s, rain ' + (h.meta.rain_mm_1h || 0).toFixed(1) + 'mm/h.' : ''}` : `Source: ${h.source}.`),
        })
      }
      const combined = dyn
      // Sort by severity then time
      const sevRank = { CRIT: 0, HIGH: 1, MED: 2, SAFE: 3 }
      combined.sort((a, b) => (sevRank[a.sev] - sevRank[b.sev]) || (b.time - a.time))
      setAlerts(combined)
      // Trigger alarm on new CRIT
      for (const a of combined) {
        if (a.sev === 'CRIT' && !seenIds.current.has(a.id)) { seenIds.current.add(a.id); playAlarm(); break }
        seenIds.current.add(a.id)
      }
      setRefreshAt(Date.now())
    } catch {}
  }
  useEffect(() => { refresh() }, [])
  useEffect(() => { const id = setInterval(refresh, 30_000); return () => clearInterval(id) }, [])

  const subscribe = async () => {
    if (typeof Notification === 'undefined') { alert('Notifications not supported'); return }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setSubs(s => s + 1)
      new Notification('ResQNet Alerts Active', { body: 'You will receive critical disaster notifications.', icon: '/favicon.ico' })
    }
  }
  const broadcast = () => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') { alert('Subscribe first'); return }
    const a = alerts.find(x => x.sev === 'CRIT')
    if (a) new Notification('🚨 CRITICAL: ' + a.title, { body: `${a.loc} · ${a.affected.toLocaleString()} affected. Take immediate action.` })
    playAlarm()
  }

  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.sev === filter)

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-red-400">EMERGENCY ALERTS</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Live Threat Board</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time USGS + OpenWeatherMap · auto-refresh every 30s · last sync {relTime(refreshAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">
            <Bell className="h-4 w-4 text-red-400" />
            <span className="mono text-[11px] font-semibold text-red-300">{alerts.filter(a => a.sev === 'CRIT').length} ACTIVE CRITICAL</span>
          </div>
          <button onClick={subscribe} className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
            <Volume2 className="h-3.5 w-3.5" /> Subscribe · {subs}
          </button>
          <button onClick={broadcast} className="btn-glow flex items-center gap-1.5 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3 py-2 text-xs font-semibold text-white">
            <Send className="h-3.5 w-3.5" /> Broadcast Alert
          </button>
        </div>
      </motion.div>

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-slate-500"><Filter className="h-3 w-3" /> Filter</div>
        {['ALL', 'CRIT', 'HIGH', 'MED', 'SAFE'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 mono text-[10px] font-semibold uppercase tracking-wider transition ${filter === f ? (f === 'ALL' ? 'border-white/20 bg-white/10 text-white' : sevMap[f].accent) : 'border-[#1a1a2e] bg-[#0a0a0f] text-slate-400 hover:text-white'}`}>
            {f === 'ALL' ? 'ALL' : sevMap[f].label}
          </button>
        ))}
      </motion.div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="panel-elevated rounded-xl p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" />
            <div className="mt-3 text-lg font-bold text-white">All clear — no active alerts</div>
            <div className="mt-1 text-sm text-slate-400">Live USGS + OpenWeatherMap monitoring active. Auto-refresh every 30s.</div>
            <a href="/demo/alerts" className="mt-4 inline-flex rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 mono text-[10px] uppercase tracking-wider text-red-300 hover:bg-red-500/20">See demo scenario alerts →</a>
          </div>
        )}
        <AnimatePresence>
          {filtered.map((a, i) => {
            const s = sevMap[a.sev] || sevMap.MED
            const Icon = a.icon || AlertTriangle
            const open = expanded === a.id
            return (
              <motion.div key={a.id} layout initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.03 }}
                className={`panel-elevated relative overflow-hidden rounded-xl ${a.sev === 'CRIT' ? 'border-red-500/40' : 'border-[#1a1a2e]'}`}>
                {a.sev === 'CRIT' && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />}
                <button onClick={() => setExpanded(open ? null : a.id)} className="flex w-full items-center gap-4 p-4 text-left">
                  <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${s.accent} ${a.sev === 'CRIT' ? 'animate-pulse-glow' : ''}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded border px-1.5 py-0.5 mono text-[9px] font-bold ${s.accent}`}>{s.label}</span>
                      <span className="mono text-[10px] uppercase tracking-wider text-slate-500">{a.type}</span>
                      <span className="mono text-[10px] text-slate-600">· {relTime(a.time)}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white sm:text-base">{a.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.loc}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {a.affected.toLocaleString()} affected</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ETA {a.eta}</span>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="border-t border-[#1a1a2e]">
                      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_auto]">
                        <div>
                          <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Intelligence Summary</div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.desc}</p>
                        </div>
                        <div className="flex flex-wrap items-end gap-2">
                          <button onClick={broadcast} className="btn-glow rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3.5 py-2 text-xs font-semibold text-white">Broadcast Alert</button>
                          <button className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-500/20">Assign Rescue Team</button>
                          <a href="/map" className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-[#13131f]">View on Map</a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
