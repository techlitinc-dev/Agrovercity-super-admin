import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  FileCheck2
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

const ALLOWED_STATUSES = [
  { value: 'requested', label: 'Requested (Unassigned)' },
  { value: 'accepted', label: 'Accepted by Transporter' },
  { value: 'in_transit', label: 'In Transit (Live Dispatch)' },
  { value: 'delivered', label: 'Delivered (POD Pending)' },
  { value: 'pod_submitted', label: 'POD Submitted' },
  { value: 'completed', label: 'Completed & Settled' },
  { value: 'cancelled', label: 'Cancelled (Refund Triggered)' }
];

export function ManualStatusModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [newStatus, setNewStatus] = useState('in_transit');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setNewStatus(booking.status === 'cancelled' ? 'requested' : booking.status);
      setReason('');
      setError('');
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Manual status override requires an audit justification (minimum 8 characters).');
      return;
    }

    onConfirm({
      bookingId: booking.id,
      newStatus,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Manual Trip Status Intervention</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-08 Rule 3.3
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Booking <span className="font-mono text-white font-semibold">{booking.id}</span> ({booking.customerName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Status info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-white font-bold uppercase">{booking.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Endpoint:</span>
              <span className="text-sky-400 font-bold">PUT /v1/admin/transport/bookings/{'{id}'}/status</span>
            </div>
          </div>

          {/* New Status Select */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Force New Trip Status: *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none font-medium"
            >
              {ALLOWED_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {newStatus === 'cancelled' && (
              <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-700/50 rounded-lg p-2.5">
                Cancelling a paid booking automatically marks the fare as refunded and releases the assigned vehicle.
              </div>
            )}
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Audit Justification (Mandatory) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 chars ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. GPS trace confirms delivery at mandi gate despite transporter app crash; forcing status to delivered per evidence..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              This override generates an immutable record in <code className="text-slate-300 font-mono">audit_logs</code> with <code className="text-slate-300 font-mono">previousState</code> and <code className="text-slate-300 font-mono">newState</code> under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-lg shadow-sky-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Confirm Override</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
