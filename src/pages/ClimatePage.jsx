import React, { useState, useEffect, useCallback } from 'react'
import {
  getClimateSummary,
  listColdStorages,
  createColdStorage,
  updateColdStorage,
  setFacilityStatus,
  listColdStorageBookings,
  allocateChamber,
  cancelColdStorageBooking,
  listClimateVarieties,
  createClimateVariety,
  updateClimateVariety,
  listCarbonAudits,
  disburseCarbonPayout,
  listProduceGradings,
  overrideGrading,
  getClimateAuditLogs
} from '../api/climateApi'
import {
  ClimateMetricBar,
  ClimateTabSwitch,
  ClimateFiltersBar,
  ColdStoragesTable,
  ColdStorageBookingsTable,
  ClimateVarietiesTable,
  CarbonAuditsTable,
  ProduceGradingsTable,
  ClimateAuditLogsTable,
  ContentPagination
} from './climateWidgets'
import ClimateDetailDrawer from '../components/climate/ClimateDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  CreateEditFacilityModal,
  CreateEditVarietyModal,
  OverrideGradingModal,
  ChamberAllocationModal
} from '../components/climate/ClimateModals'
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

export default function ClimatePage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' } }

  const [activeTab, setActiveTab] = useState('facilities') // 'facilities', 'bookings', 'varieties', 'carbon', 'gradings', 'audit'
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
  const [facilityModal, setFacilityModal] = useState({ open: false, facility: null })
  const [varietyModal, setVarietyModal] = useState({ open: false, variety: null })
  const [gradingModal, setGradingModal] = useState({ open: false, grading: null })
  const [chamberModal, setChamberModal] = useState({ open: false, booking: null })

  // Confirmation Dialog & Dual Sign-off
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
      const res = await getClimateSummary()
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
        case 'facilities':
          query.district = subFilter
          res = await listColdStorages(query)
          break
        case 'bookings':
          query.facilityId = subFilter
          res = await listColdStorageBookings(query)
          break
        case 'varieties':
          query.resilienceType = subFilter
          res = await listClimateVarieties(query)
          break
        case 'carbon':
          res = await listCarbonAudits(query)
          break
        case 'gradings':
          query.commodity = subFilter
          res = await listProduceGradings(query)
          break
        case 'audit':
          res = await getClimateAuditLogs(query)
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

  // Reset page when switching tabs or filters
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setSubFilter('all')
  }

  // Row selection for drawer
  const handleSelectRow = (row) => {
    setSelectedEntity(row)
    setDrawerOpen(true)
  }

  // --- Handlers for Facility Actions ---
  const handleSaveFacility = async (payload) => {
    try {
      if (facilityModal.facility) {
        await updateColdStorage(facilityModal.facility.id, payload, currentAdmin?.name)
        addToast?.('Cold storage facility updated successfully', 'success')
      } else {
        await createColdStorage(payload, currentAdmin?.name)
        addToast?.('New cold storage facility onboarded', 'success')
      }
      setFacilityModal({ open: false, facility: null })
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Operation failed: ' + err.message, 'error')
    }
  }

  const handleEditFacilityStatus = (facility) => {
    const nextStatus = facility.status === 'active' ? 'maintenance' : 'active'
    setConfirmDialog({
      open: true,
      title: `${nextStatus === 'maintenance' ? 'Set to Maintenance' : 'Activate Facility'}: ${facility.name}`,
      message: `Are you sure you want to transition facility status from "${facility.status}" to "${nextStatus}"? Administrative reason will be logged in the immutable audit trail.`,
      confirmLabel: 'Update Status',
      confirmVariant: nextStatus === 'maintenance' ? 'amber' : 'emerald',
      onConfirm: async (reason) => {
        try {
          await setFacilityStatus(facility.id, nextStatus, reason, currentAdmin?.name)
          addToast?.(`Facility status changed to ${nextStatus}`, 'success')
          setConfirmDialog({ open: false })
          fetchData()
          fetchSummary()
          if (drawerOpen && selectedEntity?.id === facility.id) {
            setSelectedEntity((prev) => ({ ...prev, status: nextStatus }))
          }
        } catch (err) {
          addToast?.('Status update failed: ' + err.message, 'error')
        }
      }
    })
  }

  // --- Handlers for Booking Actions ---
  const handleAllocateChamber = (booking) => {
    setChamberModal({ open: true, booking })
  }

  const handleConfirmChamberAllocation = async ({ chamberAllocated, reason }) => {
    try {
      await allocateChamber(chamberModal.booking.id, chamberAllocated, reason, currentAdmin?.name)
      addToast?.(`Allocated ${chamberAllocated} to booking #${chamberModal.booking.id}`, 'success')
      setChamberModal({ open: false, booking: null })
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Allocation failed: ' + err.message, 'error')
    }
  }

  const handleCancelBooking = (booking) => {
    const refundAmount = booking.paidAmount || booking.totalFee
    const isDualSignOff = refundAmount > 50000

    if (isDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Slot Cancellation & Refund: ${booking.farmerName}`,
        amount: refundAmount,
        details: `Booking #${booking.id} (${booking.cropType}, ${booking.quantityMt} MT). Release capacity back to facility and refund ₹${refundAmount.toLocaleString()} to farmer bank account.`,
        onConfirm: async (coAdminData) => {
          try {
            await cancelColdStorageBooking(
              booking.id,
              refundAmount,
              coAdminData.reason,
              coAdminData,
              currentAdmin?.name
            )
            addToast?.(`Booking cancelled and refund of ₹${refundAmount.toLocaleString()} executed with dual sign-off`, 'success')
            setDualSignOffDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === booking.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'cancelled', paymentStatus: 'refunded' }))
            }
          } catch (err) {
            addToast?.('Refund execution failed: ' + err.message, 'error')
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: `Cancel Booking #${booking.id}`,
        message: `Cancel storage slot reservation for ${booking.farmerName} (${booking.quantityMt} MT) and refund ₹${refundAmount.toLocaleString()}?`,
        confirmLabel: 'Cancel & Refund',
        confirmVariant: 'rose',
        onConfirm: async (reason) => {
          try {
            await cancelColdStorageBooking(booking.id, refundAmount, reason, null, currentAdmin?.name)
            addToast?.('Booking cancelled and slot capacity restored', 'success')
            setConfirmDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === booking.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'cancelled', paymentStatus: 'refunded' }))
            }
          } catch (err) {
            addToast?.('Cancellation failed: ' + err.message, 'error')
          }
        }
      })
    }
  }

  // --- Handlers for Variety Actions ---
  const handleSaveVariety = async (payload) => {
    try {
      if (varietyModal.variety) {
        await updateClimateVariety(varietyModal.variety.id, payload, currentAdmin?.name)
        addToast?.('Variety agronomic profile updated', 'success')
      } else {
        await createClimateVariety(payload, currentAdmin?.name)
        addToast?.('Certified climate-resilient variety registered', 'success')
      }
      setVarietyModal({ open: false, variety: null })
      fetchData()
      fetchSummary()
    } catch (err) {
      addToast?.('Variety registration failed: ' + err.message, 'error')
    }
  }

  // --- Handlers for Carbon Actions ---
  const handleDisburseCarbonPayout = (audit) => {
    const isDualSignOff = audit.netPayoutInr > 50000

    if (isDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Carbon Credit Payout: ${audit.farmerName}`,
        amount: audit.netPayoutInr,
        details: `Farmer ${audit.farmerName} (${audit.farmSizeAcres} Acres). Certified ${audit.estimatedCreditsMtCo2e} MT CO₂e sequestered via regenerative farming verified by ${audit.verifierAgency}.`,
        onConfirm: async (coAdminData) => {
          try {
            await disburseCarbonPayout(audit.id, coAdminData.reason, coAdminData, currentAdmin?.name)
            addToast?.(`Carbon payout of ₹${audit.netPayoutInr.toLocaleString()} disbursed with dual sign-off`, 'success')
            setDualSignOffDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === audit.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'disbursed' }))
            }
          } catch (err) {
            addToast?.('Carbon payout disbursement failed: ' + err.message, 'error')
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: `Disburse Carbon Payout: ${audit.farmerName}`,
        message: `Disburse net carbon credit earning of ₹${audit.netPayoutInr.toLocaleString()} to ${audit.farmerName}'s verified bank account?`,
        confirmLabel: 'Disburse Payout',
        confirmVariant: 'emerald',
        onConfirm: async (reason) => {
          try {
            await disburseCarbonPayout(audit.id, reason, null, currentAdmin?.name)
            addToast?.('Carbon payout disbursed successfully', 'success')
            setConfirmDialog({ open: false })
            fetchData()
            fetchSummary()
            if (drawerOpen && selectedEntity?.id === audit.id) {
              setSelectedEntity((prev) => ({ ...prev, status: 'disbursed' }))
            }
          } catch (err) {
            addToast?.('Payout disbursement failed: ' + err.message, 'error')
          }
        }
      })
    }
  }

  // --- Handlers for Produce Grading Override ---
  const handleOverrideGrading = (grading) => {
    setGradingModal({ open: true, grading })
  }

  const handleConfirmOverrideGrading = async ({ manualGrade, overrideNote, reason }) => {
    try {
      await overrideGrading(
        gradingModal.grading.id,
        manualGrade,
        overrideNote,
        reason,
        currentAdmin?.name
      )
      addToast?.(`Grade calibrated to "${manualGrade}"`, 'success')
      setGradingModal({ open: false, grading: null })
      fetchData()
      fetchSummary()
      if (drawerOpen && selectedEntity?.id === gradingModal.grading.id) {
        setSelectedEntity((prev) => ({
          ...prev,
          manualOverrideGrade: manualGrade,
          overrideNote,
          status: 'overridden'
        }))
      }
    } catch (err) {
      addToast?.('Grading calibration override failed: ' + err.message, 'error')
    }
  }

  // --- CSV Export ---
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast?.('No data to export', 'info')
      return
    }
    const csvContent = toCsv(tableData.data)
    downloadBlob(csvContent, `climate_${activeTab}_export_${Date.now()}.csv`)
    addToast?.(`Exported ${tableData.data.length} records to CSV`, 'success')
  }

  // Sub-filter options per tab
  const getSubFilterConfig = () => {
    switch (activeTab) {
      case 'facilities':
        return {
          label: 'District',
          options: [
            { label: 'Nashik', value: 'nashik' },
            { label: 'Pune', value: 'pune' },
            { label: 'Solapur', value: 'solapur' },
            { label: 'Jalgaon', value: 'jalgaon' },
            { label: 'Sangli', value: 'sangli' },
            { label: 'Ahmednagar', value: 'ahmednagar' }
          ]
        }
      case 'varieties':
        return {
          label: 'Resilience Trait',
          options: [
            { label: 'Drought Resilient', value: 'drought_tolerant' },
            { label: 'Heat Hardy', value: 'heat_resilient' },
            { label: 'Flood Submergence', value: 'flood_tolerant' },
            { label: 'Saline-Alkali Hardy', value: 'saline_tolerant' }
          ]
        }
      case 'gradings':
        return {
          label: 'Commodity',
          options: [
            { label: 'Pomegranate', value: 'pomegranate' },
            { label: 'Grapes', value: 'grapes' },
            { label: 'Onion', value: 'onion' },
            { label: 'Banana', value: 'banana' },
            { label: 'Tomato', value: 'tomato' }
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
      <ClimateMetricBar summary={summary} loading={loading && !summary} />

      {/* Tab Navigation */}
      <ClimateTabSwitch
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        counts={{
          facilities: summary?.activeFacilitiesCount,
          bookings: summary?.activeBookingsCount,
          varieties: summary?.certifiedVarietiesCount,
          carbon: summary?.flaggedCarbonAudits > 0 ? `${summary?.flaggedCarbonAudits} Flag` : undefined
        }}
      />

      {/* Filters Bar */}
      <ClimateFiltersBar
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
          activeTab === 'facilities'
            ? () => setFacilityModal({ open: true, facility: null })
            : activeTab === 'varieties'
            ? () => setVarietyModal({ open: true, variety: null })
            : null
        }
      />

      {/* Primary Data Grid */}
      {activeTab === 'facilities' && (
        <ColdStoragesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onEditStatus={handleEditFacilityStatus}
        />
      )}

      {activeTab === 'bookings' && (
        <ColdStorageBookingsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onAllocateChamber={handleAllocateChamber}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {activeTab === 'varieties' && (
        <ClimateVarietiesTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onEditVariety={(v) => setVarietyModal({ open: true, variety: v })}
        />
      )}

      {activeTab === 'carbon' && (
        <CarbonAuditsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onDisbursePayout={handleDisburseCarbonPayout}
        />
      )}

      {activeTab === 'gradings' && (
        <ProduceGradingsTable
          data={tableData.data}
          onSelectRow={handleSelectRow}
          onOverrideGrading={handleOverrideGrading}
        />
      )}

      {activeTab === 'audit' && (
        <ClimateAuditLogsTable data={tableData.data} />
      )}

      {/* Pagination */}
      <ContentPagination
        page={page}
        total={tableData.total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Detail Slide-Over Drawer */}
      <ClimateDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        onClose={() => setDrawerOpen(false)}
        onEditStatus={handleEditFacilityStatus}
        onAllocateChamber={handleAllocateChamber}
        onCancelBooking={handleCancelBooking}
        onDisbursePayout={handleDisburseCarbonPayout}
        onOverrideGrading={handleOverrideGrading}
      />

      {/* Modals */}
      <CreateEditFacilityModal
        isOpen={facilityModal.open}
        facility={facilityModal.facility}
        onClose={() => setFacilityModal({ open: false, facility: null })}
        onSave={handleSaveFacility}
      />

      <CreateEditVarietyModal
        isOpen={varietyModal.open}
        variety={varietyModal.variety}
        onClose={() => setVarietyModal({ open: false, variety: null })}
        onSave={handleSaveVariety}
      />

      <OverrideGradingModal
        isOpen={gradingModal.open}
        grading={gradingModal.grading}
        onClose={() => setGradingModal({ open: false, grading: null })}
        onConfirm={handleConfirmOverrideGrading}
      />

      <ChamberAllocationModal
        isOpen={chamberModal.open}
        booking={chamberModal.booking}
        onClose={() => setChamberModal({ open: false, booking: null })}
        onConfirm={handleConfirmChamberAllocation}
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
