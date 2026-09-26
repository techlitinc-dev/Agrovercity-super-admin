import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Truck,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  ArrowRight,
  ShieldAlert,
  Eye
} from 'lucide-react';
import { fmtRupees } from '../../lib/format.js';
import DetailDrawer, { DrawerSection, DocJson } from '../DetailDrawer.jsx';
import { Card, KeyValue } from '../ui.jsx';

export function LiveDispatchRadarView({
  activeTrips = [],
  onOverrideStatus,
  onArbitrate,
  loading = false
}) {
  const [inspectTrip, setInspectTrip] = useState(null);

  return (
    <div className="space-y-4">
      {/* Live Dispatch Header & Status Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
              Live Fleet Telemetry & GPS Radar
            </span>
          </div>
          <h2 className="text-lg lg:text-xl font-black mt-1">
            Active Dispatches & Rural Transit Corridors
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl font-medium">
            SOP-08 §3: Real-time route tracking, farm-gate pickup milestones, APMC mandi delivery windows, and emergency breakdown alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Live Active Trips</div>
            <div className="text-xl font-black font-mono text-emerald-400">{activeTrips.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Corridor Speed Avg</div>
            <div className="text-xl font-black font-mono text-teal-300">46 km/h</div>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Synchronizing live GPS transponder coordinates...</span>
        </div>
      ) : activeTrips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm text-slate-500">
          <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <div className="font-bold text-slate-800">No Vehicles In Live Transit</div>
          <div className="text-xs text-slate-400 mt-1">All dispatched trips are currently completed or waiting for driver assignment.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTrips.map((trip) => {
            const isDisputed = trip.status === 'disputed';
            const progress = trip.status === 'delivered' ? 100 : trip.status === 'in_transit' ? 68 : 20;

            return (
              <div
                key={trip.id}
                className={`bg-white rounded-3xl border p-4.5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between ${
                  isDisputed ? 'border-rose-300 ring-2 ring-rose-100' : 'border-emerald-100/90'
                }`}
              >
                {/* Trip Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {trip.id}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {trip.vehicleRegistration}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        isDisputed
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : trip.status === 'in_transit'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border-blue-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{trip.status.replace(/_/g, ' ').toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Route & Cargo */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Pickup (Farm-Gate)</div>
                        <div className="font-bold text-slate-900">{trip.pickupPoint?.village}</div>
                        <div className="text-[10px] text-slate-500">{trip.pickupPoint?.taluka}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="space-y-0.5 text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Drop (Mandi / Hub)</div>
                        <div className="font-bold text-slate-900">{trip.dropPoint?.mandi}</div>
                        <div className="text-[10px] text-slate-500">{trip.dropPoint?.district}</div>
                      </div>
                    </div>

                    {/* Cargo & Fare Banner */}
                    <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Commodity Cargo:</div>
                        <div className="font-bold text-slate-800">{trip.cargo?.quantity} {trip.cargo?.commodity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Fare:</div>
                        <div className="font-mono font-bold text-emerald-800">{fmtRupees(trip.fareAmount)}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">Route Progress</span>
                        <span className="font-bold text-emerald-700">{progress}% ({trip.distanceKm} km total)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Telemetry Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                      <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 font-bold">
                        <Gauge className="w-3 h-3 text-emerald-600" />
                        <span>{trip.speedKmph} km/h</span>
                      </div>
                      <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 font-bold">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span>ETA ~{trip.estimatedMinutesRemaining}m</span>
                      </div>
                      <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                        <MapPin className="w-3 h-3 text-emerald-700" />
                        <span className="truncate max-w-[120px]">{trip.liveGpsCoordinates}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Operational Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                    <span className="font-bold text-slate-900">{trip.transporterName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDisputed ? (
                      <button
                        onClick={() => onArbitrate && onArbitrate(trip)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>Arbitrate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOverrideStatus && onOverrideStatus(trip)}
                        className="px-2 py-1 text-xs font-bold text-slate-700 hover:text-emerald-900 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-xl transition-all"
                        title="Manual trip status override"
                      >
                        Override
                      </button>
                    )}

                    <button
                      onClick={() => setInspectTrip(trip)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Telemetry</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Slide-Over Drawer for Trip Telemetry */}
      <DetailDrawer
        open={Boolean(inspectTrip)}
        onClose={() => setInspectTrip(null)}
        title={inspectTrip ? `Live Dispatch #${inspectTrip.id}` : ''}
        subtitle={inspectTrip ? `${inspectTrip.vehicleRegistration} · ${inspectTrip.pickupPoint?.village} to ${inspectTrip.dropPoint?.mandi}` : ''}
      >
        {inspectTrip && (
          <>
            <DrawerSection title="Telemetry Snapshot">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Booking ID" v={inspectTrip.id} mono />
                <KeyValue k="Vehicle Registration" v={inspectTrip.vehicleRegistration} mono />
                <KeyValue k="Vehicle Class" v={inspectTrip.vehicleClass} />
                <KeyValue k="Transporter" v={`${inspectTrip.transporterName} (${inspectTrip.transporterMobile || 'N/A'})`} />
                <KeyValue k="Customer Farmer" v={`${inspectTrip.customerName} (${inspectTrip.customerMobile})`} />
                <KeyValue k="Live GPS Transponder" v={inspectTrip.liveGpsCoordinates} mono />
                <KeyValue k="Current Road Speed" v={`${inspectTrip.speedKmph} km/h`} mono />
                <KeyValue k="Estimated Arrival" v={`~${inspectTrip.estimatedMinutesRemaining} minutes`} />
                <KeyValue k="Trip Fare" v={fmtRupees(inspectTrip.fareAmount)} mono />
              </Card>
            </DrawerSection>

            <DrawerSection title="Route & Gate Coordinates">
              <Card className="divide-y divide-emerald-100/60 px-4 py-1">
                <KeyValue k="Origin Farm-Gate" v={`${inspectTrip.pickupPoint?.village}, ${inspectTrip.pickupPoint?.taluka}, ${inspectTrip.pickupPoint?.district}`} />
                <KeyValue k="Destination Mandi Yard" v={`${inspectTrip.dropPoint?.mandi}, ${inspectTrip.dropPoint?.district}`} />
                <KeyValue k="Billed Transit Distance" v={`${inspectTrip.distanceKm} km`} mono />
                <KeyValue k="Crop Cargo" v={`${trip => inspectTrip.cargo?.quantity} ${inspectTrip.cargo?.commodity}`} />
              </Card>
            </DrawerSection>

            <DrawerSection title="Raw Telemetry JSON">
              <DocJson doc={inspectTrip} />
            </DrawerSection>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
