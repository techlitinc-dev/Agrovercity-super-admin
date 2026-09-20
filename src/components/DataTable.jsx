import { EmptyState } from './ui.jsx'

export default function DataTable({ columns, rows, onRowClick, page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const empty = rows.length === 0
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title="No records match the current filters" hint="Try clearing the search or status filter." />
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick(r)}
                  className="cursor-pointer border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`whitespace-nowrap px-4 py-3 ${c.mono ? 'font-mono text-xs' : ''} ${c.cls || 'text-slate-300'}`}>
                      {c.value(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-500">
        <span>
          Showing {empty ? 0 : (page - 1) * pageSize + 1}–{(page - 1) * pageSize + rows.length} of {total.toLocaleString('en-IN')} records
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded px-2 py-1 hover:bg-slate-800 disabled:opacity-30">‹ Prev</button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => onPage(p)} className={`h-7 w-7 rounded font-mono ${p === page ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800'}`}>{p}</button>
          ))}
          <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded px-2 py-1 hover:bg-slate-800 disabled:opacity-30">Next ›</button>
        </div>
      </div>
    </div>
  )
}
