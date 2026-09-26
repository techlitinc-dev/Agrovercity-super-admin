import React, { useState, useEffect, useCallback } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { useAuthAdmin } from '../context/AuthAdminContext';
import { useNotification } from '../context/NotificationContext';
import { adminContractsService } from '../services/adminContractsService';
import { fmtRupees, fmtDate } from '../lib/format.js';

import { ContractsMetricBar } from '../components/contracts/ContractsMetricBar';
import { ContractsSearchAndFilterBar } from '../components/contracts/ContractsSearchAndFilterBar';
import { BuyerContractsTable } from '../components/contracts/BuyerContractsTable';
import { AcceptancesTable } from '../components/contracts/AcceptancesTable';
import { InstitutionalBuyersTable } from '../components/contracts/InstitutionalBuyersTable';
import { EscrowLedgerTable } from '../components/contracts/EscrowLedgerTable';
import { DisputesArbitrationTable } from '../components/contracts/DisputesArbitrationTable';
import { ContractsAuditTrailTable } from '../components/contracts/ContractsAuditTrailTable';
import ContractDetailDrawer from '../components/contracts/ContractDetailDrawer';

import { ContractFormModal } from '../components/contracts/ContractFormModal';
import { BuyerOnboardingModal } from '../components/contracts/BuyerOnboardingModal';
import { DisputeArbitrationModal } from '../components/contracts/DisputeArbitrationModal';
import { EscrowReleaseModal } from '../components/contracts/EscrowReleaseModal';
import { ContractStatusModal } from '../components/contracts/ContractStatusModal';

export default function ContractsPage() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'contracts' | 'acceptances' | 'buyers' | 'escrow' | 'disputes' | 'audit_trail'
  const [activeTab, setActiveTab] = useState('contracts');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' });
  const limit = 10;

  // Data states
  const [kpis, setKpis] = useState({});
  const [contracts, setContracts] = useState([]);
  const [acceptances, setAcceptances] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [escrowLedger, setEscrowLedger] = useState([]);
  const [disputedContracts, setDisputedContracts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectContract, setInspectContract] = useState(null);
  const [contractAcceptances, setContractAcceptances] = useState([]);
  const [contractAcceptancesLoading, setContractAcceptancesLoading] = useState(false);

  const [isDraftingContract, setIsDraftingContract] = useState(false);
  const [isOnboardingBuyer, setIsOnboardingBuyer] = useState(false);
  const [arbitrateModalContract, setArbitrateModalContract] = useState(null);
  const [releaseEscrowModalContract, setReleaseEscrowModalContract] = useState(null);
  const [statusModalTarget, setStatusModalTarget] = useState(null); // { contract, targetStatus }
  const [actionLoading, setActionLoading] = useState(false);

  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminContractsService.getContractKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load contract KPIs', e);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, query: searchQuery };

      if (activeTab === 'contracts') {
        const res = await adminContractsService.listContracts({
          ...params,
          status: statusFilter
        });
        if (res.success) {
          setContracts(res.data.contracts);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'acceptances') {
        const res = await adminContractsService.listAcceptances({
          ...params,
          mpinVerified: statusFilter
        });
        if (res.success) {
          setAcceptances(res.data.acceptances);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'buyers') {
        const res = await adminContractsService.listInstitutionalBuyers({
          ...params,
          status: statusFilter
        });
        if (res.success) {
          setBuyers(res.data.buyers);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'escrow') {
        const res = await adminContractsService.listEscrowLedger({
          ...params,
          type: statusFilter
        });
        if (res.success) {
          setEscrowLedger(res.data.escrowLedger);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'disputes') {
        const res = await adminContractsService.listContracts({
          ...params,
          status: statusFilter === 'all' ? 'disputed' : statusFilter
        });
        if (res.success) {
          const list = (res.data.contracts || []).filter(
            (c) => c.flagged || ['disputed', 'breached'].includes(c.status)
          );
          setDisputedContracts(list);
          setPagination({ ...res.data.pagination, total: list.length });
        }
      } else if (activeTab === 'audit_trail') {
        const res = await adminContractsService.listContractsAuditLogs({
          ...params,
          action: statusFilter
        });
        if (res.success) {
          setAuditLogs(res.data.auditLogs);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Fetching Contract Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, statusFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page whenever tab or filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  // Open drawer and load contract's acceptances
  const handleOpenDrawer = async (contract) => {
    setInspectContract(contract);
    setContractAcceptances([]);
    setContractAcceptancesLoading(true);
    try {
      const res = await adminContractsService.listAcceptances({ contractId: contract.id });
      setContractAcceptances(res.data?.acceptances || []);
    } catch {
      setContractAcceptances([]);
    } finally {
      setContractAcceptancesLoading(false);
    }
  };

  // ---- Contract Actions ----
  const handleSaveContract = async (payload) => {
    setActionLoading(true);
    try {
      const res = await adminContractsService.createContract(payload, currentAdmin?.email);
      addToast({
        title: 'Draft Contract Created',
        message: res.message,
        type: 'success'
      });
      setIsDraftingContract(false);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Draft Creation Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOnboardBuyer = async (payload) => {
    setActionLoading(true);
    try {
      const res = await adminContractsService.onboardInstitutionalBuyer(payload, currentAdmin?.email);
      addToast({
        title: 'Corporate Buyer Onboarded',
        message: res.message,
        type: 'success'
      });
      setIsOnboardingBuyer(false);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Buyer Onboarding Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishContract = async (contract) => {
    try {
      const res = await adminContractsService.publishContract(
        contract.id,
        currentAdmin?.email,
        'Superadmin publish approval after corporate escrow verification'
      );
      addToast({
        title: 'Contract Published',
        message: res.message,
        type: 'success'
      });
      if (inspectContract?.id === contract.id) {
        setInspectContract(res.contract);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Publish Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  const handleConfirmStatusChange = async (payload) => {
    setActionLoading(true);
    try {
      const res = await adminContractsService.updateContractStatus({
        ...payload,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Contract Status Updated',
        message: res.message,
        type: 'success'
      });
      setStatusModalTarget(null);
      if (inspectContract?.id === payload.contractId) {
        setInspectContract(res.contract);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Status Transition Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReleaseEscrow = async (payload) => {
    setActionLoading(true);
    try {
      const res = await adminContractsService.releaseEscrow({
        ...payload,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Escrow Funds Released',
        message: res.message,
        type: 'success'
      });
      setReleaseEscrowModalContract(null);
      if (inspectContract?.id === payload.contractId) {
        setInspectContract(res.contract);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Escrow Release Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmArbitration = async (payload) => {
    setActionLoading(true);
    try {
      const res = await adminContractsService.arbitrateDispute({
        ...payload,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Arbitration Ruling Issued',
        message: res.message,
        type: 'success'
      });
      setArbitrateModalContract(null);
      if (inspectContract?.id === payload.contractId) {
        setInspectContract(res.contract);
      }
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

  // ---- Export helpers ----
  const downloadFile = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeRows =
    activeTab === 'contracts' ? contracts :
    activeTab === 'acceptances' ? acceptances :
    activeTab === 'buyers' ? buyers :
    activeTab === 'escrow' ? escrowLedger :
    activeTab === 'disputes' ? disputedContracts :
    auditLogs;

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'contracts') {
      csvContent += 'Contract ID,Corporate Buyer,Farmer Name,Mobile,Crop,Variety,Grade,Quantity (q),Rate (INR/q),MSP Baseline,MSP Premium %,Escrow Total,Escrow Released,Delivery Date,Hub,Status\n';
      contracts.forEach((c) => {
        csvContent += `"${c.id}","${c.buyerName}","${c.farmerName}","${c.farmerPhone}","${c.crop}","${c.variety || 'N/A'}","${c.grade}",${c.quantityQuintals},${c.ratePerQuintal},${c.mspBaseline || 0},${c.premiumOverMspPercent || 0},${c.escrowAmount},${c.escrowReleased || 0},"${c.deliveryDate}","${c.deliveryHub}","${c.status}"\n`;
      });
    } else if (activeTab === 'acceptances') {
      csvContent += 'Acceptance ID,Contract ID,Corporate Buyer,Farmer Name,Mobile,District,Crop,Quantity (q),Committed Total (INR),Rate (INR/q),MPIN Verified,Signed At\n';
      acceptances.forEach((a) => {
        csvContent += `"${a.id}","${a.contractId}","${a.buyerName}","${a.farmerName}","${a.farmerPhone}","${a.farmerDistrict || 'Maharashtra'}","${a.crop}",${a.quantityQuintals},${a.committedAmount},${a.ratePerQuintal},"${a.mpinVerified ? 'YES' : 'NO'}","${a.signedAt}"\n`;
      });
    } else if (activeTab === 'buyers') {
      csvContent += 'Buyer ID,Company Name,Brand,CIN,GSTIN,Nodal Escrow Bank,Authorized Signatory,Email,Mobile,Credit Rating,Active Deals,Committed Escrow,Status\n';
      buyers.forEach((b) => {
        csvContent += `"${b.id}","${b.companyName}","${b.brandName}","${b.cin}","${b.gstin}","${b.nodalEscrowAccount}","${b.authorizedSignatory}","${b.contactEmail}","${b.signatoryMobile}","${b.creditRating}",${b.activeContractsCount},${b.totalEscrowCommitted},"${b.status}"\n`;
      });
    } else if (activeTab === 'escrow') {
      csvContent += 'Escrow Tx ID,Contract ID,Corporate Buyer,Beneficiary Farmer,Type,Amount (INR),Tranche Note,Bank Reference,Dual-Admin Signed,Timestamp\n';
      escrowLedger.forEach((e) => {
        csvContent += `"${e.id}","${e.contractId}","${e.buyerName}","${e.farmerName}","${e.type}",${e.amount},"${e.tranche}","${e.bankReference}","${e.dualAdminSignOff ? 'YES' : 'NO'}","${e.timestamp}"\n`;
      });
    } else if (activeTab === 'disputes') {
      csvContent += 'Contract ID,Corporate Buyer,Farmer Name,Crop,Dispute Reason,Escrow Total,Escrow Remaining,Status,Filing Date\n';
      disputedContracts.forEach((d) => {
        csvContent += `"${d.id}","${d.buyerName}","${d.farmerName}","${d.crop}","${d.disputeReason || 'N/A'}",${d.escrowAmount},${(d.escrowAmount || 0) - (d.escrowReleased || 0)},"${d.status}","${d.disputeFiledAt || d.updatedAt}"\n`;
      });
    } else {
      csvContent += 'Audit ID,Admin UID,Action,Target ID,Target Name,Previous State,New State,Reason,IP Address,Timestamp\n';
      auditLogs.forEach((l) => {
        csvContent += `"${l.id}","${l.adminUid}","${l.action}","${l.targetUserId}","${l.targetUserName}","${l.previousState}","${l.newState}","${l.reason}","${l.ipAddress || '14.139.122.9'}","${l.timestamp}"\n`;
      });
    }

    downloadFile(decodeURI(csvContent), `agrovercity_contracts_${activeTab}_${Date.now()}.csv`, 'text/csv');
    addToast({
      title: 'CSV Export Downloaded',
      message: `Exported ${activeTab} dataset snapshot.`,
      type: 'info'
    });
  };

  const handleExportJson = () => {
    downloadFile(JSON.stringify(activeRows, null, 2), `agrovercity_contracts_${activeTab}_${Date.now()}.json`, 'application/json');
    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON payload for ${activeTab} dataset.`,
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
              <FileText className="w-6 h-6 text-emerald-600" />
              <span>Buyer Contracts, Price Locks & Corporate Escrow</span>
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
              SOP-07
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Pre-sowing price-lock contracts between institutional food processors/exporters and farmers, offering guaranteed MSP premiums, digital MPIN signing, delivery milestones & corporate escrow oversight.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Institutional Escrow Nodal Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <ContractsMetricBar kpis={kpis} loading={loading} />

      {/* 3. Search & Filter Bar */}
      <ContractsSearchAndFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onDraftContract={() => setIsDraftingContract(true)}
        onOnboardBuyer={() => setIsOnboardingBuyer(true)}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        loading={loading}
      />

      {/* 4. Active Tab Data Grid */}
      {activeTab === 'contracts' && (
        <BuyerContractsTable
          contracts={contracts}
          sort={sort}
          onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onView={handleOpenDrawer}
          onPublish={handlePublishContract}
          onReleaseEscrow={(contract) => setReleaseEscrowModalContract(contract)}
          onStatusChange={(contract, status) => setStatusModalTarget({ contract, targetStatus: status })}
          loading={loading}
        />
      )}

      {activeTab === 'acceptances' && (
        <AcceptancesTable
          acceptances={acceptances}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'buyers' && (
        <InstitutionalBuyersTable
          buyers={buyers}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'escrow' && (
        <EscrowLedgerTable
          escrowLedger={escrowLedger}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'disputes' && (
        <DisputesArbitrationTable
          disputedContracts={disputedContracts}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onArbitrate={(c) => setArbitrateModalContract(c)}
          loading={loading}
        />
      )}

      {activeTab === 'audit_trail' && (
        <ContractsAuditTrailTable
          auditLogs={auditLogs}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {/* 5. Contract Detail Slide-Over Drawer */}
      <ContractDetailDrawer
        contract={inspectContract}
        acceptances={contractAcceptances}
        acceptancesLoading={contractAcceptancesLoading}
        onClose={() => setInspectContract(null)}
        onPublish={handlePublishContract}
        onReleaseEscrow={(c) => {
          setInspectContract(null);
          setReleaseEscrowModalContract(c);
        }}
        onArbitrate={(c) => {
          setInspectContract(null);
          setArbitrateModalContract(c);
        }}
        onStatusChange={(c, s) => {
          setInspectContract(null);
          setStatusModalTarget({ contract: c, targetStatus: s });
        }}
      />

      {/* 6. Draft Contract Modal */}
      <ContractFormModal
        isOpen={isDraftingContract}
        onClose={() => setIsDraftingContract(false)}
        onSave={handleSaveContract}
        loading={actionLoading}
      />

      {/* 7. Onboard Corporate Buyer Modal */}
      <BuyerOnboardingModal
        isOpen={isOnboardingBuyer}
        onClose={() => setIsOnboardingBuyer(false)}
        onSave={handleOnboardBuyer}
        loading={actionLoading}
      />

      {/* 8. Dispute Arbitration Modal */}
      <DisputeArbitrationModal
        isOpen={Boolean(arbitrateModalContract)}
        onClose={() => setArbitrateModalContract(null)}
        contract={arbitrateModalContract}
        onConfirm={handleConfirmArbitration}
        loading={actionLoading}
      />

      {/* 9. Escrow Release Modal (with Rule 6.3 Dual-Admin) */}
      <EscrowReleaseModal
        isOpen={Boolean(releaseEscrowModalContract)}
        onClose={() => setReleaseEscrowModalContract(null)}
        contract={releaseEscrowModalContract}
        onConfirm={handleConfirmReleaseEscrow}
        loading={actionLoading}
      />

      {/* 10. Contract Status Transition Modal */}
      <ContractStatusModal
        isOpen={Boolean(statusModalTarget)}
        onClose={() => setStatusModalTarget(null)}
        contract={statusModalTarget?.contract}
        targetStatus={statusModalTarget?.targetStatus}
        onConfirm={handleConfirmStatusChange}
        loading={actionLoading}
      />
    </div>
  );
}
