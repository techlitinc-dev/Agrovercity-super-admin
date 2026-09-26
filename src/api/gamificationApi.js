import { request } from './client'
import { adminGamificationService } from '../services/adminGamificationService'

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

// -------------------------------------------------------------
// 0. SUMMARY
// -------------------------------------------------------------
export async function getGamificationSummary() {
  if (apiDisabled) {
    return adminGamificationService.getGamificationSummary()
  }
  try {
    const res = await request('GET', '/admin/gamification/summary')
    return res?.data || (await adminGamificationService.getGamificationSummary())
  } catch {
    apiDisabled = true
    return adminGamificationService.getGamificationSummary()
  }
}

// -------------------------------------------------------------
// 1. KRISHI RATNA USER TIERS (gamification_status)
// -------------------------------------------------------------
export async function listGamificationStatus(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.listGamificationStatus(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/gamification/status${qs}`)
    return res?.data || (await adminGamificationService.listGamificationStatus(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.listGamificationStatus(params)
  }
}

export async function getGamificationStatusById(id) {
  if (apiDisabled) {
    return adminGamificationService.getGamificationStatusById(id)
  }
  try {
    const res = await request('GET', `/admin/gamification/status/${id}`)
    return res?.data || (await adminGamificationService.getGamificationStatusById(id))
  } catch {
    apiDisabled = true
    return adminGamificationService.getGamificationStatusById(id)
  }
}

export async function manualAdjustCoins(userId, amount, reason, dualSignOffAdmin = null, adminUid, adminName) {
  if (apiDisabled) {
    return adminGamificationService.manualAdjustCoins(userId, amount, reason, dualSignOffAdmin, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/admin/gamification/ledger/adjust`, {
      userId,
      amount,
      reason,
      dualSignOffAdmin
    })
    return res?.data || (await adminGamificationService.manualAdjustCoins(userId, amount, reason, dualSignOffAdmin, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminGamificationService.manualAdjustCoins(userId, amount, reason, dualSignOffAdmin, adminUid, adminName)
  }
}

export async function batchAdjustCoins(userIds, delta, reason, adminUid, adminName) {
  return adminGamificationService.batchAdjustCoins(userIds, delta, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 2. AGRI COINS LEDGER (/v1/admin/gamification/ledger)
// -------------------------------------------------------------
export async function listAgriCoinsLedger(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.listAgriCoinsLedger(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/gamification/ledger${qs}`)
    return res?.data || (await adminGamificationService.listAgriCoinsLedger(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.listAgriCoinsLedger(params)
  }
}

// -------------------------------------------------------------
// 3. REWARDS STORE (/v1/admin/gamification/rewards)
// -------------------------------------------------------------
export async function listRewardCoupons(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.listRewardCoupons(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/gamification/rewards${qs}`)
    return res?.data || (await adminGamificationService.listRewardCoupons(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.listRewardCoupons(params)
  }
}

export async function createRewardCoupon(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminGamificationService.createRewardCoupon(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/admin/gamification/rewards', payload)
    return res?.data || (await adminGamificationService.createRewardCoupon(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminGamificationService.createRewardCoupon(payload, adminUid, adminName)
  }
}

export async function updateRewardCoupon(id, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminGamificationService.updateRewardCoupon(id, payload, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/admin/gamification/rewards/${id}`, payload)
    return res?.data || (await adminGamificationService.updateRewardCoupon(id, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminGamificationService.updateRewardCoupon(id, payload, adminUid, adminName)
  }
}

export async function toggleCouponStatus(id, newStatus, reason, adminUid, adminName) {
  return adminGamificationService.toggleCouponStatus(id, newStatus, reason, adminUid, adminName)
}

export async function batchUpdateCouponStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminGamificationService.batchUpdateCouponStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 4. REFERRALS & FRAUD AUDIT (/v1/admin/referrals/audit)
// -------------------------------------------------------------
export async function listReferrals(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.listReferrals(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/referrals/audit${qs}`)
    return res?.data || (await adminGamificationService.listReferrals(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.listReferrals(params)
  }
}

export async function banReferralFraudUser(userId, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminGamificationService.banReferralFraudUser(userId, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/admin/referrals/fraud-ban`, { userId, reason })
    return res?.data || (await adminGamificationService.banReferralFraudUser(userId, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminGamificationService.banReferralFraudUser(userId, reason, adminUid, adminName)
  }
}

export async function batchUpdateReferralStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminGamificationService.batchUpdateReferralStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 5. RATINGS & REVIEWS MODERATION (/v1/admin/ratings/{id})
// -------------------------------------------------------------
export async function listRatings(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.listRatings(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/ratings${qs}`)
    return res?.data || (await adminGamificationService.listRatings(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.listRatings(params)
  }
}

export async function removeRating(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminGamificationService.removeRating(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/admin/ratings/${id}`, { reason })
    return res?.data || (await adminGamificationService.removeRating(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminGamificationService.removeRating(id, reason, adminUid, adminName)
  }
}

export async function approveRating(id, reason, adminUid, adminName) {
  return adminGamificationService.approveRating(id, reason, adminUid, adminName)
}

export async function batchUpdateRatingStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminGamificationService.batchUpdateRatingStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 6. ACTIVITY EARN RATES CONFIGURATION
// -------------------------------------------------------------
export async function getEarnRates() {
  return adminGamificationService.getEarnRates()
}

export async function updateEarnRates(newRates, reason, adminUid, adminName) {
  return adminGamificationService.updateEarnRates(newRates, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 7. AUDIT LOGS (/v1/admin/gamification/audit_logs)
// -------------------------------------------------------------
export async function getGamificationAuditLogs(params = {}) {
  if (apiDisabled) {
    return adminGamificationService.getGamificationAuditLogs(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/admin/gamification/audit_logs${qs}`)
    return res?.data || (await adminGamificationService.getGamificationAuditLogs(params))
  } catch {
    apiDisabled = true
    return adminGamificationService.getGamificationAuditLogs(params)
  }
}

export async function getEntityAuditLogs(entityId) {
  return adminGamificationService.getEntityAuditLogs(entityId)
}

// -------------------------------------------------------------
// 8. BENCHMARK SEED RESET
// -------------------------------------------------------------
export async function resetGamificationSeedData(reason, adminUid, adminName) {
  return adminGamificationService.resetToDefaultSeed(reason, adminUid, adminName)
}
