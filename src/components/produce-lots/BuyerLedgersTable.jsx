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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Low Risk
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Moderate Risk
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {risk}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950">Trader Credit Ledgers & Udhaar Risk</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
            {ledgers.length} Buyers Tracked
          </span>
        </div>
        <div className="text-[11px] font-medium text-emerald-800">
          Statutory APMC Trader Licensure & Farmer Payout Guarantees
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Ledger ID</th>
              <th className="py-3.5 px-4 min-w-[210px]">Buyer Entity & License</th>
              <th className="py-3.5 px-4 min-w-[140px]">Credit Rating</th>
              <th className="py-3.5 px-4 min-w-[160px]">Total Purchases</th>
              <th className="py-3.5 px-4 min-w-[170px]">Udhaar Balance</th>
              <th className="py-3.5 px-4 min-w-[190px]">Credit Utilization</th>
              <th className="py-3.5 px-3 min-w-[130px]">Default Risk</th>
              <th className="py-3.5 px-4 text-right min-w-[130px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading buyer credit ledgers...</span>
                  </div>
                </td>
              </tr>
            ) : ledgers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No buyer credit accounts found.
                </td>
              </tr>
            ) : (
              ledgers.map((buyer) => (
                <tr
                  key={buyer.id}
                  onClick={() => onAuditLedger && onAuditLedger(buyer)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Ledger ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                      <span>{buyer.id}</span>
                      <button
                        onClick={(e) => handleCopyId(buyer.id, e)}
                        className="text-slate-400 hover:text-emerald-700 transition-colors"
                        title="Copy Ledger ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      Ref: {buyer.buyerId}
                    </span>
                  </td>

                  {/* Buyer Firm & APMC */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate max-w-[180px]">{buyer.buyerFirm}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Trader: {buyer.buyerName} ({buyer.contactMobile})
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      APMC: {buyer.apmcLicenseNo}
                    </div>
                  </td>

                  {/* Credit Rating */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-950 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg border border-emerald-300 text-[11px] shadow-xs">
                      {buyer.creditRating}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {buyer.activeDealsCount} active deals
                    </span>
                  </td>

                  {/* Total Purchases */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-bold text-slate-900">
                      ₹{(buyer.totalPurchasesVal / 100000).toFixed(2)} Lakh
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Settled: ₹{(buyer.totalSettledVal / 100000).toFixed(2)} Lakh
                    </div>
                  </td>

                  {/* Current Udhaar Balance */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-extrabold text-amber-800">
                      ₹{buyer.currentUdhaarBalance?.toLocaleString('en-IN')}
                    </div>
                    {buyer.daysOverdue > 0 ? (
                      <span className="text-[10px] text-rose-600 font-bold block">
                        {buyer.daysOverdue} days overdue
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-medium block">
                        Clean settlement
                      </span>
                    )}
                  </td>

                  {/* Credit Utilization Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-500 font-medium">
                        ₹{(buyer.creditLimit / 100000).toFixed(1)}L Limit
                      </span>
                      <span
                        className={`font-bold ${
                          buyer.creditUtilizationPercent > 100
                            ? 'text-rose-600'
                            : buyer.creditUtilizationPercent > 75
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {buyer.creditUtilizationPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-emerald-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          buyer.creditUtilizationPercent > 100
                            ? 'bg-rose-500'
                            : buyer.creditUtilizationPercent > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
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
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-xs ml-auto"
                      title="Adjust trader credit limit and risk flags"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-700" />
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
      <div className="px-4 py-3 bg-emerald-50/50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="text-[11px] font-medium">
          Showing {ledgers.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
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
