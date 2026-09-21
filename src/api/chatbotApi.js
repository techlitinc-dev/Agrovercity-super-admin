import { request } from './client'
import { mockChatSessions, mockHandoffTickets, mockExperts, PROMPT_CONFIG } from './mockData'

let mockMode = false

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  return { data: list.slice(start, start + pageSize), page, pageSize, total: list.length }
}

function filterRows({ q = '', status = 'all', from = '', to = '' }, list, extraFields = []) {
  const needle = q.trim().toLowerCase()
  return list.filter((x) => {
    if (status !== 'all' && x.status !== status) return false
    if (from && x.createdAt < from) return false
    if (to && x.createdAt > `${to}T23:59:59Z`) return false
    if (!needle) return true
    return [x.id, x.farmerName, x.farmerPhone, x.topic, x.language, ...extraFields.map((f) => x[f])]
      .some((v) => String(v).toLowerCase().includes(needle))
  })
}

async function mockRequest(method, path, body) {
  await new Promise((r) => setTimeout(r, 150))
  const assignMatch = path.match(/^\/admin\/chatbot\/handoffs\/([^/]+)\/assign$/)

  if (method === 'GET' && path === '/admin/chatbot/transcripts') {
    return paginate(filterRows(body || {}, mockChatSessions, ['topic', 'engine']), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/chatbot/handoffs') {
    return paginate(filterRows(body || {}, mockHandoffTickets, ['assignedExpertName']), body?.page || 1, body?.pageSize || 20)
  }
  if (method === 'GET' && path === '/admin/chatbot/experts') {
    return { data: mockExperts }
  }
  if (method === 'GET' && path === '/admin/chatbot/prompt-config') {
    return PROMPT_CONFIG
  }
  if (method === 'POST' && assignMatch) {
    const ticket = mockHandoffTickets.find((x) => x.id === assignMatch[1])
    if (!ticket) throw Object.assign(new Error('Not found'), { status: 404 })
    const expert = mockExperts.find((x) => x.id === body.expertId)
    if (!expert) throw Object.assign(new Error('Expert not found'), { status: 422 })
    if (!expert.available) throw Object.assign(new Error('Expert is currently unavailable'), { status: 422 })
    ticket.status = 'assigned'
    ticket.assignedExpertId = expert.id
    ticket.assignedExpertName = `${expert.name} (${expert.organization})`
    ticket.updatedAt = new Date().toISOString()
    expert.activeTickets += 1
    return ticket
  }
  if (method === 'PUT' && path === '/admin/chatbot/prompt-config') {
    if (!body.systemPrompt || body.systemPrompt.trim().length < 20) {
      throw Object.assign(new Error('System prompt must be at least 20 characters'), { status: 422 })
    }
    PROMPT_CONFIG.systemPrompt = body.systemPrompt
    PROMPT_CONFIG.tone = body.tone || PROMPT_CONFIG.tone
    PROMPT_CONFIG.temperature = Number(body.temperature) || PROMPT_CONFIG.temperature
    PROMPT_CONFIG.knowledgeBaseVersion = body.knowledgeBaseVersion || PROMPT_CONFIG.knowledgeBaseVersion
    PROMPT_CONFIG.version += 1
    PROMPT_CONFIG.updatedBy = 'root@agrovercity'
    PROMPT_CONFIG.updatedAt = new Date().toISOString()
    return PROMPT_CONFIG
  }
  throw Object.assign(new Error('No mock handler'), { status: 501 })
}

async function call(method, path, body) {
  if (mockMode) return mockRequest(method, path, body)
  try {
    return await request(method, path, body)
  } catch (err) {
    if (err instanceof TypeError) {
      mockMode = true
      return mockRequest(method, path, body)
    }
    throw err
  }
}

export function isMockMode() {
  return mockMode
}

export function listTranscripts({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/chatbot/transcripts?${params}`)
}

export function listHandoffs({ page = 1, pageSize = 20, q = '', status = 'all', from = '', to = '' }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  if (q) params.set('q', q)
  if (status !== 'all') params.set('status', status)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return call('GET', `/admin/chatbot/handoffs?${params}`)
}

export function listExperts() {
  return call('GET', '/admin/chatbot/experts')
}

export function getPromptConfig() {
  return call('GET', '/admin/chatbot/prompt-config')
}

export function assignExpert(ticketId, expertId, reason) {
  return call('POST', `/admin/chatbot/handoffs/${ticketId}/assign`, { expertId, reason })
}

export function updatePromptConfig(payload) {
  return call('PUT', '/admin/chatbot/prompt-config', payload)
}
