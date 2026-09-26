// Admin Buyer Contracts & Escrow Service for AGROVERCITY Superadmin
// Implements Module 07: Buyer Contracts & Price Locks (SOP-07)
// Target Collections: buyer_contracts, contract_acceptances, institutional_buyers, escrow_ledger, audit_logs

const CONTRACTS_STORAGE_KEY = 'agrovercity_superadmin_contracts';
const ACCEPTANCES_STORAGE_KEY = 'agrovercity_superadmin_contract_acceptances';
const BUYERS_STORAGE_KEY = 'agrovercity_superadmin_institutional_buyers';
const ESCROW_STORAGE_KEY = 'agrovercity_superadmin_escrow_ledger';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

const day = (n, h = 6) => {
  const d = new Date('2026-09-22T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(h, 15, 0, 0);
  return d.toISOString();
};

const INITIAL_CONTRACTS = [
  {
    id: 'ctx_1001',
    status: 'active',
    buyerId: 'BUY-ITC-01',
    buyerName: 'ITC Limited (Agri-Business Division)',
    buyerType: 'institutional',
    farmerId: 'usr_a91f',
    farmerName: 'Ram Patil',
    farmerPhone: '+91 98220 12345',
    farmerVillage: 'Shiroli',
    farmerDistrict: 'Kolhapur',
    crop: 'Soybean',
    variety: 'JS-335 Certified',
    grade: 'Grade A (Moisture < 10%, Oil > 18%)',
    quantityQuintals: 120,
    mspBaseline: 4892,
    ratePerQuintal: 5250,
    premiumOverMspPercent: 7.3,
    escrowAmount: 630000,
    escrowReleased: 210000,
    escrowBank: 'HDFC Bank Nodal Escrow A/c 502000889123',
    acceptanceDeadline: '2026-10-05',
    deliveryDate: '2026-11-15',
    deliveryHub: 'ITC Chaupal Saagar Hub, Dindori, Nashik',
    flagged: false,
    disputeReason: null,
    createdAt: day(12),
    updatedAt: day(1)
  },
  {
    id: 'ctx_1002',
    status: 'pending_review',
    buyerId: 'BUY-REL-02',
    buyerName: 'Reliance Retail (Fresh Produce Desk)',
    buyerType: 'institutional',
    farmerId: 'usr_b773',
    farmerName: 'Suresh Jadhav',
    farmerPhone: '+91 98220 98765',
    farmerVillage: 'Niphad',
    farmerDistrict: 'Nashik',
    crop: 'Wheat',
    variety: 'Sharbati Premium C-306',
    grade: 'Grade B (Protein > 12%, Foreign Matter < 1%)',
    quantityQuintals: 200,
    mspBaseline: 2275,
    ratePerQuintal: 2450,
    premiumOverMspPercent: 7.7,
    escrowAmount: 490000,
    escrowReleased: 0,
    escrowBank: 'ICICI Bank Corporate Escrow A/c 001105992811',
    acceptanceDeadline: '2026-10-01',
    deliveryDate: '2026-12-01',
    deliveryHub: 'Reliance Fresh Distribution Center, Bhiwandi',
    flagged: false,
    disputeReason: null,
    createdAt: day(3),
    updatedAt: day(2)
  },
  {
    id: 'ctx_1003',
    status: 'disputed',
    buyerId: 'BUY-ADA-03',
    buyerName: 'Adani Agri Logistics Ltd.',
    buyerType: 'institutional',
    farmerId: 'usr_c410',
    farmerName: 'Mahadev Shinde',
    farmerPhone: '+91 98220 55588',
    farmerVillage: 'Miraj',
    farmerDistrict: 'Sangli',
    crop: 'Cotton',
    variety: 'RCH-659 Hybrid Extra Long Staple',
    grade: 'Grade A (Staple 31mm, Moisture < 9%)',
    quantityQuintals: 85,
    mspBaseline: 6620,
    ratePerQuintal: 7100,
    premiumOverMspPercent: 7.2,
    escrowAmount: 603500,
    escrowReleased: 0,
    escrowBank: 'State Bank of India Escrow A/c 39912044819',
    acceptanceDeadline: '2026-09-25',
    deliveryDate: '2026-10-30',
    deliveryHub: 'Adani Agri Logistics Mega Silo Hub, Paithan',
    flagged: true,
    disputeReason: 'Quality rejection — Buyer inspection notes moisture level at 13.8% vs max 9% contract limit. Farmer claims rain exposure in transit.',
    disputeFiledAt: day(2),
    createdAt: day(8),
    updatedAt: day(0, 4)
  },
  {
    id: 'ctx_1004',
    status: 'published',
    buyerId: 'BUY-ITC-01',
    buyerName: 'ITC Limited (Agri-Business Division)',
    buyerType: 'institutional',
    farmerId: 'usr_d205',
    farmerName: 'Vitthal Kale',
    farmerPhone: '+91 98220 77733',
    farmerVillage: 'Rahuri',
    farmerDistrict: 'Ahmednagar',
    crop: 'Onion',
    variety: 'Nashik Red Garwa',
    grade: 'Grade A (Size 55mm+, Double Skin, Moisture < 14%)',
    quantityQuintals: 300,
    mspBaseline: 1550,
    ratePerQuintal: 1850,
    premiumOverMspPercent: 19.3,
    escrowAmount: 555000,
    escrowReleased: 0,
    escrowBank: 'HDFC Bank Nodal Escrow A/c 502000889123',
    acceptanceDeadline: '2026-09-28',
    deliveryDate: '2026-11-20',
    deliveryHub: 'ITC Export Packhouse, Lasalgaon',
    flagged: false,
    disputeReason: null,
    createdAt: day(2),
    updatedAt: day(1)
  },
  {
    id: 'ctx_1005',
    status: 'fulfilled',
    buyerId: 'BUY-REL-02',
    buyerName: 'Reliance Retail (Fresh Produce Desk)',
    buyerType: 'institutional',
    farmerId: 'usr_e881',
    farmerName: 'Gopal Deshmukh',
    farmerPhone: '+91 98220 31122',
    farmerVillage: 'Indapur',
    farmerDistrict: 'Pune',
    crop: 'Maize',
    variety: 'Bio-9681 Hybrid Yellow',
    grade: 'Grade B (Aflatoxin < 20ppb, Moisture < 12%)',
    quantityQuintals: 150,
    mspBaseline: 2090,
    ratePerQuintal: 2100,
    premiumOverMspPercent: 0.5,
    escrowAmount: 315000,
    escrowReleased: 315000,
    escrowBank: 'ICICI Bank Corporate Escrow A/c 001105992811',
    acceptanceDeadline: '2026-08-15',
    deliveryDate: '2026-09-05',
    deliveryHub: 'Reliance Feed Silo Hub, Baramati',
    flagged: false,
    disputeReason: null,
    createdAt: day(35),
    updatedAt: day(6)
  },
  {
    id: 'ctx_1006',
    status: 'breached',
    buyerId: 'BUY-ADA-03',
    buyerName: 'Adani Agri Logistics Ltd.',
    buyerType: 'institutional',
    farmerId: 'usr_f119',
    farmerName: 'Shanta Bai Pawar',
    farmerPhone: '+91 98220 99001',
    farmerVillage: 'Chopda',
    farmerDistrict: 'Jalgaon',
    crop: 'Tur',
    variety: 'BDN-711 White Tur',
    grade: 'Grade A (Foreign Matter < 1%, Moisture < 10%)',
    quantityQuintals: 60,
    mspBaseline: 7000,
    ratePerQuintal: 8300,
    premiumOverMspPercent: 18.5,
    escrowAmount: 498000,
    escrowReleased: 0,
    escrowBank: 'State Bank of India Escrow A/c 39912044819',
    acceptanceDeadline: '2026-08-30',
    deliveryDate: '2026-09-18',
    deliveryHub: 'Adani Agri Cold Storage Hub, Akola',
    flagged: true,
    disputeReason: 'Milestone Delivery Default — Contract expired with zero truck dispatch confirmed by APMC gate pass.',
    createdAt: day(40),
    updatedAt: day(4)
  },
  {
    id: 'ctx_1007',
    status: 'draft',
    buyerId: 'BUY-CAR-04',
    buyerName: 'Cargill India Pvt. Ltd.',
    buyerType: 'institutional',
    farmerId: 'usr_g552',
    farmerName: 'Nitin More',
    farmerPhone: '+91 98220 24680',
    farmerVillage: 'Pusad',
    farmerDistrict: 'Yavatmal',
    crop: 'Gram',
    variety: 'Vijay Desi Chana',
    grade: 'Grade A (Moisture < 9.5%, Bold Grain)',
    quantityQuintals: 90,
    mspBaseline: 5440,
    ratePerQuintal: 5600,
    premiumOverMspPercent: 2.9,
    escrowAmount: 504000,
    escrowReleased: 0,
    escrowBank: 'Citibank N.A. Institutional Escrow A/c 982104921',
    acceptanceDeadline: '2026-10-10',
    deliveryDate: '2026-12-15',
    deliveryHub: 'Cargill Processing Depot, Kurkumbh MIDC',
    flagged: false,
    disputeReason: null,
    createdAt: day(1),
    updatedAt: day(0, 2)
  },
  {
    id: 'ctx_1008',
    status: 'active',
    buyerId: 'BUY-REL-02',
    buyerName: 'Reliance Retail (Fresh Produce Desk)',
    buyerType: 'institutional',
    farmerId: 'usr_h937',
    farmerName: 'Kailas Wagh',
    farmerPhone: '+91 98220 61357',
    farmerVillage: 'Satara Road',
    farmerDistrict: 'Satara',
    crop: 'Groundnut',
    variety: 'TAG-24 Spanish Bold',
    grade: 'Grade B (Shelling 70%, Moisture < 8%)',
    quantityQuintals: 45,
    mspBaseline: 5850,
    ratePerQuintal: 6400,
    premiumOverMspPercent: 9.4,
    escrowAmount: 288000,
    escrowReleased: 96000,
    escrowBank: 'ICICI Bank Corporate Escrow A/c 001105992811',
    acceptanceDeadline: '2026-10-02',
    deliveryDate: '2026-11-25',
    deliveryHub: 'Reliance Agri Depot, Karad Hub',
    flagged: false,
    disputeReason: null,
    createdAt: day(9),
    updatedAt: day(0, 7)
  }
];

const INITIAL_ACCEPTANCES = [
  {
    id: 'acc_5001',
    contractId: 'ctx_1001',
    buyerName: 'ITC Limited',
    farmerId: 'usr_a91f',
    farmerName: 'Ram Patil',
    farmerPhone: '+91 98220 12345',
    farmerDistrict: 'Kolhapur',
    crop: 'Soybean',
    quantityQuintals: 120,
    committedAmount: 630000,
    ratePerQuintal: 5250,
    status: 'signed',
    signedAt: day(10),
    mpinVerified: true,
    aadhaarMasked: 'XXXX-XXXX-9122',
    deliveryMilestone: '2026-11-15',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'acc_5002',
    contractId: 'ctx_1004',
    buyerName: 'ITC Limited',
    farmerId: 'usr_d205',
    farmerName: 'Vitthal Kale',
    farmerPhone: '+91 98220 77733',
    farmerDistrict: 'Ahmednagar',
    crop: 'Onion',
    quantityQuintals: 300,
    committedAmount: 555000,
    ratePerQuintal: 1850,
    status: 'signed',
    signedAt: day(1),
    mpinVerified: true,
    aadhaarMasked: 'XXXX-XXXX-4410',
    deliveryMilestone: '2026-11-20',
    ipAddress: '117.201.88.14'
  },
  {
    id: 'acc_5003',
    contractId: 'ctx_1008',
    buyerName: 'Reliance Retail',
    farmerId: 'usr_h937',
    farmerName: 'Kailas Wagh',
    farmerPhone: '+91 98220 61357',
    farmerDistrict: 'Satara',
    crop: 'Groundnut',
    quantityQuintals: 45,
    committedAmount: 288000,
    ratePerQuintal: 6400,
    status: 'signed',
    signedAt: day(7),
    mpinVerified: true,
    aadhaarMasked: 'XXXX-XXXX-3329',
    deliveryMilestone: '2026-11-25',
    ipAddress: '49.36.192.8'
  },
  {
    id: 'acc_5004',
    contractId: 'ctx_1005',
    buyerName: 'Reliance Retail',
    farmerId: 'usr_e881',
    farmerName: 'Gopal Deshmukh',
    farmerPhone: '+91 98220 31122',
    farmerDistrict: 'Pune',
    crop: 'Maize',
    quantityQuintals: 150,
    committedAmount: 315000,
    ratePerQuintal: 2100,
    status: 'signed',
    signedAt: day(33),
    mpinVerified: true,
    aadhaarMasked: 'XXXX-XXXX-1188',
    deliveryMilestone: '2026-09-05',
    ipAddress: '103.21.144.92'
  }
];

const INITIAL_INSTITUTIONAL_BUYERS = [
  {
    id: 'BUY-ITC-01',
    companyName: 'ITC Limited (Agri-Business Division)',
    brandName: 'Aashirvaad / e-Choupal',
    cin: 'L16005WB1910PLC001985',
    gstin: '27AAACI1600K1ZV',
    nodalEscrowAccount: 'HDFC Bank (Escrow A/c: 502000889123)',
    authorizedSignatory: 'Sanjiv Puri / Vikramaditya Oberoi',
    signatoryMobile: '+91 98200 11223',
    contactEmail: 'agri.procurement@itc.in',
    creditRating: 'CRISIL AAA',
    status: 'verified',
    activeContractsCount: 2,
    totalEscrowCommitted: 1185000,
    verifiedAt: '2026-03-15T10:00:00.000Z'
  },
  {
    id: 'BUY-REL-02',
    companyName: 'Reliance Retail Limited',
    brandName: 'Reliance Fresh / SMART Bazaar',
    cin: 'U01100MH1999PLC120563',
    gstin: '27AABCR1205M1ZX',
    nodalEscrowAccount: 'ICICI Bank (Escrow A/c: 001105992811)',
    authorizedSignatory: 'Damodar Mall (CEO - Grocery)',
    signatoryMobile: '+91 98201 44556',
    contactEmail: 'farm.procure@relretail.com',
    creditRating: 'CRISIL AAA',
    status: 'verified',
    activeContractsCount: 3,
    totalEscrowCommitted: 1093000,
    verifiedAt: '2026-02-20T11:30:00.000Z'
  },
  {
    id: 'BUY-ADA-03',
    companyName: 'Adani Agri Logistics Ltd.',
    brandName: 'Adani Wilmar (Fortune)',
    cin: 'U63020GJ2005PLC046321',
    gstin: '24AAACA4632G1ZL',
    nodalEscrowAccount: 'State Bank of India (Escrow A/c: 39912044819)',
    authorizedSignatory: 'Angshu Mallick (MD & CEO)',
    signatoryMobile: '+91 98211 77889',
    contactEmail: 'agri.sourcing@adani.com',
    creditRating: 'ICRA AA+',
    status: 'verified',
    activeContractsCount: 2,
    totalEscrowCommitted: 1101500,
    verifiedAt: '2026-01-10T14:15:00.000Z'
  },
  {
    id: 'BUY-CAR-04',
    companyName: 'Cargill India Pvt. Ltd.',
    brandName: 'Nature Fresh / Gemini',
    cin: 'U15142DL1996PTC078942',
    gstin: '07AAACC7894J1ZU',
    nodalEscrowAccount: 'Citibank N.A. (Escrow A/c: 982104921)',
    authorizedSignatory: 'Simon George (President, Cargill India)',
    signatoryMobile: '+91 98100 99887',
    contactEmail: 'commodities.desk@cargill.com',
    creditRating: 'CRISIL AAA',
    status: 'verified',
    activeContractsCount: 1,
    totalEscrowCommitted: 504000,
    verifiedAt: '2026-04-05T09:45:00.000Z'
  },
  {
    id: 'BUY-PEP-05',
    companyName: 'PepsiCo India Holdings Pvt. Ltd.',
    brandName: "Lay's / Kurkure Agro-Sourcing",
    cin: 'U15549DL1993PTC053006',
    gstin: '27AAACP5300C1Z4',
    nodalEscrowAccount: 'Standard Chartered Bank (Escrow A/c: 4410298192)',
    authorizedSignatory: 'Praveen Someshwar (Agro Director)',
    signatoryMobile: '+91 98110 33445',
    contactEmail: 'potato.contract@pepsico.com',
    creditRating: 'CRISIL AAA',
    status: 'pending_audit',
    activeContractsCount: 0,
    totalEscrowCommitted: 0,
    verifiedAt: null
  }
];

const INITIAL_ESCROW_LEDGER = [
  {
    id: 'ESC-7701',
    contractId: 'ctx_1001',
    buyerName: 'ITC Limited',
    farmerName: 'Ram Patil',
    type: 'release',
    amount: 210000,
    tranche: 'Tranche 1: Pre-Sowing Seed & Fertilizer Advance (33%)',
    bankReference: 'UTR-HDFC-99128471',
    dualAdminSignOff: true,
    dualSignOffNote: 'Co-signed by root@agrovercity & suresh.finance@agrovercity.in (Rule 6.3 - Amount > ₹50,000)',
    status: 'settled',
    timestamp: day(10),
    adminUid: 'root@agrovercity'
  },
  {
    id: 'ESC-7702',
    contractId: 'ctx_1001',
    buyerName: 'ITC Limited',
    farmerName: 'Ram Patil',
    type: 'deposit',
    amount: 630000,
    tranche: 'Full 100% Contract Value Escrow Lock',
    bankReference: 'CMS-HDFC-2026-9921',
    dualAdminSignOff: false,
    dualSignOffNote: 'Corporate Escrow Inflow Confirmation',
    status: 'locked',
    timestamp: day(12),
    adminUid: 'corporate_gateway'
  },
  {
    id: 'ESC-7703',
    contractId: 'ctx_1008',
    buyerName: 'Reliance Retail',
    farmerName: 'Kailas Wagh',
    type: 'release',
    amount: 96000,
    tranche: 'Tranche 1: Sowing Input Subvention (33%)',
    bankReference: 'UTR-ICICI-88129031',
    dualAdminSignOff: true,
    dualSignOffNote: 'Co-signed by root@agrovercity & suresh.finance@agrovercity.in (Rule 6.3 - Amount > ₹50,000)',
    status: 'settled',
    timestamp: day(7),
    adminUid: 'root@agrovercity'
  },
  {
    id: 'ESC-7704',
    contractId: 'ctx_1005',
    buyerName: 'Reliance Retail',
    farmerName: 'Gopal Deshmukh',
    type: 'release',
    amount: 315000,
    tranche: 'Tranche 2: Final Delivery & Quality Acceptance Settlement (100%)',
    bankReference: 'UTR-ICICI-77192044',
    dualAdminSignOff: true,
    dualSignOffNote: 'Co-signed by root@agrovercity & deepak.audit@agrovercity.in (Rule 6.3 - Amount > ₹50,000)',
    status: 'settled',
    timestamp: day(6),
    adminUid: 'root@agrovercity'
  }
];

function getStoredContracts() {
  const data = localStorage.getItem(CONTRACTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(INITIAL_CONTRACTS));
    return INITIAL_CONTRACTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CONTRACTS;
  }
}

function saveContracts(items) {
  localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredAcceptances() {
  const data = localStorage.getItem(ACCEPTANCES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ACCEPTANCES_STORAGE_KEY, JSON.stringify(INITIAL_ACCEPTANCES));
    return INITIAL_ACCEPTANCES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ACCEPTANCES;
  }
}

function saveAcceptances(items) {
  localStorage.setItem(ACCEPTANCES_STORAGE_KEY, JSON.stringify(items));
}

function getStoredBuyers() {
  const data = localStorage.getItem(BUYERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(INITIAL_INSTITUTIONAL_BUYERS));
    return INITIAL_INSTITUTIONAL_BUYERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_INSTITUTIONAL_BUYERS;
  }
}

function saveBuyers(items) {
  localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredEscrow() {
  const data = localStorage.getItem(ESCROW_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(INITIAL_ESCROW_LEDGER));
    return INITIAL_ESCROW_LEDGER;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ESCROW_LEDGER;
  }
}

function saveEscrow(items) {
  localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(items));
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
    targetUserId: targetUserId || 'CONTRACT_SYSTEM',
    targetUserName: targetUserName || 'Buyer Contracts & Escrow Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Superadmin contract governance action (SOP-07)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminContractsService = {
  // 1. List contracts with query, status, and crop filter
  async listContracts({
    query = '',
    status = 'all',
    crop = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let contracts = getStoredContracts();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      contracts = contracts.filter((c) =>
        c.id.toLowerCase().includes(q) ||
        c.buyerName.toLowerCase().includes(q) ||
        c.farmerName.toLowerCase().includes(q) ||
        c.farmerPhone.toLowerCase().includes(q) ||
        c.crop.toLowerCase().includes(q) ||
        (c.deliveryHub && c.deliveryHub.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      contracts = contracts.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    if (crop && crop !== 'all') {
      contracts = contracts.filter((c) => c.crop.toLowerCase() === crop.toLowerCase());
    }

    const total = contracts.length;
    const startIndex = (page - 1) * limit;
    const paginated = contracts.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        contracts: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 2. Get contract details
  async getContract(id) {
    await new Promise((r) => setTimeout(r, 60));
    const contracts = getStoredContracts();
    const c = contracts.find((x) => x.id === id);
    if (!c) throw new Error(`Contract ${id} not found`);
    return { success: true, data: c };
  },

  // 3. Create Contract Draft
  async createContract(contractData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 160));
    const contracts = getStoredContracts();

    const newId = `ctx_${Math.floor(1000 + Math.random() * 9000)}`;
    const quantity = Number(contractData.quantityQuintals) || 50;
    const rate = Number(contractData.ratePerQuintal) || 3000;
    const msp = Number(contractData.mspBaseline) || rate * 0.9;
    const escrow = quantity * rate;
    const premiumPercent = msp > 0 ? parseFloat((((rate - msp) / msp) * 100).toFixed(1)) : 0;

    const newContract = {
      id: newId,
      status: 'pending_review',
      buyerId: contractData.buyerId || 'BUY-ITC-01',
      buyerName: contractData.buyerName || 'ITC Limited',
      buyerType: 'institutional',
      farmerId: contractData.farmerId || `usr_${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName: contractData.farmerName || 'Verified Institutional Farmer Pool',
      farmerPhone: contractData.farmerPhone || '+91 98220 00000',
      farmerVillage: contractData.farmerVillage || 'Baramati',
      farmerDistrict: contractData.farmerDistrict || 'Pune',
      crop: contractData.crop || 'Soybean',
      variety: contractData.variety || 'Certified Hybrid',
      grade: contractData.grade || 'Grade A',
      quantityQuintals: quantity,
      mspBaseline: msp,
      ratePerQuintal: rate,
      premiumOverMspPercent: premiumPercent,
      escrowAmount: escrow,
      escrowReleased: 0,
      escrowBank: contractData.escrowBank || 'HDFC Bank Nodal Escrow A/c 502000889123',
      acceptanceDeadline: contractData.acceptanceDeadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      deliveryDate: contractData.deliveryDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      deliveryHub: contractData.deliveryHub || 'Agrovercity Regional Fulfillment Silo Hub',
      flagged: false,
      disputeReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newContract, ...contracts];
    saveContracts(updated);

    const audit = recordAuditLog({
      adminUid,
      action: 'BUYER_CONTRACT_CREATED',
      targetUserId: newId,
      targetUserName: `${newContract.buyerName} × ${newContract.crop}`,
      previousState: 'Non-existent draft',
      newState: `Created draft contract #${newId} for ${newContract.quantityQuintals}q @ ₹${newContract.ratePerQuintal}/q (Escrow ₹${newContract.escrowAmount.toLocaleString('en-IN')})`,
      reason: 'New institutional price-lock agreement drafted for superadmin review'
    });

    return {
      success: true,
      message: `Contract ${newId} created successfully.`,
      contract: newContract,
      auditRecord: audit
    };
  },

  // 4. Publish Contract to Farmers for MPIN Acceptance
  async publishContract(contractId, adminUid = 'root@agrovercity', reason) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative reason (min 8 characters) is required.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const contracts = getStoredContracts();
    const index = contracts.findIndex((c) => c.id === contractId);
    if (index === -1) throw new Error(`Contract ${contractId} not found`);

    const c = contracts[index];
    const prevStatus = c.status;
    c.status = 'published';
    c.updatedAt = new Date().toISOString();

    contracts[index] = c;
    saveContracts(contracts);

    const audit = recordAuditLog({
      adminUid,
      action: 'BUYER_CONTRACT_PUBLISHED',
      targetUserId: contractId,
      targetUserName: `${c.buyerName} × ${c.crop}`,
      previousState: `Status: ${prevStatus}`,
      newState: 'Status: published (Active for digital MPIN signing by farmers)',
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Contract #${contractId} published. Farmers can now sign via MPIN until ${c.acceptanceDeadline}.`,
      contract: c,
      auditRecord: audit
    };
  },

  // 5. Update Contract State (active, fulfilled, disputed, breached, cancelled)
  async updateContractStatus({
    contractId,
    status,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative justification (min 8 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const contracts = getStoredContracts();
    const index = contracts.findIndex((c) => c.id === contractId);
    if (index === -1) throw new Error(`Contract ${contractId} not found`);

    const c = contracts[index];
    const prevStatus = c.status;
    c.status = status;
    c.updatedAt = new Date().toISOString();

    if (status === 'disputed') {
      c.flagged = true;
      c.disputeReason = reason.trim();
      c.disputeFiledAt = new Date().toISOString();
    } else if (status === 'breached') {
      c.flagged = true;
      c.disputeReason = reason.trim();
    } else if (status === 'fulfilled') {
      c.flagged = false;
    }

    contracts[index] = c;
    saveContracts(contracts);

    const audit = recordAuditLog({
      adminUid,
      action: 'BUYER_CONTRACT_STATUS_UPDATED',
      targetUserId: contractId,
      targetUserName: `${c.buyerName} × ${c.crop}`,
      previousState: `Status: ${prevStatus}`,
      newState: `Status: ${status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Contract #${contractId} updated from ${prevStatus} to ${status}.`,
      contract: c,
      auditRecord: audit
    };
  },

  // 6. Release Funds from Buyer Escrow to Farmer (Rule 6.3 Dual-Admin Sign-Off)
  async releaseEscrow({
    contractId,
    amount,
    reason,
    trancheNote,
    dualAdminSignOff = false,
    dualAdminUid,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Escrow payout justification (min 8 characters) is mandatory.');
    }

    const releaseAmount = Number(amount);
    if (releaseAmount <= 0) {
      throw new Error('Release amount must be greater than zero.');
    }

    if (releaseAmount > 50000 && !dualAdminSignOff) {
      throw new Error('Compliance Violation: Escrow releases exceeding ₹50,000 mandate Dual-Admin Co-Signer verification (Rule 6.3).');
    }

    await new Promise((r) => setTimeout(r, 200));
    const contracts = getStoredContracts();
    const escrowLedger = getStoredEscrow();

    const index = contracts.findIndex((c) => c.id === contractId);
    if (index === -1) throw new Error(`Contract ${contractId} not found`);

    const c = contracts[index];
    const remaining = (c.escrowAmount || 0) - (c.escrowReleased || 0);

    if (releaseAmount > remaining) {
      throw new Error(`Requested amount ₹${releaseAmount.toLocaleString('en-IN')} exceeds unreleased escrow balance ₹${remaining.toLocaleString('en-IN')}.`);
    }

    c.escrowReleased = (c.escrowReleased || 0) + releaseAmount;
    if (c.escrowReleased >= c.escrowAmount) {
      c.status = 'fulfilled';
    }
    c.updatedAt = new Date().toISOString();

    contracts[index] = c;
    saveContracts(contracts);

    // Record escrow transaction
    const newTx = {
      id: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      contractId,
      buyerName: c.buyerName,
      farmerName: c.farmerName,
      type: 'release',
      amount: releaseAmount,
      tranche: trancheNote || `Milestone Escrow Release (₹${releaseAmount.toLocaleString('en-IN')})`,
      bankReference: `UTR-${c.escrowBank?.split(' ')[0] || 'CMS'}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      dualAdminSignOff: Boolean(dualAdminSignOff),
      dualSignOffNote: dualAdminSignOff
        ? `Co-signed by ${adminUid} & ${dualAdminUid || 'suresh.finance@agrovercity.in'} (Rule 6.3 compliant)`
        : 'Single Admin standard release (≤ ₹50,000)',
      status: 'settled',
      timestamp: new Date().toISOString(),
      adminUid
    };

    saveEscrow([newTx, ...escrowLedger]);

    const audit = recordAuditLog({
      adminUid,
      action: 'ESCROW_PAYMENT_RELEASED',
      targetUserId: contractId,
      targetUserName: `${c.buyerName} → ${c.farmerName}`,
      previousState: `Escrow Released: ₹${(c.escrowReleased - releaseAmount).toLocaleString('en-IN')} of ₹${c.escrowAmount.toLocaleString('en-IN')}`,
      newState: `Escrow Released: ₹${c.escrowReleased.toLocaleString('en-IN')} (Ref: ${newTx.bankReference})`,
      reason: `${reason.trim()} ${dualAdminSignOff ? `[Co-signed by ${dualAdminUid || 'suresh.finance@agrovercity.in'}]` : ''}`
    });

    return {
      success: true,
      message: `Released ₹${releaseAmount.toLocaleString('en-IN')} from escrow to ${c.farmerName}. Bank UTR: ${newTx.bankReference}`,
      contract: c,
      escrowTx: newTx,
      auditRecord: audit
    };
  },

  // 7. Arbitrate Contract Dispute (SOP-07 §3)
  async arbitrateDispute({
    contractId,
    resolution, // 'release_to_farmer' | 'refund_buyer' | 'split_settlement' | 'penalize_buyer'
    settlementAmount,
    rationale,
    adminUid = 'root@agrovercity'
  }) {
    if (!rationale || rationale.trim().length < 12) {
      throw new Error('Detailed statutory arbitration verdict (min 12 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 220));
    const contracts = getStoredContracts();
    const index = contracts.findIndex((c) => c.id === contractId);
    if (index === -1) throw new Error(`Contract ${contractId} not found`);

    const c = contracts[index];
    const prevStatus = c.status;

    let newStatus = 'fulfilled';
    if (resolution === 'refund_buyer') {
      newStatus = 'cancelled';
    } else if (resolution === 'penalize_buyer') {
      newStatus = 'breached';
    }

    c.status = newStatus;
    c.flagged = false;
    c.arbitrationResolution = resolution;
    c.arbitrationVerdict = rationale.trim();
    c.arbitrationSettledAt = new Date().toISOString();
    c.arbitratedBy = adminUid;
    c.updatedAt = new Date().toISOString();

    contracts[index] = c;
    saveContracts(contracts);

    const audit = recordAuditLog({
      adminUid,
      action: 'CONTRACT_DISPUTE_ARBITRATED',
      targetUserId: contractId,
      targetUserName: `${c.buyerName} × ${c.farmerName}`,
      previousState: `Dispute: ${c.disputeReason || prevStatus}`,
      newState: `Arbitration Verdict: ${resolution.toUpperCase()} (State: ${newStatus})`,
      reason: rationale.trim()
    });

    return {
      success: true,
      message: `Dispute on contract #${contractId} resolved with verdict: ${resolution.replace(/_/g, ' ')}.`,
      contract: c,
      auditRecord: audit
    };
  },

  // 8. List Signed Farmer Acceptances (contract_acceptances)
  async listAcceptances({
    query = '',
    contractId = '',
    mpinVerified = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let acceptances = getStoredAcceptances();

    if (contractId) {
      acceptances = acceptances.filter((a) => a.contractId === contractId);
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      acceptances = acceptances.filter((a) =>
        a.id.toLowerCase().includes(q) ||
        a.contractId.toLowerCase().includes(q) ||
        a.farmerName.toLowerCase().includes(q) ||
        a.farmerPhone.toLowerCase().includes(q) ||
        a.crop.toLowerCase().includes(q) ||
        (a.farmerDistrict && a.farmerDistrict.toLowerCase().includes(q))
      );
    }

    if (mpinVerified !== 'all') {
      const isVerified = mpinVerified === 'verified';
      acceptances = acceptances.filter((a) => a.mpinVerified === isVerified);
    }

    const total = acceptances.length;
    const startIndex = (page - 1) * limit;
    const paginated = acceptances.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        acceptances: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 9. List Institutional Corporate Buyers
  async listInstitutionalBuyers({
    query = '',
    status = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let buyers = getStoredBuyers();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      buyers = buyers.filter((b) =>
        b.id.toLowerCase().includes(q) ||
        b.companyName.toLowerCase().includes(q) ||
        b.cin.toLowerCase().includes(q) ||
        b.gstin.toLowerCase().includes(q) ||
        b.authorizedSignatory.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      buyers = buyers.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    const total = buyers.length;
    const startIndex = (page - 1) * limit;
    const paginated = buyers.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        buyers: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 10. Onboard & Verify Institutional Corporate Buyer
  async onboardInstitutionalBuyer(buyerData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 160));
    const buyers = getStoredBuyers();

    const newId = `BUY-${buyerData.companyName?.slice(0, 3).toUpperCase() || 'COR'}-${Math.floor(10 + Math.random() * 90)}`;
    const newBuyer = {
      id: newId,
      companyName: buyerData.companyName,
      brandName: buyerData.brandName || 'Institutional Agri Desk',
      cin: buyerData.cin || `U01100MH${new Date().getFullYear()}PLC${Math.floor(100000 + Math.random() * 900000)}`,
      gstin: buyerData.gstin || `27AAAC${Math.floor(1000 + Math.random() * 9000)}K1Z${Math.floor(1 + Math.random() * 9)}`,
      nodalEscrowAccount: buyerData.nodalEscrowAccount || 'HDFC Bank Corporate Escrow Account',
      authorizedSignatory: buyerData.authorizedSignatory || 'Authorized Officer',
      signatoryMobile: buyerData.signatoryMobile || '+91 98000 00000',
      contactEmail: buyerData.contactEmail || 'procurement@corporate.com',
      creditRating: buyerData.creditRating || 'CRISIL AA',
      status: buyerData.verifyImmediately ? 'verified' : 'pending_audit',
      activeContractsCount: 0,
      totalEscrowCommitted: 0,
      verifiedAt: buyerData.verifyImmediately ? new Date().toISOString() : null
    };

    saveBuyers([newBuyer, ...buyers]);

    const audit = recordAuditLog({
      adminUid,
      action: 'INSTITUTIONAL_BUYER_ONBOARDED',
      targetUserId: newId,
      targetUserName: newBuyer.companyName,
      previousState: 'Non-existent corporate entity',
      newState: `Onboarded ${newBuyer.companyName} (CIN: ${newBuyer.cin}, Status: ${newBuyer.status})`,
      reason: 'Institutional buyer onboarded for guaranteed price-lock contracts (SOP-07)'
    });

    return {
      success: true,
      message: `Corporate buyer ${newBuyer.companyName} successfully onboarded.`,
      buyer: newBuyer,
      auditRecord: audit
    };
  },

  // 11. List Escrow Ledger Transactions
  async listEscrowLedger({
    query = '',
    type = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let ledger = getStoredEscrow();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      ledger = ledger.filter((l) =>
        l.id.toLowerCase().includes(q) ||
        l.contractId.toLowerCase().includes(q) ||
        l.buyerName.toLowerCase().includes(q) ||
        l.farmerName.toLowerCase().includes(q) ||
        l.bankReference.toLowerCase().includes(q)
      );
    }

    if (type && type !== 'all') {
      ledger = ledger.filter((l) => l.type.toLowerCase() === type.toLowerCase());
    }

    const total = ledger.length;
    const startIndex = (page - 1) * limit;
    const paginated = ledger.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        escrowLedger: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 12. List SOP-07 Audit Logs
  async listContractsAuditLogs({
    query = '',
    action = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let logs = getStoredAuditLogs();

    if (logs.length === 0) {
      logs = [
        {
          id: 'AUD-7011',
          adminUid: 'root@agrovercity',
          action: 'BUYER_CONTRACT_PUBLISHED',
          targetUserId: 'ctx_1004',
          targetUserName: 'ITC Limited × Onion (Lasalgaon)',
          previousState: 'Status: pending_review',
          newState: 'Status: published (Active for digital MPIN signing)',
          reason: 'Verified institutional escrow deposit of ₹5.55 Lakh against HDFC Bank nodal statement.',
          timestamp: '2026-09-20T11:45:00.000Z',
          ipAddress: '14.139.122.9'
        },
        {
          id: 'AUD-7012',
          adminUid: 'root@agrovercity',
          action: 'ESCROW_PAYMENT_RELEASED',
          targetUserId: 'ctx_1001',
          targetUserName: 'ITC Limited → Ram Patil',
          previousState: 'Escrow Released: ₹0 of ₹6,30,000',
          newState: 'Escrow Released: ₹2,10,000 (Ref: UTR-HDFC-99128471)',
          reason: 'Tranche 1 Pre-Sowing Input Subvention released. Co-signed by suresh.finance@agrovercity.in (Rule 6.3).',
          timestamp: '2026-09-19T16:20:00.000Z',
          ipAddress: '14.139.122.9'
        }
      ];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      logs = logs.filter((l) =>
        l.id.toLowerCase().includes(q) ||
        l.adminUid.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.targetUserId && l.targetUserId.toLowerCase().includes(q)) ||
        (l.targetUserName && l.targetUserName.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q))
      );
    }

    if (action && action !== 'all') {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        auditLogs: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 13. Compute Executive KPIs for SOP-07
  async getContractKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const contracts = getStoredContracts();
    const buyers = getStoredBuyers();
    const acceptances = getStoredAcceptances();

    const activeContracts = contracts.filter((c) => ['active', 'published'].includes(c.status));
    const pendingReview = contracts.filter((c) => ['draft', 'pending_review'].includes(c.status));
    const disputed = contracts.filter((c) => c.flagged || ['disputed', 'breached'].includes(c.status));
    const totalEscrowLocked = contracts.reduce((acc, c) => acc + (c.escrowAmount || 0), 0);
    const totalEscrowReleased = contracts.reduce((acc, c) => acc + (c.escrowReleased || 0), 0);
    const verifiedBuyersCount = buyers.filter((b) => b.status === 'verified').length;

    return {
      totalContracts: contracts.length,
      activeContractsCount: activeContracts.length,
      pendingReviewCount: pendingReview.length,
      disputedCount: disputed.length,
      totalEscrowLocked,
      totalEscrowReleased,
      verifiedBuyersCount,
      totalSignedAcceptances: acceptances.length
    };
  },

  // 14. Reset to default mock seed
  async resetToDefaultSeed() {
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(INITIAL_CONTRACTS));
    localStorage.setItem(ACCEPTANCES_STORAGE_KEY, JSON.stringify(INITIAL_ACCEPTANCES));
    localStorage.setItem(BUYERS_STORAGE_KEY, JSON.stringify(INITIAL_INSTITUTIONAL_BUYERS));
    localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(INITIAL_ESCROW_LEDGER));
    return { success: true };
  }
};
