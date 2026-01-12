import { User, Transaction, CampaignInteraction, BehaviorAnalytics, EngagementMetrics, Customer360Profile, UtilityAnalytics } from '../types';

/**
 * Calculate average transaction amount
 */
export const calculateAverageTransaction = (transactions: Transaction[]): number => {
  if (!transactions || transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return Math.round(total / transactions.length);
};

/**
 * Calculate total transaction volume
 */
export const calculateTotalVolume = (transactions: Transaction[]): number => {
  if (!transactions || transactions.length === 0) return 0;
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Get dominant transaction category
 */
export const getDominantCategory = (transactions: Transaction[]): string => {
  if (!transactions || transactions.length === 0) return 'N/A';
  
  const categoryCounts: Record<string, number> = {};
  transactions.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  
  let maxCategory = 'N/A';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  });
  
  return maxCategory;
};

/**
 * Calculate transaction frequency (transactions per month)
 */
export const calculateTransactionFrequency = (transactions: Transaction[]): number => {
  if (!transactions || transactions.length === 0) return 0;
  
  // Calculate date range in months
  const dates = transactions.map(t => new Date(t.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const monthsDiff = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24 * 30));
  
  return Math.round(transactions.length / monthsDiff);
};

/**
 * Get last transaction date
 */
export const getLastTransactionDate = (transactions: Transaction[]): string => {
  if (!transactions || transactions.length === 0) return 'N/A';
  
  const dates = transactions.map(t => new Date(t.date));
  const lastDate = new Date(Math.max(...dates.map(d => d.getTime())));
  return lastDate.toISOString().split('T')[0];
};

/**
 * Calculate behavior analytics
 */
export const calculateBehaviorAnalytics = (user: User): BehaviorAnalytics => {
  return {
    averageTransactionAmount: calculateAverageTransaction(user.transactions),
    totalTransactionVolume: calculateTotalVolume(user.transactions),
    dominantCategory: getDominantCategory(user.transactions),
    transactionFrequency: calculateTransactionFrequency(user.transactions),
    lastTransactionDate: getLastTransactionDate(user.transactions),
  };
};

/**
 * Calculate engagement consistency score (0-100)
 * Based on level progression, badge completion, and XP
 */
export const calculateEngagementScore = (user: User): number => {
  // Level score (max 40 points, assuming max level is 50)
  const levelScore = Math.min(40, (user.level / 50) * 40);
  
  // Badge completion score (max 30 points)
  const earnedBadges = user.badges.filter(b => b.unlocked).length;
  const totalBadges = user.badges.length;
  const badgeScore = totalBadges > 0 ? (earnedBadges / totalBadges) * 30 : 0;
  
  // XP score (max 30 points)
  const xpScore = Math.min(30, (user.xp / 100) * 30);
  
  return Math.round(levelScore + badgeScore + xpScore);
};

/**
 * Calculate engagement metrics
 */
export const calculateEngagementMetrics = (user: User): EngagementMetrics => {
  const earnedBadges = user.badges.filter(b => b.unlocked).length;
  const totalBadges = user.badges.length;
  
  // Estimate days active based on level (rough approximation)
  const daysActive = user.level * 3; // Assume ~3 days per level
  
  return {
    consistencyScore: calculateEngagementScore(user),
    badgesEarned: earnedBadges,
    totalBadges: totalBadges,
    badgeCompletionRate: totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0,
    daysActive,
    lastActiveDate: getLastTransactionDate(user.transactions),
  };
};

/**
 * Calculate campaign response metrics
 */
export const calculateCampaignMetrics = (campaignHistory?: CampaignInteraction[]) => {
  if (!campaignHistory || campaignHistory.length === 0) {
    return {
      responseRate: 0,
      totalReceived: 0,
      totalConversions: 0,
    };
  }
  
  const totalReceived = campaignHistory.length;
  const responded = campaignHistory.filter(c => c.interactionType !== 'ignore').length;
  const conversions = campaignHistory.filter(c => c.interactionType === 'convert').length;
  
  return {
    responseRate: Math.round((responded / totalReceived) * 100),
    totalReceived,
    totalConversions: conversions,
  };
};

/**
 * Generate recommended next action based on user profile
 */
export const getRecommendedAction = (user: User): string => {
  const { segment } = user;
  const campaignMetrics = calculateCampaignMetrics(user.campaignHistory);
  const behaviorAnalytics = calculateBehaviorAnalytics(user);
  
  // Champions - Upsell premium products
  if (segment.includes('Champions')) {
    return '💎 Offer premium investment products or exclusive credit card upgrade';
  }
  
  // Loyal - Maintain relationship
  if (segment.includes('Loyal')) {
    return '🎁 Send loyalty rewards or personalized cashback offers';
  }
  
  // Potential - Encourage more engagement
  if (segment.includes('Potential')) {
    if (user.dreamSavers && user.dreamSavers.length > 0) {
      return '🎯 Promote goal-based savings products or auto-debit features';
    }
    return '⭐ Send gamified challenges to increase transaction frequency';
  }
  
  // At Risk - Re-engagement campaign
  if (segment.includes('At Risk')) {
    return '⚠️ Launch winback campaign with special offers or cashback';
  }
  
  // Hibernating - Aggressive reactivation
  if (segment.includes('Hibernating')) {
    return '🔔 Send reactivation bonus or fee waiver to restart activity';
  }
  
  return '📊 Monitor customer behavior and plan targeted engagement';
};

/**
 * Build complete Customer 360 Profile
 */
export const buildCustomer360Profile = (user: User): Customer360Profile => {
  const behaviorAnalytics = calculateBehaviorAnalytics(user);
  const engagementMetrics = calculateEngagementMetrics(user);
  const campaignMetrics = calculateCampaignMetrics(user.campaignHistory);
  
  // Calculate utility analytics
  const utilityData = calculateUtilityAnalytics(user.transactions);
  const pdamReg = getPDAMRegion(user.transactions);
  const persona = getUtilityPersona(utilityData);
  
  return {
    user,
    behaviorAnalytics,
    engagementMetrics,
    campaignResponseRate: campaignMetrics.responseRate,
    totalCampaignsReceived: campaignMetrics.totalReceived,
    totalConversions: campaignMetrics.totalConversions,
    recommendedNextAction: getRecommendedAction(user),
    // Regional utility analytics for Bank Sumut
    utilityAnalytics: {
      totalUtilitySpend: user.transactions
        .filter(t => t.category === 'Utilities' || t.category === 'Recurring Bills')
        .reduce((sum, t) => sum + t.amount, 0),
      recurringBillsCount: utilityData.recurringBillCount,
      uniqueProviders: utilityData.uniqueUtilityProviders.length,
      dependencyScore: Math.round(utilityData.utilityDependencyScore / 10), // Scale to 0-10
      isPrimaryBankingUser: utilityData.isPrimaryBankingUser,
    },
    pdamRegion: pdamReg || undefined,
    utilityPersona: persona,
  };
};

/**
 * Calculate utility dependency metrics
 */
export const calculateUtilityAnalytics = (transactions: Transaction[]): UtilityAnalytics => {
  const utilityTx = transactions.filter(t => 
    t.category === 'Utilities' || t.category === 'Recurring Bills' || t.category === 'Government Services'
  );
  
  const uniqueProviders = [...new Set(utilityTx.map(t => t.provider || t.merchant).filter(Boolean))];
  const recurringCount = utilityTx.filter(t => t.isRecurring).length;
  const utilityPercentage = transactions.length > 0 ? (utilityTx.length / transactions.length) * 100 : 0;
  
  // Scoring algorithm (0-100)
  // Recurring bills are weighted heavily as they indicate dependency
  const dependencyScore = Math.min(100, 
    (recurringCount * 15) +           // Max 6 recurring ~ 90 points
    (uniqueProviders.length * 5) +    // Diversity bonus (max ~30)
    (utilityPercentage * 0.2)         // Percentage contribution
  );
  
  // Detect PDAM region from transactions
  const pdamRegion = getPDAMRegion(transactions);
  
  return {
    totalUtilityTransactions: utilityTx.length,
    uniqueUtilityProviders: uniqueProviders,
    recurringBillCount: recurringCount,
    utilitySpendPercentage: Math.round(utilityPercentage),
    isPrimaryBankingUser: recurringCount >= 3, // Strategic threshold from document
    utilityDependencyScore: Math.round(dependencyScore),
    pdamRegion: pdamRegion || undefined,
  };
};

/**
 * Get utility persona label based on analytics
 */
export const getUtilityPersona = (analytics: UtilityAnalytics): string => {
  if (analytics.recurringBillCount >= 5) return 'Utility Champion';
  if (analytics.recurringBillCount >= 3) return 'Utility Power User';
  if (analytics.recurringBillCount >= 1) return 'Utility User';
  return 'Non-Utility User';
};

/**
 * Detect PDAM regional context for local relevance
 */
export const getPDAMRegion = (transactions: Transaction[]): string | null => {
  const pdamTx = transactions.find(t => 
    t.subcategory === 'PDAM' || t.merchant?.includes('PDAM')
  );
  
  if (!pdamTx) return null;
  
  const provider = pdamTx.provider || pdamTx.merchant || '';
  
  if (provider.includes('Tirtanadi')) return 'Medan & Sekitar';
  if (provider.includes('Tirtabulian')) return 'Deli Serdang';
  if (provider.includes('Tirtauli')) return 'Pematang Siantar';
  
  return 'Unknown Region';
};

