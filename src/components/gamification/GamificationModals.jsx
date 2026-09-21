import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  Lock,
  Coins,
  Gift,
  Star,
  CheckCircle2,
  Trash2,
  Ban
} from 'lucide-react'
import { fmtINR } from '../../pages/gamificationWidgets'

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

// 2. DUAL SIGN-OFF MODAL (> 50,000 Coins / ₹50,000)
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
            <span className="text-[11px] font-mono text-purple-400">Dual Admin Sign-off Required (&gt; 50,000 Unit Threshold)</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between font-medium text-slate-200">
            <span>High-Value Float Mutation:</span>
            <span className="font-mono text-purple-300 font-bold">{amount?.toLocaleString()} Coins / INR</span>
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mandatory justification for high-value wallet float credit/debit..."
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

// 3. MANUAL ADJUST COINS MODAL
export function ManualAdjustCoinsModal({
  isOpen,
  user,
  onClose,
  onAdjust
}) {
  const [amount, setAmount] = useState(100)
  const [type, setType] = useState('CREDIT') // 'CREDIT' or 'DEBIT'
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !user) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification is required for manual balance mutation.')
      return
    }
    const delta = type === 'CREDIT' ? Math.abs(amount) : -Math.abs(amount)
    onAdjust(user.userId, delta, reason)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Coins className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Adjust AgriCoins Virtual Balance</h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Farmer:</span>
            <span className="text-slate-200 font-medium">{user.userName} ({user.userId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Balance:</span>
            <span className="font-mono text-emerald-400 font-bold">{user.currentCoinsBalance?.toLocaleString()} Coins</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                className={`py-2 rounded-xl font-medium border transition-colors ${
                  type === 'CREDIT'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                + Credit (Mint Coins)
              </button>
              <button
                type="button"
                onClick={() => setType('DEBIT')}
                className={`py-2 rounded-xl font-medium border transition-colors ${
                  type === 'DEBIT'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                - Debit (Burn / Clawback)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Coin Quantity</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Reason *</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Compensation for dispute mediation resolution or special campaign reward..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
            {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
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
            Apply Coin Adjustment
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. CREATE / EDIT REWARD COUPON MODAL
export function CreateEditCouponModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Fertilizer Discount',
    coinPrice: initialData?.coinPrice || 500,
    faceValueDiscountINR: initialData?.faceValueDiscountINR || 250,
    partnerMerchant: initialData?.partnerMerchant || '',
    totalStock: initialData?.totalStock || 100,
    validUntil: initialData?.validUntil || '2026-12-31T23:59:59Z'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.title.trim() || !formData.partnerMerchant.trim()) {
      setError('Voucher code, title, and merchant partner are mandatory.')
      return
    }
    onSave({
      ...formData,
      stockAvailable: formData.totalStock - (initialData?.claimedCount || 0)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Gift className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Rewards Store Voucher' : 'Add Voucher to Rewards Store'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. AGRO-NPK-250"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="Fertilizer Discount">Fertilizer Discount</option>
                <option value="Drone Spraying Coupon">Drone Spraying Coupon</option>
                <option value="Free Soil Test">Free Soil Test</option>
                <option value="Tractor Rental Voucher">Tractor Rental Voucher</option>
                <option value="Seed Subsidy">Seed Subsidy</option>
                <option value="Vyapari Fee Waiver">Vyapari Fee Waiver</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Voucher Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. ₹250 Off Mahadhan Smarttek NPK 10:26:26"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Coin Price (Coins)</label>
              <input
                type="number"
                value={formData.coinPrice}
                onChange={(e) => setFormData({ ...formData, coinPrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Face Value (₹)</label>
              <input
                type="number"
                value={formData.faceValueDiscountINR}
                onChange={(e) => setFormData({ ...formData, faceValueDiscountINR: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Total Stock (Units)</label>
              <input
                type="number"
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Merchant Partner *</label>
              <input
                type="text"
                value={formData.partnerMerchant}
                onChange={(e) => setFormData({ ...formData, partnerMerchant: e.target.value })}
                placeholder="e.g. Deepak Fertilisers"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil.slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value).toISOString() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Terms & Redemption Instructions</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {initialData ? 'Save Changes' : 'Add Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
