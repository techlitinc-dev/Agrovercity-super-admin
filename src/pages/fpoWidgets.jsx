import React from 'react'
import {
  Building2,
  Package,
  Users,
  Tractor,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Database,
  Lock,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Coins,
  ArrowUpRight,
  Truck,
  Layers,
  Award
} from 'lucide-react'

export function fmtINR(val) {
  if (val === undefined || val === null) return '—'
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`
  }
  return `₹${Number(val).toLocaleString('en-IN')}`
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const colorMap = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/50',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:border-amber-500/50',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:border-rose-500/50',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:border-blue-500/50',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:border-purple-500/50',
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:border-cyan-500/50',
    slate: 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        colorMap[color] || colorMap.emerald
      } ${alert ? 'ring-1 ring-amber-500/50 animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">{value}</span>
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-400 truncate">{subtext}</p>}
    </div>
  )
}

export function TabSwitch({ activeTab, onChangeTab, counts = {} }) {
  const tabs = [
    { id: 'fpos', label: 'Registered FPOs & Credentials', icon: Building2, badge: counts.fpos },
    { id: 'pools', label: 'Bulk Procurement Pools', icon: Package, badge: counts.pools },
    { id: 'members', label: 'Member Collective Pledges', icon: Users, badge: counts.members },
    { id: 'machinery', label: 'Shared CHC Machinery', icon: Tractor, badge: counts.machinery },
    { id: 'audit', label: 'Audit Logs & Governance', icon: Activity, badge: counts.audit }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-slate-800 px-6 bg-slate-950/40 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              isActive
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function StatusBadge({ status, type = 'fpo' }) {
  if (type === 'fpo') {
    const map = {
      verified: { label: 'ROC & NABARD Verified', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
      pending_verification: { label: 'Pending Verification', cls: 'bg-amber-950/60 text-amber-400 border-amber-500/40' },
      rejected: { label: 'Verification Rejected', cls: 'bg-rose-950/60 text-rose-400 border-rose-500/40' },
      suspended: { label: 'Suspended', cls: 'bg-purple-950/60 text-purple-400 border-purple-500/40' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  if (type === 'pool') {
    const map = {
      open_pledging: { label: 'Open Pledging', cls: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40' },
      target_achieved: { label: 'Target Achieved', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
      closed_po_dispatched: { label: 'PO Dispatched', cls: 'bg-purple-950/60 text-purple-400 border-purple-500/40' },
      delivered: { label: 'Delivered to Members', cls: 'bg-blue-950/60 text-blue-400 border-blue-500/40' },
      cancelled: { label: 'Cancelled', cls: 'bg-slate-800 text-slate-400 border-slate-700' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  if (type === 'payment') {
    const map = {
      ADVANCE_PAID: { label: 'Advance Paid', cls: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' },
      FULLY_PAID: { label: 'Fully Paid', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
      PENDING: { label: 'Pending', cls: 'bg-amber-950/60 text-amber-400 border-amber-500/40' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  if (type === 'machinery') {
    const map = {
      available: { label: 'Available in Hub', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
      in_field: { label: 'Active in Field', cls: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' },
      maintenance: { label: 'In Maintenance', cls: 'bg-amber-950/60 text-amber-400 border-amber-500/40' }
    }
    const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
        {s.label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border bg-slate-800 text-slate-300 border-slate-700">
      {status}
    </span>
  )
}

export function FiltersBar({
  tab,
  q,
  setQ,
  status,
  setStatus,
  district,
  setDistrict,
  onExportCsv,
  onCreatePool,
  onOpenPendingVerification
}) {
  return (
    <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === 'fpos'
                ? 'Search FPO name, CIN, PAN, CEO, crops...'
                : tab === 'pools'
                ? 'Search pool name, supplier, FPO, PO #...'
                : tab === 'members'
                ? 'Search farmer name, phone, Aadhaar, village...'
                : 'Search shared machinery or audit logs...'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* FPO Verification Status Filter */}
        {tab === 'fpos' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified (ROC + NABARD)</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="rejected">Rejected</option>
          </select>
        )}

        {/* Pool Status Filter */}
        {tab === 'pools' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Pool Statuses</option>
            <option value="open_pledging">Open for Pledging</option>
            <option value="target_achieved">Target Achieved</option>
            <option value="closed_po_dispatched">PO Dispatched</option>
            <option value="delivered">Delivered to Members</option>
          </select>
        )}

        {/* District Filter */}
        {['fpos', 'pools', 'members'].includes(tab) && (
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Districts</option>
            <option value="Nashik">Nashik</option>
            <option value="Jalna">Jalna</option>
            <option value="Beed">Beed</option>
            <option value="Latur">Latur</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            <option value="Dewas">Dewas (MP)</option>
            <option value="Rajkot">Rajkot (Gujarat)</option>
          </select>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'pools' && onCreatePool && (
          <button
            onClick={onCreatePool}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
            title="Create platform-sponsored group buy pool (SOP-18 §3)"
          >
            <Package className="w-3.5 h-3.5" />
            <span>+ Create Group Buy Pool</span>
          </button>
        )}

        {tab === 'fpos' && onOpenPendingVerification && (
          <button
            onClick={onOpenPendingVerification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
            title="Review and approve pending FPO registration credentials"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Review Pending FPOs</span>
          </button>
        )}

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          title="Export current view to CSV"
        >
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export function FposTable({ fpos, onSelectFpo, onVerifyFpo }) {
  if (!fpos || fpos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No FPO records found</p>
        <p className="text-xs mt-1">Try adjusting the search criteria or resetting filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">FPO Name & CIN</th>
            <th className="py-3 px-4">Location & Registration</th>
            <th className="py-3 px-4">Executive Leadership</th>
            <th className="py-3 px-4 text-center">Shareholders</th>
            <th className="py-3 px-4 text-right">Annual Turnover</th>
            <th className="py-3 px-4 text-center">Verification Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {fpos.map((fpo) => (
            <tr
              key={fpo.id}
              onClick={() => onSelectFpo(fpo)}
              className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-200">{fpo.name}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  CIN: {fpo.cin}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  PAN: {fpo.pan} · GSTIN: {fpo.gstin}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-200 font-medium">
                  {fpo.registeredTaluka}, {fpo.registeredDistrict} ({fpo.registeredState})
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {fpo.nabardEmpanelmentNo}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Crops: {fpo.primaryCrops?.join(', ')}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-200 font-medium">CEO: {fpo.ceoName}</div>
                <div className="text-[11px] text-slate-400">Chair: {fpo.chairmanName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{fpo.ceoPhone}</div>
              </td>

              <td className="py-3.5 px-4 text-center font-mono">
                <div className="text-base font-bold text-slate-100">
                  {fpo.totalShareholders.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500">
                  Cap: {fmtINR(fpo.paidUpCapitalInr)}
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="text-sm font-bold text-emerald-400">
                  {fmtINR(fpo.annualTurnoverInr)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Dividend: {fmtINR(fpo.patronageDividendDistributedInr)}
                </div>
                <div className="text-[10px] text-purple-400">
                  CHC Units: {fpo.chcEquipmentCount}
                </div>
              </td>

              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={fpo.verificationStatus} type="fpo" />
              </td>

              <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1.5">
                  {fpo.verificationStatus === 'pending_verification' && (
                    <button
                      onClick={() => onVerifyFpo(fpo)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors shadow-sm"
                    >
                      Verify Credentials
                    </button>
                  )}
                  <button
                    onClick={() => onSelectFpo(fpo)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View FPO details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FpoPoolsTable({ pools, onSelectPool, onClosePool }) {
  if (!pools || pools.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No bulk procurement pools found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Pool Name & Category</th>
            <th className="py-3 px-4">Organizing FPO & Supplier</th>
            <th className="py-3 px-4">Target vs Pledged Volume</th>
            <th className="py-3 px-4 text-right">Pricing & Savings</th>
            <th className="py-3 px-4 text-center">Members Pledged</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {pools.map((p) => {
            const pct = Math.min(100, Math.round((p.pledgedQuantity / p.targetQuantity) * 100))

            return (
              <tr
                key={p.id}
                onClick={() => onSelectPool(p)}
                className="hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-200">{p.poolName}</div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    {p.category} · PO: {p.poNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Deadline: {new Date(p.deadline).toLocaleDateString('en-IN')}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-slate-200 font-medium">{p.fpoName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Supplier: {p.supplierName}</div>
                  <div className="text-[10px] text-slate-500">Hub: {p.deliveryHub}</div>
                </td>

                <td className="py-3.5 px-4 font-mono">
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>{p.pledgedQuantity} / {p.targetQuantity} {p.quantityUnit}</span>
                    <span className="font-bold text-emerald-400">{pct}%</span>
                  </div>
                  <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>

                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="text-slate-100 font-bold">
                    {fmtINR(p.totalPoolValueInr)}
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    Saved: {fmtINR(p.collectiveSavingsInr)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Offer: ₹{p.poolOfferPricePerUnit?.toLocaleString('en-IN')} / {p.quantityUnit}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-center font-mono">
                  <div className="text-base font-bold text-slate-200">
                    {p.participatingFarmersCount}
                  </div>
                  <div className="text-[10px] text-slate-500">Farmers Pledged</div>
                </td>

                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={p.status} type="pool" />
                </td>

                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  {p.status === 'open_pledging' || p.status === 'target_achieved' ? (
                    <button
                      onClick={() => onClosePool(p)}
                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-colors shadow-sm"
                    >
                      Trigger PO Dispatch
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">PO Dispatched ✓</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function PoolMembersTable({ members, onSelectMember }) {
  if (!members || members.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No member pledges found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Farmer Details</th>
            <th className="py-3 px-4">Aadhaar (DPDP Masked)</th>
            <th className="py-3 px-4">Pool Association</th>
            <th className="py-3 px-4 text-right">Pledged Volume</th>
            <th className="py-3 px-4 text-right">Financial Commitment</th>
            <th className="py-3 px-4 text-center">Payment Status</th>
            <th className="py-3 px-4 text-right">Pickup Hub</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {members.map((m) => (
            <tr
              key={m.id}
              onClick={() => onSelectMember && onSelectMember(m)}
              className="hover:bg-slate-900/50 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-200">{m.farmerName}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{m.farmerPhone}</div>
                <div className="text-[10px] text-slate-500">{m.village}, {m.district}</div>
              </td>

              <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                {m.aadhaarMasked}
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-200 font-medium truncate max-w-xs">{m.poolName}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{m.fpoName}</div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="font-bold text-slate-200">
                  {m.pledgedQuantity} {m.quantityUnit}
                </div>
                <div className="text-[10px] text-slate-500">
                  @ ₹{m.unitPriceInr?.toLocaleString('en-IN')}
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="font-bold text-slate-100">
                  {fmtINR(m.totalAmountInr)}
                </div>
                <div className="text-[11px] text-emerald-400">
                  Advance: {fmtINR(m.advanceDepositInr)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Balance: {fmtINR(m.balancePayableInr)}
                </div>
              </td>

              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={m.paymentStatus} type="payment" />
              </td>

              <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                <div className="text-slate-300">{m.deliveryHub}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {new Date(m.pledgedAt).toLocaleDateString('en-IN')}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function MachineryTable({ machinery, onSelectMachinery }) {
  if (!machinery || machinery.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Tractor className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No shared machinery assets found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Asset Name & Category</th>
            <th className="py-3 px-4">Custom Hiring Center (CHC)</th>
            <th className="py-3 px-4 font-mono">Capital & Subsidy</th>
            <th className="py-3 px-4 text-right">Rental Rate & Hours</th>
            <th className="py-3 px-4 text-right">Revenue & Reserve</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Current Operator</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {machinery.map((mach) => (
            <tr
              key={mach.id}
              onClick={() => onSelectMachinery && onSelectMachinery(mach)}
              className="hover:bg-slate-900/50 cursor-pointer transition-colors"
            >
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-200">{mach.equipmentName}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  Reg: {mach.registrationNo} · {mach.category}
                </div>
                <div className="text-[10px] text-slate-500">
                  Acquired: {mach.purchaseYear}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <div className="text-slate-200 font-medium">{mach.fpoName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{mach.currentLocation}</div>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-200 font-medium">Cost: {fmtINR(mach.capitalCostInr)}</div>
                <div className="text-[11px] text-emerald-400">
                  SMAM Subsidy: {fmtINR(mach.subsidyReceivedInr)}
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="font-bold text-slate-100">
                  ₹{mach.rentalRatePerHour} / Hr
                </div>
                <div className="text-[11px] text-cyan-400">
                  {mach.totalHoursBookedThisSeason} Hrs Booked
                </div>
              </td>

              <td className="py-3.5 px-4 text-right font-mono">
                <div className="font-bold text-emerald-400">
                  {fmtINR(mach.totalRevenueGeneratedInr)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Reserve: {fmtINR(mach.maintenanceReserveInr)}
                </div>
              </td>

              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={mach.status} type="machinery" />
              </td>

              <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                {mach.operatorName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AuditLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No FPO module audit entries found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Timestamp & Admin</th>
            <th className="py-3 px-4">Action Type</th>
            <th className="py-3 px-4">Entity Ref</th>
            <th className="py-3 px-4">State Transition</th>
            <th className="py-3 px-4">Audit Justification</th>
            <th className="py-3 px-4 text-right">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-200 font-medium">
                  {new Date(log.timestamp).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400 mt-0.5">
                  {log.adminName || log.adminUid}
                </div>
              </td>

              <td className="py-3.5 px-4">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {log.actionType}
                </span>
              </td>

              <td className="py-3.5 px-4 font-mono">
                <div className="text-slate-200 font-bold">{log.entityName}</div>
                <div className="text-[11px] text-slate-400">ID: {log.entityId}</div>
              </td>

              <td className="py-3.5 px-4 font-mono text-[11px]">
                <span className="text-amber-400">{log.previousState}</span> &rarr;{' '}
                <span className="text-emerald-400">{log.newState}</span>
              </td>

              <td className="py-3.5 px-4 text-slate-300 text-xs max-w-sm">
                {log.reason}
              </td>

              <td className="py-3.5 px-4 text-right font-mono text-slate-500 text-[11px]">
                {log.ipAddress}
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
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
      <div>
        Showing <span className="font-mono text-slate-200">{start}</span> to{' '}
        <span className="font-mono text-slate-200">{end}</span> of{' '}
        <span className="font-mono text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-1 font-mono">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
        >
          &lt; Prev
        </button>
        <span className="px-2 py-1 text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
        >
          Next &gt;
        </button>
      </div>
    </div>
  )
}
