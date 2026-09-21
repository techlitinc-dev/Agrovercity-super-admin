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
  ExternalLink
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
    // Settlements
    paid: { label: 'Disbursed (Paid)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    approved: { label: 'Batch Approved', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    pending: { label: 'Pending Calculation', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    on_hold: { label: 'Legal Settlement Hold', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse' },
    rejected: { label: 'Rejected / Discarded', bg: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/30' },

    // Cron jobs
    success: { label: 'Success (200 OK)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    running: { label: 'Running Now', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30 animate-pulse' },
    failed: { label: 'Job Failed', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40' },

    // Transporter
    settled: { label: 'Settled', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_batch: { label: 'Pending T+1 Batch', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    dispute_hold: { label: 'Dispute Freeze', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },

    // Seller
    released: { label: 'Escrow Released', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_release: { label: 'Awaiting Maturity', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-800 text-slate-400 border-slate-700' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function PersonaBadge({ type }) {
  const map = {
    transporter: { label: 'Transporter Freight', icon: Truck, bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    seller: { label: 'Produce Seller Escrow', icon: Package, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    equipment_owner: { label: 'Equipment Rental', icon: Tractor, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    broker: { label: 'Mandi Brokerage', icon: Layers, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }
  }
  const badge = map[type] || { label: type, icon: Coins, bg: 'bg-slate-800 text-slate-400 border-slate-700' }
  const Icon = badge.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      <Icon className="w-3 h-3" />
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
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
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-xl animate-pulse" />
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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
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
  activeTab,
  onRefresh,
  onExportCsv,
  onTriggerBatchRun
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by beneficiary, batch ID, UTR, GST invoice..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Status Dropdown */}
        {activeTab === 'settlements' && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid (Disbursed)</option>
            <option value="on_hold">On Legal Hold</option>
          </select>
        )}

        {/* Persona Dropdown */}
        {activeTab === 'settlements' && (
          <select
            value={personaFilter}
            onChange={(e) => onPersonaChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Personas</option>
            <option value="transporter">Transporter Freight</option>
            <option value="seller">Produce Seller</option>
            <option value="equipment_owner">Equipment Rental</option>
            <option value="broker">Mandi Broker</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          title="Refresh dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        {onTriggerBatchRun && (
          <button
            onClick={onTriggerBatchRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Trigger Settlement Run</span>
          </button>
        )}
      </div>
    </div>
  )
}

// 1. Master Settlements Table
export function SettlementsTable({ data, onSelectRow, onMarkPaid, onHold, onReleaseHold }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No settlement batches found matching criteria.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Batch ID & Period</th>
            <th className="px-3.5 py-2.5">Beneficiary & Persona</th>
            <th className="px-3.5 py-2.5">Gross Deal (₹)</th>
            <th className="px-3.5 py-2.5">Fee + GST + TDS (₹)</th>
            <th className="px-3.5 py-2.5">Net Payout (₹)</th>
            <th className="px-3.5 py-2.5">Bank Reference UTR</th>
            <th className="px-3.5 py-2.5">Status & Dual Sign</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <td className="px-3.5 py-3 font-mono">
                <div className="font-bold text-white">{row.batchId}</div>
                <div className="text-[10px] text-slate-400">{row.settlementPeriod}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="font-medium text-white">{row.beneficiaryName}</div>
                <div className="mt-0.5">
                  <PersonaBadge type={row.entityType} />
                </div>
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-200">
                {fmtINR(row.grossAmountInr)}
                <div className="text-[10px] text-slate-400">({row.ordersCount} items)</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-purple-400">Fee: {fmtINR(row.platformFeeInr)} ({row.commissionRatePct}%)</div>
                <div className="text-slate-400">GST: {fmtINR(row.gstOnFeeInr)} · TDS: {fmtINR(row.tdsDeductedInr)}</div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-emerald-400 font-bold text-sm">{fmtINR(row.netPayoutInr)}</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-slate-200">{row.paymentReferenceUtr || 'Pending Transfer'}</div>
                <div className="text-slate-400">{row.bankName} ({row.accountNumberMasked})</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
                {row.netPayoutInr > 50000 && (
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Dual Sign &gt; ₹50k</span>
                  </div>
                )}
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {row.status === 'approved' && (
                  <button
                    onClick={() => onMarkPaid(row)}
                    className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors"
                  >
                    Mark Paid
                  </button>
                )}
                {row.status !== 'on_hold' && row.status !== 'paid' && (
                  <button
                    onClick={() => onHold(row)}
                    className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] transition-colors"
                  >
                    Hold
                  </button>
                )}
                {row.status === 'on_hold' && (
                  <button
                    onClick={() => onReleaseHold(row)}
                    className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[11px] transition-colors"
                  >
                    Release
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 2. Transporter Payouts Table
export function TransporterPayoutsTable({ data, onSelectRow }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No transporter trip freight records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Trip ID & Vehicle</th>
            <th className="px-3.5 py-2.5">Transporter Name</th>
            <th className="px-3.5 py-2.5">Route & Consignment</th>
            <th className="px-3.5 py-2.5">Gross Freight (₹)</th>
            <th className="px-3.5 py-2.5">Platform Take (10%)</th>
            <th className="px-3.5 py-2.5">Net Freight (₹)</th>
            <th className="px-3.5 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <td className="px-3.5 py-3 font-mono">
                <div className="font-bold text-white">{row.tripId}</div>
                <div className="text-[11px] text-slate-400">{row.vehicleNo}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-white font-medium">{row.transporterName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.transporterPhone}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-slate-200">{row.route}</div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {row.consignmentCrop} · {row.distanceKm} km
                </div>
              </td>
              <td className="px-3.5 py-3 font-mono text-white font-medium">
                {fmtINR(row.grossFreightInr)}
              </td>
              <td className="px-3.5 py-3 font-mono text-purple-400">
                {fmtINR(row.platformFeeInr)}
                <div className="text-[10px] text-slate-400">TDS: {fmtINR(row.tdsInr)}</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-emerald-400 font-bold">
                {fmtINR(row.netFreightInr)}
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 3. Seller Payouts Table
export function SellerPayoutsTable({ data, onSelectRow }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No produce seller escrow release records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Lot ID & Commodity</th>
            <th className="px-3.5 py-2.5">Seller / Farmer</th>
            <th className="px-3.5 py-2.5">Buyer Corporate</th>
            <th className="px-3.5 py-2.5">Escrow Gross (₹)</th>
            <th className="px-3.5 py-2.5">Fee + Mandi Cess</th>
            <th className="px-3.5 py-2.5">Net Seller Payout (₹)</th>
            <th className="px-3.5 py-2.5">Escrow Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <td className="px-3.5 py-3 font-mono">
                <div className="font-bold text-white">{row.lotId}</div>
                <div className="text-[11px] text-emerald-400">
                  {row.commodity} ({row.quantityQuintals} Qtl)
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div className="text-white font-medium">{row.sellerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.sellerPhone}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-200">
                {row.buyerName}
              </td>
              <td className="px-3.5 py-3 font-mono text-white font-medium">
                {fmtINR(row.escrowDepositInr)}
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-purple-400">Fee (2.5%): {fmtINR(row.platformFeeInr)}</div>
                <div className="text-slate-400">Cess: {fmtINR(row.mandiCessInr)}</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-emerald-400 font-bold">
                {fmtINR(row.netSellerPayoutInr)}
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.escrowReleaseStatus} />
              </td>
            </tr>
          ))}
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-medium">Transporter Freight Take</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">{config.transporterCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted per trip under Section 194C TDS</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-medium">Equipment Rental Take</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{config.equipmentRentalCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted from CHC / custom hiring receipts</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-medium">Produce Marketplace Take</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{config.produceMarketplaceCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">Deducted on buyer escrow release</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-medium">Mandi Broker Commission</div>
          <div className="text-2xl font-bold text-purple-400 font-mono">{config.brokerCommissionPct}%</div>
          <p className="text-[11px] text-slate-500">5% Section 194H TDS applied</p>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Settlement Rules & Tax Compliance Matrix</h3>
            <p className="text-xs text-slate-400">Institutional financial controls governed by SOP-25</p>
          </div>
          <button
            onClick={onEditConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Update Rates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-semibold text-white">GST on Service Fees</div>
            <div className="text-lg font-bold font-mono text-purple-400">{config.gstOnCommissionPct}% GST</div>
            <p className="text-[11px] text-slate-400">
              Auto-generates B2B e-invoices with IRN QR codes transmitted to NIC GST portal.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-semibold text-white">Institutional Dual Sign-Off</div>
            <div className="text-lg font-bold font-mono text-emerald-400">&gt; {fmtINR(config.dualSignOffThresholdInr)}</div>
            <p className="text-[11px] text-slate-400">
              Mandates secondary executive approval for any single payout or escrow release.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-semibold text-white">Settlement Cadence</div>
            <div className="text-lg font-bold font-mono text-blue-400">{config.settlementCycleDays} Daily Nightly</div>
            <p className="text-[11px] text-slate-400">
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No scheduled Cloud Scheduler cron job logs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Job Name & Cron Expression</th>
            <th className="px-3.5 py-2.5">Description & Purpose</th>
            <th className="px-3.5 py-2.5">Last Executed At</th>
            <th className="px-3.5 py-2.5">Duration & Records</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-3.5 py-3 font-mono">
                <div className="font-bold text-white">{row.jobName}</div>
                <div className="text-[10px] text-emerald-400">{row.schedule}</div>
              </td>
              <td className="px-3.5 py-3 max-w-xs text-slate-300">
                {row.description}
                <div className="text-[10px] text-slate-500 mt-1 font-mono truncate">
                  {row.executionLogExcerpt}
                </div>
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-300 text-[11px]">
                {formatDate(row.lastExecutedAt)}
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-white">{row.recordsProcessed} items</div>
                <div className="text-slate-400">{row.durationMs} ms</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right">
                <button
                  onClick={() => onTriggerCron(row)}
                  className="flex items-center gap-1 ml-auto px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors"
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No administrative audit logs found for Financial Settlements.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Timestamp & IP</th>
            <th className="px-3.5 py-2.5">Action & Collection</th>
            <th className="px-3.5 py-2.5">Target Entity</th>
            <th className="px-3.5 py-2.5">State Transition</th>
            <th className="px-3.5 py-2.5">Administrative Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-white">{formatDate(row.timestamp)}</div>
                <div className="text-slate-500">
                  {row.ipAddress} · {row.adminName}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {row.actionType}
                </span>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="font-medium text-white">{row.entityName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
              </td>
              <td className="px-3.5 py-3 text-[11px] font-mono">
                {row.previousState && <div className="text-slate-400">Prev: {row.previousState}</div>}
                <div className="text-emerald-400">New: {row.newState}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-300 max-w-xs">{row.reason}</td>
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
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-400">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono text-slate-200">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
