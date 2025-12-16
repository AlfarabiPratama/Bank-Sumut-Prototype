// RFM Segments
export enum RFMSegment {
  CHAMPIONS = 'Sultan Sejati (Champions)',
  LOYAL = 'Kawan Setia (Loyal)',
  POTENTIAL = 'Calon Sultan (Potential)',
  AT_RISK = 'Hampir Lupa (At Risk)',
  HIBERNATING = 'Tidur Panjang (Hibernating)',
}

export interface RFMConfig {
  weights: {
    recency: number;
    frequency: number;
    monetary: number;
  };
  thresholds: {
    champion: number;
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
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: 'F&B' | 'Transport' | 'Shopping' | 'Entertainment';
  logo?: string;
}

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