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
  BadgeAlert,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  CheckSquare,
  Square
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
    verified_active: { label: 'Verified & Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_verification: { label: 'Pending Verification', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    suspended: { label: 'Suspended', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    rejected: { label: 'Rejected', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

    // Gaushalas
    certified_active: { label: 'Certified Compliant', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_audit: { label: 'Pending Audit', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    flagged: { label: 'Flagged Anomaly', bg: 'bg-rose-50 text-rose-700 border-rose-200' },

    // Nurseries
    approved: { label: 'Govt Empaneled', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_inspection: { label: 'Pending Inspection', bg: 'bg-amber-50 text-amber-700 border-amber-200' },

    // Dairy
    active: { label: 'Lab Cleared Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_lab_clearance: { label: 'Awaiting Lab NABL', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    recalled: { label: 'Product Recalled', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    out_of_stock: { label: 'Out of Stock', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

    // Bookings
    emergency_dispatched: { label: 'Emergency Dispatched', bg: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' },
    in_progress: { label: 'In Progress', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    confirmed: { label: 'Confirmed', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    completed: { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    dispute_mediation: { label: 'Dispute / Mediated', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    cancelled_farmer: { label: 'Cancelled', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

    // Manure Orders
    in_transit: { label: 'In Transit', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    loading_at_gaushala: { label: 'Loading at Yard', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    delivered: { label: 'Delivered (OTP Verified)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_dual_signoff: { label: 'Pending Dual Sign-off', bg: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' },
    order_placed: { label: 'Order Placed', bg: 'bg-slate-100 text-slate-600 border-slate-200' },

    // Fallbacks
    paid_escrow: { label: 'Escrow Secured', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    released_to_vet: { label: 'Settled to Vet', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    refunded: { label: 'Refunded', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
  }

  const badge = map[status] || {
    label: (status || 'unknown').replace(/_/g, ' '),
    bg: 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
    >
      {badge.label}
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, color = 'emerald', alert = false }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200'
  }

  return (
    <div
      className={`p-4 rounded-2xl border bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl flex items-start justify-between relative overflow-hidden transition-all hover:border-emerald-300 ${
        alert ? 'border-amber-300 ring-2 ring-amber-400/40' : 'border-emerald-100/90'
      }`}
    >
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight font-mono">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2.5 rounded-xl border ${colors[color] || colors.emerald}`}>
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
    { id: 'orders_audit', label: 'Orders Audit (SOP-19 §5)', icon: ShieldCheck, count: counts.ordersAudit || 16 },
    { id: 'audit', label: 'Audit Trail', icon: FileText, count: counts.audit }
  ]

  return (
    <div className="flex border-b border-emerald-100/80 px-6 bg-white/50 backdrop-blur-xs space-x-1 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all -mb-px ${
              isActive
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/80 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-emerald-50/30'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  tab.alert
                    ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300'
                    : isActive
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
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
  dateRangeFilter,
  onDateRangeChange,
  personaFilter,
  onPersonaChange,
  onRefresh,
  onExport,
  onAddNew,
  onResetSeed,
  loading,
  canEdit = true
}) {
  const getAddButtonText = () => {
    switch (activeTab) {
      case 'vets':
        return '+ Onboard Vet'
      case 'gaushalas':
        return '+ Register Gaushala'
      case 'nurseries':
        return '+ Empanel Nursery'
      case 'dairy':
        return '+ Add Dairy SKU'
      case 'bookings':
        return '+ Emergency Intake'
      case 'manure':
        return '+ Place Manure Order'
      default:
        return null
    }
  }

  const addText = getAddButtonText()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50/40 border-b border-emerald-100/90 text-xs">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[320px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, name, mobile, district..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors shadow-xs"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
        >
          <option value="all">All Statuses</option>
          {activeTab === 'vets' && (
            <>
              <option value="verified_active">Verified &amp; Active</option>
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
          {activeTab === 'orders_audit' && (
            <>
              <option value="NABL CLEARED">NABL Cleared (Dairy)</option>
              <option value="RECALLED BATCH">Recalled (Dairy)</option>
              <option value="IN TRANSIT">In Transit (Manure)</option>
              <option value="DELIVERED">Delivered (Manure)</option>
              <option value="PENDING DUAL SIGNOFF">Pending Dual Signoff</option>
            </>
          )}
        </select>

        {/* Date Range Filter (SOP-19 §4.2 Wireframe) */}
        <select
          value={dateRangeFilter}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
        >
          <option value="all">Date: All Time</option>
          <option value="today">Date: Today</option>
          <option value="last_7_days">Date: Last 7 Days</option>
          <option value="last_30_days">Date: Last 30 Days</option>
          <option value="this_quarter">Date: This Quarter</option>
        </select>

        {/* District or Category Filter */}
        {(activeTab === 'vets' || activeTab === 'gaushalas' || activeTab === 'nurseries' || activeTab === 'bookings') && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
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
          </select>
        )}

        {activeTab === 'dairy' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          >
            <option value="all">All Dairy Categories</option>
            <option value="Desi Ghee">Desi Ghee</option>
            <option value="Fresh Milk">Fresh Milk</option>
            <option value="Paneer">Paneer</option>
            <option value="Cultured Dairy">Cultured Dairy / Chaas</option>
            <option value="Butter">Butter</option>
          </select>
        )}

        {activeTab === 'manure' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          >
            <option value="all">All Orders</option>
            <option value="required">Dual Sign-off Required (&gt; ₹50,000)</option>
            <option value="pending">Dual Sign-off Pending</option>
            <option value="completed">Dual Sign-off Completed</option>
          </select>
        )}

        {activeTab === 'orders_audit' && (
          <select
            value={extraFilter}
            onChange={(e) => onExtraFilterChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          >
            <option value="all">All Order Types</option>
            <option value="dairy">Direct A2 Dairy Only</option>
            <option value="manure">Bulk Manure Only</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        {addText && canEdit && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addText}</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition disabled:opacity-50"
          title="Refresh dataset from Firestore / Local Storage"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition"
          title="Export active table rows to CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {canEdit && (
          <button
            onClick={onResetSeed}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 shadow-xs transition"
            title="Reset Module 19 to Default SOP-19 Seed Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// Batch Actions Bar for Multi-row selection
export function BatchActionBar({ selectedCount, onBatchAction, onClearSelection, targetType }) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-emerald-800 text-white text-xs border-b border-emerald-900 animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-emerald-300" />
        <span className="font-semibold">{selectedCount} items selected</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onBatchAction}
          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-xs"
        >
          Batch Status Update
        </button>
        <button
          onClick={onClearSelection}
          className="px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 transition"
        >
          Clear Selection
        </button>
      </div>
    </div>
  )
}

export function VetsTable({ rows, onView, onVerify, onSuspend, selectedIds = [], onToggleSelect, onSelectAll, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No veterinary doctors match the current filters." />
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-3 w-8 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4">Doctor &amp; Degree</th>
            <th className="py-3 px-4">State Council Reg</th>
            <th className="py-3 px-4">Clinic &amp; District</th>
            <th className="py-3 px-4">Emergency 24x7 / Fees</th>
            <th className="py-3 px-4">Cases / Rating</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr key={row.id} className={`hover:bg-emerald-50/60 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{row.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{row.degree}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{row.mobile}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.councilRegNo}</div>
                  <div className="text-[11px] text-slate-500">Exp: {row.regExpiryDate}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{row.councilState}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-medium text-slate-900">{row.clinicName}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {row.taluka}, {row.district}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    {row.emergencyCallout24x7 ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        24x7 On-Call
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                        Day OPD Only
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-700 mt-1">
                    OPD: {fmtINR(row.consultationFee)} | Night: {fmtINR(row.emergencyNightFee)}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-amber-600">★ {row.averageRating}</div>
                  <div className="text-[11px] text-slate-500">{row.totalCasesAttended} cases</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                    >
                      View
                    </button>
                    {canEdit && row.status === 'pending_verification' && (
                      <button
                        onClick={() => onVerify(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition active:scale-95"
                      >
                        Verify
                      </button>
                    )}
                    {canEdit && row.status === 'verified_active' && (
                      <button
                        onClick={() => onSuspend(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Suspend
                      </button>
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

export function GaushalasTable({ rows, onView, onAudit, selectedIds = [], onToggleSelect, onSelectAll, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No Gaushalas match the current filters." />
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-3 w-8 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4">Gaushala &amp; Trust</th>
            <th className="py-3 px-4">Registration &amp; 80G</th>
            <th className="py-3 px-4">Cattle Census &amp; Breeds</th>
            <th className="py-3 px-4">Manure MT / Biogas</th>
            <th className="py-3 px-4">Welfare Audit</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            const breeds = Object.entries(row.indigenousBreeds || {})
              .map(([b, c]) => `${b.toUpperCase()}: ${c}`)
              .join(', ')

            return (
              <tr key={row.id} className={`hover:bg-emerald-50/60 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{row.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {row.district}, {row.state} • Ph: {row.contactPhone}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Founder: {row.founderName}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.charityCommissionNo}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {row.taxExempt80G ? (
                      <span className="text-emerald-700 font-sans font-semibold">80G Certified ({row.tax80GCertNo})</span>
                    ) : (
                      <span className="text-amber-700 font-sans font-semibold">80G Not Active</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">Org Cert: {row.organicCertNo}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.totalCattleHead} Heads</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] truncate" title={breeds}>
                    {breeds}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-emerald-700">{row.monthlyManureCapacityMT} MT/Month</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Biogas: {row.biogasCapacityKwhPerDay} kWh/day</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`text-sm font-bold font-mono ${
                        row.welfareAuditScore >= 90
                          ? 'text-emerald-700'
                          : row.welfareAuditScore >= 75
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {row.welfareAuditScore} / 100
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">Insp: {row.vetInspectionDate}</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                    >
                      View
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onAudit(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition active:scale-95"
                      >
                        Audit
                      </button>
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

export function NurseriesTable({ rows, onView, onApprove, selectedIds = [], onToggleSelect, onSelectAll, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No certified nurseries match the current filters." />
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-3 w-8 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4">Nursery &amp; Proprietor</th>
            <th className="py-3 px-4">NHB Reg &amp; Accreditation</th>
            <th className="py-3 px-4">Stock &amp; Capacity</th>
            <th className="py-3 px-4">Specialization Varieties</th>
            <th className="py-3 px-4">Govt Subsidy</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr key={row.id} className={`hover:bg-emerald-50/60 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{row.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Prop: {row.ownerName} • {row.phone}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {row.district}, {row.state} ({row.nurseryAreaAcres} Acres, {row.polyhousesCount} Polyhouses)
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.nhbRegistrationNo}</div>
                  <div className="text-[11px] text-emerald-700 font-sans font-semibold mt-0.5">{row.nhbRating}</div>
                  <div className="text-[10px] text-slate-500">Grade: {row.inspectionGrade} ({row.inspectionScore}/100)</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{(row.totalStockAvailable || 0).toLocaleString()} plants</div>
                  <div className="text-[11px] text-slate-500">Annual: {(row.annualSaplingCapacity || 0).toLocaleString()}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="text-[11px] text-slate-700 line-clamp-2 max-w-[240px]">
                    {(row.specialization || []).join(', ')}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  {row.subsidyEligible ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Subsidy Eligible (MIDH)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                      Non-Subsidized
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                    >
                      View
                    </button>
                    {canEdit && row.status === 'pending_inspection' && (
                      <button
                        onClick={() => onApprove(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition active:scale-95"
                      >
                        Approve
                      </button>
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

export function DairyProductsTable({ rows, onView, onRecall, onClearLab, selectedIds = [], onToggleSelect, onSelectAll, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No dairy products match the current filters." />
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-3 w-8 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4">Product &amp; Gaushala</th>
            <th className="py-3 px-4">Batch &amp; FSSAI</th>
            <th className="py-3 px-4">NABL Purity &amp; Lab</th>
            <th className="py-3 px-4">Fat % / SNF / Temp</th>
            <th className="py-3 px-4">Price &amp; Stock</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            return (
              <tr key={row.id} className={`hover:bg-emerald-50/60 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Milk className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>{row.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{row.brandOrGaushala}</div>
                  <div className="text-[10px] text-slate-400">Pack: {row.packSize}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.batchNo}</div>
                  <div className="text-[11px] text-slate-500">FSSAI: {row.fssaiLicenseNo}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-bold ${
                        row.a2BetaCaseinPurity >= 98
                          ? 'text-emerald-700'
                          : row.a2BetaCaseinPurity > 0
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      A2: {row.a2BetaCaseinPurity ? `${row.a2BetaCaseinPurity}%` : 'Pending'}
                    </span>
                    {row.antibioticResidueFree ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full font-semibold">AB-Free</span>
                    ) : (
                      <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full font-semibold">Residue Flagged</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{row.labReportId}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="text-[11px] text-slate-800 font-semibold">Fat: {row.fatPercentage}% | SNF: {row.snfPercentage}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{row.storageTemp}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{fmtINR(row.priceINR)}</div>
                  <div className="text-[11px] text-slate-500">Stock: {row.stockAvailable} units</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                    >
                      View
                    </button>
                    {canEdit && row.status === 'pending_lab_clearance' && (
                      <button
                        onClick={() => onClearLab(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition active:scale-95"
                      >
                        Clear Lab
                      </button>
                    )}
                    {canEdit && row.status === 'active' && (
                      <button
                        onClick={() => onRecall(row)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Recall
                      </button>
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

export function VetBookingsTable({ rows, onView, onMediate, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No appointments match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Booking ID &amp; Date</th>
            <th className="py-3 px-4">Farmer &amp; Location</th>
            <th className="py-3 px-4">Animal &amp; Clinical Issue</th>
            <th className="py-3 px-4">Assigned Vet &amp; ETA</th>
            <th className="py-3 px-4">Amount &amp; Escrow</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{row.bookingNumber}</span>
                  {row.urgencyLevel === 'critical_emergency' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Critical Emergency" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{new Date(row.bookedAt).toLocaleString('en-IN')}</div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-slate-900">{row.farmerName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {row.farmerPhone} • <span className="text-emerald-700 font-semibold">{row.maskedAadhaar}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {row.village}, {row.taluka}, {row.district}
                </div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-semibold text-slate-900">{row.animalType}</div>
                <div className="text-[11px] text-slate-600 line-clamp-2 max-w-[260px] mt-0.5">
                  {row.symptomsDescription}
                </div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-emerald-700">{row.assignedVetName}</div>
                <div className="text-[11px] text-slate-500 font-mono">{row.vetPhone}</div>
                {row.dispatchEtaMinutes > 0 && (
                  <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    ETA: {row.dispatchEtaMinutes} mins
                  </div>
                )}
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{fmtINR(row.totalAmount)}</div>
                <div className="text-[11px] text-slate-500">
                  <StatusBadge status={row.paymentStatus} />
                </div>
              </td>
              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={row.bookingStatus} />
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    View
                  </button>
                  {canEdit && (row.bookingStatus === 'dispute_mediation' || row.bookingStatus === 'emergency_dispatched') && (
                    <button
                      onClick={() => onMediate(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 shadow-xs transition"
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

export function ManureOrdersTable({ rows, onView, onSignOff, canEdit = true }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No manure orders match the current filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Order Number &amp; Date</th>
            <th className="py-3 px-4">Buyer &amp; Destination</th>
            <th className="py-3 px-4">Gaushala Source &amp; Product</th>
            <th className="py-3 px-4">Quantity &amp; Vehicle</th>
            <th className="py-3 px-4">Total &amp; Dual Sign-off</th>
            <th className="py-3 px-4 text-center">Delivery Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{row.orderNumber}</div>
                <div className="text-[11px] text-slate-500">{new Date(row.orderDate).toLocaleString('en-IN')}</div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-slate-900">{row.buyerName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {row.buyerPhone} • <span className="text-emerald-700 font-semibold">{row.maskedAadhaar}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {row.deliveryDestination}
                </div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-emerald-700">{row.gaushalaName}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{row.productName}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{row.quantityMT} MT</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-sans">{row.vehicleNumber}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{fmtINR(row.totalAmountINR)}</div>
                <div className="mt-1">
                  {row.dualSignOffRequired ? (
                    row.dualSignOffCompleted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dual Signed (CRO &amp; Fin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                        Sign-off Pending (&gt;₹50k)
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                      Standard Limit (&lt;₹50k)
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={row.deliveryStatus} />
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(row)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    View
                  </button>
                  {canEdit && row.dualSignOffRequired && !row.dualSignOffCompleted && (
                    <button
                      onClick={() => onSignOff(row)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs transition active:scale-95"
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

// Implements SOP-19 Section 5: GET /v1/admin/livestock/orders
export function OrdersAuditTable({ rows, onView }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No livestock, dairy or manure orders match the audit filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Order / Batch No</th>
            <th className="py-3 px-4">Product Category</th>
            <th className="py-3 px-4">Producer / Gaushala</th>
            <th className="py-3 px-4">Quantity &amp; Value</th>
            <th className="py-3 px-4">Verification &amp; Lab Cert</th>
            <th className="py-3 px-4">Sign-off &amp; Escrow</th>
            <th className="py-3 px-4 text-center">Audit Risk</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => {
            const risk = row.auditRiskLevel || 'LOW_RISK'
            const formattedDate = row.timestamp ? new Date(row.timestamp).toLocaleDateString('en-IN') : 'N/A'
            return (
              <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{row.orderOrBatchNumber || row.id}</div>
                  <div className="text-[11px] text-slate-500 font-sans">{formattedDate}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {row.itemType === 'dairy' ? (
                      <Milk className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span>{row.title || (row.itemType === 'dairy' ? 'A2 Dairy Item' : 'Bulk Manure')}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {row.itemType === 'dairy' ? 'A2 Dairy SKU' : 'Bulk Organic Manure'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-medium text-slate-900">{row.producerOrGaushala || 'N/A'}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{fmtINR(row.amountINR || 0)}</div>
                  <div className="text-[11px] text-slate-600 font-sans">{row.quantityOrStock || 'N/A'}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <div className="font-semibold text-emerald-800">{row.complianceStatus || 'VERIFIED'}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{row.labOrWeighbridgeSlip || 'Lab Cleared'}</div>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <span className="text-[11px] text-slate-700 font-medium">{row.dualSignOffStatus || 'Standard Escrow'}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      risk === 'CRITICAL_RISK'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : risk === 'HIGH_RISK_HOLD'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {String(risk).replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <button
                    onClick={() => onView && onView(row.raw || row)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition"
                  >
                    Audit Detail
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

export function AuditLogTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <EmptyPlaceholder message="No audit records available." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4">Action Type</th>
            <th className="py-3 px-4">Target Entity</th>
            <th className="py-3 px-4">Admin Operator &amp; IP</th>
            <th className="py-3 px-4">State Transition</th>
            <th className="py-3 px-4">Reason / Justification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 text-slate-600 font-sans">
                {new Date(row.timestamp).toLocaleString('en-IN')}
              </td>
              <td className="py-3.5 px-4">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {row.actionType}
                </span>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-slate-900">{row.entityName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{row.entityId}</div>
              </td>
              <td className="py-3.5 px-4 font-sans">
                <div className="font-medium text-slate-900">{row.adminName}</div>
                <div className="text-[10px] text-slate-400 font-mono">{row.ipAddress}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-500">{row.previousState || 'none'}</span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="text-emerald-700 font-bold">{row.newState}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 font-sans text-slate-700 max-w-[280px]">
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
    <div className="flex items-center justify-between px-6 py-3 border-t border-emerald-100/90 text-xs text-slate-600 bg-white/60">
      <div>
        Showing <span className="font-bold text-slate-900 font-mono">{total > 0 ? start : 0}</span> to{' '}
        <span className="font-bold text-slate-900 font-mono">{end}</span> of{' '}
        <span className="font-bold text-slate-900 font-mono">{total}</span> records
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 text-slate-800 font-bold font-mono">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function EmptyPlaceholder({ message }) {
  return (
    <div className="p-12 text-center text-slate-400">
      <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-40" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  )
}
