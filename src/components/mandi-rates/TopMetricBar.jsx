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
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Mandis Monitored
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{benchmarks.length} APMCs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Agmarknet & eNAM Synced</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Rate Submissions */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Rate Approvals
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-600 flex items-baseline gap-2">
            <span>{pendingRates.length}</span>
            <span className="text-xs font-semibold text-slate-500 font-sans">Aaj ke Bhav</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>2-Hourly Trader Feed Queue</span>
          </div>
        </div>
      </div>

      {/* 3. Today's Arrivals Volume */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Daily Mandi Arrivals
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{totalArrivals.toLocaleString()} MT</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Aggregate Weighbridge Inflow</span>
          </div>
        </div>
      </div>

      {/* 4. Sanity Band Anomalies (±15%) */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sanity Band Alerts (±15%)
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-rose-600 flex items-baseline gap-2">
            <span>{anomalies.length} Flagged</span>
          </div>
          <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Predatory / Outlier Deviation</span>
          </div>
        </div>
      </div>

      {/* 5. Agmarknet API Gateway Health */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            eNAM API Gateway
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <Wifi className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-emerald-800 flex items-baseline gap-2">
            <span>99.8%</span>
            <span className="text-xs font-bold text-emerald-700 font-sans">Online</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Latency ~160ms · {syncHealthy}/{benchmarks.length} Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
