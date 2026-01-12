import { RFMSegment, User, Campaign, CampaignInteraction } from './types';

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
  age: 22,
  accountStatus: 'Active',
  accountCreatedDate: '2023-06-15',
  // NEW: Contact & Profile Data
  email: 'budi.tarigan@gmail.com',
  phone: '081234567890',
  location: 'Medan',
  occupation: 'Mahasiswa',
  preferredDays: ['Senin', 'Rabu', 'Jumat'],
  gender: 'M',
  campaignHistory: [
    {
      id: 'ci1',
      campaignId: 'c1',
      campaignTitle: 'Promo Gajian: Diskon 50% Merdeka Walk',
      interactionType: 'click',
      timestamp: '2023-10-20T14:30:00Z'
    },
    {
      id: 'ci2',
      campaignId: 'c2',
      campaignTitle: 'Misi "Back to Campus" USU',
      interactionType: 'convert',
      timestamp: '2023-09-15T10:15:00Z',
      conversionAmount: 150000
    },
    {
      id: 'ci3',
      campaignId: 'c3',
      campaignTitle: 'Winback: Gratis Topup E-Money',
      interactionType: 'view',
      timestamp: '2023-08-05T09:00:00Z'
    }
  ],
  dreamSavers: [
    {
      id: 'ds1',
      name: 'Konser Coldplay',
      targetAmount: 3500000,
      currentAmount: 2100000,
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=300',
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
  preferredChannel: 'Mobile App',
  activeTimeSlot: '19:00-22:00',
  interactions: [
    {
      id: 'int1',
      type: 'call',
      subject: 'Tanya limit transfer harian',
      description: 'Customer ingin menaikkan limit transfer dari Rp 25jt ke Rp 50jt',
      status: 'resolved',
      timestamp: '2024-01-10T10:30:00',
      assignedTo: 'CS Team A',
      channel: 'Call Center 1500-888'
    },
    {
      id: 'int2',
      type: 'chat',
      subject: 'Komplain delay transaksi',
      description: 'Transfer ke BCA belum masuk setelah 2 jam',
      status: 'resolved',
      timestamp: '2024-01-08T15:45:00',
      assignedTo: 'CS Team B',
      channel: 'WhatsApp Banking'
    },
    {
      id: 'int3',
      type: 'email',
      subject: 'Request statement bulanan',
      status: 'resolved',
      timestamp: '2024-01-05T09:15:00',
      assignedTo: 'CS Team A',
      channel: 'Email Support'
    }
  ],
  transactions: [
    // F&B transactions
    { id: 't1', merchant: 'Macehat Coffee', amount: 45000, date: '2023-10-25', category: 'F&B' },
    { id: 't2', merchant: 'Soto Kesawan', amount: 35000, date: '2023-10-24', category: 'F&B' },
    
    // Regional Utilities - PDAM Tirtanadi (Medan & Sekitar)
    { 
      id: 't3', 
      merchant: 'PDAM Tirtanadi', 
      amount: 125000, 
      date: '2023-10-22', 
      category: 'Utilities',
      subcategory: 'PDAM',
      provider: 'Tirtanadi',
      isRecurring: true,
      billNumber: '1234567890'
    },
    
    // BPJS Kesehatan
    { 
      id: 't4', 
      merchant: 'BPJS Kesehatan', 
      amount: 150000, 
      date: '2023-10-20', 
      category: 'Recurring Bills',
      subcategory: 'BPJS',
      provider: 'BPJS Kesehatan',
      isRecurring: true,
      billNumber: '0001234567891'
    },
    
    // Telkom Indihome
    { 
      id: 't5', 
      merchant: 'Telkom Indihome', 
      amount: 450000, 
      date: '2023-10-18', 
      category: 'Utilities',
      subcategory: 'Telkom',
      provider: 'Indihome',
      isRecurring: true,
      billNumber: '121234567890'
    },
    
    // Entertainment
    { id: 't6', merchant: 'Centre Point XXI', amount: 50000, date: '2023-10-15', category: 'Entertainment' },
    
    // Transport
    { id: 't7', merchant: 'Gojek Medan', amount: 24000, date: '2023-10-12', category: 'Transport' },
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
    age: 24,
    accountStatus: 'Premium',
    accountCreatedDate: '2022-01-10',
    email: 'siti.aminah@yahoo.com',
    phone: '082112345678',
    location: 'Binjai',
    occupation: 'Pengusaha',
    preferredDays: ['Selasa', 'Kamis', 'Sabtu'],
    gender: 'F',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-promo1', campaignTitle: 'Promo Saldo Gede', interactionType: 'convert', timestamp: '2024-01-12', conversionAmount: 500000 },
      { id: 'c2', campaignId: 'camp-cashback1', campaignTitle: 'Cashback Makan', interactionType: 'click', timestamp: '2024-01-05' },
      { id: 'c3', campaignId: 'camp-reward1', campaignTitle: 'Reward Loyal Customer', interactionType: 'view', timestamp: '2023-12-20' },
    ],
    preferredChannel: 'Mobile App',
    activeTimeSlot: '20:00-23:00',
    interactions: [
      {
        id: 'int-s1',
        type: 'call',
        subject: 'Upgrade ke akun premium',
        description: 'Customer request upgrade benefits dan cashback lebih tinggi',
        status: 'resolved',
        timestamp: '2024-01-15T14:20:00',
        assignedTo: 'VIP Team',
        channel: 'Premium Hotline 1500-999'
      },
      {
        id: 'int-s2',
        type: 'chat',
        subject: 'Tanya promo utility bill',
        status: 'resolved',
        timestamp: '2024-01-10T11:30:00',
        assignedTo: 'CS Team A',
        channel: 'WhatsApp Banking'
      }
    ],
    transactions: [
      // Utility Champion - 6 recurring bills
      { id: 't101', merchant: 'PDAM Tirtabulian', amount: 180000, date: '2023-10-25', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtabulian', isRecurring: true, billNumber: '9876543210' },
      { id: 't102', merchant: 'BPJS Kesehatan', amount: 150000, date: '2023-10-23', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true, billNumber: '0009876543211' },
      { id: 't103', merchant: 'Telkom Indihome', amount: 500000, date: '2023-10-22', category: 'Utilities', subcategory: 'Telkom', provider: 'Indihome', isRecurring: true, billNumber: '129876543210' },
      { id: 't104', merchant: 'PLN Pascabayar', amount: 420000, date: '2023-10-20', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Pascabayar', isRecurring: true, billNumber: '532987654321' },
      { id: 't105', merchant: 'Indovision', amount: 250000, date: '2023-10-18', category: 'Recurring Bills', subcategory: 'TV Cable', provider: 'Indovision', isRecurring: true },
      { id: 't106', merchant: 'BPJS Ketenagakerjaan', amount: 200000, date: '2023-10-15', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Ketenagakerjaan', isRecurring: true, billNumber: '0009876543212' },
    ],
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
    age: 20,
    accountStatus: 'Active',
    accountCreatedDate: '2023-05-20',
    email: 'rian.siregar@hotmail.com',
    phone: '085678901234',
    location: 'Pematangsiantar',
    occupation: 'Pelajar',
    preferredDays: ['Sabtu', 'Minggu'],
    gender: 'M',
    campaignHistory: [
      { id: 'ci6', campaignId: 'c3', campaignTitle: 'Winback: Gratis Topup E-Money', interactionType: 'ignore', timestamp: '2023-08-10T08:00:00Z' }
    ],
    preferredChannel: 'ATM',
    activeTimeSlot: '15:00-17:00',
    interactions: [
      {
        id: 'int-r1',
        type: 'ticket',
        subject: 'Komplain transaksi gagal',
        description: 'ATM error saat tarik tunai, saldo terpotong tapi uang tidak keluar',
        status: 'in_progress',
        timestamp: '2024-01-14T16:45:00',
        assignedTo: 'Technical Support',
        channel: 'Customer Care Email'
      },
      {
        id: 'int-r2',
        type: 'call',
        subject: 'Follow up komplain',
        status: 'open',
        timestamp: '2024-01-16T10:00:00',
        assignedTo: 'CS Team B',
        channel: 'Call Center 1500-888'
      }
    ],
    transactions: [
      // At Risk - minimal utility (only 1 old PLN)
      { id: 't201', merchant: 'PLN Prabayar', amount: 150000, date: '2023-08-15', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Prabayar', isRecurring: true, billNumber: '532111222333' },
      { id: 't202', merchant: 'Warung Padang', amount: 25000, date: '2023-08-12', category: 'F&B' },
    ],
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
    age: 23,
    accountStatus: 'Active',
    accountCreatedDate: '2022-08-15',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-winback1', campaignTitle: 'Winback Discount 50%', interactionType: 'ignore', timestamp: '2024-01-08' },
      { id: 'c2', campaignId: 'camp-retry1', campaignTitle: 'Coba Lagi Yuk!', interactionType: 'view', timestamp: '2023-12-15' },
    ],
    preferredChannel: 'ATM',
    activeTimeSlot: '15:00-17:00',
    interactions: [
      {
        id: 'int-r1',
        type: 'ticket',
        subject: 'Komplain transaksi gagal',
        description: 'ATM error saat tarik tunai, saldo terpotong tapi uang tidak keluar',
        status: 'in_progress',
        timestamp: '2024-01-14T16:45:00',
        assignedTo: 'Technical Support',
        channel: 'Customer Care Email'
      },
      {
        id: 'int-r2',
        type: 'call',
        subject: 'Follow up komplain',
        status: 'open',
        timestamp: '2024-01-16T10:00:00',
        assignedTo: 'CS Team B',
        channel: 'Call Center 1500-888'
      }
    ],
    transactions: [
      // Loyal - 3 utilities (PDAM Tirtauli + BPJS + Indihome)
      { id: 't301', merchant: 'PDAM Tirtauli', amount: 95000, date: '2023-10-24', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtauli', isRecurring: true, billNumber: '5555666777' },
      { id: 't302', merchant: 'BPJS Kesehatan', amount: 100000, date: '2023-10-22', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true, billNumber: '0005556667771' },
      { id: 't303', merchant: 'Telkom Indihome', amount: 400000, date: '2023-10-20', category: 'Utilities', subcategory: 'Telkom', provider: 'Indihome', isRecurring: true, billNumber: '125556667770' },
      { id: 't304', merchant: 'Cafe Lekker', amount: 55000, date: '2023-10-18', category: 'F&B' },
    ],
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
    age: 19,
    accountStatus: 'Dormant',
    accountCreatedDate: '2023-09-01',
    campaignHistory: [],
    preferredChannel: 'Branch',
    activeTimeSlot: '10:00-11:00',
    interactions: [],
    transactions: [
      // Hibernating - NO utility (only old F&B/Shopping)
      { id: 't401', merchant: 'Martabak Asan', amount: 45000, date: '2023-06-10', category: 'F&B' },
      { id: 't402', merchant: 'Indomaret', amount: 75000, date: '2023-05-22', category: 'Shopping' },
    ],
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
    age: 21,
    accountStatus: 'Active',
    accountCreatedDate: '2023-03-12',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-welcome1', campaignTitle: 'Welcome Bonus', interactionType: 'convert', timestamp: '2024-01-10', conversionAmount: 100000 },
    ],
    preferredChannel: 'Web',
    activeTimeSlot: '09:00-12:00',
    interactions: [
      {
        id: 'int-j1',
        type: 'email',
        subject: 'Request e-statement',
        description: 'Minta rekening koran 3 bulan terakhir untuk pengajuan visa',
        status: 'resolved',
        timestamp: '2024-01-11T09:15:00',
        assignedTo: 'Document Team',
        channel: 'Email Support'
      }
    ],
    transactions: [
      // Potential - 2 utilities (PDAM + BPJS)
      { id: 't501', merchant: 'PDAM Tirtanadi', amount: 110000, date: '2023-10-23', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtanadi', isRecurring: true, billNumber: '3334445556' },
      { id: 't502', merchant: 'BPJS Kesehatan', amount: 120000, date: '2023-10-21', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true, billNumber: '0003334445561' },
      { id: 't503', merchant: 'Shopee', amount: 250000, date: '2023-10-19', category: 'Shopping' },
    ],
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
    age: 22,
    accountStatus: 'Active',
    accountCreatedDate: '2022-11-20',
    campaignHistory: [
      { id: 'ci10', campaignId: 'c1', campaignTitle: 'Promo Gajian: Diskon 50% Merdeka Walk', interactionType: 'view', timestamp: '2023-10-19T10:00:00Z' },
      { id: 'ci11', campaignId: 'c1', campaignTitle: 'Promo Gajian: Diskon 50% Merdeka Walk', interactionType: 'click', timestamp: '2023-10-20T11:30:00Z' }
    ],
    transactions: [
      // Loyal - 4 utilities (PDAM + BPJS + Telkom + PLN)
      { id: 't601', merchant: 'PDAM Tirtanadi', amount: 135000, date: '2023-10-25', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtanadi', isRecurring: true, billNumber: '7778889990' },
      { id: 't602', merchant: 'BPJS Kesehatan', amount: 140000, date: '2023-10-23', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true, billNumber: '0007778889991' },
      { id: 't603', merchant: 'Telkom Indihome', amount: 480000, date: '2023-10-21', category: 'Utilities', subcategory: 'Telkom', provider: 'Indihome', isRecurring: true, billNumber: '127778889990' },
      { id: 't604', merchant: 'PLN Pascabayar', amount: 350000, date: '2023-10-19', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Pascabayar', isRecurring: true, billNumber: '532777888999' },
      { id: 't605', merchant: 'Starbucks', amount: 85000, date: '2023-10-17', category: 'F&B' },
    ],
    dreamSavers: []
  },

  // 7. Rahmat Hidayat - Champions (High spender, frequent utility user)
  {
    ...MOCK_USER,
    id: '7',
    name: 'Rahmat Hidayat',
    email: 'rahmat.hidayat@email.com',
    phone: '0812-7654-3210',
    avatar: 'https://i.pravatar.cc/150?img=12',
    balance: 12500000,
    points: 4200,
    level: 15,
    xp: 88,
    segment: RFMSegment.CHAMPIONS,
    rfmScore: { recency: 5, frequency: 5, monetary: 5 },
    age: 42,
    occupation: 'Pengusaha',
    accountStatus: 'Premium',
    accountCreatedDate: '2021-05-10',
    preferredChannel: 'Mobile App',
    activeTimeSlot: '18:00-21:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-vip1', campaignTitle: 'VIP Exclusive Promo', interactionType: 'convert', timestamp: '2024-01-14', conversionAmount: 750000 }
    ],
    interactions: [
      {
        id: 'int-r1',
        type: 'chat',
        subject: 'Tanya produk investasi',
        description: 'Ingin informasi deposito dan reksadana',
        status: 'resolved',
        timestamp: '2024-01-12T10:00:00',
        assignedTo: 'Investment Team',
        channel: 'WhatsApp Banking'
      }
    ],
    transactions: [
      { id: 't700', merchant: 'PDAM Tirtanadi', amount: 150000, date: '2024-01-15', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtanadi', isRecurring: true },
      { id: 't701', merchant: 'PLN Prabayar', amount: 500000, date: '2024-01-14', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Prabayar', isRecurring: true },
      { id: 't702', merchant: 'Telkom Indihome', amount: 350000, date: '2024-01-10', category: 'Recurring Bills', subcategory: 'Internet', provider: 'Telkom', isRecurring: true },
      { id: 't703', merchant: 'Grab Food', amount: 125000, date: '2024-01-08', category: 'F&B' },
      { id: 't704', merchant: 'Indomaret', amount: 450000, date: '2024-01-05', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 8. Nina Kartika - Loyal (Consistent user, moderate spending)
  {
    ...MOCK_USER,
    id: '8',
    name: 'Nina Kartika',
    email: 'nina.kartika@email.com',
    phone: '0813-9876-5432',
    avatar: 'https://i.pravatar.cc/150?img=45',
    balance: 4200000,
    points: 1650,
    level: 9,
    xp: 62,
    segment: RFMSegment.LOYAL,
    rfmScore: { recency: 4, frequency: 4, monetary: 3 },
    age: 29,
    occupation: 'Karyawan Swasta',
    accountStatus: 'Active',
    accountCreatedDate: '2022-11-20',
    preferredChannel: 'Web',
    activeTimeSlot: '12:00-14:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-lunch1', campaignTitle: 'Lunch Hour Deals', interactionType: 'click', timestamp: '2024-01-13' }
    ],
    interactions: [],
    transactions: [
      { id: 't800', merchant: 'BPJS Kesehatan', amount: 150000, date: '2024-01-12', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true },
      { id: 't801', merchant: 'Starbucks', amount: 95000, date: '2024-01-10', category: 'F&B' },
      { id: 't802', merchant: 'Tokopedia', amount: 380000, date: '2024-01-06', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 9. Dedi Prasetyo - At Risk (Declining engagement)
  {
    ...MOCK_USER,
    id: '9',
    name: 'Dedi Prasetyo',
    email: 'dedi.prasetyo@email.com',
    phone: '0856-1234-5678',
    avatar: 'https://i.pravatar.cc/150?img=33',
    balance: 850000,
    points: 320,
    level: 4,
    xp: 25,
    segment: RFMSegment.AT_RISK,
    rfmScore: { recency: 2, frequency: 2, monetary: 2 },
    age: 51,
    occupation: 'Wiraswasta',
    accountStatus: 'Active',
    accountCreatedDate: '2023-04-15',
    preferredChannel: 'Branch',
    activeTimeSlot: '10:00-11:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-winback2', campaignTitle: 'Come Back Promo', interactionType: 'ignore', timestamp: '2024-01-05' }
    ],
    interactions: [
      {
        id: 'int-d1',
        type: 'call',
        subject: 'Lupa PIN ATM',
        status: 'resolved',
        timestamp: '2023-12-20T09:30:00',
        assignedTo: 'CS Team C',
        channel: 'Call Center 1500-888'
      }
    ],
    transactions: [
      { id: 't900', merchant: 'Alfamart', amount: 145000, date: '2023-12-18', category: 'Shopping' },
      { id: 't901', merchant: 'Warteg Bahari', amount: 35000, date: '2023-12-10', category: 'F&B' }
    ],
    dreamSavers: []
  },

  // 10. Fitri Handayani - Potential Loyalist (New but active)
  {
    ...MOCK_USER,
    id: '10',
    name: 'Fitri Handayani',
    email: 'fitri.handayani@email.com',
    phone: '0821-4567-8901',
    avatar: 'https://i.pravatar.cc/150?img=48',
    balance: 3100000,
    points: 890,
    level: 6,
    xp: 45,
    segment: RFMSegment.POTENTIAL,
    rfmScore: { recency: 5, frequency: 3, monetary: 3 },
    age: 26,
    accountStatus: 'Active',
    accountCreatedDate: '2023-11-01',
    preferredChannel: 'Mobile App',
    activeTimeSlot: '20:00-22:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-newuser1', campaignTitle: 'New User Bonus', interactionType: 'convert', timestamp: '2023-11-05', conversionAmount: 200000 }
    ],
    interactions: [
      {
        id: 'int-f1',
        type: 'chat',
        subject: 'Cara pakai QRIS',
        status: 'resolved',
        timestamp: '2023-11-10T19:45:00',
        assignedTo: 'Support Team',
        channel: 'Live Chat'
      }
    ],
    transactions: [
      { id: 't1000', merchant: 'PDAM Tirtauli', amount: 95000, date: '2024-01-11', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtauli', isRecurring: true },
      { id: 't1001', merchant: 'Shopee', amount: 420000, date: '2024-01-08', category: 'Shopping' },
      { id: 't1002', merchant: 'Lazada', amount: 310000, date: '2024-01-03', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 11. Herman Putra - Hibernating (Dormant account)
  {
    ...MOCK_USER,
    id: '11',
    name: 'Herman Putra',
    email: 'herman.putra@email.com',
    phone: '0822-3456-7890',
    avatar: 'https://i.pravatar.cc/150?img=51',
    balance: 425000,
    points: 50,
    level: 2,
    xp: 8,
    segment: RFMSegment.HIBERNATING,
    rfmScore: { recency: 1, frequency: 1, monetary: 1 },
    age: 58,
    accountStatus: 'Dormant',
    accountCreatedDate: '2023-03-10',
    preferredChannel: 'ATM',
    activeTimeSlot: '09:00-10:00',
    campaignHistory: [],
    interactions: [],
    transactions: [
      { id: 't1100', merchant: 'ATM Withdrawal', amount: 500000, date: '2023-09-15', category: 'Transfer' },
      { id: 't1101', merchant: 'Minimarket', amount: 85000, date: '2023-08-20', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 12. Linda Susanti - Champions (VIP customer, high utility spend)
  {
    ...MOCK_USER,
    id: '12',
    name: 'Linda Susanti',
    email: 'linda.susanti@email.com',
    phone: '0811-2233-4455',
    avatar: 'https://i.pravatar.cc/150?img=47',
    balance: 15800000,
    points: 5100,
    level: 18,
    xp: 95,
    segment: RFMSegment.CHAMPIONS,
    rfmScore: { recency: 5, frequency: 5, monetary: 5 },
    age: 45,
    accountStatus: 'Premium',
    accountCreatedDate: '2021-02-14',
    preferredChannel: 'Mobile App',
    activeTimeSlot: '07:00-09:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-morning1', campaignTitle: 'Early Bird Cashback', interactionType: 'convert', timestamp: '2024-01-16', conversionAmount: 850000 },
      { id: 'c2', campaignId: 'camp-vip2', campaignTitle: 'VIP Rewards', interactionType: 'convert', timestamp: '2024-01-10', conversionAmount: 1200000 }
    ],
    interactions: [
      {
        id: 'int-l1',
        type: 'email',
        subject: 'Upgrade limit kartu kredit',
        description: 'Request peningkatan limit dari 50jt ke 100jt',
        status: 'in_progress',
        timestamp: '2024-01-15T08:00:00',
        assignedTo: 'Credit Team',
        channel: 'Email VIP'
      }
    ],
    transactions: [
      { id: 't1200', merchant: 'PDAM Tirtanadi', amount: 180000, date: '2024-01-16', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtanadi', isRecurring: true },
      { id: 't1201', merchant: 'BPJS Kesehatan', amount: 450000, date: '2024-01-15', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true },
      { id: 't1202', merchant: 'Telkom Indihome', amount: 550000, date: '2024-01-14', category: 'Recurring Bills', subcategory: 'Internet', provider: 'Telkom', isRecurring: true },
      { id: 't1203', merchant: 'PLN Pascabayar', amount: 750000, date: '2024-01-12', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Pascabayar', isRecurring: true },
      { id: 't1204', merchant: 'Netflix', amount: 186000, date: '2024-01-10', category: 'Recurring Bills', subcategory: 'Entertainment', provider: 'Netflix', isRecurring: true },
      { id: 't1205', merchant: 'First Class Salon', amount: 650000, date: '2024-01-08', category: 'F&B' }
    ],
    dreamSavers: []
  },

  // 13. Agus Setiawan - Loyal (Steady contributor)
  {
    ...MOCK_USER,
    id: '13',
    name: 'Agus Setiawan',
    email: 'agus.setiawan@email.com',
    phone: '0819-5555-6666',
    avatar: 'https://i.pravatar.cc/150?img=13',
    balance: 5600000,
    points: 2100,
    level: 11,
    xp: 70,
    segment: RFMSegment.LOYAL,
    rfmScore: { recency: 4, frequency: 4, monetary: 4 },
    age: 38,
    accountStatus: 'Active',
    accountCreatedDate: '2022-06-20',
    preferredChannel: 'Web',
    activeTimeSlot: '21:00-23:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-night1', campaignTitle: 'Night Owl Deals', interactionType: 'convert', timestamp: '2024-01-12', conversionAmount: 400000 }
    ],
    interactions: [],
    transactions: [
      { id: 't1300', merchant: 'PDAM Tirtabulian', amount: 125000, date: '2024-01-13', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtabulian', isRecurring: true },
      { id: 't1301', merchant: 'Indihome', amount: 395000, date: '2024-01-11', category: 'Recurring Bills', subcategory: 'Internet', provider: 'Telkom', isRecurring: true },
      { id: 't1302', merchant: 'Blibli', amount: 520000, date: '2024-01-07', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 14. Maya Sari - Potential (Growing user)
  {
    ...MOCK_USER,
    id: '14',
    name: 'Maya Sari',
    email: 'maya.sari@email.com',
    phone: '0857-7777-8888',
    avatar: 'https://i.pravatar.cc/150?img=44',
    balance: 2850000,
    points: 720,
    level: 5,
    xp: 38,
    segment: RFMSegment.POTENTIAL,
    rfmScore: { recency: 4, frequency: 3, monetary: 2 },
    age: 24,
    accountStatus: 'Active',
    accountCreatedDate: '2023-09-15',
    preferredChannel: 'Mobile App',
    activeTimeSlot: '18:00-20:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-student1', campaignTitle: 'Student Discount', interactionType: 'click', timestamp: '2024-01-09' }
    ],
    interactions: [
      {
        id: 'int-m1',
        type: 'chat',
        subject: 'Tanya promo cicilan 0%',
        status: 'resolved',
        timestamp: '2024-01-07T18:30:00',
        assignedTo: 'Sales Team',
        channel: 'WhatsApp Banking'
      }
    ],
    transactions: [
      { id: 't1400', merchant: 'BPJS Kesehatan', amount: 100000, date: '2024-01-12', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true },
      { id: 't1401', merchant: 'Gojek', amount: 75000, date: '2024-01-10', category: 'Transport' },
      { id: 't1402', merchant: 'Mixue', amount: 28000, date: '2024-01-08', category: 'F&B' }
    ],
    dreamSavers: []
  },

  // 15. Rudi Hermawan - At Risk (Declining activity)
  {
    ...MOCK_USER,
    id: '15',
    name: 'Rudi Hermawan',
    email: 'rudi.hermawan@email.com',
    phone: '0896-4444-3333',
    avatar: 'https://i.pravatar.cc/150?img=52',
    balance: 1250000,
    points: 180,
    level: 3,
    xp: 15,
    segment: RFMSegment.AT_RISK,
    rfmScore: { recency: 2, frequency: 2, monetary: 2 },
    age: 47,
    accountStatus: 'Active',
    accountCreatedDate: '2022-10-05',
    preferredChannel: 'ATM',
    activeTimeSlot: '16:00-17:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-reactivate1', campaignTitle: 'Reactivation Bonus', interactionType: 'view', timestamp: '2023-12-25' }
    ],
    interactions: [
      {
        id: 'int-ru1',
        type: 'ticket',
        subject: 'ATM card rusak',
        description: 'Kartu ATM tidak terbaca di mesin',
        status: 'open',
        timestamp: '2024-01-14T15:00:00',
        assignedTo: 'Card Services',
        channel: 'Branch Visit'
      }
    ],
    transactions: [
      { id: 't1500', merchant: 'Minimarket', amount: 95000, date: '2023-12-28', category: 'Shopping' },
      { id: 't1501', merchant: 'Warung Makan', amount: 45000, date: '2023-12-20', category: 'F&B' }
    ],
    dreamSavers: []
  },

  // 16. Tuti Rahayu - Champions (Consistent high-value customer)
  {
    ...MOCK_USER,
    id: '16',
    name: 'Tuti Rahayu',
    email: 'tuti.rahayu@email.com',
    phone: '0815-6666-7777',
    avatar: 'https://i.pravatar.cc/150?img=49',
    balance: 11200000,
    points: 3850,
    level: 14,
    xp: 82,
    segment: RFMSegment.CHAMPIONS,
    rfmScore: { recency: 5, frequency: 5, monetary: 5 },
    age: 39,
    accountStatus: 'Premium',
    accountCreatedDate: '2021-08-12',
    preferredChannel: 'Mobile App',
    activeTimeSlot: '11:00-13:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-lunch2', campaignTitle: 'Lunch Cashback 30%', interactionType: 'convert', timestamp: '2024-01-15', conversionAmount: 650000 }
    ],
    interactions: [],
    transactions: [
      { id: 't1600', merchant: 'PDAM Tirtanadi', amount: 165000, date: '2024-01-16', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtanadi', isRecurring: true },
      { id: 't1601', merchant: 'PLN Pascabayar', amount: 680000, date: '2024-01-15', category: 'Utilities', subcategory: 'PLN', provider: 'PLN Pascabayar', isRecurring: true },
      { id: 't1602', merchant: 'Telkom Indihome', amount: 499000, date: '2024-01-13', category: 'Recurring Bills', subcategory: 'Internet', provider: 'Telkom', isRecurring: true },
      { id: 't1603', merchant: 'Sushi Tei', amount: 580000, date: '2024-01-12', category: 'F&B' },
      { id: 't1604', merchant: 'Zalora', amount: 1250000, date: '2024-01-09', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 17. Wawan Gunawan - Hibernating (Nearly inactive)
  {
    ...MOCK_USER,
    id: '17',
    name: 'Wawan Gunawan',
    email: 'wawan.gunawan@email.com',
    phone: '0878-9999-0000',
    avatar: 'https://i.pravatar.cc/150?img=54',
    balance: 380000,
    points: 25,
    level: 1,
    xp: 5,
    segment: RFMSegment.HIBERNATING,
    rfmScore: { recency: 1, frequency: 1, monetary: 1 },
    age: 62,
    accountStatus: 'Dormant',
    accountCreatedDate: '2023-01-20',
    preferredChannel: 'Branch',
    activeTimeSlot: '08:00-09:00',
    campaignHistory: [],
    interactions: [],
    transactions: [
      { id: 't1700', merchant: 'Pasar Tradisional', amount: 150000, date: '2023-07-10', category: 'Shopping' }
    ],
    dreamSavers: []
  },

  // 18. Yuli Andriani - Loyal (Stable, regular user)
  {
    ...MOCK_USER,
    id: '18',
    name: 'Yuli Andriani',
    email: 'yuli.andriani@email.com',
    phone: '0838-1111-2222',
    avatar: 'https://i.pravatar.cc/150?img=25',
    balance: 4750000,
    points: 1920,
    level: 10,
    xp: 65,
    segment: RFMSegment.LOYAL,
    rfmScore: { recency: 4, frequency: 4, monetary: 3 },
    age: 33,
    accountStatus: 'Active',
    accountCreatedDate: '2022-03-08',
    preferredChannel: 'Web',
    activeTimeSlot: '14:00-16:00',
    campaignHistory: [
      { id: 'c1', campaignId: 'camp-afternoon1', campaignTitle: 'Afternoon Delight', interactionType: 'convert', timestamp: '2024-01-14', conversionAmount: 350000 }
    ],
    interactions: [
      {
        id: 'int-y1',
        type: 'email',
        subject: 'Request rekening koran',
        status: 'resolved',
        timestamp: '2024-01-11T14:15:00',
        assignedTo: 'Document Team',
        channel: 'Email Support'
      }
    ],
    transactions: [
      { id: 't1800', merchant: 'PDAM Tirtauli', amount: 115000, date: '2024-01-15', category: 'Utilities', subcategory: 'PDAM', provider: 'Tirtauli', isRecurring: true },
      { id: 't1801', merchant: 'BPJS Kesehatan', amount: 160000, date: '2024-01-14', category: 'Recurring Bills', subcategory: 'BPJS', provider: 'BPJS Kesehatan', isRecurring: true },
      { id: 't1802', merchant: 'Grab Food', amount: 95000, date: '2024-01-12', category: 'F&B' },
      { id: 't1803', merchant: 'Guardian', amount: 280000, date: '2024-01-09', category: 'Shopping' }
    ],
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

// Regional Utility Providers (Bank Sumut Specific)
export const UTILITY_PROVIDERS = {
  PDAM: ['Tirtanadi', 'Tirtabulian', 'Tirtauli'],
  BPJS: ['BPJS Kesehatan', 'BPJS Ketenagakerjaan'],
  Telkom: ['Indihome', 'Telkom Halo', 'Telkom Fixed'],
  Internet: ['Indihome', 'Biznet', 'MyRepublic'],
  TVCable: ['Indovision', 'Transvision', 'K-Vision', 'MNC Play'],
  PLN: ['PLN Prabayar', 'PLN Pascabayar'],
  Government: ['Pajak Online', 'E-Samsat Sumut']
};

export const CATEGORY_ICONS: Record<string, string> = {
  'F&B': '☕',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Utilities': '💡',
  'Recurring Bills': '📄',
  'Government Services': '🏛️',
  'Education': '📚',
  'Healthcare': '🏥'
};

// Mock Loan Applications for Pipeline Kanban
export const MOCK_LOAN_APPLICATIONS = [
  { id: 'loan001', customerId: 'u001', customerName: 'Budi Tarigan', customerAvatar: 'https://i.pravatar.cc/150?u=u001', productType: 'KUR', amount: 50000000, stage: 'new_lead', assignedRM: 'Ahmad Rizki', createdDate: '2024-01-15', lastUpdated: '2024-01-15', daysInStage: 2, nextAction: 'Hubungi untuk verifikasi data', priority: 'high' },
  { id: 'loan002', customerId: 'u010', customerName: 'Fitri Handayani', customerAvatar: 'https://i.pravatar.cc/150?u=u010', productType: 'Kredit Mikro', amount: 25000000, stage: 'new_lead', assignedRM: 'Dewi Sartika', createdDate: '2024-01-16', lastUpdated: '2024-01-16', daysInStage: 1, nextAction: 'Follow-up WhatsApp', priority: 'medium' },
  { id: 'loan003', customerId: 'u002', customerName: 'Siti Aminah', customerAvatar: 'https://i.pravatar.cc/150?u=u002', productType: 'KPR', amount: 500000000, stage: 'contacted', assignedRM: 'Ahmad Rizki', createdDate: '2024-01-10', lastUpdated: '2024-01-14', daysInStage: 3, nextAction: 'Jadwalkan survey rumah', priority: 'high' },
  { id: 'loan004', customerId: 'u008', customerName: 'Nina Kartika', customerAvatar: 'https://i.pravatar.cc/150?u=u008', productType: 'Kartu Kredit', amount: 15000000, stage: 'contacted', assignedRM: 'Dewi Sartika', createdDate: '2024-01-12', lastUpdated: '2024-01-15', daysInStage: 2, nextAction: 'Request slip gaji', priority: 'low' },
  { id: 'loan005', customerId: 'u004', customerName: 'Rian Siregar', customerAvatar: 'https://i.pravatar.cc/150?u=u004', productType: 'KUR', amount: 75000000, stage: 'doc_collection', assignedRM: 'Ahmad Rizki', createdDate: '2024-01-05', lastUpdated: '2024-01-08', daysInStage: 9, nextAction: 'URGENT: Follow-up dokumen NPWP', notes: 'Dokumen tidak lengkap', priority: 'high' },
  { id: 'loan006', customerId: 'u014', customerName: 'Maya Sari', customerAvatar: 'https://i.pravatar.cc/150?u=u014', productType: 'Kredit Mikro', amount: 30000000, stage: 'doc_collection', assignedRM: 'Dewi Sartika', createdDate: '2024-01-11', lastUpdated: '2024-01-13', daysInStage: 4, nextAction: 'Menunggu KTP baru', priority: 'medium' },
  { id: 'loan007', customerId: 'u007', customerName: 'Rahmat Hidayat', customerAvatar: 'https://i.pravatar.cc/150?u=u007', productType: 'KPR', amount: 750000000, stage: 'credit_scoring', assignedRM: 'Ahmad Rizki', createdDate: '2024-01-03', lastUpdated: '2024-01-14', daysInStage: 3, nextAction: 'Waiting BI Checking result', priority: 'high' },
  { id: 'loan008', customerId: 'u012', customerName: 'Linda Susanti', customerAvatar: 'https://i.pravatar.cc/150?u=u012', productType: 'KUR', amount: 200000000, stage: 'approval', assignedRM: 'Ahmad Rizki', createdDate: '2024-01-02', lastUpdated: '2024-01-15', daysInStage: 2, nextAction: 'Pending Kepala Cabang approval', priority: 'high' },
  { id: 'loan009', customerId: 'u013', customerName: 'Agus Setiawan', customerAvatar: 'https://i.pravatar.cc/150?u=u013', productType: 'Kredit Mikro', amount: 45000000, stage: 'approval', assignedRM: 'Dewi Sartika', createdDate: '2024-01-08', lastUpdated: '2024-01-16', daysInStage: 1, nextAction: 'Approved - prepare disbursement', priority: 'medium' },
  { id: 'loan010', customerId: 'u016', customerName: 'Tuti Rahayu', customerAvatar: 'https://i.pravatar.cc/150?u=u016', productType: 'KPR', amount: 350000000, stage: 'disbursement', assignedRM: 'Ahmad Rizki', createdDate: '2023-12-20', lastUpdated: '2024-01-16', daysInStage: 1, nextAction: 'Notaris signing scheduled', priority: 'high' },
  { id: 'loan011', customerId: 'u003', customerName: 'Jessica Tan', customerAvatar: 'https://i.pravatar.cc/150?u=u003', productType: 'KUR', amount: 100000000, stage: 'active', assignedRM: 'Ahmad Rizki', createdDate: '2023-11-15', lastUpdated: '2024-01-01', daysInStage: 16, priority: 'low' },
  { id: 'loan012', customerId: 'u018', customerName: 'Yuli Andriani', customerAvatar: 'https://i.pravatar.cc/150?u=u018', productType: 'Kredit Mikro', amount: 35000000, stage: 'active', assignedRM: 'Dewi Sartika', createdDate: '2023-12-01', lastUpdated: '2024-01-05', daysInStage: 12, priority: 'low' },
  { id: 'loan013', customerId: 'u011', customerName: 'Herman Putra', customerAvatar: 'https://i.pravatar.cc/150?u=u011', productType: 'KPR', amount: 400000000, stage: 'rejected', assignedRM: 'Ahmad Rizki', createdDate: '2023-12-10', lastUpdated: '2024-01-10', daysInStage: 7, notes: 'BI Checking: Kolektibilitas 3', priority: 'low' as const }
] as const;
