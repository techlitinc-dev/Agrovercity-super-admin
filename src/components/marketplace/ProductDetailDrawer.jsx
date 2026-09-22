import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  ShieldCheck,
  Star,
  Edit3,
  ExternalLink,
  Package,
  Layers
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function ProductDetailDrawer({
  isOpen,
  onClose,
  product,
  onEditProduct,
  onVerifyQr
}) {
  const { addToast } = useNotification();
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'qr' | 'distributor' | 'json'

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0 bg-slate-50 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 font-mono">{product.sku}</h2>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold shadow-2xs">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                  {product.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-800 font-bold mt-0.5 truncate max-w-md">
                {product.name}
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

        {/* Sub Navigation Tabs */}
        <div className="px-6 bg-slate-50/80 border-b border-emerald-100 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Pricing
          </button>
          <button
            onClick={() => setActiveSubTab('qr')}
            className={`flex items-center gap-1 py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'qr'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Authenticity ({product.qrCertificate?.verified ? 'Attested' : 'Pending'})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('distributor')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'distributor'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Distributor & Margin
          </button>
          <button
            onClick={() => setActiveSubTab('json')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'json'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {activeSubTab === 'overview' && (
            <>
              {/* Pricing & Stock Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[11px] font-medium">Selling Price</span>
                  <span className="text-base font-extrabold text-emerald-800 font-mono">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-[10px] text-slate-400 line-through block font-mono">
                      MRP: ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[11px] font-medium">Inventory Stock</span>
                  <span
                    className={`text-base font-extrabold font-mono ${
                      product.stockQuantity === 0
                        ? 'text-rose-700'
                        : product.stockQuantity <= 15
                        ? 'text-amber-700'
                        : 'text-slate-900'
                    }`}
                  >
                    {product.stockQuantity} Units
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Packaging: {product.unit}
                  </span>
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <span className="text-slate-500 block text-[11px] font-medium">Dealer Margin</span>
                  <span className="text-base font-extrabold text-teal-800 font-mono">
                    {product.dealerCommissionPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Distributor Commission
                  </span>
                </div>
              </div>

              {/* Description & Technical Specs */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-4 space-y-2 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Product Description & Target Crops
                </h3>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {product.description}
                </p>
                <div className="pt-2 border-t border-emerald-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Brand / Manufacturer</span>
                    <span className="text-slate-900 font-bold">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sub-Category</span>
                    <span className="text-slate-800 font-medium">{product.subCategory}</span>
                  </div>
                </div>
              </div>

              {/* Customer Rating & Reviews Summary */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Customer Star Ratings
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900 font-mono">{product.rating} / 5</span>
                    <span className="text-xs text-slate-500 font-mono font-medium">({product.reviewsCount} customer reviews)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'qr' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-900 text-xs">Agmark / Ministry QR Certification</span>
                  </div>
                  {product.qrCertificate?.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full border border-teal-300/80 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" /> Certified Genuine
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300/80 shadow-2xs">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Certification Pending
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="text-slate-500 block text-[10px]">Certificate #</span>
                    <span className="text-slate-900 font-bold">{product.qrCertificate?.certificateNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="text-slate-500 block text-[10px]">Batch Number</span>
                    <span className="text-slate-800 font-semibold">{product.qrCertificate?.batchNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="text-slate-500 block text-[10px]">Lab Test Date</span>
                    <span className="text-slate-800 font-semibold">{product.qrCertificate?.labTestDate || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600">
                  Certifying Authority: <span className="text-slate-900 font-bold">{product.qrCertificate?.authority || 'Govt Agricultural Lab'}</span>
                </div>

                {product.qrCertificate?.purityPercent && (
                  <div className="grid grid-cols-2 gap-2.5 font-mono text-xs pt-1">
                    <div className="bg-emerald-50/30 p-2 rounded-xl border border-emerald-200/80">
                      <span className="text-slate-500 text-[10px] block">Purity Assay</span>
                      <span className="text-emerald-800 font-bold">{product.qrCertificate.purityPercent}%</span>
                    </div>
                    <div className="bg-emerald-50/30 p-2 rounded-xl border border-emerald-200/80">
                      <span className="text-slate-500 text-[10px] block">Germination Rate</span>
                      <span className="text-emerald-800 font-bold">{product.qrCertificate.germinationPercent}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onVerifyQr(product)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Update QR Certification Status</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'distributor' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-xs">Primary Distributor & Fulfillment Hub</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Operating Firm</span>
                    <span className="text-slate-900 font-bold">{product.distributorFirm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Telephone</span>
                    <span className="text-slate-800 font-mono font-medium">{product.distributorMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Fulfillment Location</span>
                    <span className="text-slate-800 font-medium">{product.distributorLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Dealer Commission</span>
                    <span className="text-teal-800 font-mono font-bold">{product.dealerCommissionPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'json' && (
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(product, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="px-6 py-3.5 bg-slate-50/90 border-t border-emerald-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => onVerifyQr(product)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-teal-800 bg-teal-100 hover:bg-teal-200 border border-teal-300/80 rounded-xl font-bold transition-all active:scale-95 shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verify QR Certificate</span>
          </button>

          <button
            onClick={() => onEditProduct(product)}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Product SKU</span>
          </button>
        </div>
      </div>
    </div>
  );
}
