import React from 'react';
import { ShieldCheck, Users, FileCheck, TrendingUp, Package, ShieldAlert, KeyRound, Database } from 'lucide-react';
import { useAuthAdmin, ADMIN_ROLES } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminAuthService } from '../../services/adminAuthService';
import { adminKycService } from '../../services/adminKycService';
import { adminMandiService } from '../../services/adminMandiService';
import { adminLotsService } from '../../services/adminLotsService';

export function Header({ activeModuleId = '05', onDataRefreshed }) {
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

  const getModuleDetails = () => {
    switch (activeModuleId) {
      case '05':
        return {
          sop: 'SOP-05',
          title: 'Produce Lots & B2B Trading',
          icon: Package,
          gradient: 'from-emerald-500 to-teal-700'
        };
      case '04':
        return {
          sop: 'SOP-04',
          title: 'Mandi Prices, Vyapari Live Rates & Approvals',
          icon: TrendingUp,
          gradient: 'from-emerald-500 to-teal-700'
        };
      case '03':
        return {
          sop: 'SOP-03',
          title: 'KYC Verification & Document Vault',
          icon: FileCheck,
          gradient: 'from-blue-500 to-teal-700'
        };
      case '02':
        return {
          sop: 'SOP-02',
          title: 'User Profiles & Multi-Persona Management',
          icon: Users,
          gradient: 'from-teal-500 to-emerald-700'
        };
      case '01':
      default:
        return {
          sop: 'SOP-01',
          title: 'Authentication, RBAC, Sessions & Security',
          icon: ShieldCheck,
          gradient: 'from-emerald-500 to-teal-700'
        };
    }
  };

  const mod = getModuleDetails();
  const IconComponent = mod.icon;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top wireframe banner */}
      <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Module Identification */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm text-emerald-400 uppercase">
                Agrovercity Superadmin
              </span>
              <span className="text-slate-600">::</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {mod.sop}
              </span>
            </div>
            <h1 className="text-base lg:text-lg font-bold text-white tracking-tight flex items-center gap-2">
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo DB</span>
          </button>

          {/* RBAC Role Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-mono">
              <KeyRound className="w-3 h-3 text-emerald-400" />
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
              className="bg-slate-950 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="SUPER_ADMIN">Super Admin (customClaims: admin:true)</option>
              <option value="SUPPORT_OPERATOR">Support Operator (Triage / Tier-2)</option>
              <option value="FINANCIAL_AUDITOR">Financial Auditor (Strict Read-Only)</option>
            </select>
          </div>

          {/* Wireframe User Pill */}
          <div className="flex items-center gap-2.5 bg-emerald-950/40 border border-emerald-600/30 px-3 py-1.5 rounded-xl">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-emerald-200">
                [ Admin User: <span className="font-mono text-emerald-400">{currentAdmin.email}</span> ]
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                Claims: {JSON.stringify(currentAdmin.customClaims)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary micro-banner with RBAC notice if not superadmin */}
      {currentRoleKey !== 'SUPER_ADMIN' && (
        <div className="bg-amber-950/50 border-t border-amber-900/40 px-4 lg:px-8 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>RBAC Simulation:</strong> You are currently operating as <em>{currentAdmin.name}</em>. Destructive actions (suspending accounts, unlinking primary personas) are restricted.
            </span>
          </div>
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="text-[11px] font-semibold underline hover:text-amber-100 ml-4"
          >
            Switch to Super Admin
          </button>
        </div>
      )}
    </header>
  );
}
