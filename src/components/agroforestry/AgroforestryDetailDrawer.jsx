import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Trees,
  Sprout,
  Building2,
  Fuel,
  BookOpen,
  FileText,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react'
import { StatusBadge, fmtINR, formatDate } from '../../pages/agroforestryWidgets'

export default function AgroforestryDetailDrawer({
  entity,
  type = 'requests', // 'requests', 'ngos', 'biofuel', 'guides', 'articles'
  isOpen,
  onClose,
  onApprove,
  onDispatch,
  onDeliver,
  onReject,
  onVerifyNgo,
  onEditEconomics
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
      case 'requests':
        return Sprout
      case 'ngos':
        return Building2
      case 'biofuel':
        return Fuel
      case 'guides':
        return BookOpen
      default:
        return FileText
    }
  }

  const Icon = getIcon()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-1">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400">{entity.id}</span>
                <StatusBadge status={entity.status} />
              </div>
              <h2 className="text-base font-bold text-white mt-1 leading-snug">
                {entity.farmerName || entity.name || entity.commonName || entity.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {entity.speciesRequested || entity.district || entity.botanicalName || entity.intercroppingModel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 border-b border-slate-800 bg-slate-950/20 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Document JSON
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Common Metadata Card */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Entity Metadata & Governance
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Created At</span>
                    <span className="text-slate-200 font-mono text-[11px]">{formatDate(entity.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Last Updated</span>
                    <span className="text-slate-200 font-mono text-[11px]">{formatDate(entity.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Operator ID</span>
                    <span className="font-mono text-slate-300 text-[11px]">{entity.userId || 'usr_admin_root'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">DPDP Compliance</span>
                    <span className="text-emerald-400 font-mono text-[11px]">Aadhaar Masked</span>
                  </div>
                </div>
              </div>

              {type === 'requests' && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Farmer Land & Sapling Allocation Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Farmer Name</span>
                      <span className="text-slate-200 font-medium">{entity.farmerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Contact (Masked)</span>
                      <span className="font-mono text-slate-200">{entity.farmerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Land 7/12 Survey No</span>
                      <span className="font-mono text-emerald-400">{entity.surveyNumber712} ({entity.landAreaAcres} Acres)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Aadhaar (DPDP Masked)</span>
                      <span className="font-mono text-slate-300">{entity.aadhaarMasked}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Quantity Requested</span>
                      <span className="font-mono text-emerald-400 font-bold">{entity.quantity} Saplings (Max 500 Cap)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Subsidy & Farmer Share</span>
                      <span className="font-mono text-slate-200">{entity.subsidyPct}% (Payable: {fmtINR(entity.farmerPayableINR)})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Allocated Partner Nursery</span>
                      <span className="text-slate-200">{entity.allocatedNgoName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Tracking / Waybill No</span>
                      <span className="font-mono text-purple-400">{entity.dispatchTrackingNo || 'Not Dispatched Yet'}</span>
                    </div>
                  </div>
                  {entity.deliveryAddress && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Delivery Address</span>
                      <p className="text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800">{entity.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              )}

              {type === 'ngos' && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Afforestation NGO & Nursery Operational Audit
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">NITI Aayog Darpan ID</span>
                      <span className="font-mono text-emerald-400 font-medium">{entity.darpanId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Trust Registration No</span>
                      <span className="font-mono text-slate-200">{entity.trustRegNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">80G / 12A Status</span>
                      <span className="text-slate-200">{entity.has80G12A ? 'Verified Active Exemption' : 'Pending Audit'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Nursery Land Area</span>
                      <span className="font-mono text-slate-200">{entity.nurseryAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Annual Capacity</span>
                      <span className="font-mono text-slate-200">{entity.annualSaplingCapacity?.toLocaleString()} / yr</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Current Live Stock</span>
                      <span className="font-mono text-emerald-400 font-bold">{entity.currentStock?.toLocaleString()} saplings</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'biofuel' && (
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Commercial Biofuel Agronomy & Economics
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Botanical Name</span>
                      <span className="italic text-slate-200">{entity.botanicalName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Gestation Period</span>
                      <span className="font-mono text-slate-200">{entity.gestationYears} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Seed Oil Content</span>
                      <span className="font-mono text-emerald-400 font-bold">{entity.oilContentPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Seed Yield / Tree</span>
                      <span className="font-mono text-slate-200">{entity.seedYieldKgPerTree} kg / tree</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Gross Annual Return / Acre</span>
                      <span className="font-mono text-emerald-400 font-bold">{fmtINR(entity.annualGrossReturnPerAcreINR)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Carbon Sequestration</span>
                      <span className="font-mono text-slate-200">{entity.co2SequestrationKgPerYear} kg CO2 / yr</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Offtake & Buyback Depot</span>
                    <p className="text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800 font-medium">
                      {entity.buybackPartner} (@ ₹{entity.marketRatePerKgINR}/kg guaranteed base rate)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          {type === 'requests' && entity.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove && onApprove(entity)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
              >
                Approve Request
              </button>
              <button
                onClick={() => onReject && onReject(entity)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Reject
              </button>
            </>
          )}

          {type === 'requests' && entity.status === 'approved' && (
            <button
              onClick={() => onDispatch && onDispatch(entity)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium"
            >
              Dispatch Saplings
            </button>
          )}

          {type === 'requests' && entity.status === 'dispatched' && (
            <button
              onClick={() => onDeliver && onDeliver(entity)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
            >
              Mark Delivered & Survival
            </button>
          )}

          {type === 'ngos' && (
            <button
              onClick={() => onVerifyNgo && onVerifyNgo(entity)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
            >
              Update NGO Verification
            </button>
          )}

          {type === 'biofuel' && (
            <button
              onClick={() => onEditEconomics && onEditEconomics(entity)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
            >
              Edit Economics
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
