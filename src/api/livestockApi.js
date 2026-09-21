import { request } from './client'
import {
  mockVets,
  mockGaushalas,
  mockNurseries,
  mockDairyProducts,
  mockVetBookings,
  mockManureOrders,
  mockLivestockAuditLogs,
  mockLivestockSummary
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

// In-memory clones for mutation in mock mode
let vetsState = JSON.parse(JSON.stringify(mockVets))
let gaushalasState = JSON.parse(JSON.stringify(mockGaushalas))
let nurseriesState = JSON.parse(JSON.stringify(mockNurseries))
let dairyProductsState = JSON.parse(JSON.stringify(mockDairyProducts))
let vetBookingsState = JSON.parse(JSON.stringify(mockVetBookings))
let manureOrdersState = JSON.parse(JSON.stringify(mockManureOrders))
let auditLogsState = JSON.parse(JSON.stringify(mockLivestockAuditLogs))

function filterVets({ q = '', status = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.councilRegNo,
      item.degree,
      item.clinicName,
      item.district,
      item.taluka,
      item.mobile,
      ...(item.specialization || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterGaushalas({ q = '', status = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.shortName,
      item.trustRegNo,
      item.charityCommissionNo,
      item.founderName,
      item.district,
      item.taluka,
      item.contactPhone,
      ...(item.panchagavyaProducts || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterNurseries({ q = '', status = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.shortName,
      item.nhbRegistrationNo,
      item.ownerName,
      item.district,
      item.taluka,
      item.phone,
      ...(item.specialization || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterDairyProducts({ q = '', status = 'all', category = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (category !== 'all' && item.category !== category) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.category,
      item.brandOrGaushala,
      item.fssaiLicenseNo,
      item.batchNo,
      item.labReportId,
      item.labName
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterVetBookings({ q = '', urgency = 'all', status = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (urgency !== 'all' && item.urgencyLevel !== urgency) return false
    if (status !== 'all' && item.bookingStatus !== status) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.bookingNumber,
      item.farmerName,
      item.farmerPhone,
      item.maskedAadhaar,
      item.animalType,
      item.animalIdTag,
      item.assignedVetName,
      item.village,
      item.district
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterManureOrders({ q = '', status = 'all', dualSignOff = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.deliveryStatus !== status) return false
    if (dualSignOff === 'required' && !item.dualSignOffRequired) return false
    if (dualSignOff === 'pending' && (!item.dualSignOffRequired || item.dualSignOffCompleted)) return false
    if (dualSignOff === 'completed' && (!item.dualSignOffRequired || !item.dualSignOffCompleted)) return false
    if (!needle) return true

    return [
      item.id,
      item.orderNumber,
      item.buyerName,
      item.buyerPhone,
      item.maskedAadhaar,
      item.gaushalaName,
      item.productName,
      item.vehicleNumber,
      item.driverName,
      item.deliveryDestination
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

export async function getLivestockSummary() {
  if (mockMode) return { ...mockLivestockSummary }
  try {
    const res = await request('/v1/admin/livestock/summary')
    return res?.data || mockLivestockSummary
  } catch (err) {
    mockMode = true
    return { ...mockLivestockSummary }
  }
}

export async function listVets(params = {}) {
  const { page = 1, pageSize = 20, q = '', status = 'all', district = 'all' } = params
  if (mockMode) {
    const filtered = filterVets({ q, status, district }, vetsState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/vets', { params })
    return res?.data || paginate(filterVets({ q, status, district }, vetsState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterVets({ q, status, district }, vetsState)
    return paginate(filtered, page, pageSize)
  }
}

export async function verifyVet(vetId, payload = {}) {
  const {
    status = 'verified_active',
    councilRegNo,
    verifiedBy = 'usr_admin_root',
    reason = 'Credentials & Council Registration Verified'
  } = payload

  if (mockMode) {
    const vet = vetsState.find((v) => v.id === vetId)
    if (!vet) throw new Error('Veterinarian not found')
    const prevState = vet.status
    vet.status = status
    if (councilRegNo) vet.councilRegNo = councilRegNo
    vet.verifiedAt = new Date().toISOString()
    vet.verifiedBy = verifiedBy

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid: verifiedBy,
      adminName: 'Admin Operator',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: status === 'verified_active' ? 'VERIFY_VET_CREDENTIALS' : 'UPDATE_VET_STATUS',
      entityId: vet.id,
      entityName: vet.name,
      previousState: prevState,
      newState: status,
      reason
    })
    return { success: true, data: vet }
  }

  try {
    const res = await request(`/v1/admin/livestock/vets/${vetId}/verify`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return verifyVet(vetId, payload)
  }
}

export async function listGaushalas(params = {}) {
  const { page = 1, pageSize = 20, q = '', status = 'all', district = 'all' } = params
  if (mockMode) {
    const filtered = filterGaushalas({ q, status, district }, gaushalasState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/gaushalas', { params })
    return res?.data || paginate(filterGaushalas({ q, status, district }, gaushalasState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterGaushalas({ q, status, district }, gaushalasState)
    return paginate(filtered, page, pageSize)
  }
}

export async function auditGaushala(gshId, payload = {}) {
  const {
    status = 'certified_active',
    welfareAuditScore = 95,
    auditedBy = 'usr_admin_root',
    notes = 'Gaushala cow welfare audit completed and certified.'
  } = payload

  if (mockMode) {
    const gsh = gaushalasState.find((g) => g.id === gshId)
    if (!gsh) throw new Error('Gaushala not found')
    const prevState = gsh.status
    gsh.status = status
    gsh.welfareAuditScore = welfareAuditScore
    gsh.lastAuditedAt = new Date().toISOString()
    gsh.auditedBy = auditedBy

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid: auditedBy,
      adminName: 'Admin Operator',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: 'AUDIT_GAUSHALA_WELFARE',
      entityId: gsh.id,
      entityName: gsh.name,
      previousState: prevState,
      newState: status,
      reason: notes
    })
    return { success: true, data: gsh }
  }

  try {
    const res = await request(`/v1/admin/livestock/gaushalas/${gshId}/audit`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return auditGaushala(gshId, payload)
  }
}

export async function listNurseries(params = {}) {
  const { page = 1, pageSize = 20, q = '', status = 'all', district = 'all' } = params
  if (mockMode) {
    const filtered = filterNurseries({ q, status, district }, nurseriesState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/nurseries', { params })
    return res?.data || paginate(filterNurseries({ q, status, district }, nurseriesState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterNurseries({ q, status, district }, nurseriesState)
    return paginate(filtered, page, pageSize)
  }
}

export async function approveNursery(nurseryId, payload = {}) {
  const {
    status = 'approved',
    inspectionGrade = 'A+',
    subsidyEligible = true,
    approvedBy = 'usr_admin_root',
    notes = 'Government certified sapling distribution approved.'
  } = payload

  if (mockMode) {
    const n = nurseriesState.find((item) => item.id === nurseryId)
    if (!n) throw new Error('Nursery not found')
    const prevState = n.status
    n.status = status
    n.inspectionGrade = inspectionGrade
    n.subsidyEligible = subsidyEligible
    n.approvedAt = new Date().toISOString()
    n.approvedBy = approvedBy

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid: approvedBy,
      adminName: 'Admin Operator',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: 'APPROVE_CERTIFIED_NURSERY',
      entityId: n.id,
      entityName: n.name,
      previousState: prevState,
      newState: status,
      reason: notes
    })
    return { success: true, data: n }
  }

  try {
    const res = await request(`/v1/admin/livestock/nurseries/${nurseryId}/approve`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return approveNursery(nurseryId, payload)
  }
}

export async function listDairyProducts(params = {}) {
  const { page = 1, pageSize = 20, q = '', status = 'all', category = 'all' } = params
  if (mockMode) {
    const filtered = filterDairyProducts({ q, status, category }, dairyProductsState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/dairy-products', { params })
    return res?.data || paginate(filterDairyProducts({ q, status, category }, dairyProductsState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterDairyProducts({ q, status, category }, dairyProductsState)
    return paginate(filtered, page, pageSize)
  }
}

export async function updateDairyProductStatus(productId, payload = {}) {
  const {
    status,
    recallReason = '',
    labReportId = '',
    updatedBy = 'usr_admin_root'
  } = payload

  if (mockMode) {
    const p = dairyProductsState.find((item) => item.id === productId)
    if (!p) throw new Error('Dairy product not found')
    const prevState = p.status
    p.status = status
    if (recallReason) p.recallReason = recallReason
    if (labReportId) p.labReportId = labReportId
    if (status === 'recalled') {
      p.recalledAt = new Date().toISOString()
      p.recalledBy = updatedBy
      p.stockAvailable = 0
    }

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid: updatedBy,
      adminName: 'Admin Operator',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: status === 'recalled' ? 'RECALL_DAIRY_BATCH' : 'CLEAR_DAIRY_LAB_TEST',
      entityId: p.id,
      entityName: p.name,
      previousState: prevState,
      newState: status,
      reason: recallReason || `Lab certification ${labReportId} confirmed compliant.`
    })
    return { success: true, data: p }
  }

  try {
    const res = await request(`/v1/admin/livestock/dairy-products/${productId}/status`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return updateDairyProductStatus(productId, payload)
  }
}

export async function listVetBookings(params = {}) {
  const { page = 1, pageSize = 20, q = '', urgency = 'all', status = 'all', district = 'all' } = params
  if (mockMode) {
    const filtered = filterVetBookings({ q, urgency, status, district }, vetBookingsState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/vet-bookings', { params })
    return res?.data || paginate(filterVetBookings({ q, urgency, status, district }, vetBookingsState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterVetBookings({ q, urgency, status, district }, vetBookingsState)
    return paginate(filtered, page, pageSize)
  }
}

export async function mediateVetBooking(bookingId, payload = {}) {
  const {
    action = 'refund_farmer', // 'refund_farmer', 'reassign_vet', 'close_dispute'
    reason = '',
    reassignVetId = null,
    reassignVetName = '',
    mediatedBy = 'usr_admin_root'
  } = payload

  if (mockMode) {
    const b = vetBookingsState.find((item) => item.id === bookingId)
    if (!b) throw new Error('Vet booking not found')
    const prevState = b.bookingStatus

    if (action === 'refund_farmer') {
      b.bookingStatus = 'dispute_mediation'
      b.paymentStatus = 'refunded'
      b.adminMediationRequired = true
      b.adminMediationReason = reason || 'Escrow refunded to farmer by admin mediation.'
    } else if (action === 'reassign_vet' && reassignVetId) {
      b.assignedVetId = reassignVetId
      b.assignedVetName = reassignVetName || 'Reassigned Emergency Vet'
      b.bookingStatus = 'emergency_dispatched'
      b.dispatchEtaMinutes = 20
      b.doctorNotes = `Reassigned by admin: ${reason}`
    } else {
      b.bookingStatus = 'completed'
      b.paymentStatus = 'released_to_vet'
      b.adminMediationReason = reason || 'Dispute resolved and payment released.'
    }

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid: mediatedBy,
      adminName: 'Admin Operator',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: 'MEDIATE_VET_BOOKING',
      entityId: b.id,
      entityName: `${b.bookingNumber} (${b.farmerName})`,
      previousState: prevState,
      newState: b.bookingStatus,
      reason
    })
    return { success: true, data: b }
  }

  try {
    const res = await request(`/v1/admin/livestock/vet-bookings/${bookingId}/mediate`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return mediateVetBooking(bookingId, payload)
  }
}

export async function listManureOrders(params = {}) {
  const { page = 1, pageSize = 20, q = '', status = 'all', dualSignOff = 'all' } = params
  if (mockMode) {
    const filtered = filterManureOrders({ q, status, dualSignOff }, manureOrdersState)
    return paginate(filtered, page, pageSize)
  }
  try {
    const res = await request('/v1/admin/livestock/manure-orders', { params })
    return res?.data || paginate(filterManureOrders({ q, status, dualSignOff }, manureOrdersState), page, pageSize)
  } catch (err) {
    mockMode = true
    const filtered = filterManureOrders({ q, status, dualSignOff }, manureOrdersState)
    return paginate(filtered, page, pageSize)
  }
}

export async function signOffManureOrder(orderId, payload = {}) {
  const {
    adminUid = 'usr_admin_root',
    adminName = 'Super Admin',
    role = 'Chief Risk Officer',
    reason = 'Dual sign-off authorized for bulk manure dispatch'
  } = payload

  if (mockMode) {
    const o = manureOrdersState.find((item) => item.id === orderId)
    if (!o) throw new Error('Manure order not found')

    if (!o.signOff1) {
      o.signOff1 = { adminUid, name: `${adminName} (${role})`, timestamp: new Date().toISOString() }
      o.deliveryStatus = 'pending_dual_signoff'
    } else if (!o.signOff2 && o.signOff1.adminUid !== adminUid) {
      o.signOff2 = { adminUid, name: `${adminName} (${role})`, timestamp: new Date().toISOString() }
      o.dualSignOffCompleted = true
      o.deliveryStatus = 'in_transit'
    } else {
      throw new Error('Dual sign-off requires a distinct secondary administrator')
    }

    auditLogsState.unshift({
      id: `aud_lvs_${Date.now()}`,
      adminUid,
      adminName,
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.15',
      actionType: o.dualSignOffCompleted ? 'DUAL_SIGNOFF_RELEASE' : 'MANURE_ORDER_SIGN_OFF',
      entityId: o.id,
      entityName: `${o.orderNumber} - ${o.buyerName}`,
      previousState: 'pending_signoff',
      newState: o.deliveryStatus,
      reason
    })
    return { success: true, data: o }
  }

  try {
    const res = await request(`/v1/admin/livestock/manure-orders/${orderId}/signoff`, {
      method: 'POST',
      body: payload
    })
    return res?.data || { success: true }
  } catch (err) {
    mockMode = true
    return signOffManureOrder(orderId, payload)
  }
}

export async function getLivestockAuditLogs() {
  if (mockMode) return [...auditLogsState]
  try {
    const res = await request('/v1/admin/livestock/audit-logs')
    return res?.data || auditLogsState
  } catch (err) {
    mockMode = true
    return [...auditLogsState]
  }
}
