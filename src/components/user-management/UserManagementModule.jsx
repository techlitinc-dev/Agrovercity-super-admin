import React, { useState, useEffect, useCallback } from 'react';
import { TopMetricBar } from './TopMetricBar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { UserTable } from './UserTable';
import { UserDetailDrawer } from './UserDetailDrawer';
import { ManagePersonasModal } from './ManagePersonasModal';
import { FarmSatelliteMapModal } from './FarmSatelliteMapModal';
import { StatusChangeModal } from './StatusChangeModal';
import { StaffDelegationView } from './StaffDelegationView';
import { RoleProfilesTable } from './RoleProfilesTable';
import { UserBookingsTable } from './UserBookingsTable';
import { FarmPolygonsTable } from './FarmPolygonsTable';
import { adminUserService } from '../../services/adminUserService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, Users, Layers, Calendar, Compass } from 'lucide-react';

export function UserManagementModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Active top tab: 'delegation' | 'users'
  const [activeMainTab, setActiveMainTab] = useState('delegation');

  // Data & loading states
  const [users, setUsers] = useState([]);
  const [allUsersForKpis, setAllUsersForKpis] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Active drawer & modals state
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persona management modal state
  const [userForPersonas, setUserForPersonas] = useState(null);
  const [isManagePersonasOpen, setIsManagePersonasOpen] = useState(false);

  // Farm Satellite Map modal state
  const [userForFarmMap, setUserForFarmMap] = useState(null);
  const [isFarmMapOpen, setIsFarmMapOpen] = useState(false);

  // Status Change modal state
  const [userForStatus, setUserForStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Fetch users from adminUserService
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserService.listUsers({
        query: searchQuery,
        status: statusFilter,
        persona: personaFilter,
        dateRange: dateFilter,
        page,
        limit: 10
      });

      if (res.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }

      // Fetch all unfiltered records to compute accurate top metric KPI counts
      const allRes = await adminUserService.listUsers({
        query: '',
        status: 'all',
        persona: 'all',
        dateRange: 'all',
        page: 1,
        limit: 1000
      });
      if (allRes.success) {
        setAllUsersForKpis(allRes.data.users);
      }
    } catch (err) {
      addToast({
        title: 'Query Error',
        message: err.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, personaFilter, dateFilter, page, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Keep open drawer synced if user data updates
  useEffect(() => {
    if (selectedUserForDrawer && users.length > 0) {
      const refreshed = users.find(
        (u) => u.uid === selectedUserForDrawer.uid || u.id === selectedUserForDrawer.id
      );
      if (refreshed) {
        setSelectedUserForDrawer(refreshed);
      }
    }
  }, [users]);

  // Handle single user local state update
  const handleUserDataUpdated = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));
    setAllUsersForKpis((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));
    setSelectedUserForDrawer(updatedUser);
  };

  // Drawer handlers
  const handleOpenDrawer = (user) => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
  };

  const handleOpenDrawerByUserId = (uidOrId) => {
    const pool = allUsersForKpis.length > 0 ? allUsersForKpis : users;
    const found = pool.find((u) => u.uid === uidOrId || u.id === uidOrId);
    if (found) {
      handleOpenDrawer(found);
    }
  };

  const handleOpenFarmMapByUserId = (userObj) => {
    if (userObj.farmPolygon) {
      setUserForFarmMap(userObj);
      setIsFarmMapOpen(true);
    } else {
      const pool = allUsersForKpis.length > 0 ? allUsersForKpis : users;
      const found = pool.find((u) => u.uid === userObj.uid || u.id === userObj.id);
      if (found) {
        setUserForFarmMap(found);
        setIsFarmMapOpen(true);
      }
    }
  };

  const handleOpenManagePersonasByUserId = (userObj) => {
    const pool = allUsersForKpis.length > 0 ? allUsersForKpis : users;
    const found = pool.find((u) => u.uid === userObj.uid || u.id === userObj.id);
    if (found) {
      setUserForPersonas(found);
      setIsManagePersonasOpen(true);
    }
  };

  // Metrics for collection tab counters
  const totalLinkedProfilesCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => {
      if (!u.roleProfiles) return acc;
      return acc + Object.values(u.roleProfiles).filter((p) => p.linked).length;
    },
    0
  );

  const totalBookingsCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => acc + (u.bookings?.length || 0),
    0
  );

  const totalPolygonsCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => acc + (u.farmPolygon ? 1 : 0),
    0
  );

  // Manage Personas Modal
  const handleOpenManagePersonas = (user) => {
    setUserForPersonas(user);
    setIsManagePersonasOpen(true);
  };

  // Farm Satellite Map Modal
  const handleOpenFarmMap = (user) => {
    setUserForFarmMap(user);
    setIsFarmMapOpen(true);
  };

  // Status Change Modal
  const handleOpenStatusChange = (user) => {
    setUserForStatus(user);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async ({ uid, status, reason }) => {
    try {
      const result = await adminUserService.updateStatus({
        uid,
        status,
        adminUid: currentAdmin.email,
        reason
      });

      addToast({
        title: 'Status Updated',
        message: result.message,
        type: 'success'
      });

      handleUserDataUpdated(result.user);
    } catch (err) {
      addToast({
        title: 'Status Update Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // CSV Export with DPDP Masked Aadhaar & multi-persona breakdown
  const handleExportCsv = () => {
    try {
      const headers = [
        'User ID',
        'Firebase UID',
        'Name',
        'Mobile',
        'Email',
        'Status',
        'Primary Persona (⭐)',
        'Active Persona',
        'All Linked Personas',
        'Aadhaar Masked (DPDP)',
        'Farm Geofence Acreage',
        '7/12 Survey No',
        'Language',
        'Women SHG Mode',
        'Created At'
      ];

      const rows = users.map((u) => {
        const linkedList = u.roleProfiles
          ? Object.keys(u.roleProfiles).filter((p) => u.roleProfiles[p]?.linked).join('; ')
          : u.persona || 'Farmer';

        return [
          u.id,
          u.uid,
          `"${u.name}"`,
          u.mobile,
          u.email,
          u.status,
          u.primaryPersona || 'Farmer',
          u.activePersona || 'Farmer',
          `"${linkedList}"`,
          u.aadhaarMasked,
          u.farmPolygon?.acreage || 0,
          `"${u.farmPolygon?.surveyNumber || 'Not Mapped'}"`,
          u.language || 'en',
          u.womenMode ? 'TRUE' : 'FALSE',
          u.createdAt
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `agrovercity_user_roster_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'CSV Roster Exported',
        message: `Exported ${users.length} records with DPDP masking compliance.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  // JSON Export
  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `agrovercity_users_personas_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'JSON Document Exported',
        message: 'Full enveloped user and multi-persona document schema exported.',
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/90 border border-emerald-200/90 rounded-2xl shadow-xs">
          {/* Tab 1: Staff & Module Delegation (Superadmin ➔ Admins ➔ DEOs) */}
          <button
            onClick={() => setActiveMainTab('delegation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'delegation'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Staff Delegation</span>
          </button>

          {/* Tab 2: Platform Users Directory (Collection: users) */}
          <button
            onClick={() => setActiveMainTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'users'
                ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users Directory</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeMainTab === 'users' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {allUsersForKpis.length || pagination.total}
            </span>
          </button>

          {/* Tab 3: Multi-Persona Profiles (Collection: users/{uid}/role_profiles) */}
          <button
            onClick={() => setActiveMainTab('personas')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'personas'
                ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Role Profiles</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeMainTab === 'personas' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              role_profiles ({totalLinkedProfilesCount})
            </span>
          </button>

          {/* Tab 4: Cross-Persona Bookings (Collection: users/{uid}/bookings) */}
          <button
            onClick={() => setActiveMainTab('bookings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'bookings'
                ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Escrow</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeMainTab === 'bookings' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              bookings ({totalBookingsCount})
            </span>
          </button>

          {/* Tab 5: Farm Geofence Polygons */}
          <button
            onClick={() => setActiveMainTab('polygons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMainTab === 'polygons'
                ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Farm Polygons</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeMainTab === 'polygons' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}
            >
              farmPolygon ({totalPolygonsCount})
            </span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SOP-02 Multi-Persona Engine</span>
        </div>
      </div>

      {/* View 1: Staff & Module Delegation Hierarchy */}
      {activeMainTab === 'delegation' && <StaffDelegationView />}

      {/* View 2: Platform Users & Multi-Persona Grid */}
      {activeMainTab === 'users' && (
        <>
          {/* 1. Top Metric Bar */}
          <TopMetricBar users={allUsersForKpis.length > 0 ? allUsersForKpis : users} />

          {/* 2. Search & Filter Controls */}
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            statusFilter={statusFilter}
            setStatusFilter={(s) => {
              setStatusFilter(s);
              setPage(1);
            }}
            personaFilter={personaFilter}
            setPersonaFilter={(p) => {
              setPersonaFilter(p);
              setPage(1);
            }}
            dateFilter={dateFilter}
            setDateFilter={(d) => {
              setDateFilter(d);
              setPage(1);
            }}
            onRefresh={fetchUsers}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            loading={loading}
          />

          {/* 3. Primary Data Grid */}
          <UserTable
            users={users}
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onSelectUser={handleOpenDrawer}
            onOpenManagePersonas={handleOpenManagePersonas}
            onOpenFarmMap={handleOpenFarmMap}
            onOpenStatusChange={handleOpenStatusChange}
            loading={loading}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
          />
        </>
      )}

      {/* View 3: Multi-Persona Role Profiles Grid */}
      {activeMainTab === 'personas' && (
        <RoleProfilesTable
          onOpenUserDrawer={handleOpenDrawerByUserId}
          onOpenManagePersonas={handleOpenManagePersonasByUserId}
        />
      )}

      {/* View 4: Cross-Persona Bookings & Escrow Grid */}
      {activeMainTab === 'bookings' && (
        <UserBookingsTable onOpenUserDrawer={handleOpenDrawerByUserId} />
      )}

      {/* View 5: Farm Geofence Polygons Grid */}
      {activeMainTab === 'polygons' && (
        <FarmPolygonsTable
          onOpenUserDrawer={handleOpenDrawerByUserId}
          onOpenFarmMap={handleOpenFarmMapByUserId}
        />
      )}

      {/* 4. Action Drawer / Slide-Over Modal */}
      <UserDetailDrawer
        user={selectedUserForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenManagePersonas={handleOpenManagePersonas}
        onOpenFarmMap={handleOpenFarmMap}
        onOpenStatusChange={handleOpenStatusChange}
        onUserDataUpdated={handleUserDataUpdated}
      />

      {/* 5. Manage Personas Modal */}
      <ManagePersonasModal
        isOpen={isManagePersonasOpen}
        onClose={() => setIsManagePersonasOpen(false)}
        user={userForPersonas}
        onUserDataUpdated={handleUserDataUpdated}
      />

      {/* 6. Farm Satellite Map Modal */}
      <FarmSatelliteMapModal
        isOpen={isFarmMapOpen}
        onClose={() => setIsFarmMapOpen(false)}
        user={userForFarmMap}
        onPolygonUpdated={handleUserDataUpdated}
      />

      {/* 7. Status Change Modal */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        user={userForStatus}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}
