import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Scale,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Building2,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function DisputeMediationModal({
  isOpen,
  onClose,
  disputeData, // can be a lot with disputeDetails or a deal
  onConfirmResolution,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();

  const [resolutionType, setResolutionType] = useState('quality_docking'); // 'uphold_farmer' | 'quality_docking' | 'cancel_and_refund'
  const [adjustedPrice, setAdjustedPrice] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Extract deal or lot info
  const dealId = disputeData?.dealId || disputeData?.id || 'DEAL-502';
  const farmerName = disputeData?.farmerName || 'Laxman Thorat';
  const buyerFirm = disputeData?.buyerFirm || disputeData?.tradeFirm || 'FreshCold Logistics Mumbai';
  const agreedPrice = disputeData?.finalAgreedPrice || disputeData?.reservePrice || 10200;
  const quantityQtl = disputeData?.quantityQtl || 150;
  const totalEscrow = disputeData?.totalDealValue || disputeData?.disputeDetails?.escrowLocked || 1530000;
  const disputeClaim = disputeData?.disputeReason || disputeData?.disputeDetails?.reason || 'Quality damage / moisture dispute during weighbridge inspection.';

  useEffect(() => {
    if (isOpen) {
      setResolutionType('quality_docking');
      setAdjustedPrice(Math.round(agreedPrice * 0.88)); // Default ~12% docking proposal
      setReason('');
      setError('');
    }
  }, [isOpen, agreedPrice]);

  if (!isOpen) return null;

  const numAdjustedPrice = Number(adjustedPrice) || agreedPrice;
  const farmerPayout = resolutionType === 'uphold_farmer' ? totalEscrow :
                       resolutionType === 'cancel_and_refund' ? 0 :
                       numAdjustedPrice * quantityQtl;
  const buyerRefund = totalEscrow - farmerPayout;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resolutionType === 'quality_docking' && (!adjustedPrice || numAdjustedPrice <= 0 || numAdjustedPrice > agreedPrice)) {
      setError(`Adjusted price must be between ₹1 and the original agreed price of ₹${agreedPrice}/Qtl.`);
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Formal arbitration reasoning (minimum 8 characters) is mandatory.');
      return;
    }

    onConfirmResolution({
      dealId,
      resolutionType,
      adjustedPrice: numAdjustedPrice,
      releaseAmount: farmerPayout,
      refundAmount: buyerRefund,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Superadmin Dispute Arbitration Console</span>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                  SOP-05 Section 3
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Contract: <span className="font-mono text-slate-200 font-semibold">{dealId}</span> • Escrow: <span className="font-mono text-sky-400 font-bold">₹{totalEscrow.toLocaleString('en-IN')}</span>
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

        {/* Dispute Summary Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Farmer</span>
                <span className="text-white font-bold">{farmerName}</span>
              </div>
              <div className="text-center font-mono">
                <span className="text-slate-500 block text-[10px]">Agreed Lot</span>
                <span className="text-slate-300">{quantityQtl} Qtl @ ₹{agreedPrice}/Qtl</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Procuring Buyer</span>
                <span className="text-sky-400 font-bold">{buyerFirm}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                Dispute Claim & Investigation Summary:
              </span>
              <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                "{disputeClaim}"
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Arbitration Decisions Selection */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">
              Select Binding Superadmin Ruling:
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: Uphold Farmer */}
              <div
                onClick={() => setResolutionType('uphold_farmer')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'uphold_farmer'
                    ? 'bg-emerald-950/50 border-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Uphold Farmer</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-400">
                  Release 100% escrow to farmer bank account.
                </div>
              </div>

              {/* Option 2: Quality Docking */}
              <div
                onClick={() => setResolutionType('quality_docking')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'quality_docking'
                    ? 'bg-amber-950/50 border-amber-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-amber-400">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Quality Docking</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-400">
                  Arbitrate docked price per official assay.
                </div>
              </div>

              {/* Option 3: Cancel & Refund */}
              <div
                onClick={() => setResolutionType('cancel_and_refund')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'cancel_and_refund'
                    ? 'bg-rose-950/50 border-rose-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-rose-400">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel & Refund</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-400">
                  Refund buyer escrow; re-list lot.
                </div>
              </div>
            </div>
          </div>

          {/* Quality Docking Price Input (If selected) */}
          {resolutionType === 'quality_docking' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <label className="block text-slate-300 font-semibold">
                Arbitrated Rate (₹/Qtl) — Original was ₹{agreedPrice}/Qtl:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={adjustedPrice}
                  onChange={(e) => setAdjustedPrice(e.target.value)}
                  min="100"
                  max={agreedPrice}
                  className="w-44 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-[11px] font-mono text-rose-400">
                  Docking: -₹{agreedPrice - numAdjustedPrice}/Qtl ({(((agreedPrice - numAdjustedPrice) / agreedPrice) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {/* Payout Distribution Preview */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 grid grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Farmer Payout</span>
              <span className="text-sm font-extrabold text-emerald-400">
                ₹{farmerPayout.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block">Direct Bank Transfer</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Buyer Refund</span>
              <span className="text-sm font-extrabold text-sky-400">
                ₹{buyerRefund.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block">Returned from Escrow</span>
            </div>
          </div>

          {/* Mandatory Arbitration Reasoning */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Formal Arbitration Rationale (Mandatory for Escrow Ledger) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 chars ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Detail laboratory moisture verification and justification for this ruling..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Compliance notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Per SOP-05 Rule 6.3, financial adjustments above ₹50,000 are recorded in immutable audit logs with admin <code className="text-amber-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code> signature.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Executing Ruling...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Commit Binding Arbitration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
