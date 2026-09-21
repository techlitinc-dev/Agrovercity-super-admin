import { request } from './client'
import {
  mockDiaryEntries,
  mockCropPnl,
  mockPnlBenchmarks,
  mockRegionalExpenditureTrends,
  mockAgriCoinsAuditLedger
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

function filterDiaryEntries({ q = '', status = 'all', type = 'all', category = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (type !== 'all' && item.type !== type) return false
    if (category !== 'all' && item.category !== category) return false
    if (from && item.createdAt < from) return false
    if (to && item.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.farmerName,
      item.farmerPhone,
      item.title,
      item.category,
      item.cropName,
      item.district,
      item.receiptNumber,
      item.notes
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

function filterCropPnl({ q = '', status = 'all', season = 'all', crop = 'all', from = '', to = '' }, list) {
  const needle = q.trim().toLowerCase()
  return list.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (season !== 'all' && !item.season.toLowerCase().includes(season.toLowerCase())) return false
    if (crop !== 'all' && item.cropName.toLowerCase() !== crop.toLowerCase()) return false
    if (from && item.createdAt < from) return false
    if (to && item.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true

    return [
      item.id,
      item.farmerName,
      item.cropName,
      item.season,
      item.district,
      item.loanEligibility
    ].some((v) => String(v || '').toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 160))

  const url = new URL(`http://localhost${path}`)
  const pathname = url.pathname
  const params = url.searchParams

  // Regional expenditure summary
  if (method === 'GET' && pathname === '/admin/diary/summary') {
    return {
      regionalTrends: mockRegionalExpenditureTrends,
      agriCoinsAudit: mockAgriCoinsAuditLedger,
      totalEntries: mockDiaryEntries.length,
      totalPnlRecords: mockCropPnl.length,
      flaggedCount: mockDiaryEntries.filter((d) => d.flagged).length,
    }
  }

  // List diary entries
  if (method === 'GET' && pathname === '/admin/diary/entries') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const type = params.get('type') || 'all'
    const category = params.get('category') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterDiaryEntries({ q, status, type, category, from, to }, mockDiaryEntries)
    return paginate(filtered, page, pageSize)
  }

  // Verify diary entry
  const verifyEntryMatch = pathname.match(/^\/admin\/diary\/entries\/([^/]+)\/verify$/)
  if (method === 'POST' && verifyEntryMatch) {
    const entry = mockDiaryEntries.find((d) => d.id === verifyEntryMatch[1])
    if (!entry) throw Object.assign(new Error('Diary entry not found'), { status: 404 })

    const previousState = entry.status
    entry.status = 'verified'
    entry.flagged = false
    entry.updatedAt = new Date().toISOString()
    entry.auditLogs = entry.auditLogs || []
    entry.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      adminUid: 'root@agrovercity',
      ipAddress: '10.0.4.12',
      previousState,
      newState: 'verified',
      reason: body?.reason || 'Superadmin manual verification',
    })
    return entry
  }

  // Flag diary entry
  const flagEntryMatch = pathname.match(/^\/admin\/diary\/entries\/([^/]+)\/flag$/)
  if (method === 'POST' && flagEntryMatch) {
    const entry = mockDiaryEntries.find((d) => d.id === flagEntryMatch[1])
    if (!entry) throw Object.assign(new Error('Diary entry not found'), { status: 404 })

    const previousState = entry.status
    entry.status = 'flagged'
    entry.flagged = true
    entry.flagReason = body?.flagReason || 'Flagged by superadmin investigation'
    entry.updatedAt = new Date().toISOString()
    entry.auditLogs = entry.auditLogs || []
    entry.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      adminUid: 'root@agrovercity',
      ipAddress: '10.0.4.12',
      previousState,
      newState: 'flagged',
      reason: body?.reason || body?.flagReason || 'Flagged for anomaly / duplicate verification',
    })
    return entry
  }

  // Soft-delete diary entry & reverse AgriCoins
  const deleteEntryMatch = pathname.match(/^\/admin\/diary\/entries\/([^/]+)$/)
  if (method === 'DELETE' && deleteEntryMatch) {
    const entryIndex = mockDiaryEntries.findIndex((d) => d.id === deleteEntryMatch[1])
    if (entryIndex === -1) throw Object.assign(new Error('Diary entry not found'), { status: 404 })

    const entry = mockDiaryEntries[entryIndex]
    entry.status = 'deleted'
    entry.coinsStatus = 'revoked'
    entry.updatedAt = new Date().toISOString()
    entry.auditLogs = entry.auditLogs || []
    entry.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      adminUid: 'root@agrovercity',
      ipAddress: '10.0.4.12',
      previousState: entry.status,
      newState: 'deleted (coins revoked)',
      reason: body?.reason || 'Soft-deleted by superadmin and 15 AgriCoins reversed',
      secondApprover: body?.secondApprover || null,
    })
    // Remove from active list in mock
    mockDiaryEntries.splice(entryIndex, 1)
    mockAgriCoinsAuditLedger.reversalsProcessed += 1
    return { success: true, id: deleteEntryMatch[1], coinsRevoked: 15 }
  }

  // List Crop PnL records
  if (method === 'GET' && pathname === '/admin/pnl/records') {
    const q = params.get('q') || ''
    const status = params.get('status') || 'all'
    const season = params.get('season') || 'all'
    const crop = params.get('crop') || 'all'
    const from = params.get('from') || ''
    const to = params.get('to') || ''
    const page = parseInt(params.get('page') || '1', 10)
    const pageSize = parseInt(params.get('pageSize') || '20', 10)

    const filtered = filterCropPnl({ q, status, season, crop, from, to }, mockCropPnl)
    return paginate(filtered, page, pageSize)
  }

  // Verify Crop PnL record
  const verifyPnlMatch = pathname.match(/^\/admin\/pnl\/records\/([^/]+)\/verify$/)
  if (method === 'POST' && verifyPnlMatch) {
    const record = mockCropPnl.find((p) => p.id === verifyPnlMatch[1])
    if (!record) throw Object.assign(new Error('P&L record not found'), { status: 404 })

    record.status = 'verified'
    record.updatedAt = new Date().toISOString()
    return record
  }

  // Benchmarks list
  if (method === 'GET' && pathname === '/admin/pnl/benchmarks') {
    return { data: mockPnlBenchmarks }
  }

  // Update benchmark
  const benchmarkMatch = pathname.match(/^\/admin\/pnl\/benchmarks\/([^/]+)$/)
  if (method === 'PUT' && benchmarkMatch) {
    const cropName = decodeURIComponent(benchmarkMatch[1]).toLowerCase()
    const target = mockPnlBenchmarks.find((b) => b.crop.toLowerCase() === cropName)
    if (!target) throw Object.assign(new Error('Benchmark crop not found'), { status: 404 })

    target.baselineCostPerAcre = Number(body.baselineCostPerAcre) || target.baselineCostPerAcre
    target.seedsCost = Number(body.seedsCost) || target.seedsCost
    target.fertilizerCost = Number(body.fertilizerCost) || target.fertilizerCost
    target.laborCost = Number(body.laborCost) || target.laborCost
    target.machineryCost = Number(body.machineryCost) || target.machineryCost
    target.pesticidesCost = Number(body.pesticidesCost) || target.pesticidesCost
    target.targetYieldQuintalsPerAcre = Number(body.targetYieldQuintalsPerAcre) || target.targetYieldQuintalsPerAcre
    target.benchmarkBreakEvenPrice = Math.round(target.baselineCostPerAcre / (target.targetYieldQuintalsPerAcre || 1))
    target.lastCalibratedAt = new Date().toISOString()
    target.calibratedBy = 'root@agrovercity'
    return target
  }

  // Pre-sowing break-even calculation
  if (method === 'POST' && pathname === '/admin/pnl/break-even') {
    const { crop, areaAcres = 1, expectedYieldQuintals = 10, totalExpenses = 25000, marketExpectedRate = 5000 } = body || {}
    const yieldTotal = Number(expectedYieldQuintals) || 1
    const expenses = Number(totalExpenses) || 0
    const acres = Number(areaAcres) || 1

    const breakEvenPrice = Math.round(expenses / yieldTotal)
    const costPerAcre = Math.round(expenses / acres)
    const projectedRevenue = yieldTotal * (Number(marketExpectedRate) || 0)
    const projectedProfit = projectedRevenue - expenses
    const projectedRoi = expenses > 0 ? Number(((projectedProfit / expenses) * 100).toFixed(1)) : 0

    return {
      crop,
      areaAcres: acres,
      expectedYieldQuintals: yieldTotal,
      totalExpenses: expenses,
      costPerAcre,
      breakEvenPricePerQuintal: breakEvenPrice,
      projectedRevenue,
      projectedProfit,
      projectedRoi,
      mspComparison: {
        breakEven: breakEvenPrice,
        marketRate: marketExpectedRate,
        marginPerQuintal: (marketExpectedRate || 0) - breakEvenPrice
      }
    }
  }

  // PDF report details
  const pdfMatch = pathname.match(/^\/admin\/diary\/reports\/([^/]+)\/pdf$/)
  if (method === 'GET' && pdfMatch) {
    const reportId = pdfMatch[1]
    const pnl = mockCropPnl.find((p) => p.id === reportId) || mockCropPnl[0]
    return {
      reportId,
      cropName: pnl.cropName,
      farmerName: pnl.farmerName,
      farmerPhone: pnl.farmerPhone,
      aadhaarMasked: pnl.aadhaarMasked,
      district: pnl.district,
      season: pnl.season,
      areaAcres: pnl.areaAcres,
      yieldQuintals: pnl.yieldQuintals,
      grossRevenue: pnl.grossRevenue,
      totalExpenses: pnl.totalExpenses,
      netProfit: pnl.netProfit,
      roiPercent: pnl.roiPercent,
      breakEvenPricePerQuintal: pnl.breakEvenPricePerQuintal,
      dscrRatio: pnl.dscrRatio,
      creditScore: pnl.creditScore,
      kccLimitRecommended: pnl.kccLimitRecommended,
      generatedAt: pnl.updatedAt || new Date().toISOString(),
      authorizedSignatory: 'AGROVERCITY Certified Financial Underwriting System (SOP-13)',
      pdfDownloadUrl: pnl.reportPdfUrl,
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

export function getRegionalSummary() {
  return call('GET', '/admin/diary/summary')
}

export function listDiaryEntries({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  type = 'all',
  category = 'all',
  from = '',
  to = '',
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (type !== 'all') params.set('type', type)
  if (category !== 'all') params.set('category', category)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/diary/entries?${params}`)
}

export function verifyDiaryEntry(id, reason) {
  return call('POST', `/admin/diary/entries/${id}/verify`, { reason })
}

export function flagDiaryEntry(id, flagReason, reason) {
  return call('POST', `/admin/diary/entries/${id}/flag`, { flagReason, reason })
}

export function deleteDiaryEntry(id, reason, secondApprover = null) {
  return call('DELETE', `/admin/diary/entries/${id}`, { reason, secondApprover })
}

export function listCropPnl({
  page = 1,
  pageSize = 20,
  q = '',
  status = 'all',
  season = 'all',
  crop = 'all',
  from = '',
  to = '',
}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (season !== 'all') params.set('season', season)
  if (crop !== 'all') params.set('crop', crop)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/pnl/records?${params}`)
}

export function verifyCropPnl(id, reason) {
  return call('POST', `/admin/pnl/records/${id}/verify`, { reason })
}

export function listBenchmarks() {
  return call('GET', '/admin/pnl/benchmarks')
}

export function updateBenchmark(crop, payload) {
  return call('PUT', `/admin/pnl/benchmarks/${encodeURIComponent(crop)}`, payload)
}

export function calculateBreakEven(payload) {
  return call('POST', '/admin/pnl/break-even', payload)
}

export function getPdfReport(id) {
  return call('GET', `/admin/diary/reports/${id}/pdf`)
}
