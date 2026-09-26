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
  Ban,
  Layers,
  RotateCcw,
  Smartphone,
  Mic,
  Volume2,
  Radio
} from 'lucide-react'
import {
  AgroStatusDropdown,
  AgroDistrictDropdown,
  AgroDateDropdown,
  AgroPersonaDropdown,
  AgroFilterDropdown
} from '../components/ui/AgroFilterDropdown'

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
    rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-800 border-rose-200/80' },

    // District Telemetry
    optimal: { label: 'Optimal Adoption', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
    expanding: { label: 'Adoption Expanding', bg: 'bg-teal-50 text-teal-800 border-teal-200/80' },
    attention: { label: 'Cluster Attention', bg: 'bg-amber-50 text-amber-800 border-amber-200/80' }
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
        title="Mahila Kisan Federations"
        value={`${summary.totalActiveShgs || 0} SHGs`}
        subtitle={`${summary.totalMahilaKisanMembers || 0} active rural women members`}
        icon={Users}
        badge="NRLM Linked"
        color="emerald"
      />
      <MetricCard
        title="Cumulative Savings Corpus"
        value={fmtINR(summary.cumulativeSavingsCorpusInr || 0)}
        subtitle={`${summary.averageLoanRecoveryRatePct || 97.4}% loan repayment discipline`}
        icon={PiggyBank}
        badge="Micro-Savings"
        color="blue"
      />
      <MetricCard
        title="Home Agro-Enterprises"
        value={fmtINR(summary.totalEnterpriseRevenueInr || 0)}
        subtitle={`${summary.activeStorefrontProducts || 0} marketplace cottage SKUs`}
        icon={ShoppingBag}
        badge="Direct Mandi"
        color="purple"
      />
      <MetricCard
        title="Governance & Audit Desk"
        value={`${summary.pendingVerificationShgs || 0} Pending`}
        subtitle={`${summary.flaggedAuditAlerts || 0} flagged audit/deposit discrepancy`}
        icon={ShieldCheck}
        badge={summary.flaggedAuditAlerts > 0 ? 'Action Req' : 'Compliant'}
        color={summary.flaggedAuditAlerts > 0 ? 'rose' : 'amber'}
      />
    </div>
  )
}

export function WomenShgTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'shgs', label: 'SHG Federation Directory', icon: HandHeart, count: counts.shgs },
    { id: 'deposits', label: 'Recurring Savings Ledger', icon: PiggyBank, count: counts.deposits },
    { id: 'enterprises', label: 'Cottage Enterprise Storefront', icon: Store, count: counts.enterprises },
    { id: 'subsidies', label: 'Interest Subvention Grants', icon: Coins, count: counts.subsidies },
    { id: 'districts', label: 'Women Mode & District Telemetry', icon: Smartphone, count: counts.districts },
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
  dateRange = 'all',
  onDateRangeChange = () => {},
  persona = 'all',
  onPersonaChange = () => {},
  activeTab,
  onRefresh,
  onExportCsv,
  onAddNew,
  onResetSeed,
  canMutate = true
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
        <AgroStatusDropdown
          value={statusFilter}
          onChange={onStatusChange}
          options={
            activeTab === 'shgs'
              ? [
                  { value: 'all', label: 'All SHG Statuses', dotColor: 'bg-slate-400' },
                  { value: 'verified', label: 'NRLM Verified', dotColor: 'bg-emerald-500', badge: 'Verified' },
                  { value: 'pending_verification', label: 'Pending Verification', dotColor: 'bg-amber-500', badge: 'Review' },
                  { value: 'flagged_audit', label: 'Audit Flagged', dotColor: 'bg-rose-500', badge: 'Alert' },
                  { value: 'suspended', label: 'Suspended SHG', dotColor: 'bg-slate-400' }
                ]
              : activeTab === 'deposits'
              ? [
                  { value: 'all', label: 'All Deposit Statuses', dotColor: 'bg-slate-400' },
                  { value: 'cleared', label: 'Cleared Savings', dotColor: 'bg-emerald-500', badge: 'Cleared' },
                  { value: 'pending', label: 'Pending Doorstep Pickup', dotColor: 'bg-amber-500' },
                  { value: 'flagged_discrepancy', label: 'Audit Discrepancy', dotColor: 'bg-rose-500', badge: 'Flag' }
                ]
              : activeTab === 'enterprises'
              ? [
                  { value: 'all', label: 'All Product Statuses', dotColor: 'bg-slate-400' },
                  { value: 'approved', label: 'Storefront Active', dotColor: 'bg-emerald-500', badge: 'Live' },
                  { value: 'pending_review', label: 'Pending Curation', dotColor: 'bg-amber-500' },
                  { value: 'changes_requested', label: 'Changes Requested', dotColor: 'bg-purple-500' },
                  { value: 'delisted', label: 'Delisted Product', dotColor: 'bg-slate-400' }
                ]
              : activeTab === 'subsidies'
              ? [
                  { value: 'all', label: 'All Subsidy Statuses', dotColor: 'bg-slate-400' },
                  { value: 'disbursed', label: '3% Subvention Disbursed', dotColor: 'bg-emerald-500', badge: 'DBT' },
                  { value: 'pending_approval', label: 'Pending Approval', dotColor: 'bg-amber-500' },
                  { value: 'dual_signoff_pending', label: 'Dual Sign-Off Pending', dotColor: 'bg-purple-500', badge: 'Sign-Off' },
                  { value: 'rejected', label: 'Rejected Claims', dotColor: 'bg-rose-500' }
                ]
              : [
                  { value: 'all', label: 'All District Adoption', dotColor: 'bg-slate-400' },
                  { value: 'optimal', label: 'Optimal Adoption', dotColor: 'bg-emerald-500', badge: 'Optimal' },
                  { value: 'expanding', label: 'Adoption Expanding', dotColor: 'bg-sky-500' },
                  { value: 'attention', label: 'Cluster Attention Required', dotColor: 'bg-amber-500', badge: 'Attention' }
                ]
          }
        />

        {/* Secondary Filter if available */}
        {subFilterOptions.length > 0 && (
          <AgroFilterDropdown
            label={subFilterLabel}
            value={subFilter}
            onChange={onSubFilterChange}
            options={[{ value: 'all', label: `${subFilterLabel}: All` }, ...subFilterOptions]}
          />
        )}

        {/* Date Range Filter */}
        <AgroDateDropdown
          value={dateRange}
          onChange={onDateRangeChange}
          options={[
            { value: 'all', label: 'Date: All Time', subtext: 'Cumulative historical ledger' },
            { value: 'today', label: 'Today (Live Activity)', subtext: 'Past 24 hours activity' },
            { value: 'last_7_days', label: 'Last 7 Days', subtext: 'Weekly operational cycle' },
            { value: 'last_30_days', label: 'Last 30 Days', subtext: 'Monthly billing cycle' },
            { value: 'this_quarter', label: 'This Quarter', subtext: 'Q1 fiscal cycle' }
          ]}
        />

        {/* Persona Filter */}
        <AgroPersonaDropdown
          value={persona}
          onChange={onPersonaChange}
          options={[
            { value: 'all', label: 'All Stakeholders', subtext: 'Full women empowerment ecosystem' },
            { value: 'mahila_kisan', label: 'Mahila Kisan (Women Farmers)', badge: 'Producers', subtext: 'Direct agri-cultivators' },
            { value: 'shg_leader', label: 'SHG Leadership & Presidents', badge: 'Federation', subtext: 'Group coordinators' },
            { value: 'enterprise_artisan', label: 'Cottage Artisans & Food Units', badge: 'Makers', subtext: 'Handcrafted products' },
            { value: 'nrlm_officer', label: 'NRLM & Bank Sakhi Officers', badge: 'Govt Field', subtext: 'District nodal officers' }
          ]}
        />
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
        {onResetSeed && (
          <button
            onClick={onResetSeed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-xs"
            title="Reset to SOP-24 Benchmark Seed Data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        )}
        {onAddNew && canMutate && (
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

// -------------------------------------------------------------
// BATCH ACTION BAR
// -------------------------------------------------------------
export function BatchActionBar({
  selectedCount = 0,
  activeTab = 'shgs',
  onBatchAction,
  onClearSelection,
  canMutate = true
}) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-emerald-950 text-white px-4 py-2.5 rounded-2xl mb-4 flex flex-wrap items-center justify-between gap-3 shadow-xl border border-emerald-800 animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold bg-emerald-800 text-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-700">
          {selectedCount} selected
        </span>
        <span className="text-xs text-emerald-200 hidden sm:inline">
          Batch bulk actions for <span className="font-bold text-white uppercase">{activeTab}</span>:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {canMutate && activeTab === 'shgs' && (
          <>
            <button
              onClick={() => onBatchAction('verify_shgs')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Verify Selected
            </button>
            <button
              onClick={() => onBatchAction('suspend_shgs')}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-600 rounded-xl font-semibold shadow-xs transition text-white"
            >
              Suspend Selected
            </button>
          </>
        )}

        {canMutate && activeTab === 'deposits' && (
          <button
            onClick={() => onBatchAction('clear_deposits')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
          >
            Reconcile & Clear
          </button>
        )}

        {canMutate && activeTab === 'enterprises' && (
          <>
            <button
              onClick={() => onBatchAction('approve_products')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Approve for Storefront
            </button>
            <button
              onClick={() => onBatchAction('request_changes')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold shadow-xs transition"
            >
              Request Changes
            </button>
            <button
              onClick={() => onBatchAction('delist_products')}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-600 rounded-xl font-semibold shadow-xs transition text-white"
            >
              Delist
            </button>
          </>
        )}

        {canMutate && activeTab === 'subsidies' && (
          <button
            onClick={() => onBatchAction('disburse_subsidies')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
          >
            Disburse Approved Grants
          </button>
        )}

        <button
          onClick={() => onBatchAction('export_selected')}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 rounded-xl font-semibold shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Selected</span>
        </button>

        <button
          onClick={onClearSelection}
          className="px-2.5 py-1 text-slate-300 hover:text-white underline font-semibold transition"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 1. SHGS TABLE
// -------------------------------------------------------------
export function WomenShgsTable({
  data,
  onSelectRow,
  onVerifyShg,
  onSuspendShg,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No Self Help Groups found matching criteria.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-2.5 px-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
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
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`cursor-pointer transition-colors border-b border-slate-100/80 ${
                  isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'
                }`}
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
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
                  {canMutate && row.status === 'pending_verification' && (
                    <button
                      onClick={() => onVerifyShg(row)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 text-[11px] font-bold transition-all shadow-xs"
                    >
                      Verify
                    </button>
                  )}
                  {canMutate && row.status === 'verified' && (
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// 2. DEPOSITS TABLE
// -------------------------------------------------------------
export function ShgDepositsTable({
  data,
  onSelectRow,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No recurring micro-savings deposit records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-2.5 px-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
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
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`cursor-pointer transition-colors border-b border-slate-100/80 ${
                  isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'
                }`}
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// 3. HOME ENTERPRISES STOREFRONT TABLE
// -------------------------------------------------------------
export function HomeEnterprisesTable({
  data,
  onSelectRow,
  onCurateProduct,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No homemade enterprise products found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-2.5 px-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
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
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`cursor-pointer transition-colors border-b border-slate-100/80 ${
                  isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'
                }`}
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
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
                  {canMutate && (
                    <button
                      onClick={() => onCurateProduct(row)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold transition-all shadow-xs"
                    >
                      Curate
                    </button>
                  )}
                  <button
                    onClick={() => onSelectRow(row)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    Details
                  </button>
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
// 4. SUBSIDIES TABLE
// -------------------------------------------------------------
export function ShgSubsidiesTable({
  data,
  onSelectRow,
  onDisburseSubsidy,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 p-8 text-center text-slate-500 text-xs shadow-xs">
        No interest subvention subsidies or grant records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-2.5 px-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
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
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`cursor-pointer transition-colors border-b border-slate-100/80 ${
                  isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'
                }`}
              >
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
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
                  {canMutate && (row.status === 'pending_approval' || row.status === 'dual_signoff_pending') && (
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// -------------------------------------------------------------
// 5. AUDIT LOGS TABLE
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 6. WOMEN MODE DISTRICT ADOPTION TABLE
// -------------------------------------------------------------
export function DistrictAdoptionTable({
  data,
  loading,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onViewDistrict,
  canMutate = true
}) {
  if (loading) {
    return (
      <div className="bg-white/80 rounded-2xl border border-emerald-100 p-8 text-center text-slate-500 font-medium text-xs">
        Loading district telemetry & adoption metrics...
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/80 rounded-2xl border border-emerald-100 p-8 text-center text-slate-500 font-medium text-xs">
        No rural district adoption records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs text-slate-600 border-collapse">
        <thead>
          <tr className="border-b border-emerald-100/80 bg-emerald-50/50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <th className="px-3.5 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="px-3.5 py-3">District / State</th>
            <th className="px-3.5 py-3">Active Women Mode Users</th>
            <th className="px-3.5 py-3">SHG Linkage Rate</th>
            <th className="px-3.5 py-3">Voice Dialect Usage</th>
            <th className="px-3.5 py-3">Audio Passbook Sessions</th>
            <th className="px-3.5 py-3">NRLM Cluster Officer</th>
            <th className="px-3.5 py-3">Adoption Status</th>
            <th className="px-3.5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr key={row.id} className={`hover:bg-emerald-50/30 transition-colors ${isSelected ? 'bg-emerald-50/50' : ''}`}>
                <td className="px-3.5 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-bold text-slate-900">{row.district}</div>
                  <div className="text-[11px] text-slate-500">{row.state} · ID: {row.id}</div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-bold text-emerald-700 font-mono text-sm">
                    {row.activeWomenModeUsers.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Registered Mahila Kisans</div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-bold text-slate-800 font-mono">{row.shgLinkageRatePct}%</div>
                  <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${row.shgLinkageRatePct}%` }} />
                  </div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="inline-flex items-center gap-1 font-bold text-slate-800 font-mono">
                    <Mic className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{row.voiceInterfacePct}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Marathi / Hindi Dialects</div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-mono text-slate-700 font-semibold">
                    {row.audioPassbookSessions.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Audio Inquiries</div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-medium text-slate-900">{row.nrlmClusterOfficer}</div>
                  <div className="text-[10px] font-mono text-slate-500">{row.officerPhone}</div>
                </td>
                <td className="px-3.5 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3.5 py-3 text-right">
                  <button
                    onClick={() => onViewDistrict(row)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 hover:bg-emerald-100/60 transition-colors"
                  >
                    View Details
                  </button>
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
// WOMEN MODE SIMULATION BANNER
// -------------------------------------------------------------
export function WomenModeSimulationBanner({ isEnabled, onToggle }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all mb-6 ${
      isEnabled
        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg border-emerald-500'
        : 'bg-white/90 border-emerald-100/90 text-slate-700'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold tracking-tight ${isEnabled ? 'text-white' : 'text-slate-900'}`}>
                Women Mode Mobile Interface Simulation
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isEnabled ? 'bg-white/20 text-white border border-white/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isEnabled ? 'Preview Active' : 'SOP-24 Feature'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isEnabled ? 'text-emerald-100' : 'text-slate-500'}`}>
              High-contrast accessibility mode with local dialect voice navigation (Marathi/Hindi), spoken ledger passbooks, and instant SHG emergency credit SOS.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {isEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-mono text-emerald-100 border border-white/20">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Voice Guidance: Online</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isEnabled
                ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isEnabled ? 'Exit Preview' : 'Preview Women Mode'}
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// PAGINATION
// -------------------------------------------------------------
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
