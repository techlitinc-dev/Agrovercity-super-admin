import React, { useState } from 'react';
import {
  X,
  Star,
  Layers,
  Wheat,
  Home,
  Truck,
  Store,
  Tractor,
  Scale,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';
import { PERSONA_TYPES } from '../../services/mockData';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function ManagePersonasModal({ isOpen, onClose, user, onUserDataUpdated }) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  const [selectedPersona, setSelectedPersona] = useState('Farmer');
  const [adminReason, setAdminReason] = useState('');
  const [editingFields, setEditingFields] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const roleProfiles = user.roleProfiles || {};
  const currentProfile = roleProfiles[selectedPersona] || { linked: false, status: 'inactive' };
  const isLinked = !!currentProfile.linked;
  const isPrimary = user.primaryPersona === selectedPersona;
  const isActive = user.activePersona === selectedPersona;

  // Icon mapping
  const getPersonaIcon = (p) => {
    switch (p) {
      case 'Farmer': return Wheat;
      case 'Landlord': return Home;
      case 'Transporter': return Truck;
      case 'Seller': return Store;
      case 'Equipment Owner': return Tractor;
      case 'Broker': return Scale;
      default: return Layers;
    }
  };

  // Color mapping
  const getPersonaColor = (p) => {
    switch (p) {
      case 'Farmer': return 'text-emerald-800 bg-emerald-100 border-emerald-300';
      case 'Landlord': return 'text-amber-800 bg-amber-100 border-amber-300';
      case 'Transporter': return 'text-sky-800 bg-sky-100 border-sky-300';
      case 'Seller': return 'text-purple-800 bg-purple-100 border-purple-300';
      case 'Equipment Owner': return 'text-orange-800 bg-orange-100 border-orange-300';
      case 'Broker': return 'text-indigo-800 bg-indigo-100 border-indigo-300';
      default: return 'text-slate-700 bg-slate-100 border-slate-300';
    }
  };

  // 1. Link Persona
  const handleLinkPersona = async () => {
    setLoading(true);
    try {
      const defaultData = getDefaultPersonaAttributes(selectedPersona, user);
      const res = await adminUserService.managePersonas({
        uid: user.uid,
        persona: selectedPersona,
        action: 'link',
        profileData: defaultData,
        adminUid: currentAdmin.email,
        reason: adminReason || `Superadmin manually linked ${selectedPersona} persona`
      });

      addToast({
        title: 'Persona Linked',
        message: `${selectedPersona} persona activated for ${user.name}`,
        type: 'success'
      });
      onUserDataUpdated(res.user);
      setAdminReason('');
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Unlink Persona (Mandatory reason)
  const handleUnlinkPersona = async () => {
    if (!adminReason.trim()) {
      addToast({
        title: 'Reason Required',
        message: `Please enter an administrative audit reason to unlink ${selectedPersona}.`,
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await adminUserService.managePersonas({
        uid: user.uid,
        persona: selectedPersona,
        action: 'unlink',
        adminUid: currentAdmin.email,
        reason: adminReason.trim()
      });

      addToast({
        title: 'Persona Unlinked',
        message: `${selectedPersona} persona unlinked from ${user.name}`,
        type: 'success'
      });
      onUserDataUpdated(res.user);
      setAdminReason('');
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Set Primary (⭐)
  const handleSetPrimary = async () => {
    setLoading(true);
    try {
      const res = await adminUserService.managePersonas({
        uid: user.uid,
        persona: selectedPersona,
        action: 'setPrimary',
        adminUid: currentAdmin.email,
        reason: adminReason || `Designated ${selectedPersona} as primary profile`
      });

      addToast({
        title: 'Primary Persona Set',
        message: `${selectedPersona} is now the starred Primary Profile ⭐`,
        type: 'success'
      });
      onUserDataUpdated(res.user);
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 4. Set Active
  const handleSetActive = async () => {
    setLoading(true);
    try {
      const res = await adminUserService.managePersonas({
        uid: user.uid,
        persona: selectedPersona,
        action: 'setActive',
        adminUid: currentAdmin.email,
        reason: `Switched active persona to ${selectedPersona}`
      });

      addToast({
        title: 'Active Persona Switched',
        message: `Current active view set to ${selectedPersona}`,
        type: 'info'
      });
      onUserDataUpdated(res.user);
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Default seed attributes when activating a new persona
  function getDefaultPersonaAttributes(p, u) {
    switch (p) {
      case 'Farmer':
        return {
          crops: ['Sugarcane', 'Soybean'],
          acreage: 4.0,
          ownership: 'Owned (7/12 Verified)',
          soilHealthCard: 'SHC-MH-2026-NEW',
          pmKisanId: 'PMK-PENDING',
          irrigationType: 'Drip',
          status: 'verified'
        };
      case 'Landlord':
        return {
          parcelsCount: 1,
          leasedAcreage: 5.0,
          leaseTerms: 'Annual Cash Rent (₹35,000/acre)',
          ratePerAcre: 35000,
          verifiedTitle712: true,
          disputeFree: true,
          status: 'verified'
        };
      case 'Transporter':
        return {
          vehicleTypes: ['Tata 407 (4-Tonner)'],
          fleetCount: 1,
          registrationNo: 'MH-09-NEW-1122',
          permitType: 'State Commercial',
          coldChainAvailable: false,
          maxPayloadTons: 4.0,
          status: 'verified'
        };
      case 'Seller':
        return {
          shopName: `${u.name} Krishi Seva Kendra`,
          licenseNo: 'SELLER-LIC-2026',
          gstin: '27AAAAA0000A1Z5',
          categories: ['Seeds', 'Fertilizers'],
          storeLocation: u.geoCity || 'Market Yard',
          creditAllowed: true,
          status: 'verified'
        };
      case 'Equipment Owner':
        return {
          machinery: ['Tractor 4WD (50 HP)', 'Rotavator'],
          fleetCount: 1,
          hourlyRateRange: '₹900 - ₹1,400 / hr',
          gpsTracked: true,
          operatorIncluded: true,
          status: 'verified'
        };
      case 'Broker':
        return {
          apmcLicense: 'APMC-COMM-2026',
          operatingMandis: [u.geoCity?.split(',')[0] || 'Local APMC'],
          activeTradersCount: 12,
          securityDeposit: 50000,
          commissionRate: '1.5%',
          status: 'verified'
        };
      default:
        return { status: 'verified' };
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800">
                  Multi-Persona Link Manager
                </span>
                <span className="text-slate-400">::</span>
                <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold border border-emerald-300">
                  SOP-02
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>{user.name}</span>
                <span className="text-xs font-mono font-normal text-slate-500">
                  ({user.id} · {user.mobile})
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Persona selector grid (All 6 Canonical Personas) */}
          <div>
            <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2.5">
              Available AGROVERCITY Personas (6)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {Object.values(PERSONA_TYPES).map((p) => {
                const IconComponent = getPersonaIcon(p);
                const pProfile = roleProfiles[p];
                const pIsLinked = !!pProfile?.linked;
                const pIsPrimary = user.primaryPersona === p;
                const isSelected = selectedPersona === p;

                return (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPersona(p);
                      setIsEditing(false);
                    }}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-emerald-100/90 hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    {/* Star badge for Primary */}
                    {pIsPrimary && (
                      <div className="absolute top-1.5 right-1.5" title="Primary Starred Profile">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      </div>
                    )}

                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getPersonaColor(p)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-800">{p}</div>
                      <div className="text-[10px] mt-0.5">
                        {pIsLinked ? (
                          <span className="text-emerald-700 font-semibold">● Linked</span>
                        ) : (
                          <span className="text-slate-400">Not Linked</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Persona Details & Actions Panel */}
          <div className="bg-white border border-emerald-100 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getPersonaColor(selectedPersona)}`}>
                  {React.createElement(getPersonaIcon(selectedPersona), { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{selectedPersona} Persona Profile</h3>
                    {isPrimary && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Starred Primary Profile
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                        Currently Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Status: <strong className={isLinked ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>{currentProfile.status || (isLinked ? 'verified' : 'inactive')}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Persona State Actions */}
              <div className="flex items-center gap-2">
                {isLinked ? (
                  <>
                    {!isPrimary && (
                      <button
                        onClick={handleSetPrimary}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                        title="Designate as primary profile across all agro transactions"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Star as Primary</span>
                      </button>
                    )}
                    {!isActive && (
                      <button
                        onClick={handleSetActive}
                        disabled={loading}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        Switch Active
                      </button>
                    )}
                    <button
                      onClick={handleUnlinkPersona}
                      disabled={loading}
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      title="Deactivate and unlink this persona profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unlink Persona</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLinkPersona}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Link & Activate {selectedPersona}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Persona Role Attributes View */}
            {isLinked ? (
              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Role-Specific Attributes & Credentials
                </div>

                {selectedPersona === 'Farmer' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Primary Crops</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.crops?.join(', ') || 'Sugarcane, Soybean'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Landholding</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.acreage || 4.0} Acres ({currentProfile.ownership || 'Owned'})</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Soil Health Card</span>
                      <span className="text-emerald-700 font-mono font-semibold">{currentProfile.soilHealthCard || 'SHC-MH-2026-ACTIVE'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">PM-Kisan Reg ID</span>
                      <span className="text-slate-800 font-mono">{currentProfile.pmKisanId || 'PMK-4491028'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Irrigation Setup</span>
                      <span className="text-slate-800">{currentProfile.irrigationType || 'Drip + Lift'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Seller Rating</span>
                      <span className="text-amber-600 font-bold">★ {currentProfile.rating || 4.8} / 5.0</span>
                    </div>
                  </div>
                )}

                {selectedPersona === 'Landlord' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Available Leased Land</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.leasedAcreage || 8.0} Acres</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Total Land Parcels</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.parcelsCount || 2} Plots</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Standard Lease Terms</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.leaseTerms || 'Annual Cash Rent'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">7/12 Land Title Record</span>
                      <span className="text-emerald-700 font-semibold">✓ Verified Clear Title</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Dispute Status</span>
                      <span className="text-emerald-700 font-semibold">Zero Active Disputes</span>
                    </div>
                  </div>
                )}

                {selectedPersona === 'Transporter' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Vehicle Fleet</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.vehicleTypes?.join(', ') || 'Tata 407, Mahindra Bolero'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Total Fleet Count</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.fleetCount || 2} Commercial Vehicles</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Commercial Reg #</span>
                      <span className="text-sky-700 font-mono font-semibold">{currentProfile.registrationNo || 'MH-13-CU-8841'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Cold Chain Reefer</span>
                      <span className={currentProfile.coldChainAvailable ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                        {currentProfile.coldChainAvailable ? 'Yes (Insulated Reefer)' : 'Standard Body'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedPersona === 'Seller' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Shop / Business Trade Name</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.shopName || `${user.name} Krishi Kendra`}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Fertilizer/Seed License</span>
                      <span className="text-purple-700 font-mono font-semibold">{currentProfile.licenseNo || 'FERT-SEED-2024'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">GSTIN Registration</span>
                      <span className="text-slate-800 font-mono">{currentProfile.gstin || '27AAZCS9912E1ZQ'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Product Categories</span>
                      <span className="text-slate-800">{currentProfile.categories?.join(', ') || 'Seeds, Fertilizers'}</span>
                    </div>
                  </div>
                )}

                {selectedPersona === 'Equipment Owner' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Machinery Fleet</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.machinery?.join(', ') || 'John Deere 5310 Tractor, Rotavator'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Fleet Size</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.fleetCount || 2} Units</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Hourly Rental Range</span>
                      <span className="text-orange-700 font-semibold">{currentProfile.hourlyRateRange || '₹850 - ₹1,400 / hr'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">GPS Telematics</span>
                      <span className="text-emerald-700 font-semibold">✓ Installed & Live Geotagged</span>
                    </div>
                  </div>
                )}

                {selectedPersona === 'Broker' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">APMC Mandi License</span>
                      <span className="text-indigo-700 font-mono font-semibold">{currentProfile.apmcLicense || 'APMC-COMM-2022'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Operating Mandis</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.operatingMandis?.join(', ') || 'Local Market Yard'}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Security Deposit in Escrow</span>
                      <span className="text-emerald-700 font-semibold">₹{(currentProfile.securityDeposit || 100000).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-100">
                      <span className="text-slate-500 block text-[11px]">Standard Commission</span>
                      <span className="text-slate-800 font-semibold">{currentProfile.commissionRate || '1.8%'}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs">
                <span>{selectedPersona} is not currently linked to this user. Click <strong>"Link & Activate"</strong> to enroll this persona profile.</span>
              </div>
            )}

            {/* Audit reason input */}
            <div className="pt-3 border-t border-emerald-100 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 block">
                Administrative Audit Rationale (Recorded in immutable audit logs):
              </label>
              <input
                type="text"
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="e.g. Verified 7/12 land lease agreement deed; or user requested transport activation..."
                className="w-full bg-emerald-50/40 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-emerald-50/50 border-t border-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            Audited Admin: <span className="text-slate-800 font-medium">{currentAdmin.email}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors shadow-xs"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
