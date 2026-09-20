import React, { useState } from 'react';
import {
  Wallet,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Sliders,
  CheckCircle2,
  Lock,
  FileText
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function BuyerLedgersTable({
  ledgers = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onAdjustCredit,
  onAuditLedger,
  loading = false
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Ledger ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Low Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Moderate Risk
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700 font-bold">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {risk}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Trader Credit Ledgers & Udhaar Risk (buyer_ledgers)</span>
          <span className="text-xs bg-amber-950 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded font-mono">
            {ledgers.length} Buyers Tracked
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Statutory APMC Trader Licensure & Farmer Payout Guarantees
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Ledger ID</th>
              <th className="py-3 px-4 min-w-[210px]">Buyer Entity & License</th>
              <th className="py-3 px-4 min-w-[140px]">Credit Rating</th>
              <th className="py-3 px-4 min-w-[160px]">Total Purchases</th>
              <th className="py-3 px-4 min-w-[170px]">Udhaar Balance</th>
              <th className="py-3 px-4 min-w-[190px]">Credit Utilization</th>
              <th className="py-3 px-3 min-w-[130px]">Default Risk</th>
              <th className="py-3 px-4 text-right min-w-[130px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading buyer credit ledgers...</span>
                  </div>
                </td>
              </tr>
            ) : ledgers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No buyer credit accounts found.
                </td>
              </tr>
            ) : (
              ledgers.map((buyer) => (
                <tr
                  key={buyer.id}
                  onClick={() => onAuditLedger && onAuditLedger(buyer)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Ledger ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{buyer.id}</span>
                      <button
                        onClick={(e) => handleCopyId(buyer.id, e)}
                        className="text-slate-500 hover:text-amber-400 transition-colors"
                        title="Copy Ledger ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Ref: {buyer.buyerId}
                    </span>
                  </td>

                  {/* Buyer Firm & APMC */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{buyer.buyerFirm}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Trader: {buyer.buyerName} ({buyer.contactMobile})
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      APMC: {buyer.apmcLicenseNo}
                    </div>
                  </td>

                  {/* Credit Rating */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                      {buyer.creditRating}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      {buyer.activeDealsCount} active deals
                    </span>
                  </td>

                  {/* Total Purchases */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-bold text-white">
                      ₹{(buyer.totalPurchasesVal / 100000).toFixed(2)} Lakh
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      Settled: ₹{(buyer.totalSettledVal / 100000).toFixed(2)} Lakh
                    </div>
                  </td>

                  {/* Current Udhaar Balance */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-extrabold text-amber-400">
                      ₹{buyer.currentUdhaarBalance?.toLocaleString('en-IN')}
                    </div>
                    {buyer.daysOverdue > 0 ? (
                      <span className="text-[10px] text-rose-400 font-bold block">
                        {buyer.daysOverdue} days overdue
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 block">
                        Clean settlement
                      </span>
                    )}
                  </td>

                  {/* Credit Utilization Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400">
                        ₹{(buyer.creditLimit / 100000).toFixed(1)}L Limit
                      </span>
                      <span
                        className={`font-bold ${
                          buyer.creditUtilizationPercent > 100
                            ? 'text-rose-400'
                            : buyer.creditUtilizationPercent > 75
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {buyer.creditUtilizationPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          buyer.creditUtilizationPercent > 100
                            ? 'bg-rose-500'
                            : buyer.creditUtilizationPercent > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(buyer.creditUtilizationPercent, 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Default Risk */}
                  <td className="py-3 px-3">
                    {getRiskBadge(buyer.defaultRisk)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onAdjustCredit(buyer)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-600 border border-amber-600/40 rounded-md transition-colors ml-auto"
                      title="Adjust trader credit limit and risk flags"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Adjust Limit</span>
                    </button>
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
          Showing {ledgers.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
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
                    ? 'bg-amber-600 text-white font-bold'
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
