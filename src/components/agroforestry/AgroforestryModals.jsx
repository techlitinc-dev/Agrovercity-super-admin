import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sprout,
  Truck,
  Building2,
  Fuel,
  Trees,
  Check
} from 'lucide-react'
import { fmtINR } from '../../pages/agroforestryWidgets'

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
            placeholder="Enter reason for audit record..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
          />
          {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
          >
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
      setError('Authorizing co-admin email, passcode, and audit justification are mandatory.')
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
            <span className="text-[11px] font-mono text-purple-400">Dual Admin Sign-off Required (&gt; ₹50,000)</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between font-medium text-slate-200">
            <span>Subsidy / Outlay Value:</span>
            <span className="font-mono text-purple-300 font-bold">{fmtINR(amount)}</span>
          </div>
          {details && <p className="text-slate-300 text-[11px]">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Co-Admin Authorizer Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.forestry@agrovercity.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Authorizer Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Authorization Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State institutional reason for high-value subsidy release..."
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
          >
            Authorize Dual Sign-Off
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. APPROVE SAPLING REQUEST MODAL (Enforces Max 500 Cap)
export function ApproveSaplingModal({
  isOpen,
  request,
  ngos = [],
  onClose,
  onApprove
}) {
  const [allocatedNgoId, setAllocatedNgoId] = useState(request?.allocatedNgoId || (ngos[0]?.id || 'ngo_01'))
  const [notes, setNotes] = useState('')

  if (!isOpen || !request) return null

  const selectedNgo = ngos.find((n) => n.id === allocatedNgoId) || ngos[0]

  const handleConfirm = () => {
    onApprove(request.id, {
      allocatedNgoId,
      allocatedNgoName: selectedNgo?.name || 'Partner Nursery',
      reason: notes || `Approved ${request.quantity} saplings allocation via ${selectedNgo?.name}`
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Approve Sapling Request</h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Farmer:</span>
            <span className="text-slate-200 font-medium">{request.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Species:</span>
            <span className="text-slate-200">{request.speciesRequested}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Quantity (Max 500 Cap):</span>
            <span className="font-mono text-emerald-400 font-bold">{request.quantity} Saplings</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Land 7/12 Survey:</span>
            <span className="font-mono text-slate-300">{request.surveyNumber712} ({request.district})</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Assign Partner NGO Nursery</label>
            <select
              value={allocatedNgoId}
              onChange={(e) => setAllocatedNgoId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} ({ngo.district} • {ngo.currentStock?.toLocaleString()} in stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Approval Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="7/12 land survey and water source verified..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. DISPATCH SAPLINGS MODAL
export function DispatchSaplingModal({
  isOpen,
  request,
  onClose,
  onDispatch
}) {
  const [trackingNo, setTrackingNo] = useState(`TRK-MH-AGRO-${Math.floor(1000 + Math.random() * 9000)}`)
  const [notes, setNotes] = useState('')

  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Dispatch Sapling Consignment</h3>
        </div>

        <p className="text-xs text-slate-300">
          Dispatching {request.quantity} saplings of {request.speciesRequested} to {request.farmerName} ({request.district}).
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Waybill / Gate Pass Tracking Number *</label>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-purple-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Logistics Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Loaded in pickup vehicle MH-12-PQ-4821..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => onDispatch(request.id, trackingNo, notes)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
          >
            Confirm Dispatch
          </button>
        </div>
      </div>
    </div>
  )
}

// 5. RECORD DELIVERY & SURVIVAL MODAL
export function RecordDeliverySurvivalModal({
  isOpen,
  request,
  onClose,
  onSave
}) {
  const [survivalRate, setSurvivalRate] = useState(request?.survivalRatePercent || 90)
  const [notes, setNotes] = useState('')

  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Trees className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Record Delivery & Survival Audit</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Field Planting Survival Rate ({survivalRate}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={survivalRate}
              onChange={(e) => setSurvivalRate(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0% (Crop Failure)</span>
              <span>80% Target</span>
              <span>100% (Full Survival)</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Field Inspection Report</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Geo-tagged photos uploaded. Drip lines installed on time..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => onSave(request.id, survivalRate, notes)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500"
          >
            Mark Delivered
          </button>
        </div>
      </div>
    </div>
  )
}

// 6. EDIT BIOFUEL ECONOMICS MODAL
export function EditBiofuelEconomicsModal({
  isOpen,
  tree,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    gestationYears: tree?.gestationYears || 4,
    oilContentPercent: tree?.oilContentPercent || 30,
    seedYieldKgPerTree: tree?.seedYieldKgPerTree || 40,
    annualGrossReturnPerAcreINR: tree?.annualGrossReturnPerAcreINR || 80000,
    marketRatePerKgINR: tree?.marketRatePerKgINR || 25,
    buybackPartner: tree?.buybackPartner || ''
  })

  if (!isOpen || !tree) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Update Biofuel Crop Economics</h3>
            <span className="text-[11px] font-mono text-emerald-400">{tree.commonName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Gestation (Years)</label>
            <input
              type="number"
              value={formData.gestationYears}
              onChange={(e) => setFormData({ ...formData, gestationYears: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Seed Oil Content (%)</label>
            <input
              type="number"
              value={formData.oilContentPercent}
              onChange={(e) => setFormData({ ...formData, oilContentPercent: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Seed Yield (kg / tree)</label>
            <input
              type="number"
              value={formData.seedYieldKgPerTree}
              onChange={(e) => setFormData({ ...formData, seedYieldKgPerTree: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Guaranteed Buyback Rate (₹/kg)</label>
            <input
              type="number"
              value={formData.marketRatePerKgINR}
              onChange={(e) => setFormData({ ...formData, marketRatePerKgINR: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium text-slate-300 mb-1">Gross Annual Return / Acre (₹)</label>
            <input
              type="number"
              value={formData.annualGrossReturnPerAcreINR}
              onChange={(e) => setFormData({ ...formData, annualGrossReturnPerAcreINR: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-medium text-slate-300 mb-1">Buyback Depot Partner</label>
            <input
              type="text"
              value={formData.buybackPartner}
              onChange={(e) => setFormData({ ...formData, buybackPartner: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => onSave(tree.id, formData)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
          >
            Save Economics
          </button>
        </div>
      </div>
    </div>
  )
}
