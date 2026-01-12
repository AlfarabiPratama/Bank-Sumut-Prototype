import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, Building2, Target, Award, ArrowRight, Gift, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Funnel, FunnelChart, LabelList } from 'recharts';
import { User, RFMSegment } from '../../types';

interface LoanApplication {
  id: string;
  customerName: string;
  productType: string;
  amount: number;
  stage: string;
  assignedRM: string;
  daysInStage: number;
  priority: string;
  createdDate: string;
}

interface AnalyticsDashboardProps {
  applications: LoanApplication[];
  customers?: User[];
}

const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ applications, customers = [] }) => {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalApplications = applications.length;
    const completedDeals = applications.filter(a => a.stage === 'active').length;
    const totalRevenue = applications.filter(a => a.stage === 'active').reduce((sum, a) => sum + a.amount, 0);
    const pipelineValue = applications.filter(a => !['active', 'rejected'].includes(a.stage)).reduce((sum, a) => sum + a.amount, 0);
    
    // By product type
    const byProduct = applications.reduce((acc, app) => {
      acc[app.productType] = (acc[app.productType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // By RM performance
    const byRM = applications.reduce((acc, app) => {
      if (!acc[app.assignedRM]) {
        acc[app.assignedRM] = { leads: 0, won: 0, revenue: 0 };
      }
      acc[app.assignedRM].leads++;
      if (app.stage === 'active') {
        acc[app.assignedRM].won++;
        acc[app.assignedRM].revenue += app.amount;
      }
      return acc;
    }, {} as Record<string, { leads: number; won: number; revenue: number }>);

    // Funnel data
    const funnelData = [
      { name: 'New Leads', value: applications.filter(a => a.stage === 'new_lead').length, fill: '#3B82F6' },
      { name: 'Contacted', value: applications.filter(a => a.stage === 'contacted').length, fill: '#06B6D4' },
      { name: 'Documents', value: applications.filter(a => a.stage === 'doc_collection').length, fill: '#8B5CF6' },
      { name: 'Scoring', value: applications.filter(a => a.stage === 'credit_scoring').length, fill: '#F59E0B' },
      { name: 'Approval', value: applications.filter(a => a.stage === 'approval').length, fill: '#10B981' },
      { name: 'Disbursed', value: applications.filter(a => a.stage === 'disbursement').length, fill: '#059669' },
      { name: 'Active', value: applications.filter(a => a.stage === 'active').length, fill: '#047857' },
    ];

    const conversionRate = totalApplications > 0 ? ((completedDeals / totalApplications) * 100).toFixed(1) : '0';

    return { totalApplications, completedDeals, totalRevenue, pipelineValue, byProduct, byRM, funnelData, conversionRate };
  }, [applications]);

  // Product distribution for pie chart
  const productData = Object.entries(analytics.byProduct).map(([name, value], idx) => ({
    name,
    value,
    fill: COLORS[idx % COLORS.length],
  }));

  // RM leaderboard
  const rmLeaderboard = Object.entries(analytics.byRM)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  // Monthly performance (mock data for demo)
  const monthlyPerformance = [
    { metric: 'Leads Created', value: analytics.totalApplications, change: '+15%', positive: true },
    { metric: 'Deals Created', value: analytics.totalApplications, change: '+12%', positive: true },
    { metric: 'Deals Won', value: analytics.completedDeals, change: '+8%', positive: true },
    { metric: 'Revenue Won', value: `Rp ${(analytics.totalRevenue / 1000000).toFixed(0)}jt`, change: '+22%', positive: true },
    { metric: 'Open Amount', value: `Rp ${(analytics.pipelineValue / 1000000).toFixed(0)}jt`, change: '+5%', positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Analytics</h2>
          <p className="text-xs text-gray-500">Pipeline & Performance Overview</p>
        </div>
        <select className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Leads This Month</span>
            <FileText size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +100%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Revenue This Month</span>
            <DollarSign size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Rp {(analytics.totalRevenue / 1000000).toFixed(0)}jt</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +100%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Deals in Pipeline</span>
            <Target size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {applications.filter(a => !['active', 'rejected'].includes(a.stage)).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Rp {(analytics.pipelineValue / 1000000000).toFixed(2)}M value</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Conversion Rate</span>
            <Award size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.completedDeals} deals won</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sales Funnel */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Sales Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.funnelData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip 
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: number) => [`${value} applications`, 'Count']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {analytics.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Product */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Leads by Product</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ fontSize: 11 }}
                  formatter={(value: number, name: string) => [`${value} (${((value / analytics.totalApplications) * 100).toFixed(0)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2">
            {productData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Performance Monitor */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Last 3 Months Performance</h3>
          <table className="w-full text-xs">
            <tbody>
              {monthlyPerformance.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 text-gray-600">{row.metric}</td>
                  <td className="py-2.5 text-right font-semibold text-blue-600">{row.value}</td>
                  <td className="py-2.5 text-right">
                    <span className={`inline-flex items-center gap-0.5 ${row.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {row.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Top Sales Reps</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-gray-500 font-medium">RM Name</th>
                <th className="pb-2 text-right text-gray-500 font-medium">Leads</th>
                <th className="pb-2 text-right text-gray-500 font-medium">Won</th>
                <th className="pb-2 text-right text-gray-500 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rmLeaderboard.map((rm, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="text-amber-500">🥇</span>}
                      {idx === 1 && <span className="text-gray-400">🥈</span>}
                      {idx === 2 && <span className="text-amber-700">🥉</span>}
                      <span className="text-gray-800 font-medium">{rm.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-gray-600">{rm.leads}</td>
                  <td className="py-2.5 text-right text-green-600 font-medium">{rm.won}</td>
                  <td className="py-2.5 text-right text-gray-800 font-semibold">
                    Rp {(rm.revenue / 1000000).toFixed(0)}jt
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Lead Generation Target</h3>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</span>
            <span className="text-xs text-gray-500">Target: 50</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
              style={{ width: `${Math.min((analytics.totalApplications / 50) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((analytics.totalApplications / 50) * 100).toFixed(0)}% of target achieved
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Revenue Target</h3>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">Rp {(analytics.totalRevenue / 1000000).toFixed(0)}jt</span>
            <span className="text-xs text-gray-500">Target: Rp 500jt</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min((analytics.totalRevenue / 500000000) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((analytics.totalRevenue / 500000000) * 100).toFixed(0)}% of target achieved
          </p>
        </div>
      </div>

      {/* Customer 360 Summary - NEW SECTION */}
      {customers.length > 0 && (
        <>
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-purple-600" />
              <h2 className="text-lg font-bold text-gray-800">Customer 360 Summary</h2>
            </div>
          </div>

          {/* Customer Health & RFM Distribution */}
          <div className="grid grid-cols-3 gap-4">
            {/* Customer Health Score */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-gray-800">Customer Health</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.segment === RFMSegment.CHAMPIONS || c.segment === RFMSegment.LOYAL).length}
                  </p>
                  <p className="text-[10px] text-gray-500">Healthy</p>
                </div>
                <div className="text-center bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-500">
                    {customers.filter(c => c.segment === RFMSegment.AT_RISK || c.segment === RFMSegment.HIBERNATING).length}
                  </p>
                  <p className="text-[10px] text-gray-500">At Risk</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Health Ratio</span>
                  <span className="font-semibold text-emerald-700">
                    {((customers.filter(c => c.segment === RFMSegment.CHAMPIONS || c.segment === RFMSegment.LOYAL).length / customers.length) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(customers.filter(c => c.segment === RFMSegment.CHAMPIONS || c.segment === RFMSegment.LOYAL).length / customers.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RFM Segment Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">RFM Segment Distribution</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.values(RFMSegment).map((seg, idx) => ({
                        name: seg,
                        value: customers.filter(c => c.segment === seg).length,
                        fill: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][idx]
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {Object.values(RFMSegment).map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][idx]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                {Object.values(RFMSegment).map((seg, idx) => (
                  <div key={seg} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][idx] }} />
                      <span className="text-gray-600">{seg}</span>
                    </div>
                    <span className="font-medium">{customers.filter(c => c.segment === seg).length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards & Engagement */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border border-orange-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gift size={16} className="text-orange-600" />
                <h3 className="text-sm font-semibold text-gray-800">Rewards Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Points</p>
                  <p className="text-xl font-bold text-orange-600">
                    {customers.reduce((sum, c) => sum + c.points, 0).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-orange-600">
                      {customers.filter(c => (c.dailyLoginStreak || 0) >= 3).length} 🔥
                    </p>
                    <p className="text-[10px] text-gray-500">Active Streaks</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-orange-600">
                      {customers.reduce((sum, c) => sum + (c.rewardHistory?.length || 0), 0)}
                    </p>
                    <p className="text-[10px] text-gray-500">Redeemed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dompet Impian & Avg RFM */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl border border-yellow-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-800">Dompet Impian Overview</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">
                    {customers.reduce((sum, c) => sum + (c.dreamSavers?.length || 0), 0)}
                  </p>
                  <p className="text-[10px] text-gray-500">Total Goals</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">
                    Rp {(customers.reduce((sum, c) => sum + (c.dreamSavers?.reduce((s, d) => s + d.currentAmount, 0) || 0), 0) / 1000000).toFixed(1)}jt
                  </p>
                  <p className="text-[10px] text-gray-500">Total Saved</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">
                    {(() => {
                      const allGoals = customers.flatMap(c => c.dreamSavers || []);
                      if (allGoals.length === 0) return '0%';
                      const avgProgress = allGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount) * 100, 0) / allGoals.length;
                      return `${avgProgress.toFixed(0)}%`;
                    })()}
                  </p>
                  <p className="text-[10px] text-gray-500">Avg Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl border border-purple-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-800">RFM Score Analysis</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-purple-700">
                    {(customers.reduce((sum, c) => sum + c.rfmScore.recency, 0) / customers.length).toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500">Avg Recency</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-purple-700">
                    {(customers.reduce((sum, c) => sum + c.rfmScore.frequency, 0) / customers.length).toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500">Avg Frequency</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-purple-700">
                    {(customers.reduce((sum, c) => sum + c.rfmScore.monetary, 0) / customers.length).toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500">Avg Monetary</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Avg Total RFM: {(customers.reduce((sum, c) => sum + c.rfmScore.recency + c.rfmScore.frequency + c.rfmScore.monetary, 0) / (customers.length * 3)).toFixed(2)} / 5.0
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
