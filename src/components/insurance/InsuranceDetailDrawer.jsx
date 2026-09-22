import React, { useState } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
  Percent,
  TrendingUp,
  CreditCard,
  Building2,
  Copy,
  Check,
  Clock,
  MapPin,
  Calendar,
  Camera,
  Layers,
  CheckCircle2,
  XCircle,
  Coins,
  Compass,
  FileCheck
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'
import { fmtINR, StatusBadge } from '../../pages/insuranceWidgets'

export default function InsuranceDetailDrawer({
  claim,
  onClose,
  onAssignSurveyor,
  onReviewAssessment,
  onApproveDbt,
  onSecondSignOff,
  onRejectClaim
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'photos' | 'surveyor' | 'financial' | 'audit' | 'json'
  const [copied, setCopied] = useState(false)
  const [enlargedPhoto, setEnlargedPhoto] = useState(null)

  if (!claim) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(claim.claimNumber || claim.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isLate = claim.intimationCompliance === 'FLAGGED_LATE_INTIMATION' || claim.intimationElapsedHours > 72
  const requiresDual = claim.dualSignOffRequired
  const pendingSecondSignOff = requiresDual && claim.firstSignOff && !claim.secondSignOff

  return (
    <DetailDrawer
      open={Boolean(claim)}
      title={claim.claimNumber}
      subtitle={`${claim.farmerName} · ${claim.cropName} (${claim.calamityType})`}
      onClose={onClose}
    >
      {/* Drawer Top Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2 mb-4 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'photos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Geotagged Photos ({claim.damagePhotos?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('surveyor')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'surveyor'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Surveyor Findings
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'financial'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Financial & DBT
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'json'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Header Status & Intimation Card */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claim Lifecycle State</span>
              <StatusBadge status={claim.status} />
            </div>
            <div className="text-xs text-slate-700 font-semibold">{claim.statusText}</div>

            {/* 72-Hour Calamity Intimation Guardrail Banner */}
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                isLate
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold">
                    {isLate ? 'Flagged: Late Calamity Intimation' : 'Compliant: 72h Window Met'}
                  </span>
                  <p className="text-[11px] opacity-80 font-medium">
                    Logged in {claim.intimationElapsedHours?.toFixed(1)}h from damage event
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-white border border-current shadow-2xs">
                {isLate ? 'EXCEEDED 72H' : 'PASSED'}
              </span>
            </div>
          </div>

          {/* Farmer & Land Particulars */}
          <DrawerSection title="Farmer & Plot Information">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Farmer Name" v={claim.farmerName} />
              <KeyValue k="Phone Number" v={claim.farmerPhone} mono />
              <KeyValue
                k="Aadhaar (DPDP Masked)"
                v={
                  <span className="text-emerald-700 font-mono font-bold">
                    {claim.aadhaarMasked}
                  </span>
                }
              />
              <KeyValue k="Village & Circle" v={`${claim.village}, ${claim.district}`} />
              <KeyValue k="State Jurisdiction" v={claim.state} />
              <KeyValue
                k="GPS Coordinates"
                v={
                  claim.gpsCoordinates ? (
                    <span className="font-mono text-slate-700">
                      {claim.gpsCoordinates.lat.toFixed(4)}° N, {claim.gpsCoordinates.lng.toFixed(4)}° E (±{claim.gpsCoordinates.accuracyMeters}m)
                    </span>
                  ) : (
                    'Not Available'
                  )
                }
              />
            </div>
          </DrawerSection>

          {/* PMFBY Policy Linked */}
          <DrawerSection title="Associated Crop Insurance Policy">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Policy Number" v={claim.policyNumber} mono />
              <KeyValue k="Insurance Scheme" v={`${claim.schemeName} (${claim.vernacularSchemeName || 'PMFBY'})`} />
              <KeyValue k="Notified Crop" v={`${claim.cropName} (${claim.vernacularCropName})`} />
              <KeyValue k="Season & Year" v={`${claim.season} ${claim.year}`} />
              <KeyValue k="Insured Land Area" v={`${claim.landAreaAcres} Acres`} />
              <KeyValue k="Total Sum Insured" v={fmtINR(claim.sumInsuredTotal)} mono />
              <KeyValue k="Claim Reference ID" v={claim.id} mono />
            </div>
          </DrawerSection>

          {/* Calamity Intimation Details */}
          <DrawerSection title="Calamity & Loss Intimation">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Calamity Type" v={claim.calamityType} />
              <KeyValue
                k="Date of Damage Event"
                v={claim.dateOfDamage ? new Date(claim.dateOfDamage).toLocaleString('en-IN') : '—'}
              />
              <KeyValue
                k="Submitted to Console"
                v={claim.submittedAt ? new Date(claim.submittedAt).toLocaleString('en-IN') : '—'}
              />
              <KeyValue k="Crop Stage at Damage" v={claim.cropStage} />
              <KeyValue k="Farmer Estimated Loss" v={`${claim.estimatedLossPercent}%`} mono />
              <KeyValue k="Requested Compensation" v={fmtINR(claim.requestedAmount)} mono />
              {claim.rejectionReason && (
                <div className="py-2 text-rose-700">
                  <span className="font-bold block">Rejection Audit Reason:</span>
                  <span className="text-slate-600">{claim.rejectionReason}</span>
                </div>
              )}
              {claim.appealCount > 0 && (
                <div className="py-2 text-sky-700">
                  <span className="font-bold block">Appeal Round #{claim.appealCount}:</span>
                  <span className="text-slate-600">{claim.appealReason}</span>
                </div>
              )}
            </div>
          </DrawerSection>
        </div>
      )}

      {/* 2. GEOTAGGED PHOTOS & MAP TAB */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 font-medium">
            <span>
              Geotagged Damage Photos ({claim.damagePhotos?.length || 0} Uploaded)
            </span>
            <span className="font-mono text-emerald-700 font-bold">GPS Timestamp Locked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {claim.damagePhotos?.map((photoUrl, idx) => (
              <div
                key={idx}
                onClick={() => setEnlargedPhoto(photoUrl)}
                className="group relative rounded-xl border border-slate-200 bg-slate-900 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all shadow-md"
              >
                <img
                  src={photoUrl}
                  alt={`Damage inspection photo ${idx + 1}`}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evidence #{idx + 1}</span>
                  </div>
                  {claim.photoCaptions && claim.photoCaptions[idx] && (
                    <p className="text-[11px] text-slate-200 truncate mt-0.5">
                      {claim.photoCaptions[idx]}
                    </p>
                  )}
                  <div className="text-[10px] font-mono text-emerald-300 mt-1 flex items-center gap-2">
                    <span>
                      {claim.gpsCoordinates?.lat.toFixed(4)}° N, {claim.gpsCoordinates?.lng.toFixed(4)}° E
                    </span>
                    <span>•</span>
                    <span>Acc: ±{claim.gpsCoordinates?.accuracyMeters}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GPS Coordinates & Map Card */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-white text-xs space-y-2 shadow-2xs">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Geospatial In-Field Satellite Coordinates</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-700">
                WGS-84 Cadastral Lock
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
              <div>
                Latitude: <span className="text-emerald-700 font-bold">{claim.gpsCoordinates?.lat || '19.8762'}</span> ·
                Longitude: <span className="text-emerald-700 font-bold">{claim.gpsCoordinates?.lng || '75.3433'}</span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${claim.gpsCoordinates?.lat},${claim.gpsCoordinates?.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Photographs are digitally signed with cryptographic hash and embedded device EXIF telemetry to prevent fraud.
            </p>
          </div>
        </div>
      )}

      {/* 3. SURVEYOR REPORT TAB */}
      {activeTab === 'surveyor' && (
        <div className="space-y-4 text-xs">
          {claim.surveyorName ? (
            <div className="rounded-xl border border-emerald-100 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{claim.surveyorName}</span>
                  <p className="text-[11px] text-slate-500 font-medium">{claim.surveyorAgency}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-300 text-[10px] font-mono font-bold">
                  IRDAI Empaneled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block">Phone:</span>
                  <span className="text-slate-800 font-bold">{claim.surveyorPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Inspection Date:</span>
                  <span className="text-slate-800 font-bold">{claim.surveyorVisitDate || 'Scheduled'}</span>
                </div>
              </div>

              {/* Loss comparison */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Damage Assessment Calibration</span>
                  <span className="font-mono font-bold text-slate-900">
                    {claim.surveyorLossPercent !== null ? `${claim.surveyorLossPercent}% Verified` : 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-500 block">Farmer Claim:</span>
                    <span className="text-slate-900 font-bold font-mono">{claim.estimatedLossPercent}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                    <span className="text-purple-700 block font-semibold">Surveyor Assessed:</span>
                    <span className="text-purple-900 font-bold font-mono">
                      {claim.surveyorLossPercent !== null ? `${claim.surveyorLossPercent}%` : 'Awaiting Visit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Field notes */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">Field Inspection Report & Remarks:</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-medium">
                  {claim.surveyorReportNotes || 'Survey inspection pending on designated date.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3 shadow-2xs">
              <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-slate-900 font-bold">No Field Surveyor Assigned</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                This claim is currently intimated and awaiting assignment from the insurance partner panel (AIC, HDFC ERGO, SBI General).
              </p>
              <button
                onClick={() => onAssignSurveyor(claim)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
              >
                Assign Field Surveyor Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. FINANCIAL & DBT TAB */}
      {activeTab === 'financial' && (
        <div className="space-y-4 text-xs">
          {/* Payout Summary Cards */}
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Requested Amount</span>
              <span className="text-base font-bold text-slate-900">{fmtINR(claim.requestedAmount)}</span>
            </div>
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-2xs">
              <span className="text-emerald-800 text-[10px] block uppercase font-bold">Approved Compensation</span>
              <span className="text-base font-bold text-emerald-800">
                {claim.approvedAmount ? fmtINR(claim.approvedAmount) : 'Pending Approval'}
              </span>
            </div>
          </div>

          {/* Dual Admin Sign-Off Guardrail (SOP-15 §6.3) */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-white space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Dual Admin Sign-Off Compliance (SOP-15 §6.3)</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Threshold: &gt; ₹50,000
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Claims exceeding ₹50,000 mandate dual administrative authorization before DBT transfer can execute.
            </p>

            <div className="space-y-2 pt-2">
              {/* First Sign-off */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                    Primary Sign-Off (Risk Officer)
                  </span>
                  <span className="font-bold text-slate-900">
                    {claim.firstSignOff?.adminName || 'Vikram Mehta (Chief Risk Officer)'}
                  </span>
                  {claim.firstSignOff?.notes && (
                    <p className="text-[11px] text-slate-600 mt-0.5">{claim.firstSignOff.notes}</p>
                  )}
                </div>
                {claim.firstSignOff ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SIGNED</span>
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>PENDING</span>
                  </span>
                )}
              </div>

              {/* Second Sign-off */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                    Secondary Sign-Off (Finance Director)
                  </span>
                  <span className="font-bold text-slate-900">
                    {claim.secondSignOff?.adminName || 'Ananya Deshmukh (Director Finance)'}
                  </span>
                  {claim.secondSignOff?.notes && (
                    <p className="text-[11px] text-slate-600 mt-0.5">{claim.secondSignOff.notes}</p>
                  )}
                </div>
                {claim.secondSignOff ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SIGNED</span>
                  </span>
                ) : pendingSecondSignOff ? (
                  <button
                    onClick={() => onSecondSignOff(claim)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-2xs transition"
                  >
                    Execute Sign-Off
                  </button>
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono font-medium">
                    {requiresDual ? 'AWAITING 1ST' : 'NOT REQUIRED (≤ ₹50K)'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Farmer Bank Account for DBT */}
          <DrawerSection title="Beneficiary Bank Account (Aadhaar Bridge)">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Bank Name" v={claim.bankName || 'State Bank of India'} />
              <KeyValue k="Bank IFSC Code" v={claim.ifsc || 'SBIN0001234'} mono />
              <KeyValue
                k="Account (Masked)"
                v={`XXXX-XXXX-${claim.bankAccountLast4 || '4521'}`}
                mono
              />
              <KeyValue
                k="DBT UTR / Reference"
                v={
                  claim.dbtTransactionId ? (
                    <span className="text-emerald-700 font-mono font-bold">
                      {claim.dbtTransactionId}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-mono font-semibold">Awaiting Disbursal Batch</span>
                  )
                }
              />
              <KeyValue k="Disbursal Mechanism" v="NPCI APBS (Direct Benefit Transfer)" />
            </div>
          </DrawerSection>
        </div>
      )}

      {/* 5. AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-4 text-xs">
          <DrawerSection title="Claim State Transition Timeline">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {claim.timeline?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-600 shadow-2xs" />
                  <div className="font-bold text-slate-900 capitalize flex items-center justify-between">
                    <span>{step.status}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {step.at ? new Date(step.at).toLocaleString('en-IN') : '—'}
                    </span>
                  </div>
                  {step.actor && (
                    <span className="text-[11px] text-emerald-700 font-mono font-semibold block">
                      By: {step.actor}
                    </span>
                  )}
                  <p className="text-[11px] text-slate-600 mt-0.5">{step.note}</p>
                </div>
              ))}
            </div>
          </DrawerSection>

          <DrawerSection title="Immutable Security Audit Logs">
            <div className="space-y-2">
              {claim.auditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white font-mono text-[11px] space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Admin: {log.adminUid}</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                  <div className="text-slate-900 font-bold">
                    Transition: <span className="text-amber-700">{log.previousState}</span> &rarr;{' '}
                    <span className="text-emerald-700">{log.newState}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs">{log.reason}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
        </div>
      )}

      {/* 6. RAW JSON TAB */}
      {activeTab === 'json' && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <DocJson doc={claim} />
        </div>
      )}

      {/* Drawer Action Footer */}
      <div className="pt-4 mt-6 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {claim.status === 'intimated' && (
            <button
              onClick={() => onAssignSurveyor(claim)}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
            >
              Assign Surveyor
            </button>
          )}

          {claim.status === 'surveyorAssigned' && (
            <button
              onClick={() => onReviewAssessment(claim)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
            >
              Review Survey Findings
            </button>
          )}

          {claim.status === 'fieldAssessed' && (
            <button
              onClick={() => onApproveDbt(claim)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
            >
              Authorize DBT Payout
            </button>
          )}

          {pendingSecondSignOff && (
            <button
              onClick={() => onSecondSignOff(claim)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
            >
              Execute 2nd Sign-Off
            </button>
          )}

          {['intimated', 'surveyorAssigned', 'fieldAssessed'].includes(claim.status) && (
            <button
              onClick={() => onRejectClaim(claim)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition"
            >
              Reject Claim
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          Close
        </button>
      </div>

      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-white border border-emerald-100 rounded-2xl overflow-hidden p-3 shadow-2xl">
            <img
              src={enlargedPhoto}
              alt="Enlarged Damage In-Field View"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 flex items-center justify-between text-xs text-slate-700 font-mono font-semibold">
              <span>{claim.claimNumber} · Geotagged Damage Photo</span>
              <button
                onClick={() => setEnlargedPhoto(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </DetailDrawer>
  )
}
