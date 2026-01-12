/**
 * Generation Segmentation Service
 * Shared logic for age-based customer segmentation and contextual promos
 */

// Generation Segment Types
export type GenerationSegment = 'Gen-Z' | 'Millennial' | 'Gen-X' | 'Boomer';

// Age thresholds for each generation (based on 2024)
export const GENERATION_THRESHOLDS = {
  'Gen-Z': { min: 12, max: 27 },      // Born 1997-2012
  'Millennial': { min: 28, max: 43 }, // Born 1981-1996
  'Gen-X': { min: 44, max: 59 },      // Born 1965-1980
  'Boomer': { min: 60, max: 100 },    // Born before 1965
};

/**
 * Get generation segment from age
 * @param age Customer age (optional)
 * @returns GenerationSegment
 */
export const getGenerationSegment = (age: number | undefined): GenerationSegment => {
  if (!age) return 'Millennial'; // Default
  if (age <= 27) return 'Gen-Z';
  if (age <= 43) return 'Millennial';
  if (age <= 59) return 'Gen-X';
  return 'Boomer';
};

/**
 * Check if customer is Gen-Z
 */
export const isGenZ = (age: number | undefined): boolean => {
  return age !== undefined && age >= 18 && age <= 27;
};

/**
 * Get generation display info
 */
export const getGenerationInfo = (segment: GenerationSegment): {
  label: string;
  emoji: string;
  color: string;
  description: string;
} => {
  const info: Record<GenerationSegment, { label: string; emoji: string; color: string; description: string }> = {
    'Gen-Z': {
      label: 'Gen-Z',
      emoji: '🎮',
      color: 'purple',
      description: 'Digital native, coffee culture, QRIS heavy user'
    },
    'Millennial': {
      label: 'Millennial',
      emoji: '💼',
      color: 'blue',
      description: 'Tech-savvy, work-life balance, mobile banking'
    },
    'Gen-X': {
      label: 'Gen-X',
      emoji: '🏠',
      color: 'green',
      description: 'Family-oriented, financial stability'
    },
    'Boomer': {
      label: 'Boomer',
      emoji: '🏦',
      color: 'slate',
      description: 'Traditional banking, branch preferred'
    }
  };
  return info[segment];
};

// Contextual Promo Interface
export interface ContextualPromo {
  merchant: string;
  category: 'coffee' | 'fastfood' | 'fashion' | 'entertainment' | 'groceries' | 'utilities';
  discount: string;
  channel: string;
  location: string;
  copyMessage: string;
  qrisBonus?: boolean;
}

/**
 * Contextual Promo Templates by Generation
 * Used for age-based targeting recommendations
 */
export const CONTEXTUAL_PROMOS: Record<GenerationSegment, ContextualPromo[]> = {
  'Gen-Z': [
    { 
      merchant: 'Kopi Kenangan',
      category: 'coffee',
      discount: 'Cashback 30%',
      channel: 'Push Notification + Geo-Targeting',
      location: 'Merdeka Walk, Medan',
      copyMessage: '☕ Hai Sobat Gen-Z! Ngopi di Kopi Kenangan? Bayar pakai QRIS Bank Sumut, dapat cashback 30%! Cuma hari ini!',
      qrisBonus: true
    },
    { 
      merchant: 'Mixue',
      category: 'coffee',
      discount: 'Buy 1 Get 1',
      channel: 'In-App + Nearby Alert',
      location: 'Seluruh outlet Medan',
      copyMessage: '🧋 Mixue Buy 1 Get 1! Bayar pakai QRIS Bank Sumut, ajak temanmu sekarang! 🎉',
      qrisBonus: true
    },
    { 
      merchant: 'Shopee',
      category: 'fashion',
      discount: 'Gratis Ongkir',
      channel: 'Push Notification',
      location: 'Online',
      copyMessage: '🛒 Gratis Ongkir se-Indonesia! Belanja di Shopee pakai Bank Sumut. Buruan, kuota terbatas!',
      qrisBonus: false
    },
  ],
  'Millennial': [
    { 
      merchant: 'Starbucks',
      category: 'coffee',
      discount: 'Cashback 20%',
      channel: 'Email + Push',
      location: 'Sun Plaza',
      copyMessage: '☕ Work from cafe? Nikmati cashback 20% di Starbucks dengan QRIS Bank Sumut.',
      qrisBonus: true
    },
    { 
      merchant: 'XXI Cinema',
      category: 'entertainment',
      discount: 'Beli 2 Gratis 1',
      channel: 'Push Notification',
      location: 'Medan Fair',
      copyMessage: '🎬 Weekend movie date! Beli 2 tiket gratis 1 di XXI dengan Bank Sumut.',
      qrisBonus: false
    },
    { 
      merchant: 'Grab/Gojek',
      category: 'coffee',
      discount: 'Diskon 25% GrabFood',
      channel: 'In-App Banner',
      location: 'Seluruh Medan',
      copyMessage: '🍕 Lapar saat kerja? Diskon 25% GrabFood/GoFood bayar pakai Bank Sumut!',
      qrisBonus: true
    },
    { 
      merchant: 'Tokopedia',
      category: 'fashion',
      discount: 'Cashback s/d 100rb',
      channel: 'Push + Email',
      location: 'Online',
      copyMessage: '💳 Belanja hemat! Cashback s/d Rp100.000 di Tokopedia dengan Bank Sumut.',
      qrisBonus: false
    },
  ],
  'Gen-X': [
    { 
      merchant: 'Hypermart',
      category: 'groceries',
      discount: 'Diskon 15%',
      channel: 'SMS + Email',
      location: 'Hermes Place Polonia',
      copyMessage: '🛒 Belanja bulanan hemat 15% di Hypermart dengan kartu Bank Sumut.',
      qrisBonus: false
    },
    { 
      merchant: 'Ace Hardware',
      category: 'groceries',
      discount: 'Diskon 20%',
      channel: 'SMS',
      location: 'Sun Plaza',
      copyMessage: '🔧 Renovasi rumah? Diskon 20% peralatan rumah tangga di Ace Hardware.',
      qrisBonus: true
    },
    { 
      merchant: 'Apotek Kimia Farma',
      category: 'utilities',
      discount: 'Gratis Konsultasi',
      channel: 'SMS + WhatsApp',
      location: 'Seluruh Medan',
      copyMessage: '💊 Kesehatan keluarga prioritas! Gratis konsultasi + diskon 10% obat di Kimia Farma.',
      qrisBonus: false
    },
    { 
      merchant: 'Gramedia',
      category: 'entertainment',
      discount: 'Diskon 25% Buku',
      channel: 'Email',
      location: 'Sun Plaza',
      copyMessage: '📚 Buku baru untuk keluarga! Diskon 25% semua buku di Gramedia dengan Bank Sumut.',
      qrisBonus: true
    },
  ],
  'Boomer': [
    { 
      merchant: 'PLN',
      category: 'utilities',
      discount: 'Gratis Admin',
      channel: 'SMS',
      location: 'Online',
      copyMessage: 'Bayar tagihan listrik GRATIS biaya admin via Bank Sumut Mobile.',
      qrisBonus: false
    },
    { 
      merchant: 'PDAM Tirtanadi',
      category: 'utilities',
      discount: 'Gratis Admin',
      channel: 'SMS',
      location: 'Online',
      copyMessage: '💧 Bayar PDAM GRATIS biaya admin. Cukup dari Bank Sumut Mobile.',
      qrisBonus: false
    },
    { 
      merchant: 'Telkomsel',
      category: 'utilities',
      discount: 'Bonus Pulsa 10%',
      channel: 'SMS',
      location: 'Online',
      copyMessage: '📱 Isi pulsa dapat bonus 10%! Bayar via Bank Sumut Mobile.',
      qrisBonus: false
    },
    { 
      merchant: 'RS Columbia Asia',
      category: 'utilities',
      discount: 'Diskon Medical Check-up 30%',
      channel: 'WhatsApp + SMS',
      location: 'Medan',
      copyMessage: '🏥 Jaga kesehatan! Diskon 30% Medical Check-up di RS Columbia Asia untuk nasabah Bank Sumut.',
      qrisBonus: false
    },
  ],
};

/**
 * Get promos for a specific generation
 */
export const getPromosForGeneration = (segment: GenerationSegment): ContextualPromo[] => {
  return CONTEXTUAL_PROMOS[segment] || [];
};

/**
 * Get all promos across all generations
 */
export const getAllGenerationPromos = (): { segment: GenerationSegment; promos: ContextualPromo[] }[] => {
  return (Object.keys(CONTEXTUAL_PROMOS) as GenerationSegment[]).map(segment => ({
    segment,
    promos: CONTEXTUAL_PROMOS[segment]
  }));
};

/**
 * Get promos by category for a specific generation
 */
export const getPromosByCategory = (segment: GenerationSegment, category: ContextualPromo['category']): ContextualPromo[] => {
  return CONTEXTUAL_PROMOS[segment].filter(p => p.category === category);
};
