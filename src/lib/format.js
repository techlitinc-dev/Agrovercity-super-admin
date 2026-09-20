export const fmtRupees = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d) ? iso : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export const fmtDay = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { dateStyle: 'medium' })
}

export const isSameDay = (iso, ref = new Date()) => {
  if (!iso) return false
  const d = new Date(iso)
  return d.toDateString() === ref.toDateString()
}
