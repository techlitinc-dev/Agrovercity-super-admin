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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white/95 border border-emerald-200/90 rounded-2xl shadow-2xl relative z-10 backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  actionType === 'destructive'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
                <span className="text-xs text-emerald-800 font-mono font-medium">
                  SOP-01 Guardrail Verification
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description & Target User Details */}
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>

            {targetUser && (
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{targetUser.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{targetUser.mobile} · {targetUser.uid}</div>
                </div>
                <span className="font-mono text-xs text-emerald-900 font-bold px-2 py-0.5 rounded bg-white border border-emerald-200 shadow-2xs">
                  {targetUser.id}
                </span>
              </div>
            )}
          </div>

          {/* Mandatory Reason Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Administrative Reason (Mandatory for Audit Log)</span>
                <span className="text-emerald-700 text-[10px] font-mono font-semibold">DPDP & SOP-01 Compliant</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows="3"
                placeholder="State the justification, ticket ID, or security incident report number..."
                className="w-full px-3.5 py-2.5 bg-emerald-50/30 border border-emerald-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
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
                      className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors font-medium"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                Sign-off: <strong className="text-slate-800">{currentAdmin.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-semibold rounded-xl transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim()}
                  className={`px-4 py-2 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-40 text-white ${
                    actionType === 'destructive'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
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
