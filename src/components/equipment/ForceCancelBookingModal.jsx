import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  IndianRupee
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function ForceCancelBookingModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [reason, setReason] = useState('');
  const [refundMode, setRefundMode] = useState('full'); // 'full' | 'partial' | 'none'
  const [partialAmount, setPartialAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setReason('');
      setRefundMode('full');
      setPartialAmount('');
      setError('');
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const refundAmount =
    refundMode === 'full'
      ? booking.priceRupees
      : refundMode === 'partial'
      ? Math.min(Number(partialAmount) || 0, booking.priceRupees)
      : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Force cancellation requires an audit justification (minimum 8 characters).');
      return;
    }
    if (refundMode === 'partial' && refundAmount <= 0) {
      setError('Partial refund amount must be greater than ₹0.');
      return;
    }

    onConfirm({
      bookingId: booking.id,
      refundAmount,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Admin Force Cancellation</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-09 · DELETE /bookings/{'{id}'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {booking.id} • {booking.farmerName} • {booking.equipmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-3 gap-2.5 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Slot Window</span>
              <span className="text-slate-900 font-bold">{booking.date}</span>
              <span className="text-slate-500 block text-[10px]">{booking.slotName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Slot Price</span>
              <span className="text-slate-900 font-bold">₹{booking.priceRupees?.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Booking Mode</span>
              <span className="text-slate-900 font-bold uppercase">{booking.ownerType}</span>
            </div>
          </div>

          {/* Refund Mode Selection */}
          <div className="space-y-2">
            <label className="block text-slate-800 font-semibold mb-1.5">
              Farmer Refund Decision:
            </label>
            {[
              { key: 'full', label: `Full refund — ₹${booking.priceRupees?.toLocaleString('en-IN')}`, hint: 'Slot price refunded in full to the farmer.' },
              { key: 'partial', label: 'Partial refund — enter amount', hint: 'Refund a specific amount (≤ slot price).' },
              { key: 'none', label: 'No refund', hint: 'Farmer forfeits the slot price (dispute loss).' }
            ].map(({ key, label, hint }) => (
              <label
                key={key}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  refundMode === key
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="refundMode"
                    checked={refundMode === key}
                    onChange={() => setRefundMode(key)}
                    className="border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-slate-900 font-semibold">{label}</div>
                    <div className="text-[10px] text-slate-500">{hint}</div>
                  </div>
                </div>
              </label>
            ))}

            {refundMode === 'partial' && (
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max={booking.priceRupees}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder={`Max ₹${booking.priceRupees?.toLocaleString('en-IN')}`}
                  className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          {/* Consequences Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Refund Queued:</span>
              <span className="text-emerald-700 font-bold">₹{refundAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Slot Action:</span>
              <span className="text-slate-900 font-bold">RELEASED / WAITLIST PROMOTED</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Override Scope:</span>
              <span className="text-amber-700 font-bold">BYPASSES 2-HR CANCEL WINDOW</span>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                Administrative Justification (Mandatory) *
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
              placeholder="e.g. Double-booking anomaly confirmed — second booking on slot EQ-902_2026-09-21_10-02 cancelled, original holder retains the slot..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Immutable <code className="text-slate-800 font-mono">audit_logs</code> record created under admin <code className="text-slate-800 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>. Both the farmer and the machine owner are notified.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Confirm Force Cancellation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
