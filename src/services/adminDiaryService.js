// Admin Farm Diary, P&L Analytics & Break-Even Service for AGROVERCITY Superadmin
// Implements Module 13: Farm Diary, P&L Analytics & Break-Even (SOP-13)
// Target Collections: farm_diary_entries, crop_pnl, pnl_benchmarks, regional_trends, agricoins_audit, audit_logs

import {
  mockDiaryEntries,
  mockCropPnl,
  mockPnlBenchmarks,
  mockRegionalExpenditureTrends,
  mockAgriCoinsAuditLedger
} from '../api/mockData';

const ENTRIES_STORAGE_KEY = 'agrovercity_superadmin_farm_diary_entries';
const PNL_STORAGE_KEY = 'agrovercity_superadmin_crop_pnl';
const BENCHMARKS_STORAGE_KEY = 'agrovercity_superadmin_pnl_benchmarks';
const TRENDS_STORAGE_KEY = 'agrovercity_superadmin_regional_trends';
const COINS_STORAGE_KEY = 'agrovercity_superadmin_agricoins_audit';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

export const INITIAL_DIARY_AUDIT_LOGS = [
  {
    id: 'AUD-1301',
    adminUid: 'root@agrovercity',
    action: 'ENTRY_VERIFIED',
    targetUserId: 'dia_1001',
    targetUserName: 'Ram Patil (Single superphosphate fertilizer invoice)',
    previousState: 'Status: pending_review',
    newState: 'Status: verified (+15 AgriCoins confirmed in wallet)',
    reason: 'Verified tax invoice #INV-2026-9901 against Krishi Kendra GST registry.',
    timestamp: '2026-09-20T11:45:00.000Z',
    ipAddress: '14.139.122.21'
  },
  {
    id: 'AUD-1302',
    adminUid: 'root@agrovercity',
    action: 'ENTRY_FLAGGED_FRAUD',
    targetUserId: 'dia_1008',
    targetUserName: 'Vitthal Kale (Duplicate machinery hire claim)',
    previousState: 'Status: verified, Flagged: false',
    newState: 'Status: flagged, Flagged: true (Duplicate voucher)',
    reason: 'Detected 96% perceptual hash match with voucher submitted by usr_d205 two days prior.',
    timestamp: '2026-09-19T16:20:00.000Z',
    ipAddress: '14.139.122.19'
  },
  {
    id: 'AUD-1303',
    adminUid: 'root@agrovercity',
    action: 'BENCHMARK_CALIBRATED',
    targetUserId: 'BENCH-SOYBEAN-MH',
    targetUserName: 'Soybean (Maharashtra Kharif)',
    previousState: 'Baseline: ₹23,500/acre, Break-Even: ₹2,474/qtl',
    newState: 'Baseline: ₹24,500/acre, Break-Even: ₹2,579/qtl',
    reason: 'Updated baseline cost following 8% hike in complex fertilizer DAP rates across Western Maharashtra.',
    timestamp: '2026-09-18T10:00:00.000Z',
    ipAddress: '14.139.122.6'
  },
  {
    id: 'AUD-1304',
    adminUid: 'root@agrovercity',
    action: 'PNL_STATEMENT_VERIFIED',
    targetUserId: 'pnl_2001',
    targetUserName: 'Ram Patil (Soybean Kharif 2026 P&L)',
    previousState: 'Status: audited, Loan Status: under_review',
    newState: 'Status: verified, Loan Status: recommended (KCC Limit: ₹1,50,000)',
    reason: 'DSCR ratio of 1.48x satisfies State Cooperative Bank digital underwriting criteria.',
    timestamp: '2026-09-17T14:10:00.000Z',
    ipAddress: '14.139.122.11'
  }
];

function getStored(key, defaultVal) {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return JSON.parse(JSON.stringify(defaultVal));
    }
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return JSON.parse(JSON.stringify(defaultVal));
  }
}

function save(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
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
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'N/A',
    targetUserName: targetUserName || 'N/A',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Administrative action logged.',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.' + Math.floor(Math.random() * 250 + 1)
  };

  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

function paginateItems(items, page = 1, limit = 15) {
  const total = items.length;
  const startIndex = (page - 1) * limit;
  return {
    data: items.slice(startIndex, startIndex + limit),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

export const adminDiaryService = {
  // 1. List Farm Diary Entries (GET /v1/admin/diary/entries)
  async listDiaryEntries({
    query = '',
    status = 'all',
    category = 'all',
    type = 'all',
    from = '',
    to = '',
    page = 1,
    limit = 15
  } = {}) {
    await new Promise((r) => setTimeout(r, 120));
    let entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);

    if (status !== 'all') {
      entries = entries.filter((e) => e.status === status);
    }
    if (category !== 'all') {
      entries = entries.filter((e) => e.category === category);
    }
    if (type !== 'all') {
      entries = entries.filter((e) => e.type === type);
    }
    if (from) {
      entries = entries.filter((e) => (e.date || e.createdAt) >= from);
    }
    if (to) {
      entries = entries.filter((e) => (e.date || e.createdAt) <= to);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      entries = entries.filter((e) =>
        [e.id, e.farmerName, e.farmerPhone, e.title, e.cropName, e.district, e.receiptNumber, e.notes]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    const { data, pagination } = paginateItems(entries, page, limit);
    return { entries: data, pagination };
  },

  // 2. Verify Diary Entry (POST /v1/admin/diary/entries/{id}/verify)
  async verifyDiaryEntry({ entryId, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification (min 4 characters) is required to verify a farm diary entry.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    const idx = entries.findIndex((e) => e.id === entryId);
    if (idx === -1) throw new Error(`Diary entry ${entryId} not found.`);

    const prev = entries[idx];
    const prevStatus = prev.status;

    entries[idx].status = 'verified';
    entries[idx].flagged = false;
    entries[idx].coinsStatus = 'credited';
    entries[idx].updatedAt = new Date().toISOString();

    save(ENTRIES_STORAGE_KEY, entries);

    const audit = recordAuditLog({
      adminUid,
      action: 'ENTRY_VERIFIED',
      targetUserId: entryId,
      targetUserName: `${prev.farmerName} (${prev.title})`,
      previousState: `Status: ${prevStatus}`,
      newState: `Status: verified (+${prev.agriCoinsAwarded || 15} AgriCoins confirmed)`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Entry #${entryId} verified. Reward confirmed.`,
      entry: entries[idx],
      auditRecord: audit
    };
  },

  // 3. Flag Diary Entry for Duplicate / Anomaly
  async flagDiaryEntry({ entryId, flagReason, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to flag an entry for audit.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    const idx = entries.findIndex((e) => e.id === entryId);
    if (idx === -1) throw new Error(`Diary entry ${entryId} not found.`);

    const prev = entries[idx];
    entries[idx].status = 'flagged';
    entries[idx].flagged = true;
    entries[idx].flagReason = flagReason || reason.trim();
    entries[idx].updatedAt = new Date().toISOString();

    save(ENTRIES_STORAGE_KEY, entries);

    const audit = recordAuditLog({
      adminUid,
      action: 'ENTRY_FLAGGED_FRAUD',
      targetUserId: entryId,
      targetUserName: `${prev.farmerName} (${prev.title})`,
      previousState: `Status: ${prev.status}, Flagged: ${prev.flagged}`,
      newState: `Status: flagged (${entries[idx].flagReason})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Entry #${entryId} flagged for investigation.`,
      entry: entries[idx],
      auditRecord: audit
    };
  },

  // 4. Soft-Delete Entry & Clawback AgriCoins (DELETE /v1/admin/diary/entries/{id})
  async deleteDiaryEntry({ entryId, reason, secondApprover, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to soft-delete an entry and clawback AgriCoins.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    const idx = entries.findIndex((e) => e.id === entryId);
    if (idx === -1) throw new Error(`Diary entry ${entryId} not found.`);

    const prev = entries[idx];
    if (prev.amount >= 50000 && !secondApprover) {
      throw new Error('Financial override > ₹50,000 requires Dual-Admin sign-off pursuant to SOP-13 §6.3.');
    }

    // Soft delete: update status or remove from active list
    const deletedEntry = {
      ...prev,
      status: 'deleted',
      coinsStatus: 'revoked',
      deletedAt: new Date().toISOString(),
      deletedBy: adminUid,
      secondApprover: secondApprover || null
    };

    entries.splice(idx, 1);
    save(ENTRIES_STORAGE_KEY, entries);

    // Update AgriCoins Audit Ledger
    const coinsAudit = getStored(COINS_STORAGE_KEY, mockAgriCoinsAuditLedger);
    coinsAudit.reversalsProcessed = (coinsAudit.reversalsProcessed || 0) + 1;
    save(COINS_STORAGE_KEY, coinsAudit);

    const audit = recordAuditLog({
      adminUid,
      action: 'ENTRY_SOFT_DELETED_COINS_REVOKED',
      targetUserId: entryId,
      targetUserName: `${prev.farmerName} (${prev.title} - ₹${prev.amount})`,
      previousState: `Status: ${prev.status}, Coins: ${prev.agriCoinsAwarded || 15}`,
      newState: `Status: soft-deleted (15 AgriCoins reversed from wallet)${secondApprover ? ` [Dual Sign-off: ${secondApprover}]` : ''}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Entry #${entryId} soft-deleted. 15 AgriCoins clawbacked from farmer wallet.`,
      auditRecord: audit
    };
  },

  // 5. List Crop PnL Statements (GET /v1/admin/pnl/records)
  async listCropPnl({
    query = '',
    status = 'all',
    season = 'all',
    crop = 'all',
    from = '',
    to = '',
    page = 1,
    limit = 15
  } = {}) {
    await new Promise((r) => setTimeout(r, 120));
    let records = getStored(PNL_STORAGE_KEY, mockCropPnl);

    if (status !== 'all') {
      records = records.filter((r) => r.status === status);
    }
    if (season !== 'all') {
      records = records.filter((r) => r.season.toLowerCase().includes(season.toLowerCase()));
    }
    if (crop !== 'all') {
      records = records.filter((r) => r.cropName.toLowerCase() === crop.toLowerCase());
    }
    if (from) {
      records = records.filter((r) => (r.createdAt || '') >= from);
    }
    if (to) {
      records = records.filter((r) => (r.createdAt || '') <= to);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      records = records.filter((r) =>
        [r.id, r.farmerName, r.cropName, r.season, r.district, r.loanEligibility]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    const { data, pagination } = paginateItems(records, page, limit);
    return { records: data, pagination };
  },

  // 6. Verify Crop PnL Record (POST /v1/admin/pnl/records/{id}/verify)
  async verifyCropPnl({ pnlId, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to certify a Crop P&L statement.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const records = getStored(PNL_STORAGE_KEY, mockCropPnl);
    const idx = records.findIndex((r) => r.id === pnlId);
    if (idx === -1) throw new Error(`P&L record ${pnlId} not found.`);

    const prev = records[idx];
    records[idx].status = 'verified';
    records[idx].loanEligibility = 'recommended';
    records[idx].verifiedAt = new Date().toISOString();
    records[idx].updatedAt = new Date().toISOString();

    save(PNL_STORAGE_KEY, records);

    const audit = recordAuditLog({
      adminUid,
      action: 'PNL_STATEMENT_VERIFIED',
      targetUserId: pnlId,
      targetUserName: `${prev.farmerName} (${prev.cropName} - ${prev.season})`,
      previousState: `Status: ${prev.status}, Loan Eligibility: ${prev.loanEligibility}`,
      newState: `Status: verified, Loan Eligibility: recommended`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `P&L statement #${pnlId} certified for bank credit underwrite.`,
      record: records[idx],
      auditRecord: audit
    };
  },

  // 7. List Crop Production Cost Benchmarks (GET /v1/admin/pnl/benchmarks)
  async listBenchmarks() {
    await new Promise((r) => setTimeout(r, 100));
    return getStored(BENCHMARKS_STORAGE_KEY, mockPnlBenchmarks);
  },

  // 8. Update Benchmark (PUT /v1/admin/pnl/benchmarks/{crop})
  async updateBenchmark({ crop, payload, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to calibrate crop cost benchmarks.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const benchmarks = getStored(BENCHMARKS_STORAGE_KEY, mockPnlBenchmarks);
    const idx = benchmarks.findIndex((b) => b.crop.toLowerCase() === crop.toLowerCase());
    if (idx === -1) throw new Error(`Benchmark for ${crop} not found.`);

    const prev = benchmarks[idx];
    const prevCost = prev.baselineCostPerAcre;

    benchmarks[idx] = {
      ...benchmarks[idx],
      baselineCostPerAcre: Number(payload.baselineCostPerAcre) || prev.baselineCostPerAcre,
      seedsCost: Number(payload.seedsCost) || prev.seedsCost,
      fertilizerCost: Number(payload.fertilizerCost) || prev.fertilizerCost,
      laborCost: Number(payload.laborCost) || prev.laborCost,
      machineryCost: Number(payload.machineryCost) || prev.machineryCost,
      pesticidesCost: Number(payload.pesticidesCost) || prev.pesticidesCost,
      targetYieldQuintalsPerAcre: Number(payload.targetYieldQuintalsPerAcre) || prev.targetYieldQuintalsPerAcre,
      benchmarkBreakEvenPrice: Math.round(
        (Number(payload.baselineCostPerAcre) || prev.baselineCostPerAcre) /
        (Number(payload.targetYieldQuintalsPerAcre) || prev.targetYieldQuintalsPerAcre)
      ),
      lastCalibratedAt: new Date().toISOString(),
      calibratedBy: adminUid
    };

    save(BENCHMARKS_STORAGE_KEY, benchmarks);

    const audit = recordAuditLog({
      adminUid,
      action: 'BENCHMARK_CALIBRATED',
      targetUserId: `BENCH-${crop.toUpperCase()}`,
      targetUserName: `${crop} (${benchmarks[idx].state})`,
      previousState: `Baseline Cost: ₹${prevCost}/acre`,
      newState: `Baseline Cost: ₹${benchmarks[idx].baselineCostPerAcre}/acre (Break-Even: ₹${benchmarks[idx].benchmarkBreakEvenPrice}/qtl)`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Benchmark for ${crop} calibrated successfully.`,
      benchmark: benchmarks[idx],
      auditRecord: audit
    };
  },

  // 9. Pre-sowing Break-Even Calculation (POST /v1/admin/pnl/break-even)
  calculateBreakEven({ crop, areaAcres = 1, expectedYieldQuintals = 10, totalExpenses = 25000, marketExpectedRate = 5000 }) {
    const yieldTotal = Number(expectedYieldQuintals) || 1;
    const expenses = Number(totalExpenses) || 0;
    const acres = Number(areaAcres) || 1;

    const breakEvenPrice = Math.round(expenses / yieldTotal);
    const costPerAcre = Math.round(expenses / acres);
    const projectedRevenue = yieldTotal * (Number(marketExpectedRate) || 0);
    const projectedProfit = projectedRevenue - expenses;
    const projectedRoi = expenses > 0 ? Number(((projectedProfit / expenses) * 100).toFixed(1)) : 0;

    return {
      crop,
      areaAcres: acres,
      expectedYieldQuintals: yieldTotal,
      totalExpenses: expenses,
      costPerAcre,
      breakEvenPricePerQuintal: breakEvenPrice,
      projectedRevenue,
      projectedProfit,
      projectedRoi,
      mspComparison: {
        breakEven: breakEvenPrice,
        marketRate: marketExpectedRate,
        marginPerQuintal: (marketExpectedRate || 0) - breakEvenPrice
      }
    };
  },

  // 10. Regional Summary & AgriCoins Audit (GET /v1/admin/diary/summary)
  async getRegionalSummary() {
    await new Promise((r) => setTimeout(r, 100));
    const trends = getStored(TRENDS_STORAGE_KEY, mockRegionalExpenditureTrends);
    const agriCoins = getStored(COINS_STORAGE_KEY, mockAgriCoinsAuditLedger);
    const entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    const pnl = getStored(PNL_STORAGE_KEY, mockCropPnl);

    return {
      regionalTrends: trends,
      agriCoinsAudit: agriCoins,
      totalEntries: entries.length,
      totalPnlRecords: pnl.length,
      flaggedCount: entries.filter((e) => e.flagged).length
    };
  },

  // 11. PDF Report Details
  async getPdfReport(pnlId) {
    await new Promise((r) => setTimeout(r, 80));
    const pnlList = getStored(PNL_STORAGE_KEY, mockCropPnl);
    const pnl = pnlList.find((p) => p.id === pnlId) || pnlList[0];

    return {
      reportId: pnlId,
      cropName: pnl.cropName,
      farmerName: pnl.farmerName,
      farmerPhone: pnl.farmerPhone,
      aadhaarMasked: pnl.aadhaarMasked,
      district: pnl.district,
      season: pnl.season,
      areaAcres: pnl.areaAcres,
      yieldQuintals: pnl.yieldQuintals,
      grossRevenue: pnl.grossRevenue,
      totalExpenses: pnl.totalExpenses,
      netProfit: pnl.netProfit,
      roiPercent: pnl.roiPercent,
      breakEvenPricePerQuintal: pnl.breakEvenPricePerQuintal,
      dscrRatio: pnl.dscrRatio,
      creditScore: pnl.creditScore,
      kccLimitRecommended: pnl.kccLimitRecommended,
      generatedAt: pnl.updatedAt || new Date().toISOString(),
      authorizedSignatory: 'AGROVERCITY Certified Financial Underwriting System (SOP-13)',
      pdfDownloadUrl: pnl.reportPdfUrl || 'https://cdn.agrovercity.in/reports/sample_pnl_audit.pdf'
    };
  },

  // 12. Statutory Audit Logs
  async listDiaryAuditLogs({ query = '', page = 1, limit = 15 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const allLogs = getStoredAuditLogs();
    const diaryKeywords = ['ENTRY', 'DIARY', 'PNL', 'BENCHMARK', 'COINS', 'ACCOUNTING', 'BREAK_EVEN'];

    let logs = allLogs.filter((log) =>
      diaryKeywords.some((kw) => (log.action || '').toUpperCase().includes(kw))
    );

    if (logs.length === 0) {
      logs = INITIAL_DIARY_AUDIT_LOGS;
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([...INITIAL_DIARY_AUDIT_LOGS, ...allLogs]));
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      logs = logs.filter((l) =>
        [l.id, l.adminUid, l.action, l.targetUserName, l.reason]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    const { data, pagination } = paginateItems(logs, page, limit);
    return { auditLogs: data, pagination };
  },

  // 13. Dashboard KPIs
  async getDiaryKpis() {
    const entries = getStored(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    const pnl = getStored(PNL_STORAGE_KEY, mockCropPnl);
    const coinsAudit = getStored(COINS_STORAGE_KEY, mockAgriCoinsAuditLedger);

    const today = new Date().toISOString().slice(0, 10);
    const activeEntries = entries.filter((e) => e.status === 'verified').length;
    const pendingReview = entries.filter((e) => e.status === 'pending_review').length;
    const flaggedCount = entries.filter((e) => e.flagged || e.status === 'flagged' || e.status === 'disputed').length;
    const todayVolume = entries.filter((e) => (e.createdAt || '').slice(0, 10) === today).length;

    return {
      activeEntries,
      pendingReview,
      flaggedCount,
      todayVolume: todayVolume || 3,
      totalCoinsDisbursed: coinsAudit.totalCoinsDisbursed || 632550,
      auditIntegrityScore: coinsAudit.auditIntegrityScore || 99.7,
      totalPnlStatements: pnl.length
    };
  },

  // 14. Reset Seed Data to Statutory Default
  async resetToDefaultSeed() {
    save(ENTRIES_STORAGE_KEY, mockDiaryEntries);
    save(PNL_STORAGE_KEY, mockCropPnl);
    save(BENCHMARKS_STORAGE_KEY, mockPnlBenchmarks);
    save(TRENDS_STORAGE_KEY, mockRegionalExpenditureTrends);
    save(COINS_STORAGE_KEY, mockAgriCoinsAuditLedger);

    const currentAudits = getStoredAuditLogs().filter(
      (log) => !['ENTRY', 'DIARY', 'PNL', 'BENCHMARK', 'COINS'].some((kw) => (log.action || '').toUpperCase().includes(kw))
    );
    save(AUDIT_STORAGE_KEY, [...INITIAL_DIARY_AUDIT_LOGS, ...currentAudits]);

    return { success: true, message: 'Farm Diary and P&L seed reset to defaults.' };
  }
};
