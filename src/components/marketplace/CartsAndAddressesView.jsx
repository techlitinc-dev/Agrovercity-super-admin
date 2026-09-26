import React, { useState } from 'react';
import {
  ShoppingCart,
  MapPin,
  Send,
  Phone,
  Calendar,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  Home,
  Truck,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fmtRupees, fmtDate } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function CartsAndAddressesView({
  carts = [],
  addresses = [],
  cartPagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  addressPagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onCartPageChange,
  onAddressPageChange,
  onSendCartReminder,
  loading = false
}) {
  const [subView, setSubView] = useState('carts'); // 'carts' | 'addresses'
  const [inspectCart, setInspectCart] = useState(null);
  const [inspectAddress, setInspectAddress] = useState(null);
  const [remindingCartId, setRemindingCartId] = useState(null);

  const handleReminderClick = async (cart) => {
    setRemindingCartId(cart.id);
    try {
      if (onSendCartReminder) {
        await onSendCartReminder(cart.id);
      }
    } finally {
      setRemindingCartId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-view Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubView('carts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subView === 'carts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Active & Abandoned Carts</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${subView === 'carts' ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
              {cartPagination.total || carts.length}
            </span>
          </button>

          <button
            onClick={() => setSubView('addresses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subView === 'addresses'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Addresses Directory</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${subView === 'addresses' ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
              {addressPagination.total || addresses.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Collections: <code className="bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded font-mono">users/&#123;uid&#125;/{subView === 'carts' ? 'cart' : 'addresses'}</code></span>
        </div>
      </div>

      {/* VIEW A: Farmer Carts Table */}
      {subView === 'carts' && (
        <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cart & Farmer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Items in Cart</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading farmer carts...</span>
                      </div>
                    </td>
                  </tr>
                ) : carts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ShoppingCart className="w-8 h-8 text-slate-300 mb-1" />
                        <span className="font-semibold text-slate-600">No Cart Records Found</span>
                        <span className="text-xs text-slate-400">No farmer carts match current filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  carts.map((cart) => {
                    const isAbandoned = cart.status === 'abandoned';
                    return (
                      <tr key={cart.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{cart.farmerName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">{cart.id}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{cart.userId}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{cart.farmerMobile}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1 text-slate-800">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{cart.district}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="space-y-1">
                            {cart.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] gap-2">
                                <span className="text-slate-800 font-medium truncate" title={item.productName}>
                                  {item.quantity}× {item.productName}
                                </span>
                                <span className="font-mono text-slate-500 shrink-0 font-bold">
                                  {fmtRupees(item.totalPrice)}
                                </span>
                              </div>
                            ))}
                            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                              {cart.itemCount} total units
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="font-mono font-black text-sm text-slate-900">
                            {fmtRupees(cart.totalAmount)}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAbandoned
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {isAbandoned ? <Clock className="w-3 h-3 text-amber-700" /> : <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                            <span>{isAbandoned ? 'Abandoned' : 'Active'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                          {fmtDate(cart.lastActive)}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectCart(cart)}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              title="Inspect full cart JSON & items"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>

                            {isAbandoned && (
                              <button
                                onClick={() => handleReminderClick(cart)}
                                disabled={remindingCartId === cart.id}
                                className="px-2.5 py-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 shadow-xs"
                                title="Send Recovery SMS to farmer"
                              >
                                <Send className={`w-3 h-3 ${remindingCartId === cart.id ? 'animate-spin' : ''}`} />
                                <span>Recover</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Cart Pagination */}
          {cartPagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-emerald-100/70 bg-emerald-50/20 text-xs">
              <span className="text-slate-500 font-medium">
                Page {cartPagination.page} of {cartPagination.totalPages} ({cartPagination.total} total carts)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCartPageChange && onCartPageChange(cartPagination.page - 1)}
                  disabled={cartPagination.page <= 1}
                  className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCartPageChange && onCartPageChange(cartPagination.page + 1)}
                  disabled={cartPagination.page >= cartPagination.totalPages}
                  className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: Delivery Addresses Table */}
      {subView === 'addresses' && (
        <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50/60 border-b border-emerald-100/90 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Address ID & Farmer</th>
                  <th className="py-3 px-4">Address Type</th>
                  <th className="py-3 px-4">Full Location Details</th>
                  <th className="py-3 px-4">GPS Coordinates</th>
                  <th className="py-3 px-4">Delivery Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading delivery addresses...</span>
                      </div>
                    </td>
                  </tr>
                ) : addresses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <MapPin className="w-8 h-8 text-slate-300 mb-1" />
                        <span className="font-semibold text-slate-600">No Delivery Addresses Found</span>
                        <span className="text-xs text-slate-400">No records found for current criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  addresses.map((addr) => {
                    const isFarmGate = addr.addressType === 'farm_gate';
                    return (
                      <tr key={addr.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{addr.farmerName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-1 rounded">{addr.id}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{addr.userId}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{addr.farmerMobile}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isFarmGate
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}
                            >
                              {isFarmGate ? <Truck className="w-3 h-3 text-emerald-700" /> : <Home className="w-3 h-3 text-blue-700" />}
                              <span>{isFarmGate ? 'Farm-Gate Hub' : 'Residence'}</span>
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                Default Address
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-sm">
                          <div className="text-slate-900 font-medium">{addr.street}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {addr.village}, Tal: {addr.taluka}, Dist: <strong className="text-slate-700">{addr.district}</strong>
                          </div>
                          <div className="text-[11px] font-mono text-emerald-800 font-bold mt-0.5">
                            {addr.state} — PIN {addr.pincode}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                          {addr.gpsCoordinates ? (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-1 rounded-lg border border-slate-200 font-bold">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{addr.gpsCoordinates}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not Geo-Tagged</span>
                          )}
                        </td>

                        <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600">
                          {addr.deliveryNotes ? (
                            <div className="bg-amber-50/70 border border-amber-200/70 text-amber-900 p-1.5 rounded-lg italic">
                              "{addr.deliveryNotes}"
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setInspectAddress(addr)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1 shadow-xs ml-auto"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Address Pagination */}
          {addressPagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-emerald-100/70 bg-emerald-50/20 text-xs">
              <span className="text-slate-500 font-medium">
                Page {addressPagination.page} of {addressPagination.totalPages} ({addressPagination.total} total addresses)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAddressPageChange && onAddressPageChange(addressPagination.page - 1)}
                  disabled={addressPagination.page <= 1}
                  className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onAddressPageChange && onAddressPageChange(addressPagination.page + 1)}
                  disabled={addressPagination.page >= addressPagination.totalPages}
                  className="p-1 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cart Detail Slide-Over Drawer */}
      <DetailDrawer
        open={Boolean(inspectCart)}
        onClose={() => setInspectCart(null)}
        title={inspectCart ? `Farmer Cart: ${inspectCart.id}` : ''}
        subtitle={inspectCart ? `${inspectCart.farmerName} • ${inspectCart.farmerMobile}` : ''}
      >
        {inspectCart && (
          <>
            <DrawerSection title="Cart Details">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Cart ID" v={inspectCart.id} mono />
                <KeyValue k="Farmer Name" v={inspectCart.farmerName} />
                <KeyValue k="Farmer User ID" v={inspectCart.userId} mono />
                <KeyValue k="Mobile" v={inspectCart.farmerMobile} />
                <KeyValue k="District" v={inspectCart.district} />
                <KeyValue k="Status" v={inspectCart.status.toUpperCase()} />
                <KeyValue k="Last Active" v={fmtDate(inspectCart.lastActive)} />
                <KeyValue k="Estimated Total" v={fmtRupees(inspectCart.totalAmount)} mono />
              </Card>
            </DrawerSection>

            <DrawerSection title="Itemized Cart Products">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                {inspectCart.items.map((it, i) => (
                  <div key={i} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{it.productName}</span>
                      <span className="font-mono font-black text-emerald-800">{fmtRupees(it.totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Product SKU: <code className="font-mono text-emerald-700">{it.productId}</code></span>
                      <span>Qty: {it.quantity} × {fmtRupees(it.unitPrice)}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Cart JSON">
              <DocJson doc={inspectCart} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      {/* Address Detail Slide-Over Drawer */}
      <DetailDrawer
        open={Boolean(inspectAddress)}
        onClose={() => setInspectAddress(null)}
        title={inspectAddress ? `Delivery Address: ${inspectAddress.id}` : ''}
        subtitle={inspectAddress ? `${inspectAddress.farmerName} (${inspectAddress.farmerMobile})` : ''}
      >
        {inspectAddress && (
          <>
            <DrawerSection title="Location Profile">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Address ID" v={inspectAddress.id} mono />
                <KeyValue k="User ID" v={inspectAddress.userId} mono />
                <KeyValue k="Type" v={inspectAddress.addressType === 'farm_gate' ? 'Farm-Gate Logistics Hub' : 'Residence'} />
                <KeyValue k="Street / Gat No." v={inspectAddress.street} />
                <KeyValue k="Village & Taluka" v={`${inspectAddress.village}, ${inspectAddress.taluka}`} />
                <KeyValue k="District & State" v={`${inspectAddress.district}, ${inspectAddress.state}`} />
                <KeyValue k="Pincode" v={inspectAddress.pincode} mono />
                <KeyValue k="GPS Coordinates" v={inspectAddress.gpsCoordinates || 'N/A'} mono />
                <KeyValue k="Default Status" v={inspectAddress.isDefault ? 'Primary Default Address' : 'Secondary'} />
              </Card>
            </DrawerSection>

            {inspectAddress.deliveryNotes && (
              <DrawerSection title="Fulfillment & Tractor Access Notes">
                <Card className="px-4 py-3 bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium">
                  {inspectAddress.deliveryNotes}
                </Card>
              </DrawerSection>
            )}

            <DrawerSection title="Raw Address JSON">
              <DocJson doc={inspectAddress} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
