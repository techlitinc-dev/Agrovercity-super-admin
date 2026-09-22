import React from 'react'
import {
  Droplets,
  Waves,
  Gauge,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Activity,
  Database,
  Lock,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  MapPin,
  FileText,
  SlidersHorizontal,
  BellRing
} from 'lucide-react'

export function fmtLiters(liters) {
  if (liters === undefined || liters === null) return '—'
  if (liters >= 1000000) {
    return `${(liters / 1000000).toFixed(2)} ML`
  }
  return `${Number(liters).toLocaleString('en-IN')} L`
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const toneMap = {
    emerald: 'text-emerald-700 bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'text-amber-700 bg-amber-50 text-amber-600 border-amber-100',
    rose: 'text-rose-700 bg-rose-50 text-rose-600 border-rose-100',
    blue: 'text-sky-700 bg-sky-50 text-sky-600 border-sky-100',
    purple: 'text-purple-700 bg-purple-50 text-purple-600 border-purple-100',
    cyan: 'text-teal-700 bg-teal-50 text-teal-600 border-teal-100',
    slate: 'text-slate-800 bg-slate-50 text-slate-600 border-slate-200'
  }

  const currentTone = toneMap[color] || toneMap.emerald
  const [valColor, iconBg, iconColor, iconBorder] = currentTone.split(' ')

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      } ${alert ? 'ring-2 ring-rose-500/30' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${iconBg} ${iconColor} ${iconBorder}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2.5">
        <span className={`text-2xl font-black font-mono tracking-tight ${valColor}`}>{value}</span>
        {subtext && <p className="mt-1 text-xs text-slate-500 font-medium truncate">{subtext}</p>}
      </div>
    </div>
  )
}

export function TabSwitch({ activeTab, onChangeTab, counts = {} }) {
  const tabs = [
    { id: 'schedules', label: 'Plot Water Schedules', icon: Droplets, badge: counts.schedules },
    { id: 'cgwb', label: 'CGWB Groundwater Stations', icon: Gauge, badge: counts.cgwb },
    { id: 'canals', label: 'Canal Rotation Timetables', icon: Waves, badge: counts.canals },
    { id: 'subsidy', label: 'PMKSY 55% Subsidy Calculator', icon: Sparkles, badge: counts.subsidy },
    { id: 'advisories', label: 'Drought & Low-Water Alerts', icon: BellRing, badge: counts.advisories },
    { id: 'audit', label: 'Audit Logs & Telemetry', icon: Activity, badge: counts.audit }
  ]

  return (
    <div className="flex items-center gap-1.5 border-b border-emerald-100/80 px-6 pb-2 bg-white/50 backdrop-blur-sm overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-emerald-700/80 text-emerald-100 border-emerald-500/50'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function StatusBadge({ status, type = 'schedule' }) {
  if (type === 'cgwb') {
    const map = {
      SAFE: { label: 'Safe Aquifer', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      SEMI_CRITICAL: { label: 'Semi-Critical', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
      CRITICAL: { label: 'Critical Depth', cls: 'bg-rose-50 text-rose-800 border-rose-300' },
      OVER_EXPLOITED: { label: 'Over-Exploited (OEX)', cls: 'bg-purple-50 text-purple-800 border-purple-300' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  if (type === 'canal') {
    const map = {
      active_rotation: { label: 'Active Release', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      scheduled: { label: 'Scheduled Rotation', cls: 'bg-sky-50 text-sky-800 border-sky-300' },
      maintenance_closure: { label: 'Maintenance Closure', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
      dry_spell: { label: 'Water Deficit Hold', cls: 'bg-rose-50 text-rose-800 border-rose-300' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  if (type === 'alert') {
    const map = {
      OPTIMAL: { label: 'Optimal Irrigation', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      UNDER_IRRIGATED: { label: 'Under-Irrigated', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
      OVER_IRRIGATED: { label: 'Over-Irrigated Risk', cls: 'bg-rose-50 text-rose-800 border-rose-300' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  // General Schedule / Subsidy
  const map = {
    active: { label: 'Active Running', cls: 'bg-teal-50 text-teal-800 border-teal-300' },
    scheduled: { label: 'Scheduled', cls: 'bg-sky-50 text-sky-800 border-sky-300' },
    completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    skipped: { label: 'Skipped', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    pending_inspection: { label: 'Pending Inspection', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
    first_signoff: { label: '1st Signoff Done', cls: 'bg-purple-50 text-purple-800 border-purple-300' }
  }

  const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  )
}

export function FiltersBar({
  tab,
  q,
  setQ,
  status,
  setStatus,
  irrigationType,
  setIrrigationType,
  district,
  setDistrict,
  alertFilter,
  setAlertFilter,
  onExportCsv,
  onSyncCgwb,
  onUpdateCanal,
  onConfigureSubsidy,
  onIssueDroughtAlert
}) {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === 'schedules'
                ? 'Search Gat #, farmer, village, crop...'
                : tab === 'cgwb'
                ? 'Search station code, tehsil, aquifer...'
                : tab === 'canals'
                ? 'Search canal name, division, village...'
                : tab === 'subsidy'
                ? 'Search PMKSY app #, farmer, Aadhaar...'
                : 'Search water advisories or audit logs...'
            }
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Schedule Status Filter */}
        {tab === 'schedules' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Schedule Statuses</option>
            <option value="active">Active Running</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select>
        )}

        {/* Irrigation Type Filter */}
        {tab === 'schedules' && (
          <select
            value={irrigationType}
            onChange={(e) => setIrrigationType(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Irrigation Methods</option>
            <option value="Drip">Drip Irrigation (ठिबक)</option>
            <option value="Sprinkler">Sprinkler (तुषार)</option>
            <option value="Furrow">Furrow / Flood</option>
            <option value="Canal">Canal Lift Linked</option>
          </select>
        )}

        {/* Over/Under Irrigation Alert Filter */}
        {tab === 'schedules' && (
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Irrigation Levels</option>
            <option value="OPTIMAL">Optimal Irrigation</option>
            <option value="UNDER_IRRIGATED">Under-Irrigated Alert</option>
            <option value="OVER_IRRIGATED">Over-Irrigated Alert</option>
          </select>
        )}

        {/* CGWB Category Filter */}
        {tab === 'cgwb' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Aquifer Categories</option>
            <option value="SAFE">Safe Category</option>
            <option value="SEMI_CRITICAL">Semi-Critical</option>
            <option value="CRITICAL">Critical Depth</option>
            <option value="OVER_EXPLOITED">Over-Exploited (OEX)</option>
          </select>
        )}

        {/* Canal Status Filter */}
        {tab === 'canals' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Canal Release Statuses</option>
            <option value="active_rotation">Active Flow Release</option>
            <option value="scheduled">Scheduled Rotation</option>
            <option value="maintenance_closure">Maintenance Closure</option>
            <option value="dry_spell">Water Deficit Hold</option>
          </select>
        )}

        {/* District Filter */}
        {['schedules', 'cgwb', 'canals'].includes(tab) && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Districts</option>
            <option value="Nashik">Nashik</option>
            <option value="Jalna">Jalna</option>
            <option value="Beed">Beed</option>
            <option value="Latur">Latur</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Dewas">Dewas (MP)</option>
          </select>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'cgwb' && onSyncCgwb && (
          <button
            onClick={onSyncCgwb}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition active:scale-95"
            title="Batch ingest CGWB observatory station readings (SOP-17 §3)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync CGWB Readings</span>
          </button>
        )}

        {tab === 'canals' && onUpdateCanal && (
          <button
            onClick={onUpdateCanal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition active:scale-95"
            title="Update canal rotation timetable & release dates (SOP-17 §3)"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>+ Update Canal Schedule</span>
          </button>
        )}

        {tab === 'subsidy' && onConfigureSubsidy && (
          <button
            onClick={onConfigureSubsidy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs transition"
            title="Configure PMKSY 55% subsidy percentages & per-acre caps"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Configure Rules</span>
          </button>
        )}

        <button
          onClick={onIssueDroughtAlert}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition active:scale-95"
          title="Issue emergency low-water and drought alert to affected tehsils"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Issue Drought Alert</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold shadow-2xs transition"
          title="Export current view to CSV"
        >
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export function WaterSchedulesTable({ schedules, onSelectSchedule }) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Droplets className="w-12 h-12 mx-auto mb-3 opacity-30 text-teal-600" />
        <p className="text-base font-bold text-slate-700">No irrigation water schedules found</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting the search criteria or resetting status filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Farmer & Gat Plot</th>
            <th className="py-3 px-4">Crop & Growth Stage</th>
            <th className="py-3 px-4">Irrigation System & Source</th>
            <th className="py-3 px-4 text-right">Volume & Saved</th>
            <th className="py-3 px-4 text-center">Moisture & ETc</th>
            <th className="py-3 px-4 text-center">Efficiency & Alert</th>
            <th className="py-3 px-4 text-center">Schedule Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {schedules.map((ws) => (
            <tr
              key={ws.id}
              onClick={() => onSelectSchedule(ws)}
              className="hover:bg-emerald-50/60 cursor-pointer transition-colors group"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{ws.farmerName}</div>
                <div className="text-[11px] text-teal-700 font-mono font-semibold mt-0.5">
                  Gat #{ws.gatNumber} · {ws.village} ({ws.district})
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {ws.farmerPhone}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{ws.crop}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{ws.cropStage}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Area: {ws.acreage} Acres · {ws.soilType}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-800 font-semibold">{ws.irrigationType}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{ws.waterSource}</div>
                <div className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">
                  {ws.pumpElectricitySlot}
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="font-bold text-slate-900">{fmtLiters(ws.waterVolumeLiters)}</div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  +{fmtLiters(ws.waterSavedLiters)} saved
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {ws.durationMinutes} mins slot
                </div>
              </td>

              <td className="py-3.5 px-4 text-center font-mono">
                <div className="text-slate-900 font-bold">
                  {ws.soilMoistureCurrentPct}% / {ws.soilMoistureTargetPct}%
                </div>
                <div className="text-[10px] text-slate-500">
                  ETc: {ws.evapotranspirationEtcMm} mm/day
                </div>
              </td>

              <td className="py-3.5 px-4 text-center space-y-1">
                <div className="text-xs font-mono font-bold text-teal-700">
                  {ws.waterEfficiencyIndex}% Score
                </div>
                <StatusBadge status={ws.overUnderAlert} type="alert" />
              </td>

              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={ws.status} type="schedule" />
                <span className="block text-[10px] text-slate-500 font-mono mt-1 font-medium">
                  {ws.scheduledStartTime}
                </span>
              </td>

              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectSchedule(ws)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="View plot irrigation telemetry"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CgwbStationsTable({ stations, onSelectStation }) {
  if (!stations || stations.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Gauge className="w-12 h-12 mx-auto mb-3 opacity-30 text-teal-600" />
        <p className="text-base font-bold text-slate-700">No CGWB groundwater stations found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Station Code & Observatory</th>
            <th className="py-3 px-4">Jurisdiction & Aquifer</th>
            <th className="py-3 px-4 text-right">Water Level (mbgl)</th>
            <th className="py-3 px-4 text-center">Pre / Post Monsoon</th>
            <th className="py-3 px-4 text-center">Recharge Trend</th>
            <th className="py-3 px-4 text-center">Aquifer Category</th>
            <th className="py-3 px-4 text-right">Telemetry Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {stations.map((st) => {
            const isCritical = st.currentWaterLevelMbgl >= st.criticalDepthThresholdMbgl

            return (
              <tr
                key={st.id}
                onClick={() => onSelectStation && onSelectStation(st)}
                className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-teal-700">{st.stationCode}</div>
                  <div className="text-slate-900 text-xs font-sans font-bold mt-0.5">{st.stationName}</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-slate-900 font-medium">
                    {st.tehsil}, {st.district} ({st.state})
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {st.aquiferType}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right font-mono">
                  <div className={`text-base font-bold ${isCritical ? 'text-rose-700' : 'text-slate-900'}`}>
                    {st.currentWaterLevelMbgl} mbgl
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Threshold: {st.criticalDepthThresholdMbgl} mbgl
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                  <span className="text-amber-700 font-bold">{st.preMonsoonMbgl}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-emerald-700 font-bold">{st.postMonsoonMbgl}</span>
                  <span className="block text-[10px] text-slate-400 font-sans">Pre / Post Mbgl</span>
                </td>

                <td className="py-3.5 px-4 text-center font-mono">
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      st.rechargeTrendPct >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {st.rechargeTrendPct >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>{st.rechargeTrendPct > 0 ? `+${st.rechargeTrendPct}` : st.rechargeTrendPct}%</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={st.category} type="cgwb" />
                </td>

                <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                  <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{st.sensorStatus} ({st.batteryPercent}%)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(st.lastReadingAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function CanalSchedulesTable({ canals, onSelectCanal, onEditCanal }) {
  if (!canals || canals.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Waves className="w-12 h-12 mx-auto mb-3 opacity-30 text-teal-600" />
        <p className="text-base font-bold text-slate-700">No canal rotation schedules found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Canal Division & Minor</th>
            <th className="py-3 px-4">Command Area & Dam Source</th>
            <th className="py-3 px-4">Rotation Release Window</th>
            <th className="py-3 px-4 text-right">Discharge & Quota</th>
            <th className="py-3 px-4">Beneficiary Tehsils & Villages</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {canals.map((c) => (
            <tr
              key={c.id}
              onClick={() => onSelectCanal && onSelectCanal(c)}
              className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{c.canalName}</div>
                <div className="text-[11px] text-teal-700 font-mono font-semibold mt-0.5">
                  Code: {c.canalCode} · {c.distributaryMinor}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {c.division} ({c.subDivision})
                </div>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <div className="font-bold text-slate-900">
                  {c.commandAreaAcres.toLocaleString('en-IN')} Acres
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Source: {c.waterSourceDam}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  {c.rotationCycle}
                </div>
              </td>

              <td className="py-3.5 px-4 font-mono text-[11px]">
                <div className="text-slate-800 font-semibold">
                  From: {new Date(c.rotationStartDate).toLocaleDateString('en-IN')}
                </div>
                <div className="text-slate-500">
                  To: {new Date(c.rotationEndDate).toLocaleDateString('en-IN')}
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="text-base font-bold text-teal-700">
                  {c.dischargeCusecs} Cusecs
                </div>
                <div className="text-[10px] text-slate-500">
                  Quota: {c.waterQuotaMldPerHa} MLD/Ha
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-800 font-medium truncate max-w-[200px]">
                  {c.beneficiaryVillages.join(', ')}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {c.notifiedFarmersCount} Farmers Alerted
                </div>
              </td>

              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={c.status} type="canal" />
              </td>

              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEditCanal && onEditCanal(c)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition-colors"
                >
                  Edit Timetable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PmksySubsidiesTable({ rules, applications, onApproveApplication, onSelectApplication }) {
  const { smallMarginalSubsidyPct = 55, otherFarmerSubsidyPct = 45, dripCeilingPerHaInr = 85000, sprinklerCeilingPerHaInr = 35000 } = rules || {}

  return (
    <div className="space-y-4">
      {/* Parameter Cards Bar */}
      <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 m-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-slate-900 block text-sm">
            PMKSY (Per Drop More Crop) Micro-Irrigation Subsidy Framework
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Govt. of India + Mahadbt State Top-Up configuration for Drip &amp; Sprinkler adoption.
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-sans font-bold">Small/Marginal Subsidy:</span>
            <span className="text-emerald-700 font-bold">{smallMarginalSubsidyPct}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-sans font-bold">Other Farmers Subsidy:</span>
            <span className="text-sky-700 font-bold">{otherFarmerSubsidyPct}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-sans font-bold">Drip Cost Ceiling:</span>
            <span className="text-slate-900 font-bold">₹{dripCeilingPerHaInr.toLocaleString('en-IN')}/Ha</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-sans font-bold">Sprinkler Ceiling:</span>
            <span className="text-slate-900 font-bold">₹{sprinklerCeilingPerHaInr.toLocaleString('en-IN')}/Ha</span>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-4">Application # & Farmer</th>
              <th className="py-3 px-4">Aadhaar (DPDP Masked)</th>
              <th className="py-3 px-4">Category & Acreage</th>
              <th className="py-3 px-4">System & Manufacturer</th>
              <th className="py-3 px-4 text-right">Quotation / Subsidy</th>
              <th className="py-3 px-4 text-center">GPS Inspection</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => onSelectApplication && onSelectApplication(app)}
                className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono">
                  <div className="font-bold text-teal-700">{app.applicationNumber}</div>
                  <div className="text-slate-900 text-xs font-sans font-bold mt-0.5">{app.farmerName}</div>
                  <div className="text-[10px] text-slate-500">{app.farmerPhone}</div>
                </td>

                <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                  {app.aadhaarMasked}
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-slate-900 font-medium">{app.category}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {app.landAreaAcres} Acres ({app.landAreaHectares} Ha)
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-slate-800 font-medium">{app.systemType}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{app.manufacturer}</div>
                </td>

                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="text-slate-400 text-[11px]">
                    Quote: ₹{app.quotationAmountInr.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm font-bold text-emerald-700">
                    ₹{app.calculatedSubsidyInr.toLocaleString('en-IN')} (55%)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Farmer Share: ₹{app.farmerShareInr.toLocaleString('en-IN')}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center font-mono text-[10px]">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-bold border ${
                      app.fieldInspectionStatus.includes('PASSED')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {app.fieldInspectionStatus}
                  </span>
                  {app.inspectorName && (
                    <span className="block text-slate-500 mt-0.5 font-sans font-normal">{app.inspectorName}</span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={app.status} />
                </td>

                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  {app.status !== 'approved' ? (
                    <button
                      onClick={() => onApproveApplication(app)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      Approve Subsidy
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-700 font-bold">Approved ✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DroughtAdvisoriesTable({ advisories }) {
  if (!advisories || advisories.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <BellRing className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-600" />
        <p className="text-base font-bold text-slate-700">No active drought advisories broadcast</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">District & Tehsils</th>
            <th className="py-3 px-4">Alert Severity</th>
            <th className="py-3 px-4">Advisory Headline & Directive</th>
            <th className="py-3 px-4 text-center">Target Water Saving</th>
            <th className="py-3 px-4 text-right">SMS Broadcast</th>
            <th className="py-3 px-4 text-right">Issued At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {advisories.map((adv) => (
            <tr key={adv.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{adv.district}</div>
                <div className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  Tehsils: {adv.tehsils.join(', ')}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {adv.affectedFarmingAcres?.toLocaleString('en-IN')} Acres Covered
                </div>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    adv.alertLevel === 'SEVERE_DROUGHT'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{adv.alertLevelText}</span>
                </span>
              </td>

              <td className="py-3.5 px-4 max-w-md">
                <div className="font-bold text-slate-900">{adv.headline}</div>
                <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {adv.message}
                </div>
              </td>

              <td className="py-3.5 px-4 text-center font-mono">
                <span className="text-base font-bold text-emerald-700">
                  {adv.waterSavingTargetPct}%
                </span>
                <span className="block text-[10px] text-slate-500 font-sans font-medium">Conservation Target</span>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="text-slate-900 font-bold">
                  {adv.smsBroadcastCount?.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">Farmers Notified</div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                <div className="text-slate-800 font-semibold">
                  {new Date(adv.issuedAt).toLocaleDateString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500">{adv.issuedBy}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AuditLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30 text-teal-600" />
        <p className="text-base font-bold text-slate-700">No water module audit entries found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Timestamp & Admin</th>
            <th className="py-3 px-4">Action Type</th>
            <th className="py-3 px-4">Entity Ref</th>
            <th className="py-3 px-4">State Transition</th>
            <th className="py-3 px-4">Audit Rationale & Justification</th>
            <th className="py-3 px-4 text-right">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-900 font-bold">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-teal-700 font-semibold mt-0.5">
                  {log.adminName || log.adminUid}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {log.actionType}
                </span>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-900 font-bold">{log.entityName}</div>
                <div className="text-[11px] text-slate-500">ID: {log.entityId}</div>
              </td>

              <td className="py-3.5 px-4 font-mono text-[11px]">
                <span className="text-amber-700 font-bold">{log.previousState}</span> &rarr;{' '}
                <span className="text-emerald-700 font-bold">{log.newState}</span>
              </td>

              <td className="py-3.5 px-4 text-slate-700 text-xs max-w-sm font-medium">
                {log.reason}
              </td>

              <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                {log.ipAddress}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-emerald-100/80 text-xs text-slate-600 bg-white/50 backdrop-blur-sm">
      <div>
        Showing <span className="font-mono font-bold text-slate-900">{start}</span> to{' '}
        <span className="font-mono font-bold text-slate-900">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-900">{total}</span> records
      </div>
      <div className="flex items-center gap-1 font-mono">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-emerald-50 transition"
        >
          &lt; Prev
        </button>
        <span className="px-2 py-1 text-slate-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-emerald-50 transition"
        >
          Next &gt;
        </button>
      </div>
    </div>
  )
}
