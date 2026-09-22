import React from 'react';
import { ShieldCheck, FileCheck, Clock, AlertTriangle, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

export function TopMetricBar({ items = [] }) {
  const totalDocs = items.length;
  const pendingDocs = items.filter((i) => i.status === 'pending');
  const verifiedDocs = items.filter((i) => i.status === 'verified');
  const flaggedOrRejected = items.filter((i) => i.status === 'flagged' || i.status === 'rejected');
  
  // DPDP Compliance check: Aadhaar documents must be masked
  const aadhaarDocs = items.filter((i) => i.docType === 'aadhaar');
  const maskedAadhaar = aadhaarDocs.filter((i) => i.dpdpComplianceStatus === 'verified_masked').length;
  const dpdpRate = aadhaarDocs.length > 0 ? Math.round((maskedAadhaar / aadhaarDocs.length) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Vault Documents */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Vault Documents
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{totalDocs}</span>
            <span className="text-xs font-semibold text-emerald-700 font-sans">
              AES-256 at Rest
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Encrypted Credential Vault</span>
          </div>
        </div>
      </div>

      {/* 2. Pending Review Queue */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending KYC Queue
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-600 flex items-baseline gap-2">
            <span>{pendingDocs.length}</span>
            <span className="text-xs font-semibold text-slate-500 font-sans">
              Awaiting Review
            </span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Side-by-Side OCR Triage</span>
          </div>
        </div>
      </div>

      {/* 3. Verified Credentials */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Credentials
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{verifiedDocs.length}</span>
            <span className="text-xs font-semibold text-emerald-700 font-sans">
              ({totalDocs > 0 ? Math.round((verifiedDocs.length / totalDocs) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Badges Active on Profiles</span>
          </div>
        </div>
      </div>

      {/* 4. Flagged & Rejected */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Flagged & Rejected
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-rose-600 flex items-baseline gap-2">
            <span>{flaggedOrRejected.length}</span>
            <span className="text-xs font-semibold text-slate-500 font-sans">
              Action Required
            </span>
          </div>
          <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Name Mismatch / Lapsed Date</span>
          </div>
        </div>
      </div>

      {/* 5. DPDP Redaction Compliance */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            DPDP Redaction Audit
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-emerald-800 flex items-baseline gap-2">
            <span>{dpdpRate}%</span>
            <span className="text-xs font-bold text-emerald-700 font-sans">PASS</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Aadhaar Masking Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
