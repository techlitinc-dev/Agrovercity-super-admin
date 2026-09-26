import { useEffect, useState } from 'react'
import { CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function TicketResolutionModal({ open, ticket, mode = 'resolve', busy, onConfirm, onCancel }) {
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setNotes('')
      setReason('')
    }
  }, [open, ticket, mode])

  if (!open || !ticket) return null

  const isResolve = mode === 'resolve'
  const isBlocked = reason.trim().length < 4 || (isResolve && notes.trim().length < 10)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isResolve ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {isResolve ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isResolve ? `Resolve Handoff Ticket #${ticket.id}` : `Escalate Handoff Ticket #${ticket.id}`}
            </h3>
            <p className="text-xs text-slate-500">
              {ticket.farmerName} · Topic: {ticket.topic} · Channel: {ticket.channel}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {isResolve ? (
            <Field label="Agronomist Resolution & Advisory Notes (min 10 chars)">
              <textarea
                className={`${inputCls} h-24 resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detail the technical recommendation provided to the farmer..."
                autoFocus
              />
            </Field>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Emergency Escalation to District KVK Head
              </div>
              <span>
                Escalating flags this ticket as CRITICAL priority and triggers emergency SMS/IVR dispatch to the Zonal Agronomy Coordinator.
              </span>
            </div>
          )}

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isResolve ? "e.g. Farmer verified resolution via WhatsApp voice note" : "e.g. Chemical dosage ambiguity with high crop loss risk"}
              autoFocus={!isResolve}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button
            variant={isResolve ? 'default' : 'danger'}
            onClick={() => onConfirm(ticket.id, notes, reason.trim())}
            disabled={isBlocked || busy}
          >
            {busy ? 'Processing...' : isResolve ? 'Mark Ticket Resolved' : 'Confirm Escalation'}
          </Button>
        </div>
      </div>
    </div>
  )
}
