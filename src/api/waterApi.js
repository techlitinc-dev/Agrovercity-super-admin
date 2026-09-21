import { request } from './client'
import {
  mockWaterSchedules,
  mockCgwbStations,
  mockCanalSchedules,
  mockPmksySubsidyRules,
  mockPmksyApplications,
  mockDroughtAdvisories,
  mockWaterAuditLogs,
  mockWaterSummary
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

function filterSchedules({ q = '', status = 'all', irrigationType = 'all', district = 'all', alertFilter = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (irrigationType !== 'all' && !item.irrigationType.toLowerCase().includes(irrigationType.toLowerCase())) return false
    if (district !== 'all' && item.district !== district) return false
    if (alertFilter !== 'all' && item.overUnderAlert !== alertFilter) return false
    if (!needle) return true

    return [
      item.id,
      item.farmerName,
      item.farmerPhone,
      item.gatNumber,
      item.village,
      item.taluka,
      item.district,
      item.crop,
      item.irrigationType,
      item.waterSource
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterCgwb({ q = '', category = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (district !== 'all' && item.district !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.stationCode,
      item.stationName,
      item.tehsil,
      item.district,
      item.aquiferType
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterCanals({ q = '', division = 'all', status = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (division !== 'all' && !item.division.toLowerCase().includes(division.toLowerCase())) return false
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true

    return [
      item.id,
      item.canalCode,
      item.canalName,
      item.division,
      item.subDivision,
      item.distributaryMinor,
      item.waterSourceDam,
      ...(item.beneficiaryVillages || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterSubsidies({ q = '', status = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true

    return [
      item.id,
      item.applicationNumber,
      item.farmerName,
      item.farmerPhone,
      item.aadhaarMasked,
      item.systemType,
      item.manufacturer
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 140))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // 1. KPI Summary
  if (method === 'GET' && (pathname === '/admin/water/summary' || pathname === '/v1/admin/water/summary')) {
    const totalSchedules = mockWaterSchedules.length
    const safeCgwb = mockCgwbStations.filter((s) => s.category === 'SAFE').length
    const safePct = Math.round((safeCgwb / Math.max(1, mockCgwbStations.length)) * 100)

    return {
      ...mockWaterSummary,
      activeSchedulesToday: totalSchedules * 602 || mockWaterSummary.activeSchedulesToday,
      cgwbSafePct: safePct || mockWaterSummary.cgwbSafePct,
      activeCanalRotations: mockCanalSchedules.filter((c) => c.status === 'active_rotation').length || 2,
      pendingPmksySubsidies: mockPmksyApplications.filter((a) => a.status === 'pending_inspection' || a.status === 'first_signoff').length
    }
  }

  // 2. List Water Schedules: GET /admin/water/schedules
  if (method === 'GET' && (pathname === '/admin/water/schedules' || pathname === '/v1/admin/water/schedules')) {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const irrigationType = params.get('irrigationType') || 'all'
    const district = params.get('district') || 'all'
    const alertFilter = params.get('alertFilter') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterSchedules({ q, status, irrigationType, district, alertFilter }, mockWaterSchedules)
    return paginate(filtered, page, pageSize)
  }

  // 3. List CGWB Stations: GET /admin/water/cgwb-stations
  if (method === 'GET' && (pathname === '/admin/water/cgwb-stations' || pathname === '/v1/admin/water/cgwb-stations')) {
    const q = params.get('q') || ''
    const category = params.get('category') || 'all'
    const district = params.get('district') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterCgwb({ q, category, district }, mockCgwbStations)
    return paginate(filtered, page, pageSize)
  }

  // 4. Batch Ingest CGWB readings: POST /v1/admin/water/groundwater-readings
  if (method === 'POST' && (pathname === '/admin/water/groundwater-readings' || pathname === '/v1/admin/water/groundwater-readings')) {
    const nowIso = new Date().toISOString()
    mockCgwbStations.forEach((s) => {
      s.lastReadingAt = nowIso
      s.sensorStatus = 'ONLINE'
    })

    mockWaterAuditLogs.unshift({
      id: `aud_wat_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (Chief Risk Officer)',
      timestamp: nowIso,
      ipAddress: '10.0.4.18',
      actionType: 'SYNC_CGWB_READINGS',
      entityId: 'batch_cgwb_stations',
      entityName: `${mockCgwbStations.length} CGWB Stations`,
      previousState: 'telemetry_stale',
      newState: 'telemetry_live',
      reason: body.reason || 'Manual Superadmin refresh of CGWB piezometer and observatory wells.'
    })

    return {
      success: true,
      stationsUpdated: mockCgwbStations.length,
      syncedAt: nowIso
    }
  }

  // 5. List Canal Schedules: GET /admin/water/canal-schedules
  if (method === 'GET' && (pathname === '/admin/water/canal-schedules' || pathname === '/v1/admin/water/canal-schedules')) {
    const q = params.get('q') || ''
    const division = params.get('division') || 'all'
    const status = params.get('status') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterCanals({ q, division, status }, mockCanalSchedules)
    return paginate(filtered, page, pageSize)
  }

  // 6. Update Canal Schedule: PUT /v1/admin/water/canal-schedule
  if (method === 'PUT' && (pathname === '/admin/water/canal-schedule' || pathname === '/v1/admin/water/canal-schedule')) {
    const canalId = body.id
    const idx = mockCanalSchedules.findIndex((c) => c.id === canalId || c.canalCode === canalId)
    if (idx === -1) {
      throw Object.assign(new Error('Canal schedule not found'), { status: 404 })
    }
    const current = mockCanalSchedules[idx]
    const previousState = `${current.status} (${current.dischargeCusecs} cusecs)`

    if (body.dischargeCusecs !== undefined) current.dischargeCusecs = Number(body.dischargeCusecs)
    if (body.rotationStartDate) current.rotationStartDate = body.rotationStartDate
    if (body.rotationEndDate) current.rotationEndDate = body.rotationEndDate
    if (body.status) current.status = body.status
    if (body.maintenanceNotes) current.maintenanceNotes = body.maintenanceNotes

    const newState = `${current.status} (${current.dischargeCusecs} cusecs)`

    mockWaterAuditLogs.unshift({
      id: `aud_wat_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'UPDATE_CANAL_SCHEDULE',
      entityId: current.id,
      entityName: current.canalName,
      previousState,
      newState,
      reason: body.reason || 'Superadmin updated rotation cycle and discharge parameters.'
    })

    return { success: true, updatedSchedule: current }
  }

  // 7. Get PMKSY Subsidy Rules & Applications: GET /admin/water/subsidy-rules
  if (method === 'GET' && (pathname === '/admin/water/subsidy-rules' || pathname === '/v1/admin/water/subsidy-rules')) {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterSubsidies({ q, status }, mockPmksyApplications)
    return {
      rules: mockPmksySubsidyRules,
      applications: paginate(filtered, page, pageSize)
    }
  }

  // 8. Update PMKSY Subsidy Rules: PUT /v1/admin/water/subsidy-rules
  if (method === 'PUT' && (pathname === '/admin/water/subsidy-rules' || pathname === '/v1/admin/water/subsidy-rules')) {
    const previousState = `Drip Cap ₹${mockPmksySubsidyRules.dripCeilingPerHaInr}/ha, SM ${mockPmksySubsidyRules.smallMarginalSubsidyPct}%`

    if (body.smallMarginalSubsidyPct) mockPmksySubsidyRules.smallMarginalSubsidyPct = Number(body.smallMarginalSubsidyPct)
    if (body.otherFarmerSubsidyPct) mockPmksySubsidyRules.otherFarmerSubsidyPct = Number(body.otherFarmerSubsidyPct)
    if (body.dripCeilingPerHaInr) mockPmksySubsidyRules.dripCeilingPerHaInr = Number(body.dripCeilingPerHaInr)
    if (body.sprinklerCeilingPerHaInr) mockPmksySubsidyRules.sprinklerCeilingPerHaInr = Number(body.sprinklerCeilingPerHaInr)
    if (body.additionalStateTopUpPct) mockPmksySubsidyRules.additionalStateTopUpPct = Number(body.additionalStateTopUpPct)
    mockPmksySubsidyRules.lastUpdatedAt = new Date().toISOString()
    mockPmksySubsidyRules.updatedBy = body.adminName || 'Vikram Mehta (Superadmin)'

    const newState = `Drip Cap ₹${mockPmksySubsidyRules.dripCeilingPerHaInr}/ha, SM ${mockPmksySubsidyRules.smallMarginalSubsidyPct}%`

    mockWaterAuditLogs.unshift({
      id: `aud_wat_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'UPDATE_SUBSIDY_RULES',
      entityId: 'PMKSY-PDMC-MH',
      entityName: 'PMKSY Subsidy Parameters',
      previousState,
      newState,
      reason: body.reason || 'Superadmin re-calibrated per-hectare ceiling caps and state subsidy ratios.'
    })

    return { success: true, rules: mockPmksySubsidyRules }
  }

  // 9. Issue Drought / Low-Water Advisory Alert: POST /v1/admin/water/issue-drought-alert
  if (method === 'POST' && (pathname === '/admin/water/issue-drought-alert' || pathname === '/v1/admin/water/issue-drought-alert')) {
    const newAlert = {
      id: `drought_adv_${Date.now()}`,
      district: body.district || 'Beed',
      tehsils: body.tehsils || ['All Tehsils'],
      alertLevel: body.alertLevel || 'MODERATE_WATER_DEFICIT',
      alertLevelText: body.alertLevelText || 'पाणी टंचाई इशारा (Water Advisory)',
      headline: body.headline || 'Emergency Irrigation Water Advisory',
      message: body.message || 'Restricted irrigation advisory broadcast.',
      waterSavingTargetPct: Number(body.waterSavingTargetPct || 25),
      issuedAt: new Date().toISOString(),
      issuedBy: body.adminName || 'Vikram Mehta (Chief Risk Officer)',
      smsBroadcastCount: Number(body.estimatedRecipients || 12000),
      affectedFarmingAcres: Number(body.affectedAcreage || 25000),
      status: 'active'
    }

    mockDroughtAdvisories.unshift(newAlert)

    mockWaterAuditLogs.unshift({
      id: `aud_wat_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'ISSUE_DROUGHT_ALERT',
      entityId: newAlert.id,
      entityName: `${newAlert.district} Low-Water Advisory`,
      previousState: 'none',
      newState: 'active_broadcast',
      reason: body.reason || 'Drought alert broadcast to affected farmers.'
    })

    return { success: true, alert: newAlert }
  }

  // 10. Approve Subsidy Application: POST /v1/admin/water/approve-subsidy
  if (method === 'POST' && (pathname === '/admin/water/approve-subsidy' || pathname === '/v1/admin/water/approve-subsidy')) {
    const appId = body.applicationId
    const idx = mockPmksyApplications.findIndex((a) => a.id === appId || a.applicationNumber === appId)
    if (idx === -1) {
      throw Object.assign(new Error('PMKSY application not found'), { status: 404 })
    }
    const app = mockPmksyApplications[idx]
    const previousState = app.status

    app.status = 'approved'
    app.statusText = 'सबसिडी मंजूर (Approved)'
    app.approvedAt = new Date().toISOString()
    app.dbtStatus = 'DBT_APPROVED_READY'

    mockWaterAuditLogs.unshift({
      id: `aud_wat_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'APPROVE_SUBSIDY',
      entityId: app.id,
      entityName: app.applicationNumber,
      previousState,
      newState: 'approved',
      reason: body.reason || `Approved PMKSY micro-irrigation subsidy of ₹${app.calculatedSubsidyInr.toLocaleString('en-IN')}.`
    })

    return { success: true, application: app }
  }

  // 11. List Drought Advisories: GET /admin/water/drought-advisories
  if (method === 'GET' && (pathname === '/admin/water/drought-advisories' || pathname === '/v1/admin/water/drought-advisories')) {
    return { data: mockDroughtAdvisories, total: mockDroughtAdvisories.length }
  }

  // 12. Audit Logs: GET /admin/water/audit-log
  if (method === 'GET' && (pathname === '/admin/water/audit-log' || pathname === '/v1/admin/water/audit-log')) {
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)
    return paginate(mockWaterAuditLogs, page, pageSize)
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

export function getWaterSummary() {
  return call('GET', '/admin/water/summary')
}

export function listWaterSchedules({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  irrigationType = 'all',
  district = 'all',
  alertFilter = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (irrigationType !== 'all') params.set('irrigationType', irrigationType)
  if (district !== 'all') params.set('district', district)
  if (alertFilter !== 'all') params.set('alertFilter', alertFilter)
  return call('GET', `/admin/water/schedules?${params}`)
}

export function listCgwbStations({
  page = 1,
  pageSize = 20,
  q = '',
  category = 'all',
  district = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (category !== 'all') params.set('category', category)
  if (district !== 'all') params.set('district', district)
  return call('GET', `/admin/water/cgwb-stations?${params}`)
}

export function syncCgwbReadings(payload = {}) {
  return call('POST', '/admin/water/groundwater-readings', payload)
}

export function listCanalSchedules({
  page = 1,
  pageSize = 20,
  q = '',
  division = 'all',
  status = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (division !== 'all') params.set('division', division)
  if (status !== 'all') params.set('status', status)
  return call('GET', `/admin/water/canal-schedules?${params}`)
}

export function updateCanalSchedule(payload) {
  return call('PUT', '/admin/water/canal-schedule', payload)
}

export function getPmksySubsidyRules({ page = 1, pageSize = 20, q = '', status = 'all' } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  return call('GET', `/admin/water/subsidy-rules?${params}`)
}

export function updatePmksySubsidyRules(payload) {
  return call('PUT', '/admin/water/subsidy-rules', payload)
}

export function approvePmksySubsidy(payload) {
  return call('POST', '/admin/water/approve-subsidy', payload)
}

export function listDroughtAdvisories() {
  return call('GET', '/admin/water/drought-advisories')
}

export function issueDroughtAlert(payload) {
  return call('POST', '/admin/water/issue-drought-alert', payload)
}

export function getWaterAuditLogs({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return call('GET', `/admin/water/audit-log?${params}`)
}
