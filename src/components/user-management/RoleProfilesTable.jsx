import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  User,
  Wheat,
  Home,
  Truck,
  Store,
  Tractor,
  Scale,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function RoleProfilesTable({ onOpenUserDrawer, onOpenManagePersonas }) {
  const { hasPermission, currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserService.listAllRoleProfiles({
        query: searchQuery,
        persona: personaFilter,
        status: statusFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setProfiles(res.data.profiles);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      addToast({ title: 'Query Error', message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, personaFilter, statusFilter, page, addToast]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const getPersonaIcon = (persona) => {
    switch (persona) {
      case 'Farmer':
        return Wheat;
      case 'Landlord':
        return Home;
      case 'Transporter':
        return Truck;
      case 'Seller':
        return Store;
      case 'Equipment Owner':
        return Tractor;
      case 'Broker':
        return Scale;
      default:
        return Layers;
    }
  };

  const getPersonaBadge = (persona, isPrimary, isActive) => {
    const Icon = getPersonaIcon(persona);
    let colorClasses = 'bg-slate-100 text-slate-800 border-slate-200';
    if (persona === 'Farmer') colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (persona === 'Landlord') colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    if (persona === 'Transporter') colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
    if (persona === 'Seller') colorClasses = 'bg-purple-50 text-purple-800 border-purple-200';
    if (persona === 'Equipment Owner') colorClasses = 'bg-orange-50 text-orange-800 border-orange-200';
    if (persona === 'Broker') colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';

    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${colorClasses} w-fit`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{persona}</span>
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          {isPrimary && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Primary ⭐
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
              Live Session
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderRoleDetails = (p) => {
    const d = p.details;
    if (!d) return <span className="text-slate-400 italic">No specific role details registered</span>;

    switch (p.persona) {
      case 'Farmer':
        return (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1">
              <span>{d.acreage || 0} Acres</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{d.ownership || '7/12 Land'}</span>
            </div>
            {d.crops && d.crops.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {d.crops.slice(0, 2).map((c, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded border border-emerald-200 font-medium">
                    {c}
                  </span>
                ))}
                {d.crops.length > 2 && (
                  <span className="text-[10px] text-slate-400">+{d.crops.length - 2} more</span>
                )}
              </div>
            )}
            <div className="text-[10px] text-slate-500 font-mono">
              SHC: {d.soilHealthCard || 'N/A'} · PM-Kisan: {d.pmKisanId || 'N/A'}
            </div>
          </div>
        );

      case 'Landlord':
        return (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">
              {d.parcelsCount || 1} Parcels · {d.leasedAcreage || 0} Leased Acres
            </div>
            <div className="text-[11px] text-amber-700 font-medium">{d.leaseTerms || 'Annual Cash Lease'}</div>
            <div className="text-[10px] text-emerald-700 font-bold">
              Rate: ₹{d.ratePerAcre ? d.ratePerAcre.toLocaleString() : '35,000'}/acre
            </div>
          </div>
        );

      case 'Transporter':
        return (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">Commercial Transport Fleet</div>
            <div className="text-[11px] text-sky-800 font-mono">
              Permit: {d.permitType || 'National Goods Carrier Permit'}
            </div>
            <div className="text-[10px] text-slate-500">
              Fleet: {d.fleetCount || 3} Vehicles · Insurance: {d.insuranceValid !== false ? 'Verified' : 'Pending'}
            </div>
          </div>
        );

      case 'Seller':
        return (
          <div className="space-y-1">
            <div className="font-bold text-slate-900">{d.shopName || 'Agri Retail Store'}</div>
            <div className="text-[10px] font-mono text-purple-700">License: {d.licenseNo || 'COMM-WH-PUN-0919'}</div>
            <div className="text-[10px] text-slate-500">{d.storeLocation || 'APMC Market Yard'}</div>
          </div>
        );

      case 'Equipment Owner':
        return (
          <div className="space-y-1">
            <div className="font-semibold text-slate-900">
              {d.machinery && d.machinery.length > 0 ? d.machinery[0] : 'Farm Machinery Fleet'}
            </div>
            <div className="text-[11px] text-orange-700 font-semibold">{d.hourlyRateRange || '₹850 - ₹1,400 / hr'}</div>
            <div className="text-[10px] text-slate-500 font-mono">
              GPS: {d.gpsTracked ? 'Tracked' : 'Manual'} · Total: {d.totalHoursRented || 142} hrs
            </div>
          </div>
        );

      case 'Broker':
        return (
          <div className="space-y-1">
            <div className="font-bold text-rose-900 flex items-center gap-1">
              <span>Mandi APMC Broker</span>
              <span className="text-[10px] font-mono text-slate-500">({d.apmcLicense || 'APMC-PUN-BROKER'})</span>
            </div>
            <div className="text-[10px] text-slate-700">
              Mandis: {d.operatingMandis ? d.operatingMandis.join(', ') : 'Market Yard'}
            </div>
            <div className="text-[10px] text-slate-500">
              Deposit: ₹{d.securityDeposit ? d.securityDeposit.toLocaleString() : '1,50,000'} · Comm: {d.commissionRate || '2%'}
            </div>
          </div>
        );

      default:
        return <span className="text-slate-500 text-xs">Standard Registered Profile</span>;
    }
  };

  const handleVerifyProfile = async (p, newStatus) => {
    const reason = window.prompt(
      `Enter administrative reason for changing ${p.persona} status to '${newStatus}' for ${p.userName}:`,
      newStatus === 'verified' ? 'Verified official agricultural documents and credentials' : 'Suspended role profile due to dispute'
    );
    if (!reason) return;

    setUpdatingId(p.id);
    try {
      const res = await adminUserService.verifyRoleProfile({
        uid: p.userId,
        persona: p.persona,
        status: newStatus,
        adminUid: currentAdmin.email,
        reason
      });
      addToast({ title: 'Role Profile Updated', message: res.message, type: 'success' });
      fetchProfiles();
    } catch (e) {
      addToast({ title: 'Update Failed', message: e.message, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetPrimary = async (p) => {
    setUpdatingId(p.id);
    try {
      const res = await adminUserService.managePersonas({
        uid: p.userId,
        persona: p.persona,
        action: 'setPrimary',
        adminUid: currentAdmin.email,
        reason: `Superadmin starred ${p.persona} as primary identity`
      });
      addToast({ title: 'Primary Persona Set', message: res.message, type: 'success' });
      fetchProfiles();
    } catch (e) {
      addToast({ title: 'Failed to Set Primary', message: e.message, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 shadow-sm text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Multi-Persona Directory (Collection:{' '}
              <span className="font-mono text-emerald-300 text-xs">users/{'{uid}'}/role_profiles</span>)
            </h3>
            <p className="text-xs text-slate-400">
              SOP-02 §2. Multi-role federation across Farmer, Landlord, Transporter, Seller, Equipment Owner, & Broker.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-white/10 rounded-lg font-mono text-slate-300 border border-white/10">
            Total Profiles: <strong className="text-white">{pagination.total}</strong>
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 rounded-lg font-mono text-emerald-300 border border-emerald-500/30">
            Verified: <strong className="text-white">{profiles.filter((p) => p.status === 'verified').length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, persona, crop (Sugarcane), tractor (John Deere), or license..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Persona Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Persona:</span>
            <select
              value={personaFilter}
              onChange={(e) => {
                setPersonaFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Personas (6)</option>
              <option value="Farmer">🌾 Farmer</option>
              <option value="Landlord">🏡 Landlord</option>
              <option value="Transporter">🚚 Transporter</option>
              <option value="Seller">🏪 Seller / Merchant</option>
              <option value="Equipment Owner">🚜 Equipment Owner</option>
              <option value="Broker">⚖️ APMC Broker</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified & Linked</option>
              <option value="pending">Pending Review</option>
              <option value="inactive">Inactive / Unlinked</option>
            </select>
          </div>

          <button
            onClick={fetchProfiles}
            title="Refresh Profiles"
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
                <th className="py-3.5 px-4">Persona Vertical</th>
                <th className="py-3.5 px-4">User Account</th>
                <th className="py-3.5 px-4">Domain Role Attributes</th>
                <th className="py-3.5 px-4">Reputation</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No multi-persona profiles found matching your search.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Persona */}
                    <td className="py-3.5 px-4">{getPersonaBadge(p.persona, p.isPrimary, p.isActive)}</td>

                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onOpenUserDrawer && onOpenUserDrawer(p.userId)}
                        className={`font-bold text-slate-900 flex items-center gap-1.5 ${
                          onOpenUserDrawer ? 'cursor-pointer hover:text-emerald-700 hover:underline' : ''
                        }`}
                      >
                        {p.userName}
                        <span className="font-mono text-[10px] text-slate-400">({p.userCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.userMobile}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.userCity}
                      </div>
                    </td>

                    {/* Attributes */}
                    <td className="py-3.5 px-4 max-w-[300px]">{renderRoleDetails(p)}</td>

                    {/* Reputation */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating || 4.5}</span>
                        <span className="text-[10px] text-slate-400">/ 5.0</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.linked ? 'Active Credential' : 'Unlinked Persona'}
                      </div>
                    </td>

                    {/* Verification */}
                    <td className="py-3.5 px-4">
                      {p.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : p.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-400" /> Inactive
                        </span>
                      )}
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {new Date(p.verificationDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyProfile(p, 'verified')}
                            disabled={updatingId === p.id}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                        )}

                        {p.status === 'verified' && !p.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(p)}
                            disabled={updatingId === p.id}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            title="Set as Primary Persona (⭐)"
                          >
                            <Star className="w-3 h-3 text-amber-600" />
                            <span>Make Primary</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenManagePersonas && onOpenManagePersonas({ uid: p.userId, id: p.userCode, name: p.userName })}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Open Full Persona Linker Modal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
            Showing <span className="font-bold text-slate-800">{profiles.length}</span> of{' '}
            <span className="font-bold text-slate-800">{pagination.total}</span> role profiles
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
