import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'
import { StatusBadge, STATUS_LABELS, CONTRACT_STATUSES } from '../components/StatusBadge'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export function MetricCard({ label, value, tone = 'emerald', sub }) {
  const tones = {
    emerald: { text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    amber: { text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
    sky: { text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800 border-sky-200' },
    rose: { text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  }
  const t = tones[tone] || tones.emerald
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold ${t.text}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500 font-medium">{sub}</p>}
    </div>
  )
}

export function FiltersBar({ q, setQ, status, setStatus, dateRange, setDateRange, onExport }) {
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
          placeholder="Search by contract id, farmer name or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <select className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        {CONTRACT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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

export function ContractsTable({ contracts, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Entity / Buyer × Farmer'],
    ['terms', 'Key Attributes'],
    ['status', 'Status'],
    ['createdAt', 'Created At'],
    ['actions', 'Actions'],
  ]
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full min-w-4xl text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3.5 ${['id', 'status', 'createdAt'].includes(key) ? 'cursor-pointer select-none hover:text-emerald-800' : ''}`} onClick={() => ['id', 'status', 'createdAt'].includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {contracts.map((c) => (
            <tr key={c.id} className="transition-colors hover:bg-emerald-50/60">
              <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{c.id}</td>
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{c.buyerName}</p>
                <p className="text-[11px] text-slate-500 font-medium">{c.farmerName} · {c.farmerPhone.slice(0, 3)} ••••• {c.farmerPhone.slice(-4)}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-800 font-medium">
                {c.crop} · {c.quantityQuintals} q
                <span className="ml-2 font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{fmtINR(c.ratePerQuintal)}/q</span>
              </td>
              <td className="px-4 py-3.5"><StatusBadge status={c.status} />{c.flagged && <span className="ml-1.5 text-xs text-rose-600 font-bold">⚑</span>}</td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">{c.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3.5">
                <button className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs" onClick={() => onView(c)}>View</button>
              </td>
            </tr>
          ))}
          {contracts.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-semibold">No contracts match the current filters.</td></tr>
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
