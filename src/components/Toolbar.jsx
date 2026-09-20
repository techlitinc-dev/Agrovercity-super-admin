import { Search, Download } from 'lucide-react'
import { Input, Select, Button } from './ui.jsx'

export default function Toolbar({ q, onQ, status, onStatus, statusOptions, from, onFrom, to, onTo, onExport }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input value={q} onChange={(e) => onQ(e.target.value)} placeholder="Search by ID, name, product..." className="pl-9" />
      </div>
      <Select value={status} onChange={(e) => onStatus(e.target.value)} options={statusOptions} className="w-44" />
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Input type="date" value={from} onChange={(e) => onFrom(e.target.value)} className="w-36" />
        <span>→</span>
        <Input type="date" value={to} onChange={(e) => onTo(e.target.value)} className="w-36" />
      </div>
      <Button variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" /> Export
      </Button>
    </div>
  )
}

export function downloadCsv(rows, columns, filename) {
  const esc = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`
  const header = columns.map((c) => esc(c.label)).join(',')
  const body = rows.map((r) => columns.map((c) => esc(c.value(r))).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
