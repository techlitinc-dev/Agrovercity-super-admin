import { request } from './client'
import { adminLandRecordsService } from '../services/adminLandRecordsService'

let mockMode = false

export function isMockMode() {
  return mockMode
}

export async function getLandRecordsSummary() {
  if (mockMode) return adminLandRecordsService.getLandRecordsSummary()
  try {
    return await request('GET', '/admin/land-records/summary')
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.getLandRecordsSummary()
  }
}

export async function getGatewayStatus() {
  if (mockMode) return adminLandRecordsService.getGatewayStatus()
  try {
    return await request('GET', '/admin/land-records/status')
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.getGatewayStatus()
  }
}

export async function listLandRecords(params = {}) {
  if (mockMode) return adminLandRecordsService.listLandRecords(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.status && params.status !== 'all') q.set('status', params.status)
    if (params.recordType && params.recordType !== 'all') q.set('recordType', params.recordType)
    if (params.district && params.district !== 'all') q.set('district', params.district)
    if (params.landClass && params.landClass !== 'all') q.set('landClass', params.landClass)
    if (params.hasEncumbranceOnly || params.encumbranceOnly) q.set('encumbranceOnly', 'true')
    if (params.from) q.set('from', params.from)
    if (params.to) q.set('to', params.to)
    return await request('GET', `/admin/land-records/records?${q}`)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.listLandRecords(params)
  }
}

export async function listUserImportedRecords(params = {}) {
  if (mockMode) return adminLandRecordsService.listUserImportedRecords(params)
  try {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.pageSize) q.set('pageSize', String(params.pageSize))
    if (params.q) q.set('q', params.q)
    if (params.importStatus && params.importStatus !== 'all') q.set('importStatus', params.importStatus)
    if (params.district && params.district !== 'all') q.set('district', params.district)
    return await request('GET', `/admin/land-records/user-imports?${q}`)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.listUserImportedRecords(params)
  }
}

export async function getAuditLogs(params = {}) {
  return adminLandRecordsService.listLandRecordsAuditLogs(params)
}

export async function manualProvisionRecord(payload = {}) {
  if (mockMode) return adminLandRecordsService.manualProvisionRecord(payload)
  try {
    return await request('POST', '/admin/land-records/manual-provision', payload)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.manualProvisionRecord(payload)
  }
}

export async function resolveDiscrepancy(recordId, payload = {}) {
  if (mockMode) return adminLandRecordsService.resolveDiscrepancy(recordId, payload)
  try {
    return await request('POST', `/admin/land-records/${recordId}/resolve-discrepancy`, payload)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.resolveDiscrepancy(recordId, payload)
  }
}

export async function refreshRecordFromPortal(recordId) {
  if (mockMode) return adminLandRecordsService.refreshRecordFromPortal(recordId)
  try {
    return await request('POST', `/admin/land-records/${recordId}/refresh`)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.refreshRecordFromPortal(recordId)
  }
}

export async function seedVillageRecords(payload = {}) {
  if (mockMode) return adminLandRecordsService.seedVillageRecords(payload)
  try {
    return await request('POST', '/admin/land-records/seed', payload)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.seedVillageRecords(payload)
  }
}

export async function exportGovernmentCompliance(payload = {}) {
  if (mockMode) return adminLandRecordsService.exportGovernmentCompliance(payload)
  try {
    return await request('POST', '/admin/land-records/export-compliance', payload)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.exportGovernmentCompliance(payload)
  }
}

export async function auditCompliance(payload = {}) {
  if (mockMode) return adminLandRecordsService.auditCompliance(payload)
  try {
    return await request('POST', '/admin/land-records/audit-compliance', payload)
  } catch (err) {
    mockMode = true
    return adminLandRecordsService.auditCompliance(payload)
  }
}

export async function resetLandRecordsSeedData() {
  return adminLandRecordsService.resetToDefaultSeed()
}
