import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Download,
  Building2,
  Check,
  Clock,
  Store,
  Calculator,
  Wifi,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminMandiService } from '../../services/adminMandiService';

import { TopMetricBar } from './TopMetricBar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { VyapariRatesTable } from './VyapariRatesTable';
import { MandiBenchmarksTable } from './MandiBenchmarksTable';
import { MandiHistoryAndComparison } from './MandiHistoryAndComparison';
import { AgmarknetGatewayMonitor } from './AgmarknetGatewayMonitor';
import { MandiAuditTrailTable } from './MandiAuditTrailTable';
import { RateReviewDrawer } from './RateReviewDrawer';
import { ManualRateOverrideModal } from './ManualRateOverrideModal';
import { RejectRateModal } from './RejectRateModal';

export function MandiRatesModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'vyapari_rates' (Trader queue) or 'benchmarks' (Agmarknet 8 Mandis)
  const [activeViewTab, setActiveViewTab] = useState('vyapari_rates');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [commodityFilter, setCommodityFilter] = useState('All Commodities');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data states
  const [rates, setRates] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Modals and Drawers
  const [drawerRate, setDrawerRate] = useState(null);
  const [rejectModalRate, setRejectModalRate] = useState(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideBenchmark, setOverrideBenchmark] = useState(null);
  const [overrideLoading, setOverrideLoading] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rateRes, benchRes] = await Promise.all([
        adminMandiService.listVyapariRates({
          query: searchQuery,
          status: statusFilter,
          commodity: commodityFilter,
          page,
          limit
        }),
        adminMandiService.listMandiBenchmarks({
          query: searchQuery,
          commodity: commodityFilter,
          status: activeViewTab === 'benchmarks' ? statusFilter : 'all'
        })
      ]);

      if (rateRes.success) {
        setRates(rateRes.data.rates);
        setPagination(rateRes.data.pagination);
      }
      if (benchRes.success) {
        setBenchmarks(benchRes.data);
      }
    } catch (err) {
      addToast({
        title: 'Failed to Fetch Mandi Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, commodityFilter, page, activeViewTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Approve Rate
  const handleApproveRate = async (rate, customReason) => {
    try {
      const res = await adminMandiService.approveRate({
        id: rate.id,
        adminUid: currentAdmin?.email,
        reason: customReason || 'Rate within sanity corridor; published to mobile feed'
      });
      addToast({
        title: 'Rate Approved & Live',
        message: res.message,
        type: 'success'
      });
      if (drawerRate && drawerRate.id === rate.id) {
        setDrawerRate(null);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Approval Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Handle Batch Approve
  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      let approvedCount = 0;
      for (const id of selectedIds) {
        await adminMandiService.approveRate({
          id,
          adminUid: currentAdmin?.email,
          reason: 'Bulk approved via Superadmin Mandi Console'
        });
        approvedCount++;
      }
      addToast({
        title: 'Batch Approval Complete',
        message: `Successfully approved and published ${approvedCount} trader live rates.`,
        type: 'success'
      });
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Batch Approval Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Handle Reject Rate Trigger
  const handleOpenRejectModal = (rate) => {
    setRejectModalRate(rate);
  };

  // Confirm Rejection
  const handleConfirmReject = async ({ id, reason }) => {
    try {
      const res = await adminMandiService.rejectRate({
        id,
        reason,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Rate Rejected',
        message: res.message,
        type: 'warning'
      });
      setRejectModalRate(null);
      if (drawerRate && drawerRate.id === id) {
        setDrawerRate(null);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Rejection Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Flag Anomaly
  const handleFlagAnomaly = (rate, reason) => {
    addToast({
      title: 'Rate Anomaly Flagged',
      message: `Rate ticket ${rate.id} flagged for APMC price manipulation inquiry: ${reason}`,
      type: 'warning'
    });
    setDrawerRate(null);
  };

  // Trigger Agmarknet Sync
  const handleTriggerSync = async () => {
    setSyncLoading(true);
    try {
      const res = await adminMandiService.triggerAgmarknetSync({
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Agmarknet Sync Completed',
        message: res.message,
        type: 'success'
      });
      fetchData();
    } catch (err) {
      addToast({
        title: 'Agmarknet Sync Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSyncLoading(false);
    }
  };

  // Open Manual Override Modal
  const handleOpenOverride = (benchmark = null) => {
    setOverrideBenchmark(benchmark);
    setIsOverrideModalOpen(true);
  };

  // Save Manual Override
  const handleSaveOverride = async (data) => {
    setOverrideLoading(true);
    try {
      const res = await adminMandiService.overrideMandiBenchmark(data);
      addToast({
        title: 'Mandi Benchmark Overridden',
        message: res.message,
        type: 'success'
      });
      setIsOverrideModalOpen(false);
      setOverrideBenchmark(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Override Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setOverrideLoading(false);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeViewTab === 'vyapari_rates') {
      csvContent += 'Ticket ID,Trader Name,Trading Firm,Mandi,Commodity,Offered Rate (INR/Qtl),Modal Benchmark (INR/Qtl),Deviation %,Net Payout (INR/Qtl),Status,Published Live\n';
      rates.forEach((r) => {
        const netPayout = r.offeredRate - (r.estimatedFreightDeduction || 120) - Math.round(r.offeredRate * 0.005);
        csvContent += `"${r.id}","${r.vyapariName}","${r.tradeFirm}","${r.mandiName}","${r.commodity}",${r.offeredRate},${r.benchmarkModalPrice || 2250},${r.deviationPercent}%,${netPayout},"${r.status}","${r.publishedToApp ? 'YES' : 'NO'}"\n`;
      });
    } else {
      csvContent += 'Mandi ID,Mandi Name,District,State,Commodity,Variety,Modal Price (INR/Qtl),Min Price,Max Price,Arrivals (MT),Sync Status,API Source\n';
      benchmarks.forEach((b) => {
        csvContent += `"${b.id}","${b.mandiName}","${b.district}","${b.state}","${b.commodity}","${b.variety}",${b.modalPrice},${b.minPrice},${b.maxPrice},${b.arrivalTonnage},"${b.syncStatus}","${b.sourceApi}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrovercity_mandi_${activeViewTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Export Generated',
      message: `Downloaded CSV snapshot of ${activeViewTab === 'vyapari_rates' ? rates.length : benchmarks.length} records.`,
      type: 'info'
    });
  };

  // JSON Export
  const handleExportJson = () => {
    const dataToExport = activeViewTab === 'vyapari_rates' ? rates : benchmarks;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrovercity_mandi_${activeViewTab}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON payload for ${dataToExport.length} items.`,
      type: 'info'
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Intro & Module Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span>Mandi Prices & Vyapari Live Rates Approval</span>
            </h1>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
              SOP-04
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            2-hourly trader rate validation corridor (±15% Agmarknet sanity band), net farmer realization calculator & official APMC gateway sync.
          </p>
        </div>

        {/* Global Action Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchApprove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950/60 transition-all active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Selected ({selectedIds.length})</span>
            </button>
          )}

          <div className="text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2-Hr Vyapari Feed Live</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <TopMetricBar
        benchmarks={benchmarks}
        rates={rates}
      />

      {/* 2. SOP-04 Core Collections & Capability Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-1.5 shadow-xs flex flex-wrap items-center gap-1.5">
        {/* Tab 1: Trader Live Rates Queue (Collection: vyapari_rates) */}
        <button
          onClick={() => setActiveViewTab('vyapari_rates')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewTab === 'vyapari_rates'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Trader Rates Queue</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeViewTab === 'vyapari_rates' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            vyapari_rates ({rates.filter((r) => r.status === 'pending').length} pending)
          </span>
        </button>

        {/* Tab 2: Mandi Price Benchmarks (Collection: mandi_prices) */}
        <button
          onClick={() => setActiveViewTab('benchmarks')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewTab === 'benchmarks'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Official APMC Benchmarks</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeViewTab === 'benchmarks' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            mandi_prices ({benchmarks.length} mandis)
          </span>
        </button>

        {/* Tab 3: Price Trends & Net Profit Comparison (Collection: mandi_history) */}
        <button
          onClick={() => setActiveViewTab('trends_comparison')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewTab === 'trends_comparison'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Price Trends & Net Profit</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeViewTab === 'trends_comparison' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            mandi_history (SOP-04 §1)
          </span>
        </button>

        {/* Tab 4: Agmarknet Gateway Health & Alerts */}
        <button
          onClick={() => setActiveViewTab('api_health')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewTab === 'api_health'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>Gateway Health & Alerts</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeViewTab === 'api_health' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            eNAM / MSAMB
          </span>
        </button>

        {/* Tab 5: Statutory Decision Audit Trail (Collection: audit_logs) */}
        <button
          onClick={() => setActiveViewTab('audit_trail')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewTab === 'audit_trail'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Decision Audit Trail</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeViewTab === 'audit_trail' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            audit_logs
          </span>
        </button>
      </div>

      {/* 3. Active Grid or Capability Content */}
      {(activeViewTab === 'vyapari_rates' || activeViewTab === 'benchmarks') && (
        <>
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            commodityFilter={commodityFilter}
            setCommodityFilter={setCommodityFilter}
            activeViewTab={activeViewTab}
            setActiveViewTab={setActiveViewTab}
            onRefresh={fetchData}
            onTriggerSync={handleTriggerSync}
            onOpenManualOverride={() => handleOpenOverride(null)}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            loading={loading || syncLoading}
          />

          {activeViewTab === 'vyapari_rates' ? (
            <VyapariRatesTable
              rates={rates}
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
              onInspectRate={(rate) => setDrawerRate(rate)}
              onApproveRate={(rate) => handleApproveRate(rate)}
              onRejectRate={(rate) => handleOpenRejectModal(rate)}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          ) : (
            <MandiBenchmarksTable
              benchmarks={benchmarks}
              onOpenOverride={(b) => handleOpenOverride(b)}
              loading={loading}
            />
          )}
        </>
      )}

      {activeViewTab === 'trends_comparison' && (
        <MandiHistoryAndComparison />
      )}

      {activeViewTab === 'api_health' && (
        <AgmarknetGatewayMonitor onOpenManualOverride={() => handleOpenOverride(null)} />
      )}

      {activeViewTab === 'audit_trail' && (
        <MandiAuditTrailTable />
      )}

      {/* 5. Detailed Rate Review Drawer with Sanity Corridor & Net Realization */}
      <RateReviewDrawer
        isOpen={Boolean(drawerRate)}
        onClose={() => setDrawerRate(null)}
        rate={drawerRate}
        onApprove={handleApproveRate}
        onReject={handleOpenRejectModal}
        onFlag={handleFlagAnomaly}
      />

      {/* 6. Reject Rate Modal */}
      <RejectRateModal
        isOpen={Boolean(rejectModalRate)}
        onClose={() => setRejectModalRate(null)}
        rate={rejectModalRate}
        onConfirmReject={handleConfirmReject}
      />

      {/* 7. Manual Rate Override Modal */}
      <ManualRateOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => {
          setIsOverrideModalOpen(false);
          setOverrideBenchmark(null);
        }}
        benchmark={overrideBenchmark}
        benchmarksList={benchmarks}
        onSave={handleSaveOverride}
        loading={overrideLoading}
      />
    </div>
  );
}
