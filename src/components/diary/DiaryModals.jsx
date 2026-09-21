import React, { useState, useEffect } from 'react'
import {
  X,
  Calculator,
  Sliders,
  FileText,
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  Coins,
  ShieldCheck
} from 'lucide-react'
import { Button, Field, Input } from '../ui'
import { fmtINR, maskPhone, maskAadhaar } from '../../pages/diaryWidgets'

function ModalShell({ title, subtitle, onClose, children, maxWidth = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl`}>
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export function CalibrateBenchmarkModal({
  open,
  benchmark,
  busy,
  onConfirm,
  onCancel
}) {
  const [baselineCost, setBaselineCost] = useState('')
  const [seedsCost, setSeedsCost] = useState('')
  const [fertilizerCost, setFertilizerCost] = useState('')
  const [laborCost, setLaborCost] = useState('')
  const [machineryCost, setMachineryCost] = useState('')
  const [pesticidesCost, setPesticidesCost] = useState('')
  const [targetYield, setTargetYield] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (benchmark) {
      setBaselineCost(benchmark.baselineCostPerAcre || '')
      setSeedsCost(benchmark.seedsCost || '')
      setFertilizerCost(benchmark.fertilizerCost || '')
      setLaborCost(benchmark.laborCost || '')
      setMachineryCost(benchmark.machineryCost || '')
      setPesticidesCost(benchmark.pesticidesCost || '')
      setTargetYield(benchmark.targetYieldQuintalsPerAcre || '')
      setReason('')
    }
  }, [benchmark])

  if (!open || !benchmark) return null

  const calculatedCost =
    (Number(seedsCost) || 0) +
    (Number(fertilizerCost) || 0) +
    (Number(laborCost) || 0) +
    (Number(machineryCost) || 0) +
    (Number(pesticidesCost) || 0)

  const calculatedBreakEven =
    Number(targetYield) > 0 ? Math.round((Number(baselineCost) || calculatedCost) / Number(targetYield)) : 0

  const blocked = reason.trim().length < 4 || !baselineCost || !targetYield

  const handleSave = () => {
    onConfirm(benchmark.crop, {
      baselineCostPerAcre: Number(baselineCost),
      seedsCost: Number(seedsCost),
      fertilizerCost: Number(fertilizerCost),
      laborCost: Number(laborCost),
      machineryCost: Number(machineryCost),
      pesticidesCost: Number(pesticidesCost),
      targetYieldQuintalsPerAcre: Number(targetYield),
      reason: reason.trim()
    })
  }

  return (
    <ModalShell
      title={`Calibrate Input Cost Benchmark — ${benchmark.crop}`}
      subtitle={`${benchmark.state} · Season: ${benchmark.season} · Current Baseline: ${fmtINR(benchmark.baselineCostPerAcre)}/acre`}
      onClose={onCancel}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Baseline Cost / Acre (₹)">
            <Input
              type="number"
              value={baselineCost}
              onChange={(e) => setBaselineCost(e.target.value)}
              placeholder="e.g. 24500"
            />
          </Field>
          <Field label="Target Yield (Quintals / Acre)">
            <Input
              type="number"
              step="0.5"
              value={targetYield}
              onChange={(e) => setTargetYield(e.target.value)}
              placeholder="e.g. 9.5"
            />
          </Field>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Cost Component Breakdown (₹ / Acre)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Seeds">
              <Input
                type="number"
                value={seedsCost}
                onChange={(e) => setSeedsCost(e.target.value)}
              />
            </Field>
            <Field label="Fertilizers">
              <Input
                type="number"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(e.target.value)}
              />
            </Field>
            <Field label="Labor">
              <Input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
              />
            </Field>
            <Field label="Machinery">
              <Input
                type="number"
                value={machineryCost}
                onChange={(e) => setMachineryCost(e.target.value)}
              />
            </Field>
            <Field label="Pesticides">
              <Input
                type="number"
                value={pesticidesCost}
                onChange={(e) => setPesticidesCost(e.target.value)}
              />
            </Field>
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sum Breakdown
              </span>
              <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono font-bold text-slate-200">
                {fmtINR(calculatedCost)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs">Calibrated Break-Even Benchmark Price:</span>
            <div className="font-mono text-base font-extrabold text-emerald-400">
              {fmtINR(calculatedBreakEven)} / quintal
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400">MSP Benchmark:</span>
            <div className="font-mono font-bold text-slate-200">{fmtINR(benchmark.mspRate)} / qtl</div>
          </div>
        </div>

        <Field label="Administrative Rationale / Source (Recorded in Immutable Audit Log)">
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Updated fertilizer MRP indices from State Agri Dept circular Q3"
            autoFocus
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={blocked || busy}>
            {busy ? 'Calibrating…' : 'Publish Calibrated Benchmark'}
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}

export function BreakEvenCalculatorModal({
  open,
  benchmarks,
  onCalculate,
  onCancel
}) {
  const [crop, setCrop] = useState('Soybean')
  const [areaAcres, setAreaAcres] = useState(4.0)
  const [expectedYield, setExpectedYield] = useState(38)
  const [totalExpenses, setTotalExpenses] = useState(98000)
  const [marketRate, setMarketRate] = useState(5350)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open) {
      handleRunCalculation()
    }
  }, [open, crop])

  if (!open) return null

  const handleSelectCrop = (cropName) => {
    setCrop(cropName)
    const matched = (benchmarks || []).find((b) => b.crop === cropName)
    if (matched) {
      const acres = 4.0
      const expYield = Math.round(matched.targetYieldQuintalsPerAcre * acres)
      const expenses = Math.round(matched.baselineCostPerAcre * acres)
      setAreaAcres(acres)
      setExpectedYield(expYield)
      setTotalExpenses(expenses)
      setMarketRate(matched.mspRate || 5000)
    }
  }

  const handleRunCalculation = async () => {
    setBusy(true)
    try {
      const res = await onCalculate({
        crop,
        areaAcres: Number(areaAcres),
        expectedYieldQuintals: Number(expectedYield),
        totalExpenses: Number(totalExpenses),
        marketExpectedRate: Number(marketRate)
      })
      setResult(res)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title="Pre-Sowing Break-Even Price Calculator"
      subtitle="Calibrate pre-sowing safety margins and minimum realization prices against current input cost baselines."
      onClose={onCancel}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Field label="Commodity / Crop">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                value={crop}
                onChange={(e) => handleSelectCrop(e.target.value)}
              >
                {(benchmarks || []).map((b) => (
                  <option key={b.crop} value={b.crop}>
                    {b.crop} ({b.state})
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Land Area (Acres)">
            <Input
              type="number"
              step="0.5"
              value={areaAcres}
              onChange={(e) => setAreaAcres(e.target.value)}
            />
          </Field>
          <Field label="Expected Total Yield (Quintals)">
            <Input
              type="number"
              step="1"
              value={expectedYield}
              onChange={(e) => setExpectedYield(e.target.value)}
            />
          </Field>
          <Field label="Total Anticipated Expenses (₹)">
            <Input
              type="number"
              value={totalExpenses}
              onChange={(e) => setTotalExpenses(e.target.value)}
            />
          </Field>
          <Field label="Expected Mandi / MSP Rate (₹/qtl)">
            <Input
              type="number"
              value={marketRate}
              onChange={(e) => setMarketRate(e.target.value)}
            />
          </Field>
          <div className="flex items-end">
            <Button
              variant="primary"
              className="w-full py-2"
              onClick={handleRunCalculation}
              disabled={busy}
            >
              {busy ? 'Calculating…' : 'Recalculate'}
            </Button>
          </div>
        </div>

        {result && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Pre-Sowing Financial Viability Output
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-slate-500 text-[10px] uppercase">Break-Even Price</span>
                <div className="font-mono text-base font-extrabold text-sky-400">
                  {fmtINR(result.breakEvenPricePerQuintal)} / qtl
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-slate-500 text-[10px] uppercase">Cost Per Acre</span>
                <div className="font-mono text-base font-extrabold text-slate-200">
                  {fmtINR(result.costPerAcre)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-slate-500 text-[10px] uppercase">Projected Net P&L</span>
                <div
                  className={`font-mono text-base font-extrabold ${
                    result.projectedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.projectedProfit >= 0
                    ? `+${fmtINR(result.projectedProfit)}`
                    : `-${fmtINR(Math.abs(result.projectedProfit))}`}
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-2.5">
                <span className="text-slate-500 text-[10px] uppercase">Projected ROI</span>
                <div className="font-mono text-base font-extrabold text-emerald-400">
                  {result.projectedRoi}%
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400">Safety Margin Above Break-Even:</span>
                <div className="font-mono font-bold text-slate-200">
                  {fmtINR(result.mspComparison.marginPerQuintal)} / quintal
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Projected Gross Revenue:</span>
                <div className="font-mono font-bold text-emerald-400">
                  {fmtINR(result.projectedRevenue)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="secondary" onClick={onCancel}>
            Close
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}

export function PdfReviewModal({
  open,
  reportData,
  onClose
}) {
  if (!open || !reportData) return null

  const isProfitable = reportData.netProfit >= 0

  const handlePrint = () => {
    window.print()
  }

  return (
    <ModalShell
      title="Certified Financial Statement & P&L Audit Document"
      subtitle="Official Superadmin PDF Audit View for Bank Credit Underwriting and PM-KISAN Tax Verification"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Printable Certificate Sheet */}
        <div
          id="printable-pnl-report"
          className="rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-200 shadow-inner space-y-6 print:border-none print:p-0"
        >
          {/* Official Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-xs font-bold text-white">
                  AG
                </span>
                <span className="font-mono text-base font-extrabold uppercase tracking-wider text-emerald-400">
                  AGROVERCITY Platform
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Digital Farm Bookkeeping & Certified Crop Profit & Loss Ledger (SOP-13 Audit ID: #{reportData.reportId})
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>Date: {new Date(reportData.generatedAt || Date.now()).toLocaleDateString()}</div>
              <div className="text-emerald-400 font-bold">DPDP COMPLIANT AUDIT</div>
            </div>
          </div>

          {/* Farmer & Crop Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Farmer Legal Name</span>
              <div className="font-bold text-slate-100">{reportData.farmerName}</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Contact Phone</span>
              <div className="font-mono text-slate-300">{maskPhone(reportData.farmerPhone)}</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Aadhaar Masked</span>
              <div className="font-mono text-slate-300">{maskAadhaar(reportData.aadhaarMasked)}</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px]">Jurisdiction</span>
              <div className="text-slate-300">{reportData.district}, Maharashtra</div>
            </div>
          </div>

          {/* Crop Economics Summary */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-300 text-xs">
              Crop Statement: {reportData.cropName} ({reportData.season})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <span className="text-[10px] uppercase text-slate-500">Gross Revenue</span>
                <div className="font-mono text-base font-bold text-slate-100">
                  {fmtINR(reportData.grossRevenue)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <span className="text-[10px] uppercase text-slate-500">Total Expenses</span>
                <div className="font-mono text-base font-bold text-slate-300">
                  {fmtINR(reportData.totalExpenses)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <span className="text-[10px] uppercase text-slate-500">Net Profit / Loss</span>
                <div className={`font-mono text-base font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isProfitable ? `+${fmtINR(reportData.netProfit)}` : `-${fmtINR(Math.abs(reportData.netProfit))}`}
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                <span className="text-[10px] uppercase text-slate-500">Return on Investment</span>
                <div className="font-mono text-base font-bold text-emerald-400">
                  {reportData.roiPercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Banking & Underwriting Indicators */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Loan Underwriting & Financial Soundness Parameters
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500">Break-Even Price:</span>
                <div className="font-mono font-bold text-sky-400">{fmtINR(reportData.breakEvenPricePerQuintal)} / qtl</div>
              </div>
              <div>
                <span className="text-slate-500">Credit Score:</span>
                <div className="font-mono font-bold text-emerald-400">{reportData.creditScore} / 900</div>
              </div>
              <div>
                <span className="text-slate-500">DSCR Ratio:</span>
                <div className="font-mono font-bold text-slate-200">{reportData.dscrRatio}x</div>
              </div>
              <div>
                <span className="text-slate-500">KCC Recommended:</span>
                <div className="font-mono font-bold text-emerald-400">{fmtINR(reportData.kccLimitRecommended)}</div>
              </div>
            </div>
          </div>

          {/* Digital Signatory Stamp */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-500">
            <div>
              <p className="font-mono text-emerald-400 font-semibold">
                ✓ Digitally Certified by AGROVERCITY Superadmin System
              </p>
              <p>Cryptographic HMAC SHA-256 Audit Seal: <span className="font-mono text-[10px]">e4b88f3a992c10b7</span></p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-300">Authorized Officer</p>
              <p className="text-slate-500">KVK Financial Underwriting Desk</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            Document ID: {reportData.reportId}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Print Statement
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const a = document.createElement('a')
                a.href = reportData.pdfDownloadUrl || '#'
                a.target = '_blank'
                a.download = `pnl-statement-${reportData.reportId}.pdf`
                a.click()
              }}
            >
              <Download className="h-4 w-4" /> Download Certified PDF
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
