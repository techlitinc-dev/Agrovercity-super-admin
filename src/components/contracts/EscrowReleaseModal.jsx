import React, { useState } from 'react';
import { X, Unlock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';

export function EscrowReleaseModal({
  isOpen,
  onClose,
  contract,
  onConfirm,
  loading = false
}) {
  const [releaseAmount, setReleaseAmount] = useState('');
  const [trancheNote, setTrancheNote] = useState('Tranche 2: Delivery & Final Weighment Acceptance');
  const [reason, setReason] = useState('');
  const [dualAdminSignOff, setDualAdminSignOff] = useState(false);
  const [dualAdminEmail, setDualAdminEmail] = useState('suresh.finance@agrovercity.in');

  if (!isOpen || !contract) return null;

  const remaining = (contract.escrowAmount || 0) - (contract.escrowReleased || 0);
  const currentAmount = Number(releaseAmount) || remaining;
  const isHighValue = currentAmount > 50000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      alert('Administrative justification (min 8 characters) is required.');
      return;
    }
    if (isHighValue && !dualAdminSignOff) {
      alert('Compliance Rule 6.3: Escrow payouts exceeding ₹50,000 mandate Dual-Admin verification.');
      return;
    }
    onConfirm({
      contractId: contract.id,
      amount: currentAmount,
      trancheNote,
      reason: reason.trim(),
      dualAdminSignOff: isHighValue ? dualAdminSignOff : false,
      dualAdminUid: isHighValue ? dualAdminEmail : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Release Escrow Funds #{contract.id}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                SOP-07 §3: Milestone payout release from buyer corporate escrow to farmer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Financial Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Corporate Buyer:</span>
              <span className="font-bold text-slate-900">{contract.buyerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Beneficiary Farmer:</span>
              <span className="font-bold text-slate-900">{contract.farmerName}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-500 font-medium">Total Escrow Locked:</span>
              <span className="font-mono font-bold text-slate-800">{fmtRupees(contract.escrowAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Already Released:</span>
              <span className="font-mono font-bold text-blue-700">{fmtRupees(contract.escrowReleased)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-emerald-800">
              <span>Unreleased Escrow Balance:</span>
              <span className="font-mono text-sm">{fmtRupees(remaining)}</span>
            </div>
          </div>

          {/* Amount input & presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-bold">Release Amount (₹)</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReleaseAmount(String(Math.round(remaining * 0.33)))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[10px] font-bold"
                >
                  33% (Adv)
                </button>
                <button
                  type="button"
                  onClick={() => setReleaseAmount(String(Math.round(remaining * 0.5)))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[10px] font-bold"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setReleaseAmount(String(remaining))}
                  className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-mono text-[10px] font-bold"
                >
                  100% (Full)
                </button>
              </div>
            </div>
            <input
              type="number"
              min="1"
              max={remaining}
              value={releaseAmount || remaining}
              onChange={(e) => setReleaseAmount(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Tranche / Milestone Label */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">Milestone Tranche</label>
            <input
              type="text"
              value={trancheNote}
              onChange={(e) => setTrancheNote(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Tranche 1: Sowing Input Subvention"
              required
            />
          </div>

          {/* Dual-Admin Rule 6.3 Box */}
          {isHighValue && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Rule 6.3 Mandate: Dual-Admin Co-Signer Required (&gt; ₹50,000)</span>
              </div>
              <p className="text-[10px] text-amber-800 font-medium">
                Under SOP-07 statutory governance, corporate escrow payouts exceeding ₹50,000 require concurrent verification by a secondary module admin or financial auditor.
              </p>
              <div className="pt-1">
                <label className="block text-[11px] font-bold text-amber-950 mb-0.5">Secondary Authorizing Admin UID:</label>
                <select
                  value={dualAdminEmail}
                  onChange={(e) => setDualAdminEmail(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-slate-800"
                >
                  <option value="suresh.finance@agrovercity.in">Suresh Patel (suresh.finance@agrovercity.in) · Module Admin</option>
                  <option value="deepak.audit@agrovercity.in">Deepak Shrestha (deepak.audit@agrovercity.in) · Financial Auditor</option>
                  <option value="priya.ops@agrovercity.in">Priya Nair (priya.ops@agrovercity.in) · Agri-Commerce Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-amber-950 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dualAdminSignOff}
                  onChange={(e) => setDualAdminSignOff(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  required
                />
                <span>Co-Signer Verification Attested for Release</span>
              </label>
            </div>
          )}

          {/* Mandatory Administrative Justification */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Administrative Justification (Mandatory)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State delivery fulfillment verification, gate pass #, or bank tranche rationale..."
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
            <div className="text-[10px] text-slate-400 mt-0.5">
              Minimum 8 characters. Recorded in immutable statutory audit trail.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-emerald-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>{loading ? 'Releasing Funds...' : `Release ${fmtRupees(currentAmount)}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
