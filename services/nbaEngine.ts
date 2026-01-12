/**
 * NBA Engine - Next Best Action Recommendation System
 * 
 * Generates personalized action recommendations for each customer
 * based on their profile, behavior, and product holdings.
 * 
 * Based on OJK regulations and Bank Sumut product offerings.
 */

import type { User, RFMSegment } from '../types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ReasoningFactor {
  icon: string;
  label: string;
  weight: number; // 0-100
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface NextBestAction {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  expectedRevenue: number; // IDR per year
  channels: ('Phone Call' | 'Email' | 'WhatsApp' | 'Branch Visit' | 'Mobile App' | 'Push')[];
  shortReason: string;
  reasoningFactors: ReasoningFactor[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'UPSELL' | 'CROSS_SELL' | 'RETENTION' | 'ACTIVATION' | 'SERVICE';
  historicalConversionRate?: number; // Mock for demo
}

export interface NBARule {
  id: string;
  type: string;
  condition: (customer: User) => boolean;
  generate: (customer: User) => Omit<NextBestAction, 'id'>;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const daysDiff = (date1: Date, date2: Date): number => {
  return Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
};

const hasProduct = (customer: User, product: string): boolean => {
  // Mock product check based on account status and segment
  const mockProducts: Record<string, string[]> = {
    'Premium': ['Tabungan Prioritas', 'Kartu Kredit Gold'],
    'Active': ['Tabungan Reguler', 'Mobile Banking'],
    'New': ['Tabungan Reguler'],
    'Dormant': ['Tabungan Reguler'],
  };
  return mockProducts[customer.accountStatus || 'Active']?.includes(product) || false;
};

const getCustomerAge = (customer: User): number => {
  return customer.age || 30; // Default age if not specified
};

const getRecentTransactionCount = (customer: User, days: number): number => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return customer.transactions.filter(t => new Date(t.date) >= cutoff).length;
};

const getTotalSpendByCategory = (customer: User, category: string): number => {
  return customer.transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
};

const hasUtilityBills = (customer: User): boolean => {
  return customer.transactions.some(t => 
    t.category === 'Utilities' || t.category === 'Recurring Bills'
  );
};

// ============================================================================
// NBA RULES - 12 Total
// ============================================================================

export const NBA_RULES: NBARule[] = [
  // ============================================================================
  // RULE 1: Priority Banking Upgrade
  // ============================================================================
  {
    id: 'PRIORITY_UPGRADE',
    type: 'PRIORITY_UPGRADE',
    condition: (c) => 
      c.segment === 'Champions' && 
      c.balance > 100000000 && 
      c.accountStatus !== 'Premium',
    generate: (c) => ({
      type: 'PRIORITY_UPGRADE',
      title: 'Upgrade ke Priority Banking',
      description: 'Nasabah memenuhi syarat untuk layanan Priority Banking dengan benefit eksklusif.',
      confidence: 92,
      expectedRevenue: 5000000,
      channels: ['Phone Call', 'Email', 'Branch Visit'],
      shortReason: `RFM Champion dengan saldo ${formatCurrency(c.balance)} - kandidat ideal Priority.`,
      reasoningFactors: [
        { icon: '⭐', label: 'Champion segment', weight: 30, impact: 'POSITIVE' },
        { icon: '💰', label: `Balance >100jt (${formatCurrency(c.balance)})`, weight: 35, impact: 'POSITIVE' },
        { icon: '📆', label: 'Customer aktif >12 bulan', weight: 20, impact: 'POSITIVE' },
        { icon: '🎯', label: 'Belum memiliki Priority status', weight: 15, impact: 'POSITIVE' }
      ],
      priority: 'HIGH',
      category: 'UPSELL',
      historicalConversionRate: 65
    })
  },

  // ============================================================================
  // RULE 2: Deposito Cross-sell
  // ============================================================================
  {
    id: 'DEPOSITO_CROSS_SELL',
    type: 'DEPOSITO_CROSS_SELL',
    condition: (c) => 
      c.balance > 50000000 && 
      getRecentTransactionCount(c, 90) < 10,
    generate: (c) => ({
      type: 'DEPOSITO_CROSS_SELL',
      title: 'Tawarkan Deposito Berjangka',
      description: 'Saldo idle besar dengan aktivitas rendah - cocok untuk deposito.',
      confidence: 85,
      expectedRevenue: 2500000,
      channels: ['Phone Call', 'Email'],
      shortReason: `Saldo ${formatCurrency(c.balance)} dengan <10 transaksi dalam 3 bulan terakhir.`,
      reasoningFactors: [
        { icon: '💰', label: `Saldo idle >50jt (${formatCurrency(c.balance)})`, weight: 45, impact: 'POSITIVE' },
        { icon: '😴', label: 'Aktivitas transaksi rendah', weight: 35, impact: 'POSITIVE' },
        { icon: '📈', label: 'Opportunity cost dana menganggur', weight: 20, impact: 'POSITIVE' }
      ],
      priority: 'MEDIUM',
      category: 'CROSS_SELL',
      historicalConversionRate: 52
    })
  },

  // ============================================================================
  // RULE 3: Credit Card Cross-sell
  // ============================================================================
  {
    id: 'CREDIT_CARD_CROSS_SELL',
    type: 'CREDIT_CARD_CROSS_SELL',
    condition: (c) => {
      const fnbSpend = getTotalSpendByCategory(c, 'F&B');
      const shoppingSpend = getTotalSpendByCategory(c, 'Shopping');
      return (fnbSpend + shoppingSpend) > 2000000 && 
             c.segment !== 'Hibernating' &&
             c.segment !== 'At Risk';
    },
    generate: (c) => {
      const fnbSpend = getTotalSpendByCategory(c, 'F&B');
      const shoppingSpend = getTotalSpendByCategory(c, 'Shopping');
      return {
        type: 'CREDIT_CARD_CROSS_SELL',
        title: 'Cross-sell Kartu Kredit',
        description: 'High spender di kategori lifestyle - cocok untuk kartu kredit dengan rewards.',
        confidence: 70,
        expectedRevenue: 1800000,
        channels: ['Phone Call', 'Email', 'WhatsApp'],
        shortReason: `Spending F&B + Shopping: ${formatCurrency(fnbSpend + shoppingSpend)} - potensi CC rewards.`,
        reasoningFactors: [
          { icon: '🍽️', label: `High F&B spend (${formatCurrency(fnbSpend)})`, weight: 35, impact: 'POSITIVE' },
          { icon: '🛍️', label: `High shopping spend (${formatCurrency(shoppingSpend)})`, weight: 35, impact: 'POSITIVE' },
          { icon: '⭐', label: 'Active customer segment', weight: 30, impact: 'POSITIVE' }
        ],
        priority: 'MEDIUM',
        category: 'CROSS_SELL',
        historicalConversionRate: 45
      };
    }
  },

  // ============================================================================
  // RULE 4: Winback Campaign
  // ============================================================================
  {
    id: 'WINBACK_CAMPAIGN',
    type: 'WINBACK_CAMPAIGN',
    condition: (c) => 
      c.segment === 'At Risk' || c.segment === 'Hibernating',
    generate: (c) => ({
      type: 'WINBACK_CAMPAIGN',
      title: 'Winback Campaign - Reaktivasi Nasabah',
      description: 'Nasabah berisiko churn - perlu campaign reaktivasi segera.',
      confidence: 88,
      expectedRevenue: 1000000,
      channels: ['WhatsApp', 'Email', 'Push'],
      shortReason: `Segment ${c.segment} - risiko churn tinggi, perlu immediate action.`,
      reasoningFactors: [
        { icon: '⚠️', label: `Segment: ${c.segment}`, weight: 50, impact: 'NEGATIVE' },
        { icon: '📉', label: 'Aktivitas menurun drastis', weight: 30, impact: 'NEGATIVE' },
        { icon: '💔', label: 'Risiko kehilangan nasabah', weight: 20, impact: 'NEGATIVE' }
      ],
      priority: 'HIGH',
      category: 'RETENTION',
      historicalConversionRate: 35
    })
  },

  // ============================================================================
  // RULE 5: Onboarding Campaign (New Customers)
  // ============================================================================
  {
    id: 'ONBOARDING_CAMPAIGN',
    type: 'ONBOARDING_CAMPAIGN',
    condition: (c) => {
      if (!c.accountCreatedDate) return false;
      const daysSinceCreated = daysDiff(new Date(), new Date(c.accountCreatedDate));
      return daysSinceCreated <= 90 && c.transactions.length < 5;
    },
    generate: (c) => ({
      type: 'ONBOARDING_CAMPAIGN',
      title: 'Onboarding & Edukasi Nasabah Baru',
      description: 'Nasabah baru dengan engagement rendah - perlu edukasi fitur.',
      confidence: 82,
      expectedRevenue: 500000,
      channels: ['Push', 'Email', 'WhatsApp'],
      shortReason: 'Nasabah baru (<90 hari) dengan <5 transaksi - bantu onboarding.',
      reasoningFactors: [
        { icon: '🆕', label: 'Nasabah baru (<90 hari)', weight: 40, impact: 'POSITIVE' },
        { icon: '📊', label: `Hanya ${c.transactions.length} transaksi`, weight: 35, impact: 'NEGATIVE' },
        { icon: '📱', label: 'Belum optimal gunakan fitur', weight: 25, impact: 'NEGATIVE' }
      ],
      priority: 'MEDIUM',
      category: 'ACTIVATION',
      historicalConversionRate: 60
    })
  },

  // ============================================================================
  // RULE 6: Auto-Debit Utility
  // ============================================================================
  {
    id: 'AUTO_DEBIT_UTILITY',
    type: 'AUTO_DEBIT_UTILITY',
    condition: (c) => 
      (c.segment === 'Loyal' || c.segment === 'Champions') && 
      hasUtilityBills(c),
    generate: (c) => ({
      type: 'AUTO_DEBIT_UTILITY',
      title: 'Aktivasi Auto-Debit Tagihan',
      description: 'Nasabah loyal dengan tagihan rutin - tawarkan auto-debit untuk convenience.',
      confidence: 78,
      expectedRevenue: 300000,
      channels: ['Mobile App', 'Email'],
      shortReason: 'Nasabah loyal dengan pembayaran utility rutin - ideal untuk auto-debit.',
      reasoningFactors: [
        { icon: '⭐', label: `Segment: ${c.segment}`, weight: 35, impact: 'POSITIVE' },
        { icon: '💡', label: 'Bayar tagihan rutin (utility)', weight: 40, impact: 'POSITIVE' },
        { icon: '🔄', label: 'Potensi recurring transaction', weight: 25, impact: 'POSITIVE' }
      ],
      priority: 'LOW',
      category: 'SERVICE',
      historicalConversionRate: 55
    })
  },

  // ============================================================================
  // RULE 7: KPR/Home Loan (Bank Sumut Specific)
  // ============================================================================
  {
    id: 'HOME_LOAN_KPR',
    type: 'HOME_LOAN_KPR',
    condition: (c) => {
      const age = getCustomerAge(c);
      return age >= 25 && age <= 45 && 
             c.balance > 50000000 && 
             c.segment !== 'Hibernating' &&
             c.segment !== 'At Risk';
    },
    generate: (c) => ({
      type: 'HOME_LOAN_KPR',
      title: 'Tawarkan KPR (Kredit Pemilikan Rumah)',
      description: 'Usia produktif dengan kemampuan finansial untuk down payment rumah.',
      confidence: 75,
      expectedRevenue: 15000000,
      channels: ['Phone Call', 'Branch Visit', 'WhatsApp'],
      shortReason: `Usia ${getCustomerAge(c)} tahun dengan saldo ${formatCurrency(c.balance)} - prime untuk KPR.`,
      reasoningFactors: [
        { icon: '🏠', label: `Prime home-buying age (${getCustomerAge(c)} thn)`, weight: 30, impact: 'POSITIVE' },
        { icon: '💰', label: `Balance >50jt (DP ready)`, weight: 40, impact: 'POSITIVE' },
        { icon: '⭐', label: `Active customer (${c.segment})`, weight: 30, impact: 'POSITIVE' }
      ],
      priority: 'HIGH',
      category: 'CROSS_SELL',
      historicalConversionRate: 25
    })
  },

  // ============================================================================
  // RULE 8: Insurance Cross-sell
  // ============================================================================
  {
    id: 'INSURANCE_CROSS_SELL',
    type: 'INSURANCE_CROSS_SELL',
    condition: (c) => 
      c.balance > 20000000 || c.segment === 'Champions' || c.segment === 'Loyal',
    generate: (c) => ({
      type: 'INSURANCE_CROSS_SELL',
      title: 'Cross-sell Asuransi Jiwa/Kesehatan',
      description: 'Nasabah dengan profil finansial stabil - tawarkan proteksi asuransi.',
      confidence: 72,
      expectedRevenue: 3000000,
      channels: ['Phone Call', 'Branch Visit'],
      shortReason: 'Profil finansial stabil - awareness rendah terhadap proteksi asuransi.',
      reasoningFactors: [
        { icon: '💰', label: `Financially stable (${formatCurrency(c.balance)})`, weight: 40, impact: 'POSITIVE' },
        { icon: '🛡️', label: 'Belum memiliki proteksi asuransi', weight: 35, impact: 'POSITIVE' },
        { icon: '👨‍👩‍👧', label: 'Usia produktif dengan tanggungan', weight: 25, impact: 'POSITIVE' }
      ],
      priority: 'MEDIUM',
      category: 'CROSS_SELL',
      historicalConversionRate: 30
    })
  },

  // ============================================================================
  // RULE 9: Digital Activation
  // ============================================================================
  {
    id: 'DIGITAL_ACTIVATION',
    type: 'DIGITAL_ACTIVATION',
    condition: (c) => {
      const age = getCustomerAge(c);
      // Assume low digital if preferredChannel is Branch/ATM
      const isLowDigital = c.preferredChannel === 'Branch' || c.preferredChannel === 'ATM';
      return isLowDigital && age < 55;
    },
    generate: (c) => ({
      type: 'DIGITAL_ACTIVATION',
      title: 'Aktivasi & Edukasi Mobile Banking',
      description: 'Nasabah masih prefer channel tradisional - bantu migrasi ke digital.',
      confidence: 68,
      expectedRevenue: 0, // Cost saving, not revenue
      channels: ['Branch Visit', 'WhatsApp', 'Phone Call'],
      shortReason: `Prefer ${c.preferredChannel} padahal usia ${getCustomerAge(c)} - potensial digital.`,
      reasoningFactors: [
        { icon: '📱', label: `Digital-capable age (${getCustomerAge(c)} thn)`, weight: 35, impact: 'POSITIVE' },
        { icon: '🏦', label: `Prefer ${c.preferredChannel} (traditional)`, weight: 40, impact: 'NEGATIVE' },
        { icon: '💡', label: 'Cost saving through digital migration', weight: 25, impact: 'POSITIVE' }
      ],
      priority: 'LOW',
      category: 'ACTIVATION',
      historicalConversionRate: 45
    })
  },

  // ============================================================================
  // RULE 10: Retirement Planning
  // ============================================================================
  {
    id: 'RETIREMENT_PLANNING',
    type: 'RETIREMENT_PLANNING',
    condition: (c) => {
      const age = getCustomerAge(c);
      return age >= 50 && age <= 60 && c.balance > 100000000;
    },
    generate: (c) => ({
      type: 'RETIREMENT_PLANNING',
      title: 'Tawarkan Rencana Pensiun & Wealth Management',
      description: 'Pre-retirement customer dengan aset substansial - butuh perencanaan.',
      confidence: 85,
      expectedRevenue: 10000000,
      channels: ['Phone Call', 'Branch Visit'],
      shortReason: `Usia ${getCustomerAge(c)} dengan aset ${formatCurrency(c.balance)} - perlu retirement planning.`,
      reasoningFactors: [
        { icon: '👴', label: `Pre-retirement age (${getCustomerAge(c)} thn)`, weight: 35, impact: 'POSITIVE' },
        { icon: '💰', label: `High balance (${formatCurrency(c.balance)})`, weight: 40, impact: 'POSITIVE' },
        { icon: '📊', label: 'Belum punya produk pensiun', weight: 25, impact: 'POSITIVE' }
      ],
      priority: 'HIGH',
      category: 'CROSS_SELL',
      historicalConversionRate: 40
    })
  },

  // ============================================================================
  // RULE 11: Student Account Upgrade
  // ============================================================================
  {
    id: 'STUDENT_UPGRADE',
    type: 'STUDENT_UPGRADE',
    condition: (c) => {
      const age = getCustomerAge(c);
      // Gen Z who just turned adult
      return age >= 18 && age <= 22 && c.accountStatus === 'Active';
    },
    generate: (c) => ({
      type: 'STUDENT_UPGRADE',
      title: 'Upgrade ke Tabungan Reguler + Debit',
      description: 'Gen Z yang baru dewasa - upgrade dari tabungan pelajar.',
      confidence: 90,
      expectedRevenue: 500000,
      channels: ['Mobile App', 'WhatsApp', 'Push'],
      shortReason: `Usia ${getCustomerAge(c)} - sudah dewasa, upgrade ke produk reguler.`,
      reasoningFactors: [
        { icon: '🎓', label: 'Potensi eks tabungan pelajar', weight: 40, impact: 'POSITIVE' },
        { icon: '🎂', label: `Adult age (${getCustomerAge(c)} thn)`, weight: 45, impact: 'POSITIVE' },
        { icon: '📱', label: 'Digital native - prefer mobile', weight: 15, impact: 'POSITIVE' }
      ],
      priority: 'MEDIUM',
      category: 'UPSELL',
      historicalConversionRate: 70
    })
  },

  // ============================================================================
  // RULE 12: Idle Cash Optimization
  // ============================================================================
  {
    id: 'IDLE_CASH_OPTIMIZATION',
    type: 'IDLE_CASH_OPTIMIZATION',
    condition: (c) => 
      c.balance > 100000000 && getRecentTransactionCount(c, 90) < 5,
    generate: (c) => ({
      type: 'IDLE_CASH_OPTIMIZATION',
      title: 'Optimasi Dana Idle - Deposito/Reksa Dana',
      description: 'Dana besar mengendap tanpa aktivitas - opportunity cost tinggi.',
      confidence: 80,
      expectedRevenue: 4000000,
      channels: ['Phone Call', 'Email'],
      shortReason: `${formatCurrency(c.balance)} idle dengan hanya ${getRecentTransactionCount(c, 90)} transaksi dalam 3 bulan.`,
      reasoningFactors: [
        { icon: '💰', label: `High idle balance (${formatCurrency(c.balance)})`, weight: 50, impact: 'POSITIVE' },
        { icon: '😴', label: `Low activity (${getRecentTransactionCount(c, 90)} txn/3mo)`, weight: 30, impact: 'POSITIVE' },
        { icon: '📈', label: 'Missing investment opportunity', weight: 20, impact: 'POSITIVE' }
      ],
      priority: 'HIGH',
      category: 'CROSS_SELL',
      historicalConversionRate: 48
    })
  }
];

// ============================================================================
// MAIN NBA GENERATION FUNCTION
// ============================================================================

/**
 * Generate Next Best Actions for a customer
 * Returns top N actions sorted by priority and confidence
 */
export function generateNBAs(customer: User, maxActions: number = 3): NextBestAction[] {
  const matchingNBAs: NextBestAction[] = [];
  
  for (const rule of NBA_RULES) {
    try {
      if (rule.condition(customer)) {
        const nba = rule.generate(customer);
        matchingNBAs.push({
          id: `nba-${rule.id}-${customer.id}`,
          ...nba
        });
      }
    } catch (error) {
      console.warn(`Rule ${rule.id} failed for customer ${customer.id}:`, error);
    }
  }
  
  // Sort by priority (HIGH > MEDIUM > LOW) then by confidence
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  
  return matchingNBAs
    .sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    })
    .slice(0, maxActions);
}

/**
 * Get all NBAs for a customer (without limit)
 */
export function getAllNBAs(customer: User): NextBestAction[] {
  return generateNBAs(customer, 100);
}

/**
 * Get NBA statistics across all customers
 */
export function getNBAStats(customers: User[]): Record<string, { count: number; totalRevenue: number }> {
  const stats: Record<string, { count: number; totalRevenue: number }> = {};
  
  for (const customer of customers) {
    const nbas = getAllNBAs(customer);
    for (const nba of nbas) {
      if (!stats[nba.type]) {
        stats[nba.type] = { count: 0, totalRevenue: 0 };
      }
      stats[nba.type].count++;
      stats[nba.type].totalRevenue += nba.expectedRevenue;
    }
  }
  
  return stats;
}

// ============================================================================
// UTILITY
// ============================================================================

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  } else if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}
