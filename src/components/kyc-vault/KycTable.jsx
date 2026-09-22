import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Lock,
  Eye,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Wheat,
  Home,
  Truck,
  Store,
  Tractor,
  Scale
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function KycTable({
  items = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectItem,
  onApproveItem,
  onRejectItem,
  loading = false,
  selectedIds = [],
  setSelectedIds
}) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Ticket ${id} copied to clipboard`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Helper for persona icon
  const getPersonaIcon = (p) => {
    switch (p) {
      case 'Farmer': return Wheat;
      case 'Landlord': return Home;
      case 'Transporter': return Truck;
      case 'Seller': return Store;
      case 'Equipment Owner': return Tractor;
      case 'Broker': return Scale;
      default: return FileText;
    }
  };

  // Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Verified & Badged
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            Pending Review
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            Flagged Anomaly
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-xs">
            <XCircle className="w-3 h-3 text-slate-500" />
            Rejected
          </span>
        );
      default:
        return <span className="text-xs text-slate-600 font-medium">{status}</span>;
    }
  };

  // Match confidence score pill
  const renderMatchScore = (score) => {
    let color = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (score < 80) color = 'bg-rose-100 text-rose-900 border-rose-300';
    else if (score < 95) color = 'bg-amber-100 text-amber-900 border-amber-300';

    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${color}`}>
          {score}% Match
        </span>
        <span className="text-[10px] text-slate-500 font-mono font-semibold">
          {score >= 95 ? 'High' : score >= 80 ? 'Good' : 'Review'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">
            KYC Verification Queue (AES-256 Vault)
          </span>
          {selectedIds.length > 0 && (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold">
              {selectedIds.length} row(s) selected
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-500 font-medium">
          Showing {items.length} of {pagination.total} records
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selectedIds.length === items.length}
                  onChange={handleSelectAll}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-28">KYC ID</th>
              <th className="py-3 px-4 min-w-[190px]">Entity / User</th>
              <th className="py-3 px-4 min-w-[240px]">Document & Encryption</th>
              <th className="py-3 px-3 min-w-[130px]">OCR Match</th>
              <th className="py-3 px-3 min-w-[120px]">DPDP Redaction</th>
              <th className="py-3 px-3 min-w-[120px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold text-slate-700">Querying KYC Verification & Vault Collection...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-emerald-300" />
                    <span className="font-bold text-slate-700">No KYC Documents Found</span>
                    <span className="text-xs text-slate-500">
                      Try adjusting search filters or resetting filters.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const PersonaIcon = getPersonaIcon(item.userPersona);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onInspectItem(item)}
                    className={`group hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/80' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(item.id, e)}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* KYC Ticket ID */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{item.id}</span>
                        <button
                          onClick={(e) => handleCopyId(item.id, e)}
                          className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5"
                          title="Copy Ticket ID"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.docId}
                      </div>
                    </td>

                    {/* Entity / User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-900 shrink-0 text-xs shadow-xs">
                          {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.userName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5 font-semibold">
                              <PersonaIcon className="w-2.5 h-2.5 text-emerald-700" />
                              {item.userPersona}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.userMobile}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {item.userCity}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Document Title & Encryption */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {item.docName}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className="flex items-center gap-1 text-emerald-800 font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                            <Lock className="w-2.5 h-2.5 text-emerald-700" />
                            {item.encryptionStatus?.split(' ')[0] || 'AES-256'}
                          </span>
                          <span className="text-slate-500 font-mono font-medium">{item.fileSize}</span>
                          <span className="text-slate-400 font-mono uppercase">{item.mimeType?.split('/')[1]}</span>
                        </div>
                      </div>
                    </td>

                    {/* OCR Match Score */}
                    <td className="py-3 px-3">
                      {renderMatchScore(item.ocrConfidenceScore)}
                    </td>

                    {/* DPDP Masking Status */}
                    <td className="py-3 px-3">
                      {item.dpdpComplianceStatus === 'verified_masked' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          Masked PASS
                        </span>
                      ) : item.dpdpComplianceStatus === 'unmasked_alert' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          <ShieldAlert className="w-3 h-3 text-rose-700" />
                          Redact Alert
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono font-medium">
                          N/A (Non-ID)
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Side-by-side inspect */}
                        <button
                          onClick={() => onInspectItem(item)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-lg transition-colors shadow-xs"
                          title="Open Side-by-Side OCR comparison & Document Viewer"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700 group-hover:text-white" />
                          <span>Review</span>
                        </button>

                        {/* Quick Approve (if pending) */}
                        {item.status === 'pending' && (
                          <button
                            onClick={() => onApproveItem(item)}
                            className="p-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                            title="Approve & Issue Verified Badge"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Quick Reject (if pending) */}
                        {item.status === 'pending' && (
                          <button
                            onClick={() => onRejectItem(item)}
                            className="p-1.5 text-xs text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg shadow-xs transition-colors"
                            title="Reject with mandatory reason"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-emerald-50/30 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="font-mono text-[11px] font-medium">
          Showing {items.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200 shadow-xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
