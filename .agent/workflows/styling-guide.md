---
description: How to work with styling and UI components in SULTAN
---

# Styling & UI Components Guide

## Tailwind CSS Setup

This project uses Tailwind CSS v3 with custom Bank Sumut theme.

### Custom Colors (use these for brand consistency)

```css
/* Primary - Bank Sumut Blue */
bg-sumut-blue       /* #00AEEF */
text-sumut-blue
border-sumut-blue

/* Dark Blue */
bg-sumut-darkBlue   /* #007BB5 */

/* Accent - Orange */
bg-sumut-orange     /* #F7941D */
text-sumut-orange

/* Light Orange */
bg-sumut-orangeLight /* #FFF0D9 */

/* Grey */
bg-sumut-grey       /* #F3F4F6 */
```

### Custom Fonts

```css
font-sans      /* Inter - body text */
font-display   /* Space Grotesk - headings */
```

## Common UI Patterns

### Card Container
```tsx
<div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
  {/* Content */}
</div>
```

### Gradient Header (Blue)
```tsx
<div className="bg-gradient-to-br from-sumut-blue to-sumut-darkBlue p-6 rounded-xl text-white">
  {/* Content */}
</div>
```

### KPI Card Pattern
```tsx
<div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</p>
  <p className="text-2xl font-bold text-slate-800">{value}</p>
  <span className={`text-xs ${positive ? 'text-green-500' : 'text-red-500'}`}>
    {change}
  </span>
</div>
```

### Status Badge
```tsx
<span className={`px-2 py-1 rounded-full text-xs font-bold ${
  status === 'Active' ? 'bg-green-100 text-green-700' :
  status === 'Draft' ? 'bg-gray-100 text-gray-600' :
  'bg-blue-100 text-blue-700'
}`}>
  {status}
</span>
```

### Segment Badge Colors
```tsx
const segmentColor = {
  'Sultan Sejati (Champions)': 'bg-green-50 text-green-700',
  'Kawan Setia (Loyal)': 'bg-emerald-50 text-emerald-700',
  'Calon Sultan (Potential)': 'bg-yellow-50 text-yellow-700',
  'Hampir Lupa (At Risk)': 'bg-orange-50 text-orange-700',
  'Tidur Panjang (Hibernating)': 'bg-red-50 text-red-700',
};
```

## Mobile-First Responsive

Use Tailwind breakpoints:
```css
/* Mobile first */
className="w-full md:w-1/2 lg:w-1/3"

/* Grid responsive */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

## Icons (Lucide React)

Import needed icons:
```typescript
import { 
  LayoutDashboard, Users, Zap, Settings, 
  Bell, Search, TrendingUp, AlertCircle,
  CheckCircle2, RefreshCw, Target 
} from 'lucide-react';
```

Use in JSX:
```tsx
<Zap size={20} className="text-sumut-orange" />
```

## Animation Classes

Tailwind CSS animations (built-in):
```css
animate-pulse      /* Subtle pulsing */
animate-spin       /* Loading spinner */
animate-bounce     /* Bouncing effect */
transition         /* Smooth transitions */
hover:scale-105    /* Hover grow effect */
```

Custom animations (via Tailwind plugin or CSS):
```css
animate-in
fade-in
slide-in-from-bottom
zoom-in-95
```

## Glass/Blur Effects

```css
bg-white/10 backdrop-blur-sm    /* Light glass */
bg-black/60 backdrop-blur-md    /* Dark overlay */
```

## Shadows

```css
shadow-sm          /* Subtle */
shadow-lg          /* Prominent */
shadow-xl          /* Strong */
shadow-2xl         /* Very strong */
shadow-blue-200    /* Colored shadow */
```
