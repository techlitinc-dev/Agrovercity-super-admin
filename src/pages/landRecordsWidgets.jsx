import React from 'react'
import {
  Layers,
  FileText,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
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
  Users
} from 'lucide-react'

export function fmtAcres(acres, hectares) {
  if (acres === undefined || acres === null) return '—'
  if (hectares !== undefined && hectares !== null) {
    return `${acres} Ac (${hectares} Ha)`
  }
  return `${acres} Acres`
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const colorMap = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/50',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:border-amber-500/50',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:border-rose-500/50',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:border-blue-500/50',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:border-purple-500/50',
    slate: 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 transition-all duration-200 ${colorMap[color]} ${
        onClick ? 'cursor-pointer' : ''
      } ${alert ? 'ring-1 ring-rose-500/40' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-400 truncate">{subtext}</p>}
    </div>
  )
}

export function TabSwitch({ activeTab, onChangeTab, counts = {} }) {
  const tabs = [
    { id: 'records', label: '7/12 & 8A Land Registry', icon: Layers, badge: counts.records },
    { id: 'imports', label: 'Farmer Farm Imports', icon: Users, badge: counts.imports },
    { id: 'gateways', label: 'State Revenue Gateways', icon: Server, badge: counts.gateways },
    { id: 'audit', label: 'Audit Logs & Telemetry', icon: Activity, badge: counts.audit }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              isActive
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
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

export function FiltersBar({
  tab,
  q,
  setQ,
  status,
  setStatus,
  recordType,
  setRecordType,
  district,
  setDistrict,
  encumbranceOnly,
  setEncumbranceOnly,
  onExportCsv,
  onManualProvision,
  onSeedCache,
  onOpenGatewayHealth
}) {
  return (
    <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === 'records'
                ? 'Search Gat #, Khata #, owner, village...'
                : tab === 'imports'
                ? 'Search farmer name, phone, Gat #...'
                : 'Search audit logs or gateways...'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* Status filter */}
        {tab === 'records' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified by State Gateway</option>
            <option value="cached">Cached in Redis</option>
            <option value="flagged_discrepancy">Flagged Discrepancy</option>
            <option value="manual_override">Manual Override (Downtime)</option>
          </select>
        )}

        {/* Record Type filter */}
        {tab === 'records' && (
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Record Forms</option>
            <option value="712">Village Form VII-XII (7/12)</option>
            <option value="8A">Village Form VIII-A (8A Khate)</option>
          </select>
        )}

        {/* District filter */}
        {['records', 'imports'].includes(tab) && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Districts</option>
            <option value="Nashik">Nashik</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Jalna">Jalna</option>
            <option value="Beed">Beed</option>
            <option value="Latur">Latur</option>
            <option value="Dharashiv">Dharashiv (Osmanabad)</option>
            <option value="Dewas">Dewas (MP)</option>
            <option value="Rajkot">Rajkot (Gujarat)</option>
          </select>
        )}

        {/* Bank Encumbrance Filter Toggle */}
        {tab === 'records' && (
          <button
            type="button"
            onClick={() => setEncumbranceOnly(!encumbranceOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono transition-colors ${
              encumbranceOnly
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/60'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Filter records with active bank charges/hypothecations"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Bank Charge Only (बोझा)</span>
          </button>
        )}
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'records' && onManualProvision && (
          <button
            onClick={onManualProvision}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
            title="Manually provision verified 7/12 record during state portal downtime"
          >
            <span>+ Manual Provision</span>
          </button>
        )}

        {tab === 'records' && onSeedCache && (
          <button
            onClick={onSeedCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
            title="Bulk seed village 7/12 records into Redis cache"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Seed Cache</span>
          </button>
        )}

        <button
          onClick={onOpenGatewayHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          title="Inspect Mahabhulekh and State Revenue Gateway health & latency"
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gateway Health</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          title="Export current view to CSV for government revenue audit"
        >
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    verified: { label: 'Verified (Portal)', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
    cached: { label: 'Cached (Redis)', cls: 'bg-blue-950/60 text-blue-400 border-blue-500/40' },
    flagged_discrepancy: { label: 'Flagged Discrepancy', cls: 'bg-amber-950/60 text-amber-400 border-amber-500/40' },
    manual_override: { label: 'Manual Override', cls: 'bg-purple-950/60 text-purple-400 border-purple-500/40' },
    pending_sync: { label: 'Pending Sync', cls: 'bg-slate-800 text-slate-400 border-slate-700' },
    synced: { label: 'Synced to Farm', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
    disputed: { label: 'Disputed Area', cls: 'bg-rose-950/60 text-rose-400 border-rose-500/40' }
  }

  const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
      {s.label}
    </span>
  )
}

export function LandRecordsTable({
  records,
  onSelectRecord,
  onResolveDiscrepancy,
  onRefreshPortal
}) {
  if (!records || records.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Layers className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No land records found</p>
        <p className="text-xs mt-1">Try adjusting the Gat number search or resetting filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Gat # / Form Type</th>
            <th className="py-3 px-4">Village & Jurisdiction</th>
            <th className="py-3 px-4">Owner / Khatadar (खातेदार)</th>
            <th className="py-3 px-4 text-right">Area (Acres / Ha)</th>
            <th className="py-3 px-4">Land Class & Soil</th>
            <th className="py-3 px-4">Bank Encumbrance (बोझा)</th>
            <th className="py-3 px-4">Status & Gateway</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {records.map((r) => {
            const hasBankCharge = r.hasEncumbrance

            return (
              <tr
                key={r.id}
                onClick={() => onSelectRecord(r)}
                className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
              >
                {/* Gat # & Form Type */}
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-emerald-400">{r.gatNumber}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {r.recordType === '8A' ? '8-A Khata' : '7/12 Utara'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Khata #{r.khataNumber} · Ferfar: {r.ferfarNumber}
                  </div>
                </td>

                {/* Village & Location */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-200">{r.village}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tal: {r.taluka} · Dist: {r.district}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {r.state}
                  </div>
                </td>

                {/* Owner details */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-200">{r.vernacularOwnerName || r.ownerName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {r.ownerName}
                  </div>
                  {r.coSharers && r.coSharers.length > 1 && (
                    <span className="inline-block text-[10px] font-mono text-purple-400 mt-0.5">
                      • {r.coSharers.length} Co-Sharers Registered
                    </span>
                  )}
                </td>

                {/* Area in Acres & Hectares */}
                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="font-bold text-slate-100">{r.totalAreaAcres} Acres</div>
                  <div className="text-[11px] text-slate-400">
                    {r.totalAreaHectares} Hectares
                  </div>
                  {r.potKharabaHectares > 0 && (
                    <div className="text-[10px] text-slate-500">
                      PK: {r.potKharabaHectares} Ha
                    </div>
                  )}
                </td>

                {/* Land Class & Soil */}
                <td className="py-3.5 px-4">
                  <div className="text-slate-300 font-medium">{r.landClass}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {r.soilType}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">
                    Irrigation: {r.irrigationType}
                  </div>
                </td>

                {/* Bank Encumbrance (बोझा) */}
                <td className="py-3.5 px-4">
                  {hasBankCharge ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/70 text-amber-300 border border-amber-500/50">
                        <Lock className="w-3 h-3" />
                        <span>Hypothecated</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-[170px] mt-0.5" title={r.encumbrances}>
                        {r.encumbrances}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-500/50">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Clean / Nil Title</span>
                    </span>
                  )}
                </td>

                {/* Status & Portal */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <StatusBadge status={r.status} />
                    <div className="text-[10px] text-slate-400 font-mono">
                      {r.sourcePortal}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(r.lastFetchedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === 'flagged_discrepancy' && (
                      <button
                        onClick={() => onResolveDiscrepancy(r)}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-medium shadow-sm transition-colors"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => onRefreshPortal(r)}
                      className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Re-query Mahabhulekh Portal"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={r.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="View Official Digital Extract PDF"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onSelectRecord(r)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Open full land title dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
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

export function UserImportsTable({ imports, onSelectImport }) {
  if (!imports || imports.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No imported farmer farm parcels</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Farmer / User Details</th>
            <th className="py-3 px-4">Aadhaar (DPDP Masked)</th>
            <th className="py-3 px-4">Gat # & Village</th>
            <th className="py-3 px-4 text-right">Imported Area</th>
            <th className="py-3 px-4">Sync Target Profile</th>
            <th className="py-3 px-4 text-center">Sync Status</th>
            <th className="py-3 px-4 text-right">Imported At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {imports.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelectImport && onSelectImport(item)}
              className="hover:bg-slate-900/50 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-200">{item.farmerName}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.farmerPhone}</div>
                <div className="text-[10px] text-slate-500 font-mono">UID: {item.userId}</div>
              </td>
              <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                {item.aadhaarMasked}
              </td>
              <td className="py-3.5 px-4">
                <div className="font-mono font-bold text-slate-200">{item.gatNumber}</div>
                <div className="text-[11px] text-slate-400">{item.village}, {item.district}</div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                {item.totalAreaAcres} Acres
                <span className="block text-[10px] text-slate-500 font-normal">
                  {item.landClass}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                  {item.syncTargetProfile}
                </span>
              </td>
              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={item.importStatus} />
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                {new Date(item.importedAt).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GatewayStatusCards({ gatewayStatus }) {
  const { portals = [], cacheMetrics = {} } = gatewayStatus || {}

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>State Land Revenue Portal Gateway Cluster (SOP-16 §3)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Direct electronic bridge with official state land records registries (Mahabhulekh, AnyRoR, MP Bhulekh, Aaple Sarkar).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portals.map((p) => {
          const isHealthy = p.status === 'operational'
          return (
            <div
              key={p.id}
              className={`rounded-xl border p-4 bg-slate-900/60 transition-all ${
                isHealthy ? 'border-slate-800 hover:border-emerald-500/40' : 'border-amber-500/40 bg-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{p.state}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                    isHealthy
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-amber-950 text-amber-400 border-amber-500/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span>{isHealthy ? 'ONLINE' : 'DEGRADED'}</span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">API Latency:</span>
                  <span className="text-emerald-400 font-bold">{p.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Portal Uptime:</span>
                  <span className="text-slate-200 font-bold">{p.uptime}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Today Queries:</span>
                  <span className="text-slate-300">{p.activeExtractsToday}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Error Rate:</span>
                  <span className="text-slate-400">{p.errorRatePercent}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                Auth: <span className="text-slate-400 font-mono">{p.authMechanism}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cache metrics card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 text-xs flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Redis L2 Distributed Land Records Cache Engine</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            {cacheMetrics.redisClusterStatus || 'Cluster Healthy'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Cached Land Records:</span>
            <span className="text-lg font-bold text-slate-200">{cacheMetrics.totalCachedRecords?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30">
            <span className="text-emerald-400 block text-[10px]">Cache Hit Ratio:</span>
            <span className="text-lg font-bold text-emerald-400">{cacheMetrics.cacheHitRatio}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Avg In-Memory Lookup:</span>
            <span className="text-lg font-bold text-blue-400">{cacheMetrics.avgCacheRetrievalMs} ms</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Memory Utilized:</span>
            <span className="text-lg font-bold text-slate-300">{cacheMetrics.redisMemoryUsedMb} MB</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Daily Queries Served:</span>
            <span className="text-lg font-bold text-purple-300">{cacheMetrics.totalQueriesToday}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuditLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No land records audit entries</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Timestamp & Admin</th>
            <th className="py-3 px-4">Action Type</th>
            <th className="py-3 px-4">Gat # & Village</th>
            <th className="py-3 px-4">Transition</th>
            <th className="py-3 px-4">Audit Rationale / Notes</th>
            <th className="py-3 px-4 text-right">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-200 font-medium">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400 mt-0.5">
                  {log.adminName || log.adminUid}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {log.actionType}
                </span>
              </td>
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-200 font-bold">{log.gatNumber}</div>
                <div className="text-[11px] text-slate-400">{log.village}</div>
              </td>
              <td className="py-3.5 px-4 font-mono text-[11px]">
                <span className="text-amber-400">{log.previousState}</span> &rarr;{' '}
                <span className="text-emerald-400">{log.newState}</span>
              </td>
              <td className="py-3.5 px-4 text-slate-300 text-xs max-w-sm">
                {log.reason}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
      <div>
        Showing <span className="font-mono text-slate-200">{start}</span> to{' '}
        <span className="font-mono text-slate-200">{end}</span> of{' '}
        <span className="font-mono text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-1 font-mono">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
        >
          &lt; Prev
        </button>
        <span className="px-2 py-1 text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
        >
          Next &gt;
        </button>
      </div>
    </div>
  )
}
