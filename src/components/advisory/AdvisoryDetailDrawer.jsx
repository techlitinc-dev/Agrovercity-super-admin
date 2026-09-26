import { BrainCircuit, RadioTower, TestTube2, TrendingUp, Sliders, AlertTriangle, ShieldCheck } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button, EmptyState } from '../ui'
import { AdvisoryStatusBadge } from '../../pages/advisoryWidgets'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export default function AdvisoryDetailDrawer({
  entity,
  tab,
  npkConfig,
  onClose,
  onMarkFalsePositive,
  onBroadcast,
  onUploadResults,
  onCalibrateSubstitution,
}) {
  if (!entity) return null

  const getTitle = () => {
    return `#${entity.id}`
  }

  const getSubtitle = () => {
    if (tab === 'scans') return `${entity.farmerName} · ${entity.district} · ${entity.crop}`
    if (tab === 'alerts') return `${entity.pestName} · ${entity.district} (${entity.radiusKm}km)`
    if (tab === 'soil') return `${entity.farmerName} · Sample: ${entity.sampleCode} · ${entity.district}`
    if (tab === 'saturation' || tab === 'cycles') return `${entity.crop} · ${entity.district} · ${entity.season}`
    return `${entity.id}`
  }

  return (
    <DetailDrawer
      open={!!entity}
      onClose={onClose}
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {tab === 'scans' && (
        <ScanView scan={entity} onMarkFalsePositive={onMarkFalsePositive} />
      )}
      {tab === 'alerts' && (
        <AlertView alert={entity} onBroadcast={onBroadcast} />
      )}
      {tab === 'soil' && (
        <SoilView test={entity} npkConfig={npkConfig} onUploadResults={onUploadResults} />
      )}
      {(tab === 'saturation' || tab === 'cycles') && (
        <CycleView cycle={entity} onCalibrateSubstitution={onCalibrateSubstitution} />
      )}

      <DrawerSection title="Document JSON (audit view)">
        <DocJson doc={entity} />
      </DrawerSection>
    </DetailDrawer>
  )
}

function ScanView({ scan, onMarkFalsePositive }) {
  return (
    <>
      <DrawerSection title="Diagnosis (CNN Leaf Scan)">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Farmer" v={scan.farmerName} />
          <KeyValue k="Crop / District" v={`${scan.crop} · ${scan.district}`} />
          <KeyValue k="Diagnosed Disease" v={scan.diagnosis} />
          <KeyValue k="Severity" v={scan.severity} />
          <div className="mt-2.5 pt-2 border-t border-emerald-100/60">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Model Confidence</span>
              <span className="font-mono font-bold text-emerald-800">{(scan.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-100 border border-emerald-200">
              <div
                className={`h-full rounded-full transition-all ${scan.confidence >= 0.85 ? 'bg-emerald-600' : scan.confidence >= 0.7 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, scan.confidence * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-slate-500">model: {scan.modelVersion || 'cnn-leafnet-v4.2'}</p>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Farmer Feedback (False Positive Monitor)">
        {scan.farmerFeedback === 'pending' ? (
          <EmptyState title="Awaiting farmer feedback" hint="The farmer has not yet confirmed or disputed this diagnosis." />
        ) : scan.farmerFeedback === 'confirmed' ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-900 font-semibold shadow-2xs">
            <BrainCircuit className="h-4 w-4 text-emerald-600" /> Diagnosis confirmed by farmer in field
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 shadow-2xs">
            <p className="text-xs font-bold text-rose-900">Reported as false positive</p>
            <p className="mt-1 text-xs text-rose-800">{scan.falsePositiveReason || 'Farmer indicated symptoms do not match actual crop pathogen.'}</p>
          </div>
        )}
      </DrawerSection>

      {scan.status === 'pending_review' && (
        <DrawerSection title="Actions">
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => onMarkFalsePositive(scan)}>
              Mark False Positive
            </Button>
          </div>
        </DrawerSection>
      )}
    </>
  )
}

function AlertView({ alert, onBroadcast }) {
  return (
    <>
      <DrawerSection title="Outbreak Alert">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Pest / Disease" v={alert.pestName} />
          <KeyValue k="District" v={alert.district} />
          <KeyValue k="Severity" v={alert.severity} />
          <KeyValue k="Affected Crop" v={alert.crop} />
          <KeyValue k="Geofence Radius" v={`${alert.radiusKm} km`} mono />
          <KeyValue k="Broadcast At" v={alert.broadcastAt?.slice(0, 16).replace('T', ' ')} mono />
          <KeyValue k="Broadcast By" v={alert.broadcastBy || 'root@agrovercity'} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Message Sent to Farmers">
        <div className="rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5 text-xs text-slate-800 leading-relaxed shadow-2xs">
          {alert.message || '—'}
        </div>
      </DrawerSection>

      <DrawerSection title="Delivery Reach">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3.5 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-emerald-600" />
            <span className="font-mono text-lg font-bold text-emerald-900">{alert.recipientsNotified?.toLocaleString('en-IN') || 0}</span>
            <span className="text-xs text-slate-600">farmers notified within geofence</span>
          </div>
        </div>
      </DrawerSection>

      {['active', 'expired', 'cancelled'].includes(alert.status) && (
        <DrawerSection title="Actions">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onBroadcast(alert)}>
              Re-broadcast Updated Alert
            </Button>
          </div>
        </DrawerSection>
      )}
    </>
  )
}

function SoilView({ test, npkConfig, onUploadResults }) {
  const canUpload = ['sample_collected', 'lab_processing'].includes(test.status)

  return (
    <>
      <DrawerSection title="Soil Sample">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Farmer" v={test.farmerName} />
          <KeyValue k="Sample Code" v={test.sampleCode} mono />
          <KeyValue k="Plot Survey No" v={test.surveyNo} mono />
          <KeyValue k="District" v={test.district} />
          <KeyValue k="Lab" v={test.labName} />
          <KeyValue k="Collected At" v={test.collectedAt?.slice(0, 10)} mono />
        </div>
      </DrawerSection>

      {test.status === 'result_uploaded' ? (
        <>
          <DrawerSection title="Lab Results (NPK & Micronutrients)">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
              <KeyValue k="Nitrogen (N)" v={`${test.nitrogen} kg/ha`} mono />
              <KeyValue k="Phosphorus (P)" v={`${test.phosphorus} kg/ha`} mono />
              <KeyValue k="Potassium (K)" v={`${test.potassium} kg/ha`} mono />
              <KeyValue k="pH" v={test.ph} mono />
              <KeyValue k="Organic Carbon" v={`${test.organicCarbon}%`} mono />
              <KeyValue k="Report PDF" v={test.reportUrl} mono />
            </div>
          </DrawerSection>

          <DrawerSection title="NPK Recommendation (ICAR Algorithm)">
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-950 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <TestTube2 className="h-4 w-4 text-emerald-600" />
                ICAR Soil Recommendation
              </div>
              <p className="leading-relaxed">{test.recommendation || '—'}</p>
              <p className="mt-2 font-mono text-[10px] text-emerald-700 font-medium">
                generated by {npkConfig?.algorithmVersion || 'icar-npk'} · farmer notified via SMS + app push
              </p>
            </div>
          </DrawerSection>
        </>
      ) : (
        <DrawerSection title="Lab Results">
          <EmptyState title="Results not uploaded yet" hint="Upload the laboratory result PDF to trigger the farmer notification." />
        </DrawerSection>
      )}

      {canUpload && (
        <DrawerSection title="Actions">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onUploadResults(test)}>
              Upload Lab Results & Notify Farmer
            </Button>
          </div>
        </DrawerSection>
      )}
    </>
  )
}

function CycleView({ cycle, onCalibrateSubstitution }) {
  return (
    <>
      <DrawerSection title="Crop Cycle & Saturation Metrics">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 px-3.5 py-2.5 shadow-2xs">
          <KeyValue k="Commodity" v={cycle.crop} />
          <KeyValue k="District / Season" v={`${cycle.district} · ${cycle.season}`} />
          <KeyValue k="Acreage Sown" v={`${cycle.acreageSown?.toLocaleString('en-IN')} Acres`} mono />
          <KeyValue k="Target Market Capacity" v={`${cycle.targetMarketCapacityAcres?.toLocaleString('en-IN')} Acres`} mono />
          <KeyValue k="Saturation Index" v={`${cycle.saturationIndexPercent}%`} mono />
          <KeyValue k="Price Risk Status" v={cycle.priceRiskStatus} />
          <KeyValue k="Expected Yield" v={cycle.expectedYieldPerAcre} />
        </div>
      </DrawerSection>

      <DrawerSection title="Recommended Crop Substitution">
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-950 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Strategic Diversification Target
          </div>
          <p className="text-sm font-semibold text-emerald-950">{cycle.recommendedSubstitution}</p>
          <p className="mt-1 text-slate-600 leading-relaxed">
            Market oversupply risk index triggers automated diversification guidance across AGROVERCITY mandi advisories to protect farmers against price crashes.
          </p>
        </div>
      </DrawerSection>

      <DrawerSection title="Actions">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onCalibrateSubstitution(cycle)}>
            <Sliders className="h-4 w-4 mr-1.5" /> Calibrate Substitution Model
          </Button>
        </div>
      </DrawerSection>
    </>
  )
}
