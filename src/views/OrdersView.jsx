import { useState } from 'react'
import { IndianRupee, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, KeyValue } from '../components/ui.jsx'
import DetailDrawer, { DrawerSection, DocJson } from '../components/DetailDrawer.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { fmtRupees, fmtDate } from '../lib/format.js'

const TIMELINE = ['placed', 'confirmed', 'packed', 'shipped', 'outForDelivery', 'delivered']

export default function OrdersView({ rows, onRefresh, refundOrder }) {
  const [detail, setDetail] = useState(null)
  const [refunding, setRefunding] = useState(null)
  const [busy, setBusy] = useState(false)
  const [lastError, setLastError] = useState('')

  const refundable = (o) => o.status === 'cancelled' && o.paymentStatus === 'paid' && o.refundStatus !== 'refunded'

  const columns = [
    { key: 'orderId', label: 'Order ID', value: (r) => r.orderId, mono: true, cls: 'text-slate-400' },
    { key: 'buyer', label: 'Buyer', value: (r) => (
        <div>
          <p className="font-medium text-slate-100">{r.userName || r.userId}</p>
          <p className="font-mono text-xs text-slate-500">{r.userId}</p>
        </div>
      ) },
    { key: 'items', label: 'Items', value: (r) => (
        <span className="text-xs text-slate-400">{r.items.map((it) => `${it.quantity}× ${it.title}`).join(', ')}</span>
      ) },
    { key: 'total', label: 'Total', value: (r) => fmtRupees(r.total), mono: true },
    { key: 'payment', label: 'Payment', value: (r) => (
        <div className="flex items-center gap-2">
          <Badge value={r.paymentStatus} />
          <span className="text-xs uppercase text-slate-500">{r.paymentMethod}</span>
        </div>
      ) },
    { key: 'refund', label: 'Refund', value: (r) => (
        r.refundStatus && r.refundStatus !== 'notApplicable'
          ? <Badge value={r.refundStatus} />
          : <span className="text-xs text-slate-600">—</span>
      ) },
    { key: 'status', label: 'Order Status', value: (r) => <Badge value={r.status} /> },
    { key: 'createdAt', label: 'Placed', value: (r) => fmtDate(r.createdAt), cls: 'text-slate-400' },
    { key: 'actions', label: 'Actions', value: (r) => (
        refundable(r)
          ? <Button variant="danger" className="px-2 py-1 text-xs" onClick={(e) => { e.stopPropagation(); setRefunding(r) }}>
              <RotateCcw className="h-3.5 w-3.5" /> Refund
            </Button>
          : null
      ) },
  ]

  const submitRefund = async (reason) => {
    setBusy(true)
    setLastError('')
    try {
      await refundOrder(refunding, reason)
      setRefunding(null)
      setDetail(null)
      onRefresh()
    } catch (e) {
      setLastError(e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-3">
      {lastError && <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{lastError}</div>}
      <p className="text-sm text-slate-400">{rows.length} orders in range</p>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
                {columns.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || r.orderId} onClick={() => setDetail(r)} className="cursor-pointer border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40">
                  {columns.map((c) => (
                    <td key={c.key} className={`max-w-[260px] truncate whitespace-nowrap px-4 py-3 ${c.mono ? 'font-mono text-xs' : ''} ${c.cls || 'text-slate-300'}`}>
                      {c.value(r)}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500">No orders match the current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={`Order ${detail?.orderId || ''}`} subtitle={detail && `buyer ${detail.userId}`}>
        {detail && (
          <>
            <DrawerSection title="Lifecycle">
              <StatusTimeline order={detail} />
            </DrawerSection>
            <DrawerSection title="Payment">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                <KeyValue k="Method" v={detail.paymentMethod.toUpperCase()} />
                <KeyValue k="Payment status" v={<Badge value={detail.paymentStatus} />} />
                <KeyValue k="Razorpay order / payment" v={detail.razorpayOrderId ? `${detail.razorpayOrderId} · ${detail.razorpayPaymentId}` : '—'} mono />
                <KeyValue k="Refund status" v={detail.refundStatus && detail.refundStatus !== 'notApplicable' ? <Badge value={detail.refundStatus} /> : '—'} />
                <KeyValue k="Refund ID" v={detail.razorpayRefundId} mono />
                <KeyValue k="Total" v={fmtRupees(detail.total)} mono />
                {detail.cancelReason && <KeyValue k="Cancel reason" v={detail.cancelReason} />}
              </Card>
            </DrawerSection>
            <DrawerSection title="Items & delivery">
              <Card className="divide-y divide-slate-800/60 px-4 py-1">
                {detail.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-300">{it.quantity}× {it.title}</span>
                    <span className="font-mono text-xs text-slate-400">{fmtRupees(it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
                <KeyValue k="Delivery address" v={detail.deliveryAddress} />
              </Card>
            </DrawerSection>
            {refundable(detail) && (
              <Button variant="danger" onClick={() => setRefunding(detail)}>
                <IndianRupee className="h-4 w-4" /> Trigger Razorpay refund
              </Button>
            )}
            <DrawerSection title="Document JSON">
              <DocJson doc={detail} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>

      <ConfirmDialog
        open={!!refunding}
        busy={busy}
        title="Trigger manual Razorpay refund?"
        message={refunding ? `${fmtRupees(refunding.total)} will be refunded to the customer for order ${refunding.orderId}. This is a financial operation.` : ''}
        confirmLabel="Trigger refund"
        onCancel={() => setRefunding(null)}
        onConfirm={submitRefund}
      />
    </div>
  )
}

function StatusTimeline({ order }) {
  if (order.status === 'cancelled') {
    return (
      <Card className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-rose-400">
          <Badge value="cancelled" />
          <span className="text-slate-400">{order.cancelReason || 'No reason recorded'}</span>
        </div>
        <div className="mt-3 space-y-2">
          {order.statusHistory.map((h, i) => <HistoryRow key={i} h={h} />)}
        </div>
      </Card>
    )
  }
  const reached = new Set(order.statusHistory.map((h) => h.status))
  return (
    <Card className="px-4 py-3">
      <ol className="flex items-center">
        {TIMELINE.map((s, i) => {
          const done = reached.has(s)
          return (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ring-1 ${done ? 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/40' : 'bg-slate-800 text-slate-600 ring-slate-700'}`}>
                  {i + 1}
                </span>
                <span className={`whitespace-nowrap text-[10px] ${done ? 'text-emerald-400' : 'text-slate-600'}`}>{s.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
              </div>
              {i < TIMELINE.length - 1 && <div className={`mx-1 h-0.5 flex-1 rounded ${reached.has(TIMELINE[i + 1]) ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />}
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function HistoryRow({ h }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium text-slate-300">{h.status}</span>
      <span className="font-mono text-slate-500">{fmtDate(h.at)}</span>
    </div>
  )
}
