// Admin KYC Service for AGROVERCITY Superadmin
// Implements Module 03: KYC Verification & Document Vault (SOP-03)
// Target Collections: users/{uid}/vault_documents, kyc_verifications, audit_logs

import { INITIAL_KYC_VERIFICATIONS, INITIAL_USERS } from './mockData';

const KYC_STORAGE_KEY = 'agrovercity_superadmin_kyc_verifications';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';
const USERS_STORAGE_KEY = 'agrovercity_superadmin_users';
const VAULT_STORAGE_KEY = 'agrovercity_superadmin_vault_documents';

function getStoredKyc() {
  const data = localStorage.getItem(KYC_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(INITIAL_KYC_VERIFICATIONS));
    return INITIAL_KYC_VERIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_KYC_VERIFICATIONS;
  }
}

function saveKyc(items) {
  localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(items));
}

function getStoredVaultDocs() {
  const data = localStorage.getItem(VAULT_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {}
  }
  const kycItems = getStoredKyc();
  const vaultDocs = kycItems.map((item) => ({
    id: `VLT-${item.docId.replace('DOC-', '')}`,
    docId: item.docId,
    userId: item.userId,
    userName: item.userName,
    userMobile: item.userMobile,
    userPersona: item.userPersona,
    userCity: item.userCity,
    docType: item.docType,
    docName: item.docName,
    storagePath: `gs://agrovercity-vault/users/${item.userId}/${item.docType}_${item.docId.toLowerCase()}.enc`,
    encryptionCipher: 'AES-256-GCM (HMAC-SHA256 authenticated)',
    sha256Checksum: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${item.docId.replace('DOC-', '')}`,
    fileSize: item.fileSize,
    mimeType: item.mimeType,
    dpdpComplianceStatus: item.dpdpComplianceStatus,
    retentionPolicy: 'Statutory 7 Years (Section 7 DPDP Act & IT Act §43A)',
    accessLevel: 'Restricted (Superadmin & Verification Officer)',
    status: item.status,
    verificationBadgeIssued: !!item.verificationBadgeIssued,
    uploadedAt: item.submittedAt,
    lastAccessedAt: item.reviewedAt || item.submittedAt
  }));
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vaultDocs));
  return vaultDocs;
}

function saveVaultDocs(docs) {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(docs));
}

function syncVaultDocStatus(docId, newStatus, verificationBadgeIssued) {
  try {
    const docs = getStoredVaultDocs();
    const idx = docs.findIndex((d) => d.docId === docId || d.id === docId);
    if (idx !== -1) {
      docs[idx].status = newStatus;
      docs[idx].verificationBadgeIssued = verificationBadgeIssued;
      docs[idx].lastAccessedAt = new Date().toISOString();
      saveVaultDocs(docs);
    }
  } catch (e) {
    console.error('Failed to sync vault document status:', e);
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
    reason: reason || 'Administrative KYC intervention via Superadmin Console (SOP-03)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

// Update user in users collection when KYC is approved
function syncUserKycVerification(userId, docType, verified) {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!rawUsers) return;
    const users = JSON.parse(rawUsers);
    const index = users.findIndex((u) => u.uid === userId || u.id === userId);
    if (index === -1) return;

    const user = users[index];
    if (verified) {
      if (docType === 'land_record_712') {
        if (user.farmPolygon) user.farmPolygon.verifiedByAdmin = true;
        if (user.roleProfiles?.Farmer) user.roleProfiles.Farmer.status = 'verified';
        if (user.roleProfiles?.Landlord) user.roleProfiles.Landlord.status = 'verified';
      } else if (docType === 'aadhaar') {
        if (user.status === 'pending') user.status = 'verified';
      } else if (docType === 'apmc_license') {
        if (user.roleProfiles?.Broker) user.roleProfiles.Broker.status = 'verified';
      } else if (docType === 'transport_permit') {
        if (user.roleProfiles?.Transporter) user.roleProfiles.Transporter.status = 'verified';
      } else if (docType === 'seller_license') {
        if (user.roleProfiles?.Seller) user.roleProfiles.Seller.status = 'verified';
      }
      user.updatedAt = new Date().toISOString();
      users[index] = user;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to sync user verification state:', e);
  }
}

export const adminKycService = {
  // GET /v1/admin/kyc/pending & List with filters
  async listVerifications({
    query = '',
    status = 'all',
    docType = 'all',
    persona = 'all',
    dateRange = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 120));

    let items = getStoredKyc();

    // 1. Search query
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((item) => {
        const nameMatch = item.userName && item.userName.toLowerCase().includes(q);
        const mobileMatch = item.userMobile && item.userMobile.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
        const idMatch = item.id && item.id.toLowerCase().includes(q);
        const docNameMatch = item.docName && item.docName.toLowerCase().includes(q);
        const docNumMatch = item.extractedFields?.documentNumber && item.extractedFields.documentNumber.toLowerCase().includes(q);
        const cityMatch = item.userCity && item.userCity.toLowerCase().includes(q);
        return nameMatch || mobileMatch || idMatch || docNameMatch || docNumMatch || cityMatch;
      });
    }

    // 2. Filter by status
    if (status && status !== 'all') {
      items = items.filter((item) => item.status && item.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Filter by document type
    if (docType && docType !== 'all') {
      items = items.filter((item) => item.docType && item.docType.toLowerCase() === docType.toLowerCase());
    }

    // 4. Filter by persona
    if (persona && persona !== 'all') {
      items = items.filter((item) => item.userPersona && item.userPersona.toLowerCase() === persona.toLowerCase());
    }

    // 5. Date range
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let days = 30;
      if (dateRange === '24h') days = 1;
      else if (dateRange === '7d') days = 7;
      else if (dateRange === '30d') days = 30;
      else if (dateRange === '90d') days = 90;

      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      items = items.filter((item) => new Date(item.submittedAt) >= cutoff);
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        items: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // GET verification item by ID
  async getVerificationById(id) {
    await new Promise((r) => setTimeout(r, 60));
    const items = getStoredKyc();
    const item = items.find((i) => i.id === id || i.docId === id);
    if (!item) throw new Error(`KYC item with ID ${id} not found`);
    return { success: true, data: item };
  },

  // POST /v1/admin/kyc/{entityId}/verify
  // Approve document and issue verified badge
  async approveKyc({ id, adminUid, reason = 'Document verified by Superadmin per government guidelines' }) {
    await new Promise((r) => setTimeout(r, 180));
    const items = getStoredKyc();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('KYC verification ticket not found');

    const item = items[index];
    const prevStatus = item.status;

    item.status = 'verified';
    item.verificationBadgeIssued = true;
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = adminUid || 'root@agrovercity';
    item.rejectionReason = null;

    // Append to internal audit trail
    if (!item.auditTrail) item.auditTrail = [];
    item.auditTrail.push({
      action: 'ADMIN_APPROVED',
      timestamp: new Date().toISOString(),
      actor: adminUid || 'root@agrovercity',
      notes: reason
    });

    items[index] = item;
    saveKyc(items);

    // Sync vault document status
    syncVaultDocStatus(item.docId, 'verified', true);

    // Sync user role profile and polygon verification
    syncUserKycVerification(item.userId, item.docType, true);

    // Write to central immutable audit log
    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'KYC_DOCUMENT_APPROVED',
      targetUserId: item.userId,
      targetUserName: item.userName,
      previousState: `${item.docName}: ${prevStatus}`,
      newState: `${item.docName}: verified (Badge Issued ⭐)`,
      reason
    });

    return {
      success: true,
      message: `Approved ${item.docName} for ${item.userName}. Verified badge issued.`,
      item,
      auditRecord: audit
    };
  },

  // POST /v1/admin/kyc/{entityId}/reject
  // Reject KYC with specific reason
  async rejectKyc({ id, reason, adminUid }) {
    if (!reason || !reason.trim()) {
      throw new Error('A specific rejection reason is required for compliance audit logging.');
    }

    await new Promise((r) => setTimeout(r, 180));
    const items = getStoredKyc();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('KYC verification ticket not found');

    const item = items[index];
    const prevStatus = item.status;

    item.status = 'rejected';
    item.verificationBadgeIssued = false;
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = adminUid || 'root@agrovercity';
    item.rejectionReason = reason.trim();

    // Append to internal audit trail
    if (!item.auditTrail) item.auditTrail = [];
    item.auditTrail.push({
      action: 'ADMIN_REJECTED',
      timestamp: new Date().toISOString(),
      actor: adminUid || 'root@agrovercity',
      notes: `Rejected: ${reason.trim()}`
    });

    items[index] = item;
    saveKyc(items);

    // Sync vault document status
    syncVaultDocStatus(item.docId, 'rejected', false);

    // Write to central immutable audit log
    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'KYC_DOCUMENT_REJECTED',
      targetUserId: item.userId,
      targetUserName: item.userName,
      previousState: `${item.docName}: ${prevStatus}`,
      newState: `${item.docName}: rejected`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Rejected ${item.docName} for ${item.userName}. Rejection notification dispatched.`,
      item,
      auditRecord: audit
    };
  },

  // Flag KYC document for senior triage or fraud inspection
  async flagKyc({ id, reason, adminUid }) {
    await new Promise((r) => setTimeout(r, 150));
    const items = getStoredKyc();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('KYC verification ticket not found');

    const item = items[index];
    const prevStatus = item.status;

    item.status = 'flagged';
    item.reviewedAt = new Date().toISOString();
    item.reviewedBy = adminUid || 'root@agrovercity';
    item.rejectionReason = reason || 'Discrepancy flagged for Senior Admin investigation';

    if (!item.auditTrail) item.auditTrail = [];
    item.auditTrail.push({
      action: 'ADMIN_FLAGGED',
      timestamp: new Date().toISOString(),
      actor: adminUid || 'root@agrovercity',
      notes: reason || 'Flagged for anomaly triage'
    });

    items[index] = item;
    saveKyc(items);

    // Sync vault document status
    syncVaultDocStatus(item.docId, 'flagged', false);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'KYC_DOCUMENT_FLAGGED',
      targetUserId: item.userId,
      targetUserName: item.userName,
      previousState: `${item.docName}: ${prevStatus}`,
      newState: `${item.docName}: flagged`,
      reason: reason || 'Suspicious document anomaly flagged'
    });

    return {
      success: true,
      message: `Flagged ${item.docName} for investigation.`,
      item,
      auditRecord: audit
    };
  },

  // LIST ALL VAULT DOCUMENTS across all users (users/{uid}/vault_documents collection)
  async listVaultDocuments({ query = '', docType = 'all', status = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let docs = getStoredVaultDocs();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      docs = docs.filter((d) => {
        const idMatch = d.id && d.id.toLowerCase().includes(q);
        const docIdMatch = d.docId && d.docId.toLowerCase().includes(q);
        const nameMatch = d.userName && d.userName.toLowerCase().includes(q);
        const mobileMatch = d.userMobile && d.userMobile.includes(q);
        const docNameMatch = d.docName && d.docName.toLowerCase().includes(q);
        const pathMatch = d.storagePath && d.storagePath.toLowerCase().includes(q);
        const checksumMatch = d.sha256Checksum && d.sha256Checksum.toLowerCase().includes(q);
        return idMatch || docIdMatch || nameMatch || mobileMatch || docNameMatch || pathMatch || checksumMatch;
      });
    }

    if (docType !== 'all') {
      docs = docs.filter((d) => d.docType?.toLowerCase() === docType.toLowerCase());
    }

    if (status !== 'all') {
      docs = docs.filter((d) => d.status?.toLowerCase() === status.toLowerCase());
    }

    docs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    const total = docs.length;
    const startIndex = (page - 1) * limit;
    const paginated = docs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        documents: paginated,
        total,
        verifiedCount: docs.filter((d) => d.status === 'verified').length,
        pendingCount: docs.filter((d) => d.status === 'pending').length,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // Purge / Emergency shred a document from the vault
  async purgeVaultDocument({ id, adminUid, reason }) {
    await new Promise((r) => setTimeout(r, 150));
    const docs = getStoredVaultDocs();
    const index = docs.findIndex((d) => d.id === id || d.docId === id);
    if (index === -1) throw new Error('Vault document not found');

    const doc = docs[index];
    const prevStatus = doc.status;
    doc.status = 'purged';
    doc.purgedAt = new Date().toISOString();
    doc.purgeReason = reason || 'Statutory GDPR / DPDP right to be forgotten purge';

    docs[index] = doc;
    saveVaultDocs(docs);

    const audit = recordAuditLog({
      adminUid: adminUid || 'root@agrovercity',
      action: 'VAULT_DOCUMENT_PURGED',
      targetUserId: doc.userId,
      targetUserName: doc.userName,
      previousState: `${doc.docName}: ${prevStatus}`,
      newState: `${doc.docName}: purged (Cryptographically shredded)`,
      reason: reason || 'Document purged from AES-256 vault storage'
    });

    return {
      success: true,
      message: `Document ${doc.id} (${doc.docName}) has been cryptographically purged from vault.`,
      auditRecord: audit,
      document: doc
    };
  },

  // LIST KYC AUDIT HISTORY (GET /v1/admin/kyc/history)
  async listKycAuditHistory({ query = '', action = 'all', page = 1, limit = 10 } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    const logs = getStoredAuditLogs();
    let kycLogs = logs.filter((l) => (l.action && l.action.startsWith('KYC_')) || l.action === 'VAULT_DOCUMENT_PURGED');

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      kycLogs = kycLogs.filter((l) => {
        const idMatch = l.id && l.id.toLowerCase().includes(q);
        const nameMatch = l.targetUserName && l.targetUserName.toLowerCase().includes(q);
        const adminMatch = l.adminUid && l.adminUid.toLowerCase().includes(q);
        const reasonMatch = l.reason && l.reason.toLowerCase().includes(q);
        return idMatch || nameMatch || adminMatch || reasonMatch;
      });
    }

    if (action !== 'all') {
      kycLogs = kycLogs.filter((l) => l.action?.toLowerCase() === action.toLowerCase());
    }

    const total = kycLogs.length;
    const startIndex = (page - 1) * limit;
    const paginated = kycLogs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        history: paginated,
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

  // GET /v1/admin/kyc/history by entity
  async getKycHistory(entityId = null) {
    await new Promise((r) => setTimeout(r, 60));
    const logs = getStoredAuditLogs();
    const kycLogs = logs.filter((l) => l.action && l.action.startsWith('KYC_'));
    if (entityId) {
      return kycLogs.filter((l) => l.targetUserId === entityId || l.id === entityId);
    }
    return kycLogs;
  },

  // Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(INITIAL_KYC_VERIFICATIONS));
    localStorage.removeItem(VAULT_STORAGE_KEY);
    return { success: true };
  }
};
