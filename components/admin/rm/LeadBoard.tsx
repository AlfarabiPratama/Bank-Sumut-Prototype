import React, { useState } from 'react';
import { TrendingUp, Flame, ThermometerSun, Snowflake, User, ArrowRight, MessageSquare, Phone, MoreHorizontal, HelpCircle } from 'lucide-react';
import { MOCK_SCORED_LEADS } from './mockData';
import { ScoredLead } from '../../../types';
import Tooltip from '../../ui/Tooltip';

const LeadBoard = () => {
    const [filterTemperature, setFilterTemperature] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');

    const filteredLeads = filterTemperature === 'ALL'
        ? MOCK_SCORED_LEADS.sort((a,b) => b.score - a.score)
        : MOCK_SCORED_LEADS.filter(l => l.temperature === filterTemperature).sort((a,b) => b.score - a.score);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const stats = {
        hot: MOCK_SCORED_LEADS.filter(l => l.temperature === 'HOT').length,
        warm: MOCK_SCORED_LEADS.filter(l => l.temperature === 'WARM').length,
        cold: MOCK_SCORED_LEADS.filter(l => l.temperature === 'COLD').length,
        totalValue: MOCK_SCORED_LEADS.reduce((sum, l) => sum + (l.nba?.expectedRevenue || 0), 0)
    };

  return (
    <div className="space-y-6">
        {/* Header & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
                onClick={() => setFilterTemperature('HOT')}
                className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${filterTemperature === 'HOT' ? 'border-red-500 shadow-md ring-1 ring-red-500' : 'border-gray-200 hover:border-red-300'}`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-red-100 rounded-lg text-red-600"><Flame size={18} /></div>
                    <span className="font-bold text-gray-700">Hot Leads</span>
                    <Tooltip content="Prospek dengan probabilitas tinggi untuk closing. Score >80. Perlu follow-up dalam 24-48 jam." position="top">
                      <HelpCircle size={12} className="text-gray-400 hover:text-red-500 cursor-help" />
                    </Tooltip>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.hot}</div>
                <div className="text-xs text-red-600 font-medium">Prioritas Tinggi</div>
            </div>

            <div 
                onClick={() => setFilterTemperature('WARM')}
                className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${filterTemperature === 'WARM' ? 'border-orange-500 shadow-md ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300'}`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600"><ThermometerSun size={18} /></div>
                    <span className="font-bold text-gray-700">Warm Leads</span>
                    <Tooltip content="Prospek dengan potensi sedang. Score 50-80. Perlu nurturing: edukasi produk, follow-up berkala." position="top">
                      <HelpCircle size={12} className="text-gray-400 hover:text-orange-500 cursor-help" />
                    </Tooltip>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.warm}</div>
                <div className="text-xs text-orange-600 font-medium">Perlu Nurturing</div>
            </div>

            <div 
                onClick={() => setFilterTemperature('COLD')}
                className={`cursor-pointer bg-white p-4 rounded-xl border transition-all ${filterTemperature === 'COLD' ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><Snowflake size={18} /></div>
                    <span className="font-bold text-gray-700">Cold Leads</span>
                    <Tooltip content="Prospek dengan probabilitas rendah saat ini. Score <50. Masuk pipeline jangka panjang." position="top">
                      <HelpCircle size={12} className="text-gray-400 hover:text-blue-500 cursor-help" />
                    </Tooltip>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.cold}</div>
                <div className="text-xs text-blue-600 font-medium">Jangka Panjang</div>
            </div>

            <div className={`bg-white p-4 rounded-xl border border-gray-200`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-green-100 rounded-lg text-green-600"><TrendingUp size={18} /></div>
                    <span className="font-bold text-gray-700">Potential Value</span>
                    <Tooltip content="Total potensi pendapatan dari semua leads berdasarkan rekomendasi NBA (Next Best Action)." position="top">
                      <HelpCircle size={12} className="text-gray-400 hover:text-green-500 cursor-help" />
                    </Tooltip>
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</div>
                <div className="text-xs text-green-600 font-medium">Dari NBA</div>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Lead Board Ranking</h3>
                <span className="text-xs text-gray-500">Sorted by AI Score</span>
            </div>
            
            <div className="divide-y divide-gray-100">
                {filteredLeads.map((lead, index) => (
                    <LeadRow key={lead.id} lead={lead} rank={index + 1} formatCurrency={formatCurrency} />
                ))}
            </div>
        </div>
    </div>
  );
};

const LeadRow = ({ lead, rank, formatCurrency }: { lead: ScoredLead, rank: number, formatCurrency: (v: number) => string }) => {
    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
                {rank === 1 ? <span className="text-2xl">🥇</span> :
                 rank === 2 ? <span className="text-2xl">🥈</span> :
                 rank === 3 ? <span className="text-2xl">🥉</span> :
                 <span className="text-lg font-bold text-gray-400">#{rank}</span>}
            </div>

            {/* Customer Info */}
            <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{lead.customer.name}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        lead.temperature === 'HOT' ? 'bg-red-100 text-red-700' :
                        lead.temperature === 'WARM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {lead.temperature}
                    </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><User size={10} /> {lead.source}</span>
                    <span>•</span>
                    <span>Last Contact: {new Date(lead.lastContactDate).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="md:w-64">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-2xl font-bold text-gray-900">{lead.score}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">/ 100</div>
                </div>
                <div className="flex gap-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                    <div className="bg-green-500" style={{ width: `${lead.scoreFactors.balance}%` }} title="Balance Score" />
                    <div className="bg-blue-500" style={{ width: `${lead.scoreFactors.engagement}%` }} title="Engagement Score" />
                    <div className="bg-purple-500" style={{ width: `${lead.scoreFactors.recency}%` }} title="Recency Score" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Fin</span>
                    <span>Eng</span>
                    <span>Rec</span>
                </div>
            </div>

            {/* NBA */}
            <div className="md:w-64 bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">💡</span>
                    <span className="text-xs font-bold text-indigo-900 line-clamp-1">{lead.nba.title}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-indigo-700">
                    <span>Conf: {lead.nba.confidence}%</span>
                    <span className="font-bold text-green-600">{formatCurrency(lead.nba.expectedRevenue)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm" title="Call">
                    <Phone size={18} />
                </button>
                <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg" title="Details">
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default LeadBoard;
