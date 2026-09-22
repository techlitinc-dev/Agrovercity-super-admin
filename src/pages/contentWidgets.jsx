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
    published: { label: 'Published', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    scheduled: { label: 'Scheduled', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    draft: { label: 'Draft', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    archived: { label: 'Archived', bg: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
    under_review: { label: 'Under Review', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    unlisted: { label: 'Unlisted', bg: 'bg-purple-50 text-purple-700 border-purple-200' },

    // Channels
    live: { label: 'LIVE STREAM', bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
    offline: { label: 'Offline', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    maintenance: { label: 'Maintenance', bg: 'bg-amber-50 text-amber-700 border-amber-200' },

    // Workshops
    upcoming: { label: 'Upcoming', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    ongoing: { label: 'In Session', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse' },
    completed: { label: 'Concluded', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200' },

    // Roster & Payments
    captured: { label: 'Fee Paid', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    refunded: { label: 'Refunded', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 border-amber-200' },

    // Farmer Questions
    approved: { label: 'Approved', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_triage: { label: 'Pending Triage', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    answered: { label: 'Answered', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    rejected: { label: 'Rejected', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  const badge = map[status] || { label: status || 'Unknown', bg: 'bg-slate-100 text-slate-700 border-slate-200' }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
      {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
      {badge.label}
    </span>
  )
}

export function MetricCard({ title, value, subtitle, icon: Icon, badge, color = 'emerald' }) {
  const colorMap = {
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${c.bg} ${c.text} ${c.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
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
          <div key={i} className="h-28 bg-white/60 border border-emerald-100 rounded-2xl animate-pulse" />
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
    <div className="flex items-center gap-1 border-b border-emerald-100/80 px-6 bg-white/50 backdrop-blur-xs pb-2 overflow-x-auto scrollbar-none mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/40 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full border ${
                  isActive ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
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
    <div className="bg-emerald-50/40 border-b border-emerald-100/90 p-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left search & filters */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
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
            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
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
            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
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
          className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 shadow-xs transition"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          title="Export Table as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        {activeTab !== 'audit' && canCreate && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
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
      <div className="p-8 text-center text-slate-400 text-xs">
        No agricultural news articles found matching the selected filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Article ID &amp; Title</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Vernacular Narration</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-3">Author &amp; Source</th>
            <th className="py-3 px-3 text-right">Reads</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 max-w-sm font-sans">
                <div className="flex items-start gap-2">
                  {item.breaking && (
                    <span className="shrink-0 flex items-center gap-0.5 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <Flame className="w-3 h-3 text-rose-600" />
                      Breaking
                    </span>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(item)}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{item.headline}</div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">{item.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {item.category}
                </span>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {item.language === 'mr' ? 'Marathi' : item.language === 'hi' ? 'Hindi' : 'English'}
                  </span>
                  {item.vernacularAudioUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-600" title={`Narration: ${fmtDuration(item.audioDurationSeconds)}`}>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{fmtDuration(item.audioDurationSeconds)}</span>
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-3 text-center">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="text-slate-900 font-medium">{item.author}</div>
                <div className="text-[10px] text-slate-400">{item.source}</div>
              </td>
              <td className="py-3.5 px-3 text-right font-mono text-slate-800 font-bold">
                {item.readCount?.toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(item)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition"
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
  )
}

export function AgriChannelsTable({ data, onView, onManageKeys, onModerateChat, onToggleStatus }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No live TV channels found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Channel &amp; Callsign</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3 text-center">Broadcast Status</th>
            <th className="py-3 px-3">Live Telemetry</th>
            <th className="py-3 px-3">RTMP Stream Key</th>
            <th className="py-3 px-3 text-center">Live Chat</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((chan) => (
            <tr key={chan.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 font-sans">
                <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(chan)}>
                  {chan.channelName}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-slate-500">{chan.callsign}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold">{chan.language}</span>
                </div>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {chan.category}
                </span>
              </td>
              <td className="py-3.5 px-3 text-center">
                <StatusBadge status={chan.status} />
              </td>
              <td className="py-3.5 px-3">
                <div className="font-mono text-slate-900">
                  {chan.status === 'live' ? (
                    <span className="text-rose-700 font-bold">{chan.activeViewers?.toLocaleString()} viewers</span>
                  ) : (
                    <span className="text-slate-500">Peak {chan.peakViewersToday?.toLocaleString()}</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {chan.resolution} @ {chan.bitrateKbps} kbps
                </div>
              </td>
              <td className="py-3.5 px-3 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Key className="w-3 h-3 text-amber-600" />
                  <span>{chan.streamKey ? `${chan.streamKey.slice(0, 10)}••••••••` : 'None'}</span>
                </div>
              </td>
              <td className="py-3.5 px-3 text-center font-sans">
                <div className="flex items-center justify-center gap-1.5">
                  {chan.chatEnabled ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                      Active ({chan.chatModerationLevel})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px]">
                      Disabled
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(chan)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onManageKeys(chan)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold transition"
                  >
                    Stream Key
                  </button>
                  <button
                    onClick={() => onModerateChat(chan)}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold transition"
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
  )
}

export function WorkshopsTable({ data, onView, onRoster, onEdit, onCancel }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No ICAR workshops found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Workshop &amp; Accreditation</th>
            <th className="py-3 px-3">Lead Instructor</th>
            <th className="py-3 px-3">Fee &amp; Gross</th>
            <th className="py-3 px-3">Enrolled Seats</th>
            <th className="py-3 px-3">Schedule</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((ws) => {
            const fillPct = Math.min(100, Math.round((ws.enrolledCount / (ws.seatsCapacity || 1)) * 100))
            const grossRevenue = (ws.enrolledCount || 0) * (ws.feeINR || 0)

            return (
              <tr key={ws.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3.5 px-4 max-w-xs font-sans">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(ws)}>
                    {ws.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[10px] text-emerald-700 font-bold">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>{ws.icarAccreditationNo}</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">{ws.id}</div>
                </td>
                <td className="py-3.5 px-3 font-sans">
                  <div className="text-slate-900 font-medium">{ws.instructorName}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{ws.instructorTitle}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-mono text-emerald-700 font-bold">{fmtINR(ws.feeINR)}</div>
                  <div className="text-[10px] font-mono text-slate-500">Gross: {fmtINR(grossRevenue)}</div>
                </td>
                <td className="py-3.5 px-3 min-w-[140px]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-900 font-semibold">
                      {ws.enrolledCount} / {ws.seatsCapacity}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{fillPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPct >= 95 ? 'bg-rose-600' : fillPct >= 70 ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </td>
                <td className="py-3.5 px-3 font-sans">
                  <div className="text-slate-800">{formatDate(ws.scheduledAt)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{ws.durationMinutes} minutes</div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <StatusBadge status={ws.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(ws)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onRoster(ws)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold transition"
                    >
                      Roster ({ws.enrolledCount})
                    </button>
                    <button
                      onClick={() => onEdit(ws)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition active:scale-95"
                    >
                      Edit
                    </button>
                    {ws.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancel(ws)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition"
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
  )
}

export function ExpertTalksTable({ data, onView, onTriage, onEdit }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No Ask-the-Scientist sessions found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Expert Talk Topic</th>
            <th className="py-3 px-3">Lead Scientist &amp; Institute</th>
            <th className="py-3 px-3">Specialization</th>
            <th className="py-3 px-3">Scheduled Date</th>
            <th className="py-3 px-3">Question Queue</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((talk) => {
            const pendingCount = (talk.farmerQuestions || []).filter((q) => q.status === 'pending_triage').length

            return (
              <tr key={talk.id} className="hover:bg-emerald-50/60 transition-colors">
                <td className="py-3.5 px-4 max-w-xs font-sans">
                  <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(talk)}>
                    {talk.title}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">{talk.id}</div>
                </td>
                <td className="py-3.5 px-3 font-sans">
                  <div className="text-slate-900 font-medium">{talk.scientistName}</div>
                  <div className="text-[10px] text-slate-500">{talk.kvkOrInstitute}</div>
                </td>
                <td className="py-3.5 px-3 text-slate-700 font-sans">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                    {talk.specialization}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-800 font-sans">
                  <div>{formatDate(talk.dateScheduled)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{talk.durationMinutes} min session</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-mono text-slate-900 font-semibold">{talk.farmerQuestions?.length || 0} questions</span>
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                        {pendingCount} triage
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <StatusBadge status={talk.status} />
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(talk)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onTriage(talk)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold transition"
                    >
                      Triage ({talk.farmerQuestions?.length || 0})
                    </button>
                    <button
                      onClick={() => onEdit(talk)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition active:scale-95"
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
  )
}

export function VideoGuidesTable({ data, onView, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No video guides found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Video Title &amp; ID</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Duration</th>
            <th className="py-3 px-3">Bilingual Support</th>
            <th className="py-3 px-3 text-right">Views &amp; Likes</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((vid) => (
            <tr key={vid.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 max-w-sm font-sans">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(vid)}>
                      {vid.title}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">{vid.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {vid.category}
                </span>
              </td>
              <td className="py-3.5 px-3 font-mono text-slate-800 font-semibold">
                {fmtDuration(vid.durationSeconds)}
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="flex items-center gap-1">
                  {Object.keys(vid.translations || {}).map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono uppercase font-semibold">
                      {lang}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                <div className="font-bold">{vid.viewCount?.toLocaleString()} views</div>
                <div className="text-[10px] text-slate-500">{vid.likeCount?.toLocaleString()} likes</div>
              </td>
              <td className="py-3.5 px-3 text-center">
                <StatusBadge status={vid.status} />
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(vid)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(vid)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(vid)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition"
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
  )
}

export function BlogArticlesTable({ data, onView, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No blog articles found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Article Title &amp; Slug</th>
            <th className="py-3 px-3">Category</th>
            <th className="py-3 px-3">Author &amp; Role</th>
            <th className="py-3 px-3">Read Time</th>
            <th className="py-3 px-3 text-right">Views</th>
            <th className="py-3 px-3 text-center">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((blog) => (
            <tr key={blog.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 max-w-sm font-sans">
                <div className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onView(blog)}>
                  {blog.title}
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">{blog.slug}</div>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                  {blog.category}
                </span>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="text-slate-900 font-medium">{blog.authorName}</div>
                <div className="text-[10px] text-slate-500">{blog.authorRole}</div>
              </td>
              <td className="py-3.5 px-3 font-mono text-slate-800">
                {blog.readTimeMinutes} min read
              </td>
              <td className="py-3.5 px-3 text-right font-mono text-slate-800 font-bold">
                {blog.viewCount?.toLocaleString()}
              </td>
              <td className="py-3.5 px-3 text-center">
                <StatusBadge status={blog.status} />
              </td>
              <td className="py-3.5 px-4 text-right font-sans">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(blog)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold shadow-xs transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(blog)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold shadow-xs transition active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(blog)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition"
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
  )
}

export function ContentAuditLogsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No audit log records found for Knowledge Hub &amp; Content CMS.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
          <tr>
            <th className="py-3 px-4">Audit ID &amp; Timestamp</th>
            <th className="py-3 px-3">Admin Operator</th>
            <th className="py-3 px-3">Action Type</th>
            <th className="py-3 px-3">Target Entity</th>
            <th className="py-3 px-3">Transition</th>
            <th className="py-3 px-4">Reason &amp; Justification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80 font-mono">
          {data.map((log) => (
            <tr key={log.id} className="hover:bg-emerald-50/60 transition-colors">
              <td className="py-3.5 px-4 font-sans">
                <div className="font-mono text-slate-900 font-semibold">{formatDate(log.timestamp)}</div>
                <div className="font-mono text-[10px] text-slate-400">{log.id}</div>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="text-slate-900 font-medium">{log.adminName}</div>
                <div className="font-mono text-[10px] text-slate-400">{log.ipAddress}</div>
              </td>
              <td className="py-3.5 px-3">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  {log.actionType}
                </span>
              </td>
              <td className="py-3.5 px-3 font-sans">
                <div className="text-slate-900 font-bold">{log.entityName}</div>
                <div className="font-mono text-[10px] text-slate-400">{log.entityId} ({log.collection})</div>
              </td>
              <td className="py-3.5 px-3 font-mono text-[11px]">
                <div className="text-slate-400 line-through text-[10px]">{log.previousState}</div>
                <div className="text-emerald-700 font-bold">{log.newState}</div>
              </td>
              <td className="py-3.5 px-4 text-slate-700 max-w-xs text-[11px] leading-relaxed font-sans">
                {log.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ContentPagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-emerald-100/90 mt-4 px-6 bg-white/60 py-3">
      <div>
        Showing <span className="font-mono font-bold text-slate-900">{total === 0 ? 0 : start}</span> -{' '}
        <span className="font-mono font-bold text-slate-900">{end}</span> of{' '}
        <span className="font-mono font-bold text-slate-900">{total}</span> records
      </div>
      <div className="flex items-center gap-2 font-mono">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>
        <span className="font-mono text-slate-800 font-bold px-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
