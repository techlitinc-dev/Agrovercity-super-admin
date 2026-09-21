import React, { useState } from 'react'
import {
  Newspaper,
  Tv,
  GraduationCap,
  Microscope,
  Video,
  FileText,
  ShieldCheck,
  Radio,
  Users,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Download,
  RefreshCw,
  Plus,
  Search,
  Volume2,
  Key,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Award,
  Play,
  Copy,
  Check,
  Flame,
  BadgeAlert
} from 'lucide-react'

export function fmtINR(val) {
  if (val === null || val === undefined || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}

export function fmtDuration(sec) {
  if (!sec) return '0:00'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
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

export function StatusBadge({ status, type = 'default' }) {
  const map = {
    // News & Articles & Videos
    published: { label: 'Published', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    scheduled: { label: 'Scheduled', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    draft: { label: 'Draft', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
    archived: { label: 'Archived', bg: 'bg-zinc-600/10 text-zinc-400 border-zinc-600/30' },
    under_review: { label: 'Under Review', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    unlisted: { label: 'Unlisted', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },

    // Channels
    live: { label: 'LIVE STREAM', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' },
    offline: { label: 'Offline', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
    maintenance: { label: 'Maintenance', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },

    // Workshops
    upcoming: { label: 'Upcoming', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    ongoing: { label: 'In Session', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse' },
    completed: { label: 'Concluded', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },

    // Roster & Payments
    captured: { label: 'Fee Paid', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    refunded: { label: 'Refunded', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    pending: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },

    // Farmer Questions
    approved: { label: 'Approved', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    pending_triage: { label: 'Pending Triage', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    answered: { label: 'Answered', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    rejected: { label: 'Rejected', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-800 text-slate-300 border-slate-700' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}>
      {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
      {badge.label}
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ContentMetricBar({ summary, loading }) {
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
        title="Knowledge CMS Repository"
        value={summary.totalActiveContent || 0}
        subtitle={`${summary.totalNewsArticles || 0} news • ${summary.videoGuidesPublished || 0} videos • ${summary.blogArticlesPublished || 0} blogs`}
        icon={Newspaper}
        badge="Vernacular Active"
        color="emerald"
      />
      <MetricCard
        title="Live TV Broadcasts"
        value={`${summary.liveChannelsCount || 0} Channels`}
        subtitle={`${(summary.totalLiveViewers || 0).toLocaleString()} Concurrent Viewers`}
        icon={Tv}
        badge="RTMP / HLS Active"
        color="rose"
      />
      <MetricCard
        title="ICAR Paid Workshops"
        value={fmtINR(summary.workshopRevenueINR || 0)}
        subtitle={`${summary.enrolledFarmersCount || 0} enrolled farmers across ${summary.activeWorkshops || 0} batches`}
        icon={GraduationCap}
        badge="ICAR Accredited"
        color="blue"
      />
      <MetricCard
        title="Triage & Moderation Queue"
        value={summary.farmerQuestionsPendingTriage || 0}
        subtitle={`${summary.flaggedChatMessages || 0} flagged chat msgs • ${summary.expertTalksScheduled || 0} live talks`}
        icon={AlertTriangle}
        badge="Action Required"
        color="amber"
      />
    </div>
  )
}

export function ContentTabSwitch({ activeTab, onSelectTab, counts = {} }) {
  const tabs = [
    { id: 'news', label: 'Agri News Feed', icon: Newspaper, count: counts.news, collection: 'agri_news' },
    { id: 'channels', label: 'Live TV Channels', icon: Tv, count: counts.channels, collection: 'agri_channels' },
    { id: 'workshops', label: 'ICAR Workshops', icon: GraduationCap, count: counts.workshops, collection: 'workshops' },
    { id: 'talks', label: 'Ask-the-Scientist', icon: Microscope, count: counts.talks, collection: 'expert_talks' },
    { id: 'videos', label: 'Video Guides', icon: Video, count: counts.videos, collection: 'video_guides' },
    { id: 'blogs', label: 'Knowledge Blogs', icon: FileText, count: counts.blogs, collection: 'blog_articles' },
    { id: 'audit', label: 'Audit Trails', icon: ShieldCheck, count: counts.audit, collection: 'audit_logs' }
  ]

  return (
    <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
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

export function ContentFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  language,
  onLanguageChange,
  activeTab,
  onRefresh,
  onExportCsv,
  onCreateNew,
  canCreate = true
}) {
  const getStatusOptions = () => {
    switch (activeTab) {
      case 'channels':
        return [
          { val: 'all', label: 'All Stream Statuses' },
          { val: 'live', label: 'Live Now' },
          { val: 'offline', label: 'Offline' },
          { val: 'maintenance', label: 'Maintenance' }
        ]
      case 'workshops':
        return [
          { val: 'all', label: 'All Workshops' },
          { val: 'upcoming', label: 'Upcoming' },
          { val: 'ongoing', label: 'Ongoing Session' },
          { val: 'completed', label: 'Concluded' },
          { val: 'cancelled', label: 'Cancelled' }
        ]
      case 'talks':
        return [
          { val: 'all', label: 'All Expert Talks' },
          { val: 'scheduled', label: 'Scheduled' },
          { val: 'live', label: 'Live' },
          { val: 'concluded', label: 'Concluded' }
        ]
      case 'videos':
        return [
          { val: 'all', label: 'All Video Statuses' },
          { val: 'published', label: 'Published' },
          { val: 'under_review', label: 'Under Review' },
          { val: 'unlisted', label: 'Unlisted' }
        ]
      case 'blogs':
        return [
          { val: 'all', label: 'All Blog Statuses' },
          { val: 'published', label: 'Published' },
          { val: 'draft', label: 'Draft' },
          { val: 'under_review', label: 'Under Review' }
        ]
      case 'audit':
        return [
          { val: 'all', label: 'All Audit Actions' },
          { val: 'BAN_CHAT_USER', label: 'Ban Chat User' },
          { val: 'REGENERATE_STREAM_KEY', label: 'Regenerate Stream Key' },
          { val: 'PUBLISH_BREAKING_NEWS', label: 'Publish Breaking News' },
          { val: 'ISSUE_ICAR_CERTIFICATES', label: 'Issue ICAR Certificates' },
          { val: 'TRIAGE_FARMER_QUESTION', label: 'Triage Farmer Question' }
        ]
      case 'news':
      default:
        return [
          { val: 'all', label: 'All Statuses' },
          { val: 'published', label: 'Published' },
          { val: 'scheduled', label: 'Scheduled' },
          { val: 'draft', label: 'Draft' },
          { val: 'archived', label: 'Archived' }
        ]
    }
  }

  const getCategoryOptions = () => {
    switch (activeTab) {
      case 'news':
        return ['all', 'Weather Alerts', 'Mandi Trends', 'Govt Schemes', 'Crop Advisory', 'Technology', 'Pest Outbreak']
      case 'channels':
        return ['all', 'Krishi Darshan', 'Live Mandi Auction', 'AgTech Demo', 'Expert Q&A']
      case 'videos':
        return ['all', 'Crop Protection', 'Soil Health', 'Organic Farming', 'Irrigation & Fertigation', 'Farm Mechanization']
      case 'blogs':
        return ['all', 'Success Stories', 'Policy & Subsidies', 'Organic Techniques', 'Market Insights']
      default:
        return []
    }
  }

  const catOptions = getCategoryOptions()

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* Left search & filters */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
        >
          {getStatusOptions().map((opt) => (
            <option key={opt.val} value={opt.val}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Category Dropdown (if applicable) */}
        {catOptions.length > 0 && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {catOptions.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Language Filter (for news/channels) */}
        {['news', 'channels'].includes(activeTab) && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Languages</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="en">English</option>
          </select>
        )}
      </div>

      {/* Right action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          title="Export Table as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>

        {activeTab !== 'audit' && canCreate && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {activeTab === 'news' && 'New Article'}
              {activeTab === 'channels' && 'Add Channel'}
              {activeTab === 'workshops' && 'Create Workshop'}
              {activeTab === 'talks' && 'Schedule Talk'}
              {activeTab === 'videos' && 'Publish Video'}
              {activeTab === 'blogs' && 'New Blog'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// TABLES FOR EACH ENTITY
// -------------------------------------------------------------

export function AgriNewsTable({ data, onView, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No agricultural news articles found matching the selected filters.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Article ID & Title</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Vernacular Narration</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Author & Source</th>
              <th className="py-3 px-3 text-right">Reads</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="flex items-start gap-2">
                    {item.breaking && (
                      <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Flame className="w-3 h-3 text-rose-400" />
                        Breaking
                      </span>
                    )}
                    <div>
                      <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(item)}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.headline}</div>
                      <div className="font-mono text-[10px] text-slate-500 mt-0.5">{item.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20">
                      {item.language === 'mr' ? 'Marathi' : item.language === 'hi' ? 'Hindi' : 'English'}
                    </span>
                    {item.vernacularAudioUrl && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400" title={`Narration: ${fmtDuration(item.audioDurationSeconds)}`}>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{fmtDuration(item.audioDurationSeconds)}</span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200">{item.author}</div>
                  <div className="text-[10px] text-slate-500">{item.source}</div>
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  {item.readCount?.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded text-[11px] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded text-[11px] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AgriChannelsTable({ data, onView, onManageKeys, onModerateChat, onToggleStatus }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No live TV channels found.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Channel & Callsign</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Broadcast Status</th>
              <th className="py-3 px-3">Live Telemetry</th>
              <th className="py-3 px-3">RTMP Stream Key</th>
              <th className="py-3 px-3">Live Chat</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((chan) => (
              <tr key={chan.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(chan)}>
                    {chan.channelName}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-slate-400">{chan.callsign}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500 uppercase">{chan.language}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                    {chan.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={chan.status} />
                </td>
                <td className="py-3 px-3">
                  <div className="font-mono text-slate-200">
                    {chan.status === 'live' ? (
                      <span className="text-rose-400 font-bold">{chan.activeViewers?.toLocaleString()} viewers</span>
                    ) : (
                      <span className="text-slate-500">Peak {chan.peakViewersToday?.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {chan.resolution} @ {chan.bitrateKbps} kbps
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>{chan.streamKey ? `${chan.streamKey.slice(0, 10)}••••••••` : 'None'}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    {chan.chatEnabled ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        Active ({chan.chatModerationLevel})
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                        Disabled
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(chan)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onManageKeys(chan)}
                      className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-400 border border-amber-500/30 rounded text-[11px] transition-colors"
                    >
                      Stream Key
                    </button>
                    <button
                      onClick={() => onModerateChat(chan)}
                      className="px-2 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-400 border border-blue-500/30 rounded text-[11px] transition-colors"
                    >
                      Chat ({chan.chatMessages?.length || 0})
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function WorkshopsTable({ data, onView, onRoster, onEdit, onCancel }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No ICAR workshops found.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Workshop & Accreditation</th>
              <th className="py-3 px-3">Lead Instructor</th>
              <th className="py-3 px-3">Fee & Gross</th>
              <th className="py-3 px-3">Enrolled Seats</th>
              <th className="py-3 px-3">Schedule</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((ws) => {
              const fillPct = Math.min(100, Math.round((ws.enrolledCount / (ws.seatsCapacity || 1)) * 100))
              const grossRevenue = (ws.enrolledCount || 0) * (ws.feeINR || 0)

              return (
                <tr key={ws.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(ws)}>
                      {ws.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-emerald-400">
                      <Award className="w-3 h-3 text-emerald-400" />
                      <span>{ws.icarAccreditationNo}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">{ws.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{ws.instructorName}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{ws.instructorTitle}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-emerald-400 font-semibold">{fmtINR(ws.feeINR)}</div>
                    <div className="text-[10px] font-mono text-slate-400">Gross: {fmtINR(grossRevenue)}</div>
                  </td>
                  <td className="py-3 px-3 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-300 font-medium">
                        {ws.enrolledCount} / {ws.seatsCapacity}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{fillPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPct >= 95 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-300">{formatDate(ws.scheduledAt)}</div>
                    <div className="text-[10px] text-slate-500">{ws.durationMinutes} minutes</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={ws.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(ws)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onRoster(ws)}
                        className="px-2 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-400 border border-blue-500/30 rounded text-[11px] transition-colors"
                      >
                        Roster ({ws.enrolledCount})
                      </button>
                      <button
                        onClick={() => onEdit(ws)}
                        className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded text-[11px] transition-colors"
                      >
                        Edit
                      </button>
                      {ws.status !== 'cancelled' && (
                        <button
                          onClick={() => onCancel(ws)}
                          className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ExpertTalksTable({ data, onView, onTriage, onEdit }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No Ask-the-Scientist sessions found.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Expert Talk Topic</th>
              <th className="py-3 px-3">Lead Scientist & Institute</th>
              <th className="py-3 px-3">Specialization</th>
              <th className="py-3 px-3">Scheduled Date</th>
              <th className="py-3 px-3">Question Queue</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((talk) => {
              const pendingCount = (talk.farmerQuestions || []).filter((q) => q.status === 'pending_triage').length

              return (
                <tr key={talk.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(talk)}>
                      {talk.title}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">{talk.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{talk.scientistName}</div>
                    <div className="text-[10px] text-slate-500">{talk.kvkOrInstitute}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                      {talk.specialization}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div>{formatDate(talk.dateScheduled)}</div>
                    <div className="text-[10px] text-slate-500">{talk.durationMinutes} min session</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-300">{talk.farmerQuestions?.length || 0} questions</span>
                      {pendingCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-medium">
                          {pendingCount} triage
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={talk.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(talk)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onTriage(talk)}
                        className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-400 border border-amber-500/30 rounded text-[11px] transition-colors"
                      >
                        Triage ({talk.farmerQuestions?.length || 0})
                      </button>
                      <button
                        onClick={() => onEdit(talk)}
                        className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded text-[11px] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function VideoGuidesTable({ data, onView, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No video guides found.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Video Title & ID</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Duration</th>
              <th className="py-3 px-3">Bilingual Support</th>
              <th className="py-3 px-3 text-right">Views & Likes</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((vid) => (
              <tr key={vid.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 text-emerald-400">
                      <Play className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(vid)}>
                        {vid.title}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">{vid.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                    {vid.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">
                  {fmtDuration(vid.durationSeconds)}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    {Object.keys(vid.translations || {}).map((lang) => (
                      <span key={lang} className="px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase">
                        {lang}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  <div>{vid.viewCount?.toLocaleString()} views</div>
                  <div className="text-[10px] text-slate-500">{vid.likeCount?.toLocaleString()} likes</div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={vid.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(vid)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(vid)}
                      className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded text-[11px] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vid)}
                      className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded text-[11px] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function BlogArticlesTable({ data, onView, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No blog articles found.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Article Title & Slug</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Author & Role</th>
              <th className="py-3 px-3">Read Time</th>
              <th className="py-3 px-3 text-right">Views</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((blog) => (
              <tr key={blog.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer" onClick={() => onView(blog)}>
                    {blog.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">{blog.slug}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                    {blog.category}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200 font-medium">{blog.authorName}</div>
                  <div className="text-[10px] text-slate-500">{blog.authorRole}</div>
                </td>
                <td className="py-3 px-3 font-mono text-slate-300">
                  {blog.readTimeMinutes} min read
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">
                  {blog.viewCount?.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={blog.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(blog)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(blog)}
                      className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded text-[11px] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(blog)}
                      className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 rounded text-[11px] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ContentAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
        No audit log records found for Knowledge Hub & Content CMS.
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Audit ID & Timestamp</th>
              <th className="py-3 px-3">Admin Operator</th>
              <th className="py-3 px-3">Action Type</th>
              <th className="py-3 px-3">Target Entity</th>
              <th className="py-3 px-3">Transition</th>
              <th className="py-3 px-4">Reason & Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-slate-200">{formatDate(log.timestamp)}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.id}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-200 font-medium">{log.adminName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.ipAddress}</div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {log.actionType}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-300 font-medium">{log.entityName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{log.entityId} ({log.collection})</div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="text-slate-400 line-through text-[10px]">{log.previousState}</div>
                  <div className="text-emerald-400 font-semibold">{log.newState}</div>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                  {log.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ContentPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 mt-4 px-1">
      <div>
        Showing <span className="font-mono text-slate-200">{total === 0 ? 0 : start}</span> -{' '}
        <span className="font-mono text-slate-200">{end}</span> of{' '}
        <span className="font-mono text-slate-200">{total}</span> records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>
        <span className="font-mono text-slate-300 px-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
