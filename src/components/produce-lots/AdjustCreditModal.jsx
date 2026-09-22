import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function AdjustCreditModal({
  isOpen,
  onClose,
  buyer,
  onSave,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();

  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && buyer) {
      setNewCreditLimit(buyer.creditLimit || '');
      setReason('');
      setError('');
    }
  }, [isOpen, buyer]);

  if (!isOpen || !buyer) return null;

  const numLimit = Number(newCreditLimit) || 0;
  const currentUdhaar = buyer.currentUdhaarBalance || 0;
  const newUtilization = numLimit > 0 ? parseFloat(((currentUdhaar / numLimit) * 100).toFixed(1)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numLimit || numLimit <= 0) {
      setError('Please enter a valid credit limit greater than 0.');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Administrative justification (minimum 8 characters) is mandatory.');
      return;
    }

    onSave({
      buyerId: buyer.buyerId || buyer.id,
      newCreditLimit: numLimit,
      reason: reason.trim()
    });
  };

  const PRESET_REASONS = [
    'Seasonal harvest credit expansion approved per bank solvency certificate.',
    'Credit limit reduced due to delayed payment on previous B2B contract.',
    'Routine annual credit assessment review per APMC license grade.',
    'Collateral guarantee deposited in agro escrow pool account.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/70 via-emerald-50/80 to-emerald-100/50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Adjust Trader Credit & Udhaar Limit</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                  SOP-05 Section 3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Trader: <span className="text-slate-900 font-bold">{buyer.buyerFirm}</span> ({buyer.apmcLicenseNo})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Financial Status Card */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 space-y-2 font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Current Udhaar Outstanding</span>
                <span className="text-sm font-bold text-amber-800">₹{currentUdhaar.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Existing Credit Limit</span>
                <span className="text-sm font-bold text-slate-900">₹{(buyer.creditLimit || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100 text-slate-600 flex items-center justify-between text-[11px] font-medium">
              <span>Simulated New Utilization:</span>
              <span className={`font-bold ${newUtilization > 100 ? 'text-rose-600' : newUtilization > 75 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {newUtilization}%
              </span>
            </div>
          </div>

          {/* New Limit Input */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Revised Credit Limit (₹ Indian Rupees) *
            </label>
            <input
              type="number"
              value={newCreditLimit}
              onChange={(e) => setNewCreditLimit(e.target.value)}
              placeholder="5000000"
              required
              min="100000"
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">
                Administrative Justification (Mandatory) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 chars ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="State reason for credit limit modification..."
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />

            {/* Presets */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_REASONS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(p)}
                  className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 text-left font-medium transition-colors"
                >
                  + {p.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Recorded in immutable audit logs under admin <code className="text-emerald-950 font-bold font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Credit Limit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
