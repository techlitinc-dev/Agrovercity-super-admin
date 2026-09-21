import { request } from './client'
import { mockLandListings, mockLandLeases, mockLeaseAgreements, mockRentReminders } from './mockData'

let mockMode = false

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  return { data: list.slice(start, start + pageSize), page, pageSize, total: list.length }
}

function filterLand({ q = '', status = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((x) => {
    if (status !== 'all' && x.status !== status) return false
    if (from && x.createdAt < from) return false
    if (to && x.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true
    return [x.id, x.district, x.surveyNo, x.landlordName, x.landlordPhone, x.tenantName, x.tenantPhone, x.crop]
      .some((v) => String(v).toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 150))
  const leaseMatch = path.match(/^\/admin\/land\/leases\/([^/]+)\/(agreement|reminders)$/)
  const leaseIdMatch = path.match(/^\/admin\/land\/leases\/([^/]+)$/)

  if (method === 'GET' && path === '/admin/land/listings') {
    return paginate(filterLand(body || {}, mockLandListings), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/land/leases') {
    return paginate(filterLand(body || {}, mockLandLeases), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && leaseMatch?.[2] === 'agreement') {
    const agr = mockLeaseAgreements[leaseMatch[1]]
    if (!agr) throw Object.assign(new Error('Agreement not generated for this lease'), { status: 404 })
    return agr
  }
  if (method === 'GET' && leaseMatch?.[2] === 'reminders') {
    return { data: mockRentReminders[leaseMatch[1]] || [] }
  }
  if (method === 'GET' && leaseIdMatch) {
    const lease = mockLandLeases.find((x) => x.id === leaseIdMatch[1])
    if (!lease) throw Object.assign(new Error('Not found'), { status: 404 })
    return lease
  }
  if (method === 'PUT' && path === '/admin/land/listings') {
    const listing = mockLandListings.find((x) => x.id === body?.listingId)
    if (!listing) throw Object.assign(new Error('Not found'), { status: 404 })
    listing.sevenTwelveVerified = !!body.verified
    listing.status = body.verified ? 'available' : 'flagged'
    listing.flagged = !body.verified
    if (body.verified) {
      delete listing.flagReason
    } else {
      listing.flagReason = body.reason || 'Flagged during 7/12 audit'
    }
    listing.updatedAt = new Date().toISOString()
    return listing
  }
  if (method === 'PUT' && leaseIdMatch) {
    const lease = mockLandLeases.find((x) => x.id === leaseIdMatch[1])
    if (!lease) throw Object.assign(new Error('Not found'), { status: 404 })
    if (lease.status === 'terminated') throw Object.assign(new Error('Lease already terminated'), { status: 422 })
    lease.status = 'terminated'
    lease.disputeReason = body.reason || lease.disputeReason
    lease.depositResolution = body.depositResolution || 'refunded_tenant'
    lease.terminatedAt = new Date().toISOString()
    return lease
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

export function listListings({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/land/listings?${params}`)
}

export function listLeases({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/land/leases?${params}`)
}

export function inspectAgreement(leaseId) {
  return call('GET', `/admin/land/leases/${leaseId}/agreement`)
}

export function listReminders(leaseId) {
  return call('GET', `/admin/land/leases/${leaseId}/reminders`)
}

export function auditListing(listingId, verified, reason) {
  return call('PUT', '/admin/land/listings', { listingId, verified, reason })
}

export function terminateLease(leaseId, reason, depositResolution) {
  return call('PUT', `/admin/land/leases/${leaseId}`, { reason, depositResolution })
}
