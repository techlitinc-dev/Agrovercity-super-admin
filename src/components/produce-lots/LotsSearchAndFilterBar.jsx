import React from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Package,
  FileText,
  Truck,
  Wallet,
  X,
  PlusCircle
} from 'lucide-react';
import { COMMODITIES_LIST } from '../../services/mockData';

export function LotsSearchAndFilterBar({
  activeTab = 'lots',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  commodityFilter,
  setCommodityFilter,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || commodityFilter !== 'All Commodities';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCommodityFilter('All Commodities');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 4 Core Tabs */}
        <div className="flex items-center bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('lots');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'lots'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produce Lots</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('deals');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'deals'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>B2B Deals & Escrow</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('procurements');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'procurements'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Trader Procurements</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('buyer_ledgers');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'buyer_ledgers'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Buyer Ledgers & Udhaar</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
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

      {/* Bottom Row: Search & Filter Inputs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Full-text Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-emerald-700/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'lots'
                ? 'Search lot ID, farmer name, mobile, district, commodity, variety...'
                : activeTab === 'deals'
                ? 'Search deal ID, lot ID, farmer, buyer firm, broker...'
                : activeTab === 'procurements'
                ? 'Search procurement ID, trader, farmer, weighbridge slip...'
                : 'Search buyer entity, APMC license, GSTIN, PAN...'
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

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Commodity Dropdown (for lots, deals, procurements) */}
          {activeTab !== 'buyer_ledgers' && (
            <div className="relative min-w-[150px]">
              <select
                value={commodityFilter}
                onChange={(e) => setCommodityFilter(e.target.value)}
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
              >
                <option value="All Commodities">All Commodities</option>
                {COMMODITIES_LIST &&
                  COMMODITIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Status Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
            >
              {activeTab === 'lots' && (
                <>
                  <option value="all">All Statuses</option>
                  <option value="active">Active (Trading)</option>
                  <option value="under_review">Under Review</option>
                  <option value="deal_locked">Deal Locked</option>
                  <option value="disputed">Disputed</option>
                  <option value="sold">Sold</option>
                  <option value="suspended">Suspended / Takedown</option>
                </>
              )}

              {activeTab === 'deals' && (
                <>
                  <option value="all">All Deal States</option>
                  <option value="contract_signed">Contract Signed</option>
                  <option value="weighbridge_verified">Weighbridge Verified</option>
                  <option value="completed">Completed & Released</option>
                  <option value="disputed">Disputed / In Escrow Hold</option>
                  <option value="cancelled">Cancelled & Refunded</option>
                </>
              )}

              {activeTab === 'procurements' && (
                <>
                  <option value="all">All Procurements</option>
                  <option value="verified">Weighbridge Verified</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="settled">Settled (Paid in Full)</option>
                  <option value="disputed">Disputed</option>
                </>
              )}

              {activeTab === 'buyer_ledgers' && (
                <>
                  <option value="all">All Credit Profiles</option>
                  <option value="low">Low Risk (AAA/AA)</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="critical">Critical Risk / Limit Exceeded</option>
                </>
              )}
            </select>
          </div>

          {/* Reset Filters */}
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
