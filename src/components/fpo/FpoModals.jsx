import React, { useState, useEffect } from 'react'
import {
  Building2,
  Package,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react'
import { fmtINR } from '../../pages/fpoWidgets'

// 1. VERIFY FPO MODAL (SOP-18 §3)
export function VerifyFpoModal({ open, fpo, onClose, onConfirm }) {
  const [auditReason, setAuditReason] = useState('ROC Certificate of Incorporation cross-matched with MCA CIN registry; NABARD empanelment validated.')
  const [busy, setBusy] = useState(false)

  if (!open || !fpo) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        fpoId: fpo.id,
        reason: auditReason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-3">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-900">
            Verify FPO Registration Credentials (SOP-18 §3)
          </h3>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 text-xs mb-4 space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">FPO Name:</span>
            <span className="text-slate-900 font-bold">{fpo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">CIN:</span>
            <span className="text-cyan-700">{fpo.cin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">NABARD Ref:</span>
            <span className="text-emerald-700 font-semibold">{fpo.nabardEmpanelmentNo}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-emerald-100">
            <span className="text-slate-500">Bank Penny Drop:</span>
            <span className="text-emerald-700 font-bold">MATCHED (HDFC / NPCI)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Administrative Audit Justification</label>
            <textarea
              rows={3}
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 shadow-xs active:scale-95 transition"
            >
              {busy ? 'Verifying...' : 'Approve FPO Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2. CREATE GROUP BUY POOL MODAL (SOP-18 §3)
export function CreateFpoPoolModal({ open, fpos = [], onClose, onConfirm }) {
  const [fpoId, setFpoId] = useState('')
  const [poolName, setPoolName] = useState('Bulk IFFCO Urea & NPK Compound Pool')
  const [category, setCategory] = useState('Fertilizers (खते)')
  const [targetQuantity, setTargetQuantity] = useState(200)
  const [quantityUnit, setQuantityUnit] = useState('Metric Ton (MT)')
  const [mrpPerUnit, setMrpPerUnit] = useState(26000)
  const [poolOfferPricePerUnit, setPoolOfferPricePerUnit] = useState(20800) // 20% discount
  const [supplierName, setSupplierName] = useState('IFFCO State Agro Depot')
  const [deliveryHub, setDeliveryHub] = useState('Taluka Custom Hiring Center Godown')
  const [deadlineDays, setDeadlineDays] = useState(14)
  const [reason, setReason] = useState('Initiated bulk group buy pool for upcoming rabi pre-sowing demand.')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (fpos.length > 0 && !fpoId) {
      setFpoId(fpos[0].id)
    }
  }, [fpos, fpoId])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const selectedFpo = fpos.find((f) => f.id === fpoId) || fpos[0]
      const deadline = new Date(Date.now() + Number(deadlineDays) * 86400000).toISOString()
      await onConfirm({
        fpoId: selectedFpo ? selectedFpo.id : 'fpo_01',
        fpoName: selectedFpo ? selectedFpo.name : 'Sahyadri Farmers Producer Company Ltd.',
        poolName,
        category,
        targetQuantity: Number(targetQuantity),
        quantityUnit,
        mrpPerUnit: Number(mrpPerUnit),
        poolOfferPricePerUnit: Number(poolOfferPricePerUnit),
        supplierName,
        deliveryHub,
        deadline,
        reason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-3">
          <Package className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-900">
            Create Platform-Sponsored Group Buy Pool (SOP-18 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Enable multiple farmer members to pool their bulk agricultural input demand to unlock collective volume discounts directly from apex manufacturers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Organizing FPO</label>
            <select
              value={fpoId}
              onChange={(e) => setFpoId(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {fpos.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.registeredDistrict})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pool Name / Product</label>
            <input
              type="text"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Fertilizers (खते)">Fertilizers (रासायनिक खते)</option>
                <option value="Seeds (प्रमाणित बियाणे)">Seeds (प्रमाणित बियाणे)</option>
                <option value="Micro-Irrigation (ठिबक)">Micro-Irrigation Equipment</option>
                <option value="Crop Protection (कीटकनाशक)">Crop Protection &amp; Bio-Inputs</option>
                <option value="Agri Plastic (मल्चिंग)">Agricultural Mulch &amp; Tarpaulin</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Volume &amp; Unit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  min="1"
                  required
                  className="w-24 bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="flex-1 bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Retail MRP per Unit (₹)</label>
              <input
                type="number"
                value={mrpPerUnit}
                onChange={(e) => setMrpPerUnit(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bulk Offer Price (₹)</label>
              <input
                type="number"
                value={poolOfferPricePerUnit}
                onChange={(e) => setPoolOfferPricePerUnit(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Apex Supplier / Depot</label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pledging Window (Days)</label>
              <input
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                min="3"
                max="60"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Delivery Hub / Custom Hiring Center</label>
            <input
              type="text"
              value={deliveryHub}
              onChange={(e) => setDeliveryHub(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Administrative Audit Justification</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 shadow-xs active:scale-95 transition"
            >
              {busy ? 'Creating...' : 'Launch Group Buy Pool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 3. CLOSE POOL & DISPATCH PO MODAL (SOP-18 §3)
export function ClosePoolDispatchPoModal({ open, pool, onClose, onConfirm }) {
  const [poNotes, setPoNotes] = useState('Volume threshold reached. Escrow locked and supplier purchase order dispatched.')
  const [busy, setBusy] = useState(false)

  if (!open || !pool) return null

  const isHighValue = (pool.totalPoolValueInr || 0) > 50000

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        poolId: pool.id,
        status: 'closed_po_dispatched',
        reason: poNotes,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-purple-700 mb-3">
          <Package className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-900">
            Close Pool &amp; Trigger Supplier Purchase Order (SOP-18 §5)
          </h3>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs mb-4 space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Pool:</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{pool.poolName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">PO Number:</span>
            <span className="text-cyan-700">{pool.poNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Volume Pledged:</span>
            <span className="text-emerald-700 font-semibold">{pool.pledgedQuantity} / {pool.targetQuantity} {pool.quantityUnit}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-purple-100">
            <span className="text-slate-500">Total Purchase Value:</span>
            <span className="text-emerald-700 font-bold text-sm">{fmtINR(pool.totalPoolValueInr)}</span>
          </div>
        </div>

        {isHighValue && (
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-purple-600" />
            <span>Value exceeds ₹50,000 threshold: Dual Admin Sign-Off rule applied per SOP-18 §6.3.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">PO Release Notes for Audit Trail</label>
            <textarea
              rows={3}
              value={poNotes}
              onChange={(e) => setPoNotes(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50 shadow-xs active:scale-95 transition"
            >
              {busy ? 'Dispatching...' : 'Confirm PO Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
