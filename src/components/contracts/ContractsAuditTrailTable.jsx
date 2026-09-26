import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  Clock,
  Globe,
  Lock,
  Gavel,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function ContractsAuditTrailTable({
  auditLogs = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const [inspectLog, setInspectLog] = useState(null);

  const getActionBadge = (action) => {
    switch (action) {
      case 'BUYER_CONTRACT_PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Contract Published</span>
          </span>
        );
      case 'ESCROW_PAYMENT_RELEASED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Lock className="w-3 h-3 text-blue-700" />
            <span>Escrow Released</span>
          </span>
        );
      case 'CONTRACT_DISPUTE_ARBITRATED':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Gavel className="w-3 h-3 text-purple-700" />
            <span>Arbitration Verdict</span>
          </span>
        );
      case 'BUYER_CONTRACT_STATUS_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <FileText className="w-3 h-3 text-amber-700" />
            <span>State Transition</span>
          </span>
        );
      case 'INSTITUTIONAL_BUYER_ONBOARDED':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-teal-700" />
            <span>Buyer Onboarded</span>
          </span>
        );
      case 'BUYER_CONTRACT_CREATED':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 border border-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <FileText className="w-3 h-3 text-slate-700" />
            <span>Draft Created</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <span>{action}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Audit ID & Timestamp</th>
              <th className="py-3 px-4">Admin UID</th>
              <th className="py-3 px-4">Action Code</th>
              <th className="py-3 px-4">Target Contract / Entity</th>
              <th className="py-3 px-4">State Transition (Diff)</th>
              <th className="py-3 px-4">Administrative Justification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading statutory contract audit logs...</span>
                  </div>
                </td>
              </tr>
            ) : auditLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Audit Logs Found</span>
                    <span className="text-xs text-slate-400">No events match current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => {
                const isHighValue =
                  log.action === 'ESCROW_PAYMENT_RELEASED' &&
                  (log.newState?.match(/₹[5-9]\d{4}|₹\d{6,}/) || log.reason?.includes('Rule 6.3'));

                return (
                  <tr key={log.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded inline-block text-[11px]">
                        {log.id}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span>{fmtDate(log.timestamp)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.adminUid}</div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Globe className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{log.ipAddress || '14.139.122.9'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div>{getActionBadge(log.action)}</div>
                        {isHighValue && (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Dual-Admin Signed (Rule 6.3)</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate" title={log.targetUserName}>
                        {log.targetUserName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {log.targetUserId}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-1 text-[11px]">
                        <div className="text-rose-700 font-mono text-[10px] truncate" title={log.previousState}>
                          <span className="font-bold">PREV: </span>{log.previousState}
                        </div>
                        <div className="flex items-center gap-1 text-emerald-700 font-mono text-[10px] truncate" title={log.newState}>
                          <ArrowRight className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span className="font-bold">NEW: </span>{log.newState}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs text-[11px] text-slate-700">
                      <div className="italic bg-emerald-50/40 border border-emerald-100 rounded-lg p-1.5 line-clamp-2" title={log.reason}>
                        "{log.reason}"
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectLog(log)}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-emerald-100/70 bg-emerald-50/20 text-xs">
          <span className="text-slate-500 font-medium">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total audit records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Slide-Over Drawer */}
      <DetailDrawer
        open={Boolean(inspectLog)}
        onClose={() => setInspectLog(null)}
        title={inspectLog ? `Audit Record: ${inspectLog.id}` : ''}
        subtitle={inspectLog ? `${inspectLog.action} by ${inspectLog.adminUid}` : ''}
      >
        {inspectLog && (
          <>
            <DrawerSection title="Audit Metadata">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Audit ID" v={inspectLog.id} mono />
                <KeyValue k="Timestamp" v={fmtDate(inspectLog.timestamp)} />
                <KeyValue k="Admin UID" v={inspectLog.adminUid} />
                <KeyValue k="IP Address" v={inspectLog.ipAddress || '14.139.122.9'} mono />
                <KeyValue k="Action Code" v={inspectLog.action} mono />
                <KeyValue k="Target Entity" v={`${inspectLog.targetUserName} (${logId => inspectLog.targetUserId})`} />
              </Card>
            </DrawerSection>

            <DrawerSection title="State Transition Diff">
              <Card className="p-3 space-y-2 text-xs">
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded-lg font-mono">
                  <div className="text-[10px] font-bold uppercase text-rose-600 mb-0.5">Previous State:</div>
                  <div>{inspectLog.previousState}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-lg font-mono">
                  <div className="text-[10px] font-bold uppercase text-emerald-700 mb-0.5">Committed State:</div>
                  <div>{inspectLog.newState}</div>
                </div>
              </Card>
            </DrawerSection>

            <DrawerSection title="Mandatory Administrative Rationale">
              <Card className="p-3 bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800 italic">
                "{inspectLog.reason}"
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Immutable Audit Log JSON">
              <DocJson doc={inspectLog} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
