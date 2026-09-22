import React from 'react';
import {
  Truck,
  Clock,
  Navigation,
  AlertTriangle,
  FileCheck,
  Wallet
} from 'lucide-react';

export function TransportMetricBar({ kpis = {}, loading = false }) {
  const {
    verifiedVehiclesCount = 0,
    pendingVerificationCount = 0,
    liveTransitCount = 0,
    todayBookingCount = 0,
    disputeCount = 0,
    pendingAuditCount = 0,
    pendingPayoutValue = 0,
    suspendedCount = 0
  } = kpis;

  const formatRupees = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Verified Fleet Live */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fleet Verified
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shadow-2xs">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/60 animate-pulse rounded-lg" />
            ) : (
              verifiedVehiclesCount
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono font-medium">
            {suspendedCount > 0 && <span className="text-rose-700 font-bold">{suspendedCount} Suspended</span>}
            {suspendedCount === 0 && <span className="text-emerald-800 font-bold">Full Fleet Dispatchable</span>}
          </div>
        </div>
      </div>

      {/* 2. Pending Registration Review */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending Review
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-amber-700 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-amber-100/60 animate-pulse rounded-lg" />
            ) : (
              pendingVerificationCount
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono font-medium">
            <span>RC · Insurance · Fitness</span>
          </div>
        </div>
      </div>

      {/* 3. Live Dispatch */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Live In Transit
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center shadow-2xs">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-sky-100/60 animate-pulse rounded-lg" />
            ) : (
              liveTransitCount
            )}
          </div>
          <div className="text-[11px] text-sky-800 mt-1 flex items-center gap-1 font-mono font-bold">
            <span>{todayBookingCount} Bookings Today</span>
          </div>
        </div>
      </div>

      {/* 4. Disputes & No-Shows */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Disputes / No-Shows
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center shadow-2xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-700 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-rose-100/60 animate-pulse rounded-lg" />
            ) : (
              disputeCount
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono font-medium">
            <span>Awaiting Arbitration</span>
          </div>
        </div>
      </div>

      {/* 5. POD Audit & Payout Queue */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Payouts Pending
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center shadow-2xs">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-teal-800 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-teal-100/60 animate-pulse rounded-lg" />
            ) : (
              formatRupees(pendingPayoutValue)
            )}
          </div>
          <div className="text-[11px] text-teal-800 mt-1 flex items-center gap-1 font-mono font-bold">
            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{pendingAuditCount} PODs To Audit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
