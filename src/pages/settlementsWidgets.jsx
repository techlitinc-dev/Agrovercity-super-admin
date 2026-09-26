import React from 'react'
import {
  Coins,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  RefreshCw,
  Download,
  Plus,
  Play,
  Sliders,
  ShieldCheck,
  Truck,
  Package,
  Tractor,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileCheck,
  Pause,
  ExternalLink,
  RotateCcw,
  FileSpreadsheet,
  ShieldAlert
} from 'lucide-react'
import {
  AgroStatusDropdown,
  AgroPersonaDropdown,
  AgroDateDropdown,
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
    // Settlements
    paid: { label: 'Disbursed (Paid)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    approved: { label: 'Batch Approved', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' },
    pending: { label: 'Pending Calculation', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' },
    on_hold: { label: 'Legal Settlement Hold', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold animate-pulse' },
    rejected: { label: 'Rejected / Discarded', bg: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold' },

    // Cron jobs
    success: { label: 'Success (200 OK)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    running: { label: 'Running Now', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold animate-pulse' },
    failed: { label: 'Job Failed', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' },

    // Transporter
    settled: { label: 'Settled', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    pending_batch: { label: 'Pending T+1 Batch', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' },
    dispute_hold: { label: 'Dispute Freeze', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' },

    // Seller
    released: { label: 'Escrow Released', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    pending_release: { label: 'Awaiting Maturity', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-600 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function PersonaBadge({ type }) {
  const map = {
    transporter: { label: 'Transporter Freight', icon: Truck, bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    seller: { label: 'Produce Seller Escrow', icon: Package, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    equipment_owner: { label: 'Equipment Rental', icon: Tractor, bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    broker: { label: 'Mandi Brokerage', icon: Layers, bg: 'bg-purple-50 text-purple-700 border-purple-200' }
  }
  const badge = map[type] || { label: type, icon: Coins, bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  const Icon = badge.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badge.bg}`}>
      <Icon className="w-3 h-3" />
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80', badgeBg: 'bg-emerald-100/70 text-emerald-800 border-emerald-200' },
    blue: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200/80', badgeBg: 'bg-blue-100/70 text-blue-800 border-blue-200' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/80', badgeBg: 'bg-amber-100/70 text-amber-800 border-amber-200' },
    purple: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200/80', badgeBg: 'bg-purple-100/70 text-purple-800 border-purple-200' },
    rose: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/80', badgeBg: 'bg-rose-100/70 text-rose-800 border-rose-200' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${c.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function SettlementsMetricBar({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/70 border border-emerald-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Settled Volume (Month)"
        value={fmtINR(summary.totalSettledMonthInr)}
        subtitle={`Today Disbursed: ${fmtINR(summary.todayDisbursedInr)}`}
        icon={Coins}
        badge="T+1 Reconciliation"
        color="emerald"
      />
      <MetricCard
        title="Pending Payout Queue"
        value={fmtINR(summary.pendingPayoutQueueInr)}
        subtitle={`${summary.pendingApprovalBatchesCount || 0} Batches Awaiting Disburse`}
        icon={Clock}
        badge="Ready for NEFT / RazorpayX"
        color="blue"
      />
      <MetricCard
        title="Platform Commissions"
        value={fmtINR(summary.platformCommissionsRetainedInr)}
        subtitle="10% Freight + 12% Equip + 2.5% Agro"
        icon={TrendingUp}
        badge="18% GST Compliant"
        color="purple"
      />
      <MetricCard
        title="Legal Holds & Cron Health"
        value={`${summary.activeLegalHoldsCount || 0} Hold | ${summary.cronSuccessRatePct || 100}%`}
        subtitle={`${summary.cronJobsCount || 6} Cloud Scheduler Cron Tasks`}
        icon={summary.activeLegalHoldsCount > 0 ? AlertTriangle : ShieldCheck}
        badge={summary.activeLegalHoldsCount > 0 ? 'Dispute Freeze' : 'Cron Healthy'}
        color={summary.activeLegalHoldsCount > 0 ? 'rose' : 'emerald'}
      />
    </div>
  )
}

export function SettlementsTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'settlements', label: 'Master Settlements Ledger', icon: Coins, count: counts.settlements },
    { id: 'transporters', label: 'Transporter Freight Payouts', icon: Truck, count: counts.transporters },
    { id: 'sellers', label: 'Produce Seller Escrow', icon: Package, count: counts.sellers },
    { id: 'config', label: 'Commission Rates & Taxes', icon: Sliders },
    { id: 'cron', label: 'Scheduled Cron Jobs', icon: Clock, count: counts.cron },
    { id: 'audit', label: 'Compliance & Audit Trail', icon: ShieldCheck, count: counts.audit }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-100/90 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
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

export function SettlementsFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  personaFilter,
  onPersonaChange,
  dateRange = 'all',
  onDateRangeChange,
  activeTab,
  onRefresh,
  onExportCsv,
  onTriggerBatchRun,
  onResetSeed,
  canMutate = true
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-100/90 shadow-xs">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by beneficiary, batch ID, UTR, GST invoice..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Dropdown */}
        {activeTab === 'settlements' && (
          <AgroStatusDropdown
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { value: 'all', label: 'All Batch Statuses', dotColor: 'bg-slate-400' },
              { value: 'approved', label: 'Approved for Disbursal', dotColor: 'bg-emerald-500', badge: 'Ready' },
              { value: 'pending', label: 'Pending Batch Calculation', dotColor: 'bg-amber-500', badge: 'Queue' },
              { value: 'paid', label: 'Paid & Reconciled (UTR Confirmed)', dotColor: 'bg-teal-500', badge: 'Disbursed' },
              { value: 'on_hold', label: 'On Legal / Escrow Hold', dotColor: 'bg-rose-500', badge: 'Frozen' }
            ]}
          />
        )}
        {activeTab === 'transporters' && (
          <AgroStatusDropdown
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { value: 'all', label: 'All Trip Statuses', dotColor: 'bg-slate-400' },
              { value: 'settled', label: 'Settled Payouts', dotColor: 'bg-emerald-500', badge: 'Settled' },
              { value: 'pending_batch', label: 'Pending T+1 Batch', dotColor: 'bg-amber-500', badge: 'T+1' },
              { value: 'dispute_hold', label: 'Dispute Hold / Grievance', dotColor: 'bg-rose-500', badge: 'Hold' }
            ]}
          />
        )}
        {activeTab === 'sellers' && (
          <AgroStatusDropdown
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { value: 'all', label: 'All Escrow Statuses', dotColor: 'bg-slate-400' },
              { value: 'released', label: 'Escrow Released to Seller', dotColor: 'bg-emerald-500', badge: 'Released' },
              { value: 'pending_release', label: 'Awaiting 48h Inspection Maturity', dotColor: 'bg-amber-500', badge: 'Escrow' }
            ]}
          />
        )}

        {/* Persona Dropdown */}
        {activeTab === 'settlements' && (
          <AgroPersonaDropdown
            value={personaFilter}
            onChange={onPersonaChange}
            options={[
              { value: 'all', label: 'All Personas', subtext: 'Entire financial ledger' },
              { value: 'transporter', label: 'Transporter Freight', badge: '10% Comm', subtext: 'Logistics and haulage fleet' },
              { value: 'seller', label: 'Produce Seller', badge: '2.5% Comm', subtext: 'Farmers & Mandi merchants' },
              { value: 'equipment_owner', label: 'Equipment Rental', badge: '12% Comm', subtext: 'Harvester & Tractor hubs' },
              { value: 'broker', label: 'Mandi Commission Agent', subtext: 'APMC intermediary trade' }
            ]}
          />
        )}

        {/* Date Range Dropdown */}
        {onDateRangeChange && (
          <AgroDateDropdown
            value={dateRange}
            onChange={onDateRangeChange}
            options={[
              { value: 'all', label: 'Date: All Time', subtext: 'Cumulative historical ledger' },
              { value: 'today', label: 'Today (Live Batches)', subtext: 'Past 24 hours realtime activity' },
              { value: 'last_7_days', label: 'Last 7 Days', subtext: 'Weekly operational cycle' },
              { value: 'last_30_days', label: 'Last 30 Days', subtext: 'Monthly billing cycle' },
              { value: 'this_quarter', label: 'This Quarter', subtext: 'Q1 fiscal reconciliation' }
            ]}
          />
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          title="Refresh dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        {onResetSeed && (
          <button
            onClick={onResetSeed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Reset to benchmark seed data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        )}
        {onTriggerBatchRun && canMutate && (
          <button
            onClick={onTriggerBatchRun}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Trigger Settlement Run</span>
          </button>
        )}
      </div>

      {/* Quick Filter Chips for Master Settlements Ledger */}
      {activeTab === 'settlements' && (
        <div className="w-full flex items-center gap-1.5 pt-2.5 border-t border-slate-100 flex-wrap text-[11px]">
          <span className="text-slate-400 font-semibold mr-1">Quick Filter:</span>
          {[
            { id: 'all', label: 'All Personas' },
            { id: 'transporter', label: 'Transporters (10%)' },
            { id: 'equipment_owner', label: 'Equipment CHC (12%)' },
            { id: 'broker', label: 'Mandi Brokers (2%)' },
            { id: 'seller', label: 'Produce Sellers (2.5%)' }
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onPersonaChange && onPersonaChange(chip.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                personaFilter === chip.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
          <span className="text-slate-300 mx-1">|</span>
          <button
            type="button"
            onClick={() => onStatusChange && onStatusChange(statusFilter === 'on_hold' ? 'all' : 'on_hold')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              statusFilter === 'on_hold'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            Dispute Holds
          </button>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// BATCH ACTION BAR
// -------------------------------------------------------------
export function BatchActionBar({
  selectedCount = 0,
  activeTab = 'settlements',
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
        {canMutate && activeTab === 'settlements' && (
          <>
            <button
              onClick={() => onBatchAction('batch_approve')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Approve Selected
            </button>
            <button
              onClick={() => onBatchAction('batch_mark_paid')}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded-xl font-semibold shadow-xs transition"
            >
              Mark Paid (Bulk UTR)
            </button>
            <button
              onClick={() => onBatchAction('batch_hold')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold shadow-xs transition text-white"
            >
              Legal Hold
            </button>
            <button
              onClick={() => onBatchAction('batch_release_hold')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-xs transition text-white"
            >
              Release Hold
            </button>
          </>
        )}

        <button
          onClick={() => onBatchAction('export_selected')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold border border-slate-700 transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export Selected</span>
        </button>

        <button
          onClick={onClearSelection}
          className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-medium transition"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

// 1. Master Settlements Table
export function SettlementsTable({
  data,
  onSelectRow,
  onMarkPaid,
  onHold,
  onReleaseHold,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No settlement batches found matching criteria.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-3.5 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="px-4 py-3">Batch ID & Period</th>
            <th className="px-4 py-3">Beneficiary & Persona</th>
            <th className="px-4 py-3">Gross Deal (₹)</th>
            <th className="px-4 py-3">Fee + GST + TDS (₹)</th>
            <th className="px-4 py-3">Net Payout (₹)</th>
            <th className="px-4 py-3">Bank Reference UTR</th>
            <th className="px-4 py-3">Status & Dual Sign</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`hover:bg-emerald-50/60 cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
              >
                <td className="px-3.5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect && onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-4 py-3.5 font-mono">
                  <div className="font-bold text-slate-900">{row.batchId}</div>
                  <div className="text-[10px] text-slate-500">{row.settlementPeriod}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{row.beneficiaryName}</div>
                  <div className="mt-0.5">
                    <PersonaBadge type={row.entityType} />
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-800">
                  {fmtINR(row.grossAmountInr)}
                  <div className="text-[10px] text-slate-500">({row.ordersCount} items)</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px]">
                  <div className="text-purple-700 font-semibold">Fee: {fmtINR(row.platformFeeInr)} ({row.commissionRatePct}%)</div>
                  <div className="text-slate-500">GST: {fmtINR(row.gstOnFeeInr)} · TDS: {fmtINR(row.tdsDeductedInr)}</div>
                </td>
                <td className="px-4 py-3.5 font-mono">
                  <div className="text-emerald-700 font-bold text-sm">{fmtINR(row.netPayoutInr)}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px]">
                  <div className="text-slate-800 font-medium">{row.paymentReferenceUtr || 'Pending Transfer'}</div>
                  <div className="text-slate-500">{row.bankName} ({row.accountNumberMasked})</div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.status} />
                  {row.netPayoutInr > 50000 && (
                    <div className="text-[10px] text-purple-700 font-mono font-semibold mt-1 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Dual Sign &gt; ₹50k</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                  {canMutate && row.status === 'approved' && onMarkPaid && (
                    <button
                      onClick={() => onMarkPaid(row)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors shadow-xs"
                    >
                      Mark Paid
                    </button>
                  )}
                  {canMutate && row.status !== 'on_hold' && row.status !== 'paid' && onHold && (
                    <button
                      onClick={() => onHold(row)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold transition-colors shadow-xs"
                    >
                      Hold
                    </button>
                  )}
                  {canMutate && row.status === 'on_hold' && onReleaseHold && (
                    <button
                      onClick={() => onReleaseHold(row)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold transition-colors shadow-xs"
                    >
                      Release
                    </button>
                  )}
                  <button
                    onClick={() => onSelectRow(row)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    View
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

// 2. Transporter Payouts Table
export function TransporterPayoutsTable({
  data,
  onSelectRow,
  selectedIds = [],
  onToggleSelect,
  onSelectAll
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No transporter trip freight records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-3.5 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="px-4 py-3">Trip ID & Vehicle</th>
            <th className="px-4 py-3">Transporter Name</th>
            <th className="px-4 py-3">Route & Consignment</th>
            <th className="px-4 py-3">Gross Freight (₹)</th>
            <th className="px-4 py-3">Platform Take (10%)</th>
            <th className="px-4 py-3">Net Freight (₹)</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`hover:bg-emerald-50/60 cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
              >
                <td className="px-3.5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect && onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-4 py-3.5 font-mono">
                  <div className="font-bold text-slate-900">{row.tripId}</div>
                  <div className="text-[11px] text-slate-500">{row.vehicleNo}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-900 font-bold">{row.transporterName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{row.transporterPhone}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-800 font-medium">{row.route}</div>
                  <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                    {row.consignmentCrop} · {row.distanceKm} km
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-900 font-bold">
                  {fmtINR(row.grossFreightInr)}
                </td>
                <td className="px-4 py-3.5 font-mono text-purple-700 font-semibold">
                  {fmtINR(row.platformFeeInr)}
                  <div className="text-[10px] text-slate-500">TDS: {fmtINR(row.tdsInr)}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                  {fmtINR(row.netFreightInr)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// 3. Seller Payouts Table
export function SellerPayoutsTable({
  data,
  onSelectRow,
  selectedIds = [],
  onToggleSelect,
  onSelectAll
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No produce seller escrow release records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row.id))

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-3.5 py-3 w-8">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="px-4 py-3">Lot ID & Commodity</th>
            <th className="px-4 py-3">Seller / Farmer</th>
            <th className="px-4 py-3">Buyer Corporate</th>
            <th className="px-4 py-3">Escrow Gross (₹)</th>
            <th className="px-4 py-3">Fee + Mandi Cess</th>
            <th className="px-4 py-3">Net Seller Payout (₹)</th>
            <th className="px-4 py-3">Escrow Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className={`hover:bg-emerald-50/60 cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}
              >
                <td className="px-3.5 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect && onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-4 py-3.5 font-mono">
                  <div className="font-bold text-slate-900">{row.lotId}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {row.commodity} ({row.quantityQuintals} Qtl)
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-900 font-bold">{row.sellerName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{row.sellerPhone}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-800 font-medium">
                  {row.buyerName}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-900 font-bold">
                  {fmtINR(row.escrowDepositInr)}
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px]">
                  <div className="text-purple-700 font-semibold">Fee (2.5%): {fmtINR(row.platformFeeInr)}</div>
                  <div className="text-slate-500">Cess: {fmtINR(row.mandiCessInr)}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                  {fmtINR(row.netSellerPayoutInr)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.escrowReleaseStatus} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// 4. Commission Matrix View
export function PlatformCommissionsView({ config, onEditConfig }) {
  if (!config) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Transporter Freight Take</div>
          <div className="text-2xl font-bold text-blue-700 font-mono">{config.transporterCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted per trip under Section 194C TDS</p>
        </div>
        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Equipment Rental Take</div>
          <div className="text-2xl font-bold text-amber-700 font-mono">{config.equipmentRentalCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted from CHC / custom hiring receipts</p>
        </div>
        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Produce Marketplace Take</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">{config.produceMarketplaceCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted on buyer escrow release</p>
        </div>
        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mandi Broker Commission</div>
          <div className="text-2xl font-bold text-purple-700 font-mono">{config.brokerCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">5% Section 194H TDS applied</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Settlement Rules & Tax Compliance Matrix</h3>
            <p className="text-xs text-slate-500">Institutional financial controls governed by SOP-25</p>
          </div>
          <button
            onClick={onEditConfig}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Update Rates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/80 space-y-2">
            <div className="font-bold text-slate-900">GST on Service Fees</div>
            <div className="text-lg font-bold font-mono text-purple-700">{config.gstOnCommissionPct}% GST</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Auto-generates B2B e-invoices with IRN QR codes transmitted to NIC GST portal.
            </p>
          </div>
          <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/80 space-y-2">
            <div className="font-bold text-slate-900">Institutional Dual Sign-Off</div>
            <div className="text-lg font-bold font-mono text-emerald-700">&gt; {fmtINR(config.dualSignOffThresholdInr)}</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Mandates secondary executive approval for any single payout or escrow release.
            </p>
          </div>
          <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/80 space-y-2">
            <div className="font-bold text-slate-900">Settlement Cadence</div>
            <div className="text-lg font-bold font-mono text-blue-700">{config.settlementCycleDays} Daily Nightly</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Nightly 02:00 UTC Cloud Scheduler batch execution via RazorpayX / Direct Bank NEFT.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 5. Scheduled Cron Jobs Table
export function CronJobLogsTable({ data, onTriggerCron }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No scheduled Cloud Scheduler cron job logs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">Job Name & Cron Expression</th>
            <th className="px-4 py-3">Description & Purpose</th>
            <th className="px-4 py-3">Last Executed At</th>
            <th className="px-4 py-3">Duration & Records</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="px-4 py-3.5 font-mono">
                <div className="font-bold text-slate-900">{row.jobName}</div>
                <div className="text-[10px] text-emerald-700 font-bold">{row.schedule}</div>
              </td>
              <td className="px-4 py-3.5 max-w-xs text-slate-700">
                <div className="font-medium">{row.description}</div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono truncate">
                  {row.executionLogExcerpt}
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-700 text-[11px]">
                {formatDate(row.lastExecutedAt)}
              </td>
              <td className="px-4 py-3.5 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">{row.recordsProcessed} items</div>
                <div className="text-slate-500">{row.durationMs} ms</div>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <button
                  onClick={() => onTriggerCron(row)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors shadow-xs"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Now</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 6. Audit Logs Table
export function SettlementsAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No administrative audit logs found for Financial Settlements.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">Timestamp & IP</th>
            <th className="px-4 py-3">Action & Collection</th>
            <th className="px-4 py-3">Target Entity</th>
            <th className="px-4 py-3">State Transition</th>
            <th className="px-4 py-3">Administrative Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="px-4 py-3.5 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">{formatDate(row.timestamp)}</div>
                <div className="text-slate-500">
                  {row.ipAddress} · {row.adminName}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {row.actionType}
                </span>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
              </td>
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-900">{row.entityName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
              </td>
              <td className="px-4 py-3.5 text-[11px] font-mono">
                {row.previousState && <div className="text-slate-500">Prev: {row.previousState}</div>}
                <div className="text-emerald-700 font-bold">New: {row.newState}</div>
              </td>
              <td className="px-4 py-3.5 text-slate-700 max-w-xs">{row.reason}</td>
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
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-600">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs disabled:opacity-40 hover:bg-slate-50 text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono font-bold text-slate-800">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs disabled:opacity-40 hover:bg-slate-50 text-slate-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
