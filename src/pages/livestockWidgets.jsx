import React from 'react'
import {
  Stethoscope,
  HeartPulse,
  Trees,
  Milk,
  Calendar,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  RefreshCw,
  Download,
  Phone,
  MapPin,
  Award,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  FileText,
  BadgeAlert
} from 'lucide-react'

export function fmtINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}

export function StatusBadge({ status, type = 'default' }) {
  const map = {
    // Vets
    verified_active: { label: 'Verified & Active', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_verification: { label: 'Pending Verification', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    suspended: { label: 'Suspended', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    rejected: { label: 'Rejected', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // Gaushalas
    certified_active: { label: 'Certified Compliant', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_audit: { label: 'Pending Audit', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    flagged: { label: 'Flagged Anomaly', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },

    // Nurseries
    approved: { label: 'Govt Empaneled', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_inspection: { label: 'Pending Inspection', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },

    // Dairy
    active: { label: 'Lab Cleared Active', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_lab_clearance: { label: 'Awaiting Lab NABL', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    recalled: { label: 'Product Recalled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    out_of_stock: { label: 'Out of Stock', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // Bookings
    emergency_dispatched: { label: 'Emergency Dispatched', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40 animate-pulse' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    confirmed: { label: 'Confirmed', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    dispute_mediation: { label: 'Dispute / Mediated', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    cancelled_farmer: { label: 'Cancelled', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // Manure Orders
    in_transit: { label: 'In Transit', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    loading_at_gaushala: { label: 'Loading at Yard', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    delivered: { label: 'Delivered (OTP Verified)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_dual_signoff: { label: 'Pending Dual Sign-off', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/40' },
    order_placed: { label: 'Order Placed', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },

    // Fallbacks
    paid_escrow: { label: 'Escrow Secured', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    released_to_vet: { label: 'Settled to Vet', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    refunded: { label: 'Refunded', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  }

  const badge = map[status] || {
    label: (status || 'unknown').replace(/_/g, ' '),
    bg: 'bg-slate-700/30 text-slate-300 border-slate-600'
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}
    >
      {badge.label}
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, color = 'emerald', alert = false }) {
  const colors = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
  }

  return (
    <div
      className={`p-3.5 rounded-xl border bg-slate-900/70 backdrop-blur-sm flex items-start justify-between relative overflow-hidden transition-all ${
        alert ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-slate-800'
      }`}
    >
      <div>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-white mt-1 tracking-tight">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2 rounded-lg border ${colors[color] || colors.emerald}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}

export function TabSwitch({ activeTab, onTabChange, counts = {} }) {
  const tabs = [
    { id: 'vets', label: 'Veterinary Doctors', icon: Stethoscope, count: counts.vets },
    { id: 'gaushalas', label: 'Gaushala Directory', icon: HeartPulse, count: counts.gaushalas },
    { id: 'nurseries', label: 'Plant Nurseries', icon: Trees, count: counts.nurseries },
    { id: 'dairy', label: 'Direct A2 Dairy', icon: Milk, count: counts.dairy },
    { id: 'bookings', label: 'Emergency & Bookings', icon: Calendar, count: counts.bookings, alert: counts.emergencyCount > 0 },
    { id: 'manure', label: 'Bulk Manure Orders', icon: Truck, count: counts.manure, alert: counts.pendingDualSignOffs > 0 },
    { id: 'audit', label: 'Audit Trail', icon: FileText, count: counts.audit }
  ]

  return (
    <div className="flex border-b border-slate-800 space-x-1 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              isActive
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  tab.alert
                    ? 'bg-rose-500/20 text-rose-300 font-bold animate-pulse'
                    : isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
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

export function FiltersBar({
  activeTab,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  extraFilter,
  onExtraFilterChange,
  onRefresh,
  onExport,
  loading
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, name, mobile, district..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          {activeTab === 'vets' && (
            <>
              <option value="verified_active">Verified & Active</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="suspended">Suspended</option>
            </>
          )}
          {activeTab === 'gaushalas' && (
            <>
              <option value="certified_active">Certified Compliant</option>
              <option value="pending_audit">Pending Audit</option>
              <option value="flagged">Flagged Anomaly</option>
            </>
          )}
          {activeTab === 'nurseries' && (
            <>
              <option value="approved">Govt Empaneled</option>
              <option value="pending_inspection">Pending Inspection</option>
              <option value="suspended">Suspended</option>
            </>
          )}
          {activeTab === 'dairy' && (
            <>
              <option value="active">Active (Lab Cleared)</option>
              <option value="pending_lab_clearance">Pending Lab</option>
              <option value="recalled">Recalled</option>
            </>
          )}
          {activeTab === 'bookings' && (
            <>
              <option value="emergency_dispatched">Emergency Dispatched</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dispute_mediation">Dispute / Mediated</option>
            </>
          )}
          {activeTab === 'manure' && (
            <>
              <option value="in_transit">In Transit</option>
              <option value="loading_at_gaushala">Loading at Yard</option>
              <option value="delivered">Delivered</option>
              <option value="pending_dual_signoff">Pending Dual Sign-off</option>
            </>
          )}
        </select>

        {/* District or Category Filter */}
        {(activeTab === 'vets' || activeTab === 'gaushalas' || activeTab === 'nurseries' || activeTab === 'bookings') && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Nashik">Nashik</option>
            <option value="Ahmednagar">Ahmednagar</option>
            <option value="Kolhapur">Kolhapur</option>
            <option value="Solapur">Solapur</option>
            <option value="Aurangabad">Aurangabad</option>
            <option value="Satara">Satara</option>
            <option value="Ratnagiri">Ratnagiri</option>
            <option value="Junagadh">Junagadh (Gujarat)</option>
          </select>
        )}

        {activeTab === 'dairy' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Dairy Categories</option>
            <option value="Desi Ghee">Desi Ghee</option>
            <option value="Fresh Milk">Fresh Milk</option>
            <option value="Paneer">Paneer</option>
            <option value="Cultured Dairy">Cultured Dairy / Chaas</option>
            <option value="Butter">Butter</option>
            <option value="Specialty Dairy">Specialty Dairy</option>
          </select>
        )}

        {activeTab === 'manure' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Orders</option>
            <option value="required">Dual Sign-off Required (&gt; ₹50,000)</option>
            <option value="pending">Dual Sign-off Pending</option>
            <option value="completed">Dual Sign-off Completed</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export function VetsTable({ rows, onView, onVerify, onSuspend }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No veterinary doctors match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Doctor & Degree</th>
            <th className="py-3 px-3">State Council Reg</th>
            <th className="py-3 px-3">Clinic & District</th>
            <th className="py-3 px-3">Emergency 24x7 / Fees</th>
            <th className="py-3 px-3">Cases / Rating</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3 font-sans">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{row.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{row.degree}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{row.mobile}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-semibold text-slate-200">{row.councilRegNo}</div>
                <div className="text-[11px] text-slate-400">Exp: {row.regExpiryDate}</div>
                <div className="text-[10px] text-slate-500">{row.councilState}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-slate-200">{row.clinicName}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {row.taluka}, {row.district}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1">
                  {row.emergencyCallout24x7 ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      24x7 On-Call
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                      Day OPD Only
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  OPD: {fmtINR(row.consultationFee)} | Night: {fmtINR(row.emergencyNightFee)}
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">★ {row.averageRating}</div>
                <div className="text-[11px] text-slate-400">{row.totalCasesAttended} cases</div>
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3 px-3 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    View
                  </button>
                  {row.status === 'pending_verification' && (
                    <button
                      onClick={() => onVerify(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  {row.status === 'verified_active' && (
                    <button
                      onClick={() => onSuspend(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GaushalasTable({ rows, onView, onAudit }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No Gaushalas match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Gaushala & Trust</th>
            <th className="py-3 px-3">Registration & 80G</th>
            <th className="py-3 px-3">Cattle Census & Breeds</th>
            <th className="py-3 px-3">Manure MT / Biogas</th>
            <th className="py-3 px-3">Welfare Audit</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => {
            const breeds = Object.entries(row.indigenousBreeds || {})
              .map(([b, c]) => `${b.toUpperCase()}: ${c}`)
              .join(', ')

            return (
              <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-sans">
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{row.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {row.district}, {row.state} • Ph: {row.contactPhone}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Founder: {row.founderName}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-200">{row.charityCommissionNo}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {row.taxExempt80G ? (
                      <span className="text-emerald-400 font-sans font-medium">80G Certified ({row.tax80GCertNo})</span>
                    ) : (
                      <span className="text-amber-400 font-sans font-medium">80G Not Active</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Org Cert: {row.organicCertNo}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-100">{row.totalCattleHead} Heads</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 max-w-[200px] truncate" title={breeds}>
                    {breeds}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-emerald-400">{row.monthlyManureCapacityMT} MT/Month</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Biogas: {row.biogasCapacityKwhPerDay} kWh/day</div>
                </td>
                <td className="py-3 px-3 font-sans">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`text-sm font-bold ${
                        row.welfareAuditScore >= 90
                          ? 'text-emerald-400'
                          : row.welfareAuditScore >= 75
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {row.welfareAuditScore} / 100
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500">Insp: {row.vetInspectionDate}</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3 px-3 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onAudit(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                    >
                      Audit
                    </button>
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

export function NurseriesTable({ rows, onView, onApprove }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No certified nurseries match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Nursery & Proprietor</th>
            <th className="py-3 px-3">NHB Reg & Accreditation</th>
            <th className="py-3 px-3">Stock & Capacity</th>
            <th className="py-3 px-3">Specialization Varieties</th>
            <th className="py-3 px-3">Govt Subsidy</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3 font-sans">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{row.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Prop: {row.ownerName} • {row.phone}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {row.district}, {row.state} ({row.nurseryAreaAcres} Acres, {row.polyhousesCount} Polyhouses)
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="font-semibold text-slate-200">{row.nhbRegistrationNo}</div>
                <div className="text-[11px] text-emerald-400 font-sans mt-0.5">{row.nhbRating}</div>
                <div className="text-[10px] text-slate-400">Grade: {row.inspectionGrade} ({row.inspectionScore}/100)</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">{(row.totalStockAvailable || 0).toLocaleString()} plants</div>
                <div className="text-[11px] text-slate-400">Annual: {(row.annualSaplingCapacity || 0).toLocaleString()}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="text-[11px] text-slate-300 line-clamp-2 max-w-[240px]">
                  {(row.specialization || []).join(', ')}
                </div>
              </td>
              <td className="py-3 px-3 font-sans">
                {row.subsidyEligible ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Subsidy Eligible (MIDH)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                    Non-Subsidized
                  </span>
                )}
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3 px-3 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    View
                  </button>
                  {row.status === 'pending_inspection' && (
                    <button
                      onClick={() => onApprove(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DairyProductsTable({ rows, onView, onRecall, onClearLab }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No dairy products match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Product & Gaushala</th>
            <th className="py-3 px-3">Batch & FSSAI</th>
            <th className="py-3 px-3">NABL Purity & Lab</th>
            <th className="py-3 px-3">Fat % / SNF / Temp</th>
            <th className="py-3 px-3">Price & Stock</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3 font-sans">
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  <Milk className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{row.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{row.brandOrGaushala}</div>
                <div className="text-[10px] text-slate-500">Pack: {row.packSize}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-semibold text-slate-200">{row.batchNo}</div>
                <div className="text-[11px] text-slate-400">FSSAI: {row.fssaiLicenseNo}</div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-bold ${
                      row.a2BetaCaseinPurity >= 98
                        ? 'text-emerald-400'
                        : row.a2BetaCaseinPurity > 0
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    A2: {row.a2BetaCaseinPurity ? `${row.a2BetaCaseinPurity}%` : 'Pending'}
                  </span>
                  {row.antibioticResidueFree ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">AB-Free</span>
                  ) : (
                    <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1 rounded">Residue Flagged</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{row.labReportId}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="text-[11px] text-slate-200">Fat: {row.fatPercentage}% | SNF: {row.snfPercentage}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{row.storageTemp}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">{fmtINR(row.priceINR)}</div>
                <div className="text-[11px] text-slate-400">Stock: {row.stockAvailable} units</div>
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3 px-3 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    View
                  </button>
                  {row.status === 'pending_lab_clearance' && (
                    <button
                      onClick={() => onClearLab(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                    >
                      Clear Lab
                    </button>
                  )}
                  {row.status === 'active' && (
                    <button
                      onClick={() => onRecall(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                    >
                      Recall
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function VetBookingsTable({ rows, onView, onMediate }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No appointments match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Booking ID & Date</th>
            <th className="py-3 px-3">Farmer & Location</th>
            <th className="py-3 px-3">Animal & Clinical Issue</th>
            <th className="py-3 px-3">Assigned Vet & ETA</th>
            <th className="py-3 px-3">Amount & Escrow</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3">
                <div className="font-semibold text-slate-100 flex items-center gap-1">
                  <span>{row.bookingNumber}</span>
                  {row.urgencyLevel === 'critical_emergency' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Critical Emergency" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{new Date(row.bookedAt).toLocaleString('en-IN')}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-slate-200">{row.farmerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {row.farmerPhone} • {row.maskedAadhaar}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {row.village}, {row.taluka}, {row.district}
                </div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-semibold text-slate-200">{row.animalType}</div>
                <div className="text-[11px] text-slate-300 line-clamp-2 max-w-[260px] mt-0.5">
                  {row.symptomsDescription}
                </div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-emerald-400">{row.assignedVetName}</div>
                <div className="text-[11px] text-slate-400 font-mono">{row.vetPhone}</div>
                {row.dispatchEtaMinutes > 0 && (
                  <div className="text-[11px] text-purple-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    ETA: {row.dispatchEtaMinutes} mins
                  </div>
                )}
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">{fmtINR(row.totalAmount)}</div>
                <div className="text-[11px] text-slate-400">
                  <StatusBadge status={row.paymentStatus} />
                </div>
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={row.bookingStatus} />
              </td>
              <td className="py-3 px-3 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    View
                  </button>
                  {(row.bookingStatus === 'dispute_mediation' || row.bookingStatus === 'emergency_dispatched') && (
                    <button
                      onClick={() => onMediate(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-colors"
                    >
                      Mediate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ManureOrdersTable({ rows, onView, onSignOff }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No manure orders match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Order Number & Date</th>
            <th className="py-3 px-3">Buyer & Destination</th>
            <th className="py-3 px-3">Gaushala Source & Product</th>
            <th className="py-3 px-3">Quantity & Vehicle</th>
            <th className="py-3 px-3">Total & Dual Sign-off</th>
            <th className="py-3 px-3">Delivery Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3">
                <div className="font-semibold text-slate-100">{row.orderNumber}</div>
                <div className="text-[11px] text-slate-400">{new Date(row.orderDate).toLocaleString('en-IN')}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-slate-200">{row.buyerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {row.buyerPhone} • {row.maskedAadhaar}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {row.deliveryDestination}
                </div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-emerald-400">{row.gaushalaName}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">{row.productName}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">{row.quantityMT} MT</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-sans">{row.vehicleNumber}</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-slate-100">{fmtINR(row.totalAmountINR)}</div>
                <div className="mt-1">
                  {row.dualSignOffRequired ? (
                    row.dualSignOffCompleted ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Dual Signed (CRO &amp; Fin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
                        Sign-off Pending
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                      Standard Limit (&lt;₹50k)
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <StatusBadge status={row.deliveryStatus} />
              </td>
              <td className="py-3 px-3 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    View
                  </button>
                  {row.dualSignOffRequired && !row.dualSignOffCompleted && (
                    <button
                      onClick={() => onSignOff(row)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
                    >
                      Sign Off
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AuditLogTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No audit records available." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-3">Timestamp</th>
            <th className="py-3 px-3">Action Type</th>
            <th className="py-3 px-3">Target Entity</th>
            <th className="py-3 px-3">Admin Operator &amp; IP</th>
            <th className="py-3 px-3">State Transition</th>
            <th className="py-3 px-3">Reason / Justification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3 text-slate-400">
                {new Date(row.timestamp).toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-3">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {row.actionType}
                </span>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-semibold text-slate-200">{row.entityName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{row.entityId}</div>
              </td>
              <td className="py-3 px-3 font-sans">
                <div className="font-medium text-slate-200">{row.adminName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{row.ipAddress}</div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-400">{row.previousState || 'none'}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-emerald-400 font-bold">{row.newState}</span>
                </div>
              </td>
              <td className="py-3 px-3 font-sans text-slate-300 max-w-[280px]">
                {row.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return (
    <div className="flex items-center justify-between px-3 py-3 border-t border-slate-800 text-xs text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-200">{total > 0 ? start : 0}</span> to{' '}
        <span className="font-semibold text-slate-200">{end}</span> of{' '}
        <span className="font-semibold text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 text-slate-300 font-medium">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function EmptyPlaceholder({ message }) {
  return (
    <div className="p-12 text-center">
      <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  )
}
