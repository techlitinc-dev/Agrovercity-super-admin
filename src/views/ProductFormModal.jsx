import { useState } from 'react'
import { Button, Field, Input, Select } from '../components/ui.jsx'

const CATEGORIES = [
  { value: 'seeds', label: 'Seeds' },
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'pesticide', label: 'Pesticide' },
  { value: 'tools', label: 'Tools' },
  { value: 'vehicles', label: 'Vehicles / Machinery' },
]

const CERTIFIERS = [
  { value: '', label: 'None' },
  { value: 'Agmark', label: 'Agmark' },
  { value: 'CIB&RC', label: 'CIB&RC (Pesticides)' },
  { value: 'Ministry of Agriculture', label: 'Ministry of Agriculture' },
  { value: 'BIS', label: 'BIS' },
]

const emptyForm = {
  title: '', vernacularTitle: '', category: 'seeds', brand: '', dealerName: '',
  mrp: '', discountedPrice: '', quantity: '', batchNo: '',
  bnplAvailable: false, certifier: '', certificateNo: '', certificateValid: false,
}

export default function ProductFormModal({ open, product, onClose, onSubmit }) {
  const [form, setForm] = useState(() => product ? pickForm(product) : emptyForm)
  const [key, setKey] = useState(0)

  if (!open) return null
  if (product && form.id !== product.id) {
    setForm(pickForm(product))
    setKey((k) => k + 1)
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const numeric = (v) => (v === '' ? undefined : Number(v))

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      mrp: numeric(form.mrp),
      discountedPrice: numeric(form.discountedPrice),
      quantity: numeric(form.quantity),
    })
  }

  const title = product ? `Edit product ${product.id}` : 'Add product SKU'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <form key={key} onSubmit={submit} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl">
        <h2 className="mb-4 text-base font-bold text-slate-900">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Field label="Title"><Input required value={form.title} onChange={set('title')} /></Field></div>
          <div className="col-span-2"><Field label="Vernacular title"><Input value={form.vernacularTitle} onChange={set('vernacularTitle')} /></Field></div>
          <Field label="Category"><Select options={CATEGORIES} value={form.category} onChange={set('category')} /></Field>
          <Field label="Brand"><Input required value={form.brand} onChange={set('brand')} /></Field>
          <Field label="Dealer name"><Input value={form.dealerName} onChange={set('dealerName')} /></Field>
          <Field label="Batch number"><Input value={form.batchNo} onChange={set('batchNo')} /></Field>
          <Field label="MRP (₹)"><Input type="number" min="0" required value={form.mrp} onChange={set('mrp')} /></Field>
          <Field label="Discounted price (₹)"><Input type="number" min="0" required value={form.discountedPrice} onChange={set('discountedPrice')} /></Field>
          <Field label="Stock quantity"><Input type="number" min="0" required value={form.quantity} onChange={set('quantity')} /></Field>
          <Field label="Certifier"><Select options={CERTIFIERS} value={form.certifier} onChange={set('certifier')} /></Field>
          <Field label="Certificate number"><Input value={form.certificateNo} onChange={set('certificateNo')} /></Field>
          <div className="col-span-2 flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <input type="checkbox" checked={form.bnplAvailable} onChange={set('bnplAvailable')} className="h-4 w-4 accent-emerald-600 rounded" /> BNPL available
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <input type="checkbox" checked={form.certificateValid} onChange={set('certificateValid')} className="h-4 w-4 accent-emerald-600 rounded" /> Certificate valid
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{product ? 'Save changes' : 'Add SKU'}</Button>
        </div>
      </form>
    </div>
  )
}

function pickForm(p) {
  return {
    id: p.id,
    title: p.title || '', vernacularTitle: p.vernacularTitle || '', category: p.category || 'seeds',
    brand: p.brand || '', dealerName: p.dealerName || '', batchNo: p.batchNo || '',
    mrp: p.mrp ?? '', discountedPrice: p.discountedPrice ?? '', quantity: p.quantity ?? '',
    bnplAvailable: !!p.bnplAvailable, certifier: p.certifier || '',
    certificateNo: p.certificateNo || '', certificateValid: !!p.certificateValid,
  }
}
