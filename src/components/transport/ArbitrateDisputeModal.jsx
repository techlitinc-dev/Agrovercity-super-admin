import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Scale
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function ArbitrateDisputeModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [resolutionType, setResolutionType] = useState('uphold_farmer');
  const [refundAmount, setRefundAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const isNoShow = booking?.status === 'no_show';

  useEffect(() => {
    if (isOpen && booking) {
      setResolutionType(isNoShow ? 'uphold_farmer' : 'uphold_farmer');
      setRefundAmount(booking?.fareAmount || 0);
      setReason('');
      setError('');
    }
  }, [isOpen, booking, isNoShow]);

  if (!isOpen || !booking) return null;

  const RESOLUTIONS = [
    {
      value: 'uphold_farmer',
      label: 'Uphold Customer / Farmer',
      detail: `Cancel the trip and refund the fare (₹${(booking.fareAmount || 0).toLocaleString('en-IN')}) to the customer; transporter flagged.`,
      accent: 'border-rose-600/60 bg-rose-950/40 text-rose-200'
    },
    {
      value: 'uphold_transporter',
      label: 'Uphold Transporter',
      detail: 'Close the dispute in transporter favor; trip marked delivered/completed based on POD evidence.',
      accent: 'border-emerald-600/60 bg-emerald-950/40 text-emerald-200'
    },
    {
      value: 'partial_compensation',
      label: 'Partial Compensation / Quality Docking',
      detail: 'Complete the trip but award a negotiated compensation amount to the customer.',
      accent: 'border-amber-600/60 bg-amber-950/40 text-amber-200'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Formal arbitration reasoning (minimum 8 characters) is mandatory.');
      return;
    }

    onConfirm({
      bookingId: booking.id,
      resolutionType,
      refundAmount: Number(refundAmount) || 0,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isNoShow ? 'No-Show Arbitration' : 'Booking Dispute Arbitration'}</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-08 Rule 3.3
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Booking <span className="font-mono text-white font-semibold">{booking.id}</span> • {booking.customerName} vs {booking.transporterName || 'Unassigned'}
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

          {/* Dispute Evidence */}
          <div className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-3.5 space-y-1.5">
            <div className="text-rose-300 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reported Incident</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {booking.disputeReason || 'No dispute description recorded.'}
            </p>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>Raised By: {booking.disputeRaisedBy || 'N/A'}</span>
              <span>Fare: ₹{(booking.fareAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Resolution Options */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Binding Resolution: *
            </label>
            <div className="space-y-1.5">
              {RESOLUTIONS.map((r) => (
                <div
                  key={r.value}
                  onClick={() => setResolutionType(r.value)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    resolutionType === r.value ? r.accent : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-[11px]">{r.label}</div>
                  <div className="text-[10px] leading-relaxed mt-0.5">{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compensation Amount */}
          {(resolutionType === 'uphold_farmer' || resolutionType === 'partial_compensation') && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Refund / Compensation Amount (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Arbitration Ruling Rationale (Mandatory) *
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
              placeholder="e.g. GPS log confirms vehicle never departed home base; full fare refund ordered and transporter account flagged for review..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Arbitration rulings are binding and generate an immutable record in <code className="text-slate-300 font-mono">audit_logs</code> under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
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
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Issue Binding Ruling</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
