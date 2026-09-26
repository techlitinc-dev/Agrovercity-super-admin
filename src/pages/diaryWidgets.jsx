import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Coins,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  CheckCircle,
  Flag,
  Trash2,
  Eye,
  Calculator,
  MapPin,
  Building2,
  PieChart
} from 'lucide-react'

export const fmtINR = (n) => {
  const num = Number(n || 0)
  return `₹${num.toLocaleString('en-IN')}`
}

export const maskPhone = (phone) => {
  if (!phone) return '—'
  return String(phone).replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')
}

export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return 'XXXX-XXXX-••••'
  return aadhaar
}

export const DIARY_STATUSES = ['all', 'verified', 'pending_review', 'flagged', 'disputed']
export const PNL_STATUSES = ['all', 'verified', 'audited', 'pending_review', 'flagged']
export const ENTRY_TYPES = ['all', 'expense', 'income', 'farmActivity']
export const ENTRY_CATEGORIES = [
  'all',
  'seeds',
  'fertilizers',
  'pesticides',
  'labor',
  'irrigation',
  'machinery',
  'sales',
  'subsidy'
]

const STATUS_LABELS = {
  all: 'All Statuses',
  verified: 'Verified',
  pending_review: 'Pending Review',
  flagged: 'Flagged',
  disputed: 'Disputed',
  rejected: 'Rejected',
  audited: 'Audited',
  approved: 'Approved',
  under_review: 'Under Review',
  recommended: 'Recommended',
  high_risk: 'High Risk'
}

const STATUS_STYLES = {
  verified: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
  audited: 'bg-sky-100 text-sky-900 border border-sky-300 font-bold',
  pending_review: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  flagged: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold',
  disputed: 'bg-orange-100 text-orange-900 border border-orange-300 font-bold',
  rejected: 'bg-slate-100 text-slate-700 border border-slate-300',
  approved: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
  under_review: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
  recommended: 'bg-teal-100 text-teal-900 border border-teal-300 font-bold',
  high_risk: 'bg-rose-100 text-rose-900 border border-rose-300 font-bold'
}

export function DiaryStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border border-slate-300'
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function TypeBadge({ type }) {
  if (type === 'income') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-900 border border-emerald-300">
        <TrendingUp className="h-3 w-3 text-emerald-700" /> Income
      </span>
    )
  }
  if (type === 'farmActivity') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-900 border border-indigo-300">
        <Activity className="h-3 w-3 text-indigo-700" /> Activity
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-900 border border-rose-300">
      <TrendingDown className="h-3 w-3 text-rose-700" /> Expense
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
      {category}
    </span>
  )
}

export function AgriCoinsPill({ coins = 15, status = 'disbursed' }) {
  const isRevoked = status === 'revoked'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono font-bold ${
        isRevoked
          ? 'bg-rose-50 text-rose-700 line-through border border-rose-200'
          : 'bg-amber-50 text-amber-800 border border-amber-300'
      }`}
      title={isRevoked ? 'AgriCoins reward revoked due to duplicate submission' : 'AgriCoins credited for daily accounting'}
    >
      <Coins className="h-3 w-3 text-amber-600" />
      {isRevoked ? '-15' : `+${coins}`}
    </span>
  )
}

export function MetricCard({ label, value, tone = 'emerald', sub, icon: Icon }) {
  const tones = {
    emerald: 'text-emerald-900',
    amber: 'text-amber-900',
    sky: 'text-sky-900',
    rose: 'text-rose-900'
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-emerald-700" />}
      </div>
      <p className={`mt-1 text-2xl font-extrabold font-mono ${tones[tone] || 'text-slate-900'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500 font-medium">{sub}</p>}
    </div>
  )
}

export function TabSwitch({ tab, setTab }) {
  const tabs = [
    { id: 'entries', label: 'Farm Diary Entries', countKey: 'entries' },
    { id: 'pnl', label: 'Crop P&L Statements', countKey: 'pnl' },
    { id: 'benchmarks', label: 'Cost Benchmarks & Break-Even', countKey: 'benchmarks' },
    { id: 'trends', label: 'Regional Expenditure & AgriCoins Audit', countKey: 'trends' },
    { id: 'audit_trail', label: 'Audit Trail', countKey: 'audit' }
  ]

  return (
    <div className="inline-flex flex-wrap rounded-xl border border-emerald-200/80 bg-white/90 p-1 shadow-2xs backdrop-blur-md">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
            tab === t.id
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-950'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function FiltersBar({
  q,
  setQ,
  status,
  setStatus,
  statuses,
  secondaryFilter,
  setSecondaryFilter,
  secondaryOptions,
  secondaryLabel,
  dateRange,
  setDateRange,
  onExport,
  children
}) {
  const ranges = [
    ['all', 'All Time'],
    ['7', 'Last 7 Days'],
    ['30', 'Last 30 Days'],
    ['90', 'Last 90 Days']
  ]

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-3.5 flex flex-wrap items-center gap-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="relative flex-1 min-w-56">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-emerald-200/80 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans"
          placeholder="Search by ID, farmer name, phone, crop, voucher or district…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <select
        className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s] || s}
          </option>
        ))}
      </select>

      {secondaryOptions && setSecondaryFilter && (
        <select
          className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
          value={secondaryFilter}
          onChange={(e) => setSecondaryFilter(e.target.value)}
        >
          <option value="all">{secondaryLabel || 'All Categories'}</option>
          {secondaryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.toUpperCase()}
            </option>
          ))}
        </select>
      )}

      <select
        className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        {ranges.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>

      {children}

      <button
        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95 ml-auto"
        onClick={onExport}
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
    </div>
  )
}

export function DiaryEntriesTable({
  entries,
  sort,
  onSort,
  onView,
  onVerify,
  onFlag,
  onDelete
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('id')}>
              ID
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('farmerName')}>
              Farmer / Contact
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('type')}>
              Type & Category
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('cropName')}>
              Crop
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('amount')}>
              Amount (₹)
            </th>
            <th className="px-4 py-3.5 text-center">Reward</th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('status')}>
              Status
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('date')}>
              Date
            </th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-slate-500 font-semibold">
                No farm diary entries match the filter criteria.
              </td>
            </tr>
          ) : (
            entries.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-emerald-50/60 ${
                  item.flagged ? 'bg-rose-50/50' : ''
                }`}
              >
                <td className="px-4 py-3.5 font-mono text-xs font-bold text-emerald-800">
                  #{item.id}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{item.farmerName}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {maskPhone(item.farmerPhone)} · {item.district}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <TypeBadge type={item.type} />
                    <CategoryBadge category={item.category} />
                  </div>
                  <div className="mt-1 text-xs text-slate-600 truncate max-w-xs font-medium" title={item.title}>
                    {item.title}
                  </div>
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-800">
                  {item.cropName || '—'}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold">
                  {item.type === 'income' ? (
                    <span className="text-emerald-700">+{fmtINR(item.amount)}</span>
                  ) : item.type === 'expense' ? (
                    <span className="text-slate-900">{fmtINR(item.amount)}</span>
                  ) : (
                    <span className="text-slate-500 font-medium">Free / Activity</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <AgriCoinsPill coins={item.agriCoinsAwarded} status={item.coinsStatus} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-1 items-start">
                    <DiaryStatusBadge status={item.status} />
                    {item.flagged && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold" title={item.flagReason}>
                        <AlertTriangle className="h-3 w-3 shrink-0 text-rose-600" />
                        {item.duplicateSimilarity > 0.8 ? 'Duplicate Submission' : 'Anomalous'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">
                  {item.date}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs border border-emerald-100"
                      title="View Details & Audit Trail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {item.status !== 'verified' && (
                      <button
                        onClick={() => onVerify(item)}
                        className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950 transition-colors shadow-2xs border border-emerald-200"
                        title="Verify Entry"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {!item.flagged && (
                      <button
                        onClick={() => onFlag(item)}
                        className="rounded-lg p-1.5 text-amber-700 hover:bg-amber-100 hover:text-amber-950 transition-colors shadow-2xs border border-amber-200"
                        title="Flag for Anomaly / Duplicate Investigation"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-lg p-1.5 text-rose-700 hover:bg-rose-100 hover:text-rose-950 transition-colors shadow-2xs border border-rose-200"
                      title="Soft-Delete & Revoke 15 AgriCoins"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function CropPnlTable({
  records,
  sort,
  onSort,
  onView,
  onPdfView,
  onVerify
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('id')}>
              ID
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('farmerName')}>
              Farmer
            </th>
            <th className="px-4 py-3.5 cursor-pointer" onClick={() => onSort('cropName')}>
              Crop / Season
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('totalExpenses')}>
              Total Expenses
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('grossRevenue')}>
              Gross Revenue
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('netProfit')}>
              Net P&L (₹)
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('roiPercent')}>
              ROI (%)
            </th>
            <th className="px-4 py-3.5 text-right cursor-pointer" onClick={() => onSort('breakEvenPricePerQuintal')}>
              Break-Even / qtl
            </th>
            <th className="px-4 py-3.5 text-center">Loan Underwrite</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/60">
          {records.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-12 text-center text-slate-500 font-semibold">
                No Crop P&L statements found.
              </td>
            </tr>
          ) : (
            records.map((item) => {
              const isProfitable = item.netProfit >= 0
              return (
                <tr key={item.id} className="transition-colors hover:bg-emerald-50/60">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-emerald-800">
                    #{item.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.farmerName}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {item.district} · {maskPhone(item.farmerPhone)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.cropName}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {item.season} · <span className="font-mono text-emerald-900 font-semibold">{item.areaAcres} acres</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-700">
                    {fmtINR(item.totalExpenses)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">
                    {fmtINR(item.grossRevenue)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold">
                    <span className={isProfitable ? 'text-emerald-700' : 'text-rose-700'}>
                      {isProfitable ? `+${fmtINR(item.netProfit)}` : `-${fmtINR(Math.abs(item.netProfit))}`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold border ${
                        item.roiPercent >= 50
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.roiPercent >= 0
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {item.roiPercent > 0 ? `+${item.roiPercent}%` : `${item.roiPercent}%`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    <div className="text-xs font-bold text-slate-900">
                      {fmtINR(item.breakEvenPricePerQuintal)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Market: {fmtINR(item.marketAvgRate)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <DiaryStatusBadge status={item.loanEligibility} />
                    <div className="text-[10px] font-mono text-slate-500 font-semibold mt-0.5">
                      Score: {item.creditScore}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(item)}
                        className="rounded-lg p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs border border-emerald-100"
                        title="View Detailed P&L Breakdown"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onPdfView(item)}
                        className="rounded-lg p-1.5 text-sky-700 hover:bg-sky-50 hover:text-sky-950 transition-colors shadow-2xs border border-sky-200"
                        title="Audit Generated PDF Statement"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      {item.status !== 'verified' && (
                        <button
                          onClick={() => onVerify(item)}
                          className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950 transition-colors shadow-2xs border border-emerald-200"
                          title="Verify Statement"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export function BenchmarksTable({ benchmarks, onCalibrate, onTestBreakEven }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            State-Level Crop Production Cost Baselines & Break-Even Calibration
          </h3>
          <p className="text-xs text-slate-500">
            Official ICAR and State Agricultural University baselines for cost verification and pre-sowing price calibration.
          </p>
        </div>
        <button
          onClick={onTestBreakEven}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 shadow-2xs transition-colors"
        >
          <Calculator className="h-4 w-4 text-emerald-600" /> Pre-Sowing Calculator
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="px-4 py-3.5">Crop & Season</th>
              <th className="px-4 py-3.5">State / Jurisdiction</th>
              <th className="px-4 py-3.5 text-right">Baseline Cost / Acre</th>
              <th className="px-4 py-3.5 text-right">Seeds / Acre</th>
              <th className="px-4 py-3.5 text-right">Fertilizer / Acre</th>
              <th className="px-4 py-3.5 text-right">Labor / Acre</th>
              <th className="px-4 py-3.5 text-right">Target Yield</th>
              <th className="px-4 py-3.5 text-right">Break-Even Benchmark</th>
              <th className="px-4 py-3.5 text-right">MSP Benchmark</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {benchmarks.map((b) => (
              <tr key={`${b.crop}-${b.state}`} className="transition-colors hover:bg-emerald-50/60">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{b.crop}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{b.season}</div>
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-800">
                  {b.state}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-800">
                  {fmtINR(b.baselineCostPerAcre)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-600 font-medium">
                  {fmtINR(b.seedsCost)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-600 font-medium">
                  {fmtINR(b.fertilizerCost)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-600 font-medium">
                  {fmtINR(b.laborCost)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800">
                  {b.targetYieldQuintalsPerAcre} qtl/acre
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-sky-700">
                  {fmtINR(b.benchmarkBreakEvenPrice)} / qtl
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800">
                  {fmtINR(b.mspRate)} / qtl
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => onCalibrate(b)}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs"
                  >
                    <Sliders className="h-3 w-3" /> Calibrate
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

export function RegionalTrendsView({ trends, agriCoins, onTestCalculator }) {
  const districts = trends?.districts || []
  const categories = trends?.categoryDistribution || []

  return (
    <div className="space-y-6">
      {/* AgriCoins Audit Integrity Ledger Banner */}
      <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
              <Coins className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AgriCoins Daily Accounting Reward Ledger & Integrity Audit
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Disbursement integrity: +15 coins awarded per valid farm diary entry. Strict daily cap of 3 paid entries (45 coins/day) enforced.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-500 uppercase text-[10px] font-bold">Total Coins Disbursed</div>
              <div className="text-lg font-bold text-amber-800">
                {agriCoins?.totalCoinsDisbursed?.toLocaleString('en-IN') || '632,550'} 🪙
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <div className="text-slate-500 uppercase text-[10px] font-bold">Audit Integrity Score</div>
              <div className="text-lg font-bold text-emerald-800">
                {agriCoins?.auditIntegrityScore || 99.7}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <div className="text-slate-500 uppercase text-[10px] font-bold">Reversals Processed</div>
              <div className="text-lg font-bold text-rose-700">
                {agriCoins?.reversalsProcessed || 14}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Expenditure Breakdown Cards */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
          Regional Farm Expenditure Trends by District & Commodity
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <div
              key={d.district}
              className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 transition hover:border-emerald-300 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" /> {d.district}
                  </h5>
                  <p className="text-xs text-slate-500 font-medium">
                    {d.totalFarmers.toLocaleString()} active bookkeeping farmers
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800">
                  {d.diaryEntriesCount} logs
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Expenditure</span>
                  <span className="font-mono font-bold text-slate-900">
                    {fmtINR(d.totalExpenditure)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Cost / Acre</span>
                  <span className="font-mono text-slate-700 font-semibold">{fmtINR(d.avgCostPerAcre)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dominant Expense</span>
                  <span className="font-bold text-amber-800">{d.topExpenseCategory}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-100">
                  <span className="text-slate-500">Active Crops</span>
                  <span className="text-slate-700 font-medium text-[11px]">
                    {d.activeCrops.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statewide Expenditure Distribution Bar */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-emerald-600" /> State-Wide Input Expenditure Allocation
        </h4>
        <p className="text-xs text-slate-500 mb-4 font-medium">
          Aggregated across 42,000+ farmer bookkeeping records. Labor & fertilizing comprise 56% of statewide input costs.
        </p>

        {/* Multi-segment progress bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
          <div className="bg-emerald-600" style={{ width: '32%' }} title="Labor: 32%" />
          <div className="bg-sky-500" style={{ width: '24%' }} title="Fertilizers: 24%" />
          <div className="bg-amber-500" style={{ width: '18%' }} title="Seeds: 18%" />
          <div className="bg-indigo-500" style={{ width: '14%' }} title="Pesticides: 14%" />
          <div className="bg-purple-500" style={{ width: '8%' }} title="Machinery: 8%" />
          <div className="bg-teal-500" style={{ width: '4%' }} title="Irrigation: 4%" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          {categories.map((c, i) => {
            const colors = [
              'text-emerald-800',
              'text-sky-800',
              'text-amber-800',
              'text-indigo-800',
              'text-purple-800',
              'text-teal-800'
            ]
            return (
              <div key={c.category} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-2.5 shadow-2xs">
                <div className={`font-mono font-bold text-sm ${colors[i % colors.length]}`}>
                  {c.percentage}%
                </div>
                <div className="font-bold text-slate-800 text-[11px] truncate mt-0.5" title={c.category}>
                  {c.category}
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-medium">{fmtINR(c.totalAmount)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-100/80 pt-4 text-xs text-slate-600">
      <div>
        Showing <span className="font-mono font-bold text-slate-900">{start}</span> to{' '}
        <span className="font-mono font-bold text-slate-900">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-900">{total}</span> records
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200/80 bg-white text-slate-700 hover:bg-emerald-50 shadow-2xs disabled:opacity-30 font-semibold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`h-8 w-8 rounded-xl font-mono text-xs font-bold transition-all ${
                page === p
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-emerald-200/70 bg-white text-slate-700 hover:bg-emerald-50 shadow-2xs'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200/80 bg-white text-slate-700 hover:bg-emerald-50 shadow-2xs disabled:opacity-30 font-semibold transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
