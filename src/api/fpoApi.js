import { request } from './client'
import {
  mockFpos,
  mockFpoPools,
  mockFpoPoolMembers,
  mockFpoMachinery,
  mockFpoAuditLogs,
  mockFpoSummary
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

function filterFpos({ q = '', verificationStatus = 'all', district = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (verificationStatus !== 'all' && item.verificationStatus !== verificationStatus) return false
    if (district !== 'all' && item.registeredDistrict !== district) return false
    if (!needle) return true

    return [
      item.id,
      item.name,
      item.shortName,
      item.cin,
      item.pan,
      item.gstin,
      item.registeredDistrict,
      item.registeredTaluka,
      item.ceoName,
      item.chairmanName,
      ...(item.primaryCrops || [])
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterPools({ q = '', category = 'all', status = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (category !== 'all' && !item.category.toLowerCase().includes(category.toLowerCase())) return false
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true

    return [
      item.id,
      item.poolName,
      item.fpoName,
      item.category,
      item.supplierName,
      item.deliveryHub,
      item.poNumber
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterMembers({ q = '', poolId = 'all', paymentStatus = 'all' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (poolId !== 'all' && item.poolId !== poolId) return false
    if (paymentStatus !== 'all' && item.paymentStatus !== paymentStatus) return false
    if (!needle) return true

    return [
      item.id,
      item.farmerName,
      item.farmerPhone,
      item.aadhaarMasked,
      item.village,
      item.district,
      item.poolName
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 140))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // 1. KPI Summary
  if (method === 'GET' && (pathname === '/admin/fpo/summary' || pathname === '/v1/admin/fpo/summary')) {
    const verified = mockFpos.filter((f) => f.verificationStatus === 'verified').length
    const pending = mockFpos.filter((f) => f.verificationStatus === 'pending_verification').length

    return {
      ...mockFpoSummary,
      totalRegisteredFpos: mockFpos.length * 18 || mockFpoSummary.totalRegisteredFpos,
      verifiedFpos: verified * 16 || mockFpoSummary.verifiedFpos,
      pendingVerifications: pending,
      activeProcurementPools: mockFpoPools.filter((p) => p.status === 'open_pledging' || p.status === 'target_achieved').length
    }
  }

  // 2. List FPOs: GET /v1/admin/fpo or /admin/fpo
  if (method === 'GET' && (pathname === '/admin/fpo' || pathname === '/v1/admin/fpo')) {
    const q = params.get('q') || ''
    const verificationStatus = params.get('verificationStatus') || 'all'
    const district = params.get('district') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterFpos({ q, verificationStatus, district }, mockFpos)
    return paginate(filtered, page, pageSize)
  }

  // 3. Approve FPO Verification: POST /v1/admin/fpo/verify/{id}
  const verifyMatch = pathname.match(/^\/(?:v1\/)?admin\/fpo\/verify\/([^/]+)$/)
  if (method === 'POST' && verifyMatch) {
    const fpoId = verifyMatch[1]
    const idx = mockFpos.findIndex((f) => f.id === fpoId)
    if (idx === -1) {
      throw Object.assign(new Error('FPO not found'), { status: 404 })
    }
    const fpo = mockFpos[idx]
    const previousState = fpo.verificationStatus

    fpo.verificationStatus = 'verified'
    fpo.statusText = 'नोंदणीकृत व प्रमाणित (Verified)'
    fpo.verifiedAt = new Date().toISOString()

    mockFpoAuditLogs.unshift({
      id: `aud_fpo_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (Chief Risk Officer)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'VERIFY_FPO_CREDENTIALS',
      entityId: fpo.id,
      entityName: fpo.name,
      previousState,
      newState: 'verified',
      reason: body.reason || 'ROC CIN and NABARD empanelment verified with bank account penny-drop confirmation.'
    })

    return { success: true, fpo }
  }

  // 4. List Pools: GET /admin/fpo/pools
  if (method === 'GET' && (pathname === '/admin/fpo/pools' || pathname === '/v1/admin/fpo/pools')) {
    const q = params.get('q') || ''
    const category = params.get('category') || 'all'
    const status = params.get('status') || 'all'
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterPools({ q, category, status }, mockFpoPools)
    return paginate(filtered, page, pageSize)
  }

  // 5. Create Group Buy Pool: POST /v1/admin/fpo/pools
  if (method === 'POST' && (pathname === '/admin/fpo/pools' || pathname === '/v1/admin/fpo/pools')) {
    const newPool = {
      id: `pool_${Date.now()}`,
      fpoId: body.fpoId || 'fpo_01',
      fpoName: body.fpoName || 'Sahyadri Farmers Producer Company Ltd.',
      poolName: body.poolName || 'New Collective Procurement Pool',
      category: body.category || 'Inputs & Seeds',
      targetQuantity: Number(body.targetQuantity || 100),
      quantityUnit: body.quantityUnit || 'MT',
      pledgedQuantity: 0,
      mrpPerUnit: Number(body.mrpPerUnit || 10000),
      poolOfferPricePerUnit: Number(body.poolOfferPricePerUnit || 8000),
      discountTiers: body.discountTiers || [
        { minQty: 25, discountPct: 10 },
        { minQty: 50, discountPct: 15 },
        { minQty: 100, discountPct: 20 }
      ],
      totalPoolValueInr: 0,
      collectiveSavingsInr: 0,
      participatingFarmersCount: 0,
      deadline: body.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
      supplierName: body.supplierName || 'Approved Apex Manufacturer Depot',
      status: 'open_pledging',
      statusText: 'मागणी नोंदणी सुरू (Open Pledging)',
      deliveryHub: body.deliveryHub || 'Taluka CHC Warehouse',
      poNumber: `PO-FPO-2026-${Math.floor(100 + Math.random() * 900)}`,
      leadFpoAdmin: body.leadFpoAdmin || 'FPO Executive Committee',
      paymentTerms: body.paymentTerms || '30% Advance Deposit Required'
    }

    mockFpoPools.unshift(newPool)

    mockFpoAuditLogs.unshift({
      id: `aud_fpo_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'CREATE_GROUP_BUY_POOL',
      entityId: newPool.id,
      entityName: newPool.poolName,
      previousState: 'none',
      newState: 'open_pledging',
      reason: body.reason || 'Superadmin authorized bulk procurement pool with tiered manufacturer discount.'
    })

    return { success: true, pool: newPool }
  }

  // 6. Close Pool & Dispatch PO: PUT /v1/admin/fpo/pools/{id}/status
  const closeMatch = pathname.match(/^\/(?:v1\/)?admin\/fpo\/pools\/([^/]+)\/status$/)
  if (method === 'PUT' && closeMatch) {
    const poolId = closeMatch[1]
    const idx = mockFpoPools.findIndex((p) => p.id === poolId)
    if (idx === -1) {
      throw Object.assign(new Error('Pool not found'), { status: 404 })
    }
    const pool = mockFpoPools[idx]
    const previousState = pool.status

    pool.status = body.status || 'closed_po_dispatched'
    pool.statusText = 'PO जारी — पुरवठा सुरू (PO Dispatched)'

    mockFpoAuditLogs.unshift({
      id: `aud_fpo_${Date.now()}`,
      adminUid: body.adminUid || 'superadmin_root',
      adminName: body.adminName || 'Vikram Mehta (CRO)',
      timestamp: new Date().toISOString(),
      ipAddress: '10.0.4.18',
      actionType: 'CLOSE_POOL_DISPATCH_PO',
      entityId: pool.id,
      entityName: pool.poolName,
      previousState,
      newState: pool.status,
      reason: body.reason || `Target volume reached. Triggered purchase order ${pool.poNumber} to ${pool.supplierName}.`
    })

    return { success: true, pool }
  }

  // 7. List Pool Members: GET /admin/fpo/pools/{id}/members
  if (method === 'GET' && (pathname.includes('/members') || pathname === '/admin/fpo/members')) {
    const poolId = params.get('poolId') || 'all'
    const paymentStatus = params.get('paymentStatus') || 'all'
    const q = params.get('q') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterMembers({ q, poolId, paymentStatus }, mockFpoPoolMembers)
    return paginate(filtered, page, pageSize)
  }

  // 8. List Shared Machinery: GET /admin/fpo/machinery
  if (method === 'GET' && (pathname === '/admin/fpo/machinery' || pathname === '/v1/admin/fpo/machinery')) {
    return { data: mockFpoMachinery, total: mockFpoMachinery.length }
  }

  // 9. List Audit Logs: GET /admin/fpo/audit-log
  if (method === 'GET' && (pathname === '/admin/fpo/audit-log' || pathname === '/v1/admin/fpo/audit-log')) {
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)
    return paginate(mockFpoAuditLogs, page, pageSize)
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

export function getFpoSummary() {
  return call('GET', '/admin/fpo/summary')
}

export function listFpos({
  page = 1,
  pageSize = 20,
  q = '',
  verificationStatus = 'all',
  district = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (verificationStatus !== 'all') params.set('verificationStatus', verificationStatus)
  if (district !== 'all') params.set('district', district)
  return call('GET', `/admin/fpo?${params}`)
}

export function verifyFpo(fpoId, payload) {
  return call('POST', `/admin/fpo/verify/${fpoId}`, payload)
}

export function listFpoPools({
  page = 1,
  pageSize = 20,
  q = '',
  category = 'all',
  status = 'all'
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (category !== 'all') params.set('category', category)
  if (status !== 'all') params.set('status', status)
  return call('GET', `/admin/fpo/pools?${params}`)
}

export function createFpoPool(payload) {
  return call('POST', '/admin/fpo/pools', payload)
}

export function updatePoolStatus(poolId, payload) {
  return call('PUT', `/admin/fpo/pools/${poolId}/status`, payload)
}

export function listPoolMembers({
  page = 1,
  pageSize = 20,
  poolId = 'all',
  paymentStatus = 'all',
  q = ''
} = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (poolId !== 'all') params.set('poolId', poolId)
  if (paymentStatus !== 'all') params.set('paymentStatus', paymentStatus)
  if (q) params.set('q', q)
  return call('GET', `/admin/fpo/members?${params}`)
}

export function listFpoMachinery() {
  return call('GET', '/admin/fpo/machinery')
}

export function getFpoAuditLogs({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return call('GET', `/admin/fpo/audit-log?${params}`)
}
