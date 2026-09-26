import { request } from './client'
import * as adminClimateService from '../services/adminClimateService'

let apiDisabled = false

function toQueryString(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.append(k, String(v))
    }
  })
  const str = q.toString()
  return str ? `?${str}` : ''
}

// --- 1. KPI Summary ---
export async function getClimateSummary() {
  if (apiDisabled) {
    return adminClimateService.getClimateSummary()
  }
  try {
    const res = await request('GET', '/v1/admin/climate/summary')
    return res?.data || adminClimateService.getClimateSummary()
  } catch {
    apiDisabled = true
    return adminClimateService.getClimateSummary()
  }
}

// --- 2. Cold Storage Facilities ---
export async function listColdStorages(query = {}) {
  if (apiDisabled) {
    return adminClimateService.listColdStorages(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/cold-storage/facilities${qs}`)
    return res?.data || adminClimateService.listColdStorages(query)
  } catch {
    apiDisabled = true
    return adminClimateService.listColdStorages(query)
  }
}

export async function getColdStorageById(id) {
  if (apiDisabled) {
    return adminClimateService.getColdStorageById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/cold-storage/facilities/${id}`)
    return res?.data || adminClimateService.getColdStorageById(id)
  } catch {
    apiDisabled = true
    return adminClimateService.getColdStorageById(id)
  }
}

export async function createColdStorage(payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.createColdStorage(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/cold-storage/facilities', payload)
    return res?.data || adminClimateService.createColdStorage(payload, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.createColdStorage(payload, adminUid, adminName)
  }
}

export async function updateColdStorage(id, payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.updateColdStorage(id, payload, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/cold-storage/facilities/${id}`, payload)
    return res?.data || adminClimateService.updateColdStorage(id, payload, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.updateColdStorage(id, payload, adminUid, adminName)
  }
}

export async function setFacilityStatus(id, status, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.setFacilityStatus(id, status, reason, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/cold-storage/facilities/${id}/status`, { status, reason })
    return res?.data || adminClimateService.setFacilityStatus(id, status, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.setFacilityStatus(id, status, reason, adminUid, adminName)
  }
}

export async function batchUpdateFacilityStatus(ids, status, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminClimateService.batchUpdateFacilityStatus(ids, status, reason, adminUid, adminName)
}

// --- 3. Cold Storage Bookings ---
export async function listColdStorageBookings(query = {}) {
  if (apiDisabled) {
    return adminClimateService.listColdStorageBookings(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/cold-storage/bookings${qs}`)
    return res?.data || adminClimateService.listColdStorageBookings(query)
  } catch {
    apiDisabled = true
    return adminClimateService.listColdStorageBookings(query)
  }
}

export async function getColdStorageBookingById(id) {
  if (apiDisabled) {
    return adminClimateService.getColdStorageBookingById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/cold-storage/bookings/${id}`)
    return res?.data || adminClimateService.getColdStorageBookingById(id)
  } catch {
    apiDisabled = true
    return adminClimateService.getColdStorageBookingById(id)
  }
}

export async function allocateChamber(id, chamberAllocated, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.allocateChamber(id, chamberAllocated, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/cold-storage/bookings/${id}/allocate`, { chamberAllocated, reason })
    return res?.data || adminClimateService.allocateChamber(id, chamberAllocated, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.allocateChamber(id, chamberAllocated, reason, adminUid, adminName)
  }
}

export async function cancelColdStorageBooking(id, refundAmount, reason, coAdmin = null, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.cancelColdStorageBooking(id, refundAmount, reason, coAdmin, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/cold-storage/bookings/${id}/cancel`, {
      refundAmount,
      reason,
      coAdmin
    })
    return res?.data || adminClimateService.cancelColdStorageBooking(id, refundAmount, reason, coAdmin, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.cancelColdStorageBooking(id, refundAmount, reason, coAdmin, adminUid, adminName)
  }
}

export async function batchCancelBookings(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminClimateService.batchCancelBookings(ids, reason, adminUid, adminName)
}

// --- 4. Climate-Resilient Varieties ---
export async function listClimateVarieties(query = {}) {
  if (apiDisabled) {
    return adminClimateService.listClimateVarieties(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/climate/varieties${qs}`)
    return res?.data || adminClimateService.listClimateVarieties(query)
  } catch {
    apiDisabled = true
    return adminClimateService.listClimateVarieties(query)
  }
}

export async function getClimateVarietyById(id) {
  if (apiDisabled) {
    return adminClimateService.getClimateVarietyById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/climate/varieties/${id}`)
    return res?.data || adminClimateService.getClimateVarietyById(id)
  } catch {
    apiDisabled = true
    return adminClimateService.getClimateVarietyById(id)
  }
}

export async function createClimateVariety(payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.createClimateVariety(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/climate/varieties', payload)
    return res?.data || adminClimateService.createClimateVariety(payload, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.createClimateVariety(payload, adminUid, adminName)
  }
}

export async function updateClimateVariety(id, payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.updateClimateVariety(id, payload, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/climate/varieties/${id}`, payload)
    return res?.data || adminClimateService.updateClimateVariety(id, payload, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.updateClimateVariety(id, payload, adminUid, adminName)
  }
}

export async function batchUpdateVarietyStatus(ids, status, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminClimateService.batchUpdateVarietyStatus(ids, status, reason, adminUid, adminName)
}

// --- 5. Carbon Credit Audits & Payouts ---
export async function listCarbonAudits(query = {}) {
  if (apiDisabled) {
    return adminClimateService.listCarbonAudits(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/climate/carbon-audit${qs}`)
    return res?.data || adminClimateService.listCarbonAudits(query)
  } catch {
    apiDisabled = true
    return adminClimateService.listCarbonAudits(query)
  }
}

export async function getCarbonAuditById(id) {
  if (apiDisabled) {
    return adminClimateService.getCarbonAuditById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/climate/carbon-audit/${id}`)
    return res?.data || adminClimateService.getCarbonAuditById(id)
  } catch {
    apiDisabled = true
    return adminClimateService.getCarbonAuditById(id)
  }
}

export async function disburseCarbonPayout(id, reason, coAdmin = null, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.disburseCarbonPayout(id, reason, coAdmin, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/climate/carbon-audit/${id}/disburse`, { reason, coAdmin })
    return res?.data || adminClimateService.disburseCarbonPayout(id, reason, coAdmin, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.disburseCarbonPayout(id, reason, coAdmin, adminUid, adminName)
  }
}

export async function batchDisburseCarbon(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminClimateService.batchDisburseCarbon(ids, reason, adminUid, adminName)
}

// --- 6. AI Produce Quality Grading ---
export async function listProduceGradings(query = {}) {
  if (apiDisabled) {
    return adminClimateService.listProduceGradings(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/climate/produce-grading${qs}`)
    return res?.data || adminClimateService.listProduceGradings(query)
  } catch {
    apiDisabled = true
    return adminClimateService.listProduceGradings(query)
  }
}

export async function getProduceGradingById(id) {
  if (apiDisabled) {
    return adminClimateService.getProduceGradingById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/climate/produce-grading/${id}`)
    return res?.data || adminClimateService.getProduceGradingById(id)
  } catch {
    apiDisabled = true
    return adminClimateService.getProduceGradingById(id)
  }
}

export async function overrideGrading(id, manualOverrideGrade, overrideNote, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminClimateService.overrideGrading(id, manualOverrideGrade, overrideNote, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/climate/produce-grading/${id}/override`, {
      manualOverrideGrade,
      overrideNote,
      reason
    })
    return res?.data || adminClimateService.overrideGrading(id, manualOverrideGrade, overrideNote, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminClimateService.overrideGrading(id, manualOverrideGrade, overrideNote, reason, adminUid, adminName)
  }
}

export async function batchOverrideGradings(ids, overrideGrade, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminClimateService.batchOverrideGradings(ids, overrideGrade, reason, adminUid, adminName)
}

// --- 7. Audit Logs & Seed Reset ---
export async function getClimateAuditLogs(query = {}) {
  return adminClimateService.getClimateAuditLogs(query)
}

export async function getEntityAuditLogs(entityId) {
  return adminClimateService.getEntityAuditLogs(entityId)
}

export async function resetClimateSeedData(reason, adminUid, adminName) {
  return adminClimateService.resetToDefaultSeed(reason, adminUid, adminName)
}
