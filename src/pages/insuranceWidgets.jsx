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
import {
  AgroStatusDropdown,
  AgroDateDropdown,
  AgroFilterDropdown
} from '../components/ui/AgroFilterDropdown'

export function fmtINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export function MetricCard({ title, value, subtext, icon: Icon, color = 'emerald', alert = false, onClick }) {
  const toneMap = {
    emerald: 'text-emerald-700 bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'text-amber-700 bg-amber-50 text-amber-600 border-amber-100',
    rose: 'text-rose-700 bg-rose-50 text-rose-600 border-rose-100',
    blue: 'text-sky-700 bg-sky-50 text-sky-600 border-sky-100',
    purple: 'text-purple-700 bg-purple-50 text-purple-600 border-purple-100',
    slate: 'text-slate-800 bg-slate-50 text-slate-600 border-slate-200'
  }

  const currentTone = toneMap[color] || toneMap.emerald
  const [valColor, iconBg, iconColor, iconBorder] = currentTone.split(' ')

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      } ${alert ? 'ring-2 ring-rose-500/30' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${iconBg} ${iconColor} ${iconBorder}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2.5">
        <span className={`text-2xl font-black font-mono tracking-tight ${valColor}`}>{value}</span>
        {subtext && <p className="mt-1 text-xs text-slate-500 font-medium truncate">{subtext}</p>}
      </div>
    </div>
  )
}

export function TabSwitch({ activeTab, onChangeTab, counts = {} }) {
  const tabs = [
    { id: 'claims', label: 'Central Claims Desk', icon: Shield, badge: counts.claims },
    { id: 'surveyors', label: 'Field Surveyor Panel', icon: UserCheck, badge: counts.surveyors },
    { id: 'policies', label: 'PMFBY Policies Passbook', icon: FileText, badge: counts.policies },
    { id: 'rates', label: 'Seasonal Premium Rates', icon: Sliders, badge: counts.rates },
    { id: 'dbt', label: 'DBT Disbursals & Sign-Off', icon: Coins, badge: counts.dbt },
    { id: 'audit_trail', label: 'Statutory Audit Trail', icon: ShieldAlert, badge: counts.audit_trail }
  ]

  return (
    <div className="flex items-center gap-1.5 border-b border-emerald-100/80 px-6 pb-2 bg-white/50 backdrop-blur-sm overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                  isActive
                    ? 'bg-emerald-700/80 text-emerald-100 border-emerald-500/50'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
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
    <div className="p-4 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
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
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Status dropdown */}
        {tab === 'claims' && (
          <AgroStatusDropdown
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All Claim Statuses', dotColor: 'bg-slate-400' },
              { value: 'intimated', label: 'Intimated (Awaiting Surveyor)', dotColor: 'bg-amber-500', badge: 'Queue' },
              { value: 'surveyorAssigned', label: 'Surveyor Assigned', dotColor: 'bg-sky-500' },
              { value: 'fieldAssessed', label: 'Field Assessed', dotColor: 'bg-purple-500' },
              { value: 'dbtApproved', label: 'DBT Approved', dotColor: 'bg-teal-500', badge: 'DBT' },
              { value: 'disbursed', label: 'Disbursed (Payout Settled)', dotColor: 'bg-emerald-500', badge: 'Settled' },
              { value: 'rejected', label: 'Rejected Claims', dotColor: 'bg-rose-500', badge: 'Declined' }
            ]}
          />
        )}

        {tab === 'policies' && (
          <AgroStatusDropdown
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All Policy Statuses', dotColor: 'bg-slate-400' },
              { value: 'active', label: 'Active Policies', dotColor: 'bg-emerald-500', badge: 'Live' },
              { value: 'claimed', label: 'Claim Filed', dotColor: 'bg-amber-500' },
              { value: 'expired', label: 'Expired Policy', dotColor: 'bg-slate-400' }
            ]}
          />
        )}

        {/* Secondary filter */}
        {tab === 'claims' && (
          <AgroFilterDropdown
            label="Calamity"
            value={secondaryFilter}
            onChange={setSecondaryFilter}
            options={[
              { value: 'all', label: 'All Calamity Types' },
              { value: 'Excess Rainfall / Flood', label: 'Excess Rainfall / Flood', badge: 'Flood' },
              { value: 'Hailstorm (गारपीट)', label: 'Hailstorm (गारपीट)', badge: 'Hail' },
              { value: 'Severe Pest Attack (Pink Bollworm)', label: 'Pest Attack (Pink Bollworm)', badge: 'Pest' },
              { value: 'Unseasonal Heavy Rains', label: 'Unseasonal Rains' },
              { value: 'Drought / Dry Spell', label: 'Drought / Dry Spell', badge: 'Dry' },
              { value: 'Cyclone / Heavy Gale Winds', label: 'Cyclone / Squall Winds' }
            ]}
            icon={ShieldAlert}
          />
        )}

        {tab === 'surveyors' && (
          <AgroFilterDropdown
            label="Agency"
            value={secondaryFilter}
            onChange={setSecondaryFilter}
            options={[
              { value: 'all', label: 'All Insurance Agencies' },
              { value: 'Agriculture Insurance Company of India (AIC)', label: 'AIC of India', badge: 'Govt' },
              { value: 'HDFC ERGO General Insurance', label: 'HDFC ERGO' },
              { value: 'SBI General Insurance', label: 'SBI General' },
              { value: 'Bajaj Allianz General Insurance', label: 'Bajaj Allianz' }
            ]}
            icon={Building2}
          />
        )}

        {/* 72h Calamity Intimation quick toggle */}
        {tab === 'claims' && (
          <button
            type="button"
            onClick={() => setLateOnly(!lateOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              lateOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs font-bold ring-2 ring-rose-400/20'
                : 'bg-white hover:bg-emerald-50/50 text-slate-700 border-emerald-200/90'
            }`}
            title="Filter claims submitted outside statutory 72-hour window"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>&gt; 72h Late Intimations</span>
          </button>
        )}

        {/* Date range filter */}
        <AgroDateDropdown
          value={dateRange}
          onChange={setDateRange}
          options={[
            { value: '7', label: 'Last 7 Days', subtext: 'Weekly operational view' },
            { value: '30', label: 'Last 30 Days', subtext: 'Monthly SLA view' },
            { value: '90', label: 'Last 90 Days', subtext: 'Seasonal quarter' },
            { value: 'all', label: 'All Historical', subtext: 'Full PMFBY records' }
          ]}
        />
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2 shrink-0">
        {tab === 'rates' && onAddRate && (
          <button
            onClick={onAddRate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition active:scale-95"
          >
            <span>+ Add Crop Rate</span>
          </button>
        )}

        <button
          onClick={onOpenAuditCompliance}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs transition"
          title="Run automated DPDP Aadhaar masking & 72-hour window audit"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audit Compliance</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold shadow-2xs transition"
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
    intimated: { label: 'Intimated (72h)', cls: 'bg-amber-50 text-amber-800 border-amber-300' },
    surveyorAssigned: { label: 'Surveyor Assigned', cls: 'bg-sky-50 text-sky-800 border-sky-300' },
    fieldAssessed: { label: 'Field Assessed', cls: 'bg-purple-50 text-purple-800 border-purple-300' },
    dbtApproved: { label: 'DBT Approved', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    disbursed: { label: 'Disbursed (Settled)', cls: 'bg-teal-50 text-teal-800 border-teal-300' },
    rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-800 border-rose-300' },
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    claimed: { label: 'Claimed', cls: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
    expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
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
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No crop insurance claims found</p>
        <p className="text-xs text-slate-500 mt-1">Try resetting filters or adjusting search parameters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
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
        <tbody className="divide-y divide-slate-100/80">
          {claims.map((c) => {
            const isLate = c.intimationCompliance === 'FLAGGED_LATE_INTIMATION' || c.intimationElapsedHours > 72
            const requiresDual = c.dualSignOffRequired
            const pendingSecondSignOff = requiresDual && c.firstSignOff && !c.secondSignOff
            const targetAmount = c.approvedAmount || c.requestedAmount

            return (
              <tr
                key={c.id}
                onClick={() => onSelectClaim(c)}
                className="hover:bg-emerald-50/60 cursor-pointer transition-colors group"
              >
                {/* Claim & Policy */}
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-emerald-700">{c.claimNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>{c.policyNumber}</span>
                  </div>
                </td>

                {/* Farmer & Location */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{c.farmerName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {c.farmerPhone} • Aadhaar: <span className="text-emerald-700 font-semibold">{c.aadhaarMasked}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span>{c.village}, {c.district}</span>
                  </div>
                </td>

                {/* Crop & Calamity */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{c.cropName}</span>
                    <span className="text-slate-500 font-normal">({c.vernacularCropName})</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {c.landAreaAcres} ac
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{c.calamityType}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Stage: {c.cropStage}
                  </div>
                </td>

                {/* 72h Calamity Intimation compliance pill */}
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isLate
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
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
                  <div className="font-mono font-bold text-slate-900">
                    {c.surveyorLossPercent !== null && c.surveyorLossPercent !== undefined
                      ? `${c.surveyorLossPercent}%`
                      : `${c.estimatedLossPercent}%`}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {c.surveyorLossPercent !== null && c.surveyorLossPercent !== undefined ? (
                      <span className="text-purple-700 font-semibold">Surveyed</span>
                    ) : (
                      <span>Farmer Claim</span>
                    )}
                  </div>
                </td>

                {/* Claimed / Approved Amount */}
                <td className="py-3.5 px-4 text-right font-mono">
                  <div className="font-bold text-slate-900">
                    {c.approvedAmount ? fmtINR(c.approvedAmount) : fmtINR(c.requestedAmount)}
                  </div>
                  {c.approvedAmount && c.approvedAmount !== c.requestedAmount && (
                    <div className="text-[10px] text-slate-400 line-through">
                      Req: {fmtINR(c.requestedAmount)}
                    </div>
                  )}
                  {targetAmount > 50000 && (
                    <div className="text-[9px] font-mono font-bold text-amber-700 mt-0.5">
                      Dual Sign-Off Req.
                    </div>
                  )}
                </td>

                {/* Status & Compliance */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <StatusBadge status={c.status} />
                    {pendingSecondSignOff && (
                      <span className="block text-[10px] font-mono text-amber-700 font-bold">
                        • 2nd Sign-Off Pending
                      </span>
                    )}
                    {c.dbtTransactionId && (
                      <div className="text-[10px] font-mono text-slate-500 truncate max-w-[130px]">
                        Ref: {c.dbtTransactionId}
                      </div>
                    )}
                    {c.appealCount > 0 && (
                      <span className="inline-block text-[10px] font-mono font-semibold text-sky-700">
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
                        className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-[11px] font-bold transition-colors"
                      >
                        Assign
                      </button>
                    )}

                    {c.status === 'surveyorAssigned' && (
                      <button
                        onClick={() => onReviewAssessment(c)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold transition-colors"
                      >
                        Review
                      </button>
                    )}

                    {c.status === 'fieldAssessed' && (
                      <button
                        onClick={() => onApproveDbt(c)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        Approve DBT
                      </button>
                    )}

                    {pendingSecondSignOff && (
                      <button
                        onClick={() => onSecondSignOff(c)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        Sign-Off (2)
                      </button>
                    )}

                    {['intimated', 'surveyorAssigned', 'fieldAssessed'].includes(c.status) && (
                      <button
                        onClick={() => onRejectClaim(c)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Reject claim with administrative reason"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectClaim(c)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
        <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-sky-600" />
        <p className="text-base font-bold text-slate-700">No field surveyors found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
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
        <tbody className="divide-y divide-slate-100/80">
          {surveyors.map((s) => (
            <tr key={s.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{s.name}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.phone}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.qualification}</div>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                  {s.agency}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {s.assignedDistricts?.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                {s.activeCaseload}
              </td>
              <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-medium">
                {s.completedSurveys}
              </td>
              <td className="py-3.5 px-4 text-center font-mono">
                <span className="text-emerald-700 font-bold">{s.slaScore}%</span>
                <span className="text-[10px] text-slate-500 block">({s.avgSurveyDays}d avg)</span>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    s.status === 'available'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {s.status === 'available' ? 'Available' : 'Busy / On Field'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onAssignSurveyor && onAssignSurveyor(s)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs transition-colors"
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
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No insurance policies found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
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
        <tbody className="divide-y divide-slate-100/80">
          {policies.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelectPolicy && onSelectPolicy(p)}
              className="hover:bg-emerald-50/60 transition-colors cursor-pointer"
            >
              <td className="py-3.5 px-4">
                <div className="font-mono font-bold text-emerald-700">{p.policyNumber}</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">{p.schemeName}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {p.season} {p.year}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900">{p.farmerName}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {p.farmerPhone} • Aadhaar: <span className="text-emerald-700 font-semibold">{p.aadhaarMasked}</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{p.cropName}</span>
                  <span className="text-slate-500 font-normal">({p.vernacularCropName})</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Area: {p.landAreaAcres} Acres
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                {fmtINR(p.sumInsured)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">
                {fmtINR(p.farmerPremium)}
                <span className="block text-[10px] text-slate-500 font-normal">
                  ({p.farmerSharePercent}%)
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-sky-700 font-bold">
                {fmtINR(p.govtSubsidy)}
                <span className="block text-[10px] text-slate-500 font-normal">
                  (50:50 Center/State)
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="text-slate-800 font-medium truncate max-w-[150px]">
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
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 underline font-mono font-semibold"
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
        <Sliders className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No premium rates found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
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
        <tbody className="divide-y divide-slate-100/80">
          {rates.map((r) => (
            <tr key={r.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 font-medium">
                <div className="text-emerald-700 font-bold">{r.cropName}</div>
                <div className="text-slate-500 text-[11px]">{r.vernacularCropName}</div>
              </td>
              <td className="py-3.5 px-4 text-slate-700 font-medium">{r.category}</td>
              <td className="py-3.5 px-4">
                <span className="uppercase font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {r.season}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                {fmtINR(r.sumInsuredPerAcre)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">
                {r.farmerSharePercent}%
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-700 font-semibold">
                {r.totalActuarialRatePercent}%
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-sky-700 font-bold">
                {r.govtSubsidyPercent}%
                <span className="block text-[10px] text-slate-500 font-normal">
                  (C: {r.centralSharePercent}% / S: {r.stateSharePercent}%)
                </span>
              </td>
              <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                {r.cutoffDate}
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onEditRate && onEditRate(r)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs transition-colors"
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
        <Coins className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-600" />
        <p className="text-base font-bold text-slate-700">No DBT payouts queued or disbursed yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <th className="py-3 px-4">Claim # / Farmer</th>
            <th className="py-3 px-4">Bank Account & IFSC</th>
            <th className="py-3 px-4 text-right">Approved Payout</th>
            <th className="py-3 px-4">DBT UTR / Reference</th>
            <th className="py-3 px-4">Dual Sign-Off Status</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {dbtClaims.map((c) => {
            const requiresDual = c.dualSignOffRequired
            const pendingSecondSignOff = requiresDual && c.firstSignOff && !c.secondSignOff

            return (
              <tr
                key={c.id}
                onClick={() => onSelectClaim(c)}
                className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-emerald-700">{c.claimNumber}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{c.farmerName}</div>
                  <div className="text-[10px] text-slate-500">{c.cropName} • {c.village}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-mono text-slate-800 font-semibold">
                    A/C: XXXX-XXXX-{c.bankAccountLast4}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    IFSC: {c.ifsc || 'SBIN0001234'}
                  </div>
                  <div className="text-[10px] text-slate-500">{c.bankName}</div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                  {fmtINR(c.approvedAmount)}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-700">
                  {c.dbtTransactionId ? (
                    <span className="text-emerald-700 font-bold">{c.dbtTransactionId}</span>
                  ) : (
                    <span className="text-amber-700 font-semibold">QUEUED_FOR_BANK_FILE</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  {requiresDual ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>CRO Sign-Off: OK</span>
                      </div>
                      {c.secondSignOff ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Finance Dir: OK</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                          <Clock className="w-3 h-3" />
                          <span>Finance Dir: Pending</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
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
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors"
                    >
                      Authorize (2nd)
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectClaim(c)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors"
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t border-emerald-100/80 text-xs text-slate-600 bg-white/50 backdrop-blur-sm">
      <div>
        Showing <span className="font-mono font-bold text-slate-900">{start}</span> to{' '}
        <span className="font-mono font-bold text-slate-900">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-900">{total}</span> records
      </div>
      <div className="flex items-center gap-1 font-mono">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-emerald-50 transition"
        >
          &lt; Prev
        </button>
        <span className="px-2 py-1 text-slate-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-emerald-50 transition"
        >
          Next &gt;
        </button>
      </div>
    </div>
  )
}
