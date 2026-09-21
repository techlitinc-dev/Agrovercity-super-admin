import React, { useState, useEffect, useCallback } from 'react'
import {
  getSettlementsSummary,
  listSettlements,
  markSettlementPaid,
  setSettlementHold,
  releaseSettlementHold,
  listTransporterPayouts,
  listSellerPayouts,
  getCommissionConfig,
  updateCommissionConfig,
  triggerSettlementRun,
  listCronJobLogs,
  triggerCronJob,
  getSettlementsAuditLogs
} from '../api/settlementsApi'
import {
  SettlementsMetricBar,
  SettlementsTabSwitch,
  SettlementsFiltersBar,
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
  UpdateCommissionsModal
} from '../components/settlements/SettlementsModals'
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

export default function SettlementsPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' } }

  const [activeTab, setActiveTab] = useState('settlements') // 'settlements', 'transporters', 'sellers', 'config', 'cron', 'audit'
  const [summary, setSummary] = useState(null)
  const [commissionConfig, setCommissionConfig] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [personaFilter, setPersonaFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [markPaidModal, setMarkPaidModal] = useState({ open: false, settlement: null })
  const [batchRunModal, setBatchRunModal] = useState({ open: false })
  const [commissionModal, setCommissionModal] = useState({ open: false })

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
        status: statusFilter
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
  }, [activeTab, page, search, statusFilter, personaFilter, addToast])

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
  }

  const handleSelectRow = (row) => {
    setSelectedEntity(row)
    setDrawerOpen(true)
  }

  // --- Handlers for Settlement Actions ---
  const handleOpenMarkPaid = (settlement) => {
    const isDualSignOff = settlement.netPayoutInr > 50000

    if (isDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Settlement Payout: ${settlement.beneficiaryName}`,
        amount: settlement.netPayoutInr,
        details: `Batch #${settlement.batchId} (${settlement.beneficiaryName}). Net payable ₹${settlement.netPayoutInr.toLocaleString()} after ${settlement.commissionRatePct}% platform fee, TDS, and GST deductions.`,
        onConfirm: async (coAdminData) => {
          try {
            const utr = `NEFT2609${Math.floor(100000 + Math.random() * 900000)}`
            await markSettlementPaid(
              settlement.id,
              utr,
              coAdminData.reason,
              coAdminData,
              currentAdmin?.name
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
        currentAdmin?.name
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
          await setSettlementHold(settlement.id, reason, currentAdmin?.name)
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
          await releaseSettlementHold(settlement.id, reason, currentAdmin?.name)
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
  const handleConfirmBatchRun = async ({ entityType, dateRange, reason }) => {
    try {
      await triggerSettlementRun({ entityType, dateRange }, reason, currentAdmin?.name)
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
      const updated = await updateCommissionConfig(newConfig, reason, currentAdmin?.name)
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
      await triggerCronJob(cronJob.jobName, 'Manual run triggered by superadmin', currentAdmin?.name)
      addToast?.(`Scheduled job "${cronJob.jobName}" triggered successfully`, 'success')
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Cron trigger failed: ' + err.message, 'error')
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
          activeTab={activeTab}
          onRefresh={() => {
            fetchData()
            fetchSummaryAndConfig()
          }}
          onExportCsv={handleExportCsv}
          onTriggerBatchRun={
            activeTab === 'settlements'
              ? () => setBatchRunModal({ open: true })
              : null
          }
        />
      )}

      {/* Primary Views */}
      {activeTab === 'settlements' && (
        <SettlementsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onMarkPaid={handleOpenMarkPaid}
          onHold={handleHoldSettlement}
          onReleaseHold={handleReleaseSettlementHold}
        />
      )}

      {activeTab === 'transporters' && (
        <TransporterPayoutsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
        />
      )}

      {activeTab === 'sellers' && (
        <SellerPayoutsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
        />
      )}

      {activeTab === 'config' && (
        <PlatformCommissionsView
          config={commissionConfig}
          onEditConfig={() => setCommissionModal({ open: true })}
        />
      )}

      {activeTab === 'cron' && (
        <CronJobLogsTable
          data={tableData.data}
          onTriggerCron={handleTriggerCron}
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
