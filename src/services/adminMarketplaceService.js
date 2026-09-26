// Admin Marketplace, Catalog & Orders Service for AGROVERCITY Superadmin
// Implements Module 06: Input Marketplace, Cart, Orders & Payments (SOP-06)
// Target Collections: products, orders, payments, reviews, audit_logs

import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS
} from './mockData';

const PRODUCTS_STORAGE_KEY = 'agrovercity_superadmin_marketplace_products';
const ORDERS_STORAGE_KEY = 'agrovercity_superadmin_marketplace_orders';
const PAYMENTS_STORAGE_KEY = 'agrovercity_superadmin_marketplace_payments';
const REVIEWS_STORAGE_KEY = 'agrovercity_superadmin_marketplace_reviews';
const CARTS_STORAGE_KEY = 'agrovercity_superadmin_marketplace_carts';
const ADDRESSES_STORAGE_KEY = 'agrovercity_superadmin_marketplace_addresses';
const AUDIT_STORAGE_KEY = 'agrovercity_superadmin_audit_logs';

const INITIAL_CARTS = [
  {
    id: "CART-701",
    userId: "USR-1001",
    farmerName: "Ram Patil",
    farmerMobile: "+91 98220 14592",
    district: "Kolhapur",
    items: [
      { productId: "PROD-101", productName: "Mahyco Soybean Seeds JS-335 (30kg Bag)", quantity: 4, unitPrice: 2950, totalPrice: 11800 },
      { productId: "PROD-102", productName: "IFFCO Urea (Neem Coated 45kg)", quantity: 5, unitPrice: 266.5, totalPrice: 1332.5 }
    ],
    totalAmount: 13132.5,
    itemCount: 9,
    lastActive: "2026-09-20T08:10:00.000Z",
    status: "active"
  },
  {
    id: "CART-702",
    userId: "USR-1004",
    farmerName: "Laxman Thorat",
    farmerMobile: "+91 98901 23456",
    district: "Solapur",
    items: [
      { productId: "PROD-105", productName: "KisanKraft Portable Power Sprayer KK-P768", quantity: 1, unitPrice: 9800, totalPrice: 9800 }
    ],
    totalAmount: 9800,
    itemCount: 1,
    lastActive: "2026-09-18T16:20:00.000Z",
    status: "abandoned"
  },
  {
    id: "CART-703",
    userId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    farmerMobile: "+91 97655 43210",
    district: "Yavatmal",
    items: [
      { productId: "PROD-108", productName: "Mahabeej Cotton Hybrid Seeds (RCH-659 BG II)", quantity: 8, unitPrice: 810, totalPrice: 6480 },
      { productId: "PROD-106", productName: "Multiplex Bio-Jeevamrut 5L", quantity: 2, unitPrice: 890, totalPrice: 1780 }
    ],
    totalAmount: 8260,
    itemCount: 10,
    lastActive: "2026-09-20T07:45:00.000Z",
    status: "active"
  },
  {
    id: "CART-704",
    userId: "USR-1006",
    farmerName: "Pandurang Kadam",
    farmerMobile: "+91 98224 55678",
    district: "Satara",
    items: [
      { productId: "PROD-104", productName: "Jain Drip Lateral Pipe 16mm (400m Coil)", quantity: 2, unitPrice: 3150, totalPrice: 6300 }
    ],
    totalAmount: 6300,
    itemCount: 2,
    lastActive: "2026-09-19T14:00:00.000Z",
    status: "abandoned"
  }
];

const INITIAL_ADDRESSES = [
  {
    id: "ADDR-801",
    userId: "USR-1001",
    farmerName: "Ram Patil",
    farmerMobile: "+91 98220 14592",
    addressType: "farm_gate",
    street: "Gat No. 412, Near Gram Panchayat",
    village: "Shiroli",
    taluka: "Karvir",
    district: "Kolhapur",
    state: "Maharashtra",
    pincode: "416122",
    gpsCoordinates: "16.7412° N, 74.2750° E",
    isDefault: true,
    deliveryNotes: "Call before arrival; tractor accessible road from main road"
  },
  {
    id: "ADDR-802",
    userId: "USR-1002",
    farmerName: "Suresh Jadhav",
    farmerMobile: "+91 94231 77610",
    addressType: "farm_gate",
    street: "Nashik-Aurangabad Highway, Post Niphad",
    village: "Niphad",
    taluka: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    pincode: "422303",
    gpsCoordinates: "20.0811° N, 74.1124° E",
    isDefault: true,
    deliveryNotes: "Near Jadhav Krishi Seva Kendra warehouse"
  },
  {
    id: "ADDR-803",
    userId: "USR-1003",
    farmerName: "Mahadev Shinde",
    farmerMobile: "+91 97644 88321",
    addressType: "residence",
    street: "Station Road, Near Turmeric Mandi Yard",
    village: "Miraj",
    taluka: "Miraj",
    district: "Sangli",
    state: "Maharashtra",
    pincode: "416410",
    gpsCoordinates: "16.8252° N, 74.6465° E",
    isDefault: true,
    deliveryNotes: "Commercial APMC shopfront access"
  },
  {
    id: "ADDR-804",
    userId: "USR-1005",
    farmerName: "Anusaya Bai Rathod",
    farmerMobile: "+91 97655 43210",
    addressType: "farm_gate",
    street: "Ward No. 3, Shivaji Nagar",
    village: "Pusad",
    taluka: "Pusad",
    district: "Yavatmal",
    state: "Maharashtra",
    pincode: "445204",
    gpsCoordinates: "19.9056° N, 77.5714° E",
    isDefault: true,
    deliveryNotes: "Deliver to SHG Center next to Anganwadi"
  }
];

function getStoredCarts() {
  const data = localStorage.getItem(CARTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(CARTS_STORAGE_KEY, JSON.stringify(INITIAL_CARTS));
    return INITIAL_CARTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CARTS;
  }
}

function getStoredAddresses() {
  const data = localStorage.getItem(ADDRESSES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(INITIAL_ADDRESSES));
    return INITIAL_ADDRESSES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ADDRESSES;
  }
}

function getStoredProducts() {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(items) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredOrders() {
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

function saveOrders(items) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredPayments() {
  const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
    return INITIAL_PAYMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PAYMENTS;
  }
}

function savePayments(items) {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredReviews() {
  const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

function saveReviews(items) {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(items));
}

function getStoredAuditLogs() {
  const data = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function recordAuditLog({
  adminUid = 'root@agrovercity',
  action,
  targetUserId,
  targetUserName,
  previousState,
  newState,
  reason
}) {
  const logs = getStoredAuditLogs();
  const newLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    adminUid,
    action,
    targetUserId: targetUserId || 'MARKETPLACE_SYSTEM',
    targetUserName: targetUserName || 'Agri-Input Catalog & Orders Engine',
    previousState: previousState || 'N/A',
    newState: newState || 'N/A',
    reason: reason || 'Superadmin marketplace modification (SOP-06)',
    timestamp: new Date().toISOString(),
    ipAddress: '14.139.122.9'
  };
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs));
  return newLog;
}

export const adminMarketplaceService = {
  // 1. List products with query, category, and status filtering
  async listProducts({
    query = '',
    category = 'all',
    status = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 100));
    let products = getStoredProducts();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.distributorFirm.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all' && category !== 'All Categories') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
      products = products.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    const total = products.length;
    const startIndex = (page - 1) * limit;
    const paginated = products.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        products: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 2. Get product details
  async getProduct(id) {
    await new Promise((r) => setTimeout(r, 60));
    const products = getStoredProducts();
    const prod = products.find((p) => p.id === id);
    if (!prod) throw new Error(`Product ${id} not found`);
    return { success: true, data: prod };
  },

  // 3. Create new product SKU
  async createProduct(productData, adminUid = 'root@agrovercity') {
    await new Promise((r) => setTimeout(r, 160));
    const products = getStoredProducts();

    const newId = `PROD-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct = {
      id: newId,
      name: productData.name,
      brand: productData.brand,
      category: productData.category || 'Seeds',
      subCategory: productData.subCategory || 'General',
      sku: productData.sku || `AGR-${productData.category?.slice(0, 3)?.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      mrp: Number(productData.mrp) || Number(productData.price),
      price: Number(productData.price),
      discountPercent: productData.mrp > productData.price ? parseFloat((((productData.mrp - productData.price) / productData.mrp) * 100).toFixed(1)) : 0,
      stockQuantity: Number(productData.stockQuantity) || 0,
      unit: productData.unit || 'Standard Unit',
      qrCertificate: {
        certificateNumber: productData.certificateNumber || `AGM-GOV-${Date.now().toString().slice(-4)}`,
        authority: productData.authority || 'Ministry of Agriculture Certification Agency',
        batchNumber: productData.batchNumber || `BAT-${Date.now().toString().slice(-4)}`,
        labTestDate: new Date().toISOString().split('T')[0],
        verified: Boolean(productData.qrVerified),
        verifiedAt: productData.qrVerified ? new Date().toISOString() : null
      },
      distributorFirm: productData.distributorFirm || 'Agrovercity Direct Fulfillment Depot',
      distributorMobile: productData.distributorMobile || '+91 98000 00000',
      distributorLocation: productData.distributorLocation || 'Maharashtra',
      dealerCommissionPercent: Number(productData.dealerCommissionPercent) || 5.0,
      rating: 5.0,
      reviewsCount: 0,
      status: Number(productData.stockQuantity) > 10 ? 'active' : Number(productData.stockQuantity) > 0 ? 'low_stock' : 'out_of_stock',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&q=80',
      description: productData.description || 'Verified agricultural input catalog item.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);

    const audit = recordAuditLog({
      adminUid,
      action: 'MARKETPLACE_PRODUCT_CREATED',
      targetUserId: newId,
      targetUserName: `${newProduct.name} (${newProduct.sku})`,
      previousState: 'Non-existent',
      newState: `Created SKU ${newProduct.sku} @ ₹${newProduct.price} (${newProduct.stockQuantity} in stock)`,
      reason: 'New product SKU introduced into input marketplace catalog'
    });

    return {
      success: true,
      message: `Product ${newProduct.name} successfully created with SKU ${newProduct.sku}.`,
      product: newProduct,
      auditRecord: audit
    };
  },

  // 4. Update existing product
  async updateProduct(id, productData, adminUid = 'root@agrovercity', reason) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative justification (min 8 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const prev = products[index];
    const newPrice = Number(productData.price) || prev.price;
    const newMrp = Number(productData.mrp) || prev.mrp;
    const newStock = Number(productData.stockQuantity) !== undefined ? Number(productData.stockQuantity) : prev.stockQuantity;

    let newStatus = productData.status || prev.status;
    if (newStock === 0 && newStatus !== 'discontinued') {
      newStatus = 'out_of_stock';
    } else if (newStock <= 15 && newStatus === 'active') {
      newStatus = 'low_stock';
    } else if (newStock > 15 && (newStatus === 'low_stock' || newStatus === 'out_of_stock')) {
      newStatus = 'active';
    }

    const updatedProduct = {
      ...prev,
      ...productData,
      price: newPrice,
      mrp: newMrp,
      stockQuantity: newStock,
      status: newStatus,
      discountPercent: newMrp > newPrice ? parseFloat((((newMrp - newPrice) / newMrp) * 100).toFixed(1)) : 0,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    saveProducts(products);

    const audit = recordAuditLog({
      adminUid,
      action: 'MARKETPLACE_PRODUCT_UPDATED',
      targetUserId: id,
      targetUserName: `${updatedProduct.name} (${updatedProduct.sku})`,
      previousState: `Price ₹${prev.price}, Stock ${prev.stockQuantity}, Status ${prev.status}`,
      newState: `Price ₹${updatedProduct.price}, Stock ${updatedProduct.stockQuantity}, Status ${updatedProduct.status}`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Product SKU ${updatedProduct.sku} updated successfully.`,
      product: updatedProduct,
      auditRecord: audit
    };
  },

  // 5. Verify / Attest Agmark/Ministry QR Certificate
  async verifyQrCertificate({
    id,
    verified,
    authority,
    batchNumber,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('QR Certification audit rationale (min 8 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 140));
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const p = products[index];
    const prevVerified = p.qrCertificate?.verified;

    p.qrCertificate = {
      ...(p.qrCertificate || {}),
      verified,
      authority: authority || p.qrCertificate?.authority || 'Agmarknet Lab Inspector',
      batchNumber: batchNumber || p.qrCertificate?.batchNumber || 'N/A',
      verifiedAt: verified ? new Date().toISOString() : null,
      verifiedBy: adminUid
    };
    p.updatedAt = new Date().toISOString();

    products[index] = p;
    saveProducts(products);

    const audit = recordAuditLog({
      adminUid,
      action: verified ? 'AGMARK_QR_CERTIFICATE_ATTESTED' : 'AGMARK_QR_CERTIFICATE_REVOKED',
      targetUserId: id,
      targetUserName: `${p.name} (${p.sku})`,
      previousState: `Verified: ${prevVerified}`,
      newState: `Verified: ${verified} (Authority: ${p.qrCertificate.authority})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Product ${p.name} QR certificate marked as ${verified ? 'Verified & Genuine' : 'Revoked / Uncertified'}.`,
      product: p,
      auditRecord: audit
    };
  },

  // 6. List orders with full-text search, order status, and payment filters
  async listOrders({
    query = '',
    status = 'all',
    paymentStatus = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 90));
    let orders = getStoredOrders();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      orders = orders.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.farmerMobile.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
        (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
    }

    const total = orders.length;
    const startIndex = (page - 1) * limit;
    const paginated = orders.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        orders: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 7. Update order fulfillment status (placed -> confirmed -> dispatched -> delivered -> cancelled)
  async updateOrderStatus({
    orderId,
    orderStatus,
    trackingNumber,
    courierPartner,
    adminUid = 'root@agrovercity',
    reason
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Administrative fulfillment reason (min 8 characters) is required.');
    }

    await new Promise((r) => setTimeout(r, 160));
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found`);

    const order = orders[index];
    const prevStatus = order.orderStatus;

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber.trim();
    if (courierPartner) order.courierPartner = courierPartner.trim();
    order.updatedAt = new Date().toISOString();

    orders[index] = order;
    saveOrders(orders);

    const audit = recordAuditLog({
      adminUid,
      action: 'MARKETPLACE_ORDER_STATUS_UPDATED',
      targetUserId: order.userId,
      targetUserName: `${order.farmerName} (Order ${order.id})`,
      previousState: `Order status: ${prevStatus}`,
      newState: `Order status: ${orderStatus} (Tracking: ${order.trackingNumber || 'N/A'})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Order ${orderId} status transitioned from ${prevStatus} to ${orderStatus}.`,
      order,
      auditRecord: audit
    };
  },

  // 8. Process Razorpay Refund for Cancelled Orders
  async processRazorpayRefund({
    orderId,
    refundAmount,
    reason,
    adminUid = 'root@agrovercity'
  }) {
    if (!reason || reason.trim().length < 8) {
      throw new Error('Refund justification (min 8 characters) is mandatory.');
    }

    await new Promise((r) => setTimeout(r, 220)); // external gateway simulation
    const orders = getStoredOrders();
    const payments = getStoredPayments();

    const oIndex = orders.findIndex((o) => o.id === orderId);
    if (oIndex === -1) throw new Error(`Order ${orderId} not found`);

    const order = orders[oIndex];
    if (order.paymentStatus === 'refunded') {
      throw new Error(`Order ${orderId} has already been fully refunded.`);
    }

    const refundVal = Number(refundAmount) || order.totalAmount;
    const generatedRefundId = `rfnd_Rp${Math.floor(10000000 + Math.random() * 90000000)}`;

    order.paymentStatus = refundVal >= order.totalAmount ? 'refunded' : 'partially_refunded';
    order.orderStatus = 'cancelled';
    order.refundId = generatedRefundId;
    order.refundAmount = refundVal;
    order.cancellationReason = reason.trim();
    order.updatedAt = new Date().toISOString();

    orders[oIndex] = order;
    saveOrders(orders);

    // Update or add payment refund log
    const pIndex = payments.findIndex((p) => p.orderId === orderId);
    if (pIndex !== -1) {
      payments[pIndex].status = 'refunded';
      payments[pIndex].refundId = generatedRefundId;
      savePayments(payments);
    }

    const audit = recordAuditLog({
      adminUid,
      action: 'RAZORPAY_PAYMENT_REFUND_PROCESSED',
      targetUserId: order.userId,
      targetUserName: `${order.farmerName} (Order ${order.id})`,
      previousState: `Payment: ${order.paymentMethod} (₹${order.totalAmount})`,
      newState: `Refunded ₹${refundVal} via Razorpay Gateway (${generatedRefundId})`,
      reason: reason.trim()
    });

    return {
      success: true,
      message: `Razorpay refund of ₹${refundVal.toLocaleString('en-IN')} committed for Order ${orderId}. Refund ID: ${generatedRefundId}`,
      order,
      refundId: generatedRefundId,
      auditRecord: audit
    };
  },

  // 9. List Payments Audit Ledger
  async listPayments({
    query = '',
    status = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let payments = getStoredPayments();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      payments = payments.filter((p) =>
        p.id.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      payments = payments.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    const total = payments.length;
    const startIndex = (page - 1) * limit;
    const paginated = payments.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        payments: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 10. List Customer Reviews
  async listReviews({
    query = '',
    moderationStatus = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 80));
    let reviews = getStoredReviews();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      reviews = reviews.filter((r) =>
        r.id.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.reviewText.toLowerCase().includes(q)
      );
    }

    if (moderationStatus && moderationStatus !== 'all') {
      reviews = reviews.filter((r) => r.moderationStatus.toLowerCase() === moderationStatus.toLowerCase());
    }

    const total = reviews.length;
    const startIndex = (page - 1) * limit;
    const paginated = reviews.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        reviews: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 11. Moderate Customer Review
  async moderateReview({
    reviewId,
    status, // 'approved' | 'flagged' | 'rejected'
    reason,
    adminUid = 'root@agrovercity'
  }) {
    await new Promise((r) => setTimeout(r, 120));
    const reviews = getStoredReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index === -1) throw new Error(`Review ${reviewId} not found`);

    const rev = reviews[index];
    const prevStatus = rev.moderationStatus;

    rev.moderationStatus = status;
    if (reason) rev.moderationReason = reason.trim();
    rev.updatedAt = new Date().toISOString();

    reviews[index] = rev;
    saveReviews(reviews);

    const audit = recordAuditLog({
      adminUid,
      action: 'CUSTOMER_REVIEW_MODERATED',
      targetUserId: rev.userId,
      targetUserName: `${rev.userName} on ${rev.productName}`,
      previousState: `Review status: ${prevStatus}`,
      newState: `Review status: ${status}`,
      reason: reason ? reason.trim() : `Superadmin review moderation marked as ${status}`
    });

    return {
      success: true,
      message: `Review ${reviewId} updated to ${status}.`,
      review: rev,
      auditRecord: audit
    };
  },

  // 12. Compute Marketplace KPIs
  async getMarketplaceKpis() {
    await new Promise((r) => setTimeout(r, 60));
    const products = getStoredProducts();
    const orders = getStoredOrders();
    const payments = getStoredPayments();

    const totalProducts = products.length;
    const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
    const lowStockCount = products.filter((p) => p.stockQuantity <= 15).length;
    const verifiedQrCount = products.filter((p) => p.qrCertificate?.verified).length;
    const qrCertifiedRate = totalProducts > 0 ? Math.round((verifiedQrCount / totalProducts) * 100) : 0;

    const activeOrders = orders.filter((o) => ['placed', 'confirmed', 'dispatched'].includes(o.orderStatus));
    const totalGmv = orders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const totalRefunded = orders.reduce((acc, o) => acc + (o.refundAmount || 0), 0);

    return {
      totalProducts,
      totalInventoryUnits,
      lowStockCount,
      qrCertifiedRate,
      activeOrdersCount: activeOrders.length,
      totalOrdersCount: orders.length,
      totalGmv,
      totalRefunded
    };
  },

  // 13. List Carts (users/{uid}/cart)
  async listCarts({
    query = '',
    status = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 70));
    let carts = getStoredCarts();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      carts = carts.filter((c) =>
        c.id.toLowerCase().includes(q) ||
        c.userId.toLowerCase().includes(q) ||
        c.farmerName.toLowerCase().includes(q) ||
        c.farmerMobile.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.items.some((it) => it.productName.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      carts = carts.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    const total = carts.length;
    const startIndex = (page - 1) * limit;
    const paginated = carts.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        carts: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 14. Send Cart Recovery Notification / SMS
  async sendCartReminder({ cartId, adminUid = 'root@agrovercity' }) {
    await new Promise((r) => setTimeout(r, 120));
    const carts = getStoredCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new Error(`Cart ${cartId} not found`);

    const audit = recordAuditLog({
      adminUid,
      action: 'CART_RECOVERY_REMINDER_SENT',
      targetUserId: cart.userId,
      targetUserName: `${cart.farmerName} (${cart.farmerMobile})`,
      previousState: `Cart status: ${cart.status}`,
      newState: `Dispatched SMS/WhatsApp recovery ping for ₹${cart.totalAmount.toLocaleString('en-IN')}`,
      reason: 'Admin-initiated abandoned cart recovery notification'
    });

    return {
      success: true,
      message: `Recovery reminder successfully dispatched to ${cart.farmerName} (${cart.farmerMobile}).`,
      auditRecord: audit
    };
  },

  // 15. List Delivery Addresses (users/{uid}/addresses)
  async listAddresses({
    query = '',
    district = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 70));
    let addresses = getStoredAddresses();

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      addresses = addresses.filter((a) =>
        a.id.toLowerCase().includes(q) ||
        a.userId.toLowerCase().includes(q) ||
        a.farmerName.toLowerCase().includes(q) ||
        a.farmerMobile.toLowerCase().includes(q) ||
        a.village.toLowerCase().includes(q) ||
        a.taluka.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.pincode.toLowerCase().includes(q)
      );
    }

    if (district && district !== 'all') {
      addresses = addresses.filter((a) => a.district.toLowerCase() === district.toLowerCase());
    }

    const total = addresses.length;
    const startIndex = (page - 1) * limit;
    const paginated = addresses.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        addresses: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 16. List Statutory Marketplace Audit Logs
  async listMarketplaceAuditLogs({
    query = '',
    action = 'all',
    page = 1,
    limit = 10
  } = {}) {
    await new Promise((r) => setTimeout(r, 60));
    let logs = getStoredAuditLogs();

    // Default seed logs if empty
    if (logs.length === 0) {
      logs = [
        {
          id: 'AUD-8821',
          adminUid: 'root@agrovercity',
          action: 'AGMARK_QR_CERTIFICATE_ATTESTED',
          targetUserId: 'PROD-101',
          targetUserName: 'Mahyco Soybean Seeds JS-335 (AGR-SEE-8841)',
          previousState: 'Verified: false',
          newState: 'Verified: true (Authority: National Seeds Corporation Inspectorate)',
          reason: 'Verified physical batch laboratory report & QR tamper seal against Agmarknet registry.',
          timestamp: '2026-09-20T10:14:00.000Z',
          ipAddress: '14.139.122.9'
        },
        {
          id: 'AUD-8822',
          adminUid: 'root@agrovercity',
          action: 'RAZORPAY_PAYMENT_REFUND_PROCESSED',
          targetUserId: 'USR-1002',
          targetUserName: 'Suresh Jadhav (Order ORD-4003)',
          previousState: 'Payment: netbanking (₹8,900)',
          newState: 'Refunded ₹8,900 via Razorpay Gateway (rfnd_Rp98124501)',
          reason: 'FPO logistics cancellation requested prior to dispatch; full refund processed.',
          timestamp: '2026-09-19T14:32:00.000Z',
          ipAddress: '14.139.122.9'
        },
        {
          id: 'AUD-8823',
          adminUid: 'root@agrovercity',
          action: 'MARKETPLACE_ORDER_STATUS_UPDATED',
          targetUserId: 'USR-1001',
          targetUserName: 'Ram Patil (Order ORD-4001)',
          previousState: 'Order status: confirmed',
          newState: 'Order status: dispatched (Tracking: DELH-AGR-99881)',
          reason: 'Shipped via Delhivery Agri-Express freight hub.',
          timestamp: '2026-09-19T11:00:00.000Z',
          ipAddress: '14.139.122.9'
        }
      ];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      logs = logs.filter((l) =>
        l.id.toLowerCase().includes(q) ||
        l.adminUid.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.targetUserId && l.targetUserId.toLowerCase().includes(q)) ||
        (l.targetUserName && l.targetUserName.toLowerCase().includes(q)) ||
        (l.reason && l.reason.toLowerCase().includes(q))
      );
    }

    if (action && action !== 'all') {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: {
        auditLogs: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      }
    };
  },

  // 17. Reset to default seed
  async resetToDefaultSeed() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(CARTS_STORAGE_KEY, JSON.stringify(INITIAL_CARTS));
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(INITIAL_ADDRESSES));
    return { success: true };
  }
};
