import React from 'react'

const badgeTones = {
  active: 'bg-emerald-100/80 text-emerald-900 ring-emerald-500/30 border border-emerald-300/80',
  delivered: 'bg-emerald-100/80 text-emerald-900 ring-emerald-500/30 border border-emerald-300/80',
  paid: 'bg-emerald-100/80 text-emerald-900 ring-emerald-500/30 border border-emerald-300/80',
  refunded: 'bg-sky-100/80 text-sky-900 ring-sky-500/30 border border-sky-300/80',
  confirmed: 'bg-sky-100/80 text-sky-900 ring-sky-500/30 border border-sky-300/80',
  shipped: 'bg-teal-100/80 text-teal-900 ring-teal-500/30 border border-teal-300/80',
  packed: 'bg-teal-100/80 text-teal-900 ring-teal-500/30 border border-teal-300/80',
  outForDelivery: 'bg-teal-100/80 text-teal-900 ring-teal-500/30 border border-teal-300/80',
  placed: 'bg-amber-100/80 text-amber-900 ring-amber-500/30 border border-amber-300/80',
  pending: 'bg-amber-100/80 text-amber-900 ring-amber-500/30 border border-amber-300/80',
  flagged: 'bg-rose-100/80 text-rose-900 ring-rose-500/30 border border-rose-300/80',
  failed: 'bg-rose-100/80 text-rose-900 ring-rose-500/30 border border-rose-300/80',
  cancelled: 'bg-slate-100 text-slate-700 ring-slate-300 border border-slate-200/80',
  discontinued: 'bg-slate-100 text-slate-700 ring-slate-300 border border-slate-200/80',
}

const humanize = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())

export function Badge({ value }) {
  const tone = badgeTones[value] || 'bg-emerald-50 text-emerald-800 ring-emerald-300 border border-emerald-200'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset backdrop-blur-sm shadow-2xs ${tone}`}>
      {humanize(value || '—')}
    </span>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/35 to-emerald-100/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(16,185,129,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-emerald-900/[0.02] hover:shadow-[0_12px_36px_rgb(16,185,129,0.08)] hover:border-emerald-300/90 transition-all duration-300 ${className}`}>
      {children}
    </div>
  )
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs'
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-700/20',
    secondary: 'bg-emerald-50/80 text-emerald-900 ring-1 ring-inset ring-emerald-200/80 hover:bg-emerald-100/80 backdrop-blur-sm',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/20',
    ghost: 'text-emerald-900/80 hover:bg-emerald-50/80 hover:text-emerald-950',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-emerald-900/80">{label}</span>
      {children}
    </label>
  )
}

const inputCls = 'w-full rounded-xl border border-emerald-200/90 bg-white/95 px-3 py-2 text-xs text-slate-900 placeholder-emerald-900/40 backdrop-blur-sm shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans'

export function Input({ className = '', ...props }) {
  return <input className={`${inputCls} ${className}`} {...props} />
}

export function Select({ options = [], className = '', ...props }) {
  return (
    <select className={`${inputCls} cursor-pointer ${className}`} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-white text-slate-900">{o.label}</option>
      ))}
    </select>
  )
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {Icon && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 shadow-2xs">
          <Icon className="h-7 w-7 text-emerald-600" />
        </div>
      )}
      <p className="text-sm font-bold text-slate-800">{title}</p>
      {hint && <p className="text-xs text-emerald-800/70">{hint}</p>}
    </div>
  )
}

export function KeyValue({ k, v, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-xs border-b border-emerald-100/50 last:border-0">
      <span className="shrink-0 text-emerald-900/70 font-medium">{k}</span>
      <span className={`text-right text-slate-800 font-semibold ${mono ? 'font-mono text-[11px]' : ''}`}>{v || '—'}</span>
    </div>
  )
}
