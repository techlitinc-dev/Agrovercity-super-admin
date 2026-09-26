import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Landmark,
  Building2,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Sliders,
  Calculator,
  Download,
  CreditCard,
  Clock,
  ShieldAlert,
  Layers,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { Button } from '../components/ui'
import {
  isMockMode,
  getBankingSummary,
  listBankAccounts,
  overrideVerifyAccount,
  setPrimaryAccount,
  auditMaskingCompliance,
  listLoanApplications,
  updateLoanStatus,
  listKccRecords,
  updateKccLimit,
  getCreditScoreModel,
  updateCreditScoreModel,
  calculateLoanEmi,
  listRepaymentMilestones,
  listBankingAuditLogs,
  resetBankingSeedData
} from '../api/bankingApi'
import ConfirmDialog from '../components/ConfirmDialog'
import BankingDetailDrawer from '../components/banking/BankingDetailDrawer'
import BankingAuditTrailTable from '../components/banking/BankingAuditTrailTable'
import {
  UnderwriteLoanModal,
  PennyDropOverrideModal,
  EmiCalculatorModal,
  CreditScoreCalibrateModal,
  KccLimitModal,
  DpdpComplianceModal
} from '../components/banking/BankingModals'
import {
  fmtINR,
  MetricCard,
  TabSwitch,
  FiltersBar,
  BankAccountsTable,
  LoanUnderwritingTable,
  KccRecordsTable,
  RepaymentsTable,
  CreditScoreModelView,
  Pagination
} from './bankingWidgets'

const PAGE_SIZE = 20

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

export default function BankingPage() {
  const [tab, setTab] = useState('accounts') // 'accounts' | 'loans' | 'kcc' | 'repayments' | 'model' | 'audit_trail'
  const [accounts, setAccounts] = useState([])
  const [loans, setLoans] = useState([])
  const [kccList, setKccList] = useState([])
  const [repayments, setRepayments] = useState([])
  const [creditModel, setCreditModel] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [summary, setSummary] = useState(null)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successBanner, setSuccessBanner] = useState('')
  const [busy, setBusy] = useState(false)

  // Filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [secondaryFilter, setSecondaryFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30')

  // Detail Drawer
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedType, setSelectedType] = useState('account') // 'account' | 'loan' | 'kcc' | 'repayment'

  // Modals
  const [underwriteModal, setUnderwriteModal] = useState({ open: false, loan: null })
  const [overrideModal, setOverrideModal] = useState({ open: false, account: null })
  const [emiModal, setEmiModal] = useState({ open: false, initialLoan: null })
  const [calibrateModal, setCalibrateModal] = useState({ open: false, model: null })
  const [kccModal, setKccModal] = useState({ open: false, kcc: null })
  const [dpdpModal, setDpdpModal] = useState({ open: false, result: null })

  // Generic Confirmation Dialog
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

  // Load summary KPI bar data
  const loadSummary = useCallback(async () => {
    try {
      const res = await getBankingSummary()
      setSummary(res)
    } catch (err) {
      console.error('Failed to load banking summary:', err)
    }
  }, [])

  // Load active tab data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    const fromDate = dateRange === 'all' ? '' : daysAgoIso(Number(dateRange))

    try {
      if (tab === 'accounts') {
        const res = await listBankAccounts({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          accountType: secondaryFilter,
          from: fromDate
        })
        setAccounts(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'loans') {
        const res = await listLoanApplications({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          partnerBank: secondaryFilter,
          from: fromDate
        })
        setLoans(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'kcc') {
        const res = await listKccRecords({
          page,
          pageSize: PAGE_SIZE,
          q,
          status
        })
        setKccList(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'repayments') {
        const res = await listRepaymentMilestones({
          page,
          pageSize: PAGE_SIZE,
          q,
          status
        })
        setRepayments(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'model') {
        const res = await getCreditScoreModel()
        setCreditModel(res)
      } else if (tab === 'audit_trail') {
        const res = await listBankingAuditLogs({
          page,
          pageSize: PAGE_SIZE,
          q,
          action: status
        })
        setAuditLogs(res.data || [])
        setTotal(res.total || 0)
      }
    } catch (err) {
      setError(err?.message || 'Failed to load banking records')
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, secondaryFilter, dateRange])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page when filters change
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setStatus('all')
    setSecondaryFilter('all')
    setQ('')
  }

  // Row selection handler for Detail Drawer
  const handleSelectAccount = (acc) => {
    setSelectedItem(acc)
    setSelectedType('account')
  }

  const handleSelectLoan = (loan) => {
    setSelectedItem(loan)
    setSelectedType('loan')
  }

  const handleSelectKcc = (kcc) => {
    setSelectedItem(kcc)
    setSelectedType('kcc')
  }

  const handleSelectRepayment = (rep) => {
    setSelectedItem(rep)
    setSelectedType('repayment')
  }

  // Actions
  const handleTriggerOverride = (acc) => {
    setOverrideModal({ open: true, account: acc })
  }

  const handleSubmitOverride = async (payload) => {
    setBusy(true)
    try {
      await overrideVerifyAccount(overrideModal.account.id, payload)
      setOverrideModal({ open: false, account: null })
      if (selectedItem?.id === overrideModal.account.id) {
        setSelectedItem((prev) => ({ ...prev, verificationStatus: 'verified', verificationMethod: 'manualOverride' }))
      }
      setSuccessBanner(`Penny-drop verification manually approved for ${overrideModal.account.farmerName}.`)
      setTimeout(() => setSuccessBanner(''), 4500)
      loadData()
      loadSummary()
    } catch (err) {
      alert(err?.message || 'Failed to override penny-drop verification')
    } finally {
      setBusy(false)
    }
  }

  const handleTriggerSetPrimary = (acc) => {
    setConfirmDialog({
      open: true,
      title: 'Designate Primary Payout Account',
      message: `Set ${acc.bankName} (${acc.accountNumberMasked}) as the designated primary account for ${acc.farmerName}? All platform mandi payouts and loan disbursements will route to this account.`,
      confirmLabel: 'Set Primary',
      requireReason: true,
      danger: false,
      dualSignOff: false,
      action: async (reason) => {
        setBusy(true)
        try {
          await setPrimaryAccount(acc.id, { reason })
          setConfirmDialog({ open: false })
          setSuccessBanner(`Primary payout account updated for ${acc.farmerName}.`)
          setTimeout(() => setSuccessBanner(''), 4500)
          loadData()
          if (selectedItem) setSelectedItem(null)
        } catch (err) {
          alert(err?.message || 'Failed to set primary account')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  const handleTriggerUnderwrite = (loan) => {
    setUnderwriteModal({ open: true, loan })
  }

  const handleSubmitUnderwrite = async (payload) => {
    setBusy(true)
    try {
      await updateLoanStatus(underwriteModal.loan.id, payload)
      setUnderwriteModal({ open: false, loan: null })
      if (selectedItem?.id === underwriteModal.loan.id) {
        setSelectedItem((prev) => ({ ...prev, ...payload }))
      }
      setSuccessBanner(`Loan application #${underwriteModal.loan.applicationId || underwriteModal.loan.id} updated to ${payload.status?.toUpperCase()}.`)
      setTimeout(() => setSuccessBanner(''), 4500)
      loadData()
      loadSummary()
    } catch (err) {
      alert(err?.message || 'Failed to update loan status')
    } finally {
      setBusy(false)
    }
  }

  const handleTriggerAdjustKcc = (kcc) => {
    setKccModal({ open: true, kcc })
  }

  const handleSubmitKccLimit = async (payload) => {
    setBusy(true)
    try {
      await updateKccLimit(kccModal.kcc.id, payload)
      setKccModal({ open: false, kcc: null })
      setSuccessBanner(`KCC limit for ${kccModal.kcc.farmerName} updated to ${fmtINR(payload.newLimit)}.`)
      setTimeout(() => setSuccessBanner(''), 4500)
      loadData()
      loadSummary()
    } catch (err) {
      alert(err?.message || 'Failed to adjust KCC limit')
    } finally {
      setBusy(false)
    }
  }

  const handleTriggerCalibrateModel = () => {
    setCalibrateModal({ open: true, model: creditModel })
  }

  const handleSubmitCalibration = async (payload) => {
    setBusy(true)
    try {
      const updated = await updateCreditScoreModel(payload)
      setCreditModel(updated)
      setCalibrateModal({ open: false, model: null })
      setSuccessBanner('Kisan Credit Score algorithmic weights and tiers calibrated successfully.')
      setTimeout(() => setSuccessBanner(''), 4500)
      loadData()
      loadSummary()
    } catch (err) {
      alert(err?.message || 'Failed to calibrate model')
    } finally {
      setBusy(false)
    }
  }

  const handleRunMaskingAudit = async () => {
    setBusy(true)
    try {
      const result = await auditMaskingCompliance()
      setDpdpModal({ open: true, result })
      loadSummary()
    } catch (err) {
      alert(err?.message || 'Failed to run DPDP audit')
    } finally {
      setBusy(false)
    }
  }

  const handleResetSeed = () => {
    setConfirmDialog({
      open: true,
      title: 'Reset Banking & Underwriting Seed Data',
      message: 'Are you sure you want to reset all bank accounts, loan underwriting queues, KCC limits, and statutory audit logs back to default mock seeds?',
      confirmLabel: 'Reset All Data',
      requireReason: false,
      danger: true,
      dualSignOff: false,
      action: async () => {
        setBusy(true)
        try {
          await resetBankingSeedData()
          setSuccessBanner('Module 14 seed data has been successfully restored to initial defaults.')
          setTimeout(() => setSuccessBanner(''), 4500)
          setConfirmDialog({ open: false })
          loadSummary()
          loadData()
        } catch (err) {
          alert(err?.message || 'Failed to reset seed data')
        } finally {
          setBusy(false)
        }
      }
    })
  }

  const handleExportCsv = () => {
    let rows = []
    let filename = 'agrovercity-banking-export.csv'

    if (tab === 'accounts') {
      rows = accounts
      filename = 'bank_accounts.csv'
    } else if (tab === 'loans') {
      rows = loans
      filename = 'loan_applications.csv'
    } else if (tab === 'kcc') {
      rows = kccList
      filename = 'kcc_records.csv'
    } else if (tab === 'repayments') {
      rows = repayments
      filename = 'repayment_milestones.csv'
    } else if (tab === 'audit_trail') {
      rows = auditLogs
      filename = 'banking_statutory_audit_trail.csv'
    }

    const csvContent = toCsv(rows)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Header Title & Institutional Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-700/20 border border-emerald-400/30">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Banking, Credit Score & Microfinance
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Rural banking gateway · Penny-drop verification · Kisan Credit Score · Loan Underwriting
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 text-xs font-mono font-semibold text-emerald-900 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act: 100% Masked</span>
          </div>

          <button
            type="button"
            onClick={handleResetSeed}
            title="Reset Module 14 Seed Data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-2xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Seed</span>
          </button>

          {isMockMode() && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-mono font-bold shadow-2xs">
              Offline Mock Engine
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Building2}
          title="Bank Accounts"
          value={summary ? summary.totalBankAccounts.toLocaleString('en-IN') : '1,420'}
          subtext={`Verified: ${summary ? summary.pennyDropSuccessRate : '94.2'}% (${summary ? summary.pendingPennyDropAccounts : '48'} pending)`}
          tone="emerald"
          badge="Penny-Drop"
        />

        <MetricCard
          icon={Landmark}
          title="Underwriting Queue"
          value={summary ? `${summary.underwritingQueueCount} Pending` : '36 Pending'}
          subtext={`Queue Volume: ${fmtINR(summary ? summary.underwritingQueueVolume : 3480000)}`}
          tone="amber"
          badge="Dual Sign-Off"
        />

        <MetricCard
          icon={CreditCard}
          title="Active KCC Limit"
          value={summary ? fmtINR(summary.activeKccPortfolioLimit) : '₹4.85 Cr'}
          subtext={`Utilization Rate: ${summary ? summary.kccUtilizationRate : '68.4'}% portfolio`}
          tone="sky"
          badge="Kisan Card"
        />

        <MetricCard
          icon={ShieldAlert}
          title="Flagged / NPA Risk"
          value={summary ? `${summary.flaggedFailures} Failed` : '87 Failed'}
          subtext={`${summary ? summary.npaRiskCount : '9'} critical loan default indicators`}
          tone="rose"
          badge="Action Req"
        />
      </div>

      {/* Tab Switcher */}
      <TabSwitch
        activeTab={tab}
        onTabChange={handleTabChange}
        counts={{
          accounts: summary ? summary.totalBankAccounts : (accounts.length || 12),
          loans: summary ? summary.totalLoanApplications : (loans.length || 10),
          kcc: kccList.length || 8,
          repayments: repayments.length || 8,
          audit_trail: auditLogs.length || 5
        }}
      />

      {/* Filters Toolbar */}
      {tab !== 'audit_trail' && (
        <FiltersBar
          tab={tab}
          q={q}
          setQ={setQ}
          status={status}
          setStatus={setStatus}
          secondaryFilter={secondaryFilter}
          setSecondaryFilter={setSecondaryFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onOpenEmiCalculator={() => setEmiModal({ open: true, initialLoan: null })}
          onCalibrateModel={handleTriggerCalibrateModel}
          onRunMaskingAudit={handleRunMaskingAudit}
          loading={loading}
        />
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="text-xs px-2.5 py-1 font-semibold rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
            onClick={loadData}
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary Data Grids */}
      {tab === 'accounts' && (
        <>
          <BankAccountsTable
            accounts={accounts}
            onSelect={handleSelectAccount}
            onOverrideVerify={handleTriggerOverride}
            onSetPrimary={handleTriggerSetPrimary}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {tab === 'loans' && (
        <>
          <LoanUnderwritingTable
            loans={loans}
            onSelect={handleSelectLoan}
            onUnderwrite={handleTriggerUnderwrite}
            onOpenEmiCalculator={(l) => setEmiModal({ open: true, initialLoan: l })}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {tab === 'kcc' && (
        <>
          <KccRecordsTable
            kccList={kccList}
            onSelect={handleSelectKcc}
            onAdjustLimit={handleTriggerAdjustKcc}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {tab === 'repayments' && (
        <>
          <RepaymentsTable
            repayments={repayments}
            onSelect={handleSelectRepayment}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {tab === 'model' && (
        <CreditScoreModelView
          model={creditModel}
          onCalibrate={handleTriggerCalibrateModel}
          onOpenEmiSimulator={() => setEmiModal({ open: true, initialLoan: null })}
        />
      )}

      {tab === 'audit_trail' && (
        <>
          <BankingAuditTrailTable
            auditLogs={auditLogs}
            loading={loading}
            onRefresh={loadData}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Slide-over Action Drawer */}
      <BankingDetailDrawer
        item={selectedItem}
        itemType={selectedType}
        onClose={() => setSelectedItem(null)}
        onOverrideVerify={handleTriggerOverride}
        onSetPrimary={handleTriggerSetPrimary}
        onApproveLoan={handleTriggerUnderwrite}
        onRejectLoan={handleTriggerUnderwrite}
        onOpenEmiCalculator={(l) => setEmiModal({ open: true, initialLoan: l })}
        onAdjustKccLimit={handleTriggerAdjustKcc}
        onAuditMasking={handleRunMaskingAudit}
      />

      {/* Modals */}
      <UnderwriteLoanModal
        open={underwriteModal.open}
        loan={underwriteModal.loan}
        onClose={() => setUnderwriteModal({ open: false, loan: null })}
        onSubmit={handleSubmitUnderwrite}
        busy={busy}
      />

      <PennyDropOverrideModal
        open={overrideModal.open}
        account={overrideModal.account}
        onClose={() => setOverrideModal({ open: false, account: null })}
        onSubmit={handleSubmitOverride}
        busy={busy}
      />

      <EmiCalculatorModal
        open={emiModal.open}
        initialLoan={emiModal.initialLoan}
        onClose={() => setEmiModal({ open: false, initialLoan: null })}
      />

      <CreditScoreCalibrateModal
        open={calibrateModal.open}
        model={calibrateModal.model}
        onClose={() => setCalibrateModal({ open: false, model: null })}
        onSubmit={handleSubmitCalibration}
        busy={busy}
      />

      <KccLimitModal
        open={kccModal.open}
        kcc={kccModal.kcc}
        onClose={() => setKccModal({ open: false, kcc: null })}
        onSubmit={handleSubmitKccLimit}
        busy={busy}
      />

      <DpdpComplianceModal
        open={dpdpModal.open}
        auditResult={dpdpModal.result}
        onClose={() => setDpdpModal({ open: false, result: null })}
      />

      {/* Generic Audit Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        requireReason={confirmDialog.requireReason}
        danger={confirmDialog.danger}
        dualSignOff={confirmDialog.dualSignOff}
        busy={busy}
        onConfirm={(reason) => {
          if (confirmDialog.action) confirmDialog.action(reason)
        }}
        onCancel={() => setConfirmDialog({ open: false })}
      />
    </div>
  )
}
