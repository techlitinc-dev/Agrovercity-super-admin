import React, { useState } from 'react'
import {
  Building2,
  Package,
  Users,
  Tractor,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Coins,
  FileText,
  MapPin,
  Truck
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'
import { fmtINR, StatusBadge } from '../../pages/fpoWidgets'

export default function FpoDetailDrawer({
  item,
  type = 'fpo', // 'fpo' | 'pool' | 'machinery'
  onClose,
  onVerifyFpo,
  onClosePool
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(item.id || item.cin || item.poNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // FPO Organization Drawer
  if (type === 'fpo') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.name}
        subtitle={`CIN: ${item.cin} · ${item.registeredDistrict}`}
        onClose={onClose}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-emerald-100 pb-2 mb-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview &amp; ROC
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'financials'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Turnover &amp; Bank
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'documents'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Certificates &amp; KYC
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'json'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl border border-emerald-100/90 bg-emerald-50/40 flex items-center justify-between">
              <StatusBadge status={item.verificationStatus} type="fpo" />
              <span className="font-mono text-emerald-700 font-bold">
                {item.totalShareholders.toLocaleString('en-IN')} Farmer Members
              </span>
            </div>

            <DrawerSection title="Registration & Statutory Identifiers">
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                <KeyValue label="Corporate ID (CIN)" value={item.cin} />
                <KeyValue label="NABARD Empanelment" value={item.nabardEmpanelmentNo} />
                <KeyValue label="SFAC Recognition" value={item.sfacRegistration} />
                <KeyValue label="PAN / GSTIN" value={`${item.pan} / ${item.gstin}`} />
                <KeyValue label="Registered Office" value={item.registeredAddress} />
              </div>
            </DrawerSection>

            <DrawerSection title="Executive Leadership">
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                <KeyValue label="Chief Executive Officer" value={item.ceoName} />
                <KeyValue label="CEO Contact" value={item.ceoPhone} />
                <KeyValue label="Chairman of the Board" value={item.chairmanName} />
                <KeyValue label="Primary Crops Handled" value={item.primaryCrops?.join(', ')} />
              </div>
            </DrawerSection>

            {item.verificationStatus === 'pending_verification' && onVerifyFpo && (
              <div className="pt-2">
                <button
                  onClick={() => onVerifyFpo(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs active:scale-95 transition"
                >
                  Approve FPO Registration Verification
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-slate-500 block text-[10px]">Annual Turnover</span>
                <span className="text-lg font-bold text-emerald-700">{fmtINR(item.annualTurnoverInr)}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-100">
                <span className="text-slate-500 block text-[10px]">Patronage Dividend</span>
                <span className="text-lg font-bold text-cyan-700">{fmtINR(item.patronageDividendDistributedInr)}</span>
              </div>
            </div>

            <DrawerSection title="Share Capital Structure">
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                <KeyValue label="Authorized Share Capital" value={fmtINR(item.authorizedCapitalInr)} />
                <KeyValue label="Paid-Up Capital" value={fmtINR(item.paidUpCapitalInr)} />
                <KeyValue label="Active Group Buy Pools" value={`${item.activePoolsCount} Pools`} />
                <KeyValue label="Shared CHC Machinery" value={`${item.chcEquipmentCount} Units`} />
              </div>
            </DrawerSection>

            <DrawerSection title="Bank Account & Penny-Drop Attestation">
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                <KeyValue label="Bank Name" value={item.bankDetails?.bankName} />
                <KeyValue label="Account Ending" value={`****${item.bankDetails?.accountLast4}`} />
                <KeyValue label="IFSC Code" value={item.bankDetails?.ifsc} />
                <KeyValue label="Penny-Drop Status" value="SUCCESS (Verified via Razorpay / NPCI)" />
              </div>
            </DrawerSection>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Certificate of Incorporation (ROC)</span>
                <span className="text-[11px] text-slate-500 font-mono">Ministry of Corporate Affairs</span>
              </div>
              <a
                href={item.documents?.rocCertificate}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-mono text-[11px] flex items-center gap-1 shadow-xs transition"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">NABARD Empanelment Letter</span>
                <span className="text-[11px] text-slate-500 font-mono">National Bank for Agriculture &amp; Rural Dev</span>
              </div>
              <a
                href={item.documents?.nabardApprovalLetter}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-mono text-[11px] flex items-center gap-1 shadow-xs transition"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Board Resolution for Platform Trading</span>
                <span className="text-[11px] text-slate-500 font-mono">Signed by 5 Directors</span>
              </div>
              <a
                href={item.documents?.boardResolution}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-mono text-[11px] flex items-center gap-1 shadow-xs transition"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'json' && <DocJson doc={item} />}
      </DetailDrawer>
    )
  }

  // Bulk Procurement Pool Drawer
  if (type === 'pool') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.poolName}
        subtitle={`PO: ${item.poNumber} · ${item.fpoName}`}
        onClose={onClose}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-emerald-100/90 bg-emerald-50/40 flex items-center justify-between">
            <StatusBadge status={item.status} type="pool" />
            <span className="font-mono text-emerald-700 font-bold">
              {fmtINR(item.totalPoolValueInr)} Value
            </span>
          </div>

          <DrawerSection title="Pledge Volume & Progress">
            <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 font-mono">
              <KeyValue label="Target Volume" value={`${item.targetQuantity} ${item.quantityUnit}`} />
              <KeyValue label="Pledged So Far" value={`${item.pledgedQuantity} ${item.quantityUnit}`} />
              <KeyValue label="Participating Farmers" value={`${item.participatingFarmersCount} Pledges`} />
              <KeyValue label="Offer Price vs MRP" value={`₹${item.poolOfferPricePerUnit?.toLocaleString('en-IN')} (MRP ₹${item.mrpPerUnit?.toLocaleString('en-IN')})`} />
              <KeyValue label="Collective Farmer Savings" value={fmtINR(item.collectiveSavingsInr)} />
            </div>
          </DrawerSection>

          <DrawerSection title="Supplier & Delivery Log">
            <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              <KeyValue label="Apex Supplier" value={item.supplierName} />
              <KeyValue label="Pickup Depot / Hub" value={item.deliveryHub} />
              <KeyValue label="Deadline" value={new Date(item.deadline).toLocaleString('en-IN')} />
              <KeyValue label="Payment Terms" value={item.paymentTerms} />
            </div>
          </DrawerSection>

          {(item.status === 'open_pledging' || item.status === 'target_achieved') && onClosePool && (
            <div className="pt-2">
              <button
                onClick={() => onClosePool(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs active:scale-95 transition"
              >
                Close Pool &amp; Trigger Supplier Purchase Order
              </button>
            </div>
          )}

          <DocJson doc={item} />
        </div>
      </DetailDrawer>
    )
  }

  // Machinery Asset Drawer
  if (type === 'machinery') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.equipmentName}
        subtitle={`Reg: ${item.registrationNo} · ${item.fpoName}`}
        onClose={onClose}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-emerald-100/90 bg-emerald-50/40 flex items-center justify-between">
            <StatusBadge status={item.status} type="machinery" />
            <span className="font-mono text-emerald-700 font-bold">
              ₹{item.rentalRatePerHour} / Hour
            </span>
          </div>

          <DrawerSection title="Machinery & Custom Hiring Center (CHC)">
            <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              <KeyValue label="Managing FPO" value={item.fpoName} />
              <KeyValue label="Equipment Category" value={item.category} />
              <KeyValue label="Location / Depot" value={item.currentLocation} />
              <KeyValue label="Certified Operator" value={item.operatorName} />
            </div>
          </DrawerSection>

          <DrawerSection title="Financials & Subsidies">
            <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 font-mono">
              <KeyValue label="Capital Cost" value={fmtINR(item.capitalCostInr)} />
              <KeyValue label="SMAM Govt. Subsidy" value={fmtINR(item.subsidyReceivedInr)} />
              <KeyValue label="Hours Booked This Season" value={`${item.totalHoursBookedThisSeason} Hours`} />
              <KeyValue label="Rental Revenue Earned" value={fmtINR(item.totalRevenueGeneratedInr)} />
              <KeyValue label="Maintenance Reserve Fund" value={fmtINR(item.maintenanceReserveInr)} />
            </div>
          </DrawerSection>

          <DocJson doc={item} />
        </div>
      </DetailDrawer>
    )
  }

  return null
}
