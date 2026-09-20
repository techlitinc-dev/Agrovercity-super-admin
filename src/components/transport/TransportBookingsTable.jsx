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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
            <Clock className="w-3 h-3 text-sky-400" /> Requested
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <Navigation className="w-3 h-3 text-emerald-400" /> In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/30">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Delivered
          </span>
        );
      case 'pod_submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <FileText className="w-3 h-3 text-amber-400" /> POD Submitted
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <CheckCircle2 className="w-3 h-3 text-slate-400" /> Completed
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Disputed
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-700">
            <XCircle className="w-3 h-3" /> No-Show
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <XCircle className="w-3 h-3 text-slate-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    const styles = {
      paid: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/30',
      pending: 'text-amber-400 bg-amber-950/80 border-amber-600/30',
      refunded: 'text-sky-400 bg-sky-950/80 border-sky-600/30'
    };
    return (
      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${styles[paymentStatus] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
        {paymentStatus?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Dispatch & Trip Ledger (transport_bookings)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {bookings.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: Live Dispatch Map · Manual Status Override · Dispute Arbitration
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-28">Booking ID</th>
              <th className="py-3 px-4 min-w-[170px]">Customer & Persona</th>
              <th className="py-3 px-4 min-w-[220px]">Route (Pickup → Drop)</th>
              <th className="py-3 px-4 min-w-[170px]">Vehicle & Transporter</th>
              <th className="py-3 px-3 min-w-[130px]">Fare</th>
              <th className="py-3 px-3 min-w-[130px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading transport bookings...</span>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No transport bookings match the specified query or filters.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onInspectBooking(booking)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Booking ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{booking.id}</span>
                      <button
                        onClick={(e) => handleCopyId(booking.id, e)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
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
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{booking.customerName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {booking.customerMobile}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {booking.customerPersona}
                    </span>
                  </td>

                  {/* Route */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[110px]">{booking.pickupPoint.village}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate max-w-[130px]">{booking.dropPoint.mandi}</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400 font-semibold">
                      {booking.distanceKm} km trip
                    </span>
                  </td>

                  {/* Vehicle & Transporter */}
                  <td className="py-3 px-4">
                    {booking.vehicleId ? (
                      <>
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          {booking.vehicleId}
                        </div>
                        <div className="text-[11px] text-slate-300">{booking.transporterName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {booking.vehicleClass}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Awaiting transporter accept</span>
                    )}
                  </td>

                  {/* Fare */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-white text-xs">
                      ₹{booking.fareAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1">
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectBooking(booking)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        title="Inspect trip dossier and POD"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Review</span>
                      </button>

                      {(booking.status === 'disputed' || booking.status === 'no_show') && (
                        <button
                          onClick={() => onArbitrate(booking)}
                          className="p-1 text-xs text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 border border-amber-600/40 rounded-md transition-colors"
                          title="Arbitrate Dispute / No-Show"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOverrideStatus(booking)}
                        className="p-1 text-xs text-sky-400 hover:text-white bg-sky-950/60 hover:bg-sky-600 border border-sky-600/40 rounded-md transition-colors"
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
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {bookings.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
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
                    ? 'bg-emerald-600 text-white font-bold'
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
