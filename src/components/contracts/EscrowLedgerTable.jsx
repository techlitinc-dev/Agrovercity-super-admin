import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function EscrowLedgerTable({
  escrowLedger = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const [inspectTx, setInspectTx] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Transaction ID & Date</th>
              <th className="py-3 px-4">Contract Reference</th>
              <th className="py-3 px-4">Parties (Buyer $\to$ Farmer)</th>
              <th className="py-3 px-4">Milestone Tranche</th>
              <th className="py-3 px-4 text-right">Amount (INR)</th>
              <th className="py-3 px-4">Compliance & Sign-Off</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading corporate escrow ledger...</span>
                  </div>
                </td>
              </tr>
            ) : escrowLedger.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Lock className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Escrow Transactions Found</span>
                    <span className="text-xs text-slate-400">No transactions match current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              escrowLedger.map((tx) => {
                const isRelease = tx.type === 'release';
                const isHighValue = tx.amount > 50000;
                return (
                  <tr key={tx.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded inline-block text-[11px]">
                        {tx.id}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span>{fmtDate(tx.timestamp)}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Ref: {tx.bankReference}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {tx.contractId}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.buyerName}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <span className="text-emerald-700 font-bold">&rarr;</span>
                        <span>{tx.farmerName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isRelease
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {isRelease ? <ArrowUpRight className="w-3 h-3 text-blue-700" /> : <ArrowDownLeft className="w-3 h-3 text-emerald-700" />}
                          <span>{isRelease ? 'RELEASE' : 'DEPOSIT'}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium mt-1 truncate" title={tx.tranche}>
                        {tx.tranche}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className={`font-mono font-black text-sm ${isRelease ? 'text-blue-950' : 'text-emerald-950'}`}>
                        {fmtRupees(tx.amount)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {tx.dualAdminSignOff ? (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Dual-Admin Signed (Rule 6.3)</span>
                          </div>
                        ) : isHighValue ? (
                          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>High Value (&gt; ₹50k)</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500">Standard Clearance</span>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono truncate" title={tx.dualSignOffNote}>
                          {tx.adminUid}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectTx(tx)}
                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total escrow transactions)
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
        open={Boolean(inspectTx)}
        onClose={() => setInspectTx(null)}
        title={inspectTx ? `Escrow Tx #${inspectTx.id}` : ''}
        subtitle={inspectTx ? `${inspectTx.type.toUpperCase()}: ${fmtRupees(inspectTx.amount)}` : ''}
      >
        {inspectTx && (
          <>
            <DrawerSection title="Transaction Snapshot">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Transaction ID" v={inspectTx.id} mono />
                <KeyValue k="Contract ID" v={inspectTx.contractId} mono />
                <KeyValue k="Corporate Buyer" v={inspectTx.buyerName} />
                <KeyValue k="Beneficiary Farmer" v={inspectTx.farmerName} />
                <KeyValue k="Type" v={inspectTx.type.toUpperCase()} />
                <KeyValue k="Amount" v={fmtRupees(inspectTx.amount)} mono />
                <KeyValue k="Bank UTR Reference" v={inspectTx.bankReference} mono />
                <KeyValue k="Timestamp" v={fmtDate(inspectTx.timestamp)} />
                <KeyValue k="Admin Processor" v={inspectTx.adminUid} />
              </Card>
            </DrawerSection>

            <DrawerSection title="Institutional Compliance Note">
              <Card className="p-3 bg-emerald-50/50 border border-emerald-100 text-xs text-slate-800">
                <div className="font-bold text-emerald-900 mb-1">
                  {inspectTx.dualAdminSignOff ? 'Dual-Admin Sign-Off (Rule 6.3 Compliant)' : 'Standard Administrative Clearance'}
                </div>
                <div className="text-[11px] text-slate-600">{inspectTx.dualSignOffNote}</div>
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Document JSON">
              <DocJson doc={inspectTx} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
