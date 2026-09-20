import React, { useState } from 'react';
import {
  X,
  FileText,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Eye,
  Check,
  Copy,
  Download
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function KycDetailDrawer({
  isOpen,
  onClose,
  item,
  onOpenSideBySide,
  onApprove,
  onReject
}) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'audit' | 'json'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    addToast({ title: 'Copied', message: 'Document schema copied to clipboard', type: 'info' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-teal-400">
                  {item.id}
                </span>
                <span className="text-slate-600">::</span>
                <span className="text-xs text-slate-400 font-mono">{item.docId}</span>
              </div>
              <h2 className="text-base font-bold text-white line-clamp-1">{item.docName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="px-6 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4 text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspection Summary
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'audit' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Decision Trail ({(item.auditTrail || []).length})
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'json' ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Document JSON
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Top Status & OCR Banner */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Verification State
                  </div>
                  <div className="text-base font-bold text-white capitalize mt-0.5 flex items-center gap-2">
                    <span>{item.status}</span>
                    {item.verificationBadgeIssued && (
                      <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        Badge Active
                      </span>
                    )}
                  </div>
                  {item.rejectionReason && (
                    <div className="text-xs text-rose-400 mt-1">
                      Reason: {item.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">OCR Confidence</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {item.ocrConfidenceScore}% Match
                  </div>
                </div>
              </div>

              {/* User Identity Details */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Associated Beneficiary
                </h3>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Name:</span>
                    <span className="font-bold text-slate-200">{item.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobile Number:</span>
                    <span className="font-mono text-slate-200">{item.userMobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Persona:</span>
                    <span className="text-slate-200">{item.userPersona}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200">{item.userCity}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Fields */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Extracted Document Attributes
                </h3>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
                  {Object.entries(item.extractedFields || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-0.5 border-b border-slate-900 last:border-0">
                      <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-semibold text-slate-200 font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vault Security Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px]">Encryption Status</span>
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                    <Lock className="w-3.5 h-3.5" /> AES-256-GCM
                  </span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                  <span className="text-slate-500 block text-[11px]">DPDP Act Audit</span>
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> PASS (Masked)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Decision Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {(item.auditTrail || []).map((step, i) => (
                <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-teal-400 font-bold">{step.action}</span>
                    <span className="text-slate-500 font-mono">{new Date(step.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300 font-medium">{step.notes}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Actor: {step.actor}</div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Document JSON */}
          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Enveloped Vault Document Schema</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 rounded"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy JSON</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 max-h-[420px] overflow-y-auto">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenSideBySide(item);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Side-by-Side Reviewer</span>
          </button>

          {item.status === 'pending' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onReject(item);
                }}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-semibold"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  onClose();
                  onApprove(item);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
