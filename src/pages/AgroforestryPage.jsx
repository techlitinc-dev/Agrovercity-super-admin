import React, { useState, useEffect, useCallback } from 'react'
import {
  getAgroforestrySummary,
  listSaplingRequests,
  updateSaplingRequestStatus,
  listNgos,
  verifyNgo,
  listBiofuelTrees,
  updateBiofuelEconomics,
  listTreeCareGuides,
  listTreeArticles,
  getAgroforestryAuditLogs
} from '../api/agroforestryApi'
import {
  AgroforestryMetricBar,
  AgroforestryTabSwitch,
  AgroforestryFiltersBar,
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
  EditBiofuelEconomicsModal
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
  const { currentAdmin, hasPermission } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' }, hasPermission: () => true }

  const [activeTab, setActiveTab] = useState('requests') // 'requests', 'ngos', 'biofuel', 'guides', 'articles', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [allNgos, setAllNgos] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [approveModal, setApproveModal] = useState({ open: false, request: null })
  const [dispatchModal, setDispatchModal] = useState({ open: false, request: null })
  const [survivalModal, setSurvivalModal] = useState({ open: false, request: null })
  const [economicsModal, setEconomicsModal] = useState({ open: false, tree: null })

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
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ngos') {
        res = await listNgos({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'biofuel') {
        res = await listBiofuelTrees({
          q: search,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'guides') {
        res = await listTreeCareGuides({
          q: search,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'articles') {
        res = await listTreeArticles({
          q: search,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getAgroforestryAuditLogs({
          q: search,
          actionType: statusFilter,
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
  }, [activeTab, search, statusFilter, categoryFilter, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

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
  // SAPLING ACTIONS
  // -------------------------------------------------------------
  const handleApproveRequest = async (requestId, details) => {
    try {
      await updateSaplingRequestStatus(requestId, 'approved', details)
      addToast({ title: 'Request Approved', message: 'Saplings allocated to partner nursery.', type: 'success' })
      setApproveModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Approval Error', message: err.message, type: 'error' })
    }
  }

  const handleDispatchSaplings = async (requestId, trackingNo, notes) => {
    try {
      await updateSaplingRequestStatus(requestId, 'dispatched', { trackingNo, reason: notes })
      addToast({ title: 'Consignment Dispatched', message: `Tracking No: ${trackingNo}`, type: 'success' })
      setDispatchModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Dispatch Error', message: err.message, type: 'error' })
    }
  }

  const handleDeliverSaplings = async (requestId, survivalRate, notes) => {
    try {
      await updateSaplingRequestStatus(requestId, 'delivered', { survivalRate, reason: notes })
      addToast({ title: 'Delivery Logged', message: `Survival audit recorded @ ${survivalRate}%.`, type: 'success' })
      setSurvivalModal({ open: false, request: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Update Error', message: err.message, type: 'error' })
    }
  }

  const handleRejectRequest = (request) => {
    setConfirmDialog({
      open: true,
      title: 'Reject Sapling Request',
      message: `Reject request ${request.id} for ${request.farmerName}?`,
      confirmLabel: 'Reject Request',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await updateSaplingRequestStatus(request.id, 'rejected', { reason })
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
    setConfirmDialog({
      open: true,
      title: 'Verify Afforestation Partner NGO',
      message: `Verify ${ngo.name}? This activates sapling procurement allocations.`,
      confirmLabel: 'Verify NGO',
      confirmVariant: 'emerald',
      onConfirm: async (reason) => {
        try {
          await verifyNgo(ngo.id, 'verified', reason)
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
    setConfirmDialog({
      open: true,
      title: 'Suspend Partner NGO',
      message: `Suspend ${ngo.name} from receiving sapling requests?`,
      confirmLabel: 'Suspend NGO',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await verifyNgo(ngo.id, 'suspended', reason)
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

  // -------------------------------------------------------------
  // BIOFUEL ECONOMICS
  // -------------------------------------------------------------
  const handleSaveBiofuelEconomics = async (treeId, formData) => {
    try {
      await updateBiofuelEconomics(treeId, formData)
      addToast({ title: 'Economics Saved', message: 'Updated seed oil return parameters.', type: 'success' })
      setEconomicsModal({ open: false, tree: null })
      loadData()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Metric Bar */}
      <AgroforestryMetricBar summary={summary} loading={!summary} />

      {/* Main Section */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 lg:p-6 shadow-sm">
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
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
        />

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-2" />
            Loading agroforestry records...
          </div>
        ) : (
          <>
            {activeTab === 'requests' && (
              <SaplingRequestsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onApprove={(req) => setApproveModal({ open: true, request: req })}
                onDispatch={(req) => setDispatchModal({ open: true, request: req })}
                onDeliver={(req) => setSurvivalModal({ open: true, request: req })}
                onReject={handleRejectRequest}
              />
            )}

            {activeTab === 'ngos' && (
              <NgosTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onVerify={handleVerifyNgo}
                onSuspend={handleSuspendNgo}
              />
            )}

            {activeTab === 'biofuel' && (
              <BiofuelTreesTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEditEconomics={(tree) => setEconomicsModal({ open: true, tree })}
              />
            )}

            {activeTab === 'guides' && (
              <TreeCareGuidesTable
                data={tableData.data}
                onView={handleOpenDrawer}
              />
            )}

            {activeTab === 'articles' && (
              <TreeArticlesTable
                data={tableData.data}
                onView={handleOpenDrawer}
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
        onClose={() => setDrawerOpen(false)}
        onApprove={(req) => setApproveModal({ open: true, request: req })}
        onDispatch={(req) => setDispatchModal({ open: true, request: req })}
        onDeliver={(req) => setSurvivalModal({ open: true, request: req })}
        onReject={handleRejectRequest}
        onVerifyNgo={handleVerifyNgo}
        onEditEconomics={(tree) => setEconomicsModal({ open: true, tree })}
      />

      {/* Modals */}
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

      <AuditReasonModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />

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
