// Admin Landlord Land Management & Leasing Service for AGROVERCITY Superadmin
// Implements Module 10: Landlord Land Management & Leasing (SOP-10)
// Target Collections: land_plots, land_leases, land_lease_payments, land_listings, lease_requests, audit_logs

import { mockLandListings, mockLandLeases, mockLeaseAgreements, mockRentReminders } from '../api/mockData';

const PLOTS_STORAGE_KEY = 'agrovercity_superadmin_land_plots';
const LISTINGS_STORAGE_KEY = 'agrovercity_superadmin_land_listings';
const LEASES_STORAGE_KEY = 'agrovercity_superadmin_land_leases';
const REQUESTS_STORAGE_KEY = 'agrovercity_superadmin_lease_requests';
const PAYMENTS_STORAGE_KEY = 'agrovercity_superadmin_land_payments';
const REMINDERS_STORAGE_KEY = 'agrovercity_superadmin_land_reminders';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

const DUAL_SIGNOFF_THRESHOLD = 50000;

export const INITIAL_LAND_PLOTS = [
  {
    id: 'PLT-101',
    surveyNo: '0712/2/34',
    khataNo: 'KH-4412',
    ownerId: 'usr_a91f',
    ownerName: 'Ram Patil',
    ownerPhone: '+919822012345',
    district: 'Nashik',
    taluka: 'Dindori',
    village: 'Mohadi',
    totalAcres: 5.5,
    soilType: 'Black Cotton',
    waterSource: 'Borewell + Drip',
    boundaries: { north: 'Survey 0712/2/33 (Nitin More)', south: 'Village Canal Road', east: 'Survey 0712/2/35', west: 'Dindori PWD Highway' },
    sevenTwelveVerified: true,
    status: 'leased',
    createdAt: '2026-05-15T09:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 'PLT-102',
    surveyNo: '0912/1/08',
    khataNo: 'KH-8821',
    ownerId: 'usr_b773',
    ownerName: 'Suresh Jadhav',
    ownerPhone: '+919822098765',
    district: 'Pune',
    taluka: 'Baramati',
    village: 'Malegaon Khurd',
    totalAcres: 12.0,
    soilType: 'Medium Black',
    waterSource: 'Nira Left Bank Canal',
    boundaries: { north: 'Canal Distributary 4', south: 'Survey 0912/1/09', east: 'Village Boundary', west: 'Sugar Mill Access Road' },
    sevenTwelveVerified: false,
    status: 'under_verification',
    createdAt: '2026-08-10T11:30:00.000Z',
    updatedAt: '2026-09-18T14:20:00.000Z'
  },
  {
    id: 'PLT-103',
    surveyNo: '0451/3/19',
    khataNo: 'KH-1904',
    ownerId: 'usr_c410',
    ownerName: 'Mahadev Shinde',
    ownerPhone: '+919822055588',
    district: 'Nashik',
    taluka: 'Sinnar',
    village: 'Panchale',
    totalAcres: 8.2,
    soilType: 'Black Cotton',
    waterSource: 'River Lift (Godavari Tributary)',
    boundaries: { north: 'River Bank', south: 'Survey 0451/3/20', east: 'Survey 0451/3/18', west: 'Sinnar Shirdi Road' },
    sevenTwelveVerified: false,
    status: 'flagged',
    createdAt: '2026-07-01T08:15:00.000Z',
    updatedAt: '2026-09-19T16:00:00.000Z'
  },
  {
    id: 'PLT-104',
    surveyNo: '1188/2/51',
    khataNo: 'KH-7732',
    ownerId: 'usr_d205',
    ownerName: 'Vitthal Kale',
    ownerPhone: '+919822077733',
    district: 'Ahmednagar',
    taluka: 'Rahuri',
    village: 'Sonai',
    totalAcres: 6.0,
    soilType: 'Light Black',
    waterSource: 'Dug Well + Electric Motor',
    boundaries: { north: 'MPKV Agri University Farm', south: 'Survey 1188/2/52', east: 'Grampanchayat Nala', west: 'Sonai Road' },
    sevenTwelveVerified: true,
    status: 'leased',
    createdAt: '2026-04-12T10:00:00.000Z',
    updatedAt: '2026-09-15T09:30:00.000Z'
  },
  {
    id: 'PLT-105',
    surveyNo: '2201/4/02',
    khataNo: 'KH-6110',
    ownerId: 'usr_e881',
    ownerName: 'Gopal Deshmukh',
    ownerPhone: '+919822031122',
    district: 'Pune',
    taluka: 'Indapur',
    village: 'Bawada',
    totalAcres: 15.0,
    soilType: 'Rain-fed Medium',
    waterSource: 'Rain-fed + Farm Pond',
    boundaries: { north: 'Survey 2201/4/01', south: 'State Highway 10', east: 'Survey 2201/4/03', west: 'Village Pasture Land' },
    sevenTwelveVerified: true,
    status: 'active',
    createdAt: '2026-06-20T14:45:00.000Z',
    updatedAt: '2026-09-21T11:00:00.000Z'
  },
  {
    id: 'PLT-106',
    surveyNo: '1671/1/12',
    khataNo: 'KH-9023',
    ownerId: 'usr_h937',
    ownerName: 'Kailas Wagh',
    ownerPhone: '+919822061357',
    district: 'Ahmednagar',
    taluka: 'Shrirampur',
    village: 'Belapur',
    totalAcres: 9.5,
    soilType: 'Deep Black',
    waterSource: 'Pravara Left Bank Canal',
    boundaries: { north: 'Railway Line', south: 'Canal Minor 2', east: 'Survey 1671/1/13', west: 'Belapur Station Road' },
    sevenTwelveVerified: true,
    status: 'leased',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-09-17T15:30:00.000Z'
  }
];

export const INITIAL_LEASE_REQUESTS = [
  {
    id: 'REQ-701',
    listingId: 'lst_2001',
    plotId: 'PLT-101',
    landlordId: 'usr_a91f',
    landlordName: 'Ram Patil',
    tenantId: 'usr_b773',
    tenantName: 'Suresh Jadhav',
    tenantPhone: '+919822098765',
    proposedDurationMonths: 24,
    proposedRentMonthly: 95000,
    proposedDeposit: 190000,
    intendedCrops: ['Soybean', 'Vegetables'],
    farmingExperienceYears: 8,
    machineryOwned: 'John Deere Tractor + Seed Drill',
    status: 'contract_drafted',
    createdAt: '2026-09-18T10:15:00.000Z',
    updatedAt: '2026-09-20T14:00:00.000Z'
  },
  {
    id: 'REQ-702',
    listingId: 'lst_2005',
    plotId: 'PLT-105',
    landlordId: 'usr_e881',
    landlordName: 'Gopal Deshmukh',
    tenantId: 'usr_t904',
    tenantName: 'Bhagwan Shinde',
    tenantPhone: '+919822044810',
    proposedDurationMonths: 36,
    proposedRentMonthly: 140000,
    proposedDeposit: 280000,
    intendedCrops: ['Sorghum', 'Chickpea'],
    farmingExperienceYears: 12,
    machineryOwned: 'Power Tiller + Irrigation Pump',
    status: 'pending_landlord',
    createdAt: '2026-09-19T09:30:00.000Z',
    updatedAt: '2026-09-19T09:30:00.000Z'
  },
  {
    id: 'REQ-703',
    listingId: 'lst_2002',
    plotId: 'PLT-102',
    landlordId: 'usr_b773',
    landlordName: 'Suresh Jadhav',
    tenantId: 'usr_t905',
    tenantName: 'Anil Salunkhe',
    tenantPhone: '+919822077192',
    proposedDurationMonths: 12,
    proposedRentMonthly: 175000,
    proposedDeposit: 350000,
    intendedCrops: ['Sugarcane (Co 86032)'],
    farmingExperienceYears: 15,
    machineryOwned: '45 HP Tractor + Drip Automation',
    status: 'under_review',
    createdAt: '2026-09-20T16:00:00.000Z',
    updatedAt: '2026-09-21T08:45:00.000Z'
  }
];

export const INITIAL_LAND_PAYMENTS = [
  {
    id: 'PMT-501',
    leaseId: 'lse_3001',
    landlordId: 'usr_d205',
    landlordName: 'Vitthal Kale',
    tenantId: 'usr_a91f',
    tenantName: 'Ram Patil',
    billingMonth: 'September 2026',
    dueDate: '2026-09-05',
    paidDate: '2026-09-04T15:20:00.000Z',
    rentAmount: 90000,
    platformFee: 900,
    landlordPayout: 89100,
    paymentMethod: 'UPI AutoPay',
    transactionId: 'TXN-AGRO-77218',
    status: 'paid',
    latePenalty: 0,
    createdAt: '2026-09-04T15:20:00.000Z'
  },
  {
    id: 'PMT-502',
    leaseId: 'lse_3002',
    landlordId: 'usr_h937',
    landlordName: 'Kailas Wagh',
    tenantId: 'usr_e881',
    tenantName: 'Gopal Deshmukh',
    billingMonth: 'September 2026',
    dueDate: '2026-09-10',
    paidDate: null,
    rentAmount: 156750,
    platformFee: 1567,
    landlordPayout: 155183,
    paymentMethod: 'NEFT Escrow',
    transactionId: 'ESC-HOLD-9014',
    status: 'overdue',
    latePenalty: 2500,
    createdAt: '2026-09-10T00:00:00.000Z'
  },
  {
    id: 'PMT-503',
    leaseId: 'lse_3003',
    landlordId: 'usr_a91f',
    landlordName: 'Ram Patil',
    tenantId: 'usr_b773',
    tenantName: 'Suresh Jadhav',
    billingMonth: 'August 2026',
    dueDate: '2026-08-01',
    paidDate: null,
    rentAmount: 121000,
    platformFee: 1210,
    landlordPayout: 119790,
    paymentMethod: 'Bank Transfer',
    transactionId: 'DISP-HOLD-4412',
    status: 'disputed',
    latePenalty: 5000,
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'PMT-504',
    leaseId: 'lse_3004',
    landlordId: 'usr_h937',
    landlordName: 'Kailas Wagh',
    tenantId: 'usr_c410',
    tenantName: 'Mahadev Shinde',
    billingMonth: 'September 2026',
    dueDate: '2026-09-15',
    paidDate: '2026-09-14T11:10:00.000Z',
    rentAmount: 142500,
    platformFee: 1425,
    landlordPayout: 141075,
    paymentMethod: 'IMPS Escrow',
    transactionId: 'TXN-AGRO-88412',
    status: 'paid',
    latePenalty: 0,
    createdAt: '2026-09-14T11:10:00.000Z'
  }
];

export const INITIAL_LAND_AUDIT_LOGS = [
  {
    id: 'AUD-1001',
    adminUid: 'root@agrovercity',
    action: 'LISTING_712_VERIFIED',
    targetUserId: 'usr_a91f',
    targetUserName: 'Ram Patil (lst_2001)',
    previousState: 'Listing status: pending_audit (7/12 unverified)',
    newState: 'Listing status: available (7/12 MahaBhulekh match S.No 0712/2/34)',
    reason: 'Verified against digital 7/12 extract via Mahabhulekh API; survey boundary and ownership match.',
    timestamp: '2026-09-18T10:30:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1002',
    adminUid: 'root@agrovercity',
    action: 'LISTING_FLAGGED_FRAUD',
    targetUserId: 'usr_c410',
    targetUserName: 'Mahadev Shinde (lst_2003)',
    previousState: 'Listing status: pending_audit',
    newState: 'Listing status: flagged (Survey ownership mismatch)',
    reason: 'Khata number registered to a different legal entity on Mahabhulekh. Flagged pending succession certificate.',
    timestamp: '2026-09-19T14:45:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1003',
    adminUid: 'root@agrovercity',
    action: 'LEASE_TERMINATION_ARBITRATED',
    targetUserId: 'usr_g552',
    targetUserName: 'Nitin More × Vitthal Kale (lse_3005)',
    previousState: 'Lease status: disputed',
    newState: 'Lease status: terminated; deposit of ₹1,80,000 refunded to tenant',
    reason: 'Farmland sold by mutual consent. Landlord produced registered sale deed and authorized full deposit release.',
    timestamp: '2026-09-15T11:20:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-1004',
    adminUid: 'root@agrovercity',
    action: 'RENT_REMINDER_CRON_TRIGGERED',
    targetUserId: 'SYSTEM_CRON',
    targetUserName: 'Automated Rent Reminder Engine',
    previousState: 'Scheduled cron for 1st of month',
    newState: 'Dispatched 8 SMS, 8 WhatsApp & 2 IVR reminder notifications across active leases',
    reason: 'Automated recurring cron trigger for monthly rent collection cycle.',
    timestamp: '2026-09-01T06:00:00.000Z',
    ipAddress: '14.139.122.9'
  }
];

function getStored(key, seed) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return seed;
  }
}

function save(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
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
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'LAND_SYSTEM',
    targetUserName: targetUserName || 'Land Leasing Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Land module administrative intervention via Superadmin Console (SOP-10)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

function paginate(items, page, limit) {
  const total = items.length;
  const startIndex = (page - 1) * limit;
  return {
    records: items.slice(startIndex, startIndex + limit),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

function matchesQuery(item, q, fields) {
  return fields.some((f) => String(item[f] || '').toLowerCase().includes(q));
}

export const adminLandService = {
  // 1. List active leases and payment compliance (GET /v1/admin/land/leases)
  async listLeases({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let leases = getStored(LEASES_STORAGE_KEY, mockLandLeases);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      leases = leases.filter((l) =>
        matchesQuery(l, q, [
          'id',
          'landlordName',
          'landlordPhone',
          'tenantName',
          'tenantPhone',
          'district',
          'surveyNo',
          'crop'
        ])
      );
    }

    if (status && status !== 'all') {
      leases = leases.filter((l) => l.status === status);
    }

    const { records, pagination } = paginate(leases, page, limit);
    return { success: true, data: { leases: records, pagination } };
  },

  // 2. List land plots (Farmland Plot Registry)
  async listPlots({ query = '', status = 'all', district = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let plots = getStored(PLOTS_STORAGE_KEY, INITIAL_LAND_PLOTS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      plots = plots.filter((p) =>
        matchesQuery(p, q, ['id', 'surveyNo', 'khataNo', 'ownerName', 'ownerPhone', 'district', 'taluka', 'village'])
      );
    }

    if (status && status !== 'all') {
      plots = plots.filter((p) => p.status === status);
    }

    if (district && district !== 'all') {
      plots = plots.filter((p) => p.district.toLowerCase() === district.toLowerCase());
    }

    const { records, pagination } = paginate(plots, page, limit);
    return { success: true, data: { plots: records, pagination } };
  },

  // 3. List land listings for lease with audit flag (GET /v1/admin/land/listings)
  async listListings({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let listings = getStored(LISTINGS_STORAGE_KEY, mockLandListings);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      listings = listings.filter((x) =>
        matchesQuery(x, q, [
          'id',
          'landlordName',
          'landlordPhone',
          'district',
          'taluka',
          'surveyNo',
          'soilType',
          'waterSource'
        ])
      );
    }

    if (status && status !== 'all') {
      listings = listings.filter((x) => x.status === status);
    }

    const { records, pagination } = paginate(listings, page, limit);
    return { success: true, data: { listings: records, pagination } };
  },

  // 4. List tenant lease requests / applications
  async listLeaseRequests({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let requests = getStored(REQUESTS_STORAGE_KEY, INITIAL_LEASE_REQUESTS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      requests = requests.filter((r) =>
        matchesQuery(r, q, ['id', 'tenantName', 'tenantPhone', 'landlordName', 'listingId', 'plotId'])
      );
    }

    if (status && status !== 'all') {
      requests = requests.filter((r) => r.status === status);
    }

    const { records, pagination } = paginate(requests, page, limit);
    return { success: true, data: { requests: records, pagination } };
  },

  // 5. List monthly rent collection ledger & escrow payments
  async listPayments({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let payments = getStored(PAYMENTS_STORAGE_KEY, INITIAL_LAND_PAYMENTS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      payments = payments.filter((p) =>
        matchesQuery(p, q, ['id', 'leaseId', 'landlordName', 'tenantName', 'billingMonth', 'transactionId'])
      );
    }

    if (status && status !== 'all') {
      payments = payments.filter((p) => p.status === status);
    }

    const { records, pagination } = paginate(payments, page, limit);
    return { success: true, data: { payments: records, pagination } };
  },

  // 6. Inspect standardized legal lease contract (GET /v1/admin/land/leases/{id}/agreement)
  async inspectAgreement(leaseId) {
    await new Promise((r) => setTimeout(r, 100));
    const agreement = mockLeaseAgreements[leaseId];
    if (agreement) return agreement;

    // Generate fallback dynamic agreement representation if missing in mock
    const leases = getStored(LEASES_STORAGE_KEY, mockLandLeases);
    const lease = leases.find((l) => l.id === leaseId);
    if (!lease) throw new Error(`Lease agreement for ${leaseId} not found`);

    return {
      id: `agr_${lease.id.replace('lse_', '')}`,
      leaseId: lease.id,
      language: 'mr',
      templateVersion: 'v2.4-MH-RERA-AGRI',
      generatedAt: lease.createdAt,
      clauses: [
        `करार कालावधी: ${lease.monthsTotal || 24} महिने (${lease.startDate} ते ${lease.endDate})`,
        `भाडे रक्कम: ₹${Number(lease.monthlyRent || 0).toLocaleString('en-IN')} प्रति महिना, दरमहा ${lease.rentDueDay || 5} तारखेस`,
        `जमीन तपशील: सर्वे नं. ${lease.surveyNo}, क्षेत्र ${lease.areaAcres} एकर, जिल्हा ${lease.district}`,
        `सुरक्षा ठेव (डिपॉझिट): ₹${Number(lease.securityDeposit || 0).toLocaleString('en-IN')} — करार समाप्तीनंतर विहित मुदतीत परतावा`,
        `पीक संमती: ${lease.crop || 'सर्व प्रकारची पिके'} — भाडेकरूस कायदेशीर वहिवाटीचे पूर्ण हक्क`,
        `वादनिवारण: वाद उद्भवल्यास ॲग्रोव्हर्सिटी सुपरॲडमिन व जिल्हा लवादाचा निर्णय उभयपक्षांवर बंधनकारक राहील.`
      ],
      signatures: [
        { party: 'landlord', name: lease.landlordName, signedAt: lease.createdAt },
        { party: 'tenant', name: lease.tenantName, signedAt: lease.createdAt }
      ]
    };
  },

  // 7. Audit listing against 7/12 land records
  async auditListing({ listingId, verified, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative justification (min 8 characters) is required for 7/12 audit compliance.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const listings = getStored(LISTINGS_STORAGE_KEY, mockLandListings);
    const index = listings.findIndex((x) => x.id === listingId);
    if (index === -1) throw new Error(`Listing ${listingId} not found`);

    const listing = listings[index];
    const prevStatus = listing.status;

    listing.sevenTwelveVerified = Boolean(verified);
    listing.status = verified ? 'available' : 'flagged';
    listing.flagged = !verified;
    if (verified) {
      delete listing.flagReason;
    } else {
      listing.flagReason = reason.trim();
    }
    listing.updatedAt = new Date().toISOString();

    listings[index] = listing;
    save(LISTINGS_STORAGE_KEY, listings);

    const audit = recordAuditLog({
      adminUid,
      action: verified ? 'LISTING_712_VERIFIED' : 'LISTING_FLAGGED_FRAUD',
      targetUserId: listing.landlordId,
      targetUserName: `${listing.landlordName} (${listing.id})`,
      previousState: `Listing ${listing.id} status: ${prevStatus}`,
      newState: `Listing ${listing.id} status: ${listing.status} (7/12: ${verified ? 'OK' : 'MISMATCH'})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: verified
        ? `Listing ${listingId} verified against 7/12 land records and made available.`
        : `Listing ${listingId} flagged as fraudulent and pulled from leasing marketplace.`,
      listing,
      auditRecord: audit
    };
  },

  // 8. Arbitrated lease contract termination & deposit resolution (PUT /v1/admin/land/leases/{id}/terminate)
  async terminateLease({
    leaseId,
    reason,
    depositResolution = 'refunded_tenant', // 'refunded_tenant' | 'forfeited' | 'split'
    splitAmount = 0,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory arbitration reasoning (min 8 characters) is required to terminate lease.');
    }

    await new Promise((r) => setTimeout(r, 180));
    const leases = getStored(LEASES_STORAGE_KEY, mockLandLeases);
    const index = leases.findIndex((x) => x.id === leaseId);
    if (index === -1) throw new Error(`Lease ${leaseId} not found`);

    const lease = leases[index];
    if (lease.status === 'terminated') throw new Error(`Lease ${leaseId} is already terminated.`);

    const deposit = lease.securityDeposit || 0;
    const isHighValue = deposit > DUAL_SIGNOFF_THRESHOLD;

    // Rule 3: Dual-Admin sign-off for deposit forfeitures / refunds > ₹50,000
    if (isHighValue && depositResolution !== 'split_preapproved') {
      const existingSignOffs = lease.signOffs || [];
      const signOffs = [
        ...existingSignOffs.filter((s) => s.adminUid !== adminUid),
        { adminUid, signedAt: new Date().toISOString() }
      ];
      lease.signOffs = signOffs;

      if (signOffs.length < 2) {
        lease.status = 'disputed';
        lease.updatedAt = new Date().toISOString();
        leases[index] = lease;
        save(LEASES_STORAGE_KEY, leases);

        const audit = recordAuditLog({
          adminUid,
          action: 'SECURITY_DEPOSIT_FIRST_SIGN_OFF',
          targetUserId: lease.tenantId,
          targetUserName: `${lease.tenantName} × ${lease.landlordName} (${lease.id})`,
          previousState: `Lease ${lease.id} status: ${lease.status}`,
          newState: `Termination proposed with deposit action: ${depositResolution} (₹${deposit.toLocaleString('en-IN')}); dual sign-off pending (1/2)`,
          reason: reason.trim()
        });

        return {
          success: true,
          requiresSecondSignOff: true,
          message: `Deposit resolution of ₹${deposit.toLocaleString('en-IN')} exceeds ₹50,000. Second superadmin sign-off required (1/2 recorded).`,
          lease,
          auditRecord: audit
        };
      }
    }

    const prevStatus = lease.status;
    lease.status = 'terminated';
    lease.disputeReason = reason.trim();
    lease.depositResolution = depositResolution;
    lease.splitAmount = splitAmount;
    lease.terminatedAt = new Date().toISOString();
    lease.updatedAt = new Date().toISOString();

    leases[index] = lease;
    save(LEASES_STORAGE_KEY, leases);

    const audit = recordAuditLog({
      adminUid,
      action: 'LEASE_TERMINATION_ARBITRATED',
      targetUserId: lease.tenantId,
      targetUserName: `${lease.tenantName} × ${lease.landlordName} (${lease.id})`,
      previousState: `Lease ${lease.id} status: ${prevStatus}`,
      newState: `Lease ${lease.id} status: terminated; deposit action: ${depositResolution} (₹${deposit.toLocaleString('en-IN')})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Lease ${leaseId} arbitrated and terminated. Security deposit action: ${depositResolution}.`,
      lease,
      auditRecord: audit
    };
  },

  // 9. Register new farmland plot & listing
  async registerPlot(plotData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 140));
    const plots = getStored(PLOTS_STORAGE_KEY, INITIAL_LAND_PLOTS);
    const newPlotId = `PLT-${Date.now().toString().slice(-4)}`;

    const newPlot = {
      id: newPlotId,
      surveyNo: plotData.surveyNo?.trim() || '0000/1/00',
      khataNo: plotData.khataNo?.trim() || `KH-${Math.floor(1000 + Math.random() * 9000)}`,
      ownerId: plotData.ownerId || `usr_${Date.now().toString().slice(-4)}`,
      ownerName: plotData.ownerName?.trim() || 'Farmland Owner',
      ownerPhone: plotData.ownerPhone?.trim() || '+91 98000 00000',
      district: plotData.district?.trim() || 'Nashik',
      taluka: plotData.taluka?.trim() || 'Dindori',
      village: plotData.village?.trim() || 'Main Village',
      totalAcres: Number(plotData.totalAcres) || 5.0,
      soilType: plotData.soilType || 'Black Cotton',
      waterSource: plotData.waterSource || 'Borewell',
      boundaries: {
        north: plotData.boundaryNorth?.trim() || 'Road',
        south: plotData.boundarySouth?.trim() || 'Adjoining Plot',
        east: plotData.boundaryEast?.trim() || 'Canal',
        west: plotData.boundaryWest?.trim() || 'Farm Boundary'
      },
      sevenTwelveVerified: Boolean(plotData.immediateVerified),
      status: plotData.immediateVerified ? 'active' : 'under_verification',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    save(PLOTS_STORAGE_KEY, [newPlot, ...plots]);

    // If createListing toggle is on, also create listing
    if (plotData.createListing) {
      const listings = getStored(LISTINGS_STORAGE_KEY, mockLandListings);
      const newListing = {
        id: `lst_${Date.now().toString().slice(-4)}`,
        status: plotData.immediateVerified ? 'available' : 'pending_audit',
        landlordId: newPlot.ownerId,
        landlordName: newPlot.ownerName,
        landlordPhone: newPlot.ownerPhone,
        district: newPlot.district,
        taluka: newPlot.taluka,
        surveyNo: newPlot.surveyNo,
        areaAcres: newPlot.totalAcres,
        expectedRentPerAcre: Number(plotData.expectedRentPerAcre) || 20000,
        cropSuitability: plotData.cropSuitability || ['Soybean', 'Wheat'],
        soilType: newPlot.soilType,
        waterSource: newPlot.waterSource,
        sevenTwelveVerified: newPlot.sevenTwelveVerified,
        flagged: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      save(LISTINGS_STORAGE_KEY, [newListing, ...listings]);
    }

    const audit = recordAuditLog({
      adminUid,
      action: 'PLOT_REGISTERED',
      targetUserId: newPlot.ownerId,
      targetUserName: `${newPlot.ownerName} (${newPlot.surveyNo})`,
      previousState: 'Non-existent farmland plot entry',
      newState: `Added plot ${newPlot.id} [${newPlot.totalAcres} acres in ${newPlot.taluka}, ${newPlot.district}]`,
      reason: 'Plot registered into land leasing repository via Superadmin Console (SOP-10)'
    });

    return {
      success: true,
      message: `Farmland Plot ${newPlot.surveyNo} (${newPlot.id}) registered successfully.`,
      plot: newPlot,
      auditRecord: audit
    };
  },

  // 10. List reminder receipts & trigger monthly rent reminder cron
  async triggerRentReminderCron(adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 160));
    const reminders = getStored(REMINDERS_STORAGE_KEY, mockRentReminders);
    const leases = getStored(LEASES_STORAGE_KEY, mockLandLeases);
    const activeLeases = leases.filter((l) => l.status === 'active' || l.status === 'expiring');

    const newReminderBatch = activeLeases.map((l) => ({
      id: `rem_${Date.now().toString().slice(-4)}_${l.id}`,
      leaseId: l.id,
      channel: 'whatsapp',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      receiptId: `dlr_auto_${Date.now().toString().slice(-6)}`
    }));

    const audit = recordAuditLog({
      adminUid,
      action: 'RENT_REMINDER_CRON_TRIGGERED',
      targetUserId: 'ALL_ACTIVE_TENANTS',
      targetUserName: `${activeLeases.length} Active Farmland Leases`,
      previousState: 'Awaiting scheduled reminder execution',
      newState: `Dispatched ${newReminderBatch.length} automated multi-channel rent reminders`,
      reason: 'Manual rent reminder cycle triggered via Superadmin Console (SOP-10 §3)'
    });

    return {
      success: true,
      message: `Rent reminder cron triggered for ${activeLeases.length} active leases.`,
      dispatchedCount: newReminderBatch.length,
      auditRecord: audit
    };
  },

  // 11. List statutory audit logs for land module
  async listLandAuditLogs({ query = '', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let logs = getStoredAuditLogs();

    if (logs.length === 0) {
      logs = INITIAL_LAND_AUDIT_LOGS;
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }

    const landKeywords = ['LAND', 'LEASE', 'PLOT', 'LISTING', '712', 'RENT', 'DEPOSIT', 'ARBITRAT'];
    let filtered = logs.filter((log) =>
      landKeywords.some((kw) => (log.action || '').toUpperCase().includes(kw))
    );

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((log) =>
        (log.id && log.id.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.targetUserName && log.targetUserName.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q)) ||
        (log.adminUid && log.adminUid.toLowerCase().includes(q))
      );
    }

    const { records, pagination } = paginate(filtered, page, limit);
    return { success: true, data: { auditLogs: records, pagination } };
  },

  // 12. Compute module KPIs
  async getLandKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const leases = getStored(LEASES_STORAGE_KEY, mockLandLeases);
    const listings = getStored(LISTINGS_STORAGE_KEY, mockLandListings);
    const plots = getStored(PLOTS_STORAGE_KEY, INITIAL_LAND_PLOTS);
    const payments = getStored(PAYMENTS_STORAGE_KEY, INITIAL_LAND_PAYMENTS);

    const activeLeases = leases.filter((l) => l.status === 'active');
    const disputedLeases = leases.filter((l) => l.status === 'disputed');
    const pendingListings = listings.filter((x) => x.status === 'pending_audit');
    const flaggedListings = listings.filter((x) => x.flagged || !x.sevenTwelveVerified);
    const overduePayments = payments.filter((p) => p.status === 'overdue' || p.status === 'disputed');

    const totalLeasedAcreage = activeLeases.reduce((acc, l) => acc + (l.areaAcres || 0), 0);
    const monthlyEscrowVolume = activeLeases.reduce((acc, l) => acc + (l.monthlyRent || 0), 0);
    const depositVolume = activeLeases.reduce((acc, l) => acc + (l.securityDeposit || 0), 0);

    return {
      activeLeasesCount: activeLeases.length,
      totalLeasesCount: leases.length,
      disputedLeasesCount: disputedLeases.length,
      availableListingsCount: listings.filter((x) => x.status === 'available').length,
      pendingAuditCount: pendingListings.length,
      flaggedCount: flaggedListings.length,
      totalPlotsCount: plots.length,
      overduePaymentsCount: overduePayments.length,
      totalLeasedAcreage,
      monthlyEscrowVolume,
      depositVolume
    };
  },

  // 13. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(PLOTS_STORAGE_KEY, JSON.stringify(INITIAL_LAND_PLOTS));
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(mockLandListings));
    localStorage.setItem(LEASES_STORAGE_KEY, JSON.stringify(mockLandLeases));
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_LEASE_REQUESTS));
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_LAND_PAYMENTS));
    return { success: true };
  }
};
