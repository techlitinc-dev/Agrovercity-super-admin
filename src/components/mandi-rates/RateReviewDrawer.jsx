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
  // Map [lowerBand - 10%, upperBand + 10%] to [0%, 100%]
  const minRange = modalPrice * 0.75;
  const maxRange = modalPrice * 1.25;
  const offeredPercent = Math.min(Math.max(((offered - minRange) / (maxRange - minRange)) * 100, 5), 95);
  const lowerBandPercent = ((lowerBand - minRange) / (maxRange - minRange)) * 100;
  const upperBandPercent = ((upperBand - minRange) / (maxRange - minRange)) * 100;
  const modalPercent = ((modalPrice - minRange) / (maxRange - minRange)) * 100;

  const isPredatory = dev < -15;
  const isInflated = dev > 15;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                  {rate.id}
                </span>
                <span className="text-slate-600">::</span>
                <span className="text-xs text-slate-400 font-mono">
                  {rate.mandiName}
                </span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{rate.commodity}</span>
                <span className="text-xs text-slate-400 font-normal">
                  (₹{rate.offeredRate}/Qtl)
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
              rate.status === 'approved'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : rate.status === 'rejected'
                ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                : rate.status === 'flagged'
                ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
            }`}>
              {rate.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Sanity Band Visualizer Corridor */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>±15% Agmarknet Sanity Band Validation</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Protects farmers against predatory bids and unfair market depression.
                </p>
              </div>

              {isPredatory ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-1 rounded-md border border-rose-600/40">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {dev}% Predatory Low Alert
                </span>
              ) : isInflated ? (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-orange-400 bg-orange-950 px-2.5 py-1 rounded-md border border-orange-600/40">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  +{dev}% Inflated Alert
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-600/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dev >= 0 ? `+${dev}%` : `${dev}%`} Within Safe Corridor
                </span>
              )}
            </div>

            {/* Visual Sanity Bar */}
            <div className="pt-4 pb-2 space-y-2">
              <div className="relative h-6 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                {/* Safe Band Region (Emerald highlighted) */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-500/60"
                  style={{ left: `${lowerBandPercent}%`, width: `${upperBandPercent - lowerBandPercent}%` }}
                />

                {/* Benchmark Modal Center Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white/70 shadow-sm"
                  style={{ left: `${modalPercent}%` }}
                />

                {/* Trader Offered Pin */}
                <div
                  className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full shadow-lg transition-all ${
                    isPredatory ? 'bg-rose-500 animate-pulse' : isInflated ? 'bg-orange-500' : 'bg-emerald-400'
                  }`}
                  style={{ left: `${offeredPercent}%` }}
                />
              </div>

              {/* Price markers below bar */}
              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500 block text-[9px]">-15% Lower Bound</span>
                  <span className="text-slate-300 font-bold">₹{lowerBand.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-center">
                  <span className="text-emerald-400 block text-[9px] font-sans font-semibold">Agmarknet Benchmark</span>
                  <span className="text-white font-bold">₹{modalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px]">+15% Upper Bound</span>
                  <span className="text-slate-300 font-bold">₹{upperBand.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg flex items-center justify-between">
              <span>Trader Proposed Buying Price:</span>
              <span className={`text-base font-extrabold font-mono ${
                isPredatory ? 'text-rose-400' : isInflated ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                ₹{offered.toLocaleString('en-IN')} / Quintal
              </span>
            </div>
          </div>

          {/* 2. Net-Profit Mandi Comparison Calculator */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-teal-400" />
              <span>Net Farmer Realization Calculator</span>
            </h3>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Offered Rate (Gross):</span>
                <span className="font-mono font-bold text-white">₹{rate.offeredRate.toLocaleString('en-IN')}/Qtl</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  Estimated Transport & Freight Deduction:
                </span>
                <span className="font-mono text-rose-400">-₹{rate.estimatedFreightDeduction || 120}/Qtl</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>APMC User Fee & Weighbridge Cess (0.5%):</span>
                <span className="font-mono text-rose-400">-₹{Math.round(rate.offeredRate * 0.005)}/Qtl</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-200">Net Farmer Cash Realization:</span>
                <span className="text-base font-mono font-extrabold text-emerald-400">
                  ₹{(rate.offeredRate - (rate.estimatedFreightDeduction || 120) - Math.round(rate.offeredRate * 0.005)).toLocaleString('en-IN')}/Qtl
                </span>
              </div>
            </div>
          </div>

          {/* 3. Vyapari Profile & Payment Terms */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Trader Entity & Settlement Terms
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Trader Name</span>
                <span className="text-slate-200 font-bold">{rate.vyapariName}</span>
                <span className="text-slate-500 text-[10px] block">{rate.vyapariMobile}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Operating Firm</span>
                <span className="text-emerald-400 font-semibold">{rate.tradeFirm}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Payment Terms</span>
                <span className="text-slate-200 font-medium">{rate.paymentTerms}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Lot Volume Limits</span>
                <span className="text-slate-200 font-mono">Min: {rate.minQuantityQtl} Qtl · Max: {rate.maxQuantityQtl} Qtl</span>
              </div>
            </div>
          </div>

          {/* 4. Administrative Reason Input */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Inspection Notes / Reason for Approval or Override:
            </label>
            <input
              type="text"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder="e.g. Verified trader's physical lot inspection report at Lasalgaon weighbridge..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => onFlag(rate, adminReason || 'Flagged for predatory rate investigation')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg font-medium transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Flag Anomaly</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onReject(rate)}
              className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold transition-colors"
            >
              Reject Rate
            </button>

            <button
              onClick={() => onApprove(rate, adminReason)}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
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
