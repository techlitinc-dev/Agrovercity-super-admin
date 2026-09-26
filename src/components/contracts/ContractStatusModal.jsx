import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { STATUS_LABELS } from '../StatusBadge.jsx';

export function ContractStatusModal({
  isOpen,
  onClose,
  contract,
  targetStatus,
  onConfirm,
  loading = false
}) {
  const [reason, setReason] = useState('');

  if (!isOpen || !contract) return null;

  const statusLabel = STATUS_LABELS[targetStatus] || targetStatus;
  const isDestructive = ['cancelled', 'breached', 'disputed'].includes(targetStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      alert('Administrative justification (min 8 characters) is required.');
      return;
    }
    onConfirm({
      contractId: contract.id,
      status: targetStatus,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full border border-emerald-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDestructive
              ? 'bg-rose-50 border-rose-100 text-rose-950'
              : 'bg-emerald-50 border-emerald-100 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${isDestructive ? 'bg-rose-600' : 'bg-emerald-600'}`}>
              {isDestructive ? <AlertTriangle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-black">
                Transition to “{statusLabel}”
              </h2>
              <p className="text-xs opacity-70 font-medium">Contract #{contract.id}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="font-bold text-slate-900">{contract.buyerName}</div>
            <div className="text-[11px] text-slate-600">
              Farmer: <strong className="text-slate-800">{contract.farmerName}</strong> · Commodity: <strong className="text-slate-800">{contract.quantityQuintals}q {contract.crop}</strong>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Current State: <span className="font-bold uppercase text-slate-700">{contract.status}</span> &rarr; Target: <span className="font-bold uppercase text-emerald-800">{targetStatus}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Administrative Justification (Mandatory)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State fulfillment verification, logistics milestone, or reason for state transition..."
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              required
            />
            <div className="text-[10px] text-slate-400 mt-0.5">
              Minimum 8 characters. Written to statutory audit logs.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
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
              className={`px-5 py-2 font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-white ${
                isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Updating...' : `Confirm ${statusLabel}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
