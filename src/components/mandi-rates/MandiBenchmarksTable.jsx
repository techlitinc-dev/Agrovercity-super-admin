import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Edit3,
  Wifi,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

export function MandiBenchmarksTable({
  benchmarks = [],
  onOpenOverride,
  loading = false
}) {
  const [copiedId, setCopiedId] = useState(null);

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            Official Agmarknet / eNAM Mandi Price Benchmarks
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
            {benchmarks.length} Mandis Synced
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500 font-medium">
          Sync Interval: 2 Hours · Sanity Tolerance: ±15%
        </div>
      </div>

      {/* Benchmarks Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-4 w-28">Benchmark ID</th>
              <th className="py-3 px-4 min-w-[200px]">Mandi & Location</th>
              <th className="py-3 px-4 min-w-[190px]">Commodity & Variety</th>
              <th className="py-3 px-4 min-w-[190px]">Modal Benchmark Rate</th>
              <th className="py-3 px-3 min-w-[150px]">±15% Sanity Band</th>
              <th className="py-3 px-3 min-w-[120px]">Daily Arrivals</th>
              <th className="py-3 px-3 min-w-[120px]">Sync Status</th>
              <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold text-slate-700">Querying Agmarknet & eNAM Central Gateway...</span>
                  </div>
                </td>
              </tr>
            ) : benchmarks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="text-slate-700 font-bold">No Mandi Benchmarks Available</div>
                </td>
              </tr>
            ) : (
              benchmarks.map((b) => (
                <tr key={b.id} className="hover:bg-emerald-50/60 transition-colors">
                  {/* ID */}
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-900">{b.id}</span>
                    <div className="text-[10px] text-slate-500 truncate max-w-[100px]">
                      {b.sourceApi?.split(' ')[0] || 'Agmarknet'}
                    </div>
                  </td>

                  {/* Mandi & Location */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-bold text-slate-900">{b.mandiName}</div>
                      <div className="text-[11px] text-slate-500">
                        {b.district}, {b.state}
                      </div>
                    </div>
                  </td>

                  {/* Commodity & Variety */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-bold text-emerald-800">{b.commodity}</div>
                      <div className="text-[10px] text-slate-500 italic">{b.variety}</div>
                    </div>
                  </td>

                  {/* Modal Benchmark Price */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-base font-extrabold font-mono text-slate-900 flex items-baseline gap-1">
                        <span>₹{b.modalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-slate-500 font-normal">/Qtl</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Min: ₹{b.minPrice.toLocaleString('en-IN')} · Max: ₹{b.maxPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </td>

                  {/* Sanity Band (±15%) */}
                  <td className="py-3 px-3">
                    <div className="bg-emerald-50/40 px-2 py-1 rounded-md border border-emerald-200 font-mono text-[11px] text-slate-800 font-semibold">
                      ₹{b.sanityBand?.lowerLimit.toLocaleString('en-IN')} - ₹{b.sanityBand?.upperLimit.toLocaleString('en-IN')}
                    </div>
                  </td>

                  {/* Daily Arrivals */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-900">
                      {b.arrivalTonnage.toLocaleString()} MT
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Weighbridge Inflow</div>
                  </td>

                  {/* Sync Status */}
                  <td className="py-3 px-3">
                    {b.syncStatus === 'synced' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Synced ({b.latencyMs}ms)
                      </span>
                    ) : b.syncStatus === 'delayed' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" /> Latency Delay
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-300">
                        <Edit3 className="w-3 h-3 text-sky-600" /> Manual Override
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenOverride(b)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-lg transition-colors ml-auto shadow-xs"
                      title="Manually override price for broken government feed"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-700 group-hover:text-white" />
                      <span>Override Rate</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
