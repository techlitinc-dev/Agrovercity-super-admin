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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-600">
        <AlertTriangle className="w-3 h-3" /> Double-Booked
      </span>
    );
  }
  switch (status) {
    case 'booked':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
          <CalendarClock className="w-3 h-3" /> Booked
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
          <Clock className="w-3 h-3" /> Pending Approval
        </span>
      );
    case 'available':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
          Available
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Yantra Time-Slot Ledger (equipment_slots)</span>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded font-mono">
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
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 min-w-[220px]">Slot ID</th>
              <th className="py-3 px-4 min-w-[180px]">Machine & Owner</th>
              <th className="py-3 px-4 min-w-[150px]">Window</th>
              <th className="py-3 px-4 min-w-[130px]">Price & Task</th>
              <th className="py-3 px-3 min-w-[170px]">Booked By</th>
              <th className="py-3 px-3 min-w-[130px]">Waitlist</th>
              <th className="py-3 px-3 min-w-[130px]">State</th>
              <th className="py-3 px-4 text-right min-w-[90px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
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
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Slot ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold text-[11px]">
                      <span className="truncate max-w-[190px]">{slot.id}</span>
                      <button
                        onClick={(e) => handleCopyId(slot.id, e)}
                        className="text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
                        title="Copy Slot ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {slot.anomaly === 'double_booked' && (
                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3" /> Conflicting bookings detected
                      </span>
                    )}
                  </td>

                  {/* Machine & Owner */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white truncate max-w-[170px]">{slot.equipmentName}</div>
                    <div className="text-[11px] text-slate-400">
                      {slot.ownerName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                      {slot.ownerType}
                    </div>
                  </td>

                  {/* Window */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-sky-400">{slot.date}</div>
                    <div className="text-[11px] text-slate-300 font-mono">{slot.slotName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{slot.duration} min</div>
                  </td>

                  {/* Price & Task */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">₹{slot.priceRupees.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-300">{slot.recommendedTask}</div>
                  </td>

                  {/* Booked By */}
                  <td className="py-3 px-3">
                    {slot.bookedByName ? (
                      <>
                        <div className="font-semibold text-slate-200">{slot.bookedByName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{slot.bookedBy}</div>
                      </>
                    ) : (
                      <span className="text-slate-500 text-[11px]">— Unclaimed —</span>
                    )}
                  </td>

                  {/* Waitlist */}
                  <td className="py-3 px-3">
                    {slot.waitlist?.length ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-300">
                        <Users className="w-3 h-3" /> {slot.waitlist.length} waiting
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">None</span>
                    )}
                  </td>

                  {/* State */}
                  <td className="py-3 px-3">
                    <SlotStateBadge status={slot.status} anomaly={slot.anomaly} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onInspectSlot(slot)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                      title="Inspect slot ledger record and waitlist"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
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
