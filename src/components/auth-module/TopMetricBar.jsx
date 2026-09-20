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
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20'
    },
    {
      id: 'pending',
      title: 'Pending Action & Locked',
      value: pendingCount + lockedCount,
      subtext: `${pendingCount} pending setup · ${lockedCount} locked/suspended`,
      badge: 'Immediate triage',
      icon: Lock,
      color: 'amber',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20'
    },
    {
      id: 'volume',
      title: "Today's Auth Volume",
      value: '1,420',
      subtext: '489 phone OTP · 931 MPIN auths',
      badge: '99.8% success',
      icon: Activity,
      color: 'sky',
      gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-500/30',
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-500/20'
    },
    {
      id: 'flagged',
      title: 'Flagged Security Anomalies',
      value: flaggedCount,
      subtext: 'TOR IP exit nodes & rate-limit spikes',
      badge: 'High Priority',
      icon: AlertTriangle,
      color: 'rose',
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`relative overflow-hidden rounded-2xl bg-slate-900/80 border ${kpi.borderColor} p-5 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:border-opacity-60 bg-gradient-to-b ${kpi.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {kpi.title}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-mono">
                    {kpi.value}
                  </span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.iconBg} ${kpi.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-[170px]" title={kpi.subtext}>
                {kpi.subtext}
              </span>
              <span
                className={`font-semibold font-mono text-[11px] px-2 py-0.5 rounded-full ${
                  kpi.color === 'rose'
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : kpi.color === 'amber'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : kpi.color === 'sky'
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {kpi.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
