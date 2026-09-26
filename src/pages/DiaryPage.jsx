import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  BookOpen,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sliders,
  Calculator,
  Download,
  CheckCircle,
  Flag,
  Trash2,
  Eye,
  RotateCcw,
  RefreshCw
} from 'lucide-react'
import { adminDiaryService } from '../services/adminDiaryService'
import ConfirmDialog from '../components/ConfirmDialog'
import DiaryDetailDrawer from '../components/diary/DiaryDetailDrawer'
import {
  CalibrateBenchmarkModal,
  BreakEvenCalculatorModal,
  PdfReviewModal
} from '../components/diary/DiaryModals'
import DiaryAuditTrailTable from '../components/diary/DiaryAuditTrailTable'
import {
  fmtINR,
  DIARY_STATUSES,
  PNL_STATUSES,
  ENTRY_CATEGORIES,
  MetricCard,
  TabSwitch,
  FiltersBar,
  DiaryEntriesTable,
  CropPnlTable,
  BenchmarksTable,
  RegionalTrendsView,
  Pagination
} from './diaryWidgets'

const PAGE_SIZE = 15

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object')
  const lines = rows.map((r) =>
    head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [head.join(','), ...lines].join('\n')
}

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function DiaryPage() {
  const [tab, setTab] = useState('entries') // 'entries' | 'pnl' | 'benchmarks' | 'trends' | 'audit_trail'
  const [diaryEntries, setDiaryEntries] = useState([])
  const [cropPnlList, setCropPnlList] = useState([])
  const [benchmarks, setBenchmarks] = useState([])
  const [regionalData, setRegionalData] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [kpis, setKpis] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [secondaryFilter, setSecondaryFilter] = useState('all') // category in entries, season in pnl
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' })

  // Drawer and Modals
  const [selected, setSelected] = useState(null) // { type: 'entry' | 'pnl', doc: object }
  const [calibrateModal, setCalibrateModal] = useState({ open: false, benchmark: null })
  const [calcModalOpen, setCalcModalOpen] = useState(false)
  const [pdfModal, setPdfModal] = useState({ open: false, report: null })

  // Confirmation dialog with mandatory reason & optional dual sign-off
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    requireReason: true,
    danger: false,
    dualSignOff: false,
    action: null
  })

  const loadKpis = useCallback(async () => {
    try {
      const stats = await adminDiaryService.getDiaryKpis()
      setKpis(stats)
      const bMarks = await adminDiaryService.listBenchmarks()
      setBenchmarks(bMarks || [])
      const reg = await adminDiaryService.getRegionalSummary()
      setRegionalData(reg)
    } catch (err) {
      console.error('Failed to prefetch KPIs or benchmarks', err)
    }
  }, [])

  // Load active tab data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    const fromDate = dateRange === 'all' ? '' : daysAgoIso(Number(dateRange))

    try {
      if (tab === 'entries') {
        const res = await adminDiaryService.listDiaryEntries({
          query: q,
          status,
          category: secondaryFilter,
          from: fromDate,
          page,
          limit: PAGE_SIZE
        })
        setDiaryEntries(res.entries || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'pnl') {
        const res = await adminDiaryService.listCropPnl({
          query: q,
          status,
          season: secondaryFilter,
          from: fromDate,
          page,
          limit: PAGE_SIZE
        })
        setCropPnlList(res.records || [])
        setTotal(res.pagination?.total || 0)
      } else if (tab === 'benchmarks') {
        const res = await adminDiaryService.listBenchmarks()
        setBenchmarks(res || [])
        setTotal(res?.length || 0)
      } else if (tab === 'trends') {
        const res = await adminDiaryService.getRegionalSummary()
        setRegionalData(res)
      } else if (tab === 'audit_trail') {
        const res = await adminDiaryService.listDiaryAuditLogs({
          query: q,
          page,
          limit: PAGE_SIZE
        })
        setAuditLogs(res.auditLogs || [])
        setTotal(res.pagination?.total || 0)
      }
      await loadKpis()
    } catch (err) {
      setError(err.message || 'Failed to load farm diary and P&L analytics data')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, secondaryFilter, dateRange, loadKpis])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Sort rows
  const activeRows = tab === 'entries' ? diaryEntries : cropPnlList

  const sortedRows = useMemo(() => {
    if (tab === 'benchmarks' || tab === 'trends' || tab === 'audit_trail') return []
    const list = [...activeRows]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1

    list.sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return typeof va === 'number'
        ? (va - vb) * mul
        : String(va).localeCompare(String(vb)) * mul
    })
    return list
  }, [activeRows, sort, tab])

  // Top Metric Cards Calculation
  const metrics = useMemo(() => {
    return {
      active: kpis?.activeEntries != null ? kpis.activeEntries : diaryEntries.length,
      pending: kpis?.pendingReview != null ? kpis.pendingReview : 1,
      today: kpis?.todayVolume != null ? kpis.todayVolume : 3,
      flagged: kpis?.flaggedCount != null ? kpis.flaggedCount : 2,
      extra: `${(kpis?.totalCoinsDisbursed || 632550).toLocaleString('en-IN')} 🪙 disbursed · ${kpis?.auditIntegrityScore || 99.7}% integrity`
    }
  }, [kpis, diaryEntries])

  // Tab change handler
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setStatus('all')
    setSecondaryFilter('all')
    setSort(newTab === 'entries' ? { key: 'date', dir: 'desc' } : { key: 'id', dir: 'desc' })
  }

  // Row actions: Verify Entry
  const handleVerifyEntry = async (entry) => {
    setConfirmDialog({
      open: true,
      title: `Verify Farm Diary Entry #${entry.id}`,
      message: `Confirm financial verification of ${entry.farmerName}'s ${entry.title} (${fmtINR(entry.amount)}). This confirms the 15 AgriCoins reward ledger credit.`,
      confirmLabel: 'Verify Entry',
      requireReason: true,
      danger: false,
      dualSignOff: false,
      action: async (reason) => {
        setBusy(true)
        try {
          const res = await adminDiaryService.verifyDiaryEntry({
            entryId: entry.id,
            reason
          })
          setNotice(res.message || 'Entry verified successfully.')
          if (selected?.doc?.id === entry.id) {
            setSelected({ type: 'entry', doc: res.entry })
          }
          loadData()
        } catch (err) {
          setError(err.message || 'Failed to verify diary entry')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  // Row actions: Flag Entry for Duplicate / Anomaly
  const handleFlagEntry = (entry) => {
    setConfirmDialog({
      open: true,
      title: `Flag Entry #${entry.id} for Audit Investigation`,
      message: `Flag this entry for supervisor investigation. Any suspicious duplicate voucher or out-of-band expense claim will be held before final credit.`,
      confirmLabel: 'Flag Entry',
      requireReason: true,
      danger: false,
      dualSignOff: false,
      action: async (reason) => {
        setBusy(true)
        try {
          const res = await adminDiaryService.flagDiaryEntry({
            entryId: entry.id,
            flagReason: reason,
            reason
          })
          setNotice(res.message || 'Entry flagged for investigation.')
          if (selected?.doc?.id === entry.id) {
            setSelected({ type: 'entry', doc: res.entry })
          }
          loadData()
        } catch (err) {
          setError(err.message || 'Failed to flag entry')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  // Row actions: Soft Delete & Revoke Coins
  const handleDeleteEntry = (entry) => {
    const isHighValue = entry.amount >= 50000

    setConfirmDialog({
      open: true,
      title: `Soft-Delete Entry #${entry.id} & Clawback AgriCoins`,
      message: `Are you sure you want to soft-delete this record? Pursuant to SOP-13 §6, 15 AgriCoins will be clawbacked from ${entry.farmerName}'s wallet ledger.${
        isHighValue ? ' Financial override > ₹50,000 mandates dual-admin sign-off.' : ''
      }`,
      confirmLabel: 'Soft-Delete & Revoke',
      requireReason: true,
      danger: true,
      dualSignOff: isHighValue,
      action: async (reason, dualApprover) => {
        setBusy(true)
        try {
          const res = await adminDiaryService.deleteDiaryEntry({
            entryId: entry.id,
            reason,
            secondApprover: dualApprover
          })
          setNotice(res.message || 'Entry soft-deleted and coins revoked.')
          setSelected(null)
          loadData()
        } catch (err) {
          setError(err.message || 'Failed to soft-delete entry')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  // Verify PnL Record
  const handleVerifyPnl = async (pnl) => {
    setConfirmDialog({
      open: true,
      title: `Verify Crop P&L Statement #${pnl.id}`,
      message: `Attest accuracy of ${pnl.farmerName}'s ${pnl.cropName} (${pnl.season}) statement. This unlocks digital underwriting recommendations for KCC loan approval.`,
      confirmLabel: 'Verify Statement',
      requireReason: true,
      danger: false,
      dualSignOff: false,
      action: async (reason) => {
        setBusy(true)
        try {
          const res = await adminDiaryService.verifyCropPnl({
            pnlId: pnl.id,
            reason
          })
          setNotice(res.message || 'P&L statement verified.')
          if (selected?.doc?.id === pnl.id) {
            setSelected({ type: 'pnl', doc: res.record })
          }
          loadData()
        } catch (err) {
          setError(err.message || 'Failed to verify P&L statement')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  // Open PDF statement review modal
  const handleOpenPdf = async (pnl) => {
    try {
      const report = await adminDiaryService.getPdfReport(pnl.id)
      setPdfModal({ open: true, report })
    } catch (err) {
      setPdfModal({
        open: true,
        report: {
          reportId: pnl.id,
          ...pnl,
          generatedAt: pnl.updatedAt
        }
      })
    }
  }

  // Benchmark Calibration
  const handleCalibrateConfirm = async (crop, payload) => {
    setBusy(true)
    try {
      const res = await adminDiaryService.updateBenchmark({
        crop,
        payload,
        reason: payload.reason || 'Calibrated input cost baseline'
      })
      setCalibrateModal({ open: false, benchmark: null })
      setNotice(res.message || 'Benchmark calibrated successfully.')
      loadData()
    } catch (err) {
      setError(err.message || 'Failed to calibrate benchmark')
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all farm diary entries, crop P&L statements, benchmarks, and audit logs to statutory baseline defaults?')) return
    setBusy(true)
    try {
      await adminDiaryService.resetToDefaultSeed()
      setNotice('Farm Diary & P&L seed data reset to baseline.')
      loadData()
    } catch (err) {
      setError(err.message || 'Reset failed')
    } finally {
      setBusy(false)
    }
  }

  // Export CSV
  const handleExport = () => {
    let rowsToExport = []
    let filenamePrefix = `diary-${tab}`
    if (tab === 'entries') rowsToExport = diaryEntries
    else if (tab === 'pnl') rowsToExport = cropPnlList
    else if (tab === 'benchmarks') rowsToExport = benchmarks
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
      {/* Top Header & Tab Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch tab={tab} setTab={handleTabChange} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCalcModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-50 transition-colors"
            title="Pre-Sowing Break-Even Price Calculator"
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-600" />
            <span>Break-Even Calc</span>
          </button>

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
        <span>Target Collections: farm_diary_entries · crop_pnl · pnl_benchmarks · regional_trends · audit_logs</span>
        <span className="font-semibold text-emerald-800">SOP-13 Superadmin Mode</span>
      </div>

      {/* KPI Metric Summary Bar */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label={tab === 'entries' ? 'Active Bookkeeping Entries' : 'Verified P&L Records'}
          value={metrics.active}
          tone="emerald"
          icon={BookOpen}
          sub={tab === 'entries' ? 'digital ledger entries' : 'crop profit & loss statements'}
        />
        <MetricCard
          label="Pending Review Queue"
          value={metrics.pending}
          tone="amber"
          icon={ShieldCheck}
          sub="awaiting superadmin audit"
        />
        <MetricCard
          label="Today's Accounting Volume"
          value={metrics.today}
          tone="sky"
          icon={TrendingUp}
          sub="logged in last 24 hrs"
        />
        <MetricCard
          label="Flagged Anomaly / Duplicates"
          value={metrics.flagged}
          tone="rose"
          icon={AlertTriangle}
          sub={metrics.extra}
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

      {/* Filter and Search Bar (Visible on Table Tabs) */}
      {(tab === 'entries' || tab === 'pnl') && (
        <FiltersBar
          q={q}
          setQ={(v) => {
            setPage(1)
            setQ(v)
          }}
          status={status}
          setStatus={(v) => {
            setPage(1)
            setStatus(v)
          }}
          statuses={tab === 'entries' ? DIARY_STATUSES : PNL_STATUSES}
          secondaryFilter={secondaryFilter}
          setSecondaryFilter={(v) => {
            setPage(1)
            setSecondaryFilter(v)
          }}
          secondaryOptions={tab === 'entries' ? ENTRY_CATEGORIES : ['all', 'Kharif', 'Rabi', 'Annual']}
          secondaryLabel={tab === 'entries' ? 'All Categories' : 'All Seasons'}
          dateRange={dateRange}
          setDateRange={(v) => {
            setPage(1)
            setDateRange(v)
          }}
          onExport={handleExport}
        >
          {tab === 'entries' && (
            <button
              onClick={() => setCalcModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/80 transition-colors shadow-2xs"
            >
              <Calculator className="h-4 w-4 text-emerald-700" /> Break-Even Calc
            </button>
          )}
        </FiltersBar>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">
          Loading farm bookkeeping and financial records…
        </div>
      ) : tab === 'entries' ? (
        <>
          <DiaryEntriesTable
            entries={sortedRows}
            sort={sort}
            onSort={(key) =>
              setSort((s) => ({
                key,
                dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc'
              }))
            }
            onView={(entry) => setSelected({ type: 'entry', doc: entry })}
            onVerify={handleVerifyEntry}
            onFlag={handleFlagEntry}
            onDelete={handleDeleteEntry}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'pnl' ? (
        <>
          <CropPnlTable
            records={sortedRows}
            sort={sort}
            onSort={(key) =>
              setSort((s) => ({
                key,
                dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc'
              }))
            }
            onView={(pnl) => setSelected({ type: 'pnl', doc: pnl })}
            onPdfView={handleOpenPdf}
            onVerify={handleVerifyPnl}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
        </>
      ) : tab === 'benchmarks' ? (
        <BenchmarksTable
          benchmarks={benchmarks}
          onCalibrate={(benchmark) => setCalibrateModal({ open: true, benchmark })}
          onTestBreakEven={() => setCalcModalOpen(true)}
        />
      ) : tab === 'trends' ? (
        <RegionalTrendsView
          trends={regionalData?.regionalTrends}
          agriCoins={regionalData?.agriCoinsAudit}
          onTestCalculator={() => setCalcModalOpen(true)}
        />
      ) : (
        <DiaryAuditTrailTable
          auditLogs={auditLogs}
          pagination={{ page, limit: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) }}
          onPageChange={setPage}
          loading={loading}
        />
      )}

      {/* Detail Drawer for Inspecting Row JSON and Verification */}
      <DiaryDetailDrawer
        entry={selected?.type === 'entry' ? selected.doc : null}
        pnl={selected?.type === 'pnl' ? selected.doc : null}
        onClose={() => setSelected(null)}
        onVerifyEntry={handleVerifyEntry}
        onFlagEntry={handleFlagEntry}
        onDeleteEntry={handleDeleteEntry}
        onVerifyPnl={handleVerifyPnl}
        onOpenPdf={handleOpenPdf}
      />

      {/* Calibrate Benchmark Modal */}
      <CalibrateBenchmarkModal
        open={calibrateModal.open}
        benchmark={calibrateModal.benchmark}
        busy={busy}
        onConfirm={handleCalibrateConfirm}
        onCancel={() => setCalibrateModal({ open: false, benchmark: null })}
      />

      {/* Pre-sowing Break-Even Price Calculator Modal */}
      <BreakEvenCalculatorModal
        open={calcModalOpen}
        benchmarks={benchmarks}
        onCalculate={adminDiaryService.calculateBreakEven}
        onCancel={() => setCalcModalOpen(false)}
      />

      {/* PDF Statement Review Modal */}
      <PdfReviewModal
        open={pdfModal.open}
        reportData={pdfModal.report}
        onClose={() => setPdfModal({ open: false, report: null })}
      />

      {/* Reason Confirmation Dialog for Destructive / Financial Actions */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        requireReason={confirmDialog.requireReason}
        danger={confirmDialog.danger}
        dualSignOff={confirmDialog.dualSignOff}
        busy={busy}
        onConfirm={(reason, dualApprover) => {
          if (confirmDialog.action) {
            confirmDialog.action(reason, dualApprover)
          }
          setConfirmDialog((prev) => ({ ...prev, open: false }))
        }}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}
