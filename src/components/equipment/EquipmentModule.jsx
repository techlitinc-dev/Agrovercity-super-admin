import React, { useState, useEffect, useCallback } from 'react';
import { Tractor, GitBranch, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { adminEquipmentService } from '../../services/adminEquipmentService';

import { EquipmentMetricBar } from './EquipmentMetricBar';
import { EquipmentSearchAndFilterBar } from './EquipmentSearchAndFilterBar';
import { MachinesTable } from './MachinesTable';
import { SlotsTable } from './SlotsTable';
import { SlotBookingsTable } from './SlotBookingsTable';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { VerifyMachineModal } from './VerifyMachineModal';
import { ForceCancelBookingModal } from './ForceCancelBookingModal';
import { DepositForfeitureModal } from './DepositForfeitureModal';

export function EquipmentModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active view tab: 'machines' | 'slots' | 'bookings'
  const [activeTab, setActiveTab] = useState('machines');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerTypeFilter, setOwnerTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data states
  const [kpis, setKpis] = useState({});
  const [machines, setMachines] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Modals & Drawers states
  const [inspectEntity, setInspectEntity] = useState(null);
  const [inspectEntityType, setInspectEntityType] = useState(null);
  const [verifyMachineTarget, setVerifyMachineTarget] = useState(null);
  const [cancelBookingTarget, setCancelBookingTarget] = useState(null);
  const [damageBookingTarget, setDamageBookingTarget] = useState(null);
  const [suspendMachineTarget, setSuspendMachineTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch KPI Summary
  const fetchKpis = useCallback(async () => {
    try {
      const data = await adminEquipmentService.getEquipmentKpis();
      setKpis(data);
    } catch (e) {
      console.error('Failed to load KPIs', e);
    }
  }, []);

  // Fetch Main Data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'machines') {
        const res = await adminEquipmentService.listEquipment({
          query: searchQuery,
          status: statusFilter,
          ownerType: ownerTypeFilter,
          page,
          limit
        });
        if (res.success) {
          setMachines(res.data.machines);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'slots') {
        const res = await adminEquipmentService.listSlots({
          query: searchQuery,
          status: statusFilter,
          page,
          limit
        });
        if (res.success) {
          setSlots(res.data.slots);
          setPagination(res.data.pagination);
        }
      } else if (activeTab === 'bookings') {
        const res = await adminEquipmentService.listBookings({
          query: searchQuery,
          status: statusFilter,
          ownerType: ownerTypeFilter,
          page,
          limit
        });
        if (res.success) {
          setBookings(res.data.bookings);
          setPagination(res.data.pagination);
        }
      }
      fetchKpis();
    } catch (err) {
      addToast({
        title: 'Error Fetching Equipment Data',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, statusFilter, ownerTypeFilter, page, fetchKpis, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters or tab change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, statusFilter, ownerTypeFilter]);

  const openDrawer = (entity, entityType) => {
    setInspectEntity(entity);
    setInspectEntityType(entityType);
  };

  const closeDrawer = () => {
    setInspectEntity(null);
    setInspectEntityType(null);
  };

  // Handle Machine Paper Verification
  const handleConfirmVerifyMachine = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminEquipmentService.verifyEquipment({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Machinery Papers Verified',
        message: res.message,
        type: 'success'
      });
      setVerifyMachineTarget(null);
      if (inspectEntity && inspectEntity.id === data.equipmentId && inspectEntityType === 'machine') {
        setInspectEntity(res.machine);
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

  // Handle Machine Suspend / Reinstate
  const handleConfirmSuspendMachine = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminEquipmentService.setMachineBookability({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Booking Pool Updated',
        message: res.message,
        type: 'info'
      });
      setSuspendMachineTarget(null);
      if (inspectEntity && inspectEntity.id === data.equipmentId && inspectEntityType === 'machine') {
        setInspectEntity(res.machine);
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

  // Handle Booking Force Cancellation
  const handleConfirmForceCancel = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminEquipmentService.forceCancelBooking({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: 'Booking Force-Cancelled',
        message: res.message,
        type: 'success'
      });
      setCancelBookingTarget(null);
      if (inspectEntity && inspectEntity.id === data.bookingId && inspectEntityType === 'booking') {
        setInspectEntity(res.booking);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Cancellation Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Damage Report / Deposit Resolution
  const handleConfirmDamageResolution = async (data) => {
    setActionLoading(true);
    try {
      const res = await adminEquipmentService.resolveDamageReport({
        ...data,
        adminUid: currentAdmin?.email
      });
      addToast({
        title: res.requiresSecondSignOff ? 'Dual Sign-Off Pending (1/2)' : 'Damage Ruling Recorded',
        message: res.message,
        type: res.requiresSecondSignOff ? 'info' : 'success'
      });
      setDamageBookingTarget(null);
      if (inspectEntity && inspectEntity.id === data.bookingId && inspectEntityType === 'booking') {
        setInspectEntity(res.booking);
      }
      fetchData();
    } catch (err) {
      addToast({
        title: 'Damage Resolution Failed',
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

    if (activeTab === 'machines') {
      csvContent += 'Machine ID,Owner,Mobile,Owner Type,Machine Name,Type,District,Hourly Rate,Per-Acre Rate,Utilization %,Pricing Index %,RC Verified,Insurance Verified,License Verified,Status\n';
      machines.forEach((m) => {
        csvContent += `"${m.id}","${m.ownerName}","${m.ownerMobile}","${m.ownerType}","${m.name}","${m.type}","${m.district}",${m.hourlyRate},${m.perAcreRate || ''},${m.utilizationPercent},${m.pricingIndexPercent},"${m.rcDocument?.verified ? 'YES' : 'NO'}","${m.insuranceDocument?.verified ? 'YES' : 'NO'}","${m.operatorLicense?.verified ? 'YES' : 'NO'}","${m.status}"\n`;
      });
    } else if (activeTab === 'slots') {
      csvContent += 'Slot ID,Machine,Owner Type,Date,Window,Price (INR),Recommended Task,Booked By,Waitlist Count,Anomaly,Status\n';
      slots.forEach((s) => {
        csvContent += `"${s.id}","${s.equipmentName}","${s.ownerType}","${s.date}","${s.slotName}",${s.priceRupees},"${s.recommendedTask}","${s.bookedByName || ''}",${(s.waitlist || []).length},"${s.anomaly || ''}","${s.anomaly ? 'double_booked' : s.status}"\n`;
      });
    } else {
      csvContent += 'Booking ID,Farmer,Mobile,Machine,Date,Slot,Price (INR),Deposit (INR),Refund (INR),Mode,Damage Report,Status\n';
      bookings.forEach((b) => {
        csvContent += `"${b.id}","${b.farmerName}","${b.farmerMobile}","${b.equipmentName}","${b.date}","${b.slotName}",${b.priceRupees},${b.securityDeposit || 0},${b.refundAmount ?? ''},"${b.ownerType}","${b.damageReport?.reported ? b.damageReport.depositAction : ''}","${b.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrovercity_equipment_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'CSV Export Downloaded',
      message: `Exported equipment ${activeTab} dataset snapshot.`,
      type: 'info'
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport =
      activeTab === 'machines' ? machines :
      activeTab === 'slots' ? slots :
      bookings;

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrovercity_equipment_${activeTab}_${Date.now()}.json`);
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
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Tractor className="w-6 h-6 text-emerald-600" />
              <span>Equipment Rental & Yantra Time-Slots</span>
            </h1>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              SOP-09
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Farm mechanization oversight: machinery paper verification, 4-hour Yantra slot audits, FPO vs private utilization monitoring, double-booking resolution & damage deposit forfeitures.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="text-[11px] font-mono text-slate-600 bg-white border border-emerald-100 px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-slate-800">Yantra Slot Engine Active</span>
        </div>
      </div>

      {/* 2. Top Metric KPI Bar */}
      <EquipmentMetricBar kpis={kpis} loading={loading} />

      {/* 3. Search & Filter Bar */}
      <EquipmentSearchAndFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ownerTypeFilter={ownerTypeFilter}
        setOwnerTypeFilter={setOwnerTypeFilter}
        onRefresh={fetchData}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        loading={loading}
      />

      {/* 4. Active Tab Data Grid */}
      {activeTab === 'machines' && (
        <MachinesTable
          machines={machines}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectMachine={(m) => openDrawer(m, 'machine')}
          onVerifyPapers={(m) => setVerifyMachineTarget(m)}
          onToggleSuspend={(m) => setSuspendMachineTarget(m)}
          loading={loading}
        />
      )}

      {activeTab === 'slots' && (
        <SlotsTable
          slots={slots}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectSlot={(s) => openDrawer(s, 'slot')}
          loading={loading}
        />
      )}

      {activeTab === 'bookings' && (
        <SlotBookingsTable
          bookings={bookings}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onInspectBooking={(b) => openDrawer(b, 'booking')}
          onForceCancel={(b) => setCancelBookingTarget(b)}
          onResolveDamage={(b) => setDamageBookingTarget(b)}
          loading={loading}
        />
      )}

      {/* 5. Detail Slide-Over Drawer */}
      <EquipmentDetailDrawer
        isOpen={Boolean(inspectEntity)}
        onClose={closeDrawer}
        entity={inspectEntity}
        entityType={inspectEntityType}
        onVerifyPapers={(m) => setVerifyMachineTarget(m)}
        onForceCancel={(b) => setCancelBookingTarget(b)}
        onResolveDamage={(b) => setDamageBookingTarget(b)}
      />

      {/* 6. Machinery Papers & Operator License Verification Modal */}
      <VerifyMachineModal
        isOpen={Boolean(verifyMachineTarget)}
        onClose={() => setVerifyMachineTarget(null)}
        machine={verifyMachineTarget}
        onConfirm={handleConfirmVerifyMachine}
        loading={actionLoading}
      />

      {/* 7. Booking Force Cancellation Modal */}
      <ForceCancelBookingModal
        isOpen={Boolean(cancelBookingTarget)}
        onClose={() => setCancelBookingTarget(null)}
        booking={cancelBookingTarget}
        onConfirm={handleConfirmForceCancel}
        loading={actionLoading}
      />

      {/* 8. Damage Report & Deposit Forfeiture Modal */}
      <DepositForfeitureModal
        isOpen={Boolean(damageBookingTarget)}
        onClose={() => setDamageBookingTarget(null)}
        booking={damageBookingTarget}
        onConfirm={handleConfirmDamageResolution}
        loading={actionLoading}
      />

      {/* 9. Machine Suspend / Reinstate Modal */}
      <SuspendMachinePrompt
        isOpen={Boolean(suspendMachineTarget)}
        machine={suspendMachineTarget}
        onClose={() => setSuspendMachineTarget(null)}
        onConfirm={handleConfirmSuspendMachine}
        loading={actionLoading}
      />
    </div>
  );
}

function SuspendMachinePrompt({ isOpen, machine, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen, machine]);

  if (!isOpen || !machine) return null;

  const suspending = machine.status !== 'suspended';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 8) {
      setError('Administrative explanation (minimum 8 characters) is required.');
      return;
    }
    onConfirm({
      equipmentId: machine.id,
      suspended: suspending,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              suspending
                ? 'bg-rose-100 border-rose-200 text-rose-700'
                : 'bg-emerald-100 border-emerald-200 text-emerald-700'
            }`}>
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {suspending ? 'Remove from Booking Pool' : 'Reinstate for Booking'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{machine.name} • {machine.ownerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-emerald-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-600 leading-relaxed">
            {suspending
              ? 'The machine is immediately hidden from the Yantra booking pool. Existing confirmed slots are unaffected, but no new bookings can be placed.'
              : 'The machine is reinstated for public Yantra booking across all 4-hour slot windows.'}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-800 font-semibold">
                Administrative Rationale (Mandatory) *
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Min 8 chars ({reason.length}/8)
              </span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Repeated no-show complaints from farmers during peak sowing week — machine suspended pending owner hearing..."
              className="w-full bg-emerald-50/20 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>Recorded in <code className="text-slate-800 font-mono">audit_logs</code> (SOP-09 Rule 2).</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 8}
              className={`flex items-center gap-1.5 px-5 py-2 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                suspending ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{suspending ? 'Confirm Suspension' : 'Confirm Reinstatement'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
