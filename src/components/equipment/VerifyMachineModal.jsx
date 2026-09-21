import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  FileCheck2,
  Tractor
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function VerifyMachineModal({
  isOpen,
  onClose,
  machine,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [docs, setDocs] = useState({ rcDocument: false, insuranceDocument: false, operatorLicense: false });

  useEffect(() => {
    if (isOpen && machine) {
      setDocs({
        rcDocument: Boolean(machine.rcDocument?.verified),
        insuranceDocument: Boolean(machine.insuranceDocument?.verified),
        operatorLicense: Boolean(machine.operatorLicense?.verified)
      });
      setReason('');
      setError('');
    }
  }, [isOpen, machine]);

  if (!isOpen || !machine) return null;

  const approved = docs.rcDocument && docs.insuranceDocument && docs.operatorLicense;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Administrative verification rationale (minimum 8 characters) is required.');
      return;
    }

    onConfirm({
      equipmentId: machine.id,
      approved,
      docs,
      reason: reason.trim()
    });
  };

  const DOC_CHECKS = [
    { key: 'rcDocument', label: 'RC Document (Machine Registration)', detail: machine.rcDocument?.number },
    { key: 'insuranceDocument', label: 'Commercial Insurance Policy', detail: machine.insuranceDocument?.policyNumber },
    { key: 'operatorLicense', label: 'Operator License', detail: machine.operatorLicense?.number }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Verify Machinery Papers & Operator License</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-09 Rule 3.2
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {machine.name} • {machine.ownerName}
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

          {/* Document Verification Checkboxes */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Attest Each Document After Physical Inspection:
            </label>
            {DOC_CHECKS.map(({ key, label, detail }) => (
              <label
                key={key}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  docs[key]
                    ? 'bg-teal-950/40 border-teal-600/60'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={docs[key]}
                    onChange={(e) => setDocs({ ...docs, [key]: e.target.checked })}
                    className="rounded border-slate-600 bg-slate-900 text-teal-500 focus:ring-teal-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-slate-200 font-semibold truncate">{label}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">{detail || 'Not on record'}</div>
                  </div>
                </div>
                {docs[key] ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </label>
            ))}
          </div>

          {/* Outcome Preview */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-white font-bold uppercase">{machine.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Outcome:</span>
              <span className={approved ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {approved ? 'APPROVE FOR PUBLIC BOOKING' : 'REJECT / KEEP PENDING'}
              </span>
            </div>
          </div>

          {/* Reason Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Administrative Rationale (Mandatory) *
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
              placeholder="e.g. RC matched RTO record, insurance policy covers commercial field operations, operator license verified in person at Kolhapur depot..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                approved
                  ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-950/50'
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
                  <FileCheck2 className="w-4 h-4" />
                  <span>{approved ? 'Confirm Verification' : 'Confirm Rejection'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
