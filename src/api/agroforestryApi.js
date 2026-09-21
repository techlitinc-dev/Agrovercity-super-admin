import { request } from './client'
import {
  mockSaplingRequests,
  mockNgos,
  mockBiofuelTrees,
  mockTreeCareGuides,
  mockTreeArticles,
  mockAgroforestryAuditLogs,
  mockAgroforestrySummary
} from './agroforestryMockData'

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
let requestsState = JSON.parse(JSON.stringify(mockSaplingRequests))
let ngosState = JSON.parse(JSON.stringify(mockNgos))
let biofuelState = JSON.parse(JSON.stringify(mockBiofuelTrees))
let careGuidesState = JSON.parse(JSON.stringify(mockTreeCareGuides))
let articlesState = JSON.parse(JSON.stringify(mockTreeArticles))
let auditLogsState = JSON.parse(JSON.stringify(mockAgroforestryAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_tree_${Date.now()}`,
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
    reason: reason || 'Routine agroforestry administration'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

export async function getAgroforestrySummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/admin/tree/summary')
    } catch {
      mockMode = true
    }
  }

  const pending = requestsState.filter((r) => r.status === 'pending').length
  const approvedOrDispatched = requestsState.filter((r) => ['approved', 'dispatched', 'delivered'].includes(r.status)).length
  const totalSaplings = requestsState.reduce((sum, r) => sum + (r.quantity || 0), 0)

  return {
    ...mockAgroforestrySummary,
    totalSaplingRequests: requestsState.length,
    pendingReviewRequests: pending,
    approvedAndDispatched: approvedOrDispatched,
    totalSaplingsDistributed: totalSaplings + 420000,
    activeNgosPartnered: ngosState.filter((n) => n.status === 'verified').length
  }
}

// -------------------------------------------------------------
// 1. SAPLING REQUESTS (/v1/admin/tree/requests)
// -------------------------------------------------------------
export async function listSaplingRequests({ q = '', status = 'all', treeCategory = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, treeCategory, page, pageSize })
      return await request('GET', `/admin/tree/requests?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = requestsState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (treeCategory !== 'all' && item.treeCategory !== treeCategory) return false
    if (!needle) return true
    return [
      item.id,
      item.farmerName,
      item.farmerPhone,
      item.district,
      item.speciesRequested,
      item.surveyNumber712
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function updateSaplingRequestStatus(id, newStatus, { reason = '', trackingNo = '', survivalRate = null, dualSignOffAdmin = null } = {}) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/tree/requests/${id}/status`, { status: newStatus, reason, trackingNo, survivalRate, dualSignOffAdmin })
    } catch {
      mockMode = true
    }
  }

  const idx = requestsState.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error('Sapling request not found')

  const prev = requestsState[idx].status
  requestsState[idx].status = newStatus
  requestsState[idx].updatedAt = new Date().toISOString()
  if (trackingNo) requestsState[idx].dispatchTrackingNo = trackingNo
  if (survivalRate !== null) requestsState[idx].survivalRatePercent = Number(survivalRate)

  recordAudit({
    actionType: `UPDATE_SAPLING_REQUEST_${newStatus.toUpperCase()}`,
    entityId: id,
    entityName: `Sapling request for ${requestsState[idx].farmerName}`,
    collection: 'sapling_requests',
    previousState: prev,
    newState: newStatus,
    reason: `${reason}${dualSignOffAdmin ? ` [Dual Sign-Off: ${dualSignOffAdmin}]` : ''}`
  })

  return requestsState[idx]
}

// -------------------------------------------------------------
// 2. NGOS & PARTNER NURSERIES (/v1/admin/tree/ngos)
// -------------------------------------------------------------
export async function listNgos({ q = '', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, page, pageSize })
      return await request('GET', `/admin/tree/ngos?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = ngosState.filter((ngo) => {
    if (status !== 'all' && ngo.status !== status) return false
    if (!needle) return true
    return [ngo.id, ngo.name, ngo.darpanId, ngo.district, ngo.contactPerson]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function verifyNgo(id, status, reason = '') {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/tree/ngos/${id}/verify`, { status, reason })
    } catch {
      mockMode = true
    }
  }

  const idx = ngosState.findIndex((n) => n.id === id)
  if (idx === -1) throw new Error('NGO not found')

  const prev = ngosState[idx].status
  ngosState[idx].status = status
  ngosState[idx].verified = status === 'verified'
  ngosState[idx].updatedAt = new Date().toISOString()

  recordAudit({
    actionType: status === 'verified' ? 'VERIFY_AFFORESTATION_NGO' : 'SUSPEND_AFFORESTATION_NGO',
    entityId: id,
    entityName: ngosState[idx].name,
    collection: 'ngos',
    previousState: prev,
    newState: status,
    reason: reason || 'NGO verification status updated by superadmin'
  })

  return ngosState[idx]
}

// -------------------------------------------------------------
// 3. BIOFUEL TREES CATALOG
// -------------------------------------------------------------
export async function listBiofuelTrees({ q = '', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      return await request('GET', `/admin/tree/biofuel?q=${q}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = biofuelState.filter((b) => {
    if (!needle) return true
    return [b.id, b.commonName, b.botanicalName, b.buybackPartner]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function updateBiofuelEconomics(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/tree/biofuel/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = biofuelState.findIndex((b) => b.id === id)
  if (idx === -1) throw new Error('Biofuel tree not found')

  const prev = { ...biofuelState[idx] }
  biofuelState[idx] = {
    ...biofuelState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_BIOFUEL_ECONOMICS',
    entityId: id,
    entityName: biofuelState[idx].commonName,
    collection: 'biofuel_trees',
    previousState: `Return: ₹${prev.annualGrossReturnPerAcreINR}/acre`,
    newState: `Return: ₹${biofuelState[idx].annualGrossReturnPerAcreINR}/acre`,
    reason: payload.reason || 'Recalibrated crop economics & seed market buyback prices'
  })

  return biofuelState[idx]
}

// -------------------------------------------------------------
// 4. TREE CARE GUIDES
// -------------------------------------------------------------
export async function listTreeCareGuides({ q = '', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      return await request('GET', `/admin/tree/care-guides?q=${q}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = careGuidesState.filter((g) => {
    if (!needle) return true
    return [g.id, g.title, g.species, g.soilType]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createTreeCareGuide(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/tree/care-guides', payload)
    } catch {
      mockMode = true
    }
  }

  const newGuide = {
    id: `guide_${Date.now()}`,
    ...payload,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  careGuidesState.unshift(newGuide)

  recordAudit({
    actionType: 'CREATE_TREE_CARE_GUIDE',
    entityId: newGuide.id,
    entityName: newGuide.title,
    collection: 'tree_care_guides',
    previousState: 'none',
    newState: 'published',
    reason: `Published agronomy planting care guide for ${newGuide.species}.`
  })

  return newGuide
}

// -------------------------------------------------------------
// 5. TREE ARTICLES & INTERCROPPING
// -------------------------------------------------------------
export async function listTreeArticles({ q = '', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      return await request('GET', `/admin/tree/articles?q=${q}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = articlesState.filter((a) => {
    if (!needle) return true
    return [a.id, a.title, a.intercroppingModel, a.author]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

// -------------------------------------------------------------
// 6. AUDIT LOGS
// -------------------------------------------------------------
export async function getAgroforestryAuditLogs({ q = '', actionType = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, actionType, page, pageSize })
      return await request('GET', `/admin/tree/audit_logs?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = auditLogsState.filter((log) => {
    if (actionType !== 'all' && log.actionType !== actionType) return false
    if (!needle) return true
    return [log.id, log.adminName, log.entityId, log.entityName, log.actionType, log.reason]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}
