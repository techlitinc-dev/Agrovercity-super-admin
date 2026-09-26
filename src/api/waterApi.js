import { request } from './client'
import { adminWaterService } from '../services/adminWaterService'

let mockMode = true

export function isMockMode() {
  return mockMode
}

export function setMockMode(val) {
  mockMode = Boolean(val)
}

// 1. Summary KPIs
export async function getWaterSummary() {
  if (mockMode) {
    return adminWaterService.getWaterSummary()
  }
  try {
    return await request('GET', '/admin/water/summary')
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.getWaterSummary()
  }
}

// 2. List Water Schedules
export async function listWaterSchedules({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  irrigationType = 'all',
  district = 'all',
  alertFilter = 'all'
} = {}) {
  if (mockMode) {
    return adminWaterService.listWaterSchedules({
      page,
      pageSize,
      q,
      status,
      irrigationType,
      district,
      alertFilter
    })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (status !== 'all') params.set('status', status)
    if (irrigationType !== 'all') params.set('irrigationType', irrigationType)
    if (district !== 'all') params.set('district', district)
    if (alertFilter !== 'all') params.set('alertFilter', alertFilter)
    return await request('GET', `/admin/water/schedules?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.listWaterSchedules({
      page,
      pageSize,
      q,
      status,
      irrigationType,
      district,
      alertFilter
    })
  }
}

// 3. List CGWB Stations
export async function listCgwbStations({
  page = 1,
  pageSize = 20,
  q = '',
  category = 'all',
  district = 'all'
} = {}) {
  if (mockMode) {
    return adminWaterService.listCgwbStations({
      page,
      pageSize,
      q,
      category,
      district
    })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (category !== 'all') params.set('category', category)
    if (district !== 'all') params.set('district', district)
    return await request('GET', `/admin/water/cgwb-stations?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.listCgwbStations({
      page,
      pageSize,
      q,
      category,
      district
    })
  }
}

// 4. Batch Ingest & Sync CGWB Readings
export async function syncCgwbReadings(payload = {}) {
  if (mockMode) {
    return adminWaterService.syncCgwbReadings(payload)
  }
  try {
    return await request('POST', '/admin/water/groundwater-readings', payload)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.syncCgwbReadings(payload)
  }
}

// 5. List Canal Schedules
export async function listCanalSchedules({
  page = 1,
  pageSize = 20,
  q = '',
  division = 'all',
  status = 'all'
} = {}) {
  if (mockMode) {
    return adminWaterService.listCanalSchedules({
      page,
      pageSize,
      q,
      division,
      status
    })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (division !== 'all') params.set('division', division)
    if (status !== 'all') params.set('status', status)
    return await request('GET', `/admin/water/canal-schedules?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.listCanalSchedules({
      page,
      pageSize,
      q,
      division,
      status
    })
  }
}

// 6. Update Canal Schedule
export async function updateCanalSchedule(idOrPayload, maybePayload) {
  if (mockMode) {
    return adminWaterService.updateCanalSchedule(idOrPayload, maybePayload)
  }
  try {
    const body = typeof idOrPayload === 'object' && idOrPayload !== null ? idOrPayload : maybePayload
    return await request('PUT', '/admin/water/canal-schedule', body)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.updateCanalSchedule(idOrPayload, maybePayload)
  }
}

// 7. Get PMKSY Subsidy Rules & Applications
export async function getPmksySubsidyRules({ page = 1, pageSize = 20, q = '', status = 'all' } = {}) {
  if (mockMode) {
    return adminWaterService.getPmksySubsidyRules({ page, pageSize, q, status })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (status !== 'all') params.set('status', status)
    return await request('GET', `/admin/water/subsidy-rules?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.getPmksySubsidyRules({ page, pageSize, q, status })
  }
}

// 8. Update PMKSY Subsidy Rules
export async function updatePmksySubsidyRules(payload) {
  if (mockMode) {
    return adminWaterService.updatePmksySubsidyRules(payload)
  }
  try {
    return await request('PUT', '/admin/water/subsidy-rules', payload)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.updatePmksySubsidyRules(payload)
  }
}

// 9. Approve PMKSY Subsidy (with Dual Sign-Off enforcement)
export async function approvePmksySubsidy(appIdOrPayload, maybePayload) {
  if (mockMode) {
    return adminWaterService.approvePmksySubsidy(appIdOrPayload, maybePayload)
  }
  try {
    const body = typeof appIdOrPayload === 'object' && appIdOrPayload !== null ? appIdOrPayload : maybePayload
    return await request('POST', '/admin/water/approve-subsidy', body)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.approvePmksySubsidy(appIdOrPayload, maybePayload)
  }
}

// 10. List Drought Advisories
export async function listDroughtAdvisories({ page = 1, pageSize = 20, q = '', district = 'all' } = {}) {
  if (mockMode) {
    return adminWaterService.listDroughtAdvisories({ page, pageSize, q, district })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (district !== 'all') params.set('district', district)
    return await request('GET', `/admin/water/drought-advisories?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.listDroughtAdvisories({ page, pageSize, q, district })
  }
}

// 11. Issue Drought Alert
export async function issueDroughtAlert(payload) {
  if (mockMode) {
    return adminWaterService.issueDroughtAlert(payload)
  }
  try {
    return await request('POST', '/admin/water/issue-drought-alert', payload)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.issueDroughtAlert(payload)
  }
}

// 12. Get Water Audit Logs
export async function getWaterAuditLogs({ page = 1, pageSize = 20, q = '', actionType = 'ALL' } = {}) {
  if (mockMode) {
    return adminWaterService.listWaterAuditLogs({ page, pageSize, q, actionType })
  }
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (q) params.set('q', q)
    if (actionType !== 'ALL') params.set('actionType', actionType)
    return await request('GET', `/admin/water/audit-log?${params}`)
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.listWaterAuditLogs({ page, pageSize, q, actionType })
  }
}

// 13. Run Water Cluster Efficiency & DPDP Audit
export async function runWaterEfficiencyAudit() {
  if (mockMode) {
    return adminWaterService.runWaterEfficiencyAudit()
  }
  try {
    return await request('POST', '/admin/water/efficiency-audit', {})
  } catch (err) {
    console.warn('API error, falling back to local adminWaterService:', err)
    mockMode = true
    return adminWaterService.runWaterEfficiencyAudit()
  }
}

// 14. Reset Seed Data
export async function resetWaterSeedData(reason) {
  return adminWaterService.resetToDefaultSeed(reason)
}
