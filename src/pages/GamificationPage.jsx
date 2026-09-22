import React, { useState, useEffect, useCallback } from 'react'
import {
  getGamificationSummary,
  listGamificationStatus,
  listAgriCoinsLedger,
  manualAdjustCoins,
  listRewardCoupons,
  createRewardCoupon,
  updateRewardCoupon,
  listReferrals,
  banReferralFraudUser,
  listRatings,
  removeRating,
  getGamificationAuditLogs
} from '../api/gamificationApi'
import {
  GamificationMetricBar,
  GamificationTabSwitch,
  GamificationFiltersBar,
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
  CreateEditCouponModal
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
  const { currentAdmin, hasPermission } = useAuthAdmin() || { currentAdmin: { name: 'Super Admin' }, hasPermission: () => true }

  const [activeTab, setActiveTab] = useState('tiers') // 'tiers', 'ledger', 'rewards', 'referrals', 'ratings', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [extraFilter, setExtraFilter] = useState('all')
  const [page, setPage] = useState(1)

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [adjustCoinsModal, setAdjustCoinsModal] = useState({ open: false, user: null })
  const [couponModal, setCouponModal] = useState({ open: false, coupon: null })

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
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ledger') {
        res = await listAgriCoinsLedger({
          q: search,
          type: extraFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'rewards') {
        res = await listRewardCoupons({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'referrals') {
        res = await listReferrals({
          q: search,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'ratings') {
        res = await listRatings({
          q: search,
          targetType: extraFilter,
          status: statusFilter,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getGamificationAuditLogs({
          q: search,
          actionType: statusFilter,
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
  }, [activeTab, search, statusFilter, extraFilter, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

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
  // COIN ADJUSTMENT ACTION
  // -------------------------------------------------------------
  const handleAdjustCoinsAction = (userId, delta, reason) => {
    if (Math.abs(delta) > 50000) {
      setDualSignOffDialog({
        open: true,
        title: 'Dual Sign-Off: High-Value AgriCoins Adjustment',
        amount: Math.abs(delta),
        details: `Adjusting ${delta > 0 ? '+' : ''}${delta} Coins for User ${userId}.`,
        onConfirm: async ({ secondAdminEmail, reason: dualReason }) => {
          try {
            await manualAdjustCoins(userId, delta, `${reason} - ${dualReason}`, secondAdminEmail)
            addToast({ title: 'Coins Adjusted', message: `Applied ${delta} coins mutation with dual sign-off.`, type: 'success' })
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
          await manualAdjustCoins(userId, delta, reason)
          addToast({ title: 'Coins Adjusted', message: `Successfully updated balance by ${delta > 0 ? '+' : ''}${delta} coins.`, type: 'success' })
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
    try {
      if (couponModal.coupon) {
        await updateRewardCoupon(couponModal.coupon.id, formData)
        addToast({ title: 'Voucher Updated', message: 'Rewards voucher parameters saved.', type: 'success' })
      } else {
        await createRewardCoupon(formData)
        addToast({ title: 'Voucher Added', message: 'New reward coupon published to store.', type: 'success' })
      }
      setCouponModal({ open: false, coupon: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Voucher Error', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // REFERRAL FRAUD ACTION
  // -------------------------------------------------------------
  const handleBanFraudUser = (userId, userName) => {
    setConfirmDialog({
      open: true,
      title: 'Ban Referral Fraud Ring',
      message: `Ban user ${userName} (${userId}) and revoke all coins generated from this referral syndicate?`,
      confirmLabel: 'Ban & Clawback',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await banReferralFraudUser(userId, reason)
          addToast({ title: 'Syndicate Banned', message: `User ${userId} banned and coins revoked.`, type: 'success' })
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

  // -------------------------------------------------------------
  // RATINGS MODERATION ACTION
  // -------------------------------------------------------------
  const handleRemoveRating = (rating) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Abusive / Defamatory Rating',
      message: `Remove this rating for ${rating.targetName} by ${rating.farmerName}?`,
      confirmLabel: 'Remove Rating',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          await removeRating(rating.id, reason)
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

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Metric Bar */}
      <GamificationMetricBar summary={summary} loading={!summary} />

      {/* Main Container */}
      <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
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
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onCreateNew={() => setCouponModal({ open: true, coupon: null })}
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
                onView={handleOpenDrawer}
                onAdjustCoins={(user) => setAdjustCoinsModal({ open: true, user })}
              />
            )}

            {activeTab === 'ledger' && (
              <AgriCoinsLedgerTable data={tableData.data} />
            )}

            {activeTab === 'rewards' && (
              <RewardCouponsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={(c) => setCouponModal({ open: true, coupon: c })}
              />
            )}

            {activeTab === 'referrals' && (
              <ReferralsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onBanFraudUser={handleBanFraudUser}
              />
            )}

            {activeTab === 'ratings' && (
              <RatingsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onRemoveRating={handleRemoveRating}
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
