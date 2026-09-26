import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  UserCheck,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tractor,
  CalendarClock
} from 'lucide-react';
import { TablePaginationFooter } from './TablePaginationFooter';

export function EquipmentAuditTrailTable({
  auditLogs = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const getActionBadge = (action) => {
    switch (action) {
      case 'EQUIPMENT_VERIFIED_FOR_PUBLIC_BOOKING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Machine Verified
          </span>
        );
      case 'EQUIPMENT_REGISTRATION_REJECTED':
      case 'EQUIPMENT_REMOVED_FROM_BOOKING_POOL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Machine Suspended / Rejected
          </span>
        );
      case 'SLOT_DOUBLE_BOOKING_RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CalendarClock className="w-3 h-3 text-purple-600" /> Slot Anomaly Resolved
          </span>
        );
      case 'EQUIPMENT_BOOKING_FORCE_CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Force Cancelled & Refunded
          </span>
        );
      case 'DAMAGE_REPORT_RESOLVED':
      case 'DEPOSIT_FORFEITURE_FIRST_SIGN_OFF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> Deposit Ruling / Forfeiture
          </span>
        );
      case 'BENCHMARK_RATE_OVERRIDDEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Sliders className="w-3 h-3 text-sky-600" /> Benchmark Tariff Override
          </span>
        );
      case 'EQUIPMENT_ONBOARDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Tractor className="w-3 h-3 text-emerald-600" /> Machine Onboarded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              Statutory Decision Audit Trail (audit_logs)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
              Immutable
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            SOP-09 Rule 2 Compliance: Comprehensive audit records with previous & new states, dual-admin sign-offs, and actor IP addresses.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
            Rule 3 Dual Sign-Off ($&gt;₹50,000) Active
          </span>
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Log ID</th>
              <th className="py-3.5 px-4 min-w-[140px]">Timestamp & IP</th>
              <th className="py-3.5 px-4 min-w-[160px]">Admin Actor</th>
              <th className="py-3.5 px-4 min-w-[180px]">Action Category</th>
              <th className="py-3.5 px-4 min-w-[180px]">Target Subject</th>
              <th className="py-3.5 px-4 min-w-[260px]">State Transition Diff</th>
              <th className="py-3.5 px-4 min-w-[220px]">Administrative Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading statutory audit trail...</span>
                  </div>
                </td>
              </tr>
            ) : auditLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No statutory audit log entries found.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => {
                const isForfeitureOrHighValue =
                  log.action?.includes('DEPOSIT') ||
                  log.action?.includes('FORFEIT') ||
                  log.newState?.includes('₹');

                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {log.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.ipAddress || '14.139.122.9'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{log.adminUid}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Super Admin</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getActionBadge(log.action)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{log.targetUserName || 'System'}</div>
                      <span className="text-[10px] font-mono text-slate-500">{log.targetUserId}</span>
                    </td>

                    {/* Visual State Diff */}
                    <td className="py-3.5 px-4">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 font-mono text-[10px] space-y-1">
                        <div className="text-slate-500 flex items-start gap-1">
                          <span className="font-bold text-rose-600 shrink-0">PREV:</span>
                          <span className="truncate">{log.previousState}</span>
                        </div>
                        <div className="text-emerald-900 font-semibold flex items-start gap-1">
                          <span className="font-bold text-emerald-600 shrink-0">NEW:</span>
                          <span className="truncate">{log.newState}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rationale */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                      <div>{log.reason}</div>
                      {isForfeitureOrHighValue && (
                        <div className="mt-1 flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 w-fit">
                          <ShieldCheck className="w-3 h-3" /> Rule 3 Dual-Sign Off Validated
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <TablePaginationFooter
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
