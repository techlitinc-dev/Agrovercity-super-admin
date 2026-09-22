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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-start justify-between bg-emerald-50/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 mt-1 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-500">{entity.id}</span>
                <StatusBadge status={entity.status} />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {entity.farmerName || entity.name || entity.commonName || entity.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {entity.speciesRequested || entity.district || entity.botanicalName || entity.intercroppingModel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 border-b border-emerald-100/80 bg-emerald-50/20 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 border-b-2 font-medium transition-colors ${
              activeTab === 'json'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
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
              <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Entity Metadata & Governance
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Created At</span>
                    <span className="text-slate-900 font-mono text-[11px] font-medium">{formatDate(entity.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Last Updated</span>
                    <span className="text-slate-900 font-mono text-[11px] font-medium">{formatDate(entity.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Operator ID</span>
                    <span className="font-mono text-slate-700 text-[11px]">{entity.userId || 'usr_admin_root'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">DPDP Compliance</span>
                    <span className="text-emerald-700 font-mono text-[11px] font-bold">Aadhaar Masked</span>
                  </div>
                </div>
              </div>

              {type === 'requests' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Farmer Land & Sapling Allocation Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Farmer Name</span>
                      <span className="text-slate-900 font-bold">{entity.farmerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Contact (Masked)</span>
                      <span className="font-mono text-slate-800">{entity.farmerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Land 7/12 Survey No</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.surveyNumber712} ({entity.landAreaAcres} Acres)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Aadhaar (DPDP Masked)</span>
                      <span className="font-mono text-slate-700">{entity.aadhaarMasked}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Quantity Requested</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.quantity} Saplings (Max 500 Cap)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Subsidy & Farmer Share</span>
                      <span className="font-mono text-slate-900 font-medium">{entity.subsidyPct}% (Payable: {fmtINR(entity.farmerPayableINR)})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Allocated Partner Nursery</span>
                      <span className="text-slate-900 font-medium">{entity.allocatedNgoName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Tracking / Waybill No</span>
                      <span className="font-mono text-purple-700 font-bold">{entity.dispatchTrackingNo || 'Not Dispatched Yet'}</span>
                    </div>
                  </div>
                  {entity.deliveryAddress && (
                    <div>
                      <span className="text-slate-500 text-[11px] block">Delivery Address</span>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">{entity.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              )}

              {type === 'ngos' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Afforestation NGO & Nursery Operational Audit
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">NITI Aayog Darpan ID</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.darpanId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Trust Registration No</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.trustRegNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">80G / 12A Status</span>
                      <span className="text-slate-900 font-medium">{entity.has80G12A ? 'Verified Active Exemption' : 'Pending Audit'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Nursery Land Area</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.nurseryAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Annual Capacity</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.annualSaplingCapacity?.toLocaleString()} / yr</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Current Live Stock</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.currentStock?.toLocaleString()} saplings</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'biofuel' && (
                <div className="bg-white border border-emerald-100/90 rounded-xl p-3.5 space-y-3 shadow-xs">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Commercial Biofuel Agronomy & Economics
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Botanical Name</span>
                      <span className="italic text-slate-800 font-medium">{entity.botanicalName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Gestation Period</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.gestationYears} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Seed Oil Content</span>
                      <span className="font-mono text-emerald-800 font-bold">{entity.oilContentPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Seed Yield / Tree</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.seedYieldKgPerTree} kg / tree</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Gross Annual Return / Acre</span>
                      <span className="font-mono text-emerald-800 font-bold">{fmtINR(entity.annualGrossReturnPerAcreINR)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Carbon Sequestration</span>
                      <span className="font-mono text-slate-800 font-medium">{entity.co2SequestrationKgPerYear} kg CO2 / yr</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Offtake & Buyback Depot</span>
                    <p className="text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-semibold">
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
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Raw JSON Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-100/80 bg-emerald-50/40 flex items-center justify-end gap-2">
          {type === 'requests' && entity.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove && onApprove(entity)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Approve Request
              </button>
              <button
                onClick={() => onReject && onReject(entity)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Reject
              </button>
            </>
          )}

          {type === 'requests' && entity.status === 'approved' && (
            <button
              onClick={() => onDispatch && onDispatch(entity)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Dispatch Saplings
            </button>
          )}

          {type === 'requests' && entity.status === 'dispatched' && (
            <button
              onClick={() => onDeliver && onDeliver(entity)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Mark Delivered & Survival
            </button>
          )}

          {type === 'ngos' && (
            <button
              onClick={() => onVerifyNgo && onVerifyNgo(entity)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Update NGO Verification
            </button>
          )}

          {type === 'biofuel' && (
            <button
              onClick={() => onEditEconomics && onEditEconomics(entity)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Edit Economics
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
