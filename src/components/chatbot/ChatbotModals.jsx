import { useEffect, useState } from 'react'
import { Bot, UserCheck, AlertTriangle, ShieldCheck, Sparkles, Save } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
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
  const selected = (experts || []).find((e) => e.id === expertId)
  const blocked = reason.trim().length < 4 || !expertId

  return (
    <ModalShell
      title="Assign Agronomist to Handoff"
      subtitle={ticket ? `Ticket #${ticket.id} — ${ticket.topic} for ${ticket.farmerName}. The agronomist will receive dispatch notice via ${ticket.channel}.` : ''}
      onClose={onCancel}
    >
      <div className="mt-4 space-y-4">
        <Field label="Certified KVK Agronomist (Available on duty)">
          <select className={inputCls} value={expertId} onChange={(e) => setExpertId(e.target.value)} autoFocus>
            <option value="">Select an available agronomist…</option>
            {available.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.specialization} ({e.organization}) · {e.activeTickets || 0} active · {e.rating}★
              </option>
            ))}
          </select>
        </Field>

        {selected && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950">
            <p className="font-bold">{selected.name} · {selected.organization}</p>
            <p className="text-slate-600 mt-0.5">Specialization: {selected.specialization} ({selected.experienceYears} yrs experience)</p>
            <p className="font-mono text-[10px] text-slate-500 mt-1">Languages: {(selected.languages || []).join(', ')} · Channels: {(selected.channels || []).join(', ')}</p>
          </div>
        )}

        {experts && available.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            No agronomists are currently marked available. Tickets approaching SLA deadline will be auto-escalated to Zonal KVK Coordinators.
          </div>
        )}

        <Field label="Administrative Reason (Mandatory for Audit Trail)">
          <Input
            className={inputCls}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Assigned plant pathologist with grapes specialization to investigate downy mildew"
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(expertId, reason.trim())} disabled={blocked || busy}>
          <UserCheck className="h-4 w-4 mr-1.5" />
          {busy ? 'Assigning…' : 'Assign Expert'}
        </Button>
      </div>
    </ModalShell>
  )
}

export function PromptConfigModal({ open, config, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    systemPrompt: '',
    tone: 'friendly-expert',
    temperature: 0.4,
    knowledgeBaseVersion: 'kb-agri-2026.09-r3'
  })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && config) {
      setForm({
        systemPrompt: config.systemPrompt || '',
        tone: config.tone || 'friendly-expert',
        temperature: config.temperature ?? 0.4,
        knowledgeBaseVersion: config.knowledgeBaseVersion || 'kb-agri-2026.09-r3',
      })
      setReason('')
    }
  }, [open, config])

  if (!open) return null
  const blocked = reason.trim().length < 4 || form.systemPrompt.trim().length < 20
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <ModalShell
      title="Calibrate Kisan Mitra AI Prompt & Model Parameters"
      subtitle={config ? `Currently v${config.version} (${config.model || 'gemini-2.5-flash'}) · reviewed by ${config.updatedBy || 'root@agrovercity'}` : ''}
      onClose={onCancel}
    >
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 text-xs text-emerald-900">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Model: Gemini 2.5 Flash + Rule-Based Agronomy Engine
          </span>
          <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-bold">ICAR Guardrails Active</span>
        </div>

        <Field label="System Prompt (min 20 characters)">
          <textarea
            className={`${inputCls} h-36 resize-none font-mono text-[11px] leading-relaxed`}
            value={form.systemPrompt}
            onChange={set('systemPrompt')}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Conversational Tone">
            <select className={inputCls} value={form.tone} onChange={set('tone')}>
              <option value="friendly-expert">Friendly Agronomy Expert</option>
              <option value="formal-advisory">Formal Statutory Advisory</option>
              <option value="simple-direct">Simple & Direct (Plain Vernacular)</option>
              <option value="encouraging-local">Encouraging (Rural Maharashtra Idiom)</option>
            </select>
          </Field>

          <Field label="Temperature (Creativity: 0.0 - 1.0)">
            <Input
              className={inputCls}
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={form.temperature}
              onChange={set('temperature')}
            />
          </Field>
        </div>

        <Field label="Knowledge Base Vector Embeddings Version">
          <Input
            className={inputCls}
            value={form.knowledgeBaseVersion}
            onChange={set('knowledgeBaseVersion')}
            placeholder="e.g. kb-agri-2026.09-r3"
          />
        </Field>

        <Field label="Administrative Reason (Mandatory for Audit Trail)">
          <Input
            className={inputCls}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Enforced stricter mandi verification threshold to prevent price disputes"
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(form, reason.trim())} disabled={blocked || busy}>
          <Save className="h-4 w-4 mr-1.5" />
          {busy ? 'Publishing…' : 'Publish & Deploy New Version'}
        </Button>
      </div>
    </ModalShell>
  )
}
