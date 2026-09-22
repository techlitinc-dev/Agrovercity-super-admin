import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  FileText,
  Truck,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminLotsService } from '../../services/adminLotsService';

import { LotsMetricBar } from './LotsMetricBar';
import { LotsSearchAndFilterBar } from './LotsSearchAndFilterBar';
import { MarketLotsTable } from './MarketLotsTable';
import { B2bDealsTable } from './B2bDealsTable';
import { ProcurementsTable } from './ProcurementsTable';
import { BuyerLedgersTable } from './BuyerLedgersTable';
import { LotDetailDrawer } from './LotDetailDrawer';
import { WeighbridgeVerificationModal } from './WeighbridgeVerificationModal';
import { DisputeMediationModal } from './DisputeMediationModal';
import { SuspendLotModal } from './SuspendLotModal';
import { AdjustCreditModal } from './AdjustCreditModal';

export function ProduceLotsModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'lots' | 'deals' | 'procurements' | 'buyer_ledgers'
  const [activeTab, setActiveTab] = useState('lots');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [commodityFilter, setCommodityFilter] = useState('All Commodities');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data states
  const [kpis, setKpis] = useState({});
  const [lots, setLots] = useState([]);
  const [deals, setDeals] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [buyerLedgers, setBuyerLedgers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selectedLotIds, setSelectedLotIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectLot, setInspectLot] = useState(null);
  const [inspectDeal, setInspectDeal] = useState(null);
  const [weighbridgeModalLot, setWeighbridgeModalLot] = useState(null);
  const [disputeModalData, setDisputeModalData] = useState(null);
  const [suspendModalLot, setSuspendModalLot] = useState(null);
  const [adjustCreditBuyer, setAdjustCreditBuyer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch KPI Summary
  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminLotsService.getLotsKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load KPIs', e);
    }
  }, []);

  // Fetch Main Data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'lots') {
        const res = await adminLotsService.listLots({
          query: searchQuery,
          status: statusFilter,
          commodity: commodityFilter,
          page,
          limit
        });
        if (res.success) {
          setLots(res.data.lots);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'deals') {
        const res = await adminLotsService.listDeals({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setDeals(res.data.deals);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'procurements') {
        const res = await adminLotsService.listProcurements({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setProcurements(res.data.procurements);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'buyer_ledgers') {
        const res = await adminLotsService.listBuyerLedgers({
          query: searchQuery,
          risk: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setBuyerLedgers(res.data.ledgers);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Fetching Produce Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, statusFilter, commodityFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Inspect Lot
  const handleInspectLot = async (lot) => {
    try {
      const res = await adminLotsService.getLotDetails(lot.id);
      setInspectLot(res.data.lot);
      setInspectDeal(res.data.deal);
    } catch (e) {
      setInspectLot(lot);
      setInspectDeal(null);
    }
  };

  // Handle Verify Weighbridge
  const handleSaveWeighbridge = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminLotsService.verifyWeighbridgeSlip({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Weighbridge Attestation Recorded',
        message: res.message,
        type: 'success'
      });
      setWeighbridgeModalLot(null);
      if (inspectLot && inspectLot.id === data.lotId) {
        setInspectLot(res.lot);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Verification Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Mediate Dispute
  const handleConfirmDispute = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminLotsService.mediateDispute({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Binding Arbitration Recorded',
        message: res.message,
        type: 'success'
      });
      setDisputeModalData(null);
      if (inspectLot) setInspectLot(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Mediation Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Suspend Lot
  const handleConfirmSuspend = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminLotsService.suspendLotListing({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Produce Listing Updated',
        message: res.message,
        type: 'info'
      });
      setSuspendModalLot(null);
      if (inspectLot && inspectLot.id === data.lotId) {
        setInspectLot(res.lot);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Action Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Adjust Credit
  const handleSaveCredit = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminLotsService.updateBuyerCreditLimit({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Credit Limit Adjusted',
        message: res.message,
        type: 'success'
      });
      setAdjustCreditBuyer(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Credit Adjustment Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Release Escrow
  const handleReleaseEscrow = async (deal) => {
    try {
      const res = await adminLotsService.mediateDispute({
        dealId: deal.id,
        resolutionType: 'uphold_farmer',
        adminUid: currentAdmin?.email,
        reason: 'Superadmin release of verified weighbridge delivery escrow'
      });
      addToast({
        title: 'Escrow Released to Farmer',
        message: `₹${deal.escrowAmount?.toLocaleString('en-IN')} successfully transferred to ${deal.farmerName}.`,
        type: 'success'
      });
      fetchData();
    } catch (err) {
      addToast({
        title: 'Escrow Release Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'lots') {
      csvContent += 'Lot ID,Farmer Name,Village,District,Commodity,Variety,Quantity (Qtl),Reserve Price (INR),Estimated Value,Grade,Weighbridge Verified,Status\n';
      lots.forEach((l) => {
        csvContent += `"${l.id}","${l.farmerName}","${l.village}","${l.district}","${l.commodity}","${l.variety}",${l.quantityQtl},${l.reservePrice},${l.estimatedTotalValue},"${l.qualityGrade}","${l.weighbridgeSlip?.verified ? 'YES' : 'NO'}","${l.status}"\n`;
      });
    } else if (activeTab === 'deals') {
      csvContent += 'Deal ID,Lot ID,Commodity,Farmer Name,Buyer Firm,Broker,Quantity (Qtl),Agreed Rate (INR/Qtl),Total Deal Value,Escrow Status,Deal Status\n';
      deals.forEach((d) => {
        csvContent += `"${d.id}","${d.lotId}","${d.commodity}","${d.farmerName}","${d.buyerFirm}","${d.brokerName}",${d.quantityQtl},${d.finalAgreedPrice},${d.totalDealValue},"${d.escrowStatus}","${d.status}"\n`;
      });
    } else if (activeTab === 'procurements') {
      csvContent += 'Procurement ID,Deal ID,Lot ID,Trader Firm,Farmer Name,Commodity,Quantity (Qtl),Total Amount,Paid Amount,Pending Amount,Due Date,Status\n';
      procurements.forEach((p) => {
        csvContent += `"${p.id}","${p.dealId}","${p.lotId}","${p.traderFirm}","${p.farmerName}","${p.commodity}",${p.procuredQuantityQtl},${p.totalAmount},${p.paidAmount},${p.pendingAmount},"${p.paymentDueDate}","${p.status}"\n`;
      });
    } else {
      csvContent += 'Ledger ID,Buyer ID,Buyer Firm,Trader Name,APMC License,Credit Rating,Total Purchases,Current Udhaar,Credit Limit,Utilization %,Risk\n';
      buyerLedgers.forEach((b) => {
        csvContent += `"${b.id}","${b.buyerId}","${b.buyerFirm}","${b.buyerName}","${b.apmcLicenseNo}","${b.creditRating}",${b.totalPurchasesVal},${b.currentUdhaarBalance},${b.creditLimit},${b.creditUtilizationPercent}%,"${b.defaultRisk}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrovercity_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'CSV Export Downloaded',
      message: `Exported ${activeTab} dataset snapshot.`,
      type: 'info'
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport =
      activeTab === 'lots' ? lots :
      activeTab === 'deals' ? deals :
      activeTab === 'procurements' ? procurements :
      buyerLedgers;

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrovercity_${activeTab}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON payload for ${dataToExport.length} records.`,
      type: 'info'
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-600" />
              <span>Produce Lots & B2B Trading</span>
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
              SOP-05
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Centralized oversight of farmer produce lots, broker mediation, electronic weighbridge attestation, escrow settlement & trader udhaar ledgers.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>B2B Escrow Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <LotsMetricBar kpis={kpis} loading={loading} />

      {/* 3. Search & Filter Bar */}
      <LotsSearchAndFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        commodityFilter={commodityFilter}
        setCommodityFilter={setCommodityFilter}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        loading={loading}
      />

      {/* 4. Active Tab Data Grid */}
      {activeTab === 'lots' && (
        <MarketLotsTable
          lots={lots}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectLot={handleInspectLot}
          onVerifyWeighbridge={(lot) => setWeighbridgeModalLot(lot)}
          onMediateDispute={(lot) => setDisputeModalData(lot)}
          onSuspendLot={(lot) => setSuspendModalLot(lot)}
          loading={loading}
          selectedIds={selectedLotIds}
          setSelectedIds={setSelectedLotIds}
        />
      )}

      {activeTab === 'deals' && (
        <B2bDealsTable
          deals={deals}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectDeal={(deal) => {
            // Find corresponding lot
            const matchingLot = lots.find((l) => l.id === deal.lotId) || {
              id: deal.lotId,
              commodity: deal.commodity,
              farmerName: deal.farmerName,
              farmerMobile: deal.farmerMobile,
              quantityQtl: deal.quantityQtl,
              reservePrice: deal.finalAgreedPrice,
              status: deal.status,
              qualityGrade: 'Export Standard'
            };
            setInspectLot(matchingLot);
            setInspectDeal(deal);
          }}
          onMediateDispute={(deal) => setDisputeModalData(deal)}
          onReleaseEscrow={handleReleaseEscrow}
          loading={loading}
        />
      )}

      {activeTab === 'procurements' && (
        <ProcurementsTable
          procurements={procurements}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'buyer_ledgers' && (
        <BuyerLedgersTable
          ledgers={buyerLedgers}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onAdjustCredit={(buyer) => setAdjustCreditBuyer(buyer)}
          loading={loading}
        />
      )}

      {/* 5. Detail Slide-Over Drawer */}
      <LotDetailDrawer
        isOpen={Boolean(inspectLot)}
        onClose={() => {
          setInspectLot(null);
          setInspectDeal(null);
        }}
        lot={inspectLot}
        deal={inspectDeal}
        onVerifyWeighbridge={(lot) => setWeighbridgeModalLot(lot)}
        onMediateDispute={(lot) => setDisputeModalData(lot)}
        onSuspendLot={(lot) => setSuspendModalLot(lot)}
      />

      {/* 6. Weighbridge Attestation Modal */}
      <WeighbridgeVerificationModal
        isOpen={Boolean(weighbridgeModalLot)}
        onClose={() => setWeighbridgeModalLot(null)}
        lot={weighbridgeModalLot}
        onSave={handleSaveWeighbridge}
        loading={actionLoading}
      />

      {/* 7. Dispute Mediation & Escrow Arbitration Modal */}
      <DisputeMediationModal
        isOpen={Boolean(disputeModalData)}
        onClose={() => setDisputeModalData(null)}
        disputeData={disputeModalData}
        onConfirmResolution={handleConfirmDispute}
        loading={actionLoading}
      />

      {/* 8. Suspend / Takedown Listing Modal */}
      <SuspendLotModal
        isOpen={Boolean(suspendModalLot)}
        onClose={() => setSuspendModalLot(null)}
        lot={suspendModalLot}
        onConfirm={handleConfirmSuspend}
        loading={actionLoading}
      />

      {/* 9. Adjust Trader Credit Limit Modal */}
      <AdjustCreditModal
        isOpen={Boolean(adjustCreditBuyer)}
        onClose={() => setAdjustCreditBuyer(null)}
        buyer={adjustCreditBuyer}
        onSave={handleSaveCredit}
        loading={actionLoading}
      />
    </div>
  );
}
