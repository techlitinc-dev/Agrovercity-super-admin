import { request } from './api.js'
import { demoProducts, demoOrders } from './demoData.js'

const PRODUCTS_PATH = '/v1/admin/marketplace/products'
const ORDERS_PATH = '/v1/admin/marketplace/orders'

function buildQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v)
  })
  const s = qs.toString()
  return s ? `?${s}` : ''
}

function applyLocalFilter(list, { q = '', status = '', from = '', to = '' } = {}) {
  let out = list
  if (q) {
    const needle = q.toLowerCase()
    out = out.filter((r) =>
      Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(needle)) ||
      (r.items && r.items.some((it) => it.title.toLowerCase().includes(needle)))
    )
  }
  if (status) out = out.filter((r) => r.status === status)
  if (from) out = out.filter((r) => r.createdAt >= new Date(`${from}T00:00:00Z`).toISOString())
  if (to) out = out.filter((r) => r.createdAt <= new Date(`${to}T23:59:59Z`).toISOString())
  return out
}

async function listOr(path, params, demoList, demoMutator) {
  try {
    return { ...await request('GET', `${path}${buildQuery(params)}`), demo: false }
  } catch (e) {
    if (e.status && e.status !== 401 && e.status !== 404 && e.status !== 0) throw e
    const filtered = applyLocalFilter(demoMutator(), params)
    return { data: filtered, page: 1, pageSize: 50, total: filtered.length, demo: true }
  }
}

export function listProducts(params) {
  return listOr(PRODUCTS_PATH, params, demoProducts, () => {
    const stored = JSON.parse(localStorage.getItem('demoProducts') || 'null')
    return stored || demoProducts
  })
}

export function listOrders(params) {
  return listOr(ORDERS_PATH, params, demoOrders, () => {
    const stored = JSON.parse(localStorage.getItem('demoOrders') || 'null')
    return stored || demoOrders
  })
}

export function createProduct(payload) {
  return writeOr(() => request('POST', PRODUCTS_PATH, { body: payload }), (doc) => {
    const list = JSON.parse(localStorage.getItem('demoProducts') || 'null') || demoProducts
    const doc2 = { ...doc, id: `prod_${Date.now()}`, rating: 0, reviewsCount: 0, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    localStorage.setItem('demoProducts', JSON.stringify([doc2, ...list]))
    return doc2
  }, payload)
}

export function updateProduct(id, payload) {
  return writeOr(() => request('PUT', `${PRODUCTS_PATH}/${id}`, { body: payload }), (doc) => {
    const list = JSON.parse(localStorage.getItem('demoProducts') || 'null') || demoProducts
    const next = list.map((p) => (p.id === id ? { ...p, ...doc, updatedAt: new Date().toISOString() } : p))
    localStorage.setItem('demoProducts', JSON.stringify(next))
    return next.find((p) => p.id === id)
  }, payload)
}

export function refundOrder(orderId, payload) {
  return writeOr(() => request('POST', `${ORDERS_PATH}/${orderId}/refund`, { body: payload }), (body, args) => {
    const [doc] = args
    const list = JSON.parse(localStorage.getItem('demoOrders') || 'null') || demoOrders
    const next = list.map((o) =>
      o.orderId === doc.orderId
        ? { ...o, status: o.status, paymentStatus: 'refunded', refundStatus: 'refunded', razorpayRefundId: `rfnd_${Math.random().toString(36).slice(2, 9)}`, updatedAt: new Date().toISOString() }
        : o
    )
    localStorage.setItem('demoOrders', JSON.stringify(next))
    return { refundId: `rfnd_${Math.random().toString(36).slice(2, 9)}`, demo: true }
  }, payload)
}

async function writeOr(realCall, demoCall, ...args) {
  try {
    return { ...(await realCall()), demo: false }
  } catch (e) {
    if (e.status && e.status !== 401 && e.status !== 404 && e.status !== 0) throw e
    return { data: demoCall(...args), demo: true }
  }
}
