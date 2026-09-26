import React, { useState } from 'react'
import {
  Activity,
  ShieldCheck,
  Waves,
  Gauge,
  SlidersHorizontal,
  CheckCircle2,
  BellRing,
  Droplets,
  RotateCcw,
  Search,
  Download,
  Clock,
  Sparkles
} from 'lucide-react'

export default function WaterAuditTrailTable({
  auditLogs = [],
  loading = false,
  onRefresh,
  onExportCsv
}) {
  const [filterAction, setFilterAction] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const getActionBadge = (action) => {
    switch (action) {
      case 'CANAL_SCHEDULE_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Waves className="w-3 h-3 text-cyan-600" /> Canal Rotation Updated
          </span>
        )
      case 'CGWB_READINGS_SYNCED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Gauge className="w-3 h-3 text-blue-600" /> CGWB Readings Synced
          </span>
        )
      case 'SUBSIDY_RULES_CONFIGURED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <SlidersHorizontal className="w-3 h-3 text-purple-600" /> PMKSY Rules Configured
          </span>
        )
      case 'PMKSY_SUBSIDY_APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PMKSY Subsidy Approved
          </span>
        )
      case 'DROUGHT_ALERT_ISSUED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <BellRing className="w-3 h-3 text-rose-600" /> Drought Alert Broadcast
          </span>
        )
      case 'WATER_SCHEDULE_CALIBRATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <Droplets className="w-3 h-3 text-teal-600" /> Schedule Calibrated
          </span>
        )
      case 'EFFICIENCY_AUDIT_RUN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Efficiency & DPDP Audit
          </span>
        )
      case 'SEED_RESET':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <RotateCcw className="w-3 h-3 text-slate-500" /> Seed Reset
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
            {action}
          </span>
        )
    }
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== 'ALL' && log.actionType !== filterAction) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const matchId = (log.id || '').toLowerCase().includes(q)
      const matchAdmin = (log.adminName || log.adminUid || '').toLowerCase().includes(q)
      const matchEntity = (log.entityName || log.entityId || '').toLowerCase().includes(q)
      const matchReason = (log.reason || '').toLowerCase().includes(q)
      const matchPrev = (log.previousState || '').toLowerCase().includes(q)
      const matchNew = (log.newState || '').toLowerCase().includes(q)
      if (!matchId && !matchAdmin && !matchEntity && !matchReason && !matchPrev && !matchNew) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Water Intelligence &amp; Irrigation Statutory Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable ledger of canal timetable modifications, CGWB batch ingests, PMKSY rule calibrations, subsidy approvals, and drought alerts per SOP-17 §6.2.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 w-52 font-sans"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs bg-slate-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Water Actions</option>
            <option value="CANAL_SCHEDULE_UPDATED">Canal Timetable Updates</option>
            <option value="CGWB_READINGS_SYNCED">CGWB Readings Sync</option>
            <option value="SUBSIDY_RULES_CONFIGURED">PMKSY Rules Configuration</option>
            <option value="PMKSY_SUBSIDY_APPROVED">PMKSY Subsidy Approvals</option>
            <option value="DROUGHT_ALERT_ISSUED">Drought Alert Broadcasts</option>
            <option value="WATER_SCHEDULE_CALIBRATED">Schedule Calibrations</option>
            <option value="EFFICIENCY_AUDIT_RUN">Efficiency &amp; DPDP Audits</option>
            <option value="SEED_RESET">Seed Resets</option>
          </select>

          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh Audit Trail"
              className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onExportCsv && (
            <button
              onClick={onExportCsv}
              title="Export Audit Trail to CSV"
              className="p-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
                <th className="px-4 py-3.5">Audit ID &amp; Timestamp</th>
                <th className="px-4 py-3.5">Admin Operator</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">Target Entity</th>
                <th className="px-4 py-3.5">State Transition</th>
                <th className="px-4 py-3.5">Administrative Justification</th>
                <th className="px-4 py-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading statutory water audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{log.adminName || log.adminUid}</div>
                      <div className="font-mono text-[10px] text-teal-700">{log.adminUid}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      {getActionBadge(log.actionType)}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <div className="font-bold text-slate-900">{log.entityName}</div>
                      <div className="text-[10px] text-slate-500">ID: {log.entityId}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] max-w-xs">
                      <div className="text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80 truncate mb-1" title={log.previousState}>
                        <span className="font-sans text-[9px] uppercase font-bold text-amber-700 mr-1">Prev:</span>
                        {log.previousState}
                      </div>
                      <div className="text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/80 truncate" title={log.newState}>
                        <span className="font-sans text-[9px] uppercase font-bold text-emerald-700 mr-1">New:</span>
                        {log.newState}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 text-xs max-w-sm font-medium leading-relaxed">
                      {log.reason}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-slate-500 text-[11px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
