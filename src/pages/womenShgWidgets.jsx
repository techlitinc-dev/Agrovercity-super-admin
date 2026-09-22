import React from 'react'
import {
  HandHeart,
  Users,
  PiggyBank,
  TrendingUp,
  ShoppingBag,
  Coins,
  ShieldCheck,
  AlertTriangle,
  Search,
  RefreshCw,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  FileCheck,
  Sparkles,
  Store,
  DollarSign,
  Ban
} from 'lucide-react'

export function fmtINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}

export function formatDate(isoStr) {
  if (!isoStr) return '—'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoStr
  }
}

export function StatusBadge({ status }) {
  const map = {
    // SHGs
    verified: { label: 'NRLM Verified', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    pending_verification: { label: 'Verification Pending', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' },
    flagged_audit: { label: 'Audit Anomaly Flag', bg: 'bg-rose-50 text-rose-800 border-rose-200/80 animate-pulse' },
    suspended: { label: 'Suspended (Breach)', bg: 'bg-slate-100 text-slate-700 border-slate-200' },

    // Deposits
    cleared: { label: 'Cleared', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    pending: { label: 'Pending Bank Match', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' },
    flagged_discrepancy: { label: 'Discrepancy Flag', bg: 'bg-rose-50 text-rose-800 border-rose-200/80' },

    // Enterprises
    approved: { label: 'Storefront Active', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    pending_review: { label: 'QC Curation Pending', bg: 'bg-teal-50 text-teal-800 border-teal-200/80' },
    changes_requested: { label: 'Changes Requested', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' },
    delisted: { label: 'Delisted', bg: 'bg-rose-50 text-rose-800 border-rose-200/80' },

    // Subsidies
    disbursed: { label: 'Disbursed (Bank UTR)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    pending_approval: { label: 'Awaiting Sanction', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' },
    dual_signoff_pending: { label: 'Dual Sign-Off Pending', bg: 'bg-teal-50 text-teal-800 border-teal-200/80 animate-pulse' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-800 border-rose-200/80' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-600 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function EligibilityBadge({ status }) {
  const map = {
    eligible: { label: 'Subvention Eligible', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    ineligible: { label: 'Recovery Ineligible', bg: 'bg-rose-50 text-rose-800 border-rose-200/80' },
    disbursed: { label: 'Subvention Active', bg: 'bg-teal-50 text-teal-800 border-teal-200/80' },
    pending_approval: { label: 'Sanction Pending', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' }
  }
  const badge = map[status] || { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
      <FileCheck className="w-3 h-3" />
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80' },
    blue: { text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200/80' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/80' },
    purple: { text: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200/80' },
    rose: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/80' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500 font-medium">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function WomenMetricBar({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/60 border border-emerald-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Mahila Kisan SHGs"
        value={`${summary.totalActiveShgs || 0} Bachat Gats`}
        subtitle={`${summary.totalMahilaKisanMembers || 0} Registered Members`}
        icon={HandHeart}
        badge={summary.pendingVerificationShgs > 0 ? `${summary.pendingVerificationShgs} Pending Verify` : 'All Verified'}
        color="emerald"
      />
      <MetricCard
        title="Savings Corpus Float"
        value={fmtINR(summary.cumulativeSavingsCorpusInr)}
        subtitle="Cumulative Micro-Savings & Interest"
        icon={PiggyBank}
        badge="Zero Defalcation"
        color="blue"
      />
      <MetricCard
        title="Internal Loan Recovery"
        value={`${summary.averageLoanRecoveryRatePct || 0}%`}
        subtitle="Prompt Repayment Discipline"
        icon={TrendingUp}
        badge="Subvention Benchmark Met"
        color="purple"
      />
      <MetricCard
        title="Cottage Storefronts"
        value={`${summary.activeStorefrontProducts || 0} Live SKUs`}
        subtitle={`Total Sales: ${fmtINR(summary.totalEnterpriseRevenueInr)}`}
        icon={Store}
        badge="FSSAI / Handloom Curated"
        color="rose"
      />
    </div>
  )
}

export function WomenShgTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'shgs', label: 'SHG Directory & Federations', icon: HandHeart, count: counts.shgs },
    { id: 'deposits', label: 'Micro-Savings & Deposits', icon: PiggyBank, count: counts.deposits },
    { id: 'enterprises', label: 'Home Enterprise Storefront', icon: Store, count: counts.enterprises },
    { id: 'subsidies', label: 'Interest Subvention & Grants', icon: Coins, count: counts.subsidies },
    { id: 'audit', label: 'Compliance & Audit Logs', icon: ShieldCheck, count: counts.audit }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-100/80 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function WomenShgFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  subFilter,
  onSubFilterChange,
  subFilterOptions = [],
  subFilterLabel = 'Filter',
  activeTab,
  onRefresh,
  onExportCsv,
  onAddNew
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-white/90 border border-emerald-100/90 p-3 rounded-2xl shadow-xs">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SHG name, president, district, artisan, ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          {activeTab === 'shgs' && (
            <>
              <option value="verified">NRLM Verified</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="flagged_audit">Audit Flagged</option>
              <option value="suspended">Suspended</option>
            </>
          )}
          {activeTab === 'deposits' && (
            <>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
              <option value="flagged_discrepancy">Discrepancy</option>
            </>
          )}
          {activeTab === 'enterprises' && (
            <>
              <option value="approved">Storefront Active</option>
              <option value="pending_review">Pending Review</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="delisted">Delisted</option>
            </>
          )}
          {activeTab === 'subsidies' && (
            <>
              <option value="disbursed">Disbursed</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="dual_signoff_pending">Dual Sign-Off Pending</option>
              <option value="rejected">Rejected</option>
            </>
          )}
        </select>

        {/* Secondary Filter if available */}
        {subFilterOptions.length > 0 && (
          <select
            value={subFilter}
            onChange={(e) => onSubFilterChange(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">{subFilterLabel}: All</option>
            {subFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          title="Refresh dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        )}
      </div>
    </div>
  )
}

// 1. SHGs Table
export function WomenShgsTable({ data, onSelectRow, onVerifyShg, onSuspendShg }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No Self Help Groups found matching criteria.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-3.5 py-2.5">SHG Name & ID</th>
            <th className="px-3.5 py-2.5">Village / Cluster Federation</th>
            <th className="px-3.5 py-2.5">Members & Leadership</th>
            <th className="px-3.5 py-2.5">Savings Corpus & Loans</th>
            <th className="px-3.5 py-2.5">Recovery %</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 transition-colors border-b border-slate-100/80 cursor-pointer"
            >
              <td className="px-3.5 py-3">
                <div className="font-bold text-slate-900">{row.shgName}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  {row.id} · Formed {row.formedYear}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-slate-900 font-semibold">{row.village}, {row.district}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                  {row.federationCluster}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-emerald-700 font-bold">{row.membersCount} Mahila Kisan</div>
                <div className="text-[11px] text-slate-500">
                  Pres: {row.presidentName} ({row.presidentPhone})
                </div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-slate-900 font-bold">{fmtINR(row.savingsCorpusInr)}</div>
                <div className="text-[10px] text-slate-500">Loan: {fmtINR(row.internalLoanOutstandInr)}</div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-emerald-700 font-bold">{row.recoveryRatePct}%</div>
                <div className="text-[10px] text-slate-500">Meeting: {row.weeklyMeetingDisciplinePct}%</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                {row.status === 'pending_verification' && (
                  <button
                    onClick={() => onVerifyShg(row)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 text-[11px] font-bold transition-all shadow-xs"
                  >
                    Verify
                  </button>
                )}
                {row.status === 'verified' && (
                  <button
                    onClick={() => onSuspendShg(row)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[11px] font-semibold transition-all shadow-xs"
                  >
                    Suspend
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                >
                  Ledger
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 2. Deposits Table
export function ShgDepositsTable({ data, onSelectRow }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No recurring micro-savings deposit records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-3.5 py-2.5">Member & Deposit ID</th>
            <th className="px-3.5 py-2.5">SHG Affiliation</th>
            <th className="px-3.5 py-2.5">Deposit Month</th>
            <th className="px-3.5 py-2.5">Monthly Savings</th>
            <th className="px-3.5 py-2.5">Loan Repayment + Interest</th>
            <th className="px-3.5 py-2.5">Mode</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 transition-colors border-b border-slate-100/80 cursor-pointer"
            >
              <td className="px-3.5 py-3">
                <div className="font-bold text-slate-900">{row.memberName}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  {row.id} · {row.memberPhone}
                </div>
              </td>
              <td className="px-3.5 py-3 truncate max-w-[200px] text-slate-800 font-medium">
                {row.shgName}
              </td>
              <td className="px-3.5 py-3 font-mono text-emerald-700 font-bold">
                {row.depositMonth}
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-900 font-bold">
                {fmtINR(row.amountInr)}
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-teal-700 font-bold">{fmtINR(row.internalLoanRepaymentInr)}</div>
                <div className="text-slate-500">+ Int: {fmtINR(row.internalInterestPaidInr)}</div>
              </td>
              <td className="px-3.5 py-3 text-[11px] text-slate-700 font-mono">
                {row.paymentMode}
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                >
                  Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 3. Home Enterprises Storefront Table
export function HomeEnterprisesTable({ data, onSelectRow, onCurateProduct }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No homemade enterprise products found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-3.5 py-2.5">Product & SKU ID</th>
            <th className="px-3.5 py-2.5">Artisan & SHG</th>
            <th className="px-3.5 py-2.5">Category</th>
            <th className="px-3.5 py-2.5">Price & Weight</th>
            <th className="px-3.5 py-2.5">Sold Units & Revenue</th>
            <th className="px-3.5 py-2.5">FSSAI / QC Rating</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 transition-colors border-b border-slate-100/80 cursor-pointer"
            >
              <td className="px-3.5 py-3">
                <div className="font-bold text-slate-900">{row.productTitle}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.id}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-slate-900 font-semibold">{row.artisanName}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{row.shgName}</div>
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
                  {row.category}
                </span>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-emerald-700 font-bold">{fmtINR(row.priceInr)}</div>
                <div className="text-[10px] text-slate-500">{row.netWeight}</div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-slate-900 font-semibold">{row.totalSoldUnits} sold</div>
                <div className="text-[10px] text-emerald-700 font-bold">{fmtINR(row.revenueGeneratedInr)}</div>
              </td>
              <td className="px-3.5 py-3 text-[11px]">
                <div className="font-mono text-amber-700 font-bold">★ {row.qcRating} / 5.0</div>
                <div className="text-slate-500 truncate max-w-[140px]">{row.fssaiRegistration}</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onCurateProduct(row)}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold transition-all shadow-xs"
                >
                  Curate
                </button>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 4. Subsidies Table
export function ShgSubsidiesTable({ data, onSelectRow, onDisburseSubsidy }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No interest subvention subsidies or grant records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-3.5 py-2.5">Grant Scheme & ID</th>
            <th className="px-3.5 py-2.5">Beneficiary SHG</th>
            <th className="px-3.5 py-2.5">Grant Type</th>
            <th className="px-3.5 py-2.5">Sanctioned Amount</th>
            <th className="px-3.5 py-2.5">Bank UTR Reference</th>
            <th className="px-3.5 py-2.5">Status & Dual Sign-Off</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 transition-colors border-b border-slate-100/80 cursor-pointer"
            >
              <td className="px-3.5 py-3">
                <div className="font-bold text-slate-900">{row.schemeName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.id}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-800 font-semibold">
                {row.shgName}
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
                  {row.grantType}
                </span>
              </td>
              <td className="px-3.5 py-3 font-mono font-bold text-emerald-700">
                {fmtINR(row.amountInr)}
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px] text-slate-600 font-medium">
                {row.bankReferenceUtr || 'Pending Transfer'}
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
                {row.amountInr > 50000 && (
                  <div className="text-[10px] text-teal-800 font-mono mt-0.5 flex items-center gap-1 font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Dual Sign-Off &gt; ₹50k</span>
                  </div>
                )}
              </td>
              <td className="px-3.5 py-3 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                {(row.status === 'pending_approval' || row.status === 'dual_signoff_pending') && (
                  <button
                    onClick={() => onDisburseSubsidy(row)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 text-[11px] font-bold transition-all shadow-xs"
                  >
                    Disburse
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                >
                  Audit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 5. Audit Logs Table
export function WomenAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No administrative audit logs found for Women in Agriculture.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-3.5 py-2.5">Timestamp & IP</th>
            <th className="px-3.5 py-2.5">Action & Collection</th>
            <th className="px-3.5 py-2.5">Target Entity</th>
            <th className="px-3.5 py-2.5">State Transition</th>
            <th className="px-3.5 py-2.5">Administrative Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors border-b border-slate-100/80">
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">{formatDate(row.timestamp)}</div>
                <div className="text-slate-500">
                  {row.ipAddress} · {row.adminName}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold">
                  {row.actionType}
                </span>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="font-bold text-slate-900">{row.entityName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
              </td>
              <td className="px-3.5 py-3 text-[11px] font-mono">
                {row.previousState && <div className="text-slate-500">Prev: {row.previousState}</div>}
                <div className="text-emerald-700 font-bold">New: {row.newState}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-600 max-w-xs">{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Pagination
export function ContentPagination({ page, total, pageSize = 20, onPageChange }) {
  const totalPages = Math.ceil((total || 0) / pageSize) || 1
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-500 font-medium">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono text-slate-800 font-bold">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 hover:bg-slate-50 shadow-xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

