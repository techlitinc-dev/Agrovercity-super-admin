import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Truck } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'dispatched', label: 'Dispatched / In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export function OrderStatusModal({
  isOpen,
  onClose,
  order,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && order) {
      setOrderStatus(order.orderStatus === 'placed' ? 'confirmed' : order.orderStatus);
      setTrackingNumber(order.trackingNumber || '');
      setCourierPartner(order.courierPartner || '');
      setReason('');
      setError('');
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Administrative fulfillment reason (minimum 8 characters) is required.');
      return;
    }
    onConfirm({
      orderId: order.id,
      orderStatus,
      trackingNumber: trackingNumber.trim(),
      courierPartner: courierPartner.trim(),
      reason: reason.trim()
    });
  };

  const inputCls =
    'w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-emerald-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-100 border border-sky-300 text-sky-800 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Update Order Fulfillment Status</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SOP-06 Lifecycle
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Order <span className="font-mono text-emerald-950 font-bold">{order.id}</span> ({order.farmerName} • {order.farmerMobile})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-emerald-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Current status info */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-2 font-mono">
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Current Status:</span>
              <span className="text-slate-900 font-bold uppercase">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Payment:</span>
              <span className="text-slate-900 font-bold uppercase">{order.paymentStatus} • {order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Order Total:</span>
              <span className="text-emerald-900 font-extrabold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 font-bold mb-1">New Status *</label>
              <select className={inputCls} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Courier Partner</label>
              <input className={inputCls} value={courierPartner} onChange={(e) => setCourierPartner(e.target.value)} placeholder="e.g. Delhivery Agro Logistics" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-800 font-bold mb-1">Tracking Number</label>
              <input className={`${inputCls} font-mono`} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. DLV-AG-991204" />
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-bold">Administrative Justification (Mandatory) *</label>
              <span className="text-[10px] font-mono text-slate-400">Min 8 chars ({reason.length}/8)</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Reason for this lifecycle transition (dispatch confirmation, cancellation, etc.)..."
              className={inputCls}
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              State transition is audit-logged under admin <code className="text-emerald-900 font-mono font-bold">{currentAdmin?.email || 'root@agrovercity'}</code> with previous and new state snapshots.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Transition</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
