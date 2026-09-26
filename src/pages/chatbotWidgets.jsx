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
  active: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
  ended: 'bg-slate-100 text-slate-700 border border-slate-300',
  escalated: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold',
  flagged: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
  open: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  assigned: 'bg-sky-100 text-sky-900 border border-sky-300 font-bold',
  resolved: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
}

const PRIORITY_STYLES = {
  critical: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
  high: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold',
  medium: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  low: 'bg-slate-100 text-slate-700 border border-slate-300 font-medium',
}

export function ChatbotStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function MetricCard({ label, value, tone = 'emerald', sub }) {
  const tones = {
    emerald: 'text-emerald-900',
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

export function FiltersBar({ q, setQ, status, setStatus, statuses, dateRange, setDateRange, onExport, children }) {
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
          placeholder="Search by id, farmer name, phone, topic or expert…"
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
      {children}
      <button className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95 ml-auto" onClick={onExport}>
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  )
}

export function TabSwitch({ tab, setTab }) {
  const tabs = [
    ['transcripts', 'Chat Transcripts'],
    ['handoffs', 'Expert Handoff Queue'],
    ['experts', 'Agronomist Roster'],
    ['analytics', 'Topic & CSAT Insights'],
    ['audit_trail', 'Audit Trail'],
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

const LANG_LABELS = { mr: 'Marathi', hi: 'Hindi', en: 'English' }

function SatisfactionStars({ score }) {
  if (score == null) return <span className="text-slate-400">—</span>
  return (
    <span className="font-mono text-xs text-amber-500" title={`Satisfaction ${score}/5`}>
      {'★'.repeat(score)}{'☆'.repeat(5 - score)}
    </span>
  )
}

function SlaBadge({ slaDeadline, status }) {
  if (!slaDeadline || ['resolved'].includes(status)) return <span className="font-mono text-xs text-slate-400">—</span>
  const diffH = Math.round((new Date(slaDeadline) - Date.now()) / 3600000)
  const breached = diffH <= 0
  return (
    <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold border ${breached ? 'bg-rose-50 text-rose-800 border-rose-200' : diffH <= 24 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
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
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full min-w-4xl text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            {columns.map(([key, label]) => (
              <th key={key} className={`px-4 py-3.5 ${sortable.includes(keyMap[key] || key) ? 'cursor-pointer select-none hover:text-emerald-800' : ''}`} onClick={() => sortable.includes(keyMap[key] || key) && onSort(keyMap[key] || key)}>
                {label}{arrow(keyMap[key] || key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {sessions.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-emerald-50/60">
              <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{s.id}</td>
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{s.farmerName}</p>
                <p className="text-[11px] text-slate-500 font-medium">{maskPhone(s.farmerPhone)} · {LANG_LABELS[s.language] || s.language}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-800 font-medium">
                <span className="font-semibold text-slate-900">{s.topic}</span>
                <p className="font-mono text-[10px] text-slate-500">{s.engine}</p>
              </td>
              <td className="px-4 py-3.5 font-mono text-xs text-slate-800 font-bold">{s.messageCount}</td>
              <td className="px-4 py-3.5"><SatisfactionStars score={s.satisfactionScore} /></td>
              <td className="px-4 py-3.5"><ChatbotStatusBadge status={s.status} />{s.flagged && <span className="ml-1.5 text-xs text-rose-600 font-bold">⚑</span>}</td>
              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">{s.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-3.5">
                <button className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs" onClick={() => onView(s)}>Inspect</button>
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-semibold">No chat sessions match the current filters.</td></tr>
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
          {tickets.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-emerald-50/60">
              <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{t.id}</td>
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{t.farmerName}</p>
                <p className="text-[11px] text-slate-500 font-medium">{maskPhone(t.farmerPhone)} · {LANG_LABELS[t.language] || t.language}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-800 font-medium">
                <span className="font-semibold text-slate-900">{t.topic}</span>
                <p className="font-mono text-[10px] text-slate-500">{t.channel}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[t.priority] || 'bg-slate-100 text-slate-700'}`}>
                  {t.priority}
                </span>
              </td>
              <td className="px-4 py-3.5"><SlaBadge slaDeadline={t.slaDeadline} status={t.status} /></td>
              <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{t.assignedExpertName || <span className="text-amber-700 font-bold">Unassigned</span>}</td>
              <td className="px-4 py-3.5"><ChatbotStatusBadge status={t.status} /></td>
              <td className="px-4 py-3.5">
                <button className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs" onClick={() => onView(t)}>View</button>
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-semibold">No handoff tickets match the current filters.</td></tr>
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
