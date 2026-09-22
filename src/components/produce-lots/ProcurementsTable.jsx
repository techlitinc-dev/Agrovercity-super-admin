import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Scale,
  Building2,
  Calendar,
  FileCheck
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function ProcurementsTable({
  procurements = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectProcurement,
  loading = false
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Procurement ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Fully Settled
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-xs">
            <Scale className="w-3 h-3 text-teal-600" /> Slip Verified
          </span>
        );
      case 'payment_due':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" /> Payment Due
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Disputed
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
      {/* Subheader */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950">Trader Procurements & Physical Slips</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
            {procurements.length} Procurements
          </span>
        </div>
        <div className="text-[11px] font-medium text-emerald-800">
          Electronic Weighbridge Slips & Mandi Gate Passes
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Procurement ID</th>
              <th className="py-3.5 px-4 min-w-[150px]">Contract & Lot</th>
              <th className="py-3.5 px-4 min-w-[200px]">Trader Entity</th>
              <th className="py-3.5 px-4 min-w-[170px]">Farmer & Commodity</th>
              <th className="py-3.5 px-3 min-w-[150px]">Weighbridge Slip</th>
              <th className="py-3.5 px-4 min-w-[170px]">Settlement Amount</th>
              <th className="py-3.5 px-3 min-w-[120px]">Payment Due</th>
              <th className="py-3.5 px-3 min-w-[120px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading procurements...</span>
                  </div>
                </td>
              </tr>
            ) : procurements.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No procurement entries recorded.
                </td>
              </tr>
            ) : (
              procurements.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onInspectProcurement && onInspectProcurement(p)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                      <span>{p.id}</span>
                      <button
                        onClick={(e) => handleCopyId(p.id, e)}
                        className="text-slate-400 hover:text-emerald-700 transition-colors"
                        title="Copy Procurement ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Contract & Lot */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-emerald-700 font-bold">{p.dealId}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Ref: {p.lotId}</div>
                  </td>

                  {/* Trader Entity */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate max-w-[170px]">{p.traderFirm}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Procured by: {p.traderName}
                    </div>
                  </td>

                  {/* Farmer & Commodity */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-800">{p.commodity}</div>
                    <div className="text-[11px] text-slate-600">
                      Farmer: {p.farmerName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.procuredQuantityQtl} Qtl @ ₹{p.agreedRate}/Qtl
                    </div>
                  </td>

                  {/* Weighbridge Slip */}
                  <td className="py-3 px-3">
                    {p.weighbridgeVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      Slip: {p.weighbridgeSlipNo}
                    </span>
                  </td>

                  {/* Settlement Amount */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-extrabold text-slate-900">
                      ₹{p.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Paid: ₹{p.paidAmount?.toLocaleString('en-IN')}
                    </div>
                    {p.pendingAmount > 0 && (
                      <div className="text-[10px] text-rose-600 font-bold">
                        Pending: ₹{p.pendingAmount?.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  {/* Payment Due Date */}
                  <td className="py-3 px-3 font-mono text-xs">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{p.paymentDueDate}</span>
                    </div>
                    {new Date(p.paymentDueDate) < new Date() && p.pendingAmount > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold block">
                        OVERDUE
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(p.status)}
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
          Showing {procurements.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
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
