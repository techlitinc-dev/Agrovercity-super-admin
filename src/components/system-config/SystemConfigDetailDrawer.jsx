import React, { useState, useEffect } from 'react'
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
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react'
import { StatusBadge, UrgencyBadge, PriorityBadge, formatDate } from '../../pages/systemConfigWidgets'
import { getEntityAuditLogs } from '../../api/systemConfigApi'

export default function SystemConfigDetailDrawer({
  entity,
  type = 'report', // 'broadcast', 'report', 'block', 'consent', 'audit', 'expert_ticket'
  isOpen,
  onClose,
  onResolveReport,
  onUnbanUser,
  onResolveTicket,
  onAssignTicket,
  canMutate = true
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [entityAuditLogs, setEntityAuditLogs] = useState([])
  const [loadingAudit, setLoadingAudit] = useState(false)

  useEffect(() => {
    if (isOpen && entity?.id) {
      let isMounted = true
      setLoadingAudit(true)
      getEntityAuditLogs(entity.id || entity.ticketNumber || entity.userId)
        .then((logs) => {
          if (isMounted) setEntityAuditLogs(logs || [])
        })
        .catch(() => {
          if (isMounted) setEntityAuditLogs([])
        })
        .finally(() => {
          if (isMounted) setLoadingAudit(false)
        })
      return () => {
        isMounted = false
      }
    }
  }, [isOpen, entity])

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
      case 'expert_ticket':
        return Sparkles
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
    if (type === 'expert_ticket') return `Advisory Ticket #${entity.ticketNumber || entity.id} - ${entity.crop}`
    if (type === 'audit') return `Audit: ${entity.action || entity.actionType}`
    return entity.id
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">
                  {getTitle()}
                </h2>
                {entity.status && <StatusBadge status={entity.status} />}
                {entity.urgency && <UrgencyBadge urgency={entity.urgency} />}
                {entity.priority && <PriorityBadge priority={entity.priority} />}
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Entity ID: {entity.id || entity.ticketNumber} · Timestamp: {formatDate(entity.sentAt || entity.createdAt || entity.bannedAt || entity.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-4 border-b border-emerald-100/80 bg-slate-50/50 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'compliance'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            DPDP & Security
          </button>
          <button
            onClick={() => setActiveTab('audit_history')}
            className={`py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit_history'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Audit History</span>
            {entityAuditLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                {entityAuditLogs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Document JSON
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Type: Broadcast */}
              {type === 'broadcast' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Total Targeted</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        {entity.recipientCount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Delivered</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">
                        {entity.deliveredCount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">CTR (Click-Through)</span>
                      <div className="text-base font-bold text-blue-700 mt-0.5">
                        {entity.clickRatePct || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Message Content Payload
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="font-bold text-slate-900 text-sm mb-1">{entity.title}</div>
                      <p className="text-xs text-slate-700 leading-relaxed">{entity.body}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Audience Targeting Rules
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Target Persona:</span>
                        <div className="font-bold text-slate-900 capitalize mt-0.5">{entity.targetPersona}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Geography:</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {entity.targetDistrict === 'all' ? 'All Districts' : entity.targetDistrict}, {entity.targetState}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">FCM Gateway Message ID:</span>
                        <div className="font-mono text-emerald-700 font-bold truncate mt-0.5">{entity.fcmMessageId || 'projects/agrovercity/messages/fcm-ack-01'}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Sent By Administrator:</span>
                        <div className="font-mono text-slate-800 font-medium mt-0.5">{entity.sentByAdminEmail || 'superadmin@agrovercity.in'}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Type: User Report / Moderation */}
              {type === 'report' && (
                <>
                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Accused Party Profile
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono uppercase font-bold">
                        Severity: {entity.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/80">
                      <div>
                        <div className="text-slate-500 text-[11px]">Accused Full Name:</div>
                        <div className="font-bold text-slate-900 text-sm">{entity.reportedUserName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">User Persona:</div>
                        <div className="font-bold text-emerald-700 capitalize">{entity.reportedUserPersona}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">User UID:</div>
                        <div className="font-mono text-slate-800 text-[11px] font-medium">{entity.reportedUserId}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Masked Contact:</div>
                        <div className="font-mono text-slate-800 text-[11px] font-medium">{entity.reportedUserPhone}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Complainant & Evidence Description
                    </h3>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Reported by: <strong className="text-slate-900">{entity.reporterName}</strong></span>
                        <span className="font-mono text-slate-600">{entity.reporterPhone}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200">
                        "{entity.evidenceDescription}"
                      </p>
                      {entity.evidenceMediaUrls && entity.evidenceMediaUrls.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] text-slate-500 block mb-1">Attached Evidence Media:</span>
                          <div className="flex flex-wrap gap-2">
                            {entity.evidenceMediaUrls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
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
                    <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Moderation Resolution Notes
                      </h3>
                      <div className="p-3 bg-emerald-50/30 border border-emerald-100/80 rounded-xl text-slate-800">
                        {entity.resolutionNotes}
                        <div className="text-[10px] text-slate-500 font-mono mt-2">
                          Resolved by: {entity.resolvedByAdminEmail || 'superadmin@agrovercity.in'} at {formatDate(entity.resolvedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Type: Expert Consultation Ticket */}
              {type === 'expert_ticket' && (
                <>
                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Farmer & Crop Profile
                      </h3>
                      <PriorityBadge priority={entity.priority} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/80">
                      <div>
                        <div className="text-slate-500 text-[11px]">Farmer Name:</div>
                        <div className="font-bold text-slate-900 text-sm">{entity.farmerName}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Crop / Variety:</div>
                        <div className="font-bold text-emerald-700">{entity.crop}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Farmer UID:</div>
                        <div className="font-mono text-slate-800 text-[11px] font-medium">{entity.farmerId}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Location & Phone:</div>
                        <div className="font-mono text-slate-800 text-[11px] font-medium">
                          {entity.district} · {entity.farmerPhone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Pathological Symptoms & Field Observations
                    </h3>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900 text-xs">{entity.title}</div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                        {entity.description}
                      </p>
                      {entity.imageUrl && (
                        <div className="pt-2">
                          <span className="text-[11px] text-slate-500 block mb-1.5 font-semibold">
                            Field Inspection Imagery:
                          </span>
                          <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-slate-100 max-w-sm">
                            <img
                              src={entity.imageUrl}
                              alt={entity.crop}
                              className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono">
                              Geo-tagged Field Capture
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Agronomist Assignment & SLA
                      </h3>
                      {entity.status !== 'resolved' && entity.slaRemainingHours > 0 && (
                        <span className="text-[10px] font-mono text-amber-700 font-bold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                          ⏱ {entity.slaRemainingHours}h remaining
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Assigned Domain Expert:</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {entity.assignedAgronomist || 'Unassigned'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Advisory Category:</span>
                        <div className="font-bold text-emerald-700 mt-0.5">{entity.issueCategory}</div>
                      </div>
                    </div>
                  </div>

                  {entity.resolutionNotes && (
                    <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Clinical Advisory & Prescribed Treatment
                      </h3>
                      <div className="p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500">Diagnosis:</span>
                          <p className="text-xs text-slate-900 leading-relaxed mt-0.5">{entity.resolutionNotes}</p>
                        </div>
                        {entity.prescribedTreatment && (
                          <div className="pt-2 border-t border-emerald-200/60">
                            <span className="text-[11px] font-semibold text-emerald-800">Prescription:</span>
                            <div className="font-mono text-xs font-bold text-emerald-900 mt-0.5 bg-white p-2 rounded-lg border border-emerald-200">
                              {entity.prescribedTreatment}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Type: User Block */}
              {type === 'block' && (
                <>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-rose-700">
                      <Ban className="w-4 h-4" />
                      <span className="font-bold text-sm">Account Permanently Blacklisted</span>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      This user has been restricted from creating produce lots, bidding on contracts, booking transport trips, or accessing the Agrovercity unified portal.
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Blacklist Registry Record
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">User UID:</span>
                        <div className="font-mono text-slate-900 font-bold mt-0.5">{entity.userId}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Masked Phone:</span>
                        <div className="font-mono text-slate-900 font-medium mt-0.5">{entity.userPhone}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Masked Aadhaar (UIDAI):</span>
                        <div className="font-mono text-emerald-700 font-bold mt-0.5">{entity.userAadhaarMasked || 'XXXX-XXXX-8921'}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                        <span className="text-slate-500">Persona & District:</span>
                        <div className="font-bold text-slate-900 capitalize mt-0.5">
                          {entity.persona} · {entity.district}, {entity.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Reason for Permanent Exclusion
                    </h3>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium">
                      {entity.banReason}
                    </div>
                  </div>
                </>
              )}

              {/* Type: Consent / Audit */}
              {(type === 'consent' || type === 'audit') && (
                <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-3 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Record Summary
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Primary Identifier</span>
                      <span className="font-mono font-bold text-slate-900">{entity.id}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Subject / User</span>
                      <span className="font-bold text-slate-900">{entity.userName || entity.adminEmail}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Operation / Action</span>
                      <span className="font-mono text-emerald-700 font-bold">{entity.purpose || entity.action}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">IP Address</span>
                      <span className="font-mono text-slate-700">{entity.ipAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>DPDP Act 2023 & IT Rules Statutory Adherence</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  All user PII displayed in this superadmin console is strictly masked in compliance with India's Digital Personal Data Protection Act (DPDP 2023). Aadhaar numbers are stored exclusively in UIDAI-compliant HSM secure vaults with only last-4 digits decrypted for institutional dispute resolution.
                </p>
              </div>

              <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2.5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Data Privacy Masking Verification
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                    <span className="text-slate-500">Phone Masking:</span>
                    <div className="font-mono text-slate-800 font-medium mt-1">E.164 Obfuscated (+91 98XXX X...12)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                    <span className="text-slate-500">Aadhaar Vault:</span>
                    <div className="font-mono text-emerald-700 font-bold mt-1">SHA-256 HSM Tokenized (Last-4 Only)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                    <span className="text-slate-500">Session Signature:</span>
                    <div className="font-mono text-slate-600 truncate mt-1">HMAC-SHA256-JWT-Signed</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/20 border border-emerald-100/80">
                    <span className="text-slate-500">Audit Logging:</span>
                    <div className="font-mono text-emerald-700 font-bold mt-1">WORM Append-Only Ledger</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="text-xs font-bold text-slate-900">Entity Audit Trail (Immutable WORM Logs)</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {entityAuditLogs.length} event{entityAuditLogs.length === 1 ? '' : 's'}
                </span>
              </div>

              {loadingAudit ? (
                <div className="p-6 text-center text-xs text-slate-500 animate-pulse">
                  Querying immutable audit logs...
                </div>
              ) : entityAuditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                  No administrative state modifications logged for this entity.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {entityAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-white border border-emerald-100/80 rounded-xl shadow-xs text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200 text-[10px]">
                          {log.actionType}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Admin: <strong className="text-slate-900">{log.adminName}</strong> ({log.ipAddress})
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 space-y-0.5">
                        {log.previousState && (
                          <div className="text-slate-500">Prev: {log.previousState}</div>
                        )}
                        <div className="text-emerald-700 font-semibold">New: {log.newState}</div>
                      </div>
                      {log.reason && (
                        <div className="text-[11px] text-slate-700 italic">
                          "{log.reason}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-mono">Raw Platform Schema Document</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-200 text-xs transition-colors"
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
        <div className="p-4 border-t border-emerald-100/80 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Close Drawer
          </button>

          <div className="flex items-center gap-2">
            {type === 'expert_ticket' && (
              <>
                {canMutate && entity.status !== 'resolved' && onResolveTicket && (
                  <button
                    onClick={() => {
                      onClose()
                      onResolveTicket(entity)
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Resolve & Prescribe</span>
                  </button>
                )}
                {canMutate && onAssignTicket && (
                  <button
                    onClick={() => {
                      onClose()
                      onAssignTicket(entity)
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Assign Agronomist</span>
                  </button>
                )}
              </>
            )}

            {type === 'report' && entity.status !== 'resolved_banned' && entity.status !== 'dismissed' && onResolveReport && canMutate && (
              <button
                onClick={() => {
                  onClose()
                  onResolveReport(entity)
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Take Moderation Action</span>
              </button>
            )}

            {type === 'block' && onUnbanUser && canMutate && (
              <button
                onClick={() => {
                  onClose()
                  onUnbanUser(entity)
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
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
