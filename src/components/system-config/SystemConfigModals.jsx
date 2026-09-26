import React, { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  Lock,
  Send,
  Sliders,
  AlertOctagon,
  Ban,
  CheckCircle2,
  Bell,
  Smartphone,
  RotateCcw,
  Sparkles,
  Layers,
  UserCheck
} from 'lucide-react'

// 1. REASON CONFIRMATION MODAL
export function AuditReasonModal({
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
      setError('Administrative justification is required for the immutable audit log.')
      return
    }
    onConfirm(reason)
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Audit Reason & Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter policy rationale or incident details..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
              confirmVariant === 'rose'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// 2. DUAL SIGN-OFF MODAL
export function DualSignOffModal({
  isOpen,
  title,
  impactDetails,
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
      setError('Co-admin authorizer email, passcode, and audit justification are mandatory.')
      return
    }
    onConfirm({ secondAdminEmail, reason })
    setSecondAdminEmail('')
    setPasscode('')
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className="text-[11px] font-bold text-purple-700 font-mono">Institutional Dual Executive Authorization Required</span>
          </div>
        </div>

        <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3.5 text-xs space-y-1">
          <div className="font-bold text-slate-900">High-Impact Platform Mutation:</div>
          <p className="text-slate-600 text-[11px] leading-relaxed">{impactDetails}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorizing Co-Admin Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.security@agrovercity.in"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cryptographic Token / Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Authorization Rationale *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Institutional justification..."
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-xs"
          >
            Authorize & Execute
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. SEND TARGETED FCM BROADCAST MODAL
export function SendBroadcastModal({
  isOpen,
  onClose,
  onSend
}) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    urgency: 'normal',
    targetPersona: 'all',
    targetDistrict: 'all',
    targetState: 'Maharashtra'
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      setError('Broadcast notification title and message body are mandatory.')
      return
    }
    onSend(form)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Targeted FCM Push Broadcast</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notification Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. ⚠️ Severe Weather Warning / Rate Spike"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notification Message Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Actionable alert message delivered to user lockscreens..."
              rows={3}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="normal">Standard Broadcast</option>
                <option value="high">High Priority</option>
                <option value="critical_weather">Critical Weather (Disaster Alert)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Persona</label>
              <select
                value={form.targetPersona}
                onChange={(e) => setForm({ ...form, targetPersona: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Registered Users</option>
                <option value="farmers">Farmers (Mahila Kisan & Smallholders)</option>
                <option value="transporters">Transporters & Fleet Owners</option>
                <option value="buyers">Corporate B2B Buyers</option>
                <option value="women_shg">Women Self Help Groups</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target District</label>
              <select
                value={form.targetDistrict}
                onChange={(e) => setForm({ ...form, targetDistrict: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="all">All Districts (Statewide)</option>
                <option value="Nashik">Nashik</option>
                <option value="Solapur">Solapur</option>
                <option value="Pune">Pune</option>
                <option value="Ahmednagar">Ahmednagar</option>
                <option value="Jalgaon">Jalgaon</option>
                <option value="Sangli">Sangli</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target State</label>
              <input
                type="text"
                value={form.targetState}
                onChange={(e) => setForm({ ...form, targetState: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Push Notification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 4. UPDATE VERSION GATES MODAL
export function UpdateVersionGateModal({
  isOpen,
  currentConfig = {},
  onClose,
  onSave
}) {
  const safeConfig = currentConfig || {}
  const [form, setForm] = useState({
    latestVersion: safeConfig.latestVersion || '2.6.2',
    minSupportedVersion: safeConfig.minSupportedVersion || '2.4.0',
    forceUpdateEnabled: safeConfig.forceUpdateEnabled ?? true,
    maintenanceMode: safeConfig.maintenanceMode ?? false,
    maintenanceMessage: safeConfig.maintenanceMessage || 'Platform under scheduled maintenance.'
  })
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentConfig) {
      setForm({
        latestVersion: currentConfig.latestVersion || '2.6.2',
        minSupportedVersion: currentConfig.minSupportedVersion || '2.4.0',
        forceUpdateEnabled: currentConfig.forceUpdateEnabled ?? true,
        maintenanceMode: currentConfig.maintenanceMode ?? false,
        maintenanceMessage: currentConfig.maintenanceMessage || 'Platform under scheduled maintenance.'
      })
    }
    if (isOpen) {
      setError('')
      setReason('')
    }
  }, [currentConfig, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.minSupportedVersion || !reason.trim()) {
      setError('Minimum supported version and audit rationale are required.')
      return
    }
    onSave(form, reason)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-100/80 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span>Configure Mobile Version Gates</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Latest Release</label>
              <input
                type="text"
                value={form.latestVersion}
                onChange={(e) => setForm({ ...form, latestVersion: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Supported *</label>
              <input
                type="text"
                value={form.minSupportedVersion}
                onChange={(e) => setForm({ ...form, minSupportedVersion: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-slate-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.forceUpdateEnabled}
                onChange={(e) => setForm({ ...form, forceUpdateEnabled: e.target.checked })}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Enable Force Update Splash Screen</span>
            </label>

            <label className="flex items-center gap-2 text-slate-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-rose-700 font-bold">Activate Platform Maintenance Mode (Locks trading)</span>
            </label>
          </div>

          {form.maintenanceMode && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Maintenance Banner Message</label>
              <input
                type="text"
                value={form.maintenanceMessage}
                onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Rationale *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter justification for version gate changes..."
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs"
            >
              Save Remote Config
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. RESOLVE REPORT MODAL
export function ResolveReportModal({
  isOpen,
  report = null,
  onClose,
  onConfirm
}) {
  const [resolution, setResolution] = useState('resolved_warning')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !report) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Administrative justification is required.')
      return
    }
    onConfirm({ resolution, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span>Resolve Moderation Complaint</span>
        </div>

        <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3.5 text-xs space-y-1">
          <div className="text-slate-900 font-bold">{report.reportedUserName}</div>
          <div className="text-slate-500 font-mono">{report.reportedUserId} · {report.reportedUserPhone}</div>
          <div className="text-rose-700 font-mono font-bold uppercase text-[11px] pt-1">Violation: {report.category}</div>
          <p className="text-slate-700 text-[11px] pt-1">{report.evidenceDescription}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Moderation Action *</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="resolved_warning">Issue Strike 1 Warning</option>
              <option value="resolved_banned">Permanently Ban User & Blacklist Device</option>
              <option value="dismissed">Dismiss Report (Inconclusive / Spurious)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Administrative Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter policy rationale for warning, ban, or dismissal..."
              rows={3}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
              resolution === 'resolved_banned'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            Confirm Resolution
          </button>
        </div>
      </div>
    </div>
  )
}

// 6. RESOLVE EXPERT TICKET MODAL
export function ResolveExpertTicketModal({
  isOpen,
  ticket = null,
  onClose,
  onConfirm
}) {
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [prescribedTreatment, setPrescribedTreatment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setResolutionNotes('')
      setPrescribedTreatment('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen || !ticket) return null

  const handleConfirm = () => {
    if (!resolutionNotes.trim()) {
      setError('Agronomist clinical resolution notes are mandatory.')
      return
    }
    onConfirm({ resolutionNotes, prescribedTreatment })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Resolve Agronomist Consultation Ticket</span>
        </div>

        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="font-mono text-emerald-800 font-bold">{ticket.ticketNumber}</span>
            <span className="font-semibold text-slate-700">{ticket.crop}</span>
          </div>
          <div className="text-slate-900 font-bold">{ticket.farmerName} ({ticket.district})</div>
          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{ticket.description}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Agronomist Advisory & Clinical Diagnosis <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => {
                setResolutionNotes(e.target.value)
                if (error) setError('')
              }}
              rows={3}
              placeholder="Detail underlying plant pathology, weather causal factors, and immediate containment..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Prescribed Treatment & Spray Protocol
            </label>
            <input
              type="text"
              value={prescribedTreatment}
              onChange={(e) => setPrescribedTreatment(e.target.value)}
              placeholder="e.g. Copper Oxychloride 50% WP (2.5g/L) + Streptocycline (0.05g/L)"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            Submit Advisory & Close Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

// 7. ASSIGN AGRONOMIST MODAL
export function AssignAgronomistModal({
  isOpen,
  ticket = null,
  onClose,
  onConfirm
}) {
  const [agronomist, setAgronomist] = useState('Dr. Nilesh Gaikwad (Sr. Plant Pathologist)')
  const [reason, setReason] = useState('Assigned based on crop disease domain expertise')
  const [error, setError] = useState('')

  if (!isOpen || !ticket) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Assignment audit rationale is required.')
      return
    }
    onConfirm({ assignedAgronomist: agronomist, reason })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <span>Assign Specialized Agronomist</span>
        </div>

        <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
          <div className="font-bold text-slate-900">{ticket.ticketNumber}: {ticket.title}</div>
          <div className="text-slate-500 font-mono">Farmer: {ticket.farmerName} · {ticket.crop}</div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Domain Expert *</label>
            <select
              value={agronomist}
              onChange={(e) => setAgronomist(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Dr. Nilesh Gaikwad (Sr. Plant Pathologist)">Dr. Nilesh Gaikwad (Sr. Plant Pathologist)</option>
              <option value="Dr. Suhas Deshmukh (Viticulture Specialist)">Dr. Suhas Deshmukh (Viticulture Specialist)</option>
              <option value="Dr. Archana More (Entomologist & Vector Specialist)">Dr. Archana More (Entomologist & Vector Specialist)</option>
              <option value="Prof. Ramesh Patil (Soil Health & Nutrition)">Prof. Ramesh Patil (Soil Health & Nutrition)</option>
              <option value="Head of Agronomy & Crop Protection">Head of Agronomy & Crop Protection</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Administrative Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  )
}

// 8. BATCH ACTION MODAL
export function BatchActionModal({
  isOpen,
  title,
  label = 'Confirm Batch Action',
  count = 0,
  action = '',
  onClose,
  onConfirm
}) {
  const [reason, setReason] = useState('')
  const [coAdmin, setCoAdmin] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification is required for bulk system operations.')
      return
    }
    if (action === 'batch_ban' && !coAdmin.trim()) {
      setError('Co-authorizer email is mandatory for bulk account blacklisting.')
      return
    }
    onConfirm({ reason, coAdmin })
    setReason('')
    setCoAdmin('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Targeting {count} selected records
            </p>
          </div>
        </div>

        {action === 'batch_ban' && (
          <div className="space-y-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-900">Dual Executive Authorization</span>
              <span className="text-[10px] text-rose-700 font-mono font-bold">Mandatory</span>
            </div>
            <p className="text-rose-700 text-[11px] leading-relaxed">
              Blacklisting accounts freezes trading and locks Aadhaar identity credentials platform-wide.
            </p>
            <input
              type="email"
              placeholder="e.g. auditor.security@agrovercity.in"
              value={coAdmin}
              onChange={(e) => setCoAdmin(e.target.value)}
              className="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Administrative Audit Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Document incident rationale, legal grounds, or operational justification..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}

// 9. RESET BENCHMARK SEED MODAL
export function ResetSeedModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Audit justification is required prior to resetting module benchmark state.')
      return
    }
    onConfirm(reason)
    setReason('')
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-emerald-100/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Reset Module 26 Seed State</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">SOP-26 System Configuration Benchmark</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          This operation will restore all remote mobile version gates, feature flags, targeted broadcasts, moderation queues, banned accounts, and consultation tickets to their baseline states.
        </p>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Administrative Audit Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Document mandatory administrative reason for restoring benchmark seed state..."
            rows={3}
            className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {error && <p className="text-[11px] text-rose-600 font-semibold mt-1">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs"
          >
            Reset Seed Data
          </button>
        </div>
      </div>
    </div>
  )
}

