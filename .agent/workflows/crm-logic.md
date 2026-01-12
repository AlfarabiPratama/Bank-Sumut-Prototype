---
description: Guidelines for modifying RFM logic and CRM calculations
---

# Working with RFM & CRM Logic

## Understanding RFM Model

RFM = Recency, Frequency, Monetary

Each customer has scores (1-5) for:
- **Recency**: How recently they transacted (5 = very recent)
- **Frequency**: How often they transact (5 = very frequent)
- **Monetary**: How much they spend (5 = high value)

## Core Files for CRM Logic

| File | Purpose |
|------|---------|
| `types.ts` | RFMSegment enum, RFMConfig interface, User interface |
| `constants.ts` | MOCK_CUSTOMERS_LIST with rfmScore data |
| `components/admin/AdminDashboard.tsx` | RFM calculation engine (useMemo) |

## RFM Segments (types.ts)

```typescript
export enum RFMSegment {
  CHAMPIONS = 'Sultan Sejati (Champions)',
  LOYAL = 'Kawan Setia (Loyal)',
  POTENTIAL = 'Calon Sultan (Potential)',
  AT_RISK = 'Hampir Lupa (At Risk)',
  HIBERNATING = 'Tidur Panjang (Hibernating)',
}
```

## RFM Configuration Structure

```typescript
export interface RFMConfig {
  weights: {
    recency: number;    // 0-100, importance of recency
    frequency: number;  // 0-100, importance of frequency
    monetary: number;   // 0-100, importance of monetary
  };
  thresholds: {
    champion: number;   // Score >= this = Champions
    loyal: number;      // Score >= this = Loyal
    potential: number;  // Score >= this = Potential
    atRisk: number;     // Score >= this = At Risk
    // Below atRisk = Hibernating
  };
}
```

## Calculation Engine Location

In `AdminDashboard.tsx`, find `processedCustomers` useMemo (around line 98):

```typescript
const processedCustomers = useMemo(() => {
  return MOCK_CUSTOMERS_LIST.map(user => {
    const { recency, frequency, monetary } = user.rfmScore;
    const { weights, thresholds } = rfmConfig;
    
    // Weighted score calculation
    const weightedScore = (
      (recency * weights.recency) + 
      (frequency * weights.frequency) + 
      (monetary * weights.monetary)
    ) / totalWeight;

    // Segment assignment based on thresholds
    let newSegment = RFMSegment.HIBERNATING;
    if (weightedScore >= thresholds.champion) newSegment = RFMSegment.CHAMPIONS;
    else if (weightedScore >= thresholds.loyal) newSegment = RFMSegment.LOYAL;
    // ... etc
    
    return { ...user, segment: newSegment, calculatedScore };
  });
}, [rfmConfig]);
```

## Adding New CRM Metrics

1. Create new useMemo after existing calculations:
```typescript
const yourNewMetric = useMemo(() => {
  // Calculate based on processedCustomers or other data
  return processedCustomers.reduce((acc, customer) => {
    // Your logic here
  }, initialValue);
}, [processedCustomers]);
```

2. Use in dashboard UI:
```tsx
<KPICard title="Your Metric" value={yourNewMetric} />
```

## Testing RFM Changes

1. Start dev server: `npm run dev`
2. Go to Admin Dashboard
3. Navigate to "Konfigurasi RFM" tab
4. Adjust weights/thresholds using sliders
5. Observe segment distribution changes in "Executive Dashboard"

## Important Notes

- All RFM calculations happen in real-time (client-side)
- Config is persisted to localStorage
- Segment colors are consistent across all views
- Changes to thresholds immediately recalculate all segments
