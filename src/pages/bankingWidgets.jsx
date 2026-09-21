import React from 'react'
import {
  Landmark,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Coins,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle,
  Eye,
  Sliders,
  Calculator,
  Download,
  Clock,
  ShieldAlert,
  ArrowRight,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { Button, Input, Select } from '../components/ui'
import { fmtINR } from '../components/banking/BankingDetailDrawer'

// Export formatters
export { fmtINR }

export function maskPhone(phone) {
  if (!phone) return '—'
  const clean = String(phone).trim()
  if (clean.length <= 5) return clean
  return clean.slice(0, 4) + ' •••• ' + clean.slice(-2)
}

export function maskAadhaar(aadhaar) {
  if (!aadhaar) return 'XXXX-XXXX-••••'
  return aadhaar
}

// -------------------------------------------------------------
// BADGE COMPONENTS
// -------------------------------------------------------------
export function AccountStatusBadge({ status, method }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <CheckCircle className="w-3 h-3" />
        {method === 'manualOverride' ? 'Override Verified' : 'Verified'}
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        Penny-Drop Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
      <AlertTriangle className="w-3 h-3" />
      Failed
    </span>
  )
}

export function LoanStatusBadge({ status, requiresDualSignOff, dualSignOffAdmin }) {
  let color = 'bg-slate-500/10 text-slate-300 border-slate-700'
  let label = status?.toUpperCase() || 'SUBMITTED'

  if (status === 'approved') {
    color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    label = 'Approved'
  } else if (status === 'disbursed') {
    color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    label = 'Disbursed'
  } else if (status === 'in_review') {
    color = 'bg-sky-500/10 text-sky-400 border-sky-500/30'
    label = 'In Review'
  } else if (status === 'submitted') {
    color = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    label = 'Submitted'
  } else if (status === 'rejected') {
    color = 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    label = 'Rejected'
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
        {label}
      </span>
      {requiresDualSignOff && (
        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
          dualSignOffAdmin
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
        }`}>
          {dualSignOffAdmin ? 'Dual Signed' : 'Dual Sign Req'}
        </span>
      )}
    </div>
  )
}

export function KccStatusBadge({ status }) {
  if (status === 'current') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        Current / Normal
      </span>
    )
  }
  if (status === 'grace_period') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        Grace Period
      </span>
    )
  }
  if (status === 'overdue') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        Overdue (SMA)
      </span>
    )
  }
  if (status === 'npa_risk') {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">
        Critical NPA Risk
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
      {status}
    </span>
  )
}

export function CreditTierBadge({ tier, score }) {
  const tones = {
    Platinum: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    Gold: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    Silver: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    Bronze: 'bg-slate-500/15 text-slate-300 border-slate-600',
  }
  const tone = tones[tier] || tones.Silver

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-bold border ${tone}`}>
      <span>{score}</span>
      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">({tier})</span>
    </span>
  )
}

// -------------------------------------------------------------
// TOP METRIC BAR
// -------------------------------------------------------------
export function MetricCard({ icon: Icon, title, value, subtext, tone = 'default', badge }) {
  const tones = {
    emerald: 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400',
    amber: 'border-amber-500/30 bg-amber-950/10 text-amber-400',
    rose: 'border-rose-500/30 bg-rose-950/10 text-rose-400',
    sky: 'border-sky-500/30 bg-sky-950/10 text-sky-400',
    default: 'border-slate-800 bg-slate-900/60 text-slate-200'
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm flex flex-col justify-between ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {badge}
            </span>
          )}
          <Icon className="w-4 h-4 opacity-80" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold font-mono tracking-tight text-slate-100">{value}</p>
        {subtext && <p className="mt-0.5 text-xs text-slate-400">{subtext}</p>}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// TAB SWITCHER
// -------------------------------------------------------------
export function TabSwitch({ activeTab, onTabChange, counts = {} }) {
  const tabs = [
    { id: 'accounts', label: 'Bank Accounts & Penny-Drop', count: counts.accounts },
    { id: 'loans', label: 'Loan Underwriting Queue', count: counts.loans },
    { id: 'kcc', label: 'KCC Records & Credit Limits', count: counts.kcc },
    { id: 'repayments', label: 'Repayments & Default Risk', count: counts.repayments },
    { id: 'model', label: 'Credit Score Model & Simulator' }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = activeTab === t.id
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition shrink-0 ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// -------------------------------------------------------------
// FILTER & ACTION TOOLBAR
// -------------------------------------------------------------
export function FiltersBar({
  tab,
  q,
  setQ,
  status,
  setStatus,
  secondaryFilter,
  setSecondaryFilter,
  dateRange,
  setDateRange,
  onRefresh,
  onExportCsv,
  onOpenEmiCalculator,
  onCalibrateModel,
  onRunMaskingAudit,
  loading
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
      {/* Search and dropdown filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="w-full sm:w-64">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === 'accounts'
                ? 'Search name, bank, IFSC, ID...'
                : tab === 'loans'
                ? 'Search borrower, purpose, bank...'
                : tab === 'kcc'
                ? 'Search farmer, card, bank...'
                : 'Search borrower, loan ref...'
            }
          />
        </div>

        {tab === 'accounts' && (
          <>
            <div className="w-36">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Verified', value: 'verified' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Failed', value: 'failed' }
                ]}
              />
            </div>
            <div className="w-36">
              <Select
                value={secondaryFilter}
                onChange={(e) => setSecondaryFilter(e.target.value)}
                options={[
                  { label: 'All Account Types', value: 'all' },
                  { label: 'Savings', value: 'savings' },
                  { label: 'Current', value: 'current' }
                ]}
              />
            </div>
          </>
        )}

        {tab === 'loans' && (
          <>
            <div className="w-36">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Submitted', value: 'submitted' },
                  { label: 'In Review', value: 'in_review' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Disbursed', value: 'disbursed' },
                  { label: 'Rejected', value: 'rejected' }
                ]}
              />
            </div>
            <div className="w-40">
              <Select
                value={secondaryFilter}
                onChange={(e) => setSecondaryFilter(e.target.value)}
                options={[
                  { label: 'All Partner Banks', value: 'all' },
                  { label: 'State Bank of India', value: 'State Bank of India' },
                  { label: 'Maharashtra Gramin', value: 'Maharashtra Gramin Bank' },
                  { label: 'Bank of Baroda', value: 'Bank of Baroda' },
                  { label: 'HDFC Rural Banking', value: 'HDFC Rural Banking' }
                ]}
              />
            </div>
          </>
        )}

        {tab === 'kcc' && (
          <>
            <div className="w-36">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'All Health', value: 'all' },
                  { label: 'Current', value: 'current' },
                  { label: 'Grace Period', value: 'grace_period' },
                  { label: 'Overdue', value: 'overdue' },
                  { label: 'NPA Risk', value: 'npa_risk' }
                ]}
              />
            </div>
          </>
        )}

        {tab === 'repayments' && (
          <>
            <div className="w-36">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'All Milestones', value: 'all' },
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Paid', value: 'paid' },
                  { label: 'Overdue 30d', value: 'overdue_30' },
                  { label: 'Overdue 60d', value: 'overdue_60' },
                  { label: 'NPA Risk', value: 'npa_risk' }
                ]}
              />
            </div>
          </>
        )}

        <div className="w-32">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { label: 'Last 7 Days', value: '7' },
              { label: 'Last 30 Days', value: '30' },
              { label: 'Last 90 Days', value: '90' },
              { label: 'All Time', value: 'all' }
            ]}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="text-xs px-2.5 py-1.5"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        <Button
          variant="secondary"
          className="text-xs"
          onClick={onExportCsv}
          title="Export Active View to CSV"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Export
        </Button>

        <Button
          variant="secondary"
          className="text-xs"
          onClick={onOpenEmiCalculator}
          title="Open Loan EMI & Repayment Simulator"
        >
          <Calculator className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          EMI Simulator
        </Button>

        {tab === 'model' ? (
          <Button
            variant="primary"
            className="text-xs"
            onClick={onCalibrateModel}
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            Calibrate Model
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-xs text-slate-400 hover:text-emerald-400"
            onClick={onRunMaskingAudit}
            title="Verify DPDP Act Masking Compliance"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            DPDP Audit
          </Button>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// TAB 1: BANK ACCOUNTS TABLE
// -------------------------------------------------------------
export function BankAccountsTable({
  accounts,
  onSelect,
  onOverrideVerify,
  onSetPrimary
}) {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-900/30">
        <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="font-semibold text-sm">No Bank Accounts Found</p>
        <p className="text-xs mt-0.5">Try relaxing your search or status filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="p-3">ID / User</th>
            <th className="p-3">Bank & Branch</th>
            <th className="p-3">Masked Account</th>
            <th className="p-3">IFSC</th>
            <th className="p-3">Type</th>
            <th className="p-3">Verification</th>
            <th className="p-3">Registered</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {accounts.map((acc) => {
            const isVerified = acc.verificationStatus === 'verified'
            const isFailed = acc.verificationStatus === 'failed'

            return (
              <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3">
                  <div className="font-mono font-bold text-slate-200">#{acc.id}</div>
                  <div className="text-slate-400">{acc.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{maskPhone(acc.farmerPhone)}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-slate-200">{acc.bankName}</div>
                  <div className="text-slate-400 text-[11px]">{acc.branchName} · {acc.district}</div>
                </td>
                <td className="p-3">
                  <div className="font-mono font-bold text-emerald-400">{acc.accountNumberMasked}</div>
                  {acc.isPrimary && (
                    <span className="inline-block mt-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Primary Payout
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-slate-300">{acc.ifsc}</td>
                <td className="p-3 uppercase font-mono text-[11px] text-slate-400">{acc.accountType}</td>
                <td className="p-3">
                  <AccountStatusBadge status={acc.verificationStatus} method={acc.verificationMethod} />
                  {isFailed && acc.failureReason && (
                    <p className="mt-1 text-[10px] text-rose-400 max-w-xs truncate" title={acc.failureReason}>
                      {acc.failureReason}
                    </p>
                  )}
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-500">
                  {acc.createdAt?.slice(0, 10)}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(acc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      View
                    </Button>
                    {!isVerified && (
                      <Button
                        variant="primary"
                        className="text-xs px-2 py-1"
                        onClick={() => onOverrideVerify(acc)}
                        title="Manual Penny-Drop Override"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {!acc.isPrimary && isVerified && (
                      <Button
                        variant="ghost"
                        className="text-xs px-2 py-1 text-slate-400 hover:text-emerald-400"
                        onClick={() => onSetPrimary(acc)}
                        title="Make Primary Payout Account"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// TAB 2: LOAN UNDERWRITING QUEUE TABLE
// -------------------------------------------------------------
export function LoanUnderwritingTable({
  loans,
  onSelect,
  onUnderwrite,
  onOpenEmiCalculator
}) {
  if (!loans || loans.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-900/30">
        <Landmark className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="font-semibold text-sm">No Loan Applications Found</p>
        <p className="text-xs mt-0.5">Underwriting queue is clear or filters need adjustment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="p-3">App ID / Borrower</th>
            <th className="p-3">Loan Amount</th>
            <th className="p-3">Purpose & Tenure</th>
            <th className="p-3">Credit Score / DSCR</th>
            <th className="p-3">Partner Bank</th>
            <th className="p-3">Status / Dual Sign</th>
            <th className="p-3">Submitted</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {loans.map((l) => {
            const isPending = ['submitted', 'in_review'].includes(l.status)

            return (
              <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3">
                  <div className="font-mono font-bold text-slate-200">#{l.applicationId || l.id}</div>
                  <div className="font-semibold text-slate-200">{l.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{l.district}, {l.state}</div>
                </td>
                <td className="p-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">{fmtINR(l.amount)}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    EMI: {fmtINR(l.calculatedEmi)} / mo
                  </div>
                </td>
                <td className="p-3 max-w-xs">
                  <div className="font-medium text-slate-200 truncate" title={l.purpose}>{l.purpose}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {l.tenureMonths} Months @ {l.effectiveInterestRate}% {l.interestSubventionEligible && '(Subvention)'}
                  </div>
                </td>
                <td className="p-3">
                  <CreditTierBadge tier={l.creditTier} score={l.creditScoreAtApplication} />
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    DSCR: <strong className="text-slate-200">{l.dscrRatio}x</strong>
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-200">{l.partnerBank}</div>
                  <div className="text-[11px] text-slate-400">{l.partnerBankBranch}</div>
                </td>
                <td className="p-3">
                  <LoanStatusBadge
                    status={l.status}
                    requiresDualSignOff={l.requiresDualSignOff}
                    dualSignOffAdmin={l.dualSignOffAdmin}
                  />
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-500">
                  {l.createdAt?.slice(0, 10)}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(l)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Detail
                    </Button>
                    {isPending && (
                      <Button
                        variant="primary"
                        className="text-xs px-2.5 py-1"
                        onClick={() => onUnderwrite(l)}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        Underwrite
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1 text-slate-400 hover:text-emerald-400"
                      onClick={() => onOpenEmiCalculator(l)}
                      title="Calculate EMI"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// TAB 3: KCC RECORDS TABLE
// -------------------------------------------------------------
export function KccRecordsTable({ kccList, onSelect, onAdjustLimit }) {
  if (!kccList || kccList.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-900/30">
        <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="font-semibold text-sm">No KCC Records Found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="p-3">Record / Farmer</th>
            <th className="p-3">Issuing Bank</th>
            <th className="p-3">Masked Card</th>
            <th className="p-3">Sanctioned Limit</th>
            <th className="p-3">Utilization</th>
            <th className="p-3">Repayment Health</th>
            <th className="p-3">Expiry</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {kccList.map((k) => {
            const pct = Math.round((k.utilizedAmount / k.kccLimit) * 100)

            return (
              <tr key={k.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3">
                  <div className="font-mono font-bold text-slate-200">#{k.id}</div>
                  <div className="font-semibold text-slate-200">{k.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{k.sanctionedLandAcres} Acres ({k.district})</div>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-200">{k.bankName}</div>
                  <div className="text-[11px] text-slate-400">{k.branchName}</div>
                </td>
                <td className="p-3 font-mono font-semibold text-slate-300">{k.cardNumberMasked}</td>
                <td className="p-3">
                  <div className="font-mono font-bold text-emerald-400">{fmtINR(k.kccLimit)}</div>
                  {k.interestSubventionEligible && (
                    <span className="text-[10px] text-emerald-300 font-mono">3% Prompt Rebate</span>
                  )}
                </td>
                <td className="p-3 w-40">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span>{pct}%</span>
                    <span className="text-slate-400">{fmtINR(k.utilizedAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${pct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </td>
                <td className="p-3">
                  <KccStatusBadge status={k.repaymentStatus} />
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-500">{k.validTill}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(k)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Detail
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1 text-slate-400 hover:text-emerald-400"
                      onClick={() => onAdjustLimit(k)}
                      title="Adjust Limit"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// TAB 4: REPAYMENT MILESTONES & DEFAULT RISK TABLE
// -------------------------------------------------------------
export function RepaymentsTable({ repayments, onSelect }) {
  if (!repayments || repayments.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 rounded-xl border border-slate-800 bg-slate-900/30">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        <p className="font-semibold text-sm">No Repayment Milestones Found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="p-3">Milestone / Loan</th>
            <th className="p-3">Borrower</th>
            <th className="p-3">Installment</th>
            <th className="p-3">Amount Due</th>
            <th className="p-3">Due Date</th>
            <th className="p-3">DPD / Risk</th>
            <th className="p-3">Action Required</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {repayments.map((r) => {
            const isPaid = r.status === 'paid'
            const isOverdue = r.dpd > 0

            return (
              <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3">
                  <div className="font-mono font-bold text-slate-200">#{r.id}</div>
                  <div className="text-[11px] font-mono text-slate-500">{r.loanId}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-slate-200">{r.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{r.district} · {r.bankName}</div>
                </td>
                <td className="p-3 font-mono">
                  {r.installmentNumber} / {r.totalInstallments}
                </td>
                <td className="p-3">
                  <div className="font-mono font-bold text-emerald-400">{fmtINR(r.emiAmount)}</div>
                  <div className="text-[10px] font-mono text-slate-500">Prin: {fmtINR(r.principalComponent)}</div>
                </td>
                <td className="p-3 font-mono text-slate-300">{r.dueDate}</td>
                <td className="p-3">
                  {isPaid ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Paid
                    </span>
                  ) : isOverdue ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      {r.dpd} DPD ({r.riskLevel.toUpperCase()})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      Upcoming
                    </span>
                  )}
                </td>
                <td className="p-3 max-w-xs text-slate-400 text-[11px] leading-snug">
                  {r.actionRequired}
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="secondary"
                    className="text-xs px-2.5 py-1"
                    onClick={() => onSelect(r)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Inspect
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// TAB 5: CREDIT SCORE MODEL & SIMULATOR VIEW
// -------------------------------------------------------------
export function CreditScoreModelView({ model, onCalibrate, onOpenEmiSimulator }) {
  if (!model) return null

  return (
    <div className="space-y-6">
      {/* Model Overview Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">Kisan Credit Score Algorithm (SOP-14 §3)</h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {model.version}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Multi-dimensional risk scoring calibrated for rural farmers across land, yield, trade turnover, and KCC repayment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400">Platform Average Score</span>
            <p className="text-2xl font-bold font-mono text-emerald-400">{model.averageKisanCreditScore} pts</p>
          </div>
          <Button variant="primary" className="text-xs" onClick={onCalibrate}>
            <Sliders className="w-3.5 h-3.5 mr-1" />
            Calibrate Weights
          </Button>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Scoring Dimensions & Weights (Sum: 100%)
          </h3>
          <div className="space-y-3">
            {model.scoringFactors.map((factor) => (
              <div key={factor.factorKey} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{factor.name}</span>
                  <span className="font-mono font-bold text-emerald-400">{factor.weight}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${factor.weight * 2}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{factor.description}</p>
                <p className="text-[10px] font-mono text-slate-500">{factor.benchmarkRule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Tiers Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Risk Tiers & Credit Limit Brackets
            </h3>
            <Button variant="secondary" className="text-xs px-2.5 py-1" onClick={onOpenEmiSimulator}>
              <Calculator className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Simulate EMI
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {model.tiers.map((tier) => (
              <div key={tier.tier} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-100">{tier.tier} Tier</span>
                    <p className="text-[11px] font-mono text-emerald-400 mt-0.5">{tier.scoreRange} pts</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {tier.farmerPercentage}% of farmers
                  </span>
                </div>

                <div className="space-y-1 text-xs border-t border-slate-800/80 pt-2 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Unsecured Limit:</span>
                    <span className="text-slate-200 font-bold">{fmtINR(tier.creditLimit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ROI Concession:</span>
                    <span className="text-emerald-300">{tier.roiRebate}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-sans">
                  Risk Category: <strong className="text-slate-300">{tier.riskLevel}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300/90 leading-relaxed">
            Automatic Partner Bank Routing: Platinum applications route with fast-track digital approval to SBI/HDFC. Bronze applications require FPO joint liability or collateral charge.
          </div>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// PAGINATION COMPONENT
// -------------------------------------------------------------
export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize) || 1
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 text-xs text-slate-400 border-t border-slate-800">
      <div>
        Showing <span className="font-mono text-slate-200">{start}</span> to{' '}
        <span className="font-mono text-slate-200">{end}</span> of{' '}
        <span className="font-mono text-slate-200">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="text-xs px-2 py-1"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Prev
        </Button>

        <span className="font-mono text-slate-300 px-2">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          className="text-xs px-2 py-1"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
