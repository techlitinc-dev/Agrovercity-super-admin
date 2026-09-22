import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bot } from 'lucide-react'
import { isMockMode, listTranscripts, listHandoffs, listExperts, getPromptConfig, assignExpert, updatePromptConfig } from '../api/chatbotApi'
import ChatbotDetailDrawer from '../components/chatbot/ChatbotDetailDrawer'
import { AssignExpertModal, PromptConfigModal } from '../components/chatbot/ChatbotModals'
import { MetricCard, FiltersBar, TabSwitch, TranscriptsTable, HandoffsTable, Pagination, SESSION_STATUSES, TICKET_STATUSES } from './chatbotWidgets'

const PAGE_SIZE = 20

function toCsv(rows) {
  if (rows.length === 0) return ''
  const head = Object.keys(rows[0])
  const lines = rows.map((r) => head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
  return [head.join(','), ...lines].join('\n')
}

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

const STATUS_KEYS = { transcripts: SESSION_STATUSES, handoffs: TICKET_STATUSES }

export default function ChatbotPage() {
  const [tab, setTab] = useState('transcripts')
  const [sessions, setSessions] = useState([])
  const [tickets, setTickets] = useState([])
  const [experts, setExperts] = useState(null)
  const [promptConfig, setPromptConfig] = useState(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })
  const [selected, setSelected] = useState(null)
  const [assignModal, setAssignModal] = useState({ open: false, ticket: null })
  const [promptModalOpen, setPromptModalOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = { page, pageSize: PAGE_SIZE, q, status, from: dateRange === 'all' ? '' : daysAgoIso(Number(dateRange)) }
    try {
      const res = tab === 'transcripts' ? await listTranscripts(params) : await listHandoffs(params)
      if (tab === 'transcripts') setSessions(res.data || [])
      else setTickets(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load chatbot data')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, dateRange])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    listExperts().then((r) => setExperts(r.data || [])).catch(() => setExperts([]))
    getPromptConfig().then(setPromptConfig).catch(() => setPromptConfig(null))
  }, [])

  const rows = tab === 'transcripts' ? sessions : tickets

  const sorted = useMemo(() => {
    const list = [...rows]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return typeof va === 'number' ? (va - vb) * mul : String(va).localeCompare(String(vb)) * mul
    })
    return list
  }, [rows, sort])

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    if (tab === 'transcripts') {
      const rated = sessions.filter((s) => s.satisfactionScore != null)
      const avg = rated.length > 0 ? (rated.reduce((sum, s) => sum + s.satisfactionScore, 0) / rated.length).toFixed(1) : null
      return {
        active: sessions.filter((s) => s.status === 'active').length,
        pending: sessions.filter((s) => s.status === 'escalated').length,
        today: sessions.filter((s) => s.createdAt.slice(0, 10) === today).length,
        flagged: sessions.filter((s) => s.flagged || s.status === 'flagged').length,
        extra: avg ? `${avg}/5 avg satisfaction` : '',
      }
    }
    return {
      active: tickets.filter((t) => t.status === 'assigned').length,
      pending: tickets.filter((t) => ['open', 'escalated'].includes(t.status)).length,
      today: tickets.filter((t) => t.createdAt.slice(0, 10) === today).length,
      flagged: tickets.filter((t) => t.slaDeadline && new Date(t.slaDeadline) < new Date() && t.status !== 'resolved').length,
      extra: `${(experts || []).filter((e) => e.available).length}/${(experts || []).length || 0} experts available`,
    }
  }, [tab, sessions, tickets, experts])

  async function handleAssign(expertId, reason) {
    const ticket = assignModal.ticket
    setBusy(true)
    try {
      const updated = await assignExpert(ticket.id, expertId, reason)
      setAssignModal({ open: false, ticket: null })
      setSelected((s) => s && s.doc.id === ticket.id ? { ...s, doc: updated } : s)
      listExperts().then((r) => setExperts(r.data || [])).catch(() => {})
      load()
    } catch (err) {
      setError(err.message || 'Assignment failed')
    } finally {
      setBusy(false)
    }
  }

  async function handlePromptUpdate(form, reason) {
    setBusy(true)
    try {
      const updated = await updatePromptConfig({
        systemPrompt: form.systemPrompt,
        tone: form.tone,
        temperature: Number(form.temperature),
        knowledgeBaseVersion: form.knowledgeBaseVersion,
        reason,
      })
      setPromptConfig(updated)
      setPromptModalOpen(false)
    } catch (err) {
      setError(err.message || 'Prompt update failed')
    } finally {
      setBusy(false)
    }
  }

  function handleExport() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatbot-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch tab={tab} setTab={(t) => { setPage(1); setStatus('all'); setSort({ key: 'createdAt', dir: 'desc' }); setTab(t) }} />
        <span className="font-mono text-xs text-slate-500">Collections: chatbot_sessions · chatbot_messages · expert_tickets · experts</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label={tab === 'transcripts' ? 'Active Sessions' : 'Assigned Tickets'} value={metrics.active} tone="emerald" sub={tab === 'transcripts' ? 'live conversations' : 'with agronomist'} />
        <MetricCard label="Pending Action" value={metrics.pending} tone="amber" sub={tab === 'transcripts' ? 'escalated to human' : 'open handoff queue'} />
        <MetricCard label="Today's Volume" value={metrics.today} tone="sky" sub={tab === 'transcripts' ? 'new sessions today' : 'new tickets today'} />
        <MetricCard label={tab === 'transcripts' ? 'Flagged / Safety' : 'SLA Breached'} value={metrics.flagged} tone="rose" sub={metrics.extra || (tab === 'transcripts' ? 'needs transcript review' : 'past deadline, unresolved')} />
      </div>

      {isMockMode() && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Backend unreachable at <span className="font-mono">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'}</span> — displaying mock data. Set a valid admin ID token and API base URL for live data.
        </div>
      )}
      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>}

      <FiltersBar q={q} setQ={(v) => { setPage(1); setQ(v) }} status={status} setStatus={(v) => { setPage(1); setStatus(v) }} statuses={STATUS_KEYS[tab]} dateRange={dateRange} setDateRange={(v) => { setPage(1); setDateRange(v) }} onExport={handleExport}>
        {promptConfig && (
          <button className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/80 transition-colors shadow-2xs" onClick={() => setPromptModalOpen(true)} title={promptConfig.systemPrompt}>
            <Bot className="h-4 w-4 text-emerald-700" /> Prompt Config v{promptConfig.version}
          </button>
        )}
      </FiltersBar>

      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">Loading chatbot data…</div>
      ) : tab === 'transcripts' ? (
        <TranscriptsTable sessions={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={(doc) => setSelected({ type: 'transcripts', doc })} />
      ) : (
        <HandoffsTable tickets={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={(doc) => setSelected({ type: 'handoffs', doc })} />
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />

      <ChatbotDetailDrawer
        session={selected?.type === 'transcripts' ? selected.doc : null}
        ticket={selected?.type === 'handoffs' ? selected.doc : null}
        experts={experts}
        promptConfig={promptConfig}
        onClose={() => setSelected(null)}
        onAssign={(ticket) => setAssignModal({ open: true, ticket })}
        onUpdatePrompt={() => setPromptModalOpen(true)}
      />

      <AssignExpertModal open={assignModal.open} ticket={assignModal.ticket} experts={experts} busy={busy} onConfirm={handleAssign} onCancel={() => setAssignModal({ open: false, ticket: null })} />
      <PromptConfigModal open={promptModalOpen} config={promptConfig} busy={busy} onConfirm={handlePromptUpdate} onCancel={() => setPromptModalOpen(false)} />
    </div>
  )
}
