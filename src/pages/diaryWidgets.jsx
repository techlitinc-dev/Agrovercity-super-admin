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
  verified: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  audited: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  pending_review: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  flagged: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  disputed: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  rejected: 'bg-slate-700/60 text-slate-400',
  approved: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  under_review: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  recommended: 'bg-teal-500/15 text-teal-300 ring-1 ring-teal-500/30',
  high_risk: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30'
}

export function DiaryStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] || 'bg-slate-700 text-slate-300'
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function TypeBadge({ type }) {
  if (type === 'income') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
        <TrendingUp className="h-3 w-3 text-emerald-400" /> Income
      </span>
    )
  }
  if (type === 'farmActivity') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 px-2 py-0.5 text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
        <Activity className="h-3 w-3 text-indigo-400" /> Activity
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-300 ring-1 ring-rose-500/30">
      <TrendingDown className="h-3 w-3 text-rose-400" /> Expense
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-300 ring-1 ring-slate-700">
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
          ? 'bg-rose-500/15 text-rose-300 line-through ring-1 ring-rose-500/30'
          : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
      }`}
      title={isRevoked ? 'AgriCoins reward revoked due to duplicate submission' : 'AgriCoins credited for daily accounting'}
    >
      <Coins className="h-3 w-3 text-amber-400" />
      {isRevoked ? '-15' : `+${coins}`}
    </span>
  )
}

export function MetricCard({ label, value, tone = 'emerald', sub, icon: Icon }) {
  const tones = {
    emerald: 'text-emerald-400 ring-emerald-500/20',
    amber: 'text-amber-400 ring-amber-500/20',
    sky: 'text-sky-400 ring-sky-500/20',
    rose: 'text-rose-400 ring-rose-500/20'
  }
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ring-1 ${tones[tone].split(' ')[1]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && <Icon className={`h-4 w-4 ${tones[tone].split(' ')[0]}`} />}
      </div>
      <p className={`mt-1 text-2xl font-extrabold font-mono ${tones[tone].split(' ')[0]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

export function TabSwitch({ tab, setTab }) {
  const tabs = [
    { id: 'entries', label: 'Farm Diary Entries', countKey: 'entries' },
    { id: 'pnl', label: 'Crop P&L Statements', countKey: 'pnl' },
    { id: 'benchmarks', label: 'Cost Benchmarks & Break-Even', countKey: 'benchmarks' },
    { id: 'trends', label: 'Regional Expenditure & AgriCoins Audit', countKey: 'trends' }
  ]

  return (
    <div className="inline-flex flex-wrap rounded-lg border border-slate-800 bg-slate-900 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
            tab === t.id
              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-56">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500"
          placeholder="Search by ID, farmer name, phone, crop, voucher or district…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <select
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
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
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
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
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
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
        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
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
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('id')}>
              ID
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('farmerName')}>
              Farmer / Contact
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('type')}>
              Type & Category
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('cropName')}>
              Crop
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('amount')}>
              Amount (₹)
            </th>
            <th className="px-4 py-3 text-center">Reward</th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('status')}>
              Status
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('date')}>
              Date
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-slate-500">
                No farm diary entries match the filter criteria.
              </td>
            </tr>
          ) : (
            entries.map((item) => (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-slate-800/40 ${
                  item.flagged ? 'bg-rose-950/10' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-400">
                  #{item.id}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{item.farmerName}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {maskPhone(item.farmerPhone)} · {item.district}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <TypeBadge type={item.type} />
                    <CategoryBadge category={item.category} />
                  </div>
                  <div className="mt-1 text-xs text-slate-400 truncate max-w-xs" title={item.title}>
                    {item.title}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-200">
                  {item.cropName || '—'}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-100">
                  {item.type === 'income' ? (
                    <span className="text-emerald-400">+{fmtINR(item.amount)}</span>
                  ) : item.type === 'expense' ? (
                    <span className="text-slate-100">{fmtINR(item.amount)}</span>
                  ) : (
                    <span className="text-slate-500">Free / Activity</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <AgriCoinsPill coins={item.agriCoinsAwarded} status={item.coinsStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 items-start">
                    <DiaryStatusBadge status={item.status} />
                    {item.flagged && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold" title={item.flagReason}>
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {item.duplicateSimilarity > 0.8 ? 'Duplicate Submission' : 'Anomalous'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  {item.date}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                      title="View Details & Audit Trail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {item.status !== 'verified' && (
                      <button
                        onClick={() => onVerify(item)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                        title="Verify Entry"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {!item.flagged && (
                      <button
                        onClick={() => onFlag(item)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400"
                        title="Flag for Anomaly / Duplicate Investigation"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
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
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('id')}>
              ID
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('farmerName')}>
              Farmer
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('cropName')}>
              Crop / Season
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('totalExpenses')}>
              Total Expenses
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('grossRevenue')}>
              Gross Revenue
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('netProfit')}>
              Net P&L (₹)
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('roiPercent')}>
              ROI (%)
            </th>
            <th className="px-4 py-3 text-right cursor-pointer" onClick={() => onSort('breakEvenPricePerQuintal')}>
              Break-Even / qtl
            </th>
            <th className="px-4 py-3 text-center">Loan Underwrite</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {records.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-12 text-center text-slate-500">
                No Crop P&L statements found.
              </td>
            </tr>
          ) : (
            records.map((item) => {
              const isProfitable = item.netProfit >= 0
              return (
                <tr key={item.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-400">
                    #{item.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">{item.farmerName}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {item.district} · {maskPhone(item.farmerPhone)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-200">{item.cropName}</div>
                    <div className="text-xs text-slate-400">
                      {item.season} · <span className="font-mono text-slate-300">{item.areaAcres} acres</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {fmtINR(item.totalExpenses)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {fmtINR(item.grossRevenue)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    <span className={isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                      {isProfitable ? `+${fmtINR(item.netProfit)}` : `-${fmtINR(Math.abs(item.netProfit))}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs font-bold ${
                        item.roiPercent >= 50
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : item.roiPercent >= 0
                          ? 'bg-sky-500/15 text-sky-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {item.roiPercent > 0 ? `+${item.roiPercent}%` : `${item.roiPercent}%`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <div className="text-xs font-bold text-slate-200">
                      {fmtINR(item.breakEvenPricePerQuintal)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Market: {fmtINR(item.marketAvgRate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DiaryStatusBadge status={item.loanEligibility} />
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Score: {item.creditScore}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(item)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                        title="View Detailed P&L Breakdown"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onPdfView(item)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-sky-400"
                        title="Audit Generated PDF Statement"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      {item.status !== 'verified' && (
                        <button
                          onClick={() => onVerify(item)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
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
          <h3 className="text-sm font-bold text-slate-200">
            State-Level Crop Production Cost Baselines & Break-Even Calibration
          </h3>
          <p className="text-xs text-slate-400">
            Official ICAR and State Agricultural University baselines for cost verification and pre-sowing price calibration.
          </p>
        </div>
        <button
          onClick={onTestBreakEven}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
        >
          <Calculator className="h-4 w-4" /> Pre-Sowing Calculator
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Crop & Season</th>
              <th className="px-4 py-3">State / Jurisdiction</th>
              <th className="px-4 py-3 text-right">Baseline Cost / Acre</th>
              <th className="px-4 py-3 text-right">Seeds / Acre</th>
              <th className="px-4 py-3 text-right">Fertilizer / Acre</th>
              <th className="px-4 py-3 text-right">Labor / Acre</th>
              <th className="px-4 py-3 text-right">Target Yield</th>
              <th className="px-4 py-3 text-right">Break-Even Benchmark</th>
              <th className="px-4 py-3 text-right">MSP Benchmark</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {benchmarks.map((b) => (
              <tr key={`${b.crop}-${b.state}`} className="transition-colors hover:bg-slate-800/40">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-100">{b.crop}</div>
                  <div className="text-xs text-slate-500">{b.season}</div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-300">
                  {b.state}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                  {fmtINR(b.baselineCostPerAcre)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">
                  {fmtINR(b.seedsCost)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">
                  {fmtINR(b.fertilizerCost)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-400">
                  {fmtINR(b.laborCost)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-200">
                  {b.targetYieldQuintalsPerAcre} qtl/acre
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-sky-400">
                  {fmtINR(b.benchmarkBreakEvenPrice)} / qtl
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-300">
                  {fmtINR(b.mspRate)} / qtl
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onCalibrate(b)}
                    className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-emerald-400"
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
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/40">
              <Coins className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AgriCoins Daily Accounting Reward Ledger & Integrity Audit
              </h3>
              <p className="text-xs text-slate-400">
                Disbursement integrity: +15 coins awarded per valid farm diary entry. Strict daily cap of 3 paid entries (45 coins/day) enforced.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-slate-400 uppercase text-[10px]">Total Coins Disbursed</div>
              <div className="text-lg font-extrabold text-amber-400">
                {agriCoins?.totalCoinsDisbursed?.toLocaleString('en-IN') || '632,550'} 🪙
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-slate-400 uppercase text-[10px]">Audit Integrity Score</div>
              <div className="text-lg font-extrabold text-emerald-400">
                {agriCoins?.auditIntegrityScore || 99.7}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-slate-400 uppercase text-[10px]">Reversals Processed</div>
              <div className="text-lg font-extrabold text-rose-400">
                {agriCoins?.reversalsProcessed || 14}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Expenditure Breakdown Cards */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Regional Farm Expenditure Trends by District & Commodity
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <div
              key={d.district}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-slate-100 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-400" /> {d.district}
                  </h5>
                  <p className="text-xs text-slate-400">
                    {d.totalFarmers.toLocaleString()} active bookkeeping farmers
                  </p>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-emerald-300">
                  {d.diaryEntriesCount} logs
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Expenditure</span>
                  <span className="font-mono font-bold text-slate-200">
                    {fmtINR(d.totalExpenditure)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Cost / Acre</span>
                  <span className="font-mono text-slate-300">{fmtINR(d.avgCostPerAcre)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dominant Expense</span>
                  <span className="font-semibold text-amber-400">{d.topExpenseCategory}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-500">Active Crops</span>
                  <span className="text-slate-300 text-[11px]">
                    {d.activeCrops.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statewide Expenditure Distribution Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-emerald-400" /> State-Wide Input Expenditure Allocation
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Aggregated across 42,000+ farmer bookkeeping records. Labor & fertilizing comprise 56% of statewide input costs.
        </p>

        {/* Multi-segment progress bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="bg-emerald-500" style={{ width: '32%' }} title="Labor: 32%" />
          <div className="bg-sky-500" style={{ width: '24%' }} title="Fertilizers: 24%" />
          <div className="bg-amber-500" style={{ width: '18%' }} title="Seeds: 18%" />
          <div className="bg-indigo-500" style={{ width: '14%' }} title="Pesticides: 14%" />
          <div className="bg-purple-500" style={{ width: '8%' }} title="Machinery: 8%" />
          <div className="bg-teal-500" style={{ width: '4%' }} title="Irrigation: 4%" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          {categories.map((c, i) => {
            const colors = [
              'text-emerald-400',
              'text-sky-400',
              'text-amber-400',
              'text-indigo-400',
              'text-purple-400',
              'text-teal-400'
            ]
            return (
              <div key={c.category} className="rounded-lg border border-slate-800/80 p-2.5">
                <div className={`font-mono font-bold ${colors[i % colors.length]}`}>
                  {c.percentage}%
                </div>
                <div className="font-medium text-slate-200 text-[11px] truncate" title={c.category}>
                  {c.category}
                </div>
                <div className="text-[10px] font-mono text-slate-500">{fmtINR(c.totalAmount)}</div>
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
      <div>
        Showing <span className="font-mono font-bold text-slate-200">{start}</span> to{' '}
        <span className="font-mono font-bold text-slate-200">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`h-8 w-8 rounded-lg font-mono text-xs font-bold transition ${
                page === p
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
