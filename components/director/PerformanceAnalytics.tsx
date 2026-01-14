import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Award,
  Medal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock team performance data
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  revenue: number;
  targetAchievement: number;
  dealsClosed: number;
  avgDealSize: number;
  winRate: number;
  trend: number;
  branch: string;
}

const generateTeamData = (): TeamMember[] => {
  const names = [
    'Ahmad Rizki', 'Sarah Putri', 'Budi Santoso', 'Maya Indah', 
    'Dedi Kurniawan', 'Rina Wati', 'Faisal Rahman', 'Dewi Lestari',
    'Hendra Gunawan', 'Siti Aminah', 'Joko Pratama', 'Nur Hidayah'
  ];
  
  return names.map((name, idx) => ({
    id: `rm-${idx + 1}`,
    name,
    role: 'Relationship Manager',
    avatar: name.split(' ').map(n => n[0]).join(''),
    revenue: Math.floor(Math.random() * 500000000) + 100000000,
    targetAchievement: Math.floor(Math.random() * 40) + 60,
    dealsClosed: Math.floor(Math.random() * 20) + 5,
    avgDealSize: Math.floor(Math.random() * 50000000) + 10000000,
    winRate: Math.floor(Math.random() * 30) + 50,
    trend: Math.floor(Math.random() * 30) - 10,
    branch: ['Medan', 'Binjai', 'Pematangsiantar', 'Tebing Tinggi'][Math.floor(Math.random() * 4)]
  })).sort((a, b) => b.revenue - a.revenue);
};

interface PerformanceAnalyticsProps {
  // Props can be extended later
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = () => {
  const [sortBy, setSortBy] = useState<'revenue' | 'targetAchievement' | 'dealsClosed' | 'winRate'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  
  const teamData = useMemo(() => generateTeamData(), []);
  
  const sortedData = useMemo(() => {
    let filtered = filterBranch === 'all' 
      ? teamData 
      : teamData.filter(m => m.branch === filterBranch);
    
    return [...filtered].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [teamData, sortBy, sortOrder, filterBranch]);
  
  const branches = [...new Set(teamData.map(m => m.branch))];
  
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  // Top 3 performers
  const topPerformers = sortedData.slice(0, 3);
  
  // Summary stats
  const totalRevenue = teamData.reduce((sum, m) => sum + m.revenue, 0);
  const avgAchievement = teamData.reduce((sum, m) => sum + m.targetAchievement, 0) / teamData.length;
  const totalDeals = teamData.reduce((sum, m) => sum + m.dealsClosed, 0);
  const avgWinRate = teamData.reduce((sum, m) => sum + m.winRate, 0) / teamData.length;
  
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analisis Performa</h1>
          <p className="text-gray-500 mt-1">Perbandingan performa tim dan papan peringkat</p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Pendapatan</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Rata-rata Pencapaian</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgAchievement.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award size={20} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Total Deal</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Trophy size={20} className="text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Rata-rata Win Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgWinRate.toFixed(1)}%</p>
          </div>
        </div>
        
        {/* Top Performers Podium */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Performa Terbaik
          </h3>
          
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            {topPerformers[1] && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 mb-2">
                  {topPerformers[1].avatar}
                </div>
                <Medal className="text-gray-400 mb-1" size={24} />
                <p className="font-semibold text-gray-900 text-sm">{topPerformers[1].name}</p>
                <p className="text-xs text-gray-500">{formatCurrency(topPerformers[1].revenue)}</p>
                <div className="w-24 h-20 bg-gray-300 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">2</span>
                </div>
              </div>
            )}
            
            {/* 1st Place */}
            {topPerformers[0] && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold text-yellow-900 mb-2 border-4 border-yellow-500">
                  {topPerformers[0].avatar}
                </div>
                <Medal className="text-yellow-500 mb-1" size={28} />
                <p className="font-bold text-gray-900">{topPerformers[0].name}</p>
                <p className="text-sm text-gray-600">{formatCurrency(topPerformers[0].revenue)}</p>
                <div className="w-28 h-28 bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-900">1</span>
                </div>
              </div>
            )}
            
            {/* 3rd Place */}
            {topPerformers[2] && (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-orange-300 flex items-center justify-center text-lg font-bold text-orange-800 mb-2">
                  {topPerformers[2].avatar}
                </div>
                <Medal className="text-orange-400 mb-1" size={22} />
                <p className="font-semibold text-gray-900 text-sm">{topPerformers[2].name}</p>
                <p className="text-xs text-gray-500">{formatCurrency(topPerformers[2].revenue)}</p>
                <div className="w-20 h-16 bg-orange-300 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-800">3</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} /> Papan Peringkat Performa Tim
            </h3>
            
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">Semua Cabang</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Peringkat</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Anggota Tim</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cabang</th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center gap-1">
                      Pendapatan
                      {sortBy === 'revenue' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('targetAchievement')}
                  >
                    <div className="flex items-center gap-1">
                      Target %
                      {sortBy === 'targetAchievement' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('dealsClosed')}
                  >
                    <div className="flex items-center gap-1">
                      Deal
                      {sortBy === 'dealsClosed' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rata-rata Deal</th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('winRate')}
                  >
                    <div className="flex items-center gap-1">
                      Win Rate
                      {sortBy === 'winRate' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tren</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedData.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <span className="text-gray-500 font-medium ml-2">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{member.branch}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{formatCurrency(member.revenue)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={`h-full rounded-full ${
                              member.targetAchievement >= 90 ? 'bg-green-500' :
                              member.targetAchievement >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, member.targetAchievement)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          member.targetAchievement >= 90 ? 'text-green-600' :
                          member.targetAchievement >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {member.targetAchievement}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{member.dealsClosed}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{formatCurrency(member.avgDealSize)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        member.winRate >= 70 ? 'bg-green-100 text-green-700' :
                        member.winRate >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {member.winRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 ${member.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {member.trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="text-sm font-medium">{Math.abs(member.trend)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
