import React from 'react';
import {
  Eye,
  AlertTriangle,
  Clock,
  Copy,
  CalendarClock,
  Users
} from 'lucide-react';
import { TablePaginationFooter } from './TablePaginationFooter';

function SlotStateBadge({ status, anomaly }) {
  if (anomaly === 'double_booked') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3 h-3 text-rose-600" /> Double-Booked
      </span>
    );
  }
  switch (status) {
    case 'booked':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <CalendarClock className="w-3 h-3 text-sky-600" /> Booked
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
        </span>
      );
    case 'available':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Available
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

export function SlotsTable({
  slots = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectSlot,
  loading = false
}) {
  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Table Subheader */}
      <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Yantra Time-Slot Ledger (equipment_slots)</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-bold font-mono">
            {slots.length} Records
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          4-Hour Slots: 06–10 · 10–02 · 02–06 · 06–10 · Max 2 Slots/Farmer/Day
        </div>
      </div>

      {/* Primary Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 min-w-[220px]">Slot ID</th>
              <th className="py-3.5 px-4 min-w-[180px]">Machine & Owner</th>
              <th className="py-3.5 px-4 min-w-[150px]">Window</th>
              <th className="py-3.5 px-4 min-w-[130px]">Price & Task</th>
              <th className="py-3.5 px-4 min-w-[170px]">Booked By</th>
              <th className="py-3.5 px-4 min-w-[130px]">Waitlist</th>
              <th className="py-3.5 px-4 min-w-[130px]">State</th>
              <th className="py-3.5 px-4 text-right min-w-[90px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading Yantra slot ledger...</span>
                  </div>
                </td>
              </tr>
            ) : slots.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No slots match the specified query or filters.
                </td>
              </tr>
            ) : (
              slots.map((slot) => (
                <tr
                  key={slot.id}
                  onClick={() => onInspectSlot(slot)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Slot ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold text-[11px]">
                      <span className="truncate max-w-[190px]">{slot.id}</span>
                      <button
                        onClick={(e) => handleCopyId(slot.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                        title="Copy Slot ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {slot.anomaly === 'double_booked' && (
                      <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3" /> Conflicting bookings detected
                      </span>
                    )}
                  </td>

                  {/* Machine & Owner */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 truncate max-w-[170px]">{slot.equipmentName}</div>
                    <div className="text-[11px] text-slate-500">
                      {slot.ownerName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      {slot.ownerType}
                    </div>
                  </td>

                  {/* Window */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{slot.date}</div>
                    <div className="text-[11px] text-slate-600 font-mono font-medium">{slot.slotName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{slot.duration} min</div>
                  </td>

                  {/* Price & Task */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-emerald-700 text-xs">₹{slot.priceRupees.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-600">{slot.recommendedTask}</div>
                  </td>

                  {/* Booked By */}
                  <td className="py-3.5 px-4">
                    {slot.bookedByName ? (
                      <>
                        <div className="font-bold text-slate-800">{slot.bookedByName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{slot.bookedBy}</div>
                      </>
                    ) : (
                      <span className="text-slate-400 text-[11px]">— Unclaimed —</span>
                    )}
                  </td>

                  {/* Waitlist */}
                  <td className="py-3.5 px-4">
                    {slot.waitlist?.length ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Users className="w-3 h-3 text-emerald-600" /> {slot.waitlist.length} waiting
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">None</span>
                    )}
                  </td>

                  {/* State */}
                  <td className="py-3.5 px-4">
                    <SlotStateBadge status={slot.status} anomaly={slot.anomaly} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onInspectSlot(slot)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                      title="Inspect slot ledger record and waitlist"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationFooter
        records={slots}
        label="slots"
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}
