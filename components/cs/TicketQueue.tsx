import React, { useState, useMemo } from 'react';
import { Clock, Phone, Mail, CheckCircle2, AlertTriangle, MessageCircle, Filter, Search, ChevronDown, ChevronUp, User as UserIcon, Inbox } from 'lucide-react';
import type { ServiceTicket, User } from '../../types';

interface TicketQueueProps {
  tickets: ServiceTicket[];
  customers: User[];
  currentAgentId: string;
  onTicketClick: (ticket: ServiceTicket) => void;
  onResolveTicket: (ticketId: string, resolution: string) => void;
  onViewCustomer: (customer: User) => void;
}

/**
 * Mock ticket data generator
 */
export const generateMockTickets = (customers: User[]): ServiceTicket[] => {
  const categories: ServiceTicket['category'][] = ['ATM_BLOCKED', 'TRANSACTION_ISSUE', 'ACCOUNT_INQUIRY', 'MOBILE_BANKING', 'COMPLAINT'];
  const statuses: ServiceTicket['status'][] = ['NEW', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'RESOLVED'];
  const priorities: ServiceTicket['priority'][] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
  const channels: ServiceTicket['channel'][] = ['PHONE', 'EMAIL', 'WHATSAPP', 'MOBILE_APP'];
  
  const subjects: Record<ServiceTicket['category'], string[]> = {
    'ATM_BLOCKED': ['Kartu ATM terblokir', 'Lupa PIN ATM', 'Kartu ATM tertelan mesin'],
    'TRANSACTION_ISSUE': ['Transfer gagal tapi saldo terpotong', 'Transaksi tidak masuk', 'Double debit'],
    'ACCOUNT_INQUIRY': ['Tanya saldo rekening', 'Minta mutasi rekening', 'Update data nasabah'],
    'MOBILE_BANKING': ['Tidak bisa login mobile banking', 'Lupa password', 'OTP tidak masuk'],
    'COMPLAINT': ['Pelayanan cabang lambat', 'Antrian ATM panjang', 'Keluhan biaya admin'],
    'INFO_REQUEST': ['Tanya bunga deposito', 'Info produk KPR', 'Syarat buka rekening baru'],
    'OTHER': ['Pertanyaan umum', 'Saran untuk Bank Sumut']
  };
  
  return customers.slice(0, 15).map((customer, index) => {
    const category = categories[index % categories.length];
    const priority = priorities[index % priorities.length];
    const status = statuses[index % statuses.length];
    const channel = channels[index % channels.length];
    const subjectList = subjects[category];
    
    const now = new Date();
    const createdAt = new Date(now.getTime() - (index * 30 + 10) * 60 * 1000); // Staggered times
    
    return {
      id: `TKT-${String(index + 1).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone || '08123456789',
      customerAvatar: customer.avatar,
      subject: subjectList[index % subjectList.length],
      description: `Nasabah menghubungi terkait ${subjectList[index % subjectList.length].toLowerCase()}.`,
      category,
      priority,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      assignedTo: 'cs-agent-001',
      assignedToName: 'CS Agent 1',
      slaTarget: priority === 'URGENT' ? 30 : priority === 'HIGH' ? 60 : priority === 'MEDIUM' ? 120 : 240,
      channel,
      notes: []
    };
  });
};

/**
 * Calculate SLA remaining time in minutes
 */
const calculateSLARemaining = (ticket: ServiceTicket): number => {
  const now = new Date();
  const created = new Date(ticket.createdAt);
  const elapsedMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
  return ticket.slaTarget - elapsedMinutes;
};

/**
 * SLA Indicator component
 */
const SLAIndicator: React.FC<{ remaining: number; total: number }> = ({ remaining, total }) => {
  const percentage = Math.max(0, Math.min(100, (remaining / total) * 100));
  const isOverdue = remaining <= 0;
  const isUrgent = remaining > 0 && remaining <= 15;
  
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all ${
          isOverdue ? 'bg-red-500' :
          isUrgent ? 'bg-orange-500' :
          percentage < 50 ? 'bg-yellow-500' :
          'bg-green-500'
        }`}
        style={{ width: `${Math.max(0, percentage)}%` }}
      />
    </div>
  );
};

/**
 * Ticket Card component
 */
const TicketCard: React.FC<{
  ticket: ServiceTicket;
  onViewCustomer: () => void;
  onResolve: () => void;
  onClick: () => void;
}> = ({ ticket, onViewCustomer, onResolve, onClick }) => {
  const slaRemaining = calculateSLARemaining(ticket);
  const isOverdue = slaRemaining <= 0;
  const isUrgent = ticket.priority === 'URGENT' || slaRemaining <= 15;
  
  const priorityConfig: Record<ServiceTicket['priority'], { label: string; color: string; bgColor: string }> = {
    'URGENT': { label: '🚨 MENDESAK', color: 'text-red-700', bgColor: 'bg-red-100' },
    'HIGH': { label: '⚠️ TINGGI', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    'MEDIUM': { label: '📍 SEDANG', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    'LOW': { label: '🔵 RENDAH', color: 'text-blue-700', bgColor: 'bg-blue-100' }
  };
  
  const statusConfig: Record<ServiceTicket['status'], { label: string; color: string }> = {
    'NEW': { label: '🆕 Baru', color: 'text-blue-600' },
    'IN_PROGRESS': { label: '🔄 Ditangani', color: 'text-indigo-600' },
    'PENDING_CUSTOMER': { label: '⏳ Tunggu Customer', color: 'text-yellow-600' },
    'PENDING_INTERNAL': { label: '🔄 Proses Internal', color: 'text-purple-600' },
    'RESOLVED': { label: '✅ Selesai', color: 'text-green-600' },
    'CLOSED': { label: '✓ Ditutup', color: 'text-gray-600' },
    'ESCALATED': { label: '🚨 Dieskalaasi', color: 'text-red-600' }
  };
  
  const categoryLabels: Record<ServiceTicket['category'], string> = {
    'ATM_BLOCKED': '💳 ATM',
    'TRANSACTION_ISSUE': '💸 Transaksi',
    'ACCOUNT_INQUIRY': '🏦 Rekening',
    'MOBILE_BANKING': '📱 M-Banking',
    'COMPLAINT': '😠 Keluhan',
    'INFO_REQUEST': '❓ Informasi',
    'OTHER': '📋 Lainnya'
  };
  
  return (
    <div 
      className={`rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
        isOverdue ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50' :
        isUrgent ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50' :
        'border-gray-200 bg-white hover:border-indigo-300'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          {/* Priority Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityConfig[ticket.priority].bgColor} ${priorityConfig[ticket.priority].color}`}>
            {priorityConfig[ticket.priority].label}
          </span>
          
          {/* Ticket ID */}
          <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
          
          {/* Status */}
          <span className={`ml-auto text-xs font-medium ${statusConfig[ticket.status].color}`}>
            {statusConfig[ticket.status].label}
          </span>
        </div>
        
        {/* Subject */}
        <h4 className="font-bold text-gray-800 mt-2">{ticket.subject}</h4>
        
        {/* Customer */}
        <div className="flex items-center gap-2 mt-2">
          <img src={ticket.customerAvatar} alt={ticket.customerName} className="w-6 h-6 rounded-full" />
          <span className="text-sm text-gray-600">{ticket.customerName}</span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{categoryLabels[ticket.category]}</span>
        </div>
      </div>
      
      {/* SLA Section */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-gray-500'} />
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
            {isOverdue 
              ? `⏰ Terlambat ${Math.abs(slaRemaining)} menit!` 
              : `⏱️ ${slaRemaining} menit tersisa`}
          </span>
        </div>
        <SLAIndicator remaining={slaRemaining} total={ticket.slaTarget} />
      </div>
      
      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); alert(`📞 Menelepon ${ticket.customerPhone}`); }}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
        >
          <Phone size={14} />
          Telepon
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onViewCustomer(); }}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition"
        >
          <UserIcon size={14} />
          Lihat Profil
        </button>
        {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
          <button
            onClick={(e) => { e.stopPropagation(); onResolve(); }}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
          >
            <CheckCircle2 size={14} />
            Selesai
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Main TicketQueue Component
 */
export const TicketQueue: React.FC<TicketQueueProps> = ({
  tickets,
  customers,
  currentAgentId,
  onTicketClick,
  onResolveTicket,
  onViewCustomer
}) => {
  const [filter, setFilter] = useState<'ALL' | 'URGENT' | 'NEW' | 'IN_PROGRESS' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tickets for current agent
  const myTickets = useMemo(() => {
    return tickets.filter(t => t.assignedTo === currentAgentId || currentAgentId === 'all');
  }, [tickets, currentAgentId]);
  
  // Count by status
  const urgentCount = myTickets.filter(t => t.priority === 'URGENT' || calculateSLARemaining(t) <= 0).length;
  const newCount = myTickets.filter(t => t.status === 'NEW').length;
  const inProgressCount = myTickets.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingCount = myTickets.filter(t => t.status === 'PENDING_CUSTOMER').length;
  
  // Apply filters
  const filteredTickets = useMemo(() => {
    let result = myTickets;
    
    // Status filter
    if (filter === 'URGENT') {
      result = result.filter(t => t.priority === 'URGENT' || calculateSLARemaining(t) <= 0);
    } else if (filter === 'NEW') {
      result = result.filter(t => t.status === 'NEW');
    } else if (filter === 'IN_PROGRESS') {
      result = result.filter(t => t.status === 'IN_PROGRESS');
    } else if (filter === 'PENDING') {
      result = result.filter(t => t.status === 'PENDING_CUSTOMER');
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.subject.toLowerCase().includes(query) ||
        t.customerName.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    }
    
    // Sort: Urgent first, then by SLA remaining
    return result.sort((a, b) => {
      const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return calculateSLARemaining(a) - calculateSLARemaining(b);
    });
  }, [myTickets, filter, searchQuery]);
  
  const handleResolveTicket = (ticket: ServiceTicket) => {
    const resolution = prompt('Masukkan resolusi tiket:');
    if (resolution) {
      onResolveTicket(ticket.id, resolution);
      alert(`✅ Tiket ${ticket.id} berhasil diselesaikan!`);
    }
  };
  
  const handleViewCustomer = (ticket: ServiceTicket) => {
    const customer = customers.find(c => c.id === ticket.customerId);
    if (customer) {
      onViewCustomer(customer);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header Stats */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Inbox size={24} />
              Antrian Keluhan Anda
            </h2>
            <p className="text-white/80 text-sm">{myTickets.length} tiket aktif</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className={`p-3 rounded-lg ${urgentCount > 0 ? 'bg-red-500/30 animate-pulse' : 'bg-white/10'}`}>
            <p className="text-2xl font-bold">{urgentCount}</p>
            <p className="text-xs text-white/80">🚨 Mendesak</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-2xl font-bold">{newCount}</p>
            <p className="text-xs text-white/80">🆕 Baru</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-2xl font-bold">{inProgressCount}</p>
            <p className="text-xs text-white/80">🔄 Ditangani</p>
          </div>
          <div className="p-3 rounded-lg bg-white/10">
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-white/80">⏳ Menunggu</p>
          </div>
        </div>
        
        {/* Urgent Alert */}
        {urgentCount > 0 && (
          <div className="mt-3 p-3 bg-red-500/40 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            <span className="font-medium">{urgentCount} tiket mendesak perlu ditangani sekarang!</span>
            <button 
              onClick={() => setFilter('URGENT')}
              className="ml-auto px-3 py-1 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition"
            >
              Tangani Sekarang
            </button>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="flex-shrink-0 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tiket, nasabah, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'ALL', label: 'Semua', count: myTickets.length },
            { key: 'URGENT', label: '🚨 Mendesak', count: urgentCount, color: 'red' },
            { key: 'NEW', label: '🆕 Baru', count: newCount },
            { key: 'IN_PROGRESS', label: '🔄 Ditangani', count: inProgressCount },
            { key: 'PENDING', label: '⏳ Menunggu', count: pendingCount, color: 'yellow' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                filter === f.key 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                filter === f.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Inbox size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada tiket dalam kategori ini</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onViewCustomer={() => handleViewCustomer(ticket)}
              onResolve={() => handleResolveTicket(ticket)}
              onClick={() => onTicketClick(ticket)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TicketQueue;
