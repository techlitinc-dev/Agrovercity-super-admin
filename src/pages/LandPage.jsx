import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin,
  GitBranch,
  FileText,
  PlusCircle,
  Download,
  RefreshCw,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  Search,
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Layers,
  Clock
} from 'lucide-react';
import { useAuthAdmin } from '../context/AuthAdminContext';
import { useNotification } from '../context/NotificationContext';
import { adminLandService } from '../services/adminLandService';

import { LeasesTable, ListingsTable, Pagination } from './landWidgets';
import { PlotsTable } from '../components/land/PlotsTable';
import { LeaseRequestsTable } from '../components/land/LeaseRequestsTable';
import { PaymentsLedgerTable } from '../components/land/PaymentsLedgerTable';
import { LandAuditTrailTable } from '../components/land/LandAuditTrailTable';
import LandDetailDrawer from '../components/land/LandDetailDrawer';
import { LeaseAgreementModal } from '../components/land/LeaseAgreementModal';
import { LandDisputeModal } from '../components/land/LandDisputeModal';
import { Audit712Modal } from '../components/land/Audit712Modal';
import { PlotRegistrationModal } from '../components/land/PlotRegistrationModal';

const PAGE_SIZE = 10;

export default function LandPage() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'leases' | 'plots' | 'listings' | 'requests' | 'payments' | 'audit_trail'
  const [activeTab, setActiveTab] = useState('leases');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });

  // Data states
  const [kpis, setKpis] = useState({});
  const [leases, setLeases] = useState([]);
  const [plots, setPlots] = useState([]);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectLease, setInspectLease] = useState(null);
  const [inspectListing, setInspectListing] = useState(null);
  const [agreementTarget, setAgreementTarget] = useState(null);
  const [agreementData, setAgreementData] = useState(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [audit712Target, setAudit712Target] = useState(null);
  const [registerPlotOpen, setRegisterPlotOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const districts = ['Nashik', 'Pune', 'Ahmednagar', 'Jalgaon', 'Sangli', 'Kolhapur', 'Solapur'];

  // Fetch KPI Summary
  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminLandService.getLandKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load Land KPIs', e);
    }
  }, []);

  // Fetch Main Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'leases') {
        const res = await adminLandService.listLeases({
          query: searchQuery,
          status: statusFilter,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setLeases(res.data.leases);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'plots') {
        const res = await adminLandService.listPlots({
          query: searchQuery,
          status: statusFilter,
          district: districtFilter,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setPlots(res.data.plots);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'listings') {
        const res = await adminLandService.listListings({
          query: searchQuery,
          status: statusFilter,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setListings(res.data.listings);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'requests') {
        const res = await adminLandService.listLeaseRequests({
          query: searchQuery,
          status: statusFilter,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setRequests(res.data.requests);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'payments') {
        const res = await adminLandService.listPayments({
          query: searchQuery,
          status: statusFilter,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setPayments(res.data.payments);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'audit_trail') {
        const res = await adminLandService.listLandAuditLogs({
          query: searchQuery,
          page,
          limit: PAGE_SIZE
        });
        if (res.success) {
          setAuditLogs(res.data.auditLogs);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Loading Land Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, statusFilter, districtFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when tab or filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, statusFilter, districtFilter]);

  // Open Agreement Modal
  const handleInspectAgreement = async (lease) => {
    setAgreementTarget(lease);
    setAgreementLoading(true);
    try {
      const data = await adminLandService.inspectAgreement(lease.id);
      setAgreementData(data);
    } catch (err) {
      addToast({
        title: 'Agreement Lookup Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setAgreementLoading(false);
    }
  };

  // Confirm 7/12 Audit Action
  const handleConfirm712 = async ({ listingId, verified, reason }) => {
    setActionLoading(true);
    try {
      const res = await adminLandService.auditListing({
        listingId,
        verified,
        reason,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: verified ? '7/12 Verified' : 'Listing Flagged',
        message: res.message,
        type: verified ? 'success' : 'info'
      });
      setAudit712Target(null);
      fetchData();
    } catch (err) {
      addToast({
        title: '7/12 Audit Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Lease Termination & Arbitration
  const handleConfirmTerminate = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminLandService.terminateLease({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: res.requiresSecondSignOff ? 'Dual Sign-Off Pending (1/2)' : 'Lease Arbitrated',
        message: res.message,
        type: res.requiresSecondSignOff ? 'info' : 'success'
      });
      setDisputeTarget(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Arbitration Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Plot Registration
  const handleConfirmRegisterPlot = async (formData) => {
    setActionLoading(true);
    try {
      const res = await adminLandService.registerPlot(formData, currentAdmin?.email);
      addToast({
        title: 'Plot Registered',
        message: res.message,
        type: 'success'
      });
      setRegisterPlotOpen(false);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Registration Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Rent Reminder Cron
  const handleTriggerReminders = async () => {
    try {
      const res = await adminLandService.triggerRentReminderCron(currentAdmin?.email);
      addToast({
        title: 'Rent Reminders Triggered',
        message: res.message,
        type: 'success'
      });
      fetchData();
    } catch (err) {
      addToast({
        title: 'Cron Execution Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Reset Seed
  const handleResetSeed = async () => {
    try {
      await adminLandService.resetToDefaultSeed();
      addToast({
        title: 'Land Default Seed Restored',
        message: 'Plots, listings, leases, requests, and payments have been reset.',
        type: 'info'
      });
      fetchData();
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Reset Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    let rows = [];
    if (activeTab === 'leases') rows = leases;
    else if (activeTab === 'plots') rows = plots;
    else if (activeTab === 'listings') rows = listings;
    else if (activeTab === 'requests') rows = requests;
    else if (activeTab === 'payments') rows = payments;
    else rows = auditLogs;

    if (rows.length === 0) {
      addToast({ title: 'Export Empty', message: 'No records to export in active view.', type: 'info' });
      return;
    }

    const headers = Object.keys(rows[0]);
    const lines = rows.map((r) =>
      headers
        .map((k) => {
          const val = typeof r[k] === 'object' ? JSON.stringify(r[k]) : String(r[k] ?? '');
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...lines].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrovercity_land_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'CSV Export Ready',
      message: `Exported ${rows.length} ${activeTab} records.`,
      type: 'info'
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport =
      activeTab === 'leases' ? leases :
      activeTab === 'plots' ? plots :
      activeTab === 'listings' ? listings :
      activeTab === 'requests' ? requests :
      activeTab === 'payments' ? payments :
      auditLogs;

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrovercity_land_${activeTab}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON snapshot for ${dataToExport.length} records.`,
      type: 'info'
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <span>Landlord Land Management & Leasing</span>
            </h1>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              SOP-10
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Farmland plot registry, 7/12 cadastral land audits, Marathi/Hindi legal lease agreements, monthly rent escrow tracking, and dispute arbitration.
          </p>
        </div>

        {/* Engine Status Indicator */}
        <div className="text-[11px] font-mono text-slate-600 bg-white border border-emerald-100 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-slate-800">Land Tenancy & Escrow Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Active Leases */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Leases
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
              {loading ? (
                <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                `${kpis.activeLeasesCount || 0}/${kpis.totalLeasesCount || 0}`
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              <span>{kpis.totalPlotsCount || 0} Registered Plots</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending 7/12 Audits */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              7/12 Audit Queue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-amber-600 tracking-tight">
              {loading ? (
                <div className="w-14 h-7 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                kpis.pendingAuditCount || 0
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono flex items-center gap-1">
              {kpis.flaggedCount > 0 ? (
                <span className="text-rose-600 font-bold">{kpis.flaggedCount} Flagged Mismatches</span>
              ) : (
                <span>All listings audited</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 3: Monthly Escrow Rent Volume */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monthly Escrow Rent
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-emerald-700 tracking-tight">
              {loading ? (
                <div className="w-20 h-7 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                `₹${((kpis.monthlyEscrowVolume || 0) / 100000).toFixed(2)} Lakh`
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              <span>Security Deposits: ₹{((kpis.depositVolume || 0) / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Disputed / Overdue Leases */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Disputed / Overdue
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
              {loading ? (
                <div className="w-14 h-7 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                (kpis.disputedLeasesCount || 0) + (kpis.overduePaymentsCount || 0)
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              <span>{kpis.disputedLeasesCount || 0} In Formal Arbitration</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Total Leased Acreage */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Farmland Leased
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
              {loading ? (
                <div className="w-16 h-7 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                `${kpis.totalLeasedAcreage || 0} Acres`
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              <span>{kpis.availableListingsCount || 0} Listings Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs & Search/Filter Controls Bar */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl p-4 space-y-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        {/* Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-100/80">
          {/* 6 Tabs */}
          <div className="flex flex-wrap items-center bg-slate-100/80 border border-slate-200/80 rounded-xl p-1 text-xs gap-0.5">
            <button
              onClick={() => {
                setActiveTab('leases');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'leases'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Active Leases</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('plots');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'plots'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Farmland Plots</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('listings');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Land Listings (7/12 Audit)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('requests');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tenant Requests</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'payments'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Rent Collections</span>
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRegisterPlotOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Parcel</span>
            </button>

            <button
              onClick={handleTriggerReminders}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="Dispatch multi-channel automated rent reminders (SOP-10 §3)"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rent Reminders</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="Download active dataset as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="Export filtered records as JSON"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>JSON</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleResetSeed}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
              title="Reset Land mock seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Full-text Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, landlord, tenant, phone, survey #, taluka or district..."
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

          {/* Contextual Filters */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {activeTab === 'plots' && (
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {activeTab === 'leases' && (
                <>
                  <option value="all">All Lease Statuses</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="disputed">Disputed</option>
                  <option value="terminated">Terminated</option>
                </>
              )}

              {activeTab === 'plots' && (
                <>
                  <option value="all">All Plot States</option>
                  <option value="active">Active Available</option>
                  <option value="leased">Leased Out</option>
                  <option value="under_verification">Pending 7/12</option>
                  <option value="flagged">Flagged</option>
                </>
              )}

              {activeTab === 'listings' && (
                <>
                  <option value="all">All Listing Statuses</option>
                  <option value="available">Available</option>
                  <option value="pending_audit">Pending 7/12 Audit</option>
                  <option value="leased">Leased</option>
                  <option value="flagged">Flagged</option>
                  <option value="removed">Removed</option>
                </>
              )}

              {activeTab === 'requests' && (
                <>
                  <option value="all">All Request Statuses</option>
                  <option value="pending_landlord">Pending Landlord</option>
                  <option value="contract_drafted">Contract Drafted</option>
                  <option value="under_review">Under Review</option>
                  <option value="rejected">Rejected</option>
                </>
              )}

              {activeTab === 'payments' && (
                <>
                  <option value="all">All Payment States</option>
                  <option value="paid">Paid & Disbursed</option>
                  <option value="escrow_held">Escrow Held</option>
                  <option value="overdue">Overdue</option>
                  <option value="disputed">Disputed</option>
                </>
              )}

              {activeTab === 'audit_trail' && (
                <>
                  <option value="all">All Audit Actions</option>
                  <option value="712">7/12 Verifications</option>
                  <option value="FLAGGED">Fraud Flags</option>
                  <option value="TERMINATION">Lease Arbitrations</option>
                  <option value="REMINDER">Cron Reminders</option>
                </>
              )}
            </select>

            {(searchQuery || statusFilter !== 'all' || districtFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDistrictFilter('all');
                }}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Active Tab Table Grid */}
      {activeTab === 'leases' && (
        <div className="space-y-4">
          <LeasesTable
            leases={leases}
            sort={sort}
            onSort={(k) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(l) => setInspectLease(l)}
            onInspectAgreement={(l) => handleInspectAgreement(l)}
            onTerminate={(l) => setDisputeTarget(l)}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={pagination.total}
            onPage={(p) => setPage(p)}
          />
        </div>
      )}

      {activeTab === 'plots' && (
        <PlotsTable
          plots={plots}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectPlot={(p) => setInspectListing({ ...p, landlordName: p.ownerName, landlordPhone: p.ownerPhone, areaAcres: p.totalAcres })}
          onVerify712={(p) => setAudit712Target({ ...p, landlordName: p.ownerName, landlordPhone: p.ownerPhone, areaAcres: p.totalAcres })}
          loading={loading}
        />
      )}

      {activeTab === 'listings' && (
        <div className="space-y-4">
          <ListingsTable
            listings={listings}
            sort={sort}
            onSort={(k) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(x) => setInspectListing(x)}
            onAudit712={(x) => setAudit712Target(x)}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={pagination.total}
            onPage={(p) => setPage(p)}
          />
        </div>
      )}

      {activeTab === 'requests' && (
        <LeaseRequestsTable
          requests={requests}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectRequest={(r) => {
            addToast({
              title: `Tenant Request #${r.id}`,
              message: `${r.tenantName} proposed ₹${Number(r.proposedRentMonthly).toLocaleString('en-IN')}/mo for ${r.proposedDurationMonths} months.`,
              type: 'info'
            });
          }}
          loading={loading}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsLedgerTable
          payments={payments}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'audit_trail' && (
        <LandAuditTrailTable
          auditLogs={auditLogs}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {/* 5. Detail Slide-Over Drawer */}
      <LandDetailDrawer
        lease={inspectLease}
        listing={inspectListing}
        agreement={agreementData}
        agreementLoading={agreementLoading}
        reminders={[]}
        remindersLoading={false}
        onClose={() => {
          setInspectLease(null);
          setInspectListing(null);
        }}
        onTerminate={(l) => {
          setInspectLease(null);
          setDisputeTarget(l);
        }}
        onAuditListing={(x) => {
          setInspectListing(null);
          setAudit712Target(x);
        }}
      />

      {/* 6. Standardized Marathi/Hindi Legal Lease Agreement Modal */}
      <LeaseAgreementModal
        isOpen={Boolean(agreementTarget)}
        onClose={() => setAgreementTarget(null)}
        agreement={agreementData}
        lease={agreementTarget}
        loading={agreementLoading}
      />

      {/* 7. Landlord-Tenant Rent Dispute & Termination Arbitration Modal */}
      <LandDisputeModal
        isOpen={Boolean(disputeTarget)}
        onClose={() => setDisputeTarget(null)}
        lease={disputeTarget}
        onConfirm={handleConfirmTerminate}
        loading={actionLoading}
      />

      {/* 8. 7/12 Land Record Verification & Fraud Flag Modal */}
      <Audit712Modal
        isOpen={Boolean(audit712Target)}
        onClose={() => setAudit712Target(null)}
        listing={audit712Target}
        onConfirm={handleConfirm712}
        loading={actionLoading}
      />

      {/* 9. Plot & Listing Registration Onboarding Modal */}
      <PlotRegistrationModal
        isOpen={registerPlotOpen}
        onClose={() => setRegisterPlotOpen(false)}
        onConfirm={handleConfirmRegisterPlot}
        loading={actionLoading}
      />
    </div>
  );
}
