import React from 'react';
import {
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  TrendingUp,
  Scale,
  Clock,
  Sparkles,
  Tractor
} from 'lucide-react';

export function PricingBenchmarksTable({
  benchmarks = [],
  onEditBenchmark,
  loading = false
}) {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              Pricing Fairness & District Yantra Benchmarks
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
              {benchmarks.length} Bands
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            APMC & Agricultural Mechanization Council baseline tariffs. Automatic anti-gouging flags trigger when private owner rates exceed benchmark cap by &gt;20%.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> FPO Fairness Protected
          </span>
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Band ID</th>
              <th className="py-3.5 px-4 min-w-[140px]">District</th>
              <th className="py-3.5 px-4 min-w-[200px]">Machinery Class</th>
              <th className="py-3.5 px-4 min-w-[140px]">District Cap (₹/hr)</th>
              <th className="py-3.5 px-4 min-w-[140px]">FPO Pool Avg</th>
              <th className="py-3.5 px-4 min-w-[140px]">Private Pool Avg</th>
              <th className="py-3.5 px-4 min-w-[120px]">Allowed Variance</th>
              <th className="py-3.5 px-4 min-w-[140px]">Compliance</th>
              <th className="py-3.5 px-4 text-right min-w-[130px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading district rate benchmarks...</span>
                  </div>
                </td>
              </tr>
            ) : benchmarks.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No pricing benchmarks found.
                </td>
              </tr>
            ) : (
              benchmarks.map((b) => {
                const isFlagged = b.status === 'flagged_variance';
                const variance = Math.round(
                  ((b.privatePoolAvgHourly - b.benchmarkCapHourly) / b.benchmarkCapHourly) * 100
                );

                return (
                  <tr key={b.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {b.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900">{b.district}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {b.activeCount || 0} machines active
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Tractor className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b.machineryClass}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-mono">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-sm font-black font-mono text-emerald-800 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {b.benchmarkCapHourly.toLocaleString('en-IN')}/hr
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sky-700 flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {b.fpoPoolAvgHourly.toLocaleString('en-IN')}/hr
                      </span>
                      <span className="text-[10px] text-sky-600 block">Subsidized / Fair</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                        <IndianRupee className="w-3 h-3 text-slate-500" />
                        <span>{b.privatePoolAvgHourly.toLocaleString('en-IN')}/hr</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold ${
                          variance > (b.maxVariancePercent || 20)
                            ? 'text-rose-600'
                            : variance > 0
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {variance > 0 ? `+${variance}% vs cap` : `${variance}% vs cap`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">
                      +{b.maxVariancePercent || 20}% max
                    </td>

                    <td className="py-3.5 px-4">
                      {isFlagged ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Variance Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Fair Tariff
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onEditBenchmark(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition-all text-xs active:scale-95 shadow-xs"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Adjust Cap</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
