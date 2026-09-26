import React, { useState } from 'react'
import {
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  RefreshCw,
  Download,
  Search,
  RotateCcw,
  Layers
} from 'lucide-react'

export default function LandRecordsAuditTrailTable({
  auditLogs = [],
  loading = false,
  onRefresh
}) {
  const [filterAction, setFilterAction] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const getActionBadge = (action) => {
    switch (action) {
      case 'MANUAL_PROVISION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Manual Provision (Downtime)
          </span>
        )
      case 'DISCREPANCY_RESOLVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Discrepancy Reconciled
          </span>
        )
      case 'GATEWAY_REFRESH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <RefreshCw className="w-3 h-3 text-sky-600" /> State Gateway Live Sync
          </span>
        )
      case 'SEED_CACHE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Database className="w-3 h-3 text-blue-600" /> Cache Pre-warming
          </span>
        )
      case 'GOVERNMENT_EXPORT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Download className="w-3 h-3 text-amber-600" /> Govt Dossier Exported
          </span>
        )
      case 'COMPLIANCE_AUDITED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <ShieldCheck className="w-3 h-3 text-teal-600" /> DPDP Compliance Run
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
    if (filterAction !== 'ALL' && log.action !== filterAction) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      const matchId = (log.id || '').toLowerCase().includes(q)
      const matchAdmin = (log.adminUid || '').toLowerCase().includes(q)
      const matchTarget = (log.targetUserName || log.targetUserId || '').toLowerCase().includes(q)
      const matchReason = (log.reason || '').toLowerCase().includes(q)
      const matchPrev = (log.previousState || '').toLowerCase().includes(q)
      const matchNew = (log.newState || '').toLowerCase().includes(q)
      if (!matchId && !matchAdmin && !matchTarget && !matchReason && !matchPrev && !matchNew) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mahabhulekh Land Records Statutory Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Immutable audit ledger of manual 7/12 provisions, boundary discrepancy reconciliations, gateway live syncs, and government compliance exports per SOP-16 §5
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
            <option value="ALL">All Revenue Actions</option>
            <option value="MANUAL_PROVISION">Manual Provisions</option>
            <option value="DISCREPANCY_RESOLVE">Discrepancy Resolutions</option>
            <option value="GATEWAY_REFRESH">Gateway Live Syncs</option>
            <option value="SEED_CACHE">Cache Pre-warming</option>
            <option value="GOVERNMENT_EXPORT">Govt Dossier Exports</option>
            <option value="COMPLIANCE_AUDITED">DPDP Compliance Runs</option>
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
                <th className="px-4 py-3.5">Target Cadastral Parcel</th>
                <th className="px-4 py-3.5">Previous State &rarr; New State</th>
                <th className="px-4 py-3.5">Administrative Justification</th>
                <th className="px-4 py-3.5 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    Loading statutory land records audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    No revenue audit logs match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-emerald-800 font-bold">#{log.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-slate-800 font-semibold">{log.adminUid || 'root@agrovercity'}</div>
                      <div className="text-[10px] text-slate-500">Super Admin (customClaims: admin)</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{log.targetUserName || log.targetUserId || '—'}</div>
                      {log.targetUserId && log.targetUserName && (
                        <div className="text-[10px] font-mono text-slate-500">{log.targetUserId}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="text-[11px] text-slate-500 line-through truncate" title={log.previousState}>
                        {log.previousState || '—'}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800 truncate" title={log.newState}>
                        &rarr; {log.newState || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-sm">
                      <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-relaxed font-sans">
                        {log.reason || 'No justification recorded.'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-[10px] text-slate-500">
                      {log.ipAddress || '127.0.0.1'}
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
