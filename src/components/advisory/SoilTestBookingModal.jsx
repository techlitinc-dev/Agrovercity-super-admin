import { useState } from 'react'
import { TestTube2, AlertTriangle, Send } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function SoilTestBookingModal({ open, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    farmerName: '',
    farmerPhone: '',
    district: 'Nashik',
    surveyNo: '',
    crop: 'Pomegranate',
    labName: 'MahaSoil Central Lab Nashik',
  })
  const [reason, setReason] = useState('')

  if (!open) return null

  const isBlocked =
    reason.trim().length < 4 ||
    !form.farmerName.trim() ||
    !form.farmerPhone.trim() ||
    !form.surveyNo.trim()

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleBooking = () => {
    onConfirm(form, reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <TestTube2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Book Soil Sample Collection</h3>
            <p className="text-xs text-slate-500">
              Dispatches an Agrovercity field representative with GPS sampling kit to collect soil core samples.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Farmer Full Name">
              <Input
                className={inputCls}
                value={form.farmerName}
                onChange={set('farmerName')}
                placeholder="e.g. Ramesh Baburao Kadam"
                autoFocus
              />
            </Field>

            <Field label="Farmer Mobile Number">
              <Input
                className={inputCls}
                value={form.farmerPhone}
                onChange={set('farmerPhone')}
                placeholder="+91 98220 12345"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="District">
              <select className={inputCls} value={form.district} onChange={set('district')}>
                <option value="Nashik">Nashik</option>
                <option value="Pune">Pune</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Solapur">Solapur</option>
                <option value="Jalgaon">Jalgaon</option>
                <option value="Satara">Satara</option>
              </select>
            </Field>

            <Field label="Plot Survey / Gat Number">
              <Input
                className={inputCls}
                value={form.surveyNo}
                onChange={set('surveyNo')}
                placeholder="e.g. 142/2B"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Intended Crop / Cultivar">
              <Input
                className={inputCls}
                value={form.crop}
                onChange={set('crop')}
                placeholder="e.g. Onion / Grapes"
              />
            </Field>

            <Field label="Accredited Testing Laboratory">
              <select className={inputCls} value={form.labName} onChange={set('labName')}>
                <option value="MahaSoil Central Lab Nashik">MahaSoil Central Lab Nashik</option>
                <option value="KVK Baramati Agrochemical Lab">KVK Baramati Agrochemical Lab</option>
                <option value="MPKV Rahuri Soil Department">MPKV Rahuri Soil Department</option>
                <option value="AgroVeda Analytical Labs Pune">AgroVeda Analytical Labs Pune</option>
              </select>
            </Field>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
            <TestTube2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Generates a unique QR sample tracking code. Field agent must log GPS coordinates upon core collection.
            </span>
          </div>

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Pre-sowing nutrient audit requested under FPO Cluster Subvention Scheme"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={handleBooking} disabled={isBlocked || busy}>
            <Send className="h-4 w-4 mr-1.5" />
            {busy ? 'Booking...' : 'Book & Dispatch Sample Kit'}
          </Button>
        </div>
      </div>
    </div>
  )
}
