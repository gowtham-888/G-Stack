'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ShieldAlert, ShieldX, MapPin, Navigation, AlertTriangle, Loader2, Volume2, Phone, RefreshCw } from 'lucide-react'

const TacticalMap = dynamic(() => import('@/components/tactical-map'), { ssr: false })

const shelters = [
  { pos: [13.0500, 77.6200], name: 'Hebbal Govt School', cap: 1200, phone: '+91-80-22221111' },
  { pos: [12.9716, 77.5946], name: 'Cubbon Park Relief', cap: 2400, phone: '+91-80-22221112' },
  { pos: [12.9141, 74.8560], name: 'Mangalore Stadium', cap: 3200, phone: '+91-824-2441000' },
  { pos: [12.2958, 76.6394], name: 'Mysore Palace Grounds', cap: 4000, phone: '+91-821-2422000' },
  { pos: [15.3647, 75.1240], name: 'Hubli Convention Hall', cap: 1800, phone: '+91-836-2200000' },
]

function distKm(a, b) { const R = 6371; const r = d => d * Math.PI / 180; const dl = r(b[0] - a[0]); const dn = r(b[1] - a[1]); const x = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)) }
function playAlarm() { try { const AC = window.AudioContext || window.webkitAudioContext; const ctx = new AC(); const beep = (f, t, d) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + d); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + d) }; for (let i = 0; i < 5; i++) { beep(880, i * 0.5, 0.22); beep(1320, i * 0.5 + 0.25, 0.22) } } catch {} }

// Karnataka baseline operations hazard zones (always evaluated)
const KARNATAKA_HAZARDS = [
  { pos: [13.0358, 77.5970], evacuateKm: 5, riskKm: 10, name: 'Hebbal Flood Zone', sev: 'CRIT' },
  { pos: [12.8700, 74.8420], evacuateKm: 15, riskKm: 25, name: 'Cyclone Mangalore', sev: 'CRIT' },
  { pos: [12.965, 75.756], evacuateKm: 4, riskKm: 9, name: 'Shiradi Landslide', sev: 'HIGH' },
  { pos: [12.5266, 76.8956], evacuateKm: 6, riskKm: 12, name: 'Kaveri Overflow', sev: 'HIGH' },
]
const KARNATAKA_BBOX = { latMin: 11.5, latMax: 18.5, lngMin: 74.0, lngMax: 78.6 }

// Convert a live hazard into a radius (km) inside which civilians are at risk
function hazardRadius(h) {
  if (h.kind === 'earthquake') return Math.max(20, (h.meta?.magnitude || 1) * 25)
  if (h.kind === 'weather') {
    if (h.sev === 'CRIT') return 25
    if (h.sev === 'HIGH') return 15
    return 10
  }
  return 10
}

export default function SafePage() {
  const [state, setState] = useState('idle')
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState('')
  const [hazards, setHazards] = useState([])
  const [loadingHaz, setLoadingHaz] = useState(true)

  const loadHazards = async () => {
    setLoadingHaz(true)
    try { const r = await fetch('/api/live-feed'); const j = await r.json(); setHazards(j.hazards || []) } catch { setHazards([]) }
    finally { setLoadingHaz(false) }
  }
  useEffect(() => { loadHazards() }, [])
  useEffect(() => { const id = setInterval(loadHazards, 120_000); return () => clearInterval(id) }, [])

  const locate = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); setState('error'); return }
    setState('locating')
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords([pos.coords.latitude, pos.coords.longitude]); setState('result') },
      err => { setError(err.message || 'Location denied'); setState('error') },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  let verdict = null, nearest = null, nearestKm = 0, criticalHazard = null, hazKm = Infinity, outsideKA = false
  if (coords) {
    const [lat, lng] = coords
    outsideKA = !(lat >= KARNATAKA_BBOX.latMin && lat <= KARNATAKA_BBOX.latMax && lng >= KARNATAKA_BBOX.lngMin && lng <= KARNATAKA_BBOX.lngMax)
    // Check baseline Karnataka hazards (always evaluated)
    let v = 'safe'
    for (const h of KARNATAKA_HAZARDS) {
      const d = distKm(coords, h.pos)
      if (d <= h.evacuateKm && d < hazKm) { hazKm = d; criticalHazard = { ...h, title: h.name, source: 'KSDMA Ops' }; v = 'evacuate' }
      else if (d <= h.riskKm && d < hazKm && v !== 'evacuate') { hazKm = d; criticalHazard = { ...h, title: h.name, source: 'KSDMA Ops' }; v = 'risk' }
    }
    // Live hazards (USGS / OWM) as additional check
    for (const h of hazards) {
      const d = distKm(coords, [h.lat, h.lng])
      const r = hazardRadius(h)
      if (d <= r && d < hazKm) { hazKm = d; criticalHazard = { ...h, radius: r }; v = 'evacuate' }
    }
    let best = Infinity; for (const s of shelters) { const d = distKm(coords, s.pos); if (d < best) { best = d; nearest = s; nearestKm = d } }
    verdict = outsideKA ? 'outside' : v
    if (verdict === 'evacuate') setTimeout(playAlarm, 100)
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-emerald-400">CITIZEN EVACUATION PORTAL</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Am I Safe?</h1>
          <p className="mt-1 text-sm text-slate-400">Live USGS + OpenWeatherMap hazard data · your browser GPS, never stored.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2">
          <span className="mono text-[10px] uppercase tracking-wider text-slate-400">Live hazards: <span className="text-white">{hazards.length}</span></span>
          <button onClick={loadHazards} className="rounded p-1 text-slate-400 hover:text-white"><RefreshCw className={`h-3 w-3 ${loadingHaz ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          {state === 'idle' && (
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="panel-elevated rounded-xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500"><Navigation className="h-5 w-5 text-white" /></div>
              <h2 className="mt-4 text-lg font-bold text-white">Check My Safety Status</h2>
              <p className="mt-1 text-sm text-slate-400">We will compare your GPS against Karnataka operations hazards + live USGS/OWM feed.</p>
              <button onClick={locate} className="btn-glow mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white">Share My Location</button>
              <p className="mt-2 text-center text-[11px] text-slate-500">Your location is never stored. Checked locally in your browser only.</p>
              <div className="mt-4 border-t border-[#1a1a2e] pt-3">
                <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Demo locations</div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button onClick={() => { setCoords([13.0358, 77.5970]); setState('result') }} className="rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 mono text-[10px] uppercase tracking-wider text-red-300 hover:bg-red-500/20">Hebbal (evacuate)</button>
                  <button onClick={() => { setCoords([12.8700, 74.8420]); setState('result') }} className="rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 mono text-[10px] uppercase tracking-wider text-red-300 hover:bg-red-500/20">Mangalore cyclone</button>
                  <button onClick={() => { setCoords([13.0800, 77.6000]); setState('result') }} className="rounded-md border border-orange-500/40 bg-orange-500/10 px-2.5 py-1.5 mono text-[10px] uppercase tracking-wider text-orange-300 hover:bg-orange-500/20">Yelahanka (risk)</button>
                  <button onClick={() => { setCoords([15.3647, 75.1240]); setState('result') }} className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">Hubli (safe)</button>
                </div>
              </div>
            </motion.div>
          )}
          {state === 'locating' && <div className="panel-elevated flex flex-col items-center justify-center rounded-xl p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /><div className="mt-3 text-sm text-white">Acquiring GPS lock…</div></div>}
          {state === 'error' && <div className="panel-elevated rounded-xl p-6 border-red-500/40"><div className="flex items-center gap-2 text-red-300"><AlertTriangle className="h-4 w-4" /><span className="text-sm font-bold">Location unavailable</span></div><p className="mt-1 text-xs text-slate-400">{error}</p><button onClick={() => setState('idle')} className="mt-3 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-1.5 text-xs text-slate-300">Try again</button></div>}
          {state === 'result' && coords && (
            <AnimatePresence>
              <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`rounded-xl border p-5 ${verdict === 'evacuate' ? 'border-red-500/50 bg-red-500/10 animate-pulse-glow' : verdict === 'risk' ? 'border-orange-500/50 bg-orange-500/10' : verdict === 'outside' ? 'border-slate-500/50 bg-slate-500/10' : 'border-emerald-500/50 bg-emerald-500/10'}`}>
                  <div className="flex items-center gap-3">
                    {verdict === 'evacuate' ? <ShieldX className="h-8 w-8 text-red-400" /> : verdict === 'risk' ? <ShieldAlert className="h-8 w-8 text-orange-400" /> : verdict === 'outside' ? <ShieldAlert className="h-8 w-8 text-slate-400" /> : <ShieldCheck className="h-8 w-8 text-emerald-400" />}
                    <div>
                      <div className="mono text-[10px] uppercase tracking-wider text-slate-400">STATUS</div>
                      <div className={`text-2xl font-extrabold ${verdict === 'evacuate' ? 'text-red-300' : verdict === 'risk' ? 'text-orange-300' : verdict === 'outside' ? 'text-slate-300' : 'text-emerald-300'}`}>{verdict === 'evacuate' ? 'EVACUATE NOW' : verdict === 'risk' ? 'AT RISK' : verdict === 'outside' ? 'OUTSIDE COVERAGE' : 'CURRENTLY SAFE'}</div>
                    </div>
                  </div>
                  <div className="mt-3 mono text-[10px] uppercase tracking-wider text-slate-500">GPS · {coords[0].toFixed(4)}, {coords[1].toFixed(4)}{outsideKA ? ' · OUTSIDE KARNATAKA' : ' · KARNATAKA'}</div>
                  {criticalHazard ? <div className="mt-2 text-xs text-slate-300">Active hazard: <span className="font-semibold text-white">{criticalHazard.title}</span> · {hazKm.toFixed(1)} km away</div> : verdict === 'outside' ? <div className="mt-2 text-xs text-slate-300">Showing nearest Karnataka shelter for demonstration purposes.</div> : <div className="mt-2 text-xs text-slate-300">No active hazard within risk perimeter. {hazards.length} live hazard(s) monitored elsewhere.</div>}
                </div>

                {verdict === 'evacuate' && (
                  <div className="panel-elevated rounded-xl border-red-500/40 p-5">
                    <div className="flex items-center gap-2"><Volume2 className="h-4 w-4 text-red-400" /><div className="text-sm font-bold text-white">Evacuation Instructions</div></div>
                    <ol className="mt-3 space-y-2 text-sm text-slate-300">
                      <li><span className="mono text-[10px] text-red-400">01</span> Move to higher ground immediately, away from {criticalHazard?.title}.</li>
                      <li><span className="mono text-[10px] text-red-400">02</span> Head to <b>{nearest?.name}</b> ({nearestKm.toFixed(1)} km) — capacity {nearest?.cap}.</li>
                      <li><span className="mono text-[10px] text-red-400">03</span> Avoid underpasses, riverbanks, and coastal roads.</li>
                      <li><span className="mono text-[10px] text-red-400">04</span> Call emergency: <a className="underline" href="tel:112">112</a> if trapped.</li>
                    </ol>
                    <button onClick={() => setTimeout(playAlarm, 50)} className="mt-3 w-full rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20">Replay Alarm</button>
                  </div>
                )}
                {nearest && (
                  <div className="panel-elevated rounded-xl p-5">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /><div className="text-sm font-bold text-white">Nearest Shelter</div></div>
                    <div className="mt-3 text-lg font-extrabold text-white">{nearest.name}</div>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <Stat k="DISTANCE" v={`${nearestKm.toFixed(1)} km`} />
                      <Stat k="DRIVE ETA" v={`${Math.max(2, Math.round(nearestKm / 0.6))} min`} />
                      <Stat k="CAPACITY" v={String(nearest.cap)} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a href={`https://www.google.com/maps/dir/?api=1&origin=${coords[0]},${coords[1]}&destination=${nearest.pos[0]},${nearest.pos[1]}`} target="_blank" rel="noreferrer" className="btn-glow flex-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-center text-xs font-semibold text-white">Navigate</a>
                      <a href={`tel:${nearest.phone}`} className="flex items-center gap-1 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2 text-xs font-semibold text-slate-300"><Phone className="h-3 w-3" /> Call</a>
                    </div>
                  </div>
                )}
                <button onClick={() => setState('idle')} className="w-full rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2 text-xs text-slate-400">Check again</button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="panel-elevated relative h-[78vh] min-h-[640px] overflow-hidden rounded-xl"><TacticalMap /></div>
      </div>
    </div>
  )
}
function Stat({ k, v }) { return <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5"><div className="mono text-[9px] uppercase tracking-wider text-slate-500">{k}</div><div className="text-sm font-bold text-white">{v}</div></div> }
