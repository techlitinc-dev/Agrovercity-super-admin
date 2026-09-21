import React from 'react'

export const CONTRACT_STATUSES = [
  'draft',
  'pending_review',
  'published',
  'active',
  'fulfilled',
  'disputed',
  'breached',
  'cancelled',
]

export const STATUS_LABELS = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  active: 'Active',
  fulfilled: 'Fulfilled',
  disputed: 'Disputed',
  breached: 'Breached',
  cancelled: 'Cancelled',
}

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  pending_review: 'bg-amber-50 text-amber-800 border border-amber-300/80',
  published: 'bg-sky-50 text-sky-800 border border-sky-300/80',
  active: 'bg-emerald-50 text-emerald-800 border border-emerald-300/80',
  fulfilled: 'bg-teal-50 text-teal-800 border border-teal-300/80',
  disputed: 'bg-orange-50 text-orange-800 border border-orange-300/80',
  breached: 'bg-rose-50 text-rose-800 border border-rose-300/80',
  cancelled: 'bg-slate-100 text-slate-500 border border-slate-200/80',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm shadow-2xs ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
