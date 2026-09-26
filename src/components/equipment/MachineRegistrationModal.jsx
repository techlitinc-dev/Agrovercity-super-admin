import React, { useState, useEffect } from 'react';
import {
  X,
  Tractor,
  AlertTriangle,
  PlusCircle,
  FileCheck2,
  ShieldCheck,
  IndianRupee,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export function MachineRegistrationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'tractor',
    ownerName: '',
    ownerMobile: '',
    ownerType: 'fpo',
    fpoName: '',
    district: 'Kolhapur',
    village: '',
    hourlyRate: 800,
    perAcreRate: '',
    rcNumber: '',
    insurancePolicy: '',
    insuranceValidTill: '2027-12-31',
    licenseNumber: '',
    licenseValidTill: '2027-12-31',
    description: '',
    immediateVerified: false
  });
  const [error, setError] = useState('');

  const districts = ['Kolhapur', 'Sangli', 'Nashik', 'Pune', 'Solapur', 'Nagpur', 'Akola'];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        type: 'tractor',
        ownerName: '',
        ownerMobile: '',
        ownerType: 'fpo',
        fpoName: '',
        district: 'Kolhapur',
        village: '',
        hourlyRate: 800,
        perAcreRate: '',
        rcNumber: '',
        insurancePolicy: '',
        insuranceValidTill: '2027-12-31',
        licenseNumber: '',
        licenseValidTill: '2027-12-31',
        description: '',
        immediateVerified: false
      });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a machine name / model.');
      return;
    }
    if (!formData.ownerName.trim() || !formData.ownerMobile.trim()) {
      setError('Owner name and 10-digit mobile number are required.');
      return;
    }
    if (!formData.village.trim()) {
      setError('Operational village location is required.');
      return;
    }
    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
      setError('Please enter a valid hourly rate.');
      return;
    }

    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Register Farm Machinery into Fleet</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-09 §3
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Onboard machinery into FPO auto-confirm pool or private rental queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Machine Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Machine Model / Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mahindra 575 DI Tractor (45 HP)"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Machinery Category *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-semibold"
              >
                <option value="tractor">Tractor (45-65 HP)</option>
                <option value="harvester">Combine Harvester (Multi-Crop)</option>
                <option value="rotavator">Rotavator (7 ft / Heavy Duty)</option>
                <option value="laser_leveler">Laser Land Leveler</option>
                <option value="drone_sprayer">Agricultural Drone Sprayer (16L)</option>
                <option value="power_tiller">Power Tiller (15 HP)</option>
              </select>
            </div>
          </div>

          {/* Owner Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Ownership & Location
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-slate-700 block mb-1 font-medium">Owner Type *</label>
                <select
                  value={formData.ownerType}
                  onChange={(e) => setFormData({ ...formData, ownerType: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="fpo">FPO Shared Pool</option>
                  <option value="private">Private Farmer Owner</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-medium">Owner Name *</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g. Balasaheb Patil"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-medium">Mobile Number *</label>
                <input
                  type="text"
                  value={formData.ownerMobile}
                  onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
                  placeholder="+91 98220 XXXXX"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {formData.ownerType === 'fpo' && (
              <div>
                <label className="text-slate-700 block mb-1 font-medium">FPO Entity Name</label>
                <input
                  type="text"
                  value={formData.fpoName}
                  onChange={(e) => setFormData({ ...formData, fpoName: e.target.value })}
                  placeholder="e.g. Krishna Valley Farmers Producer Co."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-700 block mb-1 font-medium">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-medium">Village *</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Shirol"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rental Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Hourly Rental Rate (₹/hr) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="800"
                  className="w-full pl-8 pr-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Per-Acre Rate (Optional ₹/acre)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.perAcreRate}
                  onChange={(e) => setFormData({ ...formData, perAcreRate: e.target.value })}
                  placeholder="e.g. 1200"
                  className="w-full pl-8 pr-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Regulatory Papers */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">RC Registration #</label>
              <input
                type="text"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="MH09EQ1234"
                className="w-full px-2.5 py-1.5 bg-emerald-50/20 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium">Insurance Policy #</label>
              <input
                type="text"
                value={formData.insurancePolicy}
                onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
                placeholder="ICICI-AG-XXXX"
                className="w-full px-2.5 py-1.5 bg-emerald-50/20 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1 font-medium">Operator License #</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="DL-TR-XXXX"
                className="w-full px-2.5 py-1.5 bg-emerald-50/20 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Immediate Clearance Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div>
              <div className="font-bold text-emerald-950">Immediate Public Clearance</div>
              <div className="text-[10px] text-emerald-700">
                Instantly marks machine as Verified and generates today's 4-hour slot windows
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.immediateVerified}
              onChange={(e) => setFormData({ ...formData, immediateVerified: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Onboarding...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Machine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
