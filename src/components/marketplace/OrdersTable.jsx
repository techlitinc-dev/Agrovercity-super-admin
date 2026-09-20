import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  RotateCcw,
  Eye,
  Sliders
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function OrdersTable({
  orders = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onInspectOrder,
  onUpdateStatus,
  onProcessRefund,
  loading = false
}) {
  const { addToast } = useNotification();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({ title: 'Copied', message: `Order ID ${id} copied`, type: 'info' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Confirmed
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-600/30">
            <Truck className="w-3 h-3 text-sky-400" /> In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/30">
            <CheckCircle2 className="w-3 h-3 text-teal-400" /> Delivered
          </span>
        );
      case 'placed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30">
            <Clock className="w-3 h-3 text-amber-400" /> Placed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-700 font-bold">
            <XCircle className="w-3 h-3 text-rose-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status, method) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30 font-mono">
            PAID ({method?.replace('razorpay_', '')?.toUpperCase()})
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-700 font-mono">
            REFUNDED
          </span>
        );
      case 'partially_refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-700 font-mono">
            PARTIAL REFUND
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/30 font-mono">
            PENDING (BNPL)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 font-mono">
            {status?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Customer Orders & Fulfillment (orders)</span>
          <span className="text-xs bg-sky-950 text-sky-400 border border-sky-600/30 px-2 py-0.5 rounded font-mono">
            {orders.length} Orders
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Razorpay Webhook Verified · Auto-Refund Disbursal Enabled
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4 w-28">Order ID</th>
              <th className="py-3 px-4 min-w-[190px]">Customer & Destination</th>
              <th className="py-3 px-4 min-w-[220px]">Order Items</th>
              <th className="py-3 px-4 min-w-[150px]">Total Amount</th>
              <th className="py-3 px-3 min-w-[160px]">Payment State</th>
              <th className="py-3 px-3 min-w-[140px]">Fulfillment Status</th>
              <th className="py-3 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No orders match the specified query or status filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onInspectOrder(order)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300 font-bold">
                      <span>{order.id}</span>
                      <button
                        onClick={(e) => handleCopyId(order.id, e)}
                        className="text-slate-500 hover:text-sky-400 transition-colors"
                        title="Copy Order ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>

                  {/* Customer & Location */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{order.farmerName}</div>
                    <div className="text-[11px] text-slate-400">
                      {order.deliveryAddress?.village}, {order.deliveryAddress?.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      PIN: {order.deliveryAddress?.pincode} • {order.farmerMobile}
                    </div>
                  </td>

                  {/* Order Items */}
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-[11px] text-slate-200 truncate max-w-[210px]">
                          <span className="font-mono text-emerald-400 font-bold">{item.quantity}x</span>{' '}
                          {item.productName}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          +{order.items.length - 2} more items
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-xs font-extrabold text-white">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    {order.deliveryFee > 0 ? (
                      <span className="text-[10px] text-slate-500 block">
                        incl. ₹{order.deliveryFee} shipping
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 block">
                        Free delivery
                      </span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3 px-3">
                    {getPaymentBadge(order.paymentStatus, order.paymentMethod)}
                    {order.razorpayPaymentId && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[140px]">
                        {order.razorpayPaymentId}
                      </span>
                    )}
                    {order.refundAmount > 0 && (
                      <span className="text-[10px] font-mono text-rose-400 block font-bold">
                        Refunded: ₹{order.refundAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-3 px-3">
                    {getOrderStatusBadge(order.orderStatus)}
                    {order.trackingNumber && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5 truncate max-w-[130px]">
                        {order.courierPartner?.split(' ')[0]}: {order.trackingNumber}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectOrder(order)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        title="View order packing slip and timeline"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Inspect</span>
                      </button>

                      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                        <button
                          onClick={() => onUpdateStatus(order)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-600 border border-sky-600/40 rounded-md transition-colors"
                          title="Update dispatch tracking status"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => onProcessRefund(order)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/40 rounded-md transition-colors"
                          title="Trigger Razorpay refund for cancellation or dispute"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px]">
          Showing {orders.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
