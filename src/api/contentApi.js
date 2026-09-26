import { request } from './client'
import { adminContentService } from '../services/adminContentService'

let apiDisabled = false

function toQueryString(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      q.append(k, String(v))
    }
  })
  const str = q.toString()
  return str ? `?${str}` : ''
}

// -------------------------------------------------------------
// 1. CONTENT SUMMARY
// -------------------------------------------------------------
export async function getContentSummary() {
  if (apiDisabled) {
    return adminContentService.getContentSummary()
  }
  try {
    const res = await request('GET', '/v1/admin/content/summary')
    return res?.data || (await adminContentService.getContentSummary())
  } catch {
    apiDisabled = true
    return adminContentService.getContentSummary()
  }
}

// -------------------------------------------------------------
// 2. AGRI NEWS (agri_news)
// -------------------------------------------------------------
export async function listAgriNews(params = {}) {
  if (apiDisabled) {
    return adminContentService.listAgriNews(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/agri_news${qs}`)
    return res?.data || (await adminContentService.listAgriNews(params))
  } catch {
    apiDisabled = true
    return adminContentService.listAgriNews(params)
  }
}

export async function getAgriNewsById(id) {
  if (apiDisabled) {
    return adminContentService.getAgriNewsById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/agri_news/${id}`)
    return res?.data || (await adminContentService.getAgriNewsById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getAgriNewsById(id)
  }
}

export async function createAgriNews(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createAgriNews(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/agri_news', payload)
    return res?.data || (await adminContentService.createAgriNews(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createAgriNews(payload, adminUid, adminName)
  }
}

export async function updateAgriNews(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateAgriNews(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/agri_news/${id}`, patch)
    return res?.data || (await adminContentService.updateAgriNews(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateAgriNews(id, patch, adminUid, adminName)
  }
}

export async function deleteAgriNews(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.deleteAgriNews(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/v1/admin/content/agri_news/${id}`, { reason })
    return res?.data || (await adminContentService.deleteAgriNews(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.deleteAgriNews(id, reason, adminUid, adminName)
  }
}

export async function batchUpdateNewsStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateNewsStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 3. AGRI CHANNELS (agri_channels)
// -------------------------------------------------------------
export async function listAgriChannels(params = {}) {
  if (apiDisabled) {
    return adminContentService.listAgriChannels(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/agri_channels${qs}`)
    return res?.data || (await adminContentService.listAgriChannels(params))
  } catch {
    apiDisabled = true
    return adminContentService.listAgriChannels(params)
  }
}

export async function getAgriChannelById(id) {
  if (apiDisabled) {
    return adminContentService.getAgriChannelById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/agri_channels/${id}`)
    return res?.data || (await adminContentService.getAgriChannelById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getAgriChannelById(id)
  }
}

export async function createAgriChannel(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createAgriChannel(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/agri_channels', payload)
    return res?.data || (await adminContentService.createAgriChannel(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createAgriChannel(payload, adminUid, adminName)
  }
}

export async function updateAgriChannel(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateAgriChannel(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/agri_channels/${id}`, patch)
    return res?.data || (await adminContentService.updateAgriChannel(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateAgriChannel(id, patch, adminUid, adminName)
  }
}

export async function regenerateStreamKey(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.regenerateStreamKey(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/agri_channels/${id}/regenerate-key`, { reason })
    return res?.data || (await adminContentService.regenerateStreamKey(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.regenerateStreamKey(id, reason, adminUid, adminName)
  }
}

export async function listChannelChatMessages(channelId) {
  if (apiDisabled) {
    return adminContentService.listChannelChatMessages(channelId)
  }
  try {
    const res = await request('GET', `/v1/admin/content/agri_channels/${channelId}/chat`)
    return res?.data || (await adminContentService.listChannelChatMessages(channelId))
  } catch {
    apiDisabled = true
    return adminContentService.listChannelChatMessages(channelId)
  }
}

export async function deleteChatMessage(channelId, messageId, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.deleteChatMessage(channelId, messageId, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/v1/admin/content/agri_channels/${channelId}/chat/${messageId}`, { reason })
    return res?.data || (await adminContentService.deleteChatMessage(channelId, messageId, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.deleteChatMessage(channelId, messageId, reason, adminUid, adminName)
  }
}

export async function banChatUser(channelId, userId, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.banChatUser(channelId, userId, payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/agri_channels/${channelId}/ban-user`, { userId, ...payload })
    return res?.data || (await adminContentService.banChatUser(channelId, userId, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.banChatUser(channelId, userId, payload, adminUid, adminName)
  }
}

export async function batchUpdateChannelStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateChannelStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 4. WORKSHOPS (workshops)
// -------------------------------------------------------------
export async function listWorkshops(params = {}) {
  if (apiDisabled) {
    return adminContentService.listWorkshops(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/workshops${qs}`)
    return res?.data || (await adminContentService.listWorkshops(params))
  } catch {
    apiDisabled = true
    return adminContentService.listWorkshops(params)
  }
}

export async function getWorkshopById(id) {
  if (apiDisabled) {
    return adminContentService.getWorkshopById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/workshops/${id}`)
    return res?.data || (await adminContentService.getWorkshopById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getWorkshopById(id)
  }
}

export async function createWorkshop(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createWorkshop(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/workshops', payload)
    return res?.data || (await adminContentService.createWorkshop(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createWorkshop(payload, adminUid, adminName)
  }
}

export async function updateWorkshop(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateWorkshop(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/workshops/${id}`, patch)
    return res?.data || (await adminContentService.updateWorkshop(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateWorkshop(id, patch, adminUid, adminName)
  }
}

export async function cancelWorkshop(id, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.cancelWorkshop(id, payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/workshops/${id}/cancel`, payload)
    return res?.data || (await adminContentService.cancelWorkshop(id, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.cancelWorkshop(id, payload, adminUid, adminName)
  }
}

export async function getWorkshopRoster(workshopId) {
  if (apiDisabled) {
    return adminContentService.getWorkshopRoster(workshopId)
  }
  try {
    const res = await request('GET', `/v1/admin/content/workshops/${workshopId}/roster`)
    return res?.data || (await adminContentService.getWorkshopRoster(workshopId))
  } catch {
    apiDisabled = true
    return adminContentService.getWorkshopRoster(workshopId)
  }
}

export async function issueWorkshopCertificate(workshopId, enrollmentId, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.issueWorkshopCertificate(workshopId, enrollmentId, reason, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/workshops/${workshopId}/roster/${enrollmentId}/certificate`, { reason })
    return res?.data || (await adminContentService.issueWorkshopCertificate(workshopId, enrollmentId, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.issueWorkshopCertificate(workshopId, enrollmentId, reason, adminUid, adminName)
  }
}

export async function refundWorkshopEnrollment(workshopId, enrollmentId, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.refundWorkshopEnrollment(workshopId, enrollmentId, payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/workshops/${workshopId}/roster/${enrollmentId}/refund`, payload)
    return res?.data || (await adminContentService.refundWorkshopEnrollment(workshopId, enrollmentId, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.refundWorkshopEnrollment(workshopId, enrollmentId, payload, adminUid, adminName)
  }
}

export async function batchUpdateWorkshopStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateWorkshopStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 5. EXPERT TALKS (expert_talks)
// -------------------------------------------------------------
export async function listExpertTalks(params = {}) {
  if (apiDisabled) {
    return adminContentService.listExpertTalks(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/expert_talks${qs}`)
    return res?.data || (await adminContentService.listExpertTalks(params))
  } catch {
    apiDisabled = true
    return adminContentService.listExpertTalks(params)
  }
}

export async function getExpertTalkById(id) {
  if (apiDisabled) {
    return adminContentService.getExpertTalkById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/expert_talks/${id}`)
    return res?.data || (await adminContentService.getExpertTalkById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getExpertTalkById(id)
  }
}

export async function createExpertTalk(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createExpertTalk(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/expert_talks', payload)
    return res?.data || (await adminContentService.createExpertTalk(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createExpertTalk(payload, adminUid, adminName)
  }
}

export async function updateExpertTalk(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateExpertTalk(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/expert_talks/${id}`, patch)
    return res?.data || (await adminContentService.updateExpertTalk(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateExpertTalk(id, patch, adminUid, adminName)
  }
}

export async function triageFarmerQuestion(talkId, questionId, payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.triageFarmerQuestion(talkId, questionId, payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', `/v1/admin/content/expert_talks/${talkId}/questions/${questionId}/triage`, payload)
    return res?.data || (await adminContentService.triageFarmerQuestion(talkId, questionId, payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.triageFarmerQuestion(talkId, questionId, payload, adminUid, adminName)
  }
}

export async function batchUpdateTalkStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateTalkStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 6. VIDEO GUIDES (video_guides)
// -------------------------------------------------------------
export async function listVideoGuides(params = {}) {
  if (apiDisabled) {
    return adminContentService.listVideoGuides(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/video_guides${qs}`)
    return res?.data || (await adminContentService.listVideoGuides(params))
  } catch {
    apiDisabled = true
    return adminContentService.listVideoGuides(params)
  }
}

export async function getVideoGuideById(id) {
  if (apiDisabled) {
    return adminContentService.getVideoGuideById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/video_guides/${id}`)
    return res?.data || (await adminContentService.getVideoGuideById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getVideoGuideById(id)
  }
}

export async function createVideoGuide(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createVideoGuide(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/video_guides', payload)
    return res?.data || (await adminContentService.createVideoGuide(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createVideoGuide(payload, adminUid, adminName)
  }
}

export async function updateVideoGuide(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateVideoGuide(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/video_guides/${id}`, patch)
    return res?.data || (await adminContentService.updateVideoGuide(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateVideoGuide(id, patch, adminUid, adminName)
  }
}

export async function deleteVideoGuide(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.deleteVideoGuide(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/v1/admin/content/video_guides/${id}`, { reason })
    return res?.data || (await adminContentService.deleteVideoGuide(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.deleteVideoGuide(id, reason, adminUid, adminName)
  }
}

export async function batchUpdateVideoStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateVideoStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 7. KNOWLEDGE BLOGS (blog_articles)
// -------------------------------------------------------------
export async function listBlogArticles(params = {}) {
  if (apiDisabled) {
    return adminContentService.listBlogArticles(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/blog_articles${qs}`)
    return res?.data || (await adminContentService.listBlogArticles(params))
  } catch {
    apiDisabled = true
    return adminContentService.listBlogArticles(params)
  }
}

export async function getBlogArticleById(id) {
  if (apiDisabled) {
    return adminContentService.getBlogArticleById(id)
  }
  try {
    const res = await request('GET', `/v1/admin/content/blog_articles/${id}`)
    return res?.data || (await adminContentService.getBlogArticleById(id))
  } catch {
    apiDisabled = true
    return adminContentService.getBlogArticleById(id)
  }
}

export async function createBlogArticle(payload, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.createBlogArticle(payload, adminUid, adminName)
  }
  try {
    const res = await request('POST', '/v1/admin/content/blog_articles', payload)
    return res?.data || (await adminContentService.createBlogArticle(payload, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.createBlogArticle(payload, adminUid, adminName)
  }
}

export async function updateBlogArticle(id, patch, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.updateBlogArticle(id, patch, adminUid, adminName)
  }
  try {
    const res = await request('PUT', `/v1/admin/content/blog_articles/${id}`, patch)
    return res?.data || (await adminContentService.updateBlogArticle(id, patch, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.updateBlogArticle(id, patch, adminUid, adminName)
  }
}

export async function deleteBlogArticle(id, reason, adminUid, adminName) {
  if (apiDisabled) {
    return adminContentService.deleteBlogArticle(id, reason, adminUid, adminName)
  }
  try {
    const res = await request('DELETE', `/v1/admin/content/blog_articles/${id}`, { reason })
    return res?.data || (await adminContentService.deleteBlogArticle(id, reason, adminUid, adminName))
  } catch {
    apiDisabled = true
    return adminContentService.deleteBlogArticle(id, reason, adminUid, adminName)
  }
}

export async function batchUpdateBlogStatus(ids, newStatus, reason, adminUid, adminName) {
  return adminContentService.batchUpdateBlogStatus(ids, newStatus, reason, adminUid, adminName)
}

// -------------------------------------------------------------
// 8. AUDIT LOGS (audit_logs)
// -------------------------------------------------------------
export async function getContentAuditLogs(params = {}) {
  if (apiDisabled) {
    return adminContentService.getContentAuditLogs(params)
  }
  try {
    const qs = toQueryString(params)
    const res = await request('GET', `/v1/admin/content/audit_logs${qs}`)
    return res?.data || (await adminContentService.getContentAuditLogs(params))
  } catch {
    apiDisabled = true
    return adminContentService.getContentAuditLogs(params)
  }
}

export async function getEntityAuditLogs(entityId) {
  return adminContentService.getEntityAuditLogs(entityId)
}

// -------------------------------------------------------------
// 9. BENCHMARK SEED RESET
// -------------------------------------------------------------
export async function resetContentSeedData(reason, adminUid, adminName) {
  return adminContentService.resetToDefaultSeed(reason, adminUid, adminName)
}
