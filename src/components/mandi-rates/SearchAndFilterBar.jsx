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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
      {/* Top row: Tab Switcher & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* View mode toggle tabs */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveViewTab('vyapari_rates')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeViewTab === 'vyapari_rates'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Trader Live Rates Queue ('Aaj ke Bhav')</span>
          </button>
          <button
            onClick={() => setActiveViewTab('benchmarks')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeViewTab === 'benchmarks'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Agmarknet & eNAM Benchmarks (8 APMCs)</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Trigger Agmarknet Sync */}
          <button
            onClick={onTriggerSync}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 border border-teal-600/40 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Trigger manual sync with central Agmarknet / eNAM gateway"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Trigger Agmarknet Sync</span>
          </button>

          {/* Manual Rate Override */}
          <button
            onClick={onOpenManualOverride}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Manual rate entry or override for mandis with broken government feeds"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manual Rate Override</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            title="Export Rates Ledger to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (#VR-901), Mandi name, Trader firm, or Commodity..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Commodity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Commodity:</span>
            <select
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {COMMODITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="pending" className="bg-slate-900 text-amber-400">⏳ Pending Approval</option>
              <option value="approved" className="bg-slate-900 text-emerald-400">✓ Approved & Live</option>
              <option value="flagged" className="bg-slate-900 text-rose-400">⚠️ Flagged Predatory</option>
              <option value="rejected" className="bg-slate-900 text-slate-400">✕ Rejected</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-rose-900/60 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-700/80 rounded-lg transition-colors hover:border-slate-600 disabled:opacity-50"
            title="Refresh Rates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Compliance & Sanity Band Notice */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            <strong>SOP-04 Sanity Band Policy:</strong> Trader rates exceeding ±15% of official Agmarknet modal price trigger automated predatory alerts.
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          Sync Interval: 2-Hourly Feeds · Net-Profit Calculator: Active
        </div>
      </div>
    </div>
  );
}
