import React, { useState, useEffect } from 'react'
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
  Coins,
  Sparkles,
  Info,
  Clock,
  RotateCcw
} from 'lucide-react'
import { fmtINR } from '../../pages/livestockWidgets'

// 1. Verify Vet Modal
export function VerifyVetModal({ isOpen, onClose, vet, onSubmit, loading, currentAdmin }) {
  const [status, setStatus] = useState('verified_active')
  const [councilRegNo, setCouncilRegNo] = useState('')
  const [verifiedDegrees, setVerifiedDegrees] = useState(true)
  const [verifiedCouncil, setVerifiedCouncil] = useState(true)
  const [pennyDropConfirmed, setPennyDropConfirmed] = useState(true)
  const [reason, setReason] = useState(
    'B.V.Sc degree verified with State Veterinary Council. Bank sub-ledger penny-drop match confirmed.'
  )

  useEffect(() => {
    if (vet) {
      setCouncilRegNo(vet.councilRegNo || '')
      setStatus(vet.status === 'pending_verification' ? 'verified_active' : vet.status || 'verified_active')
    }
  }, [vet])

  if (!isOpen || !vet) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(vet.id, {
      status,
      councilRegNo,
      verifiedBy: currentAdmin?.email || currentAdmin?.id || 'root@agrovercity',
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

// 2. Audit Gaushala Modal
export function AuditGaushalaModal({ isOpen, onClose, gaushala, onSubmit, loading, currentAdmin }) {
  const [status, setStatus] = useState('certified_active')
  const [welfareScore, setWelfareScore] = useState(95)
  const [certifyCensus, setCertifyCensus] = useState(true)
  const [notes, setNotes] = useState(
    'Bovine welfare inspection passed; shelter netting, green fodder stock, and 80G trust ledger verified compliant.'
  )

  useEffect(() => {
    if (gaushala) {
      setWelfareScore(gaushala.welfareAuditScore || 95)
      setStatus(gaushala.status || 'certified_active')
    }
  }, [gaushala])

  if (!isOpen || !gaushala) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(gaushala.id, {
      status,
      welfareAuditScore: Number(welfareScore),
      auditedBy: currentAdmin?.email || currentAdmin?.id || 'root@agrovercity',
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

// 3. Approve Nursery Modal
export function ApproveNurseryModal({ isOpen, onClose, nursery, onSubmit, loading, currentAdmin }) {
  const [status, setStatus] = useState('approved')
  const [inspectionGrade, setInspectionGrade] = useState('A+')
  const [subsidyEligible, setSubsidyEligible] = useState(true)
  const [notes, setNotes] = useState(
    'National Horticulture Board accreditation verified; certified grafted fruit saplings approved for MIDH subsidy catalog.'
  )

  useEffect(() => {
    if (nursery) {
      setInspectionGrade(nursery.inspectionGrade || 'A+')
      setSubsidyEligible(nursery.subsidyEligible !== undefined ? !!nursery.subsidyEligible : true)
      setStatus(nursery.status || 'approved')
    }
  }, [nursery])

  if (!isOpen || !nursery) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(nursery.id, {
      status,
      inspectionGrade,
      subsidyEligible,
      approvedBy: currentAdmin?.email || currentAdmin?.id || 'root@agrovercity',
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

// 4. Dairy Product Recall / Lab Clearance Modal
export function DairyProductRecallModal({ isOpen, onClose, product, onSubmit, loading, currentAdmin }) {
  const isRecallAction = product?.status === 'active'
  const [action, setAction] = useState('recalled')
  const [labReportId, setLabReportId] = useState('NABL-LAB-2026-CLEAR')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (product) {
      const isRecall = product.status === 'active'
      setAction(isRecall ? 'recalled' : 'active')
      setLabReportId(product.labReportId || 'NABL-LAB-2026-CLEAR')
      setReason(
        isRecall
          ? 'Adulteration screening flagged batch deviation; immediate platform recall and stock freeze enforced.'
          : 'NABL lab analysis confirmed 99.8% A2 beta-casein purity and antibiotic residue compliance.'
      )
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(product.id, {
      status: action,
      recallReason: action === 'recalled' ? reason : '',
      labReportId,
      updatedBy: currentAdmin?.email || currentAdmin?.id || 'root@agrovercity'
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

// 5. Mediate Vet Booking Modal
export function MediateVetBookingModal({ isOpen, onClose, booking, onSubmit, loading, activeVets = [], currentAdmin }) {
  const [action, setAction] = useState('refund_farmer')
  const [reassignVetId, setReassignVetId] = useState('')
  const [reason, setReason] = useState(
    'Emergency callout delayed beyond 45 mins; full escrow refund credited with courtesy voucher.'
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
      mediatedBy: currentAdmin?.email || currentAdmin?.id || 'root@agrovercity'
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

// 6. Dual Sign-Off Manure Order Modal
export function DualSignOffManureModal({ isOpen, onClose, order, onSubmit, loading, currentAdmin }) {
  const isSecondSignOff = !!order?.signOff1
  const [adminName, setAdminName] = useState(currentAdmin?.name || 'Chief Risk Officer')
  const [role, setRole] = useState(isSecondSignOff ? 'Chief Risk Officer' : 'Director of Finance')
  const [verifiedGatePass, setVerifiedGatePass] = useState(true)
  const [verifiedWeighbridge, setVerifiedWeighbridge] = useState(true)
  const [reason, setReason] = useState(
    'Dual sign-off counter-signed; weighbridge tare slip & logistics vehicle compliance authenticated.'
  )

  useEffect(() => {
    if (currentAdmin) {
      setAdminName(currentAdmin.name || 'Administrative Official')
    }
  }, [currentAdmin])

  if (!isOpen || !order) return null

  // Ensure same admin doesn't sign off twice if email matches
  const sameAdminAttempt = isSecondSignOff && order.signOff1?.adminUid === (currentAdmin?.email || currentAdmin?.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    const adminUid = currentAdmin?.email || currentAdmin?.id || (isSecondSignOff ? 'usr_cro_vikram' : 'usr_fin_ananya')
    onSubmit(order.id, {
      adminUid,
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

          {sameAdminAttempt && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>SOP-19 Compliance: Secondary sign-off must be performed by a different administrator.</span>
            </div>
          )}

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
                <option value="Super Admin">Super Admin</option>
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

// 7. Register Vet Doctor Modal
export function RegisterVetModal({ isOpen, onClose, onSubmit, loading, currentAdmin }) {
  const [formData, setFormData] = useState({
    name: '',
    degree: 'B.V.Sc & A.H., M.V.Sc (Veterinary Medicine)',
    councilRegNo: '',
    councilState: 'Maharashtra State Veterinary Council',
    regExpiryDate: '2029-12-31',
    experienceYears: 5,
    mobile: '',
    email: '',
    district: 'Pune',
    taluka: 'Haveli',
    clinicName: '',
    clinicAddress: '',
    emergencyCallout24x7: true,
    consultationFee: 400,
    emergencyNightFee: 750,
    specialization: 'Bovine Surgery, Insemination (AI), Calving Emergencies'
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Onboard Veterinary Doctor</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.1 • Direct Registration &amp; Qualification Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Doctor Full Name</label>
              <input
                type="text"
                placeholder="Dr. Anand S Kulkarni"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">State Council Reg No</label>
              <input
                type="text"
                placeholder="MSVC-2026-10492"
                required
                value={formData.councilRegNo}
                onChange={(e) => setFormData({ ...formData, councilRegNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Degree &amp; Specialization</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Practice Experience (Years)</label>
              <input
                type="number"
                min="1"
                max="45"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                required
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Contact</label>
              <input
                type="text"
                placeholder="+919822000000"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="dr.name@agrovercity.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Pune">Pune</option>
                <option value="Nashik">Nashik</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Solapur">Solapur</option>
                <option value="Satara">Satara</option>
                <option value="Aurangabad">Aurangabad</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Taluka</label>
              <input
                type="text"
                value={formData.taluka}
                onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Licence Expiry</label>
              <input
                type="date"
                value={formData.regExpiryDate}
                onChange={(e) => setFormData({ ...formData, regExpiryDate: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Clinic / Hospital Name</label>
              <input
                type="text"
                placeholder="Sahyadri Cattle Care"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Clinical Specializations (comma separated)</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Day OPD Fee (INR)</label>
              <input
                type="number"
                min="0"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Night Emergency (INR)</label>
              <input
                type="number"
                min="0"
                value={formData.emergencyNightFee}
                onChange={(e) => setFormData({ ...formData, emergencyNightFee: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.emergencyCallout24x7}
                  onChange={(e) => setFormData({ ...formData, emergencyCallout24x7: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>24x7 On-Call Dispatch</span>
              </label>
            </div>
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
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Registering...' : 'Register Veterinarian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 8. Register Gaushala Modal
export function RegisterGaushalaModal({ isOpen, onClose, onSubmit, loading, currentAdmin }) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    trustRegNo: '',
    charityCommissionNo: '',
    taxExempt80G: true,
    tax80GCertNo: '',
    founderName: '',
    contactPhone: '',
    district: 'Pune',
    taluka: 'Purandar',
    address: '',
    totalCattleHead: 200,
    monthlyManureCapacityMT: 45.0,
    biogasCapacityKwhPerDay: 120,
    panchagavyaProducts: 'Enriched Cow Dung Manure, Vermicompost Gold, Liquid Jeevamrit'
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      totalCattleHead: Number(formData.totalCattleHead),
      monthlyManureCapacityMT: Number(formData.monthlyManureCapacityMT),
      biogasCapacityKwhPerDay: Number(formData.biogasCapacityKwhPerDay),
      panchagavyaProducts: formData.panchagavyaProducts.split(',').map((s) => s.trim()).filter(Boolean)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Register Gaushala Bovine Sanctuary</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.2 • Trust Registration, Cattle Census &amp; Manure Capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gaushala Trust Full Name</label>
              <input
                type="text"
                placeholder="Shree Krishna Gopalan Trust"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Short Brand Name</label>
              <input
                type="text"
                placeholder="Shree Krishna Gaushala"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Charity Commissioner Trust No</label>
              <input
                type="text"
                placeholder="F-14520/Nashik"
                required
                value={formData.charityCommissionNo}
                onChange={(e) => setFormData({ ...formData, charityCommissionNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">80G Certificate No</label>
              <input
                type="text"
                placeholder="AAATS1420NF20214"
                value={formData.tax80GCertNo}
                onChange={(e) => setFormData({ ...formData, tax80GCertNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Founder / Managing Trustee</label>
              <input
                type="text"
                placeholder="Mahant Purushottam Das"
                required
                value={formData.founderName}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+919822000000"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Pune">Pune</option>
                <option value="Nashik">Nashik</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Solapur">Solapur</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Total Cattle Heads</label>
              <input
                type="number"
                min="10"
                value={formData.totalCattleHead}
                onChange={(e) => setFormData({ ...formData, totalCattleHead: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Monthly Manure (MT)</label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={formData.monthlyManureCapacityMT}
                onChange={(e) => setFormData({ ...formData, monthlyManureCapacityMT: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Panchagavya Products Offered</label>
            <input
              type="text"
              value={formData.panchagavyaProducts}
              onChange={(e) => setFormData({ ...formData, panchagavyaProducts: e.target.value })}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900"
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
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Registering...' : 'Register Gaushala'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 9. Register Nursery Modal
export function RegisterNurseryModal({ isOpen, onClose, onSubmit, loading, currentAdmin }) {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    nhbRegistrationNo: '',
    nhbRating: '3-Star Certified Nursery',
    ownerName: '',
    phone: '',
    district: 'Nashik',
    taluka: 'Dindori',
    nurseryAreaAcres: 5.0,
    polyhousesCount: 4,
    totalStockAvailable: 35000,
    annualSaplingCapacity: 80000,
    specialization: 'Grafted Kesar Mango, Bhagwa Pomegranate, Seedless Guava',
    subsidyEligible: true
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      nurseryAreaAcres: Number(formData.nurseryAreaAcres),
      polyhousesCount: Number(formData.polyhousesCount),
      totalStockAvailable: Number(formData.totalStockAvailable),
      annualSaplingCapacity: Number(formData.annualSaplingCapacity),
      specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Empanel Plant Nursery</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.3 • NHB Accreditation &amp; Govt Subsidy Distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nursery Commercial Name</label>
              <input
                type="text"
                placeholder="Sahyadri High-Tech Agri Nursery"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">NHB Registration No</label>
              <input
                type="text"
                placeholder="NHB-MH-4421/2026"
                required
                value={formData.nhbRegistrationNo}
                onChange={(e) => setFormData({ ...formData, nhbRegistrationNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Proprietor Name</label>
              <input
                type="text"
                placeholder="Suresh M Jadhav"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+919822000000"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Nashik">Nashik</option>
                <option value="Pune">Pune</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Ratnagiri">Ratnagiri</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                value={formData.nurseryAreaAcres}
                onChange={(e) => setFormData({ ...formData, nurseryAreaAcres: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Available Saplings</label>
              <input
                type="number"
                value={formData.totalStockAvailable}
                onChange={(e) => setFormData({ ...formData, totalStockAvailable: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Specialized Fruit &amp; Timber Saplings</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={formData.subsidyEligible}
                onChange={(e) => setFormData({ ...formData, subsidyEligible: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span>MIDH &amp; DBT Subsidy Distribution Authorized</span>
            </label>
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
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Empaneling...' : 'Empanel Nursery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 10. Register Dairy Product Modal
export function RegisterDairyProductModal({ isOpen, onClose, onSubmit, loading, currentAdmin }) {
  const [formData, setFormData] = useState({
    name: 'A2 Gir Cow Vedic Bilona Ghee',
    category: 'Desi Ghee',
    brandOrGaushala: 'Shree Krishna Gopalan Trust',
    packSize: '1000 ml Glass Jar',
    priceINR: 1750,
    stockAvailable: 200,
    batchNo: `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    fssaiLicenseNo: '11521045000214',
    a2BetaCaseinPurity: 99.9,
    antibioticResidueFree: true,
    fatPercentage: 99.8,
    snfPercentage: 0.1,
    storageTemp: 'Ambient',
    labReportId: `NABL-LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    labName: 'NABL Central Dairy Testing Lab, Pune'
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      priceINR: Number(formData.priceINR),
      stockAvailable: Number(formData.stockAvailable),
      a2BetaCaseinPurity: Number(formData.a2BetaCaseinPurity),
      fatPercentage: Number(formData.fatPercentage),
      snfPercentage: Number(formData.snfPercentage)
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Direct A2 Dairy SKU Batch</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.4 • NABL Purity Screening &amp; Cold Chain Storage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Dairy Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Desi Ghee">Desi Ghee</option>
                <option value="Fresh Milk">Fresh Milk</option>
                <option value="Paneer">Paneer</option>
                <option value="Cultured Dairy">Cultured Dairy / Chaas</option>
                <option value="Butter">Butter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Brand / Gaushala Source</label>
              <input
                type="text"
                required
                value={formData.brandOrGaushala}
                onChange={(e) => setFormData({ ...formData, brandOrGaushala: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Batch Number</label>
              <input
                type="text"
                required
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Price (INR)</label>
              <input
                type="number"
                min="1"
                value={formData.priceINR}
                onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Stock Units</label>
              <input
                type="number"
                min="1"
                value={formData.stockAvailable}
                onChange={(e) => setFormData({ ...formData, stockAvailable: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">A2 Beta-Casein %</label>
              <input
                type="number"
                step="0.1"
                min="80"
                max="100"
                value={formData.a2BetaCaseinPurity}
                onChange={(e) => setFormData({ ...formData, a2BetaCaseinPurity: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono text-emerald-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">FSSAI License No</label>
              <input
                type="text"
                required
                value={formData.fssaiLicenseNo}
                onChange={(e) => setFormData({ ...formData, fssaiLicenseNo: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">NABL Lab Report ID</label>
              <input
                type="text"
                required
                value={formData.labReportId}
                onChange={(e) => setFormData({ ...formData, labReportId: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={formData.antibioticResidueFree}
                onChange={(e) => setFormData({ ...formData, antibioticResidueFree: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span>Confirmed Antibiotic Residue-Free (Zero Tolerance Tested)</span>
            </label>
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
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Adding...' : 'Add Dairy SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 11. Create Vet Emergency Booking Modal
export function CreateVetBookingModal({ isOpen, onClose, onSubmit, loading, activeVets = [], currentAdmin }) {
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerPhone: '',
    village: '',
    district: 'Pune',
    animalType: 'Gir Cow',
    animalIdTag: `TAG-MH-${Math.floor(1000 + Math.random() * 9000)}`,
    urgencyLevel: 'critical_emergency',
    symptomsDescription: '',
    assignedVetId: activeVets[0]?.id || 'vet_01',
    totalAmount: 450
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedVet = activeVets.find((v) => v.id === formData.assignedVetId)
    onSubmit({
      ...formData,
      totalAmount: Number(formData.totalAmount),
      assignedVetName: selectedVet ? selectedVet.name : 'Assigned Emergency Doctor',
      vetPhone: selectedVet ? selectedVet.mobile : '+919822345012'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manual Emergency Vet Dispatch Intake</h3>
              <p className="text-xs text-slate-500">SOP-19 §3.5 • 24x7 Critical Triage &amp; Doctor Routing</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Farmer Full Name</label>
              <input
                type="text"
                placeholder="Namdev Shinde"
                required
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Farmer Mobile Phone</label>
              <input
                type="text"
                placeholder="+919822000000"
                required
                value={formData.farmerPhone}
                onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Village &amp; Farm Location</label>
              <input
                type="text"
                placeholder="Gat 45, Dindori Shivar"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Pune">Pune</option>
                <option value="Nashik">Nashik</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Solapur">Solapur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Animal Type</label>
              <input
                type="text"
                placeholder="Gir Cow (Pregnant)"
                required
                value={formData.animalType}
                onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Animal Tag No</label>
              <input
                type="text"
                value={formData.animalIdTag}
                onChange={(e) => setFormData({ ...formData, animalIdTag: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Triage Priority</label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-semibold"
              >
                <option value="critical_emergency">Critical Emergency (Immediate)</option>
                <option value="urgent">Urgent (&lt; 2 Hours)</option>
                <option value="scheduled_routine">Routine Consultation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assigned On-Call Veterinarian</label>
            <select
              value={formData.assignedVetId}
              onChange={(e) => setFormData({ ...formData, assignedVetId: e.target.value })}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {activeVets.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.district} • Fee: ₹{v.emergencyNightFee})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Clinical Symptoms &amp; Emergency Notes</label>
            <textarea
              rows={2}
              required
              placeholder="Severe colic symptoms, acute abdominal bloat and distress..."
              value={formData.symptomsDescription}
              onChange={(e) => setFormData({ ...formData, symptomsDescription: e.target.value })}
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
              className="px-4 py-2 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Dispatching...' : 'Dispatch Emergency Vet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 12. Create Bulk Manure Order Modal
export function CreateManureOrderModal({ isOpen, onClose, onSubmit, loading, gaushalas = [], currentAdmin }) {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    deliveryDestination: '',
    gaushalaId: gaushalas[0]?.id || 'gsh_01',
    productName: 'Enriched Cow Dung Manure',
    quantityMT: 15,
    pricePerMT: 3600,
    vehicleNumber: 'MH-15-EG-4402',
    driverName: 'Ramesh Dattatray Bhalerao',
    driverPhone: '+919860123456'
  })

  if (!isOpen) return null

  const totalAmountINR = Number(formData.quantityMT || 0) * Number(formData.pricePerMT || 0)
  const isHighValue = totalAmountINR > 50000

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedGsh = gaushalas.find((g) => g.id === formData.gaushalaId)
    onSubmit({
      ...formData,
      quantityMT: Number(formData.quantityMT),
      pricePerMT: Number(formData.pricePerMT),
      totalAmountINR,
      gaushalaName: selectedGsh ? selectedGsh.name : 'Certified Gaushala'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Initiate Bulk Manure Order</h3>
              <p className="text-xs text-slate-500">SOP-19 §6.3 • Gaushala Sourcing &amp; Dual Sign-off Guardrail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Buyer / FPO Entity Name</label>
              <input
                type="text"
                placeholder="Sahyadri Organic Farmers FPO"
                required
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Buyer Mobile Phone</label>
              <input
                type="text"
                placeholder="+919822000000"
                required
                value={formData.buyerPhone}
                onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Delivery Destination</label>
              <input
                type="text"
                placeholder="Pimpalgaon APMC Yard, Nashik"
                required
                value={formData.deliveryDestination}
                onChange={(e) => setFormData({ ...formData, deliveryDestination: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Source Gaushala</label>
              <select
                value={formData.gaushalaId}
                onChange={(e) => setFormData({ ...formData, gaushalaId: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {gaushalas.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.district} • {g.monthlyManureCapacityMT} MT/m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Quantity (Metric Tonnes)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={formData.quantityMT}
                onChange={(e) => setFormData({ ...formData, quantityMT: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Rate per MT (INR)</label>
              <input
                type="number"
                min="500"
                required
                value={formData.pricePerMT}
                onChange={(e) => setFormData({ ...formData, pricePerMT: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Calculated Total (INR)</label>
              <div className="px-3 py-2 rounded-xl bg-slate-100 font-bold font-mono text-emerald-800 text-sm">
                {fmtINR(totalAmountINR)}
              </div>
            </div>
          </div>

          {/* High-value Dual Sign-off Warning Notice */}
          {isHighValue && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>SOP-19 §6.3 High-Value Order (&gt; ₹50,000)</span>
              </div>
              <p className="text-[11px] text-purple-800">
                This bulk dispatch requires dual-admin authorization (CRO &amp; Director of Finance) before gate pass release.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assigned Vehicle Number</label>
              <input
                type="text"
                placeholder="MH-15-EG-4402"
                required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Driver Name &amp; Phone</label>
              <input
                type="text"
                placeholder="Ramesh Bhalerao (+919860123456)"
                required
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
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
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Creating...' : 'Create Manure Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 13. Reset Seed Data Modal
export function ResetSeedModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('Restoring standard SOP-19 benchmark seed data for auditing.')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-rose-100 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Module 19 Seed Data</h3>
              <p className="text-xs text-slate-500">Restore default Gaushalas, Vets, and Orders</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            This will reset all in-memory and local target collections for <strong className="text-slate-900 font-semibold">gaushalas, nurseries, vets, dairy_products, vet_bookings,</strong> and <strong className="text-slate-900 font-semibold">manure_orders</strong> back to their factory SOP-19 benchmark values.
          </p>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Administrative Justification</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-rose-50/20 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs"
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
              type="button"
              disabled={loading || !reason}
              onClick={() => onConfirm(reason)}
              className="px-4 py-2 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 14. Batch Action Modal
export function BatchActionModal({ isOpen, onClose, selectedCount, targetType, onConfirm, loading }) {
  const [action, setAction] = useState('approve')
  const [reason, setReason] = useState('Bulk administrative verification approved after panel review.')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Batch Update ({selectedCount} Selected)</h3>
              <p className="text-xs text-slate-500">Apply uniform status change with audit log</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onConfirm(action, reason)
          }}
          className="mt-4 space-y-4 text-xs"
        >
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Desired Status Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900"
            >
              {targetType === 'vets' && (
                <>
                  <option value="verified_active">Verify &amp; Activate Selected</option>
                  <option value="suspended">Suspend Selected</option>
                </>
              )}
              {targetType === 'gaushalas' && (
                <>
                  <option value="certified_active">Certify Compliant Selected</option>
                  <option value="flagged">Flag Selected for Audit</option>
                </>
              )}
              {targetType === 'nurseries' && (
                <>
                  <option value="approved">Empanel &amp; Approve Selected</option>
                  <option value="pending_inspection">Mark Pending Inspection</option>
                </>
              )}
              {targetType === 'dairy' && (
                <>
                  <option value="active">Clear Selected for Active Sale</option>
                  <option value="recalled">Enforce Batch Recall</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Administrative Reason</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 text-xs"
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
              disabled={loading || !reason}
              className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
            >
              {loading ? 'Updating...' : `Update ${selectedCount} Records`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
