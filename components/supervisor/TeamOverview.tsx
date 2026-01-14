import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  MessageSquare,
  Eye,
  BarChart3,
  RefreshCw,
  Coffee,
  Wifi,
  WifiOff,
  HelpCircle
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'break' | 'offline';
  statusDuration: number; // minutes
  currentTask?: {
    type: string;
    description: string;
    customer?: string;
  };
  todayMetrics: {
    completed: number;
    avgTime: number;
    csat: number;
  };
  alerts: string[];
}

interface TeamMetrics {
  teamSize: number;
  online: number;
  onBreak: number;
  offline: number;
  activeTasks: number;
  avgResponseTime: number;
  slaCompliance: number;
  csat: number;
  teamRevenue: number;
  monthlyTarget: number;
  overdueTasks: number;
  slaRiskTasks: number;
  vipIssues: number;
}

// Mock data generator
const generateTeamMembers = (): TeamMember[] => {
  const members = [
    { name: 'Rina Wijaya', role: 'Agen CS' },
    { name: 'Ahmad Fauzi', role: 'RM' },
    { name: 'Dewi Lestari', role: 'Agen CS' },
    { name: 'Budi Santoso', role: 'RM' },
    { name: 'Maya Indah', role: 'Agen CS' },
    { name: 'Hendra Kusuma', role: 'RM' }
  ];
  
  const statuses: ('online' | 'busy' | 'break' | 'offline')[] = ['online', 'busy', 'break', 'offline'];
  const tasks = [
    { type: 'Telepon', description: 'Pertanyaan nasabah tentang KPR', customer: 'Ani Siregar' },
    { type: 'Tiket', description: 'Menyelesaikan masalah kartu', customer: 'Budi Harahap' },
    { type: 'Follow-up', description: 'Follow-up pengajuan KUR', customer: 'Dedi Nasution' },
    null
  ];
  
  return members.map((m, idx) => ({
    id: `tm-${idx + 1}`,
    name: m.name,
    role: m.role,
    avatar: m.name.split(' ').map(n => n[0]).join(''),
    status: statuses[Math.floor(Math.random() * 3)] as any, // Mostly online/busy
    statusDuration: Math.floor(Math.random() * 120) + 5,
    currentTask: Math.random() > 0.3 ? tasks[Math.floor(Math.random() * 3)] as any : undefined,
    todayMetrics: {
      completed: Math.floor(Math.random() * 15) + 3,
      avgTime: Math.floor(Math.random() * 20) + 5,
      csat: Math.floor(Math.random() * 20) + 75
    },
    alerts: Math.random() > 0.7 ? ['SLA berisiko'] : []
  }));
};

const generateTeamMetrics = (members: TeamMember[]): TeamMetrics => {
  const online = members.filter(m => m.status === 'online' || m.status === 'busy').length;
  const onBreak = members.filter(m => m.status === 'break').length;
  const offline = members.filter(m => m.status === 'offline').length;
  
  return {
    teamSize: members.length,
    online,
    onBreak,
    offline,
    activeTasks: members.filter(m => m.currentTask).length + Math.floor(Math.random() * 10),
    avgResponseTime: Math.floor(Math.random() * 10) + 8,
    slaCompliance: Math.floor(Math.random() * 10) + 88,
    csat: Math.floor(Math.random() * 10) + 82,
    teamRevenue: Math.floor(Math.random() * 500000000) + 200000000,
    monthlyTarget: 800000000,
    overdueTasks: Math.floor(Math.random() * 5),
    slaRiskTasks: Math.floor(Math.random() * 8),
    vipIssues: Math.floor(Math.random() * 3)
  };
};

const recentActivities = [
  { id: 1, member: 'Rina Wijaya', action: 'menyelesaikan tiket', detail: 'Penggantian kartu #TK-234', time: '2 menit lalu', type: 'success' },
  { id: 2, member: 'Ahmad Fauzi', action: 'menutup deal', detail: 'KPR Rp 450M', time: '5 menit lalu', type: 'success' },
  { id: 3, member: 'Dewi Lestari', action: 'eskalasi masalah', detail: 'Keluhan VIP', time: '8 menit lalu', type: 'warning' },
  { id: 4, member: 'Budi Santoso', action: 'memulai telepon', detail: 'Follow-up KUR', time: '12 menit lalu', type: 'info' },
  { id: 5, member: 'Maya Indah', action: 'peringatan SLA', detail: 'Tiket #TK-189 berisiko', time: '15 menit lalu', type: 'warning' }
];

const TeamOverview: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const teamMembers = useMemo(() => generateTeamMembers(), []);
  const metrics = useMemo(() => generateTeamMetrics(teamMembers), [teamMembers]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="text-green-500" size={14} />;
      case 'busy': return <Activity className="text-orange-500" size={14} />;
      case 'break': return <Coffee className="text-yellow-500" size={14} />;
      case 'offline': return <WifiOff className="text-gray-400" size={14} />;
      default: return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Aktif';
      case 'busy': return 'Sibuk';
      case 'break': return 'Istirahat';
      case 'offline': return 'Offline';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'break': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-500" /> Gambaran Tim
            </h1>
            <p className="text-gray-500 mt-1">Status dan performa tim secara real-time</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Segarkan
          </button>
        </div>
        
        {/* Critical Alerts */}
        {(metrics.overdueTasks > 0 || metrics.vipIssues > 0) && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              <div>
                <p className="font-bold text-red-800">
                  🚨 {metrics.overdueTasks + metrics.vipIssues} Masalah Kritis Perlu Perhatian
                </p>
                <p className="text-sm text-red-600">
                  {metrics.overdueTasks} tugas terlambat, {metrics.vipIssues} masalah VIP
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
              Lihat Eskalasi
            </button>
          </div>
        )}
        
        {/* Team Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-blue-500" />
              <span className="text-xs text-gray-500">Status Tim</span>
              <Tooltip content="Jumlah anggota tim dan status ketersediaan mereka: Aktif (hijau), Istirahat (kuning), Offline (abu)." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.teamSize}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-green-600">🟢 {metrics.online}</span>
              <span className="text-yellow-600">🟡 {metrics.onBreak}</span>
              <span className="text-gray-400">⚫ {metrics.offline}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-purple-500" />
              <span className="text-xs text-gray-500">Tugas Aktif</span>
              <Tooltip content="Total tiket dan tugas yang sedang dikerjakan oleh tim saat ini. Termasuk telepon, chat, dan follow-up." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.activeTasks}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-orange-500" />
              <span className="text-xs text-gray-500">Rata-rata Respons</span>
              <Tooltip content="Waktu rata-rata dari tiket masuk hingga respons pertama. Target SLA < 15 menit untuk kepuasan nasabah optimal." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgResponseTime}m</p>
            <p className={`text-xs mt-1 ${metrics.avgResponseTime <= 15 ? 'text-green-600' : 'text-red-600'}`}>
              Target: &lt; 15 menit
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-green-500" />
              <span className="text-xs text-gray-500">Kepatuhan SLA</span>
              <Tooltip content="Persentase tiket yang diselesaikan dalam batas waktu SLA. Target minimum 90% untuk menjaga kepuasan nasabah." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className={`text-2xl font-bold ${metrics.slaCompliance >= 90 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.slaCompliance}%
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} className="text-blue-500" />
              <span className="text-xs text-gray-500">Skor CSAT</span>
              <Tooltip content="Customer Satisfaction Score - hasil survei kepuasan nasabah setelah interaksi dengan tim. Target: 85%+." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.csat}%</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-green-500" />
              <span className="text-xs text-gray-500">Pendapatan Tim</span>
              <Tooltip content="Total pendapatan yang dihasilkan tim bulan ini. Termasuk closing deal, fee-based income, dan kontribusi lainnya." position="top">
                <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.teamRevenue)}</p>
            <div className="mt-2">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.min(100, (metrics.teamRevenue / metrics.monthlyTarget) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((metrics.teamRevenue / metrics.monthlyTarget) * 100).toFixed(0)}% dari target
              </p>
            </div>
          </div>
        </div>
        
        {/* Priority Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-red-700">🚨 Tugas Terlambat</span>
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">{metrics.overdueTasks}</span>
            </div>
            <p className="text-xs text-red-600">Perlu segera didistribusikan ulang</p>
          </div>
          
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-orange-700">⏰ SLA Berisiko</span>
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">{metrics.slaRiskTasks}</span>
            </div>
            <p className="text-xs text-orange-600">Perlu diprioritaskan</p>
          </div>
          
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-purple-700">👑 Masalah VIP</span>
              <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">{metrics.vipIssues}</span>
            </div>
            <p className="text-xs text-purple-600">Perhatian nasabah bernilai tinggi</p>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-700">🆘 Butuh Bantuan</span>
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {teamMembers.filter(m => m.alerts.length > 0).length}
              </span>
            </div>
            <p className="text-xs text-blue-600">Anggota tim perlu dukungan</p>
          </div>
        </div>
        
        {/* Team Members Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} /> Status Aktivitas Tim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'busy' ? 'bg-orange-500' :
                        member.status === 'break' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(member.status)}`}>
                    {getStatusIcon(member.status)}
                    {getStatusLabel(member.status)}
                  </span>
                </div>
                
                {/* Current Task */}
                {member.currentTask ? (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">Tugas Saat Ini:</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {member.currentTask.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{member.currentTask.description}</p>
                    {member.currentTask.customer && (
                      <p className="text-xs text-gray-500 mt-1">👤 {member.currentTask.customer}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 text-center text-gray-400 text-sm">
                    Tidak ada tugas aktif
                  </div>
                )}
                
                {/* Today's Metrics */}
                <div className="flex justify-between text-center mb-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{member.todayMetrics.completed}</p>
                    <p className="text-xs text-gray-500">Selesai</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{member.todayMetrics.avgTime}m</p>
                    <p className="text-xs text-gray-500">Rata-rata</p>
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${member.todayMetrics.csat >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {member.todayMetrics.csat}%
                    </p>
                    <p className="text-xs text-gray-500">CSAT</p>
                  </div>
                </div>
                
                {/* Alerts */}
                {member.alerts.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-2 mb-3">
                    {member.alerts.map((alert, idx) => (
                      <p key={idx} className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} /> {alert}
                      </p>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center justify-center gap-1 transition">
                    <MessageSquare size={14} /> Chat
                  </button>
                  <button className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center justify-center gap-1 transition">
                    <Eye size={14} /> Lihat
                  </button>
                  <button className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 flex items-center justify-center gap-1 transition">
                    <BarChart3 size={14} /> Statistik
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">📰 Aktivitas Tim Terbaru</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <span className="text-xs text-gray-500 w-20">{activity.time}</span>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{activity.member}</span>
                  <span className="text-gray-500"> {activity.action}: </span>
                  <span className="text-gray-700">{activity.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;
