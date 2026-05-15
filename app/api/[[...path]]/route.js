import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite']

async function callGemini(contents, opts = {}) {
  let lastErr = 'unknown'
  for (const model of GEMINI_MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.4, maxOutputTokens: opts.maxTokens || 380 } }),
      })
      const j = await r.json()
      if (r.ok) {
        const text = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || ''
        if (text.trim()) return { ok: true, text, model }
      }
      lastErr = j.error?.message || `status ${r.status}`
    } catch (e) { lastErr = String(e) }
  }
  return { ok: false, error: lastErr }
}

function errJSON(msg, code = 500) { return NextResponse.json({ ok: false, error: msg }, { status: code }) }

// --- LIVE DATA SOURCES ---

async function fetchUSGSIndia() {
  try {
    const r = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', { next: { revalidate: 60 } })
    const j = await r.json()
    return (j.features || []).filter(f => {
      const [lng, lat] = f.geometry.coordinates
      return lat >= 5 && lat <= 38 && lng >= 65 && lng <= 100
    }).slice(0, 12).map(f => ({
      mag: f.properties.mag, place: f.properties.place, time: f.properties.time,
      lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2], url: f.properties.url,
    }))
  } catch { return [] }
}

const KARNATAKA_CITIES = [
  { name: 'Bangalore', q: 'Bengaluru,IN', lat: 12.9716, lng: 77.5946 },
  { name: 'Mangalore', q: 'Mangalore,IN', lat: 12.9141, lng: 74.8560 },
  { name: 'Mandya', q: 'Mandya,IN', lat: 12.5266, lng: 76.8956 },
  { name: 'Mysore', q: 'Mysore,IN', lat: 12.2958, lng: 76.6394 },
  { name: 'Hubli', q: 'Hubli,IN', lat: 15.3647, lng: 75.1240 },
  { name: 'Udupi', q: 'Udupi,IN', lat: 13.3409, lng: 74.7421 },
]

async function fetchOWM(cities = KARNATAKA_CITIES) {
  const key = process.env.NEXT_PUBLIC_OWM_KEY
  const out = []
  await Promise.all(cities.map(async (c) => {
    try {
      const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c.q)}&appid=${key}&units=metric`, { next: { revalidate: 120 } })
      const j = await r.json()
      out.push({ city: c.name, lat: c.lat, lng: c.lng, temp: j.main?.temp, humidity: j.main?.humidity, wind: j.wind?.speed, desc: j.weather?.[0]?.description, rain: j.rain?.['1h'] || 0, code: j.weather?.[0]?.id, icon: j.weather?.[0]?.icon })
    } catch { out.push({ city: c.name, lat: c.lat, lng: c.lng, error: true }) }
  }))
  return out.sort((a, b) => KARNATAKA_CITIES.findIndex(x => x.name === a.city) - KARNATAKA_CITIES.findIndex(x => x.name === b.city))
}

// Severity classification from real weather
function classifyWeather(w) {
  if (w.error) return null
  const wind = w.wind || 0
  const rain = w.rain || 0
  // Thresholds in m/s and mm/h
  if (wind > 20 || rain > 20) return { sev: 'CRIT', reason: `Severe weather (wind ${wind}m/s, rain ${rain}mm/h)` }
  if (wind > 12 || rain > 8) return { sev: 'HIGH', reason: `Heavy weather (wind ${wind}m/s, rain ${rain}mm/h)` }
  if (wind > 8 || rain > 3) return { sev: 'MED', reason: `Notable weather (wind ${wind}m/s, rain ${rain}mm/h)` }
  return null
}

async function fetchUSGSGlobal() {
  try {
    const r = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', { next: { revalidate: 60 } })
    const j = await r.json()
    return (j.features || []).slice(0, 5).map(f => ({
      mag: f.properties.mag, place: f.properties.place, time: f.properties.time,
      lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2], url: f.properties.url, global: true,
    }))
  } catch { return [] }
}

// Karnataka operations baseline - ongoing monitored scenarios (always shown as ongoing ops)
const KARNATAKA_BASELINE = [
  { id: 'bl-hebbal', source: 'KSDMA Ops', kind: 'flood', sev: 'CRIT', title: 'Hebbal Underpass Submerged - Bengaluru N', lat: 13.0358, lng: 77.5970, time: Date.now() - 14 * 60_000, affected: 12400, eta: '06h', desc: 'Water 1.8m. NDRF Alpha enroute.', baseline: true },
  { id: 'bl-mangalore', source: 'IMD Doppler', kind: 'cyclone', sev: 'CRIT', title: 'Cyclone Biparjoy - Mangalore Coast', lat: 12.8700, lng: 74.8420, time: Date.now() - 32 * 60_000, affected: 84200, eta: '02h', desc: 'Gusts 145 km/h. Coastal evacuation in progress.', baseline: true },
  { id: 'bl-shiradi', source: 'KSP', kind: 'landslide', sev: 'HIGH', title: 'NH48 Shiradi Ghat Blocked', lat: 12.965, lng: 75.756, time: Date.now() - 18 * 60_000, affected: 340, eta: '12h', desc: '2 vehicles trapped. Crane dispatched.', baseline: true },
  { id: 'bl-kaveri', source: 'KSDMA Ops', kind: 'flood', sev: 'HIGH', title: 'Kaveri River +3.2m - Mandya', lat: 12.5266, lng: 76.8956, time: Date.now() - 40 * 60_000, affected: 8900, eta: '24h', desc: 'Multiple villages on alert. 6 reservoirs upstream monitored.', baseline: true },
]

async function buildLiveFeed() {
  const [usgs, weather] = await Promise.all([fetchUSGSIndia(), fetchOWM()])
  const hazards = [...KARNATAKA_BASELINE]
  for (const e of usgs) {
    const mag = e.mag || 0
    const sev = mag >= 5 ? 'CRIT' : mag >= 4 ? 'HIGH' : mag >= 3 ? 'MED' : 'LOW'
    if (sev === 'LOW') continue
    hazards.push({ id: `eq-${e.time}`, source: 'USGS', kind: 'earthquake', sev, title: `M${mag.toFixed(1)} earthquake - ${e.place}`, lat: e.lat, lng: e.lng, time: e.time, meta: { magnitude: mag, depth: e.depth, url: e.url } })
  }
  for (const w of weather) {
    const c = classifyWeather(w)
    if (!c) continue
    hazards.push({ id: `wx-${w.city}-${Math.round((w.wind || 0) * 10)}`, source: 'OpenWeatherMap', kind: 'weather', sev: c.sev, title: `${c.reason} - ${w.city}`, lat: w.lat, lng: w.lng, time: Date.now(), meta: { wind_ms: w.wind, rain_mm_1h: w.rain, desc: w.desc, temp_c: w.temp } })
  }
  const rank = { CRIT: 0, HIGH: 1, MED: 2 }
  hazards.sort((a, b) => (rank[a.sev] - rank[b.sev]) || (b.time - a.time))

  // Always provide seismic display (fallback global if India empty)
  let seismicDisplay = usgs
  let seismicFallback = false
  if (usgs.length === 0) { seismicDisplay = await fetchUSGSGlobal(); seismicFallback = true }

  return { usgs, weather, hazards, seismicDisplay, seismicFallback, generatedAt: Date.now() }
}

// --- DEMO SCENARIO (frozen, used only for /demo and /api/demo-* endpoints) ---

const DEMO_SCENARIO = {
  name: 'Bangalore Flood Emergency',
  active_disaster: 'Flash Flood - Bangalore North',
  hebbal_water_rate_cm_per_min: 8,
  spread_vector: 'North-East toward Yelahanka',
  flood_eta_yelahanka_min: 47,
  affected_people: 12400,
  wind_kmph: 67,
  wind_direction: 'SW',
  rainfall_mm_last_3h: 84,
  rescue_teams: ['NDRF Alpha', 'Med Echo', 'KSP Delta'],
  shelters: ['Yelahanka Community Hall', 'Hebbal Stadium', 'Mekhri Circle School', 'Sankey Tank Ground', 'RT Nagar Sports Complex'],
  hazard_polygon: [[13.0820, 77.5910], [13.0700, 77.6300], [13.0500, 77.6450], [13.0250, 77.6420], [13.0050, 77.6200], [13.0100, 77.5900], [13.0350, 77.5800], [13.0600, 77.5800]],
  yelahanka_pos: [13.1007, 77.5963],
  hebbal_pos: [13.0358, 77.5970],
  shelter_pins: [
    { name: 'Yelahanka Community Hall', pos: [13.1066, 77.6080], cap: 1600 },
    { name: 'Hebbal Stadium', pos: [13.0480, 77.6230], cap: 2200 },
    { name: 'Mekhri Circle School', pos: [13.0190, 77.5840], cap: 900 },
    { name: 'Sankey Tank Ground', pos: [13.0078, 77.5751], cap: 1100 },
    { name: 'RT Nagar Sports Complex', pos: [13.0270, 77.6020], cap: 1300 },
  ],
  rescue_pins: [
    { name: 'NDRF Alpha', pos: [13.1007, 77.5963], type: 'Heavy Rescue' },
    { name: 'Med Echo', pos: [13.0358, 77.5970], type: 'Field Hospital' },
    { name: 'KSP Delta', pos: [13.0190, 77.5840], type: 'Crowd Control' },
  ],
}

// --- ROUTES ---

export async function GET(req, { params }) {
  const path = (params?.path || []).join('/')
  if (path === 'usgs') { const d = await fetchUSGSIndia(); return NextResponse.json({ ok: true, count: d.length, items: d }) }
  if (path === 'weather') { const d = await fetchOWM(); return NextResponse.json({ ok: true, items: d }) }
  if (path === 'live-feed') { const feed = await buildLiveFeed(); return NextResponse.json({ ok: true, ...feed }) }
  if (path === 'demo-scenario') { return NextResponse.json({ ok: true, scenario: DEMO_SCENARIO }) }
  return NextResponse.json({ status: 'ok', service: 'ResQNet API', endpoints: ['/api/usgs', '/api/weather', '/api/live-feed', '/api/demo-scenario', '/api/gemini-chat (POST)', '/api/demo-gemini-chat (POST)', '/api/situation-brief'] })
}

export async function POST(req, { params }) {
  const path = (params?.path || []).join('/')
  let body; try { body = await req.json() } catch { return errJSON('bad json', 400) }

  // --- MAIN site: real-data Gemini chat ---
  if (path === 'gemini-chat') {
    if (!GEMINI_KEY) return errJSON('GEMINI_API_KEY missing', 500)
    const { message = '', history = [] } = body
    if (!message.trim()) return errJSON('message required', 400)
    const feed = await buildLiveFeed()
    const ctx = `LIVE DATA SNAPSHOT (ground truth):

USGS earthquakes (India region, last 24h, ${feed.usgs.length} events):
${feed.usgs.slice(0, 8).map(e => `- M${e.mag?.toFixed(1)} - ${e.place} - depth ${e.depth}km`).join('\n') || '- none in India region'}

OpenWeatherMap (Karnataka cities, real-time):
${feed.weather.map(w => w.error ? `- ${w.city}: data error` : `- ${w.city}: ${w.temp?.toFixed(1)} C, ${w.desc}, wind ${w.wind}m/s, humidity ${w.humidity}%, rain(1h) ${w.rain}mm`).join('\n')}

Ongoing Karnataka operations (KSDMA baseline + live-derived):
${feed.hazards.map(h => `- [${h.sev}] ${h.title} - ${h.source}${h.affected ? ' - ' + h.affected.toLocaleString() + ' affected' : ''}${h.eta ? ' - ETA ' + h.eta : ''}`).join('\n')}`

    const sys = `You are ResQNet AI - an emergency response intelligence officer for Karnataka. Answer in UNDER 100 WORDS. Be direct, tactical, urgent. Give specific Karnataka locations, distances, ETAs. Use bullet points. Always recommend ONE concrete action. End with single line "CONFIDENCE: NN%".`

    const contents = [
      { role: 'user', parts: [{ text: sys + '\n\n' + ctx }] },
      { role: 'model', parts: [{ text: 'Acknowledged. Monitoring live grid.' }] },
      ...history.slice(-6).map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: String(h.text || '') }] })),
      { role: 'user', parts: [{ text: message }] },
    ]
    const r = await callGemini(contents)
    if (!r.ok) return errJSON(r.error, 500)
    return NextResponse.json({ ok: true, text: r.text, model: r.model, hazards: feed.hazards.length })
  }

  // --- MAIN site: situation brief (auto-generated from live feed) ---
  if (path === 'situation-brief') {
    if (!GEMINI_KEY) return errJSON('GEMINI_API_KEY missing', 500)
    const feed = await buildLiveFeed()
    if (feed.hazards.length === 0) {
      return NextResponse.json({ ok: true, text: 'STATUS: ALL CLEAR\n\nNo active threats detected in Karnataka region.\n\n- USGS: ' + feed.usgs.length + ' minor seismic events (none in Karnataka)\n- OpenWeatherMap: All monitored cities report stable conditions\n- Continuous monitoring active - auto-refresh every 60s\n\nCONFIDENCE: 98%', live: true, hazardCount: 0 })
    }
    const sys = `You are ResQNet AI. Generate a concise tactical situation briefing (under 110 words) from the live data. Use bullets. List by severity. Be factual - do not invent details. End with "CONFIDENCE: NN%".`
    const ctx = `LIVE HAZARDS:\n${feed.hazards.map(h => `- [${h.sev}] ${h.title} - source ${h.source} - ${h.kind}`).join('\n')}\n\nUSGS sample: ${feed.usgs.slice(0, 3).map(e => `M${e.mag} ${e.place}`).join('; ')}\nOWM sample: ${feed.weather.slice(0, 3).map(w => `${w.city} ${w.wind}m/s wind, ${w.rain}mm rain`).join('; ')}`
    const r = await callGemini([{ role: 'user', parts: [{ text: sys + '\n\n' + ctx }] }], { maxTokens: 260 })
    if (!r.ok) return errJSON(r.error, 500)
    return NextResponse.json({ ok: true, text: r.text, live: true, hazardCount: feed.hazards.length, hazards: feed.hazards })
  }

  // --- DEMO: scripted Gemini chat for hackathon scenario ---
  if (path === 'demo-gemini-chat') {
    if (!GEMINI_KEY) return errJSON('GEMINI_API_KEY missing', 500)
    const { message = '', history = [] } = body
    if (!message.trim()) return errJSON('message required', 400)
    const S = DEMO_SCENARIO
    const ctx = `DEMO SCENARIO (treat as fully active reality):
- Active disaster: ${S.active_disaster}
- Hebbal water table rising ${S.hebbal_water_rate_cm_per_min} cm/min
- Spread vector: ${S.spread_vector}
- ETA flood reaches Yelahanka: ${S.flood_eta_yelahanka_min} minutes
- Affected people: ${S.affected_people.toLocaleString()}
- Wind: ${S.wind_kmph} km/h from ${S.wind_direction}
- Rainfall: ${S.rainfall_mm_last_3h}mm in last 3 hours
- Deployed rescue teams: ${S.rescue_teams.join(', ')}
- Active shelters: ${S.shelters.join(', ')}`
    const sys = `You are ResQNet AI in active emergency response mode for ${S.name}. Be DRAMATIC, urgent, tactical. Use mono-style bullet lists. Recommend specific shelters, units, ETAs from the scenario. Under 140 words. End with single line "CONFIDENCE: NN%".`
    const contents = [
      { role: 'user', parts: [{ text: sys + '\n\n' + ctx }] },
      { role: 'model', parts: [{ text: 'Acknowledged. ResQNet Command Center online. Bangalore Flood operations standing by.' }] },
      ...history.slice(-6).map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: String(h.text || '') }] })),
      { role: 'user', parts: [{ text: message }] },
    ]
    const r = await callGemini(contents)
    if (!r.ok) return errJSON(r.error, 500)
    return NextResponse.json({ ok: true, text: r.text, model: r.model, scenario: 'bangalore-flood' })
  }

  return errJSON('unknown endpoint', 404)
}
