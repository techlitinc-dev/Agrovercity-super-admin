import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Wheat,
  Clock,
  Maximize2
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function FarmPolygonsTable({ onOpenUserDrawer, onOpenFarmMap }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPolygons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserService.listAllFarmPolygons({
        query: searchQuery,
        verified: verifiedFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setPolygons(res.data.polygons);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, verifiedFilter, page, addToast]);

  useEffect(() => {
    fetchPolygons();
  }, [fetchPolygons]);

  const handleToggleVerification = async (poly) => {
    const nextVal = !poly.verifiedByAdmin;
    const reason = window.prompt(
      `Enter administrative reason for ${nextVal ? 'verifying' : 'unverifying'} farm boundary ${poly.surveyNumber} (${poly.userName}):`,
      nextVal
        ? 'Ground cadastral survey matched with Maharashtra Mahabhulekh 7/12 digital land portal'
        : 'Disputed boundary claim filed by adjacent landowner'
    );
    if (!reason) return;

    setUpdatingId(poly.userId);
    try {
      const res = await adminUserService.verifyFarmPolygon({
        uid: poly.userId,
        verified: nextVal,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({ title: 'Verification Updated', message: res.message, type: 'success' });
      fetchPolygons();
    } catch (e) {
      addToast({ title: 'Update Failed', message: e.message, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const totalAcreage = polygons.reduce((acc, p) => acc + (parseFloat(p.acreage) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Cadastral Farm Geofence Registry (Entity:{' '}
              <span className="font-mono text-emerald-300 text-xs">users/{'{uid}'}/farmPolygon</span>)
            </h3>
            <p className="text-xs text-slate-400">
              SOP-02 §3. Satellite polygon boundary verification, Mahabhulekh 7/12 land parcel mapping, and acreage auditing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-white/10 rounded-lg font-mono text-slate-300 border border-white/10">
            Plots Mapped: <strong className="text-white">{pagination.total}</strong>
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 rounded-lg font-mono text-emerald-300 border border-emerald-500/30">
            Total Acreage: <strong className="text-white">{totalAcreage.toFixed(1)} Acres</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Survey No (7/12 Gat No. 104), plot title, farmer name, or district..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Verification Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Verification:</span>
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Plots</option>
              <option value="verified">Verified by Superadmin</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <button
            onClick={fetchPolygons}
            title="Refresh Farm Polygons"
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Plot Title & 7/12 Gat Survey</th>
                <th className="py-3.5 px-4">Landowner / Farmer</th>
                <th className="py-3.5 px-4">Location (Village / Taluka / Dist)</th>
                <th className="py-3.5 px-4">Acreage & Soil Type</th>
                <th className="py-3.5 px-4">Geofence Vertices</th>
                <th className="py-3.5 px-4">Cadastral Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {polygons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No cadastral farm boundary polygons found matching criteria.
                  </td>
                </tr>
              ) : (
                polygons.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Survey */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.title || 'Farmland Plot'}</div>
                      <div className="font-mono text-[11px] text-emerald-800 font-semibold mt-0.5">
                        {p.surveyNumber || '7/12 Gat No. Unspecified'}
                      </div>
                      {p.center && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Center: [{p.center[0]?.toFixed(4)}, {p.center[1]?.toFixed(4)}]
                        </div>
                      )}
                    </td>

                    {/* Farmer */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(p.userId)}
                        className={`font-bold text-slate-900 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        {p.userName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.userMobile}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{p.primaryPersona}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{p.village || 'Janori'}, Tal. {p.taluka || 'Dindori'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{p.district || 'Nashik'}, Maharashtra</div>
                    </td>

                    {/* Acreage & Soil */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {p.acreage} Acres <span className="text-[10px] font-normal text-slate-500">({p.gunthas || 0} Gunthas)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{p.soilType || 'Medium Black Loam'}</div>
                      <div className="text-[10px] text-emerald-700">{p.irrigationSource || 'Drip Irrigation'}</div>
                    </td>

                    {/* Vertices */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.coordinates?.length || 4} GPS Nodes
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {p.verifiedByAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified 7/12
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Unverified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleVerification(p)}
                          disabled={updatingId === p.userId}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                            p.verifiedByAdmin
                              ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{p.verifiedByAdmin ? 'Unverify' : 'Verify'}</span>
                        </button>

                        <button
                          onClick={() => onOpenFarmMap && onOpenFarmMap({ uid: p.userId, id: p.userCode, name: p.userName, farmPolygon: p })}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          title="Open Interactive Satellite Map Viewer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Satellite</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-800">{polygons.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> mapped boundary plots
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-mono text-slate-600">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
