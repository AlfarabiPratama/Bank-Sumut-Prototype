import React from 'react';
import { usePermissions, RolePermissions } from '../../contexts/RoleContext';
import { Lock, ShieldOff } from 'lucide-react';

interface ProtectedActionProps {
  permission: keyof RolePermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showMessage?: boolean;
  messageStyle?: 'inline' | 'block' | 'tooltip';
}

/**
 * ProtectedAction Component
 * 
 * Wraps children and only renders them if user has the required permission.
 * Shows a permission denied message or custom fallback otherwise.
 * 
 * Usage:
 * <ProtectedAction permission="canManageCampaigns">
 *   <button onClick={createCampaign}>Create Campaign</button>
 * </ProtectedAction>
 */
export const ProtectedAction: React.FC<ProtectedActionProps> = ({
  permission,
  children,
  fallback,
  showMessage = true,
  messageStyle = 'inline'
}) => {
  const { hasPermission, role } = usePermissions();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If no message should be shown, return null
  if (!showMessage) {
    return null;
  }

  // Default permission denied messages
  const permissionLabels: Record<keyof RolePermissions, string> = {
    canViewAllCustomers: 'view all customers',
    canEditCustomers: 'edit customer data',
    canManageCampaigns: 'manage campaigns',
    canViewSensitiveData: 'view sensitive data',
    canManageUsers: 'manage users',
    canViewAuditLog: 'view audit logs',
    canExportData: 'export data',
    canChangeConsent: 'change consent settings',
    canManageRoles: 'manage roles',
    requiresMFA: 'access MFA-protected features',
  };

  const actionLabel = permissionLabels[permission] || permission;

  if (messageStyle === 'block') {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <ShieldOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-600">Access Restricted</p>
        <p className="text-xs text-gray-400 mt-1">
          Your role ({role}) doesn't have permission to {actionLabel}.
        </p>
      </div>
    );
  }

  if (messageStyle === 'tooltip') {
    return (
      <div className="relative group inline-block">
        <div className="opacity-50 cursor-not-allowed">
          {children}
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          <Lock size={10} className="inline mr-1" />
          No permission to {actionLabel}
        </div>
      </div>
    );
  }

  // Default: inline message
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
      <Lock size={12} />
      <span>Requires: {actionLabel}</span>
    </span>
  );
};

/**
 * ProtectedSection Component
 * 
 * Wraps an entire section and shows a larger placeholder if user lacks permission.
 */
export const ProtectedSection: React.FC<{
  permission: keyof RolePermissions;
  children: React.ReactNode;
  title?: string;
}> = ({ permission, children, title }) => {
  const { hasPermission, role } = usePermissions();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return (
    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShieldOff className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600">
        {title || 'Access Restricted'}
      </h3>
      <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
        Your current role ({role}) doesn't have access to this section.
        Contact an administrator if you need access.
      </p>
    </div>
  );
};

/**
 * useProtectedAction Hook
 * 
 * For programmatic permission checking in handlers
 * 
 * Usage:
 * const { canExecute, showPermissionError } = useProtectedAction('canManageCampaigns');
 * 
 * const handleClick = () => {
 *   if (!canExecute) {
 *     showPermissionError();
 *     return;
 *   }
 *   // ... do action
 * };
 */
export const useProtectedAction = (permission: keyof RolePermissions) => {
  const { hasPermission, role } = usePermissions();
  
  const canExecute = hasPermission(permission);

  const showPermissionError = () => {
    // In production, you'd show a toast or modal
    console.warn(`[RBAC] Role "${role}" attempted action requiring "${permission}" permission`);
    alert(`You don't have permission to perform this action. Required: ${permission}`);
  };

  return { canExecute, showPermissionError, role };
};

export default ProtectedAction;
