import React, { useState, useMemo, useEffect } from 'react';
import { User, CustomerNote } from '../../types';
import { analyzeTransferBehavior } from '../../services/transferAnalytics';
import { buildCustomer360Profile } from '../../services/customer360Analytics';
import { buildCRMMetricsProfile, generateCustomerJourney, generateMockNotes } from '../../services/crmMetricsAnalytics';
import { enrichCustomerWithCompliance } from '../../services/kycService';
import { X, User as UserIcon, Calendar, TrendingUp, Target, Award, Zap, Mail, CheckCircle2, XCircle, Eye, MousePointer, Clock, Coffee, ShoppingBag, Plane, Car, AlertCircle, Send, AlertTriangle, Gift, Shield, HeartPulse, BarChart3, Users, FileCheck, MessageCircle, Phone, Plus, ChevronDown, ChevronUp, LineChart, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { auditLogger } from '../../services/auditLogger';
import { ProtectedAction } from '../ui/ProtectedAction';
import { ConsentBadge } from '../ui/ConsentBadge';
import { KYCBadge } from '../ui/KYCBadge';
import { NBAPanel } from '../ui/NBAPanel';

interface Customer360ViewProps {
  user: User;
  onClose: () => void;
}

const Customer360View: React.FC<Customer360ViewProps> = ({ user: rawUser, onClose }) => {
  // Enrich user with KYC and consent data for demo
  const user = useMemo(() => enrichCustomerWithCompliance(rawUser), [rawUser]);
  
  const profile = buildCustomer360Profile(user);
  const { behaviorAnalytics, engagementMetrics, utilityAnalytics, pdamRegion, utilityPersona } = profile;
  const transferAnalytics = analyzeTransferBehavior(user.transactions);
  
  // CRM Metrics Profile
  const crmMetrics = buildCRMMetricsProfile(user);
  
  // Customer Journey Timeline
  const journeyEvents = generateCustomerJourney(user);
  
  // Customer Notes / Interaction Log
  const [notes, setNotes] = useState<CustomerNote[]>(generateMockNotes(user));
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<CustomerNote['type']>('note');

  // Audit log: Log view event when component mounts
  useEffect(() => {
    auditLogger.logView('Customer', user.id, {
      customerName: user.name,
      segment: user.segment,
      hasMarketingConsent: user.marketingConsent?.optIn ?? true
    });
  }, [user.id, user.name, user.segment, user.marketingConsent?.optIn]);

  // Transaction Trend Data (last 6 months)
  const transactionTrend = useMemo(() => {
    const monthlyData: { month: string; amount: number; count: number }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toLocaleDateString('id-ID', { month: 'short' });
      
      // Filter transactions for this month
      const monthTxns = user.transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate.getMonth() === d.getMonth() && txDate.getFullYear() === d.getFullYear();
      });
      
      // If no real data, generate mock
      const amount = monthTxns.length > 0 
        ? monthTxns.reduce((sum, t) => sum + t.amount, 0)
        : Math.floor(500000 + Math.random() * 2000000);
      const count = monthTxns.length > 0 ? monthTxns.length : Math.floor(5 + Math.random() * 15);
      
      monthlyData.push({ month: monthKey, amount, count });
    }
    return monthlyData;
  }, [user.transactions]);

  // Spend by Category Data
  const spendByCategory = useMemo(() => {
    const catMap = new Map<string, number>();
    user.transactions.forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    });
    
    // If empty, generate mock
    if (catMap.size === 0) {
      catMap.set('F&B', 1500000);
      catMap.set('Shopping', 2500000);
      catMap.set('Transport', 800000);
      catMap.set('Entertainment', 1200000);
    }
    
    return Array.from(catMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [user.transactions]);

  // Pie chart colors
  const COLORS = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B'];

  // Category icon mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    'F&B': <Coffee size={16} className="text-amber-600" />,
    'Shopping': <ShoppingBag size={16} className="text-pink-600" />,
    'Transport': <Car size={16} className="text-blue-600" />,
    'Entertainment': <Plane size={16} className="text-purple-600" />,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get segment color
  const getSegmentColor = (segment: string) => {
    if (segment.includes('Champions')) return 'bg-emerald-600';
    if (segment.includes('Loyal')) return 'bg-green-500';
    if (segment.includes('Potential')) return 'bg-yellow-500';
    if (segment.includes('At Risk')) return 'bg-orange-500';
    if (segment.includes('Hibernating')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  // Get account status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Premium': return 'bg-purple-600 text-white';
      case 'Active': return 'bg-green-600 text-white';
      case 'New': return 'bg-blue-600 text-white';
      case 'Dormant': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get interaction icon
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'convert': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'click': return <MousePointer size={16} className="text-blue-600" />;
      case 'view': return <Eye size={16} className="text-gray-600" />;
      case 'ignore': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel - Centered */}
      <div className="fixed inset-4 md:inset-8 lg:left-[280px] lg:right-4 lg:top-4 lg:bottom-4 bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-14 h-14 rounded-full border-2 border-white shadow-lg"
              />
              <div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <p className="text-white/80 text-xs">ID: {user.id}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSegmentColor(user.segment)}`}>
                    {user.segment}
                  </span>
                  {user.accountStatus && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.accountStatus)}`}>
                      {user.accountStatus}
                    </span>
                  )}
                  {/* KYC Badge in Header */}
                  <KYCBadge user={user} size="sm" />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* PHASE 1: Customer Snapshot - Quick TL;DR */}
          <section className="grid grid-cols-5 gap-2">
            {/* Total Transactions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <p className="text-[10px] text-blue-600 font-semibold mb-0.5">Total Transaksi</p>
              <p className="text-xl font-bold text-blue-900">{user.transactions.length}</p>
              <p className="text-[10px] text-blue-500">All time</p>
            </div>

            {/* Total Value */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-3 border border-green-200">
              <p className="text-[10px] text-green-600 font-semibold mb-0.5">Total Nilai</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(user.transactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
              <p className="text-[10px] text-green-500">Lifetime</p>
            </div>

            {/* RFM Score */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <p className="text-[10px] text-purple-600 font-semibold mb-0.5">RFM Score</p>
              <p className="text-xl font-bold text-purple-900">
                {user.rfmScore.recency}-{user.rfmScore.frequency}-{user.rfmScore.monetary}
              </p>
              <p className="text-[10px] text-purple-500">R-F-M</p>
            </div>

            {/* Lifetime Value (CLV) */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg p-3 border border-orange-200">
              <p className="text-[10px] text-orange-600 font-semibold mb-0.5">Lifetime Value</p>
              <p className="text-lg font-bold text-orange-900">
                {formatCurrency(
                  (user.transactions.reduce((sum, t) => sum + t.amount, 0) / user.transactions.length) * 
                  user.rfmScore.frequency * 12
                )}
              </p>
              <p className="text-[10px] text-orange-500">Est. annual</p>
            </div>

            {/* Churn Risk */}
            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-lg p-3 border border-red-200">
              <p className="text-[10px] text-red-600 font-semibold mb-0.5">Churn Risk</p>
              <p className="text-xl font-bold text-red-900">
                {Math.max(5, Math.min(95, 100 - (user.rfmScore.recency * 10 + user.rfmScore.frequency * 5)))}%
              </p>
              <p className="text-[10px] text-red-500">
                {(100 - (user.rfmScore.recency * 10 + user.rfmScore.frequency * 5)) < 30 ? '🟢 Low' : 
                 (100 - (user.rfmScore.recency * 10 + user.rfmScore.frequency * 5)) < 60 ? '🟡 Medium' : '🔴 High'}
              </p>
            </div>
          </section>
          
          {/* NBA - Next Best Actions */}
          <NBAPanel customer={user} maxActions={3} />
          
          {/* Identity & Demographics */}
          <section className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-sumut-green" />
              Identitas & Demografi
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Usia</p>
                <p className="font-semibold text-gray-800">{user.age || 'N/A'} tahun</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status Akun</p>
                <p className="font-semibold text-gray-800">{user.accountStatus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                <p className="font-semibold text-gray-800">
                  {user.accountCreatedDate ? formatDate(user.accountCreatedDate) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo Saat Ini</p>
                <p className="font-semibold text-green-600">{formatCurrency(user.balance)}</p>
              </div>
            </div>
          </section>

          {/* KYC Compliance Section - OJK POJK No. 11/2022 */}
          <section className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-slate-600" />
              KYC Compliance
              <span className="ml-auto">
                <KYCBadge user={user} size="sm" />
              </span>
            </h3>
            
            {/* OJK Compliance Banner */}
            <div className="bg-white rounded-lg p-3 border border-slate-300 mb-4">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-600" />
                <span className="text-xs font-semibold text-slate-700">OJK POJK No. 11/2022 Compliance</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Know Your Customer verification untuk pencegahan pencucian uang dan pendanaan terorisme (AML/CFT).
              </p>
            </div>
            
            {/* Detailed KYC Info */}
            <KYCBadge user={user} showDetails={true} className="mb-4" />
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition flex items-center justify-center gap-1">
                <FileCheck size={14} />
                Re-verify KYC
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition flex items-center justify-center gap-1">
                <Eye size={14} />
                View Documents
              </button>
            </div>
          </section>

          {/* Marketing Consent Management */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-amber-600" />
              Marketing Consent
              <span className="ml-auto">
                <ConsentBadge user={user} size="sm" />
              </span>
            </h3>
            
            {/* UU PDP Compliance Banner */}
            <div className="bg-white rounded-lg p-3 border border-amber-300 mb-4">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">UU PDP No. 27/2022 Compliance</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Semua campaign marketing memerlukan persetujuan eksplisit dari nasabah sesuai regulasi perlindungan data pribadi.
              </p>
            </div>
            
            {/* Consent Status */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Status Consent</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    user.marketingConsent?.optIn !== false 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.marketingConsent?.optIn !== false ? '✓ Opt-in' : '✗ Opt-out'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  {user.marketingConsent?.optIn !== false 
                    ? 'Nasabah menyetujui menerima promo' 
                    : 'Nasabah menolak promo - BLOK semua campaign'}
                </p>
                {user.marketingConsent?.lastUpdated && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Last updated: {new Date(user.marketingConsent.lastUpdated).toLocaleDateString('id-ID')}
                  </p>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Quiet Hours</p>
                <p className="font-semibold text-gray-800">{(user as any).quietHours || '22:00 - 07:00'}</p>
                <p className="text-[10px] text-gray-400 mt-2">Tidak kirim notifikasi pada jam ini</p>
              </div>
            </div>
            
            {/* Channel Preferences */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Channel Preferences</p>
              <div className="flex gap-3">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  user.marketingConsent?.channels?.includes('whatsapp') !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  💬 WhatsApp {user.marketingConsent?.channels?.includes('whatsapp') !== false ? '✓' : '✗'}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  user.marketingConsent?.channels?.includes('email') !== false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  ✉️ Email {user.marketingConsent?.channels?.includes('email') !== false ? '✓' : '✗'}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  user.marketingConsent?.channels?.includes('push') !== false ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  🔔 Push {user.marketingConsent?.channels?.includes('push') !== false ? '✓' : '✗'}
                </span>
              </div>
            </div>

          </section>

          {/* Channel Execution - Quick Actions */}
          <section className={`rounded-lg p-5 border ${
            user.marketingConsent?.optIn === false 
              ? 'bg-gray-100 border-gray-300 opacity-60' 
              : 'bg-gradient-to-r from-sumut-blue/5 to-cyan-50 border-sumut-blue/20'
          }`}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Send size={20} className="text-sumut-blue" />
              Channel Execution
              {user.marketingConsent?.optIn === false && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded ml-2">
                  BLOCKED - Opt-out
                </span>
              )}
            </h3>
            
            {user.marketingConsent?.optIn === false ? (
              <div className="text-center py-6">
                <AlertTriangle size={32} className="text-red-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Channel execution diblokir</p>
                <p className="text-xs text-gray-400">Nasabah telah Opt-out dari marketing (UU PDP)</p>
              </div>
            ) : (
              <ProtectedAction permission="canManageCampaigns" fallback={
                <div className="text-center py-6">
                  <Lock size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Akses Dibatasi</p>
                  <p className="text-xs text-gray-400">Role Anda tidak memiliki izin untuk menjalankan campaign</p>
                </div>
              }>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => {
                      auditLogger.log('CAMPAIGN_EXECUTE', 'Campaign', { 
                        channel: 'whatsapp', 
                        customerId: user.id, 
                        customerName: user.name 
                      });
                      alert(`✅ WhatsApp terkirim ke ${user.phone}\n\nPesan: "Halo ${user.name.split(' ')[0]}, ada promo spesial untuk Anda!"`)
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition">
                      <span className="text-2xl">💬</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">WhatsApp</span>
                    <span className="text-[10px] text-gray-400">{user.phone}</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      auditLogger.log('CAMPAIGN_EXECUTE', 'Campaign', { 
                        channel: 'email', 
                        customerId: user.id, 
                        customerName: user.name 
                      });
                      alert(`✅ Email terkirim ke ${user.email}\n\nSubject: "Promo Spesial untuk ${user.name}"\nStatus: Delivered`)
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition">
                      <Mail size={24} className="text-blue-600 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Email</span>
                    <span className="text-[10px] text-gray-400 truncate max-w-full">{user.email?.split('@')[0]}@...</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      auditLogger.log('CAMPAIGN_EXECUTE', 'Campaign', { 
                        channel: 'push', 
                        customerId: user.id, 
                        customerName: user.name 
                      });
                      alert(`✅ Push Notification terkirim ke device ${user.name}\n\nTitle: "Promo Khusus!"\nBody: "Hai ${user.name.split(' ')[0]}, cek promo terbaru untukmu!"`)
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition">
                      <span className="text-2xl">🔔</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Push Notif</span>
                    <span className="text-[10px] text-gray-400">Mobile App</span>
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 text-center">Klik untuk simulasi pengiriman pesan ke channel (audit logged)</p>
              </ProtectedAction>
            )}
          </section>


          {/* Financial Behavior */}
          <section className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Perilaku Finansial
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Rata-rata Transaksi</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(behaviorAnalytics.averageTransactionAmount)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Volume Transaksi</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(behaviorAnalytics.totalTransactionVolume)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Kategori Dominan</p>
                <div className="flex items-center gap-2 mt-1">
                  {categoryIcons[behaviorAnalytics.dominantCategory] || <ShoppingBag size={16} />}
                  <p className="text-lg font-bold text-gray-800">{behaviorAnalytics.dominantCategory}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Frekuensi per Bulan</p>
                <p className="text-xl font-bold text-blue-600">
                  {behaviorAnalytics.transactionFrequency}x
                </p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Transaksi Terakhir</p>
              <p className="font-semibold text-gray-800">{behaviorAnalytics.lastTransactionDate}</p>
            </div>
          </section>

          {/* PHASE 1: Transaction History Table */}
          <section className="bg-slate-50 rounded-lg p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-600" />
              Riwayat Transaksi
            </h3>
            
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Merchant</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase">Nominal</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {user.transactions.slice(0, 10).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(tx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {categoryIcons[tx.category] || <ShoppingBag size={14} className="text-gray-400" />}
                            <span className="text-sm font-medium text-gray-800">{tx.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tx.merchant || 'Mobile Banking'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(tx.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            ✓ Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-bold text-slate-700">Total (10 terakhir)</td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-green-600">
                        {formatCurrency(user.transactions.slice(0, 10).reduce((sum, t) => sum + t.amount, 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Menampilkan 10 transaksi terbaru dari total {user.transactions.length} transaksi
            </p>
          </section>

          {/* RFM Metrics */}
          <section className="bg-purple-50 rounded-lg p-5 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              RFM Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-2">Recency</p>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#8b5cf6" 
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${(user.rfmScore.recency / 5) * 175.93} 175.93`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-purple-600">{user.rfmScore.recency}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-2">Frequency</p>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#3b82f6" 
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${(user.rfmScore.frequency / 5) * 175.93} 175.93`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">{user.rfmScore.frequency}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-2">Monetary</p>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#10b981" 
                      strokeWidth="6" 
                      fill="none"
                      strokeDasharray={`${(user.rfmScore.monetary / 5) * 175.93} 175.93`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-green-600">{user.rfmScore.monetary}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">RFM Score Gabungan</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-green-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((user.rfmScore.recency + user.rfmScore.frequency + user.rfmScore.monetary) / 15) * 100}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {user.rfmScore.recency + user.rfmScore.frequency + user.rfmScore.monetary}/15
                </span>
              </div>
            </div>
          </section>

          {/* Goals & Motivation - Enhanced with AI Suggestion */}
          {user.dreamSavers && user.dreamSavers.length > 0 && (
            <section className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={20} className="text-yellow-600" />
                Dompet Impian & Motivasi
                <span className="ml-auto text-xs font-normal bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  {user.dreamSavers.length} Goals
                </span>
              </h3>
              
              {/* AI Savings Suggestion - CRM Integration */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-4 border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Zap size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-purple-800 text-sm mb-1">💡 AI Suggestion</p>
                    <p className="text-xs text-purple-700">
                      Berdasarkan pola pengeluaran nasabah, potensi tabungan bulanan: <strong>Rp {((user.transactions?.slice(0,10).reduce((acc, t) => acc + t.amount, 0) || 500000) * 0.15).toLocaleString('id-ID')}/bulan</strong>
                    </p>
                    <p className="text-[10px] text-purple-500 mt-1">
                      Kategori hemat: F&B (-12%), Entertainment (-8%)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {user.dreamSavers.map((dream) => {
                  const progress = Math.round((dream.currentAmount / dream.targetAmount) * 100);
                  const isComplete = progress >= 100;
                  
                  return (
                    <div key={dream.id} className={`bg-white rounded-lg p-4 shadow-sm border ${isComplete ? 'border-green-300 bg-green-50/50' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={dream.image} alt={dream.name} className={`w-12 h-12 rounded object-cover ${isComplete ? 'ring-2 ring-green-400' : ''}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{dream.name}</p>
                            {isComplete && (
                              <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                                🎉 TERCAPAI
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">Target: {formatDate(dream.deadline)}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{formatCurrency(dream.currentAmount)}</span>
                          <span className="text-gray-600">{formatCurrency(dream.targetAmount)}</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isComplete ? 'bg-green-200' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-yellow-500 to-green-500'}`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                        <p className={`text-xs text-right ${isComplete ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                          {progress}% tercapai
                        </p>
                      </div>
                      
                      {/* CRM Promo Opportunity */}
                      {!isComplete && progress > 50 && (
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                          <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> Promo Opportunity: Nasabah close to goal - tawarkan cashback untuk boost!
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Engagement Metrics */}
          <section className="bg-green-50 rounded-lg p-5 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-green-600" />
              Engagement & Aktivitas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Engagement Tier</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-green-600">{user.level}</p>
                  <p className="text-sm text-gray-500">/ 50</p>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-600 h-full rounded-full"
                    style={{ width: `${user.xp}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Progress: {user.xp}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Consistency Score</p>
                <p className="text-3xl font-bold text-green-600">{engagementMetrics.consistencyScore}/100</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Milestones Achieved</p>
                <div className="flex items-center gap-2">
                  <Award size={24} className="text-yellow-500" />
                  <p className="text-2xl font-bold text-gray-800">
                    {engagementMetrics.badgesEarned}/{engagementMetrics.totalBadges}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{engagementMetrics.badgeCompletionRate}% completion</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Days Active</p>
                <p className="text-3xl font-bold text-green-600">{engagementMetrics.daysActive}</p>
              </div>
            </div>
            
            {/* Rewards & Points Section */}
            <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                <Gift size={16} /> Rewards & Loyalty
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{user.points.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-500">Poin Tersedia</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{user.dailyLoginStreak || 0} 🔥</p>
                  <p className="text-xs text-gray-500">Streak Hari</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{user.rewardHistory?.length || 0}</p>
                  <p className="text-xs text-gray-500">Reward Ditukar</p>
                </div>
              </div>
              
              {/* Redemption History */}
              {user.rewardHistory && user.rewardHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <p className="text-xs text-gray-500 mb-2">Riwayat Penukaran Terakhir:</p>
                  <div className="space-y-1">
                    {user.rewardHistory.slice(-3).reverse().map((r: any, i: number) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-700">{r.rewardName}</span>
                        <span className="text-orange-600 font-medium">-{r.pointsUsed} poin</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Utility Analytics - NEW! Regional Bank Sumut Focus */}
          {profile.utilityAnalytics && (
            <section className="bg-cyan-50 rounded-lg p-5 border border-cyan-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap size={20} className="text-cyan-600" />
                Utility & Tagihan Rutin
              </h3>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Total Utility Spend</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {formatCurrency(profile.utilityAnalytics.totalUtilitySpend)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per bulan</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Tagihan Rutin</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {profile.utilityAnalytics.recurringBillsCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.utilityAnalytics.uniqueProviders} providers
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Dependency Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-cyan-600">
                      {profile.utilityAnalytics.dependencyScore}
                    </p>
                    <p className="text-sm text-gray-500">/ 10</p>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full"
                      style={{ width: `${profile.utilityAnalytics.dependencyScore * 10}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Status Pengguna</p>
                  <div className="flex items-center gap-2 mt-2">
                    {profile.utilityAnalytics.isPrimaryBankingUser ? (
                      <>
                        <CheckCircle2 size={24} className="text-green-600" />
                        <div>
                          <p className="font-bold text-green-600 text-sm">Primary User</p>
                          <p className="text-xs text-gray-500">Bank utama</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle size={24} className="text-orange-500" />
                        <div>
                          <p className="font-bold text-orange-600 text-sm">Secondary</p>
                          <p className="text-xs text-gray-500">Bukan bank utama</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Regional PDAM Info */}
              {profile.pdamRegion && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">💧</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-semibold">PDAM Regional</p>
                      <p className="text-lg font-bold text-blue-700">{profile.pdamRegion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Pembayaran air bersih rutin terdeteksi
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Utility Persona Badge */}
              {profile.utilityPersona && (
                <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-cyan-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Utility Persona</p>
                      <p className="text-xl font-bold text-cyan-700">{profile.utilityPersona}</p>
                    </div>
                    <Award size={32} className="text-cyan-500" />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Campaign History */}
          <section className="bg-orange-50 rounded-lg p-5 border border-orange-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-orange-600" />
              Riwayat Campaign
            </h3>
            
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <p className="text-sm text-gray-500">Total Diterima</p>
                <p className="text-2xl font-bold text-gray-800">{profile.totalCampaignsReceived}</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <p className="text-sm text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold text-orange-600">{profile.campaignResponseRate}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="text-2xl font-bold text-green-600">{profile.totalConversions}</p>
              </div>
            </div>

            {/* Campaign List */}
            {user.campaignHistory && user.campaignHistory.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {user.campaignHistory.map((campaign) => (
                  <div key={campaign.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getInteractionIcon(campaign.interactionType)}
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">{campaign.campaignTitle}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(campaign.timestamp).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`
                        px-2 py-1 rounded text-xs font-semibold
                        ${campaign.interactionType === 'convert' ? 'bg-green-100 text-green-700' : ''}
                        ${campaign.interactionType === 'click' ? 'bg-blue-100 text-blue-700' : ''}
                        ${campaign.interactionType === 'view' ? 'bg-gray-100 text-gray-700' : ''}
                        ${campaign.interactionType === 'ignore' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {campaign.interactionType.toUpperCase()}
                      </span>
                      {campaign.conversionAmount && (
                        <p className="text-xs text-green-600 mt-1 font-semibold">
                          +{formatCurrency(campaign.conversionAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                <Mail size={32} className="mx-auto mb-2 opacity-50" />
                <p>Belum ada riwayat campaign</p>
              </div>
            )}
          </section>

          {/* PHASE 3: Interaction Timeline - Customer Service & Keluhan */}
          {user.interactions && user.interactions.length > 0 && (
            <section className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-purple-600" />
                Riwayat Interaksi & Keluhan
              </h3>

              <div className="space-y-3">
                {user.interactions.map((interaction) => (
                  <div key={interaction.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-400">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {interaction.type === 'call' && <UserIcon size={20} className="text-blue-600" />}
                          {interaction.type === 'chat' && <Mail size={20} className="text-green-600" />}
                          {interaction.type === 'email' && <Mail size={20} className="text-orange-600" />}
                          {interaction.type === 'ticket' && <AlertCircle size={20} className="text-red-600" />}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{interaction.subject}</p>
                          {interaction.description && (
                            <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{interaction.channel}</span>
                            <span>•</span>
                            <span>{new Date(interaction.timestamp).toLocaleDateString('id-ID', { 
                              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}</span>
                            {interaction.assignedTo && (<><span>•</span><span>{interaction.assignedTo}</span></>)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          interaction.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          interaction.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {interaction.status === 'resolved' && '✓ Resolved'}
                          {interaction.status === 'in_progress' && '⏳ In Progress'}
                          {interaction.status === 'open' && '🔔 Open'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-purple-100 rounded-lg text-center">
                <p className="text-sm text-purple-700">
                  📞 Total: <span className="font-bold">{user.interactions.length}</span> | 
                  ✓ Resolved: <span className="font-bold">{user.interactions.filter(i => i.status === 'resolved').length}</span>
                </p>
              </div>
            </section>
          )}

          {/* PHASE 3: Channel Preference & Behavior Insight */}
          <section className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-indigo-600" />
              Channel & Behavior Insight
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Preferred Channel */}
              <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-indigo-200">
                <p className="text-sm text-gray-500 mb-2">Preferred Channel</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">📱</span>
                  <div>
                    <p className="text-xl font-bold text-indigo-900">{user.preferredChannel || 'Mobile App'}</p>
                    <p className="text-xs text-indigo-600">Primary channel</p>
                  </div>
                </div>
              </div>

              {/* Active Time */}
              <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-indigo-200">
                <p className="text-sm text-gray-500 mb-2">Active Time Slot</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">⏰</span>
                  <div>
                    <p className="text-xl font-bold text-indigo-900">{user.activeTimeSlot || '19:00-22:00'}</p>
                    <p className="text-xs text-indigo-600">Peak activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Distribution */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-semibold mb-3">Channel Usage Distribution</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">📱 Mobile Banking</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">🏧 ATM</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">🌐 Web Banking</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">🏦 Branch</span>
                  <div className="flex items-center gap-2 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Response Indicator */}
            <div className="mt-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 border-2 border-indigo-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700 font-semibold">Promo Response Rate</p>
                  <p className="text-xs text-indigo-600 mt-1">via Push Notification</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-900">
                    {profile.campaignResponseRate || 0}%
                  </p>
                  <p className="text-xs text-indigo-600">
                    {profile.campaignResponseRate > 50 ? '🔥 Tinggi' : 
                     profile.campaignResponseRate > 25 ? '✓ Sedang' : '📉 Rendah'}
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* Transfer Behavior Analytics */}
          <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Send className="text-blue-600" size={20} />
              Transfer Behavior
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <p className="text-2xl font-bold text-blue-600">{transferAnalytics.intraBankCount}</p>
                <p className="text-xs text-gray-600 mt-1">Transfer Sesama Sumut</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                <p className="text-2xl font-bold text-orange-600">{transferAnalytics.interBankCount}</p>
                <p className="text-xs text-gray-600 mt-1">Transfer Antar Bank</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-600">{transferAnalytics.topUpCount}</p>
                <p className="text-xs text-gray-600 mt-1">Top-Up Received</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Transfer Persona:</span>
                <span className="font-semibold text-sm">{transferAnalytics.transferPersona}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Loyalty Score:</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full {
                        transferAnalytics.insights.loyaltyScore > 70 ? 'bg-green-500' :
                        transferAnalytics.insights.loyaltyScore > 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `{transferAnalytics.insights.loyaltyScore}%` }}
                    />
                  </div>
                  <span className="font-semibold text-sm">
                    {transferAnalytics.insights.loyaltyScore.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Churn Risk:</span>
                <span className={`text-sm font-semibold {
                  transferAnalytics.insights.churnRisk === 'High' ? 'text-red-600' :
                  transferAnalytics.insights.churnRisk === 'Medium' ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {transferAnalytics.insights.churnRisk}
                </span>
              </div>
            </div>
            
            {transferAnalytics.recommendations.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">?? CRM Actions:</p>
                {transferAnalytics.recommendations.map((rec, idx) => (
                  <div key={idx} className={`p-3 rounded-lg text-sm {
                    rec.startsWith('?') ? 'bg-green-50 border border-green-200 text-green-800' :
                    rec.startsWith('??') || rec.startsWith('??') ? 'bg-orange-50 border border-orange-200 text-orange-800' :
                    'bg-blue-50 border border-blue-200 text-blue-800'
                  }`}>
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ========== CRM METRICS DASHBOARD ========== */}
          <section className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-5 border-2 border-slate-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-slate-600" />
              CRM Metrics Dashboard
              <span className="ml-auto text-xs font-normal bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                Real-time Analytics
              </span>
            </h3>

            {/* SERVICE METRICS */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <HeartPulse size={16} className="text-red-500" /> Service Metrics
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Avg Response</p>
                  <p className="text-xl font-bold text-blue-600">{crmMetrics.serviceMetrics.averageResponseTime}h</p>
                  <p className="text-[10px] text-gray-400">First response</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Resolution Time</p>
                  <p className="text-xl font-bold text-purple-600">{crmMetrics.serviceMetrics.averageResolutionTime}h</p>
                  <p className="text-[10px] text-gray-400">Avg complete</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">SLA Hit Rate</p>
                  <p className={`text-xl font-bold ${crmMetrics.serviceMetrics.slaHitRate >= 80 ? 'text-green-600' : crmMetrics.serviceMetrics.slaHitRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {crmMetrics.serviceMetrics.slaHitRate}%
                  </p>
                  <p className="text-[10px] text-gray-400">Target: 80%</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Repeat Complaint</p>
                  <p className={`text-xl font-bold ${crmMetrics.serviceMetrics.repeatComplaintRate <= 10 ? 'text-green-600' : crmMetrics.serviceMetrics.repeatComplaintRate <= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {crmMetrics.serviceMetrics.repeatComplaintRate}%
                  </p>
                  <p className="text-[10px] text-gray-400">Target: &lt;10%</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 bg-white rounded-lg px-4 py-2 border border-gray-100">
                <span className="text-xs text-gray-500">Tickets: <strong className="text-gray-800">{crmMetrics.serviceMetrics.totalTickets}</strong></span>
                <span className="text-xs text-green-600">✓ Resolved: <strong>{crmMetrics.serviceMetrics.resolvedTickets}</strong></span>
                <span className="text-xs text-orange-600">⏳ Pending: <strong>{crmMetrics.serviceMetrics.pendingTickets}</strong></span>
                <span className="ml-auto text-xs text-gray-500">CSAT: <strong className="text-yellow-600">⭐ {crmMetrics.serviceMetrics.satisfactionScore}/5</strong></span>
              </div>
            </div>

            {/* ENGAGEMENT METRICS */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" /> Campaign Engagement
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Opt-in Rate</p>
                  <p className={`text-xl font-bold ${crmMetrics.campaignEngagement.optInRate === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {crmMetrics.campaignEngagement.optInRate}%
                  </p>
                  <p className="text-[10px] text-gray-400">{crmMetrics.campaignEngagement.optInRate === 100 ? '✓ Opted-in' : '✗ Opted-out'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Open Rate</p>
                  <p className={`text-xl font-bold ${crmMetrics.campaignEngagement.emailOpenRate >= 40 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {crmMetrics.campaignEngagement.emailOpenRate}%
                  </p>
                  <p className="text-[10px] text-gray-400">Industry: 35%</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Click Rate</p>
                  <p className={`text-xl font-bold ${crmMetrics.campaignEngagement.clickRate >= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {crmMetrics.campaignEngagement.clickRate}%
                  </p>
                  <p className="text-[10px] text-gray-400">Industry: 8%</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Conv/Journey</p>
                  <p className="text-xl font-bold text-emerald-600">{crmMetrics.campaignEngagement.conversionPerJourney}</p>
                  <p className="text-[10px] text-gray-400">Avg {crmMetrics.campaignEngagement.averageJourneyLength}d</p>
                </div>
              </div>
            </div>

            {/* GROWTH METRICS */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" /> Growth Metrics
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Cross-sell Conv</p>
                  <p className="text-xl font-bold text-teal-600">{crmMetrics.growthMetrics.crossSellConversion}%</p>
                  <p className="text-[10px] text-gray-400">Product offers</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Upsell Conv</p>
                  <p className="text-xl font-bold text-indigo-600">{crmMetrics.growthMetrics.upsellConversion}%</p>
                  <p className="text-[10px] text-gray-400">Upgrades</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Products/Customer</p>
                  <p className="text-xl font-bold text-purple-600">{crmMetrics.growthMetrics.productPerCustomer}</p>
                  <p className="text-[10px] text-gray-400">+{crmMetrics.growthMetrics.newProductAdoption} new</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Growth Potential</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-orange-600">{crmMetrics.growthMetrics.growthPotentialScore}</p>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-green-500 h-full rounded-full"
                        style={{ width: `${crmMetrics.growthMetrics.growthPotentialScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RETENTION METRICS */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Users size={16} className="text-orange-500" /> Retention Metrics
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Churn Risk</p>
                  <p className={`text-lg font-bold ${
                    crmMetrics.retentionMetrics.churnRisk === 'Low' ? 'text-green-600' :
                    crmMetrics.retentionMetrics.churnRisk === 'Medium' ? 'text-yellow-600' :
                    crmMetrics.retentionMetrics.churnRisk === 'High' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {crmMetrics.retentionMetrics.churnRisk === 'Low' && '🟢'} 
                    {crmMetrics.retentionMetrics.churnRisk === 'Medium' && '🟡'} 
                    {crmMetrics.retentionMetrics.churnRisk === 'High' && '🟠'} 
                    {crmMetrics.retentionMetrics.churnRisk === 'Critical' && '🔴'} 
                    {crmMetrics.retentionMetrics.churnRisk}
                  </p>
                  <p className="text-[10px] text-gray-400">{crmMetrics.retentionMetrics.churnProbability}% probability</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Days Inactive</p>
                  <p className={`text-xl font-bold ${crmMetrics.retentionMetrics.daysSinceLastActivity <= 7 ? 'text-green-600' : crmMetrics.retentionMetrics.daysSinceLastActivity <= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {crmMetrics.retentionMetrics.daysSinceLastActivity}
                  </p>
                  <p className="text-[10px] text-gray-400">days since active</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Retention Score</p>
                  <p className="text-xl font-bold text-blue-600">{crmMetrics.retentionMetrics.retentionScore}%</p>
                  <p className="text-[10px] text-gray-400">Likelihood to stay</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Reactivation</p>
                  <p className={`text-lg font-bold ${crmMetrics.retentionMetrics.reactivationEligible ? 'text-orange-600' : 'text-green-600'}`}>
                    {crmMetrics.retentionMetrics.reactivationEligible ? `⚠️ Eligible` : '✓ Active'}
                  </p>
                  <p className="text-[10px] text-gray-400">{crmMetrics.retentionMetrics.reactivationAttempts} attempts</p>
                </div>
              </div>
            </div>

            {/* TRUST & COMPLIANCE METRICS */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Shield size={16} className="text-purple-500" /> Trust & Compliance
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Consent Coverage</p>
                  <p className={`text-xl font-bold ${crmMetrics.trustCompliance.consentCoverage === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {crmMetrics.trustCompliance.consentCoverage}%
                  </p>
                  <p className="text-[10px] text-gray-400">{crmMetrics.trustCompliance.marketingConsentStatus ? '✓ Marketing' : '✗ No consent'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Data Quality</p>
                  <p className={`text-xl font-bold ${crmMetrics.trustCompliance.dataQualityScore >= 80 ? 'text-green-600' : crmMetrics.trustCompliance.dataQualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {crmMetrics.trustCompliance.dataQualityScore}%
                  </p>
                  <p className="text-[10px] text-gray-400">Score</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Profile Complete</p>
                  <p className={`text-xl font-bold ${crmMetrics.trustCompliance.profileCompleteness >= 80 ? 'text-green-600' : crmMetrics.trustCompliance.profileCompleteness >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {crmMetrics.trustCompliance.profileCompleteness}%
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {crmMetrics.trustCompliance.missingFields.length > 0 ? `Missing: ${crmMetrics.trustCompliance.missingFields.slice(0, 2).join(', ')}` : 'Complete'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">KYC Status</p>
                  <p className={`text-lg font-bold ${
                    crmMetrics.trustCompliance.kycStatus === 'Complete' ? 'text-green-600' :
                    crmMetrics.trustCompliance.kycStatus === 'Partial' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {crmMetrics.trustCompliance.kycStatus === 'Complete' && '✓'} 
                    {crmMetrics.trustCompliance.kycStatus === 'Partial' && '⚠️'} 
                    {crmMetrics.trustCompliance.kycStatus === 'Pending' && '⏳'} 
                    {crmMetrics.trustCompliance.kycStatus === 'Expired' && '❌'} 
                    {crmMetrics.trustCompliance.kycStatus}
                  </p>
                  <p className="text-[10px] text-gray-400">Audit: {crmMetrics.trustCompliance.auditTrailCompleteness}%</p>
                </div>
              </div>
            </div>

          </section>

          {/* Customer Journey Timeline */}
          <section className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Customer Journey Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-400"></div>
              
              {/* Timeline events */}
              <div className="space-y-4">
                {journeyEvents.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-4 relative">
                    {/* Event dot */}
                    <div className={`w-8 h-8 rounded-full ${event.color} flex items-center justify-center text-white text-sm z-10 flex-shrink-0`}>
                      {event.icon}
                    </div>
                    {/* Event content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                        <span className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <p className="text-xs text-gray-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Notes & Interaction Log */}
          <section className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle size={20} className="text-purple-600" />
              Notes & Interaction Log
            </h3>
            
            {/* Add new note */}
            <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex gap-2 mb-2">
                <select 
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as CustomerNote['type'])}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="note">📝 Note</option>
                  <option value="call">📞 Call</option>
                  <option value="meeting">🤝 Meeting</option>
                  <option value="email">📧 Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="follow_up">🔔 Follow-up</option>
                </select>
                <input
                  type="text"
                  placeholder="Tambah catatan baru..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={() => {
                    if (newNoteContent.trim()) {
                      const newNote: CustomerNote = {
                        id: `note_new_${Date.now()}`,
                        customerId: user.id,
                        createdAt: new Date().toISOString(),
                        createdBy: 'Admin Bank',
                        content: newNoteContent,
                        type: newNoteType,
                        tags: [],
                        outcome: 'neutral',
                      };
                      setNotes([newNote, ...notes]);
                      setNewNoteContent('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <Plus size={14} /> Simpan
                </button>
              </div>
            </div>
            
            {/* Notes list */}
            <div className="space-y-3">
              {(showAllNotes ? notes : notes.slice(0, 3)).map((note) => {
                const typeIcons: Record<CustomerNote['type'], string> = {
                  call: '📞',
                  meeting: '🤝',
                  email: '📧',
                  whatsapp: '💬',
                  note: '📝',
                  follow_up: '🔔',
                };
                const outcomeColors: Record<string, string> = {
                  positive: 'bg-green-100 text-green-700 border-green-200',
                  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
                  negative: 'bg-red-100 text-red-700 border-red-200',
                };
                
                return (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">
                        {typeIcons[note.type]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 capitalize">{note.type}</span>
                            {note.outcome && (
                              <span className={`px-1.5 py-0.5 text-[10px] rounded-full border ${outcomeColors[note.outcome]}`}>
                                {note.outcome}
                              </span>
                            )}
                            {note.tags.map(tag => (
                              <span key={tag} className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                                tag === 'important' ? 'bg-red-100 text-red-600' :
                                tag === 'opportunity' ? 'bg-green-100 text-green-600' :
                                tag === 'follow_up' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-1">by {note.createdBy}</p>
                        {note.nextAction && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-xs text-yellow-700 flex items-center gap-1">
                              <Clock size={10} /> Next: {note.nextAction} ({note.nextActionDate})
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {notes.length > 3 && (
              <button
                onClick={() => setShowAllNotes(!showAllNotes)}
                className="mt-3 w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1"
              >
                {showAllNotes ? (
                  <><ChevronUp size={14} /> Sembunyikan</>
                ) : (
                  <><ChevronDown size={14} /> Lihat {notes.length - 3} catatan lainnya</>
                )}
              </button>
            )}
          </section>

          {/* Trend Charts */}
          <section className="bg-white rounded-lg p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LineChart size={20} className="text-emerald-600" />
              Trend & Analytics
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Transaction Trend Chart */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Transaksi 6 Bulan Terakhir</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transactionTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}Jt`} />
                      <Tooltip 
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spend by Category Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Spending by Category</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {spendByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <p className="text-xl font-bold text-blue-700">
                  Rp {(transactionTrend.reduce((s, t) => s + t.amount, 0) / 1000000).toFixed(1)}Jt
                </p>
                <p className="text-[10px] text-blue-500 font-medium">Total 6 Bulan</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                <p className="text-xl font-bold text-green-700">
                  {transactionTrend.reduce((s, t) => s + t.count, 0)}
                </p>
                <p className="text-[10px] text-green-500 font-medium">Total Transaksi</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                <p className="text-xl font-bold text-purple-700">
                  Rp {((transactionTrend.reduce((s, t) => s + t.amount, 0) / 6) / 1000000).toFixed(1)}Jt
                </p>
                <p className="text-[10px] text-purple-500 font-medium">Rata-rata/Bulan</p>
              </div>
            </div>
          </section>

          {/* AI Recommendation */}
          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Zap size={20} className="text-indigo-600" />
              AI Recommendation
            </h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {profile.recommendedNextAction}
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Customer360View;
