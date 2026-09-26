import { useEffect, useState } from 'react'
import { Award, AlertTriangle, Save, Check } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function ExpertModal({ open, expert, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    organization: 'KVK Nashik',
    specialization: 'Plant Pathology',
    languages: ['mr', 'hi'],
    channels: ['whatsapp', 'chat'],
    experienceYears: 10,
    available: true
  })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      if (expert) {
        setForm({
          id: expert.id,
          name: expert.name || '',
          organization: expert.organization || 'KVK Nashik',
          specialization: expert.specialization || 'Plant Pathology',
          languages: expert.languages || ['mr', 'hi'],
          channels: expert.channels || ['whatsapp', 'chat'],
          experienceYears: expert.experienceYears || 10,
          available: expert.available !== undefined ? expert.available : true
        })
      } else {
        setForm({
          name: '',
          organization: 'KVK Nashik',
          specialization: 'Plant Pathology',
          languages: ['mr', 'hi'],
          channels: ['whatsapp', 'chat'],
          experienceYears: 8,
          available: true
        })
      }
      setReason('')
    }
  }, [open, expert])

  if (!open) return null

  const isBlocked = reason.trim().length < 4 || !form.name.trim() || !form.specialization.trim()
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleLangToggle = (lang) => {
    setForm(prev => {
      const langs = prev.languages || []
      if (langs.includes(lang)) {
        return { ...prev, languages: langs.filter(l => l !== lang) }
      } else {
        return { ...prev, languages: [...langs, lang] }
      }
    })
  }

  const handleChannelToggle = (channel) => {
    setForm(prev => {
      const channels = prev.channels || []
      if (channels.includes(channel)) {
        return { ...prev, channels: channels.filter(c => c !== channel) }
      } else {
        return { ...prev, channels: [...channels, channel] }
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {expert ? `Edit Expert Profile #${expert.id}` : 'Register Certified KVK Agronomist'}
            </h3>
            <p className="text-xs text-slate-500">
              Certified agricultural specialist authorized to receive high-priority farmer escalation handoffs.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Full Name & Title">
            <Input
              className={inputCls}
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Dr. Anjali Deshmukh"
              autoFocus
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="KVK Center / Affiliation">
              <select className={inputCls} value={form.organization} onChange={set('organization')}>
                <option value="KVK Nashik">KVK Nashik</option>
                <option value="KVK Baramati">KVK Baramati</option>
                <option value="KVK Pune">KVK Pune</option>
                <option value="KVK Jalgaon">KVK Jalgaon</option>
                <option value="KVK Ahmednagar">KVK Ahmednagar</option>
                <option value="MPKV Rahuri">MPKV Rahuri</option>
              </select>
            </Field>

            <Field label="Specialization">
              <select className={inputCls} value={form.specialization} onChange={set('specialization')}>
                <option value="Plant Pathology">Plant Pathology</option>
                <option value="Agronomy & Market Intelligence">Agronomy & Market Intelligence</option>
                <option value="Soil Science & NPK">Soil Science & NPK</option>
                <option value="Entomology (Pest Radar)">Entomology (Pest Radar)</option>
                <option value="Horticulture (Fruit Crops)">Horticulture (Fruit Crops)</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Experience (Years)">
              <Input
                className={inputCls}
                type="number"
                min="1"
                value={form.experienceYears}
                onChange={set('experienceYears')}
              />
            </Field>

            <Field label="Initial Availability">
              <select
                className={inputCls}
                value={form.available ? 'true' : 'false'}
                onChange={(e) => setForm(prev => ({ ...prev, available: e.target.value === 'true' }))}
              >
                <option value="true">Available (On Triage Duty)</option>
                <option value="false">Busy / Off Duty</option>
              </select>
            </Field>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">Supported Languages</label>
            <div className="flex gap-2">
              {[
                { id: 'mr', label: 'Marathi' },
                { id: 'hi', label: 'Hindi' },
                { id: 'en', label: 'English' }
              ].map(l => (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => handleLangToggle(l.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                    (form.languages || []).includes(l.id)
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 mb-1.5 block">Contact Channels</label>
            <div className="flex gap-2">
              {[
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'chat', label: 'In-App Chat' },
                { id: 'ivr', label: 'IVR Voice Call' }
              ].map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleChannelToggle(c.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                    (form.channels || []).includes(c.id)
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Onboarded following ICAR certification verification and KVK agreement"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button
            onClick={() => onConfirm(form, reason.trim())}
            disabled={isBlocked || busy}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {busy ? 'Saving...' : expert ? 'Update Profile' : 'Register Expert'}
          </Button>
        </div>
      </div>
    </div>
  )
}
