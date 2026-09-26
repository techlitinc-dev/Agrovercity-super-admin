import React, { useState, useEffect, useCallback } from 'react';
import { Truck, ShieldCheck } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminTransportService } from '../../services/adminTransportService';

import { TransportMetricBar } from './TransportMetricBar';
import { TransportSearchAndFilterBar } from './TransportSearchAndFilterBar';
import { FleetVehiclesTable } from './FleetVehiclesTable';
import { TransportBookingsTable } from './TransportBookingsTable';
import { LiveDispatchRadarView } from './LiveDispatchRadarView';
import { SettlementsTable } from './SettlementsTable';
import { FareBandsTable } from './FareBandsTable';
import { TransportAuditTrailTable } from './TransportAuditTrailTable';
import { TransportDetailDrawer } from './TransportDetailDrawer';

import { VerifyVehicleModal } from './VerifyVehicleModal';
import { SuspendVehicleModal } from './SuspendVehicleModal';
import { ManualStatusModal } from './ManualStatusModal';
import { ArbitrateDisputeModal } from './ArbitrateDisputeModal';
import { ReleasePayoutModal } from './ReleasePayoutModal';
import { VehicleRegistrationModal } from './VehicleRegistrationModal';
import { FareBandModal } from './FareBandModal';

export function TransportModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'fleet' | 'bookings' | 'live_dispatch' | 'settlements' | 'fare_bands' | 'audit_trail'
  const [activeTab, setActiveTab] = useState('fleet');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data states
  const [kpis, setKpis] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [fareBands, setFareBands] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectEntity, setInspectEntity] = useState(null);
  const [inspectEntityType, setInspectEntityType] = useState(null);
  const [verifyVehicleTarget, setVerifyVehicleTarget] = useState(null);
  const [manualStatusBooking, setManualStatusBooking] = useState(null);
  const [arbitrateBooking, setArbitrateBooking] = useState(null);
  const [payoutSettlement, setPayoutSettlement] = useState(null);
  const [suspendVehicleTarget, setSuspendVehicleTarget] = useState(null);
  const [isRegisteringVehicle, setIsRegisteringVehicle] = useState(false);
  const [editingFareBand, setEditingFareBand] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch KPI Summary
  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminTransportService.getTransportKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load KPIs', e);
    }
  }, []);

  // Fetch Main Data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'fleet') {
        const res = await adminTransportService.listVehicles({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setVehicles(res.data.vehicles);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'bookings') {
        const res = await adminTransportService.listBookings({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setBookings(res.data.bookings);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'live_dispatch') {
        const res = await adminTransportService.listLiveDispatchTrips();
        if (res.success) {
          let list = res.data.activeTrips;
          if (statusFilter && statusFilter !== 'all') {
            list = list.filter((t) => t.status === statusFilter);
          }
          if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter((t) =>
              t.id.toLowerCase().includes(q) ||
              t.vehicleRegistration.toLowerCase().includes(q) ||
              t.transporterName.toLowerCase().includes(q)
            );
          }
          setActiveTrips(list);
          setPagination({ page: 1, limit: 20, total: list.length, totalPages: 1 });
        }
      } else if (activeTab === 'settlements') {
        const res = await adminTransportService.listSettlements({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setSettlements(res.data.settlements);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'fare_bands') {
        const res = await adminTransportService.listFareBands({
          query: searchQuery,
          vehicleClass: statusFilter
        });
        if (res.success) {
          setFareBands(res.data.fareBands);
          setPagination({ page: 1, limit: 20, total: res.data.fareBands.length, totalPages: 1 });
        }
      } else if (activeTab === 'audit_trail') {
        const res = await adminTransportService.listTransportAuditLogs({
          query: searchQuery,
          action: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setAuditLogs(res.data.auditLogs);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Fetching Transport Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, statusFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters or tab change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  // Drawer openers per entity type
  const openDrawer = (entity, entityType) => {
    setInspectEntity(entity);
    setInspectEntityType(entityType);
  };

  const closeDrawer = () => {
    setInspectEntity(null);
    setInspectEntityType(null);
  };

  // Handle Vehicle Paper Verification
  const handleConfirmVerifyVehicle = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.verifyVehicle({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Fleet Papers Verified',
        message: res.message,
        type: 'success'
      });
      setVerifyVehicleTarget(null);
      if (inspectEntity && inspectEntity.id === data.vehicleId && inspectEntityType === 'vehicle') {
        setInspectEntity(res.vehicle);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Verification Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Register Vehicle
  const handleRegisterVehicle = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.createVehicle(data, currentAdmin?.email);
      addToast({
        title: 'Vehicle Registered',
        message: res.message,
        type: 'success'
      });
      setIsRegisteringVehicle(false);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Registration Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Edit Fare Band
  const handleSaveFareBand = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.updateFareBand({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Tariff Band Updated',
        message: res.message,
        type: 'success'
      });
      setEditingFareBand(null);
      fetchData();
    } catch (err) {
      addToast({
        title: 'Tariff Revision Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Vehicle Suspend / Reinstate
  const handleConfirmSuspendVehicle = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.setVehicleDispatchability({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Fleet Dispatch Updated',
        message: res.message,
        type: 'info'
      });
      setSuspendVehicleTarget(null);
      if (inspectEntity && inspectEntity.id === data.vehicleId && inspectEntityType === 'vehicle') {
        setInspectEntity(res.vehicle);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Action Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Manual Booking Status Override
  const handleConfirmStatusOverride = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.updateBookingStatus({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Trip Status Overridden',
        message: res.message,
        type: 'info'
      });
      setManualStatusBooking(null);
      if (inspectEntity && inspectEntity.id === data.bookingId && inspectEntityType === 'booking') {
        setInspectEntity(res.booking);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Override Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Dispute Arbitration
  const handleConfirmArbitration = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.arbitrateBookingDispute({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Binding Arbitration Recorded',
        message: res.message,
        type: 'success'
      });
      setArbitrateBooking(null);
      if (inspectEntity && inspectEntity.id === data.bookingId && inspectEntityType === 'booking') {
        setInspectEntity(res.booking);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Arbitration Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle POD Audit & Payout Release
  const handleConfirmPayout = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminTransportService.auditPodAndReleasePayout({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'POD Audit Recorded',
        message: res.message,
        type: data.approved ? 'success' : 'info'
      });
      setPayoutSettlement(null);
      if (inspectEntity && inspectEntity.id === data.settlementId && inspectEntityType === 'settlement') {
        setInspectEntity(res.settlement);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Payout Action Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'fleet') {
      csvContent += 'Vehicle ID,Transporter,Mobile,Registration,Vehicle Class,District,Capacity (T),Per-Km Rate,Base Fare,RC Verified,Insurance Verified,Fitness Verified,Status\n';
      vehicles.forEach((v) => {
        csvContent += `"${v.id}","${v.transporterName}","${v.transporterMobile}","${v.registrationNumber}","${v.vehicleClass}","${v.district}",${v.capacityTons},${v.perKmRate},${v.baseFare},"${v.rcBook?.verified ? 'YES' : 'NO'}","${v.commercialInsurance?.verified ? 'YES' : 'NO'}","${v.fitnessCertificate?.verified ? 'YES' : 'NO'}","${v.status}"\n`;
      });
    } else if (activeTab === 'bookings') {
      csvContent += 'Booking ID,Customer,Persona,Pickup,Drop,Distance (Km),Vehicle,Transporter,Fare (INR),Payment,Status\n';
      bookings.forEach((b) => {
        csvContent += `"${b.id}","${b.customerName}","${b.customerPersona}","${b.pickupPoint.village}","${b.dropPoint.mandi}",${b.distanceKm},"${b.vehicleId || 'UNASSIGNED'}","${b.transporterName || 'UNASSIGNED'}",${b.fareAmount},"${b.paymentStatus}","${b.status}"\n`;
      });
    } else if (activeTab === 'live_dispatch') {
      csvContent += 'Trip ID,Vehicle,Transporter,Pickup,Drop,Cargo,Speed (km/h),ETA (min),Live GPS,Status\n';
      activeTrips.forEach((t) => {
        csvContent += `"${t.id}","${t.vehicleRegistration}","${t.transporterName}","${t.pickupPoint?.village}","${t.dropPoint?.mandi}","${t.cargo?.quantity} ${t.cargo?.commodity}",${t.speedKmph},${t.estimatedMinutesRemaining},"${t.liveGpsCoordinates}","${t.status}"\n`;
      });
    } else if (activeTab === 'settlements') {
      csvContent += 'Settlement ID,Transporter,Booking ID,Trips,Gross Fare,Platform Fee %,Net Payout,Payout Mode,POD Audit Status,Sign-offs,Status\n';
      settlements.forEach((s) => {
        csvContent += `"${s.id}","${s.transporterName}","${s.bookingId}",${s.tripsCount},${s.grossFare},${s.platformFeePercent},${s.payoutAmount},"${s.payoutMode}","${s.podAuditStatus}",${(s.signOffs || []).length},"${s.status}"\n`;
      });
    } else if (activeTab === 'fare_bands') {
      csvContent += 'Band ID,Corridor,District,Vehicle Class,Base Fare,Per-Km Rate,Min Distance,Waiting (INR/hr),Night Surcharge %\n';
      fareBands.forEach((f) => {
        csvContent += `"${f.id}","${f.corridor}","${f.district}","${f.vehicleClass}",${f.baseFare},${f.perKmRate},${f.minDistanceKm},${f.waitingChargePerHour},${f.nightSurchargePercent}\n`;
      });
    } else {
      csvContent += 'Audit ID,Admin UID,Action,Target ID,Target Name,Previous State,New State,Reason,IP Address,Timestamp\n';
      auditLogs.forEach((l) => {
        csvContent += `"${l.id}","${l.adminUid}","${l.action}","${l.targetUserId}","${l.targetUserName}","${l.previousState}","${l.newState}","${l.reason}","${l.ipAddress || '14.139.122.9'}","${l.timestamp}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrovercity_transport_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'CSV Export Downloaded',
      message: `Exported transport ${activeTab} dataset snapshot.`,
      type: 'info'
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport =
      activeTab === 'fleet' ? vehicles :
      activeTab === 'bookings' ? bookings :
      activeTab === 'live_dispatch' ? activeTrips :
      activeTab === 'settlements' ? settlements :
      activeTab === 'fare_bands' ? fareBands :
      auditLogs;

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrovercity_transport_${activeTab}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'JSON Export Ready',
      message: `Exported JSON payload for ${dataToExport.length} records.`,
      type: 'info'
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-emerald-600" />
              <span>Transport Logistics & Fleet Operations</span>
            </h1>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
              SOP-08
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            On-demand rural logistics oversight: fleet paper verification, live dispatch radar, dynamic per-km fare bands, dispute arbitration & proof-of-delivery payout audits.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-mono text-emerald-800 bg-white/90 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto shadow-2xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dispatch & Telemetry Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <TransportMetricBar kpis={kpis} loading={loading} />

      {/* 3. Search & Filter Bar */}
      <TransportSearchAndFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRegisterVehicle={() => setIsRegisteringVehicle(true)}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        loading={loading}
      />

      {/* 4. Active Tab Data Grid */}
      {activeTab === 'fleet' && (
        <FleetVehiclesTable
          vehicles={vehicles}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectVehicle={(v) => openDrawer(v, 'vehicle')}
          onVerifyPapers={(v) => setVerifyVehicleTarget(v)}
          onToggleSuspend={(v) => setSuspendVehicleTarget(v)}
          loading={loading}
        />
      )}

      {activeTab === 'bookings' && (
        <TransportBookingsTable
          bookings={bookings}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectBooking={(b) => openDrawer(b, 'booking')}
          onArbitrate={(b) => setArbitrateBooking(b)}
          onOverrideStatus={(b) => setManualStatusBooking(b)}
          loading={loading}
        />
      )}

      {activeTab === 'live_dispatch' && (
        <LiveDispatchRadarView
          activeTrips={activeTrips}
          onOverrideStatus={(trip) => setManualStatusBooking(trip)}
          onArbitrate={(trip) => setArbitrateBooking(trip)}
          loading={loading}
        />
      )}

      {activeTab === 'settlements' && (
        <SettlementsTable
          settlements={settlements}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectSettlement={(s) => openDrawer(s, 'settlement')}
          onAuditPayout={(s) => setPayoutSettlement(s)}
          loading={loading}
        />
      )}

      {activeTab === 'fare_bands' && (
        <FareBandsTable
          fareBands={fareBands}
          onEditFareBand={(band) => setEditingFareBand(band)}
          loading={loading}
        />
      )}

      {activeTab === 'audit_trail' && (
        <TransportAuditTrailTable
          auditLogs={auditLogs}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          loading={loading}
        />
      )}

      {/* 5. Detail Slide-Over Drawer */}
      <TransportDetailDrawer
        isOpen={Boolean(inspectEntity)}
        onClose={closeDrawer}
        entity={inspectEntity}
        entityType={inspectEntityType}
        onVerifyPapers={(v) => setVerifyVehicleTarget(v)}
        onArbitrate={(b) => setArbitrateBooking(b)}
        onOverrideStatus={(b) => setManualStatusBooking(b)}
        onAuditPayout={(s) => setPayoutSettlement(s)}
      />

      {/* 6. Vehicle Commercial Papers Verification Modal */}
      <VerifyVehicleModal
        isOpen={Boolean(verifyVehicleTarget)}
        onClose={() => setVerifyVehicleTarget(null)}
        vehicle={verifyVehicleTarget}
        onConfirm={handleConfirmVerifyVehicle}
        loading={actionLoading}
      />

      {/* 7. Manual Trip Status Override Modal */}
      <ManualStatusModal
        isOpen={Boolean(manualStatusBooking)}
        onClose={() => setManualStatusBooking(null)}
        booking={manualStatusBooking}
        onConfirm={handleConfirmStatusOverride}
        loading={actionLoading}
      />

      {/* 8. Dispute / No-Show Arbitration Modal */}
      <ArbitrateDisputeModal
        isOpen={Boolean(arbitrateBooking)}
        onClose={() => setArbitrateBooking(null)}
        booking={arbitrateBooking}
        onConfirm={handleConfirmArbitration}
        loading={actionLoading}
      />

      {/* 9. POD Audit & Payout Release Modal */}
      <ReleasePayoutModal
        isOpen={Boolean(payoutSettlement)}
        onClose={() => setPayoutSettlement(null)}
        settlement={payoutSettlement}
        onConfirm={handleConfirmPayout}
        loading={actionLoading}
      />

      {/* 10. Vehicle Suspend / Reinstate Modal */}
      <SuspendVehicleModal
        isOpen={Boolean(suspendVehicleTarget)}
        onClose={() => setSuspendVehicleTarget(null)}
        vehicle={suspendVehicleTarget}
        onConfirm={handleConfirmSuspendVehicle}
        loading={actionLoading}
      />

      {/* 11. Vehicle Registration Modal */}
      <VehicleRegistrationModal
        isOpen={isRegisteringVehicle}
        onClose={() => setIsRegisteringVehicle(false)}
        onSave={handleRegisterVehicle}
        loading={actionLoading}
      />

      {/* 12. Fare Band Pricing Revision Modal */}
      <FareBandModal
        isOpen={Boolean(editingFareBand)}
        onClose={() => setEditingFareBand(null)}
        fareBand={editingFareBand}
        onSave={handleSaveFareBand}
        loading={actionLoading}
      />
    </div>
  );
}
