import { request } from './client'
import { mockAdvisoryScans, mockPestAlerts, mockSoilTests, NPK_CONFIG } from './mockData'

let mockMode = false

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  return { data: list.slice(start, start + pageSize), page, pageSize, total: list.length }
}

function filterRows({ q = '', status = 'all', from = '', to = '' }, list, extraFields = []) {
  const needle = q.trim().toLowerCase()
  return list.filter((x) => {
    if (status !== 'all' && x.status !== status) return false
    if (from && x.createdAt < from) return false
    if (to && x.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true
    return [x.id, x.district, x.farmerName, x.farmerPhone, x.crop, ...extraFields.map((f) => x[f])]
      .some((v) => String(v).toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 150))
  const soilResultsMatch = path.match(/^\/admin\/soil-tests\/([^/]+)\/results$/)
  const scanMatch = path.match(/^\/admin\/advisory\/scans\/([^/]+)$/)

  if (method === 'GET' && path === '/admin/advisory/scans') {
    return paginate(filterRows(body || {}, mockAdvisoryScans, ['diagnosis']), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/advisory/pest-alerts') {
    return paginate(filterRows(body || {}, mockPestAlerts, ['pestName']), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/soil-tests') {
    return paginate(filterRows(body || {}, mockSoilTests, ['sampleCode', 'labName']), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/advisory/npk-config') {
    return NPK_CONFIG
  }
  if (method === 'GET' && scanMatch) {
    const scan = mockAdvisoryScans.find((x) => x.id === scanMatch[1])
    if (!scan) throw Object.assign(new Error('Not found'), { status: 404 })
    return scan
  }
  if (method === 'POST' && path === '/admin/advisory/pest-alerts') {
    if (!body.pestName || !body.district) throw Object.assign(new Error('pestName and district are required'), { status: 422 })
    const alert = {
      id: `alr_${Math.floor(6000 + Math.random() * 999)}`,
      status: body.scheduledFor ? 'scheduled' : 'active',
      pestName: body.pestName,
      district: body.district,
      radiusKm: Number(body.radiusKm) || 50,
      severity: body.severity || 'moderate',
      crop: body.crop || 'All Crops',
      message: body.message || '',
      broadcastAt: body.scheduledFor || new Date().toISOString(),
      broadcastBy: 'root@agrovercity',
      recipientsNotified: body.scheduledFor ? 0 : Math.floor(1500 + Math.random() * 8000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockPestAlerts.unshift(alert)
    return alert
  }
  if (method === 'POST' && soilResultsMatch) {
    const test = mockSoilTests.find((x) => x.id === soilResultsMatch[1])
    if (!test) throw Object.assign(new Error('Not found'), { status: 404 })
    if (test.status === 'result_uploaded') throw Object.assign(new Error('Results already uploaded for this sample'), { status: 422 })
    test.status = 'result_uploaded'
    test.nitrogen = Number(body.nitrogen) || 0
    test.phosphorus = Number(body.phosphorus) || 0
    test.potassium = Number(body.potassium) || 0
    test.ph = Number(body.ph) || 0
    test.organicCarbon = Number(body.organicCarbon) || 0
    test.recommendation = body.recommendation || ''
    test.reportUrl = body.reportUrl || ''
    test.uploadedAt = new Date().toISOString()
    test.updatedAt = new Date().toISOString()
    return test
  }
  if (method === 'PUT' && scanMatch) {
    const scan = mockAdvisoryScans.find((x) => x.id === scanMatch[1])
    if (!scan) throw Object.assign(new Error('Not found'), { status: 404 })
    scan.status = body.status
    scan.updatedAt = new Date().toISOString()
    if (body.status === 'false_positive') scan.falsePositiveReason = body.reason
    return scan
  }
  throw Object.assign(new Error('No mock handler'), { status: 501 })
}

async function call(method, path, body) {
  if (mockMode) return mockRequest(method, path, body)
  try {
    return await request(method, path, body)
  } catch (err) {
    if (err instanceof TypeError) {
      mockMode = true
      return mockRequest(method, path, body)
    }
    throw err
  }
}

export function isMockMode() {
  return mockMode
}

export function listScans({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/advisory/scans?${params}`)
}

export function listPestAlerts({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/advisory/pest-alerts?${params}`)
}

export function listSoilTests({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/soil-tests?${params}`)
}

export function getNpkConfig() {
  return call('GET', '/admin/advisory/npk-config')
}

export function broadcastPestAlert(payload) {
  return call('POST', '/admin/advisory/pest-alerts', payload)
}

export function uploadSoilResults(testId, payload) {
  return call('POST', `/admin/soil-tests/${testId}/results`, payload)
}

export function updateScanStatus(scanId, status, reason) {
  return call('PUT', `/admin/advisory/scans/${scanId}`, { status, reason })
}
