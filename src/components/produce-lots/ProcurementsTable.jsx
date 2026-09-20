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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fully Settled
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/30">
            <Scale className="w-3 h-3 text-teal-400" /> Slip Verified
          </span>
        );
      case 'payment_due':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <Clock className="w-3 h-3 text-amber-400" /> Payment Due
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Disputed
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
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Trader Procurements & Physical Slips (procurements)</span>
          <span className="text-xs bg-teal-950 text-teal-400 border border-teal-600/30 px-2 py-0.5 rounded font-mono">
            {procurements.length} Procurements
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Electronic Weighbridge Slips & Mandi Gate Passes
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Procurement ID</th>
              <th className="py-3 px-4 min-w-[150px]">Contract & Lot</th>
              <th className="py-3 px-4 min-w-[200px]">Trader Entity</th>
              <th className="py-3 px-4 min-w-[170px]">Farmer & Commodity</th>
              <th className="py-3 px-3 min-w-[150px]">Weighbridge Slip</th>
              <th className="py-3 px-4 min-w-[170px]">Settlement Amount</th>
              <th className="py-3 px-3 min-w-[120px]">Payment Due</th>
              <th className="py-3 px-3 min-w-[120px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading procurements...</span>
                  </div>
                </td>
              </tr>
            ) : procurements.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No procurement entries recorded.
                </td>
              </tr>
            ) : (
              procurements.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => onInspectProcurement && onInspectProcurement(p)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{p.id}</span>
                      <button
                        onClick={(e) => handleCopyId(p.id, e)}
                        className="text-slate-500 hover:text-teal-400 transition-colors"
                        title="Copy Procurement ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Contract & Lot */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-sky-400 font-bold">{p.dealId}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Ref: {p.lotId}</div>
                  </td>

                  {/* Trader Entity */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{p.traderFirm}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Procured by: {p.traderName}
                    </div>
                  </td>

                  {/* Farmer & Commodity */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-emerald-400">{p.commodity}</div>
                    <div className="text-[11px] text-slate-300">
                      Farmer: {p.farmerName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {p.procuredQuantityQtl} Qtl @ ₹{p.agreedRate}/Qtl
                    </div>
                  </td>

                  {/* Weighbridge Slip */}
                  <td className="py-3 px-3">
                    {p.weighbridgeVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                        <Clock className="w-3 h-3 text-amber-400" /> Pending
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      Slip: {p.weighbridgeSlipNo}
                    </span>
                  </td>

                  {/* Settlement Amount */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-extrabold text-white">
                      ₹{p.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-400">
                      Paid: ₹{p.paidAmount?.toLocaleString('en-IN')}
                    </div>
                    {p.pendingAmount > 0 && (
                      <div className="text-[10px] text-rose-400 font-bold">
                        Pending: ₹{p.pendingAmount?.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  {/* Payment Due Date */}
                  <td className="py-3 px-3 font-mono text-xs">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{p.paymentDueDate}</span>
                    </div>
                    {new Date(p.paymentDueDate) < new Date() && p.pendingAmount > 0 && (
                      <span className="text-[10px] text-rose-400 font-bold block">
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
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {procurements.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
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
