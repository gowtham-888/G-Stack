'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Siren, ArrowLeft, Volume2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

function playAlarm() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = new AC()
    const beep = (f, t0, dur) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.type = 'sawtooth'; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t0)
      g.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + t0 + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur)
      o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + dur)
    }
    for (let i = 0; i < 6; i++) { beep(880, i * 0.5, 0.22); beep(1320, i * 0.5 + 0.25, 0.22) }
  } catch {}
}

export default function DemoLayout({ children }) {
  const played = useRef(false)
  const pathname = usePathname()

  const triggerAlarm = () => { played.current = true; playAlarm() }
  useEffect(() => {
    if (played.current) return
    const h = () => { if (!played.current) triggerAlarm() }
    window.addEventListener('click', h, { once: true })
    window.addEventListener('keydown', h, { once: true })
    // Try immediately (will fail silently if no user gesture yet)
    const t = setTimeout(() => { try { triggerAlarm() } catch {} }, 600)
    return () => { clearTimeout(t); window.removeEventListener('click', h); window.removeEventListener('keydown', h) }
  }, [pathname])

  const navItems = [
    { href: '/demo', label: 'Overview' },
    { href: '/demo/situation', label: 'Situation Room' },
    { href: '/demo/map', label: 'Tactical Map' },
    { href: '/demo/alerts', label: 'Alerts' },
    { href: '/demo/safe', label: 'Am I Safe?' },
  ]

  return (
    <div className="relative">
      <motion.div initial={{ y: -40 }} animate={{ y: 0 }} className="sticky top-14 z-40 border-y border-red-500/40 bg-gradient-to-r from-red-600/30 via-red-500/20 to-orange-500/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 animate-pulse text-red-300" />
            <span className="mono text-[11px] font-bold uppercase tracking-[0.22em] text-red-200">DEMO MODE — HACKATHON PRESENTATION</span>
          </div>
          <div className="hidden sm:block mono text-[10px] uppercase tracking-wider text-red-200/80">SCENARIO: BANGALORE FLOOD EMERGENCY · SCRIPTED</div>
          <button onClick={triggerAlarm} className="ml-auto flex items-center gap-1 rounded border border-red-300/50 bg-red-500/30 px-2 py-0.5 mono text-[10px] uppercase tracking-wider text-white hover:bg-red-500/40">
            <Volume2 className="h-3 w-3" /> Replay Alarm
          </button>
          <Link href="/" className="flex items-center gap-1 rounded border border-white/20 bg-white/10 px-2 py-0.5 mono text-[10px] uppercase tracking-wider text-white hover:bg-white/20">
            <ArrowLeft className="h-3 w-3" /> Live site
          </Link>
        </div>
        <div className="mx-auto flex max-w-[1500px] flex-wrap gap-1 border-t border-red-500/30 px-4 py-1 sm:px-6">
          {navItems.map(n => {
            const active = pathname === n.href
            return (
              <Link key={n.href} href={n.href}
                className={`rounded px-2.5 py-1 mono text-[10px] font-semibold uppercase tracking-wider transition ${active ? 'bg-red-500 text-white' : 'text-red-100 hover:bg-red-500/30'}`}>
                {n.label}
              </Link>
            )
          })}
        </div>
      </motion.div>
      {children}
    </div>
  )
}
