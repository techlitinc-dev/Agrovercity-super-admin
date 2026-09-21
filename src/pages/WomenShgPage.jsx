import React, { useState, useEffect, useCallback } from 'react'
import {
  getWomenShgSummary,
  listWomenShgs,
  verifyWomenShg,
  suspendWomenShg,
  listShgDeposits,
  recordShgDeposit,
  listHomeEnterprises,
  curateEnterpriseProduct,
  listShgSubsidies,
  disburseSubventionSubsidy,
  getWomenAuditLogs
} from '../api/womenShgApi'
import {
  WomenMetricBar,
  WomenShgTabSwitch,
  WomenShgFiltersBar,
  WomenShgsTable,
  ShgDepositsTable,
  HomeEnterprisesTable,
  ShgSubsidiesTable,
  WomenAuditLogsTable,
  ContentPagination
} from './womenShgWidgets'
import WomenShgDetailDrawer from '../components/women-shg/WomenShgDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  VerifyShgModal,
  CurateProductModal,
  RecordDepositModal
} from '../components/women-shg/WomenShgModals'
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

export default function WomenShgPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' } }

  const [activeTab, setActiveTab] = useState('shgs') // 'shgs', 'deposits', 'enterprises', 'subsidies', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [verifyModal, setVerifyModal] = useState({ open: false, shg: null })
  const [curateModal, setCurateModal] = useState({ open: false, product: null })
  const [depositModal, setDepositModal] = useState({ open: false })

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
        status: statusFilter
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
  }, [activeTab, page, search, statusFilter, subFilter, addToast])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setSubFilter('all')
  }

  const handleSelectRow = (row) => {
    setSelectedEntity(row)
    setDrawerOpen(true)
  }

  // --- Handlers for SHG Actions ---
  const handleVerifyShg = (shg) => {
    setVerifyModal({ open: true, shg })
  }

  const handleConfirmVerifyShg = async ({ grantEligibility, reason }) => {
    try {
      await verifyWomenShg(verifyModal.shg.id, grantEligibility, reason, currentAdmin?.name)
      addToast?.(`SHG ${verifyModal.shg.shgName} verified and eligibility set`, 'success')
      setVerifyModal({ open: false, shg: null })
      fetchData()
      fetchSummary()
      if (drawerOpen && selectedEntity?.id === verifyModal.shg.id) {
        setSelectedEntity((prev) => ({
          ...prev,
          status: 'verified',
          subventionEligibility: grantEligibility
        }))
      }
    } catch (err) {
      addToast?.('Verification failed: ' + err.message, 'error')
    }
  }

  const handleSuspendShg = (shg) => {
    setConfirmDialog({
      open: true,
      title: `Suspend SHG: ${shg.shgName}`,
      message: `Are you sure you want to suspend "${shg.shgName}" (${shg.village}, ${shg.district})? Subvention eligibility and internal lending permissions will be frozen. Administrative reason is required.`,
      confirmLabel: 'Suspend SHG',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await suspendWomenShg(shg.id, reason, currentAdmin?.name)
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

  // --- Handlers for Product Curation ---
  const handleCurateProduct = (product) => {
    setCurateModal({ open: true, product })
  }

  const handleConfirmCurateProduct = async ({ status, curationNotes, reason }) => {
    try {
      await curateEnterpriseProduct(curateModal.product.id, status, curationNotes, reason, currentAdmin?.name)
      addToast?.(`Product status updated to ${status}`, 'success')
      setCurateModal({ open: false, product: null })
      fetchData()
      fetchSummary()
      if (drawerOpen && selectedEntity?.id === curateModal.product.id) {
        setSelectedEntity((prev) => ({ ...prev, status, curationNotes }))
      }
    } catch (err) {
      addToast?.('Curation failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for Subvention Grants ---
  const handleDisburseSubsidy = (subsidy) => {
    const isDualSignOff = subsidy.amountInr > 50000

    if (isDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize NRLM Grant Disbursement: ${subsidy.shgName}`,
        amount: subsidy.amountInr,
        details: `Disbursing ${subsidy.schemeName} to ${subsidy.shgName} Bank Account. Mandates dual institutional co-authorizer sign-off.`,
        onConfirm: async (coAdminData) => {
          try {
            await disburseSubventionSubsidy(
              subsidy.id,
              coAdminData.reason,
              coAdminData,
              currentAdmin?.name
            )
            addToast?.(
              `Grant of ₹${subsidy.amountInr.toLocaleString()} successfully credited with dual sign-off`,
              'success'
            )
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
        message: `Disburse ${subsidy.schemeName} of ₹${subsidy.amountInr.toLocaleString()} to beneficiary SHG bank account?`,
        confirmLabel: 'Disburse Grant',
        confirmVariant: 'emerald',
        onConfirm: async (reason) => {
          try {
            await disburseSubventionSubsidy(subsidy.id, reason, null, currentAdmin?.name)
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

  // --- Handlers for Manual Deposit Post ---
  const handleSaveDeposit = async (payload) => {
    try {
      await recordShgDeposit(payload, currentAdmin?.name)
      addToast?.('Monthly micro-savings deposit recorded into SHG ledger', 'success')
      setDepositModal({ open: false })
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Deposit failed: ' + err.message, 'error')
    }
  }

  // --- CSV Export ---
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast?.('No data to export', 'info')
      return
    }
    const csvContent = toCsv(tableData.data)
    downloadBlob(csvContent, `women_shg_${activeTab}_export_${Date.now()}.csv`)
    addToast?.(`Exported ${tableData.data.length} records to CSV`, 'success')
  }

  // Sub-filter options per tab
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
            { label: 'Sangli', value: 'sangli' },
            { label: 'Pune', value: 'pune' },
            { label: 'Chhatrapati Sambhajinagar', value: 'chhatrapati sambhajinagar' },
            { label: 'Nagpur', value: 'nagpur' }
          ]
        }
      case 'enterprises':
        return {
          label: 'Category',
          options: [
            { label: 'Pickles & Chutneys', value: 'pickles & chutneys' },
            { label: 'Papad & Snacks', value: 'papad & snacks' },
            { label: 'Spices & Masalas', value: 'spices & masalas' },
            { label: 'Cold-Pressed Oils', value: 'cold-pressed oils' },
            { label: 'Organic Millets & Flours', value: 'organic millets & flours' },
            { label: 'Handlooms & Handicrafts', value: 'handlooms & handicrafts' }
          ]
        }
      default:
        return { label: '', options: [] }
    }
  }

  const subConfig = getSubFilterConfig()

  return (
    <div className="space-y-6">
      {/* Top Metric Bar */}
      <WomenMetricBar summary={summary} loading={loading && !summary} />

      {/* Tab Navigation */}
      <WomenShgTabSwitch
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        counts={{
          shgs: summary?.totalActiveShgs,
          enterprises: summary?.activeStorefrontProducts,
          subsidies: summary?.pendingVerificationShgs > 0 ? `${summary?.pendingVerificationShgs} Queue` : undefined
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
        activeTab={activeTab}
        onRefresh={() => {
          fetchData()
          fetchSummary()
        }}
        onExportCsv={handleExportCsv}
        onAddNew={
          activeTab === 'deposits'
            ? () => setDepositModal({ open: true })
            : null
        }
      />

      {/* Primary Data Grid */}
      {activeTab === 'shgs' && (
        <WomenShgsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onVerifyShg={handleVerifyShg}
          onSuspendShg={handleSuspendShg}
        />
      )}

      {activeTab === 'deposits' && (
        <ShgDepositsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
        />
      )}

      {activeTab === 'enterprises' && (
        <HomeEnterprisesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onCurateProduct={handleCurateProduct}
        />
      )}

      {activeTab === 'subsidies' && (
        <ShgSubsidiesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onDisburseSubsidy={handleDisburseSubsidy}
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
      />

      {/* Modals */}
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
        shgs={tableData.data?.filter?.((item) => item.shgName) || []}
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
    </div>
  )
}
