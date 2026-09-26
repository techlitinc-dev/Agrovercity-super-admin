import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Clock,
  User,
  ArrowRight,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { adminKycService } from '../../services/adminKycService';
import { useNotification } from '../../context/NotificationContext';

export function KycAuditTrailTable() {
  const { addToast } = useNotification();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [inspectingRecord, setInspectingRecord] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminKycService.listKycAuditHistory({
        query: searchQuery,
        action: actionFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setHistory(res.data.history);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, actionFilter, page, addToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleExportCsv = async () => {
    try {
      const allRes = await adminKycService.listKycAuditHistory({ query: '', action: 'all', page: 1, limit: 10000 });
      const records = allRes.data.history;

      const headers = ['Audit ID', 'Timestamp', 'Admin Actor', 'Admin IP', 'Action', 'Target UID', 'Target User', 'Previous State', 'New State', 'Reason'];
      const rows = records.map((l) => [
        l.id,
        l.timestamp,
        l.adminUid,
        l.ipAddress || '14.139.122.9',
        l.action,
        l.targetUserId,
        `"${l.targetUserName || ''}"`,
        `"${l.previousState || ''}"`,
        `"${l.newState || ''}"`,
        `"${l.reason ? l.reason.replace(/"/g, '""') : ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `agrovercity_kyc_audit_history_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'KYC Audit Exported (CSV)',
        message: `Exported ${records.length} statutory records for state audit review.`,
        type: 'success'
      });
    } catch (err) {
      addToast({ title: 'Export Failed', message: err.message, type: 'error' });
    }
  };

  const handleExportJson = async () => {
    try {
      const allRes = await adminKycService.listKycAuditHistory({ query: '', action: 'all', page: 1, limit: 10000 });
      const records = allRes.data.history;

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `agrovercity_kyc_audit_trail_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'KYC Audit Exported (JSON)',
        message: 'Full cryptographic audit log ledger downloaded.',
        type: 'success'
      });
    } catch (err) {
      addToast({ title: 'Export Failed', message: err.message, type: 'error' });
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'KYC_DOCUMENT_APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            APPROVED ⭐
          </span>
        );
      case 'KYC_DOCUMENT_REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            REJECTED
          </span>
        );
      case 'KYC_DOCUMENT_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            FLAGGED ANOMALY
          </span>
        );
      case 'VAULT_DOCUMENT_PURGED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
            VAULT SHREDDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {action?.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Statutory Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Statutory KYC Verification Audit Trail (Endpoint:{' '}
              <span className="font-mono text-emerald-300 text-xs">/v1/admin/kyc/history</span>)
            </h3>
            <p className="text-xs text-slate-400">
              SOP-03 §5 & §6.2. Permanent ledger of all administrative document reviews, badges, and rejection reasons.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by target user, admin actor, reason, or audit ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Decision:</span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Decisions</option>
              <option value="KYC_DOCUMENT_APPROVED">Approvals ⭐</option>
              <option value="KYC_DOCUMENT_REJECTED">Rejections</option>
              <option value="KYC_DOCUMENT_FLAGGED">Flagged Anomalies</option>
              <option value="VAULT_DOCUMENT_PURGED">Vault Purges</option>
            </select>
          </div>

          <button
            onClick={fetchHistory}
            title="Refresh History"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Audit ID & Time</th>
                <th className="py-3.5 px-4">Admin Reviewer</th>
                <th className="py-3.5 px-4">Decision Action</th>
                <th className="py-3.5 px-4">Target User</th>
                <th className="py-3.5 px-4">Verification Transition (Diff)</th>
                <th className="py-3.5 px-4">Administrative Justification</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No KYC verification history logs found.
                  </td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Admin Actor */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]">{log.adminUid}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{log.ipAddress || '14.139.122.9'}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">{getActionBadge(log.action)}</td>

                    {/* Target User */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{log.targetUserName || 'User'}</div>
                      <div className="font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                        {log.targetUserId}
                      </div>
                    </td>

                    {/* State Diff */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[120px]">
                          {log.previousState || 'pending'}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold truncate max-w-[120px]">
                          {log.newState || 'verified'}
                        </span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="text-[11px] text-slate-700 line-clamp-2" title={log.reason}>
                        {log.reason}
                      </p>
                    </td>

                    {/* Inspect */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectingRecord(log)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="View Raw Audit Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
            Showing <span className="font-bold text-slate-800">{history.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> audit records
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

      {/* Raw Audit Inspection Modal */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Immutable Record: <span className="font-mono text-emerald-700">{inspectingRecord.id}</span>
                </h4>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Decision Action:</span>
                <span className="font-mono font-bold text-slate-900">{inspectingRecord.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Admin Actor:</span>
                <span className="font-mono text-slate-800">{inspectingRecord.adminUid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Timestamp:</span>
                <span className="font-mono text-slate-800">{inspectingRecord.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Client IP:</span>
                <span className="font-mono text-slate-800">{inspectingRecord.ipAddress}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Administrative Justification:</span>
                <p className="p-2 bg-white rounded border border-slate-200 text-slate-800 italic">
                  "{inspectingRecord.reason}"
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Cryptographic JSON Schema Envelope:</span>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                {JSON.stringify(inspectingRecord, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
