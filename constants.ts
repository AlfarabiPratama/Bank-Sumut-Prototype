import { RFMSegment, User, Campaign } from './types';

export const MOCK_USER: User = {
  id: 'u001',
  name: 'Budi Tarigan',
  avatar: 'https://i.pravatar.cc/150?u=u001',
  segment: RFMSegment.POTENTIAL,
  balance: 2450000,
  points: 1250,
  level: 12,
  xp: 75,
  rfmScore: { recency: 4, frequency: 3, monetary: 3 },
  dreamSavers: [
    {
      id: 'ds1',
      name: 'Konser Coldplay',
      targetAmount: 3500000,
      currentAmount: 2100000,
      image: 'https://images.unsplash.com/photo-1459749411177-2a2f5d915204?auto=format&fit=crop&q=80&w=300',
      deadline: '2024-11-15'
    },
    {
      id: 'ds2',
      name: 'Upgrade iPhone',
      targetAmount: 15000000,
      currentAmount: 4500000,
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300',
      deadline: '2024-12-30'
    }
  ],
  badges: [
    {
      id: 'b1',
      name: 'Anak Kopi Medan',
      description: 'Transaksi 5x di Coffee Shop lokal',
      icon: '☕',
      unlocked: true,
      progress: 5,
      maxProgress: 5,
    },
    {
      id: 'b2',
      name: 'Sultan QRIS',
      description: 'Bayar pakai QRIS total 1 Juta',
      icon: '👑',
      unlocked: false,
      progress: 450000,
      maxProgress: 1000000,
    },
    {
      id: 'b3',
      name: 'Pejuang Hemat',
      description: 'Menabung 3 bulan berturut-turut',
      icon: '💰',
      unlocked: false,
      progress: 1,
      maxProgress: 3,
    }
  ],
  transactions: [
    { id: 't1', merchant: 'Macehat Coffee', amount: 45000, date: '2023-10-25', category: 'F&B' },
    { id: 't2', merchant: 'Soto Kesawan', amount: 35000, date: '2023-10-24', category: 'F&B' },
    { id: 't3', merchant: 'Centre Point XXI', amount: 50000, date: '2023-10-20', category: 'Entertainment' },
    { id: 't4', merchant: 'Gojek Medan', amount: 24000, date: '2023-10-18', category: 'Transport' },
  ]
};

export const MOCK_CUSTOMERS_LIST: User[] = [
  MOCK_USER,
  {
    ...MOCK_USER,
    id: 'u002',
    name: 'Siti Aminah',
    avatar: 'https://i.pravatar.cc/150?u=u002',
    segment: RFMSegment.CHAMPIONS,
    balance: 154000000,
    points: 45000,
    level: 50,
    rfmScore: { recency: 5, frequency: 5, monetary: 5 },
    transactions: [],
    dreamSavers: []
  },
  {
    ...MOCK_USER,
    id: 'u003',
    name: 'Rian Siregar',
    avatar: 'https://i.pravatar.cc/150?u=u003',
    segment: RFMSegment.AT_RISK,
    balance: 500000,
    points: 200,
    level: 5,
    rfmScore: { recency: 1, frequency: 2, monetary: 2 },
    transactions: [],
    dreamSavers: []
  },
  {
    ...MOCK_USER,
    id: 'u004',
    name: 'Jessica Tan',
    avatar: 'https://i.pravatar.cc/150?u=u004',
    segment: RFMSegment.LOYAL,
    balance: 12000000,
    points: 5600,
    level: 24,
    rfmScore: { recency: 4, frequency: 4, monetary: 4 },
    transactions: [],
    dreamSavers: []
  },
  {
    ...MOCK_USER,
    id: 'u005',
    name: 'Andi Simalungun',
    avatar: 'https://i.pravatar.cc/150?u=u005',
    segment: RFMSegment.HIBERNATING,
    balance: 150000,
    points: 50,
    level: 2,
    rfmScore: { recency: 1, frequency: 1, monetary: 1 },
    transactions: [],
    dreamSavers: []
  },
  {
    ...MOCK_USER,
    id: 'u006',
    name: 'Bella Pasaribu',
    avatar: 'https://i.pravatar.cc/150?u=u006',
    segment: RFMSegment.POTENTIAL,
    balance: 3400000,
    points: 2100,
    level: 15,
    rfmScore: { recency: 5, frequency: 4, monetary: 2 },
    transactions: [],
    dreamSavers: []
  },
    {
    ...MOCK_USER,
    id: 'u007',
    name: 'Kevin Wijaya',
    avatar: 'https://i.pravatar.cc/150?u=u007',
    segment: RFMSegment.LOYAL,
    balance: 8900000,
    points: 4200,
    level: 22,
    rfmScore: { recency: 5, frequency: 3, monetary: 4 },
    transactions: [],
    dreamSavers: []
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Promo Gajian: Diskon 50% Merdeka Walk',
    targetSegment: [RFMSegment.LOYAL, RFMSegment.CHAMPIONS],
    status: 'Active',
    reach: 12000,
    conversion: 4.5
  },
  {
    id: 'c2',
    title: 'Misi "Back to Campus" USU',
    targetSegment: [RFMSegment.POTENTIAL],
    status: 'Active',
    reach: 5000,
    conversion: 8.2
  },
  {
    id: 'c3',
    title: 'Winback: Gratis Topup E-Money',
    targetSegment: [RFMSegment.AT_RISK, RFMSegment.HIBERNATING],
    status: 'Draft',
    reach: 0,
    conversion: 0
  }
];

export const SEGMENT_STATS = [
  { name: 'Champions', value: 15, color: '#006C4F' }, // Bank Sumut Green
  { name: 'Loyal', value: 25, color: '#22c55e' },
  { name: 'Potential', value: 30, color: '#FDB813' }, // Bank Sumut Yellow
  { name: 'At Risk', value: 20, color: '#f59e0b' },
  { name: 'Hibernating', value: 10, color: '#ef4444' },
];