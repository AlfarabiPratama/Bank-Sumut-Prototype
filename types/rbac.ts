/**
 * RBAC (Role-Based Access Control) Type Definitions
 * Enhanced RBAC for CRM Bank Sumut with 6 roles and granular permissions
 */

// 6 Roles aligned with Banking organizational structure
export type UserRole = 
  | 'DIRECTOR'      // C-level, full access
  | 'SUPERVISOR'    // Branch manager, monitor teams
  | 'MARKETING'     // Campaign management
  | 'RM'            // Relationship Manager (Sales)
  | 'CS'            // Customer Service Agent
  | 'VIEWER';       // Read-only (Auditor, Compliance)

// Granular Permission Interface
export interface RolePermissions {
  // Dashboard permissions
  canViewDashboard: boolean;
  canExportData: boolean;
  
  // Customer permissions
  canViewAllCustomers: boolean;
  canViewOwnCustomers: boolean; // For RM: only their portfolio
  canEditCustomers: boolean;
  canViewSensitiveData: boolean; // Balance, NIK, etc.
  
  // Campaign permissions
  canViewCampaigns: boolean;
  canCreateCampaigns: boolean;
  canEditCampaigns: boolean;
  canDeleteCampaigns: boolean;
  
  // Settings permissions
  canConfigureRFM: boolean;
  canManageUsers: boolean;
  
  // Audit
  canViewAuditLog: boolean;
}

// Role Metadata for UI
export interface RoleMetadata {
  emoji: string;
  label: string;
  labelId: string; // Indonesian label
  color: string;
  description: string;
  descriptionId: string; // Indonesian description
}

// Role Permission Matrix
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  DIRECTOR: {
    canViewDashboard: true,
    canExportData: true,
    canViewAllCustomers: true,
    canViewOwnCustomers: false,
    canEditCustomers: true,
    canViewSensitiveData: true,
    canViewCampaigns: true,
    canCreateCampaigns: true,
    canEditCampaigns: true,
    canDeleteCampaigns: true,
    canConfigureRFM: true,
    canManageUsers: true,
    canViewAuditLog: true
  },
  
  SUPERVISOR: {
    canViewDashboard: true,
    canExportData: true,
    canViewAllCustomers: true,
    canViewOwnCustomers: false,
    canEditCustomers: true,
    canViewSensitiveData: true,
    canViewCampaigns: true,
    canCreateCampaigns: true,
    canEditCampaigns: true,
    canDeleteCampaigns: false,
    canConfigureRFM: false,
    canManageUsers: false,
    canViewAuditLog: true
  },
  
  MARKETING: {
    canViewDashboard: true,
    canExportData: true,
    canViewAllCustomers: true,
    canViewOwnCustomers: false,
    canEditCustomers: false,
    canViewSensitiveData: false, // No access to balance/NIK
    canViewCampaigns: true,
    canCreateCampaigns: true,
    canEditCampaigns: true,
    canDeleteCampaigns: false,
    canConfigureRFM: false,
    canManageUsers: false,
    canViewAuditLog: false
  },
  
  RM: {
    canViewDashboard: true,
    canExportData: false,
    canViewAllCustomers: false,
    canViewOwnCustomers: true, // Only their portfolio
    canEditCustomers: true,
    canViewSensitiveData: true, // Need full context for sales
    canViewCampaigns: true,
    canCreateCampaigns: false,
    canEditCampaigns: false,
    canDeleteCampaigns: false,
    canConfigureRFM: false,
    canManageUsers: false,
    canViewAuditLog: false
  },
  
  CS: {
    canViewDashboard: false,
    canExportData: false,
    canViewAllCustomers: true,
    canViewOwnCustomers: false,
    canEditCustomers: false,
    canViewSensitiveData: false, // Masked data only
    canViewCampaigns: false,
    canCreateCampaigns: false,
    canEditCampaigns: false,
    canDeleteCampaigns: false,
    canConfigureRFM: false,
    canManageUsers: false,
    canViewAuditLog: false
  },
  
  VIEWER: {
    canViewDashboard: true,
    canExportData: false,
    canViewAllCustomers: true,
    canViewOwnCustomers: false,
    canEditCustomers: false,
    canViewSensitiveData: false,
    canViewCampaigns: true,
    canCreateCampaigns: false,
    canEditCampaigns: false,
    canDeleteCampaigns: false,
    canConfigureRFM: false,
    canManageUsers: false,
    canViewAuditLog: false
  }
};

// Role Metadata for UI display
export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  DIRECTOR: { 
    emoji: '👑', 
    label: 'Director', 
    labelId: 'Direktur',
    color: 'from-amber-500 to-yellow-500',
    description: 'Full access across organization',
    descriptionId: 'Akses penuh seluruh organisasi'
  },
  SUPERVISOR: { 
    emoji: '📊', 
    label: 'Supervisor', 
    labelId: 'Supervisor',
    color: 'from-blue-500 to-indigo-500',
    description: 'Team monitoring & performance',
    descriptionId: 'Monitor kinerja tim'
  },
  MARKETING: { 
    emoji: '📢', 
    label: 'Marketing', 
    labelId: 'Marketing',
    color: 'from-purple-500 to-pink-500',
    description: 'Campaign & segment management',
    descriptionId: 'Kelola campaign & segmen'
  },
  RM: { 
    emoji: '👔', 
    label: 'Relationship Manager', 
    labelId: 'RM',
    color: 'from-green-500 to-emerald-500',
    description: 'Customer portfolio management',
    descriptionId: 'Kelola portfolio nasabah'
  },
  CS: { 
    emoji: '🎧', 
    label: 'Customer Service', 
    labelId: 'CS',
    color: 'from-orange-500 to-red-500',
    description: 'Customer support handling',
    descriptionId: 'Layani nasabah'
  },
  VIEWER: { 
    emoji: '👁️', 
    label: 'Viewer', 
    labelId: 'Viewer',
    color: 'from-gray-500 to-slate-500',
    description: 'Read-only access',
    descriptionId: 'Lihat saja (read-only)'
  }
};

// Helper functions
export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}

export function getRoleMetadata(role: UserRole): RoleMetadata {
  return ROLE_METADATA[role];
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

// Get available tabs for a role
export function getAvailableTabsForRole(role: UserRole): string[] {
  const permissions = ROLE_PERMISSIONS[role];
  const tabs: string[] = [];
  
  if (permissions.canViewDashboard) tabs.push('dashboard');
  if (permissions.canViewAllCustomers || permissions.canViewOwnCustomers) tabs.push('customers');
  if (permissions.canViewCampaigns) tabs.push('campaigns');
  if (permissions.canConfigureRFM) tabs.push('settings');
  
  return tabs;
}
