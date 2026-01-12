import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// User Role Types for RBAC
export type UserRole = 'Admin' | 'RM' | 'CS' | 'Marketing' | 'Viewer';

// Permission Types
export interface RolePermissions {
  canViewAllCustomers: boolean;
  canEditCustomers: boolean;
  canManageCampaigns: boolean;
  canViewSensitiveData: boolean;
  canManageUsers: boolean;
  canViewAuditLog: boolean;
  canExportData: boolean;
  canChangeConsent: boolean;
  canManageRoles: boolean;
  requiresMFA: boolean;
}

// Role permissions definition aligned with documentation
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: { 
    canViewAllCustomers: true, 
    canEditCustomers: true, 
    canManageCampaigns: true, 
    canViewSensitiveData: true, 
    canManageUsers: true, 
    canViewAuditLog: true, 
    canExportData: true,
    canChangeConsent: true,
    canManageRoles: true,
    requiresMFA: true 
  },
  RM: { 
    canViewAllCustomers: false, // Only their portfolio
    canEditCustomers: true,     // Only their portfolio
    canManageCampaigns: false, 
    canViewSensitiveData: true, 
    canManageUsers: false, 
    canViewAuditLog: false, 
    canExportData: false,
    canChangeConsent: false,
    canManageRoles: false,
    requiresMFA: false 
  },
  CS: { 
    canViewAllCustomers: true,  // Can search all for support
    canEditCustomers: false,    // Can only create cases
    canManageCampaigns: false, 
    canViewSensitiveData: true, // Masked version
    canManageUsers: false, 
    canViewAuditLog: false, 
    canExportData: false,
    canChangeConsent: true,     // Can process customer consent requests
    canManageRoles: false,
    requiresMFA: false 
  },
  Marketing: { 
    canViewAllCustomers: true,  // Aggregated view only
    canEditCustomers: false, 
    canManageCampaigns: true, 
    canViewSensitiveData: false, // No PII access
    canManageUsers: false, 
    canViewAuditLog: false, 
    canExportData: true,        // Non-PII exports only
    canChangeConsent: false,    // CONFLICT OF INTEREST - Cannot change consent
    canManageRoles: false,
    requiresMFA: false 
  },
  Viewer: { 
    canViewAllCustomers: false, 
    canEditCustomers: false, 
    canManageCampaigns: false, 
    canViewSensitiveData: false, 
    canManageUsers: false, 
    canViewAuditLog: false, 
    canExportData: false,
    canChangeConsent: false,
    canManageRoles: false,
    requiresMFA: false 
  },
};

// Context Type
interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  mfaVerified: boolean;
  setMfaVerified: (verified: boolean) => void;
}

// Create Context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider Component
export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Admin');
  const [mfaVerified, setMfaVerified] = useState(false);

  const permissions = ROLE_PERMISSIONS[currentRole];

  const setCurrentRole = useCallback((role: UserRole) => {
    setCurrentRoleState(role);
    // Reset MFA when switching away from Admin
    if (!ROLE_PERMISSIONS[role].requiresMFA) {
      setMfaVerified(false);
    }
  }, []);

  const hasPermission = useCallback((permission: keyof RolePermissions): boolean => {
    return permissions[permission] === true;
  }, [permissions]);

  return (
    <RoleContext.Provider value={{
      currentRole,
      setCurrentRole,
      permissions,
      hasPermission,
      mfaVerified,
      setMfaVerified,
    }}>
      {children}
    </RoleContext.Provider>
  );
};

// Hook
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Convenience hook for just permissions
export const usePermissions = (): RolePermissions & { role: UserRole; hasPermission: (p: keyof RolePermissions) => boolean } => {
  const { permissions, currentRole, hasPermission } = useRole();
  return { ...permissions, role: currentRole, hasPermission };
};

export default RoleContext;
