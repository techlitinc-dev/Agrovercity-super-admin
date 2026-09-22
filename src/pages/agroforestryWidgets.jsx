import React from 'react'
import {
  Trees,
  Sprout,
  Building2,
  Fuel,
  BookOpen,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Download,
  Plus,
  Truck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  DollarSign
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
    pending: { label: 'Pending Review', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    approved: { label: 'Approved (Allocated)', bg: 'bg-teal-50 text-teal-700 border-teal-200/80' },
    dispatched: { label: 'In Transit', bg: 'bg-purple-50 text-purple-700 border-purple-200/80 animate-pulse' },
    delivered: { label: 'Delivered (Planted)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },

    verified: { label: 'Empaneled & Verified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    pending_verification: { label: 'Audit Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200/80' },
    suspended: { label: 'Suspended', bg: 'bg-rose-50 text-rose-700 border-rose-200/80' },

    active: { label: 'Active', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
    published: { label: 'Published', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-600 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80' },
    blue: { text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200/80' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/80' },
    purple: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200/80' }
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

export function AgroforestryMetricBar({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Sapling Distributions"
        value={(summary.totalSaplingsDistributed || 0).toLocaleString()}
        subtitle={`${summary.totalSaplingRequests || 0} total requests • Max 500 cap`}
        icon={Sprout}
        badge="Enforced 500 Cap"
        color="emerald"
      />
      <MetricCard
        title="Pending Triage"
        value={summary.pendingReviewRequests || 0}
        subtitle={`${summary.approvedAndDispatched || 0} approved / in-transit batches`}
        icon={Clock}
        badge="Needs Action"
        color="amber"
      />
      <MetricCard
        title="Empaneled NGO Nurseries"
        value={`${summary.activeNgosPartnered || 0} Partners`}
        subtitle="NITI Aayog Darpan & 80G verified"
        icon={Building2}
        badge="80G/12A Audited"
        color="blue"
      />
      <MetricCard
        title="Plantation Survival Rate"
        value={`${summary.averageSurvivalRatePercent || 89.4}%`}
        subtitle={`${(summary.totalCarbonOffsetMT || 0).toLocaleString()} MT CO2 offset calculated`}
        icon={Trees}
        badge="Geo-Audited"
        color="purple"
      />
    </div>
  )
}

export function AgroforestryTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'requests', label: 'Sapling Requests', icon: Sprout, count: counts.requests },
    { id: 'ngos', label: 'Partner NGOs & Nurseries', icon: Building2, count: counts.ngos },
    { id: 'biofuel', label: 'Commercial Biofuel Trees', icon: Fuel, count: counts.biofuel },
    { id: 'guides', label: 'Planting & Care Guides', icon: BookOpen, count: counts.guides },
    { id: 'articles', label: 'Agroforestry Models', icon: FileText, count: counts.articles },
    { id: 'audit', label: 'Audit Trails', icon: ShieldCheck, count: counts.audit }
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

export function AgroforestryFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  activeTab,
  onRefresh,
  onExportCsv,
  onCreateNew
}) {
  const getStatusOptions = () => {
    switch (activeTab) {
      case 'requests':
        return [
          { val: 'all', label: 'All Request Statuses' },
          { val: 'pending', label: 'Pending Review' },
          { val: 'approved', label: 'Approved' },
          { val: 'dispatched', label: 'In Transit' },
          { val: 'delivered', label: 'Delivered' },
          { val: 'rejected', label: 'Rejected' }
        ]
      case 'ngos':
        return [
          { val: 'all', label: 'All NGO Statuses' },
          { val: 'verified', label: 'Verified & Empaneled' },
          { val: 'pending_verification', label: 'Pending Verification' },
          { val: 'suspended', label: 'Suspended' }
        ]
      default:
        return [{ val: 'all', label: 'All Statuses' }]
    }
  }

  return (
    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-2xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {['requests', 'ngos'].includes(activeTab) && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            {getStatusOptions().map((opt) => (
              <option key={opt.val} value={opt.val}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {activeTab === 'requests' && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Tree Categories</option>
            <option value="timber">Timber (Teak, Melia Dubia)</option>
            <option value="biofuel">Biofuel (Karanja, Simarouba)</option>
            <option value="bamboo">Bamboo (Balcooa, Tulda)</option>
            <option value="fruit">Fruit & Agroforestry</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        {['guides', 'articles'].includes(activeTab) && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'guides' ? 'New Care Guide' : 'New Model Article'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// TABLES
// -------------------------------------------------------------
export function SaplingRequestsTable({ data, onView, onApprove, onDispatch, onDeliver, onReject }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No sapling requests found matching filters.
      </div>
    )
  }

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">Request ID & Farmer</th>
              <th className="py-3 px-3">Species & Tree Category</th>
              <th className="py-3 px-3">Quantity (Cap 500)</th>
              <th className="py-3 px-3">Land Plot (7/12)</th>
              <th className="py-3 px-3">Allocated NGO Nursery</th>
              <th className="py-3 px-3">Status & Survival</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(item)}>
                    {item.farmerName}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">{item.farmerPhone}</div>
                  <div className="font-mono text-[10px] text-slate-400">{item.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900">{item.speciesRequested}</div>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] uppercase font-mono font-bold">
                    {item.treeCategory}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-emerald-800 font-bold">{item.quantity} saplings</div>
                  <div className="text-[10px] text-slate-500">
                    {item.subsidyPct}% Subsidy (Payable: {fmtINR(item.farmerPayableINR)})
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-800 font-medium">{item.district}, {item.taluka}</div>
                  <div className="font-mono text-[10px] text-slate-500">Survey 7/12: {item.surveyNumber712} ({item.landAreaAcres} ac)</div>
                </td>
                <td className="py-3 px-3 text-slate-800">
                  <div className="line-clamp-1 font-medium">{item.allocatedNgoName}</div>
                  {item.dispatchTrackingNo && (
                    <div className="font-mono text-[10px] text-purple-700 font-bold">{item.dispatchTrackingNo}</div>
                  )}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={item.status} />
                  {item.survivalRatePercent !== null && (
                    <div className="font-mono text-[10px] text-emerald-700 font-bold mt-0.5">
                      Survival: {item.survivalRatePercent}%
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                    >
                      View
                    </button>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => onApprove(item)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                      >
                        Approve
                      </button>
                    )}
                    {item.status === 'approved' && (
                      <button
                        onClick={() => onDispatch(item)}
                        className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-[11px] font-bold"
                      >
                        Dispatch
                      </button>
                    )}
                    {item.status === 'dispatched' && (
                      <button
                        onClick={() => onDeliver(item)}
                        className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg text-[11px] font-bold"
                      >
                        Delivered
                      </button>
                    )}
                    {['pending', 'approved'].includes(item.status) && (
                      <button
                        onClick={() => onReject(item)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function NgosTable({ data, onView, onVerify, onSuspend }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No partner NGOs or nurseries found.
      </div>
    )
  }

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">NGO / Nursery Name</th>
              <th className="py-3 px-3">Darpan & Reg No</th>
              <th className="py-3 px-3">80G / 12A Audit</th>
              <th className="py-3 px-3">Nursery Acres & Capacity</th>
              <th className="py-3 px-3">Stock & Distributed</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((ngo) => (
              <tr key={ngo.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(ngo)}>
                    {ngo.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{ngo.contactPerson} ({ngo.district})</div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-800 font-medium">
                  <div>{ngo.darpanId}</div>
                  <div className="text-[10px] text-slate-500">{ngo.trustRegNo}</div>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    ngo.has80G12A ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {ngo.has80G12A ? '80G & 12A Active' : 'Exemption Pending'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-900 font-semibold">{ngo.nurseryAcres} Acres</div>
                  <div className="font-mono text-[10px] text-slate-500">Cap: {ngo.annualSaplingCapacity?.toLocaleString()} / yr</div>
                </td>
                <td className="py-3 px-3 font-mono text-slate-800">
                  <div className="text-emerald-800 font-bold">{ngo.currentStock?.toLocaleString()} stock</div>
                  <div className="text-[10px] text-slate-500">{ngo.totalDistributed?.toLocaleString()} distributed</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={ngo.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(ngo)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                    >
                      View
                    </button>
                    {ngo.status !== 'verified' && (
                      <button
                        onClick={() => onVerify(ngo)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                      >
                        Verify
                      </button>
                    )}
                    {ngo.status === 'verified' && (
                      <button
                        onClick={() => onSuspend(ngo)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold"
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
    </div>
  )
}

export function BiofuelTreesTable({ data, onView, onEditEconomics }) {
  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">Biofuel Tree Species</th>
              <th className="py-3 px-3">Gestation Period</th>
              <th className="py-3 px-3">Oil Content %</th>
              <th className="py-3 px-3">Annual Return / Acre</th>
              <th className="py-3 px-3">CO2 Offset / Tree</th>
              <th className="py-3 px-3">Buyback Depot Partner</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((tree) => (
              <tr key={tree.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(tree)}>
                    {tree.commonName}
                  </div>
                  <div className="italic text-slate-500 text-[10px]">{tree.botanicalName}</div>
                </td>
                <td className="py-3 px-3 font-mono text-slate-800 font-medium">{tree.gestationYears} Years</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
                    {tree.oilContentPercent}% Oil
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-emerald-800 font-bold">
                  {fmtINR(tree.annualGrossReturnPerAcreINR)}
                </td>
                <td className="py-3 px-3 font-mono text-slate-800 font-medium">{tree.co2SequestrationKgPerYear} kg / yr</td>
                <td className="py-3 px-3 text-slate-800">
                  <div className="line-clamp-1 font-medium">{tree.buybackPartner}</div>
                  <div className="font-mono text-[10px] text-slate-500">Seed rate: ₹{tree.marketRatePerKgINR}/kg</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(tree)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditEconomics(tree)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold"
                    >
                      Edit Economics
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TreeCareGuidesTable({ data, onView }) {
  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">Guide Title & Species</th>
              <th className="py-3 px-3">Soil Compatibility</th>
              <th className="py-3 px-3">Pit Dimensions</th>
              <th className="py-3 px-3">Spacing</th>
              <th className="py-3 px-3">Pruning Cycle</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((guide) => (
              <tr key={guide.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(guide)}>
                    {guide.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">{guide.species}</div>
                </td>
                <td className="py-3 px-3 text-slate-800 max-w-xs line-clamp-1">{guide.soilType}</td>
                <td className="py-3 px-3 font-mono text-slate-800">{guide.pitDimensions}</td>
                <td className="py-3 px-3 font-mono text-slate-800">{guide.spacingMeters}</td>
                <td className="py-3 px-3 font-mono text-slate-800">Every {guide.pruningCycleMonths} mos</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onView(guide)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                  >
                    View SOP
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TreeArticlesTable({ data, onView }) {
  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">Article Title</th>
              <th className="py-3 px-3">Intercropping Model</th>
              <th className="py-3 px-3">Expected Payback</th>
              <th className="py-3 px-3">Carbon Credits</th>
              <th className="py-3 px-3">Author</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((art) => (
              <tr key={art.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(art)}>
                    {art.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">{art.id}</div>
                </td>
                <td className="py-3 px-3 text-slate-800">{art.intercroppingModel}</td>
                <td className="py-3 px-3 font-mono text-slate-800">{art.expectedPaybackYears} Years</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    Eligible (Verified)
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-800">{art.author}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onView(art)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AgroforestryAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
        No audit log records found for Agroforestry & Tree Plantation.
      </div>
    )
  }

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-3 px-4">Audit ID & Timestamp</th>
              <th className="py-3 px-3">Admin Operator</th>
              <th className="py-3 px-3">Action Type</th>
              <th className="py-3 px-3">Target Entity</th>
              <th className="py-3 px-3">State Transition</th>
              <th className="py-3 px-4">Reason & Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((log) => (
              <tr key={log.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-slate-900 font-medium">{formatDate(log.timestamp)}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-900 font-bold">{log.adminName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.ipAddress}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {log.actionType}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-900 font-semibold">{log.entityName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.entityId} ({log.collection})</div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="text-slate-400 line-through text-[10px]">{log.previousState}</div>
                  <div className="text-emerald-800 font-bold">{log.newState}</div>
                </td>
                <td className="py-3 px-4 text-slate-700 max-w-xs text-[11px] leading-relaxed">
                  {log.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ContentPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-emerald-100/80 mt-4 px-1">
      <div>
        Showing <span className="font-mono text-slate-900 font-bold">{total === 0 ? 0 : start}</span> -{' '}
        <span className="font-mono text-slate-900 font-bold">{end}</span> of{' '}
        <span className="font-mono text-slate-900 font-bold">{total}</span> records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>
        <span className="font-mono text-slate-800 font-medium px-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium shadow-2xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
