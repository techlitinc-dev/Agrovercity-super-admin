import React from 'react';
import {
  Eye,
  FileCheck2,
  XCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Tractor,
  IndianRupee
} from 'lucide-react';

function OwnerChip({ ownerType }) {
  return ownerType === 'fpo' ? (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-sky-300 bg-sky-950/80 border border-sky-600/30">
      FPO Pool
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-violet-300 bg-violet-950/80 border border-violet-600/30">
      Private
    </span>
  );
}

function PricingFlag({ index }) {
  if (index > 120) {
    return (
      <span className="text-[10px] font-mono font-semibold text-rose-400">
        ₹ Pricing {index}% of district band — flagged
      </span>
    );
  }
  if (index > 105) {
    return (
      <span className="text-[10px] font-mono text-amber-400">
        ₹ Pricing {index}% of district band
      </span>
    );
  }
  return (
    <span className="text-[10px] font-mono text-emerald-400">
      ₹ Pricing fair ({index}%)
    </span>
  );
}

export function MachinesTable({
  machines = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectMachine,
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

  const paperChips = (m) => (
    <div className="flex flex-wrap gap-1.5">
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${m.rcDocument?.verified ? 'text-teal-400 bg-teal-950/80 border-teal-600/30' : 'text-amber-400 bg-amber-950/80 border-amber-600/30'}`}>
        RC {m.rcDocument?.verified ? 'OK' : 'PEND'}
      </span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${m.insuranceDocument?.verified ? 'text-teal-400 bg-teal-950/80 border-teal-600/30' : 'text-amber-400 bg-amber-950/80 border-amber-600/30'}`}>
        INS {m.insuranceDocument?.verified ? 'OK' : 'PEND'}
      </span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${m.operatorLicense?.verified ? 'text-teal-400 bg-teal-950/80 border-teal-600/30' : 'text-amber-400 bg-amber-950/80 border-amber-600/30'}`}>
        LIC {m.operatorLicense?.verified ? 'OK' : 'PEND'}
      </span>
    </div>
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Machinery Inventory Directory (equipment)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {machines.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: RC · Insurance · Operator Licensing · Pricing Fairness Watch
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-24">Machine ID</th>
              <th className="py-3 px-4 min-w-[170px]">Owner</th>
              <th className="py-3 px-4 min-w-[190px]">Machine & Type</th>
              <th className="py-3 px-4 min-w-[150px]">Rates & Utilization</th>
              <th className="py-3 px-3 min-w-[190px]">Papers & Licensing</th>
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
                    <span>Loading machinery inventory...</span>
                  </div>
                </td>
              </tr>
            ) : machines.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No machines match the specified query or filters.
                </td>
              </tr>
            ) : (
              machines.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onInspectMachine(m)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Machine ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{m.id}</span>
                      <button
                        onClick={(e) => handleCopyId(m.id, e)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
                        title="Copy Machine ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white truncate max-w-[120px]">{m.ownerName}</span>
                      <OwnerChip ownerType={m.ownerType} />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {m.village}, {m.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {m.ownerMobile}
                    </div>
                  </td>

                  {/* Machine & Type */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Tractor className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[170px]">{m.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium capitalize">
                      {m.type.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {m.totalBookings} bookings · ★ {m.rating}
                    </div>
                  </td>

                  {/* Rates & Utilization */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {m.hourlyRate}/hr
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {m.perAcreRate ? `₹${m.perAcreRate}/acre` : 'No per-acre rate'}
                    </div>
                    <div className="text-[10px] font-mono text-sky-400 font-medium">
                      Utilization {m.utilizationPercent}%
                    </div>
                  </td>

                  {/* Papers & Licensing */}
                  <td className="py-3 px-3">
                    {paperChips(m)}
                    <div className="mt-1.5">
                      <PricingFlag index={m.pricingIndexPercent} />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(m.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectMachine(m)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        title="Inspect full machine dossier and papers"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => onVerifyPapers(m)}
                        className="p-1 text-xs text-teal-400 hover:text-white bg-teal-950/60 hover:bg-teal-600 border border-teal-600/40 rounded-md transition-colors"
                        title="Verify RC / Insurance / Operator License"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSuspend(m)}
                        className={`p-1 text-xs rounded-md transition-colors ${
                          m.status === 'suspended'
                            ? 'text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-600/40'
                            : 'text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40'
                        }`}
                        title={m.status === 'suspended' ? 'Reinstate for Booking' : 'Remove from Booking Pool'}
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
          Showing {machines.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} machines
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
