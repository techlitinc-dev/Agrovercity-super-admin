import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShoppingBag, QrCode } from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '../../services/mockData';

const EMPTY_FORM = {
  name: '',
  brand: '',
  category: 'Seeds',
  subCategory: '',
  sku: '',
  mrp: '',
  price: '',
  stockQuantity: '',
  unit: '',
  distributorFirm: '',
  dealerCommissionPercent: '5.0',
  description: '',
  certificateNumber: '',
  authority: '',
  batchNumber: '',
  qrVerified: false
};

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSave,
  loading = false
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const isEdit = Boolean(product);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (product) {
        setForm({
          name: product.name || '',
          brand: product.brand || '',
          category: product.category || 'Seeds',
          subCategory: product.subCategory || '',
          sku: product.sku || '',
          mrp: product.mrp ?? '',
          price: product.price ?? '',
          stockQuantity: product.stockQuantity ?? '',
          unit: product.unit || '',
          distributorFirm: product.distributorFirm || '',
          dealerCommissionPercent: product.dealerCommissionPercent ?? '5.0',
          description: product.description || '',
          certificateNumber: product.qrCertificate?.certificateNumber || '',
          authority: product.qrCertificate?.authority || '',
          batchNumber: product.qrCertificate?.batchNumber || '',
          qrVerified: Boolean(product.qrCertificate?.verified)
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim()) {
      setError('Product name and brand are mandatory.');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError('A valid selling price is required.');
      return;
    }
    if (form.mrp && Number(form.mrp) < Number(form.price)) {
      setError('MRP cannot be lower than the selling price.');
      return;
    }
    onSave({
      ...form,
      mrp: Number(form.mrp) || Number(form.price),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity) || 0,
      dealerCommissionPercent: Number(form.dealerCommissionPercent) || 5.0
    });
  };

  const inputCls =
    'w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isEdit ? 'Edit Product SKU' : 'Add New Product SKU'}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SOP-06 Catalog
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isEdit ? `Updating ${product.sku}` : 'Introduce a new agri-input into the marketplace catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-emerald-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[65vh] overflow-y-auto text-slate-700">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-800 font-bold mb-1">Product Name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Mahyco Soybean Seeds JS-335 (30kg Bag)" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Brand / Manufacturer *</label>
              <input className={inputCls} value={form.brand} onChange={(e) => setField('brand', e.target.value)} placeholder="e.g. IFFCO" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => setField('category', e.target.value)}>
                {MARKETPLACE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Sub-Category</label>
              <input className={inputCls} value={form.subCategory} onChange={(e) => setField('subCategory', e.target.value)} placeholder="e.g. Oilseeds" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">SKU</label>
              <input className={`${inputCls} font-mono`} value={form.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="Auto-generated if blank" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">MRP (₹)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.mrp} onChange={(e) => setField('mrp', e.target.value)} placeholder="e.g. 3400" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Selling Price (₹) *</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="e.g. 2950" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Stock Quantity</label>
              <input type="number" min="0" className={inputCls} value={form.stockQuantity} onChange={(e) => setField('stockQuantity', e.target.value)} placeholder="e.g. 145" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Unit</label>
              <input className={inputCls} value={form.unit} onChange={(e) => setField('unit', e.target.value)} placeholder="e.g. 30kg Bag" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Distributor Firm</label>
              <input className={inputCls} value={form.distributorFirm} onChange={(e) => setField('distributorFirm', e.target.value)} placeholder="e.g. Vidarbha Seeds & Agro Inputs Corp" />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Dealer Commission (%)</label>
              <input type="number" min="0" step="0.1" className={inputCls} value={form.dealerCommissionPercent} onChange={(e) => setField('dealerCommissionPercent', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-800 font-bold mb-1">Description</label>
              <textarea rows={2} className={inputCls} value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Short catalog description shown on the storefront..." />
            </div>
          </div>

          {/* QR Certification block */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <QrCode className="w-4 h-4 text-teal-600" />
              <span>Agmark / Ministry QR Authenticity Certificate</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input className={`${inputCls} font-mono`} value={form.certificateNumber} onChange={(e) => setField('certificateNumber', e.target.value)} placeholder="Certificate No." />
              <input className={inputCls} value={form.authority} onChange={(e) => setField('authority', e.target.value)} placeholder="Certifying Authority" />
              <input className={`${inputCls} font-mono`} value={form.batchNumber} onChange={(e) => setField('batchNumber', e.target.value)} placeholder="Batch No." />
            </div>
            <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.qrVerified}
                onChange={(e) => setField('qrVerified', e.target.checked)}
                className="w-4 h-4 rounded bg-white border-emerald-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Mark certificate as verified at creation</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Create SKU'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
