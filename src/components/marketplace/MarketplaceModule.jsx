import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminMarketplaceService } from '../../services/adminMarketplaceService';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';
import { fmtRupees, fmtDate } from '../../lib/format.js';

import { MarketplaceMetricBar } from './MarketplaceMetricBar';
import { MarketplaceSearchAndFilterBar } from './MarketplaceSearchAndFilterBar';
import { ProductsTable } from './ProductsTable';
import { OrdersTable } from './OrdersTable';
import { PaymentsTable } from './PaymentsTable';
import { ReviewsModerationTable } from './ReviewsModerationTable';
import { ProductDetailDrawer } from './ProductDetailDrawer';
import { ProductFormModal } from './ProductFormModal';
import { QrVerificationModal } from './QrVerificationModal';
import { OrderStatusModal } from './OrderStatusModal';
import { RefundModal } from './RefundModal';

export function MarketplaceModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'products' | 'orders' | 'payments' | 'reviews'
  const [activeTab, setActiveTab] = useState('products');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data states
  const [kpis, setKpis] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectProduct, setInspectProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [qrModalProduct, setQrModalProduct] = useState(null);
  const [inspectOrder, setInspectOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [refundModalOrder, setRefundModalOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminMarketplaceService.getMarketplaceKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load marketplace KPIs', e);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (activeTab === 'products') {
        const res = await adminMarketplaceService.listProducts({
          ...params,
          query: searchQuery,
          category: categoryFilter,
          status: statusFilter
        });
        if (res.success) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'orders') {
        const res = await adminMarketplaceService.listOrders({
          ...params,
          query: searchQuery,
          status: statusFilter
        });
        if (res.success) {
          setOrders(res.data.orders);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'payments') {
        const res = await adminMarketplaceService.listPayments({
          ...params,
          query: searchQuery,
          status: statusFilter
        });
        if (res.success) {
          setPayments(res.data.payments);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'reviews') {
        const res = await adminMarketplaceService.listReviews({
          ...params,
          query: searchQuery,
          moderationStatus: statusFilter
        });
        if (res.success) {
          setReviews(res.data.reviews);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Fetching Marketplace Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, categoryFilter, statusFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page & selection whenever tab or filters change
  useEffect(() => {
    setPage(1);
    setSelectedProductIds([]);
  }, [activeTab, searchQuery, categoryFilter, statusFilter]);

  // ---- Product actions ----
  const handleSaveProduct = async (payload) => {
    setActionLoading(true);
    try {
      const res = editProduct
        ? await adminMarketplaceService.updateProduct(editProduct.id, payload, currentAdmin?.email, 'Catalog edit from superadmin panel (SOP-06)')
        : await adminMarketplaceService.createProduct(payload, currentAdmin?.email);
      addToast({
        title: editProduct ? 'Product SKU Updated' : 'Product SKU Created',
        message: res.message,
        type: 'success'
      });
      setCreatingProduct(false);
      setEditProduct(null);
      setInspectProduct(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Save Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmQr = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminMarketplaceService.verifyQrCertificate({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'QR Certificate Updated',
        message: res.message,
        type: 'success'
      });
      setQrModalProduct(null);
      if (inspectProduct && inspectProduct.id === data.id) {
        setInspectProduct(res.product);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'QR Attestation Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ---- Order actions ----
  const handleConfirmStatus = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminMarketplaceService.updateOrderStatus({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Order Status Updated',
        message: res.message,
        type: 'success'
      });
      setStatusModalOrder(null);
      if (inspectOrder && inspectOrder.id === data.orderId) {
        setInspectOrder(res.order);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Status Transition Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRefund = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminMarketplaceService.processRazorpayRefund({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Razorpay Refund Processed',
        message: res.message,
        type: 'success'
      });
      setRefundModalOrder(null);
      if (inspectOrder && inspectOrder.id === data.orderId) {
        setInspectOrder(res.order);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Refund Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ---- Review moderation ----
  const handleModerateReview = async (reviewId, status, reason) => {
    try {
      const res = await adminMarketplaceService.moderateReview({
        reviewId,
        status,
        reason,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Review Moderated',
        message: res.message,
        type: 'info'
      });
      fetchData();
    } catch (err) {
      addToast({
        title: 'Moderation Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // ---- Export helpers ----
  const downloadFile = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeRows =
    activeTab === 'products' ? products :
    activeTab === 'orders' ? orders :
    activeTab === 'payments' ? payments :
    reviews;

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'products') {
      csvContent += 'Product ID,SKU,Name,Brand,Category,MRP (INR),Price (INR),Discount %,Stock,Unit,Distributor,Dealer Commission %,QR Verified,Status\n';
      products.forEach((p) => {
        csvContent += `"${p.id}","${p.sku}","${p.name}","${p.brand}","${p.category}",${p.mrp},${p.price},${p.discountPercent},${p.stockQuantity},"${p.unit}","${p.distributorFirm}",${p.dealerCommissionPercent},"${p.qrCertificate?.verified ? 'YES' : 'NO'}","${p.status}"\n`;
      });
    } else if (activeTab === 'orders') {
      csvContent += 'Order ID,Buyer ID,Farmer Name,Mobile,Items Count,Subtotal,Tax,Delivery Fee,Total (INR),Payment Method,Payment Status,Order Status,Tracking,Courier,Refund ID,Refund Amount,Created\n';
      orders.forEach((o) => {
        csvContent += `"${o.id}","${o.userId}","${o.farmerName}","${o.farmerMobile}",${o.items?.length || 0},${o.subtotal},${o.taxAmount},${o.deliveryFee},${o.totalAmount},"${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}","${o.trackingNumber || 'N/A'}","${o.courierPartner || 'N/A'}","${o.refundId || 'N/A'}",${o.refundAmount || 0},"${o.createdAt}"\n`;
      });
    } else if (activeTab === 'payments') {
      csvContent += 'Payment ID,Order ID,Buyer ID,Farmer Name,Amount (INR),Currency,Method,Razorpay Payment ID,Razorpay Order ID,Fee,Tax,Status,Refund ID,Created\n';
      payments.forEach((p) => {
        csvContent += `"${p.id}","${p.orderId}","${p.userId}","${p.farmerName}",${p.amount},"${p.currency}","${p.method}","${p.razorpayPaymentId}","${p.razorpayOrderId}",${p.fee},${p.tax},"${p.status}","${p.refundId || 'N/A'}","${p.createdAt}"\n`;
      });
    } else {
      csvContent += 'Review ID,Product ID,Product Name,Buyer ID,Buyer Name,Rating,Review Text,Verified Purchase,Moderation Status,Created\n';
      reviews.forEach((r) => {
        csvContent += `"${r.id}","${r.productId}","${r.productName}","${r.userId}","${r.userName}",${r.rating},"${r.reviewText}","${r.verifiedPurchase ? 'YES' : 'NO'}","${r.moderationStatus}","${r.createdAt}"\n`;
      });
    }

    downloadFile(decodeURI(csvContent), `agrovercity_marketplace_${activeTab}_${Date.now()}.csv`, 'text/csv');
    addToast({
      title: 'CSV Export Downloaded',
      message: `Exported marketplace ${activeTab} dataset snapshot.`,
      type: 'info'
    });
  };

  const handleExportJson = () => {
    downloadFile(JSON.stringify(activeRows, null, 2), `agrovercity_marketplace_${activeTab}_${Date.now()}.json`, 'application/json');
    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON payload for ${activeRows.length} records.`,
      type: 'info'
    });
  };

  const orderAddress = (o) =>
    o.deliveryAddress
      ? `${o.deliveryAddress.street}, ${o.deliveryAddress.village}, ${o.deliveryAddress.district}, ${o.deliveryAddress.state} - ${o.deliveryAddress.pincode}`
      : '—';

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-emerald-400" />
              <span>Input Marketplace, Cart, Orders & Payments</span>
            </h1>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
              SOP-06
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized oversight of the agri-input catalog, Agmark/Ministry QR certification, order lifecycle fulfillment, Razorpay refunds & customer review moderation.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Razorpay Settlement Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <MarketplaceMetricBar kpis={kpis} loading={loading} />

      {/* 3. Search & Filter Bar */}
      <MarketplaceSearchAndFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddNewProduct={() => setCreatingProduct(true)}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        loading={loading}
      />

      {/* 4. Active Tab Data Grid */}
      {activeTab === 'products' && (
        <ProductsTable
          products={products}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectProduct={setInspectProduct}
          onVerifyQr={(product) => setQrModalProduct(product)}
          loading={loading}
          selectedIds={selectedProductIds}
          setSelectedIds={setSelectedProductIds}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersTable
          orders={orders}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectOrder={setInspectOrder}
          onUpdateStatus={(order) => setStatusModalOrder(order)}
          onProcessRefund={(order) => setRefundModalOrder(order)}
          loading={loading}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsTable
          payments={payments}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsModerationTable
          reviews={reviews}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onModerateReview={handleModerateReview}
          loading={loading}
        />
      )}

      {/* 5. Product Detail Slide-Over Drawer */}
      <ProductDetailDrawer
        isOpen={Boolean(inspectProduct)}
        onClose={() => setInspectProduct(null)}
        product={inspectProduct}
        onEditProduct={(product) => {
          setInspectProduct(null);
          setEditProduct(product);
        }}
        onVerifyQr={(product) => setQrModalProduct(product)}
      />

      {/* 6. Order Detail Slide-Over Drawer */}
      <DetailDrawer
        open={Boolean(inspectOrder)}
        onClose={() => setInspectOrder(null)}
        title={inspectOrder ? `Order ${inspectOrder.id}` : ''}
        subtitle={inspectOrder ? `${inspectOrder.farmerName} • ${inspectOrder.farmerMobile}` : ''}
      >
        {inspectOrder && (
          <>
            <DrawerSection title="Order Summary">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                <KeyValue k="Order ID" v={inspectOrder.id} mono />
                <KeyValue k="Buyer" v={`${inspectOrder.farmerName} (${inspectOrder.userId})`} />
                <KeyValue k="Status" v={inspectOrder.orderStatus} />
                <KeyValue k="Placed" v={fmtDate(inspectOrder.createdAt)} />
                <KeyValue k="Last Updated" v={fmtDate(inspectOrder.updatedAt)} />
              </Card>
            </DrawerSection>
            <DrawerSection title="Payment">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                <KeyValue k="Method" v={inspectOrder.paymentMethod.toUpperCase()} />
                <KeyValue k="Payment Status" v={inspectOrder.paymentStatus} />
                <KeyValue k="Razorpay Order / Payment" v={inspectOrder.razorpayOrderId ? `${inspectOrder.razorpayOrderId} · ${inspectOrder.razorpayPaymentId}` : '—'} mono />
                <KeyValue k="Refund" v={inspectOrder.refundId ? `${inspectOrder.refundId} (₹${Number(inspectOrder.refundAmount).toLocaleString('en-IN')})` : '—'} mono />
                <KeyValue k="Total" v={fmtRupees(inspectOrder.totalAmount)} mono />
              </Card>
            </DrawerSection>
            <DrawerSection title="Items & Delivery">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                {(inspectOrder.items || []).map((it, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-300">{it.quantity}× {it.productName}</span>
                    <span className="font-mono text-xs text-slate-400">{fmtRupees(it.totalPrice)}</span>
                  </div>
                ))}
                <KeyValue k="Delivery Address" v={orderAddress(inspectOrder)} />
                <KeyValue k="Tracking" v={inspectOrder.trackingNumber ? `${inspectOrder.courierPartner || 'Courier'} · ${inspectOrder.trackingNumber}` : '—'} mono />
              </Card>
            </DrawerSection>
            {inspectOrder.cancellationReason && (
              <DrawerSection title="Cancellation">
                <Card className="px-4 py-3 text-xs text-rose-300">{inspectOrder.cancellationReason}</Card>
              </DrawerSection>
            )}
            <DrawerSection title="Document JSON">
              <DocJson doc={inspectOrder} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      {/* 7. Product Create / Edit Modal */}
      <ProductFormModal
        isOpen={creatingProduct || Boolean(editProduct)}
        onClose={() => {
          setCreatingProduct(false);
          setEditProduct(null);
        }}
        product={editProduct}
        onSave={handleSaveProduct}
        loading={actionLoading}
      />

      {/* 8. QR Certificate Verification Modal */}
      <QrVerificationModal
        isOpen={Boolean(qrModalProduct)}
        onClose={() => setQrModalProduct(null)}
        product={qrModalProduct}
        onConfirm={handleConfirmQr}
        loading={actionLoading}
      />

      {/* 9. Order Status Transition Modal */}
      <OrderStatusModal
        isOpen={Boolean(statusModalOrder)}
        onClose={() => setStatusModalOrder(null)}
        order={statusModalOrder}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
      />

      {/* 10. Razorpay Refund Modal */}
      <RefundModal
        isOpen={Boolean(refundModalOrder)}
        onClose={() => setRefundModalOrder(null)}
        order={refundModalOrder}
        onConfirm={handleConfirmRefund}
        loading={actionLoading}
      />
    </div>
  );
}
