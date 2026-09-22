import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Truck,
  Activity,
  Check,
  Calendar,
  Layers,
  Store,
  DollarSign
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function RateReviewDrawer({
  isOpen,
  onClose,
  rate,
  onApprove,
  onReject,
  onFlag
}) {
  const { currentAdmin } = useAuthAdmin();
  const [adminReason, setAdminReason] = useState('');

  if (!isOpen || !rate) return null;

  const modalPrice = rate.benchmarkModalPrice || 2250;
  const lowerBand = Math.round(modalPrice * 0.85);
  const upperBand = Math.round(modalPrice * 1.15);
  const offered = rate.offeredRate;
  const dev = rate.deviationPercent;

  // Position calculation for visual sanity bar
  const minRange = modalPrice * 0.75;
  const maxRange = modalPrice * 1.25;
  const offeredPercent = Math.min(Math.max(((offered - minRange) / (maxRange - minRange)) * 100, 5), 95);
  const lowerBandPercent = ((lowerBand - minRange) / (maxRange - minRange)) * 100;
  const upperBandPercent = ((upperBand - minRange) / (maxRange - minRange)) * 100;
  const modalPercent = ((modalPrice - minRange) / (maxRange - minRange)) * 100;

  const isPredatory = dev < -15;
  const isInflated = dev > 15;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-l border-emerald-100 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                  {rate.id}
                </span>
                <span className="text-slate-400">::</span>
                <span className="text-xs text-slate-500 font-mono font-medium">
                  {rate.mandiName}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{rate.commodity}</span>
                <span className="text-xs text-slate-500 font-normal">
                  (₹{rate.offeredRate}/Qtl)
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              rate.status === 'approved'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : rate.status === 'rejected'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : rate.status === 'flagged'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}>
              {rate.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Sanity Band Visualizer Corridor */}
          <div className="bg-white border border-emerald-100 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>±15% Agmarknet Sanity Band Validation</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Protects farmers against predatory bids and unfair market depression.
                </p>
              </div>

              {isPredatory ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-900 bg-rose-100 px-2.5 py-1 rounded-md border border-rose-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  {dev}% Predatory Low Alert
                </span>
              ) : isInflated ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-orange-900 bg-orange-100 px-2.5 py-1 rounded-md border border-orange-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />
                  +{dev}% Inflated Alert
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {dev >= 0 ? `+${dev}%` : `${dev}%`} Within Safe Corridor
                </span>
              )}
            </div>

            {/* Visual Sanity Bar */}
            <div className="pt-4 pb-2 space-y-2">
              <div className="relative h-6 bg-emerald-50/60 rounded-full border border-emerald-200 overflow-hidden">
                {/* Safe Band Region */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-200/50 border-x border-emerald-400"
                  style={{ left: `${lowerBandPercent}%`, width: `${upperBandPercent - lowerBandPercent}%` }}
                />

                {/* Benchmark Modal Center Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-slate-700 shadow-xs"
                  style={{ left: `${modalPercent}%` }}
                />

                {/* Trader Offered Pin */}
                <div
                  className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full shadow-md transition-all ${
                    isPredatory ? 'bg-rose-600 animate-pulse' : isInflated ? 'bg-orange-500' : 'bg-emerald-600'
                  }`}
                  style={{ left: `${offeredPercent}%` }}
                />
              </div>

              {/* Price markers below bar */}
              <div className="flex justify-between text-[11px] font-mono text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold">-15% Lower Bound</span>
                  <span className="text-slate-800 font-bold">₹{lowerBand.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-center">
                  <span className="text-emerald-700 block text-[9px] font-sans font-bold">Agmarknet Benchmark</span>
                  <span className="text-slate-900 font-extrabold">₹{modalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold">+15% Upper Bound</span>
                  <span className="text-slate-800 font-bold">₹{upperBand.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-700 bg-emerald-50/30 p-3 rounded-lg flex items-center justify-between border border-emerald-100">
              <span className="font-medium">Trader Proposed Buying Price:</span>
              <span className={`text-base font-extrabold font-mono ${
                isPredatory ? 'text-rose-700' : isInflated ? 'text-orange-700' : 'text-emerald-800'
              }`}>
                ₹{offered.toLocaleString('en-IN')} / Quintal
              </span>
            </div>
          </div>

          {/* 2. Net-Profit Mandi Comparison Calculator */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>Net Farmer Realization Calculator</span>
            </h3>

            <div className="border border-emerald-100 rounded-xl overflow-hidden bg-white p-4 space-y-2.5 text-xs shadow-xs">
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Offered Rate (Gross):</span>
                <span className="font-mono font-bold text-slate-900">₹{rate.offeredRate.toLocaleString('en-IN')}/Qtl</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Estimated Transport & Freight Deduction:
                </span>
                <span className="font-mono font-semibold text-rose-600">-₹{rate.estimatedFreightDeduction || 120}/Qtl</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>APMC User Fee & Weighbridge Cess (0.5%):</span>
                <span className="font-mono font-semibold text-rose-600">-₹{Math.round(rate.offeredRate * 0.005)}/Qtl</span>
              </div>
              <div className="pt-2 border-t border-emerald-100 flex justify-between items-center">
                <span className="font-bold text-slate-800">Net Farmer Cash Realization:</span>
                <span className="text-base font-mono font-extrabold text-emerald-800">
                  ₹{(rate.offeredRate - (rate.estimatedFreightDeduction || 120) - Math.round(rate.offeredRate * 0.005)).toLocaleString('en-IN')}/Qtl
                </span>
              </div>
            </div>
          </div>

          {/* 3. Vyapari Profile & Payment Terms */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Trader Entity & Settlement Terms
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-slate-400 block text-[11px] font-semibold">Trader Name</span>
                <span className="text-slate-800 font-bold">{rate.vyapariName}</span>
                <span className="text-slate-500 text-[10px] block font-mono">{rate.vyapariMobile}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-slate-400 block text-[11px] font-semibold">Operating Firm</span>
                <span className="text-emerald-800 font-bold">{rate.tradeFirm}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-slate-400 block text-[11px] font-semibold">Payment Terms</span>
                <span className="text-slate-800 font-medium">{rate.paymentTerms}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-slate-400 block text-[11px] font-semibold">Lot Volume Limits</span>
                <span className="text-slate-800 font-mono">Min: {rate.minQuantityQtl} Qtl · Max: {rate.maxQuantityQtl} Qtl</span>
              </div>
            </div>
          </div>

          {/* 4. Administrative Reason Input */}
          <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-2 shadow-xs">
            <label className="text-xs font-bold text-slate-800 block">
              Inspection Notes / Reason for Approval or Override:
            </label>
            <input
              type="text"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder="e.g. Verified trader's physical lot inspection report at Lasalgaon weighbridge..."
              className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="px-6 py-3.5 bg-emerald-50/50 border-t border-emerald-200/80 flex items-center justify-between shrink-0">
          <button
            onClick={() => onFlag(rate, adminReason || 'Flagged for predatory rate investigation')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg font-semibold transition-colors shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Flag Anomaly</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onReject(rate)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Reject Rate
            </button>

            <button
              onClick={() => onApprove(rate, adminReason)}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Publish Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
