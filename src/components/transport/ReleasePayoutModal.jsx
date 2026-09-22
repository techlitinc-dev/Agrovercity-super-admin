import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function ReleasePayoutModal({
  isOpen,
  onClose,
  settlement,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [approved, setApproved] = useState(true);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && settlement) {
      setApproved(true);
      setReason('');
      setError('');
    }
  }, [isOpen, settlement]);

  if (!isOpen || !settlement) return null;

  const requiresDualSignOff = settlement.payoutAmount > 50000 && settlement.podAuditStatus !== 'released';
  const existingSignOffs = settlement.signOffs || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('POD audit rationale (minimum 8 characters) is mandatory.');
      return;
    }

    onConfirm({
      settlementId: settlement.id,
      approved,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>POD Audit & Payout Release</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-08 Rule 3.5
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Settlement <span className="font-mono text-slate-900 font-bold">{settlement.id}</span> • {settlement.transporterName}
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

          {/* Payout Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Net Payout:</span>
              <span className="text-emerald-700 font-bold">₹{settlement.payoutAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payout Mode:</span>
              <span className="text-slate-900 font-medium">{settlement.payoutMode}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Current POD Status:</span>
              <span className="text-slate-900 font-bold uppercase">{settlement.podAuditStatus.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Dual Sign-Off Warning */}
          {requiresDualSignOff && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Dual-Admin Sign-Off Required (Payout &gt; ₹50,000)</span>
              </div>
              <div className="text-[11px] font-mono space-y-1">
                <div className="text-slate-700">
                  Sign-offs recorded: <span className={existingSignOffs.length >= 1 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>{existingSignOffs.length}/2</span>
                </div>
                {existingSignOffs.map((s, i) => (
                  <div key={i} className="flex justify-between text-slate-600">
                    <span>• {s.adminUid}</span>
                    <span>{new Date(s.signedAt).toLocaleString()}</span>
                  </div>
                ))}
                {existingSignOffs.length < 2 && (
                  <div className="text-amber-800 pt-1 font-sans">
                    Your sign-off will be recorded as {existingSignOffs.length + 1}/2. Payout releases only after the second superadmin approves.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Audit Decision */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => setApproved(true)}
              className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                approved
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <span>POD Valid — Approve & Release</span>
            </div>
            <div
              onClick={() => setApproved(false)}
              className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                !approved
                  ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <X className="w-4 h-4 mx-auto mb-1 text-rose-600" />
              <span>POD Deficient — Reject & Withhold</span>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                POD Audit Rationale (Mandatory) *
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
              placeholder={
                approved
                  ? 'e.g. POD consignee signature and gate pass #5521 verified against mandi entry log; releasing payout...'
                  : 'e.g. POD image is a duplicate of a prior trip consignment note; withholding payout pending re-upload...'
              }
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Payout release is irreversible and generates an immutable record in <code className="text-slate-800 font-mono">audit_logs</code> under admin <code className="text-slate-800 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
            </span>
          </div>

          {/* Footer Actions */}
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
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                approved
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>{approved ? (requiresDualSignOff ? 'Record Sign-Off' : 'Confirm Release') : 'Confirm Rejection'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
