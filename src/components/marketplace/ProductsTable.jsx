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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> In Stock ({stock})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Low Stock ({stock})
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
            <XCircle className="w-3 h-3 text-rose-400" /> Sold Out (0)
          </span>
        );
      case 'discontinued':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Discontinued
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Agricultural Input Catalog (products)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {products.length} SKUs Listed
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Govt Seed Act, Fertilizer Control Order & CIBRC Registration Verified
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={products.length > 0 && selectedIds.length === products.length}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="py-3 px-3 w-28">SKU Code</th>
              <th className="py-3 px-4 min-w-[220px]">Product Name & Brand</th>
              <th className="py-3 px-4 min-w-[150px]">Category</th>
              <th className="py-3 px-4 min-w-[150px]">Price & MRP</th>
              <th className="py-3 px-3 min-w-[130px]">Inventory</th>
              <th className="py-3 px-3 min-w-[160px]">QR Authenticity</th>
              <th className="py-3 px-3 min-w-[120px]">Rating</th>
              <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading catalog products...</span>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
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
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    {/* Select Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(product.id, e)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* SKU Code */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold text-xs">
                        <span>{product.sku}</span>
                        <button
                          onClick={(e) => handleCopySku(product.sku, e)}
                          className="text-slate-500 hover:text-emerald-400 transition-colors"
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-950"
                        />
                        <div className="truncate max-w-[200px]">
                          <div className="font-semibold text-white truncate text-xs">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{product.brand}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Distributor: {product.distributorFirm}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400 text-xs block">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{product.subCategory}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        {product.unit}
                      </span>
                    </td>

                    {/* Price & MRP */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-extrabold text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {product.discountPercent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                      <span className="text-[10px] text-amber-400 block mt-0.5">
                        Dealer Margin: {product.dealerCommissionPercent}%
                      </span>
                    </td>

                    {/* Inventory Stock */}
                    <td className="py-3 px-3">
                      {getStatusBadge(product.status, product.stockQuantity)}
                    </td>

                    {/* QR Certificate */}
                    <td className="py-3 px-3">
                      {product.qrCertificate?.verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                          <QrCode className="w-3 h-3 text-teal-400" /> Agmark Attested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Uncertified
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[140px]">
                        {product.qrCertificate?.certificateNumber || 'Pending'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({product.reviewsCount} reviews)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectProduct(product)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                          title="Inspect product dossier and edit SKU"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onVerifyQr(product)}
                          className="p-1 text-xs text-teal-400 hover:text-white bg-teal-950/60 hover:bg-teal-600 border border-teal-600/40 rounded-md transition-colors"
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
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {products.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
