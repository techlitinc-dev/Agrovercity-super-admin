import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  Store,
  Wallet
} from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function VyapariRatesTable({
  rates = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectRate,
  onApproveRate,
  onRejectRate,
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
    addToast({ title: 'Copied', message: `Ticket ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(rates.map((r) => r.id));
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

  // Status Badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Live on App
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
            Predatory Alert
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

  // Sanity band pill
  const renderSanityPill = (rate) => {
    const dev = rate.deviationPercent;
    const isWithin = rate.sanityBandStatus === 'within_band';
    const isPredatory = rate.sanityBandStatus === 'predatory_low' || dev < -15;

    if (isPredatory) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <TrendingDown className="w-3 h-3 text-rose-700" />
          {dev}% Predatory Low
        </span>
      );
    }

    if (dev > 15) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-orange-100 text-orange-900 border border-orange-300">
          <TrendingUp className="w-3 h-3 text-orange-700" />
          +{dev}% Inflated
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
        {dev >= 0 ? `+${dev}%` : `${dev}%`} Within Band
      </span>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">
            Vyapari Live Rate Approvals Queue (2-Hourly Feed)
          </span>
          {selectedIds.length > 0 && (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold">
              {selectedIds.length} row(s) selected
            </span>
          )}
        </div>
        <div className="text-[11px] font-mono text-slate-500 font-medium">
          Showing {rates.length} of {pagination.total} records
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
                  checked={rates.length > 0 && selectedIds.length === rates.length}
                  onChange={handleSelectAll}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 w-24">Rate ID</th>
              <th className="py-3 px-4 min-w-[200px]">Trader / Vyapari</th>
              <th className="py-3 px-4 min-w-[190px]">Mandi & Commodity</th>
              <th className="py-3 px-4 min-w-[170px]">Offered Rate vs Modal</th>
              <th className="py-3 px-3 min-w-[140px]">Sanity Band (±15%)</th>
              <th className="py-3 px-3 min-w-[130px]">Net Realization</th>
              <th className="py-3 px-3 min-w-[110px]">Status</th>
              <th className="py-3 px-4 text-right min-w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-semibold text-slate-700">Querying Mandi & Vyapari Rates Ledger...</span>
                  </div>
                </td>
              </tr>
            ) : rates.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Store className="w-8 h-8 text-emerald-300" />
                    <span className="font-bold text-slate-700">No Rate Submissions Found</span>
                    <span className="text-xs text-slate-500">
                      Try adjusting the search criteria or filters.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              rates.map((rate) => {
                const isSelected = selectedIds.includes(rate.id);

                return (
                  <tr
                    key={rate.id}
                    onClick={() => onInspectRate(rate)}
                    className={`group hover:bg-emerald-50/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/80' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRow(rate.id, e)}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Rate ID */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{rate.id}</span>
                        <button
                          onClick={(e) => handleCopyId(rate.id, e)}
                          className="text-slate-400 hover:text-emerald-700 p-0.5"
                          title="Copy ID"
                        >
                          {copiedId === rate.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {rate.slot}
                      </div>
                    </td>

                    {/* Trader / Vyapari */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{rate.vyapariName}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          {rate.tradeFirm}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {rate.vyapariMobile} · {rate.paymentTerms}
                        </div>
                      </div>
                    </td>

                    {/* Mandi & Commodity */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900">
                          {rate.commodity}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {rate.mandiName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Min: {rate.minQuantityQtl} Qtl · Max: {rate.maxQuantityQtl} Qtl
                        </div>
                      </div>
                    </td>

                    {/* Offered Rate vs Modal Benchmark */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-base font-extrabold font-mono text-emerald-800 flex items-baseline gap-1">
                          <span>₹{rate.offeredRate.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] font-normal text-slate-500">/Qtl</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Agmarknet: ₹{rate.benchmarkModalPrice.toLocaleString('en-IN')}/Qtl
                        </div>
                      </div>
                    </td>

                    {/* Sanity Band Status */}
                    <td className="py-3 px-3">
                      {renderSanityPill(rate)}
                    </td>

                    {/* Net Farmer Realization (after freight) */}
                    <td className="py-3 px-3">
                      <div className="text-slate-900 font-mono font-bold">
                        ₹{rate.netFarmerRealization?.toLocaleString('en-IN') || rate.offeredRate}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Freight -₹{rate.estimatedFreightDeduction || 120}/Qtl
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {renderStatusBadge(rate.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectRate(rate)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:text-white bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-lg transition-colors shadow-xs"
                          title="Inspect Rate & Sanity Band Visualization"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700 group-hover:text-white" />
                          <span>Review</span>
                        </button>

                        {rate.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onApproveRate(rate)}
                              className="p-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                              title="Approve & Publish to Mobile App"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onRejectRate(rate)}
                              className="p-1.5 text-xs text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg shadow-xs transition-colors"
                              title="Reject Rate"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
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
          Showing {rates.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
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
