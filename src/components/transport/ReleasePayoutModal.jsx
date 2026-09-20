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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>POD Audit & Payout Release</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-08 Rule 3.5
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Settlement <span className="font-mono text-white font-semibold">{settlement.id}</span> • {settlement.transporterName}
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

          {/* Payout Summary */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Net Payout:</span>
              <span className="text-teal-400 font-bold">₹{settlement.payoutAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payout Mode:</span>
              <span className="text-slate-200">{settlement.payoutMode}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current POD Status:</span>
              <span className="text-white font-bold uppercase">{settlement.podAuditStatus.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Dual Sign-Off Warning */}
          {requiresDualSignOff && (
            <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Dual-Admin Sign-Off Required (Payout &gt; ₹50,000)</span>
              </div>
              <div className="text-[11px] font-mono space-y-1">
                <div className="text-slate-300">
                  Sign-offs recorded: <span className={existingSignOffs.length >= 1 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{existingSignOffs.length}/2</span>
                </div>
                {existingSignOffs.map((s, i) => (
                  <div key={i} className="flex justify-between text-slate-400">
                    <span>• {s.adminUid}</span>
                    <span>{new Date(s.signedAt).toLocaleString()}</span>
                  </div>
                ))}
                {existingSignOffs.length < 2 && (
                  <div className="text-amber-300 pt-1">
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
              className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                approved
                  ? 'bg-teal-950/40 border-teal-600/60 text-teal-200 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
              <span>POD Valid — Approve & Release</span>
            </div>
            <div
              onClick={() => setApproved(false)}
              className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${
                !approved
                  ? 'bg-rose-950/40 border-rose-600/60 text-rose-200 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <X className="w-4 h-4 mx-auto mb-1" />
              <span>POD Deficient — Reject & Withhold</span>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
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
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Payout release is irreversible and generates an immutable record in <code className="text-slate-300 font-mono">audit_logs</code> under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
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
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                approved
                  ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
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
