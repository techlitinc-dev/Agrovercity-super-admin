import React, { useState } from 'react';
import { ShieldAlert, X, Check, Lock, Unlock, UserX, UserCheck, AlertTriangle } from 'lucide-react';
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
    if (!reason.trim() || reason.trim().length < 8) {
      setError('An administrative reason (minimum 8 characters) is mandatory.');
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
      desc: 'Account in good standing; full access to marketplace, banking, and farm tools.',
      icon: UserCheck,
      color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400'
    },
    {
      id: 'pending',
      label: 'Pending Setup',
      desc: 'Account awaiting user MPIN creation or phone OTP onboarding.',
      icon: AlertTriangle,
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-400'
    },
    {
      id: 'flagged',
      label: 'Flagged Anomaly',
      desc: 'Security review pending. Unusual TOR IP access or suspicious bidding detected.',
      icon: ShieldAlert,
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-400'
    },
    {
      id: 'locked',
      label: 'Locked Out',
      desc: 'Temporarily blocked due to excessive failed MPIN / OTP attempts.',
      icon: Lock,
      color: 'border-red-500/50 bg-red-950/20 text-red-400'
    },
    {
      id: 'suspended',
      label: 'Suspended Account',
      desc: 'Administrative ban. All active sessions invalidated; login disallowed.',
      icon: UserX,
      color: 'border-orange-500/50 bg-orange-950/20 text-orange-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-lg p-6 my-8 text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Modify Account Status</h3>
                <span className="text-xs text-slate-400 font-mono">
                  PUT /v1/admin/auth/users/{user.id}/status
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* User Target Card */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{user.name}</span>
                <div className="text-slate-400 font-mono text-[11px]">{user.mobile} · Current: {user.status}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300">
                {user.id}
              </span>
            </div>

            {/* Select Status Radio Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
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
                        ? `${opt.color} ring-1 ring-emerald-500`
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountStatus"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.id)}
                      className="mt-0.5 text-emerald-500 focus:ring-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Mandatory Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Administrative Reason (Immutable Audit Log)
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                rows="2"
                placeholder="Enter justification for this status modification..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                required
              />
            </div>

            {error && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Admin: <strong className="text-slate-200">{currentAdmin.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason.trim() || selectedStatus === user.status}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5 disabled:opacity-40"
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
