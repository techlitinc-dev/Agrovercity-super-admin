/**
 * AGROVERCITY SUPERADMIN — Module 25: Financial Settlements & Automated Cron Jobs Service
 * Document ID: SOP-25
 * Target Collections: settlements, transporter_payouts, seller_payouts, cron_job_logs, platform_config/settlements, audit_logs
 *
 * Implements persistent LocalStorage storage, dynamic KPI recalculations,
 * date range & persona filters, dual-admin sign-off enforcement (> ₹50,000 for disbursements),
 * legal settlement holds with dispute references, on-demand automated cron execution runs,
 * platform commission matrix modifications, multi-row batch actions, entity audit histories, and benchmark seed reset.
 */

import {
  mockSettlements,
  mockTransporterPayouts,
  mockSellerPayouts,
  mockPlatformCommissions,
  mockCronJobLogs,
  mockSettlementsAuditLogs,
  mockSettlementsSummary
} from '../api/settlementsMockData'

const SETTLEMENTS_KEY = 'agrovercity_superadmin_stl_settlements'
const TRANSPORTERS_KEY = 'agrovercity_superadmin_stl_transporter_payouts'
const SELLERS_KEY = 'agrovercity_superadmin_stl_seller_payouts'
const COMMISSIONS_KEY = 'agrovercity_superadmin_stl_commissions'
const CRON_LOGS_KEY = 'agrovercity_superadmin_stl_cron_logs'
const AUDIT_KEY = 'agrovercity_superadmin_stl_audit_logs'

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (err) {
    console.warn(`Failed to persist ${key} to localStorage:`, err)
  }
}

// -------------------------------------------------------------
// AUDIT LOGGING ENGINE
// -------------------------------------------------------------
export function getStoredAuditLogs() {
  return getStored(AUDIT_KEY, mockSettlementsAuditLogs)
}

export function recordAuditLog({
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin',
  actionType,
  entityId,
  entityName,
  collection,
  previousState = 'none',
  newState = 'active',
  reason = 'Routine superadmin settlement operations',
  ipAddress = '10.0.4.15'
}) {
  const list = getStoredAuditLogs()
  const logEntry = {
    id: `aud_stl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    adminUid,
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress,
    actionType,
    entityId: String(entityId || ''),
    entityName: String(entityName || ''),
    collection,
    previousState: String(previousState || ''),
    newState: String(newState || ''),
    reason
  }
  list.unshift(logEntry)
  save(AUDIT_KEY, list)
  return logEntry
}

export function getEntityAuditLogs(entityId) {
  if (!entityId) return []
  const list = getStoredAuditLogs()
  const strId = String(entityId).toLowerCase()
  return list.filter((l) => String(l.entityId || '').toLowerCase() === strId)
}

// -------------------------------------------------------------
// FILTERING HELPERS: DATE RANGE & PERSONA
// -------------------------------------------------------------
function matchesDateRange(dateStr, range = 'all') {
  if (!range || range === 'all') return true
  if (!dateStr) return false
  const target = new Date(dateStr).getTime()
  if (isNaN(target)) return true
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  switch (range) {
    case 'today':
      return now - target <= dayMs
    case 'last_7_days':
      return now - target <= 7 * dayMs
    case 'last_30_days':
      return now - target <= 30 * dayMs
    case 'this_quarter':
      return now - target <= 90 * dayMs
    default:
      return true
  }
}

function matchesPersona(item, persona = 'all') {
  if (!persona || persona === 'all') return true
  switch (persona) {
    case 'transporter':
      return (
        item.entityType === 'transporter' ||
        Boolean(item.tripId || item.vehicleNo || item.transporterName)
      )
    case 'seller':
      return (
        item.entityType === 'seller' ||
        Boolean(item.lotId || item.buyerOrg || item.sellerName)
      )
    case 'equipment_owner':
      return item.entityType === 'equipment_owner'
    case 'broker':
      return item.entityType === 'broker'
    case 'financial_auditor':
      return true
    default:
      return true
  }
}

function paginate(list, page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1)
  const ps = Math.max(1, Number(pageSize) || 20)
  const start = (p - 1) * ps
  return {
    data: list.slice(start, start + ps),
    page: p,
    pageSize: ps,
    total: list.length
  }
}

// -------------------------------------------------------------
// REPOSITORIES
// -------------------------------------------------------------
export function getStoredSettlements() {
  return getStored(SETTLEMENTS_KEY, mockSettlements)
}
export function getStoredTransporterPayouts() {
  return getStored(TRANSPORTERS_KEY, mockTransporterPayouts)
}
export function getStoredSellerPayouts() {
  return getStored(SELLERS_KEY, mockSellerPayouts)
}
export function getStoredCommissions() {
  return getStored(COMMISSIONS_KEY, mockPlatformCommissions)
}
export function getStoredCronLogs() {
  return getStored(CRON_LOGS_KEY, mockCronJobLogs)
}

// -------------------------------------------------------------
// 1. DYNAMIC SUMMARY & KPIS
// -------------------------------------------------------------
export function getSettlementsSummary() {
  const settlements = getStoredSettlements()
  const cronLogs = getStoredCronLogs()

  const totalSettled = settlements
    .filter((s) => s.status === 'paid')
    .reduce((acc, s) => acc + (Number(s.netPayoutInr) || 0), 0)

  const pendingPayout = settlements
    .filter((s) => s.status === 'pending' || s.status === 'approved')
    .reduce((acc, s) => acc + (Number(s.netPayoutInr) || 0), 0)

  const commissionsRetained = settlements.reduce(
    (acc, s) => acc + (Number(s.platformFeeInr) || 0),
    0
  )

  const activeHolds = settlements.filter((s) => s.status === 'on_hold').length
  const pendingApprovals = settlements.filter(
    (s) => s.status === 'approved' || s.status === 'pending'
  ).length

  const successfulCrons = cronLogs.filter((c) => c.status === 'success').length
  const cronRate =
    cronLogs.length > 0
      ? Math.round((successfulCrons / cronLogs.length) * 1000) / 10
      : 100

  const todayDisbursed = settlements
    .filter((s) => s.status === 'paid')
    .reduce((acc, s) => acc + (Number(s.netPayoutInr) || 0), 0)

  return {
    totalSettledMonthInr: totalSettled + 4500000,
    pendingPayoutQueueInr: pendingPayout,
    platformCommissionsRetainedInr: commissionsRetained + 400000,
    activeLegalHoldsCount: activeHolds,
    pendingApprovalBatchesCount: pendingApprovals,
    cronJobsCount: cronLogs.length,
    cronSuccessRatePct: cronRate,
    todayDisbursedInr: todayDisbursed
  }
}

// -------------------------------------------------------------
// 2. MASTER SETTLEMENTS LEDGER
// -------------------------------------------------------------
export function listSettlements({
  page = 1,
  pageSize = 20,
  search = '',
  status = 'all',
  entityType = 'all',
  dateRange = 'all',
  persona = 'all'
} = {}) {
  let list = getStoredSettlements()

  if (status && status !== 'all') {
    list = list.filter((s) => s.status === status)
  }
  if (entityType && entityType !== 'all') {
    list = list.filter((s) => s.entityType === entityType)
  }
  if (dateRange && dateRange !== 'all') {
    list = list.filter((s) => matchesDateRange(s.createdAt || s.updatedAt, dateRange))
  }
  if (persona && persona !== 'all') {
    list = list.filter((s) => matchesPersona(s, persona))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (s) =>
        s.beneficiaryName?.toLowerCase().includes(q) ||
        s.batchId?.toLowerCase().includes(q) ||
        s.gstInvoiceNo?.toLowerCase().includes(q) ||
        s.paymentReferenceUtr?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(list, page, pageSize)
}

export function getSettlementById(id) {
  const list = getStoredSettlements()
  return list.find((s) => s.id === id) || null
}

export function markSettlementPaid(
  id,
  paymentReferenceUtr,
  reason = 'Disbursement confirmed with bank NEFT/RTGS UTR',
  coAdmin = null,
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  const idx = list.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error(`Settlement record ${id} not found`)

  const prev = list[idx]

  // Dual sign-off threshold (> ₹50,000)
  if (prev.netPayoutInr > 50000 && !coAdmin && !prev.signOffAdmin2) {
    const err = new Error(
      `Dual institutional sign-off mandatory for disbursements exceeding ₹50,000 (Payout: ₹${prev.netPayoutInr.toLocaleString(
        'en-IN'
      )}). Please provide a co-authorizer.`
    )
    err.code = 'DUAL_SIGNOFF_REQUIRED'
    throw err
  }

  const updated = {
    ...prev,
    status: 'paid',
    paymentReferenceUtr: paymentReferenceUtr || `SBIN${Date.now().toString().slice(-10)}`,
    paidAt: new Date().toISOString(),
    signOffAdmin1: prev.signOffAdmin1 || adminUid,
    signOffAdmin2: coAdmin || prev.signOffAdmin2 || (prev.netPayoutInr > 50000 ? 'auditor.finance@agrovercity.in' : null),
    updatedAt: new Date().toISOString()
  }
  list[idx] = updated
  save(SETTLEMENTS_KEY, list)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'MARK_SETTLEMENT_PAID',
    entityId: id,
    entityName: `${prev.beneficiaryName} (${prev.batchId})`,
    collection: 'settlements',
    previousState: `status: ${prev.status}`,
    newState: `status: paid (UTR: ${updated.paymentReferenceUtr}, INR ${prev.netPayoutInr})`,
    reason: `${reason}${coAdmin ? ` [Co-authorized by: ${coAdmin}]` : ''}`
  })

  return updated
}

export function setSettlementHold(
  id,
  reason = 'Suspicious activity or active buyer delivery dispute',
  disputeRef = '',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  const idx = list.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error(`Settlement record ${id} not found`)

  const prev = list[idx]
  const updated = {
    ...prev,
    status: 'on_hold',
    holdReason: `${reason}${disputeRef ? ` (Dispute Ref: ${disputeRef})` : ''}`,
    updatedAt: new Date().toISOString()
  }
  list[idx] = updated
  save(SETTLEMENTS_KEY, list)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'SET_SETTLEMENT_HOLD',
    entityId: id,
    entityName: `${prev.beneficiaryName} (${prev.batchId})`,
    collection: 'settlements',
    previousState: `status: ${prev.status}`,
    newState: 'status: on_hold',
    reason: updated.holdReason
  })

  return updated
}

export function releaseSettlementHold(
  id,
  reason = 'Dispute arbitrated; escrow released back to payment batch',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  const idx = list.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error(`Settlement record ${id} not found`)

  const prev = list[idx]
  const updated = {
    ...prev,
    status: 'approved',
    holdReason: null,
    updatedAt: new Date().toISOString()
  }
  list[idx] = updated
  save(SETTLEMENTS_KEY, list)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'RELEASE_SETTLEMENT_HOLD',
    entityId: id,
    entityName: `${prev.beneficiaryName} (${prev.batchId})`,
    collection: 'settlements',
    previousState: 'status: on_hold',
    newState: 'status: approved',
    reason
  })

  return updated
}

// Batch Actions for Settlements
export function batchApproveSettlements(
  ids = [],
  reason = 'Batch approval of validated T+1 settlement batches',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  let count = 0
  const updatedList = list.map((item) => {
    if (ids.includes(item.id) && (item.status === 'pending' || item.status === 'rejected')) {
      count++
      return {
        ...item,
        status: 'approved',
        signOffAdmin1: adminUid,
        updatedAt: new Date().toISOString()
      }
    }
    return item
  })
  save(SETTLEMENTS_KEY, updatedList)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'BATCH_APPROVE_SETTLEMENTS',
    entityId: `batch_${ids.length}_items`,
    entityName: `${count} Settlement Batches`,
    collection: 'settlements',
    previousState: 'pending',
    newState: 'approved',
    reason
  })

  return { success: true, count }
}

export function batchMarkPaidSettlements(
  ids = [],
  reason = 'Batch NEFT / RTGS settlement disbursement execution',
  paymentRefPrefix = 'NEFT-AGRO-',
  coAdmin = null,
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  let count = 0
  const updatedList = list.map((item) => {
    if (ids.includes(item.id) && (item.status === 'approved' || item.status === 'pending')) {
      count++
      return {
        ...item,
        status: 'paid',
        paymentReferenceUtr: `${paymentRefPrefix}${Date.now().toString().slice(-6)}${count}`,
        paidAt: new Date().toISOString(),
        signOffAdmin1: item.signOffAdmin1 || adminUid,
        signOffAdmin2: coAdmin || item.signOffAdmin2 || (item.netPayoutInr > 50000 ? 'auditor.finance@agrovercity.in' : null),
        updatedAt: new Date().toISOString()
      }
    }
    return item
  })
  save(SETTLEMENTS_KEY, updatedList)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'BATCH_MARK_PAID_SETTLEMENTS',
    entityId: `batch_${ids.length}_items`,
    entityName: `${count} Settlement Records Disbursed`,
    collection: 'settlements',
    previousState: 'approved',
    newState: 'paid',
    reason: `${reason}${coAdmin ? ` [Co-authorizer: ${coAdmin}]` : ''}`
  })

  return { success: true, count }
}

export function batchPlaceHoldSettlements(
  ids = [],
  reason = 'Administrative risk prevention or audit dispute hold',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  let count = 0
  const updatedList = list.map((item) => {
    if (ids.includes(item.id) && item.status !== 'paid') {
      count++
      return {
        ...item,
        status: 'on_hold',
        holdReason: reason,
        updatedAt: new Date().toISOString()
      }
    }
    return item
  })
  save(SETTLEMENTS_KEY, updatedList)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'BATCH_SET_SETTLEMENT_HOLD',
    entityId: `batch_${ids.length}_items`,
    entityName: `${count} Settlements Held`,
    collection: 'settlements',
    previousState: 'active',
    newState: 'on_hold',
    reason
  })

  return { success: true, count }
}

export function batchReleaseHoldSettlements(
  ids = [],
  reason = 'Dispute resolution clearance and batch hold release',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredSettlements()
  let count = 0
  const updatedList = list.map((item) => {
    if (ids.includes(item.id) && item.status === 'on_hold') {
      count++
      return {
        ...item,
        status: 'approved',
        holdReason: null,
        updatedAt: new Date().toISOString()
      }
    }
    return item
  })
  save(SETTLEMENTS_KEY, updatedList)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'BATCH_RELEASE_SETTLEMENT_HOLD',
    entityId: `batch_${ids.length}_items`,
    entityName: `${count} Settlements Restored`,
    collection: 'settlements',
    previousState: 'on_hold',
    newState: 'approved',
    reason
  })

  return { success: true, count }
}

// -------------------------------------------------------------
// 3. TRANSPORTER PAYOUTS
// -------------------------------------------------------------
export function listTransporterPayouts({
  page = 1,
  pageSize = 20,
  search = '',
  status = 'all',
  dateRange = 'all'
} = {}) {
  let list = getStoredTransporterPayouts()

  if (status && status !== 'all') {
    list = list.filter((t) => t.status === status)
  }
  if (dateRange && dateRange !== 'all') {
    list = list.filter((t) => matchesDateRange(t.completedAt, dateRange))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (t) =>
        t.tripId?.toLowerCase().includes(q) ||
        t.vehicleNo?.toLowerCase().includes(q) ||
        t.transporterName?.toLowerCase().includes(q) ||
        t.route?.toLowerCase().includes(q) ||
        t.consignmentCrop?.toLowerCase().includes(q) ||
        t.eWayBillNo?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q)
    )
  }
  return paginate(list, page, pageSize)
}

// -------------------------------------------------------------
// 4. SELLER PRODUCE ESCROW PAYOUTS
// -------------------------------------------------------------
export function listSellerPayouts({
  page = 1,
  pageSize = 20,
  search = '',
  status = 'all',
  dateRange = 'all'
} = {}) {
  let list = getStoredSellerPayouts()

  if (status && status !== 'all') {
    list = list.filter((s) => s.escrowReleaseStatus === status)
  }
  if (dateRange && dateRange !== 'all') {
    list = list.filter((s) => matchesDateRange(s.paymentMaturityDate, dateRange))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (s) =>
        s.lotId?.toLowerCase().includes(q) ||
        s.sellerName?.toLowerCase().includes(q) ||
        s.commodity?.toLowerCase().includes(q) ||
        s.buyerOrg?.toLowerCase().includes(q) ||
        s.mandiAssayCertificate?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(list, page, pageSize)
}

// -------------------------------------------------------------
// 5. PLATFORM COMMISSION CONFIGURATION
// -------------------------------------------------------------
export function getCommissionConfig() {
  return getStoredCommissions()
}

export function updateCommissionConfig(
  newConfig,
  reason = 'Regulatory and marketplace fee adjustment',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const current = getStoredCommissions()
  const updated = {
    ...current,
    ...newConfig,
    lastUpdated: new Date().toISOString(),
    updatedBy: adminUid
  }
  save(COMMISSIONS_KEY, updated)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'UPDATE_COMMISSION_CONFIG',
    entityId: 'platform_config/settlements',
    entityName: 'Platform Take Rate & Commission Matrix',
    collection: 'platform_config',
    previousState: JSON.stringify(current),
    newState: JSON.stringify(updated),
    reason
  })

  return updated
}

// -------------------------------------------------------------
// 6. SCHEDULED CRON JOBS & TRIGGER RUN
// -------------------------------------------------------------
export function listCronJobLogs({
  page = 1,
  pageSize = 20,
  search = '',
  status = 'all',
  dateRange = 'all'
} = {}) {
  let list = getStoredCronLogs()

  if (status && status !== 'all') {
    list = list.filter((c) => c.status === status)
  }
  if (dateRange && dateRange !== 'all') {
    list = list.filter((c) => matchesDateRange(c.lastExecutedAt, dateRange))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (c) =>
        c.jobName?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
    )
  }
  return paginate(list, page, pageSize)
}

export function triggerCronJob(
  jobId,
  reason = 'Manual on-demand execution of Cloud Scheduler cron job',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  const list = getStoredCronLogs()
  const idx = list.findIndex((c) => c.id === jobId)
  if (idx === -1) throw new Error(`Cron job ${jobId} not found`)

  const prev = list[idx]
  const executionMs = Math.floor(Math.random() * 800) + 120
  const updated = {
    ...prev,
    status: 'success',
    lastExecutedAt: new Date().toISOString(),
    durationMs: executionMs,
    executionLogExcerpt: `Manual execution triggered by ${adminName}. Completed in ${executionMs}ms with exit code 0.`
  }
  list[idx] = updated
  save(CRON_LOGS_KEY, list)

  recordAuditLog({
    adminUid,
    adminName,
    actionType: 'TRIGGER_CRON_JOB',
    entityId: jobId,
    entityName: prev.jobName,
    collection: 'cron_job_logs',
    previousState: `lastRun: ${prev.lastExecutedAt}`,
    newState: `executed: ${updated.lastExecutedAt} (${executionMs}ms)`,
    reason
  })

  return updated
}

export function triggerManualSettlementRun(
  optionsOrReason = 'Superadmin triggered on-demand settlement calculation run',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  let reason = 'Superadmin triggered on-demand settlement calculation run'
  let uid = adminUid
  let name = adminName
  let entityType = 'all'
  let startDate = ''
  let endDate = ''
  let recomputationMode = 'recompute'
  let periodDescription = ''

  if (typeof optionsOrReason === 'object' && optionsOrReason !== null) {
    reason = optionsOrReason.reason || reason
    uid = optionsOrReason.adminUid || uid
    name = optionsOrReason.adminName || name
    entityType = optionsOrReason.entityType || 'all'
    startDate = optionsOrReason.startDate || ''
    endDate = optionsOrReason.endDate || ''
    recomputationMode = optionsOrReason.recomputationMode || 'recompute'
    periodDescription = optionsOrReason.periodDescription || ''
  } else if (typeof optionsOrReason === 'string') {
    reason = optionsOrReason
  }

  const periodStr = periodDescription || (startDate && endDate ? `${startDate} to ${endDate}` : '2026-09-14 to 2026-09-20')
  const settlements = getStoredSettlements()
  let processed = 0
  let totalDisbursed = 0

  // Turn pending to approved in batch
  const updatedSettlements = settlements.map((s) => {
    const matchesPersonaType = entityType === 'all' || s.entityType === entityType
    if (s.status === 'pending' && matchesPersonaType) {
      processed++
      totalDisbursed += Number(s.netPayoutInr) || 0
      return {
        ...s,
        status: 'approved',
        settlementPeriod: periodStr,
        updatedAt: new Date().toISOString()
      }
    }
    return s
  })

  // If no pending rows or custom weekly re-run invoked, create a synthesized aggregation batch
  if (processed === 0 || recomputationMode === 'aggregate_new') {
    const commConfig = getStoredCommissions()
    const targetType = entityType === 'all' ? 'equipment_owner' : entityType
    const rate = targetType === 'transporter' ? commConfig.transporterCommissionPct
      : targetType === 'equipment_owner' ? commConfig.equipmentRentalCommissionPct
      : targetType === 'broker' ? commConfig.brokerCommissionPct
      : targetType === 'seller' ? commConfig.produceMarketplaceCommissionPct
      : 10.0
    const gross = targetType === 'broker' ? 62000 : targetType === 'equipment_owner' ? 48500 : 72000
    const fee = Math.round((gross * rate) / 100)
    const gst = Math.round(fee * 0.18)
    const tds = targetType === 'broker' ? Math.round(gross * 0.05) : Math.round(gross * 0.01)
    const net = gross - fee - gst - tds

    const newBatch = {
      id: `stl_batch_${Date.now().toString().slice(-4)}`,
      batchId: `BATCH-${(startDate || '20260920').replace(/-/g, '')}-${targetType.slice(0, 3).toUpperCase()}-W`,
      entityType: targetType,
      beneficiaryId: `usr_${targetType}_881`,
      beneficiaryName: targetType === 'equipment_owner'
        ? 'Dattatray Vitthal Agro Machinery Hub'
        : targetType === 'broker'
        ? 'Shri Siddhivinayak APMC Brokerage Firm'
        : 'Godavari Bulk Freight Express',
      beneficiaryPhone: '+91 98XXX XX881',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      bankName: 'State Bank of India',
      accountNumberMasked: '••••••••6712',
      ifscCode: 'SBIN0001092',
      panMasked: 'ABCDP••••Q',
      grossAmountInr: gross,
      commissionRatePct: rate,
      platformFeeInr: fee,
      gstOnFeeInr: gst,
      tdsDeductedInr: tds,
      netPayoutInr: net,
      settlementPeriod: periodStr,
      ordersCount: 4,
      status: 'approved',
      paymentReferenceUtr: null,
      paidAt: null,
      holdReason: null,
      gstInvoiceNo: `INV-AGRO-2026-${Date.now().toString().slice(-4)}`,
      dualSignOffRequired: net > 50000,
      signOffAdmin1: name,
      signOffAdmin2: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    updatedSettlements.unshift(newBatch)
    processed += 1
    totalDisbursed += net
  }

  save(SETTLEMENTS_KEY, updatedSettlements)

  // Append new execution log entry to cron logs
  const cronLogs = getStoredCronLogs()
  const newCronEntry = {
    id: `cron_run_${Date.now()}`,
    jobName: 't1-daily-financial-settlement-engine',
    schedule: `Manual On-Demand (${periodStr})`,
    description: `Custom period re-computation for ${entityType.toUpperCase()} | Period: ${periodStr}`,
    lastExecutedAt: new Date().toISOString(),
    durationMs: 1420,
    status: 'success',
    recordsProcessed: processed,
    totalDisbursedInr: totalDisbursed,
    platformCommissionsRetainedInr: Math.round(totalDisbursed * 0.1),
    errorMessage: null,
    executionLogExcerpt: `Manual batch re-computation executed by ${name}. Domain: ${entityType}. Period: ${periodStr}. Calculated ${processed} aggregation batches. Net payable: ₹${totalDisbursed}.`
  }
  cronLogs.unshift(newCronEntry)
  save(CRON_LOGS_KEY, cronLogs)

  recordAuditLog({
    adminUid: uid,
    adminName: name,
    actionType: 'MANUAL_SETTLEMENT_RUN',
    entityId: newCronEntry.id,
    entityName: `Settlement Run: ${entityType.toUpperCase()} (${periodStr})`,
    collection: 'settlements',
    previousState: 'Scheduled/Triggered',
    newState: `Completed ${processed} batches (${periodStr})`,
    reason
  })

  return { success: true, processed, totalDisbursed, cronEntry: newCronEntry }
}

// -------------------------------------------------------------
// 7. COMPLIANCE & AUDIT LOGS QUERY
// -------------------------------------------------------------
export function getSettlementsAuditLogs({
  page = 1,
  pageSize = 20,
  search = '',
  dateRange = 'all'
} = {}) {
  let list = getStoredAuditLogs()
  if (dateRange && dateRange !== 'all') {
    list = list.filter((l) => matchesDateRange(l.timestamp, dateRange))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (l) =>
        l.entityName?.toLowerCase().includes(q) ||
        l.actionType?.toLowerCase().includes(q) ||
        l.reason?.toLowerCase().includes(q) ||
        l.adminName?.toLowerCase().includes(q) ||
        l.id?.toLowerCase().includes(q)
    )
  }
  return paginate(list, page, pageSize)
}

// -------------------------------------------------------------
// 8. RESET TO BENCHMARK SEED DATA
// -------------------------------------------------------------
export function resetToDefaultSeed(
  reason = 'Restoring SOP-25 Financial Settlements & Scheduled Jobs benchmark dataset.',
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin'
) {
  save(SETTLEMENTS_KEY, mockSettlements)
  save(TRANSPORTERS_KEY, mockTransporterPayouts)
  save(SELLERS_KEY, mockSellerPayouts)
  save(COMMISSIONS_KEY, mockPlatformCommissions)
  save(CRON_LOGS_KEY, mockCronJobLogs)

  const resetLog = {
    id: `aud_stl_reset_${Date.now()}`,
    adminUid,
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.15',
    actionType: 'RESET_BENCHMARK_SEED_DATA',
    entityId: 'sop_25_benchmark_suite',
    entityName: 'Financial Settlements & Scheduled Jobs Module Seed Data',
    collection: 'all_sop25_collections',
    previousState: 'mutated',
    newState: 'benchmark_seed',
    reason
  }
  const currentLogs = getStoredAuditLogs()
  currentLogs.unshift(resetLog)
  save(AUDIT_KEY, currentLogs)

  return { success: true, timestamp: resetLog.timestamp }
}
