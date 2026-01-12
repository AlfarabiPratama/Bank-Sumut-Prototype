---
description: How to add new features to the SULTAN CRM application
---

# Adding New Features to SULTAN

## Before You Start

1. Understand the existing structure by reviewing:
   - `types.ts` for data interfaces
   - `constants.ts` for mock data patterns
   - Existing components in `components/admin/` or `components/mobile/`

2. Check if the feature requires:
   - New data types → Update `types.ts`
   - Mock data → Update `constants.ts`
   - New services → Create in `services/` folder
   - State management → Consider `contexts/` or local state

## Adding a New Admin Dashboard Tab

1. Open `components/admin/AdminDashboard.tsx`

2. Add new tab type to the `activeTab` state type:
   ```typescript
   const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'NEW_TAB' | ...>('overview');
   ```

3. Add navigation button in sidebar:
   ```tsx
   <SidebarItem 
     icon={<YourIcon size={20} />} 
     label="Tab Label" 
     active={activeTab === 'NEW_TAB'} 
     onClick={() => setActiveTab('NEW_TAB')} 
   />
   ```

4. Add tab content section:
   ```tsx
   {activeTab === 'NEW_TAB' && (
     <div className="space-y-6">
       {/* Your new tab content */}
     </div>
   )}
   ```

## Adding a New Mobile Screen

1. Open `components/mobile/MobileApp.tsx`

2. Add new tab to `activeTab` state:
   ```typescript
   const [activeTab, setActiveTab] = useState<'home' | 'history' | 'NEW_SCREEN' | ...>('home');
   ```

3. Create the view component inside MobileApp.tsx:
   ```tsx
   const NewScreenView = ({ user }: { user: User }) => (
     <div className="space-y-6">
       {/* Screen content */}
     </div>
   );
   ```

4. Add to render section:
   ```tsx
   {activeTab === 'NEW_SCREEN' && <NewScreenView user={currentUser} />}
   ```

## Adding New Customer Data Fields

1. Update `types.ts` with new interface properties:
   ```typescript
   export interface User {
     // existing fields...
     newField: string;
   }
   ```

2. Update mock data in `constants.ts`:
   ```typescript
   export const MOCK_USER: User = {
     // existing data...
     newField: 'value',
   };
   ```

3. Update `MOCK_CUSTOMERS_LIST` similarly

## Adding New RFM Calculations

1. Open `components/admin/AdminDashboard.tsx`

2. Find the `useMemo` calculations section (around line 98-250)

3. Add your new calculated metric:
   ```typescript
   const newMetric = useMemo(() => {
     return processedCustomers.map(customer => {
       // Your calculation logic
     });
   }, [processedCustomers, rfmConfig]);
   ```

## Adding New Charts

1. Import from Recharts:
   ```typescript
   import { LineChart, Line, AreaChart, Area } from 'recharts';
   ```

2. Create chart component:
   ```tsx
   <ResponsiveContainer width="100%" height={300}>
     <LineChart data={yourData}>
       <XAxis dataKey="name" />
       <YAxis />
       <Tooltip />
       <Line type="monotone" dataKey="value" stroke="#00AEEF" />
     </LineChart>
   </ResponsiveContainer>
   ```

## Testing Your Changes

// turbo
1. Run development server: `npm run dev`

2. Check browser at http://localhost:3000 (or 3001 if 3000 is in use)

3. Use browser DevTools to debug any issues

4. Verify responsiveness by resizing browser window
