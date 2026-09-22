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
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Lots
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              activeLotsCount
            )}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <span>{totalActiveTonnageMT} MT Available</span>
          </div>
        </div>
      </div>

      {/* 2. Disputed & Under Review Lots */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-rose-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Disputed / Review
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-xs group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-rose-100/50 animate-pulse rounded-lg" />
            ) : (
              disputedLotsCount + underReviewCount
            )}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
            <span className="text-rose-600 font-bold">{disputedLotsCount} Disputed</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">{underReviewCount} Review</span>
          </div>
        </div>
      </div>

      {/* 3. B2B Escrow Locked */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Escrow In Hold
          </span>
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-xs group-hover:scale-105 transition-transform">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              formatLakhOrCr(totalEscrowLocked)
            )}
          </div>
          <div className="text-[11px] text-teal-700 mt-1 flex items-center gap-1 font-semibold">
            <span>{activeDealsCount} B2B Contracts</span>
          </div>
        </div>
      </div>

      {/* 4. Trader Udhaar Outstandings */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-amber-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Buyer Credit / Udhaar
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-amber-800 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-amber-100/50 animate-pulse rounded-lg" />
            ) : (
              formatLakhOrCr(totalUdhaarBalance)
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Trader Outstanding Balance</span>
          </div>
        </div>
      </div>

      {/* 5. Weighbridge Verification Rate */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Weighbridge Verified
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-emerald-700 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              `${weighbridgeVerifiedRate}%`
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Electronic Slip Attested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
