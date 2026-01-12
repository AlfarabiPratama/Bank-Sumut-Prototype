// RFM Segments
export enum RFMSegment {
  CHAMPIONS = 'Champions',
  LOYAL = 'Loyal',
  POTENTIAL = 'Potential',
  AT_RISK = 'At Risk',
  HIBERNATING = 'Hibernating'
}

export interface RFMConfig {
  recencyThresholds: [number, number, number];    // e.g., [7, 30, 90] days
  frequencyThresholds: [number, number, number];  // e.g., [2, 5, 10] transactions
  monetaryThresholds: [number, number, number];   // e.g., [500k, 2M, 5M] rupiah
  weights?: {
    recency: number;
    frequency: number;
    monetary: number;
  };
  thresholds?: {
    champions: number;
    loyal: number;
    potential: number;
    atRisk: number;
  };
}

export interface DreamSaver {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  image: string;
  deadline: string;
}

// User Profile
export interface User {
  id: string;
  name: string;
  avatar: string;
  segment: RFMSegment;
  balance: number;
  points: number; // Sudako Points
  level: number;
  xp: number;
  badges: Badge[];
  transactions: Transaction[];
  dreamSavers?: DreamSaver[]; // New Feature
  rfmScore: {
    recency: number;
    frequency: number;
    monetary: number;
  };
  // Customer 360 Fields
  age?: number;
  accountStatus?: 'Active' | 'Premium' | 'New' | 'Dormant';
  campaignHistory?: CampaignInteraction[];
  interactions?: CustomerInteraction[];
  preferredChannel?: 'Mobile App' | 'ATM' | 'Web' | 'Branch';
  activeTimeSlot?: string;
  accountCreatedDate?: string;
  // NEW: Contact & Profile Fields for Personalization
  email?: string;
  phone?: string;
  location?: string; // City/Region
  occupation?: string;
  preferredDays?: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu')[];
  gender?: 'M' | 'F';
  // NEW: Rewards tracking
  rewardHistory?: RewardRedemption[];
  dailyLoginStreak?: number;
  lastLoginDate?: string;
  // NEW: Marketing Consent (UU PDP Compliant)
  marketingConsent?: {
    optIn: boolean;
    lastUpdated: string;
    expiresAt?: string; // Consent expiry date
    channels?: ('email' | 'sms' | 'push' | 'whatsapp')[];
    consentSource?: 'MOBILE_APP' | 'BRANCH' | 'WEB' | 'PHONE';
  };
  // NEW: KYC Status (OJK POJK No. 11/2022 Compliant)
  kycStatus?: KYCStatus;
}

// KYC Status Interface - OJK Compliance
export interface KYCStatus {
  level: 'BASIC' | 'STANDARD' | 'ENHANCED' | 'EXPIRED';
  verifiedAt: string;
  expiresAt: string;
  verificationMethod: 'E-KTP' | 'DUKCAPIL' | 'MANUAL' | 'VIDEO_CALL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  amlFlags?: AMLFlag[];
  documents?: KYCDocument[];
}

export interface AMLFlag {
  type: 'SUSPICIOUS_TRANSACTION' | 'HIGH_RISK_COUNTRY' | 'PEP' | 'WATCHLIST';
  flaggedAt: string;
  description: string;
  status: 'PENDING_REVIEW' | 'CLEARED' | 'ESCALATED';
}

export interface KYCDocument {
  type: 'KTP' | 'NPWP' | 'SELFIE' | 'PROOF_OF_ADDRESS';
  uploadedAt: string;
  verified: boolean;
  expiresAt?: string;
}

export interface RewardRedemption {
  id: string;
  rewardName: string;
  pointsUsed: number;
  redeemedAt: string;
  status: 'pending' | 'claimed' | 'expired';
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: 'F&B' | 'Transport' | 'Shopping' | 'Entertainment' | 
            'Utilities' | 'Recurring Bills' | 'Government Services' | 
            'Education' | 'Healthcare' | 'Transfer';
  logo?: string;
  // Utility-specific fields
  subcategory?: string; // e.g., 'PDAM', 'BPJS', 'Telkom'
  provider?: string;    // e.g., 'Tirtanadi', 'Tirtabulian'
  isRecurring?: boolean; // Mark if it's a recurring utility
  billNumber?: string;   // For display "PDAM Tirtanadi (Pel: 123456789)"

  // Transfer-specific fields
  transferType?: 'top_up' | 'transfer_out' | 'transfer_in';
  transferMethod?: 'intra_bank' | 'inter_bank' | 'e_wallet';
  recipientBankCode?: string;
  recipientAccountNumber?: string;
  recipientName?: string;
  sourceType?: 'atm' | 'mobile_app' | 'internet_banking' | 'teller';
  transferFee?: number;
  totalAmount?: number;}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Campaign {
  id: string;
  title: string;
  targetSegment: RFMSegment[];
  status: 'Active' | 'Draft' | 'Completed';
  reach: number;
  conversion: number;
  aiGenerated?: boolean;
}

// Customer 360 Types
// Campaign Interaction
export interface CampaignInteraction {
  id: string;
  campaignId: string;
  campaignTitle: string;
  interactionType: 'view' | 'click' | 'convert' | 'ignore';
  timestamp: string;
  conversionAmount?: number;
}

// Customer Service Interaction
export interface CustomerInteraction {
  id: string;
  type: 'call' | 'chat' | 'email' | 'ticket';
  subject: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved';
  timestamp: string;
  assignedTo?: string;
  channel: string;
}

export interface BehaviorAnalytics {
  averageTransactionAmount: number;
  totalTransactionVolume: number;
  dominantCategory: string;
  transactionFrequency: number; // transactions per month
  lastTransactionDate: string;
}

export interface EngagementMetrics {
  consistencyScore: number; // 0-100, based on activity patterns
  badgesEarned: number;
  totalBadges: number;
  badgeCompletionRate: number;
  daysActive: number;
  lastActiveDate: string;
}

export interface Customer360Profile {
  user: User;
  behaviorAnalytics: BehaviorAnalytics;
  engagementMetrics: EngagementMetrics;
  campaignResponseRate: number;
  totalCampaignsReceived: number;
  totalConversions: number;
  recommendedNextAction: string;
  utilityAnalytics?: {
    totalUtilitySpend: number;
    recurringBillsCount: number;
    uniqueProviders: number;
    dependencyScore: number;
    isPrimaryBankingUser: boolean;
  };
  pdamRegion?: string;
  utilityPersona?: string;
}

// Utility Analytics
export interface UtilityAnalytics {
  totalUtilityTransactions: number;
  uniqueUtilityProviders: string[];
  recurringBillCount: number;
  utilitySpendPercentage: number; // % of total transactions
  isPrimaryBankingUser: boolean; // 3+ recurring utilities
  utilityDependencyScore: number; // 0-100
  pdamRegion?: string; // Regional context
}
// Loan Application Pipeline Types
export type LoanStage = 'new_lead' | 'contacted' | 'doc_collection' | 'credit_scoring' | 'approval' | 'disbursement' | 'active' | 'rejected';

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  productType: 'KUR' | 'KPR' | 'Kredit Mikro' | 'Kartu Kredit' | 'Deposito';
  amount: number;
  stage: LoanStage;
  assignedRM: string;
  createdDate: string;
  lastUpdated: string;
  daysInStage: number;
  nextAction?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

export const LOAN_STAGE_CONFIG: Record<LoanStage, { label: string; color: string; bgColor: string }> = {
  new_lead: { label: 'New Lead', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  contacted: { label: 'Contacted', color: 'text-cyan-700', bgColor: 'bg-cyan-50' },
  doc_collection: { label: 'Dokumen', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  credit_scoring: { label: 'Scoring', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  approval: { label: 'Approval', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  disbursement: { label: 'Disbursed', color: 'text-green-700', bgColor: 'bg-green-50' },
  active: { label: 'Active', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-50' }
};

// Dream Saver Activity Log for Admin Dashboard
export interface DreamSaverActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  pocketId: string;
  pocketName: string;
  activityType: 'create' | 'topup' | 'withdraw' | 'delete' | 'complete';
  amount: number;
  timestamp: string;
  description: string;
}

// Push Notification from Admin to Mobile
export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'info' | 'warning' | 'success';
  campaignId?: string;
  targetSegment?: RFMSegment[];
  sentBy: string;
  sentAt: string;
  read: boolean;
  icon?: string;
}

// ============ CRM METRICS INTERFACES ============

// SERVICE METRICS - Waktu respon, waktu selesai, SLA hit rate, repeat complaint rate
export interface ServiceMetrics {
  averageResponseTime: number; // in hours
  averageResolutionTime: number; // in hours
  slaHitRate: number; // percentage 0-100
  repeatComplaintRate: number; // percentage 0-100
  totalTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
  satisfactionScore: number; // CSAT 0-5
}

// ENGAGEMENT METRICS (Extended) - Opt-in rate, open/click rate, conversion per journey
export interface CampaignEngagementMetrics {
  optInRate: number; // percentage of customers opted-in
  emailOpenRate: number; // percentage 0-100
  clickRate: number; // percentage 0-100
  conversionPerJourney: number; // average conversions per customer journey
  totalCampaignsSent: number;
  totalOpens: number;
  totalClicks: number;
  totalConversions: number;
  averageJourneyLength: number; // days
}

// GROWTH METRICS - Cross-sell/upsell conversion, product-per-customer
export interface GrowthMetrics {
  crossSellConversion: number; // percentage 0-100
  upsellConversion: number; // percentage 0-100
  productPerCustomer: number; // average products held
  newProductAdoption: number; // products added in last 90 days
  revenuePerCustomer: number; // ARPU
  lifetimeValue: number; // CLV estimate
  growthPotentialScore: number; // 0-100
}

// RETENTION METRICS - Churn proxy, reactivation rate
export interface RetentionMetrics {
  churnRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  churnProbability: number; // percentage 0-100
  daysSinceLastActivity: number;
  reactivationEligible: boolean;
  reactivationAttempts: number;
  reactivationSuccess: boolean;
  retentionScore: number; // 0-100
  predictedChurnDate?: string;
}

// TRUST & COMPLIANCE METRICS - Consent coverage, data quality, audit trail
export interface TrustComplianceMetrics {
  consentCoverage: number; // percentage of required consents obtained
  marketingConsentStatus: boolean;
  dataQualityScore: number; // 0-100
  profileCompleteness: number; // percentage 0-100
  auditTrailCompleteness: number; // percentage 0-100
  lastConsentUpdate: string;
  kycStatus: 'Complete' | 'Partial' | 'Pending' | 'Expired';
  dataPrivacyCompliant: boolean;
  missingFields: string[];
}

// (ServiceTicket interface moved to line 407+ with CS-specific fields)

// COMPLETE CRM METRICS PROFILE
export interface CRMMetricsProfile {
  serviceMetrics: ServiceMetrics;
  campaignEngagement: CampaignEngagementMetrics;
  growthMetrics: GrowthMetrics;
  retentionMetrics: RetentionMetrics;
  trustCompliance: TrustComplianceMetrics;
}

// CUSTOMER JOURNEY EVENT for Timeline
export interface CustomerJourneyEvent {
  id: string;
  date: string;
  type: 'account_created' | 'first_transaction' | 'first_loan' | 'segment_change' | 'reward_redeemed' | 'complaint' | 'product_acquired' | 'milestone' | 'campaign_converted';
  title: string;
  description: string;
  icon: string;
  color: string;
}

// CUSTOMER NOTE / INTERACTION LOG
export interface CustomerNote {
  id: string;
  customerId: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  content: string;
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'note' | 'follow_up';
  tags: ('follow_up' | 'complaint' | 'opportunity' | 'resolved' | 'important')[];
  outcome?: 'positive' | 'neutral' | 'negative';
  nextAction?: string;
  nextActionDate?: string;
}

// SERVICE TICKET FOR CS
export interface ServiceTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  subject: string;
  description: string;
  category: 'ATM_BLOCKED' | 'TRANSACTION_ISSUE' | 'ACCOUNT_INQUIRY' | 'MOBILE_BANKING' | 'COMPLAINT' | 'INFO_REQUEST' | 'OTHER';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'PENDING_INTERNAL' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  assignedToName: string;
  slaTarget: number; // Minutes
  resolvedAt?: string;
  closedAt?: string;
  resolution?: string;
  customerRating?: number; // 1-5
  customerFeedback?: string;
  channel: 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'BRANCH' | 'MOBILE_APP';
  notes?: TicketNote[];
}

export interface TicketNote {
  id: string;
  ticketId: string;
  createdAt: string;
  createdBy: string;
  content: string;
  type: 'INTERNAL' | 'CUSTOMER_REPLY' | 'AGENT_REPLY';
}

// KNOWLEDGE BASE ARTICLE
export interface KnowledgeArticle {
  id: string;
  title: string;
  icon: string;
  category: 'PASSWORD' | 'CARD' | 'TRANSFER' | 'ACCOUNT' | 'MOBILE_BANKING' | 'OTHER';
  steps: string[];
  escalationPath?: string;
  relatedIssues?: string[];
  views: number;
  helpfulness: number; // Percentage
}

// RM & Sales Interfaces
export interface Deal {
  id: string;
  customerId: string;
  name: string;
  product: string;
  value: number;
  stage: 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSING' | 'WON' | 'LOST';
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
  isHot?: boolean;
  customer?: User; // Optional populated
}

export interface Lead {
  id: string;
  customerId: string;
  source: 'REFERRAL' | 'CAMPAIGN' | 'INBOUND' | 'COLD';
  interestLevel: number; // 1-10
  lastContactDate: string;
  notes?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'DROPPED';
  customer?: User; // Optional populated
}

export interface NBA {
  title: string;
  shortReason: string;
  expectedRevenue: number;
  confidence: number; // 0-100
  type: 'UPSELL' | 'CROSS_SELL' | 'RETENTION' | 'SERVICE';
}

export interface Opportunity {
  id: string;
  customerId: string;
  customer: User;
  nba: NBA;
  createdAt: string;
  status: 'NEW' | 'VIEWED' | 'ACTIONED' | 'DISMISSED';
}

export interface UrgentAction {
  id: string;
  title: string;
  description: string;
  type: 'DEADLINE' | 'FOLLOW_UP' | 'COMPLIANCE' | 'OPPORTUNITY';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  deadline: string;
  customerId: string;
  customer: User;
  dealValue?: number;
  actionLabel?: string;
}

export interface ScoredLead extends Lead {
  customer: User;
  score: number;
  temperature: 'HOT' | 'WARM' | 'COLD';
  scoreFactors: {
    balance: number;
    engagement: number;
    recency: number;
  };
  nba: NBA;
}
