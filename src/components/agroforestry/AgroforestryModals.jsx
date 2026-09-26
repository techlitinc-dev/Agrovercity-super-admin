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
  Check,
  RotateCcw,
  Layers,
  BookOpen,
  FileText
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Audit Reason & Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter reason for audit record..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-medium mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors active:scale-95 ${
              confirmVariant === 'rose'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-teal-700">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/80">
            <Lock className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] font-mono text-teal-700 font-bold">Dual Admin Sign-off Required (&gt; ₹50,000)</span>
          </div>
        </div>

        <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Subsidy / Outlay Value:</span>
            <span className="font-mono text-teal-800 font-bold">{fmtINR(amount)}</span>
          </div>
          {details && <p className="text-slate-600 text-[11px] leading-relaxed pt-1">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Co-Admin Authorizer Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.forestry@agrovercity.in"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorizer Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorization Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State institutional reason for high-value subsidy release..."
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs active:scale-95 transition-all"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Sprout className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Approve Sapling Request</h3>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Farmer:</span>
            <span className="text-slate-900 font-semibold">{request.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Species:</span>
            <span className="text-slate-900 font-medium">{request.speciesRequested}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Quantity (Max 500 Cap):</span>
            <span className="font-mono text-emerald-800 font-bold">{request.quantity} Saplings</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Land 7/12 Survey:</span>
            <span className="font-mono text-slate-800">{request.surveyNumber712} ({request.district})</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign Partner NGO Nursery</label>
            <select
              value={allocatedNgoId}
              onChange={(e) => setAllocatedNgoId(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} ({ngo.district} • {ngo.currentStock?.toLocaleString()} in stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Approval Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="7/12 land survey and water source verified..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Dispatch Sapling Consignment</h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Dispatching <span className="font-bold text-slate-900">{request.quantity}</span> saplings of <span className="font-bold text-slate-900">{request.speciesRequested}</span> to <span className="font-bold text-slate-900">{request.farmerName}</span> ({request.district}).
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Waybill / Gate Pass Tracking Number *</label>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-purple-700 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Logistics Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Loaded in pickup vehicle MH-12-PQ-4821..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => onDispatch(request.id, trackingNo, notes)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs active:scale-95 transition-all"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
            <Trees className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Record Delivery & Survival Audit</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Field Planting Survival Rate ({survivalRate}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={survivalRate}
              onChange={(e) => setSurvivalRate(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0% (Crop Failure)</span>
              <span className="font-bold text-emerald-700">80% Target</span>
              <span>100% (Full Survival)</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Field Inspection Report</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Geo-tagged photos uploaded. Drip lines installed on time..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => onSave(request.id, survivalRate, notes)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs active:scale-95 transition-all"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Update Biofuel Crop Economics</h3>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">{tree.commonName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Gestation (Years)</label>
            <input
              type="number"
              value={formData.gestationYears}
              onChange={(e) => setFormData({ ...formData, gestationYears: Number(e.target.value) })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Seed Oil Content (%)</label>
            <input
              type="number"
              value={formData.oilContentPercent}
              onChange={(e) => setFormData({ ...formData, oilContentPercent: Number(e.target.value) })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Seed Yield (kg / tree)</label>
            <input
              type="number"
              value={formData.seedYieldKgPerTree}
              onChange={(e) => setFormData({ ...formData, seedYieldKgPerTree: Number(e.target.value) })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Guaranteed Buyback Rate (₹/kg)</label>
            <input
              type="number"
              value={formData.marketRatePerKgINR}
              onChange={(e) => setFormData({ ...formData, marketRatePerKgINR: Number(e.target.value) })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Gross Annual Return / Acre (₹)</label>
            <input
              type="number"
              value={formData.annualGrossReturnPerAcreINR}
              onChange={(e) => setFormData({ ...formData, annualGrossReturnPerAcreINR: Number(e.target.value) })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Buyback Depot Partner</label>
            <input
              type="text"
              value={formData.buybackPartner}
              onChange={(e) => setFormData({ ...formData, buybackPartner: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => onSave(tree.id, formData)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
          >
            Save Economics
          </button>
        </div>
      </div>
    </div>
  )
}

// 7. CREATE / EDIT NGO MODAL
export function CreateEditNgoModal({
  isOpen,
  initialData,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    darpanId: initialData?.darpanId || '',
    trustRegNo: initialData?.trustRegNo || '',
    has80G12A: initialData?.has80G12A ?? true,
    contactPerson: initialData?.contactPerson || '',
    contactPhone: initialData?.contactPhone || '',
    district: initialData?.district || 'Pune',
    headquarters: initialData?.headquarters || '',
    nurseryAcres: initialData?.nurseryAcres || 10,
    annualSaplingCapacity: initialData?.annualSaplingCapacity || 250000,
    currentStock: initialData?.currentStock || 50000,
    status: initialData?.status || 'verified'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('NGO / Nursery name is required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Partner NGO & Nursery' : 'Empanel New Afforestation NGO'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">{error}</div>}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Organization / Trust Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">NGO Darpan ID</label>
              <input
                type="text"
                value={formData.darpanId}
                onChange={(e) => setFormData({ ...formData, darpanId: e.target.value })}
                placeholder="e.g. MH/2026/0129481"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Trust Reg No</label>
              <input
                type="text"
                value={formData.trustRegNo}
                onChange={(e) => setFormData({ ...formData, trustRegNo: e.target.value })}
                placeholder="e.g. E-14920/Pune"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Lead Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nursery Acres</label>
              <input
                type="number"
                value={formData.nurseryAcres}
                onChange={(e) => setFormData({ ...formData, nurseryAcres: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Annual Cap (Saplings)</label>
              <input
                type="number"
                value={formData.annualSaplingCapacity}
                onChange={(e) => setFormData({ ...formData, annualSaplingCapacity: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="80g"
              checked={formData.has80G12A}
              onChange={(e) => setFormData({ ...formData, has80G12A: e.target.checked })}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="80g" className="text-slate-700 font-semibold cursor-pointer">
              80G & 12A Income Tax Exemption Audited & Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Empanel NGO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 8. CREATE / EDIT TREE CARE GUIDE MODAL
export function CreateEditCareGuideModal({
  isOpen,
  initialData,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    species: initialData?.species || 'Melia Dubia (Malabar Neem)',
    spacingMeters: initialData?.spacingMeters || '3m x 3m (440 trees/acre)',
    pitPreparation: initialData?.pitPreparation || 'Pit size 2ft x 2ft x 2ft filled with FYM, SSP and neem cake.',
    irrigationRequirement: initialData?.irrigationRequirement || 'Drip irrigation @ 8L/tree every 3 days during summer.',
    pruningSchedule: initialData?.pruningSchedule || 'Formative pruning up to 8m height during dormancy.',
    pestManagement: initialData?.pestManagement || 'Stem borer preventive pasting with chlorpyriphos or lime sulfur.'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Guide title is required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Tree Care Guide' : 'Publish Tree Care Guide'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">{error}</div>}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Guide Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Tree Species</label>
              <input
                type="text"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Planting Spacing</label>
              <input
                type="text"
                value={formData.spacingMeters}
                onChange={(e) => setFormData({ ...formData, spacingMeters: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Pit Preparation SOP</label>
            <textarea
              rows={2}
              value={formData.pitPreparation}
              onChange={(e) => setFormData({ ...formData, pitPreparation: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Irrigation Schedule</label>
            <textarea
              rows={2}
              value={formData.irrigationRequirement}
              onChange={(e) => setFormData({ ...formData, irrigationRequirement: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Disease & Pest Prevention</label>
            <textarea
              rows={2}
              value={formData.pestManagement}
              onChange={(e) => setFormData({ ...formData, pestManagement: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Publish Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 9. CREATE / EDIT AGROFORESTRY MODEL ARTICLE MODAL
export function CreateEditTreeArticleModal({
  isOpen,
  initialData,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    intercroppingModel: initialData?.intercroppingModel || 'Boundary Plantation (Field Borders)',
    recommendedCrops: initialData?.recommendedCrops ? (Array.isArray(initialData.recommendedCrops) ? initialData.recommendedCrops.join(', ') : initialData.recommendedCrops) : 'Soybean, Turmeric, Pulses',
    annualBenefitPerAcreINR: initialData?.annualBenefitPerAcreINR || 45000,
    carbonCreditsEligible: initialData?.carbonCreditsEligible ?? true,
    author: initialData?.author || ''
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Article title is required.')
      return
    }
    onSave({
      ...formData,
      annualBenefitPerAcreINR: Number(formData.annualBenefitPerAcreINR),
      recommendedCrops: formData.recommendedCrops.split(',').map((c) => c.trim())
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Agroforestry Model' : 'Publish Agroforestry Model'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">{error}</div>}

          <div>
            <label className="block text-slate-700 font-bold mb-1">Model Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Intercropping Pattern / Model</label>
            <input
              type="text"
              value={formData.intercroppingModel}
              onChange={(e) => setFormData({ ...formData, intercroppingModel: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Recommended Intercrop Varieties (Comma separated)</label>
            <input
              type="text"
              value={formData.recommendedCrops}
              onChange={(e) => setFormData({ ...formData, recommendedCrops: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Annual Return / Acre (₹)</label>
              <input
                type="number"
                value={formData.annualBenefitPerAcreINR}
                onChange={(e) => setFormData({ ...formData, annualBenefitPerAcreINR: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Author / Agronomist</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="carbonCredits"
              checked={formData.carbonCreditsEligible}
              onChange={(e) => setFormData({ ...formData, carbonCreditsEligible: e.target.checked })}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="carbonCredits" className="text-slate-700 font-semibold cursor-pointer">
              Eligible for Voluntary Carbon Offset Credits (VCS/Gold Standard)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Publish Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 10. CREATE / EDIT BIOFUEL TREE MODAL
export function CreateEditBiofuelTreeModal({
  isOpen,
  initialData,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    commonName: initialData?.commonName || '',
    botanicalName: initialData?.botanicalName || '',
    gestationYears: initialData?.gestationYears || 4,
    oilContentPercent: initialData?.oilContentPercent || 32,
    seedYieldKgPerTree: initialData?.seedYieldKgPerTree || 25,
    annualGrossReturnPerAcreINR: initialData?.annualGrossReturnPerAcreINR || 75000,
    co2SequestrationKgPerYear: initialData?.co2SequestrationKgPerYear || 25,
    suitableSoil: initialData?.suitableSoil || 'Saline & Degraded Soils',
    buybackPartner: initialData?.buybackPartner || 'HPCL Biofuels',
    marketRatePerKgINR: initialData?.marketRatePerKgINR || 28
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.commonName.trim()) {
      setError('Tree species common name is required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Commercial Biofuel Tree' : 'Add Biofuel Tree Species'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Common Name *</label>
              <input
                type="text"
                value={formData.commonName}
                onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Botanical Name</label>
              <input
                type="text"
                value={formData.botanicalName}
                onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 italic focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Gestation (Yrs)</label>
              <input
                type="number"
                value={formData.gestationYears}
                onChange={(e) => setFormData({ ...formData, gestationYears: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Oil Content (%)</label>
              <input
                type="number"
                value={formData.oilContentPercent}
                onChange={(e) => setFormData({ ...formData, oilContentPercent: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Yield (kg/tree)</label>
              <input
                type="number"
                value={formData.seedYieldKgPerTree}
                onChange={(e) => setFormData({ ...formData, seedYieldKgPerTree: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Gross Return / Acre (₹)</label>
              <input
                type="number"
                value={formData.annualGrossReturnPerAcreINR}
                onChange={(e) => setFormData({ ...formData, annualGrossReturnPerAcreINR: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Buyback Rate (₹/kg)</label>
              <input
                type="number"
                value={formData.marketRatePerKgINR}
                onChange={(e) => setFormData({ ...formData, marketRatePerKgINR: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Buyback Depot Partner</label>
            <input
              type="text"
              value={formData.buybackPartner}
              onChange={(e) => setFormData({ ...formData, buybackPartner: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Save Species'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 11. RESET SEED DATA MODAL
export function ResetSeedModal({
  isOpen,
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('Restoring SOP-21 benchmark dataset for testing and verification.')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is required to reset data.')
      return
    }
    onConfirm(reason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-rose-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
            <RotateCcw className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Reset Agroforestry Benchmark Data</h3>
            <span className="text-[11px] font-mono text-rose-600 font-bold">SOP-21 Target Collections Reset</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          This will restore all 5 Agroforestry collections (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">sapling_requests</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ngos</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">biofuel_trees</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">tree_care_guides</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">tree_articles</code>) back to the official SOP-21 benchmark dataset.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Administrative Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          {error && <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors active:scale-95"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  )
}

// 12. BATCH ACTION MODAL
export function BatchActionModal({
  isOpen,
  title,
  count,
  actionLabel,
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is required for batch state modifications.')
      return
    }
    onConfirm(reason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-emerald-700">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <Layers className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">Affecting {count} selected records</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          You are about to execute a bulk transition on <strong className="text-slate-900">{count}</strong> records simultaneously. This batch action will be logged in the immutable audit trail.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Audit Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="State policy rationale for this bulk change..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors active:scale-95"
          >
            {actionLabel || 'Apply Batch Action'}
          </button>
        </div>
      </div>
    </div>
  )
}
