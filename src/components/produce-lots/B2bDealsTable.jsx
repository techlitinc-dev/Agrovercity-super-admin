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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <Lock className="w-3 h-3 text-emerald-700" /> Funded in Escrow
          </span>
        );
      case 'disputed_hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Escrow Hold
          </span>
        );
      case 'released_to_farmer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Released to Farmer
          </span>
        );
      case 'refunded_to_buyer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
            Refunded to Buyer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {escrowStatus}
          </span>
        );
    }
  };

  const getDealStatusBadge = (status) => {
    switch (status) {
      case 'weighbridge_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Weighbridge Verified
          </span>
        );
      case 'contract_signed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-300 shadow-xs">
            <FileText className="w-3 h-3 text-sky-600" /> Contract Signed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-700" /> Completed
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Disputed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
            <XCircle className="w-3 h-3 text-slate-500" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950">B2B Trading Contracts & Escrow</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
            {deals.length} Deals
          </span>
        </div>
        <div className="text-[11px] font-medium text-emerald-800">
          Escrow Protection: ICICI / HDFC / Axis Bank Dedicated Agro Escrow
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Deal ID</th>
              <th className="py-3.5 px-4 min-w-[150px]">Lot Reference</th>
              <th className="py-3.5 px-4 min-w-[200px]">Farmer vs Buyer Firm</th>
              <th className="py-3.5 px-4 min-w-[160px]">Brokerage Mediation</th>
              <th className="py-3.5 px-4 min-w-[170px]">Agreed Value</th>
              <th className="py-3.5 px-3 min-w-[150px]">Escrow Status</th>
              <th className="py-3.5 px-3 min-w-[140px]">Deal Status</th>
              <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading B2B deals...</span>
                  </div>
                </td>
              </tr>
            ) : deals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No B2B deals match the active query.
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => onInspectDeal(deal)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Deal ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                      <span>{deal.id}</span>
                      <button
                        onClick={(e) => handleCopyId(deal.id, e)}
                        className="text-slate-400 hover:text-emerald-700 transition-colors"
                        title="Copy Deal ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {new Date(deal.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Lot Reference & Commodity */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-emerald-700 font-bold">{deal.lotId}</div>
                    <div className="font-bold text-slate-900">{deal.commodity}</div>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {deal.quantityQtl} Qtl
                    </span>
                  </td>

                  {/* Farmer vs Buyer */}
                  <td className="py-3 px-4">
                    <div className="text-[11px] text-slate-600">
                      Farmer: <span className="text-slate-900 font-bold">{deal.farmerName}</span>
                    </div>
                    <div className="text-xs text-teal-800 font-bold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate max-w-[180px]">{deal.buyerFirm}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Buyer: {deal.buyerName}
                    </div>
                  </td>

                  {/* Brokerage */}
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium truncate max-w-[150px]">
                      {deal.brokerName || 'Direct Trading'}
                    </div>
                    {deal.brokeragePercent > 0 ? (
                      <span className="text-[11px] text-amber-800 font-semibold">
                        {deal.brokeragePercent}% (₹{deal.brokerageAmount?.toLocaleString('en-IN')})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">No Commission</span>
                    )}
                  </td>

                  {/* Agreed Value */}
                  <td className="py-3 px-4">
                    <div className="text-xs font-mono font-extrabold text-slate-900">
                      ₹{deal.totalDealValue?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      ₹{deal.finalAgreedPrice?.toLocaleString('en-IN')}/Qtl
                    </div>
                  </td>

                  {/* Escrow Status */}
                  <td className="py-3 px-3">
                    {getEscrowBadge(deal.escrowStatus)}
                    {deal.escrowAccountRef && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5 truncate max-w-[140px]">
                        {deal.escrowAccountRef}
                      </span>
                    )}
                  </td>

                  {/* Deal Status */}
                  <td className="py-3 px-3">
                    {getDealStatusBadge(deal.status)}
                    {deal.disputeReason && (
                      <span className="text-[10px] text-rose-600 font-semibold block mt-0.5 truncate max-w-[140px]" title={deal.disputeReason}>
                        ⚠️ {deal.disputeReason}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectDeal(deal)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-xs"
                      >
                        <span>Inspect</span>
                      </button>

                      {deal.status === 'disputed' && (
                        <button
                          onClick={() => onMediateDispute(deal)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-xs"
                          title="Mediate dispute and arbitrate escrow release"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Arbitrate</span>
                        </button>
                      )}

                      {deal.status === 'weighbridge_verified' && deal.escrowStatus === 'funded' && (
                        <button
                          onClick={() => onReleaseEscrow(deal)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors shadow-xs"
                          title="Release escrow payment to farmer bank account"
                        >
                          <Lock className="w-3.5 h-3.5 text-emerald-700" />
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
      <div className="px-4 py-3 bg-emerald-50/50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="text-[11px] font-medium">
          Showing {deals.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} deals
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs font-semibold"
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
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                  pageNum === pagination.page
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
