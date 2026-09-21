import React, { useState, useEffect } from 'react';
import {
  X,
  Tractor,
  CalendarClock,
  FileText,
  Copy,
  ShieldAlert,
  FileCheck2,
  Users,
  IndianRupee,
  GitBranch
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function EquipmentDetailDrawer({
  isOpen,
  onClose,
  entity,
  entityType, // 'machine' | 'slot' | 'booking'
  onVerifyPapers,
  onForceCancel,
  onResolveDamage
}) {
  const { addToast } = useNotification();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  useEffect(() => {
    setActiveSubTab('overview');
  }, [entity?.id, entityType]);

  if (!isOpen || !entity) return null;

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast({ title: 'Copied', message: `${label} copied to clipboard`, type: 'info' });
  };

  const headerMeta = {
    machine: { icon: Tractor, accent: 'text-emerald-400', title: entity.id, subtitle: `${entity.name} • ${entity.ownerName}` },
    slot: { icon: CalendarClock, accent: 'text-sky-400', title: entity.id, subtitle: `${entity.equipmentName} • ${entity.date} ${entity.slotName}` },
    booking: { icon: FileText, accent: 'text-teal-400', title: entity.id, subtitle: `${entity.farmerName} • ₹${(entity.priceRupees || 0).toLocaleString('en-IN')}` }
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
            onClick={() => setActiveSubTab('details')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'details'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {entityType === 'machine' ? 'Papers & Licensing' : entityType === 'slot' ? 'Waitlist' : 'Damage / Cancel'}
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
          {/* ─── OVERVIEW ─── */}
          {activeSubTab === 'overview' && (
            <>
              {entityType === 'machine' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Hourly Rate</span>
                      <span className="text-base font-extrabold text-white font-mono flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5" />{entity.hourlyRate}/hr
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Per-Acre Rate</span>
                      <span className="text-base font-extrabold text-sky-400 font-mono">
                        {entity.perAcreRate ? `₹${entity.perAcreRate}` : '—'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Utilization</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />{entity.utilizationPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Owner Identity & Machine Registry
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Owner</span>
                        <span className="text-white font-semibold">{entity.ownerName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.ownerMobile} · {entity.ownerId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Location</span>
                        <span className="text-slate-200 font-medium">{entity.village}, {entity.district}</span>
                        <span className="text-slate-400 text-[10px] block font-mono capitalize">
                          {entity.ownerType === 'fpo' ? `FPO: ${entity.fpoName || 'Registered pool'}` : 'Private owner'}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed pt-2 border-t border-slate-800/60">
                      {entity.description}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Total Bookings</span>
                      <span className="text-white font-bold font-mono">{entity.totalBookings}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Rating</span>
                      <span className="text-amber-400 font-bold font-mono">★ {entity.rating || 'New'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Pricing Fairness</span>
                      <span className={`font-bold font-mono ${entity.pricingIndexPercent > 120 ? 'text-rose-400' : entity.pricingIndexPercent > 105 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {entity.pricingIndexPercent}%
                      </span>
                    </div>
                  </div>

                  {entity.pricingIndexPercent > 120 && (
                    <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4 flex items-start gap-2 text-rose-300 font-semibold">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        Pricing fairness alert: rates are {entity.pricingIndexPercent}% of the district band for this machine class. Monitor for exploitation during peak sowing/harvest windows.
                      </span>
                    </div>
                  )}
                </>
              )}

              {entityType === 'slot' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Window</span>
                      <span className="text-base font-extrabold text-sky-400 font-mono">{entity.slotName}</span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Price</span>
                      <span className="text-base font-extrabold text-white font-mono">₹{entity.priceRupees.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Waitlist</span>
                      <span className="text-base font-extrabold text-violet-400 font-mono">{entity.waitlist?.length || 0}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Slot Ledger Record</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Machine</span>
                        <span className="text-white font-semibold">{entity.equipmentName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.equipmentId} · {entity.ownerType?.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Recommended Task</span>
                        <span className="text-slate-200 font-medium">{entity.recommendedTask}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.startMin}–{entity.endMin} min ({entity.duration} min)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Booked By</span>
                        {entity.bookedByName ? (
                          <>
                            <span className="text-slate-200 font-medium">{entity.bookedByName}</span>
                            <span className="text-slate-400 text-[10px] block font-mono">{entity.bookedBy}</span>
                          </>
                        ) : (
                          <span className="text-slate-500">— Available —</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Materialized</span>
                        <span className="text-slate-200 font-medium font-mono">{new Date(entity.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {entity.anomaly === 'double_booked' && (
                    <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-rose-300 font-bold">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>Slot Double-Booking Anomaly</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Multiple confirmed bookings reference this slot — the atomic book transaction guard was bypassed or a race occurred. Resolve by force-cancelling the duplicate booking(s) in the Slot Bookings tab; the slot is released or the first waitlisted farmer is promoted automatically.
                      </p>
                    </div>
                  )}
                </>
              )}

              {entityType === 'booking' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Slot Price</span>
                      <span className="text-base font-extrabold text-white font-mono">₹{entity.priceRupees?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Security Deposit</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">₹{(entity.securityDeposit || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Mode</span>
                      <span className={`text-base font-extrabold font-mono uppercase ${entity.ownerType === 'fpo' ? 'text-sky-400' : 'text-violet-400'}`}>
                        {entity.ownerType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Booking & Farmer Identity</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Farmer</span>
                        <span className="text-white font-semibold">{entity.farmerName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.farmerId} · {entity.farmerMobile}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Machine</span>
                        <span className="text-slate-200 font-medium">{entity.equipmentName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">{entity.equipmentId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Slot Window</span>
                        <span className="text-slate-200 font-medium font-mono">{entity.date} · {entity.slotName}</span>
                        <span className="text-slate-400 text-[10px] block font-mono">Starts {new Date(entity.startAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Status</span>
                        <span className="text-slate-200 font-semibold uppercase">{entity.status}</span>
                      </div>
                    </div>
                  </div>

                  {entity.cancelReason && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1.5">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Cancellation Record</h3>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{entity.cancelReason}</p>
                      {entity.refundAmount != null && (
                        <div className="text-[11px] font-mono text-teal-400">Refund issued: ₹{entity.refundAmount.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ─── DETAILS TAB ─── */}
          {activeSubTab === 'details' && (
            <div className="space-y-4">
              {/* Machine: Papers & Licensing */}
              {entityType === 'machine' && (
                <>
                  {[
                    { label: 'RC Document (Machine Registration)', doc: entity.rcDocument, idKey: 'number' },
                    { label: 'Commercial Insurance Policy', doc: entity.insuranceDocument, idKey: 'policyNumber' },
                    { label: 'Operator License', doc: entity.operatorLicense, idKey: 'number' }
                  ].map(({ label, doc, idKey }) => (
                    <div key={label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-teal-400" />
                          <span className="font-bold text-white text-xs">{label}</span>
                        </div>
                        {doc?.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                            Pending Verification
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
                    </div>
                  ))}

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onVerifyPapers(entity)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      <span>Verify Papers & Operator License</span>
                    </button>
                  </div>
                </>
              )}

              {/* Slot: Waitlist */}
              {entityType === 'slot' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="font-bold text-white text-xs">Waitlist Queue ({entity.waitlist?.length || 0})</span>
                  </div>
                  {entity.waitlist?.length ? (
                    <div className="space-y-2">
                      {entity.waitlist.map((w, i) => (
                        <div key={w.userId} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-violet-950 text-violet-300 border border-violet-600/40 flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <div>
                              <div className="text-slate-200 font-semibold">{w.name}</div>
                              <div className="text-[10px] font-mono text-slate-500">{w.userId}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(w.at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-slate-500 text-[11px]">
                      No farmers are waitlisted on this slot.
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2.5">
                    On admin force-cancellation, the first waitlisted farmer is promoted to a pending booking request (FPO machines auto-confirm; private owners approve).
                  </div>
                </div>
              )}

              {/* Booking: Damage Report & Cancellation */}
              {entityType === 'booking' && (
                <>
                  {entity.damageReport?.reported && (
                    <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300 font-bold">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>Machinery Damage Report</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded uppercase">
                          {entity.damageReport.depositAction.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {entity.damageReport.description}
                      </p>
                      <div className="text-[11px] font-mono text-slate-500">
                        Reported {new Date(entity.damageReport.reportedAt).toLocaleString()} · Deposit ₹{(entity.securityDeposit || 0).toLocaleString('en-IN')}
                      </div>
                      {entity.damageReport.depositAction === 'pending' && (
                        <div className="flex items-center justify-end pt-2 border-t border-rose-800/40">
                          <button
                            onClick={() => onResolveDamage(entity)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors"
                          >
                            Open Deposit Resolution Console
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {entity.signOffs?.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Dual-Admin Sign-Off Record (&gt; ₹50,000)</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 space-y-1">
                        {entity.signOffs.map((s, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-slate-200">{s.adminUid}</span>
                            <span className="text-slate-500">{new Date(s.signedAt).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entity.status !== 'cancelled' && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-white text-xs">Emergency Intervention</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        Admin force cancellation overrides the 2-hour cancel window and the private-owner approval queue. A mandatory refund amount is queued back to the farmer and the slot is released (or the first waitlisted farmer is promoted).
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => onForceCancel(entity)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Force Cancel with Refund</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
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
            {entityType === 'machine' && (
              <button
                onClick={() => onVerifyPapers(entity)}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Verify Papers</span>
              </button>
            )}
            {entityType === 'booking' && entity.status !== 'cancelled' && (
              <button
                onClick={() => onForceCancel(entity)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Force Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
