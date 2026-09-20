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
    'w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-rose-500 focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Trigger Razorpay Refund</span>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded">
                  Financial Action
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Order <span className="font-mono text-white font-semibold">{order.id}</span> ({order.farmerName})
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

          {/* Payment info */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Order Total:</span>
              <span className="text-white font-bold">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Method:</span>
              <span className="text-white font-bold uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Razorpay Payment ID:</span>
              <span className="text-white font-bold">{order.razorpayPaymentId || 'N/A'}</span>
            </div>
            {order.refundAmount > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Already Refunded:</span>
                <span className="text-rose-400 font-bold">₹{Number(order.refundAmount).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Refund Amount (₹) *</label>
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
                className="text-[10px] font-mono text-sky-400 hover:text-sky-300"
              >
                Reset to full amount (₹{Number(order.totalAmount).toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Refund Justification (Mandatory) *</label>
              <span className="text-[10px] font-mono text-slate-500">Min 8 chars ({reason.length}/8)</span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Reason for the refund (cancellation dispute, damaged delivery, undelivered consignment, etc.)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/60">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              This is an irreversible financial operation disbursed via the Razorpay gateway. The refund is recorded in <code className="font-mono">audit_logs</code> under admin <code className="font-mono">{currentAdmin?.email || 'root@agrovercity'}</code>.
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
              disabled={loading || reason.trim().length < 8 || !Number(refundAmount)}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-950/50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
