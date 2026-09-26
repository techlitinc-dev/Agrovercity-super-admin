import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  FileText,
  X,
  ExternalLink
} from 'lucide-react';
import { adminMandiService } from '../../services/adminMandiService';
import { useNotification } from '../../context/NotificationContext';

export function MandiAuditTrailTable() {
  const { addToast } = useNotification();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [inspectLog, setInspectLog] = useState(null);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminMandiService.listMandiAuditLogs({
        query: searchQuery,
        action: actionFilter,
        page,
        limit: 10
      });
      setLogs(res.logs);
      setPagination(res.pagination);
    } catch (err) {
      addToast({
        title: 'Failed to Fetch Audit Logs',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [searchQuery, actionFilter]);

  const renderActionBadge = (action) => {
    switch (action) {
      case 'MANDI_RATE_APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Rate Approved
          </span>
        );
      case 'MANDI_RATE_REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-700" />
            Rate Rejected
          </span>
        );
      case 'MANDI_PRICE_MANUAL_OVERRIDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <AlertTriangle className="w-3 h-3 text-sky-700" />
            Price Override
          </span>
        );
      case 'AGMARKNET_API_SYNC_TRIGGERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            Agmarknet Sync
          </span>
        );
      case 'GATEWAY_HEALTH_PING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            Gateway Ping
          </span>
        );
      case 'GATEWAY_ALERT_RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
            Alert Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-800">
            {action}
          </span>
        );
    }
  };

  const handleExportCsv = () => {
    let csv = 'data:text/csv;charset=utf-8,Audit ID,Action,Target Entity,Previous State,New State,Reason,Admin UID,IP Address,Timestamp\n';
    logs.forEach((l) => {
      csv += `"${l.id}","${l.action}","${l.targetUserName}","${l.previousState?.replace(/"/g, '""')}","${l.newState?.replace(/"/g, '""')}","${l.reason?.replace(/"/g, '""')}","${l.adminUid}","${l.ipAddress}","${l.timestamp}"\n`;
    });
    const uri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = uri;
    link.download = `mandi_audit_trail_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mandi_audit_trail_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5">
      {/* Subheader & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Mandi Operations Statutory Audit Trail (<span className="font-mono text-xs text-emerald-700">audit_logs</span>)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all rate approvals, predatory rejections, manual APMC overrides, and government sync triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold border border-emerald-200 shadow-xs"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Search & Action Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit records by ID, Trader, Mandi, Reason or Admin UID..."
            className="w-full pl-9 pr-3 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-xs font-semibold text-slate-600">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Mandi Actions</option>
            <option value="MANDI_RATE_APPROVED">Rate Approved</option>
            <option value="MANDI_RATE_REJECTED">Rate Rejected</option>
            <option value="MANDI_PRICE_MANUAL_OVERRIDE">Manual Override</option>
            <option value="AGMARKNET_API_SYNC_TRIGGERED">Agmarknet Sync</option>
            <option value="GATEWAY_HEALTH_PING">Gateway Ping</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-emerald-100 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-emerald-50/60 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-2.5 px-3">Event ID</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-4 min-w-[160px]">Target Entity</th>
              <th className="py-2.5 px-4 min-w-[220px]">State Transition (Diff)</th>
              <th className="py-2.5 px-4 min-w-[200px]">Administrative Reason</th>
              <th className="py-2.5 px-3">Admin & IP</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-2 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading audit records...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No Mandi audit records found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{log.id}</td>
                  <td className="py-2.5 px-3">{renderActionBadge(log.action)}</td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900 truncate max-w-[180px]">{log.targetUserName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.targetUserId}</div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="text-[11px] text-slate-500 font-mono truncate max-w-[240px]">
                      <span className="text-slate-400">Prev:</span> {log.previousState}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-mono font-semibold truncate max-w-[240px]">
                      <span className="text-slate-400 font-normal">New:</span> {log.newState}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 italic text-[11px] max-w-[200px] truncate">
                    "{log.reason}"
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800 truncate max-w-[120px]">{log.adminUid}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={() => setInspectLog(log)}
                      className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Inspect Raw JSON"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <div>
          Showing {logs.length} of {pagination.total} audit records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogs(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold"
          >
            Prev
          </button>
          <span className="font-mono text-slate-700 font-bold">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchLogs(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      {/* Inspect Raw Audit Event Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-emerald-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Raw Audit Event: {inspectLog.id}</span>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                {JSON.stringify(inspectLog, null, 2)}
              </pre>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
