import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Edit3,
  Scale,
  Building2,
  Database
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function ManualRateOverrideModal({
  isOpen,
  onClose,
  benchmark,
  benchmarksList = [],
  onSave,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();

  const [selectedMandiId, setSelectedMandiId] = useState('');
  const [modalPrice, setModalPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [arrivalTonnage, setArrivalTonnage] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const currentBenchmark =
    (benchmarksList && benchmarksList.find((b) => b.id === selectedMandiId)) ||
    benchmark ||
    (benchmarksList && benchmarksList[0]);

  useEffect(() => {
    if (benchmark) {
      setSelectedMandiId(benchmark.id);
      setModalPrice(benchmark.modalPrice || '');
      setMinPrice(benchmark.minPrice || Math.round(benchmark.modalPrice * 0.85));
      setMaxPrice(benchmark.maxPrice || Math.round(benchmark.modalPrice * 1.15));
      setArrivalTonnage(benchmark.arrivalTonnage || '');
      setReason('');
      setError('');
    } else if (benchmarksList && benchmarksList.length > 0) {
      const first = benchmarksList[0];
      setSelectedMandiId(first.id);
      setModalPrice(first.modalPrice || '');
      setMinPrice(first.minPrice || Math.round(first.modalPrice * 0.85));
      setMaxPrice(first.maxPrice || Math.round(first.modalPrice * 1.15));
      setArrivalTonnage(first.arrivalTonnage || '');
      setReason('');
      setError('');
    }
  }, [benchmark, isOpen]);

  const handleMandiChange = (mandiId) => {
    setSelectedMandiId(mandiId);
    const found = benchmarksList.find((b) => b.id === mandiId);
    if (found) {
      setModalPrice(found.modalPrice || '');
      setMinPrice(found.minPrice || Math.round(found.modalPrice * 0.85));
      setMaxPrice(found.maxPrice || Math.round(found.modalPrice * 1.15));
      setArrivalTonnage(found.arrivalTonnage || '');
    }
  };

  const handleModalPriceChange = (val) => {
    const num = Number(val);
    setModalPrice(val);
    if (num > 0) {
      setMinPrice(Math.round(num * 0.85));
      setMaxPrice(Math.round(num * 1.15));
    }
  };

  if (!isOpen) return null;

  const numModal = Number(modalPrice) || 0;
  const lowerBand = Math.round(numModal * 0.85);
  const upperBand = Math.round(numModal * 1.15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numModal || numModal <= 0) {
      setError('Please specify a valid modal price greater than 0.');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Administrative justification is mandatory (minimum 8 characters) for audit trail compliance.');
      return;
    }

    onSave({
      id: currentBenchmark?.id || selectedMandiId,
      modalPrice: numModal,
      minPrice: Number(minPrice) || lowerBand,
      maxPrice: Number(maxPrice) || upperBand,
      arrivalTonnage: Number(arrivalTonnage) || currentBenchmark?.arrivalTonnage || 0,
      reason: reason.trim(),
      adminUid: currentAdmin?.email || 'root@agrovercity'
    });
  };

  const REASON_TEMPLATES = [
    'Agmarknet central portal API timed out; physically verified with local APMC bulletin board.',
    'Heavy post-harvest arrivals caused spot modal correction before scheduled API crawl.',
    'District Mandi Samiti notified revised minimum support and auction modal rates today.',
    'Corrupted API payload returned 0 value; restoring verified physical floor price.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Manual Mandi Benchmark Override</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  SOP-04 Rule 4.3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Override government Agmarknet benchmark for broken or delayed API feeds
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
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Mandi Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Target Mandi & Commodity Benchmark:
            </label>
            <select
              value={selectedMandiId}
              onChange={(e) => handleMandiChange(e.target.value)}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              {benchmarksList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.mandiName} ({b.district}, {b.state}) — {b.commodity} ({b.variety}) [Current: ₹{b.modalPrice}/Qtl]
                </option>
              ))}
            </select>
          </div>

          {/* Current Mandi Info Banner */}
          {currentBenchmark && (
            <div className="bg-white border border-emerald-100 rounded-xl p-3 grid grid-cols-3 gap-2 text-slate-700 font-mono shadow-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Current Modal</span>
                <span className="text-slate-900 font-bold text-sm">₹{currentBenchmark.modalPrice}/Qtl</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Source Feed</span>
                <span className="text-slate-600 truncate block font-medium">{currentBenchmark.sourceApi || 'Agmarknet'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-semibold">Last Sync</span>
                <span className="text-slate-600 font-medium">
                  {new Date(currentBenchmark.syncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}

          {/* Price Inputs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Modal Price (₹/Qtl) *
              </label>
              <input
                type="number"
                value={modalPrice}
                onChange={(e) => handleModalPriceChange(e.target.value)}
                placeholder="2350"
                min="100"
                required
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Min Price (₹/Qtl)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="2100"
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Max Price (₹/Qtl)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="2500"
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Arrival Tonnage */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Arrival Volume Today (Metric Tonnes - MT):
            </label>
            <input
              type="number"
              value={arrivalTonnage}
              onChange={(e) => setArrivalTonnage(e.target.value)}
              placeholder="1200"
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Sanity Band Dynamic Corridor Preview */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between font-medium">
              <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Computed ±15% Sanity Corridor:</span>
              </span>
              <span className="font-mono text-emerald-900 text-xs font-bold">
                ₹{lowerBand.toLocaleString('en-IN')} – ₹{upperBand.toLocaleString('en-IN')} / Qtl
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Trader bids below <strong className="text-rose-700 font-mono">₹{lowerBand}</strong> will trigger Predatory Low alerts. Bids above <strong className="text-amber-700 font-mono">₹{upperBand}</strong> will require supervisor approval.
            </p>
          </div>

          {/* Mandatory Audit Justification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold flex items-center gap-1">
                <span>Administrative Audit Justification *</span>
                <span className="text-[10px] text-rose-600 font-semibold">(Mandatory)</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 characters ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="State the verifiable reason for manually overriding the government mandi feed..."
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-sans"
            />

            {/* Quick Templates */}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {REASON_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(tmpl)}
                  className="text-[10px] bg-white hover:bg-emerald-50 text-slate-700 px-2 py-1 rounded-lg border border-emerald-200 transition-colors text-left shadow-xs"
                >
                  + {tmpl.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Audit Trail & Compliance Note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              This action will be stamped under admin <code className="text-emerald-800 font-mono font-semibold">{currentAdmin?.email || 'root@agrovercity'}</code> with client IP and immutable timestamp in <code className="text-slate-700 font-mono font-semibold">audit_logs</code>.
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 rounded-xl font-semibold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording Override...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Benchmark Override</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
