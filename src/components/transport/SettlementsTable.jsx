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
  ShieldCheck
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Released
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <ShieldCheck className="w-3 h-3 text-sky-600" /> Approved
          </span>
        );
      case 'pending_audit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Audit
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {podAuditStatus}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Transporter Payout Ledger (transporter_settlements)</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
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
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Settlement ID</th>
              <th className="py-3.5 px-4 min-w-[170px]">Transporter</th>
              <th className="py-3.5 px-4 min-w-[130px]">Booking Ref</th>
              <th className="py-3.5 px-4 min-w-[150px]">Gross & Platform Fee</th>
              <th className="py-3.5 px-4 min-w-[130px]">Net Payout</th>
              <th className="py-3.5 px-4 min-w-[150px]">POD Audit</th>
              <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
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
                    className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                  >
                    {/* Settlement ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                        <span>{settlement.id}</span>
                        <button
                          onClick={(e) => handleCopyId(settlement.id, e)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
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
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{settlement.transporterName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {settlement.payoutMode}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {settlement.tripsCount} trip{settlement.tripsCount === 1 ? '' : 's'}
                      </div>
                    </td>

                    {/* Booking Ref */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-medium text-xs">{settlement.bookingId}</div>
                      {settlement.vehicleId && (
                        <div className="text-[10px] font-mono text-slate-500">{settlement.vehicleId}</div>
                      )}
                    </td>

                    {/* Gross & Fee */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        ₹{settlement.grossFare.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Fee: {settlement.platformFeePercent}%
                      </div>
                    </td>

                    {/* Net Payout */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-700 text-xs">
                        ₹{settlement.payoutAmount.toLocaleString('en-IN')}
                      </div>
                      {requiresDualSignOff && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 font-semibold mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          {(settlement.signOffs?.length || 0)}/2 sign-offs
                        </span>
                      )}
                    </td>

                    {/* POD Audit */}
                    <td className="py-3.5 px-4">
                      {getPodBadge(settlement.podAuditStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onInspectSettlement(settlement)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          title="Inspect settlement and POD documentation"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Review</span>
                        </button>

                        {(settlement.podAuditStatus === 'pending_audit' || settlement.podAuditStatus === 'approved') && (
                          <button
                            onClick={() => onAuditPayout(settlement)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                            title="Audit POD & Release Payout"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            <span>Audit</span>
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
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px]">
          Showing {settlements.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} settlements
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
