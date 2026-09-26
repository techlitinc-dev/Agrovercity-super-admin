import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminStaffService } from '../services/adminStaffService';

export const ADMIN_ROLES = {
  SUPER_ADMIN: {
    id: 'SUPER_ADMIN',
    name: 'Super Admin',
    email: 'root@agrovercity.in',
    badge: 'Super Admin',
    customClaims: { admin: true, superadmin: true, support: true, auditor: true },
    description: 'Unrestricted access to all auth interventions, session revocations, MPIN resets, and status overrides.',
    permissions: {
      canView: true,
      canResetMpin: true,
      canRevokeSessions: true,
      canUpdateStatus: true,
      canToggleFlags: true,
      canExport: true,
      canViewAudit: true,
      canDelete: true,
    }
  },
  SUPPORT_OPERATOR: {
    id: 'SUPPORT_OPERATOR',
    name: 'Support Operator',
    email: 'support.tier2@agrovercity.in',
    badge: 'Support Operator',
    customClaims: { admin: false, support: true },
    description: 'Read access and basic triage. Can trigger MPIN temporary OTP reset for farmers, but cannot ban accounts or revoke all global tokens.',
    permissions: {
      canView: true,
      canResetMpin: true,
      canRevokeSessions: false,
      canUpdateStatus: false,
      canToggleFlags: false,
      canExport: true,
      canViewAudit: true,
      canDelete: false,
    }
  },
  FINANCIAL_AUDITOR: {
    id: 'FINANCIAL_AUDITOR',
    name: 'Financial Auditor',
    email: 'auditor.compliance@agrovercity.in',
    badge: 'Financial Auditor',
    customClaims: { admin: false, auditor: true },
    description: 'Strictly Read-Only access to audit trails, session IP records, and authentication logs for statutory compliance.',
    permissions: {
      canView: true,
      canResetMpin: false,
      canRevokeSessions: false,
      canUpdateStatus: false,
      canToggleFlags: false,
      canExport: true,
      canViewAudit: true,
      canDelete: false,
    }
  }
};

const AuthAdminContext = createContext(null);

export function AuthAdminProvider({ children }) {
  const [currentRoleKey, setCurrentRoleKey] = useState('SUPER_ADMIN');
  const [actingStaff, setActingStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);

  // Load staff list for RBAC selector
  const refreshStaffList = useCallback(async () => {
    try {
      const res = await adminStaffService.listStaff();
      if (res.success) {
        setStaffList(res.data.staff);
      }
    } catch (e) {
      console.error('Error loading staff in AuthAdminProvider', e);
    }
  }, []);

  useEffect(() => {
    refreshStaffList();
  }, [refreshStaffList]);

  // Act As a specific staff member
  const actAsStaff = useCallback((staffMemberOrId) => {
    let staff = staffMemberOrId;
    if (typeof staffMemberOrId === 'string') {
      staff = staffList.find((s) => s.id === staffMemberOrId);
    }
    if (!staff) return;

    setActingStaff(staff);
    setCurrentRoleKey(`STAFF_${staff.id}`);
  }, [staffList]);

  // Exit Act As mode
  const exitActAs = useCallback(() => {
    setActingStaff(null);
    setCurrentRoleKey('SUPER_ADMIN');
  }, []);

  // Standard role switch
  const switchRole = useCallback((roleKey) => {
    if (roleKey.startsWith('STAFF_')) {
      const staffId = roleKey.replace('STAFF_', '');
      const staff = staffList.find((s) => s.id === staffId);
      if (staff) {
        actAsStaff(staff);
        return;
      }
    }

    if (ADMIN_ROLES[roleKey]) {
      setActingStaff(null);
      setCurrentRoleKey(roleKey);
    }
  }, [staffList, actAsStaff]);

  // Compute current admin details
  const currentAdmin = actingStaff
    ? {
        id: actingStaff.id,
        name: actingStaff.name,
        email: actingStaff.email,
        badge: actingStaff.role,
        role: actingStaff.role,
        department: actingStaff.department,
        zone: actingStaff.zone,
        delegatedModules: actingStaff.delegatedModules || [],
        customClaims: {
          admin: actingStaff.role === 'Superadmin',
          staff: true,
          role: actingStaff.role
        },
        permissions: actingStaff.permissions || {
          canView: true,
          canExport: true,
          canEdit: true
        }
      }
    : ADMIN_ROLES[currentRoleKey] || ADMIN_ROLES.SUPER_ADMIN;

  // Module permission guard
  const isModuleAllowed = useCallback((moduleId) => {
    if (!actingStaff) return true;
    if (actingStaff.role === 'Superadmin') return true;
    // Always allow User Management so admins can manage their desk & DEOs
    if (moduleId === '02') return true;
    if (moduleId === 'overview') return false; // Overview is superadmin-only
    return actingStaff.delegatedModules?.includes(moduleId) || false;
  }, [actingStaff]);

  const allowedModules = actingStaff
    ? actingStaff.role === 'Superadmin'
      ? null
      : actingStaff.delegatedModules
    : null;

  const hasPermission = (permKey) => {
    return !!currentAdmin.permissions?.[permKey];
  };

  return (
    <AuthAdminContext.Provider
      value={{
        currentAdmin,
        currentRoleKey,
        actingStaff,
        staffList,
        refreshStaffList,
        switchRole,
        actAsStaff,
        exitActAs,
        isModuleAllowed,
        allowedModules,
        hasPermission,
        rolesList: Object.values(ADMIN_ROLES)
      }}
    >
      {children}
    </AuthAdminContext.Provider>
  );
}

export function useAuthAdmin() {
  const context = useContext(AuthAdminContext);
  if (!context) {
    throw new Error('useAuthAdmin must be used within an AuthAdminProvider');
  }
  return context;
}
