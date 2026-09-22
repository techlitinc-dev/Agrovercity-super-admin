import React from 'react';
import {
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Navigation,
  MapPin,
  FileCheck2,
  Phone
} from 'lucide-react';

export function TransportBookingsTable({
  bookings = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectBooking,
  onArbitrate,
  onOverrideStatus,
  loading = false
}) {
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300/80 shadow-2xs">
            <Clock className="w-3 h-3 text-sky-600" /> Requested
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <Navigation className="w-3 h-3 text-emerald-600" /> In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Delivered
          </span>
        );
      case 'pod_submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <FileText className="w-3 h-3 text-amber-600" /> POD Submitted
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-slate-600" /> Completed
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Disputed
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> No-Show
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
            <XCircle className="w-3 h-3 text-slate-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    const styles = {
      paid: 'text-emerald-800 bg-emerald-100 border-emerald-300/80 font-bold',
      pending: 'text-amber-800 bg-amber-100 border-amber-300/80 font-bold',
      refunded: 'text-sky-800 bg-sky-100 border-sky-300/80 font-bold'
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono border shadow-2xs ${styles[paymentStatus] || 'text-slate-700 bg-slate-100 border-slate-300'}`}>
        {paymentStatus?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Dispatch & Trip Ledger (transport_bookings)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {bookings.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          Superadmin Controls: Live Dispatch Map · Manual Status Override · Dispute Arbitration
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Booking ID</th>
              <th className="py-3.5 px-4 min-w-[170px]">Customer & Persona</th>
              <th className="py-3.5 px-4 min-w-[220px]">Route (Pickup → Drop)</th>
              <th className="py-3.5 px-4 min-w-[170px]">Vehicle & Transporter</th>
              <th className="py-3.5 px-3 min-w-[130px]">Fare</th>
              <th className="py-3.5 px-3 min-w-[130px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading transport bookings...</span>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No transport bookings match the specified query or filters.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onInspectBooking(booking)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Booking ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{booking.id}</span>
                      <button
                        onClick={(e) => handleCopyId(booking.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Copy Booking ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(booking.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{booking.customerName}</div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {booking.customerMobile}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold">
                      {booking.customerPersona}
                    </span>
                  </td>

                  {/* Route */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[110px]">{booking.pickupPoint.village}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                      <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                      <span className="truncate max-w-[130px]">{booking.dropPoint.mandi}</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-800 font-bold">
                      {booking.distanceKm} km trip
                    </span>
                  </td>

                  {/* Vehicle & Transporter */}
                  <td className="py-3.5 px-4">
                    {booking.vehicleId ? (
                      <>
                        <div className="font-mono font-bold text-emerald-900 text-xs">
                          {booking.vehicleId}
                        </div>
                        <div className="text-[11px] text-slate-800 font-medium">{booking.transporterName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {booking.vehicleClass}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Awaiting transporter accept</span>
                    )}
                  </td>

                  {/* Fare */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-extrabold text-slate-900 text-xs">
                      ₹{booking.fareAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1">
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectBooking(booking)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                        title="Inspect trip dossier and POD"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Review</span>
                      </button>

                      {(booking.status === 'disputed' || booking.status === 'no_show') && (
                        <button
                          onClick={() => onArbitrate(booking)}
                          className="p-1.5 text-xs text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Arbitrate Dispute / No-Show"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOverrideStatus(booking)}
                        className="p-1.5 text-xs text-sky-800 hover:text-sky-950 bg-sky-100 hover:bg-sky-200 border border-sky-300/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                        title="Manual Trip Status Intervention"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
          Showing {bookings.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
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
