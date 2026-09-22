import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Trees,
  Milk,
  Calendar,
  Truck,
  CheckCircle2,
  FileText,
  BadgeAlert,
  Coins
} from 'lucide-react'
import { fmtINR } from '../../pages/livestockWidgets'

export function VerifyVetModal({ isOpen, onClose, vet, onSubmit, loading }) {
  const [status, setStatus] = useState('verified_active')
  const [councilRegNo, setCouncilRegNo] = useState(vet?.councilRegNo || '')
  const [verifiedDegrees, setVerifiedDegrees] = useState(true)
  const [verifiedCouncil, setVerifiedCouncil] = useState(true)
  const [pennyDropConfirmed, setPennyDropConfirmed] = useState(true)
  const [reason, setReason] = useState(
    'B.V.Sc degree verified with State Veterinary Council. Bank sub-ledger penny-drop match confirmed.'
  )

  if (!isOpen || !vet) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(vet.id, {
      status,
      councilRegNo,
      verifiedBy: 'usr_admin_root',
      reason
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verify Veterinary Doctor Credentials</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.1 • State Council &amp; B.V.Sc Degree Audit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{vet.name}</div>
            <div className="text-slate-600 font-medium">{vet.degree}</div>
            <div className="text-slate-500 font-mono text-[11px]">{vet.clinicName} • {vet.district}</div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              State Veterinary Council Registration No
            </label>
            <input
              type="text"
              value={councilRegNo}
              onChange={(e) => setCouncilRegNo(e.target.value)}
              required
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Verification Decision</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="verified_active">Verified &amp; Active (Enable Emergency Callout)</option>
              <option value="suspended">Suspended (License Expired / Under Review)</option>
              <option value="rejected">Rejected (Invalid Registration)</option>
            </select>
          </div>

          <div className="space-y-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={verifiedDegrees}
                onChange={(e) => setVerifiedDegrees(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>Original B.V.Sc / M.V.Sc Degree Authenticated</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={verifiedCouncil}
                onChange={(e) => setVerifiedCouncil(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>Live status verified on State Veterinary Council Registry</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={pennyDropConfirmed}
                onChange={(e) => setPennyDropConfirmed(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>Bank account beneficiary penny-drop matched</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Administrative Audit Justification</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !verifiedDegrees || !verifiedCouncil}
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Submitting...' : 'Commit Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function AuditGaushalaModal({ isOpen, onClose, gaushala, onSubmit, loading }) {
  const [status, setStatus] = useState('certified_active')
  const [welfareScore, setWelfareScore] = useState(gaushala?.welfareAuditScore || 95)
  const [certifyCensus, setCertifyCensus] = useState(true)
  const [notes, setNotes] = useState(
    'Bovine welfare inspection passed; shelter netting, green fodder stock, and 80G trust ledger verified compliant.'
  )

  if (!isOpen || !gaushala) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(gaushala.id, {
      status,
      welfareAuditScore: Number(welfareScore),
      auditedBy: 'usr_admin_root',
      notes
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gaushala Cow Welfare Audit &amp; Certification</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.2 • Bovine Health, Shelter &amp; Trust Compliance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{gaushala.name}</div>
            <div className="text-slate-600">Trust Reg: {gaushala.trustRegNo} • {gaushala.district}</div>
            <div className="text-emerald-700 font-mono text-[11px] font-bold">
              Total Cattle: {gaushala.totalCattleHead} Heads | Monthly Manure: {gaushala.monthlyManureCapacityMT} MT
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">Bovine Welfare Audit Score (0 - 100)</label>
              <span className="font-bold text-emerald-700 font-mono text-base">{welfareScore} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={welfareScore}
              onChange={(e) => setWelfareScore(e.target.value)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Certification Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="certified_active">Certified Compliant (Listed on Organic Manure Exchange)</option>
              <option value="pending_audit">Pending Supplementary Field Inspection</option>
              <option value="flagged">Flagged Anomaly (Temporary Dispatch Freeze)</option>
            </select>
          </div>

          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={certifyCensus}
                onChange={(e) => setCertifyCensus(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>Physical cattle tag count verified against Gaushala census</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Audit Findings &amp; Observations</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !certifyCensus}
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Submitting...' : 'Record Welfare Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ApproveNurseryModal({ isOpen, onClose, nursery, onSubmit, loading }) {
  const [status, setStatus] = useState('approved')
  const [inspectionGrade, setInspectionGrade] = useState(nursery?.inspectionGrade || 'A+')
  const [subsidyEligible, setSubsidyEligible] = useState(true)
  const [notes, setNotes] = useState(
    'National Horticulture Board accreditation verified; certified grafted fruit saplings approved for MIDH subsidy catalog.'
  )

  if (!isOpen || !nursery) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(nursery.id, {
      status,
      inspectionGrade,
      subsidyEligible,
      approvedBy: 'usr_admin_root',
      notes
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Approve Certified Plant Nursery</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.3 • NHB Star Rating &amp; Sapling Accreditation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{nursery.name}</div>
            <div className="text-slate-600">NHB Reg: {nursery.nhbRegistrationNo} • {nursery.district}</div>
            <div className="text-emerald-700 font-mono text-[11px] font-bold">
              Available Stock: {(nursery.totalStockAvailable || 0).toLocaleString()} plants
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Inspection Grade</label>
              <select
                value={inspectionGrade}
                onChange={(e) => setInspectionGrade(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="A+">A+ (Exemplary Mother Plant Lineage)</option>
                <option value="A">A (Standard Certified)</option>
                <option value="B+">B+ (Conditional Clearance)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Approval Decision</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="approved">Approved &amp; Empaneled</option>
                <option value="pending_inspection">Pending Re-inspection</option>
                <option value="suspended">Suspended (Rootstock Quarantine)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={subsidyEligible}
                onChange={(e) => setSubsidyEligible(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>Eligible for Direct Beneficiary Transfer (DBT) &amp; MIDH Farmer Subsidies</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official Approval Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Submitting...' : 'Confirm Nursery Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DairyProductRecallModal({ isOpen, onClose, product, onSubmit, loading }) {
  const isRecallAction = product?.status === 'active'
  const [action, setAction] = useState(isRecallAction ? 'recalled' : 'active')
  const [labReportId, setLabReportId] = useState(product?.labReportId || 'NABL-LAB-2026-CLEAR')
  const [reason, setReason] = useState(
    isRecallAction
      ? 'Adulteration screening flagged batch deviation; immediate platform recall and stock freeze enforced.'
      : 'NABL lab analysis confirmed 99.8% A2 beta-casein purity and antibiotic residue compliance.'
  )

  if (!isOpen || !product) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(product.id, {
      status: action,
      recallReason: action === 'recalled' ? reason : '',
      labReportId,
      updatedBy: 'usr_admin_root'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border ${action === 'recalled' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {action === 'recalled' ? 'Enforce Dairy Batch Recall' : 'Approve NABL Lab Clearance'}
              </h3>
              <p className="text-xs text-slate-500">SOP-19 §3.4 • Dairy Purity &amp; Food Safety Interventions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{product.name}</div>
            <div className="text-slate-600">Batch: {product.batchNo} • FSSAI: {product.fssaiLicenseNo}</div>
            <div className="text-cyan-700 font-mono text-[11px] font-bold">
              Producer: {product.brandOrGaushala} | Stock: {product.stockAvailable} units
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Intervention Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="recalled">Enforce Batch Recall &amp; Freeze Inventory</option>
              <option value="active">Clear Batch for Active Sale (Lab Passed)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">NABL Lab Testing Reference ID</label>
            <input
              type="text"
              value={labReportId}
              onChange={(e) => setLabReportId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {action === 'recalled' ? 'Regulatory Recall Reason (Public Notice)' : 'Lab Findings Summary'}
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-semibold text-white transition shadow-xs disabled:opacity-50 active:scale-95 ${
                action === 'recalled' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? 'Submitting...' : action === 'recalled' ? 'Execute Recall' : 'Approve Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function MediateVetBookingModal({ isOpen, onClose, booking, onSubmit, loading, activeVets = [] }) {
  const [action, setAction] = useState('refund_farmer')
  const [reassignVetId, setReassignVetId] = useState('')
  const [reason, setReason] = useState(
    'Emergency callout delayed beyond 45 mins; full escrow refund credited with ₹300 courtesy voucher.'
  )

  if (!isOpen || !booking) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedVet = activeVets.find((v) => v.id === reassignVetId)
    onSubmit(booking.id, {
      action,
      reason,
      reassignVetId: action === 'reassign_vet' ? reassignVetId : null,
      reassignVetName: selectedVet ? selectedVet.name : '',
      mediatedBy: 'usr_admin_root'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mediate Vet Emergency Appointment</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.5 • Dispatch Triage &amp; Escrow Mediation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/90 space-y-1">
            <div className="font-bold text-slate-900 text-sm">{booking.bookingNumber}</div>
            <div className="text-slate-600">
              Farmer: {booking.farmerName} ({booking.farmerPhone}) • {booking.village}, {booking.district}
            </div>
            <div className="text-rose-700 font-mono text-[11px] font-bold">
              Animal: {booking.animalType} | Escrow: {fmtINR(booking.totalAmount)}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mediation Resolution</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="refund_farmer">Full Escrow Refund to Farmer (Missed Callout)</option>
              <option value="reassign_vet">Emergency Re-dispatch to Secondary Available Vet</option>
              <option value="close_dispute">Release Payment to Doctor (Service Satisfied)</option>
            </select>
          </div>

          {action === 'reassign_vet' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Alternate Emergency Doctor</label>
              <select
                value={reassignVetId}
                onChange={(e) => setReassignVetId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">-- Choose on-call vet --</option>
                {activeVets
                  .filter((v) => v.status === 'verified_active' && v.emergencyCallout24x7)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.district} • {v.mobile})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mediation Notes &amp; Audit Log Entry</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (action === 'reassign_vet' && !reassignVetId)}
              className="px-4 py-2 rounded-xl font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Processing...' : 'Execute Mediation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DualSignOffManureModal({ isOpen, onClose, order, onSubmit, loading }) {
  const [adminName, setAdminName] = useState('Vikram Mehta')
  const [role, setRole] = useState('Chief Risk Officer')
  const [verifiedGatePass, setVerifiedGatePass] = useState(true)
  const [verifiedWeighbridge, setVerifiedWeighbridge] = useState(true)
  const [reason, setReason] = useState(
    'Dual sign-off counter-signed; weighbridge tare slip & logistics vehicle compliance authenticated.'
  )

  if (!isOpen || !order) return null

  const isSecondSignOff = !!order.signOff1

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(order.id, {
      adminUid: isSecondSignOff ? 'usr_admin_vikram' : 'usr_admin_ananya',
      adminName,
      role,
      reason
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dual Administrative Sign-Off (&gt; ₹50,000)</h3>
              <p className="text-xs text-slate-500">SOP-19 §6.3 • High-Volume Manure Dispatch Release</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{order.orderNumber}</span>
              <span className="font-bold text-emerald-700 font-mono text-sm">{fmtINR(order.totalAmountINR)}</span>
            </div>
            <div className="text-slate-600">Buyer: {order.buyerName} • {order.productName}</div>
            <div className="text-purple-800 font-mono text-[11px] font-semibold">
              Quantity: {order.quantityMT} MT | Source: {order.gaushalaName}
            </div>
          </div>

          <div className="p-3.5 bg-purple-50/40 border border-purple-200/80 rounded-xl space-y-1.5 text-slate-800">
            <div className="font-bold text-purple-900">Dual Sign-Off Ledger Status:</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-600">Sign-off 1 (Finance):</span>
              {order.signOff1 ? (
                <span className="text-emerald-700 font-bold font-mono">
                  Completed by {order.signOff1.name}
                </span>
              ) : (
                <span className="text-amber-700 font-semibold font-mono">Pending First Sign-off</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-600">Sign-off 2 (CRO / Risk):</span>
              <span className="text-amber-700 font-semibold font-mono">
                {isSecondSignOff ? 'Awaiting Your Counter-signature' : 'Pending Sign-off 1'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Signing Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Administrative Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Chief Risk Officer">Chief Risk Officer (CRO)</option>
                <option value="Director of Finance">Director of Finance</option>
                <option value="Managing Director">Managing Director (MD)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={verifiedGatePass}
                onChange={(e) => setVerifiedGatePass(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-0"
              />
              <span>Gaushala loading gate pass &amp; driver manifest verified</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={verifiedWeighbridge}
                onChange={(e) => setVerifiedWeighbridge(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-0"
              />
              <span>Weighbridge gross &amp; tare certificates verified ({order.quantityMT} MT)</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Dual Sign-Off Rationale</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !verifiedGatePass || !verifiedWeighbridge}
              className="px-4 py-2 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50 shadow-xs active:scale-95"
            >
              {loading ? 'Authorizing...' : isSecondSignOff ? 'Release Dispatch' : 'Complete First Sign-Off'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
