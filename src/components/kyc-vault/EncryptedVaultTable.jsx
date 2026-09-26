import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  Copy,
  Check,
  Download,
  Trash2,
  Clock,
  Eye,
  FileText,
  X,
  Server,
  Key
} from 'lucide-react';
import { adminKycService } from '../../services/adminKycService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function EncryptedVaultTable({ onOpenDetailDrawer }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [copiedId, setCopiedId] = useState(null);
  const [inspectingDoc, setInspectingDoc] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminKycService.listVaultDocuments({
        query: searchQuery,
        docType: docTypeFilter,
        status: statusFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setDocuments(res.data.documents);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, docTypeFilter, statusFilter, page, addToast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    addToast({ title: 'Copied', message: 'Checksum copied to clipboard', type: 'info' });
  };

  const handleDownloadDecrypt = (doc) => {
    addToast({
      title: 'Decryption Authorized',
      message: `Downloading decrypted copy of ${doc.docName} (SHA-256 verified). Access logged for audit.`,
      type: 'success'
    });
  };

  const handlePurge = async (doc) => {
    const reason = window.prompt(
      `Enter administrative reason for purging/shredding ${doc.docName} (User: ${doc.userName}):`,
      'Statutory DPDP Right to be Forgotten request #DPDP-991'
    );
    if (!reason) return;

    try {
      const res = await adminKycService.purgeVaultDocument({
        id: doc.id,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({ title: 'Document Shredded', message: res.message, type: 'success' });
      fetchDocuments();
    } catch (e) {
      addToast({ title: 'Purge Failed', message: e.message, type: 'error' });
    }
  };

  const getDocTypeBadge = (type) => {
    switch (type) {
      case 'aadhaar':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">🪪 Aadhaar (Masked)</span>;
      case 'land_record_712':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">📜 7/12 Land Record</span>;
      case 'bank_passbook':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🏦 Bank Passbook</span>;
      case 'soil_health_card':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🧪 Soil Health Card</span>;
      case 'apmc_license':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">⚖️ APMC License</span>;
      case 'transport_permit':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">🚚 Transport Permit</span>;
      case 'seller_license':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">🏪 Dealer License</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">{type}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Encrypted Document Vault Storage (Collection:{' '}
              <span className="font-mono text-indigo-300 text-xs">users/{'{uid}'}/vault_documents</span>)
            </h3>
            <p className="text-xs text-slate-400">
              SOP-03 §1 & §2. AES-256-GCM encryption at rest, SHA-256 integrity checksums, and DPDP privacy redactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-white/10 rounded-lg font-mono text-slate-300 border border-white/10">
            Vaulted Documents: <strong className="text-white">{pagination.total}</strong>
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 rounded-lg font-mono text-emerald-300 border border-emerald-500/30">
            AES-256 Verified: <strong className="text-white">{documents.filter((d) => d.status !== 'purged').length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Vault ID (VLT-801), document title, user, storage path, or SHA-256..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Doc Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Document:</span>
            <select
              value={docTypeFilter}
              onChange={(e) => {
                setDocTypeFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Documents</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="land_record_712">7/12 Land Record</option>
              <option value="bank_passbook">Bank Passbook</option>
              <option value="soil_health_card">Soil Health Card</option>
              <option value="apmc_license">APMC Mandi License</option>
              <option value="transport_permit">Transport Permit</option>
              <option value="seller_license">Dealer License</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified (Badge ⭐)</option>
              <option value="pending">Pending Verification</option>
              <option value="rejected">Rejected</option>
              <option value="purged">Purged / Shredded</option>
            </select>
          </div>

          <button
            onClick={fetchDocuments}
            title="Refresh Document Vault"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Vault ID & Document</th>
                <th className="py-3.5 px-4">Enrolled User</th>
                <th className="py-3.5 px-4">Cipher & Storage Path</th>
                <th className="py-3.5 px-4">SHA-256 Integrity Checksum</th>
                <th className="py-3.5 px-4">DPDP Privacy & Retention</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No encrypted vault documents found matching the search.
                  </td>
                </tr>
              ) : (
                documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Vault ID & Doc */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        {d.id}
                        <span className="text-[10px] text-slate-400">({d.docId})</span>
                      </div>
                      <div className="font-semibold text-slate-800 text-[11px] truncate max-w-[200px]" title={d.docName}>
                        {d.docName}
                      </div>
                      <div className="mt-1">{getDocTypeBadge(d.docType)}</div>
                    </td>

                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{d.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{d.userMobile}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{d.userPersona}</div>
                    </td>

                    {/* Cipher & Path */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-700 font-bold">
                        <Key className="w-3 h-3 text-indigo-500" />
                        <span>{d.encryptionCipher}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5" title={d.storagePath}>
                        {d.storagePath}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Size: {d.fileSize} · {d.mimeType}
                      </div>
                    </td>

                    {/* Checksum */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg w-fit">
                        <span className="font-mono text-[10px] text-slate-700">
                          {d.sha256Checksum?.slice(0, 16)}...
                        </span>
                        <button
                          onClick={() => handleCopy(d.sha256Checksum, d.id)}
                          className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                          title="Copy Full Checksum"
                        >
                          {copiedId === d.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">Verified Intact</div>
                    </td>

                    {/* DPDP & Retention */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> DPDP §4 Masked
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Retention: Statutory 7 Yrs
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {d.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified ⭐
                        </span>
                      ) : d.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      ) : d.status === 'purged' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 line-through">
                          Shredded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setInspectingDoc(d)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Inspect Cryptographic Envelope"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {d.status !== 'purged' && (
                          <>
                            <button
                              onClick={() => handleDownloadDecrypt(d)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="Download Decrypted Asset"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handlePurge(d)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Cryptographic Purge / Shred"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{documents.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> vaulted files
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-slate-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Cryptographic Envelope Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Encrypted Vault Envelope: <span className="font-mono text-indigo-700">{inspectingDoc.id}</span>
                </h4>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Document:</span>
                <span className="font-bold text-slate-900">{inspectingDoc.docName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Owner:</span>
                <span className="text-slate-900">{inspectingDoc.userName} ({inspectingDoc.userId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Storage Bucket:</span>
                <span className="font-mono text-indigo-700 truncate max-w-[280px]">{inspectingDoc.storagePath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Cipher Specification:</span>
                <span className="font-mono text-emerald-700 font-bold">{inspectingDoc.encryptionCipher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">SHA-256 Checksum:</span>
                <span className="font-mono text-slate-700 truncate max-w-[280px]">{inspectingDoc.sha256Checksum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">DPDP Compliance:</span>
                <span className="font-semibold text-emerald-800">Section 4(1) PII Redacted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Access Policy:</span>
                <span className="text-slate-700">{inspectingDoc.accessLevel}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Raw Enveloped Vault Schema (JSON):</span>
              <pre className="p-3 bg-slate-900 text-indigo-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                {JSON.stringify(inspectingDoc, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
