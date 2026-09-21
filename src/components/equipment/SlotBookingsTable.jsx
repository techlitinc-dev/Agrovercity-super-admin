import React from 'react';
import {
  Eye,
  XCircle,
  ShieldAlert,
  Copy,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { TablePaginationFooter } from './TablePaginationFooter';

function OwnerChip({ ownerType }) {
  return ownerType === 'fpo' ? (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-sky-300 bg-sky-950/80 border border-sky-600/30">
      FPO Auto-Confirm
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-violet-300 bg-violet-950/80 border border-violet-600/30">
      Private Approval
    </span>
  );
}

function BookingStatusBadge({ status }) {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
          <Clock className="w-3 h-3 text-amber-400" /> Pending
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
          <XCircle className="w-3 h-3 text-rose-400" /> Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
          {status}
        </span>
      );
  }
}

export function SlotBookingsTable({
  bookings = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectBooking,
  onForceCancel,
  onResolveDamage,
  loading = false
}) {
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Slot Booking Ledger (equipment_bookings)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {bookings.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: Force Cancellation & Refund · Damage Reports · Deposit Forfeiture
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-24">Booking ID</th>
              <th className="py-3 px-4 min-w-[170px]">Farmer</th>
              <th className="py-3 px-4 min-w-[180px]">Machine & Slot</th>
              <th className="py-3 px-4 min-w-[130px]">Amount & Deposit</th>
              <th className="py-3 px-3 min-w-[140px]">Booking Mode</th>
              <th className="py-3 px-3 min-w-[150px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading slot booking ledger...</span>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No bookings match the specified query or filters.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onInspectBooking(b)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Booking ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{b.id}</span>
                      <button
                        onClick={(e) => handleCopyId(b.id, e)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
                        title="Copy Booking ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Farmer */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{b.farmerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {b.farmerId} · {b.farmerMobile}
                    </div>
                  </td>

                  {/* Machine & Slot */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[150px]">{b.equipmentName}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {b.date} · {b.slotName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate max-w-[170px]">{b.slotId}</div>
                  </td>

                  {/* Amount & Deposit */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">₹{b.priceRupees.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Deposit ₹{(b.securityDeposit || 0).toLocaleString('en-IN')}
                    </div>
                    {b.refundAmount != null && (
                      <div className="text-[10px] font-mono text-teal-400 font-semibold">
                        Refunded ₹{b.refundAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  {/* Booking Mode */}
                  <td className="py-3 px-3">
                    <OwnerChip ownerType={b.ownerType} />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col items-start gap-1">
                      <BookingStatusBadge status={b.status} />
                      {b.damageReport?.reported && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          b.damageReport.depositAction === 'pending'
                            ? 'text-rose-300 bg-rose-950/80 border-rose-600/40'
                            : 'text-slate-400 bg-slate-900 border-slate-700'
                        }`}>
                          <ShieldAlert className="w-3 h-3" /> Damage · {b.damageReport.depositAction.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectBooking(b)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        title="Inspect full booking dossier"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Review</span>
                      </button>

                      {b.damageReport?.reported && b.damageReport.depositAction === 'pending' && (
                        <button
                          onClick={() => onResolveDamage(b)}
                          className="p-1 text-xs text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 border border-amber-600/40 rounded-md transition-colors"
                          title="Resolve Damage Report / Deposit Forfeiture"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => onForceCancel(b)}
                          className="p-1 text-xs text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40 rounded-md transition-colors"
                          title="Admin Force Cancellation with Refund"
                        >
                          <XCircle className="w-3.5 h-3.5" />
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

      <TablePaginationFooter
        records={bookings}
        label="bookings"
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
