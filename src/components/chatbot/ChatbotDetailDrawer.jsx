import { Bot, Flag, User } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button, EmptyState } from '../ui'
import { ChatbotStatusBadge } from '../../pages/chatbotWidgets'

const LANG_LABELS = { mr: 'Marathi', hi: 'Hindi', en: 'English' }

export default function ChatbotDetailDrawer({ session, ticket, experts, promptConfig, onClose, onAssign, onUpdatePrompt }) {
  if (!session && !ticket) return null

  return (
    <DetailDrawer
      open={!!(session || ticket)}
      onClose={onClose}
      title={session ? `Transcript #${session.id}` : `Ticket #${ticket.id}`}
      subtitle={session ? `${session.farmerName} · ${LANG_LABELS[session.language]} · ${session.topic}` : `${ticket.farmerName} · ${ticket.topic}`}
    >
      {session ? <SessionView session={session} /> : <TicketView ticket={ticket} experts={experts} promptConfig={promptConfig} onAssign={onAssign} onUpdatePrompt={onUpdatePrompt} />}

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={session || ticket} />
      </DrawerSection>
    </DetailDrawer>
  )
}

function SessionView({ session }) {
  return (
    <>
      <DrawerSection title="Session Overview">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Farmer" v={`${session.farmerName} · ${session.farmerPhone?.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}`} />
          <KeyValue k="Language" v={LANG_LABELS[session.language]} />
          <KeyValue k="AI Engine" v={session.engine} mono />
          <KeyValue k="Topic" v={session.topic} />
          <KeyValue k="Messages" v={session.messageCount} mono />
          <KeyValue k="Satisfaction" v={session.satisfactionScore != null ? `${session.satisfactionScore} / 5 ★` : 'Not rated yet'} />
          <KeyValue k="Status" v={<ChatbotStatusBadge status={session.status} />} />
        </div>
      </DrawerSection>

      {session.flagReason && (
        <DrawerSection title="Safety / Accuracy Flag">
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            <Flag className="mt-0.5 h-4 w-4 shrink-0" />
            {session.flagReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Conversation Transcript">
        <div className="space-y-2.5">
          {session.messages?.map((m) => (
            <div key={m.id} className={`flex gap-2 ${m.role === 'farmer' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                  <Bot className="h-3.5 w-3.5 text-emerald-400" />
                </span>
              )}
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${m.role === 'farmer' ? 'bg-sky-500/10 ring-1 ring-sky-500/20' : m.handoff ? 'bg-orange-500/10 ring-1 ring-orange-500/30' : 'bg-slate-900 ring-1 ring-slate-800'}`}>
                <p className="text-sm leading-relaxed text-slate-200">{m.text}</p>
                <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span>{m.role === 'farmer' ? <User className="inline h-3 w-3" /> : 'KISAN MITRA'} · {m.at?.slice(0, 16).replace('T', ' ')}</span>
                  {m.confidence != null && (
                    <span className={m.confidence >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}>conf {(m.confidence * 100).toFixed(0)}%</span>
                  )}
                  {m.handoff && <span className="text-orange-400">→ HUMAN HANDOFF</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawerSection>
    </>
  )
}

function TicketView({ ticket, experts, promptConfig, onAssign, onUpdatePrompt }) {
  const canAssign = ['open', 'escalated'].includes(ticket.status)
  const available = experts?.filter((e) => e.available) || []

  return (
    <>
      <DrawerSection title="Handoff Ticket">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Farmer" v={`${ticket.farmerName} · ${ticket.farmerPhone?.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}`} />
          <KeyValue k="Source Session" v={ticket.sessionId} mono />
          <KeyValue k="Topic" v={ticket.topic} />
          <KeyValue k="Priority" v={ticket.priority} />
          <KeyValue k="Language" v={LANG_LABELS[ticket.language]} />
          <KeyValue k="Contact Channel" v={ticket.channel} />
          <KeyValue k="SLA Deadline" v={ticket.slaDeadline?.slice(0, 16).replace('T', ' ')} mono />
          <KeyValue k="Assigned Expert" v={ticket.assignedExpertName || 'Unassigned'} />
        </div>
      </DrawerSection>

      <DrawerSection title="Expert Roster (Available Agronomists)">
        {experts == null ? (
          <div className="rounded-lg border border-slate-800 py-6 text-center text-xs text-slate-500">Loading expert roster…</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-semibold">Expert</th>
                  <th className="px-3 py-2 font-semibold">Specialization</th>
                  <th className="px-3 py-2 font-semibold">Load</th>
                  <th className="px-3 py-2 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((e) => (
                  <tr key={e.id} className="border-b border-slate-800/60 last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-slate-200">{e.name}</p>
                      <p className="font-mono text-[10px] text-slate-500">{e.organization} · {(e.languages || []).map((l) => LANG_LABELS[l] || l).join(', ')}</p>
                    </td>
                    <td className="px-3 py-2 text-slate-400">{e.specialization}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${e.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {e.available ? `AVAILABLE · ${e.activeTickets} active` : `BUSY · ${e.activeTickets} active`}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-amber-400">{e.rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DrawerSection>

      <DrawerSection title="Actions">
        <div className="flex flex-wrap gap-2">
          {canAssign && (
            <Button onClick={() => onAssign(ticket)}>
              Assign Agronomist ({available.length} available)
            </Button>
          )}
          <Button variant="secondary" onClick={onUpdatePrompt}>
            Edit AI Prompt Config
          </Button>
          {!canAssign && (
            <p className="text-xs text-slate-500">
              Ticket is {ticket.status}{ticket.resolvedAt ? ` (resolved ${ticket.resolvedAt.slice(0, 10)})` : ''} — no reassignment available.
            </p>
          )}
        </div>
      </DrawerSection>
    </>
  )
}
