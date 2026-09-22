import React, { useState, useEffect } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Building2,
  FileCheck
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function WeighbridgeVerificationModal({
  isOpen,
  onClose,
  lot,
  onSave,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();

  const [verified, setVerified] = useState(true);
  const [slipNumber, setSlipNumber] = useState('');
  const [netWeightKg, setNetWeightKg] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && lot) {
      setVerified(lot.weighbridgeSlip ? lot.weighbridgeSlip.verified : true);
      setSlipNumber(lot.weighbridgeSlip?.slipNumber || `WB-${lot.district?.slice(0, 3)?.toUpperCase() || 'MND'}-${Math.floor(1000 + Math.random() * 9000)}`);
      setNetWeightKg(lot.weighbridgeSlip?.netWeightKg || (lot.quantityQtl ? lot.quantityQtl * 100 : ''));
      setReason('');
      setError('');
    }
  }, [isOpen, lot]);

  if (!isOpen || !lot) return null;

  const declaredWeightKg = (lot.quantityQtl || 0) * 100;
  const currentNetKg = Number(netWeightKg) || declaredWeightKg;
  const varianceKg = currentNetKg - declaredWeightKg;
  const variancePercent = declaredWeightKg > 0 ? parseFloat(((varianceKg / declaredWeightKg) * 100).toFixed(2)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slipNumber || !slipNumber.trim()) {
      setError('Weighbridge slip serial number is required.');
      return;
    }
    if (!netWeightKg || Number(netWeightKg) <= 0) {
      setError('Valid net weight in kilograms is required.');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Administrative audit justification (minimum 8 characters) is mandatory.');
      return;
    }

    onSave({
      lotId: lot.id,
      verified,
      slipNumber: slipNumber.trim(),
      netWeightKg: Number(netWeightKg),
      variancePercent,
      reason: reason.trim()
    });
  };

  const PRESET_REASONS = [
    'Weighbridge slip matches APMC gate register and digital scale calibration certificate.',
    'Variance within normal ±1.5% in-transit grain desiccation tolerance.',
    'Physical tare weight confirmed with APMC market yard weighbridge operator.',
    'Discrepancy detected: Weighbridge slip serial number does not exist in APMC registry.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/70 via-emerald-50/80 to-emerald-100/50 border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Weighbridge Slip Attestation</span>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full shadow-xs">
                  SOP-05 Rule 3.3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Lot: <span className="font-mono text-emerald-800 font-bold">{lot.id}</span> ({lot.commodity} - {lot.farmerName})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Weight Comparison Card */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 space-y-2 font-mono">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Declared by Farmer</span>
                <span className="text-xs font-bold text-slate-900">{lot.quantityQtl} Qtl ({declaredWeightKg.toLocaleString('en-IN')} kg)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Weighbridge Net</span>
                <span className="text-xs font-bold text-teal-700">{(currentNetKg / 100).toFixed(1)} Qtl ({currentNetKg.toLocaleString('en-IN')} kg)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Variance</span>
                <span className={`text-xs font-bold ${Math.abs(variancePercent) > 3 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {variancePercent > 0 ? `+${variancePercent}` : variancePercent}% ({varianceKg > 0 ? `+${varianceKg}` : varianceKg} kg)
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status Choice */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVerified(true)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                verified
                  ? 'bg-teal-50 border-teal-400 text-teal-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${verified ? 'text-teal-700' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold text-xs">Verify & Attest</div>
                <div className="text-[10px] text-slate-500">Valid weighbridge slip</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVerified(false)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                !verified
                  ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <XCircle className={`w-4 h-4 ${!verified ? 'text-rose-700' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold text-xs">Reject Slip</div>
                <div className="text-[10px] text-slate-500">Flag weight discrepancy</div>
              </div>
            </button>
          </div>

          {/* Slip Number & Net Weight Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Weighbridge Slip Serial #
              </label>
              <input
                type="text"
                value={slipNumber}
                onChange={(e) => setSlipNumber(e.target.value)}
                placeholder="WB-KOP-8841"
                required
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Net Weight (Kilograms - kg)
              </label>
              <input
                type="number"
                value={netWeightKg}
                onChange={(e) => setNetWeightKg(e.target.value)}
                placeholder="12000"
                required
                className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Audit Justification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-bold">
                Administrative Verification Justification *
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
              placeholder="Record reason for verification or rejection of physical slip..."
              className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />

            {/* Presets */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_REASONS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(p)}
                  className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 text-left font-medium transition-colors"
                >
                  + {p.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                verified ? 'bg-teal-600 hover:bg-teal-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording Attestation...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>{verified ? 'Attest Weighbridge Slip' : 'Record Rejection'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
