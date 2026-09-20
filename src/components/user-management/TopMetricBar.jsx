import React from 'react';
import { Users, Layers, MapPin, AlertTriangle, ShieldCheck, HeartHandshake, Star } from 'lucide-react';

export function TopMetricBar({ users = [] }) {
  // Compute metrics from users array
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.status === 'verified').length;
  
  // Multi-persona users (users with > 1 linked persona)
  const multiPersonaUsers = users.filter((u) => {
    if (!u.roleProfiles) return false;
    const linkedCount = Object.values(u.roleProfiles).filter((p) => p.linked).length;
    return linkedCount > 1;
  });

  // Mapped farm polygons & total acreage
  const mappedFarms = users.filter((u) => u.farmPolygon && u.farmPolygon.coordinates?.length > 0);
  const totalAcreage = mappedFarms.reduce((acc, u) => acc + (Number(u.farmPolygon.acreage) || 0), 0);

  // Pending / Flagged review queue
  const pendingOrFlagged = users.filter((u) => {
    const isPending = u.status === 'pending';
    const isFlagged = u.status === 'flagged';
    const hasPendingRole = u.roleProfiles && Object.values(u.roleProfiles).some((p) => p.status === 'pending');
    return isPending || isFlagged || hasPendingRole;
  });

  // Women Mode active
  const womenModeUsers = users.filter((u) => u.womenMode);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Active Accounts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total User Roster
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{totalUsers}</span>
            <span className="text-xs font-normal text-emerald-400">
              ({verifiedUsers} verified)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>DPDP Act Masked & Audit-Logged</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Persona Linked Profiles */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Multi-Persona Links
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{multiPersonaUsers.length}</span>
            <span className="text-xs font-normal text-blue-400">
              ({totalUsers > 0 ? Math.round((multiPersonaUsers.length / totalUsers) * 100) : 0}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Primary Profile Starred</span>
          </div>
        </div>
      </div>

      {/* 3. Farm Geofence Polygons Mapped */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Farm Geofences Mapped
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            <span>{mappedFarms.length} Plots</span>
            <span className="text-xs font-normal text-teal-400 font-mono">
              {totalAcreage.toFixed(1)} Ac
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Satellite & 7/12 Gat Polygons</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Review Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending / Flagged
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-baseline gap-2">
            <span>{pendingOrFlagged.length}</span>
            <span className="text-xs font-normal text-slate-400">
              Actions Required
            </span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>KYC & Persona Verification</span>
          </div>
        </div>
      </div>

      {/* 5. Women SHG & Safety Mode */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Women SHG Mode
          </span>
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-pink-300 flex items-baseline gap-2">
            <span>{womenModeUsers.length}</span>
            <span className="text-xs font-normal text-pink-400">Enrolled</span>
          </div>
          <div className="text-[11px] text-pink-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Safety Shield & SHG Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
