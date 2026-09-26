import React from 'react';
import { Search, Filter, RefreshCw, Download, Layers, ShieldCheck, X, Wifi, PlusCircle } from 'lucide-react';
import { COMMODITIES_LIST } from '../../services/mockData';

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  commodityFilter,
  setCommodityFilter,
  activeViewTab,
  setActiveViewTab,
  onRefresh,
  onTriggerSync,
  onOpenManualOverride,
  onExportCsv,
  onExportJson,
  loading
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || commodityFilter !== 'All Commodities';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCommodityFilter('All Commodities');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 space-y-3.5 shadow-xs">
      {/* Top row: Tab Switcher & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        {/* Collection Identity Indicator */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeViewTab === 'vyapari_rates' ? 'Vyapari 2-Hourly Submissions Queue' : 'Official Agmarknet Mandi Benchmarks'}</span>
          </span>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
            {activeViewTab === 'vyapari_rates' ? 'vyapari_rates' : 'mandi_prices'}
          </span>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Trigger Agmarknet Sync */}
          <button
            onClick={onTriggerSync}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            title="Trigger manual sync with central Agmarknet / eNAM gateway"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trigger Agmarknet Sync</span>
          </button>

          {/* Manual Rate Override */}
          <button
            onClick={onOpenManualOverride}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
            title="Manual rate entry or override for mandis with broken government feeds"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manual Rate Override</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            title="Export Rates Ledger to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold border border-emerald-200 shadow-xs"
            title="Export JSON"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Bottom row: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Full-text search */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (#VR-901), Mandi name, Trader firm, or Commodity..."
            className="w-full pl-9 pr-8 py-2 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Commodity Filter */}
          <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-600">Commodity:</span>
            <select
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {COMMODITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-800">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-800">All Statuses</option>
              <option value="pending" className="bg-white text-amber-700">⏳ Pending Approval</option>
              <option value="approved" className="bg-white text-emerald-700">✓ Approved & Live</option>
              <option value="flagged" className="bg-white text-rose-700">⚠️ Flagged Predatory</option>
              <option value="rejected" className="bg-white text-slate-600">✕ Rejected</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-emerald-50/60 border border-emerald-200 rounded-xl transition-colors hover:bg-emerald-100 disabled:opacity-50 shadow-xs"
            title="Refresh Rates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Compliance & Sanity Band Notice */}
      <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            <strong className="text-slate-700">SOP-04 Sanity Band Policy:</strong> Trader rates exceeding ±15% of official Agmarknet modal price trigger automated predatory alerts.
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          Sync Interval: 2-Hourly Feeds · Net-Profit Calculator: Active
        </div>
      </div>
    </div>
  );
}
