'use client'
import { MapContainer, TileLayer, CircleMarker, Circle, Polyline, Polygon, Tooltip, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Fragment, useEffect, useState } from 'react'

// Karnataka operations baseline scenario layers (always visible)
const SCENARIO_HAZARDS = [
  {
    id: 'hebbal', kind: 'flood', sev: 'CRIT', name: 'Hebbal Flood Zone',
    polygon: [[13.052, 77.585], [13.052, 77.612], [13.025, 77.616], [13.018, 77.598], [13.025, 77.582]],
    center: [13.0358, 77.5970], color: '#ef4444',
  },
  {
    id: 'shiradi', kind: 'landslide', sev: 'HIGH', name: 'Shiradi Ghat Landslide',
    polygon: [[12.985, 75.735], [12.985, 75.778], [12.948, 75.778], [12.942, 75.738]],
    center: [12.965, 75.756], color: '#f97316',
  },
  {
    id: 'mangalore', kind: 'cyclone', sev: 'CRIT', name: 'Cyclone Warning · Mangalore',
    radius: 15000, center: [12.870, 74.842], color: '#a855f7',
  },
  {
    id: 'kaveri', kind: 'flood', sev: 'HIGH', name: 'Kaveri Overflow · Mandya',
    polygon: [[12.560, 76.860], [12.560, 76.940], [12.500, 76.940], [12.490, 76.880]],
    center: [12.524, 76.897], color: '#3b82f6',
  },
]

const SHELTERS = [
  { pos: [13.101, 77.594], name: 'Yelahanka Community Hall', cap: 1600, occ: 42 },
  { pos: [13.035, 77.590], name: 'Hebbal Stadium', cap: 2200, occ: 68 },
  { pos: [13.002, 77.574], name: 'Mekhri Circle School', cap: 900, occ: 31 },
  { pos: [13.011, 77.570], name: 'Sankey Tank Ground', cap: 1100, occ: 22 },
  { pos: [13.024, 77.592], name: 'RT Nagar Sports Complex', cap: 1300, occ: 18 },
]

const RESCUE_UNITS = [
  { pos: [13.101, 77.596], name: 'NDRF Alpha', loc: 'Yelahanka HQ', status: 'READY', personnel: 32, eta: '—' },
  { pos: [13.028, 77.518], name: 'Fire Bravo', loc: 'Peenya', status: 'DEPLOYED', personnel: 18, eta: '4 min' },
  { pos: [13.038, 77.597], name: 'Med Echo', loc: 'Hebbal', status: 'DEPLOYED', personnel: 24, eta: 'On scene' },
]

const SAFE_ROUTE = [[13.101, 77.596], [13.075, 77.594], [13.055, 77.585], [13.038, 77.590]]

const { BaseLayer, Overlay } = LayersControl

export default function TacticalMap() {
  const [tick, setTick] = useState(0)
  const [feed, setFeed] = useState({ hazards: [], usgs: [], weather: [], seismicDisplay: [], seismicFallback: false })
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 90); return () => clearInterval(id) }, [])
  useEffect(() => {
    let alive = true
    const load = async () => { try { const r = await fetch('/api/live-feed'); const j = await r.json(); if (alive && j.ok) setFeed(j) } catch {} }
    load(); const id = setInterval(load, 60_000); return () => { alive = false; clearInterval(id) }
  }, [])
  const pulse = ((tick % 25) / 25)
  const liveQuakes = feed.seismicDisplay && feed.seismicDisplay.length ? feed.seismicDisplay : feed.usgs

  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={8} style={{ height: '100%', width: '100%' }}>
      <LayersControl position="topright">
        <BaseLayer checked name="DARK"><TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" subdomains="abcd" maxZoom={19} attribution='&copy; OSM &copy; CARTO' /></BaseLayer>
        <BaseLayer name="SAT (Esri)"><TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} attribution='Tiles &copy; Esri' /></BaseLayer>
        <BaseLayer name="TERRAIN"><TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" maxZoom={17} attribution='&copy; OpenTopoMap' /></BaseLayer>
        <BaseLayer name="STREETS"><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} attribution='&copy; OpenStreetMap' /></BaseLayer>

        <Overlay checked name="Flood Depth">
          <Polygon positions={SCENARIO_HAZARDS[0].polygon} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25, weight: 2, dashArray: '5 5' }}><Tooltip><div className="mono text-[10px] uppercase tracking-wider">FLOOD ZONE · HEBBAL (CRIT)</div></Tooltip></Polygon>
        </Overlay>
        <Overlay checked name="Landslide Risk">
          <Polygon positions={SCENARIO_HAZARDS[1].polygon} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.22, weight: 2, dashArray: '5 5' }}><Tooltip><div className="mono text-[10px] uppercase tracking-wider">LANDSLIDE · SHIRADI GHAT (HIGH)</div></Tooltip></Polygon>
        </Overlay>
        <Overlay checked name="Cyclone Zone">
          <Circle center={SCENARIO_HAZARDS[2].center} radius={SCENARIO_HAZARDS[2].radius} pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.18, weight: 2, dashArray: '4 6' }}><Tooltip><div className="mono text-[10px] uppercase tracking-wider">CYCLONE WARNING · MANGALORE</div></Tooltip></Circle>
        </Overlay>
        <Overlay checked name="Kaveri Overflow">
          <Polygon positions={SCENARIO_HAZARDS[3].polygon} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.22, weight: 2, dashArray: '5 5' }}><Tooltip><div className="mono text-[10px] uppercase tracking-wider">KAVERI OVERFLOW · MANDYA (HIGH)</div></Tooltip></Polygon>
        </Overlay>

        <Overlay checked name="Shelters">
          <LayerGroupShim>
            {SHELTERS.map((s, i) => (
              <Fragment key={`s-${i}`}>
                <CircleMarker center={s.pos} radius={7} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.95, weight: 2 }}>
                  <Tooltip><div className="mono text-[10px] uppercase tracking-wider">{s.name} · cap {s.cap} · {s.occ}% occupied</div></Tooltip>
                </CircleMarker>
                <CircleMarker center={s.pos} radius={13} pathOptions={{ color: '#22c55e', fillColor: 'transparent', weight: 1, opacity: 0.45 }} />
              </Fragment>
            ))}
          </LayerGroupShim>
        </Overlay>
        <Overlay checked name="Rescue Units">
          <LayerGroupShim>
            {RESCUE_UNITS.map((u, i) => (
              <CircleMarker key={`u-${i}`} center={u.pos} radius={6} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.95, weight: 2 }}>
                <Tooltip><div className="mono text-[10px] uppercase tracking-wider">{u.name} · {u.status} · {u.personnel}p · ETA {u.eta}</div></Tooltip>
              </CircleMarker>
            ))}
          </LayerGroupShim>
        </Overlay>

        <Overlay checked name="Seismic Events">
          <LayerGroupShim>
            {liveQuakes.map((q, i) => {
              const m = q.mag ?? 0
              const c = m >= 5 ? '#ef4444' : m >= 4 ? '#f97316' : m >= 3 ? '#3b82f6' : '#a78bfa'
              return (
                <Fragment key={`q-${i}`}>
                  <Circle center={[q.lat, q.lng]} radius={Math.max(8000, m * 12000)} pathOptions={{ color: c, fillColor: c, fillOpacity: 0.06, weight: 1, opacity: 0.4 }} />
                  <CircleMarker center={[q.lat, q.lng]} radius={Math.max(4, m * 1.5)} pathOptions={{ color: c, fillColor: c, fillOpacity: 0.9, weight: 2 }}>
                    <Tooltip><div className="mono text-[10px] uppercase tracking-wider">USGS M{m?.toFixed(1)} · {q.place}</div></Tooltip>
                  </CircleMarker>
                </Fragment>
              )
            })}
          </LayerGroupShim>
        </Overlay>
      </LayersControl>

      {/* Scenario hazard pulsing markers (always on) */}
      {SCENARIO_HAZARDS.map(h => (
        <Fragment key={`pulse-${h.id}`}>
          <Circle center={h.center} radius={1800 * (1 + pulse * 0.5)} pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: Math.max(0, 0.18 - pulse * 0.15), weight: 1, opacity: Math.max(0, 0.55 - pulse * 0.5) }} />
          <CircleMarker center={h.center} radius={6 + Math.sin(tick / 4) * 1.5} pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 1, weight: 2 }}>
            <Tooltip><div className="mono text-[10px] uppercase tracking-wider">[{h.sev}] {h.name}</div></Tooltip>
          </CircleMarker>
        </Fragment>
      ))}

      {/* Weather overlays (auto on heavy rain) */}
      {feed.weather && feed.weather.map((w, i) => {
        if (w.error) return null
        const heavy = (w.rain || 0) > 8 || (w.wind || 0) > 12
        if (!heavy) return null
        return <Circle key={`wx-${i}`} center={[w.lat, w.lng]} radius={6000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '3 4' }}><Tooltip><div className="mono text-[10px] uppercase tracking-wider">{w.city} · rain {w.rain}mm · wind {w.wind}m/s</div></Tooltip></Circle>
      })}

      {/* Safe corridor (Yelahanka → Hebbal) */}
      <Polyline positions={SAFE_ROUTE} pathOptions={{ color: '#22c55e', weight: 10, opacity: 0.18 }} />
      <Polyline positions={SAFE_ROUTE} pathOptions={{ color: '#4ade80', weight: 5, opacity: 0.55 }} />
      <Polyline positions={SAFE_ROUTE} pathOptions={{ color: '#dcfce7', weight: 2.2, opacity: 0.95, dashArray: '6 10', dashOffset: String(-tick * 1.8) }}>
        <Tooltip sticky><div className="mono text-[10px] uppercase tracking-wider">SAFE CORRIDOR · 12.4km · ETA 8 min</div></Tooltip>
      </Polyline>
    </MapContainer>
  )
}

// React-leaflet doesn't allow direct LayerGroup in Overlay child as easily; use a fragment shim
function LayerGroupShim({ children }) { return <>{children}</> }
