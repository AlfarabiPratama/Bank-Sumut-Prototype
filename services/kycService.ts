/**
 * KYC Data Generator Service
 * Generates mock KYC data for demo purposes
 * Based on OJK POJK No. 11/2022 requirements
 */

import type { KYCStatus, AMLFlag, User, KYCDocument } from '../types';

// Generate random date within range
const randomDate = (startDays: number, endDays: number): string => {
  const now = new Date();
  const days = Math.floor(Math.random() * (endDays - startDays)) + startDays;
  const date = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

// Generate KYC status based on customer segment and account status
export const generateKYCStatus = (customer: User): KYCStatus => {
  const segment = customer.segment;
  const accountStatus = customer.accountStatus;
  
  // Champions and Premium get Enhanced KYC
  if (segment === 'Champions' || accountStatus === 'Premium') {
    return {
      level: 'ENHANCED',
      verifiedAt: randomDate(-365, -30),
      expiresAt: randomDate(180, 365),
      verificationMethod: 'VIDEO_CALL',
      riskLevel: 'LOW',
      documents: [
        { type: 'KTP', uploadedAt: randomDate(-365, -30), verified: true },
        { type: 'NPWP', uploadedAt: randomDate(-365, -30), verified: true },
        { type: 'SELFIE', uploadedAt: randomDate(-365, -30), verified: true },
        { type: 'PROOF_OF_ADDRESS', uploadedAt: randomDate(-300, -30), verified: true },
      ]
    };
  }
  
  // Loyal customers get Standard KYC
  if (segment === 'Loyal') {
    return {
      level: 'STANDARD',
      verifiedAt: randomDate(-300, -30),
      expiresAt: randomDate(90, 300),
      verificationMethod: 'E-KTP',
      riskLevel: 'LOW',
      documents: [
        { type: 'KTP', uploadedAt: randomDate(-300, -30), verified: true },
        { type: 'SELFIE', uploadedAt: randomDate(-300, -30), verified: true },
      ]
    };
  }
  
  // Potential customers - some expiring soon
  if (segment === 'Potential') {
    const expiringSoon = Math.random() > 0.5;
    return {
      level: 'STANDARD',
      verifiedAt: randomDate(-200, -30),
      expiresAt: expiringSoon ? randomDate(5, 25) : randomDate(60, 200),
      verificationMethod: 'DUKCAPIL',
      riskLevel: 'LOW',
      documents: [
        { type: 'KTP', uploadedAt: randomDate(-200, -30), verified: true },
        { type: 'SELFIE', uploadedAt: randomDate(-200, -30), verified: true },
      ]
    };
  }
  
  // At Risk customers - some with flags or basic KYC
  if (segment === 'At Risk') {
    const hasIssues = Math.random() > 0.6;
    return {
      level: hasIssues ? 'BASIC' : 'STANDARD',
      verifiedAt: randomDate(-400, -100),
      expiresAt: hasIssues ? randomDate(-30, 10) : randomDate(30, 90),
      verificationMethod: 'MANUAL',
      riskLevel: hasIssues ? 'MEDIUM' : 'LOW',
      amlFlags: hasIssues ? [{
        type: 'SUSPICIOUS_TRANSACTION',
        flaggedAt: randomDate(-60, -10),
        description: 'Unusual transaction pattern detected',
        status: 'PENDING_REVIEW'
      }] : undefined,
      documents: [
        { type: 'KTP', uploadedAt: randomDate(-400, -100), verified: true },
      ]
    };
  }
  
  // Hibernating/Dormant customers - expired or basic KYC
  if (segment === 'Hibernating' || accountStatus === 'Dormant') {
    return {
      level: 'EXPIRED',
      verifiedAt: randomDate(-500, -200),
      expiresAt: randomDate(-100, -10),
      verificationMethod: 'MANUAL',
      riskLevel: 'MEDIUM',
      documents: [
        { type: 'KTP', uploadedAt: randomDate(-500, -200), verified: true, expiresAt: randomDate(-100, -10) },
      ]
    };
  }
  
  // Default: Basic KYC
  return {
    level: 'BASIC',
    verifiedAt: randomDate(-200, -30),
    expiresAt: randomDate(30, 180),
    verificationMethod: 'E-KTP',
    riskLevel: 'LOW',
    documents: [
      { type: 'KTP', uploadedAt: randomDate(-200, -30), verified: true },
    ]
  };
};

// Generate consent data
export const generateConsentData = (customer: User) => {
  const segment = customer.segment;
  
  // Champions and Loyal more likely to have full consent
  if (segment === 'Champions' || segment === 'Loyal') {
    return {
      optIn: true,
      lastUpdated: randomDate(-180, -7),
      expiresAt: randomDate(180, 365),
      channels: ['email', 'sms', 'push', 'whatsapp'] as ('email' | 'sms' | 'push' | 'whatsapp')[],
      consentSource: 'MOBILE_APP' as const
    };
  }
  
  // Potential - partial consent
  if (segment === 'Potential') {
    const hasConsent = Math.random() > 0.3;
    return {
      optIn: hasConsent,
      lastUpdated: randomDate(-120, -7),
      expiresAt: hasConsent ? randomDate(90, 180) : undefined,
      channels: hasConsent ? ['email', 'push'] as ('email' | 'sms' | 'push' | 'whatsapp')[] : [],
      consentSource: hasConsent ? 'MOBILE_APP' as const : undefined
    };
  }
  
  // At Risk and Hibernating - often no consent
  const hasConsent = Math.random() > 0.7;
  return {
    optIn: hasConsent,
    lastUpdated: randomDate(-365, -30),
    expiresAt: hasConsent ? randomDate(-10, 30) : undefined, // Often expired
    channels: hasConsent ? ['sms'] as ('email' | 'sms' | 'push' | 'whatsapp')[] : [],
    consentSource: hasConsent ? 'BRANCH' as const : undefined
  };
};

// Enrich customers with KYC and consent data
export const enrichCustomerWithCompliance = (customer: User): User => {
  return {
    ...customer,
    kycStatus: customer.kycStatus || generateKYCStatus(customer),
    marketingConsent: customer.marketingConsent || generateConsentData(customer)
  };
};

// Batch enrich all customers
export const enrichAllCustomers = (customers: User[]): User[] => {
  return customers.map(enrichCustomerWithCompliance);
};

// Get KYC compliance statistics
export const getKYCStats = (customers: User[]) => {
  const enriched = customers.map(c => c.kycStatus ? c : enrichCustomerWithCompliance(c));
  
  const now = new Date();
  
  return {
    enhanced: enriched.filter(c => c.kycStatus?.level === 'ENHANCED').length,
    standard: enriched.filter(c => c.kycStatus?.level === 'STANDARD').length,
    basic: enriched.filter(c => c.kycStatus?.level === 'BASIC').length,
    expired: enriched.filter(c => {
      if (!c.kycStatus) return true;
      if (c.kycStatus.level === 'EXPIRED') return true;
      return new Date(c.kycStatus.expiresAt) < now;
    }).length,
    expiringSoon: enriched.filter(c => {
      if (!c.kycStatus) return false;
      const expiry = new Date(c.kycStatus.expiresAt);
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= 30;
    }).length,
    withAmlFlags: enriched.filter(c => 
      c.kycStatus?.amlFlags && c.kycStatus.amlFlags.length > 0
    ).length,
    highRisk: enriched.filter(c => c.kycStatus?.riskLevel === 'HIGH').length,
    mediumRisk: enriched.filter(c => c.kycStatus?.riskLevel === 'MEDIUM').length
  };
};

// Get consent compliance statistics
export const getConsentStats = (customers: User[]) => {
  const enriched = customers.map(c => c.marketingConsent ? c : enrichCustomerWithCompliance(c));
  
  const now = new Date();
  const total = enriched.length;
  
  const eligible = enriched.filter(c => c.marketingConsent?.optIn).length;
  const withEmail = enriched.filter(c => c.marketingConsent?.channels?.includes('email')).length;
  const withSms = enriched.filter(c => c.marketingConsent?.channels?.includes('sms')).length;
  const withPush = enriched.filter(c => c.marketingConsent?.channels?.includes('push')).length;
  const withWhatsApp = enriched.filter(c => c.marketingConsent?.channels?.includes('whatsapp')).length;
  
  const expiredConsent = enriched.filter(c => {
    if (!c.marketingConsent?.expiresAt) return false;
    return new Date(c.marketingConsent.expiresAt) < now;
  }).length;
  
  return {
    total,
    eligible,
    ineligible: total - eligible,
    consentRate: total > 0 ? Math.round((eligible / total) * 100) : 0,
    byChannel: { email: withEmail, sms: withSms, push: withPush, whatsapp: withWhatsApp },
    expiredConsent
  };
};
