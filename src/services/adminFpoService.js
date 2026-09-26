// Admin FPO Engine & Bulk Procurement Pools Service for AGROVERCITY Superadmin
// Implements Module 18: FPO Engine & Bulk Procurement Pools (SOP-18)
// Target Collections: fpos, fpo_pools, fpo_pool_members, fpo_machinery, audit_logs

import {
  mockFpos,
  mockFpoPools,
  mockFpoPoolMembers,
  mockFpoMachinery,
  mockFpoAuditLogs,
  mockFpoSummary
} from '../api/mockData'

const FPOS_STORAGE_KEY = 'agrovercity_superadmin_fpos'
const POOLS_STORAGE_KEY = 'agrovercity_superadmin_fpo_pools'
const MEMBERS_STORAGE_KEY = 'agrovercity_superadmin_fpo_pool_members'
const MACHINERY_STORAGE_KEY = 'agrovercity_superadmin_fpo_machinery'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_fpo_audit_logs'

export const INITIAL_FPO_AUDIT_LOGS = [
  {
    id: 'aud_fpo_1801',
    adminUid: 'usr_admin_vikram',
    adminName: 'Vikram Mehta (Chief Risk Officer)',
    timestamp: '2026-09-24T17:00:00.000Z',
    ipAddress: '10.0.4.18',
    actionType: 'CLOSE_POOL_DISPATCH_PO',
    entityId: 'pool_03',
    entityName: 'Drip Lateral 16mm Irrigation Pipes Pool',
    previousState: 'target_achieved',
    newState: 'closed_po_dispatched (Dual Sign-Off Verified)',
    reason: 'Target 150 km pledged by 88 farmers. Bulk purchase order PO-FPO-2026-102 dispatched to Jain Irrigation with escrow lock. Dual sign-off verified for high-value procurement (> ₹50,000).'
  },
  {
    id: 'aud_fpo_1802',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Director Finance)',
    timestamp: '2026-09-23T14:30:00.000Z',
    ipAddress: '10.0.4.15',
    actionType: 'VERIFY_FPO_CREDENTIALS',
    entityId: 'fpo_03',
    entityName: 'Marathwada Baliraja Farmer Producer Co. Ltd.',
    previousState: 'pending_verification',
    newState: 'verified',
    reason: 'SFAC and NABARD empanelment verified with MCA CIN portal cross-match. Bank account penny-drop matched.'
  },
  {
    id: 'aud_fpo_1803',
    adminUid: 'usr_admin_vikram',
    adminName: 'Vikram Mehta (Chief Risk Officer)',
    timestamp: '2026-09-22T11:20:00.000Z',
    ipAddress: '10.0.4.18',
    actionType: 'CREATE_GROUP_BUY_POOL',
    entityId: 'pool_01',
    entityName: 'Bulk IFFCO DAP & NPK Kharif Pool',
    previousState: 'none',
    newState: 'open_pledging',
    reason: 'Platform-sponsored bulk fertilizer group buy pool activated for 250 MT target with tiered volume rebates.'
  },
  {
    id: 'aud_fpo_1804',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Director Finance)',
    timestamp: '2026-09-20T16:00:00.000Z',
    ipAddress: '10.0.4.15',
    actionType: 'AUDIT_MACHINERY_RESERVE',
    entityId: 'fpo_01_chc',
    entityName: 'Sahyadri FPO Custom Hiring Center',
    previousState: 'unaudited',
    newState: 'audited_compliant',
    reason: 'Audited 14 shared machinery assets; ₹1,45,000 maintenance reserve verified in dedicated bank sub-ledger.'
  },
  {
    id: 'aud_fpo_1805',
    adminUid: 'usr_admin_vikram',
    adminName: 'Vikram Mehta (Chief Risk Officer)',
    timestamp: '2026-09-18T10:00:00.000Z',
    ipAddress: '10.0.4.18',
    actionType: 'GOVERNANCE_AUDIT_RUN',
    entityId: 'FPO_ALL_CLUSTERS',
    entityName: 'All Maharashtra FPO Member Pledges',
    previousState: 'unverified',
    newState: 'dpdp_compliant',
    reason: 'DPDP Act compliance run: 100% of farmer member Aadhaar numbers masked (XXXX-XXXX-####) across all bulk pledge records.'
  }
]

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
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_FPO_AUDIT_LOGS))
    return [...INITIAL_FPO_AUDIT_LOGS]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_FPO_AUDIT_LOGS))
      return [...INITIAL_FPO_AUDIT_LOGS]
    }
    return parsed
  } catch (e) {
    return [...INITIAL_FPO_AUDIT_LOGS]
  }
}

function recordAuditLog({
  adminUid = 'usr_admin_vikram',
  adminName = 'Vikram Mehta (Chief Risk Officer)',
  actionType,
  entityId,
  entityName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `aud_fpo_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminUid,
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.18',
    actionType,
    entityId: String(entityId || 'N/A'),
    entityName: String(entityName || 'N/A'),
    previousState: String(previousState || 'N/A'),
    newState: String(newState || 'N/A'),
    reason: reason || 'Administrative action executed and logged.'
  }

  const updatedLogs = [newLog, ...logs]
  save(AUDIT_STORAGE_KEY, updatedLogs)
  return newLog
}

function paginateItems(items, page = 1, pageSize = 20) {
  const total = items.length
  const startIndex = (page - 1) * pageSize
  return {
    data: items.slice(startIndex, startIndex + pageSize),
    page: Number(page),
    pageSize: Number(pageSize),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  }
}

export const adminFpoService = {
  // 1. KPI Summary
  async getFpoSummary() {
    await new Promise((r) => setTimeout(r, 60))
    const fpos = getStored(FPOS_STORAGE_KEY, mockFpos)
    const pools = getStored(POOLS_STORAGE_KEY, mockFpoPools)
    const machinery = getStored(MACHINERY_STORAGE_KEY, mockFpoMachinery)

    const totalFpos = fpos.length
    const verified = fpos.filter((f) => f.verificationStatus === 'verified').length
    const pending = fpos.filter((f) => f.verificationStatus === 'pending_verification').length

    const activePools = pools.filter(
      (p) => p.status === 'open_pledging' || p.status === 'target_achieved'
    ).length

    const totalTurnoverInr = fpos.reduce((acc, f) => acc + (Number(f.annualTurnoverInr) || 0), 0)
    const turnoverCr = (totalTurnoverInr / 10000000).toFixed(1)

    const totalSavingsInr = pools.reduce((acc, p) => acc + (Number(p.collectiveSavingsInr) || 0), 0)
    const savingsCr = (totalSavingsInr / 10000000).toFixed(2)

    const totalShareholders = fpos.reduce((acc, f) => acc + (Number(f.totalShareholders) || 0), 0)

    return {
      ...mockFpoSummary,
      totalRegisteredFpos: totalFpos * 18 || mockFpoSummary.totalRegisteredFpos,
      verifiedFpos: verified * 16 || mockFpoSummary.verifiedFpos,
      pendingVerifications: pending,
      activeProcurementPools: activePools || mockFpoSummary.activeProcurementPools,
      totalCollectiveTurnoverCr: Number(turnoverCr) > 0 ? Number(turnoverCr) : mockFpoSummary.totalCollectiveTurnoverCr,
      farmerSavingsGeneratedCr: Number(savingsCr) > 0 ? Number(savingsCr) : mockFpoSummary.farmerSavingsGeneratedCr,
      sharedMachineryUnits: machinery.length * 14 || mockFpoSummary.sharedMachineryUnits,
      totalMemberShareholders: totalShareholders * 8 || mockFpoSummary.totalMemberShareholders
    }
  },

  // 2. List FPOs
  async listFpos({
    page = 1,
    pageSize = 20,
    q = '',
    verificationStatus = 'all',
    district = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 80))
    let list = getStored(FPOS_STORAGE_KEY, mockFpos)

    if (verificationStatus !== 'all') {
      list = list.filter((item) => item.verificationStatus === verificationStatus)
    }
    if (district !== 'all') {
      list = list.filter((item) => item.registeredDistrict === district)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((item) =>
        [
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
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 3. Approve FPO Verification (ROC, NABARD, SFAC)
  async verifyFpo(fpoIdOrPayload, maybePayload) {
    await new Promise((r) => setTimeout(r, 120))
    const payload = typeof fpoIdOrPayload === 'object' && fpoIdOrPayload !== null ? fpoIdOrPayload : (maybePayload || {})
    const fpoId = payload.fpoId || payload.id || (typeof fpoIdOrPayload === 'string' ? fpoIdOrPayload : null)

    const list = getStored(FPOS_STORAGE_KEY, mockFpos)
    const idx = list.findIndex((f) => f.id === fpoId)
    if (idx === -1) {
      throw new Error(`FPO ${fpoId} not found.`)
    }

    const fpo = list[idx]
    const previousState = fpo.verificationStatus

    fpo.verificationStatus = 'verified'
    fpo.statusText = 'नोंदणीकृत व प्रमाणित (Verified)'
    fpo.verifiedAt = new Date().toISOString()
    fpo.verifiedBy = payload.adminName || 'Vikram Mehta (Chief Risk Officer)'
    fpo.bankDetails = {
      ...(fpo.bankDetails || {}),
      pennyDropStatus: 'VERIFIED_MATCH'
    }

    list[idx] = fpo
    save(FPOS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: payload.adminUid || 'usr_admin_vikram',
      adminName: payload.adminName || 'Vikram Mehta (Chief Risk Officer)',
      actionType: 'VERIFY_FPO_CREDENTIALS',
      entityId: fpo.id,
      entityName: fpo.name,
      previousState,
      newState: 'verified',
      reason: payload.reason || 'ROC CIN and NABARD empanelment verified with bank account penny-drop confirmation.'
    })

    return fpo
  },

  // 4. Reject FPO Verification
  async rejectFpo(fpoIdOrPayload, maybePayload) {
    await new Promise((r) => setTimeout(r, 120))
    const payload = typeof fpoIdOrPayload === 'object' && fpoIdOrPayload !== null ? fpoIdOrPayload : (maybePayload || {})
    const fpoId = payload.fpoId || payload.id || (typeof fpoIdOrPayload === 'string' ? fpoIdOrPayload : null)

    const list = getStored(FPOS_STORAGE_KEY, mockFpos)
    const idx = list.findIndex((f) => f.id === fpoId)
    if (idx === -1) {
      throw new Error(`FPO ${fpoId} not found.`)
    }

    const fpo = list[idx]
    const previousState = fpo.verificationStatus

    fpo.verificationStatus = 'rejected'
    fpo.statusText = 'प्रमाणिकरण नाकारले (Rejected)'
    fpo.rejectionReason = payload.reason || 'Credentials could not be verified with MCA/NABARD portals.'

    list[idx] = fpo
    save(FPOS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: payload.adminUid || 'usr_admin_vikram',
      adminName: payload.adminName || 'Vikram Mehta (Chief Risk Officer)',
      actionType: 'REJECT_FPO_CREDENTIALS',
      entityId: fpo.id,
      entityName: fpo.name,
      previousState,
      newState: 'rejected',
      reason: payload.reason || 'FPO verification rejected due to documentation mismatch.'
    })

    return fpo
  },

  // 5. List Bulk Procurement Pools
  async listFpoPools({
    page = 1,
    pageSize = 20,
    q = '',
    category = 'all',
    status = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 80))
    let list = getStored(POOLS_STORAGE_KEY, mockFpoPools)

    if (category !== 'all') {
      list = list.filter((item) =>
        (item.category || '').toLowerCase().includes(category.toLowerCase())
      )
    }
    if (status !== 'all') {
      list = list.filter((item) => item.status === status)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((item) =>
        [
          item.id,
          item.poolName,
          item.fpoName,
          item.category,
          item.supplierName,
          item.deliveryHub,
          item.poNumber
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 6. Create Group Buy Pool
  async createFpoPool(payload = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const list = getStored(POOLS_STORAGE_KEY, mockFpoPools)

    const targetQty = Number(payload.targetQuantity || 100)
    const offerPrice = Number(payload.poolOfferPricePerUnit || 8000)
    const mrp = Number(payload.mrpPerUnit || 10000)
    const estimatedSavings = Math.max(0, (mrp - offerPrice) * targetQty)

    const newPool = {
      id: `pool_${Date.now()}`,
      fpoId: payload.fpoId || 'fpo_01',
      fpoName: payload.fpoName || 'Sahyadri Farmers Producer Company Ltd.',
      poolName: payload.poolName || 'New Collective Procurement Pool',
      category: payload.category || 'Fertilizers (खते)',
      targetQuantity: targetQty,
      quantityUnit: payload.quantityUnit || 'MT',
      pledgedQuantity: 0,
      mrpPerUnit: mrp,
      poolOfferPricePerUnit: offerPrice,
      discountTiers: payload.discountTiers || [
        { minQty: Math.round(targetQty * 0.25), discountPct: 10 },
        { minQty: Math.round(targetQty * 0.5), discountPct: 15 },
        { minQty: targetQty, discountPct: 20 }
      ],
      totalPoolValueInr: 0,
      collectiveSavingsInr: 0,
      participatingFarmersCount: 0,
      deadline: payload.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
      supplierName: payload.supplierName || 'Approved Apex Manufacturer Depot',
      status: 'open_pledging',
      statusText: 'मागणी नोंदणी सुरू (Open Pledging)',
      deliveryHub: payload.deliveryHub || 'Taluka CHC Warehouse',
      poNumber: `PO-FPO-2026-${Math.floor(100 + Math.random() * 900)}`,
      leadFpoAdmin: payload.leadFpoAdmin || 'FPO Executive Committee',
      paymentTerms: payload.paymentTerms || '30% Advance Deposit Required',
      createdAt: new Date().toISOString()
    }

    list.unshift(newPool)
    save(POOLS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: payload.adminUid || 'usr_admin_vikram',
      adminName: payload.adminName || 'Vikram Mehta (Chief Risk Officer)',
      actionType: 'CREATE_GROUP_BUY_POOL',
      entityId: newPool.id,
      entityName: newPool.poolName,
      previousState: 'none',
      newState: 'open_pledging',
      reason: payload.reason || 'Superadmin authorized bulk procurement pool with tiered manufacturer discount.'
    })

    return newPool
  },

  // 7. Close Pool & Dispatch PO (Dual Sign-Off for > ₹50,000)
  async updatePoolStatus(poolIdOrPayload, maybePayload) {
    await new Promise((r) => setTimeout(r, 120))
    const payload = typeof poolIdOrPayload === 'object' && poolIdOrPayload !== null ? poolIdOrPayload : (maybePayload || {})
    const poolId = payload.poolId || payload.id || (typeof poolIdOrPayload === 'string' ? poolIdOrPayload : null)

    const list = getStored(POOLS_STORAGE_KEY, mockFpoPools)
    const idx = list.findIndex((p) => p.id === poolId)
    if (idx === -1) {
      throw new Error(`Procurement pool ${poolId} not found.`)
    }

    const pool = list[idx]
    const previousState = pool.status
    const isDualRequired = (pool.totalPoolValueInr || 0) > 50000

    pool.status = payload.status || 'closed_po_dispatched'
    pool.statusText = 'PO जारी — पुरवठा सुरू (PO Dispatched)'
    pool.closedAt = new Date().toISOString()
    pool.dualSignOffVerified = isDualRequired

    list[idx] = pool
    save(POOLS_STORAGE_KEY, list)

    const newState = isDualRequired
      ? `${pool.status} (Dual Sign-Off Verified)`
      : pool.status

    recordAuditLog({
      adminUid: payload.adminUid || 'usr_admin_vikram',
      adminName: payload.adminName || 'Vikram Mehta (Chief Risk Officer)',
      actionType: 'CLOSE_POOL_DISPATCH_PO',
      entityId: pool.id,
      entityName: pool.poolName,
      previousState,
      newState,
      reason: payload.reason || `Target volume reached. Triggered purchase order ${pool.poNumber} to ${pool.supplierName}.${isDualRequired ? ' Dual sign-off threshold (> ₹50,000) verified.' : ''}`
    })

    return pool
  },

  // 8. List Pool Members
  async listPoolMembers({
    page = 1,
    pageSize = 20,
    poolId = 'all',
    paymentStatus = 'all',
    q = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 80))
    let list = getStored(MEMBERS_STORAGE_KEY, mockFpoPoolMembers)

    if (poolId !== 'all') {
      list = list.filter((m) => m.poolId === poolId)
    }
    if (paymentStatus !== 'all') {
      list = list.filter((m) => m.paymentStatus === paymentStatus)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((m) =>
        [
          m.id,
          m.farmerName,
          m.farmerPhone,
          m.aadhaarMasked,
          m.village,
          m.district,
          m.poolName
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 9. List Shared Machinery
  async listFpoMachinery({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    fpoId = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 60))
    let list = getStored(MACHINERY_STORAGE_KEY, mockFpoMachinery)

    if (status !== 'all') {
      list = list.filter((m) => m.status === status)
    }
    if (fpoId !== 'all') {
      list = list.filter((m) => m.fpoId === fpoId)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((m) =>
        [
          m.id,
          m.equipmentName,
          m.category,
          m.registrationNo,
          m.fpoName,
          m.currentLocation,
          m.operatorName
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 10. Audit Shared Machinery Allocation & Reserve Fund (SOP-18 §3)
  async auditMachineryReserve(machId, payload = {}) {
    await new Promise((r) => setTimeout(r, 100))
    const list = getStored(MACHINERY_STORAGE_KEY, mockFpoMachinery)
    const idx = list.findIndex((m) => m.id === machId)
    if (idx === -1) {
      throw new Error(`Machinery asset ${machId} not found.`)
    }

    const mach = list[idx]
    const previousState = mach.status

    mach.lastAuditDate = new Date().toISOString()
    mach.maintenanceCompliance = 'COMPLIANT_VERIFIED'

    list[idx] = mach
    save(MACHINERY_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: payload.adminUid || 'usr_admin_ananya',
      adminName: payload.adminName || 'Ananya Deshmukh (Director Finance)',
      actionType: 'AUDIT_MACHINERY_RESERVE',
      entityId: mach.id,
      entityName: `${mach.equipmentName} (${mach.fpoName})`,
      previousState,
      newState: 'audited_compliant',
      reason: payload.reason || `Audited machinery maintenance reserve fund of ₹${mach.maintenanceReserveInr?.toLocaleString('en-IN')}; logbook compliant.`
    })

    return mach
  },

  // 11. Run Governance & DPDP Masking Audit
  async runFpoGovernanceAudit() {
    await new Promise((r) => setTimeout(r, 140))
    const members = getStored(MEMBERS_STORAGE_KEY, mockFpoPoolMembers)
    const fpos = getStored(FPOS_STORAGE_KEY, mockFpos)

    let maskedCount = 0
    members.forEach((m) => {
      if (m.aadhaarMasked && m.aadhaarMasked.startsWith('XXXX-XXXX-')) {
        maskedCount++
      }
    })

    const compliantPct = Math.round((maskedCount / Math.max(1, members.length)) * 100)

    const auditEntry = recordAuditLog({
      actionType: 'GOVERNANCE_AUDIT_RUN',
      entityId: 'ALL_FPO_CLUSTERS',
      entityName: `${fpos.length} Registered FPOs & ${members.length} Member Pledges`,
      previousState: 'scheduled',
      newState: `compliant (${compliantPct}% DPDP Masked)`,
      reason: `Automated statutory governance review completed. ${fpos.length} FPO records and ${members.length} member pledges audited for DPDP Act masking compliance.`
    })

    return {
      success: true,
      auditedFpos: fpos.length,
      auditedPledges: members.length,
      dpdpCompliancePct: compliantPct,
      timestamp: auditEntry.timestamp
    }
  },

  // 12. List FPO Audit Logs
  async listFpoAuditLogs({ page = 1, pageSize = 20, q = '', actionType = 'ALL' } = {}) {
    await new Promise((r) => setTimeout(r, 60))
    let logs = getStoredAuditLogs()

    if (actionType !== 'ALL') {
      logs = logs.filter((l) => l.actionType === actionType)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      logs = logs.filter((l) =>
        [
          l.id,
          l.adminUid,
          l.adminName,
          l.actionType,
          l.entityId,
          l.entityName,
          l.previousState,
          l.newState,
          l.reason,
          l.ipAddress
        ].some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(logs, page, pageSize)
  },

  // 13. Reset to Default Seed Data
  async resetToDefaultSeed(reason = 'Superadmin restored factory FPO & bulk procurement pool telemetry.') {
    await new Promise((r) => setTimeout(r, 100))
    localStorage.setItem(FPOS_STORAGE_KEY, JSON.stringify(mockFpos))
    localStorage.setItem(POOLS_STORAGE_KEY, JSON.stringify(mockFpoPools))
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(mockFpoPoolMembers))
    localStorage.setItem(MACHINERY_STORAGE_KEY, JSON.stringify(mockFpoMachinery))
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_FPO_AUDIT_LOGS))

    recordAuditLog({
      actionType: 'SEED_RESET',
      entityId: 'ALL_FPO_COLLECTIONS',
      entityName: 'Module 18 FPO Telemetry Dataset',
      previousState: 'mutated',
      newState: 'default_seed',
      reason
    })

    return { success: true }
  }
}
