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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300/80 shadow-2xs">
            <Truck className="w-3 h-3 text-sky-600" /> In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300/80 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Delivered
          </span>
        );
      case 'placed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <Clock className="w-3 h-3 text-amber-600" /> Placed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status, method) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-mono shadow-2xs">
            PAID ({method?.replace('razorpay_', '')?.toUpperCase()})
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 font-mono shadow-2xs">
            REFUNDED
          </span>
        );
      case 'partially_refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 font-mono shadow-2xs">
            PARTIAL REFUND
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 font-mono shadow-2xs">
            PENDING (BNPL)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 font-mono">
            {status?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100/90 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
      {/* Subheader */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/90 via-emerald-100/40 to-teal-50/60 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-emerald-950">Customer Orders & Fulfillment (orders)</span>
          <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs font-mono">
            {orders.length} Orders
          </span>
        </div>
        <div className="text-[11px] font-mono text-emerald-800 hidden sm:block font-medium">
          Razorpay Webhook Verified · Auto-Refund Disbursal Enabled
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 text-emerald-950 uppercase tracking-wider font-bold text-[10px]">
              <th className="py-3.5 px-4 w-28">Order ID</th>
              <th className="py-3.5 px-4 min-w-[190px]">Customer & Destination</th>
              <th className="py-3.5 px-4 min-w-[220px]">Order Items</th>
              <th className="py-3.5 px-4 min-w-[150px]">Total Amount</th>
              <th className="py-3.5 px-3 min-w-[160px]">Payment State</th>
              <th className="py-3.5 px-3 min-w-[140px]">Fulfillment Status</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/70 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No orders match the specified query or status filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onInspectOrder(order)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-emerald-950 font-bold">
                      <span>{order.id}</span>
                      <button
                        onClick={(e) => handleCopyId(order.id, e)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
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
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{order.farmerName}</div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {order.deliveryAddress?.village}, {order.deliveryAddress?.district}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      PIN: {order.deliveryAddress?.pincode} • {order.farmerMobile}
                    </div>
                  </td>

                  {/* Order Items */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-[11px] text-slate-800 font-medium truncate max-w-[210px]">
                          <span className="font-mono text-emerald-700 font-bold">{item.quantity}x</span>{' '}
                          {item.productName}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-mono font-medium">
                          +{order.items.length - 2} more items
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-xs font-extrabold text-slate-900">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </div>
                    {order.deliveryFee > 0 ? (
                      <span className="text-[10px] text-slate-500 block">
                        incl. ₹{order.deliveryFee} shipping
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Free delivery
                      </span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-3">
                    {getPaymentBadge(order.paymentStatus, order.paymentMethod)}
                    {order.razorpayPaymentId && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[140px]">
                        {order.razorpayPaymentId}
                      </span>
                    )}
                    {order.refundAmount > 0 && (
                      <span className="text-[10px] font-mono text-rose-700 block font-bold">
                        Refunded: ₹{order.refundAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  {/* Fulfillment Status */}
                  <td className="py-3.5 px-3">
                    {getOrderStatusBadge(order.orderStatus)}
                    {order.trackingNumber && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5 truncate max-w-[130px]">
                        {order.courierPartner?.split(' ')[0]}: {order.trackingNumber}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectOrder(order)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                        title="View order packing slip and timeline"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Inspect</span>
                      </button>

                      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                        <button
                          onClick={() => onUpdateStatus(order)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-100 hover:bg-sky-200 border border-sky-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
                          title="Update dispatch tracking status"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => onProcessRefund(order)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-100 hover:bg-rose-200 border border-rose-300/70 rounded-xl transition-all active:scale-95 shadow-2xs"
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
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50/60 via-slate-50 to-emerald-50/40 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="font-mono text-[11px] font-medium">
          Showing {orders.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
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
                className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all ${
                  pageNum === pagination.page
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-white text-slate-700 font-medium hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
