'use client'
import { motion } from 'framer-motion'
import { Brain, Heart, Rocket, Code2, Map, Radio, Github, Award, Shield, Sparkles, Zap, Globe } from 'lucide-react'
import GridBG from '@/components/grid-bg'

const fadeUp = { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }

const tech = [
  { name: 'Next.js 14', icon: Code2 }, { name: 'Tailwind CSS', icon: Sparkles }, { name: 'Framer Motion', icon: Zap },
  { name: 'React Leaflet', icon: Map }, { name: 'Gemini AI', icon: Brain }, { name: 'MongoDB', icon: Globe },
  { name: 'ShadCN UI', icon: Shield }, { name: 'Lucide Icons', icon: Radio },
]

const team = [
  { name: 'Aarav Kapoor', role: 'AI / Backend', initial: 'AK', color: 'red' },
  { name: 'Sneha Iyer', role: 'Frontend / Motion', initial: 'SI', color: 'orange' },
  { name: 'Rohan Mehta', role: 'Geospatial / Data', initial: 'RM', color: 'blue' },
  { name: 'Priya Nair', role: 'UX / Product', initial: 'PN', color: 'emerald' },
]

const colorTeam = {
  red: 'from-red-500 to-orange-500', orange: 'from-orange-500 to-yellow-500',
  blue: 'from-blue-500 to-purple-500', emerald: 'from-emerald-500 to-teal-500',
}

export default function AboutPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-[#1a1a2e] py-20">
        <GridBG />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
            <Award className="h-3.5 w-3.5 text-orange-400" />
            <span className="mono text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-300">HACKATHON 2025 · DISASTER INTELLIGENCE</span>
          </motion.div>
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            We built ResQNet because<br />
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">someone had to.</span>
          </motion.h1>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            On July 14, 2024, Bengaluru flooded — again. Maps still routed cars through 5-feet of water. Rescue teams worked off WhatsApp. We watched, helpless. So we built the system we wished existed.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1300px] gap-4 px-6 md:grid-cols-3">
          {[
            { title: 'Mission', icon: Rocket, color: 'red', body: 'Zero preventable deaths in Indian disasters. Build the operating system for emergency response — open, real-time, AI-native.' },
            { title: 'Inspiration', icon: Heart, color: 'orange', body: 'Karnataka loses lives every monsoon because tech wasn\u2019t built for chaos. We refuse to accept that as normal.' },
            { title: 'Vision', icon: Brain, color: 'blue', body: 'A national disaster intelligence grid that fuses satellite, sensor, and citizen data into actionable command-center clarity.' },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div key={c.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
                className="panel-elevated relative overflow-hidden rounded-xl p-6">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border ${c.color === 'red' ? 'border-red-500/40 bg-red-500/10 text-red-300' : c.color === 'orange' ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-blue-500/40 bg-blue-500/10 text-blue-300'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[#1a1a2e] py-20">
        <div className="mx-auto max-w-[1300px] px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-blue-400">TECHNOLOGY STACK</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Engineered for life-critical performance.</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tech.map((t, i) => {
              const Icon = t.icon
              return (
                <motion.div key={t.name} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}
                  className="panel-elevated flex items-center gap-3 rounded-xl p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#1a1a2e] bg-[#0a0a0f] text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1300px] px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-red-400">THE CREW</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Four students. One impossible deadline.</h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <motion.div key={m.name} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                className="panel-elevated relative overflow-hidden rounded-xl p-5 text-center">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${colorTeam[m.color]} text-2xl font-extrabold text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)]`}>
                  {m.initial}
                </div>
                <div className="mt-4 text-base font-bold text-white">{m.name}</div>
                <div className="mono mt-1 text-[10px] uppercase tracking-wider text-slate-500">{m.role}</div>
                <button className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1 mono text-[10px] uppercase tracking-wider text-slate-300 hover:bg-[#13131f]">
                  <Github className="h-3 w-3" /> profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[#1a1a2e] py-16">
        <div className="absolute inset-0 tactical-grid opacity-30" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to step inside the command center?</h3>
          <p className="mt-2 text-sm text-slate-400">Experience what tomorrow’s disaster response looks like — today.</p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/dashboard" className="btn-glow inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(239,68,68,0.35)]">
              <Radio className="h-4 w-4" /> Enter Situation Room
            </a>
            <a href="/map" className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/5 px-5 py-2.5 text-sm font-semibold text-blue-200 hover:bg-blue-500/10">
              <Map className="h-4 w-4" /> View Tactical Map
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
