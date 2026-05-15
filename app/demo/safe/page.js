'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ShieldX, ShieldAlert, ShieldCheck, MapPin, Phone, Volume2, Navigation } from 'lucide-react'
import { SCENARIO as S } from '@/lib/demo-scenario'
import CountdownTimer from '@/components/demo/countdown-timer'

const DemoMap = dynamic(() => import('@/components/demo/flood-map'), { ssr: false })

function distKm(a, b) { const R = 6371; const r = d => d * Math.PI / 180; const dl = r(b[0] - a[0]); const dn = r(b[1] - a[1]); const x = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)) }
function inBN(lat, lng) { const b = S.bn_bbox; return lat >= b.latMin && lat <= b.latMax && lng >= b.lngMin && lng <= b.lngMax }
function playAlarm() { try { const AC = window.AudioContext || window.webkitAudioContext; const ctx = new AC(); const beep = (f, t, d) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + d); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + d) }; for (let i = 0; i < 5; i++) { beep(880, i * 0.5, 0.22); beep(1320, i * 0.5 + 0.25, 0.22) } } catch {} }

// auto-locked to Bangalore North (Hebbal)
const DEMO_USER = S.hebbal_pos

export default function DemoSafe() {
  const [coords] = useState(DEMO_USER)
  useEffect(() => { const t = setTimeout(playAlarm, 600); return () => clearTimeout(t) }, [])

  // Always EVACUATE in demo (user is in Bangalore North)
  let nearest = null, nearestKm = Infinity
  for (const s of S.shelter_pins) { const d = distKm(coords, s.pos); if (d < nearestKm) { nearestKm = d; nearest = s } }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <div>
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-red-400">CITIZEN EVACUATION PORTAL · DEMO</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Am I Safe?</h1>
        <p className="mt-1 text-sm text-slate-400">Demo user is locked to Bangalore North (Hebbal) for the scenario.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-5 animate-pulse-glow">
            <div className="flex items-center gap-3">
              <ShieldX className="h-8 w-8 text-red-400" />
              <div>
                <div className="mono text-[10px] uppercase tracking-wider text-slate-400">STATUS</div>
                <div className="text-2xl font-extrabold text-red-300">EVACUATE NOW</div>
              </div>
            </div>
            <div className="mt-3 mono text-[10px] uppercase tracking-wider text-slate-500">GPS · {coords[0].toFixed(4)}, {coords[1].toFixed(4)} · Bangalore North</div>
            <div className="mt-2 text-xs text-slate-300">Active hazard: <b className="text-white">{S.active_disaster}</b> · spread {S.spread_vector}</div>
          </div>

          <CountdownTimer minutes={S.flood_eta_yelahanka_min} label="FLOOD ETA · YOUR AREA" big />

          <div className="panel-elevated rounded-xl border-red-500/40 p-5">
            <div className="flex items-center gap-2"><Volume2 className="h-4 w-4 text-red-400" /><div className="text-sm font-bold text-white">Evacuation Instructions</div></div>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li><span className="mono text-[10px] text-red-400">01</span> Move to higher ground immediately, away from Hebbal Lake.</li>
              <li><span className="mono text-[10px] text-red-400">02</span> Head to <b>{nearest?.name}</b> ({nearestKm.toFixed(1)} km) — capacity {nearest?.cap}.</li>
              <li><span className="mono text-[10px] text-red-400">03</span> Avoid ORR underpass, Hebbal lake bridge, Outer Ring Road north.</li>
              <li><span className="mono text-[10px] text-red-400">04</span> Call emergency: <a className="underline" href="tel:112">112</a> if trapped.</li>
              <li><span className="mono text-[10px] text-red-400">05</span> Carry ID, water, phone charger — ETA Yelahanka {S.flood_eta_yelahanka_min}m.</li>
            </ol>
            <button onClick={playAlarm} className="mt-3 w-full rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20">Replay Alarm</button>
          </div>

          <div className="panel-elevated rounded-xl p-5">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /><div className="text-sm font-bold text-white">Nearest Shelter</div></div>
            <div className="mt-3 text-lg font-extrabold text-white">{nearest?.name}</div>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <Stat k="DISTANCE" v={`${nearestKm.toFixed(1)} km`} />
              <Stat k="DRIVE ETA" v={`${Math.max(2, Math.round(nearestKm / 0.5))} min`} />
              <Stat k="CAPACITY" v={String(nearest?.cap)} />
            </div>
            <div className="mt-3 flex gap-2">
              <a href={`https://www.google.com/maps/dir/?api=1&origin=${coords[0]},${coords[1]}&destination=${nearest.pos[0]},${nearest.pos[1]}`} target="_blank" rel="noreferrer" className="btn-glow flex-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-center text-xs font-semibold text-white"><Navigation className="mr-1 inline h-3 w-3" /> Navigate</a>
              <a href="tel:112" className="flex items-center gap-1 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2 text-xs font-semibold text-slate-300"><Phone className="h-3 w-3" /> Call 112</a>
            </div>
          </div>
        </motion.div>

        <div className="panel-elevated relative h-[78vh] min-h-[640px] overflow-hidden rounded-xl">
          <DemoMap />
        </div>
      </div>
    </div>
  )
}
function Stat({ k, v }) { return <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5"><div className="mono text-[9px] uppercase tracking-wider text-slate-500">{k}</div><div className="text-sm font-bold text-white">{v}</div></div> }
