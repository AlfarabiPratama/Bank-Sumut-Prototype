import React, { useState } from 'react';
import { 
  Megaphone, 
  Briefcase, 
  Headphones, 
  LayoutDashboard,
  ChevronRight,
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Smartphone,
  ChevronDown,
  Shield
} from 'lucide-react';

export type CRMPillar = 'executive' | 'marketing' | 'sales' | 'service' | 'compliance';

// Sub-tabs for each pillar (except executive which doesn't need sub-tabs)
export const SUB_TABS: Record<CRMPillar, string[]> = {
  executive: [],
  marketing: ['Campaigns', 'Segments', 'Consent'],
  sales: ['Pipeline', 'Leads', 'Activity'],
  service: ['Tickets', 'SLA', 'Knowledge Base'],
  compliance: ['Audit Log', 'Roles', 'Config'],
};

interface CRMLayoutProps {
  children: React.ReactNode;
  activePillar: CRMPillar;
  onPillarChange: (pillar: CRMPillar) => void;
  activeSubTab?: string;
  onSubTabChange?: (subTab: string) => void;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  onViewChange?: (view: 'mobile' | 'crm' | 'rm-mobile' | 'admin-legacy') => void;
}

const PILLAR_CONFIG = {
  executive: {
    label: 'Executive',
    icon: LayoutDashboard,
    color: 'indigo',
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-500',
  },
  marketing: {
    label: 'Marketing',
    icon: Megaphone,
    color: 'orange',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-500',
  },
  sales: {
    label: 'Sales',
    icon: Briefcase,
    color: 'green',
    bgColor: 'bg-green-500',
    textColor: 'text-green-600',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  service: {
    label: 'Service',
    icon: Headphones,
    color: 'blue',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  compliance: {
    label: 'Compliance',
    icon: Shield,
    color: 'purple',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-500',
  },
};

const CRMLayout: React.FC<CRMLayoutProps> = ({
  children,
  activePillar,
  onPillarChange,
  activeSubTab,
  onSubTabChange,
  breadcrumbs = [],
  onViewChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const currentConfig = PILLAR_CONFIG[activePillar];
  const subTabs = SUB_TABS[activePillar];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}bank-sumut-logo.svg`} alt="Bank Sumut" className="h-8 w-auto" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-slate-900 leading-tight">CRM Bank Sumut</h1>
                <p className="text-[10px] text-gray-500 font-medium -mt-0.5">Platform Terintegrasi</p>
              </div>
            </div>
          </div>

          {/* Pillar Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(Object.keys(PILLAR_CONFIG) as CRMPillar[]).map((pillar) => {
              const config = PILLAR_CONFIG[pillar];
              const Icon = config.icon;
              const isActive = activePillar === pillar;
              
              return (
                <button
                  key={pillar}
                  onClick={() => onPillarChange(pillar)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${isActive 
                      ? `${config.bgColor} text-white shadow-md` 
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Global Search */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search customers, tickets..."
                className="pl-9 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sumut-blue/50"
              />
            </div>
            
            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
            </button>
            
          {/* User Avatar with View Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <div className="w-6 h-6 rounded-full bg-sumut-blue text-white flex items-center justify-center font-medium text-xs">
                  A
                </div>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              
              {isViewDropdownOpen && onViewChange && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Switch View</p>
                  </div>
                  <button
                    onClick={() => { onViewChange('mobile'); setIsViewDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <Smartphone size={16} /> Mobile App
                  </button>
                  <button
                    onClick={() => { onViewChange('rm-mobile'); setIsViewDropdownOpen(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <Smartphone size={16} /> RM Mobile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation (for pillars with sub-tabs) */}
        {subTabs.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onSubTabChange?.(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSubTab === tab
                    ? `${currentConfig.bgColor} text-white shadow-sm`
                    : `text-gray-600 hover:bg-white hover:shadow-sm`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Pillar Tabs */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 p-4 space-y-2 bg-white">
            {(Object.keys(PILLAR_CONFIG) as CRMPillar[]).map((pillar) => {
              const config = PILLAR_CONFIG[pillar];
              const Icon = config.icon;
              const isActive = activePillar === pillar;
              
              return (
                <button
                  key={pillar}
                  onClick={() => {
                    onPillarChange(pillar);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all
                    ${isActive 
                      ? `${config.bgColor} text-white` 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{config.label} Cloud</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-sm">
            <span className={`font-medium ${currentConfig.textColor}`}>
              {currentConfig.label}
            </span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight size={14} className="text-gray-400" />
                {crumb.onClick ? (
                  <button 
                    onClick={crumb.onClick}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export { PILLAR_CONFIG };
export default CRMLayout;
