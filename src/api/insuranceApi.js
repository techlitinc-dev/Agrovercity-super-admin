import { request } from './client'
import { adminInsuranceService } from '../services/adminInsuranceService'

let mockMode = false

export function isMockMode() {
  return mockMode
}

export async function getInsuranceSummary() {
  if (mockMode) return adminInsuranceService.getInsuranceSummary()
  try {
    return await request('GET', '/admin/insurance/summary')
  } catch (err) {
    mockMode = true
    return adminInsuranceService.getInsuranceSummary()
  }
}

export async function listClaims(params = {}) {
  if (mockMode) return adminInsuranceService.listClaims(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.calamityType && params.calamityType !== 'all') q.set('calamityType', params.calamityType)
    if (params.season && params.season !== 'all') q.set('season', params.season)
    if (params.district && params.district !== 'all') q.set('district', params.district)
    if (params.from) q.set('from', params.from)
    if (params.to) q.set('to', params.to)
    if (params.lateOnly) q.set('lateOnly', 'true')
    return await request('GET', `/admin/claims?${q}`)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.listClaims(params)
  }
}

export async function assignSurveyor(claimId, payload = {}) {
  if (mockMode) return adminInsuranceService.assignSurveyor(claimId, payload)
  try {
    return await request('POST', `/admin/claims/${claimId}/assign-surveyor`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.assignSurveyor(claimId, payload)
  }
}

export async function reviewSurveyorAssessment(claimId, payload = {}) {
  if (mockMode) return adminInsuranceService.reviewSurveyorAssessment(claimId, payload)
  try {
    return await request('POST', `/admin/claims/${claimId}/review-assessment`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.reviewSurveyorAssessment(claimId, payload)
  }
}

export async function advanceClaimStatus(userId, claimId, payload = {}) {
  if (mockMode) return adminInsuranceService.advanceClaimStatus(userId, claimId, payload)
  try {
    return await request('PUT', `/admin/claims/${userId || 'any'}/${claimId}`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.advanceClaimStatus(userId, claimId, payload)
  }
}

export async function executeSecondSignoff(claimId, payload = {}) {
  if (mockMode) return adminInsuranceService.executeSecondSignoff(claimId, payload)
  try {
    return await request('POST', `/admin/claims/${claimId}/second-signoff`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.executeSecondSignoff(claimId, payload)
  }
}

export async function appealClaim(claimId, payload = {}) {
  if (mockMode) return adminInsuranceService.appealClaim(claimId, payload)
  try {
    return await request('POST', `/insurance/claims/${claimId}/appeal`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.appealClaim(claimId, payload)
  }
}

export async function listPolicies(params = {}) {
  if (mockMode) return adminInsuranceService.listPolicies(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.season && params.season !== 'all') q.set('season', params.season)
    if (params.crop && params.crop !== 'all') q.set('crop', params.crop)
    if (params.from) q.set('from', params.from)
    if (params.to) q.set('to', params.to)
    return await request('GET', `/insurance/policies?${q}`)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.listPolicies(params)
  }
}

export async function listInsuranceRates(params = {}) {
  if (mockMode) return adminInsuranceService.listInsuranceRates(params)
  try {
    const q = new URLSearchParams()
    if (params.season && params.season !== 'all') q.set('season', params.season)
    if (params.crop && params.crop !== 'all') q.set('crop', params.crop)
    if (params.category && params.category !== 'all') q.set('category', params.category)
    return await request('GET', `/insurance/rates?${q}`)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.listInsuranceRates(params)
  }
}

export async function updateInsuranceRate(rateId, payload = {}) {
  if (mockMode) return adminInsuranceService.updateInsuranceRate(rateId, payload)
  try {
    return await request('PUT', `/admin/insurance/rates/${rateId}`, payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.updateInsuranceRate(rateId, payload)
  }
}

export async function listSurveyorPanel(params = {}) {
  if (mockMode) return adminInsuranceService.listSurveyorPanel(params)
  try {
    const q = new URLSearchParams()
    if (params.q) q.set('q', params.q)
    if (params.agency && params.agency !== 'all') q.set('agency', params.agency)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    return await request('GET', `/admin/insurance/surveyors?${q}`)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.listSurveyorPanel(params)
  }
}

export async function auditInsuranceCompliance(payload = {}) {
  if (mockMode) return adminInsuranceService.auditInsuranceCompliance(payload)
  try {
    return await request('POST', '/admin/insurance/audit-compliance', payload)
  } catch (err) {
    mockMode = true
    return adminInsuranceService.auditInsuranceCompliance(payload)
  }
}

export async function listInsuranceAuditLogs(params = {}) {
  return adminInsuranceService.listInsuranceAuditLogs(params)
}

export async function resetInsuranceSeedData() {
  return adminInsuranceService.resetToDefaultSeed()
}
