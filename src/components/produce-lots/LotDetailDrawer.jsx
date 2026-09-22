import React, { useState } from 'react';
import {
  X,
  Package,
  Scale,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  TrendingUp,
  Image as ImageIcon,
  Copy,
  ChevronRight,
  UserCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function LotDetailDrawer({
  isOpen,
  onClose,
  lot,
  deal,
  onVerifyWeighbridge,
  onMediateDispute,
  onSuspendLot,
  onForceStatusUpdate
}) {
  const { addToast } = useNotification();
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'weighbridge' | 'bids' | 'json'

  if (!isOpen || !lot) return null;

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast({ title: 'Copied', message: `${label} copied to clipboard`, type: 'info' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white border-l border-emerald-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/70 via-emerald-50/80 to-emerald-100/50 border-b border-emerald-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 font-mono">{lot.id}</h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                  {lot.commodity}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
                  {lot.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Posted by <span className="text-slate-900 font-bold">{lot.farmerName}</span> • {lot.village}, {lot.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-emerald-50/40 border-b border-emerald-100 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Assay
          </button>
          <button
            onClick={() => setActiveSubTab('weighbridge')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'weighbridge'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Weighbridge Slip ({lot.weighbridgeSlip?.verified ? 'Verified' : 'Pending'})
          </button>
          <button
            onClick={() => setActiveSubTab('bids')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'bids'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            B2B Deals & Bids ({lot.bidsCount || (deal ? 1 : 0)})
          </button>
          <button
            onClick={() => setActiveSubTab('json')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeSubTab === 'json'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs bg-slate-50/50">
          {activeSubTab === 'overview' && (
            <>
              {/* 1. Lot Financial Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-slate-500 block text-[11px] font-semibold">Quantity</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {lot.quantityQtl} Qtl
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {(lot.quantityQtl / 10).toFixed(1)} Metric Tonnes
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-slate-500 block text-[11px] font-semibold">Reserve Price</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    ₹{lot.reservePrice?.toLocaleString('en-IN')}/Qtl
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Floor Selling Price
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
                  <span className="text-slate-500 block text-[11px] font-semibold">Estimated Value</span>
                  <span className="text-base font-extrabold text-teal-700 font-mono">
                    ₹{(lot.estimatedTotalValue || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    At Reserve Price
                  </span>
                </div>
              </div>

              {/* 2. Dispute Banner (If Disputed) */}
              {lot.status === 'disputed' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-rose-800 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Active B2B Transaction Dispute Under Superadmin Review</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {lot.disputeDetails?.reason || 'A quality or payment deduction dispute was lodged for this lot.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-200 text-[11px] font-mono">
                    <span className="text-slate-600 font-semibold">
                      Escrow Amount Frozen: ₹{lot.disputeDetails?.escrowLocked?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onMediateDispute(lot)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                    >
                      Open Mediation Console
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Produce Quality Assay Parameters */}
              <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Quality Assay & Grading Certificate
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {lot.qualityGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Moisture</span>
                    <span className="text-slate-900 font-bold">{lot.qualityParams?.moisturePercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Foreign Matter</span>
                    <span className="text-slate-900 font-bold">{lot.qualityParams?.foreignMatterPercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Damaged Grains</span>
                    <span className="text-slate-900 font-bold">{lot.qualityParams?.damagedGrainsPercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Special Spec</span>
                    <span className="text-teal-700 font-bold">
                      {lot.qualityParams?.oilContentPercent ? `Oil ${lot.qualityParams.oilContentPercent}%` :
                       lot.qualityParams?.curcuminPercent ? `Curcumin ${lot.qualityParams.curcuminPercent}%` :
                       lot.qualityParams?.stapleLengthMm || 'FAQ Standard'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 font-medium">
                  Assay Laboratory: <span className="text-slate-800 font-bold">{lot.qualityParams?.certifiedBy || 'Self Reported'}</span>
                </div>
              </div>

              {/* 4. Farmer Identity */}
              <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 space-y-2 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Farmer Identity & Farm Location
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Farmer Name</span>
                    <span className="text-slate-900 font-bold">{lot.farmerName}</span>
                    <span className="text-slate-400 text-[10px] block font-mono">{lot.farmerMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] font-semibold">Location</span>
                    <span className="text-slate-800 font-medium">{lot.village}, {lot.district}</span>
                    <span className="text-slate-400 text-[10px] block">{lot.state}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'weighbridge' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100/90 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-xs">Electronic Weighbridge Slip</span>
                  </div>
                  {lot.weighbridgeSlip?.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified by Superadmin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending Verification
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Slip Serial</span>
                    <span className="text-slate-900 font-bold">{lot.weighbridgeSlip?.slipNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Gross Weight</span>
                    <span className="text-slate-800">{lot.weighbridgeSlip?.grossWeightKg?.toLocaleString('en-IN') || 0} kg</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Tare Weight</span>
                    <span className="text-slate-600">{lot.weighbridgeSlip?.tareWeightKg?.toLocaleString('en-IN') || 0} kg</span>
                  </div>
                  <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Net Produce Weight</span>
                    <span className="text-teal-700 font-bold">{lot.weighbridgeSlip?.netWeightKg?.toLocaleString('en-IN') || 0} kg ({lot.weighbridgeSlip?.netQuintals} Qtl)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 font-medium">
                  Dharam Kanta Station: <span className="text-slate-900 font-bold">{lot.weighbridgeSlip?.weighbridgeName || 'Unspecified'}</span>
                </div>

                {lot.weighbridgeSlip?.slipPhotoUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-600 block mb-1.5 font-semibold">
                      Uploaded Weighbridge Receipt Document:
                    </span>
                    <div className="h-44 w-full rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/30 relative group shadow-xs">
                      <img
                        src={lot.weighbridgeSlip.slipPhotoUrl}
                        alt="Weighbridge Slip"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={lot.weighbridgeSlip.slipPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Full Receipt</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => onVerifyWeighbridge(lot)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  <Scale className="w-4 h-4" />
                  <span>Verify / Update Weighbridge Slip</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'bids' && (
            <div className="space-y-4">
              {deal ? (
                <div className="bg-white p-4 rounded-2xl border border-emerald-100/90 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Locked B2B Contract</span>
                    <span className="font-mono text-emerald-700 font-bold">{deal.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-semibold">Procuring Buyer</span>
                      <span className="text-slate-900 font-bold">{deal.buyerFirm}</span>
                      <span className="text-slate-500 text-[10px] block">{deal.buyerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-semibold">Final Agreed Price</span>
                      <span className="text-emerald-700 font-bold">₹{deal.finalAgreedPrice}/Qtl</span>
                      <span className="text-slate-500 text-[10px] block">Total: ₹{deal.totalDealValue?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-semibold">Escrow Account Ref</span>
                      <span className="text-slate-700">{deal.escrowAccountRef}</span>
                      <span className="text-teal-700 text-[10px] font-bold block">{deal.escrowStatus.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-semibold">Broker Mediation</span>
                      <span className="text-slate-700">{deal.brokerName || 'Direct'}</span>
                      {deal.brokeragePercent > 0 && (
                        <span className="text-amber-800 text-[10px] font-bold block">{deal.brokeragePercent}% Brokerage</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : lot.highestBid ? (
                <div className="bg-white p-4 rounded-2xl border border-emerald-100/90 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Leading Trader Bid</span>
                    <span className="text-emerald-700 font-mono font-bold text-sm">
                      ₹{lot.highestBid.bidPrice.toLocaleString('en-IN')}/Qtl
                    </span>
                  </div>
                  <div className="text-slate-700 text-xs font-medium">
                    Bidder: <span className="text-slate-900 font-bold">{lot.highestBid.tradeFirm}</span> ({lot.highestBid.traderName})
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Bid Submitted: {new Date(lot.highestBid.bidTimestamp).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 font-medium">
                  No active trader bids currently recorded on this lot.
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'json' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-96">
              <pre>{JSON.stringify({ lot, deal }, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Drawer Action Buttons Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-emerald-100 flex items-center justify-between shrink-0 shadow-xs">
          <button
            onClick={() => onSuspendLot(lot)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-colors shadow-xs ${
              lot.status === 'suspended'
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{lot.status === 'suspended' ? 'Reinstate Listing' : 'Suspend / Takedown'}</span>
          </button>

          <div className="flex items-center gap-2">
            {lot.status === 'disputed' && (
              <button
                onClick={() => onMediateDispute(lot)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Arbitrate Dispute</span>
              </button>
            )}

            <button
              onClick={() => onVerifyWeighbridge(lot)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Weighbridge Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
