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
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total User Roster
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{totalUsers}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {verifiedUsers} verified
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>DPDP Act Masked & Audit-Logged</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Persona Linked Profiles */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Multi-Persona Links
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{multiPersonaUsers.length}</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {totalUsers > 0 ? Math.round((multiPersonaUsers.length / totalUsers) * 100) : 0}%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Primary Profile Starred</span>
          </div>
        </div>
      </div>

      {/* 3. Farm Geofence Polygons Mapped */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Farm Geofences
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-2">
            <span>{mappedFarms.length} Plots</span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-mono">
              {totalAcreage.toFixed(1)} Ac
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Satellite & 7/12 Gat Polygons</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Review Queue */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending / Flagged
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-amber-700 flex items-baseline gap-2">
            <span>{pendingOrFlagged.length}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Actions Required
            </span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>KYC & Persona Verification</span>
          </div>
        </div>
      </div>

      {/* 5. Women SHG & Safety Mode */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/90 bg-white/90 backdrop-blur-xl p-4 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-emerald-300/80 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Women SHG Mode
          </span>
          <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-700">
            <HeartHandshake className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono text-pink-700 flex items-baseline gap-2">
            <span>{womenModeUsers.length}</span>
            <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">Enrolled</span>
          </div>
          <div className="text-[11px] text-pink-600 mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span>Safety Shield & SHG Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
