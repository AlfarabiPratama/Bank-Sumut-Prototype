import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Plus, Zap, TrendingUp, AlertTriangle, Target, Award, BarChart3 } from 'lucide-react';
import type { User } from '../../types';
import type { NextBestAction } from '../../services/nbaEngine';
import { generateNBAs } from '../../services/nbaEngine';
import { auditLogger } from '../../services/auditLogger';

interface NBAPanelProps {
  customer: User;
  className?: string;
  maxActions?: number;
}

/**
 * NBAPanel Component
 * 
 * Displays Next Best Action recommendations for a customer
 * with reasoning factors and action buttons.
 */
export const NBAPanel: React.FC<NBAPanelProps> = ({
  customer,
  className = '',
  maxActions = 3
}) => {
  const nbas = generateNBAs(customer, maxActions);
  
  if (nbas.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 text-center ${className}`}>
        <Target size={32} className="text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Tidak ada rekomendasi aksi saat ini</p>
        <p className="text-xs text-gray-400 mt-1">Customer profile belum memenuhi kriteria NBA rules</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Next Best Actions</h3>
          <p className="text-xs text-gray-500">{nbas.length} rekomendasi berdasarkan profil nasabah</p>
        </div>
      </div>
      
      {/* NBA Cards */}
      {nbas.map((nba, index) => (
        <NBACard 
          key={nba.id} 
          nba={nba} 
          customer={customer}
          rank={index + 1}
        />
      ))}
    </div>
  );
};

/**
 * Individual NBA Card Component
 */
interface NBACardProps {
  nba: NextBestAction;
  customer: User;
  rank: number;
}

const NBACard: React.FC<NBACardProps> = ({ nba, customer, rank }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  
  const priorityColors = {
    HIGH: 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50',
    MEDIUM: 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50',
    LOW: 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50'
  };
  
  const categoryIcons = {
    UPSELL: '📈',
    CROSS_SELL: '🔄',
    RETENTION: '💔',
    ACTIVATION: '🚀',
    SERVICE: '🛠️'
  };
  
  const handleAction = (actionType: string) => {
    auditLogger.log('NBA_EXECUTED', 'NextBestAction', {
      nbaId: nba.id,
      nbaType: nba.type,
      nbaTitle: nba.title,
      customerId: customer.id,
      customerName: customer.name,
      actionType,
      expectedRevenue: nba.expectedRevenue
    });
    
    // Simulate action
    if (actionType === 'CALL') {
      alert(`📞 Menghubungi ${customer.name}\n\nTopic: ${nba.title}\n\nScript suggestion:\n"Selamat pagi ${customer.name.split(' ')[0]}, kami dari Bank Sumut ingin menawarkan ${nba.title}..."`);
    } else if (actionType === 'EMAIL') {
      alert(`📧 Email terkirim ke ${customer.email}\n\nSubject: Penawaran Khusus - ${nba.title}`);
    } else if (actionType === 'WHATSAPP') {
      alert(`💬 WhatsApp terkirim ke ${customer.phone}\n\nTemplate: ${nba.title}`);
    } else if (actionType === 'ADD_CAMPAIGN') {
      alert(`✅ Customer ditambahkan ke campaign:\n\n"${nba.title}"\n\nTotal target audience: 1 (akan digabung dengan campaign serupa)`);
    }
  };
  
  return (
    <div className={`rounded-xl border-2 overflow-hidden ${priorityColors[nba.priority]}`}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Rank Badge */}
          <div className="text-2xl flex-shrink-0">{rankBadge}</div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-gray-800">{nba.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 text-gray-600">
                {categoryIcons[nba.category]} {nba.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">{nba.shortReason}</p>
            
            {/* Metrics Row */}
            <div className="flex flex-wrap gap-3 mt-3">
              {/* Confidence */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Confidence:</span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        nba.confidence >= 80 ? 'bg-green-500' :
                        nba.confidence >= 60 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${nba.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{nba.confidence}%</span>
                </div>
              </div>
              
              {/* Expected Revenue */}
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-xs text-gray-500">Est. Revenue:</span>
                <span className="text-xs font-bold text-green-600">
                  {formatCurrencyShort(nba.expectedRevenue)}/th
                </span>
              </div>
              
              {/* Historical Conversion */}
              {nba.historicalConversionRate && (
                <div className="flex items-center gap-1">
                  <BarChart3 size={14} className="text-blue-600" />
                  <span className="text-xs text-gray-500">Conv. Rate:</span>
                  <span className="text-xs font-bold text-blue-600">{nba.historicalConversionRate}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Priority Badge */}
          <span className={`px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
            nba.priority === 'HIGH' ? 'bg-red-500 text-white' :
            nba.priority === 'MEDIUM' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {nba.priority}
          </span>
        </div>
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 transition"
        >
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showDetails ? 'Sembunyikan analisis detail' : 'Lihat analisis detail →'}
        </button>
      </div>
      
      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-gray-200 bg-white/80 p-4 space-y-4">
          {/* Reasoning Factors */}
          <div>
            <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              🧠 Mengapa Rekomendasi Ini?
            </h5>
            <div className="space-y-2">
              {nba.reasoningFactors.map((factor, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg">{factor.icon}</span>
                  <span className="text-sm text-gray-700 flex-1">{factor.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          factor.impact === 'POSITIVE' ? 'bg-green-500' :
                          factor.impact === 'NEGATIVE' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${factor.weight}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10">{factor.weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Supporting Data */}
          <div>
            <h5 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              📊 Data Pendukung
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-100 rounded p-2">
                <span className="text-gray-500">RFM Segment:</span>
                <span className="font-bold text-gray-800 ml-1">{customer.segment}</span>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <span className="text-gray-500">Balance:</span>
                <span className="font-bold text-green-600 ml-1">{formatCurrencyShort(customer.balance)}</span>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <span className="text-gray-500">Usia:</span>
                <span className="font-bold text-gray-800 ml-1">{customer.age || 'N/A'} tahun</span>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <span className="text-gray-500">Transaksi:</span>
                <span className="font-bold text-gray-800 ml-1">{customer.transactions.length}</span>
              </div>
            </div>
          </div>
          
          {/* Recommended Channels */}
          <div>
            <h5 className="text-sm font-bold text-gray-700 mb-2">📣 Channel Rekomendasi</h5>
            <div className="flex flex-wrap gap-1">
              {nba.channels.map(channel => (
                <span key={channel} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
        <button
          onClick={() => handleAction('CALL')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
        >
          <Phone size={14} />
          Hubungi
        </button>
        <button
          onClick={() => handleAction('EMAIL')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition"
        >
          <Mail size={14} />
          Email
        </button>
        <button
          onClick={() => handleAction('WHATSAPP')}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
        >
          <MessageCircle size={14} />
          WA
        </button>
        <button
          onClick={() => handleAction('ADD_CAMPAIGN')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition"
          title="Add to Campaign"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

/**
 * Compact NBA Summary for Dashboard
 */
export const NBASummary: React.FC<{
  customers: User[];
  className?: string;
}> = ({ customers, className = '' }) => {
  // Collect all NBAs across customers
  const allNBAs: { nba: NextBestAction; customer: User }[] = [];
  
  for (const customer of customers) {
    const nbas = generateNBAs(customer, 3);
    for (const nba of nbas) {
      allNBAs.push({ nba, customer });
    }
  }
  
  // Group by type
  const nbaByType = allNBAs.reduce((acc, { nba }) => {
    acc[nba.type] = (acc[nba.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate total expected revenue
  const totalRevenue = allNBAs.reduce((sum, { nba }) => sum + nba.expectedRevenue, 0);
  
  // Count high priority
  const highPriorityCount = allNBAs.filter(({ nba }) => nba.priority === 'HIGH').length;
  
  return (
    <div className={`p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Zap size={20} className="text-purple-600" />
        <h3 className="font-bold text-gray-800">NBA Engine Summary</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{allNBAs.length}</p>
          <p className="text-xs text-gray-500">Total NBAs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
          <p className="text-xs text-gray-500">High Priority</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{formatCurrencyShort(totalRevenue)}</p>
          <p className="text-xs text-gray-500">Expected Revenue</p>
        </div>
      </div>
      
      {/* Top NBA Types */}
      <div className="mt-3 pt-3 border-t border-purple-200">
        <p className="text-xs text-gray-500 mb-2">Top NBA Types:</p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(nbaByType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([type, count]) => (
              <span key={type} className="px-2 py-0.5 bg-white rounded text-xs text-purple-700">
                {formatNBAType(type)}: {count}
              </span>
            ))
          }
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UTILITIES
// ============================================================================

function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  } else if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(0)}jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}

function formatNBAType(type: string): string {
  const labels: Record<string, string> = {
    'PRIORITY_UPGRADE': 'Priority',
    'DEPOSITO_CROSS_SELL': 'Deposito',
    'CREDIT_CARD_CROSS_SELL': 'CC',
    'WINBACK_CAMPAIGN': 'Winback',
    'ONBOARDING_CAMPAIGN': 'Onboard',
    'AUTO_DEBIT_UTILITY': 'Auto-debit',
    'HOME_LOAN_KPR': 'KPR',
    'INSURANCE_CROSS_SELL': 'Insurance',
    'DIGITAL_ACTIVATION': 'Digital',
    'RETIREMENT_PLANNING': 'Pensiun',
    'STUDENT_UPGRADE': 'Student',
    'IDLE_CASH_OPTIMIZATION': 'Idle Cash'
  };
  return labels[type] || type;
}

export default NBAPanel;
