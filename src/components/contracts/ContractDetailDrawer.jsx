import React from 'react';
import { Lock, Unlock, UploadCloud, Gavel, ShieldCheck, AlertTriangle } from 'lucide-react';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { StatusBadge, STATUS_LABELS } from '../StatusBadge.jsx';
import { KeyValue, Button, EmptyState } from '../ui.jsx';

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const NEXT_STATUSES = {
  draft: [],
  pending_review: [],
  published: ['active', 'cancelled'],
  active: ['fulfilled', 'disputed', 'cancelled'],
  disputed: ['fulfilled', 'breached', 'cancelled'],
  breached: ['cancelled'],
  fulfilled: [],
  cancelled: [],
};

export default function ContractDetailDrawer({
  contract,
  acceptances = [],
  acceptancesLoading = false,
  onClose,
  onPublish,
  onStatusChange,
  onReleaseEscrow,
  onArbitrate
}) {
  if (!contract) return null;
  const escrowRemaining = (contract.escrowAmount || 0) - (contract.escrowReleased || 0);
  const canPublish = ['draft', 'pending_review'].includes(contract.status);
  const canReleaseEscrow = ['active', 'fulfilled'].includes(contract.status) && escrowRemaining > 0;
  const isDisputed = ['disputed', 'breached'].includes(contract.status) || Boolean(contract.flagged);
  const nextStatuses = NEXT_STATUSES[contract.status] || [];

  return (
    <DetailDrawer
      open={Boolean(contract)}
      onClose={onClose}
      title={`Contract #${contract.id}`}
      subtitle={`${contract.buyerName} × ${contract.farmerName} · ${STATUS_LABELS[contract.status] || contract.status}`}
    >
      <DrawerSection title="Contract Terms & Pricing">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Commodity / Variety" v={`${contract.crop} · ${contract.variety || 'Certified'}`} />
          <KeyValue k="Quality Grade Spec" v={contract.grade} />
          <KeyValue k="Committed Volume" v={`${contract.quantityQuintals} quintals`} />
          <KeyValue k="Guaranteed Price Lock" v={`${fmtINR(contract.ratePerQuintal)} / quintal`} mono />
          <KeyValue k="Govt MSP Baseline" v={contract.mspBaseline ? `${fmtINR(contract.mspBaseline)} / quintal` : '—'} mono />
          {contract.premiumOverMspPercent > 0 && (
            <KeyValue k="Guaranteed MSP Premium" v={`+${contract.premiumOverMspPercent}% over Govt MSP`} mono />
          )}
          <KeyValue k="Total Contract Value" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Acceptance Deadline" v={contract.acceptanceDeadline} mono />
          <KeyValue k="Delivery Milestone" v={contract.deliveryDate} mono />
          <KeyValue k="Delivery Hub / Silo" v={contract.deliveryHub || 'Regional APMC Silo'} />
        </div>
      </DrawerSection>

      <DrawerSection title="Institutional Escrow Account">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Nodal Escrow Bank" v={contract.escrowBank || 'HDFC Bank Nodal Escrow A/c'} />
          <KeyValue k="Total Locked" v={fmtINR(contract.escrowAmount)} mono />
          <KeyValue k="Released to Farmer" v={fmtINR(contract.escrowReleased)} mono />
          <KeyValue k="Unreleased Escrow" v={fmtINR(escrowRemaining)} mono />
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
        <DrawerSection title="Dispute & Breach Claim">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1 text-rose-950">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Reported Dispute Details:</span>
            </div>
            <div>{contract.disputeReason}</div>
          </div>
        </DrawerSection>
      )}

      {contract.arbitrationVerdict && (
        <DrawerSection title="Superadmin Arbitration Verdict">
          <div className="rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2.5 text-xs text-purple-950 font-medium space-y-1">
            <div className="font-bold flex items-center gap-1 text-purple-900">
              <Gavel className="w-3.5 h-3.5 text-purple-700" />
              <span>Ruling: {contract.arbitrationResolution?.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
            <div>{contract.arbitrationVerdict}</div>
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
                  <th className="px-3 py-2.5 font-bold">MPIN Seal</th>
                  <th className="px-3 py-2.5 font-bold">Signed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 bg-white">
                {acceptances.map((a) => (
                  <tr key={a.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="px-3 py-2 text-slate-800 font-medium">
                      {a.farmerName}
                      <span className="ml-1.5 font-mono text-[10px] text-slate-400 font-normal">
                        {a.farmerPhone?.replace(/^(\+91\s?\d{2})\d{4}(\d{2})/, '$1••••$2')}
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

      <DrawerSection title="Operational Actions">
        <div className="flex flex-wrap gap-2">
          {canPublish && (
            <Button onClick={() => onPublish && onPublish(contract)}>
              <UploadCloud className="h-4 w-4" /> Publish to Farmers
            </Button>
          )}

          {canReleaseEscrow && (
            <Button onClick={() => onReleaseEscrow && onReleaseEscrow(contract, escrowRemaining)}>
              <Unlock className="h-4 w-4" /> Release Escrow ({fmtINR(escrowRemaining)})
            </Button>
          )}

          {isDisputed && (
            <button
              onClick={() => onArbitrate && onArbitrate(contract)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Gavel className="h-4 w-4" /> Arbitrate Dispute
            </button>
          )}

          {nextStatuses.map((s) => (
            <Button
              key={s}
              variant={['cancelled', 'breached'].includes(s) ? 'danger' : 'secondary'}
              onClick={() => onStatusChange && onStatusChange(contract, s)}
            >
              Mark {STATUS_LABELS[s]}
            </Button>
          ))}

          {!canPublish && !canReleaseEscrow && !isDisputed && nextStatuses.length === 0 && (
            <p className="text-xs text-slate-500">No pending actions for contract in “{STATUS_LABELS[contract.status]}” state.</p>
          )}
        </div>
      </DrawerSection>

      <DrawerSection title="Raw Document JSON (Audit View)">
        <DocJson doc={contract} />
      </DrawerSection>
    </DetailDrawer>
  );
}
