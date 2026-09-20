import React, { useState } from 'react';
import {
  X,
  Truck,
  FileText,
  Wallet,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Copy,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function TransportDetailDrawer({
  isOpen,
  onClose,
  entity,
  entityType, // 'vehicle' | 'booking' | 'settlement'
  onVerifyPapers,
  onArbitrate,
  onOverrideStatus,
  onAuditPayout
}) {
  const { addToast } = useNotification();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  if (!isOpen || !entity) return null;

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast({ title: 'Copied', message: `${label} copied to clipboard`, type: 'info' });
  };

  const headerMeta = {
    vehicle: { icon: Truck, accent: 'text-emerald-400', title: entity.id, subtitle: `${entity.registrationNumber} • ${entity.transporterName}` },
    booking: { icon: FileText, accent: 'text-sky-400', title: entity.id, subtitle: `${entity.customerName} → ${entity.dropPoint?.mandi}` },
    settlement: { icon: Wallet, accent: 'text-teal-400', title: entity.id, subtitle: `${entity.transporterName} • ₹${(entity.payoutAmount || 0).toLocaleString('en-IN')}` }
  }[entityType];

  const HeaderIcon = headerMeta.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold ${headerMeta.accent}`}>
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono">{headerMeta.title}</h2>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
                  {entityType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{headerMeta.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'documents'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Documents / POD
          </button>
          <button
            onClick={() => setActiveSubTab('json')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'json'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {activeSubTab === 'overview' && (
            <>
              {/* Vehicle Overview */}
              {entityType === 'vehicle' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Capacity</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {entity.capacityTons} T
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Per-Km Rate</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        ₹{entity.perKmRate}/km
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Base Fare</span>
                      <span className="text-base font-extrabold text-sky-400 font-mono">
                        ₹{entity.baseFare}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Transporter Identity & Home Base
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Transporter</span>
                        <span className="text-white font-semibold">{entity.transporterName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.transporterMobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Base Location</span>
                        <span className="text-slate-200 font-medium">{entity.homeBase}, {entity.district}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">ID: {entity.transporterId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Trips Completed</span>
                      <span className="text-white font-bold font-mono">{entity.tripsCompleted}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Rating</span>
                      <span className="text-amber-400 font-bold font-mono">★ {entity.rating || 'New'}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Booking Overview */}
              {entityType === 'booking' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Distance</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {entity.distanceKm} km
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Trip Fare</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        ₹{entity.fareAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Payment</span>
                      <span className="text-base font-extrabold text-sky-400 font-mono uppercase">
                        {entity.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Fare Breakdown */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Dynamic Fare Breakdown (Base + Per-Km)
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Base Fare</span>
                        <span className="text-white font-bold">₹{entity.fareBreakdown?.baseFare ?? 0}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Per-Km Charge</span>
                        <span className="text-white font-bold">₹{entity.fareBreakdown?.perKmCharge ?? 0}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Surcharge</span>
                        <span className="text-amber-400 font-bold">₹{entity.fareBreakdown?.surcharge ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Route & Assignment</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pickup: {entity.pickupPoint?.village}, {entity.pickupPoint?.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Drop: {entity.dropPoint?.mandi}, {entity.dropPoint?.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {entity.vehicleId
                            ? `${entity.vehicleId} • ${entity.transporterName} (${entity.vehicleClass})`
                            : 'No transporter accepted yet'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dispute Banner */}
                  {(entity.status === 'disputed' || entity.status === 'no_show') && (
                    <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-rose-300 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>
                          {entity.status === 'no_show'
                            ? 'No-Show / Breakdown Incident Under Review'
                            : 'Active Booking Dispute Under Superadmin Arbitration'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {entity.disputeReason || 'No description recorded.'}
                      </p>
                      <div className="flex items-center justify-end pt-2 border-t border-rose-800/40">
                        <button
                          onClick={() => onArbitrate(entity)}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
                        >
                          Open Arbitration Console
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Settlement Overview */}
              {entityType === 'settlement' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Gross Fare</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        ₹{entity.grossFare?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Platform Fee</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">
                        {entity.platformFeePercent}%
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Net Payout</span>
                      <span className="text-base font-extrabold text-teal-400 font-mono">
                        ₹{entity.payoutAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {(entity.payoutAmount || 0) > 50000 && (
                    <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Dual-Admin Sign-Off Required (&gt; ₹50,000)</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 space-y-1">
                        {(entity.signOffs || []).length === 0 && (
                          <div className="text-rose-300">No sign-offs recorded yet (0/2)</div>
                        )}
                        {(entity.signOffs || []).map((s, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-slate-200">{s.adminUid}</span>
                            <span className="text-slate-500">{new Date(s.signedAt).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Booking Reference</span>
                      <span className="text-white font-bold font-mono">{entity.bookingId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Payout Mode</span>
                      <span className="text-slate-200 font-medium">{entity.payoutMode}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeSubTab === 'documents' && (
            <div className="space-y-4">
              {/* Vehicle Papers */}
              {entityType === 'vehicle' && (
                <>
                  {[
                    { key: 'rcBook', label: 'RC Book (Registration Certificate)', doc: entity.rcBook, idKey: 'number' },
                    { key: 'commercialInsurance', label: 'Commercial Insurance Policy', doc: entity.commercialInsurance, idKey: 'policyNumber' },
                    { key: 'fitnessCertificate', label: 'Fitness Certificate', doc: entity.fitnessCertificate, idKey: 'number' }
                  ].map(({ key, label, doc, idKey }) => (
                    <div key={key} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-teal-400" />
                          <span className="font-bold text-white text-xs">{label}</span>
                        </div>
                        {doc?.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                            <Clock className="w-3 h-3" /> Pending Verification
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Document ID</span>
                          <span className="text-white font-bold">{doc?.[idKey] || 'N/A'}</span>
                        </div>
                        {doc?.validTill && (
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">Valid Till</span>
                            <span className={new Date(doc.validTill) < new Date() ? 'text-rose-400 font-bold' : 'text-slate-300 font-bold'}>
                              {doc.validTill}
                            </span>
                          </div>
                        )}
                      </div>
                      {doc?.photoUrl && (
                        <div className="h-44 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative group">
                          <img src={doc.photoUrl} alt={label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a
                              href={doc.photoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-lg"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Full Document</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onVerifyPapers(entity)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Verify Commercial Papers</span>
                    </button>
                  </div>
                </>
              )}

              {/* Booking POD */}
              {entityType === 'booking' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-white text-xs">Proof of Delivery Documentation</span>
                    </div>
                    {entity.pod?.audited ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                        <CheckCircle2 className="w-3 h-3" /> Audited
                      </span>
                    ) : entity.pod?.submitted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                        <Clock className="w-3 h-3" /> Awaiting Audit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        Not Submitted
                      </span>
                    )}
                  </div>

                  {entity.pod?.submitted ? (
                    <>
                      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Receiver</span>
                          <span className="text-white font-bold">{entity.pod.receiverName || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Submitted At</span>
                          <span className="text-slate-300 font-bold">
                            {entity.pod.submittedAt ? new Date(entity.pod.submittedAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      {entity.pod.documentUrl && (
                        <div className="h-44 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative group">
                          <img src={entity.pod.documentUrl} alt="Proof of Delivery" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a
                              href={entity.pod.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-lg"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Full POD</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-6 text-center text-slate-500 text-[11px]">
                      Transporter has not uploaded proof of delivery for this trip yet.
                    </div>
                  )}
                </div>
              )}

              {/* Settlement POD Reference */}
              {entityType === 'settlement' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-white text-xs">Payout Release Controls</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
                      {entity.podAuditStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    POD audit verifies delivery documentation before the transporter payout of{' '}
                    <span className="text-teal-400 font-bold">₹{entity.payoutAmount?.toLocaleString('en-IN')}</span> is
                    released from escrow. Payouts exceeding ₹50,000 require dual-admin sign-off.
                  </div>
                  <div className="flex items-center justify-end">
                    {(entity.podAuditStatus === 'pending_audit' || entity.podAuditStatus === 'approved') && (
                      <button
                        onClick={() => onAuditPayout(entity)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Audit POD & Release Payout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'json' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96">
              <pre>{JSON.stringify(entity, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Drawer Action Buttons Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => handleCopyText(JSON.stringify(entity, null, 2), 'Document JSON')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy JSON</span>
          </button>

          <div className="flex items-center gap-2">
            {entityType === 'vehicle' && (
              <button
                onClick={() => onVerifyPapers(entity)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Verify Papers</span>
              </button>
            )}
            {entityType === 'booking' && (
              <button
                onClick={() => onOverrideStatus(entity)}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Manual Status Override</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
