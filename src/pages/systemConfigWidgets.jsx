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
    healthy: { label: 'Healthy (Operational)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    degraded: { label: 'Degraded Latency', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' },

    // Broadcasts
    sent: { label: 'Dispatched (FCM)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    scheduled: { label: 'Scheduled Queue', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' },

    // Reports / Moderation
    pending: { label: 'Report Pending Review', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold animate-pulse' },
    investigating: { label: 'Under Investigation', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' },
    resolved_warning: { label: 'Warning Issued', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' },
    resolved_banned: { label: 'User Permanently Banned', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' },
    dismissed: { label: 'Report Dismissed', bg: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold' },

    // Consents
    granted: { label: 'Consent Granted', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' },
    revoked: { label: 'Consent Revoked', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-600 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg}`}>
      {badge.label}
    </span>
  )
}

export function UrgencyBadge({ urgency }) {
  const map = {
    critical_weather: { label: 'Critical Weather', bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-bold' },
    high: { label: 'High Priority', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold' },
    normal: { label: 'Standard Broadcast', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' }
  }
  const badge = map[urgency] || { label: urgency, bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${badge.bg}`}>
      <span>{badge.label}</span>
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80', badgeBg: 'bg-emerald-100/70 text-emerald-800 border-emerald-200' },
    blue: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200/80', badgeBg: 'bg-blue-100/70 text-blue-800 border-blue-200' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200/80', badgeBg: 'bg-amber-100/70 text-amber-800 border-amber-200' },
    purple: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200/80', badgeBg: 'bg-purple-100/70 text-purple-800 border-purple-200' },
    rose: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/80', badgeBg: 'bg-rose-100/70 text-rose-800 border-rose-200' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <span className="truncate mr-2">{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border shrink-0 ${c.badgeBg}`}>
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
          <div key={i} className="h-28 bg-white/70 border border-emerald-100 rounded-2xl animate-pulse" />
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
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-100/90 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-emerald-100/90 shadow-xs">
      <div className="flex flex-1 items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        {activeTab !== 'health' && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        )}

        {/* Status Dropdown for Moderation */}
        {activeTab === 'moderation' && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {activeTab !== 'health' && (
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        )}

        {activeTab === 'broadcasts' && onOpenBroadcastModal && (
          <button
            onClick={onOpenBroadcastModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Compose FCM Broadcast</span>
          </button>
        )}

        {activeTab === 'remote_config' && onOpenConfigModal && (
          <button
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
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
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-emerald-100/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Microservices Telemetry Gateway</h3>
            <p className="text-xs text-slate-500 font-mono">Last Heartbeat: {formatDate(health.lastHealthCheckAt)}</p>
          </div>
        </div>
        <button
          onClick={onRefreshHealth}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping Services</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
            <span>FastAPI Gateway</span>
            <span className="font-mono text-emerald-700 font-bold">:8000 Online</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{health.apiGatewayLatencyMs} ms</div>
          <p className="text-[11px] text-slate-500">P99 response latency &lt; 50ms SLA</p>
        </div>

        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
            <span>Redis L2 Cache</span>
            <span className="font-mono text-emerald-700 font-bold">{health.redisMemoryUsageMb} MB</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">{health.redisCacheHitRatePct}%</div>
          <p className="text-[11px] text-slate-500">Sub-5ms Mandi rate cache hit rate</p>
        </div>

        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
            <span>PostgreSQL Pool</span>
            <span className="font-mono text-blue-700 font-bold">{health.databaseConnectionsActive} / {health.databaseConnectionsMax}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">Healthy</div>
          <p className="text-[11px] text-slate-500">HikariCP connection pool healthy</p>
        </div>

        <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 space-y-1 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
            <span>Sentry Error Rate</span>
            <span className="font-mono text-emerald-700 font-bold">Passing</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">{health.sentryErrorRatePct}%</div>
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
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mobile App Version Gates</h3>
            <p className="text-xs text-slate-500">Enforces minimum supported APK/IPA builds and emergency maintenance</p>
          </div>
          <button
            onClick={onEditConfig}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Version Gates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/80 space-y-1">
            <span className="text-slate-500 font-medium">Latest Production Release:</span>
            <div className="text-xl font-bold font-mono text-slate-900">v{config.latestVersion}</div>
            <p className="text-[11px] text-slate-500">Current build on Google Play & App Store</p>
          </div>
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/80 space-y-1">
            <span className="text-slate-500 font-medium">Minimum Supported Version:</span>
            <div className="text-xl font-bold font-mono text-emerald-700">v{config.minSupportedVersion}</div>
            <p className="text-[11px] text-slate-500">
              {config.forceUpdateEnabled ? 'Force-update splash mandatory below this build' : 'Soft update warning'}
            </p>
          </div>
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/80 space-y-1">
            <span className="text-slate-500 font-medium">Platform Maintenance Switch:</span>
            <div className={`text-xl font-bold font-mono ${config.maintenanceMode ? 'text-rose-700' : 'text-emerald-700'}`}>
              {config.maintenanceMode ? 'MAINTENANCE ACTIVE' : 'LIVE & OPERATIONAL'}
            </div>
            <p className="text-[11px] text-slate-500">
              {config.maintenanceMode ? config.maintenanceMessage : 'All services accepting incoming traffic'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Feature Flags Matrix (Dynamic Remote Config)</h3>
          <p className="text-xs text-slate-500">Enable or disable module subsystems across mobile apps without redeployment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {Object.entries(config.featureFlags || {}).map(([key, enabled]) => (
            <div
              key={key}
              className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-3.5 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 font-mono">{key}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {enabled ? 'Active across all user devices' : 'Disabled globally'}
                </div>
              </div>
              <button
                onClick={() => onToggleFlag(key, !enabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  enabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
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
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No push notification broadcasts recorded.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">Title & Broadcast ID</th>
            <th className="px-4 py-3">Urgency</th>
            <th className="px-4 py-3">Target Audience & Region</th>
            <th className="px-4 py-3">Recipients Delivered</th>
            <th className="px-4 py-3">CTR (%)</th>
            <th className="px-4 py-3">Sent Timestamp</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-900">{row.title}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.id}</div>
              </td>
              <td className="px-4 py-3.5">
                <UrgencyBadge urgency={row.urgency} />
              </td>
              <td className="px-4 py-3.5">
                <div className="text-slate-900 font-medium capitalize">{row.targetPersona}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {row.targetDistrict === 'all' ? 'All Districts' : row.targetDistrict}, {row.targetState}
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                {row.deliveredCount?.toLocaleString()} / {row.recipientCount?.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                {row.clickRatePct}%
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
                {formatDate(row.sentAt)}
              </td>
              <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
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
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No moderation complaints in queue.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">Reported User & Accused ID</th>
            <th className="px-4 py-3">Category & Severity</th>
            <th className="px-4 py-3">Reporter & Evidence</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow(row)}
              className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-900">{row.reportedUserName}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  {row.reportedUserId} · {row.reportedUserPhone}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-mono uppercase font-bold">
                  {row.category}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 capitalize">Severity: {row.severity}</div>
              </td>
              <td className="px-4 py-3.5 max-w-xs">
                <div className="text-slate-900 font-bold">{row.reporterName}</div>
                <div className="text-[11px] text-slate-600 truncate">{row.evidenceDescription}</div>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
                {formatDate(row.createdAt)}
              </td>
              <td className="px-4 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                {row.status !== 'resolved_banned' && row.status !== 'dismissed' && (
                  <button
                    onClick={() => onResolveReport(row)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold transition-colors shadow-xs"
                  >
                    Moderate
                  </button>
                )}
                <button
                  onClick={() => onSelectRow(row)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
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
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No permanently banned users or syndicates recorded.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">User & ID</th>
            <th className="px-4 py-3">Phone & Masked Aadhaar</th>
            <th className="px-4 py-3">Persona & District</th>
            <th className="px-4 py-3">Ban Reason</th>
            <th className="px-4 py-3">Banned Timestamp</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="px-4 py-3.5">
                <div className="font-bold text-rose-700">{row.userName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.userId}</div>
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-700">
                <div className="font-semibold">{row.userPhone}</div>
                <div className="text-[11px] text-slate-500">{row.userAadhaarMasked}</div>
              </td>
              <td className="px-4 py-3.5 capitalize">
                <div className="text-slate-900 font-bold">{row.persona}</div>
                <div className="text-[11px] text-slate-500">{row.district}</div>
              </td>
              <td className="px-4 py-3.5 text-slate-700 max-w-xs">{row.banReason}</td>
              <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
                {formatDate(row.bannedAt)}
              </td>
              <td className="px-4 py-3.5 text-right">
                <button
                  onClick={() => onUnbanUser(row)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold transition-colors shadow-xs"
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
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No DPDP user consent audit logs found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">User & ID</th>
            <th className="px-4 py-3">Consent Specification</th>
            <th className="px-4 py-3">Purpose & Lawful Scope</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">IP & Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-900">{row.userName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.userId}</div>
              </td>
              <td className="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                {row.consentVersion}
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-700 text-[11px]">
                {row.purpose}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3.5 font-mono text-slate-600 text-[11px]">
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
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-xs">
        No administrative audit logs recorded for System Configuration.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100/90 bg-white/90 shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="px-4 py-3">Timestamp & IP</th>
            <th className="px-4 py-3">Action & Collection</th>
            <th className="px-4 py-3">Target Entity</th>
            <th className="px-4 py-3">State Transition</th>
            <th className="px-4 py-3">Administrative Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 text-slate-700">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="px-4 py-3.5 font-mono text-[11px]">
                <div className="text-slate-900 font-bold">{formatDate(row.timestamp)}</div>
                <div className="text-slate-500">
                  {row.ipAddress} · {row.adminName}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {row.actionType}
                </span>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{row.collection}</div>
              </td>
              <td className="px-4 py-3.5">
                <div className="font-bold text-slate-900">{row.entityName}</div>
                <div className="text-[11px] font-mono text-slate-500">{row.entityId}</div>
              </td>
              <td className="px-4 py-3.5 text-[11px] font-mono">
                {row.previousState && <div className="text-slate-500">Prev: {row.previousState}</div>}
                <div className="text-emerald-700 font-bold">New: {row.newState}</div>
              </td>
              <td className="px-4 py-3.5 text-slate-700 max-w-xs">{row.reason}</td>
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
    <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-600">
      <div>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} records
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs disabled:opacity-40 hover:bg-slate-50 text-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono font-bold text-slate-800">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs disabled:opacity-40 hover:bg-slate-50 text-slate-700"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
