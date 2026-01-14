import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  ArrowUpCircle,
  RefreshCw,
  MessageSquare,
  Crown,
  Filter,
  HelpCircle
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

// Types
interface Escalation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  escalationReason: string;
  customerName: string;
  customerSegment: string;
  isVIP: boolean;
  agentName: string;
  agentRole: string;
  createdAt: Date;
  category: string;
  impact?: {
    revenue?: number;
    affectedCustomers?: number;
  };
}

// Mock data
const generateEscalations = (): Escalation[] => {
  const escalations: Escalation[] = [
    {
      id: 'ESC-001',
      priority: 'CRITICAL',
      title: 'Nasabah VIP Mengancam Menutup Semua Rekening',
      description: 'Dr. Ahmad Siregar, dengan total AUM Rp 2.5M, sangat tidak puas dengan keterlambatan persetujuan KPR. Sudah menunggu 2 minggu melampaui SLA.',
      escalationReason: 'Nasabah mengancam memindahkan semua aset ke bank kompetitor. Memerlukan intervensi eksekutif segera.',
      customerName: 'Dr. Ahmad Siregar',
      customerSegment: 'Champions',
      isVIP: true,
      agentName: 'Rina Wijaya',
      agentRole: 'Agen CS',
      createdAt: new Date(Date.now() - 45 * 60000),
      category: 'Keterlambatan Proses Kredit',
      impact: { revenue: 50000000, affectedCustomers: 1 }
    },
    {
      id: 'ESC-002',
      priority: 'CRITICAL',
      title: 'Error Sistem Menyebabkan Transaksi Gagal',
      description: '15+ nasabah melaporkan transaksi mobile banking gagal dalam 1 jam terakhir. Dana terdebit tapi tidak sampai ke penerima.',
      escalationReason: 'Masalah teknis mempengaruhi banyak nasabah. Potensi risiko kepatuhan dan reputasi.',
      customerName: 'Beberapa Nasabah',
      customerSegment: 'Beragam',
      isVIP: false,
      agentName: 'Ahmad Fauzi',
      agentRole: 'Agen CS',
      createdAt: new Date(Date.now() - 30 * 60000),
      category: 'Masalah Teknis',
      impact: { revenue: 0, affectedCustomers: 15 }
    },
    {
      id: 'ESC-003',
      priority: 'HIGH',
      title: 'Peringatan Penipuan - Aktivitas Rekening Mencurigakan',
      description: 'Nasabah Dewi Harahap melaporkan transaksi tidak sah total Rp 25Jt. Investigasi segera diperlukan.',
      escalationReason: 'Potensi kasus penipuan memerlukan otorisasi supervisor untuk pembekuan rekening dan inisiasi investigasi.',
      customerName: 'Dewi Harahap',
      customerSegment: 'Loyal Customers',
      isVIP: false,
      agentName: 'Maya Indah',
      agentRole: 'Agen CS',
      createdAt: new Date(Date.now() - 60 * 60000),
      category: 'Penipuan/Keamanan',
      impact: { revenue: 25000000 }
    },
    {
      id: 'ESC-004',
      priority: 'HIGH',
      title: 'Persetujuan Pengajuan KUR Diperlukan',
      description: 'Nasabah UMKM dengan profil kuat memerlukan persetujuan KUR. Jumlah melebihi batas wewenang agen.',
      escalationReason: 'Jumlah kredit Rp 150Jt melebihi batas persetujuan agen Rp 50Jt. Memerlukan persetujuan supervisor.',
      customerName: 'Budi Santoso',
      customerSegment: 'Potential Loyalists',
      isVIP: false,
      agentName: 'Hendra Kusuma',
      agentRole: 'RM',
      createdAt: new Date(Date.now() - 90 * 60000),
      category: 'Persetujuan Kredit',
      impact: { revenue: 7500000 }
    },
    {
      id: 'ESC-005',
      priority: 'MEDIUM',
      title: 'Permintaan Pembebasan Biaya - Nasabah Lama',
      description: 'Nasabah meminta pembebasan biaya tahunan kartu. Sudah menjadi nasabah selama 10+ tahun dengan riwayat transaksi baik.',
      escalationReason: 'Permintaan pembebasan biaya memerlukan persetujuan supervisor sesuai kebijakan.',
      customerName: 'Siti Aminah',
      customerSegment: 'Loyal Customers',
      isVIP: false,
      agentName: 'Dewi Lestari',
      agentRole: 'Agen CS',
      createdAt: new Date(Date.now() - 120 * 60000),
      category: 'Sengketa Biaya',
      impact: { revenue: 500000 }
    }
  ];
  
  return escalations;
};

const EscalationQueue: React.FC = () => {
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  
  const allEscalations = useMemo(() => generateEscalations(), []);
  
  const filteredEscalations = useMemo(() => {
    if (filterPriority === 'ALL') return allEscalations;
    return allEscalations.filter(e => e.priority === filterPriority);
  }, [allEscalations, filterPriority]);
  
  const stats = useMemo(() => ({
    total: allEscalations.length,
    critical: allEscalations.filter(e => e.priority === 'CRITICAL').length,
    high: allEscalations.filter(e => e.priority === 'HIGH').length,
    medium: allEscalations.filter(e => e.priority === 'MEDIUM').length
  }), [allEscalations]);
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(0)}Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };
  
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    return `${hours}j ${minutes % 60}m lalu`;
  };
  
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: '🔴', label: 'KRITIS' };
      case 'HIGH': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: '🟠', label: 'TINGGI' };
      case 'MEDIUM': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', icon: '🟡', label: 'SEDANG' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', icon: '⚪', label: priority };
    }
  };
  
  const handleResolve = (escalation: Escalation) => {
    alert(`Diselesaikan: ${escalation.id}\nCatatan: ${resolutionNotes[escalation.id] || 'Tidak ada catatan'}`);
  };
  
  const handleTakeOwnership = (escalation: Escalation) => {
    alert(`Mengambil alih: ${escalation.id}`);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Antrian Eskalasi
              <Tooltip content="Daftar masalah yang dieskalasi oleh tim karena memerlukan wewenang atau keputusan supervisor. Prioritaskan berdasarkan level: Kritis > Tinggi > Sedang." position="right">
                <HelpCircle size={16} className="text-gray-400 hover:text-blue-500 cursor-help" />
              </Tooltip>
            </h1>
            <p className="text-gray-500 mt-1">Masalah yang memerlukan intervensi supervisor</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {stats.total} Menunggu
            </span>
          </div>
        </div>
        
        {/* Critical Alert */}
        {stats.critical > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="font-bold text-red-800">
                🚨 {stats.critical} Eskalasi Kritis Memerlukan Perhatian Segera!
              </p>
              <p className="text-sm text-red-600">Masalah ini memiliki dampak bisnis tinggi dan harus diselesaikan terlebih dahulu.</p>
            </div>
          </div>
        )}
        
        {/* Stats Bar */}
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setFilterPriority('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              filterPriority === 'ALL' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} /> Semua ({stats.total})
          </button>
          <Tooltip content="Masalah dengan dampak bisnis sangat tinggi. Target respons: < 30 menit. Contoh: VIP churn, error sistem, potensi fraud." position="bottom">
            <button 
              onClick={() => setFilterPriority('CRITICAL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                filterPriority === 'CRITICAL' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🔴 Kritis ({stats.critical})
            </button>
          </Tooltip>
          <Tooltip content="Masalah penting yang memerlukan keputusan supervisor. Target respons: < 2 jam. Contoh: approval kredit, investigasi fraud." position="bottom">
            <button 
              onClick={() => setFilterPriority('HIGH')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                filterPriority === 'HIGH' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟠 Tinggi ({stats.high})
            </button>
          </Tooltip>
          <Tooltip content="Masalah yang perlu perhatian tapi tidak mendesak. Target respons: < 4 jam. Contoh: request keringanan, permintaan khusus." position="bottom">
            <button 
              onClick={() => setFilterPriority('MEDIUM')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                filterPriority === 'MEDIUM' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟡 Sedang ({stats.medium})
            </button>
          </Tooltip>
        </div>
        
        {/* Escalation Cards */}
        <div className="space-y-4">
          {filteredEscalations.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Tidak ada eskalasi menunggu</h3>
              <p className="text-gray-500">Tim Anda menangani semua masalah dengan baik!</p>
            </div>
          ) : (
            filteredEscalations.map(escalation => {
              const config = getPriorityConfig(escalation.priority);
              const isExpanded = expandedId === escalation.id;
              const ageMinutes = Math.floor((Date.now() - escalation.createdAt.getTime()) / 60000);
              const isOverdue = ageMinutes > 30;
              
              return (
                <div 
                  key={escalation.id}
                  className={`bg-white rounded-xl border-2 ${config.border} shadow-sm overflow-hidden ${isOverdue ? 'ring-2 ring-red-400' : ''}`}
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                          {config.icon} {config.label}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">{escalation.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>#{escalation.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {formatTimeAgo(escalation.createdAt)}
                            </span>
                            {isOverdue && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                                ⏰ TERLAMBAT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {escalation.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Parties */}
                  <div className="p-4 bg-gray-50 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nasabah</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {escalation.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                            {escalation.customerName}
                            {escalation.isVIP && <Crown size={14} className="text-yellow-500" />}
                          </p>
                          <p className="text-xs text-gray-500">{escalation.customerSegment}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dieskalasi oleh</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                          {escalation.agentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{escalation.agentName}</p>
                          <p className="text-xs text-gray-500">{escalation.agentRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="p-4">
                    <p className="text-sm text-gray-700 mb-3">{escalation.description}</p>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <p className="text-xs font-bold text-orange-700 mb-1">Alasan Eskalasi:</p>
                      <p className="text-sm text-orange-800">{escalation.escalationReason}</p>
                    </div>
                    
                    {/* Impact */}
                    {escalation.impact && (
                      <div className="flex gap-4 mb-3">
                        {escalation.impact.revenue !== undefined && escalation.impact.revenue > 0 && (
                          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600">Pendapatan Berisiko</p>
                            <p className="font-bold text-red-700">{formatCurrency(escalation.impact.revenue)}</p>
                          </div>
                        )}
                        {escalation.impact.affectedCustomers && escalation.impact.affectedCustomers > 1 && (
                          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-600">Nasabah Terdampak</p>
                            <p className="font-bold text-blue-700">{escalation.impact.affectedCustomers}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Expand Toggle */}
                    <button 
                      onClick={() => setExpandedId(isExpanded ? null : escalation.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Sembunyikan Aksi' : 'Tampilkan Aksi & Resolusi'}
                    </button>
                  </div>
                  
                  {/* Actions Panel */}
                  {isExpanded && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      {/* Quick Actions */}
                      <div className="flex gap-2 mb-4">
                        <button 
                          onClick={() => handleTakeOwnership(escalation)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          ✋ Ambil Alih
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                          <RefreshCw size={16} /> Alihkan
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                          <ArrowUpCircle size={16} /> Eskalasi ke Direktur
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                          <MessageSquare size={16} /> Chat dengan Agen
                        </button>
                      </div>
                      
                      {/* Resolution */}
                      <div className="space-y-3">
                        <textarea 
                          placeholder="Masukkan catatan resolusi..."
                          value={resolutionNotes[escalation.id] || ''}
                          onChange={(e) => setResolutionNotes({ ...resolutionNotes, [escalation.id]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleResolve(escalation)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                            disabled={!resolutionNotes[escalation.id]}
                          >
                            <CheckCircle2 size={16} /> Selesaikan & Tutup
                          </button>
                          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                            ↩️ Kembalikan ke Agen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EscalationQueue;
