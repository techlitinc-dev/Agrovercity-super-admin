// Admin Livestock, Dairy & Veterinary Services Management Service for AGROVERCITY Superadmin
// Implements Module 19: Livestock, Dairy & Veterinary Services (SOP-19)
// Target Collections: gaushalas, nurseries, vets, dairy_products, vet_bookings, manure_orders, audit_logs

import {
  mockVets,
  mockGaushalas,
  mockNurseries,
  mockDairyProducts,
  mockVetBookings,
  mockManureOrders,
  mockLivestockAuditLogs,
  mockLivestockSummary
} from '../api/mockData'

const VETS_STORAGE_KEY = 'agrovercity_superadmin_livestock_vets'
const GAUSHALAS_STORAGE_KEY = 'agrovercity_superadmin_livestock_gaushalas'
const NURSERIES_STORAGE_KEY = 'agrovercity_superadmin_livestock_nurseries'
const DAIRY_STORAGE_KEY = 'agrovercity_superadmin_livestock_dairy_products'
const BOOKINGS_STORAGE_KEY = 'agrovercity_superadmin_livestock_vet_bookings'
const MANURE_STORAGE_KEY = 'agrovercity_superadmin_livestock_manure_orders'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_livestock_audit_logs'

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
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockLivestockAuditLogs))
    return [...mockLivestockAuditLogs]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockLivestockAuditLogs))
      return [...mockLivestockAuditLogs]
    }
    return parsed
  } catch (e) {
    return [...mockLivestockAuditLogs]
  }
}

function recordAuditLog({
  adminUid = 'root@agrovercity',
  adminName = 'Super Admin',
  actionType,
  entityId,
  entityName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `aud_lvs_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminUid,
    adminName,
    actionType,
    entityId: entityId || 'N/A',
    entityName: entityName || 'N/A',
    previousState: previousState || 'none',
    newState: newState || 'updated',
    reason: reason || 'Administrative action executed under SOP-19.',
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

export const adminLivestockService = {
  // 1. Summary Metrics
  getLivestockSummary: async () => {
    const vets = getStored(VETS_STORAGE_KEY, mockVets)
    const gaushalas = getStored(GAUSHALAS_STORAGE_KEY, mockGaushalas)
    const nurseries = getStored(NURSERIES_STORAGE_KEY, mockNurseries)
    const dairy = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    const bookings = getStored(BOOKINGS_STORAGE_KEY, mockVetBookings)
    const manure = getStored(MANURE_STORAGE_KEY, mockManureOrders)

    const verifiedActiveVets = vets.filter((v) => v.status === 'verified_active').length
    const pendingVetVerifications = vets.filter((v) => v.status === 'pending_verification').length

    const certifiedGaushalas = gaushalas.filter((g) => g.status === 'certified_active').length
    const pendingGaushalaAudits = gaushalas.filter((g) => g.status === 'pending_audit').length
    const totalCattleSheltered = gaushalas.reduce((sum, g) => sum + (Number(g.totalCattleHead) || 0), 0)
    const monthlyManureProductionMT = gaushalas.reduce((sum, g) => sum + (Number(g.monthlyManureCapacityMT) || 0), 0)

    const approvedNurseries = nurseries.filter((n) => n.status === 'approved').length
    const pendingNurseryInspections = nurseries.filter((n) => n.status === 'pending_inspection').length

    const activeDairySkus = dairy.filter((d) => d.status === 'active').length
    const pendingLabClearances = dairy.filter((d) => d.status === 'pending_lab_clearance').length
    const recalledDairyBatches = dairy.filter((d) => d.status === 'recalled').length

    const todayEmergencyDispatches = bookings.filter(
      (b) => b.urgencyLevel === 'critical_emergency' && b.bookingStatus !== 'cancelled_farmer'
    ).length
    const activeDisputeMediations = bookings.filter((b) => b.bookingStatus === 'dispute_mediation').length

    const pendingDualSignOffs = manure.filter(
      (m) => m.dualSignOffRequired && !m.dualSignOffCompleted && m.deliveryStatus !== 'delivered'
    ).length
    const todayManureOrdersINR = manure.reduce((sum, m) => sum + (Number(m.totalAmountINR) || 0), 0)

    const flaggedAnomalies =
      vets.filter((v) => v.status === 'suspended' || v.status === 'rejected').length +
      gaushalas.filter((g) => g.status === 'flagged').length +
      dairy.filter((d) => d.status === 'recalled').length +
      bookings.filter((b) => b.bookingStatus === 'dispute_mediation').length

    return {
      totalRegisteredVets: vets.length,
      verifiedActiveVets,
      pendingVetVerifications,
      certifiedGaushalas,
      pendingGaushalaAudits,
      totalCattleSheltered,
      monthlyManureProductionMT,
      approvedNurseries,
      pendingNurseryInspections,
      activeDairySkus,
      pendingLabClearances,
      recalledDairyBatches,
      todayEmergencyDispatches,
      activeDisputeMediations,
      pendingDualSignOffs,
      todayManureOrdersINR,
      flaggedAnomalies,
      totalOrdersAudit: dairy.length + manure.length,
      totalAuditLogs: getStoredAuditLogs().length,
      lastTelemetrySync: new Date().toISOString()
    }
  },

  // 2. Vets Network
  listVets: async ({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    district = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(VETS_STORAGE_KEY, mockVets)
    const needle = q.trim().toLowerCase()

    list = list.filter((vet) => {
      if (status !== 'all' && vet.status !== status) return false
      if (district !== 'all' && vet.district !== district) return false
      if (!matchesDateRange(vet.verifiedAt || vet.submittedAt, dateRange)) return false
      if (!needle) return true

      return [
        vet.id,
        vet.name,
        vet.councilRegNo,
        vet.degree,
        vet.clinicName,
        vet.district,
        vet.taluka,
        vet.mobile,
        ...(vet.specialization || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createVet: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(VETS_STORAGE_KEY, mockVets)
    const newId = `vet_${String(list.length + 1).padStart(2, '0')}`

    const newVet = {
      id: newId,
      name: payload.name || 'Dr. New Veterinarian',
      degree: payload.degree || 'B.V.Sc & A.H.',
      councilRegNo: payload.councilRegNo || `MSVC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      councilState: payload.councilState || 'Maharashtra State Veterinary Council',
      regExpiryDate: payload.regExpiryDate || '2030-12-31',
      experienceYears: Number(payload.experienceYears) || 3,
      mobile: payload.mobile || '+919000000000',
      email: payload.email || `${newId}@agrovercity.in`,
      district: payload.district || 'Pune',
      taluka: payload.taluka || 'Haveli',
      state: payload.state || 'Maharashtra',
      clinicName: payload.clinicName || 'Agrovercity Regional Veterinary Center',
      clinicAddress: payload.clinicAddress || 'Taluka Headquarter Road',
      emergencyCallout24x7: !!payload.emergencyCallout24x7,
      consultationFee: Number(payload.consultationFee) || 350,
      emergencyNightFee: Number(payload.emergencyNightFee) || 700,
      averageRating: 5.0,
      totalCasesAttended: 0,
      bankAccount: {
        accountHolder: payload.name || 'Doctor Beneficiary',
        bankName: payload.bankName || 'State Bank of India',
        accountNumber: '••••••••' + Math.floor(1000 + Math.random() * 9000),
        ifsc: payload.ifsc || 'SBIN0001042',
        pennyDropStatus: 'verified'
      },
      panNumber: payload.panNumber || 'ABCDE1234F',
      specialization: payload.specialization || ['Bovine General Medicine', 'Deworming & Vaccination'],
      status: payload.status || 'pending_verification',
      submittedAt: new Date().toISOString(),
      documentUrls: {
        degreeCert: 'https://docs.agrovercity.in/vets/degree_placeholder.pdf',
        councilReg: 'https://docs.agrovercity.in/vets/council_placeholder.pdf'
      }
    }

    list.unshift(newVet)
    save(VETS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'ONBOARD_VET_DOCTOR',
      entityId: newVet.id,
      entityName: newVet.name,
      previousState: 'none',
      newState: newVet.status,
      reason: `Registered new veterinarian ${newVet.name} (${newVet.councilRegNo})`
    })

    return { success: true, data: newVet }
  },

  verifyVet: async (vetId, payload = {}) => {
    const list = getStored(VETS_STORAGE_KEY, mockVets)
    const vet = list.find((v) => v.id === vetId)
    if (!vet) throw new Error('Veterinarian record not found')

    const prevState = vet.status
    const {
      status = 'verified_active',
      councilRegNo,
      verifiedBy = 'root@agrovercity',
      reason = 'Credentials authenticated against State Veterinary Council Registry'
    } = payload

    vet.status = status
    if (councilRegNo) vet.councilRegNo = councilRegNo
    vet.verifiedAt = new Date().toISOString()
    vet.verifiedBy = verifiedBy

    save(VETS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: verifiedBy,
      actionType: status === 'verified_active' ? 'VERIFY_VET_CREDENTIALS' : 'UPDATE_VET_STATUS',
      entityId: vet.id,
      entityName: vet.name,
      previousState: prevState,
      newState: status,
      reason
    })

    return { success: true, data: vet }
  },

  batchUpdateVets: async ({ ids = [], action = 'verified_active', reason = 'Batch verification', adminUid = 'root@agrovercity' }) => {
    const list = getStored(VETS_STORAGE_KEY, mockVets)
    let updatedCount = 0

    list.forEach((v) => {
      if (ids.includes(v.id)) {
        v.status = action
        v.verifiedAt = new Date().toISOString()
        v.verifiedBy = adminUid
        updatedCount++
      }
    })

    save(VETS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'BATCH_UPDATE_VETS',
      entityId: ids.join(', '),
      entityName: `${updatedCount} Veterinarians`,
      previousState: 'mixed',
      newState: action,
      reason
    })

    return { success: true, count: updatedCount }
  },

  // 3. Gaushalas Directory
  listGaushalas: async ({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    district = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(GAUSHALAS_STORAGE_KEY, mockGaushalas)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (district !== 'all' && item.district !== district) return false
      if (!matchesDateRange(item.lastAuditedAt || item.submittedAt, dateRange)) return false
      if (!needle) return true

      return [
        item.id,
        item.name,
        item.shortName,
        item.trustRegNo,
        item.charityCommissionNo,
        item.founderName,
        item.district,
        item.taluka,
        item.contactPhone,
        ...(item.panchagavyaProducts || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createGaushala: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(GAUSHALAS_STORAGE_KEY, mockGaushalas)
    const newId = `gsh_${String(list.length + 1).padStart(2, '0')}`

    const newGaushala = {
      id: newId,
      name: payload.name || 'Shree Gau Sanstha',
      shortName: payload.shortName || payload.name || 'Desi Cow Trust',
      trustRegNo: payload.trustRegNo || `MAH-TRUST-${Math.floor(1000 + Math.random() * 9000)}`,
      charityCommissionNo: payload.charityCommissionNo || `F-${Math.floor(10000 + Math.random() * 90000)}/District`,
      taxExempt80G: !!payload.taxExempt80G,
      tax80GCertNo: payload.tax80GCertNo || (payload.taxExempt80G ? 'AAATS1420NF20261' : 'Application Pending'),
      founderName: payload.founderName || 'Trustee Representative',
      contactPhone: payload.contactPhone || '+919800000000',
      email: payload.email || `${newId}@agrovercity.in`,
      district: payload.district || 'Pune',
      taluka: payload.taluka || 'Haveli',
      state: payload.state || 'Maharashtra',
      address: payload.address || 'Rural Gaushala Premises',
      totalCattleHead: Number(payload.totalCattleHead) || 120,
      indigenousBreeds: payload.indigenousBreeds || { gir: 60, sahiwal: 40, khillari: 20 },
      monthlyManureCapacityMT: Number(payload.monthlyManureCapacityMT) || 25.0,
      organicCertNo: payload.organicCertNo || 'NPOP/NAB/0099/2026',
      panchagavyaProducts: payload.panchagavyaProducts || ['Enriched Cow Dung Manure', 'Vermicompost Gold'],
      biogasCapacityKwhPerDay: Number(payload.biogasCapacityKwhPerDay) || 60,
      vetInspectionDate: new Date().toISOString().slice(0, 10),
      welfareAuditScore: Number(payload.welfareAuditScore) || 90,
      fssaiLicenseNo: payload.fssaiLicenseNo || '11526045000999',
      status: payload.status || 'pending_audit',
      submittedAt: new Date().toISOString(),
      bankAccount: {
        accountHolder: payload.name || 'Gaushala Trust',
        bankName: payload.bankName || 'State Bank of India',
        accountNumber: '••••••••' + Math.floor(1000 + Math.random() * 9000),
        ifsc: payload.ifsc || 'SBIN0000438',
        pennyDropStatus: 'verified'
      }
    }

    list.unshift(newGaushala)
    save(GAUSHALAS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'REGISTER_GAUSHALA_TRUST',
      entityId: newGaushala.id,
      entityName: newGaushala.name,
      previousState: 'none',
      newState: newGaushala.status,
      reason: `Registered Gaushala trust ${newGaushala.name} with ${newGaushala.totalCattleHead} cattle heads.`
    })

    return { success: true, data: newGaushala }
  },

  auditGaushala: async (gshId, payload = {}) => {
    const list = getStored(GAUSHALAS_STORAGE_KEY, mockGaushalas)
    const gsh = list.find((g) => g.id === gshId)
    if (!gsh) throw new Error('Gaushala record not found')

    const prevState = gsh.status
    const {
      status = 'certified_active',
      welfareAuditScore = 95,
      auditedBy = 'root@agrovercity',
      notes = 'Gaushala cow welfare audit completed and certified.'
    } = payload

    gsh.status = status
    gsh.welfareAuditScore = Number(welfareAuditScore)
    gsh.lastAuditedAt = new Date().toISOString()
    gsh.auditedBy = auditedBy

    save(GAUSHALAS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: auditedBy,
      actionType: 'AUDIT_GAUSHALA_WELFARE',
      entityId: gsh.id,
      entityName: gsh.name,
      previousState: prevState,
      newState: status,
      reason: notes
    })

    return { success: true, data: gsh }
  },

  batchUpdateGaushalas: async ({ ids = [], action = 'certified_active', reason = 'Batch certification', adminUid = 'root@agrovercity' }) => {
    const list = getStored(GAUSHALAS_STORAGE_KEY, mockGaushalas)
    let updatedCount = 0

    list.forEach((g) => {
      if (ids.includes(g.id)) {
        g.status = action
        g.lastAuditedAt = new Date().toISOString()
        g.auditedBy = adminUid
        updatedCount++
      }
    })

    save(GAUSHALAS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'BATCH_UPDATE_GAUSHALAS',
      entityId: ids.join(', '),
      entityName: `${updatedCount} Gaushalas`,
      previousState: 'mixed',
      newState: action,
      reason
    })

    return { success: true, count: updatedCount }
  },

  // 4. Plant Nurseries
  listNurseries: async ({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    district = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(NURSERIES_STORAGE_KEY, mockNurseries)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (district !== 'all' && item.district !== district) return false
      if (!matchesDateRange(item.approvedAt || item.submittedAt, dateRange)) return false
      if (!needle) return true

      return [
        item.id,
        item.name,
        item.shortName,
        item.nhbRegistrationNo,
        item.ownerName,
        item.district,
        item.taluka,
        item.phone,
        ...(item.specialization || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createNursery: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(NURSERIES_STORAGE_KEY, mockNurseries)
    const newId = `nur_${String(list.length + 1).padStart(2, '0')}`

    const newNursery = {
      id: newId,
      name: payload.name || 'Agrovercity Model Plant Nursery',
      shortName: payload.shortName || payload.name || 'Model Nursery',
      nhbRegistrationNo: payload.nhbRegistrationNo || `NHB-MH-${Math.floor(1000 + Math.random() * 9000)}/2026`,
      nhbRating: payload.nhbRating || '3-Star Certified Nursery',
      ownerName: payload.ownerName || 'Horticulture Proprietor',
      phone: payload.phone || '+919700000000',
      email: payload.email || `${newId}@agrovercity.in`,
      district: payload.district || 'Nashik',
      taluka: payload.taluka || 'Dindori',
      state: payload.state || 'Maharashtra',
      nurseryAreaAcres: Number(payload.nurseryAreaAcres) || 4.5,
      polyhousesCount: Number(payload.polyhousesCount) || 3,
      totalStockAvailable: Number(payload.totalStockAvailable) || 25000,
      annualSaplingCapacity: Number(payload.annualSaplingCapacity) || 60000,
      specialization: payload.specialization || ['Kesar Mango (Grafted)', 'Bhagwa Pomegranate', 'Seedless Lemon (Kagzi)'],
      subsidyEligible: payload.subsidyEligible !== undefined ? !!payload.subsidyEligible : true,
      inspectionScore: Number(payload.inspectionScore) || 92,
      inspectionGrade: payload.inspectionGrade || 'A+',
      status: payload.status || 'pending_inspection',
      submittedAt: new Date().toISOString()
    }

    list.unshift(newNursery)
    save(NURSERIES_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'EMPANEL_PLANT_NURSERY',
      entityId: newNursery.id,
      entityName: newNursery.name,
      previousState: 'none',
      newState: newNursery.status,
      reason: `Onboarded plant nursery ${newNursery.name} (${newNursery.nhbRegistrationNo})`
    })

    return { success: true, data: newNursery }
  },

  approveNursery: async (nurseryId, payload = {}) => {
    const list = getStored(NURSERIES_STORAGE_KEY, mockNurseries)
    const nursery = list.find((n) => n.id === nurseryId)
    if (!nursery) throw new Error('Plant nursery not found')

    const prevState = nursery.status
    const {
      status = 'approved',
      inspectionGrade = 'A+',
      subsidyEligible = true,
      approvedBy = 'root@agrovercity',
      notes = 'Government certified sapling distribution approved.'
    } = payload

    nursery.status = status
    nursery.inspectionGrade = inspectionGrade
    nursery.subsidyEligible = !!subsidyEligible
    nursery.approvedAt = new Date().toISOString()
    nursery.approvedBy = approvedBy

    save(NURSERIES_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: approvedBy,
      actionType: 'APPROVE_CERTIFIED_NURSERY',
      entityId: nursery.id,
      entityName: nursery.name,
      previousState: prevState,
      newState: status,
      reason: notes
    })

    return { success: true, data: nursery }
  },

  batchUpdateNurseries: async ({ ids = [], action = 'approved', reason = 'Batch empanelment', adminUid = 'root@agrovercity' }) => {
    const list = getStored(NURSERIES_STORAGE_KEY, mockNurseries)
    let updatedCount = 0

    list.forEach((n) => {
      if (ids.includes(n.id)) {
        n.status = action
        n.approvedAt = new Date().toISOString()
        n.approvedBy = adminUid
        updatedCount++
      }
    })

    save(NURSERIES_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'BATCH_UPDATE_NURSERIES',
      entityId: ids.join(', '),
      entityName: `${updatedCount} Nurseries`,
      previousState: 'mixed',
      newState: action,
      reason
    })

    return { success: true, count: updatedCount }
  },

  // 5. Direct A2 Dairy Marketplace
  listDairyProducts: async ({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    category = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (category !== 'all' && item.category !== category) return false
      if (!matchesDateRange(item.manufacturedDate || item.recalledAt, dateRange)) return false
      if (!needle) return true

      return [
        item.id,
        item.name,
        item.category,
        item.brandOrGaushala,
        item.fssaiLicenseNo,
        item.batchNo,
        item.labReportId,
        item.labName
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createDairyProduct: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    const newId = `dry_${String(list.length + 1).padStart(2, '0')}`

    const newProduct = {
      id: newId,
      name: payload.name || 'Pure A2 Desi Gir Cow Ghee',
      category: payload.category || 'Desi Ghee',
      brandOrGaushala: payload.brandOrGaushala || 'Shree Krishna Gopalan Trust',
      packSize: payload.packSize || '1000 ml Glass Jar',
      priceINR: Number(payload.priceINR) || 1650,
      stockAvailable: Number(payload.stockAvailable) || 150,
      batchNo: payload.batchNo || `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      fssaiLicenseNo: payload.fssaiLicenseNo || '11521045000214',
      a2BetaCaseinPurity: Number(payload.a2BetaCaseinPurity) || 99.8,
      antibioticResidueFree: payload.antibioticResidueFree !== undefined ? !!payload.antibioticResidueFree : true,
      fatPercentage: Number(payload.fatPercentage) || 99.7,
      snfPercentage: Number(payload.snfPercentage) || 0.1,
      storageTemp: payload.storageTemp || 'Ambient (Dry & Cool)',
      labReportId: payload.labReportId || `NABL-LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      labName: payload.labName || 'National Dairy Research & Quality Laboratory, Pune',
      status: payload.status || 'active',
      manufacturedDate: new Date().toISOString().slice(0, 10)
    }

    list.unshift(newProduct)
    save(DAIRY_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'CREATE_DAIRY_PRODUCT_SKU',
      entityId: newProduct.id,
      entityName: newProduct.name,
      previousState: 'none',
      newState: newProduct.status,
      reason: `Added dairy SKU ${newProduct.name} batch #${newProduct.batchNo}`
    })

    return { success: true, data: newProduct }
  },

  updateDairyProductStatus: async (productId, payload = {}) => {
    const list = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    const product = list.find((p) => p.id === productId)
    if (!product) throw new Error('Dairy product not found')

    const prevState = product.status
    const {
      status,
      recallReason = '',
      labReportId = '',
      updatedBy = 'root@agrovercity'
    } = payload

    product.status = status
    if (recallReason) product.recallReason = recallReason
    if (labReportId) product.labReportId = labReportId
    if (status === 'recalled') {
      product.recalledAt = new Date().toISOString()
      product.recalledBy = updatedBy
      product.stockAvailable = 0
    }

    save(DAIRY_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: updatedBy,
      actionType: status === 'recalled' ? 'RECALL_DAIRY_BATCH' : 'CLEAR_DAIRY_LAB_TEST',
      entityId: product.id,
      entityName: product.name,
      previousState: prevState,
      newState: status,
      reason: recallReason || `Lab certification ${labReportId} confirmed compliant.`
    })

    return { success: true, data: product }
  },

  batchUpdateDairyProducts: async ({ ids = [], action = 'active', reason = 'Batch lab clearance', adminUid = 'root@agrovercity' }) => {
    const list = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    let updatedCount = 0

    list.forEach((p) => {
      if (ids.includes(p.id)) {
        p.status = action
        if (action === 'recalled') p.stockAvailable = 0
        updatedCount++
      }
    })

    save(DAIRY_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'BATCH_UPDATE_DAIRY',
      entityId: ids.join(', '),
      entityName: `${updatedCount} Dairy SKUs`,
      previousState: 'mixed',
      newState: action,
      reason
    })

    return { success: true, count: updatedCount }
  },

  // 6. Emergency Vet Bookings
  listVetBookings: async ({
    page = 1,
    pageSize = 20,
    q = '',
    urgency = 'all',
    status = 'all',
    district = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(BOOKINGS_STORAGE_KEY, mockVetBookings)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (urgency !== 'all' && item.urgencyLevel !== urgency) return false
      if (status !== 'all' && item.bookingStatus !== status) return false
      if (district !== 'all' && item.district !== district) return false
      if (!matchesDateRange(item.bookedAt, dateRange)) return false
      if (!needle) return true

      return [
        item.id,
        item.bookingNumber,
        item.farmerName,
        item.farmerPhone,
        item.maskedAadhaar,
        item.animalType,
        item.animalIdTag,
        item.assignedVetName,
        item.village,
        item.district
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createVetBooking: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(BOOKINGS_STORAGE_KEY, mockVetBookings)
    const newId = `bk_${String(list.length + 1).padStart(2, '0')}`

    const newBooking = {
      id: newId,
      bookingNumber: `VET-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      farmerName: payload.farmerName || 'Kisan Farmer',
      farmerPhone: payload.farmerPhone || '+919822000000',
      maskedAadhaar: payload.maskedAadhaar || 'XXXX-XXXX-9901',
      village: payload.village || 'Shivar Village',
      taluka: payload.taluka || 'Haveli',
      district: payload.district || 'Pune',
      animalType: payload.animalType || 'Gir Cow',
      animalIdTag: payload.animalIdTag || `TAG-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      urgencyLevel: payload.urgencyLevel || 'urgent',
      symptomsDescription: payload.symptomsDescription || 'Acute bovine distress reported; immediate clinical examination requested.',
      assignedVetId: payload.assignedVetId || 'vet_01',
      assignedVetName: payload.assignedVetName || 'Dr. Anand Shantaram Kulkarni',
      vetPhone: payload.vetPhone || '+919822345012',
      dispatchEtaMinutes: Number(payload.dispatchEtaMinutes) || 35,
      totalAmount: Number(payload.totalAmount) || 450,
      paymentStatus: 'paid_escrow',
      bookingStatus: payload.urgencyLevel === 'critical_emergency' ? 'emergency_dispatched' : 'confirmed',
      bookedAt: new Date().toISOString()
    }

    list.unshift(newBooking)
    save(BOOKINGS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'DISPATCH_EMERGENCY_VET',
      entityId: newBooking.id,
      entityName: `${newBooking.bookingNumber} (${newBooking.farmerName})`,
      previousState: 'none',
      newState: newBooking.bookingStatus,
      reason: `Emergency vet booking intake: ${newBooking.symptomsDescription}`
    })

    return { success: true, data: newBooking }
  },

  mediateVetBooking: async (bookingId, payload = {}) => {
    const list = getStored(BOOKINGS_STORAGE_KEY, mockVetBookings)
    const b = list.find((item) => item.id === bookingId)
    if (!b) throw new Error('Vet appointment booking not found')

    const prevState = b.bookingStatus
    const {
      action = 'refund_farmer',
      reason = '',
      reassignVetId = null,
      reassignVetName = '',
      mediatedBy = 'root@agrovercity'
    } = payload

    if (action === 'refund_farmer') {
      b.bookingStatus = 'dispute_mediation'
      b.paymentStatus = 'refunded'
      b.adminMediationRequired = true
      b.adminMediationReason = reason || 'Escrow refunded to farmer by admin mediation.'
    } else if (action === 'reassign_vet' && reassignVetId) {
      b.assignedVetId = reassignVetId
      b.assignedVetName = reassignVetName || 'Reassigned Emergency Vet'
      b.bookingStatus = 'emergency_dispatched'
      b.dispatchEtaMinutes = 20
      b.doctorNotes = `Reassigned by admin: ${reason}`
    } else {
      b.bookingStatus = 'completed'
      b.paymentStatus = 'released_to_vet'
      b.adminMediationReason = reason || 'Dispute resolved and payment released.'
    }

    save(BOOKINGS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid: mediatedBy,
      actionType: 'MEDIATE_VET_BOOKING',
      entityId: b.id,
      entityName: `${b.bookingNumber} (${b.farmerName})`,
      previousState: prevState,
      newState: b.bookingStatus,
      reason
    })

    return { success: true, data: b }
  },

  // 7. Bulk Manure Orders
  listManureOrders: async ({
    page = 1,
    pageSize = 20,
    q = '',
    status = 'all',
    dualSignOff = 'all',
    dateRange = 'all'
  } = {}) => {
    let list = getStored(MANURE_STORAGE_KEY, mockManureOrders)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.deliveryStatus !== status) return false
      if (dualSignOff === 'required' && !item.dualSignOffRequired) return false
      if (dualSignOff === 'pending' && (!item.dualSignOffRequired || item.dualSignOffCompleted)) return false
      if (dualSignOff === 'completed' && (!item.dualSignOffRequired || !item.dualSignOffCompleted)) return false
      if (!matchesDateRange(item.orderDate, dateRange)) return false
      if (!needle) return true

      return [
        item.id,
        item.orderNumber,
        item.buyerName,
        item.buyerPhone,
        item.maskedAadhaar,
        item.gaushalaName,
        item.productName,
        item.vehicleNumber,
        item.driverName,
        item.deliveryDestination
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createManureOrder: async (payload, adminUid = 'root@agrovercity') => {
    const list = getStored(MANURE_STORAGE_KEY, mockManureOrders)
    const newId = `mnr_${String(list.length + 1).padStart(2, '0')}`
    const totalAmountINR = Number(payload.totalAmountINR) || (Number(payload.quantityMT || 10) * Number(payload.pricePerMT || 3600))
    const dualSignOffRequired = totalAmountINR > 50000

    const newOrder = {
      id: newId,
      orderNumber: `MNR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: payload.buyerName || 'Organic Grape Exporters FPO',
      buyerPhone: payload.buyerPhone || '+919822000000',
      maskedAadhaar: payload.maskedAadhaar || 'XXXX-XXXX-7721',
      deliveryDestination: payload.deliveryDestination || 'Agro Estate, Nashik',
      gaushalaId: payload.gaushalaId || 'gsh_01',
      gaushalaName: payload.gaushalaName || 'Shree Krishna Gopalan Trust & Gaushala',
      productName: payload.productName || 'Enriched Cow Dung Manure',
      quantityMT: Number(payload.quantityMT) || 15.0,
      pricePerMT: Number(payload.pricePerMT) || 3600,
      totalAmountINR,
      dualSignOffRequired,
      dualSignOffCompleted: false,
      signOff1: null,
      signOff2: null,
      deliveryStatus: dualSignOffRequired ? 'pending_dual_signoff' : 'loading_at_gaushala',
      vehicleNumber: payload.vehicleNumber || 'MH-15-EG-4402',
      driverName: payload.driverName || 'Ramesh Dattatray Bhalerao',
      driverPhone: payload.driverPhone || '+919860123456',
      orderDate: new Date().toISOString()
    }

    list.unshift(newOrder)
    save(MANURE_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      actionType: 'CREATE_MANURE_ORDER',
      entityId: newOrder.id,
      entityName: `${newOrder.orderNumber} (${newOrder.buyerName})`,
      previousState: 'none',
      newState: newOrder.deliveryStatus,
      reason: `Bulk manure order of ${newOrder.quantityMT} MT (₹${newOrder.totalAmountINR.toLocaleString('en-IN')}). Dual sign-off required: ${dualSignOffRequired}`
    })

    return { success: true, data: newOrder }
  },

  signOffManureOrder: async (orderId, payload = {}) => {
    const list = getStored(MANURE_STORAGE_KEY, mockManureOrders)
    const o = list.find((item) => item.id === orderId)
    if (!o) throw new Error('Bulk manure order record not found')

    const {
      adminUid = 'root@agrovercity',
      adminName = 'Super Admin',
      role = 'Chief Risk Officer',
      reason = 'Dual sign-off authorized for bulk manure dispatch'
    } = payload

    if (!o.signOff1) {
      o.signOff1 = { adminUid, name: `${adminName} (${role})`, timestamp: new Date().toISOString() }
      o.deliveryStatus = 'pending_dual_signoff'
    } else if (!o.signOff2) {
      if (o.signOff1.adminUid === adminUid) {
        throw new Error('Dual sign-off requires a distinct secondary administrator (CRO and Finance Director).')
      }
      o.signOff2 = { adminUid, name: `${adminName} (${role})`, timestamp: new Date().toISOString() }
      o.dualSignOffCompleted = true
      o.deliveryStatus = 'in_transit'
    } else {
      throw new Error('Order is already fully sign-off approved.')
    }

    save(MANURE_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: o.dualSignOffCompleted ? 'DUAL_SIGNOFF_RELEASE' : 'MANURE_ORDER_SIGN_OFF',
      entityId: o.id,
      entityName: `${o.orderNumber} - ${o.buyerName}`,
      previousState: 'pending_signoff',
      newState: o.deliveryStatus,
      reason
    })

    return { success: true, data: o }
  },

  // 8. Orders Audit (SOP-19 §5: GET /v1/admin/livestock/orders)
  auditOrders: async ({
    page = 1,
    pageSize = 20,
    q = '',
    type = 'all', // 'all', 'dairy', 'manure'
    status = 'all',
    dateRange = 'all'
  } = {}) => {
    const dairy = getStored(DAIRY_STORAGE_KEY, mockDairyProducts)
    const manure = getStored(MANURE_STORAGE_KEY, mockManureOrders)
    const needle = q.trim().toLowerCase()

    let combined = []

    if (type === 'all' || type === 'dairy') {
      dairy.forEach((d) => {
        const compliance =
          d.status === 'active'
            ? 'NABL Cleared'
            : d.status === 'recalled'
            ? 'RECALLED BATCH'
            : 'Awaiting Lab NABL'
        const risk =
          d.status === 'recalled'
            ? 'CRITICAL_RISK'
            : (d.a2BetaCaseinPurity || 0) >= 98
            ? 'LOW_RISK'
            : 'MEDIUM_RISK'

        combined.push({
          id: d.id,
          orderOrBatchNumber: d.batchNo || d.id,
          itemType: 'dairy',
          title: d.name || 'A2 Dairy Product',
          producerOrGaushala: d.brandOrGaushala || 'Registered Gaushala',
          quantityOrStock: `${d.stockAvailable || 0} units in stock`,
          amountINR: (d.priceINR || 0) * (d.stockAvailable || 1),
          complianceStatus: compliance,
          labOrWeighbridgeSlip: d.labReportId || 'Pending Certification',
          dualSignOffStatus: 'Standard Escrow',
          auditRiskLevel: risk,
          timestamp: d.manufacturedDate || d.labTestDate || d.statusHistory?.[0]?.timestamp || new Date().toISOString(),
          raw: d
        })
      })
    }

    if (type === 'all' || type === 'manure') {
      manure.forEach((m) => {
        const compliance = (m.deliveryStatus || 'in_transit').replace(/_/g, ' ').toUpperCase()
        const dualSign = m.dualSignOffRequired
          ? m.dualSignOffCompleted
            ? 'Dual Approved (CRO & Fin)'
            : 'Sign-off Pending (>₹50k)'
          : 'Standard Order (<₹50k)'
        const risk =
          m.dualSignOffRequired && !m.dualSignOffCompleted ? 'HIGH_RISK_HOLD' : 'LOW_RISK'

        combined.push({
          id: m.id,
          orderOrBatchNumber: m.orderNumber || m.id,
          itemType: 'manure',
          title: m.productName || 'Bulk Organic Manure',
          producerOrGaushala: m.gaushalaName || 'Organic Gaushala Unit',
          quantityOrStock: `${m.quantityMT || 0} MT`,
          amountINR: m.totalAmountINR || 0,
          complianceStatus: compliance,
          labOrWeighbridgeSlip: m.vehicleNumber ? `GatePass / ${m.vehicleNumber}` : 'GatePass Logged',
          dualSignOffStatus: dualSign,
          auditRiskLevel: risk,
          timestamp: m.orderDate || new Date().toISOString(),
          raw: m
        })
      })
    }

    // Filter
    combined = combined.filter((item) => {
      if (status && status !== 'all') {
        const s = status.toLowerCase()
        const cs = (item.complianceStatus || '').toLowerCase()
        const ds = (item.dualSignOffStatus || '').toLowerCase()
        const ar = (item.auditRiskLevel || '').toLowerCase()

        if (s.includes('dual') || s.includes('signoff')) {
          if (!ds.includes('pending') && !cs.includes('dual')) return false
        } else if (s === 'recalled batch' || s.includes('recalled')) {
          if (!cs.includes('recalled') && !ar.includes('critical')) return false
        } else if (s === 'nabl cleared' || s.includes('cleared')) {
          if (!cs.includes('cleared') && !cs.includes('nabl')) return false
        } else if (s === 'in transit' || s.includes('transit')) {
          if (!cs.includes('transit')) return false
        } else if (s === 'delivered' || s.includes('delivered')) {
          if (!cs.includes('delivered')) return false
        } else {
          if (cs !== s && !cs.includes(s)) return false
        }
      }

      if (!matchesDateRange(item.timestamp, dateRange)) return false

      if (!needle) return true

      return [
        item.id,
        item.orderOrBatchNumber,
        item.title,
        item.producerOrGaushala,
        item.labOrWeighbridgeSlip,
        item.dualSignOffStatus,
        item.complianceStatus,
        item.auditRiskLevel
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    // Sort by timestamp desc
    combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return paginateItems(combined, page, pageSize)
  },

  // 9. Audit Logs
  listLivestockAuditLogs: async ({
    page = 1,
    pageSize = 20,
    q = '',
    actionType = 'all',
    dateRange = 'all'
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
        log.previousState,
        log.newState,
        log.reason
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  // 10. Reset to Default Seed Data
  resetToDefaultSeed: async (reason = 'Restored SOP-19 benchmark seed dataset', adminUid = 'root@agrovercity') => {
    localStorage.setItem(VETS_STORAGE_KEY, JSON.stringify(mockVets))
    localStorage.setItem(GAUSHALAS_STORAGE_KEY, JSON.stringify(mockGaushalas))
    localStorage.setItem(NURSERIES_STORAGE_KEY, JSON.stringify(mockNurseries))
    localStorage.setItem(DAIRY_STORAGE_KEY, JSON.stringify(mockDairyProducts))
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(mockVetBookings))
    localStorage.setItem(MANURE_STORAGE_KEY, JSON.stringify(mockManureOrders))

    recordAuditLog({
      adminUid,
      actionType: 'RESET_SEED_DATA',
      entityId: 'SYSTEM_SOP_19',
      entityName: 'Livestock & Dairy Target Collections',
      previousState: 'custom_state',
      newState: 'default_seed',
      reason
    })

    return { success: true, message: 'All Module 19 collections reset to official benchmark state.' }
  }
}
