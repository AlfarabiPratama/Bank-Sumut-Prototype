import React from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  ArrowRight,
  Zap,
  Shield,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

// Types for insights
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'growth' | 'retention' | 'efficiency' | 'risk';
  priority: 'high' | 'medium' | 'low';
  revenueImpact: number;
  timeline: string;
  effort: 'low' | 'medium' | 'high';
}

interface TrendData {
  label: string;
  direction: 'up' | 'down' | 'stable';
  change: number;
  insight: string;
}

// Mock data
const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Aktifkan Kampanye Cross-Sell untuk Nasabah KPR',
    description: 'Analisis menunjukkan 234 nasabah KPR memiliki potensi tinggi untuk upsell kartu kredit berdasarkan pendapatan dan pola transaksi.',
    category: 'growth',
    priority: 'high',
    revenueImpact: 580000000,
    timeline: '2-3 minggu',
    effort: 'low'
  },
  {
    id: 'rec-2',
    title: 'Implementasi Retensi Proaktif untuk Segmen Berisiko',
    description: '67 nasabah bernilai tinggi menunjukkan sinyal churn awal. Pendekatan personal direkomendasikan.',
    category: 'retention',
    priority: 'high',
    revenueImpact: 420000000,
    timeline: '1 minggu',
    effort: 'medium'
  },
  {
    id: 'rec-3',
    title: 'Optimasi Alokasi Sumber Daya Cabang',
    description: 'Cabang Tebing Tinggi menunjukkan kunjungan 40% lebih tinggi namun kekurangan staf. Pertimbangkan realokasi.',
    category: 'efficiency',
    priority: 'medium',
    revenueImpact: 150000000,
    timeline: '1 bulan',
    effort: 'high'
  },
  {
    id: 'rec-4',
    title: 'Tangani Risiko Gagal Bayar KUR di Binjai',
    description: 'Tingkat gagal bayar trending 2.3% di atas rata-rata. Intervensi dini direkomendasikan untuk 12 rekening.',
    category: 'risk',
    priority: 'high',
    revenueImpact: -280000000,
    timeline: 'Segera',
    effort: 'medium'
  }
];

const mockTrends: TrendData[] = [
  { label: 'Adopsi Mobile Banking', direction: 'up', change: 23, insight: 'Segmen Gen-Z mendorong 60% pertumbuhan' },
  { label: 'Frekuensi Kunjungan Cabang', direction: 'down', change: -15, insight: 'Preferensi saluran digital meningkat' },
  { label: 'Tingkat Bundling Produk', direction: 'up', change: 8, insight: 'Kampanye cross-sell menunjukkan hasil' },
  { label: 'Tingkat Keluhan Nasabah', direction: 'down', change: -12, insight: 'Peningkatan kualitas layanan berhasil' }
];

const BusinessInsights: React.FC = () => {
  const formatCurrency = (value: number) => {
    const abs = Math.abs(value);
    if (abs >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (abs >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  const categoryConfig = {
    growth: { icon: TrendingUp, color: 'green', label: 'Pertumbuhan' },
    retention: { icon: Users, color: 'blue', label: 'Retensi' },
    efficiency: { icon: Zap, color: 'purple', label: 'Efisiensi' },
    risk: { icon: Shield, color: 'red', label: 'Risiko' }
  };
  
  const priorityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'Prioritas Tinggi' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Sedang' },
    low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Rendah' }
  };
  
  const effortLabel = (effort: string) => {
    switch (effort) {
      case 'low': return 'Rendah';
      case 'medium': return 'Sedang';
      case 'high': return 'Tinggi';
      default: return effort;
    }
  };
  
  // Summary stats
  const totalOpportunityValue = mockRecommendations
    .filter(r => r.revenueImpact > 0)
    .reduce((sum, r) => sum + r.revenueImpact, 0);
  const totalRiskValue = mockRecommendations
    .filter(r => r.revenueImpact < 0)
    .reduce((sum, r) => sum + Math.abs(r.revenueImpact), 0);
  const highPriorityCount = mockRecommendations.filter(r => r.priority === 'high').length;
  
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="text-yellow-500" /> Insight Bisnis
          </h1>
          <p className="text-gray-500 mt-1">Rekomendasi berbasis AI dan analisis tren</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={20} />
              <span className="text-sm text-green-700 font-medium">Peluang Pendapatan</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(totalOpportunityValue)}</p>
            <p className="text-xs text-green-600 mt-1">dari {mockRecommendations.filter(r => r.revenueImpact > 0).length} peluang</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-600" size={20} />
              <span className="text-sm text-red-700 font-medium">Nilai Berisiko</span>
            </div>
            <p className="text-2xl font-bold text-red-800">{formatCurrency(totalRiskValue)}</p>
            <p className="text-xs text-red-600 mt-1">memerlukan perhatian</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-blue-600" size={20} />
              <span className="text-sm text-blue-700 font-medium">Prioritas Tinggi</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{highPriorityCount}</p>
            <p className="text-xs text-blue-600 mt-1">rekomendasi</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-purple-600" size={20} />
              <span className="text-sm text-purple-700 font-medium">Tren Dianalisis</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">{mockTrends.length}</p>
            <p className="text-xs text-purple-600 mt-1">metrik utama dilacak</p>
          </div>
        </div>
        
        {/* Recommendations */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎯 Rekomendasi Strategis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockRecommendations.map(rec => {
              const catConfig = categoryConfig[rec.category];
              const priConfig = priorityConfig[rec.priority];
              const CatIcon = catConfig.icon;
              
              return (
                <div 
                  key={rec.id}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${priConfig.bg} ${priConfig.text}`}>
                        {priConfig.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${catConfig.color}-100 text-${catConfig.color}-700`}>
                        {catConfig.label}
                      </span>
                    </div>
                    <CatIcon size={20} className={`text-${catConfig.color}-500`} />
                  </div>
                  
                  {/* Content */}
                  <h4 className="font-bold text-gray-900 mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Dampak</p>
                      <p className={`text-sm font-bold ${rec.revenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(rec.revenueImpact)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Waktu</p>
                      <p className="text-sm font-bold text-gray-700">{rec.timeline}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Upaya</p>
                      <p className={`text-sm font-bold ${
                        rec.effort === 'low' ? 'text-green-600' :
                        rec.effort === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {effortLabel(rec.effort)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    Implementasi Rekomendasi <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Trend Analysis */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">📈 Tren Pasar</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {mockTrends.map((trend, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      trend.direction === 'up' ? 'bg-green-100' :
                      trend.direction === 'down' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <TrendingUp 
                        size={24} 
                        className={`${
                          trend.direction === 'up' ? 'text-green-600' :
                          trend.direction === 'down' ? 'text-red-600 rotate-180' : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{trend.label}</h4>
                      <p className="text-sm text-gray-500">{trend.insight}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    trend.direction === 'up' ? 'bg-green-100 text-green-700' :
                    trend.direction === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInsights;
