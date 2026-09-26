import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Users,
  UserCheck,
  MapPin,
  Mail,
  Phone,
  Crown,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { adminStaffService } from '../../services/adminStaffService';
import { AddModuleAdminModal } from './AddModuleAdminModal';
import { ALL_MODULES_MAP } from '../../lib/navigationConfig';
import { useNotification } from '../../context/NotificationContext';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function StaffDelegationView() {
  const { addToast } = useNotification();
  const { actingStaff, actAsStaff, exitActAs, refreshStaffList } = useAuthAdmin();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState('Admin');
  const [modalAllowedModules, setModalAllowedModules] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminStaffService.listStaff({
        query: searchQuery,
        role: roleFilter,
        module: moduleFilter,
        status: statusFilter
      });
      if (res.success) {
        setStaffList(res.data.staff);
      }
    } catch (err) {
      addToast({
        title: 'Error loading staff',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, moduleFilter, statusFilter, addToast]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddStaff = async (newStaffData) => {
    const res = await adminStaffService.addStaff(newStaffData);
    if (res.success) {
      // Step 7 confirmation notification:
      // "Successfully created Module Admin [Name]"
      addToast({
        title: 'Success',
        message: `Successfully created Module Admin ${newStaffData.name}`,
        type: 'success'
      });
      fetchStaff();
      if (refreshStaffList) refreshStaffList();
    }
  };

  const handleActAs = (staff) => {
    actAsStaff(staff);
    addToast({
      title: 'Admin Session Activated',
      message: `Admin Session: ${staff.name} · ${staff.delegatedModules?.length || 0} Modules Active`,
      type: 'info'
    });
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminStaffService.toggleStatus(id);
      addToast({
        title: 'Status Updated',
        message: res.message,
        type: 'info'
      });
      fetchStaff();
      if (refreshStaffList) refreshStaffList();
    } catch (err) {
      addToast({
        title: 'Update Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this staff member access?')) return;
    try {
      const res = await adminStaffService.deleteStaff(id);
      addToast({
        title: 'Access Revoked',
        message: res.message,
        type: 'info'
      });
      if (actingStaff?.id === id) {
        exitActAs();
      }
      fetchStaff();
      if (refreshStaffList) refreshStaffList();
    } catch (err) {
      addToast({
        title: 'Revoke Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // KPI calculations
  const totalStaff = staffList.length;
  const superadminsCount = staffList.filter((s) => s.role === 'Superadmin').length;
  const moduleAdminsCount = staffList.filter((s) => s.role === 'Admin').length;
  const deosCount = staffList.filter((s) => s.role === 'DEO').length;

  const isCurrentActorSuperadmin = !actingStaff || actingStaff.role === 'Superadmin';
  const isCurrentActorAdmin = actingStaff && actingStaff.role === 'Admin';
  const isCurrentActorDeo = actingStaff && actingStaff.role === 'DEO';

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP CONSOLE BANNER WITH ACTION BUTTON IN TOP-RIGHT */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-blue-900/60 p-6 lg:p-8 text-white shadow-xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                RBAC Level 3 Hierarchy
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-blue-200 text-xs font-semibold">
                Superadmin ➔ Admins ➔ DEOs
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Staff & Module Delegation
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isCurrentActorDeo ? (
                <>
                  Operating as <strong className="text-white">{actingStaff.name}</strong> ({actingStaff.department || 'Data Entry Operator Desk'}). You are assigned to <strong className="text-emerald-400">{actingStaff.delegatedModules?.length || 0} modules</strong> for operational data entry. Staff delegation and admin creation are restricted to Superadmin and Module Admins.
                </>
              ) : isCurrentActorAdmin ? (
                <>
                  Operating as <strong className="text-white">{actingStaff.name}</strong> ({actingStaff.department || 'Module Admin Desk'}). You have authority over{' '}
                  <strong className="text-emerald-400">{actingStaff.delegatedModules?.length || 0} assigned modules</strong>. You can appoint Data Entry Operators within your boundary.
                </>
              ) : (
                'Delegate operational authority across the 26 platform modules. Assign specialized roles to Module Admins and Data Entry Operators (DEOs) for APMC rates, KYC approvals, 7/12 land records, and marketplace orders.'
              )}
            </p>
          </div>

          {/* Top-Right Corner Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            {isCurrentActorDeo ? (
              /* DEO Mode: No permission to add admins or DEOs - Display sleek informative badge */
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/15 backdrop-blur-md border border-amber-400/30 text-amber-200 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>DEO Mode · Read-Only</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      NO DELEGATION PERMS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Staff assignment restricted to Admins & Superadmin
                  </p>
                </div>
              </div>
            ) : isCurrentActorAdmin ? (
              /* When this Admin clicks "+ Add Data Entry Operator", only assign from granted modules */
              <button
                onClick={() => {
                  setModalRole('DEO');
                  setModalAllowedModules(actingStaff.delegatedModules);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs lg:text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Data Entry Operator</span>
              </button>
            ) : (
              /* Superadmin Button: + Add Module Admin */
              <button
                onClick={() => {
                  setModalRole('Admin');
                  setModalAllowedModules(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs lg:text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Module Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KPI METRICS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Staff
            </div>
            <div className="text-2xl font-black text-slate-900">{totalStaff}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Active Staff Accounts</div>
          </div>
        </div>

        {/* Superadmins */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Superadmins
            </div>
            <div className="text-2xl font-black text-purple-900">{superadminsCount}</div>
            <div className="text-[10px] text-purple-700 font-semibold">26 Modules Master Access</div>
          </div>
        </div>

        {/* Module Admins */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Module Admins
            </div>
            <div className="text-2xl font-black text-blue-900">{moduleAdminsCount}</div>
            <div className="text-[10px] text-blue-700 font-semibold">Vertical Specialists</div>
          </div>
        </div>

        {/* DEOs */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DEO Staff
            </div>
            <div className="text-2xl font-black text-emerald-900">{deosCount}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Data Entry & Field Triage</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH AND FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, email, mobile, department, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Superadmin">👑 Superadmin</option>
              <option value="Admin">🛡️ Module Admin</option>
              <option value="DEO">✍️ DEO (Data Entry)</option>
            </select>
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Modules</option>
              {Object.keys(ALL_MODULES_MAP).map((modId) => (
                <option key={modId} value={modId}>
                  [{modId}] {ALL_MODULES_MAP[modId].shortTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchStaff}
            title="Refresh Staff Roster"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STAFF & MODULE DELEGATION DATA GRID */}
      {/* ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role Tier</th>
                <th className="py-3.5 px-4">Department & Zone</th>
                <th className="py-3.5 px-4">Delegated Modules</th>
                <th className="py-3.5 px-4">Permissions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">
                  {isCurrentActorDeo ? 'Access Scope' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No staff members match the selected filters.
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => {
                  const isSuperadmin = staff.role === 'Superadmin';
                  const isAdmin = staff.role === 'Admin';
                  const isDeo = staff.role === 'DEO';
                  const isCurrentlyActing = actingStaff?.id === staff.id;

                  return (
                    <tr
                      key={staff.id}
                      className={`transition-colors ${
                        isCurrentlyActing
                          ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Staff Member with "Act As" button next to name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 ${
                              isSuperadmin
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : isAdmin
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {staff.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                              <span>{staff.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">
                                ({staff.id})
                              </span>

                              {/* Step 8 requirement: "Click the Act As button next to their name" */}
                              {isCurrentlyActing ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  Active Session
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleActAs(staff)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all cursor-pointer"
                                  title={`Act as ${staff.name}`}
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Act As</span>
                                </button>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {staff.email}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {staff.mobile}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Tier */}
                      <td className="py-3.5 px-4">
                        {isSuperadmin && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            <Crown className="w-3 h-3 text-purple-700" />
                            Superadmin
                          </span>
                        )}
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-700" />
                            Module Admin
                          </span>
                        )}
                        {isDeo && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <UserCheck className="w-3 h-3 text-emerald-700" />
                            DEO (Data Entry)
                          </span>
                        )}
                      </td>

                      {/* Department & Zone */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{staff.department}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {staff.zone}
                        </div>
                      </td>

                      {/* Delegated Modules */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {isSuperadmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            All 26 Platform Modules
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {staff.delegatedModules.slice(0, 3).map((mId) => {
                              const mod = ALL_MODULES_MAP[mId];
                              return (
                                <span
                                  key={mId}
                                  className="inline-block px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 truncate max-w-[130px]"
                                  title={mod ? mod.title : mId}
                                >
                                  {mod ? `${mod.id} - ${mod.shortTitle}` : mId}
                                </span>
                              );
                            })}
                            {staff.delegatedModules.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                                +{staff.delegatedModules.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Permissions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {staff.permissions.canApprove && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                              Approve
                            </span>
                          )}
                          {staff.permissions.canEdit && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">
                              Edit
                            </span>
                          )}
                          {staff.permissions.canExport && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                              Export
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {staff.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isCurrentActorDeo ? (
                          <div className="flex items-center justify-end">
                            {isCurrentlyActing ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Current Session
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200">
                                <Lock className="w-3 h-3 text-slate-400" />
                                Restricted
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Act As or Exit Button */}
                            {isCurrentlyActing ? (
                              <button
                                onClick={exitActAs}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
                              >
                                Exit Session
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActAs(staff)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Act As</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleToggleStatus(staff.id)}
                              title={staff.status === 'active' ? 'Suspend Staff' : 'Activate Staff'}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                staff.status === 'active'
                                  ? 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                              }`}
                            >
                              {staff.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>

                            {!isSuperadmin && (
                              <button
                                onClick={() => handleDeleteStaff(staff.id)}
                                title="Revoke Staff Access"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{staffList.length}</span> delegated
            administrative accounts
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Superadmin
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Module Admin
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> DEO
            </span>
          </div>
        </div>
      </div>

      {/* Add Module Admin / DEO Modal */}
      <AddModuleAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStaff={handleAddStaff}
        initialRole={modalRole}
        allowedModuleIds={modalAllowedModules}
      />
    </div>
  );
}
