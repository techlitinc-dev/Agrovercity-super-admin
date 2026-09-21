import React from 'react';
import {
  Search,
  RefreshCw,
  Download,
  Tractor,
  CalendarClock,
  FileText,
  X
} from 'lucide-react';

export function EquipmentSearchAndFilterBar({
  activeTab = 'machines',
  setActiveTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  ownerTypeFilter,
  setOwnerTypeFilter,
  onRefresh,
  onExportCsv,
  onExportJson,
  loading = false
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || ownerTypeFilter !== 'all';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setOwnerTypeFilter('all');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-xs">
      {/* Top Row: Navigation Tabs & Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* 3 Core Tabs */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('machines');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'machines'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>Machinery Inventory (equipment)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('slots');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'slots'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Yantra Slots & Waitlists (equipment_slots)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookings');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Slot Bookings (equipment_bookings)</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Download active view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Search & Filter Inputs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Full-text Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'machines'
                ? 'Search machine ID, name, owner name, mobile, district...'
                : activeTab === 'slots'
                ? 'Search slot ID, machine, owner, date, booked-by farmer...'
                : 'Search booking ID, farmer name, mobile, machine, date...'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {activeTab !== 'slots' && (
            <div className="relative min-w-[150px]">
              <select
                value={ownerTypeFilter}
                onChange={(e) => setOwnerTypeFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="all">All Owner Types</option>
                <option value="fpo">FPO Pool Machines</option>
                <option value="private">Private Owners</option>
              </select>
            </div>
          )}

          <div className="relative min-w-[170px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              {activeTab === 'machines' && (
                <>
                  <option value="all">All Machine Statuses</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="verified">Verified (Bookable)</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </>
              )}

              {activeTab === 'slots' && (
                <>
                  <option value="all">All Slot States</option>
                  <option value="available">Available</option>
                  <option value="pending">Pending Approval</option>
                  <option value="booked">Booked</option>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <option value="all">All Booking Statuses</option>
                  <option value="pending">Pending (Owner Queue)</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1 font-medium"
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
