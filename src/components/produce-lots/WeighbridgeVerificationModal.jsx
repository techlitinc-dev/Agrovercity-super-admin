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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Weighbridge Slip Attestation</span>
                <span className="text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded">
                  SOP-05 Rule 3.3
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Lot: <span className="font-mono text-slate-200 font-semibold">{lot.id}</span> ({lot.commodity} - {lot.farmerName})
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

          {/* Weight Comparison Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Declared by Farmer</span>
                <span className="text-xs font-bold text-white">{lot.quantityQtl} Qtl ({declaredWeightKg.toLocaleString('en-IN')} kg)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Weighbridge Net</span>
                <span className="text-xs font-bold text-teal-400">{(currentNetKg / 100).toFixed(1)} Qtl ({currentNetKg.toLocaleString('en-IN')} kg)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Variance</span>
                <span className={`text-xs font-bold ${Math.abs(variancePercent) > 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
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
                  ? 'bg-teal-950/50 border-teal-500 text-teal-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${verified ? 'text-teal-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-xs">Verify & Attest</div>
                <div className="text-[10px] text-slate-400">Valid weighbridge slip</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVerified(false)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                !verified
                  ? 'bg-rose-950/50 border-rose-500 text-rose-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <XCircle className={`w-4 h-4 ${!verified ? 'text-rose-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-xs">Reject Slip</div>
                <div className="text-[10px] text-slate-400">Flag weight discrepancy</div>
              </div>
            </button>
          </div>

          {/* Slip Number & Net Weight Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Weighbridge Slip Serial #
              </label>
              <input
                type="text"
                value={slipNumber}
                onChange={(e) => setSlipNumber(e.target.value)}
                placeholder="WB-KOP-8841"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Net Weight (Kilograms - kg)
              </label>
              <input
                type="number"
                value={netWeightKg}
                onChange={(e) => setNetWeightKg(e.target.value)}
                placeholder="12000"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Audit Justification */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
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
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />

            {/* Presets */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_REASONS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(p)}
                  className="text-[10px] bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 text-left"
                >
                  + {p.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions Footer */}
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
                verified ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-950/50' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
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
