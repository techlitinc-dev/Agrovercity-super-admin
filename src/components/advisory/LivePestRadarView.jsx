import { useState } from 'react'
import { RadioTower, AlertTriangle, ShieldAlert, MapPin, Eye, BellRing, RefreshCw } from 'lucide-react'
import { AdvisoryStatusBadge } from '../../pages/advisoryWidgets'

export default function LivePestRadarView({ alerts, onBroadcastNew, onViewAlert }) {
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [hoveredAlert, setHoveredAlert] = useState(null)
  const [selectedAlert, setSelectedAlert] = useState(null)

  const filtered = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false
    return true
  })

  // Simulated polar coordinates on radar display
  const getCoordinatesForAlert = (alert, index, total) => {
    // Generate deterministic angle and radius from alert id/index
    const angle = ((index * 360 / Math.max(total, 1)) + 25) * (Math.PI / 180)
    // Scale distance based on radiusKm (max radar range ~ 100km)
    const normDist = Math.min(Math.max((alert.radiusKm || 30) / 100, 0.2), 0.88)
    const centerX = 200
    const centerY = 200
    const r = normDist * 160 // 160px is max circle radius

    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    return { x, y, r, angle }
  }

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'critical': return '#ef4444' // red-500
      case 'high': return '#f97316' // orange-500
      case 'moderate': return '#eab308' // yellow-500
      case 'low': return '#10b981' // emerald-500
      default: return '#64748b'
    }
  }

  return (
    <div className="space-y-6">
      {/* Radar Control & Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/90 p-4 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <RadioTower className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Geofenced Outbreak Radar Engine</h3>
            <p className="text-xs text-slate-500">Live surveillance across Maharashtra Agro-Climatic Zones · 100km Scan Radius</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-slate-50 p-1">
            {['all', 'critical', 'high', 'moderate', 'low'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterSeverity === sev
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-100/50'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <button
            onClick={onBroadcastNew}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm transition-all active:scale-95"
          >
            <BellRing className="h-4 w-4" /> Broadcast Emergency Alert
          </button>
        </div>
      </div>

      {/* Main Radar Screen & Active Incidents Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Radar Graphic Scope */}
        <div className="relative flex flex-col items-center justify-center rounded-3xl border border-emerald-900/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-2xl lg:col-span-6 overflow-hidden">
          {/* Top radar telemetry */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-emerald-400/90 pb-3 border-b border-emerald-800/40">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              RADAR FREQ: 9.4 GHz (X-BAND AGRO)
            </span>
            <span>BEARING: 042° AUTO-SWEEP</span>
            <span>RANGE: 100 KM</span>
          </div>

          {/* Radar Screen with concentric rings and sweep */}
          <div className="relative my-4 flex h-[380px] w-[380px] items-center justify-center">
            {/* Background grid concentric circles */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="160" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="200" cy="200" r="80" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <circle cx="200" cy="200" r="40" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              
              {/* Axes */}
              <line x1="200" y1="20" x2="200" y2="380" stroke="#059669" strokeWidth="1" opacity="0.4" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#059669" strokeWidth="1" opacity="0.4" />

              {/* Distance markings */}
              <text x="204" y="50" fill="#34d399" fontSize="9" fontFamily="monospace">100 KM</text>
              <text x="204" y="90" fill="#34d399" fontSize="9" fontFamily="monospace">75 KM</text>
              <text x="204" y="130" fill="#34d399" fontSize="9" fontFamily="monospace">50 KM</text>
              <text x="204" y="170" fill="#34d399" fontSize="9" fontFamily="monospace">25 KM</text>
              
              {/* Cardinal directions */}
              <text x="195" y="15" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">N</text>
              <text x="385" y="204" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">E</text>
              <text x="195" y="398" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">S</text>
              <text x="5" y="204" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">W</text>

              {/* Rotating Sweep Beam */}
              <g className="origin-center animate-[spin_6s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
                <defs>
                  <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 200 200 L 200 40 A 160 160 0 0 1 340 100 Z" fill="url(#sweepGradient)" />
                <line x1="200" y1="200" x2="340" y2="100" stroke="#34d399" strokeWidth="1.5" />
              </g>

              {/* Central Radar Node */}
              <circle cx="200" cy="200" r="4" fill="#10b981" />
              <circle cx="200" cy="200" r="8" fill="none" stroke="#34d399" strokeWidth="1" className="animate-ping" />
            </svg>

            {/* Interactive Alert Blips */}
            {filtered.map((alert, idx) => {
              const coords = getCoordinatesForAlert(alert, idx, filtered.length)
              const color = getSeverityColor(alert.severity)
              const isHovered = (hoveredAlert?.id === alert.id) || (selectedAlert?.id === alert.id)

              return (
                <div
                  key={alert.id}
                  style={{
                    left: `${(coords.x / 400) * 100}%`,
                    top: `${(coords.y / 400) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 cursor-pointer"
                  onMouseEnter={() => setHoveredAlert(alert)}
                  onMouseLeave={() => setHoveredAlert(null)}
                  onClick={() => { setSelectedAlert(alert); onViewAlert(alert); }}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className="absolute h-6 w-6 rounded-full animate-ping opacity-60"
                      style={{ backgroundColor: color }}
                    />
                    <span
                      className={`h-4 w-4 rounded-full border-2 border-white shadow-lg transition-transform ${isHovered ? 'scale-150 ring-4 ring-white/50' : 'scale-100'}`}
                      style={{ backgroundColor: color }}
                    />
                    {isHovered && (
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/95 px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-xl border border-slate-700 pointer-events-none z-30">
                        {alert.pestName} · {alert.district} ({alert.radiusKm}km)
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Radar bottom telemetry */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span> Critical ({alerts.filter(a => a.severity === 'critical').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span> High ({alerts.filter(a => a.severity === 'high').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span> Moderate ({alerts.filter(a => a.severity === 'moderate').length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Low ({alerts.filter(a => a.severity === 'low').length})
            </span>
          </div>
        </div>

        {/* Incident Stream & Detail Cards */}
        <div className="flex flex-col space-y-3 lg:col-span-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Outbreaks & Geofence Traps ({filtered.length})
            </h4>
            <span className="font-mono text-xs text-emerald-700 font-semibold">
              Total Reach: {alerts.reduce((sum, a) => sum + (a.recipientsNotified || 0), 0).toLocaleString('en-IN')} farmers
            </span>
          </div>

          <div className="max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
            {filtered.map(alert => {
              const isSelected = selectedAlert?.id === alert.id || hoveredAlert?.id === alert.id
              const color = getSeverityColor(alert.severity)

              return (
                <div
                  key={alert.id}
                  onMouseEnter={() => setHoveredAlert(alert)}
                  onMouseLeave={() => setHoveredAlert(null)}
                  onClick={() => setSelectedAlert(alert)}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-1 ring-emerald-500'
                      : 'border-emerald-100/90 bg-white/90 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                        style={{ backgroundColor: color }}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-sm">{alert.pestName}</h5>
                          <span className="font-mono text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            #{alert.id}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 font-medium">
                          <span className="font-semibold text-slate-800">{alert.district}</span> · Affected: {alert.crop}
                        </p>
                      </div>
                    </div>
                    <AdvisoryStatusBadge status={alert.status} />
                  </div>

                  <p className="mt-2.5 text-xs text-slate-700 line-clamp-2 leading-relaxed bg-white/60 p-2 rounded-lg border border-slate-100">
                    {alert.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-3 font-mono">
                      <span>Radius: <strong className="text-slate-800">⌀ {alert.radiusKm} km</strong></span>
                      <span>Notified: <strong className="text-emerald-700">{alert.recipientsNotified.toLocaleString('en-IN')}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewAlert(alert); }}
                        className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-xs text-slate-500">
                No pest outbreaks currently reported for this severity level.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
