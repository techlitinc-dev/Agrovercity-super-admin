import React, { useState } from 'react';
import { XCircle, X, AlertTriangle } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function RejectConfirmationModal({ isOpen, onClose, item, onConfirm }) {
  const { currentAdmin } = useAuthAdmin();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const templates = [
    'Blurry / unreadable document scan; unable to verify text with OCR pipeline',
    'Name mismatch between user profile and document legal title',
    'Expired document / roadworthiness fitness lapsed; re-inspection required',
    'Aadhaar number not masked per DPDP Act compliance standard',
    '7/12 land extract outdated (>3 months old); latest digital copy needed',
    'APMC license commercial registration expired or missing valid security bond'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalReason = customReason.trim() || selectedTemplate;
    if (!finalReason || finalReason.length < 8) {
      setError('A specific rejection reason (minimum 8 characters) is mandatory.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm({ id: item.id, reason: finalReason });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/60">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Reject KYC Verification
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  POST /v1/admin/kyc/{item.id}/reject (SOP-03)
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

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Target Document & User Summary */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{item.docName}</span>
                <div className="text-slate-400 font-mono text-[11px]">
                  User: {item.userName} ({item.userMobile})
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
                {item.id}
              </span>
            </div>

            {/* Standard Predefined Rejection Reasons */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Predefined Reason Template:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {templates.map((tpl, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setCustomReason(tpl);
                      if (error) setError('');
                    }}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-colors ${
                      selectedTemplate === tpl
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Reason Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Mandatory Reason (Sent to User & Written to Audit Log) *
              </label>
              <textarea
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (error) setError('');
                }}
                rows="3"
                placeholder="Explain why this document was rejected and what the user must provide to resolve it..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                required
              />
            </div>

            {error && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Audited Admin: <strong className="text-slate-200">{currentAdmin.email}</strong>
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
                  disabled={loading || !customReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center gap-1.5 disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Commit Rejection</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
