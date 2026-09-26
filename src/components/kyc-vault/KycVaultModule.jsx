import React, { useState, useEffect, useCallback } from 'react';
import { TopMetricBar } from './TopMetricBar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { KycTable } from './KycTable';
import { SideBySideReviewModal } from './SideBySideReviewModal';
import { RejectConfirmationModal } from './RejectConfirmationModal';
import { KycDetailDrawer } from './KycDetailDrawer';
import { EncryptedVaultTable } from './EncryptedVaultTable';
import { KycAuditTrailTable } from './KycAuditTrailTable';
import { adminKycService } from '../../services/adminKycService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { FileCheck, Lock, History } from 'lucide-react';

export function KycVaultModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active collection tab: 'queue' | 'vault' | 'audit'
  const [activeTab, setActiveTab] = useState('queue');

  // Data & loading states
  const [items, setItems] = useState([]);
  const [allItemsForKpis, setAllItemsForKpis] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Active modals and drawer state
  const [selectedItemForSideBySide, setSelectedItemForSideBySide] = useState(null);
  const [isSideBySideOpen, setIsSideBySideOpen] = useState(false);

  const [selectedItemForReject, setSelectedItemForReject] = useState(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [selectedItemForDrawer, setSelectedItemForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch KYC items
  const fetchKycItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminKycService.listVerifications({
        query: searchQuery,
        status: statusFilter,
        docType: docTypeFilter,
        persona: personaFilter,
        dateRange: dateFilter,
        page,
        limit: 10
      });

      if (res.success) {
        setItems(res.data.items);
        setPagination(res.data.pagination);
      }

      // Fetch all unfiltered items to calculate accurate KPI metrics across the vault
      const allRes = await adminKycService.listVerifications({
        query: '',
        status: 'all',
        docType: 'all',
        persona: 'all',
        dateRange: 'all',
        page: 1,
        limit: 1000
      });
      if (allRes.success) {
        setAllItemsForKpis(allRes.data.items);
      }
    } catch (err) {
      addToast({
        title: 'Query Error',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, docTypeFilter, personaFilter, dateFilter, page, addToast]);

  useEffect(() => {
    fetchKycItems();
  }, [fetchKycItems]);

  // Keep open item synced if updated
  useEffect(() => {
    if (selectedItemForSideBySide && items.length > 0) {
      const refreshed = items.find((i) => i.id === selectedItemForSideBySide.id);
      if (refreshed) setSelectedItemForSideBySide(refreshed);
    }
    if (selectedItemForDrawer && items.length > 0) {
      const refreshed = items.find((i) => i.id === selectedItemForDrawer.id);
      if (refreshed) setSelectedItemForDrawer(refreshed);
    }
  }, [items]);

  // Update item locally without full re-fetch
  const handleItemUpdated = (updatedItem) => {
    setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    setAllItemsForKpis((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)));
    if (selectedItemForSideBySide?.id === updatedItem.id) setSelectedItemForSideBySide(updatedItem);
    if (selectedItemForDrawer?.id === updatedItem.id) setSelectedItemForDrawer(updatedItem);
  };

  // 1. Approve handler
  const handleApprove = async (item, reason) => {
    try {
      const res = await adminKycService.approveKyc({
        id: item.id,
        adminUid: currentAdmin.email,
        reason: reason || 'Document verified by Superadmin per government guidelines'
      });

      addToast({
        title: 'KYC Document Approved',
        message: res.message,
        type: 'success'
      });

      handleItemUpdated(res.item);
      setIsSideBySideOpen(false);
    } catch (err) {
      addToast({ title: 'Approval Failed', message: err.message, type: 'error' });
    }
  };

  // 2. Reject trigger
  const handleOpenReject = (item) => {
    setSelectedItemForReject(item);
    setIsRejectOpen(true);
  };

  const handleConfirmReject = async ({ id, reason }) => {
    try {
      const res = await adminKycService.rejectKyc({
        id,
        reason,
        adminUid: currentAdmin.email
      });

      addToast({
        title: 'KYC Document Rejected',
        message: res.message,
        type: 'info'
      });

      handleItemUpdated(res.item);
      setIsSideBySideOpen(false);
    } catch (err) {
      addToast({ title: 'Rejection Failed', message: err.message, type: 'error' });
    }
  };

  // 3. Flag handler
  const handleFlag = async (item, reason) => {
    try {
      const res = await adminKycService.flagKyc({
        id: item.id,
        reason,
        adminUid: currentAdmin.email
      });

      addToast({
        title: 'KYC Anomaly Flagged',
        message: res.message,
        type: 'warning'
      });

      handleItemUpdated(res.item);
    } catch (err) {
      addToast({ title: 'Flag Failed', message: err.message, type: 'error' });
    }
  };

  // Side-by-side modal trigger
  const handleInspect = (item) => {
    setSelectedItemForSideBySide(item);
    setIsSideBySideOpen(true);
  };

  // Drawer trigger
  const handleOpenDrawer = (item) => {
    setSelectedItemForDrawer(item);
    setIsDrawerOpen(true);
  };

  // CSV Export with DPDP Masking compliance
  const handleExportCsv = () => {
    try {
      const headers = [
        'KYC Ticket ID',
        'Document ID',
        'User Name',
        'Mobile',
        'Persona',
        'City',
        'Document Type',
        'Document Name',
        'OCR Match Confidence',
        'DPDP Redaction Status',
        'Verification Status',
        'Reviewed By',
        'Rejection Reason',
        'Submitted At'
      ];

      const rows = items.map((i) => [
        i.id,
        i.docId,
        `"${i.userName}"`,
        i.userMobile,
        i.userPersona,
        `"${i.userCity}"`,
        i.docType,
        `"${i.docName}"`,
        `${i.ocrConfidenceScore}%`,
        i.dpdpComplianceStatus,
        i.status,
        i.reviewedBy || 'Pending',
        `"${i.rejectionReason || 'None'}"`,
        i.submittedAt
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `agrovercity_kyc_vault_roster_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'CSV Roster Exported',
        message: `Exported ${items.length} records with DPDP masking compliance.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  // JSON Export
  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `agrovercity_kyc_vault_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'JSON Export Complete',
        message: 'Full enveloped KYC verification & document vault schema exported.',
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Top Metric Bar */}
      <TopMetricBar items={allItemsForKpis.length > 0 ? allItemsForKpis : items} />

      {/* 2. SOP-03 Core Collections Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-1.5 shadow-sm flex flex-wrap items-center gap-1.5">
        {/* Tab 1: KYC Verification Queue (Collection: kyc_verifications) */}
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>KYC Verification Queue</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'queue' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            kyc_verifications ({items.filter((i) => i.status === 'pending').length} pending)
          </span>
        </button>

        {/* Tab 2: Encrypted Document Vault (Collection: users/{uid}/vault_documents) */}
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'vault'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Encrypted Document Vault</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'vault' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            vault_documents (AES-256)
          </span>
        </button>

        {/* Tab 3: Verification Decision Audit Trail (Endpoint: /v1/admin/kyc/history) */}
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Decision Audit Trail</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'audit' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            /v1/admin/kyc/history (§5)
          </span>
        </button>
      </div>

      {/* 3. Conditional Collection Table Rendering */}
      {activeTab === 'queue' && (
        <>
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            statusFilter={statusFilter}
            setStatusFilter={(s) => {
              setStatusFilter(s);
              setPage(1);
            }}
            docTypeFilter={docTypeFilter}
            setDocTypeFilter={(dt) => {
              setDocTypeFilter(dt);
              setPage(1);
            }}
            personaFilter={personaFilter}
            setPersonaFilter={(p) => {
              setPersonaFilter(p);
              setPage(1);
            }}
            dateFilter={dateFilter}
            setDateFilter={(d) => {
              setDateFilter(d);
              setPage(1);
            }}
            onRefresh={fetchKycItems}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            loading={loading}
          />

          <KycTable
            items={items}
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onInspectItem={handleInspect}
            onApproveItem={(item) => handleApprove(item, 'Quick verification by Superadmin')}
            onRejectItem={handleOpenReject}
            loading={loading}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </>
      )}

      {activeTab === 'vault' && (
        <EncryptedVaultTable onOpenDetailDrawer={handleOpenDrawer} />
      )}

      {activeTab === 'audit' && (
        <KycAuditTrailTable />
      )}

      {/* 4. Side-by-Side Review Modal with Zoom & Rotation */}
      <SideBySideReviewModal
        isOpen={isSideBySideOpen}
        onClose={() => setIsSideBySideOpen(false)}
        item={selectedItemForSideBySide}
        onApprove={handleApprove}
        onReject={handleOpenReject}
        onFlag={handleFlag}
      />

      {/* 5. Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        item={selectedItemForReject}
        onConfirm={handleConfirmReject}
      />

      {/* 6. Quick Detail Drawer */}
      <KycDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItemForDrawer}
        onOpenSideBySide={handleInspect}
        onApprove={(item) => handleApprove(item, 'Approved via drawer inspection')}
        onReject={handleOpenReject}
      />
    </div>
  );
}
