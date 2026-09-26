import React, { useState, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Laptop,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  Bell,
  Clock,
  Check,
  Copy,
  Trash2
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function DevicesTable({ onOpenUserDrawer }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [copiedId, setCopiedId] = useState(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAuthService.listAllDevices({
        query: searchQuery,
        platform: platformFilter,
        status: statusFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setDevices(res.data.devices);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, platformFilter, statusFilter, page, addToast]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    addToast({ title: 'Copied', message: 'Token copied to clipboard', type: 'info' });
  };

  const handleRevokeDevice = async (device) => {
    if (!hasPermission('canRevokeSessions')) {
      addToast({
        title: 'Permission Denied',
        message: 'Your role lacks permission to revoke hardware device trust.',
        type: 'error'
      });
      return;
    }

    const reason = window.prompt(
      `Enter reason for revoking trust for ${device.deviceName} (User: ${device.userName}):`,
      'Reported lost/stolen hardware device'
    );
    if (!reason) return;

    try {
      const res = await adminAuthService.revokeDeviceTrust({
        uid: device.userId,
        deviceId: device.id,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({
        title: 'Device Trust Revoked',
        message: res.message,
        type: 'success'
      });
      fetchDevices();
    } catch (e) {
      addToast({ title: 'Revocation Failed', message: e.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by device model (Samsung, Redmi), user name, or OS..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Web">Web Desktop</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Trust:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Devices</option>
              <option value="trusted">Trusted Hardware</option>
              <option value="revoked">Revoked / Blacklisted</option>
            </select>
          </div>

          <button
            onClick={fetchDevices}
            title="Refresh Devices"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Hardware Device</th>
                <th className="py-3.5 px-4">Enrolled User</th>
                <th className="py-3.5 px-4">OS & Client Build</th>
                <th className="py-3.5 px-4">FCM Push Token</th>
                <th className="py-3.5 px-4">Biometrics</th>
                <th className="py-3.5 px-4">Trust Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No enrolled hardware devices found matching the query.
                  </td>
                </tr>
              ) : (
                devices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Device Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                          {dev.platform === 'Android' || dev.platform === 'iOS' ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {dev.deviceName}
                            <span className="font-mono text-[10px] text-slate-400">({dev.id})</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Registered: {new Date(dev.registeredAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Enrolled User */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(dev.userId)}
                        className={`font-bold text-slate-900 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        {dev.userName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{dev.userMobile}</div>
                    </td>

                    {/* OS & Version */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{dev.osVersion || dev.platform}</div>
                      <div className="text-[10px] font-mono text-emerald-700">{dev.appVersion || 'v2.4.0'}</div>
                    </td>

                    {/* Push Token */}
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg w-fit">
                        <Bell className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px]">{dev.pushToken?.slice(0, 16)}...</span>
                        <button
                          onClick={() => handleCopy(dev.pushToken, dev.id)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {copiedId === dev.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Biometrics */}
                    <td className="py-3.5 px-4">
                      {dev.biometricEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                          Hardware Key
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">PIN Only</span>
                      )}
                    </td>

                    {/* Trust Status */}
                    <td className="py-3.5 px-4">
                      {dev.status === 'trusted' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Trusted Device
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {dev.status === 'trusted' && (
                        <button
                          onClick={() => handleRevokeDevice(dev)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Revoke Trust
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{devices.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> hardware devices
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-slate-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
