import { useState } from 'react'
import { Pencil, ShieldCheck, ShieldAlert, Ban, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, KeyValue } from '../components/ui.jsx'
import DetailDrawer, { DrawerSection, DocJson } from '../components/DetailDrawer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import ProductFormModal from './ProductFormModal.jsx'
import { fmtRupees, fmtDay } from '../lib/format.js'

export default function ProductsView({ rows, onRefresh, createProduct, updateProduct }) {
  const [detail, setDetail] = useState(null)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [confirmState, setConfirmState] = useState(null)
  const [busy, setBusy] = useState(false)

  const columns = [
    { key: 'id', label: 'ID', value: (r) => `#${r.id}`, mono: true, cls: 'text-emerald-800 font-bold' },
    { key: 'title', label: 'Product', value: (r) => (
        <div>
          <p className="font-semibold text-slate-900">{r.title}</p>
          <p className="text-xs text-slate-500">{r.brand} · {r.dealerName || '—'}</p>
        </div>
      ) },
    { key: 'category', label: 'Category', value: (r) => <span className="font-medium text-slate-700">{r.category}</span> },
    { key: 'price', label: 'Price', value: (r) => (
        <span className="font-mono font-bold text-slate-900">{fmtRupees(r.discountedPrice)} <span className="text-xs text-slate-400 line-through font-normal">{fmtRupees(r.mrp)}</span></span>
      ) },
    { key: 'quantity', label: 'Stock', value: (r) => <span className="font-mono font-semibold text-slate-800">{r.quantity}</span>, mono: true },
    { key: 'cert', label: 'Certificate', value: (r) => (
        r.certificateNo
          ? <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
              {r.certificateValid
                ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                : <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />}
              {r.certifier}
            </span>
          : <span className="text-xs text-slate-400">—</span>
      ) },
    { key: 'status', label: 'Status', value: (r) => <Badge value={r.status} /> },
    { key: 'createdAt', label: 'Created', value: (r) => fmtDay(r.createdAt), cls: 'text-slate-500' },
    { key: 'actions', label: 'Actions', value: (r) => (
        <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="px-2 py-1 text-emerald-800 hover:bg-emerald-100/70" onClick={() => setEditing(r)}><Pencil className="h-3.5 w-3.5" /></Button>
          {r.status !== 'discontinued'
            ? <Button variant="ghost" className="px-2 py-1 text-rose-600 hover:bg-rose-50" onClick={() => setConfirmState({ type: 'discontinue', product: r })}><Ban className="h-3.5 w-3.5" /></Button>
            : <Button variant="ghost" className="px-2 py-1 text-emerald-600 hover:bg-emerald-50" onClick={() => setConfirmState({ type: 'reactivate', product: r })}><RotateCcw className="h-3.5 w-3.5" /></Button>}
        </span>
      ) },
  ]

  const submitConfirm = async (reason) => {
    setBusy(true)
    const { type, product } = confirmState
    const status = type === 'discontinue' ? 'discontinued' : 'active'
    await updateProduct(product.id, { status }, reason)
    setBusy(false)
    setConfirmState(null)
    setDetail(null)
    onRefresh()
  }

  const submitForm = async (payload) => {
    setBusy(true)
    if (editing) await updateProduct(editing.id, payload, 'Catalog edit from superadmin panel')
    else await createProduct(payload)
    setBusy(false)
    setEditing(null)
    setCreating(false)
    onRefresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{rows.length} SKUs in catalog</p>
        <Button onClick={() => setCreating(true)}>+ Add product SKU</Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(16,185,129,0.04)] ring-1 ring-emerald-900/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 text-[11px] uppercase tracking-wider text-emerald-950 font-bold">
                {columns.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3.5 font-bold">{c.label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/60">
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setDetail(r)} className="cursor-pointer transition-colors hover:bg-emerald-50/60">
                  {columns.map((c) => (
                    <td key={c.key} className={`whitespace-nowrap px-4 py-3 ${c.mono ? 'font-mono text-xs' : ''} ${c.cls || 'text-slate-800'}`}>
                      {c.value(r)}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500">No products match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={detail?.title} subtitle={detail?.id}>
        {detail && (
          <>
            <DrawerSection title="Overview">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                <KeyValue k="Status" v={<Badge value={detail.status} />} />
                <KeyValue k="Category" v={detail.category} />
                <KeyValue k="Brand" v={detail.brand} />
                <KeyValue k="Dealer" v={detail.dealerName} />
                <KeyValue k="MRP / Selling" v={`${fmtRupees(detail.mrp)} → ${fmtRupees(detail.discountedPrice)}`} mono />
                <KeyValue k="Stock / Batch" v={`${detail.quantity} · ${detail.batchNo || '—'}`} mono />
                <KeyValue k="BNPL" v={detail.bnplAvailable ? 'Available' : 'Not available'} />
                <KeyValue k="Rating" v={`${detail.rating} (${detail.reviewsCount} reviews)`} />
                <KeyValue k="Created" v={fmtDay(detail.createdAt)} />
              </Card>
            </DrawerSection>
            <DrawerSection title="Authenticity certificate (QR verified)">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                <KeyValue k="Certifier" v={detail.certifier} />
                <KeyValue k="Certificate no." v={detail.certificateNo} mono />
                <KeyValue k="Valid" v={detail.certificateValid
                  ? <span className="inline-flex items-center gap-1 text-emerald-400"><ShieldCheck className="h-4 w-4" /> Valid</span>
                  : <span className="inline-flex items-center gap-1 text-rose-400"><ShieldAlert className="h-4 w-4" /> Invalid / expired</span>} />
              </Card>
            </DrawerSection>
            <DrawerSection title="Document JSON">
              <DocJson doc={detail} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      <ProductFormModal open={creating || !!editing} product={editing} onClose={() => { setCreating(false); setEditing(null) }} onSubmit={submitForm} />

      <ConfirmDialog
        open={!!confirmState}
        busy={busy}
        title={confirmState?.type === 'discontinue' ? 'Discontinue product SKU?' : 'Reactivate product SKU?'}
        message={confirmState ? `${confirmState.product.title} will be ${confirmState.type === 'discontinue' ? 'removed from the storefront' : 'restored to the storefront'}.` : ''}
        confirmLabel={confirmState?.type === 'discontinue' ? 'Discontinue' : 'Reactivate'}
        onCancel={() => setConfirmState(null)}
        onConfirm={submitConfirm}
      />
    </div>
  )
}
