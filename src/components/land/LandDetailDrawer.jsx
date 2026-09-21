import { FileText, MapPinOff, ShieldCheck } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button, EmptyState } from '../ui'
import { LandStatusBadge } from '../../pages/landWidgets'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const REMINDER_STYLES = {
  delivered: 'bg-emerald-500/10 text-emerald-400',
  read: 'bg-sky-500/10 text-sky-400',
  failed: 'bg-rose-500/10 text-rose-400',
}

export default function LandDetailDrawer({
  lease,
  listing,
  agreement,
  agreementLoading,
  reminders,
  remindersLoading,
  onClose,
  onTerminate,
  onAuditListing,
}) {
  if (!lease && !listing) return null

  return (
    <DetailDrawer
      open={!!(lease || listing)}
      onClose={onClose}
      title={lease ? `Lease #${lease.id}` : `Listing #${listing.id}`}
      subtitle={
        lease
          ? `${lease.landlordName} × ${lease.tenantName} · ${lease.district}`
          : `${listing.landlordName} · ${listing.district}, ${listing.taluka}`
      }
    >
      {lease ? (
        <LeaseView
          lease={lease}
          agreement={agreement}
          agreementLoading={agreementLoading}
          reminders={reminders}
          remindersLoading={remindersLoading}
          onTerminate={onTerminate}
        />
      ) : (
        <ListingView listing={listing} onAuditListing={onAuditListing} />
      )}
    </DetailDrawer>
  )
}

function LeaseView({ lease, agreement, agreementLoading, reminders, remindersLoading, onTerminate }) {
  const canTerminate = ['active', 'expiring', 'disputed'].includes(lease.status)

  return (
    <>
      <DrawerSection title="Lease Terms">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Landlord" v={`${lease.landlordName} · ${lease.landlordPhone?.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}`} />
          <KeyValue k="Tenant" v={`${lease.tenantName} · ${lease.tenantPhone?.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}`} />
          <KeyValue k="Plot" v={`${lease.surveyNo} · ${lease.areaAcres} acres · ${lease.crop}`} />
          <KeyValue k="District" v={lease.district} />
          <KeyValue k="Monthly Rent" v={fmtINR(lease.monthlyRent)} mono />
          <KeyValue k="Rent Due Day" v={`Day ${lease.rentDueDay} of month`} mono />
          <KeyValue k="Security Deposit" v={fmtINR(lease.securityDeposit)} mono />
          <KeyValue k="Term" v={`${lease.startDate} → ${lease.endDate}`} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Payment Compliance">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="On-time Payments" v={`${lease.paymentsOnTime} / ${lease.monthsElapsed}`} mono />
          <KeyValue k="Overdue Payments" v={`${lease.paymentsOverdue}`} mono />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${lease.paymentsOverdue > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${lease.monthsTotal ? Math.min(100, (lease.monthsElapsed / lease.monthsTotal) * 100) : 0}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate-500">month {lease.monthsElapsed} of {lease.monthsTotal}</p>
        </div>
      </DrawerSection>

      {lease.disputeReason && (
        <DrawerSection title="Dispute / Termination Conflict">
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm text-orange-300">
            {lease.disputeReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Legal Lease Agreement (Platform Generated)">
        {agreementLoading ? (
          <div className="rounded-lg border border-slate-800 py-6 text-center text-xs text-slate-500">Inspecting agreement…</div>
        ) : !agreement ? (
          <EmptyState title="Agreement not generated yet" hint="The platform generates the standardized Marathi/Hindi contract after both parties sign." />
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
            <KeyValue k="Agreement ID" v={agreement.id} mono />
            <KeyValue k="Language" v={agreement.language === 'mr' ? 'Marathi (मराठी)' : 'Hindi'} />
            <KeyValue k="Template Version" v={agreement.templateVersion} mono />
            <KeyValue k="Generated At" v={agreement.generatedAt?.slice(0, 10)} mono />
            <ol className="mt-2 space-y-1.5 text-sm text-slate-300">
              {agreement.clauses.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-xs text-emerald-400">{i + 1}.</span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex gap-2">
              {agreement.signatures?.map((s, i) => (
                <span key={i} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  {s.party === 'landlord' ? 'LANDLORD' : 'TENANT'}: {s.name} ✓
                </span>
              ))}
            </div>
          </div>
        )}
      </DrawerSection>

      <DrawerSection title="Automated Rent Reminders (Cron Delivery Log)">
        {remindersLoading ? (
          <div className="rounded-lg border border-slate-800 py-6 text-center text-xs text-slate-500">Loading reminder receipts…</div>
        ) : reminders.length === 0 ? (
          <EmptyState title="No reminders sent yet" hint="The monthly rent reminder cron fires on the 1st of each cycle." />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-semibold">Channel</th>
                  <th className="px-3 py-2 font-semibold">Sent At</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/60 last:border-0">
                    <td className="px-3 py-2 font-mono uppercase text-slate-200">{r.channel}</td>
                    <td className="px-3 py-2 font-mono text-slate-400">{r.sentAt?.slice(0, 10)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${REMINDER_STYLES[r.status] || 'bg-slate-500/10 text-slate-400'}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500">{r.receiptId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DrawerSection>

      <DrawerSection title="Actions">
        <div className="flex flex-wrap gap-2">
          {canTerminate && (
            <Button variant="danger" onClick={() => onTerminate(lease)}>
              <MapPinOff className="h-4 w-4" /> Arbitrated Termination
            </Button>
          )}
          {!canTerminate && (
            <p className="text-xs text-slate-500">No actions available for a lease in “{lease.status}” state.</p>
          )}
        </div>
      </DrawerSection>

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={lease} />
      </DrawerSection>
    </>
  )
}

function ListingView({ listing, onAuditListing }) {
  return (
    <>
      <DrawerSection title="Plot Details">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Landlord" v={`${listing.landlordName} · ${listing.landlordPhone?.replace(/^(\+91\d{2})\d{4}(\d{2})/, '$1••••$2')}`} />
          <KeyValue k="Survey Number" v={listing.surveyNo} mono />
          <KeyValue k="Location" v={`${listing.district}, ${listing.taluka}`} />
          <KeyValue k="Area" v={`${listing.areaAcres} acres`} mono />
          <KeyValue k="Expected Rent" v={`${fmtINR(listing.expectedRentPerAcre)} / acre`} mono />
          <KeyValue k="Crop Suitability" v={listing.cropSuitability?.join(', ')} />
          <KeyValue k="Soil Type" v={listing.soilType} />
          <KeyValue k="Water Source" v={listing.waterSource} />
        </div>
      </DrawerSection>

      <DrawerSection title="7/12 Land Record Audit">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${listing.sevenTwelveVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${listing.sevenTwelveVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {listing.sevenTwelveVerified ? 'VERIFIED AGAINST 7/12' : 'UNVERIFIED'}
            </span>
            <LandStatusBadge status={listing.status} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {listing.sevenTwelveVerified
              ? 'Ownership matches the MahaBhulekh 7/12 extract; safe to lease.'
              : 'Listing cannot go live until the survey number and owner name match the official 7/12 record.'}
          </p>
        </div>
      </DrawerSection>

      {listing.flagReason && (
        <DrawerSection title="Fraud Flag Reason">
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {listing.flagReason}
          </div>
        </DrawerSection>
      )}
      {listing.removalReason && (
        <DrawerSection title="Removal Reason">
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300">
            {listing.removalReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Actions">
        <div className="flex flex-wrap gap-2">
          {!listing.sevenTwelveVerified && listing.status !== 'removed' && (
            <Button onClick={() => onAuditListing(listing, true)}>
              <ShieldCheck className="h-4 w-4" /> Verify against 7/12
            </Button>
          )}
          {listing.status !== 'removed' && (
            <Button variant="danger" onClick={() => onAuditListing(listing, false)}>
              <MapPinOff className="h-4 w-4" /> Flag as Fraudulent
            </Button>
          )}
          {listing.status === 'removed' && (
            <p className="text-xs text-slate-500">This listing was removed and is retained for audit purposes only.</p>
          )}
        </div>
      </DrawerSection>

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={listing} />
      </DrawerSection>
    </>
  )
}
