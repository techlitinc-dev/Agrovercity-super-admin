import React, { useState, useEffect, useCallback } from 'react'
import {
  getSystemConfigSummary,
  getSystemHealth,
  getAppConfig,
  updateAppConfig,
  listBroadcasts,
  sendBroadcast,
  listUserReports,
  resolveUserReport,
  listUserBlocks,
  unbanUser,
  listUserConsents,
  getSystemConfigAuditLogs,
  listExpertTickets,
  resolveExpertTicket,
  assignExpertTicket,
  batchResolveReports,
  batchUnbanUsers,
  batchResolveExpertTickets,
  resetToDefaultSeed
} from '../api/systemConfigApi'
import {
  SystemConfigMetricBar,
  SystemConfigTabSwitch,
  SystemConfigFiltersBar,
  BatchActionBar,
  SystemHealthView,
  RemoteConfigView,
  BroadcastsTable,
  UserReportsTable,
  UserBlocksTable,
  ExpertTicketsTable,
  UserConsentsTable,
  SystemConfigAuditLogsTable,
  ContentPagination
} from './systemConfigWidgets'
import SystemConfigDetailDrawer from '../components/system-config/SystemConfigDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  SendBroadcastModal,
  UpdateVersionGateModal,
  ResolveReportModal,
  ResolveExpertTicketModal,
  AssignAgronomistModal,
  BatchActionModal,
  ResetSeedModal
} from '../components/system-config/SystemConfigModals'
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

export default function SystemConfigPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' } }

  const [activeTab, setActiveTab] = useState('health') // 'health', 'remote_config', 'broadcasts', 'moderation', 'expert_tickets', 'blocks', 'dpdp_consents', 'audit'
  const [summary, setSummary] = useState(null)
  const [health, setHealth] = useState(null)
  const [appConfig, setAppConfig] = useState(null)
  const [loading, setLoading] = useState(false)

  // Selection for Batch Actions
  const [selectedIds, setSelectedIds] = useState([])

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [personaFilter, setPersonaFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [selectedType, setSelectedType] = useState('report')

  // Modals
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false)
  const [versionGateModalOpen, setVersionGateModalOpen] = useState(false)
  const [resolveReportModal, setResolveReportModal] = useState({ open: false, report: null })
  const [resolveTicketModal, setResolveTicketModal] = useState({ open: false, ticket: null })
  const [assignAgronomistModal, setAssignAgronomistModal] = useState({ open: false, ticket: null })
  const [batchModal, setBatchModal] = useState({ open: false, action: '', title: '', label: '', count: 0 })
  const [resetSeedModalOpen, setResetSeedModalOpen] = useState(false)

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
    impactDetails: '',
    onConfirm: null
  })

  const canMutate = true

  // Load KPI Summary, System Health, and App Config
  const fetchSummaryAndConfig = useCallback(async () => {
    try {
      const [sumRes, healthRes, cfgRes] = await Promise.all([
        getSystemConfigSummary(),
        getSystemHealth(),
        getAppConfig()
      ])
      setSummary(sumRes)
      setHealth(healthRes)
      setAppConfig(cfgRes)
    } catch {
      // Fallback
    }
  }, [])

  // Load Active Tab Data
  const fetchData = useCallback(async () => {
    if (activeTab === 'health' || activeTab === 'remote_config') {
      return
    }

    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      const query = {
        page,
        pageSize: PAGE_SIZE,
        search,
        status: statusFilter,
        persona: personaFilter,
        dateRange
      }

      switch (activeTab) {
        case 'broadcasts':
          res = await listBroadcasts(query)
          break
        case 'moderation':
          res = await listUserReports(query)
          break
        case 'expert_tickets':
          res = await listExpertTickets(query)
          break
        case 'blocks':
          res = await listUserBlocks(query)
          break
        case 'dpdp_consents':
          res = await listUserConsents(query)
          break
        case 'audit':
          res = await getSystemConfigAuditLogs(query)
          break
        default:
          break
      }
      setTableData(res)
    } catch (err) {
      addToast?.('Failed to load telemetry data: ' + (err.message || 'Network error'), 'error')
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

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked) => {
    if (checked && tableData.data) {
      setSelectedIds(tableData.data.map((r) => r.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleSelectRow = (row, type) => {
    setSelectedEntity(row)
    setSelectedType(type)
    setDrawerOpen(true)
  }

  // --- Handlers for System Health ---
  const handleRefreshHealth = async () => {
    try {
      setLoading(true)
      const h = await getSystemHealth()
      setHealth(h)
      addToast?.('Microservices telemetry pinged: all clusters healthy', 'success')
    } catch (err) {
      addToast?.('Health check failed: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- Handlers for Remote Config & Feature Flags ---
  const handleToggleFlag = (flagKey, currentVal) => {
    const nextVal = !currentVal
    const flagLabels = {
      droneSprayBookingLive: 'Drone Spraying Dispatch Engine',
      carbonCreditsDeskEnabled: 'Soil Carbon Verification & Issuance',
      kccUnderwritingEngineV2: 'Automated KCC Credit Underwriting V2',
      spotAuctionMultiBidding: 'High-Frequency Multi-Bid Mandi Engine',
      coldStorageIotSensors: 'Cold Storage IoT Real-Time Telemetry',
      womenShgMicroFinanceDesk: 'Women SHG Zero-Interest Credit Window',
      saplingGeoTaggingAi: 'AI Tree Canopy Geospatial Verification',
      contractEscrowTplusZero: 'T+0 Instant Escrow Liquidation'
    }
    const label = flagLabels[flagKey] || flagKey

    setConfirmDialog({
      open: true,
      title: `${nextVal ? 'Enable' : 'Disable'} Feature Flag: ${label}`,
      message: `Are you sure you want to dynamically flip feature flag "${flagKey}" to ${nextVal ? 'ENABLED' : 'DISABLED'} across all mobile client builds?`,
      confirmLabel: `${nextVal ? 'Enable' : 'Disable'} Flag`,
      confirmVariant: nextVal ? 'emerald' : 'rose',
      onConfirm: async (reason) => {
        try {
          const updatedFlags = { ...appConfig.featureFlags, [flagKey]: nextVal }
          const updated = await updateAppConfig({ featureFlags: updatedFlags }, reason, currentAdmin?.name)
          setAppConfig(updated)
          addToast?.(`Feature flag "${label}" set to ${nextVal ? 'ON' : 'OFF'}`, 'success')
          setConfirmDialog({ open: false })
          fetchSummaryAndConfig()
        } catch (err) {
          addToast?.('Failed to update feature flag: ' + err.message, 'error')
        }
      }
    })
  }

  const handleSaveVersionGates = (newConfig, reason) => {
    const isActivatingMaintenance = newConfig.maintenanceMode && !appConfig?.maintenanceMode

    if (isActivatingMaintenance) {
      // High-impact action requires dual sign-off
      setVersionGateModalOpen(false)
      setDualSignOffDialog({
        open: true,
        title: 'Activate Emergency Platform Maintenance Mode',
        impactDetails: 'Enabling maintenance mode locks all farmer lot postings, buyer contract bidding, and payment disbursements platform-wide. An authorizing co-administrator credential is required.',
        onConfirm: async (coAdminData) => {
          try {
            const combinedReason = `${reason} (Co-authorized by: ${coAdminData.secondAdminEmail}; Justification: ${coAdminData.reason})`
            const updated = await updateAppConfig(newConfig, combinedReason, currentAdmin?.name)
            setAppConfig(updated)
            addToast?.('Platform maintenance mode activated under dual authorization', 'success')
            setDualSignOffDialog({ open: false })
            fetchSummaryAndConfig()
          } catch (err) {
            addToast?.('Failed to activate maintenance mode: ' + err.message, 'error')
          }
        }
      })
    } else {
      // Standard version gate update
      ;(async () => {
        try {
          const updated = await updateAppConfig(newConfig, reason, currentAdmin?.name)
          setAppConfig(updated)
          addToast?.('Mobile version gates & remote configuration saved', 'success')
          setVersionGateModalOpen(false)
          fetchSummaryAndConfig()
        } catch (err) {
          addToast?.('Failed to update config: ' + err.message, 'error')
        }
      })()
    }
  }

  // --- Handlers for Targeted FCM Broadcasts ---
  const handleSendBroadcast = async (form) => {
    try {
      const bc = await sendBroadcast(form, currentAdmin?.name)
      addToast?.(`FCM Broadcast "${bc.title}" dispatched to ${bc.recipientCount?.toLocaleString()} devices`, 'success')
      setBroadcastModalOpen(false)
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('FCM broadcast dispatch failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for User Moderation Reports ---
  const handleOpenResolveReport = (report) => {
    setResolveReportModal({ open: true, report })
  }

  const handleConfirmResolveReport = async ({ resolution, reason }) => {
    const rep = resolveReportModal.report
    if (!rep) return

    if (resolution === 'resolved_banned') {
      // Permanent ban requires dual sign-off or executive confirmation
      setResolveReportModal({ open: false, report: null })
      setDualSignOffDialog({
        open: true,
        title: `Permanently Blacklist User: ${rep.reportedUserName}`,
        impactDetails: `Banning user UID ${rep.reportedUserId} (${rep.reportedUserPersona}) permanently locks their Aadhaar Vault token, closes active lots, and freezes contract bids. Authorizing co-admin credential is required.`,
        onConfirm: async (coAdminData) => {
          try {
            const combinedReason = `${reason} (Co-authorized by: ${coAdminData.secondAdminEmail}; Notes: ${coAdminData.reason})`
            await resolveUserReport(rep.id, 'resolved_banned', combinedReason, currentAdmin?.name)
            addToast?.(`User ${rep.reportedUserName} permanently blacklisted with dual authorization`, 'success')
            setDualSignOffDialog({ open: false })
            fetchData()
            fetchSummaryAndConfig()
            if (drawerOpen && selectedEntity?.id === rep.id) {
              setSelectedEntity((prev) => ({
                ...prev,
                status: 'resolved_banned',
                resolutionNotes: combinedReason
              }))
            }
          } catch (err) {
            addToast?.('User ban action failed: ' + err.message, 'error')
          }
        }
      })
    } else {
      // Warning or Dismiss
      try {
        await resolveUserReport(rep.id, resolution, reason, currentAdmin?.name)
        const label = resolution === 'resolved_warning' ? 'Warning issued to user' : 'Complaint dismissed'
        addToast?.(`${label} #${rep.id}`, 'success')
        setResolveReportModal({ open: false, report: null })
        fetchData()
        fetchSummaryAndConfig()
        if (drawerOpen && selectedEntity?.id === rep.id) {
          setSelectedEntity((prev) => ({
            ...prev,
            status: resolution,
            resolutionNotes: reason
          }))
        }
      } catch (err) {
        addToast?.('Report resolution failed: ' + err.message, 'error')
      }
    }
  }

  // --- Handlers for Unbanning Accounts ---
  const handleUnbanUser = (blockedUser) => {
    setConfirmDialog({
      open: true,
      title: `Reinstate User Account: ${blockedUser.userName}`,
      message: `Are you sure you want to lift the permanent ban on ${blockedUser.userName} (UID: ${blockedUser.userId})? The account will be restored with full trading and bidding privileges. Mandatory audit rationale is required.`,
      confirmLabel: 'Reinstate User',
      confirmVariant: 'emerald',
      onConfirm: async (reason) => {
        try {
          await unbanUser(blockedUser.userId, reason, currentAdmin?.name)
          addToast?.(`Account for ${blockedUser.userName} successfully reinstated`, 'success')
          setConfirmDialog({ open: false })
          fetchData()
          fetchSummaryAndConfig()
          if (drawerOpen && selectedEntity?.userId === blockedUser.userId) {
            setDrawerOpen(false)
          }
        } catch (err) {
          addToast?.('Failed to unban user: ' + err.message, 'error')
        }
      }
    })
  }

  // --- Handlers for Agronomist Consultation Tickets ---
  const handleOpenResolveTicket = (ticket) => {
    setResolveTicketModal({ open: true, ticket })
  }

  const handleConfirmResolveTicket = async ({ resolutionNotes, prescribedTreatment }) => {
    const tkt = resolveTicketModal.ticket
    if (!tkt) return
    try {
      await resolveExpertTicket(tkt.id, resolutionNotes, prescribedTreatment, currentAdmin?.name)
      addToast?.(`Ticket ${tkt.ticketNumber} resolved with prescribed advisory`, 'success')
      setResolveTicketModal({ open: false, ticket: null })
      fetchData()
      fetchSummaryAndConfig()
      if (drawerOpen && selectedEntity?.id === tkt.id) {
        setSelectedEntity((prev) => ({
          ...prev,
          status: 'resolved',
          resolutionNotes,
          prescribedTreatment,
          slaRemainingHours: 0
        }))
      }
    } catch (err) {
      addToast?.('Failed to resolve advisory ticket: ' + err.message, 'error')
    }
  }

  const handleOpenAssignTicket = (ticket) => {
    setAssignAgronomistModal({ open: true, ticket })
  }

  const handleConfirmAssignTicket = async ({ assignedAgronomist, reason }) => {
    const tkt = assignAgronomistModal.ticket
    if (!tkt) return
    try {
      await assignExpertTicket(tkt.id, assignedAgronomist, reason, currentAdmin?.name)
      addToast?.(`Ticket ${tkt.ticketNumber} assigned to ${assignedAgronomist}`, 'success')
      setAssignAgronomistModal({ open: false, ticket: null })
      fetchData()
      fetchSummaryAndConfig()
      if (drawerOpen && selectedEntity?.id === tkt.id) {
        setSelectedEntity((prev) => ({
          ...prev,
          assignedAgronomist,
          status: prev.status === 'open' ? 'in_progress' : prev.status
        }))
      }
    } catch (err) {
      addToast?.('Failed to assign agronomist: ' + err.message, 'error')
    }
  }

  // --- Handlers for Batch Operations ---
  const handleBatchAction = (actionType) => {
    if (actionType === 'export_selected') {
      const selectedRows = (tableData.data || []).filter((r) => selectedIds.includes(r.id))
      if (selectedRows.length === 0) return
      const csvContent = toCsv(selectedRows)
      downloadBlob(csvContent, `system_config_${activeTab}_selected_${Date.now()}.csv`)
      addToast?.(`Exported ${selectedRows.length} selected records to CSV`, 'success')
      return
    }

    const titles = {
      batch_resolve_warning: 'Issue Strike 1 Warnings in Bulk',
      batch_dismiss: 'Dismiss Selected Moderation Reports',
      batch_ban: 'Dual Sign-Off Permanent User Bans',
      batch_resolve_tickets: 'Resolve Selected Agronomist Tickets',
      batch_unban: 'Reinstate Selected Accounts'
    }

    const labels = {
      batch_resolve_warning: 'Issue Warnings',
      batch_dismiss: 'Dismiss Reports',
      batch_ban: 'Permanently Ban Users',
      batch_resolve_tickets: 'Resolve Advisory',
      batch_unban: 'Reinstate Accounts'
    }

    setBatchModal({
      open: true,
      action: actionType,
      title: titles[actionType] || 'Execute Batch Action',
      label: labels[actionType] || 'Confirm',
      count: selectedIds.length
    })
  }

  const handleConfirmBatchAction = async ({ reason, coAdmin }) => {
    const action = batchModal.action
    try {
      if (action === 'batch_resolve_warning' || action === 'batch_dismiss' || action === 'batch_ban') {
        const resolutionMap = {
          batch_resolve_warning: 'resolved_warning',
          batch_dismiss: 'dismissed',
          batch_ban: 'resolved_banned'
        }
        const resolution = resolutionMap[action]
        const finalReason = coAdmin ? `${reason} (Co-authorized by: ${coAdmin})` : reason
        await batchResolveReports(selectedIds, resolution, finalReason, currentAdmin?.name)
        addToast?.(`Successfully executed batch action across ${selectedIds.length} reports`, 'success')
      } else if (action === 'batch_resolve_tickets') {
        await batchResolveExpertTickets(
          selectedIds,
          reason,
          'Standard integrated disease & pest protocol prescribed in bulk',
          currentAdmin?.name
        )
        addToast?.(`Resolved ${selectedIds.length} agronomist consultation tickets`, 'success')
      } else if (action === 'batch_unban') {
        await batchUnbanUsers(selectedIds, reason, currentAdmin?.name)
        addToast?.(`Reinstated ${selectedIds.length} user accounts`, 'success')
      }
      setBatchModal({ open: false, action: '', title: '', label: '', count: 0 })
      setSelectedIds([])
      fetchData()
      fetchSummaryAndConfig()
    } catch (err) {
      addToast?.('Batch operation failed: ' + err.message, 'error')
    }
  }

  // --- Reset Benchmark Seed Handler ---
  const handleResetSeedConfirm = async (reason) => {
    try {
      await resetToDefaultSeed(reason, currentAdmin?.name)
      addToast?.('Module 26 system configuration reset to benchmark seed', 'success')
      setResetSeedModalOpen(false)
      setSelectedIds([])
      fetchSummaryAndConfig()
      fetchData()
    } catch (err) {
      addToast?.('Failed to reset seed state: ' + err.message, 'error')
    }
  }

  // --- CSV Export ---
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast?.('No records available to export', 'info')
      return
    }
    const csvContent = toCsv(tableData.data)
    downloadBlob(csvContent, `system_config_${activeTab}_export_${Date.now()}.csv`)
    addToast?.(`Exported ${tableData.data.length} records to CSV`, 'success')
  }

  return (
    <div className="space-y-6">
      {/* Top Metric Bar */}
      <SystemConfigMetricBar summary={summary} loading={loading && !summary} />

      {/* Tab Switcher */}
      <SystemConfigTabSwitch
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        counts={{
          broadcasts: summary?.broadcastsDeliveredThisMonth ? 'Live' : undefined,
          reports: summary?.pendingModerationReports,
          tickets: summary?.openExpertTickets,
          blocks: summary?.totalBannedUsers
        }}
      />

      {/* Filter / Search Bar */}
      <SystemConfigFiltersBar
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
        onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
        onOpenConfigModal={() => setVersionGateModalOpen(true)}
        onResetSeed={() => setResetSeedModalOpen(true)}
        canMutate={canMutate}
      />

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        activeTab={activeTab}
        onBatchAction={handleBatchAction}
        onClearSelection={handleClearSelection}
        canMutate={canMutate}
      />

      {/* Primary Views */}
      {activeTab === 'health' && (
        <SystemHealthView
          health={health}
          onRefreshHealth={handleRefreshHealth}
        />
      )}

      {activeTab === 'remote_config' && (
        <RemoteConfigView
          config={appConfig}
          onEditConfig={() => setVersionGateModalOpen(true)}
          onToggleFlag={handleToggleFlag}
        />
      )}

      {activeTab === 'broadcasts' && (
        <BroadcastsTable
          data={tableData.data}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onSelectRow={(row) => handleSelectRow(row, 'broadcast')}
        />
      )}

      {activeTab === 'moderation' && (
        <UserReportsTable
          data={tableData.data}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onSelectRow={(row) => handleSelectRow(row, 'report')}
          onResolveReport={handleOpenResolveReport}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'expert_tickets' && (
        <ExpertTicketsTable
          data={tableData.data}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onSelectRow={(row) => handleSelectRow(row, 'expert_ticket')}
          onResolveTicket={handleOpenResolveTicket}
          onAssignTicket={handleOpenAssignTicket}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'blocks' && (
        <UserBlocksTable
          data={tableData.data}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onUnbanUser={handleUnbanUser}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'dpdp_consents' && (
        <UserConsentsTable
          data={tableData.data}
        />
      )}

      {activeTab === 'audit' && (
        <SystemConfigAuditLogsTable
          data={tableData.data}
        />
      )}

      {/* Pagination (for data tables) */}
      {activeTab !== 'health' && activeTab !== 'remote_config' && (
        <ContentPagination
          page={page}
          total={tableData.total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {/* Slide-over Detail Drawer */}
      <SystemConfigDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={selectedType}
        onClose={() => setDrawerOpen(false)}
        onResolveReport={handleOpenResolveReport}
        onUnbanUser={handleUnbanUser}
        onResolveTicket={handleOpenResolveTicket}
        onAssignTicket={handleOpenAssignTicket}
        canMutate={canMutate}
      />

      {/* Targeted FCM Broadcast Modal */}
      <SendBroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onSend={handleSendBroadcast}
      />

      {/* Remote Version Gate & Maintenance Modal */}
      <UpdateVersionGateModal
        isOpen={versionGateModalOpen}
        currentConfig={appConfig || {}}
        onClose={() => setVersionGateModalOpen(false)}
        onSave={handleSaveVersionGates}
      />

      {/* Resolve User Report Modal */}
      <ResolveReportModal
        isOpen={resolveReportModal.open}
        report={resolveReportModal.report}
        onClose={() => setResolveReportModal({ open: false, report: null })}
        onConfirm={handleConfirmResolveReport}
      />

      {/* Resolve Expert Ticket Modal */}
      <ResolveExpertTicketModal
        isOpen={resolveTicketModal.open}
        ticket={resolveTicketModal.ticket}
        onClose={() => setResolveTicketModal({ open: false, ticket: null })}
        onConfirm={handleConfirmResolveTicket}
      />

      {/* Assign Specialized Agronomist Modal */}
      <AssignAgronomistModal
        isOpen={assignAgronomistModal.open}
        ticket={assignAgronomistModal.ticket}
        onClose={() => setAssignAgronomistModal({ open: false, ticket: null })}
        onConfirm={handleConfirmAssignTicket}
      />

      {/* Batch Action Modal */}
      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        label={batchModal.label}
        count={batchModal.count}
        action={batchModal.action}
        onClose={() => setBatchModal({ open: false, action: '', title: '', label: '', count: 0 })}
        onConfirm={handleConfirmBatchAction}
      />

      {/* Reset Benchmark Seed Modal */}
      <ResetSeedModal
        isOpen={resetSeedModalOpen}
        onClose={() => setResetSeedModalOpen(false)}
        onConfirm={handleResetSeedConfirm}
      />

      {/* Audit Confirmation Modal */}
      <AuditReasonModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={(reason) => confirmDialog.onConfirm?.(reason)}
      />

      {/* Dual Executive Sign-Off Modal */}
      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        impactDetails={dualSignOffDialog.impactDetails}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={(coAdminData) => dualSignOffDialog.onConfirm?.(coAdminData)}
      />
    </div>
  )
}
