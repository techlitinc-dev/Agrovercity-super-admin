import React from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Coins,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react'

export function fmtINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const colorMap = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/50',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:border-amber-500/50',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:border-rose-500/50',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:border-blue-500/50',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:border-purple-500/50',
    slate: 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 transition-all duration-200 ${colorMap[color]} ${
        onClick ? 'cursor-pointer' : ''
      } ${alert ? 'ring-1 ring-rose-500/40' : ''}`}
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
    { id: 'claims', label: 'Central Claims Desk', icon: Shield, badge: counts.claims },
    { id: 'surveyors', label: 'Field Surveyor Panel', icon: UserCheck, badge: counts.surveyors },
    { id: 'policies', label: 'PMFBY Policies Passbook', icon: FileText, badge: counts.policies },
    { id: 'rates', label: 'Seasonal Premium Rates', icon: Sliders, badge: counts.rates },
    { id: 'dbt', label: 'DBT Disbursals & Sign-Off', icon: Coins, badge: counts.dbt }
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

export function FiltersBar({
  tab,
  q,
  setQ,
  status,
  setStatus,
  secondaryFilter,
  setSecondaryFilter,
  dateRange,
  setDateRange,
  lateOnly,
  setLateOnly,
  onExportCsv,
  onOpenAuditCompliance,
  onAddRate
}) {
  return (
    <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === 'claims'
                ? 'Search claim #, farmer, crop, district...'
                : tab === 'policies'
                ? 'Search policy #, farmer, crop...'
                : tab === 'surveyors'
                ? 'Search surveyor, agency, district...'
                : 'Search rates or crop...'
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

        {/* Status dropdown */}
        {tab === 'claims' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Claim Statuses</option>
            <option value="intimated">Intimated (Awaiting Surveyor)</option>
            <option value="surveyorAssigned">Surveyor Assigned</option>
            <option value="fieldAssessed">Field Assessed</option>
            <option value="dbtApproved">DBT Approved</option>
            <option value="disbursed">Disbursed (Payout Settled)</option>
            <option value="rejected">Rejected Claims</option>
          </select>
        )}

        {tab === 'policies' && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Policy Statuses</option>
            <option value="active">Active Policies</option>
            <option value="claimed">Claim Filed</option>
            <option value="expired">Expired</option>
          </select>
        )}

        {/* Secondary filter */}
        {tab === 'claims' && (
          <select
            value={secondaryFilter}
            onChange={(e) => setSecondaryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Calamity Types</option>
            <option value="Excess Rainfall / Flood">Excess Rainfall / Flood</option>
            <option value="Hailstorm (गारपीट)">Hailstorm (गारपीट)</option>
            <option value="Severe Pest Attack (Pink Bollworm)">Pest Attack (Pink Bollworm)</option>
            <option value="Unseasonal Heavy Rains">Unseasonal Rains</option>
            <option value="Drought / Dry Spell">Drought / Dry Spell</option>
            <option value="Cyclone / Heavy Gale Winds">Cyclone / Squall Winds</option>
          </select>
        )}

        {tab === 'surveyors' && (
          <select
            value={secondaryFilter}
            onChange={(e) => setSecondaryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Insurance Agencies</option>
            <option value="Agriculture Insurance Company of India (AIC)">AIC of India</option>
            <option value="HDFC ERGO General Insurance">HDFC ERGO</option>
            <option value="SBI General Insurance">SBI General</option>
            <option value="Bajaj Allianz General Insurance">Bajaj Allianz</option>
          </select>
        )}

        {/* 72h Calamity Intimation quick toggle */}
        {tab === 'claims' && (
          <button
            type="button"
            onClick={() => setLateOnly(!lateOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono transition-colors ${
              lateOnly
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/60'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Filter claims submitted outside statutory 72-hour window"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>&gt; 72h Late Intimations</span>
          </button>
        )}

        {/* Date range filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="all">All Historical</option>
        </select>
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'rates' && onAddRate && (
          <button
            onClick={onAddRate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
          >
            <span>+ Add Crop Rate</span>
          </button>
        )}

        <button
          onClick={onOpenAuditCompliance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          title="Run automated DPDP Aadhaar masking & 72-hour window audit"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Compliance</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
          title="Export displayed table to CSV format"
        >
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    intimated: { label: 'Intimated (72h)', cls: 'bg-amber-950/60 text-amber-400 border-amber-500/40' },
    surveyorAssigned: { label: 'Surveyor Assigned', cls: 'bg-blue-950/60 text-blue-400 border-blue-500/40' },
    fieldAssessed: { label: 'Field Assessed', cls: 'bg-purple-950/60 text-purple-400 border-purple-500/40' },
    dbtApproved: { label: 'DBT Approved', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
    disbursed: { label: 'Disbursed (Settled)', cls: 'bg-teal-950/60 text-teal-300 border-teal-500/40' },
    rejected: { label: 'Rejected', cls: 'bg-rose-950/60 text-rose-400 border-rose-500/40' },
    active: { label: 'Active', cls: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' },
    claimed: { label: 'Claimed', cls: 'bg-indigo-950/60 text-indigo-400 border-indigo-500/40' },
    expired: { label: 'Expired', cls: 'bg-slate-800 text-slate-400 border-slate-700' }
  }

  const s = map[status] || { label: status, cls: 'bg-slate-800 text-slate-300 border-slate-700' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.cls}`}>
      {s.label}
    </span>
  )
}

export function ClaimsTable({
  claims,
  onSelectClaim,
  onAssignSurveyor,
  onReviewAssessment,
  onApproveDbt,
  onSecondSignOff,
  onRejectClaim
}) {
  if (!claims || claims.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No crop insurance claims found</p>
        <p className="text-xs mt-1">Try resetting filters or adjusting search parameters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Claim # / Policy</th>
            <th className="py-3 px-4">Farmer / Location</th>
            <th className="py-3 px-4">Crop & Calamity</th>
            <th className="py-3 px-4 text-center">72h Window</th>
            <th className="py-3 px-4 text-right">Loss %</th>
            <th className="py-3 px-4 text-right">Claimed / Approved</th>
            <th className="py-3 px-4">Status & Compliance</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {claims.map((c) => {
            const isLate = c.intimationCompliance === 'FLAGGED_LATE_INTIMATION' || c.intimationElapsedHours > 72
            const requiresDual = c.dualSignOffRequired
            const pendingSecondSignOff = requiresDual && c.firstSignOff && !c.secondSignOff
            const targetAmount = c.approvedAmount || c.requestedAmount

            return (
              <tr
                key={c.id}
                onClick={() => onSelectClaim(c)}
                className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
              >
                {/* Claim & Policy */}
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-emerald-400">{c.claimNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <FileText className="w-3 h-3" />
                    <span>{c.policyNumber}</span>
                  </div>
                </td>

                {/* Farmer & Location */}
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-200">{c.farmerName}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {c.farmerPhone} • Aadhaar: <span className="text-emerald-400/80">{c.aadhaarMasked}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span>{c.village}, {c.district}</span>
                  </div>
                </td>

                {/* Crop & Calamity */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <span>{c.cropName}</span>
                    <span className="text-slate-500">({c.vernacularCropName})</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {c.landAreaAcres} ac
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{c.calamityType}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Stage: {c.cropStage}
                  </div>
                </td>

                {/* 72h Calamity Intimation compliance pill */}
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                      isLate
                        ? 'bg-rose-950/70 text-rose-300 border-rose-500/50'
                        : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                    }`}
                    title={`Intimated in ${c.intimationElapsedHours?.toFixed(1)}h from calamity event`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{c.intimationElapsedHours?.toFixed(1)}h</span>
                    {isLate && <span>(Late)</span>}
                  </span>
                </td>

                {/* Loss % */}
                <td className="py-3.5 px-4 text-right">
                  <div className="font-mono font-bold text-slate-200">
                    {c.surveyorLossPercent !== null && c.surveyorLossPercent !== undefined
                      ? `${c.surveyorLossPercent}%`
                      : `${c.estimatedLossPercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {c.surveyorLossPercent !== null && c.surveyorLossPercent !== undefined ? (
                      <span className="text-purple-400">Surveyed</span>
                    ) : (
                      <span>Farmer Claim</span>
                    )}
                  </div>
                </td>

                {/* Claimed / Approved Amount */}
                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="font-bold text-slate-100">
                    {c.approvedAmount ? fmtINR(c.approvedAmount) : fmtINR(c.requestedAmount)}
                  </div>
                  {c.approvedAmount && c.approvedAmount !== c.requestedAmount && (
                    <div className="text-[10px] text-slate-500 line-through">
                      Req: {fmtINR(c.requestedAmount)}
                    </div>
                  )}
                  {targetAmount > 50000 && (
                    <div className="text-[9px] font-mono text-amber-400/90 mt-0.5">
                      Dual Sign-Off Req.
                    </div>
                  )}
                </td>

                {/* Status & Compliance */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <StatusBadge status={c.status} />
                    {pendingSecondSignOff && (
                      <span className="block text-[10px] font-mono text-amber-400 font-semibold">
                        • 2nd Sign-Off Pending
                      </span>
                    )}
                    {c.dbtTransactionId && (
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                        Ref: {c.dbtTransactionId}
                      </div>
                    )}
                    {c.appealCount > 0 && (
                      <span className="inline-block text-[10px] font-mono text-blue-400">
                        Appeal #{c.appealCount}
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    {c.status === 'intimated' && (
                      <button
                        onClick={() => onAssignSurveyor(c)}
                        className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-[11px] font-medium transition-colors"
                      >
                        Assign
                      </button>
                    )}

                    {c.status === 'surveyorAssigned' && (
                      <button
                        onClick={() => onReviewAssessment(c)}
                        className="px-2 py-1 rounded bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-colors"
                      >
                        Review
                      </button>
                    )}

                    {c.status === 'fieldAssessed' && (
                      <button
                        onClick={() => onApproveDbt(c)}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium transition-colors shadow-sm"
                      >
                        Approve DBT
                      </button>
                    )}

                    {pendingSecondSignOff && (
                      <button
                        onClick={() => onSecondSignOff(c)}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-medium transition-colors shadow-sm"
                      >
                        Sign-Off (2)
                      </button>
                    )}

                    {['intimated', 'surveyorAssigned', 'fieldAssessed'].includes(c.status) && (
                      <button
                        onClick={() => onRejectClaim(c)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Reject claim with administrative reason"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectClaim(c)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Open full detail dossier"
                    >
                      <ChevronRight className="w-4 h-4" />
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

export function SurveyorPanelTable({ surveyors, onAssignSurveyor }) {
  if (!surveyors || surveyors.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-blue-400" />
        <p className="text-base font-medium text-slate-400">No field surveyors found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Surveyor Details</th>
            <th className="py-3 px-4">Insurance Agency Panel</th>
            <th className="py-3 px-4">Assigned Districts</th>
            <th className="py-3 px-4 text-center">Active Caseload</th>
            <th className="py-3 px-4 text-center">Completed</th>
            <th className="py-3 px-4 text-center">SLA Score</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {surveyors.map((s) => (
            <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-200">{s.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{s.phone}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.qualification}</div>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                  {s.agency}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {s.assignedDistricts?.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                {s.activeCaseload}
              </td>
              <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                {s.completedSurveys}
              </td>
              <td className="py-3.5 px-4 text-center font-mono">
                <span className="text-emerald-400 font-bold">{s.slaScore}%</span>
                <span className="text-[10px] text-slate-500 block">({s.avgSurveyDays}d avg)</span>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    s.status === 'available'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {s.status === 'available' ? 'Available' : 'Busy / On Field'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onAssignSurveyor && onAssignSurveyor(s)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Allocate Claims
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PoliciesTable({ policies, onSelectPolicy }) {
  if (!policies || policies.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No insurance policies found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Policy # / Scheme</th>
            <th className="py-3 px-4">Farmer Details</th>
            <th className="py-3 px-4">Crop & Coverage Area</th>
            <th className="py-3 px-4 text-right">Sum Insured</th>
            <th className="py-3 px-4 text-right">Farmer Premium</th>
            <th className="py-3 px-4 text-right">Govt Subsidy</th>
            <th className="py-3 px-4">Company & KCC</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Certificate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {policies.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelectPolicy && onSelectPolicy(p)}
              className="hover:bg-slate-900/50 transition-colors cursor-pointer"
            >
              <td className="py-3.5 px-4">
                <div className="font-mono font-bold text-emerald-400">{p.policyNumber}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{p.schemeName}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {p.season} {p.year}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-200">{p.farmerName}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {p.farmerPhone} • Aadhaar: <span className="text-emerald-400/80">{p.aadhaarMasked}</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <span>{p.cropName}</span>
                  <span className="text-slate-500">({p.vernacularCropName})</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Area: {p.landAreaAcres} Acres
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                {fmtINR(p.sumInsured)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-medium">
                {fmtINR(p.farmerPremium)}
                <span className="block text-[10px] text-slate-500 font-normal">
                  ({p.farmerSharePercent}%)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-blue-400 font-medium">
                {fmtINR(p.govtSubsidy)}
                <span className="block text-[10px] text-slate-500 font-normal">
                  (50:50 Center/State)
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-slate-300 font-medium truncate max-w-[150px]">
                  {p.insuranceCompany}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {p.bankName} • KCC: {p.kccAccountNo}
                </div>
              </td>
              <td className="py-3.5 px-4 text-center">
                <StatusBadge status={p.status} />
              </td>
              <td className="py-3.5 px-4 text-right">
                <a
                  href={p.certificateUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 underline font-mono"
                >
                  <span>PDF Cert</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RatesTable({ rates, onEditRate }) {
  if (!rates || rates.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Sliders className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No premium rates found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Crop & Vernacular</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Season</th>
            <th className="py-3 px-4 text-right">Sum Insured / Acre</th>
            <th className="py-3 px-4 text-right">Farmer Share %</th>
            <th className="py-3 px-4 text-right">Actuarial Rate %</th>
            <th className="py-3 px-4 text-right">Govt Subsidy %</th>
            <th className="py-3 px-4 text-center">Cutoff Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rates.map((r) => (
            <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-3.5 px-4 font-medium text-slate-200">
                <div className="text-emerald-400 font-bold">{r.cropName}</div>
                <div className="text-slate-400 text-[11px]">{r.vernacularCropName}</div>
              </td>
              <td className="py-3.5 px-4 text-slate-300">{r.category}</td>
              <td className="py-3.5 px-4">
                <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {r.season}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                {fmtINR(r.sumInsuredPerAcre)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                {r.farmerSharePercent}%
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                {r.totalActuarialRatePercent}%
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-blue-400 font-medium">
                {r.govtSubsidyPercent}%
                <span className="block text-[10px] text-slate-500">
                  (C: {r.centralSharePercent}% / S: {r.stateSharePercent}%)
                </span>
              </td>
              <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                {r.cutoffDate}
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onEditRate && onEditRate(r)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
                >
                  Adjust Rates
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DbtDisbursalTable({ claims, onSelectClaim, onSecondSignOff }) {
  const dbtClaims = claims.filter((c) => ['dbtApproved', 'disbursed'].includes(c.status))

  if (dbtClaims.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Coins className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-400" />
        <p className="text-base font-medium text-slate-400">No DBT payouts queued or disbursed yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Claim # / Farmer</th>
            <th className="py-3 px-4">Bank Account & IFSC</th>
            <th className="py-3 px-4 text-right">Approved Payout</th>
            <th className="py-3 px-4">DBT UTR / Reference</th>
            <th className="py-3 px-4">Dual Sign-Off Status</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {dbtClaims.map((c) => {
            const requiresDual = c.dualSignOffRequired
            const pendingSecondSignOff = requiresDual && c.firstSignOff && !c.secondSignOff

            return (
              <tr
                key={c.id}
                onClick={() => onSelectClaim(c)}
                className="hover:bg-slate-900/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-emerald-400">{c.claimNumber}</div>
                  <div className="font-medium text-slate-200 mt-0.5">{c.farmerName}</div>
                  <div className="text-[10px] text-slate-500">{c.cropName} • {c.village}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-mono text-slate-300">
                    A/C: XXXX-XXXX-{c.bankAccountLast4}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    IFSC: {c.ifsc || 'SBIN0001234'}
                  </div>
                  <div className="text-[10px] text-slate-500">{c.bankName}</div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                  {fmtINR(c.approvedAmount)}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {c.dbtTransactionId ? (
                    <span className="text-emerald-400 font-bold">{c.dbtTransactionId}</span>
                  ) : (
                    <span className="text-amber-400">QUEUED_FOR_BANK_FILE</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {requiresDual ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CRO Sign-Off: OK</span>
                      </div>
                      {c.secondSignOff ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Finance Dir: OK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>Finance Dir: Pending</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Single Admin Authorize (&le; ₹50,000)
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  {pendingSecondSignOff ? (
                    <button
                      onClick={() => onSecondSignOff(c)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-sm transition-colors"
                    >
                      Authorize (2nd)
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectClaim(c)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      View Receipt
                    </button>
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
