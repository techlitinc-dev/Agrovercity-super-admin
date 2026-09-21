import { request } from './client'
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
} from './contentMockData'

let mockMode = false

function paginate(list, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length
  }
}

// In-memory state for mutations
let newsState = JSON.parse(JSON.stringify(mockAgriNews))
let channelsState = JSON.parse(JSON.stringify(mockAgriChannels))
let workshopsState = JSON.parse(JSON.stringify(mockWorkshops))
let rostersState = JSON.parse(JSON.stringify(mockWorkshopRosters))
let talksState = JSON.parse(JSON.stringify(mockExpertTalks))
let videosState = JSON.parse(JSON.stringify(mockVideoGuides))
let blogsState = JSON.parse(JSON.stringify(mockBlogArticles))
let auditLogsState = JSON.parse(JSON.stringify(mockContentAuditLogs))

function recordAudit({ actionType, entityId, entityName, collection, previousState, newState, reason, adminName = 'Super Admin' }) {
  const logEntry = {
    id: `aud_cnt_${Date.now()}`,
    adminUid: 'usr_admin_root',
    adminName,
    timestamp: new Date().toISOString(),
    ipAddress: '10.0.4.15',
    actionType,
    entityId,
    entityName,
    collection,
    previousState,
    newState,
    reason: reason || 'Superadmin routine administrative action'
  }
  auditLogsState.unshift(logEntry)
  return logEntry
}

export async function getContentSummary() {
  if (!mockMode) {
    try {
      return await request('GET', '/admin/content/summary')
    } catch {
      mockMode = true
    }
  }

  const liveChans = channelsState.filter((c) => c.status === 'live')
  const totalViewers = liveChans.reduce((sum, c) => sum + (c.activeViewers || 0), 0)
  const totalRevenue = workshopsState.reduce((sum, w) => sum + (w.enrolledCount * w.feeINR), 0)
  const totalSeats = workshopsState.reduce((sum, w) => sum + w.enrolledCount, 0)
  const pendingQuestions = talksState.reduce((sum, t) => sum + (t.farmerQuestions?.filter(q => q.status === 'pending_triage')?.length || 0), 0)
  const flaggedChat = channelsState.reduce((sum, c) => sum + (c.chatMessages?.filter(m => m.moderationStatus === 'flagged')?.length || 0), 0)

  return {
    ...mockContentSummary,
    totalActiveContent: newsState.length + channelsState.length + workshopsState.length + talksState.length + videosState.length + blogsState.length,
    totalNewsArticles: newsState.length,
    liveChannelsCount: liveChans.length,
    totalLiveViewers: totalViewers || mockContentSummary.totalLiveViewers,
    activeWorkshops: workshopsState.filter((w) => w.status === 'upcoming' || w.status === 'ongoing').length,
    enrolledFarmersCount: totalSeats,
    workshopRevenueINR: totalRevenue,
    expertTalksScheduled: talksState.filter((t) => t.status === 'scheduled').length,
    farmerQuestionsPendingTriage: pendingQuestions,
    flaggedChatMessages: flaggedChat,
    videoGuidesPublished: videosState.filter((v) => v.status === 'published').length,
    blogArticlesPublished: blogsState.filter((b) => b.status === 'published').length
  }
}

// -------------------------------------------------------------
// 1. AGRI NEWS (agri_news)
// -------------------------------------------------------------
export async function listAgriNews({ q = '', status = 'all', language = 'all', category = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, language, category, page, pageSize })
      return await request('GET', `/admin/content/agri_news?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = newsState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (language !== 'all' && item.language !== language) return false
    if (category !== 'all' && item.category !== category) return false
    if (!needle) return true
    return [item.id, item.title, item.headline, item.author, item.source, ...(item.tags || [])]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createAgriNews(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/agri_news', payload)
    } catch {
      mockMode = true
    }
  }

  const newItem = {
    id: `news_${Date.now()}`,
    ...payload,
    readCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  newsState.unshift(newItem)
  recordAudit({
    actionType: 'CREATE_NEWS_ARTICLE',
    entityId: newItem.id,
    entityName: newItem.title,
    collection: 'agri_news',
    previousState: 'none',
    newState: newItem.status,
    reason: `Created news article with ${newItem.breaking ? 'breaking' : 'standard'} priority and vernacular audio.`
  })
  return newItem
}

export async function updateAgriNews(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/agri_news/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = newsState.findIndex((item) => item.id === id)
  if (idx === -1) throw new Error('News item not found')
  const prev = { ...newsState[idx] }
  newsState[idx] = {
    ...newsState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_NEWS_ARTICLE',
    entityId: id,
    entityName: newsState[idx].title,
    collection: 'agri_news',
    previousState: prev.status,
    newState: newsState[idx].status,
    reason: payload.reason || 'Admin updated article content/status'
  })

  return newsState[idx]
}

export async function deleteAgriNews(id, reason = 'Administrative deletion') {
  if (!mockMode) {
    try {
      return await request('DELETE', `/admin/content/agri_news/${id}`, { reason })
    } catch {
      mockMode = true
    }
  }

  const idx = newsState.findIndex((item) => item.id === id)
  if (idx === -1) throw new Error('News item not found')
  const removed = newsState.splice(idx, 1)[0]

  recordAudit({
    actionType: 'DELETE_NEWS_ARTICLE',
    entityId: id,
    entityName: removed.title,
    collection: 'agri_news',
    previousState: removed.status,
    newState: 'deleted',
    reason
  })

  return { success: true, id }
}

// -------------------------------------------------------------
// 2. AGRI CHANNELS (agri_channels) & LIVE CHAT MODERATION
// -------------------------------------------------------------
export async function listAgriChannels({ q = '', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, page, pageSize })
      return await request('GET', `/admin/content/agri_channels?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = channelsState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true
    return [item.id, item.channelName, item.callsign, item.category]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createAgriChannel(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/agri_channels', payload)
    } catch {
      mockMode = true
    }
  }

  const randomKey = 'live_stream_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 8)
  const newChan = {
    id: `chan_${Date.now()}`,
    ...payload,
    streamKey: randomKey,
    activeViewers: 0,
    peakViewersToday: 0,
    chatMessages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  channelsState.unshift(newChan)
  recordAudit({
    actionType: 'CREATE_LIVE_CHANNEL',
    entityId: newChan.id,
    entityName: newChan.channelName,
    collection: 'agri_channels',
    previousState: 'none',
    newState: newChan.status,
    reason: `Configured new broadcast channel ${newChan.callsign} with RTMP ingest.`
  })
  return newChan
}

export async function updateAgriChannel(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/agri_channels/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = channelsState.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Channel not found')
  const prev = { ...channelsState[idx] }
  channelsState[idx] = {
    ...channelsState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_CHANNEL_STATUS',
    entityId: id,
    entityName: channelsState[idx].channelName,
    collection: 'agri_channels',
    previousState: prev.status,
    newState: channelsState[idx].status,
    reason: payload.reason || 'Admin modified channel configuration/status'
  })

  return channelsState[idx]
}

export async function regenerateStreamKey(channelId, reason) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/content/agri_channels/${channelId}/regenerate-key`, { reason })
    } catch {
      mockMode = true
    }
  }

  const idx = channelsState.findIndex((c) => c.id === channelId)
  if (idx === -1) throw new Error('Channel not found')
  const newKey = 'live_sec_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 8)
  channelsState[idx].streamKey = newKey
  channelsState[idx].updatedAt = new Date().toISOString()

  recordAudit({
    actionType: 'REGENERATE_STREAM_KEY',
    entityId: channelId,
    entityName: channelsState[idx].channelName,
    collection: 'agri_channels',
    previousState: 'old_key_revoked',
    newState: 'new_key_issued',
    reason: reason || 'Administrative stream key rotation'
  })

  return { success: true, streamKey: newKey }
}

export async function listChannelChatMessages(channelId) {
  if (!mockMode) {
    try {
      return await request('GET', `/admin/content/agri_channels/${channelId}/chat`)
    } catch {
      mockMode = true
    }
  }

  const chan = channelsState.find((c) => c.id === channelId)
  if (!chan) throw new Error('Channel not found')
  return chan.chatMessages || []
}

export async function deleteChatMessage(channelId, messageId, reason) {
  if (!mockMode) {
    try {
      return await request('DELETE', `/admin/content/agri_channels/${channelId}/chat/${messageId}`, { reason })
    } catch {
      mockMode = true
    }
  }

  const chan = channelsState.find((c) => c.id === channelId)
  if (!chan) throw new Error('Channel not found')
  const msgIdx = (chan.chatMessages || []).findIndex((m) => m.id === messageId)
  if (msgIdx !== -1) {
    chan.chatMessages[msgIdx].moderationStatus = 'deleted'
  }

  recordAudit({
    actionType: 'DELETE_CHAT_MESSAGE',
    entityId: channelId,
    entityName: `Message ${messageId} in ${chan.channelName}`,
    collection: 'agri_channels',
    previousState: 'approved',
    newState: 'deleted',
    reason: reason || 'Deleted inappropriate chat message'
  })

  return { success: true }
}

export async function banChatUser(channelId, userId, reason, banDuration = 'permanent') {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/content/agri_channels/${channelId}/chat/ban-user`, { userId, reason, banDuration })
    } catch {
      mockMode = true
    }
  }

  const chan = channelsState.find((c) => c.id === channelId)
  if (!chan) throw new Error('Channel not found')
  
  // Mark all user's messages as deleted
  if (chan.chatMessages) {
    chan.chatMessages.forEach((m) => {
      if (m.userId === userId) {
        m.moderationStatus = 'deleted'
      }
    })
  }

  recordAudit({
    actionType: 'BAN_CHAT_USER',
    entityId: channelId,
    entityName: `Banned ${userId} in ${chan.channelName}`,
    collection: 'agri_channels',
    previousState: 'active_chatter',
    newState: `banned_${banDuration}`,
    reason: `User banned (${banDuration}): ${reason}`
  })

  return { success: true, bannedUserId: userId, banDuration }
}

// -------------------------------------------------------------
// 3. WORKSHOPS (workshops) & ROSTERS
// -------------------------------------------------------------
export async function listWorkshops({ q = '', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, page, pageSize })
      return await request('GET', `/admin/content/workshops?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = workshopsState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true
    return [item.id, item.title, item.instructorName, item.icarAccreditationNo]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createWorkshop(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/workshops', payload)
    } catch {
      mockMode = true
    }
  }

  const newWs = {
    id: `ws_${Date.now()}`,
    ...payload,
    enrolledCount: 0,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  workshopsState.unshift(newWs)
  rostersState[newWs.id] = []

  recordAudit({
    actionType: 'CREATE_WORKSHOP',
    entityId: newWs.id,
    entityName: newWs.title,
    collection: 'workshops',
    previousState: 'none',
    newState: 'upcoming',
    reason: `Created ICAR workshop (${newWs.icarAccreditationNo}) with ${newWs.seatsCapacity} seats limit @ ₹${newWs.feeINR}.`
  })

  return newWs
}

export async function updateWorkshop(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/workshops/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = workshopsState.findIndex((w) => w.id === id)
  if (idx === -1) throw new Error('Workshop not found')
  const prev = { ...workshopsState[idx] }
  workshopsState[idx] = {
    ...workshopsState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_WORKSHOP',
    entityId: id,
    entityName: workshopsState[idx].title,
    collection: 'workshops',
    previousState: prev.status,
    newState: workshopsState[idx].status,
    reason: payload.reason || 'Admin updated workshop details/schedule'
  })

  return workshopsState[idx]
}

export async function cancelWorkshop(id, reason, dualSignOffAdmin = null) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/content/workshops/${id}/cancel`, { reason, dualSignOffAdmin })
    } catch {
      mockMode = true
    }
  }

  const idx = workshopsState.findIndex((w) => w.id === id)
  if (idx === -1) throw new Error('Workshop not found')
  const prev = workshopsState[idx].status
  workshopsState[idx].status = 'cancelled'
  workshopsState[idx].updatedAt = new Date().toISOString()

  // Mark all captured roster payments as refunded
  if (rostersState[id]) {
    rostersState[id].forEach((r) => {
      if (r.paymentStatus === 'captured') {
        r.paymentStatus = 'refunded'
      }
    })
  }

  recordAudit({
    actionType: 'CANCEL_WORKSHOP',
    entityId: id,
    entityName: workshopsState[idx].title,
    collection: 'workshops',
    previousState: prev,
    newState: 'cancelled',
    reason: `${reason} ${dualSignOffAdmin ? `(Dual Sign-Off by ${dualSignOffAdmin})` : ''}`
  })

  return workshopsState[idx]
}

export async function getWorkshopRoster(workshopId) {
  if (!mockMode) {
    try {
      return await request('GET', `/admin/workshops/${workshopId}/roster`)
    } catch {
      mockMode = true
    }
  }

  return rostersState[workshopId] || []
}

export async function issueWorkshopCertificate(workshopId, farmerId) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/workshops/${workshopId}/roster/${farmerId}/issue-certificate`)
    } catch {
      mockMode = true
    }
  }

  const rosterList = rostersState[workshopId] || []
  const item = rosterList.find((r) => r.farmerId === farmerId)
  if (!item) throw new Error('Farmer enrollment not found in roster')

  item.certificateIssued = true
  item.attended = true
  item.certificateId = `CERT-ICAR-2026-${Math.floor(1000 + Math.random() * 9000)}`

  recordAudit({
    actionType: 'ISSUE_ICAR_CERTIFICATE',
    entityId: workshopId,
    entityName: `Certificate for ${item.farmerName}`,
    collection: 'workshops',
    previousState: 'completed_pending_cert',
    newState: 'certificate_issued',
    reason: `Verified course attendance and generated ICAR credentials ${item.certificateId}`
  })

  return item
}

export async function refundWorkshopEnrollment(workshopId, farmerId, reason, dualSignOffAdmin = null) {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/workshops/${workshopId}/roster/${farmerId}/refund`, { reason, dualSignOffAdmin })
    } catch {
      mockMode = true
    }
  }

  const rosterList = rostersState[workshopId] || []
  const item = rosterList.find((r) => r.farmerId === farmerId)
  if (!item) throw new Error('Enrollment not found')

  item.paymentStatus = 'refunded'
  const ws = workshopsState.find((w) => w.id === workshopId)
  if (ws && ws.enrolledCount > 0) {
    ws.enrolledCount -= 1
  }

  recordAudit({
    actionType: 'REFUND_WORKSHOP_FEE',
    entityId: workshopId,
    entityName: `Refund ₹${item.amountPaidINR} for ${item.farmerName}`,
    collection: 'workshops',
    previousState: 'captured',
    newState: 'refunded',
    reason: `${reason} ${dualSignOffAdmin ? `[Dual Sign-Off: ${dualSignOffAdmin}]` : ''}`
  })

  return item
}

// -------------------------------------------------------------
// 4. EXPERT TALKS (expert_talks) & QUESTIONS TRIAGE
// -------------------------------------------------------------
export async function listExpertTalks({ q = '', status = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, page, pageSize })
      return await request('GET', `/admin/content/expert_talks?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = talksState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (!needle) return true
    return [item.id, item.title, item.scientistName, item.kvkOrInstitute, item.specialization]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createExpertTalk(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/expert_talks', payload)
    } catch {
      mockMode = true
    }
  }

  const newTalk = {
    id: `talk_${Date.now()}`,
    ...payload,
    status: 'scheduled',
    questionsCount: 0,
    farmerQuestions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  talksState.unshift(newTalk)

  recordAudit({
    actionType: 'SCHEDULE_EXPERT_TALK',
    entityId: newTalk.id,
    entityName: newTalk.title,
    collection: 'expert_talks',
    previousState: 'none',
    newState: 'scheduled',
    reason: `Scheduled talk with ${newTalk.scientistName} (${newTalk.kvkOrInstitute}).`
  })

  return newTalk
}

export async function updateExpertTalk(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/expert_talks/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = talksState.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Expert talk not found')
  const prev = { ...talksState[idx] }
  talksState[idx] = {
    ...talksState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_EXPERT_TALK',
    entityId: id,
    entityName: talksState[idx].title,
    collection: 'expert_talks',
    previousState: prev.status,
    newState: talksState[idx].status,
    reason: payload.reason || 'Admin updated talk details/recording URL'
  })

  return talksState[idx]
}

export async function triageFarmerQuestion(talkId, questionId, status, priority = 'normal', reason = '') {
  if (!mockMode) {
    try {
      return await request('POST', `/admin/content/expert_talks/${talkId}/questions/${questionId}/triage`, { status, priority, reason })
    } catch {
      mockMode = true
    }
  }

  const talk = talksState.find((t) => t.id === talkId)
  if (!talk) throw new Error('Talk not found')
  const qItem = (talk.farmerQuestions || []).find((q) => q.id === questionId)
  if (!qItem) throw new Error('Question not found in queue')

  const prev = qItem.status
  qItem.status = status
  if (priority) qItem.priority = priority

  recordAudit({
    actionType: 'TRIAGE_FARMER_QUESTION',
    entityId: talkId,
    entityName: `Question by ${qItem.farmerName} in ${talk.title}`,
    collection: 'expert_talks',
    previousState: prev,
    newState: status,
    reason: reason || `Triage decision: marked as ${status} with ${priority} priority.`
  })

  return qItem
}

// -------------------------------------------------------------
// 5. VIDEO GUIDES (video_guides)
// -------------------------------------------------------------
export async function listVideoGuides({ q = '', status = 'all', category = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, category, page, pageSize })
      return await request('GET', `/admin/content/video_guides?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = videosState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (category !== 'all' && item.category !== category) return false
    if (!needle) return true
    return [item.id, item.title, item.category, ...(item.tags || [])]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createVideoGuide(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/video_guides', payload)
    } catch {
      mockMode = true
    }
  }

  const newVid = {
    id: `vid_${Date.now()}`,
    ...payload,
    viewCount: 0,
    likeCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  videosState.unshift(newVid)

  recordAudit({
    actionType: 'CREATE_VIDEO_GUIDE',
    entityId: newVid.id,
    entityName: newVid.title,
    collection: 'video_guides',
    previousState: 'none',
    newState: newVid.status,
    reason: 'Published agronomy video guide with multilingual subtitles and tags.'
  })

  return newVid
}

export async function updateVideoGuide(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/video_guides/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = videosState.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error('Video guide not found')
  const prev = { ...videosState[idx] }
  videosState[idx] = {
    ...videosState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_VIDEO_GUIDE',
    entityId: id,
    entityName: videosState[idx].title,
    collection: 'video_guides',
    previousState: prev.status,
    newState: videosState[idx].status,
    reason: payload.reason || 'Updated video guide attributes'
  })

  return videosState[idx]
}

export async function deleteVideoGuide(id, reason = 'Administrative removal') {
  if (!mockMode) {
    try {
      return await request('DELETE', `/admin/content/video_guides/${id}`, { reason })
    } catch {
      mockMode = true
    }
  }

  const idx = videosState.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error('Video not found')
  const removed = videosState.splice(idx, 1)[0]

  recordAudit({
    actionType: 'DELETE_VIDEO_GUIDE',
    entityId: id,
    entityName: removed.title,
    collection: 'video_guides',
    previousState: removed.status,
    newState: 'deleted',
    reason
  })

  return { success: true, id }
}

// -------------------------------------------------------------
// 6. BLOG ARTICLES (blog_articles)
// -------------------------------------------------------------
export async function listBlogArticles({ q = '', status = 'all', category = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, status, category, page, pageSize })
      return await request('GET', `/admin/content/blog_articles?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = blogsState.filter((item) => {
    if (status !== 'all' && item.status !== status) return false
    if (category !== 'all' && item.category !== category) return false
    if (!needle) return true
    return [item.id, item.title, item.authorName, item.category, ...(item.tags || [])]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}

export async function createBlogArticle(payload) {
  if (!mockMode) {
    try {
      return await request('POST', '/admin/content/blog_articles', payload)
    } catch {
      mockMode = true
    }
  }

  const newBlog = {
    id: `blog_${Date.now()}`,
    ...payload,
    viewCount: 0,
    publishedAt: payload.status === 'published' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'usr_admin_root'
  }
  blogsState.unshift(newBlog)

  recordAudit({
    actionType: 'CREATE_BLOG_ARTICLE',
    entityId: newBlog.id,
    entityName: newBlog.title,
    collection: 'blog_articles',
    previousState: 'none',
    newState: newBlog.status,
    reason: `Published agronomic article by ${newBlog.authorName} (${newBlog.category}).`
  })

  return newBlog
}

export async function updateBlogArticle(id, payload) {
  if (!mockMode) {
    try {
      return await request('PUT', `/admin/content/blog_articles/${id}`, payload)
    } catch {
      mockMode = true
    }
  }

  const idx = blogsState.findIndex((b) => b.id === id)
  if (idx === -1) throw new Error('Blog article not found')
  const prev = { ...blogsState[idx] }
  blogsState[idx] = {
    ...blogsState[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  }

  recordAudit({
    actionType: 'UPDATE_BLOG_ARTICLE',
    entityId: id,
    entityName: blogsState[idx].title,
    collection: 'blog_articles',
    previousState: prev.status,
    newState: blogsState[idx].status,
    reason: payload.reason || 'Admin updated blog article'
  })

  return blogsState[idx]
}

export async function deleteBlogArticle(id, reason = 'Administrative removal') {
  if (!mockMode) {
    try {
      return await request('DELETE', `/admin/content/blog_articles/${id}`, { reason })
    } catch {
      mockMode = true
    }
  }

  const idx = blogsState.findIndex((b) => b.id === id)
  if (idx === -1) throw new Error('Blog not found')
  const removed = blogsState.splice(idx, 1)[0]

  recordAudit({
    actionType: 'DELETE_BLOG_ARTICLE',
    entityId: id,
    entityName: removed.title,
    collection: 'blog_articles',
    previousState: removed.status,
    newState: 'deleted',
    reason
  })

  return { success: true, id }
}

// -------------------------------------------------------------
// 7. AUDIT LOGS (audit_logs for Module 20)
// -------------------------------------------------------------
export async function getContentAuditLogs({ q = '', actionType = 'all', page = 1, pageSize = 20 } = {}) {
  if (!mockMode) {
    try {
      const qParams = new URLSearchParams({ q, actionType, page, pageSize })
      return await request('GET', `/admin/content/audit_logs?${qParams.toString()}`)
    } catch {
      mockMode = true
    }
  }

  const needle = q.trim().toLowerCase()
  const filtered = auditLogsState.filter((log) => {
    if (actionType !== 'all' && log.actionType !== actionType) return false
    if (!needle) return true
    return [log.id, log.adminName, log.entityId, log.entityName, log.actionType, log.reason]
      .some((val) => String(val || '').toLowerCase().includes(needle))
  })

  return paginate(filtered, page, pageSize)
}
