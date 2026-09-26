// Admin Banking, Credit Score & Microfinance Service for AGROVERCITY Superadmin
// Implements Module 14: Banking, Credit Score & Microfinance (SOP-14)
// Target Collections: bank_accounts, loan_applications, kcc_records, audit_logs

import {
  mockBankAccounts,
  mockLoanApplications,
  mockKccRecords,
  mockCreditScoreModel,
  mockRepaymentMilestones,
  mockBankingSummary
} from '../api/mockData'

const ACCOUNTS_STORAGE_KEY = 'agrovercity_superadmin_bank_accounts'
const LOANS_STORAGE_KEY = 'agrovercity_superadmin_loan_applications'
const KCC_STORAGE_KEY = 'agrovercity_superadmin_kcc_records'
const MODEL_STORAGE_KEY = 'agrovercity_superadmin_credit_score_model'
const REPAYMENTS_STORAGE_KEY = 'agrovercity_superadmin_repayment_milestones'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs'

export const INITIAL_BANKING_AUDIT_LOGS = [
  {
    id: 'AUD-1401',
    adminUid: 'root@agrovercity',
    action: 'PENNY_DROP_OVERRIDDEN',
    targetUserId: 'acc_1003',
    targetUserName: 'Mahadev Shinde (Bank of Baroda)',
    previousState: 'Status: failed (NPCI name mismatch - SHINDE MAHADEV vs Mahadev R. Shinde)',
    newState: 'Status: verified (manualOverride)',
    reason: 'Verified passbook scan and cancelled cheque matching farmer KYC Aadhaar.',
    timestamp: '2026-09-24T10:15:00.000Z',
    ipAddress: '14.139.122.45'
  },
  {
    id: 'AUD-1402',
    adminUid: 'root@agrovercity',
    action: 'LOAN_UNDERWRITTEN_APPROVED',
    targetUserId: 'loan_1001',
    targetUserName: 'Ramchandra Patil (₹75,000 Micro-Loan)',
    previousState: 'Status: in_review, DualSignOff: pending',
    newState: 'Status: approved, DualSignOff: completed (risk_head@agrovercity)',
    reason: 'Credit score 765 (Tier A - Gold), land title cleared, dual sign-off executed for loan > ₹50,000.',
    timestamp: '2026-09-23T14:30:00.000Z',
    ipAddress: '14.139.122.12'
  },
  {
    id: 'AUD-1403',
    adminUid: 'root@agrovercity',
    action: 'KCC_LIMIT_ADJUSTED',
    targetUserId: 'kcc_1002',
    targetUserName: 'Suresh Jadhav (Card: XXXX-XXXX-8921)',
    previousState: 'Limit: ₹1,80,000, Available: ₹42,000',
    newState: 'Limit: ₹2,20,000, Available: ₹82,000',
    reason: 'Annual revision based on sugarcane crop acreage expansion and 100% prompt repayment incentive.',
    timestamp: '2026-09-22T09:20:00.000Z',
    ipAddress: '14.139.122.18'
  },
  {
    id: 'AUD-1404',
    adminUid: 'root@agrovercity',
    action: 'DPDP_MASKING_AUDITED',
    targetUserId: 'PORTFOLIO_SYSTEM',
    targetUserName: 'All 1,420 Registered Accounts',
    previousState: 'Compliance Check: Scheduled',
    newState: 'Compliance: 100% Masked (Zero unmasked Aadhaar / full account numbers)',
    reason: 'Statutory DPDP Act 2023 automated masking audit sweep executed.',
    timestamp: '2026-09-21T16:00:00.000Z',
    ipAddress: '14.139.122.3'
  },
  {
    id: 'AUD-1405',
    adminUid: 'root@agrovercity',
    action: 'CREDIT_MODEL_CALIBRATED',
    targetUserId: 'MODEL_v4.2',
    targetUserName: 'Kisan Credit Score Model Weights',
    previousState: 'Mandi Consistency: 20%, Landholding: 25%',
    newState: 'Mandi Consistency: 22%, Landholding: 23%',
    reason: 'Recalibrated weightings to favor verified e-mandi transaction track record over unencumbered land size.',
    timestamp: '2026-09-20T11:00:00.000Z',
    ipAddress: '14.139.122.9'
  }
]

function getStored(key, defaultVal) {
  try {
    const data = localStorage.getItem(key)
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal))
      return JSON.parse(JSON.stringify(defaultVal))
    }
    return JSON.parse(data)
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e)
    return JSON.parse(JSON.stringify(defaultVal))
  }
}

function save(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e)
  }
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY)
  if (!data) {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_BANKING_AUDIT_LOGS))
    return [...INITIAL_BANKING_AUDIT_LOGS]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_BANKING_AUDIT_LOGS))
      return [...INITIAL_BANKING_AUDIT_LOGS]
    }
    return parsed
  } catch (e) {
    return [...INITIAL_BANKING_AUDIT_LOGS]
  }
}

function recordAuditLog({
  adminUid = 'root@agrovercity',
  action,
  targetUserId,
  targetUserName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'N/A',
    targetUserName: targetUserName || 'N/A',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Administrative action logged.',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1)
  }

  const updatedLogs = [newLog, ...logs]
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs))
  return newLog
}

function paginateItems(items, page = 1, pageSize = 20) {
  const total = items.length
  const startIndex = (page - 1) * pageSize
  return {
    data: items.slice(startIndex, startIndex + pageSize),
    page: Number(page),
    pageSize: Number(pageSize),
    total,
    totalPages: Math.ceil(total / pageSize) || 1
  }
}

export const adminBankingService = {
  // 1. Get Banking Summary KPIs
  async getBankingSummary() {
    await new Promise((r) => setTimeout(r, 60))
    const accounts = getStored(ACCOUNTS_STORAGE_KEY, mockBankAccounts)
    const loans = getStored(LOANS_STORAGE_KEY, mockLoanApplications)
    const kccs = getStored(KCC_STORAGE_KEY, mockKccRecords)
    const repayments = getStored(REPAYMENTS_STORAGE_KEY, mockRepaymentMilestones)

    const totalBankAccounts = accounts.length
    const verifiedAccounts = accounts.filter((a) => a.verificationStatus === 'verified').length
    const pendingPennyDropAccounts = accounts.filter((a) => a.verificationStatus === 'pending').length
    const flaggedFailures = accounts.filter((a) => a.verificationStatus === 'failed').length
    const pennyDropSuccessRate = totalBankAccounts > 0
      ? Number(((verifiedAccounts / totalBankAccounts) * 100).toFixed(1))
      : 94.2

    const pendingLoans = loans.filter((l) => ['submitted', 'in_review'].includes(l.status))
    const underwritingQueueCount = pendingLoans.length
    const underwritingQueueVolume = pendingLoans.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

    const activeKccPortfolioLimit = kccs.reduce((acc, curr) => acc + (Number(curr.kccLimit) || 0), 0)
    const totalAvailable = kccs.reduce((acc, curr) => acc + (Number(curr.availableLimit) || 0), 0)
    const totalUtilized = Math.max(0, activeKccPortfolioLimit - totalAvailable)
    const kccUtilizationRate = activeKccPortfolioLimit > 0
      ? Number(((totalUtilized / activeKccPortfolioLimit) * 100).toFixed(1))
      : 68.4

    const npaRiskCount = repayments.filter(
      (r) => r.riskLevel === 'high' || r.riskLevel === 'critical' || r.status === 'overdue'
    ).length

    return {
      ...mockBankingSummary,
      totalBankAccounts,
      verifiedAccounts,
      pennyDropSuccessRate,
      pendingPennyDropAccounts,
      flaggedFailures,
      totalLoanApplications: loans.length,
      underwritingQueueCount,
      underwritingQueueVolume,
      activeKccPortfolioLimit,
      kccUtilizationRate,
      npaRiskCount,
      dpdpAuditComplianceRate: 100
    }
  },

  // 2. List Bank Accounts with filtering and pagination
  async listBankAccounts({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    accountType = 'all',
    from = '',
    to = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let accounts = getStored(ACCOUNTS_STORAGE_KEY, mockBankAccounts)

    if (status !== 'all') {
      accounts = accounts.filter((a) => a.verificationStatus === status)
    }
    if (accountType !== 'all') {
      accounts = accounts.filter((a) => a.accountType === accountType)
    }
    if (from) {
      accounts = accounts.filter((a) => (a.createdAt || '').slice(0, 10) >= from)
    }
    if (to) {
      accounts = accounts.filter((a) => (a.createdAt || '').slice(0, 10) <= to)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      accounts = accounts.filter((item) =>
        [
          item.id,
          item.farmerName,
          item.farmerPhone,
          item.bankName,
          item.branchName,
          item.ifsc,
          item.accountNumberMasked,
          item.district,
          item.pennyDropRef
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(accounts, page, pageSize)
  },

  // 3. Override Penny-Drop Verification
  async overrideVerifyAccount(id, { reason, adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative reason (min 4 characters) is required to override penny-drop verification.')
    }
    const accounts = getStored(ACCOUNTS_STORAGE_KEY, mockBankAccounts)
    const idx = accounts.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Bank account not found')
    const acc = accounts[idx]
    const prevStatus = `${acc.verificationStatus} (${acc.failureReason || 'N/A'})`

    const updated = {
      ...acc,
      verificationStatus: 'verified',
      verificationMethod: 'manualOverride',
      overrideVerifiedBy: adminUid,
      overrideReason: reason.trim(),
      pennyDropRef: `MAN-OVR-${acc.accountLast4 || '0000'}`,
      pennyDropAmount: 1.0,
      pennyDropTimestamp: new Date().toISOString(),
      failureReason: null,
      updatedAt: new Date().toISOString()
    }
    accounts[idx] = updated
    save(ACCOUNTS_STORAGE_KEY, accounts)

    recordAuditLog({
      adminUid,
      action: 'PENNY_DROP_OVERRIDDEN',
      targetUserId: acc.id,
      targetUserName: `${acc.farmerName} (${acc.bankName})`,
      previousState: `Status: ${prevStatus}`,
      newState: 'Status: verified (manualOverride)',
      reason: reason.trim()
    })

    return updated
  },

  // 4. Designate Primary Payout Account
  async setPrimaryAccount(id, { reason = 'Designated primary payout account by admin', adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    const accounts = getStored(ACCOUNTS_STORAGE_KEY, mockBankAccounts)
    const idx = accounts.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Bank account not found')
    const target = accounts[idx]

    accounts.forEach((a) => {
      if (a.userId === target.userId) {
        a.isPrimary = a.id === id
        a.updatedAt = new Date().toISOString()
      }
    })
    save(ACCOUNTS_STORAGE_KEY, accounts)

    recordAuditLog({
      adminUid,
      action: 'PRIMARY_ACCOUNT_DESIGNATED',
      targetUserId: target.id,
      targetUserName: `${target.farmerName} (${target.bankName} ${target.accountNumberMasked})`,
      previousState: 'Previous primary status updated',
      newState: 'Primary Payout Account: Active',
      reason: reason.trim()
    })

    return { success: true, primaryId: id, userId: target.userId }
  },

  // 5. Audit Masking Compliance (DPDP Act 2023)
  async auditMaskingCompliance({ adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 150))
    const accounts = getStored(ACCOUNTS_STORAGE_KEY, mockBankAccounts)
    const nonCompliant = accounts.filter(
      (a) => !a.accountNumberMasked || a.accountNumberMasked.length < 8 || !a.accountNumberMasked.startsWith('XXXX')
    )
    const passedCount = accounts.length - nonCompliant.length
    const isCompliant = nonCompliant.length === 0

    recordAuditLog({
      adminUid,
      action: 'DPDP_MASKING_AUDITED',
      targetUserId: 'PORTFOLIO_SYSTEM',
      targetUserName: `All ${accounts.length} Bank Accounts`,
      previousState: 'Compliance check initiated',
      newState: isCompliant ? '100% Masked (Zero leaks detected)' : `${nonCompliant.length} leaks identified`,
      reason: 'DPDP Act 2023 §4 data privacy audit: Masked account numbers (XXXX+last4) and masked Aadhaar numbers.'
    })

    return {
      compliant: isCompliant,
      totalAudited: accounts.length,
      passedCount,
      leaksDetected: nonCompliant.length,
      rule: 'DPDP Act 2023: Bank account numbers must mask all digits except last-4 (XXXX + last4). Aadhaar must be XXXX-XXXX-1234.',
      timestamp: new Date().toISOString()
    }
  },

  // 6. List Loan Applications
  async listLoanApplications({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    partnerBank = 'all',
    creditTier = 'all',
    from = '',
    to = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let loans = getStored(LOANS_STORAGE_KEY, mockLoanApplications)

    if (status !== 'all') {
      loans = loans.filter((l) => l.status === status)
    }
    if (partnerBank !== 'all') {
      loans = loans.filter((l) => l.partnerBank === partnerBank)
    }
    if (creditTier !== 'all') {
      loans = loans.filter((l) => l.creditTier === creditTier)
    }
    if (from) {
      loans = loans.filter((l) => (l.createdAt || '').slice(0, 10) >= from)
    }
    if (to) {
      loans = loans.filter((l) => (l.createdAt || '').slice(0, 10) <= to)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      loans = loans.filter((item) =>
        [
          item.id,
          item.applicationId,
          item.farmerName,
          item.farmerPhone,
          item.district,
          item.purpose,
          item.partnerBank,
          item.creditTier
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(loans, page, pageSize)
  },

  // 7. Update Loan Underwriting Status (enforces dual sign-off > ₹50,000)
  async updateLoanStatus(id, {
    status,
    partnerBank,
    partnerBankBranch,
    notes = '',
    reason = '',
    dualSignOffAdmin = null,
    adminUid = 'root@agrovercity'
  } = {}) {
    await new Promise((r) => setTimeout(r, 140))
    const loans = getStored(LOANS_STORAGE_KEY, mockLoanApplications)
    const idx = loans.findIndex((l) => l.id === id || l.applicationId === id)
    if (idx === -1) throw new Error('Loan application not found')
    const loan = loans[idx]
    const nextStatus = status || loan.status
    const isApprovedOrDisbursed = ['approved', 'disbursed'].includes(nextStatus)

    // Dual sign-off enforcement if > ₹50,000 per SOP-14 §6.3
    if (loan.amount > 50000 && isApprovedOrDisbursed && !dualSignOffAdmin && !loan.dualSignOffAdmin) {
      throw new Error(
        'Dual sign-off mandated by SOP-14 §6.3 for loan facilities exceeding ₹50,000. Second admin credentials required.'
      )
    }

    const prevStatus = `Status: ${loan.status}, Bank: ${loan.partnerBank}`
    const updated = {
      ...loan,
      status: nextStatus,
      partnerBank: partnerBank || loan.partnerBank,
      partnerBankBranch: partnerBankBranch || loan.partnerBankBranch,
      underwriterAdmin: adminUid,
      underwritingNotes: notes ? `${loan.underwritingNotes || ''} | [Admin Note]: ${notes}` : loan.underwritingNotes,
      dualSignOffAdmin: dualSignOffAdmin || loan.dualSignOffAdmin,
      rejectionReason: nextStatus === 'rejected' ? (reason || 'Underwriting criteria not satisfied') : null,
      approvedAt: nextStatus === 'approved' ? new Date().toISOString() : loan.approvedAt,
      disbursedAt: nextStatus === 'disbursed' ? new Date().toISOString() : loan.disbursedAt,
      updatedAt: new Date().toISOString()
    }
    loans[idx] = updated
    save(LOANS_STORAGE_KEY, loans)

    const actionName =
      nextStatus === 'approved'
        ? 'LOAN_UNDERWRITTEN_APPROVED'
        : nextStatus === 'rejected'
        ? 'LOAN_REJECTED'
        : nextStatus === 'disbursed'
        ? 'LOAN_DISBURSED'
        : 'LOAN_STATUS_UPDATED'

    recordAuditLog({
      adminUid,
      action: actionName,
      targetUserId: loan.applicationId || loan.id,
      targetUserName: `${loan.farmerName} (₹${loan.amount.toLocaleString('en-IN')} - ${loan.purpose})`,
      previousState: prevStatus,
      newState: `Status: ${nextStatus}, Partner: ${updated.partnerBank}${
        updated.dualSignOffAdmin ? ` (Dual-Sign: ${updated.dualSignOffAdmin})` : ''
      }`,
      reason: reason || notes || `Loan status transitioned to ${nextStatus}.`
    })

    return updated
  },

  // 8. List KCC Records
  async listKccRecords({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    repaymentStatus = 'all',
    bankName = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let kccs = getStored(KCC_STORAGE_KEY, mockKccRecords)

    if (status !== 'all') {
      kccs = kccs.filter((k) => k.status === status)
    }
    if (repaymentStatus !== 'all') {
      kccs = kccs.filter((k) => k.repaymentStatus === repaymentStatus)
    }
    if (bankName !== 'all') {
      kccs = kccs.filter((k) => k.bankName === bankName)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      kccs = kccs.filter((item) =>
        [
          item.id,
          item.farmerName,
          item.farmerPhone,
          item.district,
          item.bankName,
          item.cardNumberMasked,
          item.cropSeason
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(kccs, page, pageSize)
  },

  // 9. Update KCC Limit
  async updateKccLimit(id, { newLimit, reason = '', adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const kccs = getStored(KCC_STORAGE_KEY, mockKccRecords)
    const idx = kccs.findIndex((k) => k.id === id)
    if (idx === -1) throw new Error('KCC record not found')
    const rec = kccs[idx]
    const prevLimit = rec.kccLimit
    const targetLimit = Number(newLimit || rec.kccLimit)
    const diff = targetLimit - prevLimit

    const updated = {
      ...rec,
      kccLimit: targetLimit,
      availableLimit: Math.max(0, (rec.availableLimit || 0) + diff),
      lastAuditDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    kccs[idx] = updated
    save(KCC_STORAGE_KEY, kccs)

    recordAuditLog({
      adminUid,
      action: 'KCC_LIMIT_ADJUSTED',
      targetUserId: rec.id,
      targetUserName: `${rec.farmerName} (${rec.cardNumberMasked})`,
      previousState: `Limit: ₹${prevLimit.toLocaleString('en-IN')}`,
      newState: `Limit: ₹${targetLimit.toLocaleString('en-IN')}`,
      reason: reason || 'KCC credit limit recalibrated based on scale of finance.'
    })

    return updated
  },

  // 10. Credit Score Model & Factors
  async getCreditScoreModel() {
    await new Promise((r) => setTimeout(r, 60))
    return getStored(MODEL_STORAGE_KEY, mockCreditScoreModel)
  },

  async updateCreditScoreModel({ scoringFactors, tiers, adminUid = 'root@agrovercity', reason = '' } = {}) {
    await new Promise((r) => setTimeout(r, 140))
    const model = getStored(MODEL_STORAGE_KEY, mockCreditScoreModel)
    if (scoringFactors) {
      model.scoringFactors = scoringFactors
    }
    if (tiers) {
      model.tiers = tiers
    }
    model.lastCalibratedAt = new Date().toISOString()
    model.calibratedBy = adminUid
    model.version = `v4.3-${new Date().getFullYear()}`
    save(MODEL_STORAGE_KEY, model)

    recordAuditLog({
      adminUid,
      action: 'CREDIT_MODEL_CALIBRATED',
      targetUserId: model.version,
      targetUserName: 'Kisan Credit Score Model Weights',
      previousState: 'Previous algorithmic weights updated',
      newState: `Calibrated by ${adminUid} (${model.version})`,
      reason: reason || 'Algorithmic scoring weights calibrated.'
    })

    return model
  },

  // 11. Calculate Loan EMI
  calculateLoanEmi({ amount = 50000, interestRate = 7.0, tenureMonths = 12, subventionRate = 0 } = {}) {
    const p = Number(amount)
    const rate = Number(interestRate)
    const tenure = Number(tenureMonths)
    const subvention = Number(subventionRate)
    const effectiveRate = Math.max(0, rate - subvention)

    const r = effectiveRate / 12 / 100
    let emi = 0
    if (r === 0) {
      emi = Math.round(p / tenure)
    } else {
      emi = Math.round((p * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1))
    }
    const totalPayable = emi * tenure
    const totalInterest = Math.max(0, totalPayable - p)

    return {
      amount: p,
      standardRate: rate,
      subventionRate: subvention,
      effectiveRate,
      tenureMonths: tenure,
      emi,
      totalInterest,
      totalPayable
    }
  },

  // 12. List Repayments & Default Risk Tracking
  async listRepaymentMilestones({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    riskLevel = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let repayments = getStored(REPAYMENTS_STORAGE_KEY, mockRepaymentMilestones)

    if (status !== 'all') {
      repayments = repayments.filter((r) => r.status === status)
    }
    if (riskLevel !== 'all') {
      repayments = repayments.filter((r) => r.riskLevel === riskLevel)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      repayments = repayments.filter((item) =>
        [
          item.id,
          item.loanId,
          item.farmerName,
          item.farmerPhone,
          item.district,
          item.bankName,
          item.actionRequired
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(repayments, page, pageSize)
  },

  // 13. List Banking & Statutory Audit Logs
  async listBankingAuditLogs({
    page = 1,
    pageSize = 20,
    q = '',
    action = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let logs = getStoredAuditLogs()

    // Filter to banking relevant or all audit logs
    const bankingActions = [
      'PENNY_DROP_OVERRIDDEN',
      'PRIMARY_ACCOUNT_DESIGNATED',
      'DPDP_MASKING_AUDITED',
      'LOAN_UNDERWRITTEN_APPROVED',
      'LOAN_REJECTED',
      'LOAN_DISBURSED',
      'LOAN_STATUS_UPDATED',
      'KCC_LIMIT_ADJUSTED',
      'CREDIT_MODEL_CALIBRATED'
    ]

    // Keep banking actions or general logs
    logs = logs.filter((log) => bankingActions.includes(log.action) || log.id.startsWith('AUD-14'))

    if (action !== 'all') {
      logs = logs.filter((l) => l.action === action)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      logs = logs.filter((l) =>
        [l.id, l.adminUid, l.targetUserId, l.targetUserName, l.reason, l.previousState, l.newState]
          .some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(logs, page, pageSize)
  },

  // 14. Reset to Default Seed Data
  async resetToDefaultSeed() {
    await new Promise((r) => setTimeout(r, 200))
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY)
    localStorage.removeItem(LOANS_STORAGE_KEY)
    localStorage.removeItem(KCC_STORAGE_KEY)
    localStorage.removeItem(MODEL_STORAGE_KEY)
    localStorage.removeItem(REPAYMENTS_STORAGE_KEY)

    // Prepend initial banking logs to audit storage
    const existing = getStoredAuditLogs().filter((l) => !l.id.startsWith('AUD-14'))
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([...INITIAL_BANKING_AUDIT_LOGS, ...existing]))

    return { success: true, message: 'Banking, credit score, and loan seed data successfully restored.' }
  }
}
