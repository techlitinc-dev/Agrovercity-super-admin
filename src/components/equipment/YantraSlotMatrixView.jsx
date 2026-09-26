import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Tractor,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Wrench,
  Sparkles
} from 'lucide-react';

const SLOT_WINDOWS = [
  { key: '06-10', name: '06:00-10:00', label: 'Morning Slot', task: 'Tillage / Plowing' },
  { key: '10-02', name: '10:00-14:00', label: 'Midday Slot', task: 'Sowing / Drilling' },
  { key: '02-06', name: '14:00-18:00', label: 'Afternoon Slot', task: 'Spraying / Harvesting' },
  { key: '06-10-eve', name: '18:00-22:00', label: 'Evening Slot', task: 'Leveling / Harrowing' }
];

export function YantraSlotMatrixView({
  machines = [],
  slots = [],
  onInspectSlot,
  onResolveAnomaly,
  onPageChange,
  loading = false
}) {
  const [selectedDate, setSelectedDate] = useState('2026-09-21');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedOwnerType, setSelectedOwnerType] = useState('all');

  const districts = ['Kolhapur', 'Sangli', 'Nashik', 'Pune', 'Solapur', 'Nagpur'];

  // Filter machines based on district and ownerType
  const filteredMachines = machines.filter((m) => {
    if (selectedDistrict !== 'all' && m.district?.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedOwnerType !== 'all' && m.ownerType !== selectedOwnerType) {
      return false;
    }
    return true;
  });

  // Map slots by equipmentId and slotName for the selected date
  const slotMap = {};
  slots.forEach((s) => {
    if (s.date === selectedDate) {
      const key = `${s.equipmentId}_${s.slotName}`;
      slotMap[key] = s;
    }
  });

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col space-y-4 p-5">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100/80">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Yantra 4-Hour Time-Slot Matrix & Scheduler
            </h2>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              4-Hour Windows
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual mechanization scheduler: Morning (06-10), Midday (10-14), Afternoon (14-18), Evening (18-22). Max 2 slots/farmer/day.
          </p>
        </div>

        {/* Date Selector & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker Control */}
          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl p-1 text-xs">
            <button
              onClick={handlePrevDay}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-800 px-2 py-0.5 border-none focus:outline-none"
            />
            <button
              onClick={handleNextDay}
              className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* District Dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Owner Type Dropdown */}
          <select
            value={selectedOwnerType}
            onChange={(e) => setSelectedOwnerType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Owners</option>
            <option value="fpo">FPO Pool Only</option>
            <option value="private">Private Owners</option>
          </select>
        </div>
      </div>

      {/* 2. Legend Bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-700 font-medium">Booked / Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700 font-medium">Pending Approval</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-700 font-bold">Double-Booked Anomaly</span>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Showing {filteredMachines.length} machinery units for date {selectedDate}
        </div>
      </div>

      {/* 3. Matrix Scheduler Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3 px-4 min-w-[220px]">Machine & Ownership</th>
              {SLOT_WINDOWS.map((sw) => (
                <th key={sw.key} className="py-3 px-3 min-w-[190px]">
                  <div>{sw.name}</div>
                  <div className="text-[9px] font-normal text-slate-500 lowercase first-letter:uppercase">
                    {sw.label} ({sw.task})
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading Yantra time-slot matrix...</span>
                  </div>
                </td>
              </tr>
            ) : filteredMachines.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No machinery units match the selected filters.
                </td>
              </tr>
            ) : (
              filteredMachines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Machine Meta */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Tractor className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{m.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {m.ownerName} • {m.village}, {m.district}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              m.ownerType === 'fpo'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {m.ownerType === 'fpo' ? 'FPO Auto' : 'Private'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 font-semibold">
                            ₹{m.hourlyRate}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 4 Time Slots */}
                  {SLOT_WINDOWS.map((sw) => {
                    const slot = slotMap[`${m.id}_${sw.name}`];
                    return (
                      <td key={sw.key} className="py-3.5 px-3 align-top">
                        {slot ? (
                          <SlotCard
                            slot={slot}
                            machine={m}
                            onInspect={() => onInspectSlot(slot)}
                            onResolveAnomaly={() => onResolveAnomaly(slot)}
                          />
                        ) : (
                          <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                            <span className="text-[10px] text-slate-400 font-mono">No Slot Entry</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlotCard({ slot, machine, onInspect, onResolveAnomaly }) {
  const isDoubleBooked = slot.anomaly === 'double_booked';
  const waitlistCount = (slot.waitlist || []).length;

  return (
    <div
      className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between min-h-[105px] relative group ${
        isDoubleBooked
          ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
          : slot.status === 'booked'
          ? 'bg-sky-50/60 border-sky-200 hover:border-sky-300'
          : slot.status === 'pending'
          ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
          : 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
      }`}
    >
      {/* Top Status & Price */}
      <div className="flex items-center justify-between gap-1">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
            isDoubleBooked
              ? 'bg-rose-100 text-rose-800'
              : slot.status === 'booked'
              ? 'bg-sky-100 text-sky-800'
              : slot.status === 'pending'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isDoubleBooked ? (
            <>
              <AlertTriangle className="w-3 h-3 text-rose-600 animate-pulse" />
              <span>Conflict</span>
            </>
          ) : slot.status === 'booked' ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-sky-600" />
              <span>Booked</span>
            </>
          ) : slot.status === 'pending' ? (
            <>
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Pending</span>
            </>
          ) : (
            <span>Available</span>
          )}
        </span>

        <span className="text-[10px] font-mono font-bold text-slate-700">
          ₹{(slot.priceRupees || 0).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Booking Details or Recommended Task */}
      <div className="my-1.5">
        {slot.bookedByName ? (
          <div>
            <div className="font-bold text-slate-900 truncate">{slot.bookedByName}</div>
            <div className="text-[10px] text-slate-500 font-mono">{slot.bookedBy}</div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-600 font-medium">
            Open for {slot.recommendedTask || 'Machinery Task'}
          </div>
        )}
      </div>

      {/* Bottom Row: Waitlist & Action Button */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px]">
        {waitlistCount > 0 ? (
          <span className="flex items-center gap-1 font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">
            <Users className="w-2.5 h-2.5" />+{waitlistCount}
          </span>
        ) : (
          <span className="text-[9px] text-slate-400 font-mono">4 hrs</span>
        )}

        <div className="flex items-center gap-1">
          {isDoubleBooked ? (
            <button
              onClick={onResolveAnomaly}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <Wrench className="w-2.5 h-2.5" />
              <span>Resolve</span>
            </button>
          ) : (
            <button
              onClick={onInspect}
              className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold transition-colors flex items-center gap-1"
            >
              <Eye className="w-2.5 h-2.5 text-slate-500" />
              <span>View</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
