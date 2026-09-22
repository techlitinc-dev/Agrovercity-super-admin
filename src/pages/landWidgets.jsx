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
  active: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
  expiring: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  disputed: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold',
  terminated: 'bg-slate-100 text-slate-700 border border-slate-300',
  expired: 'bg-slate-100 text-slate-700 border border-slate-300',
  available: 'bg-teal-100 text-teal-900 border border-teal-300 font-bold',
  pending_audit: 'bg-sky-100 text-sky-900 border border-sky-300 font-bold',
  leased: 'bg-purple-100 text-purple-900 border border-purple-300 font-bold',
  flagged: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
  removed: 'bg-slate-100 text-slate-700 border border-slate-300',
}

export function LandStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function MetricCard({ label, value, tone = 'emerald', sub }) {
  const tones = {
    emerald: 'text-emerald-900',
    teal: 'text-teal-900',
    amber: 'text-amber-900',
    sky: 'text-sky-900',
    rose: 'text-rose-900',
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold ${tones[tone] || 'text-slate-900'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500 font-medium">{sub}</p>}
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
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-3.5 flex flex-wrap items-center gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="relative flex-1 min-w-56">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-emerald-200/80 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans"
          placeholder="Search by id, landlord/tenant name, phone, district or survey no…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <select className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <select className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
        {ranges.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
      </select>
      <button className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95 ml-auto" onClick={onExport}>
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
    <div className="inline-flex rounded-xl border border-emerald-200/80 bg-white/90 p-1 shadow-2xs backdrop-blur-md">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${tab === id ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-950'}`}
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
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full min-w-4xl text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3.5 ${sortable.includes(key) ? 'cursor-pointer select-none hover:text-emerald-800' : ''}`} onClick={() => sortable.includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {leases.map((l) => (
            <tr key={l.id} className="transition-colors hover:bg-emerald-50/60">
              <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{l.id}</td>
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{l.landlordName}</p>
                <p className="text-[11px] text-slate-500 font-medium">× {l.tenantName} · {maskPhone(l.tenantPhone)}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-800 font-medium">
                {l.crop} · {l.areaAcres} acres
                <span className="ml-2 font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{fmtINR(l.monthlyRent)}/mo</span>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">{l.district} · S.No. {l.surveyNo}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold border ${l.paymentsOverdue > 0 ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                  {l.paymentsOnTime} on-time · {l.paymentsOverdue} overdue
                </span>
                <p className="mt-1 font-mono text-[11px] text-slate-500">month {l.monthsElapsed}/{l.monthsTotal}</p>
              </td>
              <td className="px-4 py-3.5"><LandStatusBadge status={l.status} />{l.flagged && <span className="ml-1.5 text-xs text-rose-600 font-bold">⚑</span>}</td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">{l.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3.5">
                <button className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs" onClick={() => onView(l)}>View</button>
              </td>
            </tr>
          ))}
          {leases.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-semibold">No leases match the current filters.</td></tr>
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
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full min-w-4xl text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3.5 ${sortable.includes(key) ? 'cursor-pointer select-none hover:text-emerald-800' : ''}`} onClick={() => sortable.includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {listings.map((x) => (
            <tr key={x.id} className="transition-colors hover:bg-emerald-50/60">
              <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{x.id}</td>
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{x.landlordName}</p>
                <p className="text-[11px] text-slate-500 font-medium">{maskPhone(x.landlordPhone)}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-800 font-medium">
                {x.district}, {x.taluka}
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">S.No. {x.surveyNo} · {x.areaAcres} acres · {x.waterSource}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold border ${x.sevenTwelveVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                  {x.sevenTwelveVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </td>
              <td className="px-4 py-3.5"><LandStatusBadge status={x.status} />{x.flagged && <span className="ml-1.5 text-xs text-rose-600 font-bold">⚑</span>}</td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">{x.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3.5">
                <button className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs" onClick={() => onView(x)}>View</button>
              </td>
            </tr>
          ))}
          {listings.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-semibold">No listings match the current filters.</td></tr>
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
    <div className="flex items-center justify-between text-xs text-slate-600 px-2">
      <span className="font-medium">Showing {first} – {last} of {total.toLocaleString('en-IN')} records</span>
      <div className="flex items-center gap-1.5">
        <button className="rounded-xl border border-emerald-200/80 bg-white p-1.5 disabled:opacity-30 hover:bg-emerald-50 text-slate-700 shadow-2xs font-semibold transition-colors" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-2 font-mono text-xs font-bold text-slate-800">{page} / {pages}</span>
        <button className="rounded-xl border border-emerald-200/80 bg-white p-1.5 disabled:opacity-30 hover:bg-emerald-50 text-slate-700 shadow-2xs font-semibold transition-colors" disabled={page >= pages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  )
}
