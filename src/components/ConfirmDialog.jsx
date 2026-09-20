import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, Field, Input } from './ui.jsx'

export default function ConfirmDialog({ open, title, message, confirmLabel, requireReason = true, danger = false, dualSignOff = false, busy = false, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  const [approver, setApprover] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
      setApprover('')
    }
  }, [open])

  if (!open) return null
  const blocked = (requireReason && reason.trim().length < 4) || (dualSignOff && approver.trim().length < 4)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ring-1 ring-inset ${danger ? 'bg-rose-500/10 ring-rose-500/30' : 'bg-amber-500/10 ring-amber-500/30'}`}>
            <AlertTriangle className={`h-5 w-5 ${danger ? 'text-rose-400' : 'text-amber-400'}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{message}</p>
          </div>
        </div>
        {requireReason && (
          <Field label="Administrative reason (recorded in audit log)">
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Certificate expired, customer dispute #441" autoFocus />
          </Field>
        )}
        {dualSignOff && (
          <div className="mt-3">
            <Field label="Dual-admin sign-off (approving admin UID)">
              <Input value={approver} onChange={(e) => setApprover(e.target.value)} placeholder="e.g. auditor@agrovercity — payouts above ₹50,000 need a second admin" />
            </Field>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(reason.trim())} disabled={blocked || busy}>
            {busy ? 'Processing…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
