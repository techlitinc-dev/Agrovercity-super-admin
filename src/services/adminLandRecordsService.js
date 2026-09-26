// Admin Land Records Registry (7/12 & 8A Utara) Service for AGROVERCITY Superadmin
// Implements Module 16: Land Records Registry (7/12 & 8A Utara) (SOP-16)
// Target Collections: land_records_712, users/{uid}/imported_records, audit_logs

import {
  mockLandRecords712,
  mockUserImportedRecords,
  mockRevenueGatewayStatus,
  mockLandRecordsAuditLogs,
  mockLandRecordsSummary
} from '../api/mockData'

const RECORDS_STORAGE_KEY = 'agrovercity_superadmin_land_records_712'
const IMPORTS_STORAGE_KEY = 'agrovercity_superadmin_user_imported_records'
const GATEWAYS_STORAGE_KEY = 'agrovercity_superadmin_revenue_gateway_status'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs'

export const INITIAL_LAND_RECORDS_AUDIT_LOGS = [
  {
    id: 'AUD-1601',
    adminUid: 'root@agrovercity',
    action: 'MANUAL_PROVISION',
    targetUserId: 'rec_712_08',
    targetUserName: 'Gat #628/A (Ausa, Latur)',
    previousState: 'Status: pending_sync (Mahabhulekh server timeout 504)',
    newState: 'Status: manual_override (Title verified via registered Sale Deed #4412)',
    reason: 'Manually provisioned verified 7/12 record during portal maintenance after physical document review.',
    timestamp: '2026-09-23T17:15:00.000Z',
    ipAddress: '14.139.122.18'
  },
  {
    id: 'AUD-1602',
    adminUid: 'root@agrovercity',
    action: 'DISCREPANCY_RESOLVE',
    targetUserId: 'rec_712_05',
    targetUserName: 'Gat #215/1 (Georai, Beed)',
    previousState: 'Status: flagged_discrepancy (Area mismatch: 3.2 ac vs 4.0 ac claimed)',
    newState: 'Status: verified (Corrected area: 4.00 Acres per Talathi measurement map)',
    reason: 'Reconciled mutation Ferfar F-402 with Talathi measurement sheet and approved boundary survey.',
    timestamp: '2026-09-22T14:30:00.000Z',
    ipAddress: '14.139.122.15'
  },
  {
    id: 'AUD-1603',
    adminUid: 'root@agrovercity',
    action: 'GATEWAY_REFRESH',
    targetUserId: 'rec_712_02',
    targetUserName: 'Gat #456/2B (Pimpalgaon Baswant, Nashik)',
    previousState: 'Status: cached (TTL 48h remaining)',
    newState: 'Status: verified (Instant live sync confirmed zero new encumbrance)',
    reason: 'On-demand live state portal query requested by Superadmin prior to bank loan underwriting.',
    timestamp: '2026-09-21T09:45:00.000Z',
    ipAddress: '14.139.122.12'
  },
  {
    id: 'AUD-1604',
    adminUid: 'root@agrovercity',
    action: 'SEED_CACHE',
    targetUserId: 'OZARKHED_CLUSTER',
    targetUserName: 'Village Ozarkhed (Circle Dindori, Nashik)',
    previousState: 'Cache: Cold (0 records in L2 cache)',
    newState: 'Cache: Pre-warmed (25 cadastral parcels seeded into Redis cluster)',
    reason: 'Batch cache pre-warming ahead of Kharif 2026 PMFBY enrollment surge.',
    timestamp: '2026-09-20T16:00:00.000Z',
    ipAddress: '14.139.122.33'
  },
  {
    id: 'AUD-1605',
    adminUid: 'root@agrovercity',
    action: 'GOVERNMENT_EXPORT',
    targetUserId: 'DOSSIER_NASHIK_2026',
    targetUserName: 'District Collectorate Land Verification Dossier',
    previousState: 'Export: Scheduled',
    newState: 'Export: Completed (SHA-256: 8f2c3a99b4d1...)',
    reason: 'Government regulatory compliance dossier export for PMFBY subsidy audit.',
    timestamp: '2026-09-19T11:20:00.000Z',
    ipAddress: '14.139.122.4'
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
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_LAND_RECORDS_AUDIT_LOGS))
    return [...INITIAL_LAND_RECORDS_AUDIT_LOGS]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_LAND_RECORDS_AUDIT_LOGS))
      return [...INITIAL_LAND_RECORDS_AUDIT_LOGS]
    }
    return parsed
  } catch (e) {
    return [...INITIAL_LAND_RECORDS_AUDIT_LOGS]
  }
}

function recordAuditLog({
  adminUid = 'root@agrovercity',
  action,
  targetUserId,
  targetUserName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'N/A',
    targetUserName: targetUserName || 'N/A',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Administrative action logged.',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1)
  }

  const updatedLogs = [newLog, ...logs]
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs))
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
    totalPages: Math.ceil(total / pageSize) || 1
  }
}

export const adminLandRecordsService = {
  // 1. KPI Summary
  async getLandRecordsSummary() {
    await new Promise((r) => setTimeout(r, 60))
    const records = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)
    const imports = getStored(IMPORTS_STORAGE_KEY, mockUserImportedRecords)

    const totalRecords = records.length
    const verified = records.filter((r) => r.status === 'verified').length
    const discrepancies = records.filter((r) => r.status === 'flagged_discrepancy').length
    const overrides = records.filter((r) => r.status === 'manual_override').length

    return {
      ...mockLandRecordsSummary,
      totalRecordsInCache: totalRecords * 714 || mockLandRecordsSummary.totalRecordsInCache,
      activeVerifiedParcels: verified * 642 || mockLandRecordsSummary.activeVerifiedParcels,
      flaggedDiscrepancies: discrepancies,
      manualOverrides: overrides,
      totalImportsThisMonth: imports.length * 570 || mockLandRecordsSummary.totalImportsThisMonth,
      dpdpComplianceRate: 100
    }
  },

  // 2. Gateway Status & Latency
  async getGatewayStatus() {
    await new Promise((r) => setTimeout(r, 60))
    return getStored(GATEWAYS_STORAGE_KEY, mockRevenueGatewayStatus)
  },

  // 3. List 7/12 & 8A Records
  async listLandRecords({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    recordType = 'all',
    district = 'all',
    landClass = 'all',
    hasEncumbranceOnly = false,
    encumbranceOnly = false,
    from = '',
    to = ''
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let list = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)

    if (status !== 'all') {
      list = list.filter((item) => item.status === status)
    }
    if (recordType !== 'all') {
      list = list.filter((item) => item.recordType === recordType)
    }
    if (district !== 'all') {
      list = list.filter((item) => item.district === district)
    }
    if (landClass !== 'all') {
      list = list.filter((item) => (item.landClass || '').toLowerCase().includes(landClass.toLowerCase()))
    }
    const checkEncumbrance = hasEncumbranceOnly || encumbranceOnly
    if (checkEncumbrance) {
      list = list.filter((item) => item.hasEncumbrance)
    }
    if (from) {
      list = list.filter((item) => (item.lastFetchedAt || '').slice(0, 10) >= from)
    }
    if (to) {
      list = list.filter((item) => (item.lastFetchedAt || '').slice(0, 10) <= to)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((item) =>
        [
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
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 4. List User Farm Imports
  async listUserImportedRecords({
    page = 1,
    pageSize = 20,
    q = '',
    importStatus = 'all',
    district = 'all'
  } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let list = getStored(IMPORTS_STORAGE_KEY, mockUserImportedRecords)

    if (importStatus !== 'all') {
      list = list.filter((item) => item.importStatus === importStatus)
    }
    if (district !== 'all') {
      list = list.filter((item) => item.district === district)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((item) =>
        [
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
      )
    }

    return paginateItems(list, page, pageSize)
  },

  // 5. Manual Provision Land Record (Portal Downtime)
  async manualProvisionRecord(payload = {}, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 140))
    if (!payload.reason || payload.reason.trim().length < 4) {
      throw new Error('Mandatory administrative reason required for manual land record provisioning.')
    }

    const records = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)
    const acres = Number(payload.totalAreaAcres || (Number(payload.totalAreaHectares || 1) * 2.47105).toFixed(2))

    const newRecord = {
      id: `rec_712_${Date.now()}`,
      gatNumber: payload.gatNumber || '999',
      khataNumber: payload.khataNumber || '99',
      ferfarNumber: payload.ferfarNumber || 'F-MANUAL',
      village: payload.village || 'Ozarkhed',
      taluka: payload.taluka || 'Dindori',
      district: payload.district || 'Nashik',
      state: payload.state || 'Maharashtra',
      recordType: payload.recordType || '712',
      ownerName: payload.ownerName || 'Verified Farmer',
      vernacularOwnerName: payload.vernacularOwnerName || payload.ownerName || 'शेतकरी खातेदार',
      totalAreaHectares: Number(payload.totalAreaHectares || (acres / 2.47105).toFixed(2)),
      totalAreaAcres: acres,
      potKharabaHectares: Number(payload.potKharabaHectares || 0),
      landClass: payload.landClass || 'जिरायत (Dry Crop)',
      soilType: payload.soilType || 'काळी जमीन (Black Cotton)',
      irrigationType: payload.irrigationType || 'Well / Tube Well',
      cropHistory: payload.cropHistory || 'Seasonal Crops',
      encumbrances: payload.encumbrances || 'Nil / Clean Title',
      hasEncumbrance: Boolean(payload.encumbrances && !payload.encumbrances.toLowerCase().includes('nil')),
      otherRights: payload.otherRights || 'Provisioned manually during state portal downtime',
      status: 'manual_override',
      discrepancyDetails: `Manually provisioned by Superadmin: ${payload.reason}`,
      pdfUrl: payload.pdfUrl || 'https://agrovercity.in/docs/sample-712.pdf',
      sourcePortal: payload.sourcePortal || 'Mahabhulekh (Maharashtra)',
      lastFetchedAt: new Date().toISOString(),
      cacheTtlHours: 168,
      parsingConfidence: 100.0,
      coSharers: payload.coSharers || [{ name: payload.ownerName, shareFraction: '1/1' }],
      auditLogs: [
        {
          id: `aud_${Date.now()}`,
          adminUid,
          timestamp: new Date().toISOString(),
          ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1),
          previousState: 'none',
          newState: 'manual_override',
          reason: payload.reason
        }
      ]
    }

    records.unshift(newRecord)
    save(RECORDS_STORAGE_KEY, records)

    recordAuditLog({
      adminUid,
      action: 'MANUAL_PROVISION',
      targetUserId: newRecord.id,
      targetUserName: `Gat #${newRecord.gatNumber} (${newRecord.village}, ${newRecord.district})`,
      previousState: 'Status: none',
      newState: 'Status: manual_override',
      reason: payload.reason
    })

    return newRecord
  },

  // 6. Resolve Parsing / Area Discrepancy
  async resolveDiscrepancy(recordId, payload = {}, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 120))
    const records = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)
    const idx = records.findIndex((r) => r.id === recordId || r.gatNumber === recordId)
    if (idx === -1) throw new Error('Land record not found')

    const record = records[idx]
    const previousState = record.status

    record.status = 'verified'
    record.discrepancyDetails = null
    if (payload.totalAreaAcres) record.totalAreaAcres = Number(payload.totalAreaAcres)
    if (payload.totalAreaHectares) record.totalAreaHectares = Number(payload.totalAreaHectares)
    if (payload.encumbrances) {
      record.encumbrances = payload.encumbrances
      record.hasEncumbrance = !payload.encumbrances.toLowerCase().includes('nil')
    }
    record.lastFetchedAt = new Date().toISOString()

    records[idx] = record
    save(RECORDS_STORAGE_KEY, records)

    recordAuditLog({
      adminUid,
      action: 'DISCREPANCY_RESOLVE',
      targetUserId: record.id,
      targetUserName: `Gat #${record.gatNumber} (${record.village})`,
      previousState: `Status: ${previousState}`,
      newState: 'Status: verified',
      reason: payload.notes || payload.actionTaken || 'Discrepancy reconciled against Talathi measurement map.'
    })

    return record
  },

  // 7. Re-sync from Portal bypassing cache
  async refreshRecordFromPortal(recordId, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 140))
    const records = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)
    const idx = records.findIndex((r) => r.id === recordId || r.gatNumber === recordId)
    if (idx === -1) throw new Error('Land record not found')

    const record = records[idx]
    const previousState = record.status
    record.lastFetchedAt = new Date().toISOString()
    record.status = 'verified'
    record.parsingConfidence = 99.8

    records[idx] = record
    save(RECORDS_STORAGE_KEY, records)

    recordAuditLog({
      adminUid,
      action: 'GATEWAY_REFRESH',
      targetUserId: record.id,
      targetUserName: `Gat #${record.gatNumber} (${record.village})`,
      previousState: `Status: ${previousState}`,
      newState: 'Status: verified (live portal sync)',
      reason: 'On-demand state land revenue portal query executed.'
    })

    return record
  },

  // 8. Seed Village Records into Cache
  async seedVillageRecords({ village = 'Ozarkhed', district = 'Nashik', count = 25 } = {}, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 140))
    const seededCount = Number(count)

    recordAuditLog({
      adminUid,
      action: 'SEED_CACHE',
      targetUserId: `VILLAGE_${village.toUpperCase()}`,
      targetUserName: `Village ${village} (${district})`,
      previousState: 'Cache: standard',
      newState: `Cache: ${seededCount} parcels pre-warmed`,
      reason: `Pre-warmed L2 Redis cache for ${village} (${district}).`
    })

    return {
      success: true,
      village,
      district,
      seededRecordsCount: seededCount,
      timestamp: new Date().toISOString(),
      cacheDurationHours: 168
    }
  },

  // 9. Export Government Compliance Dossier
  async exportGovernmentCompliance(payload = {}, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 150))
    const records = getStored(RECORDS_STORAGE_KEY, mockLandRecords712)
    const filename = `govt_land_records_compliance_${Date.now()}.csv`
    const csvContent = records.map((r) =>
      `"${r.id}","${r.gatNumber}","${r.khataNumber}","${r.village}","${r.district}","${r.ownerName}","${r.totalAreaAcres}","${r.status}","${r.hasEncumbrance ? 'ENCUMBERED' : 'CLEAR'}"`
    ).join('\n')

    recordAuditLog({
      adminUid,
      action: 'GOVERNMENT_EXPORT',
      targetUserId: 'GOVT_COMPLIANCE_DOSSIER',
      targetUserName: `District Compliance Dossier (${records.length} records)`,
      previousState: 'Export: initiated',
      newState: 'Export: completed',
      reason: payload.purpose || 'Statutory land ownership verification dossier export.'
    })

    return {
      success: true,
      filename,
      csvContent: `ID,GatNumber,KhataNumber,Village,District,OwnerName,TotalAcres,Status,Encumbrance\n${csvContent}`,
      auditSha256: '8f2c3a99b4d17e2985f921ea02837bc94821a082713f019b8417c91726a8479e',
      totalExported: records.length,
      timestamp: new Date().toISOString()
    }
  },

  // 10. DPDP Act Masking & Privacy Audit
  async auditCompliance({ adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 120))
    const imports = getStored(IMPORTS_STORAGE_KEY, mockUserImportedRecords)
    const unmaskedAadhaar = imports.filter(
      (item) => !item.aadhaarMasked || !item.aadhaarMasked.startsWith('XXXX-XXXX-')
    )

    const result = {
      timestamp: new Date().toISOString(),
      totalAudited: imports.length,
      passedCount: imports.length - unmaskedAadhaar.length,
      leaksDetected: unmaskedAadhaar.length,
      passRate: unmaskedAadhaar.length === 0 ? 100 : 98.5,
      status: unmaskedAadhaar.length === 0 ? 'COMPLIANT' : 'ACTION_REQUIRED',
      rule: 'DPDP Act 2023: Aadhaar numbers in imported 7/12 extracts must be masked to XXXX-XXXX-1234.'
    }

    recordAuditLog({
      adminUid,
      action: 'COMPLIANCE_AUDITED',
      targetUserId: 'PORTFOLIO_SYSTEM',
      targetUserName: `All ${imports.length} Land Imports`,
      previousState: 'Compliance check initiated',
      newState: `Pass: ${result.passRate}% (DPDP Act 2023 Compliant)`,
      reason: 'Automated DPDP Act 2023 Aadhaar masking sweep executed.'
    })

    return result
  },

  // 11. List Land Records Audit Logs
  async listLandRecordsAuditLogs({ page = 1, pageSize = 20, q = '', actionType = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 100))
    let logs = getStoredAuditLogs()

    const lrActions = [
      'MANUAL_PROVISION',
      'DISCREPANCY_RESOLVE',
      'GATEWAY_REFRESH',
      'SEED_CACHE',
      'GOVERNMENT_EXPORT',
      'COMPLIANCE_AUDITED'
    ]

    logs = logs.filter((log) => lrActions.includes(log.action) || log.id.startsWith('AUD-16'))

    if (actionType !== 'all') {
      logs = logs.filter((l) => l.action === actionType)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      logs = logs.filter((l) =>
        [l.id, l.adminUid, l.targetUserId, l.targetUserName, l.reason, l.previousState, l.newState]
          .some((v) => String(v || '').toLowerCase().includes(needle))
      )
    }

    return paginateItems(logs, page, pageSize)
  },

  // 12. Reset to Default Seed Data
  async resetToDefaultSeed() {
    await new Promise((r) => setTimeout(r, 200))
    localStorage.removeItem(RECORDS_STORAGE_KEY)
    localStorage.removeItem(IMPORTS_STORAGE_KEY)
    localStorage.removeItem(GATEWAYS_STORAGE_KEY)

    const existing = getStoredAuditLogs().filter((l) => !l.id.startsWith('AUD-16'))
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([...INITIAL_LAND_RECORDS_AUDIT_LOGS, ...existing]))

    return { success: true, message: 'Land records 7/12 & 8A registry data reset to initial defaults.' }
  }
}
