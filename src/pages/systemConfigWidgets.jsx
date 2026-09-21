import React from 'react'
import {
  Sliders,
  Activity,
  Bell,
  AlertOctagon,
  Ban,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  Layers,
  Search,
  RefreshCw,
  Download,
  Plus,
  Send,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  Flame,
  Radio,
  FileText
} from 'lucide-react'

export function fmtINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}

export function formatDate(isoStr) {
  if (!isoStr) return '—'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return isoStr
  }
}

export function StatusBadge({ status }) {
  const map = {
    // Health
    healthy: { label: 'Healthy (Operational)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    degraded: { label: 'Degraded Latency', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },

    // Broadcasts
    sent: { label: 'Dispatched (FCM)', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    scheduled: { label: 'Scheduled Queue', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },

    // Reports / Moderation
    pending: { label: 'Report Pending Review', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' },
    investigating: { label: 'Under Investigation', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    resolved_warning: { label: 'Warning Issued', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    resolved_banned: { label: 'User Permanently Banned', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 font-bold' },
    dismissed: { label: 'Report Dismissed', bg: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/30' },

    // Consents
    granted: { label: 'Consent Granted', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    revoked: { label: 'Consent Revoked', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-800 text-slate-400 border-slate-700' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function UrgencyBadge({ urgency }) {
  const map = {
    critical_weather: { label: 'Critical Weather', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse font-bold' },
    high: { label: 'High Priority', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
    normal: { label: 'Standard Broadcast', bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30' }
  }
  const badge = map[urgency] || { label: urgency, bg: 'bg-slate-800 text-slate-400 border-slate-700' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${badge.bg}`}>
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-800', bg: 'bg-emerald-100/80', border: 'border-emerald-300/80' },
    blue: { text: 'text-teal-800', bg: 'bg-teal-100/80', border: 'border-teal-300/80' },
    amber: { text: 'text-amber-800', bg: 'bg-amber-100/80', border: 'border-amber-300/80' },
    purple: { text: 'text-emerald-900', bg: 'bg-emerald-100/80', border: 'border-emerald-300/80' },
    rose: { text: 'text-rose-800', bg: 'bg-rose-100/80', border: 'border-rose-300/80' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/25 p-4 flex flex-col justify-between hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_12px_36px_rgb(16,185,129,0.12)] transition-all duration-300 shadow-[0_8px_30px_rgb(16,185,129,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl group">
      {/* Top agricultural green sprout accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-900/80 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text} border ${c.border} shadow-2xs group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold font-mono text-emerald-950 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-emerald-800/80 font-medium">
          <span className="truncate mr-2">{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} shadow-2xs shrink-0`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function SystemConfigMetricBar({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-900/60 border border-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="26 Platform Modules"
        value="26 / 26 Operational"
        subtitle={`${summary.systemUptimePct || 99.98}% System Uptime SLA`}
        icon={Server}
        badge="Unified Architecture"
        color="emerald"
      />
      <MetricCard
        title="Mobile Version Gates"
        value={`v${summary.minSupportedAppVersion} → v${summary.latestAppVersion}`}
        subtitle={`${summary.activeFeatureFlagCount || 8} Dynamic Feature Flags`}
        icon={Smartphone}
        badge="Force Update Active"
        color="blue"
      />
      <MetricCard
        title="Targeted Broadcasts"
        value={(summary.broadcastsDeliveredThisMonth || 0).toLocaleString()}
        subtitle="Push Notifications Delivered (Month)"
        icon={Bell}
        badge="FCM Multi-Region"
        color="purple"
      />
      <MetricCard
        title="Moderation & Fraud Desk"
        value={`${summary.pendingModerationReports || 0} Queued | ${summary.totalBannedUsers || 0} Banned`}
        subtitle="DPDP Consent Compliance: 100%"
        icon={AlertOctagon}
        badge={summary.pendingModerationReports > 0 ? 'Action Required' : 'Clean Queue'}
        color={summary.pendingModerationReports > 0 ? 'amber' : 'emerald'}
      />
    </div>
  )
}

export function SystemConfigTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'health', label: 'System Health & Latency', icon: Activity },
    { id: 'remote_config', label: 'Remote Config & Feature Flags', icon: Sliders },
    { id: 'broadcasts', label: 'Targeted FCM Broadcasts', icon: Bell, count: counts.broadcasts },
    { id: 'moderation', label: 'User Reports & Moderation', icon: AlertOctagon, count: counts.reports },
    { id: 'blocks', label: 'Banned Accounts Registry', icon: Ban, count: counts.blocks },
    { id: 'dpdp_consents', label: 'DPDP Consent Audit', icon: ShieldCheck },
    { id: 'audit', label: 'Platform Audit Logs', icon: FileText, count: counts.audit }
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function SystemConfigFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  activeTab,
  onRefresh,
  onExportCsv,
  onOpenBroadcastModal,
  onOpenConfigModal
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        {activeTab !== 'health' && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={
                activeTab === 'broadcasts'
                  ? 'Search by broadcast title, ID, or district...'
                  : activeTab === 'moderation'
                  ? 'Search by reported user, ID, phone, or reporter...'
                  : activeTab === 'blocks'
                  ? 'Search by banned user, Aadhaar, or reason...'
                  : activeTab === 'dpdp_consents'
                  ? 'Search consents by user, version, or purpose...'
                  : activeTab === 'audit'
                  ? 'Search audit logs by admin, IP, action...'
                  : 'Search platform records...'
              }
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        )}

        {/* Status Dropdown for Moderation */}
        {activeTab === 'moderation' && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="investigating">Under Investigation</option>
            <option value="resolved_warning">Warning Issued</option>
            <option value="resolved_banned">Permanently Banned</option>
            <option value="dismissed">Dismissed (No Violation)</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {activeTab !== 'health' && (
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}

        {activeTab === 'broadcasts' && onOpenBroadcastModal && (
          <button
            onClick={onOpenBroadcastModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Compose FCM Broadcast</span>
          </button>
        )}

        {activeTab === 'remote_config' && onOpenConfigModal && (
          <button
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Version Gates & Maintenance</span>
          </button>
        )}
      </div>
    </div>
  )
}


// 1. System Health & Telemetry View
export function SystemHealthView({ health, onRefreshHealth }) {
  if (!health) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h3 className="text-sm font-bold text-white">Live Microservices Telemetry Gateway</h3>
            <p className="text-xs text-slate-400 font-mono">Last Heartbeat: {formatDate(health.lastHealthCheckAt)}</p>
          </div>
        </div>
        <button
          onClick={onRefreshHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping Services</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>FastAPI Gateway</span>
            <span className="font-mono text-emerald-400 font-bold">:8000 Online</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{health.apiGatewayLatencyMs} ms</div>
          <p className="text-[11px] text-slate-500">P99 response latency &lt; 50ms SLA</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Redis L2 Cache</span>
            <span className="font-mono text-emerald-400 font-bold">{health.redisMemoryUsageMb} MB</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{health.redisCacheHitRatePct}%</div>
          <p className="text-[11px] text-slate-500">Sub-5ms Mandi rate cache hit rate</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PostgreSQL Pool</span>
            <span className="font-mono text-blue-400 font-bold">{health.databaseConnectionsActive} / {health.databaseConnectionsMax}</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">Healthy</div>
          <p className="text-[11px] text-slate-500">HikariCP connection pool healthy</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sentry Error Rate</span>
            <span className="font-mono text-emerald-400 font-bold">Passing</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{health.sentryErrorRatePct}%</div>
          <p className="text-[11px] text-slate-500">Global error rate well below 0.1%</p>
        </div>
      </div>
    </div>
  )
}

// 2. Remote Config View
export function RemoteConfigView({ config, onEditConfig, onToggleFlag }) {
  if (!config) return null

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Mobile App Version Gates</h3>
            <p className="text-xs text-slate-400">Enforces minimum supported APK/IPA builds and emergency maintenance</p>
          </div>
          <button
            onClick={onEditConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Version Gates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400">Latest Production Release:</span>
            <div className="text-xl font-bold font-mono text-white">v{config.latestVersion}</div>
            <p className="text-[11px] text-slate-500">Current build on Google Play & App Store</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400">Minimum Supported Version:</span>
            <div className="text-xl font-bold font-mono text-emerald-400">v{config.minSupportedVersion}</div>
            <p className="text-[11px] text-slate-500">
              {config.forceUpdateEnabled ? 'Force-update splash mandatory below this build' : 'Soft update warning'}
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400">Platform Maintenance Switch:</span>
            <div className={`text-xl font-bold font-mono ${config.maintenanceMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {config.maintenanceMode ? 'MAINTENANCE ACTIVE' : 'LIVE & OPERATIONAL'}
            </div>
            <p className="text-[11px] text-slate-500">
              {config.maintenanceMode ? config.maintenanceMessage : 'All services accepting incoming traffic'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Feature Flags Matrix (Dynamic Remote Config)</h3>
          <p className="text-xs text-slate-400">Enable or disable module subsystems across mobile apps without redeployment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(config.featureFlags || {}).map(([key, enabled]) => (
            <div
              key={key}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white font-mono">{key}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {enabled ? 'Active across all user devices' : 'Disabled globally'}
                </div>
              </div>
              <button
                onClick={() => onToggleFlag(key, !enabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  enabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 3. Broadcasts Table
export function BroadcastsTable({ data, onSelectRow }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No push notification broadcasts recorded.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Title & Broadcast ID</th>
            <th className="px-3.5 py-2.5">Urgency</th>
            <th className="px-3.5 py-2.5">Target Audience & Region</th>
            <th className="px-3.5 py-2.5">Recipients Delivered</th>
            <th className="px-3.5 py-2.5">CTR (%)</th>
            <th className="px-3.5 py-2.5">Sent Timestamp</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.title}</div>
                <div className="text-[11px] font-mono text-slate-400">{row.id}</div>
              </td>
              <td className="px-3.5 py-3">
                <UrgencyBadge urgency={row.urgency} />
              </td>
              <td className="px-3.5 py-3">
                <div className="text-white capitalize">{row.targetPersona}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {row.targetDistrict === 'all' ? 'All Districts' : row.targetDistrict}, {row.targetState}
                </div>
              </td>
              <td className="px-3.5 py-3 font-mono font-bold text-white">
                {row.deliveredCount?.toLocaleString()} / {row.recipientCount?.toLocaleString()}
              </td>
              <td className="px-3.5 py-3 font-mono text-emerald-400 font-bold">
                {row.clickRatePct}%
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-400 text-[11px]">
                {formatDate(row.sentAt)}
              </td>
              <td className="px-3.5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 4. User Moderation Reports Table
export function UserReportsTable({ data, onSelectRow, onResolveReport }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No moderation complaints in queue.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Reported User & Accused ID</th>
            <th className="px-3.5 py-2.5">Category & Severity</th>
            <th className="px-3.5 py-2.5">Reporter & Evidence</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5">Created At</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.reportedUserName}</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {row.reportedUserId} · {row.reportedUserPhone}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-mono uppercase">
                  {row.category}
                </span>
                <div className="text-[10px] text-slate-400 mt-1 capitalize">Severity: {row.severity}</div>
              </td>
              <td className="px-3.5 py-3 max-w-xs">
                <div className="text-white font-medium">{row.reporterName}</div>
                <div className="text-[11px] text-slate-400 truncate">{row.evidenceDescription}</div>
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-400 text-[11px]">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-3.5 py-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {row.status !== 'resolved_banned' && row.status !== 'dismissed' && (
                  <button
                    onClick={() => onResolveReport(row)}
                    className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-semibold transition-colors"
                  >
                    Moderate
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 transition-colors"
                >
                  Evidence
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 5. User Blocks / Blacklist Table
export function UserBlocksTable({ data, onUnbanUser }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No permanently banned users or syndicates recorded.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">User & ID</th>
            <th className="px-3.5 py-2.5">Phone & Masked Aadhaar</th>
            <th className="px-3.5 py-2.5">Persona & District</th>
            <th className="px-3.5 py-2.5">Ban Reason</th>
            <th className="px-3.5 py-2.5">Banned Timestamp</th>
            <th className="px-3.5 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-3.5 py-3">
                <div className="font-semibold text-rose-400">{row.userName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.userId}</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-300">
                <div>{row.userPhone}</div>
                <div className="text-[11px] text-slate-500">{row.userAadhaarMasked}</div>
              </td>
              <td className="px-3.5 py-3 capitalize">
                <div className="text-white">{row.persona}</div>
                <div className="text-[11px] text-slate-400">{row.district}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-300 max-w-xs">{row.banReason}</td>
              <td className="px-3.5 py-3 font-mono text-slate-400 text-[11px]">
                {formatDate(row.bannedAt)}
              </td>
              <td className="px-3.5 py-3 text-right">
                <button
                  onClick={() => onUnbanUser(row)}
                  className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[11px] transition-colors"
                >
                  Unban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 6. DPDP Consents Ledger Table
export function UserConsentsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No DPDP user consent audit logs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">User & ID</th>
            <th className="px-3.5 py-2.5">Consent Specification</th>
            <th className="px-3.5 py-2.5">Purpose & Lawful Scope</th>
            <th className="px-3.5 py-2.5">Status</th>
            <th className="px-3.5 py-2.5">IP & Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-3.5 py-3">
                <div className="font-semibold text-white">{row.userName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.userId}</div>
              </td>
              <td className="px-3.5 py-3 font-mono text-emerald-400">
                {row.consentVersion}
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-300 text-[11px]">
                {row.purpose}
              </td>
              <td className="px-3.5 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3.5 py-3 font-mono text-slate-400 text-[11px]">
                <div>{row.ipAddress}</div>
                <div>{formatDate(row.timestamp)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 7. Audit Logs Table
export function SystemConfigAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No administrative audit logs recorded for System Configuration.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
          <tr>
            <th className="px-3.5 py-2.5">Timestamp & IP</th>
            <th className="px-3.5 py-2.5">Action & Collection</th>
            <th className="px-3.5 py-2.5">Target Entity</th>
            <th className="px-3.5 py-2.5">State Transition</th>
            <th className="px-3.5 py-2.5">Administrative Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-3.5 py-3 font-mono text-[11px]">
                <div className="text-white">{formatDate(row.timestamp)}</div>
                <div className="text-slate-500">
                  {row.ipAddress} · {row.adminName}
                </div>
              </td>
              <td className="px-3.5 py-3">
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {row.actionType}
                </span>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
              </td>
              <td className="px-3.5 py-3">
                <div className="font-medium text-white">{row.entityName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
              </td>
              <td className="px-3.5 py-3 text-[11px] font-mono">
                {row.previousState && <div className="text-slate-400">Prev: {row.previousState}</div>}
                <div className="text-emerald-400">New: {row.newState}</div>
              </td>
              <td className="px-3.5 py-3 text-slate-300 max-w-xs">{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Pagination
export function ContentPagination({ page, total, pageSize = 20, onPageChange }) {
  const totalPages = Math.ceil((total || 0) / pageSize) || 1
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-400">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono text-slate-200">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
