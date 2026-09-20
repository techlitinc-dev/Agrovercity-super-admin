import React from 'react';
import {
  Package,
  AlertTriangle,
  Lock,
  Wallet,
  Scale,
  TrendingUp,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';

export function LotsMetricBar({ kpis = {}, loading = false }) {
  const {
    activeLotsCount = 0,
    totalActiveTonnageMT = 0,
    disputedLotsCount = 0,
    underReviewCount = 0,
    totalEscrowLocked = 0,
    activeDealsCount = 0,
    totalUdhaarBalance = 0,
    weighbridgeVerifiedRate = 0
  } = kpis;

  const formatLakhOrCr = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Active Produce Lots */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Lots
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              activeLotsCount
            )}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>{totalActiveTonnageMT} MT Available</span>
          </div>
        </div>
      </div>

      {/* 2. Disputed & Under Review Lots */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Disputed / Review
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-400 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              disputedLotsCount + underReviewCount
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span className="text-rose-400 font-bold">{disputedLotsCount} Disputed</span>
            <span>•</span>
            <span className="text-amber-400">{underReviewCount} Review</span>
          </div>
        </div>
      </div>

      {/* 3. B2B Escrow Locked */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Escrow In Hold
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatLakhOrCr(totalEscrowLocked)
            )}
          </div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            <span>{activeDealsCount} B2B Contracts</span>
          </div>
        </div>
      </div>

      {/* 4. Trader Udhaar Outstandings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Buyer Credit / Udhaar
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatLakhOrCr(totalUdhaarBalance)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Trader Outstanding Balance</span>
          </div>
        </div>
      </div>

      {/* 5. Weighbridge Verification Rate */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Weighbridge Verified
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-teal-400 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              `${weighbridgeVerifiedRate}%`
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Electronic Slip Attested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
