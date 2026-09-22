import React from 'react';
import { ShieldCheck, Users, FileCheck, TrendingUp, Package, ShieldAlert, KeyRound, Database } from 'lucide-react';
import { useAuthAdmin, ADMIN_ROLES } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminAuthService } from '../../services/adminAuthService';
import { adminKycService } from '../../services/adminKycService';
import { adminMandiService } from '../../services/adminMandiService';
import { adminLotsService } from '../../services/adminLotsService';

import { getModuleById, getGroupById } from '../../lib/navigationConfig';

export function Header({ activeModuleId = '26', onDataRefreshed }) {
  const { currentAdmin, currentRoleKey, switchRole } = useAuthAdmin();
  const { addToast } = useNotification();

  const handleResetSeed = async () => {
    try {
      await adminAuthService.resetToDefaultSeed();
      await adminKycService.resetToDefaultSeed();
      await adminMandiService.resetToDefaultSeed();
      await adminLotsService.resetToDefaultSeed();
      addToast({
        title: 'Demo State Reset',
        message: 'Re-initialized mock database with original SOP-01 through SOP-05 seed data.',
        type: 'info'
      });
      if (onDataRefreshed) onDataRefreshed();
    } catch (e) {
      addToast({
        title: 'Reset Failed',
        message: e.message,
        type: 'error'
      });
    }
  };

  const mod = getModuleById(activeModuleId);
  const group = getGroupById(mod.groupId);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-emerald-200/70 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.05)]">
      {/* Top wireframe banner */}
      <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Module Identification */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="Agrovercity"
            className="h-11 w-auto max-w-[46px] rounded-xl object-contain bg-white border border-emerald-200/90 shadow-sm shadow-emerald-700/10 p-0.5 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold tracking-wider text-xs text-emerald-900 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Agrovercity Superadmin
              </span>
              <span className="text-emerald-300">/</span>
              <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/70">
                {group?.title || 'Platform'}
              </span>
              <span className="text-emerald-300">::</span>
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                {mod.sop}
              </span>
            </div>
            <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {mod.title}
            </h1>
          </div>
        </div>

        {/* Right side: Admin user badge & RBAC role switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Reset seed data button */}
          <button
            onClick={handleResetSeed}
            title="Reset to original test dataset"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white/90 hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo DB</span>
          </button>

          {/* RBAC Role Selector */}
          <div className="flex items-center gap-2 bg-white/90 border border-slate-200/90 p-1 rounded-xl shadow-xs backdrop-blur-sm">
            <span className="text-xs text-slate-500 px-2 flex items-center gap-1 font-mono">
              <KeyRound className="w-3 h-3 text-emerald-600" />
              RBAC:
            </span>
            <select
              value={currentRoleKey}
              onChange={(e) => {
                switchRole(e.target.value);
                addToast({
                  title: 'Admin Context Switched',
                  message: `Now acting as ${ADMIN_ROLES[e.target.value].name} (${ADMIN_ROLES[e.target.value].email})`,
                  type: 'info'
                });
              }}
              className="bg-slate-50/80 text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-colors"
            >
              <option value="SUPER_ADMIN">Super Admin (customClaims: admin:true)</option>
              <option value="SUPPORT_OPERATOR">Support Operator (Triage / Tier-2)</option>
              <option value="FINANCIAL_AUDITOR">Financial Auditor (Strict Read-Only)</option>
            </select>
          </div>

          {/* User Status Pill */}
          <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-xs">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-emerald-900">
                [ Admin: <span className="font-mono text-emerald-700 font-bold">{currentAdmin.email}</span> ]
              </div>
              <div className="text-[10px] text-emerald-800 font-mono">
                Claims: {JSON.stringify(currentAdmin.customClaims)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary micro-banner with RBAC notice if not superadmin */}
      {currentRoleKey !== 'SUPER_ADMIN' && (
        <div className="bg-amber-50/90 border-t border-amber-200/80 px-4 lg:px-8 py-1.5 text-xs text-amber-900 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>RBAC Simulation:</strong> You are currently operating as <em>{currentAdmin.name}</em>. Destructive actions (suspending accounts, unlinking primary personas) are restricted.
            </span>
          </div>
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="text-[11px] font-semibold text-amber-700 underline hover:text-amber-900 ml-4"
          >
            Switch to Super Admin
          </button>
        </div>
      )}
    </header>
  );
}
