import { request } from './client'
import * as adminWomenShgService from '../services/adminWomenShgService'

let apiDisabled = false

function toQueryString(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.append(k, String(v))
    }
  })
  const str = q.toString()
  return str ? `?${str}` : ''
}

// --- 1. KPI Summary ---
export async function getWomenShgSummary() {
  if (apiDisabled) {
    return adminWomenShgService.getWomenShgSummary()
  }
  try {
    const res = await request('GET', '/v1/admin/women/summary')
    return res?.data || adminWomenShgService.getWomenShgSummary()
  } catch {
    apiDisabled = true
    return adminWomenShgService.getWomenShgSummary()
  }
}

// --- 2. Women Self Help Groups ---
export async function listWomenShgs(query = {}) {
  if (apiDisabled) {
    return adminWomenShgService.listWomenShgs(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/women/shgs${qs}`)
    return res?.data || adminWomenShgService.listWomenShgs(query)
  } catch {
    apiDisabled = true
    return adminWomenShgService.listWomenShgs(query)
  }
}

export async function getWomenShgById(id) {
  if (apiDisabled) {
    return adminWomenShgService.getWomenShgById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/women/shgs/${id}`)
    return res?.data || adminWomenShgService.getWomenShgById(id)
  } catch {
    apiDisabled = true
    return adminWomenShgService.getWomenShgById(id)
  }
}

export async function verifyWomenShg(id, grantEligibility = 'eligible', reason = '', adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.verifyWomenShg(id, grantEligibility, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/women/shgs/${id}/verify`, { grantEligibility, reason })
    return res?.data || adminWomenShgService.verifyWomenShg(id, grantEligibility, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.verifyWomenShg(id, grantEligibility, reason, adminUid, adminName)
  }
}

export async function suspendWomenShg(id, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.suspendWomenShg(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/women/shgs/${id}/suspend`, { reason })
    return res?.data || adminWomenShgService.suspendWomenShg(id, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.suspendWomenShg(id, reason, adminUid, adminName)
  }
}

export async function batchVerifyShgs(ids, grantEligibility = 'eligible', reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminWomenShgService.batchVerifyShgs(ids, grantEligibility, reason, adminUid, adminName)
}

export async function batchSuspendShgs(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminWomenShgService.batchSuspendShgs(ids, reason, adminUid, adminName)
}

// --- 3. Recurring Micro-Savings & Deposits ---
export async function listShgDeposits(query = {}) {
  if (apiDisabled) {
    return adminWomenShgService.listShgDeposits(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/women/deposits${qs}`)
    return res?.data || adminWomenShgService.listShgDeposits(query)
  } catch {
    apiDisabled = true
    return adminWomenShgService.listShgDeposits(query)
  }
}

export async function recordShgDeposit(payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.recordShgDeposit(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/women/deposits', payload)
    return res?.data || adminWomenShgService.recordShgDeposit(payload, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.recordShgDeposit(payload, adminUid, adminName)
  }
}

export async function batchClearDeposits(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminWomenShgService.batchClearDeposits(ids, reason, adminUid, adminName)
}

// --- 4. Home Enterprises Storefront Marketplace ---
export async function listHomeEnterprises(query = {}) {
  if (apiDisabled) {
    return adminWomenShgService.listHomeEnterprises(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/women/enterprise-products${qs}`)
    return res?.data || adminWomenShgService.listHomeEnterprises(query)
  } catch {
    apiDisabled = true
    return adminWomenShgService.listHomeEnterprises(query)
  }
}

export async function curateEnterpriseProduct(id, status, curationNotes, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.curateEnterpriseProduct(id, status, curationNotes, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/women/enterprise-products/${id}/curate`, {
      status,
      curationNotes,
      reason
    })
    return res?.data || adminWomenShgService.curateEnterpriseProduct(id, status, curationNotes, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.curateEnterpriseProduct(id, status, curationNotes, reason, adminUid, adminName)
  }
}

export async function batchCurateProducts(ids, status, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminWomenShgService.batchCurateProducts(ids, status, reason, adminUid, adminName)
}

// --- 5. Interest Subvention Subsidies & NRLM Grants ---
export async function listShgSubsidies(query = {}) {
  if (apiDisabled) {
    return adminWomenShgService.listShgSubsidies(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/women/subsidies${qs}`)
    return res?.data || adminWomenShgService.listShgSubsidies(query)
  } catch {
    apiDisabled = true
    return adminWomenShgService.listShgSubsidies(query)
  }
}

export async function disburseSubventionSubsidy(id, reason, coAdmin = null, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.disburseSubventionSubsidy(id, reason, coAdmin, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/women/subsidies/${id}/disburse`, { reason, coAdmin })
    return res?.data || adminWomenShgService.disburseSubventionSubsidy(id, reason, coAdmin, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.disburseSubventionSubsidy(id, reason, coAdmin, adminUid, adminName)
  }
}

export async function batchDisburseSubsidies(ids, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  return adminWomenShgService.batchDisburseSubsidies(ids, reason, adminUid, adminName)
}

// --- 6. District Telemetry & Women Mode Adoption ---
export async function listDistrictAdoption(query = {}) {
  if (apiDisabled) {
    return adminWomenShgService.listDistrictAdoption(query)
  }
  try {
    const qs = toQueryString(query)
    const res = await request('GET', `/v1/admin/women/districts${qs}`)
    return res?.data || adminWomenShgService.listDistrictAdoption(query)
  } catch {
    apiDisabled = true
    return adminWomenShgService.listDistrictAdoption(query)
  }
}

export async function updateDistrictStatus(id, newStatus, reason, adminUid = 'usr_admin_root', adminName = 'Super Admin') {
  if (apiDisabled) {
    return adminWomenShgService.updateDistrictStatus(id, newStatus, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/women/districts/${id}/status`, { newStatus, reason })
    return res?.data || adminWomenShgService.updateDistrictStatus(id, newStatus, reason, adminUid, adminName)
  } catch {
    apiDisabled = true
    return adminWomenShgService.updateDistrictStatus(id, newStatus, reason, adminUid, adminName)
  }
}

// --- 7. Audit Logs & Seed Reset ---
export async function getWomenAuditLogs(query = {}) {
  return adminWomenShgService.getWomenAuditLogs(query)
}

export async function getEntityAuditLogs(entityId) {
  return adminWomenShgService.getEntityAuditLogs(entityId)
}

export async function resetWomenShgSeedData(reason, adminUid, adminName) {
  return adminWomenShgService.resetToDefaultSeed(reason, adminUid, adminName)
}

// Target Collection alias: shg_groups (SOP-24)
export const listWomenShgGroups = listWomenShgs
export const verifyWomenShgGroup = verifyWomenShg

