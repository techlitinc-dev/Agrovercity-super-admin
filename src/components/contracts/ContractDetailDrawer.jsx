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
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Crop / Grade" v={`${contract.crop} · Grade ${contract.grade}`} />
          <KeyValue k="Quantity" v={`${contract.quantityQuintals} quintals`} />
          <KeyValue k="Locked Rate" v={`${fmtINR(contract.ratePerQuintal)} / quintal`} mono />
          <KeyValue k="Contract Value" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Acceptance Deadline" v={contract.acceptanceDeadline} mono />
          <KeyValue k="Delivery Milestone" v={contract.deliveryDate} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Escrow Account">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Total Locked" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Released" v={fmtINR(contract.escrowReleased)} mono />
          <KeyValue k="Remaining" v={fmtINR(escrowRemaining)} mono />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${contract.escrowAmount ? Math.min(100, ((contract.escrowReleased || 0) / contract.escrowAmount) * 100) : 0}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-500">
            {escrowRemaining > 0
              ? <><Lock className="h-3 w-3" /> funds locked in buyer escrow</>
              : <><Unlock className="h-3 w-3 text-emerald-400" /> escrow fully settled</>}
          </div>
        </div>
      </DrawerSection>

      {contract.disputeReason && (
        <DrawerSection title="Dispute / Breach Reason">
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm text-orange-300">
            {contract.disputeReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Farmer Acceptances (MPIN Signed)">
        {acceptancesLoading ? (
          <div className="rounded-lg border border-slate-800 py-6 text-center text-xs text-slate-500">Loading acceptances…</div>
        ) : acceptances.length === 0 ? (
          <EmptyState title="No signed acceptances yet" hint={`Farmers can accept until ${contract.acceptanceDeadline}`} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-semibold">Farmer</th>
                  <th className="px-3 py-2 font-semibold">MPIN</th>
                  <th className="px-3 py-2 font-semibold">Signed At</th>
                </tr>
              </thead>
              <tbody>
                {acceptances.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800/60 last:border-0">
                    <td className="px-3 py-2 text-slate-200">{a.farmerName}<span className="ml-1.5 font-mono text-[10px] text-slate-500">{a.farmerPhone.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}</span></td>
                    <td className="px-3 py-2">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${a.mpinVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {a.mpinVerified ? 'VERIFIED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-400">{a.signedAt?.slice(0, 10)}</td>
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
