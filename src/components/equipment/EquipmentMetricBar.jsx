import React from 'react';
import {
  Tractor,
  Clock,
  CalendarCheck,
  AlertTriangle,
  ShieldAlert,
  GitBranch
} from 'lucide-react';

export function EquipmentMetricBar({ kpis = {}, loading = false }) {
  const {
    verifiedMachinesCount = 0,
    totalMachines = 0,
    pendingVerificationCount = 0,
    fpoMachineCount = 0,
    privateMachineCount = 0,
    avgUtilizationPercent = 0,
    todayBookingCount = 0,
    doubleBookedSlotCount = 0,
    pendingDamageReportCount = 0,
    depositAtStakeValue = 0,
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
      {/* 1. Verified Machinery Inventory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Fleet Verified
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Tractor className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              `${verifiedMachinesCount}/${totalMachines}`
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            {suspendedCount > 0 && <span className="text-rose-400">{suspendedCount} Suspended</span>}
            {suspendedCount === 0 && <span>FPO {fpoMachineCount} · Private {privateMachineCount}</span>}
          </div>
        </div>
      </div>

      {/* 2. Pending Paper Verification */}
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
            <span>RC · Insurance · Operator Licence</span>
          </div>
        </div>
      </div>

      {/* 3. Utilization & Today's Volume */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Avg Utilization
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <GitBranch className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              `${avgUtilizationPercent}%`
            )}
          </div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            <CalendarCheck className="w-3 h-3" />
            <span>{todayBookingCount} Slots Booked Today</span>
          </div>
        </div>
      </div>

      {/* 4. Slot Double-Booking Anomalies */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Slot Anomalies
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
              doubleBookedSlotCount
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Double-Booked Slots To Resolve</span>
          </div>
        </div>
      </div>

      {/* 5. Damage Reports & Deposit Queue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Deposit Disputes
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-teal-400 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatRupees(depositAtStakeValue)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <ShieldAlert className="w-3 h-3 text-teal-400" />
            <span>{pendingDamageReportCount} Damage Reports Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
