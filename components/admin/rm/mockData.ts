import { Deal, Lead, Opportunity, ScoredLead, UrgentAction, User } from '../../types';

// Helper to generate dates
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

// Mock Users for RM Portfolio
export const MOCK_RM_CUSTOMERS: User[] = [
  {
    id: 'cust-001',
    name: 'Budi Santoso',
    accountNumber: '1122334455',
    balance: 150000000,
    segment: 'Champions',
    lastContact: daysFromNow(-2),
    products: ['Deposito', 'KPR'],
    riskProfile: 'Medium',
    rfm: { recency: 5, frequency: 5, monetary: 5, score: 125, segment: 'Champions' }
  },
  {
    id: 'cust-002',
    name: 'Siti Aminah',
    accountNumber: '2233445566',
    balance: 55000000,
    segment: 'Loyal Customers',
    lastContact: daysFromNow(-15),
    products: ['Tabungan'],
    riskProfile: 'Low',
    rfm: { recency: 4, frequency: 4, monetary: 4, score: 64, segment: 'Loyal Customers' }
  },
  {
    id: 'cust-003',
    name: 'Rudi Hermawan',
    accountNumber: '3344556677',
    balance: 5000000000,
    segment: 'Champions',
    lastContact: daysFromNow(-5),
    products: ['Prioritas', 'Obligasi', 'Deposito'],
    riskProfile: 'High',
    rfm: { recency: 5, frequency: 5, monetary: 5, score: 125, segment: 'Champions' }
  },
  {
    id: 'cust-004',
    name: 'Dewi Sartika',
    accountNumber: '4455667788',
    balance: 25000000,
    segment: 'Potential Loyalists',
    lastContact: daysFromNow(-45),
    products: ['Tabungan'],
    riskProfile: 'Low',
    rfm: { recency: 3, frequency: 3, monetary: 3, score: 27, segment: 'Potential Loyalists' }
  },
  {
    id: 'cust-005',
    name: 'Andi Wijaya',
    accountNumber: '5566778899',
    balance: 12000000,
    segment: 'At Risk',
    lastContact: daysFromNow(-60),
    products: ['Kredit Mikro'],
    riskProfile: 'Medium',
    rfm: { recency: 2, frequency: 2, monetary: 2, score: 8, segment: 'At Risk' }
  }
];

// Mock Deals
export const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-001',
    customerId: 'cust-003',
    customer: MOCK_RM_CUSTOMERS[2],
    name: 'Top Up Deposito 5M',
    product: 'Deposito',
    value: 5000000000,
    stage: 'NEGOTIATION',
    probability: 70,
    expectedCloseDate: daysFromNow(5),
    lastActivity: daysFromNow(-1),
    isHot: true
  },
  {
    id: 'deal-002',
    customerId: 'cust-001',
    customer: MOCK_RM_CUSTOMERS[0],
    name: 'KPR Rumah Kedua',
    product: 'KPR',
    value: 850000000,
    stage: 'PROPOSAL',
    probability: 40,
    expectedCloseDate: daysFromNow(20),
    lastActivity: daysFromNow(-3)
  },
  {
    id: 'deal-003',
    customerId: 'cust-002',
    customer: MOCK_RM_CUSTOMERS[1],
    name: 'Asuransi Pendidikan',
    product: 'Bancassurance',
    value: 50000000,
    stage: 'QUALIFIED',
    probability: 20,
    expectedCloseDate: daysFromNow(45),
    lastActivity: daysFromNow(-10)
  }
];

// Mock Urgent Actions
export const MOCK_URGENT_ACTIONS: UrgentAction[] = [
  {
    id: 'act-001',
    title: 'Konfirmasi Deposito Jatuh Tempo',
    description: 'Deposito Rp 5M milik Pak Rudi akan jatuh tempo besok. Segera hubungi untuk perpanjangan.',
    type: 'DEADLINE',
    priority: 'URGENT',
    deadline: daysFromNow(1),
    customerId: 'cust-003',
    customer: MOCK_RM_CUSTOMERS[2],
    dealValue: 5000000000,
    actionLabel: 'Hubungi Pak Rudi'
  },
  {
    id: 'act-002',
    title: 'Dokumen KPR Belum Lengkap',
    description: 'KPR Budi Santoso tertahan di Credit Approval karena kurang slip gaji terbaru.',
    type: 'COMPLIANCE',
    priority: 'HIGH',
    deadline: daysFromNow(2),
    customerId: 'cust-001',
    customer: MOCK_RM_CUSTOMERS[0],
    actionLabel: 'Request Dokumen'
  }
];

// Mock Opportunities
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    customerId: 'cust-003',
    customer: MOCK_RM_CUSTOMERS[2],
    createdAt: daysFromNow(-1),
    status: 'NEW',
    nba: {
      title: 'Upgrade ke Kartu Kredit Infinite',
      shortReason: 'Spending bulanan > 50jt & sering travel ke luar negeri',
      expectedRevenue: 3000000,
      confidence: 95,
      type: 'UPSELL'
    }
  },
  {
    id: 'opp-002',
    customerId: 'cust-005',
    customer: MOCK_RM_CUSTOMERS[4],
    createdAt: daysFromNow(-2),
    status: 'NEW',
    nba: {
      title: 'Restrukturisasi Kredit Mikro',
      shortReason: 'Terdeteksi penurunan cashflow usaha, tawarkan restrukturisasi preventif',
      expectedRevenue: 0, // Retention value
      confidence: 80,
      type: 'RETENTION'
    }
  }
];

// Mock Scored Leads
export const MOCK_SCORED_LEADS: ScoredLead[] = [
  {
    id: 'lead-001',
    customerId: 'cust-004',
    customer: MOCK_RM_CUSTOMERS[3],
    source: 'CAMPAIGN',
    interestLevel: 8,
    lastContactDate: daysFromNow(-5),
    status: 'NEW',
    score: 85,
    temperature: 'HOT',
    scoreFactors: { balance: 10, engagement: 20, recency: 25 },
    nba: {
      title: 'Pembukaan Deposito Valas',
      shortReason: 'Respon positif pada campaign Valas USD',
      expectedRevenue: 10000000, // spread
      confidence: 85,
      type: 'CROSS_SELL'
    }
  },
  {
    id: 'lead-002',
    customerId: 'cust-005',
    customer: MOCK_RM_CUSTOMERS[4],
    source: 'INBOUND',
    interestLevel: 5,
    lastContactDate: daysFromNow(-1),
    status: 'CONTACTED',
    score: 45,
    temperature: 'WARM',
    scoreFactors: { balance: 5, engagement: 15, recency: 10 },
    nba: {
      title: 'Top Up Kredit Modal Kerja',
      shortReason: 'Bertanya tentang limit tambahan via CS',
      expectedRevenue: 5000000,
      confidence: 60,
      type: 'CROSS_SELL'
    }
  }
];
