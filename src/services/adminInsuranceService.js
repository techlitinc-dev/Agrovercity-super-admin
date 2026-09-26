// Admin Crop Insurance (PMFBY) & Calamity Claims Service for AGROVERCITY Superadmin
// Implements Module 15: Crop Insurance (PMFBY) & Calamity Claims (SOP-15)
// Target Collections: insurance_policies, insurance_claims, insurance_rates, audit_logs

import {
  mockInsuranceClaims,
  mockInsurancePolicies,
  mockInsuranceRates,
  mockSurveyorPanel,
  mockInsuranceSummary
} from '../api/mockData'

const CLAIMS_STORAGE_KEY = 'agrovercity_superadmin_insurance_claims'
const POLICIES_STORAGE_KEY = 'agrovercity_superadmin_insurance_policies'
const RATES_STORAGE_KEY = 'agrovercity_superadmin_insurance_rates'
const SURVEYORS_STORAGE_KEY = 'agrovercity_superadmin_insurance_surveyors'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs'

export const INITIAL_INSURANCE_AUDIT_LOGS = [
  {
    id: 'AUD-1501',
    adminUid: 'root@agrovercity',
    action: 'SECOND_SIGNOFF_EXECUTED',
    targetUserId: 'claim_05',
    targetUserName: 'Dnyaneshwar Pandurang Kale (Cotton - Flood Loss)',
    previousState: 'Status: dbtApproved (₹1,08,000 pending secondary sign-off)',
    newState: 'Status: disbursed (APBS Txn: APBS-MH-2026-9021)',
    reason: 'SOP-15 §6.3 dual sign-off confirmed by Director Finance after AIC surveyor photo audit.',
    timestamp: '2026-09-22T14:40:00.000Z',
    ipAddress: '14.139.122.14'
  },
  {
    id: 'AUD-1502',
    adminUid: 'root@agrovercity',
    action: 'SURVEYOR_ASSIGNED',
    targetUserId: 'claim_03',
    targetUserName: 'Mahadev Govind Shinde (Soybean - Hailstorm)',
    previousState: 'Status: intimated',
    newState: 'Status: surveyorAssigned (Meena Jadhav - HDFC ERGO)',
    reason: 'Assigned certified district panel surveyor for ground geotag verification.',
    timestamp: '2026-09-21T09:15:00.000Z',
    ipAddress: '14.139.122.25'
  },
  {
    id: 'AUD-1503',
    adminUid: 'root@agrovercity',
    action: 'ASSESSMENT_REVIEWED',
    targetUserId: 'claim_03',
    targetUserName: 'Mahadev Govind Shinde (₹1,28,000 Proposed Compensation)',
    previousState: 'Status: surveyorAssigned',
    newState: 'Status: fieldAssessed (80% yield loss verified)',
    reason: 'Damage photos confirmed pod shattering. Loss percentage calibrated to ICAR standard.',
    timestamp: '2026-09-20T16:20:00.000Z',
    ipAddress: '14.139.122.18'
  },
  {
    id: 'AUD-1504',
    adminUid: 'root@agrovercity',
    action: 'COMPLIANCE_AUDITED',
    targetUserId: 'PORTFOLIO_SYSTEM',
    targetUserName: 'All PMFBY Registered Claims',
    previousState: 'Compliance Check: In progress',
    newState: 'Compliance: 100% DPDP Masked, 14 late claims flagged (> 72h)',
    reason: 'Automated statutory compliance audit against DPDP Act 2023 and PMFBY 72h rule.',
    timestamp: '2026-09-19T11:00:00.000Z',
    ipAddress: '14.139.122.6'
  },
  {
    id: 'AUD-1505',
    adminUid: 'root@agrovercity',
    action: 'RATE_UPDATED',
    targetUserId: 'RATE-SOYBEAN-KHARIF',
    targetUserName: 'Soybean (Kharif 2026 Premium Rates)',
    previousState: 'Farmer Share: 2.0%, Actuarial: 12.5%',
    newState: 'Farmer Share: 2.0%, Actuarial: 13.2% (Govt Subsidy: 11.2%)',
    reason: 'State Level Coordination Committee on Crop Insurance (SLCCCI) revised notification rates.',
    timestamp: '2026-09-18T10:30:00.000Z',
    ipAddress: '14.139.122.8'
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
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_INSURANCE_AUDIT_LOGS))
    return [...INITIAL_INSURANCE_AUDIT_LOGS]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_INSURANCE_AUDIT_LOGS))
      return [...INITIAL_INSURANCE_AUDIT_LOGS]
    }
    return parsed
  } catch (e) {
    return [...INITIAL_INSURANCE_AUDIT_LOGS]
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

export const adminInsuranceService = {
  // 1. Module KPI Summary
  async getInsuranceSummary() {
    await new Promise((r) => setTimeout(r, 60))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const policies = getStored(POLICIES_STORAGE_KEY, mockInsurancePolicies)

    const totalClaims = claims.length
    const intimatedCount = claims.filter((c) => c.status === 'intimated').length
    const surveyorAssignedCount = claims.filter((c) => c.status === 'surveyorAssigned').length
    const fieldAssessedCount = claims.filter((c) => c.status === 'fieldAssessed').length
    const dbtApprovedCount = claims.filter((c) => c.status === 'dbtApproved').length
    const disbursed = claims.filter((c) => c.status === 'disbursed')
    const lateCount = claims.filter(
      (c) => c.intimationElapsedHours > 72 || c.intimationCompliance === 'FLAGGED_LATE_INTIMATION'
    ).length
    const dualSignOffPending = claims.filter(
      (c) => c.dualSignOffRequired && ['fieldAssessed', 'dbtApproved'].includes(c.status) && !c.secondSignOff
    ).length
    const appeals = claims.filter((c) => c.appealCount > 0 && c.status !== 'disbursed').length

    return {
      ...mockInsuranceSummary,
      totalClaims: totalClaims || mockInsuranceSummary.totalClaims,
      totalActivePolicies: policies.length || mockInsuranceSummary.totalActivePolicies,
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
  },

  // 2. List Claims with filtering & pagination
  async listClaims({
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
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)

    if (status !== 'all') {
      claims = claims.filter((c) => c.status === status)
    }
    if (calamityType !== 'all') {
      claims = claims.filter((c) => c.calamityType === calamityType)
    }
    if (season !== 'all') {
      claims = claims.filter((c) => c.season === season)
    }
    if (district !== 'all') {
      claims = claims.filter((c) => c.district === district)
    }
    if (lateOnly) {
      claims = claims.filter(
        (c) => c.intimationElapsedHours > 72 || c.intimationCompliance === 'FLAGGED_LATE_INTIMATION'
      )
    }
    if (from) {
      claims = claims.filter((c) => (c.submittedAt || '').slice(0, 10) >= from)
    }
    if (to) {
      claims = claims.filter((c) => (c.submittedAt || '').slice(0, 10) <= to)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      claims = claims.filter((item) =>
        [
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
      )
    }

    return paginateItems(claims, page, pageSize)
  },

  // 3. Assign Field Surveyor to Intimated Claim
  async assignSurveyor(claimId, {
    surveyorName = 'संदीप कुलकर्णी (Sandeep Kulkarni)',
    surveyorPhone = '+919811000001',
    surveyorAgency = 'Agriculture Insurance Company of India (AIC)',
    surveyorVisitDate,
    notes = '',
    adminUid = 'root@agrovercity',
    adminName = 'Superadmin Console'
  } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const idx = claims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) throw new Error(`Claim #${claimId} not found`)
    const claim = claims[idx]
    const previousState = claim.status

    claim.surveyorName = surveyorName
    claim.surveyorPhone = surveyorPhone
    claim.surveyorAgency = surveyorAgency
    claim.surveyorVisitDate = surveyorVisitDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)
    claim.status = 'surveyorAssigned'
    claim.statusText = 'सर्वेयर नियुक्त — निरीक्षण प्रगति पर'

    if (!Array.isArray(claim.timeline)) claim.timeline = []
    claim.timeline.push({
      status: 'surveyorAssigned',
      at: new Date().toISOString(),
      actor: adminName,
      note: `Field surveyor ${surveyorName} (${surveyorAgency}) assigned for inspection on ${claim.surveyorVisitDate}. ${notes}`
    })

    if (!Array.isArray(claim.auditLogs)) claim.auditLogs = []
    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid,
      timestamp: new Date().toISOString(),
      ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1),
      previousState,
      newState: 'surveyorAssigned',
      reason: notes || `Assigned panel surveyor ${surveyorName}`
    })

    claims[idx] = claim
    save(CLAIMS_STORAGE_KEY, claims)

    recordAuditLog({
      adminUid,
      action: 'SURVEYOR_ASSIGNED',
      targetUserId: claim.claimNumber || claim.id,
      targetUserName: `${claim.farmerName} (${claim.cropName} - ${claim.district})`,
      previousState: `Status: ${previousState}`,
      newState: `Status: surveyorAssigned (${surveyorName} - ${surveyorAgency})`,
      reason: notes || `Assigned certified field surveyor for inspection on ${claim.surveyorVisitDate}.`
    })

    return claim
  },

  // 4. Review Surveyor Assessment Report
  async reviewSurveyorAssessment(claimId, {
    surveyorLossPercent,
    surveyorReportNotes = '',
    cropStage,
    adminUid = 'root@agrovercity'
  } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const idx = claims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) throw new Error(`Claim #${claimId} not found`)
    const claim = claims[idx]
    const previousState = claim.status

    claim.surveyorLossPercent = Number(surveyorLossPercent ?? claim.estimatedLossPercent)
    claim.surveyorReportNotes = surveyorReportNotes || 'Surveyor verified damage findings.'
    if (cropStage) claim.cropStage = cropStage
    claim.status = 'fieldAssessed'
    claim.statusText = 'क्षेत्र मूल्यांकन पूर्ण — अनुमोदन प्रतीक्षारत'

    // Auto-calculate suggested approved amount
    if (!claim.approvedAmount && claim.sumInsuredTotal) {
      claim.approvedAmount = Math.round((claim.sumInsuredTotal * claim.surveyorLossPercent) / 100)
    }

    if (!Array.isArray(claim.timeline)) claim.timeline = []
    claim.timeline.push({
      status: 'fieldAssessed',
      at: new Date().toISOString(),
      actor: claim.surveyorName || 'Field Surveyor',
      note: `Survey completed. Assessed loss: ${claim.surveyorLossPercent}%. ${claim.surveyorReportNotes}`
    })

    if (!Array.isArray(claim.auditLogs)) claim.auditLogs = []
    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid,
      timestamp: new Date().toISOString(),
      ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1),
      previousState,
      newState: 'fieldAssessed',
      reason: `Survey assessment recorded: ${claim.surveyorLossPercent}% loss verified.`
    })

    claims[idx] = claim
    save(CLAIMS_STORAGE_KEY, claims)

    recordAuditLog({
      adminUid,
      action: 'ASSESSMENT_REVIEWED',
      targetUserId: claim.claimNumber || claim.id,
      targetUserName: `${claim.farmerName} (Assessed: ₹${claim.approvedAmount?.toLocaleString('en-IN') || 'N/A'})`,
      previousState: `Status: ${previousState}`,
      newState: `Status: fieldAssessed (${claim.surveyorLossPercent}% loss)`,
      reason: surveyorReportNotes || `Field surveyor report recorded with ${claim.surveyorLossPercent}% verified loss.`
    })

    return claim
  },

  // 5. Advance / Approve Claim Status
  async advanceClaimStatus(userId, claimId, {
    status,
    newStatus,
    approvedAmount,
    dbtTransactionId,
    note = '',
    reason = '',
    secondSignOffAdmin = null,
    adminUid = 'root@agrovercity',
    adminName = 'Super Admin'
  } = {}) {
    await new Promise((r) => setTimeout(r, 140))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const idx = claims.findIndex(
      (c) => (c.id === claimId || c.claimNumber === claimId) && (!userId || userId === 'any' || c.userId === userId)
    )
    if (idx === -1) throw new Error(`Claim #${claimId} not found`)
    const claim = claims[idx]
    const targetStatus = newStatus || status || claim.status
    const previousState = claim.status

    const targetAmount = Number(approvedAmount || claim.approvedAmount || claim.requestedAmount)
    const exceedsFiftyK = targetAmount > 50000

    if (targetStatus === 'dbtApproved' || targetStatus === 'disbursed') {
      claim.approvedAmount = targetAmount
      if (dbtTransactionId) {
        claim.dbtTransactionId = dbtTransactionId
      }

      if (exceedsFiftyK) {
        claim.dualSignOffRequired = true
        if (!claim.firstSignOff) {
          claim.firstSignOff = {
            adminUid,
            adminName,
            signedAt: new Date().toISOString(),
            notes: note || 'Primary administrative approval recorded'
          }
        }

        if (secondSignOffAdmin) {
          claim.secondSignOff = {
            adminUid: secondSignOffAdmin.adminUid || 'admin_dir_finance',
            adminName: secondSignOffAdmin.adminName || 'Ananya Deshmukh (Director Finance)',
            signedAt: new Date().toISOString(),
            notes: secondSignOffAdmin.notes || 'Secondary dual sign-off confirmed'
          }
        }

        if (targetStatus === 'disbursed' && !claim.secondSignOff) {
          throw new Error('Dual sign-off mandated by SOP-15 §6.3 for insurance claim payouts exceeding ₹50,000.')
        }
      }
    }

    if (targetStatus === 'rejected') {
      if (!reason && !note) {
        throw new Error('Mandatory administrative reason required for claim rejection per SOP-15 §4.1.')
      }
      claim.rejectionReason = reason || note
    }

    claim.status = targetStatus
    const statusMap = {
      intimated: 'दावा दर्ज — सर्वेयर नियुक्ति लंबित',
      surveyorAssigned: 'सर्वेयर नियुक्त — निरीक्षण प्रगति पर',
      fieldAssessed: 'क्षेत्र मूल्यांकन पूर्ण — अनुमोदन प्रतीक्षारत',
      dbtApproved: 'DBT स्वीकृत — भुगतान प्रेषण लंबित',
      disbursed: 'राशि वितरित — DBT सफल',
      rejected: 'दावा अस्वीकृत'
    }
    claim.statusText = statusMap[targetStatus] || targetStatus

    if (!Array.isArray(claim.timeline)) claim.timeline = []
    claim.timeline.push({
      status: targetStatus,
      at: new Date().toISOString(),
      actor: adminName,
      note: note || reason || `Status advanced to ${targetStatus}`
    })

    if (!Array.isArray(claim.auditLogs)) claim.auditLogs = []
    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid,
      timestamp: new Date().toISOString(),
      ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1),
      previousState,
      newState: targetStatus,
      reason: reason || note || `Claim moved to ${targetStatus}`
    })

    claims[idx] = claim
    save(CLAIMS_STORAGE_KEY, claims)

    const actionName =
      targetStatus === 'dbtApproved'
        ? 'DBT_DISBURSAL_APPROVED'
        : targetStatus === 'disbursed'
        ? 'CLAIM_DISBURSED'
        : targetStatus === 'rejected'
        ? 'CLAIM_REJECTED'
        : 'CLAIM_STATUS_UPDATED'

    recordAuditLog({
      adminUid,
      action: actionName,
      targetUserId: claim.claimNumber || claim.id,
      targetUserName: `${claim.farmerName} (₹${(claim.approvedAmount || claim.requestedAmount || 0).toLocaleString('en-IN')})`,
      previousState: `Status: ${previousState}`,
      newState: `Status: ${targetStatus}${claim.dbtTransactionId ? ` (Txn: ${claim.dbtTransactionId})` : ''}`,
      reason: reason || note || `Claim status moved to ${targetStatus}.`
    })

    return claim
  },

  // 6. Execute Second Dual Sign-Off for > ₹50,000 Payouts
  async executeSecondSignoff(claimId, {
    adminUid = 'admin_dir_finance',
    adminName = 'Ananya Deshmukh (Director Finance)',
    notes = 'Secondary dual sign-off confirmed after financial audit verification',
    advanceToDisbursed = false
  } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const idx = claims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) throw new Error(`Claim #${claimId} not found`)
    const claim = claims[idx]
    const previousState = claim.status

    claim.secondSignOff = {
      adminUid,
      adminName,
      signedAt: new Date().toISOString(),
      notes
    }

    if (advanceToDisbursed && claim.dbtTransactionId) {
      claim.status = 'disbursed'
      claim.statusText = 'राशि वितरित — DBT सफल'
    }

    if (!Array.isArray(claim.timeline)) claim.timeline = []
    claim.timeline.push({
      status: claim.status,
      at: new Date().toISOString(),
      actor: adminName,
      note: `Dual Sign-off completed: ${notes}`
    })

    if (!Array.isArray(claim.auditLogs)) claim.auditLogs = []
    claim.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid,
      timestamp: new Date().toISOString(),
      ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1),
      previousState,
      newState: claim.status,
      reason: `SOP-15 §6.3 Secondary Sign-off executed for payout ₹${claim.approvedAmount?.toLocaleString('en-IN')}`
    })

    claims[idx] = claim
    save(CLAIMS_STORAGE_KEY, claims)

    recordAuditLog({
      adminUid,
      action: 'SECOND_SIGNOFF_EXECUTED',
      targetUserId: claim.claimNumber || claim.id,
      targetUserName: `${claim.farmerName} (₹${(claim.approvedAmount || 0).toLocaleString('en-IN')})`,
      previousState: `Status: ${previousState}, SecondSignOff: pending`,
      newState: `Status: ${claim.status}, SecondSignOff: completed (${adminName})`,
      reason: notes || 'Secondary dual sign-off authorized per SOP-15 §6.3.'
    })

    return claim
  },

  // 7. Appeal Rejected Claim
  async appealClaim(claimId, {
    appealReason = 'Farmer filed formal appeal with supporting documents',
    photos = [],
    reason = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)
    const idx = claims.findIndex((c) => c.id === claimId || c.claimNumber === claimId)
    if (idx === -1) throw new Error(`Claim #${claimId} not found`)
    const claim = claims[idx]
    if (claim.status !== 'rejected') {
      throw new Error('Only rejected claims can be appealed.')
    }

    claim.status = 'intimated'
    claim.statusText = 'दावा पुनः प्रस्तुत (अपील) — समीक्षा लंबित'
    claim.appealCount = (claim.appealCount || 0) + 1
    claim.appealReason = appealReason || reason || 'Formal appeal submitted'

    if (photos && Array.isArray(photos)) {
      claim.damagePhotos = [...(claim.damagePhotos || []), ...photos].slice(0, 6)
    }

    if (!Array.isArray(claim.timeline)) claim.timeline = []
    claim.timeline.push({
      status: 'intimated',
      at: new Date().toISOString(),
      actor: claim.farmerName,
      note: `Formal appeal round #${claim.appealCount} lodged: ${claim.appealReason}`
    })

    claims[idx] = claim
    save(CLAIMS_STORAGE_KEY, claims)

    recordAuditLog({
      adminUid: claim.userId || 'farmer_user',
      action: 'CLAIM_APPEALED',
      targetUserId: claim.claimNumber || claim.id,
      targetUserName: `${claim.farmerName} (Round #${claim.appealCount})`,
      previousState: 'Status: rejected',
      newState: 'Status: intimated (appeal under review)',
      reason: claim.appealReason
    })

    return claim
  },

  // 8. List PMFBY Policies
  async listPolicies({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    season = 'all',
    crop = 'all',
    from = '',
    to = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let policies = getStored(POLICIES_STORAGE_KEY, mockInsurancePolicies)

    if (status !== 'all') {
      policies = policies.filter((p) => p.status === status)
    }
    if (season !== 'all') {
      policies = policies.filter((p) => p.season === season)
    }
    if (crop !== 'all') {
      policies = policies.filter((p) => p.cropName.toLowerCase() === crop.toLowerCase())
    }
    if (from) {
      policies = policies.filter((p) => (p.createdAt || '').slice(0, 10) >= from)
    }
    if (to) {
      policies = policies.filter((p) => (p.createdAt || '').slice(0, 10) <= to)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      policies = policies.filter((item) =>
        [
          item.id,
          item.policyNumber,
          item.farmerName,
          item.farmerPhone,
          item.cropName,
          item.insuranceCompany,
          item.bankName,
          item.kccAccountNo
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(policies, page, pageSize)
  },

  // 9. List Insurance Premium Rates
  async listInsuranceRates({ season = 'all', crop = 'all', category = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 80))
    let list = getStored(RATES_STORAGE_KEY, mockInsuranceRates)

    if (season !== 'all') list = list.filter((r) => r.season.toLowerCase() === season.toLowerCase())
    if (crop !== 'all') list = list.filter((r) => r.cropName.toLowerCase() === crop.toLowerCase())
    if (category !== 'all') list = list.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()))

    return { data: list, total: list.length }
  },

  // 10. Update or Add Premium Rate
  async updateInsuranceRate(rateId, payload = {}, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 120))
    const rates = getStored(RATES_STORAGE_KEY, mockInsuranceRates)
    const idx = rates.findIndex((r) => r.id === rateId || r.cropName === payload.cropName)
    let updatedRate = null

    if (idx !== -1) {
      const prev = rates[idx]
      updatedRate = {
        ...rates[idx],
        ...payload,
        updatedAt: new Date().toISOString()
      }
      rates[idx] = updatedRate

      recordAuditLog({
        adminUid,
        action: 'RATE_UPDATED',
        targetUserId: rateId,
        targetUserName: `${updatedRate.cropName} (${updatedRate.season})`,
        previousState: `Farmer: ${prev.farmerSharePercent}%, Actuarial: ${prev.actuarialRatePercent}%`,
        newState: `Farmer: ${updatedRate.farmerSharePercent}%, Actuarial: ${updatedRate.actuarialRatePercent}%`,
        reason: 'Premium rates and government subsidy tables adjusted.'
      })
    } else {
      updatedRate = {
        id: payload.id || `rate_${Date.now()}`,
        ...payload,
        status: 'active',
        updatedAt: new Date().toISOString()
      }
      rates.push(updatedRate)

      recordAuditLog({
        adminUid,
        action: 'RATE_UPDATED',
        targetUserId: updatedRate.id,
        targetUserName: `${updatedRate.cropName} (${updatedRate.season})`,
        previousState: 'N/A (New Entry)',
        newState: `Farmer: ${updatedRate.farmerSharePercent}%, Actuarial: ${updatedRate.actuarialRatePercent}%`,
        reason: 'New seasonal crop insurance rate entry created.'
      })
    }

    save(RATES_STORAGE_KEY, rates)
    return updatedRate
  },

  // 11. List Field Surveyor Panel
  async listSurveyorPanel({ q = '', agency = 'all', status = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 80))
    let surveyors = getStored(SURVEYORS_STORAGE_KEY, mockSurveyorPanel)

    if (agency !== 'all') surveyors = surveyors.filter((s) => s.agency === agency)
    if (status !== 'all') surveyors = surveyors.filter((s) => s.status === status)
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      surveyors = surveyors.filter((item) =>
        [
          item.id,
          item.name,
          item.phone,
          item.agency,
          item.qualification,
          ...(item.assignedDistricts || [])
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return { data: surveyors, total: surveyors.length }
  },

  // 12. Run DPDP Masking & 72-Hour Calamity Intimation Compliance Audit
  async auditInsuranceCompliance({ adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 150))
    const claims = getStored(CLAIMS_STORAGE_KEY, mockInsuranceClaims)

    const unmaskedAadhaar = claims.filter(
      (c) => !c.aadhaarMasked || !c.aadhaarMasked.startsWith('XXXX-XXXX-')
    )
    const lateIntimations = claims.filter(
      (c) => c.intimationElapsedHours > 72 || c.intimationCompliance === 'FLAGGED_LATE_INTIMATION'
    )
    const unmaskedAccounts = claims.filter(
      (c) => c.bankAccountLast4 && c.bankAccountLast4.length !== 4
    )

    const result = {
      timestamp: new Date().toISOString(),
      dpdpCompliance: {
        totalAudited: claims.length,
        aadhaarMaskedCount: claims.length - unmaskedAadhaar.length,
        aadhaarLeaks: unmaskedAadhaar.length,
        bankAccountMaskedCount: claims.length - unmaskedAccounts.length,
        passRate: unmaskedAadhaar.length === 0 ? 100 : 98.2,
        status: unmaskedAadhaar.length === 0 ? 'COMPLIANT' : 'ACTION_REQUIRED'
      },
      calamityIntimationRule: {
        totalClaimsChecked: claims.length,
        within72HoursCount: claims.length - lateIntimations.length,
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

    recordAuditLog({
      adminUid,
      action: 'COMPLIANCE_AUDITED',
      targetUserId: 'PORTFOLIO_SYSTEM',
      targetUserName: `All ${claims.length} PMFBY Claims`,
      previousState: 'Compliance check initiated',
      newState: `DPDP Pass: ${result.dpdpCompliance.passRate}%, Flagged Late: ${result.calamityIntimationRule.flaggedLateCount}`,
      reason: 'DPDP Act 2023 & PMFBY 72-hour statutory calamity intimation sweep executed.'
    })

    return result
  },

  // 13. List Insurance Audit Logs
  async listInsuranceAuditLogs({ page = 1, pageSize = 20, q = '', action = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let logs = getStoredAuditLogs()

    const insuranceActions = [
      'SECOND_SIGNOFF_EXECUTED',
      'SURVEYOR_ASSIGNED',
      'ASSESSMENT_REVIEWED',
      'DBT_DISBURSAL_APPROVED',
      'CLAIM_DISBURSED',
      'CLAIM_REJECTED',
      'CLAIM_STATUS_UPDATED',
      'CLAIM_APPEALED',
      'RATE_UPDATED',
      'COMPLIANCE_AUDITED'
    ]

    logs = logs.filter((log) => insuranceActions.includes(log.action) || log.id.startsWith('AUD-15'))

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
    localStorage.removeItem(CLAIMS_STORAGE_KEY)
    localStorage.removeItem(POLICIES_STORAGE_KEY)
    localStorage.removeItem(RATES_STORAGE_KEY)
    localStorage.removeItem(SURVEYORS_STORAGE_KEY)

    const existing = getStoredAuditLogs().filter((l) => !l.id.startsWith('AUD-15'))
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([...INITIAL_INSURANCE_AUDIT_LOGS, ...existing]))

    return { success: true, message: 'PMFBY crop insurance and calamity claims data reset to initial defaults.' }
  }
}
