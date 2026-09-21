import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Stethoscope,
  HeartPulse,
  Trees,
  Milk,
  Calendar,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Landmark,
  Coins,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { StatusBadge, fmtINR } from '../../pages/livestockWidgets'

export default function LivestockDetailDrawer({
  entity,
  type = 'vet', // 'vet', 'gaushala', 'nursery', 'dairy', 'booking', 'manure'
  isOpen,
  onClose,
  onAction
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !entity) return null

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getEntityIcon = () => {
    switch (type) {
      case 'vet':
        return Stethoscope
      case 'gaushala':
        return HeartPulse
      case 'nursery':
        return Trees
      case 'dairy':
        return Milk
      case 'booking':
        return Calendar
      case 'manure':
        return Truck
      default:
        return FileText
    }
  }

  const Icon = getEntityIcon()

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
                <span className="text-[11px] font-mono uppercase text-slate-400">{entity.id || entity.orderNumber || entity.bookingNumber}</span>
                <StatusBadge status={entity.status || entity.bookingStatus || entity.deliveryStatus} />
              </div>
              <h2 className="text-base font-bold text-white mt-1 leading-snug">
                {entity.name || entity.bookingNumber || entity.orderNumber}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {entity.clinicName || entity.brandOrGaushala || entity.gaushalaName || entity.ownerName || entity.farmerName}
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
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/20 space-x-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'compliance'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Compliance &amp; Certs
          </button>
          <button
            onClick={() => setActiveTab('capacity')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'capacity'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Capacity &amp; Fleet
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'financials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Financials &amp; Escrow
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-2.5 border-b-2 transition-colors ${
              activeTab === 'raw'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Primary Attributes</h3>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Contact</span>
                    <span className="font-medium text-slate-200">
                      {entity.mobile || entity.contactPhone || entity.phone || entity.farmerPhone || entity.buyerPhone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location</span>
                    <span className="font-medium text-slate-200">
                      {entity.district ? `${entity.taluka || ''}, ${entity.district}, ${entity.state || ''}` : entity.deliveryDestination || entity.village || 'N/A'}
                    </span>
                  </div>
                  {entity.email && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Email Address</span>
                      <span className="font-mono text-slate-300">{entity.email}</span>
                    </div>
                  )}
                  {entity.maskedAadhaar && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">DPDP Masked Aadhaar</span>
                      <span className="font-mono text-emerald-400 font-semibold">{entity.maskedAadhaar}</span>
                    </div>
                  )}
                  {entity.experienceYears && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Practice Experience</span>
                      <span className="font-semibold text-slate-200">{entity.experienceYears} Years</span>
                    </div>
                  )}
                  {entity.averageRating && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Client Rating</span>
                      <span className="font-bold text-amber-400">★ {entity.averageRating} / 5.0</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specializations / Description */}
              {(entity.specialization || entity.symptomsDescription || entity.panchagavyaProducts) && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    {entity.symptomsDescription ? 'Clinical Symptoms Description' : 'Specialization & Offerings'}
                  </h3>
                  {entity.symptomsDescription ? (
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-sans">
                      {entity.symptomsDescription}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(entity.specialization || entity.panchagavyaProducts || []).map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Doctor Notes / Admin Mediation Reason */}
              {(entity.doctorNotes || entity.adminMediationReason || entity.flaggedReason || entity.recallReason) && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Special Regulatory / Clinical Notes</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-xs">
                    {entity.doctorNotes || entity.adminMediationReason || entity.flaggedReason || entity.recallReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Registration &amp; Statutory Licenses
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  {entity.councilRegNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">State Veterinary Council Reg</span>
                      <span className="font-mono font-semibold text-slate-200">{entity.councilRegNo}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Expires: {entity.regExpiryDate}</span>
                    </div>
                  )}
                  {entity.charityCommissionNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Charity Commissioner Trust No</span>
                      <span className="font-mono text-slate-200">{entity.charityCommissionNo}</span>
                    </div>
                  )}
                  {entity.tax80GCertNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">80G Tax Exemption Certificate</span>
                      <span className="font-mono text-emerald-400 font-semibold">{entity.tax80GCertNo}</span>
                    </div>
                  )}
                  {entity.nhbRegistrationNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">National Horticulture Board (NHB)</span>
                      <span className="font-mono text-slate-200">{entity.nhbRegistrationNo}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">{entity.nhbRating}</span>
                    </div>
                  )}
                  {entity.fssaiLicenseNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">FSSAI Food Safety License</span>
                      <span className="font-mono text-slate-200">{entity.fssaiLicenseNo}</span>
                    </div>
                  )}
                  {entity.organicCertNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">NPOP Organic Certification</span>
                      <span className="font-mono text-slate-200">{entity.organicCertNo}</span>
                    </div>
                  )}
                  {entity.labReportId && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">NABL Lab Test Accreditation</span>
                      <span className="font-mono text-emerald-400 font-semibold">{entity.labReportId}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{entity.labName}</span>
                    </div>
                  )}
                  {entity.panNumber && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">PAN Card</span>
                      <span className="font-mono text-slate-300">{entity.panNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Test Results for Dairy */}
              {entity.a2BetaCaseinPurity !== undefined && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    NABL Biochemical Milk Profile
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">A2 Beta-Casein Purity</span>
                      <span className="text-sm font-bold text-emerald-400">{entity.a2BetaCaseinPurity}%</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Milk Fat Percentage</span>
                      <span className="text-sm font-bold text-slate-200">{entity.fatPercentage}%</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Solids-Not-Fat (SNF)</span>
                      <span className="text-sm font-bold text-slate-200">{entity.snfPercentage}%</span>
                    </div>
                  </div>
                  <div className="mt-2.5 p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Antibiotic Residue Screen:</span>
                    <span className={entity.antibioticResidueFree ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {entity.antibioticResidueFree ? 'ZERO RESIDUES DETECTED' : 'CONTAMINATION DETECTED'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'capacity' && (
            <div className="space-y-4">
              {entity.indigenousBreeds && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Indigenous Cattle Census Breakdown ({entity.totalCattleHead} total)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(entity.indigenousBreeds).map(([breed, count]) => (
                      <div key={breed} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="capitalize font-medium text-slate-300">{breed} Cow</span>
                        <span className="font-bold text-emerald-400 font-mono">{count} Heads</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entity.monthlyManureCapacityMT && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[11px] block">Monthly Organic Manure Output</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{entity.monthlyManureCapacityMT} MT / Month</span>
                  </div>
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[11px] block">Biogas Generation Capacity</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">{entity.biogasCapacityKwhPerDay} kWh / Day</span>
                  </div>
                </div>
              )}

              {entity.vehicleNumber && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Logistics &amp; Transport</h3>
                  <div className="grid grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Assigned Vehicle</span>
                      <span className="font-mono text-slate-200 font-semibold">{entity.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Driver Contact</span>
                      <span className="text-slate-200">{entity.driverName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Financial Settlements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {entity.totalAmountINR !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Order Value</span>
                      <span className="text-base font-bold text-emerald-400">{fmtINR(entity.totalAmountINR)}</span>
                    </div>
                  )}
                  {entity.consultationFee !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Consultation Fee</span>
                      <span className="text-base font-bold text-slate-200">{fmtINR(entity.consultationFee)}</span>
                    </div>
                  )}
                  {entity.totalAmount !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Total Booking Amount</span>
                      <span className="text-base font-bold text-emerald-400">{fmtINR(entity.totalAmount)}</span>
                    </div>
                  )}
                  {entity.paymentStatus && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Escrow Status</span>
                      <StatusBadge status={entity.paymentStatus} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              {entity.bankAccount && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verified Bank Sub-ledger</h3>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                      Penny-Drop: {entity.bankAccount.pennyDropStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Bank Name</span>
                      <span>{entity.bankAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Number</span>
                      <span>{entity.bankAccount.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">IFSC Code</span>
                      <span>{entity.bankAccount.ifsc}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Holder</span>
                      <span className="font-sans">{entity.bankAccount.accountHolder}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[460px]">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Agrovercity SOP-19 Superadmin Console</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            {type === 'vet' && entity.status === 'pending_verification' && (
              <button
                onClick={() => onAction('verify', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
              >
                Verify Credentials
              </button>
            )}
            {type === 'gaushala' && (
              <button
                onClick={() => onAction('audit', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
              >
                Audit &amp; Certify
              </button>
            )}
            {type === 'nursery' && entity.status === 'pending_inspection' && (
              <button
                onClick={() => onAction('approve', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
              >
                Approve Nursery
              </button>
            )}
            {type === 'dairy' && entity.status === 'active' && (
              <button
                onClick={() => onAction('recall', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm"
              >
                Enforce Recall
              </button>
            )}
            {type === 'booking' && (
              <button
                onClick={() => onAction('mediate', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
              >
                Mediate Booking
              </button>
            )}
            {type === 'manure' && entity.dualSignOffRequired && !entity.dualSignOffCompleted && (
              <button
                onClick={() => onAction('signoff', entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-colors shadow-sm"
              >
                Dual Sign Off
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
