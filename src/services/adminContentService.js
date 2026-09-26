// Admin Knowledge Hub, Content CMS & Live Media Management Service for AGROVERCITY Superadmin
// Implements Module 20: Knowledge Hub, Content CMS & Live Media (SOP-20)
// Target Collections: agri_news, agri_channels, workshops, expert_talks, video_guides, blog_articles, audit_logs

import {
  mockAgriNews,
  mockAgriChannels,
  mockWorkshops,
  mockWorkshopRosters,
  mockExpertTalks,
  mockVideoGuides,
  mockBlogArticles,
  mockContentAuditLogs,
  mockContentSummary
} from '../api/contentMockData'

const NEWS_STORAGE_KEY = 'agrovercity_superadmin_content_news'
const CHANNELS_STORAGE_KEY = 'agrovercity_superadmin_content_channels'
const WORKSHOPS_STORAGE_KEY = 'agrovercity_superadmin_content_workshops'
const ROSTERS_STORAGE_KEY = 'agrovercity_superadmin_content_rosters'
const TALKS_STORAGE_KEY = 'agrovercity_superadmin_content_talks'
const VIDEOS_STORAGE_KEY = 'agrovercity_superadmin_content_videos'
const BLOGS_STORAGE_KEY = 'agrovercity_superadmin_content_blogs'
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_content_audit_logs'

function getStored(key, defaultVal) {
  try {
    const data = localStorage.getItem(key)
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal))
      return JSON.parse(JSON.stringify(defaultVal))
    }
    return JSON.parse(data)
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e)
    return JSON.parse(JSON.stringify(defaultVal))
  }
}

function save(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e)
  }
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY)
  if (!data) {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockContentAuditLogs))
    return [...mockContentAuditLogs]
  }
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(mockContentAuditLogs))
      return [...mockContentAuditLogs]
    }
    return parsed
  } catch (e) {
    return [...mockContentAuditLogs]
  }
}

function recordAuditLog({
  adminUid = 'usr_admin_root',
  adminName = 'Super Admin',
  actionType,
  entityId = 'N/A',
  entityName = 'N/A',
  collection = 'general',
  previousState = 'none',
  newState = 'updated',
  reason = 'Administrative action executed under SOP-20.'
}) {
  const logs = getStoredAuditLogs()
  const newLog = {
    id: `aud_cnt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminUid,
    adminName,
    actionType,
    entityId,
    entityName,
    collection,
    previousState,
    newState,
    reason,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.' + Math.floor(Math.random() * 240 + 10)
  }

  const updatedLogs = [newLog, ...logs]
  save(AUDIT_STORAGE_KEY, updatedLogs)
  return newLog
}

function paginateItems(items, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize))
  }
}

function matchesDateRange(dateStr, range) {
  if (!range || range === 'all') return true
  if (!dateStr) return true
  const date = new Date(dateStr)
  const now = new Date()
  if (isNaN(date.getTime())) return true

  if (range === 'today') {
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }
  if (range === 'last_7_days') {
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= cutoff
  }
  if (range === 'last_30_days') {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return date >= cutoff
  }
  if (range === 'this_quarter') {
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3
    const startOfQuarter = new Date(now.getFullYear(), quarterMonth, 1)
    return date >= startOfQuarter
  }
  return true
}

function matchesPersona(item, persona) {
  if (!persona || persona === 'all') return true
  const p = persona.toLowerCase()

  if (p === 'farmer') {
    // Farmer-focused news, practical questions, farmer audience
    const text = `${item.title || ''} ${item.description || ''} ${item.category || ''} ${item.farmerName || ''}`.toLowerCase()
    return text.includes('farmer') || text.includes('paddy') || text.includes('onion') || text.includes('sugarcane') || text.includes('cotton') || text.includes('drip')
  }
  if (p === 'scientist') {
    // Scientist or KVK authored or lead
    const author = `${item.author || ''} ${item.authorName || ''} ${item.scientistName || ''} ${item.instructorName || ''} ${item.source || ''}`.toLowerCase()
    return author.includes('dr.') || author.includes('prof') || author.includes('icar') || author.includes('kvk') || author.includes('scientist')
  }
  if (p === 'vyapari') {
    // APMC mandi auctions, trade, export
    const text = `${item.title || ''} ${item.category || ''} ${item.source || ''}`.toLowerCase()
    return text.includes('mandi') || text.includes('apmc') || text.includes('auction') || text.includes('export') || text.includes('vyapari')
  }
  if (p === 'admin_editor') {
    // Official editorial desks, policy, government GR
    const text = `${item.author || ''} ${item.source || ''} ${item.category || ''}`.toLowerCase()
    return text.includes('desk') || text.includes('dept') || text.includes('directorate') || text.includes('ministry') || text.includes('govt') || text.includes('policy')
  }

  return true
}

export const adminContentService = {
  // -------------------------------------------------------------
  // 1. CONTENT SUMMARY & TELEMETRY
  // -------------------------------------------------------------
  getContentSummary: async () => {
    const news = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const channels = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const workshops = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const talks = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const videos = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const blogs = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)

    const liveChans = channels.filter((c) => c.status === 'live')
    const totalViewers = liveChans.reduce((sum, c) => sum + (Number(c.activeViewers) || 0), 0)
    const totalRevenue = workshops.reduce((sum, w) => sum + ((Number(w.enrolledCount) || 0) * (Number(w.feeINR) || 0)), 0)
    const totalSeats = workshops.reduce((sum, w) => sum + (Number(w.enrolledCount) || 0), 0)
    const pendingQuestions = talks.reduce((sum, t) => sum + (t.farmerQuestions?.filter((q) => q.status === 'pending_triage')?.length || 0), 0)
    const flaggedChat = channels.reduce((sum, c) => sum + (c.chatMessages?.filter((m) => m.moderationStatus === 'flagged')?.length || 0), 0)

    return {
      totalActiveContent: news.length + channels.length + workshops.length + talks.length + videos.length + blogs.length,
      totalNewsArticles: news.length,
      liveChannelsCount: liveChans.length,
      totalLiveViewers: totalViewers || mockContentSummary.totalLiveViewers,
      activeWorkshops: workshops.filter((w) => w.status === 'upcoming' || w.status === 'ongoing').length,
      enrolledFarmersCount: totalSeats,
      workshopRevenueINR: totalRevenue,
      expertTalksScheduled: talks.filter((t) => t.status === 'scheduled').length,
      farmerQuestionsPendingTriage: pendingQuestions,
      flaggedChatMessages: flaggedChat,
      videoGuidesPublished: videos.filter((v) => v.status === 'published').length,
      blogArticlesPublished: blogs.filter((b) => b.status === 'published').length,
      totalAuditLogs: getStoredAuditLogs().length,
      lastTelemetrySync: new Date().toISOString()
    }
  },

  // -------------------------------------------------------------
  // 2. AGRI NEWS (agri_news)
  // -------------------------------------------------------------
  listAgriNews: async ({
    q = '',
    status = 'all',
    language = 'all',
    category = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const needle = q.trim().toLowerCase()

    list = list.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (language !== 'all' && item.language !== language) return false
      if (category !== 'all' && item.category !== category) return false
      if (!matchesDateRange(item.publishedAt || item.createdAt, dateRange)) return false
      if (!matchesPersona(item, persona)) return false
      if (!needle) return true

      return [
        item.id,
        item.title,
        item.headline,
        item.summary,
        item.content,
        item.category,
        item.author,
        item.source,
        ...(item.tags || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getAgriNewsById: async (id) => {
    const list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const item = list.find((n) => n.id === id)
    if (!item) throw new Error(`Article with ID ${id} not found.`)
    return item
  },

  createAgriNews: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const newId = `news_${Date.now().toString().slice(-4)}`
    const now = new Date().toISOString()

    const newArticle = {
      id: newId,
      title: payload.title || 'Untitled Agricultural News Article',
      headline: payload.headline || '',
      summary: payload.summary || '',
      content: payload.content || '',
      category: payload.category || 'Govt Schemes',
      tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags ? payload.tags.split(',').map((t) => t.trim()) : ['Agriculture']),
      breaking: Boolean(payload.breaking),
      language: payload.language || 'mr',
      vernacularAudioUrl: payload.vernacularAudioUrl || 'https://cdn.agrovercity.in/audio/news/default_vernacular.mp3',
      audioDurationSeconds: Number(payload.audioDurationSeconds) || 120,
      author: payload.author || adminName,
      source: payload.source || 'Agrovercity Agronomy Desk',
      readCount: 0,
      status: payload.status || 'published',
      scheduledAt: payload.scheduledAt || null,
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newArticle, ...list]
    save(NEWS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: newArticle.breaking ? 'PUBLISH_BREAKING_NEWS' : 'CREATE_NEWS_ARTICLE',
      entityId: newId,
      entityName: newArticle.title,
      collection: 'agri_news',
      previousState: 'none',
      newState: newArticle.status,
      reason: payload.reason || `Created and published news article in category: ${newArticle.category}`
    })

    return newArticle
  },

  updateAgriNews: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const idx = list.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error(`Article with ID ${id} not found.`)

    const prev = list[idx]
    const updatedArticle = {
      ...prev,
      ...patch,
      tags: Array.isArray(patch.tags) ? patch.tags : (patch.tags ? patch.tags.split(',').map((t) => t.trim()) : prev.tags),
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedArticle
    save(NEWS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_NEWS_ARTICLE',
      entityId: id,
      entityName: updatedArticle.title,
      collection: 'agri_news',
      previousState: prev.status,
      newState: updatedArticle.status,
      reason: patch.reason || `Updated article metadata or vernacular audio narration.`
    })

    return updatedArticle
  },

  deleteAgriNews: async (id, reason = 'Editorial removal', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const item = list.find((n) => n.id === id)
    if (!item) throw new Error(`Article with ID ${id} not found.`)

    const filtered = list.filter((n) => n.id !== id)
    save(NEWS_STORAGE_KEY, filtered)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'DELETE_NEWS_ARTICLE',
      entityId: id,
      entityName: item.title,
      collection: 'agri_news',
      previousState: item.status,
      newState: 'deleted',
      reason
    })

    return { success: true, id }
  },

  batchUpdateNewsStatus: async (ids, newStatus, reason = 'Batch editorial update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(NEWS_STORAGE_KEY, mockAgriNews)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((item) => {
      if (idSet.has(item.id)) {
        modifiedCount++
        return {
          ...item,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })

    save(NEWS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_NEWS_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} news articles`,
      collection: 'agri_news',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 3. AGRI CHANNELS & LIVE STREAMING (agri_channels)
  // -------------------------------------------------------------
  listAgriChannels: async ({
    q = '',
    status = 'all',
    language = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const needle = q.trim().toLowerCase()

    list = list.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (language !== 'all' && c.language !== language) return false
      if (!matchesDateRange(c.scheduledLiveAt || c.createdAt, dateRange)) return false
      if (!matchesPersona(c, persona)) return false
      if (!needle) return true

      return [
        c.id,
        c.channelName,
        c.callsign,
        c.category,
        c.rtmpIngestUrl,
        c.hlsPlaybackUrl,
        c.streamKey
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getAgriChannelById: async (id) => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const channel = list.find((c) => c.id === id)
    if (!channel) throw new Error(`Channel with ID ${id} not found.`)
    return channel
  },

  createAgriChannel: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const newId = `chan_${Date.now().toString().slice(-4)}`
    const slug = (payload.channelName || 'channel').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const now = new Date().toISOString()

    const newChannel = {
      id: newId,
      channelName: payload.channelName || 'Agrovercity Agri Live Channel',
      callsign: payload.callsign || `LIVE-${newId.toUpperCase()}`,
      category: payload.category || 'Krishi Darshan',
      language: payload.language || 'mr',
      rtmpIngestUrl: payload.rtmpIngestUrl || 'rtmp://ingest.live.agrovercity.in/live-stream',
      streamKey: `live_agri_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`,
      hlsPlaybackUrl: payload.hlsPlaybackUrl || `https://stream.agrovercity.in/hls/${slug}/master.m3u8`,
      status: payload.status || 'offline',
      activeViewers: 0,
      peakViewersToday: 0,
      resolution: payload.resolution || '1080p60',
      bitrateKbps: Number(payload.bitrateKbps) || 4500,
      chatEnabled: payload.chatEnabled !== undefined ? Boolean(payload.chatEnabled) : true,
      chatModerationLevel: payload.chatModerationLevel || 'strict',
      scheduledLiveAt: payload.scheduledLiveAt || now,
      createdAt: now,
      updatedAt: now,
      userId: adminUid,
      chatMessages: []
    }

    const updated = [newChannel, ...list]
    save(CHANNELS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_AGRI_CHANNEL',
      entityId: newId,
      entityName: newChannel.channelName,
      collection: 'agri_channels',
      previousState: 'none',
      newState: newChannel.status,
      reason: payload.reason || `Provisioned RTMP channel ingest and HLS distribution profile.`
    })

    return newChannel
  },

  updateAgriChannel: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Channel with ID ${id} not found.`)

    const prev = list[idx]
    const updatedChannel = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedChannel
    save(CHANNELS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_AGRI_CHANNEL',
      entityId: id,
      entityName: updatedChannel.channelName,
      collection: 'agri_channels',
      previousState: prev.status,
      newState: updatedChannel.status,
      reason: patch.reason || `Updated channel stream parameters, resolution, or chat moderation settings.`
    })

    return updatedChannel
  },

  regenerateStreamKey: async (id, reason = 'Routine security key rotation', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Channel with ID ${id} not found.`)

    const prev = list[idx]
    const newStreamKey = `live_agri_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`

    list[idx] = {
      ...prev,
      streamKey: newStreamKey,
      updatedAt: new Date().toISOString()
    }

    save(CHANNELS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'REGENERATE_STREAM_KEY',
      entityId: id,
      entityName: prev.channelName,
      collection: 'agri_channels',
      previousState: 'key_revoked',
      newState: 'key_generated_active',
      reason
    })

    return { success: true, channelId: id, streamKey: newStreamKey }
  },

  listChannelChatMessages: async (channelId) => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const channel = list.find((c) => c.id === channelId)
    if (!channel) throw new Error(`Channel with ID ${channelId} not found.`)
    return channel.chatMessages || []
  },

  deleteChatMessage: async (channelId, messageId, reason = 'Pruned by superadmin moderation', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const channelIdx = list.findIndex((c) => c.id === channelId)
    if (channelIdx === -1) throw new Error(`Channel with ID ${channelId} not found.`)

    const channel = list[channelIdx]
    const msg = (channel.chatMessages || []).find((m) => m.id === messageId)
    channel.chatMessages = (channel.chatMessages || []).filter((m) => m.id !== messageId)

    save(CHANNELS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'MODERATE_DELETE_CHAT_MSG',
      entityId: channelId,
      entityName: channel.channelName,
      collection: 'agri_channels',
      previousState: msg?.moderationStatus || 'posted',
      newState: 'pruned_deleted',
      reason: `${reason} (Message UID: ${messageId})`
    })

    return { success: true, messageId }
  },

  banChatUser: async (channelId, userId, { banType = 'permanent', reason = 'Abusive spam behavior', durationHours = 24 } = {}, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const channelIdx = list.findIndex((c) => c.id === channelId)
    if (channelIdx === -1) throw new Error(`Channel with ID ${channelId} not found.`)

    const channel = list[channelIdx]
    // Prune all messages from banned user
    channel.chatMessages = (channel.chatMessages || []).filter((m) => m.userId !== userId)

    save(CHANNELS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BAN_CHAT_USER',
      entityId: channelId,
      entityName: channel.channelName,
      collection: 'agri_channels',
      previousState: 'user_active',
      newState: banType === 'permanent' ? 'user_banned_permanent' : `user_banned_temp_${durationHours}h`,
      reason: `User UID: ${userId} banned (${banType}). Rationale: ${reason}`
    })

    return { success: true, userId, banType, durationHours }
  },

  batchUpdateChannelStatus: async (ids, newStatus, reason = 'Batch channel maintenance update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(CHANNELS_STORAGE_KEY, mockAgriChannels)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((c) => {
      if (idSet.has(c.id)) {
        modifiedCount++
        return {
          ...c,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return c
    })

    save(CHANNELS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_CHANNEL_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} channels`,
      collection: 'agri_channels',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 4. WORKSHOPS & ROSTERS (workshops)
  // -------------------------------------------------------------
  listWorkshops: async ({
    q = '',
    status = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const needle = q.trim().toLowerCase()

    list = list.filter((w) => {
      if (status !== 'all' && w.status !== status) return false
      if (!matchesDateRange(w.scheduledAt || w.createdAt, dateRange)) return false
      if (!matchesPersona(w, persona)) return false
      if (!needle) return true

      return [
        w.id,
        w.title,
        w.description,
        w.instructorName,
        w.instructorTitle,
        w.icarAccreditationNo,
        w.meetingPlatform
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getWorkshopById: async (id) => {
    const list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const ws = list.find((w) => w.id === id)
    if (!ws) throw new Error(`Workshop with ID ${id} not found.`)
    return ws
  },

  createWorkshop: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const newId = `ws_${Date.now().toString().slice(-4)}`
    const now = new Date().toISOString()

    const newWorkshop = {
      id: newId,
      title: payload.title || 'Untitled ICAR Practical Workshop',
      description: payload.description || '',
      instructorName: payload.instructorName || 'Dr. Agrovercity Specialist',
      instructorTitle: payload.instructorTitle || 'Senior Agronomist, ICAR Certified',
      icarAccreditationNo: payload.icarAccreditationNo || `ICAR-TRG-2026-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      seatsCapacity: Number(payload.seatsCapacity) || 100,
      enrolledCount: 0,
      feeINR: Number(payload.feeINR) || 999,
      currency: 'INR',
      scheduledAt: payload.scheduledAt || now,
      durationMinutes: Number(payload.durationMinutes) || 180,
      meetingPlatform: payload.meetingPlatform || 'Agrovercity Live Stream',
      meetingUrl: payload.meetingUrl || `https://live.agrovercity.in/workshops/${newId}/room`,
      status: 'upcoming',
      certificateEligible: payload.certificateEligible !== undefined ? Boolean(payload.certificateEligible) : true,
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newWorkshop, ...list]
    save(WORKSHOPS_STORAGE_KEY, updated)

    // Initialize roster array
    const rosters = getStored(ROSTERS_STORAGE_KEY, mockWorkshopRosters)
    rosters[newId] = []
    save(ROSTERS_STORAGE_KEY, rosters)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CREATE_WORKSHOP',
      entityId: newId,
      entityName: newWorkshop.title,
      collection: 'workshops',
      previousState: 'none',
      newState: newWorkshop.status,
      reason: payload.reason || `Created paid ICAR workshop with seat limit: ${newWorkshop.seatsCapacity}`
    })

    return newWorkshop
  },

  updateWorkshop: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const idx = list.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error(`Workshop with ID ${id} not found.`)

    const prev = list[idx]
    const updatedWs = {
      ...prev,
      ...patch,
      seatsCapacity: patch.seatsCapacity !== undefined ? Number(patch.seatsCapacity) : prev.seatsCapacity,
      feeINR: patch.feeINR !== undefined ? Number(patch.feeINR) : prev.feeINR,
      durationMinutes: patch.durationMinutes !== undefined ? Number(patch.durationMinutes) : prev.durationMinutes,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedWs
    save(WORKSHOPS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_WORKSHOP',
      entityId: id,
      entityName: updatedWs.title,
      collection: 'workshops',
      previousState: prev.status,
      newState: updatedWs.status,
      reason: patch.reason || `Updated workshop curriculum, date, or instructor details.`
    })

    return updatedWs
  },

  cancelWorkshop: async (id, { reason = 'Emergency cancellation', triggerRefunds = true, dualSignOffAdmin = null } = {}, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const idx = list.findIndex((w) => w.id === id)
    if (idx === -1) throw new Error(`Workshop with ID ${id} not found.`)

    const ws = list[idx]
    const totalRefundRequired = ws.enrolledCount * ws.feeINR

    // Compliance check: > ₹50,000 requires dual sign-off
    if (triggerRefunds && totalRefundRequired > 50000 && !dualSignOffAdmin) {
      throw new Error(`Dual admin sign-off required for refund volumes exceeding ₹50,000 (Calculated: ₹${totalRefundRequired.toLocaleString('en-IN')}).`)
    }

    ws.status = 'cancelled'
    ws.updatedAt = new Date().toISOString()
    list[idx] = ws
    save(WORKSHOPS_STORAGE_KEY, list)

    // Mark roster entries as refunded if triggered
    if (triggerRefunds) {
      const rosters = getStored(ROSTERS_STORAGE_KEY, mockWorkshopRosters)
      if (rosters[id]) {
        rosters[id] = rosters[id].map((r) => ({
          ...r,
          paymentStatus: 'refunded'
        }))
        save(ROSTERS_STORAGE_KEY, rosters)
      }
    }

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'CANCEL_WORKSHOP_MASS_REFUND',
      entityId: id,
      entityName: ws.title,
      collection: 'workshops',
      previousState: 'upcoming',
      newState: 'cancelled_refunded',
      reason: `Mass cancellation triggered. Total refund: ₹${totalRefundRequired}. Dual Sign-off co-signatory: ${dualSignOffAdmin || 'N/A'}. Reason: ${reason}`
    })

    return { success: true, id, totalRefundRequired }
  },

  getWorkshopRoster: async (workshopId) => {
    const rosters = getStored(ROSTERS_STORAGE_KEY, mockWorkshopRosters)
    return rosters[workshopId] || []
  },

  issueWorkshopCertificate: async (workshopId, enrollmentId, reason = 'Attendance verified > 80%', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const rosters = getStored(ROSTERS_STORAGE_KEY, mockWorkshopRosters)
    const list = rosters[workshopId] || []
    const idx = list.findIndex((r) => r.id === enrollmentId)
    if (idx === -1) throw new Error(`Roster entry with ID ${enrollmentId} not found in workshop ${workshopId}.`)

    const certId = `CERT-ICAR-2026-${Math.floor(1000 + Math.random() * 9000)}`
    list[idx] = {
      ...list[idx],
      attended: true,
      certificateIssued: true,
      certificateId: certId
    }

    rosters[workshopId] = list
    save(ROSTERS_STORAGE_KEY, rosters)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'ISSUE_ICAR_CERTIFICATES',
      entityId: workshopId,
      entityName: `Participant: ${list[idx].farmerName}`,
      collection: 'workshops',
      previousState: 'certificate_pending',
      newState: certId,
      reason
    })

    return { success: true, certificateId: certId, farmerName: list[idx].farmerName }
  },

  refundWorkshopEnrollment: async (workshopId, enrollmentId, { reason = 'Farmer requested refund', dualSignOffAdmin = null } = {}, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const rosters = getStored(ROSTERS_STORAGE_KEY, mockWorkshopRosters)
    const list = rosters[workshopId] || []
    const idx = list.findIndex((r) => r.id === enrollmentId)
    if (idx === -1) throw new Error(`Roster entry with ID ${enrollmentId} not found.`)

    const entry = list[idx]
    if (entry.amountPaidINR > 50000 && !dualSignOffAdmin) {
      throw new Error(`Dual admin sign-off required for refund exceeding ₹50,000.`)
    }

    list[idx] = {
      ...entry,
      paymentStatus: 'refunded',
      certificateIssued: false,
      certificateId: null
    }

    rosters[workshopId] = list
    save(ROSTERS_STORAGE_KEY, rosters)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'REFUND_WORKSHOP_ENROLLMENT',
      entityId: workshopId,
      entityName: `Refund for ${entry.farmerName} (₹${entry.amountPaidINR})`,
      collection: 'workshops',
      previousState: 'captured',
      newState: 'refunded',
      reason
    })

    return { success: true, enrollmentId, farmerName: entry.farmerName }
  },

  batchUpdateWorkshopStatus: async (ids, newStatus, reason = 'Batch workshop status transition', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(WORKSHOPS_STORAGE_KEY, mockWorkshops)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((w) => {
      if (idSet.has(w.id)) {
        modifiedCount++
        return {
          ...w,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return w
    })

    save(WORKSHOPS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_WORKSHOP_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} workshops`,
      collection: 'workshops',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 5. EXPERT TALKS (expert_talks)
  // -------------------------------------------------------------
  listExpertTalks: async ({
    q = '',
    status = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const needle = q.trim().toLowerCase()

    list = list.filter((t) => {
      if (status !== 'all' && t.status !== status) return false
      if (!matchesDateRange(t.dateScheduled || t.createdAt, dateRange)) return false
      if (!matchesPersona(t, persona)) return false
      if (!needle) return true

      return [
        t.id,
        t.title,
        t.scientistName,
        t.scientistDesignation,
        t.kvkOrInstitute,
        t.specialization,
        t.zoomWebinarId
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getExpertTalkById: async (id) => {
    const list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const talk = list.find((t) => t.id === id)
    if (!talk) throw new Error(`Expert talk with ID ${id} not found.`)
    return talk
  },

  createExpertTalk: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const newId = `talk_${Date.now().toString().slice(-4)}`
    const now = new Date().toISOString()

    const newTalk = {
      id: newId,
      title: payload.title || 'Untitled Ask-the-Scientist Session',
      scientistName: payload.scientistName || 'Dr. KVK Senior Scientist',
      scientistDesignation: payload.scientistDesignation || 'Principal Investigator, Plant Pathology',
      kvkOrInstitute: payload.kvkOrInstitute || 'ICAR-KVK Research Institute',
      specialization: payload.specialization || 'Agronomy & Crop Physiology',
      dateScheduled: payload.dateScheduled || now,
      durationMinutes: Number(payload.durationMinutes) || 90,
      status: 'scheduled',
      recordingUrl: payload.recordingUrl || null,
      zoomWebinarId: payload.zoomWebinarId || `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      questionsCount: 0,
      farmerQuestions: [],
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newTalk, ...list]
    save(TALKS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'SCHEDULE_EXPERT_TALK',
      entityId: newId,
      entityName: newTalk.title,
      collection: 'expert_talks',
      previousState: 'none',
      newState: newTalk.status,
      reason: payload.reason || `Scheduled live Q&A session with ${newTalk.scientistName}`
    })

    return newTalk
  },

  updateExpertTalk: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const idx = list.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`Expert talk with ID ${id} not found.`)

    const prev = list[idx]
    const updatedTalk = {
      ...prev,
      ...patch,
      durationMinutes: patch.durationMinutes !== undefined ? Number(patch.durationMinutes) : prev.durationMinutes,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedTalk
    save(TALKS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_EXPERT_TALK',
      entityId: id,
      entityName: updatedTalk.title,
      collection: 'expert_talks',
      previousState: prev.status,
      newState: updatedTalk.status,
      reason: patch.reason || `Updated expert talk timing or scientist profile.`
    })

    return updatedTalk
  },

  triageFarmerQuestion: async (talkId, questionId, { status = 'approved', priority = 'high', reason = 'Relevant agronomy query' } = {}, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const talkIdx = list.findIndex((t) => t.id === talkId)
    if (talkIdx === -1) throw new Error(`Talk with ID ${talkId} not found.`)

    const talk = list[talkIdx]
    const qIdx = (talk.farmerQuestions || []).findIndex((q) => q.id === questionId)
    if (qIdx === -1) throw new Error(`Question ${questionId} not found in talk ${talkId}.`)

    const prevQ = talk.farmerQuestions[qIdx]
    talk.farmerQuestions[qIdx] = {
      ...prevQ,
      status,
      priority
    }

    save(TALKS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'TRIAGE_FARMER_QUESTION',
      entityId: talkId,
      entityName: talk.title,
      collection: 'expert_talks',
      previousState: prevQ.status,
      newState: `${status}_${priority}`,
      reason: `Triaged query from ${prevQ.farmerName}. Rationale: ${reason}`
    })

    return { success: true, talkId, questionId, status, priority }
  },

  batchUpdateTalkStatus: async (ids, newStatus, reason = 'Batch talk status update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(TALKS_STORAGE_KEY, mockExpertTalks)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((t) => {
      if (idSet.has(t.id)) {
        modifiedCount++
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return t
    })

    save(TALKS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_TALK_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} expert talks`,
      collection: 'expert_talks',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 6. VIDEO GUIDES (video_guides)
  // -------------------------------------------------------------
  listVideoGuides: async ({
    q = '',
    status = 'all',
    category = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const needle = q.trim().toLowerCase()

    list = list.filter((v) => {
      if (status !== 'all' && v.status !== status) return false
      if (category !== 'all' && v.category !== category) return false
      if (!matchesDateRange(v.createdAt, dateRange)) return false
      if (!matchesPersona(v, persona)) return false
      if (!needle) return true

      return [
        v.id,
        v.title,
        v.description,
        v.category,
        v.videoUrl,
        ...(v.tags || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getVideoGuideById: async (id) => {
    const list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const vid = list.find((v) => v.id === id)
    if (!vid) throw new Error(`Video guide with ID ${id} not found.`)
    return vid
  },

  createVideoGuide: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const newId = `vid_${Date.now().toString().slice(-4)}`
    const now = new Date().toISOString()

    const newVideo = {
      id: newId,
      title: payload.title || 'Untitled Video Tutorial',
      description: payload.description || '',
      translations: payload.translations || {
        en: { title: payload.title, description: payload.description },
        mr: { title: payload.title, description: payload.description },
        hi: { title: payload.title, description: payload.description }
      },
      category: payload.category || 'Crop Protection',
      videoUrl: payload.videoUrl || 'https://cdn.agrovercity.in/videos/tutorials/default_guide.mp4',
      thumbnailUrl: payload.thumbnailUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d69102a00?w=600&auto=format&fit=crop&q=60',
      durationSeconds: Number(payload.durationSeconds) || 600,
      viewCount: 0,
      likeCount: 0,
      status: payload.status || 'published',
      tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags ? payload.tags.split(',').map((t) => t.trim()) : ['Agronomy']),
      featured: Boolean(payload.featured),
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newVideo, ...list]
    save(VIDEOS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'PUBLISH_VIDEO_GUIDE',
      entityId: newId,
      entityName: newVideo.title,
      collection: 'video_guides',
      previousState: 'none',
      newState: newVideo.status,
      reason: payload.reason || `Published video tutorial in category: ${newVideo.category}`
    })

    return newVideo
  },

  updateVideoGuide: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const idx = list.findIndex((v) => v.id === id)
    if (idx === -1) throw new Error(`Video guide with ID ${id} not found.`)

    const prev = list[idx]
    const updatedVideo = {
      ...prev,
      ...patch,
      tags: Array.isArray(patch.tags) ? patch.tags : (patch.tags ? patch.tags.split(',').map((t) => t.trim()) : prev.tags),
      durationSeconds: patch.durationSeconds !== undefined ? Number(patch.durationSeconds) : prev.durationSeconds,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedVideo
    save(VIDEOS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_VIDEO_GUIDE',
      entityId: id,
      entityName: updatedVideo.title,
      collection: 'video_guides',
      previousState: prev.status,
      newState: updatedVideo.status,
      reason: patch.reason || `Updated video metadata, tags, or stream URL.`
    })

    return updatedVideo
  },

  deleteVideoGuide: async (id, reason = 'Video content unlisted/removed', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const vid = list.find((v) => v.id === id)
    if (!vid) throw new Error(`Video guide with ID ${id} not found.`)

    const filtered = list.filter((v) => v.id !== id)
    save(VIDEOS_STORAGE_KEY, filtered)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'DELETE_VIDEO_GUIDE',
      entityId: id,
      entityName: vid.title,
      collection: 'video_guides',
      previousState: vid.status,
      newState: 'deleted',
      reason
    })

    return { success: true, id }
  },

  batchUpdateVideoStatus: async (ids, newStatus, reason = 'Batch video status update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(VIDEOS_STORAGE_KEY, mockVideoGuides)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((v) => {
      if (idSet.has(v.id)) {
        modifiedCount++
        return {
          ...v,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return v
    })

    save(VIDEOS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_VIDEO_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} video guides`,
      collection: 'video_guides',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 7. KNOWLEDGE BLOG ARTICLES (blog_articles)
  // -------------------------------------------------------------
  listBlogArticles: async ({
    q = '',
    status = 'all',
    category = 'all',
    dateRange = 'all',
    persona = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const needle = q.trim().toLowerCase()

    list = list.filter((b) => {
      if (status !== 'all' && b.status !== status) return false
      if (category !== 'all' && b.category !== category) return false
      if (!matchesDateRange(b.publishedAt || b.createdAt, dateRange)) return false
      if (!matchesPersona(b, persona)) return false
      if (!needle) return true

      return [
        b.id,
        b.title,
        b.slug,
        b.excerpt,
        b.contentMarkdown,
        b.category,
        b.authorName,
        b.authorRole,
        ...(b.tags || [])
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getBlogArticleById: async (id) => {
    const list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const blog = list.find((b) => b.id === id)
    if (!blog) throw new Error(`Blog article with ID ${id} not found.`)
    return blog
  },

  createBlogArticle: async (payload, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const newId = `blog_${Date.now().toString().slice(-4)}`
    const autoSlug = (payload.slug || payload.title || 'blog').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const now = new Date().toISOString()

    const newBlog = {
      id: newId,
      title: payload.title || 'Untitled Agronomy Blog Article',
      slug: autoSlug,
      excerpt: payload.excerpt || '',
      contentMarkdown: payload.contentMarkdown || '',
      translations: payload.translations || {
        en: { title: payload.title, excerpt: payload.excerpt },
        mr: { title: payload.title, excerpt: payload.excerpt },
        hi: { title: payload.title, excerpt: payload.excerpt }
      },
      category: payload.category || 'Success Stories',
      authorName: payload.authorName || adminName,
      authorRole: payload.authorRole || 'Editorial Board Member',
      readTimeMinutes: Number(payload.readTimeMinutes) || 6,
      coverImageUrl: payload.coverImageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=60',
      status: payload.status || 'published',
      publishedAt: payload.status === 'published' ? now : null,
      tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags ? payload.tags.split(',').map((t) => t.trim()) : ['Agriculture']),
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      userId: adminUid
    }

    const updated = [newBlog, ...list]
    save(BLOGS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'PUBLISH_BLOG_ARTICLE',
      entityId: newId,
      entityName: newBlog.title,
      collection: 'blog_articles',
      previousState: 'none',
      newState: newBlog.status,
      reason: payload.reason || `Published knowledge article in category: ${newBlog.category}`
    })

    return newBlog
  },

  updateBlogArticle: async (id, patch, adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const idx = list.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error(`Blog article with ID ${id} not found.`)

    const prev = list[idx]
    const updatedBlog = {
      ...prev,
      ...patch,
      tags: Array.isArray(patch.tags) ? patch.tags : (patch.tags ? patch.tags.split(',').map((t) => t.trim()) : prev.tags),
      readTimeMinutes: patch.readTimeMinutes !== undefined ? Number(patch.readTimeMinutes) : prev.readTimeMinutes,
      updatedAt: new Date().toISOString()
    }

    list[idx] = updatedBlog
    save(BLOGS_STORAGE_KEY, list)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'UPDATE_BLOG_ARTICLE',
      entityId: id,
      entityName: updatedBlog.title,
      collection: 'blog_articles',
      previousState: prev.status,
      newState: updatedBlog.status,
      reason: patch.reason || `Updated blog article markdown or editorial metadata.`
    })

    return updatedBlog
  },

  deleteBlogArticle: async (id, reason = 'Archived/deleted knowledge blog', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const blog = list.find((b) => b.id === id)
    if (!blog) throw new Error(`Blog article with ID ${id} not found.`)

    const filtered = list.filter((b) => b.id !== id)
    save(BLOGS_STORAGE_KEY, filtered)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'DELETE_BLOG_ARTICLE',
      entityId: id,
      entityName: blog.title,
      collection: 'blog_articles',
      previousState: blog.status,
      newState: 'deleted',
      reason
    })

    return { success: true, id }
  },

  batchUpdateBlogStatus: async (ids, newStatus, reason = 'Batch blog status update', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    const list = getStored(BLOGS_STORAGE_KEY, mockBlogArticles)
    const idSet = new Set(ids)
    let modifiedCount = 0

    const updated = list.map((b) => {
      if (idSet.has(b.id)) {
        modifiedCount++
        return {
          ...b,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return b
    })

    save(BLOGS_STORAGE_KEY, updated)

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'BATCH_UPDATE_BLOG_STATUS',
      entityId: ids.join(','),
      entityName: `${modifiedCount} blog articles`,
      collection: 'blog_articles',
      previousState: 'mixed',
      newState: newStatus,
      reason
    })

    return { success: true, count: modifiedCount }
  },

  // -------------------------------------------------------------
  // 8. AUDIT LOGS (audit_logs)
  // -------------------------------------------------------------
  getContentAuditLogs: async ({
    q = '',
    actionType = 'all',
    dateRange = 'all',
    page = 1,
    pageSize = 20
  } = {}) => {
    let list = getStoredAuditLogs()
    const needle = q.trim().toLowerCase()

    list = list.filter((log) => {
      if (actionType !== 'all' && log.actionType !== actionType) return false
      if (!matchesDateRange(log.timestamp, dateRange)) return false
      if (!needle) return true

      return [
        log.id,
        log.adminUid,
        log.adminName,
        log.actionType,
        log.entityId,
        log.entityName,
        log.collection,
        log.previousState,
        log.newState,
        log.reason
      ].some((val) => String(val || '').toLowerCase().includes(needle))
    })

    return paginateItems(list, page, pageSize)
  },

  getEntityAuditLogs: async (entityId) => {
    const list = getStoredAuditLogs()
    return list.filter((l) => l.entityId === entityId || (l.entityId && l.entityId.includes(entityId)))
  },

  recordAuditLog,

  // -------------------------------------------------------------
  // 9. BENCHMARK SEED RESET
  // -------------------------------------------------------------
  resetToDefaultSeed: async (reason = 'Restored SOP-20 benchmark seed dataset', adminUid = 'usr_admin_root', adminName = 'Super Admin') => {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(mockAgriNews))
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(mockAgriChannels))
    localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(mockWorkshops))
    localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(mockWorkshopRosters))
    localStorage.setItem(TALKS_STORAGE_KEY, JSON.stringify(mockExpertTalks))
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(mockVideoGuides))
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(mockBlogArticles))

    recordAuditLog({
      adminUid,
      adminName,
      actionType: 'RESET_SEED_DATA',
      entityId: 'SYSTEM_SOP_20',
      entityName: 'Knowledge Hub & Content CMS Target Collections',
      collection: 'system',
      previousState: 'custom_state',
      newState: 'default_seed',
      reason
    })

    return { success: true, message: 'All Module 20 collections reset to official benchmark state.' }
  }
}
