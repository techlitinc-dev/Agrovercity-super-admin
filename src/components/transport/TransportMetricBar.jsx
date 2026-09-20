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
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Fleet Verified
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              verifiedVehiclesCount
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            {suspendedCount > 0 && <span className="text-rose-400">{suspendedCount} Suspended</span>}
            {suspendedCount === 0 && <span>Full Fleet Dispatchable</span>}
          </div>
        </div>
      </div>

      {/* 2. Pending Registration Review */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending Verification
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              pendingVerificationCount
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>RC · Insurance · Fitness</span>
          </div>
        </div>
      </div>

      {/* 3. Live Dispatch */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live In Transit
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              liveTransitCount
            )}
          </div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            <span>{todayBookingCount} Bookings Today</span>
          </div>
        </div>
      </div>

      {/* 4. Disputes & No-Shows */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Disputes / No-Shows
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
              disputeCount
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Awaiting Superadmin Arbitration</span>
          </div>
        </div>
      </div>

      {/* 5. POD Audit & Payout Queue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Payouts Pending
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-teal-400 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatRupees(pendingPayoutValue)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <FileCheck className="w-3 h-3 text-teal-400" />
            <span>{pendingAuditCount} PODs To Audit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
