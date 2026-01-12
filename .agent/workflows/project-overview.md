---
description: Complete project guide for SULTAN - Bank Sumut Gen-Z CRM Ecosystem
---

# SULTAN Project Overview

## 🎯 Project Summary
SULTAN adalah aplikasi CRM (Customer Relationship Management) untuk Bank Sumut yang menargetkan nasabah Gen-Z. Aplikasi ini mengimplementasikan model RFM (Recency, Frequency, Monetary) untuk segmentasi pelanggan otomatis.

## 🛠️ Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v3 (production-ready, bukan CDN)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (optional)
- **State Management**: React Context + useState

## 📁 Project Structure

```
Bank-Sumut-Prototype-main/
├── App.tsx                    # Main app with view switcher (Mobile/Admin)
├── index.tsx                  # React entry point
├── index.html                 # HTML template with Vite module
├── index.css                  # Tailwind directives
├── types.ts                   # TypeScript interfaces (RFM, User, etc.)
├── constants.ts               # Mock data (customers, campaigns)
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx # Admin CRM dashboard with tabs
│   │   ├── Customer360View.tsx # Individual customer detail view
│   │   └── AnalyticsDashboard.tsx # Analytics visualizations
│   └── mobile/
│       └── MobileApp.tsx      # Gen-Z mobile banking interface
├── services/
│   ├── geminiService.ts       # AI campaign generation
│   ├── customer360Analytics.ts # Customer analytics logic
│   └── transferAnalytics.ts   # Transaction analytics
├── contexts/
│   └── DemoContext.tsx        # Demo state management
├── public/
│   └── bank-sumut-logo.png    # Bank Sumut logo
└── tailwind.config.js         # Tailwind with custom Bank Sumut colors
```

## 🎨 Design System

### Colors (defined in tailwind.config.js)
- `sumut-blue`: #00AEEF (Primary)
- `sumut-darkBlue`: #007BB5
- `sumut-orange`: #F7941D (Accent)
- `sumut-orangeLight`: #FFF0D9
- `sumut-grey`: #F3F4F6

### Fonts
- **Primary**: Inter (body text)
- **Display**: Space Grotesk (headings)

## 📊 CRM Logic Implementation

### RFM Segmentation
The app implements 5 customer segments based on RFM scores:
1. **Sultan Sejati (Champions)** - R5, F5, M5 scores
2. **Kawan Setia (Loyal)** - High frequency customers
3. **Calon Sultan (Potential)** - Growing engagement
4. **Hampir Lupa (At Risk)** - Declining activity
5. **Tidur Panjang (Hibernating)** - Inactive customers

### Key Features
- Real-time RFM score calculation with configurable weights
- Dynamic segment recalculation when config changes
- AI-powered campaign strategy generation
- Gamification system (points, levels, badges)
- Dream Savers (Dompet Impian) goal tracking

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Environment Setup (Optional for AI)

Create `.env` file for Gemini AI integration:
```
VITE_API_KEY=your_gemini_api_key_here
```

Note: The app works without API key - AI features show simulated responses.

## 📱 Application Views

### Mobile View (MobileApp.tsx)
- Home with balance card and quick actions
- Dompet Impian (Dream Savers) goals
- Transaction history
- Rewards and gamification
- Profile with logout

### Admin Dashboard (AdminDashboard.tsx)
- **Executive Dashboard**: KPIs, segment distribution, insights
- **Nasabah (RFM)**: Customer list with RFM scores
- **Promo Triggers**: Campaign management with AI
- **Kerangka Teori CRM**: Academic documentation
- **Konfigurasi RFM**: Adjust RFM weights and thresholds
