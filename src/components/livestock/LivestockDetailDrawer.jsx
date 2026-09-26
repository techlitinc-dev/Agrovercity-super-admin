import React, { useState, useEffect } from 'react'
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
  ExternalLink,
  History
} from 'lucide-react'
import { StatusBadge, fmtINR } from '../../pages/livestockWidgets'
import { getLivestockAuditLogs } from '../../api/livestockApi'

export default function LivestockDetailDrawer({
  entity,
  type = 'vet', // 'vet', 'gaushala', 'nursery', 'dairy', 'booking', 'manure'
  isOpen,
  onClose,
  onAction,
  canEdit = true
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [entityAuditLogs, setEntityAuditLogs] = useState([])

  useEffect(() => {
    if (entity?.id) {
      getLivestockAuditLogs().then((logs) => {
        const filtered = logs.filter(
          (l) => l.entityId === entity.id || (entity.orderNumber && l.entityName?.includes(entity.orderNumber))
        )
        setEntityAuditLogs(filtered)
      })
    }
  }, [entity])

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-100/90 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-emerald-100/80 flex items-start justify-between bg-emerald-50/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mt-1 shadow-xs">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-500">{entity.id || entity.orderNumber || entity.bookingNumber}</span>
                <StatusBadge status={entity.status || entity.bookingStatus || entity.deliveryStatus} />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {entity.name || entity.bookingNumber || entity.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {entity.clinicName || entity.brandOrGaushala || entity.gaushalaName || entity.ownerName || entity.farmerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-emerald-100/80 px-4 bg-slate-50/50 space-x-3 text-xs font-semibold overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'compliance'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliance &amp; Certs
          </button>
          <button
            onClick={() => setActiveTab('capacity')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'capacity'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Capacity &amp; Fleet
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'financials'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Financials &amp; Escrow
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log ({entityAuditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-2.5 border-b-2 whitespace-nowrap transition-all -mb-px ${
              activeTab === 'raw'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Primary Attributes</h3>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Contact</span>
                    <span className="font-semibold text-slate-900">
                      {entity.mobile || entity.contactPhone || entity.phone || entity.farmerPhone || entity.buyerPhone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location</span>
                    <span className="font-semibold text-slate-900">
                      {entity.district ? `${entity.taluka || ''}, ${entity.district}, ${entity.state || ''}` : entity.deliveryDestination || entity.village || 'N/A'}
                    </span>
                  </div>
                  {entity.email && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Email Address</span>
                      <span className="font-mono text-slate-800">{entity.email}</span>
                    </div>
                  )}
                  {entity.maskedAadhaar && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">DPDP Masked Aadhaar</span>
                      <span className="font-mono text-emerald-700 font-bold">{entity.maskedAadhaar}</span>
                    </div>
                  )}
                  {entity.experienceYears && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Practice Experience</span>
                      <span className="font-semibold text-slate-900">{entity.experienceYears} Years</span>
                    </div>
                  )}
                  {entity.averageRating && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Client Rating</span>
                      <span className="font-bold text-amber-600">★ {entity.averageRating} / 5.0</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specializations / Description */}
              {(entity.specialization || entity.symptomsDescription || entity.panchagavyaProducts) && (
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    {entity.symptomsDescription ? 'Clinical Symptoms Description' : 'Specialization & Offerings'}
                  </h3>
                  {entity.symptomsDescription ? (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed font-sans shadow-xs">
                      {entity.symptomsDescription}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(entity.specialization || entity.panchagavyaProducts || []).map((item, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full text-[11px] bg-white text-slate-700 border border-slate-200 shadow-xs font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Special Regulatory Notes / Recalls */}
              {(entity.doctorNotes || entity.adminMediationReason || entity.flaggedReason || entity.recallReason) && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Special Regulatory / Clinical Notes</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {entity.doctorNotes || entity.adminMediationReason || entity.flaggedReason || entity.recallReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Registration &amp; Statutory Licenses
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  {entity.councilRegNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">State Veterinary Council Reg</span>
                      <span className="font-mono font-bold text-slate-900">{entity.councilRegNo}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Expires: {entity.regExpiryDate}</span>
                    </div>
                  )}
                  {entity.charityCommissionNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Charity Commissioner Trust No</span>
                      <span className="font-mono font-bold text-slate-900">{entity.charityCommissionNo}</span>
                    </div>
                  )}
                  {entity.tax80GCertNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">80G Tax Exemption Certificate</span>
                      <span className="font-mono text-emerald-700 font-bold">{entity.tax80GCertNo}</span>
                    </div>
                  )}
                  {entity.nhbRegistrationNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">National Horticulture Board (NHB)</span>
                      <span className="font-mono font-bold text-slate-900">{entity.nhbRegistrationNo}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">{entity.nhbRating}</span>
                    </div>
                  )}
                  {entity.fssaiLicenseNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">FSSAI Food Safety License</span>
                      <span className="font-mono font-bold text-slate-900">{entity.fssaiLicenseNo}</span>
                    </div>
                  )}
                  {entity.organicCertNo && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">NPOP Organic Certification</span>
                      <span className="font-mono font-bold text-slate-900">{entity.organicCertNo}</span>
                    </div>
                  )}
                  {entity.labReportId && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">NABL Lab Test Accreditation</span>
                      <span className="font-mono text-emerald-700 font-bold">{entity.labReportId}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{entity.labName}</span>
                    </div>
                  )}
                  {entity.panNumber && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">PAN Card</span>
                      <span className="font-mono text-slate-800 font-semibold">{entity.panNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Test Results for Dairy */}
              {entity.a2BetaCaseinPurity !== undefined && (
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    NABL Biochemical Milk Profile
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-slate-500 text-[10px] block">A2 Beta-Casein Purity</span>
                      <span className="text-sm font-bold text-emerald-700 font-mono">{entity.a2BetaCaseinPurity}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-slate-500 text-[10px] block">Milk Fat Percentage</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{entity.fatPercentage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <span className="text-slate-500 text-[10px] block">Solids-Not-Fat (SNF)</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{entity.snfPercentage}%</span>
                    </div>
                  </div>
                  <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between shadow-xs">
                    <span>Antibiotic Residue Screen:</span>
                    <span className={entity.antibioticResidueFree ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
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
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                    Indigenous Cattle Census Breakdown ({entity.totalCattleHead} total)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(entity.indigenousBreeds).map(([breed, count]) => (
                      <div key={breed} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                        <span className="capitalize font-semibold text-slate-800">{breed} Cow</span>
                        <span className="font-bold text-emerald-700 font-mono">{count} Heads</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entity.monthlyManureCapacityMT && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 text-[11px] block">Monthly Organic Manure Output</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">{entity.monthlyManureCapacityMT} MT / Month</span>
                  </div>
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 text-[11px] block">Biogas Generation Capacity</span>
                    <span className="text-base font-bold text-cyan-700 font-mono">{entity.biogasCapacityKwhPerDay} kWh / Day</span>
                  </div>
                </div>
              )}

              {entity.vehicleNumber && (
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">Logistics &amp; Transport</h3>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Assigned Vehicle</span>
                      <span className="font-mono text-slate-900 font-bold">{entity.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Driver Contact</span>
                      <span className="text-slate-900 font-medium">{entity.driverName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Financial Settlements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {entity.totalAmountINR !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Order Value</span>
                      <span className="text-base font-bold text-emerald-700 font-mono">{fmtINR(entity.totalAmountINR)}</span>
                    </div>
                  )}
                  {entity.consultationFee !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Consultation Fee</span>
                      <span className="text-base font-bold text-slate-900 font-mono">{fmtINR(entity.consultationFee)}</span>
                    </div>
                  )}
                  {entity.totalAmount !== undefined && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Total Booking Amount</span>
                      <span className="text-base font-bold text-emerald-700 font-mono">{fmtINR(entity.totalAmount)}</span>
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
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">Verified Bank Sub-ledger</h3>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                      Penny-Drop: {entity.bankAccount.pennyDropStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-slate-800">
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Bank Name</span>
                      <span className="font-semibold">{entity.bankAccount.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Number</span>
                      <span className="font-semibold">{entity.bankAccount.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">IFSC Code</span>
                      <span className="font-semibold">{entity.bankAccount.ifsc}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans text-[11px]">Account Holder</span>
                      <span className="font-sans font-medium">{entity.bankAccount.accountHolder}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Entity Audit Trail Log
              </h3>
              {entityAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p>No historical state modifications recorded for this entity yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entityAuditLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{log.actionType}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                        <span>{log.previousState}</span>
                        <span>&rarr;</span>
                        <span className="text-emerald-700 font-bold">{log.newState}</span>
                      </div>
                      <div className="text-xs text-slate-700 mt-1">{log.reason}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Admin: {log.adminUid} ({log.ipAddress})</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="relative">
              <button
                onClick={handleCopyJson}
                className="absolute top-2 right-2 p-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-xs flex items-center gap-1 text-[11px] font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[460px]">
                {JSON.stringify(entity, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-emerald-100/80 bg-slate-50/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Agrovercity SOP-19 Superadmin Console</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition"
            >
              Close
            </button>
            {canEdit && type === 'vet' && entity.status === 'pending_verification' && (
              <button
                onClick={() => onAction('verify', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
              >
                Verify Credentials
              </button>
            )}
            {canEdit && type === 'gaushala' && (
              <button
                onClick={() => onAction('audit', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
              >
                Audit &amp; Certify
              </button>
            )}
            {canEdit && type === 'nursery' && entity.status === 'pending_inspection' && (
              <button
                onClick={() => onAction('approve', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
              >
                Approve Nursery
              </button>
            )}
            {canEdit && type === 'dairy' && entity.status === 'active' && (
              <button
                onClick={() => onAction('recall', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs active:scale-95"
              >
                Enforce Recall
              </button>
            )}
            {canEdit && type === 'booking' && (
              <button
                onClick={() => onAction('mediate', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs active:scale-95"
              >
                Mediate Booking
              </button>
            )}
            {canEdit && type === 'manure' && entity.dualSignOffRequired && !entity.dualSignOffCompleted && (
              <button
                onClick={() => onAction('signoff', entity)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition shadow-xs active:scale-95"
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
