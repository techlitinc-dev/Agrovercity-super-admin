import React, { useState } from 'react';
import {
  Eye,
  KeyRound,
  LogOut,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Lock,
  Unlock,
  ShieldOff,
  UserX,
  FileText,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function UserDataGrid({
  users = [],
  pagination = {},
  onPageChange,
  onSelectUser,
  onOpenResetMpin,
  onOpenRevokeSessions,
  onOpenStatusChange,
  loading = false,
  selectedUserIds = [],
  setSelectedUserIds
}) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort local copy
  const sortedUsers = [...users].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    }
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Disputed / Flagged
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <Lock className="w-3 h-3 text-red-600" />
            Locked Out
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <UserX className="w-3 h-3 text-orange-600" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getPersonaColor = (persona) => {
    switch (persona) {
      case 'Farmer':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200 font-semibold';
      case 'Produce Buyer':
        return 'text-sky-800 bg-sky-50 border-sky-200 font-semibold';
      case 'Transporter':
        return 'text-amber-800 bg-amber-50 border-amber-200 font-semibold';
      case 'FPO Lead':
        return 'text-purple-800 bg-purple-50 border-purple-200 font-semibold';
      case 'Equipment Owner':
        return 'text-indigo-800 bg-indigo-50 border-indigo-200 font-semibold';
      case 'Agri-Expert':
        return 'text-teal-800 bg-teal-50 border-teal-200 font-semibold';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200 font-semibold';
    }
  };

  return (
    <div className="bg-white/90 border border-emerald-200/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_8px_30px_rgb(16,185,129,0.04)] ring-1 ring-emerald-900/[0.02] flex flex-col">
      {/* Selected Items Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="bg-emerald-100/90 border-b border-emerald-300 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-950 font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedUserIds.length}</span> user(s) selected
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('canRevokeSessions') && (
              <button
                onClick={() => {
                  const targetUser = users.find((u) => u.id === selectedUserIds[0]);
                  if (targetUser) onOpenRevokeSessions(targetUser);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors shadow-2xs"
              >
                Bulk Revoke Sessions
              </button>
            )}
            <button
              onClick={() => setSelectedUserIds([])}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 rounded-lg border border-emerald-200 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 text-[11px] uppercase tracking-wider text-emerald-950 font-bold">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={toggleSelectAll}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1.5 hover:text-emerald-700 font-bold">
                  <span>ID / UID</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700/60" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5 hover:text-emerald-700 font-bold">
                  <span>Entity / User</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700/60" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold">
                <span>Key Attributes (Sessions, Devices, 2FA)</span>
              </th>
              <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1.5 hover:text-emerald-700 font-bold">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700/60" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1.5 hover:text-emerald-700 font-bold">
                  <span>Created / Last Active</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700/60" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right font-bold">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60 text-xs">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-500">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Querying Authentication & RBAC records...</span>
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700">No records match the active criteria</p>
                    <p className="text-[11px] text-slate-500">Try adjusting your search query, status, or persona filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                const activeSessions = user.sessions?.filter((s) => s.active) || [];
                const totalDevices = user.devices?.length || 0;

                return (
                  <tr
                    key={user.id}
                    className={`group transition-colors duration-150 hover:bg-emerald-50/60 cursor-pointer ${
                      isSelected ? 'bg-emerald-50/80' : ''
                    }`}
                    onClick={(e) => {
                      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
                      onSelectUser(user);
                    }}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(user.id)}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* ID & Firebase UID */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                        #{user.id.replace('USR-', '')}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[110px]" title={user.uid}>
                        {user.uid}
                      </div>
                    </td>

                    {/* Entity / User Name, Mobile, Persona */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-900 text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {user.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono">{user.mobile}</span>
                            <span className={`px-1.5 py-0.2 rounded border text-[10px] font-medium ${getPersonaColor(user.persona)}`}>
                              {user.persona}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Key Attributes */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Smartphone className="w-3 h-3 text-slate-400" />
                            {totalDevices} dev
                          </span>
                          <span className="text-slate-300">·</span>
                          {activeSessions.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {activeSessions.length} live session{activeSessions.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No active session</span>
                          )}
                        </div>

                        {/* Security feature tags */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className={`px-1 rounded border font-semibold ${user.mpinSet ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                            {user.mpinSet ? 'MPIN: OK' : 'NO MPIN'}
                          </span>
                          <span className={`px-1 rounded border font-semibold ${user.twoFactorEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            2FA: {user.twoFactorEnabled ? 'ON' : 'OFF'}
                          </span>
                          {user.aadhaarMasked && (
                            <span className="text-slate-400 text-[10px]" title="DPDP Act Masked Aadhaar">
                              {user.aadhaarMasked}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(user.status)}
                      {user.failedLoginAttempts > 0 && (
                        <div className="text-[10px] text-rose-700 font-mono mt-0.5 font-semibold">
                          {user.failedLoginAttempts} failed login attempt(s)
                        </div>
                      )}
                    </td>

                    {/* Created At / Last Active */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>
                        <span className="text-slate-800 font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-CA')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span>{user.geoCity || user.lastLoginIp}</span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Primary View / Inspect */}
                        <button
                          onClick={() => onSelectUser(user)}
                          title="Inspect full auth record and sessions"
                          className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-lg border border-emerald-200/80 shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>View</span>
                        </button>

                        {/* Reset MPIN button */}
                        <button
                          onClick={() => onOpenResetMpin(user)}
                          disabled={!hasPermission('canResetMpin')}
                          title={hasPermission('canResetMpin') ? "Trigger temporary OTP MPIN reset" : "Restricted for current role"}
                          className="px-2 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span className="hidden sm:inline">Reset MPIN</span>
                        </button>

                        {/* Revoke Sessions button */}
                        {activeSessions.length > 0 && (
                          <button
                            onClick={() => onOpenRevokeSessions(user)}
                            disabled={!hasPermission('canRevokeSessions')}
                            title={hasPermission('canRevokeSessions') ? "Revoke active JWT refresh tokens across all devices" : "Restricted for current role"}
                            className="px-2 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                          >
                            <LogOut className="w-3 h-3" />
                            <span className="hidden lg:inline">Revoke</span>
                          </button>
                        )}

                        {/* Status Toggle / Override */}
                        <button
                          onClick={() => onOpenStatusChange(user)}
                          disabled={!hasPermission('canUpdateStatus')}
                          title={hasPermission('canUpdateStatus') ? "Modify account status (Suspend / Unlock)" : "Restricted for current role"}
                          className="px-1.5 py-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-emerald-100/80 bg-emerald-50/40 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="font-mono">
          Showing <span className="font-bold">{users.length > 0 ? 1 : 0}</span> - <span className="font-bold">{users.length}</span> of <span className="font-bold">{pagination.total || users.length}</span> records
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
            disabled={!pagination.page || pagination.page <= 1}
            className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs font-semibold"
          >
            &lt; Prev
          </button>
          
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold shadow-xs">
              {pagination.page || 1}
            </span>
            {pagination.totalPages > 1 && (
              <span className="px-2 py-1 text-slate-500 font-medium">
                / {pagination.totalPages}
              </span>
            )}
          </div>

          <button
            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
            disabled={!pagination.totalPages || pagination.page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs font-semibold"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
