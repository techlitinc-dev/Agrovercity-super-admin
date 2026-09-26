import React, { useState, useEffect } from 'react';
import { X, Tag, CheckCircle2 } from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';

export function FareBandModal({
  isOpen,
  onClose,
  fareBand,
  onSave,
  loading = false
}) {
  const [baseFare, setBaseFare] = useState('');
  const [perKmRate, setPerKmRate] = useState('');
  const [waitingChargePerHour, setWaitingChargePerHour] = useState('');
  const [nightSurchargePercent, setNightSurchargePercent] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (fareBand) {
      setBaseFare(String(fareBand.baseFare || ''));
      setPerKmRate(String(fareBand.perKmRate || ''));
      setWaitingChargePerHour(String(fareBand.waitingChargePerHour || ''));
      setNightSurchargePercent(String(fareBand.nightSurchargePercent || ''));
      setReason('');
    }
  }, [fareBand]);

  if (!isOpen || !fareBand) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      alert('Administrative justification (min 8 characters) is required for tariff change audit.');
      return;
    }
    onSave({
      id: fareBand.id,
      baseFare: Number(baseFare),
      perKmRate: Number(perKmRate),
      waitingChargePerHour: Number(waitingChargePerHour),
      nightSurchargePercent: Number(nightSurchargePercent),
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Adjust Transport Fare Band #{fareBand.id}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {fareBand.district} · {fareBand.vehicleClass}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1">
            <div className="font-bold text-slate-900">{fareBand.corridor}</div>
            <div className="text-[11px] text-slate-600">
              Vehicle: <strong className="text-slate-800">{fareBand.vehicleClass}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Base Fare (₹)</label>
              <input
                type="number"
                min="100"
                value={baseFare}
                onChange={(e) => setBaseFare(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Per-Km Tariff (₹/km)</label>
              <input
                type="number"
                min="5"
                value={perKmRate}
                onChange={(e) => setPerKmRate(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Waiting Charge (₹/hr)</label>
              <input
                type="number"
                min="0"
                value={waitingChargePerHour}
                onChange={(e) => setWaitingChargePerHour(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Night Surcharge (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={nightSurchargePercent}
                onChange={(e) => setNightSurchargePercent(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Tariff Revision Justification (Mandatory)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State diesel price revision, seasonal harvest surge, or district RTO tariff revision rationale..."
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
            <div className="text-[10px] text-slate-400 mt-0.5">
              Minimum 8 characters. Recorded in immutable statutory audit trail.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving Tariff...' : 'Apply Tariff Revision'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
