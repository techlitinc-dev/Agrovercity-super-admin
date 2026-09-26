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
const BENCHMARKS_STORAGE_KEY = 'agrovercity_superadmin_equipment_benchmarks';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

export const INITIAL_EQUIPMENT_BENCHMARKS = [
  {
    id: 'BM-EQ-01',
    district: 'Kolhapur',
    machineryClass: 'Tractor (45-60 HP)',
    category: 'tractor',
    benchmarkCapHourly: 800,
    fpoPoolAvgHourly: 750,
    privatePoolAvgHourly: 850,
    maxVariancePercent: 20,
    activeCount: 18,
    status: 'compliant',
    lastRevised: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'BM-EQ-02',
    district: 'Kolhapur',
    machineryClass: 'Combine Harvester (Multi-Crop)',
    category: 'harvester',
    benchmarkCapHourly: 2500,
    fpoPoolAvgHourly: 2300,
    privatePoolAvgHourly: 2600,
    maxVariancePercent: 20,
    activeCount: 6,
    status: 'flagged_variance',
    lastRevised: '2026-08-25T11:30:00.000Z'
  },
  {
    id: 'BM-EQ-03',
    district: 'Sangli',
    machineryClass: 'Tractor (45-60 HP)',
    category: 'tractor',
    benchmarkCapHourly: 780,
    fpoPoolAvgHourly: 720,
    privatePoolAvgHourly: 810,
    maxVariancePercent: 20,
    activeCount: 14,
    status: 'compliant',
    lastRevised: '2026-09-05T09:15:00.000Z'
  },
  {
    id: 'BM-EQ-04',
    district: 'Sangli',
    machineryClass: 'Combine Harvester (Multi-Crop)',
    category: 'harvester',
    benchmarkCapHourly: 2400,
    fpoPoolAvgHourly: 2200,
    privatePoolAvgHourly: 2600,
    maxVariancePercent: 20,
    activeCount: 8,
    status: 'flagged_variance',
    lastRevised: '2026-09-10T14:20:00.000Z'
  },
  {
    id: 'BM-EQ-05',
    district: 'Nashik',
    machineryClass: 'Tractor (45-60 HP)',
    category: 'tractor',
    benchmarkCapHourly: 800,
    fpoPoolAvgHourly: 740,
    privatePoolAvgHourly: 840,
    maxVariancePercent: 20,
    activeCount: 22,
    status: 'compliant',
    lastRevised: '2026-09-02T08:45:00.000Z'
  },
  {
    id: 'BM-EQ-06',
    district: 'Nashik',
    machineryClass: 'Laser Land Leveler',
    category: 'laser_leveler',
    benchmarkCapHourly: 950,
    fpoPoolAvgHourly: 900,
    privatePoolAvgHourly: 980,
    maxVariancePercent: 20,
    activeCount: 9,
    status: 'compliant',
    lastRevised: '2026-08-30T16:00:00.000Z'
  },
  {
    id: 'BM-EQ-07',
    district: 'Pune',
    machineryClass: 'Tractor (45-60 HP)',
    category: 'tractor',
    benchmarkCapHourly: 820,
    fpoPoolAvgHourly: 780,
    privatePoolAvgHourly: 860,
    maxVariancePercent: 20,
    activeCount: 16,
    status: 'compliant',
    lastRevised: '2026-09-12T13:10:00.000Z'
  },
  {
    id: 'BM-EQ-08',
    district: 'Pune',
    machineryClass: 'Rotavator (7 ft Heavy Duty)',
    category: 'rotavator',
    benchmarkCapHourly: 500,
    fpoPoolAvgHourly: 450,
    privatePoolAvgHourly: 520,
    maxVariancePercent: 20,
    activeCount: 12,
    status: 'compliant',
    lastRevised: '2026-09-08T11:00:00.000Z'
  },
  {
    id: 'BM-EQ-09',
    district: 'Solapur',
    machineryClass: 'Combine Harvester (Multi-Crop)',
    category: 'harvester',
    benchmarkCapHourly: 2450,
    fpoPoolAvgHourly: 2350,
    privatePoolAvgHourly: 2500,
    maxVariancePercent: 20,
    activeCount: 7,
    status: 'compliant',
    lastRevised: '2026-09-04T15:30:00.000Z'
  },
  {
    id: 'BM-EQ-10',
    district: 'Nagpur',
    machineryClass: 'Agricultural Drone Sprayer (16L)',
    category: 'drone_sprayer',
    benchmarkCapHourly: 650,
    fpoPoolAvgHourly: 580,
    privatePoolAvgHourly: 700,
    maxVariancePercent: 20,
    activeCount: 5,
    status: 'compliant',
    lastRevised: '2026-09-14T09:00:00.000Z'
  }
];

export const INITIAL_EQUIPMENT_AUDIT_LOGS = [
  {
    id: 'AUD-901',
    adminUid: 'root@agrovercity',
    action: 'EQUIPMENT_VERIFIED_FOR_PUBLIC_BOOKING',
    targetUserId: 'USR-2201',
    targetUserName: 'Ram Patil (John Deere 5310 Tractor)',
    previousState: 'Machine EQ-901 status: pending_verification',
    newState: 'Machine EQ-901 status: verified (RC:OK, INS:OK, LIC:OK)',
    reason: 'Verified RTO commercial permit MH09EQ5521 & commercial machinery comprehensive insurance.',
    timestamp: '2026-09-20T10:15:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-902',
    adminUid: 'root@agrovercity',
    action: 'SLOT_DOUBLE_BOOKING_RESOLVED',
    targetUserId: 'USR-1103',
    targetUserName: 'Baburao Kale (EQ-903)',
    previousState: 'Slot EQ-903_2026-09-21_14-18 anomaly: double_booked',
    newState: 'Awarded to Baburao Kale; conflicting booking EQB-904 refunded ₹2,800',
    reason: 'First-timestamp booking priority respected. Farmer 2 granted full automated refund without cancellation fee.',
    timestamp: '2026-09-20T14:30:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-903',
    adminUid: 'root@agrovercity',
    action: 'DAMAGE_REPORT_RESOLVED',
    targetUserId: 'USR-1104',
    targetUserName: 'Sambhaji Shinde (EQB-905)',
    previousState: 'Deposit action: pending',
    newState: 'Deposit action: forfeit_partial (forfeited ₹4,500 of ₹8,000)',
    reason: 'Verified field engineer geo-stamped photo showing bent rotary shaft flange after stony soil operation.',
    timestamp: '2026-09-19T16:45:00.000Z',
    ipAddress: '14.139.122.9'
  },
  {
    id: 'AUD-904',
    adminUid: 'root@agrovercity',
    action: 'BENCHMARK_RATE_OVERRIDDEN',
    targetUserId: 'REG-SANGLI-DISTRICT',
    targetUserName: 'Sangli Harvester Benchmark Band',
    previousState: 'Benchmark cap: ₹2,200/hr',
    newState: 'Benchmark cap: ₹2,400/hr',
    reason: 'APMC Sangli mechanization council quarterly diesel inflation rate index update.',
    timestamp: '2026-09-18T11:20:00.000Z',
    ipAddress: '14.139.122.9'
  }
];

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

  // 8. Onboard new machinery into FPO / Private fleet
  async createEquipment(equipmentData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 160));
    const machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);
    const newId = `EQ-${Date.now().toString().slice(-4)}`;

    const newMachine = {
      id: newId,
      ownerId: equipmentData.ownerId || `USR-${Math.floor(2000 + Math.random() * 8000)}`,
      ownerName: equipmentData.ownerName?.trim() || 'FPO Operator',
      ownerMobile: equipmentData.ownerMobile?.trim() || '+91 98000 00000',
      ownerType: equipmentData.ownerType || 'fpo',
      fpoName: equipmentData.fpoName?.trim() || (equipmentData.ownerType === 'fpo' ? 'Local Agri FPO' : null),
      village: equipmentData.village?.trim() || 'Default Village',
      district: equipmentData.district?.trim() || 'Kolhapur',
      name: equipmentData.name?.trim() || 'Agricultural Machine',
      type: equipmentData.type || 'tractor',
      description: equipmentData.description?.trim() || 'Machinery registered via Superadmin console.',
      hourlyRate: Number(equipmentData.hourlyRate) || 800,
      perAcreRate: equipmentData.perAcreRate ? Number(equipmentData.perAcreRate) : null,
      photoUrl: equipmentData.photoUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80',
      rcDocument: {
        number: equipmentData.rcNumber?.trim() || `MH${Math.floor(10 + Math.random() * 80)}EQ${Math.floor(1000 + Math.random() * 9000)}`,
        verified: Boolean(equipmentData.immediateVerified)
      },
      insuranceDocument: {
        policyNumber: equipmentData.insurancePolicy?.trim() || `POL-${Date.now().toString().slice(-6)}`,
        validTill: equipmentData.insuranceValidTill || '2027-12-31',
        verified: Boolean(equipmentData.immediateVerified)
      },
      operatorLicense: {
        number: equipmentData.licenseNumber?.trim() || `DL-${Date.now().toString().slice(-6)}`,
        validTill: equipmentData.licenseValidTill || '2027-12-31',
        verified: Boolean(equipmentData.immediateVerified)
      },
      utilizationPercent: 0,
      pricingIndexPercent: 100,
      totalBookings: 0,
      rating: 5.0,
      status: equipmentData.immediateVerified ? 'verified' : 'pending_verification',
      createdAt: new Date().toISOString()
    };

    const updated = [newMachine, ...machines];
    save(EQUIPMENT_STORAGE_KEY, updated);

    // Automatically generate today's standard 4-hour Yantra time-slots for this new machine
    const slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);
    const today = new Date().toISOString().slice(0, 10);
    const slotWindows = [
      { name: '06:00-10:00', startMin: 360, endMin: 600, task: 'Tillage' },
      { name: '10:00-14:00', startMin: 600, endMin: 840, task: 'Sowing' },
      { name: '14:00-18:00', startMin: 840, endMin: 1080, task: 'Spraying' },
      { name: '18:00-22:00', startMin: 1080, endMin: 1320, task: 'Leveling' }
    ];
    const newSlots = slotWindows.map((sw) => ({
      id: `${newMachine.id}_${today}_${sw.name.slice(0, 2)}-${sw.name.slice(6, 8)}`,
      equipmentId: newMachine.id,
      equipmentName: newMachine.name,
      ownerName: newMachine.ownerName,
      ownerType: newMachine.ownerType,
      date: today,
      slotName: sw.name,
      startMin: sw.startMin,
      endMin: sw.endMin,
      duration: 240,
      priceRupees: newMachine.hourlyRate * 4,
      recommendedTask: sw.task,
      status: 'available',
      bookedBy: null,
      bookedByName: null,
      waitlist: [],
      anomaly: null,
      createdAt: new Date().toISOString()
    }));
    save(SLOTS_STORAGE_KEY, [...newSlots, ...slots]);

    const audit = recordAuditLog({
      adminUid,
      action: 'EQUIPMENT_ONBOARDED',
      targetUserId: newMachine.ownerId,
      targetUserName: `${newMachine.ownerName} (${newMachine.name})`,
      previousState: 'Non-existent machinery inventory',
      newState: `Added machine ${newMachine.id} [${newMachine.type}, Hourly: ₹${newMachine.hourlyRate}, Status: ${newMachine.status}]`,
      reason: 'Machinery registered into rental sharing fleet via Superadmin console (SOP-09)'
    });

    return {
      success: true,
      message: `Machine ${newMachine.name} (${newMachine.id}) registered successfully into ${newMachine.ownerType.toUpperCase()} fleet.`,
      machine: newMachine,
      auditRecord: audit
    };
  },

  // 9. List Pricing Benchmarks & District Rate Caps (SOP-09 §3)
  async listPricingBenchmarks({ query = '', district = 'all', category = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let benchmarks = getStored(BENCHMARKS_STORAGE_KEY, INITIAL_EQUIPMENT_BENCHMARKS);

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      benchmarks = benchmarks.filter((b) =>
        b.district.toLowerCase().includes(q) ||
        b.machineryClass.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    if (district && district !== 'all') {
      benchmarks = benchmarks.filter((b) => b.district.toLowerCase() === district.toLowerCase());
    }
    if (category && category !== 'all') {
      benchmarks = benchmarks.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    return { success: true, data: { benchmarks } };
  },

  // 10. Update Pricing Benchmark (SOP-09 §3)
  async updatePricingBenchmark({ benchmarkId, newCapRate, maxVariancePercent, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Mandatory administrative rationale (min 8 characters) is required for benchmark cap revision.');
    }
    await new Promise((r) => setTimeout(r, 140));
    const benchmarks = getStored(BENCHMARKS_STORAGE_KEY, INITIAL_EQUIPMENT_BENCHMARKS);
    const index = benchmarks.findIndex((b) => b.id === benchmarkId);
    if (index === -1) throw new Error(`Benchmark ${benchmarkId} not found`);

    const bm = benchmarks[index];
    const prevCap = bm.benchmarkCapHourly;
    bm.benchmarkCapHourly = Number(newCapRate);
    if (maxVariancePercent !== undefined) bm.maxVariancePercent = Number(maxVariancePercent);
    bm.lastRevised = new Date().toISOString();

    // Recompute compliance status against private pool avg
    if (bm.privatePoolAvgHourly > bm.benchmarkCapHourly * (1 + (bm.maxVariancePercent || 20) / 100)) {
      bm.status = 'flagged_variance';
    } else {
      bm.status = 'compliant';
    }

    benchmarks[index] = bm;
    save(BENCHMARKS_STORAGE_KEY, benchmarks);

    const audit = recordAuditLog({
      adminUid,
      action: 'BENCHMARK_RATE_OVERRIDDEN',
      targetUserId: `DISTRICT-${bm.district.toUpperCase()}`,
      targetUserName: `${bm.district} ${bm.machineryClass}`,
      previousState: `Cap: ₹${prevCap}/hr`,
      newState: `Cap: ₹${bm.benchmarkCapHourly}/hr; Max Variance: ${bm.maxVariancePercent}%; Status: ${bm.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `District benchmark for ${bm.district} ${bm.machineryClass} updated to ₹${bm.benchmarkCapHourly}/hr.`,
      benchmark: bm,
      auditRecord: audit
    };
  },

  // 11. Resolve Double-Booking Anomaly on Yantra Time-Slots (SOP-09 §3)
  async resolveSlotAnomaly({ slotId, winningBookingId, conflictingAction = 'refund', adminUid = 'root@agrovercity', reason }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative explanation (min 8 characters) is mandatory to resolve slot anomaly.');
    }
    await new Promise((r) => setTimeout(r, 180));
    const slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);
    const slotIndex = slots.findIndex((s) => s.id === slotId);
    if (slotIndex === -1) throw new Error(`Slot ${slotId} not found`);

    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);
    const slotBookings = bookings.filter((b) => b.slotId === slotId && b.status !== 'cancelled');

    const winningBooking = bookings.find((b) => b.id === winningBookingId);
    if (!winningBooking) throw new Error(`Winning booking ${winningBookingId} not found`);

    const conflictingBookings = slotBookings.filter((b) => b.id !== winningBookingId);

    // Confirm winning booking
    winningBooking.status = 'confirmed';
    winningBooking.updatedAt = new Date().toISOString();

    // Handle conflicting bookings
    conflictingBookings.forEach((cb) => {
      cb.status = 'cancelled';
      cb.refundAmount = cb.priceRupees + (cb.securityDeposit || 0);
      cb.cancelReason = `Slot double-booking resolution: Admin awarded slot to ${winningBooking.farmerName}. Full refund of ₹${cb.refundAmount.toLocaleString('en-IN')} issued.`;
      cb.updatedAt = new Date().toISOString();
    });

    // Update slot
    const slot = slots[slotIndex];
    slot.anomaly = null;
    slot.status = 'booked';
    slot.bookedBy = winningBooking.farmerId;
    slot.bookedByName = winningBooking.farmerName;
    slot.updatedAt = new Date().toISOString();

    slots[slotIndex] = slot;
    save(SLOTS_STORAGE_KEY, slots);
    save(BOOKINGS_STORAGE_KEY, bookings);

    const audit = recordAuditLog({
      adminUid,
      action: 'SLOT_DOUBLE_BOOKING_RESOLVED',
      targetUserId: winningBooking.farmerId,
      targetUserName: `${winningBooking.farmerName} (${slot.id})`,
      previousState: `Slot ${slot.id} anomaly: double_booked`,
      newState: `Awarded to ${winningBooking.farmerName} (${winningBooking.id}); ${conflictingBookings.length} conflict(s) refunded`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Slot anomaly resolved. ${winningBooking.farmerName} confirmed. ${conflictingBookings.length} conflicting booking(s) refunded.`,
      slot,
      auditRecord: audit
    };
  },

  // 12. List Equipment Statutory Audit Logs (SOP-09 Rule 2)
  async listEquipmentAuditLogs({ query = '', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let logs = getStoredAuditLogs();

    if (logs.length === 0) {
      logs = INITIAL_EQUIPMENT_AUDIT_LOGS;
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }

    const equipmentKeywords = [
      'EQUIPMENT',
      'YANTRA',
      'SLOT',
      'MACHINE',
      'DAMAGE',
      'BENCHMARK',
      'DEPOSIT'
    ];

    let filtered = logs.filter((log) =>
      equipmentKeywords.some((kw) => (log.action || '').toUpperCase().includes(kw))
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

  // 13. Compute module KPIs
  async getEquipmentKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const machines = getStored(EQUIPMENT_STORAGE_KEY, INITIAL_EQUIPMENT);
    const slots = getStored(SLOTS_STORAGE_KEY, INITIAL_EQUIPMENT_SLOTS);
    const bookings = getStored(BOOKINGS_STORAGE_KEY, INITIAL_EQUIPMENT_BOOKINGS);
    const benchmarks = getStored(BENCHMARKS_STORAGE_KEY, INITIAL_EQUIPMENT_BENCHMARKS);

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

    const flaggedBenchmarks = benchmarks.filter((b) => b.status === 'flagged_variance');

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
      suspendedCount: machines.filter((m) => m.status === 'suspended').length,
      totalBenchmarksCount: benchmarks.length,
      flaggedVarianceCount: flaggedBenchmarks.length
    };
  },

  // 14. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT_SLOTS));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT_BOOKINGS));
    localStorage.setItem(BENCHMARKS_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT_BENCHMARKS));
    return { success: true };
  }
};
