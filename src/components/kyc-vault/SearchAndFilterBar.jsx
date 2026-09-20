import React from 'react';
import { Search, Filter, Download, RefreshCw, FileText, Calendar, ShieldCheck, X } from 'lucide-react';
import { KYC_DOCUMENT_TYPES, PERSONA_TYPES } from '../../services/mockData';

export function SearchAndFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  docTypeFilter,
  setDocTypeFilter,
  personaFilter,
  setPersonaFilter,
  dateFilter,
  setDateFilter,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || docTypeFilter !== 'all' || personaFilter !== 'all' || dateFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDocTypeFilter('all');
    setPersonaFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Full-text search input */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by KYC ID (#2001), user name, phone, document name, or 7/12 Gat No..."
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
          {/* Document Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400">Document:</span>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {KYC_DOCUMENT_TYPES.map((dt) => (
                <option key={dt.id} value={dt.id} className="bg-slate-900 text-slate-200">
                  {dt.label}
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
              <option value="pending" className="bg-slate-900 text-amber-400">⏳ Pending Review</option>
              <option value="verified" className="bg-slate-900 text-emerald-400">✓ Verified & Badged</option>
              <option value="flagged" className="bg-slate-900 text-rose-400">⚠️ Flagged Anomaly</option>
              <option value="rejected" className="bg-slate-900 text-slate-400">✕ Rejected</option>
            </select>
          </div>

          {/* Persona Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Persona:</span>
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Personas</option>
              <option value={PERSONA_TYPES.FARMER} className="bg-slate-900 text-slate-200">🌾 Farmer</option>
              <option value={PERSONA_TYPES.LANDLORD} className="bg-slate-900 text-slate-200">🏡 Landlord</option>
              <option value={PERSONA_TYPES.TRANSPORTER} className="bg-slate-900 text-slate-200">🚚 Transporter</option>
              <option value={PERSONA_TYPES.SELLER} className="bg-slate-900 text-slate-200">🏪 Seller</option>
              <option value={PERSONA_TYPES.EQUIPMENT_OWNER} className="bg-slate-900 text-slate-200">🚜 Equipment Owner</option>
              <option value={PERSONA_TYPES.BROKER} className="bg-slate-900 text-slate-200">⚖️ Broker</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Time</option>
              <option value="24h" className="bg-slate-900 text-slate-200">Last 24 Hours</option>
              <option value="7d" className="bg-slate-900 text-slate-200">Last 7 Days</option>
              <option value="30d" className="bg-slate-900 text-slate-200">Last 30 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-rose-900/60 transition-colors flex items-center gap-1"
              title="Reset all filters"
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
            title="Refresh KYC Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Export Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
              title="Export KYC Audit Roster to CSV (DPDP Masked)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              title="Export Full JSON Schema"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Notice Strip */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>
            <strong>SOP-03 Security Standard:</strong> Documents stored with AES-256 encryption. Automated OCR comparison & Aadhaar redaction checks active.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
          <span>OCR Pipeline: Active</span>
          <span>•</span>
          <span>Mahabhulekh 7/12: Integrated</span>
        </div>
      </div>
    </div>
  );
}
