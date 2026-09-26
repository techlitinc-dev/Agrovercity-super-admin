import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Layers,
  FileText,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Activity,
  Database,
  Lock,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  Users,
  Download,
  Plus,
  RotateCcw
} from 'lucide-react'
import {
  getLandRecordsSummary,
  getGatewayStatus,
  listLandRecords,
  listUserImportedRecords,
  getAuditLogs,
  manualProvisionRecord,
  resolveDiscrepancy,
  refreshRecordFromPortal,
  seedVillageRecords,
  exportGovernmentCompliance,
  auditCompliance,
  resetLandRecordsSeedData
} from '../api/landRecordsApi'
import {
  MetricCard,
  TabSwitch,
  FiltersBar,
  LandRecordsTable,
  UserImportsTable,
  GatewayStatusCards,
  Pagination
} from './landRecordsWidgets'
import LandRecordDetailDrawer from '../components/land-records/LandRecordDetailDrawer'
import LandRecordsAuditTrailTable from '../components/land-records/LandRecordsAuditTrailTable'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  ManualProvisionRecordModal,
  ResolveDiscrepancyModal,
  SeedVillageCacheModal,
  GovernmentExportModal,
  DpdpLandComplianceModal
} from '../components/land-records/LandRecordsModals'
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

export default function LandRecordsPage() {
  const { addToast } = useNotification() || { addToast: () => {} }

  const [tab, setTab] = useState('records') // 'records' | 'imports' | 'gateways' | 'audit'
  const [records, setRecords] = useState([])
  const [imports, setImports] = useState([])
  const [gatewayStatus, setGatewayStatus] = useState(null)
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
  const [recordType, setRecordType] = useState('all')
  const [district, setDistrict] = useState('all')
  const [encumbranceOnly, setEncumbranceOnly] = useState(false)

  // Detail Drawer
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Modals
  const [manualProvisionOpen, setManualProvisionOpen] = useState(false)
  const [discrepancyModal, setDiscrepancyModal] = useState({ open: false, record: null })
  const [seedCacheOpen, setSeedCacheOpen] = useState(false)
  const [exportComplianceOpen, setExportComplianceOpen] = useState(false)
  const [dpdpAuditModal, setDpdpAuditModal] = useState({ open: false, result: null })

  // Generic Confirmation Dialog
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

  // 1. Load KPI summary and gateway telemetry
  const loadSummaryAndGateways = useCallback(async () => {
    try {
      const [sumRes, gwRes] = await Promise.all([
        getLandRecordsSummary(),
        getGatewayStatus()
      ])
      setSummary(sumRes)
      setGatewayStatus(gwRes)
    } catch (err) {
      console.error('Failed to load land records summary:', err)
    }
  }, [])

  // 2. Load tab specific dataset
  const loadTabData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      if (tab === 'records') {
        const res = await listLandRecords({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          recordType,
          district,
          hasEncumbranceOnly: encumbranceOnly
        })
        setRecords(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'imports') {
        const res = await listUserImportedRecords({
          page,
          pageSize: PAGE_SIZE,
          q,
          district
        })
        setImports(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'gateways') {
        const res = await getGatewayStatus()
        setGatewayStatus(res)
      } else if (tab === 'audit') {
        const res = await getAuditLogs({
          page,
          pageSize: PAGE_SIZE,
          q,
          actionType: status !== 'all' ? status : 'all'
        })
        setAuditLogs(res.data || [])
        setTotal(res.total || 0)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch land records data')
      addToast({
        title: 'Network Error',
        message: err.message || 'Unable to retrieve data from state gateway cache',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, recordType, district, encumbranceOnly, addToast])

  useEffect(() => {
    loadSummaryAndGateways()
  }, [loadSummaryAndGateways])

  useEffect(() => {
    loadTabData()
  }, [loadTabData])

  // Reset page when switching tabs or changing filters
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setQ('')
    setStatus('all')
    setRecordType('all')
    setDistrict('all')
    setEncumbranceOnly(false)
  }

  // 3. Action Handlers
  const handleManualProvisionConfirm = async (formData) => {
    try {
      setBusy(true)
      const res = await manualProvisionRecord(formData)
      addToast({
        title: 'Record Provisioned',
        message: `Successfully provisioned 7/12 record for Gat #${res.gatNumber} in ${res.village}.`,
        type: 'success'
      })
      setManualProvisionOpen(false)
      loadSummaryAndGateways()
      loadTabData()
    } catch (err) {
      addToast({
        title: 'Provisioning Failed',
        message: err.message || 'Failed to ingest manual record',
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleResolveDiscrepancyConfirm = async (resolutionData) => {
    try {
      setBusy(true)
      const res = await resolveDiscrepancy(discrepancyModal.record.id, resolutionData)
      addToast({
        title: 'Discrepancy Resolved',
        message: `Record Gat #${res.gatNumber} updated: ${resolutionData.actionTaken}.`,
        type: 'success'
      })
      setDiscrepancyModal({ open: false, record: null })
      if (selectedRecord && selectedRecord.id === res.id) {
        setSelectedRecord(res)
      }
      loadSummaryAndGateways()
      loadTabData()
    } catch (err) {
      addToast({
        title: 'Resolution Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleRefreshRecord = async (record) => {
    try {
      addToast({
        title: 'Querying State Gateway',
        message: `Connecting to ${record.sourcePortal} for Gat #${record.gatNumber}...`,
        type: 'info'
      })
      const refreshed = await refreshRecordFromPortal(record.id)
      addToast({
        title: 'Record Synchronized',
        message: `Updated extract for Gat #${refreshed.gatNumber} with latest portal telemetry.`,
        type: 'success'
      })
      if (selectedRecord && selectedRecord.id === refreshed.id) {
        setSelectedRecord(refreshed)
      }
      loadTabData()
    } catch (err) {
      addToast({
        title: 'Sync Failed',
        message: err.message,
        type: 'error'
      })
    }
  }

  const handleSeedCacheConfirm = async (seedParams) => {
    try {
      setBusy(true)
      const res = await seedVillageRecords(seedParams)
      addToast({
        title: 'Cache Pre-warming Initiated',
        message: `Successfully seeded ${res.seededRecordsCount} records for ${seedParams.village} into Redis cluster.`,
        type: 'success'
      })
      setSeedCacheOpen(false)
      loadSummaryAndGateways()
      loadTabData()
    } catch (err) {
      addToast({
        title: 'Cache Seeding Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleExportComplianceConfirm = async (exportParams) => {
    try {
      setBusy(true)
      const res = await exportGovernmentCompliance(exportParams)
      downloadBlob(res.csvContent, res.filename)
      addToast({
        title: 'Government Audit Dossier Ready',
        message: `Generated compliance export with SHA-256: ${res.auditSha256.slice(0, 12)}...`,
        type: 'success'
      })
      setExportComplianceOpen(false)
    } catch (err) {
      addToast({
        title: 'Export Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleRunDpdpAudit = async () => {
    try {
      setBusy(true)
      const result = await auditCompliance()
      setDpdpAuditModal({ open: true, result })
      addToast({
        title: 'DPDP Audit Complete',
        message: `Pass Rate: ${result.passRate}% · ${result.passedCount} compliant · ${result.leaksDetected} leaks.`,
        type: 'info'
      })
    } catch (err) {
      addToast({
        title: 'Audit Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = () => {
    setConfirmDialog({
      open: true,
      title: 'Reset Land Records Registry Seed Data',
      message: 'Restore all default 7/12 & 8A land records, user farm imports, state revenue gateway health telemetry, and statutory audit logs back to initial defaults?',
      confirmLabel: 'Reset All Data',
      requireReason: false,
      danger: true,
      dualSignOff: false,
      action: async () => {
        setBusy(true)
        try {
          await resetLandRecordsSeedData()
          addToast({
            title: 'Seed Data Reset',
            message: 'Land records database and cache restored to default seeds.',
            type: 'success'
          })
          setConfirmDialog({ open: false })
          loadSummaryAndGateways()
          loadTabData()
        } catch (err) {
          addToast({
            title: 'Reset Failed',
            message: err?.message || 'Failed to reset seed data',
            type: 'error'
          })
        } finally {
          setBusy(false)
        }
      }
    })
  }

  const handleExportCurrentView = () => {
    if (tab === 'records') {
      const csv = toCsv(records)
      downloadBlob(csv, `Land_Records_712_8A_${Date.now()}.csv`)
      addToast({
        title: 'CSV Exported',
        message: `Exported ${records.length} land records to CSV.`,
        type: 'success'
      })
    } else if (tab === 'imports') {
      const csv = toCsv(imports)
      downloadBlob(csv, `Farmer_Farm_Imports_${Date.now()}.csv`)
      addToast({
        title: 'CSV Exported',
        message: `Exported ${imports.length} user farm import records to CSV.`,
        type: 'success'
      })
    } else if (tab === 'audit') {
      const csv = toCsv(auditLogs)
      downloadBlob(csv, `Land_Records_Audit_Trail_${Date.now()}.csv`)
      addToast({
        title: 'CSV Exported',
        message: `Exported ${auditLogs.length} audit trail logs to CSV.`,
        type: 'success'
      })
    } else {
      setExportComplianceOpen(true)
    }
  }

  // Counts for TabSwitch
  const counts = useMemo(() => {
    return {
      records: summary?.activeVerifiedParcels || records.length,
      imports: summary?.totalImportsThisMonth || imports.length,
      gateways: gatewayStatus?.portals?.length || 4,
      audit: auditLogs.length || 5
    }
  }, [summary, records.length, imports.length, gatewayStatus, auditLogs.length])

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb Context Bar */}
      <div className="px-6 pt-6">
        <PageContextBar
          title="Land Records Registry (7/12 & 8A Utara)"
          sop="SOP-16"
          category="Governance & Compliance"
          icon={Layers}
          iconColor="emerald"
          description="Direct state revenue portal integration (Mahabhulekh, MP Bhulekh, AnyRoR, Bhoomi) for 7/12, 8A Khate, Gat fuzzy matching, and Redis L2 caching."
          currentAdmin={currentAdmin}
          isAuditor={isAuditor}
          isSupport={isSupport}
          stats={[
            { label: 'Parcels', value: records.length },
            { label: 'Imports', value: imports.length },
            { label: 'Audit Logs', value: auditLogs.length }
          ]}
          actions={
            <>
              <button
                onClick={() => setManualProvisionOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Manual Provision</span>
              </button>

              <button
                onClick={() => setSeedCacheOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <Database className="w-4 h-4 text-sky-600" />
                <span>Seed Cache</span>
              </button>

              <button
                onClick={handleRunDpdpAudit}
                title="Audit DPDP Act Masking Compliance"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DPDP Audit</span>
              </button>

              <button
                onClick={() => setExportComplianceOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs transition"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Govt Dossier</span>
              </button>

              <button
                onClick={handleResetSeed}
                title="Reset Module 16 Seed Data"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold shadow-2xs transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Seed</span>
              </button>
            </>
          }
        />
      </div>

      {/* KPI Summary Metrics Grid */}
      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Active Verified Parcels"
          value={summary?.activeVerifiedParcels?.toLocaleString('en-IN') || '12,850'}
          subtext="State Gateway Confirmed"
          icon={ShieldCheck}
          color="emerald"
          onClick={() => {
            setTab('records')
            setStatus('verified')
          }}
        />

        <MetricCard
          title="Cached Records"
          value={summary?.totalRecordsInCache?.toLocaleString('en-IN') || '14,280'}
          subtext="Redis In-Memory L2"
          icon={Database}
          color="blue"
          onClick={() => {
            setTab('records')
            setStatus('all')
          }}
        />

        <MetricCard
          title="Flagged Discrepancies"
          value={summary?.flaggedDiscrepancies ?? 3}
          subtext="Survey / Parsing Mismatch"
          icon={AlertTriangle}
          color="amber"
          alert={Boolean(summary?.flaggedDiscrepancies && summary.flaggedDiscrepancies > 0)}
          onClick={() => {
            setTab('records')
            setStatus('flagged_discrepancy')
          }}
        />

        <MetricCard
          title="Manual Overrides"
          value={summary?.manualOverrides ?? 2}
          subtext="Downtime Emergency Ingest"
          icon={Clock}
          color="purple"
          onClick={() => {
            setTab('records')
            setStatus('manual_override')
          }}
        />

        <MetricCard
          title="Farmer Profile Imports"
          value={summary?.totalImportsThisMonth?.toLocaleString('en-IN') || '3,420'}
          subtext="Auto-Synced Acreage"
          icon={Users}
          color="emerald"
          onClick={() => {
            setTab('imports')
          }}
        />

        <MetricCard
          title="Cache Hit Ratio"
          value={`${gatewayStatus?.cacheMetrics?.cacheHitRatio || '84.6'}%`}
          subtext="Sub-5ms Lookup Speed"
          icon={Zap}
          color="blue"
          onClick={() => {
            setTab('gateways')
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="mx-6 rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all">
        {/* Module Sub-Navigation */}
        <TabSwitch activeTab={tab} onChangeTab={handleTabChange} counts={counts} />

        {/* Global Filter Bar */}
        {tab !== 'gateways' && (
          <FiltersBar
            tab={tab}
            q={q}
            setQ={setQ}
            status={status}
            setStatus={setStatus}
            recordType={recordType}
            setRecordType={setRecordType}
            district={district}
            setDistrict={setDistrict}
            encumbranceOnly={encumbranceOnly}
            setEncumbranceOnly={setEncumbranceOnly}
            onExportCsv={handleExportCurrentView}
            onManualProvision={() => setManualProvisionOpen(true)}
            onSeedCache={() => setSeedCacheOpen(true)}
            onOpenGatewayHealth={() => setTab('gateways')}
          />
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium">Loading land records registry data...</p>
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

        {/* Content Tab Displays */}
        {!loading && !error && (
          <>
            {tab === 'records' && (
              <>
                <LandRecordsTable
                  records={records}
                  onSelectRecord={(r) => setSelectedRecord(r)}
                  onResolveDiscrepancy={(r) => setDiscrepancyModal({ open: true, record: r })}
                  onRefreshPortal={handleRefreshRecord}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}

            {tab === 'imports' && (
              <>
                <UserImportsTable
                  imports={imports}
                  onSelectImport={(item) => {
                    const match = records.find((r) => r.id === item.recordId || r.gatNumber === item.gatNumber)
                    if (match) {
                      setSelectedRecord(match)
                    }
                  }}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}

            {tab === 'gateways' && (
              <GatewayStatusCards gatewayStatus={gatewayStatus} />
            )}

            {tab === 'audit' && (
              <>
                <LandRecordsAuditTrailTable
                  auditLogs={auditLogs}
                  loading={loading}
                  onRefresh={loadTabData}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Detail Slide-Over Drawer */}
      <LandRecordDetailDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onResolveDiscrepancy={(r) => setDiscrepancyModal({ open: true, record: r })}
        onRefreshPortal={handleRefreshRecord}
      />

      {/* Manual Provisioning Modal */}
      <ManualProvisionRecordModal
        open={manualProvisionOpen}
        onClose={() => setManualProvisionOpen(false)}
        onConfirm={handleManualProvisionConfirm}
      />

      {/* Resolve Discrepancy Modal */}
      <ResolveDiscrepancyModal
        open={discrepancyModal.open}
        record={discrepancyModal.record}
        onClose={() => setDiscrepancyModal({ open: false, record: null })}
        onConfirm={handleResolveDiscrepancyConfirm}
      />

      {/* Seed Village Cache Modal */}
      <SeedVillageCacheModal
        open={seedCacheOpen}
        onClose={() => setSeedCacheOpen(false)}
        onConfirm={handleSeedCacheConfirm}
      />

      {/* Government Compliance Export Modal */}
      <GovernmentExportModal
        open={exportComplianceOpen}
        onClose={() => setExportComplianceOpen(false)}
        onConfirm={handleExportComplianceConfirm}
      />

      {/* DPDP Act Compliance Result Modal */}
      <DpdpLandComplianceModal
        open={dpdpAuditModal.open}
        result={dpdpAuditModal.result}
        onClose={() => setDpdpAuditModal({ open: false, result: null })}
      />

      {/* Confirmation Dialog for Reset Seed */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        requireReason={confirmDialog.requireReason}
        danger={confirmDialog.danger}
        dualSignOff={confirmDialog.dualSignOff}
        busy={busy}
        onConfirm={() => {
          if (confirmDialog.action) confirmDialog.action()
        }}
        onCancel={() => setConfirmDialog({ open: false })}
      />
    </div>
  )
}
