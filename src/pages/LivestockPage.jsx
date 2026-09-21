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
  Sparkles
} from 'lucide-react'
import {
  getLivestockSummary,
  listVets,
  verifyVet,
  listGaushalas,
  auditGaushala,
  listNurseries,
  approveNursery,
  listDairyProducts,
  updateDairyProductStatus,
  listVetBookings,
  mediateVetBooking,
  listManureOrders,
  signOffManureOrder,
  getLivestockAuditLogs
} from '../api/livestockApi'
import {
  fmtINR,
  MetricCard,
  TabSwitch,
  FiltersBar,
  VetsTable,
  GaushalasTable,
  NurseriesTable,
  DairyProductsTable,
  VetBookingsTable,
  ManureOrdersTable,
  AuditLogTable,
  Pagination
} from './livestockWidgets'
import LivestockDetailDrawer from '../components/livestock/LivestockDetailDrawer'
import {
  VerifyVetModal,
  AuditGaushalaModal,
  ApproveNurseryModal,
  DairyProductRecallModal,
  MediateVetBookingModal,
  DualSignOffManureModal
} from '../components/livestock/LivestockModals'
import { useNotification } from '../context/NotificationContext'

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
  const [activeTab, setActiveTab] = useState('vets')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extraFilter, setExtraFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [allVetsList, setAllVetsList] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerEntity, setDrawerEntity] = useState(null)
  const [drawerType, setDrawerType] = useState('vet')

  // Modals
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

  const { showNotification } = useNotification()

  // Reset pagination & filters on tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setExtraFilter('all')
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

  // Load active vets cache for mediation re-assignment
  const loadAllVets = useCallback(async () => {
    try {
      const res = await listVets({ pageSize: 100 })
      setAllVetsList(res.data || [])
    } catch (err) {
      console.error('Failed to fetch vets list:', err)
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
          district: extraFilter
        })
      } else if (activeTab === 'gaushalas') {
        res = await listGaushalas({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter
        })
      } else if (activeTab === 'nurseries') {
        res = await listNurseries({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter
        })
      } else if (activeTab === 'dairy') {
        res = await listDairyProducts({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          category: extraFilter
        })
      } else if (activeTab === 'bookings') {
        res = await listVetBookings({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          district: extraFilter
        })
      } else if (activeTab === 'manure') {
        res = await listManureOrders({
          page,
          pageSize: PAGE_SIZE,
          q: search,
          status: statusFilter,
          dualSignOff: extraFilter
        })
      } else if (activeTab === 'audit') {
        const list = await getLivestockAuditLogs()
        res = { data: list, total: list.length }
      }
      setTableData(res)
    } catch (err) {
      console.error('Failed to load table data:', err)
      showNotification('error', 'Data Load Error', 'Failed to fetch data records.')
    } finally {
      setLoading(false)
    }
  }, [activeTab, page, search, statusFilter, extraFilter, showNotification])

  useEffect(() => {
    loadSummary()
    loadAllVets()
  }, [loadSummary, loadAllVets])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Drawer Opener
  const handleOpenDrawer = (entity, type) => {
    setDrawerEntity(entity)
    setDrawerType(type)
    setDrawerOpen(true)
  }

  // Drawer Action Forwarder
  const handleDrawerAction = (action, entity) => {
    setDrawerOpen(false)
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

  // Export CSV Handler
  const handleExportCsv = () => {
    const csvContent = toCsv(tableData.data)
    if (!csvContent) {
      showNotification('warning', 'Export Empty', 'No rows available for export.')
      return
    }
    const timestamp = new Date().toISOString().slice(0, 10)
    downloadBlob(csvContent, `agrovercity_livestock_${activeTab}_${timestamp}.csv`)
    showNotification('success', 'Export Complete', `Exported ${tableData.data.length} records to CSV.`)
  }

  return (
    <div className="space-y-4">
      {/* Top Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
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
            manure: 8,
            pendingDualSignOffs: summary?.pendingDualSignOffs || 2,
            audit: 5
          }}
        />

        {/* Filter Controls Bar */}
        <div className="p-3 border-b border-slate-800">
          <FiltersBar
            activeTab={activeTab}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            extraFilter={extraFilter}
            onExtraFilterChange={setExtraFilter}
            onRefresh={loadData}
            onExport={handleExportCsv}
            loading={loading}
          />
        </div>

        {/* Primary Data Grid */}
        <div className="p-0">
          {activeTab === 'vets' && (
            <VetsTable
              rows={tableData.data}
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
              onView={(order) => handleOpenDrawer(order, 'manure')}
              onSignOff={(order) => {
                setSelectedOrder(order)
                setDualSignOffModalOpen(true)
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
      />

      <AuditGaushalaModal
        isOpen={auditGaushalaModalOpen}
        onClose={() => setAuditGaushalaModalOpen(false)}
        gaushala={selectedGaushala}
        onSubmit={handleAuditGaushala}
        loading={actionLoading}
      />

      <ApproveNurseryModal
        isOpen={approveNurseryModalOpen}
        onClose={() => setApproveNurseryModalOpen(false)}
        nursery={selectedNursery}
        onSubmit={handleApproveNursery}
        loading={actionLoading}
      />

      <DairyProductRecallModal
        isOpen={dairyRecallModalOpen}
        onClose={() => setDairyRecallModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleDairyStatusUpdate}
        loading={actionLoading}
      />

      <MediateVetBookingModal
        isOpen={mediateBookingModalOpen}
        onClose={() => setMediateBookingModalOpen(false)}
        booking={selectedBooking}
        onSubmit={handleMediateBooking}
        loading={actionLoading}
        activeVets={allVetsList}
      />

      <DualSignOffManureModal
        isOpen={dualSignOffModalOpen}
        onClose={() => setDualSignOffModalOpen(false)}
        order={selectedOrder}
        onSubmit={handleDualSignOff}
        loading={actionLoading}
      />
    </div>
  )
}
