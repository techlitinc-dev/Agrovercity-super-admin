import { request } from './client'
import {
  mockAppConfig,
  mockSystemHealth,
  mockBroadcasts,
  mockUserReports,
  mockUserBlocks,
  mockUserConsents,
  mockSystemConfigAuditLogs,
  mockSystemConfigSummary
} from './systemConfigMockData'

let mockMode = false

function paginate(list, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length
  }
}

// In-memory state for mutations
let appConfigState = JSON.parse(JSON.stringify(mockAppConfig))
let broadcastsState = JSON.parse(JSON.stringify(mockBroadcasts))
let userReportsState = JSON.parse(JSON.stringify(mockUserReports))
let userBlocksState = JSON.parse(JSON.stringify(mockUserBlocks))
let userConsentsState = JSON.parse(JSON.stringify(mockUserConsents))
let auditLogsState = JSON.parse(JSON.stringify(mockSystemConfigAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_cfg_${Date.now()}`,
    adminUid: 'usr_admin_root',
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.15',
    actionType,
    entityId,
    entityName,
    collection,
    previousState,
    newState,
    reason: reason || 'Routine system governance administrative operation'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

// --- 1. Global KPI & System Health ---
export async function getSystemConfigSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/analytics/summary')
    } catch {
      mockMode = true
    }
  }

  const pendingReports = userReportsState.filter((r) => r.status === 'pending' || r.status === 'investigating').length
  const totalBroadcasts = broadcastsState.reduce((acc, b) => acc + (b.deliveredCount || 0), 0)

  return {
    totalPlatformModules: 26,
    activeServicesHealthy: 26,
    systemUptimePct: 99.98,
    minSupportedAppVersion: appConfigState.minSupportedVersion,
    latestAppVersion: appConfigState.latestVersion,
    broadcastsDeliveredThisMonth: totalBroadcasts,
    pendingModerationReports: pendingReports,
    totalBannedUsers: userBlocksState.length,
    dpdpConsentCompliancePct: 100,
    activeFeatureFlagCount: Object.values(appConfigState.featureFlags || {}).filter(Boolean).length
  }
}

export async function getSystemHealth() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/system/health')
    } catch {
      mockMode = true
    }
  }
  return { ...mockSystemHealth, lastHealthCheckAt: new Date().toISOString() }
}

// --- 2. Remote Config & Feature Flags ---
export async function getAppConfig() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/app-config')
    } catch {
      mockMode = true
    }
  }
  return { ...appConfigState }
}

export async function updateAppConfig(payload, reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('PUT', '/v1/admin/app-config', { ...payload, reason })
    } catch {
      mockMode = true
    }
  }

  const prev = { ...appConfigState }
  appConfigState = {
    ...appConfigState,
    ...payload,
    lastUpdatedBy: adminName,
    lastUpdatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_REMOTE_CONFIG',
    entityId: 'app_config',
    entityName: 'Mobile App Version Gates & Feature Flags',
    collection: 'app_config',
    previousState: JSON.stringify({ min: prev.minSupportedVersion, maintenance: prev.maintenanceMode }),
    newState: JSON.stringify({ min: appConfigState.minSupportedVersion, maintenance: appConfigState.maintenanceMode }),
    reason: reason || 'Updated remote mobile config and feature flags',
    adminName
  })
  return appConfigState
}

// --- 3. FCM Push Broadcasts Engine ---
export async function listBroadcasts(query = {}) {
  const { page = 1, pageSize = 20, search = '', targetPersona = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/broadcast', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...broadcastsState]
  if (targetPersona && targetPersona !== 'all') {
    filtered = filtered.filter((b) => b.targetPersona === targetPersona)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.body?.toLowerCase().includes(q) ||
        b.targetDistrict?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function sendBroadcast(payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', '/v1/admin/broadcast', payload)
    } catch {
      mockMode = true
    }
  }

  const estRecipients = Math.floor(1500 + Math.random() * 25000)
  const newBroadcast = {
    id: `bc_fcm_${Date.now()}`,
    ...payload,
    status: 'sent',
    recipientCount: estRecipients,
    deliveredCount: Math.floor(estRecipients * 0.98),
    clickRatePct: Math.floor(25 + Math.random() * 30),
    fcmMessageId: `projects/agrovercity/messages/bc-${Date.now()}`,
    sentAt: new Date().toISOString(),
    sentBy: adminName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  broadcastsState.unshift(newBroadcast)

  recordAudit({
    actionType: 'DISPATCH_FCM_BROADCAST',
    entityId: newBroadcast.id,
    entityName: newBroadcast.title,
    collection: 'broadcasts',
    previousState: null,
    newState: `Delivered to ${newBroadcast.deliveredCount} users (${newBroadcast.targetPersona}, ${newBroadcast.targetDistrict})`,
    reason: `FCM push notification broadcast: ${newBroadcast.title}`,
    adminName
  })
  return newBroadcast
}

// --- 4. User Moderation Queue & Reports ---
export async function listUserReports(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', category = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/reports', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...userReportsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((r) => r.status === status)
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((r) => r.category === category)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.reportedUserName?.toLowerCase().includes(q) ||
        r.reporterName?.toLowerCase().includes(q) ||
        r.evidenceDescription?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function resolveUserReport(id, resolution, reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/reports/${id}/resolve`, { resolution, reason })
    } catch {
      mockMode = true
    }
  }

  const rep = userReportsState.find((r) => r.id === id)
  if (!rep) throw new Error('Report not found')

  const prevStatus = rep.status
  rep.status = resolution // 'resolved_warning', 'resolved_banned', 'dismissed'
  rep.resolutionNotes = reason
  rep.updatedAt = new Date().toISOString()

  if (resolution === 'resolved_banned') {
    // Add to userBlocksState
    const isAlreadyBlocked = userBlocksState.some((b) => b.userId === rep.reportedUserId)
    if (!isAlreadyBlocked) {
      userBlocksState.unshift({
        id: `blk_${Date.now()}`,
        userId: rep.reportedUserId,
        userName: rep.reportedUserName,
        userPhone: rep.reportedUserPhone,
        userAadhaarMasked: 'XXXX-XXXX-8921',
        persona: rep.reportedUserPersona,
        district: 'Reported Region',
        bannedBy: adminName,
        banReason: reason || `Banned following resolution of report #${id} (${rep.category})`,
        appealStatus: 'ineligible',
        bannedAt: new Date().toISOString()
      })
    }
  }

  recordAudit({
    actionType: resolution === 'resolved_banned' ? 'BAN_USER' : 'RESOLVE_USER_REPORT',
    entityId: id,
    entityName: `${rep.reportedUserName} (${rep.category})`,
    collection: 'user_reports',
    previousState: `status: ${prevStatus}`,
    newState: `status: ${resolution}`,
    reason: reason || `Admin resolved moderation report as ${resolution}`,
    adminName
  })
  return rep
}

// --- 5. User Blocks / Blacklist Registry ---
export async function listUserBlocks(query = {}) {
  const { page = 1, pageSize = 20, search = '' } = query
  let filtered = [...userBlocksState]
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.userName?.toLowerCase().includes(q) ||
        b.userPhone?.toLowerCase().includes(q) ||
        b.banReason?.toLowerCase().includes(q) ||
        b.userId?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function unbanUser(userId, reason = '', adminName = 'Super Admin') {
  const idx = userBlocksState.findIndex((b) => b.userId === userId)
  if (idx === -1) throw new Error('Blocked user record not found')
  const unbanned = userBlocksState.splice(idx, 1)[0]

  recordAudit({
    actionType: 'UNBAN_USER',
    entityId: userId,
    entityName: unbanned.userName,
    collection: 'user_blocks',
    previousState: 'status: banned',
    newState: 'status: restored',
    reason: reason || 'Lifted user ban following appeal review',
    adminName
  })
  return unbanned
}

// --- 6. DPDP User Consents Ledger ---
export async function listUserConsents(query = {}) {
  const { page = 1, pageSize = 20, search = '' } = query
  let filtered = [...userConsentsState]
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.userName?.toLowerCase().includes(q) ||
        c.purpose?.toLowerCase().includes(q) ||
        c.userId?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

// --- 7. Audit Logs ---
export async function getSystemConfigAuditLogs(query = {}) {
  const { page = 1, pageSize = 20, search = '' } = query
  let filtered = [...auditLogsState]
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (l) =>
        l.entityName?.toLowerCase().includes(q) ||
        l.actionType?.toLowerCase().includes(q) ||
        l.reason?.toLowerCase().includes(q) ||
        l.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}
