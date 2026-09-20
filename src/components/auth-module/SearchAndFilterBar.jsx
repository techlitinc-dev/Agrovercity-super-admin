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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-sm shadow-xl space-y-3">
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
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
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
              className="w-full appearance-none bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
              className="w-full appearance-none bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
              className="w-full appearance-none bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden xl:inline">Refresh</span>
          </button>

          {/* Export Actions Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={onExportCsv}
              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onExportJson}
              title="Export Full JSON dataset"
              className="px-2.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-mono font-medium transition-colors"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips bar (if filters applied) */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-wrap text-slate-400">
            <span className="font-semibold text-slate-300">Active Filters:</span>
            {searchQuery && (
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                Query: "{searchQuery}"
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                Status: {statusFilter}
              </span>
            )}
            {personaFilter !== 'all' && (
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                Persona: {personaFilter}
              </span>
            )}
            {dateFilter !== '30d' && (
              <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded-md border border-slate-700">
                Window: {dateFilter}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-emerald-400 hover:text-emerald-300 font-medium underline text-xs ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
