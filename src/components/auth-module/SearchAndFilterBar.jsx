import React from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, X, User } from 'lucide-react';

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  personaFilter,
  setPersonaFilter,
  dateFilter,
  setDateFilter,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || personaFilter !== 'all' || dateFilter !== '30d';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPersonaFilter('all');
    setDateFilter('30d');
  };

  return (
    <div className="bg-white/90 border border-emerald-100/90 rounded-2xl p-4 mb-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-3">
      {/* Primary Row: Wireframe Search + Filter Controls + Export */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID (#1001), phone, or Firebase UID..."
            className="w-full pl-10 pr-9 py-2.5 bg-emerald-50/30 border border-emerald-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-none min-w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-emerald-50/30 border border-emerald-200/80 text-xs text-slate-800 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="all">Status: All</option>
              <option value="verified">Verified / Active</option>
              <option value="pending">Pending Setup</option>
              <option value="flagged">Flagged Anomaly</option>
              <option value="locked">Locked Out</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3 h-3" />
            </div>
          </div>

          {/* Persona Dropdown */}
          <div className="relative flex-1 sm:flex-none min-w-[140px]">
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="w-full appearance-none bg-emerald-50/30 border border-emerald-200/80 text-xs text-slate-800 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="all">Persona: All Roles</option>
              <option value="Farmer">Farmer</option>
              <option value="Produce Buyer">Produce Buyer</option>
              <option value="Transporter">Transporter</option>
              <option value="FPO Lead">FPO Lead</option>
              <option value="Equipment Owner">Equipment Owner</option>
              <option value="Agri-Expert">Agri-Expert</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-3 h-3" />
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative flex-1 sm:flex-none min-w-[130px]">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none bg-emerald-50/30 border border-emerald-200/80 text-xs text-slate-800 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-3 h-3" />
            </div>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh from server"
            className="px-3 py-2.5 bg-white hover:bg-emerald-50 border border-emerald-200/80 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span className="hidden xl:inline">Refresh</span>
          </button>

          {/* Export Actions Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={onExportCsv}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onExportJson}
              title="Export Full JSON dataset"
              className="px-2.5 py-2.5 bg-white hover:bg-emerald-50 border border-emerald-200/80 text-emerald-800 rounded-xl text-xs font-mono font-bold transition-colors shadow-2xs"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips bar (if filters applied) */}
      {hasActiveFilters && (
        <div className="pt-2.5 border-t border-emerald-100/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-wrap text-slate-500">
            <span className="font-semibold text-slate-700">Active Filters:</span>
            {searchQuery && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                Query: "{searchQuery}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                Status: {statusFilter}
              </span>
            )}
            {personaFilter !== 'all' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                Persona: {personaFilter}
              </span>
            )}
            {dateFilter !== '30d' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                Window: {dateFilter}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-emerald-700 hover:text-emerald-900 font-bold underline text-xs ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
