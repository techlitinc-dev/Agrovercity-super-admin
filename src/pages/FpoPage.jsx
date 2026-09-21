import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Building2,
  Package,
  Users,
  Tractor,
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
  getFpoSummary,
  listFpos,
  verifyFpo,
  listFpoPools,
  createFpoPool,
  updatePoolStatus,
  listPoolMembers,
  listFpoMachinery,
  getFpoAuditLogs
} from '../api/fpoApi'
import {
  fmtINR,
  MetricCard,
  TabSwitch,
  FiltersBar,
  FposTable,
  FpoPoolsTable,
  PoolMembersTable,
  MachineryTable,
  AuditLogTable,
  Pagination
} from './fpoWidgets'
import FpoDetailDrawer from '../components/fpo/FpoDetailDrawer'
import {
  VerifyFpoModal,
  CreateFpoPoolModal,
  ClosePoolDispatchPoModal
} from '../components/fpo/FpoModals'
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

export default function FpoPage() {
  const { addToast } = useNotification() || { addToast: () => {} }

  const [tab, setTab] = useState('fpos') // 'fpos' | 'pools' | 'members' | 'machinery' | 'audit'
  const [fpos, setFpos] = useState([])
  const [pools, setPools] = useState([])
  const [members, setMembers] = useState([])
  const [machinery, setMachinery] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [summary, setSummary] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [district, setDistrict] = useState('all')

  // Detail Drawer
  const [drawerSelection, setDrawerSelection] = useState({ item: null, type: 'fpo' })

  // Modals
  const [verifyFpoModal, setVerifyFpoModal] = useState({ open: false, fpo: null })
  const [createPoolOpen, setCreatePoolOpen] = useState(false)
  const [closePoolModal, setClosePoolModal] = useState({ open: false, pool: null })

  // 1. Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      const res = await getFpoSummary()
      setSummary(res)
    } catch (err) {
      console.warn('Failed to load FPO summary:', err)
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
      if (tab === 'fpos') {
        const res = await listFpos({
          page,
          pageSize: PAGE_SIZE,
          q,
          verificationStatus: status,
          district
        })
        setFpos(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'pools') {
        const res = await listFpoPools({
          page,
          pageSize: PAGE_SIZE,
          q,
          status
        })
        setPools(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'members') {
        const res = await listPoolMembers({
          page,
          pageSize: PAGE_SIZE,
          q
        })
        setMembers(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'machinery') {
        const res = await listFpoMachinery()
        setMachinery(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'audit') {
        const res = await getFpoAuditLogs({ page, pageSize: PAGE_SIZE })
        setAuditLogs(res.data || [])
        setTotal(res.total || 0)
      }
    } catch (err) {
      setError(err.message || 'Failed to load FPO management data')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, district])

  useEffect(() => {
    loadTabData()
  }, [loadTabData])

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setStatus('all')
  }

  // Action: Verify FPO Credentials
  const handleVerifyFpoConfirm = async (payload) => {
    try {
      const res = await verifyFpo(payload.fpoId, payload)
      addToast({
        title: 'FPO Verified',
        message: `${res.fpo?.name || 'FPO'} verified with ROC & NABARD credentials.`,
        type: 'success'
      })
      if (drawerSelection.item && drawerSelection.item.id === payload.fpoId) {
        setDrawerSelection({ item: res.fpo, type: 'fpo' })
      }
      await loadTabData()
      await loadSummary()
    } catch (err) {
      addToast({
        title: 'Verification Failed',
        message: err.message || 'Could not verify FPO.',
        type: 'error'
      })
      throw err
    }
  }

  // Action: Create Group Buy Pool
  const handleCreatePoolConfirm = async (payload) => {
    try {
      const res = await createFpoPool(payload)
      addToast({
        title: 'Procurement Pool Launched',
        message: `${res.pool?.poolName} opened for member pledging with ${res.pool?.targetQuantity} ${res.pool?.quantityUnit} target.`,
        type: 'success'
      })
      await loadTabData()
      await loadSummary()
    } catch (err) {
      addToast({
        title: 'Launch Failed',
        message: err.message || 'Could not create procurement pool.',
        type: 'error'
      })
      throw err
    }
  }

  // Action: Close Pool & Dispatch PO
  const handleClosePoolConfirm = async (payload) => {
    try {
      const res = await updatePoolStatus(payload.poolId, payload)
      addToast({
        title: 'Purchase Order Dispatched',
        message: `Pool ${res.pool?.poolName} closed and PO dispatched to apex supplier.`,
        type: 'success'
      })
      if (drawerSelection.item && drawerSelection.item.id === payload.poolId) {
        setDrawerSelection({ item: res.pool, type: 'pool' })
      }
      await loadTabData()
      await loadSummary()
    } catch (err) {
      addToast({
        title: 'Dispatch Failed',
        message: err.message || 'Could not dispatch purchase order.',
        type: 'error'
      })
      throw err
    }
  }

  // Export CSV
  const handleExportCsv = () => {
    if (tab === 'fpos') {
      const csv = toCsv(fpos)
      downloadBlob(csv, `Registered_FPOs_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${fpos.length} FPO records.`, type: 'success' })
    } else if (tab === 'pools') {
      const csv = toCsv(pools)
      downloadBlob(csv, `Procurement_Pools_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${pools.length} procurement pools.`, type: 'success' })
    } else if (tab === 'members') {
      const csv = toCsv(members)
      downloadBlob(csv, `Pool_Member_Pledges_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${members.length} member pledges.`, type: 'success' })
    } else if (tab === 'machinery') {
      const csv = toCsv(machinery)
      downloadBlob(csv, `Shared_Machinery_CHCs_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${machinery.length} machinery units.`, type: 'success' })
    } else {
      const csv = toCsv(auditLogs)
      downloadBlob(csv, `FPO_Audit_Logs_${Date.now()}.csv`)
      addToast({ title: 'CSV Exported', message: `Exported ${auditLogs.length} audit logs.`, type: 'success' })
    }
  }

  const counts = useMemo(() => {
    return {
      fpos: summary?.totalRegisteredFpos || fpos.length,
      pools: summary?.activeProcurementPools || pools.length,
      members: members.length || 8,
      machinery: summary?.sharedMachineryUnits || machinery.length,
      audit: auditLogs.length || 4
    }
  }, [summary, fpos.length, pools.length, members.length, machinery.length, auditLogs.length])

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb Details */}
      <div className="px-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>FPO Engine &amp; Bulk Procurement Pools</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    SOP-18
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  FPO credential verification, collective group buy pools with tiered manufacturer discounts, and shared CHC machinery management.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCreatePoolOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Package className="w-4 h-4" />
              <span>+ Launch Group Buy Pool</span>
            </button>

            <button
              onClick={() => {
                setTab('fpos')
                setStatus('pending_verification')
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Pending Verifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Registered FPOs"
          value={summary?.totalRegisteredFpos || 142}
          subtext="ROC / SFAC Empaneled"
          icon={Building2}
          color="emerald"
          onClick={() => {
            setTab('fpos')
            setStatus('all')
          }}
        />

        <MetricCard
          title="Verified FPOs"
          value={summary?.verifiedFpos || 128}
          subtext="Penny-Drop Validated"
          icon={ShieldCheck}
          color="cyan"
          onClick={() => {
            setTab('fpos')
            setStatus('verified')
          }}
        />

        <MetricCard
          title="Active Pools"
          value={summary?.activeProcurementPools || 18}
          subtext="Bulk Group Buying"
          icon={Package}
          color="blue"
          onClick={() => {
            setTab('pools')
            setStatus('open_pledging')
          }}
        />

        <MetricCard
          title="Collective Turnover"
          value={`₹${summary?.totalCollectiveTurnoverCr || '24.8'} Cr`}
          subtext="Annual GMV Processed"
          icon={Coins}
          color="purple"
          onClick={() => {
            setTab('pools')
          }}
        />

        <MetricCard
          title="Farmer Savings"
          value={`₹${summary?.farmerSavingsGeneratedCr || '4.95'} Cr`}
          subtext="Volume Tier Rebates"
          icon={Zap}
          color="emerald"
          onClick={() => {
            setTab('pools')
          }}
        />

        <MetricCard
          title="Shared Machinery"
          value={summary?.sharedMachineryUnits || 84}
          subtext="CHC Equipment Fleet"
          icon={Tractor}
          color="cyan"
          onClick={() => {
            setTab('machinery')
          }}
        />
      </div>

      {/* Main Table Card */}
      <div className="mx-6 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        {/* Navigation Tabs */}
        <TabSwitch activeTab={tab} onChangeTab={handleTabChange} counts={counts} />

        {/* Filter Controls */}
        <FiltersBar
          tab={tab}
          q={q}
          setQ={setQ}
          status={status}
          setStatus={setStatus}
          district={district}
          setDistrict={setDistrict}
          onExportCsv={handleExportCsv}
          onCreatePool={() => setCreatePoolOpen(true)}
          onOpenPendingVerification={() => {
            setTab('fpos')
            setStatus('pending_verification')
          }}
        />

        {/* Loading / Error States */}
        {loading && (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-400" />
            <p className="text-sm">Loading FPO engine and bulk procurement data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center text-rose-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={loadTabData}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Content Tables */}
        {!loading && !error && (
          <>
            {tab === 'fpos' && (
              <>
                <FposTable
                  fpos={fpos}
                  onSelectFpo={(f) => setDrawerSelection({ item: f, type: 'fpo' })}
                  onVerifyFpo={(f) => setVerifyFpoModal({ open: true, fpo: f })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'pools' && (
              <>
                <FpoPoolsTable
                  pools={pools}
                  onSelectPool={(p) => setDrawerSelection({ item: p, type: 'pool' })}
                  onClosePool={(p) => setClosePoolModal({ open: true, pool: p })}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'members' && (
              <>
                <PoolMembersTable
                  members={members}
                  onSelectMember={(m) => {
                    const matchPool = pools.find((p) => p.id === m.poolId)
                    if (matchPool) {
                      setDrawerSelection({ item: matchPool, type: 'pool' })
                    }
                  }}
                />
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}

            {tab === 'machinery' && (
              <MachineryTable
                machinery={machinery}
                onSelectMachinery={(m) => setDrawerSelection({ item: m, type: 'machinery' })}
              />
            )}

            {tab === 'audit' && (
              <>
                <AuditLogTable logs={auditLogs} />
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
      <FpoDetailDrawer
        item={drawerSelection.item}
        type={drawerSelection.type}
        onClose={() => setDrawerSelection({ item: null, type: 'fpo' })}
        onVerifyFpo={(f) => setVerifyFpoModal({ open: true, fpo: f })}
        onClosePool={(p) => setClosePoolModal({ open: true, pool: p })}
      />

      {/* Verify FPO Modal */}
      <VerifyFpoModal
        open={verifyFpoModal.open}
        fpo={verifyFpoModal.fpo}
        onClose={() => setVerifyFpoModal({ open: false, fpo: null })}
        onConfirm={handleVerifyFpoConfirm}
      />

      {/* Create Group Buy Pool Modal */}
      <CreateFpoPoolModal
        open={createPoolOpen}
        fpos={fpos}
        onClose={() => setCreatePoolOpen(false)}
        onConfirm={handleCreatePoolConfirm}
      />

      {/* Close Pool & Dispatch PO Modal */}
      <ClosePoolDispatchPoModal
        open={closePoolModal.open}
        pool={closePoolModal.pool}
        onClose={() => setClosePoolModal({ open: false, pool: null })}
        onConfirm={handleClosePoolConfirm}
      />
    </div>
  )
}
