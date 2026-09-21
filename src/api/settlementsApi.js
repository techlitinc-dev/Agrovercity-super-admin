import { request } from './client'
import {
  mockSettlements,
  mockTransporterPayouts,
  mockSellerPayouts,
  mockPlatformCommissions,
  mockCronJobLogs,
  mockSettlementsAuditLogs,
  mockSettlementsSummary
} from './settlementsMockData'

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
let settlementsState = JSON.parse(JSON.stringify(mockSettlements))
let transporterPayoutsState = JSON.parse(JSON.stringify(mockTransporterPayouts))
let sellerPayoutsState = JSON.parse(JSON.stringify(mockSellerPayouts))
let configState = JSON.parse(JSON.stringify(mockPlatformCommissions))
let cronLogsState = JSON.parse(JSON.stringify(mockCronJobLogs))
let auditLogsState = JSON.parse(JSON.stringify(mockSettlementsAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_stl_${Date.now()}`,
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
    reason: reason || 'Routine financial settlement administrative operation'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

// --- 1. KPI Summary ---
export async function getSettlementsSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/settlements/summary')
    } catch {
      mockMode = true
    }
  }

  const totalSettled = settlementsState
    .filter((s) => s.status === 'paid')
    .reduce((acc, s) => acc + (s.netPayoutInr || 0), 0)
  const pendingPayout = settlementsState
    .filter((s) => s.status === 'pending' || s.status === 'approved')
    .reduce((acc, s) => acc + (s.netPayoutInr || 0), 0)
  const commissionsRetained = settlementsState.reduce((acc, s) => acc + (s.platformFeeInr || 0), 0)
  const activeHolds = settlementsState.filter((s) => s.status === 'on_hold').length
  const pendingApprovals = settlementsState.filter((s) => s.status === 'approved' || s.status === 'pending').length

  return {
    totalSettledMonthInr: totalSettled + 4500000,
    pendingPayoutQueueInr: pendingPayout,
    platformCommissionsRetainedInr: commissionsRetained + 400000,
    activeLegalHoldsCount: activeHolds,
    pendingApprovalBatchesCount: pendingApprovals,
    cronJobsCount: cronLogsState.length,
    cronSuccessRatePct: 100,
    todayDisbursedInr: settlementsState.filter((s) => s.status === 'paid').reduce((acc, s) => acc + (s.netPayoutInr || 0), 0)
  }
}

// --- 2. Master Settlements Ledger ---
export async function listSettlements(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', entityType = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/settlements', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...settlementsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((s) => s.status === status)
  }
  if (entityType && entityType !== 'all') {
    filtered = filtered.filter((s) => s.entityType === entityType)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.beneficiaryName?.toLowerCase().includes(q) ||
        s.batchId?.toLowerCase().includes(q) ||
        s.gstInvoiceNo?.toLowerCase().includes(q) ||
        s.paymentReferenceUtr?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function markSettlementPaid(id, paymentReferenceUtr, reason = '', coAdmin = null, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/settlements/${id}/mark-paid`, {
        paymentReferenceUtr,
        reason,
        coAdmin
      })
    } catch {
      mockMode = true
    }
  }

  const stl = settlementsState.find((s) => s.id === id)
  if (!stl) throw new Error('Settlement not found')

  const prevStatus = stl.status
  stl.status = 'paid'
  stl.paymentReferenceUtr = paymentReferenceUtr || `NEFT2609${Math.floor(100000 + Math.random() * 900000)}`
  stl.paidAt = new Date().toISOString()
  stl.signOffAdmin1 = adminName
  if (coAdmin) {
    stl.signOffAdmin2 = coAdmin.secondAdminEmail
  }
  stl.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: stl.netPayoutInr > 50000 ? 'DUAL_SIGNOFF_MARK_PAID' : 'MARK_SETTLEMENT_PAID',
    entityId: id,
    entityName: `${stl.beneficiaryName} (${stl.batchId})`,
    collection: 'settlements',
    previousState: `status: ${prevStatus}`,
    newState: `status: paid (UTR: ${stl.paymentReferenceUtr}, INR ${stl.netPayoutInr})${coAdmin ? ` [Co-admin: ${coAdmin.secondAdminEmail}]` : ''}`,
    reason: reason || 'Disbursed batch funds via direct bank transfer',
    adminName
  })
  return stl
}

export async function setSettlementHold(id, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/settlements/${id}/hold`, { reason })
    } catch {
      mockMode = true
    }
  }

  const stl = settlementsState.find((s) => s.id === id)
  if (!stl) throw new Error('Settlement not found')

  const prevStatus = stl.status
  stl.status = 'on_hold'
  stl.holdReason = reason || 'Placed on administrative settlement freeze'
  stl.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'SET_SETTLEMENT_HOLD',
    entityId: id,
    entityName: `${stl.beneficiaryName} (${stl.batchId})`,
    collection: 'settlements',
    previousState: `status: ${prevStatus}`,
    newState: 'status: on_hold',
    reason: reason || 'Legal or dispute freeze placed on payout batch',
    adminName
  })
  return stl
}

export async function releaseSettlementHold(id, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/settlements/${id}/release-hold`, { reason })
    } catch {
      mockMode = true
    }
  }

  const stl = settlementsState.find((s) => s.id === id)
  if (!stl) throw new Error('Settlement not found')

  const prevStatus = stl.status
  stl.status = 'approved'
  stl.holdReason = null
  stl.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'RELEASE_SETTLEMENT_HOLD',
    entityId: id,
    entityName: `${stl.beneficiaryName} (${stl.batchId})`,
    collection: 'settlements',
    previousState: `status: ${prevStatus}`,
    newState: 'status: approved',
    reason: reason || 'Arbitration cleared; legal hold lifted for payout processing',
    adminName
  })
  return stl
}

// --- 3. Transporter Payouts Ledger ---
export async function listTransporterPayouts(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/settlements/transporters', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...transporterPayoutsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((t) => t.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.transporterName?.toLowerCase().includes(q) ||
        t.tripId?.toLowerCase().includes(q) ||
        t.vehicleNo?.toLowerCase().includes(q) ||
        t.eWayBillNo?.toLowerCase().includes(q) ||
        t.route?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

// --- 4. Produce Seller Payouts Ledger ---
export async function listSellerPayouts(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/settlements/sellers', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...sellerPayoutsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((s) => s.escrowReleaseStatus === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.sellerName?.toLowerCase().includes(q) ||
        s.buyerName?.toLowerCase().includes(q) ||
        s.lotId?.toLowerCase().includes(q) ||
        s.commodity?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

// --- 5. Commission & Platform Configurations ---
export async function getCommissionConfig() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/platform-config/commissions')
    } catch {
      mockMode = true
    }
  }
  return { ...configState }
}

export async function updateCommissionConfig(payload, reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('PUT', '/v1/admin/platform-config/commissions', { ...payload, reason })
    } catch {
      mockMode = true
    }
  }

  const prev = { ...configState }
  configState = {
    ...configState,
    ...payload,
    lastUpdatedBy: adminName,
    lastUpdatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_COMMISSION_CONFIG',
    entityId: 'platform_config/settlements',
    entityName: 'Platform Commission Matrix',
    collection: 'platform_config',
    previousState: JSON.stringify({
      transporter: prev.transporterCommissionPct,
      equipment: prev.equipmentRentalCommissionPct,
      broker: prev.brokerCommissionPct
    }),
    newState: JSON.stringify({
      transporter: configState.transporterCommissionPct,
      equipment: configState.equipmentRentalCommissionPct,
      broker: configState.brokerCommissionPct
    }),
    reason: reason || 'Updated platform commission rates and tax deduction parameters',
    adminName
  })
  return configState
}

// --- 6. Automated Scheduled Jobs & Manual Batch Trigger ---
export async function triggerSettlementRun(payload = {}, reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', '/v1/admin/jobs/settlements/run', { ...payload, reason })
    } catch {
      mockMode = true
    }
  }

  const newBatchId = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-MANUAL-${Math.floor(100 + Math.random() * 900)}`
  const mockGeneratedBatch = {
    id: `stl_batch_${Date.now()}`,
    batchId: newBatchId,
    entityType: payload.entityType || 'transporter',
    beneficiaryId: 'usr_tr_manual',
    beneficiaryName: 'On-Demand Batch Reconciliation Run',
    beneficiaryPhone: '+91 98XXX XX000',
    district: 'Statewide MH',
    state: 'Maharashtra',
    bankName: 'Escrow Pool Account (Axis Bank)',
    accountNumberMasked: '••••••••9999',
    ifscCode: 'UTIB0000101',
    panMasked: 'AGROP••••M',
    grossAmountInr: 95000,
    commissionRatePct: 10.0,
    platformFeeInr: 9500,
    gstOnFeeInr: 1710,
    tdsDeductedInr: 950,
    netPayoutInr: 82840,
    settlementPeriod: payload.dateRange || 'On-demand Re-run',
    ordersCount: 6,
    status: 'approved',
    paymentReferenceUtr: null,
    paidAt: null,
    holdReason: null,
    gstInvoiceNo: `INV-AGRO-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
    dualSignOffRequired: true,
    signOffAdmin1: adminName,
    signOffAdmin2: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  settlementsState.unshift(mockGeneratedBatch)

  recordAudit({
    actionType: 'MANUAL_SETTLEMENT_RUN',
    entityId: newBatchId,
    entityName: 'Manual Settlement Batch Trigger',
    collection: 'settlements',
    previousState: null,
    newState: `Generated Batch ${newBatchId} (6 records, Net ₹82,840)`,
    reason: reason || 'On-demand settlement calculation run triggered by Superadmin',
    adminName
  })
  return mockGeneratedBatch
}

export async function listCronJobLogs(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/jobs/logs', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...cronLogsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.jobName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.schedule?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function triggerCronJob(jobName, reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/jobs/${jobName}/trigger`, { reason })
    } catch {
      mockMode = true
    }
  }

  const job = cronLogsState.find((j) => j.jobName === jobName)
  if (job) {
    job.lastExecutedAt = new Date().toISOString()
    job.status = 'success'
    job.durationMs = Math.floor(800 + Math.random() * 2000)
    job.recordsProcessed = Math.floor(10 + Math.random() * 50)
  }

  recordAudit({
    actionType: 'TRIGGER_CRON_JOB',
    entityId: jobName,
    entityName: `Cloud Scheduler Cron: ${jobName}`,
    collection: 'cron_job_logs',
    previousState: 'Scheduled trigger',
    newState: 'Manual trigger completed: 200 OK',
    reason: reason || 'Manually invoked scheduled job run',
    adminName
  })
  return job
}

// --- 7. Audit Logs ---
export async function getSettlementsAuditLogs(query = {}) {
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
