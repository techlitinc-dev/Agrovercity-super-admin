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
