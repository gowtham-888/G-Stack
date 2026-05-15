'use client'
import { MapContainer, TileLayer, CircleMarker, Circle, Polygon, Polyline, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, Fragment } from 'react'
import { SCENARIO as S } from '@/lib/demo-scenario'

function lerpPolygon(a, b, t) { return a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]) }
function lerp(a, b, t) { return a + (b - a) * t }

export default function DemoFloodMap() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => (t + 1) % 600), 80); return () => clearInterval(id) }, [])
  // 0..1 spread progress, cycles 60s
  const t = (tick % 500) / 500
  const flood = lerpPolygon(S.hazard_polygon_start, S.hazard_polygon_end, t)
  const pulse = (tick % 30) / 30
  // Animated route from Hebbal to Yelahanka (evacuation)
  const route = [S.hebbal_pos, [13.060, 77.605], [13.080, 77.605], S.yelahanka_pos]

  return (
    <MapContainer center={[13.06, 77.6]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" subdomains="abcd" maxZoom={19} attribution='&copy; OSM &copy; CARTO' />

      {/* Spreading flood polygon */}
      <Polygon positions={flood} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25 + pulse * 0.1, weight: 2 }}>
        <Tooltip><div className="mono text-[10px] uppercase tracking-wider">FLOOD ZONE · EXPANDING</div></Tooltip>
      </Polygon>
      <Polygon positions={S.hazard_polygon_end} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.05, weight: 1, dashArray: '4 6' }} />

      {/* Hebbal epicenter pulsing */}
      <Circle center={S.hebbal_pos} radius={500 + pulse * 600} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: Math.max(0, 0.4 - pulse * 0.35), weight: 1.5 }} />
      <CircleMarker center={S.hebbal_pos} radius={9 + Math.sin(tick / 4) * 2} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }}>
        <Tooltip><div className="mono text-[10px] uppercase tracking-wider">HEBBAL EPICENTER · +{S.hebbal_water_rate_cm_per_min}cm/min</div></Tooltip>
      </CircleMarker>

      {/* Yelahanka target */}
      <CircleMarker center={S.yelahanka_pos} radius={8} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 1, weight: 2 }}>
        <Tooltip><div className="mono text-[10px] uppercase tracking-wider">YELAHANKA · IMPACT IN {S.flood_eta_yelahanka_min}m</div></Tooltip>
      </CircleMarker>
      <Circle center={S.yelahanka_pos} radius={800} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.08, weight: 1, dashArray: '3 4' }} />

      {/* Wind arrow / spread vector */}
      <Polyline positions={[S.hebbal_pos, S.yelahanka_pos]} pathOptions={{ color: '#ef4444', weight: 3, opacity: 0.6, dashArray: '8 12', dashOffset: String(-tick * 2) }} />

      {/* Shelters */}
      {S.shelter_pins.map(s => (
        <Fragment key={s.name}>
          <CircleMarker center={s.pos} radius={7} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.95, weight: 2 }}>
            <Tooltip><div className="mono text-[10px] uppercase tracking-wider">SHELTER · {s.name} · cap {s.cap}</div></Tooltip>
          </CircleMarker>
          <CircleMarker center={s.pos} radius={13} pathOptions={{ color: '#22c55e', fillColor: 'transparent', weight: 1, opacity: 0.45 }} />
        </Fragment>
      ))}

      {/* Rescue units */}
      {S.rescue_pins.map(u => (
        <CircleMarker key={u.name} center={u.pos} radius={6} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}>
          <Tooltip><div className="mono text-[10px] uppercase tracking-wider">{u.name} · {u.status}</div></Tooltip>
        </CircleMarker>
      ))}

      {/* Evacuation corridor (animated dashed) */}
      <Polyline positions={route} pathOptions={{ color: '#22c55e', weight: 10, opacity: 0.18 }} />
      <Polyline positions={route} pathOptions={{ color: '#4ade80', weight: 5, opacity: 0.5 }} />
      <Polyline positions={route} pathOptions={{ color: '#dcfce7', weight: 2.2, opacity: 0.95, dashArray: '6 10', dashOffset: String(-tick * 1.8) }} />
    </MapContainer>
  )
}
