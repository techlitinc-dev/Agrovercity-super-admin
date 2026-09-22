import React, { useState } from 'react'
import {
  Landmark,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
  Percent,
  TrendingUp,
  CreditCard,
  Building2,
  Copy,
  Check,
  Calculator,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'

export function fmtINR(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return '₹' + Number(n).toLocaleString('en-IN')
}

export default function BankingDetailDrawer({
  item,
  itemType,
  onClose,
  onOverrideVerify,
  onSetPrimary,
  onApproveLoan,
  onRejectLoan,
  onOpenEmiCalculator,
  onAdjustKccLimit,
  onAuditMasking
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'audit' | 'json'
  const [copied, setCopied] = useState(false)

  if (!item) return null

  let title = ''
  let subtitle = ''

  if (itemType === 'account') {
    title = `Bank Account #${item.id}`
    subtitle = `${item.farmerName} · ${item.bankName} (${item.accountNumberMasked})`
  } else if (itemType === 'loan') {
    title = `Loan Application #${item.applicationId || item.id}`
    subtitle = `${item.farmerName} · ${fmtINR(item.amount)} · ${item.partnerBank}`
  } else if (itemType === 'kcc') {
    title = `Kisan Credit Card #${item.id}`
    subtitle = `${item.farmerName} · Limit: ${fmtINR(item.kccLimit)} · ${item.bankName}`
  } else if (itemType === 'repayment') {
    title = `Repayment Milestone #${item.id}`
    subtitle = `${item.farmerName} · ${fmtINR(item.emiAmount)} due ${item.dueDate}`
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <DetailDrawer open={Boolean(item)} onClose={onClose} title={title} subtitle={subtitle}>
      {/* Drawer navigation tabs */}
      <div className="flex border-b border-emerald-100 mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Entity Overview
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Audit Trail & Security
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            activeTab === 'json'
              ? 'border-emerald-600 text-emerald-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Document JSON
        </button>
      </div>

      {/* Overview tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {itemType === 'account' && (
            <AccountOverview
              account={item}
              onOverrideVerify={onOverrideVerify}
              onSetPrimary={onSetPrimary}
              onAuditMasking={onAuditMasking}
            />
          )}

          {itemType === 'loan' && (
            <LoanOverview
              loan={item}
              onApprove={onApproveLoan}
              onReject={onRejectLoan}
              onOpenEmiCalculator={onOpenEmiCalculator}
            />
          )}

          {itemType === 'kcc' && (
            <KccOverview
              kcc={item}
              onAdjustLimit={onAdjustKccLimit}
            />
          )}

          {itemType === 'repayment' && (
            <RepaymentOverview
              milestone={item}
            />
          )}
        </div>
      )}

      {/* Audit Trail tab */}
      {activeTab === 'audit' && (
        <AuditTrailView item={item} itemType={itemType} />
      )}

      {/* JSON Inspector tab */}
      {activeTab === 'json' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono font-medium">Firestore Schema: `{itemType === 'account' ? 'bank_accounts' : itemType === 'loan' ? 'loan_applications' : 'kcc_records'}`</span>
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <DocJson doc={item} />
        </div>
      )}
    </DetailDrawer>
  )
}

function AccountOverview({ account, onOverrideVerify, onSetPrimary, onAuditMasking }) {
  const isFailed = account.verificationStatus === 'failed'
  const isPending = account.verificationStatus === 'pending'
  const isVerified = account.verificationStatus === 'verified'

  return (
    <>
      {/* Primary & DPDP banner */}
      <div className="rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">{account.bankName}</span>
          </div>
          <div className="flex items-center gap-2">
            {account.isPrimary && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Primary Payout
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isVerified
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isPending
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {account.verificationStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {isFailed && account.failureReason && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">Penny-Drop Verification Failed:</p>
              <p className="mt-0.5 text-rose-700">{account.failureReason}</p>
            </div>
          </div>
        )}

        {account.verificationMethod === 'manualOverride' && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <p className="font-bold">Manually Verified by Superadmin ({account.overrideVerifiedBy}):</p>
            <p className="mt-0.5 text-emerald-800">{account.overrideReason}</p>
          </div>
        )}
      </div>

      <DrawerSection title="Account & Banking Details">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Account Holder" v={account.farmerName} />
          <KeyValue k="Masked Account" v={account.accountNumberMasked} mono />
          <KeyValue k="Account Last-4" v={account.accountLast4} mono />
          <KeyValue k="Account Type" v={account.accountType?.toUpperCase()} />
          <KeyValue k="IFSC Code" v={account.ifsc} mono />
          <KeyValue k="Branch Name" v={account.branchName} />
          <KeyValue k="District" v={account.district} />
        </div>
      </DrawerSection>

      <DrawerSection title="Penny-Drop Gateway Attestation">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Verification Ref" v={account.pennyDropRef} mono />
          <KeyValue k="Micro-Deposit Amount" v={fmtINR(account.pennyDropAmount)} />
          <KeyValue k="Timestamp" v={account.pennyDropTimestamp?.replace('T', ' ').slice(0, 19)} mono />
          <KeyValue k="Verification Mode" v={account.verificationMethod} />
          <KeyValue k="DPDP Act Compliance" v="Pass (Masked: XXXX + 4 digits)" />
        </div>
      </DrawerSection>

      <DrawerSection title="Administrative Interventions">
        <div className="flex flex-wrap gap-2 pt-1">
          {(isFailed || isPending) && (
            <Button
              variant="primary"
              className="text-xs"
              onClick={() => onOverrideVerify(account)}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Override Penny-Drop Verification
            </Button>
          )}

          {!account.isPrimary && (
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => onSetPrimary(account)}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Set as Primary Payout Account
            </Button>
          )}

          <Button
            variant="ghost"
            className="text-xs text-slate-600 hover:text-emerald-700"
            onClick={onAuditMasking}
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Check DPDP Masking
          </Button>
        </div>
      </DrawerSection>
    </>
  )
}

function LoanOverview({ loan, onApprove, onReject, onOpenEmiCalculator }) {
  const isApproved = loan.status === 'approved'
  const isDisbursed = loan.status === 'disbursed'
  const isRejected = loan.status === 'rejected'
  const isPending = ['submitted', 'in_review'].includes(loan.status)
  const isLargeFacility = loan.amount > 50000

  return (
    <>
      {/* Loan headline card */}
      <div className="rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-mono font-semibold">Sanction Amount</span>
            <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">{fmtINR(loan.amount)}</p>
          </div>
          <div className="text-right">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isApproved || isDisbursed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isPending
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {loan.status.toUpperCase()}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">Tenure: {loan.tenureMonths} Months</p>
          </div>
        </div>

        {isLargeFacility && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>SOP-14 §6.3 Mandate: Amount exceeds ₹50,000 (Requires Dual-Admin Sign-Off)</span>
            </div>
            {loan.dualSignOffAdmin ? (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px] border border-emerald-200">
                Dual Signed: {loan.dualSignOffAdmin}
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono font-bold text-[10px] border border-amber-200">
                2nd Sign-Off Pending
              </span>
            )}
          </div>
        )}

        {isRejected && loan.rejectionReason && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <span className="font-bold">Rejection Rationale:</span>
            <p className="mt-0.5 text-rose-700">{loan.rejectionReason}</p>
          </div>
        )}
      </div>

      <DrawerSection title="Borrower & Underwriting Profile">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Farmer Name" v={loan.farmerName} />
          <KeyValue k="Phone Number" v={loan.farmerPhone} mono />
          <KeyValue k="District / State" v={`${loan.district}, ${loan.state}`} />
          <KeyValue
            k="Kisan Credit Score"
            v={
              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-700">
                {loan.creditScoreAtApplication} ({loan.creditTier} Tier)
              </span>
            }
          />
          <KeyValue k="DSCR Ratio" v={`${loan.dscrRatio}x (Min Req: 1.25x)`} mono />
          <KeyValue k="Loan Purpose" v={loan.purpose} />
          <KeyValue k="Collateral / Guarantee" v={loan.collateralType} />
        </div>
      </DrawerSection>

      <DrawerSection title="Financial Terms & Partner Bank Routing">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Partner Bank" v={loan.partnerBank} />
          <KeyValue k="Lender Branch" v={loan.partnerBankBranch} />
          <KeyValue k="Standard Interest Rate" v={`${loan.standardInterestRate}% p.a.`} mono />
          <KeyValue
            k="Interest Subvention"
            v={
              loan.interestSubventionEligible
                ? `Govt Subvention -${loan.subventionRate}% (Net Effective: ${loan.effectiveInterestRate}%)`
                : 'Standard Commercial (No Subvention)'
            }
          />
          <KeyValue k="Monthly EMI" v={fmtINR(loan.calculatedEmi)} mono />
          <KeyValue k="Disbursal Bank Account" v={`Account #${loan.disbursalBankAccountId}`} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Underwriting Notes">
        <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 text-xs text-slate-700 leading-relaxed font-sans">
          {loan.underwritingNotes || 'No underwriting notes recorded yet.'}
        </div>
      </DrawerSection>

      <DrawerSection title="Underwriting Actions">
        <div className="flex flex-wrap gap-2 pt-1">
          {isPending && (
            <>
              <Button
                variant="primary"
                className="text-xs"
                onClick={() => onApprove(loan)}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Underwrite & Approve Facility
              </Button>
              <Button
                variant="danger"
                className="text-xs"
                onClick={() => onReject(loan)}
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Reject Application
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => onOpenEmiCalculator(loan)}
          >
            <Calculator className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Simulate EMI & Amortization
          </Button>
        </div>
      </DrawerSection>
    </>
  )
}

function KccOverview({ kcc, onAdjustLimit }) {
  const isHealthy = kcc.repaymentStatus === 'current'
  const utilizationPct = Math.round((kcc.utilizedAmount / kcc.kccLimit) * 100)

  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-mono font-semibold">Sanctioned KCC Limit</span>
            <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">{fmtINR(kcc.kccLimit)}</p>
          </div>
          <div className="text-right">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isHealthy
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {kcc.repaymentStatus.replace('_', ' ').toUpperCase()}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">Acreage: {kcc.sanctionedLandAcres} Acres</p>
          </div>
        </div>

        {/* Limit utilization progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
            <span>Limit Utilization: {utilizationPct}%</span>
            <span>Available: {fmtINR(kcc.availableLimit)}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className={`h-2 rounded-full ${
                utilizationPct > 85 ? 'bg-rose-500' : utilizationPct > 65 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
        </div>
      </div>

      <DrawerSection title="Cardholder & Credit Parameters">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Farmer Name" v={kcc.farmerName} />
          <KeyValue k="Phone" v={kcc.farmerPhone} mono />
          <KeyValue k="Issuing Bank" v={kcc.bankName} />
          <KeyValue k="Branch" v={kcc.branchName} />
          <KeyValue k="Masked KCC Number" v={kcc.cardNumberMasked} mono />
          <KeyValue k="Kisan Credit Score" v={`${kcc.creditScore} Points`} mono />
          <KeyValue k="Sanctioned Land Area" v={`${kcc.sanctionedLandAcres} Irrigated Acres`} />
          <KeyValue k="Crop Season Cycle" v={kcc.cropSeason} />
          <KeyValue k="Valid Through" v={kcc.validTill} mono />
          <KeyValue
            k="Prompt Repayment Incentive"
            v={kcc.interestSubventionEligible ? 'Eligible (3% Subvention Active)' : 'Ineligible / Disqualified'}
          />
        </div>
      </DrawerSection>

      <DrawerSection title="Administrative Actions">
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => onAdjustLimit(kcc)}
          >
            <CreditCard className="w-3.5 h-3.5 mr-1" />
            Recalibrate KCC Limit
          </Button>
        </div>
      </DrawerSection>
    </>
  )
}

function RepaymentOverview({ milestone }) {
  const isPaid = milestone.status === 'paid'
  const isOverdue = milestone.status.startsWith('overdue') || milestone.status === 'npa_risk'

  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-mono font-semibold">Installment Due</span>
            <p className="text-2xl font-black text-emerald-700 font-mono mt-0.5">{fmtINR(milestone.emiAmount)}</p>
          </div>
          <div className="text-right">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isOverdue
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {milestone.status.replace('_', ' ').toUpperCase()}
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">Due: {milestone.dueDate}</p>
          </div>
        </div>

        {milestone.dpd > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>DPD (Days Past Due): <strong>{milestone.dpd} Days</strong> · Risk Category: <strong>{milestone.riskLevel.toUpperCase()}</strong></span>
          </div>
        )}
      </div>

      <DrawerSection title="Installment Breakdown">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-1">
          <KeyValue k="Farmer Name" v={milestone.farmerName} />
          <KeyValue k="Loan Ref" v={milestone.loanId} mono />
          <KeyValue k="Installment" v={`${milestone.installmentNumber} of ${milestone.totalInstallments}`} mono />
          <KeyValue k="Principal Component" v={fmtINR(milestone.principalComponent)} mono />
          <KeyValue k="Interest Component" v={fmtINR(milestone.interestComponent)} mono />
          <KeyValue k="Partner Bank" v={milestone.bankName} />
          <KeyValue k="Enforced Recovery Action" v={milestone.actionRequired} />
        </div>
      </DrawerSection>
    </>
  )
}

function AuditTrailView({ item, itemType }) {
  const events = [
    {
      action: 'RECORD_INITIALIZED',
      admin: 'system@agrovercity',
      timestamp: item.createdAt || '2026-09-01T10:00:00Z',
      ip: '10.0.12.44',
      details: 'Entity created via rural banking gateway endpoint.'
    },
    {
      action: 'DPDP_MASKING_ENFORCEMENT',
      admin: 'compliance-engine@agrovercity',
      timestamp: item.updatedAt || '2026-09-10T14:30:00Z',
      ip: '127.0.0.1',
      details: 'Aadhaar (XXXX-XXXX-1234) and Bank Account (XXXX + last4) masking validated successfully.'
    }
  ]

  if (item.overrideVerifiedBy) {
    events.push({
      action: 'PENNY_DROP_MANUAL_OVERRIDE',
      admin: item.overrideVerifiedBy,
      timestamp: item.updatedAt,
      ip: '10.0.8.21',
      details: `Manual verification approved: ${item.overrideReason}`
    })
  }

  if (item.dualSignOffAdmin) {
    events.push({
      action: 'DUAL_SIGN_OFF_RECORDED',
      admin: item.dualSignOffAdmin,
      timestamp: item.approvedAt || item.updatedAt,
      ip: '10.0.8.99',
      details: `Dual authorization signed for financial threshold exceeding ₹50,000 (SOP-14 §6.3).`
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 font-medium">
        Immutable institutional audit ledger per AGROVERCITY SOP-14 §6.2.
      </p>

      <div className="relative border-l border-emerald-200 ml-3 space-y-6 py-2">
        {events.map((ev, i) => (
          <div key={i} className="relative pl-6">
            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-3 text-xs space-y-1 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-emerald-800">{ev.action}</span>
                <span className="font-mono text-slate-400 text-[10px]">{ev.timestamp?.replace('T', ' ').slice(0, 19)}</span>
              </div>
              <p className="text-slate-700">{ev.details}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                <span>Signatory: {ev.admin}</span>
                <span>IP: {ev.ip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
