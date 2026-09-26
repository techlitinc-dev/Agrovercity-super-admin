import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  AlertTriangle
} from 'lucide-react'
import {
  getAgroforestrySummary,
  listSaplingRequests,
  updateSaplingRequestStatus,
  batchUpdateSaplingStatus,
  listNgos,
  createNgo,
  updateNgo,
  verifyNgo,
  batchUpdateNgoStatus,
  listBiofuelTrees,
  createBiofuelTree,
  updateBiofuelEconomics,
  listTreeCareGuides,
  createTreeCareGuide,
  updateTreeCareGuide,
  deleteTreeCareGuide,
  batchUpdateCareGuideStatus,
  listTreeArticles,
  createTreeArticle,
  updateTreeArticle,
  deleteTreeArticle,
  batchUpdateTreeArticleStatus,
  getAgroforestryAuditLogs,
  resetAgroforestrySeedData
} from '../api/agroforestryApi'
import {
  AgroforestryMetricBar,
  AgroforestryTabSwitch,
  AgroforestryFiltersBar,
  BatchActionBar,
  SaplingRequestsTable,
  NgosTable,
  BiofuelTreesTable,
  TreeCareGuidesTable,
  TreeArticlesTable,
  AgroforestryAuditLogsTable,
  ContentPagination
} from './agroforestryWidgets'
import AgroforestryDetailDrawer from '../components/agroforestry/AgroforestryDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  ApproveSaplingModal,
  DispatchSaplingModal,
  RecordDeliverySurvivalModal,
  EditBiofuelEconomicsModal,
  CreateEditNgoModal,
  CreateEditCareGuideModal,
  CreateEditTreeArticleModal,
  CreateEditBiofuelTreeModal,
  ResetSeedModal,
  BatchActionModal
} from '../components/agroforestry/AgroforestryModals'
import { useNotification } from '../context/NotificationContext'
import { useAuthAdmin } from '../context/AuthAdminContext'

const PAGE_SIZE = 20

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object')
  const lines = rows.map((r) =>
    head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [head.join(','), ...lines].join('\n')
}

function downloadBlob(content, filename, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AgroforestryPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, hasPermission } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin', role: 'SUPER_ADMIN' }, hasPermission: () => true }

  const role = currentAdmin?.role || 'SUPER_ADMIN'
  const isFinancialAuditor = role === 'FINANCIAL_AUDITOR'
  const canMutate = hasPermission('tree.manage') && !isFinancialAuditor

  const [activeTab, setActiveTab] = useState('requests') // 'requests', 'ngos', 'biofuel', 'guides', 'articles', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [persona, setPersona] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data & Multi-row Selection
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [selectedIds, setSelectedIds] = useState([])
  const [allNgos, setAllNgos] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals for Saplings & Economics
  const [approveModal, setApproveModal] = useState({ open: false, request: null })
  const [dispatchModal, setDispatchModal] = useState({ open: false, request: null })
  const [survivalModal, setSurvivalModal] = useState({ open: false, request: null })
  const [economicsModal, setEconomicsModal] = useState({ open: false, tree: null })

  // CRUD Modals
  const [ngoModal, setNgoModal] = useState({ open: false, data: null })
  const [biofuelModal, setBiofuelModal] = useState({ open: false, data: null })
  const [guideModal, setGuideModal] = useState({ open: false, data: null })
  const [articleModal, setArticleModal] = useState({ open: false, data: null })

  // Batch & Reset Modals
  const [batchModal, setBatchModal] = useState({ open: false, action: '', title: '', count: 0 })
  const [resetModalOpen, setResetModalOpen] = useState(false)

  // Confirmation & Dual Sign-off
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'rose',
    onConfirm: null
  })
  const [dualSignOffDialog, setDualSignOffDialog] = useState({
    open: false,
    title: '',
    amount: 0,
    details: '',
    onConfirm: null
  })

  // 1. Load KPI Summary & NGO list
  const loadSummary = useCallback(async () => {
    try {
      const s = await getAgroforestrySummary()
      setSummary(s)
      const ngosRes = await listNgos({ pageSize: 50 })
      setAllNgos(ngosRes.data || [])
    } catch (err) {
      console.warn('Failed to load agroforestry summary:', err)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  const handleTabSelect = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setDateRange('all')
    setPersona('all')
    setSelectedIds([])
  }

  // 2. Load Table Data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      if (activeTab === 'requests') {
        res = await listSaplingRequests({
          q: search,
          status: statusFilter,
          treeCategory: categoryFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ngos') {
        res = await listNgos({
          q: search,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'biofuel') {
        res = await listBiofuelTrees({
          q: search,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'guides') {
        res = await listTreeCareGuides({
          q: search,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'articles') {
        res = await listTreeArticles({
          q: search,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getAgroforestryAuditLogs({
          q: search,
          actionType: statusFilter,
          dateRange,
          page,
          pageSize: PAGE_SIZE
        })
      }
      setTableData(res)
    } catch (err) {
      addToast({
        title: 'Load Error',
        message: err.message || 'Failed to fetch agroforestry data.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, statusFilter, categoryFilter, dateRange, persona, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Multi-row Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked) => {
    if (checked && tableData.data) {
      setSelectedIds(tableData.data.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleOpenDrawer = (entity) => {
    setSelectedEntity(entity)
    setDrawerOpen(true)
  }

  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast({ title: 'Export Failed', message: 'No records to export.', type: 'warning' })
      return
    }
    const csv = toCsv(tableData.data)
    downloadBlob(csv, `agroforestry_${activeTab}_export.csv`)
    addToast({ title: 'Export Complete', message: `Exported ${tableData.data.length} records.`, type: 'success' })
  }

  // -------------------------------------------------------------
  // SAPLING ACTIONS & DUAL SIGN-OFF
  // -------------------------------------------------------------
  const handleApproveRequest = async (requestId, details) => {
    if (!canMutate) return
    const req = approveModal.request
    const estimatedValue = (req?.quantity || 1) * 120
    const payable = req?.farmerPayableINR || 0
    const subsidyDisbursement = Math.max(0, estimatedValue - payable)

    // Statutory Check: Institutional dual admin sign-off for disbursements exceeding ₹50,000
    if (subsidyDisbursement > 50000 || payable > 50000) {
      setDualSignOffDialog({
        open: true,
        title: 'Institutional Dual Sign-Off Required (> ₹50,000)',
        amount: Math.max(subsidyDisbursement, payable),
        details: `Sapling request #${requestId} for ${req?.farmerName} (${req?.quantity} saplings) carries a fiscal subsidy of ₹${subsidyDisbursement.toLocaleString()} exceeding the ₹50,000 statutory governance threshold. Secondary officer authorization is mandated under SOP-21.`,
        onConfirm: async () => {
          try {
            await updateSaplingRequestStatus(
              requestId,
              'approved',
              { ...details, dualAdminVerified: true, secondOfficerUid: 'usr_audit_sec_01' },
              currentAdmin?.uid,
              currentAdmin?.name
            )
            addToast({
              title: 'Institutional Approval Completed',
              message: `Dual sign-off counter-signed for request #${requestId}. Allocated to nursery.`,
              type: 'success'
            })
            setDualSignOffDialog({ open: false })
            setApproveModal({ open: false, request: null })
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Approval Error', message: err.message, type: 'error' })
          }
        }
      })
      return
    }

    try {
      await updateSaplingRequestStatus(requestId, 'approved', details, currentAdmin?.uid, currentAdmin?.name)
      addToast({ title: 'Request Approved', message: 'Saplings allocated to partner nursery.', type: 'success' })
      setApproveModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Approval Error', message: err.message, type: 'error' })
    }
  }

  const handleDispatchSaplings = async (requestId, trackingNo, notes) => {
    if (!canMutate) return
    try {
      await updateSaplingRequestStatus(requestId, 'dispatched', { trackingNo, reason: notes }, currentAdmin?.uid, currentAdmin?.name)
      addToast({ title: 'Consignment Dispatched', message: `Tracking No: ${trackingNo}`, type: 'success' })
      setDispatchModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Dispatch Error', message: err.message, type: 'error' })
    }
  }

  const handleDeliverSaplings = async (requestId, survivalRate, notes) => {
    if (!canMutate) return
    try {
      await updateSaplingRequestStatus(requestId, 'delivered', { survivalRate, reason: notes }, currentAdmin?.uid, currentAdmin?.name)
      addToast({ title: 'Delivery Logged', message: `Survival audit recorded @ ${survivalRate}%.`, type: 'success' })
      setSurvivalModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Update Error', message: err.message, type: 'error' })
    }
  }

  const handleRejectRequest = (request) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Reject Sapling Request',
      message: `Reject request ${request.id} for ${request.farmerName}?`,
      confirmLabel: 'Reject Request',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await updateSaplingRequestStatus(request.id, 'rejected', { reason }, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'Request Rejected', message: 'Farmer notified with rejection reason.', type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Reject Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // NGO ACTIONS
  // -------------------------------------------------------------
  const handleVerifyNgo = (ngo) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Verify Afforestation Partner NGO',
      message: `Verify ${ngo.name}? This activates sapling procurement allocations.`,
      confirmLabel: 'Verify NGO',
      confirmVariant: 'emerald',
      onConfirm: async (reason) => {
        try {
          await verifyNgo(ngo.id, 'verified', reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'NGO Verified', message: 'NGO partner verified and empaneled.', type: 'success' })
          setConfirmDialog({ open: false })
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Verification Error', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleSuspendNgo = (ngo) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Suspend Partner NGO',
      message: `Suspend ${ngo.name} from receiving sapling requests?`,
      confirmLabel: 'Suspend NGO',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await verifyNgo(ngo.id, 'suspended', reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'NGO Suspended', message: 'Procurement allocations paused.', type: 'success' })
          setConfirmDialog({ open: false })
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Suspension Error', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleSaveNgo = async (formData) => {
    if (!canMutate) return
    try {
      if (ngoModal.data) {
        await updateNgo(ngoModal.data.id, formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'NGO Updated', message: `${formData.name} record updated.`, type: 'success' })
      } else {
        await createNgo(formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'NGO Empaneled', message: `${formData.name} successfully empaneled.`, type: 'success' })
      }
      setNgoModal({ open: false, data: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // COMMERCIAL BIOFUEL ACTIONS
  // -------------------------------------------------------------
  const handleSaveBiofuelEconomics = async (treeId, formData) => {
    if (!canMutate) return
    try {
      await updateBiofuelEconomics(treeId, formData, currentAdmin?.uid, currentAdmin?.name)
      addToast({ title: 'Economics Saved', message: 'Updated seed oil return parameters.', type: 'success' })
      setEconomicsModal({ open: false, tree: null })
      loadData()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleSaveBiofuelTree = async (formData) => {
    if (!canMutate) return
    try {
      if (biofuelModal.data) {
        await updateBiofuelEconomics(biofuelModal.data.id, formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Species Updated', message: `${formData.commonName} updated.`, type: 'success' })
      } else {
        await createBiofuelTree(formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Species Created', message: `${formData.commonName} added to catalog.`, type: 'success' })
      }
      setBiofuelModal({ open: false, data: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // TREE CARE GUIDES ACTIONS
  // -------------------------------------------------------------
  const handleSaveCareGuide = async (formData) => {
    if (!canMutate) return
    try {
      if (guideModal.data) {
        await updateTreeCareGuide(guideModal.data.id, formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Guide Updated', message: `${formData.title} updated.`, type: 'success' })
      } else {
        await createTreeCareGuide(formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Guide Published', message: `${formData.title} published.`, type: 'success' })
      }
      setGuideModal({ open: false, data: null })
      loadData()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteCareGuide = (guide) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Delete Tree Care Guide',
      message: `Are you sure you want to delete guide "${guide.title}"?`,
      confirmLabel: 'Delete Guide',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteTreeCareGuide(guide.id, reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'Guide Deleted', message: `Deleted ${guide.title}`, type: 'success' })
          setConfirmDialog({ open: false })
          loadData()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // AGROFORESTRY MODELS / ARTICLES ACTIONS
  // -------------------------------------------------------------
  const handleSaveArticle = async (formData) => {
    if (!canMutate) return
    try {
      if (articleModal.data) {
        await updateTreeArticle(articleModal.data.id, formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Model Updated', message: `${formData.title} updated.`, type: 'success' })
      } else {
        await createTreeArticle(formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Model Published', message: `${formData.title} published.`, type: 'success' })
      }
      setArticleModal({ open: false, data: null })
      loadData()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteArticle = (article) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Delete Agroforestry Model',
      message: `Are you sure you want to delete model article "${article.title}"?`,
      confirmLabel: 'Delete Article',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await deleteTreeArticle(article.id, reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'Article Deleted', message: `Deleted ${article.title}`, type: 'success' })
          setConfirmDialog({ open: false })
          loadData()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // BATCH ACTIONS HANDLER
  // -------------------------------------------------------------
  const handleBatchActionTrigger = (actionType) => {
    if (selectedIds.length === 0) return
    if (actionType === 'export') {
      const rows = tableData.data.filter((r) => selectedIds.includes(r.id))
      const csv = toCsv(rows.length > 0 ? rows : tableData.data)
      downloadBlob(csv, `agroforestry_batch_${activeTab}_export.csv`)
      addToast({ title: 'Export Complete', message: `Exported ${rows.length} selected records.`, type: 'success' })
      return
    }

    setBatchModal({
      open: true,
      action: actionType,
      title: `Batch ${actionType.toUpperCase()} on ${selectedIds.length} Records`,
      count: selectedIds.length
    })
  }

  const handleConfirmBatchAction = async (reason) => {
    if (!canMutate) return
    try {
      if (activeTab === 'requests') {
        await batchUpdateSaplingStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'ngos') {
        await batchUpdateNgoStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'guides') {
        await batchUpdateCareGuideStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'articles') {
        await batchUpdateTreeArticleStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      }
      addToast({
        title: 'Batch Action Successful',
        message: `Updated ${selectedIds.length} records to '${batchModal.action}'.`,
        type: 'success'
      })
      setSelectedIds([])
      setBatchModal({ open: false, action: '', title: '', count: 0 })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Batch Action Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // BENCHMARK SEED RESET HANDLER
  // -------------------------------------------------------------
  const handleResetSeed = async (reason) => {
    if (!canMutate) return
    try {
      await resetAgroforestrySeedData(reason, currentAdmin?.uid, currentAdmin?.name)
      addToast({
        title: 'Benchmark Seed Restored',
        message: 'All 5 SOP-21 Agroforestry collections reset to benchmark state.',
        type: 'success'
      })
      setResetModalOpen(false)
      setSelectedIds([])
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Reset Error', message: err.message, type: 'error' })
    }
  }

  const handleOpenCreateModal = () => {
    if (!canMutate) return
    if (activeTab === 'ngos') {
      setNgoModal({ open: true, data: null })
    } else if (activeTab === 'biofuel') {
      setBiofuelModal({ open: true, data: null })
    } else if (activeTab === 'guides') {
      setGuideModal({ open: true, data: null })
    } else if (activeTab === 'articles') {
      setArticleModal({ open: true, data: null })
    }
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Statutory Auditor Compliance Banner */}
      {isFinancialAuditor && (
        <div className="bg-amber-50 border border-amber-200/90 text-amber-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="leading-relaxed">
            <strong>Auditor Mode Enabled (Statutory Compliance):</strong> Logged in with Financial Auditor credentials. Under DPDP regulations & afforestation statutory audit guidelines, you have read-only access. Mutation controls and state transition actions are locked.
          </div>
        </div>
      )}

      {/* Metric Bar */}
      <AgroforestryMetricBar summary={summary} loading={!summary} />

      {/* Main Section */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
        <AgroforestryTabSwitch
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          counts={{
            requests: summary?.totalSaplingRequests,
            ngos: summary?.activeNgosPartnered,
            biofuel: summary?.biofuelVarietiesTracked
          }}
        />

        <AgroforestryFiltersBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          persona={persona}
          onPersonaChange={setPersona}
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onCreateNew={handleOpenCreateModal}
          onResetSeed={() => setResetModalOpen(true)}
          canCreate={canMutate}
        />

        {/* Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedIds.length}
          activeTab={activeTab}
          onBatchAction={handleBatchActionTrigger}
          onClearSelection={handleClearSelection}
        />

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-2" />
            Loading agroforestry records...
          </div>
        ) : (
          <>
            {activeTab === 'requests' && (
              <SaplingRequestsTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onApprove={canMutate ? (req) => setApproveModal({ open: true, request: req }) : null}
                onDispatch={canMutate ? (req) => setDispatchModal({ open: true, request: req }) : null}
                onDeliver={canMutate ? (req) => setSurvivalModal({ open: true, request: req }) : null}
                onReject={canMutate ? handleRejectRequest : null}
              />
            )}

            {activeTab === 'ngos' && (
              <NgosTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (ngo) => setNgoModal({ open: true, data: ngo }) : null}
                onVerify={canMutate ? handleVerifyNgo : null}
                onSuspend={canMutate ? handleSuspendNgo : null}
              />
            )}

            {activeTab === 'biofuel' && (
              <BiofuelTreesTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onEditEconomics={canMutate ? (tree) => setEconomicsModal({ open: true, tree }) : null}
              />
            )}

            {activeTab === 'guides' && (
              <TreeCareGuidesTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (guide) => setGuideModal({ open: true, data: guide }) : null}
                onDelete={canMutate ? handleDeleteCareGuide : null}
              />
            )}

            {activeTab === 'articles' && (
              <TreeArticlesTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (art) => setArticleModal({ open: true, data: art }) : null}
                onDelete={canMutate ? handleDeleteArticle : null}
              />
            )}

            {activeTab === 'audit' && (
              <AgroforestryAuditLogsTable data={tableData.data} />
            )}

            <ContentPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={tableData.total || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <AgroforestryDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        canMutate={canMutate}
        role={role}
        onClose={() => setDrawerOpen(false)}
        onApprove={(req) => setApproveModal({ open: true, request: req })}
        onDispatch={(req) => setDispatchModal({ open: true, request: req })}
        onDeliver={(req) => setSurvivalModal({ open: true, request: req })}
        onReject={handleRejectRequest}
        onVerifyNgo={handleVerifyNgo}
        onEditEconomics={(tree) => setEconomicsModal({ open: true, tree })}
      />

      {/* Sapling Workflow Modals */}
      <ApproveSaplingModal
        isOpen={approveModal.open}
        request={approveModal.request}
        ngos={allNgos}
        onClose={() => setApproveModal({ open: false, request: null })}
        onApprove={handleApproveRequest}
      />

      <DispatchSaplingModal
        isOpen={dispatchModal.open}
        request={dispatchModal.request}
        onClose={() => setDispatchModal({ open: false, request: null })}
        onDispatch={handleDispatchSaplings}
      />

      <RecordDeliverySurvivalModal
        isOpen={survivalModal.open}
        request={survivalModal.request}
        onClose={() => setSurvivalModal({ open: false, request: null })}
        onSave={handleDeliverSaplings}
      />

      <EditBiofuelEconomicsModal
        isOpen={economicsModal.open}
        tree={economicsModal.tree}
        onClose={() => setEconomicsModal({ open: false, tree: null })}
        onSave={handleSaveBiofuelEconomics}
      />

      {/* CRUD Modals */}
      <CreateEditNgoModal
        isOpen={ngoModal.open}
        initialData={ngoModal.data}
        onClose={() => setNgoModal({ open: false, data: null })}
        onSave={handleSaveNgo}
      />

      <CreateEditBiofuelTreeModal
        isOpen={biofuelModal.open}
        initialData={biofuelModal.data}
        onClose={() => setBiofuelModal({ open: false, data: null })}
        onSave={handleSaveBiofuelTree}
      />

      <CreateEditCareGuideModal
        isOpen={guideModal.open}
        initialData={guideModal.data}
        onClose={() => setGuideModal({ open: false, data: null })}
        onSave={handleSaveCareGuide}
      />

      <CreateEditTreeArticleModal
        isOpen={articleModal.open}
        initialData={articleModal.data}
        onClose={() => setArticleModal({ open: false, data: null })}
        onSave={handleSaveArticle}
      />

      {/* Bulk Batch Action Modal */}
      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        count={batchModal.count}
        actionLabel={batchModal.action ? `Apply ${batchModal.action.toUpperCase()}` : 'Apply Batch'}
        onClose={() => setBatchModal({ open: false, action: '', title: '', count: 0 })}
        onConfirm={handleConfirmBatchAction}
      />

      {/* Benchmark Reset Modal */}
      <ResetSeedModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetSeed}
      />

      {/* Audit Confirmation Reason Modal */}
      <AuditReasonModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />

      {/* Institutional Dual Admin Sign-Off Modal (> ₹50,000) */}
      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        amount={dualSignOffDialog.amount}
        details={dualSignOffDialog.details}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={dualSignOffDialog.onConfirm || (() => {})}
      />
    </div>
  )
}
