import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Stethoscope,
  HeartPulse,
  Trees,
  Milk,
  Calendar,
  Truck,
  FileText,
  Activity,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  ShieldCheck,
  Zap,
  Coins,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw
} from 'lucide-react'
import {
  getLivestockSummary,
  listVets,
  createVet,
  verifyVet,
  batchUpdateVets,
  listGaushalas,
  createGaushala,
  auditGaushala,
  batchUpdateGaushalas,
  listNurseries,
  createNursery,
  approveNursery,
  batchUpdateNurseries,
  listDairyProducts,
  createDairyProduct,
  updateDairyProductStatus,
  batchUpdateDairyProducts,
  listVetBookings,
  createVetBooking,
  mediateVetBooking,
  listManureOrders,
  createManureOrder,
  signOffManureOrder,
  auditOrders,
  getLivestockAuditLogs,
  resetLivestockSeedData
} from '../api/livestockApi'
import {
  fmtINR,
  MetricCard,
  TabSwitch,
  FiltersBar,
  BatchActionBar,
  VetsTable,
  GaushalasTable,
  NurseriesTable,
  DairyProductsTable,
  VetBookingsTable,
  ManureOrdersTable,
  OrdersAuditTable,
  AuditLogTable,
  Pagination
} from './livestockWidgets'
import LivestockDetailDrawer from '../components/livestock/LivestockDetailDrawer'
import { PageContextBar } from '../components/layout/PageContextBar'
import {
  VerifyVetModal,
  AuditGaushalaModal,
  ApproveNurseryModal,
  DairyProductRecallModal,
  MediateVetBookingModal,
  DualSignOffManureModal,
  RegisterVetModal,
  RegisterGaushalaModal,
  RegisterNurseryModal,
  RegisterDairyProductModal,
  CreateVetBookingModal,
  CreateManureOrderModal,
  ResetSeedModal,
  BatchActionModal
} from '../components/livestock/LivestockModals'
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

export default function LivestockPage() {
  const { currentAdmin, actingStaff } = useAuthAdmin()
  const { showNotification } = useNotification()

  // RBAC Permission Check (SOP-19 §6.1)
  const isAuditor = currentAdmin?.id === 'FINANCIAL_AUDITOR' || currentAdmin?.role === 'Financial Auditor'
  const isSupport = currentAdmin?.id === 'SUPPORT_OPERATOR' || currentAdmin?.role === 'Support Operator'
  const canEdit = !isAuditor

  const [activeTab, setActiveTab] = useState('vets')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extraFilter, setExtraFilter] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState('all')
  const [personaFilter, setPersonaFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Multi-row Selection
  const [selectedIds, setSelectedIds] = useState([])

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [allVetsList, setAllVetsList] = useState([])
  const [allGaushalasList, setAllGaushalasList] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerEntity, setDrawerEntity] = useState(null)
  const [drawerType, setDrawerType] = useState('vet')

  // Action Modals
  const [verifyVetModalOpen, setVerifyVetModalOpen] = useState(false)
  const [selectedVet, setSelectedVet] = useState(null)

  const [auditGaushalaModalOpen, setAuditGaushalaModalOpen] = useState(false)
  const [selectedGaushala, setSelectedGaushala] = useState(null)

  const [approveNurseryModalOpen, setApproveNurseryModalOpen] = useState(false)
  const [selectedNursery, setSelectedNursery] = useState(null)

  const [dairyRecallModalOpen, setDairyRecallModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [mediateBookingModalOpen, setMediateBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [dualSignOffModalOpen, setDualSignOffModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Registration Modals
  const [registerVetModalOpen, setRegisterVetModalOpen] = useState(false)
  const [registerGaushalaModalOpen, setRegisterGaushalaModalOpen] = useState(false)
  const [registerNurseryModalOpen, setRegisterNurseryModalOpen] = useState(false)
  const [registerDairyModalOpen, setRegisterDairyModalOpen] = useState(false)
  const [createBookingModalOpen, setCreateBookingModalOpen] = useState(false)
  const [createManureModalOpen, setCreateManureModalOpen] = useState(false)
  const [resetSeedModalOpen, setResetSeedModalOpen] = useState(false)
  const [batchActionModalOpen, setBatchActionModalOpen] = useState(false)

  // Reset pagination & selection on tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setExtraFilter('all')
    setDateRangeFilter('all')
    setSelectedIds([])
  }

  // Load summary metrics
  const loadSummary = useCallback(async () => {
    try {
      const res = await getLivestockSummary()
      setSummary(res)
    } catch (err) {
      console.error('Failed to load summary:', err)
    }
  }, [])

  // Load active vets and gaushalas for dropdowns
  const loadLookups = useCallback(async () => {
    try {
      const [vetsRes, gshRes] = await Promise.all([
        listVets({ pageSize: 100 }),
        listGaushalas({ pageSize: 100 })
      ])
      setAllVetsList(vetsRes.data || [])
      setAllGaushalasList(gshRes.data || [])
    } catch (err) {
      console.error('Failed to fetch lookup lists:', err)
    }
  }, [])

  // Load active tab data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      if (activeTab === 'vets') {
        res = await listVets({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'gaushalas') {
        res = await listGaushalas({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'nurseries') {
        res = await listNurseries({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'dairy') {
        res = await listDairyProducts({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          category: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'bookings') {
        res = await listVetBookings({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'manure') {
        res = await listManureOrders({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          dualSignOff: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'orders_audit') {
        res = await auditOrders({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          type: extraFilter,
          dateRange: dateRangeFilter
        })
      } else if (activeTab === 'audit') {
        res = await getLivestockAuditLogs({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          dateRange: dateRangeFilter
        })
      }
      setTableData(res)
    } catch (err) {
      console.error('Failed to load table data:', err)
      showNotification('error', 'Data Load Error', 'Failed to fetch data records.')
    } finally {
      setLoading(false)
    }
  }, [activeTab, page, search, statusFilter, extraFilter, dateRangeFilter, showNotification])

  useEffect(() => {
    loadSummary()
    loadLookups()
  }, [loadSummary, loadLookups])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Multi-row Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const visibleIds = (tableData.data || []).map((r) => r.id)
    const allSelected = visibleIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // Drawer Opener
  const handleOpenDrawer = (entity, type) => {
    setDrawerEntity(entity)
    setDrawerType(type)
    setDrawerOpen(true)
  }

  // Drawer Action Forwarder
  const handleDrawerAction = (action, entity) => {
    setDrawerOpen(false)
    if (!canEdit) {
      showNotification('error', 'Permission Denied', 'Financial Auditor role has read-only access.')
      return
    }
    if (action === 'verify') {
      setSelectedVet(entity)
      setVerifyVetModalOpen(true)
    } else if (action === 'audit') {
      setSelectedGaushala(entity)
      setAuditGaushalaModalOpen(true)
    } else if (action === 'approve') {
      setSelectedNursery(entity)
      setApproveNurseryModalOpen(true)
    } else if (action === 'recall') {
      setSelectedProduct(entity)
      setDairyRecallModalOpen(true)
    } else if (action === 'mediate') {
      setSelectedBooking(entity)
      setMediateBookingModalOpen(true)
    } else if (action === 'signoff') {
      setSelectedOrder(entity)
      setDualSignOffModalOpen(true)
    }
  }

  // Contextual Add New
  const handleAddNew = () => {
    if (!canEdit) {
      showNotification('error', 'Permission Denied', 'Financial Auditor role has read-only access.')
      return
    }
    if (activeTab === 'vets') setRegisterVetModalOpen(true)
    else if (activeTab === 'gaushalas') setRegisterGaushalaModalOpen(true)
    else if (activeTab === 'nurseries') setRegisterNurseryModalOpen(true)
    else if (activeTab === 'dairy') setRegisterDairyModalOpen(true)
    else if (activeTab === 'bookings') setCreateBookingModalOpen(true)
    else if (activeTab === 'manure') setCreateManureModalOpen(true)
  }

  // Registration Handlers
  const handleRegisterVet = async (payload) => {
    setActionLoading(true)
    try {
      await createVet(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Veterinarian Onboarded', `${payload.name} registered successfully.`)
      setRegisterVetModalOpen(false)
      loadData()
      loadSummary()
      loadLookups()
    } catch (err) {
      showNotification('error', 'Registration Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRegisterGaushala = async (payload) => {
    setActionLoading(true)
    try {
      await createGaushala(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Gaushala Registered', `${payload.name} added to directory.`)
      setRegisterGaushalaModalOpen(false)
      loadData()
      loadSummary()
      loadLookups()
    } catch (err) {
      showNotification('error', 'Registration Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRegisterNursery = async (payload) => {
    setActionLoading(true)
    try {
      await createNursery(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Plant Nursery Empaneled', `${payload.name} added to catalog.`)
      setRegisterNurseryModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Empanelment Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRegisterDairy = async (payload) => {
    setActionLoading(true)
    try {
      await createDairyProduct(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Dairy SKU Added', `${payload.name} batch #${payload.batchNo} created.`)
      setRegisterDairyModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'SKU Creation Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCreateBooking = async (payload) => {
    setActionLoading(true)
    try {
      await createVetBooking(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Emergency Vet Dispatched', `Triage callout recorded for ${payload.farmerName}.`)
      setCreateBookingModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Dispatch Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCreateManure = async (payload) => {
    setActionLoading(true)
    try {
      await createManureOrder(payload, currentAdmin?.email || 'root@agrovercity')
      showNotification(
        payload.totalAmountINR > 50000 ? 'warning' : 'success',
        payload.totalAmountINR > 50000 ? 'Order Created (Dual Sign-off Required)' : 'Order Created',
        `Bulk order of ${payload.quantityMT} MT placed for ${payload.buyerName}.`
      )
      setCreateManureModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Order Creation Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Verify Vet Handler
  const handleVerifyVet = async (vetId, payload) => {
    setActionLoading(true)
    try {
      await verifyVet(vetId, payload)
      showNotification('success', 'Veterinarian Verified', 'Council registration authenticated.')
      setVerifyVetModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Verification Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Audit Gaushala Handler
  const handleAuditGaushala = async (gshId, payload) => {
    setActionLoading(true)
    try {
      await auditGaushala(gshId, payload)
      showNotification('success', 'Gaushala Audited', 'Bovine welfare audit logged successfully.')
      setAuditGaushalaModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Audit Error', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Approve Nursery Handler
  const handleApproveNursery = async (nurseryId, payload) => {
    setActionLoading(true)
    try {
      await approveNursery(nurseryId, payload)
      showNotification('success', 'Nursery Empaneled', 'NHB sapling distribution approved.')
      setApproveNurseryModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Approval Error', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Dairy Product Status / Recall Handler
  const handleDairyStatusUpdate = async (productId, payload) => {
    setActionLoading(true)
    try {
      await updateDairyProductStatus(productId, payload)
      showNotification(
        payload.status === 'recalled' ? 'warning' : 'success',
        payload.status === 'recalled' ? 'Batch Recalled' : 'Batch Cleared',
        payload.recallReason || 'Dairy laboratory clearance updated.'
      )
      setDairyRecallModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Status Update Error', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Mediate Vet Booking Handler
  const handleMediateBooking = async (bookingId, payload) => {
    setActionLoading(true)
    try {
      await mediateVetBooking(bookingId, payload)
      showNotification('success', 'Mediation Recorded', 'Booking state updated with escrow settlement.')
      setMediateBookingModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Mediation Error', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Dual Sign-Off Manure Handler
  const handleDualSignOff = async (orderId, payload) => {
    setActionLoading(true)
    try {
      await signOffManureOrder(orderId, payload)
      showNotification('success', 'Dual Sign-Off Completed', 'Manure dispatch authorization recorded.')
      setDualSignOffModalOpen(false)
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Sign-Off Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Batch Action Confirm
  const handleBatchActionConfirm = async (action, reason) => {
    setActionLoading(true)
    try {
      const adminUid = currentAdmin?.email || 'root@agrovercity'
      if (activeTab === 'vets') {
        await batchUpdateVets({ ids: selectedIds, action, reason, adminUid })
      } else if (activeTab === 'gaushalas') {
        await batchUpdateGaushalas({ ids: selectedIds, action, reason, adminUid })
      } else if (activeTab === 'nurseries') {
        await batchUpdateNurseries({ ids: selectedIds, action, reason, adminUid })
      } else if (activeTab === 'dairy') {
        await batchUpdateDairyProducts({ ids: selectedIds, action, reason, adminUid })
      }
      showNotification('success', 'Batch Update Applied', `Updated ${selectedIds.length} records.`)
      setBatchActionModalOpen(false)
      setSelectedIds([])
      loadData()
      loadSummary()
    } catch (err) {
      showNotification('error', 'Batch Update Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Reset Seed Confirm
  const handleResetSeedConfirm = async (reason) => {
    setActionLoading(true)
    try {
      await resetLivestockSeedData(reason, currentAdmin?.email || 'root@agrovercity')
      showNotification('success', 'Benchmark Seed Restored', 'All Module 19 target collections reset to default state.')
      setResetSeedModalOpen(false)
      loadData()
      loadSummary()
      loadLookups()
    } catch (err) {
      showNotification('error', 'Reset Failed', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Export CSV Handler
  const handleExportCsv = () => {
    const dataToExport = selectedIds.length > 0
      ? tableData.data.filter((r) => selectedIds.includes(r.id))
      : tableData.data

    const csvContent = toCsv(dataToExport)
    if (!csvContent) {
      showNotification('warning', 'Export Empty', 'No rows available for export.')
      return
    }
    const timestamp = new Date().toISOString().slice(0, 10)
    downloadBlob(csvContent, `agrovercity_livestock_${activeTab}_${timestamp}.csv`)
    showNotification('success', 'Export Complete', `Exported ${dataToExport.length} records to CSV.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Title / Context Bar */}
      <div className="px-6 pt-6">
        <PageContextBar
          title="Livestock, Dairy & Veterinary Services"
          sop="SOP-19"
          category="Animal Husbandry & Dairy"
          description="Veterinary network, bovine welfare audits, plant nursery accreditation, A2 lab testing, and bulk manure settlements."
          icon={Stethoscope}
          iconColor="emerald"
          isAuditor={isAuditor}
          isSupport={isSupport}
          currentAdmin={currentAdmin}
          auditorNotice="You have read-only access to transaction ledgers, bank records, and payout reports. State modification capabilities are disabled under SOP-19 §6.1."
        />
      </div>

      {/* Top Metric Bar */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Verified Vet Network"
          value={summary?.verifiedActiveVets || '162'}
          subtitle={`${summary?.totalRegisteredVets || '184'} Registered • ${summary?.pendingVetVerifications || '2'} Pending`}
          icon={Stethoscope}
          color="emerald"
        />
        <MetricCard
          title="Certified Gaushalas"
          value={summary?.certifiedGaushalas || '48'}
          subtitle={`${(summary?.totalCattleSheltered || 14850).toLocaleString()} Heads • ${summary?.monthlyManureProductionMT || 1240} MT Manure`}
          icon={HeartPulse}
          color="blue"
        />
        <MetricCard
          title="Emergency Vet Dispatches"
          value={summary?.todayEmergencyDispatches || '6'}
          subtitle="24x7 Critical Triage • Zero Fatalities Today"
          icon={Calendar}
          color="purple"
          alert={true}
        />
        <MetricCard
          title="Daily Manure Orders"
          value={fmtINR(summary?.todayManureOrdersINR || 270000)}
          subtitle={`${summary?.pendingDualSignOffs || '2'} Dual Sign-Offs Pending (> ₹50,000)`}
          icon={Truck}
          color="amber"
          alert={(summary?.pendingDualSignOffs || 0) > 0}
        />
      </div>

      {/* Main Content Area */}
      <div className="mx-6 rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        {/* Tab Navigation */}
        <TabSwitch
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={{
            vets: summary?.totalRegisteredVets || 8,
            gaushalas: summary?.certifiedGaushalas || 7,
            nurseries: summary?.approvedNurseries || 6,
            dairy: summary?.activeDairySkus || 8,
            bookings: 8,
            emergencyCount: summary?.todayEmergencyDispatches || 2,
            manure: summary?.todayManureOrdersINR ? 8 : 8,
            pendingDualSignOffs: summary?.pendingDualSignOffs || 2,
            ordersAudit: summary?.totalOrdersAudit || 16,
            audit: summary?.totalAuditLogs || 6
          }}
        />

        {/* Filter Controls Bar */}
        <FiltersBar
          activeTab={activeTab}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          extraFilter={extraFilter}
          onExtraFilterChange={setExtraFilter}
          dateRangeFilter={dateRangeFilter}
          onDateRangeChange={setDateRangeFilter}
          personaFilter={personaFilter}
          onPersonaChange={setPersonaFilter}
          onRefresh={loadData}
          onExport={handleExportCsv}
          onAddNew={handleAddNew}
          onResetSeed={() => setResetSeedModalOpen(true)}
          loading={loading}
          canEdit={canEdit}
        />

        {/* Multi-row Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedIds.length}
          targetType={activeTab}
          onBatchAction={() => setBatchActionModalOpen(true)}
          onClearSelection={handleClearSelection}
        />

        {/* Primary Data Grid */}
        <div className="p-0">
          {activeTab === 'vets' && (
            <VetsTable
              rows={tableData.data}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              canEdit={canEdit}
              onView={(vet) => handleOpenDrawer(vet, 'vet')}
              onVerify={(vet) => {
                setSelectedVet(vet)
                setVerifyVetModalOpen(true)
              }}
              onSuspend={(vet) => {
                handleVerifyVet(vet.id, {
                  status: 'suspended',
                  reason: 'Administrative temporary suspension pending license renewal.'
                })
              }}
            />
          )}

          {activeTab === 'gaushalas' && (
            <GaushalasTable
              rows={tableData.data}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              canEdit={canEdit}
              onView={(gsh) => handleOpenDrawer(gsh, 'gaushala')}
              onAudit={(gsh) => {
                setSelectedGaushala(gsh)
                setAuditGaushalaModalOpen(true)
              }}
            />
          )}

          {activeTab === 'nurseries' && (
            <NurseriesTable
              rows={tableData.data}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              canEdit={canEdit}
              onView={(nursery) => handleOpenDrawer(nursery, 'nursery')}
              onApprove={(nursery) => {
                setSelectedNursery(nursery)
                setApproveNurseryModalOpen(true)
              }}
            />
          )}

          {activeTab === 'dairy' && (
            <DairyProductsTable
              rows={tableData.data}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              canEdit={canEdit}
              onView={(product) => handleOpenDrawer(product, 'dairy')}
              onClearLab={(product) => {
                setSelectedProduct(product)
                setDairyRecallModalOpen(true)
              }}
              onRecall={(product) => {
                setSelectedProduct(product)
                setDairyRecallModalOpen(true)
              }}
            />
          )}

          {activeTab === 'bookings' && (
            <VetBookingsTable
              rows={tableData.data}
              canEdit={canEdit}
              onView={(booking) => handleOpenDrawer(booking, 'booking')}
              onMediate={(booking) => {
                setSelectedBooking(booking)
                setMediateBookingModalOpen(true)
              }}
            />
          )}

          {activeTab === 'manure' && (
            <ManureOrdersTable
              rows={tableData.data}
              canEdit={canEdit}
              onView={(order) => handleOpenDrawer(order, 'manure')}
              onSignOff={(order) => {
                setSelectedOrder(order)
                setDualSignOffModalOpen(true)
              }}
            />
          )}

          {activeTab === 'orders_audit' && (
            <OrdersAuditTable
              rows={tableData.data}
              onView={(entity) => {
                if (!entity) return
                if (entity.itemType === 'dairy' || entity.brandOrGaushala || entity.category) {
                  handleOpenDrawer(entity.raw || entity, 'dairy')
                } else {
                  handleOpenDrawer(entity.raw || entity, 'manure')
                }
              }}
            />
          )}

          {activeTab === 'audit' && <AuditLogTable rows={tableData.data} />}
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={tableData.total}
          onPageChange={setPage}
        />
      </div>

      {/* Slide-over Detail Drawer */}
      <LivestockDetailDrawer
        isOpen={drawerOpen}
        entity={drawerEntity}
        type={drawerType}
        canEdit={canEdit}
        onClose={() => setDrawerOpen(false)}
        onAction={handleDrawerAction}
      />

      {/* Action Modals */}
      <VerifyVetModal
        isOpen={verifyVetModalOpen}
        onClose={() => setVerifyVetModalOpen(false)}
        vet={selectedVet}
        onSubmit={handleVerifyVet}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <AuditGaushalaModal
        isOpen={auditGaushalaModalOpen}
        onClose={() => setAuditGaushalaModalOpen(false)}
        gaushala={selectedGaushala}
        onSubmit={handleAuditGaushala}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <ApproveNurseryModal
        isOpen={approveNurseryModalOpen}
        onClose={() => setApproveNurseryModalOpen(false)}
        nursery={selectedNursery}
        onSubmit={handleApproveNursery}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <DairyProductRecallModal
        isOpen={dairyRecallModalOpen}
        onClose={() => setDairyRecallModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleDairyStatusUpdate}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <MediateVetBookingModal
        isOpen={mediateBookingModalOpen}
        onClose={() => setMediateBookingModalOpen(false)}
        booking={selectedBooking}
        onSubmit={handleMediateBooking}
        loading={actionLoading}
        activeVets={allVetsList}
        currentAdmin={currentAdmin}
      />

      <DualSignOffManureModal
        isOpen={dualSignOffModalOpen}
        onClose={() => setDualSignOffModalOpen(false)}
        order={selectedOrder}
        onSubmit={handleDualSignOff}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      {/* Registration Modals */}
      <RegisterVetModal
        isOpen={registerVetModalOpen}
        onClose={() => setRegisterVetModalOpen(false)}
        onSubmit={handleRegisterVet}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <RegisterGaushalaModal
        isOpen={registerGaushalaModalOpen}
        onClose={() => setRegisterGaushalaModalOpen(false)}
        onSubmit={handleRegisterGaushala}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <RegisterNurseryModal
        isOpen={registerNurseryModalOpen}
        onClose={() => setRegisterNurseryModalOpen(false)}
        onSubmit={handleRegisterNursery}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <RegisterDairyProductModal
        isOpen={registerDairyModalOpen}
        onClose={() => setRegisterDairyModalOpen(false)}
        onSubmit={handleRegisterDairy}
        loading={actionLoading}
        currentAdmin={currentAdmin}
      />

      <CreateVetBookingModal
        isOpen={createBookingModalOpen}
        onClose={() => setCreateBookingModalOpen(false)}
        onSubmit={handleCreateBooking}
        loading={actionLoading}
        activeVets={allVetsList}
        currentAdmin={currentAdmin}
      />

      <CreateManureOrderModal
        isOpen={createManureModalOpen}
        onClose={() => setCreateManureModalOpen(false)}
        onSubmit={handleCreateManure}
        loading={actionLoading}
        gaushalas={allGaushalasList}
        currentAdmin={currentAdmin}
      />

      {/* Batch Action Modal */}
      <BatchActionModal
        isOpen={batchActionModalOpen}
        onClose={() => setBatchActionModalOpen(false)}
        selectedCount={selectedIds.length}
        targetType={activeTab}
        onConfirm={handleBatchActionConfirm}
        loading={actionLoading}
      />

      {/* Reset Seed Modal */}
      <ResetSeedModal
        isOpen={resetSeedModalOpen}
        onClose={() => setResetSeedModalOpen(false)}
        onConfirm={handleResetSeedConfirm}
        loading={actionLoading}
      />
    </div>
  )
}
