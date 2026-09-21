import React from 'react'
import { X } from 'lucide-react'

export default function DetailDrawer({ open, title, subtitle, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-2xl z-50">
        <header className="flex items-start justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4.5 backdrop-blur-md">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 font-mono text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      {children}
    </section>
  )
}

export function DocJson({ doc }) {
  return (
    <pre className="max-h-64 overflow-auto rounded-xl border border-slate-200/80 bg-slate-50/90 p-3.5 font-mono text-[11px] leading-relaxed text-slate-700 shadow-2xs">
      {JSON.stringify(doc, null, 2)}
    </pre>
  )
}
