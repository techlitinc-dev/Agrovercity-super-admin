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
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fleet Verified
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Tractor className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              `${verifiedMachinesCount}/${totalMachines}`
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
            {suspendedCount > 0 && <span className="text-rose-600 font-semibold">{suspendedCount} Suspended</span>}
            {suspendedCount === 0 && <span>FPO {fpoMachineCount} · Private {privateMachineCount}</span>}
          </div>
        </div>
      </div>

      {/* 2. Pending Paper Verification */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending Verification
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-amber-600 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              pendingVerificationCount
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
            <span>RC · Insurance · Operator Licence</span>
          </div>
        </div>
      </div>

      {/* 3. Utilization & Today's Volume */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Avg Utilization
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
            <GitBranch className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              `${avgUtilizationPercent}%`
            )}
          </div>
          <div className="text-[11px] text-sky-700 mt-1 flex items-center gap-1 font-mono font-medium">
            <CalendarCheck className="w-3 h-3" />
            <span>{todayBookingCount} Slots Booked Today</span>
          </div>
        </div>
      </div>

      {/* 4. Slot Double-Booking Anomalies */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Slot Anomalies
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              doubleBookedSlotCount
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
            <span>Double-Booked Slots To Resolve</span>
          </div>
        </div>
      </div>

      {/* 5. Damage Reports & Deposit Queue */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Deposit Disputes
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-emerald-700 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              formatRupees(depositAtStakeValue)
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
            <ShieldAlert className="w-3 h-3 text-emerald-600" />
            <span>{pendingDamageReportCount} Damage Reports Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
