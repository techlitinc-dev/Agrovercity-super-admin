import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  UserCheck,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function MarketplaceAuditTrailTable({
  auditLogs = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const [inspectLog, setInspectLog] = useState(null);

  const getActionBadge = (action) => {
    switch (action) {
      case 'AGMARK_QR_CERTIFICATE_ATTESTED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Agmark QR Attestation</span>
          </span>
        );
      case 'AGMARK_QR_CERTIFICATE_REVOKED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            <span>QR Revoked</span>
          </span>
        );
      case 'RAZORPAY_PAYMENT_REFUND_PROCESSED':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <FileText className="w-3 h-3 text-amber-700" />
            <span>Razorpay Refund</span>
          </span>
        );
      case 'MARKETPLACE_ORDER_STATUS_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <UserCheck className="w-3 h-3 text-blue-700" />
            <span>Order State Transition</span>
          </span>
        );
      case 'MARKETPLACE_PRODUCT_CREATED':
      case 'MARKETPLACE_PRODUCT_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <FileText className="w-3 h-3 text-purple-700" />
            <span>Catalog Modification</span>
          </span>
        );
      case 'CUSTOMER_REVIEW_MODERATED':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3 text-teal-700" />
            <span>Review Moderation</span>
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
              <th className="py-3 px-4">Action & Compliance</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">State Transition (Diff)</th>
              <th className="py-3 px-4">Mandatory Justification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading statutory audit logs...</span>
                  </div>
                </td>
              </tr>
            ) : auditLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Audit Records Found</span>
                    <span className="text-xs text-slate-400">No administrative events match current criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => {
                const isHighValueRefund =
                  log.action === 'RAZORPAY_PAYMENT_REFUND_PROCESSED' &&
                  (log.newState?.includes('50,000') || log.newState?.match(/₹[5-9]\d{4}|₹\d{6,}/));

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
                        {isHighValueRefund && (
                          <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                            <span>Dual-Admin Sign-Off (Rule 6.3)</span>
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
                <KeyValue k="Target Entity" v={`${inspectLog.targetUserName} (${inspectLog.targetUserId})`} />
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

            <DrawerSection title="Administrative Justification">
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
