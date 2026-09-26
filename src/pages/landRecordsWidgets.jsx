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
import {
  AgroStatusDropdown,
  AgroDistrictDropdown,
  AgroDateDropdown,
  AgroFilterDropdown
} from '../components/ui/AgroFilterDropdown'

export function fmtAcres(acres, hectares) {
  if (acres === undefined || acres === null) return '—'
  if (hectares !== undefined && hectares !== null) {
    return `${acres} Ac (${hectares} Ha)`
  }
  return `${acres} Acres`
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const toneMap = {
    emerald: 'text-emerald-700 bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'text-amber-700 bg-amber-50 text-amber-600 border-amber-100',
    rose: 'text-rose-700 bg-rose-50 text-rose-600 border-rose-100',
    blue: 'text-sky-700 bg-sky-50 text-sky-600 border-sky-100',
    purple: 'text-purple-700 bg-purple-50 text-purple-600 border-purple-100',
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
    { id: 'records', label: '7/12 & 8A Land Registry', icon: Layers, badge: counts.records },
    { id: 'imports', label: 'Farmer Farm Imports', icon: Users, badge: counts.imports },
    { id: 'gateways', label: 'State Revenue Gateways', icon: Server, badge: counts.gateways },
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
    <div className="p-4 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
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

        {/* Status filter */}
        {tab === 'records' && (
          <AgroStatusDropdown
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All Verification Statuses', dotColor: 'bg-slate-400' },
              { value: 'verified', label: 'Verified by State Gateway', dotColor: 'bg-emerald-500', badge: 'State Confirmed' },
              { value: 'cached', label: 'Cached in Redis L2', dotColor: 'bg-sky-500', badge: 'L2 Cache' },
              { value: 'flagged_discrepancy', label: 'Flagged Discrepancy', dotColor: 'bg-rose-500', badge: 'Alert' },
              { value: 'manual_override', label: 'Manual Override (Downtime)', dotColor: 'bg-amber-500', badge: 'Override' }
            ]}
          />
        )}

        {/* Record Type filter */}
        {tab === 'records' && (
          <AgroFilterDropdown
            label="Form Type"
            value={recordType}
            onChange={setRecordType}
            options={[
              { value: 'all', label: 'All Record Forms', subtext: '7/12 Utara & 8A Khate' },
              { value: '712', label: 'Village Form VII-XII (7/12)', badge: 'Satbara', subtext: 'Ownership & crop rights' },
              { value: '8A', label: 'Village Form VIII-A (8A Khate)', badge: 'Khate', subtext: 'Holding ledger & taxes' }
            ]}
            icon={Layers}
          />
        )}

        {/* District filter */}
        {['records', 'imports'].includes(tab) && (
          <AgroDistrictDropdown
            value={district}
            onChange={setDistrict}
            districts={[
              { value: 'all', label: 'All Districts (Pan-India)', subtext: 'Multi-state land registry' },
              { value: 'Nashik', label: 'Nashik', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Chhatrapati Sambhajinagar', label: 'Chhatrapati Sambhajinagar', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Jalna', label: 'Jalna', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Beed', label: 'Beed', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Latur', label: 'Latur', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Dharashiv', label: 'Dharashiv (Osmanabad)', subtext: 'Maharashtra', badge: 'MH' },
              { value: 'Dewas', label: 'Dewas', subtext: 'Madhya Pradesh (MP Bhulekh)', badge: 'MP' },
              { value: 'Rajkot', label: 'Rajkot', subtext: 'Gujarat (AnyRoR)', badge: 'GJ' }
            ]}
          />
        )}

        {/* Bank Encumbrance Filter Toggle */}
        {tab === 'records' && (
          <button
            type="button"
            onClick={() => setEncumbranceOnly(!encumbranceOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              encumbranceOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                : 'bg-emerald-50/20 text-slate-700 border-slate-200 hover:bg-emerald-50/50'
            }`}
            title="Filter records with active bank charges/hypothecations"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Bank Charge Only (बोझा)</span>
          </button>
        )}
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'records' && onManualProvision && (
          <button
            onClick={onManualProvision}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition active:scale-95"
            title="Manually provision verified 7/12 record during state portal downtime"
          >
            <span>+ Manual Provision</span>
          </button>
        )}

        {tab === 'records' && onSeedCache && (
          <button
            onClick={onSeedCache}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs transition"
            title="Bulk seed village 7/12 records into Redis cache"
          >
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span>Seed Cache</span>
          </button>
        )}

        <button
          onClick={onOpenGatewayHealth}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs transition"
          title="Inspect Mahabhulekh and State Revenue Gateway health & latency"
        >
          <Server className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gateway Health</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold shadow-2xs transition"
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
    verified: { label: 'Verified (Portal)', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    cached: { label: 'Cached (Redis)', cls: 'bg-sky-50 text-sky-800 border-sky-300' },
    flagged_discrepancy: { label: 'Flagged Discrepancy', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
    manual_override: { label: 'Manual Override', cls: 'bg-purple-50 text-purple-800 border-purple-300' },
    pending_sync: { label: 'Pending Sync', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    synced: { label: 'Synced to Farm', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    disputed: { label: 'Disputed Area', cls: 'bg-rose-50 text-rose-800 border-rose-300' }
  }

  const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
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
        <Layers className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No land records found</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting the Gat number search or resetting filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
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
        <tbody className="divide-y divide-slate-100/80">
          {records.map((r) => {
            const hasBankCharge = r.hasEncumbrance

            return (
              <tr
                key={r.id}
                onClick={() => onSelectRecord(r)}
                className="hover:bg-emerald-50/60 cursor-pointer transition-colors group"
              >
                {/* Gat # & Form Type */}
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-emerald-700">{r.gatNumber}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                      {r.recordType === '8A' ? '8-A Khata' : '7/12 Utara'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Khata #{r.khataNumber} · Ferfar: {r.ferfarNumber}
                  </div>
                </td>

                {/* Village & Location */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{r.village}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tal: {r.taluka} · Dist: {r.district}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {r.state}
                  </div>
                </td>

                {/* Owner details */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{r.vernacularOwnerName || r.ownerName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {r.ownerName}
                  </div>
                  {r.coSharers && r.coSharers.length > 1 && (
                    <span className="inline-block text-[10px] font-mono text-purple-700 font-semibold mt-0.5">
                      • {r.coSharers.length} Co-Sharers Registered
                    </span>
                  )}
                </td>

                {/* Area in Acres & Hectares */}
                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="font-bold text-slate-900">{r.totalAreaAcres} Acres</div>
                  <div className="text-[11px] text-slate-500">
                    {r.totalAreaHectares} Hectares
                  </div>
                  {r.potKharabaHectares > 0 && (
                    <div className="text-[10px] text-slate-400">
                      PK: {r.potKharabaHectares} Ha
                    </div>
                  )}
                </td>

                {/* Land Class & Soil */}
                <td className="py-3.5 px-4">
                  <div className="text-slate-800 font-semibold">{r.landClass}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {r.soilType}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                    Irrigation: {r.irrigationType}
                  </div>
                </td>

                {/* Bank Encumbrance (बोझा) */}
                <td className="py-3.5 px-4">
                  {hasBankCharge ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Hypothecated</span>
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[170px] mt-0.5" title={r.encumbrances}>
                        {r.encumbrances}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Clean / Nil Title</span>
                    </span>
                  )}
                </td>

                {/* Status & Portal */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <StatusBadge status={r.status} />
                    <div className="text-[10px] text-slate-600 font-mono font-medium">
                      {r.sourcePortal}
                    </div>
                    <div className="text-[10px] text-slate-400">
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
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-2xs transition-colors"
                      >
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => onRefreshPortal(r)}
                      className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Re-query Mahabhulekh Portal"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={r.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                      title="View Official Digital Extract PDF"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onSelectRecord(r)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No imported farmer farm parcels</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Farmer / User Details</th>
            <th className="py-3 px-4">Aadhaar (DPDP Masked)</th>
            <th className="py-3 px-4">Gat # & Village</th>
            <th className="py-3 px-4 text-right">Imported Area</th>
            <th className="py-3 px-4">Sync Target Profile</th>
            <th className="py-3 px-4 text-center">Sync Status</th>
            <th className="py-3 px-4 text-right">Imported At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {imports.map((item) => (
            <tr
              key={item.id}
              onClick={() => onSelectImport && onSelectImport(item)}
              className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{item.farmerName}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.farmerPhone}</div>
                <div className="text-[10px] text-slate-400 font-mono">UID: {item.userId}</div>
              </td>
              <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                {item.aadhaarMasked}
              </td>
              <td className="py-3.5 px-4">
                <div className="font-mono font-bold text-slate-900">{item.gatNumber}</div>
                <div className="text-[11px] text-slate-500">{item.village}, {item.district}</div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                {item.totalAreaAcres} Acres
                <span className="block text-[10px] text-slate-500 font-normal">
                  {item.landClass}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                  {item.syncTargetProfile}
                </span>
              </td>
              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={item.importStatus} />
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
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
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>State Land Revenue Portal Gateway Cluster (SOP-16 §3)</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Direct electronic bridge with official state land records registries (Mahabhulekh, AnyRoR, MP Bhulekh, Aaple Sarkar).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portals.map((p) => {
          const isHealthy = p.status === 'operational'
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-4 bg-white/90 backdrop-blur-xl transition-all shadow-[0_8px_30px_rgb(0,0,0,0.03)] ${
                isHealthy ? 'border-emerald-100 hover:border-emerald-300' : 'border-amber-300 bg-amber-50/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">{p.state}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    isHealthy
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>{isHealthy ? 'ONLINE' : 'DEGRADED'}</span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">API Latency:</span>
                  <span className="text-emerald-700 font-bold">{p.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Portal Uptime:</span>
                  <span className="text-slate-900 font-bold">{p.uptime}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Today Queries:</span>
                  <span className="text-slate-700 font-semibold">{p.activeExtractsToday}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Error Rate:</span>
                  <span className="text-slate-600 font-semibold">{p.errorRatePercent}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                Auth: <span className="text-slate-700 font-mono font-bold">{p.authMechanism}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cache metrics card */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-5 space-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-600" />
            <span>Redis L2 Distributed Land Records Cache Engine</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-700 font-bold">
            {cacheMetrics.redisClusterStatus || 'Cluster Healthy'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold font-sans">Cached Land Records:</span>
            <span className="text-lg font-black text-slate-900">{cacheMetrics.totalCachedRecords?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 block text-[10px] font-bold font-sans">Cache Hit Ratio:</span>
            <span className="text-lg font-black text-emerald-800">{cacheMetrics.cacheHitRatio}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold font-sans">Avg In-Memory Lookup:</span>
            <span className="text-lg font-black text-sky-700">{cacheMetrics.avgCacheRetrievalMs} ms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold font-sans">Memory Utilized:</span>
            <span className="text-lg font-black text-slate-800">{cacheMetrics.redisMemoryUsedMb} MB</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold font-sans">Daily Queries Served:</span>
            <span className="text-lg font-black text-purple-800">{cacheMetrics.totalQueriesToday}</span>
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
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No land records audit entries</p>
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
            <th className="py-3 px-4">Gat # & Village</th>
            <th className="py-3 px-4">Transition</th>
            <th className="py-3 px-4">Audit Rationale / Notes</th>
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
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  {log.adminName || log.adminUid}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {log.actionType}
                </span>
              </td>
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-900 font-bold">{log.gatNumber}</div>
                <div className="text-[11px] text-slate-500">{log.village}</div>
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
