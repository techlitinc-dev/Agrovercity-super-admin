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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white/95 border border-emerald-200/90 rounded-2xl shadow-2xl relative z-10 backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Temporary OTP Dispatched</h3>
                <span className="text-xs text-emerald-800 font-mono font-medium">SOP-01 Emergency MPIN Protocol</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              The existing MPIN for <strong>{user.name}</strong> was invalidated. A temporary one-time passcode was generated and dispatched via the SMS gateway to their verified phone.
            </p>

            {/* OTP Display Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300/80 text-center relative overflow-hidden shadow-xs">
              <span className="text-[11px] uppercase tracking-widest text-emerald-950 font-bold block mb-1">
                Emergency Temporary OTP
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-800 py-1">
                {temporaryOtp || '741892'}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Valid for 15 minutes</span>
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-200/80 transition-colors flex items-center gap-1 font-mono shadow-2xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  <span>{copied ? 'Copied' : 'Copy OTP'}</span>
                </button>
              </div>
            </div>

            {/* Dispatch details */}
            <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200/80 text-xs space-y-1.5 font-mono text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination Phone:</span>
                <span className="text-emerald-900 font-bold">{user.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Provider:</span>
                <span className="font-semibold text-slate-800">MSG91 / NIC Telecom</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Status:</span>
                <span className="text-emerald-800 font-bold">Logged to audit_logs</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-colors"
            >
              Done & Return to Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
