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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-center justify-between bg-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {entity.batchId || entity.tripId || entity.lotId || entity.jobName || entity.id}
                </h2>
                <StatusBadge status={entity.status || entity.escrowReleaseStatus} />
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                ID: {entity.id} · Timestamp: {formatDate(entity.updatedAt || entity.lastExecutedAt || entity.createdAt)}
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
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'banking'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank & GST Invoicing
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Document JSON
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Master Settlement View */}
              {type === 'settlements' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Gross Value</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.grossAmountInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Platform Fee ({entity.commissionRatePct}%)</span>
                      <div className="text-base font-bold text-purple-700 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">GST + TDS</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR((entity.gstOnFeeInr || 0) + (entity.tdsDeductedInr || 0))}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Net Payable</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">{fmtINR(entity.netPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                    <h4 className="font-bold text-slate-900">Beneficiary & Batch Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Beneficiary:</span>
                        <div className="text-slate-900 font-bold">{entity.beneficiaryName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{entity.beneficiaryPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Persona / Channel:</span>
                        <div className="mt-1">
                          <PersonaBadge type={entity.entityType} />
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Batch Code:</span>
                        <div className="text-slate-800 font-mono font-semibold">{entity.batchId}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Settlement Period:</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.settlementPeriod}</div>
                      </div>
                    </div>
                  </div>

                  {entity.holdReason && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Legal Hold Active</span>
                      </div>
                      <p>{entity.holdReason}</p>
                    </div>
                  )}

                  {entity.netPayoutInr > 50000 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-purple-900">
                        <Lock className="w-4 h-4 text-purple-600" />
                        <span>Dual Sign-off Compliance (&gt; ₹50,000)</span>
                      </div>
                      <div className="text-[11px] text-purple-800">
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
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Gross Freight</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.grossFreightInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Platform Fee (10%)</span>
                      <div className="text-base font-bold text-purple-700 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Net Payable Freight</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">{fmtINR(entity.netFreightInr)}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                    <h4 className="font-bold text-slate-900">Transit Manifest & e-Way Bill</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Transporter:</span>
                        <div className="text-slate-900 font-bold">{entity.transporterName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Vehicle:</span>
                        <div className="text-slate-800 font-mono font-semibold">{entity.vehicleNo}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Route & Distance:</span>
                        <div className="text-slate-800">{entity.route} ({entity.distanceKm} km)</div>
                      </div>
                      <div>
                        <span className="text-slate-500">e-Way Bill No:</span>
                        <div className="text-emerald-700 font-mono font-bold">{entity.eWayBillNo}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Seller Escrow View */}
              {type === 'sellers' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Escrow Value</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.escrowDepositInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Platform Fee (2.5%)</span>
                      <div className="text-base font-bold text-purple-700 mt-0.5">{fmtINR(entity.platformFeeInr)}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Net Seller Release</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">{fmtINR(entity.netSellerPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                    <h4 className="font-bold text-slate-900">Produce Lot & Delivery Verification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Farmer / Seller:</span>
                        <div className="text-slate-900 font-bold">{entity.sellerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Buyer Corporate:</span>
                        <div className="text-slate-900 font-bold">{entity.buyerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Commodity:</span>
                        <div className="text-slate-800">{entity.commodity} ({entity.quantityQuintals} Quintals)</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Delivery Confirmed:</span>
                        <div className="text-emerald-700 font-mono font-semibold">{formatDate(entity.deliveryConfirmedAt)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Cron Job View */}
              {type === 'cron' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Duration</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5 font-mono">{entity.durationMs} ms</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Records Handled</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5 font-mono">{entity.recordsProcessed}</div>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-500 font-medium">Schedule</span>
                      <div className="text-xs font-mono font-bold text-purple-700 mt-1">{entity.schedule}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-2 shadow-xs">
                    <h4 className="font-bold text-slate-900">Execution Trace & Purpose</h4>
                    <p className="text-slate-700 leading-relaxed">{entity.description}</p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 mt-2">
                      {entity.executionLogExcerpt}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="space-y-4">
              <div className="bg-white border border-emerald-100/80 rounded-xl p-4 space-y-3 shadow-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span>Beneficiary Bank Mandate & Tax Identification</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Designated Bank:</span>
                    <span className="font-bold text-slate-900">{entity.bankName || 'State Bank of India'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Account Number (DPDP Masked):</span>
                    <span className="font-mono font-bold text-emerald-700">{entity.accountNumberMasked || '••••••••4921'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono text-slate-800 font-medium">{entity.ifscCode || 'SBIN0000412'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">PAN Card (Masked):</span>
                    <span className="font-mono text-slate-800 font-medium">{entity.panMasked || 'ABCDE••••F'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">GST Invoice Number:</span>
                    <span className="font-mono font-bold text-purple-700">{entity.gstInvoiceNo || 'Pending Invoicing'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Bank UTR / Ref:</span>
                    <span className="font-mono font-bold text-blue-700">{entity.paymentReferenceUtr || 'Pending Disbursement'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-[11px] text-slate-200 border border-slate-700 transition-colors"
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
        <div className="p-4 border-t border-emerald-100/80 bg-slate-50/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            SOP-25 Compliant · Automated Reconciliation Gate
          </div>
          <div className="flex items-center gap-2">
            {type === 'settlements' && entity.status === 'approved' && onMarkPaid && (
              <button
                onClick={() => onMarkPaid(entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                Mark Paid
              </button>
            )}
            {type === 'settlements' && entity.status !== 'on_hold' && entity.status !== 'paid' && onHold && (
              <button
                onClick={() => onHold(entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs"
              >
                Put on Legal Hold
              </button>
            )}
            {type === 'settlements' && entity.status === 'on_hold' && onReleaseHold && (
              <button
                onClick={() => onReleaseHold(entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                Release Hold
              </button>
            )}
            {type === 'cron' && onTriggerCron && (
              <button
                onClick={() => onTriggerCron(entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
              >
                Run Now
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
