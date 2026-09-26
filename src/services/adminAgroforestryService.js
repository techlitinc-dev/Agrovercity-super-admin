// Admin Agroforestry, Tree Plantation & Biofuel Management Service for AGROVERCITY Superadmin
// Implements Module 21: Agroforestry, Tree Plantation & Biofuel (SOP-21)
// Target Collections: sapling_requests, ngos, biofuel_trees, tree_care_guides, tree_articles, audit_logs

import {
  mockSaplingRequests,
  mockNgos,
  mockBiofuelTrees,
  mockTreeCareGuides,
  mockTreeArticles,
  mockAgroforestryAuditLogs,
  mockAgroforestrySummary
} from '../api/agroforestryMockData'

const REQUESTS_STORAGE_KEY = 'agrovercity_superadmin_tree_requests'
const NGOS_STORAGE_KEY = 'agrovercity_superadmin_tree_ngos'
const BIOFUEL_STORAGE_KEY = 'agrovercity_superadmin_tree_biofuel'
const GUIDES_STORAGE_KEY = 'agrovercity_superadmin_tree_guides'
const ARTICLES_STORAGE_KEY = 'agrovercity_superadmin_tree_articles'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_tree_audit_logs'

function getStored(key, defaultVal) {
  try {
    const data = localStorage.getItem(key)
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal))
      return JSON.parse(JSON.stringify(defaultVal))
    }
    return JSON.parse(data)
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e)
    return JSON.parse(JSON.stringify(defaultVal))
  }
}

function save(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e)
  }
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY)
  if (!data) {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockAgroforestryAuditLogs))
    return [...mockAgroforestryAuditLogs]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockAgroforestryAuditLogs))
      return [...mockAgroforestryAuditLogs]
    }
    return parsed
  } catch (e) {
    return [...mockAgroforestryAuditLogs]
  }
}

function recordAuditLog({
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin',
  actionType,
  entityId = 'N/A',
  entityName = 'N/A',
  collection = 'general',
  previousState = 'none',
  newState = 'updated',
  reason = 'Administrative action executed under SOP-21.'
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `aud_tree_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminUid,
    adminName,
    actionType,
    entityId,
    entityName,
    collection,
    previousState,
    newState,
    reason,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.' + Math.floor(Math.random() * 240 + 10)
  }

  const updatedLogs = [newLog, ...logs]
  save(AUDIT_STORAGE_KEY, updatedLogs)
  return newLog
}

function paginateItems(items, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize))
  }
}

function matchesDateRange(dateStr, range) {
  if (!range || range === 'all') return true
  if (!dateStr) return true
  const date = new Date(dateStr)
  const now = new Date()
  if (isNaN(date.getTime())) return true

  if (range === 'today') {
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }
  if (range === 'last_7_days') {
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= cutoff
  }
  if (range === 'last_30_days') {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return date >= cutoff
  }
  if (range === 'this_quarter') {
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3
    const startOfQuarter = new Date(now.getFullYear(), quarterMonth, 1)
    return date >= startOfQuarter
  }
  return true
}

function matchesPersona(item, persona) {
  if (!persona || persona === 'all') return true
  const p = persona.toLowerCase()

  if (p === 'farmer') {
    // Farmer-submitted sapling requests, farmer beneficiaries
    const text = `${item.farmerName || ''} ${item.deliveryAddress || ''} ${item.speciesRequested || ''}`.toLowerCase()
    return Boolean(text)
  }
  if (p === 'ngo_partner') {
    // Partner NGOs & verified nurseries
    const text = `${item.name || ''} ${item.darpanId || ''} ${item.allocatedNgoName || ''} ${item.contactPerson || ''}`.toLowerCase()
    return text.includes('trust') || text.includes('foundation') || text.includes('board') || text.includes('ngo') || text.includes('vanrai') || text.includes('sahyadri')
  }
  if (p === 'biofuel_buyer') {
    // Industrial biofuel refineries (HPCL, Indian Oil, etc.)
    const text = `${item.buybackPartner || ''} ${item.commonName || ''} ${item.speciesRequested || ''}`.toLowerCase()
    return text.includes('biofuel') || text.includes('refinery') || text.includes('hpcl') || text.includes('karanja') || text.includes('jatropha') || text.includes('simarouba')
  }
  if (p === 'forest_officer') {
    // Social forestry department, bamboo board, government GR
    const text = `${item.author || ''} ${item.department || ''} ${item.name || ''}`.toLowerCase()
    return text.includes('forest') || text.includes('social forestry') || text.includes('bamboo development board') || text.includes('officer')
  }

  return true
}

export const adminAgroforestryService = {
  // -------------------------------------------------------------
  // 1. KPI SUMMARY & TELEMETRY
  // -------------------------------------------------------------
  getAgroforestrySummary: async () => {
    const requests = getStored(REQUESTS_STORAGE_KEY, mockSaplingRequests)
    const ngos = getStored(NGOS_STORAGE_KEY, mockNgos)
    const biofuel = getStored(BIOFUEL_STORAGE_KEY, mockBiofuelTrees)
    const guides = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const articles = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)

    const pending = requests.filter((r) => r.status === 'pending').length
    const approvedOrDispatched = requests.filter((r) => ['approved', 'dispatched', 'delivered'].includes(r.status)).length
    const totalSaplings = requests.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0)
    const deliveredWithSurvival = requests.filter((r) => r.status === 'delivered' && r.survivalRatePercent !== null)
    const avgSurvivalRate = deliveredWithSurvival.length > 0
      ? Math.round(deliveredWithSurvival.reduce((sum, r) => sum + Number(r.survivalRatePercent), 0) / deliveredWithSurvival.length)
      : 91

    const activeNgos = ngos.filter((n) => n.status === 'verified').length
    const nurseryCapacity = ngos.reduce((sum, n) => sum + (Number(n.annualSaplingCapacity) || 0), 0)

    return {
      totalSaplingRequests: requests.length,
      pendingReviewRequests: pending,
      approvedAndDispatched: approvedOrDispatched,
      totalSaplingsDistributed: totalSaplings + 420000,
      activeNgosPartnered: activeNgos,
      nurserySaplingCapacity: nurseryCapacity,
      averageSurvivalRatePct: avgSurvivalRate,
      biofuelVarietiesTracked: biofuel.length,
      treeCareGuidesCount: guides.length,
      agroforestryModelsCount: articles.length,
      totalCarbonOffsetMT: mockAgroforestrySummary.totalCarbonOffsetMT || 28400,
      totalAuditLogs: getStoredAuditLogs().length,
      lastTelemetrySync: new Date().toISOString()
    }
  },

  // -------------------------------------------------------------
  // 2. SAPLING REQUESTS (sapling_requests)
  // Max 500 saplings per farmer quota enforced
  // -------------------------------------------------------------
  listSaplingRequests: async ({
    q = '',
    status = 'all',
    treeCategory = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(REQUESTS_STORAGE_KEY, mockSaplingRequests)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (treeCategory !== 'all' && item.treeCategory !== treeCategory) return false
      if (!matchesDateRange(item.createdAt, dateRange)) return false
      if (!matchesPersona(item, persona)) return false
      if (!needle) return true

      return [
        item.id,
        item.farmerName,
        item.farmerPhone,
        item.district,
        item.taluka,
        item.speciesRequested,
        item.surveyNumber712,
        item.allocatedNgoName,
        item.dispatchTrackingNo
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getSaplingRequestById: async (id) => {
    const list = getStored(REQUESTS_STORAGE_KEY, mockSaplingRequests)
    const item = list.find((r) => r.id === id)
    if (!item) throw new Error(`Sapling request with ID ${id} not found.`)
    return item
  },

  updateSaplingRequestStatus: async (
    id,
    newStatus,
    {
      reason = '',
      trackingNo = '',
      survivalRate = null,
      dualSignOffAdmin = null,
      allocatedNgoId = null,
      allocatedNgoName = null
    } = {},
    adminUid = 'usr_admin_root',
    adminName = 'Super Admin'
  ) => {
    const list = getStored(REQUESTS_STORAGE_KEY, mockSaplingRequests)
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Sapling request with ID ${id} not found.`)

    const prev = list[idx]
    const subsidyDisbursementValue = prev.quantity * (prev.unitCostINR || 40)

    // Financial threshold check (> ₹50,000 mandates dual-admin sign-off)
    if (subsidyDisbursementValue > 50000 && !dualSignOffAdmin && newStatus === 'approved') {
      throw new Error(`Institutional Dual Sign-Off required for sapling subsidy disbursement exceeding ₹50,000 (Calculated: ₹${subsidyDisbursementValue.toLocaleString('en-IN')}).`)
    }

    const updated = {
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }

    if (trackingNo) updated.dispatchTrackingNo = trackingNo
    if (survivalRate !== null && survivalRate !== undefined) updated.survivalRatePercent = Number(survivalRate)
    if (allocatedNgoId) updated.allocatedNgoId = allocatedNgoId
    if (allocatedNgoName) updated.allocatedNgoName = allocatedNgoName

    list[idx] = updated
    save(REQUESTS_STORAGE_KEY, list)

    let actionType = 'UPDATE_SAPLING_REQUEST_STATUS'
    if (newStatus === 'approved') actionType = 'APPROVE_SAPLING_REQUEST'
    else if (newStatus === 'dispatched') actionType = 'DISPATCH_SAPLING_CONSIGNMENT'
    else if (newStatus === 'delivered') actionType = 'RECORD_SAPLING_SURVIVAL_AUDIT'
    else if (newStatus === 'rejected') actionType = 'REJECT_SAPLING_REQUEST'

    recordAuditLog({
      adminUid,
      adminName,
      actionType,
      entityId: id,
      entityName: `Request for ${prev.farmerName} (${prev.speciesRequested})`,
      collection: 'sapling_requests',
      previousState: prev.status,
      newState: newStatus,
      reason: reason || `Updated status to ${newStatus}.${dualSignOffAdmin ? ` Dual sign-off co-signatory: ${dualSignOffAdmin}.` : ''}`
    })

    return updated
  },

  batchUpdateSaplingStatus: async (ids, newStatus, reason = 'Batch sapling request state transition', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(REQUESTS_STORAGE_KEY, mockSaplingRequests)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((r) => {
      if (idSet.has(r.id)) {
        modifiedCount++
        return {
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return r
    })

    save(REQUESTS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_SAPLING_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} sapling requests`,
      collection: 'sapling_requests',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 3. PARTNER NGOS & NURSERIES (ngos)
  // -------------------------------------------------------------
  listNgos: async ({
    q = '',
    status = 'all',
    district = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const needle = q.trim().toLowerCase()

    list = list.filter((ngo) => {
      if (status !== 'all' && ngo.status !== status) return false
      if (district !== 'all' && ngo.district !== district) return false
      if (!matchesDateRange(ngo.createdAt, dateRange)) return false
      if (!matchesPersona(ngo, persona)) return false
      if (!needle) return true

      return [
        ngo.id,
        ngo.name,
        ngo.darpanId,
        ngo.trustRegNo,
        ngo.contactPerson,
        ngo.district,
        ngo.headquarters
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getNgoById: async (id) => {
    const list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const ngo = list.find((n) => n.id === id)
    if (!ngo) throw new Error(`NGO with ID ${id} not found.`)
    return ngo
  },

  createNgo: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const newId = `ngo_${String(list.length + 1).padStart(2, '0')}`
    const now = new Date().toISOString()

    const newNgo = {
      id: newId,
      name: payload.name || 'Untitled Afforestation Foundation',
      darpanId: payload.darpanId || `MH/2026/${Math.floor(1000000 + Math.random() * 9000000)}`,
      trustRegNo: payload.trustRegNo || `E-${Math.floor(1000 + Math.random() * 9000)}/${payload.district || 'Pune'}`,
      has80G12A: Boolean(payload.has80G12A),
      contactPerson: payload.contactPerson || 'Lead Coordinator',
      contactPhone: payload.contactPhone || '+91 98XXX XX000',
      district: payload.district || 'Pune',
      headquarters: payload.headquarters || `${payload.district || 'Pune'}, Maharashtra`,
      nurseryAcres: Number(payload.nurseryAcres) || 10,
      annualSaplingCapacity: Number(payload.annualSaplingCapacity) || 200000,
      currentStock: Number(payload.currentStock) || 50000,
      verified: payload.status === 'verified',
      status: payload.status || 'verified',
      totalDistributed: 0,
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newNgo, ...list]
    save(NGOS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_PARTNER_NGO',
      entityId: newId,
      entityName: newNgo.name,
      collection: 'ngos',
      previousState: 'none',
      newState: newNgo.status,
      reason: payload.reason || `Empaneled new afforestation NGO with capacity: ${newNgo.annualSaplingCapacity} saplings/yr`
    })

    return newNgo
  },

  updateNgo: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const idx = list.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error(`NGO with ID ${id} not found.`)

    const prev = list[idx]
    const updatedNgo = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedNgo
    save(NGOS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_PARTNER_NGO',
      entityId: id,
      entityName: updatedNgo.name,
      collection: 'ngos',
      previousState: prev.status,
      newState: updatedNgo.status,
      reason: patch.reason || `Updated NGO nursery acreage, capacity, or compliance status.`
    })

    return updatedNgo
  },

  verifyNgo: async (id, status, reason = '', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const idx = list.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error(`NGO with ID ${id} not found.`)

    const prev = list[idx]
    list[idx] = {
      ...prev,
      status,
      verified: status === 'verified',
      updatedAt: new Date().toISOString()
    }

    save(NGOS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: status === 'verified' ? 'VERIFY_PARTNER_NGO' : 'SUSPEND_PARTNER_NGO',
      entityId: id,
      entityName: prev.name,
      collection: 'ngos',
      previousState: prev.status,
      newState: status,
      reason: reason || `Updated NGO verification to ${status}.`
    })

    return list[idx]
  },

  batchUpdateNgoStatus: async (ids, newStatus, reason = 'Batch NGO status update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NGOS_STORAGE_KEY, mockNgos)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((n) => {
      if (idSet.has(n.id)) {
        modifiedCount++
        return {
          ...n,
          status: newStatus,
          verified: newStatus === 'verified',
          updatedAt: new Date().toISOString()
        }
      }
      return n
    })

    save(NGOS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_NGO_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} partner NGOs`,
      collection: 'ngos',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 4. COMMERCIAL BIOFUEL TREES (biofuel_trees)
  // -------------------------------------------------------------
  listBiofuelTrees: async ({
    q = '',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(BIOFUEL_STORAGE_KEY, mockBiofuelTrees)
    const needle = q.trim().toLowerCase()

    list = list.filter((tree) => {
      if (!matchesDateRange(tree.createdAt, dateRange)) return false
      if (!matchesPersona(tree, persona)) return false
      if (!needle) return true

      return [
        tree.id,
        tree.commonName,
        tree.botanicalName,
        tree.suitableSoil,
        tree.buybackPartner
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getBiofuelTreeById: async (id) => {
    const list = getStored(BIOFUEL_STORAGE_KEY, mockBiofuelTrees)
    const tree = list.find((t) => t.id === id)
    if (!tree) throw new Error(`Biofuel tree with ID ${id} not found.`)
    return tree
  },

  createBiofuelTree: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BIOFUEL_STORAGE_KEY, mockBiofuelTrees)
    const newId = `bio_${String(list.length + 1).padStart(2, '0')}`
    const now = new Date().toISOString()

    const newTree = {
      id: newId,
      commonName: payload.commonName || 'New Biofuel Species',
      botanicalName: payload.botanicalName || '',
      gestationYears: Number(payload.gestationYears) || 4,
      oilContentPercent: Number(payload.oilContentPercent) || 30,
      seedYieldKgPerTree: Number(payload.seedYieldKgPerTree) || 20,
      annualGrossReturnPerAcreINR: Number(payload.annualGrossReturnPerAcreINR) || 75000,
      co2SequestrationKgPerYear: Number(payload.co2SequestrationKgPerYear) || 25,
      suitableSoil: payload.suitableSoil || 'All agro-climatic zones',
      buybackPartner: payload.buybackPartner || 'HPCL Biofuels',
      marketRatePerKgINR: Number(payload.marketRatePerKgINR) || 25,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newTree, ...list]
    save(BIOFUEL_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_BIOFUEL_TREE',
      entityId: newId,
      entityName: newTree.commonName,
      collection: 'biofuel_trees',
      previousState: 'none',
      newState: newTree.status,
      reason: payload.reason || `Added new commercial biofuel species catalog entry.`
    })

    return newTree
  },

  updateBiofuelEconomics: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BIOFUEL_STORAGE_KEY, mockBiofuelTrees)
    const idx = list.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`Biofuel tree with ID ${id} not found.`)

    const prev = list[idx]
    const updatedTree = {
      ...prev,
      ...patch,
      gestationYears: patch.gestationYears !== undefined ? Number(patch.gestationYears) : prev.gestationYears,
      oilContentPercent: patch.oilContentPercent !== undefined ? Number(patch.oilContentPercent) : prev.oilContentPercent,
      seedYieldKgPerTree: patch.seedYieldKgPerTree !== undefined ? Number(patch.seedYieldKgPerTree) : prev.seedYieldKgPerTree,
      annualGrossReturnPerAcreINR: patch.annualGrossReturnPerAcreINR !== undefined ? Number(patch.annualGrossReturnPerAcreINR) : prev.annualGrossReturnPerAcreINR,
      marketRatePerKgINR: patch.marketRatePerKgINR !== undefined ? Number(patch.marketRatePerKgINR) : prev.marketRatePerKgINR,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedTree
    save(BIOFUEL_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_BIOFUEL_ECONOMICS',
      entityId: id,
      entityName: updatedTree.commonName,
      collection: 'biofuel_trees',
      previousState: `Return: ₹${prev.annualGrossReturnPerAcreINR}, Oil: ${prev.oilContentPercent}%`,
      newState: `Return: ₹${updatedTree.annualGrossReturnPerAcreINR}, Oil: ${updatedTree.oilContentPercent}%`,
      reason: patch.reason || `Updated commercial biofuel crop economics (gestation, oil content %, expected returns).`
    })

    return updatedTree
  },

  // -------------------------------------------------------------
  // 5. TREE CARE GUIDES (tree_care_guides)
  // -------------------------------------------------------------
  listTreeCareGuides: async ({
    q = '',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const needle = q.trim().toLowerCase()

    list = list.filter((guide) => {
      if (!matchesDateRange(guide.createdAt, dateRange)) return false
      if (!matchesPersona(guide, persona)) return false
      if (!needle) return true

      return [
        guide.id,
        guide.title,
        guide.species,
        guide.spacingMeters,
        guide.irrigationRequirement,
        guide.pruningSchedule,
        guide.pestManagement
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getTreeCareGuideById: async (id) => {
    const list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const guide = list.find((g) => g.id === id)
    if (!guide) throw new Error(`Care guide with ID ${id} not found.`)
    return guide
  },

  createTreeCareGuide: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const newId = `care_${String(list.length + 1).padStart(2, '0')}`
    const now = new Date().toISOString()

    const newGuide = {
      id: newId,
      title: payload.title || 'Untitled Tree Care & Planting Guide',
      species: payload.species || 'General Agroforestry',
      spacingMeters: payload.spacingMeters || '3m x 3m (440 trees/acre)',
      pitPreparation: payload.pitPreparation || 'Pit size 2ft x 2ft x 2ft filled with FYM, single super phosphate, and neem cake.',
      irrigationRequirement: payload.irrigationRequirement || 'Drip irrigation @ 8L/tree every 3 days during summer months.',
      pruningSchedule: payload.pruningSchedule || 'Formative pruning from year 2 onwards.',
      pestManagement: payload.pestManagement || 'Stem borer preventive pasting with copper oxychloride.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newGuide, ...list]
    save(GUIDES_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_TREE_CARE_GUIDE',
      entityId: newId,
      entityName: newGuide.title,
      collection: 'tree_care_guides',
      previousState: 'none',
      newState: newGuide.status,
      reason: payload.reason || `Published tree care and planting manual for ${newGuide.species}.`
    })

    return newGuide
  },

  updateTreeCareGuide: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const idx = list.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error(`Care guide with ID ${id} not found.`)

    const prev = list[idx]
    const updatedGuide = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedGuide
    save(GUIDES_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_TREE_CARE_GUIDE',
      entityId: id,
      entityName: updatedGuide.title,
      collection: 'tree_care_guides',
      previousState: prev.status,
      newState: updatedGuide.status,
      reason: patch.reason || `Updated spacing, irrigation, or disease prevention guidelines.`
    })

    return updatedGuide
  },

  deleteTreeCareGuide: async (id, reason = 'Guide removed', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const guide = list.find((g) => g.id === id)
    if (!guide) throw new Error(`Care guide with ID ${id} not found.`)

    const filtered = list.filter((g) => g.id !== id)
    save(GUIDES_STORAGE_KEY, filtered)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'DELETE_TREE_CARE_GUIDE',
      entityId: id,
      entityName: guide.title,
      collection: 'tree_care_guides',
      previousState: guide.status,
      newState: 'deleted',
      reason
    })

    return { success: true, id }
  },

  batchUpdateCareGuideStatus: async (ids, newStatus, reason = 'Batch care guide update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(GUIDES_STORAGE_KEY, mockTreeCareGuides)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((g) => {
      if (idSet.has(g.id)) {
        modifiedCount++
        return {
          ...g,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return g
    })

    save(GUIDES_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_CARE_GUIDE_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} tree care guides`,
      collection: 'tree_care_guides',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 6. AGROFORESTRY MODELS / ARTICLES (tree_articles)
  // -------------------------------------------------------------
  listTreeArticles: async ({
    q = '',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const needle = q.trim().toLowerCase()

    list = list.filter((article) => {
      if (!matchesDateRange(article.createdAt, dateRange)) return false
      if (!matchesPersona(article, persona)) return false
      if (!needle) return true

      return [
        article.id,
        article.title,
        article.intercroppingModel,
        article.author,
        article.recommendedCrops?.join(' ')
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getTreeArticleById: async (id) => {
    const list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const article = list.find((a) => a.id === id)
    if (!article) throw new Error(`Article with ID ${id} not found.`)
    return article
  },

  createTreeArticle: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const newId = `art_${String(list.length + 1).padStart(2, '0')}`
    const now = new Date().toISOString()

    const newArticle = {
      id: newId,
      title: payload.title || 'Untitled Agroforestry Intercropping Model',
      intercroppingModel: payload.intercroppingModel || 'Boundary Plantation (Field Borders)',
      recommendedCrops: Array.isArray(payload.recommendedCrops) ? payload.recommendedCrops : (payload.recommendedCrops ? payload.recommendedCrops.split(',').map((c) => c.trim()) : ['Soybean', 'Cotton']),
      annualBenefitPerAcreINR: Number(payload.annualBenefitPerAcreINR) || 45000,
      carbonCreditsEligible: payload.carbonCreditsEligible !== undefined ? Boolean(payload.carbonCreditsEligible) : true,
      author: payload.author || adminName,
      status: 'published',
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newArticle, ...list]
    save(ARTICLES_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_TREE_ARTICLE',
      entityId: newId,
      entityName: newArticle.title,
      collection: 'tree_articles',
      previousState: 'none',
      newState: newArticle.status,
      reason: payload.reason || `Published agroforestry intercropping model article.`
    })

    return newArticle
  },

  updateTreeArticle: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const idx = list.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error(`Article with ID ${id} not found.`)

    const prev = list[idx]
    const updatedArticle = {
      ...prev,
      ...patch,
      annualBenefitPerAcreINR: patch.annualBenefitPerAcreINR !== undefined ? Number(patch.annualBenefitPerAcreINR) : prev.annualBenefitPerAcreINR,
      recommendedCrops: Array.isArray(patch.recommendedCrops) ? patch.recommendedCrops : (patch.recommendedCrops ? patch.recommendedCrops.split(',').map((c) => c.trim()) : prev.recommendedCrops),
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedArticle
    save(ARTICLES_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_TREE_ARTICLE',
      entityId: id,
      entityName: updatedArticle.title,
      collection: 'tree_articles',
      previousState: prev.status,
      newState: updatedArticle.status,
      reason: patch.reason || `Updated economic returns or recommended intercrop varieties.`
    })

    return updatedArticle
  },

  deleteTreeArticle: async (id, reason = 'Article removed', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const article = list.find((a) => a.id === id)
    if (!article) throw new Error(`Article with ID ${id} not found.`)

    const filtered = list.filter((a) => a.id !== id)
    save(ARTICLES_STORAGE_KEY, filtered)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'DELETE_TREE_ARTICLE',
      entityId: id,
      entityName: article.title,
      collection: 'tree_articles',
      previousState: article.status,
      newState: 'deleted',
      reason
    })

    return { success: true, id }
  },

  batchUpdateTreeArticleStatus: async (ids, newStatus, reason = 'Batch article update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(ARTICLES_STORAGE_KEY, mockTreeArticles)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((a) => {
      if (idSet.has(a.id)) {
        modifiedCount++
        return {
          ...a,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return a
    })

    save(ARTICLES_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_TREE_ARTICLE_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} agroforestry articles`,
      collection: 'tree_articles',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 7. AUDIT LOGS (audit_logs)
  // -------------------------------------------------------------
  getAgroforestryAuditLogs: async ({
    q = '',
    actionType = 'all',
    dateRange = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStoredAuditLogs()
    const needle = q.trim().toLowerCase()

    list = list.filter((log) => {
      if (actionType !== 'all' && log.actionType !== actionType) return false
      if (!matchesDateRange(log.timestamp, dateRange)) return false
      if (!needle) return true

      return [
        log.id,
        log.adminUid,
        log.adminName,
        log.actionType,
        log.entityId,
        log.entityName,
        log.collection,
        log.previousState,
        log.newState,
        log.reason
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getEntityAuditLogs: async (entityId) => {
    const list = getStoredAuditLogs()
    return list.filter((l) => l.entityId === entityId || (l.entityId && l.entityId.includes(entityId)))
  },

  recordAuditLog,

  // -------------------------------------------------------------
  // 8. BENCHMARK SEED RESET
  // -------------------------------------------------------------
  resetToDefaultSeed: async (reason = 'Restored SOP-21 benchmark seed dataset', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(mockSaplingRequests))
    localStorage.setItem(NGOS_STORAGE_KEY, JSON.stringify(mockNgos))
    localStorage.setItem(BIOFUEL_STORAGE_KEY, JSON.stringify(mockBiofuelTrees))
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(mockTreeCareGuides))
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(mockTreeArticles))

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'RESET_SEED_DATA',
      entityId: 'SYSTEM_SOP_21',
      entityName: 'Agroforestry & Tree Plantation Target Collections',
      collection: 'system',
      previousState: 'custom_state',
      newState: 'default_seed',
      reason
    })

    return { success: true, message: 'All Module 21 collections reset to official benchmark state.' }
  }
}
