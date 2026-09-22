import React, { useState } from 'react';
import { ShieldAlert, X, Check, Lock, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function StatusChangeModal({ isOpen, onClose, user, onConfirm }) {
  const { currentAdmin } = useAuthAdmin();
  const [selectedStatus, setSelectedStatus] = useState(user?.status || 'verified');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 6) {
      setError('An administrative reason (minimum 6 characters) is mandatory.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onConfirm({ uid: user.uid, status: selectedStatus, reason });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update account status');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      id: 'verified',
      label: 'Verified & Active',
      desc: 'Account in good standing; full access to multi-persona profiles, farm diary, and marketplace.',
      icon: UserCheck,
      color: 'border-emerald-300 bg-emerald-50/80 text-emerald-900'
    },
    {
      id: 'pending',
      label: 'Pending KYC Review',
      desc: 'Account awaiting 7/12 land deed verification, APMC license, or phone KYC.',
      icon: AlertTriangle,
      color: 'border-amber-300 bg-amber-50/80 text-amber-900'
    },
    {
      id: 'flagged',
      label: 'Flagged Anomaly / Dispute',
      desc: 'Security review pending. Dispute raised by counterparty on produce or transport contract.',
      icon: ShieldAlert,
      color: 'border-rose-300 bg-rose-50/80 text-rose-900'
    },
    {
      id: 'suspended',
      label: 'Suspended Account',
      desc: 'Administrative ban. All persona listings hidden; transactions paused.',
      icon: UserX,
      color: 'border-orange-300 bg-orange-50/80 text-orange-900'
    },
    {
      id: 'locked',
      label: 'Locked Out',
      desc: 'Security lockdown. MPIN authentication halted due to excessive failures.',
      icon: Lock,
      color: 'border-red-300 bg-red-50/80 text-red-900'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-white/95 border border-emerald-200/90 rounded-2xl shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                <ShieldAlert className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Set User Account Status</h3>
                <span className="text-xs text-slate-500 font-mono">
                  PUT /v1/admin/users/{user.id}/status (SOP-02)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* User Target Card */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">{user.name}</span>
                <div className="text-slate-600 font-mono text-[11px]">{user.mobile} · Current: <span className="font-bold text-emerald-800 uppercase">{user.status}</span></div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white text-emerald-900 border border-emerald-200 shadow-2xs">
                {user.id}
              </span>
            </div>

            {/* Select Status Radio Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select New Status:
              </label>
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedStatus === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedStatus(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? `${opt.color} ring-2 ring-emerald-500 shadow-2xs`
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountStatus"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.id)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5 font-medium">{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Mandatory Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Administrative Reason (Immutable Audit Log) *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows="2"
                placeholder="Enter justification for this status modification..."
                className="w-full px-3.5 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans shadow-2xs"
                required
              />
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">
                Admin: <strong className="text-slate-800">{currentAdmin.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim() || selectedStatus === user.status}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Commit Status Change</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
