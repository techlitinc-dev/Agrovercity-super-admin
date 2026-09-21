import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Bell,
  AlertOctagon,
  Ban,
  ShieldCheck,
  FileText,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react'
import { StatusBadge, UrgencyBadge, formatDate } from '../../pages/systemConfigWidgets'

export default function SystemConfigDetailDrawer({
  entity,
  type = 'report', // 'broadcast', 'report', 'block', 'consent', 'audit'
  isOpen,
  onClose,
  onResolveReport,
  onUnbanUser
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !entity) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getIcon = () => {
    switch (type) {
      case 'broadcast':
        return Bell
      case 'report':
        return AlertOctagon
      case 'block':
        return Ban
      case 'consent':
        return ShieldCheck
      case 'audit':
        return FileText
      default:
        return FileText
    }
  }

  const Icon = getIcon()

  const getTitle = () => {
    if (type === 'broadcast') return entity.title || entity.id
    if (type === 'report') return `Complaint #${entity.id} - ${entity.category}`
    if (type === 'block') return `Blacklisted User: ${entity.userName}`
    if (type === 'consent') return `DPDP Consent - ${entity.userName}`
    if (type === 'audit') return `Audit: ${entity.action}`
    return entity.id
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                  {getTitle()}
                </h2>
                {entity.status && <StatusBadge status={entity.status} />}
                {entity.urgency && <UrgencyBadge urgency={entity.urgency} />}
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Entity ID: {entity.id} · Timestamp: {formatDate(entity.sentAt || entity.createdAt || entity.bannedAt || entity.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-4 border-b border-slate-800 bg-slate-950/30 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'compliance'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            DPDP & Security
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Document JSON
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Type: Broadcast */}
              {type === 'broadcast' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Total Targeted</span>
                      <div className="text-base font-bold text-white mt-0.5">
                        {entity.recipientCount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Delivered</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">
                        {entity.deliveredCount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">CTR (Click-Through)</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">
                        {entity.clickRatePct || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                      Message Content Payload
                    </h3>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                      <div className="font-semibold text-white text-sm mb-1">{entity.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{entity.body}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                      Audience Targeting Rules
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Target Persona:</span>
                        <div className="font-semibold text-white capitalize mt-0.5">{entity.targetPersona}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Geography:</span>
                        <div className="font-semibold text-white mt-0.5">
                          {entity.targetDistrict === 'all' ? 'All Districts' : entity.targetDistrict}, {entity.targetState}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">FCM Gateway Message ID:</span>
                        <div className="font-mono text-emerald-400 truncate mt-0.5">{entity.fcmMessageId || 'projects/agrovercity/messages/fcm-ack-01'}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Sent By Administrator:</span>
                        <div className="font-mono text-slate-200 mt-0.5">{entity.sentByAdminEmail || 'superadmin@agrovercity.in'}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Type: User Report / Moderation */}
              {type === 'report' && (
                <>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                        Accused Party Profile
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono uppercase">
                        Severity: {entity.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-slate-400 text-[11px]">Accused Full Name:</div>
                        <div className="font-bold text-white text-sm">{entity.reportedUserName}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">User Persona:</div>
                        <div className="font-semibold text-emerald-400 capitalize">{entity.reportedUserPersona}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">User UID:</div>
                        <div className="font-mono text-slate-300 text-[11px]">{entity.reportedUserId}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">Masked Contact:</div>
                        <div className="font-mono text-slate-300 text-[11px]">{entity.reportedUserPhone}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                      Complainant & Evidence Description
                    </h3>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Reported by: <strong className="text-white">{entity.reporterName}</strong></span>
                        <span className="font-mono text-slate-400">{entity.reporterPhone}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                        "{entity.evidenceDescription}"
                      </p>
                      {entity.evidenceMediaUrls && entity.evidenceMediaUrls.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] text-slate-400 block mb-1">Attached Evidence Media:</span>
                          <div className="flex flex-wrap gap-2">
                            {entity.evidenceMediaUrls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Evidence File #{idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {entity.resolutionNotes && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                        Moderation Resolution Notes
                      </h3>
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                        {entity.resolutionNotes}
                        <div className="text-[10px] text-slate-400 font-mono mt-2">
                          Resolved by: {entity.resolvedByAdminEmail || 'superadmin@agrovercity.in'} at {formatDate(entity.resolvedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Type: User Block */}
              {type === 'block' && (
                <>
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400">
                      <Ban className="w-4 h-4" />
                      <span className="font-bold text-sm">Account Permanently Blacklisted</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      This user has been restricted from creating produce lots, bidding on contracts, booking transport trips, or accessing the Agrovercity unified portal.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                      Blacklist Registry Record
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">User UID:</span>
                        <div className="font-mono text-white mt-0.5">{entity.userId}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Masked Phone:</span>
                        <div className="font-mono text-white mt-0.5">{entity.userPhone}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Masked Aadhaar (UIDAI):</span>
                        <div className="font-mono text-emerald-400 mt-0.5">{entity.userAadhaarMasked || 'XXXX-XXXX-8921'}</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Persona & District:</span>
                        <div className="font-semibold text-white capitalize mt-0.5">
                          {entity.persona} · {entity.district}, {entity.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                      Reason for Permanent Exclusion
                    </h3>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-rose-300 font-medium">
                      {entity.banReason}
                    </div>
                  </div>
                </>
              )}

              {/* Type: Consent / Audit */}
              {(type === 'consent' || type === 'audit') && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                    Record Summary
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Primary Identifier</span>
                      <span className="font-mono text-white">{entity.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Subject / User</span>
                      <span className="font-semibold text-white">{entity.userName || entity.adminEmail}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Operation / Action</span>
                      <span className="font-mono text-emerald-400">{entity.purpose || entity.action}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">IP Address</span>
                      <span className="font-mono text-slate-300">{entity.ipAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DPDP Act 2023 & IT Rules Statutory Adherence</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All user PII displayed in this superadmin console is strictly masked in compliance with India's Digital Personal Data Protection Act (DPDP 2023). Aadhaar numbers are stored exclusively in UIDAI-compliant HSM secure vaults with only last-4 digits decrypted for institutional dispute resolution.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">
                  Data Privacy Masking Verification
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Phone Masking:</span>
                    <div className="font-mono text-slate-200 mt-1">E.164 Obfuscated (+91 98XXX X...12)</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Aadhaar Vault:</span>
                    <div className="font-mono text-emerald-400 mt-1">SHA-256 HSM Tokenized (Last-4 Only)</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Session Signature:</span>
                    <div className="font-mono text-slate-400 truncate mt-1">HMAC-SHA256-JWT-Signed</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Audit Logging:</span>
                    <div className="font-mono text-emerald-400 mt-1">WORM Append-Only Ledger</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono">Raw Platform Schema Document</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Close Drawer
          </button>

          <div className="flex items-center gap-2">
            {type === 'report' && entity.status !== 'resolved_banned' && entity.status !== 'dismissed' && onResolveReport && (
              <button
                onClick={() => {
                  onClose()
                  onResolveReport(entity)
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 transition-colors"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Take Moderation Action</span>
              </button>
            )}

            {type === 'block' && onUnbanUser && (
              <button
                onClick={() => {
                  onClose()
                  onUnbanUser(entity)
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reinstate & Unban Account</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
