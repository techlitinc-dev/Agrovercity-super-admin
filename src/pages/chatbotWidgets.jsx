import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'

export const SESSION_STATUSES = ['active', 'ended', 'escalated', 'flagged']
export const TICKET_STATUSES = ['open', 'assigned', 'resolved', 'escalated']

const STATUS_LABELS = {
  active: 'Active',
  ended: 'Ended',
  escalated: 'Escalated',
  flagged: 'Flagged',
  open: 'Open',
  assigned: 'Assigned',
  resolved: 'Resolved',
}

const STATUS_STYLES = {
  active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  ended: 'bg-slate-700/60 text-slate-400',
  escalated: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  flagged: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  open: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  assigned: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
}

const PRIORITY_STYLES = {
  critical: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  high: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  low: 'bg-slate-700/60 text-slate-300',
}

export function ChatbotStatusBadge({ status }) {
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
          placeholder="Search by id, farmer name, phone, topic or expert…"
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
    ['transcripts', 'Chat Transcripts'],
    ['handoffs', 'Expert Handoff Queue'],
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

const LANG_LABELS = { mr: 'Marathi', hi: 'Hindi', en: 'English' }

function SatisfactionStars({ score }) {
  if (score == null) return <span className="text-slate-600">—</span>
  return (
    <span className="font-mono text-xs text-amber-400" title={`Satisfaction ${score}/5`}>
      {'★'.repeat(score)}{'☆'.repeat(5 - score)}
    </span>
  )
}

function SlaBadge({ slaDeadline, status }) {
  if (!slaDeadline || ['resolved'].includes(status)) return <span className="font-mono text-xs text-slate-600">—</span>
  const diffH = Math.round((new Date(slaDeadline) - Date.now()) / 3600000)
  const breached = diffH <= 0
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${breached ? 'bg-rose-500/10 text-rose-400' : diffH <= 24 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
      {breached ? `SLA BREACHED ${-diffH}h ago` : `${diffH}h left`}
    </span>
  )
}

export function TranscriptsTable({ sessions, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Farmer'],
    ['topic', 'Topic / Engine'],
    ['messages', 'Msgs'],
    ['satisfaction', 'Satisfaction'],
    ['status', 'Status'],
    ['createdAt', 'Created At'],
    ['actions', 'Actions'],
  ]
  const sortable = ['id', 'status', 'createdAt', 'satisfactionScore']
  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')
  const keyMap = { satisfaction: 'satisfactionScore' }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-4xl text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3 font-semibold ${sortable.includes(keyMap[key] || key) ? 'cursor-pointer select-none hover:text-slate-300' : ''}`} onClick={() => sortable.includes(keyMap[key] || key) && onSort(keyMap[key] || key)}>
                {label}{arrow(keyMap[key] || key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{s.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{s.farmerName}</p>
                <p className="text-xs text-slate-500">{maskPhone(s.farmerPhone)} · {LANG_LABELS[s.language] || s.language}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {s.topic}
                <p className="font-mono text-[10px] text-slate-500">{s.engine}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-300">{s.messageCount}</td>
              <td className="px-4 py-3"><SatisfactionStars score={s.satisfactionScore} /></td>
              <td className="px-4 py-3"><ChatbotStatusBadge status={s.status} />{s.flagged && <span className="ml-1.5 text-xs text-rose-400">⚑</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">{s.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(s)}>Inspect</button>
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No chat sessions match the current filters.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function HandoffsTable({ tickets, sort, onSort, onView }) {
  const columns = [
    ['id', 'ID'],
    ['entity', 'Farmer'],
    ['topic', 'Topic / Channel'],
    ['priority', 'Priority'],
    ['sla', 'SLA'],
    ['assigned', 'Assigned Expert'],
    ['status', 'Status'],
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
          {tickets.map((t) => (
            <tr key={t.id} className="border-b border-slate-800/60 transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3 font-mono font-semibold text-emerald-400">#{t.id}</td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-200">{t.farmerName}</p>
                <p className="text-xs text-slate-500">{maskPhone(t.farmerPhone)} · {LANG_LABELS[t.language] || t.language}</p>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {t.topic}
                <p className="font-mono text-[10px] text-slate-500">{t.channel}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[t.priority] || 'bg-slate-700 text-slate-300'}`}>
                  {t.priority}
                </span>
              </td>
              <td className="px-4 py-3"><SlaBadge slaDeadline={t.slaDeadline} status={t.status} /></td>
              <td className="px-4 py-3 text-xs text-slate-300">{t.assignedExpertName || <span className="text-amber-400">Unassigned</span>}</td>
              <td className="px-4 py-3"><ChatbotStatusBadge status={t.status} /></td>
              <td className="px-4 py-3">
                <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400" onClick={() => onView(t)}>View</button>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No handoff tickets match the current filters.</td></tr>
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
