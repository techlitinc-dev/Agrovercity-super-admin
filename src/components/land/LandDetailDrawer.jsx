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
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
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
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="On-time Payments" v={`${lease.paymentsOnTime} / ${lease.monthsElapsed}`} mono />
          <KeyValue k="Overdue Payments" v={`${lease.paymentsOverdue}`} mono />
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-emerald-100 border border-emerald-200">
            <div
              className={`h-full rounded-full transition-all ${lease.paymentsOverdue > 0 ? 'bg-rose-500' : 'bg-emerald-600'}`}
              style={{ width: `${lease.monthsTotal ? Math.min(100, (lease.monthsElapsed / lease.monthsTotal) * 100) : 0}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate-500">month {lease.monthsElapsed} of {lease.monthsTotal}</p>
        </div>
      </DrawerSection>

      {lease.disputeReason && (
        <DrawerSection title="Dispute / Termination Conflict">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900 font-medium">
            {lease.disputeReason}
          </div>
        </DrawerSection>
      )}

      <DrawerSection title="Legal Lease Agreement (Platform Generated)">
        {agreementLoading ? (
          <div className="rounded-xl border border-emerald-100 py-6 text-center text-xs text-slate-500">Inspecting agreement…</div>
        ) : !agreement ? (
          <EmptyState title="Agreement not generated yet" hint="The platform generates the standardized Marathi/Hindi contract after both parties sign." />
        ) : (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
            <KeyValue k="Agreement ID" v={agreement.id} mono />
            <KeyValue k="Language" v={agreement.language === 'mr' ? 'Marathi (मराठी)' : 'Hindi'} />
            <KeyValue k="Template Version" v={agreement.templateVersion} mono />
            <KeyValue k="Generated At" v={agreement.generatedAt?.slice(0, 10)} mono />
            <ol className="mt-2 space-y-1.5 text-xs text-slate-800">
              {agreement.clauses.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-xs text-emerald-700 font-bold">{i + 1}.</span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 flex gap-2">
              {agreement.signatures?.map((s, i) => (
                <span key={i} className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] text-emerald-900 font-bold">
                  {s.party === 'landlord' ? 'LANDLORD' : 'TENANT'}: {s.name} ✓
                </span>
              ))}
            </div>
          </div>
        )}
      </DrawerSection>

      <DrawerSection title="Automated Rent Reminders (Cron Delivery Log)">
        {remindersLoading ? (
          <div className="rounded-xl border border-emerald-100 py-6 text-center text-xs text-slate-500">Loading reminder receipts…</div>
        ) : reminders.length === 0 ? (
          <EmptyState title="No reminders sent yet" hint="The monthly rent reminder cron fires on the 1st of each cycle." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-emerald-100 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-200 bg-emerald-50/80 uppercase tracking-wider text-emerald-950 font-bold text-[10px]">
                  <th className="px-3 py-2.5 font-bold">Channel</th>
                  <th className="px-3 py-2.5 font-bold">Sent At</th>
                  <th className="px-3 py-2.5 font-bold">Status</th>
                  <th className="px-3 py-2.5 font-bold">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 bg-white">
                {reminders.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="px-3 py-2 font-mono uppercase text-slate-800 font-semibold">{r.channel}</td>
                    <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">{r.sentAt?.slice(0, 10)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold border ${r.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-400 text-[11px]">{r.receiptId || '—'}</td>
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
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
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
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${listing.sevenTwelveVerified ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border ${listing.sevenTwelveVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
              {listing.sevenTwelveVerified ? 'VERIFIED AGAINST 7/12' : 'UNVERIFIED'}
            </span>
            <LandStatusBadge status={listing.status} />
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {listing.sevenTwelveVerified
              ? 'Ownership matches the MahaBhulekh 7/12 extract; safe to lease.'
              : 'Listing cannot go live until the survey number and owner name match the official 7/12 record.'}
          </p>
        </div>
      </DrawerSection>

      {listing.flagReason && (
        <DrawerSection title="Fraud Flag Reason">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-900 font-medium">
            {listing.flagReason}
          </div>
        </DrawerSection>
      )}
      {listing.removalReason && (
        <DrawerSection title="Removal Reason">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
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
