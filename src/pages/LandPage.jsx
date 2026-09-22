import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMockMode, listLeases, listListings, inspectAgreement, listReminders, terminateLease, auditListing } from '../api/landApi'
import ConfirmDialog from '../components/ConfirmDialog'
import LandDetailDrawer from '../components/land/LandDetailDrawer'
import { MetricCard, FiltersBar, TabSwitch, LeasesTable, ListingsTable, Pagination } from './landWidgets'

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

export default function LandPage() {
  const [tab, setTab] = useState('leases')
  const [leases, setLeases] = useState([])
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })
  const [selected, setSelected] = useState(null)
  const [agreement, setAgreement] = useState(null)
  const [agreementLoading, setAgreementLoading] = useState(false)
  const [reminders, setReminders] = useState([])
  const [remindersLoading, setRemindersLoading] = useState(false)
  const [dialog, setDialog] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = { page, pageSize: PAGE_SIZE, q, status, from: dateRange === 'all' ? '' : daysAgoIso(Number(dateRange)) }
    try {
      const res = tab === 'leases' ? await listLeases(params) : await listListings(params)
      if (tab === 'leases') setLeases(res.data || [])
      else setListings(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load land records')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, dateRange])

  useEffect(() => { load() }, [load])

  const rows = tab === 'leases' ? leases : listings

  async function openDrawer(doc) {
    setSelected({ type: tab, doc })
    setAgreement(null)
    setReminders([])
    if (tab === 'leases') {
      setAgreementLoading(true)
      setRemindersLoading(true)
      inspectAgreement(doc.id).then((a) => setAgreement(a)).catch(() => setAgreement(null)).finally(() => setAgreementLoading(false))
      listReminders(doc.id).then((r) => setReminders(r.data || [])).catch(() => setReminders([])).finally(() => setRemindersLoading(false))
    }
  }

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
    if (tab === 'leases') {
      return {
        active: leases.filter((l) => l.status === 'active').length,
        pending: leases.filter((l) => ['expiring', 'disputed'].includes(l.status)).length,
        today: leases.filter((l) => l.createdAt.slice(0, 10) === today).length,
        flagged: leases.filter((l) => l.flagged || l.status === 'disputed').length,
      }
    }
    return {
      active: listings.filter((x) => x.status === 'available').length,
      pending: listings.filter((x) => x.status === 'pending_audit').length,
      today: listings.filter((x) => x.createdAt.slice(0, 10) === today).length,
      flagged: listings.filter((x) => x.flagged || !x.sevenTwelveVerified).length,
    }
  }, [tab, leases, listings])

  const actionFor = (kind, payload) => {
    const builders = {
      terminate: () => {
        const dual = payload.lease.status === 'disputed' || payload.lease.monthlyRent > 50000
        return [
          `Arbitrated termination of lease ${payload.lease.id}?`,
          'The lease agreement is terminated with immediate effect. The security deposit resolution and this arbitration reason are written to the immutable audit log.',
          'Terminate Lease',
          true,
          dual,
          (reason) => terminateLease(payload.lease.id, reason, dual ? 'forfeited' : 'refunded_tenant'),
        ]
      },
      verify: () => [
        `Verify listing ${payload.listing.id} against 7/12 records?`,
        'The survey number and owner name will be marked as matching the official MahaBhulekh 7/12 extract and the listing will go live.',
        'Verify Listing',
        false,
        false,
        (reason) => auditListing(payload.listing.id, true, reason),
      ],
      flag: () => [
        `Flag listing ${payload.listing.id} as fraudulent?`,
        'The listing will be pulled from the marketplace immediately and a fraud flag will be recorded with your reason for the audit trail.',
        'Flag Fraudulent',
        true,
        false,
        (reason) => auditListing(payload.listing.id, false, reason),
      ],
    }
    const [title, message, confirmLabel, danger, dualSignOff, run] = builders[kind]()
    setDialog({ title, message, confirmLabel, danger, dualSignOff, run, doc: payload.lease || payload.listing })
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

  function handleExport() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `land-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabSwitch tab={tab} setTab={(t) => { setPage(1); setStatus('all'); setSort({ key: 'createdAt', dir: 'desc' }); setTab(t) }} />
        <span className="font-mono text-xs text-slate-500">Collections: land_plots · land_leases · land_lease_payments · land_listings · lease_requests</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tab === 'leases' ? (
          <>
            <MetricCard label="Active Leases" value={metrics.active} tone="emerald" sub="in good standing" />
            <MetricCard label="Pending Action" value={metrics.pending} tone="amber" sub="expiring & disputed" />
            <MetricCard label="Today's Volume" value={metrics.today} tone="sky" sub="new leases today" />
            <MetricCard label="Disputed / Flagged" value={metrics.flagged} tone="rose" sub="needs arbitration" />
          </>
        ) : (
          <>
            <MetricCard label="Available Listings" value={metrics.active} tone="teal" sub="live for lease requests" />
            <MetricCard label="Pending 7/12 Audit" value={metrics.pending} tone="amber" sub="verification queue" />
            <MetricCard label="Today's Volume" value={metrics.today} tone="sky" sub="new listings today" />
            <MetricCard label="Flagged / Unverified" value={metrics.flagged} tone="rose" sub="fraud risk" />
          </>
        )}
      </div>

      {isMockMode() && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Backend unreachable at <span className="font-mono">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'}</span> — displaying mock data. Set a valid admin ID token and API base URL for live data.
        </div>
      )}
      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>}

      <FiltersBar q={q} setQ={(v) => { setPage(1); setQ(v) }} status={status} setStatus={(v) => { setPage(1); setStatus(v) }} statuses={tab === 'leases' ? LEASE_STATUSES : LISTING_STATUSES} dateRange={dateRange} setDateRange={(v) => { setPage(1); setDateRange(v) }} onExport={handleExport} />

      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 py-16 text-center text-xs text-slate-500 shadow-xs">Loading land records…</div>
      ) : tab === 'leases' ? (
        <LeasesTable leases={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={openDrawer} />
      ) : (
        <ListingsTable listings={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={openDrawer} />
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />

      <LandDetailDrawer
        lease={selected?.type === 'lease' ? selected.doc : null}
        listing={selected?.type === 'listing' ? selected.doc : null}
        agreement={agreement}
        agreementLoading={agreementLoading}
        reminders={reminders}
        remindersLoading={remindersLoading}
        onClose={() => setSelected(null)}
        onTerminate={(lease) => actionFor('terminate', { lease })}
        onAuditListing={(listing, verified) => actionFor(verified ? 'verify' : 'flag', { listing })}
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
    </div>
  )
}

const LEASE_STATUSES = ['active', 'expiring', 'disputed', 'terminated', 'expired']
const LISTING_STATUSES = ['available', 'pending_audit', 'leased', 'flagged', 'removed']
