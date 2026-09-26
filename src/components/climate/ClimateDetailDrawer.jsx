import React, { useState, useEffect } from 'react'
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
  Phone,
  History,
  ShieldAlert
} from 'lucide-react'
import { StatusBadge, ResilienceBadge, fmtINR, formatDate } from '../../pages/climateWidgets'
import { getEntityAuditLogs } from '../../api/climateApi'

export default function ClimateDetailDrawer({
  entity,
  type = 'facilities', // 'facilities', 'bookings', 'varieties', 'carbon', 'gradings'
  isOpen,
  onClose,
  onEditStatus,
  onAllocateChamber,
  onCancelBooking,
  onDisbursePayout,
  onOverrideGrading,
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
                  {entity.name || entity.farmerName || entity.cropName || entity.commodity || entity.id}
                </h2>
                <StatusBadge status={entity.status} />
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                ID: {entity.id} · Updated: {formatDate(entity.updatedAt || entity.createdAt)}
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
            onClick={() => setActiveTab('technical')}
            className={`py-2.5 font-bold border-b-2 transition-colors ${
              activeTab === 'technical'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical & Sensors
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
              {/* Facility View */}
              {type === 'facilities' && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Total Capacity</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.totalCapacityMt} MT</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Available Free</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{entity.availableCapacityMt} MT</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Rate / MT / Mo</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.monthlyRatePerMt)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Chambers</span>
                      <div className="text-base font-bold text-teal-600 mt-0.5">{entity.chambersCount} Bays</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-slate-900">Location & Contact Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Operator:</span>
                        <div className="text-slate-900 font-semibold">{entity.operatorName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Phone (DPDP Masked):</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.operatorPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">District / State:</span>
                        <div className="text-slate-800 font-medium">{entity.district}, {entity.state}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">FSSAI License:</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.fssaiLicense}</div>
                      </div>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 border-t border-emerald-100/80">
                      Address: {entity.address}
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Supported Commodities</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(entity.supportedCrops) &&
                        entity.supportedCrops.map((c, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold"
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
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Stored Volume</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.quantityMt} MT</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Total Fee</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.totalFee)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Security Deposit</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.depositAmount)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Payment Status</span>
                      <div className="text-base font-bold text-teal-700 mt-0.5 uppercase tracking-wide">
                        {entity.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Farmer & Facility Allocation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Farmer:</span>
                        <div className="text-slate-900 font-semibold">{entity.farmerName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Phone (Masked):</span>
                        <div className="text-slate-800 font-mono font-medium">{entity.farmerPhone}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Cold Chain Facility:</span>
                        <div className="text-slate-800 font-medium">{entity.facilityName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Allocated Bay:</span>
                        <div className="text-emerald-700 font-mono font-bold">{entity.chamberAllocated}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Reservation Duration</h4>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-700">
                      <span>Start: {entity.startDate}</span>
                      <span>→</span>
                      <span>End: {entity.endDate} ({entity.durationMonths} Months)</span>
                    </div>
                  </div>

                  {entity.disputeReason && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
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
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Resilience Profile</span>
                      <div className="mt-1">
                        <ResilienceBadge type={entity.resilienceType} />
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Avg Yield Potential</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{entity.averageYieldQtlPerHa} Qtl/Ha</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Maturity Window</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.maturityDays}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Agronomic Specifications</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Certifying Agency:</span>
                        <div className="text-slate-800 font-medium">{entity.certifyingAgency}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Water Requirement:</span>
                        <div className="text-teal-700 font-mono font-bold">{entity.waterRequirementMm} mm</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Pest Resistance:</span>
                        <div className="text-slate-800 font-medium">{entity.pestResistance || 'Standard tolerance'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Suitable Soil:</span>
                        <div className="text-slate-800 font-medium">{entity.suitableSoil}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Recommended Agro-Ecological Zones</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(entity.recommendedRegions) &&
                        entity.recommendedRegions.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] font-semibold"
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
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Certified Credits</span>
                      <div className="text-base font-bold text-emerald-700 mt-0.5">
                        {entity.estimatedCreditsMtCo2e} MT CO₂e
                      </div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Price / Ton</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.creditPriceInrPerTon)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Gross Payout</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{fmtINR(entity.grossPayoutInr)}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Net Farmer Payout</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{fmtINR(entity.netPayoutInr)}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Regenerative Farming Protocol Practiced</h4>
                    <div className="space-y-1.5">
                      {Array.isArray(entity.regenerativePractices) &&
                        entity.regenerativePractices.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-800 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900">Satellite & Registry Audit</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Registry Agency:</span>
                        <div className="text-slate-800 font-semibold">{entity.verifierAgency}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Verification Hash:</span>
                        <div className="text-emerald-700 font-mono text-[11px] truncate">
                          {entity.satelliteVerificationHash}
                        </div>
                      </div>
                    </div>
                  </div>

                  {entity.netPayoutInr > 50000 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <Lock className="w-4 h-4" />
                        <span>Dual Sign-off Compliance (&gt; ₹50k)</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
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
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">AI Confidence</span>
                      <div className="text-base font-bold text-emerald-600 mt-0.5">{entity.confidenceScore}%</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Defect Ratio</span>
                      <div className="text-base font-bold text-amber-600 mt-0.5">{entity.surfaceDefectsPct}%</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Brix Reading</span>
                      <div className="text-base font-bold text-slate-900 mt-0.5">{entity.brixEstimate}</div>
                    </div>
                    <div className="bg-slate-50/80 border border-emerald-100/80 rounded-xl p-3 shadow-xs">
                      <span className="text-[11px] font-semibold text-slate-500">Model Used</span>
                      <div className="text-xs font-mono text-emerald-700 font-bold mt-1 truncate">{entity.calibrationCurveModel}</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-900">Inspected Optical Sample Images (Max 3 / Lot)</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {entity.images?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="AI produce grading lot"
                          className="h-28 w-full object-cover rounded-xl border border-emerald-200/80 shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  {entity.manualOverrideGrade && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                      <div className="font-bold text-amber-800">Manual Calibration Active: {entity.manualOverrideGrade}</div>
                      <p className="text-[11px] text-slate-700">Note: {entity.overrideNote}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/20 border border-emerald-100/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-teal-600" />
                  <span>Telemetry & Sensor Gateway Status</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">IoT Modbus Gateway:</span>
                    <span className="font-mono text-emerald-700 font-bold">Connected (Online :502)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">Chamber Humidity Calibration:</span>
                    <span className="font-mono text-slate-800 font-medium">± 1.2% RH Tolerance Passed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-emerald-100/80">
                    <span className="text-slate-500 font-medium">Ethylene Scrubbers:</span>
                    <span className="font-mono text-emerald-700 font-bold">Active (PPB &lt; 0.05)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Power Inverter Heartbeat:</span>
                    <span className="font-mono text-slate-800 font-medium">Grid + DG Automatic Transfer</span>
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
                  <strong>Auditor Mode:</strong> Read-only access enabled under statutory governance policies. Facility onboarding, chamber allocations, carbon disbursements, and quality overrides are locked.
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
                SOP-23 Compliant · DPDP Masking Active
              </div>
              <div className="flex items-center gap-2">
                {type === 'facilities' && onEditStatus && (
                  <button
                    onClick={() => onEditStatus(entity)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Change Status
                  </button>
                )}
                {type === 'bookings' && entity.status === 'confirmed' && onAllocateChamber && (
                  <button
                    onClick={() => onAllocateChamber(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs"
                  >
                    Allocate Chamber
                  </button>
                )}
                {type === 'bookings' && entity.status !== 'cancelled' && onCancelBooking && (
                  <button
                    onClick={() => onCancelBooking(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs"
                  >
                    Cancel & Refund
                  </button>
                )}
                {type === 'carbon' && entity.status === 'approved' && onDisbursePayout && (
                  <button
                    onClick={() => onDisbursePayout(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                  >
                    Disburse Payout
                  </button>
                )}
                {type === 'gradings' && onOverrideGrading && (
                  <button
                    onClick={() => onOverrideGrading(entity)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                  >
                    Manual Override
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

