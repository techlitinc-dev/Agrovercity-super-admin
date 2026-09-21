import { BrainCircuit, RadioTower, TestTube2 } from 'lucide-react'
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer'
import { KeyValue, Button, EmptyState } from '../ui'
import { AdvisoryStatusBadge } from '../../pages/advisoryWidgets'

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export default function AdvisoryDetailDrawer({ entity, tab, npkConfig, onClose, onMarkFalsePositive, onBroadcast, onUploadResults }) {
  if (!entity) return null

  return (
    <DetailDrawer
      open={!!entity}
      onClose={onClose}
      title={`#${entity.id}`}
      subtitle={`${entity.farmerName || entity.pestName} · ${entity.district} · ${tab}`}
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
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Farmer" v={scan.farmerName} />
          <KeyValue k="Crop / District" v={`${scan.crop} · ${scan.district}`} />
          <KeyValue k="Diagnosed Disease" v={scan.diagnosis} />
          <KeyValue k="Severity" v={scan.severity} />
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Model Confidence</span>
              <span className="font-mono text-slate-300">{(scan.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${scan.confidence >= 0.85 ? 'bg-emerald-500' : scan.confidence >= 0.7 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, scan.confidence * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-slate-500">model: {scan.modelVersion}</p>
          </div>
        </div>
      </DrawerSection>

      <DrawerSection title="Farmer Feedback (False Positive Monitor)">
        {scan.farmerFeedback === 'pending' ? (
          <EmptyState title="Awaiting farmer feedback" hint="The farmer has not yet confirmed or disputed this diagnosis." />
        ) : scan.farmerFeedback === 'confirmed' ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <BrainCircuit className="h-4 w-4" /> Diagnosis confirmed by farmer
          </div>
        ) : (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
            <p className="text-sm font-semibold text-rose-300">Reported as false positive</p>
            <p className="mt-1 text-xs text-rose-200/80">{scan.falsePositiveReason}</p>
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
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <KeyValue k="Pest / Disease" v={alert.pestName} />
          <KeyValue k="District" v={alert.district} />
          <KeyValue k="Severity" v={alert.severity} />
          <KeyValue k="Affected Crop" v={alert.crop} />
          <KeyValue k="Geofence Radius" v={`${alert.radiusKm} km`} mono />
          <KeyValue k="Broadcast At" v={alert.broadcastAt?.slice(0, 16).replace('T', ' ')} mono />
          <KeyValue k="Broadcast By" v={alert.broadcastBy} mono />
        </div>
      </DrawerSection>

      <DrawerSection title="Message Sent to Farmers">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
          {alert.message || '—'}
        </div>
      </DrawerSection>

      <DrawerSection title="Delivery Reach">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-lg font-bold text-emerald-400">{alert.recipientsNotified.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500">farmers notified within geofence</span>
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
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
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
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
              <KeyValue k="Nitrogen (N)" v={`${test.nitrogen} kg/ha`} mono />
              <KeyValue k="Phosphorus (P)" v={`${test.phosphorus} kg/ha`} mono />
              <KeyValue k="Potassium (K)" v={`${test.potassium} kg/ha`} mono />
              <KeyValue k="pH" v={test.ph} mono />
              <KeyValue k="Organic Carbon" v={`${test.organicCarbon}%`} mono />
              <KeyValue k="Report PDF" v={test.reportUrl} mono />
            </div>
          </DrawerSection>

          <DrawerSection title="NPK Recommendation (ICAR Algorithm)">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <TestTube2 className="mb-1 h-4 w-4" />
              {test.recommendation || '—'}
              <p className="mt-2 font-mono text-[10px] text-emerald-400/70">
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
