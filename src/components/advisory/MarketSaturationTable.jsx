import { useState } from 'react'
import { TrendingUp, AlertTriangle, CheckCircle2, Sliders, ArrowRight, ShieldCheck, Download, Search } from 'lucide-react'

export default function MarketSaturationTable({ cropCycles, onCalibrateSubstitution, onViewCycle, onExport }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [districtFilter, setDistrictFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const districts = Array.from(new Set(cropCycles.map(c => c.district))).filter(Boolean)

  const filtered = cropCycles.filter(cycle => {
    if (districtFilter !== 'all' && cycle.district !== districtFilter) return false
    if (statusFilter !== 'all' && cycle.status !== statusFilter) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const matchId = (cycle.id || '').toLowerCase().includes(q)
      const matchCrop = (cycle.crop || '').toLowerCase().includes(q)
      const matchDist = (cycle.district || '').toLowerCase().includes(q)
      const matchSub = (cycle.recommendedSubstitution || '').toLowerCase().includes(q)
      if (!matchId && !matchCrop && !matchDist && !matchSub) return false
    }
    return true
  })

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical_oversupply':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-300 px-2.5 py-0.5 text-xs font-bold text-rose-900">
            <AlertTriangle className="h-3 w-3" /> Critical Oversupply
          </span>
        )
      case 'moderate_risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-900">
            Moderate Risk
          </span>
        )
      case 'balanced':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="h-3 w-3" /> Balanced Demand
          </span>
        )
      case 'high_demand':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 border border-sky-300 px-2.5 py-0.5 text-xs font-bold text-sky-900">
            <TrendingUp className="h-3 w-3" /> High Demand / Deficit
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {risk}
          </span>
        )
    }
  }

  const getSaturationBar = (pct) => {
    const clamped = Math.min(Math.max(pct, 0), 150)
    let colorClass = 'bg-emerald-500'
    if (pct > 110) colorClass = 'bg-rose-500'
    else if (pct > 100) colorClass = 'bg-amber-500'

    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className={pct > 110 ? 'text-rose-700' : pct > 100 ? 'text-amber-700' : 'text-emerald-700'}>
            {pct}%
          </span>
          <span className="text-[10px] text-slate-500 font-normal">Cap: 100%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all ${colorClass}`}
            style={{ width: `${(clamped / 150) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top Advisory Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 text-xs text-emerald-950 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Regional Market Saturation & Crop Substitution Engine</h4>
            <p className="text-slate-600">
              Aggregates mandi inflow forecasts, remote sensing acreage, and cold storage capacity. Oversupply (&gt;110%) triggers automatic crop diversification advisories.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 shadow-2xs"
          >
            <Download className="h-4 w-4" /> Export Saturation Report
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 p-3.5 backdrop-blur-xl shadow-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search crop, district, season, or substitute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-emerald-200/80 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
          />
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        >
          <option value="all">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        >
          <option value="all">All Risk Statuses</option>
          <option value="flagged_oversupply">Flagged Oversupply (&gt;110%)</option>
          <option value="moderate_risk">Moderate Risk (100-110%)</option>
          <option value="balanced">Balanced (&lt;100%)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
        <table className="w-full min-w-4xl text-left text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="px-4 py-3.5">Cycle ID</th>
              <th className="px-4 py-3.5">District & Season</th>
              <th className="px-4 py-3.5">Crop / Commodity</th>
              <th className="px-4 py-3.5">Acreage vs Market Cap</th>
              <th className="px-4 py-3.5 min-w-36">Saturation Index</th>
              <th className="px-4 py-3.5">Price Risk Status</th>
              <th className="px-4 py-3.5">Recommended Substitution</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {filtered.map(cycle => (
              <tr key={cycle.id} className="transition-colors hover:bg-emerald-50/60">
                <td className="px-4 py-3.5 font-mono font-bold text-emerald-800">#{cycle.id}</td>
                <td className="px-4 py-3.5">
                  <p className="font-bold text-slate-900">{cycle.district}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{cycle.season}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-slate-900">{cycle.crop}</p>
                  <p className="text-[11px] text-slate-500">Exp. Yield: {cycle.expectedYieldPerAcre}</p>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs">
                  <p className="font-bold text-slate-800">{cycle.acreageSown.toLocaleString('en-IN')} ac</p>
                  <p className="text-[11px] text-slate-500 font-normal">Cap: {cycle.targetMarketCapacityAcres.toLocaleString('en-IN')} ac</p>
                </td>
                <td className="px-4 py-3.5">{getSaturationBar(cycle.saturationIndexPercent)}</td>
                <td className="px-4 py-3.5">{getRiskBadge(cycle.priceRiskStatus)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-950">
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{cycle.recommendedSubstitution}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onCalibrateSubstitution(cycle)}
                      className="flex items-center gap-1 rounded-lg border border-emerald-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition-colors shadow-2xs"
                      title="Calibrate substitution model"
                    >
                      <Sliders className="h-3.5 w-3.5" /> Calibrate
                    </button>
                    <button
                      onClick={() => onViewCycle(cycle)}
                      className="rounded-lg border border-emerald-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-semibold">
                  No crop cycles match the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
