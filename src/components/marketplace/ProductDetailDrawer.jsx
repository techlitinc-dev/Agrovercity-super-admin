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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-900"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono">{product.sku}</h2>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  {product.category}
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {product.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-0.5 truncate max-w-md">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Pricing
          </button>
          <button
            onClick={() => setActiveSubTab('qr')}
            className={`flex items-center gap-1 py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'qr'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Authenticity ({product.qrCertificate?.verified ? 'Attested' : 'Pending'})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('distributor')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'distributor'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Distributor & Margin
          </button>
          <button
            onClick={() => setActiveSubTab('json')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'json'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {activeSubTab === 'overview' && (
            <>
              {/* Pricing & Stock Banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Selling Price</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-[10px] text-slate-500 line-through block font-mono">
                      MRP: ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Inventory Stock</span>
                  <span
                    className={`text-base font-extrabold font-mono ${
                      product.stockQuantity === 0
                        ? 'text-rose-400'
                        : product.stockQuantity <= 15
                        ? 'text-amber-400'
                        : 'text-white'
                    }`}
                  >
                    {product.stockQuantity} Units
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Packaging: {product.unit}
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Dealer Margin</span>
                  <span className="text-base font-extrabold text-teal-400 font-mono">
                    {product.dealerCommissionPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Distributor Commission
                  </span>
                </div>
              </div>

              {/* Description & Technical Specs */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Product Description & Target Crops
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {product.description}
                </p>
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Brand / Manufacturer</span>
                    <span className="text-white font-semibold">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sub-Category</span>
                    <span className="text-slate-200">{product.subCategory}</span>
                  </div>
                </div>
              </div>

              {/* Customer Rating & Reviews Summary */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Customer Star Ratings
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white font-mono">{product.rating} / 5</span>
                    <span className="text-xs text-slate-400 font-mono">({product.reviewsCount} customer reviews)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'qr' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-teal-400" />
                    <span className="font-bold text-white text-xs">Agmark / Ministry QR Certification</span>
                  </div>
                  {product.qrCertificate?.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                      <CheckCircle2 className="w-3 h-3" /> Certified Genuine
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                      <AlertTriangle className="w-3 h-3" /> Certification Pending
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Certificate #</span>
                    <span className="text-white font-bold">{product.qrCertificate?.certificateNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Batch Number</span>
                    <span className="text-slate-200">{product.qrCertificate?.batchNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Lab Test Date</span>
                    <span className="text-slate-200">{product.qrCertificate?.labTestDate || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Certifying Authority: <span className="text-slate-200 font-medium">{product.qrCertificate?.authority || 'Govt Agricultural Lab'}</span>
                </div>

                {product.qrCertificate?.purityPercent && (
                  <div className="grid grid-cols-2 gap-2.5 font-mono text-xs pt-1">
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Purity Assay</span>
                      <span className="text-emerald-400 font-bold">{product.qrCertificate.purityPercent}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Germination Rate</span>
                      <span className="text-emerald-400 font-bold">{product.qrCertificate.germinationPercent}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onVerifyQr(product)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Update QR Certification Status</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'distributor' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">Primary Distributor & Fulfillment Hub</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Operating Firm</span>
                    <span className="text-white font-semibold">{product.distributorFirm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Telephone</span>
                    <span className="text-slate-200 font-mono">{product.distributorMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Fulfillment Location</span>
                    <span className="text-slate-200">{product.distributorLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Dealer Commission</span>
                    <span className="text-teal-400 font-mono font-bold">{product.dealerCommissionPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'json' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(product, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => onVerifyQr(product)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-teal-300 bg-teal-950/60 hover:bg-teal-900 border border-teal-700/60 rounded-lg font-semibold transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Verify QR Certificate</span>
          </button>

          <button
            onClick={() => onEditProduct(product)}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Product SKU</span>
          </button>
        </div>
      </div>
    </div>
  );
}
