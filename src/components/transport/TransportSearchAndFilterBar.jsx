import React from 'react';
import {
  Search,
  RefreshCw,
  Download,
  Truck,
  FileText,
  Wallet,
  Navigation,
  Tag,
  ShieldCheck,
  PlusCircle,
  X
} from 'lucide-react';

export function TransportSearchAndFilterBar({
  activeTab = 'fleet',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRegisterVehicle,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = searchQuery || (statusFilter && statusFilter !== 'all');

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 6 Tabs */}
        <div className="flex flex-wrap items-center bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-1 text-xs gap-0.5">
          <button
            onClick={() => {
              setActiveTab('fleet');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'fleet'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fleet & Papers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookings');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dispatch & Trips</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('live_dispatch');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'live_dispatch'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Live Radar & Routes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settlements');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'settlements'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>POD Audit & Payouts</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('fare_bands');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'fare_bands'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Fare Bands & Tariffs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audit_trail');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'audit_trail'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Decision Audit Trail</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
          {activeTab === 'fleet' && (
            <button
              onClick={onRegisterVehicle}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Vehicle</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Download active view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>JSON</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs disabled:opacity-50"
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
                : activeTab === 'live_dispatch'
                ? 'Search active trip ID, driver, vehicle registration, corridor, cargo...'
                : activeTab === 'settlements'
                ? 'Search settlement ID, transporter, booking ID, payout mode...'
                : activeTab === 'fare_bands'
                ? 'Search rural corridor, district hub, vehicle class...'
                : 'Search audit ID, admin UID, action, registration, reason...'
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

              {activeTab === 'live_dispatch' && (
                <>
                  <option value="all">All Active Transponder States</option>
                  <option value="in_transit">In Transit (Highway)</option>
                  <option value="at_pickup">At Farm-Gate Loading</option>
                  <option value="disputed">Disputed / SOS Incident</option>
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

              {activeTab === 'fare_bands' && (
                <>
                  <option value="all">All Vehicle Classes</option>
                  <option value="1-Ton">1-Ton Mini Truck</option>
                  <option value="3-Ton">3-Ton Light Commercial</option>
                  <option value="7-Ton">7-Ton Medium Duty</option>
                  <option value="16-Ton">16-Ton Multi-Axle</option>
                  <option value="Reefer">Reefer Cold Chain</option>
                  <option value="Tractor">Tractor Trolley</option>
                </>
              )}

              {activeTab === 'audit_trail' && (
                <>
                  <option value="all">All Audit Actions</option>
                  <option value="VEHICLE_COMMERCIAL_PAPERS_VERIFIED">Paper Verifications</option>
                  <option value="TRANSPORTER_PAYOUT_RELEASED">Payout Releases</option>
                  <option value="TRANSPORT_DISPUTE_ARBITRATED">Dispute Arbitrations</option>
                  <option value="TRANSPORT_BOOKING_STATUS_OVERRIDDEN">Trip Status Overrides</option>
                  <option value="TRANSPORT_FARE_BAND_UPDATED">Tariff Revisions</option>
                  <option value="VEHICLE_ONBOARDED_TO_FLEET">Vehicle Registrations</option>
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
