import React, { useState } from 'react';
import {
  AlertTriangle,
  Gavel,
  Eye,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function DisputesArbitrationTable({
  disputedContracts = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onArbitrate,
  loading = false
}) {
  const [inspectContract, setInspectContract] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-rose-50/70 border-b border-rose-200/80 text-[11px] font-bold text-rose-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Contract Ref & Crop</th>
              <th className="py-3 px-4">Parties in Dispute</th>
              <th className="py-3 px-4">Dispute Claim Details</th>
              <th className="py-3 px-4 text-right">Escrow Locked (INR)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Filing Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading dispute arbitration desk...</span>
                  </div>
                </td>
              </tr>
            ) : disputedContracts.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
                    <span className="font-semibold text-slate-700">Zero Active Disputes</span>
                    <span className="text-xs text-slate-400">All institutional contracts are fulfilling smoothly without open arbitration claims.</span>
                  </div>
                </td>
              </tr>
            ) : (
              disputedContracts.map((c) => {
                const isBreach = c.status === 'breached';
                return (
                  <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">#{c.id}</div>
                      <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                        {c.crop} · {c.variety || c.grade}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {c.quantityQuintals} Quintals
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.buyerName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                        <span>Farmer:</span>
                        <strong className="text-slate-800">{c.farmerName}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.farmerDistrict || 'Maharashtra'}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="bg-rose-50/70 border border-rose-200 text-rose-950 p-2 rounded-xl text-[11px] leading-relaxed">
                        <div className="font-bold flex items-center gap-1 text-rose-900 mb-0.5">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Dispute Claim:</span>
                        </div>
                        {c.disputeReason || 'Breach of contractual terms reported by buyer / farmer.'}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-black text-sm text-slate-900">
                        {fmtRupees(c.escrowAmount)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Remaining: {fmtRupees((c.escrowAmount || 0) - (c.escrowReleased || 0))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          isBreach
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isBreach ? 'BREACH DEFAULT' : 'UNDER ARBITRATION'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {fmtDate(c.disputeFiledAt || c.updatedAt)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onArbitrate && onArbitrate(c)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs active:scale-95"
                          title="Open superadmin arbitration bench"
                        >
                          <Gavel className="w-3 h-3" />
                          <span>Arbitrate</span>
                        </button>

                        <button
                          onClick={() => setInspectContract(c)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total dispute cases)
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

      {/* Detail Slide-Over Drawer */}
      <DetailDrawer
        open={Boolean(inspectContract)}
        onClose={() => setInspectContract(null)}
        title={inspectContract ? `Disputed Contract #${inspectContract.id}` : ''}
        subtitle={inspectContract ? `${inspectContract.buyerName} × ${inspectContract.farmerName}` : ''}
      >
        {inspectContract && (
          <>
            <DrawerSection title="Dispute Summary">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 font-medium mb-3">
                {inspectContract.disputeReason}
              </div>
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Contract Ref" v={inspectContract.id} mono />
                <KeyValue k="Crop / Grade" v={`${inspectContract.crop} · ${inspectContract.grade}`} />
                <KeyValue k="Committed Volume" v={`${inspectContract.quantityQuintals} quintals`} />
                <KeyValue k="Rate / Quintal" v={fmtRupees(inspectContract.ratePerQuintal)} mono />
                <KeyValue k="Total Escrow Capital" v={fmtRupees(inspectContract.escrowAmount)} mono />
                <KeyValue k="Escrow Remaining" v={fmtRupees((inspectContract.escrowAmount || 0) - (inspectContract.escrowReleased || 0))} mono />
                <KeyValue k="Delivery Milestone" v={inspectContract.deliveryDate} mono />
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Document JSON">
              <DocJson doc={inspectContract} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
