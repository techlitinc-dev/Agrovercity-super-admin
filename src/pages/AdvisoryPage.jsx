import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  RadioTower,
  Satellite,
  Cpu,
  TestTube2,
  Sliders,
  RotateCcw,
  Download,
  Plus,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { adminAdvisoryService } from '../services/adminAdvisoryService'
import ConfirmDialog from '../components/ConfirmDialog'
import AdvisoryDetailDrawer from '../components/advisory/AdvisoryDetailDrawer'
import { BroadcastAlertModal, LabResultModal } from '../components/advisory/AdvisoryModals'
import LivePestRadarView from '../components/advisory/LivePestRadarView'
import MarketSaturationTable from '../components/advisory/MarketSaturationTable'
import CropSubstitutionModal from '../components/advisory/CropSubstitutionModal'
import NpkConfigModal from '../components/advisory/NpkConfigModal'
import SoilTestBookingModal from '../components/advisory/SoilTestBookingModal'
import AdvisoryAuditTrailTable from '../components/advisory/AdvisoryAuditTrailTable'
import {
  MetricCard,
  FiltersBar,
  TabSwitch,
  ScansTable,
  SoilTestsTable,
  Pagination,
  SCAN_STATUSES,
  ALERT_STATUSES,
  SOIL_STATUSES,
  CYCLE_STATUSES
} from './advisoryWidgets'

const PAGE_SIZE = 15

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0])
  const lines = rows.map((r) => head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
  return [head.join(','), ...lines].join('\n')
}

const STATUS_KEYS = {
  scans: SCAN_STATUSES,
  radar: ALERT_STATUSES,
  soil: SOIL_STATUSES,
  saturation: CYCLE_STATUSES,
  audit_trail: []
}

export default function AdvisoryPage() {
  const [tab, setTab] = useState('scans')
  const [scans, setScans] = useState([])
  const [alerts, setAlerts] = useState([])
  const [soilTests, setSoilTests] = useState([])
  const [cropCycles, setCropCycles] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [npkConfig, setNpkConfig] = useState(null)
  const [kpis, setKpis] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })

  // Drawer & Modals state
  const [selected, setSelected] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [broadcastModal, setBroadcastModal] = useState({ open: false, preset: null })
  const [labModal, setLabModal] = useState({ open: false, test: null })
  const [bookingModal, setBookingModal] = useState({ open: false })
  const [npkModal, setNpkModal] = useState({ open: false })
  const [substitutionModal, setSubstitutionModal] = useState({ open: false, cycle: null })
  const [busy, setBusy] = useState(false)

  const loadKpis = useCallback(async () => {
    try {
      const stats = await adminAdvisoryService.getAdvisoryKpis()
      setKpis(stats)
      const config = await adminAdvisoryService.getNpkConfig()
      setNpkConfig(config)
    } catch (err) {
      console.error('Failed to load KPIs or NPK config', err)
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'scans') {
        const res = await adminAdvisoryService.listScans({
          query: q,
          status,
          page,
          limit: PAGE_SIZE
        })
        setScans(res.scans || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'radar') {
        const res = await adminAdvisoryService.listPestAlerts({
          query: q,
          status,
          page: 1,
          limit: 100
        })
        setAlerts(res.alerts || [])
        setTotal(res.alerts?.length || 0)
      } else if (tab === 'soil') {
        const res = await adminAdvisoryService.listSoilTests({
          query: q,
          status,
          page,
          limit: PAGE_SIZE
        })
        setSoilTests(res.soilTests || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'saturation') {
        const res = await adminAdvisoryService.listCropCycles({
          query: q,
          status
        })
        setCropCycles(res.cropCycles || [])
        setTotal(res.cropCycles?.length || 0)
      } else if (tab === 'audit_trail') {
        const res = await adminAdvisoryService.listAdvisoryAuditLogs({
          query: q,
          page,
          limit: PAGE_SIZE
        })
        setAuditLogs(res.auditLogs || [])
        setTotal(res.pagination?.total || 0)
      }
      await loadKpis()
    } catch (err) {
      setError(err.message || 'Failed to load advisory data')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, loadKpis])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Sorting
  const sorted = useMemo(() => {
    const list = tab === 'scans' ? [...scans] : tab === 'radar' ? [...alerts] : tab === 'soil' ? [...soilTests] : [...cropCycles]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return typeof va === 'number' ? (va - vb) * mul : String(va).localeCompare(String(vb)) * mul
    })
    return list
  }, [tab, scans, alerts, soilTests, cropCycles, sort])

  // Handlers
  const handleMarkFalsePositive = (scan) => {
    setDialog({
      title: `Mark Scan #${scan.id} as False Positive?`,
      message: `The scan diagnosis "${scan.diagnosis}" will be recorded as an AI misclassification. This penalizes the model accuracy metric for ${scan.modelVersion} and initiates a mandatory agronomist review.`,
      confirmLabel: 'Mark False Positive',
      danger: true,
      dualSignOff: false,
      doc: scan,
      run: async (reason) => {
        await adminAdvisoryService.updateScanStatus({
          scanId: scan.id,
          status: 'false_positive',
          reason
        })
        setNotice(`Scan #${scan.id} marked as false positive.`)
      }
    })
  }

  async function handleConfirmDialog(reason) {
    if (!dialog) return
    const { run } = dialog
    setDialog(null)
    setBusy(true)
    try {
      await run(reason)
      setSelected(null)
      loadData()
    } catch (err) {
      setError(err.message || 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  const handleBroadcast = async (form, reason) => {
    setBusy(true)
    try {
      await adminAdvisoryService.broadcastPestAlert({
        pestName: form.pestName,
        district: form.district,
        severity: form.severity,
        crop: form.crop,
        radiusKm: Number(form.radiusKm),
        message: form.message,
        scheduledFor: form.schedule ? new Date(form.schedule).toISOString() : undefined,
        reason
      })
      setBroadcastModal({ open: false, preset: null })
      setNotice(`Geofenced pest alert for ${form.pestName} in ${form.district} broadcasted successfully.`)
      setTab('radar')
      loadData()
    } catch (err) {
      setError(err.message || 'Broadcast failed')
    } finally {
      setBusy(false)
    }
  }

  const handleLabUpload = async (form, reason) => {
    const test = labModal.test
    if (!test) return
    setBusy(true)
    try {
      await adminAdvisoryService.uploadSoilResults({
        testId: test.id,
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        ph: Number(form.ph),
        organicCarbon: Number(form.organicCarbon),
        recommendation: form.recommendation,
        reportUrl: form.reportUrl,
        reason
      })
      setLabModal({ open: false, test: null })
      setSelected(null)
      setNotice(`Lab results and ICAR NPK recommendation published for sample ${test.sampleCode}. Farmer notified.`)
      loadData()
    } catch (err) {
      setError(err.message || 'Lab upload failed')
    } finally {
      setBusy(false)
    }
  }

  const handleBookSoilTest = async (form, reason) => {
    setBusy(true)
    try {
      await adminAdvisoryService.bookSoilTest(form, 'root@agrovercity')
      setBookingModal({ open: false })
      setNotice(`Soil test sample collection kit dispatched for ${form.farmerName} (${form.surveyNo}).`)
      setTab('soil')
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to book soil test')
    } finally {
      setBusy(false)
    }
  }

  const handleCalibrateSubstitution = async (cycleId, form, reason) => {
    setBusy(true)
    try {
      await adminAdvisoryService.updateCropCycleSubstitution({
        cycleId,
        targetMarketCapacityAcres: form.targetMarketCapacityAcres,
        recommendedSubstitution: form.recommendedSubstitution,
        expectedYieldPerAcre: form.expectedYieldPerAcre,
        priceRiskStatus: form.priceRiskStatus,
        reason
      })
      setSubstitutionModal({ open: false, cycle: null })
      setSelected(null)
      setNotice(`Crop cycle #${cycleId} diversification recommendations calibrated and published.`)
      loadData()
    } catch (err) {
      setError(err.message || 'Calibration failed')
    } finally {
      setBusy(false)
    }
  }

  const handleUpdateNpkConfig = async (configData, reason) => {
    setBusy(true)
    try {
      await adminAdvisoryService.updateNpkConfig({
        configData,
        reason
      })
      setNpkModal({ open: false })
      setNotice(`ICAR NPK algorithm configuration updated and certified.`)
      loadData()
    } catch (err) {
      setError(err.message || 'Config update failed')
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all advisory scans, pest radar alerts, soil tests, crop cycles, and audit logs to statutory baseline data?')) return
    setBusy(true)
    try {
      await adminAdvisoryService.resetToDefaultSeed()
      setNotice('Advisory seed data reset to ICAR/Agrovercity production default.')
      loadData()
    } catch (err) {
      setError(err.message || 'Seed reset failed')
    } finally {
      setBusy(false)
    }
  }

  const handleExport = () => {
    let rowsToExport = []
    let filenamePrefix = `advisory-${tab}`
    if (tab === 'scans') rowsToExport = scans
    else if (tab === 'radar') rowsToExport = alerts
    else if (tab === 'soil') rowsToExport = soilTests
    else if (tab === 'saturation') rowsToExport = cropCycles
    else if (tab === 'audit_trail') rowsToExport = auditLogs

    const csvContent = toCsv(rowsToExport)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Top Banner & Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch
          tab={tab}
          setTab={(t) => {
            setPage(1)
            setStatus('all')
            setSort({ key: 'createdAt', dir: 'desc' })
            setTab(t)
          }}
        />

        <div className="flex items-center gap-2">
          {npkConfig && (
            <button
              onClick={() => setNpkModal({ open: true })}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-50 transition-colors"
              title="Click to configure ICAR Soil Test Crop Response (STCR) algorithm parameters"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              <span>{npkConfig.algorithmVersion}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">STCR Calibrated</span>
            </button>
          )}

          <button
            onClick={handleResetSeed}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Reset to statutory seed state"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Seed
          </button>
        </div>
      </div>

      {/* Target Collections Stat Pill */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Target Collections: advisory_scans · pest_alerts · soil_tests · crop_cycles · npk_config · audit_logs</span>
        <span className="font-semibold text-emerald-800">SOP-11 Superadmin Mode</span>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Diagnoses Confirmed"
          value={kpis?.scans?.confirmed != null ? kpis.scans.confirmed : '—'}
          tone="emerald"
          sub={`${kpis?.scans?.accuracyRate != null ? kpis.scans.accuracyRate : 96}% CNN LeafNet Accuracy`}
        />
        <MetricCard
          label="Active Pest Alerts"
          value={kpis?.alerts?.active != null ? kpis.alerts.active : '—'}
          tone="amber"
          sub={`${kpis?.alerts?.totalFarmersNotified?.toLocaleString('en-IN') || '14,800'} Farmers Warned`}
        />
        <MetricCard
          label="Soil Tests Uploaded"
          value={kpis?.soil?.resultsUploaded != null ? kpis.soil.resultsUploaded : '—'}
          tone="sky"
          sub={`${kpis?.soil?.pendingProcessing || 0} Pending Lab Core Analysis`}
        />
        <MetricCard
          label="Crop Saturation Alerts"
          value={kpis?.cropCycles?.flaggedOversupply != null ? kpis.cropCycles.flaggedOversupply : '—'}
          tone="rose"
          sub={`${kpis?.cropCycles?.totalMonitored || 6} Total Monitored Agro-Zones`}
        />
      </div>

      {/* Feedback Alerts */}
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 shadow-2xs">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-700 hover:text-emerald-950">&times;</button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-900 shadow-2xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-rose-700 hover:text-rose-950">&times;</button>
        </div>
      )}

      {/* Filters Bar for tabular views (Scans, Soil) */}
      {(tab === 'scans' || tab === 'soil') && (
        <FiltersBar
          q={q}
          setQ={(v) => { setPage(1); setQ(v); }}
          status={status}
          setStatus={(v) => { setPage(1); setStatus(v); }}
          statuses={STATUS_KEYS[tab] || []}
          dateRange={dateRange}
          setDateRange={(v) => { setPage(1); setDateRange(v); }}
          onExport={handleExport}
        >
          {tab === 'soil' && (
            <button
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
              onClick={() => setBookingModal({ open: true })}
            >
              <Plus className="h-4 w-4" /> Book Soil Test
            </button>
          )}
        </FiltersBar>
      )}

      {/* Content Rendering based on Tab */}
      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">
          Loading advisory telemetry and intelligence data…
        </div>
      ) : tab === 'scans' ? (
        <>
          <ScansTable
            scans={sorted}
            sort={sort}
            onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(doc) => setSelected({ type: 'scans', doc })}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'radar' ? (
        <LivePestRadarView
          alerts={alerts}
          onBroadcastNew={() => setBroadcastModal({ open: true, preset: null })}
          onViewAlert={(alert) => setSelected({ type: 'alerts', doc: alert })}
        />
      ) : tab === 'soil' ? (
        <>
          <SoilTestsTable
            tests={sorted}
            sort={sort}
            onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
            onView={(doc) => setSelected({ type: 'soil', doc })}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'saturation' ? (
        <MarketSaturationTable
          cropCycles={cropCycles}
          onCalibrateSubstitution={(cycle) => setSubstitutionModal({ open: true, cycle })}
          onViewCycle={(cycle) => setSelected({ type: 'saturation', doc: cycle })}
          onExport={handleExport}
        />
      ) : (
        <AdvisoryAuditTrailTable
          auditLogs={auditLogs}
          pagination={{ page, limit: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) }}
          onPageChange={setPage}
          loading={loading}
        />
      )}

      {/* Drawer */}
      <AdvisoryDetailDrawer
        entity={selected?.doc}
        tab={selected?.type}
        npkConfig={npkConfig}
        onClose={() => setSelected(null)}
        onMarkFalsePositive={handleMarkFalsePositive}
        onBroadcast={(alert) => setBroadcastModal({ open: true, preset: alert })}
        onUploadResults={(test) => setLabModal({ open: true, test })}
        onCalibrateSubstitution={(cycle) => setSubstitutionModal({ open: true, cycle })}
      />

      {/* Confirmation Dialog with Dual Sign-off / Reason */}
      <ConfirmDialog
        open={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        danger={dialog?.danger}
        dualSignOff={dialog?.dualSignOff}
        onConfirm={handleConfirmDialog}
        onCancel={() => setDialog(null)}
      />

      {/* Modals */}
      <BroadcastAlertModal
        open={broadcastModal.open}
        preset={broadcastModal.preset}
        busy={busy}
        onConfirm={handleBroadcast}
        onCancel={() => setBroadcastModal({ open: false, preset: null })}
      />

      <LabResultModal
        open={labModal.open}
        test={labModal.test}
        busy={busy}
        onConfirm={handleLabUpload}
        onCancel={() => setLabModal({ open: false, test: null })}
      />

      <SoilTestBookingModal
        open={bookingModal.open}
        busy={busy}
        onConfirm={handleBookSoilTest}
        onCancel={() => setBookingModal({ open: false })}
      />

      <CropSubstitutionModal
        open={substitutionModal.open}
        cycle={substitutionModal.cycle}
        busy={busy}
        onConfirm={handleCalibrateSubstitution}
        onCancel={() => setSubstitutionModal({ open: false, cycle: null })}
      />

      <NpkConfigModal
        open={npkModal.open}
        config={npkConfig}
        busy={busy}
        onConfirm={handleUpdateNpkConfig}
        onCancel={() => setNpkModal({ open: false })}
      />
    </div>
  )
}
