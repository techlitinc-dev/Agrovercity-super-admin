import React, { useState } from 'react'
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
  Users
} from 'lucide-react'
import { StatusBadge, EligibilityBadge, fmtINR, formatDate } from '../../pages/womenShgWidgets'

export default function WomenShgDetailDrawer({
  entity,
  type = 'shgs', // 'shgs', 'deposits', 'enterprises', 'subsidies'
  isOpen,
  onClose,
  onVerifyShg,
  onSuspendShg,
  onCurateProduct,
  onDisburseSubsidy
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

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
      default:
        return HandHeart
    }
  }

  const Icon = getIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {entity.shgName || entity.productTitle || entity.memberName || entity.schemeName || entity.id}
                </h2>
                <StatusBadge status={entity.status} />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                ID: {entity.id} · Updated: {formatDate(entity.updatedAt || entity.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-4 border-b border-slate-800 bg-slate-950/30 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'financial'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Financial Health & Bank Mandate
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Document JSON
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* SHG View */}
              {type === 'shgs' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Total Members</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.membersCount} Mahila Kisan</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Savings Corpus</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.savingsCorpusInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Internal Loans</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.internalLoanOutstandInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Recovery Rate</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{entity.recoveryRatePct}%</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-semibold text-white">Cluster Federation & Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Village / Block:</span>
                        <div className="text-slate-200 font-medium">{entity.village}, {entity.block}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">District / State:</span>
                        <div className="text-slate-200">{entity.district}, {entity.state}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">NRLM Cluster Federation:</span>
                        <div className="text-slate-200 font-medium">{entity.federationCluster}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-semibold text-white">Office Bearers & Leadership</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">President:</span>
                        <div className="text-slate-200 font-medium">{entity.presidentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{entity.presidentPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Secretary:</span>
                        <div className="text-slate-200 font-medium">{entity.secretaryName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{entity.secretaryPhone}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">NRLM / MSRLM Verification Documents</h4>
                    <div className="space-y-1.5">
                      {entity.verificationDocuments?.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Monthly Savings</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.amountInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Loan Repayment</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.internalLoanRepaymentInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Interest Paid</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{fmtINR(entity.internalInterestPaidInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Deposit Month</span>
                      <div className="text-base font-bold text-white mt-0.5 font-mono">{entity.depositMonth}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Member & SHG Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Member Name:</span>
                        <div className="text-slate-200 font-medium">{entity.memberName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone (Masked):</span>
                        <div className="text-slate-200 font-mono">{entity.memberPhone}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">SHG Affiliation:</span>
                        <div className="text-slate-200">{entity.shgName}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                      Recorded By: {entity.recordedBy} · Mode: {entity.paymentMode}
                    </div>
                  </div>
                </>
              )}

              {/* Enterprise View */}
              {type === 'enterprises' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Price / Unit</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.priceInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Stock Inventory</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.stockUnits} Units</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Sold Count</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.totalSoldUnits} Units</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Total Revenue</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">{fmtINR(entity.revenueGeneratedInr)}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Artisan & Cottage Certification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Producer Artisan:</span>
                        <div className="text-slate-200 font-medium">{entity.artisanName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">SHG Origin:</span>
                        <div className="text-slate-200">{entity.shgName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">FSSAI Registration:</span>
                        <div className="text-slate-200 font-mono">{entity.fssaiRegistration}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Organic / Quality Tag:</span>
                        <div className="text-emerald-400 font-medium">{entity.organicCert}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                      Curation Notes: {entity.curationNotes}
                    </div>
                  </div>
                </>
              )}

              {/* Subsidies View */}
              {type === 'subsidies' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Grant Amount</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.amountInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Grant Type</span>
                      <div className="text-xs font-semibold text-white mt-1">{entity.grantType}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Bank UTR</span>
                      <div className="text-xs font-mono text-blue-400 mt-1 truncate">{entity.bankReferenceUtr || 'Pending'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Beneficiary & Scheme Details</h4>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-slate-500">Scheme Name:</span>
                        <div className="text-slate-200 font-medium">{entity.schemeName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Beneficiary SHG:</span>
                        <div className="text-slate-200">{entity.shgName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Sanction Justification:</span>
                        <div className="text-slate-300">{entity.justification}</div>
                      </div>
                    </div>
                  </div>

                  {entity.amountInr > 50000 && (
                    <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>Dual Sign-off Threshold Enforced (&gt; ₹50k)</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Admin 1: {entity.signOffAdmin1 || 'Pending'} · Admin 2: {entity.signOffAdmin2 || 'Co-authorizer required'}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span>Bank Account Mandate & Micro-Credit Discipline</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Designated Bank:</span>
                    <span className="font-medium text-slate-200">{entity.bankName || 'Bank of Maharashtra'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Account Number (Masked):</span>
                    <span className="font-mono text-emerald-400">{entity.accountNumberMasked || '••••••••4921'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-200">{entity.ifscCode || 'MAHB0000412'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Meeting Discipline Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">{entity.weeklyMeetingDisciplinePct || 95}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[450px]">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            SOP-24 Compliant · Rural Inclusion Gate
          </div>
          <div className="flex items-center gap-2">
            {type === 'shgs' && entity.status === 'pending_verification' && onVerifyShg && (
              <button
                onClick={() => onVerifyShg(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Verify SHG
              </button>
            )}
            {type === 'shgs' && entity.status === 'verified' && onSuspendShg && (
              <button
                onClick={() => onSuspendShg(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Suspend
              </button>
            )}
            {type === 'enterprises' && onCurateProduct && (
              <button
                onClick={() => onCurateProduct(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Curate SKU
              </button>
            )}
            {type === 'subsidies' && (entity.status === 'pending_approval' || entity.status === 'dual_signoff_pending') && onDisburseSubsidy && (
              <button
                onClick={() => onDisburseSubsidy(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Disburse Subsidy
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
