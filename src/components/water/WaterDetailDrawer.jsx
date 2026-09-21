import React, { useState } from 'react'
import {
  Droplets,
  Waves,
  Gauge,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  TrendingDown,
  TrendingUp,
  MapPin,
  Sparkles,
  RefreshCw,
  BellRing
} from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button } from '../ui'
import { fmtLiters, StatusBadge } from '../../pages/waterWidgets'

export default function WaterDetailDrawer({
  item,
  type = 'schedule', // 'schedule' | 'cgwb' | 'canal' | 'subsidy'
  onClose,
  onUpdateCanal,
  onApproveSubsidy
}) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'sensors' | 'telemetry' | 'json'
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(item.id || item.stationCode || item.canalCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Schedule Drawer
  if (type === 'schedule') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={`Gat #${item.gatNumber} · ${item.crop}`}
        subtitle={`${item.farmerName} · ${item.village}, ${item.district}`}
        onClose={onClose}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 pb-2 mb-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Overview &amp; Plot
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'sensors'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Moisture &amp; Sensors
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'json'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            {/* Top Quick Status Pill */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} type="schedule" />
                <StatusBadge status={item.overUnderAlert} type="alert" />
              </div>
              <span className="font-mono text-cyan-400 text-xs font-bold">
                {item.waterEfficiencyIndex}% Water Score
              </span>
            </div>

            <DrawerSection title="Plot & Farmer Information">
              <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <KeyValue label="Farmer Name" value={item.farmerName} />
                <KeyValue label="Phone Number" value={item.farmerPhone} />
                <KeyValue label="Gat Number" value={item.gatNumber} />
                <KeyValue label="Location" value={`${item.village}, Taluka ${item.taluka}, Dist. ${item.district}`} />
                <KeyValue label="Plot Area" value={`${item.acreage} Acres`} />
                <KeyValue label="Soil Classification" value={item.soilType} />
              </div>
            </DrawerSection>

            <DrawerSection title="Irrigation Execution Parameters">
              <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <KeyValue label="Method / System" value={item.irrigationType} />
                <KeyValue label="Water Source" value={item.waterSource} />
                <KeyValue label="Scheduled Date & Time" value={`${item.scheduledDate} at ${item.scheduledStartTime}`} />
                <KeyValue label="Pump Slot" value={item.pumpElectricitySlot} />
                <KeyValue label="Duration" value={`${item.durationMinutes} Minutes`} />
                <KeyValue label="Calculated Water Volume" value={fmtLiters(item.waterVolumeLiters)} />
                <KeyValue label="Water Saved vs Flood" value={`+${fmtLiters(item.waterSavedLiters)}`} />
              </div>
            </DrawerSection>

            <DrawerSection title="Crop Phenology & Demand">
              <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <KeyValue label="Crop" value={item.crop} />
                <KeyValue label="Current Stage" value={item.cropStage} />
                <KeyValue label="Evapotranspiration (ETc)" value={`${item.evapotranspirationEtcMm} mm/day`} />
              </div>
            </DrawerSection>
          </div>
        )}

        {activeTab === 'sensors' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[11px] mb-1">Current Soil Moisture</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {item.soilMoistureCurrentPct}%
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Capacitive Sensor Probe</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[11px] mb-1">Target Moisture Band</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {item.soilMoistureTargetPct}%
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Field Capacity Optimal</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <span className="font-semibold text-slate-200 block text-xs">
                Irrigation Recommendation Algorithm (ICAR Model)
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Calculated based on daily reference evapotranspiration (ETc: {item.evapotranspirationEtcMm} mm/day),
                canopy cover coefficient (Kc: 1.05), and root zone depletion threshold in {item.soilType}.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'json' && <DocJson doc={item} />}
      </DetailDrawer>
    )
  }

  // CGWB Station Drawer
  if (type === 'cgwb') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.stationCode}
        subtitle={`${item.stationName} (${item.district})`}
        onClose={onClose}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <StatusBadge status={item.category} type="cgwb" />
            <span className="font-mono text-slate-400 text-xs">
              Last Ping: {new Date(item.lastReadingAt).toLocaleTimeString('en-IN')}
            </span>
          </div>

          <DrawerSection title="Aquifer & Groundwater Depth">
            <div className="grid grid-cols-3 gap-2 font-mono text-center mb-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Current Level</span>
                <span className="text-lg font-bold text-cyan-400">{item.currentWaterLevelMbgl} mbgl</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Pre-Monsoon</span>
                <span className="text-lg font-bold text-amber-400">{item.preMonsoonMbgl} mbgl</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Post-Monsoon</span>
                <span className="text-lg font-bold text-emerald-400">{item.postMonsoonMbgl} mbgl</span>
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <KeyValue label="Recharge Trend" value={`${item.rechargeTrendPct > 0 ? `+${item.rechargeTrendPct}` : item.rechargeTrendPct}%`} />
              <KeyValue label="Critical Depth Threshold" value={`${item.criticalDepthThresholdMbgl} mbgl`} />
              <KeyValue label="Hydrogeological Formation" value={item.aquiferType} />
              <KeyValue label="Sensor Health" value={`${item.sensorStatus} · Battery ${item.batteryPercent}%`} />
              <KeyValue label="Coordinates" value={`${item.coordinates?.lat}, ${item.coordinates?.lng}`} />
            </div>
          </DrawerSection>

          <DocJson doc={item} />
        </div>
      </DetailDrawer>
    )
  }

  // Canal Schedule Drawer
  if (type === 'canal') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.canalName}
        subtitle={`Code: ${item.canalCode} · ${item.division}`}
        onClose={onClose}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <StatusBadge status={item.status} type="canal" />
            <span className="font-mono text-cyan-400 font-bold text-sm">
              {item.dischargeCusecs} Cusecs Flow
            </span>
          </div>

          <DrawerSection title="Rotation Window & Timetable">
            <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <KeyValue label="Rotation Cycle" value={item.rotationCycle} />
              <KeyValue label="Release Window Start" value={new Date(item.rotationStartDate).toLocaleString('en-IN')} />
              <KeyValue label="Release Window End" value={new Date(item.rotationEndDate).toLocaleString('en-IN')} />
              <KeyValue label="Quota Allocation" value={`${item.waterQuotaMldPerHa} MLD / Hectare`} />
              <KeyValue label="Source Dam" value={item.waterSourceDam} />
              <KeyValue label="Command Area" value={`${item.commandAreaAcres.toLocaleString('en-IN')} Acres`} />
            </div>
          </DrawerSection>

          <DrawerSection title="Beneficiary Minors & Villages">
            <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <KeyValue label="Distributary Minor" value={item.distributaryMinor} />
              <KeyValue label="Beneficiary Villages" value={item.beneficiaryVillages?.join(', ')} />
              <KeyValue label="Farmers Notified" value={`${item.notifiedFarmersCount} SMS Dispatched`} />
              <KeyValue label="Maintenance Notes" value={item.maintenanceNotes || 'Normal operational discharge.'} />
            </div>
          </DrawerSection>

          {onUpdateCanal && (
            <div className="pt-2">
              <button
                onClick={() => onUpdateCanal(item)}
                className="w-full py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
              >
                Modify Canal Rotation Timetable
              </button>
            </div>
          )}

          <DocJson doc={item} />
        </div>
      </DetailDrawer>
    )
  }

  // Subsidy Application Drawer
  if (type === 'subsidy') {
    return (
      <DetailDrawer
        open={Boolean(item)}
        title={item.applicationNumber}
        subtitle={`${item.farmerName} · PMKSY Subsidy`}
        onClose={onClose}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <StatusBadge status={item.status} />
            <span className="font-mono text-emerald-400 font-bold text-sm">
              ₹{item.calculatedSubsidyInr?.toLocaleString('en-IN')} Subsidy
            </span>
          </div>

          <DrawerSection title="Farmer & Land Details">
            <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <KeyValue label="Farmer Name" value={item.farmerName} />
              <KeyValue label="Aadhaar (DPDP Masked)" value={item.aadhaarMasked} />
              <KeyValue label="Category" value={item.category} />
              <KeyValue label="Area" value={`${item.landAreaAcres} Acres (${item.landAreaHectares} Ha)`} />
            </div>
          </DrawerSection>

          <DrawerSection title="Micro-Irrigation Equipment">
            <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
              <KeyValue label="System Type" value={item.systemType} />
              <KeyValue label="Approved Manufacturer" value={item.manufacturer} />
              <KeyValue label="Quotation Total" value={`₹${item.quotationAmountInr?.toLocaleString('en-IN')}`} />
              <KeyValue label="Subsidy (55%)" value={`₹${item.calculatedSubsidyInr?.toLocaleString('en-IN')}`} />
              <KeyValue label="Farmer Out-of-Pocket" value={`₹${item.farmerShareInr?.toLocaleString('en-IN')}`} />
              <KeyValue label="Inspection Status" value={item.fieldInspectionStatus} />
              <KeyValue label="Inspector" value={item.inspectorName || 'Pending'} />
            </div>
          </DrawerSection>

          {item.status !== 'approved' && onApproveSubsidy && (
            <div className="pt-2">
              <button
                onClick={() => onApproveSubsidy(item)}
                className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                Approve PMKSY Subsidy (₹{item.calculatedSubsidyInr?.toLocaleString('en-IN')})
              </button>
            </div>
          )}

          <DocJson doc={item} />
        </div>
      </DetailDrawer>
    )
  }

  return null
}
