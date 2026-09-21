import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export const LAND_LEASE_STATUSES = ['active', 'expiring', 'disputed', 'terminated', 'expired']

export const LAND_LISTING_STATUSES = ['available', 'pending_audit', 'leased', 'flagged', 'removed']

const STATUS_LABELS = {
  active: 'Active',
  expiring: 'Expiring Soon',
  disputed: 'Disputed',
  terminated: 'Terminated',
  expired: 'Expired',
  available: 'Available',
  pending_audit: 'Pending 7/12 Audit',
  leased: 'Leased',
  flagged: 'Flagged',
  removed: 'Removed',
}

const STATUS_STYLES = {
  active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  expiring: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  disputed: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  terminated: 'bg-slate-700/60 text-slate-400',
  expired: 'bg-slate-700/60 text-slate-400',
  available: 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30',
  pending_audit: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  leased: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
  flagged: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  removed: 'bg-slate-700/60 text-slate-400',
}

export function LandStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-700 text-slate-300'}`}>
      {STATUS_LABELS[status] || status}
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

export function FiltersBar({ q, setQ, status, setStatus, statuses, dateRange, setDateRange, onExport }) {
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
          placeholder="Search by id, landlord/tenant name, phone, district or survey no…"
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
      <button className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={onExport}>
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  )
}

export function TabSwitch({ tab, setTab }) {
  const tabs = [
    ['leases', 'Leases & Rent Compliance'],
    ['listings', 'Land Listings (7/12 Audit)'],
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

export function LeasesTable({ leases, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Landlord × Tenant'],
    ['terms', 'Plot / Rent'],
    ['compliance', 'Rent Compliance'],
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
          {leases.map((l) => (
            <tr key={l.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{l.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{l.landlordName}</p>
                <p className="text-xs text-slate-500">× {l.tenantName} · {maskPhone(l.tenantPhone)}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {l.crop} · {l.areaAcres} acres
                <span className="ml-2 font-mono text-emerald-400">{fmtINR(l.monthlyRent)}/mo</span>
                <p className="font-mono text-[11px] text-slate-500">{l.district} · S.No. {l.surveyNo}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${l.paymentsOverdue > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {l.paymentsOnTime} on-time · {l.paymentsOverdue} overdue
                </span>
                <p className="mt-0.5 font-mono text-[11px] text-slate-500">month {l.monthsElapsed}/{l.monthsTotal}</p>
              </td>
              <td className="px-4 py-3"><LandStatusBadge status={l.status} />{l.flagged && <span className="ml-1.5 text-xs text-rose-400">⚑</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{l.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(l)}>View</button>
              </td>
            </tr>
          ))}
          {leases.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No leases match the current filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function ListingsTable({ listings, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Landlord'],
    ['plot', 'Plot Details'],
    ['sevenTwelve', '7/12 Record'],
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
          {listings.map((x) => (
            <tr key={x.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{x.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{x.landlordName}</p>
                <p className="text-xs text-slate-500">{maskPhone(x.landlordPhone)}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {x.district}, {x.taluka}
                <p className="font-mono text-[11px] text-slate-500">S.No. {x.surveyNo} · {x.areaAcres} acres · {x.waterSource}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${x.sevenTwelveVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {x.sevenTwelveVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </td>
              <td className="px-4 py-3"><LandStatusBadge status={x.status} />{x.flagged && <span className="ml-1.5 text-xs text-rose-400">⚑</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{x.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(x)}>View</button>
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No listings match the current filters.</td></tr>
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
