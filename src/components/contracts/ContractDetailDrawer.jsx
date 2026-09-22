import { Lock, Unlock, UploadCloud } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { StatusBadge, STATUS_LABELS } from '../StatusBadge'
import { KeyValue, Button, EmptyState } from '../ui'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const NEXT_STATUSES = {
  draft: [],
  pending_review: [],
  published: ['active', 'cancelled'],
  active: ['fulfilled', 'disputed', 'cancelled'],
  disputed: ['fulfilled', 'breached', 'cancelled'],
  breached: ['cancelled'],
  fulfilled: [],
  cancelled: [],
}

export default function ContractDetailDrawer({ contract, acceptances, acceptancesLoading, onClose, onPublish, onStatusChange, onReleaseEscrow }) {
  if (!contract) return null
  const escrowRemaining = (contract.escrowAmount || 0) - (contract.escrowReleased || 0)
  const canPublish = ['draft', 'pending_review'].includes(contract.status)
  const canReleaseEscrow = ['active', 'fulfilled'].includes(contract.status) && escrowRemaining > 0
  const nextStatuses = NEXT_STATUSES[contract.status] || []

  return (
    <DetailDrawer
      open={!!contract}
      onClose={onClose}
      title={`Contract #${contract.id}`}
      subtitle={`${contract.buyerName} × ${contract.farmerName} · ${STATUS_LABELS[contract.status] || contract.status}`}
    >
      <DrawerSection title="Contract Terms">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Crop / Grade" v={`${contract.crop} · Grade ${contract.grade}`} />
          <KeyValue k="Quantity" v={`${contract.quantityQuintals} quintals`} />
          <KeyValue k="Locked Rate" v={`${fmtINR(contract.ratePerQuintal)} / quintal`} mono />
          <KeyValue k="Contract Value" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Acceptance Deadline" v={contract.acceptanceDeadline} mono />
          <KeyValue k="Delivery Milestone" v={contract.deliveryDate} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Escrow Account">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Total Locked" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Released" v={fmtINR(contract.escrowReleased)} mono />
          <KeyValue k="Remaining" v={fmtINR(escrowRemaining)} mono />
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-emerald-100 border border-emerald-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${contract.escrowAmount ? Math.min(100, ((contract.escrowReleased || 0) / contract.escrowAmount) * 100) : 0}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-800 font-semibold">
            {escrowRemaining > 0
              ? <><Lock className="h-3.5 w-3.5 text-amber-600" /> Funds locked in corporate escrow</>
              : <><Unlock className="h-3.5 w-3.5 text-emerald-600" /> Escrow 100% settled</>}
          </div>
        </div>
      </DrawerSection>

      {contract.disputeReason && (
        <DrawerSection title="Dispute / Breach Reason">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900 font-medium">
            {contract.disputeReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Farmer Acceptances (MPIN Signed)">
        {acceptancesLoading ? (
          <div className="rounded-xl border border-emerald-100 py-6 text-center text-xs text-slate-500">Loading acceptances…</div>
        ) : acceptances.length === 0 ? (
          <EmptyState title="No signed acceptances yet" hint={`Farmers can accept until ${contract.acceptanceDeadline}`} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-emerald-100 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-200 bg-emerald-50/80 uppercase tracking-wider text-emerald-950 font-bold text-[10px]">
                  <th className="px-3 py-2.5 font-bold">Farmer</th>
                  <th className="px-3 py-2.5 font-bold">MPIN</th>
                  <th className="px-3 py-2.5 font-bold">Signed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 bg-white">
                {acceptances.map((a) => (
                  <tr key={a.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="px-3 py-2 text-slate-800 font-medium">
                      {a.farmerName}
                      <span className="ml-1.5 font-mono text-[10px] text-slate-400 font-normal">
                        {a.farmerPhone.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold border ${a.mpinVerified ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                        {a.mpinVerified ? 'VERIFIED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">{a.signedAt?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DrawerSection>

      <DrawerSection title="Actions">
        <div className="flex flex-wrap gap-2">
          {canPublish && (
            <Button onClick={() => onPublish(contract)}>
              <UploadCloud className="h-4 w-4" /> Publish to Farmers
            </Button>
          )}
          {canReleaseEscrow && (
            <Button onClick={() => onReleaseEscrow(contract, escrowRemaining)}>
              <Unlock className="h-4 w-4" /> Release Escrow ({fmtINR(escrowRemaining)})
            </Button>
          )}
          {nextStatuses.map((s) => (
            <Button
              key={s}
              variant={['cancelled', 'breached'].includes(s) ? 'danger' : 'secondary'}
              onClick={() => onStatusChange(contract, s)}
            >
              Mark {STATUS_LABELS[s]}
            </Button>
          ))}
          {!canPublish && !canReleaseEscrow && nextStatuses.length === 0 && (
            <p className="text-xs text-slate-500">No actions available for a contract in “{STATUS_LABELS[contract.status]}” state.</p>
          )}
        </div>
      </DrawerSection>

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={contract} />
      </DrawerSection>
    </DetailDrawer>
  )
}
