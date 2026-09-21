/**
 * AGROVERCITY SUPERADMIN — Module 22: Gamification, Krishi Ratna & Referrals
 * Document ID: SOP-22
 * Target Collections: gamification_status, agri_coins_ledger, reward_coupons, referrals, ratings
 */

export const mockGamificationStatus = [
  {
    id: 'gam_01',
    userId: 'usr_fm_1042',
    userName: 'Tukaram Ramdas Gaikwad',
    userPhone: '+91 98XXX XX312',
    district: 'Ahmednagar',
    tier: 5,
    currentTierName: 'Krishi Ratna (Tier 5)',
    xpPoints: 12450,
    currentCoinsBalance: 3850,
    lifetimeEarned: 18900,
    lifetimeSpent: 15050,
    streakDays: 48,
    unlockedBadges: ['Early Sower', 'Soil Master', 'Community Pillar', 'Drone Pioneer', 'Krishi Ratna 2026'],
    status: 'active',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2026-09-20T14:10:00Z'
  },
  {
    id: 'gam_02',
    userId: 'usr_fm_1088',
    userName: 'Sanjay Bapurao Kute',
    userPhone: '+91 94XXX XX781',
    district: 'Solapur',
    tier: 4,
    currentTierName: 'Krishi Shiromani (Tier 4)',
    xpPoints: 8900,
    currentCoinsBalance: 1920,
    lifetimeEarned: 11400,
    lifetimeSpent: 9480,
    streakDays: 22,
    unlockedBadges: ['Soil Master', 'Top Referrer', 'Organic Hero'],
    status: 'active',
    createdAt: '2025-11-12T11:30:00Z',
    updatedAt: '2026-09-19T16:20:00Z'
  },
  {
    id: 'gam_03',
    userId: 'usr_fm_1192',
    userName: 'Manohar Vishwanath Gorde',
    userPhone: '+91 97XXX XX902',
    district: 'Nashik',
    tier: 3,
    currentTierName: 'Krishi Veera (Tier 3)',
    xpPoints: 5400,
    currentCoinsBalance: 850,
    lifetimeEarned: 6200,
    lifetimeSpent: 5350,
    streakDays: 14,
    unlockedBadges: ['Early Sower', 'Pest Scout'],
    status: 'active',
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-09-18T10:45:00Z'
  },
  {
    id: 'gam_04',
    userId: 'usr_fm_1250',
    userName: 'Kavita Dnyandev Shinde',
    userPhone: '+91 98XXX XX114',
    district: 'Pune',
    tier: 2,
    currentTierName: 'Krishi Sevak (Tier 2)',
    xpPoints: 2150,
    currentCoinsBalance: 420,
    lifetimeEarned: 2900,
    lifetimeSpent: 2480,
    streakDays: 7,
    unlockedBadges: ['Early Sower'],
    status: 'active',
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-09-15T09:20:00Z'
  },
  {
    id: 'gam_05',
    userId: 'usr_bot_991',
    userName: 'Fast Farm Bot Net #41',
    userPhone: '+91 91XXX XX001',
    district: 'Pune',
    tier: 1,
    currentTierName: 'Krishi Mitra (Tier 1)',
    xpPoints: 300,
    currentCoinsBalance: 1200,
    lifetimeEarned: 1200,
    lifetimeSpent: 0,
    streakDays: 1,
    unlockedBadges: [],
    status: 'suspended_fraud',
    createdAt: '2026-09-20T04:00:00Z',
    updatedAt: '2026-09-20T06:15:00Z'
  }
];

export const mockAgriCoinsLedger = [
  {
    id: 'tx_coin_101',
    userId: 'usr_fm_1042',
    userName: 'Tukaram Ramdas Gaikwad',
    amount: 100,
    type: 'CREDIT',
    sourceActivity: 'referral_bonus',
    balanceAfter: 3850,
    referenceId: 'ref_9921',
    notes: 'Referral reward credited for onboarding farmer Balasaheb Patil',
    timestamp: '2026-09-21T06:40:00Z'
  },
  {
    id: 'tx_coin_102',
    userId: 'usr_fm_1042',
    userName: 'Tukaram Ramdas Gaikwad',
    amount: -500,
    type: 'DEBIT',
    sourceActivity: 'coupon_redemption',
    balanceAfter: 3750,
    referenceId: 'coup_fert_50',
    notes: 'Redeemed ₹250 Mahadhan NPK Fertilizer discount voucher',
    timestamp: '2026-09-20T14:15:00Z'
  },
  {
    id: 'tx_coin_103',
    userId: 'usr_fm_1088',
    userName: 'Sanjay Bapurao Kute',
    amount: 50,
    type: 'CREDIT',
    sourceActivity: 'diary_entry_bonus',
    balanceAfter: 1920,
    referenceId: 'diary_ent_8841',
    notes: 'Recorded daily irrigation & diesel expense in farm ledger',
    timestamp: '2026-09-20T09:30:00Z'
  },
  {
    id: 'tx_coin_104',
    userId: 'usr_fm_1192',
    userName: 'Manohar Vishwanath Gorde',
    amount: 200,
    type: 'CREDIT',
    sourceActivity: 'soil_test_upload',
    balanceAfter: 850,
    referenceId: 'soil_doc_4412',
    notes: 'Uploaded verified NABL lab soil test report for Nashik plot',
    timestamp: '2026-09-19T11:20:00Z'
  },
  {
    id: 'tx_coin_105',
    userId: 'usr_fm_1042',
    userName: 'Tukaram Ramdas Gaikwad',
    amount: 150,
    type: 'CREDIT',
    sourceActivity: 'expert_webinar_attended',
    balanceAfter: 3900,
    referenceId: 'ws_201',
    notes: 'Completed 100% attendance in ICAR Drip Fertigation Workshop',
    timestamp: '2026-09-18T16:00:00Z'
  }
];

export const mockRewardCoupons = [
  {
    id: 'coup_01',
    code: 'MAHADHAN-250',
    title: '₹250 Off Mahadhan Smarttek NPK 10:26:26 (50kg Bag)',
    description: 'Valid at all empaneled input dealers and Agrovercity marketplace orders above ₹1,500.',
    category: 'Fertilizer Discount',
    coinPrice: 500,
    faceValueDiscountINR: 250,
    partnerMerchant: 'Deepak Fertilisers & Petrochemicals',
    stockAvailable: 284,
    totalStock: 500,
    claimedCount: 216,
    validUntil: '2026-10-31T23:59:59Z',
    status: 'active',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'coup_02',
    code: 'DRONE-SPRAY-400',
    title: '₹400 Subsidy on DGCA Certified Nano-Urea Drone Spraying',
    description: 'Flat ₹400 deduction per acre booking through Agrovercity Yantra Equipment Rental hub.',
    category: 'Drone Spraying Coupon',
    coinPrice: 750,
    faceValueDiscountINR: 400,
    partnerMerchant: 'Garuda Kisan Drone Fleet Maharashtra',
    stockAvailable: 140,
    totalStock: 300,
    claimedCount: 160,
    validUntil: '2026-11-15T23:59:59Z',
    status: 'active',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-09-18T14:00:00Z'
  },
  {
    id: 'coup_03',
    code: 'SOIL-TEST-FREE',
    title: '100% Free 14-Parameter NPK & Micronutrient Soil Health Card',
    description: 'Complimentary physical soil sample pick-up and testing by MPKV Rahuri accredited laboratory.',
    category: 'Free Soil Test',
    coinPrice: 1000,
    faceValueDiscountINR: 650,
    partnerMerchant: 'Agrovercity Soil Intelligence Labs',
    stockAvailable: 45,
    totalStock: 150,
    claimedCount: 105,
    validUntil: '2026-10-15T23:59:59Z',
    status: 'active',
    createdAt: '2026-09-01T09:00:00Z',
    updatedAt: '2026-09-19T16:00:00Z'
  },
  {
    id: 'coup_04',
    code: 'TRACTOR-RENT-300',
    title: '₹300 Off 45HP Rotavator & Plough Time-Slot Rental',
    description: 'Instant discount applied at time of booking custom hiring center machinery.',
    category: 'Tractor Rental Voucher',
    coinPrice: 600,
    faceValueDiscountINR: 300,
    partnerMerchant: 'Mahindra Krishi Yantra Rental Hubs',
    stockAvailable: 0,
    totalStock: 200,
    claimedCount: 200,
    validUntil: '2026-09-30T23:59:59Z',
    status: 'paused',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  }
];

export const mockReferrals = [
  {
    id: 'ref_01',
    referrerId: 'usr_fm_1042',
    referrerName: 'Tukaram Ramdas Gaikwad',
    refereeId: 'usr_fm_2210',
    refereeName: 'Rajendra Anandrao Mohite',
    refereePhone: '+91 98XXX XX445',
    referralCode: 'TUKARAM-412',
    coinsAwarded: 100,
    signupTimestamp: '2026-09-21T06:35:00Z',
    status: 'rewarded',
    fraudSignals: [],
    deviceFingerprint: 'DEV-SM-A54-MH8910',
    ipAddress: '103.142.18.22'
  },
  {
    id: 'ref_02',
    referrerId: 'usr_fm_1088',
    referrerName: 'Sanjay Bapurao Kute',
    refereeId: 'usr_fm_2218',
    refereeName: 'Vikas Prabhakar Deshmukh',
    refereePhone: '+91 99XXX XX882',
    referralCode: 'SANJAY-881',
    coinsAwarded: 100,
    signupTimestamp: '2026-09-20T14:10:00Z',
    status: 'rewarded',
    fraudSignals: [],
    deviceFingerprint: 'DEV-REDMI-NOTE12-441',
    ipAddress: '103.88.192.14'
  },
  {
    id: 'ref_03',
    referrerId: 'usr_bot_991',
    referrerName: 'Fast Farm Bot Net #41',
    refereeId: 'usr_bot_992',
    refereeName: 'Fake Account Auto 992',
    refereePhone: '+91 91XXX XX002',
    referralCode: 'BOT-FARM-99',
    coinsAwarded: 0,
    signupTimestamp: '2026-09-20T04:02:11Z',
    status: 'flagged_fraud',
    fraudSignals: [
      'Duplicate Device Hardware Fingerprint',
      'Rapid Multi-Signup (<2s intervals)',
      'Same /24 IP Subnet Cluster (192.241.12.8)',
      'Virtual SIM Disposable Number Pattern'
    ],
    deviceFingerprint: 'EMULATOR-NOX-4410982',
    ipAddress: '192.241.12.8'
  },
  {
    id: 'ref_04',
    referrerId: 'usr_bot_991',
    referrerName: 'Fast Farm Bot Net #41',
    refereeId: 'usr_bot_993',
    refereeName: 'Fake Account Auto 993',
    refereePhone: '+91 91XXX XX003',
    referralCode: 'BOT-FARM-99',
    coinsAwarded: 0,
    signupTimestamp: '2026-09-20T04:02:14Z',
    status: 'flagged_fraud',
    fraudSignals: [
      'Duplicate Device Hardware Fingerprint',
      'Rapid Multi-Signup (<2s intervals)',
      'Same /24 IP Subnet Cluster (192.241.12.8)'
    ],
    deviceFingerprint: 'EMULATOR-NOX-4410982',
    ipAddress: '192.241.12.8'
  }
];

export const mockRatings = [
  {
    id: 'rat_01',
    targetType: 'transporter',
    targetId: 'tr_veh_412',
    targetName: 'Eicher 17ft Canter (MH-12-RN-9941)',
    rating: 5,
    farmerId: 'usr_fm_1042',
    farmerName: 'Tukaram Ramdas Gaikwad',
    farmerPhone: '+91 98XXX XX312',
    bookingId: 'TB-2026-0918-01',
    reviewText: 'Excellent driver Ramesh. Onion bags arrived at Vashi APMC without a single torn sack. Exact on-time loading.',
    sentiment: 'positive',
    flaggedAbusive: false,
    status: 'approved',
    timestamp: '2026-09-19T08:30:00Z'
  },
  {
    id: 'rat_02',
    targetType: 'equipment',
    targetId: 'eq_rot_109',
    targetName: 'John Deere 5050D 4WD with Heavy Rotavator',
    rating: 4,
    farmerId: 'usr_fm_1088',
    farmerName: 'Sanjay Bapurao Kute',
    farmerPhone: '+91 94XXX XX781',
    bookingId: 'BK-YANTRA-9912',
    reviewText: 'Powerful engine and deep tilling. Completed 4 acres in 5.5 hours. Operator reached 30 minutes late but worked diligently.',
    sentiment: 'positive',
    flaggedAbusive: false,
    status: 'approved',
    timestamp: '2026-09-18T17:40:00Z'
  },
  {
    id: 'rat_03',
    targetType: 'vyapari',
    targetId: 'trader_881',
    targetName: 'Ganesh Agro Trading (Lasalgaon)',
    rating: 1,
    farmerId: 'usr_fake_troll',
    farmerName: 'Anonymous Troll User',
    farmerPhone: '+91 91XXX XX001',
    bookingId: 'LOT-DEAL-009',
    reviewText: 'THIS TRADER IS COMPLETE FRAUD SCAMMER NEVER DEAL VISIT MY WEBSITE WWW.FAKE-AGRO-RATES.XYZ FOR REAL PRICE',
    sentiment: 'critical',
    flaggedAbusive: true,
    status: 'flagged',
    timestamp: '2026-09-20T11:15:00Z'
  },
  {
    id: 'rat_04',
    targetType: 'agronomist',
    targetId: 'doc_agri_102',
    targetName: 'Dr. Nitin D. Jagtap (KVK Baramati)',
    rating: 5,
    farmerId: 'usr_fm_1192',
    farmerName: 'Manohar Vishwanath Gorde',
    farmerPhone: '+91 97XXX XX902',
    bookingId: 'ADV-SCAN-4412',
    reviewText: 'Immediate diagnosis of pomegranate bacterial blight. Recommended copper oxychloride + streptocycline spray saved my entire orchard.',
    sentiment: 'positive',
    flaggedAbusive: false,
    status: 'approved',
    timestamp: '2026-09-17T14:20:00Z'
  }
];

export const mockGamificationAuditLogs = [
  {
    id: 'aud_gam_01',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Super Admin)',
    timestamp: '2026-09-20T06:20:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'BAN_REFERRAL_FRAUD_RING',
    entityId: 'usr_bot_991',
    entityName: 'Fast Farm Bot Net #41',
    collection: 'referrals',
    previousState: 'active',
    newState: 'suspended_fraud',
    reason: 'Detected emulator farm with 4 rapid fake registrations from same IP subnet. Revoked all referral coins.'
  },
  {
    id: 'aud_gam_02',
    adminUid: 'usr_admin_ananya',
    adminName: 'Ananya Deshmukh (Super Admin)',
    timestamp: '2026-09-20T12:00:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'REPLENISH_COUPON_INVENTORY',
    entityId: 'coup_01',
    entityName: 'Mahadhan NPK ₹250 Voucher',
    collection: 'reward_coupons',
    previousState: 'stock_84',
    newState: 'stock_284',
    reason: 'Partner Deepak Fertilisers increased quarterly co-funded quota by 200 vouchers.'
  },
  {
    id: 'aud_gam_03',
    adminUid: 'usr_admin_rahul',
    adminName: 'Rahul Shinde (Support Operator)',
    timestamp: '2026-09-20T11:30:00Z',
    ipAddress: '10.0.4.22',
    actionType: 'FLAG_ABUSIVE_RATING',
    entityId: 'rat_03',
    entityName: 'Rating for Ganesh Agro Trading',
    collection: 'ratings',
    previousState: 'pending_moderation',
    newState: 'flagged_abusive',
    reason: 'Spam review containing external phishing URL flagged for removal.'
  }
];

export const mockGamificationSummary = {
  totalCirculatingCoins: 4829000,
  dailyMintCoins: 84500,
  dailyBurnCoins: 62100,
  activeKrishiRatnaUsers: 1840,
  activeCouponsCount: 4,
  couponsRedeemedMonth: 681,
  flaggedReferralFraudAlerts: 2,
  flaggedAbusiveRatings: 1
};
