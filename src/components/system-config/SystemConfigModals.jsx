import React, { useState } from 'react'
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
  Smartphone
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
            Audit Reason & Justification <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError('')
            }}
            placeholder="Enter policy rationale or incident details..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
          />
          {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
              confirmVariant === 'rose' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-purple-400">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <span className="text-[11px] font-mono text-purple-400">Institutional Dual Executive Authorization Required</span>
          </div>
        </div>

        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs space-y-1">
          <div className="font-medium text-slate-200">High-Impact Platform Mutation:</div>
          <p className="text-slate-300 text-[11px]">{impactDetails}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Authorizing Co-Admin Email *</label>
            <input
              type="email"
              value={secondAdminEmail}
              onChange={(e) => setSecondAdminEmail(e.target.value)}
              placeholder="e.g. director.security@agrovercity.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Cryptographic Token / Passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Audit Authorization Rationale *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Institutional justification..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500/60"
            />
          </div>
          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-sm"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span>Targeted FCM Push Broadcast</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Notification Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. ⚠️ Severe Weather Warning / Rate Spike"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Notification Message Body *</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Actionable alert message delivered to user lockscreens..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Urgency Level</label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="normal">Standard Broadcast</option>
                <option value="high">High Priority</option>
                <option value="critical_weather">Critical Weather (Disaster Alert)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Target Persona</label>
              <select
                value={form.targetPersona}
                onChange={(e) => setForm({ ...form, targetPersona: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
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
              <label className="block font-medium text-slate-300 mb-1">Target District</label>
              <select
                value={form.targetDistrict}
                onChange={(e) => setForm({ ...form, targetDistrict: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
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
              <label className="block font-medium text-slate-300 mb-1">Target State</label>
              <input
                type="text"
                value={form.targetState}
                onChange={(e) => setForm({ ...form, targetState: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-sm"
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
  const [form, setForm] = useState({
    latestVersion: currentConfig.latestVersion || '2.6.2',
    minSupportedVersion: currentConfig.minSupportedVersion || '2.4.0',
    forceUpdateEnabled: currentConfig.forceUpdateEnabled ?? true,
    maintenanceMode: currentConfig.maintenanceMode ?? false,
    maintenanceMessage: currentConfig.maintenanceMessage || 'Platform under scheduled maintenance.'
  })
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>Configure Mobile Version Gates</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Latest Release</label>
              <input
                type="text"
                value={form.latestVersion}
                onChange={(e) => setForm({ ...form, latestVersion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Min Supported *</label>
              <input
                type="text"
                value={form.minSupportedVersion}
                onChange={(e) => setForm({ ...form, minSupportedVersion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.forceUpdateEnabled}
                onChange={(e) => setForm({ ...form, forceUpdateEnabled: e.target.checked })}
                className="rounded border-slate-800 text-emerald-500"
              />
              <span>Enable Force Update Splash Screen</span>
            </label>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="rounded border-slate-800 text-rose-500"
              />
              <span className="text-rose-400 font-medium">Activate Platform Maintenance Mode (Locks trading)</span>
            </label>
          </div>

          {form.maintenanceMode && (
            <div>
              <label className="block font-medium text-slate-300 mb-1">Maintenance Banner Message</label>
              <input
                type="text"
                value={form.maintenanceMessage}
                onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-300 mb-1">Audit Rationale *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter justification for version gate changes..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              required
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm"
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 text-white font-bold">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          <span>Resolve Moderation Complaint</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="text-white font-semibold">{report.reportedUserName}</div>
          <div className="text-slate-400 font-mono">{report.reportedUserId} · {report.reportedUserPhone}</div>
          <div className="text-rose-400 font-mono uppercase text-[11px] pt-1">Violation: {report.category}</div>
          <p className="text-slate-300 text-[11px] pt-1">{report.evidenceDescription}</p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Moderation Action *</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
            >
              <option value="resolved_warning">Issue Strike 1 Warning</option>
              <option value="resolved_banned">Permanently Ban User & Blacklist Device</option>
              <option value="dismissed">Dismiss Report (Inconclusive / Spurious)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Administrative Audit Justification *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter policy rationale for warning, ban, or dismissal..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          {error && <p className="text-[11px] text-rose-400">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
              resolution === 'resolved_banned'
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            Confirm Resolution
          </button>
        </div>
      </div>
    </div>
  )
}
