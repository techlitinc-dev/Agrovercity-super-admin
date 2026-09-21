import React, { useEffect, useState } from 'react'
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
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5 z-50">
        <div className="flex items-start gap-3.5">
          <div className={`rounded-xl p-2.5 ring-1 ring-inset shrink-0 ${danger ? 'bg-rose-50 ring-rose-500/20 text-rose-600' : 'bg-amber-50 ring-amber-500/20 text-amber-600'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>
        {requireReason && (
          <div className="mt-4">
            <Field label="Administrative reason (recorded in audit log)">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Certificate expired, customer dispute #441" autoFocus />
            </Field>
          </div>
        )}
        {dualSignOff && (
          <div className="mt-3">
            <Field label="Dual-admin sign-off (approving admin UID)">
              <Input value={approver} onChange={(e) => setApprover(e.target.value)} placeholder="e.g. auditor@agrovercity — payouts above ₹50,000 need a second admin" />
            </Field>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(reason.trim())} disabled={blocked || busy}>
            {busy ? 'Processing…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
