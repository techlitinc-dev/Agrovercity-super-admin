// Admin Transport Logistics & Fleet Operations Service for AGROVERCITY Superadmin
// Implements Module 08: Transport Logistics & Fleet Operations (SOP-08)
// Target Collections: vehicles, transport_bookings, transporter_settlements, audit_logs

import {
  INITIAL_VEHICLES,
  INITIAL_TRANSPORT_BOOKINGS,
  INITIAL_TRANSPORTER_SETTLEMENTS
} from './mockData';

const VEHICLES_STORAGE_KEY = 'agrovercity_superadmin_vehicles';
const BOOKINGS_STORAGE_KEY = 'agrovercity_superadmin_transport_bookings';
const SETTLEMENTS_STORAGE_KEY = 'agrovercity_superadmin_transporter_settlements';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

// Dual-admin sign-off threshold for payout approvals (SOP-08 Rule 3)
const DUAL_SIGNOFF_THRESHOLD = 50000;

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
    targetUserId: targetUserId || 'TRANSPORT_SYSTEM',
    targetUserName: targetUserName || 'Transport Fleet Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Transport module intervention via Superadmin Console (SOP-08)',
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

export const adminTransportService = {
  // 1. List registered fleet vehicles with KYC document status
  async listVehicles({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let vehicles = getStored(VEHICLES_STORAGE_KEY, INITIAL_VEHICLES);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      vehicles = vehicles.filter((v) =>
        v.id.toLowerCase().includes(q) ||
        v.transporterName.toLowerCase().includes(q) ||
        v.transporterMobile.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.vehicleClass.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      vehicles = vehicles.filter((v) => v.status.toLowerCase() === status.toLowerCase());
    }

    const { records, pagination } = paginate(vehicles, page, limit);
    return { success: true, data: { vehicles: records, pagination } };
  },

  // 2. Verify / reject vehicle commercial papers (RC Book, insurance, fitness)
  async verifyVehicle({
    vehicleId,
    approved,
    docs = {},
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative verification rationale (min 8 characters) is required for audit compliance.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const vehicles = getStored(VEHICLES_STORAGE_KEY, INITIAL_VEHICLES);
    const index = vehicles.findIndex((v) => v.id === vehicleId);
    if (index === -1) throw new Error(`Vehicle ${vehicleId} not found`);

    const vehicle = vehicles[index];
    const prevState = vehicle.status;

    if (docs.rcBook !== undefined) vehicle.rcBook.verified = docs.rcBook;
    if (docs.commercialInsurance !== undefined) vehicle.commercialInsurance.verified = docs.commercialInsurance;
    if (docs.fitnessCertificate !== undefined) vehicle.fitnessCertificate.verified = docs.fitnessCertificate;

    if (approved) {
      vehicle.status = 'verified';
    } else {
      vehicle.status = 'rejected';
    }

    vehicle.updatedAt = new Date().toISOString();
    vehicles[index] = vehicle;
    save(VEHICLES_STORAGE_KEY, vehicles);

    const audit = recordAuditLog({
      adminUid,
      action: approved ? 'VEHICLE_COMMERCIAL_PAPERS_VERIFIED' : 'VEHICLE_REGISTRATION_REJECTED',
      targetUserId: vehicle.transporterId,
      targetUserName: `${vehicle.transporterName} (${vehicle.registrationNumber})`,
      previousState: `Vehicle ${vehicle.id} status: ${prevState}`,
      newState: `Vehicle ${vehicle.id} status: ${vehicle.status} (RC:${vehicle.rcBook.verified ? 'OK' : 'PEND'}, INS:${vehicle.commercialInsurance.verified ? 'OK' : 'PEND'}, FC:${vehicle.fitnessCertificate.verified ? 'OK' : 'PEND'})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Vehicle ${vehicleId} ${approved ? 'verified and activated for dispatch' : 'rejected'}.`,
      vehicle,
      auditRecord: audit
    };
  },

  // 3. Suspend / reinstate a vehicle from live dispatch
  async setVehicleDispatchability({
    vehicleId,
    suspended,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative explanation (min 8 characters) is required.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const vehicles = getStored(VEHICLES_STORAGE_KEY, INITIAL_VEHICLES);
    const index = vehicles.findIndex((v) => v.id === vehicleId);
    if (index === -1) throw new Error(`Vehicle ${vehicleId} not found`);

    const vehicle = vehicles[index];
    const prevState = vehicle.status;

    vehicle.status = suspended ? 'suspended' : 'verified';
    vehicle.updatedAt = new Date().toISOString();
    vehicles[index] = vehicle;
    save(VEHICLES_STORAGE_KEY, vehicles);

    const audit = recordAuditLog({
      adminUid,
      action: suspended ? 'VEHICLE_REMOVED_FROM_DISPATCH' : 'VEHICLE_REINSTATED_FOR_DISPATCH',
      targetUserId: vehicle.transporterId,
      targetUserName: `${vehicle.transporterName} (${vehicle.registrationNumber})`,
      previousState: `Vehicle ${vehicle.id} status: ${prevState}`,
      newState: `Vehicle ${vehicle.id} status: ${vehicle.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Vehicle ${vehicleId} ${suspended ? 'pulled from live dispatch' : 'reinstated for dispatch'}.`,
      vehicle,
      auditRecord: audit
    };
  },

  // 4. List active and historical bookings
  async listBookings({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_TRANSPORT_BOOKINGS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      bookings = bookings.filter((b) =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerMobile.toLowerCase().includes(q) ||
        (b.transporterName && b.transporterName.toLowerCase().includes(q)) ||
        b.pickupPoint.village.toLowerCase().includes(q) ||
        b.dropPoint.mandi.toLowerCase().includes(q) ||
        b.dropPoint.district.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      bookings = bookings.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    const { records, pagination } = paginate(bookings, page, limit);
    return { success: true, data: { bookings: records, pagination } };
  },

  // 5. Manual intervention in trip status (PUT /v1/admin/transport/bookings/{id}/status)
  async updateBookingStatus({
    bookingId,
    newStatus,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Manual trip status override requires an audit justification (min 8 characters).');
    }

    await new Promise((r) => setTimeout(r, 150));
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_TRANSPORT_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = bookings[index];
    const prevStatus = booking.status;

    booking.status = newStatus;
    if (newStatus === 'cancelled') {
      booking.paymentStatus = booking.paymentStatus === 'paid' ? 'refunded' : 'pending';
    }
    booking.updatedAt = new Date().toISOString();
    bookings[index] = booking;
    save(BOOKINGS_STORAGE_KEY, bookings);

    const audit = recordAuditLog({
      adminUid,
      action: 'TRANSPORT_BOOKING_STATUS_OVERRIDDEN',
      targetUserId: booking.userId,
      targetUserName: `${booking.customerName} (${booking.id})`,
      previousState: `Booking ${booking.id} status: ${prevStatus}`,
      newState: `Booking ${booking.id} status: ${newStatus}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Booking ${bookingId} status changed from ${prevStatus} to ${newStatus}.`,
      booking,
      auditRecord: audit
    };
  },

  // 6. Arbitrate booking disputes, no-shows and breakdown incidents
  async arbitrateBookingDispute({
    bookingId,
    resolutionType,
    refundAmount = 0,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Formal arbitration reasoning (min 8 characters) is mandatory for dispute resolution.');
    }

    await new Promise((r) => setTimeout(r, 200));
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_TRANSPORT_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = bookings[index];
    const prevStatus = booking.status;

    if (resolutionType === 'uphold_farmer') {
      // Transporter penalized; customer refunded
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.disputeReason = `Resolved in favor of customer; refund of ₹${Number(refundAmount || booking.fareAmount).toLocaleString('en-IN')}: ${reason.trim()}`;
    } else if (resolutionType === 'uphold_transporter') {
      // Trip confirmed complete; dispute closed
      booking.status = booking.pod?.submitted ? 'completed' : 'delivered';
      booking.disputeReason = `Resolved in favor of transporter: ${reason.trim()}`;
    } else if (resolutionType === 'partial_compensation') {
      booking.status = 'completed';
      booking.disputeReason = `Partial compensation of ₹${Number(refundAmount).toLocaleString('en-IN')} awarded to customer: ${reason.trim()}`;
    }

    booking.updatedAt = new Date().toISOString();
    bookings[index] = booking;
    save(BOOKINGS_STORAGE_KEY, bookings);

    const audit = recordAuditLog({
      adminUid,
      action: 'TRANSPORT_DISPUTE_ARBITRATED',
      targetUserId: booking.userId,
      targetUserName: `${booking.customerName} vs ${booking.transporterName || 'Unassigned'} (${booking.id})`,
      previousState: `Booking ${booking.id} status: ${prevStatus}`,
      newState: `Resolution: ${resolutionType} (Booking status: ${booking.status})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Dispute on booking ${bookingId} resolved via ${resolutionType}.`,
      booking,
      auditRecord: audit
    };
  },

  // 7. List transporter settlements / payout ledger
  async listSettlements({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let settlements = getStored(SETTLEMENTS_STORAGE_KEY, INITIAL_TRANSPORTER_SETTLEMENTS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      settlements = settlements.filter((s) =>
        s.id.toLowerCase().includes(q) ||
        s.transporterName.toLowerCase().includes(q) ||
        s.bookingId.toLowerCase().includes(q) ||
        s.payoutMode.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      settlements = settlements.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    const { records, pagination } = paginate(settlements, page, limit);
    return { success: true, data: { settlements: records, pagination } };
  },

  // 8. Audit POD documentation and release transporter payout
  async auditPodAndReleasePayout({
    settlementId,
    approved,
    adminUid = 'root@agrovercity',
    secondSignOffBy = null,
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('POD audit rationale (min 8 characters) is mandatory before releasing payout.');
    }

    await new Promise((r) => setTimeout(r, 200));
    const settlements = getStored(SETTLEMENTS_STORAGE_KEY, INITIAL_TRANSPORTER_SETTLEMENTS);
    const index = settlements.findIndex((s) => s.id === settlementId);
    if (index === -1) throw new Error(`Settlement ${settlementId} not found`);

    const settlement = settlements[index];
    const prevPodStatus = settlement.podAuditStatus;

    if (!approved) {
      settlement.podAuditStatus = 'rejected';
      settlement.status = 'cancelled';
    } else {
      settlement.podAuditStatus = 'approved';

      // SOP-08 Rule 3: payouts exceeding ₹50,000 require dual-admin sign-off
      const requiresDualSignOff = settlement.payoutAmount > DUAL_SIGNOFF_THRESHOLD;
      if (requiresDualSignOff) {
        const existingSignOffs = settlement.signOffs || [];
        const signOffs = [
          ...existingSignOffs.filter((s) => s.adminUid !== adminUid),
          { adminUid, signedAt: new Date().toISOString() }
        ];
        settlement.signOffs = signOffs;
        if (signOffs.length < 2) {
          settlement.status = 'approved';
          save(SETTLEMENTS_STORAGE_KEY, settlements);
          const audit = recordAuditLog({
            adminUid,
            action: 'POD_AUDITED_FIRST_SIGN_OFF',
            targetUserId: settlement.transporterId,
            targetUserName: `${settlement.transporterName} (${settlement.id})`,
            previousState: `POD status: ${prevPodStatus}`,
            newState: `POD approved; dual sign-off pending (1/2) for ₹${settlement.payoutAmount.toLocaleString('en-IN')}`,
            reason: reason.trim()
          });
          return {
            success: true,
            message: `POD approved. Payout of ₹${settlement.payoutAmount.toLocaleString('en-IN')} exceeds ₹50,000 — second superadmin sign-off required before release (1/2 recorded).`,
            settlement,
            auditRecord: audit
          };
        }
      }

      settlement.podAuditStatus = 'released';
      settlement.status = 'paid';
      const signOffs = settlement.signOffs || [];
      if (!signOffs.some((s) => s.adminUid === adminUid)) {
        settlement.signOffs = [...signOffs, { adminUid, signedAt: new Date().toISOString() }];
      }
    }

    settlement.updatedAt = new Date().toISOString();
    settlements[index] = settlement;
    save(SETTLEMENTS_STORAGE_KEY, settlements);

    const audit = recordAuditLog({
      adminUid,
      action: approved ? 'TRANSPORTER_PAYOUT_RELEASED' : 'POD_AUDIT_REJECTED',
      targetUserId: settlement.transporterId,
      targetUserName: `${settlement.transporterName} (${settlement.id})`,
      previousState: `POD status: ${prevPodStatus}`,
      newState: `POD status: ${settlement.podAuditStatus}; settlement: ${settlement.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: approved
        ? `Payout of ₹${settlement.payoutAmount.toLocaleString('en-IN')} released to ${settlement.transporterName}.`
        : `POD documentation for settlement ${settlementId} rejected; payout withheld.`,
      settlement,
      auditRecord: audit
    };
  },

  // 9. Compute module KPIs
  async getTransportKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const vehicles = getStored(VEHICLES_STORAGE_KEY, INITIAL_VEHICLES);
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_TRANSPORT_BOOKINGS);
    const settlements = getStored(SETTLEMENTS_STORAGE_KEY, INITIAL_TRANSPORTER_SETTLEMENTS);

    const pendingVerification = vehicles.filter((v) => v.status === 'pending_verification').length;
    const verifiedVehicles = vehicles.filter((v) => v.status === 'verified');
    const liveTransits = bookings.filter((b) => b.status === 'in_transit');
    const disputes = bookings.filter((b) => b.status === 'disputed' || b.status === 'no_show');
    const pendingAudits = settlements.filter((s) => s.podAuditStatus === 'pending_audit');

    const today = new Date().toISOString().slice(0, 10);
    const todayBookings = bookings.filter((b) => (b.createdAt || '').slice(0, 10) === today);

    const pendingPayoutValue = settlements
      .filter((s) => s.podAuditStatus === 'pending_audit' || s.status === 'approved')
      .reduce((acc, s) => acc + (s.payoutAmount || 0), 0);

    return {
      totalVehicles: vehicles.length,
      verifiedVehiclesCount: verifiedVehicles.length,
      pendingVerificationCount: pendingVerification,
      liveTransitCount: liveTransits.length,
      todayBookingCount: todayBookings.length,
      disputeCount: disputes.length,
      pendingAuditCount: pendingAudits.length,
      pendingPayoutValue,
      suspendedCount: vehicles.filter((v) => v.status === 'suspended').length
    };
  },

  // 10. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSPORT_BOOKINGS));
    localStorage.setItem(SETTLEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSPORTER_SETTLEMENTS));
    return { success: true };
  }
};
