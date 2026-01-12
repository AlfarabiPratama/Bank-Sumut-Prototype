import React, { useState, useMemo } from 'react';
import { 
  TrendingUp,
  Users,
  Target,
  Award,
  DollarSign,
  Megaphone,
  Briefcase,
  Headphones,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { User, Campaign, LoanApplication, RFMSegment } from '../../types';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ExecutiveDashboardProps {
  customers: User[];
  campaigns: Campaign[];
  applications: LoanApplication[];
  onNavigateToPillar: (pillar: 'marketing' | 'sales' | 'service') => void;
}

const SEGMENT_COLORS = {
  [RFMSegment.CHAMPIONS]: '#059669',
  [RFMSegment.LOYAL]: '#22c55e',
  [RFMSegment.POTENTIAL]: '#eab308',
  [RFMSegment.AT_RISK]: '#f97316',
  [RFMSegment.HIBERNATING]: '#ef4444',
};

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  customers,
  campaigns,
  applications,
  onNavigateToPillar,
}) => {
  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => 
      c.segment === RFMSegment.CHAMPIONS || c.segment === RFMSegment.LOYAL
    ).length;
    const retentionRate = totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100) : 0;

    const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
    const avgBalance = totalCustomers > 0 ? totalBalance / totalCustomers : 0;

    const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
    const avgConversion = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + c.conversion, 0) / campaigns.length 
      : 0;

    const pipelineValue = applications.reduce((sum, a) => sum + a.amount, 0);
    const approved = applications.filter(a => a.stage === 'disbursement' || a.stage === 'active').length;
    const pending = applications.filter(a => a.stage === 'new_lead' || a.stage === 'contacted' || a.stage === 'doc_collection' || a.stage === 'credit_scoring' || a.stage === 'approval').length;

    return {
      totalCustomers,
      retentionRate: retentionRate.toFixed(1),
      avgBalance,
      activeCampaigns,
      avgConversion: avgConversion.toFixed(1),
      pipelineValue,
      approvedDeals: approved, // Renamed from approvedDeals to approved
      pendingDeals: pending, // Added pending deals
    };
  }, [customers, campaigns, applications]);

  // Segment distribution
  const segmentData = useMemo(() => {
    const stats: Record<string, number> = {};
    customers.forEach(c => {
      stats[c.segment] = (stats[c.segment] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
      color: SEGMENT_COLORS[name as RFMSegment] || '#94a3b8',
    }));
  }, [customers]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const pillarCards = [
    {
      pillar: 'marketing' as const,
      title: 'Marketing Cloud',
      icon: Megaphone,
      color: 'orange',
      stats: [
        { label: 'Active Campaigns', value: metrics.activeCampaigns },
        { label: 'Avg Conversion', value: `${metrics.avgConversion}%` },
      ],
    },
    {
      pillar: 'sales' as const,
      title: 'Sales Cloud',
      icon: Briefcase,
      color: 'green',
      stats: [
        { label: 'Pipeline Value', value: formatCurrency(metrics.pipelineValue) },
        { label: 'Won Deals', value: metrics.approvedDeals },
      ],
    },
    {
      pillar: 'service' as const,
      title: 'Service Cloud',
      icon: Headphones,
      color: 'blue',
      stats: [
        { label: 'Open Tickets', value: 12 },
        { label: 'SLA Compliance', value: '94.5%' },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Unified view across Marketing, Sales & Service</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalCustomers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Users size={24} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-sm text-green-600 font-medium">+5.2%</span>
              <span className="text-sm text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.retentionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Target size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-sm text-green-600 font-medium">+1.8%</span>
              <span className="text-sm text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgBalance)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12.4%</span>
              <span className="text-sm text-gray-400">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Campaign ROI</p>
                <p className="text-2xl font-bold text-gray-900">340%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ArrowUp size={14} className="text-green-600" />
              <span className="text-sm text-green-600 font-medium">+23%</span>
              <span className="text-sm text-gray-400">vs last quarter</span>
            </div>
          </div>
        </div>

        {/* Pillar Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillarCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = {
              orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
              green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
              blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
            }[card.color];

            return (
              <div
                key={card.pillar}
                onClick={() => onNavigateToPillar(card.pillar)}
                className={`bg-white rounded-xl p-5 border-2 ${colorClasses.border} hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">{card.title}</h3>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className={`${colorClasses.light} rounded-lg p-3`}>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className={`text-lg font-bold ${colorClasses.text}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Segment Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <div className="flex items-center">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 ml-4">
                {segmentData.map((segment) => (
                  <div key={segment.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm text-gray-600">{segment.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{segment.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Zap size={18} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">High Conversion Opportunity</p>
                  <p className="text-xs text-green-600 mt-1">23 Potential customers ready for upgrade campaign</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Activity size={18} className="text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Churn Risk Alert</p>
                  <p className="text-xs text-orange-600 mt-1">8 At Risk customers need immediate attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Award size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Top Performer</p>
                  <p className="text-xs text-blue-600 mt-1">Ahmad Siregar achieved 120% of sales target</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
