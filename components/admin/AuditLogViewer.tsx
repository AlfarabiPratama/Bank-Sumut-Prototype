import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { auditLogger, AuditEvent, AuditAction, AuditResource, getActionColor } from '../../services/auditLogger';
import { ProtectedSection } from '../ui/ProtectedAction';

interface AuditLogViewerProps {
  className?: string;
}

const ITEMS_PER_PAGE = 15;

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ className = '' }) => {
  const [logs, setLogs] = useState<AuditEvent[]>(auditLogger.getLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<AuditAction | ''>('');
  const [selectedResource, setSelectedResource] = useState<AuditResource | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditEvent | null>(null);

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(query) ||
        log.resourceId?.toLowerCase().includes(query) ||
        JSON.stringify(log.details).toLowerCase().includes(query)
      );
    }

    if (selectedAction) {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    if (selectedResource) {
      filtered = filtered.filter(log => log.resource === selectedResource);
    }

    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59'));
    }

    return filtered;
  }, [logs, searchQuery, selectedAction, selectedResource, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Refresh logs
  const handleRefresh = () => {
    setLogs(auditLogger.getLogs());
  };

  // Export handlers
  const handleExportJSON = () => {
    const json = auditLogger.exportAsJSON();
    downloadFile(json, 'audit-log.json', 'application/json');
  };

  const handleExportCSV = () => {
    const csv = auditLogger.exportAsCSV();
    downloadFile(csv, 'audit-log.csv', 'text/csv');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAction('');
    setSelectedResource('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const actions: AuditAction[] = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'SEARCH', 'ROLE_CHANGE', 'CONSENT_CHANGE'];
  const resources: AuditResource[] = ['Customer', 'Campaign', 'Case', 'Lead', 'Consent', 'System', 'User', 'Report', 'SensitiveData'];

  return (
    <ProtectedSection permission="canViewAuditLog" title="Audit Log Viewer">
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Audit Trail</h2>
                <p className="text-sm text-gray-500">
                  {filteredLogs.length} events logged • Compliance tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={handleExportJSON}
                className="px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
              >
                <Download size={16} />
                JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
              >
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search logs..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Action Filter */}
            <select
              value={selectedAction}
              onChange={(e) => { setSelectedAction(e.target.value as AuditAction | ''); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Actions</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>

            {/* Resource Filter */}
            <select
              value={selectedResource}
              onChange={(e) => { setSelectedResource(e.target.value as AuditResource | ''); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Resources</option>
              {resources.map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>

            {/* Date From */}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

            {/* Date To */}
            <div className="flex gap-2">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                title="Clear Filters"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Resource ID
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No audit logs found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or perform some actions</p>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const { date, time } = formatTimestamp(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{date}</p>
                            <p className="text-xs text-gray-500">{time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Shield size={12} className="text-gray-400" />
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {log.userRole}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{log.resource}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-gray-500">
                          {log.resourceId || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} events
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Audit Event Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Event ID</label>
                    <p className="text-sm font-mono text-gray-700">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Timestamp</label>
                    <p className="text-sm text-gray-700">{new Date(selectedLog.timestamp).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">User</label>
                    <p className="text-sm text-gray-700">{selectedLog.userName} ({selectedLog.userId})</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Role</label>
                    <p className="text-sm text-gray-700">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Action</label>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Resource</label>
                    <p className="text-sm text-gray-700">{selectedLog.resource} {selectedLog.resourceId ? `(${selectedLog.resourceId})` : ''}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Details</label>
                  <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
                {selectedLog.userAgent && (
                  <div className="mt-4">
                    <label className="text-xs text-gray-500 uppercase">User Agent</label>
                    <p className="text-xs text-gray-500 mt-1 break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedSection>
  );
};

export default AuditLogViewer;
