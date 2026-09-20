import { X } from 'lucide-react'

export default function DetailDrawer({ open, title, subtitle, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">{title}</h2>
            {subtitle && <p className="mt-0.5 font-mono text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
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
    <pre className="max-h-64 overflow-auto rounded-lg border border-slate-800 bg-slate-900/80 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
      {JSON.stringify(doc, null, 2)}
    </pre>
  )
}
