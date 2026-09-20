import { request } from './client'
import { mockContracts, mockAcceptances } from './mockData'

let mockMode = false

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  return { data: list.slice(start, start + pageSize), page, pageSize, total: list.length }
}

function filterContracts({ q = '', status = 'all', from = '', to = '' }) {
  const needle = q.trim().toLowerCase()
  return mockContracts.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (from && c.createdAt < from) return false
    if (to && c.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true
    return [c.id, c.farmerName, c.farmerPhone, c.buyerName, c.crop]
      .some((v) => String(v).toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 150))
  const contractMatch = path.match(/^\/admin\/contracts\/([^/]+)(\/acceptances)?$/)

  if (method === 'GET' && path === '/admin/contracts') {
    return paginate(filterContracts(body || {}), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && contractMatch?.[2]) {
    return { data: mockAcceptances[contractMatch[1]] || [] }
  }
  if (method === 'GET' && contractMatch) {
    const c = mockContracts.find((x) => x.id === contractMatch[1])
    if (!c) throw Object.assign(new Error('Not found'), { status: 404 })
    return c
  }
  if (method === 'POST' && path === '/admin/contracts') {
    const c = mockContracts.find((x) => x.id === body.contractId)
    if (!c) throw Object.assign(new Error('Not found'), { status: 404 })
    c.status = 'published'
    c.updatedAt = new Date().toISOString()
    return c
  }
  if (method === 'PUT' && contractMatch) {
    const c = mockContracts.find((x) => x.id === contractMatch[1])
    if (!c) throw Object.assign(new Error('Not found'), { status: 404 })
    c.status = body.status
    c.updatedAt = new Date().toISOString()
    if (body.reason && c.status === 'disputed') c.disputeReason = body.reason
    return c
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

export function listContracts({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/contracts?${params}`)
}

export function publishContract(contractId) {
  return call('POST', '/admin/contracts', { contractId })
}

export function updateContractStatus(contractId, status, reason) {
  return call('PUT', `/admin/contracts/${contractId}/status`, { status, reason })
}

export function listAcceptances(contractId) {
  return call('GET', `/admin/contracts/${contractId}/acceptances`)
}
