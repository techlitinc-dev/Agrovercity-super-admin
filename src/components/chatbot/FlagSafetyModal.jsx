import { useState } from 'react'
import { Flag, AlertTriangle, ShieldAlert } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function FlagSafetyModal({ open, session, busy, onConfirm, onCancel }) {
  const [category, setCategory] = useState('Rate Hallucination')
  const [details, setDetails] = useState('')
  const [reason, setReason] = useState('')

  if (!open || !session) return null

  const isBlocked = reason.trim().length < 4 || details.trim().length < 6

  const handleFlag = () => {
    const combinedReason = `[${category}] ${details.trim()}`;
    onConfirm(session.id, combinedReason, reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
            <Flag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Flag AI Transcript for Safety / Accuracy Review</h3>
            <p className="text-xs text-slate-500">
              Session #{session.id} · Farmer: {session.farmerName} · Engine: {session.engine}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Safety Violation Category">
            <select
              className={inputCls}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Rate Hallucination">Mandi Rate Hallucination (Unverified price quote)</option>
              <option value="Unverified Chemical Dosage">Unverified Chemical / Pesticide Dosing Risk</option>
              <option value="Inaccurate Agronomic Advice">Inaccurate Agronomic / Sowing Advice</option>
              <option value="Vernacular Translation Error">Vernacular Language Translation / Tone Misalignment</option>
              <option value="Medical / Legal Disclaimer Breach">Regulatory Disclaimer Missing</option>
            </select>
          </Field>

          <Field label="Violation Description & Specific Message Reference">
            <textarea
              className={`${inputCls} h-20 resize-none`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. AI quoted Jalna soybean at ₹5,250 without verified APMC feed timestamp..."
              autoFocus
            />
          </Field>

          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span>
              Flagging updates the model safety telemetry, demotes confidence rankings for this prompt cluster, and alerts prompt engineering team.
            </span>
          </div>

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Farmer dispute escalation validated against APMC bulletin"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button
            variant="danger"
            onClick={handleFlag}
            disabled={isBlocked || busy}
          >
            {busy ? 'Flagging...' : 'Flag Transcript & Initiate Review'}
          </Button>
        </div>
      </div>
    </div>
  )
}
