import React from 'react'
import { EmptyState } from './ui.jsx'

export default function DataTable({ columns, rows, onRowClick, page, pageSize, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const empty = rows.length === 0

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(16,185,129,0.04)] ring-1 ring-emerald-900/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 backdrop-blur-sm text-[11px] uppercase tracking-wider text-emerald-950 font-bold">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3.5">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
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
                  className="cursor-pointer transition-colors hover:bg-emerald-50/70"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`whitespace-nowrap px-4 py-3 text-slate-800 ${c.mono ? 'font-mono text-[11px]' : ''} ${c.cls || ''}`}>
                      {c.value(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-emerald-100/80 bg-emerald-50/40 backdrop-blur-sm px-4 py-3 text-xs text-emerald-900">
        <span className="font-medium">
          Showing {empty ? 0 : (page - 1) * pageSize + 1}–{(page - 1) * pageSize + rows.length} of {total.toLocaleString('en-IN')} records
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            className="rounded-lg px-2.5 py-1 text-emerald-900 hover:bg-white border border-emerald-200/80 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-all font-medium"
          >
            ‹ Prev
          </button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`h-7 w-7 rounded-lg font-mono text-xs font-bold transition-all ${
                p === page
                  ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/30'
                  : 'text-emerald-900 hover:bg-white border border-emerald-200/70'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
            className="rounded-lg px-2.5 py-1 text-emerald-900 hover:bg-white border border-emerald-200/80 disabled:opacity-30 disabled:hover:bg-transparent shadow-2xs transition-all font-medium"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  )
}
