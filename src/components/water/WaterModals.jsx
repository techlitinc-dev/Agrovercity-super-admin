import React, { useState, useEffect } from 'react'
import {
  Waves,
  Gauge,
  Droplets,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  BellRing,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'

// 1. UPDATE CANAL SCHEDULE MODAL (SOP-17 §3)
export function UpdateCanalScheduleModal({ open, canal, onClose, onConfirm }) {
  const [dischargeCusecs, setDischargeCusecs] = useState(400)
  const [rotationStartDate, setRotationStartDate] = useState('')
  const [rotationEndDate, setRotationEndDate] = useState('')
  const [status, setStatus] = useState('scheduled')
  const [maintenanceNotes, setMaintenanceNotes] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (canal) {
      setDischargeCusecs(canal.dischargeCusecs || 400)
      setRotationStartDate(canal.rotationStartDate ? canal.rotationStartDate.slice(0, 16) : '')
      setRotationEndDate(canal.rotationEndDate ? canal.rotationEndDate.slice(0, 16) : '')
      setStatus(canal.status || 'scheduled')
      setMaintenanceNotes(canal.maintenanceNotes || '')
      setReason(`Adjusted rotational discharge to ${canal.dischargeCusecs} cusecs based on Niphad command demand.`)
    }
  }, [canal])

  if (!open || !canal) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        id: canal.id,
        dischargeCusecs: Number(dischargeCusecs),
        rotationStartDate: new Date(rotationStartDate).toISOString(),
        rotationEndDate: new Date(rotationEndDate).toISOString(),
        status,
        maintenanceNotes,
        reason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-3">
          <Waves className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Update Canal Rotation Timetable (SOP-17 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Adjust water release timetable and flow discharge rate for <span className="font-semibold text-slate-200">{canal.canalName}</span> ({canal.division}).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Discharge Rate (Cusecs)</label>
              <input
                type="number"
                value={dischargeCusecs}
                onChange={(e) => setDischargeCusecs(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="active_rotation">Active Flow Release</option>
                <option value="scheduled">Scheduled Release</option>
                <option value="maintenance_closure">Maintenance Closure</option>
                <option value="dry_spell">Water Deficit Hold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Release Start Date/Time</label>
              <input
                type="datetime-local"
                value={rotationStartDate}
                onChange={(e) => setRotationStartDate(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Release End Date/Time</label>
              <input
                type="datetime-local"
                value={rotationEndDate}
                onChange={(e) => setRotationEndDate(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Field Maintenance / Inspection Notes</label>
            <input
              type="text"
              value={maintenanceNotes}
              onChange={(e) => setMaintenanceNotes(e.target.value)}
              placeholder="e.g. Siphon desilted; tail-end minor gates inspected"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Administrative Audit Justification (Mandatory)</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold disabled:opacity-50"
            >
              {busy ? 'Saving...' : 'Apply Timetable Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2. SYNC CGWB STATIONS MODAL (SOP-17 §3)
export function SyncCgwbStationModal({ open, onClose, onConfirm }) {
  const [district, setDistrict] = useState('All Districts')
  const [reason, setReason] = useState('Routine 12-hour automated telemetry reconciliation with Central Ground Water Board.')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        district,
        reason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <h3 className="text-base font-bold text-slate-100">
            Batch Sync CGWB Stations (SOP-17 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Poll Central Ground Water Board (CGWB) telemetry API to ingest real-time hydrological piezometer readings across all monitoring stations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All Districts">All Monitored Districts (Maharashtra &amp; MP)</option>
              <option value="Nashik">Nashik</option>
              <option value="Jalna">Jalna</option>
              <option value="Beed">Beed</option>
              <option value="Latur">Latur</option>
              <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Audit Justification</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold disabled:opacity-50"
            >
              {busy ? 'Syncing...' : 'Poll CGWB Gateway'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 3. CONFIGURE PMKSY SUBSIDY RULES MODAL (SOP-17 §3)
export function ConfigurePmksyRulesModal({ open, rules, onClose, onConfirm }) {
  const [smallMarginalSubsidyPct, setSmallMarginalSubsidyPct] = useState(55)
  const [otherFarmerSubsidyPct, setOtherFarmerSubsidyPct] = useState(45)
  const [dripCeilingPerHaInr, setDripCeilingPerHaInr] = useState(85000)
  const [sprinklerCeilingPerHaInr, setSprinklerCeilingPerHaInr] = useState(35000)
  const [additionalStateTopUpPct, setAdditionalStateTopUpPct] = useState(10)
  const [reason, setReason] = useState('Aligned with Central Ministry of Agriculture micro-irrigation guideline revisions.')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (rules) {
      setSmallMarginalSubsidyPct(rules.smallMarginalSubsidyPct || 55)
      setOtherFarmerSubsidyPct(rules.otherFarmerSubsidyPct || 45)
      setDripCeilingPerHaInr(rules.dripCeilingPerHaInr || 85000)
      setSprinklerCeilingPerHaInr(rules.sprinklerCeilingPerHaInr || 35000)
      setAdditionalStateTopUpPct(rules.additionalStateTopUpPct || 10)
    }
  }, [rules])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        smallMarginalSubsidyPct: Number(smallMarginalSubsidyPct),
        otherFarmerSubsidyPct: Number(otherFarmerSubsidyPct),
        dripCeilingPerHaInr: Number(dripCeilingPerHaInr),
        sprinklerCeilingPerHaInr: Number(sprinklerCeilingPerHaInr),
        additionalStateTopUpPct: Number(additionalStateTopUpPct),
        reason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-3">
          <SlidersHorizontal className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Configure PMKSY Subsidy Parameters (SOP-17 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Update subsidy calculation ratios, per-hectare ceiling caps, and Mahadbt state top-up allowances for Per Drop More Crop (PDMC).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Small / Marginal Farmer Subsidy (%)</label>
              <input
                type="number"
                value={smallMarginalSubsidyPct}
                onChange={(e) => setSmallMarginalSubsidyPct(e.target.value)}
                min="10"
                max="90"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Other Farmers Subsidy (%)</label>
              <input
                type="number"
                value={otherFarmerSubsidyPct}
                onChange={(e) => setOtherFarmerSubsidyPct(e.target.value)}
                min="10"
                max="80"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Drip Ceiling (₹ / Hectare)</label>
              <input
                type="number"
                value={dripCeilingPerHaInr}
                onChange={(e) => setDripCeilingPerHaInr(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sprinkler Ceiling (₹ / Hectare)</label>
              <input
                type="number"
                value={sprinklerCeilingPerHaInr}
                onChange={(e) => setSprinklerCeilingPerHaInr(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Additional State Top-Up (%) for SC/ST/Women</label>
            <input
              type="number"
              value={additionalStateTopUpPct}
              onChange={(e) => setAdditionalStateTopUpPct(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Policy Rationale for Audit Log</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold disabled:opacity-50"
            >
              {busy ? 'Saving...' : 'Update Subsidy Rules'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 4. ISSUE DROUGHT & WATER DEFICIT ALERT MODAL (SOP-17 §3)
export function IssueDroughtAlertModal({ open, onClose, onConfirm }) {
  const [district, setDistrict] = useState('Beed')
  const [tehsilsText, setTehsilsText] = useState('Ashti, Georai, Kaij')
  const [alertLevel, setAlertLevel] = useState('SEVERE_DROUGHT')
  const [headline, setHeadline] = useState('भूजल पातळी २० मीटर खाली — तातडीने सूक्ष्म सिंचन लागू करा')
  const [message, setMessage] = useState('Groundwater piezometers show severe water table depletion below 20 mbgl. Flood irrigation prohibited; farmers requested to adopt nighttime drip cycles.')
  const [waterSavingTargetPct, setWaterSavingTargetPct] = useState(35)
  const [estimatedRecipients, setEstimatedRecipients] = useState(15000)
  const [affectedAcreage, setAffectedAcreage] = useState(38000)
  const [reason, setReason] = useState('CGWB observatory alerts triggered critical depth thresholds in Ashti basin.')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const tehsils = tehsilsText.split(',').map((t) => t.trim()).filter(Boolean)
      await onConfirm({
        district,
        tehsils,
        alertLevel,
        alertLevelText: alertLevel === 'SEVERE_DROUGHT' ? 'गंभीर दुष्काळ इशारा' : 'पाणी टंचाई इशारा',
        headline,
        message,
        waterSavingTargetPct: Number(waterSavingTargetPct),
        estimatedRecipients: Number(estimatedRecipients),
        affectedAcreage: Number(affectedAcreage),
        reason,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-rose-400 mb-3">
          <BellRing className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Broadcast Emergency Drought &amp; Low-Water Alert (SOP-17 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Issues high-priority SMS broadcast and app notifications with water conservation directives to farmers in affected tehsils.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Beed">Beed</option>
                <option value="Latur">Latur</option>
                <option value="Jalna">Jalna</option>
                <option value="Dharashiv">Dharashiv (Osmanabad)</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Nashik">Nashik</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Alert Severity Level</label>
              <select
                value={alertLevel}
                onChange={(e) => setAlertLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="SEVERE_DROUGHT">Severe Drought (गंभीर दुष्काळ)</option>
                <option value="MODERATE_WATER_DEFICIT">Moderate Water Deficit</option>
                <option value="CANAL_MAINTENANCE">Canal Maintenance Restriction</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Affected Tehsils (Comma Separated)</label>
            <input
              type="text"
              value={tehsilsText}
              onChange={(e) => setTehsilsText(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Alert Headline (Vernacular / English)</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-bold focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Conservation Advisory Message</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Water Saving (%)</label>
              <input
                type="number"
                value={waterSavingTargetPct}
                onChange={(e) => setWaterSavingTargetPct(e.target.value)}
                min="5"
                max="80"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Estimated SMS Broadcast</label>
              <input
                type="number"
                value={estimatedRecipients}
                onChange={(e) => setEstimatedRecipients(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Administrative Audit Justification</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold disabled:opacity-50"
            >
              {busy ? 'Broadcasting...' : 'Broadcast Drought Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. APPROVE PMKSY SUBSIDY MODAL
export function ApprovePmksySubsidyModal({ open, application, onClose, onConfirm }) {
  const [dualSignOffNotes, setDualSignOffNotes] = useState('GPS field inspection verified. Micro-irrigation equipment installed and operating satisfactorily.')
  const [busy, setBusy] = useState(false)

  if (!open || !application) return null

  const exceedsDualThreshold = (application.calculatedSubsidyInr || 0) > 50000

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        applicationId: application.id,
        reason: dualSignOffNotes,
        adminUid: 'superadmin_root',
        adminName: 'Vikram Mehta (Chief Risk Officer)'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-400 mb-3">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-100">
            Approve PMKSY Subsidy Disbursal
          </h3>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs mb-4 space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Application:</span>
            <span className="text-cyan-400 font-bold">{application.applicationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Farmer:</span>
            <span className="text-slate-200">{application.farmerName}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">Subsidy Amount:</span>
            <span className="text-emerald-400 font-bold text-sm">
              ₹{application.calculatedSubsidyInr?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {exceedsDualThreshold && (
          <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-purple-400" />
            <span>Amount exceeds ₹50,000 threshold: Dual Admin Sign-Off rule applied per SOP-17 §6.3.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Administrative Approval Justification</label>
            <textarea
              rows={3}
              value={dualSignOffNotes}
              onChange={(e) => setDualSignOffNotes(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50"
            >
              {busy ? 'Approving...' : 'Confirm Subsidy Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
