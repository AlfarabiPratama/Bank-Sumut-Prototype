import { Transaction } from '../types';

export interface TransferAnalytics {
  intraBankCount: number;
  interBankCount: number;
  topUpCount: number;
  transferOutCount: number;
  avgTopUp: number;
  avgTransferOut: number;
  transferPersona: 'Loyal Bank Sumut User' | 'Multi-Bank User' | 'Balanced User' | 'No Transfer Activity';
  insights: {
    loyaltyScore: number; // 0-100%
    crossBankExposure: 'High' | 'Medium' | 'Low';
    topUpFrequency: 'Frequent' | 'Occasional' | 'Rare';
    churnRisk: 'High' | 'Medium' | 'Low';
  };
  recommendations: string[];
}

export function analyzeTransferBehavior(transactions: Transaction[]): TransferAnalytics {
  // Filter transfers only
  const transfers = transactions.filter(t => t.category === 'Transfer');
  
  if (transfers.length === 0) {
    return {
      intraBankCount: 0,
      interBankCount: 0,
      topUpCount: 0,
      transferOutCount: 0,
      avgTopUp: 0,
      avgTransferOut: 0,
      transferPersona: 'No Transfer Activity',
      insights: {
        loyaltyScore: 50,
        crossBankExposure: 'Low',
        topUpFrequency: 'Rare',
        churnRisk: 'Low'
      },
      recommendations: ['💡 Encourage digital banking usage with transfer promotions']
    };
  }
  
  // Count by type and method
  const intraBankCount = transfers.filter(t => t.transferMethod === 'intra_bank').length;
  const interBankCount = transfers.filter(t => t.transferMethod === 'inter_bank').length;
  const topUpCount = transfers.filter(t => t.transferType === 'top_up').length;
  const transferOutCount = transfers.filter(t => t.transferType === 'transfer_out').length;
  
  // Calculate averages
  const topUps = transfers.filter(t => t.transferType === 'top_up' && t.amount > 0);
  const avgTopUp = topUps.length > 0
    ? topUps.reduce((sum, t) => sum + t.amount, 0) / topUps.length
    : 0;
  
  const transfersOut = transfers.filter(t => t.transferType === 'transfer_out');
  const avgTransferOut = transfersOut.length > 0
    ? transfersOut.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transfersOut.length
    : 0;
  
  // Calculate loyalty score
  const totalOutgoing = intraBankCount + interBankCount;
  const loyaltyScore = totalOutgoing > 0 
    ? (intraBankCount / totalOutgoing) * 100 
    : 50;
  
  // Determine persona
  const transferPersona = 
    loyaltyScore > 70 ? 'Loyal Bank Sumut User' :
    loyaltyScore < 40 ? 'Multi-Bank User' :
    'Balanced User';
  
  // Assess cross-bank exposure
  const crossBankExposure: 'High' | 'Medium' | 'Low' = 
    interBankCount > 10 ? 'High' :
    interBankCount > 5 ? 'Medium' :
    'Low';
  
  // Top-up frequency
  const topUpFrequency: 'Frequent' | 'Occasional' | 'Rare' =
    topUpCount > 4 ? 'Frequent' :
    topUpCount > 2 ? 'Occasional' :
    'Rare';
  
  // Churn risk assessment
  const churnRisk: 'High' | 'Medium' | 'Low' =
    loyaltyScore < 30 && crossBankExposure === 'High' ? 'High' :
    loyaltyScore < 50 && crossBankExposure !== 'Low' ? 'Medium' :
    'Low';
  
  // Generate CRM recommendations
  const recommendations: string[] = [];
  
  if (loyaltyScore > 70 && intraBankCount > 5) {
    recommendations.push('✅ Loyal ecosystem user - Ideal candidate for VIP services');
    recommendations.push('✅ Offer family banking package with bundled benefits');
    recommendations.push('✅ Consider payroll partnership opportunities');
  } else if (loyaltyScore < 40 && interBankCount > 5) {
    recommendations.push('⚠️ High competitor exposure - Immediate retention action needed');
    recommendations.push('💡 Offer free inter-bank transfer promo (10x/month)');
    recommendations.push('💡 Personal outreach from relationship manager');
  } else if (loyaltyScore >= 40 && loyaltyScore <= 70) {
    recommendations.push('💡 Balanced user - Opportunity to increase loyalty');
    recommendations.push('💡 Promote intra-bank benefits (zero fees, instant transfer)');
  }
  
  if (topUpFrequency === 'Frequent' && topUpCount > 0) {
    recommendations.push('✅ Regular top-ups detected - Suggest auto-debit payroll');
  }
  
  if (churnRisk === 'High') {
    recommendations.push('🚨 HIGH CHURN RISK - Activate win-back campaign immediately');
  }
  
  return {
    intraBankCount,
    interBankCount,
    topUpCount,
    transferOutCount,
    avgTopUp,
    avgTransferOut,
    transferPersona,
    insights: {
      loyaltyScore,
      crossBankExposure,
      topUpFrequency,
      churnRisk
    },
    recommendations
  };
}
