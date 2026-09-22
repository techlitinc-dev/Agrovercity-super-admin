import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Star,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Sliders,
  FileText,
  Clock,
  Wheat,
  Home,
  Truck,
  Store,
  Tractor,
  Scale,
  Edit3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { LANGUAGES, PERSONA_TYPES } from '../../services/mockData';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function UserDetailDrawer({
  isOpen,
  onClose,
  user,
  onOpenManagePersonas,
  onOpenFarmMap,
  onOpenStatusChange,
  onUserDataUpdated
}) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'personas' | 'farm' | 'bookings' | 'audit' | 'json'
  const [copiedField, setCopiedField] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Preference edit states
  const [selectedLang, setSelectedLang] = useState(user?.language || 'en');
  const [womenModeActive, setWomenModeActive] = useState(!!user?.womenMode);
  const [prefReason, setPrefReason] = useState('');
  const [savingPref, setSavingPref] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedLang(user.language || 'en');
      setWomenModeActive(!!user.womenMode);
      fetchUserAuditLogs();
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const fetchUserAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const logs = await adminUserService.getUserAuditLogs(user.uid);
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast({ title: 'Copied', message: `${fieldName} copied to clipboard`, type: 'info' });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSavePreferences = async () => {
    setSavingPref(true);
    try {
      const res = await adminUserService.updatePreferences({
        uid: user.uid,
        language: selectedLang,
        womenMode: womenModeActive,
        adminUid: currentAdmin.email,
        reason: prefReason.trim() || 'Updated language and Women SHG safety mode'
      });

      addToast({
        title: 'Preferences Updated',
        message: `Preferences saved for ${user.name}`,
        type: 'success'
      });

      if (onUserDataUpdated) {
        onUserDataUpdated(res.user);
      }
      setPrefReason('');
      fetchUserAuditLogs();
    } catch (err) {
      addToast({ title: 'Update Failed', message: err.message, type: 'error' });
    } finally {
      setSavingPref(false);
    }
  };

  const roleProfiles = user.roleProfiles || {};
  const linkedPersonas = Object.entries(roleProfiles).filter(([_, p]) => p.linked);
  const bookings = user.bookings || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-l border-emerald-100 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm shadow-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
                {user.womenMode && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-full font-semibold">
                    <HeartHandshake className="w-3 h-3 text-pink-500" /> Women SHG
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 font-mono mt-0.5">
                <span>{user.id}</span>
                <span>•</span>
                <span>UID: {user.uid.slice(0, 14)}...</span>
                <span>•</span>
                <span className="capitalize text-emerald-700 font-semibold">{user.status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenStatusChange(user)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors shadow-xs"
            >
              Change Status
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-emerald-50/30 border-b border-emerald-100 flex items-center gap-4 text-xs font-medium shrink-0 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Settings' },
            { id: 'personas', label: `Linked Personas (${linkedPersonas.length})` },
            { id: 'farm', label: 'Farm Geofence' },
            { id: 'bookings', label: `Bookings (${bookings.length})` },
            { id: 'audit', label: `Audit Trail (${auditLogs.length})` },
            { id: 'json', label: 'JSON Schema' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Overview & Preferences */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Profile Spotlight */}
              <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>Designated Primary Profile</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {user.primaryPersona || 'Farmer'} Profile
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Currently Active View: <strong className="text-slate-800">{user.activePersona || 'Farmer'}</strong>
                  </div>
                </div>
                <button
                  onClick={() => onOpenManagePersonas(user)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Manage Personas
                </button>
              </div>

              {/* Personal & Compliance Entity Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Contact & Identity (DPDP Act Compliant)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white border border-emerald-100 rounded-lg p-3 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Full Name</span>
                      <span className="text-slate-800 font-semibold">{user.name}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-lg p-3 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                      <span className="text-slate-800 font-mono font-semibold">{user.mobile}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(user.mobile, 'Mobile')}
                      className="text-slate-400 hover:text-emerald-700"
                    >
                      {copiedField === 'Mobile' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-lg p-3 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Email Address</span>
                      <span className="text-slate-800">{user.email || 'None Registered'}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-lg p-3 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Aadhaar Masked (DPDP Enforced)</span>
                      <span className="text-emerald-700 font-mono font-semibold">{user.aadhaarMasked || 'XXXX-XXXX-4812'}</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                      Masked
                    </span>
                  </div>

                  <div className="bg-white border border-emerald-100 rounded-lg p-3 sm:col-span-2 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Geographic Jurisdiction</span>
                      <span className="text-slate-800 font-medium">{user.geoCity || 'Kolhapur, Maharashtra'}</span>
                    </div>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Language Preferences & Women Mode Editor */}
              <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Regional Language & Safety Settings</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language Selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      User Interface Language
                    </label>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Women Mode Toggle */}
                  <div className="flex flex-col justify-end">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      Women Mode (Safety & SHG Program)
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-2">
                      <input
                        type="checkbox"
                        checked={womenModeActive}
                        onChange={(e) => setWomenModeActive(e.target.checked)}
                        className="rounded border-emerald-300 text-pink-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-800 font-medium">
                        {womenModeActive ? 'Enabled (Priority SHG Active)' : 'Disabled (Standard Mode)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Audit rationale for preferences */}
                <div className="space-y-1.5 pt-2">
                  <input
                    type="text"
                    value={prefReason}
                    onChange={(e) => setPrefReason(e.target.value)}
                    placeholder="Audit reason for changing preferences / Women Mode..."
                    className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePreferences}
                      disabled={savingPref}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      {savingPref ? 'Saving...' : 'Update Preferences'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Linked Personas */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Enrolled Multi-Personas ({linkedPersonas.length} of 6)
                  </h3>
                  <p className="text-xs text-slate-500">
                    A user can switch between linked personas without separate accounts.
                  </p>
                </div>
                <button
                  onClick={() => onOpenManagePersonas(user)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Configure Personas
                </button>
              </div>

              <div className="space-y-3">
                {linkedPersonas.map(([pKey, pData]) => {
                  const isPrimary = user.primaryPersona === pKey;
                  const isActive = user.activePersona === pKey;

                  return (
                    <div
                      key={pKey}
                      className="bg-white border border-emerald-100 rounded-xl p-4 flex flex-col gap-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-800 text-sm">{pKey}</span>
                          {isPrimary && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Starred Primary
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                              Active View
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-emerald-700 font-semibold capitalize">
                          ● {pData.status || 'Verified'}
                        </span>
                      </div>

                      {/* Brief details based on persona */}
                      <div className="text-xs text-slate-600 bg-emerald-50/40 border border-emerald-100/80 p-2.5 rounded-lg font-mono">
                        {pKey === 'Farmer' && (
                          <div>Crops: {pData.crops?.join(', ')} · Acreage: {pData.acreage} Ac · SHC: {pData.soilHealthCard}</div>
                        )}
                        {pKey === 'Landlord' && (
                          <div>Leased: {pData.leasedAcreage} Ac · Parcels: {pData.parcelsCount} · Rate: ₹{pData.ratePerAcre}/Ac</div>
                        )}
                        {pKey === 'Transporter' && (
                          <div>Vehicles: {pData.vehicleTypes?.join(', ')} · Fleet: {pData.fleetCount} · Reg: {pData.registrationNo}</div>
                        )}
                        {pKey === 'Seller' && (
                          <div>Shop: {pData.shopName} · License: {pData.licenseNo} · GSTIN: {pData.gstin}</div>
                        )}
                        {pKey === 'Equipment Owner' && (
                          <div>Machinery: {pData.machinery?.join(', ')} · Rate: {pData.hourlyRateRange}</div>
                        )}
                        {pKey === 'Broker' && (
                          <div>APMC: {pData.apmcLicense} · Mandis: {pData.operatingMandis?.join(', ')} · Comm: {pData.commissionRate}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Farm Geofence */}
          {activeTab === 'farm' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Farm Geofence & Boundary Polygon
                </h3>
                <button
                  onClick={() => onOpenFarmMap(user)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Open Satellite Map Editor
                </button>
              </div>

              {user.farmPolygon ? (
                <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{user.farmPolygon.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{user.farmPolygon.surveyNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-700 font-bold font-mono text-base">
                        {user.farmPolygon.acreage} Acres
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {user.farmPolygon.gunthas || 0} Gunthas
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Location</span>
                      <span className="text-slate-700">{user.farmPolygon.village}, {user.farmPolygon.taluka}, {user.farmPolygon.district}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">GPS Center</span>
                      <span className="text-slate-700 font-mono">{user.farmPolygon.center?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Soil Classification</span>
                      <span className="text-slate-700">{user.farmPolygon.soilType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Irrigation Lift</span>
                      <span className="text-slate-700">{user.farmPolygon.irrigationSource}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-emerald-100 flex justify-between items-center">
                    <span>Vertices Mapped: {user.farmPolygon.coordinates?.length || 0} Points</span>
                    <span className="text-emerald-700 font-semibold">✓ Audit Sealed</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-emerald-50/30 border border-dashed border-emerald-200 rounded-xl text-slate-500 text-xs">
                  <div>No farm boundary polygon mapped yet.</div>
                  <button
                    onClick={() => onOpenFarmMap(user)}
                    className="mt-2 text-emerald-700 hover:underline font-semibold"
                  >
                    + Add Satellite Boundary
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Bookings Ledger (users/{uid}/bookings) */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Cross-Persona Bookings Ledger (users/{'{uid}'}/bookings)
              </h3>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No booking transactions recorded.
                </div>
              ) : (
                <div className="border border-emerald-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase font-bold text-[10px]">
                        <th className="py-2.5 px-3">Booking ID</th>
                        <th className="py-2.5 px-3">Persona</th>
                        <th className="py-2.5 px-3">Service / Order</th>
                        <th className="py-2.5 px-3">Counterparty</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100/60">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-emerald-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-slate-700 font-bold">{b.id}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {b.persona}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-800">{b.service}</td>
                          <td className="py-2.5 px-3 text-slate-600">{b.counterparty}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            ₹{b.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="capitalize text-[11px] font-semibold text-slate-700">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Immutable Audit History (Target: {user.uid})
              </h3>

              {loadingAudit ? (
                <div className="py-8 text-center text-slate-500 text-xs">Loading audit logs...</div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No audit logs for this user.</div>
              ) : (
                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white border border-emerald-100 rounded-lg p-3 text-xs space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-emerald-700 font-bold">{log.action}</span>
                        <span className="text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-700 font-medium">{log.reason}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-emerald-50">
                        <span>Prev: <span className="text-slate-600">{log.previousState}</span></span>
                        <span>Admin: <span className="text-slate-600">{log.adminUid}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: JSON Schema */}
          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Complete Firestore Enveloped User Document</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(user, null, 2), 'JSON Document')}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>
              <pre className="bg-slate-900 border border-emerald-950/40 rounded-xl p-4 text-xs font-mono text-emerald-400 max-h-[420px] overflow-y-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
