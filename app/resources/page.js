'use client'
import { motion } from 'framer-motion'
import { Ambulance, Truck, Users, Plane, ShieldCheck, Radio, MapPin, Send, Activity } from 'lucide-react'

const units = [
  { name: 'NDRF Alpha', type: 'Heavy Rescue', icon: ShieldCheck, status: 'READY', personnel: 32, loc: 'Yelahanka HQ', readiness: 96, color: 'emerald' },
  { name: 'Fire Bravo', type: 'Fire & HazMat', icon: Truck, status: 'DEPLOYED', personnel: 18, loc: 'Peenya', readiness: 64, color: 'red' },
  { name: 'Med Echo', type: 'Field Hospital', icon: Ambulance, status: 'READY', personnel: 24, loc: 'Hebbal', readiness: 88, color: 'emerald' },
  { name: 'KSP Delta', type: 'Crowd Control', icon: Users, status: 'ENROUTE', personnel: 40, loc: 'ORR North', readiness: 71, color: 'orange' },
  { name: 'Coast Foxtrot', type: 'Naval Rescue', icon: Plane, status: 'READY', personnel: 16, loc: 'Mangalore Port', readiness: 92, color: 'emerald' },
  { name: 'Comms Gamma', type: 'Mobile Comms', icon: Radio, status: 'DEPLOYED', personnel: 8, loc: 'Mandya', readiness: 58, color: 'red' },
]

const statusMap = {
  READY: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/40',
  DEPLOYED: 'text-red-300 bg-red-500/10 border-red-500/40',
  ENROUTE: 'text-orange-300 bg-orange-500/10 border-orange-500/40',
}
const barColor = { emerald: 'bg-emerald-500', red: 'bg-red-500', orange: 'bg-orange-500' }

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-orange-400">DEPLOYMENT GRID</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Rescue Resources</h1>
        <p className="mt-1 text-sm text-slate-400">{units.length} units tracked · {units.reduce((a, u) => a + u.personnel, 0)} personnel · live GPS</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'TOTAL UNITS', value: units.length, c: 'blue' },
          { label: 'READY', value: units.filter(u => u.status === 'READY').length, c: 'emerald' },
          { label: 'DEPLOYED', value: units.filter(u => u.status === 'DEPLOYED').length, c: 'red' },
          { label: 'PERSONNEL', value: units.reduce((a, u) => a + u.personnel, 0), c: 'orange' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="panel-elevated rounded-xl p-4">
            <div className="mono text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="mt-1 text-3xl font-extrabold text-white tabular-nums">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {units.map((u, i) => {
          const Icon = u.icon
          return (
            <motion.div key={u.name} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="panel-elevated group relative overflow-hidden rounded-xl p-5">
              <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition group-hover:opacity-100 ${u.color === 'emerald' ? 'bg-emerald-500/10' : u.color === 'red' ? 'bg-red-500/10' : 'bg-orange-500/10'}`} />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`relative flex h-11 w-11 items-center justify-center rounded-lg border ${u.color === 'emerald' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : u.color === 'red' ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-orange-500/40 bg-orange-500/10 text-orange-300'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{u.name}</div>
                    <div className="mono text-[10px] uppercase tracking-wider text-slate-500">{u.type}</div>
                  </div>
                </div>
                <span className={`rounded border px-1.5 py-0.5 mono text-[9px] font-bold ${statusMap[u.status]}`}>
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle animate-pulse" />
                  {u.status}
                </span>
              </div>
              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5">
                  <div className="mono text-[9px] uppercase tracking-wider text-slate-500">PERSONNEL</div>
                  <div className="text-sm font-bold text-white">{u.personnel}</div>
                </div>
                <div className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1.5">
                  <div className="mono text-[9px] uppercase tracking-wider text-slate-500 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> LOCATION</div>
                  <div className="text-sm font-bold text-white">{u.loc}</div>
                </div>
              </div>
              <div className="relative mt-3">
                <div className="flex items-center justify-between">
                  <span className="mono text-[9px] uppercase tracking-wider text-slate-500">READINESS</span>
                  <span className="mono text-[10px] font-bold text-white">{u.readiness}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${u.readiness}%` }} transition={{ duration: 1.2, delay: i * 0.05 }} className={`h-full ${barColor[u.color]}`} />
                </div>
              </div>
              <div className="relative mt-4 flex gap-2">
                <button className="flex-1 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)]">
                  <Send className="mr-1 inline h-3 w-3" /> Deploy
                </button>
                <button className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-[#13131f]">
                  <Activity className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
