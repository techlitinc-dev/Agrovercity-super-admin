import React, { useState } from 'react';
import { X, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

const VEHICLE_CLASSES = [
  '1-Ton Mini Truck (Tata Ace / Mahindra Jeeto)',
  '3-Ton Light Commercial (Bolero Maxi Truck / Eicher Pro)',
  '7-Ton Medium Duty (Eicher 11.10 / Tata 1109)',
  '16-Ton Heavy Multi-Axle (Inter-State Mandi Transit)',
  'Reefer Cold Chain (Fruits & Vegetables 3-Ton)',
  'Tractor Trolley (Short-Haul Local APMC Yard)'
];

const DISTRICTS = [
  'Nashik',
  'Pune',
  'Sangli',
  'Kolhapur',
  'Solapur',
  'Ahmednagar',
  'Jalgaon',
  'Yavatmal',
  'Nagpur',
  'Amravati'
];

export function VehicleRegistrationModal({
  isOpen,
  onClose,
  onSave,
  loading = false
}) {
  const [transporterName, setTransporterName] = useState('');
  const [transporterMobile, setTransporterMobile] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [vehicleClass, setVehicleClass] = useState(VEHICLE_CLASSES[1]);
  const [capacityTons, setCapacityTons] = useState(3.0);
  const [district, setDistrict] = useState('Nashik');
  const [baseFare, setBaseFare] = useState(850);
  const [perKmRate, setPerKmRate] = useState(32);
  const [rcNumber, setRcNumber] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [fitnessNumber, setFitnessNumber] = useState('');
  const [verifyImmediately, setVerifyImmediately] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      transporterName,
      transporterMobile,
      registrationNumber: registrationNumber.toUpperCase().trim(),
      chassisNumber: chassisNumber.toUpperCase().trim(),
      vehicleClass,
      capacityTons: Number(capacityTons),
      district,
      baseFare: Number(baseFare),
      perKmRate: Number(perKmRate),
      rcNumber,
      insuranceNumber,
      fitnessNumber,
      verifyImmediately
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-emerald-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Register Transporter Fleet Vehicle
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                SOP-08 §3: Commercial fleet onboarding, RC book, commercial insurance & fitness audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Transporter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Transporter / Operator Name</label>
              <input
                type="text"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Rameshwar Shinde"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Transporter Mobile Phone</label>
              <input
                type="tel"
                value={transporterMobile}
                onChange={(e) => setTransporterMobile(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+91 98220 12345"
                required
              />
            </div>
          </div>

          {/* Vehicle Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">RTO Registration #</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                placeholder="e.g. MH-15-GH-4921"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Chassis Number</label>
              <input
                type="text"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                placeholder="MAT12894109"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Operating District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Class & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Vehicle Class & Specification</label>
              <select
                value={vehicleClass}
                onChange={(e) => setVehicleClass(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {VEHICLE_CLASSES.map((vc) => (
                  <option key={vc} value={vc}>{vc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Pay Load (Tons)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={capacityTons}
                onChange={(e) => setCapacityTons(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Pricing Bands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Base Fare (₹)</label>
              <input
                type="number"
                min="100"
                value={baseFare}
                onChange={(e) => setBaseFare(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Per-Km Tariff (₹/km)</label>
              <input
                type="number"
                min="5"
                value={perKmRate}
                onChange={(e) => setPerKmRate(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Papers & Verification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">RC Book Number</label>
              <input
                type="text"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="MH15202100412"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Commercial Insurance #</label>
              <input
                type="text"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="POL-NIC-881920"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Fitness Certificate #</label>
              <input
                type="text"
                value={fitnessNumber}
                onChange={(e) => setFitnessNumber(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="FC-RTO-29104"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Immediate Verification & Dispatch Clearance</div>
              <div className="text-[11px] text-slate-500">
                Attest commercial papers and immediately enable vehicle for on-demand dispatch booking.
              </div>
            </div>
            <input
              type="checkbox"
              checked={verifyImmediately}
              onChange={(e) => setVerifyImmediately(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-emerald-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Registering Vehicle...' : 'Onboard Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
