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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200">
      FPO Auto-Confirm
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
      Private Approval
    </span>
  );
}

function BookingStatusBadge({ status }) {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" /> Pending
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" /> Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
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
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Slot Booking Ledger (equipment_bookings)</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
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
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-24">Booking ID</th>
              <th className="py-3.5 px-4 min-w-[170px]">Farmer</th>
              <th className="py-3.5 px-4 min-w-[180px]">Machine & Slot</th>
              <th className="py-3.5 px-4 min-w-[130px]">Amount & Deposit</th>
              <th className="py-3.5 px-4 min-w-[140px]">Booking Mode</th>
              <th className="py-3.5 px-4 min-w-[150px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
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
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Booking ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{b.id}</span>
                      <button
                        onClick={(e) => handleCopyId(b.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
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
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.farmerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {b.farmerId} · {b.farmerMobile}
                    </div>
                  </td>

                  {/* Machine & Slot */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[150px]">{b.equipmentName}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {b.date} · {b.slotName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate max-w-[170px]">{b.slotId}</div>
                  </td>

                  {/* Amount & Deposit */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">₹{b.priceRupees.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Deposit ₹{(b.securityDeposit || 0).toLocaleString('en-IN')}
                    </div>
                    {b.refundAmount != null && (
                      <div className="text-[10px] font-mono text-emerald-700 font-bold">
                        Refunded ₹{b.refundAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  {/* Booking Mode */}
                  <td className="py-3.5 px-4">
                    <OwnerChip ownerType={b.ownerType} />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <BookingStatusBadge status={b.status} />
                      {b.damageReport?.reported && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          b.damageReport.depositAction === 'pending'
                            ? 'text-rose-700 bg-rose-50 border-rose-200'
                            : 'text-slate-600 bg-slate-100 border-slate-200'
                        }`}>
                          <ShieldAlert className="w-3 h-3" /> Damage · {b.damageReport.depositAction.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectBooking(b)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        title="Inspect full booking dossier"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Review</span>
                      </button>

                      {b.damageReport?.reported && b.damageReport.depositAction === 'pending' && (
                        <button
                          onClick={() => onResolveDamage(b)}
                          className="p-1.5 text-xs text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-600 border border-amber-200 rounded-lg transition-colors"
                          title="Resolve Damage Report / Deposit Forfeiture"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => onForceCancel(b)}
                          className="p-1.5 text-xs text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-lg transition-colors"
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
