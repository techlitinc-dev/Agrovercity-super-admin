import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  ShieldAlert,
  CalendarClock,
  IndianRupee,
  UserCheck
} from 'lucide-react';

export function ResolveAnomalyModal({
  isOpen,
  onClose,
  slot,
  bookings = [],
  onConfirm,
  loading = false
}) {
  const [selectedWinnerId, setSelectedWinnerId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Find conflicting bookings for this slot
  const slotBookings = slot
    ? bookings.filter((b) => b.slotId === slot.id && b.status !== 'cancelled')
    : [];

  useEffect(() => {
    if (isOpen && slot) {
      if (slotBookings.length > 0) {
        setSelectedWinnerId(slotBookings[0].id);
      }
      setReason('');
      setError('');
    }
  }, [isOpen, slot]);

  if (!isOpen || !slot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWinnerId) {
      setError('Please select a confirmed booking recipient for this slot.');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Administrative justification (minimum 8 characters) is mandatory for resolving double-booking anomalies.');
      return;
    }

    onConfirm({
      slotId: slot.id,
      winningBookingId: selectedWinnerId,
      conflictingAction: 'refund',
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Resolve Slot Double-Booking Anomaly</span>
                <span className="text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-09 §3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {slot.equipmentName} • {slot.date} ({slot.slotName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-rose-100/50 transition-colors"
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

          <div className="text-[11px] text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
            Two farmers have conflicting bookings on this 4-hour Yantra window. Select which booking is honored. The unselected booking will be automatically cancelled with a 100% full refund of rental fee + security deposit.
          </div>

          {/* Conflicting Candidates Radio Selection */}
          <div>
            <label className="text-slate-800 font-semibold block mb-2">
              Select Farmer to Retain Slot *
            </label>
            <div className="space-y-2">
              {slotBookings.map((b, idx) => {
                const isSelected = selectedWinnerId === b.id;
                const totalRefund = (b.priceRupees || 0) + (b.securityDeposit || 0);

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedWinnerId(b.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="winningBooking"
                        checked={isSelected}
                        onChange={() => setSelectedWinnerId(b.id)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{b.farmerName}</span>
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {b.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {b.farmerMobile} • Booked: {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-1">
                          Paid: ₹{(b.priceRupees || 0).toLocaleString('en-IN')} + Deposit ₹{(b.securityDeposit || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" /> Honored
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-rose-600 block">
                          Refund: ₹{totalRefund.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rationale */}
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
              placeholder="e.g. Booking timestamp priority honored; second farmer issued 100% instant refund with priority rebooking advisory..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Resolution is immutably logged into <code className="text-slate-800 font-mono">audit_logs</code> (SOP-09 Rule 2).
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8 || !selectedWinnerId}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Confirm Resolution</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
