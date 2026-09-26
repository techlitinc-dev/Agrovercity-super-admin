import React from 'react';
import {
  FileText,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Eye,
  Tractor
} from 'lucide-react';
import { TablePaginationFooter } from '../equipment/TablePaginationFooter';

export function LeaseRequestsTable({
  requests = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectRequest,
  loading = false
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'contract_drafted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <CheckCircle2 className="w-3 h-3 text-sky-600" /> Contract Drafted
          </span>
        );
      case 'pending_landlord':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Landlord
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-4 bg-emerald-50/50 border-b border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm">
              Tenant Applications & Lease Requests (lease_requests)
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
              {requests.length} Applications
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Formal tenant tenancy proposals submitted to farmland owners with proposed rent, crop plan & deposit commitments.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Standardized Terms & Dispute Prevention Gateway
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Request ID</th>
              <th className="py-3.5 px-4 min-w-[170px]">Tenant Applicant</th>
              <th className="py-3.5 px-4 min-w-[180px]">Target Plot & Landlord</th>
              <th className="py-3.5 px-4 min-w-[150px]">Proposed Rent & Deposit</th>
              <th className="py-3.5 px-4 min-w-[160px]">Intended Crops & Term</th>
              <th className="py-3.5 px-4 min-w-[150px]">Experience & Fleet</th>
              <th className="py-3.5 px-4 min-w-[130px]">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading lease requests...</span>
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  No tenant applications found.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {r.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{r.tenantName}</div>
                    <span className="text-[10px] font-mono text-slate-500">{r.tenantPhone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">Owner: {r.landlordName}</div>
                    <span className="text-[10px] font-mono text-slate-500">Listing: {r.listingId} • {r.plotId}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-emerald-800 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {Number(r.proposedRentMonthly || 0).toLocaleString('en-IN')}/mo
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Deposit: ₹{Number(r.proposedDeposit || 0).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">
                      {Array.isArray(r.intendedCrops) ? r.intendedCrops.join(', ') : r.intendedCrops}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {r.proposedDurationMonths} Months Duration
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800">{r.farmingExperienceYears} yrs experience</div>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">
                      {r.machineryOwned || 'Standard Equipment'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(r.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onInspectRequest(r)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      title="Inspect Application Details"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
