import React, { useState } from 'react'
import {
  Layers,
  FileText,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Lock,
  RefreshCw,
  Compass,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'
import { fmtAcres, StatusBadge } from '../../pages/landRecordsWidgets'

export default function LandRecordDetailDrawer({
  record,
  onClose,
  onResolveDiscrepancy,
  onRefreshPortal
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'pdf' | 'encumbrances' | 'audit' | 'json'
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  if (!record) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(record.gatNumber || record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefreshPortal(record)
    } finally {
      setRefreshing(false)
    }
  }

  const hasBankCharge = record.hasEncumbrance

  return (
    <DetailDrawer
      open={Boolean(record)}
      title={`Gat #${record.gatNumber} · ${record.recordType === '8A' ? '8-A Khate' : '7/12 Utara'}`}
      subtitle={`${record.village}, Tal. ${record.taluka}, Dist. ${record.district} (${record.sourcePortal})`}
      onClose={onClose}
    >
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2 mb-4 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Overview & Rights
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'pdf'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Official Extract PDF</span>
        </button>
        <button
          onClick={() => setActiveTab('encumbrances')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'encumbrances'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encumbrance (बोझा)</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Audit & Cache
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            activeTab === 'json'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-xs">
          {/* Status & Portal Banner */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registry Gateway Ingestion State</span>
              <StatusBadge status={record.status} />
            </div>
            <div className="flex items-center justify-between text-slate-700 font-mono text-[11px] font-semibold">
              <span>Source: {record.sourcePortal}</span>
              <span className="text-emerald-700 font-bold">OCR Confidence: {record.parsingConfidence}%</span>
            </div>

            {record.discrepancyDetails && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mt-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold">Flagged Discrepancy Note:</span>
                  <p className="text-[11px] mt-0.5 text-slate-700 font-medium">{record.discrepancyDetails}</p>
                </div>
              </div>
            )}
          </div>

          {/* Khatadar (Land Owner) Information */}
          <DrawerSection title="Owner / Khatadar Particulars (खातेदार तपशील)">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Owner Name (Marathi)" v={record.vernacularOwnerName} />
              <KeyValue k="Owner Name (English)" v={record.ownerName} />
              <KeyValue k="Khata Number" v={record.khataNumber} mono />
              <KeyValue k="Ferfar Mutation #" v={record.ferfarNumber} mono />
              <KeyValue k="Revenue Village" v={`${record.village}, Tal. ${record.taluka}`} />
              <KeyValue k="District & State" v={`${record.district}, ${record.state}`} />
            </div>
          </DrawerSection>

          {/* Area & Land Classification */}
          <DrawerSection title="Land Area & Classification (क्षेत्र व वर्ग)">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
              <KeyValue k="Total Area in Acres" v={`${record.totalAreaAcres} Acres`} mono />
              <KeyValue k="Total Area in Hectares" v={`${record.totalAreaHectares} Hectares`} mono />
              <KeyValue k="Pot Kharaba (Uncultivable)" v={`${record.potKharabaHectares || 0} Hectares`} mono />
              <KeyValue k="Land Category / Class" v={record.landClass} />
              <KeyValue k="Soil Classification" v={record.soilType} />
              <KeyValue k="Irrigation System" v={record.irrigationType} />
              <KeyValue k="Seasonal Crop History" v={record.cropHistory} />
            </div>
          </DrawerSection>

          {/* Co-Sharers (हिस्सेदार) */}
          {record.coSharers && record.coSharers.length > 0 && (
            <DrawerSection title={`Registered Co-Sharers (${record.coSharers.length} हिस्सेदार)`}>
              <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 text-xs shadow-2xs">
                {record.coSharers.map((cs, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <span className="text-slate-900 font-bold">{cs.name}</span>
                    <span className="font-mono text-emerald-700 font-bold text-[11px]">
                      Share: {cs.shareFraction}
                    </span>
                  </div>
                ))}
              </div>
            </DrawerSection>
          )}
        </div>
      )}

      {/* 2. OFFICIAL EXTRACT PDF TAB */}
      {activeTab === 'pdf' && (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-white shadow-2xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">
                Digital Maharashtra Aaple Sarkar / Mahabhulekh Extract
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Digital Signature Algorithm (SHA-256 with e-Sign)
              </span>
            </div>
            <a
              href={record.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>

          {/* Mock PDF Document Preview Container */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-lg min-h-[420px] font-serif space-y-4">
            <div className="text-center border-b pb-3 border-slate-200">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-600">
                महाराष्ट्र शासन महसूल विभाग (Government of Maharashtra Revenue Department)
              </div>
              <h2 className="text-base font-bold mt-1">
                गाव नमुना सात (अधिकार अभिलेख पत्रक) व गाव नमुना बारा (पिकांची नोंदवही)
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                गाव: {record.village} · तालुका: {record.taluka} · जिल्हा: {record.district}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-3 bg-slate-50 rounded-lg">
              <div>
                <span className="font-bold block text-slate-700">भूमापन क्रमांक / गट क्रमांक:</span>
                <span className="text-base font-bold text-emerald-800 font-mono">{record.gatNumber}</span>
              </div>
              <div className="text-right">
                <span className="font-bold block text-slate-700">खाते क्रमांक (Khata No.):</span>
                <span className="text-base font-bold text-slate-800 font-mono">{record.khataNumber}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700">भोगवटादाराचे नाव (Khatadar Name):</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{record.vernacularOwnerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700">एकूण क्षेत्र (Total Area):</span>
                  <span className="block font-mono font-bold text-slate-800">
                    {record.totalAreaHectares} हेक्टर ({record.totalAreaAcres} एकर)
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">जमिनीचे स्वरूप (Class):</span>
                  <span className="block text-slate-800 font-medium">{record.landClass}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 text-xs">
              <span className="font-bold text-slate-700">इतर हक्क व बोजा (Encumbrances & Other Rights):</span>
              <div className="mt-1 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px] font-semibold">
                {record.encumbrances}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">{record.otherRights}</p>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>e-Mahabhulekh QR Code: Verified</span>
              <span>डिजिटल स्वाक्षरी: तहसीलदार कार्यालय</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ENCUMBRANCES (बोझा) TAB */}
      {activeTab === 'encumbrances' && (
        <div className="space-y-4 text-xs">
          <div
            className={`p-3.5 rounded-xl border ${
              hasBankCharge
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {hasBankCharge ? <Lock className="w-5 h-5 shrink-0 text-amber-600" /> : <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />}
              <div>
                <span className="font-bold text-sm">
                  {hasBankCharge ? 'Active Bank Encumbrance / Charge Recorded' : 'Clean Title (बोझा निरंक)'}
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {hasBankCharge
                    ? 'Land parcel is mortgaged or hypothecated against institutional credit.'
                    : 'No pending bank loan hypothecation or court encumbrance registered in revenue ledger.'}
                </p>
              </div>
            </div>
          </div>

          <DrawerSection title="Institutional Charge Details (बोजा तपशील)">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 font-mono text-xs">
              <div className="text-slate-900 leading-relaxed font-bold">
                {record.encumbrances}
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-sans">
                Lender verification status: Confirmed via state bank charge sub-register.
              </div>
            </div>
          </DrawerSection>

          <DrawerSection title="Other Registered Rights (इतर हक्क)">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-slate-700 text-xs leading-relaxed font-medium">
              {record.otherRights || 'No other customary rights registered.'}
            </div>
          </DrawerSection>
        </div>
      )}

      {/* 4. AUDIT & CACHE TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-4 text-xs">
          <DrawerSection title="Cache & Gateway Ingestion Telemetry">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 divide-y divide-slate-100 font-mono text-xs shadow-2xs">
              <KeyValue k="Source Revenue Portal" v={record.sourcePortal} />
              <KeyValue k="Last Fetched Timestamp" v={new Date(record.lastFetchedAt).toLocaleString('en-IN')} />
              <KeyValue k="Redis L2 Cache TTL" v={`${record.cacheTtlHours} Hours`} />
              <KeyValue k="Parsing OCR Confidence" v={`${record.parsingConfidence}%`} />
              <KeyValue k="Internal Record ID" v={record.id} />
            </div>
          </DrawerSection>

          <DrawerSection title="Immutable Audit Trail">
            <div className="space-y-2">
              {record.auditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white font-mono text-[11px] space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Admin: {log.adminUid}</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                  <div className="text-slate-900 font-bold">
                    Transition: <span className="text-amber-700">{log.previousState}</span> &rarr;{' '}
                    <span className="text-emerald-700">{log.newState}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs">{log.reason}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </DrawerSection>
        </div>
      )}

      {/* 5. RAW JSON TAB */}
      {activeTab === 'json' && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <DocJson doc={record} />
        </div>
      )}

      {/* Drawer Action Footer */}
      <div className="pt-4 mt-6 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Querying...' : 'Re-sync from Portal'}</span>
          </button>

          {record.status === 'flagged_discrepancy' && (
            <button
              onClick={() => onResolveDiscrepancy(record)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
            >
              Resolve Discrepancy
            </button>
          )}

          <a
            href={record.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Official Portal URL</span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          Close
        </button>
      </div>
    </DetailDrawer>
  )
}
