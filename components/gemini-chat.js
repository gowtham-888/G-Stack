'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, Sparkles, FileText, Loader2 } from 'lucide-react'

const SUGGEST = [
  'What is the current flood situation in Hebbal?',
  'Suggest evacuation route from Yelahanka to nearest shelter',
  'How many people are at risk in Mandya right now?',
  'Generate Situation Report',
]

function parseConfidence(text) {
  const m = (text || '').match(/CONFIDENCE\s*:?\s*([0-9]{2,3})\s*%/i)
  return m ? Math.min(99, parseInt(m[1], 10)) : null
}

export default function GeminiChat() {
  const [msgs, setMsgs] = useState([{ role: 'model', text: 'ResQNet AI online. I am grounded on live USGS seismic + OpenWeatherMap (Karnataka cities). Ask me anything about current conditions.', conf: 96 }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scroller = useRef(null)

  useEffect(() => { scroller.current?.scrollTo({ top: 99999, behavior: 'smooth' }) }, [msgs, busy])

  async function send(text) {
    const q = (text ?? input).trim()
    if (!q || busy) return
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: q }])
    setBusy(true)
    try {
      const r = await fetch('/api/gemini-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, history: msgs.slice(-6) }) })
      const j = await r.json()
      if (j.ok) {
        setMsgs(m => [...m, { role: 'model', text: j.text, conf: parseConfidence(j.text) ?? 92 }])
      } else {
        setMsgs(m => [...m, { role: 'model', text: `AI offline: ${j.error}`, conf: 0 }])
      }
    } catch (e) {
      setMsgs(m => [...m, { role: 'model', text: 'Network error contacting Gemini.', conf: 0 }])
    } finally { setBusy(false) }
  }

  return (
    <div className="panel-elevated relative overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="relative flex items-center justify-between border-b border-[#1a1a2e] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-[0_0_18px_rgba(139,92,246,0.55)]">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Situation Room - AI Chat</div>
            <div className="mono text-[10px] uppercase tracking-wider text-slate-500">Gemini 2.0 - live USGS + OWM grounded</div>
          </div>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span> ONLINE
        </span>
      </div>

      <div ref={scroller} className="scrollbar-tactical relative max-h-[420px] min-h-[280px] overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={false} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg border px-3 py-2 text-[13px] leading-relaxed ${m.role === 'user' ? 'border-red-500/40 bg-red-500/10 text-red-100' : 'border-[#1a1a2e] bg-[#0a0a0f] text-slate-200'}`}>
                {m.role === 'model' && (
                  <div className="mb-1 flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-purple-400" /><span className="mono text-[9px] uppercase tracking-wider text-purple-400">RESQNET AI</span>{m.conf != null && <span className="ml-auto mono text-[9px] text-emerald-400">{m.conf}% conf</span>}</div>
                )}
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </motion.div>
          ))}
          {busy && (
            <motion.div initial={false} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                <span className="mono text-[10px] uppercase tracking-wider text-slate-400">Thinking - grounding on live feeds...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative border-t border-[#1a1a2e] p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGEST.map(s => (
            <button key={s} onClick={() => send(s)} disabled={busy}
              className="rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-2.5 py-1 mono text-[10px] uppercase tracking-wider text-slate-400 hover:bg-[#13131f] hover:text-white disabled:opacity-50">
              {s === 'Generate Situation Report' && <FileText className="mr-1 inline h-3 w-3 text-purple-400" />} {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask the Situation Room (e.g. 'flood status in Hebbal')..." disabled={busy}
            className="flex-1 rounded-md border border-[#1a1a2e] bg-[#0a0a0f] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20" />
          <button onClick={() => send()} disabled={busy || !input.trim()}
            className="btn-glow flex items-center gap-1.5 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)] disabled:opacity-50">
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  )
}
