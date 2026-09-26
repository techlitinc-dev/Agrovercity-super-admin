import React, { useState } from 'react';
import { X, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

export function BuyerOnboardingModal({
  isOpen,
  onClose,
  onSave,
  loading = false
}) {
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [cin, setCin] = useState('');
  const [gstin, setGstin] = useState('');
  const [nodalEscrowAccount, setNodalEscrowAccount] = useState('');
  const [authorizedSignatory, setAuthorizedSignatory] = useState('');
  const [signatoryMobile, setSignatoryMobile] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [creditRating, setCreditRating] = useState('CRISIL AAA');
  const [verifyImmediately, setVerifyImmediately] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      companyName,
      brandName,
      cin,
      gstin,
      nodalEscrowAccount,
      authorizedSignatory,
      signatoryMobile,
      contactEmail,
      creditRating,
      verifyImmediately
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Onboard Institutional Corporate Buyer
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                SOP-07 §3: Corporate identity, statutory CIN/GSTIN & nodal escrow verification
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Company Legal Entity</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Godrej Agrovet Ltd."
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Brand / Sourcing Division</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Godrej Real Good Chicken / Agro"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">CIN (Corporate Identity Number)</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                placeholder="e.g. L15410MH1991PLC064097"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                placeholder="e.g. 27AAACG0640K1ZV"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Nodal Corporate Escrow Bank & Account</label>
            <input
              type="text"
              value={nodalEscrowAccount}
              onChange={(e) => setNodalEscrowAccount(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. HDFC Bank Corporate Escrow A/c 502000889123"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Authorized Signatory</label>
              <input
                type="text"
                value={authorizedSignatory}
                onChange={(e) => setAuthorizedSignatory(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Vivek Sharma (VP)"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Signatory Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="procurement@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Credit Agency Rating</label>
              <select
                value={creditRating}
                onChange={(e) => setCreditRating(e.target.value)}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CRISIL AAA">CRISIL AAA (Prime Institutional)</option>
                <option value="ICRA AA+">ICRA AA+ (High Safety)</option>
                <option value="CARE AA">CARE AA (Adequate Safety)</option>
                <option value="CRISIL A+">CRISIL A+ (Standard Corporate)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Immediate Verification & Clearance</div>
              <div className="text-[11px] text-slate-500">
                Mark corporate entity as verified and activate price-lock drafting privileges.
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
              <span>{loading ? 'Onboarding...' : 'Onboard Corporate Buyer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
