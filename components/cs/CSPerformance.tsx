import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Star, Target, Award, MessageCircle, ThumbsUp } from 'lucide-react';

interface CSPerformanceProps {
  agentId: string;
  agentName: string;
  className?: string;
}

interface PerformanceMetrics {
  resolvedTickets: number;
  avgResponseTime: number; // minutes
  avgResolutionTime: number; // minutes
  csat: number; // percentage
  slaCompliance: number; // percentage
  firstCallResolution: number; // percentage
  ticketsHandledToday: number;
  ticketsHandledThisWeek: number;
}

interface CustomerFeedback {
  id: string;
  ticketId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * Generate mock performance data
 */
const generateMockPerformance = (): PerformanceMetrics => ({
  resolvedTickets: 127,
  avgResponseTime: 8, // 8 minutes
  avgResolutionTime: 45, // 45 minutes
  csat: 92,
  slaCompliance: 88,
  firstCallResolution: 75,
  ticketsHandledToday: 12,
  ticketsHandledThisWeek: 54
});

const generateMockFeedback = (): CustomerFeedback[] => [
  {
    id: 'fb-001',
    ticketId: 'TKT-0042',
    customerName: 'Siti Rahmawati',
    rating: 5,
    comment: 'Respon cepat dan solusi langsung berhasil. Terima kasih!',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'fb-002',
    ticketId: 'TKT-0038',
    customerName: 'Ahmad Fauzi',
    rating: 4,
    comment: 'Masalah terselesaikan dengan baik.',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb-003',
    ticketId: 'TKT-0035',
    customerName: 'Dewi Lestari',
    rating: 5,
    comment: 'CS sangat membantu, sabar menjelaskan langkah-langkah reset password.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fb-004',
    ticketId: 'TKT-0031',
    customerName: 'Budi Hartono',
    rating: 3,
    comment: 'Solusi akhirnya berhasil tapi butuh waktu lama.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const teamAverages: PerformanceMetrics = {
  resolvedTickets: 98,
  avgResponseTime: 12,
  avgResolutionTime: 55,
  csat: 85,
  slaCompliance: 80,
  firstCallResolution: 65,
  ticketsHandledToday: 8,
  ticketsHandledThisWeek: 42
};

/**
 * Metric Card Component
 */
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: { value: number; positive: boolean };
  highlight?: 'green' | 'yellow' | 'red' | 'none';
}> = ({ icon, label, value, subtext, trend, highlight = 'none' }) => {
  const highlightColors = {
    green: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    yellow: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200',
    red: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
    none: 'bg-white border-gray-200'
  };
  
  return (
    <div className={`p-4 rounded-xl border ${highlightColors[highlight]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
};

/**
 * Comparison Bar Component
 */
const ComparisonBar: React.FC<{
  label: string;
  myValue: number;
  teamAvg: number;
  format?: 'number' | 'percentage' | 'time';
  lowerIsBetter?: boolean;
}> = ({ label, myValue, teamAvg, format = 'number', lowerIsBetter = false }) => {
  const maxValue = Math.max(myValue, teamAvg) * 1.2;
  const myPercent = (myValue / maxValue) * 100;
  const teamPercent = (teamAvg / maxValue) * 100;
  
  const isBetter = lowerIsBetter ? myValue < teamAvg : myValue > teamAvg;
  
  const formatValue = (val: number) => {
    if (format === 'percentage') return `${val}%`;
    if (format === 'time') return `${val} menit`;
    return val.toString();
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${isBetter ? 'text-green-600' : 'text-orange-600'}`}>
          {formatValue(myValue)} vs Tim: {formatValue(teamAvg)}
        </span>
      </div>
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
        {/* Team average marker */}
        <div 
          className="absolute top-0 h-full w-1 bg-gray-400 z-10"
          style={{ left: `${teamPercent}%` }}
        />
        {/* My value bar */}
        <div 
          className={`h-full rounded-full transition-all ${isBetter ? 'bg-green-500' : 'bg-orange-500'}`}
          style={{ width: `${myPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">Anda</span>
        <span className="text-xs text-gray-400">Rata-rata Tim</span>
      </div>
    </div>
  );
};

/**
 * Star Rating Component
 */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star}
          size={16}
          className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

/**
 * CS Performance Dashboard Component
 */
export const CSPerformance: React.FC<CSPerformanceProps> = ({
  agentId,
  agentName,
  className = ''
}) => {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');
  
  const metrics = useMemo(() => generateMockPerformance(), []);
  const feedback = useMemo(() => generateMockFeedback(), []);
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  };
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 size={28} />
            <div>
              <h2 className="text-xl font-bold">Kinerja Saya</h2>
              <p className="text-white/80 text-sm">{agentName}</p>
            </div>
          </div>
          
          {/* Date Range Selector */}
          <div className="flex gap-1 bg-white/10 rounded-lg p-1">
            {[
              { key: 'today', label: 'Hari Ini' },
              { key: 'week', label: 'Minggu Ini' },
              { key: 'month', label: 'Bulan Ini' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setDateRange(option.key as any)}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  dateRange === option.key ? 'bg-white text-indigo-600 font-medium' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-3xl font-bold">{metrics.ticketsHandledThisWeek}</p>
            <p className="text-xs text-white/80">Tiket Diselesaikan</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-3xl font-bold">{metrics.avgResponseTime}m</p>
            <p className="text-xs text-white/80">Avg. Response Time</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-3xl font-bold">{metrics.csat}%</p>
            <p className="text-xs text-white/80">Kepuasan Nasabah</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-3xl font-bold">{metrics.slaCompliance}%</p>
            <p className="text-xs text-white/80">SLA Terpenuhi</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Key Metrics Grid */}
        <section>
          <h3 className="font-bold text-gray-800 mb-3">📊 Metrik Kinerja</h3>
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              icon={<Clock size={18} className="text-blue-500" />}
              label="Response Time"
              value={`${metrics.avgResponseTime} menit`}
              subtext="Target: <15 menit"
              trend={{ value: 12, positive: true }}
              highlight={metrics.avgResponseTime <= 15 ? 'green' : 'yellow'}
            />
            <MetricCard
              icon={<Target size={18} className="text-green-500" />}
              label="First Call Resolution"
              value={`${metrics.firstCallResolution}%`}
              subtext="Selesai di interaksi pertama"
              trend={{ value: 5, positive: true }}
              highlight={metrics.firstCallResolution >= 70 ? 'green' : 'yellow'}
            />
            <MetricCard
              icon={<Star size={18} className="text-yellow-500" />}
              label="CSAT Score"
              value={`${metrics.csat}%`}
              subtext="Dari rating nasabah"
              trend={{ value: 3, positive: true }}
              highlight={metrics.csat >= 90 ? 'green' : metrics.csat >= 80 ? 'yellow' : 'red'}
            />
          </div>
        </section>
        
        {/* Comparison with Team */}
        <section className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-4">📈 Perbandingan dengan Rata-rata Tim</h3>
          
          <ComparisonBar
            label="Tiket Diselesaikan"
            myValue={metrics.resolvedTickets}
            teamAvg={teamAverages.resolvedTickets}
          />
          
          <ComparisonBar
            label="Response Time"
            myValue={metrics.avgResponseTime}
            teamAvg={teamAverages.avgResponseTime}
            format="time"
            lowerIsBetter
          />
          
          <ComparisonBar
            label="CSAT Score"
            myValue={metrics.csat}
            teamAvg={teamAverages.csat}
            format="percentage"
          />
          
          <ComparisonBar
            label="SLA Compliance"
            myValue={metrics.slaCompliance}
            teamAvg={teamAverages.slaCompliance}
            format="percentage"
          />
        </section>
        
        {/* Recent Feedback */}
        <section>
          <h3 className="font-bold text-gray-800 mb-3">💬 Feedback Nasabah Terbaru</h3>
          <div className="space-y-3">
            {feedback.map(fb => (
              <div key={fb.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={fb.rating} />
                    <span className="text-xs text-gray-400">{fb.ticketId}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatRelativeTime(fb.date)}</span>
                </div>
                <p className="text-sm text-gray-700 italic">"{fb.comment}"</p>
                <p className="text-xs text-gray-500 mt-2">— {fb.customerName}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Achievement Badge */}
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Award size={24} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-800">🏆 Pencapaian Minggu Ini</h4>
              <p className="text-sm text-amber-700">Response Time tercepat di tim! (8 menit rata-rata)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CSPerformance;
