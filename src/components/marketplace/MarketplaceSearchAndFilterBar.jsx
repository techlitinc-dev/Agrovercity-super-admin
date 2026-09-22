import React from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  ShoppingBag,
  PackageCheck,
  CreditCard,
  MessageSquare,
  PlusCircle,
  X
} from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '../../services/mockData';

export function MarketplaceSearchAndFilterBar({
  activeTab = 'products',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onAddNewProduct,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'All Categories';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('All Categories');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 4 Tabs */}
        <div className="flex items-center bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('products');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Orders & Shipments</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('payments');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Razorpay Payments</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reviews');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'products' && (
            <button
              onClick={onAddNewProduct}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Product SKU</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="Download active view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>JSON</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Full-text Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-emerald-700/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'products'
                ? 'Search product name, brand, SKU, category, distributor...'
                : activeTab === 'orders'
                ? 'Search order ID, farmer name, mobile, tracking #, Razorpay payment ID...'
                : activeTab === 'payments'
                ? 'Search payment ID, order ID, farmer name, Razorpay ID...'
                : 'Search product review comment, reviewer name, SKU...'
            }
            className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Category Filter (Active for products) */}
          {activeTab === 'products' && (
            <div className="relative min-w-[160px]">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
              >
                <option value="All Categories">All Categories</option>
                {MARKETPLACE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Context-Sensitive Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
            >
              {activeTab === 'products' && (
                <>
                  <option value="all">All Stock Statuses</option>
                  <option value="active">Active (In Stock)</option>
                  <option value="low_stock">Low Stock (≤ 15 units)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </>
              )}

              {activeTab === 'orders' && (
                <>
                  <option value="all">All Order Statuses</option>
                  <option value="placed">Placed (Pending Confirm)</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched / In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled & Refunded</option>
                </>
              )}

              {activeTab === 'payments' && (
                <>
                  <option value="all">All Payment States</option>
                  <option value="captured">Captured (Settled)</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </>
              )}

              {activeTab === 'reviews' && (
                <>
                  <option value="all">All Moderation States</option>
                  <option value="approved">Approved (Live)</option>
                  <option value="flagged">Flagged for Review</option>
                  <option value="rejected">Rejected / Hidden</option>
                </>
              )}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 font-bold shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
