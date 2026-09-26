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
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3 text-emerald-600" />
        {method === 'manualOverride' ? 'Override Verified' : 'Verified'}
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Penny-Drop Pending
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <AlertTriangle className="w-3 h-3 text-rose-600" />
      Failed
    </span>
  )
}

export function LoanStatusBadge({ status, requiresDualSignOff, dualSignOffAdmin }) {
  let color = 'bg-slate-100 text-slate-700 border-slate-200'
  let label = status?.toUpperCase() || 'SUBMITTED'

  if (status === 'approved') {
    color = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    label = 'Approved'
  } else if (status === 'disbursed') {
    color = 'bg-emerald-100 text-emerald-800 border-emerald-300'
    label = 'Disbursed'
  } else if (status === 'in_review') {
    color = 'bg-sky-50 text-sky-700 border-sky-200'
    label = 'In Review'
  } else if (status === 'submitted') {
    color = 'bg-amber-50 text-amber-700 border-amber-200'
    label = 'Submitted'
  } else if (status === 'rejected') {
    color = 'bg-rose-50 text-rose-700 border-rose-200'
    label = 'Rejected'
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
        {label}
      </span>
      {requiresDualSignOff && (
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
          dualSignOffAdmin
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-amber-100 text-amber-800 border-amber-300'
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
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Current / Normal
      </span>
    )
  }
  if (status === 'grace_period') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Grace Period
      </span>
    )
  }
  if (status === 'overdue') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        Overdue (SMA)
      </span>
    )
  }
  if (status === 'npa_risk') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
        Critical NPA Risk
      </span>
    )
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {status}
    </span>
  )
}

export function CreditTierBadge({ tier, score }) {
  const tones = {
    Platinum: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Gold: 'bg-amber-50 text-amber-800 border-amber-300',
    Silver: 'bg-sky-50 text-sky-800 border-sky-300',
    Bronze: 'bg-slate-100 text-slate-800 border-slate-300',
  }
  const tone = tones[tier] || tones.Silver

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${tone}`}>
      <span>{score}</span>
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider">({tier})</span>
    </span>
  )
}

// -------------------------------------------------------------
// TOP METRIC BAR
// -------------------------------------------------------------
export function MetricCard({ icon: Icon, title, value, subtext, tone = 'default', badge }) {
  const tones = {
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    rose: 'text-rose-700',
    sky: 'text-sky-700',
    default: 'text-slate-900'
  }

  return (
    <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {badge}
            </span>
          )}
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="mt-2.5">
        <p className={`text-2xl font-black font-mono tracking-tight ${tones[tone]}`}>{value}</p>
        {subtext && <p className="mt-1 text-xs text-slate-500 font-medium">{subtext}</p>}
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
    { id: 'model', label: 'Credit Score Model & Simulator' },
    { id: 'audit_trail', label: 'Statutory Audit Trail', count: counts.audit_trail }
  ]

  return (
    <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = activeTab === t.id
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50 border border-transparent'
            }`}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
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
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
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
          <Calculator className="w-3.5 h-3.5 mr-1 text-emerald-600" />
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
            className="text-xs text-slate-600 hover:text-emerald-700"
            onClick={onRunMaskingAudit}
            title="Verify DPDP Act Masking Compliance"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
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
      <div className="py-16 text-center text-slate-500 rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl shadow-xs">
        <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="font-bold text-sm text-slate-800">No Bank Accounts Found</p>
        <p className="text-xs mt-0.5">Try relaxing your search or status filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="p-3.5">ID / User</th>
            <th className="p-3.5">Bank & Branch</th>
            <th className="p-3.5">Masked Account</th>
            <th className="p-3.5">IFSC</th>
            <th className="p-3.5">Type</th>
            <th className="p-3.5">Verification</th>
            <th className="p-3.5">Registered</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {accounts.map((acc) => {
            const isVerified = acc.verificationStatus === 'verified'
            const isFailed = acc.verificationStatus === 'failed'

            return (
              <tr key={acc.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-950">#{acc.id}</div>
                  <div className="text-slate-900 font-semibold">{acc.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{maskPhone(acc.farmerPhone)}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{acc.bankName}</div>
                  <div className="text-slate-500 text-[11px]">{acc.branchName} · {acc.district}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-700">{acc.accountNumberMasked}</div>
                  {acc.isPrimary && (
                    <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Primary Payout
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-mono text-slate-800 font-medium">{acc.ifsc}</td>
                <td className="p-3.5 uppercase font-mono text-[11px] text-slate-500 font-semibold">{acc.accountType}</td>
                <td className="p-3.5">
                  <AccountStatusBadge status={acc.verificationStatus} method={acc.verificationMethod} />
                  {isFailed && acc.failureReason && (
                    <p className="mt-1 text-[10px] text-rose-600 font-medium max-w-xs truncate" title={acc.failureReason}>
                      {acc.failureReason}
                    </p>
                  )}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-500">
                  {acc.createdAt?.slice(0, 10)}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(acc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
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
                        className="text-xs px-2 py-1 text-slate-600 hover:text-emerald-700"
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
      <div className="py-16 text-center text-slate-500 rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl shadow-xs">
        <Landmark className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="font-bold text-sm text-slate-800">No Loan Applications Found</p>
        <p className="text-xs mt-0.5">Underwriting queue is clear or filters need adjustment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="p-3.5">App ID / Borrower</th>
            <th className="p-3.5">Loan Amount</th>
            <th className="p-3.5">Purpose & Tenure</th>
            <th className="p-3.5">Credit Score / DSCR</th>
            <th className="p-3.5">Partner Bank</th>
            <th className="p-3.5">Status / Dual Sign</th>
            <th className="p-3.5">Submitted</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {loans.map((l) => {
            const isPending = ['submitted', 'in_review'].includes(l.status)

            return (
              <tr key={l.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-950">#{l.applicationId || l.id}</div>
                  <div className="font-bold text-slate-900">{l.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{l.district}, {l.state}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-700 text-sm">{fmtINR(l.amount)}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    EMI: {fmtINR(l.calculatedEmi)} / mo
                  </div>
                </td>
                <td className="p-3.5 max-w-xs">
                  <div className="font-semibold text-slate-900 truncate" title={l.purpose}>{l.purpose}</div>
                  <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                    {l.tenureMonths} Months @ {l.effectiveInterestRate}% {l.interestSubventionEligible && '(Subvention)'}
                  </div>
                </td>
                <td className="p-3.5">
                  <CreditTierBadge tier={l.creditTier} score={l.creditScoreAtApplication} />
                  <div className="text-[11px] font-mono text-slate-600 mt-1">
                    DSCR: <strong className="text-slate-900">{l.dscrRatio}x</strong>
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{l.partnerBank}</div>
                  <div className="text-[11px] text-slate-500">{l.partnerBankBranch}</div>
                </td>
                <td className="p-3.5">
                  <LoanStatusBadge
                    status={l.status}
                    requiresDualSignOff={l.requiresDualSignOff}
                    dualSignOffAdmin={l.dualSignOffAdmin}
                  />
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-500">
                  {l.createdAt?.slice(0, 10)}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(l)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
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
                      className="text-xs px-2 py-1 text-slate-600 hover:text-emerald-700"
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
      <div className="py-16 text-center text-slate-500 rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl shadow-xs">
        <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="font-bold text-sm text-slate-800">No KCC Records Found</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="p-3.5">Record / Farmer</th>
            <th className="p-3.5">Issuing Bank</th>
            <th className="p-3.5">Masked Card</th>
            <th className="p-3.5">Sanctioned Limit</th>
            <th className="p-3.5">Utilization</th>
            <th className="p-3.5">Repayment Health</th>
            <th className="p-3.5">Expiry</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {kccList.map((k) => {
            const pct = Math.round((k.utilizedAmount / k.kccLimit) * 100)

            return (
              <tr key={k.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-950">#{k.id}</div>
                  <div className="font-bold text-slate-900">{k.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{k.sanctionedLandAcres} Acres ({k.district})</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{k.bankName}</div>
                  <div className="text-[11px] text-slate-500">{k.branchName}</div>
                </td>
                <td className="p-3.5 font-mono font-bold text-slate-800">{k.cardNumberMasked}</td>
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-700">{fmtINR(k.kccLimit)}</div>
                  {k.interestSubventionEligible && (
                    <span className="text-[10px] text-emerald-800 font-mono font-bold">3% Prompt Rebate</span>
                  )}
                </td>
                <td className="p-3.5 w-40">
                  <div className="flex justify-between text-[11px] font-mono mb-1 font-semibold">
                    <span>{pct}%</span>
                    <span className="text-slate-500">{fmtINR(k.utilizedAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className={`h-2 rounded-full ${pct > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </td>
                <td className="p-3.5">
                  <KccStatusBadge status={k.repaymentStatus} />
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-500 font-medium">{k.validTill}</td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="secondary"
                      className="text-xs px-2.5 py-1"
                      onClick={() => onSelect(k)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      Detail
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1 text-slate-600 hover:text-emerald-700"
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
      <div className="py-16 text-center text-slate-500 rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xl shadow-xs">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="font-bold text-sm text-slate-800">No Repayment Milestones Found</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="p-3.5">Milestone / Loan</th>
            <th className="p-3.5">Borrower</th>
            <th className="p-3.5">Installment</th>
            <th className="p-3.5">Amount Due</th>
            <th className="p-3.5">Due Date</th>
            <th className="p-3.5">DPD / Risk</th>
            <th className="p-3.5">Action Required</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {repayments.map((r) => {
            const isPaid = r.status === 'paid'
            const isOverdue = r.dpd > 0

            return (
              <tr key={r.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-950">#{r.id}</div>
                  <div className="text-[11px] font-mono text-slate-500">{r.loanId}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{r.farmerName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{r.district} · {r.bankName}</div>
                </td>
                <td className="p-3.5 font-mono font-semibold text-slate-800">
                  {r.installmentNumber} / {r.totalInstallments}
                </td>
                <td className="p-3.5">
                  <div className="font-mono font-bold text-emerald-700">{fmtINR(r.emiAmount)}</div>
                  <div className="text-[10px] font-mono text-slate-500">Prin: {fmtINR(r.principalComponent)}</div>
                </td>
                <td className="p-3.5 font-mono text-slate-800 font-medium">{r.dueDate}</td>
                <td className="p-3.5">
                  {isPaid ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Paid
                    </span>
                  ) : isOverdue ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {r.dpd} DPD ({r.riskLevel.toUpperCase()})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Upcoming
                    </span>
                  )}
                </td>
                <td className="p-3.5 max-w-xs text-slate-600 text-[11px] leading-snug">
                  {r.actionRequired}
                </td>
                <td className="p-3.5 text-right">
                  <Button
                    variant="secondary"
                    className="text-xs px-2.5 py-1"
                    onClick={() => onSelect(r)}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
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
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Kisan Credit Score Algorithm (SOP-14 §3)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {model.version}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Multi-dimensional risk scoring calibrated for rural farmers across land, yield, trade turnover, and KCC repayment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Platform Average Score</span>
            <p className="text-2xl font-black font-mono text-emerald-700">{model.averageKisanCreditScore} pts</p>
          </div>
          <Button variant="primary" className="text-xs" onClick={onCalibrate}>
            <Sliders className="w-3.5 h-3.5 mr-1" />
            Calibrate Weights
          </Button>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Scoring Dimensions & Weights (Sum: 100%)
          </h3>
          <div className="space-y-3">
            {model.scoringFactors.map((factor) => (
              <div key={factor.factorKey} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{factor.name}</span>
                  <span className="font-mono font-bold text-emerald-700">{factor.weight}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${factor.weight * 2}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600">{factor.description}</p>
                <p className="text-[10px] font-mono text-slate-500">{factor.benchmarkRule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Tiers Distribution */}
        <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Risk Tiers & Credit Limit Brackets
            </h3>
            <Button variant="secondary" className="text-xs px-2.5 py-1" onClick={onOpenEmiSimulator}>
              <Calculator className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Simulate EMI
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {model.tiers.map((tier) => (
              <div key={tier.tier} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{tier.tier} Tier</span>
                    <p className="text-[11px] font-mono font-bold text-emerald-700 mt-0.5">{tier.scoreRange} pts</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200">
                    {tier.farmerPercentage}% of farmers
                  </span>
                </div>

                <div className="space-y-1 text-xs border-t border-slate-200 pt-2 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Unsecured Limit:</span>
                    <span className="text-slate-900 font-bold">{fmtINR(tier.creditLimit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ROI Concession:</span>
                    <span className="text-emerald-700 font-bold">{tier.roiRebate}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-sans font-medium">
                  Risk Category: <strong className="text-slate-800">{tier.riskLevel}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 text-xs text-slate-600 border-t border-emerald-100">
      <div>
        Showing <span className="font-mono font-bold text-slate-900">{start}</span> to{' '}
        <span className="font-mono font-bold text-slate-900">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-900">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="text-xs px-2.5 py-1"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Prev
        </Button>

        <span className="font-mono font-bold text-slate-800 px-2">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          className="text-xs px-2.5 py-1"
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
