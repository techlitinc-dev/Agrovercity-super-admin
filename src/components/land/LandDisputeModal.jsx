import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const DUAL_SIGNOFF_THRESHOLD = 50000;

export function LandDisputeModal({
  isOpen,
  onClose,
  lease,
  onConfirm,
  loading = false
}) {
  const [resolution, setResolution] = useState('refunded_tenant');
  const [splitAmount, setSplitAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && lease) {
      setResolution('refunded_tenant');
      setSplitAmount('');
      setReason('');
      setError('');
    }
  }, [isOpen, lease]);

  if (!isOpen || !lease) return null;

  const deposit = lease.securityDeposit || 0;
  const requiresDualSignOff = deposit > DUAL_SIGNOFF_THRESHOLD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Arbitration explanation (minimum 8 characters) is mandatory for statutory compliance.');
      return;
    }
    if (resolution === 'split' && (!splitAmount || Number(splitAmount) <= 0 || Number(splitAmount) > deposit)) {
      setError(`Please specify a valid split refund amount between ₹1 and ₹${deposit.toLocaleString('en-IN')}.`);
      return;
    }

    onConfirm({
      leaseId: lease.id,
      reason: reason.trim(),
      depositResolution: resolution,
      splitAmount: resolution === 'split' ? Number(splitAmount) : 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Arbitrate Lease Dispute & Termination</span>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-10 §3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Lease #{lease.id} • {lease.landlordName} × {lease.tenantName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-purple-100/50 transition-colors"
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

          {/* Lease & Dispute Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Plot & Term:</span>
              <span className="font-semibold text-slate-900">{lease.surveyNo}, {lease.district} ({lease.areaAcres} acres)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Security Deposit at Stake:</span>
              <span className="font-mono font-bold text-emerald-800">₹{deposit.toLocaleString('en-IN')}</span>
            </div>
            {lease.disputeReason && (
              <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="font-bold">Recorded Dispute: </span>{lease.disputeReason}
              </div>
            )}
          </div>

          {/* Resolution Options */}
          <div>
            <label className="text-slate-800 font-semibold block mb-2">
              Security Deposit Disposition *
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setResolution('refunded_tenant')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  resolution === 'refunded_tenant'
                    ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900">Full 100% Refund to Tenant</div>
                  <div className="text-[10px] text-slate-500">No damage or unjustified landlord withholding found</div>
                </div>
                <span className="font-mono font-bold text-emerald-700">₹{deposit.toLocaleString('en-IN')}</span>
              </label>

              <label
                onClick={() => setResolution('forfeited')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  resolution === 'forfeited'
                    ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900">Forfeit 100% to Landlord</div>
                  <div className="text-[10px] text-slate-500">Severe tenant default, unpaid rent or permanent land degradation</div>
                </div>
                <span className="font-mono font-bold text-rose-700">₹{deposit.toLocaleString('en-IN')}</span>
              </label>

              <label
                onClick={() => setResolution('split')}
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-2 transition-all ${
                  resolution === 'split'
                    ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Mediated Split Resolution</div>
                    <div className="text-[10px] text-slate-500">Partial tenant refund, remainder awarded to landlord</div>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                    Custom Split
                  </span>
                </div>
                {resolution === 'split' && (
                  <div className="mt-1 pt-2 border-t border-sky-200 flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Refund to Tenant: ₹</span>
                    <input
                      type="number"
                      min="1"
                      max={deposit}
                      value={splitAmount}
                      onChange={(e) => setSplitAmount(e.target.value)}
                      placeholder="e.g. 100000"
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none w-32"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">
                      (Landlord: ₹{Math.max(0, deposit - (Number(splitAmount) || 0)).toLocaleString('en-IN')})
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Rationale */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                Arbitration Rationale (Mandatory) *
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
              placeholder="e.g. Conducted virtual hearing with both parties. Crop loss verified via Talathi panchanama. Tenant agreed to partial settlement..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Rule 3 Notice */}
          {requiresDualSignOff && (
            <div className="flex items-start gap-2 text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <span>
                <strong>SOP-10 Rule 3:</strong> Because deposit resolution exceeds ₹50,000, two superadmin sign-offs are required before funds are disbursed.
              </span>
            </div>
          )}

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
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Arbitration & Terminate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
