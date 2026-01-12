import React, { useMemo } from 'react';
import { 
  Users, Target, TrendingUp, AlertTriangle, Clock, Calendar, 
  ChevronRight, Phone, MessageCircle, Mail, Briefcase, 
  MoreHorizontal, Plus, Star
} from 'lucide-react';
import { MOCK_URGENT_ACTIONS, MOCK_OPPORTUNITIES, MOCK_RM_CUSTOMERS } from './mockData';
import { Opportunity, UrgentAction, User } from '../../../types';

interface RMHomeProps {
  userName?: string;
}

const RMHome: React.FC<RMHomeProps> = ({ userName = "Ahmad Siregar" }) => {
  // Mock calculations based on data
  const stats = {
    monthlyTarget: 2500000000,
    achieved: 1850000000,
    pipeline: 4500000000,
    monthProgress: 74
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome & Stats Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Selamat Pagi, {userName}! 👋</h1>
            <p className="text-blue-200 text-sm">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[140px]">
              <div className="flex items-center gap-2 text-blue-200 mb-1 text-xs uppercase tracking-wider">
                <Target size={14} /> Target Bulan Ini
              </div>
              <div className="text-xl font-bold">{formatCurrency(stats.achieved)}</div>
              <div className="text-xs text-blue-200 mt-1">
                {stats.monthProgress}% dari {formatCurrency(stats.monthlyTarget)}
              </div>
              <div className="mt-2 h-1 bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${stats.monthProgress}%` }} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[140px]">
              <div className="flex items-center gap-2 text-blue-200 mb-1 text-xs uppercase tracking-wider">
                <TrendingUp size={14} /> Pipeline Value
              </div>
              <div className="text-xl font-bold">{formatCurrency(stats.pipeline)}</div>
              <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> +15% vs last month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Actions - Top Priority */}
      {MOCK_URGENT_ACTIONS.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <AlertTriangle size={20} />
            <span className="font-semibold text-sm">Tindakan Mendesak:</span>
            <span className="text-sm">Anda punya {MOCK_URGENT_ACTIONS.length} task prioritas tinggi hari ini!</span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {MOCK_URGENT_ACTIONS.map(action => (
              <UrgentActionCard key={action.id} action={action} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agenda & Opportunities (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Agenda */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-blue-600" /> Agenda Hari Ini
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AgendaItem 
                icon={<Phone size={16} className="text-blue-600" />}
                title="Follow-up Call"
                time="09:00"
                desc="Pak Budi Santoso - Konfirmasi Deposito"
                color="blue"
              />
              <AgendaItem 
                icon={<Users size={16} className="text-purple-600" />}
                title="Client Meeting"
                time="13:30"
                desc="Ibu Siti Aminah - Presentation KPR"
                color="purple"
              />
              <AgendaItem 
                icon={<Briefcase size={16} className="text-green-600" />}
                title="Internal Review"
                time="15:00"
                desc="Tim Sales - Monthly Pipeline Review"
                color="green"
              />
              <AgendaItem 
                icon={<AlertTriangle size={16} className="text-amber-600" />}
                title="Deal Closing"
                time="Target Hari Ini"
                desc="Review Dokumen PT Maju Jaya"
                color="amber"
              />
            </div>
          </section>

          {/* Hot Opportunities (NBA) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Star size={18} className="text-amber-500" /> Peluang Terbaik (NBA)
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">AI Powered</span>
            </div>
            
            <div className="space-y-3">
              {MOCK_OPPORTUNITIES.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Activity Feed (1/3) */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Aktivitas Terkini</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">Lihat Semua</button>
            </div>
            
            <div className="relative pl-4 border-l border-gray-200 space-y-6">
              {[
                { time: '10:30', title: 'Call Logged', desc: 'Called Budi Santoso regarding deposit renewal.', type: 'call' },
                { time: 'Kemarin', title: 'Deal Stage Updated', desc: 'Moved "KPR Rumah Kedua" to Proposal sent.', type: 'deal' },
                { time: 'Kemarin', title: 'New Lead Assigned', desc: 'System assigned "PT Berkah Abadi" from Campaign.', type: 'lead' }
              ].map((activity, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                    activity.type === 'call' ? 'bg-blue-500' : 
                    activity.type === 'deal' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <div className="text-xs text-gray-400 mb-0.5">{activity.time}</div>
                  <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const UrgentActionCard = ({ action }: { action: UrgentAction }) => (
  <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-2">
        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
          {action.priority}
        </span>
        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
          <Clock size={12} /> Due: {new Date(action.deadline).toLocaleDateString()}
        </span>
      </div>
      <h4 className="font-bold text-gray-900 text-sm mb-1">{action.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{action.description}</p>
    </div>
    
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
          {action.customer.name.substring(0,2).toUpperCase()}
        </div>
        <span className="text-xs font-medium text-gray-700">{action.customer.name}</span>
      </div>
      <button className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
        {action.actionLabel || 'Tangani'}
      </button>
    </div>
  </div>
);

const AgendaItem = ({ icon, title, time, desc, color }: any) => (
  <div className={`bg-${color}-50 p-3 rounded-lg border border-${color}-100 flex items-start gap-3`}>
    <div className={`bg-white p-1.5 rounded-md shadow-sm text-${color}-600`}>
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-gray-400 mb-0.5">{time}</div>
      <div className="text-sm font-bold text-gray-900">{title}</div>
      <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">{desc}</div>
    </div>
  </div>
);

const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start gap-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
          {opportunity.customer.name.substring(0,2).toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{opportunity.customer.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              opportunity.customer.rfm.segment === 'Champions' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {opportunity.customer.rfm.segment}
            </span>
            • Nasabah sejak 2018
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500">Est. Revenue</div>
        <div className="font-bold text-green-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(opportunity.nba.expectedRevenue)}</div>
      </div>
    </div>
    
    <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-indigo-600">💡</div>
        <div>
          <p className="text-sm font-bold text-indigo-900">{opportunity.nba.title}</p>
          <p className="text-xs text-indigo-700 mt-0.5">{opportunity.nba.shortReason}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pl-6">
        <div className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
          {opportunity.nba.confidence}% Match
        </div>
        <div className="flex gap-2">
          <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700">Call Now</button>
          <button className="text-xs border border-indigo-200 bg-white text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-50">Details</button>
        </div>
      </div>
    </div>
  </div>
);

export default RMHome;
