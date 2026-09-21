import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Key,
  ShieldCheck,
  Trash2,
  Ban,
  Award,
  Download,
  Search,
  Users,
  Copy,
  Check,
  Flame,
  Volume2,
  ExternalLink,
  MessageSquare,
  Lock
} from 'lucide-react'
import { fmtINR, fmtDuration, formatDate } from '../../pages/contentWidgets'

// -------------------------------------------------------------
// 1. REASON CONFIRMATION MODAL (For Destructive Actions)
// -------------------------------------------------------------
export function AuditReasonConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  confirmVariant = 'rose',
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is mandatory for audit logging.')
      return
    }
    onConfirm(reason)
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-400">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Administrative Audit Reason <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="State policy rationale or incident reference (mandatory for audit trail)..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
          {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors ${
              confirmVariant === 'rose'
                ? 'bg-rose-600 hover:bg-rose-500'
                : confirmVariant === 'amber'
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 2. DUAL SIGN-OFF MODAL (For Financial Limits > ₹50,000)
// -------------------------------------------------------------
export function DualSignOffModal({
  isOpen,
  title,
  amount,
  details,
  onClose,
  onConfirm
}) {
  const [secondAdminEmail, setSecondAdminEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!secondAdminEmail.trim() || !passcode.trim() || !reason.trim()) {
      setError('Second admin authorization email, passcode, and audit justification are mandatory.')
      return
    }
    onConfirm({ secondAdminEmail, reason })
    setSecondAdminEmail('')
    setPasscode('')
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-purple-400">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <span className="text-[11px] font-mono text-purple-400">Institutional Dual Admin Sign-Off Required</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between font-medium text-slate-200">
            <span>Transaction Threshold Exceeded:</span>
            <span className="font-mono text-purple-300 font-bold">{fmtINR(amount)}</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Per AGROVERCITY Superadmin SOP Section 6, financial disbursements or refund liabilities exceeding ₹50,000 require concurrent dual-admin authorization.
          </p>
          {details && <p className="text-slate-300 font-medium text-[11px] pt-1">{details}</p>}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Authorizing Co-Admin Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.compliance@agrovercity.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Co-Admin Security Token / Passcode <span className="text-rose-400">*</span>
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Authorization Justification <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State institutional reason for refund or override..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-sm transition-colors"
          >
            Authorize Dual Sign-Off
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 3. CREATE / EDIT AGRI NEWS MODAL
// -------------------------------------------------------------
export function CreateEditNewsModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    headline: initialData?.headline || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    category: initialData?.category || 'Crop Advisory',
    language: initialData?.language || 'mr',
    breaking: initialData?.breaking || false,
    vernacularAudioUrl: initialData?.vernacularAudioUrl || '',
    audioDurationSeconds: initialData?.audioDurationSeconds || 120,
    author: initialData?.author || 'Kisan Varta Desk',
    source: initialData?.source || 'Agrovercity Agronomy Desk',
    status: initialData?.status || 'published',
    scheduledAt: initialData?.scheduledAt || ''
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.headline.trim() || !formData.summary.trim()) {
      setError('Article title, headline, and executive summary are required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit Agricultural News Article' : 'Publish Agricultural News Article'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">{error}</div>}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Article Headline / Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Maharashtra Declares ₹12,000/Ha Subsidy for Micro-Irrigation"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Sub-Headline *</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. State Agriculture Dept issues GR for drip automation & solar pumps"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500/60"
              >
                <option value="Govt Schemes">Govt Schemes</option>
                <option value="Weather Alerts">Weather Alerts</option>
                <option value="Mandi Trends">Mandi Trends</option>
                <option value="Crop Advisory">Crop Advisory</option>
                <option value="Technology">Technology</option>
                <option value="Pest Outbreak">Pest Outbreak</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500/60"
              >
                <option value="mr">Marathi (मराठी)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-emerald-500/60"
              >
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="breakingToggle"
              checked={formData.breaking}
              onChange={(e) => setFormData({ ...formData, breaking: e.target.checked })}
              className="w-4 h-4 rounded text-rose-500 bg-slate-900 border-slate-700"
            />
            <label htmlFor="breakingToggle" className="cursor-pointer text-slate-200 font-medium flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Flag as Breaking News (Triggers High-Priority Mobile Broadcast Push)</span>
            </label>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Vernacular Audio Narration URL (MP3/AAC)
            </label>
            <input
              type="url"
              value={formData.vernacularAudioUrl}
              onChange={(e) => setFormData({ ...formData, vernacularAudioUrl: e.target.value })}
              placeholder="https://cdn.agrovercity.in/audio/news/narration.mp3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Executive Summary *</label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Concise 2-sentence summary for ticker feeds and push notifications..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Full Article Body</label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full agricultural guidance, dosage, procedure, or GR details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
            >
              {initialData ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 4. MANAGE LIVE CHANNELS & STREAM KEYS MODAL
// -------------------------------------------------------------
export function ManageChannelModal({
  isOpen,
  channel,
  onClose,
  onSave,
  onRegenerateKey
}) {
  const [formData, setFormData] = useState({
    channelName: channel?.channelName || '',
    callsign: channel?.callsign || '',
    category: channel?.category || 'Krishi Darshan',
    rtmpIngestUrl: channel?.rtmpIngestUrl || 'rtmp://ingest.live.agrovercity.in/live-stream',
    hlsPlaybackUrl: channel?.hlsPlaybackUrl || '',
    status: channel?.status || 'live',
    resolution: channel?.resolution || '1080p60',
    bitrateKbps: channel?.bitrateKbps || 4500,
    chatEnabled: channel?.chatEnabled ?? true,
    chatModerationLevel: channel?.chatModerationLevel || 'strict'
  })
  const [copiedKey, setCopiedKey] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  if (!isOpen || !channel) return null

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Channel Stream Key & Ingest</h3>
              <span className="text-[11px] font-mono text-slate-400">{channel.callsign} ({channel.id})</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* RTMP Credentials Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">RTMP Ingest Server Endpoint</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={channel.rtmpIngestUrl}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={() => handleCopy(channel.rtmpIngestUrl)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400">Secret Stream Key</label>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                {showSecret ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={channel.streamKey || 'None'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-amber-400 text-xs"
              />
              <button
                type="button"
                onClick={() => handleCopy(channel.streamKey)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Rotate key if transmitter credentials were leaked</span>
            <button
              type="button"
              onClick={() => onRegenerateKey(channel)}
              className="px-3 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/30 rounded-lg text-xs transition-colors"
            >
              Regenerate Stream Key
            </button>
          </div>
        </div>

        {/* Configuration settings */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Broadcast Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="live">Live Streaming</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Chat Moderation Level</label>
              <select
                value={formData.chatModerationLevel}
                onChange={(e) => setFormData({ ...formData, chatModerationLevel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="strict">Strict (AI Anti-Spam + Profanity Filter)</option>
                <option value="standard">Standard (Keyword Filtering)</option>
                <option value="relaxed">Relaxed (Public Open)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="chatToggle"
              checked={formData.chatEnabled}
              onChange={(e) => setFormData({ ...formData, chatEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
            />
            <label htmlFor="chatToggle" className="cursor-pointer text-slate-300 font-medium">
              Enable Real-Time Live Chat Feed for Viewers
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            Save Channel Settings
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 5. LIVE CHANNEL CHAT MODERATION MODAL
// -------------------------------------------------------------
export function ChannelChatModerationModal({
  isOpen,
  channel,
  onClose,
  onDeleteMessage,
  onBanUser
}) {
  const [filter, setFilter] = useState('all') // 'all', 'flagged'

  if (!isOpen || !channel) return null

  const messages = channel.chatMessages || []
  const filtered = messages.filter((m) => {
    if (filter === 'flagged') return m.moderationStatus === 'flagged'
    return true
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live Stream Chat Moderation</h3>
              <span className="text-[11px] font-mono text-slate-400">{channel.channelName}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-white border-slate-700 font-medium'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              All Messages ({messages.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                filter === 'flagged'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 font-medium'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Flagged Anomaly ({messages.filter((m) => m.moderationStatus === 'flagged').length})
            </button>
          </div>
          <span className="text-slate-500 text-[11px]">DPDP Act: Phone Masking Active</span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No chat messages in this view.
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                  msg.moderationStatus === 'deleted'
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-50'
                    : msg.moderationStatus === 'flagged'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{msg.userName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{msg.userPhone}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-[10px] text-slate-500">{formatDate(msg.timestamp)}</span>
                    {msg.moderationStatus === 'flagged' && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        Spam Flag
                      </span>
                    )}
                    {msg.moderationStatus === 'deleted' && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                        Removed
                      </span>
                    )}
                  </div>
                  <p className={`text-slate-300 leading-relaxed ${msg.moderationStatus === 'deleted' ? 'line-through text-slate-500' : ''}`}>
                    {msg.message}
                  </p>
                </div>

                {msg.moderationStatus !== 'deleted' && (
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      onClick={() => onDeleteMessage(channel.id, msg.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onBanUser(channel.id, msg.userId, msg.userName)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-lg text-xs flex items-center gap-1"
                      title="Ban user from live chat"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Ban</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 6. CREATE / EDIT ICAR WORKSHOP MODAL
// -------------------------------------------------------------
export function CreateEditWorkshopModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructorName: initialData?.instructorName || '',
    instructorTitle: initialData?.instructorTitle || '',
    icarAccreditationNo: initialData?.icarAccreditationNo || 'ICAR-TRG-2026-MH-',
    seatsCapacity: initialData?.seatsCapacity || 100,
    feeINR: initialData?.feeINR || 999,
    scheduledAt: initialData?.scheduledAt || '2026-10-01T10:00:00Z',
    durationMinutes: initialData?.durationMinutes || 180,
    meetingPlatform: initialData?.meetingPlatform || 'Agrovercity Live Stream & Zoom',
    meetingUrl: initialData?.meetingUrl || 'https://live.agrovercity.in/workshops/room',
    certificateEligible: initialData?.certificateEligible ?? true
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.instructorName.trim() || !formData.icarAccreditationNo.trim()) {
      setError('Title, instructor name, and ICAR accreditation number are required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              {initialData ? 'Edit ICAR Certified Workshop' : 'Create Paid ICAR Certified Workshop'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">{error}</div>}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Workshop Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Automated Drip Fertigation & IoT Soil Sensor Integration"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Lead Instructor Name *</label>
              <input
                type="text"
                value={formData.instructorName}
                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                placeholder="e.g. Dr. Rameshwar V. Tambe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Instructor Title / Department</label>
              <input
                type="text"
                value={formData.instructorTitle}
                onChange={(e) => setFormData({ ...formData, instructorTitle: e.target.value })}
                placeholder="e.g. Principal Scientist, MPKV Rahuri"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">ICAR Accreditation No. *</label>
              <input
                type="text"
                value={formData.icarAccreditationNo}
                onChange={(e) => setFormData({ ...formData, icarAccreditationNo: e.target.value })}
                placeholder="ICAR-TRG-2026-MH-4412"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Fee (INR) *</label>
              <input
                type="number"
                value={formData.feeINR}
                onChange={(e) => setFormData({ ...formData, feeINR: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Seat Capacity *</label>
              <input
                type="number"
                value={formData.seatsCapacity}
                onChange={(e) => setFormData({ ...formData, seatsCapacity: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, scheduledAt: new Date(e.target.value).toISOString() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Meeting Platform URL</label>
            <input
              type="url"
              value={formData.meetingUrl}
              onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
              placeholder="https://live.agrovercity.in/workshops/room"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Syllabus & Course Curriculum</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed overview of technical topics, field demonstration, and practical modules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Workshop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 7. WORKSHOP ROSTER MODAL (/v1/admin/workshops/{id}/roster)
// -------------------------------------------------------------
export function WorkshopRosterModal({
  isOpen,
  workshop,
  roster = [],
  onClose,
  onIssueCertificate,
  onRefund
}) {
  const [search, setSearch] = useState('')

  if (!isOpen || !workshop) return null

  const filtered = roster.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return [r.farmerName, r.farmerPhone, r.district, r.certificateId]
      .some((v) => String(v || '').toLowerCase().includes(q))
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Workshop Enrolled Farmers Roster</h3>
              <span className="text-[11px] font-mono text-emerald-400">
                {workshop.title} ({workshop.icarAccreditationNo})
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmer name, phone, district..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200"
            />
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>Enrolled: {workshop.enrolledCount} / {workshop.seatsCapacity}</span>
            <span>•</span>
            <span>Gross: {fmtINR(workshop.enrolledCount * workshop.feeINR)}</span>
            <span>•</span>
            <span className="text-emerald-400">DPDP Aadhaar Masked</span>
          </div>
        </div>

        {/* Roster Table */}
        <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Farmer Name & ID</th>
                <th className="py-2.5 px-3">Contact (DPDP Masked)</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Fee Status</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">ICAR Certificate</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No enrolled farmers found in this workshop roster.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium text-slate-200">
                      <div>{item.farmerName}</div>
                      <div className="font-mono text-[10px] text-slate-500">{item.farmerId}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                      <div>{item.farmerPhone}</div>
                      <div className="text-[10px] text-slate-500">Aadhaar: {item.aadhaarMasked}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{item.district}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        item.paymentStatus === 'captured'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.paymentStatus === 'captured' ? `Paid ${fmtINR(item.amountPaidINR)}` : 'Refunded'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.attended ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                      }`}>
                        {item.attended ? 'Attended' : 'Registered'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.certificateIssued ? (
                        <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{item.certificateId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Pending Evaluation</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!item.certificateIssued && item.paymentStatus === 'captured' && (
                          <button
                            onClick={() => onIssueCertificate(workshop.id, item.farmerId)}
                            className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded text-[10px] transition-colors"
                          >
                            Issue Cert
                          </button>
                        )}
                        {item.paymentStatus === 'captured' && (
                          <button
                            onClick={() => onRefund(workshop.id, item)}
                            className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/20 rounded text-[10px] transition-colors"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500">FastAPI Endpoint: <span className="font-mono text-emerald-400">GET /v1/admin/workshops/{workshop.id}/roster</span></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 8. SCHEDULE EXPERT TALK MODAL
// -------------------------------------------------------------
export function ScheduleExpertTalkModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    scientistName: initialData?.scientistName || '',
    scientistDesignation: initialData?.scientistDesignation || '',
    kvkOrInstitute: initialData?.kvkOrInstitute || 'MPKV Rahuri Agricultural University',
    specialization: initialData?.specialization || 'Plant Protection & Entomology',
    dateScheduled: initialData?.dateScheduled || '2026-10-05T15:00:00Z',
    durationMinutes: initialData?.durationMinutes || 90,
    zoomWebinarId: initialData?.zoomWebinarId || '882-9910-4412'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.scientistName.trim()) {
      setError('Topic title and scientist name are required.')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            {initialData ? 'Edit Expert Scientist Talk' : 'Schedule Ask-the-Scientist Talk'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">{error}</div>}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Talk Topic / Headline *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Pest Resistance Management in Bt Cotton & Pink Bollworm Tactics"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Lead Scientist Name *</label>
              <input
                type="text"
                value={formData.scientistName}
                onChange={(e) => setFormData({ ...formData, scientistName: e.target.value })}
                placeholder="e.g. Dr. Hemantrao B. Borase"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g. Plant Pathology, Soil Science"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">KVK / ICAR / University Institute</label>
            <input
              type="text"
              value={formData.kvkOrInstitute}
              onChange={(e) => setFormData({ ...formData, kvkOrInstitute: e.target.value })}
              placeholder="e.g. MPKV Rahuri / ICAR-IARI"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.dateScheduled.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, dateScheduled: new Date(e.target.value).toISOString() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {initialData ? 'Save Changes' : 'Schedule Talk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 9. TRIAGE FARMER QUESTIONS MODAL
// -------------------------------------------------------------
export function TriageQuestionsModal({
  isOpen,
  talk,
  onClose,
  onTriageQuestion
}) {
  if (!isOpen || !talk) return null

  const questions = talk.farmerQuestions || []

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Triage Farmer Questions Queue</h3>
            <span className="text-[11px] font-mono text-amber-400">{talk.title}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {questions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No questions submitted by farmers yet for this session.
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  q.status === 'approved'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : q.status === 'rejected'
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{q.farmerName}</span>
                    <span className="text-slate-500 font-mono text-[10px]">({q.farmerLocation})</span>
                    {q.priority === 'high' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        High Priority
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    q.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : q.status === 'answered'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : q.status === 'rejected'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/80 p-2.5 rounded border border-slate-800/60">
                  {q.question}
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {q.status !== 'approved' && (
                    <button
                      onClick={() => onTriageQuestion(talk.id, q.id, 'approved', 'high', 'Approved for live scientist broadcast')}
                      className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] transition-colors"
                    >
                      Approve for Live
                    </button>
                  )}
                  {q.status !== 'answered' && (
                    <button
                      onClick={() => onTriageQuestion(talk.id, q.id, 'answered', 'normal', 'Answered on webinar')}
                      className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] transition-colors"
                    >
                      Mark Answered
                    </button>
                  )}
                  {q.status !== 'rejected' && (
                    <button
                      onClick={() => onTriageQuestion(talk.id, q.id, 'rejected', 'normal', 'Irrelevant or duplicate inquiry')}
                      className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/20 rounded-lg text-[11px] transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close Triage
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 10. CREATE / EDIT VIDEO GUIDE & BLOG MODALS
// -------------------------------------------------------------
export function CreateEditVideoGuideModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Crop Protection',
    videoUrl: initialData?.videoUrl || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    durationSeconds: initialData?.durationSeconds || 600,
    status: initialData?.status || 'published',
    tags: (initialData?.tags || []).join(', '),
    featured: initialData?.featured || false
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.videoUrl.trim()) {
      setError('Title and Video URL are required.')
      return
    }
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      translations: {
        en: { title: formData.title, description: formData.description },
        mr: { title: formData.title, description: formData.description },
        hi: { title: formData.title, description: formData.description }
      }
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            {initialData ? 'Edit Video Guide' : 'Publish Agronomy Video Guide'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">{error}</div>}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Video Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Precision Micro-Sprinkler Installation for Garlic & Onion"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="Crop Protection">Crop Protection</option>
                <option value="Soil Health">Soil Health</option>
                <option value="Organic Farming">Organic Farming</option>
                <option value="Irrigation & Fertigation">Irrigation & Fertigation</option>
                <option value="Farm Mechanization">Farm Mechanization</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Duration (Seconds)</label>
              <input
                type="number"
                value={formData.durationSeconds}
                onChange={(e) => setFormData({ ...formData, durationSeconds: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Video Streaming URL (MP4 / HLS) *</label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://cdn.agrovercity.in/videos/tutorials/guide.mp4"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Micro Irrigation, Onion, Water Saving"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {initialData ? 'Save Changes' : 'Publish Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CreateEditBlogModal({
  isOpen,
  initialData = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    contentMarkdown: initialData?.contentMarkdown || '',
    category: initialData?.category || 'Success Stories',
    authorName: initialData?.authorName || 'Dr. Gurpreet Singh Sandhu',
    authorRole: initialData?.authorRole || 'Senior Agronomist',
    readTimeMinutes: initialData?.readTimeMinutes || 6,
    status: initialData?.status || 'published'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      setError('Title and excerpt are required.')
      return
    }
    const autoSlug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    onSave({
      ...formData,
      slug: autoSlug,
      translations: {
        en: { title: formData.title, excerpt: formData.excerpt },
        mr: { title: formData.title, excerpt: formData.excerpt },
        hi: { title: formData.title, excerpt: formData.excerpt }
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            {initialData ? 'Edit Knowledge Blog Article' : 'Publish Knowledge Blog Article'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <div className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">{error}</div>}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Article Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="Success Stories">Success Stories</option>
                <option value="Policy & Subsidies">Policy & Subsidies</option>
                <option value="Organic Techniques">Organic Techniques</option>
                <option value="Market Insights">Market Insights</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Author Name</label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Read Time (Mins)</label>
              <input
                type="number"
                value={formData.readTimeMinutes}
                onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Executive Excerpt *</label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Article Content (Markdown)</label>
            <textarea
              rows={4}
              value={formData.contentMarkdown}
              onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              {initialData ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
