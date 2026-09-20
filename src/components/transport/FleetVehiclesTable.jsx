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
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
        ok
          ? 'text-teal-400 bg-teal-950/80 border-teal-600/30'
          : 'text-amber-400 bg-amber-950/80 border-amber-600/30'
      }`}
    >
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <Clock className="w-3 h-3 text-amber-400" /> Pending Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-700">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
            <XCircle className="w-3 h-3 text-rose-400" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Fleet Registration Directory (vehicles)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {vehicles.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: RC Book · Commercial Insurance · Fitness Certificate Verification
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-28">Vehicle ID</th>
              <th className="py-3 px-4 min-w-[180px]">Transporter</th>
              <th className="py-3 px-4 min-w-[190px]">Vehicle & Class</th>
              <th className="py-3 px-4 min-w-[150px]">Capacity & Rates</th>
              <th className="py-3 px-3 min-w-[210px]">Commercial Papers</th>
              <th className="py-3 px-3 min-w-[140px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading fleet registrations...</span>
                  </div>
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No fleet vehicles match the specified query or filters.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  onClick={() => onInspectVehicle(vehicle)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Vehicle ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{vehicle.id}</span>
                      <button
                        onClick={(e) => handleCopyId(vehicle.id, e)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
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
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{vehicle.transporterName}</div>
                    <div className="text-[11px] text-slate-400">
                      {vehicle.homeBase}, {vehicle.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {vehicle.transporterMobile}
                    </div>
                  </td>

                  {/* Vehicle & Class */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      <span>{vehicle.registrationNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium truncate max-w-[200px]">
                      {vehicle.vehicleClass}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {vehicle.tripsCompleted} trips · ★ {vehicle.rating}
                    </div>
                  </td>

                  {/* Capacity & Rates */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">
                      {vehicle.capacityTons} Tonnes
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      ₹{vehicle.perKmRate}/km
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-medium">
                      Base: ₹{vehicle.baseFare}
                    </div>
                  </td>

                  {/* Commercial Papers */}
                  <td className={`py-3 px-3 ${PAPERS_CELL_HEIGHT}`}>
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
                  <td className="py-3 px-3">
                    {getStatusBadge(vehicle.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectVehicle(vehicle)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        title="Inspect full fleet dossier and papers"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => onVerifyPapers(vehicle)}
                        className="p-1 text-xs text-teal-400 hover:text-white bg-teal-950/60 hover:bg-teal-600 border border-teal-600/40 rounded-md transition-colors"
                        title="Verify RC Book / Insurance / Fitness Certificate"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSuspend(vehicle)}
                        className={`p-1 text-xs rounded-md transition-colors ${
                          vehicle.status === 'suspended'
                            ? 'text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-600/40'
                            : 'text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40'
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
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {vehicles.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} vehicles
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
