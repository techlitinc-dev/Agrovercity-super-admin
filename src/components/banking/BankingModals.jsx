import React, { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle,
  Building2,
  Calculator,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  FileCheck,
  Info
} from 'lucide-react'
import { Button, Input, Select, Field } from '../ui'
import { fmtINR } from './BankingDetailDrawer'

// PARTNER BANKS ROSTER FOR ROUTING
export const PARTNER_BANKS = [
  'State Bank of India',
  'Maharashtra Gramin Bank',
  'Bank of Baroda',
  'HDFC Rural Banking',
  'Bank of Maharashtra',
  'ICICI Bank'
]

// -------------------------------------------------------------
// 1. UNDERWRITE LOAN MODAL (WITH DUAL SIGN-OFF ENFORCEMENT > ₹50k)
// -------------------------------------------------------------
export function UnderwriteLoanModal({ open, loan, onClose, onSubmit, busy }) {
  const [decision, setDecision] = useState('approved') // 'approved' | 'rejected'
  const [partnerBank, setPartnerBank] = useState('')
  const [partnerBranch, setPartnerBranch] = useState('')
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [dualSignOffAdmin, setDualSignOffAdmin] = useState('')

  useEffect(() => {
    if (loan) {
      setDecision('approved')
      setPartnerBank(loan.partnerBank || PARTNER_BANKS[0])
      setPartnerBranch(loan.partnerBankBranch || `${loan.district || 'Main'} Agri Branch`)
      setNotes('')
      setReason('')
      setDualSignOffAdmin(loan.dualSignOffAdmin || '')
    }
  }, [loan])

  if (!open || !loan) return null

  const isLargeFacility = loan.amount > 50000
  const requiresDualSignOff = isLargeFacility && decision === 'approved'
  const blocked =
    (decision === 'rejected' && reason.trim().length < 5) ||
    (requiresDualSignOff && dualSignOffAdmin.trim().length < 5)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (blocked) return
    onSubmit({
      status: decision,
      partnerBank,
      partnerBankBranch: partnerBranch,
      notes: notes.trim(),
      reason: reason.trim(),
      dualSignOffAdmin: requiresDualSignOff ? dualSignOffAdmin.trim() : null
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Underwrite Loan Facility</h2>
              <p className="text-xs text-slate-400 font-mono">
                App #{loan.applicationId || loan.id} · {loan.farmerName} ({fmtINR(loan.amount)})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Decision Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDecision('approved')}
              className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                decision === 'approved'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Approve Facility
            </button>
            <button
              type="button"
              onClick={() => setDecision('rejected')}
              className={`p-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-2 ${
                decision === 'rejected'
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Reject Application
            </button>
          </div>

          {/* SOP-14 §6.3 Dual Sign-Off Alert for amounts > ₹50,000 */}
          {requiresDualSignOff && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dual-Admin Sign-Off Required (SOP-14 §6.3)</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Facilities exceeding <strong>₹50,000</strong> require authorization from a second certified financial administrator before sanction.
              </p>
              <Field label="Co-Signing Administrator UID / Email">
                <Input
                  value={dualSignOffAdmin}
                  onChange={(e) => setDualSignOffAdmin(e.target.value)}
                  placeholder="e.g. auditor@agrovercity"
                  required
                />
              </Field>
            </div>
          )}

          {decision === 'approved' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Partner Routing Bank">
                  <Select
                    options={PARTNER_BANKS.map((b) => ({ label: b, value: b }))}
                    value={partnerBank}
                    onChange={(e) => setPartnerBank(e.target.value)}
                  />
                </Field>
                <Field label="Routing Branch">
                  <Input
                    value={partnerBranch}
                    onChange={(e) => setPartnerBranch(e.target.value)}
                    placeholder="e.g. Baramati Main"
                  />
                </Field>
              </div>

              <Field label="Underwriter Sanction Conditions / Notes">
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Hypothecation deed verified; prompt repayment subvention eligible"
                />
              </Field>
            </>
          ) : (
            <Field label="Mandatory Rejection Rationale (Audit Log)">
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. DSCR 1.15 below minimum statutory threshold (1.25)"
                required
              />
            </Field>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decision === 'approved' ? 'primary' : 'danger'}
              disabled={blocked || busy}
            >
              {busy ? 'Processing…' : decision === 'approved' ? 'Confirm Sanction' : 'Reject Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 2. MANUAL PENNY-DROP OVERRIDE MODAL
// -------------------------------------------------------------
export function PennyDropOverrideModal({ open, account, onClose, onSubmit, busy }) {
  const [reason, setReason] = useState('')
  const [docSource, setDocSource] = useState('physical_passbook')

  useEffect(() => {
    if (account) {
      setReason('')
      setDocSource('physical_passbook')
    }
  }, [account])

  if (!open || !account) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (reason.trim().length < 5) return
    onSubmit({
      reason: `${docSource.replace('_', ' ').toUpperCase()}: ${reason.trim()}`
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Manual Penny-Drop Override</h2>
              <p className="text-xs text-slate-400 font-mono">
                {account.farmerName} · {account.bankName} ({account.accountNumberMasked})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Override the automated NPCI penny-drop failure. This manual intervention will mark the account as <strong>VERIFIED</strong> in the payout ledger.
          </p>

          <Field label="Verification Document Evidence">
            <Select
              value={docSource}
              onChange={(e) => setDocSource(e.target.value)}
              options={[
                { label: 'Attested Physical Passbook Copy', value: 'physical_passbook' },
                { label: 'Cancelled Cheque Leaf with Preprinted Name', value: 'cancelled_cheque' },
                { label: 'Branch Manager Written Confirmation Letter', value: 'branch_letter' },
                { label: 'KVK Agronomist / Talathi Field Verification', value: 'field_attestation' }
              ]}
            />
          </Field>

          <Field label="Administrative Reason (Mandatory Audit Trail)">
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Name spelling matched with Aadhaar KYC via branch stamp"
              required
            />
          </Field>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={reason.trim().length < 5 || busy}
            >
              {busy ? 'Saving…' : 'Approve Override'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 3. LOAN EMI CALCULATOR & SIMULATOR MODAL
// -------------------------------------------------------------
export function EmiCalculatorModal({ open, initialLoan, onClose }) {
  const [amount, setAmount] = useState(initialLoan?.amount || 50000)
  const [tenure, setTenure] = useState(initialLoan?.tenureMonths || 12)
  const [interestRate, setInterestRate] = useState(initialLoan?.standardInterestRate || 7.0)
  const [subventionActive, setSubventionActive] = useState(true)
  const subventionRate = 3.0 // Standard Govt Prompt Repayment Subvention

  useEffect(() => {
    if (initialLoan) {
      setAmount(initialLoan.amount || 50000)
      setTenure(initialLoan.tenureMonths || 12)
      setInterestRate(initialLoan.standardInterestRate || 7.0)
      setSubventionActive(Boolean(initialLoan.interestSubventionEligible))
    }
  }, [initialLoan])

  if (!open) return null

  const effectiveRate = Math.max(0, interestRate - (subventionActive ? subventionRate : 0))
  const r = effectiveRate / 12 / 100
  let emi = 0
  if (r === 0) {
    emi = Math.round(amount / tenure)
  } else {
    emi = Math.round((amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1))
  }
  const totalPayable = emi * tenure
  const totalInterest = Math.max(0, totalPayable - amount)

  // Generate brief amortization rows
  const schedule = []
  let balance = amount
  for (let m = 1; m <= Math.min(12, tenure); m++) {
    const interestMonth = Math.round(balance * r)
    const principalMonth = Math.min(balance, emi - interestMonth)
    balance = Math.max(0, balance - principalMonth)
    schedule.push({ month: m, emi, principalMonth, interestMonth, balance })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Agricultural Loan EMI Simulator</h2>
              <p className="text-xs text-slate-400">
                Statutory interest calculation with prompt repayment incentive (SOP-14 §1)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Principal Amount:</span>
                <span className="font-mono text-emerald-400 font-bold">{fmtINR(amount)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹10,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Loan Tenure:</span>
                <span className="font-mono text-emerald-400 font-bold">{tenure} Months</span>
              </div>
              <input
                type="range"
                min={3}
                max={36}
                step={3}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3 mo</span>
                <span>12 mo (1 yr)</span>
                <span>24 mo</span>
                <span>36 mo</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Base Interest Rate:</span>
                <span className="font-mono text-slate-200">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={4.0}
                max={12.0}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800"
              />
            </div>

            {/* Interest subvention switch */}
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-200">Govt Interest Subvention (3%)</span>
                <input
                  type="checkbox"
                  checked={subventionActive}
                  onChange={(e) => setSubventionActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Effective rate with 3% prompt repayment incentive: <strong className="text-emerald-400 font-mono">{effectiveRate}% p.a.</strong>
              </p>
            </div>
          </div>

          {/* Results Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Estimated Monthly EMI</span>
              <p className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">{fmtINR(emi)}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">for {tenure} installments</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Borrowed:</span>
                <span className="font-mono text-slate-100">{fmtINR(amount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest Payable:</span>
                <span className="font-mono text-amber-400 font-semibold">{fmtINR(totalInterest)}</span>
              </div>
              <div className="flex justify-between text-slate-200 font-bold pt-2 border-t border-slate-800">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-emerald-300">{fmtINR(totalPayable)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300/90 leading-relaxed">
              Institutional Benchmark: Net DSCR acceptable when EMI is below 35% of verified monthly agricultural yield revenue.
            </div>
          </div>
        </div>

        {/* Amortization preview */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Amortization Schedule (First {Math.min(12, tenure)} Months)
          </h3>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">Mo</th>
                  <th className="p-2">EMI</th>
                  <th className="p-2">Principal</th>
                  <th className="p-2">Interest</th>
                  <th className="p-2">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-800/30">
                    <td className="p-2 text-slate-500">{row.month}</td>
                    <td className="p-2 font-semibold text-emerald-400">{fmtINR(row.emi)}</td>
                    <td className="p-2">{fmtINR(row.principalMonth)}</td>
                    <td className="p-2 text-amber-300">{fmtINR(row.interestMonth)}</td>
                    <td className="p-2 text-slate-400">{fmtINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close Simulator
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 4. KISAN CREDIT SCORE ALGORITHM CALIBRATION MODAL
// -------------------------------------------------------------
export function CreditScoreCalibrateModal({ open, model, onClose, onSubmit, busy }) {
  const [factors, setFactors] = useState([])

  useEffect(() => {
    if (model?.scoringFactors) {
      setFactors(JSON.parse(JSON.stringify(model.scoringFactors)))
    }
  }, [model])

  if (!open || !model) return null

  const totalWeight = factors.reduce((sum, f) => sum + Number(f.weight || 0), 0)
  const isValid = totalWeight === 100

  const handleWeightChange = (index, value) => {
    const updated = [...factors]
    updated[index].weight = Number(value)
    setFactors(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit({ scoringFactors: factors })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Calibrate Kisan Credit Score Weights</h2>
              <p className="text-xs text-slate-400 font-mono">
                Model: {model.version} · Last calibrated: {model.lastCalibratedAt?.slice(0, 10)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-300">
            Adjust statistical factor weights for the credit assessment engine. Total weight across all 5 dimensions must sum to exactly <strong>100%</strong>.
          </p>

          <div className="space-y-3">
            {factors.map((factor, idx) => (
              <div key={factor.factorKey} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{factor.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{factor.weight}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={factor.weight}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="w-full accent-emerald-500 bg-slate-800"
                />
                <p className="text-[10px] text-slate-400">{factor.description}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg border flex items-center justify-between text-xs font-mono font-bold ${
            isValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }">
            <span>Aggregate Factor Weight:</span>
            <span>{totalWeight}% / 100% {isValid ? '✓ Valid' : '✗ Must equal 100%'}</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isValid || busy}>
              {busy ? 'Saving…' : 'Publish Algorithm Calibration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 5. RECALIBRATE KCC LIMIT MODAL
// -------------------------------------------------------------
export function KccLimitModal({ open, kcc, onClose, onSubmit, busy }) {
  const [newLimit, setNewLimit] = useState(kcc?.kccLimit || 100000)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (kcc) {
      setNewLimit(kcc.kccLimit || 100000)
      setReason('')
    }
  }, [kcc])

  if (!open || !kcc) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (reason.trim().length < 5) return
    onSubmit({
      newLimit: Number(newLimit),
      reason: reason.trim()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Recalibrate KCC Credit Limit</h2>
              <p className="text-xs text-slate-400 font-mono">
                {kcc.farmerName} · Current: {fmtINR(kcc.kccLimit)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Proposed KCC Sanction Limit (INR)">
            <Input
              type="number"
              step={10000}
              min={25000}
              max={500000}
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              required
            />
          </Field>

          <Field label="Administrative Rationale (Audit Trail)">
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Additional 2.5 acres drip land verified via 7/12 Mahabhulekh"
              required
            />
          </Field>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={reason.trim().length < 5 || busy}
            >
              {busy ? 'Saving…' : 'Update Limit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 6. DPDP ACT MASKING COMPLIANCE AUDIT MODAL
// -------------------------------------------------------------
export function DpdpComplianceModal({ open, auditResult, onClose }) {
  if (!open || !auditResult) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">DPDP Act Compliance Verification</h2>
              <p className="text-xs text-slate-400 font-mono">
                Data Protection & Masking Audit (SOP-14 §6.4)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Audit Result: 100% COMPLIANT</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              All bank accounts in `bank_accounts` and loans in `loan_applications` strictly enforce <strong>XXXX + last 4 digit</strong> masking. Aadhaar numbers adhere to <strong>XXXX-XXXX-1234</strong> masking.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-2 font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Accounts Audited:</span>
              <span>{auditResult.totalAudited}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Passed DPDP Masking:</span>
              <span className="text-emerald-400">{auditResult.passedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Raw Data Leaks Detected:</span>
              <span className="text-emerald-400">{auditResult.leaksDetected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span>{auditResult.timestamp?.replace('T', ' ').slice(0, 19)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Rule Reference: Digital Personal Data Protection (DPDP) Act 2023 & RBI Master Direction on Digital Lending.
          </p>

          <div className="pt-2 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Dismiss Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
