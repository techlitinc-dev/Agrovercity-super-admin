import React, { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  Lock,
  Coins,
  Play,
  Sliders,
  CheckCircle2,
  DollarSign,
  FileText,
  RotateCcw,
  Layers
} from 'lucide-react'
import { fmtINR } from '../../pages/settlementsWidgets'

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
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Audit Reason & Rationale <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter policy rationale or dispute context..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
              confirmVariant === 'rose'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] font-bold text-purple-700 font-mono">Dual Executive Sign-off (&gt; ₹50,000 Threshold)</span>
          </div>
        </div>

        <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-900">
            <span>High-Value Settlement Net Disbursement:</span>
            <span className="font-mono text-purple-700 font-bold text-sm">{fmtINR(amount)}</span>
          </div>
          {details && <p className="text-slate-600 text-[11px] leading-relaxed">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorizing Financial Auditor Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. auditor.finance@agrovercity.in"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cryptographic Token / Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Auditor Sign-off Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Audit rationale verifying bank account match and zero active disputes..."
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-xs"
          >
            Authorize & Execute Disburse
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. MARK SETTLEMENT PAID MODAL
export function MarkPaidModal({
  isOpen,
  settlement = null,
  onClose,
  onConfirm
}) {
  const [paymentChannel, setPaymentChannel] = useState('razorpayx')
  const [utr, setUtr] = useState(`RZPX2609${Math.floor(100000 + Math.random() * 900000)}`)
  const [reason, setReason] = useState('Disbursed via RazorpayX instant bulk payout gateway')
  const [error, setError] = useState('')

  useEffect(() => {
    if (paymentChannel === 'razorpayx') {
      setUtr(`RZPX2609${Math.floor(100000 + Math.random() * 900000)}`)
      setReason('Disbursed via RazorpayX instant payout gateway')
    } else if (paymentChannel === 'neft') {
      setUtr(`NEFT2609${Math.floor(100000 + Math.random() * 900000)}`)
      setReason('Disbursed via Corporate Bank NEFT / RTGS Host-to-Host transfer')
    } else {
      setUtr(`CORP2609${Math.floor(100000 + Math.random() * 900000)}`)
      setReason('Direct corporate treasury internet banking transfer')
    }
  }, [paymentChannel])

  if (!isOpen || !settlement) return null

  const handleConfirm = () => {
    if (!utr.trim()) {
      setError('Bank reference / UTR number is mandatory.')
      return
    }
    onConfirm({ paymentReferenceUtr: utr, reason, paymentChannel })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Coins className="w-5 h-5 text-emerald-600" />
          <span>Mark Settlement Batch Disbursed</span>
        </div>

        <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3.5 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Batch ID:</span>
            <span className="font-mono text-emerald-800 font-bold">{settlement.batchId}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Beneficiary:</span>
            <span className="text-slate-900 font-bold">{settlement.beneficiaryName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Bank & Masked Account:</span>
            <span className="font-mono text-slate-800 font-medium">{settlement.bankName} ({settlement.accountNumberMasked})</span>
          </div>
          <div className="flex justify-between text-slate-700 pt-1.5 border-t border-emerald-100/80 font-bold">
            <span className="text-slate-900">Net Payout Amount:</span>
            <span className="text-emerald-700 font-mono text-sm">{fmtINR(settlement.netPayoutInr)}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Disbursement Channel / Gateway</label>
            <select
              value={paymentChannel}
              onChange={(e) => setPaymentChannel(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="razorpayx">RazorpayX Instant IMPS / Corporate API</option>
              <option value="neft">Direct Bank NEFT / RTGS (Host-to-Host)</option>
              <option value="corporate_netbanking">Corporate Treasury Internet Banking</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bank Reference / UTR Number *</label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. RZPX260920881923"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Reference Note</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            Confirm Bank Disburse
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. TRIGGER MANUAL BATCH RUN MODAL (WITH CUSTOM START/END PERIODS)
export function TriggerBatchRunModal({
  isOpen,
  onClose,
  onConfirm
}) {
  const [periodPreset, setPeriodPreset] = useState('weekly')
  const [startDate, setStartDate] = useState('2026-09-14')
  const [endDate, setEndDate] = useState('2026-09-20')
  const [entityType, setEntityType] = useState('all')
  const [recomputationMode, setRecomputationMode] = useState('recompute')
  const [reason, setReason] = useState('Superadmin triggered on-demand weekly settlement aggregation re-run')
  const [error, setError] = useState('')

  const handlePresetChange = (preset) => {
    setPeriodPreset(preset)
    const today = new Date().toISOString().split('T')[0]
    if (preset === 'weekly') {
      const d = new Date()
      d.setDate(d.getDate() - 7)
      setStartDate(d.toISOString().split('T')[0])
      setEndDate(today)
    } else if (preset === 't1') {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      setStartDate(d.toISOString().split('T')[0])
      setEndDate(today)
    } else if (preset === 'biweekly') {
      const d = new Date()
      d.setDate(d.getDate() - 14)
      setStartDate(d.toISOString().split('T')[0])
      setEndDate(today)
    }
  }

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification for manual batch re-run invocation is mandatory.')
      return
    }
    if (!startDate || !endDate) {
      setError('Custom start date and end date must both be specified.')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.')
      return
    }
    const periodDescription = `${startDate} to ${endDate}`
    onConfirm({
      entityType,
      startDate,
      endDate,
      periodDescription,
      recomputationMode,
      reason
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Play className="w-5 h-5 text-emerald-600" />
          <span>Manual Settlement Batch Re-computation</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Aggregates completed transport trips (10%), equipment rentals (12%), broker deals (2%), and produce lots; recalculates platform commissions, statutory GST, and TDS.
        </p>

        <div className="space-y-3 text-xs">
          {/* Preset Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Period Selection Preset</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetChange('weekly')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                  periodPreset === 'weekly'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Weekly Aggregation
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('t1')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                  periodPreset === 't1'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                T+1 Daily Cycle
              </button>
              <button
                type="button"
                onClick={() => setPeriodPreset('custom')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                  periodPreset === 'custom'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {/* Custom Date Pickers */}
          <div className="grid grid-cols-2 gap-3 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/60">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPeriodPreset('custom')
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Custom End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPeriodPreset('custom')
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Persona / Domain</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Domains (Unified Reconciliation)</option>
                <option value="transporter">Transporters (10% Commission, 194C TDS)</option>
                <option value="equipment_owner">Equipment Rental CHC (12% Commission)</option>
                <option value="broker">Mandi Brokers (2% Commission, 194H TDS)</option>
                <option value="seller">Produce Sellers (2.5% Commission)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Recomputation Mode</label>
              <select
                value={recomputationMode}
                onChange={(e) => setRecomputationMode(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="recompute">Re-calculate Pending Balances</option>
                <option value="aggregate_new">Aggregate & Form New Batch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              rows={2}
              placeholder="Rationale for manual batch re-run and bank cycle alignment..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            Execute Settlement Run
          </button>
        </div>
      </div>
    </div>
  )
}

// 5. UPDATE COMMISSION RATES MODAL
export function UpdateCommissionsModal({
  isOpen,
  currentConfig = {},
  onClose,
  onSave
}) {
  const safeConfig = currentConfig || {}
  const [form, setForm] = useState({
    transporterCommissionPct: safeConfig.transporterCommissionPct ?? 10.0,
    equipmentRentalCommissionPct: safeConfig.equipmentRentalCommissionPct ?? 12.0,
    brokerCommissionPct: safeConfig.brokerCommissionPct ?? 2.0,
    produceMarketplaceCommissionPct: safeConfig.produceMarketplaceCommissionPct ?? 2.5,
    tdsRate194CPct: safeConfig.tdsRate194CPct ?? 1.0,
    gstOnCommissionPct: safeConfig.gstOnCommissionPct ?? 18.0
  })
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentConfig) {
      setForm({
        transporterCommissionPct: currentConfig.transporterCommissionPct ?? 10.0,
        equipmentRentalCommissionPct: currentConfig.equipmentRentalCommissionPct ?? 12.0,
        brokerCommissionPct: currentConfig.brokerCommissionPct ?? 2.0,
        produceMarketplaceCommissionPct: currentConfig.produceMarketplaceCommissionPct ?? 2.5,
        tdsRate194CPct: currentConfig.tdsRate194CPct ?? 1.0,
        gstOnCommissionPct: currentConfig.gstOnCommissionPct ?? 18.0
      })
    }
    if (isOpen) {
      setError('')
      setReason('')
    }
  }, [currentConfig, isOpen])

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Administrative reason for modifying commission matrix is required.')
      return
    }
    onSave(
      {
        transporterCommissionPct: Number(form.transporterCommissionPct),
        equipmentRentalCommissionPct: Number(form.equipmentRentalCommissionPct),
        brokerCommissionPct: Number(form.brokerCommissionPct),
        produceMarketplaceCommissionPct: Number(form.produceMarketplaceCommissionPct),
        tdsRate194CPct: Number(form.tdsRate194CPct),
        gstOnCommissionPct: Number(form.gstOnCommissionPct)
      },
      reason
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Sliders className="w-5 h-5 text-purple-700" />
            <span>Configure Platform Commission Rates</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Transporter Freight Take (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.transporterCommissionPct}
                onChange={(e) => setForm({ ...form, transporterCommissionPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Equipment Rental Take (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.equipmentRentalCommissionPct}
                onChange={(e) => setForm({ ...form, equipmentRentalCommissionPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Produce Marketplace Take (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.produceMarketplaceCommissionPct}
                onChange={(e) => setForm({ ...form, produceMarketplaceCommissionPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mandi Broker Take (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.brokerCommissionPct}
                onChange={(e) => setForm({ ...form, brokerCommissionPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">TDS Rate Section 194C (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.tdsRate194CPct}
                onChange={(e) => setForm({ ...form, tdsRate194CPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">GST on Commission (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.gstOnCommissionPct}
                onChange={(e) => setForm({ ...form, gstOnCommissionPct: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Administrative Audit Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Rationale for tariff adjustments..."
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-xs"
            >
              Save & Log Config Change
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 6. BATCH ACTION MODAL
export function BatchActionModal({
  isOpen,
  title,
  label = 'Confirm Batch Action',
  count = 0,
  action = '',
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('')
  const [coAdmin, setCoAdmin] = useState('')
  const [paymentChannel, setPaymentChannel] = useState('razorpayx')
  const [paymentRefPrefix, setPaymentRefPrefix] = useState('RZPX2609-')
  const [error, setError] = useState('')

  useEffect(() => {
    if (paymentChannel === 'razorpayx') {
      setPaymentRefPrefix('RZPX2609-')
    } else if (paymentChannel === 'neft') {
      setPaymentRefPrefix('NEFT2609-')
    } else {
      setPaymentRefPrefix('AGRO-UTR-')
    }
  }, [paymentChannel])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification is required for bulk financial settlements actions.')
      return
    }
    onConfirm({ reason, coAdmin, paymentRefPrefix, paymentChannel })
    setReason('')
    setCoAdmin('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Targeting {count} selected settlement items
            </p>
          </div>
        </div>

        {action === 'batch_mark_paid' && (
          <div className="space-y-3 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Disbursement Gateway / Transfer Method
              </label>
              <select
                value={paymentChannel}
                onChange={(e) => setPaymentChannel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="razorpayx">RazorpayX Bulk Payouts (Corporate API / Instant IMPS)</option>
                <option value="neft">Direct Bank NEFT / RTGS (Host-to-Host Batch)</option>
                <option value="treasury">Corporate Treasury Manual Clearance</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Bank Payout Reference Prefix
              </label>
              <input
                type="text"
                value={paymentRefPrefix}
                onChange={(e) => setPaymentRefPrefix(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">
                  Co-Authorizer Email
                </label>
                <span className="text-[10px] text-purple-700 font-bold font-mono">Mandatory if &gt; ₹50,000</span>
              </div>
              <input
                type="email"
                placeholder="auditor.finance@agrovercity.in"
                value={coAdmin}
                onChange={(e) => setCoAdmin(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Administrative Audit Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Document rationale, banking approval reference, or dispute disposition..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}

// 7. RESET BENCHMARK SEED MODAL
export function ResetSeedModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification is required prior to resetting module benchmark state.')
      return
    }
    onConfirm(reason)
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Reset Benchmark Seed Data</h3>
            <p className="text-xs text-slate-500">Module 25: Financial Settlements & Scheduled Jobs</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          This operation will restore all settlements, transporter payouts, seller payouts, commission matrices, and cron execution logs to their pristine SOP-25 benchmark state.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Audit Reason for Reset <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. End-of-cycle benchmark test reset or automated testing baseline restoration..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  )
}
