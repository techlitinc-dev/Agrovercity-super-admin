import React, { useState, useEffect, useCallback } from 'react'
import {
  getWomenShgSummary,
  listWomenShgs,
  verifyWomenShg,
  suspendWomenShg,
  batchVerifyShgs,
  batchSuspendShgs,
  listShgDeposits,
  recordShgDeposit,
  batchClearDeposits,
  listHomeEnterprises,
  curateEnterpriseProduct,
  batchCurateProducts,
  listShgSubsidies,
  disburseSubventionSubsidy,
  batchDisburseSubsidies,
  listDistrictAdoption,
  updateDistrictStatus,
  getWomenAuditLogs,
  resetWomenShgSeedData
} from '../api/womenShgApi'
import {
  WomenMetricBar,
  WomenShgTabSwitch,
  WomenShgFiltersBar,
  BatchActionBar,
  WomenShgsTable,
  ShgDepositsTable,
  HomeEnterprisesTable,
  ShgSubsidiesTable,
  DistrictAdoptionTable,
  WomenModeSimulationBanner,
  WomenAuditLogsTable,
  ContentPagination
} from './womenShgWidgets'
import WomenShgDetailDrawer from '../components/women-shg/WomenShgDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  VerifyShgModal,
  CurateProductModal,
  RecordDepositModal,
  BatchActionModal,
  ResetSeedModal
} from '../components/women-shg/WomenShgModals'
import { useNotification } from '../context/NotificationContext'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { ShieldAlert, Smartphone, HeartHandshake, Sparkles, FileSpreadsheet, RotateCcw } from 'lucide-react'
import PageContextBar from '../components/layout/PageContextBar'

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

export default function WomenShgPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, hasPermission } = useAuthAdmin() || {
    currentAdmin: { name: 'Super Admin', role: 'SUPER_ADMIN' },
    hasPermission: () => true
  }

  const role = currentAdmin?.role || 'SUPER_ADMIN'
  const isFinancialAuditor = role === 'FINANCIAL_AUDITOR'
  const canMutate = hasPermission('women_shg.manage') && !isFinancialAuditor

  const [activeTab, setActiveTab] = useState('shgs') // 'shgs', 'deposits', 'enterprises', 'subsidies', 'districts', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isWomenModePreview, setIsWomenModePreview] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [persona, setPersona] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data & Multi-row Selection
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [selectedIds, setSelectedIds] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [verifyModal, setVerifyModal] = useState({ open: false, shg: null })
  const [curateModal, setCurateModal] = useState({ open: false, product: null })
  const [depositModal, setDepositModal] = useState({ open: false })
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

  // Load KPI Summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await getWomenShgSummary()
      setSummary(res)
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
        persona
      }

      switch (activeTab) {
        case 'shgs':
          query.district = subFilter
          res = await listWomenShgs(query)
          break
        case 'deposits':
          query.shgId = subFilter
          res = await listShgDeposits(query)
          break
        case 'enterprises':
          query.category = subFilter
          res = await listHomeEnterprises(query)
          break
        case 'subsidies':
          res = await listShgSubsidies(query)
          break
        case 'districts':
          res = await listDistrictAdoption(query)
          break
        case 'audit':
          res = await getWomenAuditLogs(query)
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
  }, [activeTab, page, search, statusFilter, subFilter, dateRange, persona, addToast])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page & selection when switching tabs or filters
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setSubFilter('all')
    setDateRange('all')
    setPersona('all')
    setSelectedIds([])
  }

  // Row selection for drawer
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
      downloadBlob(csv, `women_shg_${activeTab}_selected_${Date.now()}.csv`)
      addToast?.(`Exported ${rows.length} selected records to CSV`, 'success')
      return
    }

    const actionMap = {
      verify_shgs: { title: 'Batch Verify Self Help Groups', label: 'Verify SHGs' },
      suspend_shgs: { title: 'Batch Suspend SHGs', label: 'Suspend SHGs' },
      clear_deposits: { title: 'Batch Reconcile Recurring Deposits', label: 'Clear Deposits' },
      approve_products: { title: 'Approve Cottage Enterprise SKUs', label: 'Approve for Storefront' },
      request_changes: { title: 'Request QC & FSSAI Changes', label: 'Request Changes' },
      delist_products: { title: 'Delist Products from Storefront', label: 'Delist SKUs' },
      disburse_subsidies: { title: 'Batch Disburse Sanctioned Grants', label: 'Disburse Grants' }
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

  const handleConfirmBatchAction = async (reason) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      const { action } = batchModal

      if (action === 'verify_shgs') {
        await batchVerifyShgs(selectedIds, 'eligible', reason, adminUid, adminName)
        addToast?.(`Verified ${selectedIds.length} Self Help Groups`, 'success')
      } else if (action === 'suspend_shgs') {
        await batchSuspendShgs(selectedIds, reason, adminUid, adminName)
        addToast?.(`Suspended ${selectedIds.length} SHGs`, 'success')
      } else if (action === 'clear_deposits') {
        await batchClearDeposits(selectedIds, reason, adminUid, adminName)
        addToast?.(`Cleared & reconciled ${selectedIds.length} deposits`, 'success')
      } else if (action === 'approve_products') {
        await batchCurateProducts(selectedIds, 'approved', reason, adminUid, adminName)
        addToast?.(`Approved ${selectedIds.length} marketplace products`, 'success')
      } else if (action === 'request_changes') {
        await batchCurateProducts(selectedIds, 'changes_requested', reason, adminUid, adminName)
        addToast?.(`Requested changes for ${selectedIds.length} products`, 'success')
      } else if (action === 'delist_products') {
        await batchCurateProducts(selectedIds, 'delisted', reason, adminUid, adminName)
        addToast?.(`Delisted ${selectedIds.length} products`, 'success')
      } else if (action === 'disburse_subsidies') {
        await batchDisburseSubsidies(selectedIds, reason, adminUid, adminName)
        addToast?.(`Disbursed subsidies across ${selectedIds.length} grants`, 'success')
      }

      setBatchModal({ open: false, action: '', title: '', count: 0, label: '' })
      setSelectedIds([])
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Batch operation failed: ' + err.message, 'error')
    }
  }

  // --- Reset Benchmark Seed Handler ---
  const handleResetSeedConfirm = async (reason) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await resetWomenShgSeedData(reason, adminUid, adminName)
      addToast?.('SOP-24 Women in Agriculture benchmark datasets restored successfully.', 'success')
      setSelectedIds([])
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Seed reset failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for SHG Actions ---
  const handleVerifyShg = (shg) => {
    setVerifyModal({ open: true, shg })
  }

  const handleConfirmVerifyShg = async ({ grantEligibility, reason }) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await verifyWomenShg(verifyModal.shg.id, grantEligibility, reason, adminUid, adminName)
      addToast?.(`SHG "${verifyModal.shg.shgName}" verified and eligible for subvention`, 'success')
      setVerifyModal({ open: false, shg: null })
      fetchData()
      fetchSummary()
      if (drawerOpen && selectedEntity?.id === verifyModal.shg.id) {
        setSelectedEntity((prev) => ({ ...prev, status: 'verified', subventionEligibility: grantEligibility }))
      }
    } catch (err) {
      addToast?.('Verification failed: ' + err.message, 'error')
    }
  }

  const handleSuspendShg = (shg) => {
    setConfirmDialog({
      open: true,
      title: `Suspend SHG: ${shg.shgName}`,
      message: `Are you sure you want to suspend this SHG? Internal loan activities and interest subvention eligibility will be halted immediately.`,
      confirmLabel: 'Suspend SHG',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          const adminUid = currentAdmin?.id || 'usr_admin_root'
          const adminName = currentAdmin?.name || 'Super Admin'
          await suspendWomenShg(shg.id, reason, adminUid, adminName)
          addToast?.(`SHG ${shg.shgName} suspended`, 'success')
          setConfirmDialog({ open: false })
          fetchData()
          fetchSummary()
          if (drawerOpen && selectedEntity?.id === shg.id) {
            setSelectedEntity((prev) => ({ ...prev, status: 'suspended' }))
          }
        } catch (err) {
          addToast?.('Suspension failed: ' + err.message, 'error')
        }
      }
    })
  }

  // --- Handlers for Deposit Actions ---
  const handleSaveDeposit = async (payload) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await recordShgDeposit(payload, adminUid, adminName)
      addToast?.(`Deposit recorded for ${payload.memberName || 'member'} (${payload.depositMonth})`, 'success')
      setDepositModal({ open: false })
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Deposit entry failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for Home Enterprise Storefront Actions ---
  const handleCurateProduct = (product) => {
    setCurateModal({ open: true, product })
  }

  const handleConfirmCurateProduct = async ({ status, curationNotes, reason }) => {
    try {
      const adminUid = currentAdmin?.id || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await curateEnterpriseProduct(
        curateModal.product.id,
        status,
        curationNotes,
        reason,
        adminUid,
        adminName
      )
      addToast?.(`Product status updated to "${status}"`, 'success')
      setCurateModal({ open: false, product: null })
      fetchData()
      fetchSummary()
      if (drawerOpen && selectedEntity?.id === curateModal.product.id) {
        setSelectedEntity((prev) => ({ ...prev, status, curationNotes }))
      }
    } catch (err) {
      addToast?.('Product curation failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for Subsidy & NRLM Grant Actions ---
  const handleDisburseSubsidy = (subsidy) => {
    const isDualSignOff = subsidy.amountInr > 50000

    if (isDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Subvention Grant: ${subsidy.shgName}`,
        amount: subsidy.amountInr,
        details: `${subsidy.schemeName} (${subsidy.grantType}). Sanction amount ₹${subsidy.amountInr.toLocaleString()} requires dual-admin sign-off before NEFT bank credit.`,
        onConfirm: async (coAdminData) => {
          try {
            const adminUid = currentAdmin?.id || 'usr_admin_root'
            const adminName = currentAdmin?.name || 'Super Admin'
            await disburseSubventionSubsidy(
              subsidy.id,
              coAdminData.reason,
              coAdminData,
              adminUid,
              adminName
            )
            addToast?.(`Grant of ₹${subsidy.amountInr.toLocaleString()} disbursed with dual sign-off`, 'success')
            setDualSignOffDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === subsidy.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'disbursed' }))
            }
          } catch (err) {
            addToast?.('Subsidy disbursement failed: ' + err.message, 'error')
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: `Disburse Subsidy to ${subsidy.shgName}`,
        message: `Confirm direct credit of ₹${subsidy.amountInr.toLocaleString()} under scheme "${subsidy.schemeName}" to SHG designated bank account?`,
        confirmLabel: 'Disburse Grant',
        confirmVariant: 'emerald',
        onConfirm: async (reason) => {
          try {
            const adminUid = currentAdmin?.id || 'usr_admin_root'
            const adminName = currentAdmin?.name || 'Super Admin'
            await disburseSubventionSubsidy(subsidy.id, reason, null, adminUid, adminName)
            addToast?.('Subsidy disbursed successfully', 'success')
            setConfirmDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === subsidy.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'disbursed' }))
            }
          } catch (err) {
            addToast?.('Disbursement failed: ' + err.message, 'error')
          }
        }
      })
    }
  }

  // --- Sub-filter options per tab ---
  const getSubFilterConfig = () => {
    switch (activeTab) {
      case 'shgs':
        return {
          label: 'District',
          options: [
            { label: 'Ahmednagar', value: 'ahmednagar' },
            { label: 'Nashik', value: 'nashik' },
            { label: 'Solapur', value: 'solapur' },
            { label: 'Jalgaon', value: 'jalgaon' },
            { label: 'Pune', value: 'pune' },
            { label: 'Kolhapur', value: 'kolhapur' }
          ]
        }
      case 'enterprises':
        return {
          label: 'Category',
          options: [
            { label: 'Pickles & Chutneys', value: 'pickles & chutneys' },
            { label: 'Flour & Millets', value: 'flour & millets' },
            { label: 'Organic Spices', value: 'organic spices' },
            { label: 'Dehydrated Fruits', value: 'dehydrated fruits' },
            { label: 'Snacks & Papads', value: 'snacks & papads' },
            { label: 'Handloom & Crafts', value: 'handloom & crafts' }
          ]
        }
      case 'deposits':
        return {
          label: 'SHG Cluster',
          options: [
            { label: 'Savitribai Phule Bachat Gat', value: 'shg_01' },
            { label: 'Jijamata Krishi Bachat Gat', value: 'shg_02' },
            { label: 'Ahilyabai Holkar Sangh', value: 'shg_03' },
            { label: 'Kranti Jyoti Savitri Gat', value: 'shg_04' }
          ]
        }
      case 'districts':
        return {
          label: 'District Filter',
          options: [
            { label: 'Ahmednagar', value: 'ahmednagar' },
            { label: 'Nashik', value: 'nashik' },
            { label: 'Pune', value: 'pune' },
            { label: 'Satara', value: 'satara' },
            { label: 'Kolhapur', value: 'kolhapur' },
            { label: 'Solapur', value: 'solapur' },
            { label: 'Chhatrapati Sambhajinagar', value: 'chhatrapati sambhajinagar' },
            { label: 'Nagpur', value: 'nagpur' }
          ]
        }
      default:
        return { label: '', options: [] }
    }
  }

  const subConfig = getSubFilterConfig()

  // CSV export handler
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast?.('No data to export', 'info')
      return
    }
    const csvContent = toCsv(tableData.data)
    downloadBlob(csvContent, `women_shg_${activeTab}_export_${Date.now()}.csv`)
    addToast?.(`Exported ${tableData.data.length} records to CSV`, 'success')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Page Context Bar */}
      <div className="px-6 pt-6">
        <PageContextBar
          title="Women in Agriculture & Self Help Groups"
          sop="SOP-28"
          category="Empowerment & Inclusion"
          icon={HeartHandshake}
          iconColor="rose"
          description="SHG governance verification, doorstep micro-deposit collection, rural home enterprise marketplace curation, and 3% interest subvention."
          currentAdmin={currentAdmin}
          isAuditor={isFinancialAuditor}
          isSupport={isSupport}
          auditorNotice={
            isFinancialAuditor
              ? 'Statutory Compliance Mode: SHG verifications, suspension, product curation, and subsidy disbursements are strictly read-only.'
              : null
          }
          stats={[
            { label: 'Active SHGs', value: summary?.totalActiveShgs ?? 0 },
            { label: 'Storefront Products', value: summary?.activeStorefrontProducts ?? 0 },
            { label: 'Districts', value: summary?.womenModeStats?.districtsCovered || 8 }
          ]}
          actions={
            <>
              <button
                onClick={() => setIsWomenModePreview(!isWomenModePreview)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 ${
                  isWomenModePreview
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{isWomenModePreview ? 'Exit Mobile UI' : 'Simulate Mobile UI'}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Ledger CSV</span>
              </button>

              {canMutate && (
                <button
                  onClick={() => setResetModalOpen(true)}
                  title="Reset SOP-28 Seed Data"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs transition"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Reset Seed</span>
                </button>
              )}
            </>
          }
        />
      </div>

      {/* Top Metric Bar */}
      <WomenMetricBar summary={summary} loading={loading && !summary} />

      {/* Women Mode Simulation Banner */}
      <WomenModeSimulationBanner
        isEnabled={isWomenModePreview}
        onToggle={() => setIsWomenModePreview(!isWomenModePreview)}
      />

      {/* Tab Navigation */}
      <WomenShgTabSwitch
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        counts={{
          shgs: summary?.totalActiveShgs,
          enterprises: summary?.activeStorefrontProducts,
          subsidies: summary?.flaggedAuditAlerts > 0 ? `${summary?.flaggedAuditAlerts} Flag` : undefined,
          districts: summary?.womenModeStats?.districtsCovered || 8
        }}
      />

      {/* Filters Bar */}
      <WomenShgFiltersBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        subFilter={subFilter}
        onSubFilterChange={setSubFilter}
        subFilterOptions={subConfig.options}
        subFilterLabel={subConfig.label}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        persona={persona}
        onPersonaChange={setPersona}
        activeTab={activeTab}
        onRefresh={() => {
          fetchData()
          fetchSummary()
        }}
        onExportCsv={handleExportCsv}
        onResetSeed={() => setResetModalOpen(true)}
        canMutate={canMutate}
        onAddNew={
          activeTab === 'deposits' && canMutate
            ? () => setDepositModal({ open: true })
            : null
        }
      />

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedIds.length}
        activeTab={activeTab}
        onBatchAction={handleBatchAction}
        onClearSelection={handleClearSelection}
        canMutate={canMutate}
      />

      {/* Primary Data Grid */}
      {activeTab === 'shgs' && (
        <WomenShgsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onVerifyShg={handleVerifyShg}
          onSuspendShg={handleSuspendShg}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'deposits' && (
        <ShgDepositsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'enterprises' && (
        <HomeEnterprisesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onCurateProduct={handleCurateProduct}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'subsidies' && (
        <ShgSubsidiesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onDisburseSubsidy={handleDisburseSubsidy}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'districts' && (
        <DistrictAdoptionTable
          data={tableData.data}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onViewDistrict={handleSelectRow}
          canMutate={canMutate}
        />
      )}

      {activeTab === 'audit' && (
        <WomenAuditLogsTable data={tableData.data} />
      )}

      {/* Pagination */}
      <ContentPagination
        page={page}
        total={tableData.total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Detail Slide-Over Drawer */}
      <WomenShgDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        onClose={() => setDrawerOpen(false)}
        onVerifyShg={handleVerifyShg}
        onSuspendShg={handleSuspendShg}
        onCurateProduct={handleCurateProduct}
        onDisburseSubsidy={handleDisburseSubsidy}
        canMutate={canMutate}
        role={role}
      />

      {/* Action Modals */}
      <VerifyShgModal
        isOpen={verifyModal.open}
        shg={verifyModal.shg}
        onClose={() => setVerifyModal({ open: false, shg: null })}
        onConfirm={handleConfirmVerifyShg}
      />

      <CurateProductModal
        isOpen={curateModal.open}
        product={curateModal.product}
        onClose={() => setCurateModal({ open: false, product: null })}
        onConfirm={handleConfirmCurateProduct}
      />

      <RecordDepositModal
        isOpen={depositModal.open}
        onClose={() => setDepositModal({ open: false })}
        onSave={handleSaveDeposit}
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

      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        count={batchModal.count}
        actionLabel={batchModal.label}
        onClose={() => setBatchModal({ open: false, action: '', title: '', count: 0, label: '' })}
        onConfirm={handleConfirmBatchAction}
      />

      <ResetSeedModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetSeedConfirm}
      />
    </div>
  )
}
