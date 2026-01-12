import React, { useState, useMemo } from 'react';
import { User, Campaign, PushNotification } from '../../types';
import { Home, FileText, Users, CheckSquare, Menu, Bell, Phone, MessageCircle, Mail, Plus, ChevronRight, Search, Filter, TrendingUp, Target, Clock, AlertCircle, Star, ChevronLeft, Shield, HeartPulse } from 'lucide-react';
import { buildCRMMetricsProfile } from '../../services/crmMetricsAnalytics';
import { useDemoContext } from '../../contexts/DemoContext';

interface RMMobileAppProps {
  customers: User[];
  campaigns: Campaign[];
  currentRM?: string;
  notifications?: PushNotification[];
}

// Bottom Navigation Button
const NavBtn = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; badge?: number }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 relative ${active ? 'text-sumut-blue' : 'text-gray-400'}`}>
    <div className="relative">
      {icon}
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// KPI Mini Card
const KPIMiniCard = ({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) => (
  <div className={`${color} rounded-xl p-3 flex flex-col items-center justify-center text-center`}>
    <div className="mb-1">{icon}</div>
    <p className="text-lg font-bold text-gray-800">{value}</p>
    <p className="text-[10px] text-gray-500">{label}</p>
  </div>
);

// Task Item
const TaskItem = ({ time, title, type, completed, onToggle }: { time: string; title: string; type: string; completed?: boolean; onToggle?: () => void }) => (
  <div className={`flex items-center gap-3 p-3 bg-white rounded-xl border ${completed ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
    <button onClick={onToggle} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
      {completed && <CheckSquare size={12} />}
    </button>
    <div className="flex-1">
      <p className={`text-sm font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{title}</p>
      <p className="text-[10px] text-gray-400">{type}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

// Customer Card
const CustomerCard = ({ customer, onClick }: { customer: User; onClick?: () => void }) => {
  const segmentColors: Record<string, string> = {
    'Champions': 'bg-green-100 text-green-700',
    'Loyal': 'bg-blue-100 text-blue-700',
    'Potential': 'bg-yellow-100 text-yellow-700',
    'At Risk': 'bg-red-100 text-red-700',
    'Hibernating': 'bg-gray-100 text-gray-700',
  };
  
  return (
    <div onClick={onClick} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 active:bg-gray-50 cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
        <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{customer.name}</p>
        <p className="text-xs text-gray-400">{customer.occupation || 'Nasabah'}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${segmentColors[customer.segment] || 'bg-gray-100'}`}>
        {customer.segment}
      </span>
      <ChevronRight size={16} className="text-gray-300" />
    </div>
  );
};

const RMMobileApp: React.FC<RMMobileAppProps> = ({ customers, campaigns, currentRM = 'Budi Siregar', notifications = [] }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'pipeline' | 'customers' | 'tasks' | 'menu'>('home');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Demo Context for time simulation
  const { demoState } = useDemoContext();
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Mock data for RM
  const todayTasks = [
    { id: '1', time: '09:00', title: 'Follow-up Pak Ahmad Harahap', type: 'Call', completed: false },
    { id: '2', time: '11:00', title: 'Meeting Ibu Siti Aminah', type: 'Meeting', completed: true },
    { id: '3', time: '14:00', title: 'Closing KPR Bu Ratna', type: 'Deal', completed: false },
    { id: '4', time: '16:00', title: 'Verifikasi dokumen KUR', type: 'Document', completed: false },
  ];
  
  const [tasks, setTasks] = useState(todayTasks);
  
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  // Stats
  const newLeads = 12;
  const openTasks = tasks.filter(t => !t.completed).length;
  const openComplaints = 3;
  const targetProgress = 68;
  
  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );
  
  // Render Customer 360 Mini
  if (selectedCustomer) {
    // Get CRM Metrics for selected customer
    const crmMetrics = buildCRMMetricsProfile(selectedCustomer);
    return (
      <div className="w-[375px] h-[812px] bg-gray-50 rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-800 relative flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sumut-blue to-sumut-darkBlue text-white p-4 pt-8">
          <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-white/80 mb-4">
            <ChevronLeft size={20} />
            <span className="text-sm">Kembali</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-2 border-white/30">
              <img src={selectedCustomer.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{selectedCustomer.name}</h2>
              <p className="text-white/70 text-sm">{selectedCustomer.occupation || 'Nasabah'}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedCustomer.segment === 'Champions' ? 'bg-green-500' :
                selectedCustomer.segment === 'At Risk' ? 'bg-red-500' : 'bg-blue-500'
              }`}>{selectedCustomer.segment}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white p-4 border-b border-gray-100">
          <div className="flex justify-around">
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Phone size={18} className="text-green-600" />
              </div>
              <span className="text-[10px]">Telepon</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageCircle size={18} className="text-emerald-600" />
              </div>
              <span className="text-[10px]">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail size={18} className="text-blue-600" />
              </div>
              <span className="text-[10px]">Email</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Plus size={18} className="text-orange-600" />
              </div>
              <span className="text-[10px]">Catatan</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase">Saldo</p>
              <p className="text-lg font-bold text-gray-800">Rp {selectedCustomer.balance.toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase">Points</p>
              <p className="text-lg font-bold text-sumut-orange">{selectedCustomer.points.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase">Level</p>
              <p className="text-lg font-bold text-gray-800">{selectedCustomer.level}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase">Transaksi</p>
              <p className="text-lg font-bold text-gray-800">{selectedCustomer.transactions.length}</p>
            </div>
          </div>
          
          {/* RFM Score */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">RFM Score</p>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedCustomer.rfmScore.recency}</p>
                <p className="text-[10px] text-gray-400">Recency</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{selectedCustomer.rfmScore.frequency}</p>
                <p className="text-[10px] text-gray-400">Frequency</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{selectedCustomer.rfmScore.monetary}</p>
                <p className="text-[10px] text-gray-400">Monetary</p>
              </div>
            </div>
          </div>
          
          {/* CRM Metrics Mini - NEW */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse size={12} className="text-red-500" /> CRM Insights
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Churn Risk */}
              <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                <p className={`text-lg font-bold ${
                  crmMetrics.retentionMetrics.churnRisk === 'Low' ? 'text-green-600' :
                  crmMetrics.retentionMetrics.churnRisk === 'Medium' ? 'text-yellow-600' :
                  crmMetrics.retentionMetrics.churnRisk === 'High' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {crmMetrics.retentionMetrics.churnRisk === 'Low' && '🟢'}
                  {crmMetrics.retentionMetrics.churnRisk === 'Medium' && '🟡'}
                  {crmMetrics.retentionMetrics.churnRisk === 'High' && '🟠'}
                  {crmMetrics.retentionMetrics.churnRisk === 'Critical' && '🔴'}
                </p>
                <p className="text-[9px] text-gray-500 font-medium">Churn Risk</p>
                <p className="text-[10px] text-gray-400">{crmMetrics.retentionMetrics.churnRisk}</p>
              </div>
              
              {/* Engagement Score */}
              <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                <p className="text-lg font-bold text-blue-600">{crmMetrics.growthMetrics.growthPotentialScore}</p>
                <p className="text-[9px] text-gray-500 font-medium">Engagement</p>
                <p className="text-[10px] text-gray-400">Score /100</p>
              </div>
              
              {/* Service SLA */}
              <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                <p className={`text-lg font-bold ${crmMetrics.serviceMetrics.slaHitRate >= 80 ? 'text-green-600' : crmMetrics.serviceMetrics.slaHitRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {crmMetrics.serviceMetrics.slaHitRate}%
                </p>
                <p className="text-[9px] text-gray-500 font-medium">SLA Rate</p>
                <p className="text-[10px] text-gray-400">{crmMetrics.serviceMetrics.pendingTickets} pending</p>
              </div>
            </div>
            
            {/* Quick Action if At Risk */}
            {(crmMetrics.retentionMetrics.churnRisk === 'High' || crmMetrics.retentionMetrics.churnRisk === 'Critical') && (
              <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <p className="text-[10px] text-red-700 font-medium flex items-center gap-1">
                  <AlertCircle size={10} /> Nasabah berisiko churn - Segera follow up!
                </p>
              </div>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Kontak</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600"><span className="text-gray-400">Email:</span> {selectedCustomer.email}</p>
              <p className="text-gray-600"><span className="text-gray-400">Phone:</span> {selectedCustomer.phone}</p>
              <p className="text-gray-600"><span className="text-gray-400">Lokasi:</span> {selectedCustomer.location}</p>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Transaksi Terakhir</p>
            <div className="space-y-2">
              {selectedCustomer.transactions.slice(0, 3).map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800">{txn.merchant}</p>
                    <p className="text-[10px] text-gray-400">{txn.date}</p>
                  </div>
                  <p className="text-sm font-bold text-red-500">-Rp {txn.amount.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[375px] h-[812px] bg-gray-50 rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-800 relative flex flex-col">
      {/* Status Bar Placeholder */}
      <div className="h-8 bg-gray-800 flex items-center justify-center">
        <div className="w-20 h-5 bg-black rounded-full"></div>
      </div>
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-sumut-blue to-sumut-darkBlue text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img src="/bank-sumut-logo.svg" alt="Bank Sumut" className="h-5 w-auto brightness-0 invert" />
            <span className="text-[10px] text-white/60 border-l border-white/20 pl-2">CRM Mobile</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">Selamat datang,</p>
            <h1 className="font-bold text-lg">{currentRM}</h1>
          </div>
          <span className="px-2 py-1 bg-white/10 text-white text-[10px] font-medium rounded-full border border-white/20">
            Relationship Manager
          </span>
        </div>
        
        {activeTab === 'home' && (
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-xs">
              {demoState.isActive 
                ? `${demoState.simulatedDay}, ${demoState.simulatedTime} (Demo)`
                : new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              }
            </p>
            {demoState.isActive && (
              <span className="flex items-center gap-1 text-[10px] text-green-300">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Demo Mode
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pb-24">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <KPIMiniCard icon={<Star size={18} className="text-blue-500" />} value={newLeads} label="Lead Baru" color="bg-blue-50" />
              <KPIMiniCard icon={<CheckSquare size={18} className="text-orange-500" />} value={openTasks} label="Tugas" color="bg-orange-50" />
              <KPIMiniCard icon={<AlertCircle size={18} className="text-red-500" />} value={openComplaints} label="Keluhan" color="bg-red-50" />
            </div>
            
            {/* Target Progress */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-sumut-blue" />
                  <span className="text-sm font-semibold text-gray-700">Target Bulan Ini</span>
                </div>
                <span className="text-sm font-bold text-sumut-blue">{targetProgress}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sumut-blue to-cyan-500 rounded-full transition-all" style={{ width: `${targetProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Rp 2.4M / Rp 3.5M target disbursement</p>
            </div>
            
            {/* Today Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  Tugas Hari Ini
                </h3>
                <span className="text-xs text-gray-400">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    {...task} 
                    onToggle={() => toggleTask(task.id)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Active Campaigns */}
            {campaigns.filter(c => c.status === 'Active').length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">Campaign Aktif</h3>
                <div className="space-y-2">
                  {campaigns.filter(c => c.status === 'Active').slice(0, 2).map(camp => (
                    <div key={camp.id} className="bg-sumut-blue rounded-xl p-3 text-white">
                      <p className="font-bold text-sm">{camp.title}</p>
                      <p className="text-white/70 text-xs mt-1">{camp.reach.toLocaleString()} terkirim • {camp.conversion}% konversi</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nasabah..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/20"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {['Semua', 'Champions', 'At Risk', 'Potential'].map(seg => (
                <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  seg === 'Semua' ? 'bg-sumut-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {seg}
                </button>
              ))}
            </div>
            
            {/* Customer List */}
            <div className="space-y-2">
              {filteredCustomers.slice(0, 10).map(customer => (
                <CustomerCard 
                  key={customer.id} 
                  customer={customer}
                  onClick={() => setSelectedCustomer(customer)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {['Semua', 'New', 'Verifikasi', 'Approval', 'Disbursed'].map(stage => (
                <button key={stage} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  stage === 'Semua' ? 'bg-sumut-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stage}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Ahmad Harahap', product: 'KUR', amount: 50000000, stage: 'Verifikasi' },
                { name: 'Siti Aminah', product: 'KPR', amount: 350000000, stage: 'Approval' },
                { name: 'Budi Nasution', product: 'Kartu Kredit', amount: 25000000, stage: 'New' },
              ].map((deal, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{deal.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      deal.stage === 'New' ? 'bg-blue-100 text-blue-700' :
                      deal.stage === 'Verifikasi' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{deal.stage}</span>
                  </div>
                  <p className="text-xs text-gray-500">{deal.product}</p>
                  <p className="text-sm font-bold text-sumut-blue mt-1">Rp {deal.amount.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-sumut-blue text-white rounded-xl text-sm font-semibold">Tugas Saya</button>
              <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold">Keluhan (3)</button>
            </div>
            
            <div className="space-y-2">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  {...task} 
                  onToggle={() => toggleTask(task.id)} 
                />
              ))}
            </div>
            
            <button className="w-full py-3 bg-sumut-blue text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Plus size={18} />
              Tambah Tugas
            </button>
          </div>
        )}
        
        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-sumut-blue text-white flex items-center justify-center font-bold text-lg">
                {currentRM.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{currentRM}</h3>
                <p className="text-xs text-gray-500">Relationship Manager</p>
                <p className="text-xs text-sumut-blue">Cabang Medan Utama</p>
              </div>
            </div>
            
            {/* Goals */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Pencapaian Bulan Ini</span>
                <span className="text-sm">Level 12</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-xs text-white/80">1,200 XP menuju Level 13</p>
            </div>
            
            {/* Menu Items */}
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {[
                { icon: <Target size={18} />, label: 'Target & Goals' },
                { icon: <Bell size={18} />, label: 'Notifikasi' },
                { icon: <TrendingUp size={18} />, label: 'Statistik Saya' },
                { icon: <Menu size={18} />, label: 'Pengaturan' },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-50">
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight size={16} className="ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* BOTTOM NAVIGATION */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 pb-2">
        <NavBtn icon={<Home size={22} />} label="Beranda" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={<FileText size={22} />} label="Pipeline" active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} badge={3} />
        <NavBtn icon={<Users size={22} />} label="Nasabah" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
        <NavBtn icon={<CheckSquare size={22} />} label="Tugas" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} badge={openTasks} />
        <NavBtn icon={<Menu size={22} />} label="Menu" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
      </div>
    </div>
  );
};

export default RMMobileApp;
