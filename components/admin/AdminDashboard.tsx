import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { MOCK_CAMPAIGNS, MOCK_USER, SEGMENT_STATS, MOCK_CUSTOMERS_LIST, MOCK_LOAN_APPLICATIONS } from '../../constants';
import { RFMSegment, User, RFMConfig, Campaign, DreamSaverActivity, PushNotification, ServiceTicket } from '../../types';
import { UserRole, ROLE_PERMISSIONS, ROLE_METADATA, getAvailableTabsForRole } from '../../types/rbac';
import { LayoutDashboard, Users, Zap, Settings, Bell, Search, Menu, Send, Bot, FileText, Filter, MoreHorizontal, ChevronDown, CheckSquare, X, Smartphone, TrendingUp, AlertCircle, Award, Sliders, Save, RotateCcw, Target, CheckCircle2, RefreshCw, Phone, Calendar, Clock, UserCheck, FileCheck, Activity, Trophy, Gamepad2, XCircle, Wallet, ArrowUpRight, ArrowDownLeft, Trash2, Sparkles, PlusCircle, Megaphone, Headphones, Lock, Inbox, BookOpen, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { analyzeTransferBehavior } from '../../services/transferAnalytics';
import { generateCampaignStrategy } from '../../services/geminiService';
import { getGenerationSegment, CONTEXTUAL_PROMOS, GenerationSegment, ContextualPromo } from '../../services/generationSegmentation';
import Customer360View from './Customer360View';
import PipelineKanban from './PipelineKanban';
import AnalyticsDashboard from './AnalyticsDashboard';
import DemoSandbox from './DemoSandbox';
import ServiceMonitoring from './ServiceMonitoring';
import { useDemoContext } from '../../contexts/DemoContext';
// CS-specific imports
import { TicketQueue, generateMockTickets } from '../cs/TicketQueue';
import { CustomerSearchCS } from '../cs/CustomerSearchCS';
import { KnowledgeBase } from '../cs/KnowledgeBase';
import { CSPerformance } from '../cs/CSPerformance';
// Marketing-specific imports
import MarketingCloud from './marketing/MarketingCloud';
// RM-specific imports
import SalesCloud from './sales/SalesCloud';

interface AdminDashboardProps {
  customers?: User[];
  campaigns?: Campaign[];
  onCampaignsChange?: (campaigns: Campaign[]) => void;
  dreamSaverActivities?: DreamSaverActivity[];
  onSendNotification?: (notification: Omit<PushNotification, 'id' | 'sentAt' | 'read'>) => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const COLORS = ['#00AEEF', '#F7941D', '#007BB5', '#FFB055', '#94A3B8'];

// Default Config
const DEFAULT_RFM_CONFIG: RFMConfig = {
  recencyThresholds: [7, 30, 90],
  frequencyThresholds: [2, 5, 10],
  monetaryThresholds: [500000, 2000000, 5000000]
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ customers: propCustomers, campaigns: propCampaigns, onCampaignsChange, dreamSaverActivities = [], onSendNotification, currentRole = 'DIRECTOR', onRoleChange }) => {
  // Role dropdown state
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  
  // Get available tabs for current role
  const availableTabs = useMemo(() => getAvailableTabsForRole(currentRole), [currentRole]);
  const permissions = ROLE_PERMISSIONS[currentRole];
  const roleMeta = ROLE_METADATA[currentRole];
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'campaigns' | 'settings' | 'tickets' | 'kb' | 'performance' | 'mkt_overview' | 'mkt_campaigns' | 'mkt_segments' | 'mkt_content' | 'rm_performance' | 'rm_portfolio' | 'rm_leads' | 'rm_pipeline' | 'rm_activity'>(() => {
    // Initialize to first available tab based on role
    if (currentRole === 'CS') return 'tickets';
    if (currentRole === 'MARKETING') return 'mkt_overview';
    if (currentRole === 'RM') return 'rm_performance';
    const firstTab = availableTabs[0] as 'dashboard' | 'customers' | 'campaigns' | 'settings';
    return firstTab || 'dashboard';
  });
  
  // Generate mock tickets for CS
  const [mockTickets] = useState<ServiceTicket[]>(() => generateMockTickets(propCustomers || MOCK_CUSTOMERS_LIST));
  const [recentCustomers, setRecentCustomers] = useState<User[]>([]);
  
  // Track previous role to detect role changes
  const [prevRole, setPrevRole] = useState<UserRole>(currentRole);
  
  // Auto-switch tab ONLY when role changes (not on every render)
  useEffect(() => {
    if (currentRole !== prevRole) {
      setPrevRole(currentRole);
      if (currentRole === 'CS') {
        setActiveTab('tickets');
      } else if (currentRole === 'MARKETING') {
        setActiveTab('mkt_overview');
      } else if (currentRole === 'RM') {
        setActiveTab('rm_performance');
      } else if (!availableTabs.includes(activeTab as any)) {
        const firstTab = availableTabs[0] as 'dashboard' | 'customers' | 'campaigns' | 'settings';
        if (firstTab) setActiveTab(firstTab);
      }
    }
  }, [currentRole, prevRole, availableTabs]);
  
  const [selectedSegment, setSelectedSegment] = useState<RFMSegment | 'all'>('all');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Draft' | 'Completed'>('All');
  
  // RFM Config State - Initialize from LocalStorage if available
  const [rfmConfig, setRfmConfig] = useState<RFMConfig>(() => {
    try {
      const savedConfig = localStorage.getItem('rfmConfig');
      return savedConfig ? JSON.parse(savedConfig) : DEFAULT_RFM_CONFIG;
    } catch (error) {
      console.error("Failed to load config from localStorage", error);
      return DEFAULT_RFM_CONFIG;
    }
  });
  
  const [isConfigDirty, setIsConfigDirty] = useState(false);

  // Customer Table State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Blast Promo Modal State (Consent Guard)
  const [showBlastModal, setShowBlastModal] = useState(false);

  // Column Customization State (saved to localStorage)
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('customerTableColumns');
      return saved ? JSON.parse(saved) : {
        contact: true,
        location: true,
        segment: true,
        activeTime: true,
        channel: true,
        balance: true
      };
    } catch {
      return { contact: true, location: true, segment: true, activeTime: true, channel: true, balance: true };
    }
  });

  // Save column settings to localStorage
  const saveColumnSettings = (cols: Record<string, boolean>) => {
    setVisibleColumns(cols);
    localStorage.setItem('customerTableColumns', JSON.stringify(cols));
    setShowColumnSettings(false);
  };

  // Campaign Management State - Use prop if provided, otherwise MOCK
  const [campaigns, setCampaigns] = useState<Campaign[]>(propCampaigns || MOCK_CAMPAIGNS);
  const [editingCampaign, setEditingCampaign] = useState<{id: string; title: string; targetSegment: RFMSegment[]} | null>(null);

  // Sync campaigns changes to parent App.tsx
  useEffect(() => {
    if (onCampaignsChange) {
      onCampaignsChange(campaigns);
    }
  }, [campaigns, onCampaignsChange]);
  
  // Toggle campaign status
  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === campaignId) {
        const newStatus = camp.status === 'Active' ? 'Draft' : 'Active';
        // If activating, generate some mock stats
        const newReach = newStatus === 'Active' ? Math.floor(1000 + Math.random() * 5000) : 0;
        return { ...camp, status: newStatus, reach: newReach };
      }
      return camp;
    }));
  };

  // Edit campaign
  const startEditCampaign = (camp: any) => {
    setEditingCampaign({ id: camp.id, title: camp.title, targetSegment: [...camp.targetSegment] });
  };

  const updateCampaign = () => {
    if (!editingCampaign) return;
    setCampaigns(prev => prev.map(camp => {
      if (camp.id === editingCampaign.id) {
        return { ...camp, title: editingCampaign.title, targetSegment: editingCampaign.targetSegment };
      }
      return camp;
    }));
    setEditingCampaign(null);
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(camp => camp.id !== campaignId));
    setEditingCampaign(null);
  };

  // Demo Context for time simulation
  const { demoState, getActiveTimeSlot } = useDemoContext();

  // Time-Based Promo Recommendations
  const timeBasedPromo = useMemo(() => {
    const hour = parseInt(demoState.simulatedTime.split(':')[0]);
    const timeSlot = getActiveTimeSlot();
    const day = demoState.simulatedDay;
    const isWeekend = ['Sabtu', 'Minggu'].includes(day);
    
    if (hour >= 6 && hour < 12) {
      return {
        slot: 'Pagi',
        icon: '🌅',
        color: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        promos: [
          { title: 'Promo Sarapan Pagi', desc: 'Cashback 20% di merchant F&B jam 06:00-10:00', target: 'Champions' },
          { title: 'Good Morning Transfer', desc: 'Gratis biaya transfer ke bank lain', target: 'Loyal' },
          { title: isWeekend ? 'Weekend Brunch Deals' : 'Kopi Pagi Senin', desc: isWeekend ? 'Disc 30% weekend brunch' : 'Gratis kopi untuk Monday motivation', target: 'Potential' },
        ]
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        slot: 'Siang',
        icon: '☀️',
        color: 'from-yellow-400 to-orange-400',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        promos: [
          { title: 'Lunch Rush Promo', desc: 'Cashback Rp 15.000 makan siang', target: 'Champions' },
          { title: 'Midday Top Up Bonus', desc: 'Bonus 5% top up e-wallet', target: 'Loyal' },
          { title: 'Shopping Break', desc: 'Flash sale marketplace partner', target: 'Potential' },
        ]
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        slot: 'Malam',
        icon: '🌙',
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        promos: [
          { title: 'Dinner Time Cashback', desc: 'Disc 25% restoran keluarga', target: 'Champions' },
          { title: isWeekend ? 'Weekend Entertainment' : 'After Work Chill', desc: isWeekend ? 'Promo bioskop & streaming' : 'Voucher hiburan after work', target: 'Loyal' },
          { title: 'Night Shopping Deals', desc: 'Midnight sale up to 50%', target: 'Potential' },
        ]
      };
    } else {
      return {
        slot: 'Dini Hari',
        icon: '🦉',
        color: 'from-slate-700 to-slate-900',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-300',
        promos: [
          { title: 'Night Owl Special', desc: 'Cashback extra untuk transaksi 22:00-06:00', target: 'Champions' },
          { title: 'Late Night Gaming', desc: 'Promo top up game 24 jam', target: 'Potential' },
          { title: 'Midnight Bills', desc: 'Gratis admin bayar tagihan', target: 'At Risk' },
        ]
      };
    }
  }, [demoState.simulatedTime, demoState.simulatedDay, getActiveTimeSlot]);

  // Use prop customers if provided, otherwise fall back to MOCK_CUSTOMERS_LIST
  const customers = propCustomers || MOCK_CUSTOMERS_LIST;

  // Real-time Data States
  const [currentDate, setCurrentDate] = useState(new Date());
  const [kpiData, setKpiData] = useState({
    retentionRate: 85.4,
    pointVelocity: 12500, 
    campaignRoi: 340,
    churnRisk: 12.0
  });

  const [weeklyTransactions, setWeeklyTransactions] = useState([
    { name: 'Sen', value: 4000 },
    { name: 'Sel', value: 3000 },
    { name: 'Rab', value: 2000 },
    { name: 'Kam', value: 2780 },
    { name: 'Jum', value: 1890 },
    { name: 'Sab', value: 2390 },
    { name: 'Min', value: 3490 },
  ]);

  // Today's Activity Data
  const [todayActivity, setTodayActivity] = useState({
    newLeads: 12,
    callsMade: 28,
    meetingsScheduled: 5,
    followUps: 18,
    applicationsProcessed: 7,
    onboardingCompleted: 3,
    targetProgress: 68,
  });

  // Team Activity Data
  const teamMembers = [
    { id: 'rm1', name: 'Ahmad Siregar', role: 'RM Senior', avatar: '👨‍💼', deals: 12, activities: 45, pendingFollowUps: 3, overdue: 1 },
    { id: 'rm2', name: 'Siti Harahap', role: 'RM', avatar: '👩‍💼', deals: 9, activities: 38, pendingFollowUps: 5, overdue: 0 },
    { id: 'rm3', name: 'Budi Nasution', role: 'RM', avatar: '👨‍💼', deals: 8, activities: 32, pendingFollowUps: 2, overdue: 2 },
    { id: 'rm4', name: 'Maya Lubis', role: 'RM Junior', avatar: '👩‍💼', deals: 5, activities: 25, pendingFollowUps: 4, overdue: 0 },
    { id: 'rm5', name: 'Dedi Simanjuntak', role: 'CS Lead', avatar: '👨‍💼', deals: 0, activities: 52, pendingFollowUps: 8, overdue: 3 },
  ];

  // Pending Tasks
  const pendingTasks = [
    { id: 't1', type: 'follow-up', customer: 'Andi Pratama', dueDate: 'Hari ini', priority: 'high', rm: 'Ahmad Siregar' },
    { id: 't2', type: 'call', customer: 'Dewi Sartika', dueDate: 'Hari ini', priority: 'medium', rm: 'Siti Harahap' },
    { id: 't3', type: 'meeting', customer: 'Rizky Firmansyah', dueDate: 'Besok', priority: 'high', rm: 'Ahmad Siregar' },
    { id: 't4', type: 'document', customer: 'Sari Indah', dueDate: 'Overdue', priority: 'urgent', rm: 'Budi Nasution' },
    { id: 't5', type: 'follow-up', customer: 'Hendra Kusuma', dueDate: 'Hari ini', priority: 'medium', rm: 'Maya Lubis' },
  ];

  // CRM Rules Engine - Auto-generate tasks from segment conditions
  const CRM_RULES = [
    { id: 'r1', trigger: 'At Risk', action: 'Follow-up Call', priority: 'high', icon: '📞' },
    { id: 'r2', trigger: 'Hibernating', action: 'Winback Campaign', priority: 'medium', icon: '🎁' },
    { id: 'r3', trigger: 'Champions', condition: 'Saldo > 100jt', action: 'Upsell Premium', priority: 'medium', icon: '💎' },
    { id: 'r4', trigger: 'Potential', condition: 'Freq < 3', action: 'Engagement Push', priority: 'low', icon: '📲' },
  ];

  // Auto-generated tasks from CRM Rules (computed from customer segments)
  const autoGeneratedTasks = useMemo(() => {
    const tasks: Array<{ id: string; rule: string; customer: string; segment: string; action: string; priority: string; icon: string }> = [];
    
    customers.forEach(customer => {
      const segment = customer.segment;
      
      // Rule 1: At Risk → Follow-up
      if (segment === RFMSegment.AT_RISK) {
        tasks.push({
          id: `auto-${customer.id}-r1`,
          rule: 'At Risk Detection',
          customer: customer.name,
          segment: 'At Risk',
          action: 'Follow-up Call',
          priority: 'high',
          icon: '📞'
        });
      }
      
      // Rule 2: Hibernating → Winback
      if (segment === RFMSegment.HIBERNATING) {
        tasks.push({
          id: `auto-${customer.id}-r2`,
          rule: 'Winback Trigger',
          customer: customer.name,
          segment: 'Hibernating',
          action: 'Winback Campaign',
          priority: 'medium',
          icon: '🎁'
        });
      }
      
      // Rule 3: Champions with high balance → Upsell
      if (segment === RFMSegment.CHAMPIONS && customer.balance > 100000000) {
        tasks.push({
          id: `auto-${customer.id}-r3`,
          rule: 'Upsell Opportunity',
          customer: customer.name,
          segment: 'Champions',
          action: 'Upsell Premium',
          priority: 'medium',
          icon: '💎'
        });
      }
    });
    
    return tasks.slice(0, 8); // Limit to 8 tasks
  }, [customers]);

  // SLA Tickets with countdown
  const [tickets] = useState([
    { id: 'tk1', customer: 'Ahmad Harahap', issue: 'ATM Card Blocked', category: 'Card', createdAt: new Date(Date.now() - 1000*60*30), slaHours: 4, assignee: 'Dedi S.', status: 'open' },
    { id: 'tk2', customer: 'Siti Aminah', issue: 'Transfer Failed', category: 'Transaction', createdAt: new Date(Date.now() - 1000*60*120), slaHours: 2, assignee: 'Maya L.', status: 'in-progress' },
    { id: 'tk3', customer: 'Budi Nasution', issue: 'Mobile App Error', category: 'Technical', createdAt: new Date(Date.now() - 1000*60*180), slaHours: 4, assignee: 'Ahmad S.', status: 'open' },
    { id: 'tk4', customer: 'Rian Siregar', issue: 'Wrong Debit Amount', category: 'Transaction', createdAt: new Date(Date.now() - 1000*60*60), slaHours: 2, assignee: 'Siti H.', status: 'escalated' },
  ]);

  // Calculate SLA status for each ticket
  const ticketsWithSLA = useMemo(() => {
    return tickets.map(ticket => {
      const now = currentDate.getTime();
      const deadline = ticket.createdAt.getTime() + (ticket.slaHours * 60 * 60 * 1000);
      const remaining = deadline - now;
      const remainingHours = remaining / (1000 * 60 * 60);
      
      let slaStatus: 'safe' | 'warning' | 'critical' | 'overdue' = 'safe';
      if (remaining <= 0) slaStatus = 'overdue';
      else if (remainingHours < 1) slaStatus = 'critical';
      else if (remainingHours < 2) slaStatus = 'warning';
      
      const formatRemaining = remaining > 0 
        ? `${Math.floor(remainingHours)}h ${Math.floor((remaining % (1000*60*60)) / (1000*60))}m`
        : 'Overdue';
      
      return { ...ticket, slaStatus, remainingTime: formatRemaining, remainingMs: remaining };
    });
  }, [tickets, currentDate]);

  // Simulate Live Data Feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());

      // Simulate KPI fluctuations for the "Executive View"
      setKpiData(prev => ({
        retentionRate: parseFloat((prev.retentionRate + (Math.random() - 0.4) * 0.1).toFixed(1)),
        pointVelocity: Math.floor(prev.pointVelocity + (Math.random() - 0.3) * 50),
        campaignRoi: Math.floor(prev.campaignRoi + (Math.random() - 0.4) * 5),
        churnRisk: parseFloat(Math.max(0, prev.churnRisk + (Math.random() - 0.5) * 0.2).toFixed(1))
      }));

      // Note: weeklyTransactions is historical data, no need to simulate fluctuation
      // Real-time KPI updates are simulated above

      // Simulate Today Activity changes
      setTodayActivity(prev => ({
        newLeads: Math.max(0, prev.newLeads + (Math.random() > 0.7 ? 1 : 0)),
        callsMade: Math.max(0, prev.callsMade + (Math.random() > 0.6 ? 1 : 0)),
        meetingsScheduled: prev.meetingsScheduled,
        followUps: Math.max(0, prev.followUps + (Math.random() > 0.8 ? 1 : 0)),
        applicationsProcessed: Math.max(0, prev.applicationsProcessed + (Math.random() > 0.9 ? 1 : 0)),
        onboardingCompleted: prev.onboardingCompleted,
        targetProgress: Math.min(100, prev.targetProgress + (Math.random() > 0.8 ? 1 : 0)),
      }));

    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // --- Dynamic Logic: Recalculate Customers based on Config ---
  const processedCustomers = useMemo(() => {
    return customers.map(user => {
      // Check if rfmScore exists, if not skip processing
      if (!user.rfmScore) {
        return { ...user, segment: 'Potential' as RFMSegment, calculatedScore: '0.00' };
      }
      
      // 1. Calculate Weighted Score
      const { recency, frequency, monetary } = user.rfmScore;
      const { recencyThresholds, frequencyThresholds, monetaryThresholds } = rfmConfig;
      
      // Simple scoring based on thresholds (higher is better)
      let rScore = recency <= recencyThresholds[0] ? 3 : recency <= recencyThresholds[1] ? 2 : 1;
      let fScore = frequency >= frequencyThresholds[2] ? 3 : frequency >= frequencyThresholds[1] ? 2 : 1;
      let mScore = monetary >= monetaryThresholds[2] ? 3 : monetary >= monetaryThresholds[1] ? 2 : 1;
      
      const avgScore = (rScore + fScore + mScore) / 3;

      // 2. Determine Segment based on Thresholds
      let newSegment = RFMSegment.HIBERNATING;
      
      if (avgScore >= 2.5) {
        newSegment = RFMSegment.CHAMPIONS;
      } else if (avgScore >= 2.0) {
        newSegment = RFMSegment.LOYAL;
      } else if (avgScore >= 1.5) {
        newSegment = RFMSegment.POTENTIAL;
      } else if (avgScore >= 1.0) {
        newSegment = RFMSegment.AT_RISK;
      }

      return {
        ...user,
        segment: newSegment,
        calculatedScore: avgScore.toFixed(2)
      };
    });
  }, [customers, rfmConfig]); // Add customers to dependency array for real-time updates

  // --- Dynamic Logic: Recalculate Segment Stats for Charts ---
  const dynamicSegmentStats = useMemo(() => {
    const stats = {
      [RFMSegment.CHAMPIONS]: 0,
      [RFMSegment.LOYAL]: 0,
      [RFMSegment.POTENTIAL]: 0,
      [RFMSegment.AT_RISK]: 0,
      [RFMSegment.HIBERNATING]: 0,
    };

    processedCustomers.forEach(c => {
      if (stats[c.segment] !== undefined) {
        stats[c.segment]++;
      }
    });

    return [
      { name: 'Champions', value: stats[RFMSegment.CHAMPIONS], color: '#006C4F' },
      { name: 'Loyal', value: stats[RFMSegment.LOYAL], color: '#22c55e' },
      { name: 'Potential', value: stats[RFMSegment.POTENTIAL], color: '#FDB813' },
      { name: 'At Risk', value: stats[RFMSegment.AT_RISK], color: '#f59e0b' },
      { name: 'Hibernating', value: stats[RFMSegment.HIBERNATING], color: '#ef4444' },
    ];
  }, [processedCustomers]);

  // --- NEW: RFM Matrix Distribution (for heatmap) ---
  const rfmMatrixData = useMemo(() => {
    const matrix: { r: number; f: number; m: number; count: number; segments: string[] }[] = [];
    
    // Create 5x5 grid for R and F dimensions
    for (let r = 1; r <= 5; r++) {
      for (let f = 1; f <=5; f++) {
        const customers = processedCustomers.filter(c => 
          c.rfmScore.recency === r && c.rfmScore.frequency === f
        );
        if (customers.length > 0) {
          matrix.push({
            r,
            f,
            m: customers.reduce((sum, c) => sum + c.rfmScore.monetary, 0) / customers.length,
            count: customers.length,
            segments: [...new Set(customers.map(c => c.segment))]
          });
        }
      }
    }
    return matrix;
  }, [processedCustomers]);

  // --- NEW: Segment Performance Metrics ---
  const segmentPerformance = useMemo(() => {
    const metrics: Record<string, { 
      count: number; 
      avgBalance: number; 
      avgTransactions: number; 
      avgPoints: number;
      retention: number;
    }> = {};

    Object.values(RFMSegment).forEach(segment => {
      const customers = processedCustomers.filter(c => c.segment === segment);
      if (customers.length > 0) {
        metrics[segment] = {
          count: customers.length,
          avgBalance: customers.reduce((sum, c) => sum + c.balance, 0) / customers.length,
          avgTransactions: customers.reduce((sum, c) => sum + c.transactions.length, 0) / customers.length,
          avgPoints: customers.reduce((sum, c) => sum + c.points, 0) / customers.length,
          retention: segment === RFMSegment.CHAMPIONS ? 95 : 
                    segment === RFMSegment.LOYAL ? 88 :
                    segment === RFMSegment.POTENTIAL ? 72 :
                    segment === RFMSegment.AT_RISK ? 45 : 25
        };
      }
    });
    return metrics;
  }, [processedCustomers]);

  // --- NEW: CRM Insights & Recommendations ---
  const crmInsights = useMemo(() => {
    const insights: { type: 'success' | 'warning' | 'info'; message: string; action?: string }[] = [];
    const total = processedCustomers.length;
    
    dynamicSegmentStats.forEach(stat => {
      const percentage = ((stat.value / total) * 100).toFixed(1);
      
      if (stat.name === 'Champions' && stat.value > 0) {
        insights.push({
          type: 'success',
          message: `${stat.value} Champions (${percentage}%) - Elite customers! Expand VIP rewards program.`,
          action: 'Create VIP Campaign'
        });
      }
      
      if (stat.name === 'Potential' && parseFloat(percentage) > 25) {
        insights.push({
          type: 'info',
          message: `${stat.value} Potential customers (${percentage}%) - Ready for upgrade! Target with cross-sell campaigns.`,
          action: 'Launch Upgrade Campaign'
        });
      }
      
      if (stat.name === 'At Risk' && parseFloat(percentage) > 10) {
        insights.push({
          type: 'warning',
          message: `${stat.value} At Risk (${percentage}%) - Activate retention triggers immediately!`,
          action: 'Start Winback Campaign'
        });
      }
      
      if (stat.name === 'Hibernating' && stat.value > 0) {
        insights.push({
          type: 'warning',
          message: `${stat.value} Hibernating customers - Consider re-engagement incentives.`,
          action: 'Send Re-activation Offer'
        });
      }
    });
    
    // Add general insight
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        message: 'Segment distribution is balanced. Monitor trends for optimization opportunities.'
      });
    }
    
    return insights;
  }, [dynamicSegmentStats, processedCustomers]);

  // Aggregate Transfer Analytics
  const aggregateTransferMetrics = useMemo(() => {
    const allTransactions = processedCustomers.flatMap(c => c.transactions);
    const allTransfers = allTransactions.filter(t => t.category === 'Transfer');
    
    const totalIntraBank = allTransfers.filter(t => t.transferMethod === 'intra_bank').length;
    const totalInterBank = allTransfers.filter(t => t.transferMethod === 'inter_bank').length;
    const totalTransfers = totalIntraBank + totalInterBank;
    
    const overallLoyaltyScore = totalTransfers > 0 
      ? (totalIntraBank / totalTransfers) * 100 
      : 50;
    
    // Calculate per-customer churn risk
    const customerRisks = processedCustomers.map(c => {
      const analytics = analyzeTransferBehavior(c.transactions);
      return analytics.insights.churnRisk;
    });
    
    const highRiskCount = customerRisks.filter(r => r === 'High').length;
    const churnRiskPercentage = (highRiskCount / processedCustomers.length) * 100;
    
    return {
      totalIntraBank,
      totalInterBank,
      overallLoyaltyScore,
      churnRiskPercentage,
      highRiskCount
    };
  }, [processedCustomers]);

  // --- NEW: Today's Transaction Summary ---
  const todayTransactions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const allTransactions = processedCustomers.flatMap(c => 
      c.transactions.map(t => ({ ...t, customerName: c.name, customerId: c.id }))
    );
    
    // Get today's transactions (or use recent if no today data for demo)
    let todayTxns = allTransactions.filter(t => t.date === today);
    
    // If no today transactions, use last 10 for demo purposes
    if (todayTxns.length === 0) {
      todayTxns = allTransactions.slice(0, 10);
    }
    
    // Calculate incoming (assume positive transactions or transfers to self)
    const incoming = todayTxns
      .filter(t => t.category === 'Transfer' && t.transferMethod === 'intra_bank' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate outgoing (all expenses and external transfers)
    const outgoing = todayTxns
      .filter(t => t.category !== 'Transfer' || t.transferMethod === 'inter_bank')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Total volume
    const totalVolume = todayTxns.reduce((sum, t) => sum + t.amount, 0);
    
    // Net flow
    const netFlow = incoming - outgoing;
    
    // Top 5 transactions by amount
    const topTransactions = [...todayTxns]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Transaction count by category
    const byCategory = todayTxns.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      count: todayTxns.length,
      incoming,
      outgoing,
      netFlow,
      totalVolume,
      topTransactions,
      byCategory
    };
  }, [processedCustomers]);

  const handleGenerateInsight = async () => {
    setIsLoadingAi(true);
    const segmentCustomers = selectedSegment === 'all' ? processedCustomers : processedCustomers.filter(c => c.segment === selectedSegment);
    const avgBalance = segmentCustomers.reduce((sum, c) => sum + c.balance, 0) / (segmentCustomers.length || 1);
    
    // Segment-specific campaign configurations
    const campaignConfigs: Record<string, { 
      title: string; 
      channel: string; 
      timing: string; 
      copyExample: string; 
      conversionRate: number;
    }> = {
      'Champions': { 
        title: 'VIP Exclusive: Premium Rewards', 
        channel: 'Push Notification + WhatsApp Personal',
        timing: 'Jam 19:00-21:00 (prime time)',
        copyExample: '🎉 Hai Kak! Sebagai Sultan Sejati, kamu dapat akses EKSKLUSIF ke cashback 15% untuk semua transaksi minggu ini! Tap untuk aktivasi.',
        conversionRate: 12
      },
      'Loyal': { 
        title: 'Loyalty Appreciation: Special Cashback', 
        channel: 'Push Notification + Email',
        timing: 'Jam 12:00-14:00 (lunch break)',
        copyExample: '💫 Terima kasih jadi pelanggan setia! Nikmati cashback Rp 50.000 untuk transaksi min. Rp 500.000. Berlaku 7 hari.',
        conversionRate: 8
      },
      'Potential': { 
        title: 'Growth Booster: Double Points', 
        channel: 'In-App Banner + Push Notification',
        timing: 'Jam 18:00-20:00 (after work)',
        copyExample: '🚀 Level UP! Transaksi sekarang dan dapatkan DOUBLE POIN untuk naik ke level selanjutnya. Buruan, promo terbatas!',
        conversionRate: 6
      },
      'At Risk': { 
        title: 'Winback: Come Back Special Offer', 
        channel: 'SMS + WhatsApp Broadcast',
        timing: 'Jam 10:00-11:00 (mid-morning)',
        copyExample: '😢 Kangen nih! Sudah lama ga transaksi. Yuk balik lagi, ada voucher Rp 25.000 GRATIS menunggu kamu!',
        conversionRate: 4
      },
      'Hibernating': { 
        title: 'Reactivation: Miss You Promo', 
        channel: 'Email + SMS Personal',
        timing: 'Jam 09:00-10:00 (morning)',
        copyExample: '👋 Hai! Akun kamu masih aktif lho. Login sekarang dan dapatkan bonus TOP UP Rp 10.000! Jangan sampai hangus.',
        conversionRate: 2
      },
    };
    
    const config = campaignConfigs[selectedSegment] || { 
      title: `Promo Spesial untuk ${selectedSegment}`, 
      channel: 'Push Notification',
      timing: 'Jam 12:00-14:00',
      copyExample: '🎁 Promo spesial untuk kamu! Cek aplikasi sekarang.',
      conversionRate: 5
    };
    
    const estimatedConversions = Math.floor(segmentCustomers.length * (config.conversionRate / 100));
    
    // Create new campaign entry
    const newCampaign = {
      id: `camp_${Date.now()}`,
      title: config.title,
      status: 'Draft' as const,
      targetSegment: selectedSegment === 'all' ? [RFMSegment.CHAMPIONS] : [selectedSegment as RFMSegment],
      conversion: config.conversionRate,
      reach: 0,
    };
    
    // Add to campaigns list
    setCampaigns(prev => [newCampaign, ...prev]);
    
    setAiInsight(`✅ **Campaign "${config.title}" berhasil dibuat!**

📊 **Target Segment**
• Jumlah nasabah: ${segmentCustomers.length.toLocaleString('id-ID')} orang
• Avg Balance: Rp ${avgBalance.toLocaleString('id-ID')}
• Segment: ${selectedSegment}

📱 **Channel Rekomendasi**
${config.channel}

⏰ **Waktu Optimal**
${config.timing}

💬 **Contoh Copy Message**
"${config.copyExample}"

📈 **Estimasi Konversi**
• Rate: ${config.conversionRate}%
• Prediksi konversi: ~${estimatedConversions} nasabah

_Campaign ditambahkan ke Active Triggers dengan status DRAFT._
_Klik "▶ Activate Campaign" untuk meluncurkan._`);
    setIsLoadingAi(false);
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    filterStatus === 'All' ? true : campaign.status === filterStatus
  );

  const filteredCustomers = processedCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.id.includes(customerSearch);
    const matchesFilter = customerFilter === 'All' || customer.segment === customerFilter;
    return matchesSearch && matchesFilter;
  });

  const handleConfigChange = (key: keyof RFMConfig['weights'] | keyof RFMConfig['thresholds'], value: number, type: 'weight' | 'threshold') => {
    setIsConfigDirty(true);
    setRfmConfig(prev => {
      if (type === 'weight') {
        return { ...prev, weights: { ...prev.weights, [key]: value } };
      } else {
        return { ...prev, thresholds: { ...prev.thresholds, [key]: value } };
      }
    });
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('rfmConfig', JSON.stringify(rfmConfig));
      setIsConfigDirty(false);
      // Optional: Visual feedback could be added here, but the dirty state clearing indicates success.
    } catch (error) {
      console.error("Failed to save config to localStorage", error);
      alert("Gagal menyimpan konfigurasi.");
    }
  };

  const resetConfig = () => {
    setRfmConfig(DEFAULT_RFM_CONFIG);
    setIsConfigDirty(true); // Mark as dirty so user can decide to save the default state
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-gray-100">
           <div className="flex items-center gap-3">
             <img src={`${import.meta.env.BASE_URL}bank-sumut-logo.svg`} alt="Bank Sumut" className="h-10 w-auto object-contain" />
             <div className="flex flex-col">
               <h1 className="font-bold text-lg text-slate-900 leading-tight">SULTAN</h1>
               <p className="text-[11px] text-gray-500 font-medium">CRM Dashboard v2.0</p>
             </div>
           </div>
        </div>
        
        {/* Role Switcher - After Logo */}
        <div className="p-3 border-b border-gray-100 relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-r ${roleMeta.color} flex items-center justify-center text-white text-base`}>
              {roleMeta.emoji}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">{roleMeta.labelId}</p>
              <p className="text-[10px] text-gray-500">{roleMeta.descriptionId}</p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition ${showRoleDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Role Dropdown - Opens Downward */}
          {showRoleDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)} />
              <div className="absolute top-full left-3 right-3 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Switch Role (Demo)</p>
                </div>
                
                {(Object.keys(ROLE_METADATA) as UserRole[]).map(role => {
                  const meta = ROLE_METADATA[role];
                  const perms = ROLE_PERMISSIONS[role];
                  const isActive = role === currentRole;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        if (onRoleChange) onRoleChange(role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition ${isActive ? 'bg-sumut-blue/5' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${meta.color} flex items-center justify-center text-white text-xs flex-shrink-0`}>
                        {meta.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 text-xs">{meta.labelId}</span>
                          {isActive && <CheckCircle2 size={10} className="text-sumut-blue" />}
                        </div>
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          <span className={`px-1 py-0.5 rounded text-[7px] ${perms.canViewDashboard ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>Dashboard</span>
                          <span className={`px-1 py-0.5 rounded text-[7px] ${perms.canViewAllCustomers || perms.canViewOwnCustomers ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>Nasabah</span>
                          <span className={`px-1 py-0.5 rounded text-[7px] ${perms.canViewCampaigns ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>Campaign</span>
                          <span className={`px-1 py-0.5 rounded text-[7px] ${perms.canConfigureRFM ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>Settings</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {/* CS-Specific Navigation */}
          {currentRole === 'CS' ? (
            <>
              <SidebarItem 
                icon={<Inbox size={20} />} 
                label="Antrian Keluhan" 
                active={activeTab === 'tickets'} 
                onClick={() => setActiveTab('tickets')} 
              />
              <SidebarItem 
                icon={<Search size={20} />} 
                label="Cari Nasabah" 
                active={activeTab === 'customers'} 
                onClick={() => setActiveTab('customers')} 
              />
              <SidebarItem 
                icon={<BookOpen size={20} />} 
                label="Panduan Bantuan" 
                active={activeTab === 'kb'} 
                onClick={() => setActiveTab('kb')} 
              />
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label="Kinerja Saya" 
                active={activeTab === 'performance'} 
                onClick={() => setActiveTab('performance')} 
              />
            </>
          ) : currentRole === 'MARKETING' ? (
            <>
              {/* Marketing-Specific Navigation */}
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label="Ringkasan Kampanye" 
                active={activeTab === 'mkt_overview'} 
                onClick={() => setActiveTab('mkt_overview')} 
              />
              <SidebarItem 
                icon={<Megaphone size={20} />} 
                label="Kelola Kampanye" 
                active={activeTab === 'mkt_campaigns'} 
                onClick={() => setActiveTab('mkt_campaigns')} 
              />
              <SidebarItem 
                icon={<PieChartIcon size={20} />} 
                label="Segmentasi Nasabah" 
                active={activeTab === 'mkt_segments'} 
                onClick={() => setActiveTab('mkt_segments')} 
              />
              <SidebarItem 
                icon={<FileText size={20} />} 
                label="Pustaka Konten" 
                active={activeTab === 'mkt_content'} 
                onClick={() => setActiveTab('mkt_content')} 
              />
            </>
          ) : currentRole === 'RM' ? (
            <>
              {/* RM-Specific Navigation */}
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label="Performansi Sales" 
                active={activeTab === 'rm_performance'} 
                onClick={() => setActiveTab('rm_performance')} 
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label="Portfolio Nasabah" 
                active={activeTab === 'rm_portfolio'} 
                onClick={() => setActiveTab('rm_portfolio')} 
              />
              <SidebarItem 
                icon={<Target size={20} />} 
                label="Leads & Peluang" 
                active={activeTab === 'rm_leads'} 
                onClick={() => setActiveTab('rm_leads')} 
              />
              <SidebarItem 
                icon={<TrendingUp size={20} />} 
                label="Pipeline Penjualan" 
                active={activeTab === 'rm_pipeline'} 
                onClick={() => setActiveTab('rm_pipeline')} 
              />
              <SidebarItem 
                icon={<Activity size={20} />} 
                label="Aktivitas Harian" 
                active={activeTab === 'rm_activity'} 
                onClick={() => setActiveTab('rm_activity')} 
              />
            </>
          ) : (
            <>
              {/* Default Navigation for other roles */}
              {availableTabs.includes('dashboard') && (
                <SidebarItem 
                  icon={<LayoutDashboard size={20} />} 
                  label="Dashboard RFM" 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')} 
                />
              )}
              {availableTabs.includes('customers') && (
                <SidebarItem 
                  icon={<Users size={20} />} 
                  label={permissions.canViewOwnCustomers && !permissions.canViewAllCustomers ? 'Nasabah Saya' : 'Daftar Nasabah'} 
                  active={activeTab === 'customers'} 
                  onClick={() => setActiveTab('customers')} 
                />
              )}
              {availableTabs.includes('campaigns') && (
                <SidebarItem 
                  icon={<Zap size={20} />} 
                  label="Campaign Triggers" 
                  active={activeTab === 'campaigns'} 
                  onClick={() => setActiveTab('campaigns')} 
                />
              )}
              {availableTabs.includes('settings') && (
                <SidebarItem 
                  icon={<Sliders size={20} />} 
                  label="Konfigurasi RFM" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')} 
                />
              )}
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Top Header - hide on settings */}
        {activeTab !== 'settings' && (
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {activeTab === 'dashboard' && 'Dashboard RFM'}
                {activeTab === 'customers' && 'Daftar Nasabah'}
                {activeTab === 'campaigns' && 'Campaign Triggers'}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-gray-500 text-sm">Data Real-time: {demoState.isActive ? demoState.simulatedTime : currentDate.toLocaleTimeString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle2 size={12} className="text-green-600" />
                  <span className="text-[10px] font-medium text-green-700 uppercase tracking-wider">Secured</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Global Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50" 
                />
              </div>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-sumut-orange rounded-full"></span>
              </button>
            </div>
          </header>
        )}

        {/* CS-Specific Content: Ticket Queue */}
        {activeTab === 'tickets' && currentRole === 'CS' && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <TicketQueue
              tickets={mockTickets}
              customers={processedCustomers}
              currentAgentId="all"
              onTicketClick={(ticket) => {
                alert(`📋 Tiket ${ticket.id}: ${ticket.subject}\n\nKategori: ${ticket.category}\nPrioritas: ${ticket.priority}\nStatus: ${ticket.status}`);
              }}
              onResolveTicket={(ticketId, resolution) => {
                console.log(`Resolved ${ticketId}: ${resolution}`);
              }}
              onViewCustomer={(customer) => {
                setSelectedCustomer(customer);
                setRecentCustomers(prev => {
                  const filtered = prev.filter(c => c.id !== customer.id);
                  return [customer, ...filtered].slice(0, 5);
                });
              }}
            />
          </div>
        )}

        {/* CS-Specific Content: Customer Search (CS-optimized) */}
        {activeTab === 'customers' && currentRole === 'CS' && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <CustomerSearchCS
              customers={processedCustomers}
              recentCustomers={recentCustomers}
              onSelectCustomer={(customer) => {
                setSelectedCustomer(customer);
                setRecentCustomers(prev => {
                  const filtered = prev.filter(c => c.id !== customer.id);
                  return [customer, ...filtered].slice(0, 5);
                });
              }}
            />
          </div>
        )}

        {/* CS-Specific Content: Knowledge Base */}
        {activeTab === 'kb' && currentRole === 'CS' && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <KnowledgeBase />
          </div>
        )}

        {/* CS-Specific Content: Performance Dashboard */}
        {activeTab === 'performance' && currentRole === 'CS' && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <CSPerformance
              agentId="cs-agent-001"
              agentName="CS Agent 1"
            />
          </div>
        )}

        {/* Marketing-Specific Content: All Marketing tabs render MarketingCloud with different activeSubTab */}
        {currentRole === 'MARKETING' && (activeTab === 'mkt_overview' || activeTab === 'mkt_campaigns' || activeTab === 'mkt_segments' || activeTab === 'mkt_content') && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <MarketingCloud
              customers={processedCustomers}
              campaigns={campaigns}
              onCampaignsChange={(updatedCampaigns) => {
                setCampaigns(updatedCampaigns);
                onCampaignsChange?.(updatedCampaigns);
              }}
              onSelectCustomer={(customer) => setSelectedCustomer(customer)}
              hideSidebar={true}
              activeSubTab={
                activeTab === 'mkt_overview' ? undefined :
                activeTab === 'mkt_campaigns' ? 'Campaigns' :
                activeTab === 'mkt_segments' ? 'Segments' :
                activeTab === 'mkt_content' ? 'Consent' : undefined
              }
            />
          </div>
        )}

        {/* RM-Specific Content: All RM tabs render SalesCloud with different activeSubTab */}
        {currentRole === 'RM' && (activeTab === 'rm_performance' || activeTab === 'rm_portfolio' || activeTab === 'rm_leads' || activeTab === 'rm_pipeline' || activeTab === 'rm_activity') && (
          <div className="h-[calc(100vh-2rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <SalesCloud
              customers={processedCustomers}
              applications={MOCK_LOAN_APPLICATIONS}
              onSelectCustomer={(customer) => setSelectedCustomer(customer)}
              hideSidebar={true}
              activeSubTab={
                activeTab === 'rm_performance' ? 'Home' :
                activeTab === 'rm_portfolio' ? 'Portfolio' :
                activeTab === 'rm_leads' ? 'Leads' :
                activeTab === 'rm_pipeline' ? 'Pipeline' :
                activeTab === 'rm_activity' ? 'Activity' : undefined
              }
            />
          </div>
        )}

        {/* RFM Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-sumut-blue/10 rounded-lg">
                  <Sliders className="w-5 h-5 text-sumut-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Konfigurasi RFM</h3>
                  <p className="text-sm text-gray-500">Atur threshold untuk segmentasi nasabah</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recency Config */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3">📅 Recency (Hari)</h4>
                  <p className="text-xs text-blue-600 mb-4">Seberapa baru nasabah bertransaksi</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">High (≤ X hari)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.recencyThresholds[0]} 
                        onChange={(e) => handleConfigChange('recency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Medium (≤ X hari)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.recencyThresholds[1]} 
                        onChange={(e) => handleConfigChange('recency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Low (≤ X hari)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.recencyThresholds[2]} 
                        onChange={(e) => handleConfigChange('recency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* Frequency Config */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-green-800 mb-3">🔄 Frequency (Transaksi)</h4>
                  <p className="text-xs text-green-600 mb-4">Seberapa sering nasabah bertransaksi</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Low (≥ X transaksi)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.frequencyThresholds[0]} 
                        onChange={(e) => handleConfigChange('frequency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Medium (≥ X transaksi)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.frequencyThresholds[1]} 
                        onChange={(e) => handleConfigChange('frequency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">High (≥ X transaksi)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.frequencyThresholds[2]} 
                        onChange={(e) => handleConfigChange('frequency', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* Monetary Config */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <h4 className="font-semibold text-amber-800 mb-3">💰 Monetary (Rupiah)</h4>
                  <p className="text-xs text-amber-600 mb-4">Total nilai transaksi nasabah</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Low (≥ Rp)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.monetaryThresholds[0]} 
                        onChange={(e) => handleConfigChange('monetary', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Medium (≥ Rp)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.monetaryThresholds[1]} 
                        onChange={(e) => handleConfigChange('monetary', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">High (≥ Rp)</label>
                      <input 
                        type="number" 
                        value={rfmConfig.monetaryThresholds[2]} 
                        onChange={(e) => handleConfigChange('monetary', parseInt(e.target.value) || 0, 'threshold')}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                <button 
                  onClick={resetConfig}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset ke Default
                </button>
                <div className="flex items-center gap-3">
                  {isConfigDirty && (
                    <span className="text-xs text-orange-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Ada perubahan belum disimpan
                    </span>
                  )}
                  <button 
                    onClick={saveConfig}
                    disabled={!isConfigDirty}
                    className={`px-6 py-2 rounded-lg flex items-center gap-2 font-semibold ${
                      isConfigDirty 
                        ? 'bg-sumut-blue text-white hover:bg-sumut-darkBlue' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} />
                    Simpan Konfigurasi
                  </button>
                </div>
              </div>
            </div>

            {/* Segment Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4">📊 Definisi Segmen RFM</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: 'Champions', desc: 'Skor RFM tinggi di semua dimensi', color: 'bg-emerald-500', icon: '👑' },
                  { name: 'Loyal', desc: 'Frequency tinggi, transaksi konsisten', color: 'bg-green-500', icon: '💎' },
                  { name: 'Potential', desc: 'Menunjukkan potensi pertumbuhan', color: 'bg-yellow-500', icon: '⭐' },
                  { name: 'At Risk', desc: 'Aktivitas menurun, perlu perhatian', color: 'bg-orange-500', icon: '⚠️' },
                  { name: 'Hibernating', desc: 'Tidak aktif dalam periode lama', color: 'bg-red-500', icon: '😴' },
                ].map(seg => (
                  <div key={seg.name} className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${seg.color}`}></span>
                      <span className="text-lg">{seg.icon}</span>
                      <span className="font-semibold text-sm">{seg.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{seg.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Executive KPI Cards (New Metric Requirements) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard 
                title="Retention Rate" 
                value={`${kpiData.retentionRate}%`} 
                change="+1.2%" 
                positive 
                tooltip="Persentase nasabah dari semua segmen yang tetap aktif bertransaksi."
                formula="(Nasabah Aktif Akhir / Total Awal) × 100"
                period="90 hari terakhir"
              />
              <KPICard 
                title="Program Utilization" 
                value={kpiData.pointVelocity.toLocaleString()} 
                change="+15.4%" 
                positive 
                subtitle="Activity/Month"
                tooltip="Total aktivitas program engagement nasabah per bulan (transaksi digital, fitur bank)."
                formula="Sum(Login + Transaksi + Fitur Usage)"
                period="30 hari terakhir"
              />
              <KPICard 
                title="Engagement Score" 
                value={`${kpiData.campaignRoi}%`} 
                change="+5.2%" 
                positive 
                tooltip="Skor rata-rata engagement berdasarkan aktivitas digital dan respons terhadap layanan."
                formula="(Transaksi×0.4 + Login×0.3 + Campaign×0.3) / Baseline"
                period="30 hari terakhir"
              />
              <KPICard 
                title="At Risk / Churn" 
                value={`${kpiData.churnRisk}%`} 
                change="-0.5%" 
                positive={true} 
                tooltip="Persentase nasabah berisiko tidak aktif (segment At Risk + Hibernating). Turun = positif."
                formula="(At Risk + Hibernating) / Total × 100"
                period="Real-time"
              />
            </div>

            {/* TIME-BASED PROMO RECOMMENDATIONS - Demo Mode */}
            {demoState.isActive && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sumut-blue/10 flex items-center justify-center">
                      <Clock className="text-sumut-blue" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Rekomendasi Berdasarkan Waktu</p>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Promo {timeBasedPromo.slot}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Simulasi</p>
                    <p className="text-lg font-bold text-sumut-blue">{demoState.simulatedTime}</p>
                    <p className="text-xs text-gray-400">{demoState.simulatedDay}</p>
                  </div>
                </div>

                {/* Promo Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {timeBasedPromo.promos.map((promo, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-sumut-blue/30 transition cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-md bg-sumut-blue text-white flex items-center justify-center font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{promo.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{promo.desc}</p>
                          <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-1 rounded ${
                            promo.target === 'Champions' ? 'bg-green-50 text-green-700 border border-green-200' :
                            promo.target === 'Loyal' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            promo.target === 'Potential' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            Target: {promo.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insight */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <TrendingUp size={16} className="text-sumut-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-gray-800">CRM Insight:</strong> Nasabah cenderung lebih responsif terhadap promo yang relevan dengan waktu akses mereka.
                      {timeBasedPromo.slot === 'Pagi' && ' Targetkan F&B dan cashback untuk memulai hari.'}
                      {timeBasedPromo.slot === 'Siang' && ' Fokus pada promo makan siang dan shopping cepat.'}
                      {timeBasedPromo.slot === 'Malam' && ' Promo hiburan dan dinner lebih efektif.'}
                      {timeBasedPromo.slot === 'Dini Hari' && ' Jangkau night owls dengan promo gaming dan tagihan.'}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* GEN-Z CONTEXTUAL PROMO - Coffee Shop QRIS Targeting */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                    ☕
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-600 uppercase tracking-wider font-bold">🎯 Gen-Z Contextual Promo</p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Coffee Shop x QRIS Bank Sumut
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-600 font-semibold">Target Umur: 18-27 tahun</p>
                  <p className="text-xl font-bold text-purple-700">{processedCustomers.filter(c => c.age && c.age <= 27).length}</p>
                  <p className="text-[10px] text-gray-500">nasabah Gen-Z</p>
                </div>
              </div>

              {/* Promo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CONTEXTUAL_PROMOS['Gen-Z'].filter(p => p.category === 'coffee').map((promo, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-purple-100 hover:border-purple-300 transition cursor-pointer hover:shadow-md group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        ☕
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 truncate">{promo.merchant}</h4>
                          {promo.qrisBonus && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sumut-blue text-white rounded">QRIS</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-purple-600 mt-0.5">{promo.discount}</p>
                        <p className="text-[10px] text-gray-400 mt-1">📍 {promo.location}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 italic">"{promo.copyMessage}"</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-400">📱 {promo.channel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="mt-4 flex items-center justify-between p-3 bg-white/60 rounded-lg border border-purple-100">
                <div className="flex items-center gap-4 text-xs text-purple-700">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {processedCustomers.filter(c => c.age && c.age <= 22).length} nasabah 18-22 thn
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {processedCustomers.filter(c => c.age && c.age > 22 && c.age <= 27).length} nasabah 23-27 thn
                  </span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-bold hover:from-purple-600 hover:to-pink-600 transition flex items-center gap-2">
                  <Megaphone size={14} />
                  Blast Promo Gen-Z
                </button>
              </div>
            </div>

            {/* TODAY'S ACTIVITY & TEAM PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Activity Widget */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <WidgetHeader 
                  title="Aktivitas Hari Ini" 
                  tooltip="Ringkasan aktivitas tim CRM hari ini: lead baru, calls, meetings, follow-ups, dan progress target harian."
                />
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.newLeads}</p>
                    <p className="text-[10px] text-gray-500">Lead Baru</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.callsMade}</p>
                    <p className="text-[10px] text-gray-500">Calls</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <Calendar size={16} className="text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.meetingsScheduled}</p>
                    <p className="text-[10px] text-gray-500">Meetings</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-2">
                      <Clock size={16} className="text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.followUps}</p>
                    <p className="text-[10px] text-gray-500">Follow-ups</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                      <FileCheck size={16} className="text-cyan-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.applicationsProcessed}</p>
                    <p className="text-[10px] text-gray-500">Processed</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="w-8 h-8 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                      <UserCheck size={16} className="text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{todayActivity.onboardingCompleted}</p>
                    <p className="text-[10px] text-gray-500">Onboarded</p>
                  </div>
                </div>
                {/* Target Progress */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Target Harian</span>
                    <span className="text-sm font-bold text-blue-600">{todayActivity.targetProgress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${todayActivity.targetProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Team Leaderboard */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <WidgetHeader 
                  title="Tim Leaderboard" 
                  tooltip="Peringkat tim berdasarkan deals closed dan total aktivitas bulan ini. Highlight performer terbaik."
                />
                <div className="space-y-3">
                  {teamMembers.slice(0, 4).map((member, idx) => (
                    <div key={member.id} className={`flex items-center gap-3 p-2 rounded-lg ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'}`}>
                      <div className="relative">
                        <span className="text-2xl">{member.avatar}</span>
                        {idx === 0 && <Trophy size={12} className="absolute -top-1 -right-1 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                        <p className="text-[10px] text-gray-500">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{member.deals}</p>
                        <p className="text-[10px] text-gray-400">deals</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRANSACTION SUMMARY TODAY */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
              <WidgetHeader 
                title="💰 Transaksi Hari Ini" 
                tooltip="Ringkasan transaksi nasabah hari ini. Menampilkan total masuk, keluar, net flow, dan transaksi terbesar."
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Incoming */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp size={16} className="text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">MASUK</span>
                  </div>
                  <p className="text-xl font-bold text-green-700">Rp {todayTransactions.incoming.toLocaleString('id-ID')}</p>
                </div>
                {/* Outgoing */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Send size={16} className="text-red-600" />
                    </div>
                    <span className="text-xs text-red-600 font-medium">KELUAR</span>
                  </div>
                  <p className="text-xl font-bold text-red-700">Rp {todayTransactions.outgoing.toLocaleString('id-ID')}</p>
                </div>
                {/* Net Flow */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity size={16} className="text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">NET FLOW</span>
                  </div>
                  <p className={`text-xl font-bold ${todayTransactions.netFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {todayTransactions.netFlow >= 0 ? '+' : ''}Rp {todayTransactions.netFlow.toLocaleString('id-ID')}
                  </p>
                </div>
                {/* Count */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileCheck size={16} className="text-purple-600" />
                    </div>
                    <span className="text-xs text-purple-600 font-medium">TOTAL TXN</span>
                  </div>
                  <p className="text-xl font-bold text-purple-700">{todayTransactions.count}</p>
                </div>
              </div>
              
              {/* Top Transactions */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3">🔥 Top 5 Transaksi Terbesar</p>
                <div className="space-y-2">
                  {todayTransactions.topTransactions.map((txn: any, idx: number) => (
                    <div key={txn.id || idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{txn.customerName || 'Customer'}</p>
                          <p className="text-[10px] text-gray-500">{txn.category} • {txn.merchant || txn.subcategory || '-'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-800">Rp {txn.amount.toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                  {todayTransactions.topTransactions.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Belum ada transaksi hari ini</p>
                  )}
                </div>
              </div>
            </div>

            {/* PENDING TASKS */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <WidgetHeader 
                title="Pending Follow-ups" 
                tooltip="Daftar tugas follow-up yang perlu ditindaklanjuti. Urgent/Overdue harus segera dikerjakan."
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Tipe</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Nasabah</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Due</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">RM</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Prioritas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTasks.map(task => (
                      <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{task.type}</span>
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800">{task.customer}</td>
                        <td className="py-2 px-3">
                          <span className={`text-xs font-medium ${task.dueDate === 'Overdue' ? 'text-red-600' : 'text-gray-600'}`}>
                            {task.dueDate}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{task.rm}</td>
                        <td className="py-2 px-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CRM Rules Engine & SLA Tickets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CRM Rules Engine - Auto-Generated Tasks */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <WidgetHeader 
                  title="CRM Rules Engine" 
                  tooltip="Tasks otomatis dibuat berdasarkan aturan segmentasi. At Risk → Follow-up, Hibernating → Winback, Champions → Upsell."
                />
                <div className="space-y-2 mt-4 max-h-[280px] overflow-y-auto">
                  {autoGeneratedTasks.length > 0 ? autoGeneratedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-sumut-blue/30 transition">
                      <span className="text-xl">{task.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800 truncate">{task.customer}</p>
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                            task.segment === 'At Risk' ? 'bg-red-100 text-red-700' :
                            task.segment === 'Hibernating' ? 'bg-gray-100 text-gray-700' :
                            'bg-green-100 text-green-700'
                          }`}>{task.segment}</span>
                        </div>
                        <p className="text-xs text-gray-500">{task.rule} → {task.action}</p>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                        task.priority === 'high' ? 'bg-red-50 text-red-600' :
                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>{task.priority.toUpperCase()}</span>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Tidak ada task otomatis</p>
                      <p className="text-xs mt-1">Semua nasabah dalam kondisi baik</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{autoGeneratedTasks.length} task auto-generated</p>
                  <button className="text-xs text-sumut-blue font-semibold hover:underline">Kelola Rules →</button>
                </div>
              </div>

              {/* SLA Tickets with Countdown */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <WidgetHeader 
                  title="Active Tickets (SLA)" 
                  tooltip="Tiket keluhan dengan countdown SLA. Hijau = aman, Kuning = perhatian, Merah = kritis, Abu = overdue."
                />
                <div className="space-y-2 mt-4 max-h-[280px] overflow-y-auto">
                  {ticketsWithSLA.map(ticket => (
                    <div key={ticket.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                      ticket.slaStatus === 'overdue' ? 'bg-red-50 border-red-200' :
                      ticket.slaStatus === 'critical' ? 'bg-orange-50 border-orange-200' :
                      ticket.slaStatus === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-gray-50 border-gray-100'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        ticket.slaStatus === 'overdue' ? 'bg-red-500' :
                        ticket.slaStatus === 'critical' ? 'bg-orange-500' :
                        ticket.slaStatus === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}>
                        {ticket.slaStatus === 'overdue' ? '!' : ticket.remainingTime.split('h')[0] + 'h'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{ticket.issue}</p>
                        <p className="text-xs text-gray-500">{ticket.customer} • {ticket.category} • {ticket.assignee}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-bold ${
                          ticket.slaStatus === 'overdue' ? 'text-red-600' :
                          ticket.slaStatus === 'critical' ? 'text-orange-600' :
                          ticket.slaStatus === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>{ticket.remainingTime}</p>
                        <span className={`text-[9px] uppercase font-medium ${
                          ticket.status === 'escalated' ? 'text-red-500' :
                          ticket.status === 'in-progress' ? 'text-blue-500' :
                          'text-gray-400'
                        }`}>{ticket.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Aman</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Warning</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Kritis</span>
                  </div>
                  <button className="text-xs text-sumut-blue font-semibold hover:underline">Lihat Semua →</button>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Segment Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <WidgetHeader 
                    title="Distribusi Segmen RFM" 
                    tooltip="Pembagian nasabah berdasarkan RFM (Recency, Frequency, Monetary). Champions = nasabah terbaik, Hibernating = perlu winback. Klik segment untuk filter."
                  />
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-medium">Window: 90 hari</p>
                    <p className="text-[10px] text-slate-400">As of: {new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height={300} minWidth={0}>
                    <PieChart>
                      <Pie
                        data={dynamicSegmentStats}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        animationDuration={1000}
                        labelLine={false}
                      >
                        {dynamicSegmentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value} nasabah`, name]}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string, entry: any) => {
                          const item = dynamicSegmentStats.find(s => s.name === value);
                          const total = dynamicSegmentStats.reduce((acc, s) => acc + s.value, 0);
                          const percent = item && total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                          return `${value} (${percent}%)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Bar Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <WidgetHeader 
                    title="Transaksi Mingguan" 
                    tooltip="Volume transaksi per hari dalam seminggu. Gunakan untuk identifikasi hari peak dan valley untuk timing campaign."
                  />
                  <div className="w-full h-[300px]">
                   <ResponsiveContainer width="100%" height={300} minWidth={0}>
                     <BarChart data={weeklyTransactions}>
                       <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                       <YAxis fontSize={12} stroke="#64748b" />
                       <Tooltip 
                         cursor={{fill: '#f3f4f6'}}
                         contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                       />
                       <Legend />
                       <Bar dataKey="value" fill="#00AEEF" radius={[4, 4, 0, 0]} animationDuration={1000} />
                     </BarChart>
                   </ResponsiveContainer>
                  </div>
               </div>
             </div>

            {/* NEW: Segment Performance Comparison Table */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <WidgetHeader 
                  title="Performa per Segmen CRM" 
                  tooltip="Detail metrik per segmen RFM. Customers = jumlah nasabah, Avg Balance = rata-rata saldo, Avg Txn/Month = frekuensi transaksi, Retention = tingkat retensi per segmen."
                />
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Real-time RFM Analysis</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-slate-700">Segment</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">Customers</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">Avg Balance</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">Avg Txn/Month</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">Avg Points</th>
                      <th className="text-right py-3 px-4 font-bold text-slate-700">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(segmentPerformance).map(([segment, metrics]) => {
                      const segmentColor = 
                        segment === RFMSegment.CHAMPIONS ? 'text-green-700 bg-green-50' :
                        segment === RFMSegment.LOYAL ? 'text-emerald-700 bg-emerald-50' :
                        segment === RFMSegment.POTENTIAL ? 'text-yellow-700 bg-yellow-50' :
                        segment === RFMSegment.AT_RISK ? 'text-orange-700 bg-orange-50' :
                        'text-red-700 bg-red-50';
                      
                      return (
                        <tr key={segment} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${segmentColor}`}>
                              {segment.split('(')[0].trim()}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 font-medium text-slate-800">{metrics.count}</td>
                          <td className="text-right py-3 px-4 text-slate-600">
                            Rp {(metrics.avgBalance / 1000000).toFixed(1)}jt
                          </td>
                          <td className="text-right py-3 px-4 text-slate-600">
                            {metrics.avgTransactions.toFixed(1)}
                          </td>
                          <td className="text-right py-3 px-4 text-slate-600">
                            {Math.round(metrics.avgPoints).toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              metrics.retention >= 80 ? 'bg-green-100 text-green-700' :
                              metrics.retention >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {metrics.retention}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEW: Points & Dompet Impian Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Analytics */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-4 relative group/pts">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Award size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-gray-800">Horas Points Analytics</h3>
                      <span className="text-gray-400 cursor-help text-sm">ⓘ</span>
                    </div>
                    <p className="text-xs text-gray-500">Tracking penggunaan poin reward</p>
                  </div>
                  <div className="absolute left-0 top-full mt-1 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 opacity-0 invisible group-hover/pts:opacity-100 group-hover/pts:visible transition-all duration-200 max-w-xs">
                    <p className="leading-relaxed">Total poin Horas Rewards. High Earners = nasabah dengan lebih dari 10K poin. Champions biasanya punya poin tertinggi karena transaksi frequent. Gunakan untuk segmentasi loyalty program.</p>
                    <div className="absolute -top-1 left-8 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Points</p>
                    <p className="text-xl font-bold text-purple-700">
                      {processedCustomers.reduce((sum, c) => sum + c.points, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Points</p>
                    <p className="text-xl font-bold text-purple-700">
                      {Math.round(processedCustomers.reduce((sum, c) => sum + c.points, 0) / processedCustomers.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">High Earners</p>
                    <p className="text-xl font-bold text-purple-700">
                      {processedCustomers.filter(c => c.points > 10000).length}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Points by Segment</p>
                  {Object.values(RFMSegment).slice(0, 4).map(seg => {
                    const segCustomers = processedCustomers.filter(c => c.segment === seg);
                    const avgPts = segCustomers.length ? Math.round(segCustomers.reduce((s, c) => s + c.points, 0) / segCustomers.length) : 0;
                    const maxPts = 20000;
                    return (
                      <div key={seg} className="flex items-center gap-2">
                        <span className="text-xs w-24 text-gray-600">{seg}</span>
                        <div className="flex-1 bg-white h-4 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 transition-all" style={{ width: `${(avgPts / maxPts) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-16 text-right">{avgPts.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Reward Redemption Stats */}
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Reward Activity</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">Total Redeemed</p>
                      <p className="text-lg font-bold text-purple-700">
                        {processedCustomers.reduce((sum, c) => sum + (c.rewardHistory?.length || 0), 0)}
                      </p>
                      <p className="text-[10px] text-gray-400">transactions</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">Active Streaks</p>
                      <p className="text-lg font-bold text-purple-700">
                        {processedCustomers.filter(c => (c.dailyLoginStreak || 0) >= 3).length} 🔥
                      </p>
                      <p className="text-[10px] text-gray-400">nasabah (3+ hari)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dompet Impian Analytics */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3 mb-4 relative group/dream">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-gray-800">Dompet Impian Analytics</h3>
                      <span className="text-gray-400 cursor-help text-sm">ⓘ</span>
                    </div>
                    <p className="text-xs text-gray-500">Tracking tabungan berjangka nasabah</p>
                  </div>
                  <div className="absolute left-0 top-full mt-1 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 opacity-0 invisible group-hover/dream:opacity-100 group-hover/dream:visible transition-all duration-200 max-w-xs">
                    <p className="leading-relaxed">Fitur tabungan goal-based nasabah. Total Savings = dana terkumpul semua goals. Avg Progress = rata-rata pencapaian target. Popular Goals = insight produk/campaign yang relevan.</p>
                    <div className="absolute -top-1 left-8 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Goals</p>
                    <p className="text-xl font-bold text-amber-700">
                      {processedCustomers.reduce((sum, c) => sum + (c.dreamSavers?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Savings</p>
                    <p className="text-xl font-bold text-amber-700">
                      Rp {(processedCustomers.reduce((sum, c) => 
                        sum + (c.dreamSavers?.reduce((s, d) => s + d.currentAmount, 0) || 0), 0) / 1000000).toFixed(1)}jt
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Progress</p>
                    <p className="text-xl font-bold text-amber-700">
                      {(() => {
                        const allDreams = processedCustomers.flatMap(c => c.dreamSavers || []);
                        if (!allDreams.length) return '0%';
                        const avgProgress = allDreams.reduce((sum, d) => sum + (d.currentAmount / d.targetAmount) * 100, 0) / allDreams.length;
                        return `${Math.round(avgProgress)}%`;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Popular Goals</p>
                  {(() => {
                    const allDreams = processedCustomers.flatMap(c => c.dreamSavers || []);
                    const goals: Record<string, number> = {};
                    allDreams.forEach(d => {
                      goals[d.name] = (goals[d.name] || 0) + 1;
                    });
                    return Object.entries(goals)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-700 truncate flex-1">{name}</span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{count} nasabah</span>
                        </div>
                      ));
                  })()}
                </div>
                
                {/* NEW: Real-time Activity Feed from Mobile */}
                {dreamSaverActivities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={14} className="text-amber-600" />
                      <p className="text-xs font-semibold text-gray-600">Aktivitas Terbaru</p>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {dreamSaverActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 bg-white rounded-lg p-2.5">
                          <img src={activity.userAvatar} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt={activity.userName} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-800 leading-relaxed">
                              <span className="font-semibold">{activity.userName}</span>{' '}
                              {activity.activityType === 'create' && <span className="text-blue-600"><PlusCircle size={12} className="inline" /> membuat dompet baru</span>}
                              {activity.activityType === 'topup' && <span className="text-green-600"><ArrowDownLeft size={12} className="inline" /> top up</span>}
                              {activity.activityType === 'withdraw' && <span className="text-orange-600"><ArrowUpRight size={12} className="inline" /> tarik dana</span>}
                              {activity.activityType === 'delete' && <span className="text-red-600"><Trash2 size={12} className="inline" /> hapus dompet</span>}
                              {activity.activityType === 'complete' && <span className="text-emerald-600"><Sparkles size={12} className="inline" /> mencapai target!</span>}
                              {' '}<span className="font-medium">"{activity.pocketName}"</span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Rp {activity.amount.toLocaleString('id-ID')} • {new Date(activity.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* NEW: CRM Quick Insights & Recommendations */}
            <div className="bg-gradient-to-br from-sumut-blue to-sumut-darkBlue p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">CRM Quick Insights</h3>
                  <p className="text-xs text-blue-100">Rekomendasi berbasis data real-time</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {crmInsights.map((insight, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${
                    insight.type === 'success' ? 'bg-green-500/20 border-green-300/30' :
                    insight.type === 'warning' ? 'bg-orange-500/20 border-orange-300/30' :
                    'bg-blue-500/20 border-blue-300/30'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {insight.type === 'success' && <CheckCircle2 size={16} className="text-green-300" />}
                          {insight.type === 'warning' && <AlertCircle size={16} className="text-orange-300" />}
                          {insight.type === 'info' && <TrendingUp size={16} className="text-blue-300" />}
                          <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                            {insight.type === 'success' ? 'Opportunity' : insight.type === 'warning' ? 'Action Required' : 'Insight'}
                          </span>
                        </div>
                        <p className="text-sm text-white/90">{insight.message}</p>
                      </div>
                      {insight.action && (
                        <button 
                          onClick={() => setActiveTab('campaigns')}
                          className="px-3 py-1.5 bg-white text-sumut-blue rounded-lg text-xs font-bold hover:bg-blue-50 transition whitespace-nowrap"
                        >
                          {insight.action}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="text-blue-100">
                  Berdasarkan analisis {processedCustomers.length} nasabah
                </span>
                <button className="flex items-center gap-1 text-white hover:text-blue-100 transition">
                  <RefreshCw size={14} />
                  <span>Refresh Insights</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            {/* RFM Summary Analytics Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">📊 Ringkasan Analisis RFM</h3>
                <span className="text-xs text-gray-500">{processedCustomers.length} total nasabah</span>
              </div>
              
              {/* Segment Distribution Cards */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {dynamicSegmentStats.map((stat, idx) => {
                  const colors = [
                    { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50', text: 'text-emerald-700' },
                    { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-700' },
                    { bg: 'from-amber-500 to-yellow-600', light: 'bg-amber-50', text: 'text-amber-700' },
                    { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', text: 'text-orange-700' },
                    { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-50', text: 'text-gray-700' },
                  ][idx];
                  const percentage = ((stat.value / processedCustomers.length) * 100).toFixed(1);
                  const metrics = segmentPerformance[stat.name as RFMSegment];
                  
                  return (
                    <div key={stat.name} className={`${colors.light} rounded-xl p-3 border border-gray-100`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${colors.text}`}>{stat.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${colors.bg} text-white`}>
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-[10px] text-gray-500">nasabah</p>
                      {metrics && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-[10px] text-gray-500">Avg Balance</p>
                          <p className="text-xs font-semibold text-gray-700">
                            Rp {(metrics.avgBalance / 1000000).toFixed(1)}jt
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Quick Insights Row */}
              <div className="grid grid-cols-4 gap-3">
                <div 
                  className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 cursor-help"
                  title="💡 Rata-rata skor RFM seluruh nasabah. Skor 5.0 = sempurna (transaksi terbaru, sering, dan nominal besar)."
                >
                  <p className="text-xs text-purple-600 font-medium">Avg RFM Score</p>
                  <p className="text-xl font-bold text-purple-800">
                    {(processedCustomers.reduce((sum, c) => sum + c.rfmScore.recency + c.rfmScore.frequency + c.rfmScore.monetary, 0) / (processedCustomers.length * 3)).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-purple-500">dari maks 5.0</p>
                </div>
                <div 
                  className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg p-3 border border-green-200 cursor-help"
                  title="💰 Total saldo gabungan seluruh nasabah yang terdaftar. Indikator nilai aset kelolaan bank."
                >
                  <p className="text-xs text-green-600 font-medium">Total Value</p>
                  <p className="text-xl font-bold text-green-800">
                    Rp {(processedCustomers.reduce((sum, c) => sum + c.balance, 0) / 1000000000).toFixed(2)}M
                  </p>
                  <p className="text-[10px] text-green-500">saldo gabungan</p>
                </div>
                <div 
                  className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg p-3 border border-amber-200 cursor-help"
                  title="🌟 Nasabah loyal dengan aktivitas tinggi. Prioritas untuk program loyalty dan cross-selling."
                >
                  <p className="text-xs text-amber-600 font-medium">Healthy Customers</p>
                  <p className="text-xl font-bold text-amber-800">
                    {processedCustomers.filter(c => c.segment === RFMSegment.CHAMPIONS || c.segment === RFMSegment.LOYAL).length}
                  </p>
                  <p className="text-[10px] text-amber-500">Champions + Loyal</p>
                </div>
                <div 
                  className="bg-gradient-to-r from-red-50 to-pink-100 rounded-lg p-3 border border-red-200 cursor-help"
                  title="⚠️ Nasabah dengan aktivitas menurun. Perlu tindakan segera: retargeting, promo khusus, atau follow-up call."
                >
                  <p className="text-xs text-red-600 font-medium">Perlu Perhatian</p>
                  <p className="text-xl font-bold text-red-800">
                    {processedCustomers.filter(c => c.segment === RFMSegment.AT_RISK || c.segment === RFMSegment.HIBERNATING).length}
                  </p>
                  <p className="text-[10px] text-red-500">At Risk + Hibernating</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative w-full md:w-64" title="🔍 Cari nasabah berdasarkan nama, ID, atau email">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input 
                       type="text" 
                       placeholder="Cari Nasabah (ID/Nama)..." 
                       value={customerSearch}
                       onChange={(e) => setCustomerSearch(e.target.value)}
                       className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50" 
                     />
                   </div>
                   <div className="relative" title="📊 Filter nasabah berdasarkan segmen RFM (Champions, Loyal, At Risk, dll)">
                      <select 
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50 cursor-pointer appearance-none"
                      >
                        <option value="All">Semua Segmen</option>
                        {Object.values(RFMSegment).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                   </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <button 
                   onClick={() => setShowColumnSettings(true)}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                   title="⚙️ Kustomisasi kolom tabel yang ditampilkan. Pengaturan disimpan ke localStorage."
                 >
                    <Settings size={16} /> Atur Kolom
                 </button>
                 <button 
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                   title="☑️ Pilih semua nasabah dalam daftar untuk aksi massal"
                 >
                    <CheckSquare size={16} /> Select All
                 </button>
                 <button 
                   onClick={() => setShowBlastModal(true)}
                   className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-sumut-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-200"
                   title="📢 Kirim promo massal ke nasabah. Consent Guard aktif - opt-out otomatis diblokir."
                 >
                    <Send size={16} /> Blast Promo
                 </button>
               </div>
            </div>

            {/* Blast Promo Consent Guard Modal */}
            {showBlastModal && (() => {
              const totalTarget = filteredCustomers.length;
              const optedOut = filteredCustomers.filter((c: any) => c.marketingConsent === false).length;
              const willSend = totalTarget - optedOut;
              
              return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-sumut-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send size={32} className="text-sumut-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Konfirmasi Blast Promo</h3>
                      <p className="text-sm text-gray-500 mt-2">Consent Guard aktif - Nasabah Opt-out akan diblokir</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Total Target (Filter: {customerFilter})</span>
                        <span className="font-bold text-gray-800">{totalTarget}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-sm text-green-700 flex items-center gap-2"><CheckCircle2 size={16} /> Akan Terkirim</span>
                        <span className="font-bold text-green-700">{willSend}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-sm text-red-700 flex items-center gap-2"><XCircle size={16} /> Diblokir (Opt-out)</span>
                        <span className="font-bold text-red-700">{optedOut}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowBlastModal(false)}
                        className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => {
                          alert(`✅ Blast Promo berhasil!\n\n${willSend} nasabah menerima promo.\n${optedOut} nasabah diblokir (Opt-out).`);
                          setShowBlastModal(false);
                        }}
                        className="flex-1 py-3 bg-sumut-blue text-white rounded-lg font-medium hover:bg-blue-600 transition"
                      >
                        Kirim ke {willSend} Nasabah
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Column Settings Modal */}
            {showColumnSettings && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-sumut-blue" />
                    Atur Kolom Tabel
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Pilih kolom yang ingin ditampilkan. Pengaturan akan disimpan.</p>
                  
                  <div className="space-y-2 mb-6">
                    {[
                      { key: 'contact', label: 'Kontak (Email/Phone)' },
                      { key: 'location', label: 'Lokasi' },
                      { key: 'segment', label: 'Segmen' },
                      { key: 'activeTime', label: 'Jam Aktif' },
                      { key: 'channel', label: 'Channel' },
                      { key: 'balance', label: 'Saldo' },
                    ].map(col => (
                      <label key={col.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col.key]}
                          onChange={(e) => setVisibleColumns(prev => ({ ...prev, [col.key]: e.target.checked }))}
                          className="w-4 h-4 text-sumut-blue rounded border-gray-300 focus:ring-sumut-blue"
                        />
                        <span className="text-sm text-gray-700">{col.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowColumnSettings(false)}
                      className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => saveColumnSettings(visibleColumns)}
                      className="flex-1 py-2 bg-sumut-blue text-white rounded-lg font-medium hover:bg-blue-600 transition text-sm"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium text-xs">
                   <tr>
                     <th className="px-4 py-3 text-left cursor-help" title="👤 Nama lengkap dan profil demografi nasabah">Nasabah</th>
                     {visibleColumns.contact && <th className="px-4 py-3 text-left cursor-help" title="📧 Email dan nomor telepon untuk komunikasi">Kontak</th>}
                     {visibleColumns.location && <th className="px-4 py-3 text-left cursor-help" title="📍 Kota/kabupaten domisili nasabah">Lokasi</th>}
                     {visibleColumns.segment && <th className="px-4 py-3 text-center cursor-help" title="🏷️ Segmen RFM: Champions, Loyal, Potential, At Risk, Hibernating">Segmen</th>}
                     {visibleColumns.activeTime && <th className="px-4 py-3 text-center cursor-help" title="⏰ Waktu paling aktif melakukan transaksi (untuk personalisasi promo)">Jam Aktif</th>}
                     {visibleColumns.channel && <th className="px-4 py-3 text-center cursor-help" title="📱 Channel preferensi: Mobile App, ATM, Branch, Web">Channel</th>}
                     {visibleColumns.balance && <th className="px-4 py-3 text-right cursor-help" title="💰 Total saldo rekening nasabah saat ini">Saldo</th>}
                     <th className="px-4 py-3" title="Menu aksi"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredCustomers.length > 0 ? filteredCustomers.map((cust) => (
                     <tr key={cust.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedCustomer(cust)}>
                       <td className="px-4 py-3">
                         <div className="flex items-center gap-3">
                           <img src={cust.avatar} alt={cust.name} className="w-9 h-9 rounded-full border border-gray-100" />
                           <div>
                             <p className="font-semibold text-slate-900 text-sm">{cust.name}</p>
                             <p className="text-[10px] text-gray-400">{cust.occupation || 'N/A'} • {cust.age || '?'} th</p>
                           </div>
                         </div>
                       </td>
                       {visibleColumns.contact && (
                         <td className="px-4 py-3">
                           <div className="text-xs">
                             <p className="text-gray-700 truncate max-w-[150px]">{cust.email || '-'}</p>
                             <p className="text-gray-500">{cust.phone || '-'}</p>
                           </div>
                         </td>
                       )}
                       {visibleColumns.location && (
                         <td className="px-4 py-3">
                           <span className="text-xs text-gray-700">{cust.location || 'N/A'}</span>
                         </td>
                       )}
                       {visibleColumns.segment && (
                         <td className="px-4 py-3 text-center">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cust.segment === 'Champions' ? 'bg-green-100 text-green-700' :
                              cust.segment === 'At Risk' ? 'bg-red-100 text-red-700' :
                              cust.segment === 'Potential' ? 'bg-yellow-100 text-yellow-700' :
                              cust.segment === 'Loyal' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {cust.segment}
                            </span>
                         </td>
                       )}
                       {visibleColumns.activeTime && (
                         <td className="px-4 py-3 text-center">
                           <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">{cust.activeTimeSlot || '-'}</span>
                         </td>
                       )}
                       {visibleColumns.channel && (
                         <td className="px-4 py-3 text-center">
                           <span className="text-xs text-gray-600">{cust.preferredChannel || '-'}</span>
                         </td>
                       )}
                       {visibleColumns.balance && (
                         <td className="px-4 py-3 text-right">
                           <span className="font-semibold text-gray-800 text-sm">Rp {cust.balance.toLocaleString('id-ID')}</span>
                         </td>
                       )}
                       <td className="px-4 py-3 text-right">
                         <button className="p-1 text-gray-400 hover:text-sumut-blue transition">
                           <MoreHorizontal size={16} />
                         </button>
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                         Tidak ada nasabah yang sesuai kriteria pencarian.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>
          </div>
        )}


        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Pipeline Kredit</h2>
                <p className="text-sm text-gray-500">Track loan applications through stages</p>
              </div>
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50">
                  <option>Semua Produk</option>
                  <option>KUR</option>
                  <option>KPR</option>
                  <option>Kredit Mikro</option>
                  <option>Kartu Kredit</option>
                </select>
                <button className="px-4 py-2 bg-sumut-blue text-white rounded-lg text-sm font-semibold hover:bg-sumut-blue/90">
                  + New Application
                </button>
              </div>
            </div>
            <PipelineKanban applications={[...MOCK_LOAN_APPLICATIONS]} />
          </div>
        )}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign List */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Active Triggers</h3>
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-400" />
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50 cursor-pointer"
                      >
                        <option value="All">Semua Status</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                 </div>

                 {filteredCampaigns.length === 0 ? (
                   <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
                     <p>Tidak ada kampanye dengan status ini.</p>
                   </div>
                 ) : (
                   filteredCampaigns.map(camp => (
                     <div key={camp.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md group">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                           <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${
                             camp.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                             camp.status === 'Draft' ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                           }`}>
                             {camp.status}
                           </span>
                           <h4 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-sumut-blue transition flex-1">{camp.title}</h4>
                        </div>
                        <div className="flex gap-2 flex-wrap mb-3">
                          {camp.targetSegment.map(s => (
                             <span key={s} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-500">{s}</span>
                          ))}
                        </div>
                        {/* Campaign Stats Row */}
                        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-800">{camp.status === 'Active' ? Math.floor(camp.reach * 1.2) : 0}</p>
                            <p className="text-[9px] text-gray-400">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{camp.status === 'Active' ? Math.floor(camp.reach * 0.85) : 0}</p>
                            <p className="text-[9px] text-gray-400">Opened ({camp.status === 'Active' ? Math.floor(70 + Math.random() * 15) : 0}%)</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">{camp.status === 'Active' ? Math.floor(camp.reach * 0.4) : 0}</p>
                            <p className="text-[9px] text-gray-400">Clicked ({camp.status === 'Active' ? Math.floor(30 + Math.random() * 15) : 0}%)</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{camp.status === 'Active' ? camp.conversion : 0}%</p>
                            <p className="text-[9px] text-gray-400">Converted</p>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleCampaignStatus(camp.id); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                              camp.status === 'Active' 
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {camp.status === 'Active' ? (
                              <>⏸ Pause Campaign</>
                            ) : (
                              <>▶ Activate Campaign</>
                            )}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); startEditCampaign(camp); }}
                            className="py-2 px-3 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                          >
                            ✏️ Edit
                          </button>
                          {onSendNotification && (
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                onSendNotification({
                                  title: '🎉 Promo Spesial!',
                                  message: camp.title,
                                  type: 'promo',
                                  campaignId: camp.id,
                                  targetSegment: camp.targetSegment,
                                  sentBy: 'Admin CRM',
                                  icon: '🎁'
                                });
                              }}
                              className="py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-1 shadow-md"
                            >
                              <Send size={12} /> Push
                            </button>
                          )}
                        </div>
                     </div>
                   ))
                 )}
              </div>

              {/* Campaign Strategy Builder - Minimalist & Formal */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Campaign Strategy Builder</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Buat trigger promo berdasarkan segmen dan profil nasabah</p>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-xs text-gray-600 font-medium">Ready</span>
                    </div>
                  </div>
                </div>
                
                {/* Form Body */}
                <div className="p-6 space-y-5">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Segment Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Segmen</label>
                      <select 
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedSegment}
                        onChange={(e) => setSelectedSegment(e.target.value as RFMSegment)}
                      >
                        {Object.values(RFMSegment).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Lokasi</label>
                      <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">Semua Lokasi</option>
                        <option value="Medan">Medan</option>
                        <option value="Binjai">Binjai</option>
                        <option value="Pematangsiantar">Pematangsiantar</option>
                        <option value="Deli Serdang">Deli Serdang</option>
                        <option value="Langkat">Langkat</option>
                      </select>
                    </div>

                    {/* Time Slot Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam Aktif</label>
                      <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">Semua Waktu</option>
                        <option value="morning">Pagi (06:00-12:00)</option>
                        <option value="afternoon">Siang (12:00-17:00)</option>
                        <option value="evening">Malam (17:00-22:00)</option>
                      </select>
                    </div>

                    {/* Occupation Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Profesi</label>
                      <select className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">Semua Profesi</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Pelajar">Pelajar</option>
                        <option value="Pengusaha">Pengusaha</option>
                        <option value="Karyawan">Karyawan</option>
                        <option value="PNS">PNS</option>
                      </select>
                    </div>
                  </div>

                  {/* Day Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hari Preferred</label>
                    <div className="flex flex-wrap gap-2">
                      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                        <button 
                          key={day}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-md transition-colors"
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    <button 
                      onClick={handleGenerateInsight}
                      disabled={isLoadingAi}
                      className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {isLoadingAi ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          Generate Campaign Strategy
                        </>
                      )}
                    </button>
                  </div>

                  {/* Result */}
                  {aiInsight && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed">
                      <pre className="whitespace-pre-wrap font-sans">{aiInsight}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT CAMPAIGN MODAL - Outside campaigns tab */}
        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">✏️ Edit Campaign</h3>
                <button 
                  onClick={() => setEditingCampaign(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Judul Campaign</label>
                  <input 
                    type="text"
                    value={editingCampaign.title}
                    onChange={(e) => setEditingCampaign({...editingCampaign, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sumut-blue/50"
                    placeholder="Masukkan judul campaign..."
                  />
                </div>

                {/* Target Segment */}
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Target Segmen</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(RFMSegment).map(seg => (
                      <button
                        key={seg}
                        onClick={() => {
                          const isSelected = editingCampaign.targetSegment.includes(seg);
                          setEditingCampaign({
                            ...editingCampaign,
                            targetSegment: isSelected 
                              ? editingCampaign.targetSegment.filter(s => s !== seg)
                              : [...editingCampaign.targetSegment, seg]
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          editingCampaign.targetSegment.includes(seg)
                            ? 'bg-sumut-blue text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {seg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={updateCampaign}
                  className="flex-1 py-3 px-4 bg-sumut-blue hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  💾 Simpan Perubahan
                </button>
                <button 
                  onClick={() => deleteCampaign(editingCampaign.id)}
                  className="py-3 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg transition"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEMO MODE TAB */}
        {activeTab === 'demo' && (
          <DemoSandbox />
        )}

        {/* Settings tab disabled for demo */}
        {false && (
           <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm prose max-w-none text-slate-800">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg text-sumut-blue">
                   <FileText size={32} />
                </div>
                <div>
                   <h1 className="text-2xl font-bold m-0 text-slate-900">Validasi Teoritis CRM</h1>
                   <p className="text-gray-500 m-0">Mapping Fitur Aplikasi vs Teori 6 Tahapan Logika CRM</p>
                </div>
             </div>
             
             <div className="overflow-hidden border border-gray-200 rounded-xl mb-8">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tahapan Logika CRM</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Implementasi di SULTAN App</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">1. Data Acquisition</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Pencatatan transaksi real-time (Mobile), Log Absen Harian, & Input Dompet Impian.</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">2. Data Management</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Sentralisasi profil nasabah (Types.ts) menggabungkan data finansial & behavioral (XP/Poin).</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">3. Data Analysis</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Algoritma RFM Engine di Dashboard Admin & AI Insight untuk strategi segmen.</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">4. Personalized Interaction</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Sapaan "Horas" di Header, Rekomendasi Promo Lokal, & Notifikasi Triggered.</td>
                   </tr>
                   <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">5. Retention & Loyalty</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Sistem Leveling "Menuju Sultan", Badges Gamification, & Penguncian dana di Dream Savers.</td>
                   </tr>
                    <tr>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">6. Feedback</td>
                     <td className="px-6 py-4 text-sm text-gray-600">Looping data RFM (skor berubah setelah aksi), Pusat Bantuan, & Monitoring KPI.</td>
                   </tr>
                 </tbody>
               </table>
             </div>

             <h3>Alur Kerja Sistem (System Flow)</h3>
             <ol className="list-decimal pl-5 space-y-2 marker:text-sumut-blue marker:font-bold">
               <li><strong>Acquisition:</strong> User scan QRIS di Mobile App → Data masuk ke sistem.</li>
               <li><strong>Management:</strong> Database memperbarui saldo & menambahkan histori transaksi.</li>
               <li><strong>Analysis:</strong> Admin Dashboard menghitung ulang skor RFM. Jika frekuensi tinggi → User naik ke segmen "Loyal".</li>
               <li><strong>Interaction:</strong> Trigger otomatis mengirim notifikasi: "Selamat level Sultan naik!".</li>
               <li><strong>Retention:</strong> User termotivasi mengejar Badge baru → Transaksi lagi.</li>
               <li><strong>Feedback:</strong> Grafik Retention Rate di Admin Dashboard meningkat.</li>
             </ol>
             
             <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
               <h4 className="text-sumut-blue font-bold text-lg mb-2">Kesimpulan Akademis</h4>
               <p className="text-slate-700 italic">
                 "Implementasi sistem ini membuktikan bahwa pendekatan <strong>Hybrid Loyalty</strong> (menggabungkan fungsi perbankan tradisional dengan gamifikasi modern) adalah solusi valid untuk meningkatkan <strong>Customer Lifetime Value (CLV)</strong> pada segmen Gen Z di Bank Pembangunan Daerah."
               </p>
             </div>
           </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-bold text-slate-800">Konfigurasi RFM</h2>
                  <p className="text-gray-500 text-sm">Sesuaikan cara sistem menghitung skor dan segmen nasabah.</p>
               </div>
               {isConfigDirty && (
                 <div className="flex gap-2">
                   <button onClick={resetConfig} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                      <RotateCcw size={16} /> Reset
                   </button>
                   <button onClick={saveConfig} className="flex items-center gap-2 px-4 py-2 bg-sumut-blue text-white rounded-lg hover:bg-blue-600 transition shadow-lg shadow-blue-200">
                      <Save size={16} /> Simpan
                   </button>
                 </div>
               )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weights Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sumut-blue">
                        <Sliders size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800">Bobot Penilaian</h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Prioritas Recency (Waktu)</label>
                          <span className="text-sm font-bold text-sumut-blue">{rfmConfig.weights.recency}x</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="5" step="0.5" 
                          value={rfmConfig.weights.recency}
                          onChange={(e) => handleConfigChange('recency', parseFloat(e.target.value), 'weight')}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sumut-blue"
                        />
                        <p className="text-xs text-gray-400 mt-1">Bobot tinggi memprioritaskan nasabah yang baru saja bertransaksi.</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Prioritas Frequency (Frekuensi)</label>
                          <span className="text-sm font-bold text-sumut-blue">{rfmConfig.weights.frequency}x</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="5" step="0.5" 
                          value={rfmConfig.weights.frequency}
                          onChange={(e) => handleConfigChange('frequency', parseFloat(e.target.value), 'weight')}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sumut-blue"
                        />
                        <p className="text-xs text-gray-400 mt-1">Bobot tinggi menargetkan nasabah yang sering bertransaksi (Target Gen Z).</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Prioritas Monetary (Nominal)</label>
                          <span className="text-sm font-bold text-sumut-blue">{rfmConfig.weights.monetary}x</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="5" step="0.5" 
                          value={rfmConfig.weights.monetary}
                          onChange={(e) => handleConfigChange('monetary', parseFloat(e.target.value), 'weight')}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sumut-blue"
                        />
                        <p className="text-xs text-gray-400 mt-1">Bobot tinggi menargetkan nasabah dengan saldo besar (High Net Worth).</p>
                      </div>
                   </div>
                </div>

                {/* Thresholds Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-sumut-orange">
                        <Award size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800">Ambang Batas Segmen</h3>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                         <label className="text-xs font-bold text-green-700 uppercase mb-2 block">Sultan Sejati (Min Skor)</label>
                         <div className="flex items-center gap-4">
                           <input 
                              type="number" step="0.1" max="5" min="0"
                              value={rfmConfig.thresholds.champions}
                              onChange={(e) => handleConfigChange('champions', parseFloat(e.target.value), 'threshold')}
                              className="w-20 p-2 text-sm border border-green-200 rounded text-center font-bold text-green-800"
                           />
                           <div className="flex-1 h-2 bg-green-200 rounded-full">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(rfmConfig.thresholds.champions / 5) * 100}%`}}></div>
                           </div>
                         </div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                         <label className="text-xs font-bold text-blue-700 uppercase mb-2 block">Kawan Setia (Min Skor)</label>
                         <div className="flex items-center gap-4">
                           <input 
                              type="number" step="0.1" max="5" min="0"
                              value={rfmConfig.thresholds.loyal}
                              onChange={(e) => handleConfigChange('loyal', parseFloat(e.target.value), 'threshold')}
                              className="w-20 p-2 text-sm border border-blue-200 rounded text-center font-bold text-blue-800"
                           />
                           <div className="flex-1 h-2 bg-blue-200 rounded-full">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(rfmConfig.thresholds.loyal / 5) * 100}%`}}></div>
                           </div>
                         </div>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
                         <label className="text-xs font-bold text-yellow-700 uppercase mb-2 block">Calon Sultan (Min Skor)</label>
                         <div className="flex items-center gap-4">
                           <input 
                              type="number" step="0.1" max="5" min="0"
                              value={rfmConfig.thresholds.potential}
                              onChange={(e) => handleConfigChange('potential', parseFloat(e.target.value), 'threshold')}
                              className="w-20 p-2 text-sm border border-yellow-200 rounded text-center font-bold text-yellow-800"
                           />
                           <div className="flex-1 h-2 bg-yellow-200 rounded-full">
                              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(rfmConfig.thresholds.potential / 5) * 100}%`}}></div>
                           </div>
                         </div>
                      </div>

                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                         <label className="text-xs font-bold text-orange-700 uppercase mb-2 block">Hampir Lupa (At Risk) (Min Skor)</label>
                         <div className="flex items-center gap-4">
                           <input 
                              type="number" step="0.1" max="5" min="0"
                              value={rfmConfig.thresholds.atRisk}
                              onChange={(e) => handleConfigChange('atRisk', parseFloat(e.target.value), 'threshold')}
                              className="w-20 p-2 text-sm border border-orange-200 rounded text-center font-bold text-orange-800"
                           />
                           <div className="flex-1 h-2 bg-orange-200 rounded-full">
                              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(rfmConfig.thresholds.atRisk / 5) * 100}%`}}></div>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Customer 360 View Modal */}
      {selectedCustomer && (
        <Customer360View 
          user={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-sm
      ${active 
        ? 'bg-sumut-blue/10 text-sumut-blue' 
        : 'text-gray-500 hover:bg-gray-50'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Widget Header with Tooltip
const WidgetHeader = ({ title, tooltip, icon }: { title: string; tooltip?: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-4 relative group/widget">
    {icon && <span className="text-gray-600">{icon}</span>}
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    {tooltip && (
      <>
        <span className="text-gray-400 cursor-help text-sm">ⓘ</span>
        <div className="absolute left-0 top-full mt-1 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 opacity-0 invisible group-hover/widget:opacity-100 group-hover/widget:visible transition-all duration-200 max-w-xs">
          <p className="leading-relaxed">{tooltip}</p>
          <div className="absolute -top-1 left-8 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </>
    )}
  </div>
);

const KPICard = ({ title, value, change, positive, subtitle, tooltip, formula, period }: {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  subtitle?: string;
  tooltip?: string;
  formula?: string;
  period?: string;
}) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md relative group">
    <div className="flex items-center gap-1 mb-2">
      <p className="text-slate-700 text-xs font-semibold uppercase tracking-wider">{title}</p>
      {tooltip && (
        <span className="text-gray-400 cursor-help text-xs hover:text-sumut-blue transition-colors">ⓘ</span>
      )}
    </div>
    {/* Enhanced Tooltip with Formula & Period */}
    {tooltip && (
      <div className="absolute left-0 right-0 top-full mt-1 p-4 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="font-bold text-white/90 mb-2">{title}</div>
        <p className="text-white/80 leading-relaxed">{tooltip}</p>
        {formula && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Formula</p>
            <code className="text-[11px] font-mono bg-slate-700 px-2 py-1 rounded block">{formula}</code>
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-white/50 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          Periode: {period || '30 hari terakhir'}
        </div>
        <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    )}
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{value}</h3>
        {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
  </div>
);

export default AdminDashboard;