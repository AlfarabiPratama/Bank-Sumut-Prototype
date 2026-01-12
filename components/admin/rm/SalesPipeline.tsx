import React from 'react';
import { MoreHorizontal, Plus, Calendar, AlertCircle } from 'lucide-react';
import { MOCK_DEALS } from './mockData';
import { Deal } from '../../../types';

const STAGES = {
  QUALIFIED: { label: 'Qualified', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  PROPOSAL: { label: 'Proposal Sent', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  NEGOTIATION: { label: 'Negotiation', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  CLOSING: { label: 'Closing', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
};

const SalesPipeline = () => {
  const dealsByStage = MOCK_DEALS.reduce((acc, deal) => {
    // Basic grouping (some mock deals might be in other stages, ignore for now strictly or map them)
    // Only map known stages for the board columns
    if (STAGES[deal.stage as keyof typeof STAGES]) {
        if (!acc[deal.stage]) acc[deal.stage] = [];
        acc[deal.stage].push(deal);
    }
    return acc;
  }, {} as Record<string, Deal[]>);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Sales Pipeline</h2>
           <p className="text-sm text-gray-500">Manage deal stages and progression</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 min-w-[1000px] h-full pb-4">
            {Object.entries(STAGES).map(([stageKey, config]) => (
                <div key={stageKey} className="flex-1 flex flex-col min-w-[280px] bg-gray-50 rounded-xl border border-gray-200 h-full max-h-[calc(100vh-12rem)]">
                    {/* Column Header */}
                    <div className={`p-3 border-b border-gray-200 rounded-t-xl flex justify-between items-center ${config.color.split(' ')[0]}`}>
                        <span className={`font-bold text-sm ${config.color.split(' ')[2]}`}>{config.label}</span>
                        <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold text-gray-600">
                            {dealsByStage[stageKey]?.length || 0}
                        </span>
                    </div>

                    {/* Deals List */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3">
                        {dealsByStage[stageKey]?.map(deal => (
                            <DealCard key={deal.id} deal={deal} formatCurrency={formatCurrency} />
                        ))}
                         {(!dealsByStage[stageKey] || dealsByStage[stageKey].length === 0) && (
                            <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-lg">
                                No deals
                            </div>
                         )}
                    </div>
                    
                    {/* Column Footer */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl text-center">
                        <span className="text-xs text-gray-500 font-medium">
                            Total: {formatCurrency(dealsByStage[stageKey]?.reduce((sum, d) => sum + d.value, 0) || 0)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const DealCard = ({ deal, formatCurrency }: { deal: Deal, formatCurrency: (v: number) => string }) => {
    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                    {deal.product}
                </span>
                {deal.isHot && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HOT</span>}
            </div>
            
            <h4 className="font-bold text-gray-900 text-sm mb-0.5">{deal.name}</h4>
            <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                 <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                    {deal.customer?.name.substring(0,1) || 'C'}
                 </span>
                 {deal.customer?.name}
            </div>

            <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                <div>
                    <div className="text-xs text-gray-400 mb-0.5">Value</div>
                    <div className="font-bold text-gray-900 text-sm">{formatCurrency(deal.value)}</div>
                </div>
                <div className="text-right">
                     <div className="text-xs text-gray-400 mb-0.5">Prob.</div>
                     <div className={`text-xs font-bold ${deal.probability > 50 ? 'text-green-600' : 'text-amber-600'}`}>
                        {deal.probability}%
                     </div>
                </div>
            </div>
             <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                <Calendar size={10} /> Closing: {new Date(deal.expectedCloseDate).toLocaleDateString()}
            </div>
        </div>
    );
}

export default SalesPipeline;
