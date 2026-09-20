import React, { useState } from 'react';
import { KeyRound, Check, Copy, Clock, Smartphone, ShieldCheck, X } from 'lucide-react';

export function OtpDispatchModal({ isOpen, onClose, user, temporaryOtp }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(temporaryOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Temporary OTP Dispatched</h3>
                <span className="text-xs text-emerald-400 font-mono">SOP-01 Emergency MPIN Protocol</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              The existing MPIN for <strong>{user.name}</strong> was invalidated. A temporary one-time passcode was generated and dispatched via the SMS gateway to their verified phone.
            </p>

            {/* OTP Display Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 text-center relative overflow-hidden">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                Emergency Temporary OTP
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-400 py-1">
                {temporaryOtp || '741892'}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Valid for 15 minutes</span>
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy OTP'}</span>
                </button>
              </div>
            </div>

            {/* Dispatch details */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination Phone:</span>
                <span className="text-emerald-400 font-bold">{user.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Provider:</span>
                <span>MSG91 / NIC Telecom</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Status:</span>
                <span className="text-emerald-400">Logged to audit_logs</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition-colors"
            >
              Done & Return to Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
