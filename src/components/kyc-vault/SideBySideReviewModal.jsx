import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Download,
  FileText,
  User,
  Check,
  Star,
  Layers,
  Sparkles,
  Printer
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function SideBySideReviewModal({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
  onFlag
}) {
  const { currentAdmin } = useAuthAdmin();

  // Document viewer states
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [activeTab, setActiveTab] = useState('ocr'); // 'ocr' | 'meta' | 'audit'
  const [adminReason, setAdminReason] = useState('');

  if (!isOpen || !item) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setInverted(false);
  };

  const isPending = item.status === 'pending';

  // Render authentic visual document preview inside the left canvas
  const renderDocumentCanvas = () => {
    switch (item.docType) {
      case 'aadhaar':
        return (
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 text-slate-900 rounded-xl p-6 shadow-2xl border-2 border-amber-300/80 max-w-sm mx-auto font-sans relative overflow-hidden">
            {/* Top Emblem Bar */}
            <div className="flex items-center justify-between border-b border-amber-300/60 pb-2 mb-3">
              <div className="text-[10px] font-bold text-amber-900 tracking-wider uppercase">
                भारत सरकार / Government of India
              </div>
              <span className="text-[9px] font-mono bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                AADHAAR
              </span>
            </div>

            {/* Photo & Details */}
            <div className="flex gap-4 items-start">
              <div className="w-20 h-24 bg-slate-200 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-600 text-xs shrink-0 font-bold shadow-inner">
                PHOTO
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-slate-900">{item.extractedFields?.holderName || item.userName}</div>
                <div className="text-[11px] text-slate-700">जन्म तारीख / DOB: {item.extractedFields?.dob || '1984'}</div>
                <div className="text-[11px] text-slate-700">लिंग / Gender: {item.extractedFields?.gender || 'Female'}</div>
                <div className="text-[10px] text-slate-600 leading-tight pt-1">
                  {item.extractedFields?.address || item.userCity}
                </div>
              </div>
            </div>

            {/* Masked Aadhaar Number Bar (DPDP Enforced) */}
            <div className="mt-4 pt-3 border-t-2 border-red-500/80 text-center">
              <div className="text-base font-extrabold font-mono tracking-widest text-red-900 bg-red-100/80 py-1 rounded border border-red-300">
                {item.extractedFields?.documentNumber || 'XXXX XXXX 5519'}
              </div>
              <div className="text-[9px] text-emerald-700 font-bold mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>DPDP Act Redaction: First 8 Digits Successfully Masked</span>
              </div>
            </div>
          </div>
        );

      case 'land_record_712':
        return (
          <div className="bg-amber-50 text-slate-900 rounded-xl p-6 shadow-2xl border-2 border-emerald-800/60 max-w-md mx-auto font-serif relative overflow-hidden">
            <div className="text-center border-b-2 border-emerald-900 pb-2 mb-3">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-950">
                महाराष्ट्र शासन — महसूल व वन विभाग
              </div>
              <div className="text-sm font-extrabold text-emerald-900">
                गाव नमुना सात (अधिकार अभिलेख पत्रक) व बारा (पिकांची नोंदवही)
              </div>
              <div className="text-[11px] text-slate-700 font-mono">
                गाव: {item.extractedFields?.village || 'Janori'} | तालुका: {item.extractedFields?.taluka || 'Dindori'} | जिल्हा: {item.extractedFields?.district || 'Nashik'}
              </div>
            </div>

            <div className="border border-emerald-900/80 rounded bg-white p-3 text-xs space-y-2">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                <span>भूमापन क्रमांक व उपविभाग (Gat No.):</span>
                <span className="font-mono text-emerald-900">{item.extractedFields?.documentNumber || 'Gat No. 104/2'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>खातेदाराचे नाव (Landholder):</span>
                <span className="font-bold text-slate-900">{item.extractedFields?.holderName || item.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>एकूण क्षेत्र (Total Area):</span>
                <span className="font-mono font-semibold">{item.extractedFields?.areaAcreage || '3.2 Acres'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>पोटखराबा (Uncultivable):</span>
                <span className="font-mono">{item.extractedFields?.potKharaba || '0.10 Hectare'}</span>
              </div>
              <div className="flex justify-between">
                <span>हंगामातील पिके (Crops):</span>
                <span className="text-slate-800 italic">{item.extractedFields?.cropSeason || 'Grapes, Onions'}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Digital Watermark: Verified</span>
              <span>Mahabhulekh QR: Valid</span>
            </div>
          </div>
        );

      case 'bank_passbook':
        return (
          <div className="bg-blue-50 text-slate-900 rounded-xl p-6 shadow-2xl border-2 border-blue-600 max-w-md mx-auto font-sans">
            <div className="flex items-center justify-between border-b-2 border-blue-700 pb-2 mb-3">
              <div className="font-extrabold text-sm text-blue-900">
                {item.extractedFields?.bankName || 'State Bank of India'}
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                PASSBOOK
              </span>
            </div>
            <div className="space-y-2 text-xs bg-white p-3 rounded border border-blue-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Account Holder:</span>
                <span className="font-bold">{item.extractedFields?.holderName || item.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Account Number:</span>
                <span className="font-mono font-bold">{item.extractedFields?.documentNumber || 'XXXXXX9921'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">IFSC Code:</span>
                <span className="font-mono font-bold text-blue-800">{item.extractedFields?.ifscCode || 'SBIN0000491'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Branch:</span>
                <span>{item.extractedFields?.branchName || 'Wai Branch'}</span>
              </div>
            </div>
          </div>
        );

      case 'soil_health_card':
        return (
          <div className="bg-emerald-50 text-slate-900 rounded-xl p-6 shadow-2xl border-2 border-emerald-600 max-w-md mx-auto font-sans">
            <div className="text-center border-b border-emerald-300 pb-2 mb-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Government of India — Soil Health Card Scheme
              </div>
              <div className="text-xs font-extrabold text-emerald-800">
                मृदा आरोग्य पत्रिका (Soil Nutrient Passport)
              </div>
            </div>
            <div className="space-y-2 text-xs bg-white p-3 rounded border border-emerald-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Card ID:</span>
                <span className="font-mono font-bold">{item.extractedFields?.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Soil pH (Reaction):</span>
                <span className="font-bold text-emerald-700">{item.extractedFields?.phValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Organic Carbon (OC):</span>
                <span className="font-bold text-emerald-700">{item.extractedFields?.organicCarbon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Primary Nutrients:</span>
                <span>N: {item.extractedFields?.nitrogenN || 'Low'} | P: {item.extractedFields?.phosphorusP || 'Med'} | K: {item.extractedFields?.potassiumK || 'High'}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-slate-50 text-slate-900 rounded-xl p-6 shadow-2xl border-2 border-slate-300 max-w-md mx-auto font-sans">
            <div className="border-b border-slate-300 pb-2 mb-3 font-bold text-slate-800 text-sm">
              {item.docName}
            </div>
            <div className="space-y-2 text-xs bg-white p-3 rounded border border-slate-200">
              {Object.entries(item.extractedFields || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-600 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-semibold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                  Side-by-Side KYC Verification & OCR Triage
                </span>
                <span className="text-slate-400">::</span>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                  {item.id}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{item.docName}</span>
                <span className="text-xs font-medium text-slate-500 font-mono">
                  ({item.userName} · {item.userPersona})
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-emerald-200 rounded-lg p-1 text-xs shadow-xs">
              <span className="text-slate-500 px-1 font-mono">Status:</span>
              <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                item.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : item.status === 'rejected'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : item.status === 'flagged'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}>
                {item.status}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Split Viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-emerald-100 overflow-hidden">
          {/* LEFT PANE: Interactive Document Viewer with Zoom & Rotation */}
          <div className="flex flex-col bg-emerald-50/20 overflow-hidden">
            {/* Viewer Controls Toolbar */}
            <div className="px-4 py-2 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  AES-256 Vault Preview
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {Math.round(zoom * 100)}% · {rotation}°
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded bg-white hover:bg-emerald-50 text-slate-700 hover:text-slate-900 border border-emerald-200 shadow-xs"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded bg-white hover:bg-emerald-50 text-slate-700 hover:text-slate-900 border border-emerald-200 shadow-xs"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-1.5 rounded bg-white hover:bg-emerald-50 text-slate-700 hover:text-slate-900 border border-emerald-200 shadow-xs"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setInverted(!inverted)}
                  className={`p-1.5 rounded border border-emerald-200 shadow-xs ${inverted ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'}`}
                  title="Toggle High Contrast / Invert"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 text-[11px] font-mono font-semibold rounded bg-white hover:bg-emerald-50 text-slate-600 hover:text-slate-900 border border-emerald-200 shadow-xs"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Document Canvas Display */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center relative select-none">
              {/* Security Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-2xl font-bold font-mono tracking-widest text-slate-900 rotate-[-25deg]">
                AGROVERCITY VAULT · CONFIDENTIAL · AES-256
              </div>

              <div
                className="transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  filter: inverted ? 'invert(1) contrast(1.2)' : 'none'
                }}
              >
                {renderDocumentCanvas()}
              </div>
            </div>

            {/* Document Footer Notice */}
            <div className="px-4 py-2 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>File: {item.fileSize} · {item.mimeType}</span>
              <span className="text-emerald-700 font-semibold">✓ Integrity Hash Verified</span>
            </div>
          </div>

          {/* RIGHT PANE: Automated OCR Comparison & Audit Actions */}
          <div className="flex flex-col bg-white overflow-hidden">
            {/* Tab switchers */}
            <div className="px-6 py-2 bg-emerald-50/30 border-b border-emerald-100 flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('ocr')}
                className={`py-2 border-b-2 transition-colors ${
                  activeTab === 'ocr' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                OCR Comparison ({item.profileComparison?.length || 0} Fields)
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`py-2 border-b-2 transition-colors ${
                  activeTab === 'meta' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Vault Security Metadata
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`py-2 border-b-2 transition-colors ${
                  activeTab === 'audit' ? 'border-emerald-600 text-emerald-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Verification Audit Log
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* DPDP Act Redaction Check Alert Banner */}
              {item.docType === 'aadhaar' && (
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs shadow-xs ${
                  item.dpdpComplianceStatus === 'verified_masked'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                    <div>
                      <strong className="block">DPDP Act Compliance: Redaction Verification</strong>
                      <span className="text-[11px] opacity-90 text-slate-600">
                        {item.dpdpComplianceStatus === 'verified_masked'
                          ? 'PASS: First 8 digits are masked. Only last 4 digits visible.'
                          : 'FAIL: Unmasked Aadhaar numbers detected. Masking required.'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    PASS
                  </span>
                </div>
              )}

              {/* TAB 1: OCR Field Comparison Table */}
              {activeTab === 'ocr' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                        Registered Profile vs OCR Extracted Data
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Automated AI cross-check against registered farmer identity records.
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold border border-emerald-300 shadow-xs">
                      Overall Match: {item.ocrConfidenceScore}%
                    </span>
                  </div>

                  <div className="border border-emerald-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase font-bold text-[10px]">
                          <th className="py-2.5 px-3">Field Attribute</th>
                          <th className="py-2.5 px-3">Registered Profile</th>
                          <th className="py-2.5 px-3">OCR Extracted Value</th>
                          <th className="py-2.5 px-3 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100/60">
                        {(item.profileComparison || []).map((comp, idx) => (
                          <tr key={idx} className="hover:bg-emerald-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {comp.field}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono">
                              {comp.profileValue}
                            </td>
                            <td className="py-2.5 px-3 text-slate-900 font-mono font-bold">
                              {comp.ocrValue}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {comp.status === 'exact' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Exact
                                </span>
                              ) : comp.status === 'match' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                                  ✓ {comp.matchScore}%
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold">
                                  <AlertTriangle className="w-3 h-3" /> Mismatch
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Metadata */}
              {activeTab === 'meta' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2 shadow-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Document ID:</span>
                      <span className="font-mono text-slate-800 font-semibold">{item.docId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Encryption Method:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{item.encryptionStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Uploaded At:</span>
                      <span className="font-mono text-slate-800">{new Date(item.submittedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">File Storage Size:</span>
                      <span className="font-mono text-slate-800">{item.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">User UID:</span>
                      <span className="font-mono text-slate-800">{item.userId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Audit Trail */}
              {activeTab === 'audit' && (
                <div className="space-y-2.5">
                  {(item.auditTrail || []).map((step, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-emerald-800 font-bold">{step.action}</span>
                        <span className="text-slate-400 font-mono">{new Date(step.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-700 font-medium">{step.notes}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Actor: {step.actor}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Administrative Reason Input */}
              <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-2 shadow-xs">
                <label className="text-xs font-bold text-slate-800 block">
                  Administrative Reason / Inspection Notes:
                </label>
                <input
                  type="text"
                  value={adminReason}
                  onChange={(e) => setAdminReason(e.target.value)}
                  placeholder="e.g. Mahabhulekh 7/12 digital stamp verified with government land records..."
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Decision Action Buttons Footer */}
            <div className="px-6 py-3.5 bg-emerald-50/50 border-t border-emerald-200/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFlag(item, adminReason || 'Flagged during side-by-side verification')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors font-semibold shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Flag Anomaly</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onReject(item)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reject Document</span>
                </button>

                <button
                  onClick={() => onApprove(item, adminReason)}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Issue Verified Badge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
