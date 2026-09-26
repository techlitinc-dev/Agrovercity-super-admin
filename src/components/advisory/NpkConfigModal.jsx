import { useEffect, useState } from 'react'
import { Satellite, ShieldCheck, AlertTriangle, Cpu, Save } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function NpkConfigModal({ open, config, busy, onConfirm, onCancel }) {
  const [params, setParams] = useState([])
  const [algorithmVersion, setAlgorithmVersion] = useState('')
  const [reviewedBy, setReviewedBy] = useState('')
  const [complianceStandard, setComplianceStandard] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && config) {
      setParams(config.params ? JSON.parse(JSON.stringify(config.params)) : [])
      setAlgorithmVersion(config.algorithmVersion || 'icar-npk-v2.4')
      setReviewedBy(config.reviewedBy || 'Dr. R. K. Sharma (ICAR Advisor)')
      setComplianceStandard(config.complianceStandard || 'ICAR STCR Framework')
      setReason('')
    }
  }, [open, config])

  if (!open) return null

  const isBlocked = reason.trim().length < 4 || params.some(p => isNaN(Number(p.value)))

  const handleParamChange = (index, val) => {
    setParams(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], value: Number(val) }
      return copy
    })
  }

  const handleSave = () => {
    onConfirm({
      algorithmVersion,
      reviewedBy,
      complianceStandard,
      params,
    }, reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">ICAR Soil Test Crop Response (STCR) Configuration</h3>
              <p className="text-xs text-slate-500">
                Calibrate fertilizer dosage calculation coefficients and statutory ICAR compliance constants.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" /> ICAR Certified
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <Field label="Algorithm Version">
              <Input
                className={inputCls}
                value={algorithmVersion}
                onChange={(e) => setAlgorithmVersion(e.target.value)}
                placeholder="e.g. icar-npk-v2.5"
              />
            </Field>

            <Field label="Certifying Agronomist / ICAR Advisor">
              <Input
                className={inputCls}
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
                placeholder="e.g. Dr. R. K. Sharma (ICAR Advisor)"
              />
            </Field>

            <div className="col-span-2">
              <Field label="Statutory Framework Standard">
                <Input
                  className={inputCls}
                  value={complianceStandard}
                  onChange={(e) => setComplianceStandard(e.target.value)}
                  placeholder="e.g. ICAR STCR (Soil Test Crop Response) Framework 2024"
                />
              </Field>
            </div>
          </div>

          {/* Model Parameters List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              STCR Mathematical Coefficients
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {params.map((p, idx) => (
                <div key={p.key} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">{p.label}</label>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">{p.unit || 'coefficient'}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{p.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={p.value}
                      onChange={(e) => handleParamChange(idx, e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Changes directly alter fertilizer dosage recommendations delivered to farmers on soil health cards across all automated lab uploads.
            </span>
          </div>

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Updated STCR target yield factor in accordance with ICAR Western Maharashtra Agro-Zone 2026 circular"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={handleSave} disabled={isBlocked || busy}>
            <Save className="h-4 w-4 mr-1.5" />
            {busy ? 'Saving Configuration...' : 'Save & Calibrate Engine'}
          </Button>
        </div>
      </div>
    </div>
  )
}
