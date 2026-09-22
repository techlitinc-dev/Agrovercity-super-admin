import React from 'react';
import { Search, Filter, Download, RefreshCw, Layers, Calendar, ShieldCheck, X } from 'lucide-react';
import { PERSONA_TYPES } from '../../services/mockData';

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
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || personaFilter !== 'all' || dateFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPersonaFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Full-text search input */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-emerald-700" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID (#1001), mobile, city, or 7/12 Gat No..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50/70 border border-emerald-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Persona Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-emerald-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-600">Persona:</span>
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-900">All Personas (6)</option>
              <option value={PERSONA_TYPES.FARMER} className="bg-white text-slate-900">🌾 Farmer</option>
              <option value={PERSONA_TYPES.LANDLORD} className="bg-white text-slate-900">🏡 Landlord</option>
              <option value={PERSONA_TYPES.TRANSPORTER} className="bg-white text-slate-900">🚚 Transporter</option>
              <option value={PERSONA_TYPES.SELLER} className="bg-white text-slate-900">🏪 Seller</option>
              <option value={PERSONA_TYPES.EQUIPMENT_OWNER} className="bg-white text-slate-900">🚜 Equipment Owner</option>
              <option value={PERSONA_TYPES.BROKER} className="bg-white text-slate-900">⚖️ Broker</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-emerald-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-900">All Statuses</option>
              <option value="verified" className="bg-white text-emerald-700 font-semibold">Verified</option>
              <option value="pending" className="bg-white text-amber-700 font-semibold">Pending</option>
              <option value="flagged" className="bg-white text-rose-700 font-semibold">Flagged</option>
              <option value="suspended" className="bg-white text-slate-600">Suspended</option>
              <option value="locked" className="bg-white text-red-700 font-semibold">Locked</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-emerald-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-bold text-slate-600">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-900">All Time</option>
              <option value="24h" className="bg-white text-slate-900">Last 24 Hours</option>
              <option value="7d" className="bg-white text-slate-900">Last 7 Days</option>
              <option value="30d" className="bg-white text-slate-900">Last 30 Days</option>
              <option value="90d" className="bg-white text-slate-900">Last 90 Days</option>
            </select>
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 font-semibold"
              title="Reset all search and filter conditions"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-emerald-700 bg-white border border-emerald-200/80 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-50 shadow-2xs"
            title="Refresh User Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Export Dropdown / Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Export User Roster to CSV for State Dept Audits (DPDP Masked)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 rounded-xl text-xs font-semibold border border-emerald-200/80 transition-colors shadow-2xs"
              title="Export Full JSON Document Schema"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Notice Strip */}
      <div className="pt-2 border-t border-emerald-100/90 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            <strong className="text-slate-700">DPDP Act Compliance:</strong> Aadhaar numbers are masked (XXXX-XXXX-1234). Satellite geofences are audit-sealed.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Primary Stars: ⭐ Enabled</span>
          <span>•</span>
          <span>Multi-Persona Switcher: Ready</span>
        </div>
      </div>
    </div>
  );
}
