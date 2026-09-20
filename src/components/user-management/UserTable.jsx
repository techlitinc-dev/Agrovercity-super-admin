import React, { useState } from 'react';
import {
  User,
  Star,
  MapPin,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Tractor,
  Truck,
  Store,
  Scale,
  Wheat,
  Home
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function UserTable({
  users = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onSelectUser,
  onOpenManagePersonas,
  onOpenFarmMap,
  onOpenStatusChange,
  loading = false,
  selectedUserIds = [],
  setSelectedUserIds
}) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [copiedUid, setCopiedUid] = useState(null);

  const handleCopyUid = (uid, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    addToast({
      title: 'Copied',
      message: `Firebase UID ${uid.slice(0, 16)}... copied to clipboard`,
      type: 'info'
    });
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u.uid));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleRow = (uid, e) => {
    e.stopPropagation();
    if (selectedUserIds.includes(uid)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== uid));
    } else {
      setSelectedUserIds([...selectedUserIds, uid]);
    }
  };

  // Helper to render persona icon
  const getPersonaIcon = (persona) => {
    switch (persona) {
      case 'Farmer': return Wheat;
      case 'Landlord': return Home;
      case 'Transporter': return Truck;
      case 'Seller': return Store;
      case 'Equipment Owner': return Tractor;
      case 'Broker': return Scale;
      default: return Layers;
    }
  };

  // Helper to get persona pill styling
  const getPersonaPillStyle = (persona, isPrimary, isActive) => {
    let base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ';
    if (isPrimary) {
      base += 'ring-1 ring-amber-400/50 ';
    }
    switch (persona) {
      case 'Farmer':
        return base + 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60';
      case 'Landlord':
        return base + 'bg-amber-950/70 text-amber-300 border-amber-700/60';
      case 'Transporter':
        return base + 'bg-sky-950/70 text-sky-300 border-sky-700/60';
      case 'Seller':
        return base + 'bg-purple-950/70 text-purple-300 border-purple-700/60';
      case 'Equipment Owner':
        return base + 'bg-orange-950/70 text-orange-300 border-orange-700/60';
      case 'Broker':
        return base + 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60';
      default:
        return base + 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-600/40">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-600/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending KYC
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-400 border border-rose-600/40">
            <ShieldAlert className="w-3 h-3" />
            Flagged
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Suspended
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-950/80 text-red-400 border border-red-600/40">
            Locked (MPIN)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Table Header Controls / Multi-select info */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300">
            User Profiles Directory
          </span>
          {selectedUserIds.length > 0 && (
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[11px] font-mono">
              {selectedUserIds.length} row(s) selected
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Showing {users.length} of {pagination.total} records
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={handleSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-28">User ID</th>
              <th className="py-3 px-4 min-w-[200px]">Entity / User</th>
              <th className="py-3 px-4 min-w-[260px]">Linked Personas (⭐ Primary)</th>
              <th className="py-3 px-4 min-w-[170px]">Farm Geofence</th>
              <th className="py-3 px-3 min-w-[120px]">Preferences</th>
              <th className="py-3 px-3 min-w-[110px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[180px]">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Querying User Profiles & Multi-Persona Roster...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-slate-600" />
                    <span className="font-semibold text-slate-300">No User Profiles Found</span>
                    <span className="text-xs text-slate-500">
                      Try clearing or adjusting your search filters.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedUserIds.includes(user.uid);
                const linkedPersonas = user.roleProfiles
                  ? Object.entries(user.roleProfiles).filter(([_, p]) => p.linked)
                  : [];

                return (
                  <tr
                    key={user.uid || user.id}
                    onClick={() => onSelectUser(user)}
                    className={`group hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(user.uid, e)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{user.id}</span>
                        <button
                          onClick={(e) => handleCopyUid(user.uid, e)}
                          className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                          title={`Copy Firebase UID: ${user.uid}`}
                        >
                          {copiedUid === user.uid ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[90px]" title={user.uid}>
                        {user.uid.slice(0, 10)}...
                      </div>
                    </td>

                    {/* Entity / User Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0 text-xs shadow-inner">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.womenMode && (
                              <span
                                title="Women SHG Mode Active"
                                className="text-pink-400 inline-flex items-center"
                              >
                                <HeartHandshake className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {user.mobile}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {user.geoCity || 'Maharashtra, India'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Linked Personas & Primary Star */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-[320px]">
                        {linkedPersonas.length === 0 ? (
                          <span className="text-slate-500 italic text-[11px]">
                            No personas linked
                          </span>
                        ) : (
                          linkedPersonas.map(([pKey, pData]) => {
                            const isPrimary = user.primaryPersona === pKey || pData.isPrimary;
                            const isActive = user.activePersona === pKey;
                            const IconComponent = getPersonaIcon(pKey);

                            return (
                              <span
                                key={pKey}
                                className={getPersonaPillStyle(pKey, isPrimary, isActive)}
                                title={`${pKey}${isPrimary ? ' (Starred Primary Profile)' : ''}${isActive ? ' (Currently Active)' : ''}`}
                              >
                                <IconComponent className="w-3 h-3 shrink-0" />
                                <span>{pKey}</span>
                                {isPrimary && (
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 ml-0.5" />
                                )}
                              </span>
                            );
                          })
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2 font-mono">
                        <span>Active: <strong className="text-slate-300">{user.activePersona || 'Farmer'}</strong></span>
                        <span>•</span>
                        <span>{linkedPersonas.length} Persona{linkedPersonas.length !== 1 ? 's' : ''}</span>
                      </div>
                    </td>

                    {/* Farm Geofence Boundary */}
                    <td className="py-3 px-4">
                      {user.farmPolygon && user.farmPolygon.coordinates?.length > 0 ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFarmMap(user);
                          }}
                          className="group/farm inline-flex flex-col p-1.5 -m-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
                          title="Click to view interactive satellite map"
                        >
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold group-hover/farm:text-emerald-300">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{user.farmPolygon.acreage} Acres</span>
                            {user.farmPolygon.verifiedByAdmin && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-500/30">
                                GPS
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                            {user.farmPolygon.surveyNumber}
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFarmMap(user);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 py-1 cursor-pointer"
                        >
                          <span>+ Map Farm</span>
                        </div>
                      )}
                    </td>

                    {/* Preferences */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono uppercase">
                          {user.language === 'mr' ? 'मराठी' : user.language === 'hi' ? 'हिन्दी' : user.language || 'EN'}
                        </span>
                        {user.womenMode && (
                          <div className="text-[10px] text-pink-400 font-semibold flex items-center gap-1">
                            <span>SHG Priority</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {renderStatusBadge(user.status)}
                    </td>

                    {/* Operational Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View / Inspect Drawer */}
                        <button
                          onClick={() => onSelectUser(user)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                          title="Inspect user details and document schema"
                        >
                          Inspect
                        </button>

                        {/* Manage Personas Modal */}
                        <button
                          onClick={() => onOpenManagePersonas(user)}
                          className="p-1.5 text-xs text-blue-400 hover:text-blue-200 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 rounded-md transition-colors"
                          title="Manage Linked Personas (Link/Unlink/Star Primary)"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {/* Farm Map Modal */}
                        <button
                          onClick={() => onOpenFarmMap(user)}
                          className="p-1.5 text-xs text-teal-400 hover:text-teal-200 bg-teal-950/40 hover:bg-teal-900/60 border border-teal-800/50 rounded-md transition-colors"
                          title="View & Edit Farm Boundary Satellite Polygon"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Change Modal */}
                        <button
                          onClick={() => onOpenStatusChange(user)}
                          className="p-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                          title="Update account status (Verify, Flag, Suspend)"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
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
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
