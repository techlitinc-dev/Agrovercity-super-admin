import React, { useState } from 'react';
import { X, Gavel, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';

export function DisputeArbitrationModal({
  isOpen,
  onClose,
  contract,
  onConfirm,
  loading = false
}) {
  const [resolution, setResolution] = useState('split_settlement');
  const [rationale, setRationale] = useState('');
  const [settlementAmount, setSettlementAmount] = useState('');

  if (!isOpen || !contract) return null;

  const escrowRemaining = (contract.escrowAmount || 0) - (contract.escrowReleased || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rationale.trim() || rationale.trim().length < 12) {
      alert('Statutory arbitration rationale (min 12 characters) is mandatory.');
      return;
    }
    onConfirm({
      contractId: contract.id,
      resolution,
      settlementAmount: settlementAmount ? Number(settlementAmount) : escrowRemaining,
      rationale: rationale.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-rose-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-xs">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-rose-950">
                Arbitrate Contract Dispute #{contract.id}
              </h2>
              <p className="text-xs text-rose-700 font-medium">
                SOP-07 §3: Binding superadmin dispute arbitration & escrow allocation
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

        {/* Dispute Summary Card */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{contract.buyerName}</span>
              <span className="font-mono text-emerald-800 font-bold">{fmtRupees(contract.escrowAmount)}</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Farmer: <strong className="text-slate-900">{contract.farmerName}</strong> · Commodity: <strong className="text-slate-900">{contract.quantityQuintals}q {contract.crop}</strong>
            </div>
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] font-medium flex items-start gap-1.5 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{contract.disputeReason || 'Unresolved contractual dispute between institutional buyer and farmer.'}</span>
            </div>
          </div>

          {/* Arbitration Resolution Options */}
          <div>
            <label className="block text-slate-800 font-bold mb-1.5">Superadmin Arbitration Ruling</label>
            <div className="space-y-2">
              {[
                {
                  id: 'release_to_farmer',
                  label: 'Release 100% Escrow to Farmer',
                  sub: 'Dismiss buyer dispute claim. Farmer produce verified within acceptable tolerance specifications.'
                },
                {
                  id: 'split_settlement',
                  label: 'Discounted Split Settlement',
                  sub: 'Penalize moisture / grade variance but release adjusted compensation to farmer; remainder refunded.'
                },
                {
                  id: 'refund_buyer',
                  label: 'Cancel Contract & Full Escrow Refund to Buyer',
                  sub: 'Uphold buyer claim for material quality default or delivery deadline breach.'
                },
                {
                  id: 'penalize_buyer',
                  label: 'Uphold Farmer Right & Flag Corporate Buyer Breach',
                  sub: 'Enforce price-lock commitment, penalize wrongful rejection by institutional buyer.'
                }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    resolution === opt.id
                      ? 'bg-rose-50/60 border-rose-300 text-rose-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="arbitration_choice"
                    value={opt.id}
                    checked={resolution === opt.id}
                    onChange={(e) => setResolution(e.target.value)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Adjusted Payout Amount (if split settlement) */}
          {resolution === 'split_settlement' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">Settlement Payout to Farmer (₹)</label>
              <input
                type="number"
                max={escrowRemaining}
                placeholder={`Max remaining: ${escrowRemaining}`}
                value={settlementAmount}
                onChange={(e) => setSettlementAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          )}

          {/* Mandatory Rationale */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Binding Arbitration Verdict & Legal Justification (Mandatory)
            </label>
            <textarea
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="State the findings of quality testing, APMC weighment slips, transit evidence, and rationale for this binding determination..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              required
            />
            <div className="text-[10px] text-slate-400 mt-0.5">
              Minimum 12 characters. Written to statutory audit logs and visible to both parties.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Gavel className="w-4 h-4" />
              <span>{loading ? 'Committing Verdict...' : 'Issue Binding Ruling'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
