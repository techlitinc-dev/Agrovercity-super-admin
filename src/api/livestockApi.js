import { request } from './client'
import { adminLivestockService } from '../services/adminLivestockService'

let apiDisabled = false

export async function getLivestockSummary() {
  if (apiDisabled) {
    return adminLivestockService.getLivestockSummary()
  }
  try {
    const res = await request('/v1/admin/livestock/summary')
    return res?.data || (await adminLivestockService.getLivestockSummary())
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.getLivestockSummary()
  }
}

export async function listVets(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listVets(params)
  }
  try {
    const res = await request('/v1/admin/livestock/vets', { params })
    return res?.data || (await adminLivestockService.listVets(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listVets(params)
  }
}

export async function createVet(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createVet(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/vets', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createVet(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createVet(payload, adminUid)
  }
}

export async function verifyVet(vetId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.verifyVet(vetId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/vets/${vetId}/verify`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.verifyVet(vetId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.verifyVet(vetId, payload)
  }
}

export async function batchUpdateVets(payload) {
  return adminLivestockService.batchUpdateVets(payload)
}

export async function listGaushalas(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listGaushalas(params)
  }
  try {
    const res = await request('/v1/admin/livestock/gaushalas', { params })
    return res?.data || (await adminLivestockService.listGaushalas(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listGaushalas(params)
  }
}

export async function createGaushala(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createGaushala(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/gaushalas', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createGaushala(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createGaushala(payload, adminUid)
  }
}

export async function auditGaushala(gshId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.auditGaushala(gshId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/gaushalas/${gshId}/audit`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.auditGaushala(gshId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.auditGaushala(gshId, payload)
  }
}

export async function batchUpdateGaushalas(payload) {
  return adminLivestockService.batchUpdateGaushalas(payload)
}

export async function listNurseries(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listNurseries(params)
  }
  try {
    const res = await request('/v1/admin/livestock/nurseries', { params })
    return res?.data || (await adminLivestockService.listNurseries(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listNurseries(params)
  }
}

export async function createNursery(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createNursery(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/nurseries', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createNursery(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createNursery(payload, adminUid)
  }
}

export async function approveNursery(nurseryId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.approveNursery(nurseryId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/nurseries/${nurseryId}/approve`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.approveNursery(nurseryId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.approveNursery(nurseryId, payload)
  }
}

export async function batchUpdateNurseries(payload) {
  return adminLivestockService.batchUpdateNurseries(payload)
}

export async function listDairyProducts(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listDairyProducts(params)
  }
  try {
    const res = await request('/v1/admin/livestock/dairy-products', { params })
    return res?.data || (await adminLivestockService.listDairyProducts(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listDairyProducts(params)
  }
}

export async function createDairyProduct(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createDairyProduct(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/dairy-products', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createDairyProduct(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createDairyProduct(payload, adminUid)
  }
}

export async function updateDairyProductStatus(productId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.updateDairyProductStatus(productId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/dairy-products/${productId}/status`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.updateDairyProductStatus(productId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.updateDairyProductStatus(productId, payload)
  }
}

export async function batchUpdateDairyProducts(payload) {
  return adminLivestockService.batchUpdateDairyProducts(payload)
}

export async function listVetBookings(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listVetBookings(params)
  }
  try {
    const res = await request('/v1/admin/livestock/vet-bookings', { params })
    return res?.data || (await adminLivestockService.listVetBookings(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listVetBookings(params)
  }
}

export async function createVetBooking(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createVetBooking(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/vet-bookings', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createVetBooking(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createVetBooking(payload, adminUid)
  }
}

export async function mediateVetBooking(bookingId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.mediateVetBooking(bookingId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/vet-bookings/${bookingId}/mediate`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.mediateVetBooking(bookingId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.mediateVetBooking(bookingId, payload)
  }
}

export async function listManureOrders(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listManureOrders(params)
  }
  try {
    const res = await request('/v1/admin/livestock/manure-orders', { params })
    return res?.data || (await adminLivestockService.listManureOrders(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listManureOrders(params)
  }
}

export async function createManureOrder(payload, adminUid) {
  if (apiDisabled) {
    return adminLivestockService.createManureOrder(payload, adminUid)
  }
  try {
    const res = await request('/v1/admin/livestock/manure-orders', {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.createManureOrder(payload, adminUid))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.createManureOrder(payload, adminUid)
  }
}

export async function signOffManureOrder(orderId, payload = {}) {
  if (apiDisabled) {
    return adminLivestockService.signOffManureOrder(orderId, payload)
  }
  try {
    const res = await request(`/v1/admin/livestock/manure-orders/${orderId}/signoff`, {
      method: 'POST',
      body: payload
    })
    return res?.data || (await adminLivestockService.signOffManureOrder(orderId, payload))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.signOffManureOrder(orderId, payload)
  }
}

// Implements SOP-19 Section 5: GET /v1/admin/livestock/orders
export async function auditOrders(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.auditOrders(params)
  }
  try {
    const res = await request('/v1/admin/livestock/orders', { params })
    return res?.data || (await adminLivestockService.auditOrders(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.auditOrders(params)
  }
}

export async function getLivestockAuditLogs(params = {}) {
  if (apiDisabled) {
    return adminLivestockService.listLivestockAuditLogs(params)
  }
  try {
    const res = await request('/v1/admin/livestock/audit-logs', { params })
    return res?.data || (await adminLivestockService.listLivestockAuditLogs(params))
  } catch (err) {
    apiDisabled = true
    return adminLivestockService.listLivestockAuditLogs(params)
  }
}

export async function resetLivestockSeedData(reason, adminUid) {
  return adminLivestockService.resetToDefaultSeed(reason, adminUid)
}
