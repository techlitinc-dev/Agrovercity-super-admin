import { useEffect, useState } from 'react'
import { Sliders, AlertTriangle, ArrowRight } from 'lucide-react'
import { Button, Field, Input } from '../ui'

const inputCls = 'w-full rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans'

export default function CropSubstitutionModal({ open, cycle, busy, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    targetMarketCapacityAcres: 30000,
    recommendedSubstitution: '',
    expectedYieldPerAcre: '',
    priceRiskStatus: 'critical_oversupply',
    bulletinNotes: ''
  })
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && cycle) {
      setForm({
        targetMarketCapacityAcres: cycle.targetMarketCapacityAcres || 30000,
        recommendedSubstitution: cycle.recommendedSubstitution || '',
        expectedYieldPerAcre: cycle.expectedYieldPerAcre || '',
        priceRiskStatus: cycle.priceRiskStatus || 'critical_oversupply',
        bulletinNotes: `Diversification advisory issued for ${cycle.district} due to market saturation index exceeding threshold.`
      })
      setReason('')
    }
  }, [open, cycle])

  if (!open || !cycle) return null

  const isBlocked = reason.trim().length < 4 || !form.recommendedSubstitution.trim()
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const calculatedSaturation = Math.round((cycle.acreageSown / (Number(form.targetMarketCapacityAcres) || 1)) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Calibrate Crop Substitution & Capacity</h3>
            <p className="text-xs text-slate-500">
              Cycle #{cycle.id} · {cycle.crop} ({cycle.district} - {cycle.season})
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Current Live Metrics */}
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
            <div>
              <span className="text-slate-500">Current Acreage Sown:</span>
              <p className="font-mono font-bold text-slate-900">{cycle.acreageSown.toLocaleString('en-IN')} Acres</p>
            </div>
            <div>
              <span className="text-slate-500">Calculated Saturation:</span>
              <p className={`font-mono font-bold ${calculatedSaturation > 110 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {calculatedSaturation}%
              </p>
            </div>
          </div>

          <Field label="Target Market Capacity (Acres)">
            <Input
              className={inputCls}
              type="number"
              value={form.targetMarketCapacityAcres}
              onChange={set('targetMarketCapacityAcres')}
              placeholder="e.g. 35000"
            />
          </Field>

          <Field label="AI Recommended Substitute Crop / Variety">
            <Input
              className={inputCls}
              value={form.recommendedSubstitution}
              onChange={set('recommendedSubstitution')}
              placeholder="e.g. Chickpea (Vijay) / Soybean (JS-335)"
              autoFocus
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected Substitute Yield">
              <Input
                className={inputCls}
                value={form.expectedYieldPerAcre}
                onChange={set('expectedYieldPerAcre')}
                placeholder="e.g. 14 Quintals/Acre"
              />
            </Field>

            <Field label="Price Risk Status">
              <select
                className={inputCls}
                value={form.priceRiskStatus}
                onChange={set('priceRiskStatus')}
              >
                <option value="critical_oversupply">Critical Oversupply</option>
                <option value="moderate_risk">Moderate Risk</option>
                <option value="balanced">Balanced</option>
                <option value="high_demand">High Demand / Deficit</option>
              </select>
            </Field>
          </div>

          <Field label="Farmer Advisory Bulletin Notes">
            <textarea
              className={`${inputCls} h-20 resize-none`}
              value={form.bulletinNotes}
              onChange={set('bulletinNotes')}
              placeholder="Guidance published to farmers dashboard and extension workers..."
            />
          </Field>

          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Updating this model publishes revised sowing recommendations across the AGROVERCITY Farmer App and KVK extension networks in {cycle.district}.
            </span>
          </div>

          <Field label="Administrative Reason (Mandatory for Audit Trail)">
            <Input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. APMC arrival surplus forecast indicates 22% price slump; recommending pulse rotation"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-emerald-100 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button
            onClick={() => onConfirm(cycle.id, form, reason.trim())}
            disabled={isBlocked || busy}
          >
            {busy ? 'Saving Changes...' : 'Save & Publish Calibration'}
          </Button>
        </div>
      </div>
    </div>
  )
}
