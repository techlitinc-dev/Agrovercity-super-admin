import React from 'react';
import {
  UploadCloud,
  Unlock,
  Eye,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { StatusBadge, STATUS_LABELS } from '../StatusBadge.jsx';
import { fmtRupees } from '../../lib/format.js';

export function BuyerContractsTable({
  contracts = [],
  sort = { key: 'createdAt', dir: 'desc' },
  onSort,
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onView,
  onPublish,
  onReleaseEscrow,
  onStatusChange,
  loading = false
}) {
  const columns = [
    { key: 'id', label: 'Contract ID' },
    { key: 'buyerName', label: 'Corporate Buyer × Farmer' },
    { key: 'crop', label: 'Commodity & Locked Rate' },
    { key: 'escrowAmount', label: 'Escrow Status' },
    { key: 'deliveryDate', label: 'Delivery Milestone' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const arrow = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '');

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => ['id', 'buyerName', 'crop', 'escrowAmount', 'deliveryDate', 'status'].includes(col.key) && onSort && onSort(col.key)}
                  className={`py-3 px-4 ${['id', 'buyerName', 'crop', 'escrowAmount', 'deliveryDate', 'status'].includes(col.key) ? 'cursor-pointer select-none hover:text-emerald-800' : ''} ${col.key === 'actions' ? 'text-right' : ''}`}
                >
                  {col.label}{arrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading buyer contracts...</span>
                  </div>
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <FileText className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Buyer Contracts Found</span>
                    <span className="text-xs text-slate-400">No contracts match the current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              contracts.map((c) => {
                const escrowRemaining = (c.escrowAmount || 0) - (c.escrowReleased || 0);
                const canPublish = ['draft', 'pending_review'].includes(c.status);
                const canRelease = ['active', 'fulfilled'].includes(c.status) && escrowRemaining > 0;
                const percentReleased = c.escrowAmount ? Math.min(100, Math.round(((c.escrowReleased || 0) / c.escrowAmount) * 100)) : 0;

                return (
                  <tr key={c.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded text-[11px]">
                        #{c.id}
                      </span>
                      <div className="text-[10px] text-slate-400 font-sans mt-1">
                        {c.createdAt?.slice(0, 10)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.buyerName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {c.farmerName} · <span className="font-mono text-slate-400">{c.farmerPhone?.replace(/^(\+91\s?\d{2})\d{4}(\d{2})/, '$1••••$2')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {c.farmerDistrict || 'Maharashtra'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {c.quantityQuintals}q {c.crop}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {fmtRupees(c.ratePerQuintal)}/q
                        </span>
                        {c.premiumOverMspPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                            <TrendingUp className="w-2.5 h-2.5" />
                            +{c.premiumOverMspPercent}% MSP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs" title={c.grade}>
                        {c.variety || c.grade}
                      </div>
                    </td>

                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-800">{fmtRupees(c.escrowAmount)}</span>
                        <span className="text-slate-500 font-semibold">{percentReleased}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-200">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${percentReleased}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Released: {fmtRupees(c.escrowReleased)}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      <div>{c.deliveryDate || '—'}</div>
                      <div className="text-[10px] font-sans text-slate-400 truncate max-w-xs" title={c.deliveryHub}>
                        {c.deliveryHub || 'Regional APMC Silo'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <StatusBadge status={c.status} />
                        {c.flagged && (
                          <span title={c.disputeReason || 'Disputed'} className="text-rose-600 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {canPublish && (
                          <button
                            onClick={() => onPublish && onPublish(c)}
                            className="px-2 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Publish contract to farmers"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Publish</span>
                          </button>
                        )}

                        {canRelease && (
                          <button
                            onClick={() => onReleaseEscrow && onReleaseEscrow(c, escrowRemaining)}
                            className="px-2 py-1 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Release Escrow Funds to Farmer"
                          >
                            <Unlock className="w-3 h-3 text-blue-700" />
                            <span>Release</span>
                          </button>
                        )}

                        <button
                          onClick={() => onView && onView(c)}
                          className="px-2 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-emerald-100/70 bg-emerald-50/20 text-xs">
          <span className="text-slate-500 font-medium">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total contracts)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
