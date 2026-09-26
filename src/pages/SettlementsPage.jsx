import React, { useState, useEffect, useCallback } from 'react'
import {
  getSettlementsSummary,
  listSettlements,
  markSettlementPaid,
  setSettlementHold,
  releaseSettlementHold,
  batchApproveSettlements,
  batchMarkPaidSettlements,
  batchPlaceHoldSettlements,
  batchReleaseHoldSettlements,
  listTransporterPayouts,
  listSellerPayouts,
  getCommissionConfig,
  updateCommissionConfig,
  triggerSettlementRun,
  listCronJobLogs,
  triggerCronJob,
  getSettlementsAuditLogs,
  resetSettlementsSeedData
} from '../api/settlementsApi'
import {
  SettlementsMetricBar,
  SettlementsTabSwitch,
  SettlementsFiltersBar,
  BatchActionBar,
  SettlementsTable,
  TransporterPayoutsTable,
  SellerPayoutsTable,
  PlatformCommissionsView,
  CronJobLogsTable,
  SettlementsAuditLogsTable,
  ContentPagination
} from './settlementsWidgets'
import SettlementsDetailDrawer from '../components/settlements/SettlementsDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  MarkPaidModal,
  TriggerBatchRunModal,
  UpdateCommissionsModal,
  BatchActionModal,
  ResetSeedModal
} from '../components/settlements/SettlementsModals'
import { useNotification } from '../context/NotificationContext'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { ShieldAlert } from 'lucide-react'

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

export default function SettlementsPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, hasPermission } = useAuthAdmin() || {
    currentAdmin: { name: 'Super Admin', role: 'SUPER_ADMIN' },
    hasPermission: () => true
  }

  const role = currentAdmin?.role || 'SUPER_ADMIN'
  const isFinancialAuditor = role === 'FINANCIAL_AUDITOR'
  const canMutate = hasPermission('settlements.manage') && !isFinancialAuditor

  const [activeTab, setActiveTab] = useState('settlements') // 'settlements', 'transporters', 'sellers', 'config', 'cron', 'audit'
  const [summary, setSummary] = useState(null)
  const [commissionConfig, setCommissionConfig] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [personaFilter, setPersonaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data & Multi-row Selection
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [selectedIds, setSelectedIds] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [markPaidModal, setMarkPaidModal] = useState({ open: false, settlement: null })
  const [batchRunModal, setBatchRunModal] = useState({ open: false })
  const [commissionModal, setCommissionModal] = useState({ open: false })
  const [batchModal, setBatchModal] = useState({ open: false, action: '', title: '', count: 0, label: '' })
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

  // Load KPI Summary & Config
  const fetchSummaryAndConfig = useCallback(async () => {
    try {
      const [sumRes, cfgRes] = await Promise.all([
        getSettlementsSummary(),
        getCommissionConfig()
      ])
      setSummary(sumRes)
      setCommissionConfig(cfgRes)
    } catch {
      // Fallback
    }
  }, [])

  // Load Tab Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      const query = {
        page,
        pageSize: PAGE_SIZE,
        search,
        status: statusFilter,
        dateRange,
        persona: personaFilter
      }

      switch (activeTab) {
        case 'settlements':
          query.entityType = personaFilter
          res = await listSettlements(query)
          break
        case 'transporters':
          res = await listTransporterPayouts(query)
          break
        case 'sellers':
          res = await listSellerPayouts(query)
          break
        case 'cron':
          res = await listCronJobLogs(query)
          break
        case 'audit':
          res = await getSettlementsAuditLogs(query)
          break
        case 'config':
          // Config loaded in fetchSummaryAndConfig
          break
        default:
          break
      }
      setTableData(res)
    } catch (err) {
      addToast?.('Failed to load records: ' + (err.message || 'Network error'), 'error')
    } finally {
      setLoading(false)
    }
  }, [activeTab, page, search, statusFilter, personaFilter, dateRange, addToast])

  useEffect(() => {
    fetchSummaryAndConfig()
  }, [fetchSummaryAndConfig])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setPersonaFilter('all')
    setDateRange('all')
    setSelectedIds([])
  }

  const handleSelectRow = (row) => {
    setSelectedEntity(row)
    setDrawerOpen(true)
  }

  // Multi-row Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = tableData.data.map((r) => r.id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // --- Batch Actions Handler ---
  const handleBatchAction = (action) => {
    if (selectedIds.length === 0) return

    if (action === 'export_selected') {
      const rows = tableData.data.filter((r) => selectedIds.includes(r.id))
      const csv = toCsv(rows)
      downloadBlob(csv, `settlements_${activeTab}_selected_${Date.now()}.csv`)
      addToast?.(`Exported ${rows.length} selected records to CSV`, 'success')
      return
    }

    const actionMap = {
      batch_approve: { title: 'Batch Approve Settlement Batches', label: 'Approve Selected' },
      batch_mark_paid: { title: 'Batch Mark Paid with Bank UTR Numbers', label: 'Disburse Payouts' },
      batch_hold: { title: 'Place Legal Settlement Hold on Selected', label: 'Hold Selected' },
      batch_release_hold: { title: 'Release Settlement Hold on Selected', label: 'Release Selected' }
    }

    const conf = actionMap[action] || { title: 'Execute Batch Action', label: 'Confirm' }
    setBatchModal({
      open: true,
      action,
      title: conf.title,
      count: selectedIds.length,
      label: conf.label
    })
  }

  const handleConfirmBatchAction = async ({ reason, coAdmin, paymentRefPrefix }) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'

      switch (batchModal.action) {
        case 'batch_approve':
          await batchApproveSettlements(selectedIds, reason, adminUid, adminName)
          addToast?.(`Successfully approved ${selectedIds.length} settlement batches`, 'success')
          break
        case 'batch_mark_paid':
          await batchMarkPaidSettlements(selectedIds, reason, paymentRefPrefix, coAdmin, adminUid, adminName)
          addToast?.(`Successfully marked ${selectedIds.length} settlement batches as paid`, 'success')
          break
        case 'batch_hold':
          await batchPlaceHoldSettlements(selectedIds, reason, adminUid, adminName)
          addToast?.(`Placed legal hold on ${selectedIds.length} settlement records`, 'success')
          break
        case 'batch_release_hold':
          await batchReleaseHoldSettlements(selectedIds, reason, adminUid, adminName)
          addToast?.(`Released hold on ${selectedIds.length} settlement records`, 'success')
          break
        default:
          break
      }

      setBatchModal({ open: false, action: '', title: '', count: 0, label: '' })
      setSelectedIds([])
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Batch action failed: ' + (err.message || 'Server error'), 'error')
    }
  }

  // --- Single Record Action Handlers ---
  const handleOpenMarkPaid = (settlement) => {
    if (settlement.netPayoutInr > 50000 && !settlement.signOffAdmin2) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Settlement Payout: ${settlement.batchId}`,
        amount: settlement.netPayoutInr,
        details: `Beneficiary: ${settlement.beneficiaryName} (${settlement.bankName} - ${settlement.accountNumberMasked}). Since the disbursement exceeds ₹50,000, institutional co-authorizer sign-off is required under SOP-25.`,
        onConfirm: async (coAdminData) => {
          try {
            const utr = `SBIN${Date.now().toString().slice(-10)}`
            await markSettlementPaid(
              settlement.id,
              utr,
              coAdminData.reason,
              coAdminData.secondAdminEmail || 'auditor.finance@agrovercity.in',
              currentAdmin?.id || 'usr_admin_root',
              currentAdmin?.name || 'Super Admin'
            )
            addToast?.(`Batch #${settlement.batchId} marked paid with dual sign-off authorization`, 'success')
            setDualSignOffDialog({ open: false })
            fetchData()
            fetchSummaryAndConfig()
            if (drawerOpen && selectedEntity?.id === settlement.id) {
              setSelectedEntity((prev) => ({
                ...prev,
                status: 'paid',
                paymentReferenceUtr: utr,
                paidAt: new Date().toISOString()
              }))
            }
          } catch (err) {
            addToast?.('Disbursement authorization failed: ' + err.message, 'error')
          }
        }
      })
    } else {
      setMarkPaidModal({ open: true, settlement })
    }
  }

  const handleConfirmMarkPaid = async ({ paymentReferenceUtr, reason }) => {
    try {
      await markSettlementPaid(
        markPaidModal.settlement.id,
        paymentReferenceUtr,
        reason,
        null,
        currentAdmin?.id || 'usr_admin_root',
        currentAdmin?.name || 'Super Admin'
      )
      addToast?.(`Settlement batch marked paid (UTR: ${paymentReferenceUtr})`, 'success')
      setMarkPaidModal({ open: false, settlement: null })
      fetchData()
      fetchSummaryAndConfig()
      if (drawerOpen && selectedEntity?.id === markPaidModal.settlement.id) {
        setSelectedEntity((prev) => ({
          ...prev,
          status: 'paid',
          paymentReferenceUtr,
          paidAt: new Date().toISOString()
        }))
      }
    } catch (err) {
      addToast?.('Marking paid failed: ' + err.message, 'error')
    }
  }

  const handleHoldSettlement = (settlement) => {
    setConfirmDialog({
      open: true,
      title: `Place Legal Settlement Hold: ${settlement.batchId}`,
      message: `Are you sure you want to freeze payout for ${settlement.beneficiaryName} (Batch #${settlement.batchId})? Funds will be locked in escrow. Mandatory administrative justification is required.`,
      confirmLabel: 'Place Legal Hold',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await setSettlementHold(
            settlement.id,
            reason,
            '',
            currentAdmin?.id || 'usr_admin_root',
            currentAdmin?.name || 'Super Admin'
          )
          addToast?.(`Settlement #${settlement.batchId} placed on legal hold`, 'success')
          setConfirmDialog({ open: false })
          fetchData()
          fetchSummaryAndConfig()
          if (drawerOpen && selectedEntity?.id === settlement.id) {
            setSelectedEntity((prev) => ({ ...prev, status: 'on_hold', holdReason: reason }))
          }
        } catch (err) {
          addToast?.('Failed to hold settlement: ' + err.message, 'error')
        }
      }
    })
  }

  const handleReleaseSettlementHold = (settlement) => {
    setConfirmDialog({
      open: true,
      title: `Release Legal Settlement Hold: ${settlement.batchId}`,
      message: `Has the dispute or arbitration on Batch #${settlement.batchId} been resolved? Releasing hold will restore batch to approved status for disbursement.`,
      confirmLabel: 'Release Hold',
      confirmVariant: 'emerald',
      onConfirm: async (reason) => {
        try {
          await releaseSettlementHold(
            settlement.id,
            reason,
            currentAdmin?.id || 'usr_admin_root',
            currentAdmin?.name || 'Super Admin'
          )
          addToast?.(`Hold released for Batch #${settlement.batchId}`, 'success')
          setConfirmDialog({ open: false })
          fetchData()
          fetchSummaryAndConfig()
          if (drawerOpen && selectedEntity?.id === settlement.id) {
            setSelectedEntity((prev) => ({ ...prev, status: 'approved', holdReason: null }))
          }
        } catch (err) {
          addToast?.('Failed to release hold: ' + err.message, 'error')
        }
      }
    })
  }

  // --- Handlers for Batch Run & Config ---
  const handleConfirmBatchRun = async (params) => {
    try {
      await triggerSettlementRun(
        params,
        currentAdmin?.id || 'usr_admin_root',
        currentAdmin?.name || 'Super Admin'
      )
      addToast?.('On-demand settlement calculation run executed successfully', 'success')
      setBatchRunModal({ open: false })
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Batch run failed: ' + err.message, 'error')
    }
  }

  const handleSaveCommissionConfig = async (newConfig, reason) => {
    try {
      const updated = await updateCommissionConfig(
        newConfig,
        reason,
        currentAdmin?.id || 'usr_admin_root',
        currentAdmin?.name || 'Super Admin'
      )
      setCommissionConfig(updated)
      addToast?.('Platform commission rates & tax parameters updated', 'success')
      setCommissionModal({ open: false })
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Failed to update config: ' + err.message, 'error')
    }
  }

  // --- Handlers for Cron Jobs ---
  const handleTriggerCron = async (cronJob) => {
    try {
      await triggerCronJob(cronJob.id, 'Manual run triggered by superadmin', currentAdmin?.id || 'usr_admin_root', currentAdmin?.name || 'Super Admin')
      addToast?.(`Scheduled job "${cronJob.jobName}" triggered successfully`, 'success')
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Cron trigger failed: ' + err.message, 'error')
    }
  }

  // --- Reset Benchmark Seed Handler ---
  const handleConfirmResetSeed = async (reason) => {
    try {
      await resetSettlementsSeedData(
        reason,
        currentAdmin?.id || 'usr_admin_root',
        currentAdmin?.name || 'Super Admin'
      )
      addToast?.('SOP-25 benchmark dataset successfully restored', 'success')
      setResetModalOpen(false)
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Failed to reset seed data: ' + err.message, 'error')
    }
  }

  // --- CSV Export ---
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast?.('No data to export', 'info')
      return
    }
    const csvContent = toCsv(tableData.data)
    downloadBlob(csvContent, `settlements_${activeTab}_export_${Date.now()}.csv`)
    addToast?.(`Exported ${tableData.data.length} records to CSV`, 'success')
  }

  return (
    <div className="space-y-6">
      {/* Financial Auditor Compliance Banner */}
      {isFinancialAuditor && (
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Statutory Compliance Mode Active:</span> You are accessing the Financial Settlements & Automated Jobs module under <strong>Financial Auditor</strong> policy controls. Payout disbursements, holds, releases, and job triggers are strictly read-only.
          </div>
        </div>
      )}

      {/* Top Metric Bar */}
      <SettlementsMetricBar summary={summary} loading={loading && !summary} />

      {/* Tab Navigation */}
      <SettlementsTabSwitch
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        counts={{
          settlements: summary?.pendingApprovalBatchesCount,
          cron: summary?.cronJobsCount
        }}
      />

      {/* Filters Bar (shown on ledger tabs) */}
      {activeTab !== 'config' && (
        <SettlementsFiltersBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          personaFilter={personaFilter}
          onPersonaChange={setPersonaFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          activeTab={activeTab}
          onRefresh={() => {
            fetchData()
            fetchSummaryAndConfig()
          }}
          onExportCsv={handleExportCsv}
          onResetSeed={() => setResetModalOpen(true)}
          canMutate={canMutate}
          onTriggerBatchRun={
            activeTab === 'settlements' && canMutate
              ? () => setBatchRunModal({ open: true })
              : null
          }
        />
      )}

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        activeTab={activeTab}
        onBatchAction={handleBatchAction}
        onClearSelection={handleClearSelection}
        canMutate={canMutate}
      />

      {/* Primary Views */}
      {activeTab === 'settlements' && (
        <SettlementsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onMarkPaid={handleOpenMarkPaid}
          onHold={handleHoldSettlement}
          onReleaseHold={handleReleaseSettlementHold}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'transporters' && (
        <TransporterPayoutsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      {activeTab === 'sellers' && (
        <SellerPayoutsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
        />
      )}

      {activeTab === 'config' && (
        <PlatformCommissionsView
          config={commissionConfig}
          onEditConfig={canMutate ? () => setCommissionModal({ open: true }) : null}
        />
      )}

      {activeTab === 'cron' && (
        <CronJobLogsTable
          data={tableData.data}
          onTriggerCron={canMutate ? handleTriggerCron : null}
        />
      )}

      {activeTab === 'audit' && (
        <SettlementsAuditLogsTable data={tableData.data} />
      )}

      {/* Pagination (except for config) */}
      {activeTab !== 'config' && (
        <ContentPagination
          page={page}
          total={tableData.total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {/* Slide-over Detail Drawer */}
      <SettlementsDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        onClose={() => setDrawerOpen(false)}
        onMarkPaid={handleOpenMarkPaid}
        onHold={handleHoldSettlement}
        onReleaseHold={handleReleaseSettlementHold}
        onTriggerCron={handleTriggerCron}
        canMutate={canMutate}
        role={role}
      />

      {/* Modals */}
      <MarkPaidModal
        isOpen={markPaidModal.open}
        settlement={markPaidModal.settlement}
        onClose={() => setMarkPaidModal({ open: false, settlement: null })}
        onConfirm={handleConfirmMarkPaid}
      />

      <TriggerBatchRunModal
        isOpen={batchRunModal.open}
        onClose={() => setBatchRunModal({ open: false })}
        onConfirm={handleConfirmBatchRun}
      />

      <UpdateCommissionsModal
        isOpen={commissionModal.open}
        currentConfig={commissionConfig || {}}
        onClose={() => setCommissionModal({ open: false })}
        onSave={handleSaveCommissionConfig}
      />

      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        label={batchModal.label}
        count={batchModal.count}
        action={batchModal.action}
        onClose={() => setBatchModal({ open: false, action: '', title: '', count: 0, label: '' })}
        onConfirm={handleConfirmBatchAction}
      />

      <ResetSeedModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmResetSeed}
      />

      <AuditReasonModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm}
      />

      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        amount={dualSignOffDialog.amount}
        details={dualSignOffDialog.details}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={dualSignOffDialog.onConfirm}
      />
    </div>
  )
}
