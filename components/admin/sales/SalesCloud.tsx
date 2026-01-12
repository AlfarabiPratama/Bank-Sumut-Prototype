import React, { useState, useEffect } from 'react';
import { 
  Users, Target, TrendingUp, Briefcase, BarChart3, 
  LayoutDashboard, List, Activity 
} from 'lucide-react';
import { User, LoanApplication } from '../../../types';
import RMHome from '../rm/RMHome';
import CustomerPortfolio from '../rm/CustomerPortfolio';
import SalesPipeline from '../rm/SalesPipeline';
import LeadBoard from '../rm/LeadBoard';

interface SalesCloudProps {
  customers: User[];
  applications?: LoanApplication[];
  onSelectCustomer?: (customer: User) => void;
  activeSubTab?: string;
  hideSidebar?: boolean;
}

// Map parent sub-tabs to internal tab values
const SUB_TAB_MAP: Record<string, SalesTab> = {
  'Home': 'home',
  'Leads': 'leads',
  'Pipeline': 'pipeline',
  'Portfolio': 'portfolio',
  'Activity': 'activity',
  'overview': 'home' // Default fallback
};

type SalesTab = 'home' | 'portfolio' | 'pipeline' | 'leads' | 'activity';

const SalesCloud: React.FC<SalesCloudProps> = ({
  customers, // Not used directly anymore, relying on mockData for now or passing down
  applications = [],
  onSelectCustomer,
  activeSubTab,
  hideSidebar = false,
}) => {
  const [activeTab, setActiveTab] = useState<SalesTab>('home');

  // Sync internal tab state with parent sub-tab
  useEffect(() => {
    if (activeSubTab && SUB_TAB_MAP[activeSubTab]) {
      setActiveTab(SUB_TAB_MAP[activeSubTab]);
    }
  }, [activeSubTab]);

  const tabs = [
    { id: 'home', label: 'Beranda', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'leads', label: 'Lead Board', icon: Target },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className={`flex ${hideSidebar ? '' : 'h-[calc(100vh-4rem)]'} bg-gray-50 h-full`}>
      {!hideSidebar && (
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">RM Portal</h2>
              <p className="text-xs text-gray-500">Sales & Relation</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as SalesTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${activeTab === tab.id ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon size={18} />{tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'home' && <RMHome />}
        {activeTab === 'portfolio' && <CustomerPortfolio />}
        {activeTab === 'pipeline' && <SalesPipeline />}
        {activeTab === 'leads' && <LeadBoard />}
        {activeTab === 'activity' && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Activity size={48} className="mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-600">Activity Log</h3>
                <p className="text-sm">Fitur pencatatan call & meeting akan segera hadir.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default SalesCloud;
