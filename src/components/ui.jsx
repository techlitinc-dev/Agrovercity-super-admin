const badgeTones = {
  active: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  delivered: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  paid: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
  refunded: 'bg-sky-500/10 text-sky-400 ring-sky-500/30',
  confirmed: 'bg-sky-500/10 text-sky-400 ring-sky-500/30',
  shipped: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/30',
  packed: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/30',
  outForDelivery: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/30',
  placed: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
  pending: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
  flagged: 'bg-rose-500/10 text-rose-400 ring-rose-500/30',
  failed: 'bg-rose-500/10 text-rose-400 ring-rose-500/30',
  cancelled: 'bg-slate-500/10 text-slate-400 ring-slate-500/30',
  discontinued: 'bg-slate-500/10 text-slate-400 ring-slate-500/30',
}

const humanize = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())

export function Badge({ value }) {
  const tone = badgeTones[value] || 'bg-slate-500/10 text-slate-300 ring-slate-500/30'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone}`}>
      {humanize(value || '—')}
    </span>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  )
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
    secondary: 'bg-slate-800 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

export function Input({ className = '', ...props }) {
  return <input className={`${inputCls} ${className}`} {...props} />
}

export function Select({ options = [], className = '', ...props }) {
  return (
    <select className={`${inputCls} ${className}`} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {Icon && <Icon className="h-8 w-8 text-slate-600" />}
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function KeyValue({ k, v, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-slate-500">{k}</span>
      <span className={`text-right text-slate-200 ${mono ? 'font-mono text-xs' : ''}`}>{v || '—'}</span>
    </div>
  )
}
