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
  FileText
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
  const [utr, setUtr] = useState(`NEFT2609${Math.floor(100000 + Math.random() * 900000)}`)
  const [reason, setReason] = useState('Direct bank transfer executed via RazorpayX / Corporate Internet Banking')
  const [error, setError] = useState('')

  if (!isOpen || !settlement) return null

  const handleConfirm = () => {
    if (!utr.trim()) {
      setError('Bank reference / UTR number is mandatory.')
      return
    }
    onConfirm({ paymentReferenceUtr: utr, reason })
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
            <label className="block font-bold text-slate-700 mb-1">Bank Reference / UTR Number *</label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. SBIN260920881923"
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

// 4. TRIGGER MANUAL BATCH RUN MODAL
export function TriggerBatchRunModal({
  isOpen,
  onClose,
  onConfirm
}) {
  const [entityType, setEntityType] = useState('transporter')
  const [dateRange, setDateRange] = useState('2026-09-19 to 2026-09-20')
  const [reason, setReason] = useState('Nightly T+1 settlement batch re-run')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit reason for manual job invocation is mandatory.')
      return
    }
    onConfirm({ entityType, dateRange, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Play className="w-5 h-5 text-emerald-600" />
          <span>Trigger Manual Settlement Calculation Run</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Aggregates completed trips, equipment hires, and marketplace lots; calculates commissions and generates payable settlement batches.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Persona / Domain</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="transporter">Transporters (10% Commission, 194C TDS)</option>
              <option value="seller">Produce Sellers (2.5% Commission, Mandi Cess)</option>
              <option value="equipment_owner">Equipment Rental CHC (12% Commission)</option>
              <option value="broker">Mandi Brokers (2% Commission, 194H TDS)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Settlement Period Range</label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Justification *</label>
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
