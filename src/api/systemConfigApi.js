/**
 * AGROVERCITY SUPERADMIN — Module 26: System Health, Remote Config, Broadcast & Moderation API
 * Document ID: SOP-26
 * Target Collections: app_config, broadcasts, user_reports, user_blocks, user_consents, audit_logs, expert_tickets
 */

import { request } from './client'
import * as adminSystemConfigService from '../services/adminSystemConfigService'

let apiDisabled = false

function toQueryString(params = {}) {
  const clean = {}
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'all') {
      clean[key] = params[key]
    }
  })
  const qs = new URLSearchParams(clean).toString()
  return qs ? `?${qs}` : ''
}

// --- 1. Global KPI & System Health ---
export async function getSystemConfigSummary() {
  if (apiDisabled) {
    return adminSystemConfigService.getSystemConfigSummary()
  }
  try {
    const res = await request('GET', '/v1/admin/analytics/summary')
    return res?.data || adminSystemConfigService.getSystemConfigSummary()
  } catch {
    apiDisabled = true
    return adminSystemConfigService.getSystemConfigSummary()
  }
}

export async function getSystemHealth() {
  if (apiDisabled) {
    return adminSystemConfigService.getSystemHealth()
  }
  try {
    const res = await request('GET', '/v1/admin/system/health')
    return res?.data || adminSystemConfigService.getSystemHealth()
  } catch {
    apiDisabled = true
    return adminSystemConfigService.getSystemHealth()
  }
}

export async function pingSystemHealth(adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.pingSystemHealth(adminName, adminUid)
}

// --- 2. Remote Config & Feature Flags ---
export async function getAppConfig() {
  if (apiDisabled) {
    return adminSystemConfigService.getAppConfig()
  }
  try {
    const res = await request('GET', '/v1/admin/app-config')
    return res?.data || adminSystemConfigService.getAppConfig()
  } catch {
    apiDisabled = true
    return adminSystemConfigService.getAppConfig()
  }
}

export async function updateAppConfig(payload, reason = '', adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  if (apiDisabled) {
    return adminSystemConfigService.updateAppConfig(payload, reason, adminName, adminUid)
  }
  try {
    const res = await request('PUT', '/v1/admin/app-config', { ...payload, reason })
    return res?.data || adminSystemConfigService.updateAppConfig(payload, reason, adminName, adminUid)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.updateAppConfig(payload, reason, adminName, adminUid)
  }
}

// --- 3. FCM Push Broadcasts Engine ---
export async function listBroadcasts(query = {}) {
  if (apiDisabled) {
    return adminSystemConfigService.listBroadcasts(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/broadcast${qs}`)
    return res?.data || adminSystemConfigService.listBroadcasts(query)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.listBroadcasts(query)
  }
}

export async function sendBroadcast(payload, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  if (apiDisabled) {
    return adminSystemConfigService.sendBroadcast(payload, adminName, adminUid)
  }
  try {
    const res = await request('POST', '/v1/admin/broadcast', payload)
    return res?.data || adminSystemConfigService.sendBroadcast(payload, adminName, adminUid)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.sendBroadcast(payload, adminName, adminUid)
  }
}

// --- 4. User Moderation Queue & Reports ---
export async function listUserReports(query = {}) {
  if (apiDisabled) {
    return adminSystemConfigService.listUserReports(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/reports${qs}`)
    return res?.data || adminSystemConfigService.listUserReports(query)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.listUserReports(query)
  }
}

export async function resolveUserReport(id, resolution, reason = '', adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  if (apiDisabled) {
    return adminSystemConfigService.resolveUserReport(id, resolution, reason, adminName, adminUid)
  }
  try {
    const res = await request('POST', `/v1/admin/reports/${id}/resolve`, { resolution, reason })
    return res?.data || adminSystemConfigService.resolveUserReport(id, resolution, reason, adminName, adminUid)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.resolveUserReport(id, resolution, reason, adminName, adminUid)
  }
}

export async function batchResolveReports(ids, resolution, reason, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.batchResolveReports(ids, resolution, reason, adminName, adminUid)
}

// --- 5. User Blocks / Blacklist Registry ---
export async function listUserBlocks(query = {}) {
  if (apiDisabled) {
    return adminSystemConfigService.listUserBlocks(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/blocks${qs}`)
    return res?.data || adminSystemConfigService.listUserBlocks(query)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.listUserBlocks(query)
  }
}

export async function unbanUser(userId, reason = '', adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  if (apiDisabled) {
    return adminSystemConfigService.unbanUser(userId, reason, adminName, adminUid)
  }
  try {
    const res = await request('POST', `/v1/admin/blocks/${userId}/unban`, { reason })
    return res?.data || adminSystemConfigService.unbanUser(userId, reason, adminName, adminUid)
  } catch {
    apiDisabled = true
    return adminSystemConfigService.unbanUser(userId, reason, adminName, adminUid)
  }
}

export async function batchUnbanUsers(userIds, reason, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.batchUnbanUsers(userIds, reason, adminName, adminUid)
}

// --- 6. Agronomist Consultation Expert Tickets Desk ---
export async function listExpertTickets(query = {}) {
  return adminSystemConfigService.listExpertTickets(query)
}

export async function resolveExpertTicket(id, resolutionNotes, prescribedTreatment, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.resolveExpertTicket(id, resolutionNotes, prescribedTreatment, adminName, adminUid)
}

export async function assignExpertTicket(id, assignedAgronomist, reason, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.assignExpertTicket(id, assignedAgronomist, reason, adminName, adminUid)
}

export async function batchResolveExpertTickets(ids, resolutionNotes, adminName = 'Super Admin', adminUid = 'usr_admin_root') {
  return adminSystemConfigService.batchResolveExpertTickets(ids, resolutionNotes, adminName, adminUid)
}

// --- 7. DPDP User Consents Ledger ---
export async function listUserConsents(query = {}) {
  return adminSystemConfigService.listUserConsents(query)
}

// --- 8. Audit Logs & Seed Reset ---
export async function getSystemConfigAuditLogs(query = {}) {
  return adminSystemConfigService.getSystemConfigAuditLogs(query)
}

export async function getEntityAuditLogs(entityId) {
  return adminSystemConfigService.getEntityAuditLogs(entityId)
}

export async function resetSystemConfigSeedData(reason, adminUid, adminName) {
  return adminSystemConfigService.resetToDefaultSeed(reason, adminUid, adminName)
}

export async function resetToDefaultSeed(reason, adminName, adminUid) {
  return adminSystemConfigService.resetToDefaultSeed(reason, adminName, adminUid)
}
