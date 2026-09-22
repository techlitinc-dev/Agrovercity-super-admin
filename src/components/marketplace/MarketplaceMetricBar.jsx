import React from 'react';
import {
  ShoppingBag,
  PackageCheck,
  TrendingUp,
  CreditCard,
  QrCode,
  AlertTriangle
} from 'lucide-react';

export function MarketplaceMetricBar({ kpis = {}, loading = false }) {
  const {
    totalProducts = 0,
    totalInventoryUnits = 0,
    lowStockCount = 0,
    activeOrdersCount = 0,
    totalOrdersCount = 0,
    totalGmv = 0,
    totalRefunded = 0,
    qrCertifiedRate = 0
  } = kpis;

  const formatLakh = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Catalog SKUs & Inventory */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Catalog SKUs
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              totalProducts
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-emerald-700 font-bold">{totalInventoryUnits} Units</span>
            {lowStockCount > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-700 font-bold">{lowStockCount} Low Stock</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Orders Pipeline */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Orders
          </span>
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-xs group-hover:scale-105 transition-transform">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              activeOrdersCount
            )}
          </div>
          <div className="text-[11px] text-teal-700 mt-1 flex items-center gap-1 font-semibold">
            <span>In Pipeline ({totalOrdersCount} Total)</span>
          </div>
        </div>
      </div>

      {/* 3. Marketplace GMV */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gross GMV
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-emerald-800 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              formatLakh(totalGmv)
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Input Purchases Volume</span>
          </div>
        </div>
      </div>

      {/* 4. Razorpay Refunds Processed */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-rose-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Refunds Issued
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-xs group-hover:scale-105 transition-transform">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-rose-100/50 animate-pulse rounded-lg" />
            ) : (
              formatLakh(totalRefunded)
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Razorpay Auto-Disbursed</span>
          </div>
        </div>
      </div>

      {/* 5. Agmark QR Authenticity Rate */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            QR Certified Genuine
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs group-hover:scale-105 transition-transform">
            <QrCode className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-emerald-700 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-emerald-100/50 animate-pulse rounded-lg" />
            ) : (
              `${qrCertifiedRate}%`
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Agmark / Ministry Attested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
