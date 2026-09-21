import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export const SCAN_STATUSES = ['pending_review', 'confirmed', 'false_positive']
export const ALERT_STATUSES = ['active', 'scheduled', 'expired', 'cancelled']
export const SOIL_STATUSES = ['sample_collected', 'lab_processing', 'result_uploaded', 'failed']

const STATUS_LABELS = {
  pending_review: 'Pending Review',
  confirmed: 'Confirmed',
  false_positive: 'False Positive',
  active: 'Active',
  scheduled: 'Scheduled',
  expired: 'Expired',
  cancelled: 'Cancelled',
  sample_collected: 'Sample Collected',
  lab_processing: 'Lab Processing',
  result_uploaded: 'Result Uploaded',
  failed: 'Failed',
}

const STATUS_STYLES = {
  pending_review: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  false_positive: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  scheduled: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  expired: 'bg-slate-700/60 text-slate-400',
  cancelled: 'bg-slate-700/60 text-slate-400',
  sample_collected: 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30',
  lab_processing: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
  result_uploaded: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  failed: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
}

const SEVERITY_STYLES = {
  critical: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  high: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  moderate: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  low: 'bg-slate-700/60 text-slate-300',
}

export function AdvisoryStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-700 text-slate-300'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${SEVERITY_STYLES[severity] || 'bg-slate-700 text-slate-300'}`}>
      {severity}
    </span>
  )
}

export function MetricCard({ label, value, tone = 'emerald', sub }) {
  const tones = {
    emerald: 'text-emerald-400 ring-emerald-500/20',
    amber: 'text-amber-400 ring-amber-500/20',
    sky: 'text-sky-400 ring-sky-500/20',
    rose: 'text-rose-400 ring-rose-500/20',
  }
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ring-1 ${tones[tone].split(' ')[1]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold font-mono ${tones[tone].split(' ')[0]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

export function FiltersBar({ q, setQ, status, setStatus, statuses, dateRange, setDateRange, onExport, children }) {
  const ranges = [
    ['all', 'All Time'],
    ['7', 'Last 7 Days'],
    ['30', 'Last 30 Days'],
    ['90', 'Last 90 Days'],
  ]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-56">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500"
          placeholder="Search by id, farmer name, phone, crop or district…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
        {ranges.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
      {children}
      <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={onExport}>
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  )
}

export function TabSwitch({ tab, setTab }) {
  const tabs = [
    ['scans', 'Disease Scans'],
    ['alerts', 'Pest Radar Alerts'],
    ['soil', 'Soil Tests'],
  ]
  return (
    <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${tab === id ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setTab(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

const maskPhone = (p) => `${String(p || '').slice(0, 3)} ••••• ${String(p || '').slice(-4)}`

function confidenceClass(c) {
  return c >= 0.85 ? 'bg-emerald-500/10 text-emerald-400' : c >= 0.7 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
}

export function ScansTable({ scans, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Farmer'],
    ['diagnosis', 'Diagnosis'],
    ['confidence', 'Model Confidence'],
    ['status', 'Status'],
    ['createdAt', 'Created At'],
    ['actions', 'Actions'],
  ]
  const sortable = ['id', 'status', 'createdAt', 'confidence']
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3 font-semibold ${sortable.includes(key) ? 'cursor-pointer select-none hover:text-slate-300' : ''}`} onClick={() => sortable.includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scans.map((s) => (
            <tr key={s.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{s.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{s.farmerName}</p>
                <p className="text-xs text-slate-500">{maskPhone(s.farmerPhone)} · {s.district}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {s.diagnosis}
                <p className="text-[11px] text-slate-500">{s.crop} · <SeverityBadge severity={s.severity} /></p>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${confidenceClass(s.confidence)}`}>
                  {(s.confidence * 100).toFixed(0)}%
                </span>
                <p className="mt-0.5 font-mono text-[10px] text-slate-500">{s.modelVersion}</p>
              </td>
              <td className="px-4 py-3"><AdvisoryStatusBadge status={s.status} /></td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{s.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(s)}>View</button>
              </td>
            </tr>
          ))}
          {scans.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No scans match the current filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function AlertsTable({ alerts, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Pest / District'],
    ['geofence', 'Geofence & Crop'],
    ['reach', 'Notified'],
    ['status', 'Status'],
    ['createdAt', 'Created At'],
    ['actions', 'Actions'],
  ]
  const sortable = ['id', 'status', 'createdAt']
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3 font-semibold ${sortable.includes(key) ? 'cursor-pointer select-none hover:text-slate-300' : ''}`} onClick={() => sortable.includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{a.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{a.pestName}</p>
                <p className="text-xs text-slate-500">{a.district} · <SeverityBadge severity={a.severity} /></p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                <span className="font-mono text-xs">⌀ {a.radiusKm} km</span>
                <p className="text-[11px] text-slate-500">{a.crop}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-300">{a.recipientsNotified.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3"><AdvisoryStatusBadge status={a.status} /></td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{a.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(a)}>View</button>
              </td>
            </tr>
          ))}
          {alerts.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No alerts match the current filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function SoilTestsTable({ tests, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Farmer'],
    ['sample', 'Sample'],
    ['npk', 'N-P-K / pH'],
    ['status', 'Status'],
    ['createdAt', 'Created At'],
    ['actions', 'Actions'],
  ]
  const sortable = ['id', 'status', 'createdAt']
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3 font-semibold ${sortable.includes(key) ? 'cursor-pointer select-none hover:text-slate-300' : ''}`} onClick={() => sortable.includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{t.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{t.farmerName}</p>
                <p className="text-xs text-slate-500">{maskPhone(t.farmerPhone)} · {t.district}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-mono text-xs text-slate-300">{t.sampleCode}</p>
                <p className="text-[11px] text-slate-500">{t.labName}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-300">
                {t.nitrogen != null ? `${t.nitrogen} · ${t.phosphorus} · ${t.potassium} kg/ha · pH ${t.ph}` : '—'}
              </td>
              <td className="px-4 py-3"><AdvisoryStatusBadge status={t.status} /></td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{t.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(t)}>View</button>
              </td>
            </tr>
          ))}
          {tests.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No soil tests match the current filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(total, page * pageSize)
  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <span>Showing {first} – {last} of {total.toLocaleString('en-IN')} records</span>
      <div className="flex items-center gap-1">
        <button className="rounded-lg border border-slate-700 p-1.5 disabled:opacity-30 hover:border-emerald-500 hover:text-emerald-400" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-2 font-mono text-xs">{page} / {pages}</span>
        <button className="rounded-lg border border-slate-700 p-1.5 disabled:opacity-30 hover:border-emerald-500 hover:text-emerald-400" disabled={page >= pages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  )
}
