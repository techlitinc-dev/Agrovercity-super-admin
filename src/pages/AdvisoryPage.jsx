import { useCallback, useEffect, useMemo, useState } from 'react'
import { RadioTower, Satellite } from 'lucide-react'
import { isMockMode, listScans, listPestAlerts, listSoilTests, getNpkConfig, broadcastPestAlert, uploadSoilResults, updateScanStatus } from '../api/advisoryApi'
import ConfirmDialog from '../components/ConfirmDialog'
import AdvisoryDetailDrawer from '../components/advisory/AdvisoryDetailDrawer'
import { BroadcastAlertModal, LabResultModal } from '../components/advisory/AdvisoryModals'
import { MetricCard, FiltersBar, TabSwitch, ScansTable, AlertsTable, SoilTestsTable, Pagination, SCAN_STATUSES, ALERT_STATUSES, SOIL_STATUSES } from './advisoryWidgets'

const PAGE_SIZE = 20

function toCsv(rows) {
  if (rows.length === 0) return ''
  const head = Object.keys(rows[0])
  const lines = rows.map((r) => head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))
  return [head.join(','), ...lines].join('\n')
}

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

const STATUS_KEYS = { scans: SCAN_STATUSES, alerts: ALERT_STATUSES, soil: SOIL_STATUSES }

export default function AdvisoryPage() {
  const [tab, setTab] = useState('scans')
  const [scans, setScans] = useState([])
  const [alerts, setAlerts] = useState([])
  const [soilTests, setSoilTests] = useState([])
  const [npkConfig, setNpkConfig] = useState(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })
  const [selected, setSelected] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [broadcastModal, setBroadcastModal] = useState({ open: false, preset: null })
  const [labModal, setLabModal] = useState({ open: false, test: null })
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = { page, pageSize: PAGE_SIZE, q, status, from: dateRange === 'all' ? '' : daysAgoIso(Number(dateRange)) }
    try {
      const res = tab === 'scans' ? await listScans(params) : tab === 'alerts' ? await listPestAlerts(params) : await listSoilTests(params)
      if (tab === 'scans') setScans(res.data || [])
      else if (tab === 'alerts') setAlerts(res.data || [])
      else setSoilTests(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load advisory data')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, dateRange])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    getNpkConfig().then(setNpkConfig).catch(() => setNpkConfig(null))
  }, [])

  const rows = tab === 'scans' ? scans : tab === 'alerts' ? alerts : soilTests

  const sorted = useMemo(() => {
    const list = [...rows]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return typeof va === 'number' ? (va - vb) * mul : String(va).localeCompare(String(vb)) * mul
    })
    return list
  }, [rows, sort])

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    if (tab === 'scans') {
      const feedbackable = scans.filter((s) => s.farmerFeedback !== 'pending')
      return {
        active: scans.filter((s) => s.status === 'confirmed').length,
        pending: scans.filter((s) => s.status === 'pending_review').length,
        today: scans.filter((s) => s.createdAt.slice(0, 10) === today).length,
        flagged: scans.filter((s) => s.farmerFeedback === 'false_positive').length,
        extra: feedbackable.length > 0
          ? `${Math.round((1 - (feedbackable.filter((s) => s.farmerFeedback === 'false_positive').length / feedbackable.length)) * 100)}% diagnosis accuracy`
          : '',
      }
    }
    if (tab === 'alerts') {
      return {
        active: alerts.filter((a) => a.status === 'active').length,
        pending: alerts.filter((a) => a.status === 'scheduled').length,
        today: alerts.filter((a) => a.createdAt.slice(0, 10) === today).length,
        flagged: alerts.filter((a) => a.severity === 'critical').length,
        extra: `${alerts.reduce((sum, a) => sum + (a.recipientsNotified || 0), 0).toLocaleString('en-IN')} farmers notified`,
      }
    }
    return {
      active: soilTests.filter((t) => t.status === 'result_uploaded').length,
      pending: soilTests.filter((t) => ['sample_collected', 'lab_processing'].includes(t.status)).length,
      today: soilTests.filter((t) => t.createdAt.slice(0, 10) === today).length,
      flagged: soilTests.filter((t) => t.status === 'failed').length,
      extra: '',
    }
  }, [tab, scans, alerts, soilTests])

  const actionFor = (kind, payload) => {
    const builders = {
      false_positive: () => [
        `Mark scan ${payload.scan.id} as false positive?`,
        'The scan is recorded as a model miss for accuracy monitoring and the false-positive feedback is attributed to the model version that produced it.',
        'Mark False Positive',
        true,
        false,
        (reason) => updateScanStatus(payload.scan.id, 'false_positive', reason),
      ],
    }
    const [title, message, confirmLabel, danger, dualSignOff, run] = builders[kind]()
    setDialog({ title, message, confirmLabel, danger, dualSignOff, run, doc: payload.scan })
  }

  async function handleConfirm(reason) {
    const { run, doc } = dialog
    setDialog(null)
    try {
      const updated = await run(reason)
      setSelected((s) => s && { ...s, doc: { ...s.doc, ...(updated || {}) } })
      load()
    } catch (err) {
      setError(err.message || 'Action failed')
    }
  }

  async function handleBroadcast(form, reason) {
    setBusy(true)
    try {
      await broadcastPestAlert({
        pestName: form.pestName,
        district: form.district,
        severity: form.severity,
        crop: form.crop,
        radiusKm: Number(form.radiusKm),
        message: form.message,
        scheduledFor: form.schedule ? new Date(form.schedule).toISOString() : undefined,
        reason,
      })
      setBroadcastModal({ open: false, preset: null })
      setSelected(null)
      setTab('alerts')
      load()
    } catch (err) {
      setError(err.message || 'Broadcast failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleLabUpload(form, reason) {
    const test = labModal.test
    setBusy(true)
    try {
      const updated = await uploadSoilResults(test.id, {
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        ph: Number(form.ph),
        organicCarbon: Number(form.organicCarbon),
        recommendation: form.recommendation,
        reportUrl: form.reportUrl,
        reason,
      })
      setLabModal({ open: false, test: null })
      setSelected((s) => s && s.doc.id === test.id ? { ...s, doc: updated } : s)
      load()
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  function handleExport() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `advisory-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch tab={tab} setTab={(t) => { setPage(1); setStatus('all'); setSort({ key: 'createdAt', dir: 'desc' }); setTab(t) }} />
        <span className="font-mono text-xs text-slate-500">Collections: advisory_scans · pest_alerts · soil_tests · crop_cycles</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label={tab === 'soil' ? 'Results Uploaded' : tab === 'alerts' ? 'Active Alerts' : 'Confirmed Diagnoses'} value={metrics.active} tone="emerald" sub={tab === 'soil' ? 'with farmer notification' : tab === 'alerts' ? 'live on pest radar' : 'farmer verified'} />
        <MetricCard label="Pending Action" value={metrics.pending} tone="amber" sub={tab === 'soil' ? 'collection & lab queue' : tab === 'alerts' ? 'scheduled broadcasts' : 'review queue'} />
        <MetricCard label="Today's Volume" value={metrics.today} tone="sky" sub={`new ${tab === 'soil' ? 'samples' : tab === 'alerts' ? 'alerts' : 'scans'} today`} />
        <MetricCard label={tab === 'scans' ? 'False Positives' : tab === 'alerts' ? 'Critical Severity' : 'Failed Tests'} value={metrics.flagged} tone="rose" sub={metrics.extra || (tab === 'scans' ? 'model accuracy feedback' : undefined)} />
      </div>

      {isMockMode() && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Backend unreachable at <span className="font-mono">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'}</span> — displaying mock data. Set a valid admin ID token and API base URL for live data.
        </div>
      )}
      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>}

      <FiltersBar q={q} setQ={(v) => { setPage(1); setQ(v) }} status={status} setStatus={(v) => { setPage(1); setStatus(v) }} statuses={STATUS_KEYS[tab]} dateRange={dateRange} setDateRange={(v) => { setPage(1); setDateRange(v) }} onExport={handleExport}>
        {tab === 'alerts' && (
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500" onClick={() => setBroadcastModal({ open: true, preset: null })}>
            <RadioTower className="h-4 w-4" /> Broadcast Alert
          </button>
        )}
        {tab === 'scans' && npkConfig && (
          <span className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-mono font-semibold text-emerald-900 shadow-2xs" title={npkConfig.params.map((p) => `${p.key}=${p.value}${p.unit}`).join(' · ')}>
            <Satellite className="h-3.5 w-3.5 text-emerald-600" /> {npkConfig.algorithmVersion} · reviewed {npkConfig.lastReviewedAt?.slice(0, 10)}
          </span>
        )}
      </FiltersBar>

      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">Loading advisory data…</div>
      ) : tab === 'scans' ? (
        <ScansTable scans={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={(doc) => setSelected({ type: 'scans', doc })} />
      ) : tab === 'alerts' ? (
        <AlertsTable alerts={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={(doc) => setSelected({ type: 'alerts', doc })} />
      ) : (
        <SoilTestsTable tests={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={(doc) => setSelected({ type: 'soil', doc })} />
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />

      <AdvisoryDetailDrawer
        entity={selected?.doc}
        tab={selected?.type}
        npkConfig={npkConfig}
        onClose={() => setSelected(null)}
        onMarkFalsePositive={(scan) => actionFor('false_positive', { scan })}
        onBroadcast={(alert) => setBroadcastModal({ open: true, preset: alert })}
        onUploadResults={(test) => setLabModal({ open: true, test })}
      />

      <ConfirmDialog
        open={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        danger={dialog?.danger}
        dualSignOff={dialog?.dualSignOff}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <BroadcastAlertModal open={broadcastModal.open} preset={broadcastModal.preset} busy={busy} onConfirm={handleBroadcast} onCancel={() => setBroadcastModal({ open: false, preset: null })} />
      <LabResultModal open={labModal.open} test={labModal.test} busy={busy} onConfirm={handleLabUpload} onCancel={() => setLabModal({ open: false, test: null })} />
    </div>
  )
}
