import React from 'react';
import {
  Eye,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

export function SettlementsTable({
  settlements = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectSettlement,
  onAuditPayout,
  loading = false
}) {
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
  };

  const getPodBadge = (podAuditStatus) => {
    switch (podAuditStatus) {
      case 'released':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Released
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
            <ShieldCheck className="w-3 h-3 text-sky-400" /> Approved
          </span>
        );
      case 'pending_audit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <Clock className="w-3 h-3 text-amber-400" /> Pending Audit
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-700">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {podAuditStatus}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Transporter Payout Ledger (transporter_settlements)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {settlements.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: POD Audit · Dual Sign-off &gt; ₹50,000 · Payout Release
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-28">Settlement ID</th>
              <th className="py-3 px-4 min-w-[170px]">Transporter</th>
              <th className="py-3 px-4 min-w-[130px]">Booking Ref</th>
              <th className="py-3 px-4 min-w-[150px]">Gross & Platform Fee</th>
              <th className="py-3 px-3 min-w-[130px]">Net Payout</th>
              <th className="py-3 px-3 min-w-[150px]">POD Audit</th>
              <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading settlement ledger...</span>
                  </div>
                </td>
              </tr>
            ) : settlements.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No settlements match the specified query or filters.
                </td>
              </tr>
            ) : (
              settlements.map((settlement) => {
                const requiresDualSignOff = settlement.payoutAmount > 50000 && settlement.podAuditStatus !== 'released';
                return (
                  <tr
                    key={settlement.id}
                    onClick={() => onInspectSettlement(settlement)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    {/* Settlement ID */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                        <span>{settlement.id}</span>
                        <button
                          onClick={(e) => handleCopyId(settlement.id, e)}
                          className="text-slate-500 hover:text-emerald-400 transition-colors"
                          title="Copy Settlement ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {new Date(settlement.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Transporter */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{settlement.transporterName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {settlement.payoutMode}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {settlement.tripsCount} trip{settlement.tripsCount === 1 ? '' : 's'}
                      </div>
                    </td>

                    {/* Booking Ref */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-300 text-xs">{settlement.bookingId}</div>
                      {settlement.vehicleId && (
                        <div className="text-[10px] font-mono text-slate-500">{settlement.vehicleId}</div>
                      )}
                    </td>

                    {/* Gross & Fee */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-200 text-xs">
                        ₹{settlement.grossFare.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Fee: {settlement.platformFeePercent}%
                      </div>
                    </td>

                    {/* Net Payout */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-teal-400 text-xs">
                        ₹{settlement.payoutAmount.toLocaleString('en-IN')}
                      </div>
                      {requiresDualSignOff && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {(settlement.signOffs?.length || 0)}/2 sign-offs
                        </span>
                      )}
                    </td>

                    {/* POD Audit */}
                    <td className="py-3 px-3">
                      {getPodBadge(settlement.podAuditStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectSettlement(settlement)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                          title="Inspect settlement and POD documentation"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>Review</span>
                        </button>

                        {(settlement.podAuditStatus === 'pending_audit' || settlement.podAuditStatus === 'approved') && (
                          <button
                            onClick={() => onAuditPayout(settlement)}
                            className="p-1 text-xs text-teal-400 hover:text-white bg-teal-950/60 hover:bg-teal-600 border border-teal-600/40 rounded-md transition-colors"
                            title="Audit POD & Release Payout"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {settlements.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} settlements
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
