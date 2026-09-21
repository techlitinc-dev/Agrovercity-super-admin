import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  Lock,
  Warehouse,
  Sprout,
  ScanEye,
  CheckCircle2,
  Thermometer,
  Droplets,
  CalendarCheck,
  ShieldCheck
} from 'lucide-react'
import { fmtINR } from '../../pages/climateWidgets'

// 1. REASON CONFIRMATION MODAL
export function AuditReasonModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'rose',
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is required for the immutable audit log.')
      return
    }
    onConfirm(reason)
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-400">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Audit Reason & Justification <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter policy rationale or incident details..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
          />
          {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
              confirmVariant === 'rose' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// 2. DUAL SIGN-OFF MODAL (> ₹50,000)
export function DualSignOffModal({
  isOpen,
  title,
  amount,
  details,
  onClose,
  onConfirm
}) {
  const [secondAdminEmail, setSecondAdminEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!secondAdminEmail.trim() || !passcode.trim() || !reason.trim()) {
      setError('Co-admin authorizer email, passcode, and audit justification are mandatory.')
      return
    }
    onConfirm({ secondAdminEmail, reason })
    setSecondAdminEmail('')
    setPasscode('')
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-purple-400">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <span className="text-[11px] font-mono text-purple-400">Dual Admin Sign-off Required (&gt; ₹50,000 Threshold)</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between font-medium text-slate-200">
            <span>High-Value Financial Execution:</span>
            <span className="font-mono text-purple-300 font-bold">{fmtINR(amount)}</span>
          </div>
          {details && <p className="text-slate-300 text-[11px]">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Authorizing Co-Admin Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.compliance@agrovercity.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Passcode / Cryptographic Token *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Audit Rationale *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Institutional justification for financial payout or refund..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm"
          >
            Authorize & Execute
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. ONBOARD / EDIT COLD STORAGE FACILITY MODAL
export function CreateEditFacilityModal({
  isOpen,
  facility = null,
  onClose,
  onSave
}) {
  const [form, setForm] = useState(
    facility || {
      name: '',
      operatorName: '',
      operatorPhone: '+91 98XXX XX',
      district: 'Nashik',
      state: 'Maharashtra',
      address: '',
      totalCapacityMt: 3000,
      chambersCount: 6,
      tempRangeMin: 0,
      tempRangeMax: 4,
      humidityMin: 85,
      humidityMax: 95,
      monthlyRatePerMt: 1200,
      monthlyRatePerQuintal: 120,
      supportedCrops: 'Grapes, Pomegranate, Onions',
      fssaiLicense: 'FSSAI-11524098000',
      powerBackup: 'Solar Hybrid + 250kVA DG',
      caChamberEnabled: true,
      status: 'active'
    }
  )
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.district.trim() || !form.totalCapacityMt) {
      setError('Facility name, district, and total capacity MT are required.')
      return
    }

    const payload = {
      ...form,
      totalCapacityMt: Number(form.totalCapacityMt),
      chambersCount: Number(form.chambersCount),
      tempRangeMin: Number(form.tempRangeMin),
      tempRangeMax: Number(form.tempRangeMax),
      humidityMin: Number(form.humidityMin),
      humidityMax: Number(form.humidityMax),
      monthlyRatePerMt: Number(form.monthlyRatePerMt),
      monthlyRatePerQuintal: Number(form.monthlyRatePerQuintal),
      supportedCrops: typeof form.supportedCrops === 'string'
        ? form.supportedCrops.split(',').map((c) => c.trim()).filter(Boolean)
        : form.supportedCrops
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Warehouse className="w-5 h-5 text-blue-400" />
            <span>{facility ? 'Edit Cold Storage Facility' : 'Onboard New Cold Chain Hub'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Facility Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Sahyadri Agro Mega Cold Hub"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/60"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">District / Region *</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="e.g. Nashik, Pune, Solapur"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500/60"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Operator Name</label>
              <input
                type="text"
                value={form.operatorName}
                onChange={(e) => setForm({ ...form, operatorName: e.target.value })}
                placeholder="e.g. Kailas Shinde"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Operator Phone (Masked)</label>
              <input
                type="text"
                value={form.operatorPhone}
                onChange={(e) => setForm({ ...form, operatorPhone: e.target.value })}
                placeholder="+91 98XXX XX412"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">FSSAI License No</label>
              <input
                type="text"
                value={form.fssaiLicense}
                onChange={(e) => setForm({ ...form, fssaiLicense: e.target.value })}
                placeholder="FSSAI-11524..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Total Cap (MT) *</label>
              <input
                type="number"
                value={form.totalCapacityMt}
                onChange={(e) => setForm({ ...form, totalCapacityMt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Chambers Count</label>
              <input
                type="number"
                value={form.chambersCount}
                onChange={(e) => setForm({ ...form, chambersCount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Temp Min (°C)</label>
              <input
                type="number"
                value={form.tempRangeMin}
                onChange={(e) => setForm({ ...form, tempRangeMin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Temp Max (°C)</label>
              <input
                type="number"
                value={form.tempRangeMax}
                onChange={(e) => setForm({ ...form, tempRangeMax: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Rate / MT / Month (₹)</label>
              <input
                type="number"
                value={form.monthlyRatePerMt}
                onChange={(e) => setForm({ ...form, monthlyRatePerMt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Power Backup</label>
              <input
                type="text"
                value={form.powerBackup}
                onChange={(e) => setForm({ ...form, powerBackup: e.target.value })}
                placeholder="Solar Hybrid + DG"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Operational Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="active">Active</option>
                <option value="near_capacity">Near Capacity</option>
                <option value="maintenance">Maintenance</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Supported Commodities (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(form.supportedCrops) ? form.supportedCrops.join(', ') : form.supportedCrops}
              onChange={(e) => setForm({ ...form, supportedCrops: e.target.value })}
              placeholder="Grapes, Pomegranate, Onions, Citrus"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm"
            >
              {facility ? 'Save Changes' : 'Onboard Partner Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 4. CREATE / EDIT CLIMATE VARIETY MODAL
export function CreateEditVarietyModal({
  isOpen,
  variety = null,
  onClose,
  onSave
}) {
  const [form, setForm] = useState(
    variety || {
      cropName: '',
      varietyCode: '',
      commonName: '',
      resilienceType: 'drought_tolerant',
      certifyingAgency: 'ICAR-IARI & State Agri Univ',
      maturityDays: '90-100 days',
      averageYieldQtlPerHa: '28-32',
      waterRequirementMm: '400-500',
      recommendedRegions: 'Marathwada, Vidarbha',
      suitableSoil: 'Black cotton / loamy',
      status: 'certified'
    }
  )
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.cropName.trim() || !form.varietyCode.trim()) {
      setError('Crop name and variety code are required.')
      return
    }

    const payload = {
      ...form,
      recommendedRegions: typeof form.recommendedRegions === 'string'
        ? form.recommendedRegions.split(',').map((r) => r.trim()).filter(Boolean)
        : form.recommendedRegions
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>{variety ? 'Edit Resilient Variety' : 'Register Certified Climate Variety'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Crop Name *</label>
              <input
                type="text"
                value={form.cropName}
                onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                placeholder="e.g. Soybean, Wheat, Bajra"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Variety Code *</label>
              <input
                type="text"
                value={form.varietyCode}
                onChange={(e) => setForm({ ...form, varietyCode: e.target.value })}
                placeholder="e.g. NRC-142"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Resilience Trait</label>
              <select
                value={form.resilienceType}
                onChange={(e) => setForm({ ...form, resilienceType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="drought_tolerant">Drought Resilient</option>
                <option value="heat_resilient">Heat Hardy</option>
                <option value="flood_tolerant">Flood Submergence</option>
                <option value="saline_tolerant">Saline-Alkali Hardy</option>
                <option value="pest_resistant">Biotic Resistant</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Certification Agency</label>
              <input
                type="text"
                value={form.certifyingAgency}
                onChange={(e) => setForm({ ...form, certifyingAgency: e.target.value })}
                placeholder="e.g. ICAR-IISR Indore"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Maturity Days</label>
              <input
                type="text"
                value={form.maturityDays}
                onChange={(e) => setForm({ ...form, maturityDays: e.target.value })}
                placeholder="90-95 days"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Yield (Qtl/Ha)</label>
              <input
                type="text"
                value={form.averageYieldQtlPerHa}
                onChange={(e) => setForm({ ...form, averageYieldQtlPerHa: e.target.value })}
                placeholder="28-32"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Water Need (mm)</label>
              <input
                type="text"
                value={form.waterRequirementMm}
                onChange={(e) => setForm({ ...form, waterRequirementMm: e.target.value })}
                placeholder="400-450"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Recommended Regions (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(form.recommendedRegions) ? form.recommendedRegions.join(', ') : form.recommendedRegions}
              onChange={(e) => setForm({ ...form, recommendedRegions: e.target.value })}
              placeholder="Vidarbha, Marathwada, Solapur"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-sm"
            >
              {variety ? 'Save Changes' : 'Register Variety'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. OVERRIDE AI GRADING MODAL
export function OverrideGradingModal({
  isOpen,
  grading = null,
  onClose,
  onConfirm
}) {
  const [manualGrade, setManualGrade] = useState('Grade B (Domestic Premium)')
  const [overrideNote, setOverrideNote] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !grading) return null

  const handleConfirm = () => {
    if (!overrideNote.trim() || !reason.trim()) {
      setError('Both calibration curve note and audit reason are required.')
      return
    }
    onConfirm({ manualGrade, overrideNote, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-white font-bold">
          <ScanEye className="w-5 h-5 text-purple-400" />
          <span>Manual Produce Quality Override</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1 font-mono">
          <div className="flex justify-between text-slate-300">
            <span>Commodity:</span>
            <span className="text-white font-bold">{grading.commodity}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>AI Predicted Grade:</span>
            <span className="text-amber-400">{grading.aiPredictedGrade}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Defects / Confidence:</span>
            <span>{grading.surfaceDefectsPct}% / {grading.confidenceScore}%</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Calibrated Target Grade *</label>
            <select
              value={manualGrade}
              onChange={(e) => setManualGrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              <option value="Grade A (Export Quality)">Grade A (Export Quality)</option>
              <option value="Grade B (Domestic Premium)">Grade B (Domestic Premium)</option>
              <option value="Grade C (Processing / Industrial)">Grade C (Processing / Industrial)</option>
              <option value="Rejected / Sub-standard">Rejected / Sub-standard</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Optical Inspection Calibration Note *</label>
            <input
              type="text"
              value={overrideNote}
              onChange={(e) => setOverrideNote(e.target.value)}
              placeholder="e.g. Surface shadow anomaly; brix refractometer reading 16.5°"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Immutable Audit Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Administrative justification for overriding AI model..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm"
          >
            Confirm Calibration Override
          </button>
        </div>
      </div>
    </div>
  )
}

// 6. ALLOCATE COLD CHAMBER MODAL
export function ChamberAllocationModal({
  isOpen,
  booking = null,
  onClose,
  onConfirm
}) {
  const [chamber, setChamber] = useState('Chamber A-1 (Controlled Atmosphere)')
  const [reason, setReason] = useState('Intake slot verified; chamber sanitization passed')
  const [error, setError] = useState('')

  if (!isOpen || !booking) return null

  const handleConfirm = () => {
    if (!chamber.trim()) {
      setError('Chamber designation is required.')
      return
    }
    onConfirm({ chamberAllocated: chamber, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-white font-bold">
          <CalendarCheck className="w-5 h-5 text-blue-400" />
          <span>Allocate Physical Cold Chamber</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Booking ID:</span>
            <span className="font-mono text-emerald-400 font-bold">{booking.id}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Farmer & Commodity:</span>
            <span className="text-white">{booking.farmerName} · {booking.cropType}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Quantity:</span>
            <span className="font-bold text-white">{booking.quantityMt} MT</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Chamber Designation *</label>
            <input
              type="text"
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              placeholder="e.g. Chamber C-3 (Cold Bay A)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Allocation Note / Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Intake verification notes..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm"
          >
            Confirm Allocation
          </button>
        </div>
      </div>
    </div>
  )
}
