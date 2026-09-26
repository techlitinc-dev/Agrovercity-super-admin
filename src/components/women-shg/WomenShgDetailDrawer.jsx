import React, { useState, useEffect } from 'react'
import {
  X,
  Copy,
  Check,
  HandHeart,
  PiggyBank,
  Store,
  Coins,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Lock,
  Landmark,
  CheckCircle2,
  Users,
  History,
  ShieldAlert,
  Smartphone,
  Mic,
  Radio
} from 'lucide-react'
import { StatusBadge, EligibilityBadge, fmtINR, formatDate } from '../../pages/womenShgWidgets'
import { getEntityAuditLogs } from '../../api/womenShgApi'

export default function WomenShgDetailDrawer({
  entity,
  type = 'shgs', // 'shgs', 'deposits', 'enterprises', 'subsidies'
  isOpen,
  onClose,
  onVerifyShg,
  onSuspendShg,
  onCurateProduct,
  onDisburseSubsidy,
  canMutate = true,
  role = 'SUPER_ADMIN'
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [entityLogs, setEntityLogs] = useState([])

  useEffect(() => {
    if (entity?.id) {
      getEntityAuditLogs(entity.id)
        .then((logs) => setEntityLogs(logs || []))
        .catch(() => setEntityLogs([]))
    } else {
      setEntityLogs([])
    }
  }, [entity?.id])

  if (!isOpen || !entity) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getIcon = () => {
    switch (type) {
      case 'shgs':
        return HandHeart
      case 'deposits':
        return PiggyBank
      case 'enterprises':
        return Store
      case 'subsidies':
        return Coins
      case 'districts':
        return Smartphone
      default:
        return HandHeart
    }
  }

  const Icon = getIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {entity.shgName || entity.productTitle || entity.memberName || entity.schemeName || (entity.district ? `${entity.district} District Telemetry` : entity.id)}
                </h2>
                <StatusBadge status={entity.status} />
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                ID: {entity.id} · Updated: {formatDate(entity.updatedAt || entity.createdAt || entity.lastSyncAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-4 border-b border-emerald-100/80 bg-slate-50/50 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'financial'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Financial Health & Bank Mandate
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw Document JSON
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History ({entityLogs.length})</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-600">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* SHG View */}
              {type === 'shgs' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Total Members</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.membersCount} Mahila Kisan</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Savings Corpus</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.savingsCorpusInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Internal Loans</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.internalLoanOutstandInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Recovery Rate</span>
                      <div className="text-base font-bold text-teal-700 mt-0.5">{entity.recoveryRatePct}%</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-slate-900">Cluster Federation & Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Village / Block:</span>
                        <div className="text-slate-900 font-semibold">{entity.village}, {entity.block}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">District / State:</span>
                        <div className="text-slate-800 font-medium">{entity.district}, {entity.state}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 font-medium">NRLM Cluster Federation:</span>
                        <div className="text-slate-900 font-semibold">{entity.federationCluster}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-slate-900">Office Bearers & Leadership</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">President:</span>
                        <div className="text-slate-900 font-semibold">{entity.presidentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{entity.presidentPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Secretary:</span>
                        <div className="text-slate-900 font-semibold">{entity.secretaryName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{entity.secretaryPhone}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">NRLM / MSRLM Verification Documents</h4>
                    <div className="space-y-1.5">
                      {entity.verificationDocuments?.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Deposit View */}
              {type === 'deposits' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Monthly Savings</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.amountInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Loan Repayment</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.internalLoanRepaymentInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Interest Paid</span>
                      <div className="text-base font-bold text-teal-700 mt-0.5">{fmtINR(entity.internalInterestPaidInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Deposit Month</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">{entity.depositMonth}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Member & SHG Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Member Name:</span>
                        <div className="text-slate-900 font-semibold">{entity.memberName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Phone (Masked):</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.memberPhone}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 font-medium">SHG Affiliation:</span>
                        <div className="text-slate-800 font-medium">{entity.shgName}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 border-t border-emerald-100/80">
                      Recorded By: {entity.recordedBy} · Mode: {entity.paymentMode}
                    </div>
                  </div>
                </>
              )}

              {/* Enterprise View */}
              {type === 'enterprises' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Price / Unit</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.priceInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Stock Inventory</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.stockUnits} Units</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Sold Count</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.totalSoldUnits} Units</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Total Revenue</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">{fmtINR(entity.revenueGeneratedInr)}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Artisan & Cottage Certification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Producer Artisan:</span>
                        <div className="text-slate-900 font-semibold">{entity.artisanName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">SHG Origin:</span>
                        <div className="text-slate-800 font-medium">{entity.shgName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">FSSAI Registration:</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.fssaiRegistration}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Organic / Quality Tag:</span>
                        <div className="text-emerald-700 font-bold">{entity.organicCert}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 border-t border-emerald-100/80">
                      Curation Notes: {entity.curationNotes}
                    </div>
                  </div>
                </>
              )}

              {/* Subsidies View */}
              {type === 'subsidies' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Grant Amount</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.amountInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Grant Type</span>
                      <div className="text-xs font-bold text-slate-900 mt-1">{entity.grantType}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Bank UTR</span>
                      <div className="text-xs font-mono text-teal-700 font-bold mt-1 truncate">{entity.bankReferenceUtr || 'Pending'}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Beneficiary & Scheme Details</h4>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Scheme Name:</span>
                        <div className="text-slate-900 font-semibold">{entity.schemeName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Beneficiary SHG:</span>
                        <div className="text-slate-800 font-medium">{entity.shgName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Sanction Justification:</span>
                        <div className="text-slate-700">{entity.justification}</div>
                      </div>
                    </div>
                  </div>

                  {entity.amountInr > 50000 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <Lock className="w-4 h-4" />
                        <span>Dual Sign-off Threshold Enforced (&gt; ₹50k)</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Admin 1: {entity.signOffAdmin1 || 'Pending'} · Admin 2: {entity.signOffAdmin2 || 'Co-authorizer required'}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* District Telemetry View */}
              {type === 'districts' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Active Women Users</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        {entity.activeWomenModeUsers?.toLocaleString('en-IN') || 0}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">SHG Linkage</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">
                        {entity.shgLinkageRatePct || 0}%
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Voice Interface</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        {entity.voiceInterfacePct || 0}%
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Audio Passbooks</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">
                        {entity.audioPassbookSessions?.toLocaleString('en-IN') || 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span>District NRLM Liaison & Telemetry Pipeline</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">District / State:</span>
                        <div className="font-bold text-slate-900">{entity.district}, {entity.state}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">NRLM Cluster Officer:</span>
                        <div className="font-bold text-slate-900">{entity.nrlmClusterOfficer}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Officer Contact:</span>
                        <div className="font-mono text-emerald-700 font-bold">{entity.officerPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Telemetry Sync:</span>
                        <div className="font-mono text-slate-700">{formatDate(entity.lastSyncAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-emerald-100/80 rounded-xl p-3 text-xs space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Voice Interface Dialect Support</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Standard Marathi, Ahirani, Khandeshi & Varhadi dialect speech recognition active. Illiterate members can query deposit balances and pending loan dues using voice commands.
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-700" />
                  <span>Bank Account Mandate & Micro-Credit Discipline</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">Designated Bank:</span>
                    <span className="font-bold text-slate-900">{entity.bankName || 'Bank of Maharashtra'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">Account Number (Masked):</span>
                    <span className="font-mono text-emerald-700 font-bold">{entity.accountNumberMasked || '••••••••4921'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">IFSC Code:</span>
                    <span className="font-mono text-slate-800 font-medium">{entity.ifscCode || 'MAHB0000412'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Meeting Discipline Rate:</span>
                    <span className="font-mono text-emerald-700 font-bold">{entity.weeklyMeetingDisciplinePct || 95}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-[11px] text-slate-200 border border-slate-700 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[450px]">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-100/80">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Immutable Audit Trail for Entity {entity.id}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {entityLogs.length} events logged
                </span>
              </div>
              {entityLogs.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs">
                  No audit events recorded for this entity yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {entityLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-emerald-100/90 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {log.actionType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 font-medium">
                        {log.reason || 'No description provided.'}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Admin: <strong className="text-slate-700">{log.adminName}</strong> ({log.adminUid})</span>
                        {log.newState && (
                          <span className="font-mono text-emerald-700">State: {log.previousState || 'init'} → {log.newState}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-100/80 bg-slate-50/80 flex items-center justify-between gap-2">
          {!canMutate || role === 'FINANCIAL_AUDITOR' ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 flex-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">
                  <strong>Auditor Mode:</strong> Read-only access enabled under statutory governance policies. SHG verifications, suspension, product curation, and subsidy disbursements are locked.
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs shrink-0"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                SOP-24 Compliant · Rural Inclusion Gate
              </div>
              <div className="flex items-center gap-2">
                {type === 'shgs' && entity.status === 'pending_verification' && onVerifyShg && (
                  <button
                    onClick={() => onVerifyShg(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                  >
                    Verify SHG
                  </button>
                )}
                {type === 'shgs' && entity.status === 'verified' && onSuspendShg && (
                  <button
                    onClick={() => onSuspendShg(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs"
                  >
                    Suspend
                  </button>
                )}
                {type === 'enterprises' && onCurateProduct && (
                  <button
                    onClick={() => onCurateProduct(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs"
                  >
                    Curate SKU
                  </button>
                )}
                {type === 'subsidies' && (entity.status === 'pending_approval' || entity.status === 'dual_signoff_pending') && onDisburseSubsidy && (
                  <button
                    onClick={() => onDisburseSubsidy(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                  >
                    Disburse Subsidy
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

