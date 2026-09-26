import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  AlertTriangle,
  PlusCircle,
  FileCheck2,
  IndianRupee,
  CheckCircle2
} from 'lucide-react';

export function PlotRegistrationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) {
  const [formData, setFormData] = useState({
    surveyNo: '',
    khataNo: '',
    ownerName: '',
    ownerPhone: '',
    district: 'Nashik',
    taluka: '',
    village: '',
    totalAcres: 5.0,
    soilType: 'Black Cotton',
    waterSource: 'Borewell + Drip',
    boundaryNorth: '',
    boundarySouth: '',
    boundaryEast: '',
    boundaryWest: '',
    createListing: true,
    expectedRentPerAcre: 22000,
    cropSuitability: ['Soybean', 'Wheat'],
    immediateVerified: false
  });
  const [error, setError] = useState('');

  const districts = ['Nashik', 'Pune', 'Ahmednagar', 'Jalgaon', 'Sangli', 'Kolhapur', 'Solapur'];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        surveyNo: '',
        khataNo: '',
        ownerName: '',
        ownerPhone: '',
        district: 'Nashik',
        taluka: '',
        village: '',
        totalAcres: 5.0,
        soilType: 'Black Cotton',
        waterSource: 'Borewell + Drip',
        boundaryNorth: '',
        boundarySouth: '',
        boundaryEast: '',
        boundaryWest: '',
        createListing: true,
        expectedRentPerAcre: 22000,
        cropSuitability: ['Soybean', 'Wheat'],
        immediateVerified: false
      });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.surveyNo.trim()) {
      setError('Official cadastral survey number (e.g. 0712/2/34) is required.');
      return;
    }
    if (!formData.ownerName.trim() || !formData.ownerPhone.trim()) {
      setError('Landowner full name and mobile number are required.');
      return;
    }
    if (!formData.taluka.trim() || !formData.village.trim()) {
      setError('Taluka and village location are mandatory.');
      return;
    }
    if (!formData.totalAcres || Number(formData.totalAcres) <= 0) {
      setError('Please provide a valid land acreage (> 0 acres).');
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
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Register Farmland Parcel into Registry</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                  SOP-10
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Onboard agricultural plot with 7/12 cadastral survey metadata & optional listing
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

          {/* Cadastral & Owner Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                7/12 Survey Number *
              </label>
              <input
                type="text"
                value={formData.surveyNo}
                onChange={(e) => setFormData({ ...formData, surveyNo: e.target.value })}
                placeholder="e.g. 0712/2/34"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Khata Account # (Optional)
              </label>
              <input
                type="text"
                value={formData.khataNo}
                onChange={(e) => setFormData({ ...formData, khataNo: e.target.value })}
                placeholder="e.g. KH-4412"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Landowner Full Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Babanrao Deshmukh"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">
                Owner Phone Number *
              </label>
              <input
                type="text"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                placeholder="+91 98220 XXXXX"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Geographic Location
            </div>

            <div className="grid grid-cols-3 gap-2.5">
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
                <label className="text-slate-700 block mb-1 font-medium">Taluka *</label>
                <input
                  type="text"
                  value={formData.taluka}
                  onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  placeholder="e.g. Dindori"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-medium">Village *</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Mohadi"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Land Attributes */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-slate-800 font-semibold block mb-1">Total Acres *</label>
              <input
                type="number"
                step="0.25"
                min="0.5"
                value={formData.totalAcres}
                onChange={(e) => setFormData({ ...formData, totalAcres: e.target.value })}
                placeholder="5.5"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
              >
                <option value="Black Cotton">Black Cotton</option>
                <option value="Medium Black">Medium Black</option>
                <option value="Light Black">Light Black</option>
                <option value="Deep Black">Deep Black</option>
                <option value="Rain-fed Medium">Rain-fed Medium</option>
              </select>
            </div>

            <div>
              <label className="text-slate-800 font-semibold block mb-1">Water Source</label>
              <input
                type="text"
                value={formData.waterSource}
                onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                placeholder="Borewell + Drip"
                className="w-full px-3 py-2 bg-emerald-50/20 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Publish as Leasing Listing</div>
                <div className="text-[10px] text-slate-500">
                  Automatically adds listing in public marketplace with ₹{formData.expectedRentPerAcre}/acre target
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.createListing}
                onChange={(e) => setFormData({ ...formData, createListing: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div>
                <div className="font-bold text-emerald-950">Immediate 7/12 Clearance</div>
                <div className="text-[10px] text-emerald-700">
                  Marks parcel as verified and listing as immediately available
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.immediateVerified}
                onChange={(e) => setFormData({ ...formData, immediateVerified: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Farmland Parcel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
