import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Server,
  Terminal,
  Zap,
  Check,
  Edit3
} from 'lucide-react';
import { adminMandiService } from '../../services/adminMandiService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';

export function AgmarknetGatewayMonitor({ onOpenManualOverride }) {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();
  const [gateways, setGateways] = useState([]);
  const [failureAlerts, setFailureAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pingingId, setPingingId] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await adminMandiService.listGatewayHealth();
      setGateways(data.gateways);
      setFailureAlerts(data.failureAlerts);
    } catch (err) {
      addToast({
        title: 'Failed to Fetch Gateway Health',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Ping Gateway Diagnostic Test
  const handlePingGateway = async (gatewayId) => {
    setPingingId(gatewayId);
    try {
      const res = await adminMandiService.pingGateway({
        gatewayId,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Gateway Ping Success',
        message: res.message,
        type: 'success'
      });
      fetchHealth();
    } catch (err) {
      addToast({
        title: 'Ping Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setPingingId(null);
    }
  };

  // Resolve Alert Incident
  const handleResolveAlert = async (alertId) => {
    try {
      const res = await adminMandiService.resolveGatewayAlert({
        alertId,
        resolution: 'Administrative verification & fallback verified by Superadmin',
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Incident Resolved',
        message: res.message,
        type: 'success'
      });
      fetchHealth();
    } catch (err) {
      addToast({
        title: 'Resolution Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // Trigger Global Agmarknet Sync
  const handleTriggerSyncAll = async () => {
    setSyncingAll(true);
    try {
      const res = await adminMandiService.triggerAgmarknetSync({
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Full Ingestion Synced',
        message: res.message,
        type: 'success'
      });
      fetchHealth();
    } catch (err) {
      addToast({
        title: 'Sync Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSyncingAll(false);
    }
  };

  const activeAlertsCount = failureAlerts.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Global Health Overview */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Wifi className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Agmarknet & eNAM API Gateway Health & Ingestion Pipeline</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SOP-04 §3
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitors automated 2-hourly government price feed ingestion, SOAP/REST latency, timeout thresholds, and feed breakage alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerSyncAll}
              disabled={syncingAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-all active:scale-95"
            >
              <Zap className={`w-3.5 h-3.5 ${syncingAll ? 'animate-bounce' : ''}`} />
              <span>{syncingAll ? 'Ingesting Feeds...' : 'Trigger Full Gateway Sync'}</span>
            </button>

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="p-2 bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 rounded-xl transition-all"
              title="Refresh Gateway Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Gateway System Status</div>
            <div className="text-lg font-bold text-emerald-800 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.8% Online</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">3 Operational · 1 Delayed</div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Average Latency</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">145 ms</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Normal nominal threshold (&lt;500ms)</div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Sync Jobs Today</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-1">12 Ingestions</div>
            <div className="text-[10px] text-slate-400 mt-0.5">2-Hourly automated cadence</div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Active Failure Alerts</div>
            <div className="text-lg font-bold font-mono text-amber-700 mt-1">
              {activeAlertsCount} Incident{activeAlertsCount === 1 ? '' : 's'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Automated triage queue</div>
          </div>
        </div>
      </div>

      {/* 2. Connected Gateways Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{gw.name}</h3>
                    <div className="text-[11px] text-slate-500">{gw.governingBody}</div>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                  gw.status === 'operational'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${gw.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {gw.status}
                </span>
              </div>

              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-600 truncate">
                {gw.endpoint}
              </div>

              <p className="text-xs text-slate-500 mt-2.5">{gw.description}</p>

              {/* Gateway Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Latency:</span>
                  <div className="font-mono font-bold text-slate-800">{gw.latencyMs} ms</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Uptime:</span>
                  <div className="font-mono font-bold text-emerald-700">{gw.uptimePercent}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Rate Limit:</span>
                  <div className="font-mono font-bold text-slate-800">{gw.rateLimit}</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Heartbeat: {new Date(gw.lastHeartbeat).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>

              <button
                onClick={() => handlePingGateway(gw.id)}
                disabled={pingingId === gw.id}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-700" />
                <span>{pingingId === gw.id ? 'Pinging...' : 'Ping Test'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Failure Alerts & Feed Incident Triage Queue */}
      <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-100/60 via-emerald-50/80 to-emerald-100/40 border-b border-emerald-200/80 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Feed Ingestion Failure Alerts & Fallback Queue</span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {activeAlertsCount} Active Incident
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            SOP-04 §3 & §6 Guardrails
          </span>
        </div>

        <div className="divide-y divide-emerald-100/60">
          {failureAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 transition-colors ${
                alert.status === 'active' ? 'bg-amber-50/30' : 'bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800">{alert.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-emerald-800">{alert.gatewayName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                      alert.status === 'active'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {alert.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Affected Mandi: <strong className="text-slate-700 font-semibold">{alert.affectedMandi}</strong></span>
                    <span>•</span>
                    <span>Reported: {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Incident Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'active' ? (
                    <>
                      <button
                        onClick={() => onOpenManualOverride?.()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold shadow-2xs transition-all"
                        title="Engage manual price entry for this broken government feed"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Manual Override</span>
                      </button>

                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-2xs transition-all active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve Alert</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
