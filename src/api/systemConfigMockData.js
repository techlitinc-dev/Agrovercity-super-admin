/**
 * AGROVERCITY SUPERADMIN — Module 26: System Health, Remote Config, Broadcast & Moderation
 * Document ID: SOP-26
 * Target Collections: app_config, broadcasts, user_reports, user_blocks, user_consents, audit_logs
 */

export const mockAppConfig = {
  latestVersion: '2.6.2',
  minSupportedVersion: '2.4.0',
  forceUpdateEnabled: true,
  maintenanceMode: false,
  maintenanceMessage: 'Platform under routine scheduled maintenance. Mandi trading and escrow will resume at 06:00 AM IST.',
  featureFlags: {
    droneSprayBookingLive: true,
    kccUnderwritingEngineV2: true,
    carbonCreditsDeskEnabled: true,
    coldStorageCaTelemetryLive: true,
    womenShgStorefrontMarketplace: true,
    voiceAssistantGeminiEnabled: true,
    offlineFirstSyncPwa: true,
    apmcDirectAuctionBidding: false // In pilot testing
  },
  regionalOverrides: {
    solapur: { waterQuotaEmergencyAlerts: true },
    nashik: { grapeExportApedaGateway: true },
    vidarbha: { droughtReliefPmfbyFastrack: true }
  },
  lastUpdatedBy: 'superadmin@agrovercity.org',
  lastUpdatedAt: '2026-09-18T10:00:00Z'
}

export const mockSystemHealth = {
  apiGatewayLatencyMs: 18,
  apiGatewayStatus: 'healthy',
  redisCacheHitRatePct: 98.4,
  redisMemoryUsageMb: 242,
  databaseConnectionsActive: 14,
  databaseConnectionsMax: 50,
  firebaseAuthLatencyMs: 42,
  sentryErrorRatePct: 0.02,
  activeWebsocketsCount: 1420,
  lastHealthCheckAt: '2026-09-21T07:50:00Z'
}

export const mockBroadcasts = [
  {
    id: 'bc_fcm_101',
    title: '⚠️ Unseasonal Hailstorm Alert: Marathwada & Solapur',
    body: 'IMD radar indicates severe squall and hail within 3 hours across Solapur and Osmanabad. Move harvested onion lots to shaded packhouses immediately.',
    urgency: 'critical_weather',
    targetPersona: 'farmers',
    targetDistrict: 'Solapur',
    targetState: 'Maharashtra',
    status: 'sent',
    recipientCount: 8420,
    deliveredCount: 8190,
    clickRatePct: 44.2,
    fcmMessageId: 'projects/agrovercity/messages/bc-sol-hail-991',
    sentAt: '2026-09-20T14:30:00Z',
    sentBy: 'superadmin@agrovercity.org'
  },
  {
    id: 'bc_fcm_102',
    title: '📢 PMFBY Kharif 72-Hour Calamity Claims Window Open',
    body: 'Farmers affected by heavy precipitation can file geo-tagged crop damage reports on the Agrovercity Insurance desk before Sep 24.',
    urgency: 'high',
    targetPersona: 'all',
    targetDistrict: 'all',
    targetState: 'Maharashtra',
    status: 'sent',
    recipientCount: 45200,
    deliveredCount: 44100,
    clickRatePct: 31.8,
    fcmMessageId: 'projects/agrovercity/messages/bc-pmfby-claim-882',
    sentAt: '2026-09-19T09:00:00Z',
    sentBy: 'superadmin@agrovercity.org'
  },
  {
    id: 'bc_fcm_103',
    title: '🚛 Transporter Incentive: Nashik to Mumbai Fruit Corridor',
    body: '₹1,500 direct fuel cashback on all 10-Ton+ refrigerated grape and pomegranate transports completed this weekend.',
    urgency: 'normal',
    targetPersona: 'transporters',
    targetDistrict: 'Nashik',
    targetState: 'Maharashtra',
    status: 'sent',
    recipientCount: 680,
    deliveredCount: 672,
    clickRatePct: 52.4,
    fcmMessageId: 'projects/agrovercity/messages/bc-tr-incentive-441',
    sentAt: '2026-09-18T16:00:00Z',
    sentBy: 'superadmin@agrovercity.org'
  },
  {
    id: 'bc_fcm_104',
    title: '🌸 Mahila Kisan SHG Mission Shakti Subvention Credit',
    body: 'Interest subvention subsidies (4% net reduction) credited to verified Bachat Gat accounts. Check SHG savings ledger for bank UTR.',
    urgency: 'normal',
    targetPersona: 'women_shg',
    targetDistrict: 'all',
    targetState: 'Maharashtra',
    status: 'sent',
    recipientCount: 1240,
    deliveredCount: 1210,
    clickRatePct: 68.5,
    fcmMessageId: 'projects/agrovercity/messages/bc-shg-subvention-109',
    sentAt: '2026-09-17T11:30:00Z',
    sentBy: 'superadmin@agrovercity.org'
  },
  {
    id: 'bc_fcm_105',
    title: '📈 Mandi Onion Rate Surge Alert: Lasalgaon APMC',
    body: 'Grade A Red Onion prices crossed ₹3,200/Qtl today at Lasalgaon. Direct buyer contracts available on Agrovercity B2B Produce Lots.',
    urgency: 'normal',
    targetPersona: 'farmers',
    targetDistrict: 'Nashik',
    targetState: 'Maharashtra',
    status: 'sent',
    recipientCount: 11200,
    deliveredCount: 10950,
    clickRatePct: 38.0,
    fcmMessageId: 'projects/agrovercity/messages/bc-onion-mandi-902',
    sentAt: '2026-09-16T13:00:00Z',
    sentBy: 'superadmin@agrovercity.org'
  }
]

export const mockUserReports = [
  {
    id: 'rep_ugc_01',
    reportedUserId: 'usr_fm_9921',
    reportedUserName: 'Ganesh Haribhau Wagh',
    reportedUserPhone: '+91 91XXX XX741',
    reportedUserPersona: 'produce_seller',
    reporterId: 'usr_by_1042',
    reporterName: 'Reliance Retail Agri Procurement',
    category: 'fake_produce_lot',
    evidenceDescription: 'Seller listed 500 Quintal export quality pomegranate with forged APEDA certificate; lot inspection revealed sub-standard cracked fruit.',
    evidenceUrls: ['https://images.unsplash.com/photo-1541344999736-83eca872f241?w=400'],
    status: 'pending', // 'pending', 'investigating', 'resolved_warning', 'resolved_banned', 'dismissed'
    severity: 'high',
    assignedAdmin: 'superadmin@agrovercity.org',
    resolutionNotes: null,
    createdAt: '2026-09-20T11:20:00Z',
    updatedAt: '2026-09-20T11:20:00Z'
  },
  {
    id: 'rep_ugc_02',
    reportedUserId: 'usr_tr_8819',
    reportedUserName: 'Babanrao Shankar Gorde (Fleet Operator)',
    reportedUserPhone: '+91 98XXX XX302',
    reportedUserPersona: 'transporter',
    reporterId: 'usr_fm_201',
    reporterName: 'Balasaheb Patwardhan',
    category: 'scam_fraud',
    evidenceDescription: 'Transporter demanded ₹8,000 cash extortion at checkpost outside agreed platform escrow freight tariff.',
    evidenceUrls: [],
    status: 'investigating',
    severity: 'critical',
    assignedAdmin: 'superadmin@agrovercity.org',
    resolutionNotes: 'Checkpost CCTV footage under review with regional transport authority',
    createdAt: '2026-09-19T15:45:00Z',
    updatedAt: '2026-09-20T09:10:00Z'
  },
  {
    id: 'rep_ugc_03',
    reportedUserId: 'usr_eq_7712',
    reportedUserName: 'Kailas Bapurao Deshmukh (Harvester Rental)',
    reportedUserPhone: '+91 97XXX XX991',
    reportedUserPersona: 'equipment_owner',
    reporterId: 'usr_fm_312',
    reporterName: 'Sanjay Bapurao Kute',
    category: 'non_delivery',
    evidenceDescription: 'Combine harvester did not arrive on scheduled booking day; crop harvest delayed by 48 hours in rain warning.',
    evidenceUrls: [],
    status: 'resolved_warning',
    severity: 'medium',
    assignedAdmin: 'superadmin@agrovercity.org',
    resolutionNotes: 'Operator refunded slot fee; issued formal platform strike 1 warning',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-19T14:30:00Z'
  },
  {
    id: 'rep_ugc_04',
    reportedUserId: 'usr_usr_6610',
    reportedUserName: 'Unknown Spammer Syndicate',
    reportedUserPhone: '+91 90XXX XX119',
    reportedUserPersona: 'buyer',
    reporterId: 'usr_fm_534',
    reporterName: 'Eknath Namdevrao Kadam',
    category: 'abusive_language',
    evidenceDescription: 'Repeated abusive unsolicited WhatsApp spam promoting illegal unregistered seed packets.',
    evidenceUrls: [],
    status: 'resolved_banned',
    severity: 'critical',
    assignedAdmin: 'superadmin@agrovercity.org',
    resolutionNotes: 'Permanently banned user account and blacklisted phone from Agrovercity gateway',
    createdAt: '2026-09-17T09:15:00Z',
    updatedAt: '2026-09-17T12:00:00Z'
  }
]

export const mockUserBlocks = [
  {
    id: 'blk_01',
    userId: 'usr_usr_6610',
    userName: 'Unknown Spammer Syndicate',
    userPhone: '+91 90XXX XX119',
    userAadhaarMasked: 'XXXX-XXXX-8921',
    persona: 'buyer',
    district: 'Ahmednagar',
    bannedBy: 'superadmin@agrovercity.org',
    banReason: 'Promotion of counterfeit banned seed chemicals & abusive harassment in chat',
    appealStatus: 'denied',
    bannedAt: '2026-09-17T12:00:00Z'
  },
  {
    id: 'blk_02',
    userId: 'usr_fm_9901',
    userName: 'Vijay Shankar Patil (Fraud Syndicate)',
    userPhone: '+91 93XXX XX554',
    userAadhaarMasked: 'XXXX-XXXX-4412',
    persona: 'farmer',
    district: 'Solapur',
    bannedBy: 'superadmin@agrovercity.org',
    banReason: 'Simulated 14 synthetic referral signups to exhaust AgriCoins economy pool',
    appealStatus: 'ineligible',
    bannedAt: '2026-09-10T14:30:00Z'
  },
  {
    id: 'blk_03',
    userId: 'usr_tr_3390',
    userName: 'Raju Shamrao Shinde (Unlicensed Carrier)',
    userPhone: '+91 96XXX XX881',
    userAadhaarMasked: 'XXXX-XXXX-1102',
    persona: 'transporter',
    district: 'Pune',
    bannedBy: 'superadmin@agrovercity.org',
    banReason: 'Submitted forged RTO vehicle fitness and fake motor third-party insurance certificate',
    appealStatus: 'denied',
    bannedAt: '2026-08-28T16:00:00Z'
  }
]

export const mockUserConsents = [
  {
    id: 'cns_01',
    userId: 'usr_fm_201',
    userName: 'Balasaheb Patwardhan',
    userPhone: '+91 97XXX XX819',
    consentVersion: 'DPDP-2026-v2.1',
    purpose: 'KYC_Aadhaar_Vault_Verification',
    status: 'granted',
    ipAddress: '49.36.14.82',
    timestamp: '2026-09-10T08:30:00Z'
  },
  {
    id: 'cns_02',
    userId: 'usr_tr_401',
    userName: 'Sahyadri Agri Freight Logistics',
    userPhone: '+91 98XXX XX412',
    consentVersion: 'DPDP-2026-v2.1',
    purpose: 'GPS_Transit_RealTime_Tracking',
    status: 'granted',
    ipAddress: '157.34.88.19',
    timestamp: '2026-09-12T10:15:00Z'
  },
  {
    id: 'cns_03',
    userId: 'usr_shg_01',
    userName: 'Sunita Shantaram Ghadge (SHG Pres)',
    userPhone: '+91 96XXX XX148',
    consentVersion: 'DPDP-2026-v2.1',
    purpose: 'NRLM_Direct_Benefit_Transfer',
    status: 'granted',
    ipAddress: '106.210.33.4',
    timestamp: '2026-09-15T14:00:00Z'
  },
  {
    id: 'cns_04',
    userId: 'usr_by_1042',
    userName: 'Reliance Retail Agri Procurement',
    userPhone: '+91 92XXX XX330',
    consentVersion: 'DPDP-2026-v2.1',
    purpose: 'B2B_Escrow_GST_EInvoicing',
    status: 'granted',
    ipAddress: '115.112.44.8',
    timestamp: '2026-09-16T11:45:00Z'
  },
  {
    id: 'cns_05',
    userId: 'usr_fm_512',
    userName: 'Kisanrao Madhavrao Deshmukh',
    userPhone: '+91 94XXX XX332',
    consentVersion: 'DPDP-2026-v2.1',
    purpose: 'Satellite_NDVI_Carbon_Verification',
    status: 'granted',
    ipAddress: '49.36.20.91',
    timestamp: '2026-09-18T09:20:00Z'
  }
]

export const mockSystemConfigAuditLogs = [
  {
    id: 'aud_cfg_101',
    adminUid: 'usr_admin_root',
    adminName: 'Super Admin',
    timestamp: '2026-09-20T14:30:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'DISPATCH_FCM_BROADCAST',
    entityId: 'bc_fcm_101',
    entityName: 'Unseasonal Hailstorm Alert (Solapur)',
    collection: 'broadcasts',
    previousState: 'status: draft',
    newState: 'status: sent (8,420 recipients)',
    reason: 'Emergency IMD radar warning broadcast dispatched to vulnerable fruit orchards'
  },
  {
    id: 'aud_cfg_102',
    adminUid: 'usr_admin_root',
    adminName: 'Super Admin',
    timestamp: '2026-09-18T10:00:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'UPDATE_REMOTE_CONFIG',
    entityId: 'app_config',
    entityName: 'Mobile App Version Gate',
    collection: 'app_config',
    previousState: 'minSupportedVersion: 2.3.5',
    newState: 'minSupportedVersion: 2.4.0 (Force update enabled)',
    reason: 'Enforced security patch for DPDP consent storage and RazorpayX penny drop'
  },
  {
    id: 'aud_cfg_103',
    adminUid: 'usr_admin_root',
    adminName: 'Super Admin',
    timestamp: '2026-09-17T12:00:00Z',
    ipAddress: '10.0.4.15',
    actionType: 'BAN_ABUSIVE_USER',
    entityId: 'usr_usr_6610',
    entityName: 'Unknown Spammer Syndicate',
    collection: 'user_blocks',
    previousState: 'status: active',
    newState: 'status: permanently_banned',
    reason: 'Blacklisted abusive spam syndicate following user reports resolution'
  }
]

export const mockExpertTickets = [
  {
    id: 'tkt_exp_101',
    ticketNumber: 'EXP-202609-081',
    farmerId: 'usr_fm_512',
    farmerName: 'Kisanrao Madhavrao Deshmukh',
    farmerPhone: '+91 94XXX XX332',
    district: 'Solapur',
    crop: 'Onion (Bhima Super)',
    issueCategory: 'Pest & Fungal Infestation',
    title: 'Purple blotch fungal infection spreading rapidly across 4 acres post unseasonal rainfall',
    description: 'Noticed small, water-soaked lesions on leaves which rapidly turned brown-purple with concentric rings. Approximately 35% foliage showing yellowing and tip necrosis. Humidity has remained above 85% for the last 48 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400',
    status: 'open', // 'open', 'in_progress', 'resolved', 'escalated'
    priority: 'urgent',
    assignedAgronomist: 'Dr. Nilesh Gaikwad (Sr. Plant Pathologist)',
    slaRemainingHours: 2.5,
    resolutionNotes: null,
    prescribedTreatment: null,
    createdAt: '2026-09-20T08:15:00Z',
    updatedAt: '2026-09-20T08:15:00Z'
  },
  {
    id: 'tkt_exp_102',
    ticketNumber: 'EXP-202609-082',
    farmerId: 'usr_fm_201',
    farmerName: 'Balasaheb Patwardhan',
    farmerPhone: '+91 97XXX XX819',
    district: 'Nashik',
    crop: 'Table Grapes (Thomson Seedless)',
    issueCategory: 'Disease Diagnosis & Foliar Care',
    title: 'Downy mildew symptoms and berry cracking during late cluster development',
    description: 'Oil spots visible on upper leaf surfaces with white downy growth on the underside. Several bunches showing berry mummification. Need immediate systemic fungicide guidance compliant with export MRL standards.',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
    status: 'in_progress',
    priority: 'high',
    assignedAgronomist: 'Dr. Suhas Deshmukh (Viticulture Specialist)',
    slaRemainingHours: 6.0,
    resolutionNotes: 'Field agronomist dispatched for leaf tissue inspection; MRL compliant spray schedule pending formulation review.',
    prescribedTreatment: null,
    createdAt: '2026-09-19T14:30:00Z',
    updatedAt: '2026-09-20T09:00:00Z'
  },
  {
    id: 'tkt_exp_103',
    ticketNumber: 'EXP-202609-083',
    farmerId: 'usr_shg_01',
    farmerName: 'Sunita Shantaram Ghadge',
    farmerPhone: '+91 96XXX XX148',
    district: 'Ahmednagar',
    crop: 'Pomegranate (Bhagwa)',
    issueCategory: 'Bacterial Blight Management',
    title: 'Bacterial blight (Telya disease) dark oily spots observed on fruit rind',
    description: 'Oily angular lesions on foliage and typical Y-shaped cracks on fruit rinds. Requesting biocontrol and sanitization advisory for SHG community orchard.',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    status: 'resolved',
    priority: 'normal',
    assignedAgronomist: 'Dr. Archana More (Entomologist)',
    slaRemainingHours: 0,
    resolutionNotes: 'Recommended prompt pruning of infected branches followed by application of Bordeaux mixture (1%) and Copper Oxychloride with Streptocycline (50 ppm).',
    prescribedTreatment: 'Copper Oxychloride (0.25%) + Streptocycline (0.05g/L) foliar spray at 10-day intervals',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-19T16:45:00Z'
  },
  {
    id: 'tkt_exp_104',
    ticketNumber: 'EXP-202609-084',
    farmerId: 'usr_fm_534',
    farmerName: 'Eknath Namdevrao Kadam',
    farmerPhone: '+91 97XXX XX614',
    district: 'Nashik',
    crop: 'Tomato (Abhinav)',
    issueCategory: 'Viral Vector Control',
    title: 'Severe Tomato Leaf Curl Virus (ToLCV) stunting seedling growth',
    description: 'Upward curling of leaves with severe chlorosis and bushy appearance. Heavy whitefly vector population observed under canopy.',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    status: 'escalated',
    priority: 'urgent',
    assignedAgronomist: 'Head of Agronomy & Crop Protection',
    slaRemainingHours: 0,
    resolutionNotes: 'Escalated to university research station due to vector insecticide resistance in the niphad belt.',
    prescribedTreatment: 'Immediate vector containment with yellow sticky traps (15/acre) and Diafenthiuron 50% WP spray',
    createdAt: '2026-09-17T11:20:00Z',
    updatedAt: '2026-09-18T09:10:00Z'
  }
]

export const mockSystemConfigSummary = {
  totalPlatformModules: 26,
  activeServicesHealthy: 26,
  systemUptimePct: 99.98,
  minSupportedAppVersion: '2.4.0',
  latestAppVersion: '2.6.2',
  broadcastsDeliveredThisMonth: 124800,
  pendingModerationReports: 2,
  openExpertTickets: 3,
  totalBannedUsers: 3,
  dpdpConsentCompliancePct: 100,
  activeFeatureFlagCount: 8
}
