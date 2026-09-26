import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Eye,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function InstitutionalBuyersTable({
  buyers = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onViewBuyerContracts,
  loading = false
}) {
  const [inspectBuyer, setInspectBuyer] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Corporate Entity</th>
              <th className="py-3 px-4">Statutory Identifiers</th>
              <th className="py-3 px-4">Nodal Escrow Bank Account</th>
              <th className="py-3 px-4">Authorized Signatory</th>
              <th className="py-3 px-4">Credit Rating</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading institutional corporate buyers...</span>
                  </div>
                </td>
              </tr>
            ) : buyers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Building2 className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Institutional Buyers Found</span>
                    <span className="text-xs text-slate-400">No corporate buyers match current criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              buyers.map((buyer) => {
                const isVerified = buyer.status === 'verified';
                return (
                  <tr key={buyer.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{buyer.companyName}</div>
                      <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                        {buyer.brandName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {buyer.id}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-800 font-bold">CIN: {buyer.cin}</div>
                      <div className="text-emerald-700 font-semibold mt-0.5">GSTIN: {buyer.gstin}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate" title={buyer.nodalEscrowAccount}>
                        {buyer.nodalEscrowAccount}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Committed Escrow: <strong className="font-mono text-emerald-800">{fmtRupees(buyer.totalEscrowCommitted)}</strong>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{buyer.authorizedSignatory}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-2.5 h-2.5 text-slate-400" />
                        <span>{buyer.contactEmail}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        <span>{buyer.signatoryMobile}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {buyer.creditRating}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {buyer.activeContractsCount} active contracts
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>PENDING AUDIT</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectBuyer(buyer)}
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
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total buyers)
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
        open={Boolean(inspectBuyer)}
        onClose={() => setInspectBuyer(null)}
        title={inspectBuyer ? inspectBuyer.companyName : ''}
        subtitle={inspectBuyer ? `CIN: ${inspectBuyer.cin} · Status: ${inspectBuyer.status.toUpperCase()}` : ''}
      >
        {inspectBuyer && (
          <>
            <DrawerSection title="Corporate Profile">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Buyer ID" v={inspectBuyer.id} mono />
                <KeyValue k="Company Name" v={inspectBuyer.companyName} />
                <KeyValue k="Brand" v={inspectBuyer.brandName} />
                <KeyValue k="CIN" v={inspectBuyer.cin} mono />
                <KeyValue k="GSTIN" v={inspectBuyer.gstin} mono />
                <KeyValue k="Credit Agency Rating" v={inspectBuyer.creditRating} mono />
                <KeyValue k="Nodal Escrow Account" v={inspectBuyer.nodalEscrowAccount} />
                <KeyValue k="Active Price-Lock Deals" v={String(inspectBuyer.activeContractsCount)} />
                <KeyValue k="Total Escrow Committed" v={fmtRupees(inspectBuyer.totalEscrowCommitted)} mono />
              </Card>
            </DrawerSection>

            <DrawerSection title="Authorized Signatory & KYC">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Signatory Officer" v={inspectBuyer.authorizedSignatory} />
                <KeyValue k="Official Email" v={inspectBuyer.contactEmail} />
                <KeyValue k="Official Mobile" v={inspectBuyer.signatoryMobile} />
                <KeyValue k="KYC Attestation Date" v={fmtDate(inspectBuyer.verifiedAt)} />
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Document JSON">
              <DocJson doc={inspectBuyer} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
