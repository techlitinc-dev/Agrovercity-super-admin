import React from 'react';
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { TablePaginationFooter } from '../equipment/TablePaginationFooter';

export function PaymentsLedgerTable({
  payments = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid & Released
          </span>
        );
      case 'escrow_held':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" /> Escrow Held
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Overdue
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="w-3 h-3 text-amber-600" /> Rent Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              Monthly Rent Collection Ledger (land_lease_payments)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
              {payments.length} Payments
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Automated rent escrow tracking, 1% platform servicing deduction, landlord NEFT payouts & overdue penalty audits.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Escrow Security: 100% Protected Payout Rails
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Payment ID</th>
              <th className="py-3.5 px-4 min-w-[140px]">Lease Ref</th>
              <th className="py-3.5 px-4 min-w-[190px]">Parties (Landlord × Tenant)</th>
              <th className="py-3.5 px-4 min-w-[140px]">Billing Cycle</th>
              <th className="py-3.5 px-4 min-w-[150px]">Gross Rent & Fee</th>
              <th className="py-3.5 px-4 min-w-[150px]">Landlord Payout</th>
              <th className="py-3.5 px-4 min-w-[150px]">Method & UTR</th>
              <th className="py-3.5 px-4 text-right min-w-[130px]">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading rent payments ledger...</span>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No rent payments found in ledger.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {p.id}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                    #{p.leaseId}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{p.landlordName}</div>
                    <div className="text-[11px] text-slate-500">× {p.tenantName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{p.billingMonth}</div>
                    <span className="text-[10px] font-mono text-slate-500">Due: {p.dueDate}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                      {Number(p.rentAmount || 0).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Fee (1%): ₹{Number(p.platformFee || 0).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-emerald-700 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      {Number(p.landlordPayout || 0).toLocaleString('en-IN')}
                    </div>
                    {p.latePenalty > 0 && (
                      <span className="text-[10px] font-mono text-rose-600 block">
                        +₹{p.latePenalty} Late Fine
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{p.paymentMethod}</div>
                    <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[130px]">
                      {p.transactionId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {getStatusBadge(p.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
