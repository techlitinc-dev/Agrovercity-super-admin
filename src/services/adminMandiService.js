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

  // Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(MANDI_BENCHMARKS_KEY, JSON.stringify(INITIAL_MANDI_BENCHMARKS));
    localStorage.setItem(VYAPARI_RATES_KEY, JSON.stringify(INITIAL_VYAPARI_RATES));
    return { success: true };
  }
};
