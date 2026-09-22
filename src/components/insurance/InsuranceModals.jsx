import React, { useState, useEffect } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Coins,
  Sliders,
  UserCheck,
  Lock,
  Building2,
  FileCheck
} from 'lucide-react'
import { fmtINR } from '../../pages/insuranceWidgets'

// 1. ASSIGN SURVEYOR MODAL
export function AssignSurveyorModal({ open, claim, surveyors = [], onClose, onConfirm }) {
  const [selectedSurveyorId, setSelectedSurveyorId] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [priority, setPriority] = useState('normal')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (claim) {
      const defaultDate = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
      setVisitDate(defaultDate)
      setSelectedSurveyorId(surveyors[0]?.id || '')
      setPriority(claim.calamityType.includes('Flood') || claim.calamityType.includes('Cyclone') ? 'urgent' : 'normal')
      setNotes(`Conduct thorough in-field loss assessment for ${claim.landAreaAcres} acres of ${claim.cropName}. Record geotagged close-up photos of pod/canopy damage.`)
    }
  }, [claim, surveyors])

  if (!open || !claim) return null

  const selectedSurveyor = surveyors.find((s) => s.id === selectedSurveyorId) || surveyors[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        surveyorId: selectedSurveyor?.id,
        surveyorName: selectedSurveyor?.name,
        surveyorPhone: selectedSurveyor?.phone,
        surveyorAgency: selectedSurveyor?.agency,
        surveyorVisitDate: visitDate,
        priority,
        notes,
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
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-sky-700 mb-4">
          <UserCheck className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-extrabold text-slate-900">Assign Field Surveyor</h3>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Claim Ref:</span>
            <span className="font-mono font-bold text-emerald-700">{claim.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Farmer:</span>
            <span className="text-slate-900 font-bold">{claim.farmerName} ({claim.village}, {claim.district})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Crop & Area:</span>
            <span className="text-slate-800 font-semibold">{claim.cropName} · {claim.landAreaAcres} Acres</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Select Panel Surveyor (Insurance Partner Panel)
            </label>
            <select
              value={selectedSurveyorId}
              onChange={(e) => setSelectedSurveyorId(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {surveyors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.agency} ({s.activeCaseload} active)
                </option>
              ))}
            </select>
            {selectedSurveyor && (
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Assigned to: {selectedSurveyor.assignedDistricts?.join(', ')} · SLA Score: {selectedSurveyor.slaScore}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Scheduled Inspection Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Inspection Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="normal">Normal (48-72h SLA)</option>
                <option value="urgent">Urgent / Cloudburst Event (24h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Field Surveyor Instructions & Focus</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2. REVIEW SURVEYOR ASSESSMENT MODAL
export function ReviewSurveyorAssessmentModal({ open, claim, onClose, onConfirm }) {
  const [lossPercent, setLossPercent] = useState(70)
  const [cropStage, setCropStage] = useState('')
  const [remarks, setRemarks] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (claim) {
      setLossPercent(claim.surveyorLossPercent ?? claim.estimatedLossPercent ?? 70)
      setCropStage(claim.cropStage || 'Vegetative')
      setRemarks(claim.surveyorReportNotes || 'Field assessment verified on ground. Canopy loss consistent with localized weather incident.')
    }
  }, [claim])

  if (!open || !claim) return null

  const computedPayout = Math.round((claim.sumInsuredTotal * Number(lossPercent)) / 100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        surveyorLossPercent: Number(lossPercent),
        cropStage,
        surveyorReportNotes: remarks,
        adminUid: 'superadmin_root'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-purple-700 mb-4">
          <FileCheck className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-extrabold text-slate-900">Review Surveyor Findings</h3>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs mb-4 space-y-1.5 font-mono">
          <div className="flex justify-between text-slate-600">
            <span>Claim Ref:</span>
            <span className="text-emerald-700 font-bold">{claim.claimNumber}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Sum Insured:</span>
            <span className="text-slate-900 font-bold">{fmtINR(claim.sumInsuredTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Farmer Claimed Loss:</span>
            <span className="text-amber-700 font-bold">{claim.estimatedLossPercent}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">Surveyor Verified Damage Loss (%)</label>
              <span className="text-base font-bold font-mono text-purple-700">{lossPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={lossPercent}
              onChange={(e) => setLossPercent(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 font-medium">
              <span>0% (No Loss)</span>
              <span>33% (PMFBY Threshold)</span>
              <span>100% (Total Crop Failure)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-purple-800 font-bold block">Calculated Assessed Payout:</span>
              <p className="text-[10px] text-slate-500">Sum Insured × Verified Loss %</p>
            </div>
            <span className="text-lg font-black font-mono text-purple-800">{fmtINR(computedPayout)}</span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Crop Growth Stage Verified</label>
            <input
              type="text"
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Surveyor Technical Remarks & Field Log</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Saving...' : 'Record Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 3. APPROVE CLAIM & DBT DISBURSAL MODAL
export function ApproveDbtDisbursalModal({ open, claim, onClose, onConfirm }) {
  const [amount, setAmount] = useState(0)
  const [dbtTxnId, setDbtTxnId] = useState('')
  const [autoDbt, setAutoDbt] = useState(true)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (claim) {
      const defaultAmt = claim.approvedAmount || (claim.sumInsuredTotal && claim.surveyorLossPercent
        ? Math.round((claim.sumInsuredTotal * claim.surveyorLossPercent) / 100)
        : claim.requestedAmount)
      setAmount(defaultAmt)
      const generatedTxn = `DBT2026${new Date().getMonth() + 1}${new Date().getDate()}MH${Math.floor(100000 + Math.random() * 900000)}`
      setDbtTxnId(claim.dbtTransactionId || generatedTxn)
      setNote(`Approved DBT payout under PMFBY Clause 18. Verified against surveyor findings.`)
    }
  }, [claim])

  if (!open || !claim) return null

  const isDualSignOff = Number(amount) > 50000

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        newStatus: 'dbtApproved',
        approvedAmount: Number(amount),
        dbtTransactionId: dbtTxnId,
        note,
        adminUid: 'usr_admin_vikram',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-4">
          <Coins className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-extrabold text-slate-900">Authorize Claim Payout & DBT Disbursal</h3>
        </div>

        {/* Dual Sign-Off Alert Banner if > ₹50k per SOP-15 §6.3 */}
        {isDualSignOff && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-4 flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-bold">Dual Sign-Off Mandated by SOP-15 §6.3:</span>
              <p className="text-[11px] mt-0.5 text-slate-600">
                Claim payout exceeds ₹50,000 threshold ({fmtINR(amount)}). This authorization records Primary Risk Sign-Off. A secondary administrative director sign-off is required to release the DBT batch.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Beneficiary:</span>
              <span className="font-bold text-slate-900">{claim.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Bank & Masked Account:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {claim.bankName || 'SBI'} · XXXX-XXXX-{claim.bankAccountLast4 || '4521'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">IFSC Code:</span>
              <span className="font-mono text-emerald-700 font-bold">{claim.ifsc || 'SBIN0001234'}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Approved Payout Compensation (₹ INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">DBT Gateway Transaction Reference / UTR</label>
            <input
              type="text"
              value={dbtTxnId}
              onChange={(e) => setDbtTxnId(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Administrative Sign-Off Rationale</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Processing...' : isDualSignOff ? 'Approve & Request 2nd Sign-Off' : 'Approve & Release DBT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 4. SECONDARY DUAL SIGN-OFF MODAL (> ₹50,000 Payouts)
export function SecondSignOffModal({ open, claim, onClose, onConfirm }) {
  const [notes, setNotes] = useState('Secondary financial sign-off granted. Verified bank mandate and calamity intimation report.')
  const [advanceDisbursed, setAdvanceDisbursed] = useState(true)
  const [busy, setBusy] = useState(false)

  if (!open || !claim) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        claimId: claim.id,
        notes,
        advanceToDisbursed: advanceDisbursed,
        adminUid: 'usr_admin_ananya',
        adminName: 'Ananya Deshmukh (Director Finance)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-amber-700 mb-4">
          <Lock className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-extrabold text-slate-900">Dual Admin Sign-Off (SOP-15 §6.3)</h3>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Claim:</span>
            <span className="font-mono text-emerald-700 font-bold">{claim.claimNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Farmer Beneficiary:</span>
            <span className="text-slate-900 font-bold">{claim.farmerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Approved Payout:</span>
            <span className="font-mono font-bold text-amber-700 text-sm">
              {fmtINR(claim.approvedAmount)}
            </span>
          </div>
          <div className="pt-2 border-t border-amber-200/60 text-slate-600">
            <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Primary Sign-Off Recorded:</span>
            <span className="text-slate-900 font-semibold">{claim.firstSignOff?.adminName || 'Vikram Mehta (Chief Risk Officer)'}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">{claim.firstSignOff?.notes || 'Approved risk assessment.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Secondary Approver (Director Finance) Sign-Off Remarks
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={advanceDisbursed}
              onChange={(e) => setAdvanceDisbursed(e.target.checked)}
              className="rounded bg-emerald-50 border-slate-300 text-emerald-600 focus:ring-0"
            />
            <span>Simultaneously mark claim as Disbursed via NPCI APBS</span>
          </label>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Authorizing...' : 'Authorize Dual Sign-Off'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. REJECT CLAIM MODAL (With Audit Reason Mandate)
export function RejectClaimModal({ open, claim, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [preset, setPreset] = useState('72h')
  const [busy, setBusy] = useState(false)

  const presets = {
    '72h': 'Calamity intimation delayed beyond statutory 72-hour window without block disaster declaration waiver.',
    threshold: 'Field survey loss assessment verified below 33% PMFBY minimum statutory threshold for calamity compensation.',
    unrelated: 'Crop damage caused by unapproved farm management practices rather than notified localized calamity.',
    gps: 'Uploaded photographs failed cryptographic GPS integrity check; coordinates mismatch revenue village plot.'
  }

  useEffect(() => {
    setReason(presets[preset])
  }, [preset])

  if (!open || !claim) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        newStatus: 'rejected',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-rose-700 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-extrabold text-slate-900">Reject Insurance Claim (Audit Log Mandated)</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          Per SOP-15 §4.1, rejecting an insurance claim requires entering a clear administrative reason that will be logged in immutable audit records and communicated to the farmer with formal appeal guidelines.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Standard Rejection Precedent</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="72h">Exceeded 72-Hour Calamity Intimation Window</option>
              <option value="threshold">Loss Below Statutory 33% Threshold</option>
              <option value="unrelated">Damage Not Caused by Notified Calamity</option>
              <option value="gps">Geotag / GPS Mismatch Fraud Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Detailed Rejection Reason for Audit Log</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Farmer Appeal Safeguard (F15):</span>
            <p>
              The farmer will receive a notification outlining photo guidelines and can lodge a formal appeal with updated revenue officer certificate.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Rejecting...' : 'Confirm Claim Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 6. EDIT CROP RATE & SUBSIDY MODAL
export function EditRateModal({ open, rate, onClose, onConfirm }) {
  const [cropName, setCropName] = useState('')
  const [vernacularCropName, setVernacularCropName] = useState('')
  const [season, setSeason] = useState('kharif')
  const [category, setCategory] = useState('Food Crops')
  const [sumInsured, setSumInsured] = useState(40000)
  const [farmerShare, setFarmerShare] = useState(2.0)
  const [actuarialRate, setActuarialRate] = useState(12.0)
  const [cutoffDate, setCutoffDate] = useState('2026-07-31')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (rate) {
      setCropName(rate.cropName || '')
      setVernacularCropName(rate.vernacularCropName || '')
      setSeason(rate.season || 'kharif')
      setCategory(rate.category || 'Food Crops')
      setSumInsured(rate.sumInsuredPerAcre || 40000)
      setFarmerShare(rate.farmerSharePercent || 2.0)
      setActuarialRate(rate.totalActuarialRatePercent || 12.0)
      setCutoffDate(rate.cutoffDate || '2026-07-31')
    } else {
      setCropName('')
      setVernacularCropName('')
      setSeason('kharif')
      setCategory('Food Crops')
      setSumInsured(40000)
      setFarmerShare(2.0)
      setActuarialRate(12.0)
      setCutoffDate('2026-07-31')
    }
  }, [rate])

  if (!open) return null

  const govtSubsidy = Math.max(0, Number((actuarialRate - farmerShare).toFixed(2)))
  const centralShare = Number((govtSubsidy / 2).toFixed(2))
  const stateShare = Number((govtSubsidy / 2).toFixed(2))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        cropName,
        vernacularCropName,
        season,
        category,
        sumInsuredPerAcre: Number(sumInsured),
        farmerSharePercent: Number(farmerShare),
        totalActuarialRatePercent: Number(actuarialRate),
        govtSubsidyPercent: govtSubsidy,
        centralSharePercent: centralShare,
        stateSharePercent: stateShare,
        cutoffDate
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-4">
          <Sliders className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-extrabold text-slate-900">
            {rate ? 'Update Crop Premium Rate & Subsidy' : 'Add New Seasonal Crop Rate'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Crop Name (English)</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                required
                placeholder="e.g. Soybean"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Vernacular Name</label>
              <input
                type="text"
                value={vernacularCropName}
                onChange={(e) => setVernacularCropName(e.target.value)}
                placeholder="e.g. सोयाबीन"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Season</label>
              <select
                value={season}
                onChange={(e) => {
                  const s = e.target.value
                  setSeason(s)
                  if (s === 'kharif') setFarmerShare(2.0)
                  else if (s === 'rabi') setFarmerShare(1.5)
                  else setFarmerShare(5.0)
                }}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="annual">Annual Commercial / Hort.</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Food Crops">Food Crops (Cereals/Millets)</option>
                <option value="Food Crops (Pulses)">Food Crops (Pulses)</option>
                <option value="Oilseeds">Oilseeds</option>
                <option value="Annual Commercial / Horticultural">Commercial / Horticultural</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Sum Insured Per Acre (₹)</label>
              <input
                type="number"
                value={sumInsured}
                onChange={(e) => setSumInsured(Number(e.target.value))}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Cutoff Enrollment Date</label>
              <input
                type="date"
                value={cutoffDate}
                onChange={(e) => setCutoffDate(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Farmer Share % (Statutory)</label>
              <input
                type="number"
                step="0.1"
                value={farmerShare}
                onChange={(e) => setFarmerShare(Number(e.target.value))}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-emerald-700 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Total Actuarial Rate %</label>
              <input
                type="number"
                step="0.1"
                value={actuarialRate}
                onChange={(e) => setActuarialRate(Number(e.target.value))}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Computed government subsidy split */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-bold text-slate-700">Govt Subsidy (Actuarial - Farmer):</span>
              <span className="text-sky-700 font-bold">{govtSubsidy}%</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>Central Govt Share (50%):</span>
              <span className="text-slate-700 font-semibold">{centralShare}%</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>State Govt Share (50%):</span>
              <span className="text-slate-700 font-semibold">{stateShare}%</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Saving...' : 'Save Rate Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 7. AUDIT COMPLIANCE MODAL (DPDP Masking & 72h Window)
export function DpdpComplianceModal({ open, result, onClose }) {
  if (!open || !result) return null

  const { dpdpCompliance, calamityIntimationRule } = result

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Regulatory Compliance & Security Audit
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Audit Report timestamp: {new Date(result.timestamp).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* 1. DPDP Act Compliance Check */}
        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">
              1. Digital Personal Data Protection (DPDP) Act 2023
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold">
              PASS ({dpdpCompliance.passRate}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Aadhaar numbers are masked in all superadmin grids and drawers (XXXX-XXXX-1234). Bank account numbers display last-4 digits only.
          </p>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Claims Audited:</span>
              <span className="text-slate-900 font-bold">{dpdpCompliance.totalAudited}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Aadhaar Masked:</span>
              <span className="text-emerald-700 font-bold">{dpdpCompliance.aadhaarMaskedCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Plaintext Leaks:</span>
              <span className="text-emerald-700 font-bold">{dpdpCompliance.aadhaarLeaks} (0 Leaks)</span>
            </div>
          </div>
        </div>

        {/* 2. PMFBY 72-Hour Calamity Intimation Rule Check */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">
              2. PMFBY 72-Hour Calamity Intimation Window Audit
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                calamityIntimationRule.flaggedLateCount > 0
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {calamityIntimationRule.flaggedLateCount > 0
                ? `${calamityIntimationRule.flaggedLateCount} Flagged Late`
                : '100% Compliant'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">{calamityIntimationRule.rule}</p>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Intimated &le; 72 Hours:</span>
              <span className="text-emerald-700 font-bold">
                {calamityIntimationRule.within72HoursCount} Claims
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Flagged &gt; 72 Hours:</span>
              <span className="text-rose-700 font-bold">
                {calamityIntimationRule.flaggedLateCount} Claims
              </span>
            </div>
          </div>

          {calamityIntimationRule.lateClaims?.length > 0 && (
            <div className="pt-2">
              <span className="font-bold text-slate-800 block mb-1 text-[11px]">
                Flagged Late Claims Requiring Special Disaster Waiver:
              </span>
              <div className="space-y-1">
                {calamityIntimationRule.lateClaims.map((lc) => (
                  <div
                    key={lc.claimNumber}
                    className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px] font-mono"
                  >
                    <span className="text-slate-800 font-semibold">
                      {lc.claimNumber} — {lc.farmerName}
                    </span>
                    <span className="text-rose-700 font-bold">{lc.elapsedHours?.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Acknowledge Audit Findings
          </button>
        </div>
      </div>
    </div>
  )
}
