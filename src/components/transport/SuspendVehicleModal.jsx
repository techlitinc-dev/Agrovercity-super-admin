import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Truck,
  XCircle
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function SuspendVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const isSuspended = vehicle?.status === 'suspended';

  useEffect(() => {
    if (isOpen && vehicle) {
      setReason('');
      setError('');
    }
  }, [isOpen, vehicle]);

  if (!isOpen || !vehicle) return null;

  const PRESET_REASONS = [
    'Fitness certificate expired; vehicle barred from commercial freight carriage under MV Act Section 56.',
    'Repeated customer complaints of trip no-shows and fare overcharging during live dispatch.',
    'Vehicle photographed at pickup mismatched with registered RC book details; suspected impersonation.',
    'Transporter requested temporary delisting for seasonal maintenance downtime.'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Administrative explanation (minimum 8 characters) is required.');
      return;
    }

    onConfirm({
      vehicleId: vehicle.id,
      suspended: !isSuspended,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isSuspended
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              }`}
            >
              {isSuspended ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isSuspended ? 'Reinstate Vehicle for Dispatch' : 'Remove Vehicle from Dispatch'}</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-08 Rule 3.2
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {vehicle.registrationNumber} • {vehicle.transporterName}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Status info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-white font-bold uppercase">{vehicle.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Action:</span>
              <span className={isSuspended ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isSuspended ? 'REINSTATE TO LIVE DISPATCH' : 'PULL FROM LIVE DISPATCH'}
              </span>
            </div>
          </div>

          {/* Preset Reasons */}
          {!isSuspended && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Select Standard Delisting Rationale:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {PRESET_REASONS.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setReason(p)}
                    className={`p-2 rounded-lg border cursor-pointer text-[11px] leading-relaxed transition-all ${
                      reason === p
                        ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Administrative Justification (Mandatory) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 chars ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder={
                isSuspended
                  ? 'Reason for restoring this vehicle to live dispatch...'
                  : 'Specify why this vehicle must be pulled from the live dispatch map...'
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              This action generates an immutable record in <code className="text-slate-300 font-mono">audit_logs</code> under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSuspended
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>{isSuspended ? 'Confirm Reinstatement' : 'Confirm Delisting'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
