import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export function Audit712Modal({
  isOpen,
  onClose,
  listing,
  plot,
  onConfirm,
  loading = false
}) {
  const [actionType, setActionType] = useState('verify'); // 'verify' | 'flag'
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const target = listing || plot;

  useEffect(() => {
    if (isOpen) {
      setActionType('verify');
      setReason('');
      setError('');
    }
  }, [isOpen, target]);

  if (!isOpen || !target) return null;

  const isVerify = actionType === 'verify';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Administrative explanation (minimum 8 characters) is required for 7/12 audit logging.');
      return;
    }

    onConfirm({
      listingId: target.id,
      verified: isVerify,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isVerify ? 'bg-emerald-50/60 border-emerald-100' : 'bg-rose-50/70 border-rose-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${
              isVerify
                ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                : 'bg-rose-100 border-rose-200 text-rose-700'
            }`}>
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isVerify ? 'Verify 7/12 Land Ownership' : 'Flag Listing as Fraudulent'}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-10 §3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {target.id} • Survey No. {target.surveyNo} • {target.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
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

          {/* Action Selector */}
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-100">
            <button
              type="button"
              onClick={() => setActionType('verify')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                isVerify ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verify Against 7/12 (Approve)
            </button>
            <button
              type="button"
              onClick={() => setActionType('flag')}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                !isVerify ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flag Mismatch / Fraud
            </button>
          </div>

          {/* Target Metadata Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Landowner:</span>
              <span className="font-bold text-slate-900">{target.landlordName || target.ownerName}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">Cadastral Survey:</span>
              <span className="font-bold text-emerald-800">S.No. {target.surveyNo} ({target.areaAcres || target.totalAcres} Acres)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-700">{target.taluka || target.village}, {target.district}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed">
            {isVerify
              ? 'Approving this listing confirms the survey number and owner name match the digital MahaBhulekh 7/12 extract. The listing will go live on the public leasing marketplace.'
              : 'Flagging this listing pulls it from the public marketplace immediately and writes a fraud alert into statutory audit logs.'}
          </div>

          {/* Rationale */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                Administrative Rationale (Mandatory) *
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
                isVerify
                  ? 'e.g. Survey number 0712/2/34 verified against Mahabhulekh Dindori taluka digital record — ownership name verified with Aadhaar.'
                  : 'e.g. Survey number registered under different legal khatedar on Mahabhulekh. Listing pulled for fraud investigation.'
              }
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
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
              disabled={loading || reason.trim().length < 8}
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xs ${
                isVerify ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : isVerify ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Listing</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Flag as Fraud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
