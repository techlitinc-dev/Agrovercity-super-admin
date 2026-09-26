import React, { useState, useEffect, useCallback } from 'react';
import { TopMetricBar } from './TopMetricBar';
import { SearchAndFilterBar } from './SearchAndFilterBar';
import { UserDataGrid } from './UserDataGrid';
import { ActionDrawer } from './ActionDrawer';
import { ReasonConfirmationModal } from './ReasonConfirmationModal';
import { StatusChangeModal } from './StatusChangeModal';
import { OtpDispatchModal } from './OtpDispatchModal';
import { SessionsTable } from './SessionsTable';
import { DevicesTable } from './DevicesTable';
import { TokenVaultTable } from './TokenVaultTable';
import { AuditLogTable } from './AuditLogTable';
import { adminAuthService } from '../../services/adminAuthService';
import { useAuthAdmin } from '../../context/AuthAdminContext';
import { useNotification } from '../../context/NotificationContext';
import { Users, Globe, Smartphone, Key, History, ShieldAlert } from 'lucide-react';

export function AuthSecurityModule() {
  const { currentAdmin } = useAuthAdmin();
  const { addToast } = useNotification();

  // Data & loading states
  const [users, setUsers] = useState([]);
  const [allUsersForKpis, setAllUsersForKpis] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Active collection tab state: 'users' | 'sessions' | 'devices' | 'tokens' | 'audit'
  const [activeTab, setActiveTab] = useState('users');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [personaFilter, setPersonaFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30d');
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Active drawer & modals state
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // MPIN Reset modal state
  const [userForMpinReset, setUserForMpinReset] = useState(null);
  const [isMpinConfirmOpen, setIsMpinConfirmOpen] = useState(false);
  const [dispatchedOtpData, setDispatchedOtpData] = useState(null); // { user, temporaryOtp }

  // Revoke Sessions modal state
  const [userForRevoke, setUserForRevoke] = useState(null);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);

  // Status Change modal state
  const [userForStatusChange, setUserForStatusChange] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Fetch users from adminAuthService
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch filtered data
      const res = await adminAuthService.listUsers({
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

      // Also get all unfiltered records to compute top-level KPI metrics accurately
      const allRes = await adminAuthService.listUsers({ query: '', status: 'all', persona: 'all', dateRange: 'all', page: 1, limit: 1000 });
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

  // Keep open drawer synced if user updates
  useEffect(() => {
    if (selectedUserForDrawer && users.length > 0) {
      const refreshed = users.find((u) => u.uid === selectedUserForDrawer.uid || u.id === selectedUserForDrawer.id);
      if (refreshed) {
        setSelectedUserForDrawer(refreshed);
      }
    }
  }, [users]);

  // Handler for row select / drawer open
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

  // Metrics for collection tab counters
  const activeSessionsCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => acc + (u.sessions?.filter((s) => s.active)?.length || 0),
    0
  );
  const totalDevicesCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => acc + (u.devices?.length || 0),
    0
  );
  const totalTokensCount = (allUsersForKpis.length > 0 ? allUsersForKpis : users).reduce(
    (acc, u) => acc + (u.authTokens?.length || 0),
    0
  );

  // Handler for updating a single user in local state without full reload
  const handleUserDataUpdated = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));
    setAllUsersForKpis((prev) => prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)));
    setSelectedUserForDrawer(updatedUser);
  };

  // 1. Force MPIN Reset Flow
  const handleInitiateResetMpin = (user) => {
    setUserForMpinReset(user);
    setIsMpinConfirmOpen(true);
  };

  const handleConfirmResetMpin = async (reason) => {
    if (!userForMpinReset) return;
    try {
      const result = await adminAuthService.resetMpin({
        uid: userForMpinReset.uid,
        adminUid: currentAdmin.email,
        reason
      });

      addToast({
        title: 'Emergency MPIN Reset Executed',
        message: result.message,
        type: 'success'
      });

      handleUserDataUpdated(result.user);
      setDispatchedOtpData({
        user: result.user,
        temporaryOtp: result.temporaryOtp
      });
    } catch (err) {
      addToast({
        title: 'MPIN Reset Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // 2. Revoke Sessions Flow
  const handleInitiateRevoke = (user) => {
    setUserForRevoke(user);
    setIsRevokeConfirmOpen(true);
  };

  const handleConfirmRevoke = async (reason) => {
    if (!userForRevoke) return;
    try {
      const result = await adminAuthService.revokeSessions({
        uid: userForRevoke.uid,
        adminUid: currentAdmin.email,
        reason
      });

      addToast({
        title: 'Sessions & JWT Revoked',
        message: result.message,
        type: 'success'
      });

      handleUserDataUpdated(result.user);
    } catch (err) {
      addToast({
        title: 'Revocation Failed',
        message: err.message,
        type: 'error'
      });
    }
  };

  // 3. Status Change Flow
  const handleInitiateStatusChange = (user) => {
    setUserForStatusChange(user);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async ({ uid, status, reason }) => {
    try {
      const result = await adminAuthService.updateStatus({
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

  // Export handlers
  const handleExportCsv = () => {
    try {
      const headers = ['ID', 'Firebase UID', 'Name', 'Mobile', 'Email', 'Persona', 'Status', 'Aadhaar (DPDP)', 'MPIN Set', '2FA Enabled', 'Devices Count', 'Active Sessions', 'Created At'];
      const rows = users.map((u) => [
        u.id,
        u.uid,
        `"${u.name}"`,
        u.mobile,
        u.email,
        u.persona,
        u.status,
        u.aadhaarMasked,
        u.mpinSet ? 'TRUE' : 'FALSE',
        u.twoFactorEnabled ? 'TRUE' : 'FALSE',
        u.devices?.length || 0,
        u.sessions?.filter((s) => s.active).length || 0,
        u.createdAt
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `agrovercity_auth_audit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'CSV Export Generated',
        message: `Exported ${users.length} user records with DPDP masking compliance.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `agrovercity_auth_records_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'JSON Export Complete',
        message: 'Full enveloped user auth schema downloaded.',
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Export Failed', message: e.message, type: 'error' });
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Top Metric Bar */}
      <TopMetricBar users={allUsersForKpis.length > 0 ? allUsersForKpis : users} />

      {/* 2. SOP-01 Core Collections Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl p-1.5 shadow-sm flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Auth Security</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'users' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            users ({allUsersForKpis.length || pagination.total})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Sessions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'sessions' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            sessions ({activeSessionsCount} live)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'devices'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Hardware Devices</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'devices' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            devices ({totalDevicesCount})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>JWT & Token Vault</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'tokens' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            auth_tokens ({totalTokensCount})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Immutable Audit Trail</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'audit' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            audit_logs (§6.2)
          </span>
        </button>
      </div>

      {/* 3. Conditional Collection Table Rendering */}
      {activeTab === 'users' && (
        <>
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

          <UserDataGrid
            users={users}
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onSelectUser={handleOpenDrawer}
            onOpenResetMpin={handleInitiateResetMpin}
            onOpenRevokeSessions={handleInitiateRevoke}
            onOpenStatusChange={handleInitiateStatusChange}
            loading={loading}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
          />
        </>
      )}

      {activeTab === 'sessions' && (
        <SessionsTable onOpenUserDrawer={handleOpenDrawerByUserId} />
      )}

      {activeTab === 'devices' && (
        <DevicesTable onOpenUserDrawer={handleOpenDrawerByUserId} />
      )}

      {activeTab === 'tokens' && (
        <TokenVaultTable onOpenUserDrawer={handleOpenDrawerByUserId} />
      )}

      {activeTab === 'audit' && (
        <AuditLogTable onOpenUserDrawer={handleOpenDrawerByUserId} />
      )}

      {/* 4. Action Drawer / Slide-Over Modal */}
      <ActionDrawer
        user={selectedUserForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenResetMpin={handleInitiateResetMpin}
        onOpenRevokeSessions={handleInitiateRevoke}
        onOpenStatusChange={handleInitiateStatusChange}
        onUserDataUpdated={handleUserDataUpdated}
      />

      {/* 5. Force MPIN Reset Confirmation Modal */}
      <ReasonConfirmationModal
        isOpen={isMpinConfirmOpen}
        onClose={() => setIsMpinConfirmOpen(false)}
        onConfirm={handleConfirmResetMpin}
        title="Admin Force MPIN Reset"
        actionType="warning"
        confirmText="Invalidate MPIN & Dispatch OTP"
        targetUser={userForMpinReset}
        description="This action immediately invalidates the user's existing 4-digit MPIN. A new 6-digit emergency OTP will be generated and dispatched to their registered mobile number. This event is written to the immutable audit log."
        suggestedReasons={[
          'User forgot MPIN / rural support helpline request',
          'SIM-swap anomaly investigation ticket',
          'Periodic biometric & MPIN rotation policy',
          'Device theft reported by user'
        ]}
      />

      {/* 6. Revoke All Sessions Confirmation Modal */}
      <ReasonConfirmationModal
        isOpen={isRevokeConfirmOpen}
        onClose={() => setIsRevokeConfirmOpen(false)}
        onConfirm={handleConfirmRevoke}
        title="Revoke All Sessions & Refresh Tokens"
        actionType="destructive"
        confirmText="Revoke All Tokens Across Devices"
        targetUser={userForRevoke}
        description="All active JWT refresh tokens across all enrolled devices will be revoked immediately. The user will be forcibly logged out of all web and mobile apps. Any pending in-flight requests will return HTTP 401 Unauthorized."
        suggestedReasons={[
          'Suspicious foreign IP login detected (TOR exit node)',
          'Account compromise / credential stuffing alert',
          'Lost smartphone reported by user',
          'Administrative disciplinary lockdown'
        ]}
      />

      {/* 7. Status Change Modal */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        user={userForStatusChange}
        onConfirm={handleConfirmStatusChange}
      />

      {/* 8. Temporary OTP Dispatch Feedback Modal */}
      <OtpDispatchModal
        isOpen={!!dispatchedOtpData}
        onClose={() => setDispatchedOtpData(null)}
        user={dispatchedOtpData?.user}
        temporaryOtp={dispatchedOtpData?.temporaryOtp}
      />
    </div>
  );
}
