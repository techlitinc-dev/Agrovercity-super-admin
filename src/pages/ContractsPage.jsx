import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMockMode, listContracts, listAcceptances, publishContract, updateContractStatus, releaseEscrow } from '../api/contractsApi'
import ConfirmDialog from '../components/ConfirmDialog'
import ContractDetailDrawer from '../components/contracts/ContractDetailDrawer'
import { MetricCard, FiltersBar, ContractsTable, Pagination } from './contractsWidgets'

const PAGE_SIZE = 20

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

function toCsv(contracts) {
  const head = ['id', 'buyerName', 'farmerName', 'farmerPhone', 'crop', 'quantityQuintals', 'ratePerQuintal', 'status', 'escrowAmount', 'escrowReleased', 'createdAt']
  const rows = contracts.map((c) => head.map((k) => `"${String(c[k] ?? '').replace(/"/g, '""')}"`).join(','))
  return [head.join(','), ...rows].join('\n')
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' })
  const [selected, setSelected] = useState(null)
  const [acceptances, setAcceptances] = useState([])
  const [acceptancesLoading, setAcceptancesLoading] = useState(false)
  const [dialog, setDialog] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await listContracts({ page, pageSize: PAGE_SIZE, q, status, from: dateRange === 'all' ? '' : daysAgoIso(Number(dateRange)) })
      setContracts(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load contracts')
    } finally {
      setLoading(false)
    }
  }, [page, q, status, dateRange])

  useEffect(() => { load() }, [load])

  async function openDrawer(contract) {
    setSelected(contract)
    setAcceptances([])
    setAcceptancesLoading(true)
    try {
      const res = await listAcceptances(contract.id)
      setAcceptances(res.data || [])
    } catch {
      setAcceptances([])
    } finally {
      setAcceptancesLoading(false)
    }
  }

  const sorted = useMemo(() => {
    const list = [...contracts]
    const { key, dir } = sort
    const mul = dir === 'asc' ? 1 : -1
    list.sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return typeof va === 'number' ? (va - vb) * mul : String(va).localeCompare(String(vb)) * mul
    })
    return list
  }, [contracts, sort])

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      active: contracts.filter((c) => ['active', 'published'].includes(c.status)).length,
      pending: contracts.filter((c) => ['draft', 'pending_review'].includes(c.status)).length,
      today: contracts.filter((c) => c.createdAt.slice(0, 10) === today).length,
      flagged: contracts.filter((c) => c.flagged || ['disputed', 'breached'].includes(c.status)).length,
    }
  }, [contracts])

  const actionFor = (kind, payload) => {
    const builders = {
      publish: () => [`Publish contract ${payload.contract.id}?`, 'The approved institutional contract will become visible to farmers for digital MPIN acceptance.', 'Publish', false, false, () => publishContract(payload.contract.id)],
      status: () => [`Set contract ${payload.contract.id} → ${payload.status}?`, 'This state change is written to the immutable audit log with your admin UID and reason.', 'Update Status', ['cancelled', 'breached'].includes(payload.status), false, (reason) => updateContractStatus(payload.contract.id, payload.status, reason)],
      release: () => [`Release ${fmtINR(payload.amount)} from escrow on ${payload.contract.id}?`, 'Payment is released from the corporate buyer escrow account to the farmer ledger and recorded in the audit trail.', 'Release Funds', false, payload.amount > 50000, (reason) => releaseEscrow(payload.contract.id, payload.amount)],
    }
    const [title, message, confirmLabel, danger, dualSignOff, run] = builders[kind]()
    setDialog({ kind, contract: payload.contract, title, message, confirmLabel, danger, dualSignOff, run, status: payload.status, amount: payload.amount })
  }

  async function handleConfirm(reason) {
    const { run, kind, contract, status: newStatus } = dialog
    setDialog(null)
    try {
      const updated = await run(reason)
      setSelected((s) => s && { ...s, ...(updated || {}), status: kind === 'publish' ? 'published' : (newStatus || s.status), updatedAt: new Date().toISOString() })
      load()
    } catch (err) {
      setError(err.message || 'Action failed')
    }
  }

  function handleExport() {
    const blob = new Blob([toCsv(contracts)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `buyer-contracts-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Total Active" value={metrics.active} tone="emerald" sub="published + active contracts" />
        <MetricCard label="Pending Action" value={metrics.pending} tone="amber" sub="drafts & review queue" />
        <MetricCard label="Today's Volume" value={metrics.today} tone="sky" sub="new contracts today" />
        <MetricCard label="Flagged / Disputed" value={metrics.flagged} tone="rose" sub="needs arbitration" />
      </div>

      {isMockMode() && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Backend unreachable at <span className="font-mono">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1'}</span> — displaying mock data. Set a valid admin ID token and API base URL for live data.
        </div>
      )}
      {error && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</div>}

      <FiltersBar q={q} setQ={(v) => { setPage(1); setQ(v) }} status={status} setStatus={(v) => { setPage(1); setStatus(v) }} dateRange={dateRange} setDateRange={(v) => { setPage(1); setDateRange(v) }} onExport={handleExport} />

      {loading ? (
        <div className="rounded-xl border border-slate-800 py-16 text-center text-slate-500">Loading contracts…</div>
      ) : (
        <ContractsTable contracts={sorted} sort={sort} onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))} onView={openDrawer} />
      )}

      <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />

      <DetailDrawer
        contract={selected}
        acceptances={acceptances}
        acceptancesLoading={acceptancesLoading}
        onClose={() => setSelected(null)}
        onPublish={(c) => actionFor('publish', { contract: c })}
        onStatusChange={(c, s) => actionFor('status', { contract: c, status: s })}
        onReleaseEscrow={(c, amount) => actionFor('release', { contract: c, amount })}
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

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}
