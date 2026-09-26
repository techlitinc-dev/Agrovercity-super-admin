import React from 'react'
import {
  CloudSun,
  Warehouse,
  CalendarCheck,
  Sprout,
  Leaf,
  ScanEye,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Search,
  RefreshCw,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Clock,
  Thermometer,
  Droplets,
  DollarSign,
  Lock,
  Layers,
  FileCheck,
  Check,
  X,
  ExternalLink,
  RotateCcw
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
    // Facilities
    active: { label: 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    near_capacity: { label: 'Near Capacity (>90%)', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    maintenance: { label: 'Maintenance Shutdown', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
    suspended: { label: 'Suspended (Audit)', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },

    // Bookings
    confirmed: { label: 'Slot Confirmed', bg: 'bg-teal-50 text-teal-700 border-teal-200/80' },
    completed: { label: 'Discharged / Completed', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    cancelled: { label: 'Cancelled / Refunded', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },
    disputed: { label: 'Disputed / Escrow Held', bg: 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse' },

    // Varieties
    certified: { label: 'ICAR Certified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    pilot: { label: 'Field Pilot Trial', bg: 'bg-purple-50 text-purple-700 border-purple-200/80' },
    under_review: { label: 'Under Review', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    deprecated: { label: 'Deprecated', bg: 'bg-zinc-100 text-zinc-600 border-zinc-200' },

    // Carbon
    approved: { label: 'Verified / Approved', bg: 'bg-teal-50 text-teal-700 border-teal-200/80' },
    pending_verification: { label: 'Satellite Verification', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    disbursed: { label: 'Payout Disbursed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },
    audit_flagged: { label: 'Anomaly Audit Flag', bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },

    // AI Grading
    verified: { label: 'AI Verified (95%+)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    flagged_anomaly: { label: 'Optical Anomaly Flag', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    overridden: { label: 'Manual Calibrated', bg: 'bg-purple-50 text-purple-700 border-purple-200/80' },
    pending_calibration: { label: 'Pending Curve', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-600 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function ResilienceBadge({ type }) {
  const map = {
    drought_tolerant: { label: 'Drought Resilient', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    heat_resilient: { label: 'Heat Hardy', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },
    flood_tolerant: { label: 'Flood Submergence', bg: 'bg-teal-50 text-teal-700 border-teal-200/80' },
    saline_tolerant: { label: 'Saline-Alkali Hardy', bg: 'bg-purple-50 text-purple-700 border-purple-200/80' },
    pest_resistant: { label: 'Biotic Resistant', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' }
  }
  const badge = map[type] || { label: type, bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
      <Sprout className="w-3 h-3 text-emerald-600" />
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80' },
    blue: { text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200/80' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/80' },
    purple: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200/80' },
    rose: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/80' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text} ${c.border} border shadow-2xs`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-600">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ClimateMetricBar({ summary }) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Cold Chain Infrastructure"
        value={`${summary.availableCapacityMt?.toLocaleString() || 0} MT`}
        subtitle={`${summary.totalCapacityMt?.toLocaleString() || 0} MT total (${summary.utilizationRatePct || 0}% util)`}
        icon={Warehouse}
        badge={`${summary.activeFacilitiesCount || 0} hubs`}
        color="emerald"
      />
      <MetricCard
        title="Active Reservations & Escrow"
        value={fmtINR(summary.totalBookingsGrossInr || 0)}
        subtitle={`${summary.activeBookingsCount || 0} active harvest bookings`}
        icon={CalendarCheck}
        badge="Escrow Protected"
        color="blue"
      />
      <MetricCard
        title="Carbon Credits Certified"
        value={`${summary.carbonCreditsCertifiedMt || 0} MT CO₂e`}
        subtitle={`${fmtINR(summary.carbonPayoutTotalInr || 0)} paid (${summary.flaggedCarbonAudits || 0} flags)`}
        icon={Leaf}
        badge="Regenerative"
        color="purple"
      />
      <MetricCard
        title="AI Produce Quality Calibration"
        value={`${summary.aiGradingAccuracyPct || 96.8}%`}
        subtitle={`${summary.aiGradingChecksToday || 0} checks today (Max 3 img/lot)`}
        icon={ScanEye}
        badge="Calibrated"
        color="rose"
      />
    </div>
  )
}

export function ClimateTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'facilities', label: 'Cold Storage Directory', icon: Warehouse, count: counts.facilities },
    { id: 'bookings', label: 'Slot Reservations & Escrow', icon: CalendarCheck, count: counts.bookings },
    { id: 'varieties', label: 'Climate-Resilient Crops', icon: Sprout, count: counts.varieties },
    { id: 'carbon', label: 'Carbon Credits & Payouts', icon: Leaf, count: counts.carbon },
    { id: 'gradings', label: 'AI Quality Grading', icon: ScanEye, count: counts.gradings },
    { id: 'audit', label: 'Compliance & Audit Logs', icon: ShieldCheck, count: counts.audit }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-emerald-100/80 pb-2 overflow-x-auto scrollbar-none mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-50 text-emerald-800'
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

export function ClimateFiltersBar({
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
    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-2xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by facility, crop, ID, phone, agency..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          {activeTab === 'facilities' && (
            <>
              <option value="active">Active</option>
              <option value="near_capacity">Near Capacity</option>
              <option value="maintenance">Maintenance</option>
              <option value="suspended">Suspended</option>
            </>
          )}
          {activeTab === 'bookings' && (
            <>
              <option value="confirmed">Slot Confirmed</option>
              <option value="active">Active Intake</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
            </>
          )}
          {activeTab === 'varieties' && (
            <>
              <option value="certified">ICAR Certified</option>
              <option value="pilot">Field Pilot</option>
              <option value="under_review">Under Review</option>
              <option value="deprecated">Deprecated</option>
            </>
          )}
          {activeTab === 'carbon' && (
            <>
              <option value="approved">Approved</option>
              <option value="pending_verification">Satellite Pending</option>
              <option value="disbursed">Disbursed</option>
              <option value="audit_flagged">Anomaly Flagged</option>
            </>
          )}
          {activeTab === 'gradings' && (
            <>
              <option value="verified">AI Verified</option>
              <option value="flagged_anomaly">Anomaly Flagged</option>
              <option value="overridden">Manual Calibrated</option>
            </>
          )}
        </select>

        {/* Secondary Filter if available */}
        {subFilterOptions.length > 0 && (
          <select
            value={subFilter}
            onChange={(e) => onSubFilterChange(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">{subFilterLabel}: All</option>
            {subFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Date Range Filter */}
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="all">Date: All Time</option>
          <option value="today">Today</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_quarter">This Quarter</option>
        </select>

        {/* Persona Filter */}
        <select
          value={persona}
          onChange={(e) => onPersonaChange(e.target.value)}
          className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="all">Persona: All Stakeholders</option>
          <option value="farmer">Farmers</option>
          <option value="cold_chain_operator">Cold Chain Operators</option>
          <option value="carbon_verifier">Carbon Verifiers</option>
          <option value="icar_scientist">ICAR / Scientists</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Refresh dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {onResetSeed && (
          <button
            onClick={onResetSeed}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-100 shadow-2xs transition"
            title="Reset to SOP-23 Benchmark Seed Dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        )}

        {onAddNew && canMutate && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs active:scale-95"
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
  activeTab = 'facilities',
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
        {canMutate && activeTab === 'facilities' && (
          <>
            <button
              onClick={() => onBatchAction('set_active')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Set Active
            </button>
            <button
              onClick={() => onBatchAction('set_near_capacity')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold shadow-xs transition"
            >
              Set Near Capacity
            </button>
            <button
              onClick={() => onBatchAction('set_maintenance')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold shadow-xs transition"
            >
              Set Maintenance
            </button>
          </>
        )}

        {canMutate && activeTab === 'bookings' && (
          <button
            onClick={() => onBatchAction('cancel_bookings')}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded-xl font-semibold shadow-xs transition"
          >
            Cancel & Release Slots
          </button>
        )}

        {canMutate && activeTab === 'varieties' && (
          <>
            <button
              onClick={() => onBatchAction('certify_varieties')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Mark Certified
            </button>
            <button
              onClick={() => onBatchAction('review_varieties')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold shadow-xs transition"
            >
              Mark Under Review
            </button>
            <button
              onClick={() => onBatchAction('deprecate_varieties')}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold shadow-xs transition"
            >
              Deprecate
            </button>
          </>
        )}

        {canMutate && activeTab === 'carbon' && (
          <button
            onClick={() => onBatchAction('disburse_carbon')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
          >
            Disburse Approved Payouts
          </button>
        )}

        {canMutate && activeTab === 'gradings' && (
          <>
            <button
              onClick={() => onBatchAction('calibrate_grade_a')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-xs transition"
            >
              Calibrate: Grade A
            </button>
            <button
              onClick={() => onBatchAction('calibrate_grade_b')}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 rounded-xl font-semibold shadow-xs transition"
            >
              Calibrate: Grade B
            </button>
            <button
              onClick={() => onBatchAction('flag_gradings')}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-600 rounded-xl font-semibold shadow-xs transition"
            >
              Flag Anomaly
            </button>
          </>
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
// 1. FACILITIES TABLE
// -------------------------------------------------------------
export function ColdStoragesTable({
  data,
  onSelectRow,
  onEditStatus,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No cold storage facilities found matching criteria.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
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
              <th className="px-3.5 py-2.5">Facility & ID</th>
              <th className="px-3.5 py-2.5">District / Region</th>
              <th className="px-3.5 py-2.5">Capacity (MT)</th>
              <th className="px-3.5 py-2.5">Chambers / Temp Range</th>
              <th className="px-3.5 py-2.5">Rate / MT</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const utilPct =
                row.totalCapacityMt > 0
                  ? Math.round(((row.totalCapacityMt - row.availableCapacityMt) / row.totalCapacityMt) * 100)
                  : 0
              const isSelected = selectedIds.includes(row.id)

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'}`}
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
                    <div className="font-bold text-slate-900">{row.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {row.id} · {row.fssaiLicense}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="text-slate-900 font-semibold">{row.district}</div>
                    <div className="text-[11px] text-slate-500">{row.operatorName} · {row.operatorPhone}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <div>
                      <span className="text-emerald-800 font-bold">{row.availableCapacityMt}</span> / {row.totalCapacityMt} MT
                    </div>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-200">
                      <div
                        className={`h-full ${utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: `${utilPct}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {row.tempRangeMin}°C to {row.tempRangeMax}°C
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {row.chambersCount} Chambers · {row.caChamberEnabled ? 'CA Tech' : 'Conventional'}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-emerald-800 font-bold">
                    {fmtINR(row.monthlyRatePerMt)} / mo
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectRow(row)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold transition-colors"
                    >
                      Details
                    </button>
                    {canMutate && (
                      <button
                        onClick={() => onEditStatus(row)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[11px] text-emerald-800 font-bold transition-colors border border-emerald-200"
                      >
                        Status
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 2. BOOKINGS TABLE
// -------------------------------------------------------------
export function ColdStorageBookingsTable({
  data,
  onSelectRow,
  onAllocateChamber,
  onCancelBooking,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No cold storage reservations recorded.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
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
              <th className="px-3.5 py-2.5">Booking ID & Farmer</th>
              <th className="px-3.5 py-2.5">Facility & Chamber</th>
              <th className="px-3.5 py-2.5">Crop & Volume</th>
              <th className="px-3.5 py-2.5">Duration</th>
              <th className="px-3.5 py-2.5">Total Fee & Escrow</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'}`}
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
                    <div className="font-bold text-slate-900">{row.farmerName}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {row.id} · {row.farmerPhone}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="truncate max-w-[200px] text-slate-800 font-semibold">{row.facilityName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.chamberAllocated || 'Unallocated'}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-slate-900">{row.cropType}</div>
                    <div className="text-[11px] font-mono text-emerald-800 font-bold">{row.quantityMt} MT</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[11px] text-slate-700">
                    <div>
                      {row.startDate} → {row.endDate}
                    </div>
                    <div className="text-slate-500">({row.durationMonths} mos)</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <div className="text-emerald-800 font-bold">{fmtINR(row.totalFee)}</div>
                    <div className="text-[10px] text-slate-500">Paid: {fmtINR(row.paidAmount)}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    {canMutate && row.status === 'confirmed' && (
                      <button
                        onClick={() => onAllocateChamber(row)}
                        className="px-2 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold transition-colors"
                      >
                        Allocate
                      </button>
                    )}
                    {canMutate && row.status !== 'cancelled' && row.status !== 'completed' && (
                      <button
                        onClick={() => onCancelBooking(row)}
                        className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => onSelectRow(row)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold transition-colors"
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
    </div>
  )
}

// -------------------------------------------------------------
// 3. CLIMATE VARIETIES TABLE
// -------------------------------------------------------------
export function ClimateVarietiesTable({
  data,
  onSelectRow,
  onEditVariety,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No climate-resilient crop varieties found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
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
              <th className="px-3.5 py-2.5">Crop & Variety Code</th>
              <th className="px-3.5 py-2.5">Resilience Type</th>
              <th className="px-3.5 py-2.5">Certifying Agency</th>
              <th className="px-3.5 py-2.5">Maturity / Water Need</th>
              <th className="px-3.5 py-2.5">Yield Potential</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'}`}
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
                    <div className="font-bold text-slate-900">{row.cropName}</div>
                    <div className="text-[11px] font-mono text-emerald-800 font-bold">
                      {row.varietyCode} · {row.commonName}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <ResilienceBadge type={row.resilienceType} />
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="truncate max-w-[200px] text-slate-800 font-medium">{row.certifyingAgency}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Notified: {row.yearNotified || 2024}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="text-slate-800 font-semibold">{row.maturityDays}</div>
                    <div className="text-[11px] text-teal-700 font-mono font-bold">{row.waterRequirementMm} mm</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-slate-900">
                    {row.averageYieldQtlPerHa} Qtl/Ha
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    {canMutate && (
                      <button
                        onClick={() => onEditVariety(row)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[11px] text-emerald-800 font-bold transition-colors border border-emerald-200"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => onSelectRow(row)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold transition-colors"
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
    </div>
  )
}

// -------------------------------------------------------------
// 4. CARBON AUDITS TABLE
// -------------------------------------------------------------
export function CarbonAuditsTable({
  data,
  onSelectRow,
  onDisbursePayout,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No carbon credit audit records found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
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
              <th className="px-3.5 py-2.5">Farmer & ID</th>
              <th className="px-3.5 py-2.5">District / Farm Area</th>
              <th className="px-3.5 py-2.5">Carbon Credits (MT CO₂e)</th>
              <th className="px-3.5 py-2.5">Net Payout</th>
              <th className="px-3.5 py-2.5">Verifier Registry</th>
              <th className="px-3.5 py-2.5">Status & Dual Sign-Off</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'}`}
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
                    <div className="font-bold text-slate-900">{row.farmerName}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {row.id} · {row.farmerPhone}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="text-slate-800 font-semibold">{row.district}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.farmSizeAcres} Acres</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-purple-700">
                    {row.estimatedCreditsMtCo2e} MT CO₂e
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <div className="text-emerald-800 font-bold">{fmtINR(row.netPayoutInr)}</div>
                    <div className="text-[10px] text-slate-500">Rate: ₹{row.creditPriceInrPerTon}/ton</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="truncate max-w-[180px] text-slate-800 font-medium">{row.verifierAgency}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{row.satelliteVerificationHash}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={row.status} />
                    {row.netPayoutInr > 50000 && (
                      <div className="text-[10px] text-purple-700 font-mono mt-0.5 flex items-center gap-1 font-bold">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Dual Sign-Off &gt; ₹50k</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    {canMutate && row.status === 'approved' && (
                      <button
                        onClick={() => onDisbursePayout(row)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-[11px] font-bold transition-colors"
                      >
                        Disburse
                      </button>
                    )}
                    <button
                      onClick={() => onSelectRow(row)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold transition-colors"
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
    </div>
  )
}

// -------------------------------------------------------------
// 5. PRODUCE GRADINGS TABLE
// -------------------------------------------------------------
export function ProduceGradingsTable({
  data,
  onSelectRow,
  onOverrideGrading,
  selectedIds = [],
  onToggleSelect = () => {},
  onSelectAll = () => {},
  canMutate = true
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No AI quality grading runs found.
      </div>
    )
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.includes(r.id))

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
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
              <th className="px-3.5 py-2.5">Lot & Commodity</th>
              <th className="px-3.5 py-2.5">Farmer & Phone</th>
              <th className="px-3.5 py-2.5">AI Grade & Confidence</th>
              <th className="px-3.5 py-2.5">Defects & Metrics</th>
              <th className="px-3.5 py-2.5">Images Sample</th>
              <th className="px-3.5 py-2.5">Status</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectRow(row)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80' : 'hover:bg-emerald-50/60'}`}
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
                    <div className="font-bold text-slate-900">{row.commodity}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {row.lotId} · {row.id}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="text-slate-900 font-semibold">{row.farmerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{row.farmerPhone}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono">
                    <div className="font-bold text-slate-900">
                      {row.manualOverrideGrade || row.aiPredictedGrade}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-bold">
                      Confidence: {row.confidenceScore}% · {row.calibrationCurveModel}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-[11px]">
                    <div>
                      Defects: <span className="text-amber-700 font-mono font-bold">{row.surfaceDefectsPct}%</span>
                    </div>
                    <div className="text-slate-500">
                      {row.sizeCalibrationMm} · {row.brixEstimate}
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1">
                      {row.images?.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Produce sample"
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                        />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 ml-1">({row.imagesCount}/3)</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    {canMutate && (
                      <button
                        onClick={() => onOverrideGrading(row)}
                        className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[11px] font-bold transition-colors"
                      >
                        Override
                      </button>
                    )}
                    <button
                      onClick={() => onSelectRow(row)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-semibold transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 6. AUDIT LOGS TABLE
// -------------------------------------------------------------
export function ClimateAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No administrative audit logs found for Climate & Cold Storage.
      </div>
    )
  }

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="px-3.5 py-2.5">Timestamp & IP</th>
              <th className="px-3.5 py-2.5">Action & Collection</th>
              <th className="px-3.5 py-2.5">Entity / Target</th>
              <th className="px-3.5 py-2.5">State Transition</th>
              <th className="px-3.5 py-2.5">Administrative Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="px-3.5 py-3 font-mono text-[11px]">
                  <div className="text-slate-900 font-semibold">{formatDate(row.timestamp)}</div>
                  <div className="text-slate-500">
                    {row.ipAddress} · {row.adminName}
                  </div>
                </td>
                <td className="px-3.5 py-3">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {row.actionType}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="font-bold text-slate-900">{row.entityName}</div>
                  <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
                </td>
                <td className="px-3.5 py-3 text-[11px] font-mono">
                  {row.previousState && <div className="text-slate-400">Prev: {row.previousState}</div>}
                  <div className="text-emerald-800 font-bold">New: {row.newState}</div>
                </td>
                <td className="px-3.5 py-3 text-slate-700 max-w-xs">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-600">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 shadow-2xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono text-slate-800 font-bold">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 shadow-2xs font-medium"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
