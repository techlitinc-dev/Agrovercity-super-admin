import React from 'react'
import {
  BookOpen,
  CheckCircle,
  Flag,
  Trash2,
  FileText,
  AlertTriangle,
  Coins,
  ShieldAlert,
  User,
  ExternalLink,
  Percent,
  TrendingUp,
  Receipt,
  Download
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'
import {
  fmtINR,
  maskPhone,
  maskAadhaar,
  DiaryStatusBadge,
  TypeBadge,
  CategoryBadge,
  AgriCoinsPill
} from '../../pages/diaryWidgets'

export default function DiaryDetailDrawer({
  entry,
  pnl,
  onClose,
  onVerifyEntry,
  onFlagEntry,
  onDeleteEntry,
  onVerifyPnl,
  onOpenPdf
}) {
  if (!entry && !pnl) return null

  const isEntry = Boolean(entry)
  const title = isEntry ? `Diary Entry #${entry.id}` : `Crop P&L Statement #${pnl.id}`
  const subtitle = isEntry
    ? `${entry.farmerName} · ${entry.cropName || 'General'} · ${entry.date}`
    : `${pnl.farmerName} · ${pnl.cropName} (${pnl.season})`

  return (
    <DetailDrawer open={Boolean(entry || pnl)} onClose={onClose} title={title} subtitle={subtitle}>
      {isEntry ? (
        <EntryDetailView
          entry={entry}
          onVerify={onVerifyEntry}
          onFlag={onFlagEntry}
          onDelete={onDeleteEntry}
        />
      ) : (
        <PnlDetailView
          pnl={pnl}
          onVerify={onVerifyPnl}
          onOpenPdf={onOpenPdf}
        />
      )}

      <DrawerSection title="Raw Document JSON (Immutable Audit Reference)">
        <DocJson doc={entry || pnl} />
      </DrawerSection>
    </DetailDrawer>
  )
}

function EntryDetailView({ entry, onVerify, onFlag, onDelete }) {
  const isDuplicate = entry.duplicateSimilarity && entry.duplicateSimilarity > 0.8
  const isHighValue = entry.amount >= 50000

  return (
    <div className="space-y-4">
      {/* Action Header Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-100 pb-3">
        {entry.status !== 'verified' && (
          <Button
            variant="primary"
            className="text-xs"
            onClick={() => onVerify(entry)}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Verify Entry (+15 🪙)
          </Button>
        )}
        {!entry.flagged && (
          <Button
            variant="secondary"
            className="text-xs text-amber-700 hover:text-amber-900 border-amber-200"
            onClick={() => onFlag(entry)}
          >
            <Flag className="h-3.5 w-3.5 mr-1" /> Flag for Audit
          </Button>
        )}
        <Button
          variant="danger"
          className="text-xs"
          onClick={() => onDelete(entry)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Soft-Delete & Revoke Coins
        </Button>
      </div>

      {/* Fraud / Anomaly Banner */}
      {entry.flagged && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-rose-950 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Fraud & Anomaly Sentinel Warning
              </p>
              <p className="text-xs font-medium text-rose-900">{entry.flagReason}</p>
              {isDuplicate && (
                <div className="mt-1.5 text-xs font-mono font-bold text-rose-700">
                  Similarity Score: {(entry.duplicateSimilarity * 100).toFixed(0)}% · Matched Entry: #{entry.duplicateOfId || 'dia_1009'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* High-value compliance notice */}
      {isHighValue && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
          <AlertTriangle className="mr-1.5 inline h-3.5 w-3.5 text-amber-600" />
          High-Value Transaction: Any deletion or financial override on records exceeding ₹50,000 requires Dual-Admin sign-off pursuant to SOP-13 §6.3.
        </div>
      )}

      {/* Farmer & KYC Profile (DPDP Masked) */}
      <DrawerSection title="Farmer Profile & DPDP Compliance">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 divide-y divide-emerald-100/60 shadow-2xs">
          <KeyValue k="Farmer Name" v={entry.farmerName} />
          <KeyValue k="Phone (Masked)" v={maskPhone(entry.farmerPhone)} mono />
          <KeyValue k="Aadhaar (DPDP Masked)" v={maskAadhaar(entry.aadhaarMasked)} mono />
          <KeyValue k="Location" v={`${entry.district}, ${entry.state || 'Maharashtra'}`} />
          <KeyValue k="User ID" v={entry.userId} mono />
        </div>
      </DrawerSection>

      {/* Transaction & Accounting Details */}
      <DrawerSection title="Transaction Accounting Details">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 divide-y divide-emerald-100/60 shadow-2xs">
          <KeyValue
            k="Transaction Type"
            v={<TypeBadge type={entry.type} />}
          />
          <KeyValue
            k="Expense Category"
            v={<CategoryBadge category={entry.category} />}
          />
          <KeyValue
            k="Crop Associated"
            v={entry.cropName || 'General / Farm Operations'}
          />
          <KeyValue
            k="Transaction Amount"
            v={<span className="font-mono font-bold text-slate-900 text-sm">{fmtINR(entry.amount)}</span>}
          />
          <KeyValue k="Accounting Date" v={entry.date} mono />
          <KeyValue
            k="Verification Status"
            v={<DiaryStatusBadge status={entry.status} />}
          />
          <KeyValue k="Title / Description" v={entry.title} />
          {entry.notes && <KeyValue k="Farmer Notes" v={entry.notes} />}
        </div>
      </DrawerSection>

      {/* AgriCoins Ledger Audit */}
      <DrawerSection title="AgriCoins Incentive Ledger">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-2 text-xs shadow-2xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Reward Disbursed:</span>
            <AgriCoinsPill coins={entry.agriCoinsAwarded} status={entry.coinsStatus} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Coins Ledger Status:</span>
            <span className="font-mono font-bold text-slate-800">
              {entry.coinsStatus === 'revoked' ? 'Revoked (Duplicate Clawback)' : 'Confirmed in Wallet'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Daily Accounting Policy:</span>
            <span className="text-slate-500 font-mono">15 coins / entry (Max 3 daily)</span>
          </div>
        </div>
      </DrawerSection>

      {/* Receipt & Voucher Attestation */}
      {entry.receiptNumber && (
        <DrawerSection title="Receipt & Voucher Attestation">
          <div className="rounded-xl border border-emerald-100 bg-white p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Voucher / Tax Invoice No:</span>
              <span className="font-mono font-bold text-emerald-800">{entry.receiptNumber}</span>
            </div>
            {entry.receiptUrl && (
              <div className="space-y-2">
                <span className="text-xs text-slate-500">Document Upload Proof:</span>
                <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-slate-50">
                  <img
                    src={entry.receiptUrl}
                    alt="Receipt Upload"
                    className="max-h-48 w-full object-cover"
                  />
                  <a
                    href={entry.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-black shadow-sm"
                  >
                    <ExternalLink className="h-3 w-3" /> View Original
                  </a>
                </div>
              </div>
            )}
          </div>
        </DrawerSection>
      )}

      {/* Immutable Audit Logs Trail */}
      <DrawerSection title="Immutable Superadmin Audit Trail">
        <div className="space-y-2">
          {(!entry.auditLogs || entry.auditLogs.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No administrative actions logged yet.</p>
          ) : (
            entry.auditLogs.map((log, i) => (
              <div
                key={i}
                className="rounded-xl border border-emerald-100 bg-white p-2.5 text-xs text-slate-700 space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="font-bold text-emerald-800">{log.adminUid}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                    {log.previousState} &rarr; {log.newState}
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">({log.ipAddress})</span>
                </div>
                <p className="text-slate-800 text-xs mt-0.5">{log.reason}</p>
                {log.secondApprover && (
                  <p className="text-amber-800 font-mono text-[10px] font-bold">
                    Dual-Admin Sign-Off: {log.secondApprover}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DrawerSection>
    </div>
  )
}

function PnlDetailView({ pnl, onVerify, onOpenPdf }) {
  const isProfitable = pnl.netProfit >= 0

  return (
    <div className="space-y-4">
      {/* Action Header Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-emerald-100 pb-3">
        {pnl.status !== 'verified' && (
          <Button
            variant="primary"
            className="text-xs"
            onClick={() => onVerify(pnl)}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Verify P&L Statement
          </Button>
        )}
        <Button
          variant="secondary"
          className="text-xs text-sky-800 hover:text-sky-950 border-sky-200"
          onClick={() => onOpenPdf(pnl)}
        >
          <FileText className="h-3.5 w-3.5 mr-1" /> Review Generated PDF
        </Button>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Gross Revenue</span>
          <div className="mt-1 font-mono text-base font-bold text-slate-900">
            {fmtINR(pnl.grossRevenue)}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Expenses</span>
          <div className="mt-1 font-mono text-base font-bold text-slate-700">
            {fmtINR(pnl.totalExpenses)}
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Net Profit / Loss</span>
          <div className={`mt-1 font-mono text-base font-bold ${isProfitable ? 'text-emerald-700' : 'text-rose-600'}`}>
            {isProfitable ? `+${fmtINR(pnl.netProfit)}` : `-${fmtINR(Math.abs(pnl.netProfit))}`}
          </div>
        </div>
      </div>

      {/* Break-Even Analysis */}
      <DrawerSection title="Break-Even & Market Rate Calibration">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 divide-y divide-emerald-100/60 shadow-2xs">
          <KeyValue
            k="Break-Even Price / Quintal"
            v={<span className="font-mono font-bold text-sky-700">{fmtINR(pnl.breakEvenPricePerQuintal)} / qtl</span>}
          />
          <KeyValue
            k="Market Realized Rate"
            v={<span className="font-mono font-bold text-slate-900">{fmtINR(pnl.marketAvgRate)} / qtl</span>}
          />
          <KeyValue
            k="Safety Margin / Quintal"
            v={
              <span className={`font-mono font-bold ${pnl.marketAvgRate >= pnl.breakEvenPricePerQuintal ? 'text-emerald-700' : 'text-rose-600'}`}>
                {fmtINR(pnl.marketAvgRate - pnl.breakEvenPricePerQuintal)} / qtl
              </span>
            }
          />
          <KeyValue
            k="Cost of Production / Acre"
            v={<span className="font-mono text-slate-700 font-medium">{fmtINR(pnl.costPerAcre)} / acre</span>}
          />
          <KeyValue
            k="Total Yield Harvested"
            v={<span className="font-mono text-slate-800 font-bold">{pnl.yieldQuintals} quintals ({pnl.areaAcres} acres)</span>}
          />
          <KeyValue
            k="Return on Investment (ROI)"
            v={
              <span className={`font-mono font-bold ${isProfitable ? 'text-emerald-700' : 'text-rose-600'}`}>
                {pnl.roiPercent}%
              </span>
            }
          />
        </div>
      </DrawerSection>

      {/* Input Expense Breakdown */}
      <DrawerSection title="Detailed Expense Breakdown by Category">
        <div className="rounded-xl border border-emerald-100 bg-white p-3.5 space-y-3 shadow-2xs">
          {pnl.expensesBreakdown?.map((exp) => (
            <div key={exp.category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-semibold">{exp.category}</span>
                <span className="font-mono text-slate-500">
                  {fmtINR(exp.amount)} ({exp.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${exp.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DrawerSection>

      {/* Institutional Loan Underwriting & Financial Health */}
      <DrawerSection title="Institutional Banking & Loan Underwriting">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 divide-y divide-emerald-100/60 shadow-2xs">
          <KeyValue
            k="Loan Underwriting Status"
            v={<DiaryStatusBadge status={pnl.loanEligibility} />}
          />
          <KeyValue
            k="Farmer Credit Readiness Score"
            v={<span className="font-mono font-bold text-emerald-800">{pnl.creditScore} / 900</span>}
          />
          <KeyValue
            k="Debt-Service Coverage Ratio (DSCR)"
            v={<span className="font-mono font-bold text-slate-800">{pnl.dscrRatio}x</span>}
          />
          <KeyValue
            k="Recommended KCC Credit Limit"
            v={<span className="font-mono font-bold text-sky-700">{fmtINR(pnl.kccLimitRecommended)}</span>}
          />
        </div>
      </DrawerSection>

      {/* Generated PDF Report Card */}
      <DrawerSection title="Certified Financial Audit Statement (PDF)">
        <div className="rounded-xl border border-emerald-100 bg-white p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Official P&L Statement PDF</p>
              <p className="text-[11px] text-slate-500">
                Digitally verified for bank credit, crop insurance and tax filings
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="text-xs"
            onClick={() => onOpenPdf(pnl)}
          >
            Review PDF
          </Button>
        </div>
      </DrawerSection>
    </div>
  )
}
