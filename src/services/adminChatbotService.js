// Admin Kisan Mitra AI Chatbot & Human Expert Handoff Service for AGROVERCITY Superadmin
// Implements Module 12: Kisan Mitra AI Chatbot & Human Expert Handoff (SOP-12)
// Target Collections: chatbot_sessions, chatbot_messages, expert_tickets, experts, prompt_config, audit_logs

import { mockChatSessions, mockHandoffTickets, mockExperts, PROMPT_CONFIG } from '../api/mockData';

const SESSIONS_STORAGE_KEY = 'agrovercity_superadmin_chatbot_sessions';
const TICKETS_STORAGE_KEY = 'agrovercity_superadmin_expert_tickets';
const EXPERTS_STORAGE_KEY = 'agrovercity_superadmin_experts';
const PROMPT_STORAGE_KEY = 'agrovercity_superadmin_chatbot_prompt_config';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

export const INITIAL_CHATBOT_AUDIT_LOGS = [
  {
    id: 'AUD-1201',
    adminUid: 'root@agrovercity',
    action: 'EXPERT_ASSIGNED',
    targetUserId: 'hnd_8002',
    targetUserName: 'Shanta Bai Pawar (Crop insurance claim rejection)',
    previousState: 'Status: open (Unassigned)',
    newState: 'Status: assigned (Dr. Anjali Deshmukh - KVK Nashik)',
    reason: 'Critical SLA deadline requires immediate intervention by certified KVK agronomist.',
    timestamp: '2026-09-20T10:30:00.000Z',
    ipAddress: '14.139.122.15'
  },
  {
    id: 'AUD-1202',
    adminUid: 'root@agrovercity',
    action: 'TRANSCRIPT_FLAGGED_SAFETY',
    targetUserId: 'ses_7001',
    targetUserName: 'Ram Patil (Market rate dispute)',
    previousState: 'Status: active, Flagged: false',
    newState: 'Status: flagged, Flagged: true',
    reason: 'AI hallucinated Jalna soybean rate (₹5,250 vs actual ₹5,600). Escalated to human expert.',
    timestamp: '2026-09-19T14:15:00.000Z',
    ipAddress: '14.139.122.8'
  },
  {
    id: 'AUD-1203',
    adminUid: 'root@agrovercity',
    action: 'PROMPT_CONFIG_UPDATED',
    targetUserId: 'CONFIG-GEMINI-2.5',
    targetUserName: 'Kisan Mitra AI Prompt v7',
    previousState: 'Version: 6 (Temperature: 0.45)',
    newState: 'Version: 7 (Temperature: 0.40, Strict Mandi Verifier enabled)',
    reason: 'Enforced stricter guardrails on unverified mandi price responses to prevent farmer disputes.',
    timestamp: '2026-09-18T09:00:00.000Z',
    ipAddress: '14.139.122.4'
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

export const adminChatbotService = {
  // 1. Chat Transcripts Monitoring (GET /v1/admin/chatbot/transcripts)
  async listTranscripts({ query = '', status = 'all', language = 'all', page = 1, limit = 15 } = {}) {
    await new Promise((r) => setTimeout(r, 120));
    let sessions = getStored(SESSIONS_STORAGE_KEY, mockChatSessions);

    if (status !== 'all') {
      sessions = sessions.filter((s) => s.status === status);
    }
    if (language !== 'all') {
      sessions = sessions.filter((s) => s.language === language);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      sessions = sessions.filter((s) =>
        [s.id, s.farmerName, s.farmerPhone, s.topic, s.engine, s.flagReason]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    const { data, pagination } = paginateItems(sessions, page, limit);
    return { sessions: data, pagination };
  },

  async getSessionById(sessionId) {
    const sessions = getStored(SESSIONS_STORAGE_KEY, mockChatSessions);
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error(`Transcript session ${sessionId} not found.`);
    return session;
  },

  // 2. Flag Transcript for Safety / Accuracy Breach
  async flagTranscriptSafety({ sessionId, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification (min 4 characters) is required to flag transcript for safety review.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const sessions = getStored(SESSIONS_STORAGE_KEY, mockChatSessions);
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) throw new Error(`Session ${sessionId} not found`);

    const prev = sessions[idx];
    const prevFlag = prev.flagged;
    sessions[idx].flagged = true;
    sessions[idx].status = 'flagged';
    sessions[idx].flagReason = reason.trim();
    sessions[idx].updatedAt = new Date().toISOString();

    save(SESSIONS_STORAGE_KEY, sessions);

    const audit = recordAuditLog({
      adminUid,
      action: 'TRANSCRIPT_FLAGGED_SAFETY',
      targetUserId: sessionId,
      targetUserName: `${prev.farmerName} (${prev.topic})`,
      previousState: `Flagged: ${prevFlag}, Status: ${prev.status}`,
      newState: `Flagged: true, Status: flagged`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Session #${sessionId} flagged for safety review.`,
      session: sessions[idx],
      auditRecord: audit
    };
  },

  // 3. Expert Handoff Queue (GET /v1/admin/chatbot/handoffs)
  async listHandoffs({ query = '', status = 'all', priority = 'all', page = 1, limit = 15 } = {}) {
    await new Promise((r) => setTimeout(r, 120));
    let tickets = getStored(TICKETS_STORAGE_KEY, mockHandoffTickets);

    if (status !== 'all') {
      tickets = tickets.filter((t) => t.status === status);
    }
    if (priority !== 'all') {
      tickets = tickets.filter((t) => t.priority === priority);
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      tickets = tickets.filter((t) =>
        [t.id, t.farmerName, t.farmerPhone, t.topic, t.assignedExpertName, t.channel]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }

    const { data, pagination } = paginateItems(tickets, page, limit);
    return { tickets: data, pagination };
  },

  // 4. Assign Agronomist to Support Thread (POST /v1/admin/chatbot/handoffs/{id}/assign)
  async assignExpert({ ticketId, expertId, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification (min 4 characters) is required to assign an agronomist.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const tickets = getStored(TICKETS_STORAGE_KEY, mockHandoffTickets);
    const experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);

    const ticketIdx = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIdx === -1) throw new Error(`Ticket ${ticketId} not found.`);

    const expert = experts.find((e) => e.id === expertId);
    if (!expert) throw new Error(`Expert ${expertId} not found.`);

    const prevExpert = tickets[ticketIdx].assignedExpertName || 'Unassigned';
    tickets[ticketIdx].status = 'assigned';
    tickets[ticketIdx].assignedExpertId = expert.id;
    tickets[ticketIdx].assignedExpertName = `${expert.name} (${expert.organization})`;
    tickets[ticketIdx].updatedAt = new Date().toISOString();

    // Increment active ticket load for expert
    const expertIdx = experts.findIndex((e) => e.id === expertId);
    if (expertIdx !== -1) {
      experts[expertIdx].activeTickets = (experts[expertIdx].activeTickets || 0) + 1;
      save(EXPERTS_STORAGE_KEY, experts);
    }

    save(TICKETS_STORAGE_KEY, tickets);

    const audit = recordAuditLog({
      adminUid,
      action: 'EXPERT_ASSIGNED',
      targetUserId: ticketId,
      targetUserName: `${tickets[ticketIdx].farmerName} (${tickets[ticketIdx].topic})`,
      previousState: `Assigned: ${prevExpert}`,
      newState: `Assigned: ${tickets[ticketIdx].assignedExpertName}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Expert ${expert.name} assigned to ticket #${ticketId}.`,
      ticket: tickets[ticketIdx],
      auditRecord: audit
    };
  },

  // 5. Resolve Handoff Ticket
  async resolveTicket({ ticketId, resolutionNotes, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to close/resolve an expert ticket.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const tickets = getStored(TICKETS_STORAGE_KEY, mockHandoffTickets);
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) throw new Error(`Ticket ${ticketId} not found.`);

    const prev = tickets[idx];
    tickets[idx].status = 'resolved';
    tickets[idx].resolvedAt = new Date().toISOString();
    tickets[idx].resolutionNotes = resolutionNotes || 'Resolved following human agronomist consultation.';
    tickets[idx].updatedAt = new Date().toISOString();

    // Decrement expert load if assigned
    if (prev.assignedExpertId) {
      const experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);
      const expIdx = experts.findIndex((e) => e.id === prev.assignedExpertId);
      if (expIdx !== -1 && experts[expIdx].activeTickets > 0) {
        experts[expIdx].activeTickets -= 1;
        save(EXPERTS_STORAGE_KEY, experts);
      }
    }

    save(TICKETS_STORAGE_KEY, tickets);

    const audit = recordAuditLog({
      adminUid,
      action: 'TICKET_RESOLVED',
      targetUserId: ticketId,
      targetUserName: `${prev.farmerName} (${prev.topic})`,
      previousState: `Status: ${prev.status}`,
      newState: `Status: resolved (${tickets[idx].resolutionNotes})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Ticket #${ticketId} marked as resolved.`,
      ticket: tickets[idx],
      auditRecord: audit
    };
  },

  // 6. Escalate Handoff Ticket
  async escalateTicket({ ticketId, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to escalate a handoff ticket.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const tickets = getStored(TICKETS_STORAGE_KEY, mockHandoffTickets);
    const idx = tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) throw new Error(`Ticket ${ticketId} not found.`);

    const prev = tickets[idx];
    tickets[idx].status = 'escalated';
    tickets[idx].priority = 'critical';
    tickets[idx].updatedAt = new Date().toISOString();

    save(TICKETS_STORAGE_KEY, tickets);

    const audit = recordAuditLog({
      adminUid,
      action: 'TICKET_ESCALATED',
      targetUserId: ticketId,
      targetUserName: `${prev.farmerName} (${prev.topic})`,
      previousState: `Status: ${prev.status}, Priority: ${prev.priority}`,
      newState: `Status: escalated, Priority: critical`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Ticket #${ticketId} escalated to senior KVK coordinator.`,
      ticket: tickets[idx],
      auditRecord: audit
    };
  },

  // 7. Expert Agronomist Roster Management
  async listExperts({ query = '', specialization = 'all' } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);

    if (specialization !== 'all') {
      experts = experts.filter((e) => e.specialization.toLowerCase().includes(specialization.toLowerCase()));
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      experts = experts.filter((e) =>
        [e.name, e.organization, e.specialization, ...(e.languages || [])]
          .some((val) => String(val || '').toLowerCase().includes(q))
      );
    }
    return experts;
  },

  async createOrUpdateExpert({ expertData, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to update agronomist roster.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);

    let isNew = false;
    let savedExpert;

    if (expertData.id) {
      const idx = experts.findIndex((e) => e.id === expertData.id);
      if (idx === -1) throw new Error(`Expert ${expertData.id} not found.`);
      experts[idx] = {
        ...experts[idx],
        ...expertData,
        updatedAt: new Date().toISOString()
      };
      savedExpert = experts[idx];
    } else {
      isNew = true;
      savedExpert = {
        id: `exp_${Math.floor(9000 + Math.random() * 999)}`,
        name: expertData.name,
        organization: expertData.organization || 'KVK Maharashtra',
        specialization: expertData.specialization || 'Agronomy',
        languages: expertData.languages || ['mr', 'hi'],
        channels: expertData.channels || ['chat', 'whatsapp'],
        experienceYears: Number(expertData.experienceYears) || 5,
        available: expertData.available !== undefined ? expertData.available : true,
        activeTickets: 0,
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      experts.unshift(savedExpert);
    }

    save(EXPERTS_STORAGE_KEY, experts);

    recordAuditLog({
      adminUid,
      action: isNew ? 'EXPERT_REGISTERED' : 'EXPERT_PROFILE_UPDATED',
      targetUserId: savedExpert.id,
      targetUserName: `${savedExpert.name} (${savedExpert.organization})`,
      previousState: isNew ? 'Non-existent' : 'Existing profile',
      newState: `Active: ${savedExpert.available}, Specialization: ${savedExpert.specialization}`,
      reason: reason.trim()
    });

    return savedExpert;
  },

  async toggleExpertAvailability(expertId, available, adminUid = 'root@agrovercity') {
    const experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);
    const idx = experts.findIndex((e) => e.id === expertId);
    if (idx === -1) throw new Error(`Expert ${expertId} not found.`);

    const prevStatus = experts[idx].available;
    experts[idx].available = available;
    experts[idx].updatedAt = new Date().toISOString();

    save(EXPERTS_STORAGE_KEY, experts);

    recordAuditLog({
      adminUid,
      action: 'EXPERT_STATUS_TOGGLED',
      targetUserId: expertId,
      targetUserName: experts[idx].name,
      previousState: `Available: ${prevStatus}`,
      newState: `Available: ${available}`,
      reason: `Agronomist availability toggled by admin.`
    });

    return experts[idx];
  },

  // 8. Update LLM System Prompt & Parameters (PUT /v1/admin/chatbot/prompt-config)
  async getPromptConfig() {
    return getStored(PROMPT_STORAGE_KEY, PROMPT_CONFIG);
  },

  async updatePromptConfig({ systemPrompt, tone, temperature, knowledgeBaseVersion, reason, adminUid = 'root@agrovercity' }) {
    if (!reason || reason.trim().length < 4) {
      throw new Error('Administrative justification is required to deploy a new AI prompt version.');
    }
    if (!systemPrompt || systemPrompt.trim().length < 20) {
      throw new Error('System prompt must be at least 20 characters in length.');
    }

    await new Promise((r) => setTimeout(r, 150));
    const config = getStored(PROMPT_STORAGE_KEY, PROMPT_CONFIG);
    const prevVersion = config.version;

    config.systemPrompt = systemPrompt.trim();
    if (tone) config.tone = tone;
    if (temperature !== undefined) config.temperature = Number(temperature);
    if (knowledgeBaseVersion) config.knowledgeBaseVersion = knowledgeBaseVersion.trim();
    config.version = (config.version || 7) + 1;
    config.updatedBy = adminUid;
    config.updatedAt = new Date().toISOString();

    save(PROMPT_STORAGE_KEY, config);

    const audit = recordAuditLog({
      adminUid,
      action: 'PROMPT_CONFIG_UPDATED',
      targetUserId: 'CONFIG-GEMINI-2.5',
      targetUserName: `Kisan Mitra AI Prompt v${config.version}`,
      previousState: `Version: ${prevVersion}`,
      newState: `Version: ${config.version} (Model: ${config.model}, Temp: ${config.temperature})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Prompt configuration updated to version ${config.version}.`,
      config,
      auditRecord: audit
    };
  },

  // 9. Statutory Audit Logs
  async listChatbotAuditLogs({ query = '', page = 1, limit = 15 } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    const allLogs = getStoredAuditLogs();
    const chatbotKeywords = ['EXPERT', 'PROMPT', 'TRANSCRIPT', 'CHATBOT', 'HANDOFF', 'TICKET', 'SAFETY'];

    let logs = allLogs.filter((log) =>
      chatbotKeywords.some((kw) => (log.action || '').toUpperCase().includes(kw))
    );

    if (logs.length === 0) {
      logs = INITIAL_CHATBOT_AUDIT_LOGS;
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([...INITIAL_CHATBOT_AUDIT_LOGS, ...allLogs]));
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

  // 10. Dashboard KPIs
  async getChatbotKpis() {
    const sessions = getStored(SESSIONS_STORAGE_KEY, mockChatSessions);
    const tickets = getStored(TICKETS_STORAGE_KEY, mockHandoffTickets);
    const experts = getStored(EXPERTS_STORAGE_KEY, mockExperts);

    const ratedSessions = sessions.filter((s) => s.satisfactionScore != null);
    const avgSatisfaction = ratedSessions.length > 0
      ? (ratedSessions.reduce((sum, s) => sum + s.satisfactionScore, 0) / ratedSessions.length).toFixed(1)
      : '4.6';

    const activeSessions = sessions.filter((s) => s.status === 'active').length;
    const openTickets = tickets.filter((t) => ['open', 'escalated'].includes(t.status)).length;
    const breachedSla = tickets.filter(
      (t) => t.slaDeadline && new Date(t.slaDeadline) < new Date() && t.status !== 'resolved'
    ).length;

    const availableExperts = experts.filter((e) => e.available).length;

    return {
      activeSessions,
      openTickets,
      breachedSla,
      avgSatisfaction,
      totalExperts: experts.length,
      availableExperts
    };
  },

  // 11. Reset Seed Data to Statutory Default
  async resetToDefaultSeed() {
    save(SESSIONS_STORAGE_KEY, mockChatSessions);
    save(TICKETS_STORAGE_KEY, mockHandoffTickets);
    save(EXPERTS_STORAGE_KEY, mockExperts);
    save(PROMPT_STORAGE_KEY, PROMPT_CONFIG);

    const currentAudits = getStoredAuditLogs().filter(
      (log) => !['EXPERT', 'PROMPT', 'TRANSCRIPT', 'CHATBOT', 'HANDOFF', 'TICKET'].some((kw) => (log.action || '').toUpperCase().includes(kw))
    );
    save(AUDIT_STORAGE_KEY, [...INITIAL_CHATBOT_AUDIT_LOGS, ...currentAudits]);

    return { success: true, message: 'Chatbot and Expert Handoff seed reset to defaults.' };
  }
};
