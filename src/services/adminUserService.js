// Admin User Service for AGROVERCITY Superadmin
// Implements Module 02: User Profiles & Multi-Persona Management (SOP-02)
// Target Collections: users, users/{uid}/role_profiles, users/{uid}/bookings, audit_logs

import { INITIAL_USERS, INITIAL_AUDIT_LOGS, PERSONA_TYPES } from './mockData';

const USERS_STORAGE_KEY = 'agrovercity_superadmin_users';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

function getStoredUsers() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    const parsed = JSON.parse(data);
    // Ensure all users have roleProfiles & farmPolygon initialized
    return parsed.map((u) => {
      const initial = INITIAL_USERS.find((init) => init.uid === u.uid || init.id === u.id);
      return {
        ...initial,
        ...u,
        roleProfiles: u.roleProfiles || initial?.roleProfiles || {},
        farmPolygon: u.farmPolygon !== undefined ? u.farmPolygon : initial?.farmPolygon,
        bookings: u.bookings || initial?.bookings || [],
        language: u.language || initial?.language || 'en',
        womenMode: u.womenMode !== undefined ? u.womenMode : initial?.womenMode || false,
        displaySettings: u.displaySettings || initial?.displaySettings || {
          theme: 'dark',
          highContrast: false,
          density: 'comfortable',
          fontScale: 'normal'
        },
        activePersona: u.activePersona || u.persona || 'Farmer',
        primaryPersona: u.primaryPersona || u.persona || 'Farmer'
      };
    });
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

function recordAuditLog({ adminUid = 'root@agrovercity', action, targetUserId, targetUserName, previousState, newState, reason }) {
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    adminUid,
    action,
    targetUserId,
    targetUserName,
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Administrative intervention via Superadmin Console (SOP-02)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9' // Superadmin interface IP
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminUserService = {
  // GET /v1/admin/users
  // Search & paginate all users with persona filters
  async listUsers({ query = '', status = 'all', persona = 'all', dateRange = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 120));

    let users = getStoredUsers();

    // 1. Filter by query
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      users = users.filter((u) => {
        const nameMatch = u.name && u.name.toLowerCase().includes(q);
        const mobileMatch = u.mobile && u.mobile.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
        const idMatch = u.id && u.id.toLowerCase().includes(q);
        const uidMatch = u.uid && u.uid.toLowerCase().includes(q);
        const emailMatch = u.email && u.email.toLowerCase().includes(q);
        const cityMatch = u.geoCity && u.geoCity.toLowerCase().includes(q);
        const farmMatch = u.farmPolygon && (
          (u.farmPolygon.title && u.farmPolygon.title.toLowerCase().includes(q)) ||
          (u.farmPolygon.surveyNumber && u.farmPolygon.surveyNumber.toLowerCase().includes(q))
        );
        return nameMatch || mobileMatch || idMatch || uidMatch || emailMatch || cityMatch || farmMatch;
      });
    }

    // 2. Filter by status
    if (status && status !== 'all') {
      users = users.filter((u) => u.status && u.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Filter by persona (checks linked personas in roleProfiles or active/primary)
    if (persona && persona !== 'all') {
      users = users.filter((u) => {
        if (!u.roleProfiles) return false;
        const profile = u.roleProfiles[persona];
        return (profile && profile.linked) || u.activePersona === persona || u.primaryPersona === persona;
      });
    }

    // 4. Filter by date range
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let days = 30;
      if (dateRange === '24h') days = 1;
      else if (dateRange === '7d') days = 7;
      else if (dateRange === '30d') days = 30;
      else if (dateRange === '90d') days = 90;

      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      users = users.filter((u) => new Date(u.createdAt) >= cutoff || new Date(u.updatedAt) >= cutoff);
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // GET /v1/admin/users/{uid}
  // Get full profile details and linked personas
  async getUserByUid(uid) {
    await new Promise((r) => setTimeout(r, 80));
    const users = getStoredUsers();
    const user = users.find((u) => u.uid === uid || u.id === uid);
    if (!user) {
      throw new Error(`User with UID/ID ${uid} not found`);
    }
    return { success: true, data: user };
  },

  // PUT /v1/admin/users/{uid}/status
  // Set user account status
  async updateStatus({ uid, status, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 180));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevStatus = user.status;

    user.status = status;
    user.updatedAt = new Date().toISOString();

    if (status === 'verified') {
      user.failedLoginAttempts = 0;
    }

    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'UPDATE_ACCOUNT_STATUS',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: prevStatus,
      newState: status,
      reason: reason || `Changed account status from ${prevStatus} to ${status}`
    });

    return {
      success: true,
      message: `Account status for ${user.name} changed to '${status}'.`,
      auditRecord: audit,
      user
    };
  },

  // PUT /v1/admin/users/{uid}/personas
  // Manage user linked personas (link, unlink, set primary, set active, update role details)
  async managePersonas({ uid, persona, action, profileData = {}, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    if (!user.roleProfiles) user.roleProfiles = {};

    let auditAction = 'PERSONA_MODIFIED';
    let previousState = '';
    let newState = '';

    if (action === 'link') {
      previousState = user.roleProfiles[persona]?.linked ? 'Linked' : 'Not Linked';
      user.roleProfiles[persona] = {
        ...user.roleProfiles[persona],
        ...profileData,
        linked: true,
        status: profileData.status || 'verified',
        verificationDate: new Date().toISOString()
      };
      newState = `Linked (${user.roleProfiles[persona].status})`;
      auditAction = 'PERSONA_LINKED';

      // If user has no primary persona yet, make this primary
      if (!user.primaryPersona) {
        user.primaryPersona = persona;
      }
    } else if (action === 'unlink') {
      previousState = `Linked: ${persona}`;
      if (user.roleProfiles[persona]) {
        user.roleProfiles[persona].linked = false;
        user.roleProfiles[persona].status = 'inactive';
      }
      newState = `Unlinked: ${persona}`;
      auditAction = 'PERSONA_UNLINKED';

      // If unlinking primary persona, select the first available linked persona
      if (user.primaryPersona === persona) {
        const remaining = Object.keys(user.roleProfiles).find(
          (p) => p !== persona && user.roleProfiles[p]?.linked
        );
        user.primaryPersona = remaining || null;
      }
      // If unlinking active persona, switch active
      if (user.activePersona === persona) {
        user.activePersona = user.primaryPersona || 'Farmer';
      }
    } else if (action === 'setPrimary') {
      previousState = `Primary: ${user.primaryPersona || 'None'}`;
      user.primaryPersona = persona;
      // Mark isPrimary flag on roleProfiles
      Object.keys(user.roleProfiles).forEach((p) => {
        if (user.roleProfiles[p]) {
          user.roleProfiles[p].isPrimary = (p === persona);
        }
      });
      // Ensure it is linked
      if (user.roleProfiles[persona]) {
        user.roleProfiles[persona].linked = true;
      }
      newState = `Primary: ${persona} ⭐`;
      auditAction = 'PRIMARY_PERSONA_SET';
    } else if (action === 'setActive') {
      previousState = `Active: ${user.activePersona || 'None'}`;
      user.activePersona = persona;
      newState = `Active: ${persona}`;
      auditAction = 'ACTIVE_PERSONA_SWITCHED';
    } else if (action === 'updateProfile') {
      previousState = JSON.stringify(user.roleProfiles[persona] || {});
      user.roleProfiles[persona] = {
        ...user.roleProfiles[persona],
        ...profileData
      };
      newState = JSON.stringify(user.roleProfiles[persona]);
      auditAction = 'ROLE_PROFILE_UPDATED';
    }

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: auditAction,
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState,
      newState,
      reason: reason || `Administrative persona modification: ${action} on ${persona}`
    });

    return {
      success: true,
      message: `Successfully executed '${action}' for ${persona} on ${user.name}.`,
      auditRecord: audit,
      user
    };
  },

  // GET /v1/admin/users/{uid}/farm-map
  // Get farm boundary polygon coordinates
  async getFarmPolygon(uid) {
    await new Promise((r) => setTimeout(r, 80));
    const users = getStoredUsers();
    const user = users.find((u) => u.uid === uid || u.id === uid);
    if (!user) throw new Error('User not found');
    return {
      success: true,
      data: user.farmPolygon || null
    };
  },

  // PUT /v1/admin/users/{uid}/farm-map
  // Update farm boundary polygon coordinates & metadata
  async updateFarmPolygon({ uid, farmPolygon, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevPolygon = user.farmPolygon
      ? `${user.farmPolygon.title} (${user.farmPolygon.acreage} Acres)`
      : 'No Polygon Mapped';

    user.farmPolygon = {
      ...farmPolygon,
      lastMappedAt: new Date().toISOString(),
      verifiedByAdmin: farmPolygon.verifiedByAdmin !== undefined ? farmPolygon.verifiedByAdmin : true
    };
    user.updatedAt = new Date().toISOString();

    users[index] = user;
    saveUsers(users);

    const newPolygonDesc = `${user.farmPolygon.title || 'Farm Boundary'} (${user.farmPolygon.acreage} Acres, ${user.farmPolygon.coordinates?.length || 0} vertices)`;

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'FARM_POLYGON_UPDATED',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: prevPolygon,
      newState: newPolygonDesc,
      reason: reason || 'Farm satellite geofence polygon updated by Superadmin'
    });

    return {
      success: true,
      message: `Farm boundary polygon saved for ${user.name} (${user.farmPolygon.acreage} Acres).`,
      auditRecord: audit,
      farmPolygon: user.farmPolygon,
      user
    };
  },

  // PUT /v1/admin/users/{uid}/preferences
  // Update user language preferences, womenMode, and display settings
  async updatePreferences({ uid, language, womenMode, displaySettings, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 160));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevState = `Lang: ${user.language || 'en'}, WomenMode: ${!!user.womenMode}`;

    if (language !== undefined) user.language = language;
    if (womenMode !== undefined) user.womenMode = womenMode;
    if (displaySettings) user.displaySettings = { ...user.displaySettings, ...displaySettings };

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const newState = `Lang: ${user.language}, WomenMode: ${!!user.womenMode}`;

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'PREFERENCES_UPDATED',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: prevState,
      newState,
      reason: reason || 'User language, safety womenMode, and display settings updated'
    });

    return {
      success: true,
      message: `Preferences updated for ${user.name}.`,
      auditRecord: audit,
      user
    };
  },

  // GET /v1/admin/users/{uid}/bookings
  async getUserBookings(uid) {
    await new Promise((r) => setTimeout(r, 60));
    const users = getStoredUsers();
    const user = users.find((u) => u.uid === uid || u.id === uid);
    if (!user) throw new Error('User not found');
    return {
      success: true,
      data: user.bookings || []
    };
  },

  // LIST ALL ROLE PROFILES across all users (users/{uid}/role_profiles collection)
  async listAllRoleProfiles({ query = '', persona = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allProfiles = [];

    users.forEach((u) => {
      if (u.roleProfiles) {
        Object.entries(u.roleProfiles).forEach(([personaKey, prof]) => {
          allProfiles.push({
            id: `${u.id}-${personaKey.toLowerCase().replace(/\s+/g, '_')}`,
            userId: u.uid,
            userCode: u.id,
            userName: u.name,
            userMobile: u.mobile,
            userEmail: u.email,
            userCity: u.geoCity || 'Maharashtra, IN',
            persona: personaKey,
            isPrimary: u.primaryPersona === personaKey,
            isActive: u.activePersona === personaKey,
            linked: !!prof.linked,
            status: prof.status || (prof.linked ? 'verified' : 'inactive'),
            verificationDate: prof.verificationDate || u.createdAt,
            rating: prof.rating || 4.5,
            details: prof
          });
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allProfiles = allProfiles.filter((p) => {
        const nameMatch = p.userName && p.userName.toLowerCase().includes(q);
        const mobileMatch = p.userMobile && p.userMobile.includes(q);
        const personaMatch = p.persona && p.persona.toLowerCase().includes(q);
        const cityMatch = p.userCity && p.userCity.toLowerCase().includes(q);
        const codeMatch = p.userCode && p.userCode.toLowerCase().includes(q);
        const detailsJson = JSON.stringify(p.details).toLowerCase();
        return nameMatch || mobileMatch || personaMatch || cityMatch || codeMatch || detailsJson.includes(q);
      });
    }

    if (persona !== 'all') {
      allProfiles = allProfiles.filter((p) => p.persona.toLowerCase() === persona.toLowerCase());
    }

    if (status !== 'all') {
      allProfiles = allProfiles.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    // Sort by primary first, then linked, then name
    allProfiles.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      if (a.linked && !b.linked) return -1;
      if (!a.linked && b.linked) return 1;
      return a.userName.localeCompare(b.userName);
    });

    const total = allProfiles.length;
    const startIndex = (page - 1) * limit;
    const paginated = allProfiles.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        profiles: paginated,
        total,
        verifiedCount: allProfiles.filter((p) => p.status === 'verified').length,
        pendingCount: allProfiles.filter((p) => p.status === 'pending').length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Verify or change status of a single role profile
  async verifyRoleProfile({ uid, persona, status, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    if (!user.roleProfiles) user.roleProfiles = {};
    if (!user.roleProfiles[persona]) {
      user.roleProfiles[persona] = { linked: false, status: 'inactive' };
    }

    const prevStatus = user.roleProfiles[persona].status || 'inactive';
    user.roleProfiles[persona].status = status;
    if (status === 'verified') {
      user.roleProfiles[persona].linked = true;
      user.roleProfiles[persona].verificationDate = new Date().toISOString();
      if (!user.primaryPersona) user.primaryPersona = persona;
    } else if (status === 'inactive' || status === 'rejected') {
      user.roleProfiles[persona].linked = false;
      if (user.primaryPersona === persona) {
        const remaining = Object.keys(user.roleProfiles).find(
          (p) => p !== persona && user.roleProfiles[p]?.linked
        );
        user.primaryPersona = remaining || null;
      }
    }

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'ROLE_PROFILE_VERIFICATION',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `${persona}: ${prevStatus}`,
      newState: `${persona}: ${status}`,
      reason: reason || `Updated role profile status for ${persona} to ${status}`
    });

    return {
      success: true,
      message: `Role profile for ${persona} on ${user.name} is now '${status}'.`,
      auditRecord: audit,
      user
    };
  },

  // LIST ALL BOOKINGS across all users (users/{uid}/bookings collection)
  async listAllBookings({ query = '', status = 'all', persona = 'all', paymentStatus = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allBookings = [];

    users.forEach((u) => {
      if (u.bookings && Array.isArray(u.bookings)) {
        u.bookings.forEach((b) => {
          allBookings.push({
            ...b,
            userId: u.uid,
            userCode: u.id,
            userName: u.name,
            userMobile: u.mobile,
            userEmail: u.email
          });
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allBookings = allBookings.filter((b) => {
        const idMatch = b.id && b.id.toLowerCase().includes(q);
        const nameMatch = b.userName && b.userName.toLowerCase().includes(q);
        const counterpartyMatch = b.counterparty && b.counterparty.toLowerCase().includes(q);
        const serviceMatch = b.service && b.service.toLowerCase().includes(q);
        const mobileMatch = b.userMobile && b.userMobile.includes(q);
        return idMatch || nameMatch || counterpartyMatch || serviceMatch || mobileMatch;
      });
    }

    if (status !== 'all') {
      allBookings = allBookings.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
    }

    if (persona !== 'all') {
      allBookings = allBookings.filter((b) => b.persona?.toLowerCase() === persona.toLowerCase());
    }

    if (paymentStatus !== 'all') {
      allBookings = allBookings.filter((b) => b.paymentStatus?.toLowerCase().includes(paymentStatus.toLowerCase()));
    }

    // Sort by date desc
    allBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = allBookings.length;
    const startIndex = (page - 1) * limit;
    const paginated = allBookings.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        bookings: paginated,
        total,
        disputedCount: allBookings.filter((b) => b.status === 'disputed').length,
        activeCount: allBookings.filter((b) => b.status === 'active' || b.status === 'in-transit').length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Update booking status / dispute resolution
  async updateBookingStatus({ uid, bookingId, status, paymentStatus, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const booking = user.bookings?.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const prevStatus = `${booking.status} (${booking.paymentStatus})`;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    booking.updatedAt = new Date().toISOString();
    booking.adminResolutionReason = reason;

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'BOOKING_DISPUTE_RESOLVED',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: prevStatus,
      newState: `${booking.status} (${booking.paymentStatus})`,
      reason: reason || 'Administrative dispute resolution and escrow update'
    });

    return {
      success: true,
      message: `Booking ${booking.id} updated to '${booking.status}' with payment '${booking.paymentStatus}'.`,
      auditRecord: audit,
      booking,
      user
    };
  },

  // LIST ALL FARM POLYGONS across all farmers & landlords
  async listAllFarmPolygons({ query = '', verified = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allPolygons = [];

    users.forEach((u) => {
      if (u.farmPolygon && typeof u.farmPolygon === 'object') {
        allPolygons.push({
          ...u.farmPolygon,
          userId: u.uid,
          userCode: u.id,
          userName: u.name,
          userMobile: u.mobile,
          userEmail: u.email,
          userCity: u.geoCity || 'Maharashtra, IN',
          primaryPersona: u.primaryPersona || 'Farmer'
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allPolygons = allPolygons.filter((p) => {
        const titleMatch = p.title && p.title.toLowerCase().includes(q);
        const surveyMatch = p.surveyNumber && p.surveyNumber.toLowerCase().includes(q);
        const nameMatch = p.userName && p.userName.toLowerCase().includes(q);
        const districtMatch = p.district && p.district.toLowerCase().includes(q);
        const talukaMatch = p.taluka && p.taluka.toLowerCase().includes(q);
        const villageMatch = p.village && p.village.toLowerCase().includes(q);
        return titleMatch || surveyMatch || nameMatch || districtMatch || talukaMatch || villageMatch;
      });
    }

    if (verified !== 'all') {
      const isVerified = verified === 'verified' || verified === 'true';
      allPolygons = allPolygons.filter((p) => !!p.verifiedByAdmin === isVerified);
    }

    const total = allPolygons.length;
    const startIndex = (page - 1) * limit;
    const paginated = allPolygons.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        polygons: paginated,
        total,
        verifiedCount: allPolygons.filter((p) => p.verifiedByAdmin).length,
        unverifiedCount: allPolygons.filter((p) => !p.verifiedByAdmin).length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Verify or unverify a farm polygon boundary
  async verifyFarmPolygon({ uid, verified, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    if (!user.farmPolygon) throw new Error('User does not have a farm polygon registered');

    const prevVerified = !!user.farmPolygon.verifiedByAdmin;
    user.farmPolygon.verifiedByAdmin = verified;
    user.farmPolygon.lastVerifiedAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: verified ? 'FARM_POLYGON_VERIFIED' : 'FARM_POLYGON_UNVERIFIED',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `Verified: ${prevVerified}`,
      newState: `Verified: ${verified}`,
      reason: reason || (verified ? 'Cadastral Mahabhulekh 7/12 satellite survey verified' : 'Farm polygon verification revoked')
    });

    return {
      success: true,
      message: `Farm boundary polygon for ${user.name} is now ${verified ? 'Verified' : 'Unverified'}.`,
      auditRecord: audit,
      farmPolygon: user.farmPolygon,
      user
    };
  },

  // GET audit logs for target user
  async getUserAuditLogs(targetUserId) {
    await new Promise((r) => setTimeout(r, 60));
    const logs = getStoredAuditLogs();
    if (targetUserId) {
      return logs.filter((l) => l.targetUserId === targetUserId);
    }
    return logs;
  }
};
