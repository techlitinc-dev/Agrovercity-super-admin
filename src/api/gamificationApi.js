import { request } from './client'
import {
  mockGamificationStatus,
  mockAgriCoinsLedger,
  mockRewardCoupons,
  mockReferrals,
  mockRatings,
  mockGamificationAuditLogs,
  mockGamificationSummary
} from './gamificationMockData'

let mockMode = false

function paginate(list, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length
  }
}

// In-memory state for mutations
let statusState = JSON.parse(JSON.stringify(mockGamificationStatus))
let ledgerState = JSON.parse(JSON.stringify(mockAgriCoinsLedger))
let couponsState = JSON.parse(JSON.stringify(mockRewardCoupons))
let referralsState = JSON.parse(JSON.stringify(mockReferrals))
let ratingsState = JSON.parse(JSON.stringify(mockRatings))
let auditLogsState = JSON.parse(JSON.stringify(mockGamificationAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_gam_${Date.now()}`,
    adminUid: 'usr_admin_root',
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.15',
    actionType,
    entityId,
    entityName,
    collection,
    previousState,
    newState,
    reason: reason || 'Routine gamification administrative operation'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

export async function getGamificationSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/admin/gamification/summary')
    } catch {
      mockMode = true
    }
  }

  const fraudFlags = referralsState.filter((r) => r.status === 'flagged_fraud').length
  const flaggedReviews = ratingsState.filter((r) => r.status === 'flagged' || r.flaggedAbusive).length
  const activeCoupons = couponsState.filter((c) => c.status === 'active').length

  return {
    ...mockGamificationSummary,
    flaggedReferralFraudAlerts: fraudFlags,
    flaggedAbusiveRatings: flaggedReviews,
    activeCouponsCount: activeCoupons
  }
}

// -------------------------------------------------------------
// 1. KRISHI RATNA USER TIERS (gamification_status)
// -------------------------------------------------------------
export async function listGamificationStatus({ q = '', tier = 'all', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, tier, status, page, pageSize })
      return await request('GET', `/admin/gamification/status?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = statusState.filter((item) => {
    if (tier !== 'all' && String(item.tier) !== String(tier)) return false
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true
    return [item.userId, item.userName, item.userPhone, item.district, item.currentTierName]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

// -------------------------------------------------------------
// 2. AGRI COINS LEDGER (/v1/admin/gamification/ledger)
// -------------------------------------------------------------
export async function listAgriCoinsLedger({ q = '', type = 'all', sourceActivity = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, type, sourceActivity, page, pageSize })
      return await request('GET', `/admin/gamification/ledger?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = ledgerState.filter((tx) => {
    if (type !== 'all' && tx.type !== type) return false
    if (sourceActivity !== 'all' && tx.sourceActivity !== sourceActivity) return false
    if (!needle) return true
    return [tx.id, tx.userId, tx.userName, tx.referenceId, tx.notes]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function manualAdjustCoins(userId, amount, reason, dualSignOffAdmin = null) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/gamification/ledger/adjust`, { userId, amount, reason, dualSignOffAdmin })
    } catch {
      mockMode = true
    }
  }

  const user = statusState.find((u) => u.userId === userId)
  if (!user) throw new Error('User not found in gamification directory')

  const prevCoins = user.currentCoinsBalance
  const newBalance = prevCoins + amount
  user.currentCoinsBalance = Math.max(0, newBalance)
  user.updatedAt = new Date().toISOString()

  const tx = {
    id: `tx_coin_${Date.now()}`,
    userId,
    userName: user.userName,
    amount,
    type: amount >= 0 ? 'CREDIT' : 'DEBIT',
    sourceActivity: 'manual_admin_adjustment',
    balanceAfter: user.currentCoinsBalance,
    referenceId: `ADJ-${Date.now().toString().slice(-6)}`,
    notes: `${reason}${dualSignOffAdmin ? ` (Dual Sign-off: ${dualSignOffAdmin})` : ''}`,
    timestamp: new Date().toISOString()
  }
  ledgerState.unshift(tx)

  recordAudit({
    actionType: 'MANUAL_COIN_ADJUSTMENT',
    entityId: userId,
    entityName: user.userName,
    collection: 'agri_coins_ledger',
    previousState: `${prevCoins} Coins`,
    newState: `${user.currentCoinsBalance} Coins`,
    reason: `${reason}${dualSignOffAdmin ? ` [Dual Sign-off: ${dualSignOffAdmin}]` : ''}`
  })

  return { success: true, newBalance: user.currentCoinsBalance, transaction: tx }
}

// -------------------------------------------------------------
// 3. REWARDS STORE (/v1/admin/gamification/rewards)
// -------------------------------------------------------------
export async function listRewardCoupons({ q = '', status = 'all', category = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, category, page, pageSize })
      return await request('GET', `/admin/gamification/rewards?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = couponsState.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (category !== 'all' && c.category !== category) return false
    if (!needle) return true
    return [c.id, c.code, c.title, c.partnerMerchant]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createRewardCoupon(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/gamification/rewards', payload)
    } catch {
      mockMode = true
    }
  }

  const newCoupon = {
    id: `coup_${Date.now()}`,
    ...payload,
    claimedCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  couponsState.unshift(newCoupon)

  recordAudit({
    actionType: 'CREATE_REWARD_COUPON',
    entityId: newCoupon.id,
    entityName: newCoupon.title,
    collection: 'reward_coupons',
    previousState: 'none',
    newState: 'active',
    reason: `Added new reward voucher ${newCoupon.code} with ${newCoupon.totalStock} stock @ ${newCoupon.coinPrice} coins.`
  })

  return newCoupon
}

export async function updateRewardCoupon(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/gamification/rewards/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = couponsState.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Coupon not found')

  const prev = { ...couponsState[idx] }
  couponsState[idx] = {
    ...couponsState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_REWARD_COUPON',
    entityId: id,
    entityName: couponsState[idx].title,
    collection: 'reward_coupons',
    previousState: prev.status,
    newState: couponsState[idx].status,
    reason: payload.reason || 'Admin updated voucher stock/parameters'
  })

  return couponsState[idx]
}

// -------------------------------------------------------------
// 4. REFERRALS & FRAUD AUDIT (/v1/admin/referrals/audit)
// -------------------------------------------------------------
export async function listReferrals({ q = '', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, page, pageSize })
      return await request('GET', `/admin/referrals/audit?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = referralsState.filter((r) => {
    if (status !== 'all' && r.status !== status) return false
    if (!needle) return true
    return [r.id, r.referrerName, r.refereeName, r.referralCode, r.deviceFingerprint, r.ipAddress]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function banReferralFraudUser(userId, reason) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/referrals/fraud-ban`, { userId, reason })
    } catch {
      mockMode = true
    }
  }

  const u = statusState.find((s) => s.userId === userId)
  if (u) {
    u.status = 'suspended_fraud'
    u.currentCoinsBalance = 0
  }

  // Flag all referrals by this user
  referralsState.forEach((r) => {
    if (r.referrerId === userId) {
      r.status = 'flagged_fraud'
      r.coinsAwarded = 0
    }
  })

  recordAudit({
    actionType: 'BAN_REFERRAL_FRAUD_RING',
    entityId: userId,
    entityName: u ? u.userName : userId,
    collection: 'referrals',
    previousState: 'active',
    newState: 'suspended_fraud',
    reason: reason || 'Referral fraud syndicate banned by admin'
  })

  return { success: true, userId }
}

// -------------------------------------------------------------
// 5. RATINGS & REVIEWS MODERATION (/v1/admin/ratings/{id})
// -------------------------------------------------------------
export async function listRatings({ q = '', status = 'all', targetType = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, targetType, page, pageSize })
      return await request('GET', `/admin/ratings?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = ratingsState.filter((r) => {
    if (status !== 'all' && r.status !== status) return false
    if (targetType !== 'all' && r.targetType !== targetType) return false
    if (!needle) return true
    return [r.id, r.targetName, r.farmerName, r.bookingId, r.reviewText]
      .some((v) => String(v || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function removeRating(id, reason) {
  if (!mockMode) {
    try {
      return await request('DELETE', `/admin/ratings/${id}`, { reason })
    } catch {
      mockMode = true
    }
  }

  const idx = ratingsState.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error('Rating not found')

  const removed = ratingsState[idx]
  ratingsState[idx].status = 'removed'

  recordAudit({
    actionType: 'REMOVE_ABUSIVE_RATING',
    entityId: id,
    entityName: `Review on ${removed.targetName} by ${removed.farmerName}`,
    collection: 'ratings',
    previousState: removed.status,
    newState: 'removed',
    reason: reason || 'Removed abusive/defamatory rating'
  })

  return { success: true, id }
}

// -------------------------------------------------------------
// 6. AUDIT LOGS
// -------------------------------------------------------------
export async function getGamificationAuditLogs({ q = '', actionType = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, actionType, page, pageSize })
      return await request('GET', `/admin/gamification/audit_logs?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = auditLogsState.filter((log) => {
    if (actionType !== 'all' && log.actionType !== actionType) return false
    if (!needle) return true
    return [log.id, log.adminName, log.entityId, log.entityName, log.actionType, log.reason]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}
