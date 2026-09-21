import { request } from './client'
import {
  mockLandRecords712,
  mockUserImportedRecords,
  mockRevenueGatewayStatus,
  mockLandRecordsAuditLogs,
  mockLandRecordsSummary
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

function filterRecords({ q = '', status = 'all', recordType = 'all', district = 'all', landClass = 'all', encumbranceOnly = false, from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (recordType !== 'all' && item.recordType !== recordType) return false
    if (district !== 'all' && item.district !== district) return false
    if (landClass !== 'all' && !item.landClass.toLowerCase().includes(landClass.toLowerCase())) return false
    if (encumbranceOnly && !item.hasEncumbrance) return false
    if (from && item.lastFetchedAt < from) return false
    if (to && item.lastFetchedAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.gatNumber,
      item.khataNumber,
      item.ferfarNumber,
      item.village,
      item.taluka,
      item.district,
      item.state,
      item.ownerName,
      item.vernacularOwnerName,
      item.encumbrances,
      item.sourcePortal,
      item.cropHistory
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterImports({ q = '', importStatus = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (importStatus !== 'all' && item.importStatus !== importStatus) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.userId,
      item.farmerName,
      item.farmerPhone,
      item.aadhaarMasked,
      item.gatNumber,
      item.village,
      item.district,
      item.syncTargetProfile
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 140))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // 1. KPI Summary
  if (method === 'GET' && (pathname === '/admin/land-records/summary' || pathname === '/v1/admin/land-records/summary')) {
    const totalRecords = mockLandRecords712.length
    const verified = mockLandRecords712.filter((r) => r.status === 'verified').length
    const discrepancies = mockLandRecords712.filter((r) => r.status === 'flagged_discrepancy').length
    const overrides = mockLandRecords712.filter((r) => r.status === 'manual_override').length

    return {
      ...mockLandRecordsSummary,
      totalRecordsInCache: totalRecords * 714 || mockLandRecordsSummary.totalRecordsInCache,
      activeVerifiedParcels: verified * 642 || mockLandRecordsSummary.activeVerifiedParcels,
      flaggedDiscrepancies: discrepancies,
      manualOverrides: overrides,
      totalImportsThisMonth: mockUserImportedRecords.length * 570 || mockLandRecordsSummary.totalImportsThisMonth
    }
  }

  // 2. Gateway Status & Latency: GET /v1/admin/land-records/status
  if (method === 'GET' && (pathname === '/admin/land-records/status' || pathname === '/v1/admin/land-records/status')) {
    return mockRevenueGatewayStatus
  }

  // 3. List 7/12 & 8A Records: GET /admin/land-records/records
  if (method === 'GET' && (pathname === '/admin/land-records/records' || pathname === '/v1/admin/land-records/records')) {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const recordType = params.get('recordType') || 'all'
    const district = params.get('district') || 'all'
    const landClass = params.get('landClass') || 'all'
    const encumbranceOnly = params.get('encumbranceOnly') === 'true'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterRecords({ q, status, recordType, district, landClass, encumbranceOnly, from, to }, mockLandRecords712)
    return paginate(filtered, page, pageSize)
  }

  // 4. List User Imported Records: GET /admin/land-records/user-imports
  if (method === 'GET' && (pathname === '/admin/land-records/user-imports' || pathname === '/v1/admin/land-records/user-imports')) {
    const q = params.get('q') || ''
    const importStatus = params.get('importStatus') || 'all'
    const district = params.get('district') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterImports({ q, importStatus, district }, mockUserImportedRecords)
    return paginate(filtered, page, pageSize)
  }

  // 5. Audit Log: GET /v1/admin/land-records/audit-log
  if (method === 'GET' && (pathname === '/admin/land-records/audit-log' || pathname === '/v1/admin/land-records/audit-log')) {
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)
    return paginate(mockLandRecordsAuditLogs, page, pageSize)
  }

  // 6. Manual Provision Land Record (Portal Downtime): POST /v1/admin/land-records/manual-provision
  if (method === 'POST' && (pathname === '/admin/land-records/manual-provision' || pathname === '/v1/admin/land-records/manual-provision')) {
    if (!body.reason) {
      throw Object.assign(new Error('Administrative reason required for manual land record provisioning'), { status: 422 })
    }

    const acres = Number(body.totalAreaAcres || (Number(body.totalAreaHectares || 1) * 2.47105).toFixed(2))
    const newRecord = {
      id: `rec_${Date.now()}`,
      gatNumber: body.gatNumber,
      khataNumber: body.khataNumber || '99',
      ferfarNumber: body.ferfarNumber || 'F-MANUAL',
      village: body.village,
      taluka: body.taluka || 'Tehsil',
      district: body.district,
      state: body.state || 'Maharashtra',
      recordType: body.recordType || '712',
      ownerName: body.ownerName,
      vernacularOwnerName: body.vernacularOwnerName || body.ownerName,
      totalAreaHectares: Number(body.totalAreaHectares || (acres / 2.47105).toFixed(2)),
      totalAreaAcres: acres,
      potKharabaHectares: Number(body.potKharabaHectares || 0),
      landClass: body.landClass || 'जिरायत (Dry Crop)',
      soilType: body.soilType || 'काळी जमीन (Black Cotton)',
      irrigationType: body.irrigationType || 'Well / Tube Well',
      cropHistory: body.cropHistory || 'Seasonal Crops',
      encumbrances: body.encumbrances || 'Nil / Clean Title',
      hasEncumbrance: Boolean(body.encumbrances && !body.encumbrances.toLowerCase().includes('nil')),
      otherRights: body.otherRights || 'Provisioned manually during state portal downtime',
      status: 'manual_override',
      discrepancyDetails: `Manually provisioned by Superadmin: ${body.reason}`,
      pdfUrl: body.pdfUrl || 'https://agrovercity.in/docs/sample-712.pdf',
      sourcePortal: body.sourcePortal || 'Mahabhulekh (Maharashtra)',
      lastFetchedAt: new Date().toISOString(),
      cacheTtlHours: 168,
      parsingConfidence: 100.0,
      coSharers: body.coSharers || [{ name: body.ownerName, shareFraction: '1/1' }],
      auditLogs: [
        {
          id: `aud_${Date.now()}`,
          adminUid: body.adminUid || 'superadmin_root',
          timestamp: new Date().toISOString(),
          ipAddress: '10.0.4.18',
          previousState: 'none',
          newState: 'manual_override',
          reason: body.reason
        }
      ]
    }

    mockLandRecords712.unshift(newRecord)

    mockLandRecordsAuditLogs.unshift({
      id: `aud_log_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (Chief Risk Officer)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'MANUAL_PROVISION',
      entityId: newRecord.id,
      gatNumber: newRecord.gatNumber,
      village: newRecord.village,
      previousState: 'none',
      newState: 'manual_override',
      reason: body.reason
    })

    return newRecord
  }

  // 7. Resolve Discrepancy: POST /v1/admin/land-records/{id}/resolve-discrepancy
  const resolveMatch = pathname.match(/^\/(?:v1\/)?admin\/land-records\/([^/]+)\/resolve-discrepancy$/)
  if (method === 'POST' && resolveMatch) {
    const recordId = resolveMatch[1]
    const idx = mockLandRecords712.findIndex((r) => r.id === recordId || r.gatNumber === recordId)
    if (idx === -1) {
      throw Object.assign(new Error('Land record not found'), { status: 404 })
    }
    const record = mockLandRecords712[idx]
    const previousState = record.status

    record.status = 'verified'
    record.discrepancyDetails = null
    if (body.totalAreaAcres) record.totalAreaAcres = Number(body.totalAreaAcres)
    if (body.totalAreaHectares) record.totalAreaHectares = Number(body.totalAreaHectares)
    if (body.encumbrances) {
      record.encumbrances = body.encumbrances
      record.hasEncumbrance = !body.encumbrances.toLowerCase().includes('nil')
    }
    record.lastFetchedAt = new Date().toISOString()

    record.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      previousState,
      newState: 'verified',
      reason: body.notes || 'Discrepancy reconciled and marked verified.'
    })

    mockLandRecordsAuditLogs.unshift({
      id: `aud_log_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Ananya Deshmukh (Director Finance)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'DISCREPANCY_RESOLVE',
      entityId: record.id,
      gatNumber: record.gatNumber,
      village: record.village,
      previousState,
      newState: 'verified',
      reason: body.notes || 'Resolved discrepancy against Talathi measurement map.'
    })

    return record
  }

  // 8. Re-sync from Portal bypassing cache: POST /v1/admin/land-records/{id}/refresh
  const refreshMatch = pathname.match(/^\/(?:v1\/)?admin\/land-records\/([^/]+)\/refresh$/)
  if (method === 'POST' && refreshMatch) {
    const recordId = refreshMatch[1]
    const idx = mockLandRecords712.findIndex((r) => r.id === recordId || r.gatNumber === recordId)
    if (idx === -1) {
      throw Object.assign(new Error('Land record not found'), { status: 404 })
    }
    const record = mockLandRecords712[idx]
    record.lastFetchedAt = new Date().toISOString()
    record.status = 'verified'
    record.parsingConfidence = 99.8

    return { success: true, refreshedAt: record.lastFetchedAt, record }
  }

  // 9. Seed Village Cache: POST /v1/admin/land-records/seed
  if (method === 'POST' && (pathname === '/admin/land-records/seed' || pathname === '/v1/admin/land-records/seed')) {
    const village = body.village || 'Ozarkhed'
    const count = Number(body.count || 25)

    return {
      success: true,
      village,
      district: body.district || 'Nashik',
      recordsSeeded: count,
      timestamp: new Date().toISOString(),
      cacheDurationHours: 168
    }
  }

  // 10. Export Government Compliance Dossier: POST /v1/admin/land-records/export-compliance
  if (method === 'POST' && (pathname === '/admin/land-records/export-compliance' || pathname === '/v1/admin/land-records/export-compliance')) {
    return {
      success: true,
      exportId: `EXP_GOVT_${Date.now()}`,
      format: body.format || 'CSV',
      totalRecordsExported: mockLandRecords712.length,
      downloadUrl: 'https://agrovercity.in/exports/land-records-audit-dossier.csv',
      generatedAt: new Date().toISOString()
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

export function getLandRecordsSummary() {
  return call('GET', '/admin/land-records/summary')
}

export function getGatewayStatus() {
  return call('GET', '/admin/land-records/status')
}

export function listLandRecords({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  recordType = 'all',
  district = 'all',
  landClass = 'all',
  encumbranceOnly = false,
  from = '',
  to = ''
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (recordType !== 'all') params.set('recordType', recordType)
  if (district !== 'all') params.set('district', district)
  if (landClass !== 'all') params.set('landClass', landClass)
  if (encumbranceOnly) params.set('encumbranceOnly', 'true')
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/land-records/records?${params}`)
}

export function listUserImportedRecords({
  page = 1,
  pageSize = 20,
  q = '',
  importStatus = 'all',
  district = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (importStatus !== 'all') params.set('importStatus', importStatus)
  if (district !== 'all') params.set('district', district)
  return call('GET', `/admin/land-records/user-imports?${params}`)
}

export function getAuditLogs({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return call('GET', `/admin/land-records/audit-log?${params}`)
}

export function manualProvisionRecord(payload) {
  return call('POST', '/admin/land-records/manual-provision', payload)
}

export function resolveDiscrepancy(recordId, payload) {
  return call('POST', `/admin/land-records/${recordId}/resolve-discrepancy`, payload)
}

export function refreshRecordFromPortal(recordId) {
  return call('POST', `/admin/land-records/${recordId}/refresh`)
}

export function seedVillageRecords(payload) {
  return call('POST', '/admin/land-records/seed', payload)
}

export function exportGovernmentCompliance(payload) {
  return call('POST', '/admin/land-records/export-compliance', payload)
}
