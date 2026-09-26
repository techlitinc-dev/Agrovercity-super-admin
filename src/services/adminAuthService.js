// Admin Auth Service for AGROVERCITY Superadmin
// Implements endpoints from SOP-01 (docs/superadmin-instructions/01-auth-rbac-and-sessions.md)

import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from './mockData';

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
    let updated = false;
    const enriched = parsed.map((u) => {
      const init = INITIAL_USERS.find((i) => i.id === u.id || i.uid === u.uid);
      if (init) {
        if ((!u.devices || u.devices.length === 0) && init.devices && init.devices.length > 0) {
          u.devices = init.devices;
          updated = true;
        }
        if ((!u.sessions || u.sessions.length === 0) && init.sessions && init.sessions.length > 0) {
          u.sessions = init.sessions;
          updated = true;
        }
        if ((!u.authTokens || u.authTokens.length === 0) && init.authTokens && init.authTokens.length > 0) {
          u.authTokens = init.authTokens;
          updated = true;
        }
      }
      return u;
    });
    if (updated) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(enriched));
    }
    return enriched;
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
    previousState,
    newState,
    reason: reason || 'Administrative intervention via Superadmin Console',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9' // Superadmin interface IP
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminAuthService = {
  // GET /v1/admin/auth/users
  async listUsers({ query = '', status = 'all', persona = 'all', dateRange = '30d', page = 1, limit = 10 } = {}) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 120));

    let users = getStoredUsers();

    // Filter by query (search by name, mobile, id, uid, email)
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      users = users.filter((u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.mobile && u.mobile.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.uid && u.uid.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.geoCity && u.geoCity.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      users = users.filter((u) => u.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by persona
    if (persona && persona !== 'all') {
      users = users.filter((u) => u.persona.toLowerCase() === persona.toLowerCase());
    }

    // Filter by date range (createdAt or lastLoginAt)
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let days = 30;
      if (dateRange === '24h') days = 1;
      else if (dateRange === '7d') days = 7;
      else if (dateRange === '30d') days = 30;
      else if (dateRange === '90d') days = 90;

      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      users = users.filter((u) => new Date(u.createdAt) >= cutoff || new Date(u.lastLoginAt) >= cutoff);
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

  // GET user by UID
  async getUserByUid(uid) {
    await new Promise((r) => setTimeout(r, 80));
    const users = getStoredUsers();
    const user = users.find((u) => u.uid === uid || u.id === uid);
    if (!user) {
      throw new Error('User not found in Authentication collection');
    }
    return { success: true, data: user };
  },

  // POST /v1/admin/auth/users/{uid}/reset-mpin
  async resetMpin({ uid, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevMpin = user.mpinSet ? 'Configured (Active)' : 'Not Set';

    // Generate simulated 6-digit temporary emergency OTP
    const temporaryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Reset MPIN flag to require new setup, reset failed attempts
    user.mpinSet = false;
    user.failedLoginAttempts = 0;
    user.updatedAt = new Date().toISOString();
    user.lastMpinReset = {
      timestamp: new Date().toISOString(),
      dispatchedOtp: temporaryOtp,
      expiresInMinutes: 15,
      adminUid: adminUid || 'root@agrovercity'
    };

    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'ADMIN_MPIN_FORCE_RESET',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: prevMpin,
      newState: 'MPIN invalidated / Temp OTP dispatched',
      reason
    });

    return {
      success: true,
      message: `Emergency OTP ${temporaryOtp} dispatched to ${user.mobile}. MPIN reset state activated.`,
      temporaryOtp,
      auditRecord: audit,
      user
    };
  },

  // POST /v1/admin/auth/users/{uid}/revoke-sessions
  async revokeSessions({ uid, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 200));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const activeSessionsCount = user.sessions.filter((s) => s.active).length;

    // Invalidate all active sessions
    user.sessions = user.sessions.map((s) => ({
      ...s,
      active: false,
      endedAt: new Date().toISOString(),
      revocationReason: reason || 'Superadmin session purge'
    }));

    // Revoke all auth_tokens
    user.authTokens = user.authTokens.map((t) => ({
      ...t,
      status: 'revoked',
      revokedAt: new Date().toISOString()
    }));

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'REVOKE_ALL_SESSIONS',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `${activeSessionsCount} active sessions`,
      newState: '0 active sessions (all JWT tokens revoked)',
      reason
    });

    return {
      success: true,
      message: `Successfully revoked all sessions (${activeSessionsCount} active) and JWT tokens for ${user.name}.`,
      revokedCount: activeSessionsCount,
      auditRecord: audit,
      user
    };
  },

  // Terminate individual session
  async terminateSingleSession({ uid, sessionId, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const session = user.sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session ID not found');

    session.active = false;
    session.endedAt = new Date().toISOString();
    session.revocationReason = reason || 'Admin terminated device session';

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'TERMINATE_DEVICE_SESSION',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `Active on ${session.deviceName} (${session.ipAddress})`,
      newState: 'Session terminated',
      reason
    });

    return {
      success: true,
      message: `Session on ${session.deviceName} has been terminated.`,
      user
    };
  },

  // PUT /v1/admin/auth/users/{uid}/status
  async updateStatus({ uid, status, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 180));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevStatus = user.status;

    user.status = status;
    user.updatedAt = new Date().toISOString();

    // If locked or suspended, reset failed attempts or handle security flags
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
      reason
    });

    return {
      success: true,
      message: `Account status for ${user.name} changed from '${prevStatus}' to '${status}'.`,
      auditRecord: audit,
      user
    };
  },

  // Toggle 2FA or MPIN enforcement flags
  async toggleSecurityFlag({ uid, field, value, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const prevVal = user[field];
    user[field] = value;
    user.updatedAt = new Date().toISOString();

    users[index] = user;
    saveUsers(users);

    const flagName = field === 'twoFactorEnabled' ? 'Two-Factor Authentication (2FA)' : field === 'mpinSet' ? 'MPIN Requirement' : field;

    recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'SECURITY_FLAG_TOGGLE',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `${flagName}: ${prevVal ? 'Enabled' : 'Disabled'}`,
      newState: `${flagName}: ${value ? 'Enabled' : 'Disabled'}`,
      reason
    });

    return {
      success: true,
      message: `${flagName} is now ${value ? 'Enabled' : 'Disabled'} for ${user.name}.`,
      user
    };
  },

  // GET audit logs
  async getAuditLogs(targetUserId = null) {
    await new Promise((r) => setTimeout(r, 100));
    const logs = getStoredAuditLogs();
    if (targetUserId) {
      return logs.filter((l) => l.targetUserId === targetUserId);
    }
    return logs;
  },

  // LIST ALL SESSIONS across all users (sessions collection)
  async listAllSessions({ query = '', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allSessions = [];

    users.forEach((u) => {
      if (u.sessions && Array.isArray(u.sessions)) {
        u.sessions.forEach((s) => {
          allSessions.push({
            ...s,
            userId: u.uid,
            userName: u.name,
            userMobile: u.mobile,
            userEmail: u.email,
            userPersona: u.persona || 'Farmer',
            userStatus: u.status
          });
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allSessions = allSessions.filter((s) =>
        (s.userName && s.userName.toLowerCase().includes(q)) ||
        (s.userMobile && s.userMobile.includes(q)) ||
        (s.ipAddress && s.ipAddress.includes(q)) ||
        (s.deviceName && s.deviceName.toLowerCase().includes(q)) ||
        (s.location && s.location.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q))
      );
    }

    if (status !== 'all') {
      const isActive = status === 'active';
      allSessions = allSessions.filter((s) => s.active === isActive);
    }

    // Sort by startedAt desc
    allSessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

    const total = allSessions.length;
    const startIndex = (page - 1) * limit;
    const paginated = allSessions.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        sessions: paginated,
        total,
        activeCount: allSessions.filter((s) => s.active).length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // LIST ALL DEVICES across all users (devices collection)
  async listAllDevices({ query = '', platform = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allDevices = [];

    users.forEach((u) => {
      if (u.devices && Array.isArray(u.devices)) {
        u.devices.forEach((d) => {
          allDevices.push({
            ...d,
            userId: u.uid,
            userName: u.name,
            userMobile: u.mobile,
            userEmail: u.email,
            userPersona: u.persona || 'Farmer'
          });
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allDevices = allDevices.filter((d) =>
        (d.userName && d.userName.toLowerCase().includes(q)) ||
        (d.deviceName && d.deviceName.toLowerCase().includes(q)) ||
        (d.osVersion && d.osVersion.toLowerCase().includes(q)) ||
        (d.id && d.id.toLowerCase().includes(q))
      );
    }

    if (platform !== 'all') {
      allDevices = allDevices.filter((d) => d.platform?.toLowerCase() === platform.toLowerCase());
    }

    if (status !== 'all') {
      allDevices = allDevices.filter((d) => d.status?.toLowerCase() === status.toLowerCase());
    }

    // Sort by lastActive desc
    allDevices.sort((a, b) => new Date(b.lastActive || b.registeredAt) - new Date(a.lastActive || a.registeredAt));

    const total = allDevices.length;
    const startIndex = (page - 1) * limit;
    const paginated = allDevices.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        devices: paginated,
        total,
        trustedCount: allDevices.filter((d) => d.status === 'trusted').length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Revoke device trust
  async revokeDeviceTrust({ uid, deviceId, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 120));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const dev = user.devices?.find((d) => d.id === deviceId);
    if (!dev) throw new Error('Device not found');

    dev.status = 'revoked';
    dev.revokedAt = new Date().toISOString();

    // Terminate sessions on this device
    if (user.sessions) {
      user.sessions = user.sessions.map((s) =>
        s.deviceId === deviceId ? { ...s, active: false, endedAt: new Date().toISOString(), revocationReason: reason } : s
      );
    }

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'REVOKE_DEVICE_TRUST',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `Device ${dev.deviceName} trusted`,
      newState: `Device ${dev.deviceName} revoked & sessions purged`,
      reason: reason || 'Hardware trust revoked by Superadmin'
    });

    return {
      success: true,
      message: `Device ${dev.deviceName} revoked and associated sessions terminated.`,
      auditRecord: audit,
      user
    };
  },

  // LIST ALL TOKENS across all users (auth_tokens collection)
  async listAllTokens({ query = '', type = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const users = getStoredUsers();
    let allTokens = [];

    users.forEach((u) => {
      if (u.authTokens && Array.isArray(u.authTokens)) {
        u.authTokens.forEach((t) => {
          allTokens.push({
            ...t,
            userId: u.uid,
            userName: u.name,
            userMobile: u.mobile,
            userEmail: u.email
          });
        });
      }
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      allTokens = allTokens.filter((t) =>
        (t.userName && t.userName.toLowerCase().includes(q)) ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.tokenHash && t.tokenHash.toLowerCase().includes(q))
      );
    }

    if (type !== 'all') {
      allTokens = allTokens.filter((t) => t.tokenType?.toLowerCase() === type.toLowerCase());
    }

    if (status !== 'all') {
      allTokens = allTokens.filter((t) => t.status?.toLowerCase() === status.toLowerCase());
    }

    allTokens.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));

    const total = allTokens.length;
    const startIndex = (page - 1) * limit;
    const paginated = allTokens.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        tokens: paginated,
        total,
        activeCount: allTokens.filter((t) => t.status === 'active').length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Revoke single token
  async revokeSingleToken({ uid, tokenId, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 120));
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.uid === uid || u.id === uid);
    if (index === -1) throw new Error('User record not found');

    const user = users[index];
    const tok = user.authTokens?.find((t) => t.id === tokenId);
    if (!tok) throw new Error('Token not found');

    tok.status = 'revoked';
    tok.revokedAt = new Date().toISOString();
    tok.revocationReason = reason || 'Admin revoked JWT token';

    user.updatedAt = new Date().toISOString();
    users[index] = user;
    saveUsers(users);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'REVOKE_AUTH_TOKEN',
      targetUserId: user.uid,
      targetUserName: user.name,
      previousState: `Token ${tok.id} active`,
      newState: `Token ${tok.id} revoked`,
      reason: reason || 'Individual token revoked by Superadmin'
    });

    return {
      success: true,
      message: `Token ${tok.id} (${tok.tokenType}) has been revoked.`,
      auditRecord: audit,
      user
    };
  },

  // LIST ALL AUDIT LOGS with filters and pagination
  async listAllAuditLogs({ query = '', action = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let logs = getStoredAuditLogs();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      logs = logs.filter((l) =>
        (l.targetUserName && l.targetUserName.toLowerCase().includes(q)) ||
        (l.adminUid && l.adminUid.toLowerCase().includes(q)) ||
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q)) ||
        (l.id && l.id.toLowerCase().includes(q))
      );
    }

    if (action !== 'all') {
      logs = logs.filter((l) => l.action?.toLowerCase() === action.toLowerCase());
    }

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        logs: paginated,
        total,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Reset demo state back to defaults
  async resetToDefaultSeed() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return { success: true };
  }
};
