import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

const DUAL_SIGNOFF_THRESHOLD = 50000;

export function DepositForfeitureModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [resolution, setResolution] = useState('forfeit_full');
  const [partialAmount, setPartialAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setResolution('forfeit_full');
      setPartialAmount('');
      setReason('');
      setError('');
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const deposit = booking.securityDeposit || 0;
  const forfeited =
    resolution === 'forfeit_full'
      ? deposit
      : resolution === 'forfeit_partial'
      ? Math.min(Number(partialAmount) || 0, deposit)
      : 0;
  const requiresDualSignOff = forfeited > DUAL_SIGNOFF_THRESHOLD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Damage resolution reasoning (minimum 8 characters) is mandatory for audit compliance.');
      return;
    }
    if (resolution === 'forfeit_partial' && forfeited <= 0) {
      setError('Partial forfeiture amount must be greater than ₹0.');
      return;
    }

    onConfirm({
      bookingId: booking.id,
      resolution,
      amount: forfeited,
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
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Damage Report & Deposit Resolution</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-09 Rule 3.4
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {booking.id} • {booking.farmerName} • Deposit ₹{deposit.toLocaleString('en-IN')}
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

          {/* Damage Report */}
          <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Reported Damage</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {booking.damageReport?.description}
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Reported {booking.damageReport?.reportedAt ? new Date(booking.damageReport.reportedAt).toLocaleString() : 'N/A'}
            </div>
          </div>

          {/* Resolution Selection */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Deposit Ruling:
            </label>
            {[
              { key: 'forfeit_full', label: `Forfeit full deposit — ₹${deposit.toLocaleString('en-IN')}`, hint: 'Owner receives the entire security deposit.' },
              { key: 'forfeit_partial', label: 'Partial forfeiture — enter amount', hint: 'Remainder released back to the farmer.' },
              { key: 'release_deposit', label: 'Release deposit to farmer', hint: 'Damage claim dismissed; full deposit returned.' }
            ].map(({ key, label, hint }) => (
              <label
                key={key}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  resolution === key
                    ? 'bg-amber-950/40 border-amber-600/60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="resolution"
                    checked={resolution === key}
                    onChange={() => setResolution(key)}
                    className="border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <div className="text-slate-200 font-semibold">{label}</div>
                    <div className="text-[10px] text-slate-500">{hint}</div>
                  </div>
                </div>
              </label>
            ))}

            {resolution === 'forfeit_partial' && (
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max={deposit}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder={`Max ₹${deposit.toLocaleString('en-IN')}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          {/* Ruling Preview */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Forfeited to Owner:</span>
              <span className="text-amber-400 font-bold">₹{forfeited.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Released to Farmer:</span>
              <span className="text-teal-400 font-bold">₹{(deposit - forfeited).toLocaleString('en-IN')}</span>
            </div>
            {requiresDualSignOff && (
              <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-slate-800/60">
                <span>Dual Sign-Off:</span>
                <span>REQUIRED (1/2 will be recorded)</span>
              </div>
            )}
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Damage Resolution Reasoning (Mandatory) *
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
              placeholder="e.g. Repair estimate verified with authorized service centre; hydraulic seal replacement quoted at ₹18,500 — partial forfeiture covers documented damage..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Immutable <code className="text-slate-300 font-mono">audit_logs</code> record created under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>. Forfeitures exceeding ₹50,000 require dual-admin sign-off.
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
                  <ShieldCheck className="w-4 h-4" />
                  <span>Record Ruling</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
