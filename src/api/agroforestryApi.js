import { request } from './client'
import { adminAgroforestryService } from '../services/adminAgroforestryService'

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

// -------------------------------------------------------------
// 1. SUMMARY
// -------------------------------------------------------------
export async function getAgroforestrySummary() {
  if (apiDisabled) {
    return adminAgroforestryService.getAgroforestrySummary()
  }
  try {
    const res = await request('GET', '/admin/tree/summary')
    return res?.data || (await adminAgroforestryService.getAgroforestrySummary())
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getAgroforestrySummary()
  }
}

// -------------------------------------------------------------
// 2. SAPLING REQUESTS (/v1/admin/tree/requests)
// -------------------------------------------------------------
export async function listSaplingRequests(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.listSaplingRequests(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/requests${qs}`)
    return res?.data || (await adminAgroforestryService.listSaplingRequests(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.listSaplingRequests(params)
  }
}

export async function getSaplingRequestById(id) {
  if (apiDisabled) {
    return adminAgroforestryService.getSaplingRequestById(id)
  }
  try {
    const res = await request('GET', `/admin/tree/requests/${id}`)
    return res?.data || (await adminAgroforestryService.getSaplingRequestById(id))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getSaplingRequestById(id)
  }
}

export async function updateSaplingRequestStatus(id, newStatus, details = {}, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.updateSaplingRequestStatus(id, newStatus, details, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/requests/${id}/status`, { status: newStatus, ...details })
    return res?.data || (await adminAgroforestryService.updateSaplingRequestStatus(id, newStatus, details, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.updateSaplingRequestStatus(id, newStatus, details, adminUid, adminName)
  }
}

export async function batchUpdateSaplingStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminAgroforestryService.batchUpdateSaplingStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 3. NGOS & PARTNER NURSERIES (/v1/admin/tree/ngos)
// -------------------------------------------------------------
export async function listNgos(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.listNgos(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/ngos${qs}`)
    return res?.data || (await adminAgroforestryService.listNgos(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.listNgos(params)
  }
}

export async function getNgoById(id) {
  if (apiDisabled) {
    return adminAgroforestryService.getNgoById(id)
  }
  try {
    const res = await request('GET', `/admin/tree/ngos/${id}`)
    return res?.data || (await adminAgroforestryService.getNgoById(id))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getNgoById(id)
  }
}

export async function createNgo(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.createNgo(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/admin/tree/ngos', payload)
    return res?.data || (await adminAgroforestryService.createNgo(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.createNgo(payload, adminUid, adminName)
  }
}

export async function updateNgo(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.updateNgo(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/ngos/${id}`, patch)
    return res?.data || (await adminAgroforestryService.updateNgo(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.updateNgo(id, patch, adminUid, adminName)
  }
}

export async function verifyNgo(id, status, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.verifyNgo(id, status, reason, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/ngos/${id}/verify`, { status, reason })
    return res?.data || (await adminAgroforestryService.verifyNgo(id, status, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.verifyNgo(id, status, reason, adminUid, adminName)
  }
}

export async function batchUpdateNgoStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminAgroforestryService.batchUpdateNgoStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 4. COMMERCIAL BIOFUEL TREES (/v1/admin/tree/biofuel)
// -------------------------------------------------------------
export async function listBiofuelTrees(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.listBiofuelTrees(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/biofuel${qs}`)
    return res?.data || (await adminAgroforestryService.listBiofuelTrees(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.listBiofuelTrees(params)
  }
}

export async function getBiofuelTreeById(id) {
  if (apiDisabled) {
    return adminAgroforestryService.getBiofuelTreeById(id)
  }
  try {
    const res = await request('GET', `/admin/tree/biofuel/${id}`)
    return res?.data || (await adminAgroforestryService.getBiofuelTreeById(id))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getBiofuelTreeById(id)
  }
}

export async function createBiofuelTree(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.createBiofuelTree(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/admin/tree/biofuel', payload)
    return res?.data || (await adminAgroforestryService.createBiofuelTree(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.createBiofuelTree(payload, adminUid, adminName)
  }
}

export async function updateBiofuelEconomics(id, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.updateBiofuelEconomics(id, payload, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/biofuel/${id}`, payload)
    return res?.data || (await adminAgroforestryService.updateBiofuelEconomics(id, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.updateBiofuelEconomics(id, payload, adminUid, adminName)
  }
}

// -------------------------------------------------------------
// 5. TREE CARE GUIDES (/v1/admin/tree/care-guides)
// -------------------------------------------------------------
export async function listTreeCareGuides(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.listTreeCareGuides(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/care-guides${qs}`)
    return res?.data || (await adminAgroforestryService.listTreeCareGuides(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.listTreeCareGuides(params)
  }
}

export async function getTreeCareGuideById(id) {
  if (apiDisabled) {
    return adminAgroforestryService.getTreeCareGuideById(id)
  }
  try {
    const res = await request('GET', `/admin/tree/care-guides/${id}`)
    return res?.data || (await adminAgroforestryService.getTreeCareGuideById(id))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getTreeCareGuideById(id)
  }
}

export async function createTreeCareGuide(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.createTreeCareGuide(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/admin/tree/care-guides', payload)
    return res?.data || (await adminAgroforestryService.createTreeCareGuide(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.createTreeCareGuide(payload, adminUid, adminName)
  }
}

export async function updateTreeCareGuide(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.updateTreeCareGuide(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/care-guides/${id}`, patch)
    return res?.data || (await adminAgroforestryService.updateTreeCareGuide(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.updateTreeCareGuide(id, patch, adminUid, adminName)
  }
}

export async function deleteTreeCareGuide(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.deleteTreeCareGuide(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/admin/tree/care-guides/${id}`, { reason })
    return res?.data || (await adminAgroforestryService.deleteTreeCareGuide(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.deleteTreeCareGuide(id, reason, adminUid, adminName)
  }
}

export async function batchUpdateCareGuideStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminAgroforestryService.batchUpdateCareGuideStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 6. AGROFORESTRY MODELS / ARTICLES (/v1/admin/tree/articles)
// -------------------------------------------------------------
export async function listTreeArticles(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.listTreeArticles(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/articles${qs}`)
    return res?.data || (await adminAgroforestryService.listTreeArticles(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.listTreeArticles(params)
  }
}

export async function getTreeArticleById(id) {
  if (apiDisabled) {
    return adminAgroforestryService.getTreeArticleById(id)
  }
  try {
    const res = await request('GET', `/admin/tree/articles/${id}`)
    return res?.data || (await adminAgroforestryService.getTreeArticleById(id))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getTreeArticleById(id)
  }
}

export async function createTreeArticle(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.createTreeArticle(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/admin/tree/articles', payload)
    return res?.data || (await adminAgroforestryService.createTreeArticle(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.createTreeArticle(payload, adminUid, adminName)
  }
}

export async function updateTreeArticle(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.updateTreeArticle(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/tree/articles/${id}`, patch)
    return res?.data || (await adminAgroforestryService.updateTreeArticle(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.updateTreeArticle(id, patch, adminUid, adminName)
  }
}

export async function deleteTreeArticle(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminAgroforestryService.deleteTreeArticle(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/admin/tree/articles/${id}`, { reason })
    return res?.data || (await adminAgroforestryService.deleteTreeArticle(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.deleteTreeArticle(id, reason, adminUid, adminName)
  }
}

export async function batchUpdateTreeArticleStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminAgroforestryService.batchUpdateTreeArticleStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 7. AUDIT LOGS (/v1/admin/tree/audit_logs)
// -------------------------------------------------------------
export async function getAgroforestryAuditLogs(params = {}) {
  if (apiDisabled) {
    return adminAgroforestryService.getAgroforestryAuditLogs(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/tree/audit_logs${qs}`)
    return res?.data || (await adminAgroforestryService.getAgroforestryAuditLogs(params))
  } catch {
    apiDisabled = true
    return adminAgroforestryService.getAgroforestryAuditLogs(params)
  }
}

export async function getEntityAuditLogs(entityId) {
  return adminAgroforestryService.getEntityAuditLogs(entityId)
}

// -------------------------------------------------------------
// 8. BENCHMARK SEED RESET
// -------------------------------------------------------------
export async function resetAgroforestrySeedData(reason, adminUid, adminName) {
  return adminAgroforestryService.resetToDefaultSeed(reason, adminUid, adminName)
}
