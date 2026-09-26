import React, { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Sliders
} from 'lucide-react'
import {
  getGamificationSummary,
  listGamificationStatus,
  listAgriCoinsLedger,
  manualAdjustCoins,
  batchAdjustCoins,
  listRewardCoupons,
  createRewardCoupon,
  updateRewardCoupon,
  toggleCouponStatus,
  batchUpdateCouponStatus,
  listReferrals,
  banReferralFraudUser,
  batchUpdateReferralStatus,
  listRatings,
  removeRating,
  approveRating,
  batchUpdateRatingStatus,
  getEarnRates,
  updateEarnRates,
  getGamificationAuditLogs,
  resetGamificationSeedData
} from '../api/gamificationApi'
import {
  GamificationMetricBar,
  GamificationTabSwitch,
  GamificationFiltersBar,
  BatchActionBar,
  GamificationTiersTable,
  AgriCoinsLedgerTable,
  RewardCouponsTable,
  ReferralsTable,
  RatingsTable,
  GamificationAuditLogsTable,
  ContentPagination
} from './gamificationWidgets'
import GamificationDetailDrawer from '../components/gamification/GamificationDetailDrawer'
import {
  AuditReasonModal,
  DualSignOffModal,
  ManualAdjustCoinsModal,
  CreateEditCouponModal,
  ConfigureEarnRatesModal,
  BatchActionModal,
  ResetSeedModal
} from '../components/gamification/GamificationModals'
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

export default function GamificationPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, hasPermission } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin', role: 'SUPER_ADMIN' }, hasPermission: () => true }

  const role = currentAdmin?.role || 'SUPER_ADMIN'
  const isFinancialAuditor = role === 'FINANCIAL_AUDITOR'
  const canMutate = hasPermission('gamification.manage') && !isFinancialAuditor

  const [activeTab, setActiveTab] = useState('tiers') // 'tiers', 'ledger', 'rewards', 'referrals', 'ratings', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extraFilter, setExtraFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [persona, setPersona] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data & Multi-row Selection
  const [tableData, setTableData] = useState({ data: [], total: 0 })
  const [selectedIds, setSelectedIds] = useState([])

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [adjustCoinsModal, setAdjustCoinsModal] = useState({ open: false, user: null })
  const [couponModal, setCouponModal] = useState({ open: false, coupon: null })
  const [earnRatesModal, setEarnRatesModal] = useState({ open: false, rates: null })
  const [batchModal, setBatchModal] = useState({ open: false, action: '', title: '', count: 0 })
  const [resetModalOpen, setResetModalOpen] = useState(false)

  // Confirmation & Dual Sign-off
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

  // 1. Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      const s = await getGamificationSummary()
      setSummary(s)
    } catch (err) {
      console.warn('Failed to load gamification summary:', err)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  const handleTabSelect = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setExtraFilter('all')
    setDateRange('all')
    setPersona('all')
    setSelectedIds([])
  }

  // 2. Load Table Data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      if (activeTab === 'tiers') {
        res = await listGamificationStatus({
          q: search,
          tier: extraFilter,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ledger') {
        res = await listAgriCoinsLedger({
          q: search,
          type: extraFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'rewards') {
        res = await listRewardCoupons({
          q: search,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'referrals') {
        res = await listReferrals({
          q: search,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ratings') {
        res = await listRatings({
          q: search,
          targetType: extraFilter,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getGamificationAuditLogs({
          q: search,
          actionType: statusFilter,
          dateRange,
          page,
          pageSize: PAGE_SIZE
        })
      }
      setTableData(res)
    } catch (err) {
      addToast({
        title: 'Load Error',
        message: err.message || 'Failed to fetch gamification data.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, statusFilter, extraFilter, dateRange, persona, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Multi-row Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked) => {
    if (checked && tableData.data) {
      setSelectedIds(tableData.data.map((item) => item.userId || item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleOpenDrawer = (entity) => {
    setSelectedEntity(entity)
    setDrawerOpen(true)
  }

  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast({ title: 'Export Failed', message: 'No records to export.', type: 'warning' })
      return
    }
    const csv = toCsv(tableData.data)
    downloadBlob(csv, `gamification_${activeTab}_export.csv`)
    addToast({ title: 'Export Complete', message: `Exported ${tableData.data.length} records.`, type: 'success' })
  }

  // -------------------------------------------------------------
  // COIN ADJUSTMENT ACTION & DUAL SIGN-OFF (> 50,000 coins)
  // -------------------------------------------------------------
  const handleAdjustCoinsAction = (userId, delta, reason) => {
    if (!canMutate) return
    const amount = Math.abs(delta)
    if (amount > 50000) {
      setDualSignOffDialog({
        open: true,
        title: 'Dual Sign-Off: High-Value AgriCoins Adjustment (> 50,000 Coins)',
        amount,
        details: `Adjusting ${delta > 0 ? '+' : ''}${delta.toLocaleString()} Coins for User ${userId}. Under SOP-22 governance, mutations exceeding 50,000 coins mandate secondary officer authentication.`,
        onConfirm: async ({ secondAdminEmail, reason: dualReason }) => {
          try {
            await manualAdjustCoins(
              userId,
              delta,
              `${reason} - ${dualReason}`,
              secondAdminEmail,
              currentAdmin?.uid,
              currentAdmin?.name
            )
            addToast({
              title: 'Coins Adjusted (Dual Sign-Off)',
              message: `Applied ${delta} coins mutation with counter-sign by ${secondAdminEmail}.`,
              type: 'success'
            })
            setDualSignOffDialog({ open: false })
            setAdjustCoinsModal({ open: false, user: null })
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Adjustment Failed', message: err.message, type: 'error' })
          }
        }
      })
    } else {
      (async () => {
        try {
          await manualAdjustCoins(userId, delta, reason, null, currentAdmin?.uid, currentAdmin?.name)
          addToast({
            title: 'Coins Adjusted',
            message: `Successfully updated balance by ${delta > 0 ? '+' : ''}${delta.toLocaleString()} coins.`,
            type: 'success'
          })
          setAdjustCoinsModal({ open: false, user: null })
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Error', message: err.message, type: 'error' })
        }
      })()
    }
  }

  // -------------------------------------------------------------
  // REWARDS VOUCHER ACTIONS
  // -------------------------------------------------------------
  const handleSaveCoupon = async (formData) => {
    if (!canMutate) return
    try {
      if (couponModal.coupon) {
        await updateRewardCoupon(couponModal.coupon.id, formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Voucher Updated', message: 'Rewards voucher parameters saved.', type: 'success' })
      } else {
        await createRewardCoupon(formData, currentAdmin?.uid, currentAdmin?.name)
        addToast({ title: 'Voucher Added', message: 'New reward coupon published to store.', type: 'success' })
      }
      setCouponModal({ open: false, coupon: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Voucher Error', message: err.message, type: 'error' })
    }
  }

  const handleToggleCouponStatus = async (coupon) => {
    if (!canMutate) return
    const nextStatus = coupon.status === 'active' ? 'paused' : 'active'
    try {
      await toggleCouponStatus(
        coupon.id,
        nextStatus,
        `Voucher state transitioned to ${nextStatus}`,
        currentAdmin?.uid,
        currentAdmin?.name
      )
      addToast({
        title: 'Voucher Status Changed',
        message: `${coupon.title} is now ${nextStatus}.`,
        type: 'success'
      })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Status Error', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // REFERRAL FRAUD & VERIFICATION
  // -------------------------------------------------------------
  const handleBanFraudUser = (userId, userName) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Ban Referral Fraud Syndicate',
      message: `Ban user ${userName} (${userId}) and execute coin clawback on all associated referral accounts?`,
      confirmLabel: 'Ban & Clawback',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await banReferralFraudUser(userId, reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'Syndicate Banned', message: `User ${userId} banned and coins clawed back.`, type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Action Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleVerifyReferral = async (referral) => {
    if (!canMutate) return
    try {
      await batchUpdateReferralStatus(
        [referral.id],
        'rewarded',
        'Referral verified and +100 coins unlocked',
        currentAdmin?.uid,
        currentAdmin?.name
      )
      addToast({ title: 'Referral Verified', message: 'Legitimate farmer registration confirmed.', type: 'success' })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Verification Error', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // RATINGS MODERATION ACTIONS
  // -------------------------------------------------------------
  const handleRemoveRating = (rating) => {
    if (!canMutate) return
    setConfirmDialog({
      open: true,
      title: 'Remove Abusive / Defamatory Rating',
      message: `Remove rating record for ${rating.targetName} by ${rating.farmerName}?`,
      confirmLabel: 'Remove Rating',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await removeRating(rating.id, reason, currentAdmin?.uid, currentAdmin?.name)
          addToast({ title: 'Rating Removed', message: 'Abusive review pruned from platform.', type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Removal Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleApproveRating = async (rating) => {
    if (!canMutate) return
    try {
      await approveRating(
        rating.id,
        'Moderation review passed; review made public',
        currentAdmin?.uid,
        currentAdmin?.name
      )
      addToast({ title: 'Rating Approved', message: 'Review verified and public.', type: 'success' })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Approval Error', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // ACTIVITY EARN RATES CONFIGURATION (SOP-22 Section 3)
  // -------------------------------------------------------------
  const handleOpenEarnRatesModal = async () => {
    try {
      const rates = await getEarnRates()
      setEarnRatesModal({ open: true, rates })
    } catch (err) {
      addToast({ title: 'Config Error', message: err.message, type: 'error' })
    }
  }

  const handleSaveEarnRates = async (newRates, reason) => {
    if (!canMutate) return
    try {
      await updateEarnRates(newRates, reason, currentAdmin?.uid, currentAdmin?.name)
      addToast({
        title: 'Earn Rates Saved',
        message: 'Updated platform AgriCoins incentive parameters.',
        type: 'success'
      })
      setEarnRatesModal({ open: false, rates: null })
      loadData()
    } catch (err) {
      addToast({ title: 'Save Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // BATCH ACTIONS HANDLER
  // -------------------------------------------------------------
  const handleBatchActionTrigger = (actionType) => {
    if (selectedIds.length === 0) return
    if (actionType === 'export') {
      const rows = tableData.data.filter((r) => selectedIds.includes(r.userId || r.id))
      const csv = toCsv(rows.length > 0 ? rows : tableData.data)
      downloadBlob(csv, `gamification_batch_${activeTab}_export.csv`)
      addToast({ title: 'Export Complete', message: `Exported ${rows.length} selected records.`, type: 'success' })
      return
    }

    setBatchModal({
      open: true,
      action: actionType,
      title: `Batch ${actionType.toUpperCase()} on ${selectedIds.length} Records`,
      count: selectedIds.length
    })
  }

  const handleConfirmBatchAction = async (reason) => {
    if (!canMutate) return
    try {
      if (activeTab === 'tiers') {
        const delta = batchModal.action === 'bonus_100' ? 100 : -50
        await batchAdjustCoins(selectedIds, delta, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'rewards') {
        await batchUpdateCouponStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'referrals') {
        await batchUpdateReferralStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      } else if (activeTab === 'ratings') {
        await batchUpdateRatingStatus(selectedIds, batchModal.action, reason, currentAdmin?.uid, currentAdmin?.name)
      }
      addToast({
        title: 'Batch Action Successful',
        message: `Updated ${selectedIds.length} records.`,
        type: 'success'
      })
      setSelectedIds([])
      setBatchModal({ open: false, action: '', title: '', count: 0 })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Batch Action Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // BENCHMARK SEED RESET HANDLER
  // -------------------------------------------------------------
  const handleResetSeed = async (reason) => {
    if (!canMutate) return
    try {
      await resetGamificationSeedData(reason, currentAdmin?.uid, currentAdmin?.name)
      addToast({
        title: 'Benchmark Seed Restored',
        message: 'All 5 SOP-22 Gamification collections reset to benchmark state.',
        type: 'success'
      })
      setResetModalOpen(false)
      setSelectedIds([])
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Reset Error', message: err.message, type: 'error' })
    }
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Statutory Auditor Compliance Banner */}
      {isFinancialAuditor && (
        <div className="bg-amber-50 border border-amber-200/90 text-amber-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="leading-relaxed">
            <strong>Auditor Mode Enabled (Statutory Compliance):</strong> Logged in with Financial Auditor credentials. Under DPDP regulations & statutory audit guidelines, you have read-only access. Virtual currency balance mutations, fraud syndicate bans, and review removals are locked.
          </div>
        </div>
      )}

      {/* Metric Bar */}
      <GamificationMetricBar summary={summary} loading={!summary} />

      {/* Main Container */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
        <GamificationTabSwitch
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          counts={{
            tiers: summary?.activeKrishiRatnaUsers,
            rewards: summary?.activeCouponsCount,
            referrals: summary?.flaggedReferralFraudAlerts,
            ratings: summary?.flaggedAbusiveRatings
          }}
        />

        <GamificationFiltersBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          extraFilter={extraFilter}
          onExtraFilterChange={setExtraFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          persona={persona}
          onPersonaChange={setPersona}
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onCreateNew={() => setCouponModal({ open: true, coupon: null })}
          onConfigureEarnRates={canMutate ? handleOpenEarnRatesModal : null}
          onResetSeed={() => setResetModalOpen(true)}
          canMutate={canMutate}
        />

        {/* Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedIds.length}
          activeTab={activeTab}
          onBatchAction={handleBatchActionTrigger}
          onClearSelection={handleClearSelection}
        />

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-2" />
            Loading gamification records...
          </div>
        ) : (
          <>
            {activeTab === 'tiers' && (
              <GamificationTiersTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onAdjustCoins={(user) => setAdjustCoinsModal({ open: true, user })}
                canMutate={canMutate}
              />
            )}

            {activeTab === 'ledger' && (
              <AgriCoinsLedgerTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardCouponsTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onEdit={(c) => setCouponModal({ open: true, coupon: c })}
                onToggleStatus={handleToggleCouponStatus}
                canMutate={canMutate}
              />
            )}

            {activeTab === 'referrals' && (
              <ReferralsTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onBanFraudUser={handleBanFraudUser}
                onVerifyReferral={handleVerifyReferral}
                canMutate={canMutate}
              />
            )}

            {activeTab === 'ratings' && (
              <RatingsTable
                data={tableData.data}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleOpenDrawer}
                onRemoveRating={handleRemoveRating}
                onApproveRating={handleApproveRating}
                canMutate={canMutate}
              />
            )}

            {activeTab === 'audit' && (
              <GamificationAuditLogsTable data={tableData.data} />
            )}

            <ContentPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={tableData.total || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <GamificationDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        canMutate={canMutate}
        role={role}
        onClose={() => setDrawerOpen(false)}
        onAdjustCoins={(user) => setAdjustCoinsModal({ open: true, user })}
        onBanFraudUser={handleBanFraudUser}
        onRemoveRating={handleRemoveRating}
      />

      {/* Modals */}
      <ManualAdjustCoinsModal
        isOpen={adjustCoinsModal.open}
        user={adjustCoinsModal.user}
        onClose={() => setAdjustCoinsModal({ open: false, user: null })}
        onAdjust={handleAdjustCoinsAction}
      />

      <CreateEditCouponModal
        isOpen={couponModal.open}
        initialData={couponModal.coupon}
        onClose={() => setCouponModal({ open: false, coupon: null })}
        onSave={handleSaveCoupon}
      />

      <ConfigureEarnRatesModal
        isOpen={earnRatesModal.open}
        initialRates={earnRatesModal.rates}
        onClose={() => setEarnRatesModal({ open: false, rates: null })}
        onSave={handleSaveEarnRates}
      />

      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        count={batchModal.count}
        actionLabel={batchModal.action ? `Apply ${batchModal.action.toUpperCase()}` : 'Apply Batch'}
        onClose={() => setBatchModal({ open: false, action: '', title: '', count: 0 })}
        onConfirm={handleConfirmBatchAction}
      />

      <ResetSeedModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetSeed}
      />

      <AuditReasonModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />

      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        amount={dualSignOffDialog.amount}
        details={dualSignOffDialog.details}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={dualSignOffDialog.onConfirm || (() => {})}
      />
    </div>
  )
}
