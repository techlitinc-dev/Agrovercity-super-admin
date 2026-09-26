import React from 'react';
import {
  Search,
  RefreshCw,
  Download,
  FileText,
  Users,
  Building2,
  Lock,
  AlertTriangle,
  ShieldCheck,
  PlusCircle,
  X
} from 'lucide-react';

export function ContractsSearchAndFilterBar({
  activeTab = 'contracts',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onDraftContract,
  onOnboardBuyer,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = Boolean(searchQuery || (statusFilter && statusFilter !== 'all'));

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Global Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 6 Tabs */}
        <div className="flex flex-wrap items-center bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-1 text-xs gap-0.5">
          <button
            onClick={() => {
              setActiveTab('contracts');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'contracts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Buyer Contracts Catalog</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('acceptances');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'acceptances'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Farmer Acceptances</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('buyers');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'buyers'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Buyers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('escrow');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'escrow'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Escrow Ledger</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('disputes');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'disputes'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Disputes & Arbitration</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audit_trail');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audit_trail'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Decision Audit Trail</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'contracts' && (
            <button
              onClick={onDraftContract}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Draft Contract</span>
            </button>
          )}

          {activeTab === 'buyers' && (
            <button
              onClick={onOnboardBuyer}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Onboard Corporate Buyer</span>
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

      {/* Bottom Row: Full-text Search & Contextual Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Full-text Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-emerald-700/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'contracts'
                ? 'Search contract ID, corporate buyer (ITC, Reliance...), farmer name, crop, hub...'
                : activeTab === 'acceptances'
                ? 'Search acceptance ID, contract #, farmer name, mobile, district, crop...'
                : activeTab === 'buyers'
                ? 'Search corporate company name, brand, CIN, GSTIN, signatory...'
                : activeTab === 'escrow'
                ? 'Search escrow transaction ID, contract #, buyer, farmer, bank UTR...'
                : activeTab === 'disputes'
                ? 'Search disputed contract, claim details, buyer, crop, reason...'
                : 'Search audit ID, admin UID, action, contract #, rationale...'
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
          {/* Status Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
            >
              {activeTab === 'contracts' && (
                <>
                  <option value="all">All Contract Stages</option>
                  <option value="draft">Drafts</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published to Farmers</option>
                  <option value="active">Active (Sowing Locked)</option>
                  <option value="fulfilled">Fulfilled & Settled</option>
                  <option value="disputed">Disputed</option>
                  <option value="breached">Breached Default</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}

              {activeTab === 'acceptances' && (
                <>
                  <option value="all">All Signing Statuses</option>
                  <option value="verified">MPIN Cryptographically Verified</option>
                  <option value="failed">Verification Failed / Pending</option>
                </>
              )}

              {activeTab === 'buyers' && (
                <>
                  <option value="all">All Verification Statuses</option>
                  <option value="verified">Verified Corporate Buyers</option>
                  <option value="pending_audit">Pending Audit / KYC</option>
                </>
              )}

              {activeTab === 'escrow' && (
                <>
                  <option value="all">All Escrow Ledger Events</option>
                  <option value="release">Escrow Payout Releases</option>
                  <option value="deposit">Escrow Inflow Deposits</option>
                </>
              )}

              {activeTab === 'disputes' && (
                <>
                  <option value="all">All Dispute Categories</option>
                  <option value="disputed">Under Active Arbitration</option>
                  <option value="breached">Breached & Defaulted</option>
                </>
              )}

              {activeTab === 'audit_trail' && (
                <>
                  <option value="all">All Audit Actions</option>
                  <option value="BUYER_CONTRACT_PUBLISHED">Contract Publications</option>
                  <option value="ESCROW_PAYMENT_RELEASED">Escrow Payment Releases</option>
                  <option value="CONTRACT_DISPUTE_ARBITRATED">Arbitration Verdicts</option>
                  <option value="BUYER_CONTRACT_STATUS_UPDATED">State Transitions</option>
                  <option value="INSTITUTIONAL_BUYER_ONBOARDED">Buyer Onboarding</option>
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
