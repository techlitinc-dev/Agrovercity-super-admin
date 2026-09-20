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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Adjust Trader Credit & Udhaar Limit</span>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                  SOP-05 Section 3
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Trader: <span className="text-slate-200 font-semibold">{buyer.buyerFirm}</span> ({buyer.apmcLicenseNo})
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

          {/* Current Financial Status Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Current Udhaar Outstanding</span>
                <span className="text-sm font-bold text-amber-400">₹{currentUdhaar.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Existing Credit Limit</span>
                <span className="text-sm font-bold text-slate-200">₹{(buyer.creditLimit || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-slate-400 flex items-center justify-between text-[11px]">
              <span>Simulated New Utilization:</span>
              <span className={`font-bold ${newUtilization > 100 ? 'text-rose-400' : newUtilization > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {newUtilization}%
              </span>
            </div>
          </div>

          {/* New Limit Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Revised Credit Limit (₹ Indian Rupees) *
            </label>
            <input
              type="number"
              value={newCreditLimit}
              onChange={(e) => setNewCreditLimit(e.target.value)}
              placeholder="5000000"
              required
              min="100000"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
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
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />

            {/* Presets */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_REASONS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(p)}
                  className="text-[10px] bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-left"
                >
                  + {p.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Recorded in immutable audit logs under admin <code className="text-amber-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
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
