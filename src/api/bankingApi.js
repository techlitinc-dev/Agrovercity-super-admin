import { request } from './client'
import {
  mockBankAccounts,
  mockLoanApplications,
  mockKccRecords,
  mockCreditScoreModel,
  mockRepaymentMilestones,
  mockBankingSummary
} from './mockData'

let mockMode = false

function paginate(list, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length,
  }
}

function filterAccounts({ q = '', status = 'all', accountType = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.verificationStatus !== status) return false
    if (accountType !== 'all' && item.accountType !== accountType) return false
    if (from && item.createdAt < from) return false
    if (to && item.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
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
  })
}

function filterLoans({ q = '', status = 'all', partnerBank = 'all', creditTier = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (partnerBank !== 'all' && item.partnerBank !== partnerBank) return false
    if (creditTier !== 'all' && item.creditTier !== creditTier) return false
    if (from && item.createdAt < from) return false
    if (to && item.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.applicationId,
      item.farmerName,
      item.farmerPhone,
      item.district,
      item.purpose,
      item.partnerBank,
      item.creditTier
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterKcc({ q = '', status = 'all', repaymentStatus = 'all', bankName = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (repaymentStatus !== 'all' && item.repaymentStatus !== repaymentStatus) return false
    if (bankName !== 'all' && item.bankName !== bankName) return false
    if (!needle) return true

    return [
      item.id,
      item.farmerName,
      item.farmerPhone,
      item.district,
      item.bankName,
      item.cardNumberMasked,
      item.cropSeason
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterRepayments({ q = '', status = 'all', riskLevel = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (riskLevel !== 'all' && item.riskLevel !== riskLevel) return false
    if (!needle) return true

    return [
      item.id,
      item.loanId,
      item.farmerName,
      item.farmerPhone,
      item.district,
      item.bankName,
      item.actionRequired
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 140))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // 1. Summary KPIs
  if (method === 'GET' && pathname === '/admin/finance/summary') {
    const verifiedCount = mockBankAccounts.filter((a) => a.verificationStatus === 'verified').length
    const pendingReview = mockLoanApplications.filter((l) => ['submitted', 'in_review'].includes(l.status)).length
    const flaggedFailures = mockBankAccounts.filter((a) => a.verificationStatus === 'failed').length
    const pendingAccounts = mockBankAccounts.filter((a) => a.verificationStatus === 'pending').length

    return {
      ...mockBankingSummary,
      verifiedAccounts: verifiedCount,
      pendingReviewQueue: pendingReview,
      flaggedFailures: flaggedFailures,
      pendingPennyDropAccounts: pendingAccounts
    }
  }

  // 2. List Bank Accounts
  if (method === 'GET' && pathname === '/admin/finance/accounts') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const accountType = params.get('accountType') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterAccounts({ q, status, accountType, from, to }, mockBankAccounts)
    return paginate(filtered, page, pageSize)
  }

  // 3. Manual penny-drop override verification
  const overrideMatch = pathname.match(/^\/admin\/finance\/accounts\/([^/]+)\/override-verify$/)
  if (method === 'POST' && overrideMatch) {
    const id = overrideMatch[1]
    const idx = mockBankAccounts.findIndex((a) => a.id === id)
    if (idx === -1) {
      throw Object.assign(new Error('Bank account not found'), { status: 404 })
    }
    const acc = mockBankAccounts[idx]
    const updated = {
      ...acc,
      verificationStatus: 'verified',
      verificationMethod: 'manualOverride',
      overrideVerifiedBy: body?.adminUid || 'root@agrovercity',
      overrideReason: body?.reason || 'Verified via Passbook / Branch confirmation',
      pennyDropRef: `MAN-OVR-${acc.accountLast4 || '0000'}`,
      pennyDropAmount: 1.0,
      pennyDropTimestamp: new Date().toISOString(),
      failureReason: null,
      updatedAt: new Date().toISOString()
    }
    mockBankAccounts[idx] = updated
    return updated
  }

  // 4. Set as primary payout account
  const primaryMatch = pathname.match(/^\/admin\/finance\/accounts\/([^/]+)\/set-primary$/)
  if (method === 'POST' && primaryMatch) {
    const id = primaryMatch[1]
    const idx = mockBankAccounts.findIndex((a) => a.id === id)
    if (idx === -1) {
      throw Object.assign(new Error('Bank account not found'), { status: 404 })
    }
    const target = mockBankAccounts[idx]
    mockBankAccounts.forEach((a) => {
      if (a.userId === target.userId) {
        a.isPrimary = a.id === id
        a.updatedAt = new Date().toISOString()
      }
    })
    return { success: true, primaryId: id, userId: target.userId }
  }

  // 5. Audit Masking Compliance (DPDP Act Check)
  if (method === 'POST' && pathname === '/admin/finance/accounts/audit-masking') {
    const nonCompliant = mockBankAccounts.filter(
      (a) => !a.accountNumberMasked || a.accountNumberMasked.length < 8 || !a.accountNumberMasked.startsWith('XXXX')
    )
    return {
      compliant: nonCompliant.length === 0,
      totalAudited: mockBankAccounts.length,
      passedCount: mockBankAccounts.length - nonCompliant.length,
      leaksDetected: nonCompliant.length,
      rule: 'DPDP Act 2023: Bank account numbers must mask all digits except last-4 (XXXX + last4). Aadhaar must be XXXX-XXXX-1234.',
      timestamp: new Date().toISOString()
    }
  }

  // 6. List Loan Applications
  if (method === 'GET' && pathname === '/admin/finance/loans') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const partnerBank = params.get('partnerBank') || 'all'
    const creditTier = params.get('creditTier') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterLoans({ q, status, partnerBank, creditTier, from, to }, mockLoanApplications)
    return paginate(filtered, page, pageSize)
  }

  // 7. Update Loan Application Underwriting Status
  const loanStatusMatch = pathname.match(/^\/admin\/finance\/loans\/([^/]+)\/status$/)
  if (method === 'PUT' && loanStatusMatch) {
    const id = loanStatusMatch[1]
    const idx = mockLoanApplications.findIndex((l) => l.id === id || l.applicationId === id)
    if (idx === -1) {
      throw Object.assign(new Error('Loan application not found'), { status: 404 })
    }
    const loan = mockLoanApplications[idx]
    const nextStatus = body?.status || loan.status
    const isApprovedOrDisbursed = ['approved', 'disbursed'].includes(nextStatus)

    // Dual sign-off enforcement if > ₹50,000 per SOP-14 §6.3
    if (loan.amount > 50000 && isApprovedOrDisbursed && !body?.dualSignOffAdmin && !loan.dualSignOffAdmin) {
      throw Object.assign(
        new Error('Dual sign-off mandated by SOP-14 §6.3 for loan facilities exceeding ₹50,000.'),
        { status: 422 }
      )
    }

    const updated = {
      ...loan,
      status: nextStatus,
      partnerBank: body?.partnerBank || loan.partnerBank,
      partnerBankBranch: body?.partnerBankBranch || loan.partnerBankBranch,
      underwriterAdmin: body?.adminUid || 'root@agrovercity',
      underwritingNotes: body?.notes ? `${loan.underwritingNotes} | [Admin Note]: ${body.notes}` : loan.underwritingNotes,
      dualSignOffAdmin: body?.dualSignOffAdmin || loan.dualSignOffAdmin,
      rejectionReason: nextStatus === 'rejected' ? (body?.reason || 'Underwriting criteria not satisfied') : null,
      approvedAt: nextStatus === 'approved' ? new Date().toISOString() : loan.approvedAt,
      disbursedAt: nextStatus === 'disbursed' ? new Date().toISOString() : loan.disbursedAt,
      updatedAt: new Date().toISOString()
    }
    mockLoanApplications[idx] = updated
    return updated
  }

  // 8. List KCC Records
  if (method === 'GET' && pathname === '/admin/finance/kcc') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const repaymentStatus = params.get('repaymentStatus') || 'all'
    const bankName = params.get('bankName') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterKcc({ q, status, repaymentStatus, bankName }, mockKccRecords)
    return paginate(filtered, page, pageSize)
  }

  // 9. Update KCC Limit
  const kccLimitMatch = pathname.match(/^\/admin\/finance\/kcc\/([^/]+)\/limit$/)
  if (method === 'PUT' && kccLimitMatch) {
    const id = kccLimitMatch[1]
    const idx = mockKccRecords.findIndex((k) => k.id === id)
    if (idx === -1) {
      throw Object.assign(new Error('KCC record not found'), { status: 404 })
    }
    const rec = mockKccRecords[idx]
    const newLimit = Number(body?.newLimit || rec.kccLimit)
    const diff = newLimit - rec.kccLimit
    const updated = {
      ...rec,
      kccLimit: newLimit,
      availableLimit: Math.max(0, rec.availableLimit + diff),
      lastAuditDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockKccRecords[idx] = updated
    return updated
  }

  // 10. Credit Score Model & Factors
  if (method === 'GET' && pathname === '/admin/finance/credit-score-model') {
    return { ...mockCreditScoreModel }
  }

  if (method === 'PUT' && pathname === '/admin/finance/credit-score-model') {
    if (body?.scoringFactors) {
      mockCreditScoreModel.scoringFactors = body.scoringFactors
    }
    if (body?.tiers) {
      mockCreditScoreModel.tiers = body.tiers
    }
    mockCreditScoreModel.lastCalibratedAt = new Date().toISOString()
    mockCreditScoreModel.calibratedBy = body?.adminUid || 'root@agrovercity'
    mockCreditScoreModel.version = `v4.3-${new Date().getFullYear()}`
    return { ...mockCreditScoreModel }
  }

  // 11. Loan EMI Calculator
  if (method === 'POST' && (pathname === '/finance/loan-calculator' || pathname === '/admin/finance/calculate-emi')) {
    const amount = Number(body?.amount || 50000)
    const rate = Number(body?.interestRate || 7.0)
    const tenure = Number(body?.tenureMonths || 12)
    const subvention = Number(body?.subventionRate || 0)
    const effectiveRate = Math.max(0, rate - subvention)

    const r = effectiveRate / 12 / 100
    let emi = 0
    if (r === 0) {
      emi = Math.round(amount / tenure)
    } else {
      emi = Math.round((amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1))
    }
    const totalPayable = emi * tenure
    const totalInterest = Math.max(0, totalPayable - amount)

    return {
      amount,
      standardRate: rate,
      subventionRate: subvention,
      effectiveRate,
      tenureMonths: tenure,
      emi,
      totalInterest,
      totalPayable
    }
  }

  // 12. Repayments & Default Risk Tracking
  if (method === 'GET' && pathname === '/admin/finance/repayments') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const riskLevel = params.get('riskLevel') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterRepayments({ q, status, riskLevel }, mockRepaymentMilestones)
    return paginate(filtered, page, pageSize)
  }

  throw Object.assign(new Error(`No mock handler for ${method} ${pathname}`), { status: 501 })
}

async function call(method, path, body) {
  if (mockMode) return mockRequest(method, path, body)
  try {
    return await request(method, path, body)
  } catch (err) {
    if (err instanceof TypeError || (err?.status && [404, 500, 501, 502, 503].includes(err.status))) {
      mockMode = true
      return mockRequest(method, path, body)
    }
    throw err
  }
}

export function isMockMode() {
  return mockMode
}

export function getBankingSummary() {
  return call('GET', '/admin/finance/summary')
}

export function listBankAccounts({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  accountType = 'all',
  from = '',
  to = ''
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (accountType !== 'all') params.set('accountType', accountType)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/finance/accounts?${params}`)
}

export function overrideVerifyAccount(id, payload) {
  return call('POST', `/admin/finance/accounts/${id}/override-verify`, payload)
}

export function setPrimaryAccount(id, payload = {}) {
  return call('POST', `/admin/finance/accounts/${id}/set-primary`, payload)
}

export function auditMaskingCompliance() {
  return call('POST', '/admin/finance/accounts/audit-masking')
}

export function listLoanApplications({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  partnerBank = 'all',
  creditTier = 'all',
  from = '',
  to = ''
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (partnerBank !== 'all') params.set('partnerBank', partnerBank)
  if (creditTier !== 'all') params.set('creditTier', creditTier)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/finance/loans?${params}`)
}

export function updateLoanStatus(id, payload) {
  return call('PUT', `/admin/finance/loans/${id}/status`, payload)
}

export function listKccRecords({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  repaymentStatus = 'all',
  bankName = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (repaymentStatus !== 'all') params.set('repaymentStatus', repaymentStatus)
  if (bankName !== 'all') params.set('bankName', bankName)
  return call('GET', `/admin/finance/kcc?${params}`)
}

export function updateKccLimit(id, payload) {
  return call('PUT', `/admin/finance/kcc/${id}/limit`, payload)
}

export function getCreditScoreModel() {
  return call('GET', '/admin/finance/credit-score-model')
}

export function updateCreditScoreModel(payload) {
  return call('PUT', '/admin/finance/credit-score-model', payload)
}

export function calculateLoanEmi(payload) {
  return call('POST', '/finance/loan-calculator', payload)
}

export function listRepaymentMilestones({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  riskLevel = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (riskLevel !== 'all') params.set('riskLevel', riskLevel)
  return call('GET', `/admin/finance/repayments?${params}`)
}
