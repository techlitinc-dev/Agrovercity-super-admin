import { request } from './client'
import {
  mockColdStorages,
  mockColdStorageBookings,
  mockClimateVarieties,
  mockCarbonAudits,
  mockProduceGradings,
  mockClimateAuditLogs,
  mockClimateSummary
} from './climateMockData'

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
let storagesState = JSON.parse(JSON.stringify(mockColdStorages))
let bookingsState = JSON.parse(JSON.stringify(mockColdStorageBookings))
let varietiesState = JSON.parse(JSON.stringify(mockClimateVarieties))
let carbonState = JSON.parse(JSON.stringify(mockCarbonAudits))
let gradingsState = JSON.parse(JSON.stringify(mockProduceGradings))
let auditLogsState = JSON.parse(JSON.stringify(mockClimateAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_clm_${Date.now()}`,
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
    reason: reason || 'Routine climate module administrative action'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

// --- 1. KPI Summary ---
export async function getClimateSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/climate/summary')
    } catch {
      mockMode = true
    }
  }

  const totalCap = storagesState.reduce((acc, s) => acc + (s.totalCapacityMt || 0), 0)
  const availCap = storagesState.reduce((acc, s) => acc + (s.availableCapacityMt || 0), 0)
  const util = totalCap > 0 ? Math.round(((totalCap - availCap) / totalCap) * 1000) / 10 : 0
  const activeBookings = bookingsState.filter((b) => b.status === 'active' || b.status === 'confirmed').length
  const carbonMt = carbonState.reduce((acc, c) => acc + (c.estimatedCreditsMtCo2e || 0), 0)
  const carbonPayout = carbonState.reduce((acc, c) => acc + (c.netPayoutInr || 0), 0)
  const flaggedAudits = carbonState.filter((c) => c.status === 'audit_flagged').length

  return {
    totalCapacityMt: totalCap,
    availableCapacityMt: availCap,
    utilizationRatePct: util,
    activeFacilitiesCount: storagesState.filter((s) => s.status === 'active').length,
    activeBookingsCount: activeBookings,
    totalBookingsGrossInr: bookingsState.reduce((acc, b) => acc + (b.totalFee || 0), 0),
    certifiedVarietiesCount: varietiesState.filter((v) => v.status === 'certified').length,
    carbonCreditsCertifiedMt: Math.round(carbonMt * 10) / 10,
    carbonPayoutTotalInr: carbonPayout,
    flaggedCarbonAudits: flaggedAudits,
    aiGradingChecksToday: 48,
    aiGradingAccuracyPct: 96.8
  }
}

// --- 2. Cold Storage Facilities ---
export async function listColdStorages(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', district = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/cold-storage/facilities', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...storagesState]
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
        s.name?.toLowerCase().includes(q) ||
        s.operatorName?.toLowerCase().includes(q) ||
        s.district?.toLowerCase().includes(q) ||
        s.fssaiLicense?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function createColdStorage(payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', '/v1/admin/cold-storage/facilities', payload)
    } catch {
      mockMode = true
    }
  }

  const newFacility = {
    id: `cs_fac_${Date.now()}`,
    ...payload,
    availableCapacityMt: Number(payload.totalCapacityMt || 0),
    totalCapacityMt: Number(payload.totalCapacityMt || 0),
    chambersCount: Number(payload.chambersCount || 4),
    monthlyRatePerMt: Number(payload.monthlyRatePerMt || 1000),
    monthlyRatePerQuintal: Number(payload.monthlyRatePerQuintal || 100),
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  storagesState.unshift(newFacility)
  recordAudit({
    actionType: 'ONBOARD_COLD_STORAGE',
    entityId: newFacility.id,
    entityName: newFacility.name,
    collection: 'cold_storages',
    previousState: null,
    newState: `totalCapacity: ${newFacility.totalCapacityMt} MT`,
    reason: 'Onboarded new verified cold chain partner facility',
    adminName
  })
  return newFacility
}

export async function updateColdStorage(id, payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('PUT', `/v1/admin/cold-storage/facilities/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = storagesState.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error('Facility not found')
  const prev = { ...storagesState[idx] }
  storagesState[idx] = {
    ...storagesState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }
  recordAudit({
    actionType: 'UPDATE_COLD_STORAGE',
    entityId: id,
    entityName: storagesState[idx].name,
    collection: 'cold_storages',
    previousState: JSON.stringify({ rate: prev.monthlyRatePerMt, cap: prev.totalCapacityMt }),
    newState: JSON.stringify({ rate: storagesState[idx].monthlyRatePerMt, cap: storagesState[idx].totalCapacityMt }),
    reason: 'Updated facility operational specs & rate card',
    adminName
  })
  return storagesState[idx]
}

export async function setFacilityStatus(id, status, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('PUT', `/v1/admin/cold-storage/facilities/${id}/status`, { status, reason })
    } catch {
      mockMode = true
    }
  }

  const fac = storagesState.find((s) => s.id === id)
  if (!fac) throw new Error('Facility not found')
  const prevStatus = fac.status
  fac.status = status
  fac.updatedAt = new Date().toISOString()
  recordAudit({
    actionType: 'SET_FACILITY_STATUS',
    entityId: id,
    entityName: fac.name,
    collection: 'cold_storages',
    previousState: `status: ${prevStatus}`,
    newState: `status: ${status}`,
    reason: reason || `Admin updated status to ${status}`,
    adminName
  })
  return fac
}

// --- 3. Cold Storage Bookings ---
export async function listColdStorageBookings(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', facilityId = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/cold-storage/bookings', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...bookingsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((b) => b.status === status)
  }
  if (facilityId && facilityId !== 'all') {
    filtered = filtered.filter((b) => b.facilityId === facilityId)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.farmerName?.toLowerCase().includes(q) ||
        b.cropType?.toLowerCase().includes(q) ||
        b.facilityName?.toLowerCase().includes(q) ||
        b.chamberAllocated?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function allocateChamber(id, chamberAllocated, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/cold-storage/bookings/${id}/allocate`, { chamberAllocated, reason })
    } catch {
      mockMode = true
    }
  }

  const bk = bookingsState.find((b) => b.id === id)
  if (!bk) throw new Error('Booking not found')
  const prevChamber = bk.chamberAllocated
  bk.chamberAllocated = chamberAllocated
  bk.updatedAt = new Date().toISOString()
  recordAudit({
    actionType: 'ALLOCATE_CHAMBER',
    entityId: id,
    entityName: `${bk.farmerName} (${bk.cropType})`,
    collection: 'cold_storage_bookings',
    previousState: `chamber: ${prevChamber}`,
    newState: `chamber: ${chamberAllocated}`,
    reason: reason || 'Assigned physical cold chamber to booking',
    adminName
  })
  return bk
}

export async function cancelColdStorageBooking(id, refundAmount, reason, coAdmin = null, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/cold-storage/bookings/${id}/cancel`, {
        refundAmount,
        reason,
        coAdmin
      })
    } catch {
      mockMode = true
    }
  }

  const bk = bookingsState.find((b) => b.id === id)
  if (!bk) throw new Error('Booking not found')

  // Return capacity back to facility
  const fac = storagesState.find((s) => s.id === bk.facilityId)
  if (fac) {
    fac.availableCapacityMt = Math.min(fac.totalCapacityMt, fac.availableCapacityMt + bk.quantityMt)
  }

  const prevStatus = bk.status
  bk.status = 'cancelled'
  bk.paymentStatus = 'refunded'
  bk.disputeReason = reason || 'Admin cancelled reservation'
  bk.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: refundAmount > 50000 ? 'DUAL_SIGNOFF_BOOKING_CANCEL' : 'CANCEL_BOOKING',
    entityId: id,
    entityName: `${bk.farmerName} (${bk.cropType})`,
    collection: 'cold_storage_bookings',
    previousState: `status: ${prevStatus}, fee: ₹${bk.totalFee}`,
    newState: `status: cancelled, refund: ₹${refundAmount}${coAdmin ? ` (Co-admin: ${coAdmin.secondAdminEmail})` : ''}`,
    reason: reason || 'Administrative slot release and refund processed',
    adminName
  })
  return bk
}

// --- 4. Climate-Resilient Varieties ---
export async function listClimateVarieties(query = {}) {
  const { page = 1, pageSize = 20, search = '', resilienceType = 'all', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/climate/varieties', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...varietiesState]
  if (resilienceType && resilienceType !== 'all') {
    filtered = filtered.filter((v) => v.resilienceType === resilienceType)
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((v) => v.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (v) =>
        v.cropName?.toLowerCase().includes(q) ||
        v.varietyCode?.toLowerCase().includes(q) ||
        v.commonName?.toLowerCase().includes(q) ||
        v.certifyingAgency?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function createClimateVariety(payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', '/v1/admin/climate/varieties', payload)
    } catch {
      mockMode = true
    }
  }

  const newVariety = {
    id: `cv_var_${Date.now()}`,
    ...payload,
    breederSeedAvailable: Boolean(payload.breederSeedAvailable ?? true),
    status: payload.status || 'certified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  varietiesState.unshift(newVariety)
  recordAudit({
    actionType: 'CREATE_CLIMATE_VARIETY',
    entityId: newVariety.id,
    entityName: `${newVariety.cropName} (${newVariety.varietyCode})`,
    collection: 'climate_varieties',
    previousState: null,
    newState: `status: ${newVariety.status}, agency: ${newVariety.certifyingAgency}`,
    reason: 'Enrolled ICAR / State agricultural university climate-resilient variety',
    adminName
  })
  return newVariety
}

export async function updateClimateVariety(id, payload, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('PUT', `/v1/admin/climate/varieties/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = varietiesState.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error('Variety not found')
  const prev = { ...varietiesState[idx] }
  varietiesState[idx] = {
    ...varietiesState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }
  recordAudit({
    actionType: 'UPDATE_CLIMATE_VARIETY',
    entityId: id,
    entityName: `${varietiesState[idx].cropName} (${varietiesState[idx].varietyCode})`,
    collection: 'climate_varieties',
    previousState: JSON.stringify({ yield: prev.averageYieldQtlPerHa, status: prev.status }),
    newState: JSON.stringify({ yield: varietiesState[idx].averageYieldQtlPerHa, status: varietiesState[idx].status }),
    reason: 'Updated variety agronomic specs and certification status',
    adminName
  })
  return varietiesState[idx]
}

// --- 5. Carbon Credit Audits & Payouts ---
export async function listCarbonAudits(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/climate/carbon-audit', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...carbonState]
  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.farmerName?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.verifierAgency?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function disburseCarbonPayout(id, reason, coAdmin = null, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/climate/carbon-audit/${id}/disburse`, { reason, coAdmin })
    } catch {
      mockMode = true
    }
  }

  const aud = carbonState.find((c) => c.id === id)
  if (!aud) throw new Error('Carbon audit not found')
  const prevStatus = aud.status
  aud.status = 'disbursed'
  aud.disbursedAt = new Date().toISOString()
  aud.signOffBy1 = adminName
  if (coAdmin) {
    aud.signOffBy2 = coAdmin.secondAdminEmail
  }
  aud.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: aud.netPayoutInr > 50000 ? 'DUAL_SIGNOFF_CARBON_DISBURSE' : 'DISBURSE_CARBON_PAYOUT',
    entityId: id,
    entityName: aud.farmerName,
    collection: 'carbon_audits',
    previousState: `status: ${prevStatus}`,
    newState: `status: disbursed, net: ₹${aud.netPayoutInr}${coAdmin ? ` (Co-admin: ${coAdmin.secondAdminEmail})` : ''}`,
    reason: reason || 'Disbursed verified carbon credit payout to farmer bank account',
    adminName
  })
  return aud
}

// --- 6. AI Produce Quality Grading ---
export async function listProduceGradings(query = {}) {
  const { page = 1, pageSize = 20, search = '', status = 'all', commodity = 'all' } = query
  if (!mockMode) {
    try {
      return await request('GET', '/v1/admin/climate/produce-grading', { params: query })
    } catch {
      mockMode = true
    }
  }

  let filtered = [...gradingsState]
  if (status && status !== 'all') {
    filtered = filtered.filter((g) => g.status === status)
  }
  if (commodity && commodity !== 'all') {
    filtered = filtered.filter((g) => g.commodity?.toLowerCase().includes(commodity.toLowerCase()))
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (g) =>
        g.farmerName?.toLowerCase().includes(q) ||
        g.commodity?.toLowerCase().includes(q) ||
        g.lotId?.toLowerCase().includes(q) ||
        g.aiPredictedGrade?.toLowerCase().includes(q) ||
        g.id?.toLowerCase().includes(q)
    )
  }
  return paginate(filtered, Number(page), Number(pageSize))
}

export async function overrideGrading(id, manualOverrideGrade, overrideNote, reason, adminName = 'Super Admin') {
  if (!mockMode) {
    try {
      return await request('POST', `/v1/admin/climate/produce-grading/${id}/override`, {
        manualOverrideGrade,
        overrideNote,
        reason
      })
    } catch {
      mockMode = true
    }
  }

  const grd = gradingsState.find((g) => g.id === id)
  if (!grd) throw new Error('Grading check not found')
  const prevGrade = grd.manualOverrideGrade || grd.aiPredictedGrade
  grd.manualOverrideGrade = manualOverrideGrade
  grd.overrideNote = overrideNote
  grd.status = 'overridden'
  grd.updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'OVERRIDE_AI_GRADING',
    entityId: id,
    entityName: `${grd.farmerName} (${grd.commodity})`,
    collection: 'produce_gradings',
    previousState: `grade: ${prevGrade}`,
    newState: `manualGrade: ${manualOverrideGrade}`,
    reason: reason || 'Calibrated quality classification via manual optical inspection',
    adminName
  })
  return grd
}

// --- 7. Audit Logs ---
export async function getClimateAuditLogs(query = {}) {
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
