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
    let base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all ';
    if (isPrimary) {
      base += 'ring-1 ring-amber-400 ';
    }
    switch (persona) {
      case 'Farmer':
        return base + 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Landlord':
        return base + 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Transporter':
        return base + 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Seller':
        return base + 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Equipment Owner':
        return base + 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Broker':
        return base + 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return base + 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending KYC
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Flagged
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Suspended
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-900 border border-red-300">
            Locked (MPIN)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Header Controls / Multi-select info */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 border-b border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900">
            User Profiles Directory
          </span>
          {selectedUserIds.length > 0 && (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold">
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
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={handleSelectAll}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold">Querying User Profiles & Multi-Persona Roster...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-slate-400" />
                    <span className="font-bold text-slate-800">No User Profiles Found</span>
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
                    className={`group hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(user.uid, e)}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{user.id}</span>
                        <button
                          onClick={(e) => handleCopyUid(user.uid, e)}
                          className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5"
                          title={`Copy Firebase UID: ${user.uid}`}
                        >
                          {copiedUid === user.uid ? (
                            <Check className="w-3 h-3 text-emerald-600" />
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
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 shrink-0 text-xs shadow-2xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.womenMode && (
                              <span
                                title="Women SHG Mode Active"
                                className="text-pink-600 inline-flex items-center"
                              >
                                <HeartHandshake className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 font-mono font-medium">
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
                          <span className="text-slate-400 italic text-[11px]">
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
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0 ml-0.5" />
                                )}
                              </span>
                            );
                          })
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2 font-mono">
                        <span>Active: <strong className="text-emerald-900">{user.activePersona || 'Farmer'}</strong></span>
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
                          className="group/farm inline-flex flex-col p-1.5 -m-1.5 rounded-xl hover:bg-emerald-100/70 transition-colors"
                          title="Click to view interactive satellite map"
                        >
                          <div className="flex items-center gap-1 text-emerald-800 font-bold group-hover/farm:text-emerald-950">
                            <MapPin className="w-3 h-3 shrink-0 text-emerald-600" />
                            <span>{user.farmPolygon.acreage} Acres</span>
                            {user.farmPolygon.verifiedByAdmin && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded border border-emerald-300 font-bold">
                                GPS
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-600 font-mono truncate max-w-[140px]">
                            {user.farmPolygon.surveyNumber}
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFarmMap(user);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 py-1 cursor-pointer font-semibold"
                        >
                          <span>+ Map Farm</span>
                        </div>
                      )}
                    </td>

                    {/* Preferences */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono uppercase font-semibold border border-slate-200">
                          {user.language === 'mr' ? 'मराठी' : user.language === 'hi' ? 'हिन्दी' : user.language || 'EN'}
                        </span>
                        {user.womenMode && (
                          <div className="text-[10px] text-pink-700 font-bold flex items-center gap-1">
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
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-950 bg-slate-50 hover:bg-emerald-50 border border-emerald-200/80 rounded-lg transition-colors shadow-2xs"
                          title="Inspect user details and document schema"
                        >
                          Inspect
                        </button>

                        {/* Manage Personas Modal */}
                        <button
                          onClick={() => onOpenManagePersonas(user)}
                          className="p-1.5 text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
                          title="Manage Linked Personas (Link/Unlink/Star Primary)"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {/* Farm Map Modal */}
                        <button
                          onClick={() => onOpenFarmMap(user)}
                          className="p-1.5 text-xs text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shadow-2xs"
                          title="View & Edit Farm Boundary Satellite Polygon"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Change Modal */}
                        <button
                          onClick={() => onOpenStatusChange(user)}
                          className="p-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
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
      <div className="px-4 py-3 bg-emerald-50/40 border-t border-emerald-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs font-semibold"
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
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200/70 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
