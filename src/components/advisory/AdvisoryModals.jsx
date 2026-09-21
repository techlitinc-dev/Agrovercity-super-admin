import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button, Field, Input, Select } from '../ui'

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

export function BroadcastAlertModal({ open, preset, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({ pestName: '', district: '', severity: 'moderate', crop: 'All Crops', radiusKm: 50, message: '', schedule: '' })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setForm({
        pestName: preset?.pestName || '',
        district: preset?.district || '',
        severity: preset?.severity || 'moderate',
        crop: preset?.crop || 'All Crops',
        radiusKm: preset?.radiusKm || 50,
        message: '',
        schedule: '',
      })
      setReason('')
    }
  }, [open, preset])

  if (!open) return null
  const blocked = reason.trim().length < 4 || !form.pestName.trim() || !form.district.trim()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <ModalShell
      title="Broadcast Geofenced Pest Alert"
      subtitle="The alert is pushed to all farmers inside the geofence radius via SMS, WhatsApp and app notification, and logged immutably."
      onClose={onCancel}
    >
      <div className="mt-3 space-y-3">
        <Field label="Pest / Disease name">
          <Input className={inputCls} value={form.pestName} onChange={set('pestName')} placeholder="e.g. Fall Armyworm (Spodoptera frugiperda)" autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="District">
            <Input className={inputCls} value={form.district} onChange={set('district')} placeholder="e.g. Nashik" />
          </Field>
          <Field label="Severity">
            <select className={inputCls} value={form.severity} onChange={set('severity')}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Geofence radius (km)">
            <Input className={inputCls} type="number" min="1" value={form.radiusKm} onChange={set('radiusKm')} />
          </Field>
          <Field label="Affected crop">
            <Input className={inputCls} value={form.crop} onChange={set('crop')} />
          </Field>
        </div>
        <Field label="Alert message">
          <textarea className={`${inputCls} h-20 resize-none`} value={form.message} onChange={set('message')} placeholder="Advisory sent to farmers inside the radius…" />
        </Field>
        <Field label="Schedule broadcast (optional — leave blank for immediate)">
          <Input className={inputCls} type="datetime-local" value={form.schedule} onChange={set('schedule')} />
        </Field>
        <Field label="Administrative reason (recorded in audit log)">
          <Input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. ETL crossed at 3 sentinel traps — confirmed by KVK Nashik" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(form, reason.trim())} disabled={blocked || busy}>
          {busy ? 'Broadcasting…' : 'Broadcast Alert'}
        </Button>
      </div>
    </ModalShell>
  )
}

export function LabResultModal({ open, test, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({ nitrogen: '', phosphorus: '', potassium: '', ph: '', organicCarbon: '', recommendation: '', reportUrl: '' })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setForm({ nitrogen: '', phosphorus: '', potassium: '', ph: '', organicCarbon: '', recommendation: '', reportUrl: '' })
      setReason('')
    }
  }, [open, test])

  if (!open) return null
  const blocked =
    reason.trim().length < 4 ||
    form.nitrogen === '' || form.phosphorus === '' || form.potassium === '' || form.ph === '' ||
    !form.recommendation.trim() || !form.reportUrl.trim()
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <ModalShell
      title="Upload Soil Test Results"
      subtitle={test ? `Sample ${test.sampleCode} for ${test.farmerName} — uploading triggers the NPK recommendation and notifies the farmer.` : ''}
      onClose={onCancel}
    >
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nitrogen (kg/ha)">
            <Input className={inputCls} type="number" value={form.nitrogen} onChange={set('nitrogen')} autoFocus />
          </Field>
          <Field label="Phosphorus (kg/ha)">
            <Input className={inputCls} type="number" value={form.phosphorus} onChange={set('phosphorus')} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Potassium (kg/ha)">
            <Input className={inputCls} type="number" value={form.potassium} onChange={set('potassium')} />
          </Field>
          <Field label="pH">
            <Input className={inputCls} type="number" step="0.1" min="0" max="14" value={form.ph} onChange={set('ph')} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Organic carbon (%)">
            <Input className={inputCls} type="number" step="0.01" value={form.organicCarbon} onChange={set('organicCarbon')} />
          </Field>
          <Field label="Report PDF (storage path / URL)">
            <Input className={inputCls} value={form.reportUrl} onChange={set('reportUrl')} placeholder="gs://agrovercity-soil/2026/st_xxxx.pdf" />
          </Field>
        </div>
        <Field label="NPK recommendation (ICAR)">
          <textarea className={`${inputCls} h-20 resize-none`} value={form.recommendation} onChange={set('recommendation')} placeholder="e.g. Apply 60:80:30 NPK kg/ha split in two doses…" />
        </Field>
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          The farmer is notified automatically once results are uploaded. Values feed the ICAR NPK algorithm and cannot be edited after upload.
        </div>
        <Field label="Administrative reason (recorded in audit log)">
          <Input className={inputCls} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Lab report #MB-2026-1101 verified against sample barcode" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={() => onConfirm(form, reason.trim())} disabled={blocked || busy}>
          {busy ? 'Uploading…' : 'Upload & Notify Farmer'}
        </Button>
      </div>
    </ModalShell>
  )
}
