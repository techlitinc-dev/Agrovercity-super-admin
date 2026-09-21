import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Coins,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  Landmark,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react'
import { StatusBadge, PersonaBadge, fmtINR, formatDate } from '../../pages/settlementsWidgets'

export default function SettlementsDetailDrawer({
  entity,
  type = 'settlements', // 'settlements', 'transporters', 'sellers', 'cron'
  isOpen,
  onClose,
  onMarkPaid,
  onHold,
  onReleaseHold,
  onTriggerCron
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
      case 'settlements':
        return Coins
      case 'transporters':
        return Truck
      case 'sellers':
        return Package
      case 'cron':
        return Clock
      default:
        return Coins
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
                  {entity.batchId || entity.tripId || entity.lotId || entity.jobName || entity.id}
                </h2>
                <StatusBadge status={entity.status || entity.escrowReleaseStatus} />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                ID: {entity.id} · Timestamp: {formatDate(entity.updatedAt || entity.lastExecutedAt || entity.createdAt)}
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
            onClick={() => setActiveTab('banking')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'banking'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bank & GST Invoicing
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
              {/* Master Settlement View */}
              {type === 'settlements' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Gross Value</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.grossAmountInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Platform Fee ({entity.commissionRatePct}%)</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">GST + TDS</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR((entity.gstOnFeeInr || 0) + (entity.tdsDeductedInr || 0))}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Net Payable</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.netPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Beneficiary & Batch Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Beneficiary:</span>
                        <div className="text-slate-200 font-medium">{entity.beneficiaryName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{entity.beneficiaryPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Persona / Channel:</span>
                        <div className="mt-1">
                          <PersonaBadge type={entity.entityType} />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Batch Code:</span>
                        <div className="text-slate-200 font-mono">{entity.batchId}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Settlement Period:</span>
                        <div className="text-slate-200 font-mono">{entity.settlementPeriod}</div>
                      </div>
                    </div>
                  </div>

                  {entity.holdReason && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Legal Hold Active</span>
                      </div>
                      <p>{entity.holdReason}</p>
                    </div>
                  )}

                  {entity.netPayoutInr > 50000 && (
                    <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>Dual Sign-off Compliance (&gt; ₹50,000)</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Admin 1: {entity.signOffAdmin1 || 'Pending'} · Admin 2: {entity.signOffAdmin2 || 'Co-authorizer required before bank transfer'}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Transporter Trip View */}
              {type === 'transporters' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Gross Freight</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.grossFreightInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Platform Fee (10%)</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Net Payable Freight</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.netFreightInr)}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Transit Manifest & e-Way Bill</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Transporter:</span>
                        <div className="text-slate-200 font-medium">{entity.transporterName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Vehicle:</span>
                        <div className="text-slate-200 font-mono">{entity.vehicleNo}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Route & Distance:</span>
                        <div className="text-slate-200">{entity.route} ({entity.distanceKm} km)</div>
                      </div>
                      <div>
                        <span className="text-slate-500">e-Way Bill No:</span>
                        <div className="text-emerald-400 font-mono">{entity.eWayBillNo}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Seller Escrow View */}
              {type === 'sellers' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Escrow Value</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.escrowDepositInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Platform Fee (2.5%)</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Net Seller Release</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.netSellerPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Produce Lot & Delivery Verification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Farmer / Seller:</span>
                        <div className="text-slate-200 font-medium">{entity.sellerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Buyer Corporate:</span>
                        <div className="text-slate-200 font-medium">{entity.buyerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Commodity:</span>
                        <div className="text-slate-200">{entity.commodity} ({entity.quantityQuintals} Quintals)</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Delivery Confirmed:</span>
                        <div className="text-emerald-400 font-mono">{formatDate(entity.deliveryConfirmedAt)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Cron Job View */}
              {type === 'cron' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Duration</span>
                      <div className="text-base font-bold text-white mt-0.5 font-mono">{entity.durationMs} ms</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Records Handled</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{entity.recordsProcessed}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Schedule</span>
                      <div className="text-xs font-mono text-purple-400 mt-1">{entity.schedule}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Execution Trace & Purpose</h4>
                    <p className="text-slate-300">{entity.description}</p>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 mt-2">
                      {entity.executionLogExcerpt}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span>Beneficiary Bank Mandate & Tax Identification</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Designated Bank:</span>
                    <span className="font-medium text-slate-200">{entity.bankName || 'State Bank of India'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Account Number (DPDP Masked):</span>
                    <span className="font-mono text-emerald-400">{entity.accountNumberMasked || '••••••••4921'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-200">{entity.ifscCode || 'SBIN0000412'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">PAN Card (Masked):</span>
                    <span className="font-mono text-slate-200">{entity.panMasked || 'ABCDE••••F'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">GST Invoice Number:</span>
                    <span className="font-mono text-purple-400">{entity.gstInvoiceNo || 'Pending Invoicing'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Bank UTR / Ref:</span>
                    <span className="font-mono text-blue-400">{entity.paymentReferenceUtr || 'Pending Disbursement'}</span>
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
            SOP-25 Compliant · Automated Reconciliation Gate
          </div>
          <div className="flex items-center gap-2">
            {type === 'settlements' && entity.status === 'approved' && onMarkPaid && (
              <button
                onClick={() => onMarkPaid(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Mark Paid
              </button>
            )}
            {type === 'settlements' && entity.status !== 'on_hold' && entity.status !== 'paid' && onHold && (
              <button
                onClick={() => onHold(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Put on Legal Hold
              </button>
            )}
            {type === 'settlements' && entity.status === 'on_hold' && onReleaseHold && (
              <button
                onClick={() => onReleaseHold(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Release Hold
              </button>
            )}
            {type === 'cron' && onTriggerCron && (
              <button
                onClick={() => onTriggerCron(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Run Now
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
