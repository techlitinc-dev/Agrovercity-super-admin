import React, { useState } from 'react';
import {
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Building2,
  UserCheck,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function B2bDealsTable({
  deals = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectDeal,
  onMediateDispute,
  onReleaseEscrow,
  loading = false
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Deal ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEscrowBadge = (escrowStatus) => {
    switch (escrowStatus) {
      case 'funded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <Lock className="w-3 h-3 text-emerald-400" /> Funded in Escrow
          </span>
        );
      case 'disputed_hold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Escrow Hold
          </span>
        );
      case 'released_to_farmer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/30">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Released to Farmer
          </span>
        );
      case 'refunded_to_buyer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
            Refunded to Buyer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
            {escrowStatus}
          </span>
        );
    }
  };

  const getDealStatusBadge = (status) => {
    switch (status) {
      case 'weighbridge_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/30">
            <CheckCircle2 className="w-3 h-3" /> Weighbridge Verified
          </span>
        );
      case 'contract_signed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
            <FileText className="w-3 h-3" /> Contract Signed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Completed
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700">
            <AlertTriangle className="w-3 h-3" /> Disputed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
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
          <span className="font-semibold text-slate-300">B2B Trading Contracts & Escrow (deals)</span>
          <span className="text-xs bg-sky-950 text-sky-400 border border-sky-600/30 px-2 py-0.5 rounded font-mono">
            {deals.length} Deals
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Escrow Protection: ICICI / HDFC / Axis Bank Dedicated Agro Escrow
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Deal ID</th>
              <th className="py-3 px-4 min-w-[150px]">Lot Reference</th>
              <th className="py-3 px-4 min-w-[200px]">Farmer vs Buyer Firm</th>
              <th className="py-3 px-4 min-w-[160px]">Brokerage Mediation</th>
              <th className="py-3 px-4 min-w-[170px]">Agreed Value</th>
              <th className="py-3 px-3 min-w-[150px]">Escrow Status</th>
              <th className="py-3 px-3 min-w-[140px]">Deal Status</th>
              <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading B2B deals...</span>
                  </div>
                </td>
              </tr>
            ) : deals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No B2B deals match the active query.
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => onInspectDeal(deal)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Deal ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{deal.id}</span>
                      <button
                        onClick={(e) => handleCopyId(deal.id, e)}
                        className="text-slate-500 hover:text-sky-400 transition-colors"
                        title="Copy Deal ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(deal.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Lot Reference & Commodity */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-emerald-400 font-bold">{deal.lotId}</div>
                    <div className="font-semibold text-slate-200">{deal.commodity}</div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {deal.quantityQtl} Qtl
                    </span>
                  </td>

                  {/* Farmer vs Buyer */}
                  <td className="py-3 px-4">
                    <div className="text-[11px] text-slate-400">
                      Farmer: <span className="text-white font-semibold">{deal.farmerName}</span>
                    </div>
                    <div className="text-xs text-sky-300 font-bold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{deal.buyerFirm}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Buyer: {deal.buyerName}
                    </div>
                  </td>

                  {/* Brokerage */}
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium truncate max-w-[150px]">
                      {deal.brokerName || 'Direct Trading'}
                    </div>
                    {deal.brokeragePercent > 0 ? (
                      <span className="text-[11px] text-amber-400 font-mono">
                        {deal.brokeragePercent}% (₹{deal.brokerageAmount?.toLocaleString('en-IN')})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">No Commission</span>
                    )}
                  </td>

                  {/* Agreed Value */}
                  <td className="py-3 px-4">
                    <div className="text-xs font-mono font-extrabold text-white">
                      ₹{deal.totalDealValue?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ₹{deal.finalAgreedPrice?.toLocaleString('en-IN')}/Qtl
                    </div>
                  </td>

                  {/* Escrow Status */}
                  <td className="py-3 px-3">
                    {getEscrowBadge(deal.escrowStatus)}
                    {deal.escrowAccountRef && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[140px]">
                        {deal.escrowAccountRef}
                      </span>
                    )}
                  </td>

                  {/* Deal Status */}
                  <td className="py-3 px-3">
                    {getDealStatusBadge(deal.status)}
                    {deal.disputeReason && (
                      <span className="text-[10px] text-rose-400 block mt-0.5 truncate max-w-[140px]" title={deal.disputeReason}>
                        ⚠️ {deal.disputeReason}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectDeal(deal)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                      >
                        <span>Inspect</span>
                      </button>

                      {deal.status === 'disputed' && (
                        <button
                          onClick={() => onMediateDispute(deal)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-600 hover:text-white border border-amber-600/40 rounded-md transition-colors"
                          title="Mediate dispute and arbitrate escrow release"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Arbitrate</span>
                        </button>
                      )}

                      {deal.status === 'weighbridge_verified' && deal.escrowStatus === 'funded' && (
                        <button
                          onClick={() => onReleaseEscrow(deal)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-600 hover:text-white border border-emerald-600/40 rounded-md transition-colors"
                          title="Release escrow payment to farmer bank account"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Release</span>
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

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {deals.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} deals
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
                    ? 'bg-sky-600 text-white font-bold'
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
