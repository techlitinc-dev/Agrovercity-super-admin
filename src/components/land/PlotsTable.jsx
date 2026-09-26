import React from 'react';
import {
  MapPin,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { TablePaginationFooter } from '../equipment/TablePaginationFooter';

export function PlotsTable({
  plots = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectPlot,
  onVerify712,
  loading = false
}) {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              Farmland Plot Registry (land_plots)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
              {plots.length} Plots
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cadastral parcel directory with official 7/12 Khata numbers, survey boundary demarcations, soil classifications & irrigation profiles.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: 7/12 Land Record Matching & Cadastral Verification
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Plot ID</th>
              <th className="py-3.5 px-4 min-w-[160px]">Survey & Khata #</th>
              <th className="py-3.5 px-4 min-w-[170px]">Landowner</th>
              <th className="py-3.5 px-4 min-w-[170px]">Location (Village / Taluka)</th>
              <th className="py-3.5 px-4 min-w-[140px]">Acreage & Soil</th>
              <th className="py-3.5 px-4 min-w-[140px]">Irrigation Source</th>
              <th className="py-3.5 px-4 min-w-[130px]">7/12 Status</th>
              <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading farmland plot registry...</span>
                  </div>
                </td>
              </tr>
            ) : plots.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No farmland plots found matching the query.
                </td>
              </tr>
            ) : (
              plots.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {p.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-mono">S.No. {p.surveyNo}</div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Khata: {p.khataNo}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{p.ownerName}</div>
                    <span className="text-[10px] font-mono text-slate-500">{p.ownerPhone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{p.village}, {p.taluka}</div>
                    <span className="text-[10px] font-mono text-slate-500">{p.district} District</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold font-mono text-slate-900">{p.totalAcres} Acres</div>
                    <span className="text-[10px] text-slate-500">{p.soilType}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 font-medium">{p.waterSource}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {p.sevenTwelveVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 7/12 Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending Audit
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectPlot(p)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        title="Inspect Plot & Cadastral Boundaries"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>

                      {!p.sevenTwelveVerified && onVerify712 && (
                        <button
                          onClick={() => onVerify712(p)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold transition-all shadow-xs"
                        >
                          Verify 7/12
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
