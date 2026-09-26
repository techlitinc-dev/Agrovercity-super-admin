import { request } from './client'
import { adminBankingService } from '../services/adminBankingService'

let mockMode = false

export function isMockMode() {
  return mockMode
}

export async function getBankingSummary() {
  if (mockMode) return adminBankingService.getBankingSummary()
  try {
    return await request('GET', '/admin/finance/summary')
  } catch (err) {
    mockMode = true
    return adminBankingService.getBankingSummary()
  }
}

export async function listBankAccounts(params = {}) {
  if (mockMode) return adminBankingService.listBankAccounts(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.accountType && params.accountType !== 'all') q.set('accountType', params.accountType)
    if (params.from) q.set('from', params.from)
    if (params.to) q.set('to', params.to)
    return await request('GET', `/admin/finance/accounts?${q}`)
  } catch (err) {
    mockMode = true
    return adminBankingService.listBankAccounts(params)
  }
}

export async function overrideVerifyAccount(id, payload = {}) {
  if (mockMode) return adminBankingService.overrideVerifyAccount(id, payload)
  try {
    return await request('POST', `/admin/finance/accounts/${id}/override-verify`, payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.overrideVerifyAccount(id, payload)
  }
}

export async function setPrimaryAccount(id, payload = {}) {
  if (mockMode) return adminBankingService.setPrimaryAccount(id, payload)
  try {
    return await request('POST', `/admin/finance/accounts/${id}/set-primary`, payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.setPrimaryAccount(id, payload)
  }
}

export async function auditMaskingCompliance(payload = {}) {
  if (mockMode) return adminBankingService.auditMaskingCompliance(payload)
  try {
    return await request('POST', '/admin/finance/accounts/audit-masking', payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.auditMaskingCompliance(payload)
  }
}

export async function listLoanApplications(params = {}) {
  if (mockMode) return adminBankingService.listLoanApplications(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.partnerBank && params.partnerBank !== 'all') q.set('partnerBank', params.partnerBank)
    if (params.creditTier && params.creditTier !== 'all') q.set('creditTier', params.creditTier)
    if (params.from) q.set('from', params.from)
    if (params.to) q.set('to', params.to)
    return await request('GET', `/admin/finance/loans?${q}`)
  } catch (err) {
    mockMode = true
    return adminBankingService.listLoanApplications(params)
  }
}

export async function updateLoanStatus(id, payload = {}) {
  if (mockMode) return adminBankingService.updateLoanStatus(id, payload)
  try {
    return await request('PUT', `/admin/finance/loans/${id}/status`, payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.updateLoanStatus(id, payload)
  }
}

export async function listKccRecords(params = {}) {
  if (mockMode) return adminBankingService.listKccRecords(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.repaymentStatus && params.repaymentStatus !== 'all') q.set('repaymentStatus', params.repaymentStatus)
    if (params.bankName && params.bankName !== 'all') q.set('bankName', params.bankName)
    return await request('GET', `/admin/finance/kcc?${q}`)
  } catch (err) {
    mockMode = true
    return adminBankingService.listKccRecords(params)
  }
}

export async function updateKccLimit(id, payload = {}) {
  if (mockMode) return adminBankingService.updateKccLimit(id, payload)
  try {
    return await request('PUT', `/admin/finance/kcc/${id}/limit`, payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.updateKccLimit(id, payload)
  }
}

export async function getCreditScoreModel() {
  if (mockMode) return adminBankingService.getCreditScoreModel()
  try {
    return await request('GET', '/admin/finance/credit-score-model')
  } catch (err) {
    mockMode = true
    return adminBankingService.getCreditScoreModel()
  }
}

export async function updateCreditScoreModel(payload = {}) {
  if (mockMode) return adminBankingService.updateCreditScoreModel(payload)
  try {
    return await request('PUT', '/admin/finance/credit-score-model', payload)
  } catch (err) {
    mockMode = true
    return adminBankingService.updateCreditScoreModel(payload)
  }
}

export function calculateLoanEmi(payload = {}) {
  return adminBankingService.calculateLoanEmi(payload)
}

export async function listRepaymentMilestones(params = {}) {
  if (mockMode) return adminBankingService.listRepaymentMilestones(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.riskLevel && params.riskLevel !== 'all') q.set('riskLevel', params.riskLevel)
    return await request('GET', `/admin/finance/repayments?${q}`)
  } catch (err) {
    mockMode = true
    return adminBankingService.listRepaymentMilestones(params)
  }
}

export async function listBankingAuditLogs(params = {}) {
  return adminBankingService.listBankingAuditLogs(params)
}

export async function resetBankingSeedData() {
  return adminBankingService.resetToDefaultSeed()
}
