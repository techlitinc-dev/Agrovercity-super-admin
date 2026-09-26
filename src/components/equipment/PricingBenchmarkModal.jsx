import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  AlertTriangle,
  ShieldAlert,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';

export function PricingBenchmarkModal({
  isOpen,
  onClose,
  benchmark,
  onConfirm,
  loading = false
}) {
  const [newCapRate, setNewCapRate] = useState('');
  const [maxVariance, setMaxVariance] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && benchmark) {
      setNewCapRate(String(benchmark.benchmarkCapHourly || ''));
      setMaxVariance(String(benchmark.maxVariancePercent || '20'));
      setReason('');
      setError('');
    }
  }, [isOpen, benchmark]);

  if (!isOpen || !benchmark) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCapRate || Number(newCapRate) <= 0) {
      setError('Please provide a valid benchmark cap rate (> ₹0).');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Mandatory administrative rationale (minimum 8 characters) is required for statutory compliance.');
      return;
    }

    onConfirm({
      benchmarkId: benchmark.id,
      newCapRate: Number(newCapRate),
      maxVariancePercent: Number(maxVariance) || 20,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Adjust District Pricing Benchmark</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-09 §3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {benchmark.district} • {benchmark.machineryClass} ({benchmark.id})
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

          {/* Current Benchmark Summary */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Market Rate Indicators
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Current Cap</span>
                <span className="font-bold text-emerald-700">₹{benchmark.benchmarkCapHourly}/hr</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">FPO Avg</span>
                <span className="font-bold text-sky-700">₹{benchmark.fpoPoolAvgHourly}/hr</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Private Avg</span>
                <span className="font-bold text-slate-800">₹{benchmark.privatePoolAvgHourly}/hr</span>
              </div>
            </div>
          </div>

          {/* Editable Benchmark Rates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                New Benchmark Cap (₹/hr) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={newCapRate}
                  onChange={(e) => setNewCapRate(e.target.value)}
                  placeholder="e.g. 850"
                  className="w-full pl-8 pr-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Max Allowed Variance (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={maxVariance}
                  onChange={(e) => setMaxVariance(e.target.value)}
                  placeholder="20"
                  className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
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
              placeholder="e.g. District agricultural mechanization committee approved revision due to local diesel fuel index increase..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Tariff revisions are immutably logged in <code className="text-slate-800 font-mono">audit_logs</code>.
            </span>
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
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply Benchmark Revision</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
