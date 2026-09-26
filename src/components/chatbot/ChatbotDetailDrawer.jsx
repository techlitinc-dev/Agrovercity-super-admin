import { Bot, Flag, User, Clock, CheckCircle2, ShieldAlert, UserCheck, MessageSquare } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button, EmptyState } from '../ui'
import { ChatbotStatusBadge } from '../../pages/chatbotWidgets'

const LANG_LABELS = { mr: 'Marathi (मराठी)', hi: 'Hindi (हिंदी)', en: 'English' }

export default function ChatbotDetailDrawer({
  session,
  ticket,
  experts,
  promptConfig,
  onClose,
  onAssign,
  onResolveTicket,
  onEscalateTicket,
  onFlagSafety,
  onUpdatePrompt
}) {
  if (!session && !ticket) return null

  return (
    <DetailDrawer
      open={!!(session || ticket)}
      onClose={onClose}
      title={session ? `Transcript #${session.id}` : `Ticket #${ticket.id}`}
      subtitle={session ? `${session.farmerName} · ${LANG_LABELS[session.language] || session.language} · ${session.topic}` : `${ticket.farmerName} · ${ticket.topic}`}
    >
      {session ? (
        <SessionView
          session={session}
          onFlagSafety={onFlagSafety}
        />
      ) : (
        <TicketView
          ticket={ticket}
          experts={experts}
          promptConfig={promptConfig}
          onAssign={onAssign}
          onResolveTicket={onResolveTicket}
          onEscalateTicket={onEscalateTicket}
          onUpdatePrompt={onUpdatePrompt}
        />
      )}

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={session || ticket} />
      </DrawerSection>
    </DetailDrawer>
  )
}

function SessionView({ session, onFlagSafety }) {
  return (
    <>
      <DrawerSection title="Session Overview">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Farmer" v={`${session.farmerName} · ${session.farmerPhone}`} />
          <KeyValue k="Language" v={LANG_LABELS[session.language] || session.language} />
          <KeyValue k="AI Engine" v={session.engine} mono />
          <KeyValue k="Topic" v={session.topic} />
          <KeyValue k="Messages" v={session.messageCount} mono />
          <KeyValue k="Satisfaction" v={session.satisfactionScore != null ? `${session.satisfactionScore} / 5 ★` : 'Awaiting farmer rating'} />
          <KeyValue k="Status" v={<ChatbotStatusBadge status={session.status} />} />
        </div>
      </DrawerSection>

      {session.flagReason ? (
        <DrawerSection title="Safety & Accuracy Flag">
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900 shadow-2xs">
            <Flag className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <p className="font-bold">Flagged for Safety Review</p>
              <p className="mt-0.5 text-rose-800">{session.flagReason}</p>
            </div>
          </div>
        </DrawerSection>
      ) : (
        <DrawerSection title="Safety Monitoring">
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-900">
            <span>No safety or accuracy violations flagged.</span>
            <Button variant="danger" size="sm" onClick={() => onFlagSafety(session)}>
              <Flag className="h-3 w-3 mr-1" /> Flag Transcript
            </Button>
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Conversation Transcript (Multi-turn)">
        <div className="space-y-3">
          {session.messages?.map((m) => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'farmer' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                  m.role === 'farmer'
                    ? 'bg-sky-50 text-sky-950 border border-sky-200'
                    : m.handoff
                    ? 'bg-amber-50 text-amber-950 border border-amber-300 ring-1 ring-amber-300'
                    : 'bg-white text-slate-800 border border-emerald-100'
                }`}
              >
                <p className="font-medium">{m.text}</p>
                <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    {m.role === 'farmer' ? <User className="h-3 w-3 text-sky-600" /> : <Bot className="h-3 w-3 text-emerald-600" />}
                    <span>{m.role === 'farmer' ? 'FARMER' : 'KISAN MITRA'} · {m.at?.slice(0, 16).replace('T', ' ')}</span>
                  </span>
                  {m.confidence != null && (
                    <span className={`font-bold ${m.confidence >= 0.8 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {(m.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  {m.handoff && <span className="font-bold text-amber-700">&rarr; KVK ESCALATION</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawerSection>
    </>
  )
}

function TicketView({
  ticket,
  experts,
  promptConfig,
  onAssign,
  onResolveTicket,
  onEscalateTicket,
  onUpdatePrompt
}) {
  const canAssign = ['open', 'escalated'].includes(ticket.status)
  const canResolve = ['assigned', 'open', 'escalated'].includes(ticket.status)
  const available = experts?.filter((e) => e.available) || []

  return (
    <>
      <DrawerSection title="Handoff Ticket & SLA">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Farmer" v={`${ticket.farmerName} · ${ticket.farmerPhone}`} />
          <KeyValue k="Source Session ID" v={ticket.sessionId} mono />
          <KeyValue k="Topic" v={ticket.topic} />
          <KeyValue k="Priority" v={ticket.priority} />
          <KeyValue k="Language" v={LANG_LABELS[ticket.language] || ticket.language} />
          <KeyValue k="Preferred Channel" v={ticket.channel} />
          <KeyValue k="SLA Deadline" v={ticket.slaDeadline?.slice(0, 16).replace('T', ' ')} mono />
          <KeyValue k="Assigned Agronomist" v={ticket.assignedExpertName || 'Unassigned'} />
          <KeyValue k="Status" v={<ChatbotStatusBadge status={ticket.status} />} />
        </div>
      </DrawerSection>

      {ticket.resolutionNotes && (
        <DrawerSection title="Agronomist Resolution Notes">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Advisory Delivered
            </div>
            <p className="leading-relaxed">{ticket.resolutionNotes}</p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">
              Resolved at: {ticket.resolvedAt?.slice(0, 16).replace('T', ' ')}
            </p>
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Actions & Triage Controls">
        <div className="flex flex-wrap gap-2">
          {canAssign && (
            <Button onClick={() => onAssign(ticket)}>
              <UserCheck className="h-4 w-4 mr-1.5" />
              Assign Agronomist ({available.length} available)
            </Button>
          )}

          {canResolve && (
            <Button variant="secondary" onClick={() => onResolveTicket(ticket)}>
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" />
              Mark Resolved
            </Button>
          )}

          {ticket.status !== 'escalated' && ticket.status !== 'resolved' && (
            <Button variant="danger" onClick={() => onEscalateTicket(ticket)}>
              <ShieldAlert className="h-4 w-4 mr-1.5" />
              Escalate to KVK Head
            </Button>
          )}

          <Button variant="secondary" onClick={onUpdatePrompt}>
            Calibrate Prompt Config
          </Button>
        </div>
      </DrawerSection>
    </>
  )
}
