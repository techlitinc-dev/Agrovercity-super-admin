import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function PageContextBar({
  title,
  sop = 'SOP',
  category,
  description,
  icon: Icon,
  iconColor = 'emerald',
  actions,
  stats = [],
  isAuditor = false,
  isSupport = false,
  currentAdmin,
  auditorNotice,
  className = ''
}) {
  const iconColorStyles = {
    emerald: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 shadow-emerald-700/5',
    teal: 'bg-teal-50/90 text-teal-700 border-teal-200/80 shadow-teal-700/5',
    blue: 'bg-blue-50/90 text-blue-700 border-blue-200/80 shadow-blue-700/5',
    purple: 'bg-purple-50/90 text-purple-700 border-purple-200/80 shadow-purple-700/5',
    amber: 'bg-amber-50/90 text-amber-700 border-amber-200/80 shadow-amber-700/5',
    cyan: 'bg-cyan-50/90 text-cyan-700 border-cyan-200/80 shadow-cyan-700/5',
    rose: 'bg-rose-50/90 text-rose-700 border-rose-200/80 shadow-rose-700/5'
  };

  const selectedIconStyle = iconColorStyles[iconColor] || iconColorStyles.emerald;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Glassmorphism Page Context Card */}
      <div className="rounded-2xl border border-emerald-100/90 bg-gradient-to-r from-white via-[#f8fdfa]/95 to-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title & Hierarchy Section */}
          <div className="flex items-start gap-3.5 min-w-0">
            {Icon && (
              <div className="relative shrink-0 mt-0.5">
                <div className={`p-3 rounded-2xl border ${selectedIconStyle} shadow-xs transition-transform duration-200 hover:scale-[1.04]`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            )}

            <div className="min-w-0 space-y-1">
              {/* Hierarchy Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {category && (
                  <Badge variant="glass" className="bg-emerald-50/80 text-emerald-800 border-emerald-200/80 text-[10px] font-semibold py-0.5 px-2">
                    {category}
                  </Badge>
                )}

                {sop && (
                  <span className="font-mono text-[10px] bg-emerald-100/80 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300/80 font-bold shadow-2xs">
                    {sop}
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Context
                </span>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-4xl">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Action & Context Area */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0 lg:self-center">
            {/* Quick Statistics Mini Pills */}
            {stats.length > 0 && (
              <div className="hidden xl:flex items-center gap-2 mr-2">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-white/80 border border-emerald-200/70 text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <span className="text-[10px] text-slate-500">{stat.label}:</span>
                    <span className="font-bold text-slate-900 font-mono">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current Admin RBAC Badge */}
            {currentAdmin && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200/80 bg-white/90 text-slate-800 text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-slate-600">Admin:</span>
                <span className="text-[11px] font-bold text-slate-900 font-mono">
                  {currentAdmin.name || 'Super Admin'}
                </span>
              </div>
            )}

            {/* Custom Page Action Buttons */}
            {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
          </div>
        </div>
      </div>

      {/* Auditor Read-only Notice Card */}
      {isAuditor && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/95 to-orange-50/95 border border-amber-200/90 text-amber-900 flex items-start sm:items-center gap-3 text-xs shadow-2xs backdrop-blur-md animate-in fade-in duration-200">
          <div className="p-1 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="leading-relaxed">
            <strong>Financial Auditor Mode Active (SOP-19 §6.1 / RBAC):</strong>{' '}
            {auditorNotice ||
              'You have read-only audit access to transaction ledgers, verification histories, and compliance certificates. State mutability and destructive overrides are restricted.'}
          </div>
        </div>
      )}
    </div>
  );
}

export default PageContextBar;

