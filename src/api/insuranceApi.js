import { request } from './client'
import {
  mockInsuranceClaims,
  mockInsurancePolicies,
  mockInsuranceRates,
  mockSurveyorPanel,
  mockInsuranceSummary
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

function filterClaims({ q = '', status = 'all', calamityType = 'all', season = 'all', district = 'all', from = '', to = '', lateOnly = false }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (calamityType !== 'all' && item.calamityType !== calamityType) return false
    if (season !== 'all' && item.season !== season) return false
    if (district !== 'all' && item.district !== district) return false
    if (lateOnly && item.intimationCompliance !== 'FLAGGED_LATE_INTIMATION') return false
    if (from && item.submittedAt < from) return false
    if (to && item.submittedAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.claimNumber,
      item.farmerName,
      item.farmerPhone,
      item.aadhaarMasked,
      item.cropName,
      item.vernacularCropName,
      item.village,
      item.district,
      item.state,
      item.calamityType,
      item.policyNumber,
      item.dbtTransactionId,
      item.surveyorName,
      item.surveyorAgency
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterPolicies({ q = '', status = 'all', season = 'all', crop = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (season !== 'all' && item.season !== season) return false
    if (crop !== 'all' && item.cropName.toLowerCase() !== crop.toLowerCase()) return false
    if (from && item.createdAt < from) return false
    if (to && item.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.policyNumber,
      item.farmerName,
      item.farmerPhone,
      item.cropName,
      item.insuranceCompany,
      item.bankName,
      item.kccAccountNo
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterSurveyors({ q = '', agency = 'all', status = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (agency !== 'all' && item.agency !== agency) return false
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.phone,
      item.agency,
      item.qualification,
      ...(item.assignedDistricts || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 150))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // 1. Module KPI Summary
  if (method === 'GET' && pathname === '/admin/insurance/summary') {
    const totalClaims = mockInsuranceClaims.length
    const intimatedCount = mockInsuranceClaims.filter((c) => c.status === 'intimated').length
    const surveyorAssignedCount = mockInsuranceClaims.filter((c) => c.status === 'surveyorAssigned').length
    const fieldAssessedCount = mockInsuranceClaims.filter((c) => c.status === 'fieldAssessed').length
    const dbtApprovedCount = mockInsuranceClaims.filter((c) => c.status === 'dbtApproved').length
    const disbursed = mockInsuranceClaims.filter((c) => c.status === 'disbursed')
    const lateCount = mockInsuranceClaims.filter((c) => c.intimationCompliance === 'FLAGGED_LATE_INTIMATION').length
    const dualSignOffPending = mockInsuranceClaims.filter(
      (c) => c.dualSignOffRequired && ['fieldAssessed', 'dbtApproved'].includes(c.status) && !c.secondSignOff
    ).length
    const appeals = mockInsuranceClaims.filter((c) => c.appealCount > 0 && c.status !== 'disbursed').length

    return {
      ...mockInsuranceSummary,
      totalClaims: totalClaims || mockInsuranceSummary.totalClaims,
      intimatedPendingAssignment: intimatedCount,
      surveyorAssignedActive: surveyorAssignedCount,
      fieldAssessedAwaitingApproval: fieldAssessedCount,
      dbtApprovedQueued: dbtApprovedCount,
      disbursedClaimsCount: disbursed.length,
      disbursedTotalAmount: disbursed.reduce((acc, c) => acc + (c.approvedAmount || 0), 0) || mockInsuranceSummary.disbursedTotalAmount,
      flaggedLateIntimations: lateCount,
      pendingDualSignOff: dualSignOffPending,
      appealsUnderReview: appeals
    }
  }

  // 2. List Claims (/admin/claims or /v1/admin/claims)
  if (method === 'GET' && (pathname === '/admin/claims' || pathname === '/insurance/claims')) {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const calamityType = params.get('calamityType') || 'all'
    const season = params.get('season') || 'all'
    const district = params.get('district') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const lateOnly = params.get('lateOnly') === 'true'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterClaims({ q, status, calamityType, season, district, from, to, lateOnly }, mockInsuranceClaims)
    return paginate(filtered, page, pageSize)
  }

  // 3. Assign Surveyor to Claim: POST /v1/admin/claims/{id}/assign-surveyor
  const assignSurveyorMatch = pathname.match(/^\/admin\/claims\/([^/]+)\/assign-surveyor$/)
  if (method === 'POST' && assignSurveyorMatch) {
    const claimId = assignSurveyorMatch[1]
    const idx = mockInsuranceClaims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) {
      throw Object.assign(new Error('Claim not found'), { status: 404 })
    }
    const claim = mockInsuranceClaims[idx]
    const previousState = claim.status

    claim.surveyorName = body.surveyorName || 'संदीप कुलकर्णी (Sandeep Kulkarni)'
    claim.surveyorPhone = body.surveyorPhone || '+919811000001'
    claim.surveyorAgency = body.surveyorAgency || 'Agriculture Insurance Company of India (AIC)'
    claim.surveyorVisitDate = body.surveyorVisitDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
    claim.status = 'surveyorAssigned'
    claim.statusText = 'सर्वेयर नियुक्त — निरीक्षण प्रगति पर'

    claim.timeline.push({
      status: 'surveyorAssigned',
      at: new Date().toISOString(),
      actor: body.adminName || 'Superadmin Console',
      note: `Field surveyor ${claim.surveyorName} (${claim.surveyorAgency}) assigned for inspection on ${claim.surveyorVisitDate}. ${body.notes || ''}`
    })

    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      previousState,
      newState: 'surveyorAssigned',
      reason: body.notes || `Assigned panel surveyor ${claim.surveyorName}`
    })

    return claim
  }

  // 4. Review Surveyor Assessment: POST /v1/admin/claims/{id}/review-assessment
  const reviewAssessmentMatch = pathname.match(/^\/admin\/claims\/([^/]+)\/review-assessment$/)
  if (method === 'POST' && reviewAssessmentMatch) {
    const claimId = reviewAssessmentMatch[1]
    const idx = mockInsuranceClaims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) {
      throw Object.assign(new Error('Claim not found'), { status: 404 })
    }
    const claim = mockInsuranceClaims[idx]
    const previousState = claim.status

    claim.surveyorLossPercent = Number(body.surveyorLossPercent ?? claim.estimatedLossPercent)
    claim.surveyorReportNotes = body.surveyorReportNotes || 'Surveyor verified damage findings.'
    claim.cropStage = body.cropStage || claim.cropStage
    claim.status = 'fieldAssessed'
    claim.statusText = 'क्षेत्र मूल्यांकन पूर्ण — अनुमोदन प्रतीक्षारत'

    // Auto-calculate suggested approved amount
    if (!claim.approvedAmount && claim.sumInsuredTotal) {
      claim.approvedAmount = Math.round((claim.sumInsuredTotal * claim.surveyorLossPercent) / 100)
    }

    claim.timeline.push({
      status: 'fieldAssessed',
      at: new Date().toISOString(),
      actor: claim.surveyorName || 'Field Surveyor',
      note: `Survey completed. Assessed loss: ${claim.surveyorLossPercent}%. ${claim.surveyorReportNotes}`
    })

    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      previousState,
      newState: 'fieldAssessed',
      reason: `Survey assessment recorded: ${claim.surveyorLossPercent}% loss verified.`
    })

    return claim
  }

  // 5. Advance / Approve Claim: PUT /v1/admin/claims/{userId}/{claimId}
  const advanceClaimMatch = pathname.match(/^\/admin\/claims\/([^/]+)\/([^/]+)$/)
  if (method === 'PUT' && advanceClaimMatch) {
    const userId = advanceClaimMatch[1]
    const claimId = advanceClaimMatch[2]
    const idx = mockInsuranceClaims.findIndex(
      (c) => (c.id === claimId || c.claimNumber === claimId) && (!userId || userId === 'any' || c.userId === userId)
    )
    if (idx === -1) {
      throw Object.assign(new Error('Claim not found'), { status: 404 })
    }
    const claim = mockInsuranceClaims[idx]
    const newStatus = body.newStatus || body.status
    const previousState = claim.status

    // SOP-15 §6.3: Payout approvals exceeding ₹50,000 require dual-admin sign-off
    const targetAmount = Number(body.approvedAmount || claim.approvedAmount || claim.requestedAmount)
    const exceedsFiftyK = targetAmount > 50000

    if (newStatus === 'dbtApproved' || newStatus === 'disbursed') {
      claim.approvedAmount = targetAmount
      if (body.dbtTransactionId) {
        claim.dbtTransactionId = body.dbtTransactionId
      }

      if (exceedsFiftyK) {
        claim.dualSignOffRequired = true
        if (!claim.firstSignOff) {
          claim.firstSignOff = {
            adminUid: body.adminUid || 'superadmin_root',
            adminName: body.adminName || 'Vikram Mehta (Chief Risk Officer)',
            signedAt: new Date().toISOString(),
            notes: body.note || 'Primary administrative approval recorded'
          }
        }

        // If second sign-off requested in this payload
        if (body.secondSignOffAdmin) {
          claim.secondSignOff = {
            adminUid: body.secondSignOffAdmin.adminUid || 'admin_dir_finance',
            adminName: body.secondSignOffAdmin.adminName || 'Ananya Deshmukh (Director Finance)',
            signedAt: new Date().toISOString(),
            notes: body.secondSignOffAdmin.notes || 'Secondary dual sign-off confirmed'
          }
        }

        // Check if attempting disbursal without second sign-off
        if (newStatus === 'disbursed' && !claim.secondSignOff) {
          throw Object.assign(
            new Error('Dual sign-off mandated by SOP-15 §6.3 for insurance claim payouts exceeding ₹50,000.'),
            { status: 422 }
          )
        }
      }
    }

    if (newStatus === 'rejected') {
      if (!body.reason && !body.note) {
        throw Object.assign(
          new Error('Mandatory administrative reason required for claim rejection per SOP-15 §4.1.'),
          { status: 422 }
        )
      }
      claim.rejectionReason = body.reason || body.note
    }

    claim.status = newStatus
    const statusMap = {
      intimated: 'दावा दर्ज — सर्वेयर नियुक्ति लंबित',
      surveyorAssigned: 'सर्वेयर नियुक्त — निरीक्षण प्रगति पर',
      fieldAssessed: 'क्षेत्र मूल्यांकन पूर्ण — अनुमोदन प्रतीक्षारत',
      dbtApproved: 'DBT स्वीकृत — भुगतान प्रेषण लंबित',
      disbursed: 'राशि वितरित — DBT सफल',
      rejected: 'दावा अस्वीकृत'
    }
    claim.statusText = statusMap[newStatus] || newStatus

    claim.timeline.push({
      status: newStatus,
      at: new Date().toISOString(),
      actor: body.adminName || 'Super Admin',
      note: body.note || body.reason || `Status advanced to ${newStatus}`
    })

    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      previousState,
      newState: newStatus,
      reason: body.reason || body.note || `Claim moved to ${newStatus}`
    })

    return claim
  }

  // 6. Execute Second Dual Sign-Off: POST /v1/admin/claims/{id}/second-signoff
  const secondSignoffMatch = pathname.match(/^\/admin\/claims\/([^/]+)\/second-signoff$/)
  if (method === 'POST' && secondSignoffMatch) {
    const claimId = secondSignoffMatch[1]
    const idx = mockInsuranceClaims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) {
      throw Object.assign(new Error('Claim not found'), { status: 404 })
    }
    const claim = mockInsuranceClaims[idx]
    const previousState = claim.status

    claim.secondSignOff = {
      adminUid: body.adminUid || 'admin_dir_finance',
      adminName: body.adminName || 'Ananya Deshmukh (Director Finance)',
      signedAt: new Date().toISOString(),
      notes: body.notes || 'Secondary dual sign-off confirmed after financial audit verification'
    }

    if (body.advanceToDisbursed && claim.dbtTransactionId) {
      claim.status = 'disbursed'
      claim.statusText = 'राशि वितरित — DBT सफल'
    }

    claim.timeline.push({
      status: claim.status,
      at: new Date().toISOString(),
      actor: claim.secondSignOff.adminName,
      note: `Dual Sign-off completed: ${claim.secondSignOff.notes}`
    })

    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: claim.secondSignOff.adminUid,
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      previousState,
      newState: claim.status,
      reason: `SOP-15 §6.3 Secondary Sign-off executed for payout ₹${claim.approvedAmount?.toLocaleString('en-IN')}`
    })

    return claim
  }

  // 7. Appeal Claim: POST /v1/insurance/claims/{claimId}/appeal
  const appealMatch = pathname.match(/^\/insurance\/claims\/([^/]+)\/appeal$/)
  if (method === 'POST' && appealMatch) {
    const claimId = appealMatch[1]
    const idx = mockInsuranceClaims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) {
      throw Object.assign(new Error('Claim not found'), { status: 404 })
    }
    const claim = mockInsuranceClaims[idx]
    if (claim.status !== 'rejected') {
      throw Object.assign(new Error('Only rejected claims can be appealed'), { status: 409 })
    }

    claim.status = 'intimated'
    claim.statusText = 'दावा पुनः प्रस्तुत (अपील) — समीक्षा लंबित'
    claim.appealCount = (claim.appealCount || 0) + 1
    claim.appealReason = body.appealReason || body.reason || 'Farmer filed formal appeal with supporting documents'

    if (body.photos && Array.isArray(body.photos)) {
      claim.damagePhotos = [...claim.damagePhotos, ...body.photos].slice(0, 5)
    }

    claim.timeline.push({
      status: 'intimated',
      at: new Date().toISOString(),
      actor: claim.farmerName,
      note: `Formal appeal round #${claim.appealCount} lodged: ${claim.appealReason}`
    })

    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: claim.userId,
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.20',
      previousState: 'rejected',
      newState: 'intimated',
      reason: `Appeal resubmitted by farmer: ${claim.appealReason}`
    })

    return claim
  }

  // 8. List Policies: GET /v1/insurance/policies
  if (method === 'GET' && pathname === '/insurance/policies') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const season = params.get('season') || 'all'
    const crop = params.get('crop') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterPolicies({ q, status, season, crop, from, to }, mockInsurancePolicies)
    return paginate(filtered, page, pageSize)
  }

  // 9. List Rates: GET /v1/insurance/rates
  if (method === 'GET' && pathname === '/insurance/rates') {
    const season = params.get('season') || 'all'
    const crop = params.get('crop') || 'all'
    const category = params.get('category') || 'all'

    let list = [...mockInsuranceRates]
    if (season !== 'all') list = list.filter((r) => r.season.toLowerCase() === season.toLowerCase())
    if (crop !== 'all') list = list.filter((r) => r.cropName.toLowerCase() === crop.toLowerCase())
    if (category !== 'all') list = list.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()))

    return { data: list, total: list.length }
  }

  // 10. Update Premium Rates: PUT /v1/admin/insurance/rates or /v1/admin/insurance/rates/{id}
  if (method === 'PUT' && pathname.startsWith('/admin/insurance/rates')) {
    const rateId = pathname.split('/').pop()
    const idx = mockInsuranceRates.findIndex((r) => r.id === rateId || r.cropName === body.cropName)
    if (idx !== -1) {
      mockInsuranceRates[idx] = {
        ...mockInsuranceRates[idx],
        ...body,
        updatedAt: new Date().toISOString()
      }
      return mockInsuranceRates[idx]
    } else {
      const newRate = {
        id: body.id || `rate_${Date.now()}`,
        ...body,
        status: 'active',
        updatedAt: new Date().toISOString()
      }
      mockInsuranceRates.push(newRate)
      return newRate
    }
  }

  // 11. List Surveyor Panel: GET /v1/admin/insurance/surveyors
  if (method === 'GET' && pathname === '/admin/insurance/surveyors') {
    const q = params.get('q') || ''
    const agency = params.get('agency') || 'all'
    const status = params.get('status') || 'all'
    const filtered = filterSurveyors({ q, agency, status }, mockSurveyorPanel)
    return { data: filtered, total: filtered.length }
  }

  // 12. Audit Compliance (DPDP Aadhaar Masking + 72-Hour Calamity Intimation Rule)
  if (method === 'POST' && pathname === '/admin/insurance/audit-compliance') {
    const unmaskedAadhaar = mockInsuranceClaims.filter(
      (c) => !c.aadhaarMasked || !c.aadhaarMasked.startsWith('XXXX-XXXX-')
    )
    const lateIntimations = mockInsuranceClaims.filter(
      (c) => c.intimationElapsedHours > 72 || c.intimationCompliance === 'FLAGGED_LATE_INTIMATION'
    )
    const unmaskedAccounts = mockInsuranceClaims.filter(
      (c) => c.bankAccountLast4 && c.bankAccountLast4.length !== 4
    )

    return {
      timestamp: new Date().toISOString(),
      dpdpCompliance: {
        totalAudited: mockInsuranceClaims.length,
        aadhaarMaskedCount: mockInsuranceClaims.length - unmaskedAadhaar.length,
        aadhaarLeaks: unmaskedAadhaar.length,
        bankAccountMaskedCount: mockInsuranceClaims.length - unmaskedAccounts.length,
        passRate: unmaskedAadhaar.length === 0 ? 100 : 98.2,
        status: unmaskedAadhaar.length === 0 ? 'COMPLIANT' : 'ACTION_REQUIRED'
      },
      calamityIntimationRule: {
        totalClaimsChecked: mockInsuranceClaims.length,
        within72HoursCount: mockInsuranceClaims.length - lateIntimations.length,
        flaggedLateCount: lateIntimations.length,
        lateClaims: lateIntimations.map((c) => ({
          claimNumber: c.claimNumber,
          farmerName: c.farmerName,
          elapsedHours: c.intimationElapsedHours,
          calamityType: c.calamityType,
          status: c.status
        })),
        rule: 'PMFBY Statutory Directive: Calamity intimation must occur within 72 hours of damage event.'
      }
    }
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

export function getInsuranceSummary() {
  return call('GET', '/admin/insurance/summary')
}

export function listClaims({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  calamityType = 'all',
  season = 'all',
  district = 'all',
  from = '',
  to = '',
  lateOnly = false
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (calamityType !== 'all') params.set('calamityType', calamityType)
  if (season !== 'all') params.set('season', season)
  if (district !== 'all') params.set('district', district)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  if (lateOnly) params.set('lateOnly', 'true')
  return call('GET', `/admin/claims?${params}`)
}

export function assignSurveyor(claimId, payload) {
  return call('POST', `/admin/claims/${claimId}/assign-surveyor`, payload)
}

export function reviewSurveyorAssessment(claimId, payload) {
  return call('POST', `/admin/claims/${claimId}/review-assessment`, payload)
}

export function advanceClaimStatus(userId, claimId, payload) {
  return call('PUT', `/admin/claims/${userId || 'any'}/${claimId}`, payload)
}

export function executeSecondSignoff(claimId, payload) {
  return call('POST', `/admin/claims/${claimId}/second-signoff`, payload)
}

export function appealClaim(claimId, payload) {
  return call('POST', `/insurance/claims/${claimId}/appeal`, payload)
}

export function listPolicies({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  season = 'all',
  crop = 'all',
  from = '',
  to = ''
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (season !== 'all') params.set('season', season)
  if (crop !== 'all') params.set('crop', crop)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/insurance/policies?${params}`)
}

export function listInsuranceRates({ season = 'all', crop = 'all', category = 'all' } = {}) {
  const params = new URLSearchParams()
  if (season !== 'all') params.set('season', season)
  if (crop !== 'all') params.set('crop', crop)
  if (category !== 'all') params.set('category', category)
  return call('GET', `/insurance/rates?${params}`)
}

export function updateInsuranceRate(rateId, payload) {
  return call('PUT', `/admin/insurance/rates/${rateId}`, payload)
}

export function listSurveyorPanel({ q = '', agency = 'all', status = 'all' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (agency !== 'all') params.set('agency', agency)
  if (status !== 'all') params.set('status', status)
  return call('GET', `/admin/insurance/surveyors?${params}`)
}

export function auditInsuranceCompliance() {
  return call('POST', '/admin/insurance/audit-compliance')
}
