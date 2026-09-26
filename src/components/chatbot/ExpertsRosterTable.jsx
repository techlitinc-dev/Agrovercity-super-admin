import React, { useState } from 'react';
import {
  UserCheck,
  UserX,
  Star,
  Phone,
  MessageSquare,
  Award,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';

const LANG_LABELS = { mr: 'Marathi', hi: 'Hindi', en: 'English' };

export default function ExpertsRosterTable({
  experts = [],
  onEditExpert,
  onAddNewExpert,
  onToggleAvailability
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('all');
  const [availFilter, setAvailFilter] = useState('all');

  const specializations = Array.from(new Set(experts.map(e => e.specialization))).filter(Boolean);

  const filtered = experts.filter(e => {
    if (specFilter !== 'all' && e.specialization !== specFilter) return false;
    if (availFilter === 'available' && !e.available) return false;
    if (availFilter === 'busy' && e.available) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = (e.name || '').toLowerCase().includes(q);
      const matchOrg = (e.organization || '').toLowerCase().includes(q);
      const matchSpec = (e.specialization || '').toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchSpec) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Certified KVK Agronomist Roster</h3>
            <p className="text-xs text-slate-500">
              Krishi Vigyan Kendra agronomists, soil scientists, and plant pathologists on active triage rotation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddNewExpert}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Register New Expert
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 p-3.5 backdrop-blur-xl shadow-xs">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agronomist by name, KVK center, or discipline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-emerald-200/80 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs font-sans"
          />
        </div>

        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        >
          <option value="all">All Specializations</option>
          {specializations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={availFilter}
          onChange={(e) => setAvailFilter(e.target.value)}
          className="rounded-xl border border-emerald-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available Only</option>
          <option value="busy">Busy Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl shadow-xs">
        <table className="w-full min-w-4xl text-left text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="px-4 py-3.5">Agronomist / Expert</th>
              <th className="px-4 py-3.5">KVK Affiliation</th>
              <th className="px-4 py-3.5">Specialization</th>
              <th className="px-4 py-3.5">Languages & Channels</th>
              <th className="px-4 py-3.5">Availability Status</th>
              <th className="px-4 py-3.5">Active Load</th>
              <th className="px-4 py-3.5">Rating</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/60">
            {filtered.map(expert => (
              <tr key={expert.id} className="transition-colors hover:bg-emerald-50/60">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800">
                      {expert.name?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{expert.name}</p>
                      <p className="font-mono text-[10px] text-slate-500">{expert.id} · {expert.experienceYears} yrs exp</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-800">
                  {expert.organization}
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-900 border border-emerald-200">
                    {expert.specialization}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-slate-800 font-medium">
                    {(expert.languages || []).map(l => LANG_LABELS[l] || l).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Channels: {(expert.channels || []).join(' · ')}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onToggleAvailability(expert.id, !expert.available)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-all ${
                      expert.available
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200'
                    }`}
                    title="Click to toggle availability"
                  >
                    {expert.available ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Available
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Busy / Off Duty
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs">
                  <span className={`font-bold ${expert.activeTickets > 3 ? 'text-amber-700' : 'text-slate-700'}`}>
                    {expert.activeTickets || 0} active tickets
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-600 text-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{expert.rating || 4.5}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => onEditExpert(expert)}
                    className="flex items-center gap-1 rounded-lg border border-emerald-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors shadow-2xs ml-auto"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-emerald-600" /> Edit
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-semibold">
                  No expert agronomists match the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
