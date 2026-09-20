export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'

export class ApiError extends Error {
  constructor(status, code, message, fieldErrors) {
    super(message)
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors || {}
  }
}

function authHeaders() {
  const token = localStorage.getItem('adminAccessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function idempotencyKey() {
  return (crypto.randomUUID && crypto.randomUUID()) || `idem_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export async function request(method, path, { body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...authHeaders(),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'Idempotency-Key': idempotencyKey() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = json.error || {}
    throw new ApiError(res.status, err.code || 'UNKNOWN', err.message || res.statusText, err.fieldErrors)
  }
  return json
}
