import React, { useState, useEffect } from 'react'
import {
  Layers,
  FileText,
  Building2,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Database,
  Lock,
  Download,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'

// 1. MANUAL PROVISION RECORD MODAL (Downtime Bypass)
export function ManualProvisionRecordModal({ open, onClose, onConfirm }) {
  const [gatNumber, setGatNumber] = useState('')
  const [khataNumber, setKhataNumber] = useState('')
  const [ferfarNumber, setFerfarNumber] = useState('')
  const [village, setVillage] = useState('Ozarkhed')
  const [taluka, setTaluka] = useState('Dindori')
  const [district, setDistrict] = useState('Nashik')
  const [state, setState] = useState('Maharashtra')
  const [ownerName, setOwnerName] = useState('')
  const [vernacularOwnerName, setVernacularOwnerName] = useState('')
  const [totalAreaAcres, setTotalAreaAcres] = useState(2.5)
  const [totalAreaHectares, setTotalAreaHectares] = useState(1.01)
  const [landClass, setLandClass] = useState('जिरायत (Dry Crop)')
  const [soilType, setSoilType] = useState('मध्यम काळी (Medium Black)')
  const [irrigationType, setIrrigationType] = useState('Well / Tube Well')
  const [encumbrances, setEncumbrances] = useState('Nil / Clean Title')
  const [reason, setReason] = useState('State portal Mahabhulekh maintenance outage. Farmer presented physical certified 7/12 copy with Talathi stamp for immediate insurance enrollment.')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleAcresChange = (val) => {
    const acres = Number(val)
    setTotalAreaAcres(acres)
    setTotalAreaHectares(Number((acres / 2.47105).toFixed(2)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        gatNumber,
        khataNumber,
        ferfarNumber: ferfarNumber || 'F-MANUAL',
        village,
        taluka,
        district,
        state,
        recordType: '712',
        ownerName,
        vernacularOwnerName: vernacularOwnerName || ownerName,
        totalAreaAcres: Number(totalAreaAcres),
        totalAreaHectares: Number(totalAreaHectares),
        landClass,
        soilType,
        irrigationType,
        encumbrances,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-4">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-extrabold text-slate-900">
            Manual Land Record Provisioning (SOP-16 §3)
          </h3>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          Direct emergency injection of verified 7/12 land records during state revenue portal downtime. All overrides require an administrative audit justification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Gat Number (गट क्र.)</label>
              <input
                type="text"
                value={gatNumber}
                onChange={(e) => setGatNumber(e.target.value)}
                required
                placeholder="e.g. 128/1A"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Khata Number</label>
              <input
                type="text"
                value={khataNumber}
                onChange={(e) => setKhataNumber(e.target.value)}
                required
                placeholder="e.g. 52"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Ferfar Mutation #</label>
              <input
                type="text"
                value={ferfarNumber}
                onChange={(e) => setFerfarNumber(e.target.value)}
                placeholder="e.g. 1420"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Taluka</label>
              <input
                type="text"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Owner Name (English)</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                placeholder="e.g. Ramesh Dnyaneshwar Patil"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Owner Name (Marathi Vernacular)</label>
              <input
                type="text"
                value={vernacularOwnerName}
                onChange={(e) => setVernacularOwnerName(e.target.value)}
                placeholder="e.g. रमेश ज्ञानेश्वर पाटील"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Total Land Area (Acres)</label>
              <input
                type="number"
                step="0.01"
                value={totalAreaAcres}
                onChange={(e) => handleAcresChange(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Area in Hectares</label>
              <input
                type="number"
                step="0.01"
                value={totalAreaHectares}
                onChange={(e) => setTotalAreaHectares(Number(e.target.value))}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Land Classification</label>
              <select
                value={landClass}
                onChange={(e) => setLandClass(e.target.value)}
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="जिरायत (Dry Crop)">जिरायत (Dry Crop)</option>
                <option value="बागायत (Perennial Irrigated)">बागायत (Perennial Irrigated)</option>
                <option value="पाटाची बागायत (Canal Irrigated)">पाटाची बागायत (Canal Irrigated)</option>
                <option value="भातशेती (Paddy)">भातशेती (Paddy)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Bank Encumbrances (बोझा)</label>
              <input
                type="text"
                value={encumbrances}
                onChange={(e) => setEncumbrances(e.target.value)}
                placeholder="e.g. Nil / Clean Title OR Bank Name"
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Administrative Audit Justification (Mandatory)</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Provisioning...' : 'Inject Land Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2. RESOLVE DISCREPANCY MODAL
export function ResolveDiscrepancyModal({ open, record, onClose, onConfirm }) {
  const [totalAreaAcres, setTotalAreaAcres] = useState(0)
  const [totalAreaHectares, setTotalAreaHectares] = useState(0)
  const [encumbrances, setEncumbrances] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (record) {
      setTotalAreaAcres(record.totalAreaAcres || 0)
      setTotalAreaHectares(record.totalAreaHectares || 0)
      setEncumbrances(record.encumbrances || '')
      setNotes('Reconciled subdivision area with Revenue Inspector joint inspection map.')
    }
  }, [record])

  if (!open || !record) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({
        totalAreaAcres: Number(totalAreaAcres),
        totalAreaHectares: Number(totalAreaHectares),
        encumbrances,
        notes,
        adminUid: 'superadmin_root'
      })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-amber-700 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-extrabold text-slate-900">Resolve Land Record Discrepancy</h3>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs mb-4 space-y-1">
          <div className="flex justify-between font-mono">
            <span className="text-slate-500 font-sans font-bold">Gat Number:</span>
            <span className="text-emerald-700 font-bold">{record.gatNumber} ({record.village})</span>
          </div>
          <p className="text-amber-800 font-mono text-[11px] pt-1 font-semibold">
            Flagged Issue: {record.discrepancyDetails || 'Parsing or survey subdivision discrepancy'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Reconciled Area (Acres)</label>
              <input
                type="number"
                step="0.01"
                value={totalAreaAcres}
                onChange={(e) => setTotalAreaAcres(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Reconciled Area (Hectares)</label>
              <input
                type="number"
                step="0.01"
                value={totalAreaHectares}
                onChange={(e) => setTotalAreaHectares(e.target.value)}
                required
                className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Updated Bank Encumbrances (बोझा)</label>
            <input
              type="text"
              value={encumbrances}
              onChange={(e) => setEncumbrances(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Reconciliation Notes for Audit Log</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Resolving...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 3. SEED VILLAGE CACHE MODAL (SOP-16 §5)
export function SeedVillageCacheModal({ open, onClose, onConfirm }) {
  const [village, setVillage] = useState('Ozarkhed')
  const [district, setDistrict] = useState('Nashik')
  const [count, setCount] = useState(50)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({ village, district, count: Number(count) })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-sky-700 mb-4">
          <Database className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-extrabold text-slate-900">Seed Village Land Records Cache</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          Pre-warms the Redis distributed cache for an entire village/taluka to ensure sub-5ms lookup latency for farmers during peak crop loan and insurance cycles.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Village Name</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Nashik">Nashik</option>
              <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
              <option value="Jalna">Jalna</option>
              <option value="Beed">Beed</option>
              <option value="Latur">Latur</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Estimated Gat Records to Ingest</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="10"
              max="500"
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Seeding...' : 'Seed Redis Cache'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 4. GOVERNMENT COMPLIANCE EXPORT MODAL (SOP-16 §3)
export function GovernmentExportModal({ open, onClose, onConfirm }) {
  const [district, setDistrict] = useState('All Districts')
  const [authority, setAuthority] = useState('District Collectorate Land Revenue Audit')
  const [format, setFormat] = useState('CSV')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await onConfirm({ district, authority, format })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700 mb-4">
          <Download className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-extrabold text-slate-900">Export Government Compliance Dossier</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          Generates an authenticated land ownership verification extract log for government authorities and institutional audits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Target District Jurisdiction</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="All Districts">All Districts (Consolidated)</option>
              <option value="Nashik">District Nashik</option>
              <option value="Chhatrapati Sambhajinagar">District Chhatrapati Sambhajinagar</option>
              <option value="Jalna">District Jalna</option>
              <option value="Beed">District Beed</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Reporting Authority</label>
            <select
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="District Collectorate Land Revenue Audit">District Collectorate Land Revenue Audit</option>
              <option value="State Level Bankers Committee (SLBC) KCC Audit">SLBC Institutional Credit Verification</option>
              <option value="PMFBY State Nodal Agency">PMFBY State Nodal Insurance Review</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Export Data Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="CSV">CSV Spreadsheet with Cryptographic Hashes</option>
              <option value="PDF">Official Signed PDF Compliance Dossier</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs disabled:opacity-50 transition"
            >
              {busy ? 'Generating...' : 'Generate & Download Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. DPDP ACT LAND RECORDS PRIVACY COMPLIANCE MODAL
export function DpdpLandComplianceModal({ open, result, onClose }) {
  if (!open || !result) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-emerald-100/90 bg-white p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-emerald-700">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Land Records Data Privacy &amp; Masking Audit
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Timestamp: {new Date(result.timestamp).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">
              Digital Personal Data Protection (DPDP) Act 2023 Check
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold">
              PASS ({result.passRate}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-600">{result.rule}</p>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Total Audited:</span>
              <span className="text-slate-900 font-bold">{result.totalAudited}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Aadhaar Masked:</span>
              <span className="text-emerald-700 font-bold">{result.passedCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold">Leaks Detected:</span>
              <span className="text-emerald-700 font-bold">{result.leaksDetected}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Acknowledge Findings
          </button>
        </div>
      </div>
    </div>
  )
}

