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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Active Bidding
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" /> Under Review
          </span>
        );
      case 'deal_locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-xs">
            <TrendingUp className="w-3 h-3 text-teal-600" /> Deal Locked
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-xs">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Disputed
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-slate-600" /> Sold & Settled
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
            <XCircle className="w-3 h-3 text-rose-700" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-950">Produce Lots Directory</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
            {lots.length} Records
          </span>
        </div>
        <div className="text-[11px] font-medium text-emerald-800">
          Superadmin Controls: Audit · Weighbridge Slip Attestation · Dispute Arbitration
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-50/50 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={lots.length > 0 && selectedIds.length === lots.length}
                  className="rounded border-emerald-300 bg-white text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="py-3.5 px-3 w-28">Lot ID</th>
              <th className="py-3.5 px-4 min-w-[190px]">Farmer & Location</th>
              <th className="py-3.5 px-4 min-w-[190px]">Commodity & Variety</th>
              <th className="py-3.5 px-4 min-w-[160px]">Quantity & Reserve</th>
              <th className="py-3.5 px-3 min-w-[140px]">Weighbridge Status</th>
              <th className="py-3.5 px-3 min-w-[150px]">Highest Bid</th>
              <th className="py-3.5 px-3 min-w-[130px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading produce lots...</span>
                  </div>
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
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
                    className={`hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-100/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(lot.id, e)}
                        className="rounded border-emerald-300 bg-white text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>

                    {/* Lot ID */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                        <span>{lot.id}</span>
                        <button
                          onClick={(e) => handleCopyId(lot.id, e)}
                          className="text-slate-400 hover:text-emerald-700 transition-colors"
                          title="Copy Lot ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 block font-medium">
                        {new Date(lot.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Farmer & Location */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{lot.farmerName}</div>
                      <div className="text-[11px] text-slate-600">
                        {lot.village}, {lot.district} ({lot.state})
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {lot.farmerMobile}
                      </div>
                    </td>

                    {/* Commodity & Variety */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <span>{lot.commodity}</span>
                        <span className="text-[10px] font-normal text-slate-500">({lot.variety})</span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium truncate max-w-[200px]">
                        {lot.qualityGrade}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Moisture: {lot.qualityParams?.moisturePercent || 'N/A'}%
                      </div>
                    </td>

                    {/* Quantity & Reserve */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {lot.quantityQtl} Qtl ({(lot.quantityQtl / 10).toFixed(1)} MT)
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium">
                        ₹{lot.reservePrice.toLocaleString('en-IN')}/Qtl
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700">
                        Est: ₹{(lot.estimatedTotalValue || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Weighbridge Status */}
                    <td className="py-3 px-3">
                      {lot.weighbridgeSlip?.verified ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>Slip Verified</span>
                        </div>
                      ) : lot.weighbridgeSlip?.slipNumber ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Slip Unverified</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
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
                          <div className="font-mono font-bold text-emerald-700 text-xs">
                            ₹{lot.highestBid.bidPrice.toLocaleString('en-IN')}/Qtl
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium truncate max-w-[130px]">
                            {lot.highestBid.tradeFirm}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {lot.bidsCount} bids submitted
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No bids yet</span>
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
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-xs"
                          title="Inspect full lot dossier and quality assay"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Review</span>
                        </button>

                        <button
                          onClick={() => onVerifyWeighbridge(lot)}
                          className="p-1.5 text-xs text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shadow-xs"
                          title="Verify Weighbridge Slip"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>

                        {lot.status === 'disputed' && (
                          <button
                            onClick={() => onMediateDispute(lot)}
                            className="p-1.5 text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors shadow-xs"
                            title="Mediate B2B Dispute"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onSuspendLot(lot)}
                          className={`p-1.5 text-xs rounded-lg transition-colors shadow-xs ${
                            lot.status === 'suspended'
                              ? 'text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                              : 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200'
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
      <div className="px-4 py-3 bg-emerald-50/50 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="text-[11px] font-medium">
          Showing {lots.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} lots
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs font-semibold"
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
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                  pageNum === pagination.page
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs font-semibold"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
