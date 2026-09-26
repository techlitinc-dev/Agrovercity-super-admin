import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';

const AVAILABLE_CROPS = [
  'Soybean',
  'Wheat',
  'Cotton',
  'Onion',
  'Maize',
  'Tur',
  'Gram',
  'Groundnut',
  'Paddy (Basmati)',
  'Mustard'
];

const CORPORATE_BUYERS = [
  { id: 'BUY-ITC-01', name: 'ITC Limited (Agri-Business Division)', escrow: 'HDFC Bank Nodal Escrow A/c 502000889123' },
  { id: 'BUY-REL-02', name: 'Reliance Retail (Fresh Produce Desk)', escrow: 'ICICI Bank Corporate Escrow A/c 001105992811' },
  { id: 'BUY-ADA-03', name: 'Adani Agri Logistics Ltd.', escrow: 'State Bank of India Escrow A/c 39912044819' },
  { id: 'BUY-CAR-04', name: 'Cargill India Pvt. Ltd.', escrow: 'Citibank N.A. Institutional Escrow A/c 982104921' },
  { id: 'BUY-PEP-05', name: 'PepsiCo India Holdings Pvt. Ltd.', escrow: 'Standard Chartered Bank Escrow A/c 4410298192' }
];

export function ContractFormModal({
  isOpen,
  onClose,
  onSave,
  loading = false
}) {
  const [buyerId, setBuyerId] = useState('BUY-ITC-01');
  const [crop, setCrop] = useState('Soybean');
  const [variety, setVariety] = useState('JS-335 Certified Hybrid');
  const [grade, setGrade] = useState('Grade A (Moisture < 10%, Foreign Matter < 1%)');
  const [quantityQuintals, setQuantityQuintals] = useState(100);
  const [mspBaseline, setMspBaseline] = useState(4892);
  const [ratePerQuintal, setRatePerQuintal] = useState(5300);
  const [farmerPoolName, setFarmerPoolName] = useState('Maharashtra FPO Federation (Nashik / Kolhapur Cluster)');
  const [deliveryHub, setDeliveryHub] = useState('ITC Chaupal Saagar Hub, Dindori, Nashik');
  const [acceptanceDeadline, setAcceptanceDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const selectedBuyer = CORPORATE_BUYERS.find((b) => b.id === buyerId) || CORPORATE_BUYERS[0];
  const escrowTotal = (Number(quantityQuintals) || 0) * (Number(ratePerQuintal) || 0);
  const premiumOverMsp =
    Number(mspBaseline) > 0 && Number(ratePerQuintal) > Number(mspBaseline)
      ? (((Number(ratePerQuintal) - Number(mspBaseline)) / Number(mspBaseline)) * 100).toFixed(1)
      : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      buyerId: selectedBuyer.id,
      buyerName: selectedBuyer.name,
      escrowBank: selectedBuyer.escrow,
      crop,
      variety,
      grade,
      quantityQuintals: Number(quantityQuintals),
      mspBaseline: Number(mspBaseline),
      ratePerQuintal: Number(ratePerQuintal),
      farmerName: farmerPoolName,
      deliveryHub,
      acceptanceDeadline,
      deliveryDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-emerald-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Draft Institutional Price-Lock Contract
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                SOP-07 §3: Pre-sowing guaranteed rate agreement with institutional buyer escrow
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
          {/* Buyer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Corporate Institutional Buyer</label>
              <select
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CORPORATE_BUYERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Farmer Cluster / Pool</label>
              <input
                type="text"
                value={farmerPoolName}
                onChange={(e) => setFarmerPoolName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Maharashtra FPO Federation"
                required
              />
            </div>
          </div>

          {/* Crop & Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Commodity / Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {AVAILABLE_CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Crop Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. JS-335 Certified"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Grade Specifications</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Grade A (Moisture < 10%)"
                required
              />
            </div>
          </div>

          {/* Pricing & Escrow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Contract Quantity (Quintals)</label>
              <input
                type="number"
                min="10"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Govt MSP Baseline (₹/q)</label>
              <input
                type="number"
                min="500"
                value={mspBaseline}
                onChange={(e) => setMspBaseline(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Locked Rate (₹/q)</label>
              <input
                type="number"
                min="500"
                value={ratePerQuintal}
                onChange={(e) => setRatePerQuintal(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-800 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Financial Calculation Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Calculated Escrow Lock Value:</div>
              <div className="text-base font-black font-mono text-emerald-900">
                {fmtRupees(escrowTotal)}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Guaranteed MSP Premium:</div>
              <div className="text-sm font-bold font-mono text-emerald-700">
                +{premiumOverMsp}% over MSP
              </div>
            </div>
            <div className="text-[11px] text-slate-600 max-w-xs font-medium">
              Corporate escrow account will lock <strong className="text-slate-900 font-mono">{fmtRupees(escrowTotal)}</strong> prior to publishing.
            </div>
          </div>

          {/* Dates & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Farmer Acceptance Deadline</label>
              <input
                type="date"
                value={acceptanceDeadline}
                onChange={(e) => setAcceptanceDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Delivery Milestone Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Delivery APMC / Silo Hub</label>
              <input
                type="text"
                value={deliveryHub}
                onChange={(e) => setDeliveryHub(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Dindori Hub, Nashik"
                required
              />
            </div>
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
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Creating Draft...' : 'Save Draft Contract'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
