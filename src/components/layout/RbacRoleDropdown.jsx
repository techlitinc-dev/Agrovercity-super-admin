import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuthAdmin, ADMIN_ROLES } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function RbacRoleDropdown() {
  const { currentRoleKey, switchRole, staffList, actingStaff, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fallback / default staff for rich display matching dd1.png
  const effectiveStaffList = (staffList && staffList.length > 0) ? staffList : [
    { id: 'stf_01', name: 'daaa', role: 'DEO', delegatedModules: ['Mandi', 'Produce'] },
    { id: 'stf_02', name: 'aaa', role: 'Admin', delegatedModules: ['Mandi', 'Produce', 'Orders', 'Contracts', 'FPO'] },
    { id: 'stf_03', name: 'Dr. Vikram Deshmukh', role: 'Superadmin', delegatedModules: new Array(28).fill('Mod') }
  ];

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
      const staff = effectiveStaffList.find((s) => s.id === key.replace('STAFF_', ''));
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
      const icon = actingStaff.role === 'Superadmin' ? '👑' : actingStaff.role === 'Admin' ? '🛡️' : '👤';
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
      {/* Trigger Button - Styled identically to dd1.png */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border-[1.5px] border-emerald-600 hover:border-emerald-700 bg-white hover:bg-emerald-50/80 text-slate-900 text-xs font-semibold shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer ${
          isOpen ? 'ring-2 ring-emerald-500/30 bg-emerald-50/80 border-emerald-700 shadow-sm' : ''
        }`}
      >
        <span className="text-sm select-none leading-none shrink-0 drop-shadow-2xs">
          {display.icon}
        </span>
        <span className="font-semibold text-slate-800 tracking-tight whitespace-nowrap truncate max-w-[220px]">
          {display.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-600 shrink-0 ml-0.5 transition-transform duration-200 ease-in-out ${
            isOpen ? 'rotate-180 text-emerald-700 stroke-[2.5]' : 'group-hover:text-slate-900'
          }`}
        />
      </button>

      {/* Dropdown Menu Popover - Exact dd1.png styling */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-[350px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-emerald-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_20px_rgba(16,185,129,0.08)] p-3 z-50 origin-top-right animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header row */}
          <div className="px-2 py-1.5 mb-2 flex items-center justify-between border-b border-emerald-100/80 pb-2.5">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-sans">
                RBAC Role Switcher
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Context
            </span>
          </div>

          {/* Core Roles Section */}
          <div className="space-y-1.5">
            <div className="px-2 pt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Core System Roles
            </div>

            {/* Super Admin Card */}
            <button
              type="button"
              onClick={() => handleSelectRole('SUPER_ADMIN')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                !actingStaff && currentRoleKey === 'SUPER_ADMIN'
                  ? 'bg-emerald-50/80 text-emerald-950 border-emerald-300 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">👑</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Super Admin</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-md font-mono border border-emerald-200/80">
                      Full Access
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Global controls, overrides &amp; audits
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'SUPER_ADMIN' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
              )}
            </button>

            {/* Support Operator Card */}
            <button
              type="button"
              onClick={() => handleSelectRole('SUPPORT_OPERATOR')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                !actingStaff && currentRoleKey === 'SUPPORT_OPERATOR'
                  ? 'bg-emerald-50/80 text-emerald-950 border-emerald-300 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">🛡️</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Support Operator</span>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100/90 px-1.5 py-0.5 rounded-md font-mono border border-blue-200/80">
                      Tier-2
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Read access, MPIN resets &amp; support
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'SUPPORT_OPERATOR' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
              )}
            </button>

            {/* Financial Auditor Card */}
            <button
              type="button"
              onClick={() => handleSelectRole('FINANCIAL_AUDITOR')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                !actingStaff && currentRoleKey === 'FINANCIAL_AUDITOR'
                  ? 'bg-emerald-50/80 text-emerald-950 border-emerald-300 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">📊</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Financial Auditor</span>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100/90 px-1.5 py-0.5 rounded-md font-mono border border-purple-200/80">
                      Read-Only
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Statutory logs &amp; compliance trails
                  </div>
                </div>
              </div>
              {!actingStaff && currentRoleKey === 'FINANCIAL_AUDITOR' && (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
              )}
            </button>
          </div>

          {/* Staff & Delegated Admins Section */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
            <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Staff &amp; Delegated Admins</span>
              <span className="text-[10px] font-mono font-semibold text-slate-400">
                ({effectiveStaffList.length})
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
              {effectiveStaffList.map((s) => {
                const isStaffActive = actingStaff && actingStaff.id === s.id;
                const icon = s.role === 'Superadmin' ? '👑' : s.role === 'Admin' ? '🛡️' : '👤';
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectRole(`STAFF_${s.id}`)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all duration-150 cursor-pointer border ${
                      isStaffActive
                        ? 'bg-emerald-50/80 text-emerald-950 border-emerald-300 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm shrink-0">{icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
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
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer current claim details */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-slate-500 font-medium truncate">
              {currentAdmin?.email || 'root@agrovercity.in'}
            </span>
            <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-mono tracking-wide">
              RBAC ACTIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RbacRoleDropdown;

