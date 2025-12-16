import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { MOCK_CAMPAIGNS, MOCK_USER, SEGMENT_STATS, MOCK_CUSTOMERS_LIST } from '../../constants';
import { RFMSegment, User, RFMConfig } from '../../types';
import { LayoutDashboard, Users, Zap, Settings, Bell, Search, Menu, Send, Bot, FileText, Filter, MoreHorizontal, ChevronDown, CheckSquare, X, Smartphone, TrendingUp, AlertCircle, Award, Sliders, Save, RotateCcw, Target } from 'lucide-react';
import { generateCampaignStrategy } from '../../services/geminiService';

interface AdminDashboardProps {
  // Props if needed for lifting state
}

const COLORS = ['#00AEEF', '#F7941D', '#007BB5', '#FFB055', '#94A3B8'];

// Default Config
const DEFAULT_RFM_CONFIG: RFMConfig = {
  weights: {
    recency: 1,
    frequency: 1,
    monetary: 1,
  },
  thresholds: {
    champion: 4.5,
    loyal: 3.5,
    potential: 2.5,
    atRisk: 1.5,
  }
};

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'campaigns' | 'concept' | 'settings'>('overview');
  const [selectedSegment, setSelectedSegment] = useState<RFMSegment>(RFMSegment.POTENTIAL);
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

      // Simulate Bar Chart Data (Transaction volume fluctuation)
      setWeeklyTransactions(prev => prev.map(item => ({
        ...item,
        value: Math.max(1000, item.value + Math.floor((Math.random() - 0.5) * 200))
      })));

    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // --- Dynamic Logic: Recalculate Customers based on Config ---
  const processedCustomers = useMemo(() => {
    return MOCK_CUSTOMERS_LIST.map(user => {
      // 1. Calculate Weighted Score
      const { recency, frequency, monetary } = user.rfmScore;
      const { weights, thresholds } = rfmConfig;
      
      const totalWeight = weights.recency + weights.frequency + weights.monetary;
      // Avoid division by zero
      const divisor = totalWeight === 0 ? 1 : totalWeight;
      
      const weightedScore = (
        (recency * weights.recency) + 
        (frequency * weights.frequency) + 
        (monetary * weights.monetary)
      ) / divisor;

      // 2. Determine Segment based on Thresholds
      let newSegment = RFMSegment.HIBERNATING;
      if (weightedScore >= thresholds.champion) newSegment = RFMSegment.CHAMPIONS;
      else if (weightedScore >= thresholds.loyal) newSegment = RFMSegment.LOYAL;
      else if (weightedScore >= thresholds.potential) newSegment = RFMSegment.POTENTIAL;
      else if (weightedScore >= thresholds.atRisk) newSegment = RFMSegment.AT_RISK;

      return {
        ...user,
        segment: newSegment,
        calculatedScore: weightedScore.toFixed(2)
      };
    });
  }, [rfmConfig]);

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


  const handleGenerateInsight = async () => {
    setIsLoadingAi(true);
    const result = await generateCampaignStrategy(selectedSegment);
    setAiInsight(result || 'No insight generated.');
    setIsLoadingAi(false);
  };

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => 
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
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
           <div className="w-8 h-8 bg-sumut-blue rounded-lg flex items-center justify-center text-white font-bold">BS</div>
           <div>
             <h1 className="font-bold text-lg text-slate-900">SULTAN Admin</h1>
             <p className="text-xs text-gray-500">Bank Sumut CRM v2.0</p>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Executive Dashboard" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Nasabah (RFM)" 
            active={activeTab === 'customers'} 
            onClick={() => setActiveTab('customers')} 
          />
          <SidebarItem 
            icon={<Zap size={20} />} 
            label="Promo Triggers" 
            active={activeTab === 'campaigns'} 
            onClick={() => setActiveTab('campaigns')} 
          />
           <SidebarItem 
            icon={<FileText size={20} />} 
            label="Kerangka Teori CRM" 
            active={activeTab === 'concept'} 
            onClick={() => setActiveTab('concept')} 
          />
          <SidebarItem 
            icon={<Sliders size={20} />} 
            label="Konfigurasi RFM" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin+Bank&background=00AEEF&color=fff" alt="Admin" />
             </div>
             <div>
               <p className="text-sm font-bold">Admin Bank</p>
               <p className="text-xs text-gray-500">System Analyst</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'overview' && 'Executive Summary'}
              {activeTab === 'customers' && 'Nasabah & RFM Analysis'}
              {activeTab === 'campaigns' && 'Loyalty Triggers'}
              {activeTab === 'concept' && 'Dokumen Perancangan CRM'}
              {activeTab === 'settings' && 'Konfigurasi Logika RFM'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-gray-500 text-sm">Data Real-time: {currentDate.toLocaleTimeString('id-ID')}</p>
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

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive KPI Cards (New Metric Requirements) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPICard 
                title="Retention Rate (Gen Z)" 
                value={`${kpiData.retentionRate}%`} 
                change="+1.2%" 
                positive 
              />
              <KPICard 
                title="Points Redemption" 
                value={kpiData.pointVelocity.toLocaleString()} 
                change="+15.4%" 
                positive 
                subtitle="Pts/Month"
              />
              <KPICard 
                title="Campaign ROI" 
                value={`${kpiData.campaignRoi}%`} 
                change="+5.2%" 
                positive 
              />
              <KPICard 
                title="At Risk / Churn" 
                value={`${kpiData.churnRisk}%`} 
                change="-0.5%" 
                positive={true} 
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Distribusi Level "Horas Rewards"</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Live Updates based on Config</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={dynamicSegmentStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {dynamicSegmentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Frequency Transaksi Mingguan</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Last 7 Days</span>
                </div>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart
                      data={weeklyTransactions}
                    >
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#00AEEF" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                    </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input 
                       type="text" 
                       placeholder="Cari Nasabah (ID/Nama)..." 
                       value={customerSearch}
                       onChange={(e) => setCustomerSearch(e.target.value)}
                       className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50" 
                     />
                   </div>
                   <div className="relative">
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
                 <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    <CheckSquare size={16} /> Select All
                 </button>
                 <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-sumut-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-200">
                    <Send size={16} /> Blast Promo
                 </button>
               </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium">
                   <tr>
                     <th className="px-6 py-4">Nasabah</th>
                     <th className="px-6 py-4">Segmen RFM</th>
                     <th className="px-6 py-4 text-center">Recency</th>
                     <th className="px-6 py-4 text-center">Frequency</th>
                     <th className="px-6 py-4 text-right">Monetary</th>
                     <th className="px-6 py-4 text-center">Score</th>
                     <th className="px-6 py-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {filteredCustomers.length > 0 ? filteredCustomers.map((cust) => (
                     <tr key={cust.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedCustomer(cust)}>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <img src={cust.avatar} alt={cust.name} className="w-10 h-10 rounded-full border border-gray-100" />
                           <div>
                             <p className="font-bold text-slate-900">{cust.name}</p>
                             <p className="text-xs text-gray-500">{cust.id}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                           cust.segment.includes('Champions') ? 'bg-green-50 text-green-700 border-green-200' :
                           cust.segment.includes('Risk') ? 'bg-red-50 text-red-700 border-red-200' :
                           cust.segment.includes('Potential') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                           'bg-blue-50 text-blue-700 border-blue-200'
                         }`}>
                           {cust.segment.split(' (')[1].replace(')', '')}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-slate-700">{cust.rfmScore.recency * 3}</span>
                            <span className="text-[10px] text-gray-400">days ago</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-slate-700">{cust.rfmScore.frequency * 4}x</span>
                            <span className="text-[10px] text-gray-400">/ month</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right font-medium text-slate-700">
                         Rp {cust.balance.toLocaleString('id-ID')}
                       </td>
                       <td className="px-6 py-4 text-center">
                         <div className="w-12 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-xs font-bold text-gray-600 border border-gray-200">
                            {/* @ts-ignore */}
                            {cust.calculatedScore}
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="p-1 text-gray-400 hover:text-sumut-blue transition">
                           <MoreHorizontal size={20} />
                         </button>
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                         Tidak ada nasabah yang sesuai kriteria pencarian.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>
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
                     <div key={camp.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center transition hover:shadow-md group">
                        <div className="flex-1 pr-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                             <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${
                               camp.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                               camp.status === 'Draft' ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                             }`}>
                               {camp.status}
                             </span>
                             <h4 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-sumut-blue transition">{camp.title}</h4>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {camp.targetSegment.map(s => (
                               <span key={s} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-500">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right pl-4 border-l border-gray-100">
                          <p className="text-xl font-bold text-sumut-blue">{camp.conversion}%</p>
                          <p className="text-[10px] text-gray-500">Conv. Rate</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              {/* AI Generator */}
              <div className="bg-gradient-to-br from-sumut-blue to-blue-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <Bot className="text-sumut-orange" />
                     <h3 className="font-bold text-lg">AI Campaign Strategist</h3>
                  </div>
                  <p className="text-sm text-blue-100 mb-6">Gunakan Gemini AI untuk membuat trigger promo otomatis berdasarkan perilaku RFM.</p>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-200">Pilih Target Segmen</label>
                    <select 
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-sumut-orange option:text-black"
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value as RFMSegment)}
                    >
                      {Object.values(RFMSegment).map(s => (
                        <option key={s} value={s} className="text-black">{s}</option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={handleGenerateInsight}
                      disabled={isLoadingAi}
                      className="w-full bg-sumut-orange hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2"
                    >
                      {isLoadingAi ? 'Sedang Berpikir...' : 'Buat Strategi Promo'}
                      {!isLoadingAi && <Zap size={18} />}
                    </button>
                  </div>

                  {aiInsight && (
                    <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/10 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-4">
                       <pre className="whitespace-pre-wrap font-sans">{aiInsight}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concept' && (
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
               <li><strong>Acquisition:</strong> User scan QRIS di Mobile App -> Data masuk ke sistem.</li>
               <li><strong>Management:</strong> Database memperbarui saldo & menambahkan histori transaksi.</li>
               <li><strong>Analysis:</strong> Admin Dashboard menghitung ulang skor RFM. Jika frekuensi tinggi -> User naik ke segmen "Loyal".</li>
               <li><strong>Interaction:</strong> Trigger otomatis mengirim notifikasi: "Selamat level Sultan naik!".</li>
               <li><strong>Retention:</strong> User termotivasi mengejar Badge baru -> Transaksi lagi.</li>
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
                              value={rfmConfig.thresholds.champion}
                              onChange={(e) => handleConfigChange('champion', parseFloat(e.target.value), 'threshold')}
                              className="w-20 p-2 text-sm border border-green-200 rounded text-center font-bold text-green-800"
                           />
                           <div className="flex-1 h-2 bg-green-200 rounded-full">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(rfmConfig.thresholds.champion / 5) * 100}%`}}></div>
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

      {/* Customer Detail Modal (Side Panel) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCustomer(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
             <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500">
               <X size={20} />
             </button>
             
             <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-sumut-orange/30 p-1 mb-3">
                   <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                <span className="text-sm text-gray-500 mb-2">{selectedCustomer.id}</span>
                <span className="px-3 py-1 bg-blue-100 text-sumut-blue rounded-full text-xs font-bold border border-blue-200">
                   {selectedCustomer.segment}
                </span>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                   <p className="text-xs text-gray-500 mb-1">Total Saldo</p>
                   <p className="font-bold text-slate-800">Rp {selectedCustomer.balance.toLocaleString('id-ID')}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                   <p className="text-xs text-gray-500 mb-1">Horas Poin</p>
                   <p className="font-bold text-sumut-orange">{selectedCustomer.points.toLocaleString()}</p>
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                   <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                     <Award size={18} className="text-sumut-blue" /> RFM Score
                   </h3>
                   <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Recency (Baru transaksi)</span>
                          <span className="font-bold">{selectedCustomer.rfmScore.recency}/5</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${selectedCustomer.rfmScore.recency * 20}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Frequency (Sering transaksi)</span>
                          <span className="font-bold">{selectedCustomer.rfmScore.frequency}/5</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500" style={{ width: `${selectedCustomer.rfmScore.frequency * 20}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Monetary (Nilai transaksi)</span>
                          <span className="font-bold">{selectedCustomer.rfmScore.monetary}/5</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-sumut-orange" style={{ width: `${selectedCustomer.rfmScore.monetary * 20}%`}}></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Calculated Weighted Score</span>
                          {/* @ts-ignore */}
                          <span className="text-lg font-bold text-sumut-blue">{selectedCustomer.calculatedScore}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Based on current Admin Configuration</p>
                      </div>
                   </div>
                </div>
                
                {/* NEW: Financial Goals Section for Admin */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Target size={18} className="text-sumut-blue" /> Financial Goals (Dompet Impian)
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                     {selectedCustomer.dreamSavers && selectedCustomer.dreamSavers.length > 0 ? (
                        selectedCustomer.dreamSavers.map(ds => {
                            const percent = Math.min(100, Math.round((ds.currentAmount / ds.targetAmount) * 100));
                            return (
                                <div key={ds.id} className="border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                   <div className="flex justify-between text-xs font-bold mb-1">
                                       <span>{ds.name}</span>
                                       <span className="text-sumut-orange">{percent}%</span>
                                   </div>
                                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                                       <div className="h-full bg-sumut-orange" style={{ width: `${percent}%` }}></div>
                                   </div>
                                   <p className="text-[10px] text-gray-400">Target: Rp {ds.targetAmount.toLocaleString()}</p>
                                </div>
                            );
                        })
                     ) : (
                         <p className="text-xs text-gray-400 italic">Belum ada Dompet Impian aktif.</p>
                     )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Smartphone size={18} className="text-sumut-blue" /> Next Best Action (AI)
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl">
                     <p className="text-sm text-slate-700 leading-relaxed">
                       {selectedCustomer.segment === RFMSegment.CHAMPIONS ? 
                         "Nasabah ini adalah Sultan Sejati. Tawaran prioritas: KPR Bunga Spesial 0.5% atau Undangan Gala Dinner HUT Bank Sumut." :
                        selectedCustomer.segment === RFMSegment.POTENTIAL ?
                         "Potensi Gen Z tinggi. Push notifikasi saat jam makan siang: 'Diskon 30% di Cafe Mitra' untuk meningkatkan frekuensi." :
                        selectedCustomer.segment === RFMSegment.AT_RISK ?
                         "Risiko churn tinggi! Segera kirim voucher Token Listrik Rp 20rb sebagai 'Winback' strategy." :
                         "Analisis perilaku standar. Tawarkan pembukaan Deposito Berjangka dengan bunga kompetitif."
                       }
                     </p>
                     <button className="mt-3 w-full bg-white border border-blue-200 text-sumut-blue text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition shadow-sm">
                       Jalankan Action Ini
                     </button>
                  </div>
                </div>
             </div>

             <div className="mt-8 pt-4 border-t border-gray-100">
                <button className="w-full bg-sumut-orange text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition">
                  Hubungi Nasabah (WhatsApp)
                </button>
             </div>
          </div>
        </div>
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

const KPICard = ({ title, value, change, positive, subtitle }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{value}</h3>
        {subtitle && <p className="text-[10px] text-gray-400">{subtitle}</p>}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
  </div>
);

export default AdminDashboard;