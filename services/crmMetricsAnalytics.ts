/**
 * CRM Metrics Analytics Service
 * Calculates Service, Growth, Retention, and Trust & Compliance metrics
 */

import { 
  User, 
  ServiceMetrics, 
  CampaignEngagementMetrics, 
  GrowthMetrics, 
  RetentionMetrics, 
  TrustComplianceMetrics,
  CRMMetricsProfile,
  CampaignInteraction,
  CustomerJourneyEvent,
  CustomerNote
} from '../types';

/**
 * Calculate Service Metrics for a customer
 * Based on support tickets and response times
 */
export const calculateServiceMetrics = (user: User): ServiceMetrics => {
  // Generate realistic mock service data based on user profile
  const interactions = user.interactions || [];
  const tickets = interactions.filter(i => i.type === 'ticket' || i.type === 'call');
  
  const totalTickets = tickets.length || Math.floor(Math.random() * 5) + 1;
  const resolvedTickets = Math.floor(totalTickets * (0.7 + Math.random() * 0.25));
  const pendingTickets = totalTickets - resolvedTickets;
  
  // Calculate based on segment - Champions get better service
  const segmentBonus = user.segment.includes('Champions') ? 20 : 
                       user.segment.includes('Loyal') ? 10 : 
                       user.segment.includes('Potential') ? 5 : 0;
  
  const slaHitRate = Math.min(100, 70 + segmentBonus + Math.floor(Math.random() * 15));
  const repeatComplaintRate = Math.max(0, 15 - segmentBonus + Math.floor(Math.random() * 10));
  
  return {
    averageResponseTime: Math.round((2 + Math.random() * 4) * 10) / 10, // 2-6 hours
    averageResolutionTime: Math.round((12 + Math.random() * 24) * 10) / 10, // 12-36 hours
    slaHitRate,
    repeatComplaintRate,
    totalTickets,
    resolvedTickets,
    pendingTickets,
    satisfactionScore: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0
  };
};

/**
 * Calculate Campaign Engagement Metrics
 * Based on campaign history and interactions
 */
export const calculateCampaignEngagement = (user: User): CampaignEngagementMetrics => {
  const campaignHistory = user.campaignHistory || [];
  const hasConsent = user.marketingConsent?.optIn ?? true;
  
  const totalCampaignsSent = campaignHistory.length || Math.floor(Math.random() * 20) + 5;
  const views = campaignHistory.filter(c => c.interactionType === 'view').length;
  const clicks = campaignHistory.filter(c => c.interactionType === 'click').length;
  const conversions = campaignHistory.filter(c => c.interactionType === 'convert').length;
  
  // Calculate rates
  const opens = views + Math.floor(Math.random() * 10);
  const emailOpenRate = totalCampaignsSent > 0 ? 
    Math.min(100, Math.round((opens / totalCampaignsSent) * 100)) : 45;
  const clickRate = totalCampaignsSent > 0 ? 
    Math.min(100, Math.round((clicks / totalCampaignsSent) * 100)) : 12;
  
  return {
    optInRate: hasConsent ? 100 : 0,
    emailOpenRate: emailOpenRate || Math.floor(35 + Math.random() * 25),
    clickRate: clickRate || Math.floor(8 + Math.random() * 12),
    conversionPerJourney: conversions > 0 ? 
      Math.round((conversions / Math.max(1, totalCampaignsSent / 5)) * 100) / 100 : 
      Math.round((0.5 + Math.random() * 1.5) * 100) / 100,
    totalCampaignsSent,
    totalOpens: opens || Math.floor(totalCampaignsSent * 0.45),
    totalClicks: clicks || Math.floor(totalCampaignsSent * 0.12),
    totalConversions: conversions || Math.floor(totalCampaignsSent * 0.05),
    averageJourneyLength: Math.floor(7 + Math.random() * 21), // 7-28 days
  };
};

/**
 * Calculate Growth Metrics
 * Cross-sell/upsell potential and product adoption
 */
export const calculateGrowthMetrics = (user: User): GrowthMetrics => {
  // Estimate products based on transaction categories
  const categories = new Set(user.transactions.map(t => t.category));
  const productCount = Math.max(1, Math.min(5, categories.size));
  
  // Calculate based on segment and activity
  const isActive = user.segment.includes('Champions') || user.segment.includes('Loyal');
  const hasPotential = user.segment.includes('Potential');
  
  const baseConversion = isActive ? 25 : hasPotential ? 15 : 8;
  const balance = user.balance;
  const transactionVolume = user.transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Lifetime value estimate (simplified)
  const monthlyValue = transactionVolume / 12;
  const estimatedLifetime = isActive ? 60 : hasPotential ? 36 : 24; // months
  const ltv = monthlyValue * estimatedLifetime * 0.02; // 2% margin assumption
  
  return {
    crossSellConversion: baseConversion + Math.floor(Math.random() * 15),
    upsellConversion: Math.floor(baseConversion * 0.7) + Math.floor(Math.random() * 10),
    productPerCustomer: productCount,
    newProductAdoption: isActive ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2),
    revenuePerCustomer: Math.round(monthlyValue),
    lifetimeValue: Math.round(ltv),
    growthPotentialScore: hasPotential ? 75 + Math.floor(Math.random() * 20) : 
                          isActive ? 50 + Math.floor(Math.random() * 25) : 
                          30 + Math.floor(Math.random() * 25),
  };
};

/**
 * Calculate Retention Metrics
 * Churn risk and reactivation potential
 */
export const calculateRetentionMetrics = (user: User): RetentionMetrics => {
  // Calculate days since last activity
  const lastTxDate = user.transactions.length > 0 
    ? new Date(Math.max(...user.transactions.map(t => new Date(t.date).getTime())))
    : new Date();
  const daysSince = Math.floor((Date.now() - lastTxDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine churn risk based on segment and activity
  let churnRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  let churnProbability: number;
  
  if (user.segment.includes('Champions') || user.segment.includes('Loyal')) {
    churnRisk = daysSince > 30 ? 'Medium' : 'Low';
    churnProbability = daysSince > 30 ? 15 + Math.floor(Math.random() * 10) : 5 + Math.floor(Math.random() * 5);
  } else if (user.segment.includes('Potential')) {
    churnRisk = daysSince > 14 ? 'Medium' : 'Low';
    churnProbability = 20 + Math.floor(Math.random() * 15);
  } else if (user.segment.includes('At Risk')) {
    churnRisk = 'High';
    churnProbability = 50 + Math.floor(Math.random() * 20);
  } else {
    churnRisk = 'Critical';
    churnProbability = 70 + Math.floor(Math.random() * 20);
  }
  
  const isReactivationEligible = user.segment.includes('At Risk') || user.segment.includes('Hibernating');
  
  // Predict churn date for at-risk customers
  const predictedChurnDate = churnRisk === 'High' || churnRisk === 'Critical'
    ? new Date(Date.now() + (90 - churnProbability) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : undefined;
  
  return {
    churnRisk,
    churnProbability,
    daysSinceLastActivity: daysSince,
    reactivationEligible: isReactivationEligible,
    reactivationAttempts: isReactivationEligible ? Math.floor(Math.random() * 3) : 0,
    reactivationSuccess: false,
    retentionScore: 100 - churnProbability,
    predictedChurnDate,
  };
};

/**
 * Calculate Trust & Compliance Metrics
 * Data quality, consent coverage, and audit trail
 */
export const calculateTrustComplianceMetrics = (user: User): TrustComplianceMetrics => {
  // Check required fields for profile completeness
  const requiredFields = ['name', 'email', 'phone', 'age', 'occupation', 'location', 'gender'];
  const missingFields: string[] = [];
  
  if (!user.email) missingFields.push('email');
  if (!user.phone) missingFields.push('phone');
  if (!user.age) missingFields.push('age');
  if (!user.occupation) missingFields.push('occupation');
  if (!user.location) missingFields.push('location');
  if (!user.gender) missingFields.push('gender');
  
  const profileCompleteness = Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100);
  
  // Check consent status
  const hasMarketingConsent = user.marketingConsent?.optIn ?? false;
  const consentUpdated = user.marketingConsent?.lastUpdated || new Date().toISOString();
  
  // Data quality score based on completeness and activity
  const activityScore = Math.min(30, user.transactions.length * 2);
  const completenessScore = profileCompleteness * 0.4;
  const consentScore = hasMarketingConsent ? 20 : 10;
  const dataQualityScore = Math.round(activityScore + completenessScore + consentScore);
  
  // KYC status based on profile completeness
  const kycStatus: 'Complete' | 'Partial' | 'Pending' | 'Expired' = 
    profileCompleteness >= 90 ? 'Complete' :
    profileCompleteness >= 60 ? 'Partial' :
    profileCompleteness >= 30 ? 'Pending' : 'Expired';
  
  return {
    consentCoverage: hasMarketingConsent ? 100 : 50, // Basic consent vs full marketing consent
    marketingConsentStatus: hasMarketingConsent,
    dataQualityScore: Math.min(100, dataQualityScore),
    profileCompleteness,
    auditTrailCompleteness: Math.floor(75 + Math.random() * 20), // Mock: 75-95%
    lastConsentUpdate: consentUpdated,
    kycStatus,
    dataPrivacyCompliant: profileCompleteness >= 60,
    missingFields,
  };
};

/**
 * Build complete CRM Metrics Profile for a user
 */
export const buildCRMMetricsProfile = (user: User): CRMMetricsProfile => {
  return {
    serviceMetrics: calculateServiceMetrics(user),
    campaignEngagement: calculateCampaignEngagement(user),
    growthMetrics: calculateGrowthMetrics(user),
    retentionMetrics: calculateRetentionMetrics(user),
    trustCompliance: calculateTrustComplianceMetrics(user),
  };
};

/**
 * Calculate aggregate CRM metrics for all customers
 */
export const calculateAggregateCRMMetrics = (users: User[]): {
  avgSlaHitRate: number;
  avgResponseTime: number;
  avgChurnRisk: number;
  avgDataQuality: number;
  avgConversion: number;
  totalAtRisk: number;
  totalOptedIn: number;
} => {
  if (users.length === 0) {
    return {
      avgSlaHitRate: 0,
      avgResponseTime: 0,
      avgChurnRisk: 0,
      avgDataQuality: 0,
      avgConversion: 0,
      totalAtRisk: 0,
      totalOptedIn: 0,
    };
  }
  
  const profiles = users.map(buildCRMMetricsProfile);
  
  return {
    avgSlaHitRate: Math.round(profiles.reduce((sum, p) => sum + p.serviceMetrics.slaHitRate, 0) / profiles.length),
    avgResponseTime: Math.round(profiles.reduce((sum, p) => sum + p.serviceMetrics.averageResponseTime, 0) / profiles.length * 10) / 10,
    avgChurnRisk: Math.round(profiles.reduce((sum, p) => sum + p.retentionMetrics.churnProbability, 0) / profiles.length),
    avgDataQuality: Math.round(profiles.reduce((sum, p) => sum + p.trustCompliance.dataQualityScore, 0) / profiles.length),
    avgConversion: Math.round(profiles.reduce((sum, p) => sum + p.campaignEngagement.clickRate, 0) / profiles.length),
    totalAtRisk: profiles.filter(p => p.retentionMetrics.churnRisk === 'High' || p.retentionMetrics.churnRisk === 'Critical').length,
    totalOptedIn: profiles.filter(p => p.trustCompliance.marketingConsentStatus).length,
  };
};

/**
 * Generate Customer Journey Timeline Events
 */
export const generateCustomerJourney = (user: User): CustomerJourneyEvent[] => {
  const events: CustomerJourneyEvent[] = [];
  
  // Account Created (based on accountCreatedDate or random past date)
  const accountDate = user.accountCreatedDate || 
    new Date(Date.now() - Math.floor(Math.random() * 730 + 180) * 24 * 60 * 60 * 1000).toISOString();
  events.push({
    id: 'e1',
    date: accountDate.split('T')[0],
    type: 'account_created',
    title: 'Akun Dibuat',
    description: 'Nasabah mendaftar dan membuka rekening',
    icon: '🎉',
    color: 'bg-green-500',
  });

  // First Transaction  
  const firstTxDate = user.transactions.length > 0 
    ? new Date(Math.min(...user.transactions.map(t => new Date(t.date).getTime()))).toISOString()
    : new Date(new Date(accountDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  events.push({
    id: 'e2',
    date: firstTxDate.split('T')[0],
    type: 'first_transaction',
    title: 'Transaksi Pertama',
    description: `Melakukan transaksi pertama sebesar Rp ${(user.transactions[0]?.amount || 50000).toLocaleString('id-ID')}`,
    icon: '💳',
    color: 'bg-blue-500',
  });

  // Milestone - Level up (if level > 5)
  if (user.level > 5) {
    const levelDate = new Date(new Date(firstTxDate).getTime() + Math.floor(Math.random() * 90 + 30) * 24 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'e3',
      date: levelDate.split('T')[0],
      type: 'milestone',
      title: `Naik ke Level ${Math.floor(user.level / 2)}`,
      description: 'Mencapai milestone level gamifikasi',
      icon: '⭐',
      color: 'bg-yellow-500',
    });
  }

  // Segment Change (if not at initial)
  if (user.segment !== 'Potential' && user.segment !== 'At Risk' && user.segment !== 'Hibernating') {
    const segmentDate = new Date(Date.now() - Math.floor(Math.random() * 180 + 30) * 24 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'e4',
      date: segmentDate.split('T')[0],
      type: 'segment_change',
      title: `Menjadi ${user.segment}`,
      description: `Status segmen berubah menjadi ${user.segment}`,
      icon: user.segment === 'Champions' ? '🏆' : user.segment === 'Loyal' ? '💎' : '📈',
      color: user.segment === 'Champions' ? 'bg-emerald-500' : user.segment === 'Loyal' ? 'bg-purple-500' : 'bg-orange-500',
    });
  }

  // Campaign Conversion (if has campaign history with convert)
  const conversions = user.campaignHistory?.filter(c => c.interactionType === 'convert') || [];
  if (conversions.length > 0) {
    const convDate = conversions[0].timestamp || new Date().toISOString();
    events.push({
      id: 'e5',
      date: convDate.split('T')[0],
      type: 'campaign_converted',
      title: 'Konversi Campaign',
      description: `Merespon campaign "${conversions[0].campaignTitle || 'Promo'}"`,
      icon: '🎯',
      color: 'bg-pink-500',
    });
  }

  // Reward Redeemed (if has rewardHistory)
  if (user.rewardHistory && user.rewardHistory.length > 0) {
    const rewardDate = user.rewardHistory[0].redeemedAt || new Date().toISOString();
    events.push({
      id: 'e6',
      date: rewardDate.split('T')[0],
      type: 'reward_redeemed',
      title: 'Tukar Reward',
      description: `Menukar ${user.rewardHistory[0].pointsUsed.toLocaleString()} poin untuk ${user.rewardHistory[0].rewardName}`,
      icon: '🎁',
      color: 'bg-orange-500',
    });
  }

  // Dream Saver Created (if has dreamSavers)
  if (user.dreamSavers && user.dreamSavers.length > 0) {
    const dreamDate = new Date(Date.now() - Math.floor(Math.random() * 60 + 14) * 24 * 60 * 60 * 1000).toISOString();
    events.push({
      id: 'e7',
      date: dreamDate.split('T')[0],
      type: 'product_acquired',
      title: 'Mulai Dompet Impian',
      description: `Membuat goal "${user.dreamSavers[0].name}"`,
      icon: '🎯',
      color: 'bg-cyan-500',
    });
  }

  // Current Status
  events.push({
    id: 'e_now',
    date: new Date().toISOString().split('T')[0],
    type: 'milestone',
    title: 'Saat Ini',
    description: `Level ${user.level} | ${user.points.toLocaleString()} Poin | ${user.segment}`,
    icon: '📍',
    color: 'bg-gray-700',
  });

  // Sort by date
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Generate Mock Notes / Interaction Log for a customer
 */
export const generateMockNotes = (user: User): CustomerNote[] => {
  const noteTypes: CustomerNote['type'][] = ['call', 'meeting', 'email', 'whatsapp', 'note', 'follow_up'];
  const outcomes: CustomerNote['outcome'][] = ['positive', 'neutral', 'negative'];
  const rmNames = ['Budi Siregar', 'Siti Rahmawati', 'Ahmad Harahap', 'Dewi Siregar'];
  
  const notes: CustomerNote[] = [];
  const noteCount = Math.floor(Math.random() * 4) + 2; // 2-5 notes per user
  
  for (let i = 0; i < noteCount; i++) {
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    const noteDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const noteType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    
    const sampleContents: Record<CustomerNote['type'], string[]> = {
      call: [
        `Telepon follow-up terkait promo kredit. Nasabah tertarik tapi masih pikir-pikir.`,
        `Konfirmasi data untuk update KYC. Semua data sudah sesuai.`,
        `Nasabah menanyakan limit kartu kredit. Sudah dijelaskan prosedurnya.`,
      ],
      meeting: [
        `Bertemu di cabang untuk diskusi KPR. Nasabah tertarik unit di Medan Timur.`,
        `Meeting review portfolio investasi. Nasabah setuju diversifikasi ke deposito.`,
      ],
      email: [
        `Kirim proposal penawaran produk tabungan priority. Menunggu feedback.`,
        `Konfirmasi jadwal pertemuan minggu depan untuk closing KUR.`,
      ],
      whatsapp: [
        `Chat konfirmasi dokumen sudah diterima. Proses berjalan.`,
        `Reminder pembayaran cicilan. Nasabah konfirmasi sudah bayar.`,
      ],
      note: [
        `Nasabah berpotensi untuk cross-sell produk asuransi.`,
        `Perlu follow-up soal upgrade ke nasabah priority.`,
      ],
      follow_up: [
        `Jadwalkan telepon minggu depan untuk finalisasi KUR.`,
        `Nasabah minta waktu 2 minggu untuk keputusan KPR.`,
      ],
    };
    
    const tags: CustomerNote['tags'] = [];
    if (noteType === 'follow_up') tags.push('follow_up');
    if (user.segment.includes('At Risk')) tags.push('important');
    if (Math.random() > 0.7) tags.push('opportunity');
    
    notes.push({
      id: `note_${i+1}`,
      customerId: user.id,
      createdAt: noteDate.toISOString(),
      createdBy: rmNames[Math.floor(Math.random() * rmNames.length)],
      content: sampleContents[noteType][Math.floor(Math.random() * sampleContents[noteType].length)],
      type: noteType,
      tags,
      outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
      nextAction: i === 0 ? 'Follow up dalam 7 hari' : undefined,
      nextActionDate: i === 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    });
  }
  
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
