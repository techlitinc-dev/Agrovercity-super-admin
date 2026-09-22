import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Newspaper,
  Tv,
  GraduationCap,
  Microscope,
  Video,
  FileText,
  Volume2,
  Play,
  Pause,
  Key,
  Eye,
  EyeOff,
  Radio,
  Users,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Globe
} from 'lucide-react'
import { StatusBadge, fmtINR, fmtDuration, formatDate } from '../../pages/contentWidgets'

export default function ContentDetailDrawer({
  entity,
  type = 'news', // 'news', 'channels', 'workshops', 'talks', 'videos', 'blogs'
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onManageKeys,
  onModerateChat,
  onRoster,
  onTriage
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [showStreamKey, setShowStreamKey] = useState(false)

  if (!isOpen || !entity) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getEntityIcon = () => {
    switch (type) {
      case 'news':
        return Newspaper
      case 'channels':
        return Tv
      case 'workshops':
        return GraduationCap
      case 'talks':
        return Microscope
      case 'videos':
        return Video
      case 'blogs':
        return FileText
      default:
        return FileText
    }
  }

  const Icon = getEntityIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-start justify-between bg-emerald-50/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 mt-1 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-500">{entity.id}</span>
                <StatusBadge status={entity.status} />
                {entity.breaking && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-full text-[10px] font-bold uppercase">
                    <Flame className="w-3 h-3 text-rose-600" />
                    Breaking
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {entity.title || entity.channelName || entity.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {entity.category || entity.callsign || entity.instructorName || entity.scientistName || entity.authorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 border-b border-emerald-100/80 bg-emerald-50/20 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Media & Playback Preview
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Document JSON
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Common Metadata Card */}
              <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Entity Metadata & Provenance
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Collection</span>
                    <span className="font-mono text-emerald-700 font-medium">
                      {type === 'news' && 'agri_news'}
                      {type === 'channels' && 'agri_channels'}
                      {type === 'workshops' && 'workshops'}
                      {type === 'talks' && 'expert_talks'}
                      {type === 'videos' && 'video_guides'}
                      {type === 'blogs' && 'blog_articles'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Created At</span>
                    <span className="text-slate-800 font-mono text-[11px]">{formatDate(entity.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Last Updated</span>
                    <span className="text-slate-800 font-mono text-[11px]">{formatDate(entity.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Author / Operator UID</span>
                    <span className="font-mono text-slate-700 text-[11px]">{entity.userId || 'usr_admin_root'}</span>
                  </div>
                </div>
              </div>

              {/* Entity-Specific Detail Card */}
              {type === 'news' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    News Article Content & Vernacular Audio
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Headline</span>
                      <p className="text-slate-900 font-medium">{entity.headline}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Executive Summary</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        {entity.summary}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Full Article Body</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                        {entity.content}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Language</span>
                        <span className="font-mono text-slate-900 uppercase font-medium">{entity.language}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Read Count</span>
                        <span className="font-mono text-emerald-700 font-bold">{entity.readCount?.toLocaleString()} reads</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type === 'channels' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Channel Broadcast & Ingest Parameters
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Callsign</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.callsign}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Stream Resolution</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.resolution} @ {entity.bitrateKbps} kbps</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Active / Peak Viewers</span>
                      <span className="font-mono text-rose-700 font-bold">
                        {entity.activeViewers?.toLocaleString()} / {entity.peakViewersToday?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Chat Moderation</span>
                      <span className="text-slate-800 capitalize font-medium">
                        {entity.chatEnabled ? `Enabled (${entity.chatModerationLevel})` : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'workshops' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ICAR Workshop & Financial Logistics
                  </div>
                  <div className="text-xs space-y-2">
                    <p className="text-slate-700 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                      {entity.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-slate-500 text-[11px] block">ICAR Accreditation No.</span>
                        <span className="font-mono text-emerald-800 font-bold">{entity.icarAccreditationNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Fee per Seat</span>
                        <span className="font-mono text-slate-900 font-bold">{fmtINR(entity.feeINR)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Lead Scientist</span>
                        <span className="text-slate-900 font-medium">{entity.instructorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Gross Enrollment Revenue</span>
                        <span className="font-mono text-emerald-800 font-bold">{fmtINR(entity.enrolledCount * entity.feeINR)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type === 'talks' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Scientist Profile & Institution
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Scientist Name</span>
                      <span className="text-slate-900 font-semibold">{entity.scientistName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Institute / KVK</span>
                      <span className="text-slate-700">{entity.kvkOrInstitute}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Specialization</span>
                      <span className="text-slate-700">{entity.specialization}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Webinar Room ID</span>
                      <span className="font-mono text-slate-700">{entity.zoomWebinarId || 'Agrovercity Live Stream'}</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'videos' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Video Guide Description & Metadata
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    {entity.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Duration</span>
                      <span className="font-mono text-slate-900 font-medium">{fmtDuration(entity.durationSeconds)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Views / Likes</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.viewCount?.toLocaleString()} / {entity.likeCount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'blogs' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Article Overview & Author
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    {entity.excerpt}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Author</span>
                      <span className="text-slate-900 font-semibold">{entity.authorName} ({entity.authorRole})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Read Time</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.readTimeMinutes} minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              {type === 'news' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      Vernacular Audio Narration Player
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-bold">
                      {entity.language === 'mr' ? 'Marathi (मराठी)' : entity.language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
                    </span>
                  </div>

                  {/* Audio Player Card */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-slate-800 font-medium">{isPlayingAudio ? '0:42' : '0:00'}</span>
                        <span className="font-mono text-slate-500">{fmtDuration(entity.audioDurationSeconds)}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-emerald-600 transition-all ${isPlayingAudio ? 'w-1/3' : 'w-0'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    <span className="text-slate-500 block">Audio File URI:</span>
                    <a
                      href={entity.vernacularAudioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-700 hover:underline break-all font-medium"
                    >
                      {entity.vernacularAudioUrl || 'https://cdn.agrovercity.in/audio/news/sample.mp3'}
                    </a>
                  </div>
                </div>
              )}

              {type === 'channels' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-rose-600" />
                      Live Stream Ingest & HLS Playback Telemetry
                    </span>
                    <StatusBadge status={entity.status} />
                  </div>

                  {/* Simulated Video Player Screen */}
                  <div className="relative aspect-video bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-md">
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-mono">
                        {entity.resolution}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-rose-400 text-[10px] font-mono flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{entity.activeViewers?.toLocaleString()} watching</span>
                    </div>

                    <Tv className="w-12 h-12 text-slate-700" />
                    <span className="text-xs text-slate-400 mt-2 font-medium">{entity.channelName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">HLS Master Playlist Active</span>
                  </div>

                  {/* RTMP Credentials Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">RTMP Ingest URL</span>
                      <div className="font-mono text-slate-800 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                        {entity.rtmpIngestUrl}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Stream Key (Secret)</span>
                        <button
                          onClick={() => setShowStreamKey(!showStreamKey)}
                          className="text-slate-600 hover:text-slate-900 text-[11px] flex items-center gap-1 font-medium"
                        >
                          {showStreamKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showStreamKey ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] font-semibold">
                        {showStreamKey ? entity.streamKey : '••••••••••••••••••••••••••••••••'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {type === 'workshops' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      ICAR Digital Certificate & Meeting Link
                    </span>
                    <span className="text-xs font-mono text-emerald-800 font-bold">{entity.icarAccreditationNo}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>ICAR Certified Curriculum Standard</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Farmers completing 100% attendance and scoring above 70% in post-workshop evaluation automatically receive an ICAR accredited verifiable digital credential with QR verification.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                    <span className="text-slate-500 text-[11px] block">Live Meeting URL ({entity.meetingPlatform})</span>
                    <a
                      href={entity.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-700 hover:underline flex items-center gap-1 break-all font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>{entity.meetingUrl}</span>
                    </a>
                  </div>
                </div>
              )}

              {type === 'talks' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Microscope className="w-4 h-4 text-amber-600" />
                      Submitted Farmer Questions Queue ({entity.farmerQuestions?.length || 0})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(entity.farmerQuestions || []).map((q) => (
                      <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{q.farmerName} ({q.farmerLocation})</span>
                          <StatusBadge status={q.status} />
                        </div>
                        <p className="text-slate-700 text-[11px]">{q.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {type === 'videos' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Multilingual Subtitle & Translation Data
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(entity.translations || {}).map(([lang, data]) => (
                      <div key={lang} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">
                          {lang === 'mr' ? 'Marathi (मराठी)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}
                        </div>
                        <div className="font-semibold text-slate-900">{data.title}</div>
                        <div className="text-slate-600 text-[11px]">{data.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {type === 'blogs' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-4 space-y-4 shadow-xs">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Multilingual Excerpts
                  </span>
                  <div className="space-y-2">
                    {Object.entries(entity.translations || {}).map(([lang, data]) => (
                      <div key={lang} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">{lang}</div>
                        <div className="font-semibold text-slate-900">{data.title}</div>
                        <div className="text-slate-600 text-[11px]">{data.excerpt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Quick Action Bar */}
        <div className="p-4 border-t border-emerald-100/80 bg-emerald-50/40 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            DPDP Aadhaar Masking: <span className="text-emerald-700 font-mono font-bold">Enforced</span>
          </div>
          <div className="flex items-center gap-2">
            {type === 'channels' && (
              <>
                <button
                  onClick={() => onManageKeys && onManageKeys(entity)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Manage Keys
                </button>
                <button
                  onClick={() => onModerateChat && onModerateChat(entity)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Moderate Chat
                </button>
              </>
            )}

            {type === 'workshops' && (
              <button
                onClick={() => onRoster && onRoster(entity)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                View Roster ({entity.enrolledCount})
              </button>
            )}

            {type === 'talks' && (
              <button
                onClick={() => onTriage && onTriage(entity)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Triage Questions
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(entity)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Edit Item
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(entity)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
