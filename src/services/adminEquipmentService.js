// Admin Equipment Rental & Yantra Time-Slots Service for AGROVERCITY Superadmin
// Implements Module 09: Equipment Rental & Yantra Time-Slots (SOP-09)
// Target Collections: equipment, equipment_slots, equipment_bookings, audit_logs

import {
  INITIAL_EQUIPMENT,
  INITIAL_EQUIPMENT_SLOTS,
  INITIAL_EQUIPMENT_BOOKINGS
} from './mockData';

const EQUIPMENT_STORAGE_KEY = 'agrovercity_superadmin_equipment';
const SLOTS_STORAGE_KEY = 'agrovercity_superadmin_equipment_slots';
const BOOKINGS_STORAGE_KEY = 'agrovercity_superadmin_equipment_bookings';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

// Dual-admin sign-off threshold for financial overrides (SOP-09 Rule 3)
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
    targetUserId: targetUserId || 'EQUIPMENT_SYSTEM',
    targetUserName: targetUserName || 'Yantra Slot Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Equipment module intervention via Superadmin Console (SOP-09)',
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

export const adminEquipmentService = {
  // 1. List machinery inventory with owner details (GET /v1/admin/equipment)
  async listEquipment({ query = '', status = 'all', ownerType = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      machines = machines.filter((m) =>
        matchesQuery(m, q, ['id', 'ownerName', 'ownerMobile', 'name', 'type', 'district', 'village', 'fpoName'])
      );
    }
    if (status && status !== 'all') {
      machines = machines.filter((m) => m.status === status);
    }
    if (ownerType && ownerType !== 'all') {
      machines = machines.filter((m) => m.ownerType === ownerType);
    }

    const { records, pagination } = paginate(machines, page, limit);
    return { success: true, data: { machines: records, pagination } };
  },

  // 2. Verify commercial machinery papers + operator licensing (PUT /v1/admin/equipment/{id}/verify)
  async verifyEquipment({
    equipmentId,
    approved,
    docs = {},
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative verification rationale (min 8 characters) is required for audit compliance.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);
    const index = machines.findIndex((m) => m.id === equipmentId);
    if (index === -1) throw new Error(`Machine ${equipmentId} not found`);

    const machine = machines[index];
    const prevState = machine.status;

    if (docs.rcDocument !== undefined) machine.rcDocument.verified = docs.rcDocument;
    if (docs.insuranceDocument !== undefined) machine.insuranceDocument.verified = docs.insuranceDocument;
    if (docs.operatorLicense !== undefined) machine.operatorLicense.verified = docs.operatorLicense;

    machine.status = approved ? 'verified' : 'rejected';
    machine.updatedAt = new Date().toISOString();
    machines[index] = machine;
    save(EQUIPMENT_STORAGE_KEY, machines);

    const audit = recordAuditLog({
      adminUid,
      action: approved ? 'EQUIPMENT_VERIFIED_FOR_PUBLIC_BOOKING' : 'EQUIPMENT_REGISTRATION_REJECTED',
      targetUserId: machine.ownerId,
      targetUserName: `${machine.ownerName} (${machine.name})`,
      previousState: `Machine ${machine.id} status: ${prevState}`,
      newState: `Machine ${machine.id} status: ${machine.status} (RC:${machine.rcDocument.verified ? 'OK' : 'PEND'}, INS:${machine.insuranceDocument.verified ? 'OK' : 'PEND'}, LIC:${machine.operatorLicense.verified ? 'OK' : 'PEND'})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Machine ${equipmentId} ${approved ? 'approved for public Yantra booking' : 'rejected'}.`,
      machine,
      auditRecord: audit
    };
  },

  // 3. Suspend / reinstate a machine from booking pool
  async setMachineBookability({
    equipmentId,
    suspended,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative explanation (min 8 characters) is required.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);
    const index = machines.findIndex((m) => m.id === equipmentId);
    if (index === -1) throw new Error(`Machine ${equipmentId} not found`);

    const machine = machines[index];
    const prevState = machine.status;

    machine.status = suspended ? 'suspended' : 'verified';
    machine.updatedAt = new Date().toISOString();
    machines[index] = machine;
    save(EQUIPMENT_STORAGE_KEY, machines);

    const audit = recordAuditLog({
      adminUid,
      action: suspended ? 'EQUIPMENT_REMOVED_FROM_BOOKING_POOL' : 'EQUIPMENT_REINSTATED_FOR_BOOKING',
      targetUserId: machine.ownerId,
      targetUserName: `${machine.ownerName} (${machine.name})`,
      previousState: `Machine ${machine.id} status: ${prevState}`,
      newState: `Machine ${machine.id} status: ${machine.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Machine ${equipmentId} ${suspended ? 'pulled from the Yantra booking pool' : 'reinstated for booking'}.`,
      machine,
      auditRecord: audit
    };
  },

  // 4. List materialized Yantra slots and waitlists
  async listSlots({ query = '', status = 'all', anomalyOnly = false, page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      slots = slots.filter((s) =>
        matchesQuery(s, q, ['id', 'equipmentId', 'equipmentName', 'ownerName', 'bookedByName', 'date', 'slotName', 'recommendedTask'])
      );
    }
    if (status && status !== 'all') {
      slots = slots.filter((s) => s.status === status);
    }
    if (anomalyOnly) {
      slots = slots.filter((s) => Boolean(s.anomaly));
    }

    const { records, pagination } = paginate(slots, page, limit);
    return { success: true, data: { slots: records, pagination } };
  },

  // 5. List slot bookings and waitlists (GET /v1/admin/equipment/bookings)
  async listBookings({ query = '', status = 'all', ownerType = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      bookings = bookings.filter((b) =>
        matchesQuery(b, q, ['id', 'farmerName', 'farmerMobile', 'farmerId', 'equipmentId', 'equipmentName', 'date', 'slotName'])
      );
    }
    if (status && status !== 'all') {
      bookings = bookings.filter((b) => b.status === status);
    }
    if (ownerType && ownerType !== 'all') {
      bookings = bookings.filter((b) => b.ownerType === ownerType);
    }

    const { records, pagination } = paginate(bookings, page, limit);
    return { success: true, data: { bookings: records, pagination } };
  },

  // 6. Admin force cancellation with refund (DELETE /v1/admin/equipment/bookings/{id})
  //    Releases the slot (or promotes the first waitlisted farmer) and resolves double-booking anomalies.
  async forceCancelBooking({
    bookingId,
    refundAmount,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Force cancellation requires an audit justification (min 8 characters).');
    }

    await new Promise((r) => setTimeout(r, 180));
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = bookings[index];
    if (booking.status === 'cancelled') throw new Error(`Booking ${bookingId} is already cancelled.`);
    const prevStatus = booking.status;

    booking.status = 'cancelled';
    booking.refundAmount = Number(refundAmount) || 0;
    booking.cancelReason = `Admin force cancellation: ${reason.trim()}`;

    if (booking.damageReport?.depositAction === 'pending') {
      booking.damageReport.depositAction = 'cancelled_with_refund';
    }

    // Release the slot; promote first waitlisted farmer to pending booking request
    const slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);
    const slotIndex = slots.findIndex((s) => s.id === booking.slotId);
    let waitlistPromoted = null;
    if (slotIndex !== -1) {
      const slot = slots[slotIndex];
      if (slot.bookedBy === booking.farmerId || slot.id === booking.slotId) {
        const [next, ...rest] = slot.waitlist || [];
        if (slot.anomaly === 'double_booked') {
          const remainingBookings = bookings.filter(
            (b) => b.slotId === slot.id && b.status === 'confirmed' && b.id !== booking.id
          );
          slot.anomaly = remainingBookings.length > 1 ? 'double_booked' : null;
        }
        if (next && slot.status === 'booked' && !slot.anomaly) {
          slot.status = 'pending';
          slot.bookedBy = next.userId;
          slot.bookedByName = next.name;
          slot.waitlist = rest;
          waitlistPromoted = next.name;
        } else if (slot.bookedBy === booking.farmerId) {
          slot.status = 'available';
          slot.bookedBy = null;
          slot.bookedByName = null;
          slot.waitlist = rest;
        }
        slot.updatedAt = new Date().toISOString();
        slots[slotIndex] = slot;
        save(SLOTS_STORAGE_KEY, slots);
      }
    }

    booking.updatedAt = new Date().toISOString();
    bookings[index] = booking;
    save(BOOKINGS_STORAGE_KEY, bookings);

    const audit = recordAuditLog({
      adminUid,
      action: 'EQUIPMENT_BOOKING_FORCE_CANCELLED',
      targetUserId: booking.farmerId,
      targetUserName: `${booking.farmerName} (${booking.id})`,
      previousState: `Booking ${booking.id} status: ${prevStatus}`,
      newState: `Booking ${booking.id} status: cancelled; refund ₹${booking.refundAmount.toLocaleString('en-IN')}${waitlistPromoted ? `; waitlist promoted ${waitlistPromoted}` : ''}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Booking ${bookingId} force-cancelled. Refund of ₹${booking.refundAmount.toLocaleString('en-IN')} queued.${waitlistPromoted ? ` Waitlisted farmer ${waitlistPromoted} promoted.` : ''}`,
      booking,
      auditRecord: audit
    };
  },

  // 7. Handle machinery damage report / security deposit forfeiture
  async resolveDamageReport({
    bookingId,
    resolution, // 'forfeit_full' | 'forfeit_partial' | 'release_deposit'
    amount = 0,
    adminUid = 'root@agrovercity',
    secondSignOffBy = null,
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Damage resolution reasoning (min 8 characters) is mandatory for audit compliance.');
    }

    await new Promise((r) => setTimeout(r, 200));
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error(`Booking ${bookingId} not found`);

    const booking = bookings[index];
    if (!booking.damageReport?.reported) throw new Error(`No damage report recorded on booking ${bookingId}.`);

    const deposit = booking.securityDeposit || 0;
    const forfeited = resolution === 'forfeit_full' ? deposit : resolution === 'forfeit_partial' ? Math.min(Number(amount) || 0, deposit) : 0;

    // SOP-09 Rule 3: deposit forfeitures exceeding ₹50,000 require dual-admin sign-off
    if (forfeited > DUAL_SIGNOFF_THRESHOLD) {
      const existingSignOffs = booking.signOffs || [];
      const signOffs = [
        ...existingSignOffs.filter((s) => s.adminUid !== adminUid),
        { adminUid, signedAt: new Date().toISOString() }
      ];
      booking.signOffs = signOffs;
      booking.updatedAt = new Date().toISOString();
      bookings[index] = booking;
      save(BOOKINGS_STORAGE_KEY, bookings);

      const audit = recordAuditLog({
        adminUid,
        action: 'DEPOSIT_FORFEITURE_FIRST_SIGN_OFF',
        targetUserId: booking.farmerId,
        targetUserName: `${booking.farmerName} (${booking.id})`,
        previousState: `Deposit action: ${booking.damageReport.depositAction}`,
        newState: `Forfeiture of ₹${forfeited.toLocaleString('en-IN')} proposed; dual sign-off pending (1/2)`,
        reason: reason.trim()
      });

      return {
        success: true,
        requiresSecondSignOff: true,
        message: `Forfeiture of ₹${forfeited.toLocaleString('en-IN')} exceeds ₹50,000 — second superadmin sign-off required before execution (1/2 recorded).`,
        booking,
        auditRecord: audit
      };
    }

    const prevAction = booking.damageReport.depositAction;
    booking.damageReport.depositAction = resolution;
    booking.damageReport.forfeitedAmount = forfeited;
    booking.damageReport.resolvedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();
    bookings[index] = booking;
    save(BOOKINGS_STORAGE_KEY, bookings);

    const audit = recordAuditLog({
      adminUid,
      action: 'DAMAGE_REPORT_RESOLVED',
      targetUserId: booking.farmerId,
      targetUserName: `${booking.farmerName} (${booking.id})`,
      previousState: `Deposit action: ${prevAction}`,
      newState: `Deposit action: ${resolution} (forfeited ₹${forfeited.toLocaleString('en-IN')} of ₹${deposit.toLocaleString('en-IN')})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message:
        resolution === 'release_deposit'
          ? `Security deposit of ₹${deposit.toLocaleString('en-IN')} released back to ${booking.farmerName}.`
          : `Security deposit forfeiture of ₹${forfeited.toLocaleString('en-IN')} recorded for booking ${bookingId}.`,
      booking,
      auditRecord: audit
    };
  },

  // 8. Compute module KPIs
  async getEquipmentKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);
    const slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);

    const verified = machines.filter((m) => m.status === 'verified');
    const pending = machines.filter((m) => m.status === 'pending_verification');
    const fpoMachines = machines.filter((m) => m.ownerType === 'fpo');
    const today = new Date().toISOString().slice(0, 10);
    const todayBookings = bookings.filter((b) => b.date === today);
    const doubleBookedSlots = slots.filter((s) => s.anomaly === 'double_booked');
    const pendingDamageReports = bookings.filter(
      (b) => b.damageReport?.reported && b.damageReport?.depositAction === 'pending'
    );
    const depositAtStake = pendingDamageReports.reduce((acc, b) => acc + (b.securityDeposit || 0), 0);
    const avgUtilization = machines.length
      ? Math.round(machines.reduce((acc, m) => acc + (m.utilizationPercent || 0), 0) / machines.length)
      : 0;

    return {
      totalMachines: machines.length,
      verifiedMachinesCount: verified.length,
      pendingVerificationCount: pending.length,
      fpoMachineCount: fpoMachines.length,
      privateMachineCount: machines.length - fpoMachines.length,
      avgUtilizationPercent: avgUtilization,
      todayBookingCount: todayBookings.length,
      doubleBookedSlotCount: doubleBookedSlots.length,
      pendingDamageReportCount: pendingDamageReports.length,
      depositAtStakeValue: depositAtStake,
      suspendedCount: machines.filter((m) => m.status === 'suspended').length
    };
  },

  // 9. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT_SLOTS));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT_BOOKINGS));
    return { success: true };
  }
};
