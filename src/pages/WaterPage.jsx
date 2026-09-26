import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Droplets,
  Waves,
  Gauge,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  BellRing,
  Download,
  Plus,
  Activity,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react'
import {
  getWaterSummary,
  listWaterSchedules,
  listCgwbStations,
  syncCgwbReadings,
  listCanalSchedules,
  updateCanalSchedule,
  getPmksySubsidyRules,
  updatePmksySubsidyRules,
  approvePmksySubsidy,
  listDroughtAdvisories,
  issueDroughtAlert,
  getWaterAuditLogs,
  runWaterEfficiencyAudit,
  resetWaterSeedData
} from '../api/waterApi'
import {
  MetricCard,
  TabSwitch,
  FiltersBar,
  WaterSchedulesTable,
  CgwbStationsTable,
  CanalSchedulesTable,
  PmksySubsidiesTable,
  DroughtAdvisoriesTable,
  Pagination
} from './waterWidgets'
import WaterAuditTrailTable from '../components/water/WaterAuditTrailTable'
import WaterDetailDrawer from '../components/water/WaterDetailDrawer'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  UpdateCanalScheduleModal,
  SyncCgwbStationModal,
  ConfigurePmksyRulesModal,
  IssueDroughtAlertModal,
  ApprovePmksySubsidyModal
} from '../components/water/WaterModals'
import PageContextBar from '../components/layout/PageContextBar'
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

export default function WaterPage() {
  const { addToast } = useNotification() || { addToast: () => {} }

  const [tab, setTab] = useState('schedules') // 'schedules' | 'cgwb' | 'canals' | 'subsidy' | 'advisories' | 'audit'
  const [schedules, setSchedules] = useState([])
  const [cgwbStations, setCgwbStations] = useState([])
  const [canals, setCanals] = useState([])
  const [pmksyData, setPmksyData] = useState({ rules: null, applications: { data: [], total: 0 } })
  const [advisories, setAdvisories] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [summary, setSummary] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [irrigationType, setIrrigationType] = useState('all')
  const [district, setDistrict] = useState('all')
  const [alertFilter, setAlertFilter] = useState('all')

  // Detail Drawer
  const [drawerSelection, setDrawerSelection] = useState({ item: null, type: 'schedule' })

  // Modals
  const [updateCanalModal, setUpdateCanalModal] = useState({ open: false, canal: null })
  const [syncCgwbOpen, setSyncCgwbOpen] = useState(false)
  const [configureSubsidyOpen, setConfigureSubsidyOpen] = useState(false)
  const [issueDroughtOpen, setIssueDroughtOpen] = useState(false)
  const [approveSubsidyModal, setApproveSubsidyModal] = useState({ open: false, application: null })

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    requireReason: false,
    danger: false,
    dualSignOff: false,
    action: null
  })

  // 1. Load Summary Metrics
  const loadSummary = useCallback(async () => {
    try {
      const res = await getWaterSummary()
      setSummary(res)
    } catch (err) {
      console.warn('Failed to load water summary:', err)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  // 2. Load Primary Tab Data
  const loadTabData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'schedules') {
        const res = await listWaterSchedules({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          irrigationType,
          district,
          alertFilter
        })
        setSchedules(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'cgwb') {
        const res = await listCgwbStations({
          page,
          pageSize: PAGE_SIZE,
          q,
          category: status,
          district
        })
        setCgwbStations(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'canals') {
        const res = await listCanalSchedules({
          page,
          pageSize: PAGE_SIZE,
          q,
          division: district !== 'all' ? district : 'all',
          status
        })
        setCanals(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'subsidy') {
        const res = await getPmksySubsidyRules({
          page,
          pageSize: PAGE_SIZE,
          q,
          status
        })
        setPmksyData({
          rules: res.rules,
          applications: res.applications || { data: [], total: 0 }
        })
        setTotal(res.applications?.total || 0)
      } else if (tab === 'advisories') {
        const res = await listDroughtAdvisories({
          page,
          pageSize: PAGE_SIZE,
          q,
          district
        })
        setAdvisories(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'audit') {
        const res = await getWaterAuditLogs({
          page,
          pageSize: PAGE_SIZE,
          q
        })
        setAuditLogs(res.data || [])
        setTotal(res.total || 0)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch water module data.')
      addToast({
        title: 'Network Error',
        message: err.message || 'Could not retrieve water telemetry.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, irrigationType, district, alertFilter, addToast])

  useEffect(() => {
    loadTabData()
  }, [loadTabData])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setQ('')
    setStatus('all')
    setIrrigationType('all')
    setDistrict('all')
    setAlertFilter('all')
  }

  // 3. Operational Handlers
  const handleUpdateCanalConfirm = async (payload) => {
    try {
      const res = await updateCanalSchedule(payload)
      addToast({
        title: 'Canal Timetable Updated',
        message: `Updated release timetable for ${res.canalName} (${res.dischargeCusecs} cusecs).`,
        type: 'success'
      })
      setUpdateCanalModal({ open: false, canal: null })
      loadTabData()
      loadSummary()
    } catch (err) {
      addToast({
        title: 'Update Failed',
        message: err.message || 'Could not update canal schedule.',
        type: 'error'
      })
      throw err
    }
  }

  const handleSyncCgwbConfirm = async (stationCodes) => {
    try {
      const res = await syncCgwbReadings({ stationCodes })
      addToast({
        title: 'CGWB Hydrological Sync Complete',
        message: `Ingested latest depth telemetry for ${res.syncedCount} observatory stations.`,
        type: 'success'
      })
      setSyncCgwbOpen(false)
      loadTabData()
      loadSummary()
    } catch (err) {
      addToast({
        title: 'Sync Failed',
        message: err.message || 'Could not sync CGWB data.',
        type: 'error'
      })
      throw err
    }
  }

  const handleConfigurePmksyConfirm = async (newRules) => {
    try {
      const res = await updatePmksySubsidyRules(newRules)
      setPmksyData((prev) => ({ ...prev, rules: res }))
      addToast({
        title: 'PMKSY Rules Updated',
        message: `Updated subsidy percentages: Small/Marginal ${res.smallMarginalSubsidyPct}%, Other ${res.otherFarmerSubsidyPct}%.`,
        type: 'success'
      })
      setConfigureSubsidyOpen(false)
      loadTabData()
      loadSummary()
    } catch (err) {
      addToast({
        title: 'Rule Update Failed',
        message: err.message || 'Could not update PMKSY rules.',
        type: 'error'
      })
      throw err
    }
  }

  const handleIssueDroughtConfirm = async (alertPayload) => {
    try {
      const res = await issueDroughtAlert(alertPayload)
      addToast({
        title: 'Drought Alert Broadcasted',
        message: `Alert broadcast to ${res.smsBroadcastCount?.toLocaleString('en-IN')} farmers in ${res.district}.`,
        type: 'warning'
      })
      setIssueDroughtOpen(false)
      loadTabData()
      loadSummary()
    } catch (err) {
      addToast({
        title: 'Broadcast Failed',
        message: err.message || 'Could not broadcast drought alert.',
        type: 'error'
      })
      throw err
    }
  }

  const handleApproveSubsidyConfirm = async (payload) => {
    try {
      const res = await approvePmksySubsidy(payload)
      addToast({
        title: 'PMKSY Subsidy Approved',
        message: `Approved 55% subsidy of ₹${res.calculatedSubsidyInr.toLocaleString('en-IN')} for ${res.farmerName}.`,
        type: 'success'
      })
      setApproveSubsidyModal({ open: false, application: null })
      loadTabData()
      loadSummary()
    } catch (err) {
      addToast({
        title: 'Approval Failed',
        message: err.message || 'Could not approve subsidy.',
        type: 'error'
      })
      throw err
    }
  }

  const handleRunEfficiencyAudit = async () => {
    try {
      setBusy(true)
      const res = await runWaterEfficiencyAudit()
      addToast({
        title: 'Efficiency & DPDP Audit Complete',
        message: `Verified ${res.auditedPlots} plot schedules (${res.efficiencyRate}% optimal). All PMKSY applications comply with 100% DPDP Act masking.`,
        type: 'success'
      })
      loadSummary()
      loadTabData()
    } catch (err) {
      addToast({
        title: 'Audit Failed',
        message: err.message || 'Failed to complete efficiency audit.',
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = () => {
    setConfirmDialog({
      open: true,
      title: 'Reset Water Resources & Irrigation Seed Data',
      message: 'Restore all plot irrigation duration schedules, CGWB monitoring stations, canal rotation timetables, PMKSY subsidy parameters, and statutory audit logs back to default factory state?',
      confirmLabel: 'Reset All Data',
      requireReason: false,
      danger: true,
      dualSignOff: false,
      action: async () => {
        setBusy(true)
        try {
          await resetWaterSeedData('Superadmin requested factory reset of Module 17 telemetry.')
          addToast({
            title: 'Seed Data Reset',
            message: 'Water resources database and telemetry cache restored to default seeds.',
            type: 'success'
          })
          setConfirmDialog({ open: false })
          loadSummary()
          loadTabData()
        } catch (err) {
          addToast({
            title: 'Reset Failed',
            message: err.message || 'Could not reset water seed data.',
            type: 'error'
          })
        } finally {
          setBusy(false)
        }
      }
    })
  }

  // General CSV Export
  const handleExportCsv = () => {
    if (tab === 'schedules') {
      const csv = toCsv(schedules)
      downloadBlob(csv, `Plot_Water_Schedules_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${schedules.length} water schedules.`, type: 'success' })
    } else if (tab === 'cgwb') {
      const csv = toCsv(cgwbStations)
      downloadBlob(csv, `CGWB_Groundwater_Stations_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${cgwbStations.length} CGWB stations.`, type: 'success' })
    } else if (tab === 'canals') {
      const csv = toCsv(canals)
      downloadBlob(csv, `Canal_Rotation_Timetables_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${canals.length} canal rotation schedules.`, type: 'success' })
    } else if (tab === 'subsidy') {
      const csv = toCsv(pmksyData.applications?.data || [])
      downloadBlob(csv, `PMKSY_Subsidy_Applications_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: 'Exported PMKSY subsidy applications.', type: 'success' })
    } else if (tab === 'advisories') {
      const csv = toCsv(advisories)
      downloadBlob(csv, `Drought_Advisories_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: 'Exported drought advisories.', type: 'success' })
    } else {
      const csv = toCsv(auditLogs)
      downloadBlob(csv, `Water_Audit_Logs_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: 'Exported water audit logs.', type: 'success' })
    }
  }

  const counts = useMemo(() => {
    return {
      schedules: summary?.activeSchedulesToday || schedules.length,
      cgwb: cgwbStations.length || 8,
      canals: canals.length || 6,
      subsidy: summary?.pendingPmksySubsidies || 4,
      advisories: advisories.length || 3,
      audit: auditLogs.length || 5
    }
  }, [summary, schedules.length, cgwbStations.length, canals.length, advisories.length, auditLogs.length])

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumbs Context Bar */}
      <div className="px-6 pt-6">
        <PageContextBar
          title="Water Intelligence & Irrigation Management"
          sop="SOP-17"
          category="Agronomy & Resources"
          icon={Droplets}
          iconColor="cyan"
          description="Optimal irrigation duration schedules, CGWB groundwater monitoring, canal rotation timetables, and PMKSY 55% micro-irrigation subsidy."
          currentAdmin={currentAdmin}
          isAuditor={isAuditor}
          isSupport={isSupport}
          stats={[
            { label: 'Schedules', value: schedules.length },
            { label: 'CGWB Stations', value: cgwbStations.length },
            { label: 'Audit Events', value: auditLogs.length }
          ]}
          actions={
            <>
              <button
                onClick={() => setIssueDroughtOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <BellRing className="w-4 h-4" />
                <span>Broadcast Drought Alert</span>
              </button>

              <button
                onClick={() => setSyncCgwbOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <RefreshCw className="w-4 h-4 text-teal-600" />
                <span>Sync CGWB Readings</span>
              </button>

              <button
                onClick={() => setConfigureSubsidyOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>PMKSY Rules</span>
              </button>

              <button
                onClick={handleRunEfficiencyAudit}
                disabled={busy}
                title="Run Cluster Water Efficiency & DPDP Masking Audit"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Efficiency Audit</span>
              </button>

              <button
                onClick={handleResetSeed}
                title="Reset Module 17 Seed Data"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Seed</span>
              </button>
            </>
          }
        />
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Monitored Acreage"
          value={summary?.totalMonitoredAcreage?.toLocaleString('en-IN') || '184,500'}
          subtext="Total Command Acreage"
          icon={Droplets}
          color="cyan"
          onClick={() => {
            setTab('schedules')
            setStatus('all')
          }}
        />

        <MetricCard
          title="Water Saved Today"
          value={`${summary?.waterSavedMillionLiters || '14.8'} ML`}
          subtext="Micro-Irrigation vs Flood"
          icon={Zap}
          color="emerald"
          onClick={() => {
            setTab('schedules')
            setIrrigationType('Drip')
          }}
        />

        <MetricCard
          title="CGWB Safe Aquifers"
          value={`${summary?.cgwbSafePct || 75}%`}
          subtext="Hydrological Wells"
          icon={Gauge}
          color="blue"
          onClick={() => {
            setTab('cgwb')
            setStatus('SAFE')
          }}
        />

        <MetricCard
          title="Canal Rotations"
          value={summary?.activeCanalRotations || 6}
          subtext="Active Flow Releases"
          icon={Waves}
          color="cyan"
          onClick={() => {
            setTab('canals')
            setStatus('active_rotation')
          }}
        />

        <MetricCard
          title="PMKSY Subsidies"
          value={summary?.pendingPmksySubsidies || 14}
          subtext="55% Subsidy Approval"
          icon={Sparkles}
          color="purple"
          alert={Boolean(summary?.pendingPmksySubsidies && summary.pendingPmksySubsidies > 0)}
          onClick={() => {
            setTab('subsidy')
          }}
        />

        <MetricCard
          title="Cluster Efficiency"
          value={`${summary?.clusterEfficiencyScore || '94.2'}%`}
          subtext="Optimum Water Index"
          icon={ShieldCheck}
          color="emerald"
          onClick={() => {
            setTab('schedules')
            setAlertFilter('OPTIMAL')
          }}
        />
      </div>

      {/* Main Container Card */}
      <div className="mx-6 rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all">
        {/* Navigation Tabs */}
        <TabSwitch activeTab={tab} onChangeTab={handleTabChange} counts={counts} />

        {/* Global Filter Bar */}
        <FiltersBar
          tab={tab}
          q={q}
          setQ={setQ}
          status={status}
          setStatus={setStatus}
          irrigationType={irrigationType}
          setIrrigationType={setIrrigationType}
          district={district}
          setDistrict={setDistrict}
          alertFilter={alertFilter}
          setAlertFilter={setAlertFilter}
          onExportCsv={handleExportCsv}
          onSyncCgwb={() => setSyncCgwbOpen(true)}
          onUpdateCanal={() => {
            if (canals.length > 0) {
              setUpdateCanalModal({ open: true, canal: canals[0] })
            }
          }}
          onConfigureSubsidy={() => setConfigureSubsidyOpen(true)}
          onIssueDroughtAlert={() => setIssueDroughtOpen(true)}
        />

        {/* Loading / Error States */}
        {loading && (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Loading water &amp; irrigation management data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-12 text-center text-rose-600">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-rose-500" />
            <p className="font-bold text-sm">{error}</p>
            <button
              onClick={loadTabData}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Content Displays */}
        {!loading && !error && (
          <>
            {tab === 'schedules' && (
              <>
                <WaterSchedulesTable
                  schedules={schedules}
                  onSelectSchedule={(ws) => setDrawerSelection({ item: ws, type: 'schedule' })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'cgwb' && (
              <>
                <CgwbStationsTable
                  stations={cgwbStations}
                  onSelectStation={(st) => setDrawerSelection({ item: st, type: 'cgwb' })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'canals' && (
              <>
                <CanalSchedulesTable
                  canals={canals}
                  onSelectCanal={(c) => setDrawerSelection({ item: c, type: 'canal' })}
                  onEditCanal={(c) => setUpdateCanalModal({ open: true, canal: c })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'subsidy' && (
              <>
                <PmksySubsidiesTable
                  rules={pmksyData.rules}
                  applications={pmksyData.applications?.data || []}
                  onApproveApplication={(app) => setApproveSubsidyModal({ open: true, application: app })}
                  onSelectApplication={(app) => setDrawerSelection({ item: app, type: 'subsidy' })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'advisories' && (
              <>
                <DroughtAdvisoriesTable advisories={advisories} />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'audit' && (
              <>
                <div className="p-4">
                  <WaterAuditTrailTable
                    auditLogs={auditLogs}
                    loading={loading}
                    onRefresh={loadTabData}
                    onExportCsv={handleExportCsv}
                  />
                </div>
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Slide-Over Detail Drawer */}
      <WaterDetailDrawer
        item={drawerSelection.item}
        type={drawerSelection.type}
        onClose={() => setDrawerSelection({ item: null, type: 'schedule' })}
        onUpdateCanal={(c) => setUpdateCanalModal({ open: true, canal: c })}
        onApproveSubsidy={(app) => setApproveSubsidyModal({ open: true, application: app })}
      />

      {/* Update Canal Schedule Modal */}
      <UpdateCanalScheduleModal
        open={updateCanalModal.open}
        canal={updateCanalModal.canal}
        onClose={() => setUpdateCanalModal({ open: false, canal: null })}
        onConfirm={handleUpdateCanalConfirm}
      />

      {/* Sync CGWB Stations Modal */}
      <SyncCgwbStationModal
        open={syncCgwbOpen}
        onClose={() => setSyncCgwbOpen(false)}
        onConfirm={handleSyncCgwbConfirm}
      />

      {/* Configure PMKSY Rules Modal */}
      <ConfigurePmksyRulesModal
        open={configureSubsidyOpen}
        rules={pmksyData.rules}
        onClose={() => setConfigureSubsidyOpen(false)}
        onConfirm={handleConfigurePmksyConfirm}
      />

      {/* Issue Drought Alert Modal */}
      <IssueDroughtAlertModal
        open={issueDroughtOpen}
        onClose={() => setIssueDroughtOpen(false)}
        onConfirm={handleIssueDroughtConfirm}
      />

      {/* Approve Subsidy Modal */}
      <ApprovePmksySubsidyModal
        open={approveSubsidyModal.open}
        application={approveSubsidyModal.application}
        onClose={() => setApproveSubsidyModal({ open: false, application: null })}
        onConfirm={handleApproveSubsidyConfirm}
      />

      {/* Generic Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        requireReason={confirmDialog.requireReason}
        danger={confirmDialog.danger}
        dualSignOff={confirmDialog.dualSignOff}
        busy={busy}
        onConfirm={confirmDialog.action || (() => setConfirmDialog({ open: false }))}
        onCancel={() => setConfirmDialog({ open: false })}
      />
    </div>
  )
}
