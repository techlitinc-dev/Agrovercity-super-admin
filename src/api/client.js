const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'

export function getAdminToken() {
  return localStorage.getItem('adminIdToken') || ''
}

export function setAdminToken(token) {
  if (token) localStorage.setItem('adminIdToken', token)
  else localStorage.removeItem('adminIdToken')
}

function idempotencyKey() {
  return crypto.randomUUID()
}

export class ApiError extends Error {
  constructor(status, code, message, fieldErrors) {
    super(message)
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors || {}
  }
}

export async function request(method, path, body) {
  const headers = { 'Accept-Language': 'en' }
  const token = getAdminToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') headers['Idempotency-Key'] = idempotencyKey()

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (res.status === 204) return null
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const err = payload?.error || {}
    throw new ApiError(res.status, err.code || 'UNKNOWN', err.message || `Request failed (${res.status})`, err.fieldErrors)
  }
  return payload
}
