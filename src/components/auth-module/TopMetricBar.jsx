import React from 'react';
import { Users, Clock, Activity, AlertTriangle, ShieldCheck, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';

export function TopMetricBar({ users = [] }) {
  // Compute real-time KPIs from current user records
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status === 'verified').length;
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const lockedCount = users.filter((u) => u.status === 'locked' || u.status === 'suspended').length;
  const flaggedCount = users.filter((u) => u.status === 'flagged' || u.failedLoginAttempts >= 3).length;

  // Active sessions count across all users
  const totalActiveSessions = users.reduce((acc, u) => {
    return acc + (u.sessions ? u.sessions.filter((s) => s.active).length : 0);
  }, 0);

  const kpis = [
    {
      id: 'active',
      title: 'Total Active Records',
      value: activeCount,
      subtext: `${totalActiveSessions} live device sessions active`,
      badge: '+12.4% this week',
      icon: Users,
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-700',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'pending',
      title: 'Pending Action & Locked',
      value: pendingCount + lockedCount,
      subtext: `${pendingCount} pending setup · ${lockedCount} locked/suspended`,
      badge: 'Immediate triage',
      icon: Lock,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'volume',
      title: "Today's Auth Volume",
      value: '1,420',
      subtext: '489 phone OTP · 931 MPIN auths',
      badge: '99.8% success',
      icon: Activity,
      color: 'sky',
      gradient: 'from-sky-500 to-blue-600',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    {
      id: 'flagged',
      title: 'Flagged Security Anomalies',
      value: flaggedCount,
      subtext: 'TOR IP exit nodes & rate-limit spikes',
      badge: 'High Priority',
      icon: AlertTriangle,
      color: 'rose',
      gradient: 'from-rose-500 to-red-600',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="relative group rounded-2xl bg-white/90 backdrop-blur-xl border border-emerald-100/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.1)] hover:border-emerald-300/80 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {kpi.title}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {kpi.value}
                  </span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.gradient} text-white shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[170px]" title={kpi.subtext}>
                {kpi.subtext}
              </span>
              <span className={`font-bold font-mono text-[11px] px-2 py-0.5 rounded-md border ${kpi.badgeClass}`}>
                {kpi.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
