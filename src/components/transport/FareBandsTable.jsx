import React from 'react';
import {
  Tag,
  Edit3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';

export function FareBandsTable({
  fareBands = [],
  onEditFareBand,
  loading = false
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Band ID & Corridor</th>
              <th className="py-3 px-4">District Hub</th>
              <th className="py-3 px-4">Vehicle Class & Spec</th>
              <th className="py-3 px-4 text-right">Base Fare (INR)</th>
              <th className="py-3 px-4 text-right">Per-Km Tariff</th>
              <th className="py-3 px-4 text-right">Waiting (₹/hr)</th>
              <th className="py-3 px-4 text-right">Night Surcharge</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading district tariff bands...</span>
                  </div>
                </td>
              </tr>
            ) : fareBands.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Tag className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Pricing Bands Found</span>
                    <span className="text-xs text-slate-400">No tariff structures match current criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              fareBands.map((band) => (
                <tr key={band.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded inline-block text-[11px]">
                      {band.id}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{band.corridor}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Min Dist: {band.minDistanceKm} km
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{band.district}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900">{band.vehicleClass}</div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold inline-block mt-0.5">
                      Active Dispatch Tariff
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="font-mono font-black text-sm text-slate-900">
                      {fmtRupees(band.baseFare)}
                    </div>
                    <div className="text-[10px] text-slate-400">Initial Booking</div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="font-mono font-black text-sm text-emerald-800">
                      ₹{band.perKmRate}<span className="text-xs font-normal text-slate-500">/km</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    <div>₹{band.waitingChargePerHour}/hr</div>
                    <div className="text-[10px] text-slate-400">Detention</div>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    <div>+{band.nightSurchargePercent}%</div>
                    <div className="text-[10px] font-normal text-slate-400">10PM - 6AM</div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEditFareBand && onEditFareBand(band)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs ml-auto"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Tariff</span>
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
