import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Check, Lock, LogOut, KeyRound } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function ReasonConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType = 'destructive', // destructive, warning, info
  confirmText = 'Confirm Action',
  targetUser = null,
  suggestedReasons = []
}) {
  const { currentAdmin } = useAuthAdmin();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 8) {
      setError('A detailed administrative justification (minimum 8 characters) is required by SOP-01 compliance.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  actionType === 'destructive'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  SOP-01 Guardrail Verification
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description & Target User Details */}
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>

            {targetUser && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{targetUser.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{targetUser.mobile} · {targetUser.uid}</div>
                </div>
                <span className="font-mono text-xs text-emerald-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {targetUser.id}
                </span>
              </div>
            )}
          </div>

          {/* Mandatory Reason Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Administrative Reason (Mandatory for Audit Log)</span>
                <span className="text-emerald-400 text-[10px] font-mono">DPDP & SOP-01 Compliant</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows="3"
                placeholder="State the justification, ticket ID, or security incident report number..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                required
              />

              {/* Quick suggestions */}
              {suggestedReasons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggestedReasons.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReason(sug)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Sign-off: <strong className="text-slate-200">{currentAdmin.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim()}
                  className={`px-4 py-2 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-40 ${
                    actionType === 'destructive'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-950/50'
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{confirmText}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
