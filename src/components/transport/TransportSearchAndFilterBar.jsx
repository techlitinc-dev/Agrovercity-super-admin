import React from 'react';
import {
  Search,
  RefreshCw,
  Download,
  Truck,
  FileText,
  Wallet,
  X
} from 'lucide-react';

export function TransportSearchAndFilterBar({
  activeTab = 'fleet',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 3 Core Tabs */}
        <div className="flex items-center bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('fleet');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'fleet'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fleet & Papers (vehicles)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookings');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dispatch & Trips (transport_bookings)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settlements');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'settlements'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>POD Audit & Payouts (transporter_settlements)</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Download active view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>JSON</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Search & Filter Inputs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Full-text Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'fleet'
                ? 'Search vehicle ID, registration, transporter name, mobile, district...'
                : activeTab === 'bookings'
                ? 'Search booking ID, customer, transporter, pickup village, drop mandi...'
                : 'Search settlement ID, transporter, booking ID, payout mode...'
            }
            className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
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
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="relative min-w-[170px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all"
            >
              {activeTab === 'fleet' && (
                <>
                  <option value="all">All Fleet Statuses</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="verified">Verified (Dispatchable)</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <option value="all">All Trip Statuses</option>
                  <option value="requested">Requested (Unassigned)</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered (POD Pending)</option>
                  <option value="pod_submitted">POD Submitted</option>
                  <option value="completed">Completed</option>
                  <option value="disputed">Disputed</option>
                  <option value="no_show">No-Show / Breakdown</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}

              {activeTab === 'settlements' && (
                <>
                  <option value="all">All Settlement States</option>
                  <option value="pending">Pending POD Audit</option>
                  <option value="approved">Approved (Sign-off Pending)</option>
                  <option value="paid">Paid / Released</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 font-bold shadow-2xs"
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
