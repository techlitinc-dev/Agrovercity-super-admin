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
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Catalog SKUs
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              totalProducts
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span className="text-emerald-400 font-bold">{totalInventoryUnits} Units</span>
            {lowStockCount > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-400">{lowStockCount} Low Stock</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Orders Pipeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Orders
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              activeOrdersCount
            )}
          </div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            <span>In Fulfillment Pipeline ({totalOrdersCount} Total)</span>
          </div>
        </div>
      </div>

      {/* 3. Marketplace GMV */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Gross GMV
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-teal-400 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatLakh(totalGmv)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Input Purchases Volume</span>
          </div>
        </div>
      </div>

      {/* 4. Razorpay Refunds Processed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Refunds Issued
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-rose-400 tracking-tight">
            {loading ? (
              <div className="w-20 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              formatLakh(totalRefunded)
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Razorpay Auto-Disbursed</span>
          </div>
        </div>
      </div>

      {/* 5. Agmark QR Authenticity Rate */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            QR Certified Genuine
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <QrCode className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            {loading ? (
              <div className="w-16 h-7 bg-slate-800 animate-pulse rounded" />
            ) : (
              `${qrCertifiedRate}%`
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Agmark / Ministry Attested</span>
          </div>
        </div>
      </div>
    </div>
  );
}
