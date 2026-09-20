import React, { useState } from 'react';
import {
  Eye,
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function MarketLotsTable({
  lots = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectLot,
  onVerifyWeighbridge,
  onMediateDispute,
  onSuspendLot,
  loading = false,
  selectedIds = [],
  setSelectedIds
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Lot ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(lots.map((l) => l.id));
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Bidding
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <Clock className="w-3 h-3 text-amber-400" /> Under Review
          </span>
        );
      case 'deal_locked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
            <TrendingUp className="w-3 h-3 text-sky-400" /> Deal Locked
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Disputed
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-slate-400" /> Sold & Settled
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-400 border border-rose-700">
            <XCircle className="w-3 h-3" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Produce Lots Directory (market_lots)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
            {lots.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Superadmin Controls: Audit · Weighbridge Slip Attestation · Dispute Arbitration
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={lots.length > 0 && selectedIds.length === lots.length}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="py-3 px-3 w-28">Lot ID</th>
              <th className="py-3 px-4 min-w-[190px]">Farmer & Location</th>
              <th className="py-3 px-4 min-w-[190px]">Commodity & Variety</th>
              <th className="py-3 px-4 min-w-[160px]">Quantity & Reserve</th>
              <th className="py-3 px-3 min-w-[140px]">Weighbridge Status</th>
              <th className="py-3 px-3 min-w-[150px]">Highest Bid</th>
              <th className="py-3 px-3 min-w-[130px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading produce lots...</span>
                  </div>
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  No produce lots match the specified query or filters.
                </td>
              </tr>
            ) : (
              lots.map((lot) => {
                const isSelected = selectedIds.includes(lot.id);
                return (
                  <tr
                    key={lot.id}
                    onClick={() => onInspectLot(lot)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(lot.id, e)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* Lot ID */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                        <span>{lot.id}</span>
                        <button
                          onClick={(e) => handleCopyId(lot.id, e)}
                          className="text-slate-500 hover:text-emerald-400 transition-colors"
                          title="Copy Lot ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {new Date(lot.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Farmer & Location */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{lot.farmerName}</div>
                      <div className="text-[11px] text-slate-400">
                        {lot.village}, {lot.district} ({lot.state})
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {lot.farmerMobile}
                      </div>
                    </td>

                    {/* Commodity & Variety */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>{lot.commodity}</span>
                        <span className="text-[10px] font-normal text-slate-400">({lot.variety})</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium truncate max-w-[200px]">
                        {lot.qualityGrade}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Moisture: {lot.qualityParams?.moisturePercent || 'N/A'}%
                      </div>
                    </td>

                    {/* Quantity & Reserve */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white text-xs">
                        {lot.quantityQtl} Qtl ({(lot.quantityQtl / 10).toFixed(1)} MT)
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        ₹{lot.reservePrice.toLocaleString('en-IN')}/Qtl
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 font-medium">
                        Est: ₹{(lot.estimatedTotalValue || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Weighbridge Status */}
                    <td className="py-3 px-3">
                      {lot.weighbridgeSlip?.verified ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/30">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          <span>Slip Verified</span>
                        </div>
                      ) : lot.weighbridgeSlip?.slipNumber ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/30">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Slip Unverified</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          <span>No Slip Attached</span>
                        </div>
                      )}
                      {lot.weighbridgeSlip?.slipNumber && (
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          {lot.weighbridgeSlip.slipNumber}
                        </span>
                      )}
                    </td>

                    {/* Highest Bid */}
                    <td className="py-3 px-3">
                      {lot.highestBid ? (
                        <div>
                          <div className="font-mono font-bold text-emerald-400 text-xs">
                            ₹{lot.highestBid.bidPrice.toLocaleString('en-IN')}/Qtl
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                            {lot.highestBid.tradeFirm}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {lot.bidsCount} bids submitted
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">No bids yet</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {getStatusBadge(lot.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectLot(lot)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                          title="Inspect full lot dossier and quality assay"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>Review</span>
                        </button>

                        <button
                          onClick={() => onVerifyWeighbridge(lot)}
                          className="p-1 text-xs text-teal-400 hover:text-white bg-teal-950/60 hover:bg-teal-600 border border-teal-600/40 rounded-md transition-colors"
                          title="Verify Weighbridge Slip"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        {lot.status === 'disputed' && (
                          <button
                            onClick={() => onMediateDispute(lot)}
                            className="p-1 text-xs text-amber-400 hover:text-white bg-amber-950/60 hover:bg-amber-600 border border-amber-600/40 rounded-md transition-colors"
                            title="Mediate B2B Dispute"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onSuspendLot(lot)}
                          className={`p-1 text-xs rounded-md transition-colors ${
                            lot.status === 'suspended'
                              ? 'text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-600 border border-emerald-600/40'
                              : 'text-rose-400 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40'
                          }`}
                          title={lot.status === 'suspended' ? 'Reinstate Lot' : 'Suspend / Takedown Listing'}
                        >
                          <XCircle className="w-3.5 h-3.5" />
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

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {lots.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} lots
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
