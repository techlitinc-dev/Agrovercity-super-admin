import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  Warehouse,
  CalendarCheck,
  Sprout,
  Leaf,
  ScanEye,
  ShieldCheck,
  Thermometer,
  Droplets,
  AlertTriangle,
  Lock,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Phone
} from 'lucide-react'
import { StatusBadge, ResilienceBadge, fmtINR, formatDate } from '../../pages/climateWidgets'

export default function ClimateDetailDrawer({
  entity,
  type = 'facilities', // 'facilities', 'bookings', 'varieties', 'carbon', 'gradings'
  isOpen,
  onClose,
  onEditStatus,
  onAllocateChamber,
  onCancelBooking,
  onDisbursePayout,
  onOverrideGrading
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
      case 'facilities':
        return Warehouse
      case 'bookings':
        return CalendarCheck
      case 'varieties':
        return Sprout
      case 'carbon':
        return Leaf
      case 'gradings':
        return ScanEye
      default:
        return Warehouse
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
                  {entity.name || entity.farmerName || entity.cropName || entity.commodity || entity.id}
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
            onClick={() => setActiveTab('technical')}
            className={`py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'technical'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical & Sensors
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
              {/* Facility View */}
              {type === 'facilities' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Total Capacity</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.totalCapacityMt} MT</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Available Free</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{entity.availableCapacityMt} MT</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Rate / MT / Mo</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.monthlyRatePerMt)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Chambers</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5">{entity.chambersCount} Bays</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-semibold text-white">Location & Contact Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Operator:</span>
                        <div className="text-slate-200 font-medium">{entity.operatorName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone (DPDP Masked):</span>
                        <div className="text-slate-200 font-mono">{entity.operatorPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">District / State:</span>
                        <div className="text-slate-200">{entity.district}, {entity.state}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">FSSAI License:</span>
                        <div className="text-slate-200 font-mono">{entity.fssaiLicense}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                      Address: {entity.address}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Supported Commodities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(entity.supportedCrops) &&
                        entity.supportedCrops.map((c, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs"
                          >
                            {c}
                          </span>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* Booking View */}
              {type === 'bookings' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Stored Volume</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.quantityMt} MT</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Total Fee</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.totalFee)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Security Deposit</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.depositAmount)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Payment Status</span>
                      <div className="text-base font-bold text-blue-400 mt-0.5 uppercase tracking-wide">
                        {entity.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Farmer & Facility Allocation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Farmer:</span>
                        <div className="text-slate-200 font-medium">{entity.farmerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone (Masked):</span>
                        <div className="text-slate-200 font-mono">{entity.farmerPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Cold Chain Facility:</span>
                        <div className="text-slate-200">{entity.facilityName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Allocated Bay:</span>
                        <div className="text-emerald-400 font-mono font-medium">{entity.chamberAllocated}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Reservation Duration</h4>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Start: {entity.startDate}</span>
                      <span>→</span>
                      <span>End: {entity.endDate} ({entity.durationMonths} Months)</span>
                    </div>
                  </div>

                  {entity.disputeReason && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Dispute / Cancellation Note</span>
                      </div>
                      <p>{entity.disputeReason}</p>
                    </div>
                  )}
                </>
              )}

              {/* Variety View */}
              {type === 'varieties' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Resilience Profile</span>
                      <div className="mt-1">
                        <ResilienceBadge type={entity.resilienceType} />
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Avg Yield Potential</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{entity.averageYieldQtlPerHa} Qtl/Ha</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Maturity Window</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.maturityDays}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Agronomic Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Certifying Agency:</span>
                        <div className="text-slate-200">{entity.certifyingAgency}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Water Requirement:</span>
                        <div className="text-blue-400 font-mono font-medium">{entity.waterRequirementMm} mm</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Pest Resistance:</span>
                        <div className="text-slate-200">{entity.pestResistance || 'Standard tolerance'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Suitable Soil:</span>
                        <div className="text-slate-200">{entity.suitableSoil}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Recommended Agro-Ecological Zones</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(entity.recommendedRegions) &&
                        entity.recommendedRegions.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]"
                          >
                            {r}
                          </span>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* Carbon View */}
              {type === 'carbon' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Certified Credits</span>
                      <div className="text-base font-bold text-purple-400 mt-0.5">
                        {entity.estimatedCreditsMtCo2e} MT CO₂e
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Price / Ton</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.creditPriceInrPerTon)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Gross Payout</span>
                      <div className="text-base font-bold text-white mt-0.5">{fmtINR(entity.grossPayoutInr)}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Net Farmer Payout</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{fmtINR(entity.netPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Regenerative Farming Protocol Practiced</h4>
                    <div className="space-y-1.5">
                      {Array.isArray(entity.regenerativePractices) &&
                        entity.regenerativePractices.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <h4 className="font-semibold text-white">Satellite & Registry Audit</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500">Registry Agency:</span>
                        <div className="text-slate-200 font-medium">{entity.verifierAgency}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Verification Hash:</span>
                        <div className="text-purple-300 font-mono text-[11px] truncate">
                          {entity.satelliteVerificationHash}
                        </div>
                      </div>
                    </div>
                  </div>

                  {entity.netPayoutInr > 50000 && (
                    <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>Dual Sign-off Compliance (&gt; ₹50k)</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Authorizer 1: {entity.signOffBy1 || 'Pending'} · Authorizer 2: {entity.signOffBy2 || 'Required before credit release'}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Grading View */}
              {type === 'gradings' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">AI Confidence</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{entity.confidenceScore}%</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Defect Ratio</span>
                      <div className="text-base font-bold text-amber-400 mt-0.5">{entity.surfaceDefectsPct}%</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Brix Reading</span>
                      <div className="text-base font-bold text-white mt-0.5">{entity.brixEstimate}</div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                      <span className="text-[11px] text-slate-400">Model Used</span>
                      <div className="text-xs font-mono text-purple-400 mt-1 truncate">{entity.calibrationCurveModel}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-white">Inspected Optical Sample Images (Max 3 / Lot)</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {entity.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="AI produce grading lot"
                          className="h-28 w-full object-cover rounded-xl border border-slate-800"
                        />
                      ))}
                    </div>
                  </div>

                  {entity.manualOverrideGrade && (
                    <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-300 space-y-1">
                      <div className="font-bold">Manual Calibration Active: {entity.manualOverrideGrade}</div>
                      <p className="text-[11px] text-slate-300">Note: {entity.overrideNote}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  <span>Telemetry & Sensor Gateway Status</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">IoT Modbus Gateway:</span>
                    <span className="font-mono text-emerald-400">Connected (Online :502)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Chamber Humidity Calibration:</span>
                    <span className="font-mono text-slate-200">± 1.2% RH Tolerance Passed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Ethylene Scrubbers:</span>
                    <span className="font-mono text-emerald-400">Active (PPB &lt; 0.05)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Power Inverter Heartbeat:</span>
                    <span className="font-mono text-slate-200">Grid + DG Automatic Transfer</span>
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
            SOP-23 Compliant · DPDP Masking Active
          </div>
          <div className="flex items-center gap-2">
            {type === 'facilities' && onEditStatus && (
              <button
                onClick={() => onEditStatus(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Change Status
              </button>
            )}
            {type === 'bookings' && entity.status === 'confirmed' && onAllocateChamber && (
              <button
                onClick={() => onAllocateChamber(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Allocate Chamber
              </button>
            )}
            {type === 'bookings' && entity.status !== 'cancelled' && onCancelBooking && (
              <button
                onClick={() => onCancelBooking(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Cancel & Refund
              </button>
            )}
            {type === 'carbon' && entity.status === 'approved' && onDisbursePayout && (
              <button
                onClick={() => onDisbursePayout(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Disburse Payout
              </button>
            )}
            {type === 'gradings' && onOverrideGrading && (
              <button
                onClick={() => onOverrideGrading(entity)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Manual Override
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
