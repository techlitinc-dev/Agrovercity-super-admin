import { request } from './client'
import {
  mockWomenShgs,
  mockShgDeposits,
  mockHomeEnterprises,
  mockShgSubsidies,
  mockWomenAuditLogs,
  mockWomenSummary
} from './womenShgMockData'

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
let shgsState = JSON.parse(JSON.stringify(mockWomenShgs))
let depositsState = JSON.parse(JSON.stringify(mockShgDeposits))
let enterprisesState = JSON.parse(JSON.stringify(mockHomeEnterprises))
let subsidiesState = JSON.parse(JSON.stringify(mockShgSubsidies))
let auditLogsState = JSON.parse(JSON.stringify(mockWomenAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_wom_${Date.now()}`,
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
    reason: reason || 'Routine women SHG program administrative action'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

// --- 1. KPI Summary ---
export async function getWomenShgSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/women/summary')
    } catch {
      mockMode = true
    }
  }

  const totalMembers = shgsState.reduce((acc, s) => acc + (s.membersCount || 0), 0)
  const totalCorpus = shgsState.reduce((acc, s) => acc + (s.savingsCorpusInr || 0), 0)
  const avgRecovery =
    shgsState.length > 0
      ? Math.round(
          (shgsState.reduce((acc, s) => acc + (s.recoveryRatePct || 0), 0) / shgsState.length) * 10
        ) / 10
      : 97.4
  const activeProducts = enterprisesState.filter((p) => p.status === 'approved').length
  const totalRevenue = enterprisesState.reduce((acc, p) => acc + (p.revenueGeneratedInr || 0), 0)
  const pendingQueue = shgsState.filter((s) => s.status === 'pending_verification').length
  const flagged = shgsState.filter((s) => s.status === 'flagged_audit').length

  return {
    totalActiveShgs: shgsState.length,
    totalMahilaKisanMembers: totalMembers,
    cumulativeSavingsCorpusInr: totalCorpus,
    averageLoanRecoveryRatePct: avgRecovery,
    activeStorefrontProducts: activeProducts,
    totalEnterpriseRevenueInr: totalRevenue,
    pendingVerificationShgs: pendingQueue,
    flaggedAuditAlerts: flagged
  }
}

// --- 2. Women Self Help Groups ---
export async function listWomenShgs(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', district = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/women/shgs', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...shgsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((s) => s.status === status)
  }
  if (district && district !== 'all') {
    filtered = filtered.filter((s) => s.district?.toLowerCase() === district.toLowerCase())
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.shgName?.toLowerCase().includes(q) ||
        s.presidentName?.toLowerCase().includes(q) ||
        s.district?.toLowerCase().includes(q) ||
        s.federationCluster?.toLowerCase().includes(q) ||
        s.bankName?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function verifyWomenShg(id, grantEligibility = 'eligible', reason = '', adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/women/shgs/${id}/verify`, { grantEligibility, reason })
    } catch {
      mockMode = true
    }
  }

  const shg = shgsState.find((s) => s.id === id)
  if (!shg) throw new Error('SHG not found')
  const prevStatus = shg.status
  shg.status = 'verified'
  shg.subventionEligibility = grantEligibility
  shg.verifiedBy = adminName
  shg.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'VERIFY_SHG_REGISTRATION',
    entityId: id,
    entityName: shg.shgName,
    collection: 'women_shgs',
    previousState: `status: ${prevStatus}`,
    newState: `status: verified, eligibility: ${grantEligibility}`,
    reason: reason || 'Approved SHG registration documents & bank account linkage',
    adminName
  })
  return shg
}

export async function suspendWomenShg(id, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/women/shgs/${id}/suspend`, { reason })
    } catch {
      mockMode = true
    }
  }

  const shg = shgsState.find((s) => s.id === id)
  if (!shg) throw new Error('SHG not found')
  const prevStatus = shg.status
  shg.status = 'suspended'
  shg.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'SUSPEND_SHG',
    entityId: id,
    entityName: shg.shgName,
    collection: 'women_shgs',
    previousState: `status: ${prevStatus}`,
    newState: 'status: suspended',
    reason: reason || 'SHG suspended due to financial or documentation compliance breach',
    adminName
  })
  return shg
}

// --- 3. Recurring Micro-Savings & Deposits ---
export async function listShgDeposits(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', shgId = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/women/deposits', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...depositsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((d) => d.status === status)
  }
  if (shgId && shgId !== 'all') {
    filtered = filtered.filter((d) => d.shgId === shgId)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (d) =>
        d.memberName?.toLowerCase().includes(q) ||
        d.shgName?.toLowerCase().includes(q) ||
        d.depositMonth?.toLowerCase().includes(q) ||
        d.paymentMode?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function recordShgDeposit(payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', '/v1/admin/women/deposits', payload)
    } catch {
      mockMode = true
    }
  }

  // Enforce duplicate deposit month check per SOP 24 (test_duplicate_deposit_month_409)
  const isDuplicate = depositsState.some(
    (d) =>
      d.shgId === payload.shgId &&
      d.memberId === payload.memberId &&
      d.depositMonth === payload.depositMonth &&
      d.status !== 'flagged_discrepancy'
  )
  if (isDuplicate) {
    throw new Error(
      `Duplicate deposit rejected: A recurring deposit for member ${payload.memberName || payload.memberId} for month ${payload.depositMonth} is already cleared.`
    )
  }

  const newDeposit = {
    id: `shg_dep_${Date.now()}`,
    ...payload,
    amountInr: Number(payload.amountInr || 500),
    penaltyLateInr: Number(payload.penaltyLateInr || 0),
    internalLoanRepaymentInr: Number(payload.internalLoanRepaymentInr || 0),
    internalInterestPaidInr: Number(payload.internalInterestPaidInr || 0),
    status: payload.status || 'cleared',
    recordedBy: `Admin override by ${adminName}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  depositsState.unshift(newDeposit)

  // Increment SHG savings corpus
  const shg = shgsState.find((s) => s.id === payload.shgId)
  if (shg) {
    shg.savingsCorpusInr = (shg.savingsCorpusInr || 0) + newDeposit.amountInr + newDeposit.internalInterestPaidInr
    if (newDeposit.internalLoanRepaymentInr > 0) {
      shg.internalLoanOutstandInr = Math.max(0, (shg.internalLoanOutstandInr || 0) - newDeposit.internalLoanRepaymentInr)
    }
  }

  recordAudit({
    actionType: 'RECORD_SHG_DEPOSIT',
    entityId: newDeposit.id,
    entityName: `${newDeposit.memberName} (${newDeposit.shgName})`,
    collection: 'shg_deposits',
    previousState: null,
    newState: `amount: ₹${newDeposit.amountInr}, month: ${newDeposit.depositMonth}`,
    reason: 'Manual administrative deposit reconciliation into SHG micro-savings ledger',
    adminName
  })
  return newDeposit
}

// --- 4. Home Enterprises Storefront Marketplace ---
export async function listHomeEnterprises(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', category = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/women/enterprise-products', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...enterprisesState]
  if (status && status !== 'all') {
    filtered = filtered.filter((e) => e.status === status)
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((e) => e.category?.toLowerCase() === category.toLowerCase())
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.productTitle?.toLowerCase().includes(q) ||
        e.artisanName?.toLowerCase().includes(q) ||
        e.shgName?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.fssaiRegistration?.toLowerCase().includes(q) ||
        e.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function curateEnterpriseProduct(id, status, curationNotes, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/women/enterprise-products/${id}/curate`, {
        status,
        curationNotes,
        reason
      })
    } catch {
      mockMode = true
    }
  }

  const prod = enterprisesState.find((p) => p.id === id)
  if (!prod) throw new Error('Product not found')
  const prevStatus = prod.status
  prod.status = status
  if (curationNotes) prod.curationNotes = curationNotes
  prod.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'CURATE_STOREFRONT_PRODUCT',
    entityId: id,
    entityName: `${prod.productTitle} (${prod.shgName})`,
    collection: 'home_enterprises',
    previousState: `status: ${prevStatus}`,
    newState: `status: ${status}`,
    reason: reason || 'Product curated for Agro-processing marketplace showcase',
    adminName
  })
  return prod
}

// --- 5. Interest Subvention Subsidies & NRLM Grants ---
export async function listShgSubsidies(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/women/subsidies', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...subsidiesState]
  if (status && status !== 'all') {
    filtered = filtered.filter((s) => s.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.shgName?.toLowerCase().includes(q) ||
        s.schemeName?.toLowerCase().includes(q) ||
        s.grantType?.toLowerCase().includes(q) ||
        s.bankReferenceUtr?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function disburseSubventionSubsidy(id, reason, coAdmin = null, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/women/subsidies/${id}/disburse`, { reason, coAdmin })
    } catch {
      mockMode = true
    }
  }

  const sub = subsidiesState.find((s) => s.id === id)
  if (!sub) throw new Error('Subsidy record not found')

  const prevStatus = sub.status
  sub.status = 'disbursed'
  sub.disbursedDate = new Date().toISOString().split('T')[0]
  sub.bankReferenceUtr = sub.bankReferenceUtr || `PUNB2609${Math.floor(100000 + Math.random() * 900000)}`
  sub.signOffAdmin1 = adminName
  if (coAdmin) {
    sub.signOffAdmin2 = coAdmin.secondAdminEmail
  }
  sub.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: sub.amountInr > 50000 ? 'DUAL_SIGNOFF_SUBSIDY_DISBURSE' : 'DISBURSE_SUBSIDY',
    entityId: id,
    entityName: `${sub.schemeName} (${sub.shgName})`,
    collection: 'shg_subsidies',
    previousState: `status: ${prevStatus}`,
    newState: `status: disbursed, amount: ₹${sub.amountInr}${coAdmin ? ` (Co-admin: ${coAdmin.secondAdminEmail})` : ''}`,
    reason: reason || 'Disbursed interest subvention / NRLM grant to SHG bank account',
    adminName
  })
  return sub
}

// --- 6. Audit Logs ---
export async function getWomenAuditLogs(query = {}) {
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
