import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  DollarSign,
  FileText,
  User,
  ExternalLink,
  Layers,
  Scale
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function UserBookingsTable({ onOpenUserDrawer }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

  // Dispute resolution modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [resolutionAction, setResolutionAction] = useState('release_escrow');
  const [resolutionReason, setResolutionReason] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserService.listAllBookings({
        query: searchQuery,
        status: statusFilter,
        persona: personaFilter,
        paymentStatus: paymentFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setBookings(res.data.bookings);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, personaFilter, paymentFilter, page, addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenDisputeModal = (b) => {
    setSelectedBooking(b);
    setResolutionAction('release_escrow');
    setResolutionReason(
      b.status === 'disputed'
        ? 'Dispute investigation completed: ground inspection confirmed service delivery'
        : 'Administrative escrow release override'
    );
  };

  const handleConfirmDisputeResolution = async () => {
    if (!selectedBooking) return;
    if (!resolutionReason.trim()) {
      addToast({ title: 'Reason Required', message: 'Enter a valid justification reason for audit log.', type: 'warning' });
      return;
    }

    setResolving(true);
    try {
      let nextStatus = selectedBooking.status;
      let nextPayment = selectedBooking.paymentStatus;

      if (resolutionAction === 'release_escrow') {
        nextStatus = 'completed';
        nextPayment = 'Paid (Escrow Released by Superadmin)';
      } else if (resolutionAction === 'refund_buyer') {
        nextStatus = 'cancelled';
        nextPayment = 'Refunded to Counterparty';
      } else if (resolutionAction === 'dismiss_dispute') {
        nextStatus = 'active';
        nextPayment = 'Held in Escrow (Dispute Dismissed)';
      }

      const res = await adminUserService.updateBookingStatus({
        uid: selectedBooking.userId,
        bookingId: selectedBooking.id,
        status: nextStatus,
        paymentStatus: nextPayment,
        adminUid: currentAdmin.email,
        reason: resolutionReason
      });

      addToast({
        title: 'Booking Updated',
        message: res.message,
        type: 'success'
      });

      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      addToast({ title: 'Resolution Failed', message: err.message, type: 'error' });
    } finally {
      setResolving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'active':
      case 'in-transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" /> {status === 'in-transit' ? 'In Transit' : 'Active'}
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Disputed Ticket
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (payment) => {
    if (!payment) return <span className="text-slate-400 font-mono text-[10px]">Pending</span>;
    if (payment.includes('Paid') || payment.includes('Direct Bank') || payment.includes('Direct UPI')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {payment}
        </span>
      );
    }
    if (payment.includes('Dispute') || payment.includes('Hold')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          {payment}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        {payment}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Cross-Persona Bookings & Transactions (Collection:{' '}
              <span className="font-mono text-blue-300 text-xs">users/{'{uid}'}/bookings</span>)
            </h3>
            <p className="text-xs text-slate-400">
              SOP-02 §2. Service agreements, machinery rentals, produce lots, and escrow mediation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-white/10 rounded-lg font-mono text-slate-300 border border-white/10">
            Total Bookings: <strong className="text-white">{pagination.total}</strong>
          </span>
          <span className="px-2.5 py-1 bg-rose-500/20 rounded-lg font-mono text-rose-300 border border-rose-500/30">
            Disputed: <strong className="text-white">{bookings.filter((b) => b.status === 'disputed').length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by booking ID (BKG-7701), service (Tillage), user, or counterparty..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Persona Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Persona:</span>
            <select
              value={personaFilter}
              onChange={(e) => {
                setPersonaFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Personas</option>
              <option value="Farmer">Farmer</option>
              <option value="Landlord">Landlord</option>
              <option value="Equipment Owner">Equipment Owner</option>
              <option value="Transporter">Transporter</option>
              <option value="Broker">Broker</option>
              <option value="Seller">Seller</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="disputed">⚠️ Disputed Only</option>
              <option value="active">Active & In-Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={fetchBookings}
            title="Refresh Bookings"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Booking ID & Date</th>
                <th className="py-3.5 px-4">Persona</th>
                <th className="py-3.5 px-4">Service Description</th>
                <th className="py-3.5 px-4">Primary User & Counterparty</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Escrow / Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No cross-persona bookings found matching your search.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{b.id}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(b.date).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Persona */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {b.persona}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="font-bold text-slate-900">{b.service}</div>
                    </td>

                    {/* Parties */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(b.userId)}
                        className={`font-semibold text-slate-900 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        User: {b.userName}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>Counterparty: {b.counterparty}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm">₹{b.amount.toLocaleString()}</div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">{getPaymentBadge(b.paymentStatus)}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(b.status)}</td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDisputeModal(b)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ml-auto ${
                          b.status === 'disputed'
                            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{b.status === 'disputed' ? 'Resolve Dispute' : 'Audit Escrow'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{bookings.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> transaction records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-slate-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Dispute Resolution & Escrow Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-base">
                  Escrow & Dispute Intervention: <span className="font-mono text-blue-700">{selectedBooking.id}</span>
                </h4>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Service:</span>
                <span className="font-bold text-slate-900">{selectedBooking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Primary User:</span>
                <span className="text-slate-900 font-medium">{selectedBooking.userName} ({selectedBooking.persona})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Counterparty:</span>
                <span className="text-slate-900 font-medium">{selectedBooking.counterparty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Amount in Escrow:</span>
                <span className="font-bold text-emerald-700 text-sm">₹{selectedBooking.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Current Payment Status:</span>
                <span className="font-mono text-slate-800">{selectedBooking.paymentStatus}</span>
              </div>
            </div>

            {/* Select Resolution Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Administrative Intervention Action:</label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-emerald-300 bg-emerald-50/50">
                  <input
                    type="radio"
                    name="resolutionAction"
                    value="release_escrow"
                    checked={resolutionAction === 'release_escrow'}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="accent-emerald-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900 block">Release Escrow to Provider</span>
                    <span className="text-[11px] text-slate-500">Marks booking completed and releases funds immediately.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-rose-300 bg-rose-50/50">
                  <input
                    type="radio"
                    name="resolutionAction"
                    value="refund_buyer"
                    checked={resolutionAction === 'refund_buyer'}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="accent-rose-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-rose-900 block">Issue Refund to Counterparty</span>
                    <span className="text-[11px] text-slate-500">Cancels booking and reverts payment back to buyer/counterparty.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition border-slate-200">
                  <input
                    type="radio"
                    name="resolutionAction"
                    value="dismiss_dispute"
                    checked={resolutionAction === 'dismiss_dispute'}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="accent-slate-700"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Dismiss Dispute (Hold in Escrow)</span>
                    <span className="text-[11px] text-slate-500">Dismisses grievance ticket pending further physical verification.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Audit Justification */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Administrative Audit Justification (Mandatory):</label>
              <textarea
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                placeholder="Provide rationale for dispute resolution and financial escrow movement..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisputeResolution}
                disabled={resolving || !resolutionReason.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {resolving ? 'Executing...' : 'Confirm Intervention'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
