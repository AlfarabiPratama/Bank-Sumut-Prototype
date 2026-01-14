import { User, Campaign, LoanApplication } from '../types';

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Executive metrics interface
export interface ExecutiveMetrics {
  // Hero KPIs
  totalRevenue: number;
  revenueTarget: number;
  revenueChange: number; // percentage
  revenuePreviousPeriod: number;
  
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  customerGrowth: number; // percentage
  
  totalAUM: number;
  aumChange: number; // percentage
  aumTrend: { date: string; value: number }[];
  
  avgProductsPerCustomer: number;
  penetrationChange: number;
  penetrationTarget: number;
  
  // Health Scores (0-100)
  healthScores: {
    revenue: number;
    customer: number;
    operations: number;
    team: number;
  };
  
  // Health Indicators
  revenueVsTarget: number; // percentage
  revenueGrowth: number; // percentage  
  revenuePerCustomer: number;
  
  churnRate: number; // percentage
  nps: number; // Net Promoter Score
  csat: number; // Customer Satisfaction
  
  slaCompliance: number; // percentage
  avgResponseTime: number; // minutes
  resolutionRate: number; // percentage
  
  teamProductivity: number; // percentage
  targetAchievement: number; // percentage
  engagement: number; // percentage
  
  // Critical Alerts
  criticalAlerts: CriticalAlert[];
  
  // Revenue Analytics
  revenueTrend: { month: string; revenue: number; target: number }[];
  revenueByProduct: { product: string; revenue: number; percentage: number }[];
  revenueBySegment: { segment: string; revenue: number }[];
  
  // Customer Portfolio
  rfmDistribution: { segment: string; count: number; totalValue: number; trend: number }[];
  customerLifecycle: { stage: string; count: number }[];
  vipCustomers: number;
  vipAUM: number;
  vipPercentage: number;
  
  // Predictive Insights
  forecastRevenue: number;
  forecastConfidence: number;
  quarterTarget: number;
  churnRiskCustomers: number;
  churnRiskValue: number;
  crossSellOpportunities: number;
  crossSellPotential: number;
  bestPractices: { description: string; impact: number }[];
}

export interface CriticalAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'CHURN_RISK' | 'TARGET_MISS' | 'SLA_BREACH' | 'COMPLIANCE' | 'TEAM_PERFORMANCE';
  title: string;
  description: string;
  metrics?: { label: string; value: string | number }[];
  actionLabel?: string;
  createdAt: string;
}

// Mock data generator
export function generateExecutiveMetrics(
  customers: User[],
  campaigns: Campaign[],
  applications: LoanApplication[]
): ExecutiveMetrics {
  // Safety checks for undefined/empty data
  const safeCustomers = customers || [];
  const safeCampaigns = campaigns || [];
  const safeApplications = applications || [];
  
  const totalCustomers = safeCustomers.length || 1; // Prevent division by zero
  const totalBalance = safeCustomers.reduce((sum, c) => sum + (c?.balance || 0), 0);
  const avgBalance = totalBalance / totalCustomers;
  
  // Revenue calculation (simplified: loan amounts + estimated fee revenue)
  const loanRevenue = safeApplications
    .filter(a => a?.stage === 'disbursement' || a?.stage === 'active')
    .reduce((sum, a) => sum + ((a?.amount || 0) * 0.05), 0); // 5% as revenue estimate
  
  const totalRevenue = loanRevenue + (totalBalance * 0.02); // 2% on deposits
  const revenueTarget = 2500000000; // 2.5B target
  
  // Customer segmentation
  const activeCustomers = safeCustomers.filter(c => 
    c?.segment === 'Champions' || c?.segment === 'Loyal Customers'
  ).length;
  const newCustomers = Math.floor(totalCustomers * 0.036); // 3.6% growth
  const churnedCustomers = Math.floor(totalCustomers * 0.012); // 1.2% churn
  
  // Product penetration - with null safety
  const avgProducts = safeCustomers.reduce((sum, c) => sum + (c?.products?.length || 0), 0) / totalCustomers;
  
  // AUM trend (last 12 months)
  const aumTrend = Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2026, 0 - i, 1).toISOString().slice(0, 7),
    value: totalBalance * (1 - (i * 0.02)) // Declining trend for realism
  })).reverse();
  
  // Health calculations
  const revenueHealth = Math.min(100, (totalRevenue / revenueTarget) * 100);
  const customerHealth = Math.min(100, ((activeCustomers / totalCustomers) * 100 + (100 - (churnedCustomers / totalCustomers) * 100)) / 2);
  const operationsHealth = 92; // Mock - based on SLA
  const teamHealth = 88; // Mock - based on performance
  
  // Critical alerts generation
  const alerts: CriticalAlert[] = [];
  
  // Churn risk alert
  const atRiskCustomers = safeCustomers.filter(c => c?.segment === 'At Risk').length;
  if (atRiskCustomers > 5) {
    alerts.push({
      id: 'alert-churn-1',
      severity: 'HIGH',
      type: 'CHURN_RISK',
      title: 'High Churn Risk Detected',
      description: `${atRiskCustomers} high-value customers showing inactivity patterns`,
      metrics: [
        { label: 'At-Risk Customers', value: atRiskCustomers },
        { label: 'Potential AUM Loss', value: `Rp ${(atRiskCustomers * avgBalance / 1000000).toFixed(0)}M` }
      ],
      actionLabel: 'View Retention Plan',
      createdAt: new Date().toISOString()
    });
  }
  
  // Target miss warning
  if (revenueHealth < 70) {
    alerts.push({
      id: 'alert-target-1',
      severity: 'MEDIUM',
      type: 'TARGET_MISS',
      title: 'Monthly Target at Risk',
      description: 'Current revenue pace below 70% of monthly target',
      metrics: [
        { label: 'Achievement', value: `${revenueHealth.toFixed(1)}%` },
        { label: 'Gap to Target', value: `Rp ${((revenueTarget - totalRevenue) / 1000000000).toFixed(1)}B` }
      ],
      actionLabel: 'Review Strategy',
      createdAt: new Date().toISOString()
    });
  }
  
  // Revenue trend (last 12 months)
  const revenueTrend = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(2026, 0 - i, 1);
    const monthRevenue = totalRevenue * (1 - (i * 0.03) + (Math.random() * 0.05 - 0.025));
    return {
      month: monthDate.toISOString().slice(0, 7),
      revenue: monthRevenue,
      target: revenueTarget * 0.95 // Slightly lower target for historical months
    };
  }).reverse();
  
  // Revenue by product
  const productRevenue = [
    { product: 'KPR (Mortgage)', share: 0.35 },
    { product: 'KUR (Business Loan)', share: 0.28 },
    { product: 'Kartu Kredit', share: 0.18 },
    { product: 'Tabungan', share: 0.12 },
    { product: 'Deposito', share: 0.07 }
  ];
  const revenueByProduct = productRevenue.map(p => ({
    product: p.product,
    revenue: totalRevenue * p.share,
    percentage: p.share * 100
  }));
  
  // Revenue by segment
  const segmentStats: Record<string, { count: number; avgBalance: number }> = {};
  safeCustomers.forEach(c => {
    if (!c?.segment) return;
    if (!segmentStats[c.segment]) {
      segmentStats[c.segment] = { count: 0, avgBalance: 0 };
    }
    segmentStats[c.segment].count++;
    segmentStats[c.segment].avgBalance += c?.balance || 0;
  });
  
  const revenueBySegment = Object.entries(segmentStats).map(([segment, stats]) => ({
    segment,
    revenue: stats.avgBalance * 0.02 // 2% as revenue estimate
  }));
  
  // RFM distribution with value
  const rfmStats: Record<string, { count: number; value: number }> = {};
  safeCustomers.forEach(c => {
    if (!c?.segment) return;
    if (!rfmStats[c.segment]) {
      rfmStats[c.segment] = { count: 0, value: 0 };
    }
    rfmStats[c.segment].count++;
    rfmStats[c.segment].value += c?.balance || 0;
  });
  
  const rfmDistribution = Object.entries(rfmStats).map(([segment, stats]) => ({
    segment,
    count: stats.count,
    totalValue: stats.value,
    trend: Math.random() * 20 - 10 // Random trend for demo
  }));
  
  // Customer lifecycle funnel
  const customerLifecycle = [
    { stage: 'Prospect', count: Math.floor(totalCustomers * 1.5) },
    { stage: 'New Customer', count: newCustomers },
    { stage: 'Active', count: activeCustomers },
    { stage: 'Loyal', count: Math.floor(activeCustomers * 0.4) },
    { stage: 'At Risk', count: safeCustomers.filter(c => c?.segment === 'At Risk').length },
    { stage: 'Churned', count: churnedCustomers }
  ];
  
  // VIP customers (Champions + high balance)
  const vipCustomers = safeCustomers.filter(c => 
    c?.segment === 'Champions' && (c?.balance || 0) > avgBalance * 2
  ).length;
  const vipAUM = safeCustomers
    .filter(c => c?.segment === 'Champions' && (c?.balance || 0) > avgBalance * 2)
    .reduce((sum, c) => sum + (c?.balance || 0), 0);
  
  // Predictive insights
  const avgMonthlyRevenue = revenueTrend.slice(-3).reduce((s, m) => s + m.revenue, 0) / 3;
  const forecastRevenue = avgMonthlyRevenue * 1.08; // 8% growth forecast
  const forecastConfidence = 78; // Mock confidence
  
  const churnRiskCustomers = safeCustomers.filter(c => 
    c?.segment === 'At Risk' && (c?.balance || 0) > avgBalance
  ).length;
  const churnRiskValue = safeCustomers
    .filter(c => c?.segment === 'At Risk' && (c?.balance || 0) > avgBalance)
    .reduce((sum, c) => sum + (c?.balance || 0), 0);
  
  const crossSellOpportunities = safeCustomers.filter(c => 
    (c?.products?.length || 0) < 2 && (c?.balance || 0) > avgBalance * 1.5
  ).length;
  const crossSellPotential = crossSellOpportunities * avgBalance * 0.1; // 10% potential revenue
  
  const bestPractices = [
    { description: 'Personalized WhatsApp campaigns increased conversion by', impact: 23 },
    { description: 'Early churn detection reduced customer loss by', impact: 18 },
    { description: 'Cross-sell recommendations boosted product penetration by', impact: 15 }
  ];
  
  return {
    totalRevenue,
    revenueTarget,
    revenueChange: 12.4,
    revenuePreviousPeriod: totalRevenue / 1.124,
    
    totalCustomers,
    newCustomers,
    activeCustomers,
    churnedCustomers,
    customerGrowth: 3.6,
    
    totalAUM: totalBalance,
    aumChange: 8.2,
    aumTrend,
    
    avgProductsPerCustomer: avgProducts,
    penetrationChange: 0.3,
    penetrationTarget: 3.5,
    
    healthScores: {
      revenue: Math.round(revenueHealth),
      customer: Math.round(customerHealth),
      operations: operationsHealth,
      team: teamHealth
    },
    
    revenueVsTarget: (totalRevenue / revenueTarget) * 100,
    revenueGrowth: 12.4,
    revenuePerCustomer: totalRevenue / totalCustomers,
    
    churnRate: (churnedCustomers / totalCustomers) * 100,
    nps: 45,
    csat: 82,
    
    slaCompliance: 94.5,
    avgResponseTime: 12,
    resolutionRate: 89,
    
    teamProductivity: 88,
    targetAchievement: 92,
    engagement: 78,
    
    criticalAlerts: alerts,
    
    // New analytics data
    revenueTrend,
    revenueByProduct,
    revenueBySegment,
    
    rfmDistribution,
    customerLifecycle,
    vipCustomers,
    vipAUM,
    vipPercentage: (vipCustomers / totalCustomers) * 100,
    
    forecastRevenue,
    forecastConfidence,
    quarterTarget: revenueTarget * 3,
    churnRiskCustomers,
    churnRiskValue,
    crossSellOpportunities,
    crossSellPotential,
    bestPractices
  };
}
