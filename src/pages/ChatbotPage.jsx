import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bot,
  UserCheck,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Download,
  AlertTriangle,
  Award,
  Clock
} from 'lucide-react'
import { adminChatbotService } from '../services/adminChatbotService'
import ChatbotDetailDrawer from '../components/chatbot/ChatbotDetailDrawer'
import { AssignExpertModal, PromptConfigModal } from '../components/chatbot/ChatbotModals'
import ExpertsRosterTable from '../components/chatbot/ExpertsRosterTable'
import ExpertModal from '../components/chatbot/ExpertModal'
import TicketResolutionModal from '../components/chatbot/TicketResolutionModal'
import FlagSafetyModal from '../components/chatbot/FlagSafetyModal'
import ChatbotAnalyticsView from '../components/chatbot/ChatbotAnalyticsView'
import ChatbotAuditTrailTable from '../components/chatbot/ChatbotAuditTrailTable'
import {
  MetricCard,
  FiltersBar,
  TabSwitch,
  TranscriptsTable,
  HandoffsTable,
  Pagination,
  SESSION_STATUSES,
  TICKET_STATUSES
} from './chatbotWidgets'

const PAGE_SIZE = 15

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0])
  const lines = rows.map((r) => head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
  return [head.join(','), ...lines].join('\n')
}

const STATUS_KEYS = {
  transcripts: SESSION_STATUSES,
  handoffs: TICKET_STATUSES,
  experts: ['available', 'busy'],
  analytics: [],
  audit_trail: []
}

export default function ChatbotPage() {
  const [tab, setTab] = useState('transcripts')
  const [sessions, setSessions] = useState([])
  const [tickets, setTickets] = useState([])
  const [experts, setExperts] = useState([])
  const [promptConfig, setPromptConfig] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [kpis, setKpis] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })

  // Drawer and Modals
  const [selected, setSelected] = useState(null)
  const [assignModal, setAssignModal] = useState({ open: false, ticket: null })
  const [promptModalOpen, setPromptModalOpen] = useState(false)
  const [expertModal, setExpertModal] = useState({ open: false, expert: null })
  const [resolutionModal, setResolutionModal] = useState({ open: false, ticket: null, mode: 'resolve' })
  const [flagSafetyModal, setFlagSafetyModal] = useState({ open: false, session: null })
  const [busy, setBusy] = useState(false)

  const loadKpis = useCallback(async () => {
    try {
      const stats = await adminChatbotService.getChatbotKpis()
      setKpis(stats)
      const config = await adminChatbotService.getPromptConfig()
      setPromptConfig(config)
      const roster = await adminChatbotService.listExperts()
      setExperts(roster || [])
    } catch (err) {
      console.error('Failed to load KPIs or config', err)
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'transcripts') {
        const res = await adminChatbotService.listTranscripts({
          query: q,
          status,
          page,
          limit: PAGE_SIZE
        })
        setSessions(res.sessions || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'handoffs') {
        const res = await adminChatbotService.listHandoffs({
          query: q,
          status,
          page,
          limit: PAGE_SIZE
        })
        setTickets(res.tickets || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'experts') {
        const roster = await adminChatbotService.listExperts({
          query: q
        })
        setExperts(roster || [])
        setTotal(roster?.length || 0)
      } else if (tab === 'analytics') {
        const sRes = await adminChatbotService.listTranscripts({ limit: 100 })
        const tRes = await adminChatbotService.listHandoffs({ limit: 100 })
        setSessions(sRes.sessions || [])
        setTickets(tRes.tickets || [])
      } else if (tab === 'audit_trail') {
        const res = await adminChatbotService.listChatbotAuditLogs({
          query: q,
          page,
          limit: PAGE_SIZE
        })
        setAuditLogs(res.auditLogs || [])
        setTotal(res.pagination?.total || 0)
      }
      await loadKpis()
    } catch (err) {
      setError(err.message || 'Failed to load chatbot records')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, loadKpis])

  useEffect(() => {
    loadData()
  }, [loadData])

  const rows = tab === 'transcripts' ? sessions : tab === 'handoffs' ? tickets : experts

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

  // Handlers
  const handleAssign = async (expertId, reason) => {
    const ticket = assignModal.ticket
    if (!ticket) return
    setBusy(true)
    try {
      const res = await adminChatbotService.assignExpert({
        ticketId: ticket.id,
        expertId,
        reason
      })
      setAssignModal({ open: false, ticket: null })
      setSelected(null)
      setNotice(res.message || 'Agronomist assigned successfully.')
      loadData()
    } catch (err) {
      setError(err.message || 'Assignment failed')
    } finally {
      setBusy(false)
    }
  }

  const handleResolveTicket = async (ticketId, notes, reason) => {
    setBusy(true)
    try {
      const res = await adminChatbotService.resolveTicket({
        ticketId,
        resolutionNotes: notes,
        reason
      })
      setResolutionModal({ open: false, ticket: null, mode: 'resolve' })
      setSelected(null)
      setNotice(res.message || 'Ticket resolved successfully.')
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to resolve ticket')
    } finally {
      setBusy(false)
    }
  }

  const handleEscalateTicket = async (ticketId, notes, reason) => {
    setBusy(true)
    try {
      const res = await adminChatbotService.escalateTicket({
        ticketId,
        reason
      })
      setResolutionModal({ open: false, ticket: null, mode: 'escalate' })
      setSelected(null)
      setNotice(res.message || 'Ticket escalated successfully.')
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to escalate ticket')
    } finally {
      setBusy(false)
    }
  }

  const handleFlagSafety = async (sessionId, violationText, reason) => {
    setBusy(true)
    try {
      const res = await adminChatbotService.flagTranscriptSafety({
        sessionId,
        reason: `${violationText} - ${reason}`
      })
      setFlagSafetyModal({ open: false, session: null })
      setSelected(null)
      setNotice(res.message || 'Transcript flagged for safety review.')
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to flag transcript')
    } finally {
      setBusy(false)
    }
  }

  const handleSaveExpert = async (form, reason) => {
    setBusy(true)
    try {
      await adminChatbotService.createOrUpdateExpert({
        expertData: form,
        reason
      })
      setExpertModal({ open: false, expert: null })
      setNotice(`Expert profile for ${form.name} saved successfully.`)
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to save expert profile')
    } finally {
      setBusy(false)
    }
  }

  const handleToggleAvailability = async (expertId, available) => {
    setBusy(true)
    try {
      await adminChatbotService.toggleExpertAvailability(expertId, available)
      setNotice(`Availability updated.`)
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to toggle availability')
    } finally {
      setBusy(false)
    }
  }

  const handlePromptUpdate = async (form, reason) => {
    setBusy(true)
    try {
      const res = await adminChatbotService.updatePromptConfig({
        systemPrompt: form.systemPrompt,
        tone: form.tone,
        temperature: Number(form.temperature),
        knowledgeBaseVersion: form.knowledgeBaseVersion,
        reason
      })
      setPromptConfig(res.config)
      setPromptModalOpen(false)
      setNotice(res.message || 'Kisan Mitra AI prompt configuration updated.')
      loadData()
    } catch (err) {
      setError(err.message || 'Prompt update failed')
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all chatbot sessions, transcripts, expert tickets, and prompt configurations to statutory defaults?')) return
    setBusy(true)
    try {
      await adminChatbotService.resetToDefaultSeed()
      setNotice('Chatbot and Expert Handoff seed data reset to baseline.')
      loadData()
    } catch (err) {
      setError(err.message || 'Reset failed')
    } finally {
      setBusy(false)
    }
  }

  const handleExport = () => {
    let rowsToExport = []
    let filenamePrefix = `chatbot-${tab}`
    if (tab === 'transcripts') rowsToExport = sessions
    else if (tab === 'handoffs') rowsToExport = tickets
    else if (tab === 'experts') rowsToExport = experts
    else if (tab === 'audit_trail') rowsToExport = auditLogs

    const csvContent = toCsv(rowsToExport)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch
          tab={tab}
          setTab={(t) => {
            setPage(1)
            setStatus('all')
            setSort({ key: 'createdAt', dir: 'desc' })
            setTab(t)
          }}
        />

        <div className="flex items-center gap-2">
          {promptConfig && (
            <button
              onClick={() => setPromptModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-50 transition-colors"
              title="Click to calibrate Gemini 2.5 Flash system prompt & temperature"
            >
              <Bot className="h-3.5 w-3.5 text-emerald-600" />
              <span>Prompt Config v{promptConfig.version}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">Gemini 2.5 Flash</span>
            </button>
          )}

          <button
            onClick={handleResetSeed}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Reset to statutory seed state"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Seed
          </button>
        </div>
      </div>

      {/* Target Collections Stat Pill */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Target Collections: chatbot_sessions · chatbot_messages · expert_tickets · experts · prompt_config · audit_logs</span>
        <span className="font-semibold text-emerald-800">SOP-12 Superadmin Mode</span>
      </div>

      {/* Top Metric Bar */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Active AI Sessions"
          value={kpis?.activeSessions != null ? kpis.activeSessions : '—'}
          tone="emerald"
          sub="Live farmer conversations"
        />
        <MetricCard
          label="Pending Handoffs"
          value={kpis?.openTickets != null ? kpis.openTickets : '—'}
          tone="amber"
          sub="Awaiting KVK agronomist triage"
        />
        <MetricCard
          label="Available Agronomists"
          value={`${kpis?.availableExperts || 3} / ${kpis?.totalExperts || 4}`}
          tone="sky"
          sub="KVK certified specialists on duty"
        />
        <MetricCard
          label="CSAT Satisfaction"
          value={kpis?.avgSatisfaction ? `${kpis.avgSatisfaction} ★` : '4.6 ★'}
          tone={kpis?.breachedSla > 0 ? "rose" : "emerald"}
          sub={kpis?.breachedSla > 0 ? `${kpis.breachedSla} SLA breaches flagged` : "Zero SLA breaches today"}
        />
      </div>

      {/* Feedback Alerts */}
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 shadow-2xs">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-700 hover:text-emerald-950">&times;</button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-900 shadow-2xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-700 hover:text-rose-950">&times;</button>
        </div>
      )}

      {/* Filters Bar for tabular views (Transcripts, Handoffs) */}
      {(tab === 'transcripts' || tab === 'handoffs') && (
        <FiltersBar
          q={q}
          setQ={(v) => { setPage(1); setQ(v); }}
          status={status}
          setStatus={(v) => { setPage(1); setStatus(v); }}
          statuses={STATUS_KEYS[tab] || []}
          dateRange={dateRange}
          setDateRange={(v) => { setPage(1); setDateRange(v); }}
          onExport={handleExport}
        />
      )}

      {/* Primary Data Grid / View Rendering */}
      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">
          Loading Kisan Mitra AI conversations & expert queue…
        </div>
      ) : tab === 'transcripts' ? (
        <>
          <TranscriptsTable
            sessions={sorted}
            sort={sort}
            onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(doc) => setSelected({ type: 'transcripts', doc })}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'handoffs' ? (
        <>
          <HandoffsTable
            tickets={sorted}
            sort={sort}
            onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(doc) => setSelected({ type: 'handoffs', doc })}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'experts' ? (
        <ExpertsRosterTable
          experts={experts}
          onAddNewExpert={() => setExpertModal({ open: true, expert: null })}
          onEditExpert={(exp) => setExpertModal({ open: true, expert: exp })}
          onToggleAvailability={handleToggleAvailability}
        />
      ) : tab === 'analytics' ? (
        <ChatbotAnalyticsView
          sessions={sessions}
          tickets={tickets}
          kpis={kpis}
        />
      ) : (
        <ChatbotAuditTrailTable
          auditLogs={auditLogs}
          pagination={{ page, limit: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) }}
          onPageChange={setPage}
          loading={loading}
        />
      )}

      {/* Slide-over Detail Drawer */}
      <ChatbotDetailDrawer
        session={selected?.type === 'transcripts' ? selected.doc : null}
        ticket={selected?.type === 'handoffs' ? selected.doc : null}
        experts={experts}
        promptConfig={promptConfig}
        onClose={() => setSelected(null)}
        onAssign={(ticket) => setAssignModal({ open: true, ticket })}
        onResolveTicket={(ticket) => setResolutionModal({ open: true, ticket, mode: 'resolve' })}
        onEscalateTicket={(ticket) => setResolutionModal({ open: true, ticket, mode: 'escalate' })}
        onFlagSafety={(session) => setFlagSafetyModal({ open: true, session })}
        onUpdatePrompt={() => setPromptModalOpen(true)}
      />

      {/* Modals */}
      <AssignExpertModal
        open={assignModal.open}
        ticket={assignModal.ticket}
        experts={experts}
        busy={busy}
        onConfirm={handleAssign}
        onCancel={() => setAssignModal({ open: false, ticket: null })}
      />

      <PromptConfigModal
        open={promptModalOpen}
        config={promptConfig}
        busy={busy}
        onConfirm={handlePromptUpdate}
        onCancel={() => setPromptModalOpen(false)}
      />

      <ExpertModal
        open={expertModal.open}
        expert={expertModal.expert}
        busy={busy}
        onConfirm={handleSaveExpert}
        onCancel={() => setExpertModal({ open: false, expert: null })}
      />

      <TicketResolutionModal
        open={resolutionModal.open}
        ticket={resolutionModal.ticket}
        mode={resolutionModal.mode}
        busy={busy}
        onConfirm={resolutionModal.mode === 'resolve' ? handleResolveTicket : handleEscalateTicket}
        onCancel={() => setResolutionModal({ open: false, ticket: null, mode: 'resolve' })}
      />

      <FlagSafetyModal
        open={flagSafetyModal.open}
        session={flagSafetyModal.session}
        busy={busy}
        onConfirm={handleFlagSafety}
        onCancel={() => setFlagSafetyModal({ open: false, session: null })}
      />
    </div>
  )
}
