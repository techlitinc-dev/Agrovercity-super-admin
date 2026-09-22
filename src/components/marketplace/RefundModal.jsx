import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';

export function RefundModal({
  isOpen,
  onClose,
  order,
  onConfirm,
  loading = false
}) {
  const { currentAdmin } = useAuthAdmin();
  const [refundAmount, setRefundAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && order) {
      setRefundAmount(String(order.totalAmount ?? ''));
      setReason('');
      setError('');
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(refundAmount);
    if (!amount || amount <= 0) {
      setError('A valid refund amount greater than zero is required.');
      return;
    }
    if (amount > order.totalAmount) {
      setError('Refund amount cannot exceed the order total.');
      return;
    }
    if (!reason || reason.trim().length < 8) {
      setError('Refund justification (minimum 8 characters) is mandatory.');
      return;
    }
    onConfirm({
      orderId: order.id,
      refundAmount: amount,
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-100 border border-rose-300 text-rose-800 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Trigger Razorpay Refund</span>
                <span className="text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
                  Financial Action
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Order <span className="font-mono text-emerald-950 font-bold">{order.id}</span> ({order.farmerName})
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

          {/* Payment info */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-2 font-mono">
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Order Total:</span>
              <span className="text-slate-900 font-bold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Payment Method:</span>
              <span className="text-slate-900 font-bold uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-sans font-medium text-slate-500">Razorpay Payment ID:</span>
              <span className="text-slate-900 font-bold">{order.razorpayPaymentId || 'N/A'}</span>
            </div>
            {order.refundAmount > 0 && (
              <div className="flex justify-between text-slate-600 pt-1 border-t border-emerald-100">
                <span className="font-sans font-bold text-slate-700">Already Refunded:</span>
                <span className="text-rose-700 font-bold">₹{Number(order.refundAmount).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-800 font-bold mb-1">Refund Amount (₹) *</label>
            <input
              type="number"
              min="1"
              step="0.01"
              className={inputCls}
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setRefundAmount(String(order.totalAmount))}
                className="text-[10px] font-mono text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                Reset to full amount (₹{Number(order.totalAmount).toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-bold">Refund Justification (Mandatory) *</label>
              <span className="text-[10px] font-mono text-slate-400">Min 8 chars ({reason.length}/8)</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Reason for the refund (cancellation dispute, damaged delivery, undelivered consignment, etc.)..."
              className={inputCls}
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              This is an irreversible financial operation disbursed via the Razorpay gateway. The refund is recorded in <code className="font-mono font-bold text-amber-950">audit_logs</code> under admin <code className="font-mono font-bold text-amber-950">{currentAdmin?.email || 'root@agrovercity'}</code>.
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
              disabled={loading || reason.trim().length < 8 || !Number(refundAmount)}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Disbursing...</span>
                </>
              ) : (
                <span>Trigger Refund</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
