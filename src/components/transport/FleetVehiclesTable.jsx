import React from 'react';
import {
  Eye,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  FileCheck2,
  Truck
} from 'lucide-react';

const PAPERS_CELL_HEIGHT = 'text-[11px]';

function PaperChip({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
        ok
          ? 'text-teal-800 bg-teal-100 border-teal-300/80'
          : 'text-amber-800 bg-amber-100 border-amber-300/80'
      }`}
    >
      {ok ? <CheckCircle2 className="w-3 h-3 text-teal-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
      <span>{label}</span>
    </span>
  );
}

export function FleetVehiclesTable({
  vehicles = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectVehicle,
  onVerifyPapers,
  onToggleSuspend,
  loading = false
}) {
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Fleet Registration Directory (vehicles)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {vehicles.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          Superadmin Controls: RC Book · Commercial Insurance · Fitness Certificate Verification
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Vehicle ID</th>
              <th className="py-3.5 px-4 min-w-[180px]">Transporter</th>
              <th className="py-3.5 px-4 min-w-[190px]">Vehicle & Class</th>
              <th className="py-3.5 px-4 min-w-[150px]">Capacity & Rates</th>
              <th className="py-3.5 px-3 min-w-[210px]">Commercial Papers</th>
              <th className="py-3.5 px-3 min-w-[140px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading fleet registrations...</span>
                  </div>
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No fleet vehicles match the specified query or filters.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => onInspectVehicle(vehicle)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Vehicle ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{vehicle.id}</span>
                      <button
                        onClick={(e) => handleCopyId(vehicle.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Copy Vehicle ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(vehicle.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Transporter */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{vehicle.transporterName}</div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {vehicle.homeBase}, {vehicle.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {vehicle.transporterMobile}
                    </div>
                  </td>

                  {/* Vehicle & Class */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{vehicle.registrationNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium truncate max-w-[200px]">
                      {vehicle.vehicleClass}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {vehicle.tripsCompleted} trips · ★ {vehicle.rating}
                    </div>
                  </td>

                  {/* Capacity & Rates */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {vehicle.capacityTons} Tonnes
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono font-medium">
                      ₹{vehicle.perKmRate}/km
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 font-bold">
                      Base: ₹{vehicle.baseFare}
                    </div>
                  </td>

                  {/* Commercial Papers */}
                  <td className={`py-3.5 px-3 ${PAPERS_CELL_HEIGHT}`}>
                    <div className="flex flex-wrap gap-1.5">
                      <PaperChip ok={vehicle.rcBook?.verified} label="RC Book" />
                      <PaperChip ok={vehicle.commercialInsurance?.verified} label="Insurance" />
                      <PaperChip ok={vehicle.fitnessCertificate?.verified} label="Fitness" />
                    </div>
                    {vehicle.commercialInsurance?.validTill && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">
                        Ins. valid till {vehicle.commercialInsurance.validTill}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(vehicle.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectVehicle(vehicle)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                        title="Inspect full fleet dossier and papers"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => onVerifyPapers(vehicle)}
                        className="p-1.5 text-xs text-teal-800 hover:text-teal-950 bg-teal-100 hover:bg-teal-200 border border-teal-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                        title="Verify RC Book / Insurance / Fitness Certificate"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSuspend(vehicle)}
                        className={`p-1.5 text-xs rounded-xl border transition-all active:scale-95 shadow-2xs ${
                          vehicle.status === 'suspended'
                            ? 'text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border-emerald-300'
                            : 'text-rose-800 hover:text-rose-950 bg-rose-100 hover:bg-rose-200 border-rose-300'
                        }`}
                        title={vehicle.status === 'suspended' ? 'Reinstate for Dispatch' : 'Remove from Dispatch'}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {vehicles.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} vehicles
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
