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
  draft: 'bg-slate-700/60 text-slate-300',
  pending_review: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  published: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  fulfilled: 'bg-emerald-600/20 text-emerald-200 ring-1 ring-emerald-600/40',
  disputed: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
  breached: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
  cancelled: 'bg-slate-700/60 text-slate-400',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-700 text-slate-300'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
