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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Disputed / Flagged
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
            <Lock className="w-3 h-3 text-red-400" />
            Locked Out
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
            <UserX className="w-3 h-3 text-orange-400" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPersonaColor = (persona) => {
    switch (persona) {
      case 'Farmer':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Produce Buyer':
        return 'text-sky-400 bg-sky-950/60 border-sky-800/60';
      case 'Transporter':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'FPO Lead':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      case 'Equipment Owner':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'Agri-Expert':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/60';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col">
      {/* Selected Items Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="bg-emerald-950/70 border-b border-emerald-500/30 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-200">
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
                className="px-2.5 py-1 bg-rose-900/70 hover:bg-rose-800 border border-rose-500/40 text-rose-100 rounded-lg font-medium transition-colors"
              >
                Bulk Revoke Sessions
              </button>
            )}
            <button
              onClick={() => setSelectedUserIds([])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
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
            <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>ID / UID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Entity / User</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">
                <span>Key Attributes (Sessions, Devices, 2FA)</span>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center gap-1.5 hover:text-white">
                  <span>Created / Last Active</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Querying Authentication & RBAC records...</span>
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold text-slate-400">No records match the active criteria</p>
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
                    className={`group transition-colors duration-150 hover:bg-slate-800/50 cursor-pointer ${
                      isSelected ? 'bg-emerald-950/20' : ''
                    }`}
                    onClick={(e) => {
                      // Prevent drawer if clicked on actions or checkbox
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
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* ID & Firebase UID */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                        #{user.id.replace('USR-', '')}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[110px]" title={user.uid}>
                        {user.uid}
                      </div>
                    </td>

                    {/* Entity / User Name, Mobile, Persona */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                            {user.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
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
                          <span className="flex items-center gap-1 text-slate-300">
                            <Smartphone className="w-3 h-3 text-slate-400" />
                            {totalDevices} dev
                          </span>
                          <span className="text-slate-600">·</span>
                          {activeSessions.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {activeSessions.length} live session{activeSessions.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">No active session</span>
                          )}
                        </div>

                        {/* Security feature tags */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className={`px-1 rounded border ${user.mpinSet ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-rose-950/60 text-rose-400 border-rose-800'}`}>
                            {user.mpinSet ? 'MPIN: OK' : 'NO MPIN'}
                          </span>
                          <span className={`px-1 rounded border ${user.twoFactorEnabled ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            2FA: {user.twoFactorEnabled ? 'ON' : 'OFF'}
                          </span>
                          {user.aadhaarMasked && (
                            <span className="text-slate-500 text-[10px]" title="DPDP Act Masked Aadhaar">
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
                        <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                          {user.failedLoginAttempts} failed login attempt(s)
                        </div>
                      )}
                    </td>

                    {/* Created At / Last Active */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      <div>
                        <span className="text-slate-200">
                          {new Date(user.createdAt).toLocaleDateString('en-CA')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="w-2.5 h-2.5 text-slate-500" />
                        <span>{user.geoCity || user.lastLoginIp}</span>
                      </div>
                    </td>

                    {/* Actions Column (Wireframe: [View] [Edit] / [Approve] [X] / [Investigate]) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Primary View / Inspect */}
                        <button
                          onClick={() => onSelectUser(user)}
                          title="Inspect full auth record and sessions"
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>View</span>
                        </button>

                        {/* Reset MPIN button */}
                        <button
                          onClick={() => onOpenResetMpin(user)}
                          disabled={!hasPermission('canResetMpin')}
                          title={hasPermission('canResetMpin') ? "Trigger temporary OTP MPIN reset" : "Restricted for current role"}
                          className="px-2 py-1 text-xs font-semibold bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
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
                            className="px-2 py-1 text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
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
                          className="px-1.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Wireframe Pagination Footer: Showing 1 - 20 of 1,420 records [ < Prev ] [ 1 2 3 ] [ Next > ] */}
      <div className="border-t border-slate-800 bg-slate-950/70 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono">
          Showing <span className="text-white font-semibold">{users.length > 0 ? 1 : 0}</span> - <span className="text-white font-semibold">{users.length}</span> of <span className="text-white font-semibold">{pagination.total || users.length}</span> records
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
            disabled={!pagination.page || pagination.page <= 1}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &lt; Prev
          </button>
          
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              {pagination.page || 1}
            </span>
            {pagination.totalPages > 1 && (
              <span className="px-2 py-1 text-slate-500">
                / {pagination.totalPages}
              </span>
            )}
          </div>

          <button
            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
            disabled={!pagination.totalPages || pagination.page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
