import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  Lock,
  HandHeart,
  PiggyBank,
  Store,
  Coins,
  CheckCircle2,
  DollarSign,
  FileCheck
} from 'lucide-react'
import { fmtINR } from '../../pages/womenShgWidgets'

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
            <span className="text-[11px] font-mono text-purple-400">Institutional Dual Admin Authorization (&gt; ₹50,000 Threshold)</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between font-medium text-slate-200">
            <span>High-Value Subsidy / Grant Transfer:</span>
            <span className="font-mono text-purple-300 font-bold">{fmtINR(amount)}</span>
          </div>
          {details && <p className="text-slate-300 text-[11px]">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Authorizing Co-Admin (Women Livelihoods Director) *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.women@agrovercity.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Passcode / Multi-Factor Token *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Rationale for sanctioning interest subvention / capital grant..."
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
            Authorize & Execute Transfer
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. VERIFY SHG REGISTRATION MODAL
export function VerifyShgModal({
  isOpen,
  shg = null,
  onClose,
  onConfirm
}) {
  const [eligibility, setEligibility] = useState('eligible')
  const [reason, setReason] = useState('Verified NRLM/MSRLM certificate, bank passbook, and Gram Panchayat resolution.')
  const [error, setError] = useState('')

  if (!isOpen || !shg) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Verification audit note is required.')
      return
    }
    onConfirm({ grantEligibility: eligibility, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-white font-bold">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span>Approve SHG Registration & Subvention</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>SHG Name:</span>
            <span className="font-semibold text-white">{shg.shgName}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Village / District:</span>
            <span>{shg.village}, {shg.district}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Bank & Masked A/C:</span>
            <span className="font-mono text-emerald-400">{shg.bankName} ({shg.accountNumberMasked})</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Interest Subvention Eligibility *</label>
            <select
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              <option value="eligible">Eligible for 7% to 3% Interest Subvention</option>
              <option value="ineligible">Ineligible (Recovery / Attendance Deficit)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Verification Note *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-sm"
          >
            Verify & Activate
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. CURATE ENTERPRISE PRODUCT MODAL
export function CurateProductModal({
  isOpen,
  product = null,
  onClose,
  onConfirm
}) {
  const [status, setStatus] = useState(product?.status || 'approved')
  const [notes, setNotes] = useState(product?.curationNotes || '')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !product) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit reason is required.')
      return
    }
    onConfirm({ status, curationNotes: notes, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-white font-bold">
          <Store className="w-5 h-5 text-purple-400" />
          <span>Curate Storefront Agro-Product</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="text-white font-semibold">{product.productTitle}</div>
          <div className="text-slate-400">{product.artisanName} · {product.shgName}</div>
          <div className="flex justify-between font-mono text-emerald-400 pt-1">
            <span>Price: {fmtINR(product.priceInr)} ({product.netWeight})</span>
            <span>Stock: {product.stockUnits}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Curation Decision *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              <option value="approved">Approve & Publish to Storefront</option>
              <option value="changes_requested">Request Changes (Label / FSSAI / Packaging)</option>
              <option value="delisted">Delist from Storefront</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">QC Curation & Packaging Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. FSSAI verified; tamper evident seal confirmed"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Audit Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain rationale for approval or requested revision..."
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
            Save Curation
          </button>
        </div>
      </div>
    </div>
  )
}

// 5. RECORD MANUAL SHG DEPOSIT MODAL
export function RecordDepositModal({
  isOpen,
  shgs = [],
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    shgId: shgs[0]?.id || 'shg_01',
    shgName: shgs[0]?.shgName || 'Savitribai Phule Mahila Bachat Gat',
    memberId: 'mem_manual_99',
    memberName: '',
    memberPhone: '+91 98XXX XX',
    depositMonth: '2026-09',
    amountInr: 500,
    penaltyLateInr: 0,
    internalLoanRepaymentInr: 0,
    internalInterestPaidInr: 0,
    paymentMode: 'UPI - Digital QR'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleShgChange = (e) => {
    const selected = shgs.find((s) => s.id === e.target.value)
    setForm({
      ...form,
      shgId: e.target.value,
      shgName: selected?.shgName || form.shgName
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.memberName.trim() || !form.depositMonth || !form.amountInr) {
      setError('Member name, deposit month, and monthly savings amount are required.')
      return
    }
    onSave({
      ...form,
      amountInr: Number(form.amountInr),
      penaltyLateInr: Number(form.penaltyLateInr),
      internalLoanRepaymentInr: Number(form.internalLoanRepaymentInr),
      internalInterestPaidInr: Number(form.internalInterestPaidInr)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <span>Record Monthly Micro-Savings Deposit</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Target SHG *</label>
            <select
              value={form.shgId}
              onChange={handleShgChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              {shgs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shgName} ({s.village})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Member Name *</label>
              <input
                type="text"
                value={form.memberName}
                onChange={(e) => setForm({ ...form, memberName: e.target.value })}
                placeholder="e.g. Rukmini Shinde"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Deposit Month (YYYY-MM) *</label>
              <input
                type="text"
                value={form.depositMonth}
                onChange={(e) => setForm({ ...form, depositMonth: e.target.value })}
                placeholder="2026-09"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Savings Amount (₹) *</label>
              <input
                type="number"
                value={form.amountInr}
                onChange={(e) => setForm({ ...form, amountInr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Loan Repayment (₹)</label>
              <input
                type="number"
                value={form.internalLoanRepaymentInr}
                onChange={(e) => setForm({ ...form, internalLoanRepaymentInr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Interest Paid (₹)</label>
              <input
                type="number"
                value={form.internalInterestPaidInr}
                onChange={(e) => setForm({ ...form, internalInterestPaidInr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              <option value="UPI - Digital QR">UPI - Digital QR</option>
              <option value="Cash in SHG Box">Cash in SHG Box</option>
              <option value="Bank NEFT">Bank NEFT Direct</option>
            </select>
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
              Post to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
