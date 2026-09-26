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
  Ban,
  RotateCcw,
  Layers,
  Sliders
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
            placeholder="Enter policy rationale or incident details..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-medium mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-colors active:scale-95 ${
              confirmVariant === 'rose' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-teal-700">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200/80">
            <Lock className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] font-mono text-teal-700 font-bold">Dual Admin Sign-off Required (&gt; 50,000 Unit Threshold)</span>
          </div>
        </div>

        <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 text-xs space-y-1">
          <div className="flex justify-between font-bold text-slate-800">
            <span>High-Value Float Mutation:</span>
            <span className="font-mono text-teal-800 font-bold">{amount?.toLocaleString()} Coins / INR</span>
          </div>
          {details && <p className="text-slate-600 text-[11px] leading-relaxed pt-1">{details}</p>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorizing Co-Admin Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.compliance@agrovercity.in"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Mandatory justification for high-value wallet float credit/debit..."
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Coins className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Adjust AgriCoins Virtual Balance</h3>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Farmer:</span>
            <span className="text-slate-900 font-semibold">{user.userName} ({user.userId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-bold">Current Balance:</span>
            <span className="font-mono text-emerald-800 font-bold">{user.currentCoinsBalance?.toLocaleString()} Coins</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('CREDIT')}
                className={`py-2 rounded-xl font-bold border transition-colors ${
                  type === 'CREDIT'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                + Credit (Mint Coins)
              </button>
              <button
                type="button"
                onClick={() => setType('DEBIT')}
                className={`py-2 rounded-xl font-bold border transition-colors ${
                  type === 'DEBIT'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                - Debit (Burn / Clawback)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Coin Quantity</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Administrative Reason *</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Compensation for dispute mediation resolution or special campaign reward..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {error && <p className="text-[11px] text-rose-600 font-medium mt-1">{error}</p>}
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
              <Gift className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Rewards Store Voucher' : 'Add Voucher to Rewards Store'}
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
              <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. AGRO-NPK-250"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-amber-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
            <label className="block font-bold text-slate-700 mb-1">Voucher Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. ₹250 Off Mahadhan Smarttek NPK 10:26:26"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coin Price (Coins)</label>
              <input
                type="number"
                value={formData.coinPrice}
                onChange={(e) => setFormData({ ...formData, coinPrice: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Face Value (₹)</label>
              <input
                type="number"
                value={formData.faceValueDiscountINR}
                onChange={(e) => setFormData({ ...formData, faceValueDiscountINR: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Stock (Units)</label>
              <input
                type="number"
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Merchant Partner *</label>
              <input
                type="text"
                value={formData.partnerMerchant}
                onChange={(e) => setFormData({ ...formData, partnerMerchant: e.target.value })}
                placeholder="e.g. Deepak Fertilisers"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil.slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value).toISOString() })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Terms & Redemption Instructions</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Add Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. CONFIGURE ACTIVITY EARN RATES MODAL (SOP-22 Section 3)
export function ConfigureEarnRatesModal({
  isOpen,
  initialRates,
  onClose,
  onSave
}) {
  const [rates, setRates] = useState(initialRates || {})
  const [reason, setReason] = useState('Quarterly adjustment of app activity AgriCoins earn incentives.')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleUpdate = (id, field, val) => {
    setRates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Number(val)
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Administrative justification is required for updating economy earn rates.')
      return
    }
    onSave(rates, reason)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Configure AgriCoins Activity Earn Rates</h3>
              <p className="text-[11px] text-slate-500 font-mono">SOP-22 App Virality & Engagement Incentive Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">{error}</div>}

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {Object.entries(rates).map(([key, item]) => (
              <div key={key} className="p-3 bg-emerald-50/30 border border-emerald-100/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {item.category || 'App Activity'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">Coins Awarded / Event</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={item.coins}
                      onChange={(e) => handleUpdate(key, 'coins', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">Daily Cap (Max Coins)</label>
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      value={item.maxDaily}
                      onChange={(e) => handleUpdate(key, 'maxDaily', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Administrative Justification *</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs active:scale-95 transition-all"
            >
              Save Earn Rates
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
          You are executing a bulk operation across <strong className="text-slate-900">{count}</strong> records. This batch action will be permanently recorded in the immutable audit trail.
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
            placeholder="Enter reason for batch state change..."
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

// 7. RESET BENCHMARK SEED DATA MODAL
export function ResetSeedModal({
  isOpen,
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('Restoring SOP-22 Gamification & Economy benchmark dataset for verification.')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is required to reset benchmark data.')
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
            <h3 className="text-base font-bold text-slate-900">Reset Gamification Benchmark Data</h3>
            <span className="text-[11px] font-mono text-rose-600 font-bold">SOP-22 Target Collections Reset</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          This will restore all 5 Gamification collections (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">gamification_status</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">agri_coins_ledger</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">reward_coupons</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">referrals</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ratings</code>) and earn rates to the official SOP-22 benchmark dataset.
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

