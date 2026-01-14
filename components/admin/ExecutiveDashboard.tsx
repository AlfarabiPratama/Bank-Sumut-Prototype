import React, { useState, useMemo } from 'react';
import { 
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  Megaphone,
  Briefcase,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { User, Campaign, LoanApplication } from '../../types';
import { generateExecutiveMetrics } from '../../services/mockExecutiveData';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend 
} from 'recharts';
import HeroKPI from '../director/HeroKPI';
import HealthMetric, { HealthIndicator } from '../director/HealthMetric';
import CriticalAlertCard from '../director/CriticalAlertCard';
import InsightCard from '../director/InsightCard';

interface ExecutiveDashboardProps {
  customers: User[];
  campaigns: Campaign[];
  applications: LoanApplication[];
  onNavigateToPillar: (pillar: 'marketing' | 'sales' | 'service') => void;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  customers,
  campaigns,
  applications,
  onNavigateToPillar,
}) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  // Generate executive metrics
  const metrics = useMemo(() => 
    generateExecutiveMetrics(customers, campaigns, applications),
    [customers, campaigns, applications]
  );
  
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}M`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  // Health indicators
  const revenueIndicators: HealthIndicator[] = [
    { label: 'Revenue vs Target', value: metrics.revenueVsTarget, threshold: 90 },
    { label: 'Revenue Growth', value: metrics.revenueGrowth, threshold: 10 },
    { label: 'Revenue per Customer', value: (metrics.revenuePerCustomer / 1000000), threshold: 5, unit: 'M' }
  ];
  
  const customerIndicators: HealthIndicator[] = [
    { label: 'Churn Rate', value: metrics.churnRate, threshold: 3, inverse: true },
    { label: 'NPS Score', value: metrics.nps, threshold: 40, unit: '' },
    { label: 'Customer Satisfaction', value: metrics.csat, threshold: 80 }
  ];
  
  const operationsIndicators: HealthIndicator[] = [
    { label: 'SLA Compliance', value: metrics.slaCompliance, threshold: 90 },
    { label: 'Response Time', value: metrics.avgResponseTime, threshold: 15, inverse: true, unit: 'min' },
    { label: 'Resolution Rate', value: metrics.resolutionRate, threshold: 85 }
  ];
  
  const teamIndicators: HealthIndicator[] = [
    { label: 'Team Productivity', value: metrics.teamProductivity, threshold: 85 },
    { label: 'Target Achievement', value: metrics.targetAchievement, threshold: 90 },
    { label: 'Employee Engagement', value: metrics.engagement, threshold: 75 }
  ];
  
  // Filter out dismissed alerts
  const activeAlerts = metrics.criticalAlerts.filter(
    alert => !dismissedAlerts.includes(alert.id)
  );
  
  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };
  
  const pillarCards = [
    {
      pillar: 'marketing' as const,
      title: 'Marketing Cloud',
      icon: Megaphone,
      color: 'orange',
      stats: [
        { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length },
        { label: 'Avg Conversion', value: `${(campaigns.reduce((s, c) => s + c.conversion, 0) / campaigns.length || 0).toFixed(1)}%` },
      ],
    },
    {
      pillar: 'sales' as const,
      title: 'Sales Cloud',
      icon: Briefcase,
      color: 'green',
      stats: [
        { label: 'Pipeline Value', value: formatCurrency(applications.reduce((s, a) => s + a.amount, 0)) },
        { label: 'Won Deals', value: applications.filter(a => a.stage === 'disbursement' || a.stage === 'active').length },
      ],
    },
    {
      pillar: 'service' as const,
      title: 'Service Cloud',
      icon: Headphones,
      color: 'blue',
      stats: [
        { label: 'Open Tickets', value: 12 },
        { label: 'SLA Compliance', value: `${metrics.slaCompliance}%` },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Command Center</h1>
          <p className="text-gray-500 mt-1">Strategic insights & business intelligence</p>
        </div>

        {/* Critical Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                🚨 Critical Alerts <span className="text-red-600">({activeAlerts.length})</span>
              </h2>
              <span className="text-xs text-gray-500">Issues requiring immediate attention</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeAlerts.map(alert => (
                <CriticalAlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                  onAction={(alert) => console.log('Alert action:', alert.type)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hero KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HeroKPI
            icon={DollarSign}
            iconColor="purple"
            label="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change={metrics.revenueChange}
            changeLabel="vs last period"
            target={metrics.revenueTarget}
            targetLabel="Monthly Target"
            status={metrics.totalRevenue >= metrics.revenueTarget * 0.9 ? 'success' : 'warning'}
            tooltip="Total pendapatan dari bunga kredit, fee-based income, dan pendapatan lainnya. Target bulanan ditetapkan oleh Direksi."
          />
          
          <HeroKPI
            icon={Users}
            iconColor="blue"
            label="Total Customers"
            value={metrics.totalCustomers.toLocaleString()}
            change={metrics.customerGrowth}
            changeLabel="growth rate"
            breakdown={[
              { label: 'New', value: metrics.newCustomers, color: '#10b981' },
              { label: 'Active', value: metrics.activeCustomers, color: '#3b82f6' },
              { label: 'Churned', value: metrics.churnedCustomers, color: '#ef4444' }
            ]}
            tooltip="Jumlah total nasabah aktif. New = baru dalam 30 hari, Active = transaksi dalam 90 hari, Churned = tidak aktif > 180 hari."
          />
          
          <HeroKPI
            icon={TrendingUp}
            iconColor="green"
            label="Assets Under Management"
            value={formatCurrency(metrics.totalAUM)}
            change={metrics.aumChange}
            changeLabel="vs last period"
            subtitle="Total customer deposits"
            tooltip="Total dana kelolaan nasabah termasuk tabungan, deposito, dan reksa dana. Menunjukkan kepercayaan nasabah terhadap bank."
          />
          
          <HeroKPI
            icon={CreditCard}
            iconColor="orange"
            label="Product Penetration"
            value={metrics.avgProductsPerCustomer.toFixed(1)}
            subtitle="products per customer"
            change={metrics.penetrationChange}
            target={metrics.penetrationTarget}
            targetLabel="Target"
            tooltip="Rata-rata jumlah produk yang dimiliki per nasabah. Semakin tinggi = cross-sell berhasil. Target industri: 3+ produk."
          />
        </div>

        {/* Business Health Scorecard */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🏥 Business Health Scorecard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HealthMetric
              category="Kesehatan Pendapatan"
              score={metrics.healthScores.revenue}
              indicators={revenueIndicators}
              tooltip="Mengukur performa pendapatan bank: pencapaian target, pertumbuhan, dan pendapatan per nasabah."
            />
            <HealthMetric
              category="Kesehatan Nasabah"
              score={metrics.healthScores.customer}
              indicators={customerIndicators}
              tooltip="Mengukur loyalitas dan kepuasan nasabah: churn rate, NPS, dan CSAT score."
            />
            <HealthMetric
              category="Kesehatan Operasional"
              score={metrics.healthScores.operations}
              indicators={operationsIndicators}
              tooltip="Mengukur efisiensi operasi: kepatuhan SLA, waktu respons, dan tingkat resolusi."
            />
            <HealthMetric
              category="Kesehatan Tim"
              score={metrics.healthScores.team}
              indicators={teamIndicators}
              tooltip="Mengukur produktivitas tim: pencapaian target sales, utilisasi, dan kapasitas."
            />
          </div>
        </div>

        {/* Pillar Quick Access */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">📊 CRM Pillars</h2>
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
        </div>

        {/* Revenue Analytics */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">💰 Revenue Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend (12 Months)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Product */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue by Product</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={metrics.revenueByProduct}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="revenue"
                    label={(entry) => `${entry.percentage.toFixed(0)}%`}
                  >
                    {metrics.revenueByProduct.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Customer Portfolio Analytics */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Customer Portfolio Health</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Lifecycle Funnel */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Lifecycle Funnel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.customerLifecycle} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* VIP Customer Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 shadow-sm">
              <h3 className="font-semibold text-purple-900 mb-4">💎 VIP Customers</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-purple-600 mb-1">VIP Count</p>
                  <p className="text-3xl font-bold text-purple-900">{metrics.vipCustomers}</p>
                  <p className="text-xs text-purple-600">{metrics.vipPercentage.toFixed(1)}% of total</p>
                </div>
                <div>
                  <p className="text-sm text-purple-600 mb-1">VIP AUM</p>
                  <p className="text-3xl font-bold text-purple-900">{formatCurrency(metrics.vipAUM)}</p>
                  <p className="text-xs text-purple-600">{((metrics.vipAUM / metrics.totalAUM) * 100).toFixed(0)}% of total AUM</p>
                </div>
                <div className="pt-3 border-t border-purple-200">
                  <div className="flex items-center gap-2 text-xs text-purple-700">
                    <span className="font-bold text-2xl">📊</span>
                    <p>Top {metrics.vipPercentage.toFixed(0)}% customers hold {((metrics.vipAUM / metrics.totalAUM) * 100).toFixed(0)}% of AUM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔮 Predictive Insights & Recommendations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Forecast */}
            <InsightCard type="forecast" title="Revenue Forecast">
              <p className="text-sm text-gray-600">Projected revenue for next month:</p>
              <p className="text-3xl font-bold text-blue-900 my-2">{formatCurrency(metrics.forecastRevenue)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-bold text-blue-600">{metrics.forecastConfidence}%</span>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(metrics.forecastRevenue / metrics.quarterTarget) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((metrics.forecastRevenue / metrics.quarterTarget) * 100).toFixed(0)}% of quarterly target
              </p>
            </InsightCard>

            {/* Churn Risk Alert */}
            <InsightCard type="warning" title="Churn Risk Alert">
              <p className="text-sm text-gray-600 mb-2">{metrics.churnRiskCustomers} high-value customers at risk</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">At-Risk Customers</p>
                  <p className="text-2xl font-bold text-orange-900">{metrics.churnRiskCustomers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Potential AUM Loss</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(metrics.churnRiskValue)}</p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors">
                View Retention Plan
              </button>
            </InsightCard>

            {/* Cross-Sell Opportunity */}
            <InsightCard type="opportunity" title="Cross-Sell Opportunity">
              <p className="text-sm text-gray-600 mb-2">High-potential customers for additional products:</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Qualified Leads</p>
                  <p className="text-2xl font-bold text-purple-900">{metrics.crossSellOpportunities}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Potential Revenue</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(metrics.crossSellPotential)}</p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                Activate Campaign
              </button>
            </InsightCard>

            {/* Best Practices */}
            <InsightCard type="success" title="Best Practices">
              <p className="text-sm text-gray-600 mb-3">Top performing strategies this period:</p>
              <div className="space-y-2">
                {metrics.bestPractices.map((practice, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-100 rounded-lg">
                    <span className="text-lg">🏆</span>
                    <div className="flex-1">
                      <p className="text-xs text-green-900">{practice.description}</p>
                    </div>
                    <span className="text-sm font-bold text-green-700">+{practice.impact}%</span>
                  </div>
                ))}
              </div>
            </InsightCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default ExecutiveDashboard;
