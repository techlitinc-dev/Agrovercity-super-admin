import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Search,
  Bell,
  Activity,
  Sparkles,
  Command,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  KeyRound,
  ChevronRight,
  Layers,
  Cpu,
  Info,
  X
} from 'lucide-react';
import { useAuthAdmin, ADMIN_ROLES } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminAuthService } from '../../services/adminAuthService';
import { adminKycService } from '../../services/adminKycService';
import { adminMandiService } from '../../services/adminMandiService';
import { adminLotsService } from '../../services/adminLotsService';
import { getModuleById, getGroupById } from '../../lib/navigationConfig';
import { RbacRoleDropdown } from './RbacRoleDropdown';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function Header({ activeModuleId = '26', onDataRefreshed, onSearchOpen }) {
  const { currentAdmin, currentRoleKey, switchRole, actingStaff, exitActAs } = useAuthAdmin();
  const { addToast } = useNotification();

  const [profileOpen, setProfileOpen] = useState(false);
  const [copiedClaim, setCopiedClaim] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [latency, setLatency] = useState(24);
  const profileRef = useRef(null);

  // Close profile popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  // Subtle live latency telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(18 + Math.random() * 12));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleResetSeed = async () => {
    setResetting(true);
    try {
      await Promise.all([
        adminAuthService.resetToDefaultSeed(),
        adminKycService.resetToDefaultSeed(),
        adminMandiService.resetToDefaultSeed(),
        adminLotsService.resetToDefaultSeed()
      ]);
      addToast({
        title: 'Demo State Reset Successfully',
        message: 'Re-initialized mock database with original benchmark SOP-01 through SOP-26 seed data.',
        type: 'success'
      });
      if (onDataRefreshed) onDataRefreshed();
    } catch (e) {
      addToast({
        title: 'Reset Failed',
        message: e.message || 'Error restoring database state',
        type: 'error'
      });
    } finally {
      setResetting(false);
    }
  };

  const handleCopyClaims = () => {
    navigator.clipboard.writeText(JSON.stringify(currentAdmin?.customClaims || {}, null, 2));
    setCopiedClaim(true);
    setTimeout(() => setCopiedClaim(false), 2000);
    addToast({
      title: 'Claims Copied',
      message: 'JWT custom authorization claims copied to clipboard.',
      type: 'info'
    });
  };

  const mod = getModuleById(activeModuleId);
  const group = getGroupById(mod.groupId);

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Top Ambient Glow Hairline */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 via-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />

      {/* Acting Staff Delegated Session Banner */}
      {actingStaff && (
        <div className="bg-gradient-to-r from-blue-700/95 via-blue-800/95 to-indigo-900/95 backdrop-blur-xl text-white px-4 lg:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-blue-400/30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="font-bold text-white text-xs tracking-wide">
              Active Delegated Session: <span className="underline underline-offset-2">{actingStaff.name}</span>
            </span>
            <Badge variant="glass" className="bg-white/15 text-blue-100 border-white/20 text-[10px] font-mono">
              {actingStaff.role} • {actingStaff.department || 'Operations'}
            </Badge>
            <Badge variant="glass" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-[10px]">
              {actingStaff.delegatedModules?.length || 0} Modules Authorized
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] text-blue-200/90 font-medium">
              Navigation scoped strictly to delegated permissions
            </span>
            <button
              onClick={exitActAs}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-xs transition-all border border-white/40 cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-xs"
            >
              <span>Exit Session</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Header Bar */}
      <div className="bg-white/85 backdrop-blur-2xl border-b border-emerald-200/70 shadow-[0_4px_30px_rgba(6,95,70,0.03)] px-4 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 lg:gap-6">
          {/* Left Side: Brand Logo & Deep Navigation Breadcrumb */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Logo Container with Ambient Glass Ring */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-11 w-11 rounded-2xl bg-white/95 border border-emerald-300/80 shadow-xs flex items-center justify-center p-1.5 backdrop-blur-md transition-transform duration-200 group-hover:scale-[1.03]">
                <img
                  src="/logo.png"
                  alt="Agrovercity"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Hierarchical Breadcrumb & Module Header */}
            <div className="min-w-0">
              {/* Breadcrumb Hierarchy Path */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-extrabold tracking-wider text-[11px] text-emerald-900 uppercase flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  AGROVERCITY SUPERADMIN
                </span>

                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />

                <Badge
                  variant="success"
                  className="bg-emerald-100/70 text-emerald-900 border-emerald-300/70 text-[10px] font-semibold py-0.5 px-2"
                >
                  {group?.title || 'Platform Core'}
                </Badge>

                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />

                <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/90 font-bold shadow-2xs">
                  {mod.sop}
                </span>
              </div>

              {/* Module Main Title */}
              <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight truncate flex items-center gap-2 mt-0.5">
                <span>{mod.title}</span>
              </h1>
            </div>
          </div>

          {/* Right Controls Area: Live Telemetry, Quick Tools, Role Dropdown & User Profile */}
          <div className="flex items-center gap-2.5 lg:gap-3 flex-wrap ml-auto">
            {/* Live System Health Badge */}
            <div
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/60 border border-emerald-200/70 text-[11px] font-medium text-emerald-900 shadow-2xs"
              title="Real-time Node Telemetry Health"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-pulse" />
              <span>Core Telemetry:</span>
              <span className="font-mono font-bold text-emerald-700">{latency}ms</span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-700 font-semibold text-[10px] uppercase">Online</span>
            </div>

            {/* Reset Demo State Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSeed}
              disabled={resetting}
              className="rounded-full border-emerald-200/90 bg-white/90 hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-900 shadow-xs gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
              title="Reset all SOP mock data collections to baseline"
            >
              <Database className={`w-3.5 h-3.5 text-emerald-600 shrink-0 ${resetting ? 'animate-spin text-emerald-700' : ''}`} />
              <span className="hidden sm:inline">{resetting ? 'Resetting...' : 'Reset Demo DB'}</span>
            </Button>

            {/* RBAC Role Selector Dropdown (Pill-themed based on dd.png) */}
            <RbacRoleDropdown />

            {/* Admin User Profile Card & Interactive Popover */}
            <div className="relative inline-block text-left" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`group flex items-center gap-2.5 px-3 py-1 rounded-full border border-emerald-200/90 bg-gradient-to-r from-emerald-50/70 to-teal-50/60 hover:bg-emerald-100/60 text-slate-800 text-xs font-semibold shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer ${
                  profileOpen ? 'ring-2 ring-emerald-500/25 bg-emerald-100/70 border-emerald-400' : ''
                }`}
                title="View Admin Profile & Claims"
              >
                {/* Avatar Badge */}
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                    {currentAdmin?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </div>

                {/* Name & Role Text */}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] leading-tight">
                    {currentAdmin?.name || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono font-medium leading-none">
                    {currentAdmin?.badge || 'Root Administrator'}
                  </div>
                </div>
              </button>

              {/* Profile Details Glassmorphic Popover */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white/95 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_16px_40px_-8px_rgba(6,95,70,0.18),0_4px_16px_-2px_rgba(0,0,0,0.06)] p-4 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150">
                  {/* User Identity Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-emerald-100/80">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {currentAdmin?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{currentAdmin?.name || 'Super Admin'}</h4>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{currentAdmin?.email}</p>
                      <Badge variant="success" className="mt-1 text-[9px] py-0 px-1.5 font-mono">
                        {currentAdmin?.badge || 'Full RBAC Access'}
                      </Badge>
                    </div>
                  </div>

                  {/* Permissions & Context Info */}
                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>Authorization Context:</span>
                      <span className="font-semibold text-emerald-800">{currentRoleKey}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>Role Level:</span>
                      <span className="font-semibold text-slate-900">{ADMIN_ROLES[currentRoleKey]?.name || currentRoleKey}</span>
                    </div>

                    {/* Claims Box with Quick Copy */}
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-emerald-600" />
                          Custom JWT Claims
                        </span>
                        <button
                          onClick={handleCopyClaims}
                          className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          {copiedClaim ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedClaim ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="text-[10px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200/70 overflow-x-auto max-h-24">
                        {JSON.stringify(currentAdmin?.customClaims || {}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Session ID: root_agt_99</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileOpen(false)}
                      className="text-xs text-slate-600 hover:text-slate-900 h-7 px-2.5 rounded-lg"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Warning Banner if operating under restricted RBAC mode */}
      {!actingStaff && currentRoleKey !== 'SUPER_ADMIN' && (
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 lg:px-8 py-1.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>RBAC Simulation Active:</strong> Currently operating as <em>{currentAdmin?.name}</em> ({currentAdmin?.badge}). State modification capabilities are restricted under SOP rules.
            </span>
          </div>
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer ml-auto"
          >
            Switch to Super Admin (Full Access) →
          </button>
        </div>
      )}
    </header>
  );
}
