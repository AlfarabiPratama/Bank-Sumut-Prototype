// Audit Trail Service
// Provides centralized logging for compliance and tracking

export type AuditAction = 
  | 'VIEW' 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'EXPORT' 
  | 'SEARCH'
  | 'ROLE_CHANGE'
  | 'MFA_VERIFY'
  | 'CONSENT_CHANGE'
  | 'CAMPAIGN_EXECUTE';

export type AuditResource = 
  | 'Customer' 
  | 'Campaign' 
  | 'Case' 
  | 'Lead' 
  | 'Consent' 
  | 'System' 
  | 'User'
  | 'Report'
  | 'SensitiveData';

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilters {
  userId?: string;
  action?: AuditAction;
  resource?: AuditResource;
  dateFrom?: Date;
  dateTo?: Date;
}

const STORAGE_KEY = 'sultan-crm-audit-log';
const MAX_LOGS = 1000; // Keep last 1000 logs

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditEvent[] = [];
  private currentUser: { id: string; name: string; role: string } = {
    id: 'system',
    name: 'System',
    role: 'System'
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  // Set current user context (should be called on login/role change)
  setCurrentUser(user: { id: string; name: string; role: string }) {
    this.currentUser = user;
  }

  // Main logging method
  log(
    action: AuditAction,
    resource: AuditResource,
    details: Record<string, unknown>,
    resourceId?: string
  ): AuditEvent {
    const event: AuditEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userRole: this.currentUser.role,
      action,
      resource,
      resourceId,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.logs.unshift(event); // Add to beginning (latest first)

    // Trim logs if exceeding max
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    this.saveToStorage();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${action} ${resource}`, details);
    }

    return event;
  }

  // Convenience methods for common actions
  logView(resource: AuditResource, resourceId: string, details: Record<string, unknown> = {}) {
    return this.log('VIEW', resource, details, resourceId);
  }

  logCreate(resource: AuditResource, resourceId: string, details: Record<string, unknown>) {
    return this.log('CREATE', resource, details, resourceId);
  }

  logUpdate(resource: AuditResource, resourceId: string, changes: Record<string, unknown>) {
    return this.log('UPDATE', resource, { changes }, resourceId);
  }

  logDelete(resource: AuditResource, resourceId: string, details: Record<string, unknown> = {}) {
    return this.log('DELETE', resource, details, resourceId);
  }

  logSearch(resource: AuditResource, query: string, resultsCount: number) {
    return this.log('SEARCH', resource, { query, resultsCount });
  }

  logExport(resource: AuditResource, format: string, rowCount: number) {
    return this.log('EXPORT', resource, { format, rowCount });
  }

  logRoleChange(fromRole: string, toRole: string) {
    return this.log('ROLE_CHANGE', 'User', { fromRole, toRole });
  }

  logConsentChange(customerId: string, field: string, oldValue: boolean, newValue: boolean) {
    return this.log('CONSENT_CHANGE', 'Consent', { field, oldValue, newValue }, customerId);
  }

  // Get logs with optional filtering
  getLogs(filters?: AuditFilters): AuditEvent[] {
    let filtered = [...this.logs];

    if (filters?.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters?.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }

    if (filters?.dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= filters.dateTo!);
    }

    return filtered;
  }

  // Get log counts by action type (for dashboard)
  getActionCounts(): Record<AuditAction, number> {
    const counts: Record<string, number> = {};
    
    for (const log of this.logs) {
      counts[log.action] = (counts[log.action] || 0) + 1;
    }

    return counts as Record<AuditAction, number>;
  }

  // Get recent logs (last N)
  getRecentLogs(count: number = 10): AuditEvent[] {
    return this.logs.slice(0, count);
  }

  // Export logs as JSON
  exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Export logs as CSV
  exportAsCSV(): string {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Resource', 'ResourceID', 'Details'];
    const rows = this.logs.map(log => [
      log.timestamp,
      log.userName,
      log.userRole,
      log.action,
      log.resource,
      log.resourceId || '',
      JSON.stringify(log.details)
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  // Clear all logs (admin only)
  clearLogs() {
    this.log('DELETE', 'System', { action: 'clear_audit_logs', clearedCount: this.logs.length });
    this.logs = this.logs.slice(0, 1); // Keep only the clear action log
    this.saveToStorage();
  }

  // Get total count
  getCount(): number {
    return this.logs.length;
  }

  // Private helpers
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[AuditLogger] Failed to load from storage:', error);
      this.logs = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.warn('[AuditLogger] Failed to save to storage:', error);
    }
  }
}

// Export singleton instance
export const auditLogger = AuditLogger.getInstance();

// Helper to get formatted action badge color
export const getActionColor = (action: AuditAction): string => {
  switch (action) {
    case 'VIEW':
      return 'bg-blue-100 text-blue-700';
    case 'CREATE':
      return 'bg-green-100 text-green-700';
    case 'UPDATE':
      return 'bg-yellow-100 text-yellow-700';
    case 'DELETE':
      return 'bg-red-100 text-red-700';
    case 'LOGIN':
    case 'LOGOUT':
      return 'bg-purple-100 text-purple-700';
    case 'EXPORT':
      return 'bg-indigo-100 text-indigo-700';
    case 'SEARCH':
      return 'bg-gray-100 text-gray-700';
    case 'ROLE_CHANGE':
    case 'MFA_VERIFY':
      return 'bg-orange-100 text-orange-700';
    case 'CONSENT_CHANGE':
      return 'bg-pink-100 text-pink-700';
    case 'CAMPAIGN_EXECUTE':
      return 'bg-teal-100 text-teal-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default auditLogger;
