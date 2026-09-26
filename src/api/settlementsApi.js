import { request } from './client'
import * as adminSettlementsService from '../services/adminSettlementsService'

let apiDisabled = false

function toQueryString(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.append(k, String(v))
    }
  })
  const str = q.toString()
  return str ? `?${str}` : ''
}

// --- 1. KPI Summary ---
export async function getSettlementsSummary() {
  if (apiDisabled) {
    return adminSettlementsService.getSettlementsSummary()
  }
  try {
    const res = await request('GET', '/v1/admin/settlements/summary')
    return res?.data || adminSettlementsService.getSettlementsSummary()
  } catch {
    apiDisabled = true
    return adminSettlementsService.getSettlementsSummary()
  }
}

// --- 2. Master Settlements Ledger ---
export async function listSettlements(query = {}) {
  if (apiDisabled) {
    return adminSettlementsService.listSettlements(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/settlements${qs}`)
    return res?.data || adminSettlementsService.listSettlements(query)
  } catch {
    apiDisabled = true
    return adminSettlementsService.listSettlements(query)
  }
}

export async function getSettlementById(id) {
  if (apiDisabled) {
    return adminSettlementsService.getSettlementById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/settlements/${id}`)
    return res?.data || adminSettlementsService.getSettlementById(id)
  } catch {
    apiDisabled = true
    return adminSettlementsService.getSettlementById(id)
  }
}

export async function markSettlementPaid(
  id,
  paymentReferenceUtr,
  reason = '',
  coAdmin = null,
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  if (apiDisabled) {
    return adminSettlementsService.markSettlementPaid(id, paymentReferenceUtr, reason, coAdmin, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/settlements/${id}/mark-paid`, {
      paymentReferenceUtr,
      reason,
      coAdmin
    })
    return res?.data || adminSettlementsService.markSettlementPaid(id, paymentReferenceUtr, reason, coAdmin, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.markSettlementPaid(id, paymentReferenceUtr, reason, coAdmin, adminUid, adminName)
  }
}

export async function setSettlementHold(
  id,
  reason = '',
  disputeRef = '',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  if (apiDisabled) {
    return adminSettlementsService.setSettlementHold(id, reason, disputeRef, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/settlements/${id}/hold`, { reason, disputeRef })
    return res?.data || adminSettlementsService.setSettlementHold(id, reason, disputeRef, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.setSettlementHold(id, reason, disputeRef, adminUid, adminName)
  }
}

export async function releaseSettlementHold(
  id,
  reason = '',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  if (apiDisabled) {
    return adminSettlementsService.releaseSettlementHold(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/settlements/${id}/release-hold`, { reason })
    return res?.data || adminSettlementsService.releaseSettlementHold(id, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.releaseSettlementHold(id, reason, adminUid, adminName)
  }
}

// Batch Helpers
export async function batchApproveSettlements(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminSettlementsService.batchApproveSettlements(ids, reason, adminUid, adminName)
}

export async function batchMarkPaidSettlements(ids, reason, paymentRefPrefix, coAdmin, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminSettlementsService.batchMarkPaidSettlements(ids, reason, paymentRefPrefix, coAdmin, adminUid, adminName)
}

export async function batchPlaceHoldSettlements(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminSettlementsService.batchPlaceHoldSettlements(ids, reason, adminUid, adminName)
}

export async function batchReleaseHoldSettlements(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminSettlementsService.batchReleaseHoldSettlements(ids, reason, adminUid, adminName)
}

// --- 3. Transporter Payouts ---
export async function listTransporterPayouts(query = {}) {
  if (apiDisabled) {
    return adminSettlementsService.listTransporterPayouts(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/transporters/payouts${qs}`)
    return res?.data || adminSettlementsService.listTransporterPayouts(query)
  } catch {
    apiDisabled = true
    return adminSettlementsService.listTransporterPayouts(query)
  }
}

// --- 4. Seller Produce Escrow Payouts ---
export async function listSellerPayouts(query = {}) {
  if (apiDisabled) {
    return adminSettlementsService.listSellerPayouts(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/sellers/payouts${qs}`)
    return res?.data || adminSettlementsService.listSellerPayouts(query)
  } catch {
    apiDisabled = true
    return adminSettlementsService.listSellerPayouts(query)
  }
}

// --- 5. Platform Commission Matrix ---
export async function getCommissionConfig() {
  if (apiDisabled) {
    return adminSettlementsService.getCommissionConfig()
  }
  try {
    const res = await request('GET', '/v1/admin/platform-config/commissions')
    return res?.data || adminSettlementsService.getCommissionConfig()
  } catch {
    apiDisabled = true
    return adminSettlementsService.getCommissionConfig()
  }
}

export async function updateCommissionConfig(
  newConfig,
  reason = '',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  if (apiDisabled) {
    return adminSettlementsService.updateCommissionConfig(newConfig, reason, adminUid, adminName)
  }
  try {
    const res = await request('PUT', '/v1/admin/platform-config/commissions', { ...newConfig, reason })
    return res?.data || adminSettlementsService.updateCommissionConfig(newConfig, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.updateCommissionConfig(newConfig, reason, adminUid, adminName)
  }
}

// --- 6. Cron Job Monitoring & Trigger Run ---
export async function listCronJobLogs(query = {}) {
  if (apiDisabled) {
    return adminSettlementsService.listCronJobLogs(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/jobs/cron-logs${qs}`)
    return res?.data || adminSettlementsService.listCronJobLogs(query)
  } catch {
    apiDisabled = true
    return adminSettlementsService.listCronJobLogs(query)
  }
}

export async function triggerCronJob(jobId, reason = '', adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminSettlementsService.triggerCronJob(jobId, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/jobs/cron-logs/${jobId}/trigger`, { reason })
    return res?.data || adminSettlementsService.triggerCronJob(jobId, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.triggerCronJob(jobId, reason, adminUid, adminName)
  }
}

export async function triggerSettlementRun(optionsOrReason = '', adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminSettlementsService.triggerManualSettlementRun(optionsOrReason, adminUid, adminName)
  }
  try {
    const payload = typeof optionsOrReason === 'object' ? optionsOrReason : { reason: optionsOrReason }
    const res = await request('POST', '/v1/admin/jobs/settlements/run', payload)
    return res?.data || adminSettlementsService.triggerManualSettlementRun(optionsOrReason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminSettlementsService.triggerManualSettlementRun(optionsOrReason, adminUid, adminName)
  }
}

// --- 7. Audit Logs & Seed Reset ---
export async function getSettlementsAuditLogs(query = {}) {
  return adminSettlementsService.getSettlementsAuditLogs(query)
}

export async function getEntityAuditLogs(entityId) {
  return adminSettlementsService.getEntityAuditLogs(entityId)
}

export async function resetSettlementsSeedData(reason, adminUid, adminName) {
  return adminSettlementsService.resetToDefaultSeed(reason, adminUid, adminName)
}
