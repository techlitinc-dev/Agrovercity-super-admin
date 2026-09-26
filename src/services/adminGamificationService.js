/**
 * AGROVERCITY SUPERADMIN — Module 22: Gamification, Krishi Ratna & Referrals Service
 * Document ID: SOP-22
 * Target Collections: gamification_status, agri_coins_ledger, reward_coupons, referrals, ratings, audit_logs
 *
 * Implements persistent LocalStorage storage, dynamic KPI recalculations,
 * date range & persona filters, dual-admin sign-off enforcement (> 50,000 coins / ₹50,000),
 * activity earn rates configuration, batch operations, and benchmark seed reset.
 */

import {
  mockGamificationStatus,
  mockAgriCoinsLedger,
  mockRewardCoupons,
  mockReferrals,
  mockRatings,
  mockGamificationAuditLogs,
  mockGamificationSummary
} from '../api/gamificationMockData'

const STATUS_KEY = 'agrovercity_superadmin_gam_status'
const LEDGER_KEY = 'agrovercity_superadmin_gam_ledger'
const COUPONS_KEY = 'agrovercity_superadmin_gam_coupons'
const REFERRALS_KEY = 'agrovercity_superadmin_gam_referrals'
const RATINGS_KEY = 'agrovercity_superadmin_gam_ratings'
const EARN_RATES_KEY = 'agrovercity_superadmin_gam_earn_rates'
const AUDIT_KEY = 'agrovercity_superadmin_gam_audit_logs'

export const defaultEarnRates = {
  crop_diary_entry: { id: 'crop_diary_entry', label: 'Crop Diary Log Entry', coins: 20, maxDaily: 60, category: 'Agronomy Diary' },
  equipment_drone_booking: { id: 'equipment_drone_booking', label: 'Equipment / Drone Rental Booking', coins: 50, maxDaily: 150, category: 'Farm Mechanization' },
  friend_referral_signup: { id: 'friend_referral_signup', label: 'Friend Referral Verification', coins: 100, maxDaily: 500, category: 'Virality Engine' },
  daily_streak_checkin: { id: 'daily_streak_checkin', label: 'Daily App Check-in Base', coins: 10, maxDaily: 50, category: 'Engagement Streak' },
  soil_water_test_booking: { id: 'soil_water_test_booking', label: 'Soil / Water Lab Test Booking', coins: 80, maxDaily: 160, category: 'Soil Diagnostics' },
  mandi_price_submission: { id: 'mandi_price_submission', label: 'Local Mandi Rate Submission', coins: 15, maxDaily: 45, category: 'Crowdsourced Mandi' }
}

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (err) {
    console.warn(`Failed to persist ${key} to localStorage:`, err)
  }
}

function getStoredAuditLogs() {
  return getStored(AUDIT_KEY, mockGamificationAuditLogs)
}

function recordAuditLog({
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin',
  actionType,
  entityId,
  entityName,
  collection,
  previousState = 'none',
  newState = 'active',
  reason = 'Routine superadmin gamification operation',
  ipAddress = '10.0.4.15'
}) {
  const list = getStoredAuditLogs()
  const logEntry = {
    id: `aud_gam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    adminUid,
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress,
    actionType,
    entityId: String(entityId || ''),
    entityName: String(entityName || ''),
    collection,
    previousState: String(previousState || ''),
    newState: String(newState || ''),
    reason
  }
  list.unshift(logEntry)
  save(AUDIT_KEY, list)
  return logEntry
}

function matchesDateRange(dateStr, range = 'all') {
  if (!range || range === 'all') return true
  if (!dateStr) return false
  const target = new Date(dateStr).getTime()
  const now = new Date().getTime()
  const dayMs = 24 * 60 * 60 * 1000

  switch (range) {
    case 'today':
      return now - target <= dayMs
    case 'last_7_days':
      return now - target <= 7 * dayMs
    case 'last_30_days':
      return now - target <= 30 * dayMs
    case 'this_quarter':
      return now - target <= 90 * dayMs
    default:
      return true
  }
}

function matchesPersona(item, persona = 'all') {
  if (!persona || persona === 'all') return true

  switch (persona) {
    case 'farmer':
      return (
        item.userId?.startsWith('usr_fm') ||
        item.farmerId?.startsWith('usr_fm') ||
        item.targetType === 'farmer' ||
        Boolean(item.farmerName)
      )
    case 'referrer':
      return Boolean(item.referralCode) || Boolean(item.referrerId)
    case 'service_provider':
      return ['transporter', 'equipment', 'vyapari', 'agronomist'].includes(item.targetType)
    case 'merchant_partner':
      return Boolean(item.partnerMerchant) || item.category?.includes('Discount') || item.category?.includes('Voucher')
    default:
      return true
  }
}

function paginateItems(items, page = 1, pageSize = 20) {
  const validPage = Math.max(1, parseInt(page, 10) || 1)
  const validSize = Math.max(1, parseInt(pageSize, 10) || 20)
  const start = (validPage - 1) * validSize
  return {
    data: items.slice(start, start + validSize),
    page: validPage,
    pageSize: validSize,
    total: items.length
  }
}

export const adminGamificationService = {
  // -------------------------------------------------------------
  // 0. SUMMARY & PLATFORM METRICS
  // -------------------------------------------------------------
  getGamificationSummary: async () => {
    const statuses = getStored(STATUS_KEY, mockGamificationStatus)
    const ledger = getStored(LEDGER_KEY, mockAgriCoinsLedger)
    const coupons = getStored(COUPONS_KEY, mockRewardCoupons)
    const referrals = getStored(REFERRALS_KEY, mockReferrals)
    const ratings = getStored(RATINGS_KEY, mockRatings)

    const totalCirculatingCoins = statuses.reduce((acc, u) => acc + (Number(u.currentCoinsBalance) || 0), 0)

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const dailyMintCoins = ledger
      .filter((tx) => tx.type === 'CREDIT' && new Date(tx.timestamp).getTime() >= startOfToday)
      .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0)

    const dailyBurnCoins = ledger
      .filter((tx) => tx.type === 'DEBIT' && new Date(tx.timestamp).getTime() >= startOfToday)
      .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0)

    const activeKrishiRatnaUsers = statuses.filter((u) => u.status === 'active').length
    const activeCouponsCount = coupons.filter((c) => c.status === 'active').length
    const couponsRedeemedMonth = coupons.reduce((acc, c) => acc + (Number(c.claimedCount) || 0), 0)
    const flaggedReferralFraudAlerts = referrals.filter((r) => r.status === 'flagged_fraud').length
    const flaggedAbusiveRatings = ratings.filter((r) => r.status === 'flagged' || r.flaggedAbusive).length

    return {
      totalCirculatingCoins: totalCirculatingCoins || mockGamificationSummary.totalCirculatingCoins,
      dailyMintCoins: dailyMintCoins || mockGamificationSummary.dailyMintCoins,
      dailyBurnCoins: dailyBurnCoins || mockGamificationSummary.dailyBurnCoins,
      activeKrishiRatnaUsers,
      activeCouponsCount,
      couponsRedeemedMonth,
      flaggedReferralFraudAlerts,
      flaggedAbusiveRatings
    }
  },

  // -------------------------------------------------------------
  // 1. KRISHI RATNA USER TIERS (gamification_status)
  // -------------------------------------------------------------
  listGamificationStatus: async ({
    q = '',
    tier = 'all',
    status = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(STATUS_KEY, mockGamificationStatus)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (tier !== 'all' && String(item.tier) !== String(tier)) return false
      if (status !== 'all' && item.status !== status) return false
      if (!matchesDateRange(item.updatedAt || item.createdAt, dateRange)) return false
      if (!matchesPersona(item, persona)) return false
      if (!needle) return true

      return [
        item.userId,
        item.userName,
        item.userPhone,
        item.district,
        item.currentTierName
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getGamificationStatusById: async (idOrUserId) => {
    const list = getStored(STATUS_KEY, mockGamificationStatus)
    const item = list.find((u) => u.id === idOrUserId || u.userId === idOrUserId)
    if (!item) throw new Error(`User status record not found for: ${idOrUserId}`)
    return item
  },

  manualAdjustCoins: async (
    userId,
    amount,
    reason = 'Manual administrative coin adjustment',
    dualSignOffAdmin = null,
    adminUid = 'usr_admin_root',
    adminName = 'Super Admin'
  ) => {
    const list = getStored(STATUS_KEY, mockGamificationStatus)
    const userIdx = list.findIndex((u) => u.userId === userId || u.id === userId)
    if (userIdx === -1) throw new Error(`User ${userId} not found in gamification directory.`)

    const user = list[userIdx]
    const delta = Number(amount) || 0
    const prevBalance = user.currentCoinsBalance || 0
    const newBalance = Math.max(0, prevBalance + delta)

    user.currentCoinsBalance = newBalance
    if (delta > 0) {
      user.lifetimeEarned = (user.lifetimeEarned || 0) + delta
    } else {
      user.lifetimeSpent = (user.lifetimeSpent || 0) + Math.abs(delta)
    }
    user.updatedAt = new Date().toISOString()
    list[userIdx] = user
    save(STATUS_KEY, list)

    // Append to ledger
    const ledger = getStored(LEDGER_KEY, mockAgriCoinsLedger)
    const tx = {
      id: `tx_coin_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user.userId,
      userName: user.userName,
      amount: Math.abs(delta),
      type: delta >= 0 ? 'CREDIT' : 'DEBIT',
      sourceActivity: 'manual_admin_adjustment',
      balanceAfter: newBalance,
      referenceId: `ADJ-${Date.now().toString().slice(-6)}`,
      notes: `${reason}${dualSignOffAdmin ? ` (Institutional Dual Sign-Off: ${dualSignOffAdmin})` : ''}`,
      timestamp: new Date().toISOString()
    }
    ledger.unshift(tx)
    save(LEDGER_KEY, ledger)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'MANUAL_COIN_ADJUSTMENT',
      entityId: user.userId,
      entityName: user.userName,
      collection: 'agri_coins_ledger',
      previousState: `${prevBalance} Coins`,
      newState: `${newBalance} Coins`,
      reason: `${reason}${dualSignOffAdmin ? ` [Dual Sign-off: ${dualSignOffAdmin}]` : ''}`
    })

    return { success: true, newBalance, transaction: tx }
  },

  batchAdjustCoins: async (
    userIds,
    delta,
    reason = 'Batch coin bonus/deduction',
    adminUid = 'usr_admin_root',
    adminName = 'Super Admin'
  ) => {
    const list = getStored(STATUS_KEY, mockGamificationStatus)
    const ledger = getStored(LEDGER_KEY, mockAgriCoinsLedger)
    const amount = Number(delta) || 0
    const idSet = new Set(userIds)
    let modified = 0

    list.forEach((u) => {
      if (idSet.has(u.userId) || idSet.has(u.id)) {
        const prev = u.currentCoinsBalance || 0
        const updated = Math.max(0, prev + amount)
        u.currentCoinsBalance = updated
        u.updatedAt = new Date().toISOString()

        ledger.unshift({
          id: `tx_coin_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          userId: u.userId,
          userName: u.userName,
          amount: Math.abs(amount),
          type: amount >= 0 ? 'CREDIT' : 'DEBIT',
          sourceActivity: 'batch_admin_bonus',
          balanceAfter: updated,
          referenceId: `BATCH-${Date.now().toString().slice(-6)}`,
          notes: reason,
          timestamp: new Date().toISOString()
        })
        modified++
      }
    })

    save(STATUS_KEY, list)
    save(LEDGER_KEY, ledger)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_COIN_ADJUSTMENT',
      entityId: userIds.join(','),
      entityName: `${modified} Krishi Ratna users`,
      collection: 'agri_coins_ledger',
      previousState: 'varied',
      newState: `Adjusted by ${amount >= 0 ? '+' : ''}${amount} coins`,
      reason
    })

    return { success: true, count: modified }
  },

  // -------------------------------------------------------------
  // 2. AGRI COINS LEDGER (agri_coins_ledger)
  // -------------------------------------------------------------
  listAgriCoinsLedger: async ({
    q = '',
    type = 'all',
    sourceActivity = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(LEDGER_KEY, mockAgriCoinsLedger)
    const needle = q.trim().toLowerCase()

    list = list.filter((tx) => {
      if (type !== 'all' && tx.type !== type) return false
      if (sourceActivity !== 'all' && tx.sourceActivity !== sourceActivity) return false
      if (!matchesDateRange(tx.timestamp, dateRange)) return false
      if (!matchesPersona(tx, persona)) return false
      if (!needle) return true

      return [
        tx.id,
        tx.userId,
        tx.userName,
        tx.referenceId,
        tx.sourceActivity,
        tx.notes
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  // -------------------------------------------------------------
  // 3. REWARDS STORE (reward_coupons)
  // -------------------------------------------------------------
  listRewardCoupons: async ({
    q = '',
    status = 'all',
    category = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(COUPONS_KEY, mockRewardCoupons)
    const needle = q.trim().toLowerCase()

    list = list.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (category !== 'all' && c.category !== category) return false
      if (!matchesDateRange(c.createdAt || c.updatedAt, dateRange)) return false
      if (!matchesPersona(c, persona)) return false
      if (!needle) return true

      return [
        c.id,
        c.code,
        c.title,
        c.category,
        c.partnerMerchant,
        c.description
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  createRewardCoupon: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(COUPONS_KEY, mockRewardCoupons)
    const newId = `coup_${Date.now()}`
    const totalStock = Number(payload.totalStock) || 100

    const newCoupon = {
      id: newId,
      code: (payload.code || `AGRO-DISC-${Math.floor(100 + Math.random() * 900)}`).toUpperCase(),
      category: payload.category || 'Fertilizer Discount',
      title: payload.title || 'Untitled Store Voucher',
      coinPrice: Number(payload.coinPrice) || 300,
      faceValueDiscountINR: Number(payload.faceValueDiscountINR) || 200,
      totalStock,
      claimedCount: 0,
      stockAvailable: totalStock,
      partnerMerchant: payload.partnerMerchant || 'Agrovercity Partner Merchants',
      validUntil: payload.validUntil || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      description: payload.description || 'Redeemable at authorized agro-retail centers.',
      status: payload.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    list.unshift(newCoupon)
    save(COUPONS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_REWARD_COUPON',
      entityId: newCoupon.id,
      entityName: newCoupon.title,
      collection: 'reward_coupons',
      previousState: 'none',
      newState: newCoupon.status,
      reason: `Added new reward voucher ${newCoupon.code} with ${newCoupon.totalStock} stock @ ${newCoupon.coinPrice} coins.`
    })

    return newCoupon
  },

  updateRewardCoupon: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(COUPONS_KEY, mockRewardCoupons)
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Voucher with ID ${id} not found.`)

    const prev = list[idx]
    const updatedStock = patch.totalStock !== undefined ? Number(patch.totalStock) : prev.totalStock
    const claimed = prev.claimedCount || 0
    const available = Math.max(0, updatedStock - claimed)

    const updated = {
      ...prev,
      ...patch,
      totalStock: updatedStock,
      stockAvailable: available,
      coinPrice: patch.coinPrice !== undefined ? Number(patch.coinPrice) : prev.coinPrice,
      faceValueDiscountINR: patch.faceValueDiscountINR !== undefined ? Number(patch.faceValueDiscountINR) : prev.faceValueDiscountINR,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updated
    save(COUPONS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_REWARD_COUPON',
      entityId: id,
      entityName: updated.title,
      collection: 'reward_coupons',
      previousState: `Status: ${prev.status}, Stock: ${prev.totalStock}`,
      newState: `Status: ${updated.status}, Stock: ${updated.totalStock}`,
      reason: patch.reason || 'Admin updated voucher stock / redemption parameters'
    })

    return updated
  },

  toggleCouponStatus: async (id, newStatus, reason = 'Status toggled', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    return adminGamificationService.updateRewardCoupon(id, { status: newStatus, reason }, adminUid, adminName)
  },

  batchUpdateCouponStatus: async (ids, newStatus, reason = 'Batch voucher update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(COUPONS_KEY, mockRewardCoupons)
    const idSet = new Set(ids)
    let modified = 0

    list.forEach((c) => {
      if (idSet.has(c.id)) {
        c.status = newStatus
        c.updatedAt = new Date().toISOString()
        modified++
      }
    })

    save(COUPONS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_COUPON_STATUS',
      entityId: ids.join(','),
      entityName: `${modified} reward coupons`,
      collection: 'reward_coupons',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modified }
  },

  // -------------------------------------------------------------
  // 4. REFERRALS & FRAUD (referrals)
  // -------------------------------------------------------------
  listReferrals: async ({
    q = '',
    status = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(REFERRALS_KEY, mockReferrals)
    const needle = q.trim().toLowerCase()

    list = list.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (!matchesDateRange(r.signupTimestamp, dateRange)) return false
      if (!matchesPersona(r, persona)) return false
      if (!needle) return true

      return [
        r.id,
        r.referrerId,
        r.referrerName,
        r.refereeName,
        r.refereePhone,
        r.referralCode,
        r.deviceFingerprint,
        r.ipAddress
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  banReferralFraudUser: async (userId, reason = 'Referral syndicate fraud ring detected', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const statuses = getStored(STATUS_KEY, mockGamificationStatus)
    const referrals = getStored(REFERRALS_KEY, mockReferrals)
    const ledger = getStored(LEDGER_KEY, mockAgriCoinsLedger)

    let userName = userId
    const u = statuses.find((s) => s.userId === userId || s.id === userId)
    if (u) {
      userName = u.userName
      const revoked = u.currentCoinsBalance || 0
      u.status = 'suspended_fraud'
      u.currentCoinsBalance = 0
      u.updatedAt = new Date().toISOString()

      // Record clawback transaction in ledger
      if (revoked > 0) {
        ledger.unshift({
          id: `tx_coin_${Date.now()}_clawback`,
          userId: u.userId,
          userName: u.userName,
          amount: revoked,
          type: 'DEBIT',
          sourceActivity: 'fraud_clawback',
          balanceAfter: 0,
          referenceId: `CLAW-${Date.now().toString().slice(-6)}`,
          notes: `Clawback of illicit coins: ${reason}`,
          timestamp: new Date().toISOString()
        })
      }
      save(STATUS_KEY, statuses)
      save(LEDGER_KEY, ledger)
    }

    // Flag all referrals by this user
    let flaggedCount = 0
    referrals.forEach((r) => {
      if (r.referrerId === userId || r.id === userId) {
        r.status = 'flagged_fraud'
        r.coinsAwarded = 0
        flaggedCount++
      }
    })
    save(REFERRALS_KEY, referrals)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BAN_REFERRAL_FRAUD_RING',
      entityId: userId,
      entityName: userName,
      collection: 'referrals',
      previousState: 'active',
      newState: 'suspended_fraud',
      reason
    })

    return { success: true, userId, flaggedCount }
  },

  batchUpdateReferralStatus: async (ids, newStatus, reason = 'Batch referral moderation', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(REFERRALS_KEY, mockReferrals)
    const idSet = new Set(ids)
    let modified = 0

    list.forEach((r) => {
      if (idSet.has(r.id)) {
        r.status = newStatus
        modified++
      }
    })

    save(REFERRALS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_REFERRAL_STATUS',
      entityId: ids.join(','),
      entityName: `${modified} referrals`,
      collection: 'referrals',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modified }
  },

  // -------------------------------------------------------------
  // 5. SERVICE RATINGS & REVIEWS (ratings)
  // -------------------------------------------------------------
  listRatings: async ({
    q = '',
    status = 'all',
    targetType = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(RATINGS_KEY, mockRatings)
    const needle = q.trim().toLowerCase()

    list = list.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (targetType !== 'all' && r.targetType !== targetType) return false
      if (!matchesDateRange(r.timestamp, dateRange)) return false
      if (!matchesPersona(r, persona)) return false
      if (!needle) return true

      return [
        r.id,
        r.targetId,
        r.targetName,
        r.targetType,
        r.farmerName,
        r.bookingId,
        r.reviewText
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  removeRating: async (id, reason = 'Defamatory review removed', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(RATINGS_KEY, mockRatings)
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Rating record #${id} not found.`)

    const removed = list[idx]
    const prevStatus = removed.status
    removed.status = 'removed'
    removed.flaggedAbusive = false
    list[idx] = removed
    save(RATINGS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'REMOVE_ABUSIVE_RATING',
      entityId: id,
      entityName: `Review on ${removed.targetName} by ${removed.farmerName}`,
      collection: 'ratings',
      previousState: prevStatus,
      newState: 'removed',
      reason
    })

    return { success: true, id }
  },

  approveRating: async (id, reason = 'Review approved after moderation', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(RATINGS_KEY, mockRatings)
    const idx = list.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Rating record #${id} not found.`)

    const item = list[idx]
    const prev = item.status
    item.status = 'approved'
    item.flaggedAbusive = false
    list[idx] = item
    save(RATINGS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'APPROVE_SERVICE_RATING',
      entityId: id,
      entityName: `Review for ${item.targetName}`,
      collection: 'ratings',
      previousState: prev,
      newState: 'approved',
      reason
    })

    return item
  },

  batchUpdateRatingStatus: async (ids, newStatus, reason = 'Batch rating moderation', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(RATINGS_KEY, mockRatings)
    const idSet = new Set(ids)
    let modified = 0

    list.forEach((r) => {
      if (idSet.has(r.id)) {
        r.status = newStatus
        if (newStatus === 'approved') r.flaggedAbusive = false
        modified++
      }
    })

    save(RATINGS_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_RATING_STATUS',
      entityId: ids.join(','),
      entityName: `${modified} service ratings`,
      collection: 'ratings',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modified }
  },

  // -------------------------------------------------------------
  // 6. ACTIVITY EARN RATES CONFIGURATION (SOP-22 Section 3)
  // -------------------------------------------------------------
  getEarnRates: async () => {
    return getStored(EARN_RATES_KEY, defaultEarnRates)
  },

  updateEarnRates: async (newRates, reason = 'Updated platform activity earn rates', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const prev = getStored(EARN_RATES_KEY, defaultEarnRates)
    save(EARN_RATES_KEY, newRates)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_ACTIVITY_EARN_RATES',
      entityId: 'cfg_gam_earn_rates',
      entityName: 'App Activities AgriCoins Earn Rates',
      collection: 'gamification_status',
      previousState: JSON.stringify(prev),
      newState: JSON.stringify(newRates),
      reason
    })

    return newRates
  },

  // -------------------------------------------------------------
  // 7. AUDIT LOGS (audit_logs)
  // -------------------------------------------------------------
  getGamificationAuditLogs: async ({
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
  resetToDefaultSeed: async (reason = 'Restored SOP-22 benchmark seed dataset', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    localStorage.setItem(STATUS_KEY, JSON.stringify(mockGamificationStatus))
    localStorage.setItem(LEDGER_KEY, JSON.stringify(mockAgriCoinsLedger))
    localStorage.setItem(COUPONS_KEY, JSON.stringify(mockRewardCoupons))
    localStorage.setItem(REFERRALS_KEY, JSON.stringify(mockReferrals))
    localStorage.setItem(RATINGS_KEY, JSON.stringify(mockRatings))
    localStorage.setItem(EARN_RATES_KEY, JSON.stringify(defaultEarnRates))

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'RESET_SEED_DATA',
      entityId: 'all_collections',
      entityName: 'Module 22 Gamification & Economy',
      collection: 'gamification_status',
      previousState: 'mutated',
      newState: 'benchmark_default',
      reason
    })

    return { success: true }
  }
}
