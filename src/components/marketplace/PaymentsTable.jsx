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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-mono shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CAPTURED
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 font-mono shadow-2xs">
            <RotateCcw className="w-3 h-3 text-rose-600" /> REFUNDED
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-rose-700 border border-rose-300/60 font-mono shadow-2xs">
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 font-mono">
            {status?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Razorpay Payment Gateway Audit Ledger (payments)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {payments.length} Transactions
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          PCI-DSS Compliant Gateway Webhook Attestation
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Payment ID</th>
              <th className="py-3.5 px-4 min-w-[130px]">Order Ref</th>
              <th className="py-3.5 px-4 min-w-[170px]">Payer / Farmer</th>
              <th className="py-3.5 px-4 min-w-[140px]">Gross Amount</th>
              <th className="py-3.5 px-4 min-w-[180px]">Payment Method</th>
              <th className="py-3.5 px-4 min-w-[180px]">Razorpay Reference</th>
              <th className="py-3.5 px-3 min-w-[120px]">Gateway Status</th>
              <th className="py-3.5 px-4 text-right min-w-[140px]">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading payment ledger...</span>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                  No payment ledger transactions found.
                </td>
              </tr>
            ) : (
              payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-emerald-50/60 transition-colors">
                  {/* Payment ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{pay.id}</span>
                      <button
                        onClick={(e) => handleCopyId(pay.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Copy Payment ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Order Ref */}
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                    {pay.orderId}
                  </td>

                  {/* Payer */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {pay.farmerName}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-xs font-extrabold text-slate-900">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </span>
                    {pay.fee > 0 && (
                      <span className="text-[10px] text-slate-500 block">
                        Fee: ₹{pay.fee} + GST
                      </span>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 text-xs block font-semibold">
                      {pay.method}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Currency: {pay.currency}
                    </span>
                  </td>

                  {/* Razorpay Reference */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                    <div className="truncate max-w-[160px] text-emerald-800 font-bold">
                      {pay.razorpayPaymentId}
                    </div>
                    {pay.refundId && (
                      <div className="text-rose-700 text-[10px] font-bold truncate max-w-[160px]">
                        Refund: {pay.refundId}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(pay.status)}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
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
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {payments.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
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
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
