import React, { useState, useEffect, useCallback } from 'react';
import {
  Laptop,
  Smartphone,
  Globe,
  Clock,
  ShieldAlert,
  Search,
  RefreshCw,
  LogOut,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function SessionsTable({ onOpenUserDrawer }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [terminatingId, setTerminatingId] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAuthService.listAllSessions({
        query: searchQuery,
        status: statusFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setSessions(res.data.sessions);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, page, addToast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleTerminate = async (session) => {
    if (!hasPermission('canRevokeSessions')) {
      addToast({
        title: 'Permission Denied',
        message: 'Your current role lacks permission to terminate user sessions.',
        type: 'error'
      });
      return;
    }

    const reason = window.prompt(
      `Enter administrative reason for terminating session on ${session.deviceName} (User: ${session.userName}):`,
      'Manual security termination via Sessions Monitor'
    );
    if (!reason) return;

    setTerminatingId(session.id);
    try {
      const res = await adminAuthService.terminateSingleSession({
        uid: session.userId,
        sessionId: session.id,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({
        title: 'Session Terminated',
        message: res.message,
        type: 'success'
      });
      fetchSessions();
    } catch (err) {
      addToast({ title: 'Termination Failed', message: err.message, type: 'error' });
    } finally {
      setTerminatingId(null);
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
            placeholder="Search by user, IP (49.36...), device name, or location..."
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
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sessions</option>
              <option value="active">Active Only</option>
              <option value="ended">Terminated / Ended</option>
            </select>
          </div>

          <button
            onClick={fetchSessions}
            title="Refresh Sessions"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Session & Device</th>
                <th className="py-3.5 px-4">User Account</th>
                <th className="py-3.5 px-4">IP Address & Network</th>
                <th className="py-3.5 px-4">Geo Location</th>
                <th className="py-3.5 px-4">Session Timing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No active sessions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                sessions.map((ses) => (
                  <tr key={ses.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Session & Device */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                          {ses.userAgent?.includes('Android') || ses.userAgent?.includes('Mobile') ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {ses.deviceName}
                            <span className="font-mono text-[10px] text-slate-400">({ses.id})</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]" title={ses.userAgent}>
                            {ses.userAgent || 'App Client'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* User Account */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(ses.userId)}
                        className={`font-bold text-slate-900 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        {ses.userName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{ses.userMobile}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{ses.userPersona}</div>
                    </td>

                    {/* IP Address & Network */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {ses.ipAddress}
                      </div>
                      {ses.ipAddress === '185.220.101.5' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                          <AlertTriangle className="w-3 h-3" /> TOR Exit Node
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ses.location || 'India (APMC Hub)'}
                      </div>
                    </td>

                    {/* Session Timing */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Started: {new Date(ses.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ses.startedAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {ses.active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Live Session
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Terminated
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {ses.active && (
                        <button
                          onClick={() => handleTerminate(ses)}
                          disabled={terminatingId === ses.id}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{terminatingId === ses.id ? 'Ending...' : 'Terminate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{sessions.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> recorded sessions
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
