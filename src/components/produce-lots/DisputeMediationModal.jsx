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
  const [secondaryAdminUid, setSecondaryAdminUid] = useState('supervisor.finance@agrovercity.in');
  const [dualSignoffConfirmed, setDualSignoffConfirmed] = useState(true);
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
      setSecondaryAdminUid('supervisor.finance@agrovercity.in');
      setDualSignoffConfirmed(true);
      setError('');
    }
  }, [isOpen, agreedPrice]);

  if (!isOpen) return null;

  const numAdjustedPrice = Number(adjustedPrice) || agreedPrice;
  const farmerPayout = resolutionType === 'uphold_farmer' ? totalEscrow :
                       resolutionType === 'cancel_and_refund' ? 0 :
                       numAdjustedPrice * quantityQtl;
  const buyerRefund = totalEscrow - farmerPayout;
  const requiresDualSignoff = farmerPayout > 50000 || buyerRefund > 50000;

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
    if (requiresDualSignoff && !dualSignoffConfirmed) {
      setError('Dual-admin sign-off verification checkbox is required for adjustments exceeding ₹50,000 (SOP-05 §6.3).');
      return;
    }

    onConfirmResolution({
      dealId,
      resolutionType,
      adjustedPrice: numAdjustedPrice,
      releaseAmount: farmerPayout,
      refundAmount: buyerRefund,
      secondaryAdminUid: requiresDualSignoff ? secondaryAdminUid : null,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/70 via-emerald-50/80 to-emerald-100/50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Superadmin Dispute Arbitration Console</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                  SOP-05 Section 3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Contract: <span className="font-mono text-slate-800 font-bold">{dealId}</span> • Escrow: <span className="font-mono text-teal-700 font-bold">₹{totalEscrow.toLocaleString('en-IN')}</span>
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

        {/* Dispute Summary Card */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Farmer</span>
                <span className="text-slate-900 font-bold">{farmerName}</span>
              </div>
              <div className="text-center font-mono">
                <span className="text-slate-500 block text-[10px] font-semibold">Agreed Lot</span>
                <span className="text-slate-700 font-medium">{quantityQtl} Qtl @ ₹{agreedPrice}/Qtl</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] font-semibold">Procuring Buyer</span>
                <span className="text-teal-800 font-bold">{buyerFirm}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5">
                Dispute Claim & Investigation Summary:
              </span>
              <p className="text-slate-700 text-xs leading-relaxed bg-white p-2.5 rounded-xl border border-emerald-100 font-medium">
                "{disputeClaim}"
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Arbitration Decisions Selection */}
          <div className="space-y-2">
            <label className="block text-slate-800 font-bold">
              Select Binding Superadmin Ruling:
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: Uphold Farmer */}
              <div
                onClick={() => setResolutionType('uphold_farmer')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'uphold_farmer'
                    ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs ring-1 ring-emerald-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Uphold Farmer</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-500">
                  Release 100% escrow to farmer bank account.
                </div>
              </div>

              {/* Option 2: Quality Docking */}
              <div
                onClick={() => setResolutionType('quality_docking')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'quality_docking'
                    ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-xs ring-1 ring-amber-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-amber-800">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quality Docking</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-500">
                  Arbitrate docked price per official assay.
                </div>
              </div>

              {/* Option 3: Cancel & Refund */}
              <div
                onClick={() => setResolutionType('cancel_and_refund')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'cancel_and_refund'
                    ? 'bg-rose-50 border-rose-400 text-slate-900 shadow-xs ring-1 ring-rose-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1 text-rose-800">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Cancel & Refund</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-500">
                  Refund buyer escrow; re-list lot.
                </div>
              </div>
            </div>
          </div>

          {/* Quality Docking Price Input (If selected) */}
          {resolutionType === 'quality_docking' && (
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
              <label className="block text-slate-700 font-bold">
                Arbitrated Rate (₹/Qtl) — Original was ₹{agreedPrice}/Qtl:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={adjustedPrice}
                  onChange={(e) => setAdjustedPrice(e.target.value)}
                  min="100"
                  max={agreedPrice}
                  className="w-44 bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[11px] font-mono text-rose-600 font-semibold">
                  Docking: -₹{agreedPrice - numAdjustedPrice}/Qtl ({(((agreedPrice - numAdjustedPrice) / agreedPrice) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {/* Payout Distribution Preview */}
          <div className="bg-white border border-emerald-100/90 rounded-2xl p-3.5 grid grid-cols-2 gap-3 font-mono shadow-xs">
            <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Farmer Payout</span>
              <span className="text-sm font-extrabold text-emerald-800">
                ₹{farmerPayout.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block font-sans font-medium">Direct Bank Transfer</span>
            </div>
            <div className="bg-teal-50/40 p-2.5 rounded-xl border border-teal-100">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Buyer Refund</span>
              <span className="text-sm font-extrabold text-teal-800">
                ₹{buyerRefund.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block font-sans font-medium">Returned from Escrow</span>
            </div>
          </div>

          {/* Mandatory Arbitration Reasoning */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">
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
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Dual-Admin Sign-off for High-Value Escrow Adjustment (> ₹50,000) (SOP-05 §6.3) */}
          {requiresDualSignoff && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Dual-Admin Escalation Required (&gt; ₹50,000)</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  Rule 6.3 Enforced
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Because this financial arbitration impacts <strong className="font-mono">₹{Math.max(farmerPayout, buyerRefund).toLocaleString('en-IN')}</strong> (exceeds ₹50,000 limit), dual-admin sign-off is statutory.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <label className="text-[11px] font-semibold text-slate-700 shrink-0">Secondary Co-Signer:</label>
                <input
                  type="text"
                  value={secondaryAdminUid}
                  onChange={(e) => setSecondaryAdminUid(e.target.value)}
                  placeholder="e.g. supervisor.finance@agrovercity.in"
                  className="flex-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dualSignoffConfirmed}
                  onChange={(e) => setDualSignoffConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 border-amber-300 focus:ring-amber-500"
                />
                <span className="text-[11px] font-semibold text-amber-950">
                  I confirm dual-admin authorization was obtained from <span className="font-mono">{secondaryAdminUid}</span>.
                </span>
              </label>
            </div>
          )}

          {/* Compliance notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Per SOP-05 Rule 6.3, financial adjustments are recorded in immutable audit logs with admin <code className="text-emerald-950 font-bold font-mono">{currentAdmin?.email || 'root@agrovercity'}</code> signature and secondary co-sign verification.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
