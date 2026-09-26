import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Coins,
  FileText,
  UserCheck,
  Sliders,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  RotateCcw
} from 'lucide-react'
import {
  getInsuranceSummary,
  listClaims,
  listPolicies,
  listInsuranceRates,
  listSurveyorPanel,
  assignSurveyor,
  reviewSurveyorAssessment,
  advanceClaimStatus,
  executeSecondSignoff,
  updateInsuranceRate,
  auditInsuranceCompliance,
  listInsuranceAuditLogs,
  resetInsuranceSeedData
} from '../api/insuranceApi'
import {
  fmtINR,
  MetricCard,
  TabSwitch,
  FiltersBar,
  ClaimsTable,
  SurveyorPanelTable,
  PoliciesTable,
  RatesTable,
  DbtDisbursalTable,
  Pagination
} from './insuranceWidgets'
import InsuranceDetailDrawer from '../components/insurance/InsuranceDetailDrawer'
import InsuranceAuditTrailTable from '../components/insurance/InsuranceAuditTrailTable'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  AssignSurveyorModal,
  ReviewSurveyorAssessmentModal,
  ApproveDbtDisbursalModal,
  SecondSignOffModal,
  RejectClaimModal,
  EditRateModal,
  DpdpComplianceModal
} from '../components/insurance/InsuranceModals'
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

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

export default function InsurancePage() {
  const { addToast } = useNotification() || { addToast: () => {} }

  const [tab, setTab] = useState('claims') // 'claims' | 'surveyors' | 'policies' | 'rates' | 'dbt' | 'audit_trail'
  const [claims, setClaims] = useState([])
  const [policies, setPolicies] = useState([])
  const [surveyors, setSurveyors] = useState([])
  const [rates, setRates] = useState([])
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
  const [secondaryFilter, setSecondaryFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30')
  const [lateOnly, setLateOnly] = useState(false)

  // Drawer
  const [selectedClaim, setSelectedClaim] = useState(null)

  // Modals
  const [assignModal, setAssignModal] = useState({ open: false, claim: null })
  const [reviewModal, setReviewModal] = useState({ open: false, claim: null })
  const [approveModal, setApproveModal] = useState({ open: false, claim: null })
  const [secondSignOffModal, setSecondSignOffModal] = useState({ open: false, claim: null })
  const [rejectModal, setRejectModal] = useState({ open: false, claim: null })
  const [editRateModal, setEditRateModal] = useState({ open: false, rate: null })
  const [complianceModal, setComplianceModal] = useState({ open: false, result: null })

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

  // Load KPI Summary
  const loadSummary = useCallback(async () => {
    try {
      const res = await getInsuranceSummary()
      setSummary(res)
    } catch (err) {
      console.error('Failed to load insurance summary:', err)
    }
  }, [])

  // Load active tab data
  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    const fromDate = dateRange === 'all' ? '' : daysAgoIso(Number(dateRange))

    try {
      if (tab === 'claims' || tab === 'dbt') {
        const res = await listClaims({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          calamityType: secondaryFilter,
          from: fromDate,
          lateOnly
        })
        setClaims(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'surveyors') {
        const res = await listSurveyorPanel({
          q,
          agency: secondaryFilter
        })
        setSurveyors(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'policies') {
        const res = await listPolicies({
          page,
          pageSize: PAGE_SIZE,
          q,
          status,
          from: fromDate
        })
        setPolicies(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'rates') {
        const res = await listInsuranceRates()
        setRates(res.data || [])
        setTotal(res.total || 0)
      } else if (tab === 'audit_trail') {
        const res = await listInsuranceAuditLogs({
          page,
          pageSize: PAGE_SIZE,
          q,
          action: status
        })
        setAuditLogs(res.data || [])
        setTotal(res.total || 0)
      }
    } catch (err) {
      setError(err.message || 'Failed to load insurance module data')
      addToast({
        title: 'Network Error',
        message: err.message || 'Unable to retrieve insurance data',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [tab, page, q, status, secondaryFilter, dateRange, lateOnly, addToast])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page when switching tabs or changing search/filters
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setPage(1)
    setQ('')
    setStatus('all')
    setSecondaryFilter('all')
    setLateOnly(false)
  }

  // Action handlers
  const handleAssignSurveyor = async (payload) => {
    try {
      setBusy(true)
      const updated = await assignSurveyor(assignModal.claim.id, payload)
      addToast({
        title: 'Surveyor Assigned',
        message: `${payload.surveyorName} assigned to inspect claim ${assignModal.claim.claimNumber} on ${payload.surveyorVisitDate}.`,
        type: 'success'
      })
      if (selectedClaim && selectedClaim.id === updated.id) {
        setSelectedClaim(updated)
      }
      loadSummary()
      loadData()
    } catch (err) {
      addToast({
        title: 'Assignment Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleReviewAssessment = async (payload) => {
    try {
      setBusy(true)
      const updated = await reviewSurveyorAssessment(reviewModal.claim.id, payload)
      addToast({
        title: 'Assessment Recorded',
        message: `Loss verified at ${payload.surveyorLossPercent}%. Payout calculated and ready for superadmin approval.`,
        type: 'success'
      })
      if (selectedClaim && selectedClaim.id === updated.id) {
        setSelectedClaim(updated)
      }
      loadSummary()
      loadData()
    } catch (err) {
      addToast({
        title: 'Review Save Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleApproveDbt = async (payload) => {
    try {
      setBusy(true)
      const updated = await advanceClaimStatus(approveModal.claim.userId, approveModal.claim.id, payload)
      const isDual = Number(payload.approvedAmount) > 50000
      addToast({
        title: isDual ? 'Primary Approval Logged' : 'DBT Disbursal Authorized',
        message: isDual
          ? `Primary sign-off recorded for ₹${payload.approvedAmount.toLocaleString('en-IN')}. Secondary director sign-off pending per SOP-15 §6.3.`
          : `Compensation payout of ₹${payload.approvedAmount.toLocaleString('en-IN')} approved for DBT transfer.`,
        type: 'success'
      })
      if (selectedClaim && selectedClaim.id === updated.id) {
        setSelectedClaim(updated)
      }
      loadSummary()
      loadData()
    } catch (err) {
      addToast({
        title: 'Disbursal Approval Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleSecondSignOff = async (payload) => {
    try {
      setBusy(true)
      const updated = await executeSecondSignoff(secondSignOffModal.claim.id, payload)
      addToast({
        title: 'Dual Sign-Off Executed',
        message: `Director Finance sign-off verified. Payout of ₹${updated.approvedAmount?.toLocaleString('en-IN')} cleared for APBS execution.`,
        type: 'success'
      })
      if (selectedClaim && selectedClaim.id === updated.id) {
        setSelectedClaim(updated)
      }
      loadSummary()
      loadData()
    } catch (err) {
      addToast({
        title: 'Sign-Off Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleRejectClaim = async (payload) => {
    try {
      setBusy(true)
      const updated = await advanceClaimStatus(rejectModal.claim.userId, rejectModal.claim.id, payload)
      addToast({
        title: 'Claim Rejected',
        message: `Claim ${rejectModal.claim.claimNumber} rejected. Administrative audit reason recorded and appeal protocol initialized.`,
        type: 'warning'
      })
      if (selectedClaim && selectedClaim.id === updated.id) {
        setSelectedClaim(updated)
      }
      loadSummary()
      loadData()
    } catch (err) {
      addToast({
        title: 'Rejection Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleSaveRate = async (payload) => {
    try {
      setBusy(true)
      const id = editRateModal.rate?.id || 'new'
      await updateInsuranceRate(id, payload)
      addToast({
        title: 'Rate Table Updated',
        message: `Actuarial and farmer rates updated for ${payload.cropName} (${payload.season}).`,
        type: 'success'
      })
      loadData()
    } catch (err) {
      addToast({
        title: 'Rate Update Failed',
        message: err.message,
        type: 'error'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleRunComplianceAudit = async () => {
    try {
      setBusy(true)
      const res = await auditInsuranceCompliance()
      setComplianceModal({ open: true, result: res })
      addToast({
        title: 'Compliance Audit Complete',
        message: `DPDP Masking: ${res.dpdpCompliance.passRate}% Pass · 72h Calamity Rule: ${res.calamityIntimationRule.flaggedLateCount} flagged.`,
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
      title: 'Reset PMFBY Crop Insurance Seed Data',
      message: 'Restore all default mock claims, policies, seasonal premium rates, surveyor panel records, and statutory audit logs back to initial defaults?',
      confirmLabel: 'Reset All Data',
      requireReason: false,
      danger: true,
      dualSignOff: false,
      action: async () => {
        setBusy(true)
        try {
          await resetInsuranceSeedData()
          addToast({
            title: 'Seed Data Reset',
            message: 'PMFBY crop insurance database has been reset to default seeds.',
            type: 'success'
          })
          setConfirmDialog({ open: false })
          loadSummary()
          loadData()
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

  const handleExportCsv = () => {
    let rows = []
    let filename = `insurance-${tab}-${new Date().toISOString().slice(0, 10)}.csv`

    if (tab === 'claims' || tab === 'dbt') {
      rows = claims
    } else if (tab === 'policies') {
      rows = policies
    } else if (tab === 'surveyors') {
      rows = surveyors
    } else if (tab === 'rates') {
      rows = rates
    } else if (tab === 'audit_trail') {
      rows = auditLogs
      filename = `pmfby-statutory-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`
    }

    const csvStr = toCsv(rows)
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    addToast({
      title: 'CSV Export Generated',
      message: `Exported ${rows.length} records to ${filename}.`,
      type: 'success'
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTEXT BAR (SOP-15 §4.1) */}
      <div className="px-6 pt-6">
        <PageContextBar
          title="Crop Insurance (PMFBY) & Calamity Claims Desk"
          sop="SOP-15"
          category="Risk Management"
          icon={Shield}
          iconColor="emerald"
          description="PMFBY/RWBCIS Passbook · 72h Calamity Intimation · Geotagged Survey · Dual Sign-Off (> ₹50k) · DBT Gateway"
          currentAdmin={currentAdmin}
          isAuditor={isAuditor}
          isSupport={isSupport}
          stats={[
            { label: 'Total Claims', value: summary?.totalClaims || claims.length },
            { label: 'Surveyors', value: surveyors.length },
            { label: 'Policies', value: policies.length }
          ]}
          actions={
            <>
              <button
                onClick={handleRunComplianceAudit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs shadow-2xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Audit Compliance</span>
              </button>

              <button
                onClick={handleResetSeed}
                title="Reset Module 15 Seed Data"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs shadow-2xs transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Seed</span>
              </button>
            </>
          }
        />
      </div>

      {/* Metric KPI Cards Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title="Total Claims"
            value={summary?.totalClaims || 1845}
            subtext="Registered across Kharif & Rabi"
            icon={Shield}
            color="slate"
            onClick={() => handleTabChange('claims')}
          />
          <MetricCard
            title="Intimated (Queue)"
            value={summary?.intimatedPendingAssignment || 42}
            subtext="Awaiting surveyor assignment"
            icon={Clock}
            color="amber"
            alert={(summary?.intimatedPendingAssignment || 0) > 20}
            onClick={() => {
              handleTabChange('claims')
              setStatus('intimated')
            }}
          />
          <MetricCard
            title="Field Assessed"
            value={summary?.fieldAssessedAwaitingApproval || 35}
            subtext="Survey complete · Ready for DBT"
            icon={FileText}
            color="purple"
            onClick={() => {
              handleTabChange('claims')
              setStatus('fieldAssessed')
            }}
          />
          <MetricCard
            title="Total DBT Disbursed"
            value={fmtINR(summary?.disbursedTotalAmount || 42580000)}
            subtext={`${summary?.disbursedClaimsCount || 1675} claims settled via APBS`}
            icon={Coins}
            color="emerald"
            onClick={() => handleTabChange('dbt')}
          />
          <MetricCard
            title="Dual Sign-Off Req."
            value={summary?.pendingDualSignOff || 8}
            subtext="Claims > ₹50k awaiting 2nd sign"
            icon={Lock}
            color="rose"
            alert={(summary?.pendingDualSignOff || 0) > 0}
            onClick={() => {
              handleTabChange('dbt')
            }}
          />
          <MetricCard
            title="> 72h Flagged"
            value={summary?.flaggedLateIntimations || 14}
            subtext="Intimated outside 72h limit"
            icon={AlertTriangle}
            color="rose"
            alert={(summary?.flaggedLateIntimations || 0) > 0}
            onClick={() => {
              handleTabChange('claims')
              setLateOnly(true)
            }}
          />
        </div>
      </div>

      {/* 2. TAB SWITCHER */}
      <TabSwitch
        activeTab={tab}
        onChangeTab={handleTabChange}
        counts={{
          claims: summary?.totalClaims,
          surveyors: surveyors.length || 4,
          policies: summary?.totalActivePolicies || 3820,
          rates: rates.length || 7,
          dbt: (summary?.dbtApprovedQueued || 0) + (summary?.pendingDualSignOff || 0),
          audit_trail: auditLogs.length || 5
        }}
      />

      {/* 3. SEARCH & FILTERS BAR */}
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
          lateOnly={lateOnly}
          setLateOnly={setLateOnly}
          onExportCsv={handleExportCsv}
          onOpenAuditCompliance={handleRunComplianceAudit}
          onAddRate={() => setEditRateModal({ open: true, rate: null })}
        />
      )}

      {/* 4. PRIMARY DATA GRID CONTENT */}
      <div className="px-6">
        <div className="rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300 transition-all">
          {loading ? (
            <div className="p-16 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium">Loading PMFBY crop insurance database records...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-600">
              <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-rose-500" />
              <p className="font-bold text-sm">{error}</p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {tab === 'claims' && (
                <ClaimsTable
                  claims={claims}
                  onSelectClaim={(c) => setSelectedClaim(c)}
                  onAssignSurveyor={(c) => setAssignModal({ open: true, claim: c })}
                  onReviewAssessment={(c) => setReviewModal({ open: true, claim: c })}
                  onApproveDbt={(c) => setApproveModal({ open: true, claim: c })}
                  onSecondSignOff={(c) => setSecondSignOffModal({ open: true, claim: c })}
                  onRejectClaim={(c) => setRejectModal({ open: true, claim: c })}
                />
              )}

              {tab === 'surveyors' && (
                <SurveyorPanelTable
                  surveyors={surveyors}
                  onAssignSurveyor={(s) => {
                    handleTabChange('claims')
                    setStatus('intimated')
                    addToast({
                      title: 'Select Claim',
                      message: `Click 'Assign' on any intimated claim to allocate to ${s.name}.`,
                      type: 'info'
                    })
                  }}
                />
              )}

              {tab === 'policies' && (
                <PoliciesTable
                  policies={policies}
                  onSelectPolicy={(p) => {
                    const matchedClaim = claims.find((c) => c.policyId === p.id || c.policyNumber === p.policyNumber)
                    if (matchedClaim) {
                      setSelectedClaim(matchedClaim)
                    } else {
                      addToast({
                        title: 'Policy Details',
                        message: `Policy ${p.policyNumber} for ${p.farmerName} (${p.cropName}, ${p.landAreaAcres} ac) is active with no open claims.`,
                        type: 'info'
                      })
                    }
                  }}
                />
              )}

              {tab === 'rates' && (
                <RatesTable
                  rates={rates}
                  onEditRate={(r) => setEditRateModal({ open: true, rate: r })}
                />
              )}

              {tab === 'dbt' && (
                <DbtDisbursalTable
                  claims={claims}
                  onSelectClaim={(c) => setSelectedClaim(c)}
                  onSecondSignOff={(c) => setSecondSignOffModal({ open: true, claim: c })}
                />
              )}

              {tab === 'audit_trail' && (
                <InsuranceAuditTrailTable
                  auditLogs={auditLogs}
                  loading={loading}
                  onRefresh={loadData}
                />
              )}

              {/* Pagination footer */}
              {['claims', 'policies', 'dbt', 'audit_trail'].includes(tab) && (
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* 5. DETAIL SLIDE-OVER DRAWER (SOP-15 §4.1) */}
      <InsuranceDetailDrawer
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
        onAssignSurveyor={(c) => setAssignModal({ open: true, claim: c })}
        onReviewAssessment={(c) => setReviewModal({ open: true, claim: c })}
        onApproveDbt={(c) => setApproveModal({ open: true, claim: c })}
        onSecondSignOff={(c) => setSecondSignOffModal({ open: true, claim: c })}
        onRejectClaim={(c) => setRejectModal({ open: true, claim: c })}
      />

      {/* 6. OPERATIONAL MODALS */}
      <AssignSurveyorModal
        open={assignModal.open}
        claim={assignModal.claim}
        surveyors={surveyors}
        onClose={() => setAssignModal({ open: false, claim: null })}
        onConfirm={handleAssignSurveyor}
      />

      <ReviewSurveyorAssessmentModal
        open={reviewModal.open}
        claim={reviewModal.claim}
        onClose={() => setReviewModal({ open: false, claim: null })}
        onConfirm={handleReviewAssessment}
      />

      <ApproveDbtDisbursalModal
        open={approveModal.open}
        claim={approveModal.claim}
        onClose={() => setApproveModal({ open: false, claim: null })}
        onConfirm={handleApproveDbt}
      />

      <SecondSignOffModal
        open={secondSignOffModal.open}
        claim={secondSignOffModal.claim}
        onClose={() => setSecondSignOffModal({ open: false, claim: null })}
        onConfirm={handleSecondSignOff}
      />

      <RejectClaimModal
        open={rejectModal.open}
        claim={rejectModal.claim}
        onClose={() => setRejectModal({ open: false, claim: null })}
        onConfirm={handleRejectClaim}
      />

      <EditRateModal
        open={editRateModal.open}
        rate={editRateModal.rate}
        onClose={() => setEditRateModal({ open: false, rate: null })}
        onConfirm={handleSaveRate}
      />

      <DpdpComplianceModal
        open={complianceModal.open}
        result={complianceModal.result}
        onClose={() => setComplianceModal({ open: false, result: null })}
      />

      {/* 7. CONFIRM DIALOG */}
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
