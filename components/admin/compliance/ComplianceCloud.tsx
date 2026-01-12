import React from 'react';
import { Shield, Users, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import AuditLogViewer from '../AuditLogViewer';
import { ProtectedSection } from '../../ui/ProtectedAction';
import { usePermissions } from '../../../contexts/RoleContext';
import { auditLogger } from '../../../services/auditLogger';

interface ComplianceCloudProps {
  activeSubTab: string;
}

const ComplianceCloud: React.FC<ComplianceCloudProps> = ({ activeSubTab }) => {
  const { role, hasPermission } = usePermissions();
  const actionCounts = auditLogger.getActionCounts();
  const recentLogs = auditLogger.getRecentLogs(5);

  const renderContent = () => {
    switch (activeSubTab) {
      case 'Audit Log':
        return <AuditLogViewer />;

      case 'Roles':
        return (
          <ProtectedSection permission="canManageRoles" title="Role Management">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Role Management</h2>
                  <p className="text-sm text-gray-500">Manage user roles and permissions</p>
                </div>
              </div>

              {/* Current Role Info */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                <p className="text-sm text-purple-700">
                  <strong>Your Current Role:</strong> {role}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  This is a PoC demonstration. In production, role management would be integrated with IAM/LDAP.
                </p>
              </div>

              {/* Role Matrix Preview */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">View Customers</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Edit Customers</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">Manage Campaigns</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">View Audit</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">MFA Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { role: 'Admin', viewCust: true, editCust: true, campaigns: true, audit: true, mfa: true },
                      { role: 'RM', viewCust: false, editCust: true, campaigns: false, audit: false, mfa: false },
                      { role: 'CS', viewCust: true, editCust: false, campaigns: false, audit: false, mfa: false },
                      { role: 'Marketing', viewCust: true, editCust: false, campaigns: true, audit: false, mfa: false },
                      { role: 'Viewer', viewCust: false, editCust: false, campaigns: false, audit: false, mfa: false },
                    ].map((row) => (
                      <tr key={row.role} className={role === row.role ? 'bg-purple-50' : ''}>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {row.role}
                          {role === row.role && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-purple-200 text-purple-700 rounded">Current</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.viewCust ? (
                            <CheckCircle size={16} className="inline text-green-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.editCust ? (
                            <CheckCircle size={16} className="inline text-green-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.campaigns ? (
                            <CheckCircle size={16} className="inline text-green-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.audit ? (
                            <CheckCircle size={16} className="inline text-green-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.mfa ? (
                            <Shield size={16} className="inline text-orange-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                * Permission matrix follows OWASP deny-by-default and least privilege principles.
              </p>
            </div>
          </ProtectedSection>
        );

      case 'Config':
        return (
          <ProtectedSection permission="canManageRoles" title="System Configuration">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">System Configuration</h2>
                  <p className="text-sm text-gray-500">Compliance and security settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SLA Settings */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    SLA Configuration
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Response (Critical)</span>
                      <span className="font-medium">1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Response (High)</span>
                      <span className="font-medium">4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolution (Standard)</span>
                      <span className="font-medium">72 hours</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Based on OJK POJK 18/2018 requirements
                  </p>
                </div>

                {/* Consent Settings */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-500" />
                    Consent Gating
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Marketing consent required</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active case blocking</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Quiet hours enforcement</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Disabled</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Compliant with UU PDP No. 27/2022
                  </p>
                </div>

                {/* Audit Settings */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-purple-500" />
                    Audit Configuration
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total events logged</span>
                      <span className="font-medium">{auditLogger.getCount()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Storage</span>
                      <span className="font-medium">localStorage (PoC)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Max retention</span>
                      <span className="font-medium">1,000 events</span>
                    </div>
                  </div>
                </div>

                {/* Data Masking */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    Data Masking Rules
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">NIK masking</span>
                      <span className="font-mono text-xs">●●●●●●●●●●●●1234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone masking</span>
                      <span className="font-mono text-xs">●●●●●●●●890</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email masking</span>
                      <span className="font-mono text-xs">a***@email.com</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Applied based on role permissions
                  </p>
                </div>
              </div>
            </div>
          </ProtectedSection>
        );

      default:
        return <AuditLogViewer />;
    }
  };

  return (
    <div className="p-6">
      {/* Quick Stats */}
      {activeSubTab === 'Audit Log' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-2xl font-bold text-gray-800">{auditLogger.getCount()}</p>
            <p className="text-xs text-gray-500">Total Events</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-2xl font-bold text-blue-600">{actionCounts['VIEW'] || 0}</p>
            <p className="text-xs text-gray-500">View Events</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-2xl font-bold text-green-600">{actionCounts['CREATE'] || 0}</p>
            <p className="text-xs text-gray-500">Create Events</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-2xl font-bold text-orange-600">{actionCounts['ROLE_CHANGE'] || 0}</p>
            <p className="text-xs text-gray-500">Role Changes</p>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default ComplianceCloud;
