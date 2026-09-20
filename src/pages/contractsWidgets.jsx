import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'
import { StatusBadge, STATUS_LABELS, CONTRACT_STATUSES } from '../components/StatusBadge'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

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

export function FiltersBar({ q, setQ, status, setStatus, dateRange, setDateRange, onExport }) {
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
          placeholder="Search by contract id, farmer name or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        {CONTRACT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3 font-semibold ${['id', 'status', 'createdAt'].includes(key) ? 'cursor-pointer select-none hover:text-slate-300' : ''}`} onClick={() => ['id', 'status', 'createdAt'].includes(key) && onSort(key)}>
                {label}{arrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{c.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{c.buyerName}</p>
                <p className="text-xs text-slate-500">{c.farmerName} · {c.farmerPhone.slice(0, 3)} ••••• {c.farmerPhone.slice(-4)}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {c.crop} · {c.quantityQuintals} q
                <span className="ml-2 font-mono text-emerald-400">{fmtINR(c.ratePerQuintal)}/q</span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={c.status} />{c.flagged && <span className="ml-1.5 text-xs text-rose-400">⚑</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(c)}>View</button>
              </td>
            </tr>
          ))}
          {contracts.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No contracts match the current filters.</td></tr>
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
