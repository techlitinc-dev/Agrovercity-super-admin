import React from 'react'
import { X } from 'lucide-react'

export default function DetailDrawer({ open, title, subtitle, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-emerald-200/90 bg-white/95 backdrop-blur-2xl shadow-2xl z-50">
        <header className="flex items-start justify-between border-b border-emerald-100/90 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 px-6 py-4.5 backdrop-blur-md">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 font-mono text-xs text-emerald-800 font-semibold">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-emerald-100/70 hover:text-emerald-900 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">{children}</div>
      </aside>
    </div>
  )
}

export function DrawerSection({ title, children }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-950/80 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {title}
      </h3>
      {children}
    </section>
  )
}

export function DocJson({ doc }) {
  return (
    <pre className="max-h-64 overflow-auto rounded-xl border border-emerald-800 bg-emerald-950 p-3.5 font-mono text-[11px] leading-relaxed text-emerald-200 shadow-2xs">
      {JSON.stringify(doc, null, 2)}
    </pre>
  )
}
