import { useEffect, useState } from 'react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
        <h2 className="text-sm font-bold text-slate-100">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

export function AssignExpertModal({ open, ticket, experts, busy, onConfirm, onCancel }) {
  const [expertId, setExpertId] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setExpertId('')
      setReason('')
    }
  }, [open, ticket])

  if (!open) return null
  const available = (experts || []).filter((e) => e.available)
  const selected = available.find((e) => e.id === expertId)
  const blocked = reason.trim().length < 4 || !expertId

  return (
    <ModalShell
      title="Assign Agronomist to Handoff"
      subtitle={ticket ? `Ticket ${ticket.id} — ${ticket.topic} for ${ticket.farmerName}. The expert is notified on their registered channel.` : ''}
      onClose={onCancel}
    >
      <div className="mt-3 space-y-3">
        <Field label="Available expert agronomist (KVK certified)">
          <select className={inputCls} value={expertId} onChange={(e) => setExpertId(e.target.value)} autoFocus>
            <option value="">Select an expert…</option>
            {available.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.specialization} · {e.activeTickets} active · {e.rating}★
              </option>
            ))}
          </select>
        </Field>
        {selected && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
            {selected.organization} · {(selected.languages || []).join('/')} · {selected.experienceYears} yrs experience · channels: {(selected.channels || []).join(', ')}
          </div>
        )}
        {experts && available.length === 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
            No experts are currently available. Tickets breaching SLA are auto-escalated to the district KVK coordinator.
          </div>
        )}
        <Field label="Administrative reason (recorded in audit log)">
          <Input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Only pathologist available — matches grape mildew topic" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(expertId, reason.trim())} disabled={blocked || busy}>
          {busy ? 'Assigning…' : 'Assign Expert'}
        </Button>
      </div>
    </ModalShell>
  )
}

export function PromptConfigModal({ open, config, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({ systemPrompt: '', tone: 'friendly-expert', temperature: 0.4, knowledgeBaseVersion: '' })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && config) {
      setForm({
        systemPrompt: config.systemPrompt || '',
        tone: config.tone || 'friendly-expert',
        temperature: config.temperature ?? 0.4,
        knowledgeBaseVersion: config.knowledgeBaseVersion || '',
      })
      setReason('')
    }
  }, [open, config])

  if (!open) return null
  const blocked = reason.trim().length < 4 || form.systemPrompt.trim().length < 20
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <ModalShell
      title="Edit Kisan Mitra AI Prompt Config"
      subtitle={config ? `Currently v${config.version} · ${config.model} · updated ${config.updatedAt?.slice(0, 10)} by ${config.updatedBy}. A new version is published on save.` : ''}
      onClose={onCancel}
    >
      <div className="mt-3 space-y-3">
        <Field label="System prompt (min 20 chars)">
          <textarea className={`${inputCls} h-36 resize-none font-mono text-xs`} value={form.systemPrompt} onChange={set('systemPrompt')} autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tone of voice">
            <select className={inputCls} value={form.tone} onChange={set('tone')}>
              <option value="friendly-expert">Friendly Expert</option>
              <option value="formal-advisory">Formal Advisory</option>
              <option value="simple-direct">Simple & Direct</option>
              <option value="encouraging-local">Encouraging (Local Idiom)</option>
            </select>
          </Field>
          <Field label="Temperature (0–1)">
            <Input className={inputCls} type="number" step="0.05" min="0" max="1" value={form.temperature} onChange={set('temperature')} />
          </Field>
        </div>
        <Field label="Knowledge base (embeddings) version">
          <Input className={inputCls} value={form.knowledgeBaseVersion} onChange={set('knowledgeBaseVersion')} placeholder="kb-agri-2026.09-r3" />
        </Field>
        <Field label="Administrative reason (recorded in audit log)">
          <Input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Rate hallucination complaints — tightened unverified-rate guardrail" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(form, reason.trim())} disabled={blocked || busy}>
          {busy ? 'Publishing…' : 'Publish Config'}
        </Button>
      </div>
    </ModalShell>
  )
}
