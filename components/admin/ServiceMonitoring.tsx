import React, { useMemo } from 'react';
import { User } from '../../types';
import { buildCRMMetricsProfile, calculateAggregateCRMMetrics } from '../../services/crmMetricsAnalytics';
import { 
  HeartPulse, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users,
  Timer,
  Target,
  BarChart3,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ServiceMonitoringProps {
  customers: User[];
}

const ServiceMonitoring: React.FC<ServiceMonitoringProps> = ({ customers }) => {
  // Calculate aggregate metrics from all customers
  const aggregateMetrics = useMemo(() => {
    return calculateAggregateCRMMetrics(customers);
  }, [customers]);

  // Get individual CRM profiles for detailed analysis
  const customerProfiles = useMemo(() => {
    return customers.map(c => ({
      customer: c,
      metrics: buildCRMMetricsProfile(c)
    }));
  }, [customers]);

  // Calculate service distribution
  const serviceStats = useMemo(() => {
    const profiles = customerProfiles;
    
    // SLA performance breakdown
    const excellentSLA = profiles.filter(p => p.metrics.serviceMetrics.slaHitRate >= 90).length;
    const goodSLA = profiles.filter(p => p.metrics.serviceMetrics.slaHitRate >= 70 && p.metrics.serviceMetrics.slaHitRate < 90).length;
    const poorSLA = profiles.filter(p => p.metrics.serviceMetrics.slaHitRate < 70).length;

    // Ticket status
    const totalTickets = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.totalTickets, 0);
    const resolvedTickets = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.resolvedTickets, 0);
    const pendingTickets = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.pendingTickets, 0);

    // Response time distribution
    const avgResponseTime = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.averageResponseTime, 0) / profiles.length;
    const avgResolutionTime = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.averageResolutionTime, 0) / profiles.length;

    // CSAT distribution
    const avgCSAT = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.satisfactionScore, 0) / profiles.length;

    // Repeat complaint analysis
    const avgRepeatRate = profiles.reduce((sum, p) => sum + p.metrics.serviceMetrics.repeatComplaintRate, 0) / profiles.length;

    return {
      excellentSLA,
      goodSLA,
      poorSLA,
      totalTickets,
      resolvedTickets,
      pendingTickets,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      avgCSAT: Math.round(avgCSAT * 10) / 10,
      avgRepeatRate: Math.round(avgRepeatRate),
      resolutionRate: totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0,
    };
  }, [customerProfiles]);

  // Get top issues (customers with high repeat complaint rate)
  const priorityIssues = useMemo(() => {
    return customerProfiles
      .filter(p => p.metrics.serviceMetrics.repeatComplaintRate > 15 || p.metrics.serviceMetrics.pendingTickets > 0)
      .sort((a, b) => b.metrics.serviceMetrics.repeatComplaintRate - a.metrics.serviceMetrics.repeatComplaintRate)
      .slice(0, 5);
  }, [customerProfiles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Service Monitoring</h2>
          <p className="text-gray-500 text-sm">Aggregate SLA & Ticket Metrics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Real-time Data
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Avg Response Time */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase">Avg Response Time</span>
            <Timer size={18} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{serviceStats.avgResponseTime}h</p>
          <p className="text-xs text-gray-400 mt-1">First response</p>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <TrendingDown size={12} className="text-green-600" />
            <span className="text-green-600 font-medium">-12%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase">Avg Resolution</span>
            <Clock size={18} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{serviceStats.avgResolutionTime}h</p>
          <p className="text-xs text-gray-400 mt-1">Ticket closure</p>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <TrendingDown size={12} className="text-green-600" />
            <span className="text-green-600 font-medium">-8%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* SLA Hit Rate */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase">SLA Hit Rate</span>
            <Target size={18} className="text-green-500" />
          </div>
          <p className={`text-3xl font-bold ${aggregateMetrics.avgSlaHitRate >= 80 ? 'text-green-600' : aggregateMetrics.avgSlaHitRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {aggregateMetrics.avgSlaHitRate}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Target: 80%</p>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <TrendingUp size={12} className="text-green-600" />
            <span className="text-green-600 font-medium">+3.2%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase">CSAT Score</span>
            <HeartPulse size={18} className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">⭐ {serviceStats.avgCSAT}</p>
          <p className="text-xs text-gray-400 mt-1">out of 5.0</p>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <TrendingUp size={12} className="text-green-600" />
            <span className="text-green-600 font-medium">+0.2</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

      {/* Second Row: Ticket Status + SLA Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Ticket Status Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-500" /> Ticket Status Overview
          </h3>
          
          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">{serviceStats.totalTickets}</p>
              <p className="text-xs text-blue-600 font-medium">Total Tickets</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <p className="text-2xl font-bold text-green-700">{serviceStats.resolvedTickets}</p>
              <p className="text-xs text-green-600 font-medium">Resolved</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
              <p className="text-2xl font-bold text-orange-700">{serviceStats.pendingTickets}</p>
              <p className="text-xs text-orange-600 font-medium">Pending</p>
            </div>
          </div>

          {/* Resolution Rate Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Resolution Rate</span>
              <span className="font-bold text-gray-700">{serviceStats.resolutionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${serviceStats.resolutionRate}%` }}
              />
            </div>
          </div>

          {/* Repeat Complaint */}
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-700 font-medium">Repeat Complaint Rate</span>
              </div>
              <span className={`text-lg font-bold ${serviceStats.avgRepeatRate <= 10 ? 'text-green-600' : serviceStats.avgRepeatRate <= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                {serviceStats.avgRepeatRate}%
              </span>
            </div>
            <p className="text-xs text-red-500 mt-1">Target: &lt;10%</p>
          </div>
        </div>

        {/* SLA Distribution Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target size={16} className="text-gray-500" /> SLA Performance Distribution
          </h3>
          
          {/* Distribution Cards */}
          <div className="space-y-3">
            {/* Excellent */}
            <div className="flex items-center gap-3">
              <div className="w-16 text-right">
                <span className="text-xs font-semibold text-green-700">Excellent</span>
                <p className="text-lg font-bold text-green-600">{serviceStats.excellentSLA}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-end pr-2"
                    style={{ width: `${(serviceStats.excellentSLA / customers.length) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">&gt;90%</span>
                  </div>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-green-500" />
            </div>

            {/* Good */}
            <div className="flex items-center gap-3">
              <div className="w-16 text-right">
                <span className="text-xs font-semibold text-yellow-700">Good</span>
                <p className="text-lg font-bold text-yellow-600">{serviceStats.goodSLA}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 flex items-center justify-end pr-2"
                    style={{ width: `${(serviceStats.goodSLA / customers.length) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">70-89%</span>
                  </div>
                </div>
              </div>
              <AlertTriangle size={18} className="text-yellow-500" />
            </div>

            {/* Need Improvement */}
            <div className="flex items-center gap-3">
              <div className="w-16 text-right">
                <span className="text-xs font-semibold text-red-700">Poor</span>
                <p className="text-lg font-bold text-red-600">{serviceStats.poorSLA}</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 flex items-center justify-end pr-2"
                    style={{ width: `${(serviceStats.poorSLA / customers.length) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">&lt;70%</span>
                  </div>
                </div>
              </div>
              <XCircle size={18} className="text-red-500" />
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>SLA Target:</strong> 80% of tickets resolved within target time. 
              Current average: <span className={`font-bold ${aggregateMetrics.avgSlaHitRate >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{aggregateMetrics.avgSlaHitRate}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Priority Alerts Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-500" /> Priority Alerts - Nasabah Perlu Perhatian
        </h3>
        
        {priorityIssues.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nasabah</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Segment</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Pending Tickets</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Repeat Rate</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">SLA</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {priorityIssues.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.customer.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.customer.name}</p>
                          <p className="text-xs text-gray-400">{item.customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.customer.segment.includes('Champions') ? 'bg-green-100 text-green-700' :
                        item.customer.segment.includes('Loyal') ? 'bg-blue-100 text-blue-700' :
                        item.customer.segment.includes('At Risk') ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.customer.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${item.metrics.serviceMetrics.pendingTickets > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {item.metrics.serviceMetrics.pendingTickets}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${item.metrics.serviceMetrics.repeatComplaintRate > 20 ? 'text-red-600' : item.metrics.serviceMetrics.repeatComplaintRate > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {item.metrics.serviceMetrics.repeatComplaintRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${item.metrics.serviceMetrics.slaHitRate >= 80 ? 'text-green-600' : item.metrics.serviceMetrics.slaHitRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.metrics.serviceMetrics.slaHitRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="px-3 py-1.5 bg-sumut-blue text-white text-xs font-semibold rounded-lg hover:bg-sumut-darkBlue transition">
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
            <p>Tidak ada nasabah dengan masalah service prioritas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceMonitoring;
