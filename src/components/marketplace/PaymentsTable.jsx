import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Copy,
  DollarSign
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function PaymentsTable({
  payments = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'captured':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> CAPTURED
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30 font-mono">
            <RotateCcw className="w-3 h-3 text-rose-400" /> REFUNDED
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-rose-400 font-mono">
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 font-mono">
            {status?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Razorpay Payment Gateway Audit Ledger (payments)</span>
          <span className="text-xs bg-teal-950 text-teal-400 border border-teal-600/30 px-2 py-0.5 rounded font-mono">
            {payments.length} Transactions
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          PCI-DSS Compliant Gateway Webhook Attestation
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Payment ID</th>
              <th className="py-3 px-4 min-w-[130px]">Order Ref</th>
              <th className="py-3 px-4 min-w-[170px]">Payer / Farmer</th>
              <th className="py-3 px-4 min-w-[140px]">Gross Amount</th>
              <th className="py-3 px-4 min-w-[180px]">Payment Method</th>
              <th className="py-3 px-4 min-w-[180px]">Razorpay Reference</th>
              <th className="py-3 px-3 min-w-[120px]">Gateway Status</th>
              <th className="py-3 px-4 text-right min-w-[140px]">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading payment ledger...</span>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No payment ledger transactions found.
                </td>
              </tr>
            ) : (
              payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-800/50 transition-colors">
                  {/* Payment ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{pay.id}</span>
                      <button
                        onClick={(e) => handleCopyId(pay.id, e)}
                        className="text-slate-500 hover:text-teal-400 transition-colors"
                        title="Copy Payment ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Order Ref */}
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">
                    {pay.orderId}
                  </td>

                  {/* Payer */}
                  <td className="py-3 px-4 font-semibold text-white">
                    {pay.farmerName}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 font-mono">
                    <span className="text-xs font-extrabold text-white">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </span>
                    {pay.fee > 0 && (
                      <span className="text-[10px] text-slate-500 block">
                        Fee: ₹{pay.fee} + GST
                      </span>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4">
                    <span className="text-slate-200 text-xs block font-medium">
                      {pay.method}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Currency: {pay.currency}
                    </span>
                  </td>

                  {/* Razorpay Reference */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    <div className="truncate max-w-[160px] text-teal-400 font-semibold">
                      {pay.razorpayPaymentId}
                    </div>
                    {pay.refundId && (
                      <div className="text-rose-400 text-[10px] font-bold truncate max-w-[160px]">
                        Refund: {pay.refundId}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(pay.status)}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                    {new Date(pay.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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
          Showing {payments.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
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
                    ? 'bg-teal-600 text-white font-bold'
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
