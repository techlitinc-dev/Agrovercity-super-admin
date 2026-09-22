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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Reject KYC Verification
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  POST /v1/admin/kyc/{item.id}/reject (SOP-03)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Target Document & User Summary */}
            <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs flex justify-between items-center shadow-xs">
              <div>
                <span className="font-bold text-slate-900">{item.docName}</span>
                <div className="text-slate-500 font-mono text-[11px]">
                  User: {item.userName} ({item.userMobile})
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {item.id}
              </span>
            </div>

            {/* Standard Predefined Rejection Reasons */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                        : 'bg-white border-emerald-100 text-slate-600 hover:text-slate-900 hover:bg-emerald-50/50'
                    }`}
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Reason Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
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
                className="w-full px-3.5 py-2 bg-emerald-50/30 border border-emerald-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                Audited Admin: <strong className="text-slate-800">{currentAdmin.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white hover:bg-emerald-50 text-slate-700 font-semibold rounded-xl border border-emerald-200 transition-colors shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !customReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40"
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
