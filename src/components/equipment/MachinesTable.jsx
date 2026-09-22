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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200">
      FPO Pool
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
      Private
    </span>
  );
}

function PricingFlag({ index }) {
  if (index > 120) {
    return (
      <span className="text-[10px] font-mono font-bold text-rose-600">
        ₹ Pricing {index}% of district band — flagged
      </span>
    );
  }
  if (index > 105) {
    return (
      <span className="text-[10px] font-mono font-bold text-amber-600">
        ₹ Pricing {index}% of district band
      </span>
    );
  }
  return (
    <span className="text-[10px] font-mono font-bold text-emerald-700">
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const paperChips = (m) => (
    <div className="flex flex-wrap gap-1.5">
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${m.rcDocument?.verified ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
        RC {m.rcDocument?.verified ? 'OK' : 'PEND'}
      </span>
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${m.insuranceDocument?.verified ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
        INS {m.insuranceDocument?.verified ? 'OK' : 'PEND'}
      </span>
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${m.operatorLicense?.verified ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
        LIC {m.operatorLicense?.verified ? 'OK' : 'PEND'}
      </span>
    </div>
  );

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Machinery Inventory Directory (equipment)</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
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
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-24">Machine ID</th>
              <th className="py-3.5 px-4 min-w-[170px]">Owner</th>
              <th className="py-3.5 px-4 min-w-[190px]">Machine & Type</th>
              <th className="py-3.5 px-4 min-w-[150px]">Rates & Utilization</th>
              <th className="py-3.5 px-4 min-w-[190px]">Papers & Licensing</th>
              <th className="py-3.5 px-4 min-w-[140px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
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
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Machine ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{m.id}</span>
                      <button
                        onClick={(e) => handleCopyId(m.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
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
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 truncate max-w-[120px]">{m.ownerName}</span>
                      <OwnerChip ownerType={m.ownerType} />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {m.village}, {m.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {m.ownerMobile}
                    </div>
                  </td>

                  {/* Machine & Type */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Tractor className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[170px]">{m.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium capitalize">
                      {m.type.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {m.totalBookings} bookings · ★ {m.rating}
                    </div>
                  </td>

                  {/* Rates & Utilization */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-slate-500" />
                      {m.hourlyRate}/hr
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {m.perAcreRate ? `₹${m.perAcreRate}/acre` : 'No per-acre rate'}
                    </div>
                    <div className="text-[10px] font-mono text-sky-700 font-bold">
                      Utilization {m.utilizationPercent}%
                    </div>
                  </td>

                  {/* Papers & Licensing */}
                  <td className="py-3.5 px-4">
                    {paperChips(m)}
                    <div className="mt-1.5">
                      <PricingFlag index={m.pricingIndexPercent} />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(m.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectMachine(m)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        title="Inspect full machine dossier and papers"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => onVerifyPapers(m)}
                        className="p-1.5 text-xs text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 rounded-lg transition-colors"
                        title="Verify RC / Insurance / Operator License"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSuspend(m)}
                        className={`p-1.5 text-xs rounded-lg transition-colors ${
                          m.status === 'suspended'
                            ? 'text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200'
                            : 'text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200'
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
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px]">
          Showing {machines.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} machines
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
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
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
