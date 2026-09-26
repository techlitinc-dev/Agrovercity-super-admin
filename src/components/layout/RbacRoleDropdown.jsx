import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ShieldCheck, KeyRound, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuthAdmin, ADMIN_ROLES } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function RbacRoleDropdown() {
  const { currentRoleKey, switchRole, staffList, actingStaff, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectRole = (key) => {
    switchRole(key);
    setIsOpen(false);

    if (key.startsWith('STAFF_')) {
      const staff = staffList.find((s) => s.id === key.replace('STAFF_', ''));
      if (staff) {
        addToast({
          title: 'Admin Session Activated',
          message: `Now acting as ${staff.name} (${staff.delegatedModules?.length || 0} Modules Active)`,
          type: 'info'
        });
        return;
      }
    }

    const roleName = ADMIN_ROLES[key]?.name || key;
    addToast({
      title: 'Admin Context Switched',
      message: `Now acting as ${roleName}`,
      type: 'info'
    });
  };

  // Determine current display label and icon
  const getDisplayContent = () => {
    if (actingStaff) {
      const icon = actingStaff.role === 'Superadmin' ? '👑' : actingStaff.role === 'Admin' ? '🛡️' : '✍️';
      return {
        icon,
        label: `${actingStaff.name} (${actingStaff.role})`,
        badge: `${actingStaff.delegatedModules?.length || 0} Modules`
      };
    }

    if (currentRoleKey === 'SUPER_ADMIN') {
      return {
        icon: '👑',
        label: 'Super Admin (Full Access)',
        badge: 'Full'
      };
    }
    if (currentRoleKey === 'SUPPORT_OPERATOR') {
      return {
        icon: '🛡️',
        label: 'Support Operator (Tier-2)',
        badge: 'Tier-2'
      };
    }
    if (currentRoleKey === 'FINANCIAL_AUDITOR') {
      return {
        icon: '📊',
        label: 'Financial Auditor (Read-Only)',
        badge: 'Read-Only'
      };
    }

    return {
      icon: '👑',
      label: 'Super Admin (Full Access)',
      badge: 'Full'
    };
  };

  const display = getDisplayContent();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Styled identically to ss1.png */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2.5 px-4 py-1.5 rounded-full border-[1.5px] border-emerald-500 bg-white hover:bg-emerald-50/50 text-slate-800 text-xs font-semibold shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 transition-all duration-200 cursor-pointer ${
          isOpen ? 'ring-2 ring-emerald-500/25 bg-emerald-50/40 border-emerald-600 shadow-sm' : ''
        }`}
      >
        <span className="text-sm select-none leading-none shrink-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
          {display.icon}
        </span>
        <span className="font-medium text-slate-800 tracking-tight whitespace-nowrap truncate max-w-[210px]">
          {display.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-700 shrink-0 ml-0.5 transition-transform duration-200 ease-in-out ${
            isOpen ? 'rotate-180 text-emerald-700' : 'group-hover:text-slate-900'
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-200/80 shadow-[0_12px_40px_-8px_rgba(16,185,129,0.18),0_4px_16px_-2px_rgba(0,0,0,0.08)] p-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150">
          {/* Header info */}
          <div className="px-3 py-2 border-b border-emerald-100/70 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                RBAC Role Switcher
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.5 rounded-md">
              Live Context
            </span>
          </div>

          {/* Core Roles Section */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Core System Roles
            </div>

            {/* Super Admin */}
            <button
              type="button"
              onClick={() => handleSelectRole('SUPER_ADMIN')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                !actingStaff && currentRoleKey === 'SUPER_ADMIN'
                  ? 'bg-emerald-50/90 text-emerald-950 font-semibold border border-emerald-300/80 shadow-xs'
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">👑</span>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    Super Admin
                    <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded font-mono">
                      Full Access
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                    Global controls, overrides & audits
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'SUPER_ADMIN' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[2.5]" />
              )}
            </button>

            {/* Support Operator */}
            <button
              type="button"
              onClick={() => handleSelectRole('SUPPORT_OPERATOR')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                !actingStaff && currentRoleKey === 'SUPPORT_OPERATOR'
                  ? 'bg-emerald-50/90 text-emerald-950 font-semibold border border-emerald-300/80 shadow-xs'
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">🛡️</span>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    Support Operator
                    <span className="text-[10px] font-normal text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded font-mono">
                      Tier-2
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                    Read access, MPIN resets & support
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'SUPPORT_OPERATOR' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[2.5]" />
              )}
            </button>

            {/* Financial Auditor */}
            <button
              type="button"
              onClick={() => handleSelectRole('FINANCIAL_AUDITOR')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                !actingStaff && currentRoleKey === 'FINANCIAL_AUDITOR'
                  ? 'bg-emerald-50/90 text-emerald-950 font-semibold border border-emerald-300/80 shadow-xs'
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">📊</span>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    Financial Auditor
                    <span className="text-[10px] font-normal text-purple-700 bg-purple-100/80 px-1.5 py-0.2 rounded font-mono">
                      Read-Only
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                    Statutory logs & compliance trails
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'FINANCIAL_AUDITOR' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Staff List Section (if any) */}
          {staffList && staffList.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Staff & Delegated Admins</span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">
                  ({staffList.length})
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
                {staffList.map((s) => {
                  const isStaffActive = actingStaff && actingStaff.id === s.id;
                  const icon = s.role === 'Superadmin' ? '👑' : s.role === 'Admin' ? '🛡️' : '✍️';
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectRole(`STAFF_${s.id}`)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                        isStaffActive
                          ? 'bg-emerald-50/90 text-emerald-950 font-semibold border border-emerald-300/80 shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <span>{s.role}</span>
                            <span>•</span>
                            <span>{s.delegatedModules?.length || 0} Modules</span>
                          </div>
                        </div>
                      </div>
                      {isStaffActive && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer current claim details */}
          <div className="mt-2 pt-2 border-t border-emerald-100/70 px-2.5 py-1 bg-emerald-50/50 rounded-xl flex items-center justify-between text-[10px] text-emerald-800">
            <span className="font-mono truncate">
              {currentAdmin.email}
            </span>
            <span className="font-semibold text-[9px] px-1.5 py-0.5 rounded bg-white border border-emerald-200 text-emerald-700 font-mono">
              RBAC ACTIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
