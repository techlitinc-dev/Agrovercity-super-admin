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
    'w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-sky-500 focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Update Order Fulfillment Status</span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  SOP-06 Lifecycle
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Order <span className="font-mono text-white font-semibold">{order.id}</span> ({order.farmerName} • {order.farmerMobile})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current status info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-white font-bold uppercase">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment:</span>
              <span className="text-white font-bold uppercase">{order.paymentStatus} • {order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Order Total:</span>
              <span className="text-white font-bold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">New Status *</label>
              <select className={inputCls} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Courier Partner</label>
              <input className={inputCls} value={courierPartner} onChange={(e) => setCourierPartner(e.target.value)} placeholder="e.g. Delhivery Agro Logistics" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Tracking Number</label>
              <input className={`${inputCls} font-mono`} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. DLV-AG-991204" />
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Administrative Justification (Mandatory) *</label>
              <span className="text-[10px] font-mono text-slate-500">Min 8 chars ({reason.length}/8)</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Reason for this lifecycle transition (dispatch confirmation, cancellation, etc.)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span>
              State transition is audit-logged under admin <code className="text-slate-300 font-mono">{currentAdmin?.email || 'root@agrovercity'}</code> with previous and new state snapshots.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-lg shadow-sky-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
