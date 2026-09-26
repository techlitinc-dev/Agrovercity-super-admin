import React from 'react';
import {
  Search,
  RefreshCw,
  Download,
  Tractor,
  CalendarClock,
  FileText,
  Scale,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  X,
  LayoutGrid
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
  onRegisterMachine,
  onResetSeed,
  loading = false
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || ownerTypeFilter !== 'all';

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setOwnerTypeFilter('all');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      {/* Top Row: Navigation Tabs & Export / Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
        {/* 6 Core Tabs */}
        <div className="flex flex-wrap items-center bg-slate-100/80 border border-slate-200/80 rounded-xl p-1 text-xs gap-0.5">
          <button
            onClick={() => {
              setActiveTab('machines');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'machines'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>Machinery Fleet</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('matrix');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Yantra Slot Matrix</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('slots');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'slots'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Slot Ledger</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bookings');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bookings & Disputes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('benchmarks');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'benchmarks'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Pricing Benchmarks</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('audit_trail');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'audit_trail'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Operational Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onRegisterMachine && (
            <button
              onClick={onRegisterMachine}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Machine</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="Download active view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="Export filtered records as JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {onResetSeed && (
            <button
              onClick={onResetSeed}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
              title="Reset Equipment mock seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Search & Filter Inputs */}
      {activeTab !== 'matrix' && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Full-text Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'machines'
                  ? 'Search machine ID, name, owner name, mobile, district...'
                  : activeTab === 'slots'
                  ? 'Search slot ID, machine, owner, date, booked-by farmer...'
                  : activeTab === 'bookings'
                  ? 'Search booking ID, farmer name, mobile, machine, date...'
                  : activeTab === 'benchmarks'
                  ? 'Search district, machinery class, or category...'
                  : 'Search audit ID, action, target subject, or admin UID...'
              }
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
            {(activeTab === 'machines' || activeTab === 'bookings') && (
              <div className="relative min-w-[150px]">
                <select
                  value={ownerTypeFilter}
                  onChange={(e) => setOwnerTypeFilter(e.target.value)}
                  className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
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
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
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

                {activeTab === 'benchmarks' && (
                  <>
                    <option value="all">All Tariff Compliance</option>
                    <option value="compliant">Fair Tariff (Compliant)</option>
                    <option value="flagged_variance">Flagged Variance (&gt;20%)</option>
                  </>
                )}

                {activeTab === 'audit_trail' && (
                  <>
                    <option value="all">All Audit Actions</option>
                    <option value="EQUIPMENT_VERIFIED">Machine Verifications</option>
                    <option value="DOUBLE_BOOKING">Slot Anomalies</option>
                    <option value="DAMAGE_REPORT">Deposit Rulings</option>
                    <option value="BENCHMARK">Tariff Overrides</option>
                  </>
                )}
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
