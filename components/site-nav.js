'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Radio, Map, Bell, Users, ShieldCheck, Siren } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home', icon: Shield },
  { href: '/dashboard', label: 'Situation Room', icon: Radio },
  { href: '/map', label: 'Tactical Map', icon: Map },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/safe', label: 'Am I Safe?', icon: ShieldCheck, highlight: true },
  { href: '/resources', label: 'Resources', icon: Users },
  { href: '/demo', label: 'Demo', icon: Siren },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [time, setTime] = useState('')
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000)
    setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    return () => clearInterval(t)
  }, [])

  return (
    <motion.header initial={false} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-[#1a1a2e] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_18px_rgba(239,68,68,0.6)]">
            <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.9)] animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-extrabold tracking-tight text-white">ResQNet</span>
            <span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-500">AI · KARNATAKA · OPS</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            const Icon = l.icon
            if (l.highlight) {
              return (
                <Link key={l.href} href={l.href}
                  className={`relative flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${active ? 'border-orange-500/60 bg-orange-500/15 text-orange-200' : 'border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'} shadow-[0_0_16px_rgba(249,115,22,0.25)]`}>
                  <Icon className="h-3.5 w-3.5" />
                  {l.label}
                  <span className="relative ml-0.5 flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" /></span>
                </Link>
              )
            }
            return (
              <Link key={l.href} href={l.href}
                className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                <Icon className="h-3.5 w-3.5" />
                {l.label}
                {active && <motion.span layoutId="navpill" className="absolute inset-0 -z-10 rounded-md border border-red-500/30 bg-red-500/10" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            <span className="mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">LIVE</span>
          </div>
          <div className="mono text-xs text-slate-300">{time}</div>
        </div>
      </div>
    </motion.header>
  )
}
