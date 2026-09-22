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
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 space-y-3.5 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Full-text search input */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by KYC ID (#2001), user name, phone, document name, or 7/12 Gat No..."
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
          {/* Document Type Filter */}
          <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600">Document:</span>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {KYC_DOCUMENT_TYPES.map((dt) => (
                <option key={dt.id} value={dt.id} className="bg-white text-slate-800">
                  {dt.label}
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
              <option value="pending" className="bg-white text-amber-700">⏳ Pending Review</option>
              <option value="verified" className="bg-white text-emerald-700">✓ Verified & Badged</option>
              <option value="flagged" className="bg-white text-rose-700">⚠️ Flagged Anomaly</option>
              <option value="rejected" className="bg-white text-slate-600">✕ Rejected</option>
            </select>
          </div>

          {/* Persona Filter */}
          <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-600">Persona:</span>
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-800">All Personas</option>
              <option value={PERSONA_TYPES.FARMER} className="bg-white text-slate-800">🌾 Farmer</option>
              <option value={PERSONA_TYPES.LANDLORD} className="bg-white text-slate-800">🏡 Landlord</option>
              <option value={PERSONA_TYPES.TRANSPORTER} className="bg-white text-slate-800">🚚 Transporter</option>
              <option value={PERSONA_TYPES.SELLER} className="bg-white text-slate-800">🏪 Seller</option>
              <option value={PERSONA_TYPES.EQUIPMENT_OWNER} className="bg-white text-slate-800">🚜 Equipment Owner</option>
              <option value={PERSONA_TYPES.BROKER} className="bg-white text-slate-800">⚖️ Broker</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white text-slate-800">All Time</option>
              <option value="24h" className="bg-white text-slate-800">Last 24 Hours</option>
              <option value="7d" className="bg-white text-slate-800">Last 7 Days</option>
              <option value="30d" className="bg-white text-slate-800">Last 30 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
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
            className="p-2 text-slate-600 hover:text-slate-900 bg-emerald-50/60 border border-emerald-200 rounded-xl transition-colors hover:bg-emerald-100 disabled:opacity-50 shadow-xs"
            title="Refresh KYC Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>

          {/* Export Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Export KYC Audit Roster to CSV (DPDP Masked)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors shadow-xs"
              title="Export Full JSON Schema"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Notice Strip */}
      <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            <strong className="text-slate-700">SOP-03 Security Standard:</strong> Documents stored with AES-256 encryption. Automated OCR comparison & Aadhaar redaction checks active.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span className="text-emerald-700 font-semibold">OCR Pipeline: Active</span>
          <span>•</span>
          <span>Mahabhulekh 7/12: Integrated</span>
        </div>
      </div>
    </div>
  );
}
