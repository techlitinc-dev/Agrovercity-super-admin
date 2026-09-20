import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Building2,
  TrendingDown,
  Info
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function RejectRateModal({
  isOpen,
  onClose,
  rate,
  onConfirmReject,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [reason, setReason] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && rate) {
      if (rate.deviationPercent < -15) {
        setSelectedTemplate('Exceeds -15% lower sanity band threshold (predatory low buying below fair market value).');
        setReason('Exceeds -15% lower sanity band threshold (predatory low buying below fair market value).');
      } else if (rate.deviationPercent > 15) {
        setSelectedTemplate('Rate deviates by >+15% from modal benchmark without verified premium lot certification.');
        setReason('Rate deviates by >+15% from modal benchmark without verified premium lot certification.');
      } else {
        setSelectedTemplate('');
        setReason('');
      }
      setError('');
    }
  }, [isOpen, rate]);

  if (!isOpen || !rate) return null;

  const REJECT_REASONS = [
    {
      title: 'Predatory Low Price (Below -15%)',
      desc: 'Exceeds -15% lower sanity band threshold (predatory low buying below fair market value).'
    },
    {
      title: 'Inflated / Speculative Bid (>+15%)',
      desc: 'Rate deviates by >+15% from modal benchmark without verified premium lot certification.'
    },
    {
      title: 'APMC License Issue',
      desc: 'Disputed APMC trader license or temporary suspension of trading credentials.'
    },
    {
      title: 'Quality Grade Mismatch',
      desc: 'Lot grade specification mismatch against Agmarknet Grade 1 standard for this commodity.'
    },
    {
      title: 'Excessive Logistics Deduction',
      desc: 'Anomalous freight deduction claim exceeding regional logistics benchmark.'
    }
  ];

  const handleSelectTemplate = (templateDesc) => {
    setSelectedTemplate(templateDesc);
    setReason(templateDesc);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Please provide a specific rejection explanation (minimum 8 characters) for compliance.');
      return;
    }

    onConfirmReject({
      id: rate.id,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Reject Trader Rate Submission</span>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-400 border border-rose-800 px-1.5 py-0.5 rounded">
                  SOP-04 Rule 4.2
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submission ticket: <span className="font-mono text-slate-300 font-semibold">{rate.id}</span>
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

        {/* Rate Snapshot Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Trader & Entity</span>
                <span className="text-white font-bold">{rate.vyapariName}</span>
                <span className="text-slate-400 text-[11px] block">{rate.tradeFirm}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Commodity & Mandi</span>
                <span className="text-emerald-400 font-bold">{rate.commodity}</span>
                <span className="text-slate-300 text-[11px] block">{rate.mandiName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Offered Rate</span>
                <span className="text-sm font-extrabold text-white">₹{rate.offeredRate.toLocaleString('en-IN')}/Qtl</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Agmarknet Modal</span>
                <span className="text-xs text-slate-300">₹{(rate.benchmarkModalPrice || 2250).toLocaleString('en-IN')}/Qtl</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Sanity Deviation</span>
                <span
                  className={`text-xs font-bold ${
                    rate.deviationPercent < -15
                      ? 'text-rose-400'
                      : rate.deviationPercent > 15
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {rate.deviationPercent > 0 ? `+${rate.deviationPercent}` : rate.deviationPercent}%
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Rejection Templates */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Select Standard Rejection Reason:
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {REJECT_REASONS.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectTemplate(r.desc)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedTemplate === r.desc
                      ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{r.title}</div>
                  <div className="text-[11px] mt-0.5 leading-relaxed">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Explanation Transmitted to Trader (Mandatory):
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
              placeholder="Provide specific feedback on why this rate cannot be published to farmers..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Legal / SOP Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>
              Per SOP-04, this rejection reason will be dispatched to the partner trader's mobile terminal and archived permanently in the central audit ledger.
            </span>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
