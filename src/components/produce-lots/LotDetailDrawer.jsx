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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono">{lot.id}</h2>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  {lot.commodity}
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {lot.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Posted by <span className="text-slate-200 font-semibold">{lot.farmerName}</span> • {lot.village}, {lot.district}
              </p>
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
            Overview & Assay
          </button>
          <button
            onClick={() => setActiveSubTab('weighbridge')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'weighbridge'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Weighbridge Slip ({lot.weighbridgeSlip?.verified ? 'Verified' : 'Pending'})
          </button>
          <button
            onClick={() => setActiveSubTab('bids')}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeSubTab === 'bids'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            B2B Deals & Bids ({lot.bidsCount || (deal ? 1 : 0)})
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
              {/* 1. Lot Financial Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Quantity</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {lot.quantityQtl} Qtl
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {(lot.quantityQtl / 10).toFixed(1)} Metric Tonnes
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Reserve Price</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    ₹{lot.reservePrice?.toLocaleString('en-IN')}/Qtl
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Floor Selling Price
                  </span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Estimated Value</span>
                  <span className="text-base font-extrabold text-sky-400 font-mono">
                    ₹{(lot.estimatedTotalValue || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    At Reserve Price
                  </span>
                </div>
              </div>

              {/* 2. Dispute Banner (If Disputed) */}
              {lot.status === 'disputed' && (
                <div className="bg-rose-950/40 border border-rose-700/60 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Active B2B Transaction Dispute Under Superadmin Review</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {lot.disputeDetails?.reason || 'A quality or payment deduction dispute was lodged for this lot.'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-800/40 text-[11px] font-mono">
                    <span className="text-slate-400">
                      Escrow Amount Frozen: ₹{lot.disputeDetails?.escrowLocked?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => onMediateDispute(lot)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
                    >
                      Open Mediation Console
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Produce Quality Assay Parameters */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Quality Assay & Grading Certificate
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                    {lot.qualityGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Moisture</span>
                    <span className="text-white font-bold">{lot.qualityParams?.moisturePercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Foreign Matter</span>
                    <span className="text-white font-bold">{lot.qualityParams?.foreignMatterPercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Damaged Grains</span>
                    <span className="text-white font-bold">{lot.qualityParams?.damagedGrainsPercent || 'N/A'}%</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Special Spec</span>
                    <span className="text-teal-400 font-bold">
                      {lot.qualityParams?.oilContentPercent ? `Oil ${lot.qualityParams.oilContentPercent}%` :
                       lot.qualityParams?.curcuminPercent ? `Curcumin ${lot.qualityParams.curcuminPercent}%` :
                       lot.qualityParams?.stapleLengthMm || 'FAQ Standard'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Assay Laboratory: <span className="text-slate-200 font-medium">{lot.qualityParams?.certifiedBy || 'Self Reported'}</span>
                </div>
              </div>

              {/* 4. Farmer Identity */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Farmer Identity & Farm Location
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Farmer Name</span>
                    <span className="text-white font-semibold">{lot.farmerName}</span>
                    <span className="text-slate-400 text-[10px] block font-mono">{lot.farmerMobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location</span>
                    <span className="text-slate-200 font-medium">{lot.village}, {lot.district}</span>
                    <span className="text-slate-400 text-[10px] block">{lot.state}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'weighbridge' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-400" />
                    <span className="font-bold text-white text-xs">Electronic Weighbridge Slip</span>
                  </div>
                  {lot.weighbridgeSlip?.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                      <CheckCircle2 className="w-3 h-3" /> Verified by Superadmin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                      <Clock className="w-3 h-3" /> Pending Verification
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Slip Serial</span>
                    <span className="text-white font-bold">{lot.weighbridgeSlip?.slipNumber || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Gross Weight</span>
                    <span className="text-white">{lot.weighbridgeSlip?.grossWeightKg?.toLocaleString('en-IN') || 0} kg</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Tare Weight</span>
                    <span className="text-slate-400">{lot.weighbridgeSlip?.tareWeightKg?.toLocaleString('en-IN') || 0} kg</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Net Produce Weight</span>
                    <span className="text-teal-400 font-bold">{lot.weighbridgeSlip?.netWeightKg?.toLocaleString('en-IN') || 0} kg ({lot.weighbridgeSlip?.netQuintals} Qtl)</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Dharam Kanta Station: <span className="text-slate-200">{lot.weighbridgeSlip?.weighbridgeName || 'Unspecified'}</span>
                </div>

                {lot.weighbridgeSlip?.slipPhotoUrl && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Uploaded Weighbridge Receipt Document:
                    </span>
                    <div className="h-44 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative group">
                      <img
                        src={lot.weighbridgeSlip.slipPhotoUrl}
                        alt="Weighbridge Slip"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={lot.weighbridgeSlip.slipPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-lg"
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
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors"
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
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Locked B2B Contract</span>
                    <span className="font-mono text-sky-400 font-bold">{deal.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Procuring Buyer</span>
                      <span className="text-white font-bold">{deal.buyerFirm}</span>
                      <span className="text-slate-400 text-[10px] block">{deal.buyerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Final Agreed Price</span>
                      <span className="text-emerald-400 font-bold">₹{deal.finalAgreedPrice}/Qtl</span>
                      <span className="text-slate-400 text-[10px] block">Total: ₹{deal.totalDealValue?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Escrow Account Ref</span>
                      <span className="text-slate-300">{deal.escrowAccountRef}</span>
                      <span className="text-teal-400 text-[10px] block">{deal.escrowStatus.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Broker Mediation</span>
                      <span className="text-slate-300">{deal.brokerName || 'Direct'}</span>
                      {deal.brokeragePercent > 0 && (
                        <span className="text-amber-400 text-[10px] block">{deal.brokeragePercent}% Brokerage</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : lot.highestBid ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Leading Trader Bid</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      ₹{lot.highestBid.bidPrice.toLocaleString('en-IN')}/Qtl
                    </span>
                  </div>
                  <div className="text-slate-300 text-xs">
                    Bidder: <span className="text-white font-semibold">{lot.highestBid.tradeFirm}</span> ({lot.highestBid.traderName})
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Bid Submitted: {new Date(lot.highestBid.bidTimestamp).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  No active trader bids currently recorded on this lot.
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'json' && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96">
              <pre>{JSON.stringify({ lot, deal }, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Drawer Action Buttons Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => onSuspendLot(lot)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              lot.status === 'suspended'
                ? 'bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 border-emerald-700'
                : 'bg-rose-950/60 hover:bg-rose-600 text-rose-300 border-rose-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{lot.status === 'suspended' ? 'Reinstate Listing' : 'Suspend / Takedown'}</span>
          </button>

          <div className="flex items-center gap-2">
            {lot.status === 'disputed' && (
              <button
                onClick={() => onMediateDispute(lot)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Arbitrate Dispute</span>
              </button>
            )}

            <button
              onClick={() => onVerifyWeighbridge(lot)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
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
