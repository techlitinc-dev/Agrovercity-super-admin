import React, { createContext, useContext, useState } from 'react';

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
      canUpdateStatus: false, // Cannot suspend/lock
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
  const currentAdmin = ADMIN_ROLES[currentRoleKey];

  const switchRole = (roleKey) => {
    if (ADMIN_ROLES[roleKey]) {
      setCurrentRoleKey(roleKey);
    }
  };

  const hasPermission = (permKey) => {
    return !!currentAdmin.permissions[permKey];
  };

  return (
    <AuthAdminContext.Provider
      value={{
        currentAdmin,
        currentRoleKey,
        switchRole,
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
