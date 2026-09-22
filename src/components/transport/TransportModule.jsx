import React, { useState, useEffect, useCallback } from 'react';
import { Truck, ShieldCheck } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminTransportService } from '../../services/adminTransportService';

import { TransportMetricBar } from './TransportMetricBar';
import { TransportSearchAndFilterBar } from './TransportSearchAndFilterBar';
import { FleetVehiclesTable } from './FleetVehiclesTable';
import { TransportBookingsTable } from './TransportBookingsTable';
import { SettlementsTable } from './SettlementsTable';
import { TransportDetailDrawer } from './TransportDetailDrawer';
import { VerifyVehicleModal } from './VerifyVehicleModal';
import { SuspendVehicleModal } from './SuspendVehicleModal';
import { ManualStatusModal } from './ManualStatusModal';
import { ArbitrateDisputeModal } from './ArbitrateDisputeModal';
import { ReleasePayoutModal } from './ReleasePayoutModal';

export function TransportModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'fleet' | 'bookings' | 'settlements'
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
  const [settlements, setSettlements] = useState([]);
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
    } else {
      csvContent += 'Settlement ID,Transporter,Booking ID,Trips,Gross Fare,Platform Fee %,Net Payout,Payout Mode,POD Audit Status,Sign-offs,Status\n';
      settlements.forEach((s) => {
        csvContent += `"${s.id}","${s.transporterName}","${s.bookingId}",${s.tripsCount},${s.grossFare},${s.platformFeePercent},${s.payoutAmount},"${s.payoutMode}","${s.podAuditStatus}",${(s.signOffs || []).length},"${s.status}"\n`;
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
      settlements;

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
            On-demand rural logistics oversight: fleet paper verification, live dispatch monitoring, dispute arbitration, fare band management & proof-of-delivery payout audits.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-mono text-emerald-800 bg-white/90 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto shadow-2xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dispatch Engine Active</span>
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
    </div>
  );
}
