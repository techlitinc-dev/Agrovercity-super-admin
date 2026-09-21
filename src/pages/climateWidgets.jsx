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
    // Facilities
    active: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    near_capacity: { label: 'Near Capacity (>90%)', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    maintenance: { label: 'Maintenance Shutdown', bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
    suspended: { label: 'Suspended (Audit)', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },

    // Bookings
    confirmed: { label: 'Slot Confirmed', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    completed: { label: 'Discharged / Completed', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
    cancelled: { label: 'Cancelled / Refunded', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    disputed: { label: 'Disputed / Escrow Held', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse' },

    // Varieties
    certified: { label: 'ICAR Certified', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pilot: { label: 'Field Pilot Trial', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    under_review: { label: 'Under Review', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    deprecated: { label: 'Deprecated', bg: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/30' },

    // Carbon
    approved: { label: 'Verified / Approved', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    pending_verification: { label: 'Satellite Verification', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    disbursed: { label: 'Payout Disbursed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    rejected: { label: 'Rejected', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    audit_flagged: { label: 'Anomaly Audit Flag', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse' },

    // AI Grading
    verified: { label: 'AI Verified (95%+)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    flagged_anomaly: { label: 'Optical Anomaly Flag', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40' },
    overridden: { label: 'Manual Calibrated', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    pending_calibration: { label: 'Pending Curve', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-800 text-slate-400 border-slate-700' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function ResilienceBadge({ type }) {
  const map = {
    drought_tolerant: { label: 'Drought Resilient', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    heat_resilient: { label: 'Heat Hardy', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    flood_tolerant: { label: 'Flood Submergence', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    saline_tolerant: { label: 'Saline-Alkali Hardy', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    pest_resistant: { label: 'Biotic Resistant', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  }
  const badge = map[type] || { label: type, bg: 'bg-slate-800 text-slate-400 border-slate-700' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      <Sprout className="w-3 h-3" />
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

export function ClimateMetricBar({ summary, loading }) {
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
        title="Cold Chain Capacity"
        value={`${(summary.totalCapacityMt || 0).toLocaleString()} MT`}
        subtitle={`${summary.utilizationRatePct || 0}% Utilized (${(summary.availableCapacityMt || 0).toLocaleString()} MT Free)`}
        icon={Warehouse}
        badge={`${summary.activeFacilitiesCount || 0} Hubs Active`}
        color="blue"
      />
      <MetricCard
        title="Active Slot Bookings"
        value={`${summary.activeBookingsCount || 0} Batches`}
        subtitle={`Gross Escrow: ${fmtINR(summary.totalBookingsGrossInr)}`}
        icon={CalendarCheck}
        badge="Zero Overbooking"
        color="emerald"
      />
      <MetricCard
        title="Carbon Credits Desk"
        value={`${summary.carbonCreditsCertifiedMt || 0} MT CO₂e`}
        subtitle={`Total Disbursed: ${fmtINR(summary.carbonPayoutTotalInr)}`}
        icon={Leaf}
        badge={summary.flaggedCarbonAudits > 0 ? `${summary.flaggedCarbonAudits} Flagged` : 'Audited'}
        color={summary.flaggedCarbonAudits > 0 ? 'amber' : 'purple'}
      />
      <MetricCard
        title="AI Produce Grading"
        value={`${summary.aiGradingAccuracyPct || 0}% Accuracy`}
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

export function ClimateFiltersBar({
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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by facility, crop, ID, phone, agency..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
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
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
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
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        )}
      </div>
    </div>
  )
}

// 1. Facilities Table
export function ColdStoragesTable({ data, onSelectRow, onEditStatus }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No cold storage facilities found matching criteria.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Facility & ID</th>
            <th className="px-3.5 py-2.5">District / Region</th>
            <th className="px-3.5 py-2.5">Capacity (MT)</th>
            <th className="px-3.5 py-2.5">Chambers / Temp Range</th>
            <th className="px-3.5 py-2.5">Rate / MT</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => {
            const utilPct =
              row.totalCapacityMt > 0
                ? Math.round(((row.totalCapacityMt - row.availableCapacityMt) / row.totalCapacityMt) * 100)
                : 0

            return (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="px-3.5 py-3">
                  <div className="font-semibold text-white">{row.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {row.id} · {row.fssaiLicense}
                  </div>
                </td>
                <td className="px-3.5 py-3">
                  <div>{row.district}</div>
                  <div className="text-[11px] text-slate-400">{row.operatorName}</div>
                </td>
                <td className="px-3.5 py-3 font-mono">
                  <div>
                    <span className="text-white font-bold">{row.availableCapacityMt}</span> / {row.totalCapacityMt} MT
                  </div>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {row.tempRangeMin}°C to {row.tempRangeMax}°C
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {row.chambersCount} Chambers · {row.caChamberEnabled ? 'CA Tech' : 'Conventional'}
                  </div>
                </td>
                <td className="px-3.5 py-3 font-mono text-emerald-400 font-medium">
                  {fmtINR(row.monthlyRatePerMt)} / mo
                </td>
                <td className="px-3.5 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectRow(row)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onEditStatus(row)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                  >
                    Status
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

// 2. Bookings Table
export function ColdStorageBookingsTable({ data, onSelectRow, onAllocateChamber, onCancelBooking }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No cold storage reservations recorded.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Booking ID & Farmer</th>
            <th className="px-3.5 py-2.5">Facility & Chamber</th>
            <th className="px-3.5 py-2.5">Crop & Volume</th>
            <th className="px-3.5 py-2.5">Duration</th>
            <th className="px-3.5 py-2.5">Total Fee & Escrow</th>
            <th className="px-3.5 py-2.5">Status</th>
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
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.farmerName}</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {row.id} · {row.farmerPhone}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div className="truncate max-w-[200px]">{row.facilityName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.chamberAllocated}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="font-medium text-white">{row.cropType}</div>
                <div className="text-[11px] font-mono text-emerald-400">{row.quantityMt} MT</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div>
                  {row.startDate} → {row.endDate}
                </div>
                <div className="text-slate-400">({row.durationMonths} mos)</div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-emerald-400 font-bold">{fmtINR(row.totalFee)}</div>
                <div className="text-[10px] text-slate-400">Paid: {fmtINR(row.paidAmount)}</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {row.status === 'confirmed' && (
                  <button
                    onClick={() => onAllocateChamber(row)}
                    className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[11px] transition-colors"
                  >
                    Allocate
                  </button>
                )}
                {row.status !== 'cancelled' && row.status !== 'completed' && (
                  <button
                    onClick={() => onCancelBooking(row)}
                    className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] transition-colors"
                  >
                    Cancel / Refund
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

// 3. Climate Varieties Table
export function ClimateVarietiesTable({ data, onSelectRow, onEditVariety }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No climate-resilient crop varieties found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Crop & Variety Code</th>
            <th className="px-3.5 py-2.5">Resilience Type</th>
            <th className="px-3.5 py-2.5">Certifying Agency</th>
            <th className="px-3.5 py-2.5">Maturity / Water Need</th>
            <th className="px-3.5 py-2.5">Yield Potential</th>
            <th className="px-3.5 py-2.5">Status</th>
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
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.cropName}</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {row.varietyCode} · {row.commonName}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <ResilienceBadge type={row.resilienceType} />
              </td>
              <td className="px-3.5 py-3">
                <div className="truncate max-w-[200px]">{row.certifyingAgency}</div>
                <div className="text-[11px] text-slate-400 font-mono">Notified: {row.yearNotified || 2024}</div>
              </td>
              <td className="px-3.5 py-3">
                <div>{row.maturityDays}</div>
                <div className="text-[11px] text-blue-400 font-mono">{row.waterRequirementMm} mm</div>
              </td>
              <td className="px-3.5 py-3 font-mono font-medium text-slate-200">
                {row.averageYieldQtlPerHa} Qtl/Ha
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEditVariety(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
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

// 4. Carbon Audits Table
export function CarbonAuditsTable({ data, onSelectRow, onDisbursePayout }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No carbon credit audit records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Farmer & ID</th>
            <th className="px-3.5 py-2.5">District / Farm Area</th>
            <th className="px-3.5 py-2.5">Carbon Credits (MT CO₂e)</th>
            <th className="px-3.5 py-2.5">Net Payout</th>
            <th className="px-3.5 py-2.5">Verifier Registry</th>
            <th className="px-3.5 py-2.5">Status & Dual Sign-Off</th>
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
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.farmerName}</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {row.id} · {row.farmerPhone}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div>{row.district}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.farmSizeAcres} Acres</div>
              </td>
              <td className="px-3.5 py-3 font-mono font-bold text-purple-400">
                {row.estimatedCreditsMtCo2e} MT CO₂e
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="text-emerald-400 font-bold">{fmtINR(row.netPayoutInr)}</div>
                <div className="text-[10px] text-slate-400">Rate: ₹{row.creditPriceInrPerTon}/ton</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="truncate max-w-[180px]">{row.verifierAgency}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{row.satelliteVerificationHash}</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
                {row.netPayoutInr > 50000 && (
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Dual Sign-Off &gt; ₹50k</span>
                  </div>
                )}
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {row.status === 'approved' && (
                  <button
                    onClick={() => onDisbursePayout(row)}
                    className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors"
                  >
                    Disburse
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
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

// 5. Produce Gradings Table
export function ProduceGradingsTable({ data, onSelectRow, onOverrideGrading }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No AI quality grading runs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Lot & Commodity</th>
            <th className="px-3.5 py-2.5">Farmer & Phone</th>
            <th className="px-3.5 py-2.5">AI Grade & Confidence</th>
            <th className="px-3.5 py-2.5">Defects & Metrics</th>
            <th className="px-3.5 py-2.5">Images Sample</th>
            <th className="px-3.5 py-2.5">Status</th>
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
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.commodity}</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {row.lotId} · {row.id}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <div>{row.farmerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.farmerPhone}</div>
              </td>
              <td className="px-3.5 py-3 font-mono">
                <div className="font-bold text-white">
                  {row.manualOverrideGrade || row.aiPredictedGrade}
                </div>
                <div className="text-[11px] text-emerald-400">
                  Confidence: {row.confidenceScore}% · {row.calibrationCurveModel}
                </div>
              </td>
              <td className="px-3.5 py-3 text-[11px]">
                <div>Defects: <span className="text-amber-400 font-mono">{row.surfaceDefectsPct}%</span></div>
                <div className="text-slate-400">{row.sizeCalibrationMm} · {row.brixEstimate}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="flex items-center gap-1">
                  {row.images?.slice(0, 3).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Produce sample"
                      className="w-7 h-7 rounded object-cover border border-slate-700"
                    />
                  ))}
                  <span className="text-[10px] font-mono text-slate-500 ml-1">({row.imagesCount}/3)</span>
                </div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onOverrideGrading(row)}
                  className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[11px] transition-colors"
                >
                  Override
                </button>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                >
                  Inspect
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
export function ClimateAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No administrative audit logs found for Climate & Cold Storage.
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
            <th className="px-3.5 py-2.5">Entity / Target</th>
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
