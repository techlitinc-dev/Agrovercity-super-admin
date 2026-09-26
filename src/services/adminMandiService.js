// Admin Mandi Service for AGROVERCITY Superadmin
// Implements Module 04: Mandi Prices, Vyapari Live Rates & Approvals (SOP-04)
// Target Collections: mandi_prices, vyapari_rates, mandi_history, audit_logs

import { INITIAL_MANDI_BENCHMARKS, INITIAL_VYAPARI_RATES, INITIAL_MANDI_HISTORY } from './mockData';

const MANDI_BENCHMARKS_KEY = 'agrovercity_superadmin_mandi_benchmarks';
const VYAPARI_RATES_KEY = 'agrovercity_superadmin_vyapari_rates';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

function getStoredBenchmarks() {
  const data = localStorage.getItem(MANDI_BENCHMARKS_KEY);
  if (!data) {
    localStorage.setItem(MANDI_BENCHMARKS_KEY, JSON.stringify(INITIAL_MANDI_BENCHMARKS));
    return INITIAL_MANDI_BENCHMARKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MANDI_BENCHMARKS;
  }
}

function saveBenchmarks(items) {
  localStorage.setItem(MANDI_BENCHMARKS_KEY, JSON.stringify(items));
}

function getStoredVyapariRates() {
  const data = localStorage.getItem(VYAPARI_RATES_KEY);
  if (!data) {
    localStorage.setItem(VYAPARI_RATES_KEY, JSON.stringify(INITIAL_VYAPARI_RATES));
    return INITIAL_VYAPARI_RATES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_VYAPARI_RATES;
  }
}

function saveVyapariRates(items) {
  localStorage.setItem(VYAPARI_RATES_KEY, JSON.stringify(items));
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

function recordAuditLog({ adminUid = 'root@agrovercity', action, targetUserId, targetUserName, previousState, newState, reason }) {
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'MANDI_SYSTEM',
    targetUserName: targetUserName || 'Agmarknet / Vyapari Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Mandi rate intervention via Superadmin Console (SOP-04)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminMandiService = {
  // GET /v1/admin/rates/pending & full search
  async listVyapariRates({
    query = '',
    status = 'all',
    commodity = 'all',
    mandi = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 100));

    let rates = getStoredVyapariRates();
    const benchmarks = getStoredBenchmarks();

    // Re-verify sanity band dynamically against active benchmark
    rates = rates.map((r) => {
      const benchmark = benchmarks.find((b) => b.id === r.mandiId || (b.mandiName === r.mandiName && b.commodity === r.commodity));
      const benchModal = benchmark ? benchmark.modalPrice : r.benchmarkModalPrice || 2000;
      const deviation = parseFloat((((r.offeredRate - benchModal) / benchModal) * 100).toFixed(1));
      let sanityBandStatus = 'within_band';
      if (deviation < -15) sanityBandStatus = 'predatory_low';
      else if (deviation > 15) sanityBandStatus = 'inflated_high';

      return {
        ...r,
        benchmarkModalPrice: benchModal,
        deviationPercent: deviation,
        sanityBandStatus: r.status === 'flagged' ? 'predatory_low' : sanityBandStatus
      };
    });

    // 1. Filter by query
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      rates = rates.filter((r) => {
        const idMatch = r.id && r.id.toLowerCase().includes(q);
        const vyapariMatch = r.vyapariName && r.vyapariName.toLowerCase().includes(q);
        const firmMatch = r.tradeFirm && r.tradeFirm.toLowerCase().includes(q);
        const mandiMatch = r.mandiName && r.mandiName.toLowerCase().includes(q);
        const commMatch = r.commodity && r.commodity.toLowerCase().includes(q);
        return idMatch || vyapariMatch || firmMatch || mandiMatch || commMatch;
      });
    }

    // 2. Filter by status
    if (status && status !== 'all') {
      rates = rates.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Filter by commodity
    if (commodity && commodity !== 'all' && commodity !== 'All Commodities') {
      rates = rates.filter((r) => r.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    // 4. Filter by mandi
    if (mandi && mandi !== 'all') {
      rates = rates.filter((r) => r.mandiName.toLowerCase().includes(mandi.toLowerCase()));
    }

    const total = rates.length;
    const startIndex = (page - 1) * limit;
    const paginated = rates.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        rates: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // GET Mandi Benchmark collection (Agmarknet official feed)
  async listMandiBenchmarks({ query = '', commodity = 'all', status = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let benchmarks = getStoredBenchmarks();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      benchmarks = benchmarks.filter((b) =>
        b.mandiName.toLowerCase().includes(q) ||
        b.commodity.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q)
      );
    }

    if (commodity && commodity !== 'all' && commodity !== 'All Commodities') {
      benchmarks = benchmarks.filter((b) => b.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    if (status && status !== 'all') {
      benchmarks = benchmarks.filter((b) => b.syncStatus.toLowerCase() === status.toLowerCase());
    }

    return { success: true, data: benchmarks };
  },

  // POST /v1/admin/rates/{id}/approve
  // Approve rate update for immediate live mobile feed
  async approveRate({ id, adminUid, reason = 'Rate validated within Agmarknet sanity band' }) {
    await new Promise((r) => setTimeout(r, 160));
    const rates = getStoredVyapariRates();
    const index = rates.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Vyapari rate submission not found');

    const rate = rates[index];
    const prevStatus = rate.status;

    rate.status = 'approved';
    rate.publishedToApp = true;
    rate.reviewedAt = new Date().toISOString();
    rate.reviewedBy = adminUid || 'root@agrovercity';
    rate.rejectionReason = null;

    rates[index] = rate;
    saveVyapariRates(rates);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'MANDI_RATE_APPROVED',
      targetUserId: rate.vyapariId,
      targetUserName: rate.vyapariName,
      previousState: `${rate.commodity} rate ${prevStatus} (₹${rate.offeredRate}/Qtl)`,
      newState: `Published Live to Mobile App (₹${rate.offeredRate}/Qtl)`,
      reason
    });

    return {
      success: true,
      message: `Rate of ₹${rate.offeredRate}/Qtl for ${rate.commodity} by ${rate.vyapariName} approved and published to live mobile feed.`,
      rate,
      auditRecord: audit
    };
  },

  // POST /v1/admin/rates/{id}/reject
  // Reject rate update with explanation to trader
  async rejectRate({ id, reason, adminUid }) {
    if (!reason || !reason.trim()) {
      throw new Error('A specific rejection reason is mandatory for administrative compliance.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const rates = getStoredVyapariRates();
    const index = rates.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Vyapari rate submission not found');

    const rate = rates[index];
    const prevStatus = rate.status;

    rate.status = 'rejected';
    rate.publishedToApp = false;
    rate.reviewedAt = new Date().toISOString();
    rate.reviewedBy = adminUid || 'root@agrovercity';
    rate.rejectionReason = reason.trim();

    rates[index] = rate;
    saveVyapariRates(rates);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'MANDI_RATE_REJECTED',
      targetUserId: rate.vyapariId,
      targetUserName: rate.vyapariName,
      previousState: `${rate.commodity} rate ${prevStatus} (₹${rate.offeredRate}/Qtl)`,
      newState: `Rate Rejected (Not Published)`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Rate submission ${id} rejected. Explanation sent to ${rate.vyapariName}.`,
      rate,
      auditRecord: audit
    };
  },

  // POST /v1/admin/mandi/sync
  // Trigger manual Agmarknet sync job
  async triggerAgmarknetSync({ adminUid = 'root@agrovercity' } = {}) {
    await new Promise((r) => setTimeout(r, 450)); // simulate external API gateway latency
    const benchmarks = getStoredBenchmarks();
    const now = new Date().toISOString();

    const updated = benchmarks.map((b) => ({
      ...b,
      syncTimestamp: now,
      syncStatus: 'synced',
      latencyMs: Math.floor(120 + Math.random() * 80)
    }));

    saveBenchmarks(updated);

    const audit = recordAuditLog({
      adminUid,
      action: 'AGMARKNET_API_SYNC_TRIGGERED',
      targetUserId: 'GOV_API_ENAM',
      targetUserName: 'Central Agmarknet Gateway',
      previousState: 'Scheduled background sync',
      newState: `All ${benchmarks.length} Mandi feeds refreshed with live market arrivals`,
      reason: 'Manual synchronization requested by Superadmin'
    });

    return {
      success: true,
      message: `Successfully synchronized ${benchmarks.length} Mandi price benchmarks with Agmarknet eNAM portal.`,
      benchmarks: updated,
      auditRecord: audit
    };
  },

  // Manual rate entry / override for mandis with broken government feeds
  async overrideMandiBenchmark({ id, modalPrice, minPrice, maxPrice, arrivalTonnage, adminUid, reason }) {
    if (!reason || !reason.trim()) {
      throw new Error('Administrative justification is required for manual market price override.');
    }

    await new Promise((r) => setTimeout(r, 180));
    const benchmarks = getStoredBenchmarks();
    const index = benchmarks.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Mandi benchmark record not found');

    const b = benchmarks[index];
    const prevModal = b.modalPrice;
    const newModal = Number(modalPrice);
    const newMin = Number(minPrice) || Math.round(newModal * 0.85);
    const newMax = Number(maxPrice) || Math.round(newModal * 1.15);

    b.modalPrice = newModal;
    b.minPrice = newMin;
    b.maxPrice = newMax;
    if (arrivalTonnage) b.arrivalTonnage = Number(arrivalTonnage);
    b.syncStatus = 'manual_override';
    b.sourceApi = 'Manual Superadmin Field Override';
    b.syncTimestamp = new Date().toISOString();
    b.sanityBand = {
      lowerLimit: Math.round(newModal * 0.85),
      upperLimit: Math.round(newModal * 1.15),
      tolerancePercent: 15
    };

    benchmarks[index] = b;
    saveBenchmarks(benchmarks);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'MANDI_PRICE_MANUAL_OVERRIDE',
      targetUserId: b.id,
      targetUserName: `${b.mandiName} (${b.commodity})`,
      previousState: `Modal ₹${prevModal}/Qtl (${b.syncStatus})`,
      newState: `Modal ₹${newModal}/Qtl (Manual Override · Sanity Band: ₹${b.sanityBand.lowerLimit} - ₹${b.sanityBand.upperLimit})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Updated benchmark for ${b.mandiName} - ${b.commodity} to ₹${newModal}/Qtl.`,
      benchmark: b,
      auditRecord: audit
    };
  },

  // GET price history
  async getMandiHistory() {
    await new Promise((r) => setTimeout(r, 50));
    return INITIAL_MANDI_HISTORY;
  },

  // GET Detailed Multi-Mandi Price History & Volatility Trends (SOP-04 §1, §2)
  async listMandiDetailedHistory({ commodity = 'all', days = 7 } = {}) {
    await new Promise((r) => setTimeout(r, 120));
    
    // Generate realistic multi-day trend records for commodities
    const baseTrends = [
      {
        id: 'HIST-ONION',
        commodity: 'Onion (Nashik Red)',
        mandiName: 'Lasalgaon APMC',
        state: 'Maharashtra',
        currentModal: 2250,
        weekHigh: 2280,
        weekLow: 2150,
        pctChange7d: 4.6,
        volatility: 'Moderate (±3.8%)',
        dailyHistory: [
          { date: '14 Sep', modal: 2150, min: 1800, max: 2500, arrivalsMt: 390 },
          { date: '15 Sep', modal: 2180, min: 1820, max: 2550, arrivalsMt: 410 },
          { date: '16 Sep', modal: 2200, min: 1850, max: 2600, arrivalsMt: 430 },
          { date: '17 Sep', modal: 2220, min: 1840, max: 2620, arrivalsMt: 405 },
          { date: '18 Sep', modal: 2240, min: 1850, max: 2650, arrivalsMt: 415 },
          { date: '19 Sep', modal: 2230, min: 1830, max: 2600, arrivalsMt: 440 },
          { date: '20 Sep', modal: 2250, min: 1850, max: 2650, arrivalsMt: 420 }
        ]
      },
      {
        id: 'HIST-SOYBEAN',
        commodity: 'Soybean (Yellow)',
        mandiName: 'Pune Gultekdi APMC',
        state: 'Maharashtra',
        currentModal: 4650,
        weekHigh: 4680,
        weekLow: 4580,
        pctChange7d: 1.5,
        volatility: 'Stable (±1.2%)',
        dailyHistory: [
          { date: '14 Sep', modal: 4580, min: 4150, max: 4850, arrivalsMt: 520 },
          { date: '15 Sep', modal: 4600, min: 4180, max: 4880, arrivalsMt: 535 },
          { date: '16 Sep', modal: 4620, min: 4200, max: 4900, arrivalsMt: 540 },
          { date: '17 Sep', modal: 4630, min: 4200, max: 4900, arrivalsMt: 510 },
          { date: '18 Sep', modal: 4640, min: 4220, max: 4920, arrivalsMt: 530 },
          { date: '19 Sep', modal: 4650, min: 4200, max: 4900, arrivalsMt: 550 },
          { date: '20 Sep', modal: 4650, min: 4200, max: 4900, arrivalsMt: 540 }
        ]
      },
      {
        id: 'HIST-TURMERIC',
        commodity: 'Turmeric (Salem)',
        mandiName: 'Sangli Turmeric Mandi',
        state: 'Maharashtra',
        currentModal: 14200,
        weekHigh: 14350,
        weekLow: 13900,
        pctChange7d: 2.2,
        volatility: 'Moderate (±2.5%)',
        dailyHistory: [
          { date: '14 Sep', modal: 13900, min: 12500, max: 16200, arrivalsMt: 270 },
          { date: '15 Sep', modal: 14000, min: 12600, max: 16300, arrivalsMt: 275 },
          { date: '16 Sep', modal: 14100, min: 12700, max: 16400, arrivalsMt: 280 },
          { date: '17 Sep', modal: 14150, min: 12800, max: 16500, arrivalsMt: 290 },
          { date: '18 Sep', modal: 14200, min: 12800, max: 16500, arrivalsMt: 285 },
          { date: '19 Sep', modal: 14180, min: 12750, max: 16450, arrivalsMt: 280 },
          { date: '20 Sep', modal: 14200, min: 12800, max: 16500, arrivalsMt: 280 }
        ]
      },
      {
        id: 'HIST-SUGARCANE',
        commodity: 'Sugarcane (Co 86032)',
        mandiName: 'Kolhapur Market Yard',
        state: 'Maharashtra',
        currentModal: 3400,
        weekHigh: 3420,
        weekLow: 3380,
        pctChange7d: 0.6,
        volatility: 'Very Low (±0.8%)',
        dailyHistory: [
          { date: '14 Sep', modal: 3380, min: 3080, max: 3680, arrivalsMt: 1200 },
          { date: '15 Sep', modal: 3390, min: 3090, max: 3690, arrivalsMt: 1220 },
          { date: '16 Sep', modal: 3400, min: 3100, max: 3700, arrivalsMt: 1240 },
          { date: '17 Sep', modal: 3410, min: 3110, max: 3710, arrivalsMt: 1230 },
          { date: '18 Sep', modal: 3400, min: 3100, max: 3700, arrivalsMt: 1260 },
          { date: '19 Sep', modal: 3400, min: 3100, max: 3700, arrivalsMt: 1250 },
          { date: '20 Sep', modal: 3400, min: 3100, max: 3700, arrivalsMt: 1250 }
        ]
      }
    ];

    if (commodity && commodity !== 'all' && commodity !== 'All Commodities') {
      return baseTrends.filter((item) => item.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    return baseTrends;
  },

  // Calculate Net-Profit Mandi Comparison across Mandis vs Vyapari Direct Farmgate (SOP-04 §1)
  async calculateNetMandiComparison({
    commodity = 'Onion (Nashik Red)',
    quantityQtl = 100,
    farmerDistrict = 'Nashik'
  } = {}) {
    await new Promise((r) => setTimeout(r, 100));

    const qty = Number(quantityQtl) || 100;

    // Simulation models per destination
    const options = [
      {
        id: 'DEST-01',
        type: 'APMC_MANDI',
        name: 'Lasalgaon APMC',
        location: 'Nashik, MH',
        distanceKm: 28,
        grossRatePerQtl: 2250,
        grossRevenue: 2250 * qty,
        freightRatePerQtl: 110,
        freightTotal: 110 * qty,
        mandiCessPercent: 1.05,
        mandiCessTotal: Math.round(2250 * qty * 0.0105),
        loadingWeighbridgePerQtl: 25,
        loadingTotal: 25 * qty,
        otherDeductions: 0,
        paymentTerms: 'Weighbridge Cash / 24h NEFT',
        isBestOption: false
      },
      {
        id: 'DEST-02',
        type: 'APMC_MANDI',
        name: 'Pune Gultekdi APMC',
        location: 'Pune, MH',
        distanceKm: 210,
        grossRatePerQtl: 2420,
        grossRevenue: 2420 * qty,
        freightRatePerQtl: 380,
        freightTotal: 380 * qty,
        mandiCessPercent: 1.25,
        mandiCessTotal: Math.round(2420 * qty * 0.0125),
        loadingWeighbridgePerQtl: 30,
        loadingTotal: 30 * qty,
        otherDeductions: 500, // Mandi gate entry fee
        paymentTerms: '48h APMC Clearing',
        isBestOption: false
      },
      {
        id: 'DEST-03',
        type: 'APMC_MANDI',
        name: 'Dindori Sub-Market Yard',
        location: 'Nashik, MH',
        distanceKm: 14,
        grossRatePerQtl: 2100,
        grossRevenue: 2100 * qty,
        freightRatePerQtl: 65,
        freightTotal: 65 * qty,
        mandiCessPercent: 1.0,
        mandiCessTotal: Math.round(2100 * qty * 0.01),
        loadingWeighbridgePerQtl: 20,
        loadingTotal: 20 * qty,
        otherDeductions: 0,
        paymentTerms: 'Spot APMC Token Slip',
        isBestOption: false
      },
      {
        id: 'DEST-04',
        type: 'VYAPARI_FARMGATE',
        name: 'Suresh Jadhav (Jadhav Krishi Mandi Vyapar)',
        location: 'Direct Farmgate Pickup (Nashik)',
        distanceKm: 0,
        grossRatePerQtl: 2350,
        grossRevenue: 2350 * qty,
        freightRatePerQtl: 0, // Trader provides vehicle
        freightTotal: 0,
        mandiCessPercent: 0, // Direct farmgate trade exemption
        mandiCessTotal: 0,
        loadingWeighbridgePerQtl: 15,
        loadingTotal: 15 * qty,
        otherDeductions: 0,
        paymentTerms: 'Spot Cash / Instant UPI at farm gate',
        isBestOption: true
      }
    ];

    // Compute net realization and find best
    const calculated = options.map((opt) => {
      const totalDeductions = opt.freightTotal + opt.mandiCessTotal + opt.loadingTotal + opt.otherDeductions;
      const netPayout = opt.grossRevenue - totalDeductions;
      const netPerQtl = Math.round(netPayout / qty);

      return {
        ...opt,
        totalDeductions,
        netPayout,
        netPerQtl
      };
    });

    // Mark best
    let bestIdx = 0;
    let maxNet = -1;
    calculated.forEach((c, idx) => {
      if (c.netPayout > maxNet) {
        maxNet = c.netPayout;
        bestIdx = idx;
      }
    });

    calculated.forEach((c, idx) => {
      c.isBestOption = idx === bestIdx;
    });

    return {
      commodity,
      quantityQtl: qty,
      farmerDistrict,
      comparison: calculated,
      bestRecommendation: calculated[bestIdx]
    };
  },

  // GET Agmarknet & eNAM Gateway Health and Failure Alerts (SOP-04 §3)
  async listGatewayHealth() {
    await new Promise((r) => setTimeout(r, 90));

    const gateways = [
      {
        id: 'GW-01',
        name: 'Agmarknet eNAM Central Gateway',
        endpoint: 'https://api.enam.gov.in/v2/market-rates/live',
        governingBody: 'Ministry of Agriculture & Farmers Welfare (MoAFW)',
        status: 'operational',
        uptimePercent: 99.85,
        latencyMs: 145,
        lastHeartbeat: new Date(Date.now() - 4 * 60000).toISOString(),
        rateLimit: '5,000 req/hr',
        activeMandisCount: 6,
        description: 'Primary national commodity rate ingestion feed across state APMCs.'
      },
      {
        id: 'GW-02',
        name: 'Maharashtra MSAMB Krishi Gateway',
        endpoint: 'https://msamb.com/api/apmc/v1/daily-rates',
        governingBody: 'Maharashtra State Agricultural Marketing Board',
        status: 'operational',
        uptimePercent: 99.4,
        latencyMs: 180,
        lastHeartbeat: new Date(Date.now() - 7 * 60000).toISOString(),
        rateLimit: '2,000 req/hr',
        activeMandisCount: 1,
        description: 'State-level APMC weighbridge arrivals and commodity rate pipeline.'
      },
      {
        id: 'GW-03',
        name: 'DMI Agmarknet National Portal (NIC)',
        endpoint: 'https://agmarknet.gov.in/ws/price_service.asmx',
        governingBody: 'Directorate of Marketing & Inspection / NIC',
        status: 'delayed',
        uptimePercent: 96.8,
        latencyMs: 890,
        lastHeartbeat: new Date(Date.now() - 25 * 60000).toISOString(),
        rateLimit: '1,500 req/hr',
        activeMandisCount: 1,
        description: 'Legacy SOAP webservice for wholesale mandi data. Experiencing latency spikes.'
      },
      {
        id: 'GW-04',
        name: 'Karnataka Krishi Marata Vahini',
        endpoint: 'https://krishimaratavahini.kar.nic.in/api/v1/live',
        governingBody: 'Karnataka State APMC Department',
        status: 'operational',
        uptimePercent: 99.1,
        latencyMs: 220,
        lastHeartbeat: new Date(Date.now() - 12 * 60000).toISOString(),
        rateLimit: '1,000 req/hr',
        activeMandisCount: 0,
        description: 'Interstate border market data corridor for Southern agricultural trade.'
      }
    ];

    const failureAlerts = [
      {
        id: 'ALT-301',
        gatewayId: 'GW-03',
        gatewayName: 'DMI Agmarknet National Portal (NIC)',
        severity: 'warning',
        title: 'High Response Latency & Delayed Feed',
        description: 'Response latency exceeded 800ms threshold (890ms). Nanded APMC price arrivals feed delayed by 180 minutes.',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        status: 'active',
        affectedMandi: 'Nanded APMC (MP-506)',
        recommendedAction: 'Retry sync or engage manual rate override for Nanded APMC.'
      },
      {
        id: 'ALT-302',
        gatewayId: 'GW-01',
        gatewayName: 'Agmarknet eNAM Central Gateway',
        severity: 'info',
        title: 'Dindori Sub-Market Feed Empty Payload',
        description: 'Dindori sub-market weighbridge feed returned empty arrival JSON. Superadmin manual override currently active.',
        timestamp: new Date(Date.now() - 14 * 3600000).toISOString(),
        status: 'resolved',
        affectedMandi: 'Dindori Sub-Market (MP-508)',
        resolutionNotes: 'Manual benchmark override applied by root@agrovercity.'
      }
    ];

    return {
      gateways,
      failureAlerts
    };
  },

  // Ping Gateway Diagnostic Test
  async pingGateway({ gatewayId, adminUid = 'root@agrovercity' }) {
    await new Promise((r) => setTimeout(r, 320));
    const randomLatency = Math.floor(110 + Math.random() * 90);
    const success = true;

    const audit = recordAuditLog({
      adminUid,
      action: 'GATEWAY_HEALTH_PING',
      targetUserId: gatewayId,
      targetUserName: `Gateway Ping (${gatewayId})`,
      previousState: 'Health Unknown',
      newState: `Live Ping Responded: HTTP 200 OK (${randomLatency}ms)`,
      reason: 'Administrative diagnostic ping from Superadmin Console'
    });

    return {
      success,
      gatewayId,
      latencyMs: randomLatency,
      message: `Gateway ${gatewayId} responded with HTTP 200 OK (${randomLatency}ms latency).`,
      auditRecord: audit
    };
  },

  // Resolve Gateway Failure Alert
  async resolveGatewayAlert({ alertId, resolution, adminUid = 'root@agrovercity' }) {
    await new Promise((r) => setTimeout(r, 140));
    
    const audit = recordAuditLog({
      adminUid,
      action: 'GATEWAY_ALERT_RESOLVED',
      targetUserId: alertId,
      targetUserName: `Alert Incident ${alertId}`,
      previousState: 'Status: active',
      newState: 'Status: resolved',
      reason: resolution || 'Administrative resolution applied.'
    });

    return {
      success: true,
      alertId,
      message: `Alert ${alertId} marked as resolved.`,
      auditRecord: audit
    };
  },

  // List Mandi Specific Audit History (SOP-04 §6.2)
  async listMandiAuditLogs({ query = '', action = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let allLogs = getStoredAuditLogs();

    // Filter to Mandi, Agmarknet, and Gateway related actions
    let mandiLogs = allLogs.filter((log) => {
      const act = (log.action || '').toUpperCase();
      return (
        act.includes('MANDI') ||
        act.includes('AGMARKNET') ||
        act.includes('RATE') ||
        act.includes('GATEWAY')
      );
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      mandiLogs = mandiLogs.filter((log) =>
        (log.id && log.id.toLowerCase().includes(q)) ||
        (log.adminUid && log.adminUid.toLowerCase().includes(q)) ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.targetUserName && log.targetUserName.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q))
      );
    }

    if (action && action !== 'all') {
      mandiLogs = mandiLogs.filter((log) => log.action === action);
    }

    const total = mandiLogs.length;
    const startIndex = (page - 1) * limit;
    const paginated = mandiLogs.slice(startIndex, startIndex + limit);

    return {
      logs: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  },

  // Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(MANDI_BENCHMARKS_KEY, JSON.stringify(INITIAL_MANDI_BENCHMARKS));
    localStorage.setItem(VYAPARI_RATES_KEY, JSON.stringify(INITIAL_VYAPARI_RATES));
    return { success: true };
  }
};

