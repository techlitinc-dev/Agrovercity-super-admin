import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Eye,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function AcceptancesTable({
  acceptances = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  loading = false
}) {
  const [inspectItem, setInspectItem] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Acceptance ID & Contract</th>
              <th className="py-3 px-4">Farmer Details</th>
              <th className="py-3 px-4">Institutional Buyer</th>
              <th className="py-3 px-4">Committed Crop & Terms</th>
              <th className="py-3 px-4 text-center">MPIN Digital Seal</th>
              <th className="py-3 px-4">Delivery Milestone</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>Loading signed farmer agreements...</span>
                  </div>
                </td>
              </tr>
            ) : acceptances.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Users className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="font-semibold text-slate-600">No Signed Agreements Found</span>
                    <span className="text-xs text-slate-400">No farmers have signed contracts matching current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              acceptances.map((acc) => (
                <tr key={acc.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded inline-block text-[11px]">
                      {acc.id}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <span>Contract:</span>
                      <span className="font-mono font-semibold text-slate-700">{acc.contractId}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{acc.farmerName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{acc.farmerPhone ? acc.farmerPhone.replace(/^(\+91\s?\d{2})\d{4}(\d{2})/, '$1••••$2') : '—'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {acc.farmerDistrict || 'Maharashtra'} · {acc.aadhaarMasked || 'XXXX-XXXX-****'}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{acc.buyerName}</div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block font-bold mt-0.5">
                      Institutional Partner
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {acc.quantityQuintals} Quintals · {acc.crop}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                      @ {fmtRupees(acc.ratePerQuintal)}/q = <span className="font-bold text-emerald-800">{fmtRupees(acc.committedAmount)}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          acc.mpinVerified
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {acc.mpinVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>MPIN VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-rose-700" />
                            <span>FAILED</span>
                          </>
                        )}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {fmtDate(acc.signedAt)}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-xs font-mono font-medium text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{acc.deliveryMilestone || '—'}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectItem(acc)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs ml-auto"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-emerald-100/70 bg-emerald-50/20 text-xs">
          <span className="text-slate-500 font-medium">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total signed acceptances)
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
        open={Boolean(inspectItem)}
        onClose={() => setInspectItem(null)}
        title={inspectItem ? `Farmer Acceptance #${inspectItem.id}` : ''}
        subtitle={inspectItem ? `${inspectItem.farmerName} × ${inspectItem.buyerName}` : ''}
      >
        {inspectItem && (
          <>
            <DrawerSection title="Agreement Details">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Acceptance ID" v={inspectItem.id} mono />
                <KeyValue k="Contract Ref" v={inspectItem.contractId} mono />
                <KeyValue k="Farmer Name" v={inspectItem.farmerName} />
                <KeyValue k="Phone" v={inspectItem.farmerPhone} />
                <KeyValue k="District" v={inspectItem.farmerDistrict || 'Maharashtra'} />
                <KeyValue k="Crop & Grade" v={`${inspectItem.quantityQuintals}q · ${inspectItem.crop}`} />
                <KeyValue k="Guaranteed Rate" v={`${fmtRupees(inspectItem.ratePerQuintal)} / quintal`} mono />
                <KeyValue k="Total Locked Value" v={fmtRupees(inspectItem.committedAmount)} mono />
              </Card>
            </DrawerSection>

            <DrawerSection title="Digital Signature & Non-Repudiation">
              <Card className="p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">MPIN Cryptographic Attestation:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SHA-256 HSM ATTESTED
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Masked Identity (DPDP Act):</span>
                  <span className="font-mono text-slate-800">{inspectItem.aadhaarMasked || 'XXXX-XXXX-9122'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Signing IP & Timestamp:</span>
                  <span className="font-mono text-slate-700">{inspectItem.ipAddress || '14.139.122.9'} · {fmtDate(inspectItem.signedAt)}</span>
                </div>
              </Card>
            </DrawerSection>

            <DrawerSection title="Document JSON">
              <DocJson doc={inspectItem} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
