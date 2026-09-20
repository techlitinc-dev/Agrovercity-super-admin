import React from 'react';
import { TrendingUp, Clock, AlertTriangle, Activity, CheckCircle2, ShieldAlert, Wifi } from 'lucide-react';

export function TopMetricBar({ rates = [], benchmarks = [] }) {
  const pendingRates = rates.filter((r) => r.status === 'pending');
  const anomalies = rates.filter((r) => r.sanityBandStatus !== 'within_band' || r.status === 'flagged');
  const totalArrivals = benchmarks.reduce((acc, b) => acc + (b.arrivalTonnage || 0), 0);
  const syncHealthy = benchmarks.filter((b) => b.syncStatus === 'synced').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Mandis Monitored */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Mandis Monitored
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{benchmarks.length} APMCs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Agmarknet & eNAM Synced</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Rate Submissions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending Rate Approvals
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-baseline gap-2">
            <span>{pendingRates.length}</span>
            <span className="text-xs font-normal text-slate-400">Aaj ke Bhav</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>2-Hourly Trader Feed Queue</span>
          </div>
        </div>
      </div>

      {/* 3. Today's Arrivals Volume */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Daily Mandi Arrivals
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{totalArrivals.toLocaleString()} MT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Aggregate Weighbridge Inflow</span>
          </div>
        </div>
      </div>

      {/* 4. Sanity Band Anomalies (±15%) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sanity Band Alerts (±15%)
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-rose-400 flex items-baseline gap-2">
            <span>{anomalies.length} Flagged</span>
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Predatory / Outlier Deviation</span>
          </div>
        </div>
      </div>

      {/* 5. Agmarknet API Gateway Health */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            eNAM API Gateway
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Wifi className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-teal-300 flex items-baseline gap-2">
            <span>99.8%</span>
            <span className="text-xs font-normal text-teal-400">Online</span>
          </div>
          <div className="text-[11px] text-teal-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Latency ~160ms · {syncHealthy}/{benchmarks.length} Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
