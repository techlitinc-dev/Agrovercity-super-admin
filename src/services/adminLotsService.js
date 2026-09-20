// Admin Produce Lots & B2B Trading Service for AGROVERCITY Superadmin
// Implements Module 05: Produce Lots & B2B Trading (SOP-05)
// Target Collections: market_lots, deals, procurements, buyer_ledgers, audit_logs

import {
  INITIAL_MARKET_LOTS,
  INITIAL_DEALS,
  INITIAL_PROCUREMENTS,
  INITIAL_BUYER_LEDGERS
} from './mockData';

const LOTS_STORAGE_KEY = 'agrovercity_superadmin_market_lots';
const DEALS_STORAGE_KEY = 'agrovercity_superadmin_deals';
const PROCUREMENTS_STORAGE_KEY = 'agrovercity_superadmin_procurements';
const BUYER_LEDGERS_STORAGE_KEY = 'agrovercity_superadmin_buyer_ledgers';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

function getStoredLots() {
  const data = localStorage.getItem(LOTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_MARKET_LOTS));
    return INITIAL_MARKET_LOTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MARKET_LOTS;
  }
}

function saveLots(items) {
  localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredDeals() {
  const data = localStorage.getItem(DEALS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    return INITIAL_DEALS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DEALS;
  }
}

function saveDeals(items) {
  localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredProcurements() {
  const data = localStorage.getItem(PROCUREMENTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PROCUREMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROCUREMENTS));
    return INITIAL_PROCUREMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PROCUREMENTS;
  }
}

function saveProcurements(items) {
  localStorage.setItem(PROCUREMENTS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredBuyerLedgers() {
  const data = localStorage.getItem(BUYER_LEDGERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(BUYER_LEDGERS_STORAGE_KEY, JSON.stringify(INITIAL_BUYER_LEDGERS));
    return INITIAL_BUYER_LEDGERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BUYER_LEDGERS;
  }
}

function saveBuyerLedgers(items) {
  localStorage.setItem(BUYER_LEDGERS_STORAGE_KEY, JSON.stringify(items));
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
    targetUserId: targetUserId || 'LOT_SYSTEM',
    targetUserName: targetUserName || 'Produce Trading Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Produce lot intervention via Superadmin Console (SOP-05)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminLotsService = {
  // 1. List produce lots with full search and filters
  async listLots({
    query = '',
    status = 'all',
    commodity = 'all',
    district = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let lots = getStoredLots();

    // Query filter
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      lots = lots.filter((l) => {
        const idMatch = l.id && l.id.toLowerCase().includes(q);
        const farmerMatch = l.farmerName && l.farmerName.toLowerCase().includes(q);
        const mobileMatch = l.farmerMobile && l.farmerMobile.toLowerCase().includes(q);
        const commMatch = l.commodity && l.commodity.toLowerCase().includes(q);
        const distMatch = l.district && l.district.toLowerCase().includes(q);
        const varMatch = l.variety && l.variety.toLowerCase().includes(q);
        return idMatch || farmerMatch || mobileMatch || commMatch || distMatch || varMatch;
      });
    }

    // Status filter
    if (status && status !== 'all') {
      lots = lots.filter((l) => l.status.toLowerCase() === status.toLowerCase());
    }

    // Commodity filter
    if (commodity && commodity !== 'all' && commodity !== 'All Commodities') {
      lots = lots.filter((l) => l.commodity.toLowerCase().includes(commodity.toLowerCase()));
    }

    // District filter
    if (district && district !== 'all' && district !== 'All Districts') {
      lots = lots.filter((l) => l.district.toLowerCase().includes(district.toLowerCase()));
    }

    const total = lots.length;
    const startIndex = (page - 1) * limit;
    const paginated = lots.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        lots: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 2. Get single lot details with associated deal & procurement
  async getLotDetails(lotId) {
    await new Promise((r) => setTimeout(r, 80));
    const lots = getStoredLots();
    const lot = lots.find((l) => l.id === lotId);
    if (!lot) throw new Error(`Produce lot ${lotId} not found`);

    let deal = null;
    let procurement = null;
    let buyerLedger = null;

    if (lot.dealId) {
      const deals = getStoredDeals();
      deal = deals.find((d) => d.id === lot.dealId) || null;

      if (deal) {
        const procs = getStoredProcurements();
        procurement = procs.find((p) => p.dealId === deal.id) || null;

        const ledgers = getStoredBuyerLedgers();
        buyerLedger = ledgers.find((b) => b.buyerId === deal.buyerId) || null;
      }
    }

    return {
      success: true,
      data: {
        lot,
        deal,
        procurement,
        buyerLedger
      }
    };
  },

  // 3. Force status update for a produce lot
  async updateLotStatus({ lotId, status, adminUid = 'root@agrovercity', reason }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative justification (min 8 characters) is required for audit compliance.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const lots = getStoredLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) throw new Error(`Produce lot ${lotId} not found`);

    const lot = lots[index];
    const prevStatus = lot.status;

    lot.status = status;
    lot.updatedAt = new Date().toISOString();

    lots[index] = lot;
    saveLots(lots);

    const audit = recordAuditLog({
      adminUid,
      action: 'LOT_STATUS_OVERRIDDEN',
      targetUserId: lot.farmerId,
      targetUserName: `${lot.farmerName} (${lot.commodity})`,
      previousState: `Lot ${lot.id} status: ${prevStatus}`,
      newState: `Lot ${lot.id} status: ${status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Produce lot ${lotId} status changed from ${prevStatus} to ${status}.`,
      lot,
      auditRecord: audit
    };
  },

  // 4. Verify Weighbridge Slip & Weight Attestation
  async verifyWeighbridgeSlip({
    lotId,
    verified,
    slipNumber,
    netWeightKg,
    variancePercent = 0.0,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Weighbridge verification rationale (min 8 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const lots = getStoredLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) throw new Error(`Produce lot ${lotId} not found`);

    const lot = lots[index];
    const prevVerified = lot.weighbridgeSlip ? lot.weighbridgeSlip.verified : false;

    if (!lot.weighbridgeSlip) {
      lot.weighbridgeSlip = {};
    }

    lot.weighbridgeSlip.verified = verified;
    lot.weighbridgeSlip.verifiedAt = new Date().toISOString();
    lot.weighbridgeSlip.verifiedBy = adminUid;
    if (slipNumber) lot.weighbridgeSlip.slipNumber = slipNumber;
    if (netWeightKg) {
      lot.weighbridgeSlip.netWeightKg = Number(netWeightKg);
      lot.weighbridgeSlip.netQuintals = Number((netWeightKg / 100).toFixed(1));
    }
    lot.weighbridgeSlip.variancePercent = Number(variancePercent);
    lot.updatedAt = new Date().toISOString();

    // If verified and was under_review, promote to active
    if (verified && lot.status === 'under_review') {
      lot.status = 'active';
    }

    lots[index] = lot;
    saveLots(lots);

    const audit = recordAuditLog({
      adminUid,
      action: verified ? 'WEIGHBRIDGE_SLIP_VERIFIED' : 'WEIGHBRIDGE_SLIP_REJECTED',
      targetUserId: lot.farmerId,
      targetUserName: `${lot.farmerName} (${lot.commodity} - ${lot.id})`,
      previousState: `Weighbridge verified: ${prevVerified}`,
      newState: `Weighbridge verified: ${verified} (Slip #${lot.weighbridgeSlip.slipNumber || 'N/A'})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Weighbridge slip for lot ${lotId} marked as ${verified ? 'Verified' : 'Rejected'}.`,
      lot,
      auditRecord: audit
    };
  },

  // 5. Mediate B2B Dispute between Farmer and Trader
  async mediateDispute({
    dealId,
    resolutionType,
    adjustedPrice,
    releaseAmount,
    refundAmount,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Formal arbitration reasoning (min 8 characters) is mandatory for financial escrow adjustments.');
    }

    await new Promise((r) => setTimeout(r, 200));
    const deals = getStoredDeals();
    const lots = getStoredLots();
    const procs = getStoredProcurements();

    const dIndex = deals.findIndex((d) => d.id === dealId);
    if (dIndex === -1) throw new Error(`B2B Deal ${dealId} not found`);

    const deal = deals[dIndex];
    const lotIndex = lots.findIndex((l) => l.id === deal.lotId);
    const lot = lotIndex !== -1 ? lots[lotIndex] : null;

    const prevDealStatus = deal.status;

    if (resolutionType === 'uphold_farmer') {
      // Release full escrow to farmer
      deal.status = 'completed';
      deal.escrowStatus = 'released_to_farmer';
      deal.paymentStatus = 'paid';
      deal.disputeReason = `Dispute resolved in favor of farmer: ${reason.trim()}`;
      if (lot) lot.status = 'sold';
    } else if (resolutionType === 'quality_docking') {
      // Adjust price, partial escrow release, refund remaining to buyer
      const newPrice = Number(adjustedPrice) || deal.finalAgreedPrice;
      const newTotal = newPrice * deal.quantityQtl;
      deal.finalAgreedPrice = newPrice;
      deal.totalDealValue = newTotal;
      deal.status = 'completed';
      deal.escrowStatus = 'released_to_farmer';
      deal.paymentStatus = 'paid';
      deal.disputeReason = `Dispute arbitrated with quality docking of ₹${deal.finalAgreedPrice - newPrice}/Qtl: ${reason.trim()}`;
      if (lot) lot.status = 'sold';
    } else if (resolutionType === 'cancel_and_refund') {
      // Cancel contract, refund escrow to buyer, reset lot to active
      deal.status = 'cancelled';
      deal.escrowStatus = 'refunded_to_buyer';
      deal.paymentStatus = 'unpaid';
      deal.disputeReason = `Contract cancelled by Superadmin; escrow refunded to buyer: ${reason.trim()}`;
      if (lot) {
        lot.status = 'active';
        lot.dealId = null;
      }
    }

    deal.updatedAt = new Date().toISOString();
    deals[dIndex] = deal;
    saveDeals(deals);

    if (lot && lotIndex !== -1) {
      lot.updatedAt = new Date().toISOString();
      lots[lotIndex] = lot;
      saveLots(lots);
    }

    // Update procurement record if present
    const pIndex = procs.findIndex((p) => p.dealId === deal.id);
    if (pIndex !== -1) {
      procs[pIndex].status = resolutionType === 'cancel_and_refund' ? 'disputed' : 'settled';
      saveProcurements(procs);
    }

    const audit = recordAuditLog({
      adminUid,
      action: 'B2B_DEAL_DISPUTE_MEDIATED',
      targetUserId: deal.buyerId,
      targetUserName: `${deal.farmerName} vs ${deal.buyerFirm} (${deal.id})`,
      previousState: `Deal ${deal.id} status: ${prevDealStatus} (Escrow: ${deal.escrowAmount})`,
      newState: `Resolution: ${resolutionType} (Deal status: ${deal.status})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Dispute on Deal ${dealId} resolved via ${resolutionType}.`,
      deal,
      lot,
      auditRecord: audit
    };
  },

  // 6. Suspend or Takedown Fraudulent Produce Listing
  async suspendLotListing({
    lotId,
    suspended,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative takedown explanation (min 8 characters) is required.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const lots = getStoredLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) throw new Error(`Produce lot ${lotId} not found`);

    const lot = lots[index];
    const prevStatus = lot.status;

    if (suspended) {
      lot.status = 'suspended';
      lot.suspensionDetails = {
        reason: reason.trim(),
        suspendedAt: new Date().toISOString(),
        suspendedBy: adminUid
      };
    } else {
      lot.status = 'active';
      lot.suspensionDetails = null;
    }

    lot.updatedAt = new Date().toISOString();
    lots[index] = lot;
    saveLots(lots);

    const audit = recordAuditLog({
      adminUid,
      action: suspended ? 'PRODUCE_LOT_SUSPENDED' : 'PRODUCE_LOT_REINSTATED',
      targetUserId: lot.farmerId,
      targetUserName: `${lot.farmerName} (${lot.commodity} - ${lot.id})`,
      previousState: `Status: ${prevStatus}`,
      newState: `Status: ${lot.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Produce lot ${lotId} has been ${suspended ? 'suspended and hidden from marketplace' : 'reinstated to active status'}.`,
      lot,
      auditRecord: audit
    };
  },

  // 7. List B2B Deals
  async listDeals({
    query = '',
    status = 'all',
    escrowStatus = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let deals = getStoredDeals();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      deals = deals.filter((d) =>
        d.id.toLowerCase().includes(q) ||
        d.farmerName.toLowerCase().includes(q) ||
        d.buyerName.toLowerCase().includes(q) ||
        d.buyerFirm.toLowerCase().includes(q) ||
        d.commodity.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      deals = deals.filter((d) => d.status.toLowerCase() === status.toLowerCase());
    }

    if (escrowStatus && escrowStatus !== 'all') {
      deals = deals.filter((d) => d.escrowStatus.toLowerCase() === escrowStatus.toLowerCase());
    }

    const total = deals.length;
    const startIndex = (page - 1) * limit;
    const paginated = deals.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        deals: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 8. List Trader Procurements
  async listProcurements({
    query = '',
    status = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let procs = getStoredProcurements();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      procs = procs.filter((p) =>
        p.id.toLowerCase().includes(q) ||
        p.traderName.toLowerCase().includes(q) ||
        p.traderFirm.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.commodity.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      procs = procs.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    const total = procs.length;
    const startIndex = (page - 1) * limit;
    const paginated = procs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        procurements: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 9. List Buyer Ledgers (Credit, Udhaar & APMC Licensure)
  async listBuyerLedgers({
    query = '',
    risk = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let ledgers = getStoredBuyerLedgers();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      ledgers = ledgers.filter((b) =>
        b.id.toLowerCase().includes(q) ||
        b.buyerName.toLowerCase().includes(q) ||
        b.buyerFirm.toLowerCase().includes(q) ||
        b.apmcLicenseNo.toLowerCase().includes(q)
      );
    }

    if (risk && risk !== 'all') {
      ledgers = ledgers.filter((b) => b.defaultRisk.toLowerCase() === risk.toLowerCase());
    }

    const total = ledgers.length;
    const startIndex = (page - 1) * limit;
    const paginated = ledgers.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        ledgers: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 10. Update Buyer Credit Limit
  async updateBuyerCreditLimit({
    buyerId,
    newCreditLimit,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory justification (min 8 chars) required for modifying trader udhaar limits.');
    }

    await new Promise((r) => setTimeout(r, 120));
    const ledgers = getStoredBuyerLedgers();
    const index = ledgers.findIndex((b) => b.buyerId === buyerId || b.id === buyerId);
    if (index === -1) throw new Error(`Buyer ledger ${buyerId} not found`);

    const buyer = ledgers[index];
    const prevLimit = buyer.creditLimit;
    const numLimit = Number(newCreditLimit);

    buyer.creditLimit = numLimit;
    buyer.creditUtilizationPercent = parseFloat(((buyer.currentUdhaarBalance / numLimit) * 100).toFixed(1));
    if (buyer.creditUtilizationPercent > 100) {
      buyer.accountStatus = 'warning_limit_exceeded';
      buyer.defaultRisk = 'critical';
    } else {
      buyer.accountStatus = 'active';
      buyer.defaultRisk = buyer.creditUtilizationPercent > 75 ? 'moderate' : 'low';
    }

    ledgers[index] = buyer;
    saveBuyerLedgers(ledgers);

    const audit = recordAuditLog({
      adminUid,
      action: 'BUYER_CREDIT_LIMIT_UPDATED',
      targetUserId: buyer.buyerId,
      targetUserName: buyer.buyerFirm,
      previousState: `Credit Limit ₹${prevLimit.toLocaleString('en-IN')}`,
      newState: `Credit Limit ₹${numLimit.toLocaleString('en-IN')} (Utilization: ${buyer.creditUtilizationPercent}%)`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Credit limit for ${buyer.buyerFirm} updated to ₹${numLimit.toLocaleString('en-IN')}.`,
      buyer,
      auditRecord: audit
    };
  },

  // 11. Compute module KPIs
  async getLotsKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const lots = getStoredLots();
    const deals = getStoredDeals();
    const ledgers = getStoredBuyerLedgers();

    const totalLots = lots.length;
    const activeLots = lots.filter((l) => l.status === 'active');
    const disputedLots = lots.filter((l) => l.status === 'disputed');
    const underReviewLots = lots.filter((l) => l.status === 'under_review');
    const suspendedLots = lots.filter((l) => l.status === 'suspended');

    const totalActiveTonnage = activeLots.reduce((acc, l) => acc + (l.quantityQtl || 0), 0) / 10; // Qtl to MT
    const verifiedWeighbridges = lots.filter((l) => l.weighbridgeSlip && l.weighbridgeSlip.verified).length;
    const weighbridgeRate = totalLots > 0 ? Math.round((verifiedWeighbridges / totalLots) * 100) : 0;

    const totalEscrowLocked = deals.reduce((acc, d) => acc + (d.escrowAmount || 0), 0);
    const totalUdhaarBalance = ledgers.reduce((acc, b) => acc + (b.currentUdhaarBalance || 0), 0);

    return {
      totalLots,
      activeLotsCount: activeLots.length,
      totalActiveTonnageMT: Math.round(totalActiveTonnage),
      disputedLotsCount: disputedLots.length,
      underReviewCount: underReviewLots.length,
      suspendedCount: suspendedLots.length,
      weighbridgeVerifiedRate: weighbridgeRate,
      activeDealsCount: deals.length,
      totalEscrowLocked,
      totalUdhaarBalance
    };
  },

  // 12. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_MARKET_LOTS));
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    localStorage.setItem(PROCUREMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROCUREMENTS));
    localStorage.setItem(BUYER_LEDGERS_STORAGE_KEY, JSON.stringify(INITIAL_BUYER_LEDGERS));
    return { success: true };
  }
};
