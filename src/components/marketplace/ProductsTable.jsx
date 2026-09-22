import React, { useState } from 'react';
import {
  Eye,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Star,
  Edit3,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function ProductsTable({
  products = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectProduct,
  onVerifyQr,
  onToggleStatus,
  loading = false,
  selectedIds = [],
  setSelectedIds
}) {
  const { addToast } = useNotification();
  const [copiedSku, setCopiedSku] = useState(null);

  const handleCopySku = (sku, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    addToast({ title: 'Copied', message: `SKU ${sku} copied`, type: 'info' });
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatusBadge = (status, stock) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock ({stock})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock ({stock})
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Sold Out (0)
          </span>
        );
      case 'discontinued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
            Discontinued
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Agricultural Input Catalog (products)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {products.length} SKUs Listed
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          Govt Seed Act, Fertilizer Control Order & CIBRC Registration Verified
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={products.length > 0 && selectedIds.length === products.length}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="py-3.5 px-3.5 w-28">SKU Code</th>
              <th className="py-3.5 px-4 min-w-[220px]">Product Name & Brand</th>
              <th className="py-3.5 px-4 min-w-[150px]">Category</th>
              <th className="py-3.5 px-4 min-w-[150px]">Price & MRP</th>
              <th className="py-3.5 px-3 min-w-[130px]">Inventory</th>
              <th className="py-3.5 px-3 min-w-[160px]">QR Authenticity</th>
              <th className="py-3.5 px-3 min-w-[120px]">Rating</th>
              <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading catalog products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                  No products match the active query or category filter.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    onClick={() => onInspectProduct(product)}
                    className={`hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-100/40' : ''
                    }`}
                  >
                    {/* Select Checkbox */}
                    <td className="py-3.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(product.id, e)}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* SKU Code */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold text-xs">
                        <span>{product.sku}</span>
                        <button
                          onClick={(e) => handleCopySku(product.sku, e)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Copy SKU"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {product.id}
                      </span>
                    </td>

                    {/* Product Name & Brand */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-emerald-200 shrink-0 bg-slate-50 shadow-2xs"
                        />
                        <div className="truncate max-w-[200px]">
                          <div className="font-bold text-slate-900 truncate text-xs">
                            {product.name}
                          </div>
                          <div className="text-[11px] font-medium text-emerald-700">{product.brand}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Distributor: {product.distributorFirm}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-900 text-xs block">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{product.subCategory}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {product.unit}
                      </span>
                    </td>

                    {/* Price & MRP */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {product.discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                      <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                        Margin: {product.dealerCommissionPercent}%
                      </span>
                    </td>

                    {/* Inventory Stock */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(product.status, product.stockQuantity)}
                    </td>

                    {/* QR Certificate */}
                    <td className="py-3.5 px-3">
                      {product.qrCertificate?.verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full border border-teal-300/80 shadow-2xs">
                          <QrCode className="w-3 h-3 text-teal-700" /> Agmark Attested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300/80 shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Uncertified
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[140px]">
                        {product.qrCertificate?.certificateNumber || 'Pending'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({product.reviewsCount} reviews)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectProduct(product)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Inspect product dossier and edit SKU"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onVerifyQr(product)}
                          className="p-1.5 text-xs text-teal-800 hover:text-teal-950 bg-teal-100 hover:bg-teal-200 border border-teal-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Verify or inspect QR Certificate"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {products.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
